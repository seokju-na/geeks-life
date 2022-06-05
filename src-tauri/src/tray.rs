use tauri::{AppHandle, Manager, Runtime, SystemTray, SystemTrayEvent};

use crate::window::{WindowExtra, MAIN_WIN};

pub fn tray() -> SystemTray {
  SystemTray::new()
}

pub fn handle_tray<R>(app: &AppHandle<R>, event: SystemTrayEvent)
where
  R: Runtime,
{
  if let SystemTrayEvent::LeftClick { .. } = event {
    if let Some(win) = app.get_window(MAIN_WIN) {
      win.toggle().unwrap();
    }
  }
}
