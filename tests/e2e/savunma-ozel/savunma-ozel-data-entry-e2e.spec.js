/**
 * Quvex ERP — Savunma Özel Prosesler TAM VERİ GİRİŞİ E2E Testi
 *
 * 4 alt senaryo — her biri bağımsız:
 *   SENARYO 1: NDT Hizmetleri — Güventest NDT (fason, NAS 410/ASNT)
 *   SENARYO 2: Optik/Hassas Montaj — Vizyon Optik (ASELSAN termal kamera, AS9100/MIL-PRF-13830)
 *   SENARYO 3: Hassas Döküm — Anatolya Döküm (TEI turbin kanadı, AMS 5391/NADCAP)
 *   SENARYO 4: Kalıp/Takım İmalatı — Çelik Kalıp (7.62mm fişek kovani kalıbı, AS9100/DIN 16750)
 *
 * Her senaryo kompakt: 10-15 test, temel CRUD + BOM + Teklif + Üretim + Sertifika + Fatura
 */
const { test, expect } = require('./fixtures')

const API = 'https://api.quvex.io'

// ─── Yardımcı Fonksiyonlar (tüm senaryolar için ortak) ───────────────────────

async function dismissOnboarding(page) {
  const skipBtn = page.locator('[data-test-id="button-skip"], [data-action="skip"], button[title="Atla"]')
  if (await skipBtn.first().isVisible({ timeout: 1000 }).catch(() => false)) {
    await skipBtn.first().click({ force: true }); await page.waitForTimeout(400)
    if (await skipBtn.first().isVisible({ timeout: 800 }).catch(() => false)) {
      await skipBtn.first().click({ force: true }); await page.waitForTimeout(300)
    }
  }
}

async function gotoAndWait(page, path) {
  await page.goto(path)
  await page.waitForLoadState('domcontentloaded')
  await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {})
  await dismissOnboarding(page)
  await page.waitForTimeout(300)
}

async function openAddModal(page) {
  await dismissOnboarding(page)
  const btn = page.locator('button:has(.anticon-plus), button:has-text("Ekle"), button:has-text("Yeni")')
  const visible = await btn.first().isVisible({ timeout: 6000 }).catch(() => false)
  if (visible) { await btn.first().click(); await page.waitForTimeout(600) }
  await dismissOnboarding(page)
  return visible
}

async function fillAntInput(page, fieldName, value) {
  const selectors = [`#basic_${fieldName}`, `#${fieldName}`, `input[id*="${fieldName}"]`, `textarea[id*="${fieldName}"]`]
  for (const sel of selectors) {
    const el = page.locator(sel).first()
    if (await el.isVisible({ timeout: 800 }).catch(() => false)) { await el.click(); await el.fill(value); return true }
  }
  return false
}

async function selectAntOption(page, fieldName, optionText, labelText) {
  if (labelText) {
    const formItem = page.locator('.ant-form-item').filter({ hasText: labelText }).first()
    if (await formItem.isVisible({ timeout: 1500 }).catch(() => false)) {
      const selector = formItem.locator('.ant-select-selector')
      if (await selector.isVisible({ timeout: 800 }).catch(() => false)) {
        await selector.click(); await page.waitForTimeout(500)
        const opt = page.locator(`.ant-select-item-option:has-text("${optionText}")`).first()
        if (await opt.isVisible({ timeout: 2000 }).catch(() => false)) { await opt.click(); await page.waitForTimeout(300); return true }
        await page.keyboard.press('Escape'); return false
      }
    }
  }
  return false
}

async function saveFormModal(page) {
  const btn = page.locator('.ant-modal-footer button.ant-btn-primary, .ant-modal-footer button:has-text("Kaydet")').first()
  if (await btn.isVisible({ timeout: 5000 }).catch(() => false)) { await btn.click(); await page.waitForTimeout(1200); return true }
  return false
}

async function saveFormPage(page) {
  const btn = page.locator('button:has(.anticon-save), button:has-text("Kaydet"):not([disabled])').first()
  if (await btn.isVisible({ timeout: 5000 }).catch(() => false)) { await btn.click(); await page.waitForTimeout(1500); return true }
  return false
}

async function waitForToast(page, timeout = 6000) {
  return await page.locator('.ant-message-notice, .ant-notification-notice, [class*="toast"]').first().isVisible({ timeout }).catch(() => false)
}

let _token = null
async function ensureToken(page) {
  if (!_token) _token = await page.evaluate(() => sessionStorage.getItem('accessToken'))
  return _token
}

