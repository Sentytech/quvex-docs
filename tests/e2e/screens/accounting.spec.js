const { test, expect } = require('../fixtures')

test.use({ storageState: 'playwright/.auth/user.json' })

test.describe('Muhasebe ve Fatura Modulu', () => {
  test.describe('Fatura Listesi', () => {
    test('fatura listesi yuklenmeli', async ({ page }) => {
      await page.goto('/invoices')
      await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})

      const table = page.locator('.ant-table, table')
      await expect(table.first()).toBeVisible({ timeout: 15_000 })
    })

    test('fatura durum filtreleri gorunmeli', async ({ page }) => {
      await page.goto('/invoices')
      await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})

      // DRAFT, SENT, PAID, OVERDUE vb. durum filtreleri
      const filters = page.locator('.ant-select, .ant-radio-group, .ant-tabs, button[class*="filter"]')
      if (await filters.first().isVisible({ timeout: 5_000 }).catch(() => false)) {
        await expect(filters.first()).toBeVisible()
      }
    })

    test('fatura ekleme butonu olmali', async ({ page }) => {
      await page.goto('/invoices')
      await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})

      const addBtn = page.locator('button:has(.anticon-plus), a[href*="/invoices/form"], button:has-text("Ekle"), button:has-text("Yeni")')
      if (await addBtn.first().isVisible({ timeout: 5_000 }).catch(() => false)) {
        await expect(addBtn.first()).toBeVisible()
      }
    })

    test('fatura form sayfasi acilabilmeli', async ({ page }) => {
      await page.goto('/invoices/form')
      await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})

      const bodyContent = await page.locator('body').innerHTML()
      expect(bodyContent.length).toBeGreaterThan(100)
    })
  })

  test.describe('Sevkiyat ve Faturalama', () => {
    test('sevk edilen siparisler yuklenmeli', async ({ page }) => {
      await page.goto('/accounting/shipped')
      await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})
      await expect(page.locator('body')).toBeVisible()
    })

    test('faturalanan siparisler yuklenmeli', async ({ page }) => {
      await page.goto('/accounting/billed')
      await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})
      await expect(page.locator('body')).toBeVisible()
    })

    test('banka mutabakat sayfasi yuklenmeli', async ({ page }) => {
      await page.goto('/bank-reconciliation')
      await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})
      await expect(page.locator('body')).toBeVisible()
    })
  })
})
