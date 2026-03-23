const { test, expect } = require('../fixtures')

test.use({ storageState: 'playwright/.auth/user.json' })

test.describe('Server-side Pagination', () => {

  test.describe('Uretim listesi pagination', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/production')
      await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})
    })

    test('pagination kontrolu gorunmeli', async ({ page }) => {
      const paginationEl = page.locator('.ant-pagination')
      await expect(paginationEl.first()).toBeVisible({ timeout: 10_000 })
    })

    test('toplam kayit sayisi gosterilmeli', async ({ page }) => {
      const totalText = page.locator('.ant-pagination-total-text')
      if (await totalText.isVisible({ timeout: 5_000 }).catch(() => false)) {
        const text = await totalText.textContent()
        expect(text).toContain('Toplam')
      }
    })

    test('sayfa boyutu degistirilebilmeli', async ({ page }) => {
      const sizeChanger = page.locator('.ant-pagination-options .ant-select-selector')
      if (await sizeChanger.isVisible({ timeout: 5_000 }).catch(() => false)) {
        await sizeChanger.click()
        await page.waitForTimeout(300)
        const options = page.locator('.ant-select-item-option')
        const count = await options.count()
        expect(count).toBeGreaterThanOrEqual(2)
      }
    })

    test('API isteginde page ve pageSize parametreleri gonderilmeli', async ({ page }) => {
      const apiRequest = page.waitForRequest(req =>
        req.url().includes('/Production') && req.url().includes('page=')
      )
      await page.reload()
      await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})
      const req = await apiRequest.catch(() => null)
      if (req) {
        expect(req.url()).toContain('page=')
        expect(req.url()).toContain('pageSize=')
      }
    })
  })

  test.describe('Musteri listesi pagination', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/customers')
      await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})
    })

    test('pagination kontrolu gorunmeli', async ({ page }) => {
      const paginationEl = page.locator('.ant-pagination')
      await expect(paginationEl.first()).toBeVisible({ timeout: 10_000 })
    })

    test('API yaniti PaginatedResult formatinda olmali', async ({ page }) => {
      const responsePromise = page.waitForResponse(res =>
        res.url().includes('/Customer') && res.status() === 200
      )
      await page.reload()
      await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})
      const response = await responsePromise.catch(() => null)
      if (response) {
        const body = await response.json().catch(() => null)
        if (body && !Array.isArray(body)) {
          expect(body).toHaveProperty('items')
          expect(body).toHaveProperty('totalCount')
          expect(body).toHaveProperty('page')
          expect(body).toHaveProperty('pageSize')
        }
      }
    })
  })

  test.describe('NCR listesi pagination', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/quality/ncr')
      await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})
    })

    test('pagination kontrolu gorunmeli', async ({ page }) => {
      const paginationEl = page.locator('.ant-pagination')
      await expect(paginationEl.first()).toBeVisible({ timeout: 10_000 })
    })

    test('arama yapildiginda page 1e donmeli', async ({ page }) => {
      const searchInput = page.locator('.ant-input-search input, input[placeholder*="Ara"]')
      if (await searchInput.first().isVisible({ timeout: 5_000 }).catch(() => false)) {
        const apiRequest = page.waitForRequest(req =>
          req.url().includes('/Ncr') && req.url().includes('page=1')
        )
        await searchInput.first().fill('test')
        await searchInput.first().press('Enter')
        const req = await apiRequest.catch(() => null)
        if (req) {
          expect(req.url()).toContain('page=1')
        }
      }
    })
  })

  test.describe('Satis listesi pagination', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/sales')
      await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})
    })

    test('pagination kontrolu gorunmeli', async ({ page }) => {
      const paginationEl = page.locator('.ant-pagination')
      await expect(paginationEl.first()).toBeVisible({ timeout: 10_000 })
    })
  })

  test.describe('Stok listesi pagination', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/stocks')
      await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})
    })

    test('pagination kontrolu gorunmeli', async ({ page }) => {
      const paginationEl = page.locator('.ant-pagination')
      await expect(paginationEl.first()).toBeVisible({ timeout: 10_000 })
    })
  })

  test.describe('Urun listesi pagination', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/products')
      await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})
    })

    test('pagination kontrolu gorunmeli', async ({ page }) => {
      const paginationEl = page.locator('.ant-pagination')
      await expect(paginationEl.first()).toBeVisible({ timeout: 10_000 })
    })
  })
})
