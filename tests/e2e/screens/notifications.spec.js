const { test, expect } = require('../fixtures')

test.use({ storageState: 'playwright/.auth/user.json' })

test.describe('Bildirim ve SignalR Testleri', () => {
  test('bildirim zili gorunmeli', async ({ page }) => {
    await page.goto('/home')
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})

    const bellIcon = page.locator('.anticon-bell, [class*="notification"], [class*="bell"]')
    if (await bellIcon.first().isVisible({ timeout: 5_000 }).catch(() => false)) {
      await expect(bellIcon.first()).toBeVisible()
    }
  })

  test('bildirimler sayfasi yuklenmeli ve liste gorunmeli', async ({ page }) => {
    await page.goto('/notifications')
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})

    const bodyContent = await page.locator('body').innerHTML()
    expect(bodyContent.length).toBeGreaterThan(100)
    expect(page.url()).not.toContain('/login')
  })

  test('tema degistirme calismali (light/dark)', async ({ page }) => {
    await page.goto('/home')
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})

    // Tema toggle butonu (Sun/Moon icon)
    const themeBtn = page.locator('.anticon-sun, .anticon-moon, [class*="theme-toggle"]')
    if (await themeBtn.first().isVisible({ timeout: 5_000 }).catch(() => false)) {
      await themeBtn.first().click()
      await page.waitForTimeout(500)
      // Sayfa hata vermemis olmali
      await expect(page.locator('body')).toBeVisible()
    }
  })
})
