# Talaşlı İmalat E2E Test — Bug Log

> **Başlangıç:** 2026-04-15
> **Son Güncelleme:** 2026-04-16 (2. tur kapanış)
> **Plan:** `sprints/plans/2026-04-15-talasli-imalat-e2e-test.md`

## Aktif Buglar

| ID | Tenant | Görev | Sorun | Tür | Öncelik | Durum |
|----|--------|-------|-------|-----|---------|-------|
| B03 | T1 | G1 | Provisioning `ProvisioningStatus: "PENDING"` olarak kaydediliyor — Hangfire background job status polling gerektirir, provisioning tamamlanma bildirimi yok | UX | P1 | AÇIK |
| B04 | T1 | G2 | `Machines.Year` alanı domain entity'de `string?` olarak tanımlanmış, `int` bekleniyor — Swagger'dan `year: 2021` integer gönderilince 400 hatası | BUG | P3 | KAPATILDI |
| B07 | T1 | G2-3 | POST /Product alanları dokümantasyonda yanlış: `name`→`productName`, `code`→`productNumber` vb. — API doğru, dokümantasyon güncellenmeli | DOC | P3 | AÇIK |
| B11 | T1/T2 | G8 | PUT /ShopFloor/complete-work/{logId} 404 döndürüyor. Kök neden: ShopFloorController INSERT sorgusunda TenantId eksik → HasQueryFilter log'u bulamıyor | BUG | P1 | KAPATILDI |
| B13 | T1 | G8 | POST /Production/completion/{id} rowNo=-1 ile: productionCompleteQuantity artar, status DONE olur — "üretim başlatma" gibi davranmamalı | BUG | P1 | KAPATILDI |
| B16 | T1/T2 | G11 | POST /SubcontractOrder `orderNumber` zorunlu validation — controller override ediyor ama model binder önce devreye giriyor | BUG | P2 | KAPATILDI |
| B18 | T2 | G17 | POST /SerialNumber/bulk → HTTP 405 Method Not Allowed. Toplu seri no oluşturma endpoint'i yok | EKSİK | P2 | KAPATILDI |
| B19 | T2 | G17 | POST /SerialNumber field adı `sn` ama API `serialNumber` ile de kabul ediyor — fakat boş string kaydedip unique constraint ihlali: "'' seri numarası zaten mevcut" | BUG | P1 | KAPATILDI |
| B20 | T2 | G17 | POST /ShopFloor/submit-measurements → HTTP 404. Endpoint kayıtlı değil veya route mapping bozuk | BUG | P1 | KAPATILDI |
| B21 | T2 | G19 | PUT /Fai/{id}/status JSON body görmezden geliniyor, query param gerekiyor: `?status=APPROVED`. Tutarsız parametre beklentisi | BUG | P2 | KAPATILDI |
| B23 | T2 | G21 | PUT /Ncr/{id}/status → HTTP 404. NCR durum geçişi PUT /Ncr/{id} (body ile) üzerinden yapılmalı — diğer endpoint'lerden farklı pattern | BUG | P2 | KAPATILDI |
| B24 | T2 | G21 | POST /SupplierEvaluation → HTTP 500 server error. Tüm girdilerde aynı hata — muhtemelen FK veya servis exception | BUG | P1 | KAPATILDI |
| B27 | T2 | G18 | POST /SubcontractOrder `processDescription` alanı zorunlu ama dokümantasyonda yok | BUG | P3 | KAPATILDI |
| B28 | T2 | G17 | POST /Production {workorderTemplateId} verildiğinde iş emirleri otomatik oluşmuyor — "İş emri oluşturmalısın!" uyarısı, template bağlantısı çalışmıyor | BUG | P1 | KAPATILDI |
| B29 | T2 | G17 | PUT /Production/{id} body'de bulunmayan alanları sıfırlıyor (PATCH yerine tam overwrite) — workOrderTemplateId siliniyor | BUG | P2 | KAPATILDI |

## Kapalı Buglar (2. Tur — 2026-04-16)

