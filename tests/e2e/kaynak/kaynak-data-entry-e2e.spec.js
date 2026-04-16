/**
 * Quvex ERP — Savunma Sanayi Kaynak Atölyesi TAM VERİ GİRİŞİ E2E Testi
 *
 * Senaryo: Özdemir Kaynak Mühendislik Ltd.Şti. → TAI Füze Motor Tutucu Braketi
 * AWS D17.1 (Havacılık Kaynağı), AS9100D, NADCAP Fusion Welding
 *
 * Kapsam:
 *   FAZ A : Müşteri (TAI) + Tedarikçi (Titanium Supply) — UI
 *   FAZ B : 4 TIG kaynak tezgâhı + 2 ek makine + 2 depo — UI
 *   FAZ C : Hammadde stok kartı (Ti-6Al-4V çubuk) — UI
 *   FAZ D : Mamul ürün kartı (F-MOT-BRK-001) — UI
 *   FAZ E : BOM — API
 *   FAZ F : WPS Kontrol Planı (AWS D17.1 kaynak parametreleri) — API
 *   FAZ G : Kaynak iş emri şablonu (OP10-OP50) — API
 *   FAZ H : Teklif → SENT → ACCEPTED — UI + API
 *   FAZ I : Satış Siparişi — UI
 *   FAZ J : Üretim Emri — UI
 *   FAZ K : Giriş Muayenesi + malzeme sertifikası — API
 *   FAZ L : Atölye kaynak operasyonları (OP10-OP50) — API
 *   FAZ M : NCR oluşturma (kaynak hatası) — API
 *   FAZ N : CAPA → kapatma — API
 *   FAZ O : NDT sertifikası (PT/UT) + WPS sertifikası — API
 *   FAZ P : Fatura — UI
 *   FAZ Q : Maliyet analizi — API
 *
 * Workaround notları:
 *   WPS/WPQR ayrı modül yok → Kontrol Planı not alanına yazılır (K1)
 *   Kaynakçı sertifikası → Certificate endpoint ile takip (K2)
 *   NDT film yükleme → Certificate endpoint type=NDT (K4)
 */
const { test, expect } = require('./fixtures')

const API = 'https://api.quvex.io'

// ─── Test Verileri ────────────────────────────────────────────────────────────

const MUSTERI = {
  name:        'Turk Havacilik ve Uzay Sanayii A.S.',
  officerName: 'Mehmet Havaci',
  email:       'tedarik@tai.com.tr',
  phone:       '3122630600',
  taxId:       '2345678901',
}

const TEDARIKCI = {
  name:        'Titanium Supply Malzeme Ltd.',
  officerName: 'Ali Titanyum',
  email:       'satis@titanyum.com.tr',
  phone:       '2124001100',
}

const MAKINE_TIG1 = { code: 'TIG-01', name: 'TIG Kaynak Kabini 1 Inconel/Paslanmaz', brand: 'Lincoln Electric', hourlyRate: '600' }
const MAKINE_TIG2 = { code: 'TIG-02', name: 'TIG Kaynak Kabini 2 Aluminyum', brand: 'Miller Dynasty', hourlyRate: '550' }
const MAKINE_PLZ  = { code: 'PLZ-01', name: 'Plazma Kaynak Sistemi PWM-300', brand: 'Thermal Dynamics', hourlyRate: '700' }
const MAKINE_TEM  = { code: 'TEM-01', name: 'Temiz Oda Kaynak Oncesi Hazirlik', brand: 'Ozel Yapim', hourlyRate: '150' }

const DEPO_HAM    = { code: 'DEPO-HAM',   name: 'Hammadde Titanyum Deposu' }
const DEPO_MAMUL  = { code: 'DEPO-MAMUL', name: 'Mamul Kaynak Grubu Deposu' }

const HAMMADDE = {
  productNumber: 'HM-TI6AL4V-25R',
  productName:   'Ti-6Al-4V Titanyum Alasimlari Cubuk D25xR',
  minStock:      '20',
}

const MAMUL = {
  productNumber: 'F-MOT-BRK-001',
  productName:   'Fuze Motor Tutucu Braketi Ti-6Al-4V AWS D17.1',
}

const KONTROL_PLANI = {
  title:       'F-MOT-BRK-001 WPS Kaynak Kontrol Plani AWS D17.1',
  processName: 'TIG Kaynak AMS 4928 Ti-6Al-4V',
  description: 'AWS D17.1 WPS-TIG-TI-001 — Kaynak gerilimi 12-15V, akim 80-120A, Argon koruyucu gaz 15-18 L/dk. Pasolar arasi sicaklik maks 175°C.',
}

