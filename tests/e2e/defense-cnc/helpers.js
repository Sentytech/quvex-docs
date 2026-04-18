/**
 * Defense CNC E2E Test — Yardimci fonksiyonlar
 * Savunma sanayi talasli imalat atolyesi senaryosu
 */
const { expect } = require('@playwright/test')

// ─── Test Verileri ───────────────────────────────────────────

const FIRMA = {
  ad: 'Karadag Hassas Isleme San. Tic. Ltd. Sti.',
  altAlan: 'karadaghassas',
  yetkili: 'Kemal Karadag',
  email: 'kemal@karadaghassas.com',
  telefon: '532 777 8899',
  sifre: 'Karadag2026!@#$',
  sektor: 'CNC',
}

const KULLANICILAR = {
  admin: { ad: 'Kemal Karadag', email: 'kemal@karadaghassas.com', sifre: 'Karadag2026!@#$', rol: 'Admin' },
  uretimMuduru: { ad: 'Serkan Usta', email: 'serkan@karadaghassas.com', sifre: 'Serkan2026!@#$', rol: 'UretimMuduru' },
  kaliteci: { ad: 'Elif Kalite', email: 'elif@karadaghassas.com', sifre: 'Elif2026!@#$', rol: 'Kaliteci' },
  operator1: { ad: 'Murat Tornaci', email: 'murat@karadaghassas.com', sifre: 'Murat2026!@#$', rol: 'Operator' },
  operator2: { ad: 'Hakan Frezeci', email: 'hakan@karadaghassas.com', sifre: 'Hakan2026!@#$', rol: 'Operator' },
  operator3: { ad: 'Yusuf Taslama', email: 'yusuf@karadaghassas.com', sifre: 'Yusuf2026!@#$', rol: 'Operator' },
  muhasebe: { ad: 'Zeynep Muhasebe', email: 'zeynep@karadaghassas.com', sifre: 'Zeynep2026!@#$', rol: 'Muhasebe' },
}

const MAKINELER = [
  { kod: 'CNC-T1', ad: 'Doosan Lynx 220 CNC Torna', saat: 450, setup: 350 },
  { kod: 'CNC-T2', ad: 'Mazak QT-250 CNC Torna', saat: 480, setup: 380 },
  { kod: 'CNC-T3', ad: 'Hyundai Wia L230A CNC Torna', saat: 420, setup: 320 },
  { kod: 'CNC-F1', ad: 'Haas VF-2SS CNC Freze', saat: 550, setup: 450 },
  { kod: 'CNC-F2', ad: 'Haas VF-3 CNC Freze', saat: 580, setup: 470 },
  { kod: 'CNC-F3', ad: 'DMG Mori CMX 600V CNC Freze', saat: 650, setup: 550 },
  { kod: 'TAS-01', ad: 'Okamoto OGM-250 Silindirik Taslama', saat: 400, setup: 300 },
  { kod: 'TES-01', ad: 'Kasto Win A 3.3 Serit Testere', saat: 150, setup: 100 },
]

const DEPOLAR = [
  { kod: 'DEPO-HAM', ad: 'Hammadde Deposu', aciklama: 'Sertifikali hammaddeler' },
  { kod: 'DEPO-YARI', ad: 'Yari Mamul Deposu', aciklama: 'Islem arasi parcalar' },
  { kod: 'DEPO-MAM', ad: 'Mamul Deposu', aciklama: 'Sevkiyata hazir urunler' },
]

const MUSTERILER = [
  {
    firma: 'ROKETSAN A.S.',
    yetkili: 'Cmdr. Yilmaz Savunma',
    email: 'yilmaz@roketsan.com.tr',
    telefon: '312 860 0000',
    adres: 'ROKETSAN Elmadag Tesisleri, Ankara',
    vergiNo: '1234567890',
    vade: 60,
  },
  {
    firma: 'ASELSAN A.S.',
    yetkili: 'Dr. Ayse Elektronik',
    email: 'ayse@aselsan.com.tr',
    telefon: '312 592 1000',
    adres: 'ASELSAN Macunkoy, Ankara',
    vergiNo: '9876543210',
    vade: 45,
  },
]

