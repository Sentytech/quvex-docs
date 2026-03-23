# Quvex ERP — Bug Listesi v2
> Güncelleme: 2026-03-20 | Aktif test oturumu

## Durum
- 🔴 Açık
- 🟡 Devam Ediyor
- 🟢 Düzeltildi (commit hash)
- ⚪ İptal / Geçerli Değil

---

## FAZ 1 — Auth & Login (Tamamlandı)

| # | Modül | Ekran | Hata | Durum |
|---|-------|-------|------|-------|
| 1.1 | Auth | Login.js | accessToken olarak JWT gönderiliyordu, API opaque RefreshToken bekliyor | 🟢 f2a9cfe |
| 1.2 | Auth | auth/utils.js | `isUserLoggedIn()` localStorage'dan token arıyordu, sessionStorage olmalı | 🟢 f2a9cfe |
| 1.3 | Auth | jwtService.js | Bozuk refresh token mekanizması — endpoint yok, her 401'de login'e atıyor | 🟢 f2a9cfe |
| 1.4 | Auth/API | YetkiDenetimi.cs | User lookup HasQueryFilter'dan etkileniyor — admin bulunamıyor | 🟢 API |
| 1.5 | Auth/API | AccountController.cs | RefreshToken base64'te `+/=` içeriyor — URL-safe encoding gerekli | 🟢 API |
| 1.6 | Auth/API | AccountController.cs | Her login TÜM eski token'ları siliyor — çoklu tarayıcı çalışmıyor | 🟢 71486fc |
| 1.7 | Auth | jwtService.js | 401 interceptor'da `new Promise(() => {})` memory leak | 🟢 3aad3ea |
| 1.8 | Auth | authentication.js | Logout 401 alıyor — token silinmeden API çağrısı | 🟢 3aad3ea |

## FAZ 2 — Güvenlik (Tamamlandı)

| # | Modül | Ekran | Hata | Durum |
|---|-------|-------|------|-------|
| 2.1 | Auth/API | RoleController.cs | Class-level `[YetkiDenetimi]` yok — yeni endpoint korumasız kalabilir | 🟢 71486fc |
| 2.2 | Auth/API | CsrfValidationMiddleware.cs | `/api/Account/authenticate` CSRF exclusion eksik | 🟢 71486fc |
| 2.3 | Bildirim/API | NotificationController.cs | POST/DELETE metodlar `Bildirim.Goruntule` ile çalışıyor, `Kaydet` olmalı | 🟢 71486fc |
| 2.4 | Tenant/API | AccountController.cs | Deaktif tenant kullanıcıları login olabiliyor | 🟢 71486fc |
| 2.5 | Güvenlik | Router.js | Tenant kullanıcı `/admin/*` URL ile erişebiliyor | 🟢 f2a9cfe |
| 2.6 | Güvenlik | Router.js | Super admin `/manage/*` URL ile erişebiliyor (tenant context yok) | 🟢 3aad3ea |
| 2.7 | Auth/API | YetkiDenetimi.cs | DbContext threading — eşzamanlı isteklerde çakışma | 🟢 94ddcd4 |

## FAZ 3 — Navigasyon & UI (Tamamlandı)

| # | Modül | Ekran | Hata | Durum |
|---|-------|-------|------|-------|
| 3.1 | Navigasyon | HorizontalLayout.js | Admin Panel ve Yönetim Paneli menü öğeleri yok | 🟢 f2a9cfe |
| 3.2 | Navigasyon | HorizontalLayout.js | Tenant kullanıcı Admin Panel'i görebiliyor | 🟢 f2a9cfe |
| 3.3 | Admin | AdminDashboard.js | `planDistribution` object → `.map()` hatası (crash) | 🟢 f2a9cfe |
| 3.4 | Admin | AdminDashboard.js | `newThisMonth` → `newTenantsThisMonth` field uyuşmazlığı | 🟢 f2a9cfe |
| 3.5 | UX | errorHandler.js | Her network hatası toast gösteriyor — toast bombası | 🟢 03afa14 |
| 3.6 | Bildirim | NotificationBell.js | Raw axios kullanıyor, api.js wrapper'ı değil | 🟢 3aad3ea |
| 3.7 | Bildirim | NotificationBell.js | Polling hatalarında gereksiz toast | 🟢 03afa14 |
| 3.8 | SignalR | useSignalR.js | Hub URL yanlış — `/api/hubs/notification` olmamalı | 🟢 3aad3ea |
| 3.9 | Dashboard | HeatmapWidget.js | `/Machine` endpoint yanlış — `/Machines` olmalı | 🟢 4f605d3 |

