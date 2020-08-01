import { CommitDailyLifeErrorCode, createEnumKeyFind, dateFormattings } from '../../core';
import { createUniqueId, DailyLife, DailyLogCategory, DailyScore, Emoji } from '../../core/domain';

export enum DateDisplayType {
  Weekly = 'weekly',
  Monthly = 'monthly',
}

export const dateDisplayTypes = Object.values(DateDisplayType);

export const getDateDisplayTypeName = createEnumKeyFind(DateDisplayType);

export interface State {
  dateDisplayType: DateDisplayType;
  date: string;
  modifiedAtDate: boolean | null;
  weeklyLives: Array<DailyLife | null> | null;
  monthlyLives: Array<Array<DailyLife | null>> | null;
  committing: boolean;
  commitErrorCode: CommitDailyLifeErrorCode | null;
  emojis: Emoji[];
  dailyLogCategories: DailyLogCategory[];
}

export function createDailyLifeAt(date: string): DailyLife {
  return {
    id: createUniqueId(),
    date,
    score: DailyScore.None,
    logs: [],
  };
}

// TODO: get initial state from storage (can save for next)
export const initialState: Readonly<State> = {
  dateDisplayType: DateDisplayType.Weekly,
  date: dateFormattings['yyyy-MM-dd'](new Date()),
  modifiedAtDate: null,
  weeklyLives: null,
  monthlyLives: null,
  committing: false,
  commitErrorCode: null,
  emojis: [],
  dailyLogCategories: [],
};
