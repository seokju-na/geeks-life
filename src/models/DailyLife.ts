import { parse, format } from 'date-fns';
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

const idPattern = 'yyyy-MM-dd';

export function getDailyLifeDate(life: DailyLife): Date {
  return parse(life.id, idPattern, new Date());
}

export function getDailyLifeId(date: Date): string {
  return format(date, idPattern);
}
