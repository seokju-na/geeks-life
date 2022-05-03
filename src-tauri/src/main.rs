#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use std::error::Error;
use tauri::{
  App, AppHandle, CustomMenuItem, Manager, Runtime, SystemTray, SystemTrayEvent, SystemTrayMenu,
  WindowEvent,
};

fn tray() -> SystemTray {
  let open = CustomMenuItem::new("open".to_string(), "Open").accelerator("CmdOrCtrl+O");
  let quit = CustomMenuItem::new("quit".to_string(), "Quit").accelerator("CmdOrCtrl+Q");
  let menu = SystemTrayMenu::new().add_item(open).add_item(quit);

  SystemTray::new().with_menu(menu)
}

fn handle_tray<R>(app: &AppHandle<R>, event: SystemTrayEvent)
where
  R: Runtime,
{
  match event {
    SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
      "open" => {
        if let Some(win) = app.get_window("main") {
          win.show().unwrap();
          win.set_focus().unwrap();
        }
      }
      "quit" => {
        std::process::exit(0);
      }
      _ => {}
    },
    _ => {}
  }
}

fn setup<R>(app: &mut App<R>) -> Result<(), Box<dyn Error>>
where
  R: Runtime,
{
  if let Some(win) = app.get_window("main") {
    win.clone().on_window_event(move |event| match event {
      WindowEvent::Focused(focused) => {
        if win.is_visible().unwrap() && !*focused {
          win.hide().unwrap()
        }
      }
      _ => {}
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
