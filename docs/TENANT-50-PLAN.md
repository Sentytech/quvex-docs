# Quvex — 50 Tenant + Tiering Uygulama Planı

## Tarih: 2026-03-25
## Hedef: 50 tenant, ~500 kullanıcı, Tier 1/2 desteği
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
- Kendi PostgreSQL database'i (aynı sunucu)
- Kendi connection pool limiti
- Yüksek rate limit
- Bağımsız backup/restore
- Admin panelden tek tıkla Tier 1 → Tier 2 geçiş

### Tier Geçiş Akışı
```
1. Admin "Tier 2'ye Yükselt" tıklar
2. Sistem yeni DB oluşturur
3. pg_dump ile mevcut schema'yı yeni DB'ye kopyalar
4. Tenant kaydı güncellenir (ConnectionString, Tier)
5. Redis cache invalidate
6. Eski schema 24 saat sonra silinir
7. Tenant kesintisiz çalışmaya devam eder
```

---

## YAPILACAKLAR

### Faz 1: Temel Altyapı (Hafta 1-2)

#### 1.1 Redis Aktifleştirme
- docker-compose.yml'e Redis ekle
- REDIS_CONNECTION env var ayarla
- Mevcut IDistributedCache otomatik çalışacak

#### 1.2 Tenant Entity Genişletme + Migration
```csharp
// Yeni alanlar
public TenantTier Tier { get; set; } = TenantTier.Shared;
public string? DatabaseHost { get; set; }       // null = shared
public string? DatabaseName { get; set; }       // null = shared
public string? ConnectionString { get; set; }   // encrypted
public string? ReadReplicaHost { get; set; }
public int MaxConnections { get; set; } = 20;
public string? ContactEmail { get; set; }
public string? ContactPhone { get; set; }
public string? CompanyTitle { get; set; }
public string? TaxNumber { get; set; }
public string? TaxOffice { get; set; }
public string? City { get; set; }
public string? LogoUrl { get; set; }
public DateTime? TrialEndsAt { get; set; }
public DateTime? SubscriptionEndsAt { get; set; }
public int StorageLimitMB { get; set; } = 1024;
public int CurrentStorageMB { get; set; } = 0;
public string? CustomDomain { get; set; }
```

#### 1.3 JWT Tenant Claim
- Login'de JWT'ye tenant_id + tenant_schema + tier ekle
- TenantResolutionMiddleware JWT'den önce çözsün

#### 1.4 ITenantConnectionFactory
```csharp
public interface ITenantConnectionFactory
{
    string GetConnectionString(TenantContext tenant);
    string GetReadReplicaConnectionString(TenantContext tenant);
}

public class TenantConnectionFactory : ITenantConnectionFactory
{
    public string GetConnectionString(TenantContext tenant)
    {
        if (tenant.Tier == TenantTier.DedicatedDb && !string.IsNullOrEmpty(tenant.ConnectionString))
            return Decrypt(tenant.ConnectionString);

        return _defaultConnectionString; // Shared DB
    }
}
```

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
- POST /api/Admin/tenants/{id}/promote — Tier 1 → Tier 2
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
- **Tier Yönetimi** — Tier 1/2 geçiş butonu + onay modal
- **Backup Yönetimi** — Backup listesi, restore, indirme
- **Kullanıcı Yönetimi** — Tenant bazlı kullanıcı listesi
- **Monitoring** — Tenant bazlı request/error/latency grafikler

