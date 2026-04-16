/**
 * Gida Uretimi E2E — Auth Setup
 * https://quvex.io üzerinde yeni tenant oluşturup login olur, session kaydeder.
 * Units (ADET, KG …) tenant oluşturulduğunda boş gelir — burada seed edilir.
 */
const { test: setup, expect } = require('@playwright/test')
const path = require('path')
const fs   = require('fs')

const authDir     = path.join(__dirname, '../../playwright/.auth')
const authFile    = path.join(authDir, 'gida-user.json')
const sessionFile = path.join(authDir, 'gida-session.json')
const tenantFile  = path.join(authDir, 'gida-tenant.json')

const API = process.env.API_URL || 'https://api.quvex.io'
const TS  = Date.now().toString().slice(-6)

const TEST_TENANT = {
  companyName: `Taze Gida Sanayi Test ${TS}`,
  subdomain:   `gida${TS}`,
  fullName:    'Test Admin',
  email:       process.env.QUVEX_TEST_EMAIL || `gida${TS}@gidatest.com`,
  phone:       '5321234567',
  password:    process.env.QUVEX_TEST_PASSWORD || 'Test1234!@#$',
  sector:      'gida',
  plan:        'Basic',
}

setup('quvex.io — gida tenant olustur ve login ol', async ({ page, request }) => {
  if (!fs.existsSync(authDir)) fs.mkdirSync(authDir, { recursive: true })

  // ── Adım 1: Env var verilmişse direkt login ──
  if (process.env.QUVEX_TEST_EMAIL && process.env.QUVEX_TEST_PASSWORD) {
    console.log(`[auth-setup] Env var credentials: ${process.env.QUVEX_TEST_EMAIL}`)
    TEST_TENANT.email    = process.env.QUVEX_TEST_EMAIL
    TEST_TENANT.password = process.env.QUVEX_TEST_PASSWORD
  } else {
    // ── Adım 2: Yeni tenant register ──
    console.log(`[auth-setup] Yeni tenant: ${TEST_TENANT.email}`)
    const registerRes = await request.post(`${API}/register`, {
      headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
      data: TEST_TENANT,
    })

    if (registerRes.ok()) {
      const body = await registerRes.json().catch(() => ({}))
      console.log(`[auth-setup] Tenant olusturuldu: tenantId=${body.tenantId}`)
      fs.writeFileSync(tenantFile, JSON.stringify({
        email: TEST_TENANT.email, password: TEST_TENANT.password,
        tenantId: body.tenantId, createdAt: new Date().toISOString(),
      }, null, 2))
    } else {
      const err = await registerRes.text().catch(() => '')
      console.warn(`[auth-setup] Register basarisiz (${registerRes.status()}): ${err.slice(0, 200)}`)
      console.warn('[auth-setup] Fallback: super admin ile devam')
      TEST_TENANT.email    = 'admin@quvex.com'
      TEST_TENANT.password = 'Admin123!@#$'
    }
    await page.waitForTimeout(2000)
  }

  // ── Adım 3: UI login ──
  await page.goto('/login')
  await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})

  const emailInput = page.locator('input[name="loginEmail"]')
  await expect(emailInput).toBeVisible({ timeout: 15_000 })
  await emailInput.fill(TEST_TENANT.email)
  await page.locator('input[name="password"]').fill(TEST_TENANT.password)
  await page.locator('button.qx-login-btn').click()
  await expect(page).toHaveURL(/home|dashboard/, { timeout: 30_000 })
  await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})
  console.log(`[auth-setup] Login basarili: ${page.url()}`)

  // ── Adım 4: sessionStorage kaydet ──
  const sessionData = await page.evaluate(() => {
    const d = {}
    for (let i = 0; i < sessionStorage.length; i++) {
      const k = sessionStorage.key(i); d[k] = sessionStorage.getItem(k)
    }
    return d
  })
  fs.writeFileSync(sessionFile, JSON.stringify(sessionData, null, 2))

  // ── Adım 5: localStorage + cookies kaydet ──
  await page.context().storageState({ path: authFile })
  console.log('[auth-setup] Session kaydedildi.')

  // ── Adım 6: Birimler seed ──
  const standardUnits = ['ADET', 'KG', 'METRE', 'LİTRE', 'M²', 'M³', 'PAKET', 'KUTU', 'SET', 'TON', 'CM', 'MM', 'GR']
  const token = sessionData['accessToken']
  if (token) {
    let seeded = 0
    for (const unitName of standardUnits) {
      const status = await page.evaluate(async ({ api, name, tok }) => {
        const r = await fetch(`${api}/Units`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${tok}`, 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
          body: JSON.stringify({ name }),
        })
        return r.status
      }, { api: API, name: unitName, tok: token })
      if (status === 200 || status === 201) seeded++
    }
    console.log(`[auth-setup] Birimler seed edildi: ${seeded}/${standardUnits.length}`)
  } else {
    console.warn('[auth-setup] Token bulunamadi — birimler seed edilemedi')
  }
})
