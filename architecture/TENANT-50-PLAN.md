# Quvex — 50 Tenant + Tiering Uygulama Planı

## Tarih: 2026-03-25 (Güncelleme: 2026-03-29)
## Hedef: 50 tenant, ~500 kullanıcı, Tier 1/2 desteği
## Sektör: Küçük-orta ölçekli üretim + savunma sanayi firmaları
## Altyapı: 2 VDS (API + DB ayrı) + Docker Compose

---

## MİMARİ

```
                         ┌──────────────────┐
                         │   Nginx/Ingress   │
                         │ *.quvex.app       │
                         └────────┬─────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │         API VDS            │
                    │  ┌─────────┐ ┌──────────┐ │
                    │  │ API     │ │ Worker   │ │
                    │  │ (Docker)│ │(Hangfire)│ │
                    │  └────┬────┘ └────┬─────┘ │
                    │       │           │       │
                    │  ┌────┴───────────┴────┐  │
                    │  │      Redis          │  │
                    │  │  (Cache+Session+RL) │  │
                    │  └─────────────────────┘  │
                    └─────────────┬─────────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │         DB VDS             │
                    │  ┌──────────┐              │
                    │  │PgBouncer │              │
                    │  │ :6432    │              │
                    │  └────┬─────┘              │
                    │       │                    │
                    │  ┌────┴──────────────────┐ │
                    │  │ PostgreSQL Primary     │ │
                    │  │ :5432                  │ │
                    │  │                        │ │
                    │  │ ┌── quvex_shared ────┐ │ │
                    │  │ │ public (metadata)  │ │ │
                    │  │ │ tenant_firma_a     │ │ │
                    │  │ │ tenant_firma_b     │ │ │
                    │  │ │ ... (max 50)       │ │ │
                    │  │ └────────────────────┘ │ │
                    │  │                        │ │
                    │  │ ┌── firma_x_db ──────┐ │ │
                    │  │ │ (Tier 2 - own DB)  │ │ │
                    │  │ └────────────────────┘ │ │
                    │  └────────────────────────┘ │
                    │                              │
                    │  ┌────────────────────────┐  │
                    │  │ PostgreSQL Replica      │  │
                    │  │ :5433 (read-only)       │  │
                    │  │ Raporlar + AI Insights  │  │
                    │  └────────────────────────┘  │
                    └──────────────────────────────┘
```

---

## TENANT TİERİNG

### Tier 1: Shared (Varsayılan)
- Aynı DB, ayrı schema
- Paylaşılan connection pool
- Standart rate limit
- Paylaşılan backup

### Tier 2: Dedicated DB
- Kendi PostgreSQL database'i (aynı veya farklı sunucu)
- Kendi connection pool limiti
- Yüksek rate limit
- Bağımsız backup/restore
- Admin panelden tek tıkla Tier 1 → Tier 2 geçiş
- **Savunma sanayi firmaları için önerilen tier** (veri izolasyonu zorunluluğu)

### Tier 3: Dedicated Server (Planlanan)
- Kendi sunucusu + read replica
- On-premise destek
- Tam fiziksel izolasyon

### Tier Geçiş Akışı
```
1. Admin "Tier 2'ye Yükselt" tıklar
2. Sistem yeni DB oluşturur (aynı veya farklı host)
3. pg_dump ile mevcut schema'yı yeni DB'ye kopyalar
4. Connection string AES-256-GCM ile şifrelenir, Tenant kaydına yazılır
5. TenantContext.Tier, DatabaseName, DedicatedConnectionString güncellenir
6. Redis cache invalidate
7. Eski schema 24 saat sonra silinir (rollback penceresi)
8. Tenant kesintisiz çalışmaya devam eder
```

---

## TAMAMLANAN GÜVENLİK DÜZELTMELERİ (2026-03-29)

### Kritik: HasQueryFilter Eksikleri Giderildi
Aşağıdaki 22 entity'ye tenant izolasyon filtresi eklendi:

