# [C1-11] Health Check Endpoint

## Durum: DONE
## Oncelik: ORTA
## Faz: 1
## Tarih: 2026-03-07

## Aciklama
Sistem saglik kontrolu icin /health endpoint'i eklendi. PostgreSQL baglanti kontrolu
iceriyor. Docker/Kubernetes health probe olarak kullanilabilir.

## Yapilan Isler
- [x] ASP.NET Core Health Checks middleware eklendi
- [x] PostgreSQL health check (AspNetCore.HealthChecks.NpgSql)
- [x] GET /health endpoint
- [x] Dockerfile'a HEALTHCHECK directive eklendi
- [x] 4 adet xUnit testi yazildi

## Teknik Detaylar
### Ne Yapildi
1. NuGet: AspNetCore.HealthChecks.NpgSql 8.0.0 eklendi
2. Program.cs: AddHealthChecks().AddNpgSql() + MapHealthChecks("/health")
3. Dockerfile: HEALTHCHECK --interval=30s --timeout=10s --retries=3

### Degisen Dosyalar
| Dosya | Degisiklik |
|-------|-----------|
| Program.cs | Health check registration ve endpoint mapping |
| Quvex.API.csproj | AspNetCore.HealthChecks.NpgSql paketi |
| Dockerfile | HEALTHCHECK directive |
| Tests/Configuration/HealthCheckTests.cs | 4 yeni test |

### Etki Analizi
- /health endpoint herkese acik (auth gerektirmez)
- Docker: container saglik durumu otomatik kontrol edilecek
- Kubernetes: readiness/liveness probe olarak kullanilabilir
- Monitoring araclari bu endpoint'i sorgulayabilir

## Test Sonuclari
66/66 test PASSED

## Commit Bilgisi
[FAZ1][C1-11] Health Check - /health endpoint ve PostgreSQL saglik kontrolu
