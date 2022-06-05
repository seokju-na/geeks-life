use tauri::{App, Manager, Result, Runtime, Window, WindowEvent};

#[cfg(target_os = "macos")]
use crate::patches::TransparentTitlebar;

pub const MAIN_WIN: &str = "main";

pub fn setup_windows<R>(app: &mut App<R>)
where
  R: Runtime,
{
  let main_win = app.get_window(MAIN_WIN).expect("cannot get main window");
  #[cfg(target_os = "macos")]
  main_win.set_transparent_titlebar(true, true);

  main_win.clone().on_window_event(move |event| {
    if let WindowEvent::Focused(focused) = event {
      if main_win.is_visible().unwrap() && !(*focused) {
        main_win.hide().unwrap();
      }
    }
  });
}

pub trait WindowExtra {
  fn toggle(&self) -> Result<()>;
}

impl<R> WindowExtra for Window<R>
where
  R: Runtime,
{
  fn toggle(&self) -> Result<()> {
    if self.is_visible()? {
      self.hide()?;
    } else {
      self.show()?;
      self.set_focus()?;
    }

    Ok(())
  }
}
