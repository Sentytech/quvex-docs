# Quvex — 20 Tenant Hedefi Uygulama Planı

## Tarih: 2026-03-25
## Hedef: 20 aktif tenant, ~200 kullanıcı
## Altyapı: Mevcut VDS + Docker (Kubernetes henüz gerek yok)

---

## MEVCUT vs HEDEF

| Konu | Şu An | 20 Tenant Hedefi |
|------|-------|-----------------|
| Tenant sayısı | 2 | 20 |
| Kullanıcı | ~5 | ~200 |
| DB | Tek PostgreSQL | Tek PostgreSQL + Redis cache |
| Schema | 2 schema | 20 schema |
| Deployment | Docker Compose | Docker Compose (aynı) |
| Cache | Yok (in-memory) | Redis aktif |
| Connection pool | Npgsql internal (100) | Npgsql internal (200) yeterli |

## NEDEN KUBERNETES HENÜZ GEREK YOK

20 tenant / 200 kullanıcı için:
- Tek VDS (8 core, 16GB RAM) yeterli
- Docker Compose ile API + Worker + PostgreSQL + Redis
- PgBouncer bile gereksiz (200 bağlantı Npgsql yönetir)
- Maliyet: ~30-50 EUR/ay (vs Kubernetes ~200+ EUR/ay)

---

## YAPILACAKLAR (Öncelik Sırasına Göre)

### 1. Redis Aktifleştirme (1-2 saat)
**Durum:** Kod hazır, sadece deploy ve env var gerekli

```yaml
# docker-compose.yml'e ekle
redis:
  image: redis:7-alpine
  command: redis-server --requirepass ${REDIS_PASSWORD}
  ports:
    - "6379:6379"
  volumes:
    - redis_data:/data
  restart: always
```

```env
REDIS_CONNECTION=localhost:6379,password=QuvexRedis2026!
```

**Etki:**
- Distributed cache aktif (tenant config, user session, rate limiting)
- Hangfire Redis backend (opsiyonel, PostgreSQL de çalışır)
- SignalR backplane (multi-instance hazırlık)

### 2. Tenant Onboarding Akışı İyileştirme (2-3 gün)
**Mevcut:** Manuel schema oluşturma
**Hedef:** Self-service tenant registration

Yapılacaklar:
- [ ] Tenant registration sayfası (UI)
- [ ] Otomatik schema oluşturma + seed data
- [ ] Admin onay mekanizması (otomatik veya manuel)
- [ ] Welcome email + ilk kullanıcı oluşturma
- [ ] Tenant-specific subdomain: firma.quvex.sentytech.cloud

### 3. Tenant Entity Genişletme (1 gün)
**Migration gerekli**

```csharp
public class Tenant
{
    // Mevcut alanlar
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Subdomain { get; set; }
    public SubscriptionPlan Plan { get; set; }
    public int MaxUsers { get; set; }
    public bool IsActive { get; set; }
    public string SchemaName { get; set; }
    public DateTime CreatedAt { get; set; }

    // YENİ ALANLAR (20 tenant hedefi)
    public TenantTier Tier { get; set; } = TenantTier.Shared;  // Gelecek için
    public string? ContactEmail { get; set; }
    public string? ContactPhone { get; set; }
    public string? CompanyTitle { get; set; }   // Ticari ünvan
    public string? TaxNumber { get; set; }      // Vergi no
    public string? TaxOffice { get; set; }      // Vergi dairesi
    public string? City { get; set; }
    public string? LogoUrl { get; set; }
    public DateTime? TrialEndsAt { get; set; }  // Deneme süresi
    public DateTime? SubscriptionEndsAt { get; set; }
    public int StorageLimitMB { get; set; } = 1024;  // 1GB default
    public int CurrentStorageMB { get; set; } = 0;
    public string? CustomDomain { get; set; }
    public bool AllowApiAccess { get; set; } = false;
}

public enum TenantTier
{
    Shared = 0,       // Schema-per-tenant (default)
    DedicatedDb = 1,  // Kendi DB'si (gelecek)
    DedicatedServer = 2  // Kendi sunucusu (gelecek)
}
```

### 4. Tenant Admin Dashboard İyileştirme (2-3 gün)
**Mevcut:** Basit tenant listesi
**Hedef:** Tam yönetim paneli

- [ ] Tenant oluşturma formu (tüm yeni alanlar)
- [ ] Tenant deaktif/aktif toggle
- [ ] Tenant bazlı kullanıcı listesi
- [ ] Tenant bazlı storage kullanımı
- [ ] Tenant bazlı son aktivite
- [ ] Subscription/trial yönetimi
- [ ] Toplu email gönderme (duyuru)

### 5. Tenant Bazlı Rate Limiting Düzeltme (1 gün)
**Mevcut:** In-process ConcurrentDictionary (tek pod için çalışır)
**Hedef:** Redis-backed (gelecekte multi-pod hazır)

