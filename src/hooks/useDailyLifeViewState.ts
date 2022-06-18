import { DailyLifeView } from '../models';
import { useStoreState } from './useStoreState';

export function useDailyLifeViewState() {
  const state = useStoreState<DailyLifeView>('.local', 'dailyLifeView');

  return {
    ...state,
    value: (state.value ?? 'week') as DailyLifeView,
  };
}
