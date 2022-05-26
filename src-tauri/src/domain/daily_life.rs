use chrono::{DateTime, NaiveDateTime, Utc};
use geeks_event_sourcing::{Aggregate, Command, Event};
use serde::{Deserialize, Serialize};

use crate::domain::{DailyLog, Score};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct DailyLife {
  /// %Y-%m-%d formatted.
  /// example: '2022-05-21'
  pub id: String,
  pub score: Option<Score>,
  pub logs: Vec<DailyLog>,
  pub created_at: i64,
  pub updated_at: i64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "name")]
pub enum DailyLifeEvent {
  #[serde(rename = "DailyLifeEvent.Created")]
  Created {
    id: String,
    score: Option<Score>,
    logs: Vec<DailyLog>,
  },
  #[serde(rename = "DailyLifeEvent.ScoreUpdated")]
  ScoreUpdated { score: Option<Score> },
  #[serde(rename = "DailyLifeEvent.LogsUpdated")]
  LogsUpdated { logs: Vec<DailyLog> },
}

impl Event for DailyLifeEvent {
  fn name(&self) -> &'static str {
    match self {
      DailyLifeEvent::Created { .. } => "DailyLifeEvent.Created",
      DailyLifeEvent::ScoreUpdated { .. } => "DailyLifeEvent.ScoreUpdated",
      DailyLifeEvent::LogsUpdated { .. } => "DailyLifeEvent.LogsUpdated",
    }
  }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "name")]
pub enum DailyLifeCommand {
  #[serde(rename = "DailyLifeCommand.Create")]
  Create {
    id: String,
    score: Option<Score>,
    logs: Vec<DailyLog>,
  },
  #[serde(rename = "DailyLifeCommand.UpdateScore")]
  UpdateScore { id: String, score: Option<Score> },
  #[serde(rename = "DailyLifeCommand.UpdateLogs")]
  UpdateLogs { id: String, logs: Vec<DailyLog> },
}

impl Command for DailyLifeCommand {
  fn name(&self) -> &'static str {
    match self {
      DailyLifeCommand::Create { .. } => "DailyLifeCommand.Create",
      DailyLifeCommand::UpdateScore { .. } => "DailyLifeCommand.UpdateScore",
      DailyLifeCommand::UpdateLogs { .. } => "DailyLifeCommand.UpdateLogs",
    }
  }

  fn aggregate_id(&self) -> &str {
    match self {
      DailyLifeCommand::Create { id, .. } => id,
      DailyLifeCommand::UpdateScore { id, .. } => id,
      DailyLifeCommand::UpdateLogs { id, .. } => id,
    }
  }
}

#[derive(thiserror::Error, Debug, PartialEq, Eq, Clone)]
pub enum DailyLifeError {
  #[error("invalid id. id format must be \"yyyy-MM-dd\"")]
  InvalidId,
  #[error("daily life already exists")]
  AlreadyExists,
  #[error("daily life not exists")]
  NotExists,
}

impl DailyLife {
  pub fn date(&self) -> DateTime<Utc> {
    let date_str = format!("{}T00:00:00Z", &self.id);
    date_str.parse::<DateTime<Utc>>().unwrap()
  }
}

impl Aggregate for DailyLife {
  type Command = DailyLifeCommand;
  type Event = DailyLifeEvent;
  type Error = DailyLifeError;

  fn id(&self) -> &str {
    &self.id
  }

  fn handle_command(
    this: Option<&Self>,
    command: Self::Command,
  ) -> Result<Self::Event, Self::Error> {
    match this {
      Some(_) => match command {
        DailyLifeCommand::UpdateScore { score, .. } => Ok(DailyLifeEvent::ScoreUpdated { score }),
        DailyLifeCommand::UpdateLogs { logs, .. } => Ok(DailyLifeEvent::LogsUpdated { logs }),
        _ => Err(DailyLifeError::NotExists),
      },
      None => match command {
        DailyLifeCommand::Create { id, score, logs } => {
          let date_str = format!("{}T00:00:00Z", &id);
          if NaiveDateTime::parse_from_str(&date_str, "%Y-%m-%dT%H:%M:%SZ").is_err() {
            return Err(DailyLifeError::InvalidId);
          }

          Ok(DailyLifeEvent::Created { id, score, logs })
        }
        _ => Err(DailyLifeError::AlreadyExists),
      },
    }
  }

