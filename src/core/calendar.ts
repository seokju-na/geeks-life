import {
  addDays,
  differenceInDays,
  format,
  getWeekOfMonth,
  isSameMonth,
  lastDayOfMonth,
  startOfMonth,
  subDays,
} from 'date-fns';

export function normalizeCalendarDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0);
}

export function cloneDate(date: Date) {
  return new Date(date.getTime());
}

export interface CalendarDay {
  type: 'day';
  date: Date;
  isOutsideDay: boolean;
}

export interface CalendarWeek {
  type: 'week';
  days: CalendarDay[];
}

export interface CalendarMonth {
  type: 'month';
  weeks: CalendarWeek[];
}

export const isCalendarWeek = (value: unknown): value is CalendarWeek =>
  typeof value === 'object' && value != null && (value as CalendarWeek).type === 'week';

export const isCalendarMonth = (value: unknown): value is CalendarMonth =>
  typeof value === 'object' && value != null && (value as CalendarMonth).type === 'month';

function getMonthKey(month: Date) {
  return format(month, 'yyyy-MM');
}

const memoizedMonthWeeks = new Map<string, CalendarMonth>();

export function getCalendarMonth(date: Date): CalendarMonth {
  const memoKey = getMonthKey(date);

  if (memoizedMonthWeeks.has(memoKey)) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return memoizedMonthWeeks.get(memoKey)!;
  }

  // set utc offset to get correct dates in future (when timezone changes)
  const firstDateOfMonth = normalizeCalendarDay(startOfMonth(date));
  const lastDateOfMonth = normalizeCalendarDay(lastDayOfMonth(date));

  const prevDays = firstDateOfMonth.getDay();
  const nextDays = 7 - lastDateOfMonth.getDay();
  const firstDay = subDays(firstDateOfMonth, prevDays);
  const lastDay = addDays(lastDateOfMonth, nextDays);

  const totalDays = differenceInDays(lastDay, firstDay);

  const weeks: CalendarWeek[] = [];
  let currentDay = firstDay;

  for (let i = 0; i < totalDays; i += 1) {
    if (i % 7 === 0) {
      weeks.push({
        type: 'week',
        days: [],
      });
    }

    weeks[weeks.length - 1].days.push({
      type: 'day',
      date: cloneDate(currentDay),
      isOutsideDay: !isSameMonth(date, currentDay),
    });

    currentDay = addDays(currentDay, 1);
  }

  const month: CalendarMonth = {
    type: 'month',
    weeks,
  };

  memoizedMonthWeeks.set(memoKey, month);

  return month;
}

export function getCalendarWeek(date: Date): CalendarWeek {
  const month = getCalendarMonth(date);
  const weekIndex = getWeekOfMonth(date);

  return month.weeks[weekIndex - 1];
}
