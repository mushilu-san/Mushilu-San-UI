import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['scripts/**/*.spec.mjs', 'projects/docs/scripts/**/*.spec.mjs'],
    environment: 'node',
  },
});
