# [C1-12] SensitiveDataLogging Kapatma

## Durum: DONE
## Oncelik: KRITIK
## Faz: 1
## Tarih: 2026-03-07

## Aciklama
IndustryDBContext.cs'deki EnableSensitiveDataLogging() cagrisini kaldirmak.
Bu ayar acikken EF Core sorgu parametrelerini (sifreler, kisisel bilgiler) loglara yaziyor.

## Yapilan Isler
- [x] IndustryDBContext.OnConfiguring'den EnableSensitiveDataLogging kaldirildi
- [x] Test yazildi: DbContext'in SensitiveDataLogging'i aktif etmedigini dogruluyor

## Teknik Detaylar
### Ne Yapildi
EnableSensitiveDataLogging() cagrisi OnConfiguring metodundan kaldirildi.
Bu sayede EF Core artik sorgu parametrelerini (sifreler, kisisel veriler vb.) loglara yazmayacak.

### Nasil Yapildi
IndustryDBContext.cs satir 216'daki `.EnableSensitiveDataLogging()` cagrisi silindi.
xUnit testi ile CoreOptionsExtension uzerinden IsSensitiveDataLoggingEnabled = false dogrulandi.

### Degisen Dosyalar
| Dosya | Degisiklik |
|-------|-----------|
| IndustryDBContext.cs | EnableSensitiveDataLogging() cagrisi kaldirildi |
| Tests/Configuration/SensitiveDataLoggingTests.cs | 1 yeni test |

### Etki Analizi
- Log ciktisinda artik parametre degerleri gorulmeyecek (guvenlik iyilestirmesi)
- Debug sirasinda parametre degerleri gorulmeyecek (development'ta ihtiyac olursa breakpoint ile izlenebilir)
- Performans: minimal pozitif etki (loglama overhead azalir)

## Test Sonuclari
31/31 test PASSED
- SensitiveDataLoggingTests: 1 test (DbContext_ShouldNotEnableSensitiveDataLogging)

## Commit Bilgisi
[FAZ1][C1-12] SensitiveDataLogging kapatma - hassas veri loglamasi engellendi
