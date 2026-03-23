# [C1-02] Global Exception Handler Middleware

## Durum: DONE
## Oncelik: KRITIK
## Faz: 1
## Tarih: 2026-03-07

## Aciklama
Tum unhandled exception'lari yakalayan, loglayan ve kullaniciya guvenli response donen
bir middleware. Stack trace ASLA disariya sizdirmaz.

## Yapilan Isler
- [x] ExceptionHandlingMiddleware olusturuldu
- [x] Custom exception siniflari: NotFoundException, ValidationException, UnauthorizedException, BusinessException
- [x] Exception -> HTTP status code mapping (404, 400, 403, 422, 500)
- [x] ErrorResponse DTO tanimlandi
- [x] Program.cs'e middleware eklendi
- [x] 8 adet xUnit testi yazildi

## Teknik Detaylar
### Ne Yapildi
1. Custom Exception siniflari (Exceptions/CustomExceptions.cs):
   - NotFoundException (404) - entity bulunamadi
   - ValidationException (400) - dogrulama hatasi, errors dictionary
   - UnauthorizedException (403) - yetki hatasi
   - BusinessException (422) - is kurali hatasi
2. ErrorResponse DTO (Middleware/ErrorResponse.cs):
   - statusCode, message, errors (opsiyonel validation errors)
3. ExceptionHandlingMiddleware:
   - Exception tipine gore HTTP status code
   - 500 hatalarda generic mesaj (stack trace gizli)
   - 500 hatalarda LogError, diger hatalarda LogWarning
   - camelCase JSON response

### Degisen Dosyalar
| Dosya | Degisiklik |
|-------|-----------|
| Exceptions/CustomExceptions.cs | Yeni - 4 custom exception sinifi |
| Middleware/ErrorResponse.cs | Yeni - hata response DTO |
| Middleware/ExceptionHandlingMiddleware.cs | Yeni - global exception handler |
| Program.cs | UseMiddleware<ExceptionHandlingMiddleware> eklendi |
| Tests/Middleware/ExceptionHandlingMiddlewareTests.cs | 8 yeni test |

### Etki Analizi
- Tum endpoint'ler tutarli hata formati donecek (ErrorResponse)
- Stack trace asla disariya sizdirilmayacak
- Frontend ErrorResponse formatina gore hata gosterebilir
- Service katmaninda throw new NotFoundException() gibi kullanim

## Test Sonuclari
51/51 test PASSED
- ExceptionHandlingMiddlewareTests: 8 test

## Commit Bilgisi
[FAZ1][C1-02] Global Exception Handler - middleware ve custom exception siniflari
