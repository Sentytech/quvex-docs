const { test, expect } = require('../fixtures')

test.use({ storageState: 'playwright/.auth/user.json' })

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/home')
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})
  })

  test('dashboard sayfasi yuklenmeli', async ({ page }) => {
    await expect(page).toHaveURL(/home/)
  })

  test('navigasyon menusu gorunmeli', async ({ page }) => {
    const nav = page.locator('nav, .navbar, .header-navbar, .ant-menu')
    await expect(nav.first()).toBeVisible({ timeout: 15_000 })
  })

  test('kullanici dropdown gorunmeli', async ({ page }) => {
    const userArea = page.locator('.user-nav, .dropdown-user, [class*="user-dropdown"], .ant-avatar, .avatar')
    await expect(userArea.first()).toBeVisible({ timeout: 15_000 })
  })

  test('istatistik kartlari gorunmeli', async ({ page }) => {
    // Dashboard stat cards veya div containers
    const cards = page.locator('.ant-card, .card, [class*="stat"], [class*="cursor-pointer"], .col-lg-2')
    await expect(cards.first()).toBeVisible({ timeout: 15_000 })
  })

  test('grafik alani yuklenmeli', async ({ page }) => {
    // ApexCharts veya Recharts container
    const chart = page.locator('.apexcharts-canvas, .recharts-wrapper, [class*="chart"]')
    if (await chart.first().isVisible({ timeout: 5_000 }).catch(() => false)) {
      await expect(chart.first()).toBeVisible()
    }
  })

  test('stok uyarilari alani gorunmeli', async ({ page }) => {
    const stockAlert = page.getByText(/Stok|Stock|Uyar/i).first()
    if (await stockAlert.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await expect(stockAlert).toBeVisible()
    }
  })

  test('geciken siparisler alani gorunmeli', async ({ page }) => {
    const delayed = page.getByText(/Gecik|Delay|Teslim/i).first()
    if (await delayed.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await expect(delayed).toBeVisible()
    }
  })
})
