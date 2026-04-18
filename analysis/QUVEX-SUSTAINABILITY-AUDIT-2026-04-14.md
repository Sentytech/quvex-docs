# Quvex SaaS — Yönetim ve Sürdürülebilirlik Derin Denetimi

> **Tarih:** 2026-04-14
> **Kapsam:** Platform üretime çıktıktan sonra **günlük yönetim ve uzun vadeli sürdürülebilirlik** — admin paneline yeni feature eklemek değil
> **Ekip perspektifi:** Operations Lead + Senior SRE + Staff Engineer + Compliance Lead
> **Mevcut ölçek:** ~50 tenant — **Hedef:** 1000 tenant, $500K ARR
> **Tamamlayıcı doküman:** [ADMIN-PANEL-1000-TENANT-AUDIT-2026-04-14.md](./ADMIN-PANEL-1000-TENANT-AUDIT-2026-04-14.md) — feature boşlukları orada, bu belge "yaşayan süreç" açığı

---

## 1. YÖNETİCİ ÖZETİ

Sprint 13-16'da **teknik ürün olgunlaştı**: cross-tenant leak kapandı, 143 entity tenant izolasyonu, TenantRequiredMiddleware, lifecycle state machine, quota enforcement, dunning, backup verification, slow query dashboard, activation funnel — hepsi canlı. Mevcut admin panel audit'i (471 satır, 2026-04-14) bu feature'ların çoğunu zaten yol haritasına almıştı ve Sprint 16 top-10 aksiyonu kapattı.

**Fakat bu analiz farklı bir soruya cevap arıyor:** Feature yazıldı — **nasıl yönetilecek, nasıl sürdürülecek, 6 ay sonra hâlâ çalışacak mı?** Üç disiplinden (Operasyonel Toil & Runbook, Kod & Ekip Sürdürülebilirliği, Gözlemlenebilirlik & Governance & Compliance Bakımı) **38 eksiklik** tespit edildi — **13 KRİTİK, 17 YÜKSEK, 8 ORTA**.

**Üç disiplinin özeti:**
1. **Operasyon:** DR runbook var ama tatbikat sıfır, on-call zinciri bağlı değil, Hangfire UI prod'da kilitli, rollback prosedürü yok, postmortem kültürü yok. 50 tenant'ta günlük toil 6-9 saat; 200'de 8-12 saate çıkar, 350'de tıkanır.
2. **Kod & Ekip:** UI'da **54 npm vulnerability (2 critical)**, AdminController **2221 satır** (god object), `.github/CODEOWNERS` + PR template + CI/CD pipeline yok. Solo dev'de sorun değil; 3+ dev'de merge cehennemi.
3. **Gözlemlenebilirlik & Governance:** OpenTelemetry yok, KVKK entity'leri tablo seviyesinde (admin UI yok), 72h breach notification otomasyonu yok, AuditLog archival yok, cloud cost breakdown yok, capacity forecasting yok, pen test geçmişi yok. Compliance "kağıt üstünde" var, "yaşayan süreç" değil.

**Breakpoint noktaları:** 200 tenant'ta toil kilitlenir, 350'de kod refactor zorunlu, 500'de compliance/cost ciddi risk, 750'de observability tıkanır, 1000'de outage kumarı.

**Top 5 aksiyon (acil, 3 ay içinde):**
1. NPM 2 critical vulnerability fix + CI Dependabot ($0 efor, kaçınılmaz)
2. On-call zinciri: Sentry → Slack + PagerDuty + severity matrix
3. Runbook drill #1 — RPO/RTO gerçekten ölçülsün
4. CODEOWNERS + PR template + GitHub Actions CI/CD
5. KVKK admin UI skeleton (3 sayfa) + 72h breach notification Hangfire job

**12 aylık plan:** Q2 2026 sürdürülebilirlik temeli (10 ticket), Q3 2026 gözlemlenebilirlik & ölçek (10 ticket), Q4 2026 - Q1 2027 enterprise maturity (8 ticket). Mevcut ekip Faz 1'i taşır, Q3'te +1 SRE + 1 data engineer kaçınılmaz.

**Yapılmazsa:** 200 tenant'ta cuma gecesi kör nokta, 350'de dev hızı yarıya iner, 500'de KVKK denetim riski + cloud maliyet kontrolsüz, 1000'de SLA kırılır. **Yapılırsa:** 1000 tenant + $500K ARR + enterprise savunma müşterileri 2027 Q1.

---

## 2. SPRINT 16 SONRASI MEVCUT DURUM

### Kapanan eski audit item'ları (admin-panel-1000-tenant-audit'ten)

| # | Item | Sprint | Durum |
|---|---|---|---|
| O1 | Tenant lifecycle state machine | S16 T1 | ✅ |
| O2 | Otomatik trial expire + suspend | S16 T1 | ✅ |
| O3 | Quota enforcement | S16 T8 | ✅ |
| O4 | Soft delete + 30 gün grace | S16 T6 | ✅ |
| O5 | Alert store → DB | S16 T4 | ✅ |
| B2 | Failed payment dunning | S16 T5 | ✅ |
| S2 | Slow query per tenant | S16 T2 | ✅ |
| S3 | Backup verification | S16 T7 | ✅ |
| O6 | Advanced tenant filter | S16 T9 | ✅ |
| C4 | Activation event tracking | S16 T10 | ✅ |
| C1 | Trial conversion funnel | S16 T10 | ✅ |

**Sonuç:** 11/18 kritik item kapandı. Eski audit'in **operasyonel Sprint 16 dalgası** başarıyla uygulandı. Kalan 7 KRİTİK (ör. backup S3 offsite, dedicated tier, KVKK compliance UI, Prometheus migration) bu yeni audit'in kapsamına devrediliyor.

