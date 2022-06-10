import { getDailyLifes, GetDailyLifesParams } from '../remotes';
import { useQuery } from 'react-query';
import { queryClient } from '../queryClient';

const baseKey = 'getDailyLifes';
const key = (params?: GetDailyLifesParams) => [baseKey, params];

export function useDailyLifes(params?: GetDailyLifesParams) {
  return useQuery(key(params), () => getDailyLifes(params));
}

useDailyLifes.refetch = () => {
  return queryClient.invalidateQueries([baseKey]);
};
