import { defineConfig } from '@playwright/test';

// One test per manifest entry (capture.spec.ts). Every image is taken with
// the same browser, size, locale and time zone so screenshots look alike
// across articles and re-captures don't produce noisy diffs.
export default defineConfig({
  testDir: '.',
  testMatch: 'capture.spec.ts',
  fullyParallel: false,
  workers: 1,
  retries: 1,
  timeout: 90_000,
  expect: { timeout: 20_000 },
  reporter: [['list'], ['html', { open: 'never' }]],
  globalSetup: './global-setup.ts',
  use: {
    browserName: 'chromium',
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    locale: 'en-US',
    timezoneId: 'America/Vancouver',
    colorScheme: 'light',
    reducedMotion: 'reduce',
    trace: 'retain-on-failure',
    navigationTimeout: 45_000,
    actionTimeout: 15_000
  }
});
