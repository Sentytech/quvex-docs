const { defineConfig } = require('@playwright/test')

module.exports = defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 2,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  timeout: 30_000,

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    // 1. Once login ol, auth state'i kaydet
    {
      name: 'setup',
      testMatch: /auth[/\\]auth\.setup\.js/,
    },
    // 2. Auth gerektiren testler (login ve security haric)
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
      dependencies: ['setup'],
      testIgnore: [/login\.spec/, /security\.spec/],
    },
    // 3. Login ve security testleri EN SONDA
    {
      name: 'login-tests',
      use: { browserName: 'chromium' },
      testMatch: [/login\.spec\.js$/, /security\.spec\.js$/],
      dependencies: ['chromium'],
    },
  ],

  webServer: {
    command: 'npm start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
})