| ID | Tenant | Görev | Sorun | Fix | Kapatılma |
|----|--------|-------|-------|-----|-----------|
| B01 | T1 | G1 | JWT duplicate tenant_id claim `["id","id"]` | `tenant_id` base claims'den kaldırıldı; yalnızca tenantClaims ekler. `tenant_schema` boşsa "public" default | 2026-04-16 |
| B02 | T1 | G1 | `impersonated_by` "anonymous" dönüyor | `ClaimTypes.NameIdentifier` önce deneniyor (JWT sub→NameIdentifier .NET mapping) | 2026-04-16 |
| B05 | T1 | G2 | jwToken tenant endpoint'lerinde reddediliyor | B06 ile aynı kök neden — `tenant_schema` "public" default ile çözüldü | 2026-04-16 |
| B06 | T1/T2 | G1 | jwToken ile 400 "Bu islem bir tenant kapsaminda calisir" | `tenant_schema` claim'i boş string yerine "public" default → TenantResolutionMiddleware JWT path her zaman aktif | 2026-04-16 |
| B08 | T1 | G4 | POST /Product/{id}/bom 404 | `ProductBomAliasController` eklendi: `[Route("Product/{productId}/bom")]` → BomService.CreateAsync | 2026-04-16 |
| B09 | T1 | G5 | POST /ControlPlan `planNumber`/`status` kabul etmiyor | `CreateControlPlanRequest`'e `PlanNumber?` ve `Status?` eklendi; `ControlPlanService.CreateAsync` bunları kullanıyor | 2026-04-16 |
| B10 | T1 | G6 | POST /ControlPlan/{id}/items 404 | `AddItemByPath(Guid id, ...)` alias endpoint eklendi; `id` → `request.ControlPlanId` | 2026-04-16 |
| B12 | T1 | G8 | PUT /Production/{id}/assign-template 404 | Yeni endpoint eklendi: template `IsTemplate=true` ise WorkOrder'ları kopyalar, false ise direkt bağlar | 2026-04-16 |
| B14 | T1 | G8 | WorkOrderTemplates `steps[]` kabul etmiyor | `WorkOrderTemplateDTO.Steps` property eklendi: `WorkOrders` için JSON alias | 2026-04-16 |
| B15 | T1 | G10 | PUT /Capa/{id} `status: "ROOT_CAUSE"` → 500 | `ROOT_CAUSE` → `ROOT_CAUSE_ANALYSIS` alias mapping + `Enum.TryParse` ile 400 döndürülüyor | 2026-04-16 |
| B17 | T1 | G12 | GET /PartCost/estimate her zaman 0 | `product.WorkOrderTemplateId` null ise en son üretim template'i fallback olarak kullanılıyor | 2026-04-16 |
| B22 | T2 | G21 | PUT /Invoice/{id}/status query param çalışmıyor | Query param VE JSON body her ikisi de kabul ediliyor (B21 FAI ile simetrik) | 2026-04-16 |
| B25 | T2 | G21 | /MaintenancePlan 404 | `MaintenanceController`'a `[Route("MaintenancePlan")]` alias eklendi | 2026-04-16 |
| B26 | T2 | G21 | /Shipping, /Shipment 404 | `ShippingDetailsController`'a `[Route("Shipping")]` ve `[Route("Shipment")]` alias eklendi | 2026-04-16 |
| B04 | T1 | G2 | Machines.Year string?→int 400 | `IntOrStringConverter` JsonConverter eklendi, JSON'da 2021 ve "2021" her ikisi de kabul edilir | 2026-04-16 |
| B11 | T1/T2 | G8 | ShopFloor INSERT WorkOrderLogs TenantId eksik | TenantContext inject edildi, INSERT sorgusuna `"TenantId"` kolonu eklendi (start-work ve start-tracking) | 2026-04-16 |
| B13 | T1 | G8 | `rowNo=-1` completion sonrası workOrderNext=null → productionComplete artar | `rowNo=-1` branch'ine erken `return Ok(...)` eklendi, iş emri mantığı çalışmaz | 2026-04-16 |
| B16 | T1/T2 | G11 | SubcontractOrder OrderNumber required validation | `OrderNumber = null!` → `string.Empty` yapıldı, model binder bloklamamaz | 2026-04-16 |
| B18 | T2 | G17 | SerialNumber/bulk 405 | `[HttpPost("bulk")]` alias `/batch` endpoint'ine eklendi | 2026-04-16 |
| B19 | T2 | G17 | SerialNumber empty serial unique constraint | `Create()` başında `string.IsNullOrWhiteSpace(sn.Serial)` 400 validasyonu eklendi | 2026-04-16 |
| B20 | T2 | G17 | POST /ShopFloor/submit-measurements 404 | Yeni `/submit-measurements` (path-param gerektirmeyen) endpoint eklendi: `{workOrderId, measurements:[{characteristicName, measuredValue, isConforming}]}` | 2026-04-16 |
| B21 | T2 | G19 | PUT /Fai/{id}/status JSON body görmezden geliniyor | Query param VE JSON body her ikisi de kabul edilecek şekilde `FaiStatusUpdateRequest` eklendi | 2026-04-16 |
| B23 | T2 | G21 | PUT /Ncr/{id}/status 404 | `PUT /Ncr/{id}/status` endpoint eklendi: `{status, rootCause, correctiveAction}` body'si ile | 2026-04-16 |
| B24 | T2 | G21 | POST /SupplierEvaluation 500 | `Enum.Parse` try-catch ile `ArgumentException` → 400 döndürülür; boş CustomerId ve geçersiz enum değerleri validate edilir | 2026-04-16 |
| B27 | T2 | G18 | SubcontractOrder processDescription zorunlu | `ProcessDescription = null!` → `string?` (nullable) yapıldı | 2026-04-16 |
| B28 | T2 | G17 | POST /Production workOrderTemplateId iş emri oluşturmuyor | `PostProductions`: `WorkOrderTemplateId` verilmişse şablondaki WorkOrder'lar otomatik kopyalanır | 2026-04-16 |
| B29 | T2 | G17 | PUT /Production body WorkOrderTemplateId'yi sıfırlıyor | `WorkOrderTemplateId` yalnızca değer `HasValue` ise güncellenir | 2026-04-16 |

## UX / Eksiklik Notları

| ID | Ekran | Sorun | Öneri | Sprint |
|----|-------|-------|-------|--------|
| U01 | Tenant Kayıt | Provisioning tamamlandığında kullanıcıya bildirim yok | Email + UI polling göstergesi ekle | Sprint 12 |
| U02 | SPC Ekranı | /AdvancedQuality/spc-charts POST endpoint yok, plan dokümanda belgelenmiş | GET /AdvancedQuality/spc/{productId} querystring ile çalışıyor | Sprint 12 |
| U03 | Sevkiyat | Sevkiyat modülü API'de yok — SalesOrder workflow'unda shipped state | Shipping modülü implement edilmeli (G26 B26) | Sprint 12 |
| U04 | Bakım | MaintenancePlan/Maintenance endpoint yok — makine duruş yönetimi yapılamıyor | Makine bakım modülü implement edilmeli | Sprint 12 |