#### 3.3 Tenant Onboarding Wizard (UI)
```
Adım 1: Firma Bilgileri
  - Firma adı, ticari ünvan, vergi no
  - İletişim: email, telefon, şehir

Adım 2: Plan Seçimi
  - Başlangıç (Ücretsiz 14 gün trial)
  - Profesyonel (aylık/yıllık)
  - Kurumsal (özel fiyat)

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

## ZAMAN ÇİZELGESİ

| Hafta | İş | Efor |
|-------|---|------|
| 1 | Redis + Tenant Entity + JWT claim + Migration | 3 gün |
| 2 | ITenantConnectionFactory + Schema sync optimize | 2 gün |
| 3 | PgBouncer + Read Replica setup | 2 gün |
| 4 | ReadOnlyDbContext + Rate limit Redis | 2 gün |
| 5 | Tenant CRUD API (promote/demote/backup/delete) | 3 gün |
| 6 | Admin Panel UI (tenant list, detail, tier yönetimi) | 3 gün |
| 7 | Onboarding Wizard + Welcome email | 2 gün |
| 8 | Backup otomasyon + Monitoring + Load test | 2 gün |
| **Toplam** | | **~19 gün** |

---

## ADMIN PANEL EKRAN TASARIMLARI

### Tenant Listesi
```
┌─────────────────────────────────────────────────────────────┐
│ Tenant Yönetimi                              [+ Yeni Tenant]│
├─────────────────────────────────────────────────────────────┤
│ 🔍 Ara...                    Filtre: [Tümü ▾] [Aktif ▾]    │
├───┬────────────┬───────┬──────┬───────┬──────┬──────────────┤
│   │ Firma      │ Plan  │ Tier │ Users │ Durum│ Aksiyonlar   │
├───┼────────────┼───────┼──────┼───────┼──────┼──────────────┤
│ 1 │ RynSoft    │ Pro   │ T1🟢│ 12    │ Aktif│ [✏️][⬆️][🗑️] │
│ 2 │ ABC Hava.  │ Kur.  │ T2🔵│ 45    │ Aktif│ [✏️][⬇️][🗑️] │
│ 3 │ Demo       │ Trial │ T1🟢│ 3     │ Trial│ [✏️][⬆️][🗑️] │
│ 4 │ XYZ Metal  │ Baş.  │ T1🟢│ 8     │ Aktif│ [✏️][⬆️][🗑️] │
└───┴────────────┴───────┴──────┴───────┴──────┴──────────────┘
│ Toplam: 20 tenant │ Aktif: 18 │ Trial: 2 │ T1: 18 │ T2: 2 │
```

### Tier Yükseltme Modal
```
┌─────────────────────────────────────────────┐
│ ⬆️ Tier 2'ye Yükselt — ABC Havacılık       │
├─────────────────────────────────────────────┤
│                                             │
│ Bu işlem:                                   │
│ ✅ Firmaya özel veritabanı oluşturur        │
│ ✅ Mevcut veriler yeni DB'ye taşınır        │
│ ✅ Bağımsız backup/restore imkanı           │
│ ✅ Daha yüksek performans ve izolasyon      │
│                                             │
│ ⚠️ İşlem sırasında firma kısa süre         │
│    read-only modda çalışır (~2-5 dakika)    │
│                                             │
│ Tahmini süre: 3-10 dakika (veri boyutuna    │
│ bağlı)                                      │
│                                             │
│           [İptal]  [Yükselt 🚀]            │
└─────────────────────────────────────────────┘
```

### Tenant Detay
```
┌─────────────────────────────────────────────────────────────┐
│ ABC Havacılık A.Ş.                    Tier 2 🔵  Aktif 🟢  │
├──────────────────────────┬──────────────────────────────────┤
│ Firma Bilgileri          │ Plan & Abonelik                  │
│ VKN: 1234567890          │ Plan: Kurumsal                   │
│ VD: Ankara               │ Başlangıç: 15.01.2026           │
│ İletişim: info@abc.com   │ Bitiş: 15.01.2027               │
│ Tel: 0312 555 1234       │ Max User: 50                     │
│ Şehir: Ankara            │ Storage: 450MB / 5000MB          │
├──────────────────────────┼──────────────────────────────────┤
│ Kullanım İstatistikleri  │ Aksiyonlar                       │
│ Kullanıcı: 45/50         │ [Tier 1'e Düşür ⬇️]             │
│ Ürün: 1,234              │ [Backup Al 💾]                   │
│ Üretim Emri: 567         │ [Backup Restore 🔄]             │
│ Fatura: 890              │ [Veriyi Sil 🗑️]                 │
│ Son Aktivite: 2 dk önce  │ [Deaktif Et ⛔]                 │
│ Aylık Request: 45,230    │ [On-Premise Paketi 📦]          │
└──────────────────────────┴──────────────────────────────────┘
```
