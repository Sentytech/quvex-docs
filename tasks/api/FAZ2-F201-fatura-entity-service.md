# [F2-01] Fatura Entity + Service + Controller

## Durum: DONE
## Oncelik: KRITIK
## Faz: 2
## Tarih: 2026-03-07

## Aciklama
Tam donanimli Fatura (Invoice) entity, service ve controller.

## Yapilan Isler
- [x] Invoice entity (fatura basligi: numara, tarih, vade, toplam, durum, odenen)
- [x] InvoiceItem entity (kalem: urun, miktar, birim fiyat, KDV, satir toplami)
- [x] InvoiceStatus enum (Draft, Sent, Paid, PartiallyPaid, Overdue, Cancelled)
- [x] PaymentMethod enum (Cash, BankTransfer, CreditCard, Check)
- [x] IInvoiceService interface + InvoiceService (CRUD + durum yonetimi)
- [x] InvoiceController (7 endpoint: CRUD + status + next-number + by-customer)
- [x] InvoiceDTO, CreateInvoiceRequest, UpdateInvoiceRequest
- [x] FluentValidation: CreateInvoiceRequestValidator, CreateInvoiceItemRequestValidator, UpdateInvoiceRequestValidator
- [x] DbContext guncellendi (Invoices, InvoiceItems DbSet + InvoiceStatus enum conversion)
- [x] Program.cs DI registration
- [x] 18 test (13 service + 5 validator)

## Teknik Detaylar
### Entity Tasarimi
- Invoice: CustomerId FK, InvoiceNo (otomatik FTR-YYYY-NNNNN), InvoiceDate, DueDate, Status, SubTotal, TaxTotal, GrandTotal, PaidAmount, Notes
- InvoiceItem: InvoiceId FK, ProductId FK (opsiyonel), ProductionId FK (opsiyonel), Description, Quantity, UnitPrice, TaxRate, LineTotal, TaxAmount
- Her iki entity BaseFullModel<Guid>'den turetildi (audit trail)

### Is Kurallari
- Sadece DRAFT faturalar duzenlenebilir/silinebilir
- Durum gecis kurallari: DRAFT->SENT->PAID (valid), DRAFT->PAID (invalid)
- KDV otomatik hesaplama: LineTotal * TaxRate/100
- Fatura numarasi yil bazli ardisik: FTR-2026-00001

### Degisen Dosyalar
| Dosya | Degisiklik |
|-------|-----------|
| Models/Invoice.cs | Yeni entity |
| Models/InvoiceItem.cs | Yeni entity |
| Constants/InvoiceStatus.cs | Yeni enum |
| Constants/PaymentMethod.cs | Yeni enum |
| Models/DTOs/InvoiceDTO.cs | Yeni - DTO'lar ve request modeller |
| Interfaces/IInvoiceService.cs | Yeni interface |
| Services/InvoiceService.cs | Yeni service |
| Controllers/InvoiceController.cs | Yeni controller (7 endpoint) |
| Validators/InvoiceValidators.cs | Yeni - 3 validator |
| DataAccess/IndustryDBContext.cs | Invoices/InvoiceItems DbSet + enum conversion |
| Program.cs | IInvoiceService DI |
| Tests/Services/InvoiceServiceTests.cs | 18 test |

### API Endpoints
| Method | Path | Aciklama |
|--------|------|---------|
| GET | /api/Invoice | Tum faturalar |
| GET | /api/Invoice/{id} | Fatura detay |
| GET | /api/Invoice/by-customer/{id} | Musteriye ait faturalar |
| POST | /api/Invoice | Yeni fatura olustur |
| PUT | /api/Invoice | Fatura guncelle (sadece DRAFT) |
| DELETE | /api/Invoice/{id} | Fatura sil (sadece DRAFT) |
| PUT | /api/Invoice/{id}/status | Durum degistir |
| GET | /api/Invoice/next-number | Sonraki fatura numarasi |

### Etki Analizi
- 2 yeni tablo: Invoices, InvoiceItems (migration gerekecek)
- Mevcut ProductionBillingDetails ile bagimsiz - gelecekte entegre edilebilir
- Customer FK ile iliskili

## Test Sonuclari
123/123 test PASSED (105 mevcut + 18 yeni)

## Commit Bilgisi
[FAZ2][F2-01] Fatura modulu - Invoice entity, service, controller ve validasyonlar
