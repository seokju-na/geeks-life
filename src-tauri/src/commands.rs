use geeks_git::GitError;
use serde::{Deserialize, Serialize};
use tauri::State;

use crate::application::{
  ApplicationError, CommandHandler, DailyLifeSnapshotError, GetDailyLifesParams, QueryHandler,
};
use crate::domain::{DailyLife, DailyLifeCommand, DailyLifeError};
use crate::AppState;

#[tauri::command]
pub async fn execute_daily_life_command(
  command: DailyLifeCommand,
  app_state: State<'_, AppState>,
) -> Result<(), CommandError> {
  let _ = app_state
    .application
    .lock()
    .await
    .handle_command(command)
    .await?;

  Ok(())
}

#[tauri::command]
pub async fn get_daily_life(
  id: String,
  app_state: State<'_, AppState>,
) -> Result<Option<DailyLife>, CommandError> {
  let result = app_state.application.lock().await.get_daily_life(id);
  Ok(result)
}

#[tauri::command]
pub async fn get_daily_lifes(
  params: GetDailyLifesParams,
  app_state: State<'_, AppState>,
) -> Result<Vec<DailyLife>, CommandError> {
  let result = app_state.application.lock().await.get_daily_lifes(params);
  Ok(result)
}

// TODO: how to remove this
#[derive(Debug, Serialize, Deserialize)]
pub struct CommandError {
  kind: String,
  name: String,
  message: Option<String>,
}

impl From<ApplicationError> for CommandError {
  fn from(e: ApplicationError) -> Self {
    match e {
      ApplicationError::DailyLifeSnapshot(e) => match e {
        DailyLifeSnapshotError::Io(e) => CommandError {
          kind: "DailyLifeSnapshotError".to_string(),
          name: "Io".to_string(),
          message: Some(e.to_string()),
        },
        DailyLifeSnapshotError::InvalidPath => CommandError {
          kind: "DailyLifeSnapshotError".to_string(),
          name: "InvalidPath".to_string(),
          message: None,
        },
        DailyLifeSnapshotError::ParseFail(e) => CommandError {
          kind: "DailyLifeSnapshotError".to_string(),
          name: "ParseFail".to_string(),
          message: Some(e.to_string()),
        },
      },
      ApplicationError::DailyLife(e) => match e {
        DailyLifeError::InvalidId => CommandError {
          kind: "DailyLifeError".to_string(),
          name: "InvalidId".to_string(),
          message: None,
        },
        DailyLifeError::AlreadyExists => CommandError {
          kind: "DailyLifeError".to_string(),
          name: "AlreadyExists".to_string(),
          message: None,
        },
        DailyLifeError::NotExists => CommandError {
          kind: "DailyLifeError".to_string(),
          name: "NotExists".to_string(),
          message: None,
        },
      },
      ApplicationError::Git(e) => match e {
        GitError::Io(e) => CommandError {
          kind: "GitError".to_string(),
          name: "Io".to_string(),
          message: Some(e.to_string()),
        },
        GitError::Git2(e) => CommandError {
          kind: "GitError".to_string(),
          name: "Git2".to_string(),
          message: Some(e.message().to_string()),
        },
        GitError::NoHead => CommandError {
          kind: "GitError".to_string(),
          name: "NoHead".to_string(),
          message: None,
        },
        GitError::Generic(e) => CommandError {
          kind: "GitError".to_string(),
          name: "Generic".to_string(),
          message: Some(e),
        },
      },
    }
  }
}
