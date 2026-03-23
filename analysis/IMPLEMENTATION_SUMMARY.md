# Quvex ERP — PRD İyileştirmeleri Uygulama Özeti

**Tarih:** 2026-03-10
**Durum:** 8/8 iyileştirme tamamlandı

---

## Tamamlanan İyileştirmeler

### A1. Satınalma Siparişi (PO) ✅
**Commit:** `14c1679` (API)

**Yeni dosyalar:**
- `Industry.API/Models/PurchaseOrder.cs` — PO entity (PoNo, SupplierId, Status, OrderDate, toplam tutarlar)
- `Industry.API/Models/PurchaseOrderItem.cs` — PO kalem entity (ProductId, Quantity, ReceivedQuantity, UnitPrice, TaxRate)
- `Industry.API/Constants/PurchaseOrderStatus.cs` — DRAFT → APPROVED → SENT → PARTIALLY_RECEIVED → RECEIVED → CLOSED / CANCELLED
- `Industry.API/Controllers/PurchaseOrderController.cs` — Full CRUD + durum geçişi + mal alım (receive)

**Özellikler:**
- Tedarikçiye formal sipariş belgesi oluşturma
- 7 aşamalı yaşam döngüsü
- Mal alım sırasında otomatik stok girişi ve stok fişi
- StockRequest referansı ile tedarik talebi bağlantısı
- Kalem bazlı KDV hesaplaması

---

### A2. Stok Rezervasyonu ✅
**Commit:** `2fbc271` (API)

**Değişen dosyalar:**
- `Industry.API/Controllers/SalesController.cs` — Sipariş oluşturulduğunda otomatik stok rezervasyonu
- `Industry.API/Controllers/ShippingDetailsController.cs` — Sevkiyat yapıldığında rezerv serbest bırakma
- `Industry.API/Controllers/StockWarehousesController.cs` — StockWarehousesDTO'ya ReservedQuantity + AvailableQuantity
- `Industry.API/Models/DTOs/StockWarehousesDTO.cs` — Yeni alanlar

**Formül:** `Kullanılabilir = Toplam Miktar - Rezerve Miktar`

---

### A3. İade Faturası + Stopaj ✅
**Commit:** `202fce3` (API)

**Yeni dosyalar:**
- `Industry.API/Constants/InvoiceType.cs` — SALES / PURCHASE / CREDIT_NOTE enum

**Değişen dosyalar:**
- `Industry.API/Models/Invoice.cs` — InvoiceType, OriginalInvoiceId, WithholdingTotal alanları
- `Industry.API/Models/InvoiceItem.cs` — WithholdingRate (%50/%70/%90), WithholdingAmount
- `Industry.API/Services/InvoiceService.cs` — Tevkifat hesaplama, iade faturası validasyon, MapToDTO güncelleme
- `Industry.API/Controllers/InvoiceController.cs` — credit-note endpoint
- `Industry.API/Models/DTOs/InvoiceDTO.cs` — InvoiceType, WithholdingTotal, OriginalInvoiceId, OriginalInvoiceNo

**Formül:** `GrandTotal = SubTotal + TaxTotal - WithholdingTotal`

---

### B1. PDF Çıktılar ✅
**Commit:** `fc91656` (API)

**Yeni dosyalar:**
- `Industry.API/Services/PdfService.cs` — QuestPDF ile teklif ve fatura PDF oluşturma
- `Industry.API/Controllers/PdfController.cs` — `/api/Pdf/offer/{id}`, `/api/Pdf/invoice/{id}`

**Bağımlılık:** QuestPDF 2024.3.0 (Community license)

**Endpoint'ler:**
- `GET /api/Pdf/offer/{id}` → Teklif PDF (A4, kalem listesi, toplam tutarlar)
- `GET /api/Pdf/invoice/{id}` → Fatura PDF (satış/iade/alış faturası, tevkifat dahil)

---

### B2. Depolar Arası Transfer ✅
**Commit:** `b4d644c` (API)

**Yeni dosyalar:**
- `Industry.API/Models/StockTransfer.cs` — Transfer entity (TransferNo, kaynak/hedef depo)
- `Industry.API/Models/StockTransferItem.cs` — Transfer kalemi (ProductId, Quantity)
- `Industry.API/Constants/StockTransferStatus.cs` — DRAFT → APPROVED → COMPLETED / CANCELLED
- `Industry.API/Controllers/StockTransferController.cs` — CRUD + approve + cancel