const TEDARIKCILER = [
  { firma: 'Alcoa Turkiye', yetkili: 'Mehmet Aluminyum', tip: 'Hammadde' },
  { firma: 'Boehler Turkiye', yetkili: 'Hans Celik', tip: 'Hammadde' },
  { firma: 'Anodize Teknik San.', yetkili: 'Ali Kaplama', tip: 'Fason' },
]

const HAMMADDE = {
  ad: 'Al 7075-T6 Cubuk D80x150mm',
  kod: 'HAM-AL7075-080150',
  stokKod: 'STK-AL7075-080150',
  birim: 'Adet',
  fiyat: 320,
  minStok: 100,
}

const MAMUL = {
  ad: 'ROKETSAN Fuze Baslik Govdesi RKT-BHG-7075',
  kod: 'RKT-BHG-7075',
  stokKod: 'STK-RKT-BHG-7075',
  birim: 'Adet',
  fiyat: 1850,
  minStok: 50,
}

const OPERASYONLAR = [
  { no: 'OP10', ad: 'Testere Kesim', makine: 'TES-01', setup: 10, run: 3, kalite: false },
  { no: 'OP20', ad: 'CNC Torna Kaba', makine: 'CNC-T1', setup: 25, run: 12, kalite: true },
  { no: 'OP30', ad: 'CNC Torna Hassas', makine: 'CNC-T1', setup: 15, run: 18, kalite: true },
  { no: 'OP40', ad: 'CNC Freze', makine: 'CNC-F1', setup: 30, run: 15, kalite: true },
  { no: 'OP50', ad: 'Taslama', makine: 'TAS-01', setup: 20, run: 8, kalite: true },
  { no: 'OP60', ad: 'Capak Alma + Yikama', makine: null, setup: 5, run: 3, kalite: false },
  { no: 'OP70', ad: 'Final Olcum', makine: null, setup: 10, run: 10, kalite: true },
]

const OLCUMLER = {
  OP20: [{ ad: 'Dis Cap D75', nominal: 75.0, tolerans: '±0.100', olcum: 75.05, sonuc: 'GECTI' }],
  OP30: [
    { ad: 'Dis Cap D72h6', nominal: 72.0, tolerans: '+0.000/-0.019', olcum: 71.990, sonuc: 'GECTI', kritik: true },
    { ad: 'Boy 142', nominal: 142.0, tolerans: '±0.050', olcum: 141.97, sonuc: 'GECTI' },
  ],
  OP40: [{ ad: 'Kama Gen. 8H7', nominal: 8.0, tolerans: '+0.015/-0.000', olcum: 8.008, sonuc: 'GECTI', kritik: true }],
  OP50: [{ ad: 'Dis Cap D72h6', nominal: 72.0, tolerans: '+0.000/-0.019', olcum: 71.993, sonuc: 'GECTI', kritik: true }],
  OP70: [{ ad: 'Yuzey Puruz Ra', nominal: 0.8, tolerans: 'max 0.8', olcum: 0.65, sonuc: 'GECTI', kritik: true }],
}

const TEKLIF = {
  musteri: 'ROKETSAN A.S.',
  urun: MAMUL.kod,
  adet: 200,
  birimFiyat: 1850,
  toplam: 370000,
  teslimat: '45 is gunu',
}

// ─── Yardimci Fonksiyonlar ───────────────────────────────────

/**
 * Sayfanin tam yuklenmesini bekle (networkidle + ekstra sure)
 */
async function waitForPageLoad(page, timeout = 15000) {
  await page.waitForLoadState('networkidle', { timeout }).catch(() => {})
  await page.waitForTimeout(500)
}

/**
 * Belirtilen URL'ye git ve yuklenmesini bekle
 */
async function navigateTo(page, path) {
  await page.goto(path)
  await waitForPageLoad(page)
}

/**
 * Ant Design modal'in acilmasini bekle
 */
async function waitForModal(page, timeout = 5000) {
  const modal = page.locator('.ant-modal')
  await expect(modal.first()).toBeVisible({ timeout })
  return modal.first()
}

/**
 * Ant Design modal'i kapat (Iptal butonu)
 */
