# Case Study 03 — ANKA GIDA SAN. A.S. (Pilot Template)

> **Not:** ANKA GIDA bir **pilot sablon vaka calismasi**dir. Gercek musteri degildir. Icerik,
> Quvex'in Sprint 11'de gelistirilen HACCP/Recall niche modulu ve GIDA-URETIMI-E2E-SENARYO
> test dosyasindaki tipik gida KOBI senaryosundan turetilmistir. Isim, rakamlar ve
> alintilar placeholderdir. Gercek musteri referansi alinir alinmaz guncellenecektir.

---

## Hero

| Alan | Deger |
|------|-------|
| **Sirket** | ANKA Gida San. ve Tic. A.S. _(pilot template)_ |
| **Sektor** | Gida uretimi — unlu mamuller, hazir kek, cerez |
| **Buyukluk** | 45 calisan (30 uretim, 8 kalite + lab, 7 idari/satis) |
| **Lokasyon** | Ankara Sincan OSB |
| **Kurulus** | 2011 |
| **Sertifikalar** | ISO 22000, BRC Food (hedef), Helal, Guvenli Gida |
| **Dagitim Kanallari** | Migros, Carrefour, BIM (private label), yerel marketler |
| **Plan** | Quvex Pro (20 user) + HACCP/Recall niche modulu |

---

## Musteri Profili

ANKA Gida, gunluk 8 ton unlu mamul uretim kapasitesine sahip orta olcekli bir gida KOBI'dir.
3 ana hat: hazir kek, kurabiye, cerez karisim. Urunler hem kendi markasiyla hem de zincir
marketler icin "private label" olarak uretilir. Yillik ciro 42M TRY, 3 dagitim arac filosu,
28 SKU.

Firma 2024'te Migros private label anlasmasina girdiginde ISO 22000 ve HACCP belgelerini
elektronik ortamda dogrulanabilir sekilde saklamasi gerektigini anladi. Ayni zamanda her
teslimat ile birlikte "lot no - uretim tarihi - son kullanma tarihi - alerjen bildirimi"
barkodu istenmeye baslandi.

---

## Challenge — Quvex Oncesi Durum

### 5 Ana Pain Point

1. **HACCP CCP noktalari Excel'de** — 7 kritik kontrol noktasi (firin sicakligi, metal
   dedector, cooling room, vb.) elle Word formuna yaziliyor, ayda 1 kez toplaniyordu.
   Saat bazli kayit yoktu.

2. **Recall simulasyonu imkansiz** — "Bu lot hangi hammaddeden yapildi, hangi marketlere
   gitti?" sorusu 6-8 saatte cevap bulabiliyordu. BRC standart "4 saat icinde recall" zorunlu
   kiliyordu.

3. **Son kullanma tarihi yonetimi manuel** — 28 SKU x 5 lot = 140 aktif lot. Hangi lot ne
   zaman biter, hangi iade kargoda — Excel'de kayboluyordu. Aylik $8K iade yazilisi.

4. **Hammadde tedarikci sertifikalari dagitik** — Un, seker, margarin, tuz alimlarinda her
   partinin supplier COA'si (Certificate of Analysis) kagit olarak geliyordu. Denetimde
   "2025-Mart ayindaki un lotunun COA'si" istendiginde 2 saat arama yapiliyordu.

5. **Uretim kayitlarin denetci ile senkronize olmaliyiz** — T.C. Tarim Bakanligi
   denetciligi tarafindan "online dogrulanabilir kayit" talep edilmeye baslandi.

---

## Solution — Quvex HACCP/Recall Niche Modulu

ANKA Gida, Quvex'te **gida sektor profili** secerek onboarding'i tamamladi. Sprint 11'de
gelen **HACCP/Recall niche modulu** ozelligi aktif edildi.

### Aktif Modüller

| Modul | Kullanim |
|-------|----------|
| **HACCP CCP Kayit Sistemi** | 7 CCP: firin sicakligi (sakar/tuzsuz), metal dedector, cooling room, paketleme, alerjen ayrim, soguk zincir, sevkiyat isisi |
| **Lot Tracking (BOM tabanli)** | Hammadde lot -> hamur lot -> firin lot -> paket lot -> palet lot |
| **Recall Flow Wizard** | "Lot X'i geri cek" butonu -> otomatik etkilenen musteriler + paletler listesi |
| **Son Kullanma Tarihi Dashboard** | FIFO kontrolu, 30 gun oncesi uyari, iade tahmini |
| **Tedarikci COA Yonetimi** | Her PO icin COA belge ekleme, lot baglama, denetime hazir |
| **Alerjen Matrisi** | Gluten, sut, yumurta, findik - SKU bazli |
| **Barkod + Etiket Yazici** | Lot no + UKT + uretim tarihi + alerjen otomatik |
| **Uretim Emri (Hat Bazli)** | Hat 1: hazir kek, Hat 2: kurabiye, Hat 3: cerez |
| **Kalite Lab Kayit** | Lab testleri (nem, aw, pH, mikrobiyolojik) |
| **Satis (Private Label + Kendi Marka)** | Farkli fiyat listesi, farkli etiket |

