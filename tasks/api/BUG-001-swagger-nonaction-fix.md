# [BUG-001] Swagger 500 — OfferProductController NonAction

## Tur: BUG
## Durum: DONE
## Tarih: 2026-03-23
## Etki Seviyesi: KRITIK

## Sorun
Swagger UI ve `/swagger/v1/swagger.json` endpoint'i 500 donuyordu:
"Ambiguous HTTP method for action — OfferProductController.ChangeOfferProductStatus"

Swagger acilmadan hicbir endpoint dokumantasyonu goruntulenemiyor.

## Kok Neden
`ChangeOfferProductStatus` metodu `public` olarak tanimlanmis ama `[HttpGet/Post/Put/Delete]` attribute'u yok.
Swagger bu metodu endpoint olarak algilayip HTTP method belirsizligi hatasi veriyor.
Metot `SalesController` tarafindan disaridan cagrildigi icin `private` yapilamaz.

## Cozum
Metoda `[NonAction]` attribute eklendi. Bu sayede:
- Swagger metodu endpoint olarak gormez
- Baska controller'lardan erisilebilirlik korunur

## Etki Analizi
- Swagger artik duzgun calisiyor
- SalesController.ChangeOfferProductStatus cagrisi etkilenmedi
- Mevcut testler gecti

## Degisen Dosyalar
| Dosya | Degisiklik |
|-------|-----------|
| src/Quvex.API/Controllers/OfferProductController.cs | `[NonAction]` attribute eklendi (satir 255) |

## Test Sonucu
- 1223/1223 API test passed
- Swagger JSON 200 OK
