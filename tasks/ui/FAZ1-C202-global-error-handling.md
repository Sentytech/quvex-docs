# [C2-02] Global Error Handling (Toast + ErrorBoundary)

## Durum: DONE
## Oncelik: YUKSEK
## Faz: 1
## Tarih: 2026-03-07

## Aciklama
Frontend'de tutarli hata yonetimi. API hatalarinda kullaniciya anlamli toast mesajlari,
React hatalari icin ErrorBoundary component'i.

## Yapilan Isler
- [x] ErrorBoundary component olusturuldu (React crash durumu icin)
- [x] API error handler modulu (errorHandler.js)
- [x] Axios interceptor ile merkezi hata yakalama
- [x] Hata tiplerine gore toast mesajlari (400, 403, 404, 429, 500)
- [x] Network hatasi icin ozel mesaj
- [x] 401 hatalari jwtService'e birakildi (cakisma yok)
- [x] Backend ErrorResponse DTO ile uyumlu parse etme
- [x] App.js'e ErrorBoundary eklendi
- [x] 11 test (3 ErrorBoundary + 8 errorHandler)

## Teknik Detaylar
### Ne Yapildi
1. ErrorBoundary: React class component, getDerivedStateFromError ile crash yakalama
2. errorHandler.js: Status code bazli hata mesajlari, validation error parsing
3. api.js'e interceptor eklendi - tum API hatalari otomatik toast gosterir
4. 401 hatalari skip edilir (jwtService zaten handle ediyor)

### Degisen Dosyalar
| Dosya | Degisiklik |
|-------|-----------|
| src/components/ErrorBoundary.jsx | Yeni - React error boundary |
| src/services/errorHandler.js | Yeni - API hata handler |
| src/services/api.js | Error interceptor eklendi |
| src/App.js | ErrorBoundary wrapping |
| src/components/__tests__/ErrorBoundary.test.jsx | 3 test |
| src/services/__tests__/errorHandler.test.js | 8 test |

### Etki Analizi
- Tum API hatalari artik otomatik toast ile gosteriliyor
- React crash'lerinde kullanici dostu fallback UI
- jwtService 401 handling ile cakisma yok
- Component'lerdeki bos catch bloklari artik gereksiz (interceptor yakaliyor)

## Test Sonuclari
79/79 test PASSED (68 mevcut + 11 yeni)

## Commit Bilgisi
[FAZ1][C2-02] Global Error Handling - ErrorBoundary ve merkezi API hata yonetimi
