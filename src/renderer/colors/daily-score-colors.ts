import { DailyScoreLevels } from '../../core/domain';

// colors from github
export const dailyScoreColorMap: Readonly<Record<DailyScoreLevels, string | undefined>> = {
  [DailyScoreLevels.None]: undefined,
  [DailyScoreLevels.Low]: '#9be9a8',
  [DailyScoreLevels.Medium]: '#40c463',
  [DailyScoreLevels.High]: '#30a14e',
  [DailyScoreLevels.Excellent]: '#216e39',
};
