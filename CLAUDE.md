# Quvex ERP — Merkez Calisma Kurallari

## PROJE YAPISI
| Proje | Konum | Teknoloji |
|-------|-------|-----------|
| API | `C:\rynSoft\quvex\smallFactoryApi\` | .NET 8, EF Core, PostgreSQL |
| UI | `C:\rynSoft\quvex\smallFactoryUI\` | React 18, Vite, Ant Design |
| **Merkez** | **`C:\rynSoft\quvex\quvex-docs\`** | **Tum dokuman, test, task, sprint** |
| DB | Docker `smallfactory-postgres` | PostgreSQL `quvex_dev` |

---

## MERKEZ KLASOR YAPISI

Detayli dosya haritasi icin: **FILE-MAP.md**

```
quvex-docs/
  CLAUDE.md              # BU DOSYA — merkez kurallar
  FILE-MAP.md            # Dokumantasyon indeksi

  product/               # Urun tanimi, is bilgisi, onboarding
    PRD.md, BUSINESS-KNOWHOW.md, ONBOARDING.md, DURUM.md, CHANGELOG.md

  architecture/          # Teknik mimari, deployment, guvenlik
    API-UI-ENDPOINT-MAP.md, DEPLOYMENT-GUIDE.md, TENANT-*.md, SECURITY-AUDIT-CHECKLIST.md
    1000-TENANT-SCALABILITY-PLAN.md, REFRESH-TOKEN-SECURITY-UPGRADE.md, DISASTER-RECOVERY-RUNBOOK.md

  analysis/              # Proje analizleri ve raporlar
    QUVEX_FULL_ANALYSIS.md, PROJECT_ANALYSIS.md, ERP_EKSIK_ANALIZI.md, ...

  roadmap/               # Yol haritalari ve faz planlari
    QUVEX-ROADMAP.md, FAZLANDIRMA.md, ROADMAP-{modul}.md, ...

  sprints/               # Sprint planlari ve takibi
    SPRINT-PLAN.md, SPRINT-UX-PLAN.md, SPRINT-TENANT-50.md, ...

  tasks/                 # Gorev tanimlari
    api/                 # Backend (FAZ1-C101..., FAZ2-F201...)
    ui/                  # Frontend (FAZ1-C201..., FAZ4-C401...)

  bugs/                  # Hata takibi
    BUG-LIST-v2.md, {modul}-MODULE-BUGS.md, CONSOLE-ERRORS.md

  tests/                 # E2E test planlari ve Playwright
    TEST-PLAN-E2E-v4.md, TEST-CHECKLIST-E2E.md
    cnc/                 # CNC test senaryolari
    e2e/                 # Playwright spec dosyalari

  training/              # Ekip egitim rehberleri
  marketing/             # Brosurler, rakip analizi, gorseller, satis materyalleri
    sales/               # SALES-PITCH-DECK, DEMO-SCRIPT, PRICING-STRATEGY (Sprint 11)
  specs/                 # Tasarim ve prompt sablonlari
  user-guide/            # Son kullanici HTML dokumantasyonu
  QuvexLanding/          # Astro landing site (ayri uygulama)
```

---

## TEST CALISTIRMA

Testler **UI projesinden** calistirilir (Playwright orada kurulu):

```bash
cd C:\rynSoft\quvex\smallFactoryUI

# ── Grup bazli ──
npx playwright test e2e/api/          # API endpoint testleri
npx playwright test e2e/auth/         # Giris/cikis/guvenlik
npx playwright test e2e/crud/         # CRUD islemleri
npx playwright test e2e/screens/      # Ekran testleri
npx playwright test e2e/quality/      # Kalite modulu
npx playwright test e2e/core/         # Altyapi testleri

# ── Tek dosya ──
npx playwright test e2e/screens/dashboard.spec.js
npx playwright test e2e/crud/crud-customer.spec.js

# ── Sadece API saglik (hizli) ──
npx playwright test e2e/api/api-endpoint-health.spec.js --grep "Full endpoint summary" --retries=0

# ── Tum testler ──
npx playwright test

