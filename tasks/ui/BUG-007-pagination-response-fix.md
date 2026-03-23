# [BUG-007] UI — 18 Dosyada Pagination Response Uyumsuzlugu

## Tur: BUG
## Durum: DONE
## Tarih: 2026-03-23
## Etki Seviyesi: KRITIK

## Sorun
Stok, Urun, Depo, Fatura, Musteri sayfalarinda dropdown/select listeleri yuklenemiyor:
"Birim listesi yuklenemedi", "Depo listesi yuklenemedi" gibi hatalar.

## Kok Neden
API endpoint'leri paginated response donecek sekilde guncellenmisti:
```json
{ "items": [...], "page": 1, "pageSize": 20, "totalCount": 3 }
```
Ancak UI kodu hala duz array bekliyordu:
```js
response.data.map(u => ...)  // TypeError: response.data.map is not a function
```

## Cozum
18 dosyada `response.data.map()` cagrilari backward-compatible pattern ile degistirildi:
```js
(response.data.items || response.data).map(u => ...)
```
Bu pattern hem paginated hem array response ile calisiyor.

## Etki Analizi
- 12 farkli sayfa/form duzeltildi
- Mevcut paginated tablo (DataTable) componentleri etkilenmedi
- Autocomplete endpoint'leri (POST, array doner) degistirilmedi

## Degisen Dosyalar
| Dosya | Degisiklik |
|-------|-----------|
| views/modul/stock/Stock.js | loadUnits — /Units |
| views/modul/stock/StockForm.js | loadUnits, loadMaterialTypes, loadSuppliers |
| views/modul/stock/stockReceipt/StockReceiptForm.js | loadWarehouses — /Warehouses |
| views/modul/stock/StockTransferForm.js | loadWarehouses, loadProducts |
| views/modul/stock/WarehouseLocations.js | loadWarehouses — length + [0] |
| views/modul/product/ProductForm.js | loadUnits — /Units |
| views/modul/production/UseStockUp.js | loadWarehouses — /Warehouses |
| views/modul/production/EnterCompletion.js | loadMachines — /Machines |
| views/modul/invoice/InvoiceForm.js | loadCustomers — /Customer |
| views/modul/customer/CustomerStatement.js | loadCustomers — /Customer |
| views/modul/purchaseOrder/PurchaseOrderDetail.js | loadWarehouses — /Warehouses |
| views/modul/settings/workOrderTemplates/WorkOrderTemplatesForm.js | loadSteps |
| views/modul/settings/workOrderLogs/WorkOrderLogs.js | loadMachines, loadSteps |
| views/modul/settings/userOperations/UserWorkSelection.js | loadWorklist, loadUserWorklist |

## Test Sonucu
- Vite build basarili (0 error)
- 688/688 Vitest passed
