# Talaşlı İmalat E2E Test Planı

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Hedef:** quvex.io üzerinde 2 talaşlı imalat tenantı sıfırdan oluşturup, her birinde tüm üretim sürecini (teklif→sipariş→malzeme→üretim→kalite→sevkiyat→fatura) uçtan uca çalıştırmak. Bulunan her hata, UX sorunu ve eksikliği kayıt altına alıp düzeltmek.

**Mimari:** Her tenant ayrı PostgreSQL şemasında. API: https://api.quvex.io. Tüm adımlar REST API üzerinden yürütülür, UI davranışı paralel olarak not edilir.

**Tech Stack:** .NET 8 Clean Architecture API, React 18 UI, PostgreSQL, Quvex multi-tenant ERP

---

## Tenant Tanımları

| Tenant | Senaryo | Firma | Kapsam |
|--------|---------|-------|--------|
| **T1** | Küçük CNC Atölye | Demir CNC Hassas İşleme | 8 personel, 5 tezgah, savunma Tier-3 + otomotiv |
| **T2** | Savunma AS9100 | RynSoft Hassas Makine San. A.Ş. | 45 personel, 12 tezgah, TAI/ASELSAN tedarikçisi |

---

## Bug Takip Dosyası

Bulunan her sorun şu dosyaya kaydedilecek:
`C:/rynSoft/quvex/quvex-docs/tests/test-result/TALASLI-IMALAT-BUG-LOG.md`

Format:
```
| ID | Tenant | Adım | Sorun | Tip | Öncelik | Durum |
```

---

## Kimlik Doğrulama Yardımcısı

Her görev başında token yenilenmeli (auth helper):
```bash
RESPONSE=$(curl -s -X POST https://api.quvex.io/Account/authenticate \
  -H "Content-Type: application/json" \
  -H "X-Requested-With: XMLHttpRequest" \
  -d '{"email":"admin@quvex.com","password":"Admin123!@#$"}')
TOKEN=$(echo $RESPONSE | sed 's/.*"refreshToken":"\([^"]*\)".*/\1/')
# Tenant token için impersonation:
TENANT_RESPONSE=$(curl -s -X POST "https://api.quvex.io/admin/tenant/$TENANT_ID/impersonate" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Requested-With: XMLHttpRequest")
TENANT_TOKEN=$(echo $TENANT_RESPONSE | sed 's/.*"refreshToken":"\([^"]*\)".*/\1/')
```

---

## GÖREV 1: Tenant 1 Oluşturma — Demir CNC

**Files:** API only
**Kaynak senaryo:** `KUCUK_CNC_ATOLYE_UCTAN_UCA_TEST.md`

- [ ] **Adım 1.1: Self-register**
```bash
curl -s -X POST https://api.quvex.io/TenantRegistration/self-register \
  -H "Content-Type: application/json" \
  -H "X-Requested-With: XMLHttpRequest" \
  -d '{
    "companyName": "Demir CNC Hassas Isleme",
    "subdomain": "demircnc",
    "firstName": "Ahmet",
    "lastName": "Demir",
    "email": "ahmet@demircnc.com",
    "phone": "5321112233",
    "password": "Test1234!@#$",
    "sector": "CNC"
  }'
```
Beklenen: `{ "succeeded": true, "tenantId": "..." }`
Not al: TENANT_ID_T1

- [ ] **Adım 1.2: Tenant ID ve token kaydet**
```bash
# TENANT_ID_T1 değişkenine ata
# Impersonation token al
```

- [ ] **Adım 1.3: Kayıt doğrula**
```bash
curl -s "https://api.quvex.io/tenant-admin/$TENANT_ID_T1" \
  -H "Authorization: Bearer $SUPER_TOKEN" \
  -H "X-Requested-With: XMLHttpRequest"
```
Beklenen: `{ "name": "Demir CNC Hassas Isleme", "isActive": true }`

- [ ] **Adım 1.4: Tenant login test**
Ahmet'in hesabıyla login:
```bash
curl -s -X POST https://api.quvex.io/Account/authenticate \
  -H "Content-Type: application/json" \
  -H "X-Requested-With: XMLHttpRequest" \
  -H "X-Tenant-Id: $TENANT_ID_T1" \
  -d '{"email":"ahmet@demircnc.com","password":"Test1234!@#$"}'
```

---

## GÖREV 2: Tenant 1 — Fabrika Kurulumu (Makineler)

**Files:** POST /Machines
**Kaynak:** KUCUK senaryo §1.1

- [ ] **Adım 2.1: 5 makine ekle**

Impersonation token ile (TENANT_TOKEN_T1):

Makine T01:
```bash
curl -s -X POST https://api.quvex.io/Machines \
  -H "Authorization: Bearer $TENANT_TOKEN_T1" \
  -H "Content-Type: application/json" \
  -H "X-Requested-With: XMLHttpRequest" \
  -d '{
    "code": "T01",
    "name": "CNC Torna 1",
    "brand": "Doosan",
    "model": "Lynx 220",
    "year": 2021,
    "hourlyRate": 400,
    "setupHourlyRate": 300,
    "description": "2 eksenli CNC torna, max Ø220x300mm"
  }'
```
Not al: T01_ID

Makine T02:
```bash
-d '{"code":"T02","name":"CNC Torna 2","brand":"Mazak","model":"QT-200","year":2019,"hourlyRate":420,"setupHourlyRate":320}'
```

Makine F01:
```bash
-d '{"code":"F01","name":"CNC Freze 1","brand":"Haas","model":"VF-2","year":2020,"hourlyRate":500,"setupHourlyRate":400}'
```

Makine F02:
```bash
-d '{"code":"F02","name":"CNC Freze 2","brand":"Haas","model":"VF-3","year":2021,"hourlyRate":520,"setupHourlyRate":420}'
```

Makine TAS:
```bash
-d '{"code":"TAS","name":"Taslama","brand":"Okamoto","model":"OGM-250","year":2018,"hourlyRate":350,"setupHourlyRate":250}'
```