  fn apply_event(this: Option<Self>, event: Self::Event) -> Result<Self, Self::Error> {
    let timestamp = Utc::now().timestamp();

    match this {
      Some(mut life) => match event {
        DailyLifeEvent::ScoreUpdated { score } => {
          life.score = score;
          life.updated_at = timestamp;
          Ok(life)
        }
        DailyLifeEvent::LogsUpdated { logs } => {
          life.logs = logs;
          life.updated_at = timestamp;
          Ok(life)
        }
        _ => Err(DailyLifeError::NotExists),
      },
      None => match event {
        DailyLifeEvent::Created { id, score, logs } => Ok(DailyLife {
          id,
          score,
          logs,
          created_at: timestamp,
          updated_at: timestamp,
        }),
        _ => Err(DailyLifeError::AlreadyExists),
      },
    }
  }
}

#[cfg(test)]
mod tests {
  use geeks_event_sourcing::AggregateRoot;

  use super::*;

  fn parse_date(date_str: &str) -> DateTime<Utc> {
    date_str.parse::<DateTime<Utc>>().unwrap()
  }

  #[test]
  fn create() {
    let mut root = AggregateRoot::<DailyLife>::default();
    let command = DailyLifeCommand::Create {
      id: "2022-05-21".to_string(),
      score: None,
      logs: vec![],
    };
    root.execute_command(command).unwrap();
    let state = root.get_state("2022-05-21").unwrap();
    assert_eq!(state.id, "2022-05-21");
    assert_eq!(state.score, None);
    assert!(state.logs.is_empty());
    assert_eq!(state.date(), parse_date("2022-05-21T00:00:00Z"));
  }

  #[test]
  fn update_score() {
    let mut root = AggregateRoot::<DailyLife>::default();
    root
      .execute_command(DailyLifeCommand::Create {
        id: "2022-05-21".to_string(),
        score: None,
        logs: vec![],
      })
      .unwrap();
    let state = root.get_state("2022-05-21").unwrap();
    assert_eq!(state.score, None);

    root
      .execute_command(DailyLifeCommand::UpdateScore {
        id: "2022-05-21".to_string(),
        score: Some(Score::Excellent),
      })
      .unwrap();

    let state = root.get_state("2022-05-21").unwrap();
    assert_eq!(state.score, Some(Score::Excellent));
  }

  #[test]
  fn update_logs() {
    let mut root = AggregateRoot::<DailyLife>::default();
    root
      .execute_command(DailyLifeCommand::Create {
        id: "2022-05-21".to_string(),
        score: None,
        logs: vec![],
      })
      .unwrap();
    let state = root.get_state("2022-05-21").unwrap();
    assert!(state.logs.is_empty());

    root
      .execute_command(DailyLifeCommand::UpdateLogs {
        id: "2022-05-21".to_string(),
        logs: vec![DailyLog {
          id: "log1".to_string(),
          emoji: None,
          content: "coding".to_string(),
        }],
      })
      .unwrap();

    let state = root.get_state("2022-05-21").unwrap();
    assert_eq!(state.logs.len(), 1);
    assert_eq!(state.logs[0].id, "log1");
  }

  #[test]
  fn invalid_id_error() {
    let mut root = AggregateRoot::<DailyLife>::default();
    let command = DailyLifeCommand::Create {
      id: "some id".to_string(),
      score: None,
      logs: vec![],
    };
    assert_eq!(
      root.execute_command(command).unwrap_err(),
      DailyLifeError::InvalidId
    );
  }
}
