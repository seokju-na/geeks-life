use nanoid::nanoid;
use std::fs::{create_dir_all, remove_dir_all};
use std::io;
use std::path::{Path, PathBuf};

#[derive(Debug)]
pub struct TempDir {
  path: PathBuf,
}

impl TempDir {
  pub fn new(prefix: &str) -> Result<Self, io::Error> {
    let path = Path::new(prefix).join(nanoid!());
    create_dir_all(&path)?;

    Ok(Self { path })
  }

  pub fn path(&self) -> &Path {
    self.path.as_path()
  }
}

impl AsRef<Path> for TempDir {
  fn as_ref(&self) -> &Path {
    self.path()
  }
}

impl Drop for TempDir {
  fn drop(&mut self) {
    let _ = remove_dir_all(self.path());
  }
}

#[cfg(test)]
mod tests {
  use crate::temp_dir::TempDir;
  use std::fs::read_dir;

  #[test]
  fn create_temp_dir_and_remove_when_dropped() {
    let temp = TempDir::new("test-fixtures").unwrap();
    let path = temp.path().to_owned();
    assert!(read_dir(&path).is_ok());
    drop(temp);
    assert!(read_dir(&path).is_err());
  }
}
