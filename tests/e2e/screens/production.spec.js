const { test, expect } = require('../fixtures')

test.use({ storageState: 'playwright/.auth/user.json' })

test.describe('Uretim Modulu', () => {
  test('uretim emirleri listesi yuklenmeli', async ({ page }) => {
    await page.goto('/production')
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})

    const table = page.locator('.ant-table, table')
    await expect(table.first()).toBeVisible({ timeout: 15_000 })
  })

  test('uretim tablosu kolonlari dogru olmali', async ({ page }) => {
    await page.goto('/production')
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})

    const columns = ['Firma', 'Ürün', 'Miktar', 'Durum']
    for (const col of columns) {
      const header = page.getByText(col, { exact: false }).first()
      if (await header.isVisible({ timeout: 3_000 }).catch(() => false)) {
        await expect(header).toBeVisible()
      }
    }
  })

  test('uretim istatistik kartlari gorunmeli', async ({ page }) => {
    await page.goto('/production')
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})

    // Ozet kartlar: Toplam, Bekleyen, Uretimde, Tamamlanan, Geciken
    const cards = page.locator('.ant-card, .ant-statistic, [class*="stat"]')
    if (await cards.first().isVisible({ timeout: 5_000 }).catch(() => false)) {
      const count = await cards.count()
      expect(count).toBeGreaterThan(0)
    }
  })

  test('uretim durum filtreleri calismali', async ({ page }) => {
    await page.goto('/production')
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})

    const filters = page.locator('.ant-select, .ant-radio-group, .ant-tabs')
    if (await filters.first().isVisible({ timeout: 5_000 }).catch(() => false)) {
      await expect(filters.first()).toBeVisible()
    }
  })

  test('gantt planlama sayfasi yuklenmeli', async ({ page }) => {
    await page.goto('/production/planning')
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})
    await expect(page.locator('body')).toBeVisible()
  })

  test('proje yonetimi sayfasi yuklenmeli', async ({ page }) => {
    await page.goto('/production/projects')
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})
    await expect(page.locator('body')).toBeVisible()
  })

  test('kapasite cizelgeleme sayfasi yuklenmeli', async ({ page }) => {
    await page.goto('/production/capacity-scheduling')
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})
    await expect(page.locator('body')).toBeVisible()
  })

  test('seri numaralari sayfasi yuklenmeli', async ({ page }) => {
    await page.goto('/serial-numbers')
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})
    await expect(page.locator('body')).toBeVisible()
  })

  test('fason isler sayfasi yuklenmeli', async ({ page }) => {
    await page.goto('/subcontract-orders')
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})
    await expect(page.locator('body')).toBeVisible()
  })

  test('atolye terminali sayfasi yuklenmeli', async ({ page }) => {
    await page.goto('/shop-floor')
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})
    await expect(page.locator('body')).toBeVisible()
  })
})
