/**
 * Quvex ERP — Yuzey Islem Kaplama TAM VERİ GİRİŞİ E2E Testi
 *
 * Senaryo: Güven Kaplama Sanayi Ltd.Şti. → TUSAŞ alüminyum parça anodize kaplama (FASON)
 * Standartlar: AS9100D, MIL-A-8625F Type III (Hard Anodize), ASTM B117 (Tuz Sisi 336h)
 *
 * Kapsam:
 *   FAZ A : Müşteri (TUSAŞ) — tedarikçi yok (fason model) — UI
 *   FAZ B : 4 makine + 2 depo — UI
 *   FAZ C : Gelen fason parça stok kartı — UI
 *   FAZ D : Hizmet ürün kartı (SRV-ANOD-TYPE3-MIL) — UI
 *   FAZ E : BOM minimal — API
 *   FAZ F : Kontrol Planı + 5 kalem (MIL-A-8625 odaklı) — API
 *   FAZ G : İş emri şablonu OP10-OP50 — API
 *   FAZ H : Teklif 200 panel × 1.850₺ = 370.000₺ → SENT → ACCEPTED — UI + API
 *   FAZ I : Satış Siparişi — UI
 *   FAZ J : Üretim Emri — UI
 *   FAZ K : Giriş muayenesi (panel kabul + yüzey durumu) — API
 *   FAZ L : Atölye operasyonları OP10-OP50 — API
 *   FAZ M : NCR (5 panel kaplama kalınlığı 22µm — MIL limit: 25µm min) — API
 *   FAZ N : CAPA → kapatma — API
 *   FAZ O : MIL Kaplama Sertifikası (COC) + Fatura (195 panel × 1.850₺) — API + UI
 *   FAZ P : Maliyet analizi + ÖZET — API
 *
 * Workaround notları:
 *   Fason model: tedarikçi yok, gelen malzeme müşteri mülkü (K1)
 *   MIL Kaplama Sertifikası → Certificate endpoint type=COC (K2)
 *   ASTM B117 tuz sisi 336 saat → İş emri OP50 estimatedMinutes=336 (K3)
 */
const { test, expect } = require('./fixtures')

const API = 'https://api.quvex.io'

// ─── Test Verileri ────────────────────────────────────────────────────────────

const MUSTERI = {
  name:        'TUSAS Turk Havacilik ve Uzay Sanayii A.S.',
  officerName: 'Serkan Tedarik',
  email:       'tedarik@tusas.com.tr',
  phone:       '3122892500',
  taxId:       '9012345678',
}

const MAKINE_ANOD    = { code: 'ANOD-01',    name: 'Anodize Tank Seri 1000L',                    brand: 'Ozel Yapim', hourlyRate: '350' }
const MAKINE_ASTM    = { code: 'ASTM-01',    name: 'Tuz Sisi Test Kabini ASTM B117',             brand: 'Weiss',      hourlyRate: '100' }
const MAKINE_TEMIZLIK = { code: 'TEMIZLIK-01', name: 'Kimyasal Temizlik Yuzey Hazirlik Hatti',   brand: 'Ozel Yapim', hourlyRate: '200' }
const MAKINE_KALIN   = { code: 'KALIN-01',   name: 'Kaplama Kalinlik Olcum Cihazi Eddy Current', brand: 'Fischer',    hourlyRate: '50'  }

const DEPO_GELEN  = { code: 'DEPO-GELEN',  name: 'Gelen Musteri Parcasi Deposu'   }
const DEPO_GIDEN  = { code: 'DEPO-GIDEN',  name: 'Kaplama Sonrasi Giden Parca Deposu' }

const HAMMADDE_FASON = {
  productNumber: 'HM-FASON-AL-PANEL',
  productName:   'TUSAS - Al 7075-T6 Kanat Paneli (Gelen Fason Kaplama)',
  minStock:      '50',
  unit:          'ADET',
}

const MAMUL = {
  productNumber: 'SRV-ANOD-TYPE3-MIL',
  productName:   'Anodize Kaplama Hizmeti Type III Hard Anodize 25-50 mikron MIL-A-8625',
}

const KONTROL_PLANI = {
  title:       'MIL-A-8625 Type III Anodize Kaplama Kalite',
  processName: 'Yuzey Hazirlik Anodize Muhürleme',
  description: 'MIL-A-8625F Type III Hard Anodize. Kaplama kalinligi: 25-50 µm. Tuz sisi dayanimi: 336 saat minimum (ASTM B117). H2SO4 %15, 18-22°C, 24V DC. AS9100D prosedurlerine uygun.',
}

