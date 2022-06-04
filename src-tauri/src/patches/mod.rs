#[cfg(target_os = "macos")]
pub use crate::patches::macos_titlebar::*;

mod macos_titlebar;
