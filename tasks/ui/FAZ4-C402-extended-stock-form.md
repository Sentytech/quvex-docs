# [C402] Stok Formu: 23 Yeni Alan ve Tab'li Layout

## Durum: DONE
## Oncelik: YUKSEK
## Faz: 4
## Tarih: 2026-03-08

## Aciklama
Buyuk OEM uretim tesislerinin alt yuklenicileri icin stok tanimlama formu genisletildi.
Mevcut 6 alandan 29+ alana cikarildi. 4 tab'li profesyonel layout uygulanadi.

## Yapilan Isler
- [x] Backend: Product.cs'e 23 yeni alan eklendi
- [x] Backend: ProductDTO.cs guncellendi
- [x] Backend: ProductProfile mapper guncellendi
- [x] Backend: EF Core migration olusturuldu ve uygulanadi
- [x] Frontend: StockForm.js 4 tab'li yapiya donusturuldu
- [x] Tedarikci Select'i /Customer?type=suppliers endpoint'ine baglandi

## Teknik Detaylar
### Yeni Alanlar
**Teknik:** OEM Parca No, Teknik Resim No, Revizyon No, Brut/Net Agirlik, En/Boy/Yukseklik
**Tedarik:** Mensei Ulke, GTIP No, Tedarik Suresi, Tedarikci, Alis/Satis Fiyati, Para Birimi
**Kalite:** Kritiklik (A/B/C), Giris KK, Lot Takibi, Seri No Takibi, Raf Omru, Depolama, Sertifikalar
**Stok:** Min/Max Stok, Yeniden Siparis Noktasi, Barkod

### Tab Yapisi
1. Genel Bilgiler - Kod, Ad, Birim, Tur, Barkod, Raf, Kritiklik, Aciklama
2. Teknik Bilgiler - OEM, Resim, Rev, Agirlik, Boyutlar
3. Tedarik & Stok - Min/Max, Lead Time, Fiyat, Mensei, GTIP, Tedarikci
4. Kalite & Depolama - KK, Lot, Seri, Raf Omru, Depolama, Sertifika

### Degisen Dosyalar
| Dosya | Degisiklik |
|-------|-----------|
| src/views/modul/stock/StockForm.js | Tamamen yeniden yazildi (4 tab) |

### Backend Degisiklikler (API repo'sunda)
| Dosya | Degisiklik |
|-------|-----------|
| Industry.API/Models/Product.cs | 23 yeni property |
| Industry.API/Models/DTOs/ProductDTO.cs | 23 yeni property + DefaultSupplierName |
| Industry.API/Models/Mappers/ProductProfile.cs | DefaultSupplierName mapping |
| Industry.API/Migrations/AddProductExtendedFields | Yeni migration |

### Etki Analizi
- Stok tanimlama/duzenleme formu tamamen yenilendi
- Tedarikci secimi Customer endpoint'ine bagli
- Mevcut stoklar yeni alanlar bos olarak gorunecek (nullable)
