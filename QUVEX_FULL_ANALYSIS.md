# QUVEX ERP - Kapsamli Proje Analizi

**Tarih:** 2026-04-06
**Analiz Edilen Repolar:** smallFactory (hub), smallFactoryApi (backend), smallFactoryUI (frontend)

---

## 1. GENEL BAKIS

| Bilgi | Deger |
|-------|-------|
| **Proje Adi** | Quvex ERP |
| **Alan** | Kucuk-Orta Olcekli Uretim Takip (Savunma/Havacilik) |
| **Mimari** | Clean Architecture (.NET 8) + React 18 SPA |
| **Veritabani** | PostgreSQL 16 + PgBouncer + Redis |
| **Multi-Tenancy** | Schema-per-tenant (143 entity HasQueryFilter) |
| **Test Toplami** | 1223 API (xUnit) + 686 UI (Vitest) + 48 E2E (Playwright) = ~1957 |
| **API URL** | http://localhost:5052 |
| **UI URL** | http://localhost:3000 |
| **Login** | admin@quvex.com / Admin123!@#$ |

---

## 2. REPO YAPISI

### 2.1 smallFactory/ (Hub - Dokumantasyon & Test Merkezi)

```
smallFactory/
├── analysis/         # 11 MD - Pazar, gap, AS9100 analizi
├── bugs/             # Modul bazli bug takibi (5 modul)
├── docs/             # 17+ MD - PRD, DURUM, CHANGELOG, Deployment
│   ├── training/     # 6 egitim rehberi (satis, QA, destek)
│   └── screenshots/  # 12+ ekran goruntusu
├── roadmap/          # 10 MD - Fazlandirma, modul yol haritalari
├── sprints/          # 3 sprint plani
├── tasks/            # Faz bazli gorev takibi
│   ├── api/          # FAZ1-C101..FAZ2+ API gorevleri
│   └── ui/           # FAZ1-C201..FAZ4+ UI gorevleri
└── tests/
    ├── e2e/          # Playwright testleri (api, auth, core, crud, quality, screens)
    └── cnc/          # Savunma CNC test senaryolari
```

### 2.2 smallFactoryApi/ (Backend - .NET 8 Clean Architecture)

```
smallFactoryApi/
├── src/
│   ├── Quvex.API/           # 227 .cs - Controller, Middleware, Auth
│   │   ├── Controllers/     # 149 controller
│   │   ├── Middleware/       # 10 custom middleware
│   │   ├── Auth/             # JWT + YetkiDenetimi
│   │   ├── DataAccess/       # QuvexDBContext (177 DbSet)
│   │   └── Migrations/      # EF Core migration'lar
│   ├── Quvex.Application/   # 386 .cs - Service, DTO, Validator
│   │   ├── Services/        # 108 servis sinifi
│   │   ├── Interfaces/      # 117 interface
│   │   ├── DTOs/            # Data transfer nesneleri
│   │   └── Validators/      # FluentValidation
│   ├── Quvex.Domain/        # 210 .cs - Entity, Enum
│   │   ├── Entities/        # 125 entity (15 kategori)
│   │   └── Enums/           # Enum tanimlari
│   └── Quvex.Infrastructure/ # 14 .cs - Repository, External Service
├── tests/
│   └── Quvex.API.Tests/     # 145 test dosyasi (xUnit + Moq + FluentAssertions)
├── docs/                    # Deployment, DR, KVKK, SSL, SLA
├── k8s/                     # Kubernetes manifest'leri
├── nginx/                   # Nginx yapilandirmasi
├── postgres/                # PostgreSQL kurulum script'leri
├── pgbouncer/               # Connection pooling
├── Quvex.sln                # Solution dosyasi
├── Dockerfile               # Multi-stage build
└── docker-compose.*.yml     # 4 compose dosyasi (db, api, demo, staging)
```

### 2.3 smallFactoryUI/ (Frontend - React 18 + Vite)