- [ ] **Adım 2.2: Makine listesini doğrula**
```bash
curl -s https://api.quvex.io/Machines \
  -H "Authorization: Bearer $TENANT_TOKEN_T1" \
  -H "X-Requested-With: XMLHttpRequest"
```
Beklenen: 5 makine listesi

---

## GÖREV 3: Tenant 1 — Operasyon Adımları

**Files:** POST /WorkOrderSteps
**Kaynak:** KUCUK senaryo §1.2

- [ ] **Adım 3.1: 5 operasyon adımı ekle**

OP10:
```bash
curl -s -X POST https://api.quvex.io/WorkOrderSteps \
  -H "Authorization: Bearer $TENANT_TOKEN_T1" \
  -H "Content-Type: application/json" \
  -H "X-Requested-With: XMLHttpRequest" \
  -d '{
    "code": "OP10",
    "name": "CNC Torna",
    "defaultMachineId": "$T01_ID",
    "setupDuration": 20,
    "runDuration": 8,
    "skillLevel": 3,
    "toolingRequired": "CNMG 120408 kesici uc, mandren",
    "toleranceInfo": "Genel tolerans IT7"
  }'
```
Not al: OP10_ID

OP20:
```bash
-d '{"code":"OP20","name":"CNC Freze","defaultMachineId":"$F01_ID","setupDuration":30,"runDuration":12,"skillLevel":3,"toolingRequired":"D10 karbur parmak freze"}'
```

OP30:
```bash
-d '{"code":"OP30","name":"Taslama","defaultMachineId":"$TAS_ID","setupDuration":15,"runDuration":5,"skillLevel":4}'
```

OP40:
```bash
-d '{"code":"OP40","name":"Capak Alma","setupDuration":5,"runDuration":2,"skillLevel":1}'
```

OP50:
```bash
-d '{"code":"OP50","name":"Final Kontrol","setupDuration":10,"runDuration":5,"skillLevel":4}'
```

- [ ] **Adım 3.2: Operasyon listesini doğrula**
```bash
curl -s https://api.quvex.io/WorkOrderSteps \
  -H "Authorization: Bearer $TENANT_TOKEN_T1" \
  -H "X-Requested-With: XMLHttpRequest"
```

---

## GÖREV 4: Tenant 1 — Depo ve Kalibrasyon

- [ ] **Adım 4.1: Depo oluştur**
```bash
curl -s -X POST https://api.quvex.io/Warehouses \
  -H "Authorization: Bearer $TENANT_TOKEN_T1" \
  -H "Content-Type: application/json" \
  -H "X-Requested-With: XMLHttpRequest" \
  -d '{"code":"ANA-DEPO","name":"Ana Depo","description":"Hammadde ve mamul deposu"}'
```
Not al: WAREHOUSE_ID_T1

- [ ] **Adım 4.2: 3 kalibrasyon ekipmanı ekle**

MIK-01:
```bash
curl -s -X POST https://api.quvex.io/Calibration/equipment \
  -H "Authorization: Bearer $TENANT_TOKEN_T1" \
  -H "Content-Type: application/json" \
  -H "X-Requested-With: XMLHttpRequest" \
  -d '{
    "code": "MIK-01",
    "name": "Mikrometre 0-25mm",
    "manufacturer": "Mitutoyo",
    "model": "103-137",
    "accuracy": "0.001mm",
    "calibrationFrequencyMonths": 12
  }'
```
Not al: MIK01_ID

KAL-01:
```bash
-d '{"code":"KAL-01","name":"Kumpas 0-150mm","manufacturer":"Mitutoyo","model":"500-196","accuracy":"0.01mm","calibrationFrequencyMonths":6}'
```

UC-01:
```bash
-d '{"code":"UC-01","name":"Uc Olcer M6","manufacturer":"","model":"Go/NoGo M6","accuracy":"Go/NoGo","calibrationFrequencyMonths":12}'
```

- [ ] **Adım 4.3: Her ekipmana kalibrasyon kaydı ekle**
```bash
curl -s -X POST https://api.quvex.io/Calibration/records \
  -H "Authorization: Bearer $TENANT_TOKEN_T1" \
  -H "Content-Type: application/json" \
  -H "X-Requested-With: XMLHttpRequest" \
  -d '{
    "calibrationEquipmentId": "$MIK01_ID",
    "certificateNumber": "KAL-2026-001",
    "calibrationDate": "2026-01-15T00:00:00",
    "nextCalibrationDate": "2027-01-15T00:00:00",
    "calibratedBy": "Turk Loydu",
    "result": "PASS",
    "notes": "Tum olcumler tolerans icinde"
  }'
```
Aynısını KAL-01 ve UC-01 için tekrarla.

- [ ] **Adım 4.4: Kalibrasyon dashboard doğrula**
```bash
curl -s https://api.quvex.io/Calibration/dashboard \
  -H "Authorization: Bearer $TENANT_TOKEN_T1" \
  -H "X-Requested-With: XMLHttpRequest"
```
Beklenen: `complianceRate: 100`

---

## GÖREV 5: Tenant 1 — Müşteri ve Ürünler

- [ ] **Adım 5.1: ASELSAN müşterisi oluştur**
```bash
curl -s -X POST https://api.quvex.io/Customer \
  -H "Authorization: Bearer $TENANT_TOKEN_T1" \
  -H "Content-Type: application/json" \
  -H "X-Requested-With: XMLHttpRequest" \
  -d '{
    "name": "ASELSAN A.S.",
    "contactName": "Ali Savunma",
    "email": "ali@aselsan.com.tr",
    "phone": "5324445566",
    "address": "ASELSAN Macunkoy Tesisi, Ankara",
    "taxNumber": "9876543210",
    "currency": "TRY",
    "paymentTermDays": 45,
    "category": "A",
    "isCustomer": true
  }'
```
Not al: ASELSAN_ID_T1

