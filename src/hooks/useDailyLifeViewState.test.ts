import { act } from '@testing-library/react-hooks';
import { expect, it } from 'vitest';
import { mockStore } from '../testing/mocks';
import { renderHookWithTestBed } from '../testing/render';
import { useDailyLifeViewState } from './useDailyLifeViewState';

it('default daily life view is "week"', async () => {
  mockStore('.local');

  const { result, waitFor } = renderHookWithTestBed(() => useDailyLifeViewState());
  await waitFor(() => {
    expect(result.current.value).toEqual('week');
  });
});

it('get daily life view from ".local" store', async () => {
  mockStore('.local').set('dailyLifeView', 'month');

  const { result, waitFor } = renderHookWithTestBed(() => useDailyLifeViewState());
  await waitFor(() => {
    expect(result.current.value).toEqual('month');
  });
});

it('save daily life view to ".local" store', async () => {
  mockStore('.local').set('dailyLifeView', 'week');

  const { result, waitFor } = renderHookWithTestBed(() => useDailyLifeViewState());
  await waitFor(() => {
    expect(result.current.value).toEqual('week');
  });

  act(() => {
    result.current.setValue('month');
  });
  await waitFor(() => {
    expect(result.current.value).toEqual('month');
  });
});
