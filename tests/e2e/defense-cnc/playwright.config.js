/**
 * Savunma Sanayi CNC E2E — Playwright Config
 * Testler https://quvex.io uzerinde kosacak
 */
const { defineConfig } = require('@playwright/test')

module.exports = defineConfig({
  testDir: '.',
  fullyParallel: false, // Fazlar sirali calisacak
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: 1, // Serial mode — fazlar birbiririne bagimli
  reporter: [
    ['html', { outputFolder: '../../../playwright-report/defense-cnc' }],
    ['list'],
  ],
  timeout: 90_000, // Veri girisi testleri form + networkidle icin daha uzun süre gerektirebilir

  use: {
    baseURL: process.env.BASE_URL || 'https://quvex.io',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
    // HTTPS icin gerekli
    ignoreHTTPSErrors: true,
    // Viewport
    viewport: { width: 1920, height: 1080 },
    // Locale
    locale: 'tr-TR',
  },

  projects: [
    // 1. Once login ol — yeni tenant olustur
    {
      name: 'auth-setup',
      testMatch: /auth-setup\.spec\.js/,
    },
    // 2. Talasli imalat tam senaryo testleri (sadece sayfa acma)
    {
      name: 'defense-cnc',
      use: { browserName: 'chromium' },
      dependencies: ['auth-setup'],
      testMatch: /defense-cnc-full-e2e\.spec\.js/,
    },
    // 3. Tam veri girisi E2E senaryosu (musteri, urun, teklif, uretim, fatura)
    {
      name: 'cnc-data-entry',
      use: { browserName: 'chromium' },
      dependencies: ['auth-setup'],
      testMatch: /cnc-data-entry-e2e\.spec\.js/,
    },
    // 4. Performans olcum testleri (auth sonrasi)
    {
      name: 'perf-timing',
      use: { browserName: 'chromium' },
      dependencies: ['auth-setup'],
      testMatch: /perf-timing\.spec\.js/,
    },
    // 5. Tenant temizleme (test sonrasi manuel calistir)
    {
      name: 'cleanup',
      use: { browserName: 'chromium' },
      testMatch: /cleanup-tenants\.spec\.js/,
    },
  ],
})
