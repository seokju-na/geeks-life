use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

use crate::application::Application;
use crate::domain::DailyLife;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GetDailyLifesParams {
  start: Option<String>,
  end: Option<String>,
}

pub trait QueryHandler {
  fn get_daily_lifes(&self, params: GetDailyLifesParams) -> Vec<DailyLife>;
}

impl QueryHandler for Application {
  fn get_daily_lifes(&self, params: GetDailyLifesParams) -> Vec<DailyLife> {
    let start = params.start.map(|x| x.parse::<DateTime<Utc>>());
    let end = params.end.map(|x| x.parse::<DateTime<Utc>>());
    let result: Vec<_> = self
      .daily_life
      .states
      .values()
      .filter(|state| {
        let date = state.date();
        if let Some(Ok(s)) = start {
          if date < s {
            return false;
          }
        }
        if let Some(Ok(e)) = end {
          if date > e {
            return false;
          }
        }

        true
      })
      .cloned()
      .collect();

    result
  }
}
