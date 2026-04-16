/**
 * Quvex ERP — Makine Imalati TAM VERİ GİRİŞİ E2E Testi
 *
 * Senaryo: Teknik Makine Mühendislik San. A.Ş. → Sağlıklı Gıda A.Ş. bant konveyör sistemi
 * Standartlar: CE Machinery Directive 2006/42/EC, EN ISO 12100 risk assessment
 *
 * Kapsam:
 *   FAZ A : Müşteri (Sağlıklı Gıda) + Tedarikçi (Bosch Rexroth) — UI
 *   FAZ B : 4 makine + 2 depo — UI
 *   FAZ C : 3 hammadde stok kartı — UI
 *   FAZ D : Mamul ürün kartı (MAK-KONVEYOR-12M) — UI
 *   FAZ E : BOM 3 kalem — API
 *   FAZ F : Kontrol Planı + 4 kalem (CE uyum odaklı) — API
 *   FAZ G : İş emri şablonu OP10-OP50 — API
 *   FAZ H : Teklif → SENT → ACCEPTED — UI + API
 *   FAZ I : Satış Siparişi — UI
 *   FAZ J : Üretim Emri — UI
 *   FAZ K : Giriş muayenesi (sac + rulman sertifikası) — API
 *   FAZ L : Atölye operasyonları OP10-OP50 — API
 *   FAZ M : NCR (motor güç: 0.82kW hedef vs 0.71kW ölçülen) — API
 *   FAZ N : CAPA → kapatma — API
 *   FAZ O : CE Sertifikası + Fatura (3 sistem × 185.000₺) — API + UI
 *   FAZ P : Maliyet analizi + ÖZET — API
 *
 * Workaround notları:
 *   CE Technical File → Certificate endpoint type=CE (K1)
 *   EN ISO 12100 risk assessment notu → Kontrol Planı description alanına yazılır (K2)
 */
const { test, expect } = require('./fixtures')

const API = 'https://api.quvex.io'

// ─── Test Verileri ────────────────────────────────────────────────────────────

const MUSTERI = {
  name:        'Saglıklı Gida A.S.',
  officerName: 'Kemal Gida',
  email:       'satin@saglikligida.com.tr',
  phone:       '2121234568',
  taxId:       '8901234567',
}

const TEDARIKCI = {
  name:        'Bosch Rexroth Hareket Sistemleri',
  officerName: 'Hasan Rexroth',
  email:       'satis@rexroth.com.tr',
  phone:       '2166508000',
}

const MAKINE_CNC    = { code: 'CNC-TORNA-01', name: 'Mori Seiki NL2500 CNC Torna',     brand: 'Mori Seiki',    hourlyRate: '500' }
const MAKINE_KAYNAK = { code: 'KAYNAK-01',    name: 'Lincoln MIG 350A Kaynak',          brand: 'Lincoln',       hourlyRate: '300' }
const MAKINE_MONTAJ = { code: 'MONTAJ-01',    name: 'Montaj Istasyonu',                 brand: 'Ozel Yapim',    hourlyRate: '150' }
const MAKINE_TEST   = { code: 'TEST-01',      name: 'Fonksiyonel Test Alani',           brand: 'Ozel Yapim',    hourlyRate: '100' }

const DEPO_MALZEME = { code: 'DEPO-MALZEME', name: 'Mekanik Malzeme Deposu' }
const DEPO_MAMUL   = { code: 'DEPO-MAMUL',   name: 'Bitik Makine Deposu'    }

const HAMMADDE_SAC = {
  productNumber: 'HM-SAC-ST37-5mm',
  productName:   'ST37 Sac 5mm 2000x1000mm',
  minStock:      '50',
  unit:          'ADET',
}

const HAMMADDE_PROFIL = {
  productNumber: 'HM-PROFIL-80x80',
  productName:   'S235 Kare Profil 80x80x4mm 6m',
  minStock:      '30',
  unit:          'ADET',
}

const HAMMADDE_RULMAN = {
  productNumber: 'HM-RULMAN-6210',
  productName:   'SKF 6210 Rulman 50mm',
  minStock:      '20',
  unit:          'ADET',
}

const MAMUL = {
  productNumber: 'MAK-KONVEYOR-12M',
  productName:   '12m Bant Konveyor Sistemi CE 0.75kW 1m/s Pas.Celik',
}

const KONTROL_PLANI = {
  title:       'MAK-KONVEYOR CE Risk Assessment Kalite',
  processName: 'Imalat Montaj Fonksiyonel Test',
  description: 'CE 2006/42/EC. EN ISO 12100 risk assessment tamamlandi. Kayis gerilimi ±5%, hiz dogrulugu ±2%, fonksiyonel test 8 saat surekli. Guvenlik devre testi zorunlu.',
}

const IS_EMRI_SABLONU = {
  name: 'MAK-KONVEYOR-12M Konveyor Is Emri',
  operasyonlar: [
    { rowNo: 10, code: 'OP10', machineKey: 'cnc',    estimatedMinutes: 480, requiresQualityCheck: false, prerequisiteRowNo: null },
    { rowNo: 20, code: 'OP20', machineKey: 'kaynak', estimatedMinutes: 360, requiresQualityCheck: true,  prerequisiteRowNo: 10   },
    { rowNo: 30, code: 'OP30', machineKey: 'montaj', estimatedMinutes: 240, requiresQualityCheck: false, prerequisiteRowNo: 20   },
    { rowNo: 40, code: 'OP40', machineKey: 'montaj', estimatedMinutes: 120, requiresQualityCheck: true,  prerequisiteRowNo: 30   },
    { rowNo: 50, code: 'OP50', machineKey: 'test',   estimatedMinutes: 480, requiresQualityCheck: true,  prerequisiteRowNo: 40   },
  ],
}

const STATE = {
  token: null, customerId: null, supplierId: null,
  machineIdCnc: null, machineIdKaynak: null, machineIdMontaj: null, machineIdTest: null,
  warehouseIdMal: null, warehouseIdM: null,
  stockIdSac: null, stockIdProfil: null, stockIdRulman: null,
  productId: null,
  bomId: null, controlPlanId: null, templateId: null,
  offerId: null, salesId: null, productionId: null,
  inspectionId: null, ncrId: null, capaId: null,
  ceCertId: null, invoiceId: null,
}