## FAZ 4 — API Veri Bütünlüğü (Tamamlandı)

| # | Modül | Ekran | Hata | Durum |
|---|-------|-------|------|-------|
| 4.1 | Satış/API | OfferProductController.cs | `ChangeOfferProductStatus` SaveChangesAsync yorum satırında | 🟢 71486fc |
| 4.2 | Satınalma/API | PurchaseOrderController.cs | Circular reference — JSON serialize hatası (HTTP 500) | 🟢 6fa221d |
| 4.3 | Satış | OfferFormItemsAdditionInfo.js | Sipariş Aç'ta beklenen 404 toast gösteriyor | 🟢 9d84457 |
| 4.4 | Satınalma | PurchaseOfferForm.js | Boş Guid string `""` gönderiliyor — "The value '' is invalid" | 🟢 9d84457 |

## FAZ 5 — Kod Kalitesi (Tamamlandı)

| # | Modül | Ekran | Hata | Durum |
|---|-------|-------|------|-------|
| 5.1 | Kalite | SpcManagement.js | console.error production'da | 🟢 3aad3ea |
| 5.2 | Kalite | SupplyChainRiskManagement.js | console.error production'da | 🟢 3aad3ea |
| 5.3 | Kalite | DesignDevelopmentManagement.js | console.error production'da | 🟢 3aad3ea |
| 5.4 | Kalite | PpapManagement.js | console.error production'da | 🟢 3aad3ea |
| 5.5 | Kalite | CustomerPropertyManagement.js | console.error production'da | 🟢 3aad3ea |
| 5.6 | Kalite | FodManagement.js | console.error production'da | 🟢 3aad3ea |
| 5.7 | Kalite | SpecialProcessManagement.js | console.error production'da | 🟢 3aad3ea |
| 5.8 | Kalite | ConfigurationManagement.js | console.error production'da | 🟢 3aad3ea |
| 5.9 | Kalite | CounterfeitPartManagement.js | console.error production'da | 🟢 3aad3ea |
| 5.10 | Kalite | FaiManagement.js | console.error production'da | 🟢 3aad3ea |
| 5.11 | Stok | ABCAnalysis.js | console.error production'da | 🟢 3aad3ea |
| 5.12 | SignalR | useSignalR.js | console.warn production'da | 🟢 3aad3ea |
| 5.13 | ESLint | .eslintrc.js | @core klasörü class field syntax parse hatası | 🟢 f2a9cfe |

## FAZ 6 — Pagination (53 Controller)

**Sorun:** Tüm liste endpoint'leri pagination olmadan çalışıyor — veri büyüdükçe performans sorunu.

**Yaklaşım:** Ortak `PaginatedResult<T>` helper + ana controller'lara öncelikli ekleme.

### Öncelik 1 — Yoğun Veri (Ana Ekranlar)

| # | Controller | Endpoint | Durum |
|---|-----------|----------|-------|
| 6.1 | CustomerController | GET /api/customer | 🟢 9145e42+2fd612c |
| 6.2 | ProductController | GET /api/product | 🟢 9145e42+2fd612c |
| 6.3 | OfferController | GET /api/offer | 🟢 9145e42+2fd612c |
| 6.4 | SalesController | GET /api/sales | 🟢 9145e42+2fd612c |
| 6.5 | InvoiceController | GET /api/invoice | 🟢 9145e42+2fd612c |
| 6.6 | PurchaseOrderController | GET /api/purchaseorder | 🟢 9145e42+2fd612c |
| 6.7 | StockReceiptsController | GET /api/stockreceipts | 🟢 9145e42+2fd612c |
| 6.8 | StockRequestsController | GET /api/stockrequests | 🟢 9145e42+2fd612c |

