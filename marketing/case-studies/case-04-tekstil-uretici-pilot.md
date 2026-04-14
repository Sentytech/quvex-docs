# Case Study 04 — EGE TEKSTIL SAN. TIC. LTD. STI. (Pilot Template)

> **Not:** EGE Tekstil bir **pilot sablon vaka calismasi**dir. Gercek musteri degildir. Icerik,
> Quvex Sprint 11'deki ProductVariant matrix modulu ve TEKSTIL-URETIMI-E2E-SENARYO test
> dosyasindaki tipik Turk tekstil KOBI senaryosundan turetilmistir. Isim ve rakamlar
> placeholderdir.

---

## Hero

| Alan | Deger |
|------|-------|
| **Sirket** | EGE Tekstil San. Tic. Ltd. Sti. _(pilot template)_ |
| **Sektor** | Tekstil — orme triko, t-shirt, sweatshirt, CMT + private label |
| **Buyukluk** | 65 calisan (40 dikis, 10 kesim + kalite, 15 idari + satis) |
| **Lokasyon** | Izmir Menderes |
| **Kurulus** | 2009 |
| **Dagitim Kanallari** | LC Waikiki, DeFacto, Koton (B2B private label), Trendyol + Hepsiburada (kendi marka), ihracat Almanya |
| **Plan** | Quvex Pro (20 user) + ProductVariant matrix modulu |

---

## Musteri Profili

EGE Tekstil, Izmir'de 65 kisilik orme + konfeksiyon atolyesidir. Yillik 450.000 adet urun
uretir. 4 ana hat: T-shirt, sweatshirt, polo, triko. Her urun **8 beden (XXS-XXXL) x 6 renk
x 2 kumas (organic/standard)** = 96 varyant matrisi icerir. Yillik ciro 38M TRY, %40
ihracat, %35 LC Waikiki/DeFacto private label, %25 kendi e-ticaret markasi.

Firma 2025'te Trendyol ve Hepsiburada'ya aktif satis baslayinca SKU sayisi 140'tan 2800'e
firladi. Excel'le stok takibi artik mumkun degildi. Aynı anda LC Waikiki, AQL kalite kabul
orani ve "beden x renk" matrix raporu istedi.

---

## Challenge — Quvex Oncesi Durum

### 5 Ana Pain Point

1. **Varyant matrisi Excel'de patladi** — 140 model x 96 varyant = 13.440 SKU. Tek Excel
   dosyasi 38 MB, acilmasi 2 dakika, her kayit sonrasi crash riski.

2. **E-ticaret stok yanlisi = ceza** — Trendyol'a "XL siyah t-shirt 20 adet var" dedik, 8
   adet satildiktan sonra stokta 0 vardi. Trendyol musteri iadesi + performance cezasi.
   Aylik ortalama $1.500 ceza.

3. **LC Waikiki AQL raporu istiyordu** — Her siparis icin Acceptable Quality Level tablosu
   (ISO 2859-1): orneklem boyutu, kabul/ret sayisi. Kagit-kalem hesaplaniyordu.

4. **Kesim fire hesabi yoktu** — Kumas yatagi acildigidan fire %16-22 arasinda oynuyordu.
   Neden oynadigi bilinmiyordu (model? operator? makine?).

5. **Multi-channel siparis kaos** — LC Waikiki (B2B PO), Trendyol (API), kendi magaza
   (elle), ihracat (email). Hepsi ayri Excel'de, gun sonu konsolidasyon 2 saat.

---

## Solution — Quvex ProductVariant Matrix Modulu

EGE Tekstil Quvex'te **tekstil sektor profili** secti ve Sprint 11'de gelen
**ProductVariant matrix modulu**nu aktif etti.

### Aktif Modüller

| Modul | Kullanim |
|-------|----------|
| **ProductVariant Matrix** | 1 urun -> 96 varyant (beden x renk x kumas) tek ekranda grid |
| **Varyant Bazli Stok** | Her SKU icin anlik depo x varyant grid |
| **Multi-channel Siparis** | LC Waikiki B2B, Trendyol API, Hepsiburada API, e-magaza |
| **AQL Kalite Kontrolu (ISO 2859-1)** | Lot bazli orneklem, kabul/ret otomatik |
| **Kesim Plani** | Kumas yatagi + markaj + kayip hesap |
| **Fason Kontrol (CMT)** | Dis fason atolyelere is verme + stok dustu + kabul |
| **Kumas Toplar Lot Takibi** | Top no - renk - gramaj - boy |
| **B2B Sevkiyat (Box + Palet)** | Karton no, adet, barkod |
| **Ihracat Paket Listesi** | Commercial invoice, packing list, country of origin |
| **Dashboard: Gunluk Uretim + Fire** | Hat bazli verim, fire %, kalite notu |