### Hâlâ açık (eski audit'ten taşınan)

- Per-tenant Prometheus metrics (custom impl var, scraper yok) — S1
- Hangfire admin UI production secured proxy — S5
- DR drill + RPO/RTO ölçüm — S6
- Per-tenant DB migration failure dashboard — S7
- Health score engine (5 boyut) — C2
- Cohort analysis — C8
- Support ticket entegrasyonu — C6
- MRR/ARR/NRR/churn paneli — B3, B4, B5 (kısmi var)
- E-fatura otomasyon (Foriba) — B6, B7
- Multi-admin RBAC — O16

---

## 3. DİSİPLİN 1 — OPERASYONEL TOİL & RUNBOOK OLGUNLUĞU

### 3.1 Bulgular Tablosu

| # | Bulgu | Durum | Severity |
|---|---|---|---|
| OP1 | DR runbook (200+ satır, RPO<1h, RTO<15min, 4 senaryo) | ✅ Var | — |
| OP2 | **Runbook tatbikat (drill) geçmişi** | ❌ Hiç yapılmamış | **KRİTİK** |
| OP3 | **On-call zinciri** (Sentry → Slack/PagerDuty) | ❌ Sadece Sentry email | **KRİTİK** |
| OP4 | **Hangfire UI prod erişimi** | ❌ LocalRequestsOnly, SSH tüneli gerek | **KRİTİK** |
| OP5 | **Rollback runbook** (canary/blue-green/revert) | ❌ Yok, drop-in replacement | **KRİTİK** |
| OP6 | Git tag + semver disiplini | ❌ Commit hash only | YÜKSEK |
| OP7 | Support ticket entegrasyonu (Zendesk/Intercom/Freshdesk) | ❌ Sadece FeedbackList.js | YÜKSEK |
| OP8 | Postmortem şablonu + incident timeline | ❌ Yok | YÜKSEK |
| OP9 | ADR (Architecture Decision Record) klasörü | ❌ Yok | ORTA |
| OP10 | API/UI README.md içeriği | ❌ Tek satır boş | ORTA |
| OP11 | CHANGELOG.md Sprint 16-18 entries | ⚠️ Eksik | ORTA |
| OP12 | Deployment checklist (prod) | ❌ Yok | YÜKSEK |
| OP13 | CLAUDE.md Sprint 14+ güncelleme | ⚠️ Stale | ORTA |

**Günlük toil tahmini:**
| Rol | 50 tenant | 200 tenant | 500 tenant |
|---|---|---|---|
| Ops/SRE | 2-3h | 5-7h | **14h (imkansız)** |
| CSM | 3-4h | 6-8h | **16h (imkansız)** |
| Engineer on-call | 1-2h | 2-4h | 4-6h |
| **Toplam** | **6-9h** | **13-19h** | **tıkandı** |

### 3.2 Top 5 Kritik Ticket (Sprint 19 backlog)