- [ ] **Adım 5.2: Hammadde oluştur**
```bash
curl -s -X POST https://api.quvex.io/Product \
  -H "Authorization: Bearer $TENANT_TOKEN_T1" \
  -H "Content-Type: application/json" \
  -H "X-Requested-With: XMLHttpRequest" \
  -d '{
    "name": "St37 Celik Cubuk O30x200mm",
    "code": "HAM-ST37-030200",
    "unit": "Adet",
    "purchasePrice": 85,
    "minStockLevel": 50,
    "productType": "PRODUCTION_MATERIAL",
    "supplyType": 1
  }'
```
Not al: HAM_ID_T1

- [ ] **Adım 5.3: Ana ürün oluştur**
```bash
curl -s -X POST https://api.quvex.io/Product \
  -H "Authorization: Bearer $TENANT_TOKEN_T1" \
  -H "Content-Type: application/json" \
  -H "X-Requested-With: XMLHttpRequest" \
  -d '{
    "name": "ASELSAN Konnektor Pimi",
    "code": "ASL-PIN-2026-001",
    "unit": "Adet",
    "salePrice": 45,
    "requiresQualityControl": true,
    "lotTracking": true,
    "serialTracking": false,
    "productType": "PRODUCTION_MATERIAL",
    "supplyType": 0
  }'
```
Not al: PIN_ID_T1

- [ ] **Adım 5.4: BOM bağlantısı**
```bash
curl -s -X POST https://api.quvex.io/Product/$PIN_ID_T1/bom \
  -H "Authorization: Bearer $TENANT_TOKEN_T1" \
  -H "Content-Type: application/json" \
  -H "X-Requested-With: XMLHttpRequest" \
  -d '[{"childProductId":"$HAM_ID_T1","quantity":1}]'
```

- [ ] **Adım 5.5: Kontrol planı oluştur**
```bash
curl -s -X POST https://api.quvex.io/ControlPlan \
  -H "Authorization: Bearer $TENANT_TOKEN_T1" \
  -H "Content-Type: application/json" \
  -H "X-Requested-With: XMLHttpRequest" \
  -d '{"planNumber":"KP-ASL-001","productId":"$PIN_ID_T1","status":"ACTIVE"}'
```
Not al: CP_ID_T1

- [ ] **Adım 5.6: Kontrol planı kalemleri**
```bash
# Kalem 1
curl -s -X POST https://api.quvex.io/ControlPlan/$CP_ID_T1/items \
  -H "Authorization: Bearer $TENANT_TOKEN_T1" \
  -H "Content-Type: application/json" \
  -H "X-Requested-With: XMLHttpRequest" \
  -d '{"stepNumber":1,"processStep":"OP10 Torna","characteristic":"Dis Cap O6","specification":6.000,"upperTolerance":0.010,"lowerTolerance":0.000,"measurementMethod":"Mikrometre","isCritical":true}'

# Kalem 2
-d '{"stepNumber":2,"processStep":"OP10 Torna","characteristic":"Boy 35","specification":35.000,"upperTolerance":0.050,"lowerTolerance":0.050,"measurementMethod":"Kumpas","isCritical":false}'

# Kalem 3
-d '{"stepNumber":3,"processStep":"OP30 Taslama","characteristic":"Dis Cap O6 h6","specification":6.000,"upperTolerance":0.000,"lowerTolerance":0.008,"measurementMethod":"Mikrometre","isCritical":true}'
```

---

## GÖREV 6: Tenant 1 — Teklif ve Sipariş

- [ ] **Adım 6.1: Teklif oluştur (header)**
```bash
curl -s -X POST https://api.quvex.io/Offer \
  -H "Authorization: Bearer $TENANT_TOKEN_T1" \
  -H "Content-Type: application/json" \
  -H "X-Requested-With: XMLHttpRequest" \
  -d '{
    "customerId": "$ASELSAN_ID_T1",
    "currency": "TRY",
    "validityDays": 30,
    "notes": "Ilk siparis, 30 gun teslimat"
  }'
```
Not al: OFFER_ID_T1

- [ ] **Adım 6.2: Teklif kalemi ekle**
```bash
curl -s -X POST https://api.quvex.io/OfferProduct \
  -H "Authorization: Bearer $TENANT_TOKEN_T1" \
  -H "Content-Type: application/json" \
  -H "X-Requested-With: XMLHttpRequest" \
  -d '{
    "offerId": "$OFFER_ID_T1",
    "productId": "$PIN_ID_T1",
    "quantity": 500,
    "unitPrice": 45
  }'
```
Not al: OFFER_PRODUCT_ID_T1
Beklenen: Toplam 22,500 TL

- [ ] **Adım 6.3: Teklif onayla (ACCEPTED)**
```bash
curl -s -X PUT "https://api.quvex.io/Offer/change-status/$OFFER_ID_T1/2" \
  -H "Authorization: Bearer $TENANT_TOKEN_T1" \
  -H "X-Requested-With: XMLHttpRequest"
```

- [ ] **Adım 6.4: Satış siparişi oluştur**
```bash
curl -s -X POST https://api.quvex.io/Sales \
  -H "Authorization: Bearer $TENANT_TOKEN_T1" \
  -H "Content-Type: application/json" \
  -H "X-Requested-With: XMLHttpRequest" \
  -d '{
    "customerId": "$ASELSAN_ID_T1",
    "offerProductId": "$OFFER_PRODUCT_ID_T1",
    "deliveryDate": "2026-05-15T00:00:00"
  }'
```
Not al: SALES_ID_T1

---

## GÖREV 7: Tenant 1 — Malzeme Tedariki

- [ ] **Adım 7.1: Stok girişi (550 adet)**
```bash
curl -s -X POST https://api.quvex.io/StockReceipts \
  -H "Authorization: Bearer $TENANT_TOKEN_T1" \
  -H "Content-Type: application/json" \
  -H "X-Requested-With: XMLHttpRequest" \
  -d '{
    "warehousesId": "$WAREHOUSE_ID_T1",
    "type": 0,
    "documentNo": "IRS-2026-001",
    "details": [
      {"productId": "$HAM_ID_T1", "quantity": 550, "unitPrice": 85}
    ]
  }'
```