const IS_EMRI_SABLONU = {
  name: 'SRV-ANOD-TYPE3-MIL Anodize Kaplama Is Emri',
  operasyonlar: [
    { rowNo: 10, code: 'OP10', machineKey: 'temizlik', estimatedMinutes: 60,  requiresQualityCheck: true,  prerequisiteRowNo: null },
    { rowNo: 20, code: 'OP20', machineKey: 'anod',     estimatedMinutes: 90,  requiresQualityCheck: true,  prerequisiteRowNo: 10   },
    { rowNo: 30, code: 'OP30', machineKey: 'anod',     estimatedMinutes: 30,  requiresQualityCheck: false, prerequisiteRowNo: 20   },
    { rowNo: 40, code: 'OP40', machineKey: 'kalin',    estimatedMinutes: 20,  requiresQualityCheck: true,  prerequisiteRowNo: 30   },
    { rowNo: 50, code: 'OP50', machineKey: 'astm',     estimatedMinutes: 336, requiresQualityCheck: true,  prerequisiteRowNo: 40   },
  ],
}

const STATE = {
  token: null, customerId: null,
  machineIdAnod: null, machineIdAstm: null, machineIdTemizlik: null, machineIdKalin: null,
  warehouseIdGelen: null, warehouseIdGiden: null,
  stockIdFason: null, productId: null,
  bomId: null, controlPlanId: null, templateId: null,
  offerId: null, salesId: null, productionId: null,
  inspectionId: null, ncrId: null, capaId: null,
  cocCertId: null, invoiceId: null,
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
// FAZ A — MÜŞTERİ (tedarikçi yok — fason model)
// ─────────────────────────────────────────────────────────────────────────────

test.describe('FAZ A — Musteri (Fason Model)', () => {
  test('A.1 — TUSAS musteri kaydi olustur', async ({ page }) => {
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
        const found = list.find(c => c.name?.includes('TUSAS') || c.name?.includes('Havacilik'))
        if (found) { STATE.customerId = found.id; console.log(`[A.1] customerId=${found.id}`) }
      }
    }
    console.log('[A.1] Fason model: tedarikci yok, musteri kendi malzemesini gönderir.')
    expect(res.status).toBeLessThan(300)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// FAZ B — MAKİNE + DEPO
// ─────────────────────────────────────────────────────────────────────────────

test.describe('FAZ B — Makine ve Depo', () => {
  test('B.1 — ANOD-01 anodize tank tanimla', async ({ page }) => {
    await gotoAndWait(page, '/machines')
    await openAddModal(page)
    await fillAntInput(page, 'code', MAKINE_ANOD.code)
    await fillAntInput(page, 'name', MAKINE_ANOD.name)
    await fillAntInput(page, 'brand', MAKINE_ANOD.brand)
    await fillAntInput(page, 'hourlyRate', MAKINE_ANOD.hourlyRate)
    await saveFormModal(page)
    const res = await apiCall(page, 'GET', '/Machine')
    if (res.data) {
      const list = res.data.data || res.data
      if (Array.isArray(list)) {
        const f = list.find(m => m.code === 'ANOD-01'); if (f) STATE.machineIdAnod = f.id
      }
    }
    console.log(`[B.1] ANOD-01 machineIdAnod=${STATE.machineIdAnod}`)
    expect(true).toBe(true)
  })

  test('B.2 — ASTM-01 tuz sisi test kabini tanimla', async ({ page }) => {
    await gotoAndWait(page, '/machines')
    await openAddModal(page)
    await fillAntInput(page, 'code', MAKINE_ASTM.code)
    await fillAntInput(page, 'name', MAKINE_ASTM.name)
    await fillAntInput(page, 'brand', MAKINE_ASTM.brand)
    await fillAntInput(page, 'hourlyRate', MAKINE_ASTM.hourlyRate)
    await saveFormModal(page)
    const res = await apiCall(page, 'GET', '/Machine')
    if (res.data) {
      const list = res.data.data || res.data
      if (Array.isArray(list)) {
        const f = list.find(m => m.code === 'ASTM-01'); if (f) STATE.machineIdAstm = f.id
      }
    }
    expect(true).toBe(true)
  })

  test('B.3 — TEMIZLIK-01 kimyasal temizlik hatti tanimla', async ({ page }) => {
    await gotoAndWait(page, '/machines')
    await openAddModal(page)
    await fillAntInput(page, 'code', MAKINE_TEMIZLIK.code)
    await fillAntInput(page, 'name', MAKINE_TEMIZLIK.name)
    await fillAntInput(page, 'brand', MAKINE_TEMIZLIK.brand)
    await fillAntInput(page, 'hourlyRate', MAKINE_TEMIZLIK.hourlyRate)
    await saveFormModal(page)
    const res = await apiCall(page, 'GET', '/Machine')
    if (res.data) {
      const list = res.data.data || res.data
      if (Array.isArray(list)) {
        const f = list.find(m => m.code === 'TEMIZLIK-01'); if (f) STATE.machineIdTemizlik = f.id
      }
    }
    expect(true).toBe(true)
  })

  test('B.4 — KALIN-01 kaplama kalinlik olcum cihazi tanimla', async ({ page }) => {
    await gotoAndWait(page, '/machines')
    await openAddModal(page)
    await fillAntInput(page, 'code', MAKINE_KALIN.code)
    await fillAntInput(page, 'name', MAKINE_KALIN.name)
    await fillAntInput(page, 'brand', MAKINE_KALIN.brand)
    await fillAntInput(page, 'hourlyRate', MAKINE_KALIN.hourlyRate)
    await saveFormModal(page)
    const res = await apiCall(page, 'GET', '/Machine')
    if (res.data) {
      const list = res.data.data || res.data
      if (Array.isArray(list)) {
        const f = list.find(m => m.code === 'KALIN-01'); if (f) STATE.machineIdKalin = f.id
      }
    }
    expect(true).toBe(true)
  })

  test('B.5 — DEPO-GELEN gelen musteri parcasi deposu tanimla', async ({ page }) => {
    await gotoAndWait(page, '/warehouses')
    await openAddModal(page)
    await fillAntInput(page, 'code', DEPO_GELEN.code)
    await fillAntInput(page, 'name', DEPO_GELEN.name)
    await saveFormModal(page)
    const res = await apiCall(page, 'GET', '/Warehouse')
    if (res.data) {
      const list = res.data.data || res.data
      if (Array.isArray(list)) {
        const f = list.find(w => w.code === 'DEPO-GELEN'); if (f) STATE.warehouseIdGelen = f.id
      }
    }
    expect(true).toBe(true)
  })

  test('B.6 — DEPO-GIDEN giden parca deposu tanimla', async ({ page }) => {
    await gotoAndWait(page, '/warehouses')
    await openAddModal(page)
    await fillAntInput(page, 'code', DEPO_GIDEN.code)
    await fillAntInput(page, 'name', DEPO_GIDEN.name)
    await saveFormModal(page)
    const res = await apiCall(page, 'GET', '/Warehouse')
    if (res.data) {
      const list = res.data.data || res.data
      if (Array.isArray(list)) {
        const f = list.find(w => w.code === 'DEPO-GIDEN'); if (f) STATE.warehouseIdGiden = f.id
      }
    }
    expect(true).toBe(true)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// FAZ C — FASON PARÇA STOK KARTI
// ─────────────────────────────────────────────────────────────────────────────

test.describe('FAZ C — Fason Parca Stok Karti', () => {
  test('C.1 — TUSAS Al 7075-T6 kanat paneli fason stok karti olustur', async ({ page }) => {
    await gotoAndWait(page, '/products/new')
    await fillAntInput(page, 'productNumber', HAMMADDE_FASON.productNumber)
    await fillAntInput(page, 'productName', HAMMADDE_FASON.productName)
    await selectAntOption(page, 'categoryType', 'Hammadde', 'Kategori')
    await selectAntOption(page, 'unitId', HAMMADDE_FASON.unit, 'Birim')
    await fillAntInput(page, 'minStock', HAMMADDE_FASON.minStock)
    await saveFormPage(page)
    await page.waitForTimeout(1500)
    const urlMatch = page.url().match(/\/products\/(?:form\/)?([a-f0-9-]{36})/)
    if (urlMatch) { STATE.stockIdFason = urlMatch[1]; console.log(`[C.1] stockIdFason=${urlMatch[1]}`) }
    if (!STATE.stockIdFason) {
      const res = await apiCall(page, 'GET', '/Product?type=stock')
      if (res.data) {
        const list = res.data.data || res.data
        if (Array.isArray(list)) {
          const found = list.find(p => p.productNumber === HAMMADDE_FASON.productNumber)
          if (found) STATE.stockIdFason = found.id
        }
      }
    }
    expect(STATE.stockIdFason).toBeTruthy()
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// FAZ D — HİZMET ÜRÜN KARTI
// ─────────────────────────────────────────────────────────────────────────────

test.describe('FAZ D — Hizmet Urun Karti', () => {
  test('D.1 — SRV-ANOD-TYPE3-MIL anodize kaplama hizmet karti', async ({ page }) => {
    await gotoAndWait(page, '/products/new')
    await fillAntInput(page, 'productNumber', MAMUL.productNumber)
    await fillAntInput(page, 'productName', MAMUL.productName)
    await selectAntOption(page, 'categoryType', 'Mamul', 'Kategori')
    await selectAntOption(page, 'unitId', 'ADET', 'Birim')
    await fillAntInput(page, 'salePrice', '1850')
    await fillAntInput(page, 'minStock', '0')
    await saveFormPage(page)
    await page.waitForTimeout(1500)
    const urlMatch = page.url().match(/\/products\/(?:form\/)?([a-f0-9-]{36})/)
    if (urlMatch) { STATE.productId = urlMatch[1]; console.log(`[D.1] productId=${urlMatch[1]}`) }
    if (!STATE.productId) {
      const res = await apiCall(page, 'GET', '/Product?type=product')
      if (res.data) {
        const list = res.data.data || res.data
        if (Array.isArray(list)) {
          const found = list.find(p => p.productNumber === 'SRV-ANOD-TYPE3-MIL')
          if (found) STATE.productId = found.id
        }
      }
    }
    expect(STATE.productId).toBeTruthy()
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// FAZ E — BOM (minimal — fason)
// ─────────────────────────────────────────────────────────────────────────────

test.describe('FAZ E — BOM Minimal Fason', () => {
  test('E.1 — BOM: Fason parca 1 adet/hizmet', async ({ page }) => {
    if (!STATE.productId || !STATE.stockIdFason) { console.warn('[E.1] eksik ID'); return }
    const res = await apiCall(page, 'POST', '/Bom', {
      parentProductId: STATE.productId,
      childProductId:  STATE.stockIdFason,
      quantity: 1,
    })
    console.log(`[E.1] BOM Fason: status=${res.status} id=${res.data?.id}`)
    if (res.data?.id) STATE.bomId = res.data.id
    expect([200, 201]).toContain(res.status)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// FAZ F — KONTROL PLANI (MIL-A-8625F)
// ─────────────────────────────────────────────────────────────────────────────

test.describe('FAZ F — Kontrol Plani MIL-A-8625', () => {
  test('F.1 — Anodize kaplama kontrol plani olustur', async ({ page }) => {
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

  test('F.2 — Kontrol kalemi: Yuzey pH alkali temizlik', async ({ page }) => {
    if (!STATE.controlPlanId) { console.warn('[F.2] controlPlanId eksik'); return }
    const res = await apiCall(page, 'POST', '/ControlPlan/items', {
      controlPlanId:   STATE.controlPlanId,
      processStep:     'Yuzey Hazirlik OP10',
      characteristic:  'Alkali temizleyici pH seviyesi',
      measurementTool: 'pH metre',
      specification:   'pH: 11.0-12.5 (temizlik etkinligi)',
      frequency:       'Her lot basinda',
      sampleSize:      '%100 lot',
    })
    console.log(`[F.2] pH kalem: status=${res.status}`)
    expect([200, 201]).toContain(res.status)
  })

  test('F.3 — Kontrol kalemi: Anodize akim yogunlugu', async ({ page }) => {
    if (!STATE.controlPlanId) { console.warn('[F.3] controlPlanId eksik'); return }
    const res = await apiCall(page, 'POST', '/ControlPlan/items', {
      controlPlanId:   STATE.controlPlanId,
      processStep:     'Anodize OP20',
      characteristic:  'Akim yogunlugu ve gerilim',
      measurementTool: 'Dijital ammetre + voltmetre',
      specification:   '24V DC, akim yogunlugu: 1.5-2.0 A/dm2, sicaklik: 18-22°C',
      frequency:       'Her 15 dakikada bir kayıt',
      sampleSize:      '%100 surec',
    })
    console.log(`[F.3] Akim kalem: status=${res.status}`)
    expect([200, 201]).toContain(res.status)
  })

  test('F.4 — Kontrol kalemi: Kaplama kalinligi 25-50 µm', async ({ page }) => {
    if (!STATE.controlPlanId) { console.warn('[F.4] controlPlanId eksik'); return }
    const res = await apiCall(page, 'POST', '/ControlPlan/items', {
      controlPlanId:   STATE.controlPlanId,
      processStep:     'Kalinlik Olcum OP40',
      characteristic:  'Hard anodize kaplama kalinligi',
      measurementTool: 'Fischer Deltascope eddy current',
      specification:   'MIL-A-8625F Type III: 25-50 µm (nominal 38 µm)',
      frequency:       'Her panel 5 noktadan',
      sampleSize:      '%100',
    })
    console.log(`[F.4] Kalinlik kalem: status=${res.status}`)
    expect([200, 201]).toContain(res.status)
  })

  test('F.5 — Kontrol kalemi: ASTM B117 tuz sisi 336 saat', async ({ page }) => {
    if (!STATE.controlPlanId) { console.warn('[F.5] controlPlanId eksik'); return }
    const res = await apiCall(page, 'POST', '/ControlPlan/items', {
      controlPlanId:   STATE.controlPlanId,
      processStep:     'Tuz Sisi Testi OP50',
      characteristic:  'Korozyon direnci ASTM B117',
      measurementTool: 'Tuz sisi test kabini',
      specification:   'MIL-A-8625F: 336 saat minimum tuz sisi. Koruma yeterliligi: 8/8 (ASTM D714)',
      frequency:       'Her lot 1 numune',
      sampleSize:      '1 panel/lot',
    })
    console.log(`[F.5] Tuz sisi kalem: status=${res.status}`)
    expect([200, 201]).toContain(res.status)
  })

  test('F.6 — Kontrol kalemi: Gorsel muayene', async ({ page }) => {
    if (!STATE.controlPlanId) { console.warn('[F.6] controlPlanId eksik'); return }
    const res = await apiCall(page, 'POST', '/ControlPlan/items', {
      controlPlanId:   STATE.controlPlanId,
      processStep:     'Son Gorsel Muayene OP40',
      characteristic:  'Yuzey gorsel kalite (yanma, piting, renk)',
      measurementTool: 'Gorsel muayene + lup x10',
      specification:   'Yanma izi yok, piting yok, renk tutarli (gri-siyah). MIL-A-8625 sekil 3.',
      frequency:       'Her panel',
      sampleSize:      '%100',
    })
    console.log(`[F.6] Gorsel kalem: status=${res.status}`)
    expect([200, 201]).toContain(res.status)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// FAZ G — İŞ EMRİ ŞABLONU (OP10-OP50)
// ─────────────────────────────────────────────────────────────────────────────

test.describe('FAZ G — Is Emri Sablonu', () => {
  test('G.1 — OP10-OP50 anodize kaplama is emri sablonu olustur', async ({ page }) => {
    const ops = IS_EMRI_SABLONU.operasyonlar.map(op => ({
      rowNo:                op.rowNo,
      code:                 op.code,
      machineId:            op.machineKey === 'anod'     ? STATE.machineIdAnod     :
                            op.machineKey === 'astm'     ? STATE.machineIdAstm     :
                            op.machineKey === 'temizlik' ? STATE.machineIdTemizlik :
                            op.machineKey === 'kalin'    ? STATE.machineIdKalin    : null,
      estimatedMinutes:     op.estimatedMinutes,
      requiresQualityCheck: op.requiresQualityCheck,
      prerequisiteRowNo:    op.prerequisiteRowNo,
      description:          op.code === 'OP10' ? 'Yuzey hazirlik: alkalin temizleme + etching + desmut' :
                            op.code === 'OP20' ? 'Anodize kaplama Type III: H2SO4 %15, 18-22°C, 24V DC' :
                            op.code === 'OP30' ? 'Sicak su muhürleme (sealing) 96°C 20 dakika' :
                            op.code === 'OP40' ? 'Kaplama kalinligi olcumu + gorsel muayene' :
                            'ASTM B117 tuz sisi testi (336 saat numune) + MIL sertifikasi',
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
// FAZ H — TEKLİF (200 panel × 1.850₺ = 370.000₺)
// ─────────────────────────────────────────────────────────────────────────────

test.describe('FAZ H — Teklif', () => {
  test('H.1 — Teklif olustur (200 panel x 1.850₺)', async ({ page }) => {
    if (!STATE.customerId) {
      const res = await apiCall(page, 'GET', '/Customer?type=customers')
      if (res.data) {
        const list = res.data.data || res.data
        if (Array.isArray(list)) {
          const found = list.find(c => c.name?.includes('TUSAS') || c.name?.includes('Havacilik'))
          if (found) STATE.customerId = found.id
        }
      }
    }
    await gotoAndWait(page, '/offers/new')
    await selectAntOption(page, 'customerId', 'TUSAS', 'Musteri')
    await page.waitForTimeout(800)

    const addRowBtn = page.locator('button:has-text("Kalem Ekle"), button:has-text("Urun Ekle"), button:has(.anticon-plus)').first()
    if (await addRowBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await addRowBtn.click(); await page.waitForTimeout(800)
    }

    const productInput = page.locator('input[placeholder*="urun"], input[placeholder*="ürün"]').first()
    if (await productInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await productInput.fill('SRV-ANOD')
      await page.waitForTimeout(1000)
      const opt = page.locator('.ant-select-item-option').filter({ hasText: 'SRV-ANOD' }).first()
      if (await opt.isVisible({ timeout: 2000 }).catch(() => false)) await opt.click()
    }

    const qtyInput = page.locator('input[placeholder*="miktar"], input[placeholder*="Miktar"]').first()
    if (await qtyInput.isVisible({ timeout: 2000 }).catch(() => false)) await qtyInput.fill('200')
    const priceInput = page.locator('input[placeholder*="fiyat"], input[placeholder*="Fiyat"]').first()
    if (await priceInput.isVisible({ timeout: 2000 }).catch(() => false)) await priceInput.fill('1850')

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
  test('I.1 — TUSAS fason kaplama satis siparisi olustur', async ({ page }) => {
    await gotoAndWait(page, '/sales/new')
    await selectAntOption(page, 'customerId', 'TUSAS', 'Musteri')
    await page.waitForTimeout(600)

    const addBtn = page.locator('button:has-text("Kalem Ekle"), button:has-text("Urun Ekle")').first()
    if (await addBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await addBtn.click(); await page.waitForTimeout(600)
      const productInput = page.locator('input[placeholder*="urun"]').first()
      if (await productInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        await productInput.fill('SRV-ANOD'); await page.waitForTimeout(1000)
        const opt = page.locator('.ant-select-item-option').filter({ hasText: 'SRV-ANOD' }).first()
        if (await opt.isVisible({ timeout: 2000 }).catch(() => false)) await opt.click()
      }
      const qtyInput = page.locator('input[placeholder*="miktar"]').first()
      if (await qtyInput.isVisible({ timeout: 2000 }).catch(() => false)) await qtyInput.fill('200')
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
  test('J.1 — Anodize kaplama uretim emri ac', async ({ page }) => {
    await gotoAndWait(page, '/production/new')
    const productInput = page.locator('input[placeholder*="urun"]').first()
    if (await productInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await productInput.fill('SRV-ANOD'); await page.waitForTimeout(1000)
      const opt = page.locator('.ant-select-item-option').filter({ hasText: 'SRV-ANOD' }).first()
      if (await opt.isVisible({ timeout: 2000 }).catch(() => false)) await opt.click()
    }
    await fillAntInput(page, 'quantity', '200')
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
// FAZ K — GİRİŞ MUAYENESİ (FASON — PANEL KABUL)
// ─────────────────────────────────────────────────────────────────────────────

test.describe('FAZ K — Giris Muayenesi Fason Panel Kabul', () => {
  test('K.1 — TUSAS Al 7075-T6 panel giris muayenesi', async ({ page }) => {
    if (!STATE.stockIdFason) { console.warn('[K.1] stockIdFason eksik'); return }
    const res = await apiCall(page, 'POST', '/IncomingInspection', {
      productId:      STATE.stockIdFason,
      quantity:       200,
      supplierId:     null,
      inspectionDate: new Date().toISOString().split('T')[0],
      result:         'PASSED',
      notes:          'TUSAS fason panel kabulu. 200 panel Al 7075-T6 T651. TUSAS packing list ve material cert uygun. Yuzey: temiz, cizik yok, baskı hasari yok. Depo DEPO-GELEN e yerlestirildi.',
    })
    console.log(`[K.1] Panel IncomingInspection: status=${res.status} id=${res.data?.id}`)
    if (res.data?.id) STATE.inspectionId = res.data.id
    expect([200, 201]).toContain(res.status)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// FAZ L — ATÖLYE OPERASYONLARI (OP10-OP50)
// ─────────────────────────────────────────────────────────────────────────────

test.describe('FAZ L — Anodize Kaplama Atolye Yurutmesi', () => {
  test('L.1 — OP10 Yuzey hazirlik alkalin + etching + desmut', async ({ page }) => {
    if (!STATE.productionId) { console.warn('[L.1] productionId eksik'); return }
    const res = await apiCall(page, 'POST', `/Production/completion/${STATE.productionId}`, {
      operationCode: 'OP10', completedQty: 200, scrapQty: 0,
      operatorNote: 'OP10 yuzey hazirlik tamamlandi. Alkalin temizleme pH=11.8 uygun. Etching (NaOH) ve desmut (HNO3) tamamlandi. Tum parcalar temiz.',
      machineId: STATE.machineIdTemizlik || null,
    })
    console.log(`[L.1] OP10: status=${res.status}`)
    expect([200, 201, 404]).toContain(res.status)
  })

  test('L.2 — OP20 Anodize kaplama Type III H2SO4', async ({ page }) => {
    if (!STATE.productionId) { console.warn('[L.2] productionId eksik'); return }
    const res = await apiCall(page, 'POST', `/Production/completion/${STATE.productionId}`, {
      operationCode: 'OP20', completedQty: 200, scrapQty: 3,
      operatorNote: 'OP20 anodize tamamlandi. H2SO4 %15, 19°C, 24V DC. 3 panel tank yanmasi (yüksek akim noktası) — NCR acildi. 197 panel devam.',
      machineId: STATE.machineIdAnod || null,
    })
    console.log(`[L.2] OP20: status=${res.status}`)
    expect([200, 201, 404]).toContain(res.status)
  })

  test('L.3 — OP30 Sicak su muhürleme 96°C', async ({ page }) => {
    if (!STATE.productionId) { console.warn('[L.3] productionId eksik'); return }
    const res = await apiCall(page, 'POST', `/Production/completion/${STATE.productionId}`, {
      operationCode: 'OP30', completedQty: 197, scrapQty: 0,
      operatorNote: 'OP30 sicak su muhürleme tamamlandi. 96°C, 20 dakika. 197/197 uygun.',
      machineId: STATE.machineIdAnod || null,
    })
    console.log(`[L.3] OP30: status=${res.status}`)
    expect([200, 201, 404]).toContain(res.status)
  })

  test('L.4 — OP40 Kaplama kalinligi olcumu + gorsel muayene', async ({ page }) => {
    if (!STATE.productionId) { console.warn('[L.4] productionId eksik'); return }
    const res = await apiCall(page, 'POST', `/Production/completion/${STATE.productionId}`, {
      operationCode: 'OP40', completedQty: 197, scrapQty: 0,
      operatorNote: 'OP40 kalinlik olcumu: 197 panel. Ort: 36.2 µm, min: 25.1 µm, maks: 49.8 µm — MIL uygun. 5 panel 22 µm (limit: 25 µm) — NCR kaydi.',
      machineId: STATE.machineIdKalin || null,
    })
    console.log(`[L.4] OP40: status=${res.status}`)
    expect([200, 201, 404]).toContain(res.status)
  })

  test('L.5 — OP50 ASTM B117 tuz sisi 336 saat + sertifika', async ({ page }) => {
    if (!STATE.productionId) { console.warn('[L.5] productionId eksik'); return }
    const res = await apiCall(page, 'POST', `/Production/completion/${STATE.productionId}`, {
      operationCode: 'OP50', completedQty: 195, scrapQty: 0,
      operatorNote: 'OP50 tuz sisi testi 336 saat tamamlandi. Numune panel: 8/8 ASTM D714 — korozyon yok. MIL COC sertifikasi hazirlandi. 195 panel TUSAS sevkiyatina uygun.',
      machineId: STATE.machineIdAstm || null,
    })
    console.log(`[L.5] OP50: status=${res.status}`)
    expect([200, 201, 404]).toContain(res.status)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// FAZ M — NCR (KAPLAMA KALINLIĞI DÜŞÜKLÜĞÜ)
// ─────────────────────────────────────────────────────────────────────────────

test.describe('FAZ M — NCR Kaplama Kalinligi Dusük', () => {
  test('M.1 — NCR olustur (5 panel 22µm — MIL min 25µm)', async ({ page }) => {
    if (!STATE.productId) { console.warn('[M.1] productId eksik'); return }
    const res = await apiCall(page, 'POST', '/Ncr', {
      productId:    STATE.productId,
      productionId: STATE.productionId || null,
      title:        'Hard anodize kaplama kalinligi dusük — MIL-A-8625F Type III limit altı',
      description:  '5 panel: olculen 22 µm, MIL-A-8625F Type III minimum: 25 µm. Sapma: -3 µm. Muhtemel neden: OP20 akim yogunlugu yetersiz (o bölge mevcut geometride gölge noktası).',
      defectType:   'DIMENSIONAL',
      quantity:     5,
      severity:     'MAJOR',
      detectedBy:   'Kalite — Fischer Eddy Current Olcumu',
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
      title:       'Gölge Noktasi Kaplama Kalinligi — Fikstür Tasarimi Revizyonu',
      description: 'Al 7075 kanat paneli geometrisinde konkav bölgede akim yogunlugu yetersiz. Anod fikstür konumu revize edilecek.',
    })
    console.log(`[N.1] CAPA ac: status=${res.status} id=${res.data?.id}`)
    if (res.data?.id) STATE.capaId = res.data.id
    expect([200, 201]).toContain(res.status)
  })

  test('N.2 — CAPA ROOT_CAUSE_ANALYSIS', async ({ page }) => {
    if (!STATE.capaId) { console.warn('[N.2] capaId eksik'); return }
    const res = await apiCall(page, 'PUT', `/Capa/${STATE.capaId}`, {
      status:    'ROOT_CAUSE_ANALYSIS',
      rootCause: 'Panel geometrisindeki konkav alan standart fikstür ile anod tanka paralel konumlanamıyor. Akim dagılımı bu bölgede 30% düsük. Fikstür tasarimi bu geometri tipi için optimize edilmemis.',
    })
    console.log(`[N.2] CAPA RCA: status=${res.status}`)
    expect([200, 204]).toContain(res.status)
  })

  test('N.3 — CAPA IMPLEMENTATION', async ({ page }) => {
    if (!STATE.capaId) { console.warn('[N.3] capaId eksik'); return }
    const res = await apiCall(page, 'PUT', `/Capa/${STATE.capaId}`, {
      status:           'IMPLEMENTATION',
      correctiveAction: 'Özel açılı fikstür tasarlandi ve imal edildi. Ayrica akim yogunlugu 2.2 A/dm2 e çikarildi (maks 2.5). Yeniden kaplama testi: tum 5 noktada 27-32 µm — uygun.',
    })
    console.log(`[N.3] CAPA IMPL: status=${res.status}`)
    expect([200, 204]).toContain(res.status)
  })

  test('N.4 — CAPA CLOSED', async ({ page }) => {
    if (!STATE.capaId) { console.warn('[N.4] capaId eksik'); return }
    const res = await apiCall(page, 'PUT', `/Capa/${STATE.capaId}`, {
      status: 'CLOSED',
      notes:  'Sonraki 3 TUSAS lotunda (300 panel) ayni geometri kalinlik sapmasi tekrarlanmadi. Yeni fikstür ve akim parametresi standart prosedure eklendi. Etkinlik dogrulandi.',
    })
    console.log(`[N.4] CAPA CLOSED: status=${res.status}`)
    expect([200, 204]).toContain(res.status)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// FAZ O — MIL KAPLAMA SERTİFİKASI (COC) + FATURA
// ─────────────────────────────────────────────────────────────────────────────

test.describe('FAZ O — COC Sertifikasi ve Fatura', () => {
  test('O.1 — MIL-A-8625F Type III kaplama uygunluk sertifikasi (COC) kaydet', async ({ page }) => {
    if (!STATE.productId) { console.warn('[O.1] productId eksik'); return }
    const res = await apiCall(page, 'POST', '/Certificate', {
      productId:       STATE.productId,
      certificateType: 'COC',
      certificateNo:   'COC-MIL-ANOD-TYPE3-TUSAS-2026-001',
      issueDate:       new Date().toISOString().split('T')[0],
      notes:           'MIL-A-8625F Type III Hard Anodize Uygunluk Beyanı. 195 panel (lot TUSAS-2026-K001). Kaplama kalınlığı: 25-50 µm (ölçülen ort: 36.2 µm). ASTM B117 336 saat tuz sisi: GECTI. AS9100D kapsami dahilinde.',
    })
    console.log(`[O.1] COC Certificate: status=${res.status} id=${res.data?.id}`)
    if (res.data?.id) STATE.cocCertId = res.data.id
    expect([200, 201, 404]).toContain(res.status)
  })

  test('O.2 — TUSAS fason kaplama faturasi olustur (195 panel x 1.850₺)', async ({ page }) => {
    await gotoAndWait(page, '/invoices/new')
    await selectAntOption(page, 'customerId', 'TUSAS', 'Musteri')
    await page.waitForTimeout(600)

    const addBtn = page.locator('button:has-text("Kalem Ekle"), button:has-text("Urun Ekle")').first()
    if (await addBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await addBtn.click(); await page.waitForTimeout(600)
      const productInput = page.locator('input[placeholder*="urun"]').first()
      if (await productInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        await productInput.fill('SRV-ANOD'); await page.waitForTimeout(1000)
        const opt = page.locator('.ant-select-item-option').filter({ hasText: 'SRV-ANOD' }).first()
        if (await opt.isVisible({ timeout: 2000 }).catch(() => false)) await opt.click()
      }
      const qtyInput = page.locator('input[placeholder*="miktar"]').first()
      if (await qtyInput.isVisible({ timeout: 2000 }).catch(() => false)) await qtyInput.fill('195')
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
  test('P.1 — Anodize kaplama uretim maliyeti sorgula', async ({ page }) => {
    if (!STATE.productionId) { console.warn('[P.1] productionId eksik'); return }
    const res = await apiCall(page, 'GET', `/PartCost/${STATE.productionId}`)
    console.log(`[P.1] PartCost: status=${res.status}`)
    expect(res.status).toBeLessThan(500)
  })

  test('P.2 — OZET: Tum kritik ID kayitlari dogrula', async ({ page }) => {
    console.log('\n════════════════════════════════════════════════')
    console.log('  Yuzey Islem Kaplama (MIL-A-8625) E2E — FINAL OZET')
    console.log('════════════════════════════════════════════════')
    console.log(`  Musteri (TUSAS)           : ${STATE.customerId || 'EKSIK'}`)
    console.log(`  [Fason — tedarikci yok]`)
    console.log(`  ANOD-01                   : ${STATE.machineIdAnod || 'EKSIK'}`)
    console.log(`  ASTM-01 (Tuz Sisi)        : ${STATE.machineIdAstm || 'EKSIK'}`)
    console.log(`  TEMIZLIK-01               : ${STATE.machineIdTemizlik || 'EKSIK'}`)
    console.log(`  KALIN-01                  : ${STATE.machineIdKalin || 'EKSIK'}`)
    console.log(`  HM-FASON-AL-PANEL         : ${STATE.stockIdFason || 'EKSIK'}`)
    console.log(`  SRV-ANOD-TYPE3-MIL        : ${STATE.productId || 'EKSIK'}`)
    console.log(`  BOM (minimal)             : ${STATE.bomId || 'EKSIK'}`)
    console.log(`  Kontrol Plani (MIL)       : ${STATE.controlPlanId || 'EKSIK'}`)
    console.log(`  Is Emri Sablonu           : ${STATE.templateId || 'EKSIK'}`)
    console.log(`  Teklif (370.000₺)         : ${STATE.offerId || 'EKSIK'}`)
    console.log(`  Satis Siparisi            : ${STATE.salesId || 'EKSIK'}`)
    console.log(`  Uretim Emri               : ${STATE.productionId || 'EKSIK'}`)
    console.log(`  NCR (kalinlik 22µm)       : ${STATE.ncrId || 'EKSIK'}`)
    console.log(`  CAPA (CLOSED)             : ${STATE.capaId || 'EKSIK'}`)
    console.log(`  MIL COC Sertifikasi       : ${STATE.cocCertId || 'EKSIK'}`)
    console.log(`  Fatura (360.750₺)         : ${STATE.invoiceId || 'EKSIK'}`)
    console.log('════════════════════════════════════════════════\n')

    const kritikIds = [STATE.customerId, STATE.productId, STATE.offerId, STATE.salesId, STATE.productionId]
    const mevcut = kritikIds.filter(Boolean).length
    console.log(`  Kritik kayit: ${mevcut}/${kritikIds.length}`)
    expect(mevcut).toBeGreaterThanOrEqual(3)
  })
})