#### Ticket 1: [KRİTİK] On-call zinciri: Sentry → Slack + PagerDuty + severity matrix
- **Disiplin:** Ops/SRE
- **Efor:** S (3 gün)
- **Sorumlu:** Backend Lead + 0.5 DevOps
- **Neden kritik:** Hafta sonu outage'da admin öğrenene kadar 12-24 saat geçebilir. Cumartesi gece kritik alert sessiz gider.
- **Fix:** Sentry webhook → Slack kanalı (#quvex-alerts-p0, p1, p2), PagerDuty rotation 1 kişi 7/24, severity matrix (P0=anında çağrı, P1=5dk, P2=1h, P3=next business day), acknowledgment flow
- **Kabul:** Bir test alert → P0 Slack + telefon çağrısı <2dk, ack butonu çalışıyor, escalation rules test edildi
- **Kanıt:** `smallFactoryApi/src/Quvex.API/Program.cs` line 735-846 — Sentry DSN var ama webhook yok

#### Ticket 2: [KRİTİK] Runbook drill #1 — DR tatbikat ve RPO/RTO gerçek ölçüm
- **Disiplin:** SRE
- **Efor:** M (5 gün, iş saatleri dışı)
- **Sorumlu:** Backend Lead + DevOps
- **Neden kritik:** `DISASTER-RECOVERY-RUNBOOK.md` **hedef** belirtiyor (RPO<1h, RTO<15min) ama hiç test edilmedi. İlk gerçek outage'da hedefin 3-4 katı süre muhtemel.
- **Fix:** Staging'de 4 senaryo (DB crash, veri corrupt, container crash, tenant izolasyon ihlali) script'li drill. Her drill: başlangıç/bitiş timestamp, RPO/RTO ölçüm, engelleyen faktörler dokümante. Rapor `quvex-docs/operations/DR-DRILL-REPORTS/2026-04-drill-01.md`
- **Kabul:** 4 senaryo tamamlandı, gerçek RTO <30dk, drill raporu yayınlandı, eksikler Sprint 20 backlog'a girdi
- **Kanıt:** `quvex-docs/architecture/DISASTER-RECOVERY-RUNBOOK.md` — 200+ satır, hiç drill kaydı yok

#### Ticket 3: [KRİTİK] Hangfire production UI secured proxy
- **Disiplin:** SRE
- **Efor:** S (2 gün)
- **Sorumlu:** Backend Dev
- **Neden kritik:** `LocalRequestsOnlyAuthorizationFilter` prod'da Hangfire dashboard'u kilitliyor. Job tıkanması, recurring job fail, queue size → admin görmez. SSH tüneli gerek, operasyonel cehennem.
- **Fix:** Custom `IDashboardAuthorizationFilter` ile super admin claim + YetkiDenetimi check. `/admin/jobs` rotasına iframe embed. Audit log entry her erişimde.
- **Kabul:** Super admin production'da `/admin/jobs` tıklar, Hangfire dashboard açılır, tenant_resolver context aktif değil (cross-tenant leak yok), audit log'a düşer
- **Kanıt:** `smallFactoryApi/src/Quvex.API/Program.cs` — Hangfire config LocalOnly

#### Ticket 4: [KRİTİK] Rollback runbook + deploy checklist
- **Disiplin:** SRE
- **Efor:** M (4 gün)
- **Sorumlu:** DevOps + Backend Lead
- **Neden kritik:** Canary/blue-green yok, prod deploy drop-in replacement (senkron downtime). Kötü commit → tek yol git revert + manuel yeniden deploy, no clear playbook. Çalışan commit hash bilinmiyor.
- **Fix:** `quvex-docs/operations/ROLLBACK-RUNBOOK.md` — 4 senaryo (bozuk image, bozuk migration, bozuk config, data corruption). Deploy öncesi checklist (migration dry-run, backup verify, canary slot). Docker tag stratejisi (semver + sha + date)
- **Kabul:** Runbook yayınlandı, staging'de rollback simülasyonu <5dk, son 10 deploy için rollback tag'leri mevcut
- **Kanıt:** `docker-compose.api.yml` — image tag `latest` (immutable değil)

#### Ticket 5: [YÜKSEK] Postmortem template + incident timeline sayfası
- **Disiplin:** SRE/Ops
- **Efor:** S (2 gün)
- **Sorumlu:** Backend Lead
- **Neden kritik:** "Bug bulundu → fix" döngüsü var, öğrenme kaydı yok. Aynı bug 3 ay sonra tekrar ederse farkedilmez. Sprint-BUGFIX dosyaları backlog, postmortem değil.
- **Fix:** `quvex-docs/operations/POSTMORTEM-TEMPLATE.md` — blameless şablon (neler oldu, neler işe yaradı, neden oldu, nasıl tekrarlanmaz, action items). `/admin/incidents` sayfası — timeline kronolojik, severity, duration, etkilenen tenant sayısı
- **Kabul:** Son 3 aydaki 5 incident retroactive postmortem yazıldı, template onaylandı, UI deploy edildi
- **Kanıt:** `quvex-docs/sprints/SPRINT-BUGFIX-2026-04-02.md` — bug listesi var ama RCA yok

---

## 4. DİSİPLİN 2 — KOD & EKİP SÜRDÜRÜLEBİLİRLİĞİ

### 4.1 Bulgular Tablosu

| # | Bulgu | Durum | Severity |
|---|---|---|---|
| CODE1 | API: 30,433 satır C#, 933 test, xUnit + FluentAssertions | ✅ | — |
| CODE2 | UI: 107,162 satır JS, 527 Playwright E2E + Vitest | ✅ | — |
| CODE3 | **UI: 54 npm vulnerability (2 CRITICAL, 23 HIGH, 29 MOD)** | ❌ yaml, picomatch, react-select | **KRİTİK** |
| CODE4 | **AdminController.cs = 2221 satır (god object)** | ❌ Refactor zorunlu | **KRİTİK** |
| CODE5 | **ProductionController.cs = 1542 satır (god object)** | ❌ Refactor zorunlu | YÜKSEK |
| CODE6 | **`.github/CODEOWNERS` dosyası** | ❌ Yok | **KRİTİK** |
| CODE7 | **`.github/workflows/*` CI/CD pipeline** | ❌ Yok | **KRİTİK** |
| CODE8 | **Dependabot config** | ❌ Yok | YÜKSEK |
| CODE9 | PR + Issue template | ❌ Yok | YÜKSEK |
| CODE10 | Clean Architecture bypass (YetkiDenetimi → QuvexDBContext direct) | ⚠️ 1 yer | ORTA |
| CODE11 | API TODO/FIXME debt | ⚠️ 38 kayıt (PaymentDunning 3, LogoEInvoice 6, ForibaEInvoice 7) | ORTA |
| CODE12 | SAST/SCA (Semgrep, Trivy, TruffleHog) | ❌ Yok | YÜKSEK |
| CODE13 | Test coverage rakamı (% olarak) | ❌ Ölçülmüyor | ORTA |
| CODE14 | CLAUDE.md Sprint 14+ güncel mi | ⚠️ Stale | ORTA |

**"Yeni mühendis 1 haftada üretken olur mu?"**
**Kısmen evet**: küçük feature (stok alert, invoice bug fix) haftanın sonunda mümkün. Refactor (AdminController split) 2-3 hafta. **Ön koşul:** ekip yanıt hızı <2h, CODEOWNERS kurulu, ADR klasörü var.

### 4.2 Top 5 Kritik Ticket

#### Ticket 6: [KRİTİK] NPM güvenlik açıklarını temizle + Dependabot
- **Disiplin:** Dev/Security
- **Efor:** S (2 gün)
- **Sorumlu:** Frontend Lead
- **Neden kritik:** **54 vulnerability, 2 CRITICAL**. Disclosed CVE'lerse exploit süresi saatler. Prod'da kullanıcı bekliyor.
- **Fix:** `npm audit fix` ile 41 otomatik kapanan. Kalan 13 için semver-major upgrade path (react-select, yaml, picomatch). Breaking change test. `.github/dependabot.yml` haftalık scan + auto-PR.
- **Kabul:** `npm audit` 0 vulnerability (kritik + high), Dependabot haftalık PR'lar aktif, `.github/workflows/npm-audit.yml` CI gate
- **Kanıt:** `smallFactoryUI/package.json` + `package-lock.json` — `npm audit` raporu

#### Ticket 7: [KRİTİK] CODEOWNERS + PR template + GitHub Actions CI/CD
- **Disiplin:** Dev/DevOps
- **Efor:** M (4 gün)
- **Sorumlu:** Backend Lead + DevOps
- **Neden kritik:** Solo dev'de sorun değil — 2. dev geldiği gün review SLA yok, kim onaylar belli değil, build test manuel. Onboarding 2x yavaş.
- **Fix:**
  - `.github/CODEOWNERS`: `/smallFactoryApi/** @backend-lead`, `/smallFactoryUI/** @frontend-lead`, `/quvex-docs/** @product-lead`
  - `.github/pull_request_template.md`: checklist (tested, docs updated, security reviewed, migration safe)
  - `.github/workflows/ci.yml`: dotnet build + test, vite build + vitest, Trivy container scan, Semgrep SAST, TruffleHog secret scan
- **Kabul:** CI 10dk altı, 3 test PR başarılı, CODEOWNERS review zorunlu, SAST 0 HIGH finding
- **Kanıt:** `.github/` klasörü yok

#### Ticket 8: [KRİTİK] AdminController split — domain grouping
- **Disiplin:** Dev (refactor)
- **Efor:** L (8 gün)
- **Sorumlu:** Backend Lead
- **Neden kritik:** 2221 satır tek dosya. 2+ dev merge conflict, cognitive load yüksek, test izolasyonu zor. Sprint 16'da 5 yeni endpoint eklenmesi bu sorunu ağırlaştırdı.
- **Fix:** 5-6 controller'a bölme:
  - `AdminController` — auth, impersonate, dashboard (200 satır)
  - `TenantManagementController` — CRUD, tier, status (400 satır)
  - `TenantMonitoringController` — health, alerts, metrics (300 satır)
  - `TenantBackupController` — backup, restore, verification (350 satır)
  - `TenantBillingAdminController` — dunning, quota, plan (400 satır)
  - `TenantSchemaController` — drift, repair, migration (250 satır)
- **Kabul:** Her controller <500 satır, tüm test yeşil, route'lar geriye uyumlu, admin UI değişikliği yok
- **Kanıt:** `smallFactoryApi/src/Quvex.API/Controllers/AdminController.cs` — 2221 satır

#### Ticket 9: [YÜKSEK] ADR klasörü — 5 kritik mimari karar
- **Disiplin:** Dev/Architect
- **Efor:** S (3 gün)
- **Sorumlu:** Backend Lead
- **Neden kritik:** "Neden schema-per-tenant seçildi?", "Neden Hangfire, neden değil?", "Auth flow neden custom YetkiDenetimi?" sorularına yazılı cevap yok. Yeni dev her seferinde arkeolojik kazı.
- **Fix:** `quvex-docs/architecture/adr/` klasörü, 5 ADR:
  - `001-tenant-isolation-schema-per-tenant.md` (alternatifler: row-level security, dedicated DB)
  - `002-auth-yetkidenetimi-vs-authorize.md`
  - `003-cache-redis-vs-in-memory.md`
  - `004-migration-strategy-ef-core-vs-fluent.md`
  - `005-backup-strategy-pg-dump-vs-pitr.md`
  - Her biri: Context, Decision, Consequences, Alternatives, Status
- **Kabul:** 5 ADR yayınlandı, FILE-MAP'e eklendi, CLAUDE.md'den referans verildi
- **Kanıt:** `quvex-docs/architecture/adr/` klasörü yok

#### Ticket 10: [YÜKSEK] API/UI README.md — onboarding hızlı başlangıç
- **Disiplin:** Dev
- **Efor:** S (1 gün)
- **Sorumlu:** Backend + Frontend Lead
- **Neden kritik:** Yeni mühendis ilk açtığında README "factory-backend" yazıyor. Setup, run, test, debug adımları yok. CLAUDE.md proje içinde ama GitHub'daki ilk izlenim zayıf.
- **Fix:** Her iki README:
  - Prerequisites (versions, tools)
  - Setup (clone, install, DB, env)
  - Run (dev, prod, docker)
  - Test (unit, integration, e2e)
  - Project structure (1 paragraf)
  - Key files (CLAUDE.md, FILE-MAP.md, ADR link)
- **Kabul:** README açan yeni dev 30dk içinde dev server ayakta, ilk test komutu yeşil
- **Kanıt:** `smallFactoryApi/README.md` + `smallFactoryUI/README.md` — 1 satır

---

## 5. DİSİPLİN 3 — GÖZLEMLENEBİLİRLİK, GOVERNANCE, COST, COMPLIANCE BAKIMI

### 5.1 Bulgular Tablosu

| # | Bulgu | Durum | Severity |
|---|---|---|---|
| OBS1 | X-Correlation-Id + Serilog enricher | ✅ Var | — |
| OBS2 | PII redaction (password, token, cardNumber, IBAN mask) | ✅ Var | — |
| OBS3 | AES-256-CBC sensitive field encryption | ✅ Var | — |
| OBS4 | Custom `/metrics` Prometheus text endpoint | ✅ MetricsMiddleware.cs:165-264 | — |
| OBS5 | Sentry (API + UI) + performance tracing | ✅ | — |
| OBS6 | BackupVerificationService daily drill, SHA256, S3 | ✅ Sprint 16 T7 | — |
| OBS7 | Schema drift check (daily 03:00 UTC) | ✅ TenantSchemaService 680 LOC | — |
| OBS8 | KVKK entity'leri (ConsentRecord, DSR, Breach, PersonalDataInventory) | ⚠️ Tablo var | — |
| OBS9 | **OpenTelemetry (Jaeger/Zipkin)** | ❌ Paket yok | YÜKSEK |
| OBS10 | **KVKK entity'leri UI** (ConsentList, DSR queue, BreachRegistry) | ❌ **Tablo only** | **KRİTİK** |
| OBS11 | **KVKK 72h breach notification automation** | ❌ Hangfire job yok | **KRİTİK** |
| OBS12 | **AuditLog archival + partition policy** | ❌ Unbounded | **KRİTİK** |
| OBS13 | **Cloud cost breakdown per tenant** (AWS/RDS/S3 bill) | ❌ Yok | **KRİTİK** |
| OBS14 | **Capacity forecasting** (tenant/storage projection) | ❌ Yok | YÜKSEK |
| OBS15 | **Penetration test geçmişi** | ❌ Yok | YÜKSEK |
| OBS16 | WhatsApp/SMTP/SMS gateway reliability tracking | ⚠️ Silent fail | YÜKSEK |
| OBS17 | Prometheus-net standart paket (vs. custom) | ⚠️ Custom impl | ORTA |
| OBS18 | AS9100 audit export (InternalAudit, AuditFinding) | ⚠️ Tablo var, UI yok | ORTA |

### 5.2 Top 5 Kritik Ticket

#### Ticket 11: [KRİTİK] KVKK admin UI skeleton — 3 sayfa
- **Disiplin:** Compliance/Dev
- **Efor:** M (5 gün)
- **Sorumlu:** Frontend Lead + Backend Dev
- **Neden kritik:** KVKK Kurulu denetimi geldiğinde `ConsentRecord`, `DataSubjectRequest`, `DataBreachRecord` tablolar var — **ama manuel DB query dışında hiçbir süreç yok**. DSR 30-day deadline, breach 72h notification — takip mekanizması kaybolur.
- **Fix:**
  - `/admin/compliance/consent` — rıza kayıtları (kim, ne zaman, ne kanal, geri alındı mı)
  - `/admin/compliance/data-subject-requests` — DSR kuyruğu (pending/in-progress/completed, deadline counter, response tarih)
  - `/admin/compliance/breach-registry` — breach kayıtları, severity, 72h countdown, rapor butonu
- **Kabul:** 3 sayfa çalışır, son 30 günün DSR listesi görünür, breach kaydı 72h sayacıyla dashboard'da, KVKK Kurulu'na export CSV
- **Kanıt:** `smallFactoryApi/src/Quvex.Domain/Entities/Common/KvkkRecord.cs` — entity'ler tanımlı, controller yok

#### Ticket 12: [KRİTİK] KVKK 72h breach notification otomasyonu
- **Disiplin:** Compliance/Dev
- **Efor:** M (4 gün)
- **Sorumlu:** Backend Lead + Compliance Lead (consultant ok)
- **Neden kritik:** KVKK madde 12/5 — veri ihlali 72 saat içinde Kurula bildirilmek zorunda. Tablo var, Hangfire job yok. İlk ihlalde manuel süreçte SLA miss olasılığı yüksek, idari para cezası riski (₺50K+).
- **Fix:** `DataBreachNotificationService` Hangfire recurring job (15dk'da bir), yeni BreachRecord tespit → e-posta DPO'ya, 24h/48h/68h eskalasyon, 72h alarm (KVKK Kurulu iletişim bilgisi, hazır template), audit trail
- **Kabul:** Test breach kaydı eklendi → DPO 15dk içinde e-posta aldı, 68. saatte "acil" alarm, tüm adımlar audit log'da
- **Kanıt:** `DataBreachRecord.cs` entity — `IsReportedToAuthority` flag var, otomasyon yok

#### Ticket 13: [KRİTİK] AuditLog archival + partition
- **Disiplin:** SRE/DBA
- **Efor:** M (4 gün)
- **Sorumlu:** Backend Lead + DevOps
- **Neden kritik:** `AuditLog` + `AuditTrailEntry` tabloları unbounded. 50 tenant × 200 audit/gün = 10K/gün. 1000 tenant'ta 200K/gün = yılda 73M kayıt. 6-9 ay sonra query 3-5sn, SSD doldurur.
- **Fix:**
  - Partition by month (`CREATE TABLE audit_log_2026_04 PARTITION OF audit_log`)
  - Hangfire job: `audit-log-archival` aylık → 90+ gün eski partition'lar S3 parquet
  - Read: son 90 gün hot, 1 yıl warm (S3), arşiv cold (Glacier)
  - Admin UI: "Eski audit ara" butonu — S3 parquet query
- **Kabul:** Partition aktif, 3 ay eski veri S3'te, query P95 <500ms, cold restore <2dk
- **Kanıt:** `smallFactoryApi/src/Quvex.Domain/Entities/Common/AuditLog.cs` — partition yok, cleanup job yok

#### Ticket 14: [KRİTİK] Cloud cost breakdown + unit economics
- **Disiplin:** Billing/SRE
- **Efor:** L (7 gün)
- **Sorumlu:** +1 Data/Billing Engineer (Q3'te işe alınacak) veya backend lead
- **Neden kritik:** Kurucu "plan fiyatı ne kadar, gerçek maliyet ne kadar?" sorusuna cevap veremez. Pahalı tenant (unit margin negatif) görünmez. 500 tenant'ta gross margin hesabı imkansız, finansman kararı çakışır.
- **Fix:**
  - AWS Cost Explorer API daily fetch → `TenantCostAllocation` tablosu
  - Tenant-level attribution: RDS query count × price, S3 storage × price, bandwidth × price
  - `/admin/finance/unit-economics` — tablo: plan, tenant count, avg revenue, avg cost, margin %, "en pahalı 10 tenant"
  - Alarm: margin <20% → finans flag
- **Kabul:** Geçen ay için tam breakdown var, CSV export çalışıyor, negatif margin tenant'lar listelenmiş
- **Kanıt:** Admin panelinde sadece storage/user usage var (`QuotaDashboard.jsx`), cost entegrasyonu yok

#### Ticket 15: [YÜKSEK] OpenTelemetry + Jaeger backend-frontend trace
- **Disiplin:** SRE
- **Efor:** L (7 gün)
- **Sorumlu:** Backend Lead + Frontend Lead
- **Neden kritik:** 50 tenant'ta Sentry yetiyor, 500'de request zincirini takip etmek imkansız. "Stok ekranı neden 4sn açıldı" sorusunun cevabı kod okumak. SRE'nin MTTR'ı 5x artar.
- **Fix:**
  - API: `OpenTelemetry.Exporter.Jaeger` paketi, TracerProvider, her controller span, tenantId tag
  - UI: `@opentelemetry/sdk-trace-web` paketi, fetch/XHR instrumentation, correlation_id propagate
  - Jaeger backend: Docker container (Tempo veya standalone)
  - Admin: `/admin/tracing?traceId=...` sayfa (Jaeger UI iframe)
- **Kabul:** Bir request backend → frontend → backend zincirinde tek trace, tenant tag ile filter, P95 query <2sn
- **Kanıt:** `Quvex.API.csproj` — OpenTelemetry paketi yok

---

## 6. RİSK MATRİSİ + BREAKPOINT ANALİZİ

| Risk | Şu an 50 | 200 tenant | 500 tenant | 1000 tenant |
|---|---|---|---|---|
| **Runbook drill yok** | Uyku kaçırmaz | Rahatsız edici | İlk outage'da RTO aşılır | **SLA kırılır, itibar hasarı** |
| **NPM 54 vuln (2 critical)** | Sessiz risk | **CVE disclosed → exploit saatleri** | Zorunlu fix pressure | Compliance audit fail |
| **AdminController 2221 LOC** | Solo OK | 2 dev çakışma | 3+ dev **merge hell** | Refactor zorunlu, 2-3 sprint kaybı |
| **On-call zinciri yok** | Admin el feneri | Hafta sonu kör nokta | Cuma gece kaçan incident | "Dün akşam offline'dı" |
| **KVKK UI + 72h job yok** | Tatbikat yok | DSR manuel, SLA zar zor | **Kurul denetim riski** | **VERBİS bildirimi + ceza** |
| **Cloud cost visibility yok** | Intuition | Birim maliyet bilinmez | Pahalı tenant görünmez | **Gross margin kontrolsüz** |
| **AuditLog unbounded** | Disk rahat | Yavaşlama başlar | **Query 3-5sn** | Partition zorunlu |
| **CODEOWNERS yok** | Solo OK | 2. dev 2x yavaş | Scope conflict | **Senior bottleneck** |
| **Capacity forecasting yok** | Aylık manuel | Sürprizsiz | 2 hafta önceden görülmez | **Disk dolar, outage** |
| **OpenTelemetry yok** | Sentry yetiyor | Korsan kod okuma | 5x MTTR | Sorun tespiti kumar |

**Breakpoint özeti:**
- **~200 tenant:** Toil kilitlenir (15h/gün iş), on-call + automation zorunlu
- **~350 tenant:** AdminController + CI/CD + CODEOWNERS eksikse dev hızı %50 düşer
- **~500 tenant:** KVKK + cost visibility + capacity forecast olmadan compliance ve finansal risk ciddi
- **~750 tenant:** OpenTelemetry + structured observability olmadan MTTR 5x
- **~1000 tenant:** Runbook drill + DR otomasyon olmadan outage kumar masası

---

## 7. 12 AYLIK SUSTAINABILITY YOL HARİTASI

### Q2 2026 — Sürdürülebilirlik Temeli (Sprint 19-22, 4 sprint, ~3 ay)

**Tema:** "Kırılmayan günlük operasyon"

| # | Ticket | Efor | Disiplin |
|---|---|---|---|
| T1 | On-call zinciri: Sentry → Slack + PagerDuty + severity matrix | S | Ops/SRE |
| T2 | NPM vuln temizliği + Dependabot | S | Dev |
| T3 | CODEOWNERS + PR template + GitHub Actions CI/CD (build, test, SAST) | M | Dev/SRE |
| T4 | Runbook drill #1 — DR tatbikat, RPO/RTO raporu | M | SRE |
| T5 | Hangfire UI production secured proxy | S | SRE |
| T6 | Rollback runbook + deploy checklist | M | SRE |
| T7 | AdminController split (1 → 5-6 controller) | L | Dev |
| T8 | API/UI README.md + 5 ADR | S | Dev |
| T9 | KVKK admin UI skeleton (3 sayfa) | M | Compliance/Dev |
| T10 | Postmortem template + incident timeline sayfası | S | SRE |

**Toplam efor:** ~30 story point. **Çıktı:** 50→200 tenant güvenli.

### Q3 2026 — Gözlemlenebilirlik & Ölçek (Sprint 23-28, 6 sprint, ~4 ay)

**Tema:** "Kör noktaları kapat, ölçeğe hazır ol"

| # | Ticket | Efor | Disiplin |
|---|---|---|---|
| T11 | OpenTelemetry + Jaeger: backend-frontend trace | L | SRE |
| T12 | Prometheus-net + Grafana dashboard (per-tenant) | L | SRE |
| T13 | Cloud cost breakdown + unit economics | L | Billing/SRE |
| T14 | Capacity forecasting (linear regression projection) | M | Data |
| T15 | AuditLog archival + partition (hot/warm/cold) | M | SRE |
| T16 | KVKK 72h breach notification otomasyonu | M | Compliance |
| T17 | Support ticket entegrasyonu (Freshdesk) | L | CS |
| T18 | Runbook drill #2-3 (2 ayda bir) | M | SRE |
| T19 | ProductionController + WorkOrderController split | L | Dev |
| T20 | Health score engine (5 boyut nightly job) | L | CS |

**Toplam efor:** ~45 SP. **Çıktı:** 200→500 tenant, DORA metrikleri ölçülebilir.

### Q4 2026 — Q1 2027 — Enterprise Maturity (Sprint 29-34, 6 sprint, ~4 ay)

**Tema:** "1000 tenant + enterprise tier + compliance olgunluk"

| # | Ticket | Efor | Disiplin |
|---|---|---|---|
| T21 | Penetration test #1 (dış firma, OWASP Top 10, cross-tenant) | XL | Security |
| T22 | KVKK VERBİS bildirim panel | L | Compliance |
| T23 | AS9100 audit export otomasyonu (defense tenant'lar) | L | Compliance |
| T24 | Chaos engineering ilk game day (Toxiproxy, pod kill) | M | SRE |
| T25 | Multi-admin RBAC (Finans/Ops/Support ayrımı) | M | Ops |
| T26 | SLO dashboard + error budget + alerting | M | SRE |
| T27 | Per-tenant cost allocation monthly report | M | Billing |
| T28 | Runbook drill #4-6 (game day dahil) | M | SRE |

**Toplam efor:** ~40 SP. **Çıktı:** 500→1000 tenant, enterprise tier canlı, compliance denetim-hazır.

---

## 8. KPI DASHBOARD ÖNERİSİ

### 8.1 Operations (SRE)
| Metrik | Hedef | Şu an |
|---|---|---|
| MTTR (Mean Time To Recovery) | <30 dk | Ölçülmüyor |
| MTBF (Mean Time Between Failures) | >30 gün | Ölçülmüyor |
| Toil % (manuel iş oranı) | <30% | ~50%+ tahmini |
| Runbook drill frekansı | 2 ayda 1 | Hiç |
| On-call yanıt (alert → ack) | <5 dk | Yok |

### 8.2 Development (DORA Metrikleri)
| Metrik | Hedef | Şu an |
|---|---|---|
| Deployment frequency | Haftada 3+ | ~1-2 |
| Lead time (commit → prod) | <1 gün | ~1-3 gün |
| Change failure rate | <15% | Bilinmiyor |
| Time to restore service | <1 saat | Ölçülmüyor |
| Test coverage (API / UI) | 80% / 60% | Ölçülmüyor |

### 8.3 Customer Success
| Metrik | Hedef | Şu an |
|---|---|---|
| Activation rate (7gün 3+ event) | 75% | Sprint 16'da canlı |
| Health score median | 70+ | Yok |
| Aylık churn | <5% | Ölçülmüyor |
| NPS | 40+ | Yok |
| Onboarding time-to-first-value | <15 dk | ~30+ dk tahmini |

### 8.4 Billing & Finance
| Metrik | Hedef | Şu an |
|---|---|---|
| MRR growth | Aylık %+ | Panel yok |
| Trial → paid conversion | 40% | Sprint 16 funnel |
| ARPU (plan bazlı) | — | Yok |
| Gross margin | >70% | Hesaplanmıyor |
| Failed payment recovery | 70% | Sprint 16 dunning |

### 8.5 Infrastructure
| Metrik | Hedef | Şu an |
|---|---|---|
| Per-tenant P95 latency | <500ms | Custom metrics |
| SLO error budget | 99.5% | Tanımlanmamış |
| Disk utilization per tenant | Alarm %85 | Sprint 16 quota |
| Connection pool saturation | <70% | Görünmez |
| Backup verification success | 100% | Sprint 16 daily drill ✅ |

---

## 9. EKİP & ROL TAKVİMİ

| Dönem | Rol | Neden | Alternatif |
|---|---|---|---|
| **Q2 2026 (şu an)** | Mevcut 1+1+0.5 yeterli Faz 1 için | Foundation work | — |
| **Q2 2026 sonu** | **+1 SRE/DevOps** (part → full) | Prometheus, PgBouncer, DR drill | Grafana dashboard (freelance) |
| **Q3 2026** | **+1 Data/Billing Engineer** (half OK) | MRR/ARR, cost analytics, e-fatura | Foriba API consultant (2 ay) |
| **Q4 2026** | **+1 Compliance Lead** (part) | KVKK VERBİS, AS9100, pen test | — |
| **Q1 2027** | **+1 SRE full**, **+1 CSM PM** | Chaos eng, health score, announcement | — |

**Toplam takvim (önerilen ekiple):** 13-15 ay, burnout-free.
**Sadece mevcut ekiple:** 20-22 ay + yüksek tükenmişlik.

**Outsource edilebilecekler:**
- Penetration test (yılda 1, Q4 2026 — bağımsız firma)
- Foriba e-fatura integration (2 ay consultant)
- Grafana dashboard tasarım (freelance)
- KVKK VERBİS + DPO danışmanlık (part-time)

---

## 10. "SUSAN BOMBALAR" — KAÇIRILMAMASI GEREKENLER

1. **NPM 2 critical vulnerability** — disclosed CVE ise exploit saatler içinde, **acil fix** (Ticket 6).
2. **KVKK VERBİS bildirimi** — 50+ tenant'ta **zorunlu**, gecikirse idari para cezası (₺50K+).
3. **e-fatura VUK 509** — Türkiye'de B2B zorunlu, Foriba/Logo sertifikasyonu 2-3 ay alır. Pilot deployment öncesi aktif olmalı.
4. **AuditLog unbounded growth** — 6-9 ay içinde query performansı çöker (Ticket 13).
5. **AdminController 2221 LOC** — 3+ dev olduğu gün refactor zorunlu, 2-3 sprint kaybı (Ticket 8).
6. **DR runbook drill-siz** — ilk gerçek outage RTO 2h yerine 4-6h → SLA kırılır.
7. **Cross-tenant leak regresyonu** — Sprint 14 fix'i var ama CI guard yok, test coverage dar. Yeni modül eklerken tekrar patlayabilir.
8. **WhatsApp Business API** — provider policy değişikliği çağrı oranını sıfırlayabilir. Fallback SMS/e-posta yok.
9. **Dependency supply chain** — event-stream benzeri saldırı, transitive dep. CI'da SBOM + Trivy zorunlu.
10. **Backup S3 offsite** — `BackupVerificationService` S3 upload **optional** (line 375-384). Production config verify edilmeli, offsite copy garantisi.

---

## 11. KAPANIŞ — 3 AY / 12 AY / 24 AY UFKU

### 3 ay (Q2 2026 sonu)
- 50 → 150 tenant, ops konfor bölgesinde
- CI/CD + CODEOWNERS + NPM vuln 0
- DR drill #1 tamamlandı, RPO/RTO gerçek sayı
- KVKK UI skeleton live, 72h job kuruldu
- AdminController split + ADR klasörü
- **Çıktı:** Solo-dev rahatlığı korundu, ekip +1 SRE işe alındı

### 12 ay (Q2 2027)
- 500 tenant, $200K ARR
- Prometheus + Grafana + OpenTelemetry tam stack
- Cloud cost per tenant görünür, gross margin kontrolü
- KVKK VERBİS bildirim, 3 aylık audit rotation aktif
- Postmortem kültürü, 6 drill tamamlandı
- Health score + churn prediction proaktif CS
- **Çıktı:** Enterprise tier pilot 3-5 tenant, savunma sanayi hazır

### 24 ay (Q2 2028)
- 1000+ tenant, $500K ARR
- Dedicated DB tier + hibrit izolasyon canlı
- AS9100 compliance audit otomasyonu (defense müşteri)
- Chaos engineering aylık game day
- Multi-admin RBAC, in-app messaging, advanced RBAC
- Pen test #2 geçildi, zero critical finding
- **Çıktı:** Türkiye KOBİ ERP pazarında ölçek lideri, yatırımcı hazır

---

## EK A — Kritik Dosya Kanıtları

| Dosya | İçerik | Not |
|---|---|---|
| `quvex-docs/analysis/ADMIN-PANEL-1000-TENANT-AUDIT-2026-04-14.md` | 471 satır, mevcut audit | Sprint 16 top-10 kapandı |
| `quvex-docs/architecture/DISASTER-RECOVERY-RUNBOOK.md` | 200+ satır, RPO/RTO tanımlı | **Drill-siz** |
| `smallFactoryApi/src/Quvex.API/Controllers/AdminController.cs` | **2221 satır** | God object |
| `smallFactoryApi/src/Quvex.API/Controllers/ProductionController.cs` | **1542 satır** | God object |
| `smallFactoryApi/src/Quvex.API/Services/BackupVerificationService.cs` | 630 satır | Daily drill ✅ |
| `smallFactoryApi/src/Quvex.API/Services/TenantSchemaService.cs` | 680 satır | Drift check ✅ |
| `smallFactoryApi/src/Quvex.API/Middleware/RequestLoggingMiddleware.cs` | 130 satır | CorrelationId + PII mask |
| `smallFactoryApi/src/Quvex.API/Middleware/MetricsMiddleware.cs:165-264` | Custom Prometheus | Scraper yok |
| `smallFactoryUI/package.json` | **54 npm vuln (2 critical)** | **Acil** |
| `smallFactoryUI/.husky/pre-commit` | lint-staged only | Build test yok |
| `smallFactoryApi/src/Quvex.Domain/Entities/Common/KvkkRecord.cs` | Entity var | UI yok |
| `smallFactoryApi/src/Quvex.Domain/Entities/Common/AuditLog.cs` | Unbounded | Archival yok |
| `.github/` | — | **Yok**, CODEOWNERS + CI/CD eksik |

---

## EK B — Referans Çerçeveler

- **DORA Metrikleri:** Deployment frequency, lead time, change failure rate, time to restore
- **Google SRE kitabı:** Toil %, error budget, SLO, postmortem kültürü
- **KVKK Madde 12:** Veri ihlali 72h bildirimi, DSR 30 gün yanıt süresi
- **VUK 509:** E-fatura zorunluluğu, Foriba/Logo/Nilvera sertifikasyonu
- **AS9100:** Internal audit, corrective action, audit finding tracking
- **OWASP Top 10:** Pen test referans
- **CIS Controls:** Security benchmark

---

**— Audit ekibi: Operations Lead + Senior SRE + Staff Engineer + Compliance Lead**
**Tarih:** 2026-04-14
**Sonraki revizyon:** Sprint 22 sonrası (3 ay)
