import { DailyScore } from '../../core/domain';

// colors from github
export const dailyScoreColorMap: Readonly<Record<DailyScore, string | undefined>> = {
  [DailyScore.None]: undefined,
  [DailyScore.Low]: '#9be9a8',
  [DailyScore.Medium]: '#40c463',
  [DailyScore.High]: '#30a14e',
  [DailyScore.Excellent]: '#216e39',
};
