use tauri::{
  AppHandle, CustomMenuItem, Manager, Runtime, SystemTray, SystemTrayEvent, SystemTrayMenu,
};

pub fn tray() -> SystemTray {
  let open = CustomMenuItem::new("open".to_string(), "Open").accelerator("CmdOrCtrl+O");
  let quit = CustomMenuItem::new("quit".to_string(), "Quit").accelerator("CmdOrCtrl+Q");
  let menu = SystemTrayMenu::new().add_item(open).add_item(quit);

  SystemTray::new().with_menu(menu)
}

pub fn handle_tray<R>(app: &AppHandle<R>, event: SystemTrayEvent)
where
  R: Runtime,
{
  if let SystemTrayEvent::MenuItemClick { id, .. } = event {
    match id.as_str() {
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
    }
  }
}
