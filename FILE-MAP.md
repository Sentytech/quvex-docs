# Quvex ERP — Dokumantasyon Haritasi

> Son guncelleme: 2026-04-12 (Sprint 11) | Toplam: ~160 dosya (14 klasor)

## Klasor Yapisi

```
quvex-docs/
  CLAUDE.md              # Proje calisma kurallari
  FILE-MAP.md            # Bu dosya — dokumantasyon indeksi
  product/               # Urun tanimi, is bilgisi, onboarding
  architecture/          # Teknik mimari, deployment, guvenlik
  analysis/              # Proje analizleri ve raporlar
  roadmap/               # Yol haritalari ve faz planlari
  sprints/               # Sprint planlari ve takibi
  tasks/                 # Gorev tanimlari (API + UI)
  bugs/                  # Hata takibi
  tests/                 # E2E test planlari ve Playwright testleri
  training/              # Ekip egitim rehberleri
  marketing/             # Brosurler, rakip analizi, gorseller
  specs/                 # Tasarim ve prompt sablonlari
  user-guide/            # Son kullanici HTML dokumantasyonu
  QuvexLanding/          # Astro landing site (ayri uygulama)
```

---

## product/ — Urun Tanimi ve Is Bilgisi

| Dosya | Aciklama |
|-------|----------|
| PRD.md | Urun gereksinimleri dokumani v3.0 — moduller, kapsam, ozellikler |
| BUSINESS-KNOWHOW.md | Uretim sektoru is bilgisi — surecler, roller, is akislari (844 satir) |
| ONBOARDING.md | Yeni gelistirici onboarding rehberi — kurulum, mimari, API/UI (38K) |
| DURUM.md | Proje durum ozeti — tamamlanan fazlar, test sayilari |
| CHANGELOG.md | Surum bazli degisiklik kaydi |

## architecture/ — Teknik Mimari ve DevOps

| Dosya | Aciklama |
|-------|----------|
| API-UI-ENDPOINT-MAP.md | 170+ endpoint esleme haritasi (API ↔ UI) — Sprint 11 ile guncel |
| DEPLOYMENT-GUIDE.md | Production deployment rehberi — Docker, env vars, SSL |
| TENANT-SCALING-ARCHITECTURE.md | Multi-tenant mimari tasarimi |
| TENANT-20-PLAN.md | 20 tenant deployment plani |
| TENANT-50-PLAN.md | 50 tenant deployment plani |
| 1000-TENANT-SCALABILITY-PLAN.md | 1000 tenant olcekleme plani — sharding, connection pooling |
| REFRESH-TOKEN-SECURITY-UPGRADE.md | Refresh token guvenlik yukseltmesi — rotation, revocation |
| DISASTER-RECOVERY-RUNBOOK.md | Felaket kurtarma runbook — backup, restore, failover prosedurleri |
| SECURITY-AUDIT-CHECKLIST.md | Guvenlik denetim kontrol listesi (Sprint 11 sertlestirme eklendi) |
| ENDPOINT-TEST-PROMPT.md | Hizli endpoint test prompt sablonu |
| BUNDLE_ANALYSIS.md | UI bundle optimizasyonu — recharts, xlsx, antd, moment.js |
| TEST-RESULTS.md | Bulk insert test sonuclari |
| 2026-03-29-quvex-code-cleanup-plan.md | Kod temizlik plani |

## analysis/ — Proje Analizleri

