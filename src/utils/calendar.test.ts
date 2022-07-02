import { test } from 'vitest';
import { getDaysOfWeekInCalendar, getDaysOfMonthInCalendar } from './calendar';
import { range } from './range';

test('getDaysOfWeekInCalendar', () => {
  it('get 7 days of week which starts on sunday', () => {
    const june2ndWeek = [
      new Date(2022, 5, 5),
      new Date(2022, 5, 6),
      new Date(2022, 5, 7),
      new Date(2022, 5, 8),
      new Date(2022, 5, 9),
      new Date(2022, 5, 10),
      new Date(2022, 5, 11),
    ] as const;

    for (const date of june2ndWeek) {
      expect(getDaysOfWeekInCalendar(date)).toEqual(june2ndWeek);
    }
  });
});

test('getDaysOfMonthInCalendar', () => {
  it('get all days of month in calendar', () => {
    const june = range(1, 31).map(x => new Date(2022, 6, x));
    const juneInCalendar = [
      ...range(26, 30).map(x => new Date(2022, 5, x)),
      ...june,
      ...range(1, 6).map(x => new Date(2022, 7, x)),
    ] as const;

    for (const date of june) {
      expect(getDaysOfMonthInCalendar(date)).toEqual(juneInCalendar);
    }
  });
});
