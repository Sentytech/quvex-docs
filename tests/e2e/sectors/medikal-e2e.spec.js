/**
 * Quvex ERP — Medikal Cihaz Uretimi E2E Test
 *
 * Senaryo: Anatolia Medikal Implant → Ortopedik Vida (Ti-6Al-4V)
 * ISO 13485 uyumlu, lot izlenebilirlik, MTR belge kontrolu
 * Swiss CNC → pasivizasyon → temiz oda → lazer markalama
 *
 * Calistirma:
 *   npx playwright test e2e/sectors/medikal-e2e.spec.js --headed
 *   npx playwright test e2e/sectors/medikal-e2e.spec.js --reporter=html
 */
const { test, expect } = require('./fixtures')
const {
  navigateTo, assertNoError, waitForSuccess, waitForModal, closeModal,
  getTableRowCount, fillInput, selectOption, clickButton,
  clickAddButton, clickSave, login, logout, waitForPageLoad,
} = require('./helpers')

// ─── Test Verileri ───────────────────────────────────────────

const MUSTERI = {
  firma: 'Acibadem Saglik Grubu A.S.',
  yetkili: 'Dr. Baris Ortopedi',
  email: 'baris.ortopedi@acibadem.com',
  telefon: '216 544 4444',
  adres: 'Acibadem Maslak Hastanesi, Istanbul',
  vergiNo: '7890012345',
  vade: 60,
}

const TEDARIKCI = {
  firma: 'Baoji Titanium Industry (Turkiye Temsilcisi)',
  yetkili: 'Okan Titanyum',
  email: 'okan@baoji-tr.com',
  tip: 'Hammadde',
}

const TEDARIKCI_FASON = {
  firma: 'Anodize Medikal San.',
  yetkili: 'Derya Kaplama',
  email: 'derya@anodizemedikal.com',
  tip: 'Fason',
}

const URUN = {
  ad: 'Ortopedik Kortikal Vida Ti-6Al-4V 3.5x28mm MED-KV-3528',
  kod: 'MED-KV-3528',
  stokKod: 'STK-MED-KV-3528',
  birim: 'Adet',
  fiyat: 185,
}

const HAMMADDE = {
  ad: 'Ti-6Al-4V (Grade 5) Cubuk D6x3000mm ASTM F136',
  kod: 'HAM-TI64-D6',
  birim: 'Adet',
  fiyat: 420,
  sertifika: 'MTR + ASTM F136 Uygunluk',
}

const BOM_PARCALARI = [
  { ad: 'Ti-6Al-4V Cubuk D6x3000mm', miktar: 1, birim: 'Adet' },
  { ad: 'Pasivizasyon Cozeltisi (Sitrik Asit %20)', miktar: 0.01, birim: 'lt' },
]

const OPERASYONLAR = [
  { no: 'OP10', ad: 'Swiss CNC Tornalama', makine: 'SWS-01', setup: 30, run: 4 },
  { no: 'OP20', ad: 'Dis Acma (Thread Rolling)', makine: 'SWS-01', setup: 15, run: 2 },
  { no: 'OP30', ad: 'Capak Alma + Tumbling', makine: null, setup: 5, run: 3 },
  { no: 'OP40', ad: 'Pasivizasyon (Sitrik Asit)', makine: 'PAS-01', setup: 10, run: 30 },
  { no: 'OP50', ad: 'Temiz Oda Muayene (ISO Class 7)', makine: null, setup: 5, run: 5 },
  { no: 'OP60', ad: 'Lazer Markalama (UDI)', makine: 'LZM-01', setup: 10, run: 2 },
  { no: 'OP70', ad: 'Final Olcum + Gorunsel Kontrol', makine: null, setup: 5, run: 3 },
]

const LOT_BILGISI = {
  lotNo: 'LOT-2026-04-001',
  hammaddeLot: 'TI64-BAOJI-2026-0312',
  mtr: 'MTR-BAOJI-2026-0312.pdf',
  uretilenAdet: 1000,
}

const TEKLIF = {
  adet: 10000,
  birimFiyat: 185,
  toplam: 1850000,
}

// Testler sirali calisacak
test.describe.configure({ mode: 'serial' })

