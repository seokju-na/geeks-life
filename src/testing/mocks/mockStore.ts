import { beforeEach, afterEach } from 'vitest';
import { mockIPC } from './mockIPC';

const mem = new Map<any, Map<any, any>>();

beforeEach(() => {
  mockIPC('plugin:store|set', args => {
    const { path, key, value } = args;
    mem.get(path)?.set(key, value);
  });

  mockIPC('plugin:store|get', args => {
    const { path, key } = args;
    return mem.get(path)?.get(key) ?? null;
  });

  mockIPC('plugin:store|has', args => {
    const { path, key } = args;
    return mem.get(path)?.has(key) ?? false;
  });

  mockIPC('plugin:store|delete', args => {
    const { path, key } = args;
    mem.get(path)?.delete(key);
  });

  mockIPC('plugin:store|clear', args => {
    const { path } = args;
    mem.delete(path);
  });

  // skip for 'plugin:store|reset'

  mockIPC('plugin:store|keys', args => {
    const { path } = args;
    return mem.get(path)?.keys() ?? [];
  });

  mockIPC('plugin:store|values', args => {
    const { path } = args;
    return mem.get(path)?.values() ?? [];
  });

  mockIPC('plugin:store|entries', args => {
    const { path } = args;
    return mem.get(path)?.entries() ?? [];
  });

  mockIPC('plugin:store|length', args => {
    const { path } = args;
    return mem.get(path)?.size;
  });

  mockIPC('plugin:store|load', () => {});
  mockIPC('plugin:store|save', () => {});
});

afterEach(() => {
  mem.clear();
});

export function mockStore(name: string) {
  const store = new Map<any, any>();
  mem.set(name, store);

  return store;
}
