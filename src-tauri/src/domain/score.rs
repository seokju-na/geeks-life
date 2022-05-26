use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub enum Score {
  #[serde(rename = "low")]
  Low,
  #[serde(rename = "medium")]
  Medium,
  #[serde(rename = "high")]
  High,
  #[serde(rename = "excellent")]
  Excellent,
}

impl ToString for Score {
  fn to_string(&self) -> String {
    let str = match self {
      Score::Low => "low",
      Score::Medium => "medium",
      Score::High => "high",
      Score::Excellent => "excellent",
    };
    String::from(str)
  }
}

#[cfg(test)]
mod tests {
  use serde_json::{from_str, to_string};

  use super::*;

  #[test]
  fn serialize() {
    assert_eq!(to_string(&Score::Low).unwrap(), "\"low\"");
    assert_eq!(to_string(&Score::Medium).unwrap(), "\"medium\"");
    assert_eq!(to_string(&Score::High).unwrap(), "\"high\"");
    assert_eq!(to_string(&Score::Excellent).unwrap(), "\"excellent\"");
  }

  #[test]
  fn deserialize() {
    assert_eq!(from_str::<Score>("\"low\"").unwrap(), Score::Low);
    assert_eq!(from_str::<Score>("\"medium\"").unwrap(), Score::Medium);
    assert_eq!(from_str::<Score>("\"high\"").unwrap(), Score::High);
    assert_eq!(
      from_str::<Score>("\"excellent\"").unwrap(),
      Score::Excellent
    );
  }
}
