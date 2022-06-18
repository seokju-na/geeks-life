import { QueryClient } from 'react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true,
      refetchInterval: false,
      keepPreviousData: true,
    },
  },
});
