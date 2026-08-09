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
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/app/**/*.ts'],
      exclude: [
        'src/app/**/*.spec.ts',
        'src/app/**/*.module.ts',
        'src/app/**/*-module.ts',
        'src/app/**/*.models.ts',
        'src/app/**/index.ts',
      ],
    },
  },
});
