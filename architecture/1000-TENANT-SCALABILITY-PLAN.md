# Quvex ERP — 1000 Tenant Olcekleme Plani

> Tarih: 2026-04-12
> Hedef: 1000 eşzamanlı tenant desteği
> Mevcut kapasite: ~200-300 tenant

---

## KRİTİK DARBOĞAZLAR (7 adet)

### 1. PostgreSQL Katalog Limiti [KRİTİK]
```
Mevcut: Schema-per-tenant × 155 tablo = 155,000 tablo (1000 tenant)
PostgreSQL güvenli limit: ~10,000 tablo
Durum: 15x limit aşımı → katalog sorguları yavaşlar
```
**Çözüm:** Faz 3'te hibrit model (RLS + büyük tenant'lar için dedicated schema)

### 2. Connection Pool Yetersizliği [KRİTİK]  
```
Mevcut: PgBouncer MAX_CLIENT_CONN=2000, PostgreSQL max_connections=200
İhtiyaç: 1000 tenant × 5 conn = 5,000 connection
Durum: 25x yetersiz
```
**Çözüm:** 
- PostgreSQL max_connections=4000
- PgBouncer MAX_CLIENT_CONN=4000, MAX_DB_CONNECTIONS=1000
- Per-tenant MaxConnections: 20 → 3 (Basic), 5 (Pro), 10 (Enterprise)

### 3. TenantId Index Eksikliği [KRİTİK]
```
Mevcut: 155 tabloda HasQueryFilter VAR ama TenantId INDEX YOK
1000 tenant × 10,000 satır = 10M satır → full table scan
Performans: 1000ms (scan) vs 10ms (index) = 100x fark
```
**Çözüm:** 155 tabloya TenantId composite index ekle (4 saat iş)

### 4. Schema Sync Süresi [KRİTİK]
```
Mevcut: Sıralı sync, 1000 tenant = 3.2 saat
Hangfire window: 6 saat
Durum: Sınırda, büyüme ile aşılır
```
**Çözüm:** 10 paralel thread ile batch sync → 20-30 dakika

### 5. Tenant Provisioning Süresi [KRİTİK]
```
Mevcut: Senkron HTTP request, ~9 saniye/tenant
1000 tenant sıralı = 2.4 saat
Durum: HTTP timeout, kullanıcı deneyimi bozuk
```
**Çözüm:** Async Hangfire job + "Hesabınız hazırlanıyor" ekranı

### 6. K8s Kaynak Limitleri [KRİTİK]
```
Mevcut: 2 pod × 500m CPU = 1 core, HPA max=10
İhtiyaç: 1000 tenant × 10 req/sec = 10,000 RPS → min 20 core
Durum: 20x yetersiz
```
**Çözüm:** Pod limit 1000m CPU / 1GB RAM, HPA max=50

### 7. Backup Süresi [KRİTİK]
```
Mevcut: pg_dump sıralı, 1000 tenant = 13.9 saat
Durum: Günlük backup window aşılıyor
```
**Çözüm:** WAL archival (PITR) + paralel dump (10 thread)

---

## FAZLI UYGULAMA PLANI

### FAZ 1: Acil (0-2 hafta) — 500 Tenant Kapasitesi

| # | İş | Efor | Etki |
|---|-----|------|------|
| 1 | 155 tabloya TenantId index ekle (migration) | 4 saat | 100x sorgu hızlanma |
| 2 | PostgreSQL max_connections=1000 | 30 dk | 5x connection artışı |
| 3 | PgBouncer MAX_CLIENT_CONN=2000 | 30 dk | Pool genişleme |
| 4 | Per-tenant MaxConnections: 20→5 (Basic), 10 (Pro) | 1 saat | Daha verimli pool |
| 5 | ReportSchedule in-memory → DB (TenantSetting) | 3 saat | Veri kaybı riski sıfır |
| 6 | K8s pod CPU limit 500m→1000m, RAM 512→1024Mi | 15 dk | 2x kapasite |
| 7 | HPA maxReplicas 10→30 | 15 dk | 3x auto-scale |

