# Quvex ERP — Bulk Insert Test Sonuçları
> Tarih: 2026-03-20
> Toplam: 1500 test | Başarılı: 946 | Hatalı: 73

## Özet

| Modül | Ekran | Toplam | Başarılı | Hata |
|-------|-------|--------|----------|------|
| Ayarlar | Birimler | 100 | 99 | 1 |
| Ayarlar | Makineler | 100 | 99 | 1 |
| Stok | Ürünler | 100 | 9 | 11 |
| Stok | Depolar | 100 | 98 | 2 |
| Satış | Müşteriler | 100 | 98 | 2 |
| Satınalma | Tedarikçiler | 100 | 98 | 2 |
| Satış | Teklifler | 100 | 0 | 11 |
| Satış | Teklif Ürünleri | 100 | 0 | 1 |
| Satınalma | Satınalma Siparişleri | 100 | 0 | 11 |
| Muhasebe | Faturalar | 100 | 98 | 2 |
| Kalite | Kalibrasyon Ekipmanı | 100 | 28 | 11 |
| Kalite | Giriş Kontrol | 100 | 98 | 2 |
| Bakım | Bakım Planları | 100 | 26 | 11 |
| Bakım | Arıza Raporları | 100 | 98 | 2 |
| İK | Vardiyalar | 100 | 97 | 3 |

## Hata Detayları

