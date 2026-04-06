# QUVEX ERP — Teknik Veri Sayfasi (Technical Data Sheet)

---

## Sistem Mimarisi

```
+-------------------+     +-------------------+     +-------------------+
|                   |     |                   |     |                   |
|   React 18.3 SPA  | <-> |   .NET 8 API      | <-> |   PostgreSQL 16   |
|   (Vite 6.4+AntD) |     |   (EF Core 8)     |     |   (140+ tablo)    |
|                   |     |                   |     |                   |
+-------------------+     +-------------------+     +-------------------+
        |                         |                         |
        |                  +------+------+           +------+------+
        |                  |             |           |             |
   +---------+      +-----------+  +-----------+  +-----------+
   | SignalR  |      | Nginx     |  | Docker    |  | Hangfire  |
   | (WS)    |      | (Reverse) |  | Container |  | (Jobs)    |
   +---------+      +-----------+  +-----------+  +-----------+
        |
   +---------+
   | PWA/SW  |
   | Offline |
   +---------+
```

---

## Platform Detaylari

### Frontend
| Ozellik | Detay |
|---------|-------|
| Framework | React 18.3 |
| Build Tool | Vite 6.4 |
| UI Kuetuephanesi | Ant Design 5.29 + Reactstrap (Bootstrap) |
| State Yonetimi | Redux Toolkit |
| Animasyon | Framer Motion |
| Grafik | Recharts, ApexCharts |
| Yetkilendirme | CASL Ability (route + component bazli) |
| PWA | Service Worker, offline cache (StaleWhileRevalidate) |
| Sesli Bildirim | Web Audio API (6 ses tipi: is emri, alarm, kalite, basari, hata, tarama) |
| Test | Vitest (691 test, 61+ dosya) |
| Lint | ESLint + Husky + lint-staged pre-commit hooks |

### Backend
| Ozellik | Detay |
|---------|-------|
| Runtime | .NET 8 (LTS) |
| ORM | Entity Framework Core 8 |
| Auth | JWT Bearer + Custom ActionFilter (YetkiDenetimi) |
| Realtime | SignalR Hub (/hubs/notification) — tenant-scoped groups |
| Cache | IMemoryCache (yetki + token cache) |
| Compression | Brotli + Gzip |
| API Versioning | v1.0 default |
| Swagger | Quvex branded |
| Background Jobs | Hangfire |
| Error Tracking | Sentry (PII stripped, DSN via env var) |
| Test | xUnit + FluentAssertions + Moq (1128 test) |
| Security Test | 57 test (SQL injection, auth, CORS, CSRF, lockout, audit) |

### Veritabani
| Ozellik | Detay |
|---------|-------|
| Motor | PostgreSQL 16+ |
| Baglanti | Npgsql (EF Core provider) |
| Tablo Sayisi | 140+ |
| Migration | Code-first (EF Migrations) |
| NoTracking | Default (performans) |
| Connection Pool | Npgsql built-in |
| Multi-Tenancy | Schema-per-tenant izolasyon |

### Multi-Tenancy Mimarisi
| Ozellik | Detay |
|---------|-------|
| Strateji | Schema-per-tenant (Tier 1), Dedicated DB (Tier 2), Dedicated Server (Tier 3) |
| Izolasyon | HasQueryFilter (143 entity), savunma sanayi duezeyinde |
| TenantTier | Shared=0, DedicatedDb=1, DedicatedServer=2 |
| Baglanti Yoenetimi | AES-256-GCM sifrelenmis connection string, tier-based routing |
| Cache | Redis (fail-closed, in-memory fallback), tenant basina max 20 baglanti |
| SignalR | JoinTenantGroup + X-Tenant-Id header + cross-tenant engelleme |
| Frontend | Response tenant validation interceptor, logout cleanup |
| Test | 25 izolasyon testi (savunma sanayi senaryolari dahil) |

### Deployment
| Ozellik | Detay |
|---------|-------|
| Container | Docker (non-root user, HEALTHCHECK) |
| Reverse Proxy | Nginx (gzip, security headers, 1y immutable asset cache) |
| CI/CD | GitHub Actions |
| Pre-commit | Husky + lint-staged |
| Security Scan | Trivy (container), TruffleHog (secret), npm audit |
| Dependency | Dependabot auto-update |
| npm Vulnerabilities | 0 (sifir) |

---

## API Istatistikleri

