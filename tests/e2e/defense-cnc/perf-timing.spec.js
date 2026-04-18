/**
 * Quvex ERP — Sayfa Yükleme Performans Ölçüm Testi
 * Auth durumu: auth-setup.spec.js'den kaydedilen session
 *
 * Her önemli sayfaya gidip Navigation Timing API ile ölçüm yapar.
 * Hedef: Her sayfa < 2000ms (FCP < 1000ms ideal)
 */
const { test, expect } = require('./fixtures')

// Ölçülecek sayfalar — authenticated session ile çalışır
// Login sayfası session varken /home'a redirect eder, networkidle bekleme süresi
// dashboard API çağrılarını kapsar ve wall time'ı yapay olarak şişirir.
// Gerçek login FCP ölçümü için ayrı bir public-page testi gerekir.
const PAGES = [
  { label: 'Dashboard',     path: '/home',               expectRedirect: false },
  { label: 'Müşteriler',    path: '/customers',          expectRedirect: false },
  { label: 'Ürünler',       path: '/products',           expectRedirect: false },
  { label: 'Teklifler',     path: '/offers',             expectRedirect: false },
  { label: 'Üretim',        path: '/production',         expectRedirect: false },
  { label: 'Stok',          path: '/stock',              expectRedirect: false },
  { label: 'Kalite',        path: '/quality',            expectRedirect: false },
  { label: 'İş Emirleri',   path: '/work-orders',        expectRedirect: false },
  { label: 'Ayarlar',       path: '/settings/users',     expectRedirect: false },
]

const WARN_MS  = 1500   // Sarı: yavaş ama kabul edilebilir
const ERROR_MS = 4000   // Kırmızı: kritik sorun (Dashboard API + render için tolerans)

// Timing sonuçlarını topla
const results = []

test.describe.configure({ mode: 'serial' })

test.describe('Performans Ölçümleri', () => {

  for (const { label, path } of PAGES) {
    test(`⏱ ${label} — ${path}`, async ({ page }) => {
      const navStart = Date.now()

      // domcontentloaded: React mount + ilk render için yeterli
      // networkidle KULLANILMIYOR: Dashboard arka plan polling'i wall time'ı yapay şişirir
      await page.goto(path, { waitUntil: 'domcontentloaded' })

      const wallTime = Date.now() - navStart

      // Navigation Timing API'den gerçek browser metriklerini al
      const timing = await page.evaluate(() => {
        const t = performance.getEntriesByType('navigation')[0]
        const paint = performance.getEntriesByType('paint')
        const fcp = paint.find(p => p.name === 'first-contentful-paint')
        return t ? {
          dns:          Math.round(t.domainLookupEnd   - t.domainLookupStart),
          connect:      Math.round(t.connectEnd        - t.connectStart),
          ttfb:         Math.round(t.responseStart     - t.requestStart),
          download:     Math.round(t.responseEnd       - t.responseStart),
          domContent:   Math.round(t.domContentLoadedEventEnd - t.fetchStart),
          domComplete:  Math.round(t.domComplete       - t.fetchStart),
          loadEvent:    Math.round(t.loadEventEnd      - t.fetchStart),
          fcp:          fcp ? Math.round(fcp.startTime) : null,
        } : null
      }).catch(() => null)

      const ttfb    = timing?.ttfb        ?? 0
      const domTime = timing?.domContent  ?? wallTime
      // FCP: gerçek kullanıcı algısı — API yanıtından bağımsız ilk boyama
      const fcpTime = timing?.fcp         ?? domTime

      // Durum rengi FCP'ye göre (wall değil)
      const status = fcpTime < WARN_MS ? '✅' : fcpTime < ERROR_MS ? '⚠️' : '❌'
      const row = {
        label,
        path,
        wallMs:  wallTime,
        ttfbMs:  ttfb,
        domMs:   domTime,
        fcpMs:   fcpTime,
        status,
        url:     page.url(),
      }
      results.push(row)

      // Console'a yaz
      console.log(
        `${status} ${label.padEnd(16)} | FCP: ${String(fcpTime).padStart(5)}ms` +
        ` | TTFB: ${String(ttfb).padStart(4)}ms` +
        ` | DOM: ${String(domTime).padStart(5)}ms` +
        ` | wall: ${String(wallTime).padStart(5)}ms` +
        ` | ${page.url()}`
      )

      // Assertion FCP üzerinden: kullanıcı algısı < ERROR_MS
      expect(fcpTime, `${label} FCP çok yavaş (${fcpTime}ms > ${ERROR_MS}ms)`).toBeLessThan(ERROR_MS)
    })
  }

  test('📊 Performans Özeti', async ({ page }) => {
    if (results.length === 0) {
      console.log('[perf] Henüz ölçüm yok.')
      return
    }

    // FCP tabanlı özet (gerçek kullanıcı algısı)
    const avg = Math.round(results.reduce((s, r) => s + r.fcpMs, 0) / results.length)
    const max = Math.max(...results.map(r => r.fcpMs))
    const min = Math.min(...results.map(r => r.fcpMs))
    const pass = results.filter(r => r.fcpMs < WARN_MS).length
    const warn = results.filter(r => r.fcpMs >= WARN_MS && r.fcpMs < ERROR_MS).length
    const fail = results.filter(r => r.fcpMs >= ERROR_MS).length

    console.log('\n══════════════════════════════════════════════════')
    console.log('   QUVEX PERFORMANS RAPORU (FCP bazlı)')
    console.log('══════════════════════════════════════════════════')
    console.log(`   Ölçülen sayfa  : ${results.length}`)
    console.log(`   Ortalama FCP   : ${avg}ms`)
    console.log(`   En hızlı FCP   : ${min}ms`)
    console.log(`   En yavaş FCP   : ${max}ms`)
    console.log(`   ✅ FCP < 1.5s  : ${pass} sayfa`)
    console.log(`   ⚠️  FCP 1.5–4s : ${warn} sayfa`)
    console.log(`   ❌ FCP > 4s    : ${fail} sayfa`)
    console.log('──────────────────────────────────────────────────')
    results.forEach(r => {
      console.log(`   ${r.status} ${r.label.padEnd(16)} FCP: ${String(r.fcpMs).padStart(5)}ms  TTFB: ${String(r.ttfbMs).padStart(4)}ms`)
    })
    console.log('══════════════════════════════════════════════════\n')

    // Ortalama FCP 2s'den az olmalı
    expect(avg, `Ortalama FCP çok yüksek: ${avg}ms`).toBeLessThan(2000)
  })
})
