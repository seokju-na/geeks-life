use std::path::{Path, PathBuf};

use geeks_event_sourcing::{AggregateRoot, Snapshot};
use geeks_event_sourcing_git::{commit_snapshot, GitEventstore};
use geeks_git::GitError;

use crate::application::{DailyLifeSnapshot, DailyLifeSnapshotError};
use crate::domain::{DailyLife, DailyLifeError};

#[derive(thiserror::Error, Debug)]
pub enum ApplicationError {
  #[error("daily life aggregate error: {0}")]
  DailyLife(#[from] DailyLifeError),

  #[error("daily life snapshot error: {0}")]
  DailyLifeSnapshot(#[from] DailyLifeSnapshotError),

  #[error("git eventstore error: {0}")]
  Git(#[from] GitError),
}

#[derive(Debug, Clone)]
pub struct Application {
  pub workspace_dir: PathBuf,
  pub daily_life: AggregateRoot<DailyLife>,
}

impl Application {
  pub async fn init(workspace_dir: &Path) -> Result<Self, ApplicationError> {
    // load aggregates
    let daily_life = Application::load_daily_life(workspace_dir).await?;

    // commit snapshot (if updated)
    commit_snapshot(workspace_dir)?;

    Ok(Self {
      workspace_dir: workspace_dir.to_path_buf(),
      daily_life,
    })
  }

  async fn load_daily_life(
    workspace_dir: &Path,
  ) -> Result<AggregateRoot<DailyLife>, ApplicationError> {
    let eventstore = GitEventstore::new(workspace_dir);
    let snapshot = DailyLifeSnapshot::new(workspace_dir);

    let mut root = snapshot.load().await?;
    let unsaved_events = eventstore.read_until_snapshot().await?;

    root.save_events(unsaved_events)?;
    snapshot.save(root.clone()).await?;

    Ok(root)
  }
}
