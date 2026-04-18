# Quvex Admin Panel — 1000 Tenant Olgunluk Denetimi

> **Tarih:** 2026-04-14
> **Ekip:** Operations Lead (eski Insider/Trendyol) + Senior SRE (eski Hepsiburada/Vodafone) + CSM Lead (eski Algolia/Iyzico)
> **Kapsam:** Super-admin platform yönetim paneli
> **Mevcut ölçek:** ~50 aktif tenant — **Hedef:** 1000 tenant + $500K ARR
> **Mod:** Dış due diligence, dürüst, benchmark'lı

---

## 1. YÖNETİCİ ÖZETİ (300 kelime)

Quvex, Türkiye KOBİ üretim sektörü için iddialı bir çok kiracılı (multi-tenant) ERP. Schema-per-tenant mimarisi, Hangfire iş kuyruğu, Sprint 13-14'te kapatılan cross-tenant leak'leri ve ALTAY YAZILIM E2E'de %95.9 başarı oranı ile **teknik ürün sağlam bir noktada**. Ancak platformun **işletme (operations), güvenilirlik (SRE), müşteri başarısı ve gelir (billing) boyutları**, 50 tenant'lık mevcut konforu aşıp 1000 tenant gerçeğine taşımaya hazır değil.

Mevcut admin paneli ~54 API endpoint ve 14 UI sayfasından oluşuyor. Bu yüzey **tenant yaşam döngüsü** ve **temel izleme** için yeterli; ancak otomatik trial lifecycle, kotalar, health scoring, MRR/churn analitiği, self-healing, dunning akışı, SLA dashboard'u ve KVKK/e-fatura uyum raporları **tamamen yok veya manuel**. 50 müşteride bir kurucu bunu elle yönetebilir — 200'ün üstünde bu tablo kırılır, 500'de operasyon durma noktasına gelir.

**Bulgular:** 4 disiplinde toplam **62 eksik** tespit edildi. Bunların **18'i KRİTİK** (platform 200 tenant üstüne çıkamaz), 24'ü YÜKSEK, 20'si ORTA/DÜŞÜK. En büyük boşluk sırayla: (1) **CS/Billing analitiği yok** — MRR, churn, trial conversion, health score, dunning akışı mevcut değil; (2) **SRE gözlemlenebilirliği satıhta** — per-tenant metrik ve slow query log yok, backup verification ve DR drill hiç yapılmamış; (3) **Operations otomasyonu manuel** — trial expire, freeze, quota enforcement, feature flag panelleri eksik.

**Top 3 kritik aksiyon (Sprint 16):** Trial lifecycle state machine + otomatik suspension, per-tenant slow query + resource dashboard, MRR/churn/conversion funnel. **12 aylık roadmap:** Faz 1 (200 tenant, 4 sprint), Faz 2 (500 tenant + health score + billing automation, 7 sprint), Faz 3 (1000 tenant + dedicated tier + compliance, 6 sprint). Mevcut 1 backend + 1 frontend + 0.5 DevOps ekibiyle **Faz 1 ~4 ay, Faz 2 ~6 ay** (bu faz için +1 data/billing mühendisi kaçınılmaz), Faz 3 ~4 ay (+1 SRE, +1 CSM tooling PM gerekli). Aksi halde 500 tenant'ta operasyon çöker, churn %15'i aşar, ARR hedefi 2027'ye kayar.

---

## 2. MEVCUT ENVANTER

### 2.1 Admin API Endpoint'leri (54 adet)

**AdminController (`/Admin`, 1563 satır, 24 endpoint)**

| Metod | Path | Amaç | Permission |
|---|---|---|---|
| POST | `/Admin/tenant/{id}/impersonate` | Super admin → tenant oturumu | Genel.All |
| GET | `/Admin/dashboard` | Platform geneli KPI + 30 günlük trend | Genel.All |
| GET | `/Admin/tenants` | Tenant listesi (temel sayfalama, filtre yok) | Genel.All |
| GET | `/Admin/tenants/{id}` | Tenant detay | Genel.All |
| GET | `/Admin/tenants/{id}/stats` | Tenant'a özel kullanım istatistikleri | Genel.All |
| PUT | `/Admin/tenants/{id}/status` | Aktif/pasif toggle (tek tıkla suspend yok) | Genel.All |
| POST | `/Admin/tenants` | Yeni tenant (senkron, ~9 sn) | Genel.All |
| PUT | `/Admin/tenants/{id}` | Tenant düzenle | Genel.All |
| POST | `/Admin/tenants/{id}/promote` | Shared → DedicatedDb → DedicatedServer | Genel.All |
| POST | `/Admin/tenants/{id}/demote` | Tier düşürme | Genel.All |
| DELETE | `/Admin/tenants/{id}` | Hard delete (soft delete + grace period yok) | Genel.All |
| GET | `/Admin/tenants/{id}/usage` | Disk, user, kayıt sayımı | Genel.All |
| GET | `/Admin/audit-logs` | Filtreli audit log (export yok) | Genel.All |
| GET | `/Admin/tenant-growth` | Aylık büyüme grafiği | Genel.All |
| GET | `/Admin/system-health` | DB/Redis/Hangfire up/down | Genel.All |
| POST | `/Admin/tenants/{id}/backup` | Manuel pg_dump (BACKUP_DIR) | Genel.All |
| GET | `/Admin/tenants/{id}/backups` | Backup dosya listesi (disk üstünde) | Genel.All |
| POST | `/Admin/tenants/{id}/restore` | Backup geri yükleme | Genel.All |
| GET | `/Admin/monitoring` | Monitoring summary | Genel.All |
| GET | `/Admin/monitoring/health` | Tüm tenant health skorları | Genel.All |
| GET | `/Admin/monitoring/alerts` | In-memory alert listesi (process ömrü!) | Genel.All |
| GET | `/Admin/monitoring/activity` | Son aktiviteler | Genel.All |
| POST | `/Admin/monitoring/health-check` | Manuel health cycle tetikleme | Genel.All |
| GET/POST | `/Admin/schema/*` | Şema karşılaştırma ve onarım | Genel.All |

