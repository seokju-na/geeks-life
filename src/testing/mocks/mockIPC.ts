import { mockIPC as tauriMockIPC } from '@tauri-apps/api/mocks';
import { afterEach, beforeEach } from 'vitest';

type Handler = (args: Record<string, unknown>) => any;
const handlers = new Map<string, Handler>();

beforeEach(() => {
  tauriMockIPC((command, args) => {
    return handlers.get(command)?.(args);
  });
});

afterEach(() => {
  handlers.clear();
});

export function mockIPC(command: string, handler: Handler) {
  handlers.set(command, handler);
}