| Entity | Kategori | Önceki Durum | Yeni Durum |
|--------|----------|-------------|------------|
| AuditLog | Güvenlik | FİLTRE YOK | ✅ Filtrelendi |
| TenantSetting | Güvenlik | FİLTRE YOK | ✅ Filtrelendi |
| SecurityIncident | Güvenlik | FİLTRE YOK | ✅ Filtrelendi |
| SecurityPolicy | Güvenlik | FİLTRE YOK | ✅ Filtrelendi |
| Files | Dosya | FİLTRE YOK | ✅ Filtrelendi |
| ProductFiles | Dosya | FİLTRE YOK | ✅ Filtrelendi |
| Attendance | İK | FİLTRE YOK | ✅ Filtrelendi |
| EmployeeShift | İK | FİLTRE YOK | ✅ Filtrelendi |
| CompetencyMatrix | İK | FİLTRE YOK | ✅ Filtrelendi |
| ConfigurationChange | Konfig | FİLTRE YOK | ✅ Filtrelendi |
| CustomerPropertyIncident | Kalite | FİLTRE YOK | ✅ Filtrelendi |
| DesignProject | Tasarım | FİLTRE YOK | ✅ Filtrelendi |
| DesignReview | Tasarım | FİLTRE YOK | ✅ Filtrelendi |
| FodAreaCheck | Kalite | FİLTRE YOK | ✅ Filtrelendi |
| KpiDefinition | KPI | FİLTRE YOK | ✅ Filtrelendi |
| KpiMeasurement | KPI | FİLTRE YOK | ✅ Filtrelendi |
| ProductRevision | Ürün | FİLTRE YOK | ✅ Filtrelendi |
| ApprovedPartSource | Tedarik | FİLTRE YOK | ✅ Filtrelendi |
| OnboardingProgress | Onboard | FİLTRE YOK | ✅ Filtrelendi |
| ChangelogEntry | Changelog | FİLTRE YOK | ✅ Filtrelendi |

**Toplam entity filter: 121 → 143**

### Kritik: Frontend Login Token Hatası Düzeltildi
- `accessToken: res.data.userData.refreshToken` → `accessToken: res.data.userData.accessToken`
- Hata toast'larında `toast.success()` → `toast.error()` olarak düzeltildi
- Login handler'da variable shadowing (`const data` → `const loginData`) düzeltildi

### Kritik: Logout Tenant Cleanup Eklendi
- `handleLogout` reducer'a `clearTenantInfo()` çağrısı eklendi
- Trial session data (quvex_trial_expired, quvex_trial_days_left) temizleniyor
- Farklı tenant ile login yapıldığında eski tenant bilgisi sızma riski kapatıldı

### Yüksek: Redis Fail-Open → Fail-Closed
- `TryAcquireConnectionSlot` artık Redis çöktüğünde `return true` (fail-open) yapmıyor
- `ConcurrentDictionary` tabanlı in-memory fallback eklendi
- Bir tenant'ın Redis outage sırasında tüm connection pool'u tüketmesi engellendi
- Response.OnCompleted ile in-memory counter decrement garantilendi

### Yüksek: SignalR Tenant Scoping
- `useSignalR.js`'e `JoinTenantGroup(tenantId)` eklendi
- `X-Tenant-Id` header SignalR bağlantısına eklendi
- Cross-tenant notification client-side validasyonu eklendi
- Reconnect sonrası grup yeniden katılım eklendi

### Yüksek: API Response Tenant Validation
- `api.js` response interceptor'a tenant doğrulama katmanı eklendi
- Tek obje, array ve paginated response'lar kontrol ediliyor
- TenantId uyuşmazlığında `[SECURITY]` log + request reject
- Defense-in-depth: Backend hatası olsa bile frontend'de veri sızıntısı engellenir

