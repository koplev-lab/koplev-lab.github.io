import { defineConfig } from '@playwright/test';
import { BASE, PORT } from './tests/helpers/config';

// Expects a fresh `npm run build:test` (npm test does both).
export default defineConfig({
  testDir: 'tests',
  testIgnore: ['screenshots/**', 'helpers/**'],
  fullyParallel: true,
  reporter: process.env.CI ? 'github' : 'list',
  use: { baseURL: `http://127.0.0.1:${PORT}${BASE}` },
  webServer: {
    command: `npx astro preview --host 127.0.0.1 --port ${PORT}`,
    url: `http://127.0.0.1:${PORT}${BASE}`,
    reuseExistingServer: !process.env.CI,
    // `env` replaces the inherited environment, so pass it through explicitly.
    env: { ...(process.env as Record<string, string>), BASE_PATH: BASE, PREVIEW_THEMES: 'true' },
  },
});