| Modül | Ekran | # | HTTP | Hata |
|-------|-------|---|------|------|
| Ayarlar | Birimler | 100 | 429 | Cok fazla istek gonderdiniz. Lutfen bekleyiniz. |
| Ayarlar | Makineler | 1 | 429 | Cok fazla istek gonderdiniz. Lutfen bekleyiniz. |
| Stok | Ürünler | 2 | 429 | Cok fazla istek gonderdiniz. Lutfen bekleyiniz. |
| Stok | Ürünler | 3 | 429 | Cok fazla istek gonderdiniz. Lutfen bekleyiniz. |
| Stok | Ürünler | 4 | 400 | {"type":"https://tools.ietf.org/html/rfc9110#section-15.5.1","title":"One or more validation errors occurred.","status":400,"errors":{"$.supplyType":["The JSON value could not be converted to System.N |
| Stok | Ürünler | 6 | 400 | {"type":"https://tools.ietf.org/html/rfc9110#section-15.5.1","title":"One or more validation errors occurred.","status":400,"errors":{"$.supplyType":["The JSON value could not be converted to System.N |
| Stok | Ürünler | 7 | 400 | {"type":"https://tools.ietf.org/html/rfc9110#section-15.5.1","title":"One or more validation errors occurred.","status":400,"errors":{"$.supplyType":["The JSON value could not be converted to System.N |
| Stok | Ürünler | 10 | 400 | {"type":"https://tools.ietf.org/html/rfc9110#section-15.5.1","title":"One or more validation errors occurred.","status":400,"errors":{"$.supplyType":["The JSON value could not be converted to System.N |
| Stok | Ürünler | 14 | 400 | {"type":"https://tools.ietf.org/html/rfc9110#section-15.5.1","title":"One or more validation errors occurred.","status":400,"errors":{"$.supplyType":["The JSON value could not be converted to System.N |
| Stok | Ürünler | 16 | 400 | {"type":"https://tools.ietf.org/html/rfc9110#section-15.5.1","title":"One or more validation errors occurred.","status":400,"errors":{"$.supplyType":["The JSON value could not be converted to System.N |
| Stok | Ürünler | 18 | 400 | {"type":"https://tools.ietf.org/html/rfc9110#section-15.5.1","title":"One or more validation errors occurred.","status":400,"errors":{"$.supplyType":["The JSON value could not be converted to System.N |
| Stok | Ürünler | 19 | 400 | {"type":"https://tools.ietf.org/html/rfc9110#section-15.5.1","title":"One or more validation errors occurred.","status":400,"errors":{"$.supplyType":["The JSON value could not be converted to System.N |
| Stok | Ürünler | 19 | 0 | ... ve 81 kayıt daha test edilmedi |
| Stok | Depolar | 85 | 429 | Cok fazla istek gonderdiniz. Lutfen bekleyiniz. |
| Stok | Depolar | 86 | 429 | Cok fazla istek gonderdiniz. Lutfen bekleyiniz. |
| Satış | Müşteriler | 87 | 429 | Cok fazla istek gonderdiniz. Lutfen bekleyiniz. |
| Satış | Müşteriler | 88 | 429 | Cok fazla istek gonderdiniz. Lutfen bekleyiniz. |
| Satınalma | Tedarikçiler | 89 | 429 | Cok fazla istek gonderdiniz. Lutfen bekleyiniz. |
| Satınalma | Tedarikçiler | 90 | 429 | Cok fazla istek gonderdiniz. Lutfen bekleyiniz. |
| Satış | Teklifler | 1 | 400 | {"type":"https://tools.ietf.org/html/rfc9110#section-15.5.1","title":"One or more validation errors occurred.","status":400,"errors":{"":["The supplied value is invalid."]},"traceId":"00-b25f6d70a2ece |
| Satış | Teklifler | 2 | 400 | {"type":"https://tools.ietf.org/html/rfc9110#section-15.5.1","title":"One or more validation errors occurred.","status":400,"errors":{"":["The supplied value is invalid."]},"traceId":"00-d00e3690863ec |
| Satış | Teklifler | 3 | 400 | {"type":"https://tools.ietf.org/html/rfc9110#section-15.5.1","title":"One or more validation errors occurred.","status":400,"errors":{"":["The supplied value is invalid."]},"traceId":"00-064274761e491 |
| Satış | Teklifler | 4 | 400 | {"type":"https://tools.ietf.org/html/rfc9110#section-15.5.1","title":"One or more validation errors occurred.","status":400,"errors":{"":["The supplied value is invalid."]},"traceId":"00-dca595a692692 |
| Satış | Teklifler | 5 | 400 | {"type":"https://tools.ietf.org/html/rfc9110#section-15.5.1","title":"One or more validation errors occurred.","status":400,"errors":{"":["The supplied value is invalid."]},"traceId":"00-8d4a98f13a73b |
| Satış | Teklifler | 6 | 400 | {"type":"https://tools.ietf.org/html/rfc9110#section-15.5.1","title":"One or more validation errors occurred.","status":400,"errors":{"":["The supplied value is invalid."]},"traceId":"00-9f970df552df3 |
| Satış | Teklifler | 7 | 400 | {"type":"https://tools.ietf.org/html/rfc9110#section-15.5.1","title":"One or more validation errors occurred.","status":400,"errors":{"":["The supplied value is invalid."]},"traceId":"00-6cd6f47685d42 |
| Satış | Teklifler | 8 | 400 | {"type":"https://tools.ietf.org/html/rfc9110#section-15.5.1","title":"One or more validation errors occurred.","status":400,"errors":{"":["The supplied value is invalid."]},"traceId":"00-5a3f7220db4c9 |
| Satış | Teklifler | 9 | 400 | {"type":"https://tools.ietf.org/html/rfc9110#section-15.5.1","title":"One or more validation errors occurred.","status":400,"errors":{"":["The supplied value is invalid."]},"traceId":"00-4825866eb82a7 |
| Satış | Teklifler | 10 | 400 | {"type":"https://tools.ietf.org/html/rfc9110#section-15.5.1","title":"One or more validation errors occurred.","status":400,"errors":{"":["The supplied value is invalid."]},"traceId":"00-e8b94dc8b3bb4 |
| Satış | Teklifler | 10 | 0 | ... ve 90 kayıt daha test edilmedi |
| Satış | Teklif Ürünleri | 0 | 0 | Önce teklif ve ürün kaydı gerekli |
| Satınalma | Satınalma Siparişleri | 1 | 400 | {"type":"https://tools.ietf.org/html/rfc9110#section-15.5.1","title":"One or more validation errors occurred.","status":400,"errors":{"$.paymentTerm":["The JSON value could not be converted to System. |
| Satınalma | Satınalma Siparişleri | 2 | 400 | {"type":"https://tools.ietf.org/html/rfc9110#section-15.5.1","title":"One or more validation errors occurred.","status":400,"errors":{"$.paymentTerm":["The JSON value could not be converted to System. |
| Satınalma | Satınalma Siparişleri | 3 | 400 | {"type":"https://tools.ietf.org/html/rfc9110#section-15.5.1","title":"One or more validation errors occurred.","status":400,"errors":{"$.paymentTerm":["The JSON value could not be converted to System. |
| Satınalma | Satınalma Siparişleri | 4 | 400 | {"type":"https://tools.ietf.org/html/rfc9110#section-15.5.1","title":"One or more validation errors occurred.","status":400,"errors":{"$.paymentTerm":["The JSON value could not be converted to System. |
| Satınalma | Satınalma Siparişleri | 5 | 400 | {"type":"https://tools.ietf.org/html/rfc9110#section-15.5.1","title":"One or more validation errors occurred.","status":400,"errors":{"$.paymentTerm":["The JSON value could not be converted to System. |
| Satınalma | Satınalma Siparişleri | 6 | 400 | {"type":"https://tools.ietf.org/html/rfc9110#section-15.5.1","title":"One or more validation errors occurred.","status":400,"errors":{"$.paymentTerm":["The JSON value could not be converted to System. |
| Satınalma | Satınalma Siparişleri | 7 | 400 | {"type":"https://tools.ietf.org/html/rfc9110#section-15.5.1","title":"One or more validation errors occurred.","status":400,"errors":{"$.paymentTerm":["The JSON value could not be converted to System. |
| Satınalma | Satınalma Siparişleri | 8 | 400 | {"type":"https://tools.ietf.org/html/rfc9110#section-15.5.1","title":"One or more validation errors occurred.","status":400,"errors":{"$.paymentTerm":["The JSON value could not be converted to System. |
| Satınalma | Satınalma Siparişleri | 9 | 400 | {"type":"https://tools.ietf.org/html/rfc9110#section-15.5.1","title":"One or more validation errors occurred.","status":400,"errors":{"$.paymentTerm":["The JSON value could not be converted to System. |
| Satınalma | Satınalma Siparişleri | 10 | 400 | {"type":"https://tools.ietf.org/html/rfc9110#section-15.5.1","title":"One or more validation errors occurred.","status":400,"errors":{"$.paymentTerm":["The JSON value could not be converted to System. |
| Satınalma | Satınalma Siparişleri | 10 | 0 | ... ve 90 kayıt daha test edilmedi |
| Muhasebe | Faturalar | 64 | 429 | Cok fazla istek gonderdiniz. Lutfen bekleyiniz. |
| Muhasebe | Faturalar | 65 | 429 | Cok fazla istek gonderdiniz. Lutfen bekleyiniz. |
| Kalite | Kalibrasyon Ekipmanı | 5 | 422 | Geçersiz kalibrasyon periyodu: SEMI-ANNUAL |
| Kalite | Kalibrasyon Ekipmanı | 6 | 422 | Geçersiz kalibrasyon periyodu: SEMI-ANNUAL |
| Kalite | Kalibrasyon Ekipmanı | 17 | 422 | Geçersiz kalibrasyon periyodu: SEMI-ANNUAL |
| Kalite | Kalibrasyon Ekipmanı | 19 | 422 | Geçersiz kalibrasyon periyodu: SEMI-ANNUAL |
| Kalite | Kalibrasyon Ekipmanı | 20 | 422 | Geçersiz kalibrasyon periyodu: SEMI-ANNUAL |
| Kalite | Kalibrasyon Ekipmanı | 25 | 422 | Geçersiz kalibrasyon periyodu: SEMI-ANNUAL |
| Kalite | Kalibrasyon Ekipmanı | 26 | 422 | Geçersiz kalibrasyon periyodu: SEMI-ANNUAL |
| Kalite | Kalibrasyon Ekipmanı | 33 | 422 | Geçersiz kalibrasyon periyodu: SEMI-ANNUAL |
| Kalite | Kalibrasyon Ekipmanı | 34 | 422 | Geçersiz kalibrasyon periyodu: SEMI-ANNUAL |
| Kalite | Kalibrasyon Ekipmanı | 38 | 422 | Geçersiz kalibrasyon periyodu: SEMI-ANNUAL |
| Kalite | Kalibrasyon Ekipmanı | 38 | 0 | ... ve 62 kayıt daha test edilmedi |
| Kalite | Giriş Kontrol | 26 | 429 | Cok fazla istek gonderdiniz. Lutfen bekleyiniz. |
| Kalite | Giriş Kontrol | 27 | 429 | Cok fazla istek gonderdiniz. Lutfen bekleyiniz. |
| Bakım | Bakım Planları | 1 | 422 | Geçersiz periyot: ANNUALLY. Geçerli değerler: DAILY, WEEKLY, MONTHLY, QUARTERLY, SEMI_ANNUAL, ANNUAL |
| Bakım | Bakım Planları | 5 | 422 | Geçersiz periyot: ANNUALLY. Geçerli değerler: DAILY, WEEKLY, MONTHLY, QUARTERLY, SEMI_ANNUAL, ANNUAL |
| Bakım | Bakım Planları | 7 | 422 | Geçersiz periyot: ANNUALLY. Geçerli değerler: DAILY, WEEKLY, MONTHLY, QUARTERLY, SEMI_ANNUAL, ANNUAL |
| Bakım | Bakım Planları | 11 | 422 | Geçersiz periyot: ANNUALLY. Geçerli değerler: DAILY, WEEKLY, MONTHLY, QUARTERLY, SEMI_ANNUAL, ANNUAL |
| Bakım | Bakım Planları | 12 | 422 | Geçersiz periyot: ANNUALLY. Geçerli değerler: DAILY, WEEKLY, MONTHLY, QUARTERLY, SEMI_ANNUAL, ANNUAL |
| Bakım | Bakım Planları | 16 | 422 | Geçersiz periyot: ANNUALLY. Geçerli değerler: DAILY, WEEKLY, MONTHLY, QUARTERLY, SEMI_ANNUAL, ANNUAL |
| Bakım | Bakım Planları | 19 | 422 | Geçersiz periyot: ANNUALLY. Geçerli değerler: DAILY, WEEKLY, MONTHLY, QUARTERLY, SEMI_ANNUAL, ANNUAL |
| Bakım | Bakım Planları | 27 | 429 | Cok fazla istek gonderdiniz. Lutfen bekleyiniz. |
| Bakım | Bakım Planları | 30 | 422 | Geçersiz periyot: ANNUALLY. Geçerli değerler: DAILY, WEEKLY, MONTHLY, QUARTERLY, SEMI_ANNUAL, ANNUAL |
| Bakım | Bakım Planları | 36 | 422 | Geçersiz periyot: ANNUALLY. Geçerli değerler: DAILY, WEEKLY, MONTHLY, QUARTERLY, SEMI_ANNUAL, ANNUAL |
| Bakım | Bakım Planları | 36 | 0 | ... ve 64 kayıt daha test edilmedi |
| Bakım | Arıza Raporları | 91 | 429 | Cok fazla istek gonderdiniz. Lutfen bekleyiniz. |
| Bakım | Arıza Raporları | 92 | 429 | Cok fazla istek gonderdiniz. Lutfen bekleyiniz. |
| İK | Vardiyalar | 93 | 429 | Cok fazla istek gonderdiniz. Lutfen bekleyiniz. |
| İK | Vardiyalar | 94 | 429 | Cok fazla istek gonderdiniz. Lutfen bekleyiniz. |
| İK | Vardiyalar | 95 | 429 | Cok fazla istek gonderdiniz. Lutfen bekleyiniz. |
