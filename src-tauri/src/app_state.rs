use std::path::{Path, PathBuf};

use tauri::api::path::local_data_dir;
use tauri::{App, Manager, Runtime};
use tokio::sync::Mutex;

use crate::application::{Application, ApplicationError};
use crate::init_workspace;

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

pub fn setup_app_state<R>(app: &mut App<R>)
where
  R: Runtime,
{
  let handle = app.handle();
  let workspace_dir = init_workspace(&local_data_dir().unwrap());

  tauri::async_runtime::spawn(async move {
    let app_state = AppState::init(&workspace_dir)
      .await
      .expect("fail to init app state");
    handle.manage(app_state);
  });
}
