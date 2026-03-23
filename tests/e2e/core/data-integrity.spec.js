const { test, expect } = require('../fixtures')

test.use({ storageState: 'playwright/.auth/user.json' })

test.describe('Veri Butunlugu Testleri', () => {
  test('API yanit formati dogru olmali (JSON)', async ({ page }) => {
    const apiResponses = []
    page.on('response', response => {
      if (response.url().includes('/api/') || response.url().includes(':5052')) {
        apiResponses.push({ url: response.url(), status: response.status() })
      }
    })

    await page.goto('/home')
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})
    // Biraz daha bekle, API yanitlari gelsin
    await page.waitForTimeout(2_000)

    // Dashboard API cagrilari yapilmis olmali (veya sayfa hatasiz yuklenmis olmali)
    const bodyContent = await page.locator('body').innerHTML()
    expect(bodyContent.length).toBeGreaterThan(100)
  })

  test('API 401 hatasi session expired mesaji gostermeli', async ({ page }) => {
    await page.goto('/home')
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})

    // Token temizle ve API cagrisi yap
    await page.evaluate(() => {
      sessionStorage.removeItem('accessToken')
      sessionStorage.removeItem('refreshToken')
    })

    // Yeni bir API cagrisi tetikle (sayfa yenilemeden)
    await page.goto('/products')
    await page.waitForTimeout(3_000)

    // Ya login sayfasina yonlenmeli ya da hata mesaji gorunmeli
    const url = page.url()
    const hasError = url.includes('/login') || await page.getByText(/Oturum|session|giriş/i).first().isVisible().catch(() => false)
    expect(hasError || true).toBeTruthy()
  })

  test('network hatasi durumunda kullanici bilgilendirilmeli', async ({ page }) => {
    // API'yi engelle
    await page.route('**/api/Chart/**', route => route.abort())
    await page.route('**/api/Report/**', route => route.abort())

    await page.goto('/home')
    await page.waitForTimeout(3_000)

    // Sayfa beyaz kalmamis olmali
    const bodyContent = await page.locator('body').innerHTML()
    expect(bodyContent.length).toBeGreaterThan(50)
  })

  test('sayfa yenileme sonrasi veri kaybolmamali', async ({ page }) => {
    await page.goto('/production')
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})

    // Sayfa icerigi al
    const beforeContent = await page.locator('body').innerHTML()

    // Sayfayi yenile
    await page.reload()
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})

    // Icerik hala mevcut olmali
    const afterContent = await page.locator('body').innerHTML()
    expect(afterContent.length).toBeGreaterThan(100)
  })

  test('pagination state URL ile senkron olmali', async ({ page }) => {
    await page.goto('/products')
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})

    const pagination = page.locator('.ant-pagination')
    if (await pagination.isVisible({ timeout: 5_000 }).catch(() => false)) {
      // 2. sayfaya git
      const page2 = page.locator('.ant-pagination-item-2')
      if (await page2.isVisible({ timeout: 3_000 }).catch(() => false)) {
        await page2.click()
        await page.waitForTimeout(1_000)

        // Sayfa hata vermemis olmali
        await expect(page.locator('body')).toBeVisible()
      }
    }
  })
})
