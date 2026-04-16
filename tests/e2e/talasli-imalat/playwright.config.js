/**
 * Talaşlı İmalat E2E — Playwright Config
 * https://quvex.io üzerinde koşacak
 */
const { defineConfig } = require('@playwright/test')

module.exports = defineConfig({
  testDir: '.',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: 1,
  reporter: [
    ['html', { outputFolder: '../../../playwright-report/talasli-imalat' }],
    ['list'],
  ],
  timeout: 90_000,

  use: {
    baseURL: process.env.BASE_URL || 'https://quvex.io',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
    ignoreHTTPSErrors: true,
    viewport: { width: 1920, height: 1080 },
    locale: 'tr-TR',
  },

  projects: [
    {
      name: 'auth-setup',
      testMatch: /auth-setup\.spec\.js/,
    },
    {
      name: 'talasli-imalat',
      use: { browserName: 'chromium' },
      dependencies: ['auth-setup'],
      testMatch: /talasli-imalat-data-entry-e2e\.spec\.js/,
    },
    {
      name: 'cleanup',
      use: { browserName: 'chromium' },
      testMatch: /cleanup-tenants\.spec\.js/,
    },
  ],
})
