const { test: setup, expect } = require('@playwright/test')
const path = require('path')
const fs = require('fs')

const authFile = path.join(__dirname, '../../playwright/.auth/user.json')
const sessionFile = path.join(__dirname, '../../playwright/.auth/session.json')

setup('authenticate', async ({ page }) => {
  // Login sayfasina git
  await page.goto('/login')
  await page.waitForLoadState('networkidle', { timeout: 10_000 }).catch(() => {})

  // Formu doldur
  const emailInput = page.locator('input[name="loginEmail"]')
  await expect(emailInput).toBeVisible({ timeout: 10_000 })
  await emailInput.fill('admin@quvex.com')
  await page.locator('input[name="password"]').fill('Admin123!@#$')

  // Login butonuna tikla
  await page.locator('button.qx-login-btn').click()

  // Dashboard'a yonlendirilmesini bekle (daha uzun timeout)
  await expect(page).toHaveURL(/home/, { timeout: 30_000 })

  // Sayfanin tam yuklendiginden emin ol
  await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})

  // sessionStorage tokenlarini kaydet
  const sessionData = await page.evaluate(() => {
    const data = {}
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i)
      data[key] = sessionStorage.getItem(key)
    }
    return data
  })

  fs.writeFileSync(sessionFile, JSON.stringify(sessionData, null, 2))

  // localStorage + cookies kaydet
  await page.context().storageState({ path: authFile })
})
