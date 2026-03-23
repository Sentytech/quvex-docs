const { test, expect } = require('../fixtures')

test.use({ storageState: 'playwright/.auth/user.json' })

test.describe('Guvenlik - Auth Sonrasi Testleri', () => {
  test('accessToken localStorage da olmamali (sessionStorage korunmasi)', async ({ page }) => {
    await page.goto('/home')
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})

    const localToken = await page.evaluate(() => localStorage.getItem('accessToken'))
    expect(localToken).toBeNull()
  })

  test('sessionStorage da accessToken olmali', async ({ page }) => {
    await page.goto('/home')
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})

    const sessionToken = await page.evaluate(() => sessionStorage.getItem('accessToken'))
    expect(sessionToken).not.toBeNull()
  })
})
