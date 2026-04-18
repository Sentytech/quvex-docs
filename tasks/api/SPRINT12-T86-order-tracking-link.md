# Sprint 12 — T86: Müşteri Sipariş Takip Linki (API)

## Amaç
Müşterinin sürekli "siparişim ne aşamada?" diye aramasını/mesaj atmasını engellemek için tek tıkla paylaşılabilen, login gerektirmeyen, token'lı sipariş takip linki üretimi.

## Kapsam
- Yeni entity: `OrderTrackingLink : BaseFullModel<Guid>`
- Yeni servis: `IOrderTrackingService` / `OrderTrackingService`
- Yeni controller: `OrderTrackingController`
- Yeni rate limit policy: `public-track` (IP başı 30/dakika)
- Yeni public DTO: `OrderPublicViewDto` (hassas bilgi sızdırmaz)
- Yeni SQL migration: `AddOrderTrackingLink.sql`

## Endpoint'ler
| Metod | Yol | Auth | Açıklama |
|-------|-----|------|----------|
| POST | `/OrderTracking/{orderId}/link` | `Satis.Kaydet` | Yeni link üret (body: `{ validDays: 30 }`) |
| GET  | `/OrderTracking/{orderId}/links` | `Satis.Goruntule` | Siparişe ait tüm linkleri listele |
| DELETE | `/OrderTracking/{linkId}` | `Satis.Sil` | Link iptal et |
| GET  | `/track/{token}` | **AllowAnonymous** + rate-limit | Public müşteri görünümü |

## Veri Modeli
`OrderTrackingLink`:
- `Id` (Guid)
- `OrderId` (FK → Sales)
- `Token` (string, 32 char URL-safe, **UNIQUE**)
- `ExpiresAt` (DateTime, varsayılan +30 gün)
- `IsActive` (bool, revoke için false yapılır)
- `ViewCount` (int)
- `LastViewedAt` (DateTime?)
- `LastViewedIp` (string?, max 45)
- `TenantId` (Guid?, BaseFullModel'den)

## Public DTO İçeriği (sızıntı önleme)
**İçerir:** `OrderNumber`, `Status`, `EstimatedDeliveryDate`, `Progress %`, `CurrentStage`, `MachineName`, `CompanyName`, `CompanyLogo`, `CompanyWhatsApp`, `Timeline[]`

**KESINLIKLE İÇERMEZ:** maliyet, kar, iç notlar, diğer siparişler, teklif fiyatları, müşteri özel verisi.

## Multi-Tenancy ve Güvenlik
- DbSet `OrderTrackingLinks` üzerinde `HasQueryFilter(e => !IsTenantResolved || e.TenantId == CurrentTenantId)`
- Public endpoint **token üzerinden** sorgu yapar; `IgnoreQueryFilters()` kullanılır
- Token tahmin edilemez (32 char, RNGCryptoServiceProvider, base64url) — rate limit ile brute force engellenir
- Token unique index → her token tek bir tenant + tek bir siparişe bağlı; tenant izolasyonu token üzerinden sağlanır

## Rate Limiting
`public-track` policy: IP başı **30 istek/dakika** (FixedWindowLimiter). Brute force token tahmininden korur.

## Test
`tests/Quvex.API.Tests/Services/OrderTrackingServiceTests.cs` — 12 test:
- Token uniqueness
- Expiration validation
- View count increment
- Tenant boundary doğrulaması
- Revoke davranışı
- Public sorgu doğrulaması (geçersiz/expired/revoked token döndürmez)

## Migration
`src/Quvex.API/Migrations/AddOrderTrackingLink.sql` — 3 şemaya da uygulanmalı:
- public
- tenant_rynsoft
- tenant_demo

## Build Sonucu
- `dotnet build src/Quvex.API/Quvex.API.csproj` → **0 hata, 0 yeni uyarı**
- `dotnet test --filter OrderTracking` → **12/12 PASS**

## Dosyalar
- `src/Quvex.Domain/Entities/Sales/OrderTrackingLink.cs`
- `src/Quvex.Application/DTOs/OrderTrackingDTOs.cs`
- `src/Quvex.Application/Interfaces/Services/IOrderTrackingService.cs`
- `src/Quvex.Application/Services/OrderTrackingService.cs`
- `src/Quvex.Application/DependencyInjection.cs` (DI kayıt)
- `src/Quvex.Application/Interfaces/IApplicationDbContext.cs` (DbSet)
- `src/Quvex.API/DataAccess/QuvexDBContext.cs` (DbSet, query filter, indexler)
- `src/Quvex.API/Controllers/OrderTrackingController.cs`
- `src/Quvex.API/Program.cs` (rate limit policy)
- `src/Quvex.API/Migrations/AddOrderTrackingLink.sql`
- `tests/Quvex.API.Tests/Services/OrderTrackingServiceTests.cs`
