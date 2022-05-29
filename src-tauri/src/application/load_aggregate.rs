use geeks_event_sourcing::{Aggregate, AggregateRoot, Snapshot};
use geeks_event_sourcing_git::GitEventstore;
use geeks_git::GitError;
use serde::de::DeserializeOwned;
use serde::Serialize;

#[derive(thiserror::Error, Debug)]
pub enum LoadAggregateError<AE, SE> {
  #[error("aggregate error: {0}")]
  Aggregate(#[source] AE),

  #[error("snapshot error: {0}")]
  Snapshot(#[source] SE),

  #[error("eventstore error: {0}")]
  Eventstore(#[source] GitError),
}

pub async fn load_aggregate<T, S>(
  eventstore: GitEventstore<T::Event>,
  snapshot: S,
) -> Result<AggregateRoot<T>, LoadAggregateError<T::Error, S::Error>>
where
  T: Aggregate,
  T::Event: Serialize + DeserializeOwned,
  S: Snapshot<T>,
{
  let mut root = snapshot
    .load()
    .await
    .map_err(LoadAggregateError::Snapshot)?;
  let mut unsaved_events = eventstore
    .read_until_snapshot()
    .await
    .map_err(LoadAggregateError::Eventstore)?;
  unsaved_events.reverse();

  root
    .save_events(unsaved_events)
    .map_err(LoadAggregateError::Aggregate)?;
  snapshot
    .save(root.clone())
    .await
    .map_err(LoadAggregateError::Snapshot)?;

  Ok(root)
}
