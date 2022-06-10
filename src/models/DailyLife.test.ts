import { parse } from 'date-fns';
import fc from 'fast-check';
import { test, it } from 'vitest';
import { dummyDailyLife } from '../testing/dummies';
import { getDailyLifeDate } from './DailyLife';

test('getDailyLifeDate', () => {
  it('parse date from id', () => {
    fc.assert(
      fc.property(dummyDailyLife, data => {
        expect(getDailyLifeDate(data)).toEqual(parse(data.id, 'yyyy-MM-dd', new Date()));
      })
    );
  });
});
