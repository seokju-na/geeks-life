import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.{ts,tsx}'],
    exclude: ['dist', 'node_modules', '.yarn', '.idea', 'src-tauri'],
    // Cannot use 'happy-dom' at this time.
    // https://github.com/vitest-dev/vitest/issues/132#issuecomment-992972183
    environment: 'jsdom',
    clearMocks: true,
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
  plugins: [react() as any],
});
