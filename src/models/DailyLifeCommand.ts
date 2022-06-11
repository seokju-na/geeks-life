import { Score } from './Score';
import { DailyLog } from './DailyLog';

type Command = 'Create' | 'UpdateScore' | 'UpdateLogs';
type CommandName = `DailyLifeCommand.${Command}`;

interface Base {
  name: CommandName;
}

interface CreateCommand extends Base {
  name: 'DailyLifeCommand.Create';
  id: string;
  score?: Score;
  logs: DailyLog[];
}

interface UpdateScoreCommand extends Base {
  name: 'DailyLifeCommand.UpdateScore';
  id: string;
  score?: Score;
}

interface UpdateLogsCommand extends Base {
  name: 'DailyLifeCommand.UpdateLogs';
  id: string;
  logs: DailyLog[];
}

export type DailyLifeCommand = CreateCommand | UpdateScoreCommand | UpdateLogsCommand;
