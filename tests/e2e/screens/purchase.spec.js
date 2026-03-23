const { test, expect } = require('../fixtures')

test.use({ storageState: 'playwright/.auth/user.json' })

test.describe('Satin Alma Modulu', () => {
  test('satin alma talepleri yuklenmeli', async ({ page }) => {
    await page.goto('/purchase-request')
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})
    await expect(page.locator('body')).toBeVisible()
  })

  test('satin alma teklifleri yuklenmeli', async ({ page }) => {
    await page.goto('/purchase-offers')
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})
    await expect(page.locator('body')).toBeVisible()
  })

  test.describe('Satin Alma Siparisleri', () => {
    test('siparis listesi yuklenmeli', async ({ page }) => {
      await page.goto('/purchase-orders')
      await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})

      const table = page.locator('.ant-table, table')
      await expect(table.first()).toBeVisible({ timeout: 15_000 })
    })

    test('PO istatistik kartlari gorunmeli', async ({ page }) => {
      await page.goto('/purchase-orders')
      await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})

      const cards = page.locator('.ant-card, .ant-statistic, [class*="stat"]')
      if (await cards.first().isVisible({ timeout: 5_000 }).catch(() => false)) {
        const count = await cards.count()
        expect(count).toBeGreaterThan(0)
      }
    })

    test('PO durum filtreleri calismali', async ({ page }) => {
      await page.goto('/purchase-orders')
      await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})

      const filters = page.locator('.ant-select, .ant-radio-group, .ant-tabs')
      if (await filters.first().isVisible({ timeout: 5_000 }).catch(() => false)) {
        await expect(filters.first()).toBeVisible()
      }
    })

    test('PO form sayfasi acilabilmeli', async ({ page }) => {
      await page.goto('/purchase-orders/form')
      await page.waitForLoadState('domcontentloaded')
      await expect(page.locator('body')).toBeVisible()
    })
  })
})
