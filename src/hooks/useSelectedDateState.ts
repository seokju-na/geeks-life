import { parseISO } from 'date-fns';
import { useStoreState } from './useStoreState';

export function useSelectedDateState() {
  const state = useStoreState<string>('.local', 'selectedDate');

  return {
    ...state,
    value: safeParseISO(state.value) ?? new Date(),
    setValue: (date: Date) => state.setValue(date.toISOString()),
  };
}

function safeParseISO(val: string | null | undefined) {
  if (val == null) {
    return null;
  }
  return parseISO(val);
}
