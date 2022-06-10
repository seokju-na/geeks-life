import { parseISO } from 'date-fns';
import { test, it } from 'vitest';
import { dummyDailyLife } from '../testing/dummies';
import { getDailyLifeDate } from './DailyLife';

test('getDailyLifeDate', () => {
  it('parse date from id', () => {
    const dailyLife = dummyDailyLife.build({ id: '2022-06-10' });
    expect(getDailyLifeDate(dailyLife)).toEqual(parseISO('2022-06-10T00:00:00Z'));
  });
});
