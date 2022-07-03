import { waitFor } from '@testing-library/react';
import { it } from 'vitest';
import { dummyDailyLife } from '../testing/dummies';
import { mockIPC } from '../testing/mocks';
import { renderHookWithTestBed } from '../testing/render';
import { useDailyLifes } from './useDailyLifes';

it('fetch daily lifes', async () => {
  const dailyLifes = dummyDailyLife.buildList(5);
  mockIPC('get_daily_lifes', () => dailyLifes);

  const { result } = renderHookWithTestBed(() => useDailyLifes());

  await waitFor(() => result.current.isStale);
  expect(result.current.data).toEqual(dailyLifes);
});