- [ ] **Adım 7.2: Giriş muayenesi**
```bash
curl -s -X POST https://api.quvex.io/IncomingInspection \
  -H "Authorization: Bearer $TENANT_TOKEN_T1" \
  -H "Content-Type: application/json" \
  -H "X-Requested-With: XMLHttpRequest" \
  -d '{
    "productId": "$HAM_ID_T1",
    "lotNumber": "ST37-2026-001",
    "receivedQuantity": 550,
    "acceptedQuantity": 550,
    "rejectedQuantity": 0,
    "result": "PASS",
    "inspectionDate": "2026-04-15T00:00:00",
    "notes": "Tum olcumler tolerans icinde"
  }'
```
Not al: INSPECTION_ID_T1

- [ ] **Adım 7.3: Malzeme sertifikaları (MTR + CoC)**
```bash
# MTR
curl -s -X POST https://api.quvex.io/MaterialCertificate \
  -H "Authorization: Bearer $TENANT_TOKEN_T1" \
  -H "Content-Type: application/json" \
  -H "X-Requested-With: XMLHttpRequest" \
  -d '{
    "incomingInspectionId": "$INSPECTION_ID_T1",
    "certificateNumber": "ST37-MTR-2026-001",
    "certificateType": "MTR",
    "materialSpec": "St37 / DIN EN 10025",
    "lotNumber": "ST37-2026-001",
    "issueDate": "2026-04-01T00:00:00"
  }'

# CoC
-d '{
    "incomingInspectionId": "$INSPECTION_ID_T1",
    "certificateNumber": "ST37-COC-2026-001",
    "certificateType": "CoC",
    "lotNumber": "ST37-2026-001",
    "issueDate": "2026-04-01T00:00:00"
  }'
```

---

## GÖREV 8: Tenant 1 — Üretim Planlama

- [ ] **Adım 8.1: İş emri şablonu oluştur**
```bash
curl -s -X POST https://api.quvex.io/WorkOrderTemplates \
  -H "Authorization: Bearer $TENANT_TOKEN_T1" \
  -H "Content-Type: application/json" \
  -H "X-Requested-With: XMLHttpRequest" \
  -d '{
    "title": "ASL-PIN Konnektor Pimi Operasyon Sirasi",
    "workOrders": [],
    "steps": [
      {"workOrderStepId":"$OP10_ID","order":1,"requiresQualityCheck":true,"estimatedDuration":8,"setupDuration":20},
      {"workOrderStepId":"$OP20_ID","order":2,"prerequisiteOrder":1,"requiresQualityCheck":true,"estimatedDuration":12,"setupDuration":30},
      {"workOrderStepId":"$OP30_ID","order":3,"prerequisiteOrder":2,"requiresQualityCheck":true,"estimatedDuration":5,"setupDuration":15},
      {"workOrderStepId":"$OP40_ID","order":4,"prerequisiteOrder":3,"requiresQualityCheck":false,"estimatedDuration":2,"setupDuration":5},
      {"workOrderStepId":"$OP50_ID","order":5,"prerequisiteOrder":4,"requiresQualityCheck":true,"estimatedDuration":5,"setupDuration":10}
    ]
  }'
```
Not al: TEMPLATE_ID_T1

- [ ] **Adım 8.2: Sipariş onayı — request-approval**
```bash
curl -s -X PUT "https://api.quvex.io/Sales/request-approval/$SALES_ID_T1" \
  -H "Authorization: Bearer $TENANT_TOKEN_T1" \
  -H "X-Requested-With: XMLHttpRequest"
```

- [ ] **Adım 8.3: Sipariş onayı — approve**
```bash
curl -s -X PUT "https://api.quvex.io/Sales/approve/$SALES_ID_T1" \
  -H "Authorization: Bearer $TENANT_TOKEN_T1" \
  -H "Content-Type: application/json" \
  -H "X-Requested-With: XMLHttpRequest" \
  -d '{"notes":"TAI siparisi onaylandi, uretime geciliyor"}'
```

- [ ] **Adım 8.4: Üretim emri oluştur**
```bash
curl -s -X POST "https://api.quvex.io/Production/transfer-from-sale/$SALES_ID_T1" \
  -H "Authorization: Bearer $TENANT_TOKEN_T1" \
  -H "X-Requested-With: XMLHttpRequest"
```
Not al: PRODUCTION_ID_T1

- [ ] **Adım 8.5: İş emri şablonu ata**
```bash
curl -s -X PUT "https://api.quvex.io/Production/$PRODUCTION_ID_T1/assign-template" \
  -H "Authorization: Bearer $TENANT_TOKEN_T1" \
  -H "Content-Type: application/json" \
  -H "X-Requested-With: XMLHttpRequest" \
  -d '{"workorderTemplateId":"$TEMPLATE_ID_T1"}'
```

---

## GÖREV 9: Tenant 1 — Atölye Yürütme (OP10-OP50)

- [ ] **Adım 9.1: WorkOrder ID'lerini çek**
```bash
curl -s "https://api.quvex.io/Production/$PRODUCTION_ID_T1" \
  -H "Authorization: Bearer $TENANT_TOKEN_T1" \
  -H "X-Requested-With: XMLHttpRequest" | node -e "
let d='';process.stdin.on('data',x=>d+=x);process.stdin.on('end',()=>{
  const p=JSON.parse(d);
  (p.workOrders||[]).forEach(w=>console.log(w.order+': '+w.id+' - '+w.stepName));
});"
```
Not al: WO_OP10_ID, WO_OP20_ID, WO_OP30_ID, WO_OP40_ID, WO_OP50_ID

- [ ] **Adım 9.2: OP10 — Başlat**
```bash
curl -s -X POST https://api.quvex.io/ShopFloor/start-work \
  -H "Authorization: Bearer $TENANT_TOKEN_T1" \
  -H "Content-Type: application/json" \
  -H "X-Requested-With: XMLHttpRequest" \
  -d '{"workOrderId":"$WO_OP10_ID","machineId":"$T01_ID"}'
```
Not al: LOG_ID_OP10

