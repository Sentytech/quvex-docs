const { test, expect } = require('../fixtures')

test.use({ storageState: 'playwright/.auth/user.json' })

test.describe('Tum Sayfalara Navigasyon', () => {
  // Her sayfa icin: yuklenebilmeli ve hata vermemeli
  const allPages = [
    // Dashboard
    { name: 'Dashboard', url: '/home' },

    // Urun
    { name: 'Urunler', url: '/products' },

    // Stok
    { name: 'Stok Listesi', url: '/stocks' },
    { name: 'Stok Girisi', url: '/stock-receipts' },
    { name: 'Depolar', url: '/warehouses' },
    { name: 'Depo Lokasyonlari', url: '/warehouse-locations' },
    { name: 'Stok Sayim', url: '/stock/count' },
    { name: 'Lotlar', url: '/stock/lots' },
    { name: 'Stok Degerleme', url: '/stock/valuation' },
    { name: 'ABC Analizi', url: '/stock/abc-analysis' },
    { name: 'Stok Uyarilari', url: '/stock/alerts' },
    { name: 'Barkod Islemleri', url: '/stock/barcode' },
    { name: 'Stok Transferleri', url: '/stock/transfers' },

    // Satin Alma
    { name: 'Satin Alma Talepleri', url: '/purchase-request' },
    { name: 'Satin Alma Teklifleri', url: '/purchase-offers' },
    { name: 'Satin Alma Siparisleri', url: '/purchase-orders' },

    // Satis
    { name: 'Musteriler', url: '/customers' },
    { name: 'Musteri Portali', url: '/customer-portal' },
    { name: 'Musteri Ekstre', url: '/customer-statement' },
    { name: 'Musteri Geri Bildirim', url: '/customer-feedback' },
    { name: 'Teklifler', url: '/offers' },
    { name: 'Satis Siparisleri', url: '/sales' },

    // Tedarikciler
    { name: 'Tedarikciler', url: '/suppliers' },

    // Uretim
    { name: 'Uretim Emirleri', url: '/production' },
    { name: 'Uretim Planlama Gantt', url: '/production/planning' },
    { name: 'Proje Yonetimi', url: '/production/projects' },
    { name: 'Kapasite Cizelgeleme', url: '/production/capacity-scheduling' },
    { name: 'Seri Numaralari', url: '/serial-numbers' },
    { name: 'Fason Isler', url: '/subcontract-orders' },
    { name: 'Atölye Terminali', url: '/shop-floor' },

    // Muhasebe
    { name: 'Faturalar', url: '/invoices' },
    { name: 'Sevk Edilen Siparisler', url: '/accounting/shipped' },
    { name: 'Faturalanan Siparisler', url: '/accounting/billed' },
    { name: 'Banka Mutabakat', url: '/bank-reconciliation' },

    // Kalite
    { name: 'Kalite Dashboard', url: '/quality/dashboard' },
    { name: 'NCR', url: '/quality/ncr' },
    { name: 'Giris Kontrol', url: '/quality/inspections' },
    { name: 'Kalibrasyon', url: '/quality/calibration' },
    { name: 'CAPA', url: '/quality/capa' },
    { name: 'Risk FMEA', url: '/quality/risk-fmea' },
    { name: 'Kontrol Planlari', url: '/quality/control-plans' },
    { name: 'Egitim', url: '/quality/training' },
    { name: 'Ic Denetim', url: '/quality/internal-audit' },
    { name: 'Tedarikci Degerlendirme', url: '/quality/supplier-evaluation' },
    { name: 'FAI AS9102', url: '/quality/fai' },
    { name: 'Sahte Parca Onleme', url: '/quality/counterfeit-prevention' },
    { name: 'Konfigürasyon Yonetimi', url: '/quality/configuration' },
    { name: 'Ozel Prosesler', url: '/quality/special-processes' },
    { name: 'FOD', url: '/quality/fod' },
    { name: 'Musteri Mulkiyet', url: '/quality/customer-property' },
    { name: 'SPC', url: '/quality/spc' },
    { name: 'PPAP', url: '/quality/ppap' },
    { name: 'Tasarim Gelistirme', url: '/quality/design-development' },
    { name: 'Tedarik Zinciri Risk', url: '/quality/supply-chain-risk' },
    { name: 'Urun Guvenligi', url: '/quality/product-safety' },

    // Bakim
    { name: 'Bakim Yonetimi', url: '/maintenance' },
    { name: 'OEE Dashboard', url: '/oee' },
    { name: 'Gelismis MRP', url: '/advanced-mrp' },

    // IK
    { name: 'IK Yonetimi', url: '/hr' },
    { name: 'Dokumanlar', url: '/documents' },

    // Raporlar
    { name: 'Raporlar Dashboard', url: '/reports' },
    { name: 'KPI Dashboard', url: '/reports/kpi' },
    { name: 'Dinamik Raporlar', url: '/dynamic-reports' },
    { name: 'Bildirimler', url: '/notifications' },
    { name: 'Teklif Donusum', url: '/reports/offer-conversion' },
    { name: 'Teslimat Tahmini', url: '/reports/delivery-estimation' },
    { name: 'NCR Trend', url: '/reports/ncr-trend' },
    { name: 'Tedarikci Kalite Trend', url: '/reports/supplier-quality' },
    { name: 'Kalite Maliyet', url: '/reports/quality-cost' },

    // Ayarlar
    { name: 'Kullanicilar', url: '/settings/users' },
    { name: 'Roller', url: '/settings/rollers' },
    { name: 'Is Emri Sablonlari', url: '/settings/work-order-templates' },
    { name: 'Is Emri Adimlari', url: '/settings/work-order-steps' },
    { name: 'Birimler', url: '/settings/units' },
    { name: 'Malzeme Tipleri', url: '/settings/material-types' },
    { name: 'Makineler', url: '/settings/machines' },
    { name: 'Is Emri Loglari', url: '/settings/work-order-logs' },
    { name: 'ECN Revizyon', url: '/settings/ecn' },
    { name: 'Siber Guvenlik', url: '/settings/cybersecurity' },
    { name: 'Denetim Izi', url: '/settings/audit-trail' },
    { name: 'Import Export', url: '/settings/import-export' },

    // Diger
    { name: 'AI Insights', url: '/ai-insights' },
    { name: 'MRP BOM', url: '/mrp' },
    { name: 'Gorevler', url: '/tasks' },
  ]

  for (const pg of allPages) {
    test(`${pg.name} (${pg.url}) yuklenebilmeli`, async ({ page }) => {
      await page.goto(pg.url)
      await page.waitForLoadState('domcontentloaded')

      const url = page.url()
      // Login'e redirect olmamis olmali
      expect(url).not.toContain('/login')

      // Sayfa icerigi yuklenmis olmali (en az 1 saniye bekle)
      await page.waitForTimeout(1_000)

      // JavaScript hatasi olmasin — sayfa beyaz kalmamis olmali
      const bodyContent = await page.locator('body').innerHTML()
      expect(bodyContent.length).toBeGreaterThan(100)
    })
  }
})
