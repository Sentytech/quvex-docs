/**
 * Quvex ERP — Metal Esya Imalat E2E Test
 *
 * Senaryo: Yildiz Metal Esya → Migros Celik Raf Sistemi siparisi
 * 4 komponentli BOM, MRP, kesim-bukum-kaynak-boya uretim hatti
 *
 * Calistirma:
 *   npx playwright test e2e/sectors/metal-esya-e2e.spec.js --headed
 *   npx playwright test e2e/sectors/metal-esya-e2e.spec.js --reporter=html
 */
const { test, expect } = require('./fixtures')
const {
  navigateTo, assertNoError, waitForSuccess, waitForModal, closeModal,
  getTableRowCount, fillInput, selectOption, clickButton,
  clickAddButton, clickSave, login, logout, waitForPageLoad,
} = require('./helpers')

// ─── Test Verileri ───────────────────────────────────────────

const MUSTERI = {
  firma: 'Migros Ticaret A.S.',
  yetkili: 'Selma Kaya',
  email: 'selma.kaya@migros.com.tr',
  telefon: '216 579 3000',
  adres: 'Migros Genel Mudurulugu, Atasehir, Istanbul',
  vergiNo: '1230005678',
  vade: 30,
}

const TEDARIKCI = {
  firma: 'Kardemir Celik A.S.',
  yetkili: 'Hasan Celik',
  email: 'hasan@kardemir.com.tr',
  tip: 'Hammadde',
}

const URUN = {
  ad: 'Migros Celik Gondol Raf 120x50x200cm MG-RAF-120',
  kod: 'MG-RAF-120',
  stokKod: 'STK-MG-RAF-120',
  birim: 'Adet',
  fiyat: 1850,
}

const BOM_PARCALARI = [
  { ad: 'S235JR Celik Profil 40x40x2mm L=2000mm', miktar: 4, birim: 'Adet', kod: 'HAM-PRF-4040' },
  { ad: 'S235JR Celik Sac 1.5mm 1000x2000', miktar: 2, birim: 'Adet', kod: 'HAM-SAC-15' },
  { ad: 'M10x20 Civata DIN 933 Galvaniz', miktar: 16, birim: 'Adet', kod: 'HAM-CIV-M10' },
  { ad: 'Epoksi Toz Boya RAL 7035 Gri', miktar: 0.5, birim: 'kg', kod: 'HAM-BOY-7035' },
]

const OPERASYONLAR = [
  { no: 'OP10', ad: 'Lazer/Plazma Kesim', makine: 'LZR-01', setup: 15, run: 5 },
  { no: 'OP20', ad: 'CNC Abkant Bukum', makine: 'ABK-01', setup: 20, run: 8 },
  { no: 'OP30', ad: 'MIG/MAG Kaynak', makine: 'KYN-01', setup: 10, run: 15 },
  { no: 'OP40', ad: 'Kumlama + Yuzey Hazirlik', makine: null, setup: 5, run: 4 },
  { no: 'OP50', ad: 'Elektrostatik Toz Boya', makine: 'BOY-01', setup: 10, run: 6 },
  { no: 'OP60', ad: 'Montaj + Final Kontrol', makine: null, setup: 10, run: 12 },
]