### Yüksek: Dedicated DB Connection Desteği
- `TenantConnectionFactory` AES-256-GCM şifreleme/çözme desteği eklendi
- `BuildDedicatedConnectionString()` metodu: Tier 2 tenant provisioning için
- `EncryptConnectionString()` / `DecryptConnectionString()`: Güvenli connection string saklama
- `TenantContext`'e `Tier`, `DedicatedConnectionString`, `DatabaseName`, `ReadReplicaHost` eklendi
- `TenantTier` enum: Shared, DedicatedDb, DedicatedServer

### Test: Tenant Isolation Testleri Genişletildi
- 15 → 25 test case'e çıkarıldı
- Yeni testler:
  - AuditLog cross-tenant izolasyonu
  - Files cross-tenant izolasyonu
  - SecurityIncident cross-tenant izolasyonu
  - SecurityPolicy cross-tenant izolasyonu
  - DesignProject cross-tenant izolasyonu
  - KpiDefinition cross-tenant izolasyonu
  - SuperAdmin audit log ve dosya erişimi
  - Çoklu yeni-filtrelenen entity toplu izolasyon testi
  - **Savunma sektörü senaryosu**: İki savunma firması tam izolasyon testi

---

## YAPILACAKLAR

### Faz 1: Temel Altyapı (Hafta 1-2)

#### 1.1 Redis Aktifleştirme
- docker-compose.yml'e Redis ekle
- REDIS_CONNECTION env var ayarla
- Mevcut IDistributedCache otomatik çalışacak

#### ~~1.2 Tenant Entity Genişletme + Migration~~ ✅ TAMAMLANDI (2026-03-29)
- TenantContext'e Tier, DedicatedConnectionString, DatabaseName, ReadReplicaHost eklendi
- TenantTier enum tanımlandı (Shared, DedicatedDb, DedicatedServer)

#### 1.3 JWT Tenant Claim
- Login'de JWT'ye tenant_id + tenant_schema + tier ekle
- TenantResolutionMiddleware JWT'den önce çözsün

#### ~~1.4 ITenantConnectionFactory~~ ✅ TAMAMLANDI (2026-03-29)
- AES-256-GCM şifreleme ile connection string saklama
- Tier-based connection routing
- BuildDedicatedConnectionString(), Encrypt/Decrypt destekleri

#### 1.5 Schema Sync → Hangfire
- Startup'tan kaldır
- Her 6 saatte Hangfire job olarak çalıştır

### Faz 2: PgBouncer + Read Replica (Hafta 3-4)

#### 2.1 PgBouncer
```ini
[databases]
quvex_shared = host=localhost port=5432 dbname=quvex_dev
quvex_shared_ro = host=localhost port=5433 dbname=quvex_dev

[pgbouncer]
listen_port = 6432
pool_mode = transaction
max_client_conn = 2000
default_pool_size = 50
reserve_pool_size = 20
```

#### 2.2 PostgreSQL Read Replica
- Streaming replication ile 1 replica
- Raporlar, AI Insights, Export → replica'dan oku
- ReadOnlyQuvexDBContext oluştur

#### 2.3 Rate Limiting → Redis
- ConcurrentDictionary → Redis INCR
- Tenant plan'a göre limit

### Faz 3: Admin Panel + Tenant Yönetimi (Hafta 5-7)

#### 3.1 Tenant CRUD (API)
- POST /api/Admin/tenants — Yeni tenant oluştur + schema
- PUT /api/Admin/tenants/{id} — Tenant bilgi güncelle
- POST /api/Admin/tenants/{id}/promote — Tier 1 → Tier 2 (farklı DB/host destekli)
- POST /api/Admin/tenants/{id}/demote — Tier 2 → Tier 1
- POST /api/Admin/tenants/{id}/backup — Manuel backup
- POST /api/Admin/tenants/{id}/restore — Backup'tan restore
- DELETE /api/Admin/tenants/{id} — Tenant sil (GDPR)
- GET /api/Admin/tenants/{id}/usage — Storage, kullanıcı, kayıt sayıları
- GET /api/Admin/tenants/{id}/activity — Son aktiviteler