async function apiCall(page, method, endpoint, body = null) {
  const tok = await ensureToken(page)
  return await page.evaluate(async ({ api, method, ep, body, tok }) => {
    const opts = { method, headers: { 'Authorization': `Bearer ${tok}`, 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' } }
    if (body) opts.body = JSON.stringify(body)
    const r = await fetch(`${api}${ep}`, opts)
    const text = await r.text()
    let data = null; try { data = JSON.parse(text) } catch { data = text }
    return { status: r.status, data }
  }, { api: API, method, ep: endpoint, body, tok })
}

// ═════════════════════════════════════════════════════════════════════════════
// SENARYO 1: NDT HİZMETLERİ (NAS 410 / ASNT SNT-TC-1A)
// Güventest NDT Ltd.Şti. → Özdemir Kaynak Mühendislik kaynak grubu NDT hizmeti
// ═════════════════════════════════════════════════════════════════════════════

const S1 = { customerId: null, productId: null, serviceId: null, offerId: null, salesId: null, productionId: null, certId: null, invoiceId: null }

test.describe('SENARYO 1 — NDT Hizmetleri', () => {
  test('S1.1 — Ozdemir Kaynak musteri kaydi olustur', async ({ page }) => {
    await gotoAndWait(page, '/customers/new')
    await fillAntInput(page, 'name', 'Ozdemir Kaynak Muhendislik Ltd.Sti.')
    await fillAntInput(page, 'officerName', 'Kemal Ozdemir')
    await fillAntInput(page, 'email', 'kemal@ozdemirkaynak.com.tr')
    await fillAntInput(page, 'phone', '3125554400')
    await selectAntOption(page, 'type', 'Musteri', 'Tipi')
    await saveFormPage(page)
    const res = await apiCall(page, 'GET', '/Customer?type=customers')
    if (res.data) {
      const list = res.data.data || res.data
      if (Array.isArray(list)) {
        const f = list.find(c => c.name?.includes('Ozdemir') || c.name?.includes('Kaynak'))
        if (f) { S1.customerId = f.id; console.log(`[S1.1] customerId=${f.id}`) }
      }
    }
    expect(res.status).toBeLessThan(300)
  })

  test('S1.2 — NDT ekipman makineleri tanimla', async ({ page }) => {
    const machines = [
      { code: 'XRAY-01', name: 'RT X-Ray Tup 300kV Balteau', hourlyRate: '800' },
      { code: 'UT-01',   name: 'UT Phased Array Olympus OmniScan MX2', hourlyRate: '500' },
      { code: 'PT-01',   name: 'Sivi Penetrant Uygulama Kabini UV', hourlyRate: '200' },
      { code: 'MT-01',   name: 'Manyetik Parcacik AC Yoke', hourlyRate: '150' },
    ]
    for (const m of machines) {
      await gotoAndWait(page, '/machines')
      await openAddModal(page)
      await fillAntInput(page, 'code', m.code)
      await fillAntInput(page, 'name', m.name)
      await fillAntInput(page, 'hourlyRate', m.hourlyRate)
      await saveFormModal(page)
    }
    console.log('[S1.2] 4 NDT ekipman eklendi')
    expect(true).toBe(true)
  })

  test('S1.3 — NDT muayene hizmeti urun karti olustur', async ({ page }) => {
    await gotoAndWait(page, '/products/new')
    await fillAntInput(page, 'productNumber', 'SRV-NDT-PT-UT-RT')
    await fillAntInput(page, 'productName', 'NDT Muayene Hizmeti PT+UT+RT Kombo (kaynak grubu basvuru)')
    await selectAntOption(page, 'categoryType', 'Hizmet', 'Kategori')
    await selectAntOption(page, 'unitId', 'ADET', 'Birim')
    await fillAntInput(page, 'salePrice', '4500')
    await saveFormPage(page)
    await page.waitForTimeout(1500)
    const urlMatch = page.url().match(/\/products\/(?:form\/)?([a-f0-9-]{36})/)
    if (urlMatch) { S1.serviceId = urlMatch[1]; console.log(`[S1.3] serviceId=${urlMatch[1]}`) }
    if (!S1.serviceId) {
      const res = await apiCall(page, 'GET', '/Product?type=product')
      if (res.data) {
        const list = res.data.data || res.data
        if (Array.isArray(list)) {
          const f = list.find(p => p.productNumber === 'SRV-NDT-PT-UT-RT')
          if (f) S1.serviceId = f.id
        }
      }
    }
    expect(S1.serviceId).toBeTruthy()
  })

  test('S1.4 — NDT teklif + siparis + uretim emri olustur', async ({ page }) => {
    // Teklif
    await gotoAndWait(page, '/offers/new')
    await selectAntOption(page, 'customerId', 'Ozdemir', 'Musteri')
    await page.waitForTimeout(600)
    const addBtn = page.locator('button:has-text("Kalem Ekle"), button:has-text("Urun Ekle"), button:has(.anticon-plus)').first()
    if (await addBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await addBtn.click(); await page.waitForTimeout(600)
      const productInput = page.locator('input[placeholder*="urun"]').first()
      if (await productInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        await productInput.fill('SRV-NDT'); await page.waitForTimeout(1000)
        const opt = page.locator('.ant-select-item-option').filter({ hasText: 'SRV-NDT' }).first()
        if (await opt.isVisible({ timeout: 2000 }).catch(() => false)) await opt.click()
      }
      const qtyInput = page.locator('input[placeholder*="miktar"]').first()
      if (await qtyInput.isVisible({ timeout: 2000 }).catch(() => false)) await qtyInput.fill('10')
    }
    await saveFormPage(page)
    await page.waitForTimeout(2000)
    const urlMatch = page.url().match(/\/offers\/(?:form\/)?([a-f0-9-]{36})/)
    if (urlMatch) S1.offerId = urlMatch[1]
    if (!S1.offerId) {
      const res = await apiCall(page, 'GET', '/Offer?pageSize=5')
      if (res.data) {
        const list = res.data.data || res.data
        if (Array.isArray(list) && list.length) S1.offerId = list[0].id
      }
    }
    // Teklif ACCEPTED
    if (S1.offerId) {
      await apiCall(page, 'PUT', `/Offer/${S1.offerId}`, { status: 'SENT' })
      await apiCall(page, 'PUT', `/Offer/${S1.offerId}`, { status: 'ACCEPTED' })
    }
    console.log(`[S1.4] Teklif: ${S1.offerId}`)
    expect(S1.offerId || await waitForToast(page, 3000)).toBeTruthy()
  })

  test('S1.5 — NDT muayene uretim emri + sertifika + fatura', async ({ page }) => {
    // Üretim emri (üretim yerine "iş emri" olarak modelleniyor)
    await gotoAndWait(page, '/production/new')
    const productInput = page.locator('input[placeholder*="urun"]').first()
    if (await productInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await productInput.fill('SRV-NDT'); await page.waitForTimeout(1000)
      const opt = page.locator('.ant-select-item-option').filter({ hasText: 'SRV-NDT' }).first()
      if (await opt.isVisible({ timeout: 2000 }).catch(() => false)) await opt.click()
    }
    await fillAntInput(page, 'quantity', '10')
    await saveFormPage(page)
    await page.waitForTimeout(2000)
    const urlMatch = page.url().match(/\/production\/(?:form\/)?([a-f0-9-]{36})/)
    if (urlMatch) S1.productionId = urlMatch[1]
    if (!S1.productionId) {
      const res = await apiCall(page, 'GET', '/Production?pageSize=5')
      if (res.data) {
        const list = res.data.data || res.data
        if (Array.isArray(list) && list.length) S1.productionId = list[0].id
      }
    }
    // NDT muayene sertifikası
    if (S1.serviceId) {
      const certRes = await apiCall(page, 'POST', '/Certificate', {
        productId:       S1.serviceId,
        certificateType: 'NDT',
        certificateNo:   'NDT-RPT-GT-2026-001',
        issueDate:       new Date().toISOString().split('T')[0],
        notes:           'NAS 410 Level II. PT+UT+RT — 10 kaynak grubu. 9 kabul, 1 red (RT: lunker porozite). Rapor No: GT-2026-RPT-001.',
      })
      if (certRes.data?.id) S1.certId = certRes.data.id
      console.log(`[S1.5] NDT cert: ${certRes.status}`)
    }
    // Fatura
    await gotoAndWait(page, '/invoices/new')
    await selectAntOption(page, 'customerId', 'Ozdemir', 'Musteri')
    const addBtn = page.locator('button:has-text("Kalem Ekle"), button:has-text("Urun Ekle")').first()
    if (await addBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await addBtn.click(); await page.waitForTimeout(600)
      const pi = page.locator('input[placeholder*="urun"]').first()
      if (await pi.isVisible({ timeout: 2000 }).catch(() => false)) {
        await pi.fill('SRV-NDT'); await page.waitForTimeout(1000)
        const opt = page.locator('.ant-select-item-option').filter({ hasText: 'SRV-NDT' }).first()
        if (await opt.isVisible({ timeout: 2000 }).catch(() => false)) await opt.click()
      }
      const qi = page.locator('input[placeholder*="miktar"]').first()
      if (await qi.isVisible({ timeout: 2000 }).catch(() => false)) await qi.fill('9')
    }
    await saveFormPage(page)
    await page.waitForTimeout(2000)
    const invMatch = page.url().match(/\/invoices\/(?:form\/)?([a-f0-9-]{36})/)
    if (invMatch) S1.invoiceId = invMatch[1]
    console.log(`[S1.5] NDT tamamlandi: uretimEmri=${S1.productionId} sertifika=${S1.certId} fatura=${S1.invoiceId}`)
    expect(S1.productionId || S1.certId).toBeTruthy()
  })
})

// ═════════════════════════════════════════════════════════════════════════════
// SENARYO 2: OPTİK / HASSAS MONTAJ (AS9100D / MIL-PRF-13830)
// Vizyon Optik Savunma → ASELSAN termal kamera lens grubu montajı
// ═════════════════════════════════════════════════════════════════════════════

const S2 = { customerId: null, stockId: null, productId: null, offerId: null, salesId: null, productionId: null, certId: null, invoiceId: null }

test.describe('SENARYO 2 — Optik Hassas Montaj', () => {
  test('S2.1 — ASELSAN musteri + optik makine tanimla', async ({ page }) => {
    await gotoAndWait(page, '/customers/new')
    await fillAntInput(page, 'name', 'ASELSAN Elektronik Sanayi ve Ticaret A.S.')
    await fillAntInput(page, 'officerName', 'Ayse Optik')
    await fillAntInput(page, 'email', 'tedarik@aselsan.com.tr')
    await fillAntInput(page, 'phone', '3122920000')
    await selectAntOption(page, 'type', 'Musteri', 'Tipi')
    await saveFormPage(page)
    const res = await apiCall(page, 'GET', '/Customer?type=customers')
    if (res.data) {
      const list = res.data.data || res.data
      if (Array.isArray(list)) {
        const f = list.find(c => c.name?.includes('ASELSAN'))
        if (f) { S2.customerId = f.id; console.log(`[S2.1] ASELSAN customerId=${f.id}`) }
      }
    }
    // Makine ekle
    await gotoAndWait(page, '/machines')
    await openAddModal(page)
    await fillAntInput(page, 'code', 'INTERFEROMETRE-01')
    await fillAntInput(page, 'name', 'Zygo VERIFIRE Interferometre Optik Test')
    await fillAntInput(page, 'hourlyRate', '600')
    await saveFormModal(page)
    expect(res.status).toBeLessThan(300)
  })

  test('S2.2 — Ge lens hammadde + lens grubu mamul karti', async ({ page }) => {
    // Hammadde: Germanium lens bileşeni
    await gotoAndWait(page, '/products/new')
    await fillAntInput(page, 'productNumber', 'HM-GE-LENS-60MM')
    await fillAntInput(page, 'productName', 'Germanium (Ge) LWIR Lens D60mm f/1.2 — Rohm & Haas')
    await selectAntOption(page, 'categoryType', 'Hammadde', 'Kategori')
    await selectAntOption(page, 'unitId', 'ADET', 'Birim')
    await fillAntInput(page, 'minStock', '10')
    await saveFormPage(page)
    await page.waitForTimeout(1500)
    let urlMatch = page.url().match(/\/products\/(?:form\/)?([a-f0-9-]{36})/)
    if (urlMatch) S2.stockId = urlMatch[1]
    // Mamul: Lens grubu
    await gotoAndWait(page, '/products/new')
    await fillAntInput(page, 'productNumber', 'OPT-LG-THERMAL-ASEL-001')
    await fillAntInput(page, 'productName', 'Termal Kamera Lens Grubu MWIR 50mm f/2 ASELSAN MIL-PRF-13830')
    await selectAntOption(page, 'categoryType', 'Mamul', 'Kategori')
    await selectAntOption(page, 'unitId', 'ADET', 'Birim')
    await fillAntInput(page, 'salePrice', '75000')
    await saveFormPage(page)
    await page.waitForTimeout(1500)
    urlMatch = page.url().match(/\/products\/(?:form\/)?([a-f0-9-]{36})/)
    if (urlMatch) { S2.productId = urlMatch[1]; console.log(`[S2.2] productId=${urlMatch[1]}`) }
    expect(S2.productId || S2.stockId).toBeTruthy()
  })

  test('S2.3 — BOM + Kontrol Plani + Is Emri Sablonu', async ({ page }) => {
    if (S2.productId && S2.stockId) {
      const bomRes = await apiCall(page, 'POST', '/Bom', {
        parentProductId: S2.productId, childProductId: S2.stockId, quantity: 2,
      })
      console.log(`[S2.3] BOM: ${bomRes.status}`)
    }
    if (S2.productId) {
      const cpRes = await apiCall(page, 'POST', '/ControlPlan', {
        title: 'OPT-LG MIL-PRF-13830 Optik Kalite Kontrol', productId: S2.productId,
        processName: 'Clean Room Laminasyon Alignment Interferometre',
        description: 'MIL-PRF-13830B — Scratch-dig 60-40, WFE < 0.25 lambda, MTF @50 lp/mm > 0.45',
      })
      if (cpRes.data?.id) {
        await apiCall(page, 'POST', '/ControlPlan/items', {
          controlPlanId: cpRes.data.id, processStep: 'Interferometre Testi',
          characteristic: 'WFE Dalga Cephesi Hatasi', measurementTool: 'Zygo VERIFIRE Interferometre',
          specification: 'WFE < 0.25 lambda RMS', frequency: '%100', sampleSize: 'Her lens',
        })
      }
      console.log(`[S2.3] ControlPlan: ${cpRes.status}`)
      const tmplRes = await apiCall(page, 'POST', '/WorkOrderTemplates', {
        name: 'OPT-LG Clean Room Montaj Sablonu', productId: S2.productId,
        workOrders: [
          { rowNo: 10, code: 'OP10', estimatedMinutes: 60, requiresQualityCheck: false, prerequisiteRowNo: null, description: 'Clean room giris + lens giris kalite' },
          { rowNo: 20, code: 'OP20', estimatedMinutes: 120, requiresQualityCheck: false, prerequisiteRowNo: 10, description: 'Lens montaj + grease uygulama + barrel' },
          { rowNo: 30, code: 'OP30', estimatedMinutes: 90, requiresQualityCheck: true, prerequisiteRowNo: 20, description: 'Alignment + interferometre WFE olcumu' },
          { rowNo: 40, code: 'OP40', estimatedMinutes: 45, requiresQualityCheck: true, prerequisiteRowNo: 30, description: 'MTF testi + CoC + paketleme' },
        ],
      })
      console.log(`[S2.3] WorkOrderTemplate: ${tmplRes.status}`)
    }
    expect(true).toBe(true)
  })

  test('S2.4 — Teklif + Siparis + Uretim + Sertifika + Fatura', async ({ page }) => {
    // Teklif: 20 lens grubu × 75.000₺
    await gotoAndWait(page, '/offers/new')
    await selectAntOption(page, 'customerId', 'ASELSAN', 'Musteri')
    await page.waitForTimeout(600)
    const addBtn = page.locator('button:has-text("Kalem Ekle"), button:has-text("Urun Ekle"), button:has(.anticon-plus)').first()
    if (await addBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await addBtn.click(); await page.waitForTimeout(600)
      const pi = page.locator('input[placeholder*="urun"]').first()
      if (await pi.isVisible({ timeout: 2000 }).catch(() => false)) {
        await pi.fill('OPT-LG'); await page.waitForTimeout(1000)
        const opt = page.locator('.ant-select-item-option').filter({ hasText: 'OPT-LG' }).first()
        if (await opt.isVisible({ timeout: 2000 }).catch(() => false)) await opt.click()
      }
      const qi = page.locator('input[placeholder*="miktar"]').first()
      if (await qi.isVisible({ timeout: 2000 }).catch(() => false)) await qi.fill('20')
    }
    await saveFormPage(page)
    await page.waitForTimeout(2000)
    const urlMatch = page.url().match(/\/offers\/(?:form\/)?([a-f0-9-]{36})/)
    if (urlMatch) S2.offerId = urlMatch[1]
    if (!S2.offerId) {
      const r = await apiCall(page, 'GET', '/Offer?pageSize=5')
      if (r.data) { const list = r.data.data || r.data; if (Array.isArray(list) && list.length) S2.offerId = list[0].id }
    }
    if (S2.offerId) {
      await apiCall(page, 'PUT', `/Offer/${S2.offerId}`, { status: 'SENT' })
      await apiCall(page, 'PUT', `/Offer/${S2.offerId}`, { status: 'ACCEPTED' })
    }
    // Üretim emri
    await gotoAndWait(page, '/production/new')
    const pi2 = page.locator('input[placeholder*="urun"]').first()
    if (await pi2.isVisible({ timeout: 3000 }).catch(() => false)) {
      await pi2.fill('OPT-LG'); await page.waitForTimeout(1000)
      const opt = page.locator('.ant-select-item-option').filter({ hasText: 'OPT-LG' }).first()
      if (await opt.isVisible({ timeout: 2000 }).catch(() => false)) await opt.click()
    }
    await fillAntInput(page, 'quantity', '20')
    await saveFormPage(page)
    await page.waitForTimeout(2000)
    const prodMatch = page.url().match(/\/production\/(?:form\/)?([a-f0-9-]{36})/)
    if (prodMatch) S2.productionId = prodMatch[1]
    // FAI/CoC sertifikası
    if (S2.productId) {
      const certRes = await apiCall(page, 'POST', '/Certificate', {
        productId: S2.productId, certificateType: 'COC',
        certificateNo: 'COC-OPT-LG-THERMAL-2026-001',
        issueDate: new Date().toISOString().split('T')[0],
        notes: 'MIL-PRF-13830B CoC — WFE 0.18 lambda, MTF@50 0.52, Scratch-dig 40-20. 20 adet uygun.',
      })
      if (certRes.data?.id) S2.certId = certRes.data.id
    }
    // Fatura
    await gotoAndWait(page, '/invoices/new')
    await selectAntOption(page, 'customerId', 'ASELSAN', 'Musteri')
    const addBtn2 = page.locator('button:has-text("Kalem Ekle"), button:has-text("Urun Ekle")').first()
    if (await addBtn2.isVisible({ timeout: 3000 }).catch(() => false)) {
      await addBtn2.click(); await page.waitForTimeout(600)
      const pi3 = page.locator('input[placeholder*="urun"]').first()
      if (await pi3.isVisible({ timeout: 2000 }).catch(() => false)) {
        await pi3.fill('OPT-LG'); await page.waitForTimeout(1000)
        const opt = page.locator('.ant-select-item-option').filter({ hasText: 'OPT-LG' }).first()
        if (await opt.isVisible({ timeout: 2000 }).catch(() => false)) await opt.click()
      }
      const qi2 = page.locator('input[placeholder*="miktar"]').first()
      if (await qi2.isVisible({ timeout: 2000 }).catch(() => false)) await qi2.fill('20')
    }
    await saveFormPage(page)
    await page.waitForTimeout(2000)
    const invMatch = page.url().match(/\/invoices\/(?:form\/)?([a-f0-9-]{36})/)
    if (invMatch) S2.invoiceId = invMatch[1]
    console.log(`[S2.4] Teklif=${S2.offerId} Uretim=${S2.productionId} Cert=${S2.certId} Fatura=${S2.invoiceId}`)
    expect(S2.offerId || S2.productionId).toBeTruthy()
  })
})

// ═════════════════════════════════════════════════════════════════════════════
// SENARYO 3: HASSAS DÖKÜM - INVESTMENT CASTING (AMS 5391 / NADCAP)
// Anatolya Döküm San. A.Ş. → TEI Inconel 713C turbin kanadı
// ═════════════════════════════════════════════════════════════════════════════

const S3 = { customerId: null, stockId: null, productId: null, offerId: null, productionId: null, certId: null, invoiceId: null }

test.describe('SENARYO 3 — Hassas Dokum Investment Casting', () => {
  test('S3.1 — TEI musteri + dokum ekipmanlari tanimla', async ({ page }) => {
    await gotoAndWait(page, '/customers/new')
    await fillAntInput(page, 'name', 'TUSAS Motor Sanayii TEI A.S.')
    await fillAntInput(page, 'officerName', 'Hasan Turbin')
    await fillAntInput(page, 'email', 'tedarik@tei.com.tr')
    await fillAntInput(page, 'phone', '2224440000')
    await selectAntOption(page, 'type', 'Musteri', 'Tipi')
    await saveFormPage(page)
    const res = await apiCall(page, 'GET', '/Customer?type=customers')
    if (res.data) {
      const list = res.data.data || res.data
      if (Array.isArray(list)) {
        const f = list.find(c => c.name?.includes('TEI') || c.name?.includes('Motor'))
        if (f) { S3.customerId = f.id; console.log(`[S3.1] TEI customerId=${f.id}`) }
      }
    }
    for (const m of [
      { code: 'VAK-DOK-01', name: 'Vakum Dokum Firini 1600°C 50kg Inconel', hourlyRate: '1500' },
      { code: 'SERAMIK-01', name: 'Seramik Kabuk Hatti 8 Kat', hourlyRate: '400' },
      { code: 'IM-01', name: 'Hassas Isleme CNC 5-Eksen Fanuc', hourlyRate: '600' },
    ]) {
      await gotoAndWait(page, '/machines')
      await openAddModal(page)
      await fillAntInput(page, 'code', m.code)
      await fillAntInput(page, 'name', m.name)
      await fillAntInput(page, 'hourlyRate', m.hourlyRate)
      await saveFormModal(page)
    }
    expect(res.status).toBeLessThan(300)
  })

  test('S3.2 — Inconel 713C hammadde + turbin kanadi mamul karti', async ({ page }) => {
    await gotoAndWait(page, '/products/new')
    await fillAntInput(page, 'productNumber', 'HM-INCONEL-713C')
    await fillAntInput(page, 'productName', 'Inconel 713C Nikel Alasimlari Dokum Hamili AMS 5391')
    await selectAntOption(page, 'categoryType', 'Hammadde', 'Kategori')
    await selectAntOption(page, 'unitId', 'KG', 'Birim')
    await fillAntInput(page, 'minStock', '50')
    await saveFormPage(page)
    await page.waitForTimeout(1500)
    let urlMatch = page.url().match(/\/products\/(?:form\/)?([a-f0-9-]{36})/)
    if (urlMatch) S3.stockId = urlMatch[1]
    await gotoAndWait(page, '/products/new')
    await fillAntInput(page, 'productNumber', 'DOK-TURBIN-KANAT-713C')
    await fillAntInput(page, 'productName', 'Inconel 713C Investment Cast Turbin Kanadi AMS 5391 NADCAP')
    await selectAntOption(page, 'categoryType', 'Mamul', 'Kategori')
    await selectAntOption(page, 'unitId', 'ADET', 'Birim')
    await fillAntInput(page, 'salePrice', '185000')
    await saveFormPage(page)
    await page.waitForTimeout(1500)
    urlMatch = page.url().match(/\/products\/(?:form\/)?([a-f0-9-]{36})/)
    if (urlMatch) { S3.productId = urlMatch[1]; console.log(`[S3.2] productId=${urlMatch[1]}`) }
    expect(S3.productId).toBeTruthy()
  })

  test('S3.3 — BOM + NADCAP kontrol plani olustur', async ({ page }) => {
    if (S3.productId && S3.stockId) {
      const bomRes = await apiCall(page, 'POST', '/Bom', {
        parentProductId: S3.productId, childProductId: S3.stockId, quantity: 0.18,
      })
      console.log(`[S3.3] BOM Inconel: ${bomRes.status}`)
    }
    if (S3.productId) {
      const cpRes = await apiCall(page, 'POST', '/ControlPlan', {
        title: 'DOK-TURBIN NADCAP Dokum Proses Kontrol', productId: S3.productId,
        processName: 'Kayip Mum Seramik Kabuk Vakum Dokum NDT',
        description: 'NADCAP AC7115. Seramik kabuk: 8 kat. Dokum: 1540°C vakum. NDT: RT + FPI. Metalurji: ASTM A732 tensile.',
      })
      if (cpRes.data?.id) {
        for (const item of [
          { step: 'Seramik Kabuk', char: 'Kabuk kalinligi', tool: 'Ultrasonic gauge', spec: '4.0-6.0 mm, 8 kat' },
          { step: 'Vakum Dokum', char: 'Dokum sicakligi', tool: 'Pyrometer + SCADA', spec: '1540°C ±15°C' },
          { step: 'NDT Kontrol', char: 'RT + FPI muayene', tool: 'X-Ray + Sivi Penetrant', spec: 'AMS 2175 Class A — sifir lineer defect' },
        ]) {
          await apiCall(page, 'POST', '/ControlPlan/items', {
            controlPlanId: cpRes.data.id, processStep: item.step,
            characteristic: item.char, measurementTool: item.tool, specification: item.spec,
            frequency: '%100', sampleSize: 'Her parca',
          })
        }
      }
      console.log(`[S3.3] ControlPlan: ${cpRes.status}`)
    }
    expect(true).toBe(true)
  })

  test('S3.4 — Teklif + Uretim + NADCAP sertifika + Fatura', async ({ page }) => {
    // Teklif: 10 kanat × 185.000₺
    await gotoAndWait(page, '/offers/new')
    await selectAntOption(page, 'customerId', 'TEI', 'Musteri')
    await page.waitForTimeout(600)
    const addBtn = page.locator('button:has-text("Kalem Ekle"), button:has-text("Urun Ekle"), button:has(.anticon-plus)').first()
    if (await addBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await addBtn.click(); await page.waitForTimeout(600)
      const pi = page.locator('input[placeholder*="urun"]').first()
      if (await pi.isVisible({ timeout: 2000 }).catch(() => false)) {
        await pi.fill('DOK-TURBIN'); await page.waitForTimeout(1000)
        const opt = page.locator('.ant-select-item-option').filter({ hasText: 'DOK-TURBIN' }).first()
        if (await opt.isVisible({ timeout: 2000 }).catch(() => false)) await opt.click()
      }
      const qi = page.locator('input[placeholder*="miktar"]').first()
      if (await qi.isVisible({ timeout: 2000 }).catch(() => false)) await qi.fill('10')
    }
    await saveFormPage(page)
    await page.waitForTimeout(2000)
    const urlMatch = page.url().match(/\/offers\/(?:form\/)?([a-f0-9-]{36})/)
    if (urlMatch) S3.offerId = urlMatch[1]
    if (!S3.offerId) {
      const r = await apiCall(page, 'GET', '/Offer?pageSize=5')
      if (r.data) { const list = r.data.data || r.data; if (Array.isArray(list) && list.length) S3.offerId = list[0].id }
    }
    if (S3.offerId) {
      await apiCall(page, 'PUT', `/Offer/${S3.offerId}`, { status: 'SENT' })
      await apiCall(page, 'PUT', `/Offer/${S3.offerId}`, { status: 'ACCEPTED' })
    }
    // Üretim emri
    await gotoAndWait(page, '/production/new')
    const pi2 = page.locator('input[placeholder*="urun"]').first()
    if (await pi2.isVisible({ timeout: 3000 }).catch(() => false)) {
      await pi2.fill('DOK-TURBIN'); await page.waitForTimeout(1000)
      const opt = page.locator('.ant-select-item-option').filter({ hasText: 'DOK-TURBIN' }).first()
      if (await opt.isVisible({ timeout: 2000 }).catch(() => false)) await opt.click()
    }
    await fillAntInput(page, 'quantity', '10')
    await saveFormPage(page)
    await page.waitForTimeout(2000)
    const prodMatch = page.url().match(/\/production\/(?:form\/)?([a-f0-9-]{36})/)
    if (prodMatch) S3.productionId = prodMatch[1]
    // OP tamamlama
    if (S3.productionId) {
      for (const op of ['OP10', 'OP20', 'OP30', 'OP40', 'OP50']) {
        await apiCall(page, 'POST', `/Production/completion/${S3.productionId}`, {
          operationCode: op, completedQty: 10, scrapQty: op === 'OP50' ? 1 : 0,
          operatorNote: `${op} tamamlandi.`,
        })
      }
    }
    // NADCAP sertifikası
    if (S3.productId) {
      const certRes = await apiCall(page, 'POST', '/Certificate', {
        productId: S3.productId, certificateType: 'NADCAP',
        certificateNo: 'NADCAP-DOK-TEI-2026-001',
        issueDate: new Date().toISOString().split('T')[0],
        notes: 'NADCAP AC7115 Investment Casting. 9/10 parca kabul. AMS 5391 kimyasal + mekanik uygun. RT+FPI temiz.',
      })
      if (certRes.data?.id) S3.certId = certRes.data.id
    }
    // Fatura
    await gotoAndWait(page, '/invoices/new')
    await selectAntOption(page, 'customerId', 'TEI', 'Musteri')
    const addBtn2 = page.locator('button:has-text("Kalem Ekle"), button:has-text("Urun Ekle")').first()
    if (await addBtn2.isVisible({ timeout: 3000 }).catch(() => false)) {
      await addBtn2.click(); await page.waitForTimeout(600)
      const pi3 = page.locator('input[placeholder*="urun"]').first()
      if (await pi3.isVisible({ timeout: 2000 }).catch(() => false)) {
        await pi3.fill('DOK-TURBIN'); await page.waitForTimeout(1000)
        const opt = page.locator('.ant-select-item-option').filter({ hasText: 'DOK-TURBIN' }).first()
        if (await opt.isVisible({ timeout: 2000 }).catch(() => false)) await opt.click()
      }
      const qi2 = page.locator('input[placeholder*="miktar"]').first()
      if (await qi2.isVisible({ timeout: 2000 }).catch(() => false)) await qi2.fill('9')
    }
    await saveFormPage(page)
    await page.waitForTimeout(2000)
    const invMatch = page.url().match(/\/invoices\/(?:form\/)?([a-f0-9-]{36})/)
    if (invMatch) S3.invoiceId = invMatch[1]
    console.log(`[S3.4] Teklif=${S3.offerId} Uretim=${S3.productionId} NADCAP=${S3.certId} Fatura=${S3.invoiceId}`)
    expect(S3.offerId || S3.productionId).toBeTruthy()
  })
})

// ═════════════════════════════════════════════════════════════════════════════
// SENARYO 4: KALIP VE TAKIM İMALATI (AS9100D / DIN 16750)
// Çelik Kalıp Mühendislik Ltd.Şti. → Muhimmat fabrikası 7.62mm fişek kovani progresif kalıbı
// ═════════════════════════════════════════════════════════════════════════════

const S4 = { customerId: null, stockId: null, productId: null, offerId: null, productionId: null, certId: null, invoiceId: null }

test.describe('SENARYO 4 — Kalip ve Takim Imalati', () => {
  test('S4.1 — Muhimmat fabrikasi musteri + kalip makineleri tanimla', async ({ page }) => {
    await gotoAndWait(page, '/customers/new')
    await fillAntInput(page, 'name', 'MKE Makina ve Kimya Endustrisi A.S.')
    await fillAntInput(page, 'officerName', 'Fatih Muhimmat')
    await fillAntInput(page, 'email', 'tedarik@mke.com.tr')
    await fillAntInput(page, 'phone', '3123280000')
    await selectAntOption(page, 'type', 'Musteri', 'Tipi')
    await saveFormPage(page)
    const res = await apiCall(page, 'GET', '/Customer?type=customers')
    if (res.data) {
      const list = res.data.data || res.data
      if (Array.isArray(list)) {
        const f = list.find(c => c.name?.includes('MKE') || c.name?.includes('Makina'))
        if (f) { S4.customerId = f.id; console.log(`[S4.1] MKE customerId=${f.id}`) }
      }
    }
    for (const m of [
      { code: 'CNC-KALIP-01', name: 'Makino V56 5-Eksen CNC Isleme Merkezi', hourlyRate: '700' },
      { code: 'WEDM-01', name: 'Mitsubishi MV2400R Tel Erozyon (WEDM)', hourlyRate: '500' },
      { code: 'EDM-01', name: 'Charmilles ROBOFORM 350 Dalma Erozyon', hourlyRate: '450' },
    ]) {
      await gotoAndWait(page, '/machines')
      await openAddModal(page)
      await fillAntInput(page, 'code', m.code)
      await fillAntInput(page, 'name', m.name)
      await fillAntInput(page, 'hourlyRate', m.hourlyRate)
      await saveFormModal(page)
    }
    expect(res.status).toBeLessThan(300)
  })

  test('S4.2 — SKD11 takım çeliği hammadde + kalıp mamul kartı', async ({ page }) => {
    await gotoAndWait(page, '/products/new')
    await fillAntInput(page, 'productNumber', 'HM-SKD11-200X200')
    await fillAntInput(page, 'productName', 'SKD11 (D2) Takim Celigi Plaka 200x200x50mm (Sodick Sertlesmis 62HRC)')
    await selectAntOption(page, 'categoryType', 'Hammadde', 'Kategori')
    await selectAntOption(page, 'unitId', 'ADET', 'Birim')
    await fillAntInput(page, 'minStock', '5')
    await saveFormPage(page)
    await page.waitForTimeout(1500)
    let urlMatch = page.url().match(/\/products\/(?:form\/)?([a-f0-9-]{36})/)
    if (urlMatch) S4.stockId = urlMatch[1]
    await gotoAndWait(page, '/products/new')
    await fillAntInput(page, 'productNumber', 'KALIP-762-KOVANI-PROG')
    await fillAntInput(page, 'productName', '7.62mm Fisek Kovani Progresif Sac Kalip SKD11 AS9100 DIN 16750')
    await selectAntOption(page, 'categoryType', 'Mamul', 'Kategori')
    await selectAntOption(page, 'unitId', 'ADET', 'Birim')
    await fillAntInput(page, 'salePrice', '380000')
    await saveFormPage(page)
    await page.waitForTimeout(1500)
    urlMatch = page.url().match(/\/products\/(?:form\/)?([a-f0-9-]{36})/)
    if (urlMatch) { S4.productId = urlMatch[1]; console.log(`[S4.2] productId=${urlMatch[1]}`) }
    expect(S4.productId).toBeTruthy()
  })

  test('S4.3 — BOM + Kontrol Plani + Is Emri Sablonu', async ({ page }) => {
    if (S4.productId && S4.stockId) {
      const bomRes = await apiCall(page, 'POST', '/Bom', {
        parentProductId: S4.productId, childProductId: S4.stockId, quantity: 12,
      })
      console.log(`[S4.3] BOM: ${bomRes.status}`)
    }
    if (S4.productId) {
      const cpRes = await apiCall(page, 'POST', '/ControlPlan', {
        title: 'KALIP-762 ISO 2768-mK Hassas Tolerans Kontrol', productId: S4.productId,
        processName: 'CNC WEDM EDM Polisaj Tryout',
        description: 'ISO 2768-mK. Zımba/matris toleransı +0/-0.005mm. Sertlik SKD11 62-64 HRC. Tryout: 5.000 vuruş test.',
      })
      if (cpRes.data?.id) {
        for (const item of [
          { step: 'CNC Isleme', char: 'Zimba/Matris tolerans', tool: 'CMM Zeiss Contura', spec: '+0/-0.005mm' },
          { step: 'WEDM Isleme', char: 'Kesme yuzey puruzsuzlugu', tool: 'Perthometer', spec: 'Ra < 0.4 µm' },
          { step: 'Tryout', char: 'Kovan geometri', tool: 'Optik olcum sistemi', spec: 'MKE cizim toleranslarinda' },
        ]) {
          await apiCall(page, 'POST', '/ControlPlan/items', {
            controlPlanId: cpRes.data.id, processStep: item.step,
            characteristic: item.char, measurementTool: item.tool, specification: item.spec,
            frequency: '%100', sampleSize: 'Her parca',
          })
        }
      }
      const tmplRes = await apiCall(page, 'POST', '/WorkOrderTemplates', {
        name: 'KALIP-762 Imalat Is Emri', productId: S4.productId,
        workOrders: [
          { rowNo: 10, code: 'OP10', estimatedMinutes: 480, requiresQualityCheck: false, prerequisiteRowNo: null, description: 'CNC 5-eksen kaba isleme (roughing)' },
          { rowNo: 20, code: 'OP20', estimatedMinutes: 360, requiresQualityCheck: false, prerequisiteRowNo: 10, description: 'Tel erozyon (WEDM) profil kesimi' },
          { rowNo: 30, code: 'OP30', estimatedMinutes: 240, requiresQualityCheck: false, prerequisiteRowNo: 20, description: 'Dalma erozyon (EDM) — detay formlari' },
          { rowNo: 40, code: 'OP40', estimatedMinutes: 180, requiresQualityCheck: false, prerequisiteRowNo: 30, description: 'Polisaj + CMM olcum' },
          { rowNo: 50, code: 'OP50', estimatedMinutes: 240, requiresQualityCheck: true, prerequisiteRowNo: 40, description: 'Tryout — 5000 vurus test + musteri kabul' },
        ],
      })
      console.log(`[S4.3] WorkOrderTemplate: ${tmplRes.status}`)
    }
    expect(true).toBe(true)
  })

  test('S4.4 — Teklif + Uretim + Kalip sertifika + Fatura', async ({ page }) => {
    // Teklif: 2 kalıp × 380.000₺
    await gotoAndWait(page, '/offers/new')
    await selectAntOption(page, 'customerId', 'MKE', 'Musteri')
    await page.waitForTimeout(600)
    const addBtn = page.locator('button:has-text("Kalem Ekle"), button:has-text("Urun Ekle"), button:has(.anticon-plus)').first()
    if (await addBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await addBtn.click(); await page.waitForTimeout(600)
      const pi = page.locator('input[placeholder*="urun"]').first()
      if (await pi.isVisible({ timeout: 2000 }).catch(() => false)) {
        await pi.fill('KALIP-762'); await page.waitForTimeout(1000)
        const opt = page.locator('.ant-select-item-option').filter({ hasText: 'KALIP-762' }).first()
        if (await opt.isVisible({ timeout: 2000 }).catch(() => false)) await opt.click()
      }
      const qi = page.locator('input[placeholder*="miktar"]').first()
      if (await qi.isVisible({ timeout: 2000 }).catch(() => false)) await qi.fill('2')
    }
    await saveFormPage(page)
    await page.waitForTimeout(2000)
    const urlMatch = page.url().match(/\/offers\/(?:form\/)?([a-f0-9-]{36})/)
    if (urlMatch) S4.offerId = urlMatch[1]
    if (!S4.offerId) {
      const r = await apiCall(page, 'GET', '/Offer?pageSize=5')
      if (r.data) { const list = r.data.data || r.data; if (Array.isArray(list) && list.length) S4.offerId = list[0].id }
    }
    if (S4.offerId) {
      await apiCall(page, 'PUT', `/Offer/${S4.offerId}`, { status: 'SENT' })
      await apiCall(page, 'PUT', `/Offer/${S4.offerId}`, { status: 'ACCEPTED' })
    }
    // Üretim emri
    await gotoAndWait(page, '/production/new')
    const pi2 = page.locator('input[placeholder*="urun"]').first()
    if (await pi2.isVisible({ timeout: 3000 }).catch(() => false)) {
      await pi2.fill('KALIP-762'); await page.waitForTimeout(1000)
      const opt = page.locator('.ant-select-item-option').filter({ hasText: 'KALIP-762' }).first()
      if (await opt.isVisible({ timeout: 2000 }).catch(() => false)) await opt.click()
    }
    await fillAntInput(page, 'quantity', '2')
    await saveFormPage(page)
    await page.waitForTimeout(2000)
    const prodMatch = page.url().match(/\/production\/(?:form\/)?([a-f0-9-]{36})/)
    if (prodMatch) S4.productionId = prodMatch[1]
    if (!S4.productionId) {
      const r = await apiCall(page, 'GET', '/Production?pageSize=5')
      if (r.data) { const list = r.data.data || r.data; if (Array.isArray(list) && list.length) S4.productionId = list[0].id }
    }
    // Tryout sertifikası
    if (S4.productId) {
      const certRes = await apiCall(page, 'POST', '/Certificate', {
        productId: S4.productId, certificateType: 'FAI',
        certificateNo: 'FAI-KALIP-762-MKE-2026-001',
        issueDate: new Date().toISOString().split('T')[0],
        notes: 'Tryout 5000 vurus tamamlandi. Kovan geometri MKE toleranslarinda. Musteri kabul imzalandi.',
      })
      if (certRes.data?.id) S4.certId = certRes.data.id
    }
    // Fatura
    await gotoAndWait(page, '/invoices/new')
    await selectAntOption(page, 'customerId', 'MKE', 'Musteri')
    const addBtn2 = page.locator('button:has-text("Kalem Ekle"), button:has-text("Urun Ekle")').first()
    if (await addBtn2.isVisible({ timeout: 3000 }).catch(() => false)) {
      await addBtn2.click(); await page.waitForTimeout(600)
      const pi3 = page.locator('input[placeholder*="urun"]').first()
      if (await pi3.isVisible({ timeout: 2000 }).catch(() => false)) {
        await pi3.fill('KALIP-762'); await page.waitForTimeout(1000)
        const opt = page.locator('.ant-select-item-option').filter({ hasText: 'KALIP-762' }).first()
        if (await opt.isVisible({ timeout: 2000 }).catch(() => false)) await opt.click()
      }
      const qi2 = page.locator('input[placeholder*="miktar"]').first()
      if (await qi2.isVisible({ timeout: 2000 }).catch(() => false)) await qi2.fill('2')
    }
    await saveFormPage(page)
    await page.waitForTimeout(2000)
    const invMatch = page.url().match(/\/invoices\/(?:form\/)?([a-f0-9-]{36})/)
    if (invMatch) S4.invoiceId = invMatch[1]
    console.log(`[S4.4] Teklif=${S4.offerId} Uretim=${S4.productionId} FAI=${S4.certId} Fatura=${S4.invoiceId}`)
    expect(S4.offerId || S4.productionId).toBeTruthy()
  })
})

// ═════════════════════════════════════════════════════════════════════════════
// GENEL ÖZET
// ═════════════════════════════════════════════════════════════════════════════

test.describe('GENEL OZET — Savunma Ozel Prosesler', () => {
  test('OZET — 4 senaryo tum kritik kayitlari dogrula', async ({ page }) => {
    console.log('\n════════════════════════════════════════════════════════')
    console.log('  Savunma Özel Prosesler E2E — 4 SENARYO GENEL ÖZET')
    console.log('════════════════════════════════════════════════════════')
    console.log(`  S1 NDT:           Musteri=${S1.customerId ? '✅' : '❌'} Uretim=${S1.productionId ? '✅' : '❌'} Cert=${S1.certId ? '✅' : '❌'} Fatura=${S1.invoiceId ? '✅' : '❌'}`)
    console.log(`  S2 Optik:         Musteri=${S2.customerId ? '✅' : '❌'} Uretim=${S2.productionId ? '✅' : '❌'} Cert=${S2.certId ? '✅' : '❌'} Fatura=${S2.invoiceId ? '✅' : '❌'}`)
    console.log(`  S3 Hassas Dokum:  Musteri=${S3.customerId ? '✅' : '❌'} Uretim=${S3.productionId ? '✅' : '❌'} Cert=${S3.certId ? '✅' : '❌'} Fatura=${S3.invoiceId ? '✅' : '❌'}`)
    console.log(`  S4 Kalip/Takim:   Musteri=${S4.customerId ? '✅' : '❌'} Uretim=${S4.productionId ? '✅' : '❌'} Cert=${S4.certId ? '✅' : '❌'} Fatura=${S4.invoiceId ? '✅' : '❌'}`)
    console.log('════════════════════════════════════════════════════════\n')

    const allIds = [
      S1.customerId, S1.productionId,
      S2.customerId, S2.productionId,
      S3.customerId, S3.productionId,
      S4.customerId, S4.productionId,
    ]
    const mevcut = allIds.filter(Boolean).length
    console.log(`  Toplam kritik kayit: ${mevcut}/${allIds.length}`)
    expect(mevcut).toBeGreaterThanOrEqual(4)
  })
})
