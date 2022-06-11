import { test } from 'vitest';
import { getWeek } from './calendar';

test('getWeek', () => {
  it('get 7 dates starts on monday', () => {
    const june2ndWeek = [
      new Date(2022, 5, 5, 0, 0, 0, 0),
      new Date(2022, 5, 6, 0, 0, 0, 0),
      new Date(2022, 5, 7, 0, 0, 0, 0),
      new Date(2022, 5, 8, 0, 0, 0, 0),
      new Date(2022, 5, 9, 0, 0, 0, 0),
      new Date(2022, 5, 10, 0, 0, 0, 0),
      new Date(2022, 5, 11, 0, 0, 0, 0),
    ] as const;

    for (const date of june2ndWeek) {
      expect(getWeek(date)).toEqual(june2ndWeek);
    }
  });
});