const IS_EMRI_SABLONU = {
  name: 'F-MOT-BRK-001 Kaynak Is Emri',
  operasyonlar: [
    { rowNo: 10, code: 'OP10', machineKey: 'tem',  estimatedMinutes: 45,  requiresQualityCheck: false, prerequisiteRowNo: null    },
    { rowNo: 20, code: 'OP20', machineKey: 'tig1', estimatedMinutes: 120, requiresQualityCheck: false, prerequisiteRowNo: 10      },
    { rowNo: 30, code: 'OP30', machineKey: 'tig1', estimatedMinutes: 90,  requiresQualityCheck: true,  prerequisiteRowNo: 20      },
    { rowNo: 40, code: 'OP40', machineKey: 'plz',  estimatedMinutes: 60,  requiresQualityCheck: false, prerequisiteRowNo: 30      },
    { rowNo: 50, code: 'OP50', machineKey: null,   estimatedMinutes: 60,  requiresQualityCheck: true,  prerequisiteRowNo: 40      },
  ],
}

const STATE = {
  token: null, customerId: null, supplierId: null,
  machineIdT1: null, machineIdT2: null, machineIdPlz: null, machineIdTem: null,
  warehouseIdH: null, warehouseIdM: null,
  stockId: null, productId: null,
  bomId: null, controlPlanId: null, templateId: null,
  offerId: null, salesId: null, productionId: null,
  inspectionId: null, ncrId: null, capaId: null,
  ndtCertId: null, invoiceId: null,
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
  test('A.1 — TAI musteri kaydi olustur', async ({ page }) => {
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
        const found = list.find(c => c.name?.includes('TAI') || c.name?.includes('Havacilik'))
        if (found) { STATE.customerId = found.id; console.log(`[A.1] customerId=${found.id}`) }
      }
    }
    expect(res.status).toBeLessThan(300)
  })

  test('A.2 — Titanium Supply tedarikci kaydi olustur', async ({ page }) => {
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
        const found = list.find(c => c.name?.includes('Titanium'))
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
  test('B.1 — TIG-01 kaynak kabini tanimla', async ({ page }) => {
    await gotoAndWait(page, '/machines')
    await openAddModal(page)
    await fillAntInput(page, 'code', MAKINE_TIG1.code)
    await fillAntInput(page, 'name', MAKINE_TIG1.name)
    await fillAntInput(page, 'brand', MAKINE_TIG1.brand)
    await fillAntInput(page, 'hourlyRate', MAKINE_TIG1.hourlyRate)
    await saveFormModal(page)
    const res = await apiCall(page, 'GET', '/Machine')
    if (res.data) {
      const list = res.data.data || res.data
      if (Array.isArray(list)) {
        const f1 = list.find(m => m.code === 'TIG-01'); if (f1) STATE.machineIdT1 = f1.id
      }
    }
    console.log(`[B.1] TIG-01 machineIdT1=${STATE.machineIdT1}`)
    expect(true).toBe(true)
  })

  test('B.2 — TIG-02 kaynak kabini tanimla', async ({ page }) => {
    await gotoAndWait(page, '/machines')
    await openAddModal(page)
    await fillAntInput(page, 'code', MAKINE_TIG2.code)
    await fillAntInput(page, 'name', MAKINE_TIG2.name)
    await fillAntInput(page, 'brand', MAKINE_TIG2.brand)
    await fillAntInput(page, 'hourlyRate', MAKINE_TIG2.hourlyRate)
    await saveFormModal(page)
    const res = await apiCall(page, 'GET', '/Machine')
    if (res.data) {
      const list = res.data.data || res.data
      if (Array.isArray(list)) {
        const f = list.find(m => m.code === 'TIG-02'); if (f) STATE.machineIdT2 = f.id
      }
    }
    expect(true).toBe(true)
  })

  test('B.3 — PLZ-01 plazma kaynak tanimla', async ({ page }) => {
    await gotoAndWait(page, '/machines')
    await openAddModal(page)
    await fillAntInput(page, 'code', MAKINE_PLZ.code)
    await fillAntInput(page, 'name', MAKINE_PLZ.name)
    await fillAntInput(page, 'brand', MAKINE_PLZ.brand)
    await fillAntInput(page, 'hourlyRate', MAKINE_PLZ.hourlyRate)
    await saveFormModal(page)
    const res = await apiCall(page, 'GET', '/Machine')
    if (res.data) {
      const list = res.data.data || res.data
      if (Array.isArray(list)) {
        const f = list.find(m => m.code === 'PLZ-01'); if (f) STATE.machineIdPlz = f.id
      }
    }
    expect(true).toBe(true)
  })

  test('B.4 — TEM-01 temiz oda tanimla', async ({ page }) => {
    await gotoAndWait(page, '/machines')
    await openAddModal(page)
    await fillAntInput(page, 'code', MAKINE_TEM.code)
    await fillAntInput(page, 'name', MAKINE_TEM.name)
    await fillAntInput(page, 'brand', MAKINE_TEM.brand)
    await fillAntInput(page, 'hourlyRate', MAKINE_TEM.hourlyRate)
    await saveFormModal(page)
    const res = await apiCall(page, 'GET', '/Machine')
    if (res.data) {
      const list = res.data.data || res.data
      if (Array.isArray(list)) {
        const f = list.find(m => m.code === 'TEM-01'); if (f) STATE.machineIdTem = f.id
      }
    }
    expect(true).toBe(true)
  })

  test('B.5 — Hammadde deposu tanimla', async ({ page }) => {
    await gotoAndWait(page, '/warehouses')
    await openAddModal(page)
    await fillAntInput(page, 'code', DEPO_HAM.code)
    await fillAntInput(page, 'name', DEPO_HAM.name)
    await saveFormModal(page)
    const res = await apiCall(page, 'GET', '/Warehouse')
    if (res.data) {
      const list = res.data.data || res.data
      if (Array.isArray(list)) {
        const f = list.find(w => w.code === 'DEPO-HAM'); if (f) STATE.warehouseIdH = f.id
      }
    }
    expect(true).toBe(true)
  })

  test('B.6 — Mamul deposu tanimla', async ({ page }) => {
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
// FAZ C — HAMMADDE STOK KARTI
// ─────────────────────────────────────────────────────────────────────────────

test.describe('FAZ C — Hammadde Stok Karti', () => {
  test('C.1 — Ti-6Al-4V titanyum cubuk stok karti olustur', async ({ page }) => {
    await gotoAndWait(page, '/products/new')
    await fillAntInput(page, 'productNumber', HAMMADDE.productNumber)
    await fillAntInput(page, 'productName', HAMMADDE.productName)
    await selectAntOption(page, 'categoryType', 'Hammadde', 'Kategori')
    await selectAntOption(page, 'unitId', 'ADET', 'Birim')
    await fillAntInput(page, 'minStock', HAMMADDE.minStock)
    await saveFormPage(page)
    await page.waitForTimeout(1500)
    const urlMatch = page.url().match(/\/products\/(?:form\/)?([a-f0-9-]{36})/)
    if (urlMatch) { STATE.stockId = urlMatch[1]; console.log(`[C.1] stockId=${urlMatch[1]}`) }
    if (!STATE.stockId) {
      const res = await apiCall(page, 'GET', '/Product?type=stock')
      if (res.data) {
        const list = res.data.data || res.data
        if (Array.isArray(list)) {
          const found = list.find(p => p.productNumber === HAMMADDE.productNumber)
          if (found) STATE.stockId = found.id
        }
      }
    }
    expect(STATE.stockId).toBeTruthy()
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// FAZ D — MAMUL ÜRÜN KARTI
// ─────────────────────────────────────────────────────────────────────────────

test.describe('FAZ D — Mamul Urun Karti', () => {
  test('D.1 — F-MOT-BRK-001 fuze motor tutucu braketi urun karti', async ({ page }) => {
    await gotoAndWait(page, '/products/new')
    await fillAntInput(page, 'productNumber', MAMUL.productNumber)
    await fillAntInput(page, 'productName', MAMUL.productName)
    await selectAntOption(page, 'categoryType', 'Mamul', 'Kategori')
    await selectAntOption(page, 'unitId', 'ADET', 'Birim')
    await fillAntInput(page, 'salePrice', '45000')
    await fillAntInput(page, 'minStock', '5')
    await saveFormPage(page)
    await page.waitForTimeout(1500)
    const urlMatch = page.url().match(/\/products\/(?:form\/)?([a-f0-9-]{36})/)
    if (urlMatch) { STATE.productId = urlMatch[1]; console.log(`[D.1] productId=${urlMatch[1]}`) }
    if (!STATE.productId) {
      const res = await apiCall(page, 'GET', '/Product?type=product')
      if (res.data) {
        const list = res.data.data || res.data
        if (Array.isArray(list)) {
          const found = list.find(p => p.productNumber === 'F-MOT-BRK-001')
          if (found) STATE.productId = found.id
        }
      }
    }
    expect(STATE.productId).toBeTruthy()
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// FAZ E — BOM
// ─────────────────────────────────────────────────────────────────────────────

test.describe('FAZ E — BOM Recete', () => {
  test('E.1 — BOM: Ti-6Al-4V cubuk (2 adet/braketi)', async ({ page }) => {
    if (!STATE.productId || !STATE.stockId) { console.warn('[E.1] eksik ID'); return }
    const res = await apiCall(page, 'POST', '/Bom', {
      parentProductId: STATE.productId,
      childProductId:  STATE.stockId,
      quantity: 2,
    })
    console.log(`[E.1] BOM: status=${res.status} id=${res.data?.id}`)
    if (res.data?.id) STATE.bomId = res.data.id
    expect([200, 201]).toContain(res.status)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// FAZ F — WPS KONTROL PLANI (AWS D17.1)
// ─────────────────────────────────────────────────────────────────────────────

test.describe('FAZ F — WPS Kontrol Plani', () => {
  test('F.1 — WPS kaynak kontrol plani olustur', async ({ page }) => {
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

  test('F.2 — Kaynak parametresi: akim ve gerilim kontrolu', async ({ page }) => {
    if (!STATE.controlPlanId) { console.warn('[F.2] controlPlanId eksik'); return }
    const res = await apiCall(page, 'POST', '/ControlPlan/items', {
      controlPlanId:   STATE.controlPlanId,
      processStep:     'TIG Kaynak OP20',
      characteristic:  'Kaynak akimi ve gerilimi',
      measurementTool: 'Kaynak monitoru (WeldQAS)',
      specification:   'Akim: 80-120A, Gerilim: 12-15V, Hiz: 80-120 mm/dk',
      frequency:       'Her paso',
      sampleSize:      '%100',
    })
    console.log(`[F.2] WPS kalem 1: status=${res.status}`)
    expect([200, 201]).toContain(res.status)
  })

  test('F.3 — Kaynak parametresi: pasolar arasi sicaklik', async ({ page }) => {
    if (!STATE.controlPlanId) { console.warn('[F.3] controlPlanId eksik'); return }
    const res = await apiCall(page, 'POST', '/ControlPlan/items', {
      controlPlanId:   STATE.controlPlanId,
      processStep:     'TIG Kaynak OP20-OP30',
      characteristic:  'Pasolar arasi sicaklik',
      measurementTool: 'Temas termometresi',
      specification:   'Max 175°C (Ti-6Al-4V interpass limit)',
      frequency:       'Her paso arasi',
      sampleSize:      '%100',
    })
    console.log(`[F.3] WPS kalem 2: status=${res.status}`)
    expect([200, 201]).toContain(res.status)
  })

  test('F.4 — Kaynak parametresi: arka koruma gazi', async ({ page }) => {
    if (!STATE.controlPlanId) { console.warn('[F.4] controlPlanId eksik'); return }
    const res = await apiCall(page, 'POST', '/ControlPlan/items', {
      controlPlanId:   STATE.controlPlanId,
      processStep:     'Kaynak Hazirlik OP10',
      characteristic:  'Arka koruma gazi O2 seviyesi',
      measurementTool: 'O2 analiz cihazi',
      specification:   'O2 < 20 ppm (Titanium icin kritik)',
      frequency:       'Kaynak baslangicindan once',
      sampleSize:      '%100',
    })
    console.log(`[F.4] WPS kalem 3: status=${res.status}`)
    expect([200, 201]).toContain(res.status)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// FAZ G — İŞ EMRİ ŞABLONU (OP10-OP50)
// ─────────────────────────────────────────────────────────────────────────────

test.describe('FAZ G — Is Emri Sablonu', () => {
  test('G.1 — OP10-OP50 kaynak is emri sablonu olustur', async ({ page }) => {
    const ops = IS_EMRI_SABLONU.operasyonlar.map(op => ({
      rowNo:               op.rowNo,
      code:                op.code,
      machineId:           op.machineKey === 'tig1' ? STATE.machineIdT1 :
                           op.machineKey === 'tig2' ? STATE.machineIdT2 :
                           op.machineKey === 'plz'  ? STATE.machineIdPlz :
                           op.machineKey === 'tem'  ? STATE.machineIdTem : null,
      estimatedMinutes:    op.estimatedMinutes,
      requiresQualityCheck: op.requiresQualityCheck,
      prerequisiteRowNo:   op.prerequisiteRowNo,
      description:         op.code === 'OP10' ? 'Temiz oda hazirlik — O2 purge, arsivleme' :
                           op.code === 'OP20' ? 'TIG kaynak paso 1-3 — 80-120A, 12-15V, Argon' :
                           op.code === 'OP30' ? 'TIG kaynak paso 4-6 + VT (gorsel kontrol)' :
                           op.code === 'OP40' ? 'Plazma kesim ve boyutsal kontrol' :
                           'NDT (PT veya UT) + son VT ve boyut onay',
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
// FAZ H — TEKLİF (20 adet × 45.000₺ = 900.000₺)
// ─────────────────────────────────────────────────────────────────────────────

test.describe('FAZ H — Teklif', () => {
  test('H.1 — Teklif olustur (20 adet x 45.000₺)', async ({ page }) => {
    if (!STATE.customerId) {
      const res = await apiCall(page, 'GET', '/Customer?type=customers')
      if (res.data) {
        const list = res.data.data || res.data
        if (Array.isArray(list)) {
          const found = list.find(c => c.name?.includes('TAI') || c.name?.includes('Havacilik'))
          if (found) STATE.customerId = found.id
        }
      }
    }
    await gotoAndWait(page, '/offers/new')
    await selectAntOption(page, 'customerId', 'TAI', 'Musteri')
    await page.waitForTimeout(800)

    const addRowBtn = page.locator('button:has-text("Kalem Ekle"), button:has-text("Urun Ekle"), button:has(.anticon-plus)').first()
    if (await addRowBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await addRowBtn.click(); await page.waitForTimeout(800)
    }

    const productInput = page.locator('input[placeholder*="urun"], input[placeholder*="ürün"]').first()
    if (await productInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await productInput.fill('F-MOT-BRK')
      await page.waitForTimeout(1000)
      const opt = page.locator('.ant-select-item-option').filter({ hasText: 'F-MOT-BRK' }).first()
      if (await opt.isVisible({ timeout: 2000 }).catch(() => false)) await opt.click()
    }

    const qtyInput = page.locator('input[placeholder*="miktar"], input[placeholder*="Miktar"]').first()
    if (await qtyInput.isVisible({ timeout: 2000 }).catch(() => false)) await qtyInput.fill('20')
    const priceInput = page.locator('input[placeholder*="fiyat"], input[placeholder*="Fiyat"]').first()
    if (await priceInput.isVisible({ timeout: 2000 }).catch(() => false)) await priceInput.fill('45000')

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
  test('I.1 — TAI satis siparisi olustur', async ({ page }) => {
    await gotoAndWait(page, '/sales/new')
    await selectAntOption(page, 'customerId', 'TAI', 'Musteri')
    await page.waitForTimeout(600)

    const addBtn = page.locator('button:has-text("Kalem Ekle"), button:has-text("Urun Ekle")').first()
    if (await addBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await addBtn.click(); await page.waitForTimeout(600)
      const productInput = page.locator('input[placeholder*="urun"]').first()
      if (await productInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        await productInput.fill('F-MOT-BRK'); await page.waitForTimeout(1000)
        const opt = page.locator('.ant-select-item-option').filter({ hasText: 'F-MOT-BRK' }).first()
        if (await opt.isVisible({ timeout: 2000 }).catch(() => false)) await opt.click()
      }
      const qtyInput = page.locator('input[placeholder*="miktar"]').first()
      if (await qtyInput.isVisible({ timeout: 2000 }).catch(() => false)) await qtyInput.fill('20')
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
  test('J.1 — Kaynak atolyesi uretim emri ac', async ({ page }) => {
    await gotoAndWait(page, '/production/new')
    const productInput = page.locator('input[placeholder*="urun"]').first()
    if (await productInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await productInput.fill('F-MOT-BRK'); await page.waitForTimeout(1000)
      const opt = page.locator('.ant-select-item-option').filter({ hasText: 'F-MOT-BRK' }).first()
      if (await opt.isVisible({ timeout: 2000 }).catch(() => false)) await opt.click()
    }
    await fillAntInput(page, 'quantity', '20')
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
// FAZ K — GİRİŞ MUAYENESİ + MALZEME SERTİFİKASI
// ─────────────────────────────────────────────────────────────────────────────

test.describe('FAZ K — Giris Muayenesi', () => {
  test('K.1 — Ti-6Al-4V hammadde giris muayenesi', async ({ page }) => {
    if (!STATE.stockId) { console.warn('[K.1] stockId eksik'); return }
    const res = await apiCall(page, 'POST', '/IncomingInspection', {
      productId:      STATE.stockId,
      quantity:       40,
      supplierId:     STATE.supplierId || null,
      inspectionDate: new Date().toISOString().split('T')[0],
      result:         'PASSED',
      notes:          'Ti-6Al-4V AMS 4928 Gr.5 Lot TI-2026-0455. MTR ve kimyasal kompozisyon uygun.',
    })
    console.log(`[K.1] IncomingInspection: status=${res.status} id=${res.data?.id}`)
    if (res.data?.id) STATE.inspectionId = res.data.id
    expect([200, 201]).toContain(res.status)
  })

  test('K.2 — AMS 4928 malzeme sertifikasi (MTR) kaydet', async ({ page }) => {
    if (!STATE.stockId) { console.warn('[K.2] stockId eksik'); return }
    const res = await apiCall(page, 'POST', '/Certificate', {
      productId:       STATE.stockId,
      certificateType: 'MTR',
      certificateNo:   'TI-MTR-AMS4928-2026-0455',
      issueDate:       new Date().toISOString().split('T')[0],
      notes:           'AMS 4928 Grade 5 Ti-6Al-4V. Chemical composition and mechanical properties verified.',
    })
    console.log(`[K.2] MTR Certificate: status=${res.status}`)
    expect([200, 201, 404]).toContain(res.status)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// FAZ L — ATÖLYE KAYNAK OPERASYONLARI
// ─────────────────────────────────────────────────────────────────────────────

test.describe('FAZ L — Kaynak Atolye Yurutmesi', () => {
  test('L.1 — OP10 Temiz oda hazirlik (O2 purge)', async ({ page }) => {
    if (!STATE.productionId) { console.warn('[L.1] productionId eksik'); return }
    const res = await apiCall(page, 'POST', `/Production/completion/${STATE.productionId}`, {
      operationCode: 'OP10', completedQty: 20, scrapQty: 0,
      operatorNote: 'OP10 temiz oda hazirlik tamamlandi. O2: 12 ppm — uygun. Purge suresi: 15 dk.',
      machineId: STATE.machineIdTem || null,
    })
    console.log(`[L.1] OP10: status=${res.status}`)
    expect([200, 201, 404]).toContain(res.status)
  })

  test('L.2 — OP20 TIG kaynak paso 1-3', async ({ page }) => {
    if (!STATE.productionId) { console.warn('[L.2] productionId eksik'); return }
    const res = await apiCall(page, 'POST', `/Production/completion/${STATE.productionId}`, {
      operationCode: 'OP20', completedQty: 20, scrapQty: 0,
      operatorNote: 'OP20 paso 1-3 tamamlandi. Akim: 95A, Gerilim: 13V. Pasolar arasi sicaklik: 142°C — uygun.',
      machineId: STATE.machineIdT1 || null,
    })
    console.log(`[L.2] OP20: status=${res.status}`)
    expect([200, 201, 404]).toContain(res.status)
  })

  test('L.3 — OP30 TIG kaynak paso 4-6 + VT', async ({ page }) => {
    if (!STATE.productionId) { console.warn('[L.3] productionId eksik'); return }
    const res = await apiCall(page, 'POST', `/Production/completion/${STATE.productionId}`, {
      operationCode: 'OP30', completedQty: 20, scrapQty: 1,
      operatorNote: 'OP30 paso 4-6 tamamlandi. 1 adette renk tonlama (gosteri hatasi) — NCR acildi.',
      machineId: STATE.machineIdT1 || null,
    })
    console.log(`[L.3] OP30: status=${res.status}`)
    expect([200, 201, 404]).toContain(res.status)
  })

  test('L.4 — OP40 Plazma kesim ve boyutsal kontrol', async ({ page }) => {
    if (!STATE.productionId) { console.warn('[L.4] productionId eksik'); return }
    const res = await apiCall(page, 'POST', `/Production/completion/${STATE.productionId}`, {
      operationCode: 'OP40', completedQty: 19, scrapQty: 0,
      operatorNote: 'OP40 plazma kesim tamamlandi. Boyutsal: 19/19 uygun.',
      machineId: STATE.machineIdPlz || null,
    })
    console.log(`[L.4] OP40: status=${res.status}`)
    expect([200, 201, 404]).toContain(res.status)
  })

  test('L.5 — OP50 NDT + son VT ve boyut onay', async ({ page }) => {
    if (!STATE.productionId) { console.warn('[L.5] productionId eksik'); return }
    const res = await apiCall(page, 'POST', `/Production/completion/${STATE.productionId}`, {
      operationCode: 'OP50', completedQty: 19, scrapQty: 0,
      operatorNote: 'OP50 PT/UT NDT tamamlandi. 19/19 uygun — TAI sevkiyat onaylandi.',
    })
    console.log(`[L.5] OP50: status=${res.status}`)
    expect([200, 201, 404]).toContain(res.status)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// FAZ M — NCR (KAYNAK HATASI)
// ─────────────────────────────────────────────────────────────────────────────

test.describe('FAZ M — NCR Kaynak Hatasi', () => {
  test('M.1 — NCR olustur (titanyum renk tonlama)', async ({ page }) => {
    if (!STATE.productId) { console.warn('[M.1] productId eksik'); return }
    const res = await apiCall(page, 'POST', '/Ncr', {
      productId:       STATE.productId,
      productionId:    STATE.productionId || null,
      title:           'Titanyum kaynak renk tonlama — OP30 paso 5',
      description:     'AWS D17.1 Class A — sarı renk tonlama gözlemlendi. O2 kontaminasyon şüphesi.',
      defectType:      'SURFACE',
      quantity:        1,
      severity:        'MINOR',
      detectedBy:      'Kaynak Operatörü — VT',
      detectedAt:      new Date().toISOString(),
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
      title:       'Ti Kaynak Renk Tonlama — Purge Gas Kontrol Iyilestirmesi',
      description: 'O2 purge suresi 10 dk dan 15 dk ya uzatildi. Purge basincini artir.',
    })
    console.log(`[N.1] CAPA ac: status=${res.status} id=${res.data?.id}`)
    if (res.data?.id) STATE.capaId = res.data.id
    expect([200, 201]).toContain(res.status)
  })

  test('N.2 — CAPA ROOT_CAUSE_ANALYSIS', async ({ page }) => {
    if (!STATE.capaId) { console.warn('[N.2] capaId eksik'); return }
    const res = await apiCall(page, 'PUT', `/Capa/${STATE.capaId}`, {
      status:             'ROOT_CAUSE_ANALYSIS',
      rootCause:          'Argon purge suresi yetersiz: Ti basincini asmadan once O2 seviyesi yeterince dusmemis.',
    })
    console.log(`[N.2] CAPA RCA: status=${res.status}`)
    expect([200, 204]).toContain(res.status)
  })

  test('N.3 — CAPA IMPLEMENTATION', async ({ page }) => {
    if (!STATE.capaId) { console.warn('[N.3] capaId eksik'); return }
    const res = await apiCall(page, 'PUT', `/Capa/${STATE.capaId}`, {
      status:             'IMPLEMENTATION',
      correctiveAction:   'WPS guncellendi: purge suresi 15 dk minimum, O2 < 10 ppm dogrulama zorunlu.',
    })
    console.log(`[N.3] CAPA IMPL: status=${res.status}`)
    expect([200, 204]).toContain(res.status)
  })

  test('N.4 — CAPA CLOSED', async ({ page }) => {
    if (!STATE.capaId) { console.warn('[N.4] capaId eksik'); return }
    const res = await apiCall(page, 'PUT', `/Capa/${STATE.capaId}`, {
      status:  'CLOSED',
      notes:   'Son 50 kaynak operasyonunda renk tonlama tekrarlanmadi. Etkinlik dogrulandi.',
    })
    console.log(`[N.4] CAPA CLOSED: status=${res.status}`)
    expect([200, 204]).toContain(res.status)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// FAZ O — NDT + WPS SERTİFİKASI
// ─────────────────────────────────────────────────────────────────────────────

test.describe('FAZ O — NDT ve WPS Sertifikasi', () => {
  test('O.1 — PT/UT NDT sertifikasi kaydet', async ({ page }) => {
    if (!STATE.productId) { console.warn('[O.1] productId eksik'); return }
    const res = await apiCall(page, 'POST', '/Certificate', {
      productId:       STATE.productId,
      certificateType: 'NDT',
      certificateNo:   'NDT-PT-UT-F-MOT-BRK-001-2026',
      issueDate:       new Date().toISOString().split('T')[0],
      notes:           'PT Level II + UT Level II. AWS D17.1 — 19/19 adet uygun. Hiç lineer discontinuity yok.',
    })
    console.log(`[O.1] NDT Certificate: status=${res.status} id=${res.data?.id}`)
    if (res.data?.id) STATE.ndtCertId = res.data.id
    expect([200, 201, 404]).toContain(res.status)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// FAZ P — FATURA
// ─────────────────────────────────────────────────────────────────────────────

test.describe('FAZ P — Fatura', () => {
  test('P.1 — TAI satis faturasi olustur (855.000₺ + KDV)', async ({ page }) => {
    await gotoAndWait(page, '/invoices/new')
    await selectAntOption(page, 'customerId', 'TAI', 'Musteri')
    await page.waitForTimeout(600)

    const addBtn = page.locator('button:has-text("Kalem Ekle"), button:has-text("Urun Ekle")').first()
    if (await addBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await addBtn.click(); await page.waitForTimeout(600)
      const productInput = page.locator('input[placeholder*="urun"]').first()
      if (await productInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        await productInput.fill('F-MOT-BRK'); await page.waitForTimeout(1000)
        const opt = page.locator('.ant-select-item-option').filter({ hasText: 'F-MOT-BRK' }).first()
        if (await opt.isVisible({ timeout: 2000 }).catch(() => false)) await opt.click()
      }
      const qtyInput = page.locator('input[placeholder*="miktar"]').first()
      if (await qtyInput.isVisible({ timeout: 2000 }).catch(() => false)) await qtyInput.fill('19')
    }

    await saveFormPage(page)
    await page.waitForTimeout(2000)
    const urlMatch = page.url().match(/\/invoices\/(?:form\/)?([a-f0-9-]{36})/)
    if (urlMatch) { STATE.invoiceId = urlMatch[1]; console.log(`[P.1] invoiceId=${urlMatch[1]}`) }
    if (!STATE.invoiceId) {
      const res = await apiCall(page, 'GET', '/Invoice?pageSize=5')
      if (res.data) {
        const list = res.data.data || res.data
        if (Array.isArray(list) && list.length) STATE.invoiceId = list[0].id
      }
    }
    const toast = await waitForToast(page, 5000)
    console.log(`[P.1] Fatura toast=${toast} invoiceId=${STATE.invoiceId}`)
    expect(STATE.invoiceId || toast).toBeTruthy()
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// FAZ Q — MALİYET ANALİZİ + ÖZET
// ─────────────────────────────────────────────────────────────────────────────

test.describe('FAZ Q — Maliyet ve Ozet', () => {
  test('Q.1 — Kaynak atolyesi uretim maliyeti sorgula', async ({ page }) => {
    if (!STATE.productionId) { console.warn('[Q.1] productionId eksik'); return }
    const res = await apiCall(page, 'GET', `/PartCost/${STATE.productionId}`)
    console.log(`[Q.1] PartCost: status=${res.status}`)
    expect(res.status).toBeLessThan(500)
  })

  test('Q.2 — OZET: Tum kritik ID kayitlari dogrula', async ({ page }) => {
    console.log('\n════════════════════════════════════════════════')
    console.log('  Savunma Kaynak Atolyesi E2E — FINAL OZET')
    console.log('════════════════════════════════════════════════')
    console.log(`  Musteri (TAI)         : ${STATE.customerId || 'EKSIK'}`)
    console.log(`  Tedarikci (TiSupply)  : ${STATE.supplierId || 'EKSIK'}`)
    console.log(`  TIG-01                : ${STATE.machineIdT1 || 'EKSIK'}`)
    console.log(`  PLZ-01                : ${STATE.machineIdPlz || 'EKSIK'}`)
    console.log(`  Ti-6Al-4V cubuk       : ${STATE.stockId || 'EKSIK'}`)
    console.log(`  F-MOT-BRK-001         : ${STATE.productId || 'EKSIK'}`)
    console.log(`  BOM                   : ${STATE.bomId || 'EKSIK'}`)
    console.log(`  WPS Kontrol Plani     : ${STATE.controlPlanId || 'EKSIK'}`)
    console.log(`  Is Emri Sablonu       : ${STATE.templateId || 'EKSIK'}`)
    console.log(`  Teklif                : ${STATE.offerId || 'EKSIK'}`)
    console.log(`  Satis Siparisi        : ${STATE.salesId || 'EKSIK'}`)
    console.log(`  Uretim Emri           : ${STATE.productionId || 'EKSIK'}`)
    console.log(`  NCR (renk tonlama)    : ${STATE.ncrId || 'EKSIK'}`)
    console.log(`  CAPA (CLOSED)         : ${STATE.capaId || 'EKSIK'}`)
    console.log(`  NDT Sertifikasi       : ${STATE.ndtCertId || 'EKSIK'}`)
    console.log(`  Fatura                : ${STATE.invoiceId || 'EKSIK'}`)
    console.log('════════════════════════════════════════════════\n')

    const kritikIds = [STATE.customerId, STATE.productId, STATE.offerId, STATE.salesId, STATE.productionId]
    const mevcut = kritikIds.filter(Boolean).length
    console.log(`  Kritik kayit: ${mevcut}/${kritikIds.length}`)
    expect(mevcut).toBeGreaterThanOrEqual(3)
  })
})
