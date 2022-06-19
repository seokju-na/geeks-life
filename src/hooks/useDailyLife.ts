import { useQuery } from 'react-query';
import { queryClient } from '../queryClient';
import { getDailyLife } from '../remotes';
import { useDailyLifes } from './useDailyLifes';

const baseQueryKey = 'getDailyLife';
const queryKey = (id: string) => [baseQueryKey, id];

export function useDailyLife(id: string) {
  return useQuery(queryKey(id), () => getDailyLife(id));
}

useDailyLife.queryKey = queryKey;
useDailyLife.refetch = async (id: string) => {
  await queryClient.invalidateQueries(queryKey(id));
  await useDailyLifes.refetch();
};
