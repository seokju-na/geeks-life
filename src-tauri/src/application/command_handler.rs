use async_trait::async_trait;
use geeks_event_sourcing::{Command, Eventstore};
use geeks_event_sourcing_git::GitEventstore;

use crate::application::{Application, ApplicationError};
use crate::domain::DailyLifeCommand;

#[async_trait]
pub trait CommandHandler<T>
where
  T: Command,
{
  async fn handle_command(&mut self, command: T) -> Result<(), ApplicationError>;
}

#[async_trait]
impl CommandHandler<DailyLifeCommand> for Application {
  async fn handle_command(&mut self, command: DailyLifeCommand) -> Result<(), ApplicationError> {
    let event = self.daily_life.execute_command(command)?;
    let eventstore = GitEventstore::new(&self.workspace_dir);
    eventstore.append(vec![event]).await?;

    Ok(())
  }
}
