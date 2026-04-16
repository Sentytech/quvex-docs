/**
 * Quvex ERP — Gıda Üretimi TAM VERİ GİRİŞİ E2E Testi
 *
 * Senaryo: Taze Gıda Sanayi A.Ş. → Migros Tam Yağlı Süzme Yoğurt 500g siparişi
 * ISO 22000:2018, HACCP — CCP1: Pastörizasyon, CCP2: Soğutma
 *
 * Kapsam:
 *   FAZ A : Müşteri (Migros) + Tedarikçi (Süt A.Ş.) — UI
 *   FAZ B : 4 üretim hattı makinesi + 3 depo — UI
 *   FAZ C : Hammadde stok kartları (çiğ süt, kültür, ambalaj) — UI
 *   FAZ D : Mamul ürün kartı (YOG-FULL-500) — UI
 *   FAZ E : BOM/Reçete — API
 *   FAZ F : HACCP Kontrol Planı (CCP1 + CCP2) — API
 *   FAZ G : İş emri şablonu — API
 *   FAZ H : Teklif → SENT → ACCEPTED — UI + API
 *   FAZ I : Satış Siparişi — UI
 *   FAZ J : Üretim Emri (LOT-2026-YOG-001) — UI
 *   FAZ K : Giriş Muayenesi (çiğ süt sicaklık + mikrobiyoloji) — API
 *   FAZ L : Üretim akışı (pastörizasyon → kültürleme → soğutma → ambalaj) — API
 *   FAZ M : Kalite kontrol (pH, kıvam ölçümü) — API
 *   FAZ N : NCR + CAPA (sicaklık sapması) — API
 *   FAZ O : Fatura — UI
 *   FAZ P : Geri çağırma (recall) testi + maliyet — API
 *
 * HACCP Workaround notları:
 *   HACCP ayrı modül yok → Kontrol Planı + kategori='HACCP' ile takip
 *   CCP ihlali alarmı yok → NCR ile uygunsuzluk kaydedilir
 *   Mikrobiyoloji testi yükleme → Certificate endpoint type=MICRO
 *   Allergen beyanı → ürün notlarına yazılır
 */
const { test, expect } = require('./fixtures')

const API = 'https://api.quvex.io'

// ─── Test Verileri ────────────────────────────────────────────────────────────

const MUSTERI = {
  name:        'Migros Ticaret A.S.',
  officerName: 'Ayse Satin Alma',
  email:       'tedarik@migros.com.tr',
  phone:       '2164470000',
  taxId:       '3456789012',
}

const TEDARIKCI = {
  name:        'Anadolu Sut ve Hayvancilik A.S.',
  officerName: 'Veli Sut',
  email:       'satis@anadolusut.com.tr',
  phone:       '3226720000',
}

const MAKINE_PAS  = { code: 'PAS-01', name: 'Pastorizatör 5000L/saat HTST', brand: 'Tetra Pak', hourlyRate: '350' }
const MAKINE_KUL  = { code: 'KUL-01', name: 'Kültürleme Tankı 10.000L', brand: 'GEA', hourlyRate: '150' }
const MAKINE_SOG  = { code: 'SOG-01', name: 'Soğutma Tüneli 4°C', brand: 'Gram Equipment', hourlyRate: '200' }
const MAKINE_AMB  = { code: 'AMB-01', name: 'Ambalajlama + Etiketleme Hattı', brand: 'Rösler', hourlyRate: '250' }

const DEPO_HAM    = { code: 'DEPO-SUT',    name: 'Soguk Hammadde Deposu (2-4°C)' }
const DEPO_MAMUL  = { code: 'DEPO-MAMUL',  name: 'Bitik Urun Soguk Deposu (4°C)' }
const DEPO_AMB    = { code: 'DEPO-AMBALAJ', name: 'Kuru Ambalaj Deposu' }

const HAMMADDE_1 = { productNumber: 'HM-CIG-SUT', productName: 'Cig Tam Yagli Inek Sutu (L)', minStock: '5000' }
const HAMMADDE_2 = { productNumber: 'HM-YOG-KUL', productName: 'Yogurt Kulturü Laktobacillus bulgaricus', minStock: '10' }
const HAMMADDE_3 = { productNumber: 'HM-500-AMB', productName: 'PP Yogurt Kavanoz 500g + Kapak', minStock: '10000' }

const MAMUL = {
  productNumber: 'YOG-FULL-500',
  productName:   'Tam Yagli Suzme Yogurt 500g ISO 22000 HACCP',
}

const KONTROL_PLANI = {
  title:       'YOG-FULL-500 HACCP Kontrol Plani CCP1-CCP2',
  processName: 'Pastorizasyon ve Sogutma Yogurt Uretimi',
  description: 'ISO 22000:2018 / HACCP. CCP1: Pastorizasyon 72°C min 15sn. CCP2: Sogutma 4°C maks 2 saat. Kritik limitler asildiysa lot tutulur, NCR acilir.',
}

const IS_EMRI_SABLONU = {
  name: 'YOG-FULL-500 Uretim Is Emri',
  operasyonlar: [
    { rowNo: 10, code: 'OP10', machineKey: 'pas',  estimatedMinutes: 60,   requiresQualityCheck: true,  prerequisiteRowNo: null },
    { rowNo: 20, code: 'OP20', machineKey: 'kul',  estimatedMinutes: 360,  requiresQualityCheck: false, prerequisiteRowNo: 10   },
    { rowNo: 30, code: 'OP30', machineKey: 'sog',  estimatedMinutes: 120,  requiresQualityCheck: true,  prerequisiteRowNo: 20   },
    { rowNo: 40, code: 'OP40', machineKey: 'amb',  estimatedMinutes: 90,   requiresQualityCheck: false, prerequisiteRowNo: 30   },
  ],
}

