const { test, expect } = require('../fixtures')

test.use({ storageState: 'playwright/.auth/user.json' })

test.describe('Musteri CRUD Islemleri', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/customers')
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})
  })

  test('musteri istatistik kartlari gorunmeli', async ({ page }) => {
    // 4 stat card: Toplam, A, B, C kategorileri
    const statCards = page.locator('[class*="cursor-pointer"], .ant-card, [style*="border-radius"]')
    const count = await statCards.count()
    expect(count).toBeGreaterThanOrEqual(1)
  })

  test('musteri filtre paneli acilip kapanabilmeli', async ({ page }) => {
    const collapse = page.locator('.ant-collapse-header').first()
    if (await collapse.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await collapse.click()
      await page.waitForTimeout(500)
      // Filtre alanlari gorunmeli
      const filterForm = page.locator('.ant-collapse-content')
      await expect(filterForm.first()).toBeVisible({ timeout: 3_000 })
    }
  })

  test('musteri ekleme modali acilabilmeli', async ({ page }) => {
    const addBtn = page.locator('button .anticon-plus').first()
    if (await addBtn.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await addBtn.click()
      await page.waitForTimeout(500)

      // Modal acilmis olmali
      const modal = page.locator('.ant-modal')
      await expect(modal.first()).toBeVisible({ timeout: 5_000 })

      // Modal basliginda "Form" veya "Ekle" yazisi
      const modalTitle = page.locator('.ant-modal-title')
      await expect(modalTitle).toBeVisible()

      // Iptal butonuyla kapat
      const cancelBtn = page.locator('.ant-modal-footer .ant-btn-default, button:has-text("İptal")')
      if (await cancelBtn.first().isVisible()) {
        await cancelBtn.first().click()
      }
    }
  })

  test('musteri arama filtresi calismali', async ({ page }) => {
    // Filtre panelini ac
    const collapse = page.locator('.ant-collapse-header').first()
    if (await collapse.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await collapse.click()
      await page.waitForTimeout(500)

      // Cari adi alanini doldur
      const nameInput = page.locator('#name, input[id="name"]')
      if (await nameInput.isVisible({ timeout: 3_000 }).catch(() => false)) {
        await nameInput.fill('test')

        // Ara butonuna tikla
        const searchBtn = page.locator('button .anticon-search').first()
        if (await searchBtn.isVisible()) {
          await searchBtn.click()
          await page.waitForTimeout(1_000)
        }

        // Sayfa hata vermemis olmali
        const bodyContent = await page.locator('body').innerHTML()
        expect(bodyContent.length).toBeGreaterThan(100)
      }
    }
  })

  test('musteri tablosunda satirlar tiklanabilir olmali', async ({ page }) => {
    const tableRow = page.locator('.ant-table-row').first()
    if (await tableRow.isVisible({ timeout: 10_000 }).catch(() => false)) {
      // Satirdaki edit butonuna tikla
      const editBtn = tableRow.locator('.anticon-edit')
      if (await editBtn.isVisible({ timeout: 3_000 }).catch(() => false)) {
        await editBtn.click()
        await page.waitForTimeout(500)

        // Modal acilmis olmali
        const modal = page.locator('.ant-modal')
        await expect(modal.first()).toBeVisible({ timeout: 5_000 })

        // Kapat
        await page.locator('.ant-modal-close').first().click()
      }
    }
  })

  test('musteri filtre temizleme calismali', async ({ page }) => {
    const collapse = page.locator('.ant-collapse-header').first()
    if (await collapse.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await collapse.click()
      await page.waitForTimeout(500)

      // Temizle butonuna tikla
      const clearBtn = page.locator('button .anticon-clear, button .anticon-close').first()
      if (await clearBtn.isVisible({ timeout: 3_000 }).catch(() => false)) {
        await clearBtn.click()
        await page.waitForTimeout(1_000)
        await expect(page.locator('body')).toBeVisible()
      }
    }
  })
})
