# [F2-02] KDV Hesaplama Servisi

## Durum: DONE
## Oncelik: KRITIK
## Faz: 2
## Tarih: 2026-03-07

## Aciklama
Merkezi KDV hesaplama servisi. Fatura ve teklif islemlerinde tutarli KDV hesabi.

## Yapilan Isler
- [x] ITaxCalculationService interface + TaxCalculationService
- [x] Satir bazli hesaplama: Quantity * UnitPrice * TaxRate
- [x] Fatura toplami hesaplama: SubTotal, TaxTotal, GrandTotal
- [x] KDV oran bazli dokum (TaxBreakdown) - farkli oranlar ayri gosterilir
- [x] Turkiye KDV oranlari: %1, %10, %20
- [x] 2 ondalik basamak yuvarlama (Math.Round)
- [x] TaxController: /api/Tax/rates ve /api/Tax/calculate endpoint'leri
- [x] 10 test (hesaplama dogrulugu, gruplama, edge case'ler)

## Teknik Detaylar
### Degisen Dosyalar
| Dosya | Degisiklik |
|-------|-----------|
| Services/TaxCalculationService.cs | Yeni - hesaplama servisi + interface + model'ler |
| Controllers/TaxController.cs | Yeni - 2 endpoint (rates, calculate) |
| Program.cs | ITaxCalculationService DI (Singleton) |
| Tests/Services/TaxCalculationServiceTests.cs | 10 test |

### Etki Analizi
- InvoiceService bu servisi kullanacak sekilde refactor edilebilir
- Offer modulu de ayni servisi kullanabilir
- Singleton olarak register edildi (stateless servis)

## Test Sonuclari
133/133 test PASSED (123 mevcut + 10 yeni)

## Commit Bilgisi
[FAZ2][F2-02] KDV hesaplama servisi - merkezi vergi hesabi ve TaxController
