/**
 * NDT Muayene Laboratuvari E2E — Cleanup
 * Test sonrasi olusturulan NDT tenant'i temizler.
 */
const { test } = require('@playwright/test')
const path = require('path')
const fs   = require('fs')

const authDir    = path.join(__dirname, '../../playwright/.auth')
const tenantFile = path.join(authDir, 'ndt-tenant.json')

const API = process.env.API_URL || 'https://api.quvex.io'

test('NDT — test tenant temizle', async ({ request }) => {
  if (!fs.existsSync(tenantFile)) {
    console.log('[cleanup] ndt-tenant.json bulunamadi, atlanıyor.')
    return
  }
  const tenantData = JSON.parse(fs.readFileSync(tenantFile, 'utf-8'))
  if (!tenantData.tenantId) {
    console.log('[cleanup] tenantId yok, atlanıyor.')
    return
  }
  const loginRes = await request.post(`${API}/login`, {
    headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
    data: { email: tenantData.email, password: tenantData.password },
  })
  if (!loginRes.ok()) {
    console.warn(`[cleanup] Login basarisiz: ${loginRes.status()}`)
    return
  }
  const body = await loginRes.json().catch(() => ({}))
  const token = body.accessToken || body.token
  if (!token) { console.warn('[cleanup] Token alinamadi'); return }

  const delRes = await request.delete(`${API}/TenantAdmin/tenant/${tenantData.tenantId}`, {
    headers: { 'Authorization': `Bearer ${token}`, 'X-Requested-With': 'XMLHttpRequest' },
  })
  console.log(`[cleanup] NDT tenant silme: ${delRes.status()}`)

  // Auth dosyalarini temizle
  const files = ['ndt-user.json', 'ndt-session.json', 'ndt-tenant.json']
  for (const f of files) {
    const fp = path.join(authDir, f)
    if (fs.existsSync(fp)) { fs.unlinkSync(fp); console.log(`[cleanup] Silindi: ${f}`) }
  }
})
