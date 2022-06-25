use std::collections::HashMap;
use std::path::{Path, PathBuf};

use async_trait::async_trait;
use geeks_event_sourcing::{AggregateRoot, Snapshot, Version};
use regex::Regex;
use serde_yaml::to_string;
use tokio::fs::{create_dir_all, read_to_string, write};
use tokio::io;
use walkdir::WalkDir;

use crate::application::SnapshotMetadata;
use crate::domain::DailyLife;
use crate::utils::parse_frontmatter;

#[derive(Clone, Debug)]
pub struct DailyLifeSnapshot {
  workspace_dir: PathBuf,
}

#[derive(thiserror::Error, Debug)]
pub enum DailyLifeSnapshotError {
  #[error("io error: {0}")]
  Io(#[from] io::Error),

  #[error("invalid path")]
  InvalidPath,

  #[error("parse fail: {0}")]
  ParseFail(#[from] serde_yaml::Error),
}

impl DailyLifeSnapshot {
  pub fn new(workspace_dir: &Path) -> Self {
    Self {
      workspace_dir: workspace_dir.to_path_buf(),
    }
  }
}

#[async_trait]
impl Snapshot<DailyLife> for DailyLifeSnapshot {
  type Error = DailyLifeSnapshotError;

  async fn load(&self) -> Result<AggregateRoot<DailyLife>, Self::Error> {
    let files = DailyLifeFile::from_dir(&self.workspace_dir).await?;
    let mut states: HashMap<String, DailyLife> = HashMap::with_capacity(100);
    let mut versions: HashMap<String, Version> = HashMap::with_capacity(100);

    for file in files {
      let metadata = file.parse().await?;
      states.insert(metadata.id.to_owned(), metadata.state);
      versions.insert(metadata.id.to_owned(), metadata.version);
    }

    Ok(AggregateRoot::new(states, versions))
  }

  async fn save(&self, root: AggregateRoot<DailyLife>) -> Result<(), Self::Error> {
    for (id, state) in root.states {
      let file = DailyLifeFile::new(&state, &self.workspace_dir);
      let version = root.versions.get(&id).cloned().unwrap();
      file.save(state, version).await?;
    }
    Ok(())
  }
}

#[derive(Debug, PartialEq)]
struct DailyLifeFile {
  dir: PathBuf,
  file_path: PathBuf,
}

impl DailyLifeFile {
  pub fn new(state: &DailyLife, dir_path: &Path) -> Self {
    let date = state.date();
    let dir = date.format("%Y/%m").to_string();
    let file_path = date.format("%Y/%m/%d.md").to_string();

    Self {
      dir: dir_path.join(dir),
      file_path: dir_path.join(file_path),
    }
  }

  /// get file from path.
  pub fn from_path(path: &Path) -> Result<Self, DailyLifeSnapshotError> {
    let re = Regex::new(r"(\d{4})[/|\\](\d{2})[/|\\](\d{2})\.md$").unwrap();
    let path_str = path.to_str().unwrap_or("");

    match re.captures(path_str) {
      Some(_) => Ok(Self {
        dir: path.parent().unwrap().to_path_buf(),
        file_path: path.to_path_buf(),
      }),
      None => Err(DailyLifeSnapshotError::InvalidPath),
    }
  }

  /// get all files from directory path.
  pub async fn from_dir(dir_path: &Path) -> Result<Vec<Self>, DailyLifeSnapshotError> {
    let paths: Vec<_> = WalkDir::new(&dir_path)
      .into_iter()
      .filter_map(|x| x.ok())
      .map(|entry| DailyLifeFile::from_path(entry.path()))
      .filter_map(|x| x.ok())
      .collect();

    Ok(paths)
  }

  /// parse file to serialize aggregate state.
  pub async fn parse(&self) -> Result<SnapshotMetadata<DailyLife>, DailyLifeSnapshotError> {
    let raw = read_to_string(&self.file_path).await?;
    let metadata = parse_frontmatter::<SnapshotMetadata<DailyLife>>(&raw)?;

    Ok(metadata)
  }

  pub async fn save(
    &self,
    state: DailyLife,
    version: Version,
  ) -> Result<(), DailyLifeSnapshotError> {
    let data = SnapshotMetadata {
      id: state.id.to_owned(),
      version,
      state,
    };
    let contents = format!(
      r#"{frontmatter}---

## Score
{score}

## Logs
{logs}
"#,
      frontmatter = to_string(&data).unwrap(),
      score = match data.state.score {
        Some(x) => x.to_string(),
        None => "-".to_string(),
      },
      logs = data
        .state
        .logs
        .into_iter()
        .map(|log| format!("- {x}", x = log))
        .collect::<Vec<_>>()
        .join("\n")
    );

    create_dir_all(&self.dir).await.unwrap_or(());
    write(&self.file_path, contents).await?;
    Ok(())
  }
}

#[cfg(test)]
mod tests {
  use chrono::Utc;
  use testing::TempDir;
  use tokio::fs::{create_dir_all, write};

  use crate::domain::{DailyLog, Score};

  use super::*;

  #[tokio::test]
  async fn read_files_from_dir() {
    let dir = TempDir::new("test-fixtures").unwrap();
    create_dir_all(dir.path().join("2022/04")).await.unwrap();
    write(dir.path().join("2022/04/22.md"), "content")
      .await
      .unwrap();
    write(dir.path().join("README.md"), "hello").await.unwrap();

    let files = DailyLifeFile::from_dir(dir.path()).await.unwrap();
    assert_eq!(
      files[0],
      DailyLifeFile {
        dir: dir.path().join("2022/04"),
        file_path: dir.path().join("2022/04/22.md"),
      }
    );
  }

  #[tokio::test]
  async fn save_and_parse_file() {
    let dir = TempDir::new("test-fixtures").unwrap();
    let timestamp = Utc::now().timestamp();
    let state = DailyLife {
      id: "2022-04-22".to_string(),
      score: Some(Score::Excellent),
      logs: vec![
        DailyLog {
          id: "log1".to_string(),
          content: "content1".to_string(),
        },
        DailyLog {
          id: "log2".to_string(),
          content: "content2".to_string(),
        },
      ],
      created_at: timestamp,
      updated_at: timestamp,
    };
    let file = DailyLifeFile::new(&state, dir.path());
    file.save(state.clone(), 1).await.unwrap();
    let parsed = file.parse().await.unwrap();
    assert_eq!(parsed.id, "2022-04-22");
    assert_eq!(parsed.version, 1);
    assert_eq!(parsed.state, state);
  }
}
