# ALTAY YAZILIM SAVUNMA - E2E Test Bug Raporu

**Test Tarihi:** 2026-04-13
**Test Kapsami:** `POST /register` ile yeni tenant (`ad1b61fc-8712-4ef5-b03e-eda42c6fa28a`) uzerinde 177 API cagrisi

---

## BUG-01: Yeni kullanici olusturma `/Account/register` 500 Internal Server Error (KRITIK)

**Endpoint:** `POST /Account/register`
**Status:** 500
**Severity:** KRITIK — yeni tenant hic bir ekstra kullanici ekleyemez, platform coklu-kullanici senaryosunda kullanilamaz

**Payload:**
```json
{
  "Name": "Kemal",
  "SurName": "Yildirim",
  "Email": "kemal.yildirim@altay-76107863.demo",
  "UserName": "kemal.yildirim@altay-76107863.demo",
  "Password": "KemalUretim2026!",
  "ConfirmPassword": "KemalUretim2026!",
  "PhoneNumber": "5550000000"
}
```

**Response:**
```json
{
  "statusCode": 500,
  "message": "Beklenmeyen bir hata olustu.",
  "correlationId": "0HNKOQBV0A9SK:000000A8",
  "errors": null
}
```

**Ilk denemede (yanlis field isimleri `firstName/lastName` ile):**
```
400 — "Name alanı zorunludur", "SurName alanı zorunludur"
```
(FluentValidation `RegisterRequestValidator.cs:14-20` — `Name` ve `SurName` PascalCase field isimleri beklenir.)

**Duzgun field isimleriyle (Name/SurName) 500:**
Hata mesaji generik. Correlation ID'leri ile API log'unda tam stack trace incelenmeli:
- `0HNKOQBV0A9SK:000000A8` - `000000AC`

