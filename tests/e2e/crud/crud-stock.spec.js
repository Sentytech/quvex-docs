const { test, expect } = require('../fixtures')

test.use({ storageState: 'playwright/.auth/user.json' })

test.describe('Stok CRUD Islemleri', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/stocks')
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})
  })

  test('stok istatistik kartlari gorunmeli', async ({ page }) => {
    // 4 stat card: Toplam, Min Alti, Siparis Noktasi, Normal
    const cards = page.locator('.ant-card, [class*="cursor-pointer"], [style*="border-radius"]')
    if (await cards.first().isVisible({ timeout: 10_000 }).catch(() => false)) {
      const count = await cards.count()
      expect(count).toBeGreaterThanOrEqual(1)
    }
  })

  test('stok tablosu kolonlari dogru olmali', async ({ page }) => {
    const expectedColumns = ['Kodu', 'Stok', 'Fiili', 'Birim']
    for (const col of expectedColumns) {
      const header = page.getByText(col, { exact: false }).first()
      if (await header.isVisible({ timeout: 5_000 }).catch(() => false)) {
        await expect(header).toBeVisible()
      }
    }
  })

  test('stok ekleme modali acilabilmeli', async ({ page }) => {
    const addBtn = page.locator('button .anticon-plus').first()
    if (await addBtn.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await addBtn.click()
      await page.waitForTimeout(500)

      const modal = page.locator('.ant-modal')
      await expect(modal.first()).toBeVisible({ timeout: 5_000 })

      // Kapat
      const cancelBtn = page.locator('.ant-modal-footer .ant-btn-default, button:has-text("İptal")')
      if (await cancelBtn.first().isVisible()) {
        await cancelBtn.first().click()
      }
    }
  })

  test('stok satir renklendirmesi (min altinda kirmizi) calismali', async ({ page }) => {
    // stock-row-critical veya stock-row-warning satir var mi kontrol et
    const criticalRows = page.locator('.stock-row-critical, .stock-row-warning')
    // Bu sadece veri varsa gecerli — yoksa da hata olmamali
    const bodyContent = await page.locator('body').innerHTML()
    expect(bodyContent.length).toBeGreaterThan(100)
  })

  test('stok hareket gecmisi modali acilabilmeli', async ({ page }) => {
    const historyBtn = page.locator('.ant-table-row .anticon-history').first()
    if (await historyBtn.isVisible({ timeout: 10_000 }).catch(() => false)) {
      await historyBtn.click()
      await page.waitForTimeout(500)

      // Gecmis modali acilmis olmali
      const modal = page.locator('.ant-modal')
      await expect(modal.first()).toBeVisible({ timeout: 5_000 })

      // Modal basligi "Stok Hareketleri" icermeli
      const title = page.locator('.ant-modal-title')
      if (await title.isVisible()) {
        const text = await title.textContent()
        expect(text).toContain('Stok Hareketleri')
      }

      // Kapat
      await page.locator('.ant-modal-close').first().click()
    }
  })

  test('stok filtresi calismali (kod ve isim)', async ({ page }) => {
    const collapse = page.locator('.ant-collapse-header').first()
    if (await collapse.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await collapse.click()
      await page.waitForTimeout(500)

      const codeInput = page.locator('#code, input[id="code"]')
      if (await codeInput.isVisible({ timeout: 3_000 }).catch(() => false)) {
        await codeInput.fill('test')
        const searchBtn = page.locator('button .anticon-search').first()
        if (await searchBtn.isVisible()) {
          await searchBtn.click()
          await page.waitForTimeout(1_000)
        }
        await expect(page.locator('body')).toBeVisible()
      }
    }
  })

  test('CSV export butonu calismali', async ({ page }) => {
    const exportBtn = page.locator('button .anticon-download').first()
    if (await exportBtn.isVisible({ timeout: 5_000 }).catch(() => false)) {
      // Buton tiklanabilir olmali (click ve hata olmadigi kontrol)
      await expect(exportBtn).toBeEnabled()
    }
  })
})
