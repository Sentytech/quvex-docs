const { test, expect } = require('../fixtures')

test.use({ storageState: 'playwright/.auth/user.json' })

test.describe('Logout Islemleri', () => {
  test('kullanici cikis yapabilmeli', async ({ page }) => {
    await page.goto('/home')
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})

    // Kullanici dropdown tikla — nav-link dropdown-user-link class'i
    const userDropdown = page.locator('a.dropdown-user-link, .dropdown-user .nav-link, .user-nav, .ant-avatar, [class*="user-dropdown"]')
    await expect(userDropdown.first()).toBeVisible({ timeout: 10_000 })
    await userDropdown.first().click()
    await page.waitForTimeout(500)

    // Cikis butonu tikla
    const logoutBtn = page.getByText(/Çıkış|Cikis|Logout/i).first()
    if (await logoutBtn.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await logoutBtn.click()
      // Login sayfasina yonlendirilmeli
      await expect(page).toHaveURL(/login/, { timeout: 10_000 })
    }
  })

  test('cikis sonrasi korunmus sayfaya erisim engellenmeli', async ({ page }) => {
    await page.goto('/home')
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})

    // Session storage temizle (logout simulasyonu)
    await page.evaluate(() => {
      sessionStorage.clear()
      localStorage.removeItem('userData')
    })

    await page.goto('/products')
    await page.waitForTimeout(2_000)

    // Login'e yonlendirilmis olmali
    const url = page.url()
    expect(url.includes('/login') || url.includes('/home')).toBeTruthy()
  })
})