```
smallFactoryUI/
├── src/
│   ├── @core/           # Temel framework bilesenleri (20 component)
│   ├── components/      # Paylasilmis bilesenler (27 dosya)
│   ├── views/           # Sayfa bilesenleri (262 dosya, 28 modul)
│   ├── services/        # API servis katmani (100+ servis)
│   ├── redux/           # State management (auth, navbar, layout)
│   ├── router/          # Rota tanimlari (882 satir)
│   ├── locales/         # i18n cevirileri (TR/EN)
│   ├── hooks/           # Custom React hook'lari
│   ├── layouts/         # Layout bilesenleri
│   └── auth/            # JWT servis + CASL ACL
├── e2e/                 # Playwright E2E testleri (47 spec)
├── docs/                # 16 MD - Onboarding, Sprint, Test
├── vite.config.js       # Build yapilandirmasi
├── vitest.config.js     # Test yapilandirmasi
└── playwright.config.js # E2E yapilandirmasi
```

---

## 3. TEKNOLOJI YIGINI

### Backend

| Teknoloji | Versiyon | Amac |
|-----------|----------|------|
| .NET / C# | 8.0 / C# 12 | Runtime & Dil |
| ASP.NET Core | 8.0 | Web Framework |
| Entity Framework Core | 8.0.4 | ORM |
| PostgreSQL | 16-alpine | Veritabani |
| Npgsql | 8.0.4 | PG Driver |
| AutoMapper | 15.1.1 | Nesne Esleme |
| FluentValidation | 11.3.0 | Validasyon |
| Swagger/Swashbuckle | 6.5.0 | API Dokumantasyon |
| Serilog | 8.0.0 | Yapisal Loglama |
| JWT | 8.14.0 | Kimlik Dogrulama |
| Hangfire | 1.8.17 | Arkaplan Is |
| Redis | StackExchange 8.0.0 | Dagitik Cache |
| Iyzipay | 2.1.61 | Odeme (TR) |
| QuestPDF | 2024.3.0 | PDF Uretimi |
| ClosedXML | 0.102.3 | Excel Islemleri |
| Sentry | 4.12.1 | Hata Takibi |
| SignalR | 8.0 | Gercek Zamanli |

### Frontend

| Teknoloji | Versiyon | Amac |
|-----------|----------|------|
| React | 18.3.1 | UI Framework |
| Vite | 6.4.1 | Build Araci |
| Ant Design | 5.29.3 | UI Kutuphane |
| Redux Toolkit | 1.8.0 | State Yonetimi |
| React Router | 6.30.3 | Yonlendirme |
| Axios | 1.13.6 | HTTP Client |
| CASL | 6.8.0 | Yetki Yonetimi (RBAC) |
| i18next | 21.4.0 | Coklu Dil (TR/EN) |
| SignalR | 8.0.0 | Gercek Zamanli Bildirim |
| Playwright | 1.58.2 | E2E Test |
| Vitest | 3.2.4 | Unit Test |
| Sentry | 10.43.0 | Hata Takibi |
| FullCalendar | 5.10.1 | Takvim/Planlama |
| Recharts + ApexCharts | 3.8 / 3.29 | Grafik |
| Framer Motion | 12.36.0 | Animasyon |

---

## 4. SAYISAL OZET

| Metrik | Deger |
|--------|-------|
| **Toplam .cs Dosyasi** | 837 (uretim) + 145 (test) |
| **Toplam .js/.jsx Dosyasi** | 572 |
| **Toplam .scss/.css Dosyasi** | 175 |
| **Controller Sayisi** | 149 |
| **Servis Sayisi (API)** | 108 |
| **Entity Sayisi** | 125 (15 kategori) |
| **Interface Sayisi** | 117 |
| **DbSet Sayisi** | 177 |
| **Middleware Sayisi** | 10 custom |
| **Frontend Servis Sayisi** | 100+ |
| **Sayfa/View Sayisi** | 262 (28 modul) |
| **Rota Sayisi** | 882+ satir |
| **NuGet Paket** | 50+ |
| **npm Paket** | 80+ |
| **Docker Compose** | 4 dosya |

---

## 5. ENTITY KATEGORILERI (Domain Layer)

