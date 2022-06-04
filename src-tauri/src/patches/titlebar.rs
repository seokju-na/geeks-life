#[cfg(target_os = "macos")]
use cocoa::appkit::{NSWindow, NSWindowStyleMask, NSWindowTitleVisibility};
use tauri::{Runtime, Window};

// sources from https://github.com/tauri-apps/tauri/issues/2663#issuecomment-1123696703

pub trait TransparentTitlebar {
  fn set_transparent_titlebar(&self, title_transparent: bool, remove_toolbar: bool);
}

impl<R: Runtime> TransparentTitlebar for Window<R> {
  fn set_transparent_titlebar(&self, title_transparent: bool, remove_tool_bar: bool) {
    if !cfg!(target_os = "macos") {
      return;
    }

    unsafe {
      let id = self.ns_window().unwrap() as cocoa::base::id;
      NSWindow::setTitlebarAppearsTransparent_(id, cocoa::base::YES);
      let mut style_mask = id.styleMask();
      style_mask.set(
        NSWindowStyleMask::NSFullSizeContentViewWindowMask,
        title_transparent,
      );

      if remove_tool_bar {
        style_mask.remove(
          NSWindowStyleMask::NSClosableWindowMask
            | NSWindowStyleMask::NSMiniaturizableWindowMask
            | NSWindowStyleMask::NSResizableWindowMask,
        );
      }

      id.setStyleMask_(style_mask);

      id.setTitleVisibility_(if title_transparent {
        NSWindowTitleVisibility::NSWindowTitleHidden
      } else {
        NSWindowTitleVisibility::NSWindowTitleVisible
      });

      id.setTitlebarAppearsTransparent_(if title_transparent {
        cocoa::base::YES
      } else {
        cocoa::base::NO
      });
    }
  }
}
