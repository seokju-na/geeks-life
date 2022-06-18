import { useCallback } from 'react';
import { useQuery } from 'react-query';
import { Store } from 'tauri-plugin-store-api';
import { queryClient } from '../queryClient';

const baseQueryKey = 'store';
const queryKey = (name: string, key: string) => [baseQueryKey, name, key];

export function useStoreState<T>(name: string, key: string) {
  const query = useQuery(queryKey(name, key), () => {
    const store = new Store(name);
    return store.get<T>(key);
  });

  const setValue = useCallback(
    async (value: T) => {
      const store = new Store(name);

      queryClient.setQueryData(queryKey(name, key), value);
      await store.set(key, value);
      await store.save();
    },
    [name, key]
  );

  const deleteValue = useCallback(async () => {
    const store = new Store(name);

    queryClient.setQueryData(queryKey(name, key), null);
    await store.delete(key);
    await store.save();
  }, [name, key]);

  return {
    value: query.data as T | null,
    setValue,
    deleteValue,
  };
}

useStoreState.queryKey = queryKey;