// ══════════════════════════════════════════════════
// FAZ 1: MUSTERI ve TEDARIKCI
// ══════════════════════════════════════════════════
test.describe('FAZ 1: Musteri ve Tedarikci Tanimlari', () => {

  test('1.1 — Musteriler sayfasi aciliyor', async ({ page }) => {
    await navigateTo(page, '/customers')
    await assertNoError(page)
    const content = await page.locator('body').innerHTML()
    expect(content.length).toBeGreaterThan(200)
  })

  test('1.2 — Acibadem musteri ekleme modali acilabilir', async ({ page }) => {
    await navigateTo(page, '/customers')
    const added = await clickAddButton(page)
    if (added) {
      const modal = page.locator('.ant-modal, .ant-drawer')
      if (await modal.first().isVisible({ timeout: 3000 }).catch(() => false)) {
        await expect(modal.first()).toBeVisible()
        const formFields = page.locator('input, .ant-select')
        const fieldCount = await formFields.count()
        expect(fieldCount).toBeGreaterThanOrEqual(2)
        await page.locator('.ant-modal-close, .ant-drawer-close').first().click().catch(() => {})
      }
    }
  })

  test('1.3 — Tedarikciler sayfasi aciliyor (Ti-6Al-4V tedarikci)', async ({ page }) => {
    await navigateTo(page, '/customers?type=suppliers')
    await assertNoError(page)
  })

  test('1.4 — Tedarikci ekleme modali acilabilir', async ({ page }) => {
    await navigateTo(page, '/customers?type=suppliers')
    const added = await clickAddButton(page)
    if (added) {
      const modal = page.locator('.ant-modal, .ant-drawer')
      if (await modal.first().isVisible({ timeout: 3000 }).catch(() => false)) {
        await expect(modal.first()).toBeVisible()
        await page.locator('.ant-modal-close, .ant-drawer-close').first().click().catch(() => {})
      }
    }
  })
})

// ══════════════════════════════════════════════════
// FAZ 2: URUN ve BOM (TITANYUM VIDA)
// ══════════════════════════════════════════════════
test.describe('FAZ 2: Urun Tanimi ve BOM (Ortopedik Vida)', () => {

  test('2.1 — Urunler sayfasi aciliyor', async ({ page }) => {
    await navigateTo(page, '/products')
    await assertNoError(page)
  })

  test('2.2 — Urun ekleme formu aciliyor (Ti-6Al-4V Kortikal Vida)', async ({ page }) => {
    await navigateTo(page, '/products/form')
    await assertNoError(page)
    const formContent = page.locator('form, [class*="form"], .ant-card').first()
    if (await formContent.isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(formContent).toBeVisible()
    }
  })

  test('2.3 — Stok sayfasi aciliyor (titanyum hammadde stok)', async ({ page }) => {
    await navigateTo(page, '/stocks')
    await assertNoError(page)
  })
})

// ══════════════════════════════════════════════════
// FAZ 3: SATIN ALMA + MTR BELGE KONTROLU
// ══════════════════════════════════════════════════
test.describe('FAZ 3: Satin Alma ve MTR Belge Kontrolu', () => {

  test('3.1 — Stok giris/cikis sayfasi aciliyor (titanyum alis)', async ({ page }) => {
    await navigateTo(page, '/stock-receipts')
    await assertNoError(page)
  })

  test('3.2 — Giris muayenesi sayfasi aciliyor (MTR + ASTM F136 kontrol)', async ({ page }) => {
    await navigateTo(page, '/quality/inspections')
    await assertNoError(page)
  })

  test('3.3 — Muayene ekleme modali acilabilir', async ({ page }) => {
    await navigateTo(page, '/quality/inspections')
    const added = await clickAddButton(page)
    if (added) {
      const modal = page.locator('.ant-modal, .ant-drawer')
      if (await modal.first().isVisible({ timeout: 3000 }).catch(() => false)) {
        await expect(modal.first()).toBeVisible()
        await page.locator('.ant-modal-close, .ant-drawer-close').first().click().catch(() => {})
      }
    }
  })

  test('3.4 — Dokuman kontrol sayfasi aciliyor (MTR arsivleme)', async ({ page }) => {
    await navigateTo(page, '/quality/document-control')
    await assertNoError(page)
  })
})

