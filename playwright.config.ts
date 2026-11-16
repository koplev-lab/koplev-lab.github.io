import { defineConfig } from '@playwright/test';
import { BASE, PORT } from './tests/helpers/config';

// Expects a fresh `npm run build:test` (npm test does both).
export default defineConfig({
  testDir: 'tests',
  testIgnore: ['helpers/**'],
  fullyParallel: true,
  reporter: process.env.CI ? 'github' : 'list',
  use: { baseURL: `http://127.0.0.1:${PORT}${BASE}` },
  webServer: {
    command: `node scripts/serve-dist.mjs ${PORT} ${BASE}`,
    url: `http://127.0.0.1:${PORT}${BASE}`,
    reuseExistingServer: false,
  },
});
