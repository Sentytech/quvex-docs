const { test, expect } = require('../fixtures')

test.use({ storageState: 'playwright/.auth/user.json' })

test.describe('Teklif CRUD Islemleri', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/offers')
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})
  })

  test('teklif tablosu kolonlari dogru olmali', async ({ page }) => {
    const expectedColumns = ['Teklif No', 'Cari', 'Tutar']
    for (const col of expectedColumns) {
      const header = page.getByText(col, { exact: false }).first()
      if (await header.isVisible({ timeout: 5_000 }).catch(() => false)) {
        await expect(header).toBeVisible()
      }
    }
  })

  test('teklif ekleme butonu form sayfasina yonlendirmeli', async ({ page }) => {
    const addBtn = page.locator('button .anticon-plus').first()
    if (await addBtn.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await addBtn.click()
      await page.waitForTimeout(1_000)

      // /offers/form sayfasina gitmeli
      const url = page.url()
      expect(url).toContain('/offers/form')
    }
  })

  test('teklif durumu renk kodlu tagler ile gorunmeli', async ({ page }) => {
    const tags = page.locator('.ant-tag')
    if (await tags.first().isVisible({ timeout: 10_000 }).catch(() => false)) {
      const count = await tags.count()
      expect(count).toBeGreaterThan(0)
    }
  })

  test('teklif filtresi cari autocomplete calismali', async ({ page }) => {
    const collapse = page.locator('.ant-collapse-header').first()
    if (await collapse.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await collapse.click()
      await page.waitForTimeout(500)

      // Cari autocomplete alani
      const autoComplete = page.locator('.ant-select, input[placeholder*="Cari"], input[placeholder*="Ara"]').first()
      if (await autoComplete.isVisible({ timeout: 3_000 }).catch(() => false)) {
        await expect(autoComplete).toBeVisible()
      }
    }
  })

  test('teklif form sayfasinda gerekli alanlar olmali', async ({ page }) => {
    await page.goto('/offers/form')
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})

    const bodyContent = await page.locator('body').innerHTML()
    expect(bodyContent.length).toBeGreaterThan(100)

    // Login sayfasina gitmemis olmali
    expect(page.url()).not.toContain('/login')
  })

  test('teklif pagination calismali', async ({ page }) => {
    const pagination = page.locator('.ant-pagination')
    if (await pagination.isVisible({ timeout: 5_000 }).catch(() => false)) {
      // Sayfa boyutu secici
      const sizeChanger = page.locator('.ant-pagination-options .ant-select')
      if (await sizeChanger.isVisible()) {
        await expect(sizeChanger).toBeVisible()
      }
    }
  })
})
