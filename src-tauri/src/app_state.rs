use std::path::{Path, PathBuf};
use tokio::sync::Mutex;

use crate::application::{Application, ApplicationError};

pub struct AppState {
  pub workspace_dir: PathBuf,
  pub application: Mutex<Application>,
}

impl AppState {
  pub async fn init(workspace_dir: &Path) -> Result<Self, ApplicationError> {
    let application = Application::init(workspace_dir).await?;

    Ok(Self {
      workspace_dir: workspace_dir.to_path_buf(),
      application: Mutex::new(application),
    })
  }
}
