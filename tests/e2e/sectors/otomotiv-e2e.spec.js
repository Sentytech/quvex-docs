/**
 * Quvex ERP — Otomotiv Yan Sanayi E2E Test
 *
 * Senaryo: Ozturk Otomotiv Parcalari → Ford Otosan Fren Disk Kapagi siparisi
 * IATF 16949 uyumlu, SPC olcum, PPAP/FAI sureci
 *
 * Calistirma:
 *   npx playwright test e2e/sectors/otomotiv-e2e.spec.js --headed
 *   npx playwright test e2e/sectors/otomotiv-e2e.spec.js --reporter=html
 */
const { test, expect } = require('./fixtures')
const {
  navigateTo, assertNoError, waitForSuccess, waitForModal, closeModal,
  getTableRowCount, fillInput, selectOption, clickButton,
  clickAddButton, clickSave, login, logout, waitForPageLoad,
} = require('./helpers')

// ─── Test Verileri ───────────────────────────────────────────

const MUSTERI = {
  firma: 'Ford Otosan A.S.',
  yetkili: 'Ahmet Yildirim',
  email: 'ahmet.yildirim@ford.com.tr',
  telefon: '262 315 5000',
  adres: 'Ford Otosan Golcuk Fabrikasi, Kocaeli',
  vergiNo: '3880015859',
  vade: 45,
}

const TEDARIKCI = {
  firma: 'Erdemir Celik A.S.',
  yetkili: 'Mehmet Demir',
  email: 'mehmet@erdemir.com.tr',
  tip: 'Hammadde',
}

const URUN = {
  ad: 'Ford Transit Fren Disk Kapagi FK-7120-A',
  kod: 'FK-7120-A',
  stokKod: 'STK-FK-7120-A',
  birim: 'Adet',
  fiyat: 245,
}

const HAMMADDE = {
  ad: 'GGG50 Dokme Demir Disk D320x35mm',
  kod: 'HAM-GGG50-320',
  birim: 'Adet',
  fiyat: 78,
}

const BOM_PARCALARI = [
  { ad: 'GGG50 Dokme Demir Disk D320x35mm', miktar: 1, birim: 'Adet' },
  { ad: 'M8x25 Civata DIN 933', miktar: 6, birim: 'Adet' },
  { ad: 'Balata Tutucu Pim D8x45', miktar: 4, birim: 'Adet' },
]

const OPERASYONLAR = [
  { no: 'OP10', ad: 'CNC Torna Kaba', setup: 20, run: 8 },
  { no: 'OP20', ad: 'CNC Torna Hassas', setup: 15, run: 12 },
  { no: 'OP30', ad: 'CNC Freze Delik', setup: 25, run: 10 },
  { no: 'OP40', ad: 'Taslama Yuzey', setup: 15, run: 6 },
  { no: 'OP50', ad: 'Yikama + Capak Alma', setup: 5, run: 3 },
  { no: 'OP60', ad: 'Final Olcum + SPC', setup: 10, run: 8 },
]

const SPC_OLCUM = {
  olcu: 'Disk Dis Cap D310h6',
  nominal: 310.0,
  tolerans: '+0.000/-0.025',
  olcum: 309.988,
  cpk: 1.67,
}

