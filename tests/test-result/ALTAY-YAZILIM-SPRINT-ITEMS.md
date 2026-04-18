# ALTAY YAZILIM SAVUNMA - E2E Test Sprint Item Listesi

**Kaynak:** E2E test (2026-04-13) + bug raporu + UX analiz
**Hedef Sprint:** Sprint 12+ (mevcut SPRINT-PLAN.md'ye ekle)
**Toplam item:** 15 (3 P0 KRITIK, 6 P1 YUKSEK, 6 P2 ORTA)

Bu dosyadaki her item dogrudan `SPRINT-PLAN.md`'ye kopyalanabilir formatta.

---

## P0 — KRITIK (Sprint 12 ilk gun)

### SPRINT-12-T1: `/Account/register` 500 Internal Server Error duzeltme

**Tur:** BUG
**Efor:** S (2-4 saat)
**Oncelik:** P0
**Bug referans:** BUG-01

**Aciklama:** Yeni tenant'ta `POST /Account/register` ile ek kullanici olusturmak 500 Internal Server Error donuyor. Error mesaji generic "Beklenmeyen bir hata olustu", correlationId:`0HNKOQBV0A9SK:000000A8-AC`. Validation level 400 hatasi asildi (`Name/SurName` PascalCase dogru gonderiliyor), sunucuda exception middleware tarafindan yutulmus bir exception var.

**Root cause tahmini:**
- `AccountController.Register` action'da `user.TenantId` set edilmiyor olabilir
- `_userManager.CreateAsync` sonrasi bir `UserProfile` / `Employee` entity INSERT'inde `TenantId NOT NULL` constraint violation
- Veya `CsrfValidationMiddleware` beklenmedik davraniyor

**Kabul Kriteri:**
1. `POST /Account/register` yeni tenant'ta 200/201 donuyor
2. Yaratilan kullanici `GET /Account/{id}` ile tenant-scope'ta okunabiliyor
3. Kullanici `POST /Account/authenticate` ile login olabiliyor
4. API log'da `0HNKOQBV0A9SK:000000A8` correlationId ile stack trace incelendi ve root cause belgelendi
5. Unit test: `AccountControllerTests.Register_WithValidPayload_ReturnsSuccess` eklendi

**Dosya:** `C:\rynSoft\quvex\smallFactoryApi\src\Quvex.API\Controllers\AccountController.cs`

---

### SPRINT-12-T2: Sales approve sonrasi otomatik Production olusmuyor

**Tur:** BUG
**Efor:** M (4-8 saat)
**Oncelik:** P0
**Bug referans:** BUG-03

**Aciklama:** `PUT /Sales/approve/{id}` 200 OK donuyor ancak `GET /Production?pageSize=20` sonrasi yeni olusturulmus production bulunamiyor. CNC E2E test (cnc_e2e.py) ayni patterni kullaniyor ve orada calisiyor (fakat ayni tenant'ta tekrar test yapilmadi). Altay senaryosunda hic calismadi — muhtemelen yeni tenant'ta default warehouse eksikligi veya autoTransfer branch'indeki exception silent fail.

**Kabul Kriteri:**
1. Sales approve sonrasi Production listesinde yeni kayit var
2. Response body `productionId` ve `workOrderIds[]` doner (yeni field)
3. Product'ta stok tukenmisse uretim icin explicit hata doner (silent fail yok)
4. E2E test: `SalesApprovalIntegrationTest` yeni tenant uzerinde yesil
5. Log'da auto-transfer branch'inin ne yaptigi net goruntulenebilir

**Dosya:**
- `C:\rynSoft\quvex\smallFactoryApi\src\Quvex.Application\Services\SalesService.cs` — `ApproveSaleAsync`
- `C:\rynSoft\quvex\smallFactoryApi\src\Quvex.API\Controllers\SalesController.cs`

---

### SPRINT-12-T3: BomExplosion endpoint tenant-aware product lookup

**Tur:** BUG
**Efor:** S (1-2 saat)
**Oncelik:** P0
**Bug referans:** BUG-02

**Aciklama:** `GET /BomExplosion/{productId}?orderQuantity=5` - "Urun bulunamadi. ID: 52c3cebb-..." 404 donuyor. Ayni productId `GET /Product/{id}` ile 200 OK. Query tenant filter'a takiliyor.

**Root cause:** `BomExplosionService.cs:44-52` — `ExplodeAsync` icinde ilk `FirstOrDefaultAsync(p => p.Id == parentId)` cagrisi tenant context'ini gormuyor. Muhtemelen service `IApplicationDbContext` yerine `QuvexDBContext` dogrudan inject edilmis veya `HasQueryFilter` bypass ediliyor.

**Kabul Kriteri:**
1. `GET /BomExplosion/{durbunId}` 200 doner, BOM tree (Lens, Mercek, Tutucu, vs.) listelenir
2. Farkli tenant token ile ayni productId 404 veya 403 doner (isolation)
3. Unit test: `BomExplosionServiceTests.ExplodeAsync_RespectsTenantIsolation`

**Dosya:**
- `C:\rynSoft\quvex\smallFactoryApi\src\Quvex.Application\Services\BomExplosionService.cs:44-75`

---

## P1 — YUKSEK (Sprint 12 ilk hafta)

### SPRINT-12-T4: `RoleController` scaffold + CRUD endpoint

**Tur:** FEATURE
**Efor:** L (1-2 gun)
**Oncelik:** P1
**Bug referans:** BUG-04

**Aciklama:** Yeni tenant uc hazir rol ile geliyor (Admin/Manager/Operator), ancak musteri ozellestirilmis rol (`Uretim Muduru`, `Kaliteci`, `Depo Operatoru`) yaratamiyor. UI'da `/settings/roles` sayfasi mevcut ama backend yok.

**Kabul Kriteri:**
1. `POST /Role { name, description, permissions: string[] }` - 201
2. `GET /Role` - liste (tenant-scope)
3. `GET /Role/{id}` - detay + permission listesi
4. `PUT /Role/{id}` - guncelleme (sistem rolleri hayir)
5. `DELETE /Role/{id}` - sistem rolleri icin 403, digerleri 204
6. Permission listesi `Permissions.getPermissions()` ile sync
7. UI tarafindan tree-selection formu cagrisi
8. Integration test: rol yaratma + user assignment + login with role + permission enforcement

**Dosya:** `C:\rynSoft\quvex\smallFactoryApi\src\Quvex.API\Controllers\RoleController.cs` (yeni)

---

### SPRINT-12-T5: `PurchaseRequestController` — Satin alma talep modulu

**Tur:** FEATURE
**Efor:** L (2-3 gun)
**Oncelik:** P1
**Bug referans:** BUG-05

**Aciklama:** Senaryo Faz 7A "Satin Alma Talepleri" ekrani icin backend yok. Uretim muduru talebi yapiyor, yonetici onayliyor, sonra teklife/siparise donuyor.

**Kabul Kriteri:**
1. Entity: `PurchaseRequest { id, requestDate, requestedBy, neededBy, priority, description, status, items[] }`
2. Status enum: PENDING, APPROVED, REJECTED, CONVERTED
3. `POST /PurchaseRequest` - create (status=PENDING)
4. `PUT /PurchaseRequest/{id}/approve` - yonetici onayi
5. `PUT /PurchaseRequest/{id}/reject`
6. `POST /PurchaseRequest/{id}/convert-to-offer` - teklife donustur
7. HasQueryFilter tenant isolation
8. Permission: `SatinAlma.Goruntule/Kaydet/Sil`
9. Integration test

**Dosya (yeni):**
- `src/Quvex.Domain/Entities/Purchasing/PurchaseRequest.cs`
- `src/Quvex.Application/DTOs/PurchaseRequestDTO.cs`
- `src/Quvex.Application/Services/PurchaseRequestService.cs`
- `src/Quvex.API/Controllers/PurchaseRequestController.cs`

---

### SPRINT-12-T6: `GET /Account` kullanici listesi + paging

**Tur:** FEATURE
**Efor:** S (2-4 saat)
**Oncelik:** P1

**Aciklama:** Admin kullanicilari listeleyemiyor. `/settings/users` sayfasi bos.

**Kabul Kriteri:**
1. `GET /Account?page=1&pageSize=20&search=...` - paged list
2. Response: `{ items: [{id, email, name, surName, roles, isActive, createdAt}], totalCount, page, pageSize }`
3. Tenant-scope
4. Permission: `Ayarlar.Kullanici.Goruntule`
5. Test

**Dosya:** `C:\rynSoft\quvex\smallFactoryApi\src\Quvex.API\Controllers\AccountController.cs` — yeni method

---

### SPRINT-12-T7: TCMB doviz kuru otomatik fetch + manuel tetik

**Tur:** FEATURE
**Efor:** M (1 gun)
**Oncelik:** P1

**Aciklama:** Senaryoda 7 farkli tarih icin USD/TRY kuru manuel girilmek zorunda. Quvex-wide bir exchange rate service gerekli (background cron + manuel button).

**Kabul Kriteri:**
1. Entity: `ExchangeRate { date, currency, rate, source }`
2. Hangfire job: her aksam 18:00 TCMB XML'i ceker
3. `GET /ExchangeRate?from=USD&to=TRY&date=2026-01-05` - tek tarih
4. `GET /ExchangeRate/latest?currency=USD` - son gecerli
5. `POST /ExchangeRate/refresh` - manuel tetik (admin-only)
6. Invoice create'te `exchangeRate` null ise o gunun kurunu otomatik set et
7. UI: Finans -> Doviz Kurlari sayfasinda gecmis + grafik

**Dosya (yeni):**
- `src/Quvex.Application/Services/ExchangeRateService.cs`
- `src/Quvex.API/Controllers/ExchangeRateController.cs`

---

### SPRINT-12-T8: Accounting/aging routing alias

**Tur:** BUG
**Efor:** S (15 dk)
**Oncelik:** P1
**Bug referans:** BUG-07

**Aciklama:** UI `/accounting/aging` path'ini cagiriyor, API `/AgingAnalysis` altinda. Tek satir route alias yeterli.

**Kabul Kriteri:**
1. `AgingAnalysisController` uzerine `[Route("Accounting/aging")]` alias eklendi
2. Eski route da calismaya devam ediyor
3. UI tarafindan her iki path de 200 doner

**Dosya:** `C:\rynSoft\quvex\smallFactoryApi\src\Quvex.API\Controllers\AgingAnalysisController.cs`

---

### SPRINT-12-T9: `ProductBom` junction entity + CRUD

**Tur:** REFACTOR
**Efor:** L (2-3 gun)
**Oncelik:** P1
**Bug referans:** BUG-06

**Aciklama:** Mevcut `Product.ParentProductId` tek parent sinirlamasi BOM many-to-many senaryolarini destekleyemez (MLZ-005 hem durbun hem baska urunun parcasi olabilir). `ProductBom { parentProductId, childProductId, quantity, unit, notes }` junction entity scaffold et.

**Kabul Kriteri:**
1. Yeni entity + migration (veri migration: mevcut `ParentProductId` otomatik tasinma)
2. `POST /Bom`, `GET /Bom?parentId=...`, `DELETE /Bom/{id}`
3. BomExplosionService yeni tabloyu kullaniyor
4. Product.ParentProductId deprecated (backward compatible kalmali)
5. UI BOM tree editor yeni endpoint'le calisiyor

---

## P2 — ORTA (Sprint 12-13)

### SPRINT-12-T10: Sales auto-produce kontrollu endpoint

**Tur:** FEATURE
**Efor:** M (1 gun)
**Oncelik:** P2

**Aciklama:** BUG-03 ile ilgili — mevcut `autoTransfer=true` default yerine explicit `POST /Sales/{id}/produce` endpoint'i ekle. Response `{productionId, workOrderIds}` donsun.

**Kabul Kriteri:**
1. Yeni endpoint: `POST /Sales/{id}/produce` - productionId donuyor
2. Eski `approve?autoTransfer=true` calisiyor ama deprecated
3. Insufficient stock durumunda 409 Conflict + eksik malzeme listesi
4. Integration test

---

### SPRINT-12-T11: Payment allocation (coklu fatura)

**Tur:** FEATURE
**Efor:** L (2-3 gun)
**Oncelik:** P2

**Aciklama:** Bir tahsilat bircok faturayi kapamali (avans durumu + kismi odeme kombinasyonu).

**Kabul Kriteri:**
1. Entity: `PaymentAllocation { paymentId, invoiceId, amount }`
2. `POST /Payment` body'sinde `allocations: [{invoiceId, amount}]` array kabul et
3. `amount` sum'i total payment'a esit olmali
4. Gecmis allocation'lari goster: `GET /Invoice/{id}/payments`

---

### SPRINT-12-T12: NCR disposition flow endpoint

**Tur:** FEATURE
**Efor:** M (1 gun)
**Oncelik:** P2

**Aciklama:** Senaryo 11A.3 "NCR karari: Rework" icin ayri endpoint. Su an PUT ile full payload gerekir.

**Kabul Kriteri:**
1. `POST /Ncr/{id}/disposition { action: REWORK|SCRAP|RETURN|USE_AS_IS, responsibleId, targetDate, notes }`
2. Status auto-update
3. CAPA auto-link onerisi
4. Bildirim (SignalR) ilgili kaliteci/yonetici

---

### SPRINT-12-T13: `GET /Production/by-sales/{salesId}`

**Tur:** FEATURE
**Efor:** S (1 saat)
**Oncelik:** P2

**Aciklama:** Sales -> Production lookup shortcut.

**Kabul Kriteri:**
1. `GET /Production/by-sales/{salesId}` - associated production(s)
2. Pagination yok (1 sales = 1 production varsayimi, ama array dondurur)
3. UI'da sales detay sayfasinda "Uretime git" butonu bu endpoint'i kullaniyor

---

### SPRINT-12-T14: `ProductVariant` GET list endpoint

**Tur:** BUG
**Efor:** S (1 saat)
**Oncelik:** P2
**Bug referans:** BUG-08

**Aciklama:** Sprint 11 Dalga 2'de eklendi ama liste endpoint'i yok, sadece `{id}` detay var.

**Kabul Kriteri:**
1. `GET /ProductVariant?productId={id}` - variant listesi
2. Pagination

**Dosya:** `ProductVariantController.cs`

---

### SPRINT-13-T15: Sprint 11/12 eksik modul deployment

**Tur:** DEVOPS
**Efor:** M (1 gun)
**Oncelik:** P2
**Bug referans:** BUG-09

**Aciklama:** ProductionBoard, MachineDowntime, OrderTrackingLink, WeldingWps sprint 11-12'den canli API'ya deploy edilmemis. Build + deploy.

**Kabul Kriteri:**
1. Dort controller canli api.quvex.io'da 200 donuyor
2. Read probe test gecer
3. CE Technical File / ShiftHandover'in yaninda bu dortu de canli

---

## Ozet

| Oncelik | Item Sayisi | Toplam Efor (Sprint Point) |
|---------|-------------|-----------------------------|
| P0 (Kritik) | 3 | 7-14 saat |
| P1 (Yuksek) | 6 | 5-8 gun |
| P2 (Orta) | 6 | 6-9 gun |
| **TOPLAM** | **15** | **~2 sprint (2 hafta)** |

**Not:** Tum item'lar Quvex Clean Architecture (Domain/Application/Infrastructure/API) kurallarina uymali, tenant-aware (HasQueryFilter), permission gated (`YetkiDenetimi` attribute), ve her biri icin en az 1 integration test + 1 unit test yazilmali.
