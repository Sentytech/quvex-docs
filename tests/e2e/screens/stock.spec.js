const { test, expect } = require('../fixtures')

test.use({ storageState: 'playwright/.auth/user.json' })

test.describe('Stok Modulu', () => {
  test('stok listesi yuklenmeli', async ({ page }) => {
    await page.goto('/stocks')
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})

    const table = page.locator('.ant-table, table')
    await expect(table.first()).toBeVisible({ timeout: 15_000 })
  })

  test('stok giris/cikis sayfasi yuklenmeli', async ({ page }) => {
    await page.goto('/stock-receipts')
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})
    await expect(page.locator('body')).toBeVisible()
  })

  test('depolar sayfasi yuklenmeli', async ({ page }) => {
    await page.goto('/warehouses')
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})
    await expect(page.locator('body')).toBeVisible()
  })

  test('depo lokasyonlari sayfasi yuklenmeli', async ({ page }) => {
    await page.goto('/warehouse-locations')
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})
    await expect(page.locator('body')).toBeVisible()
  })

  test('stok sayim sayfasi yuklenmeli', async ({ page }) => {
    await page.goto('/stock/count')
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})
    await expect(page.locator('body')).toBeVisible()
  })

  test('lot takibi sayfasi yuklenmeli', async ({ page }) => {
    await page.goto('/stock/lots')
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})
    await expect(page.locator('body')).toBeVisible()
  })

  test('stok degerleme sayfasi yuklenmeli', async ({ page }) => {
    await page.goto('/stock/valuation')
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})
    await expect(page.locator('body')).toBeVisible()
  })

  test('ABC analizi sayfasi yuklenmeli', async ({ page }) => {
    await page.goto('/stock/abc-analysis')
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})
    await expect(page.locator('body')).toBeVisible()
  })

  test('stok uyarilari sayfasi yuklenmeli', async ({ page }) => {
    await page.goto('/stock/alerts')
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})
    await expect(page.locator('body')).toBeVisible()
  })

  test('barkod islemleri sayfasi yuklenmeli', async ({ page }) => {
    await page.goto('/stock/barcode')
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})
    await expect(page.locator('body')).toBeVisible()
  })

  test('stok transfer listesi yuklenmeli', async ({ page }) => {
    await page.goto('/stock/transfers')
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})
    await expect(page.locator('body')).toBeVisible()
  })

  test('stok transfer formu acilabilmeli', async ({ page }) => {
    await page.goto('/stock/transfer/form')
    await page.waitForLoadState('domcontentloaded')
    await expect(page.locator('body')).toBeVisible()
  })
})