- [ ] **Adım 9.3: OP10 — Durdur (sebep testi)**
```bash
curl -s -X POST https://api.quvex.io/ShopFloor/pause-work \
  -H "Authorization: Bearer $TENANT_TOKEN_T1" \
  -H "Content-Type: application/json" \
  -H "X-Requested-With: XMLHttpRequest" \
  -d '{"workOrderLogId":"$LOG_ID_OP10","reason":"TOOL_CHANGE","note":"Kesici uc degisimi"}'
```

- [ ] **Adım 9.4: OP10 — Devam et**
```bash
curl -s -X POST https://api.quvex.io/ShopFloor/resume-work \
  -H "Authorization: Bearer $TENANT_TOKEN_T1" \
  -H "Content-Type: application/json" \
  -H "X-Requested-With: XMLHttpRequest" \
  -d '{"workOrderLogId":"$LOG_ID_OP10"}'
```

- [ ] **Adım 9.5: OP10 — Tamamla (adet gir)**
```bash
curl -s -X PUT "https://api.quvex.io/ShopFloor/complete-work/$LOG_ID_OP10" \
  -H "Authorization: Bearer $TENANT_TOKEN_T1" \
  -H "Content-Type: application/json" \
  -H "X-Requested-With: XMLHttpRequest" \
  -d '{"quantity":500,"scrapQuantity":0}'
```

- [ ] **Adım 9.6: OP10 — Ölçüm gönder**
```bash
curl -s -X POST "https://api.quvex.io/ShopFloor/submit-measurements/$WO_OP10_ID" \
  -H "Authorization: Bearer $TENANT_TOKEN_T1" \
  -H "Content-Type: application/json" \
  -H "X-Requested-With: XMLHttpRequest" \
  -d '{
    "measurements": [
      {"controlPlanItemId":"$CP_ITEM1_ID","measuredValue":6.005,"result":"PASS"},
      {"controlPlanItemId":"$CP_ITEM2_ID","measuredValue":34.98,"result":"PASS"}
    ]
  }'
```

- [ ] **Adım 9.7: OP20-OP50 aynı akışı tekrarla**
Her operasyon için: start-work → complete-work → submit-measurements
OP40 için ölçüm gönderme yok (RequiresQualityCheck=false)

---

## GÖREV 10: Tenant 1 — Kalite Olayları (NCR + CAPA)

- [ ] **Adım 10.1: NCR oluştur (OP30 hatalı parça)**
```bash
curl -s -X POST https://api.quvex.io/Ncr \
  -H "Authorization: Bearer $TENANT_TOKEN_T1" \
  -H "Content-Type: application/json" \
  -H "X-Requested-With: XMLHttpRequest" \
  -d '{
    "severity": "MINOR",
    "productId": "$PIN_ID_T1",
    "productionId": "$PRODUCTION_ID_T1",
    "affectedQuantity": 3,
    "description": "OP30 taslamada 3 parca tolerans disina cikti. Taslik asinmasi.",
    "detectedDate": "2026-04-15T00:00:00"
  }'
```
Not al: NCR_ID_T1

- [ ] **Adım 10.2: NCR workflow — UNDER_REVIEW**
```bash
curl -s -X PUT "https://api.quvex.io/Ncr/$NCR_ID_T1/status" \
  -H "Authorization: Bearer $TENANT_TOKEN_T1" \
  -H "Content-Type: application/json" \
  -H "X-Requested-With: XMLHttpRequest" \
  -d '{"status":"UNDER_REVIEW"}'
```

- [ ] **Adım 10.3: NCR — Kök neden ve CORRECTIVE_ACTION**
```bash
curl -s -X PUT "https://api.quvex.io/Ncr/$NCR_ID_T1/disposition" \
  -H "Authorization: Bearer $TENANT_TOKEN_T1" \
  -H "Content-Type: application/json" \
  -H "X-Requested-With: XMLHttpRequest" \
  -d '{
    "rootCause": "Taslik asinma limiti asilmis, dressleme peryodu kacirilmis",
    "correctiveAction": "Taslik dressleme peryodu 50 parcadan 30 parcaya dusuruldu",
    "preventiveAction": "Bakim planina taslik dressleme hatirlatmasi eklendi",
    "status": "CORRECTIVE_ACTION"
  }'
```

- [ ] **Adım 10.4: NCR — CLOSED**
```bash
curl -s -X PUT "https://api.quvex.io/Ncr/$NCR_ID_T1/status" ... '{"status":"CLOSED"}'
```

- [ ] **Adım 10.5: Kök neden olmadan kapatmayı dene (negatif test)**
```bash
# Kök neden BOŞ iken CLOSED'a geçmeye çalış → HATA vermeli
curl -s -X POST https://api.quvex.io/Ncr \
  ... '{"severity":"MINOR","description":"test"}' 
# Sonra direkt CLOSED → 400 Bad Request bekliyoruz
```

- [ ] **Adım 10.6: CAPA oluştur**
```bash
curl -s -X POST https://api.quvex.io/Capa \
  -H "Authorization: Bearer $TENANT_TOKEN_T1" \
  -H "Content-Type: application/json" \
  -H "X-Requested-With: XMLHttpRequest" \
  -d '{
    "type": "CORRECTIVE",
    "sourceType": "NCR",
    "sourceId": "$NCR_ID_T1",
    "priority": "HIGH",
    "description": "Taslik asinma kontrolu yetersiz, dressleme peryodu kacirildi",
    "rootCause": "Bakim planinda taslik dressleme tanimli degil",
    "rootCauseMethod": "5_WHY",
    "proposedAction": "Bakim planina ekleme + operator egitimi",
    "dueDate": "2026-04-25T00:00:00"
  }'
```

---

