#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use std::error::Error;

use tauri::{App, Manager, Runtime, WindowEvent};

use crate::tray::{handle_tray, tray};

mod domain;
mod tray;

fn setup<R>(app: &mut App<R>) -> Result<(), Box<dyn Error>>
where
  R: Runtime,
{
  if let Some(win) = app.get_window("main") {
    win.clone().on_window_event(move |event| {
      if let WindowEvent::Focused(focused) = event {
        if win.is_visible().unwrap() && !(*focused) {
          win.hide().unwrap()
        }
      }
    })
  }

  Ok(())
}

fn main() {
  tauri::Builder::default()
    .system_tray(tray())
    .on_system_tray_event(handle_tray)
    .setup(setup)
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