```csharp
// Redis ile sliding window rate limiting
var key = $"quvex:rl:{tenantId}:{window}";
var count = await redis.StringIncrementAsync(key);
if (count == 1) await redis.KeyExpireAsync(key, TimeSpan.FromMinutes(2));
if (count > limit) return 429;
```

### 6. Schema Sync Optimizasyonu (yarım gün)
**Mevcut:** Startup'ta sıralı tüm schema'ları sync eder
**Sorun:** 20 schema ile startup 20-30 saniye sürebilir
**Çözüm:** Hangfire job'a taşı, async

```csharp
// Program.cs'ten kaldır:
// tenantService.SyncAllTenantSchemasAsync()

// Hangfire job olarak:
RecurringJob.AddOrUpdate<TenantSchemaService>(
    "sync-schemas", x => x.SyncAllTenantSchemasAsync(),
    "0 */6 * * *"); // Her 6 saatte
```

### 7. JWT Tenant Claim (yarım gün)
**Mevcut:** Her request'te RefreshToken → User → TenantId lookup
**Hedef:** JWT'de tenant_id claim → sıfır DB hit

```csharp
// AccountController.Authenticate'te JWT'ye ekle:
claims.Add(new Claim("tenant_id", user.TenantId.ToString()));
claims.Add(new Claim("tenant_schema", tenant.SchemaName));

// TenantResolutionMiddleware'de önce JWT kontrol:
var tenantClaim = context.User?.FindFirst("tenant_id");
if (tenantClaim != null) { /* DB lookup yok */ }
```

### 8. Backup Stratejisi (1 gün)
**20 tenant için basit backup:**

```bash
#!/bin/bash
# Günlük backup script
DATE=$(date +%Y%m%d)
SCHEMAS=$(psql -U postgres -d quvex_dev -t -c "SELECT schema_name FROM information_schema.schemata WHERE schema_name LIKE 'tenant_%'")

for SCHEMA in $SCHEMAS; do
    pg_dump -U postgres -d quvex_dev -n $SCHEMA > /backups/${SCHEMA}_${DATE}.sql
done

# Public schema
pg_dump -U postgres -d quvex_dev -n public > /backups/public_${DATE}.sql

# 30 günden eski backupları sil
find /backups -name "*.sql" -mtime +30 -delete
```

Docker volume'a mount edip cron ile günlük çalıştır.

---

## DOCKER COMPOSE GÜNCELLEMESİ (20 tenant)

```yaml
version: '3.8'
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: quvex_dev
    ports:
      - "5433:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
    restart: always
    deploy:
      resources:
        limits:
          memory: 4G
          cpus: '4'

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass ${REDIS_PASSWORD} --maxmemory 512mb --maxmemory-policy allkeys-lru
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: always

  api:
    build:
      context: ../smallFactoryApi
      dockerfile: Dockerfile
    environment:
      - ASPNETCORE_ENVIRONMENT=Production
      - DB_CONNECTION_STRING=Host=db;Port=5432;Database=quvex_dev;Username=postgres;Password=${DB_PASSWORD};Maximum Pool Size=200;Minimum Pool Size=10
      - REDIS_CONNECTION=redis:6379,password=${REDIS_PASSWORD}
      - JWT_SECRET_KEY=${JWT_KEY}
      - CORS_ORIGIN=https://quvex.sentytech.cloud,https://*.quvex.sentytech.cloud
    ports:
      - "5052:5052"
    depends_on:
      - db
      - redis
    restart: always
    deploy:
      resources:
        limits:
          memory: 2G
          cpus: '2'

  ui:
    build:
      context: ../smallFactoryUI
      dockerfile: Dockerfile
    ports:
      - "80:80"
    depends_on:
      - api
    restart: always

  backup:
    image: postgres:16-alpine
    volumes:
      - ./backup.sh:/backup.sh
      - backups:/backups
    entrypoint: ["crond", "-f"]
    depends_on:
      - db

volumes:
  pgdata:
  redis_data:
  backups:
```

---

## ZAMAN ÇİZELGESİ

| Hafta | İş | Efor |
|-------|---|------|
| 1 | Redis aktif + JWT tenant claim + Rate limit Redis | 2 gün |
| 1-2 | Tenant entity genişletme + migration | 1 gün |
| 2 | Schema sync optimizasyonu | 0.5 gün |
| 2-3 | Tenant onboarding akışı (API + UI) | 3 gün |
| 3 | Tenant admin dashboard iyileştirme | 2 gün |
| 4 | Backup stratejisi + test | 1 gün |
| 4 | 20 tenant ile load test + fine-tuning | 1 gün |
| **Toplam** | | **~10 gün** |

---

## 20 TENANT SONRASI BÜYÜME YOLU

```
20 tenant (şimdi)
    ↓ Docker Compose, tek VDS yeterli
50 tenant
    ↓ PgBouncer ekle, ikinci VDS (read replica)
200 tenant
    ↓ Kubernetes'e geç (Faz 2)
500 tenant
    ↓ Tier 2 tenant desteği (dedicated DB)
1500 tenant
    ↓ Full architecture (Faz 3-4)
```
