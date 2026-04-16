/**
 * Test tenant temizleme scripti
 * Super admin ile login olup test tenantlari siler.
 * Calistirma: NODE_PATH=... playwright test --config=playwright.config.js cleanup-tenants.spec.js
 */
const { test: base, expect } = require('@playwright/test')

const SUPER_ADMIN = { email: 'admin@quvex.com', password: 'Admin123!@#$' }

// Silinecek test tenant ID'leri
const TEST_TENANT_IDS = [
  'c9ccc6f7-12d1-4668-80da-f7f045486a01', // cncadmin631068
  'f101d17e-46a5-4434-ba6c-1d297acc7174', // cncadmin603428
  '47e3639e-aeb4-4b0e-82a2-4bc3994c86e5', // cncadmin918827
  '4858abad-8b9a-4828-922e-7b08dd2579c0', // cncadmin940052
  'feac7d95-cf55-4d7a-a09b-c6bdb230389c', // cncadmin400628
  '7e0b6c57-2fc4-4972-96a4-fd33c5d6047a', // cncadmin422057 (son koşum)
]

const API = 'https://api.quvex.io'

base('Test tenantlari sil', async ({ page, request }) => {
  // 1. Super admin ile browser login (cookie/session alabilmek icin)
  await page.goto('/login')
  await page.waitForLoadState('domcontentloaded')

  const emailInput = page.locator('input[name="loginEmail"]')
  await expect(emailInput).toBeVisible({ timeout: 15_000 })
  await emailInput.fill(SUPER_ADMIN.email)
  await page.locator('input[name="password"]').fill(SUPER_ADMIN.password)
  await page.locator('button.qx-login-btn').click()
  await expect(page).toHaveURL(/admin\/dashboard|home/, { timeout: 20_000 })
  console.log('[cleanup] Super admin login basarili:', page.url())

  // 2. Quvex: Login handler → sessionStorage['accessToken'] = userData.refreshToken (opaque)
  // jwtService Bearer header bunu kullanır
  const token = await page.evaluate(() => {
    // Direkt bilinen key
    const t = sessionStorage.getItem('accessToken')
    if (t) return t
    // Tüm storage tara
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i)
      const val = sessionStorage.getItem(key)
      if (val && val.length > 10 && !val.startsWith('{') && !val.startsWith('[')) return val
    }
    return null
  })
  console.log('[cleanup] Token alindi:', token ? `${token.length} chars — "${token.slice(0,20)}..."` : 'YOK')

  if (!token) {
    console.warn('[cleanup] Token bulunamadi — manuel silme gerekebilir.')
    return
  }

  // 3. Her test tenant'i sil
  let deleted = 0
  for (const tenantId of TEST_TENANT_IDS) {
    const res = await page.evaluate(async ({ id, tok, api }) => {
      const r = await fetch(`${api}/tenant-admin/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${tok}`,
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json',
        },
      })
      return { status: r.status, body: await r.text() }
    }, { id: tenantId, tok: token, api: API })

    if (res.status === 200 || res.status === 204) {
      console.log(`[cleanup] ✅ Tenant silindi: ${tenantId}`)
      deleted++
    } else if (res.status === 404) {
      console.log(`[cleanup] ⚠️  Tenant zaten yok: ${tenantId}`)
      deleted++ // Zaten yok, temizlendi sayilir
    } else {
      console.warn(`[cleanup] ❌ Silinemedi (${res.status}): ${tenantId} — ${res.body.slice(0, 100)}`)
    }
  }

  console.log(`[cleanup] Tamamlandi: ${deleted}/${TEST_TENANT_IDS.length} tenant temizlendi.`)
  expect(deleted).toBe(TEST_TENANT_IDS.length)
})