# ── HTML rapor ──
npx playwright test --reporter=html && npx playwright show-report
```

---

## YENI OZELLIK EKLEME KURALLARI (ZORUNLU)

Yeni bir ozellik, modul veya endpoint eklendiginde asagidakileri yap:

### 1. Endpoint Kaydi
| Dosya | Ne Yapilir |
|-------|------------|
| `e2e/api/api-endpoint-health.spec.js` → `ENDPOINTS` | Yeni endpoint satiri ekle |
| `quvex-docs/architecture/API-UI-ENDPOINT-MAP.md` | Ilgili tabloya satir ekle |

### 2. Test Dosyasi
| Tur | Konum | Ne Yapilir |
|-----|-------|------------|
| Ekran testi | `e2e/screens/{modul}.spec.js` | Yoksa olustur |
| CRUD testi | `e2e/crud/crud-{modul}.spec.js` | CRUD modulu ise olustur |
| Kalite testi | `e2e/quality/{modul}.spec.js` | Kalite ile ilgiliyse |

### 3. Task Kaydi
- API task: `quvex-docs/tasks/api/FAZ{N}-{ID}-{aciklama}.md`
- UI task: `quvex-docs/tasks/ui/FAZ{N}-{ID}-{aciklama}.md`

### 4. Sprint Guncelleme
- `quvex-docs/sprints/SPRINT-PLAN.md` dosyasini guncelle

### 5. Controller Route Degistiginde
- Test dosyasindaki path'i guncelle
- Endpoint haritasini guncelle

---

## DB MIGRATION KURALI

Yeni kolon/tablo eklendiginde **3 semaya da** ekle:
1. `public`
2. `tenant_rynsoft`
3. `tenant_demo`

`BaseFullModel` miras alan entity'lerde `TenantId` kolonu olmali.

## TENANT İZOLASYON KURALLARI (ZORUNLU)

### HasQueryFilter — Yeni entity eklediğinde:
Her `BaseFullModel<Guid>` miras alan entity için QuvexDBContext.OnModelCreating'e filter ekle:
```csharp
modelBuilder.Entity<YeniEntity>().HasQueryFilter(e => !IsTenantResolved || e.TenantId == CurrentTenantId);
```
**Eksik filter = cross-tenant veri sızıntısı. ASLA atlanmamalı.**

Toplam filtrelenen entity sayısı: **143** (2026-03-29 itibariyle)

### Dedicated DB (Tier 2) Desteği:
- TenantTier enum: Shared (0), DedicatedDb (1), DedicatedServer (2)
- TenantConnectionFactory: AES-256-GCM ile şifreli connection string
- Tier 2 tenant'lar farklı host/port/database'de çalışabilir
- Savunma sanayi firmaları için Tier 2 zorunlu

### Frontend Güvenlik:
- Login'de `accessToken` ve `refreshToken` ayrı ayrı atanmalı (asla birbirine eşitlenmemeli)
- Logout'ta `clearTenantInfo()` + trial session data temizlenmeli
- SignalR bağlantısında `JoinTenantGroup(tenantId)` çağrılmalı
- API response'larda tenant validation (api.js interceptor) aktif

### Redis Connection Limit:
- Redis çöktüğünde **fail-closed** (in-memory fallback), fail-open DEĞİL
- Per-tenant max connection: 20 (default)

---

## IS TAMAMLAMA VE COMMIT KURALLARI (ZORUNLU)

Her yapilan is tamamlandiginda asagidaki adimlar **sirayla** uygulanir:

### 1. Task Dokumani Olustur
`quvex-docs/tasks/{api|ui}/` altina task dosyasi yaz:

```markdown
# [TASK-ID] Kisa Baslik

## Tur: BUG | FEATURE | REFACTOR | INFRA
## Durum: DONE
## Tarih: YYYY-MM-DD
## Etki Seviyesi: KRITIK | YUKSEK | ORTA | DUSUK

## Sorun / Ihtiyac
Ne oldugu, nasil fark edildigi, hangi sayfalar/endpoint'ler etkilendigi.

## Kok Neden
Sorunun teknik sebebi. (Ornek: API paginated response donuyor, UI array bekliyor)

## Cozum
Ne yapildi, hangi dosyalar degisti, neden bu yaklasim secildi.

## Etki Analizi
- Etkilenen sayfalar/moduller
- Baska bir ozelligi kirma riski var mi?
- DB degisikligi gerekti mi?

## Degisen Dosyalar
| Dosya | Degisiklik |
|-------|-----------|
| path/to/file | Aciklama |