| Dosya | Aciklama |
|-------|----------|
| QUVEX_FULL_ANALYSIS.md | Master analiz dokumani — tum proje ozeti (2026-04-06) |
| PROJECT_ANALYSIS.md | Kapsamli proje raporu |
| LIVE_ANALYSIS_2026-03-08.md | Canli codebase analizi |
| AS9100_TARGET_FIT_ANALYSIS_2026-03-09.md | Savunma sanayi AS9100 uyum analizi |
| ERP_EKSIK_ANALIZI.md | Ozellik eksiklik analizi |
| GAP_ANALYSIS_AND_WORKPLAN.md | PRD'ye karsi gap analizi |
| DEEP_ANALYSIS_AND_PHASES.md | Surec analizi ve faz planlama |
| IMPLEMENTATION_SUMMARY.md | PRD iyilestirme ozeti |
| QUVEX-FINANCE-ANALYSIS.md | Finansal modul olgunluk analizi |
| QUVEX-MARKET-ANALYSIS.md | Pazar ve rakip analizi |
| ACTION-PLAN.md | Eksiklik analizi ve aksiyon plani |
| CNC-USER-JOURNEY-UX-AUDIT.md | CNC kullanici yolculugu UX denetimi |
| UX-AUDIT-METAL-MOBILYA-TEKSTIL.md | Metal/mobilya/tekstil sektor UX denetimi |
| UX-AUDIT-GIDA-OTOMOTIV-PLASTIK-MAKINE.md | Gida/otomotiv/plastik/makine sektor UX denetimi |
| UX-AUDIT-KAYNAK-MEDIKAL.md | Kaynak atolyesi ve medikal cihaz UX denetimi |
| UX-AUDIT-MASTER-CROSS-SECTOR.md | Tum sektor UX master raporu — cross-sector bulgular |
| QUVEX-FINAL-STRATEGY-2026.md | 2026 final urun stratejisi — sektor kapsamasi, fiyatlandirma, yol haritasi |
| ADMIN-PANEL-1000-TENANT-AUDIT-2026-04-14.md | 1000 tenant admin panel olgunluk denetimi — 62 eksik, 4 disiplin, 12 ay roadmap (471 satir) |
| QUVEX-SUSTAINABILITY-AUDIT-2026-04-14.md | Yonetim + surdurulebilirlik denetimi — operasyonel toil, kod + ekip, gozlemlenebilirlik + governance + compliance (38 eksik, 28 ticket, 12 ay plan) |

## roadmap/ — Yol Haritalari

| Dosya | Aciklama |
|-------|----------|
| QUVEX-ROADMAP.md | Master yol haritasi — 7 faz, tum moduller |
| FAZLANDIRMA.md | Detayli faz kirilimi — 9 faz, 107 madde |
| SPRINT_EXECUTION_PLAN_2026-03-09.md | Sprint yurutme plani (1346 satir) |
| QUVEX-SCALING-ROADMAP.md | Kucuk → Orta olcek buyume plani |
| AI-POWERED-ERP-ROADMAP.md | AI entegrasyon yol haritasi |
| ROADMAP-FINANS.md | Finans modulu yol haritasi |
| ROADMAP-KALITE.md | Kalite modulu yol haritasi |
| ROADMAP-SATIS.md | Satis modulu yol haritasi |
| ROADMAP-STOK.md | Stok modulu yol haritasi |
| ROADMAP-URETIM.md | Uretim modulu yol haritasi |

## sprints/ — Sprint Planlari

| Dosya | Aciklama |
|-------|----------|
| SPRINT-PLAN.md | Master sprint plani — 8 sprint tamamlandi |
| SPRINT-UX-PLAN.md | Satis modulleri UX iyilestirme plani |
| SPRINT-TENANT-50.md | 50 tenant olcekleme sprinti |
| SPRINT-BUGFIX-2026-04-02.md | Bug fix sprinti — 6 kritik API hatasi |
| SPRINT-TEST-BUGS-2026-04-03.md | Test fazi bulgulari |
| SPRINT-FINALIZE-2026-04-11.md | Urun finalize sprinti — 2 gun, 5 sektor testi, API fix |
| SPRINT-11-KAPSAYICI-URUN-2026-04-12.md | Sprint 11 — Kapsayici urun (ProductVariant, HACCP, Recall, Mold, CE, WPS, ProductionBoard, WhatsApp, Onboarding) |

## tasks/ — Gorev Tanimlari

### tasks/api/ — Backend Gorevleri (15 dosya)

| Dosya | Aciklama |
|-------|----------|
| FAZ1-C101 ~ C112 | Faz 1 altyapi gorevleri (repo pattern, exception handler, validation, pagination, secrets, auth, sifre, loglama, test, rate limit, health check, sensitive data) |
| FAZ2-F201 ~ F203 | Faz 2 finansal gorevler (fatura, KDV, odeme) |
| BUG-001, BUG-002 | Swagger NonAction fix, DB eksik TenantId |

### tasks/ui/ — Frontend Gorevleri (14 dosya)

