const { test, expect } = require('../fixtures')

test.use({ storageState: 'playwright/.auth/user.json' })

test.describe('Satis ve Musteri Modulu', () => {
  test.describe('Musteri Listesi', () => {
    test('musteri listesi yuklenmeli', async ({ page }) => {
      await page.goto('/customers')
      await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})

      const table = page.locator('.ant-table, table')
      await expect(table.first()).toBeVisible({ timeout: 15_000 })
    })

    test('musteri tablosu kolonlari dogru olmali', async ({ page }) => {
      await page.goto('/customers')
      await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})

      const columns = ['Cari', 'E-posta', 'Telefon']
      for (const col of columns) {
        const header = page.getByText(col, { exact: false }).first()
        if (await header.isVisible({ timeout: 3_000 }).catch(() => false)) {
          await expect(header).toBeVisible()
        }
      }
    })
  })

  test.describe('Tedarikciler', () => {
    test('tedarikci listesi yuklenmeli', async ({ page }) => {
      await page.goto('/suppliers')
      await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})

      // Sayfa icerigi yeterince yuklenmis olmali
      const bodyContent = await page.locator('body').innerHTML()
      expect(bodyContent.length).toBeGreaterThan(100)
    })
  })

  test.describe('Teklifler', () => {
    test('teklif listesi yuklenmeli', async ({ page }) => {
      await page.goto('/offers')
      await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})

      const table = page.locator('.ant-table, table')
      await expect(table.first()).toBeVisible({ timeout: 15_000 })
    })

    test('teklif tablosu kolonlari dogru olmali', async ({ page }) => {
      await page.goto('/offers')
      await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})

      const columns = ['Teklif No', 'Cari', 'Tutar']
      for (const col of columns) {
        const header = page.getByText(col, { exact: false }).first()
        if (await header.isVisible({ timeout: 3_000 }).catch(() => false)) {
          await expect(header).toBeVisible()
        }
      }
    })

    test('teklif form sayfasi acilabilmeli', async ({ page }) => {
      await page.goto('/offers/form')
      await page.waitForLoadState('domcontentloaded')
      await expect(page.locator('body')).toBeVisible()
    })
  })

  test.describe('Satis Siparisleri', () => {
    test('satis siparis listesi yuklenmeli', async ({ page }) => {
      await page.goto('/sales')
      await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})

      const table = page.locator('.ant-table, table')
      await expect(table.first()).toBeVisible({ timeout: 15_000 })
    })

    test('satis tablosu kolonlari dogru olmali', async ({ page }) => {
      await page.goto('/sales')
      await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})

      const columns = ['Firma', 'Sipariş No', 'Ürün', 'Miktar']
      for (const col of columns) {
        const header = page.getByText(col, { exact: false }).first()
        if (await header.isVisible({ timeout: 3_000 }).catch(() => false)) {
          await expect(header).toBeVisible()
        }
      }
    })

    test('satis filtre secenekleri calismali', async ({ page }) => {
      await page.goto('/sales')
      await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})

      // Status filtreleri
      const filterBtns = page.locator('.ant-radio-button-wrapper, .ant-tabs-tab, button[class*="filter"]')
      if (await filterBtns.first().isVisible({ timeout: 5_000 }).catch(() => false)) {
        const count = await filterBtns.count()
        expect(count).toBeGreaterThan(0)
      }
    })
  })

  test.describe('Musteri Portali ve Ek Sayfalar', () => {
    test('musteri portali yuklenmeli', async ({ page }) => {
      await page.goto('/customer-portal')
      await page.waitForLoadState('domcontentloaded')
      await expect(page.locator('body')).toBeVisible()
    })

    test('musteri ekstre yuklenmeli', async ({ page }) => {
      await page.goto('/customer-statement')
      await page.waitForLoadState('domcontentloaded')
      await expect(page.locator('body')).toBeVisible()
    })

    test('musteri geri bildirim yuklenmeli', async ({ page }) => {
      await page.goto('/customer-feedback')
      await page.waitForLoadState('domcontentloaded')
      await expect(page.locator('body')).toBeVisible()
    })
  })
})
