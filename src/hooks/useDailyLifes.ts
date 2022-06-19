import { useQuery } from 'react-query';
import { queryClient } from '../queryClient';
import { getDailyLifes, GetDailyLifesParams } from '../remotes';

const baseQueryKey = 'getDailyLifes';
const queryKey = (params?: GetDailyLifesParams) => (params != null ? [baseQueryKey, params] : [baseQueryKey]);

export function useDailyLifes(params?: GetDailyLifesParams) {
  return useQuery(queryKey(params), () => getDailyLifes(params));
}

useDailyLifes.queryKey = queryKey;
useDailyLifes.refetch = async (params?: GetDailyLifesParams) => {
  await queryClient.invalidateQueries(queryKey(params));
};
