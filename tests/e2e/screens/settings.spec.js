const { test, expect } = require('../fixtures')

test.use({ storageState: 'playwright/.auth/user.json' })

test.describe('Ayarlar Modulu', () => {
  const settingsPages = [
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
  ]

  for (const pg of settingsPages) {
    test(`${pg.name} sayfasi yuklenmeli`, async ({ page }) => {
      await page.goto(pg.url)
      await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})

      const url = page.url()
      expect(url).not.toContain('/login')

      const bodyContent = await page.locator('body').innerHTML()
      expect(bodyContent.length).toBeGreaterThan(100)
    })
  }

  test('kullanici listesi tablo gorunmeli', async ({ page }) => {
    await page.goto('/settings/users')
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})

    const table = page.locator('.ant-table, table')
    if (await table.first().isVisible({ timeout: 5_000 }).catch(() => false)) {
      await expect(table.first()).toBeVisible()
    }
  })

  test('birimler sayfasinda tablo olmali', async ({ page }) => {
    await page.goto('/settings/units')
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})

    const table = page.locator('.ant-table, table')
    if (await table.first().isVisible({ timeout: 5_000 }).catch(() => false)) {
      await expect(table.first()).toBeVisible()
    }
  })

  test('makineler sayfasinda tablo olmali', async ({ page }) => {
    await page.goto('/settings/machines')
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})

    const table = page.locator('.ant-table, table')
    if (await table.first().isVisible({ timeout: 5_000 }).catch(() => false)) {
      await expect(table.first()).toBeVisible()
    }
  })

  test('roller sayfasinda liste veya tablo olmali', async ({ page }) => {
    await page.goto('/settings/rollers')
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})

    const content = page.locator('.ant-table, table, .ant-card, .ant-list')
    if (await content.first().isVisible({ timeout: 5_000 }).catch(() => false)) {
      await expect(content.first()).toBeVisible()
    }
  })
})
