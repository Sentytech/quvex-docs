# [C1-10] Rate Limiting + CORS Duzeltme

## Durum: DONE
## Oncelik: ORTA
## Faz: 1
## Tarih: 2026-03-07

## Aciklama
API'yi brute-force saldirilara karsi korumak icin rate limiting eklendi.
CORS policy sadece bilinen origin'lere kisitlandi.

## Yapilan Isler
- [x] .NET 8 built-in Rate Limiting middleware eklendi
- [x] Login endpoint icin ozel rate limit (10 istek/dakika)
- [x] Genel API icin rate limit (100 istek/dakika)
- [x] CORS policy: env variable'dan origin okunuyor (CORS_ORIGIN)
- [x] Wildcard CORS (*) kaldirildi
- [x] Duplicate UseCors cagirilari temizlendi (tek policy)
- [x] Program.cs'deki commented-out code temizlendi
- [x] 429 Too Many Requests JSON response
- [x] 8 adet xUnit testi yazildi

## Teknik Detaylar
### Ne Yapildi
1. Rate Limiting:
   - "general" policy: 100 istek/dakika tum endpoint'ler icin
   - "login" policy: 10 istek/dakika sadece authenticate endpoint'i icin
   - 429 durumunda JSON error response
2. CORS:
   - WithOrigins("*") -> CORS_ORIGIN env variable'dan okuma
   - Virgul ile ayrilmis birden fazla origin destegi
   - AllowCredentials() eklendi
   - Duplicate UseCors(x => ...) inline policy kaldirildi
3. Program.cs temizligi:
   - Commented-out Identity ve Service kodu kaldirildi
   - Duplicate AddCors/UseCors/AddMvc cagirilari birlestirildi

### Degisen Dosyalar
| Dosya | Degisiklik |
|-------|-----------|
| Program.cs | Rate limiting, CORS fix, commented code temizligi |
| Controllers/AccountController.cs | [EnableRateLimiting("login")] attribute |
| Tests/Configuration/RateLimitingAndCorsTests.cs | 8 yeni test |

### Etki Analizi
- Login brute-force saldirilarina karsi koruma
- CORS: sadece CORS_ORIGIN'de belirtilen origin'ler kabul edilir
- Frontend: CORS_ORIGIN dogru ayarlanmis olmali (default: http://localhost:3000)
- Production: CORS_ORIGIN env variable set edilmeli

## Test Sonuclari
62/62 test PASSED
- RateLimitingAndCorsTests: 8 test

## Commit Bilgisi
[FAZ1][C1-10] Rate Limiting + CORS - brute-force koruma ve origin kisitlama