**TenantBulkController (`/Admin/bulk`, 7 endpoint)**
- `POST /activate`, `/deactivate`, `/change-plan`, `/send-email`, `/operation` (generic bulk op)
- `GET /export` (CSV), `/notifications`

**TenantDataController (`/Admin/data`, 3 endpoint)** — KVKK
- `GET /{tenantId}/export`, `POST /{tenantId}/delete`, `POST /{tenantId}/anonymize`

**TenantMonitoringController (`/Admin/tenant-monitoring`, 6 endpoint)**
- `GET /`, `GET /health`, `GET /health/{tenantId}`, `GET /alerts`, `GET /activity`, `POST /health-check`

**TenantRegistrationController (`/register`, 5 endpoint)** — Public self-service
- `POST /`, `GET /status/{tenantId}`, `POST /verify-email`, `POST /demo`

**TenantAdminController (`/tenant-admin`, 11 endpoint)** — Yeni legacy controller, AdminController ile **ciddi biçimde örtüşüyor** (teknik borç, tek kaynak olmalı)

**BillingController (`/Billing`, 6 endpoint)** — Self-service tenant odaklı, super-admin değil
- `GET /current-plan`, `POST /subscribe`, `/change-plan`, `/cancel`, `GET /history`, `GET /plans`
- **Eksik:** Dunning, failed payment retry, refund, tax report, MRR/ARR toplaması, admin plan atama paneli

### 2.2 Admin UI Sayfaları (14 adet)

| Rota | Dosya | Amaç | Kullanılan endpoint |
|---|---|---|---|
| `/admin/dashboard` | AdminDashboard.js | Platform özeti, KPI card, 30-günlük trend | `/Admin/dashboard` |
| `/admin/tenants` | TenantList.js | Tenant tablosu (basit arama) | `/Admin/tenants` |
| `/admin/tenants/new` | TenantCreate.js | Tekil tenant oluşturma formu | `POST /Admin/tenants` |
| `/admin/tenants/:id` | TenantDetail.js | Tab'lı detay (Genel, Kullanım, Backup, Audit) | Çoklu `/Admin/tenants/{id}/*` |
| `/admin/audit-logs` | AuditLogs.js | Platform audit listesi | `/Admin/audit-logs` |
| `/admin/monitoring` | MonitoringDashboard.jsx | Health skorları + latency heat-map | `/Admin/monitoring/*` |
| `/admin/alerts` | AlertsPanel.jsx | In-memory alert ekranı | `/Admin/monitoring/alerts` |
| `/admin/bulk` | BulkOperations.jsx | Çoklu tenant aksiyonları | `/Admin/bulk/*` |
| `/admin/schema` | SchemaComparison.jsx | Şema drift kontrolü + repair | `/Admin/schema/*` |
| `/admin/onboarding` | TenantOnboardingWizard.jsx | Guided onboarding sihirbazı | `POST /Admin/tenants` + setup |
| `/admin/feedback` | FeedbackList.js | Kullanıcı geri bildirim listesi | `/Feedback` |
| `/admin/users` | UserManagement.js | Tenant-içi user yönetimi | `/Account/*` |
| `/admin/tier-modal` | TierPromoteDemoteModal.js | Tier değişim modalı | `/Admin/tenants/{id}/promote|demote` |

