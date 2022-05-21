use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DailyLog {
  pub id: String,
  pub emoji: Option<String>,
  pub content: String,
}
