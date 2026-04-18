# Refresh Token Guvenlik Yukseltmesi

## Mevcut Durum

- Refresh token JSON response body'de dondurulur (`AuthenticationResponse.RefreshToken`)
- Frontend `sessionStorage`'da saklar
- XSS riski: Token JavaScript ile erisilebilir
- Refresh token opaque random string (guvenli uretim)

### Ilgili Dosyalar
- `src/Quvex.API/Auth/AuthenticationResponse.cs` — RefreshToken alani
- `src/Quvex.API/Controllers/AccountController.cs` — Login/refresh endpoint'leri
- UI: `sessionStorage` token yonetimi + axios interceptor

## Hedef Durum

- Refresh token `httpOnly + Secure + SameSite=Strict` cookie'de
- JWT access token kisa omurlu (15dk), yalnizca memory'de tutulur
- Refresh endpoint cookie'den okur, yeni JWT doner
- XSS saldirisi ile refresh token calma imkani ortadan kalkar

## Implementasyon Plani

### Faz 1: API Degisiklikleri

1. **Login endpoint** (`POST /Account/authenticate`):
   - Response body'den `RefreshToken` alanini kaldir
   - `Set-Cookie` header ile httpOnly cookie olarak gonder:
     ```
     Set-Cookie: quvex_rt={token}; HttpOnly; Secure; SameSite=Strict; Path=/Account; Max-Age=604800
     ```
   - Response body'de sadece `JWToken` (access token) donsun

2. **Refresh endpoint** (`POST /Account/refresh`):
   - Request body'den refresh token okuma kaldirilir
   - `HttpContext.Request.Cookies["quvex_rt"]` ile cookie'den oku
   - Yeni JWT + yeni refresh token (cookie olarak) donsun

3. **Logout endpoint** (`POST /Account/logout`):
   - Cookie'yi sil: `Set-Cookie: quvex_rt=; Max-Age=0; Path=/Account`
   - Veritabanindaki refresh token'i gecersiz kilinir

4. **Cookie ayarlari**:
   ```csharp
   var cookieOptions = new CookieOptions
   {
       HttpOnly = true,
       Secure = true, // HTTPS zorunlu
       SameSite = SameSiteMode.Strict,
       Path = "/Account",
       MaxAge = TimeSpan.FromDays(7),
       IsEssential = true
   };
   Response.Cookies.Append("quvex_rt", refreshToken, cookieOptions);
   ```

### Faz 2: UI Degisiklikleri

1. `sessionStorage`'dan `refreshToken` saklamayi kaldir
2. JWT'yi sadece memory'de tut (closure/React context, NOT storage)
3. Axios interceptor guncelle:
   - 401 alininca `/Account/refresh` cagir (`withCredentials: true` — cookie otomatik gider)
   - Basarili ise yeni JWT'yi memory'de guncelle
   - Basarisiz ise login sayfasina yonlendir
4. Sayfa yenilemede: `/Account/refresh` ile yeni JWT al (cookie otomatik gonderilir)
5. Tab kapatilinca JWT memory'den silinir — guvenli

### Faz 3: Migration Stratejisi (30 gunluk gecis sureci)

**Hafta 1-4: Dual-mode destek**
- Hem eski (header/body) hem yeni (cookie) yontemini destekle
- Eski yontemle gelen isteklere `X-Deprecation-Warning` header ekle
- Loglarda `[AUTH-MIGRATION]` prefix ile izle

**Hafta 4-5: Uyari donemi**
- Eski yontemi kullanan client'lara 299 Warning header gonder
- Frontend guncelleme zorunlulugu duyurusu

**Hafta 5+: Sadece cookie**
- Eski yontem devre disi
- Sadece httpOnly cookie kabul edilir

## Risk Analizi

### CSRF Korumasi
- `SameSite=Strict` ile korunur
- Mevcut `CsrfValidationMiddleware` (X-Requested-With header) ek katman saglar
- Cookie sadece `/Account` path'ine sinirli — diger endpoint'lere gitmez

### Cross-Domain / Multi-Tenant
- **Ayni domain:** `SameSite=Strict` sorunsuz calisir
- **Subdomain tenants** (orn. `tenant1.quvex.io`): `SameSite=None; Secure` gerekebilir
- Domain politikasi belirlenmeli: tek domain mi, subdomain mi?

### Mobile App Uyumlulugu
- Mobil uygulamalar cookie desteklemiyor
- Cozum: Mobil icin ayri token endpoint (`/Account/mobile-auth`) — standard Bearer token
- Rate limiting ve device fingerprinting ile guvenlik

### Performans
- Cookie boyutu: ~100 byte (opaque token) — ihmal edilebilir overhead
- Her `/Account/*` isteginde cookie gonderilir — minimal

## Test Plani

1. **Unit testleri:**
   - Cookie set edildigini dogrula (login)
   - Cookie'den refresh token okuma (refresh)
   - Cookie silme (logout)
   - Gecersiz/expired cookie reddi

2. **Integration testleri:**
   - Tam login -> refresh -> logout akisi
   - Cookie olmadan refresh reddi (401)
   - Dual-mode gecis donemi testleri

3. **Security testleri:**
   - XSS ile cookie erisilemedigini dogrula (httpOnly)
   - CSRF korumasinin calistigini dogrula (SameSite)
   - HTTP uzerinden cookie gonderilemedigini dogrula (Secure)

## Efor Tahmini

| Faz | Efor | Oncelik |
|-----|------|---------|
| API cookie implementasyonu | 4 saat | Yuksek |
| UI memory token yonetimi | 6 saat | Yuksek |
| Migration dual-mode | 4 saat | Orta |
| Test yazimi | 4 saat | Yuksek |
| Dokumantasyon | 2 saat | Dusuk |
| **Toplam** | **20 saat** | |

## Karar Bekleyenler

- [ ] Subdomain tenant stratejisi (SameSite=Strict vs Lax vs None)
- [ ] Mobil uygulama plani ve ayri endpoint gereksinimi
- [ ] Migration suresi (30 gun yeterli mi?)
- [ ] Frontend PR timing (UI ekibi ile koordinasyon)
