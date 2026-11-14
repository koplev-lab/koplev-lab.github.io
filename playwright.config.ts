import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests',
  testIgnore: ['screenshots/**'],
  reporter: process.env.CI ? 'github' : 'list',
});
