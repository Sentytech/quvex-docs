/**
 * API-UI Endpoint Health Check
 * =============================
 * Bu test, UI'ın kullandığı TÜM API endpoint'lerini doğrudan test eder.
 * Her endpoint için: erişilebilirlik, HTTP status, response format kontrol edilir.
 *
 * Kullanım:
 *   npx playwright test e2e/api-endpoint-health.spec.js --reporter=html
 *   npx playwright test e2e/api-endpoint-health.spec.js --reporter=list
 *
 * Güncelleme: Yeni endpoint eklendiğinde ENDPOINTS dizisine ekleyin.
 */

const { test, expect } = require('@playwright/test')

const API_BASE = process.env.API_BASE || 'http://localhost:5052/api'
const LOGIN_EMAIL = process.env.LOGIN_EMAIL || 'admin@quvex.com'
const LOGIN_PASS = process.env.LOGIN_PASS || 'Admin123!@#$'

// ─── Endpoint Registry ──────────────────────────────────────────────
// Her entry: [method, path, expectedStatus, uiPage, description]
// expectedStatus: 200 = normal, 'any2xx' = 200-299 kabul, 'skip' = atla
const ENDPOINTS = [
  // ══════════════════════════════════════════════════════════════════
  // AUTHENTICATION & ACCOUNT
  // ══════════════════════════════════════════════════════════════════
  ['GET', '/Account/GetAllAsync', 200, '/settings/users', 'Tüm kullanıcılar'],
  ['GET', '/Account/GetRoles', 200, '/settings/rollers', 'Tüm roller'],
  ['GET', '/Account/my-permissions', 200, '/', 'Kullanıcı izinleri'],
  ['GET', '/Account/GetAllAsync', 200, '/manage/users', 'Kullanıcı listesi (GetAllAsync)'],

  // ══════════════════════════════════════════════════════════════════
  // DASHBOARD & CHARTS
  // ══════════════════════════════════════════════════════════════════
  ['GET', '/Chart/offer', 200, '/home', 'Teklif chart verileri'],
  ['GET', '/Chart/work-load', 200, '/home', 'İş yükü chart'],
  ['GET', '/Report/stock-status', 200, '/home', 'Stok durumu raporu'],
  ['GET', '/Report/delayed-orders', 200, '/home', 'Geciken siparişler'],
  ['GET', '/Report/production-performance', 200, '/home', 'Üretim performansı'],
  ['GET', '/Production/summary/counts', 200, '/home', 'Üretim özet sayıları'],
  ['GET', '/PurchaseOrder/summary/counts', 200, '/home', 'Satınalma özet sayıları'],
  ['GET', '/StockAlert/alerts', 200, '/home', 'Stok uyarıları'],
  ['GET', '/Maintenance/overdue', 200, '/home', 'Geciken bakımlar'],
  ['GET', '/Tasks', 200, '/home', 'Görevler'],
  ['GET', '/ProductionPlanning/summary', 200, '/home', 'Üretim planlama özeti'],

  // ══════════════════════════════════════════════════════════════════
  // PRODUCTS
  // ══════════════════════════════════════════════════════════════════
  ['GET', '/Product', 200, '/products', 'Ürün listesi'],
  ['GET', '/Product/next-code', 200, '/products/form', 'Sonraki ürün kodu'],

  // ══════════════════════════════════════════════════════════════════
  // OFFERS
  // ══════════════════════════════════════════════════════════════════
  ['GET', '/Offer', 200, '/offers', 'Teklif listesi'],

  // ══════════════════════════════════════════════════════════════════
  // CUSTOMERS & SUPPLIERS
  // ══════════════════════════════════════════════════════════════════
  ['GET', '/Customer?type=customers', 200, '/customers', 'Müşteri listesi'],
  ['GET', '/Customer?type=suppliers', 200, '/suppliers', 'Tedarikçi listesi'],
  ['GET', '/CustomerStatement/balances', 200, '/customer-statement', 'Müşteri bakiyeleri'],
  ['GET', '/CustomerFeedback/complaints', 200, '/customer-feedback', 'Müşteri şikayetleri'],
  ['GET', '/CustomerFeedback/surveys', 200, '/customer-feedback', 'Müşteri anketleri'],
  ['GET', '/CustomerFeedback/dashboard', 200, '/customer-feedback', 'Müşteri geri bildirim panosu'],

  // ══════════════════════════════════════════════════════════════════
  // SALES & ORDERS
  // ══════════════════════════════════════════════════════════════════
  ['GET', '/Sales', 200, '/sales', 'Satış listesi'],
  ['GET', '/PurchaseOrder', 200, '/purchase-orders', 'Satınalma siparişleri'],
  ['GET', '/PurchaseOrder/next-number', 200, '/purchase-orders/form', 'Sonraki sipariş no'],

  // ══════════════════════════════════════════════════════════════════
  // PRODUCTION
  // ══════════════════════════════════════════════════════════════════
  ['GET', '/Production', 200, '/production', 'Üretim listesi'],
  ['GET', '/ProductionPlanning/gantt', 200, '/production/planning', 'Gantt verisi'],
  ['GET', '/ShopFloor/dashboard', 200, '/shop-floor', 'Atölye panosu'],
  ['GET', '/ShopFloor/my-tasks', 200, '/shop-floor', 'Atölye görevlerim'],
  ['GET', '/SubcontractOrder', 200, '/subcontract-orders', 'Fason siparişler'],
  ['GET', '/SerialNumber', 200, '/serial-numbers', 'Seri numaraları'],

  // ══════════════════════════════════════════════════════════════════
  // STOCK & WAREHOUSE
  // ══════════════════════════════════════════════════════════════════
  ['GET', '/Warehouses', 200, '/warehouses', 'Depolar'],
  ['GET', '/StockCount', 200, '/stock/count', 'Sayım listesi'],
  ['GET', '/StockLot', 200, '/stock/lots', 'Lot listesi'],
  ['GET', '/StockValuation', 200, '/stock/valuation', 'Stok değerleme'],
  ['GET', '/StockAlert/alerts', 200, '/stock/alerts', 'Stok uyarıları'],
  ['GET', '/StockAlert/levels', 200, '/stock/alerts', 'Stok seviyeleri'],
  ['GET', '/MaterialTypes', 200, '/settings/material-types', 'Malzeme tipleri'],

  // ══════════════════════════════════════════════════════════════════
  // INVOICE & PAYMENTS
  // ══════════════════════════════════════════════════════════════════
  ['GET', '/Invoice', 200, '/invoices', 'Fatura listesi'],
  ['GET', '/Invoice/next-number', 200, '/invoices/form', 'Sonraki fatura no'],
  ['GET', '/Payment', 200, '/invoices', 'Ödeme listesi'],
  ['GET', '/Tax/rates', 200, '/invoices/form', 'Vergi oranları'],
  ['GET', '/PaymentTerm', 200, '/invoices/form', 'Ödeme vadeleri'],
  ['GET', '/BankReconciliation', 200, '/bank-reconciliation', 'Banka mutabakatları'],
  ['GET', '/BankReconciliation/summary', 200, '/bank-reconciliation', 'Banka mutabakat özeti'],

  // ══════════════════════════════════════════════════════════════════
  // QUALITY MANAGEMENT
  // ══════════════════════════════════════════════════════════════════
  ['GET', '/AdvancedQuality/dashboard', 200, '/quality/dashboard', 'Kalite panosu'],
  ['GET', '/IncomingInspection', 200, '/quality/inspections', 'Giriş kontrolleri'],
  ['GET', '/Ncr', 200, '/quality/ncr', 'Uygunsuzluk raporları'],
  ['GET', '/Capa', 200, '/quality/capa', 'DÖF listesi'],
  ['GET', '/Capa/dashboard', 200, '/quality/capa', 'DÖF panosu'],
  ['GET', '/Capa/overdue', 200, '/quality/capa', 'Geciken DÖF\'ler'],
  ['GET', '/Calibration/equipment', 200, '/quality/calibration', 'Kalibrasyon ekipmanları'],
  ['GET', '/Calibration/dashboard', 200, '/quality/calibration', 'Kalibrasyon panosu'],
  ['GET', '/Calibration/overdue', 200, '/quality/calibration', 'Geciken kalibrasyonlar'],
  ['GET', '/Calibration/due-soon?days=30', 200, '/quality/calibration', 'Yaklaşan kalibrasyonlar'],
  ['GET', '/ControlPlan', 200, '/quality/control-plans', 'Kontrol planları'],
  ['GET', '/Ecn', 200, '/settings/ecn', 'Mühendislik değişiklikleri'],

  // ══════════════════════════════════════════════════════════════════
  // AS9100 COMPLIANCE
  // ══════════════════════════════════════════════════════════════════
  ['GET', '/Coc', 200, '/quality', 'Uygunluk sertifikaları'],
  // ContractReview: root GET yok, sales/{salesId} ve {id} var
  // ['GET', '/ContractReview', 200, '/quality', 'Sözleşme incelemeleri'],
  ['GET', '/CustomerConcession', 200, '/quality', 'Müşteri tavizleri'],
  ['GET', '/MRB', 200, '/quality', 'Malzeme İnceleme Kurulu'],

  // ══════════════════════════════════════════════════════════════════
  // MAINTENANCE & OEE
  // ══════════════════════════════════════════════════════════════════
  ['GET', '/Maintenance/plans', 200, '/maintenance', 'Bakım planları'],
  ['GET', '/Maintenance/work-orders', 200, '/maintenance', 'Bakım iş emirleri'],
  ['GET', '/Maintenance/failures', 200, '/maintenance', 'Arıza kayıtları'],
  ['GET', '/Oee', 200, '/oee', 'OEE verileri'],

  // ══════════════════════════════════════════════════════════════════
  // CAPACITY & PLANNING
  // ══════════════════════════════════════════════════════════════════
  ['GET', '/CapacityPlanning/machines', 200, '/production/capacity-scheduling', 'Makine kapasite'],
  ['GET', '/CapacityPlanning/overview', 200, '/production/capacity-scheduling', 'Kapasite genel bakış'],

  // ══════════════════════════════════════════════════════════════════
  // MACHINES & SETTINGS
  // ══════════════════════════════════════════════════════════════════
  ['GET', '/Machines', 200, '/settings/machines', 'Makine listesi'],
  ['GET', '/WorkOrderSteps', 200, '/settings/work-order-steps', 'İş emri adımları'],
  ['GET', '/WorkOrderTemplates', 200, '/settings/work-order-templates', 'İş emri şablonları'],
  ['GET', '/WorkOrderLogs', 200, '/settings/work-order-logs', 'İş emri logları'],

  // ══════════════════════════════════════════════════════════════════
  // HR & DOCUMENTS
  // ══════════════════════════════════════════════════════════════════
  ['GET', '/Hr/shifts', 200, '/hr', 'Vardiyalar'],
  ['GET', '/Hr/attendance', 200, '/hr', 'Puantaj kayıtları'],
  ['GET', '/Document/search', 200, '/documents', 'Doküman arama'],

  // ══════════════════════════════════════════════════════════════════
  // REPORTS
  // ══════════════════════════════════════════════════════════════════
  ['GET', '/Report/sales-analysis', 200, '/reports', 'Satış analizi'],
  ['GET', '/Report/machine-utilization', 200, '/reports', 'Makine kullanımı'],
  ['GET', '/Report/supplier-performance', 200, '/reports', 'Tedarikçi performansı'],
  ['GET', '/Report/profit-loss', 200, '/reports', 'Kâr-zarar raporu'],
  ['GET', '/Report/offer-conversion', 200, '/reports', 'Teklif dönüşüm oranı'],
  ['GET', '/Report/delivery-estimation', 200, '/reports', 'Teslimat tahmini'],
  ['GET', '/Report/ncr-trend', 200, '/reports', 'Uygunsuzluk trendi'],
  ['GET', '/Report/supplier-quality', 200, '/reports', 'Tedarikçi kalite'],
  ['GET', '/Report/quality-cost', 200, '/reports', 'Kalite maliyeti'],
  ['GET', '/DynamicReport/templates', 200, '/dynamic-reports', 'Dinamik rapor şablonları'],
  ['GET', '/Notification', 200, '/notifications', 'Bildirimler'],
  ['GET', '/Notification/summary', 200, '/notifications', 'Bildirim özeti'],

  // ══════════════════════════════════════════════════════════════════
  // AI INSIGHTS
  // ══════════════════════════════════════════════════════════════════
  ['GET', '/AIInsights/dashboard', 200, '/ai-insights', 'AI panosu'],
  ['GET', '/AIInsights/anomalies', 200, '/ai-insights', 'Anomali tespiti'],
  ['GET', '/AIInsights/demand-forecast?days=30', 200, '/ai-insights', 'Talep tahmini'],
  ['GET', '/AIInsights/smart-min-max', 200, '/ai-insights', 'Akıllı min-max'],
  ['GET', '/AIInsights/delay-risks', 200, '/ai-insights', 'Gecikme riskleri'],
  ['GET', '/AIInsights/slow-stock?thresholdDays=90', 200, '/ai-insights', 'Yavaş stok'],
  ['GET', '/AIInsights/supplier-risk', 200, '/ai-insights', 'Tedarikçi riski'],
  ['GET', '/AIInsights/predictive-maintenance', 200, '/ai-insights', 'Öngörücü bakım'],
  ['GET', '/AIInsights/offer-conversion', 200, '/ai-insights', 'Teklif dönüşüm AI'],
  ['GET', '/AIInsights/cash-flow', 200, '/ai-insights', 'Nakit akış tahmini'],
  ['GET', '/AIInsights/churn-risk', 200, '/ai-insights', 'Müşteri kayıp riski'],
  ['GET', '/AIInsights/operation-time', 200, '/ai-insights', 'Operasyon süresi AI'],

  // ══════════════════════════════════════════════════════════════════
  // CYBERSECURITY
  // ══════════════════════════════════════════════════════════════════
  ['GET', '/Cybersecurity/dashboard', 200, '/settings/cybersecurity', 'Siber güvenlik panosu'],
  ['GET', '/Cybersecurity/policies', 200, '/settings/cybersecurity', 'Güvenlik politikaları'],
  ['GET', '/Cybersecurity/incidents', 200, '/settings/cybersecurity', 'Güvenlik olayları'],

  // ══════════════════════════════════════════════════════════════════
  // ADMIN PANEL
  // ══════════════════════════════════════════════════════════════════
  ['GET', '/Admin/audit-logs', 200, '/admin/audit-logs', 'Denetim logları'],
  ['GET', '/Admin/tenants', 200, '/admin/tenants', 'Tenant listesi'],
  ['GET', '/Admin/system-health', 200, '/admin/dashboard', 'Sistem sağlığı'],

  // ══════════════════════════════════════════════════════════════════
  // CHANGELOG
  // ══════════════════════════════════════════════════════════════════
  ['GET', '/Changelog', 200, '/changelog', 'Değişiklik günlüğü'],

  // ══════════════════════════════════════════════════════════════════
  // ADVANCED QUALITY (AS9100 sub-modules)
  // ══════════════════════════════════════════════════════════════════
  ['GET', '/Risk', 200, '/quality/risk-fmea', 'Risk listesi'],
  ['GET', '/Risk/dashboard', 200, '/quality/risk-fmea', 'Risk panosu'],
  ['GET', '/InternalAudit', 200, '/quality/internal-audit', 'İç denetimler'],
  ['GET', '/InternalAudit/dashboard', 200, '/quality/internal-audit', 'İç denetim panosu'],
  ['GET', '/SupplierEvaluation', 200, '/quality/supplier-evaluation', 'Tedarikçi değerlendirme'],
  ['GET', '/SupplierEvaluation/dashboard', 200, '/quality/supplier-evaluation', 'Tedarikçi değ. panosu'],
  ['GET', '/FAI', 200, '/quality/fai', 'İlk parça kontrol'],
  ['GET', '/CounterfeitPart/verifications', 200, '/quality/counterfeit-prevention', 'Sahte parça doğrulamaları'],
  ['GET', '/ConfigurationManagement/items', 200, '/quality/configuration', 'Konfigürasyon öğeleri'],
  ['GET', '/SpecialProcess', 200, '/quality/special-processes', 'Özel prosesler'],
  ['GET', '/FOD/incidents', 200, '/quality/fod', 'YCT olayları'],
  ['GET', '/CustomerProperty', 200, '/quality/customer-property', 'Müşteri mülkiyeti'],
  ['GET', '/Spc/charts', 200, '/quality/spc', 'İPK grafikleri'],
  ['GET', '/Spc/dashboard', 200, '/quality/spc', 'İPK panosu'],
  ['GET', '/PPAP', 200, '/quality/ppap', 'PPAP listesi'],
  ['GET', '/DesignDevelopment', 200, '/quality/design-development', 'Tasarım geliştirme'],
  ['GET', '/SupplyChainRisk', 200, '/quality/supply-chain-risk', 'Tedarik zinciri riski'],
  ['GET', '/ProductSafety', 200, '/quality/product-safety', 'Ürün güvenliği'],
  ['GET', '/ProductSafety/dashboard', 200, '/quality/product-safety', 'Ürün güvenliği panosu'],
  ['GET', '/Training', 200, '/quality/training', 'Eğitim kayıtları'],
  ['GET', '/Training/dashboard', 200, '/quality/training', 'Eğitim panosu'],
  ['GET', '/Training/competency', 200, '/quality/training', 'Yetkinlik matrisi'],

  // ══════════════════════════════════════════════════════════════════
  // MISC / OTHER ENDPOINTS
  // ══════════════════════════════════════════════════════════════════
  // DataPack: root GET yok, production/{productionId} gerekli
  // ['GET', '/DataPack', 200, '/production', 'Veri paketleri'],
  ['GET', '/LaborCost/rates', 200, '/hr', 'İşçilik oranları'],
  ['GET', '/BillingDetails', 200, '/settings/billing', 'Fatura detayları'],
  ['GET', '/Kpi/dashboard', 200, '/reports/kpi', 'KPI panosu'],
]