async function closeModal(page) {
  const cancelBtn = page.locator('.ant-modal-footer .ant-btn-default, button:has-text("İptal"), button:has-text("Kapat")')
  if (await cancelBtn.first().isVisible({ timeout: 3000 }).catch(() => false)) {
    await cancelBtn.first().click()
    await page.waitForTimeout(500)
  }
}

/**
 * Ant Design tablosunda satir sayisini kontrol et
 */
async function getTableRowCount(page, timeout = 10000) {
  const rows = page.locator('.ant-table-row')
  if (await rows.first().isVisible({ timeout }).catch(() => false)) {
    return await rows.count()
  }
  return 0
}

/**
 * Ant Design formunda input'u doldur (label veya id ile)
 */
async function fillInput(page, selector, value) {
  const input = page.locator(selector)
  if (await input.isVisible({ timeout: 5000 }).catch(() => false)) {
    await input.clear()
    await input.fill(String(value))
    return true
  }
  return false
}

/**
 * Ant Design Select component'i sec
 */
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

/**
 * Buton tiklama (text ile)
 */
async function clickButton(page, text, timeout = 5000) {
  const btn = page.locator(`button:has-text("${text}")`)
  if (await btn.first().isVisible({ timeout }).catch(() => false)) {
    await btn.first().click()
    await page.waitForTimeout(500)
    return true
  }
  return false
}

/**
 * Sayfada hata olmamali (beyaz sayfa, 500 hatasi, vb.)
 */
async function assertNoError(page) {
  const body = await page.locator('body').innerHTML()
  expect(body.length).toBeGreaterThan(100)
  // 500 / error sayfasi kontrol
  const url = page.url()
  expect(url).not.toContain('/error')
  expect(url).not.toContain('/500')
}

/**
 * Basari mesaji (toast / notification) bekle
 */
async function waitForSuccess(page, timeout = 5000) {
  const success = page.locator('.ant-notification-notice, .ant-message-success, .Toastify__toast--success')
  return await success.first().isVisible({ timeout }).catch(() => false)
}

/**
 * Login islemini gerceklestir
 */
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

/**
 * Logout islemini gerceklestir
 */
async function logout(page) {
  // Kullanici menu dropdown'undan cikis
  const userMenu = page.locator('.ant-dropdown-trigger .anticon-user, [class*="avatar"], [class*="user-nav"]').first()
  if (await userMenu.isVisible({ timeout: 5000 }).catch(() => false)) {
    await userMenu.click()
    await page.waitForTimeout(300)
    const logoutBtn = page.locator('a:has-text("Çıkış"), button:has-text("Çıkış"), [class*="logout"]')
    if (await logoutBtn.first().isVisible({ timeout: 3000 }).catch(() => false)) {
      await logoutBtn.first().click()
      await page.waitForTimeout(1000)
    }
  }
}

/**
 * Ekleme butonuna tikla (+ ikonu)
 */
async function clickAddButton(page) {
  const addBtn = page.locator('button .anticon-plus, button:has-text("Ekle"), button:has-text("Yeni")')
  if (await addBtn.first().isVisible({ timeout: 5000 }).catch(() => false)) {
    await addBtn.first().click()
    await page.waitForTimeout(500)
    return true
  }
  return false
}

/**
 * Kaydet butonuna tikla
 */
async function clickSave(page) {
  const saveBtn = page.locator('button:has-text("Kaydet"), button:has-text("Olustur"), button.ant-btn-primary')
  if (await saveBtn.first().isVisible({ timeout: 5000 }).catch(() => false)) {
    await saveBtn.first().click()
    await page.waitForTimeout(1000)
    return true
  }
  return false
}

module.exports = {
  FIRMA,
  KULLANICILAR,
  MAKINELER,
  DEPOLAR,
  MUSTERILER,
  TEDARIKCILER,
  HAMMADDE,
  MAMUL,
  OPERASYONLAR,
  OLCUMLER,
  TEKLIF,
  waitForPageLoad,
  navigateTo,
  waitForModal,
  closeModal,
  getTableRowCount,
  fillInput,
  selectOption,
  clickButton,
  assertNoError,
  waitForSuccess,
  login,
  logout,
  clickAddButton,
  clickSave,
}
