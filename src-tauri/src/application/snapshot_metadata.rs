use geeks_event_sourcing::Version;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SnapshotMetadata<T> {
  pub id: String,
  pub version: Version,
  pub state: T,
}
