import { useDailyLife, useSelectedDateState } from '../../hooks';
import { getDailyLifeId, Score } from '../../models';
import { executeDailyLifeCommand } from '../../remotes';
import { ScoreSelect } from '../ScoreSelect';

export function DailyLifeEditor() {
  const { value: selectedDate } = useSelectedDateState();
  const id = getDailyLifeId(selectedDate);
  const { data: dailyLife } = useDailyLife(id);

  const updateScore = async (score: Score | undefined) => {
    if (dailyLife == null) {
      await executeDailyLifeCommand({
        name: 'DailyLifeCommand.Create',
        id,
        score,
        logs: [],
      });
    } else {
      await executeDailyLifeCommand({
        name: 'DailyLifeCommand.UpdateScore',
        id,
        score,
      });
    }
    await useDailyLife.refetch(id);
  };

  // const updateLogs = async (logs: DailyLog[]) => {
  //   if (dailyLife == null) {
  //     await executeDailyLifeCommand({
  //       name: 'DailyLifeCommand.Create',
  //       id,
  //       score: undefined,
  //       logs,
  //     });
  //   } else {
  //     await executeDailyLifeCommand({
  //       name: 'DailyLifeCommand.UpdateLogs',
  //       id,
  //       logs,
  //     });
  //   }
  //   await useDailyLife.refetch(id);
  // };

  return (
    <div>
      <ScoreSelect value={dailyLife?.score} onChange={updateScore} />
    </div>
  );
}
