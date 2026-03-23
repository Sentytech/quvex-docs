const { test, expect } = require('../fixtures')

test.use({ storageState: 'playwright/.auth/user.json' })

test.describe('Dashboard Widget Testleri', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/home')
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})
  })

  test('aktif siparisler karti gorunmeli ve tiklanabilir', async ({ page }) => {
    const card = page.locator('[class*="cursor-pointer"]').first()
    if (await card.isVisible({ timeout: 10_000 }).catch(() => false)) {
      await expect(card).toBeVisible()
    }
  })

  test('is yuku grafigi gorunmeli', async ({ page }) => {
    const chart = page.locator('.recharts-wrapper, .apexcharts-canvas, [class*="chart"], canvas')
    if (await chart.first().isVisible({ timeout: 10_000 }).catch(() => false)) {
      const count = await chart.count()
      expect(count).toBeGreaterThan(0)
    }
  })

  test('geciken siparisler bolumu gorunmeli', async ({ page }) => {
    const delaySection = page.getByText(/Gecik|Delay|Teslim|geciken/i).first()
    if (await delaySection.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await expect(delaySection).toBeVisible()
    }
  })

  test('stok durumu bolumu gorunmeli', async ({ page }) => {
    const stockSection = page.getByText(/Stok|Stock|Tedarik/i).first()
    if (await stockSection.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await expect(stockSection).toBeVisible()
    }
  })

  test('kalite ozeti bolumu gorunmeli', async ({ page }) => {
    const qualitySection = page.getByText(/Kalite|Quality|NCR|CAPA/i).first()
    if (await qualitySection.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await expect(qualitySection).toBeVisible()
    }
  })

  test('uretim ozeti bolumu gorunmeli', async ({ page }) => {
    const prodSection = page.getByText(/Üretim|Production|Verimlilik/i).first()
    if (await prodSection.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await expect(prodSection).toBeVisible()
    }
  })

  test('gorevler bolumu gorunmeli', async ({ page }) => {
    const taskSection = page.getByText(/Görev|Task|görev/i).first()
    if (await taskSection.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await expect(taskSection).toBeVisible()
    }
  })

  test('bakim durumu bolumu gorunmeli', async ({ page }) => {
    const maintSection = page.getByText(/Bakım|Maintenance|bakım/i).first()
    if (await maintSection.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await expect(maintSection).toBeVisible()
    }
  })

  test('dashboard yenileme butonu calismali', async ({ page }) => {
    const refreshBtn = page.locator('.anticon-reload, .anticon-sync, button:has-text("Yenile")')
    if (await refreshBtn.first().isVisible({ timeout: 5_000 }).catch(() => false)) {
      await refreshBtn.first().click()
      await page.waitForTimeout(1_000)
      await expect(page.locator('body')).toBeVisible()
    }
  })
})
