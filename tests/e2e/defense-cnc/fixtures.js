/**
 * Defense CNC E2E — Custom test fixture
 * https://quvex.io uzerindeki testler icin session enjeksiyonu
 */
const base = require('@playwright/test')
const fs = require('fs')
const path = require('path')

const sessionFile = path.join(__dirname, '../../playwright/.auth/defense-session.json')
const authFile = path.join(__dirname, '../../playwright/.auth/defense-user.json')

/**
 * Custom test fixture: auth-setup.spec.js'den kaydedilen sessionStorage tokenlarini
 * her sayfa yuklemesinde enjekte eder.
 */
const test = base.test.extend({
  // storageState ile localStorage/cookies restore et
  storageState: authFile,

  page: async ({ page }, use) => {
    // sessionStorage tokenlarini enjekte et
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
