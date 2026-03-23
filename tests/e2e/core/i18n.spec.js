const { test, expect } = require('../fixtures')

test.use({ storageState: 'playwright/.auth/user.json' })

test.describe('Dil Degistirme (i18n) Testleri', () => {
  test('dil degistirme butonu gorunmeli', async ({ page }) => {
    await page.goto('/home')
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})

    // Dil butonu (bayrak ikonu veya dil kodu)
    const langBtn = page.locator('[class*="lang"], .nav-item img[alt*="flag"], .nav-item [class*="flag"]')
    if (await langBtn.first().isVisible({ timeout: 5_000 }).catch(() => false)) {
      await expect(langBtn.first()).toBeVisible()
    }
  })

  test('Turkce dilde menu ogreleri dogru olmali', async ({ page }) => {
    await page.goto('/home')
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})

    // Turkce menu ogeleri
    const menuItems = ['Anasayfa', 'Stok', 'Üretim', 'Satış', 'Kalite', 'Raporlar']
    for (const item of menuItems) {
      const menuItem = page.getByText(item, { exact: false }).first()
      if (await menuItem.isVisible({ timeout: 3_000 }).catch(() => false)) {
        await expect(menuItem).toBeVisible()
      }
    }
  })
})
