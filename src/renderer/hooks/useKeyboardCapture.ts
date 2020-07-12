import { useObservable, useSubscription } from 'observable-hooks';
import { fromEvent } from 'rxjs';
import { filter, share, switchMap } from 'rxjs/operators';

const _keyPress$ = fromEvent<KeyboardEvent>(document, 'keydown').pipe(share());

export default function useKeyboardCapture(
  eventKey: string,
  onKeyPress?: (event: KeyboardEvent) => void,
) {
  const keyPress$ = useObservable(
    (input$) =>
      input$.pipe(
        switchMap(([eventKey]) =>
          _keyPress$.pipe(filter((event) => !event.defaultPrevented && event.key === eventKey)),
        ),
      ),
    [eventKey] as const,
  );

  useSubscription(keyPress$, onKeyPress);
}
