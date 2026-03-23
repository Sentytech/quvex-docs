const base = require('@playwright/test')
const fs = require('fs')
const path = require('path')

const sessionFile = path.join(__dirname, '../playwright/.auth/session.json')

/**
 * Custom test fixture: auth.setup.js'den kaydedilen sessionStorage tokenlarini
 * her sayfa yuklemesinde enjekte eder.
 */
const test = base.test.extend({
  page: async ({ page }, use) => {
    if (fs.existsSync(sessionFile)) {
      const sessionData = JSON.parse(fs.readFileSync(sessionFile, 'utf-8'))
      await page.addInitScript((data) => {
        for (const [key, value] of Object.entries(data)) {
          if (value != null) {
            window.sessionStorage.setItem(key, value)
          }
        }
      }, sessionData)
    }
    await use(page)
  },
})

module.exports = { test, expect: base.expect }