---

## Implementation Story

### Hafta 1 — Setup + ProductVariant Matrix
- Sektor: Tekstil secildi, 8 menu otomatik sadelestirildi
- 4 ana model tanimi (T-shirt, Sweat, Polo, Triko)
- Matrix wizard: beden ekseni (XXS-XXXL), renk ekseni (6 renk), kumas (2)
- 384 varyant tek ekranda olusturuldu (4 model x 96)

### Hafta 2 — Channel Integration
- Trendyol API key + URL
- Hepsiburada API key
- LC Waikiki PO email -> Quvex siparis kurallari
- Stok senkronizasyonu: varyant -> kanal (5 dakikada bir)

### Hafta 3-4 — Ilk Gercek Sezon
- Yaz 2026 kolleksiyonu 140 model x 96 varyant = 13.440 SKU yüklendi
- 3 kanal acildi, stok senkron %100
- Ilk AQL raporu LC Waikiki'ye gonderildi, kabul edildi

### Ay 2 — Kesim Fire Analizi
- Kesim modulu 6 hafta veri biriktirdi
- Analiz: Operator A kullanirken fire %14, Operator B kullanirken %21
- Egitim planlandi, 3 ay sonra B %15'e dustu

---

## Results — 6 Aylik Olcumler

| Metrik | Quvex Oncesi | Quvex Sonrasi (6 ay) | Iyilesme |
|--------|-------------|--------------------|----------|
| **E-ticaret stok hata** | 140 hata/ay | 6 hata/ay | -%96 |
| **Trendyol ceza** | $1.500/ay | $0 | -%100 |
| **Varyant yonetim suresi** | 2 saat/gun | 10 dk/gun | -%92 |
| **LC Waikiki AQL rapor** | 3 saat/lot | 5 dk/lot | -%97 |
| **Multi-channel konsolidasyon** | 2 saat/gun | anlik | -%100 |
| **Kesim fire (ortalama)** | %19 | %14 | -%26 |
| **Stok dogrulugu** | %78 | %98 | +%26 |
| **Siparis teslim suresi (private label)** | 45 gun | 32 gun | -%29 |
| **Aylik net kar marji** | %8 | %14 | +%75 |

---

## Quote (Placeholder)

> "140 model, 96 varyant, 3 e-ticaret kanali, 4 B2B musteri. Excel'de manage ettigimiz donem
> geceleri uyuyamiyordum. Quvex'in matrix ekranina girince dogrudan 'kirmizi XL kac adet'
> goruyorum. 38 MB Excel acilmasi bitti, artik 1 saniyede cevap aliyorum."
>
> — **Zeynep Aydin**, Operasyon Muduru, EGE Tekstil _(placeholder)_

> "LC Waikiki'nin AQL tablosunu elle hesapliyorduk. Yanlis orneklem secince lot reddedildi,
> 12.000 adet iade geldi. Quvex AQL modulunde ISO 2859-1 tablosu hazirdi, bir daha red
> almadik."
>
> — **Mehmet Ozcan**, Kalite Sefi, EGE Tekstil _(placeholder)_

---

## Migration Story

| Kaynak | Hedef | Sure |
|--------|-------|------|
| `sku_master.xlsx` (13.440 satir, 38 MB) | ProductVariant matrix | 2 gun (sutun mapping zor) |
| Trendyol mevcut stok | Trendyol API initial sync | 4 saat |
| LC Waikiki PO arsiv (2025) | Satis gecmisi | 1 gun |
| Kumas top kayit (kagit) | Stok (lot bazli) | 3 gun (sayim) |

**Toplam migration:** 7 is gunu, 2 kisi.

---

## Implemented Modules

```
ProductVariant Matrix | Multi-Channel (Trendyol/HB/LC/B2B) | AQL Kalite (ISO 2859-1)
Kesim Plani | Fason Yonetimi | Kumas Lot Takibi | B2B Sevkiyat
Ihracat Paket Listesi | Uretim Hatti | Stok | Dashboard + Fire Analizi
```

**Toplam:** 11 modul, 4 hafta gecis, ay 2'de kar marji %75 arti.
