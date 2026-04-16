/**
 * Savunma Sanayi CNC E2E — Auth Setup
 * https://quvex.io uzerinde YENİ TENANT olusturup login olur ve session kaydeder.
 *
 * Sprint 14 sonrasi super admin (/admin/dashboard redirect) yerine
 * tenant kullanicisi olarak login olmak gerekiyor.
 */
const { test: setup, expect } = require('@playwright/test')
const path = require('path')
const fs = require('fs')

const authDir = path.join(__dirname, '../../playwright/.auth')
const authFile = path.join(authDir, 'defense-user.json')
const sessionFile = path.join(authDir, 'defense-session.json')
const tenantFile = path.join(authDir, 'defense-tenant.json')

const API = process.env.API_URL || 'https://api.quvex.io'
const TS = Date.now().toString().slice(-6)

// Test tenant bilgileri — her kosum icin unique subdomain + sirket adi
const TEST_TENANT = {
  companyName: `CNC Defense Test ${TS}`,
  subdomain: `cnctest${TS}`,
  fullName: 'Test Admin',
  email: process.env.QUVEX_TEST_EMAIL || `cncadmin${TS}@cnctest.com`,
  phone: '5321234567',
  password: process.env.QUVEX_TEST_PASSWORD || 'Test1234!@#$',
  sector: 'cnc',
  plan: 'Basic',
}

setup('quvex.io — tenant olustur ve login ol', async ({ page, request }) => {
  // Auth dizinini olustur
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true })
  }

  // ── Adim 1: Daha once kaydedilmis tenant var mi kontrol et ──
  if (process.env.QUVEX_TEST_EMAIL && process.env.QUVEX_TEST_PASSWORD) {
    // Env var verilmisse direkt login dene
    console.log(`[auth-setup] Env var credentials kullaniliyor: ${process.env.QUVEX_TEST_EMAIL}`)
    TEST_TENANT.email = process.env.QUVEX_TEST_EMAIL
    TEST_TENANT.password = process.env.QUVEX_TEST_PASSWORD
  } else {
    // ── Adim 2: Yeni tenant register et (API) ──
    console.log(`[auth-setup] Yeni tenant olusturuluyor: ${TEST_TENANT.email}`)
    const registerRes = await request.post(`${API}/register`, {
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      data: TEST_TENANT,
    })

    if (registerRes.ok()) {
      const body = await registerRes.json().catch(() => ({}))
      console.log(`[auth-setup] Tenant olusturuldu: ${JSON.stringify({ tenantId: body.tenantId, email: TEST_TENANT.email })}`)
      // Tenant bilgilerini kaydet (debug icin)
      fs.writeFileSync(tenantFile, JSON.stringify({
        email: TEST_TENANT.email,
        password: TEST_TENANT.password,
        tenantId: body.tenantId,
        createdAt: new Date().toISOString(),
      }, null, 2))
    } else {
      const errBody = await registerRes.text().catch(() => '')
      console.warn(`[auth-setup] Register basarisiz (${registerRes.status()}): ${errBody.slice(0, 200)}`)
      console.warn('[auth-setup] Mevcut super admin ile devam ediliyor...')
      // Fallback: super admin ile devam et
      TEST_TENANT.email = 'admin@quvex.com'
      TEST_TENANT.password = 'Admin123!@#$'
    }

    // Provisioning icin kisa bekle
    await page.waitForTimeout(2000)
  }

  // ── Adim 3: UI uzerinden login ──
  await page.goto('/login')
  await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})

  const emailInput = page.locator('input[name="loginEmail"]')
  await expect(emailInput).toBeVisible({ timeout: 15_000 })
  await emailInput.fill(TEST_TENANT.email)
  await page.locator('input[name="password"]').fill(TEST_TENANT.password)
  await page.locator('button.qx-login-btn').click()

  // Dashboard'a yonlendirilmesini bekle (home, dashboard, admin/dashboard hepsi kabul)
  await expect(page).toHaveURL(/home|dashboard/, { timeout: 30_000 })
  await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})

  console.log(`[auth-setup] Login basarili: ${page.url()}`)

  // ── Adim 4: sessionStorage tokenlarini kaydet ──
  const sessionData = await page.evaluate(() => {
    const data = {}
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i)
      data[key] = sessionStorage.getItem(key)
    }
    return data
  })

  fs.writeFileSync(sessionFile, JSON.stringify(sessionData, null, 2))

  // ── Adim 5: localStorage + cookies kaydet ──
  await page.context().storageState({ path: authFile })
  console.log('[auth-setup] Session kaydedildi.')

  // ── Adim 6: Birim (Units) seed — yeni tenant'ta Units tablosu bos geliyor ──
  // Units.HasQueryFilter(TenantId) → her tenant'in kendi birimi var
  // TenantRegistrationController birimi seed etmiyor → biz burada ekleriz
  const standardUnits = ['ADET', 'KG', 'METRE', 'LİTRE', 'M²', 'M³', 'PAKET', 'KUTU', 'SET', 'TON', 'CM', 'MM', 'GR']
  const token = sessionData['accessToken']
  if (token) {
    let seeded = 0
    for (const unitName of standardUnits) {
      const result = await page.evaluate(async ({ api, name, tok }) => {
        const r = await fetch(`${api}/Units`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${tok}`,
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
          },
          body: JSON.stringify({ name }),
        })
        return r.status
      }, { api: API, name: unitName, tok: token })
      if (result === 200 || result === 201) seeded++
    }
    console.log(`[auth-setup] Birimler seed edildi: ${seeded}/${standardUnits.length}`)
  } else {
    console.warn('[auth-setup] Token bulunamadı — birimler seed edilemedi')
  }
})