| Kategori | Sayi | Ornek Entity'ler |
|----------|------|-----------------|
| Production | 20+ | WorkOrder, Productions, BOM, WorkOrderSteps, WorkOrderLogs |
| Quality | 15+ | QualityControlPlan, NonConformanceReport, InspectionMeasurement |
| Inventory | 12+ | Product, StockLots, StockWarehouses, Warehouses |
| Maintenance | 8+ | MaintenancePlan, MachineFailure, CalibrationEquipment |
| Billing/Accounting | 15+ | Invoice, Payment, JournalEntry, ChartOfAccount |
| Sales | 8+ | Customer, Offers, Sales, SalesOrder |
| Advanced/Compliance | 20+ | KpiAnalytics, SpcControl, Ppap, SupplierEvaluation |
| HR | 6+ | EmployeeShift, Attendance, ShiftDefinition |
| Identity | 8+ | User, Role, Permission, Menu |
| Storage | 4+ | Files, ProductFiles, Document |

---

## 6. MIDDLEWARE & GUVENLIK

### 10 Custom Middleware

| Middleware | Amac |
|------------|------|
| ExceptionHandlingMiddleware | Global hata yakalama |
| MetricsMiddleware | Istek/yanit sureleri |
| RequestLoggingMiddleware | Yapisal istek loglama |
| RequestValidationMiddleware | Giris validasyonu |
| SecurityHeadersMiddleware | HSTS, CSP, X-Frame-Options |
| CsrfValidationMiddleware | CSRF token dogrulama |
| TenantRateLimitMiddleware | Tenant bazli hiz siniri |
| LocalizationMiddleware | Coklu dil destegi |
| TenantLogEnricher | Tenant bilgisi log zenginlestirme |
| ErrorResponse | Standart hata format |

### Guvenlik Ozellikleri

- JWT Bearer token + Refresh token rotasyonu
- YetkiDenetimi ActionFilter (custom RBAC)
- CASL ACL (frontend yetki)
- CSRF koruması (X-Requested-With header)
- Hesap kilitleme: 5 basarisiz → 15dk kilit
- Sifre politikasi: 12+ karakter, karmasiklik
- Dosya yukleme: whitelist, 10MB limit, MIME dogrulama
- SecurityAuditService: [SECURITY] log'lar
- Correlation ID (X-Correlation-Id header)
- Token'lar sessionStorage'da (XSS koruması)
- Uretim ortaminda source map kapali
- Multi-tenancy izolasyonu (143 entity HasQueryFilter)

---

## 7. TEST ALTYAPISI

### API Testleri (xUnit) - 1223 test

| Kategori | Kapsam |
|----------|--------|
| Architecture | Clean Architecture uyumluluk (NetArchTest) |
| Auth | Kimlik dogrulama & yetkilendirme |
| Configuration | Baslangic yapilandirmasi |
| Controllers | Controller entegrasyon testleri |
| DataAccess | DB context & migration |
| Middleware | Pipeline testleri |
| Multitenancy | Tenant izolasyon testleri |
| Security | CSRF, guvenlik testleri (57 adet) |
| Services | Is mantigi testleri |
| Validators | FluentValidation testleri |
| Workflows | Uctan uca is akisi |

### UI Testleri (Vitest) - 686 test

- 73 test dosyasi (.test.js, .spec.js)
- jsdom ortaminda
- @testing-library/react

### E2E Testleri (Playwright) - 47 spec

| Kategori | Spec Dosya |
|----------|-----------|
| api/ | endpoint-health (131 GET), full-registry (758 endpoint) |
| auth/ | login, logout, security, setup |
| core/ | navigation, pagination, error-handling, i18n, performance, responsive |
| crud/ | customer, offer, production, stock |
| screens/ | dashboard, products, sales, production, stock, accounting, maintenance, quality, reports, settings |

### CNC Savunma Testleri

- E2E_DEFENSE_CNC_TEST_SCENARIO.md (1124 satir)
- SAVUNMA_CNC_ADIM_ADIM_TEST_REHBERI.md (1417 satir)
- KUCUK_CNC_ATOLYE_UCTAN_UCA_TEST.md (669 satir)
- 48/48 test gecti (22.7 sn)

