export enum DailyScoreLevels {
  None,
  Low,
  Medium,
  High,
  Excellent,
}

export interface DailyScore {
  id: string;
  level: DailyScoreLevels;
}
