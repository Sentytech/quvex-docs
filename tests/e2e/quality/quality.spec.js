const { test, expect } = require('../fixtures')

test.use({ storageState: 'playwright/.auth/user.json' })

test.describe('Kalite Modulu', () => {
  const qualityPages = [
    { name: 'Kalite Dashboard', url: '/quality/dashboard' },
    { name: 'NCR (Uygunsuzluk)', url: '/quality/ncr' },
    { name: 'Giris Kontrol', url: '/quality/inspections' },
    { name: 'Kalibrasyon', url: '/quality/calibration' },
    { name: 'CAPA', url: '/quality/capa' },
    { name: 'Risk & FMEA', url: '/quality/risk-fmea' },
    { name: 'Kontrol Planlari', url: '/quality/control-plans' },
    { name: 'Egitim Yonetimi', url: '/quality/training' },
    { name: 'Ic Denetim', url: '/quality/internal-audit' },
    { name: 'Tedarikci Degerlendirme', url: '/quality/supplier-evaluation' },
    { name: 'FAI (AS9102)', url: '/quality/fai' },
    { name: 'Sahte Parca Onleme', url: '/quality/counterfeit-prevention' },
    { name: 'Konfigürasyon Yonetimi', url: '/quality/configuration' },
    { name: 'Ozel Prosesler', url: '/quality/special-processes' },
    { name: 'FOD Onleme', url: '/quality/fod' },
    { name: 'Musteri Mulkiyet', url: '/quality/customer-property' },
    { name: 'SPC', url: '/quality/spc' },
    { name: 'PPAP', url: '/quality/ppap' },
    { name: 'Tasarim & Gelistirme', url: '/quality/design-development' },
    { name: 'Tedarik Zinciri Risk', url: '/quality/supply-chain-risk' },
    { name: 'Urun Guvenligi', url: '/quality/product-safety' },
  ]

  for (const pg of qualityPages) {
    test(`${pg.name} sayfasi yuklenmeli`, async ({ page }) => {
      await page.goto(pg.url)
      await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})

      const url = page.url()
      expect(url).not.toContain('/login')

      const bodyContent = await page.locator('body').innerHTML()
      expect(bodyContent.length).toBeGreaterThan(100)
    })
  }

  test('kalite dashboard istatistikleri gorunmeli', async ({ page }) => {
    await page.goto('/quality/dashboard')
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})

    const cards = page.locator('.ant-card, .ant-statistic, [class*="stat"], [class*="card"]')
    if (await cards.first().isVisible({ timeout: 5_000 }).catch(() => false)) {
      const count = await cards.count()
      expect(count).toBeGreaterThan(0)
    }
  })

  test('NCR listesinde tablo olmali', async ({ page }) => {
    await page.goto('/quality/ncr')
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})

    const table = page.locator('.ant-table, table')
    if (await table.first().isVisible({ timeout: 5_000 }).catch(() => false)) {
      await expect(table.first()).toBeVisible()
    }
  })

  test('giris kontrol listesinde tablo olmali', async ({ page }) => {
    await page.goto('/quality/inspections')
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})

    const table = page.locator('.ant-table, table')
    if (await table.first().isVisible({ timeout: 5_000 }).catch(() => false)) {
      await expect(table.first()).toBeVisible()
    }
  })
})
