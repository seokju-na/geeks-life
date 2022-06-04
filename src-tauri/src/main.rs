#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use std::error::Error;

use tauri::api::path::local_data_dir;
use tauri::{App, Manager, Runtime, WindowEvent};

use crate::app_state::AppState;
use crate::commands::execute_daily_life_command;
use crate::patches::TransparentTitlebar;
use crate::tray::{handle_tray, tray};
use crate::workspace::init_workspace;

mod app_state;
mod application;
mod commands;
mod domain;
mod patches;
mod tray;
mod utils;
mod workspace;

fn setup<R>(app: &mut App<R>) -> Result<(), Box<dyn Error>>
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

  let main_win = app.get_window("main").expect("cannot get main window");
  main_win.set_transparent_titlebar(true, true);
  main_win.clone().on_window_event(move |event| {
    if let WindowEvent::Focused(focused) = event {
      if main_win.is_visible().unwrap() && !(*focused) {
        main_win.hide().unwrap();
      }
    }
  });

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
