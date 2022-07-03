use tauri::{AppHandle, Runtime, SystemTray, SystemTrayEvent};

use crate::windows::{AppExtra, WindowExtra};

pub fn tray() -> SystemTray {
  SystemTray::new()
}

pub fn handle_tray<R: Runtime>(app: &AppHandle<R>, event: SystemTrayEvent) {
  if let SystemTrayEvent::LeftClick { .. } = event {
    app.get_main_window().toggle().unwrap();
  }
}