---

## Implementation Story

### Hafta 1 — Kurulum ve Sektor Template
- Self-register, sektor: Gida
- Onboarding 5 dakika, gida template 12 menu getirdi
- 7 CCP noktasi wizard ile tanimlandi
- 3 uretim hatti, 12 makine kaydi

### Hafta 2-3 — Master Data + COA Import
- 45 hammadde (un cesitleri, seker, yaglar, sut tozu, cikolata, findik)
- 28 SKU urun, BOM ile hamur -> firin -> paket zinciri
- 14 tedarikci, her birine COA belge yukleme flow'u
- Alerjen matrisi: 28 SKU x 7 alerjen

### Hafta 4 — Ilk HACCP Kayit Donemi
- Firin sicakligi her saat bir kayit (otomatik + manuel fallback)
- Metal dedector her vardiya 1 test
- CCP raporu haftalik otomatik PDF

### Ay 2 — Ilk Recall Simulasyonu
- Test senaryosu: "2025-03-15 tarihli UN-A lotu geri cek"
- Sistem 18 saniyede etkilenen 4 hamur lot + 12 paket lot + 3 market teslimat raporu
- Gercek recall zamani: 4 saat yerine **23 dakika**

---

## Results — 6 Aylik Olcumler

| Metrik | Quvex Oncesi | Quvex Sonrasi (6 ay) | Iyilesme |
|--------|-------------|--------------------|----------|
| **Recall simulasyon suresi** | 6-8 saat | 23 dk | -%95 |
| **HACCP CCP kayit sikligi** | Aylik | Saatlik | +720x |
| **COA belge bulma suresi** | 2 saat | 10 sn | -%99 |
| **SKT iade kaybi (aylik)** | $8.000 | $1.100 | -%86 |
| **BRC audit hazirlik** | n/a | 2 hafta | yeni yetenek |
| **Tarim Bakanligi denetim suresi** | 1 gun | 2 saat | -%75 |
| **Lot trace sorgusu** | 6-8 saat | 18 sn | -%99.9 |
| **Uretim planlama hatasi** | %18 | %4 | -%78 |

---

## Quote (Placeholder)

> "Migros'tan 'su lotu geri cek' emri geldiginde 6 saat telefonla kosusturuyorduk. Quvex'te
> tek butona basiyoruz, 23 dakikada tum etkilenen paletler ve marketler listesi cikiyor.
> BRC denetcisi 'Bu modul ozellikle recall icin mi yazilmis?' diye sordu."
>
> — **Ayse Kaya**, Kalite Muduru, ANKA Gida _(placeholder)_

> "Tedarikci COA'larini daha onceki klasor sistemine gore 100 kat hizli buluyoruz. Denetciye
> 10 saniyede belgeyi gosterince 'devam edelim' dedi. Excel'de bu mumkun degildi."
>
> — **Okan Yilmaz**, Uretim Sefi, ANKA Gida _(placeholder)_

---

## Migration Story

| Kaynak | Hedef | Sure |
|--------|-------|------|
| `haccp_formlari/*.docx` (arsiv) | Dosya Yonetimi | 1 gun |
| `hammadde_stok.xlsx` | Stok | 4 saat |
| COA klasor (kagit) | Tarama + tedarikci kartina yukleme | 2 gun (student yardimi) |
| Logo Tiger fatura | Quvex faturalama (yeniler) | ayni anda |
| Barkod yazici entegrasyonu | Zebra GK420 -> Quvex print API | 4 saat (IT yardimiyla) |

**Toplam migration:** 4 is gunu, 1 kalite + 1 IT destek.

---

## Implemented Modules

```
HACCP CCP | Recall Wizard | Lot Tracking | SKT Dashboard
Tedarikci COA | Alerjen Matrisi | Barkod/Etiket | Uretim Hatti
Kalite Lab | Satis (Private + Retail) | Stok | Faturalama | Rapor
```

**Toplam:** 13 modul, 4 hafta gecis, ay 2'de ilk recall simulasyonu basarili.
