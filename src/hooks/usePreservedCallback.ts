import { useRef, useEffect, useCallback } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Callback = (...args: any[]) => any;

export function usePreservedCallback<T extends Callback>(callback: T) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback(
    (...args: Parameters<T>): ReturnType<T> => {
      return callbackRef.current(...args);
    },
    [callbackRef]
  );
}
