import { act } from '@testing-library/react-hooks';
import { isSameDay, parseISO } from 'date-fns';
import { it, expect } from 'vitest';
import { mockStore } from '../testing/mocks';
import { renderHookWithTestBed } from '../testing/render';
import { useSelectedDateState } from './useSelectedDateState';

it('default selected date is today', async () => {
  mockStore('.local');

  const { result, waitFor } = renderHookWithTestBed(() => useSelectedDateState());
  await waitFor(() => {
    expect(isSameDay(result.current.value, new Date()));
  });
});

it('get selected date from ".local" store', async () => {
  mockStore('.local').set('selectedDate', '2022-06-11');

  const { result, waitFor } = renderHookWithTestBed(() => useSelectedDateState());
  await waitFor(() => {
    expect(isSameDay(result.current.value, parseISO('2022-06-11')));
  });
});

it('save selected date to ".local" store', async () => {
  mockStore('.local').set('selectedDate', '2022-06-11');

  const { result, waitFor } = renderHookWithTestBed(() => useSelectedDateState());
  await waitFor(() => {
    expect(isSameDay(result.current.value, parseISO('2022-06-11')));
  });

  act(() => {
    result.current.setValue(parseISO('2022-06-12'));
  });
  await waitFor(() => {
    expect(isSameDay(result.current.value, parseISO('2022-06-12')));
  });
});