| Dosya | Aciklama |
|-------|----------|
| FAZ1-C201 ~ C210 | Faz 1 UI gorevleri (service layer, error handling, vitest, loading, credentials, route, 401, cleanup, env, bundle) |
| FAZ4-C401 ~ C403 | Faz 4 ileri gorevler (rebranding, stok form, permission matrix) |
| BUG-007 | Pagination response fix |

## bugs/ — Hata Takibi

| Dosya | Aciklama |
|-------|----------|
| BUG-LIST-v2.md | Genel hata listesi (guncel) |
| CONSOLE-ERRORS.md | Konsol hatalari takibi (TAMAMLANDI) |
| SALES-MODULE-BUGS.md | Satis modulu hatalari |
| QUALITY-MODULE-BUGS.md | Kalite modulu hatalari |
| STOCK-MODULE-BUGS.md | Stok modulu hatalari |
| REPORTS-MODULE-BUGS.md | Rapor modulu hatalari |
| MAINTENANCE-MODULE-BUGS.md | Bakim modulu hatalari |

## tests/ — Test Planlari ve E2E

| Dosya | Aciklama |
|-------|----------|
| TEST-PLAN-E2E-v4.md | Guncel E2E test plani (v4) |
| TEST-CHECKLIST-E2E.md | Cok fazli E2E kontrol listesi |
| ALTAY-YAZILIM-E2E-PLAN.md | Savunma sanayi tam is akisi senaryosu |
| cnc/E2E_DEFENSE_CNC_TEST_SCENARIO.md | Savunma CNC test senaryosu |
| cnc/SAVUNMA_CNC_ADIM_ADIM_TEST_REHBERI.md | CNC adim adim test rehberi |
| cnc/KUCUK_CNC_ATOLYE_UCTAN_UCA_TEST.md | Kucuk CNC atolye senaryosu |
| OTOMOTIV-YAN-SANAYI-E2E-SENARYO.md | Otomotiv yan sanayi E2E (38 adim, PPAP) |
| PLASTIK-ENJEKSIYON-E2E-SENARYO.md | Plastik enjeksiyon E2E (33 adim, BOM/MRP) |
| GIDA-URETIMI-E2E-SENARYO.md | Gida uretimi E2E (38 adim, HACCP/recall) |
| TEKSTIL-URETIMI-E2E-SENARYO.md | Tekstil uretimi E2E (44 adim, AQL/boya lot) |
| KAYNAK-ATOLYESI-E2E-SENARYO.md | Kaynak atolyesi E2E (38 adim, TIG/GTAW, AWS D17.1, NDT) |
| ISIL-ISLEM-FASON-E2E-SENARYO.md | Isil islem fason E2E (33 adim, AMS 2759, sertlik testi) |
| YUZEY-ISLEM-KAPLAMA-E2E-SENARYO.md | Yuzey islem/kaplama E2E (35 adim, anodize, kadmiyum, MIL-PRF) |
| KOMPOZIT-IMALAT-E2E-SENARYO.md | Kompozit imalat E2E (41 adim, prepreg, otoklav, TAI IHA) |
| ELEKTRONIK-KART-MONTAJ-E2E-SENARYO.md | Elektronik kart montaj E2E (34 adim, SMD/THT, IPC Class 3, HAVELSAN) |
| SAVUNMA-OZEL-PROSESLER-E2E-SENARYO.md | 4 ozel proses: NDT (18), Optik (17), Dokum (20), Kalip (18 adim) |
| METAL-ESYA-CELIK-KONSTRUKSIYON-E2E-SENARYO.md | Metal esya/celik E2E (56 adim, EN 1090, raf+yangin kapisi) |
| MAKINE-IMALATI-E2E-SENARYO.md | Makine imalati E2E (69 test noktasi, CE, konveyor+paketleme) |
| MEDIKAL-CIHAZ-E2E-SENARYO.md | Medikal cihaz E2E (36 adim, ISO 13485, ortopedik vida, recall) |
| MOBILYA-IMALAT-E2E-SENARYO.md | Mobilya imalat E2E (31 adim, otel seti, CNC router, lake boya) |
| e2e/ | Playwright test dosyalari (~30 spec) |
| e2e/sectors/otomotiv-e2e.spec.js | Otomotiv Playwright E2E (20 test, PPAP/SPC) |
| e2e/sectors/metal-esya-e2e.spec.js | Metal esya Playwright E2E (20 test, kesim/bukme/kaynak) |
| e2e/sectors/medikal-e2e.spec.js | Medikal cihaz Playwright E2E (20 test, UDI/recall) |
| e2e/sectors/fixtures.js | Sektor testleri icin paylasilan fixture |
| e2e/sectors/helpers.js | Sektor testleri icin yardimci fonksiyonlar |
| playwright.config.js | Playwright yapilandirmasi |

