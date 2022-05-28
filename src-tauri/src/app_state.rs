use std::path::{Path, PathBuf};

use geeks_event_sourcing::AggregateRoot;
use geeks_event_sourcing_git::{commit_snapshot, GitEventstore};

use crate::application::{load_aggregate, DailyLifeSnapshot};
use crate::domain::DailyLife;

pub struct AppState {
  pub workspace_dir: PathBuf,
  pub daily_life: AggregateRoot<DailyLife>,
}

impl AppState {
  pub async fn init(workspace_dir: &Path) -> Self {
    // load aggregates
    let daily_life = load_aggregate(
      GitEventstore::new(workspace_dir),
      DailyLifeSnapshot::new(workspace_dir),
    )
    .await
    .expect("fail to load \"DailyLife\" aggregate");

    // commit snapshot (if updated)
    commit_snapshot(workspace_dir).expect("fail to commit snapshot");

    Self {
      workspace_dir: workspace_dir.to_path_buf(),
      daily_life,
    }
  }
}
