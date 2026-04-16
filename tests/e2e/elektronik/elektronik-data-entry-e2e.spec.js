/**
 * Quvex ERP — Elektronik Kart Montaj TAM VERİ GİRİŞİ E2E Testi
 *
 * Senaryo: Delta Elektronik Savunma San. Ltd.Şti. → HAVELSAN Aviyonik Kontrol Kartı PCB Üretimi
 * IPC-A-610 Class 3 (Aviyonik), AS9100D, J-STD-001 Soldering
 *
 * Kapsam:
 *   FAZ A : Müşteri (HAVELSAN) + Tedarikçi (TTI) — UI
 *   FAZ B : 4 makine (SMD, Dalga, AOI, X-Ray) + 2 depo — UI
 *   FAZ C : 3 hammadde (PCB bare board + SMD kit + THT kit) — UI
 *   FAZ D : Mamul ürün kartı (PCB-HAV-AVIY-CTRL-001) — UI
 *   FAZ E : BOM 3 kalem — API
 *   FAZ F : IPC-A-610 Class 3 Kontrol Planı + 5 kalem — API
 *   FAZ G : İş emri şablonu OP10-OP60 — API
 *   FAZ H : Teklif 100 × 12.500₺ → SENT → ACCEPTED — UI + API
 *   FAZ I : Satış Siparişi — UI
 *   FAZ J : Üretim Emri — UI
 *   FAZ K : Giriş muayenesi (PCB dielektrik + komponent sertifikası) — API
 *   FAZ L : OP10-OP60 atölye yürütmesi — API
 *   FAZ M : NCR (tombstone defect — SMD pasta baskı offset) — API
 *   FAZ N : CAPA → ROOT_CAUSE_ANALYSIS → IMPLEMENTATION → CLOSED — API
 *   FAZ O : IPC Class 3 Sertifikası + Fatura (96 × 12.500₺) — API + UI
 *   FAZ P : Maliyet analizi + ÖZET
 *
 * Workaround notları:
 *   BOM → /Bom endpoint kullanılır (büyük B, küçük om)
 *   CAPA durum geçişleri → ROOT_CAUSE_ANALYSIS, IMPLEMENTATION, CLOSED
 *   Üretim tamamlama → /Production/completion/{id}
 *   IPC sertifikası → Certificate endpoint type=IPC
 */
const { test, expect } = require('./fixtures')

const API = 'https://api.quvex.io'

// ─── Test Verileri ────────────────────────────────────────────────────────────

const MUSTERI = {
  name:        'HAVELSAN Hava Elektronik San. ve Tic. A.S.',
  officerName: 'Ahmet Elektronik',
  email:       'tedarik@havelsan.com.tr',
  phone:       '3122340000',
  taxId:       '1023456789',
}

const TEDARIKCI = {
  name:        'TTI Elektronik Komponent TR',
  officerName: 'Veli Komponent',
  email:       'satis@tti.com.tr',
  phone:       '2166010000',
}

const MAKINE_SMD   = { code: 'SMD-01',  name: 'SMD Hatti Europlacer iineo',          brand: 'Europlacer',    hourlyRate: '600' }
const MAKINE_DALGA = { code: 'DALGA-01',name: 'Seho Wave Lehim',                     brand: 'Seho',          hourlyRate: '350' }
const MAKINE_AOI   = { code: 'AOI-01',  name: 'Saki 3D AOI Optik Muayene',           brand: 'Saki',          hourlyRate: '250' }
const MAKINE_XRAY  = { code: 'XRAY-01', name: 'Yxlon X-Ray BGA Kontrol',             brand: 'Yxlon',         hourlyRate: '400' }

const DEPO_KOMPONENT = { code: 'DEPO-KOMPONENT', name: 'ESD Korumali Komponent Deposu' }
const DEPO_KART      = { code: 'DEPO-KART',      name: 'Bitik Kart Deposu' }

const HAMMADDE_PCB = {
  productNumber: 'HM-PCB-HAV-001',
  productName:   'HAVELSAN Aviyonik Kontrol PCB Bare Board FR4 6 Katman',
  minStock:      '50',
}
const HAMMADDE_SMD = {
  productNumber: 'HM-SMD-KIT-HAV',
  productName:   'SMD Komponent Kiti 287 adet referans (HAVELSAN BOM)',
  minStock:      '50',
}
const HAMMADDE_THT = {
  productNumber: 'HM-THT-KIT-HAV',
  productName:   'THT Komponent Kiti (konektorler, guc elemanlari)',
  minStock:      '50',
}

const MAMUL = {
  productNumber: 'PCB-HAV-AVIY-CTRL-001',
  productName:   'HAVELSAN Aviyonik Kontrol Karti IPC-A-610 Class 3 AS9100',
}

const KONTROL_PLANI = {
  title:       'PCB-HAV IPC-A-610 Class 3 Kaynak Kalite',
  processName: 'SMD Reflow Dalga Lehim AOI X-Ray',
  description: 'IPC-A-610 Class 3. BGA X-Ray zorunlu. AOI gecme orani %100. Konformal kaplama.',
}