**Root cause tahmini:**
- `AccountController.cs` icinde `Register` action'da `_userManager.CreateAsync(user, password)` veya sonrasinda bir tenant propagation hatasi
- Muhtemelen yeni user'a `TenantId` atanmiyor veya atama sirasinda `TenantContext.GetTenantId()` HTTP context icin `X-Tenant-Id` header'i uzerinden cekilmiyor (register endpoint tenant-scope'ta calismali)
- Olasi senaryo: Identity user create OK ama sonrasinda `Employee` veya `UserProfile` entity'si INSERT'te `TenantId` NULL nedeniyle `NOT NULL` constraint violation

**Reproduce:**
1. `POST /register` ile yeni tenant yarat (Pro plan)
2. Provisioning tamamlanmasini bekle (15 sn)
3. `POST /Account/authenticate` ile admin token al
4. Header: `X-Tenant-Id: {tenantId}`, `Authorization: Bearer {refreshToken}`
5. `POST /Account/register` ile yukaridaki payload'i gonder
6. Tutarli olarak 500 doner

**Dosya (tahmin):** `C:\rynSoft\quvex\smallFactoryApi\src\Quvex.API\Controllers\AccountController.cs` — Register action
**Kontrol edilecek:** `user.TenantId` set ediliyor mu, `await _userManager.CreateAsync` sonrasi ek service cagrilari tenant context ile calisabiliyor mu, exception middleware tarafindan yutuluyor (log'da stack var mi)

---

## BUG-02: BomExplosion 404 — kendi tenant'inin urununu bulamiyor (YUKSEK)

**Endpoint:** `GET /BomExplosion/{productId}?orderQuantity=5`
**Status:** 404
**Severity:** YUKSEK — BOM maliyet analizi ve uretim malzeme cekimi raporu urun bulamiyor

**Payload:** Durbun productId `52c3cebb-339e-4d12-a0ee-a95e42fcb3b3`

**Response:**
```json
{
  "statusCode": 404,
  "message": "Urun bulunamadi. ID: 52c3cebb-339e-4d12-a0ee-a95e42fcb3b3",
  "correlationId": "0HNKOQBV0A9SK:000000BB",
  "errors": null
}
```

**Context:** Bu urun ayni session'da `POST /Product` ile olusturuldu ve `GET /Product/{id}` ile okunabiliyor. Ayrica 6 malzemenin `parentProductId` alanina bu ID atanmis durumda (6 PUT 204 OK). Yani veri tabaninda KESIN olarak mevcut, ayni tenant icin.

**Root cause tahmini:**
- `BomExplosionService.cs:52` — `allProducts` query'sinde `ParentProductId == parentId` bakiyor ama on-query'de `FirstOrDefault(p => p.Id == parentId)` `HasQueryFilter` (tenant filter) yuzunden bazi state'te farkli bir `DbContext` instance kullaniyor olabilir
- Ya da BomExplosion endpoint'i `X-Tenant-Id` middleware'i sirasinda farkli bir tenant context aliyor (eski cached context)
- Daha buyuk ihtimal: `BomExplosionService` dogrudan `_context.Products` yerine `IProductRepository.GetByIdAsync` kullaniyor ve burada tenant filter skip ediliyor

**Reproduce:**
1. Yeni tenant'ta `POST /Product` ile `ProductType=PRODUCTION_MATERIAL, SupplyType=INNER_SUPPLY` bir urun olustur -> ID al
2. Ayni urunu `GET /Product/{id}` ile ver — 200 OK
3. `GET /BomExplosion/{id}?orderQuantity=5` — 404 "Urun bulunamadi"

**Dosyalar (tahmin):**
- `C:\rynSoft\quvex\smallFactoryApi\src\Quvex.API\Controllers\BomExplosionController.cs:23-25`
- `C:\rynSoft\quvex\smallFactoryApi\src\Quvex.Application\Services\BomExplosionService.cs:44-75`

**Kontrol edilecek:** Hizmet DbContext injection'inda `ITenantContext` dogru aktaraliyor mu, `ExplodeRecursive` cagri zinciri icinde cache kullanilmis mi, service `public` method`ta explicit tenant scope aciliyor mu.

---

## BUG-03: Sales approve sonrasi otomatik Production kaydi olusmuyor (YUKSEK)

**Endpoint:** `PUT /Sales/approve/{id}` (autoTransfer=true)
**Status:** 200 (ama Production listede bulunamadi)
**Severity:** YUKSEK — Satis -> uretim otomatizasyonu copraak, is emri manuel acilmali

**Payload:**
```json
{ "notes": "Roketsan-1 onayli" }
```

**Beklenen:**
`Sales/approve` autoTransfer mekanizmasi ile `POST /Production` cagirmalı; Production listesinde yeni kayit olmali.

**Gerceklesen:**
- `PUT /Sales/approve/{id}` 200 OK
- `GET /Production?pageSize=20` donen listede yeni Roketsan kaydi YOK (0 item veya eski items)

**Reproduce:**
1. Yeni tenant'ta Offer -> OfferProduct -> Sales cycle calistir
2. `PUT /Sales/request-approval/{id}` 200 OK
3. `PUT /Sales/approve/{id}` 200 OK
4. `GET /Production` — liste yeni kayit icermiyor

**Root cause tahmini:**
- `SalesService.ApproveAsync` icinde `autoTransfer=true` default olmasina ragmen, yeni tenant'ta default warehouse eksik oldugu icin transfer silent fail olmus olabilir
- Ya da `productionQuantity` field'i Sales create'te dogru set edilmedi (payload'da `productionQuantity=qty` gonderildi ama service parse etmemis olabilir — farkli case, `ProductionQuantity`)
- Transaction olasi: Sales approve tek basarili ama production create rollback'siz kaldi

**Dosyalar:**
- `C:\rynSoft\quvex\smallFactoryApi\src\Quvex.API\Controllers\SalesController.cs` — approve action
- `C:\rynSoft\quvex\smallFactoryApi\src\Quvex.Application\Services\SalesService.cs` — `ApproveSaleAsync(autoTransfer=true)`

**Kontrol edilecek:** Auto-transfer branch icinde log var mi, response body'de productionId donuyor mu (payload'da yok), default warehouse MAMUL atanmis mi ekmek olmadigi icin burada error yutulmus mu.

---

## BUG-04: `POST /Role` 404 — Role CRUD endpoint'i mevcut degil (ORTA)

**Endpoint:** `POST /Role` ve `GET /Role`
**Status:** 404
**Severity:** ORTA — kullanicilar yeni tenant'a ozel rol yaratamaz

**Payload:**
```json
{"name": "Uretim Muduru", "description": "Uretim Muduru rolu", "permissions": []}
```

**Response:** 404 (sessiz)

**Context:** Register endpoint tenant icin 3 rol seed ediyor: `Admin_{suffix}`, `Manager_{suffix}`, `Operator_{suffix}`. Ancak ekstra rol eklemek icin endpoint yok. `/Role` controller'i Quvex.API\Controllers klasoride yok (grep ile dogrulandi).

**Reproduce:**
1. Yeni tenant'ta yetkili token ile `POST /Role` cagri
2. 404 "Endpoint not found"

**Dosya (eksik):** `C:\rynSoft\quvex\smallFactoryApi\src\Quvex.API\Controllers\RoleController.cs` (mevcut degil)

**Kontrol:** Swagger'da `/Role` altinda endpoint'ler var mi, yoksa yeni bir `RoleController` scaffold edilmeli.

---

## BUG-05: `POST /PurchaseRequest` 404 — SatinAlma Talep modulu yok (ORTA)

**Endpoint:** `POST /PurchaseRequest`
**Status:** 404
**Severity:** ORTA — Satin alma talep -> teklif -> siparis akisi yarim

**Payload:**
```json
{
  "requestDate": "2025-12-26T10:00:00Z",
  "requestedBy": "{userId}",
  "priority": "HIGH",
  "neededBy": "2025-12-28T10:00:00Z",
  "description": "1. tur MLZ-001 tedarik",
  "items": [{"productId": "{id}", "quantity": 10, "unit": "Adet"}]
}
```

**Response:** 404

**Context:** Senaryo Faz 7A'da "SatinAlma -> Satin Alma Talepleri" ekranini kullaniyor (`/purchase-request` UI). Bu endpoint (ya da controller) API'da yok. `POST /PurchaseOrder` calisiyor, ancak talep adimi baslatilamiyor.

**Dosya:** Mevcut degil — `PurchaseRequestController` scaffold gerekli.

---

## BUG-06: `/Bom` endpoint yok, ekrandaki BOM yonetimi icin alternatif eksik (ORTA)

**Endpoint:** `POST /Bom`
**Status:** 404
**Severity:** ORTA — UX acisindan kafa karistirici, BOM tree yonetimi iki farkli patent uzerinden gidiyor

**Context:** BOM mantigi `Product.ParentProductId` uzerinden yoruluyor (test ile dogrulandi: 6/6 child Product'a `parentProductId=durbunId` atamak 204 OK). Ancak:
1. Bu yaklasim "her child TEK bir parent" yapar — many-to-many BOM mumkun degil
2. BOM quantity (`qty=2` gibi) nerede tutuluyor? Testte `bomItems` payload'u PUT'a koyulup 204 OK donduruldu ama degerlerin entity'de nereye maplendigi belirsiz
3. `BomExplosion` endpoint'i `ParentProductId` yaklasimi ile bulabiliyor oldugu halde (BomExplosionService.cs:52) — 404 verdi (BUG-02)

**Beklenen:** Ayni urun iki farkli mamulun parcasi olabilir (MLZ-005 Optik Cam hem durbun hem baska bir urun icin kullanilabilir). Mevcut ParentProductId tek parent kisitlamasi bu case'i kirar.

**Oneri:** `ProductBom` junction entity'si olusturup `/Bom` endpoint'ini POST/GET/DELETE ile sunmak.

---

## BUG-07: `GET /Accounting/aging` ve `/Accounting/exchange-rates` 404 (DUSUK)

**Endpoint:**
- `GET /Accounting/aging` — 404
- `GET /Accounting/exchange-rates` — 404

**Status:** 404
**Severity:** DUSUK — routing mismatch

**Context:**
- `AgingAnalysisController.cs` mevcut (grep ile bulundu) ama `/Accounting/aging` altinda degil, muhtemelen `/AgingAnalysis`
- `ExchangeRate` icin controller adi farkli olmali

**Root cause:** Route prefix yanlis. UI ekranlari `/accounting/aging` path kullaniyor ama API kontrollerinin route'lari `[Route("[controller]")]` yapisi nedeniyle `/AgingAnalysis` gibi isim uretiyor. UI ile API routing mismatch.

**Reproduce:**
1. `GET /Accounting/aging` — 404
2. `GET /AgingAnalysis` — muhtemelen 200

**Oneri:** `AgingAnalysisController` altina `[Route("Accounting/aging")]` alias eklenmeli veya UI service'i dogru path'e yonlendirmeli.

---

## BUG-08: `GET /ProductVariant` 405 Method Not Allowed (DUSUK)

**Endpoint:** `GET /ProductVariant`
**Status:** 405
**Severity:** DUSUK

**Context:** ProductVariantController mevcut (Sprint 11 Dalga 2) ama GET metod endpoint'i yok. Muhtemelen `GET /ProductVariant/{productId}` formunda cagirilmasi gerekiyor.

**Oneri:** Liste endpoint'i eklenebilir (`GET /ProductVariant?productId=...`).

---

## BUG-09: Sprint 11/12 Sunday modulleri canli API'ya deploy edilmemis (BILGI)

**Endpoint'ler (hepsi 404):**
- `GET /ProductionBoard` — Sprint 11 Dalga 3 (Real-time uretim panosu)
- `GET /MachineDowntime` — Sprint 12
- `GET /OrderTrackingLink` — Sprint 12
- `GET /WeldingWps` — Sprint 11 Dalga 2 (Kaynak WPS/WPQR)

**Severity:** BILGI — deploy sprint planina bagli, bu bug degil

**Not:** `/CeTechnicalFile`, `/ShiftHandover`, `/Calibration/equipment` canli ve 200 donuyor.

---

## Ozet

| Bug | Severity | Kategori |
|-----|----------|----------|
| BUG-01 | KRITIK | Auth/User — 500 hata |
| BUG-02 | YUKSEK | BOM — Tenant query hatasi |
| BUG-03 | YUKSEK | Sales -> Production automation |
| BUG-04 | ORTA | Eksik Role CRUD |
| BUG-05 | ORTA | Eksik PurchaseRequest |
| BUG-06 | ORTA | BOM modeli belirsizlik |
| BUG-07 | DUSUK | Routing mismatch |
| BUG-08 | DUSUK | Eksik ProductVariant list |
| BUG-09 | BILGI | Deploy beklentisi |

**Kritik/Yuksek toplam: 3**
**Orta toplam: 3**
**Dusuk toplam: 2**
**Bilgi: 1**
