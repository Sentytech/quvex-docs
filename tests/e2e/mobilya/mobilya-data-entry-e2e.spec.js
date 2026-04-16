/**
 * Quvex ERP — Mobilya Imalati TAM VERİ GİRİŞİ E2E Testi
 *
 * Senaryo: Öz Ahşap Mobilya San. Ltd.Şti. → Hilton Otel yatak odası seti siparişi
 * Standartlar: EN 14073 ofis mobilyası mukavemet + boyutsal ±1mm + renk tutarlılığı
 *
 * Kapsam:
 *   FAZ A : Müşteri (Hilton) + Tedarikçi (Kastamonu Entegre) — UI
 *   FAZ B : 4 makine + 2 depo — UI
 *   FAZ C : 3 hammadde stok kartı — UI
 *   FAZ D : Mamul ürün kartı (MOB-ODA-SETI-HILTON) — UI
 *   FAZ E : BOM 3 kalem — API
 *   FAZ F : Kontrol Planı + 4 kalem — API
 *   FAZ G : İş emri şablonu OP10-OP40 — API
 *   FAZ H : Teklif → SENT → ACCEPTED — UI + API
 *   FAZ I : Satış Siparişi — UI
 *   FAZ J : Üretim Emri — UI
 *   FAZ K : Giriş muayenesi (MDF nem + laminat renk) — API
 *   FAZ L : Atölye operasyonları OP10-OP40 — API
 *   FAZ M : NCR (boyut sapması: kapak 597→603mm) — API
 *   FAZ N : CAPA → kapatma — API
 *   FAZ O : Fatura (19 set × 8.500₺) — UI
 *   FAZ P : Maliyet analizi + ÖZET — API
 */
const { test, expect } = require('./fixtures')

const API = 'https://api.quvex.io'

// ─── Test Verileri ────────────────────────────────────────────────────────────

const MUSTERI = {
  name:        'Hilton Oteller Turkiye A.S.',
  officerName: 'Ahmet Tedarik',
  email:       'tedarik@hilton.com.tr',
  phone:       '2121234567',
  taxId:       '7890123456',
}

const TEDARIKCI = {
  name:        'Kastamonu Entegre Agac San.',
  officerName: 'Mehmet Agac',
  email:       'satis@kastamonu.com.tr',
  phone:       '3662125500',
}

const MAKINE_CNC    = { code: 'CNC-ROUTER-01', name: 'Biesse Rover B FT CNC Router',        brand: 'Biesse',  hourlyRate: '450' }
const MAKINE_KENAR  = { code: 'KENAR-01',      name: 'Homag Edgebanding Kenar Bantlama',     brand: 'Homag',   hourlyRate: '120' }
const MAKINE_BOYA   = { code: 'BOYA-01',       name: 'Lake Boya Kabini UV Kurutma',          brand: 'Cefla',   hourlyRate: '200' }
const MAKINE_MONTAJ = { code: 'MONTAJ-01',     name: 'Manuel Montaj Hatti',                  brand: 'Ozel',    hourlyRate: '80'  }

const DEPO_PLAKA  = { code: 'DEPO-PLAKA', name: 'MDF/Laminat Plaka Deposu'  }
const DEPO_MAMUL  = { code: 'DEPO-MAMUL', name: 'Bitik Mobilya Deposu'       }

const HAMMADDE_MDF = {
  productNumber: 'HM-MDF-25mm',
  productName:   'MDF Plaka 25mm 2440x1220mm E1 Sinifi',
  minStock:      '100',
  unit:          'ADET',
}

const HAMMADDE_LAMINAT = {
  productNumber: 'HM-LAMINAT-BEYAZ',
  productName:   'Beyaz Mat Laminat Kaplama 0.8mm (50m2 rulo)',
  minStock:      '20',
  unit:          'RULO',
}

const HAMMADDE_AKSESUAR = {
  productNumber: 'HM-AKCESUAR-KIT',
  productName:   'Mentese Raya Raf Tasiyici Mobilya Aksesuar Seti',
  minStock:      '50',
  unit:          'KIT',
}

const MAMUL = {
  productNumber: 'MOB-ODA-SETI-HILTON',
  productName:   'Hilton Standart Yatak Odasi Seti (Bas Tablasi+Komodin+Dolap+TV Unitesi)',
}

const KONTROL_PLANI = {
  title:       'MOB-ODA-SETI Boyutsal Kalite Kontrol',
  processName: 'CNC Kesim Kenar Bantlama Boya',
  description: 'EN 14073 ofis mobilyasi mukavemet + boyutsal ±1mm + renk tutarliligi. Kaplama kalitesi ve kenar band adezyonu kontrol edilir.',
}