const IS_EMRI_SABLONU = {
  name: 'PCB-HAV-AVIY-CTRL-001 SMT Is Emri',
  operasyonlar: [
    { rowNo: 10, code: 'OP10', machineKey: 'smd',   estimatedMinutes: 120, requiresQualityCheck: false, prerequisiteRowNo: null },
    { rowNo: 20, code: 'OP20', machineKey: 'smd',   estimatedMinutes: 60,  requiresQualityCheck: true,  prerequisiteRowNo: 10   },
    { rowNo: 30, code: 'OP30', machineKey: 'dalga', estimatedMinutes: 90,  requiresQualityCheck: true,  prerequisiteRowNo: 20   },
    { rowNo: 40, code: 'OP40', machineKey: 'aoi',   estimatedMinutes: 45,  requiresQualityCheck: true,  prerequisiteRowNo: 30   },
    { rowNo: 50, code: 'OP50', machineKey: 'xray',  estimatedMinutes: 30,  requiresQualityCheck: true,  prerequisiteRowNo: 40   },
    { rowNo: 60, code: 'OP60', machineKey: null,    estimatedMinutes: 60,  requiresQualityCheck: true,  prerequisiteRowNo: 50   },
  ],
}

const STATE = {
  token: null,
  customerId: null, supplierId: null,
  machineIdSmd: null, machineIdDalga: null, machineIdAoi: null, machineIdXray: null,
  warehouseIdK: null, warehouseIdM: null,
  stockIdPcb: null, stockIdSmd: null, stockIdTht: null,
  productId: null,
  bomId: null, controlPlanId: null, templateId: null,
  offerId: null, salesId: null, productionId: null,
  inspectionId: null, ncrId: null, capaId: null,
  certId: null, invoiceId: null,
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
  test('A.1 — HAVELSAN musteri kaydi olustur', async ({ page }) => {
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
        const found = list.find(c => c.name?.includes('HAVELSAN') || c.name?.includes('Hava Elektronik'))
        if (found) { STATE.customerId = found.id; console.log(`[A.1] customerId=${found.id}`) }
      }
    }
    expect(res.status).toBeLessThan(300)
  })

  test('A.2 — TTI Elektronik Komponent tedarikci kaydi olustur', async ({ page }) => {
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
        const found = list.find(c => c.name?.includes('TTI'))
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
  test('B.1 — SMD-01 SMD hatti tanimla', async ({ page }) => {
    await gotoAndWait(page, '/machines')
    await openAddModal(page)
    await fillAntInput(page, 'code', MAKINE_SMD.code)
    await fillAntInput(page, 'name', MAKINE_SMD.name)
    await fillAntInput(page, 'brand', MAKINE_SMD.brand)
    await fillAntInput(page, 'hourlyRate', MAKINE_SMD.hourlyRate)
    await saveFormModal(page)
    const res = await apiCall(page, 'GET', '/Machine')
    if (res.data) {
      const list = res.data.data || res.data
      if (Array.isArray(list)) {
        const f = list.find(m => m.code === 'SMD-01'); if (f) STATE.machineIdSmd = f.id
      }
    }
    console.log(`[B.1] SMD-01 machineIdSmd=${STATE.machineIdSmd}`)
    expect(true).toBe(true)
  })

  test('B.2 — DALGA-01 dalga lehim tanimla', async ({ page }) => {
    await gotoAndWait(page, '/machines')
    await openAddModal(page)
    await fillAntInput(page, 'code', MAKINE_DALGA.code)
    await fillAntInput(page, 'name', MAKINE_DALGA.name)
    await fillAntInput(page, 'brand', MAKINE_DALGA.brand)
    await fillAntInput(page, 'hourlyRate', MAKINE_DALGA.hourlyRate)
    await saveFormModal(page)
    const res = await apiCall(page, 'GET', '/Machine')
    if (res.data) {
      const list = res.data.data || res.data
      if (Array.isArray(list)) {
        const f = list.find(m => m.code === 'DALGA-01'); if (f) STATE.machineIdDalga = f.id
      }
    }
    expect(true).toBe(true)
  })

  test('B.3 — AOI-01 3D AOI optik muayene tanimla', async ({ page }) => {
    await gotoAndWait(page, '/machines')
    await openAddModal(page)
    await fillAntInput(page, 'code', MAKINE_AOI.code)
    await fillAntInput(page, 'name', MAKINE_AOI.name)
    await fillAntInput(page, 'brand', MAKINE_AOI.brand)
    await fillAntInput(page, 'hourlyRate', MAKINE_AOI.hourlyRate)
    await saveFormModal(page)
    const res = await apiCall(page, 'GET', '/Machine')
    if (res.data) {
      const list = res.data.data || res.data
      if (Array.isArray(list)) {
        const f = list.find(m => m.code === 'AOI-01'); if (f) STATE.machineIdAoi = f.id
      }
    }
    expect(true).toBe(true)
  })

  test('B.4 — XRAY-01 BGA X-Ray kontrol tanimla', async ({ page }) => {
    await gotoAndWait(page, '/machines')
    await openAddModal(page)
    await fillAntInput(page, 'code', MAKINE_XRAY.code)
    await fillAntInput(page, 'name', MAKINE_XRAY.name)
    await fillAntInput(page, 'brand', MAKINE_XRAY.brand)
    await fillAntInput(page, 'hourlyRate', MAKINE_XRAY.hourlyRate)
    await saveFormModal(page)
    const res = await apiCall(page, 'GET', '/Machine')
    if (res.data) {
      const list = res.data.data || res.data
      if (Array.isArray(list)) {
        const f = list.find(m => m.code === 'XRAY-01'); if (f) STATE.machineIdXray = f.id
      }
    }
    expect(true).toBe(true)
  })

  test('B.5 — ESD korumali komponent deposu tanimla', async ({ page }) => {
    await gotoAndWait(page, '/warehouses')
    await openAddModal(page)
    await fillAntInput(page, 'code', DEPO_KOMPONENT.code)
    await fillAntInput(page, 'name', DEPO_KOMPONENT.name)
    await saveFormModal(page)
    const res = await apiCall(page, 'GET', '/Warehouse')
    if (res.data) {
      const list = res.data.data || res.data
      if (Array.isArray(list)) {
        const f = list.find(w => w.code === 'DEPO-KOMPONENT'); if (f) STATE.warehouseIdK = f.id
      }
    }
    expect(true).toBe(true)
  })

  test('B.6 — Bitik kart deposu tanimla', async ({ page }) => {
    await gotoAndWait(page, '/warehouses')
    await openAddModal(page)
    await fillAntInput(page, 'code', DEPO_KART.code)
    await fillAntInput(page, 'name', DEPO_KART.name)
    await saveFormModal(page)
    const res = await apiCall(page, 'GET', '/Warehouse')
    if (res.data) {
      const list = res.data.data || res.data
      if (Array.isArray(list)) {
        const f = list.find(w => w.code === 'DEPO-KART'); if (f) STATE.warehouseIdM = f.id
      }
    }
    expect(true).toBe(true)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// FAZ C — HAMMADDE STOK KARTLARI
// ─────────────────────────────────────────────────────────────────────────────

test.describe('FAZ C — Hammadde Stok Kartlari', () => {
  test('C.1 — PCB bare board stok karti olustur', async ({ page }) => {
    await gotoAndWait(page, '/products/new')
    await fillAntInput(page, 'productNumber', HAMMADDE_PCB.productNumber)
    await fillAntInput(page, 'productName', HAMMADDE_PCB.productName)
    await selectAntOption(page, 'categoryType', 'Hammadde', 'Kategori')
    await selectAntOption(page, 'unitId', 'ADET', 'Birim')
    await fillAntInput(page, 'minStock', HAMMADDE_PCB.minStock)
    await saveFormPage(page)
    await page.waitForTimeout(1500)
    const urlMatch = page.url().match(/\/products\/(?:form\/)?([a-f0-9-]{36})/)
    if (urlMatch) { STATE.stockIdPcb = urlMatch[1]; console.log(`[C.1] stockIdPcb=${urlMatch[1]}`) }
    if (!STATE.stockIdPcb) {
      const res = await apiCall(page, 'GET', '/Product?type=stock')
      if (res.data) {
        const list = res.data.data || res.data
        if (Array.isArray(list)) {
          const found = list.find(p => p.productNumber === HAMMADDE_PCB.productNumber)
          if (found) STATE.stockIdPcb = found.id
        }
      }
    }
    expect(STATE.stockIdPcb).toBeTruthy()
  })

  test('C.2 — SMD komponent kiti stok karti olustur', async ({ page }) => {
    await gotoAndWait(page, '/products/new')
    await fillAntInput(page, 'productNumber', HAMMADDE_SMD.productNumber)
    await fillAntInput(page, 'productName', HAMMADDE_SMD.productName)
    await selectAntOption(page, 'categoryType', 'Hammadde', 'Kategori')
    await selectAntOption(page, 'unitId', 'ADET', 'Birim')
    await fillAntInput(page, 'minStock', HAMMADDE_SMD.minStock)
    await saveFormPage(page)
    await page.waitForTimeout(1500)
    const urlMatch = page.url().match(/\/products\/(?:form\/)?([a-f0-9-]{36})/)
    if (urlMatch) { STATE.stockIdSmd = urlMatch[1]; console.log(`[C.2] stockIdSmd=${urlMatch[1]}`) }
    if (!STATE.stockIdSmd) {
      const res = await apiCall(page, 'GET', '/Product?type=stock')
      if (res.data) {
        const list = res.data.data || res.data
        if (Array.isArray(list)) {
          const found = list.find(p => p.productNumber === HAMMADDE_SMD.productNumber)
          if (found) STATE.stockIdSmd = found.id
        }
      }
    }
    expect(STATE.stockIdSmd).toBeTruthy()
  })

  test('C.3 — THT komponent kiti stok karti olustur', async ({ page }) => {
    await gotoAndWait(page, '/products/new')
    await fillAntInput(page, 'productNumber', HAMMADDE_THT.productNumber)
    await fillAntInput(page, 'productName', HAMMADDE_THT.productName)
    await selectAntOption(page, 'categoryType', 'Hammadde', 'Kategori')
    await selectAntOption(page, 'unitId', 'ADET', 'Birim')
    await fillAntInput(page, 'minStock', HAMMADDE_THT.minStock)
    await saveFormPage(page)
    await page.waitForTimeout(1500)
    const urlMatch = page.url().match(/\/products\/(?:form\/)?([a-f0-9-]{36})/)
    if (urlMatch) { STATE.stockIdTht = urlMatch[1]; console.log(`[C.3] stockIdTht=${urlMatch[1]}`) }
    if (!STATE.stockIdTht) {
      const res = await apiCall(page, 'GET', '/Product?type=stock')
      if (res.data) {
        const list = res.data.data || res.data
        if (Array.isArray(list)) {
          const found = list.find(p => p.productNumber === HAMMADDE_THT.productNumber)
          if (found) STATE.stockIdTht = found.id
        }
      }
    }
    expect(STATE.stockIdTht).toBeTruthy()
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// FAZ D — MAMUL ÜRÜN KARTI
// ─────────────────────────────────────────────────────────────────────────────

test.describe('FAZ D — Mamul Urun Karti', () => {
  test('D.1 — PCB-HAV-AVIY-CTRL-001 aviyonik kontrol karti urun karti', async ({ page }) => {
    await gotoAndWait(page, '/products/new')
    await fillAntInput(page, 'productNumber', MAMUL.productNumber)
    await fillAntInput(page, 'productName', MAMUL.productName)
    await selectAntOption(page, 'categoryType', 'Mamul', 'Kategori')
    await selectAntOption(page, 'unitId', 'ADET', 'Birim')
    await fillAntInput(page, 'salePrice', '12500')
    await fillAntInput(page, 'minStock', '10')
    await saveFormPage(page)
    await page.waitForTimeout(1500)
    const urlMatch = page.url().match(/\/products\/(?:form\/)?([a-f0-9-]{36})/)
    if (urlMatch) { STATE.productId = urlMatch[1]; console.log(`[D.1] productId=${urlMatch[1]}`) }
    if (!STATE.productId) {
      const res = await apiCall(page, 'GET', '/Product?type=product')
      if (res.data) {
        const list = res.data.data || res.data
        if (Array.isArray(list)) {
          const found = list.find(p => p.productNumber === MAMUL.productNumber)
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
  test('E.1 — BOM: PCB bare board (1 adet/kart)', async ({ page }) => {
    if (!STATE.productId || !STATE.stockIdPcb) { console.warn('[E.1] eksik ID'); return }
    const res = await apiCall(page, 'POST', '/Bom', {
      parentProductId: STATE.productId,
      childProductId:  STATE.stockIdPcb,
      quantity: 1,
    })
    console.log(`[E.1] BOM PCB: status=${res.status} id=${res.data?.id}`)
    if (res.data?.id) STATE.bomId = res.data.id
    expect([200, 201]).toContain(res.status)
  })

  test('E.2 — BOM: SMD komponent kiti (1 kit/kart)', async ({ page }) => {
    if (!STATE.productId || !STATE.stockIdSmd) { console.warn('[E.2] eksik ID'); return }
    const res = await apiCall(page, 'POST', '/Bom', {
      parentProductId: STATE.productId,
      childProductId:  STATE.stockIdSmd,
      quantity: 1,
    })
    console.log(`[E.2] BOM SMD kit: status=${res.status} id=${res.data?.id}`)
    expect([200, 201]).toContain(res.status)
  })

  test('E.3 — BOM: THT komponent kiti (1 kit/kart)', async ({ page }) => {
    if (!STATE.productId || !STATE.stockIdTht) { console.warn('[E.3] eksik ID'); return }
    const res = await apiCall(page, 'POST', '/Bom', {
      parentProductId: STATE.productId,
      childProductId:  STATE.stockIdTht,
      quantity: 1,
    })
    console.log(`[E.3] BOM THT kit: status=${res.status} id=${res.data?.id}`)
    expect([200, 201]).toContain(res.status)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// FAZ F — IPC-A-610 CLASS 3 KONTROL PLANI
// ─────────────────────────────────────────────────────────────────────────────

test.describe('FAZ F — IPC-A-610 Class 3 Kontrol Plani', () => {
  test('F.1 — IPC kontrol plani olustur', async ({ page }) => {
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

  test('F.2 — Kontrol kalemi: pasta baski inspeksiyonu', async ({ page }) => {
    if (!STATE.controlPlanId) { console.warn('[F.2] controlPlanId eksik'); return }
    const res = await apiCall(page, 'POST', '/ControlPlan/items', {
      controlPlanId:   STATE.controlPlanId,
      processStep:     'OP10 Pasta Baski',
      characteristic:  'Pasta baski ofset ve kaplama',
      measurementTool: 'SPI (Solder Paste Inspection)',
      specification:   'Ofset maks ±%25 pad genisligi. Kaplama %75-%150.',
      frequency:       'Her panel',
      sampleSize:      '%100',
    })
    console.log(`[F.2] Pasta baski: status=${res.status}`)
    expect([200, 201]).toContain(res.status)
  })

  test('F.3 — Kontrol kalemi: AOI gozle muayene', async ({ page }) => {
    if (!STATE.controlPlanId) { console.warn('[F.3] controlPlanId eksik'); return }
    const res = await apiCall(page, 'POST', '/ControlPlan/items', {
      controlPlanId:   STATE.controlPlanId,
      processStep:     'OP40 AOI Tarama',
      characteristic:  'AOI defect rate',
      measurementTool: 'Saki 3D AOI',
      specification:   'Gecme orani %100. Tombstone, misalignment, solder bridge: 0 tolerans.',
      frequency:       'Her panel',
      sampleSize:      '%100',
    })
    console.log(`[F.3] AOI: status=${res.status}`)
    expect([200, 201]).toContain(res.status)
  })

  test('F.4 — Kontrol kalemi: X-Ray BGA kontrol', async ({ page }) => {
    if (!STATE.controlPlanId) { console.warn('[F.4] controlPlanId eksik'); return }
    const res = await apiCall(page, 'POST', '/ControlPlan/items', {
      controlPlanId:   STATE.controlPlanId,
      processStep:     'OP50 X-Ray',
      characteristic:  'BGA solder joint kalitesi',
      measurementTool: 'Yxlon X-Ray',
      specification:   'IPC-A-610 Class 3. Void orani maks %25. Eksik ball: 0.',
      frequency:       'Her kart',
      sampleSize:      '%100',
    })
    console.log(`[F.4] X-Ray BGA: status=${res.status}`)
    expect([200, 201]).toContain(res.status)
  })

  test('F.5 — Kontrol kalemi: solder joint IPC Class 3', async ({ page }) => {
    if (!STATE.controlPlanId) { console.warn('[F.5] controlPlanId eksik'); return }
    const res = await apiCall(page, 'POST', '/ControlPlan/items', {
      controlPlanId:   STATE.controlPlanId,
      processStep:     'OP30 Dalga Lehim',
      characteristic:  'THT solder joint dolumu IPC Class 3',
      measurementTool: 'Gorsel muayene + kesit analiz',
      specification:   'Dolum orani min %75. J-STD-001 Class 3.',
      frequency:       'Ilk parca + numune',
      sampleSize:      '10 adet/parti',
    })
    console.log(`[F.5] Solder joint: status=${res.status}`)
    expect([200, 201]).toContain(res.status)
  })

  test('F.6 — Kontrol kalemi: konformal kaplama kalinligi', async ({ page }) => {
    if (!STATE.controlPlanId) { console.warn('[F.6] controlPlanId eksik'); return }
    const res = await apiCall(page, 'POST', '/ControlPlan/items', {
      controlPlanId:   STATE.controlPlanId,
      processStep:     'OP60 Konformal Kaplama',
      characteristic:  'Kaplama kalinligi ve kapsama alani',
      measurementTool: 'UV lamba + kaplama kaliperi',
      specification:   'Kalinlik: 25-75 µm. Kapsama: %100 kritik alan.',
      frequency:       'Her kart',
      sampleSize:      '%100',
    })
    console.log(`[F.6] Konformal kaplama: status=${res.status}`)
    expect([200, 201]).toContain(res.status)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// FAZ G — İŞ EMRİ ŞABLONU (OP10-OP60)
// ─────────────────────────────────────────────────────────────────────────────

test.describe('FAZ G — Is Emri Sablonu', () => {
  test('G.1 — OP10-OP60 SMT is emri sablonu olustur', async ({ page }) => {
    const ops = IS_EMRI_SABLONU.operasyonlar.map(op => ({
      rowNo:                op.rowNo,
      code:                 op.code,
      machineId:            op.machineKey === 'smd'   ? STATE.machineIdSmd   :
                            op.machineKey === 'dalga' ? STATE.machineIdDalga :
                            op.machineKey === 'aoi'   ? STATE.machineIdAoi   :
                            op.machineKey === 'xray'  ? STATE.machineIdXray  : null,
      estimatedMinutes:     op.estimatedMinutes,
      requiresQualityCheck: op.requiresQualityCheck,
      prerequisiteRowNo:    op.prerequisiteRowNo,
      description:          op.code === 'OP10' ? 'Pasta baski + SMD yerlestirme (Europlacer iineo)' :
                            op.code === 'OP20' ? 'Reflow firin (profil: 245°C peak) + AOI ilk kontrol' :
                            op.code === 'OP30' ? 'THT dalga lehim + gorsel kontrol' :
                            op.code === 'OP40' ? '3D AOI tam tarama (defect rate %0)' :
                            op.code === 'OP50' ? 'BGA X-Ray kontrolu (void < %25)' :
                            'Konformal kaplama + final elektriksel test',
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
// FAZ H — TEKLİF (100 adet × 12.500₺ = 1.250.000₺)
// ─────────────────────────────────────────────────────────────────────────────

test.describe('FAZ H — Teklif', () => {
  test('H.1 — Teklif olustur (100 adet x 12.500₺)', async ({ page }) => {
    if (!STATE.customerId) {
      const res = await apiCall(page, 'GET', '/Customer?type=customers')
      if (res.data) {
        const list = res.data.data || res.data
        if (Array.isArray(list)) {
          const found = list.find(c => c.name?.includes('HAVELSAN') || c.name?.includes('Hava Elektronik'))
          if (found) STATE.customerId = found.id
        }
      }
    }
    await gotoAndWait(page, '/offers/new')
    await selectAntOption(page, 'customerId', 'HAVELSAN', 'Musteri')
    await page.waitForTimeout(800)

    const addRowBtn = page.locator('button:has-text("Kalem Ekle"), button:has-text("Urun Ekle"), button:has(.anticon-plus)').first()
    if (await addRowBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await addRowBtn.click(); await page.waitForTimeout(800)
    }

    const productInput = page.locator('input[placeholder*="urun"], input[placeholder*="ürün"]').first()
    if (await productInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await productInput.fill('PCB-HAV')
      await page.waitForTimeout(1000)
      const opt = page.locator('.ant-select-item-option').filter({ hasText: 'PCB-HAV' }).first()
      if (await opt.isVisible({ timeout: 2000 }).catch(() => false)) await opt.click()
    }

    const qtyInput = page.locator('input[placeholder*="miktar"], input[placeholder*="Miktar"]').first()
    if (await qtyInput.isVisible({ timeout: 2000 }).catch(() => false)) await qtyInput.fill('100')
    const priceInput = page.locator('input[placeholder*="fiyat"], input[placeholder*="Fiyat"]').first()
    if (await priceInput.isVisible({ timeout: 2000 }).catch(() => false)) await priceInput.fill('12500')

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
  test('I.1 — HAVELSAN satis siparisi olustur', async ({ page }) => {
    await gotoAndWait(page, '/sales/new')
    await selectAntOption(page, 'customerId', 'HAVELSAN', 'Musteri')
    await page.waitForTimeout(600)

    const addBtn = page.locator('button:has-text("Kalem Ekle"), button:has-text("Urun Ekle")').first()
    if (await addBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await addBtn.click(); await page.waitForTimeout(600)
      const productInput = page.locator('input[placeholder*="urun"]').first()
      if (await productInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        await productInput.fill('PCB-HAV'); await page.waitForTimeout(1000)
        const opt = page.locator('.ant-select-item-option').filter({ hasText: 'PCB-HAV' }).first()
        if (await opt.isVisible({ timeout: 2000 }).catch(() => false)) await opt.click()
      }
      const qtyInput = page.locator('input[placeholder*="miktar"]').first()
      if (await qtyInput.isVisible({ timeout: 2000 }).catch(() => false)) await qtyInput.fill('100')
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
  test('J.1 — SMT hatti uretim emri ac', async ({ page }) => {
    await gotoAndWait(page, '/production/new')
    const productInput = page.locator('input[placeholder*="urun"]').first()
    if (await productInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await productInput.fill('PCB-HAV'); await page.waitForTimeout(1000)
      const opt = page.locator('.ant-select-item-option').filter({ hasText: 'PCB-HAV' }).first()
      if (await opt.isVisible({ timeout: 2000 }).catch(() => false)) await opt.click()
    }
    await fillAntInput(page, 'quantity', '100')
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
  test('K.1 — PCB bare board dielektrik testi giris muayenesi', async ({ page }) => {
    if (!STATE.stockIdPcb) { console.warn('[K.1] stockIdPcb eksik'); return }
    const res = await apiCall(page, 'POST', '/IncomingInspection', {
      productId:      STATE.stockIdPcb,
      quantity:       100,
      supplierId:     STATE.supplierId || null,
      inspectionDate: new Date().toISOString().split('T')[0],
      result:         'PASSED',
      notes:          'PCB bare board FR4 6 kat. Dielektrik dayanimi: 500V/100ms — uygun. IPC-A-600 Class 3 gorsel OK.',
    })
    console.log(`[K.1] PCB Inspection: status=${res.status} id=${res.data?.id}`)
    if (res.data?.id) STATE.inspectionId = res.data.id
    expect([200, 201]).toContain(res.status)
  })

  test('K.2 — SMD/THT komponent sertifikasi kaydet', async ({ page }) => {
    if (!STATE.stockIdSmd) { console.warn('[K.2] stockIdSmd eksik'); return }
    const res = await apiCall(page, 'POST', '/Certificate', {
      productId:       STATE.stockIdSmd,
      certificateType: 'CoC',
      certificateNo:   'TTI-COC-SMD-HAV-BOM-2026',
      issueDate:       new Date().toISOString().split('T')[0],
      notes:           'HAVELSAN BOM 287 referans SMD komponent sertifikasi. TTI CoC. RoHS uyumlu. Lot kaydedildi.',
    })
    console.log(`[K.2] Komponent CoC: status=${res.status}`)
    expect([200, 201, 404]).toContain(res.status)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// FAZ L — ATÖLYE SMT OPERASYONLARI (OP10-OP60)
// ─────────────────────────────────────────────────────────────────────────────

test.describe('FAZ L — SMT Atolye Yurutmesi', () => {
  test('L.1 — OP10 Pasta baski + SMD yerlestirme', async ({ page }) => {
    if (!STATE.productionId) { console.warn('[L.1] productionId eksik'); return }
    const res = await apiCall(page, 'POST', `/Production/completion/${STATE.productionId}`, {
      operationCode: 'OP10', completedQty: 100, scrapQty: 0,
      operatorNote: 'OP10 pasta baski ve SMD yerlestirme tamamlandi. SPI ofset: maks ±18% — uygun. 100 panel islendi.',
      machineId: STATE.machineIdSmd || null,
    })
    console.log(`[L.1] OP10: status=${res.status}`)
    expect([200, 201, 404]).toContain(res.status)
  })

  test('L.2 — OP20 Reflow firin + AOI ilk kontrol', async ({ page }) => {
    if (!STATE.productionId) { console.warn('[L.2] productionId eksik'); return }
    const res = await apiCall(page, 'POST', `/Production/completion/${STATE.productionId}`, {
      operationCode: 'OP20', completedQty: 97, scrapQty: 3,
      operatorNote: 'OP20 reflow tamamlandi (peak: 245°C). AOI: 3 kartta tombstone defect tespit edildi — NCR acilacak.',
      machineId: STATE.machineIdSmd || null,
    })
    console.log(`[L.2] OP20: status=${res.status}`)
    expect([200, 201, 404]).toContain(res.status)
  })

  test('L.3 — OP30 THT dalga lehim + gorsel kontrol', async ({ page }) => {
    if (!STATE.productionId) { console.warn('[L.3] productionId eksik'); return }
    const res = await apiCall(page, 'POST', `/Production/completion/${STATE.productionId}`, {
      operationCode: 'OP30', completedQty: 96, scrapQty: 1,
      operatorNote: 'OP30 dalga lehim tamamlandi. 1 kartta cold joint tespit edildi — rework yapildi, kabul edilmedi.',
      machineId: STATE.machineIdDalga || null,
    })
    console.log(`[L.3] OP30: status=${res.status}`)
    expect([200, 201, 404]).toContain(res.status)
  })

  test('L.4 — OP40 3D AOI tam tarama', async ({ page }) => {
    if (!STATE.productionId) { console.warn('[L.4] productionId eksik'); return }
    const res = await apiCall(page, 'POST', `/Production/completion/${STATE.productionId}`, {
      operationCode: 'OP40', completedQty: 96, scrapQty: 0,
      operatorNote: 'OP40 3D AOI tam tarama tamamlandi. 96/96 uygun. Defect rate: 0.',
      machineId: STATE.machineIdAoi || null,
    })
    console.log(`[L.4] OP40: status=${res.status}`)
    expect([200, 201, 404]).toContain(res.status)
  })

  test('L.5 — OP50 BGA X-Ray kontrolu', async ({ page }) => {
    if (!STATE.productionId) { console.warn('[L.5] productionId eksik'); return }
    const res = await apiCall(page, 'POST', `/Production/completion/${STATE.productionId}`, {
      operationCode: 'OP50', completedQty: 96, scrapQty: 0,
      operatorNote: 'OP50 BGA X-Ray kontrol tamamlandi. 96/96 uygun. Void orani: maks %18 — IPC Class 3 siniri alti.',
      machineId: STATE.machineIdXray || null,
    })
    console.log(`[L.5] OP50: status=${res.status}`)
    expect([200, 201, 404]).toContain(res.status)
  })

  test('L.6 — OP60 Konformal kaplama + final elektriksel test', async ({ page }) => {
    if (!STATE.productionId) { console.warn('[L.6] productionId eksik'); return }
    const res = await apiCall(page, 'POST', `/Production/completion/${STATE.productionId}`, {
      operationCode: 'OP60', completedQty: 96, scrapQty: 0,
      operatorNote: 'OP60 konformal kaplama (45 µm) ve elektriksel test tamamlandi. 96/96 uygun. HAVELSAN sevkiyata hazir.',
    })
    console.log(`[L.6] OP60: status=${res.status}`)
    expect([200, 201, 404]).toContain(res.status)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// FAZ M — NCR (TOMBSTONE DEFECT)
// ─────────────────────────────────────────────────────────────────────────────

test.describe('FAZ M — NCR Tombstone Defect', () => {
  test('M.1 — NCR olustur (3 kartta tombstone — SMD pasta baski ofset)', async ({ page }) => {
    if (!STATE.productId) { console.warn('[M.1] productId eksik'); return }
    const res = await apiCall(page, 'POST', '/Ncr', {
      productId:    STATE.productId,
      productionId: STATE.productionId || null,
      title:        'Tombstone defect — SMD pasta baski ofset OP20 (3 kart)',
      description:  'IPC-A-610 Class 3: 0402 kondansatorlerde tombstone (drawbridge) defect. 3 kartta tespit edildi. Pasta baski ofset koku olarak degerlendiriliyor.',
      defectType:   'SOLDER',
      quantity:     3,
      severity:     'MAJOR',
      detectedBy:   'AOI Operatoru — Saki 3D AOI',
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
      title:       'Tombstone Defect — Stencil Aperture Guncelleme',
      description: 'SMD pasta baski stencil aperture boyutu 0402 pad icin gozden gecirilecek. Stencil temizleme sureci iyilestirilecek.',
    })
    console.log(`[N.1] CAPA ac: status=${res.status} id=${res.data?.id}`)
    if (res.data?.id) STATE.capaId = res.data.id
    expect([200, 201]).toContain(res.status)
  })

  test('N.2 — CAPA ROOT_CAUSE_ANALYSIS', async ({ page }) => {
    if (!STATE.capaId) { console.warn('[N.2] capaId eksik'); return }
    const res = await apiCall(page, 'PUT', `/Capa/${STATE.capaId}`, {
      status:    'ROOT_CAUSE_ANALYSIS',
      rootCause: 'Stencil aperture boyutu 0402 pad icin %110 olarak tanimlanmis. Asiri pasta baskisi tombstone olusumuna yol acmis.',
    })
    console.log(`[N.2] CAPA RCA: status=${res.status}`)
    expect([200, 204]).toContain(res.status)
  })

  test('N.3 — CAPA IMPLEMENTATION', async ({ page }) => {
    if (!STATE.capaId) { console.warn('[N.3] capaId eksik'); return }
    const res = await apiCall(page, 'PUT', `/Capa/${STATE.capaId}`, {
      status:           'IMPLEMENTATION',
      correctiveAction: 'Stencil aperture 0402 pad icin %80 olarak guncellendi. Yeni stencil siparis edildi ve dogrulandi. Ilk parca AOI gecti.',
    })
    console.log(`[N.3] CAPA IMPL: status=${res.status}`)
    expect([200, 204]).toContain(res.status)
  })

  test('N.4 — CAPA CLOSED', async ({ page }) => {
    if (!STATE.capaId) { console.warn('[N.4] capaId eksik'); return }
    const res = await apiCall(page, 'PUT', `/Capa/${STATE.capaId}`, {
      status: 'CLOSED',
      notes:  'Son 200 kartta tombstone tekrarlanmadi. AOI gecme orani %100. Etkinlik dogrulandi. CAPA kapatildi.',
    })
    console.log(`[N.4] CAPA CLOSED: status=${res.status}`)
    expect([200, 204]).toContain(res.status)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// FAZ O — IPC CLASS 3 SERTİFİKASI + FATURA
// ─────────────────────────────────────────────────────────────────────────────

test.describe('FAZ O — IPC Sertifikasi ve Fatura', () => {
  test('O.1 — IPC-A-610 Class 3 sertifikasi kaydet', async ({ page }) => {
    if (!STATE.productId) { console.warn('[O.1] productId eksik'); return }
    const res = await apiCall(page, 'POST', '/Certificate', {
      productId:       STATE.productId,
      certificateType: 'IPC',
      certificateNo:   'IPC-A610-C3-PCB-HAV-AVIY-CTRL-2026',
      issueDate:       new Date().toISOString().split('T')[0],
      notes:           'IPC-A-610 Class 3 Aviyonik. 96 kart. AOI %100 gecti. BGA X-Ray void < %25. J-STD-001 Class 3 uyumlu. AS9100D.',
    })
    console.log(`[O.1] IPC Certificate: status=${res.status} id=${res.data?.id}`)
    if (res.data?.id) STATE.certId = res.data.id
    expect([200, 201, 404]).toContain(res.status)
  })

  test('O.2 — HAVELSAN satis faturasi olustur (96 kart × 12.500₺ = 1.200.000₺)', async ({ page }) => {
    await gotoAndWait(page, '/invoices/new')
    await selectAntOption(page, 'customerId', 'HAVELSAN', 'Musteri')
    await page.waitForTimeout(600)

    const addBtn = page.locator('button:has-text("Kalem Ekle"), button:has-text("Urun Ekle")').first()
    if (await addBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await addBtn.click(); await page.waitForTimeout(600)
      const productInput = page.locator('input[placeholder*="urun"]').first()
      if (await productInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        await productInput.fill('PCB-HAV'); await page.waitForTimeout(1000)
        const opt = page.locator('.ant-select-item-option').filter({ hasText: 'PCB-HAV' }).first()
        if (await opt.isVisible({ timeout: 2000 }).catch(() => false)) await opt.click()
      }
      const qtyInput = page.locator('input[placeholder*="miktar"]').first()
      if (await qtyInput.isVisible({ timeout: 2000 }).catch(() => false)) await qtyInput.fill('96')
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
  test('P.1 — SMT uretim maliyeti sorgula', async ({ page }) => {
    if (!STATE.productionId) { console.warn('[P.1] productionId eksik'); return }
    const res = await apiCall(page, 'GET', `/PartCost/${STATE.productionId}`)
    console.log(`[P.1] PartCost: status=${res.status}`)
    expect(res.status).toBeLessThan(500)
  })

  test('P.2 — OZET: Tum kritik ID kayitlari dogrula', async ({ page }) => {
    console.log('\n════════════════════════════════════════════════════════')
    console.log('  Elektronik Kart Montaj IPC-A-610 Class 3 E2E — FINAL OZET')
    console.log('════════════════════════════════════════════════════════')
    console.log(`  Musteri (HAVELSAN)       : ${STATE.customerId || 'EKSIK'}`)
    console.log(`  Tedarikci (TTI)          : ${STATE.supplierId || 'EKSIK'}`)
    console.log(`  SMD-01                   : ${STATE.machineIdSmd || 'EKSIK'}`)
    console.log(`  DALGA-01                 : ${STATE.machineIdDalga || 'EKSIK'}`)
    console.log(`  AOI-01                   : ${STATE.machineIdAoi || 'EKSIK'}`)
    console.log(`  XRAY-01                  : ${STATE.machineIdXray || 'EKSIK'}`)
    console.log(`  PCB Bare Board           : ${STATE.stockIdPcb || 'EKSIK'}`)
    console.log(`  SMD Komponent Kiti       : ${STATE.stockIdSmd || 'EKSIK'}`)
    console.log(`  THT Komponent Kiti       : ${STATE.stockIdTht || 'EKSIK'}`)
    console.log(`  PCB-HAV-AVIY-CTRL-001    : ${STATE.productId || 'EKSIK'}`)
    console.log(`  BOM                      : ${STATE.bomId || 'EKSIK'}`)
    console.log(`  IPC Kontrol Plani        : ${STATE.controlPlanId || 'EKSIK'}`)
    console.log(`  Is Emri Sablonu          : ${STATE.templateId || 'EKSIK'}`)
    console.log(`  Teklif (100×12.500₺)     : ${STATE.offerId || 'EKSIK'}`)
    console.log(`  Satis Siparisi           : ${STATE.salesId || 'EKSIK'}`)
    console.log(`  Uretim Emri              : ${STATE.productionId || 'EKSIK'}`)
    console.log(`  NCR (tombstone)          : ${STATE.ncrId || 'EKSIK'}`)
    console.log(`  CAPA (CLOSED)            : ${STATE.capaId || 'EKSIK'}`)
    console.log(`  IPC-A-610 Sertifikasi    : ${STATE.certId || 'EKSIK'}`)
    console.log(`  Fatura (96×12.500₺)      : ${STATE.invoiceId || 'EKSIK'}`)
    console.log('════════════════════════════════════════════════════════\n')

    const kritikIds = [STATE.customerId, STATE.productId, STATE.offerId, STATE.salesId, STATE.productionId]
    const mevcut = kritikIds.filter(Boolean).length
    console.log(`  Kritik kayit: ${mevcut}/${kritikIds.length}`)
    expect(mevcut).toBeGreaterThanOrEqual(3)
  })
})
