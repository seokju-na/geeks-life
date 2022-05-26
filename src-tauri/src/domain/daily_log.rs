use serde::{Deserialize, Serialize};
use std::fmt::{Display, Formatter};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct DailyLog {
  pub id: String,
  pub emoji: Option<String>,
  pub content: String,
}

impl Display for DailyLog {
  fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
    write!(f, "{}", &self.content)
  }
}
