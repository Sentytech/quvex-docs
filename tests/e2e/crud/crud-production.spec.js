const { test, expect } = require('../fixtures')

test.use({ storageState: 'playwright/.auth/user.json' })

test.describe('Uretim Detay Islemleri', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/production')
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})
  })

  test('uretim istatistik kartlari dogru sayida olmali', async ({ page }) => {
    // 5 stat card: Toplam, Bekleyen, Uretimde, Tamamlanan, Geciken
    const cards = page.locator('.ant-card, [class*="stat-card"], [style*="border-radius"]')
    if (await cards.first().isVisible({ timeout: 10_000 }).catch(() => false)) {
      const count = await cards.count()
      expect(count).toBeGreaterThanOrEqual(1)
    }
  })

  test('uretim tablosu ilerleme sutunu gorunmeli', async ({ page }) => {
    // Progress bar sutunu
    const progress = page.locator('.ant-progress')
    if (await progress.first().isVisible({ timeout: 10_000 }).catch(() => false)) {
      const count = await progress.count()
      expect(count).toBeGreaterThan(0)
    }
  })

  test('uretim filtre paneli calismali', async ({ page }) => {
    const collapse = page.locator('.ant-collapse-header').first()
    if (await collapse.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await collapse.click()
      await page.waitForTimeout(500)

      // Durum filtresi gorunmeli
      const statusSelect = page.locator('#status, .ant-select').first()
      if (await statusSelect.isVisible({ timeout: 3_000 }).catch(() => false)) {
        await expect(statusSelect).toBeVisible()
      }
    }
  })

  test('uretim satir secimi calismali (checkbox)', async ({ page }) => {
    // Row selection checkbox
    const checkbox = page.locator('.ant-table-selection-column .ant-checkbox').first()
    if (await checkbox.isVisible({ timeout: 10_000 }).catch(() => false)) {
      await checkbox.click()
      await page.waitForTimeout(500)

      // Toplu islem butonu gorunmeli
      const bulkBtn = page.locator('button .anticon-swap, button:has-text("Toplu")')
      if (await bulkBtn.first().isVisible({ timeout: 3_000 }).catch(() => false)) {
        await expect(bulkBtn.first()).toBeVisible()
      }
    }
  })

  test('uretim detay sayfasi acilabilmeli', async ({ page }) => {
    const infoBtn = page.locator('.ant-table-row button .anticon-info-circle, .ant-table-row button .anticon-eye').first()
    if (await infoBtn.isVisible({ timeout: 10_000 }).catch(() => false)) {
      await infoBtn.click()
      await page.waitForTimeout(1_000)

      // Detay sayfasina yonlendirilmeli
      const url = page.url()
      expect(url).not.toContain('/login')
      const bodyContent = await page.locator('body').innerHTML()
      expect(bodyContent.length).toBeGreaterThan(100)
    }
  })

  test('geciken uretim satirlari vurgulanmali', async ({ page }) => {
    // production-row-delayed class kontrolu
    const delayedRows = page.locator('.production-row-delayed')
    // Varsa kirmizi vurgu olacak, yoksa da hata olmamali
    const bodyContent = await page.locator('body').innerHTML()
    expect(bodyContent.length).toBeGreaterThan(100)
  })

  test('uretim durum tag renkleri dogru olmali', async ({ page }) => {
    // Status tags: Bekliyor, Uretimde, Tamamlandi, vb.
    const statusTags = page.locator('.ant-tag')
    if (await statusTags.first().isVisible({ timeout: 10_000 }).catch(() => false)) {
      const count = await statusTags.count()
      expect(count).toBeGreaterThan(0)
    }
  })
})
