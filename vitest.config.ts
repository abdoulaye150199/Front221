import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: [
      { find: '@shared', replacement: '/src/app/shared' },
      { find: '@features', replacement: '/src/app/features' },
    ],
  },
  test: {
    environment: 'jsdom',
  },
});