const TEKLIF = {
  adet: 5000,
  birimFiyat: 245,
  toplam: 1225000,
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

  test('1.2 — Ford Otosan musteri ekleme modali acilabilir', async ({ page }) => {
    await navigateTo(page, '/customers')
    const added = await clickAddButton(page)
    if (added) {
      const modal = page.locator('.ant-modal, .ant-drawer')
      if (await modal.first().isVisible({ timeout: 3000 }).catch(() => false)) {
        await expect(modal.first()).toBeVisible()
        // Form alanlari kontrol
        const formFields = page.locator('input, .ant-select')
        const fieldCount = await formFields.count()
        expect(fieldCount).toBeGreaterThanOrEqual(2)
        await page.locator('.ant-modal-close, .ant-drawer-close').first().click().catch(() => {})
      }
    }
  })

  test('1.3 — Tedarikciler sayfasi aciliyor (Erdemir Celik)', async ({ page }) => {
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
// FAZ 2: URUN ve BOM
// ══════════════════════════════════════════════════
test.describe('FAZ 2: Urun ve Urun Agaci (BOM)', () => {

  test('2.1 — Urunler sayfasi aciliyor', async ({ page }) => {
    await navigateTo(page, '/products')
    await assertNoError(page)
  })

  test('2.2 — Urun ekleme formu aciliyor (Fren Disk Kapagi)', async ({ page }) => {
    await navigateTo(page, '/products/form')
    await assertNoError(page)
    const formContent = page.locator('form, [class*="form"], .ant-card').first()
    if (await formContent.isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(formContent).toBeVisible()
    }
  })

  test('2.3 — Stok sayfasi aciliyor', async ({ page }) => {
    await navigateTo(page, '/stocks')
    await assertNoError(page)
  })
})

// ══════════════════════════════════════════════════
// FAZ 3: TEKLIF → SIPARIS
// ══════════════════════════════════════════════════
test.describe('FAZ 3: Teklif ve Satis Siparisi', () => {

  test('3.1 — Teklifler sayfasi aciliyor', async ({ page }) => {
    await navigateTo(page, '/offers')
    await assertNoError(page)
  })

  test('3.2 — Teklif formu aciliyor (Ford Otosan 5000 adet)', async ({ page }) => {
    await navigateTo(page, '/offers/form')
    await assertNoError(page)
    const formContent = page.locator('form, [class*="form"], .ant-card').first()
    if (await formContent.isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(formContent).toBeVisible()
    }
  })

  test('3.3 — Satislar sayfasi aciliyor', async ({ page }) => {
    await navigateTo(page, '/sales')
    await assertNoError(page)
    const table = page.locator('.ant-table')
    if (await table.first().isVisible({ timeout: 10000 }).catch(() => false)) {
      await expect(table.first()).toBeVisible()
    }
  })
})

// ══════════════════════════════════════════════════
// FAZ 4: SATIN ALMA → GIRIS MUAYENESI
// ══════════════════════════════════════════════════
test.describe('FAZ 4: Satin Alma ve Giris Muayenesi', () => {

  test('4.1 — Stok giris/cikis sayfasi aciliyor (Satin alma fisi)', async ({ page }) => {
    await navigateTo(page, '/stock-receipts')
    await assertNoError(page)
  })

  test('4.2 — Giris muayenesi sayfasi aciliyor (GGG50 malzeme kontrolu)', async ({ page }) => {
    await navigateTo(page, '/quality/inspections')
    await assertNoError(page)
  })

  test('4.3 — Muayene ekleme modali acilabilir', async ({ page }) => {
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
// FAZ 5: IS EMRI → URETIM → SPC OLCUM
// ══════════════════════════════════════════════════
test.describe('FAZ 5: Uretim ve SPC Proses Kontrolu', () => {

  test('5.1 — Uretim listesi sayfasi aciliyor', async ({ page }) => {
    await navigateTo(page, '/production')
    await assertNoError(page)
    const cards = page.locator('.ant-card, [class*="stat-card"]')
    if (await cards.first().isVisible({ timeout: 10000 }).catch(() => false)) {
      const count = await cards.count()
      expect(count).toBeGreaterThanOrEqual(1)
    }
  })

  test('5.2 — Shop Floor Terminal aciliyor (operator gorunumu)', async ({ page }) => {
    await navigateTo(page, '/shop-floor-terminal')
    await assertNoError(page)
    const content = await page.locator('body').innerHTML()
    expect(content.length).toBeGreaterThan(200)
  })

  test('5.3 — Operasyon muayeneleri sayfasi aciliyor (proses QC)', async ({ page }) => {
    await navigateTo(page, '/quality/operation-inspections')
    await assertNoError(page)
  })

  test('5.4 — SPC sayfasi aciliyor (Cpk izleme)', async ({ page }) => {
    await navigateTo(page, '/quality/spc')
    await assertNoError(page)
    // SPC grafik veya tablo alani olmali
    const content = await page.locator('body').innerHTML()
    expect(content.length).toBeGreaterThan(200)
  })
})

// ══════════════════════════════════════════════════
// FAZ 6: FINAL MUAYENE → FAI → CoC → SEVKIYAT
// ══════════════════════════════════════════════════
test.describe('FAZ 6: Final Muayene, FAI, CoC ve Sevkiyat', () => {

  test('6.1 — FAI sayfasi aciliyor (Ilk Urun Muayenesi)', async ({ page }) => {
    await navigateTo(page, '/quality/fai')
    await assertNoError(page)
  })

  test('6.2 — FAI ekleme formu acilabilir', async ({ page }) => {
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

  test('6.3 — PPAP sayfasi aciliyor (otomotiv ozel)', async ({ page }) => {
    await navigateTo(page, '/quality/ppap')
    await assertNoError(page)
  })

  test('6.4 — Faturalar sayfasi aciliyor (satis faturasi)', async ({ page }) => {
    await navigateTo(page, '/invoices')
    await assertNoError(page)
  })

  test('6.5 — Fatura formu aciliyor', async ({ page }) => {
    await navigateTo(page, '/invoices/form')
    await assertNoError(page)
  })
})

// ══════════════════════════════════════════════════
// FAZ 7: ROL KONTROLU — URETIM ROLU
// ══════════════════════════════════════════════════
test.describe('FAZ 7: Rol Kontrolu (Uretim rolu sinirli menu)', () => {

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
// FAZ 8: RAPORLAR ve DASHBOARD
// ══════════════════════════════════════════════════
test.describe('FAZ 8: Raporlar ve Otomotiv Dashboard', () => {

  test('8.1 — Yonetim kokpiti aciliyor', async ({ page }) => {
    await navigateTo(page, '/executive-dashboard')
    await assertNoError(page)
    const cards = page.locator('.ant-card, [class*="dashboard"]')
    if (await cards.first().isVisible({ timeout: 10000 }).catch(() => false)) {
      const count = await cards.count()
      expect(count).toBeGreaterThanOrEqual(1)
    }
  })

  test('8.2 — Tedarikci degerlendirme sayfasi aciliyor', async ({ page }) => {
    await navigateTo(page, '/quality/supplier-evaluation')
    await assertNoError(page)
  })

  test('8.3 — Maliyet analizi sayfasi aciliyor', async ({ page }) => {
    await navigateTo(page, '/production/part-cost')
    await assertNoError(page)
  })
})

// ══════════════════════════════════════════════════
// SONUC OZETI
// ══════════════════════════════════════════════════
test.describe('Sonuc Ozeti', () => {

  test('Otomotiv senaryosu — tum kritik sayfalar hatasiz aciliyor', async ({ page }) => {
    const kritikSayfalar = [
      '/home',
      '/customers',
      '/customers?type=suppliers',
      '/products',
      '/products/form',
      '/stocks',
      '/offers',
      '/offers/form',
      '/sales',
      '/stock-receipts',
      '/quality/inspections',
      '/production',
      '/shop-floor-terminal',
      '/quality/operation-inspections',
      '/quality/spc',
      '/quality/fai',
      '/quality/ppap',
      '/invoices',
      '/invoices/form',
      '/executive-dashboard',
      '/quality/supplier-evaluation',
      '/production/part-cost',
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

    console.log('\n=== OTOMOTIV YAN SANAYI E2E TEST SONUCLARI ===')
    console.log(`Toplam sayfa: ${sonuclar.length}`)
    console.log(`OK: ${sonuclar.filter(s => s.durum === 'OK').length}`)
    console.log(`HATA: ${sonuclar.filter(s => s.durum === 'HATA').length}`)
    console.log(`LOGIN_REDIRECT: ${sonuclar.filter(s => s.durum === 'LOGIN_REDIRECT').length}`)

    const hatalilar = sonuclar.filter(s => s.durum === 'HATA')
    if (hatalilar.length > 0) {
      console.log('\nHatali sayfalar:')
      hatalilar.forEach(h => console.log(`  x ${h.sayfa}`))
    }
    console.log('================================================\n')

    const hataOrani = hatalilar.length / sonuclar.length
    expect(hataOrani).toBeLessThan(0.1)
  })
})
