use std::path::{Path, PathBuf};

use geeks_git::commit;
use git2::Repository;

#[cfg(debug_assertions)]
const WORKSPACE_NAME: &str = "geeks-life-dev";
#[cfg(not(debug_assertions))]
const WORKSPACE_NAME: &str = "geeks-life";

pub fn init_workspace(local_data_dir: &Path) -> PathBuf {
  let workspace_dir = local_data_dir.join(WORKSPACE_NAME);

  if Repository::open(&workspace_dir).is_err() {
    Repository::init(&workspace_dir).expect("fail to initialize git");
    commit(&workspace_dir, "initial").expect("fail to initial commit");
  }

  workspace_dir
}

#[cfg(test)]
mod tests {
  use std::path::Path;

  use geeks_git::CommitReader;
  use git2::Repository;
  use run_script::run_script;

  use super::*;

  #[test]
  fn workspace_not_exists() {
    run_script!("mkdir -p test-fixtures/").unwrap();
    let workspace_dir = init_workspace(Path::new("./test-fixtures"));

    let repo = Repository::open(&workspace_dir);
    assert!(repo.is_ok());
    let commits: Vec<_> = CommitReader::new(&repo.unwrap())
      .unwrap()
      .flatten()
      .collect();
    assert_eq!(commits.len(), 1);
    assert_eq!(commits[0].message, "initial".into());
    assert_eq!(workspace_dir, Path::new("./test-fixtures/geeks-life-dev"));

    run_script!("rm -rf test-fixtures/").unwrap();
  }
}
