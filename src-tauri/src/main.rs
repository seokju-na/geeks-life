#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use std::error::Error;

use tauri::{App, Runtime};

use crate::app_state::{setup_app_state, AppState};
use crate::commands::{execute_daily_life_command, get_daily_life, get_daily_lifes};
use crate::global_shortcuts::setup_global_shortcuts;
use crate::tray::{handle_tray, tray};
use crate::windows::setup_windows;
use crate::workspace::init_workspace;

mod app_state;
mod application;
mod commands;
mod domain;
mod global_shortcuts;
mod patches;
mod tray;
mod utils;
mod windows;
mod workspace;

fn setup<R: Runtime>(app: &mut App<R>) -> Result<(), Box<dyn Error>> {
  // https://github.com/tauri-apps/tauri/discussions/2684#discussioncomment-1433069
  #[cfg(target_os = "macos")]
  app.set_activation_policy(tauri::ActivationPolicy::Accessory);

  setup_app_state(app);
  setup_windows(app);
  setup_global_shortcuts(app);

  Ok(())
}

fn main() {
  tauri::Builder::default()
    .plugin(tauri_plugin_store::PluginBuilder::default().build())
    .system_tray(tray())
    .on_system_tray_event(handle_tray)
    .setup(setup)
    .invoke_handler(tauri::generate_handler![
      execute_daily_life_command,
      get_daily_life,
      get_daily_lifes,
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
