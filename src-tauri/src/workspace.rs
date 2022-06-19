use std::path::{Path, PathBuf};

use geeks_git::commit;
use git2::Repository;

pub fn init_workspace(app_dir: &Path) -> PathBuf {
  let workspace_dir = app_dir.join("workspace");

  if Repository::open(&workspace_dir).is_err() {
    Repository::init(&workspace_dir).expect("fail to initialize git");
    commit(&workspace_dir, "initial").expect("fail to initial commit");
  }

  workspace_dir
}

#[cfg(test)]
mod tests {
  use geeks_git::CommitReader;
  use git2::Repository;

  use testing::TempDir;

  use super::*;

  #[test]
  fn workspace_not_exists() {
    let dir = TempDir::new("test-fixtures").unwrap();
    let workspace_dir = init_workspace(dir.path());

    let repo = Repository::open(&workspace_dir);
    assert!(repo.is_ok());
    let commits: Vec<_> = CommitReader::new(&repo.unwrap())
      .unwrap()
      .flatten()
      .collect();
    assert_eq!(commits.len(), 1);
    assert_eq!(commits[0].message, "initial".into());
    assert_eq!(workspace_dir, dir.path().join("workspace"));
  }
}
