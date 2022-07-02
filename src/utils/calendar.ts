import { addDays, startOfWeek, toDate, startOfMonth, endOfWeek, endOfMonth, differenceInDays } from 'date-fns';
import { range } from './range';

export function getDaysOfWeekInCalendar(date: Date): Date[] {
  const start = normalizeDate(startOfWeek(date));

  return range(7).map(i => addDays(start, i));
}

export function getDaysOfMonthInCalendar(date: Date): Date[] {
  const start = normalizeDate(startOfWeek(startOfMonth(date)));
  const end = normalizeDate(endOfWeek(endOfMonth(date)));
  const diff = differenceInDays(end, start);

  return range(diff).map(i => addDays(start, i));
}

function normalizeDate(date: Date): Date {
  const cloned = toDate(date);
  cloned.setHours(0, 0, 0, 0);
  return cloned;
}