#### 3.2 Tenant Admin Dashboard (UI)
Sayfalar:
- **Tenant Listesi** — Tüm tenantlar, tier badge, durum, kullanıcı sayısı
- **Tenant Detay** — Bilgi düzenleme, plan, trial, storage
- **Tenant Oluşturma Wizard** — 3 adımlı: Firma bilgileri → Plan seçimi → Admin kullanıcı
- **Tier Yönetimi** — Tier 1/2 geçiş butonu + onay modal (hedef host seçimi)
- **Backup Yönetimi** — Backup listesi, restore, indirme
- **Kullanıcı Yönetimi** — Tenant bazlı kullanıcı listesi
- **Monitoring** — Tenant bazlı request/error/latency grafikler

#### 3.3 Tenant Onboarding Wizard (UI)
```
Adım 1: Firma Bilgileri
  - Firma adı, ticari ünvan, vergi no
  - İletişim: email, telefon, şehir
  - Sektör: Üretim / Savunma / Havacılık / Diğer

Adım 2: Plan Seçimi
  - Başlangıç (Ücretsiz 14 gün trial)
  - Profesyonel (aylık/yıllık)
  - Kurumsal (özel fiyat, Tier 2 zorunlu)
  - Savunma Paketi (Tier 2 + audit log + KVKK uyumluluk)

Adım 3: Admin Kullanıcı
  - Ad, soyad, email, şifre
  - → Tenant oluştur + schema + seed + kullanıcı
  - → Welcome email gönder
  - → firma.quvex.app subdomain aktif
```

### Faz 4: Backup + Monitoring + Test (Hafta 8)

#### 4.1 Otomatik Backup
- Günlük: Tüm schema'lar + public
- Tier 2: Ayrı DB backup
- 30 gün retention
- S3/MinIO'ya upload (opsiyonel)

#### 4.2 Tenant Monitoring
- Prometheus metrikleri: tenant bazlı request/sec, latency, error rate
- Grafana dashboard (veya basit admin panel widget)
- Alert: Tenant SLA ihlali, storage limit yaklaşma

#### 4.3 Load Test
- 50 tenant simülasyonu
- 500 eşzamanlı kullanıcı
- P99 latency < 200ms doğrulama

---

## SAVUNMA SANAYİ GEREKSİNİMLERİ

50 tenant hedefinde savunma/havacılık sektörü firmaları için ek gereksinimler:

### Zorunlu (Tier 2)
- **Fiziksel veri izolasyonu**: Dedicated DB (aynı veya farklı host)
- **Şifreli connection string**: AES-256-GCM (✅ Tamamlandı)
- **Audit trail izolasyonu**: AuditLog HasQueryFilter (✅ Tamamlandı)
- **Dosya izolasyonu**: Files/ProductFiles HasQueryFilter (✅ Tamamlandı)
- **AS9100 uyumluluk**: Quality modülleri tenant-isolated

### Önerilen
- PostgreSQL RLS (Row-Level Security) — ikinci savunma hattı
- Per-tenant encryption keys (Phase 2)
- KVKK veri export/silme araçları
- SOC2 audit log export (JSON/CSV)
- Tenant-scoped SignalR (✅ Tamamlandı)

---

## ZAMAN ÇİZELGESİ

| Hafta | İş | Efor | Durum |
|-------|---|------|-------|
| 1 | Redis + Tenant Entity + JWT claim + Migration | 3 gün | ✅ Entity tamamlandı |
| 2 | ITenantConnectionFactory + Schema sync optimize | 2 gün | ✅ Factory tamamlandı |
| 3 | PgBouncer + Read Replica setup | 2 gün | Beklemede |
| 4 | ReadOnlyDbContext + Rate limit Redis | 2 gün | Beklemede |
| 5 | Tenant CRUD API (promote/demote/backup/delete) | 3 gün | Beklemede |
| 6 | Admin Panel UI (tenant list, detail, tier yönetimi) | 3 gün | Beklemede |
| 7 | Onboarding Wizard + Welcome email | 2 gün | Beklemede |
| 8 | Backup otomasyon + Monitoring + Load test | 2 gün | Beklemede |
| **Toplam** | | **~19 gün** | |

