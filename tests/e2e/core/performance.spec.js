const { test, expect } = require('../fixtures')

test.use({ storageState: 'playwright/.auth/user.json' })

test.describe('Performans Testleri', () => {
  const criticalPages = [
    { name: 'Dashboard', url: '/home', maxLoadTime: 5_000 },
    { name: 'Urunler', url: '/products', maxLoadTime: 5_000 },
    { name: 'Uretim', url: '/production', maxLoadTime: 5_000 },
    { name: 'Satis', url: '/sales', maxLoadTime: 5_000 },
    { name: 'Faturalar', url: '/invoices', maxLoadTime: 5_000 },
    { name: 'Stok', url: '/stocks', maxLoadTime: 5_000 },
  ]

  for (const pg of criticalPages) {
    test(`${pg.name} ${pg.maxLoadTime / 1000}s icinde yuklenmeli`, async ({ page }) => {
      const start = Date.now()

      await page.goto(pg.url)
      await page.waitForLoadState('domcontentloaded')

      const loadTime = Date.now() - start
      expect(loadTime).toBeLessThan(pg.maxLoadTime)
    })
  }

  test('login sayfasi 3 saniye icinde yuklenmeli', async ({ page }) => {
    const start = Date.now()
    await page.goto('/login')
    await page.waitForLoadState('domcontentloaded')
    const loadTime = Date.now() - start

    expect(loadTime).toBeLessThan(5_000)
  })

  test('sayfa gecisleri akici olmali (5 sayfa art arda)', async ({ page }) => {
    const pages = ['/home', '/products', '/production', '/sales', '/invoices']

    for (const url of pages) {
      const start = Date.now()
      await page.goto(url)
      await page.waitForLoadState('domcontentloaded')
      const loadTime = Date.now() - start

      // Her sayfa gecisi 5 saniye altinda olmali
      expect(loadTime).toBeLessThan(5_000)
    }
  })
})
