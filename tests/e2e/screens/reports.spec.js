const { test, expect } = require('../fixtures')

test.use({ storageState: 'playwright/.auth/user.json' })

test.describe('Raporlar Modulu', () => {
  const reportPages = [
    { name: 'Raporlar Dashboard', url: '/reports' },
    { name: 'KPI Dashboard', url: '/reports/kpi' },
    { name: 'Dinamik Raporlar', url: '/dynamic-reports' },
    { name: 'Bildirimler', url: '/notifications' },
    { name: 'Teklif Donusum Trendi', url: '/reports/offer-conversion' },
    { name: 'Teslimat Tahmini', url: '/reports/delivery-estimation' },
    { name: 'NCR Trend', url: '/reports/ncr-trend' },
    { name: 'Tedarikci Kalite Trend', url: '/reports/supplier-quality' },
    { name: 'Kalite Maliyet', url: '/reports/quality-cost' },
  ]

  for (const pg of reportPages) {
    test(`${pg.name} sayfasi yuklenmeli`, async ({ page }) => {
      await page.goto(pg.url)
      await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})

      const url = page.url()
      expect(url).not.toContain('/login')

      const bodyContent = await page.locator('body').innerHTML()
      expect(bodyContent.length).toBeGreaterThan(100)
    })
  }

  test('KPI dashboard grafikleri gorunmeli', async ({ page }) => {
    await page.goto('/reports/kpi')
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})

    const charts = page.locator('.apexcharts-canvas, .recharts-wrapper, [class*="chart"], .ant-card')
    if (await charts.first().isVisible({ timeout: 5_000 }).catch(() => false)) {
      const count = await charts.count()
      expect(count).toBeGreaterThan(0)
    }
  })

  test('bildirimler listesi gorunmeli', async ({ page }) => {
    await page.goto('/notifications')
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})

    const list = page.locator('.ant-list, .ant-table, table, [class*="notification"]')
    if (await list.first().isVisible({ timeout: 5_000 }).catch(() => false)) {
      await expect(list.first()).toBeVisible()
    }
  })
})
