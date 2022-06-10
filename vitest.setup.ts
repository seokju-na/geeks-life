import { clearMocks } from '@tauri-apps/api/mocks';
import '@testing-library/jest-dom';
import { randomFillSync } from 'crypto';
import { afterEach, beforeAll } from 'vitest';

// required for tauri ipc.
// see: https://tauri.studio/v1/guides/testing/mocking
beforeAll(() => {
  (window as any).crypto = {
    getRandomValues: (buffer: Buffer) => {
      return randomFillSync(buffer);
    },
  };
});

afterEach(() => {
  clearMocks();
});
