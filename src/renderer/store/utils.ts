import { EMPTY, of } from 'rxjs';
import { mergeMap, share, take } from 'rxjs/operators';
import { listenIpc, sendIpcMessage } from '../hooks/useIpcListener';

export function createIpcRequestAndResponse<Request, Response>(
  requestChannel: string,
  responseChannel: string,
) {
  const response$ = listenIpc<Response>(responseChannel).pipe(share());

  return (payload?: Request) => {
    sendIpcMessage<Request>(requestChannel, payload);

    return response$.pipe(
      mergeMap((payload) => {
        if (payload == null) {
          return EMPTY;
        }

        return of(payload);
      }),
      take(1),
    );
  };
}