## GÖREV 11: Tenant 1 — Fason İş (Isıl İşlem)

- [ ] **Adım 11.1: Fason tedarikçi müşterisi oluştur**
```bash
curl -s -X POST https://api.quvex.io/Customer \
  ... '{"name":"Isil Islem A.S.","isSupplier":true,"isCustomer":false, ...}'
```
Not al: SUPPLIER_ID_T1

- [ ] **Adım 11.2: Fason sipariş oluştur**
```bash
curl -s -X POST https://api.quvex.io/SubcontractOrder \
  -H "Authorization: Bearer $TENANT_TOKEN_T1" \
  -H "Content-Type: application/json" \
  -H "X-Requested-With: XMLHttpRequest" \
  -d '{
    "productionId": "$PRODUCTION_ID_T1",
    "productId": "$PIN_ID_T1",
    "processType": "HEAT_TREATMENT",
    "processDescription": "Isil islem 860°C / su verme + 180°C mentesit",
    "sentQuantity": 500,
    "orderedQuantity": 500,
    "unitPrice": 3,
    "currency": "TRY",
    "expectedReturnDate": "2026-04-22T00:00:00",
    "requiresInspection": true
  }'
```
Not al: SUBCONTRACT_ID_T1

- [ ] **Adım 11.3: Durum akışı DRAFT→SENT→AT_SUPPLIER→COMPLETED→INSPECTED**
```bash
# SENT
curl -s -X PUT "https://api.quvex.io/SubcontractOrder/$SUBCONTRACT_ID_T1/status" \
  ... '{"status":"SENT","shipmentDate":"2026-04-15T00:00:00"}'
# AT_SUPPLIER
... '{"status":"AT_SUPPLIER"}'
# COMPLETED
... '{"status":"COMPLETED","receivedQuantity":500}'
# INSPECTED
... '{"status":"INSPECTED","inspectionNotes":"Sertlik HRC 58-60 araliginda, spec dahilinde"}'
```

---

## GÖREV 12: Tenant 1 — Final Muayene, Sevkiyat, Fatura

- [ ] **Adım 12.1: Final muayene**
```bash
curl -s -X POST https://api.quvex.io/FinalInspectionRelease \
  -H "Authorization: Bearer $TENANT_TOKEN_T1" \
  -H "Content-Type: application/json" \
  -H "X-Requested-With: XMLHttpRequest" \
  -d '{
    "productionId": "$PRODUCTION_ID_T1",
    "result": "APPROVED",
    "notes": "Tum boyutlar tolerans icinde, gorsel uygun",
    "inspectionDate": "2026-04-15T00:00:00"
  }'
```

- [ ] **Adım 12.2: Sevkiyat**
```bash
curl -s -X POST https://api.quvex.io/ShippingDetails \
  -H "Authorization: Bearer $TENANT_TOKEN_T1" \
  -H "Content-Type: application/json" \
  -H "X-Requested-With: XMLHttpRequest" \
  -d '{
    "productionId": "$PRODUCTION_ID_T1",
    "waybillNumber": "DMR-IRS-2026-001",
    "quantity": 500,
    "shippingDate": "2026-04-15T00:00:00",
    "packagingType": "Kutulu"
  }'
```

- [ ] **Adım 12.3: Fatura**
```bash
curl -s -X POST https://api.quvex.io/Invoice \
  -H "Authorization: Bearer $TENANT_TOKEN_T1" \
  -H "Content-Type: application/json" \
  -H "X-Requested-With: XMLHttpRequest" \
  -d '{
    "customerId": "$ASELSAN_ID_T1",
    "salesId": "$SALES_ID_T1",
    "invoiceType": "SALES",
    "currency": "TRY",
    "vatRate": 20,
    "items": [
      {"productId":"$PIN_ID_T1","quantity":500,"unitPrice":45,"description":"ASELSAN Konnektor Pimi"}
    ]
  }'
```
Beklenen: items toplam 22,500 TL + KDV 4,500 = 27,000 TL

- [ ] **Adım 12.4: Maliyet analizi**
```bash
curl -s "https://api.quvex.io/PartCost/$PRODUCTION_ID_T1" \
  -H "Authorization: Bearer $TENANT_TOKEN_T1" \
  -H "X-Requested-With: XMLHttpRequest"
```
Beklenen: Malzeme + işçilik + makine + genel gider kırılımı

- [ ] **Adım 12.5: Dashboard kontrol**
```bash
curl -s https://api.quvex.io/dashboard \
  -H "Authorization: Bearer $TENANT_TOKEN_T1" \
  -H "X-Requested-With: XMLHttpRequest"
```

---

## GÖREV 13: Tenant 2 Oluşturma — RynSoft Hassas Makine

**Kaynak senaryo:** `E2E_DEFENSE_CNC_TEST_SCENARIO.md` + `SAVUNMA_CNC_ADIM_ADIM_TEST_REHBERI.md`

Bu senaryo daha karmaşık: AS9100, FAI (AS9102), Seri numarası, SPC, Cp/Cpk, kapasite planı

- [ ] **Adım 13.1: Self-register**
```bash
curl -s -X POST https://api.quvex.io/TenantRegistration/self-register \
  -H "Content-Type: application/json" \
  -H "X-Requested-With: XMLHttpRequest" \
  -d '{
    "companyName": "RynSoft Hassas Makine San. A.S.",
    "subdomain": "rynsofthm",
    "firstName": "Hakan",
    "lastName": "Demir",
    "email": "hakan@rynsofthm.com",
    "phone": "5321234567",
    "password": "Rynsoft1234!@#$",
    "sector": "CNC_DEFENSE"
  }'
```
Not al: TENANT_ID_T2

---

## GÖREV 14: Tenant 2 — Sistem Kurulumu (6 Makine, 7 Operasyon)

**Kaynak:** E2E_DEFENSE senaryo §0.1-0.4

- [ ] **Adım 14.1: 6 makine ekle**

