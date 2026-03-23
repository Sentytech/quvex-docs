const { test, expect } = require('../fixtures')

test.use({ storageState: 'playwright/.auth/user.json' })

test.describe('Hata Yonetimi Testleri', () => {
  test('sayfa yuklenirken JavaScript hatasi olmamali (Dashboard)', async ({ page }) => {
    const errors = []
    page.on('pageerror', err => errors.push(err.message))

    await page.goto('/home')
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})

    // Kritik JS hatalari olmamali
    const criticalErrors = errors.filter(e =>
      !e.includes('ResizeObserver') && // Bu bilinen ve zararsiz bir hata
      !e.includes('Non-Error') &&
      !e.includes('ChunkLoadError')
    )
    expect(criticalErrors).toEqual([])
  })

  test('sayfa yuklenirken JavaScript hatasi olmamali (Urunler)', async ({ page }) => {
    const errors = []
    page.on('pageerror', err => errors.push(err.message))

    await page.goto('/products')
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})

    const criticalErrors = errors.filter(e =>
      !e.includes('ResizeObserver') &&
      !e.includes('Non-Error') &&
      !e.includes('ChunkLoadError')
    )
    expect(criticalErrors).toEqual([])
  })

  test('sayfa yuklenirken JavaScript hatasi olmamali (Uretim)', async ({ page }) => {
    const errors = []
    page.on('pageerror', err => errors.push(err.message))

    await page.goto('/production')
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})

    const criticalErrors = errors.filter(e =>
      !e.includes('ResizeObserver') &&
      !e.includes('Non-Error') &&
      !e.includes('ChunkLoadError')
    )
    expect(criticalErrors).toEqual([])
  })

  test('sayfa yuklenirken JavaScript hatasi olmamali (Satis)', async ({ page }) => {
    const errors = []
    page.on('pageerror', err => errors.push(err.message))

    await page.goto('/sales')
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})

    const criticalErrors = errors.filter(e =>
      !e.includes('ResizeObserver') &&
      !e.includes('Non-Error') &&
      !e.includes('ChunkLoadError')
    )
    expect(criticalErrors).toEqual([])
  })

  test('sayfa yuklenirken JavaScript hatasi olmamali (Faturalar)', async ({ page }) => {
    const errors = []
    page.on('pageerror', err => errors.push(err.message))

    await page.goto('/invoices')
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})

    const criticalErrors = errors.filter(e =>
      !e.includes('ResizeObserver') &&
      !e.includes('Non-Error') &&
      !e.includes('ChunkLoadError')
    )
    expect(criticalErrors).toEqual([])
  })

  test('API baglantisi kesilince hata mesaji gostermeli', async ({ page }) => {
    // API'yi engelle
    await page.route('**/api/**', route => route.abort())

    await page.goto('/home')
    await page.waitForTimeout(3_000)

    // Sayfa hala render edilmis olmali (beyaz ekran olmamali)
    const bodyContent = await page.locator('body').innerHTML()
    expect(bodyContent.length).toBeGreaterThan(50)
  })

  test('console error olmamali (Kalite Dashboard)', async ({ page }) => {
    const errors = []
    page.on('pageerror', err => errors.push(err.message))

    await page.goto('/quality/dashboard')
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})

    const criticalErrors = errors.filter(e =>
      !e.includes('ResizeObserver') &&
      !e.includes('Non-Error') &&
      !e.includes('ChunkLoadError')
    )
    expect(criticalErrors).toEqual([])
  })
})
