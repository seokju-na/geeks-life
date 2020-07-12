import { useObservable, useSubscription } from 'observable-hooks';
import { useEffect, useRef, useState } from 'react';
import { EMPTY, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

const createResizeObserver = <T extends HTMLElement = HTMLElement>(element: T) =>
  new Observable<ResizeObserverEntry>((subscriber) => {
    let resizeObserver: ResizeObserver | null = new ResizeObserver((entries) => {
      if (entries[0] != null) {
        subscriber.next(entries[0]);
      }
    });

    resizeObserver.observe(element, { box: 'border-box' });

    return () => {
      resizeObserver?.disconnect();
      resizeObserver = null;
    };
  });

export default function useResizeObserver<T extends HTMLElement = HTMLElement>(
  onEntryChange?: (entry: ResizeObserverEntry) => void,
) {
  const ref = useRef<T>(null);
  const [elem, setElem] = useState<T | null>(null);

  useEffect(() => {
    setElem(ref.current);
  }, []);

  const entry$ = useObservable(
    (input$) =>
      input$.pipe(switchMap(([elem]) => (elem !== null ? createResizeObserver(elem) : EMPTY))),
    [elem] as const,
  );

  useSubscription(entry$, onEntryChange);

  return ref;
}
