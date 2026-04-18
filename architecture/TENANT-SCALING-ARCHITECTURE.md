# Quvex Enterprise Multi-Tenant Architecture v1.0

## Tarih: 2026-03-25
## Durum: PLANLANMIŞ — Faz 1'den başlanacak

---

## HEDEF ÖLÇEK (Nihai)
- 1500 tenant, 20.000 eşzamanlı kullanıcı
- <200ms yanıt süresi
- Kubernetes multi-node deployment
- Sıfır downtime

## MEVCUT DURUM
- Schema-per-tenant (2 tenant: rynsoft, demo)
- Tek PostgreSQL instance (Docker)
- Redis opsiyonel (henüz aktif değil)
- Tek sunucu VDS deployment

---

## 3 KADEMELİ TENANT MİMARİSİ

```
                    ┌─── METADATA DB (Tenant routing, billing) ───┐
                    │                                              │
        ┌───────────┼──────────────┬───────────────────┐          │
        ▼           ▼              ▼                   ▼          │
   ┌─────────┐ ┌─────────┐ ┌──────────┐ ┌──────────────┐        │
   │ TIER 1  │ │ TIER 1  │ │ TIER 2   │ │ TIER 3       │        │
   │ Schema  │ │ Schema  │ │ Own DB   │ │ Own Server   │        │
   │ tenant_a│ │ tenant_b│ │ firma_x  │ │ (on-premise) │        │
   │         │ │         │ │          │ │              │        │
   │ Shared  │ │ Shared  │ │ Dedicated│ │ Full         │        │
   │ DB+Pool │ │ DB+Pool │ │ DB+Pool  │ │ Isolation    │        │
   └─────────┘ └─────────┘ └──────────┘ └──────────────┘        │
        ▲                       ▲              ▲                  │
        └── Max 500/DB ─────────┘              │                  │
                                    Hot Migration ◄───────────────┘
```

## 4 FAZLI UYGULAMA PLANI

| Faz | Süre | İçerik | Risk |
|-----|------|--------|------|
| **1** | Hafta 1-4 | Redis aktif, PgBouncer, JWT tenant claim, Tenant entity genişletme | Düşük |
| **2** | Hafta 5-8 | Kubernetes deployment, Helm chart, HPA, migration job | Orta |
| **3** | Hafta 9-14 | Read replica, tenant tiering (Tier 2), distributed rate limit | Orta-Yüksek |
| **4** | Hafta 15-20 | OpenTelemetry, RabbitMQ, Grafana, GDPR, on-premise | Düşük-Orta |

## ALTYAPI BOYUTLANDIRMA (1500 tenant, 20K user)

| Bileşen | Adet | CPU | RAM | Storage |
|---------|------|-----|-----|---------|
| API Pod | 8-20 | 2 core | 2 Gi | - |
| Worker Pod | 3-5 | 2 core | 4 Gi | - |
| PostgreSQL Primary | 1 | 8 core | 32 Gi | 1 Ti SSD |
| PostgreSQL Replica | 2 | 4 core | 16 Gi | 1 Ti SSD |
| Redis Master | 1 | 2 core | 8 Gi | 10 Gi |
| Redis Replica | 2 | 1 core | 8 Gi | 10 Gi |
| PgBouncer | 2 | 0.5 core | 512 Mi | - |
| RabbitMQ | 3 | 1 core | 2 Gi | 20 Gi |
| Monitoring | 3 | 4.5 core | 13 Gi | 310 Gi |

**Toplam:** 6 node, 64 core, 192 GB RAM, 3 TB storage
**Tahmini maliyet:** ~536 EUR/ay

## TEKNOLOJİ SEÇİMLERİ

| Konu | Seçim | Neden |
|------|-------|-------|
| Connection Pool | PgBouncer (transaction mode) | Schema search_path ile uyumlu |
| DB HA | Patroni/CloudNativePG | Otomatik failover <30sn |
| Cache | Redis Sentinel | 20K user için yeterli |
| Queue | RabbitMQ | Priority queue, dead letter |
| Observability | OpenTelemetry + Prometheus + Grafana | Tenant bazlı metrikler |
| Resilience | Polly circuit breaker | .NET native |
| Orchestration | Kubernetes (K3s veya managed) | HPA, rolling updates |
| Ingress | Nginx Ingress Controller | Wildcard TLS, sticky sessions |

## KRİTİK DOSYALAR

- `TenantResolutionMiddleware.cs` — Tenant routing
- `Tenant.cs` — Entity genişletilecek (Tier, DatabaseHost, MaxConnections)
- `Program.cs` — Dynamic DbContext factory
- `QuvexDBContext.cs` — Dynamic connection string
- `TenantRateLimitMiddleware.cs` — Redis-backed distributed rate limiting

## RİSK ANALİZİ

| Risk | Olasılık | Etki | Çözüm |
|------|----------|------|-------|
| EF Core model caching + dynamic conn | Yüksek | Yüksek | IDbContextFactory kullan |
| search_path + PgBouncer uyumu | Orta | Kritik | Transaction mode (doğrulandı) |
| Tenant schema sync startup block | Yüksek | Orta | Hangfire job'a taşı |
| Cross-tenant data leak | Düşük | Kritik | Otomatik integration test |
| Redis SPOF | Orta | Orta | Sentinel + graceful degradation |
| Connection exhaustion | Orta | Yüksek | PgBouncer + per-tenant limit |

---

## REDIS CACHE STRATEJİSİ

```
L1: IMemoryCache (per pod, 2-5min TTL, 100MB)
L2: Redis (shared, 5-30min TTL)

Key yapısı:
  quvex:t:{id}:config          → Tenant config (5min)
  quvex:s:{userId}             → User session (60min)
  quvex:t:{id}:perm:{uid}     → Permissions (10min)
  quvex:rl:{id}:{window}      → Rate limit counter (2min)
  quvex:t:{id}:dashboard      → Dashboard cache (1min)
  quvex:t:{id}:report:{hash}  → Report cache (15min)
```

## GRACEFUL DEGRADATION

| Bileşen Çöktü | Etki | Çözüm |
|----------------|------|-------|
| Redis | Cache miss, yavaş | IMemoryCache fallback |
| Read Replica | Raporlar yavaş | Primary'ye yönlendir |
| RabbitMQ | Job'lar gecikir | Hangfire devam eder |
| PgBouncer | İstek kabul edilemez | Direct connection fallback |
| Email | Bildirimler gecikir | DB'de kuyrukla, retry |
