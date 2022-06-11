import { addDays, startOfWeek, toDate } from 'date-fns';
import { range } from './range';

type Week = [Date, Date, Date, Date, Date, Date, Date];

export function getWeek(date: Date): Week {
  const start = normalizeDate(startOfWeek(date));

  return range(7).map(i => addDays(start, i)) as Week;
}

function normalizeDate(date: Date): Date {
  const cloned = toDate(date);
  cloned.setHours(0, 0, 0, 0);
  return cloned;
}
