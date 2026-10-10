import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './projects/docs/e2e',
  testMatch: '**/*.e2e.ts',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  workers: process.env['CI'] ? 2 : undefined,
  reporter: process.env['CI'] ? 'github' : 'list',
  use: {
    baseURL: 'http://localhost:4301',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npx http-server dist/docs/browser -p 4301 -c-1 --silent',
    port: 4301,
    reuseExistingServer: !process.env['CI'],
    timeout: 30_000,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
});