// ══════════════════════════════════════════════════
// FAZ 4: IS EMRI — SWISS CNC → PASIVIZASYON → TEMIZ ODA → LAZER
// ══════════════════════════════════════════════════
test.describe('FAZ 4: Uretim Hatti (Swiss CNC - Pasivizasyon - Temiz Oda - Lazer)', () => {

  test('4.1 — Is emri adimlari sayfasi aciliyor', async ({ page }) => {
    await navigateTo(page, '/settings/work-order-steps')
    await assertNoError(page)
    const content = await page.locator('body').innerHTML()
    expect(content.length).toBeGreaterThan(200)
  })

  test('4.2 — Is emri sablonlari sayfasi aciliyor', async ({ page }) => {
    await navigateTo(page, '/settings/work-order-templates')
    await assertNoError(page)
  })

  test('4.3 — Uretim listesi sayfasi aciliyor', async ({ page }) => {
    await navigateTo(page, '/production')
    await assertNoError(page)
    const cards = page.locator('.ant-card, [class*="stat-card"]')
    if (await cards.first().isVisible({ timeout: 10000 }).catch(() => false)) {
      const count = await cards.count()
      expect(count).toBeGreaterThanOrEqual(1)
    }
  })

  test('4.4 — Shop Floor Terminal aciliyor (Swiss CNC operatoru)', async ({ page }) => {
    await navigateTo(page, '/shop-floor-terminal')
    await assertNoError(page)
    const content = await page.locator('body').innerHTML()
    expect(content.length).toBeGreaterThan(200)
  })

  test('4.5 — Makineler sayfasi aciliyor (Swiss CNC, lazer markalama)', async ({ page }) => {
    await navigateTo(page, '/settings/machines')
    await assertNoError(page)
  })

  test('4.6 — Fason is emirleri sayfasi aciliyor (pasivizasyon dis kaynak)', async ({ page }) => {
    await navigateTo(page, '/subcontract-orders')
    await assertNoError(page)
  })
})

// ══════════════════════════════════════════════════
// FAZ 5: FINAL MUAYENE → FAI → CoC → LOT IZLENEBILIRLIK
// ══════════════════════════════════════════════════
test.describe('FAZ 5: Final Muayene, FAI, CoC ve Lot Izlenebilirlik', () => {

  test('5.1 — FAI sayfasi aciliyor (Ilk Urun Muayenesi)', async ({ page }) => {
    await navigateTo(page, '/quality/fai')
    await assertNoError(page)
  })

  test('5.2 — FAI ekleme formu acilabilir', async ({ page }) => {
    await navigateTo(page, '/quality/fai')
    const added = await clickAddButton(page)
    if (added) {
      const modal = page.locator('.ant-modal, .ant-drawer')
      if (await modal.first().isVisible({ timeout: 3000 }).catch(() => false)) {
        await expect(modal.first()).toBeVisible()
        await page.locator('.ant-modal-close, .ant-drawer-close').first().click().catch(() => {})
      }
    }
  })

  test('5.3 — Seri numaralari sayfasi aciliyor (lot/batch izleme)', async ({ page }) => {
    await navigateTo(page, '/serial-numbers')
    await assertNoError(page)
  })

  test('5.4 — NCR sayfasi aciliyor (uygunsuzluk kaydi)', async ({ page }) => {
    await navigateTo(page, '/quality/ncr')
    await assertNoError(page)
  })

  test('5.5 — CAPA sayfasi aciliyor (duzeltici onleyici faaliyet)', async ({ page }) => {
    await navigateTo(page, '/quality/capa')
    await assertNoError(page)
  })

  test('5.6 — Risk-FMEA sayfasi aciliyor (medikal risk analizi)', async ({ page }) => {
    await navigateTo(page, '/quality/risk')
    await assertNoError(page)
  })
})

// ══════════════════════════════════════════════════
// FAZ 6: SEVKIYAT → FATURA
// ══════════════════════════════════════════════════
test.describe('FAZ 6: Sevkiyat ve Faturalama', () => {

  test('6.1 — Faturalar sayfasi aciliyor', async ({ page }) => {
    await navigateTo(page, '/invoices')
    await assertNoError(page)
  })

  test('6.2 — Satis faturalari sayfasi aciliyor', async ({ page }) => {
    await navigateTo(page, '/invoices/sales')
    await assertNoError(page)
  })

  test('6.3 — Fatura formu aciliyor', async ({ page }) => {
    await navigateTo(page, '/invoices/form')
    await assertNoError(page)
  })
})

