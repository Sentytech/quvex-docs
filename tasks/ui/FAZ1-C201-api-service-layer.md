# [C2-01] API Service Layer Olusturma

## Durum: DONE
## Oncelik: YUKSEK
## Faz: 1
## Tarih: 2026-03-07

## Aciklama
Her component'te tekrarlanan axios cagrilarini merkezi bir API service katmaninda
toplamak. src/services/ altinda modul bazli service dosyalari olusturuldu.

## Yapilan Isler
- [x] src/services/api.js - Axios wrapper (base URL otomatik, get/post/put/delete)
- [x] src/services/productService.js - Urun API cagrilari
- [x] src/services/customerService.js - Musteri API cagrilari
- [x] src/services/offerService.js - Teklif API cagrilari
- [x] src/services/authService.js - Auth API cagrilari (login, register, forgot/reset password)
- [x] src/services/index.js - Barrel export
- [x] Refactor: Product.js'de service kullanimi
- [x] Refactor: Customer.js'de service kullanimi
- [x] Test: 15 test (api, productService, customerService, authService)

## Teknik Detaylar
### Ne Yapildi
1. api.js: Global axios instance uzerinden wrapper - JWT interceptor'lar otomatik calisir
2. 4 adet modul servisi: auth, product, customer, offer
3. Product.js ve Customer.js refactor edildi - artik service katmanini kullaniyor
4. Diger component'ler kademeli olarak service katmanina tasinabilir

### Nasil Yapildi
- api.js global axios'u kullaniyor (jwtService.js interceptor'lari otomatik uygulanir)
- Her servis fonksiyonu dogru endpoint'e cagri yapiyor
- Base URL process.env.REACT_APP_API_ENDPOINT'ten alinir

### Degisen Dosyalar
| Dosya | Degisiklik |
|-------|-----------|
| src/services/api.js | Yeni - merkezi API wrapper |
| src/services/authService.js | Yeni - auth cagrilari |
| src/services/productService.js | Yeni - urun cagrilari |
| src/services/customerService.js | Yeni - musteri cagrilari |
| src/services/offerService.js | Yeni - teklif cagrilari |
| src/services/index.js | Yeni - barrel export |
| src/views/modul/product/Product.js | Refactor - service kullanimi |
| src/views/modul/customer/Customer.js | Refactor - service kullanimi |
| src/services/__tests__/api.test.js | 15 yeni test |

### Etki Analizi
- Mevcut API davranisi AYNI - sadece kod organizasyonu degisti
- Product.js ve Customer.js artik process.env dogrudan kullanmiyor
- Diger component'ler kademeli olarak refactor edilebilir
- JWT interceptor'lar aynen calismaya devam ediyor

## Test Sonuclari
68/68 test PASSED (53 mevcut + 15 yeni)

## Commit Bilgisi
[FAZ1][C2-01] API Service Layer - merkezi API cagri katmani ve servis modulleri