---

## ADMIN PANEL EKRAN TASARIMLARI

### Tenant Listesi
```
┌─────────────────────────────────────────────────────────────┐
│ Tenant Yönetimi                              [+ Yeni Tenant]│
├─────────────────────────────────────────────────────────────┤
│ Ara...                       Filtre: [Tümü] [Aktif]        │
├───┬────────────┬───────┬──────┬───────┬──────┬──────────────┤
│   │ Firma      │ Plan  │ Tier │ Users │ Durum│ Aksiyonlar   │
├───┼────────────┼───────┼──────┼───────┼──────┼──────────────┤
│ 1 │ RynSoft    │ Pro   │ T1   │ 12    │ Aktif│ [Edit][Up]   │
│ 2 │ ABC Hava.  │ Kur.  │ T2   │ 45    │ Aktif│ [Edit][Down] │
│ 3 │ Demo       │ Trial │ T1   │ 3     │ Trial│ [Edit][Up]   │
│ 4 │ XYZ Metal  │ Bas.  │ T1   │ 8     │ Aktif│ [Edit][Up]   │
│ 5 │ DEF Sav.   │ Sav.  │ T2   │ 30    │ Aktif│ [Edit][Down] │
└───┴────────────┴───────┴──────┴───────┴──────┴──────────────┘
│ Toplam: 50 tenant │ Aktif: 45 │ Trial: 5 │ T1: 40 │ T2: 10 │
```

### Tier Yükseltme Modal
```
┌─────────────────────────────────────────────┐
│ Tier 2'ye Yükselt — ABC Havacılık          │
├─────────────────────────────────────────────┤
│                                             │
│ Bu işlem:                                   │
│ - Firmaya özel veritabanı oluşturur         │
│ - Mevcut veriler yeni DB'ye taşınır         │
│ - Bağımsız backup/restore imkanı            │
│ - Daha yüksek performans ve izolasyon       │
│                                             │
│ Hedef Veritabanı:                           │
│ Host: [localhost       ]  (farklı sunucu    │
│ Port: [5432           ]   kullanılabilir)   │
│ DB:   [quvex_abc_hava ]                     │
│                                             │
│ ! İşlem sırasında firma kısa süre           │
│   read-only modda çalışır (~2-5 dakika)     │
│                                             │
│           [İptal]  [Yükselt]                │
└─────────────────────────────────────────────┘
```

### Tenant Detay
```
┌─────────────────────────────────────────────────────────────┐
│ ABC Havacılık A.Ş.                    Tier 2    Aktif       │
├──────────────────────────┬──────────────────────────────────┤
│ Firma Bilgileri          │ Plan & Abonelik                  │
│ VKN: 1234567890          │ Plan: Kurumsal                   │
│ VD: Ankara               │ Başlangıç: 15.01.2026           │
│ İletişim: info@abc.com   │ Bitiş: 15.01.2027               │
│ Tel: 0312 555 1234       │ Max User: 50                     │
│ Şehir: Ankara            │ Storage: 450MB / 5000MB          │
│ Sektör: Savunma          │ DB Host: db2.quvex.internal      │
├──────────────────────────┼──────────────────────────────────┤
│ Kullanım İstatistikleri  │ Aksiyonlar                       │
│ Kullanıcı: 45/50         │ [Tier 1'e Düşür]                │
│ Ürün: 1,234              │ [Backup Al]                      │
│ Üretim Emri: 567         │ [Backup Restore]                 │
│ Fatura: 890              │ [Veriyi Sil]                     │
│ Son Aktivite: 2 dk önce  │ [Deaktif Et]                     │
│ Aylık Request: 45,230    │ [On-Premise Paketi]              │
└──────────────────────────┴──────────────────────────────────┘
```
