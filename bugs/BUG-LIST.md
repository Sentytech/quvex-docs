# Quvex ERP — Bug Listesi
> Oluşturma: 2026-03-20 | Durum: Aktif

## Durum Açıklamaları
- 🔴 Açık — Düzeltilmedi
- 🟡 Devam Ediyor
- 🟢 Düzeltildi
- ⚪ İptal / Geçerli Değil

---

## YÜKSEK ÖNCELİK (Güvenlik & Veri Kaybı)

| # | Modül | Ekran/Dosya | Hata Bilgisi | Durum |
|---|-------|-------------|-------------|-------|
| H1 | Auth/API | RoleController.cs | RoleController'da class-level `[ServiceFilter(typeof(YetkiDenetimi))]` eklendi | 🟢 |
| H2 | Auth/API | CsrfValidationMiddleware.cs | `/api/Account/authenticate` CSRF ExcludedPaths'e eklendi | 🟢 |
| H3 | Bildirim/API | NotificationController.cs | POST/DELETE metodlara `Bildirim.Kaydet` permission eklendi | 🟢 |
| H4 | Satış/API | OfferProductController.cs | `SaveChangesAsync()` açıldı, method async yapıldı | 🟢 |
| H5 | Tenant/API | AccountController.cs | Login'de deaktif tenant kontrolü eklendi | 🟢 |
| H6 | Auth/UI | jwtService.js | `new Promise(() => {})` → `Promise.reject(error)` ile memory leak düzeltildi | 🟢 |

## ORTA ÖNCELİK (Fonksiyonel Hatalar)

| # | Modül | Ekran/Dosya | Hata Bilgisi | Durum |
|---|-------|-------------|-------------|-------|
| M1 | SignalR/UI | useSignalR.js | Hub URL `REACT_APP_API_URL` kullanacak şekilde düzeltildi | 🟢 |
| M2 | Bildirim/UI | NotificationBell.js | `api.js` service wrapper'ına geçirildi | 🟢 |
| M3 | Ödeme/API | IyzicoBillingService.cs | `GetPaymentHistoryAsync` boş liste dönüyor — iyzico entegrasyonu tamamlanmamış (TODO) | 🔴 |
| M4 | Manage/UI | Router.js + routes | `/manage/*` route'larına `tenantOnly` guard eklendi — super admin erişemez | 🟢 |
| M5 | Auth/UI | authentication.js | `closeUser()` hata yakalama eklendi, gereksiz notification kaldırıldı | 🟢 |
| M6 | Register/UI | Register.js | Bug değil — tasarım gereği kayıt sonrası login'e yönlendiriyor | ⚪ |
| M7 | Auth/API | AccountController.cs | Sadece expired/revoked token'lar siliniyor, aktif sessionlar korunuyor | 🟢 |

## DÜŞÜK ÖNCELİK (Kod Kalitesi & UX)

| # | Modül | Ekran/Dosya | Hata Bilgisi | Durum |
|---|-------|-------------|-------------|-------|
| L1 | Kalite/UI | SpcManagement.js | 3x `console.error(e)` catch bloklarında — production'da console'a hata yazıyor | 🔴 |
| L2 | Kalite/UI | SupplyChainRiskManagement.js | 3x `console.error(e)` catch bloklarında | 🔴 |
| L3 | Kalite/UI | DesignDevelopmentManagement.js | 7x `console.error(e)` catch bloklarında | 🔴 |
| L4 | Kalite/UI | PpapManagement.js | 3x `console.error(e)` catch bloklarında | 🔴 |
| L5 | Kalite/UI | CustomerPropertyManagement.js | 3x `console.error(e)` catch bloklarında | 🔴 |
| L6 | Kalite/UI | FodManagement.js | 3x `console.error(e)` catch bloklarında | 🔴 |
| L7 | Kalite/UI | SpecialProcessManagement.js | 4x `console.error(e)` catch bloklarında | 🔴 |
| L8 | Kalite/UI | ConfigurationManagement.js | 3x `console.error(e)` catch bloklarında | 🔴 |
| L9 | Kalite/UI | CounterfeitPartManagement.js | 3x `console.error(e)` catch bloklarında | 🔴 |
| L10 | Kalite/UI | FaiManagement.js | 3x `console.error(e)` catch bloklarında | 🔴 |
| L11 | Stok/UI | ABCAnalysis.js:57 | `console.error('ABC analizi yüklenemedi:', err)` | 🔴 |
| L12 | SignalR/UI | useSignalR.js:45 | `console.warn('SignalR connection failed:', err)` | 🔴 |

## DÜZELTILMIŞ (Bu Oturumda)

| # | Modül | Ekran/Dosya | Hata Bilgisi | Commit |
|---|-------|-------------|-------------|--------|
| F1 | Auth/UI | Login.js | `accessToken` olarak JWT gönderiliyordu, API opaque RefreshToken bekliyor | f2a9cfe |
| F2 | Auth/UI | auth/utils.js | `isUserLoggedIn()` localStorage'dan token arıyordu, sessionStorage olmalı | f2a9cfe |
| F3 | Auth/UI | jwtService.js | Bozuk refresh token mekanizması — endpoint yok, her 401'de login'e atıyordu | f2a9cfe |
| F4 | Admin/UI | AdminDashboard.js | `planDistribution` object'i `.map()` ile kullanılıyordu — `Object.entries()` olmalı | f2a9cfe |
| F5 | Admin/UI | AdminDashboard.js | `newThisMonth` → `newTenantsThisMonth` field adı uyuşmazlığı | f2a9cfe |
| F6 | Auth/API | YetkiDenetimi.cs | User lookup HasQueryFilter'dan etkileniyordu — `IgnoreQueryFilters()` eklendi | API'de |
| F7 | Auth/API | AccountController.cs | RefreshToken base64'te `+/=` içeriyordu — URL-safe encoding'e geçildi | API'de |
| F8 | Navigasyon/UI | HorizontalLayout.js + navigation | Admin Panel ve Yönetim Paneli menü öğeleri yoktu — role-based filtreleme eklendi | f2a9cfe |
| F9 | Güvenlik/UI | Router.js + routes | Tenant kullanıcı `/admin/*` sayfalarına URL ile erişebiliyordu — superAdminOnly guard eklendi | f2a9cfe |

---

## İSTATİSTİKLER
- **Toplam Bug:** 25 (6 Yüksek + 7 Orta + 12 Düşük)
- **Düzeltilmiş:** 9 (önceki oturum) + 11 (H1-H6, M1-M2, M4-M5, M7) + 12 (L1-L12) = 32
- **Açık:** 1 (M3 — iyzico entegrasyonu, TODO)
- **İptal:** 1 (M6 — bug değil)
