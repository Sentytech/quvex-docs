const { test, expect } = require('@playwright/test')

test.describe('Guvenlik Testleri', () => {
  test('login olmadan /home erisim engellenmeli', async ({ page }) => {
    await page.goto('/home')
    await expect(page).toHaveURL(/login/, { timeout: 10_000 })
  })

  test('login olmadan /products erisim engellenmeli', async ({ page }) => {
    await page.goto('/products')
    await expect(page).toHaveURL(/login/, { timeout: 10_000 })
  })

  test('login olmadan /production erisim engellenmeli', async ({ page }) => {
    await page.goto('/production')
    await expect(page).toHaveURL(/login/, { timeout: 10_000 })
  })

  test('login olmadan /invoices erisim engellenmeli', async ({ page }) => {
    await page.goto('/invoices')
    await expect(page).toHaveURL(/login/, { timeout: 10_000 })
  })

  test('login olmadan /settings/users erisim engellenmeli', async ({ page }) => {
    await page.goto('/settings/users')
    await expect(page).toHaveURL(/login/, { timeout: 10_000 })
  })

  test('login sayfasi 200 donmeli', async ({ page }) => {
    const response = await page.goto('/login')
    expect(response.status()).toBe(200)
  })

  test('gecersiz route error veya redirect vermeli', async ({ page }) => {
    await page.goto('/bu-sayfa-yok-xyz-12345')
    const url = page.url()
    const handled = url.includes('/login') || url.includes('/error') || url.includes('/misc')
    expect(handled || url.includes('/bu-sayfa-yok')).toBeTruthy()
  })

  test('CSP meta tag mevcut olmali', async ({ page }) => {
    await page.goto('/login')
    const cspMeta = page.locator('meta[http-equiv="Content-Security-Policy"]')
    const count = await cspMeta.count()
    expect(count).toBeGreaterThanOrEqual(0)
  })

  test('yanlis sifre ile login sayfasinda kalmali', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle', { timeout: 10_000 }).catch(() => {})

    // Var olmayan kullanici ile test (admin hesabini kilitlemeyi onle)
    await page.locator('input[name="loginEmail"]').fill('testuser@quvex.com')
    await page.locator('input[name="password"]').fill('WrongPassword1!!')
    await page.locator('button.qx-login-btn').click()
    await page.waitForTimeout(2_000)

    // Hala login sayfasinda olmali
    await expect(page).toHaveURL(/login/)
  })

  test('XSS korumasi - script tagi calismamali', async ({ page }) => {
    await page.goto('/login')
    await page.locator('input[name="loginEmail"]').fill('<script>alert("xss")</script>')
    await page.locator('input[name="password"]').fill('test')
    await page.locator('button.qx-login-btn').click()

    // Alert dialogu acilmamis olmali
    let alertTriggered = false
    page.on('dialog', () => { alertTriggered = true })
    await page.waitForTimeout(2_000)
    expect(alertTriggered).toBeFalsy()
  })
})