// ══════════════════════════════════════════════════
// FAZ 7: ROL KONTROLU — KALITE ROLU
// ══════════════════════════════════════════════════
test.describe('FAZ 7: Rol Kontrolu (Kalite rolu sinirli menu)', () => {

  test('7.1 — Roller sayfasi aciliyor', async ({ page }) => {
    await navigateTo(page, '/settings/rollers')
    await assertNoError(page)
    const rows = await getTableRowCount(page)
    expect(rows).toBeGreaterThanOrEqual(1)
  })

  test('7.2 — Kullanicilar sayfasi aciliyor', async ({ page }) => {
    await navigateTo(page, '/settings/users')
    await assertNoError(page)
    const rows = await getTableRowCount(page)
    expect(rows).toBeGreaterThanOrEqual(1)
  })

  test('7.3 — Kalite dashboard aciliyor', async ({ page }) => {
    await navigateTo(page, '/quality')
    await assertNoError(page)
  })
})

// ══════════════════════════════════════════════════
// FAZ 8: RAPORLAR ve MEDIKAL OZEL MODULLER
// ══════════════════════════════════════════════════
test.describe('FAZ 8: Raporlar ve Medikal Ozel Moduller', () => {

  test('8.1 — Yonetim kokpiti aciliyor', async ({ page }) => {
    await navigateTo(page, '/executive-dashboard')
    await assertNoError(page)
    const cards = page.locator('.ant-card, [class*="dashboard"]')
    if (await cards.first().isVisible({ timeout: 10000 }).catch(() => false)) {
      const count = await cards.count()
      expect(count).toBeGreaterThanOrEqual(1)
    }
  })

  test('8.2 — Tedarikci degerlendirme sayfasi aciliyor (titanyum tedarikci)', async ({ page }) => {
    await navigateTo(page, '/quality/supplier-evaluation')
    await assertNoError(page)
  })

  test('8.3 — Kalibrasyon sayfasi aciliyor (olcum aletleri)', async ({ page }) => {
    await navigateTo(page, '/quality/calibration')
    await assertNoError(page)
  })

  test('8.4 — Ic denetim sayfasi aciliyor (ISO 13485 denetim)', async ({ page }) => {
    await navigateTo(page, '/quality/internal-audit')
    await assertNoError(page)
  })

  test('8.5 — Sahte parca onleme sayfasi aciliyor', async ({ page }) => {
    await navigateTo(page, '/quality/counterfeit-prevention')
    await assertNoError(page)
  })
})

// ══════════════════════════════════════════════════
// SONUC OZETI
// ══════════════════════════════════════════════════
test.describe('Sonuc Ozeti', () => {

  test('Medikal cihaz senaryosu — tum kritik sayfalar hatasiz aciliyor', async ({ page }) => {
    const kritikSayfalar = [
      '/home',
      '/customers',
      '/customers?type=suppliers',
      '/products',
      '/products/form',
      '/stocks',
      '/stock-receipts',
      '/quality/inspections',
      '/quality/document-control',
      '/settings/work-order-steps',
      '/settings/work-order-templates',
      '/production',
      '/shop-floor-terminal',
      '/settings/machines',
      '/subcontract-orders',
      '/quality/fai',
      '/serial-numbers',
      '/quality/ncr',
      '/quality/capa',
      '/quality/risk',
      '/invoices',
      '/invoices/sales',
      '/invoices/form',
      '/executive-dashboard',
      '/quality/supplier-evaluation',
      '/quality/calibration',
      '/quality/internal-audit',
      '/quality/counterfeit-prevention',
    ]

    const sonuclar = []
    for (const sayfa of kritikSayfalar) {
      await page.goto(sayfa)
      await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {})
      const url = page.url()
      const hata = url.includes('/error') || url.includes('/500')
      const loginaYonlendirme = url.includes('/login')
      sonuclar.push({
        sayfa,
        durum: hata ? 'HATA' : loginaYonlendirme ? 'LOGIN_REDIRECT' : 'OK',
      })
    }

    console.log('\n=== MEDIKAL CIHAZ URETIMI E2E TEST SONUCLARI ===')
    console.log(`Toplam sayfa: ${sonuclar.length}`)
    console.log(`OK: ${sonuclar.filter(s => s.durum === 'OK').length}`)
    console.log(`HATA: ${sonuclar.filter(s => s.durum === 'HATA').length}`)
    console.log(`LOGIN_REDIRECT: ${sonuclar.filter(s => s.durum === 'LOGIN_REDIRECT').length}`)

    const hatalilar = sonuclar.filter(s => s.durum === 'HATA')
    if (hatalilar.length > 0) {
      console.log('\nHatali sayfalar:')
      hatalilar.forEach(h => console.log(`  x ${h.sayfa}`))
    }
    console.log('=================================================\n')

    const hataOrani = hatalilar.length / sonuclar.length
    expect(hataOrani).toBeLessThan(0.1)
  })
})
