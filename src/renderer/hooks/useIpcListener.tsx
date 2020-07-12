import { IpcRendererEvent } from 'electron';
import { useObservable, useSubscription } from 'observable-hooks';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

function listenIpc(channel: string) {
  return new Observable<IpcRendererEvent>((subscriber) => {
    const listener = (event: IpcRendererEvent) => {
      subscriber.next(event);
    };

    window.electronFeatures?.ipcRenderer.on(channel, listener);

    return () => {
      window.electronFeatures?.ipcRenderer.off(channel, listener);
    };
  });
}

export default function useIpcListener(
  channel: string,
  onEvent?: (event: IpcRendererEvent) => void,
) {
  const ipc$ = useObservable(
    (input$) => input$.pipe(switchMap(([channel]) => listenIpc(channel))),
    [channel] as const,
  );

  useSubscription(ipc$, onEvent);
}