### FAZ 2: Orta Vade (2-8 hafta) — 1000 Tenant Kapasitesi

| # | İş | Efor | Etki |
|---|-----|------|------|
| 8 | Schema sync paralel batch runner (10 thread) | 5 saat | 3.2h → 20dk |
| 9 | Tenant provisioning async (Hangfire queue) | 5 saat | 9s block → instant |
| 10 | WAL archival backup (PITR) | 8 saat | 14h → continuous |
| 11 | Paralel tenant dump (10 thread) | 3 saat | 14h → 1.5h |
| 12 | Metrics static dictionary TTL (24 saat expire) | 2 saat | Memory leak engelle |
| 13 | Read replica routing for reports | 4 saat | DB yük azaltma %30 |
| 14 | PostgreSQL max_connections=4000 | 1 saat | Full capacity |

### FAZ 3: Uzun Vade (2-3 ay) — Enterprise Scale

| # | İş | Efor | Etki |
|---|-----|------|------|
| 15 | Hibrit tenant izolasyon (RLS + Schema) | 40 saat | Katalog limiti aşılmaz |
| 16 | Mevcut tenant'ları RLS'e migrate | 20 saat | Geriye dönük uyumluluk |
| 17 | Multi-region PostgreSQL replication | 16 saat | Coğrafi yedeklilik |
| 18 | Application-level connection pooling | 8 saat | PgBouncer bağımsızlık |
| 19 | Serverless scaling (KEDA + K8s) | 16 saat | Sınırsız pod ölçekleme |

---

## PERFORMANS HESAPLAMASİ

### Sorgu Gecikme (worst case → optimized)
```
ÖNCE (index yok, 1000 tenant):
  SET search_path:     5ms
  EF Core query:    1000ms (full table scan, 10M satır)
  DB roundtrip:       50ms
  Toplam:           1055ms

SONRA (index var):
  SET search_path:     5ms
  EF Core query:      10ms (index scan)
  DB roundtrip:       10ms
  Toplam:             25ms → 42x iyileşme
```

### Throughput
```
Mevcut:  2 pod × 0.5 core = 1 core → ~500 req/sec
Faz 1:   10 pod × 1 core = 10 core → ~5,000 req/sec
Faz 2:   30 pod × 1 core = 30 core → ~15,000 req/sec
Hedef:   1000 tenant × 10 req/sec = 10,000 req/sec ✓ (Faz 2'de karşılanır)
```

### Bellek
```
Pod başına:
  .NET runtime:     100MB
  EF Core:           50MB
  SignalR:           75MB (2500 conn/pod)
  Cache:             50MB
  Request buffer:   100MB
  Toplam:           375MB → 1024MB limit = %37 kullanım ✓
```

---

## MEVCUT GÜÇLÜ YANLAR

✅ PgBouncer transaction pooling (bağlantı paylaşımı)
✅ Redis cache (tenant metadata, token, rate limit)
✅ HasQueryFilter 155 entity (ORM seviyesi izolasyon)
✅ Hangfire background jobs (async iş yürütme)
✅ K8s HPA auto-scaling (pod ölçekleme)
✅ Read replica desteği (tasarım mevcut)
✅ Per-tenant rate limiting (plan bazlı)
✅ SignalR tenant groups (WebSocket izolasyon)
✅ search_path RESET in finally block (güvenlik)

---

## SONUÇ

| Faz | Süre | Kapasite | Maliyet |
|-----|------|----------|---------|
| Mevcut | - | ~200-300 tenant | Mevcut infra |
| Faz 1 | 2 hafta | 500 tenant | +%50 infra |
| Faz 2 | 8 hafta | 1,000 tenant | +%200 infra |
| Faz 3 | 3 ay | 5,000+ tenant | +%500 infra |

**En kritik ve en hızlı kazanım: TenantId index ekleme (4 saat iş, 100x hızlanma)**