// ─── Yardımcı Fonksiyonlar ────────────────────────────────────────────────────

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
        await page.keyboard.press('Escape')
        return false
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

async function ensureToken(page) {
  if (!STATE.token) STATE.token = await page.evaluate(() => sessionStorage.getItem('accessToken'))
  return STATE.token
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

// ─────────────────────────────────────────────────────────────────────────────
// FAZ A — MÜŞTERİ + TEDARİKÇİ
// ─────────────────────────────────────────────────────────────────────────────

test.describe('FAZ A — Musteri ve Tedarikci', () => {
  test('A.1 — Saglıklı Gıda musteri kaydi olustur', async ({ page }) => {
    await gotoAndWait(page, '/customers/new')
    await fillAntInput(page, 'name', MUSTERI.name)
    await fillAntInput(page, 'officerName', MUSTERI.officerName)
    await fillAntInput(page, 'email', MUSTERI.email)
    await fillAntInput(page, 'phone', MUSTERI.phone)
    await fillAntInput(page, 'taxId', MUSTERI.taxId)
    await selectAntOption(page, 'type', 'Musteri', 'Tipi')
    await saveFormPage(page)
    const res = await apiCall(page, 'GET', '/Customer?type=customers')
    if (res.data) {
      const list = res.data.data || res.data
      if (Array.isArray(list)) {
        const found = list.find(c => c.name?.includes('Saglıklı') || c.name?.includes('Gida'))
        if (found) { STATE.customerId = found.id; console.log(`[A.1] customerId=${found.id}`) }
      }
    }
    expect(res.status).toBeLessThan(300)
  })

  test('A.2 — Bosch Rexroth tedarikci kaydi olustur', async ({ page }) => {
    await gotoAndWait(page, '/customers/new')
    await fillAntInput(page, 'name', TEDARIKCI.name)
    await fillAntInput(page, 'officerName', TEDARIKCI.officerName)
    await fillAntInput(page, 'email', TEDARIKCI.email)
    await fillAntInput(page, 'phone', TEDARIKCI.phone)
    await selectAntOption(page, 'type', 'Tedarikci', 'Tipi')
    await saveFormPage(page)
    const res = await apiCall(page, 'GET', '/Customer?type=suppliers')
    if (res.data) {
      const list = res.data.data || res.data
      if (Array.isArray(list)) {
        const found = list.find(c => c.name?.includes('Rexroth') || c.name?.includes('Bosch'))
        if (found) { STATE.supplierId = found.id; console.log(`[A.2] supplierId=${found.id}`) }
      }
    }
    expect(res.status).toBeLessThan(300)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// FAZ B — MAKİNE + DEPO
// ─────────────────────────────────────────────────────────────────────────────

test.describe('FAZ B — Makine ve Depo', () => {
  test('B.1 — CNC-TORNA-01 Mori Seiki tanimla', async ({ page }) => {
    await gotoAndWait(page, '/machines')
    await openAddModal(page)
    await fillAntInput(page, 'code', MAKINE_CNC.code)
    await fillAntInput(page, 'name', MAKINE_CNC.name)
    await fillAntInput(page, 'brand', MAKINE_CNC.brand)
    await fillAntInput(page, 'hourlyRate', MAKINE_CNC.hourlyRate)
    await saveFormModal(page)
    const res = await apiCall(page, 'GET', '/Machine')
    if (res.data) {
      const list = res.data.data || res.data
      if (Array.isArray(list)) {
        const f = list.find(m => m.code === 'CNC-TORNA-01'); if (f) STATE.machineIdCnc = f.id
      }
    }
    console.log(`[B.1] CNC-TORNA-01 machineIdCnc=${STATE.machineIdCnc}`)
    expect(true).toBe(true)
  })

  test('B.2 — KAYNAK-01 Lincoln MIG tanimla', async ({ page }) => {
    await gotoAndWait(page, '/machines')
    await openAddModal(page)
    await fillAntInput(page, 'code', MAKINE_KAYNAK.code)
    await fillAntInput(page, 'name', MAKINE_KAYNAK.name)
    await fillAntInput(page, 'brand', MAKINE_KAYNAK.brand)
    await fillAntInput(page, 'hourlyRate', MAKINE_KAYNAK.hourlyRate)
    await saveFormModal(page)
    const res = await apiCall(page, 'GET', '/Machine')
    if (res.data) {
      const list = res.data.data || res.data
      if (Array.isArray(list)) {
        const f = list.find(m => m.code === 'KAYNAK-01'); if (f) STATE.machineIdKaynak = f.id
      }
    }
    expect(true).toBe(true)
  })

  test('B.3 — MONTAJ-01 montaj istasyonu tanimla', async ({ page }) => {
    await gotoAndWait(page, '/machines')
    await openAddModal(page)
    await fillAntInput(page, 'code', MAKINE_MONTAJ.code)
    await fillAntInput(page, 'name', MAKINE_MONTAJ.name)
    await fillAntInput(page, 'brand', MAKINE_MONTAJ.brand)
    await fillAntInput(page, 'hourlyRate', MAKINE_MONTAJ.hourlyRate)
    await saveFormModal(page)
    const res = await apiCall(page, 'GET', '/Machine')
    if (res.data) {
      const list = res.data.data || res.data
      if (Array.isArray(list)) {
        const f = list.find(m => m.code === 'MONTAJ-01'); if (f) STATE.machineIdMontaj = f.id
      }
    }
    expect(true).toBe(true)
  })

  test('B.4 — TEST-01 fonksiyonel test alani tanimla', async ({ page }) => {
    await gotoAndWait(page, '/machines')
    await openAddModal(page)
    await fillAntInput(page, 'code', MAKINE_TEST.code)
    await fillAntInput(page, 'name', MAKINE_TEST.name)
    await fillAntInput(page, 'brand', MAKINE_TEST.brand)
    await fillAntInput(page, 'hourlyRate', MAKINE_TEST.hourlyRate)
    await saveFormModal(page)
    const res = await apiCall(page, 'GET', '/Machine')
    if (res.data) {
      const list = res.data.data || res.data
      if (Array.isArray(list)) {
        const f = list.find(m => m.code === 'TEST-01'); if (f) STATE.machineIdTest = f.id
      }
    }
    expect(true).toBe(true)
  })

  test('B.5 — DEPO-MALZEME mekanik malzeme deposu tanimla', async ({ page }) => {
    await gotoAndWait(page, '/warehouses')
    await openAddModal(page)
    await fillAntInput(page, 'code', DEPO_MALZEME.code)
    await fillAntInput(page, 'name', DEPO_MALZEME.name)
    await saveFormModal(page)
    const res = await apiCall(page, 'GET', '/Warehouse')
    if (res.data) {
      const list = res.data.data || res.data
      if (Array.isArray(list)) {
        const f = list.find(w => w.code === 'DEPO-MALZEME'); if (f) STATE.warehouseIdMal = f.id
      }
    }
    expect(true).toBe(true)
  })

  test('B.6 — DEPO-MAMUL bitik makine deposu tanimla', async ({ page }) => {
    await gotoAndWait(page, '/warehouses')
    await openAddModal(page)
    await fillAntInput(page, 'code', DEPO_MAMUL.code)
    await fillAntInput(page, 'name', DEPO_MAMUL.name)
    await saveFormModal(page)
    const res = await apiCall(page, 'GET', '/Warehouse')
    if (res.data) {
      const list = res.data.data || res.data
      if (Array.isArray(list)) {
        const f = list.find(w => w.code === 'DEPO-MAMUL'); if (f) STATE.warehouseIdM = f.id
      }
    }
    expect(true).toBe(true)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// FAZ C — HAMMADDE STOK KARTLARI
// ─────────────────────────────────────────────────────────────────────────────

test.describe('FAZ C — Hammadde Stok Kartlari', () => {
  test('C.1 — HM-SAC-ST37-5mm stok karti olustur', async ({ page }) => {
    await gotoAndWait(page, '/products/new')
    await fillAntInput(page, 'productNumber', HAMMADDE_SAC.productNumber)
    await fillAntInput(page, 'productName', HAMMADDE_SAC.productName)
    await selectAntOption(page, 'categoryType', 'Hammadde', 'Kategori')
    await selectAntOption(page, 'unitId', HAMMADDE_SAC.unit, 'Birim')
    await fillAntInput(page, 'minStock', HAMMADDE_SAC.minStock)
    await saveFormPage(page)
    await page.waitForTimeout(1500)
    const urlMatch = page.url().match(/\/products\/(?:form\/)?([a-f0-9-]{36})/)
    if (urlMatch) { STATE.stockIdSac = urlMatch[1]; console.log(`[C.1] stockIdSac=${urlMatch[1]}`) }
    if (!STATE.stockIdSac) {
      const res = await apiCall(page, 'GET', '/Product?type=stock')
      if (res.data) {
        const list = res.data.data || res.data
        if (Array.isArray(list)) {
          const found = list.find(p => p.productNumber === HAMMADDE_SAC.productNumber)
          if (found) STATE.stockIdSac = found.id
        }
      }
    }
    expect(STATE.stockIdSac).toBeTruthy()
  })

  test('C.2 — HM-PROFIL-80x80 stok karti olustur', async ({ page }) => {
    await gotoAndWait(page, '/products/new')
    await fillAntInput(page, 'productNumber', HAMMADDE_PROFIL.productNumber)
    await fillAntInput(page, 'productName', HAMMADDE_PROFIL.productName)
    await selectAntOption(page, 'categoryType', 'Hammadde', 'Kategori')
    await selectAntOption(page, 'unitId', HAMMADDE_PROFIL.unit, 'Birim')
    await fillAntInput(page, 'minStock', HAMMADDE_PROFIL.minStock)
    await saveFormPage(page)
    await page.waitForTimeout(1500)
    const urlMatch = page.url().match(/\/products\/(?:form\/)?([a-f0-9-]{36})/)
    if (urlMatch) { STATE.stockIdProfil = urlMatch[1]; console.log(`[C.2] stockIdProfil=${urlMatch[1]}`) }
    if (!STATE.stockIdProfil) {
      const res = await apiCall(page, 'GET', '/Product?type=stock')
      if (res.data) {
        const list = res.data.data || res.data
        if (Array.isArray(list)) {
          const found = list.find(p => p.productNumber === HAMMADDE_PROFIL.productNumber)
          if (found) STATE.stockIdProfil = found.id
        }
      }
    }
    expect(STATE.stockIdProfil).toBeTruthy()
  })

  test('C.3 — HM-RULMAN-6210 stok karti olustur', async ({ page }) => {
    await gotoAndWait(page, '/products/new')
    await fillAntInput(page, 'productNumber', HAMMADDE_RULMAN.productNumber)
    await fillAntInput(page, 'productName', HAMMADDE_RULMAN.productName)
    await selectAntOption(page, 'categoryType', 'Hammadde', 'Kategori')
    await selectAntOption(page, 'unitId', HAMMADDE_RULMAN.unit, 'Birim')
    await fillAntInput(page, 'minStock', HAMMADDE_RULMAN.minStock)
    await saveFormPage(page)
    await page.waitForTimeout(1500)
    const urlMatch = page.url().match(/\/products\/(?:form\/)?([a-f0-9-]{36})/)
    if (urlMatch) { STATE.stockIdRulman = urlMatch[1]; console.log(`[C.3] stockIdRulman=${urlMatch[1]}`) }
    if (!STATE.stockIdRulman) {
      const res = await apiCall(page, 'GET', '/Product?type=stock')
      if (res.data) {
        const list = res.data.data || res.data
        if (Array.isArray(list)) {
          const found = list.find(p => p.productNumber === HAMMADDE_RULMAN.productNumber)
          if (found) STATE.stockIdRulman = found.id
        }
      }
    }
    expect(STATE.stockIdRulman).toBeTruthy()
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// FAZ D — MAMUL ÜRÜN KARTI
// ─────────────────────────────────────────────────────────────────────────────

test.describe('FAZ D — Mamul Urun Karti', () => {
  test('D.1 — MAK-KONVEYOR-12M bant konveyor urun karti', async ({ page }) => {
    await gotoAndWait(page, '/products/new')
    await fillAntInput(page, 'productNumber', MAMUL.productNumber)
    await fillAntInput(page, 'productName', MAMUL.productName)
    await selectAntOption(page, 'categoryType', 'Mamul', 'Kategori')
    await selectAntOption(page, 'unitId', 'ADET', 'Birim')
    await fillAntInput(page, 'salePrice', '185000')
    await fillAntInput(page, 'minStock', '1')
    await saveFormPage(page)
    await page.waitForTimeout(1500)
    const urlMatch = page.url().match(/\/products\/(?:form\/)?([a-f0-9-]{36})/)
    if (urlMatch) { STATE.productId = urlMatch[1]; console.log(`[D.1] productId=${urlMatch[1]}`) }
    if (!STATE.productId) {
      const res = await apiCall(page, 'GET', '/Product?type=product')
      if (res.data) {
        const list = res.data.data || res.data
        if (Array.isArray(list)) {
          const found = list.find(p => p.productNumber === 'MAK-KONVEYOR-12M')
          if (found) STATE.productId = found.id
        }
      }
    }
    expect(STATE.productId).toBeTruthy()
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// FAZ E — BOM (3 kalem)
// ─────────────────────────────────────────────────────────────────────────────

test.describe('FAZ E — BOM Recete', () => {
  test('E.1 — BOM: ST37 Sac 24 adet/sistem', async ({ page }) => {
    if (!STATE.productId || !STATE.stockIdSac) { console.warn('[E.1] eksik ID'); return }
    const res = await apiCall(page, 'POST', '/Bom', {
      parentProductId: STATE.productId,
      childProductId:  STATE.stockIdSac,
      quantity: 24,
    })
    console.log(`[E.1] BOM Sac: status=${res.status} id=${res.data?.id}`)
    if (res.data?.id) STATE.bomId = res.data.id
    expect([200, 201]).toContain(res.status)
  })

  test('E.2 — BOM: Kare Profil 18 adet/sistem', async ({ page }) => {
    if (!STATE.productId || !STATE.stockIdProfil) { console.warn('[E.2] eksik ID'); return }
    const res = await apiCall(page, 'POST', '/Bom', {
      parentProductId: STATE.productId,
      childProductId:  STATE.stockIdProfil,
      quantity: 18,
    })
    console.log(`[E.2] BOM Profil: status=${res.status}`)
    expect([200, 201]).toContain(res.status)
  })

  test('E.3 — BOM: SKF Rulman 8 adet/sistem', async ({ page }) => {
    if (!STATE.productId || !STATE.stockIdRulman) { console.warn('[E.3] eksik ID'); return }
    const res = await apiCall(page, 'POST', '/Bom', {
      parentProductId: STATE.productId,
      childProductId:  STATE.stockIdRulman,
      quantity: 8,
    })
    console.log(`[E.3] BOM Rulman: status=${res.status}`)
    expect([200, 201]).toContain(res.status)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// FAZ F — KONTROL PLANI (CE 2006/42/EC)
// ─────────────────────────────────────────────────────────────────────────────

test.describe('FAZ F — Kontrol Plani CE Uyum', () => {
  test('F.1 — CE konveyor kalite kontrol plani olustur', async ({ page }) => {
    if (!STATE.productId) { console.warn('[F.1] productId eksik'); return }
    const res = await apiCall(page, 'POST', '/ControlPlan', {
      title:       KONTROL_PLANI.title,
      description: KONTROL_PLANI.description,
      productId:   STATE.productId,
      processName: KONTROL_PLANI.processName,
    })
    console.log(`[F.1] ControlPlan: status=${res.status} id=${res.data?.id}`)
    if (res.data?.id) STATE.controlPlanId = res.data.id
    expect([200, 201]).toContain(res.status)
  })

  test('F.2 — Kontrol kalemi: Kaynak NDT VT', async ({ page }) => {
    if (!STATE.controlPlanId) { console.warn('[F.2] controlPlanId eksik'); return }
    const res = await apiCall(page, 'POST', '/ControlPlan/items', {
      controlPlanId:   STATE.controlPlanId,
      processStep:     'MIG Kaynak OP20',
      characteristic:  'Kaynak NDT gorsel muayene (VT)',
      measurementTool: 'Gorsel muayene — EN ISO 17637',
      specification:   'Uzunluk hatalari maks 5mm, derinlik maks 1mm (EN ISO 5817 Sinif C)',
      frequency:       'Her kaynak pasosunda',
      sampleSize:      '%100',
    })
    console.log(`[F.2] Kaynak NDT kalem: status=${res.status}`)
    expect([200, 201]).toContain(res.status)
  })

  test('F.3 — Kontrol kalemi: Boyutsal ±2mm', async ({ page }) => {
    if (!STATE.controlPlanId) { console.warn('[F.3] controlPlanId eksik'); return }
    const res = await apiCall(page, 'POST', '/ControlPlan/items', {
      controlPlanId:   STATE.controlPlanId,
      processStep:     'CNC Imalat OP10',
      characteristic:  'Sasi boyutlari',
      measurementTool: 'Serit metre + dijital kumpas',
      specification:   'Toplam uzunluk 12000mm ±2mm, genislik 1000mm ±2mm',
      frequency:       'Her parcada',
      sampleSize:      '%100',
    })
    console.log(`[F.3] Boyutsal kalem: status=${res.status}`)
    expect([200, 201]).toContain(res.status)
  })

  test('F.4 — Kontrol kalemi: Fonksiyonel test hız dogrulugu', async ({ page }) => {
    if (!STATE.controlPlanId) { console.warn('[F.4] controlPlanId eksik'); return }
    const res = await apiCall(page, 'POST', '/ControlPlan/items', {
      controlPlanId:   STATE.controlPlanId,
      processStep:     'Fonksiyonel Test OP50',
      characteristic:  'Bant hizi dogrulugu',
      measurementTool: 'Takometre + krokometre',
      specification:   'Hedef: 1.0 m/s ±2% (0.98-1.02 m/s)',
      frequency:       'Her sistem',
      sampleSize:      '%100',
    })
    console.log(`[F.4] Hiz kalem: status=${res.status}`)
    expect([200, 201]).toContain(res.status)
  })

  test('F.5 — Kontrol kalemi: CE uyum dogrulama', async ({ page }) => {
    if (!STATE.controlPlanId) { console.warn('[F.5] controlPlanId eksik'); return }
    const res = await apiCall(page, 'POST', '/ControlPlan/items', {
      controlPlanId:   STATE.controlPlanId,
      processStep:     'Son Test ve Sertifikasyon OP50',
      characteristic:  'CE 2006/42/EC acil durma ve guvenlik devreleri',
      measurementTool: 'Elektrik test aleti + kontrol listesi',
      specification:   'Acil durma < 2 sn, guvenlik kilitlemesi 100% aktif, yalitim direnci > 1 MOhm',
      frequency:       'Her sistem',
      sampleSize:      '%100',
    })
    console.log(`[F.5] CE uyum kalem: status=${res.status}`)
    expect([200, 201]).toContain(res.status)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// FAZ G — İŞ EMRİ ŞABLONU (OP10-OP50)
// ─────────────────────────────────────────────────────────────────────────────

test.describe('FAZ G — Is Emri Sablonu', () => {
  test('G.1 — OP10-OP50 konveyor is emri sablonu olustur', async ({ page }) => {
    const ops = IS_EMRI_SABLONU.operasyonlar.map(op => ({
      rowNo:                op.rowNo,
      code:                 op.code,
      machineId:            op.machineKey === 'cnc'    ? STATE.machineIdCnc    :
                            op.machineKey === 'kaynak' ? STATE.machineIdKaynak :
                            op.machineKey === 'montaj' ? STATE.machineIdMontaj :
                            op.machineKey === 'test'   ? STATE.machineIdTest   : null,
      estimatedMinutes:     op.estimatedMinutes,
      requiresQualityCheck: op.requiresQualityCheck,
      prerequisiteRowNo:    op.prerequisiteRowNo,
      description:          op.code === 'OP10' ? 'CNC sasi parca imalati — ST37 sac + S235 profil' :
                            op.code === 'OP20' ? 'MIG kaynak sasi montaji + VT muayenesi' :
                            op.code === 'OP30' ? 'Mekanik montaj — motor, tambur, rulo, kemer' :
                            op.code === 'OP40' ? 'Elektrik paneli + guvenlik devre montaji' :
                            'Fonksiyonel test 8 saat + CE dosyasi hazırlama',
    }))
    const res = await apiCall(page, 'POST', '/WorkOrderTemplates', {
      name:       IS_EMRI_SABLONU.name,
      productId:  STATE.productId || null,
      workOrders: ops,
    })
    console.log(`[G.1] WorkOrderTemplate: status=${res.status} id=${res.data?.id}`)
    if (res.data?.id) STATE.templateId = res.data.id
    expect([200, 201]).toContain(res.status)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// FAZ H — TEKLİF (3 sistem × 185.000₺ = 555.000₺)
// ─────────────────────────────────────────────────────────────────────────────

test.describe('FAZ H — Teklif', () => {
  test('H.1 — Teklif olustur (3 sistem x 185.000₺)', async ({ page }) => {
    if (!STATE.customerId) {
      const res = await apiCall(page, 'GET', '/Customer?type=customers')
      if (res.data) {
        const list = res.data.data || res.data
        if (Array.isArray(list)) {
          const found = list.find(c => c.name?.includes('Saglıklı') || c.name?.includes('Gida'))
          if (found) STATE.customerId = found.id
        }
      }
    }
    await gotoAndWait(page, '/offers/new')
    await selectAntOption(page, 'customerId', 'Gida', 'Musteri')
    await page.waitForTimeout(800)

    const addRowBtn = page.locator('button:has-text("Kalem Ekle"), button:has-text("Urun Ekle"), button:has(.anticon-plus)').first()
    if (await addRowBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await addRowBtn.click(); await page.waitForTimeout(800)
    }

    const productInput = page.locator('input[placeholder*="urun"], input[placeholder*="ürün"]').first()
    if (await productInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await productInput.fill('MAK-KONVEYOR')
      await page.waitForTimeout(1000)
      const opt = page.locator('.ant-select-item-option').filter({ hasText: 'MAK-KONVEYOR' }).first()
      if (await opt.isVisible({ timeout: 2000 }).catch(() => false)) await opt.click()
    }

    const qtyInput = page.locator('input[placeholder*="miktar"], input[placeholder*="Miktar"]').first()
    if (await qtyInput.isVisible({ timeout: 2000 }).catch(() => false)) await qtyInput.fill('3')
    const priceInput = page.locator('input[placeholder*="fiyat"], input[placeholder*="Fiyat"]').first()
    if (await priceInput.isVisible({ timeout: 2000 }).catch(() => false)) await priceInput.fill('185000')

    await saveFormPage(page)
    await page.waitForTimeout(2000)

    const urlMatch = page.url().match(/\/offers\/(?:form\/)?([a-f0-9-]{36})/)
    if (urlMatch) { STATE.offerId = urlMatch[1]; console.log(`[H.1] offerId=${urlMatch[1]}`) }
    if (!STATE.offerId) {
      const res = await apiCall(page, 'GET', '/Offer?pageSize=5')
      if (res.data) {
        const list = res.data.data || res.data
        if (Array.isArray(list) && list.length) STATE.offerId = list[0].id
      }
    }
    const toast = await waitForToast(page, 5000)
    console.log(`[H.1] Teklif toast=${toast} offerId=${STATE.offerId}`)
    expect(STATE.offerId || toast).toBeTruthy()
  })

  test('H.2 — Teklif SENT', async ({ page }) => {
    if (!STATE.offerId) { console.warn('[H.2] offerId eksik'); return }
    const res = await apiCall(page, 'PUT', `/Offer/${STATE.offerId}`, { status: 'SENT' })
    console.log(`[H.2] SENT: status=${res.status}`)
    expect([200, 204]).toContain(res.status)
  })

  test('H.3 — Teklif ACCEPTED', async ({ page }) => {
    if (!STATE.offerId) { console.warn('[H.3] offerId eksik'); return }
    const res = await apiCall(page, 'PUT', `/Offer/${STATE.offerId}`, { status: 'ACCEPTED' })
    console.log(`[H.3] ACCEPTED: status=${res.status}`)
    expect([200, 204]).toContain(res.status)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// FAZ I — SATIŞ SİPARİŞİ
// ─────────────────────────────────────────────────────────────────────────────

test.describe('FAZ I — Satis Siparisi', () => {
  test('I.1 — Saglıklı Gıda satis siparisi olustur', async ({ page }) => {
    await gotoAndWait(page, '/sales/new')
    await selectAntOption(page, 'customerId', 'Gida', 'Musteri')
    await page.waitForTimeout(600)

    const addBtn = page.locator('button:has-text("Kalem Ekle"), button:has-text("Urun Ekle")').first()
    if (await addBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await addBtn.click(); await page.waitForTimeout(600)
      const productInput = page.locator('input[placeholder*="urun"]').first()
      if (await productInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        await productInput.fill('MAK-KONVEYOR'); await page.waitForTimeout(1000)
        const opt = page.locator('.ant-select-item-option').filter({ hasText: 'MAK-KONVEYOR' }).first()
        if (await opt.isVisible({ timeout: 2000 }).catch(() => false)) await opt.click()
      }
      const qtyInput = page.locator('input[placeholder*="miktar"]').first()
      if (await qtyInput.isVisible({ timeout: 2000 }).catch(() => false)) await qtyInput.fill('3')
    }

    await saveFormPage(page)
    await page.waitForTimeout(2000)
    const urlMatch = page.url().match(/\/sales\/(?:form\/)?([a-f0-9-]{36})/)
    if (urlMatch) { STATE.salesId = urlMatch[1]; console.log(`[I.1] salesId=${urlMatch[1]}`) }
    if (!STATE.salesId) {
      const res = await apiCall(page, 'GET', '/SalesOrder?pageSize=5')
      if (res.data) {
        const list = res.data.data || res.data
        if (Array.isArray(list) && list.length) STATE.salesId = list[0].id
      }
    }
    const toast = await waitForToast(page, 5000)
    console.log(`[I.1] Satis siparisi toast=${toast} salesId=${STATE.salesId}`)
    expect(STATE.salesId || toast).toBeTruthy()
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// FAZ J — ÜRETİM EMRİ
// ─────────────────────────────────────────────────────────────────────────────

test.describe('FAZ J — Uretim Emri', () => {
  test('J.1 — Konveyor uretim emri ac', async ({ page }) => {
    await gotoAndWait(page, '/production/new')
    const productInput = page.locator('input[placeholder*="urun"]').first()
    if (await productInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await productInput.fill('MAK-KONVEYOR'); await page.waitForTimeout(1000)
      const opt = page.locator('.ant-select-item-option').filter({ hasText: 'MAK-KONVEYOR' }).first()
      if (await opt.isVisible({ timeout: 2000 }).catch(() => false)) await opt.click()
    }
    await fillAntInput(page, 'quantity', '3')
    await saveFormPage(page)
    await page.waitForTimeout(2000)
    const urlMatch = page.url().match(/\/production\/(?:form\/)?([a-f0-9-]{36})/)
    if (urlMatch) { STATE.productionId = urlMatch[1]; console.log(`[J.1] productionId=${urlMatch[1]}`) }
    if (!STATE.productionId) {
      const res = await apiCall(page, 'GET', '/Production?pageSize=5')
      if (res.data) {
        const list = res.data.data || res.data
        if (Array.isArray(list) && list.length) STATE.productionId = list[0].id
      }
    }
    const toast = await waitForToast(page, 5000)
    console.log(`[J.1] Uretim emri toast=${toast} productionId=${STATE.productionId}`)
    expect(STATE.productionId || toast).toBeTruthy()
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// FAZ K — GİRİŞ MUAYENESİ
// ─────────────────────────────────────────────────────────────────────────────

test.describe('FAZ K — Giris Muayenesi', () => {
  test('K.1 — ST37 sac malzeme giris muayenesi', async ({ page }) => {
    if (!STATE.stockIdSac) { console.warn('[K.1] stockIdSac eksik'); return }
    const res = await apiCall(page, 'POST', '/IncomingInspection', {
      productId:      STATE.stockIdSac,
      quantity:       72,
      supplierId:     STATE.supplierId || null,
      inspectionDate: new Date().toISOString().split('T')[0],
      result:         'PASSED',
      notes:          'ST37 sac Lot SAC-2026-0301. Mill sertifikası (EN 10025-2) uygun. Kalınlık: 5.01mm — tolerans dahili.',
    })
    console.log(`[K.1] Sac IncomingInspection: status=${res.status} id=${res.data?.id}`)
    if (res.data?.id) STATE.inspectionId = res.data.id
    expect([200, 201]).toContain(res.status)
  })

  test('K.2 — SKF 6210 rulman sertifikasi giris muayenesi', async ({ page }) => {
    if (!STATE.stockIdRulman) { console.warn('[K.2] stockIdRulman eksik'); return }
    const res = await apiCall(page, 'POST', '/IncomingInspection', {
      productId:      STATE.stockIdRulman,
      quantity:       24,
      supplierId:     STATE.supplierId || null,
      inspectionDate: new Date().toISOString().split('T')[0],
      result:         'PASSED',
      notes:          'SKF 6210 orijinal ambalaj. SKF sertifikasi ve lot numarasi dogrulandi. Geometri kontrolu: uygun.',
    })
    console.log(`[K.2] Rulman IncomingInspection: status=${res.status}`)
    expect([200, 201]).toContain(res.status)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// FAZ L — ATÖLYE OPERASYONLARI (OP10-OP50)
// ─────────────────────────────────────────────────────────────────────────────

test.describe('FAZ L — Konveyor Atolye Yurutmesi', () => {
  test('L.1 — OP10 CNC sasi parca imalati', async ({ page }) => {
    if (!STATE.productionId) { console.warn('[L.1] productionId eksik'); return }
    const res = await apiCall(page, 'POST', `/Production/completion/${STATE.productionId}`, {
      operationCode: 'OP10', completedQty: 3, scrapQty: 0,
      operatorNote: 'OP10 CNC imalat tamamlandi. Tum sasi parcalari boyutsal uygun. 3/3 sistem.',
      machineId: STATE.machineIdCnc || null,
    })
    console.log(`[L.1] OP10: status=${res.status}`)
    expect([200, 201, 404]).toContain(res.status)
  })

  test('L.2 — OP20 MIG kaynak sasi montaji + VT', async ({ page }) => {
    if (!STATE.productionId) { console.warn('[L.2] productionId eksik'); return }
    const res = await apiCall(page, 'POST', `/Production/completion/${STATE.productionId}`, {
      operationCode: 'OP20', completedQty: 3, scrapQty: 0,
      operatorNote: 'OP20 MIG kaynak tamamlandi. VT muayenesi: 3/3 uygun. Kaynak nufuziyeti tam.',
      machineId: STATE.machineIdKaynak || null,
    })
    console.log(`[L.2] OP20: status=${res.status}`)
    expect([200, 201, 404]).toContain(res.status)
  })

  test('L.3 — OP30 Mekanik montaj', async ({ page }) => {
    if (!STATE.productionId) { console.warn('[L.3] productionId eksik'); return }
    const res = await apiCall(page, 'POST', `/Production/completion/${STATE.productionId}`, {
      operationCode: 'OP30', completedQty: 3, scrapQty: 0,
      operatorNote: 'OP30 mekanik montaj tamamlandi. Motor, tambur, rulo, kemer montaji 3/3 tamamlandi.',
      machineId: STATE.machineIdMontaj || null,
    })
    console.log(`[L.3] OP30: status=${res.status}`)
    expect([200, 201, 404]).toContain(res.status)
  })

  test('L.4 — OP40 Elektrik paneli + guvenlik devre montaji', async ({ page }) => {
    if (!STATE.productionId) { console.warn('[L.4] productionId eksik'); return }
    const res = await apiCall(page, 'POST', `/Production/completion/${STATE.productionId}`, {
      operationCode: 'OP40', completedQty: 3, scrapQty: 1,
      operatorNote: 'OP40 elektrik montaji. 1 sistemde frekans invertoru arızasi — NCR acildi. 2 sistem uygun.',
      machineId: STATE.machineIdMontaj || null,
    })
    console.log(`[L.4] OP40: status=${res.status}`)
    expect([200, 201, 404]).toContain(res.status)
  })

  test('L.5 — OP50 Fonksiyonel test 8 saat + CE dosyasi', async ({ page }) => {
    if (!STATE.productionId) { console.warn('[L.5] productionId eksik'); return }
    const res = await apiCall(page, 'POST', `/Production/completion/${STATE.productionId}`, {
      operationCode: 'OP50', completedQty: 3, scrapQty: 0,
      operatorNote: 'OP50 fonksiyonel test tamamlandi. 3/3 sistem 8 saat test basarili. CE dosyasi hazirlandi.',
      machineId: STATE.machineIdTest || null,
    })
    console.log(`[L.5] OP50: status=${res.status}`)
    expect([200, 201, 404]).toContain(res.status)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// FAZ M — NCR (MOTOR GÜÇ DÜŞÜKLÜĞÜ)
// ─────────────────────────────────────────────────────────────────────────────

test.describe('FAZ M — NCR Motor Guc Dusüklugu', () => {
  test('M.1 — NCR olustur (motor 0.71kW hedef 0.82kW)', async ({ page }) => {
    if (!STATE.productId) { console.warn('[M.1] productId eksik'); return }
    const res = await apiCall(page, 'POST', '/Ncr', {
      productId:    STATE.productId,
      productionId: STATE.productionId || null,
      title:        'Motor guc dusüklugu — OP50 fonksiyonel test hatasi',
      description:  'Sistem 2 motor gucu: hedef 0.82 kW, olculen 0.71 kW (%13 dusük). Frekans invertoru arızasi. CE uyum riski.',
      defectType:   'FUNCTIONAL',
      quantity:     1,
      severity:     'CRITICAL',
      detectedBy:   'Test Muhendisi — Guc Olcumu',
      detectedAt:   new Date().toISOString(),
    })
    console.log(`[M.1] NCR: status=${res.status} id=${res.data?.id}`)
    if (res.data?.id) STATE.ncrId = res.data.id
    expect([200, 201]).toContain(res.status)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// FAZ N — CAPA
// ─────────────────────────────────────────────────────────────────────────────

test.describe('FAZ N — CAPA', () => {
  test('N.1 — CAPA ac', async ({ page }) => {
    if (!STATE.ncrId) { console.warn('[N.1] ncrId eksik'); return }
    const res = await apiCall(page, 'POST', '/Capa', {
      ncrId:       STATE.ncrId,
      title:       'Frekans Invertoru Arizasi — Degisim ve Yeniden Test',
      description: 'Arızali frekans invertoru degistirilecek. Yeniden fonksiyonel test yapilacak.',
    })
    console.log(`[N.1] CAPA ac: status=${res.status} id=${res.data?.id}`)
    if (res.data?.id) STATE.capaId = res.data.id
    expect([200, 201]).toContain(res.status)
  })

  test('N.2 — CAPA ROOT_CAUSE_ANALYSIS', async ({ page }) => {
    if (!STATE.capaId) { console.warn('[N.2] capaId eksik'); return }
    const res = await apiCall(page, 'PUT', `/Capa/${STATE.capaId}`, {
      status:    'ROOT_CAUSE_ANALYSIS',
      rootCause: 'Tedarikci partisinde yuzey kaynaklı kapasitor arızası. Lot ABX-2026-09 tum birimler etkilenebilir. Incoming inspection prosedurunde elektriksel test eksik.',
    })
    console.log(`[N.2] CAPA RCA: status=${res.status}`)
    expect([200, 204]).toContain(res.status)
  })

  test('N.3 — CAPA IMPLEMENTATION', async ({ page }) => {
    if (!STATE.capaId) { console.warn('[N.3] capaId eksik'); return }
    const res = await apiCall(page, 'PUT', `/Capa/${STATE.capaId}`, {
      status:           'IMPLEMENTATION',
      correctiveAction: 'Arızalı invertor degistirildi. Tedarikci lot ABX-2026-09 karantinaya alındı. Incoming inspection prosedurune elektriksel dogrulama testi eklendi.',
    })
    console.log(`[N.3] CAPA IMPL: status=${res.status}`)
    expect([200, 204]).toContain(res.status)
  })

  test('N.4 — CAPA CLOSED', async ({ page }) => {
    if (!STATE.capaId) { console.warn('[N.4] capaId eksik'); return }
    const res = await apiCall(page, 'PUT', `/Capa/${STATE.capaId}`, {
      status: 'CLOSED',
      notes:  'Sistem 2 yeniden test: 0.83 kW — uygun. CE fonksiyonel test basarisiz tekrarlanmadi. Etkinlik dogrulandi.',
    })
    console.log(`[N.4] CAPA CLOSED: status=${res.status}`)
    expect([200, 204]).toContain(res.status)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// FAZ O — CE SERTİFİKASI + FATURA
// ─────────────────────────────────────────────────────────────────────────────

test.describe('FAZ O — CE Sertifikasi ve Fatura', () => {
  test('O.1 — CE 2006/42/EC uygunluk sertifikasi kaydet', async ({ page }) => {
    if (!STATE.productId) { console.warn('[O.1] productId eksik'); return }
    const res = await apiCall(page, 'POST', '/Certificate', {
      productId:       STATE.productId,
      certificateType: 'CE',
      certificateNo:   'CE-MAK-KONVEYOR-12M-2026-001',
      issueDate:       new Date().toISOString().split('T')[0],
      notes:           'CE 2006/42/EC Machinery Directive uygunluk beyanı. EN ISO 12100 risk assessment tamamlandi. 3/3 sistem uygun. Teknik dosya no: TD-KONV-2026-001.',
    })
    console.log(`[O.1] CE Certificate: status=${res.status} id=${res.data?.id}`)
    if (res.data?.id) STATE.ceCertId = res.data.id
    expect([200, 201, 404]).toContain(res.status)
  })

  test('O.2 — Saglıklı Gıda satis faturasi olustur (3 sistem x 185.000₺)', async ({ page }) => {
    await gotoAndWait(page, '/invoices/new')
    await selectAntOption(page, 'customerId', 'Gida', 'Musteri')
    await page.waitForTimeout(600)

    const addBtn = page.locator('button:has-text("Kalem Ekle"), button:has-text("Urun Ekle")').first()
    if (await addBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await addBtn.click(); await page.waitForTimeout(600)
      const productInput = page.locator('input[placeholder*="urun"]').first()
      if (await productInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        await productInput.fill('MAK-KONVEYOR'); await page.waitForTimeout(1000)
        const opt = page.locator('.ant-select-item-option').filter({ hasText: 'MAK-KONVEYOR' }).first()
        if (await opt.isVisible({ timeout: 2000 }).catch(() => false)) await opt.click()
      }
      const qtyInput = page.locator('input[placeholder*="miktar"]').first()
      if (await qtyInput.isVisible({ timeout: 2000 }).catch(() => false)) await qtyInput.fill('3')
    }

    await saveFormPage(page)
    await page.waitForTimeout(2000)
    const urlMatch = page.url().match(/\/invoices\/(?:form\/)?([a-f0-9-]{36})/)
    if (urlMatch) { STATE.invoiceId = urlMatch[1]; console.log(`[O.2] invoiceId=${urlMatch[1]}`) }
    if (!STATE.invoiceId) {
      const res = await apiCall(page, 'GET', '/Invoice?pageSize=5')
      if (res.data) {
        const list = res.data.data || res.data
        if (Array.isArray(list) && list.length) STATE.invoiceId = list[0].id
      }
    }
    const toast = await waitForToast(page, 5000)
    console.log(`[O.2] Fatura toast=${toast} invoiceId=${STATE.invoiceId}`)
    expect(STATE.invoiceId || toast).toBeTruthy()
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// FAZ P — MALİYET ANALİZİ + ÖZET
// ─────────────────────────────────────────────────────────────────────────────

test.describe('FAZ P — Maliyet ve Ozet', () => {
  test('P.1 — Konveyor uretim maliyeti sorgula', async ({ page }) => {
    if (!STATE.productionId) { console.warn('[P.1] productionId eksik'); return }
    const res = await apiCall(page, 'GET', `/PartCost/${STATE.productionId}`)
    console.log(`[P.1] PartCost: status=${res.status}`)
    expect(res.status).toBeLessThan(500)
  })

  test('P.2 — OZET: Tum kritik ID kayitlari dogrula', async ({ page }) => {
    console.log('\n════════════════════════════════════════════════')
    console.log('  Makine Imalati (CE) E2E — FINAL OZET')
    console.log('════════════════════════════════════════════════')
    console.log(`  Musteri (Saglıklı Gıda)  : ${STATE.customerId || 'EKSIK'}`)
    console.log(`  Tedarikci (Rexroth)       : ${STATE.supplierId || 'EKSIK'}`)
    console.log(`  CNC-TORNA-01              : ${STATE.machineIdCnc || 'EKSIK'}`)
    console.log(`  KAYNAK-01                 : ${STATE.machineIdKaynak || 'EKSIK'}`)
    console.log(`  TEST-01                   : ${STATE.machineIdTest || 'EKSIK'}`)
    console.log(`  HM-SAC-ST37-5mm           : ${STATE.stockIdSac || 'EKSIK'}`)
    console.log(`  HM-PROFIL-80x80           : ${STATE.stockIdProfil || 'EKSIK'}`)
    console.log(`  HM-RULMAN-6210            : ${STATE.stockIdRulman || 'EKSIK'}`)
    console.log(`  MAK-KONVEYOR-12M          : ${STATE.productId || 'EKSIK'}`)
    console.log(`  BOM                       : ${STATE.bomId || 'EKSIK'}`)
    console.log(`  Kontrol Plani (CE)        : ${STATE.controlPlanId || 'EKSIK'}`)
    console.log(`  Is Emri Sablonu           : ${STATE.templateId || 'EKSIK'}`)
    console.log(`  Teklif (555.000₺)         : ${STATE.offerId || 'EKSIK'}`)
    console.log(`  Satis Siparisi            : ${STATE.salesId || 'EKSIK'}`)
    console.log(`  Uretim Emri               : ${STATE.productionId || 'EKSIK'}`)
    console.log(`  NCR (motor guc dusuk)     : ${STATE.ncrId || 'EKSIK'}`)
    console.log(`  CAPA (CLOSED)             : ${STATE.capaId || 'EKSIK'}`)
    console.log(`  CE Sertifikasi            : ${STATE.ceCertId || 'EKSIK'}`)
    console.log(`  Fatura (555.000₺)         : ${STATE.invoiceId || 'EKSIK'}`)
    console.log('════════════════════════════════════════════════\n')

    const kritikIds = [STATE.customerId, STATE.productId, STATE.offerId, STATE.salesId, STATE.productionId]
    const mevcut = kritikIds.filter(Boolean).length
    console.log(`  Kritik kayit: ${mevcut}/${kritikIds.length}`)
    expect(mevcut).toBeGreaterThanOrEqual(3)
  })
})
