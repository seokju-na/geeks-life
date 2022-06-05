use tauri::{App, GlobalShortcutManager, Runtime};

use crate::windows::{AppExtra, WindowExtra};

pub fn setup_global_shortcuts<R>(app: &mut App<R>)
where
  R: Runtime,
{
  let main_win = app.get_main_window();

  app
    .global_shortcut_manager()
    .register("CmdOrCtrl+Shift+L", move || {
      main_win.toggle().unwrap();
    })
    .expect("fail to register global shortcut");
}
