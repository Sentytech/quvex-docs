const { test, expect } = require('../fixtures')

test.use({ storageState: 'playwright/.auth/user.json' })

test.describe('Responsive Tasarim Testleri', () => {
  const viewports = [
    { name: 'Desktop (1920x1080)', width: 1920, height: 1080 },
    { name: 'Laptop (1366x768)', width: 1366, height: 768 },
    { name: 'Tablet (768x1024)', width: 768, height: 1024 },
    { name: 'Mobile (375x812)', width: 375, height: 812 },
  ]

  for (const vp of viewports) {
    test(`Dashboard ${vp.name} goruntulenmeli`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height })
      await page.goto('/home')
      await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})

      await expect(page).toHaveURL(/home/)
      // Sayfa hata vermemis olmali
      const bodyContent = await page.locator('body').innerHTML()
      expect(bodyContent.length).toBeGreaterThan(100)
    })
  }

  test('login sayfasi mobil gorunumde calismali', async ({ browser }) => {
    // Auth olmadan tamamen temiz context olustur
    const context = await browser.newContext({
      viewport: { width: 375, height: 812 },
      storageState: undefined, // storageState'i sifirla
    })
    const page = await context.newPage()

    // Auth tokenlarini temizle
    await page.goto('/login')
    await page.evaluate(() => {
      sessionStorage.clear()
      localStorage.clear()
    })
    await page.goto('/login')
    await page.waitForLoadState('networkidle', { timeout: 10_000 }).catch(() => {})

    await expect(page.locator('input[name="loginEmail"]')).toBeVisible({ timeout: 10_000 })
    await expect(page.locator('input[name="password"]')).toBeVisible()
    await expect(page.locator('button.qx-login-btn')).toBeVisible()

    await context.close()
  })
})