**Yaklaşık 80-95 ekran** (detay tab'ları dahil). Benchmark: Stripe Atlas admin ~200+, Segment ~180+, Linear Admin Console ~60.

### 2.3 Hangfire Recurring Jobs (13 adet)

1. `stock-alerts` — günlük 08:00 (tenant-by-tenant, S14-T3)
2. `delayed-order-alerts` — günlük 08:00
3. `cleanup-expired-tokens` — 6 saatte bir
4. `production-board-refresh` — 5 dakikada bir
5. `check-system-alerts` — 5 dakikada bir
6. `check-stock-levels-auto-purchase` — saatte bir
7. `machine-downtime-auto-detect` — 5 dakikada bir
8. `tenant-health-check` — 5 dakikada bir
9. `tenant-trial-expiry-warnings` — günlük 09:00 (**sadece uyarı, suspend yok**)
10. `tenant-storage-warnings` — günlük 10:00 (**sadece log, enforcement yok**)
11. `tenant-inactivity-reminders` — pazartesi 09:00
12. `fetch-tcmb-rates` — hafta içi 15:45
13. `sync-tenant-schemas` — 6 saatte bir
14. `workflow-timed-triggers` — saatte bir
15. `schema-drift-check` — günlük 03:00

**Hangfire dashboard:** `/hangfire` — `LocalRequestsOnlyAuthorizationFilter`. **Uzaktan erişilemez, admin UI'a entegre değil.** Prod'da SSH tüneli gerekir.

### 2.4 İzleme Altyapısı

- **Sentry** (API + UI, env var tabanlı DSN, PII strip aktif)
- **Serilog** (structured log, dosya + console, Seq yok)
- **MetricsMiddleware** — `ConcurrentDictionary` üzerinde process-lokal counter (tenant requests/errors/latency). **Memory leak riski, TTL yok**, pod restart'ta sıfırlanır, pod'lar arası paylaşım yok
- `/health` endpoint'i (DB + Redis + Hangfire)
- **Prometheus/Grafana yok, APM yok, distributed tracing yok**

### 2.5 Tenant Yaşam Döngüsü

```
[Register] → [Email Verify] → [Hangfire CreateSchema] → [Active]
                                                          ↓
                                               [PUT /status (manuel)]
                                                          ↓
                                                 [Inactive] → [Manual DELETE]
```

**Tanımlı state yok**: `Trial / Active / PastDue / Suspended / Archived / Deleted` gibi machine durumu yok. `Tenant.IsActive` tek boolean. Trial expire → uyarı maili gidiyor ama **otomatik suspend yok**.

### 2.6 Billing Entegrasyonu

- **PayTR** migration hazır (sandbox), Iyzico legacy
- `PaymentService` var ama subscription recurring payment motoru **yok**
- Plan değişimi API'si var, ücret tahsilatı manuel
- **MRR/ARR/churn tablosu yok**, invoice otomasyonu kısmi, dunning akışı yok

### 2.7 Backup / Restore

- Manuel `pg_dump` per tenant (`ITenantMigrationService.BackupTenantAsync`)
- Dosyalar `BACKUP_DIR` disk dizininde (**S3/blob yok, retention policy yok, encryption at rest yok**)
- Restore endpoint var (`POST /Admin/tenants/{id}/restore`)
- **RTO/RPO tanımlı değil**, backup verification yok, DR drill hiç çalıştırılmamış
- DISASTER-RECOVERY-RUNBOOK.md dosyası var ama tatbikat geçmişi yok

---

## 3. 4 DİSİPLİN EKSİKLİK TABLOSU

### 3.1 Operations — 16 eksik (5 KRİTİK, 7 YÜKSEK, 4 ORTA)

| # | Eksik | Severity | Açıklama |
|---|---|---|---|
| O1 | Tenant lifecycle state machine | **KRİTİK** | Trial/Active/PastDue/Suspended/Archived durumları, otomatik geçiş kuralları |
| O2 | Otomatik trial expiration + suspend | **KRİTİK** | Bugün sadece uyarı maili. Trial biten tenant çalışmaya devam ediyor — gelir kaybı |
| O3 | Quota enforcement (DB size, storage, user, API) | **KRİTİK** | Quota limit yok; bir tenant diski doldurabilir, diğer tenant'ları etkiler |
| O4 | Soft delete + restore grace period | **KRİTİK** | `DELETE` hard delete; "sildim geri alın" senaryosu desteklenmez (KVKK'ya da aykırı, 30 gün tutulmalı) |
| O5 | In-memory alert store kalıcı değil | **KRİTİK** | `TenantMonitoringService._alerts` static list; pod restart → tüm alert'ler uçar |
| O6 | Advanced filter/search (plan, MRR, sektör, lastLogin, health) | YÜKSEK | 1000 tenant listede CTRL+F yetmez |
| O7 | Bulk operations filter → action (500 tenant tek tıkla) | YÜKSEK | Bulk controller var ama filter-driven seçim UI'da eksik |
| O8 | Per-tenant feature flag paneli | YÜKSEK | Yeni modül A/B test, kademeli rollout, per-tenant toggle yok |
| O9 | Maintenance window scheduling | YÜKSEK | Tenant-by-tenant bakım penceresi, banner gösterimi yok |
| O10 | Audit log export (CSV/JSON) + immutable store | YÜKSEK | Görüntüleme var, export yok; aynı DB'de silinebilir |
| O11 | Notification template editor | YÜKSEK | E-posta/WhatsApp şablonları kodda hardcoded |
| O12 | Impersonation audit + 2FA koruması | YÜKSEK | `POST /tenant/{id}/impersonate` var, ek onay/reason alanı yok |
| O13 | Tenant tag/etiket sistemi | ORTA | "Savunma", "Pilot", "VIP", "Payment issue" etiketleri yok |
| O14 | Maintenance mode (platform geneli) | ORTA | Herkesi offline alma anahtarı yok |
| O15 | Change management console (release notes/tenant) | ORTA | Her tenant'a duyuru gönderme merkezi yok |
| O16 | Super admin RBAC (multi-admin rol ayrımı) | ORTA | Tek rol `Genel.All`; finans admin vs ops admin ayrımı yok |

### 3.2 SRE / Infrastructure — 17 eksik (7 KRİTİK, 6 YÜKSEK, 4 ORTA)

| # | Eksik | Severity | Açıklama |
|---|---|---|---|
| S1 | Per-tenant resource metrics (CPU, RAM, IOPS, connection) | **KRİTİK** | Process-lokal dictionary var, Prometheus histogram yok; 1000 tenant'ta noisy neighbor tespit edilemez |
| S2 | pg_stat_statements slow query log per tenant | **KRİTİK** | Yavaş sorgu hangi tenant'tan geldiği belirsiz; bir tenant platformu çökertebilir |
| S3 | Backup verification + periodic restore drill | **KRİTİK** | pg_dump var, geri yüklenebilirlik test edilmemiş |
| S4 | Connection pool dashboard | **KRİTİK** | PgBouncer tarafında görünürlük yok; 1000 tenant × 5 conn = 5000 → ezber |
| S5 | Hangfire admin UI entegrasyonu + uzaktan erişim | **KRİTİK** | `LocalRequestsOnlyAuthorizationFilter` prod'da kilitli |
| S6 | DR runbook yapılmış drill + RPO/RTO hedefleri | **KRİTİK** | Doküman var, uygulama yok. Hedef: RPO 15 dk, RTO 2 saat, bugün ölçülemez |
| S7 | Per-tenant DB migration failure dashboard | **KRİTİK** | `TenantSchemaService.SyncAllTenantSchemasAsync` sessiz hata döndürebilir; hangi tenant kırıldı? |
| S8 | Capacity forecasting (tenant/storage/connection trend) | YÜKSEK | "1 ay sonra disk dolacak mı" sorusu yanıtlanamaz |
| S9 | Incident timeline / internal status page | YÜKSEK | Outage süresi, etkilenen tenant'lar, RCA akışı yok |
| S10 | Synthetic monitoring (canary login + cart + invoice) | YÜKSEK | Gerçek kullanıcı kırılmadan kırılmayı tespit eden test yok |
| S11 | SSL/custom domain management per tenant | YÜKSEK | Subdomain var, custom domain CNAME + Let's Encrypt otomasyonu yok |
| S12 | Per-tenant rate limit dashboard | YÜKSEK | Rate limit uygulanıyor, hangi tenant ne kadar 429 aldı görünmüyor |
| S13 | Postgres replication lag monitörü | YÜKSEK | Read replica desteği planda, lag alarmı yok |
| S14 | Redis cache hit/miss + tenant dağılımı | ORTA | Temel Redis metriği bile toplanmıyor |
| S15 | Distributed tracing (OpenTelemetry) | ORTA | Hangi endpoint yavaş, hangi query → görünmez |
| S16 | Error budget + SLO tanımı | ORTA | 99.5%/99.9% SLO'ya karşı alert yok |
| S17 | Chaos engineering / game day | DÜŞÜK | Henüz luks — ama Faz 3'te gerekli |

### 3.3 Customer Success / Sales Ops — 14 eksik (4 KRİTİK, 6 YÜKSEK, 4 ORTA)

| # | Eksik | Severity | Açıklama |
|---|---|---|---|
| C1 | Trial conversion funnel (register → 1. müşteri → 1. fatura → ödeme) | **KRİTİK** | Her KOBİ SaaS'in temel metriği. Bugün yok, CS körlük |
| C2 | Tenant health score (login frekansı, modül kullanımı, destek talep sayısı) | **KRİTİK** | "Hangi tenant çıkacak" tahmini yapılamaz |
| C3 | Onboarding stuck detection | **KRİTİK** | Register ettikten sonra 24-48 saat ilerlemeyen tenant otomatik tespit edilemiyor |
| C4 | Activation event tracking (first customer, first invoice, first production order) | **KRİTİK** | "Aktif tenant" tanımı yok → churn analizi mümkün değil |
| C5 | Customer interaction log (çağrı, e-posta, toplantı) | YÜKSEK | CS her tenant için not tutamıyor |
| C6 | Support ticket entegrasyonu | YÜKSEK | Feedback modülü var ama Intercom/Zendesk/Freshdesk entegrasyonu yok |
| C7 | NPS / CSAT in-app collection | YÜKSEK | Platform sağlığı ölçülmüyor |
| C8 | Cohort analysis (kayıt ayına göre retention) | YÜKSEK | "2026-02'de kayıt olanların 3. ay retention'ı?" yanıtlanamaz |
| C9 | Personalized communication template (sektör bazlı) | YÜKSEK | Savunma tenant'ına farklı mesaj, tekstil tenant'ına farklı yok |
| C10 | Demo scheduling + calendar entegrasyon | YÜKSEK | Sales funnel ürün içinden yönetilmiyor |
| C11 | Win/lost reason tracking | ORTA | Kaybedilen tenant neden kaybedildi? Bilinmiyor |
| C12 | In-app messaging / announcement center | ORTA | Tenant'lara duyuru göndermek manuel |
| C13 | Usage anomaly detection (birden düşüş) | ORTA | Sessiz churn sinyalleri yakalanmıyor |
| C14 | Referral / customer advocacy takibi | DÜŞÜK | Türkiye KOBİ pazarı referans odaklı, ama sonraki faz |

### 3.4 Billing / Finance — 15 eksik (2 KRİTİK, 5 YÜKSEK, 8 ORTA)

| # | Eksik | Severity | Açıklama |
|---|---|---|---|
| B1 | Subscription dashboard (aktif abonelik, plan dağılımı, yenileme) | **KRİTİK** | BillingController self-service, admin paneli yok |
| B2 | Failed payment + dunning workflow (retry, email, suspend) | **KRİTİK** | Başarısız ödeme → ne olacak? Bugün hiçbir şey |
| B3 | MRR / ARR / NRR tracking | YÜKSEK | Finans rapor çekemiyor, yatırımcıya verilecek sayı yok |
| B4 | Churn cohort + reason | YÜKSEK | Her ay kaç tenant gidiyor, neden, hangi plan — bilinmiyor |
| B5 | Trial → paid conversion rate | YÜKSEK | Ürün-pazar uyumu ölçüsü eksik |
| B6 | Invoice PDF + e-arşiv generate | YÜKSEK | Admin tarafında oluşturma yok (InvoiceService var, subscription invoice'a bağlı değil) |
| B7 | KDV / e-fatura uyum raporu (KVKK + VUK 509) | YÜKSEK | Türkiye zorunluluğu, denetimde sorun çıkar |
| B8 | Refund / credit note yönetimi | ORTA | Para iadesi akışı yok |
| B9 | Annual prepay discount rule motor | ORTA | Yıllık ödeme indirimi hardcode edilmeli |
| B10 | Revenue per tenant (ARPU) | ORTA | CSM "en değerli tenant" bilmiyor |
| B11 | Plan change prorate hesabı | ORTA | Plan yükselirken gün farkı hesap yok |
| B12 | Coupon / discount code engine | ORTA | Kampanya yapılamıyor |
| B13 | Customer statement / billing history admin view | ORTA | Müşteri bazlı full history admin panelinde yok |
| B14 | Tax engine (KDV oran tablosu) | ORTA | Sabit %20, istisna durumlar elde |
| B15 | Multi-currency support for subscriptions | DÜŞÜK | USD/EUR plan desteği ileride |

**Toplam: 62 eksik — 18 KRİTİK, 24 YÜKSEK, 16 ORTA, 4 DÜŞÜK**

---

## 4. STRES SENARYOLARI (1000 Tenant)

### S1. Cuma 17:00 — 50 yeni tenant register
**Şu an:** `POST /register` → senkron schema create (~9 sn) → HTTP timeout riski. Sprint 14'te Hangfire'a alındı ama 50 paralel iş aynı anda `SyncAllTenantSchemas` ile yarışır.
**Kırılma:** 200. tenant'ta connection pool (200 max) dolar. 500. tenant'ta Hangfire worker tıkanır, schema create kuyruğu patlar.
**Şiddet:** YÜKSEK — onboarding deneyimi bozulur, trial conversion düşer.

### S2. Pazartesi 09:00 — 1000 tenant'ta toplu trial bitti
**Şu an:** `tenant-trial-expiry-warnings` Hangfire job'u **sadece e-posta gönderir**. Otomatik suspend yok.
**Kırılma:** Suspend mekanizması yok → gelir kaybı sınırsız. Elle yapılırsa admin 2 gün ekranda.
**Şiddet:** KRİTİK — $20K+/ay kaçak gelir riski 500 tenant'ta.

### S3. Salı 14:00 — Bir tenant 50K kayıt import
**Şu an:** Hiçbir per-tenant rate limit veya resource throttle aktif değil. Import endpoint büyük transaction açar.
**Kırılma:** 200. tenant'tan itibaren connection pool tıkanır, diğer tenant'lar 504 alır. pg_stat_statements görünmediği için hangi tenant suçlu belirlenemez.
**Şiddet:** KRİTİK — noisy neighbor platformu çöker.

### S4. Çarşamba 23:00 — Hangfire `stock-alerts` 1000 tenant'ı taradığında
**Şu an:** `TenantJobRunner` tenant-by-tenant döner. 1000 tenant × ~2 sn = 33 dakika. Tek worker.
**Kırılma:** Diğer recurring job'lar (`check-system-alerts` 5 dk'da bir) kuyrukta bekler → gecikmeler birikir.
**Şiddet:** YÜKSEK — Faz 2'de Hangfire worker sayısı artırılmalı + job paralelizasyon.

### S5. Perşembe 03:00 — Postgres restart
**Şu an:** Connection pool yeniden dolarken API 503 → HPA scale-up tetiklenir, ama cold start SignalR bağlantılarını kaybeder. DR runbook dokümanı var, drill yapılmamış.
**Kırılma:** RTO tanımsız → gerçek değer muhtemelen 30-60 dk. Müşteri verimsiz kalır.
**Şiddet:** KRİTİK — RTO 2 saatin üstünde gider, SLA kırılır.

### S6. Cuma 11:00 — Bir tenant DB'yi %80 doldurdu
**Şu an:** `tenant-storage-warnings` günlük 10:00'da uyarı maili atar. **Enforcement yok.** 
**Kırılma:** Tenant %100'e ulaşır → PostgreSQL disk dolar → **tüm tenant'lar yazamaz**. Sprint 14 cross-tenant leak fix'lerine rağmen "cross-tenant DoS" zaafiyeti.
**Şiddet:** KRİTİK — platform geneli outage.

### S7. Hafta sonu — admin tatilde, self-healing var mı?
**Şu an:** K8s self-heal (pod restart) var. Alert → bildirim kanalı (Slack/PagerDuty) **bağlı değil**. Sentry mail atar ama triaj yok. In-memory alert store pod restart'ta uçar.
**Kırılma:** Pazartesi sabah "cumartesi akşamı X tenant offline'dı" diye anlayabilirsin. Bir tenant için bu ciddi itibar hasarıdır.
**Şiddet:** YÜKSEK — on-call rotasyon ve otomatik eskalasyon yok.

**Sonuç:** Platform **şu an 200-300 tenant** için güvenli çalışır. 500'de S1, S3, S6 kritik olur. 1000'de yedi senaryodan **beşi aynı hafta içinde** patlar.

---

## 5. 12 AYLIK ROADMAP (3 FAZ)

### FAZ 1 — Sağlamlaştırma (Sprint 16-19, 4 sprint, ~3 ay, 50→200 tenant)

**Hedef:** Trial→paid %40+, 200 tenant'ta zero-panic hafta sonu, 12 KRİTİK eksik kapandı.

| Item | Efor | Disiplin |
|---|---|---|
| Tenant lifecycle state machine + DB kolonu (`LifecycleStatus` enum) | L | Ops |
| Otomatik trial expire → suspend (Hangfire job + grace period) | M | Ops |
| Soft delete + 30 gün restore | S | Ops |
| Per-tenant quota enforcement (storage, user) | M | Ops/SRE |
| Alert store → DB tablosu (in-memory yerine) | S | SRE |
| MRR + trial conversion funnel dashboard | L | Billing/CS |
| Failed payment + temel dunning (3 retry + e-posta) | L | Billing |
| Slow query per tenant (pg_stat_statements paneli) | M | SRE |
| Hangfire dashboard secured proxy (admin UI iframe) | S | SRE |
| Backup → S3/blob + retention + hash verify | M | SRE |
| Advanced tenant filter + saved view | M | Ops |
| Activation event tracking (4 temel event) | M | CS |

**Efor:** ~30-35 story point / sprint × 4 sprint. **Riskler:** Lifecycle state migration mevcut tenant'ları bozmamalı. Quota enforcement agresif ise müşteri şikayet.

### FAZ 2 — Ölçek + Gelir (Sprint 20-26, 7 sprint, ~5 ay, 200→500 tenant)

**Hedef:** Health score canlı, CS proaktif, billing otomasyonu tam, NPS 40+, aylık churn <%5, ARR $200K.

| Item | Efor | Disiplin |
|---|---|---|
| Health score engine (5 boyut, nightly job) | L | CS |
| Onboarding stuck detection + otomatik CS task | M | CS |
| Cohort analysis + retention dashboard | L | CS |
| ARR/MRR/NRR/churn/ARPU paneli | L | Billing |
| E-fatura + e-arşiv subscription invoice otomasyonu | XL | Billing |
| Per-tenant feature flag sistemi | L | Ops |
| Prometheus + Grafana + per-tenant panel | L | SRE |
| Synthetic monitoring (canary suite) | M | SRE |
| DR drill + RPO/RTO rapor | M | SRE |
| Connection pool dashboard + tenant conn quota | M | SRE |
| Multi-admin RBAC (Finans/Ops/Support rolleri) | M | Ops |
| Notification template editor | M | Ops |
| Support ticket entegrasyonu (Freshdesk veya internal) | L | CS |
| PgBouncer + max_connections=4000 migration | M | SRE |

**Riskler:** E-fatura entegrasyonu Türkiye VUK 509 compliance gerektirir, Foriba/Logo sertifikasyonu zaman alır. Prometheus migration mevcut Serilog + Sentry stack'iyle çakışabilir.

### FAZ 3 — Kurumsal (Sprint 27-32+, 6 sprint, ~4 ay, 500→1000 tenant)

**Hedef:** Savunma sanayi "enterprise tier" live, dedicated-db satışa çıkıyor, compliance raporları hazır, $500K ARR.

| Item | Efor | Disiplin |
|---|---|---|
| DedicatedDb + DedicatedServer tier canlı + bulk promote | XL | SRE/Ops |
| Hibrit izolasyon (RLS + schema), katalog limiti aşımı | XL | SRE |
| KVKK compliance paneli (veri export + silme + audit) | L | Ops/Compliance |
| AS9100/ISO audit log ihracı (savunma tenant'ları) | L | Ops |
| Custom domain + Let's Encrypt otomasyonu | M | SRE |
| SLA dashboard + error budget | M | SRE |
| In-app messaging / announcement center | M | CS |
| Refund / credit note + multi-currency | L | Billing |
| Chaos engineering / game day ilk çalıştırma | M | SRE |
| KDV oran tablosu + tax engine | M | Billing |
| Advanced impersonation + reason + 2FA | S | Ops |
| Incident timeline / status page | M | SRE |

**Riskler:** Hibrit izolasyon migrasyonu mevcut tenant'ları etkiler; en düşük trafikli tenant'larla başla, kademeli. Savunma compliance denetim gerektirir, dış danışman çağırılabilir.

---

## 6. BÜTÇE VE İNSAN KAYNAĞI

**Mevcut ekip:** 1 senior backend + 1 senior frontend + 0.5 DevOps + Claude AI

### Faz 1 (4 sprint, ~3-4 ay)
- Backend 70%, Frontend 50%, DevOps 60%, AI 20% destek
- **Gerçekçi:** ~4 ay (takvim). Paralel olarak müşteri demo + feature request devam ettiği için buffer 1 ay.
- **Risk:** Backend tek kişi — hastalık/izin = sprint kaybı.

### Faz 2 (7 sprint, ~5-6 ay)
- Yeni roller:
  - **+1 Data/Billing engineer** (half-time OK, finans + reporting) — **zorunlu**
  - **+1 SRE/DevOps** (part-time → full-time) — **zorunlu** (Prometheus, PgBouncer tuning, DR drill)
- Outsource edilebilecekler: E-fatura entegrasyonu (Foriba API consultant, 2 ay); Grafana dashboard tasarımı; incident runbook yazımı
- **Efor artışı:** Mevcut ekip sayılı task'ı yapabilir ama paralellik düşer; 7 sprint 9'a uzar.

### Faz 3 (6 sprint, ~4-5 ay)
- Ek roller:
  - **+1 SRE full-time** (hibrit izolasyon + chaos eng için)
  - **+1 CSM tooling PM** (health score, onboarding, announcement)
  - **+1 Compliance lead** (part-time, KVKK + AS9100 audit export)
- Outsource: Security penetration test (yılda 1, zorunlu); compliance audit raporu

**Toplam takvim (mevcut ekiple + önerilen büyümeyle):** ~13-15 ay.  
**Sadece mevcut ekiple (büyütme yok):** ~20-22 ay + yüksek burnout.

---

## 7. TOP 10 ACİL AKSİYON (Sprint 16 backlog)

### 1. Tenant Lifecycle State Machine
- **Süre:** L (8-10 gün)
- **Disiplin:** Operations
- **Yapılmazsa:** Trial tenant'lar bedava kullanmaya devam eder. 500 tenant'ta $20K/ay kayıp. Otomatik yönetim imkansız.
- **Kabul:** `LifecycleStatus` enum (Trial/Active/PastDue/Suspended/Archived/Deleted) migration, Hangfire trial-expire-transition job, UI'da state change butonları, tüm state değişiklikleri audit log'a düşer.

### 2. Per-Tenant Slow Query + Resource Dashboard
- **Süre:** M (4-5 gün)
- **Disiplin:** SRE
- **Yapılmazsa:** Bir tenant'ın kötü import'u tüm platformu yavaşlatır, kimin suçlu olduğu bilinemez.
- **Kabul:** `pg_stat_statements` extension aktif, `/admin/monitoring/slow-queries?tenantId=...` endpoint'i, top 20 query + mean time + call count, 7 günlük tutma.

### 3. MRR/Churn/Trial Conversion Dashboard
- **Süre:** L (6-8 gün)
- **Disiplin:** Billing/CS
- **Yapılmazsa:** Ürün sağlığı ölçülemez, yatırımcıya rapor üretilemez, pazarlama ROI bilinmez.
- **Kabul:** `/admin/finance` sayfası, aylık MRR chart, plan dağılımı pie, trial→paid conversion %, churn cohort heatmap, CSV export.

### 4. In-Memory Alert Store → DB Tablosu
- **Süre:** S (2 gün)
- **Disiplin:** SRE
- **Yapılmazsa:** Her pod restart tüm alert geçmişini siler, incident timeline oluşturulamaz.
- **Kabul:** `TenantAlert` entity, `TenantMonitoringService` DB'ye yazar, 90 gün retention, severity index.

### 5. Failed Payment Dunning Workflow
- **Süre:** L (8 gün)
- **Disiplin:** Billing
- **Yapılmazsa:** Başarısız ödeme sessiz geçer, recovery yok. %15 involuntary churn.
- **Kabul:** 3-tier retry (1-3-7 gün), her retry öncesi e-posta, 3. fail → PastDue state, 14. gün Suspended.

### 6. Tenant Soft Delete + 30 Gün Grace
- **Süre:** S (3 gün)
- **Disiplin:** Operations
- **Yapılmazsa:** Yanlışlıkla silinen tenant kurtarılamaz. KVKK'ya da aykırı (veri sorumlusuna işlem öncesi makul süre).
- **Kabul:** `DeletedAt` kolonu, HasQueryFilter'a eklenir, `POST /Admin/tenants/{id}/restore` 30 güne kadar, 30 gün sonra Hangfire `purge-deleted-tenants` job'u.

### 7. Backup Verification + S3 Retention
- **Süre:** M (5 gün)
- **Disiplin:** SRE
- **Yapılmazsa:** Backup'lar "var" ama geri yüklenebilir mi bilinmiyor. Gerçek felakette çalışmayacak olması muhtemel.
- **Kabul:** Her `BackupTenantAsync` sonrası SHA256 hash, S3/MinIO'ya upload, daily random tenant restore-to-temp drill + Prometheus counter `backup_verification_success_total`.

### 8. Quota Enforcement (Storage + User Count)
- **Süre:** M (4-5 gün)
- **Disiplin:** Ops/SRE
- **Yapılmazsa:** Bir tenant diski doldurur, tüm platform yazamaz.
- **Kabul:** Plan başına `MaxStorageMB` + `MaxUsers`, upload endpoint'leri pre-check, quota %80 warning, %95 block, admin UI'da manuel override.

### 9. Advanced Tenant Filter + Saved View
- **Süre:** M (4 gün)
- **Disiplin:** Ops
- **Yapılmazsa:** 1000 tenant listede filtresiz navigasyon imkansız, bulk op kullanılamaz.
- **Kabul:** `/Admin/tenants?plan=pro&sector=savunma&lastLogin<7d&healthScore<60` destekli query, UI'da chip-based filter bar, 5 preset ("At-risk", "Trial expiring", "Yüksek değer", "Yeni eklenen", "Savunma pilot").

### 10. Activation Event Tracking
- **Süre:** M (4 gün)
- **Disiplin:** CS
- **Yapılmazsa:** "Aktif tenant" tanımı yok, onboarding health ölçülemez, CS proaktif olamaz.
- **Kabul:** `TenantActivationEvent` tablo (first_user_login, first_customer, first_product, first_invoice, first_production_order), `/Admin/monitoring/activation-funnel` dashboard, stuck (>48s event eksik) tenant'ları listeler.

---

## 8. EKLER — Benchmark Referansları

| Platform | Neyi iyi yapıyor, Quvex ne ödünç alabilir |
|---|---|
| **Stripe Dashboard** | Subscription lifecycle state machine, dunning akışı, invoice otomasyonu, MRR charts, webhook debugger. **Ödünç al:** plan prorate, dunning retry matrix, MRR charts. |
| **Linear Admin Console** | Minimal ama güçlü workspace yönetimi, bulk ops, audit log export. **Ödünç al:** keyboard-driven bulk ops, saved filter. |
| **Notion Enterprise Admin** | Workspace analytics, member activity heatmap, data export (GDPR). **Ödünç al:** activation tracking pattern, KVKK export. |
| **Segment Personas Admin** | Tenant health score, cohort analysis, funnel visualization. **Ödünç al:** health score formülü, cohort retention. |
| **Supabase Dashboard** | Per-project DB size, connection pool, slow query viewer, backup browser. **Ödünç al:** SQL editor + slow query panel (admin'e özel). |
| **PlanetScale Admin** | Branch + schema diff + safe migration UI. **Ödünç al:** Schema drift UI zaten var, onu genişlet. |
| **Intercom / Freshdesk** | Support ticket + in-app messaging. **Entegre et:** Faz 2'de webhook tabanlı basit sync. |

**Türkiye'ye özel:**
- **PayTR sanbox → prod:** Subscription recurring için `/api/v2/subscription` endpoint'i, retry strategy = dunning tier'larına bağlanmalı.
- **e-fatura:** Foriba / Logo / Nilvera — en hızlı Foriba (REST API, 2-3 hafta integration). VUK 509 zorunlu.
- **KVKK VERBİS:** 50+ tenant'tan sonra veri sorumlusu bildirimi + işleme envanteri; admin panel bunu üretmeli.

---

## KAPANIŞ NOTU

Quvex'in **teknik çekirdeği** Sprint 13-14'ten sonra ileri seviyede: cross-tenant leak kapandı, FindAsync anti-pattern temizlendi, TenantRequiredMiddleware kritik korumayı sağladı. **Ürün-pazar uyumu** da güçlü: 10 sektör audit, 18 dikey, Sprint 11'deki niş modüller pazar genişletti.

Eksik olan — ve 1000 tenant yolunu tıkayacak olan — **teknik üründen çok "SaaS işletme" katmanı**. Faz 1'de gösterilen 12 item yapılırsa 200 tenant rahatça, Faz 2 tamamlanırsa 500 tenant stres altında, Faz 3 ile 1000 tenant enterprise tier gerçek olur.

**Yapılmazsa:** 200. tenant'ta operasyon manuel çalışmaz hale gelir, 300'de churn %15 üstü, 500'de platform cuma akşamları dönmez.

**Yapılırsa:** $500K ARR 2027 Q1, savunma sanayi pilot 5→15 tenant, Türkiye KOBİ ERP pazarında ölçek avantajı.

— *Audit ekibi: Operations Lead + Senior SRE + CSM Lead*