## training/ — Ekip Egitim Rehberleri

| Dosya | Aciklama |
|-------|----------|
| 00-HIZLI-BASLANGIC.md | Hizli baslangic rehberi (5 dk) |
| 01-SATIS-EKIBI-REHBERI.md | Satis ekibi kullanim rehberi |
| 02-TEKNIK-DESTEK-REHBERI.md | Teknik destek rehberi |
| 03-TEST-EKIBI-REHBERI.md | QA ekibi rehberi |
| 04-EKRAN-HARITASI-VE-ILISKILER.md | Ekran haritasi ve modul iliskileri |
| 05-ORNEKLERLE-OGRENME.html | Orneklerle ogrenme (HTML) |
| 06-UX-AUDIT-VE-IYILESTIRME-PLANI.html | UX denetim ve iyilestirme plani |
| screenshots/ | Egitim ekran goruntuleri (14 PNG) |

## marketing/ — Pazarlama Materyalleri

| Dosya | Aciklama |
|-------|----------|
| VIDEO-SCRIPT.md | 60 saniyelik urun demo senaryosu |
| **brochures/** | |
| brosur-01-yonetici-ozeti.md/html | Yonetici ozeti brosuru |
| brosur-02-sektorel-cozum.md/html | Sektorel cozum brosuru |
| brosur-03-ozellik-karsilastirma.md/html | Ozellik karsilastirma tablosu |
| brosur-04-tek-sayfa-satis.md/html | Tek sayfa satis dokumani |
| brosur-05-teknik-veri-sayfasi.md/html | Teknik veri sayfasi |
| **competitive/** | |
| derin-rakip-karsilastirma.md | Derin rakip karsilastirma analizi |
| rakip-analizi-ve-eksikler.md | Rakip analizi ve eksiklikler |
| rakip-analizi-aksiyon-prompt.md | Rakip analizi aksiyon promptu |
| **sales/** (YENI) | |
| SALES-PITCH-DECK.md | Satis sunum deck'i — problem, cozum, ROI, referans |
| DEMO-SCRIPT.md | Canli demo senaryosu — adim adim gosterim akisi |
| PRICING-STRATEGY.md | Fiyatlandirma stratejisi — paket/tier, musteri segmenti |
| **plans/** | |
| AI-IS-PLANI.md | AI ozellik yol haritasi |
| P0-PLATFORM-FAZ-PLANI.md | Platform faz plani (Cloud, i18n, Mobile, SaaS) |
| SPRINT-PLANI-PLATFORM.md | Platform sprint plani |
| **visuals/** | |
| gorsel-01 ~ 05.html | Sosyal medya ve sunum sablonlari |
| images/ | Olusturulmus gorseller (9 PNG) |

## specs/ — Tasarim Sablonlari

| Dosya | Aciklama |
|-------|----------|
| 2026-04-01-quvex-landing-site-design.md | Landing page tasarim speci |
| USER-DOCS-PROMPT.md | Kullanici dokumantasyonu olusturma promptu |

## user-guide/ — Son Kullanici Dokumantasyonu (HTML)

| Klasor | Icerik |
|--------|--------|
| index.html | Ana sayfa |
| roles/ | Rol bazli rehberler (5): fabrika sahibi, uretim muduru, kalite muduru, CNC operatoru, muhasebeci |
| modules/ | Modul rehberleri (8): stok, uretim, kalite, satis, finans, IK, satinalma, surecler |
| utilities/ | Yardimci sayfalar: hata mesajlari, sorun giderici, SSS, terimler, iliski haritasi, raporlar, bakim, ayarlar, ilk adimlar |
| workflows/ | Is akislari: teklif → siparis → uretim → sevk |
| sectors/ | Sektor rehberleri: CNC metal isleme, savunma/havacilik, otomotiv yan sanayi |
| js/ | Arama ve interaktif ozellikler |

## QuvexLanding/ — Astro Landing Site

Ayri deployable uygulama. Detay icin `QuvexLanding/README.md`.
