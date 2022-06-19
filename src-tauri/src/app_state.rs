use std::path::PathBuf;

use tauri::async_runtime::{block_on, Mutex};
use tauri::{App, Manager, PathResolver, Runtime};

use crate::application::{Application, ApplicationError};
use crate::emojis::Emojis;
use crate::init_workspace;

pub struct AppState {
  pub workspace_dir: PathBuf,
  pub application: Mutex<Application>,
  pub emojis: Emojis,
}

impl AppState {
  pub async fn init(path_resolver: PathResolver) -> Result<Self, ApplicationError> {
    let app_dir = path_resolver.app_dir().expect("fail to resolve app dir");
    let workspace_dir = init_workspace(&app_dir);

    let application = Application::init(&workspace_dir).await?;
    let emojis = Emojis::init(&path_resolver).await;

    Ok(Self {
      workspace_dir: workspace_dir.to_path_buf(),
      application: Mutex::new(application),
      emojis,
    })
  }
}

pub fn setup_app_state<R: Runtime>(app: &mut App<R>) {
  let app_state = block_on(AppState::init(app.path_resolver())).expect("fail to init app state");
  app.manage(app_state);
}