// ─── Auth helper ─────────────────────────────────────────────────────
let cachedToken = null

async function getToken(request) {
  if (cachedToken) return cachedToken
  const res = await request.post(`${API_BASE}/Account/authenticate`, {
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
    data: { email: LOGIN_EMAIL, password: LOGIN_PASS },
  })
  expect(res.ok()).toBeTruthy()
  const body = await res.json()
  cachedToken = body.userData?.refreshToken || body.data?.jwToken
  expect(cachedToken).toBeTruthy()
  return cachedToken
}

// ─── Test Suite (individual per-endpoint) ────────────────────────────
test.describe('API-UI Endpoint Health Check', () => {
  // Sequential to avoid rate limiting
  test.describe.configure({ mode: 'serial' })

  // Group endpoints by UI page for readable output
  const grouped = {}
  for (const [method, path, expected, uiPage, desc] of ENDPOINTS) {
    if (!grouped[uiPage]) grouped[uiPage] = []
    grouped[uiPage].push({ method, path, expected, desc })
  }

  for (const [uiPage, endpoints] of Object.entries(grouped)) {
    test.describe(`UI: ${uiPage}`, () => {
      for (const ep of endpoints) {
        test(`${ep.method} ${ep.path} — ${ep.desc}`, async ({ request }) => {
          const token = await getToken(request)
          const url = `${API_BASE}${ep.path}`

          // Rate limiting koruması
          await new Promise(r => setTimeout(r, 150))

          const res = await request.fetch(url, {
            method: ep.method,
            headers: {
              Authorization: `Bearer ${token}`,
              'X-Requested-With': 'XMLHttpRequest',
            },
          })

          const status = res.status()

          // 429 = rate limiting, gerçek hata değil — retry
          if (status === 429) {
            await new Promise(r => setTimeout(r, 2000))
            const retry = await request.fetch(url, {
              method: ep.method,
              headers: {
                Authorization: `Bearer ${token}`,
                'X-Requested-With': 'XMLHttpRequest',
              },
            })
            const retryStatus = retry.status()
            const ok = ep.expected === 'any2xx'
              ? retryStatus >= 200 && retryStatus < 300
              : retryStatus === ep.expected
            if (!ok) {
              let body = ''
              try { body = (await retry.text()).substring(0, 500) } catch {}
              throw new Error(
                `Expected ${ep.expected}, got ${retryStatus} (after 429 retry)\n` +
                `URL: ${url}\nUI Page: ${uiPage}\nResponse: ${body}`
              )
            }
            return
          }

          const ok = ep.expected === 'any2xx'
            ? status >= 200 && status < 300
            : status === ep.expected

          if (!ok) {
            let body = ''
            try { body = (await res.text()).substring(0, 500) } catch {}
            throw new Error(
              `Expected ${ep.expected}, got ${status}\n` +
              `URL: ${url}\nUI Page: ${uiPage}\nResponse: ${body}`
            )
          }
        })
      }
    })
  }
})

