import { mockIPC } from '@tauri-apps/api/mocks';
import { waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from 'react-query';
import { it } from 'vitest';
import { dummyDailyLife } from '../testing/dummies';
import { useDailyLifes } from './useDailyLifes';

const client = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: false,
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

it('fetch daily lifes', async () => {
  const dailyLifes = dummyDailyLife.buildList(5);

  mockIPC(cmd => {
    if (cmd === 'get_daily_lifes') {
      return dailyLifes;
    }
    throw new Error(`invalid command: ${cmd}`);
  });

  const { result } = renderHook(() => useDailyLifes(), {
    wrapper: ({ children }) => <QueryClientProvider client={client}>{children}</QueryClientProvider>,
  });

  await waitFor(() => result.current.isStale);
  expect(result.current.data).toEqual(dailyLifes);
});