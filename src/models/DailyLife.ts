import { parse } from 'date-fns';
import { DailyLog } from './DailyLog';
import { Score } from './Score';

export interface DailyLife {
  /** yyyy-MM-dd */
  id: string;
  score?: Score;
  logs: DailyLog[];
  createdAt: number;
  updatedAt: number;
}

export function getDailyLifeDate(life: DailyLife): Date {
  return parse(life.id, 'yyyy-MM-dd', new Date());
}
