/**
 * Elektronik Kart Montaj — Test tenant temizleme
 * Çalıştırma: npx playwright test --config=playwright.config.js cleanup-tenants.spec.js
 */
const { test: base, expect } = require('@playwright/test')

const SUPER_ADMIN = { email: 'admin@quvex.com', password: 'Admin123!@#$' }
const API = 'https://api.quvex.io'

// Her test koşumundan sonra buraya ID ekle (elektronik-tenant.json'dan bakarak)
const TEST_TENANT_IDS = [
  // Örnek: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', // elektronikXXXXXX tenant
]

base('Elektronik kart montaj test tenantlarini sil', async ({ page }) => {
  if (TEST_TENANT_IDS.length === 0) {
    console.log('[cleanup] Silinecek tenant yok.')
    return
  }

  await page.goto('/login')
  await page.waitForLoadState('domcontentloaded')
  const emailInput = page.locator('input[name="loginEmail"]')
  await expect(emailInput).toBeVisible({ timeout: 15_000 })
  await emailInput.fill(SUPER_ADMIN.email)
  await page.locator('input[name="password"]').fill(SUPER_ADMIN.password)
  await page.locator('button.qx-login-btn').click()
  await expect(page).toHaveURL(/admin\/dashboard|home/, { timeout: 20_000 })

  const token = await page.evaluate(() => {
    const t = sessionStorage.getItem('accessToken')
    if (t) return t
    for (let i = 0; i < sessionStorage.length; i++) {
      const v = sessionStorage.getItem(sessionStorage.key(i))
      if (v && v.length > 10 && !v.startsWith('{')) return v
    }
    return null
  })
  if (!token) { console.warn('[cleanup] Token yok'); return }

  let deleted = 0
  for (const tenantId of TEST_TENANT_IDS) {
    const res = await page.evaluate(async ({ id, tok, api }) => {
      const r = await fetch(`${api}/tenant-admin/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${tok}`, 'X-Requested-With': 'XMLHttpRequest' },
      })
      return { status: r.status }
    }, { id: tenantId, tok: token, api: API })

    if ([200, 204, 404].includes(res.status)) {
      console.log(`[cleanup] ✅ ${tenantId} (${res.status})`)
      deleted++
    } else {
      console.warn(`[cleanup] ❌ ${tenantId} — status ${res.status}`)
    }
  }
  console.log(`[cleanup] ${deleted}/${TEST_TENANT_IDS.length} temizlendi.`)
  expect(deleted).toBe(TEST_TENANT_IDS.length)
})
