const { test, expect } = require('../fixtures')

test.use({ storageState: 'playwright/.auth/user.json' })

test.describe('Bakim ve IK Modulu', () => {
  test('bakim yonetimi sayfasi yuklenmeli', async ({ page }) => {
    await page.goto('/maintenance')
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})

    const bodyContent = await page.locator('body').innerHTML()
    expect(bodyContent.length).toBeGreaterThan(100)
  })

  test('OEE dashboard sayfasi yuklenmeli', async ({ page }) => {
    await page.goto('/oee')
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})

    const bodyContent = await page.locator('body').innerHTML()
    expect(bodyContent.length).toBeGreaterThan(100)
  })

  test('gelismis MRP sayfasi yuklenmeli', async ({ page }) => {
    await page.goto('/advanced-mrp')
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})

    const bodyContent = await page.locator('body').innerHTML()
    expect(bodyContent.length).toBeGreaterThan(100)
  })

  test('IK yonetimi sayfasi yuklenmeli', async ({ page }) => {
    await page.goto('/hr')
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})

    const bodyContent = await page.locator('body').innerHTML()
    expect(bodyContent.length).toBeGreaterThan(100)
  })

  test('dokuman yonetimi sayfasi yuklenmeli', async ({ page }) => {
    await page.goto('/documents')
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})

    const bodyContent = await page.locator('body').innerHTML()
    expect(bodyContent.length).toBeGreaterThan(100)
  })

  test('AI insights sayfasi yuklenmeli', async ({ page }) => {
    await page.goto('/ai-insights')
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})

    const bodyContent = await page.locator('body').innerHTML()
    expect(bodyContent.length).toBeGreaterThan(100)
  })

  test('MRP BOM explorer sayfasi yuklenmeli', async ({ page }) => {
    await page.goto('/mrp')
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})

    const bodyContent = await page.locator('body').innerHTML()
    expect(bodyContent.length).toBeGreaterThan(100)
  })

  test('gorevler sayfasi yuklenmeli', async ({ page }) => {
    await page.goto('/tasks')
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})

    const bodyContent = await page.locator('body').innerHTML()
    expect(bodyContent.length).toBeGreaterThan(100)
  })
})
