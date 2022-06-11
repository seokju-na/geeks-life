import { getDailyLifes, GetDailyLifesParams } from '../remotes';
import { useQuery } from 'react-query';
import { queryClient } from '../queryClient';

const baseQueryKey = 'getDailyLifes';
const queryKey = (params?: GetDailyLifesParams) => [baseQueryKey, params];

export function useDailyLifes(params?: GetDailyLifesParams) {
  return useQuery(queryKey(params), () => getDailyLifes(params));
}

useDailyLifes.queryKey = queryKey;
useDailyLifes.refetch = () => {
  return queryClient.invalidateQueries([baseQueryKey]);
};