## Test Sonucu
- Mevcut testler gecti mi?
- Yeni test eklendi mi?
```

### 2. Changelog Girdisi
`quvex-docs/product/CHANGELOG.md` dosyasina ekle:

```markdown
## [YYYY-MM-DD]
### Bug Fixes
- **TASK-ID:** Kisa aciklama — etkilenen moduller

### Features
- **TASK-ID:** Kisa aciklama

### Infrastructure
- **TASK-ID:** Kisa aciklama
```

### 3. Commit At
```bash
git add <ilgili-dosyalar>
git commit -m "[TASK-ID] Kisa aciklama

- Ne yapildi (bullet points)
- Etkilenen moduller
- Test durumu

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

### 4. Commit Kurallari
- Her task **ayri commit** olarak atilir (toplu degil)
- Commit mesaji task ID ile baslar
- Commit oncesi build + test gecmeli
- Birden fazla projeyi etkileyen isler icin her projede ayri commit

---

## BILINEN ONEMLI DETAYLAR

| Konu | Detay |
|------|-------|
| Auth | UI `refreshToken`'i Bearer olarak kullanir, JWT degil |
| Auth Filter | `YetkiDenetimi` — RefreshToken tablosundan dogrular |
| Swagger | Public metot HTTP attribute'suz ise `[NonAction]` ekle |
| Rate Limiting | API'de rate limiter var, toplu testlerde 500ms delay |
| Login | `admin@quvex.com` / `Admin123!@#$` |
| API | http://localhost:5052 |
| UI | http://localhost:3000 |
| Istatistik | 120+ controller, 790+ endpoint, 170+ GET testi (Sprint 11 sonrasi) |
| API Testleri | 1128+ xUnit test (API projesi icinde) |
| UI Testleri | 601+ Vitest test (UI projesi icinde) |

---

## SPRINT 11 — KAPSAYICI URUN (2026-04-12)

Sprint 11 ile sektor kapsamasini artiran yeni is modulleri eklendi. Her modul
icin entity + service + controller + SignalR (gerektiginde) + test seti mevcut.

### Yeni Is Modulleri

| Modul | Sektor | Controller | UI Rotasi | Aciklama |
|-------|--------|-----------|-----------|----------|
| **ProductVariant** | Tekstil, hazir giyim | `ProductVariantController` | `/products/variants` | Beden/renk matrisi, bulk generate, varyant bazli stok takibi |
| **HACCP** | Gida | `HaccpController` | `/haccp/*` | Kritik kontrol noktalari (CCP), olcum kayitlari, sapmada otomatik NCR |
| **Recall** | Gida, medikal | `RecallController` | `/recall/*` | Urun geri cagirma, BFS ile forward trace, musteri bildirimi, zaman cizelgesi |
| **MoldInventory** | Plastik, dokum, kalipcilik | `MoldController` | `/molds/*` | Kalip envanteri, shot sayaci, bakim takibi |
| **CeTechnicalFile** | Makine imalati | `CeTechnicalFileController` | `/ce-technical-files/*` | CE teknik dosya yonetimi, urune bagli dosya, 2006/42/EC uyumu |
| **Welding (WPS/WPQR)** | Kaynak, savunma, gemi | `WeldingController` | `/welding/*` | WPS, kaynakci sertifikalari, suresi dolan sertifika uyarisi |
| **ProductionBoard** | Tum uretim | `ProductionBoardController` | `/production-board` | Canli uretim panosu, SignalR push (ProductionDashboardHub) |
| **WhatsApp** | Tum sektorler | `WhatsAppController` | `/settings/whatsapp` | Bildirim/sablon mesaj gonderimi |
| **Onboarding** | Yeni tenant | `OnboardingController` | `/onboarding` | Sektor secimi + demo veri seed |

### Sprint 11 Guvenlik Sertlestirme
- Multi-role permission merge (tum rollerin izinleri birlestirilir)
- Tenant IDOR fix: `GetAllAsync`, `Get(id)`, `DeleteUser`, `PutUser`, `GetMyPermissions`
- `X-Tenant-Id` header spoofing koruma
- `/metrics` endpoint authentication
- PII redaction (request log + Sentry)
- AES-256-CBC sifreleme: IBAN, banka hesap no, vergi no
- Polly circuit breaker: TCMB, PayTR, eInvoice
- Detay: `architecture/SECURITY-AUDIT-CHECKLIST.md` — bolum 8
