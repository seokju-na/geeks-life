use serde::{Deserialize, Serialize};
use serde_json::from_slice;
use tauri::PathResolver;
use tokio::fs::read;
use url::Url;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Emojis {
  github: Vec<Emoji>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Emoji {
  name: String,
  path: String,
}

impl Emojis {
  pub async fn init(path_resolver: &PathResolver) -> Emojis {
    let github = load_github_emojis(&path_resolver).await;

    Emojis { github }
  }
}

async fn load_github_emojis(path_resolver: &PathResolver) -> Vec<Emoji> {
  let data_path = path_resolver
    .resolve_resource("resources/emoji/github/data.json")
    .expect("fail to load github emoji resources");
  let data_raw = read(data_path)
    .await
    .expect("fail to read github emoji data");

  from_slice::<Vec<Emoji>>(&data_raw)
    .expect("fail to parse")
    .into_iter()
    .map(|emoji| {
      let filepath = path_resolver
        .resolve_resource(emoji.path)
        .expect("fail to load local path");
      let path = Url::from_file_path(filepath).unwrap();

      Emoji {
        name: emoji.name,
        path: path.to_string(),
      }
    })
    .collect()
}
