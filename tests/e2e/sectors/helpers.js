/**
 * Sector E2E Tests — Yardimci fonksiyonlar
 * Otomotiv, Metal Esya, Medikal sektor senaryolari icin ortak
 */
const { expect } = require('@playwright/test')

// ----------------------------------------------------------------
// Ortak yardimci fonksiyonlar
// ----------------------------------------------------------------

async function waitForPageLoad(page, timeout = 15000) {
  await page.waitForLoadState('networkidle', { timeout }).catch(() => {})
  await page.waitForTimeout(500)
}

async function navigateTo(page, path) {
  await page.goto(path)
  await waitForPageLoad(page)
}

async function assertNoError(page) {
  const body = await page.locator('body').innerHTML()
  expect(body.length).toBeGreaterThan(100)
  const url = page.url()
  expect(url).not.toContain('/error')
  expect(url).not.toContain('/500')
}

async function waitForSuccess(page, timeout = 5000) {
  const success = page.locator('.ant-notification-notice, .ant-message-success, .Toastify__toast--success')
  return await success.first().isVisible({ timeout }).catch(() => false)
}

async function waitForModal(page, timeout = 5000) {
  const modal = page.locator('.ant-modal')
  await expect(modal.first()).toBeVisible({ timeout })
  return modal.first()
}

async function closeModal(page) {
  const cancelBtn = page.locator('.ant-modal-footer .ant-btn-default, button:has-text("Iptal"), button:has-text("Kapat")')
  if (await cancelBtn.first().isVisible({ timeout: 3000 }).catch(() => false)) {
    await cancelBtn.first().click()
    await page.waitForTimeout(500)
  }
}

async function getTableRowCount(page, timeout = 10000) {
  const rows = page.locator('.ant-table-row')
  if (await rows.first().isVisible({ timeout }).catch(() => false)) {
    return await rows.count()
  }
  return 0
}

async function fillInput(page, selector, value) {
  const input = page.locator(selector)
  if (await input.isVisible({ timeout: 5000 }).catch(() => false)) {
    await input.clear()
    await input.fill(String(value))
    return true
  }
  return false
}

async function selectOption(page, selector, optionText) {
  const select = page.locator(selector)
  if (await select.isVisible({ timeout: 5000 }).catch(() => false)) {
    await select.click()
    await page.waitForTimeout(300)
    const option = page.locator(`.ant-select-item-option:has-text("${optionText}")`)
    if (await option.isVisible({ timeout: 3000 }).catch(() => false)) {
      await option.click()
      await page.waitForTimeout(300)
      return true
    }
  }
  return false
}

async function clickButton(page, text, timeout = 5000) {
  const btn = page.locator(`button:has-text("${text}")`)
  if (await btn.first().isVisible({ timeout }).catch(() => false)) {
    await btn.first().click()
    await page.waitForTimeout(500)
    return true
  }
  return false
}

async function clickAddButton(page) {
  const addBtn = page.locator('button .anticon-plus, button:has-text("Ekle"), button:has-text("Yeni")')
  if (await addBtn.first().isVisible({ timeout: 5000 }).catch(() => false)) {
    await addBtn.first().click()
    await page.waitForTimeout(500)
    return true
  }
  return false
}

async function clickSave(page) {
  const saveBtn = page.locator('button:has-text("Kaydet"), button:has-text("Olustur"), button.ant-btn-primary')
  if (await saveBtn.first().isVisible({ timeout: 5000 }).catch(() => false)) {
    await saveBtn.first().click()
    await page.waitForTimeout(1000)
    return true
  }
  return false
}

async function login(page, email, password) {
  await page.goto('/login')
  await waitForPageLoad(page, 10000)
  const emailInput = page.locator('input[name="loginEmail"]')
  await expect(emailInput).toBeVisible({ timeout: 10000 })
  await emailInput.fill(email)
  await page.locator('input[name="password"]').fill(password)
  await page.locator('button.qx-login-btn').click()
  await expect(page).toHaveURL(/home|dashboard|shop-floor/, { timeout: 30000 })
  await waitForPageLoad(page)
}

async function logout(page) {
  const userMenu = page.locator('.ant-dropdown-trigger .anticon-user, [class*="avatar"], [class*="user-nav"]').first()
  if (await userMenu.isVisible({ timeout: 5000 }).catch(() => false)) {
    await userMenu.click()
    await page.waitForTimeout(300)
    const logoutBtn = page.locator('a:has-text("Cikis"), button:has-text("Cikis"), [class*="logout"]')
    if (await logoutBtn.first().isVisible({ timeout: 3000 }).catch(() => false)) {
      await logoutBtn.first().click()
      await page.waitForTimeout(1000)
    }
  }
}

module.exports = {
  waitForPageLoad,
  navigateTo,
  assertNoError,
  waitForSuccess,
  waitForModal,
  closeModal,
  getTableRowCount,
  fillInput,
  selectOption,
  clickButton,
  clickAddButton,
  clickSave,
  login,
  logout,
}
