use serde::de::DeserializeOwned;
use serde_yaml::from_str;

pub fn parse_frontmatter<T>(text: &str) -> Result<T, serde_yaml::Error>
where
  T: DeserializeOwned,
{
  let frontmatter = find_frontmatter(text);
  from_str::<T>(&frontmatter)
}

fn find_frontmatter(text: &str) -> String {
  let splits: Vec<_> = text.split("---\n").into_iter().collect();
  let frontmatter = "---\n".to_string() + splits.get(1).unwrap_or(&"");

  frontmatter
}

#[cfg(test)]
mod tests {
  use super::*;

  use serde::{Deserialize, Serialize};

  #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
  struct Metadata {
    id: u64,
    data: Data,
  }

  #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
  struct Data {
    value: String,
  }

  #[test]
  fn parse() {
    let text = "\n---\nid: 1\ndata: {\"value\":\"Hello World\"}\n---\nThis is contents.";
    let metadata = parse_frontmatter::<Metadata>(text).unwrap();

    assert_eq!(
      metadata,
      Metadata {
        id: 1,
        data: Data {
          value: String::from("Hello World")
        }
      }
    );
  }
}
