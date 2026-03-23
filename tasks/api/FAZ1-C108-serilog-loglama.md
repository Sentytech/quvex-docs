# [C1-08] Serilog Loglama Altyapisi

## Durum: DONE
## Oncelik: YUKSEK
## Faz: 1
## Tarih: 2026-03-07

## Aciklama
Yapilandirilmis loglama icin Serilog entegrasyonu.

## Yapilan Isler
- [x] Serilog.AspNetCore NuGet paketi eklendi
- [x] Program.cs'de Serilog konfigurasyonu (Console + File sink)
- [x] HTTP request logging middleware (UseSerilogRequestLogging)
- [x] EF Core verbose log suppression (Warning seviyesine)
- [x] Rolling daily log dosyalari (Logs/ klasoru, 30 gun retention)
- [x] .gitignore'a Logs/ eklendi
- [x] 6 adet xUnit testi yazildi

## Teknik Detaylar
### Ne Yapildi
1. Serilog.AspNetCore 8.0.0 paketi eklendi
2. Log.Logger konfigurasyonu:
   - MinimumLevel: Information, Microsoft: Warning, EF Core: Warning
   - Console sink: ozel format [HH:mm:ss LVL] Message
   - File sink: Logs/log-{date}.txt, daily rolling, 30 gun retention
   - Enrich.FromLogContext (correlated logging)
3. builder.Host.UseSerilog() - ASP.NET Core logging yerine Serilog
4. app.UseSerilogRequestLogging() - HTTP istek/yanit loglama

### Degisen Dosyalar
| Dosya | Degisiklik |
|-------|-----------|
| Program.cs | Serilog konfigurasyonu ve middleware |
| Quvex.API.csproj | Serilog.AspNetCore paketi |
| .gitignore | Logs/ klasoru |
| Tests/Configuration/SerilogTests.cs | 6 yeni test |

### Etki Analizi
- Tum loglar artik Serilog uzerinden yapilandirilmis sekilde yazilacak
- Console + File cikis (ileride ELK/Seq eklenebilir)
- Log dosyalari Logs/ klasorunde (30 gun sonra otomatik silinir)
- EF Core verbose loglari bastirildi (performans)

## Test Sonuclari
83/83 test PASSED

## Commit Bilgisi
[FAZ1][C1-08] Serilog loglama - yapilandirilmis loglama altyapisi
