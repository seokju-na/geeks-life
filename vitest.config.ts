import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.{ts,tsx}'],
    exclude: ['dist', 'node_modules', '.yarn', '.idea', 'src-tauri'],
    environment: 'happy-dom',
    clearMocks: true,
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
  plugins: [react() as any],
});
