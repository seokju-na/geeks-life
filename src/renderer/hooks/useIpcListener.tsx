import { useObservable, useSubscription } from 'observable-hooks';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { parsePayload, serializePayload } from '../../core';
import { getElectronFeatures } from '../electron-features';
import { Nullable } from '../utils/typing';

const { ipcRenderer } = getElectronFeatures();

export function sendIpcMessage<T>(channel: string, payload?: T) {
  ipcRenderer.send(channel, payload != null ? serializePayload(payload) : undefined);
}

export function listenIpc<T>(channel: string) {
  return new Observable<Nullable<T>>((subscriber) => {
    const listener = (_: unknown, payload?: string) => {
      subscriber.next(payload != null ? parsePayload<T>(payload) : undefined);
    };

    ipcRenderer.on(channel, listener);

    return () => {
      ipcRenderer.off(channel, listener);
    };
  });
}

export default function useIpcListener<T = undefined>(
  channel: string,
  onEvent?: (payload: T | null | undefined) => void,
) {
  const ipc$ = useObservable(
    (input$) => input$.pipe(switchMap(([channel]) => listenIpc<T>(channel))),
    [channel] as const,
  );

  useSubscription(ipc$, onEvent);
}