| Metrik | Deger |
|--------|-------|
| Toplam Controller | 115+ |
| Toplam Endpoint | 750+ |
| REST Standardi | JSON over HTTPS |
| Auth Method | JWT (60 dk) + RefreshToken (7 guen, opaque) |
| Rate Limiting | API: 100/dk, Login: 10/dk, Upload: 5/dk |
| Max Request Body | 5 MB (default), 50 MB (file upload) |
| Max File Size | 10 MB (whitelist: pdf,jpg,png,xlsx,docx...) |
| Response Format | JSON (camelCase) |
| Error Format | { message, detail, traceId } |
| Correlation ID | X-Correlation-Id header |

---

## Guevenlik Katmanlari

### Kimlik Dogrulama
- JWT token (60 dk oemuer)
- Opaque RefreshToken (7 guen, DB'de sakli)
- Token sessionStorage'da (XSS koruması)
- Hesap kilitleme: 5 basarisiz deneme → 15 dk kilit

### Yetkilendirme
- Role-Based Access Control (RBAC)
- Permission-based ActionFilter (YetkiDenetimi)
- Goruntule / Kaydet / Sil granular izinler
- CASL Ability frontend route koruması

### Ag Guevenligi
- HTTPS zorunlu (HSTS)
- CORS: Belirli origin, method, header
- CSRF: X-Requested-With header kontrolue
- CSP: Content Security Policy (no unsafe-eval)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff

### Veri Guevenligi
- Parameterized queries (SQL injection koruması)
- File upload whitelist + MIME validation + path traversal koruması
- Input validation (FluentValidation + DataAnnotations)
- Sifre politikasi: 12+ karakter, buyuk/kucuk/rakam/ozel
- Hassas veri loglama yok (PII stripped)

### Denetim & Izleme
- SecurityAuditService: [SECURITY] prefixed loglar
- Login/logout/kilit/yetki olaylari
- Correlation ID ile hata izleme (X-Correlation-Id)
- Sentry error tracking (API + UI, PII stripped)
- Audit trail modeulue

---

## Moduel Bazli Endpoint Dagilimi

| Moduel | Controller | Endpoint |
|--------|-----------|----------|
| Ueretim | 15 | ~95 |
| Stok | 12 | ~75 |
| Kalite | 25 | ~150 |
| Satis | 8 | ~50 |
| Satinalma | 5 | ~35 |
| Muhasebe | 10 | ~60 |
| Kasa / Banka | 4 | ~30 |
| Bakim | 3 | ~25 |
| IK | 2 | ~20 |
| Raporlama | 5 | ~35 |
| AI Insights | 3 | ~20 |
| Entegrasyon | 5 | ~40 |
| Guevenlik | 8 | ~50 |
| Ayarlar | 10 | ~65 |
| **TOPLAM** | **115+** | **~750+** |

---

## Moduel Detaylari

| Moduel | Alt Bilesenler |
|--------|----------------|
| Ueretim | Is Emri, Planlama, Kapasite, Sevkiyat, Operator Terminali |
| Stok | Depo, Lot, Barkod, ABC Analizi, Depo Lokasyonlari |
| Kalite | NCR, CAPA, FAI, PPAP, SPC, FMEA, CoC, MRB, Muayene + 14 alt moduel (23 toplam) |
| Satis | Teklif, Siparis, Fatura, Irsaliye |
| Satinalma | Talep, Siparis, Fason Siparis, Tedarikci |
| Muhasebe | Cari, Fatura, Odeme, Raporlar |
| Kasa / Banka | Nakit kasasi, Banka hesaplari, Yatirma/Cekme, Kasa↔Banka virman, Hareket defteri, Fatura odeme otomatik bakiye |
| Bakim (CMMS) | Koruyucu bakim, OEE, Ariza kaydi, MTBF/MTTR |
| IK | Personel, Vardiya, Devamsizlik |
| Raporlama | 13+ rapor, KPI, Excel export, Dinamik rapor |
| Proje Yonetimi | Proje takibi, Gantt, Kaynak planlama |
| AI Insights | Akilli analiz, Sektor bazli tahmin, Anomali tespiti |
| Entegrasyon | e-Fatura (GIB), SignalR bildirim, TCMB doeviz kuru, Excel import/export |
| Guevenlik | RBAC, Denetim izi, Sentry, SecurityAuditService |

---

## Operator Terminali (ShopFloor)

| Ozellik | Detay |
|---------|-------|
| Tasarim | Touch-optimize, glassmorphism UI |
| Giris | NumPad overlay, barkod tarama |
| Bildirim | Web Audio API — 6 ses tipi (is emri, alarm, kalite, basari, hata, tarama) |
| Offline | PWA Service Worker, offline-first islem kueyruekleme |
| Duraklatma | Sebep secimi ile duraklatma kaydi |
| Uyumluluk | Tablet, kiosklar, mobil tarayicilar |

---

## PWA & Offline Mimarisi

| Ozellik | Detay |
|---------|-------|
| Service Worker | Workbox tabanli cache stratejileri |
| Cache Stratejisi | StaleWhileRevalidate (ShopFloor), CacheFirst (statik asset) |
| Kurulabilir | Add to Home Screen, standalone goeruenum |
| Offline Kuyruk | Islem kueyruekleme, baglanti geldiginde senkronizasyon |

---

## Onboarding Sihirbazi

| Adim | Icerik |
|------|--------|
| 1 | Sirket bilgileri |
| 2 | Sektor profili secimi (11 sektor) |
| 3 | Moduel yapilandirma |
| 4 | Kullanici ve rol tanimlama |
| 5 | Otomatik yapilandirma ve baslatma |

**11 Sektor Profili:** CNC, Genel, Savunma/AS9100, Gida, Otomotiv, Mobilya, Tekstil, Plastik, Elektronik, Medikal, Ambalaj

---

## Cari Bakiye & Doeviz Kuru

| Ozellik | Detay |
|---------|-------|
| Cari Bakiye | Fatura SENT + odeme ile otomatik guencelleme |
| Doeviz Kuru | TCMB otomatik cekme, 5 guenluk hafta sonu/tatil fallback |
| Para Birimleri | TRY, USD, EUR + TCMB destekli tuem para birimleri |

---

## Test Kapsamı

| Katman | Framework | Test Sayisi | Kapsam |
|--------|-----------|-------------|--------|
| API Unit | xUnit + Moq | 1128 | Service + Controller |
| API Security | xUnit | 57 | SQL injection, auth, CORS, CSRF, lockout, audit |
| UI Unit | Vitest | 691 | Service + Component + Utility |
| **TOPLAM** | | **1819** | |

---

## Performans

| Metrik | Deger |
|--------|-------|
| API Response (ortalama) | < 100ms |
| Dashboard Yuekleme | < 2s (13+ paralel cagri) |
| Stok Sorgu (10K ueruen) | < 200ms |
| Rapor Olusturma | < 3s |
| Concurrent User | 100+ (Kestrel default) |
| DB Connection Pool | 100 (Npgsql default) |
| Compression | Brotli + Gzip (response) |
| API Versioning | v1.0 default, response caching |
| Asset Cache | Nginx 1y immutable |

---

## Minimum Sistem Gereksinimleri

### Sunucu (On-Premise)
| Kaynak | Minimum | Onerilen |
|--------|---------|----------|
| CPU | 2 core | 4 core |
| RAM | 4 GB | 8 GB |
| Disk | 50 GB SSD | 100 GB SSD |
| OS | Ubuntu 22.04 / Windows Server 2019 | Ubuntu 24.04 |
| Docker | 24.x | En guncel |
| PostgreSQL | 14 | 16 |

### Istemci (Tarayici)
| Tarayici | Minimum Versiyon |
|----------|-----------------|
| Chrome | 90+ |
| Firefox | 90+ |
| Edge | 90+ |
| Safari | 15+ |

---

## Entegrasyon Yetenekleri

| Entegrasyon | Tip | Durum |
|-------------|-----|-------|
| e-Fatura (GIB) | REST API | Hazir |
| TCMB Doeviz Kuru | REST API (otomatik) | Hazir |
| Excel Import/Export | Dosya | Hazir |
| PDF Rapor | Sunucu-tarafli | Hazir |
| SignalR Bildirim | WebSocket + Audio | Hazir |
| REST API | 750+ endpoint | Hazir |
| PWA / Offline | Service Worker | Hazir |
| ERP Entegrasyon | REST API uzerinden | Mumkun |
| IoT / SCADA | REST API uzerinden | Mumkun |
| Muhasebe Yazilimi | REST API uzerinden | Mumkun |

---

**Quvex ERP v1.5**
Build: 2026.03.31 | .NET 8 LTS | React 18.3 | Vite 6.4 | PostgreSQL 16

*Quvex — Enterprise-grade manufacturing ERP for SMBs.*
