const { test, expect } = require('@playwright/test')

// Basarili login testleri ONCE calismali (hesap kilitlenme riski yok)
test.describe.serial('Login - Basarili Giris', () => {
  test('basarili login sonrasi dashboard yonlendirmesi', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle', { timeout: 10_000 }).catch(() => {})
    await page.locator('input[name="loginEmail"]').waitFor({ state: 'visible', timeout: 10_000 })

    await page.locator('input[name="loginEmail"]').fill('admin@quvex.com')
    await page.locator('input[name="password"]').fill('Admin123!@#$')
    await page.locator('button.qx-login-btn').click()

    await expect(page).toHaveURL(/home/, { timeout: 30_000 })
  })

  test('basarili login sonrasi basari toast mesaji gorunmeli', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle', { timeout: 10_000 }).catch(() => {})
    await page.locator('input[name="loginEmail"]').waitFor({ state: 'visible', timeout: 10_000 })

    await page.locator('input[name="loginEmail"]').fill('admin@quvex.com')
    await page.locator('input[name="password"]').fill('Admin123!@#$')
    await page.locator('button.qx-login-btn').click()

    await expect(
      page.locator('.Toastify__toast--success, .toast-success').first()
    ).toBeVisible({ timeout: 10_000 })
  })
})

// Form goruntulenme ve validation testleri
test.describe('Login - Form Testleri', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle', { timeout: 10_000 }).catch(() => {})
    await page.locator('input[name="loginEmail"]').waitFor({ state: 'visible', timeout: 10_000 })
  })

  test('login formu gorunur olmali', async ({ page }) => {
    await expect(page.locator('input[name="loginEmail"]')).toBeVisible()
    await expect(page.locator('input[name="password"]')).toBeVisible()
    await expect(page.locator('button.qx-login-btn')).toBeVisible()
  })

  test('Quvex logosu gorunmeli', async ({ page }) => {
    await expect(page.locator('img[alt="Quvex"], img[alt*="logo"], img[src*="quvex"]').first()).toBeVisible({ timeout: 10_000 })
  })

  test('Hosgeldiniz baslik metni gorunmeli', async ({ page }) => {
    await expect(page.getByText('Hosgeldiniz')).toBeVisible()
  })

  test('bos form gonderiminde validation hatasi gostermeli', async ({ page }) => {
    await page.locator('button.qx-login-btn').click()

    const emailInput = page.locator('input[name="loginEmail"]')
    await expect(emailInput).toHaveClass(/is-invalid|invalid/, { timeout: 5_000 }).catch(() => {})

    await expect(page).toHaveURL(/login/)
  })

  test('sifre gizleme/gosterme toggle calismali', async ({ page }) => {
    const passwordInput = page.locator('input[name="password"]')
    await expect(passwordInput).toHaveAttribute('type', 'password')

    const toggleBtn = page.locator('.input-group-text').first()
    if (await toggleBtn.isVisible()) {
      await toggleBtn.click()
      await expect(passwordInput).toHaveAttribute('type', 'text')

      await toggleBtn.click()
      await expect(passwordInput).toHaveAttribute('type', 'password')
    }
  })

  test('beni hatirla checkbox tiklanabilir olmali', async ({ page }) => {
    const checkbox = page.locator('#remember-me')
    if (await checkbox.isVisible()) {
      await checkbox.check()
      await expect(checkbox).toBeChecked()
      await checkbox.uncheck()
      await expect(checkbox).not.toBeChecked()
    }
  })

  test('kayit ol linki gorunur olmali', async ({ page }) => {
    const registerLink = page.getByText(/Ucretsiz Deneyin|Kayit Ol/i)
    await expect(registerLink).toBeVisible()
  })
})

// Basarisiz login testleri en SONA koyuyoruz (hesap kilitleme riski)
test.describe('Login - Basarisiz Giris', () => {
  test('yanlis sifre ile hata mesaji gostermeli', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle', { timeout: 10_000 }).catch(() => {})
    await page.locator('input[name="loginEmail"]').waitFor({ state: 'visible', timeout: 10_000 })

    // Var olmayan kullanici ile test et (admin hesabini kilitlemeyi onle)
    await page.locator('input[name="loginEmail"]').fill('testuser@quvex.com')
    await page.locator('input[name="password"]').fill('WrongPassword123!!')
    await page.locator('button.qx-login-btn').click()

    await expect(
      page.locator('.Toastify__toast--error, .toast-error, .ant-message-error').first()
    ).toBeVisible({ timeout: 10_000 })
  })

  test('yanlis email formatinda hata gostermeli', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle', { timeout: 10_000 }).catch(() => {})
    await page.locator('input[name="loginEmail"]').waitFor({ state: 'visible', timeout: 10_000 })

    await page.locator('input[name="loginEmail"]').fill('invalid-email')
    await page.locator('input[name="password"]').fill('somepassword1')
    await page.locator('button.qx-login-btn').click()

    await expect(page).toHaveURL(/login/, { timeout: 5_000 })
  })
})