### Öncelik 2 — Orta Veri

| # | Controller | Endpoint | Durum |
|---|-----------|----------|-------|
| 6.9 | NcrController | GET /api/ncr | 🔴 |
| 6.10 | CapaController | GET /api/capa | 🔴 |
| 6.11 | IncomingInspectionController | GET /api/incominginspection | 🔴 |
| 6.12 | MachinesController | GET /api/machines | 🔴 |
| 6.13 | MaintenanceController | GET /api/maintenance/* | 🔴 |
| 6.14 | CalibrationController | GET /api/calibration/* | 🔴 |
| 6.15 | TasksController | GET /api/tasks | 🔴 |
| 6.16 | PaymentController | GET /api/payment | 🔴 |
| 6.17 | StockLotController | GET /api/stocklot | 🔴 |
| 6.18 | SubcontractOrderController | GET /api/subcontractorder | 🔴 |

### Öncelik 3 — Düşük Veri / Ayarlar

| # | Controller | Endpoint | Durum |
|---|-----------|----------|-------|
| 6.19 | UnitsController | GET /api/units | 🔴 |
| 6.20 | WarehousesController | GET /api/warehouses | 🔴 |
| 6.21 | MaterialTypesController | GET /api/materialtypes | 🔴 |
| 6.22 | WorkOrderTemplatesController | GET /api/workordertemplates | 🔴 |
| 6.23 | WorkOrderStepsController | GET /api/workordersteps | 🔴 |
| 6.24 | EcnController | GET /api/ecn | 🔴 |
| 6.25+ | Diğer 29 controller | Kalite, Bakım, İK sub-endpointler | 🔴 |

## FAZ 7 — Tarayıcı Testi Bugları

| # | Modül | Ekran | Hata | Durum |
|---|-------|-------|------|-------|
| 7.1 | Dashboard | Home.js | `GET /Production` → `GET /Production/summary/counts` özet endpoint'e geçildi | 🟢 504bcf5+2fd5959 |
| 7.2 | Dashboard | Home.js | `GET /PurchaseOrder` → `GET /PurchaseOrder/summary/counts` özet endpoint'e geçildi | 🟢 504bcf5+2fd5959 |
| 7.3 | Dashboard | Home.js | `GET /Tasks` tüm görevleri çekiyor — API'de summary/counts eklendi | 🟢 504bcf5 |
| 7.4 | Dashboard | Home.js | Toplam 13 API call tek seferde — yavaş yükleme, rate limit riski | 🔴 |
| 7.5 | Dashboard | HeatmapWidget.js | `GET /Machines` + `GET /Chart/work-load` ayrı çağrı — dashboard zaten çekiyor | 🔴 |
| 7.6 | UI/Core | UILoader, ScrollTop, ToastContainer | React 18 `defaultProps` deprecation warning — JS default parameters kullanılmalı | 🔴 |
| 7.7 | Stok | /stocks — Satınalma Öner butonu | Buton fix + light tema kontrast düzeltildi | 🟢 cc58237 |
| 7.8 | Stok | /stocks — Download/Export butonu | CSV export field mapping düzeltildi | 🟢 cc58237 |
| 7.9 | Stok | /stocks — Stok miktarı | NaN → Number fallback eklendi | 🟢 2fd5959 |
| 7.10 | Stok | /stock-receipts — Stok Kodu seçimi | Label düzeltildi + cross-fill eklendi | 🟢 cc58237 |
| 7.11 | Stok | /stock-receipts — Stok Adı seçimi | Cross-fill eklendi | 🟢 cc58237 |
| 7.12 | Stok | /stock-receipts — Yeni fiş formu | Otomatik 1 boş satır eklendi | 🟢 cc58237 |
| 7.13 | Stok | /stock-receipts — Form sıralaması | Adet/Birim sırası değiştirildi | 🟢 cc58237 |
| 7.14 | Stok | /stock-receipts — Depo ismi alanı | Searchable Select dropdown yapıldı | 🟢 cc58237 |
| 7.15 | Stok | /stock-receipts — Stok Kodu ve Stok Adı | Required validasyon eklendi | 🟢 cc58237 |
| 7.16 | Stok | /stocks — Stok Geçmişi | Display fix uygulandı | 🟢 cc58237 |
| 7.17 | Stok | /products/form — Birim dropdown | Searchable dropdown yapıldı | 🟢 cc58237 |
| 7.18 | Stok | /products/form — Dosya Yöneticisi | Auth token fix uygulandı | 🟢 cc58237 |
| 7.19 | Stok | /products/form — Ürün Ağacı stok ekleme | Searchable product select yapıldı | 🟢 cc58237 |
| 7.20 | Stok | /stock/count — Ürün seçimi | Searchable dropdown yapıldı | 🟢 cc58237 |
| 7.21 | Stok | /stock/lots — Ürün seçimi | Searchable dropdown yapıldı | 🟢 cc58237 |
| 7.22 | Stok | /stock/lots — Tedarikçi seçimi | Searchable dropdown yapıldı | 🟢 cc58237 |
| 7.23 | Stok | /stock/lots — Tarih validasyonu | Expiry date validasyon eklendi | 🟢 cc58237 |
| 7.24 | Stok | /stock/valuation — Genel | Loading/empty state UX eklendi | 🟢 cc58237 |
| 7.25 | Stok | /stock/alerts — Tablo | Pagination eklendi | 🟢 cc58237 |
| 7.26 | Stok | /stock/alerts — Otomatik Satınalma butonu | Buton fix uygulandı | 🟢 cc58237 |
| 7.27 | Stok | /stock/alerts — Stok Seviyeleri Ayarları | Endpoint fix uygulandı | 🟢 cc58237 |
| 7.28 | Stok | /stock/barcode — Ürün seçimi | Searchable dropdown yapıldı | 🟢 cc58237 |
| 7.29 | Stok | /stock/transfer/form — Kaydet | Circular reference → DTO projection | 🟢 504bcf5 |
| 7.30 | Satınalma | /purchase-request — Ürün seçimi | Searchable dropdown yapıldı | 🟢 cc58237 |
| 7.31 | Satınalma | /purchase-request — Talep Durumu | Status field fix uygulandı | 🟢 cc58237 |
| 7.32 | Satınalma | /purchase-request — Malzeme Talep Formu | Endpoint/error handling fix | 🟢 cc58237 |
| 7.33 | Satınalma | /suppliers — Cari Formu | Form genişletildi (adres, banka, not alanları) | 🟢 cc58237 |
| 7.34 | Satınalma | /purchase-offers — Ekle butonu | Guid null fix | 🟢 2fd5959 |
| 7.35 | Satınalma | /purchase-offers — Ürün/Tedarikçi seçimi | Searchable dropdown fix | 🟢 cc58237 |
| 7.36 | Satınalma | /purchase-offers — Dosya Yöneticisi | File manager fix | 🟢 cc58237 |

> ⬆️ Tarayıcıdan test ederken bulunan yeni buglar buraya eklenecek

## FAZ 8 — TODO / Gelecek

| # | Modül | Ekran | Hata | Durum |
|---|-------|-------|------|-------|
| 8.1 | Ödeme/API | IyzicoBillingService.cs | `GetPaymentHistoryAsync` boş liste — iyzico entegrasyonu yapılmamış | 🔴 |

---

## İSTATİSTİKLER
- **Toplam Tespit:** 75+
- **Düzeltildi:** 69
- **Açık:** 3 (7.4, 7.5, 7.6) + Pagination (FAZ 6) + iyzico TODO (FAZ 8)
- **Tarayıcı Testi:** FAZ 7 tamamlandı
