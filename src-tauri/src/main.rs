#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use std::error::Error;

use tauri::{ActivationPolicy, App, Runtime};

use crate::app_state::{setup_app_state, AppState};
use crate::commands::execute_daily_life_command;
use crate::tray::{handle_tray, tray};
use crate::window::setup_windows;
use crate::workspace::init_workspace;

mod app_state;
mod application;
mod commands;
mod domain;
mod patches;
mod tray;
mod utils;
mod window;
mod workspace;

fn setup<R>(app: &mut App<R>) -> Result<(), Box<dyn Error>>
where
  R: Runtime,
{
  // https://github.com/tauri-apps/tauri/discussions/2684#discussioncomment-1433069
  #[cfg(target_os = "macos")]
  app.set_activation_policy(ActivationPolicy::Accessory);

  setup_app_state(app);
  setup_windows(app);

  Ok(())
}

fn main() {
  tauri::Builder::default()
    .system_tray(tray())
    .on_system_tray_event(handle_tray)
    .setup(setup)
    .invoke_handler(tauri::generate_handler![execute_daily_life_command])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