---

## 8. BUILD & CALISTIRMA

### API

```bash
dotnet build Quvex.sln                                    # Build
dotnet run --project src/Quvex.API                         # Calistir
dotnet test tests/Quvex.API.Tests                          # Test
dotnet ef database update --project src/Quvex.API          # Migration
docker compose -f docker-compose.db.yml up -d              # DB baslat
docker compose -f docker-compose.api.yml up -d             # API + DB
```

### UI

```bash
npm start                    # Dev server (port 3000)
npm run build                # Production build
npm test                     # Vitest
npm run test:coverage        # Coverage
npx playwright test          # E2E
npx playwright test --headed # Gorunur E2E
npx playwright show-report   # HTML rapor
npm run lint                 # ESLint
```

### Endpoint'ler

- API: http://localhost:5052
- Swagger: http://localhost:5052/swagger
- Health: http://localhost:5052/health
- Metrics: http://localhost:5052/metrics
- UI: http://localhost:3000

---

## 9. SON GIT AKTIVITESI

### smallFactory (Hub) - Son 10 Commit

```
7456ada [DOCS] TEST-PLAN-E2E-v3.pdf — Professional A4 PDF test guide
c02aa6d [DOCS] TEST-PLAN-E2E-v3 — PDF-ready manual test guide
c9f5208 [DOCS] Add small CNC shop E2E test scenario
8060dba [DOCS] Update docs with E2E test results — 48/48 passed
d67ed3f [DOCS] Add step-by-step defense CNC machining test guide
7ce6652 [DOCS] Add comprehensive E2E test scenario for defense CNC
df0a601 [DOCS] Update docs for Sprint 9 — Defense CNC improvements
671c539 [DOCS] Enrich all 8 module cards
c7c348e [DOCS] Learning by examples — easy/medium/hard scenarios
2dd275e [DOCS] Enrich all 8 module cards — Nedir/Ne Degildir/Nasil Calisir
```

### smallFactoryApi (Backend) - Son 10 Commit

```
1f52b7a [FIX] ShopFloor pending-tasks — include Qty=0 work orders
2ab25f9 [FIX] RoleController getRoles — fix tenant role filter
cf6a721 [FIX] approve-quality — support reject (approved=false)
53c67e7 [FIX] my-tasks — add code, productName, machineName to response
df0e80b [FIX] ShopFloor start-work — Raw SQL workaround for MachinesId
b2ec892 [WIP] WorkOrderLogs FK fix — Machines→Machine navigation rename
5a56d2b [FIX] ShopFloor — fix GetUserId, qualityBlocked logic
d62a8d0 [FEAT] ShopFloor pending-tasks endpoint + WorkOrderDTO quality fields
f115598 [FIX] WorkOrderDTO — add quality approval fields
085e386 [FIX] WorkOrderTemplates GET — add quality fields to response
```

### smallFactoryUI (Frontend) - Son 10 Commit

```
b6c6fb6 [TEST] Production chain test — 19/19 PASSED, ZINCIR TAMAM
85e753b [TEST] 19-Phase FINAL — 75 OK + 4 WARN + 0 FAIL
71de731 [TEST] 19-Phase — 74 OK + 5 WARN + 0 FAIL
690a959 [TEST] 19-Phase — 72 OK + 5 WARN + 0 FAIL
8ac7105 [TEST] 19-Phase — 65 OK + 9 WARN + 0 FAIL
11f1d58 [TEST] Full 19-Phase — 52/52 PASSED, 53 OK + 20 WARN + 0 FAIL
c6bfb3a [TEST] Full 19-Phase E2E test — 51/52 passed
70c029a [TEST] 41/41 — Full CNC scenario with stock cards + users + roles
0c03474 [TEST] Full CNC scenario — 39/39 with users, roles, login
f991d36 [TEST] Full CNC scenario with user creation — 39/39 passed
```

---

## 10. BILINEN SORUNLAR

### Aktif API Uyumluluk Sorunlari (3 adet)

