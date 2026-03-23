# [C1-07] Sifre Sifirlama Endpoint

## Durum: DONE
## Oncelik: YUKSEK
## Faz: 1
## Tarih: 2026-03-07

## Aciklama
ForgotPassword ve ResetPassword DTO'lari mevcut ama endpoint implementasyonu yok.
Email tabanli sifre sifirlama akisini tamamlamak.

## Yapilan Isler
- [x] POST /api/Account/forgot-password endpoint (email gonderim - simdilik loglama)
- [x] POST /api/Account/reset-password endpoint (token + yeni sifre)
- [x] Password reset token uretimi (Identity framework)
- [x] Token dogrulama ve sifre guncelleme
- [x] Email gonderim servisi interface (IEmailService - ilk asama mock)
- [x] ForgotPasswordRequestValidator (FluentValidation)
- [x] ResetPasswordRequestValidator (FluentValidation)
- [x] Test: gecerli token ile sifre degismeli
- [x] Test: gecersiz/suresi dolmus token reddedilmeli
- [x] Test: zayif sifre reddedilmeli (validator)
- [x] Test: sifreler eslesmemeli (validator)
- [x] Test: guvenlik - bilinmeyen email ayni mesaj donmeli

## Teknik Detaylar
### Ne Yapildi
1. IEmailService interface olusturuldu - email gonderim soyutlamasi
2. LogEmailService - gelistirme ortami icin loglayan mock implementasyon
3. ForgotPassword endpoint - Identity GeneratePasswordResetTokenAsync ile token uretimi
4. ResetPassword endpoint - Identity ResetPasswordAsync ile sifre guncelleme
5. FluentValidation validator'lari eklendi (ForgotPassword, ResetPassword)
6. 13 yeni test yazildi (5 validator + 5 endpoint + 3 ForgotPassword validator)

### Guvenlik Kararlari
- forgot-password: Kullaniciya email'in kayitli olup olmadigini soylemiyor (email enumeration korunmasi)
- forgot-password: Rate limiting uygulanmis (login policy - 10/dakika)
- reset-password: Gecersiz token veya email icin uygun hata mesajlari

### Degisen Dosyalar
| Dosya | Degisiklik |
|-------|-----------|
| Controllers/AccountController.cs | forgot-password ve reset-password endpoint'leri |
| Program.cs | IEmailService DI registration |
| Interfaces/IEmailService.cs | Yeni - email servis interface |
| Services/LogEmailService.cs | Yeni - mock email servisi |
| Validators/ForgotPasswordRequestValidator.cs | Yeni |
| Validators/ResetPasswordRequestValidator.cs | Yeni |
| Tests/Auth/PasswordResetTests.cs | 13 yeni test |

### Etki Analizi
- AccountController'a 2 yeni endpoint eklendi (forgot-password, reset-password)
- IEmailService interface - sonraki fazda gercek SMTP ile degistirilecek
- Mevcut islevsellik etkilenmiyor
- Frontend'de sifre sifirlama sayfasi gerekecek (UI task)

## Test Sonuclari
105/105 test PASSED (92 mevcut + 13 yeni)

## Commit Bilgisi
[FAZ1][C1-07] Sifre sifirlama - forgot/reset password endpoint'leri ve email servisi