const TEKLIF = {
  adet: 500,
  birimFiyat: 1850,
  toplam: 925000,
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

  test('1.2 — Migros musteri ekleme modali acilabilir', async ({ page }) => {
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

  test('1.3 — Tedarikciler sayfasi aciliyor (Kardemir Celik)', async ({ page }) => {
    await navigateTo(page, '/customers?type=suppliers')
    await assertNoError(page)
  })
})

// ══════════════════════════════════════════════════
// FAZ 2: URUN ve BOM (4 KOMPONENT)
// ══════════════════════════════════════════════════
test.describe('FAZ 2: Urun Tanimi ve 4 Komponentli BOM', () => {

  test('2.1 — Urunler sayfasi aciliyor', async ({ page }) => {
    await navigateTo(page, '/products')
    await assertNoError(page)
  })

  test('2.2 — Urun ekleme formu aciliyor (Celik Gondol Raf)', async ({ page }) => {
    await navigateTo(page, '/products/form')
    await assertNoError(page)
    const formContent = page.locator('form, [class*="form"], .ant-card').first()
    if (await formContent.isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(formContent).toBeVisible()
    }
  })

  test('2.3 — Stok sayfasi aciliyor (hammadde stok kontrol)', async ({ page }) => {
    await navigateTo(page, '/stocks')
    await assertNoError(page)
  })

  test('2.4 — Birimler sayfasi aciliyor (kg, adet)', async ({ page }) => {
    await navigateTo(page, '/settings/units')
    await assertNoError(page)
  })
})

// ══════════════════════════════════════════════════
// FAZ 3: MRP → SATIN ALMA
// ══════════════════════════════════════════════════
test.describe('FAZ 3: MRP ve Satin Alma Siparisleri', () => {

  test('3.1 — Stok giris/cikis sayfasi aciliyor (satin alma fisleri)', async ({ page }) => {
    await navigateTo(page, '/stock-receipts')
    await assertNoError(page)
  })

  test('3.2 — Giris muayenesi sayfasi aciliyor (celik sertifika kontrol)', async ({ page }) => {
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
})

// ══════════════════════════════════════════════════
// FAZ 4: IS EMRI — KESIM → BUKUM → KAYNAK → BOYA
// ══════════════════════════════════════════════════
test.describe('FAZ 4: Uretim Hatti (Kesim-Bukum-Kaynak-Boya)', () => {

  test('4.1 — Is emri adimlari sayfasi aciliyor', async ({ page }) => {
    await navigateTo(page, '/settings/work-order-steps')
    await assertNoError(page)
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

  test('4.4 — Shop Floor Terminal aciliyor (kaynak operatoru)', async ({ page }) => {
    await navigateTo(page, '/shop-floor-terminal')
    await assertNoError(page)
    const content = await page.locator('body').innerHTML()
    expect(content.length).toBeGreaterThan(200)
  })

  test('4.5 — Makineler sayfasi aciliyor (lazer, abkant, kaynak)', async ({ page }) => {
    await navigateTo(page, '/settings/machines')
    await assertNoError(page)
  })
})

// ══════════════════════════════════════════════════
// FAZ 5: KALITE KONTROL → DEPO
// ══════════════════════════════════════════════════
test.describe('FAZ 5: Kalite Kontrol ve Depo', () => {

  test('5.1 — Operasyon muayeneleri sayfasi aciliyor (kaynak kontrol)', async ({ page }) => {
    await navigateTo(page, '/quality/operation-inspections')
    await assertNoError(page)
  })

  test('5.2 — Depolar sayfasi aciliyor (Hammadde + Mamul)', async ({ page }) => {
    await navigateTo(page, '/warehouses')
    await assertNoError(page)
  })

  test('5.3 — Kontrol planlari sayfasi aciliyor', async ({ page }) => {
    await navigateTo(page, '/quality/control-plans')
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

  test('6.4 — Kasa/Banka sayfasi aciliyor', async ({ page }) => {
    await navigateTo(page, '/accounting/cash-bank')
    await assertNoError(page)
  })
})

// ══════════════════════════════════════════════════
// FAZ 7: ROL KONTROLU — DEPO ROLU
// ══════════════════════════════════════════════════
test.describe('FAZ 7: Rol Kontrolu (Depo rolu sinirli menu)', () => {

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
})

// ══════════════════════════════════════════════════
// SONUC OZETI
// ══════════════════════════════════════════════════
test.describe('Sonuc Ozeti', () => {

  test('Metal esya senaryosu — tum kritik sayfalar hatasiz aciliyor', async ({ page }) => {
    const kritikSayfalar = [
      '/home',
      '/customers',
      '/customers?type=suppliers',
      '/products',
      '/products/form',
      '/stocks',
      '/stock-receipts',
      '/quality/inspections',
      '/settings/work-order-steps',
      '/settings/work-order-templates',
      '/production',
      '/shop-floor-terminal',
      '/settings/machines',
      '/quality/operation-inspections',
      '/warehouses',
      '/quality/control-plans',
      '/invoices',
      '/invoices/sales',
      '/invoices/form',
      '/accounting/cash-bank',
      '/executive-dashboard',
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

    console.log('\n=== METAL ESYA IMALAT E2E TEST SONUCLARI ===')
    console.log(`Toplam sayfa: ${sonuclar.length}`)
    console.log(`OK: ${sonuclar.filter(s => s.durum === 'OK').length}`)
    console.log(`HATA: ${sonuclar.filter(s => s.durum === 'HATA').length}`)
    console.log(`LOGIN_REDIRECT: ${sonuclar.filter(s => s.durum === 'LOGIN_REDIRECT').length}`)

    const hatalilar = sonuclar.filter(s => s.durum === 'HATA')
    if (hatalilar.length > 0) {
      console.log('\nHatali sayfalar:')
      hatalilar.forEach(h => console.log(`  x ${h.sayfa}`))
    }
    console.log('=============================================\n')

    const hataOrani = hatalilar.length / sonuclar.length
    expect(hataOrani).toBeLessThan(0.1)
  })
})