1. **Offer→Order**: OfferProducts nested create calismıyor
2. **Subcontract**: SubcontractOrder.ProductionId FK zorunlu ama production order yok
3. **Invoice**: Create endpoint farkli alan adlari bekliyor

### Modul Bazli Bug Takibi

| Modul | Bug Sayisi |
|-------|-----------|
| Maintenance | 1 |
| Quality | 7 |
| Sales | 4 |
| Stock | 8 |
| Reports | 3 |

### Genel Bug Listesi

- 29 bug kayitli (API 404/500, NaN, encoding, tooltip, number format, kavram karmasasi, light mode)
- Detay: `C:\rynSoft\smallFactory\bugs\BUG-LIST.md`

---

## 11. TAMAMLANAN FAZLAR

| Faz | Kapsam | Durum |
|-----|--------|-------|
| F0 | Altyapi - Multi-tenant, HasQueryFilter | TAMAM |
| F1 | Operasyonel Verimlilik (9/10) — Teklif→Siparis→Uretim→Sevkiyat→Fatura→Odeme | TAMAM |
| F2 | Kalite-Sertifikasyon (9/10) — AS9100, FAI, FMEA | TAMAM |
| F3 | Saha Dayaniklilik (9/10) — PWA, mobil, barkod | TAMAM |
| F4 | e-Fatura — UBL-TR 1.2, e-Arsiv | TAMAM |
| F5 | Urunlestirme (9/10) — Self-registration, demo, onboarding | TAMAM |
| F6 | Olgunluk (9/10) — K8s, migration, guvenlik dokumanasyonu | TAMAM |
| F7 | Savunma CNC (2026-04-05) — 8 kritik ozellik | TAMAM |

---

## 12. FRONTEND OZEL BILGILER

### Yetki Sistemi (CASL)

```
Goruntule (View) / Kaydet (Save) / Sil (Delete)
30+ modul: Stok, Uretim, Satis, Kalite, Bakim, IK, Fatura, MRP...
```

### Rota Yapisi (882+ satir)

- /home — Dashboard
- /products — Stok yonetimi
- /sales*, /offer* — Satis & teklif
- /purchase* — Satinalma
- /invoice* — Fatura
- /quality* — Kalite
- /maintenance* — Bakim
- /production*, /shopfloor* — Uretim & terminal
- /hr* — Insan kaynaklari
- /reports* — Raporlar
- /settings*, /admin* — Ayarlar

### PWA Yapilandirmasi

- Service Worker: Workbox ile runtime caching
- ShopFloor: StaleWhileRevalidate (600s TTL)
- API: NetworkFirst (300s TTL)
- Gorseller: CacheFirst (30 gun TTL)

### Bundle Optimizasyonu

```
vendor-react    → react, react-dom, react-router-dom
vendor-antd     → antd, @ant-design/icons
vendor-charts   → recharts, apexcharts
vendor-utils    → axios, dayjs, i18next
vendor-calendar → @fullcalendar/*
vendor-table    → react-data-table-component
```

---

## 13. ALTYAPI & DEPLOYMENT

### Docker Compose Dosyalari

| Dosya | Amac |
|-------|------|
| docker-compose.db.yml | PostgreSQL + PgBouncer + Yedekleme |
| docker-compose.api.yml | API + DB (gelistirme) |
| docker-compose.demo.yml | Demo tenant ortami |
| docker-compose.staging.yml | UAT ortami |

### PostgreSQL Yapilandirmasi

- Versiyon: 16-Alpine
- Bellek: 4GB (uretim)
- Shared buffers: 256MB
- PgBouncer: transaction mode, 2000 max client, 50 default pool
- Yedekleme: Gunluk 03:00 UTC, 30 gun saklama

### Multi-Tenancy Mimarisi

- **Tier 0**: Shared DB (schema-per-tenant)
- **Tier 1**: Dedicated DB
- **Tier 2**: Dedicated Server (savunma sanayi zorunlu)
- AES-256-GCM sifrelenmis connection string
- Redis fail-closed (ConcurrentDictionary fallback)
- Tenant basina max 20 connection

---

*Bu analiz dosyasi test senaryolari oncesinde referans olarak kullanilmak uzere olusturulmustur.*
