# [C2-07] 401 Error Handling Duzeltme (jwtService)

## Durum: DONE
## Oncelik: YUKSEK
## Faz: 1
## Tarih: 2026-03-07

## Aciklama
jwtService.js'deki 401 hata yonetimini duzeltmek. Mevcut durumda sayfa
yonlendirmesi toast mesajindan once calisiyor, kullanici mesaji goremiyor.

## Yapilan Isler
- [x] 401 error handler'da once toast goster, sonra yonlendir (setTimeout ile 1.5sn)
- [x] Token refresh basarisiz olursa localStorage temizle + toast + /login'e redirect
- [x] Commented-out code bloklari temizlendi (25 satir)
- [x] this.axios(originalRequest) -> axios(originalRequest) bug fix
- [x] /misc/not-authorized -> /login redirect duzeltmesi
- [x] 6 adet Vitest testi yazildi

## Teknik Detaylar
### Ne Yapildi
1. refreshToken().then() zincirine .catch() eklendi - token yenileme basarisizsa:
   - localStorage'dan token, refreshToken, userData temizlenir
   - toast.error ile kullaniciya "Oturum suresi doldu" mesaji gosterilir
   - 1.5 saniye sonra /login'e yonlendirilir
2. Anlamsiz /misc/not-authorized redirect kaldirildi, /login kullanildi
3. this.axios (undefined) yerine import edilen axios kullanildi
4. 25 satirlik commented-out kod blogu temizlendi

### Nasil Yapildi
jwtService.js response interceptor tamamen yeniden yazildi.
Onceki akis: redirect -> toast (kullanici mesaji goremiyordu)
Yeni akis: toast -> setTimeout(1500ms) -> redirect

### Degisen Dosyalar
| Dosya | Degisiklik |
|-------|-----------|
| src/@core/auth/jwt/jwtService.js | 401 handler yeniden yazildi, commented code temizlendi |
| src/@core/auth/jwt/__tests__/jwtService.test.js | 6 yeni test |

### Etki Analizi
- Kullanicilar artik "Oturum suresi doldu" mesajini gorecek
- Token refresh basarisizliginda guvenli logout yapilacak
- /misc/not-authorized yerine /login'e yonlendirme
- this.axios bug'i duzeltildi (undefined method cagrisi)

## Test Sonuclari
47/47 UI test PASSED
- jwtService.test.js: 6 test (catch handler, localStorage cleanup, toast-before-redirect, login redirect, no commented code, axios fix)

## Commit Bilgisi
[FAZ1][C2-07] 401 error handling fix - token yenileme hatasi ve redirect duzeltmesi