CNC-T01 (Mazak QT-250):
```bash
-d '{"code":"CNC-T01","name":"Mazak QT-250 CNC Torna","brand":"Mazak","model":"QT-250","year":2019,"hourlyRate":450,"setupHourlyRate":350}'
```
CNC-T02 (Doosan Lynx 220):
```bash
-d '{"code":"CNC-T02","name":"Doosan Lynx 220 CNC Torna","brand":"Doosan","model":"Lynx 220","year":2021,"hourlyRate":400,"setupHourlyRate":300}'
```
CNC-F01 (Haas VF-2):
```bash
-d '{"code":"CNC-F01","name":"Haas VF-2 CNC Freze","brand":"Haas","model":"VF-2","year":2020,"hourlyRate":500,"setupHourlyRate":400}'
```
CNC-F02 (Mazak VCN-530C):
```bash
-d '{"code":"CNC-F02","name":"Mazak VCN-530C CNC Freze","brand":"Mazak","model":"VCN-530C","year":2022,"hourlyRate":550,"setupHourlyRate":450}'
```
TAS-01 (Okamoto OGM-250):
```bash
-d '{"code":"TAS-01","name":"Okamoto OGM-250 Silindirik Taslama","brand":"Okamoto","model":"OGM-250","year":2018,"hourlyRate":350,"setupHourlyRate":250}'
```
TAS-02 (Chevalier FSG-1224):
```bash
-d '{"code":"TAS-02","name":"Chevalier FSG-1224 Duz Taslama","brand":"Chevalier","model":"FSG-1224","year":2017,"hourlyRate":300,"setupHourlyRate":200}'
```