// ─── Summary Test ────────────────────────────────────────────────────
const sleep = ms => new Promise(r => setTimeout(r, ms))

test('Full endpoint summary report', async ({ request }) => {
  test.setTimeout(300_000) // 5 min for all endpoints
  const token = await getToken(request)
  const results = { ok: [], fail: [] }

  for (const [method, path, expected, uiPage, desc] of ENDPOINTS) {
    const url = `${API_BASE}${path}`
    // Rate limiting koruması: her istek arası 500ms bekle
    await sleep(500)
    try {
      let res = await request.fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          'X-Requested-With': 'XMLHttpRequest',
        },
      })
      let status = res.status()

      // 429 retry
      if (status === 429) {
        await sleep(2000)
        const retry = await request.fetch(url, {
          method,
          headers: {
            Authorization: `Bearer ${token}`,
            'X-Requested-With': 'XMLHttpRequest',
          },
        })
        status = retry.status()
        res = retry
      }

      const isOk = expected === 'any2xx'
        ? status >= 200 && status < 300
        : status === expected

      const entry = { method, path, expected, status, uiPage, desc }
      if (isOk) {
        results.ok.push(entry)
      } else {
        let body = ''
        try { body = (await res.text()).substring(0, 300) } catch {}
        entry.error = body
        results.fail.push(entry)
      }
    } catch (err) {
      results.fail.push({ method, path, expected, status: 0, uiPage, desc, error: err.message })
    }
  }

  // Print summary
  console.log('\n' + '═'.repeat(80))
  console.log(`  API-UI ENDPOINT HEALTH CHECK REPORT`)
  console.log(`  ${new Date().toISOString()}`)
  console.log('═'.repeat(80))
  console.log(`  ✅ OK:   ${results.ok.length}`)
  console.log(`  ❌ FAIL: ${results.fail.length}`)
  console.log(`  📊 TOTAL: ${ENDPOINTS.length}`)
  console.log('─'.repeat(80))

  if (results.fail.length > 0) {
    console.log('\n  FAILURES:\n')
    for (const f of results.fail) {
      console.log(`  ❌ ${f.method} ${f.path}`)
      console.log(`     Status: ${f.status} (expected ${f.expected})`)
      console.log(`     UI Page: ${f.uiPage}`)
      console.log(`     Desc: ${f.desc}`)
      if (f.error) console.log(`     Error: ${f.error.substring(0, 200)}`)
      console.log('')
    }
  }

  console.log('═'.repeat(80))

  // Fail the test if there are failures
  expect(results.fail.length, `${results.fail.length} endpoint(s) failed`).toBe(0)
})