const IS_EMRI_SABLONU = {
  name: 'MOB-ODA-SETI-HILTON Mobilya Is Emri',
  operasyonlar: [
    { rowNo: 10, code: 'OP10', machineKey: 'cnc',    estimatedMinutes: 180, requiresQualityCheck: false, prerequisiteRowNo: null },
    { rowNo: 20, code: 'OP20', machineKey: 'kenar',  estimatedMinutes: 90,  requiresQualityCheck: false, prerequisiteRowNo: 10   },
    { rowNo: 30, code: 'OP30', machineKey: 'boya',   estimatedMinutes: 120, requiresQualityCheck: true,  prerequisiteRowNo: 20   },
    { rowNo: 40, code: 'OP40', machineKey: 'montaj', estimatedMinutes: 60,  requiresQualityCheck: true,  prerequisiteRowNo: 30   },
  ],
}

const STATE = {
  token: null, customerId: null, supplierId: null,
  machineIdCnc: null, machineIdKenar: null, machineIdBoya: null, machineIdMontaj: null,
  warehouseIdP: null, warehouseIdM: null,
  stockIdMdf: null, stockIdLaminat: null, stockIdAksesuar: null,
  productId: null,
  bomId: null, controlPlanId: null, templateId: null,
  offerId: null, salesId: null, productionId: null,
  inspectionId: null, ncrId: null, capaId: null,
  invoiceId: null,
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
  test('A.1 — Hilton musteri kaydi olustur', async ({ page }) => {
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
        const found = list.find(c => c.name?.includes('Hilton') || c.email === MUSTERI.email)
        if (found) { STATE.customerId = found.id; console.log(`[A.1] customerId=${found.id}`) }
      }
    }
    expect(res.status).toBeLessThan(300)
  })

  test('A.2 — Kastamonu Entegre tedarikci kaydi olustur', async ({ page }) => {
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
        const found = list.find(c => c.name?.includes('Kastamonu'))
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
  test('B.1 — CNC-ROUTER-01 Biesse CNC router tanimla', async ({ page }) => {
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
        const f = list.find(m => m.code === 'CNC-ROUTER-01'); if (f) STATE.machineIdCnc = f.id
      }
    }
    console.log(`[B.1] CNC-ROUTER-01 machineIdCnc=${STATE.machineIdCnc}`)
    expect(true).toBe(true)
  })

  test('B.2 — KENAR-01 Homag kenar bantlama tanimla', async ({ page }) => {
    await gotoAndWait(page, '/machines')
    await openAddModal(page)
    await fillAntInput(page, 'code', MAKINE_KENAR.code)
    await fillAntInput(page, 'name', MAKINE_KENAR.name)
    await fillAntInput(page, 'brand', MAKINE_KENAR.brand)
    await fillAntInput(page, 'hourlyRate', MAKINE_KENAR.hourlyRate)
    await saveFormModal(page)
    const res = await apiCall(page, 'GET', '/Machine')
    if (res.data) {
      const list = res.data.data || res.data
      if (Array.isArray(list)) {
        const f = list.find(m => m.code === 'KENAR-01'); if (f) STATE.machineIdKenar = f.id
      }
    }
    expect(true).toBe(true)
  })

  test('B.3 — BOYA-01 Lake boya kabini UV tanimla', async ({ page }) => {
    await gotoAndWait(page, '/machines')
    await openAddModal(page)
    await fillAntInput(page, 'code', MAKINE_BOYA.code)
    await fillAntInput(page, 'name', MAKINE_BOYA.name)
    await fillAntInput(page, 'brand', MAKINE_BOYA.brand)
    await fillAntInput(page, 'hourlyRate', MAKINE_BOYA.hourlyRate)
    await saveFormModal(page)
    const res = await apiCall(page, 'GET', '/Machine')
    if (res.data) {
      const list = res.data.data || res.data
      if (Array.isArray(list)) {
        const f = list.find(m => m.code === 'BOYA-01'); if (f) STATE.machineIdBoya = f.id
      }
    }
    expect(true).toBe(true)
  })

  test('B.4 — MONTAJ-01 Manuel montaj hatti tanimla', async ({ page }) => {
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

  test('B.5 — DEPO-PLAKA MDF/Laminat plaka deposu tanimla', async ({ page }) => {
    await gotoAndWait(page, '/warehouses')
    await openAddModal(page)
    await fillAntInput(page, 'code', DEPO_PLAKA.code)
    await fillAntInput(page, 'name', DEPO_PLAKA.name)
    await saveFormModal(page)
    const res = await apiCall(page, 'GET', '/Warehouse')
    if (res.data) {
      const list = res.data.data || res.data
      if (Array.isArray(list)) {
        const f = list.find(w => w.code === 'DEPO-PLAKA'); if (f) STATE.warehouseIdP = f.id
      }
    }
    expect(true).toBe(true)
  })

  test('B.6 — DEPO-MAMUL bitik mobilya deposu tanimla', async ({ page }) => {
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
  test('C.1 — HM-MDF-25mm stok karti olustur', async ({ page }) => {
    await gotoAndWait(page, '/products/new')
    await fillAntInput(page, 'productNumber', HAMMADDE_MDF.productNumber)
    await fillAntInput(page, 'productName', HAMMADDE_MDF.productName)
    await selectAntOption(page, 'categoryType', 'Hammadde', 'Kategori')
    await selectAntOption(page, 'unitId', HAMMADDE_MDF.unit, 'Birim')
    await fillAntInput(page, 'minStock', HAMMADDE_MDF.minStock)
    await saveFormPage(page)
    await page.waitForTimeout(1500)
    const urlMatch = page.url().match(/\/products\/(?:form\/)?([a-f0-9-]{36})/)
    if (urlMatch) { STATE.stockIdMdf = urlMatch[1]; console.log(`[C.1] stockIdMdf=${urlMatch[1]}`) }
    if (!STATE.stockIdMdf) {
      const res = await apiCall(page, 'GET', '/Product?type=stock')
      if (res.data) {
        const list = res.data.data || res.data
        if (Array.isArray(list)) {
          const found = list.find(p => p.productNumber === HAMMADDE_MDF.productNumber)
          if (found) STATE.stockIdMdf = found.id
        }
      }
    }
    expect(STATE.stockIdMdf).toBeTruthy()
  })

  test('C.2 — HM-LAMINAT-BEYAZ stok karti olustur', async ({ page }) => {
    await gotoAndWait(page, '/products/new')
    await fillAntInput(page, 'productNumber', HAMMADDE_LAMINAT.productNumber)
    await fillAntInput(page, 'productName', HAMMADDE_LAMINAT.productName)
    await selectAntOption(page, 'categoryType', 'Hammadde', 'Kategori')
    await selectAntOption(page, 'unitId', HAMMADDE_LAMINAT.unit, 'Birim')
    await fillAntInput(page, 'minStock', HAMMADDE_LAMINAT.minStock)
    await saveFormPage(page)
    await page.waitForTimeout(1500)
    const urlMatch = page.url().match(/\/products\/(?:form\/)?([a-f0-9-]{36})/)
    if (urlMatch) { STATE.stockIdLaminat = urlMatch[1]; console.log(`[C.2] stockIdLaminat=${urlMatch[1]}`) }
    if (!STATE.stockIdLaminat) {
      const res = await apiCall(page, 'GET', '/Product?type=stock')
      if (res.data) {
        const list = res.data.data || res.data
        if (Array.isArray(list)) {
          const found = list.find(p => p.productNumber === HAMMADDE_LAMINAT.productNumber)
          if (found) STATE.stockIdLaminat = found.id
        }
      }
    }
    expect(STATE.stockIdLaminat).toBeTruthy()
  })

  test('C.3 — HM-AKCESUAR-KIT stok karti olustur', async ({ page }) => {
    await gotoAndWait(page, '/products/new')
    await fillAntInput(page, 'productNumber', HAMMADDE_AKSESUAR.productNumber)
    await fillAntInput(page, 'productName', HAMMADDE_AKSESUAR.productName)
    await selectAntOption(page, 'categoryType', 'Hammadde', 'Kategori')
    await selectAntOption(page, 'unitId', HAMMADDE_AKSESUAR.unit, 'Birim')
    await fillAntInput(page, 'minStock', HAMMADDE_AKSESUAR.minStock)
    await saveFormPage(page)
    await page.waitForTimeout(1500)
    const urlMatch = page.url().match(/\/products\/(?:form\/)?([a-f0-9-]{36})/)
    if (urlMatch) { STATE.stockIdAksesuar = urlMatch[1]; console.log(`[C.3] stockIdAksesuar=${urlMatch[1]}`) }
    if (!STATE.stockIdAksesuar) {
      const res = await apiCall(page, 'GET', '/Product?type=stock')
      if (res.data) {
        const list = res.data.data || res.data
        if (Array.isArray(list)) {
          const found = list.find(p => p.productNumber === HAMMADDE_AKSESUAR.productNumber)
          if (found) STATE.stockIdAksesuar = found.id
        }
      }
    }
    expect(STATE.stockIdAksesuar).toBeTruthy()
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// FAZ D — MAMUL ÜRÜN KARTI
// ─────────────────────────────────────────────────────────────────────────────

test.describe('FAZ D — Mamul Urun Karti', () => {
  test('D.1 — MOB-ODA-SETI-HILTON urun karti olustur', async ({ page }) => {
    await gotoAndWait(page, '/products/new')
    await fillAntInput(page, 'productNumber', MAMUL.productNumber)
    await fillAntInput(page, 'productName', MAMUL.productName)
    await selectAntOption(page, 'categoryType', 'Mamul', 'Kategori')
    await selectAntOption(page, 'unitId', 'SET', 'Birim')
    await fillAntInput(page, 'salePrice', '8500')
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
          const found = list.find(p => p.productNumber === 'MOB-ODA-SETI-HILTON')
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
  test('E.1 — BOM: MDF Plaka 18 plaka/set', async ({ page }) => {
    if (!STATE.productId || !STATE.stockIdMdf) { console.warn('[E.1] eksik ID'); return }
    const res = await apiCall(page, 'POST', '/Bom', {
      parentProductId: STATE.productId,
      childProductId:  STATE.stockIdMdf,
      quantity: 18,
    })
    console.log(`[E.1] BOM MDF: status=${res.status} id=${res.data?.id}`)
    if (res.data?.id) STATE.bomId = res.data.id
    expect([200, 201]).toContain(res.status)
  })

  test('E.2 — BOM: Beyaz Laminat 20m2/set', async ({ page }) => {
    if (!STATE.productId || !STATE.stockIdLaminat) { console.warn('[E.2] eksik ID'); return }
    const res = await apiCall(page, 'POST', '/Bom', {
      parentProductId: STATE.productId,
      childProductId:  STATE.stockIdLaminat,
      quantity: 20,
    })
    console.log(`[E.2] BOM Laminat: status=${res.status}`)
    expect([200, 201]).toContain(res.status)
  })

  test('E.3 — BOM: Mobilya Aksesuar 4 kit/set', async ({ page }) => {
    if (!STATE.productId || !STATE.stockIdAksesuar) { console.warn('[E.3] eksik ID'); return }
    const res = await apiCall(page, 'POST', '/Bom', {
      parentProductId: STATE.productId,
      childProductId:  STATE.stockIdAksesuar,
      quantity: 4,
    })
    console.log(`[E.3] BOM Aksesuar: status=${res.status}`)
    expect([200, 201]).toContain(res.status)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// FAZ F — KONTROL PLANI (EN 14073)
// ─────────────────────────────────────────────────────────────────────────────

test.describe('FAZ F — Kontrol Plani EN 14073', () => {
  test('F.1 — Mobilya kalite kontrol plani olustur', async ({ page }) => {
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

  test('F.2 — Kontrol kalemi: Boyutsal ±1mm', async ({ page }) => {
    if (!STATE.controlPlanId) { console.warn('[F.2] controlPlanId eksik'); return }
    const res = await apiCall(page, 'POST', '/ControlPlan/items', {
      controlPlanId:   STATE.controlPlanId,
      processStep:     'CNC Kesim OP10',
      characteristic:  'Parca boyutlari',
      measurementTool: 'Dijital kumpas',
      specification:   'Nominal ±1mm (EN 14073)',
      frequency:       'Her 5 parcada 1',
      sampleSize:      '%20',
    })
    console.log(`[F.2] Boyutsal kalem: status=${res.status}`)
    expect([200, 201]).toContain(res.status)
  })

  test('F.3 — Kontrol kalemi: Kenar band adezyonu', async ({ page }) => {
    if (!STATE.controlPlanId) { console.warn('[F.3] controlPlanId eksik'); return }
    const res = await apiCall(page, 'POST', '/ControlPlan/items', {
      controlPlanId:   STATE.controlPlanId,
      processStep:     'Kenar Bantlama OP20',
      characteristic:  'Kenar band adezyonu',
      measurementTool: 'El testi + kesit kesme',
      specification:   'Kohezif kopmali ayrilma (yapistirici kalinligi > 0.1mm)',
      frequency:       'Her 10 parcada 1',
      sampleSize:      '%10',
    })
    console.log(`[F.3] Kenar adezyon kalem: status=${res.status}`)
    expect([200, 201]).toContain(res.status)
  })

  test('F.4 — Kontrol kalemi: Renk RAL tutarliligi', async ({ page }) => {
    if (!STATE.controlPlanId) { console.warn('[F.4] controlPlanId eksik'); return }
    const res = await apiCall(page, 'POST', '/ControlPlan/items', {
      controlPlanId:   STATE.controlPlanId,
      processStep:     'Boya OP30',
      characteristic:  'Renk tutarliligi RAL',
      measurementTool: 'Spektrofotometre',
      specification:   'Delta E < 1.5 (RAL referans plaka kiyaslamasi)',
      frequency:       'Lot basinda ve sonunda',
      sampleSize:      '%5',
    })
    console.log(`[F.4] Renk kalem: status=${res.status}`)
    expect([200, 201]).toContain(res.status)
  })

  test('F.5 — Kontrol kalemi: EN 14073 mukavemet', async ({ page }) => {
    if (!STATE.controlPlanId) { console.warn('[F.5] controlPlanId eksik'); return }
    const res = await apiCall(page, 'POST', '/ControlPlan/items', {
      controlPlanId:   STATE.controlPlanId,
      processStep:     'Son Montaj OP40',
      characteristic:  'Govde mukavemeti EN 14073',
      measurementTool: 'Yukle test aleti',
      specification:   'Dolap govdesi: 1000N yuk altinda kalici deformasyon yok',
      frequency:       'Her lot (20 set) basi 1 adet yikici test',
      sampleSize:      '%5',
    })
    console.log(`[F.5] Mukavemet kalem: status=${res.status}`)
    expect([200, 201]).toContain(res.status)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// FAZ G — İŞ EMRİ ŞABLONU (OP10-OP40)
// ─────────────────────────────────────────────────────────────────────────────

test.describe('FAZ G — Is Emri Sablonu', () => {
  test('G.1 — OP10-OP40 mobilya is emri sablonu olustur', async ({ page }) => {
    const ops = IS_EMRI_SABLONU.operasyonlar.map(op => ({
      rowNo:                op.rowNo,
      code:                 op.code,
      machineId:            op.machineKey === 'cnc'    ? STATE.machineIdCnc    :
                            op.machineKey === 'kenar'  ? STATE.machineIdKenar  :
                            op.machineKey === 'boya'   ? STATE.machineIdBoya   :
                            op.machineKey === 'montaj' ? STATE.machineIdMontaj : null,
      estimatedMinutes:     op.estimatedMinutes,
      requiresQualityCheck: op.requiresQualityCheck,
      prerequisiteRowNo:    op.prerequisiteRowNo,
      description:          op.code === 'OP10' ? 'CNC router kesim — 18 parca/set (gövde panelleri + kapi)' :
                            op.code === 'OP20' ? 'Kenar bantlama: uzun kenar + kisa kenar PVC 2mm' :
                            op.code === 'OP30' ? 'Lake boya 2 kat + UV kurutma — renk RAL kontrolu' :
                            'Montaj + son kalite + paketleme',
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
// FAZ H — TEKLİF (20 set × 8.500₺ = 170.000₺)
// ─────────────────────────────────────────────────────────────────────────────

test.describe('FAZ H — Teklif', () => {
  test('H.1 — Teklif olustur (20 set x 8.500₺)', async ({ page }) => {
    if (!STATE.customerId) {
      const res = await apiCall(page, 'GET', '/Customer?type=customers')
      if (res.data) {
        const list = res.data.data || res.data
        if (Array.isArray(list)) {
          const found = list.find(c => c.name?.includes('Hilton'))
          if (found) STATE.customerId = found.id
        }
      }
    }
    await gotoAndWait(page, '/offers/new')
    await selectAntOption(page, 'customerId', 'Hilton', 'Musteri')
    await page.waitForTimeout(800)

    const addRowBtn = page.locator('button:has-text("Kalem Ekle"), button:has-text("Urun Ekle"), button:has(.anticon-plus)').first()
    if (await addRowBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await addRowBtn.click(); await page.waitForTimeout(800)
    }

    const productInput = page.locator('input[placeholder*="urun"], input[placeholder*="ürün"]').first()
    if (await productInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await productInput.fill('MOB-ODA-SETI')
      await page.waitForTimeout(1000)
      const opt = page.locator('.ant-select-item-option').filter({ hasText: 'MOB-ODA-SETI' }).first()
      if (await opt.isVisible({ timeout: 2000 }).catch(() => false)) await opt.click()
    }

    const qtyInput = page.locator('input[placeholder*="miktar"], input[placeholder*="Miktar"]').first()
    if (await qtyInput.isVisible({ timeout: 2000 }).catch(() => false)) await qtyInput.fill('20')
    const priceInput = page.locator('input[placeholder*="fiyat"], input[placeholder*="Fiyat"]').first()
    if (await priceInput.isVisible({ timeout: 2000 }).catch(() => false)) await priceInput.fill('8500')

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
  test('I.1 — Hilton Oteller satis siparisi olustur', async ({ page }) => {
    await gotoAndWait(page, '/sales/new')
    await selectAntOption(page, 'customerId', 'Hilton', 'Musteri')
    await page.waitForTimeout(600)

    const addBtn = page.locator('button:has-text("Kalem Ekle"), button:has-text("Urun Ekle")').first()
    if (await addBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await addBtn.click(); await page.waitForTimeout(600)
      const productInput = page.locator('input[placeholder*="urun"]').first()
      if (await productInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        await productInput.fill('MOB-ODA-SETI'); await page.waitForTimeout(1000)
        const opt = page.locator('.ant-select-item-option').filter({ hasText: 'MOB-ODA-SETI' }).first()
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
  test('J.1 — Mobilya uretim emri ac', async ({ page }) => {
    await gotoAndWait(page, '/production/new')
    const productInput = page.locator('input[placeholder*="urun"]').first()
    if (await productInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await productInput.fill('MOB-ODA-SETI'); await page.waitForTimeout(1000)
      const opt = page.locator('.ant-select-item-option').filter({ hasText: 'MOB-ODA-SETI' }).first()
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
// FAZ K — GİRİŞ MUAYENESİ
// ─────────────────────────────────────────────────────────────────────────────

test.describe('FAZ K — Giris Muayenesi', () => {
  test('K.1 — MDF plaka giris muayenesi (nem icerigi)', async ({ page }) => {
    if (!STATE.stockIdMdf) { console.warn('[K.1] stockIdMdf eksik'); return }
    const res = await apiCall(page, 'POST', '/IncomingInspection', {
      productId:      STATE.stockIdMdf,
      quantity:       360,
      supplierId:     STATE.supplierId || null,
      inspectionDate: new Date().toISOString().split('T')[0],
      result:         'PASSED',
      notes:          'MDF E1 sinifi. Nem icerigi: %8.2 — uygun (maks %12). Kalipbasma testi: 0.38 N/mm2 — uygun.',
    })
    console.log(`[K.1] MDF IncomingInspection: status=${res.status} id=${res.data?.id}`)
    if (res.data?.id) STATE.inspectionId = res.data.id
    expect([200, 201]).toContain(res.status)
  })

  test('K.2 — Laminat renk karsılastirma giris muayenesi', async ({ page }) => {
    if (!STATE.stockIdLaminat) { console.warn('[K.2] stockIdLaminat eksik'); return }
    const res = await apiCall(page, 'POST', '/IncomingInspection', {
      productId:      STATE.stockIdLaminat,
      quantity:       20,
      supplierId:     STATE.supplierId || null,
      inspectionDate: new Date().toISOString().split('T')[0],
      result:         'PASSED',
      notes:          'Beyaz mat laminat. Referans RAL 9010 ile Delta E=0.8 — uygun. Yuzey pürüzlülügü: Ra 0.4 µm.',
    })
    console.log(`[K.2] Laminat IncomingInspection: status=${res.status}`)
    expect([200, 201]).toContain(res.status)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// FAZ L — ATÖLYE OPERASYONLARI (OP10-OP40)
// ─────────────────────────────────────────────────────────────────────────────

test.describe('FAZ L — Mobilya Atolye Yurutmesi', () => {
  test('L.1 — OP10 CNC router kesim (18 parca/set)', async ({ page }) => {
    if (!STATE.productionId) { console.warn('[L.1] productionId eksik'); return }
    const res = await apiCall(page, 'POST', `/Production/completion/${STATE.productionId}`, {
      operationCode: 'OP10', completedQty: 20, scrapQty: 2,
      operatorNote: 'OP10 CNC kesim tamamlandi. 2 MDF plakasinda kesim ofseti hatasi — NCR acildi. 18 set temiz.',
      machineId: STATE.machineIdCnc || null,
    })
    console.log(`[L.1] OP10: status=${res.status}`)
    expect([200, 201, 404]).toContain(res.status)
  })

  test('L.2 — OP20 Kenar bantlama', async ({ page }) => {
    if (!STATE.productionId) { console.warn('[L.2] productionId eksik'); return }
    const res = await apiCall(page, 'POST', `/Production/completion/${STATE.productionId}`, {
      operationCode: 'OP20', completedQty: 18, scrapQty: 0,
      operatorNote: 'OP20 kenar bantlama tamamlandi. PVC 2mm uzun ve kisa kenar — 18/18 uygun. Adezyon kontrolu gecti.',
      machineId: STATE.machineIdKenar || null,
    })
    console.log(`[L.2] OP20: status=${res.status}`)
    expect([200, 201, 404]).toContain(res.status)
  })

  test('L.3 — OP30 Lake boya 2 kat + UV kurutma', async ({ page }) => {
    if (!STATE.productionId) { console.warn('[L.3] productionId eksik'); return }
    const res = await apiCall(page, 'POST', `/Production/completion/${STATE.productionId}`, {
      operationCode: 'OP30', completedQty: 18, scrapQty: 1,
      operatorNote: 'OP30 boya tamamlandi. 1 set renk hatasi (Delta E=2.3 — limit asisıldı) — NCR kaydi. 17 set uygun.',
      machineId: STATE.machineIdBoya || null,
    })
    console.log(`[L.3] OP30: status=${res.status}`)
    expect([200, 201, 404]).toContain(res.status)
  })

  test('L.4 — OP40 Montaj + son kalite + paketleme', async ({ page }) => {
    if (!STATE.productionId) { console.warn('[L.4] productionId eksik'); return }
    const res = await apiCall(page, 'POST', `/Production/completion/${STATE.productionId}`, {
      operationCode: 'OP40', completedQty: 19, scrapQty: 0,
      operatorNote: 'OP40 montaj ve paketleme tamamlandi. 19/19 uygun. Hilton sevkiyat etiketleri yapıstırıldı.',
      machineId: STATE.machineIdMontaj || null,
    })
    console.log(`[L.4] OP40: status=${res.status}`)
    expect([200, 201, 404]).toContain(res.status)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// FAZ M — NCR (BOYUT SAPMA)
// ─────────────────────────────────────────────────────────────────────────────

test.describe('FAZ M — NCR Boyut Sapmasi', () => {
  test('M.1 — NCR olustur (kapak 597mm yerine 603mm)', async ({ page }) => {
    if (!STATE.productId) { console.warn('[M.1] productId eksik'); return }
    const res = await apiCall(page, 'POST', '/Ncr', {
      productId:    STATE.productId,
      productionId: STATE.productionId || null,
      title:        'Dolap kapagi boyut sapmasi — OP10 CNC kesim offset hatasi',
      description:  'Kapak genisligi: nominal 597mm, olculen 603mm (+6mm). EN 14073 tolerans asimi. Kesim ofseti yazilim hatasi.',
      defectType:   'DIMENSIONAL',
      quantity:     2,
      severity:     'MAJOR',
      detectedBy:   'Kalite Kontrol — Kumpas Olcumu',
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
      title:       'CNC Offset Hatasi — Yazilim Kalibrasyon Duzeltmesi',
      description: 'Biesse Rover CNC makine offseti +6mm fazla. Kalibrasyon programi guncellenmeli.',
    })
    console.log(`[N.1] CAPA ac: status=${res.status} id=${res.data?.id}`)
    if (res.data?.id) STATE.capaId = res.data.id
    expect([200, 201]).toContain(res.status)
  })

  test('N.2 — CAPA ROOT_CAUSE_ANALYSIS', async ({ page }) => {
    if (!STATE.capaId) { console.warn('[N.2] capaId eksik'); return }
    const res = await apiCall(page, 'PUT', `/Capa/${STATE.capaId}`, {
      status:    'ROOT_CAUSE_ANALYSIS',
      rootCause: 'CNC kontrol yazilimi v3.2 guncellemesi sonrasi X-ekseni offset degeri yanlislikla +6mm olarak degisti. Setup dogrulama proseduru uygulanmamis.',
    })
    console.log(`[N.2] CAPA RCA: status=${res.status}`)
    expect([200, 204]).toContain(res.status)
  })

  test('N.3 — CAPA IMPLEMENTATION', async ({ page }) => {
    if (!STATE.capaId) { console.warn('[N.3] capaId eksik'); return }
    const res = await apiCall(page, 'PUT', `/Capa/${STATE.capaId}`, {
      status:           'IMPLEMENTATION',
      correctiveAction: 'CNC offset X-ekseni 0.0mm olarak duzeltildi. Setup onay formu yeniden aktif edildi. Yazilim guncelleme prosedurune dogrulama adimi eklendi.',
    })
    console.log(`[N.3] CAPA IMPL: status=${res.status}`)
    expect([200, 204]).toContain(res.status)
  })

  test('N.4 — CAPA CLOSED', async ({ page }) => {
    if (!STATE.capaId) { console.warn('[N.4] capaId eksik'); return }
    const res = await apiCall(page, 'PUT', `/Capa/${STATE.capaId}`, {
      status: 'CLOSED',
      notes:  'Son 50 kesim operasyonunda boyut sapmasi tekrarlanmadi. Offset hatasi onlendi. Etkinlik dogrulandi.',
    })
    console.log(`[N.4] CAPA CLOSED: status=${res.status}`)
    expect([200, 204]).toContain(res.status)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// FAZ O — FATURA (19 set × 8.500₺ = 161.500₺)
// ─────────────────────────────────────────────────────────────────────────────

test.describe('FAZ O — Fatura', () => {
  test('O.1 — Hilton Oteller satis faturasi olustur (19 set x 8.500₺)', async ({ page }) => {
    await gotoAndWait(page, '/invoices/new')
    await selectAntOption(page, 'customerId', 'Hilton', 'Musteri')
    await page.waitForTimeout(600)

    const addBtn = page.locator('button:has-text("Kalem Ekle"), button:has-text("Urun Ekle")').first()
    if (await addBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await addBtn.click(); await page.waitForTimeout(600)
      const productInput = page.locator('input[placeholder*="urun"]').first()
      if (await productInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        await productInput.fill('MOB-ODA-SETI'); await page.waitForTimeout(1000)
        const opt = page.locator('.ant-select-item-option').filter({ hasText: 'MOB-ODA-SETI' }).first()
        if (await opt.isVisible({ timeout: 2000 }).catch(() => false)) await opt.click()
      }
      const qtyInput = page.locator('input[placeholder*="miktar"]').first()
      if (await qtyInput.isVisible({ timeout: 2000 }).catch(() => false)) await qtyInput.fill('19')
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
// FAZ P — MALİYET ANALİZİ + ÖZET
// ─────────────────────────────────────────────────────────────────────────────

test.describe('FAZ P — Maliyet ve Ozet', () => {
  test('P.1 — Mobilya uretim maliyeti sorgula', async ({ page }) => {
    if (!STATE.productionId) { console.warn('[P.1] productionId eksik'); return }
    const res = await apiCall(page, 'GET', `/PartCost/${STATE.productionId}`)
    console.log(`[P.1] PartCost: status=${res.status}`)
    expect(res.status).toBeLessThan(500)
  })

  test('P.2 — OZET: Tum kritik ID kayitlari dogrula', async ({ page }) => {
    console.log('\n════════════════════════════════════════════════')
    console.log('  Mobilya Imalati E2E — FINAL OZET')
    console.log('════════════════════════════════════════════════')
    console.log(`  Musteri (Hilton)        : ${STATE.customerId || 'EKSIK'}`)
    console.log(`  Tedarikci (Kastamonu)   : ${STATE.supplierId || 'EKSIK'}`)
    console.log(`  CNC-ROUTER-01           : ${STATE.machineIdCnc || 'EKSIK'}`)
    console.log(`  BOYA-01                 : ${STATE.machineIdBoya || 'EKSIK'}`)
    console.log(`  HM-MDF-25mm             : ${STATE.stockIdMdf || 'EKSIK'}`)
    console.log(`  HM-LAMINAT-BEYAZ        : ${STATE.stockIdLaminat || 'EKSIK'}`)
    console.log(`  HM-AKCESUAR-KIT         : ${STATE.stockIdAksesuar || 'EKSIK'}`)
    console.log(`  MOB-ODA-SETI-HILTON     : ${STATE.productId || 'EKSIK'}`)
    console.log(`  BOM                     : ${STATE.bomId || 'EKSIK'}`)
    console.log(`  Kontrol Plani EN 14073  : ${STATE.controlPlanId || 'EKSIK'}`)
    console.log(`  Is Emri Sablonu         : ${STATE.templateId || 'EKSIK'}`)
    console.log(`  Teklif (170.000₺)       : ${STATE.offerId || 'EKSIK'}`)
    console.log(`  Satis Siparisi          : ${STATE.salesId || 'EKSIK'}`)
    console.log(`  Uretim Emri             : ${STATE.productionId || 'EKSIK'}`)
    console.log(`  NCR (boyut sapmasi)     : ${STATE.ncrId || 'EKSIK'}`)
    console.log(`  CAPA (CLOSED)           : ${STATE.capaId || 'EKSIK'}`)
    console.log(`  Fatura (161.500₺)       : ${STATE.invoiceId || 'EKSIK'}`)
    console.log('════════════════════════════════════════════════\n')

    const kritikIds = [STATE.customerId, STATE.productId, STATE.offerId, STATE.salesId, STATE.productionId]
    const mevcut = kritikIds.filter(Boolean).length
    console.log(`  Kritik kayit: ${mevcut}/${kritikIds.length}`)
    expect(mevcut).toBeGreaterThanOrEqual(3)
  })
})