**Özellikler:**
- Tek fiş ile kaynak depodan çıkış, hedef depoya giriş
- Onay sırasında kaynak depoda yeterli stok kontrolü
- Rezerve stok kontrolü (available = total - reserved)

---

### B3. Teklif Geçerlilik Süresi ✅
**Commit:** `65c997c` (API), `27b1373` (UI)

**API değişiklikleri:**
- `Industry.API/Models/Offers.cs` — `ValidUntilDate` (DateOnly?) alanı
- `Industry.API/Models/DTOs/OffersDTO.cs` — Aynı alan DTO'da
- `Industry.API/Controllers/OfferController.cs` — PUT ve CreateRevision'da yeni alan taşınıyor
- EF Migration: `AddOfferValidUntilDate`

**UI değişiklikleri:**
- `src/views/modul/offer/OfferForm.js` — "Geçerlilik Tarihi" DatePicker, başlıkta "Süresi Dolmuş" kırmızı tag
- `src/views/modul/offer/Offer.js` — Listede "Geçerlilik" kolonu (yeşil/kırmızı renk kodu)

---

### C1. Üretimde Kalite Kapısı ✅
**Commit:** `2835ecd` (API)

**Değişen dosyalar:**
- `Industry.API/Models/WorkOrder.cs` — RequiresQualityCheck, QualityCheckApproved, QualityApprovedById, QualityApprovedAt, QualityNotes
- `Industry.API/Controllers/ProductionController.cs` — Kalite kapısı engellemesi + 2 yeni endpoint

**Yeni dosyalar:**
- `Industry.API/Models/DTOs/QualityApprovalDTO.cs`

**Endpoint'ler:**
- `PUT /api/Production/quality-gate/{workOrderId}?required=true` — Adıma kalite kapısı tanımla
- `PUT /api/Production/quality-approve/{workOrderId}` — Kalite onayı ver
- Kalite onayı verilmeden sonraki adıma geçiş engelleniyor

---

### C2. Operasyon Sırası Zorlama ✅
**Commit:** `fc5e3d2` (API)

**Değişen dosyalar:**
- `Industry.API/Controllers/ProductionController.cs` — `IncreaseCompletion` endpoint'inde sıra kontrolü

**Mantık:** Bir iş emri adımında tamamlama girişi yapılmadan önce, önceki adımın (RowNo - 1) tamamen tamamlanmış olması zorunlu. Tamamlanmamışsa `"Önceki adım ({code}) henüz tamamlanmadı. Sıralı ilerlemek zorunludur."` hatası döner.

---

## EF Migrations

Her özellik için ayrı migration oluşturuldu:
1. `AddOfferValidUntilDate` — B3
2. `AddWorkOrderQualityGate` — C1
3. `AddStockTransfer` — B2
4. `AddInvoiceTypeAndWithholding` — A3
5. `AddPurchaseOrder` — A1

**Uygulama:** `dotnet ef database update --project Industry.API/Industry.API.csproj`

---

## Test Sonuçları

| Repo | Sonuç | Not |
|------|-------|-----|
| API | 709/710 ✅ | 1 pre-existing fail: Dockerfile_ShouldHaveHealthCheck |
| UI | 413/413 ✅ | Tüm testler geçiyor |

---

## Commit Geçmişi (kronolojik)

| Repo | Commit | Açıklama |
|------|--------|----------|
| API | `65c997c` | B3: Teklif geçerlilik süresi - API |
| UI | `27b1373` | B3: Teklif geçerlilik süresi - UI |
| API | `fc5e3d2` | C2: Operasyon sırası zorlama |
| API | `2835ecd` | C1: Üretimde kalite kapısı |
| API | `2fbc271` | A2: Stok rezervasyonu |
| API | `b4d644c` | B2: Depolar arası transfer |
| API | `202fce3` | A3: İade faturası + stopaj |
| API | `14c1679` | A1: Satınalma siparişi (PO) |
| API | `fc91656` | B1: PDF çıktılar |