- [ ] **Adım 14.2: 7 operasyon adımı ekle (OP10-OP70)**
(Görev 3'teki format, T2 token ve 7 adım)

- [ ] **Adım 14.3: 3 genel gider kalemi**
```bash
curl -s -X POST https://api.quvex.io/PartCost/overheads \
  -H "Authorization: Bearer $TENANT_TOKEN_T2" \
  ... '[
    {"name":"Genel Imalat Giderleri","percentage":25,"effectiveFrom":"2026-01-01"},
    {"name":"Amortisman","percentage":10,"effectiveFrom":"2026-01-01"},
    {"name":"Enerji","percentage":8,"effectiveFrom":"2026-01-01"}
  ]'
```

- [ ] **Adım 14.4: 6 kalibrasyon ekipmanı + kayıtları**
(MIK-001, MIK-002, KAL-001, UC-001, CMM-001, YUZ-001 — E2E_DEFENSE §0.4)

---

## GÖREV 15: Tenant 2 — Müşteri, Ürün, Kontrol Planı, Şablon

- [ ] **Adım 15.1: TAI müşterisi** (USD, 60 gün vade, kategori A)
- [ ] **Adım 15.2: 7075-T6 hammadde** (AMS 4078, 320 TL)
- [ ] **Adım 15.3: Hidrolik Manifold Blogu** (TAI-2026-0142, seri takip, FAI gerekli)
- [ ] **Adım 15.4: BOM** (1x hammadde + 1x kaplama fason hizmet)
- [ ] **Adım 15.5: 10 kalemli kontrol planı** (E2E_DEFENSE §2.2 tablosu)
- [ ] **Adım 15.6: 7 adımlı iş emri şablonu** (OP10-OP70 prerequisite zinciri)

---

## GÖREV 16: Tenant 2 — Teklif→Sipariş→Satın Alma→Stok

- [ ] **Adım 16.1: Teklif** (TKL-2026-0089, 60 adet, $85/adet = $5,100)
- [ ] **Adım 16.2: Sipariş** (SIP-2026-0142, teslimat 45 gün)
- [ ] **Adım 16.3: Satın alma talebi** (65 adet hammadde)
- [ ] **Adım 16.4: Stok girişi** (65 adet, lot: ALC-2026-0487)
- [ ] **Adım 16.5: Giriş muayenesi** (AQL 1.0, 8 numune, PASS)
- [ ] **Adım 16.6: 2 sertifika** (MTR + CoC)

---

## GÖREV 17: Tenant 2 — Üretim + Seri Numara + OP10-OP70

- [ ] **Adım 17.1: Üretim emri** (60 adet, 7 WorkOrder)
- [ ] **Adım 17.2: 60 seri numarası** (TAI-0142-001 → TAI-0142-060)
- [ ] **Adım 17.3: OP10 — Başlat, tamamla, 3 ölçüm gir**
- [ ] **Adım 17.4: OP20 — Önkoşul kontrolu, 4 ölçüm**
- [ ] **Adım 17.5: OP30 — h6 tolerans, silindiriklik**
- [ ] **Adım 17.6: OP40 — Çapak alma (ölçüm yok)**
- [ ] **Adım 17.7: OP50 — CMM ölçüm**

---

## GÖREV 18: Tenant 2 — Fason Kaplama (Kadmiyum)

- [ ] **Adım 18.1: Fason sipariş** (SURFACE_COATING, NADCAP onayli tedarikçi)
- [ ] **Adım 18.2: DRAFT→SENT→AT_SUPPLIER→COMPLETED→INSPECTED**
- [ ] **Adım 18.3: Kaplama sertifikası yükle**

---

## GÖREV 19: Tenant 2 — FAI (AS9102)

- [ ] **Adım 19.1: FAI kaydı** (FULL, NEW_PART, 3 seri no)
- [ ] **Adım 19.2: 9 karakteristik** (KC işaretlileri dahil)
- [ ] **Adım 19.3: APPROVED + PDF**
```bash
curl -s "https://api.quvex.io/Fai/$FAI_ID/report/pdf" \
  -H "Authorization: Bearer $TENANT_TOKEN_T2" \
  -H "X-Requested-With: XMLHttpRequest" \
  -o /tmp/fai-report.pdf
```
Beklenen: 200 OK, PDF dosyası

---

## GÖREV 20: Tenant 2 — SPC + Cp/Cpk

- [ ] **Adım 20.1: SPC kartı oluştur** (X-bar R, Ø25 h6, 12 alt grup)
```bash
curl -s -X POST https://api.quvex.io/AdvancedQuality/spc-charts \
  -H "Authorization: Bearer $TENANT_TOKEN_T2" \
  -H "Content-Type: application/json" \
  -H "X-Requested-With: XMLHttpRequest" \
  -d '{
    "chartName": "OP30 Dis Cap O25 h6",
    "chartType": "X_BAR_R",
    "productId": "$MANIFOLD_ID_T2",
    "measurementName": "Dis Cap (mm)",
    "usl": 25.000,
    "lsl": 24.987,
    "target": 24.993,
    "subgroupSize": 5,
    "dataPoints": [
      [24.994, 24.996, 24.993, 24.995, 24.991],
      [24.992, 24.995, 24.994, 24.993, 24.996],
      [24.993, 24.994, 24.996, 24.992, 24.995],
      [24.995, 24.993, 24.991, 24.994, 24.996],
      [24.994, 24.993, 24.995, 24.992, 24.994],
      [24.996, 24.994, 24.993, 24.995, 24.992],
      [24.993, 24.995, 24.994, 24.996, 24.993],
      [24.994, 24.992, 24.995, 24.993, 24.994],
      [24.995, 24.994, 24.993, 24.996, 24.992],
      [24.993, 24.995, 24.994, 24.993, 24.995],
      [24.994, 24.996, 24.992, 24.994, 24.993],
      [24.995, 24.993, 24.994, 24.996, 24.994]
    ]
  }'
```

- [ ] **Adım 20.2: Cp/Cpk hesapla**
```bash
curl -s -X POST https://api.quvex.io/AdvancedQuality/process-capability/calculate \
  ... '{"spcChartId":"$SPC_ID","usl":25.000,"lsl":24.987}'
```
Beklenen: Cp >= 1.33, Cpk >= 1.33

---

## GÖREV 21: Tenant 2 — Final + Sevkiyat + Fatura + Bakım

- [ ] **Adım 21.1: Final muayene** (OP70)
- [ ] **Adım 21.2: Sevkiyat** (ESD paketleme, CoC + FAI + MTR + kaplama sertifikası)
- [ ] **Adım 21.3: Fatura** ($5,100 + KDV = $6,120, 60 gün vade)
- [ ] **Adım 21.4: NCR** (MAJOR — Ø24.980 hatalı parça, hurda kararı)
- [ ] **Adım 21.5: CAPA** (5 Neden, 6 adım workflow)
- [ ] **Adım 21.6: Bakım planı** (CNC-T01 önleyici bakım)
- [ ] **Adım 21.7: Maliyet analizi** (gerçekleşen vs tahmin)
- [ ] **Adım 21.8: Executive dashboard** (OEE, NCR, zamanında teslimat)
- [ ] **Adım 21.9: Tedarikçi değerlendirme** (Alcoa + Yılmaz Kaplama)

---

## GÖREV 22: Bug Log Güncelleme ve Düzeltme

Her görevde bulunan sorunlar şu formatta kayıt altına alınacak:

**Dosya:** `C:/rynSoft/quvex/quvex-docs/tests/test-result/TALASLI-IMALAT-BUG-LOG.md`

```markdown
| ID | Tenant | Görev | Sorun Tanımı | Tür | Öncelik | Durum |
|----|--------|-------|--------------|-----|---------|-------|
| B01 | T1 | Görev 1 | TenantRegistration endpoint path yanlış | BUG | P0 | AÇIK |
| U01 | T1 | Görev 2 | Makine formu hourlyRate yerine hourly_rate kabul ediyor | UX | P1 | AÇIK |
| E01 | T2 | Görev 14 | PartCost/overheads endpoint 404 | EKSİK | P0 | AÇIK |
```

**Düzeltme prioritesi:**
- **P0 (Kritik):** Akışı durduruyor → Aynı gün düzelt + commit
- **P1 (Yüksek):** Çalışıyor ama yanlış → Sonraki commit'te düzelt
- **P2 (Orta):** UX sorunu → Sprint backlog'a ekle
- **P3 (Düşük):** İyileştirme → Gelecek sprintte

---

## GÖREV 23: Test Sonuç Raporu

**Dosya:** `C:/rynSoft/quvex/quvex-docs/tests/test-result/TALASLI-IMALAT-TEST-SONUCU.md`

Rapor içeriği:
- Tenant 1 özeti: kaç adım geçti/kaldı
- Tenant 2 özeti: kaç adım geçti/kaldı
- Toplam bug sayısı (P0/P1/P2/P3)
- AS9100 uyumluluk skoru
- UI/UX sorunları listesi
- Sonraki sprint için öneriler

---

## Self-Review Notları

**Kapsam kontrol:**
- [x] Tüm 31 küçük CNC adımı ele alındı (Görev 1-12)
- [x] Tüm 39 büyük savunma adımı ele alındı (Görev 13-21)
- [x] AS9100 uyumluluk maddeleri (8.2.3, 8.4.1, 8.5.1, 8.5.2, 8.6, 8.7, 9.1.1, 10.2)
- [x] FAI (AS9102) akışı (Görev 19)
- [x] SPC + Cp/Cpk (Görev 20)
- [x] Fason iş akışı (Görev 11, 18)
- [x] NCR + CAPA workflow (Görev 10, 21)
- [x] Bug takip sistemi (Görev 22)
- [x] Final rapor (Görev 23)

**Eksik kontrol:**
- Tedarikçi değerlendirme endpoint'i doğrulanmadı
- Contract Review endpoint'i (Görev 15'e eklenebilir)
- Kapasite planlaması endpoint'i test edilmedi
- Seri numara atama endpoint'i doğrulanmadı

**API alan adları (bilinen sorunlar):**
- `calibrationEquipmentId` (equipmentId değil)
- `workorderTemplateId` (küçük 'o')
- `items` (invoiceItems değil)
- İş emri şablonu: `title` (name değil)
- `workOrders: []` boş array zorunlu
