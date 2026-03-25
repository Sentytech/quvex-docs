# Quvex — 50 Tenant Sprint Planı

## Toplam: 4 Sprint (8 hafta), ~19 iş günü
## Başlangıç: 2026-03-26

---

## SPRINT 1: Temel Altyapı (Hafta 1-2)
**Hedef:** Redis, JWT, Tenant Entity, Connection Factory
**Tahmini efor:** 5 gün

### Görevler

| # | Task | Tip | Efor | Bağımlılık | Durum |
|---|------|-----|------|-----------|-------|
| S1-01 | Redis Docker container + env var ayarla | INFRA | 0.5 gün | - | TODO |
| S1-02 | Redis bağlantı doğrulama + health check | INFRA | 0.5 gün | S1-01 | TODO |
| S1-03 | Tenant entity genişletme (Tier, DatabaseHost, ConnectionString, firma bilgileri, trial/subscription) | API | 1 gün | - | TODO |
| S1-04 | EF Core migration oluştur + uygula (3 schema) | API | 0.5 gün | S1-03 | TODO |
| S1-05 | TenantTier enum → Domain/Enums | API | 0.25 gün | S1-03 | TODO |
| S1-06 | JWT'ye tenant_id + tenant_schema + tier claim ekle (AccountController) | API | 0.5 gün | S1-03 | TODO |
| S1-07 | TenantResolutionMiddleware: JWT claim öncelikli çözümleme | API | 0.5 gün | S1-06 | TODO |
| S1-08 | ITenantConnectionFactory interface + implementation | API | 0.5 gün | S1-03 | TODO |
| S1-09 | QuvexDBContext → factory pattern (dynamic connection) | API | 0.5 gün | S1-08 | TODO |
| S1-10 | Schema sync → Hangfire recurring job (startup'tan kaldır) | API | 0.25 gün | S1-01 | TODO |

### Sprint 1 Kabul Kriterleri
- [ ] Redis çalışıyor ve API bağlanıyor
- [ ] Tenant entity'de yeni alanlar var (migration uygulandı)
- [ ] JWT'de tenant bilgileri var
- [ ] Tier 1 ve Tier 2 tenant'lar farklı connection string alıyor
- [ ] Build: 0 hata, Test: 1222+ pass
- [ ] Mevcut 2 tenant kesintisiz çalışıyor

---

## SPRINT 2: PgBouncer + Read Replica + Rate Limit (Hafta 3-4)
**Hedef:** Connection pooling, okuma trafiği ayrıştırma, dağıtık rate limiting
**Tahmini efor:** 5 gün

### Görevler

| # | Task | Tip | Efor | Bağımlılık | Durum |
|---|------|-----|------|-----------|-------|
| S2-01 | PgBouncer Docker container + config | INFRA | 0.5 gün | S1 | TODO |
| S2-02 | API connection string → PgBouncer'a yönlendir | API | 0.5 gün | S2-01 | TODO |
| S2-03 | PgBouncer transaction mode + search_path test | TEST | 0.5 gün | S2-02 | TODO |
| S2-04 | PostgreSQL streaming replication setup (read replica) | INFRA | 1 gün | - | TODO |
| S2-05 | ReadOnlyQuvexDBContext oluştur | API | 0.5 gün | S2-04 | TODO |
| S2-06 | ReportController, ChartController, AIInsightsController → read replica | API | 0.5 gün | S2-05 | TODO |
| S2-07 | Rate limiting → Redis INCR (distributed) | API | 0.5 gün | S1-01 | TODO |
| S2-08 | Per-tenant connection limit (Redis counter) | API | 0.5 gün | S2-07 | TODO |
| S2-09 | docker-compose.yml güncelle (2 VDS yapısı) | INFRA | 0.25 gün | S2-01 | TODO |
| S2-10 | Load test: 10 tenant, 100 kullanıcı simülasyonu | TEST | 0.25 gün | S2-09 | TODO |

### Sprint 2 Kabul Kriterleri
- [ ] PgBouncer üzerinden tüm DB trafiği geçiyor
- [ ] Read replica çalışıyor, raporlar replica'dan okunuyor
- [ ] Rate limiting Redis-backed (multi-pod hazır)
- [ ] 10 tenant / 100 kullanıcı ile P99 < 200ms

---

## SPRINT 3: Admin Panel + Tenant CRUD + Tiering (Hafta 5-7)
**Hedef:** Tenant yaşam döngüsü yönetimi, Tier 1↔2 geçişi, admin UI
**Tahmini efor:** 6 gün

### Görevler

| # | Task | Tip | Efor | Bağımlılık | Durum |
|---|------|-----|------|-----------|-------|
| S3-01 | POST /api/Admin/tenants — Tenant oluştur + auto schema | API | 0.5 gün | S1 | TODO |
| S3-02 | PUT /api/Admin/tenants/{id} — Bilgi güncelle | API | 0.25 gün | S3-01 | TODO |
| S3-03 | POST /api/Admin/tenants/{id}/promote — Tier 1→2 (schema → dedicated DB) | API | 1 gün | S1-08 | TODO |
| S3-04 | POST /api/Admin/tenants/{id}/demote — Tier 2→1 (dedicated DB → schema) | API | 0.5 gün | S3-03 | TODO |
| S3-05 | DELETE /api/Admin/tenants/{id} — GDPR tenant silme | API | 0.5 gün | S3-01 | TODO |
| S3-06 | GET /api/Admin/tenants/{id}/usage — Storage, kullanıcı, kayıt sayıları | API | 0.25 gün | S3-01 | TODO |
| S3-07 | Admin Panel: Tenant Listesi sayfası (tier badge, durum, aksiyonlar) | UI | 0.5 gün | S3-01 | TODO |
| S3-08 | Admin Panel: Tenant Detay/Düzenleme sayfası | UI | 0.5 gün | S3-02 | TODO |
| S3-09 | Admin Panel: Tenant Oluşturma Wizard (3 adım) | UI | 1 gün | S3-01 | TODO |
| S3-10 | Admin Panel: Tier Yükseltme/Düşürme modal + progress | UI | 0.5 gün | S3-03 | TODO |
| S3-11 | TenantMigrationService: pg_dump → restore → config switch | API | 0.5 gün | S3-03 | TODO |

### Sprint 3 Kabul Kriterleri
- [ ] Admin panelden yeni tenant oluşturulabiliyor
- [ ] Tenant Tier 1→2 ve Tier 2→1 geçişi çalışıyor
- [ ] Tenant silinebiliyor (GDPR)
- [ ] Admin panelde tenant listesi, detay, tier yönetimi var

---

## SPRINT 4: Onboarding + Backup + Monitoring + Final Test (Hafta 8)
**Hedef:** Self-service kayıt, otomatik backup, monitoring, 50 tenant load test
**Tahmini efor:** 3 gün

### Görevler

| # | Task | Tip | Efor | Bağımlılık | Durum |
|---|------|-----|------|-----------|-------|
| S4-01 | Tenant Registration sayfası (public, self-service) | UI | 0.5 gün | S3-09 | TODO |
| S4-02 | Welcome email template + gönderim | API | 0.25 gün | S4-01 | TODO |
| S4-03 | Trial süre takibi + süre dolunca otomatik kısıtlama | API | 0.25 gün | S1-03 | TODO |
| S4-04 | Otomatik backup script (cron, tenant bazlı) | INFRA | 0.5 gün | S3-03 | TODO |
| S4-05 | Backup restore API endpoint + UI | API+UI | 0.5 gün | S4-04 | TODO |
| S4-06 | Tenant bazlı Prometheus metrikleri (OpenTelemetry basic) | API | 0.5 gün | - | TODO |
| S4-07 | Admin dashboard: Tenant monitoring widgets | UI | 0.25 gün | S4-06 | TODO |
| S4-08 | Load test: 50 tenant, 500 kullanıcı simülasyonu | TEST | 0.25 gün | ALL | TODO |

### Sprint 4 Kabul Kriterleri
- [ ] Self-service tenant kaydı çalışıyor
- [ ] Trial süresi kontrol ediliyor
- [ ] Günlük otomatik backup çalışıyor
- [ ] Admin panelde tenant monitoring var
- [ ] 50 tenant / 500 kullanıcı ile P99 < 200ms
- [ ] Tüm mevcut testler geçiyor

---

## RISK TABLOSU

| Risk | Olasılık | Etki | Sprint | Çözüm |
|------|----------|------|--------|-------|
| EF Core dynamic connection + model cache | Yüksek | Yüksek | S1 | IDbContextFactory test |
| PgBouncer + search_path uyumsuzluk | Orta | Kritik | S2 | Transaction mode doğrulama |
| Tier promote sırasında veri kaybı | Düşük | Kritik | S3 | pg_dump + verify + rollback |
| Read replica lag raporlarda tutarsızlık | Orta | Orta | S2 | Lag monitoring + fallback |
| 50 schema migration yavaşlama | Yüksek | Orta | S1 | Paralel sync + Hangfire |

---

## TEKNOLOJİ STACK

| Bileşen | Teknoloji | Sprint |
|---------|-----------|--------|
| Cache | Redis 7 (Docker) | S1 |
| Connection Pool | PgBouncer 1.21 | S2 |
| Read Replica | PostgreSQL Streaming Replication | S2 |
| Rate Limiting | Redis INCR sliding window | S2 |
| Background Jobs | Hangfire (mevcut) | S1 |
| Monitoring | Prometheus metrics + Serilog | S4 |
| Backup | pg_dump + cron + volume | S4 |

---

## BAŞARI METRİKLERİ

| Metrik | Hedef |
|--------|-------|
| Tenant oluşturma süresi | < 30 saniye |
| Tier 1→2 geçiş süresi | < 10 dakika |
| API P99 latency | < 200ms |
| Tenant izolasyonu | %100 (cross-tenant leak = 0) |
| Uptime | %99.9 (max 43 dk/ay downtime) |
| Backup recovery | < 30 dakika |
| Redis cache hit ratio | > %80 |