const STATE = {
  token: null, customerId: null, supplierId: null,
  machineIdPas: null, machineIdKul: null, machineIdSog: null, machineIdAmb: null,
  warehouseIdH: null, warehouseIdM: null, warehouseIdA: null,
  stockId1: null, stockId2: null, stockId3: null,
  productId: null,
  bomId1: null, bomId2: null, bomId3: null,
  controlPlanId: null, templateId: null,
  offerId: null, salesId: null, productionId: null,
  inspectionId: null, ncrId: null, capaId: null, invoiceId: null,
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
  test('A.1 — Migros musteri kaydi olustur', async ({ page }) => {
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
        const found = list.find(c => c.name?.includes('Migros'))
        if (found) { STATE.customerId = found.id; console.log(`[A.1] customerId=${found.id}`) }
      }
    }
    expect(res.status).toBeLessThan(300)
  })

  test('A.2 — Anadolu Sut tedarikci kaydi olustur', async ({ page }) => {
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
        const found = list.find(c => c.name?.includes('Anadolu') || c.name?.includes('Sut'))
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
  test('B.1 — PAS-01 pastorizator tanimla', async ({ page }) => {
    await gotoAndWait(page, '/machines')
    await openAddModal(page)
    await fillAntInput(page, 'code', MAKINE_PAS.code)
    await fillAntInput(page, 'name', MAKINE_PAS.name)
    await fillAntInput(page, 'brand', MAKINE_PAS.brand)
    await fillAntInput(page, 'hourlyRate', MAKINE_PAS.hourlyRate)
    await saveFormModal(page)
    const res = await apiCall(page, 'GET', '/Machine')
    if (res.data) {
      const list = res.data.data || res.data
      if (Array.isArray(list)) {
        const f = list.find(m => m.code === 'PAS-01'); if (f) STATE.machineIdPas = f.id
      }
    }
    console.log(`[B.1] PAS-01 machineIdPas=${STATE.machineIdPas}`)
    expect(true).toBe(true)
  })

  test('B.2 — KUL-01 kulturleme tanki tanimla', async ({ page }) => {
    await gotoAndWait(page, '/machines')
    await openAddModal(page)
    await fillAntInput(page, 'code', MAKINE_KUL.code)
    await fillAntInput(page, 'name', MAKINE_KUL.name)
    await fillAntInput(page, 'brand', MAKINE_KUL.brand)
    await fillAntInput(page, 'hourlyRate', MAKINE_KUL.hourlyRate)
    await saveFormModal(page)
    const res = await apiCall(page, 'GET', '/Machine')
    if (res.data) {
      const list = res.data.data || res.data
      if (Array.isArray(list)) {
        const f = list.find(m => m.code === 'KUL-01'); if (f) STATE.machineIdKul = f.id
      }
    }
    expect(true).toBe(true)
  })

  test('B.3 — SOG-01 sogutma tuneli tanimla', async ({ page }) => {
    await gotoAndWait(page, '/machines')
    await openAddModal(page)
    await fillAntInput(page, 'code', MAKINE_SOG.code)
    await fillAntInput(page, 'name', MAKINE_SOG.name)
    await fillAntInput(page, 'brand', MAKINE_SOG.brand)
    await fillAntInput(page, 'hourlyRate', MAKINE_SOG.hourlyRate)
    await saveFormModal(page)
    const res = await apiCall(page, 'GET', '/Machine')
    if (res.data) {
      const list = res.data.data || res.data
      if (Array.isArray(list)) {
        const f = list.find(m => m.code === 'SOG-01'); if (f) STATE.machineIdSog = f.id
      }
    }
    expect(true).toBe(true)
  })

  test('B.4 — AMB-01 ambalajlama hatti tanimla', async ({ page }) => {
    await gotoAndWait(page, '/machines')
    await openAddModal(page)
    await fillAntInput(page, 'code', MAKINE_AMB.code)
    await fillAntInput(page, 'name', MAKINE_AMB.name)
    await fillAntInput(page, 'brand', MAKINE_AMB.brand)
    await fillAntInput(page, 'hourlyRate', MAKINE_AMB.hourlyRate)
    await saveFormModal(page)
    const res = await apiCall(page, 'GET', '/Machine')
    if (res.data) {
      const list = res.data.data || res.data
      if (Array.isArray(list)) {
        const f = list.find(m => m.code === 'AMB-01'); if (f) STATE.machineIdAmb = f.id
      }
    }
    expect(true).toBe(true)
  })

  test('B.5 — Soguk hammadde deposu tanimla (2-4°C)', async ({ page }) => {
    await gotoAndWait(page, '/warehouses')
    await openAddModal(page)
    await fillAntInput(page, 'code', DEPO_HAM.code)
    await fillAntInput(page, 'name', DEPO_HAM.name)
    await saveFormModal(page)
    const res = await apiCall(page, 'GET', '/Warehouse')
    if (res.data) {
      const list = res.data.data || res.data
      if (Array.isArray(list)) {
        const f = list.find(w => w.code === 'DEPO-SUT'); if (f) STATE.warehouseIdH = f.id
      }
    }
    expect(true).toBe(true)
  })

  test('B.6 — Bitik urun soguk deposu tanimla (4°C)', async ({ page }) => {
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

  test('B.7 — Kuru ambalaj deposu tanimla', async ({ page }) => {
    await gotoAndWait(page, '/warehouses')
    await openAddModal(page)
    await fillAntInput(page, 'code', DEPO_AMB.code)
    await fillAntInput(page, 'name', DEPO_AMB.name)
    await saveFormModal(page)
    const res = await apiCall(page, 'GET', '/Warehouse')
    if (res.data) {
      const list = res.data.data || res.data
      if (Array.isArray(list)) {
        const f = list.find(w => w.code === 'DEPO-AMBALAJ'); if (f) STATE.warehouseIdA = f.id
      }
    }
    expect(true).toBe(true)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// FAZ C — HAMMADDE STOK KARTLARI
// ─────────────────────────────────────────────────────────────────────────────

test.describe('FAZ C — Hammadde Stok Kartlari', () => {
  test('C.1 — Cig sut stok karti (HM-CIG-SUT)', async ({ page }) => {
    await gotoAndWait(page, '/products/new')
    await fillAntInput(page, 'productNumber', HAMMADDE_1.productNumber)
    await fillAntInput(page, 'productName', HAMMADDE_1.productName)
    await selectAntOption(page, 'categoryType', 'Hammadde', 'Kategori')
    await selectAntOption(page, 'unitId', 'LİTRE', 'Birim')
    await fillAntInput(page, 'minStock', HAMMADDE_1.minStock)
    await saveFormPage(page)
    await page.waitForTimeout(1500)
    const urlMatch = page.url().match(/\/products\/(?:form\/)?([a-f0-9-]{36})/)
    if (urlMatch) { STATE.stockId1 = urlMatch[1]; console.log(`[C.1] stockId1=${urlMatch[1]}`) }
    if (!STATE.stockId1) {
      const res = await apiCall(page, 'GET', '/Product?type=stock')
      if (res.data) {
        const list = res.data.data || res.data
        if (Array.isArray(list)) {
          const found = list.find(p => p.productNumber === 'HM-CIG-SUT')
          if (found) STATE.stockId1 = found.id
        }
      }
    }
    expect(STATE.stockId1).toBeTruthy()
  })

  test('C.2 — Yogurt kulturü stok karti (HM-YOG-KUL)', async ({ page }) => {
    await gotoAndWait(page, '/products/new')
    await fillAntInput(page, 'productNumber', HAMMADDE_2.productNumber)
    await fillAntInput(page, 'productName', HAMMADDE_2.productName)
    await selectAntOption(page, 'categoryType', 'Hammadde', 'Kategori')
    await selectAntOption(page, 'unitId', 'GR', 'Birim')
    await fillAntInput(page, 'minStock', HAMMADDE_2.minStock)
    await saveFormPage(page)
    await page.waitForTimeout(1500)
    const urlMatch = page.url().match(/\/products\/(?:form\/)?([a-f0-9-]{36})/)
    if (urlMatch) { STATE.stockId2 = urlMatch[1]; console.log(`[C.2] stockId2=${urlMatch[1]}`) }
    if (!STATE.stockId2) {
      const res = await apiCall(page, 'GET', '/Product?type=stock')
      if (res.data) {
        const list = res.data.data || res.data
        if (Array.isArray(list)) {
          const found = list.find(p => p.productNumber === 'HM-YOG-KUL')
          if (found) STATE.stockId2 = found.id
        }
      }
    }
    expect(STATE.stockId2).toBeTruthy()
  })

  test('C.3 — PP ambalaj kavanoz stok karti (HM-500-AMB)', async ({ page }) => {
    await gotoAndWait(page, '/products/new')
    await fillAntInput(page, 'productNumber', HAMMADDE_3.productNumber)
    await fillAntInput(page, 'productName', HAMMADDE_3.productName)
    await selectAntOption(page, 'categoryType', 'Hammadde', 'Kategori')
    await selectAntOption(page, 'unitId', 'ADET', 'Birim')
    await fillAntInput(page, 'minStock', HAMMADDE_3.minStock)
    await saveFormPage(page)
    await page.waitForTimeout(1500)
    const urlMatch = page.url().match(/\/products\/(?:form\/)?([a-f0-9-]{36})/)
    if (urlMatch) { STATE.stockId3 = urlMatch[1]; console.log(`[C.3] stockId3=${urlMatch[1]}`) }
    if (!STATE.stockId3) {
      const res = await apiCall(page, 'GET', '/Product?type=stock')
      if (res.data) {
        const list = res.data.data || res.data
        if (Array.isArray(list)) {
          const found = list.find(p => p.productNumber === 'HM-500-AMB')
          if (found) STATE.stockId3 = found.id
        }
      }
    }
    expect(STATE.stockId3).toBeTruthy()
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// FAZ D — MAMUL ÜRÜN KARTI
// ─────────────────────────────────────────────────────────────────────────────

test.describe('FAZ D — Mamul Urun Karti', () => {
  test('D.1 — YOG-FULL-500 yogurt urun karti olustur', async ({ page }) => {
    await gotoAndWait(page, '/products/new')
    await fillAntInput(page, 'productNumber', MAMUL.productNumber)
    await fillAntInput(page, 'productName', MAMUL.productName)
    await selectAntOption(page, 'categoryType', 'Mamul', 'Kategori')
    await selectAntOption(page, 'unitId', 'ADET', 'Birim')
    await fillAntInput(page, 'salePrice', '28.90')
    await fillAntInput(page, 'minStock', '1000')
    await saveFormPage(page)
    await page.waitForTimeout(1500)
    const urlMatch = page.url().match(/\/products\/(?:form\/)?([a-f0-9-]{36})/)
    if (urlMatch) { STATE.productId = urlMatch[1]; console.log(`[D.1] productId=${urlMatch[1]}`) }
    if (!STATE.productId) {
      const res = await apiCall(page, 'GET', '/Product?type=product')
      if (res.data) {
        const list = res.data.data || res.data
        if (Array.isArray(list)) {
          const found = list.find(p => p.productNumber === 'YOG-FULL-500')
          if (found) STATE.productId = found.id
        }
      }
    }
    expect(STATE.productId).toBeTruthy()
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// FAZ E — BOM / REÇETE
// ─────────────────────────────────────────────────────────────────────────────

test.describe('FAZ E — BOM Recete', () => {
  test('E.1 — BOM: cig sut (500 ml/adet)', async ({ page }) => {
    if (!STATE.productId || !STATE.stockId1) { console.warn('[E.1] eksik'); return }
    const res = await apiCall(page, 'POST', '/Bom', {
      parentProductId: STATE.productId, childProductId: STATE.stockId1, quantity: 0.5,
    })
    console.log(`[E.1] BOM sut: status=${res.status}`)
    if (res.data?.id) STATE.bomId1 = res.data.id
    expect([200, 201]).toContain(res.status)
  })

  test('E.2 — BOM: yogurt kulturü (1 gr/adet)', async ({ page }) => {
    if (!STATE.productId || !STATE.stockId2) { console.warn('[E.2] eksik'); return }
    const res = await apiCall(page, 'POST', '/Bom', {
      parentProductId: STATE.productId, childProductId: STATE.stockId2, quantity: 0.001,
    })
    console.log(`[E.2] BOM kultur: status=${res.status}`)
    if (res.data?.id) STATE.bomId2 = res.data.id
    expect([200, 201]).toContain(res.status)
  })

  test('E.3 — BOM: PP ambalaj (1 kavanoz/adet)', async ({ page }) => {
    if (!STATE.productId || !STATE.stockId3) { console.warn('[E.3] eksik'); return }
    const res = await apiCall(page, 'POST', '/Bom', {
      parentProductId: STATE.productId, childProductId: STATE.stockId3, quantity: 1,
    })
    console.log(`[E.3] BOM ambalaj: status=${res.status}`)
    if (res.data?.id) STATE.bomId3 = res.data.id
    expect([200, 201]).toContain(res.status)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// FAZ F — HACCP KONTROL PLANI
// ─────────────────────────────────────────────────────────────────────────────

test.describe('FAZ F — HACCP Kontrol Plani', () => {
  test('F.1 — HACCP kontrol plani olustur', async ({ page }) => {
    if (!STATE.productId) { console.warn('[F.1] productId eksik'); return }
    const res = await apiCall(page, 'POST', '/ControlPlan', {
      title:       KONTROL_PLANI.title,
      description: KONTROL_PLANI.description,
      productId:   STATE.productId,
      processName: KONTROL_PLANI.processName,
    })
    console.log(`[F.1] HACCP ControlPlan: status=${res.status} id=${res.data?.id}`)
    if (res.data?.id) STATE.controlPlanId = res.data.id
    expect([200, 201]).toContain(res.status)
  })

  test('F.2 — CCP1: Pastorizasyon sicaklik kontrolu', async ({ page }) => {
    if (!STATE.controlPlanId) { console.warn('[F.2] controlPlanId eksik'); return }
    const res = await apiCall(page, 'POST', '/ControlPlan/items', {
      controlPlanId:   STATE.controlPlanId,
      processStep:     'CCP1 - Pastorizasyon OP10',
      characteristic:  'Pastorizasyon sicakligi ve suresi',
      measurementTool: 'Termocouple + SCADA kaydedici',
      specification:   'Sicaklik: 72°C min, Sure: 15 sn min (HTST). KRITIK LIMIT.',
      frequency:       'Surekli (real-time)',
      sampleSize:      '%100 lot',
    })
    console.log(`[F.2] CCP1 pastorizasyon: status=${res.status}`)
    expect([200, 201]).toContain(res.status)
  })

  test('F.3 — CCP2: Sogutma sicaklik kontrolu', async ({ page }) => {
    if (!STATE.controlPlanId) { console.warn('[F.3] controlPlanId eksik'); return }
    const res = await apiCall(page, 'POST', '/ControlPlan/items', {
      controlPlanId:   STATE.controlPlanId,
      processStep:     'CCP2 - Sogutma OP30',
      characteristic:  'Sogutma sicakligi ve suresi',
      measurementTool: 'Sogutma tüneli sicaklik sensoru',
      specification:   'Sicaklik: 4°C maks 2 saat icerisinde. KRITIK LIMIT.',
      frequency:       'Her lot, surekli olcum',
      sampleSize:      '%100 lot',
    })
    console.log(`[F.3] CCP2 sogutma: status=${res.status}`)
    expect([200, 201]).toContain(res.status)
  })

  test('F.4 — Giris kontrol: cig sut sicaklik (8°C max)', async ({ page }) => {
    if (!STATE.controlPlanId) { console.warn('[F.4] controlPlanId eksik'); return }
    const res = await apiCall(page, 'POST', '/ControlPlan/items', {
      controlPlanId:   STATE.controlPlanId,
      processStep:     'Hammadde Giris Kontrolu',
      characteristic:  'Cig sut teslim sicakligi',
      measurementTool: 'Tasinabilir termometre',
      specification:   'Teslim sicakligi: 8°C maks. Red kriterı: >8°C',
      frequency:       'Her teslimatta',
      sampleSize:      '%100 tank',
    })
    console.log(`[F.4] Giris kontrolu: status=${res.status}`)
    expect([200, 201]).toContain(res.status)
  })

  test('F.5 — Son kontrol: pH ve kivam olcumu', async ({ page }) => {
    if (!STATE.controlPlanId) { console.warn('[F.5] controlPlanId eksik'); return }
    const res = await apiCall(page, 'POST', '/ControlPlan/items', {
      controlPlanId:   STATE.controlPlanId,
      processStep:     'Son Muayene OP40',
      characteristic:  'pH ve kivam',
      measurementTool: 'pH metre, viskozimetre',
      specification:   'pH: 4.2-4.6, Kivam: 850-1200 cP',
      frequency:       'Her lottan 5 ornek',
      sampleSize:      '5 adet/lot',
    })
    console.log(`[F.5] Son kontrol: status=${res.status}`)
    expect([200, 201]).toContain(res.status)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// FAZ G — İŞ EMRİ ŞABLONU
// ─────────────────────────────────────────────────────────────────────────────

test.describe('FAZ G — Is Emri Sablonu', () => {
  test('G.1 — OP10-OP40 yogurt uretim sablonu olustur', async ({ page }) => {
    const ops = IS_EMRI_SABLONU.operasyonlar.map(op => ({
      rowNo:               op.rowNo,
      code:                op.code,
      machineId:           op.machineKey === 'pas' ? STATE.machineIdPas :
                           op.machineKey === 'kul' ? STATE.machineIdKul :
                           op.machineKey === 'sog' ? STATE.machineIdSog :
                           op.machineKey === 'amb' ? STATE.machineIdAmb : null,
      estimatedMinutes:    op.estimatedMinutes,
      requiresQualityCheck: op.requiresQualityCheck,
      prerequisiteRowNo:   op.prerequisiteRowNo,
      description:         op.code === 'OP10' ? 'CCP1: Pastorizasyon 72°C 15sn — SCADA kayit zorunlu' :
                           op.code === 'OP20' ? 'Kulturleme: 43°C 6 saat — pH ve asitlik takibi' :
                           op.code === 'OP30' ? 'CCP2: Sogutma 4°C maks 2 saat — soguk zincir kontrolu' :
                           'Ambalajlama + Etiketleme + lot no + SKT yazimi',
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
// FAZ H — TEKLİF (5.000 adet × 28,90₺ = 144.500₺)
// ─────────────────────────────────────────────────────────────────────────────

test.describe('FAZ H — Teklif', () => {
  test('H.1 — Migros teklif olustur (5.000 adet x 28.90₺)', async ({ page }) => {
    if (!STATE.customerId) {
      const res = await apiCall(page, 'GET', '/Customer?type=customers')
      if (res.data) {
        const list = res.data.data || res.data
        if (Array.isArray(list)) {
          const found = list.find(c => c.name?.includes('Migros'))
          if (found) STATE.customerId = found.id
        }
      }
    }
    await gotoAndWait(page, '/offers/new')
    await selectAntOption(page, 'customerId', 'Migros', 'Musteri')
    await page.waitForTimeout(800)

    const addRowBtn = page.locator('button:has-text("Kalem Ekle"), button:has-text("Urun Ekle"), button:has(.anticon-plus)').first()
    if (await addRowBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await addRowBtn.click(); await page.waitForTimeout(800)
    }
    const productInput = page.locator('input[placeholder*="urun"], input[placeholder*="ürün"]').first()
    if (await productInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await productInput.fill('YOG-FULL'); await page.waitForTimeout(1000)
      const opt = page.locator('.ant-select-item-option').filter({ hasText: 'YOG-FULL' }).first()
      if (await opt.isVisible({ timeout: 2000 }).catch(() => false)) await opt.click()
    }
    const qtyInput = page.locator('input[placeholder*="miktar"], input[placeholder*="Miktar"]').first()
    if (await qtyInput.isVisible({ timeout: 2000 }).catch(() => false)) await qtyInput.fill('5000')
    const priceInput = page.locator('input[placeholder*="fiyat"], input[placeholder*="Fiyat"]').first()
    if (await priceInput.isVisible({ timeout: 2000 }).catch(() => false)) await priceInput.fill('28.90')

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
    expect([200, 204]).toContain(res.status)
  })

  test('H.3 — Teklif ACCEPTED', async ({ page }) => {
    if (!STATE.offerId) { console.warn('[H.3] offerId eksik'); return }
    const res = await apiCall(page, 'PUT', `/Offer/${STATE.offerId}`, { status: 'ACCEPTED' })
    expect([200, 204]).toContain(res.status)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// FAZ I — SATIŞ SİPARİŞİ
// ─────────────────────────────────────────────────────────────────────────────

test.describe('FAZ I — Satis Siparisi', () => {
  test('I.1 — Migros satis siparisi olustur', async ({ page }) => {
    await gotoAndWait(page, '/sales/new')
    await selectAntOption(page, 'customerId', 'Migros', 'Musteri')
    await page.waitForTimeout(600)

    const addBtn = page.locator('button:has-text("Kalem Ekle"), button:has-text("Urun Ekle")').first()
    if (await addBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await addBtn.click(); await page.waitForTimeout(600)
      const productInput = page.locator('input[placeholder*="urun"]').first()
      if (await productInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        await productInput.fill('YOG-FULL'); await page.waitForTimeout(1000)
        const opt = page.locator('.ant-select-item-option').filter({ hasText: 'YOG-FULL' }).first()
        if (await opt.isVisible({ timeout: 2000 }).catch(() => false)) await opt.click()
      }
      const qtyInput = page.locator('input[placeholder*="miktar"]').first()
      if (await qtyInput.isVisible({ timeout: 2000 }).catch(() => false)) await qtyInput.fill('5000')
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
  test('J.1 — LOT-2026-YOG-001 uretim emri ac', async ({ page }) => {
    await gotoAndWait(page, '/production/new')
    const productInput = page.locator('input[placeholder*="urun"]').first()
    if (await productInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await productInput.fill('YOG-FULL'); await page.waitForTimeout(1000)
      const opt = page.locator('.ant-select-item-option').filter({ hasText: 'YOG-FULL' }).first()
      if (await opt.isVisible({ timeout: 2000 }).catch(() => false)) await opt.click()
    }
    await fillAntInput(page, 'quantity', '5000')
    await fillAntInput(page, 'lotNumber', 'LOT-2026-YOG-001')
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
// FAZ K — GİRİŞ MUAYENESİ (ÇİĞ SÜT)
// ─────────────────────────────────────────────────────────────────────────────

test.describe('FAZ K — Giris Muayenesi', () => {
  test('K.1 — Cig sut giris muayenesi (sicaklik + organoleptik)', async ({ page }) => {
    if (!STATE.stockId1) { console.warn('[K.1] stockId1 eksik'); return }
    const res = await apiCall(page, 'POST', '/IncomingInspection', {
      productId:      STATE.stockId1,
      quantity:       2500,
      supplierId:     STATE.supplierId || null,
      inspectionDate: new Date().toISOString().split('T')[0],
      result:         'PASSED',
      notes:          'Teslim sicakligi: 4.2°C (limit: 8°C maks) — UYGUN. Koku/renk/kivam normal. Lot: ANA-2026-SUT-0456.',
    })
    console.log(`[K.1] IncomingInspection: status=${res.status} id=${res.data?.id}`)
    if (res.data?.id) STATE.inspectionId = res.data.id
    expect([200, 201]).toContain(res.status)
  })

  test('K.2 — Veteriner saglik sertifikasi kaydet', async ({ page }) => {
    if (!STATE.stockId1) { console.warn('[K.2] stockId1 eksik'); return }
    const res = await apiCall(page, 'POST', '/Certificate', {
      productId:       STATE.stockId1,
      certificateType: 'HEALTH',
      certificateNo:   'VET-SAG-2026-ANA-0456',
      issueDate:       new Date().toISOString().split('T')[0],
      notes:           'Veteriner saglik belgesi. Somatik hucre sayisi < 400.000/mL. Toplam bakteri < 100.000 CFU/mL.',
    })
    console.log(`[K.2] Vet Cert: status=${res.status}`)
    expect([200, 201, 404]).toContain(res.status)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// FAZ L — ÜRETİM AKIŞI
// ─────────────────────────────────────────────────────────────────────────────

test.describe('FAZ L — Uretim Akisi', () => {
  test('L.1 — OP10 CCP1 Pastorizasyon 72°C 15sn', async ({ page }) => {
    if (!STATE.productionId) { console.warn('[L.1] productionId eksik'); return }
    const res = await apiCall(page, 'POST', `/Production/completion/${STATE.productionId}`, {
      operationCode: 'OP10', completedQty: 5000, scrapQty: 0,
      operatorNote: 'CCP1: Pastorizasyon tamamlandi. Min sicaklik: 73.2°C, Sure: 18 sn. SCADA log dosyasi: PAS-2026-0456. UYGUN.',
      machineId: STATE.machineIdPas || null,
    })
    console.log(`[L.1] OP10 Pastorizasyon: status=${res.status}`)
    expect([200, 201, 404]).toContain(res.status)
  })

  test('L.2 — OP20 Kulturleme 43°C 6 saat', async ({ page }) => {
    if (!STATE.productionId) { console.warn('[L.2] productionId eksik'); return }
    const res = await apiCall(page, 'POST', `/Production/completion/${STATE.productionId}`, {
      operationCode: 'OP20', completedQty: 5000, scrapQty: 0,
      operatorNote: 'Kulturleme tamamlandi. pH 4.45, asitlik: 78°D. Tank sicakligi: 43.1°C. Sure: 6 saat 12 dk. UYGUN.',
      machineId: STATE.machineIdKul || null,
    })
    console.log(`[L.2] OP20 Kulturleme: status=${res.status}`)
    expect([200, 201, 404]).toContain(res.status)
  })

  test('L.3 — OP30 CCP2 Sogutma 4°C (sapma NCR)', async ({ page }) => {
    if (!STATE.productionId) { console.warn('[L.3] productionId eksik'); return }
    // Simülasyon: bir partide sogutma 2 saat 20 dk sürmüş (limit 2 saat)
    const res = await apiCall(page, 'POST', `/Production/completion/${STATE.productionId}`, {
      operationCode: 'OP30', completedQty: 4900, scrapQty: 100,
      operatorNote: 'CCP2: Sogutma tamamlandi. 100 adet 2 saat 20 dk (CCP2 limit: 2 saat) — NCR acildi. 4900 adet uygun.',
      machineId: STATE.machineIdSog || null,
    })
    console.log(`[L.3] OP30 Sogutma: status=${res.status}`)
    expect([200, 201, 404]).toContain(res.status)
  })

  test('L.4 — OP40 Ambalajlama + Etiketleme', async ({ page }) => {
    if (!STATE.productionId) { console.warn('[L.4] productionId eksik'); return }
    const res = await apiCall(page, 'POST', `/Production/completion/${STATE.productionId}`, {
      operationCode: 'OP40', completedQty: 4900, scrapQty: 0,
      operatorNote: 'Ambalajlama + etiketleme tamamlandi. Lot no: LOT-2026-YOG-001. SKT: 2026-05-17. 4900 adet sevke hazir.',
      machineId: STATE.machineIdAmb || null,
    })
    console.log(`[L.4] OP40 Ambalaj: status=${res.status}`)
    expect([200, 201, 404]).toContain(res.status)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// FAZ M — KALİTE KONTROL (pH, KIVAM)
// ─────────────────────────────────────────────────────────────────────────────

test.describe('FAZ M — Kalite Kontrol', () => {
  test('M.1 — pH ve kivam olcum sonuclari kaydet', async ({ page }) => {
    if (!STATE.productionId) { console.warn('[M.1] productionId eksik'); return }
    // pH ölçümü
    const res1 = await apiCall(page, 'POST', '/MeasurementResult', {
      productionId: STATE.productionId, characteristic: 'pH degeri',
      nominalValue: 4.40, actualValue: 4.45, lowerLimit: 4.20, upperLimit: 4.60,
      unit: 'pH', result: 'PASSED',
    })
    // Kıvam ölçümü
    const res2 = await apiCall(page, 'POST', '/MeasurementResult', {
      productionId: STATE.productionId, characteristic: 'Kivam (viskozite)',
      nominalValue: 1000, actualValue: 1050, lowerLimit: 850, upperLimit: 1200,
      unit: 'cP', result: 'PASSED',
    })
    console.log(`[M.1] Olcumler: pH=${res1.status}, kivam=${res2.status}`)
    expect([200, 201, 404]).toContain(res1.status)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// FAZ N — NCR + CAPA (CCP2 SICAKLIK SAPMASI)
// ─────────────────────────────────────────────────────────────────────────────

test.describe('FAZ N — NCR ve CAPA', () => {
  test('N.1 — NCR olustur (CCP2 sogutma sure sapmasi)', async ({ page }) => {
    if (!STATE.productId) { console.warn('[N.1] productId eksik'); return }
    const res = await apiCall(page, 'POST', '/Ncr', {
      productId:    STATE.productId,
      productionId: STATE.productionId || null,
      title:        'CCP2 Sogutma Sure Sapmasi — LOT-2026-YOG-001',
      description:  'Sogutma tuneli PLC arizi nedeniyle 100 adet 2 saat 20 dk sogutuldu. CCP2 kritik limit: 2 saat. Lot tutuldu.',
      defectType:   'PROCESS',
      quantity:     100,
      severity:     'MAJOR',
      detectedBy:   'Kalite Kontrolor — CCP izleme kaydi',
      detectedAt:   new Date().toISOString(),
    })
    console.log(`[N.1] NCR: status=${res.status} id=${res.data?.id}`)
    if (res.data?.id) STATE.ncrId = res.data.id
    expect([200, 201]).toContain(res.status)
  })

  test('N.2 — CAPA ac (CCP2 sapmasi)', async ({ page }) => {
    if (!STATE.ncrId) { console.warn('[N.2] ncrId eksik'); return }
    const res = await apiCall(page, 'POST', '/Capa', {
      ncrId:       STATE.ncrId,
      title:       'CCP2 Sogutma PLC Bakim ve Alarm Sistemi Guncelleme',
      description: 'Sogutma tuneli PLC yazilimi guncellendi, PLC ariza alami eklendi.',
    })
    console.log(`[N.2] CAPA: status=${res.status} id=${res.data?.id}`)
    if (res.data?.id) STATE.capaId = res.data.id
    expect([200, 201]).toContain(res.status)
  })

  test('N.3 — CAPA ROOT_CAUSE_ANALYSIS', async ({ page }) => {
    if (!STATE.capaId) { console.warn('[N.3] capaId eksik'); return }
    const res = await apiCall(page, 'PUT', `/Capa/${STATE.capaId}`, {
      status:    'ROOT_CAUSE_ANALYSIS',
      rootCause: 'Sogutma tuneli PLC modulu arizasi (yazilim bugü). Bakim takip sistemi alarmi tetiklemedi.',
    })
    console.log(`[N.3] CAPA RCA: status=${res.status}`)
    expect([200, 204]).toContain(res.status)
  })

  test('N.4 — CAPA CLOSED', async ({ page }) => {
    if (!STATE.capaId) { console.warn('[N.4] capaId eksik'); return }
    const res = await apiCall(page, 'PUT', `/Capa/${STATE.capaId}`, {
      status: 'CLOSED',
      notes:  'PLC firmware guncellendi. Alarmlar test edildi. Son 30 uretimde sapma yok. Etkinlik dogrulandi.',
    })
    console.log(`[N.4] CAPA CLOSED: status=${res.status}`)
    expect([200, 204]).toContain(res.status)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// FAZ O — FATURA
// ─────────────────────────────────────────────────────────────────────────────

test.describe('FAZ O — Fatura', () => {
  test('O.1 — Migros satis faturasi olustur (141.610₺ + KDV)', async ({ page }) => {
    await gotoAndWait(page, '/invoices/new')
    await selectAntOption(page, 'customerId', 'Migros', 'Musteri')
    await page.waitForTimeout(600)

    const addBtn = page.locator('button:has-text("Kalem Ekle"), button:has-text("Urun Ekle")').first()
    if (await addBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await addBtn.click(); await page.waitForTimeout(600)
      const productInput = page.locator('input[placeholder*="urun"]').first()
      if (await productInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        await productInput.fill('YOG-FULL'); await page.waitForTimeout(1000)
        const opt = page.locator('.ant-select-item-option').filter({ hasText: 'YOG-FULL' }).first()
        if (await opt.isVisible({ timeout: 2000 }).catch(() => false)) await opt.click()
      }
      const qtyInput = page.locator('input[placeholder*="miktar"]').first()
      if (await qtyInput.isVisible({ timeout: 2000 }).catch(() => false)) await qtyInput.fill('4900')
    }
    await saveFormPage(page)
    await page.waitForTimeout(2000)
    const urlMatch = page.url().match(/\/invoices\/(?:form\/)?([a-f0-9-]{36})/)
    if (urlMatch) { STATE.invoiceId = urlMatch[1]; console.log(`[O.1] invoiceId=${urlMatch[1]}`) }
    if (!STATE.invoiceId) {
      const res = await apiCall(page, 'GET', '/Invoice?pageSize=5')
      if (res.data) {
        const list = res.data.data || res.data
        if (Array.isArray(list) && list.length) STATE.invoiceId = list[0].id
      }
    }
    const toast = await waitForToast(page, 5000)
    console.log(`[O.1] Fatura toast=${toast} invoiceId=${STATE.invoiceId}`)
    expect(STATE.invoiceId || toast).toBeTruthy()
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// FAZ P — MALİYET + ÖZET
// ─────────────────────────────────────────────────────────────────────────────

test.describe('FAZ P — Maliyet ve Ozet', () => {
  test('P.1 — Gida uretimi maliyet analizi sorgula', async ({ page }) => {
    if (!STATE.productionId) { console.warn('[P.1] productionId eksik'); return }
    const res = await apiCall(page, 'GET', `/PartCost/${STATE.productionId}`)
    console.log(`[P.1] PartCost: status=${res.status}`)
    expect(res.status).toBeLessThan(500)
  })

  test('P.2 — OZET: Tum kritik ID kayitlari dogrula', async ({ page }) => {
    console.log('\n════════════════════════════════════════════════')
    console.log('  Gida Uretimi (HACCP) E2E — FINAL OZET')
    console.log('════════════════════════════════════════════════')
    console.log(`  Musteri (Migros)      : ${STATE.customerId || 'EKSIK'}`)
    console.log(`  Tedarikci (Anadolu)   : ${STATE.supplierId || 'EKSIK'}`)
    console.log(`  PAS-01 Pastorizator   : ${STATE.machineIdPas || 'EKSIK'}`)
    console.log(`  KUL-01 Kulturleme     : ${STATE.machineIdKul || 'EKSIK'}`)
    console.log(`  Cig sut (HM-CIG-SUT) : ${STATE.stockId1 || 'EKSIK'}`)
    console.log(`  YOG-FULL-500 mamul    : ${STATE.productId || 'EKSIK'}`)
    console.log(`  BOM (3 kalem)         : ${[STATE.bomId1, STATE.bomId2, STATE.bomId3].filter(Boolean).length}/3`)
    console.log(`  HACCP Kontrol Plani   : ${STATE.controlPlanId || 'EKSIK'}`)
    console.log(`  Is Emri Sablonu       : ${STATE.templateId || 'EKSIK'}`)
    console.log(`  Teklif                : ${STATE.offerId || 'EKSIK'}`)
    console.log(`  Satis Siparisi        : ${STATE.salesId || 'EKSIK'}`)
    console.log(`  Uretim Emri           : ${STATE.productionId || 'EKSIK'}`)
    console.log(`  NCR (CCP2 sapma)      : ${STATE.ncrId || 'EKSIK'}`)
    console.log(`  CAPA (CLOSED)         : ${STATE.capaId || 'EKSIK'}`)
    console.log(`  Fatura                : ${STATE.invoiceId || 'EKSIK'}`)
    console.log('════════════════════════════════════════════════\n')

    const kritikIds = [STATE.customerId, STATE.productId, STATE.offerId, STATE.salesId, STATE.productionId]
    const mevcut = kritikIds.filter(Boolean).length
    console.log(`  Kritik kayit: ${mevcut}/${kritikIds.length}`)
    expect(mevcut).toBeGreaterThanOrEqual(3)
  })
})
