# Quvex ERP — Merkez Calisma Kurallari

## PROJE YAPISI
| Proje | Konum | Teknoloji |
|-------|-------|-----------|
| API | `C:\rynSoft\smallFactoryApi\` | .NET 8, EF Core, PostgreSQL |
| UI | `C:\rynSoft\smallFactoryUI\` | React 18, Vite, Ant Design |
| **Merkez** | **`C:\rynSoft\smallFactory\`** | **Tum dokuman, test, task, sprint** |
| DB | Docker `smallfactory-postgres` | PostgreSQL `quvex_dev` |

---

## MERKEZ KLASOR YAPISI

```
smallFactory/
  CLAUDE.md                         # BU DOSYA — merkez kurallar

  analysis/                         # Proje analizleri
    PROJECT_ANALYSIS.md
    ERP_EKSIK_ANALIZI.md
    GAP_ANALYSIS_AND_WORKPLAN.md
    QUVEX-MARKET-ANALYSIS.md
    QUVEX-FINANCE-ANALYSIS.md
    AS9100_TARGET_FIT_ANALYSIS.md
    ...

  bugs/                             # Modul bazli bug listeleri
    BUG-LIST.md
    MAINTENANCE-MODULE-BUGS.md
    QUALITY-MODULE-BUGS.md
    SALES-MODULE-BUGS.md
    STOCK-MODULE-BUGS.md
    REPORTS-MODULE-BUGS.md

  docs/                             # Proje dokumanlari
    PRD.md                          # Urun gereksinim dokumani
    DURUM.md                        # Guncel proje durumu
    API-UI-ENDPOINT-MAP.md          # API-UI endpoint haritasi (131+)
    ENDPOINT-TEST-PROMPT.md         # Test prompt rehberi
    DEPLOYMENT-GUIDE.md
    SECURITY-AUDIT-CHECKLIST.md
    BUSINESS-KNOWHOW.md

  roadmap/                          # Yol haritalari ve sprint planlari
    QUVEX-ROADMAP.md
    QUVEX-SCALING-ROADMAP.md
    FAZLANDIRMA.md
    SPRINT_EXECUTION_PLAN.md
    ROADMAP-URETIM.md
    ROADMAP-SATIS.md
    ROADMAP-STOK.md
    ROADMAP-KALITE.md
    ROADMAP-FINANS.md

  sprints/                          # Sprint planlari ve takibi
    SPRINT-PLAN.md                  # Ana sprint plani
    SPRINT-UX-PLAN.md              # UX sprint plani

  tasks/                            # Tamamlanan ve aktif task'lar
    api/                            # API task'lari (FAZ1-C101, FAZ2-F201...)
    ui/                             # UI task'lari (FAZ1-C201, FAZ4-C401...)

  tests/                            # Test referans kopyalari
    playwright.config.js
    e2e/
      fixtures.js                   # Paylasilan test fixture
      api/                          # API endpoint saglik testleri
        api-endpoint-health.spec.js       # 131 GET endpoint testi
        api-endpoint-full-registry.spec.js # 758 endpoint tam kayit
      auth/                         # Giris, cikis, guvenlik
        auth.setup.js
        login.spec.js
        logout.spec.js
        security.spec.js
        security-auth.spec.js
      crud/                         # CRUD islem testleri
        crud-customer.spec.js
        crud-offer.spec.js
        crud-production.spec.js
        crud-stock.spec.js
      screens/                      # Ekran/sayfa testleri
        dashboard.spec.js
        dashboard-widgets.spec.js
        products.spec.js
        sales.spec.js
        purchase.spec.js
        production.spec.js
        stock.spec.js
        accounting.spec.js
        maintenance.spec.js
        notifications.spec.js
        reports.spec.js
        settings.spec.js
      quality/                      # Kalite modulu testleri
        quality.spec.js
      core/                         # Altyapi testleri
        navigation.spec.js
        pagination.spec.js
        error-handling.spec.js
        data-integrity.spec.js
        i18n.spec.js
        performance.spec.js
        responsive.spec.js
```

---

## TEST CALISTIRMA

Testler **UI projesinden** calistirilir (Playwright orada kurulu):

```bash
cd C:\rynSoft\smallFactoryUI

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
| `docs/API-UI-ENDPOINT-MAP.md` | Ilgili tabloya satir ekle |
| `smallFactory/docs/API-UI-ENDPOINT-MAP.md` | Ayni sekilde guncelle |

### 2. Test Dosyasi
| Tur | Konum | Ne Yapilir |
|-----|-------|------------|
| Ekran testi | `e2e/screens/{modul}.spec.js` | Yoksa olustur |
| CRUD testi | `e2e/crud/crud-{modul}.spec.js` | CRUD modulu ise olustur |
| Kalite testi | `e2e/quality/{modul}.spec.js` | Kalite ile ilgiliyse |

### 3. Task Kaydi
- API task: `smallFactory/tasks/api/FAZ{N}-{ID}-{aciklama}.md`
- UI task: `smallFactory/tasks/ui/FAZ{N}-{ID}-{aciklama}.md`

### 4. Sprint Guncelleme
- `smallFactory/sprints/SPRINT-PLAN.md` dosyasini guncelle

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

---

## IS TAMAMLAMA VE COMMIT KURALLARI (ZORUNLU)

Her yapilan is tamamlandiginda asagidaki adimlar **sirayla** uygulanir:

### 1. Task Dokumani Olustur
`smallFactory/tasks/{api|ui}/` altina task dosyasi yaz:

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
`smallFactory/docs/CHANGELOG.md` dosyasina ekle:

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
| Istatistik | 120 controller, 758 endpoint, 131 GET testi |
| API Testleri | 1128 xUnit test (API projesi icinde) |
| UI Testleri | 601 Vitest test (UI projesi icinde) |
