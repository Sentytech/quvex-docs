# Tekstil Uretimi — Uctan Uca Test Senaryosu
# Hazir Giyim (Erkek Gomlek) Uretim Sureci

> **Son Guncelleme:** 2026-04-10
> **Test Suresi:** ~40 dakika (38 adim)
> **Onkosul:** https://quvex.io erisilebiyor (API + DB + UI canli)
> **Hedef Profil:** Hazir giyim uretici, ISO 9001 sertifikali, 80+ dikis makinesi, 45 personel

---

## NASIL KULLANILIR

Bu dokuman PDF olarak yazdirilip, test ekibine dagitilabilir.
Her adimda:
- **[ ]** kutucugunu isaretleyin (gecti/kaldi)
- **Ekran** → hangi sayfa acilacak
- **Islem** → ne yapilacak
- **Beklenen** → ne olmali
- **Bagimlilik** → onceki hangi adim tamamlanmis olmali

Her faz basindaki **bagimlilik** kontrolu yapilmadan o faza gecilmez.

---

## SENARYO OZETI

**Firma:** Atlas Tekstil San. Ltd. Sti. (80 dikis makinesi, 45 personel, 2 uretim bandi)
**Musteri:** Koton Magazalar Zinciri — 2026 Sonbahar/Kis erkek gomlek siparisi
**Urun:** ATX-GML-2026AW Erkek Slim Fit Gomlek (Poplin %100 Pamuk)
**Sezon:** 2026 Sonbahar/Kis (AW26)
**Beden Skalasi:** S, M, L, XL, XXL
**Renk Skalasi:** Beyaz (PMS White), Mavi (Pantone 2728C), Siyah (Pantone Black 6C)
**Hammadde:** Poplin kumasi %100 pamuk 120 g/m², dugme (sedef 10mm), dikiş ipligi, marka etiketi, aski, poset
**Standartlar:** ISO 9001, AQL 2.5 (Normal Inspection Level II)
**Toplam Siparis:** 4.500 adet (15 beden-renk kombinasyonu)

**Personel Yapisi:**
| Rol | Kisi | Not |
|-----|------|-----|
| Genel Mudur | Ahmet Atlas | Admin — her seyi goruyor |
| Uretim Muduru | Serkan Kesimci | Uretim + is emri + pastal plan |
| Kalite Muduru | Ayse Kaliteci | AQL muayene, NCR, CAPA |
| Satin Alma | Fatma Tedarikcisi | Kumasi + aksesuar siparis |
| Satis Sorumlusu | Deniz Satisci | Teklif + siparis yonetimi |
| Kesim Operatoru | Murat Kesici | Kesimhane |
| Dikis Operatoru | Zeynep Dikisci | Dikiş bandi sefı |
| Depo Sorumlusu | Hakan Depoci | Mal kabul + sevkiyat |
| Muhasebeci | Elif Muhasebe | Fatura + odeme |

**Beden-Renk Dagilim Matrisi (Siparis Adetleri):**

| Beden | Beyaz | Mavi | Siyah | Toplam |
|-------|-------|------|-------|--------|
| S     | 100   | 150  | 100   | 350    |
| M     | 200   | 300  | 200   | 700    |
| L     | 300   | 400  | 250   | 950    |
| XL    | 250   | 350  | 200   | 800    |
| XXL   | 200   | 300  | 200   | 700    |
| **Toplam** | **1.050** | **1.500** | **950** | **3.500** |

> **Not:** Koton siparis miktarini 3.500 adet olarak revize etmistir.
> Teklif asmasinda 4.500 adet talep edilmis, onay surecinde 3.500'e dusmustur.

---

## BILINEN KISITLAMALAR

Quvex ERP'nin mevcut surumunde tekstil sektorune ozgu bazi kisitlamalar mevcuttur.
Bu kisitlamalar test sirasinda alternatif yollarla asılacaktir:

| # | Kisitlama | Cozum / Workaround |
|---|-----------|-------------------|
| 1 | Beden-renk varyant matrisi modulu yok | Her beden-renk kombinasyonu ayri urun olarak tanimlanir (ornegin: ATX-GML-S-BYZ, ATX-GML-M-MVI, vb.) |
| 2 | Pastal plani optimizasyonu yok | Pastal plani bilgisi is emri notuna manuel yazilir, fire orani elle hesaplanir |
| 3 | Boya lot esleme otomatigi yok | Boya lot numarasi kontrol plani notuna eklenir, kumasi giris kalitede lot bazli takip edilir |
| 4 | AQL tablolari otomatik hesaplanmaz | AQL orneklem buyuklugu ve kabul/red sayilari muayene formuna manuel girilir |
| 5 | Metraj bazli stok takibi sinirli | Kumasi kilogram veya top adet uzerinden takip edilir, metraj donusumu notla belirtilir |
| 6 | Operasyon bazli operatör performans raporu yok | Dikis adeti is emri kaydi uzerinden operatör notu ile tutulur |

---

# ══════════════════════════════════════════════════
# FAZ 0: FIRMA KAYDI ve GIRIS
# Bagimlilik: Yok (ilk adim)
# Tahmini Sure: 3 dakika
# ══════════════════════════════════════════════════

### Adim 0.1 — Firma Kaydi
- **Ekran:** `quvex.io/register`
- **Islem:** Asagidaki bilgilerle kayit ol
  ```
  Firma Adi:    Atlas Tekstil San. Ltd. Sti.
  Alt Alan:     atlastekstil
  Ad Soyad:     Ahmet Atlas
  Email:        ahmet@atlastekstil.com.tr
  Telefon:      212 555 4477
  Sifre:        AtlasTekstil2026!@#$
  Sektor:       Tekstil / Hazir Giyim
  ```
- **Beklenen:** "Hesabiniz basariyla olusturuldu" mesaji, email dogrulama bekleniyor
- [ ] GECTI / [ ] KALDI
- **Not:**

### Adim 0.2 — Giris Yap
- **Ekran:** `quvex.io/login`
- **Islem:** `ahmet@atlastekstil.com.tr` / `AtlasTekstil2026!@#$` ile giris
- **Beklenen:** Dashboard acilir, sol menude tum moduller gorunur (Admin yetkisi)
- [ ] GECTI / [ ] KALDI

### Adim 0.3 — Kullanici Rolleri Tanimla
- **Ekran:** `Ayarlar > Kullanicilar`
- **Islem:** Asagidaki kullanicilari olustur ve ilgili rolleri ata
  ```
  1. serkan@atlastekstil.com.tr  → Uretim Muduru (Uretim, Is Emri, Stok)
  2. ayse@atlastekstil.com.tr    → Kalite Muduru (Kalite, Muayene, NCR)
  3. fatma@atlastekstil.com.tr   → Satin Alma (Satin Alma, Tedarikci)
  4. deniz@atlastekstil.com.tr   → Satis (Musteri, Teklif, Siparis)
  5. murat@atlastekstil.com.tr   → Operator (ShopFloor)
  6. zeynep@atlastekstil.com.tr  → Operator (ShopFloor)
  7. hakan@atlastekstil.com.tr   → Depo (Stok, Sevkiyat)
  8. elif@atlastekstil.com.tr    → Muhasebe (Fatura, Odeme)
  ```
- **Beklenen:** 8 kullanici basariyla olusturulur, her biri ilgili rol ile gorunur
- [ ] GECTI / [ ] KALDI
- **Not:** Sifre politikasi: 12+ karakter, buyuk/kucuk harf, rakam, ozel karakter

---

# ══════════════════════════════════════════════════
# FAZ 1: MUSTERI ve TEDARIKCI TANIMLARI
# Bagimlilik: Faz 0 tamamlanmis olmali
# Tahmini Sure: 4 dakika
# ══════════════════════════════════════════════════

### Adim 1.1 — Musteri Kaydi (Koton)
- **Ekran:** `Musteriler > Yeni Musteri`
- **Islem:** Asagidaki bilgilerle musteri olustur
  ```
  Firma Adi:      Koton Magazacilik Tekstil San. ve Tic. A.S.
  Kisaltma:       KOTON
  Vergi Dairesi:  Buyuk Mukellefler
  Vergi No:       1234567890
  Tip:            Musteri
  Sektor:         Perakende / Hazir Giyim
  Adres 1:        Merkez — Organize Sanayi Bolgesi 7. Cadde No:4 Sultanbeyli/Istanbul
  Adres 2:        Depo — Hadimkoy Lojistik Merkezi D Blok Arnavutkoy/Istanbul
  Telefon:        212 999 0000
  Email:          satin.alma@koton.com
  Ilgili Kisi:    Mehmet Alisveriscioğlu (Satin Alma Muduru)
  Ilgili Tel:     532 111 2233
  Odeme Vadesi:   60 gun
  Para Birimi:    TRY
  ```
- **Beklenen:** Musteri kartı basariyla kaydedildi, listede KOTON olarak gorunuyor
- [ ] GECTI / [ ] KALDI
- **Not:** Iki farkli teslimat adresi girilmeli (Merkez + Depo). Sevkiyat asamasinda depo adresi secilecek.

### Adim 1.2 — Kumasi Tedarikci Kaydi
- **Ekran:** `Musteriler > Yeni Musteri` (type=suppliers filtresi)
- **Islem:** Kumasi tedarikcisini kaydet
  ```
  Firma Adi:      Soke Pamuk Dokuma San. A.S.
  Kisaltma:       SOKE
  Tip:            Tedarikci
  Vergi No:       9876543210
  Adres:          Soke OSB 3. Cadde No:12 Soke/Aydin
  Ilgili Kisi:    Kemal Dokumaci
  Ilgili Tel:     256 333 4455
  Email:          satis@sokepamuk.com.tr
  Odeme Vadesi:   45 gun
  Para Birimi:    TRY
  Urun Grubu:     Kumasi (Poplin, Oxford, Twill)
  ```
- **Beklenen:** Tedarikci karti olusturuldu, `/Customer?type=suppliers` listesinde gorunuyor
- [ ] GECTI / [ ] KALDI

### Adim 1.3 — Aksesuar Tedarikci Kaydi
- **Ekran:** `Musteriler > Yeni Musteri` (type=suppliers filtresi)
ize Asagiditik bilgilerle aksesuar tedarikcisini kaydet
  ```
  Firma Adi:      Marmara Aksesuar Tic. Ltd. Sti.
  Kisaltma:       MRMR-AKS
  Tip:            Tedarikci
  Vergi No:       5678901234
  Adres:          Gungoren San. Sit. B Blok No:44 Gungoren/Istanbul
  Ilgili Kisi:    Hasan Dugmeci
  Ilgili Tel:     212 444 5566
  Email:          siparis@marmaraaksesuar.com
  Odeme Vadesi:   30 gun
  Para Birimi:    TRY
  Urun Grubu:     Dugme, Iplik, Etiket, Aski, Poset
  ```
- **Beklenen:** Tedarikci karti olusturuldu, suppliers listesinde 2 tedarikci gorunuyor
- [ ] GECTI / [ ] KALDI

---

# ══════════════════════════════════════════════════
# FAZ 2: URUN ve VARYANT TANIMLARI
# Bagimlilik: Faz 1 tamamlanmis olmali
# Tahmini Sure: 6 dakika
# ══════════════════════════════════════════════════

### Adim 2.1 — Ana Urun Tanimi (Erkek Gomlek)
- **Ekran:** `Urunler > Yeni Urun`
- **Islem:** Ana urun kartini olustur
  ```
  Urun Adi:       Erkek Slim Fit Gomlek — AW26 Koleksiyon
  Urun Kodu:      ATX-GML-2026AW
  Kategori:       Hazir Giyim / Erkek / Gomlek
  Birim:          Adet
  Sezon:          2026 Sonbahar/Kis (AW26)
  Kumasi Tipi:    Poplin %100 Pamuk 120 g/m²
  Marka:          Atlas Tekstil (Private Label: Koton)
  Aciklama:       Slim fit kesim, dugmeli yaka, tek cep, uzun kol
  ```
- **Beklenen:** Urun karti olusturuldu, listede ATX-GML-2026AW kodu ile gorunuyor
- [ ] GECTI / [ ] KALDI
- **Not:** Bu ana urun referans olarak kullanilacak. Asil siparis takibi beden-renk varyantlari uzerinden yapilacak.

### Adim 2.2 — Beden Varyantlari Tanimlama
- **Ekran:** `Urunler > Yeni Urun` (5 adet olusturulacak)
- **Islem:** Her beden icin varyant urunu olustur. Renk bilgisi henuz girilmez, sadece beden skalasi:
  ```
  1. ATX-GML-S      → Erkek Slim Fit Gomlek S Beden
  2. ATX-GML-M      → Erkek Slim Fit Gomlek M Beden
  3. ATX-GML-L      → Erkek Slim Fit Gomlek L Beden
  4. ATX-GML-XL     → Erkek Slim Fit Gomlek XL Beden
  5. ATX-GML-XXL    → Erkek Slim Fit Gomlek XXL Beden
  ```
  Her birinin aciklama alanina beden olcu tablosu notu ekle:
  ```
  S:   Gogus 96cm, Boy 72cm, Kol 62cm
  M:   Gogus 100cm, Boy 74cm, Kol 63cm
  L:   Gogus 104cm, Boy 76cm, Kol 64cm
  XL:  Gogus 108cm, Boy 78cm, Kol 65cm
  XXL: Gogus 112cm, Boy 80cm, Kol 66cm
  ```
- **Beklenen:** 5 beden varyanti olusturuldu, urun listesinde filtrelenebiliyor
- [ ] GECTI / [ ] KALDI
- **Not:** Quvex'te varyant matrisi modulu olmadigindan her beden ayri urun olarak tanimlanir.

### Adim 2.3 — Renk Varyantlari Tanimlama (Beden x Renk)
- **Ekran:** `Urunler > Yeni Urun` (15 adet olusturulacak)
- **Islem:** Her beden-renk kombinasyonu icin ayri urun karti olustur:
  ```
  Beyaz Serisi (PMS White):
  ATX-GML-S-BYZ    → Erkek Slim Fit Gomlek S Beyaz
  ATX-GML-M-BYZ    → Erkek Slim Fit Gomlek M Beyaz
  ATX-GML-L-BYZ    → Erkek Slim Fit Gomlek L Beyaz
  ATX-GML-XL-BYZ   → Erkek Slim Fit Gomlek XL Beyaz
  ATX-GML-XXL-BYZ  → Erkek Slim Fit Gomlek XXL Beyaz

  Mavi Serisi (Pantone 2728C):
  ATX-GML-S-MVI    → Erkek Slim Fit Gomlek S Mavi
  ATX-GML-M-MVI    → Erkek Slim Fit Gomlek M Mavi
  ATX-GML-L-MVI    → Erkek Slim Fit Gomlek L Mavi
  ATX-GML-XL-MVI   → Erkek Slim Fit Gomlek XL Mavi
  ATX-GML-XXL-MVI  → Erkek Slim Fit Gomlek XXL Mavi

  Siyah Serisi (Pantone Black 6C):
  ATX-GML-S-SYH    → Erkek Slim Fit Gomlek S Siyah
  ATX-GML-M-SYH    → Erkek Slim Fit Gomlek M Siyah
  ATX-GML-L-SYH    → Erkek Slim Fit Gomlek L Siyah
  ATX-GML-XL-SYH   → Erkek Slim Fit Gomlek XL Siyah
  ATX-GML-XXL-SYH  → Erkek Slim Fit Gomlek XXL Siyah
  ```
- **Beklenen:** 15 varyant urunu olusturuldu. Toplam urun sayisi: 1 (ana) + 5 (beden) + 15 (beden-renk) = 21
- [ ] GECTI / [ ] KALDI
- **Not:** Aciklama alanina Pantone renk kodu ve boya lot referansi yazilacak.

### Adim 2.4 — Hammadde / Malzeme Tanimlari
- **Ekran:** `Urunler > Yeni Urun` (hammadde kategorisi)
- **Islem:** Urun agacinda (BOM) kullanilacak hammaddeleri tanimla:
  ```
  1. KMS-PPLN-120-BYZ  → Poplin Kumasi %100 Pamuk 120g/m² Beyaz    | Birim: Metre
  2. KMS-PPLN-120-MVI  → Poplin Kumasi %100 Pamuk 120g/m² Mavi     | Birim: Metre
  3. KMS-PPLN-120-SYH  → Poplin Kumasi %100 Pamuk 120g/m² Siyah    | Birim: Metre
  4. AKS-DGM-SDF-10    → Sedef Dugme 10mm 4 Delik                  | Birim: Adet
  5. AKS-IPLK-POL-BYZ  → Polyester Dikis Ipligi Beyaz 5000m Masuralı| Birim: Adet (masura)
  6. AKS-IPLK-POL-MVI  → Polyester Dikis Ipligi Mavi 5000m Masuralı | Birim: Adet (masura)
  7. AKS-IPLK-POL-SYH  → Polyester Dikis Ipligi Siyah 5000m Masuralı| Birim: Adet (masura)
  8. AKS-ETK-KOTON     → Koton Marka Etiketi (dokuma)              | Birim: Adet
  9. AKS-BAKIM-ETK     → Yikama/Bakim Talimati Etiketi             | Birim: Adet
  10. PKT-ASKI-PLT     → Plastik Elbise Askisi                     | Birim: Adet
  11. PKT-POSET-40x60  → Seffaf Poset 40x60cm                      | Birim: Adet
  12. PKT-KOLI-GML     → Gomlek Kolisi (60x40x40cm, 20'li)         | Birim: Adet
  ```
- **Beklenen:** 12 hammadde/malzeme karti olusturuldu, hepsi "Hammadde" kategorisinde listeleniyor
- [ ] GECTI / [ ] KALDI

### Adim 2.5 — BOM (Urun Agaci) Tanimlama
- **Ekran:** `Urunler > ATX-GML-M-BYZ > Urun Agaci (BOM)`
- **Islem:** M Beden Beyaz gomlek icin BOM tanimla (referans recete — diger varyantlara kopyalanacak):
  ```
  Malzeme                          | Miktar  | Birim  | Not
  ─────────────────────────────────┼─────────┼────────┼──────────────
  KMS-PPLN-120-BYZ (Poplin Beyaz)  | 1.65    | Metre  | %8 fire dahil (net 1.52m)
  AKS-DGM-SDF-10 (Sedef Dugme)     | 9       | Adet   | 7 on + 1 yaka + 1 yedek
  AKS-IPLK-POL-BYZ (Iplik Beyaz)   | 0.02    | Adet   | 1 masura = ~50 gomlek
  AKS-ETK-KOTON (Marka Etiketi)    | 1       | Adet   | Yaka ici
  AKS-BAKIM-ETK (Bakim Etiketi)    | 1       | Adet   | Sol yan dikis
  PKT-ASKI-PLT (Elbise Askisi)     | 1       | Adet   | Paketleme
  PKT-POSET-40x60 (Poset)          | 1       | Adet   | Paketleme
  ```
- **Beklenen:** BOM kaydedildi, toplam maliyet hesaplandi (birim fiyatlar girilmisse)
- [ ] GECTI / [ ] KALDI
- **Not:** Kumasi sarfiyati beden bazli degisir: S=1.50m, M=1.65m, L=1.75m, XL=1.85m, XXL=1.95m (fire dahil). Diger varyantlarin BOM'unda kumasi miktari buna gore guncellenmeli.

### Adim 2.6 — Boya Lot Kaydi
- **Ekran:** `Urunler > KMS-PPLN-120-MVI > Notlar/Aciklama`
- **Islem:** Mavi kumasi urun kartinin aciklama alanina boya lot bilgisini gir:
  ```
  BOYA LOT BILGILERI
  ──────────────────
  Renk Kodu:      Pantone 2728C
  Boya Partisi:   DL-2026-0847
  Boya Tipi:      Reaktif boya (pamuk icin)
  Tedarikci:      Soke Pamuk Dokuma San. A.S.
  Uretim Tarihi:  2026-08-15
  Lot Miktari:    3.200 metre (2 top)
  Referans Numune: ATX-REF-MVI-001
  dE Toleransi:   < 1.0 (musteri onaylı numune ile karsilastirilacak)
  ```
- **Beklenen:** Boya lot bilgisi urun kartinin aciklama/not alaninda kaydedildi
- [ ] GECTI / [ ] KALDI
- **Not:** Quvex'te boya lot modulu olmadigindan bu bilgi urun kartinin not alaninda tutulur. Giris kalite kontrolunde bu bilgiye referans verilecek.

---

# ══════════════════════════════════════════════════
# FAZ 3: TEKLIF ve SIPARIS
# Bagimlilik: Faz 2 tamamlanmis olmali
# Tahmini Sure: 5 dakika
# Login: Deniz Satisci (deniz@atlastekstil.com.tr)
# ══════════════════════════════════════════════════

### Adim 3.1 — Teklif Olustur
- **Ekran:** `Teklifler > Yeni Teklif`
- **Login:** `deniz@atlastekstil.com.tr` (Satis rolu)
- **Islem:** Koton'a yonelik teklif olustur
  ```
  Musteri:        Koton Magazacilik Tekstil San. ve Tic. A.S.
  Teklif No:      TKL-2026-0042
  Teklif Tarihi:  2026-08-20
  Gecerlilik:     15 gun
  Para Birimi:    TRY
  Teslimat:       60 gun (siparis onayindan itibaren)
  Odeme:          60 gun vade

  Kalemler (beden-renk dagilimi matrisi):
  ───────────────────────────────────────────────────────
  # | Urun Kodu        | Aciklama               | Adet | Birim Fiyat | Tutar
  1 | ATX-GML-S-BYZ    | Gomlek S Beyaz         | 100  | 285,00 TL   | 28.500,00
  2 | ATX-GML-M-BYZ    | Gomlek M Beyaz         | 200  | 285,00 TL   | 57.000,00
  3 | ATX-GML-L-BYZ    | Gomlek L Beyaz         | 300  | 285,00 TL   | 85.500,00
  4 | ATX-GML-XL-BYZ   | Gomlek XL Beyaz        | 250  | 290,00 TL   | 72.500,00
  5 | ATX-GML-XXL-BYZ  | Gomlek XXL Beyaz       | 200  | 290,00 TL   | 58.000,00
  6 | ATX-GML-S-MVI    | Gomlek S Mavi          | 150  | 295,00 TL   | 44.250,00
  7 | ATX-GML-M-MVI    | Gomlek M Mavi          | 300  | 295,00 TL   | 88.500,00
  8 | ATX-GML-L-MVI    | Gomlek L Mavi          | 400  | 295,00 TL   | 118.000,00
  9 | ATX-GML-XL-MVI   | Gomlek XL Mavi         | 350  | 300,00 TL   | 105.000,00
  10| ATX-GML-XXL-MVI  | Gomlek XXL Mavi        | 300  | 300,00 TL   | 90.000,00
  11| ATX-GML-S-SYH    | Gomlek S Siyah         | 100  | 295,00 TL   | 29.500,00
  12| ATX-GML-M-SYH    | Gomlek M Siyah         | 200  | 295,00 TL   | 59.000,00
  13| ATX-GML-L-SYH    | Gomlek L Siyah         | 250  | 295,00 TL   | 73.750,00
  14| ATX-GML-XL-SYH   | Gomlek XL Siyah        | 200  | 300,00 TL   | 60.000,00
  15| ATX-GML-XXL-SYH  | Gomlek XXL Siyah       | 200  | 300,00 TL   | 60.000,00
  ───────────────────────────────────────────────────────
  TOPLAM:                                         3.500              1.029.500,00
  KDV (%10):                                                          102.950,00
  GENEL TOPLAM:                                                     1.132.450,00
  ```
- **Beklenen:**
  - Teklif kaydedildi, durumu "Taslak" olarak gorunuyor
  - 15 kalem listeleniyor
  - Genel toplam 1.132.450,00 TL (KDV dahil)
  - OxitAutoComplete ile urun arama calisıyor
- [ ] GECTI / [ ] KALDI
- **Not:** XL ve XXL bedenlerde birim fiyat 5 TL daha yuksek (ek kumasi maliyeti). Mavi ve siyah renkler boyali kumasi nedeniyle beyazdan 10 TL pahali.

### Adim 3.2 — Teklif Onayi
- **Ekran:** `Teklifler > TKL-2026-0042 > Detay`
- **Login:** `ahmet@atlastekstil.com.tr` (Admin)
- **Islem:** Teklifi onayla
  - "Onayla" butonuna bas
  - Onay notu gir: "Koton AW26 gomlek siparisi — fiyatlar musteri ile mutabik"
- **Beklenen:** Teklif durumu "Taslak" → "Onaylandi" olarak degisti
- [ ] GECTI / [ ] KALDI

### Adim 3.3 — Teklif → Satis Siparisi Donusumu
- **Ekran:** `Teklifler > TKL-2026-0042 > Detay`
- **Login:** `deniz@atlastekstil.com.tr` (Satis)
- **Islem:** "Siparise Donustur" butonuna bas
- **Beklenen:**
  - Satis siparisi otomatik olusturuldu (ornegin: SIP-2026-0033)
  - 15 kalem aynen aktarildi (beden-renk-adet-fiyat)
  - Siparis durumu "Acik"
  - Teklif durumu "Siparise Donusturuldu"
  - Teklif uzerinde siparis referansi goruntuleniyor
- [ ] GECTI / [ ] KALDI

---

# ══════════════════════════════════════════════════
# FAZ 4: SATIN ALMA
# Bagimlilik: Faz 3 tamamlanmis olmali (Siparis olusmus)
# Tahmini Sure: 4 dakika
# Login: Fatma Tedarikcisi (fatma@atlastekstil.com.tr)
# ══════════════════════════════════════════════════

### Adim 4.1 — Kumasi Satin Alma Siparisi
- **Ekran:** `Satin Alma > Yeni Siparis`
- **Login:** `fatma@atlastekstil.com.tr` (Satin Alma rolu)
- **Islem:** Kumasi siparisi olustur. Metraj hesabi:
  ```
  Kumasi Sarfiyat Hesabi (fire dahil):
  ────────────────────────────────
  Beyaz:  S(100×1.50) + M(200×1.65) + L(300×1.75) + XL(250×1.85) + XXL(200×1.95)
        = 150 + 330 + 525 + 462.5 + 390 = 1.857,5 m → Siparis: 1.900 m
  Mavi:   S(150×1.50) + M(300×1.65) + L(400×1.75) + XL(350×1.85) + XXL(300×1.95)
        = 225 + 495 + 700 + 647.5 + 585 = 2.652,5 m → Siparis: 2.700 m
  Siyah:  S(100×1.50) + M(200×1.65) + L(250×1.75) + XL(200×1.85) + XXL(200×1.95)
        = 150 + 330 + 437.5 + 370 + 390 = 1.677,5 m → Siparis: 1.720 m

  Tedarikci:  Soke Pamuk Dokuma San. A.S.
  Siparis No: SAT-2026-0071

  Kalemler:
  # | Malzeme              | Miktar   | Birim  | Birim Fiyat | Tutar
  1 | KMS-PPLN-120-BYZ     | 1.900 m  | Metre  | 85,00 TL    | 161.500,00
  2 | KMS-PPLN-120-MVI     | 2.700 m  | Metre  | 95,00 TL    | 256.500,00
  3 | KMS-PPLN-120-SYH     | 1.720 m  | Metre  | 95,00 TL    | 163.400,00
  ────────────────────────────────
  TOPLAM:                   6.320 m              581.400,00 TL
  Beklenen Teslimat: 2026-09-05 (15 gun)
  ```
- **Beklenen:** Satin alma siparisi kaydedildi, durumu "Acik", 3 kalem listeleniyor
- [ ] GECTI / [ ] KALDI
- **Not:** Siparis miktarlari net ihtiyacin %2-3 ustunde tutulmustur (ekstra fire payi). Metraj hesabi is emri planlama asamasinda dogrulanacak.

### Adim 4.2 — Aksesuar Satin Alma Siparisi
- **Ekran:** `Satin Alma > Yeni Siparis`
- **Islem:** Aksesuar siparisi olustur
  ```
  Tedarikci:  Marmara Aksesuar Tic. Ltd. Sti.
  Siparis No: SAT-2026-0072

  Kalemler:
  # | Malzeme               | Miktar    | Birim  | Birim Fiyat | Tutar
  1 | AKS-DGM-SDF-10        | 32.000    | Adet   | 0,85 TL     | 27.200,00
  2 | AKS-IPLK-POL-BYZ      | 25        | Adet   | 42,00 TL    | 1.050,00
  3 | AKS-IPLK-POL-MVI      | 35        | Adet   | 42,00 TL    | 1.470,00
  4 | AKS-IPLK-POL-SYH      | 25        | Adet   | 42,00 TL    | 1.050,00
  5 | AKS-ETK-KOTON         | 3.700     | Adet   | 1,20 TL     | 4.440,00
  6 | AKS-BAKIM-ETK         | 3.700     | Adet   | 0,35 TL     | 1.295,00
  7 | PKT-ASKI-PLT          | 3.700     | Adet   | 2,50 TL     | 9.250,00
  8 | PKT-POSET-40x60       | 3.700     | Adet   | 0,45 TL     | 1.665,00
  9 | PKT-KOLI-GML          | 185       | Adet   | 12,00 TL    | 2.220,00
  ────────────────────────────────
  TOPLAM:                                                      49.640,00 TL
  Beklenen Teslimat: 2026-09-03 (13 gun)
  ```
- **Beklenen:** Satin alma siparisi kaydedildi, durumu "Acik", 9 kalem listeleniyor
- [ ] GECTI / [ ] KALDI
- **Not:** Dugme adedi: 3.500 adet × 9 dugme/gomlek = 31.500 + %1.5 fire = ~32.000 adet. Koli adedi: 3.500/20 = 175 + 10 yedek = 185 adet.

---

# ══════════════════════════════════════════════════
# FAZ 5: MAL KABUL ve GIRIS KALITE KONTROL
# Bagimlilik: Faz 4 tamamlanmis olmali (Satin alma siparisleri olusmus)
# Tahmini Sure: 5 dakika
# Login: Hakan Depoci + Ayse Kaliteci
# ══════════════════════════════════════════════════

### Adim 5.1 — Kumasi Mal Kabul
- **Ekran:** `Stok > Mal Kabul` (veya `Satin Alma > SAT-2026-0071 > Mal Kabul`)
- **Login:** `hakan@atlastekstil.com.tr` (Depo rolu)
- **Islem:** Kumasi teslimati icin mal kabul islemi yap
  ```
  Satin Alma Siparisi: SAT-2026-0071
  Tedarikci:           Soke Pamuk Dokuma San. A.S.
  Irsaliye No:         SOKE-IRS-2026-1447
  Teslim Tarihi:       2026-09-06

  Teslim Edilen:
  # | Malzeme           | Top No      | Metraj   | Agirlik  | Not
  1 | Poplin Beyaz      | BYZ-T001    | 980 m    | 117,6 kg | 1. top
  2 | Poplin Beyaz      | BYZ-T002    | 920 m    | 110,4 kg | 2. top → TOPLAM: 1.900 m (tam)
  3 | Poplin Mavi       | MVI-T001    | 1.050 m  | 126,0 kg | Boya Lot: DL-2026-0847
  4 | Poplin Mavi       | MVI-T002    | 980 m    | 117,6 kg | Boya Lot: DL-2026-0847
  5 | Poplin Mavi       | MVI-T003    | 670 m    | 80,4 kg  | Boya Lot: DL-2026-0848 [FARKLI LOT!]
  6 | Poplin Siyah      | SYH-T001    | 900 m    | 108,0 kg | 1. top
  7 | Poplin Siyah      | SYH-T002    | 820 m    | 98,4 kg  | 2. top → TOPLAM: 1.720 m (tam)
  ```
- **Beklenen:**
  - Mal kabul kaydedildi
  - Stok miktarlari guncellendi (Beyaz: 1.900m, Mavi: 2.700m, Siyah: 1.720m)
  - Satin alma siparisi durumu "Teslim Alindi" olarak degisti
- [ ] GECTI / [ ] KALDI
- **Not:** DIKKAT — Mavi kumasin 3. topu (MVI-T003) farkli boya lotundan gelmistir (DL-2026-0848). Bu durum giris kalite kontrolunde renk farki riski olarak degerlendirilecek. Mal kabul notuna "Farkli boya lot — kalite kontrol gerekli" yazilmali.

### Adim 5.2 — Giris Kalite: Kumasi Gramaji Kontrolu
- **Ekran:** `Kalite > Yeni Muayene`
- **Login:** `ayse@atlastekstil.com.tr` (Kalite Muduru)
- **Islem:** Her top icin gramaj testi sonuclarini gir
  ```
  Muayene Tipi:    Giris Kalite Kontrol — Gramaj Testi
  Referans:        SAT-2026-0071 / Mal Kabul
  Standart:        TS EN 12127 — Kumasi Birim Alan Kutlesi
  Hedef Deger:     120 g/m² (Tolerans: ±5 g/m², yani 115-125 g/m²)
  Test Metodu:     100 cm² kesme kalıbı ile tartım (3 olcum/top)

  Sonuclar:
  # | Top No     | Olcum 1  | Olcum 2  | Olcum 3  | Ortalama | Sonuc
  1 | BYZ-T001   | 119 g/m² | 121 g/m² | 120 g/m² | 120,0    | KABUL
  2 | BYZ-T002   | 118 g/m² | 119 g/m² | 120 g/m² | 119,0    | KABUL
  3 | MVI-T001   | 122 g/m² | 121 g/m² | 123 g/m² | 122,0    | KABUL
  4 | MVI-T002   | 120 g/m² | 121 g/m² | 120 g/m² | 120,3    | KABUL
  5 | MVI-T003   | 118 g/m² | 117 g/m² | 119 g/m² | 118,0    | KABUL (sinirda)
  6 | SYH-T001   | 121 g/m² | 122 g/m² | 121 g/m² | 121,3    | KABUL
  7 | SYH-T002   | 120 g/m² | 119 g/m² | 121 g/m² | 120,0    | KABUL
  ```
- **Beklenen:** Muayene kaydedildi, tum toplar "KABUL" durumunda, genel sonuc "KABUL"
- [ ] GECTI / [ ] KALDI
- **Not:** MVI-T003 gramaj olarak sinirda (118 g/m²). Zaten farkli boya lotundan geldigi icin bu top oncelikli olarak tuketilecek, renk farki testi kritik.

### Adim 5.3 — Giris Kalite: Renk Farki Olcumu (dE)
- **Ekran:** `Kalite > Yeni Muayene`
- **Islem:** Spektrofotometre ile renk farki olcumu
  ```
  Muayene Tipi:    Giris Kalite Kontrol — Renk Farki (dE)
  Standart:        ISO 105-J03 (CIE LAB dE*ab)
  Referans Numune: ATX-REF-MVI-001 (musteri onaylı)
  Kabul Kriteri:   dE < 1.0
  Isik Kosulu:     D65/10°

  Sonuclar:
  # | Top No     | dE Degeri | L*     | a*    | b*     | Sonuc
  1 | BYZ-T001   | 0.3       | 95.2   | -0.1  | 1.8    | KABUL
  2 | BYZ-T002   | 0.4       | 95.0   | -0.1  | 2.0    | KABUL
  3 | MVI-T001   | 0.5       | 42.3   | -8.2  | -36.1  | KABUL
  4 | MVI-T002   | 0.6       | 42.1   | -8.0  | -35.8  | KABUL
  5 | MVI-T003   | 1.3       | 43.0   | -7.5  | -34.9  | RED [dE > 1.0]
  6 | SYH-T001   | 0.2       | 18.5   | 0.3   | -0.5   | KABUL
  7 | SYH-T002   | 0.3       | 18.7   | 0.2   | -0.4   | KABUL
  ```
- **Beklenen:**
  - 6 top KABUL, 1 top RED (MVI-T003: dE=1.3)
  - Red olan top icin uyari mesaji goruntuleniyor
  - Genel muayene sonucu: "SARTLI KABUL" (aciklama ile)
- [ ] GECTI / [ ] KALDI
- **Not:** MVI-T003 topunun renk farki kabul sinirini asıyor. Bu top icin Adim 5.5'te NCR acilacak veya tedarikci ile iade/indirim gorusulmesi gerekir. Simdilik "SARTLI KABUL — farkli boya lot, kullanim karari uretim planlama ile belirlenecek" notu dusulur.

### Adim 5.4 — Giris Kalite: Cekme Testi
- **Ekran:** `Kalite > Yeni Muayene`
- **Islem:** Yikama sonrasi boyutsal degisim (cekme) testi
  ```
  Muayene Tipi:    Giris Kalite Kontrol — Cekme Testi
  Standart:        ISO 6330 / ISO 5077 — Yikama Sonrasi Boyutsal Degisim
  Kabul Kriteri:   Cekme < %3 (atkı ve cozgu yonunde)
  Yikama Programi: 40°C, normal program, 3 yikama dongusu

  Sonuclar (top bazli numune — her renkten 1 top):
  # | Top No     | Cozgu Cekmesi | Atki Cekmesi | Sonuc
  1 | BYZ-T001   | %1.8          | %1.5         | KABUL
  2 | MVI-T001   | %2.0          | %1.7         | KABUL
  3 | MVI-T003   | %2.5          | %2.2         | KABUL (sinirda)
  4 | SYH-T001   | %1.9          | %1.6         | KABUL
  ```
- **Beklenen:** Muayene kaydedildi, tum numuneler "KABUL" (cekme < %3)
- [ ] GECTI / [ ] KALDI
- **Not:** MVI-T003 cekme testinde de sinirda sonuc verdi (%2.5). Gramaj + renk farki + cekme sonuclari birlestirilerek bu topun uretimde dikkatli kullanilmasina karar verilecek.

### Adim 5.5 — Aksesuar Mal Kabul
- **Ekran:** `Stok > Mal Kabul`
- **Login:** `hakan@atlastekstil.com.tr` (Depo)
- **Islem:** Aksesuar teslimati icin mal kabul
  ```
  Satin Alma Siparisi: SAT-2026-0072
  Tedarikci:           Marmara Aksesuar Tic. Ltd. Sti.
  Irsaliye No:         MRMR-IRS-2026-0892
  Teslim Tarihi:       2026-09-04

  Tum kalemler eksiksiz teslim alindi (9 kalem, miktarlar siparis ile ayni)
  ```
- **Beklenen:** Mal kabul kaydedildi, stok miktarlari guncellendi, siparis durumu "Teslim Alindi"
- [ ] GECTI / [ ] KALDI

---

# ══════════════════════════════════════════════════
# FAZ 6: URETIM (KESIM → DIKIM → YIKAMA → UTU)
# Bagimlilik: Faz 5 tamamlanmis olmali (Malzemeler depoda)
# Tahmini Sure: 8 dakika
# Login: Serkan Kesimci (Uretim Muduru) + Operatorler
# ══════════════════════════════════════════════════

### Adim 6.1 — Kesim Plani Olustur (Pastal Plan)
- **Ekran:** `Uretim > Is Emirleri > Yeni`
- **Login:** `serkan@atlastekstil.com.tr` (Uretim Muduru)
- **Islem:** Kesim operasyonu icin is emri ac. Pastal plani bilgisini notlara gir:
  ```
  Is Emri No:      IE-2026-0088
  Operasyon:       Kesim
  Urun Grubu:      ATX-GML (Tum beden-renk varyantlari)
  Baslangic:       2026-09-08
  Bitis (Plan):    2026-09-10 (3 gun)
  Atanan Operator: Murat Kesici
  Oncelik:         Yuksek
  
  PASTAL PLANI (Not Alanina Girilecek):
  ─────────────────────────────────────
  BEYAZ SERI — Toplam 1.050 adet
    Pastal uzunlugu: 8.2 m
    Kat sayisi: 52 kat × 2 serim = 104 kat
    Serim genisligi: 150 cm (kumasi eni)
    Marker verimi: %87
    Tahmini kumasi tuketimi: 1.850 m (50m yedek kalir)
    Fire orani (hedef): <%5
  
  MAVI SERI — Toplam 1.500 adet
    Pastal uzunlugu: 8.2 m
    Kat sayisi: 52 kat × 3 serim = 156 kat
    Serim genisligi: 150 cm
    Marker verimi: %87
    Tahmini kumasi tuketimi: 2.625 m (75m yedek kalir)
    NOT: MVI-T003 topu (670m) ayri serimde kullanilacak (renk fark riski)
  
  SIYAH SERI — Toplam 950 adet
    Pastal uzunlugu: 8.2 m
    Kat sayisi: 52 kat × 2 serim = 104 kat
    Tahmini kumasi tuketimi: 1.680 m (40m yedek kalir)
  ```
- **Beklenen:** Is emri olusturuldu, durumu "Planlanmis", atanan operator gorunuyor
- [ ] GECTI / [ ] KALDI
- **Not:** Pastal plani Quvex'te otomatik optimize edilmez, manuel hesaplanir ve is emri notuna yazilir. Marker verimi %87 tekstil sektorunde ortalama bir degerdir.

### Adim 6.2 — Kesim Kaydi (Operasyon Tamamlama)
- **Ekran:** `ShopFloor > IE-2026-0088` (veya `Uretim > Is Emri Detay`)
- **Login:** `murat@atlastekstil.com.tr` (Operator — ShopFloor)
- **Islem:** Kesim operasyonunu kaydet
  ```
  Is Emri:         IE-2026-0088
  Durum:           Planlanmis → Uretimde → Tamamlandi
  Baslangic:       2026-09-08 08:00
  Bitis:           2026-09-10 17:00

  Kesim Sonuclari:
  # | Renk   | Planlanan Adet | Kesilen Parca | Fire (m) | Fire Orani
  1 | Beyaz  | 1.050          | 1.052         | 48 m     | %2.5
  2 | Mavi   | 1.500          | 1.503         | 72 m     | %2.7
  3 | Siyah  | 950            | 951           | 38 m     | %2.2
  ──────────────────────────────────────────────
  TOPLAM:    3.500            3.506           158 m      %2.5

  Not: +6 adet fazla kesim (yedek parca) normal tolerans icinde.
  Kumasi fire: 158 m (toplam 6.320 m'den → %2.5 fire orani — hedef <%5 icinde)
  ```
- **Beklenen:**
  - Is emri durumu "Tamamlandi" olarak guncellendi
  - Uretim miktari (3.506 parca) kaydedildi
  - Fire miktari (158 m) kaydedildi
- [ ] GECTI / [ ] KALDI

### Adim 6.3 — Dikis Operasyonu Is Emri
- **Ekran:** `Uretim > Is Emirleri > Yeni`
- **Login:** `serkan@atlastekstil.com.tr` (Uretim Muduru)
- **Islem:** Dikis operasyonu icin is emri ac
  ```
  Is Emri No:      IE-2026-0089
  Operasyon:       Dikim
  Urun Grubu:      ATX-GML (Tum beden-renk varyantlari)
  Onceki Is Emri:  IE-2026-0088 (Kesim)
  Baslangic:       2026-09-11
  Bitis (Plan):    2026-09-22 (10 is gunu)
  Atanan Operator: Zeynep Dikisci (Band Sefi)
  Oncelik:         Yuksek
  Makine:          Band 1 (40 makine) + Band 2 (40 makine)

  Operasyon Siralama:
  1. Yaka dikisi (yaka alt + yaka ust + birlesim)
  2. Omuz dikisi
  3. Kol takma
  4. Yan dikis
  5. Manset dikisi
  6. On pat dikisi
  7. Cep dikisi
  8. Dugme iligi acma
  9. Dugme dikisi
  10. Son temizlik (iplik kesim)
  ```
- **Beklenen:** Is emri olusturuldu, onceki is emri referansi goruntuleniyor
- [ ] GECTI / [ ] KALDI

### Adim 6.4 — Dikis Kaydi (Gunluk Uretim Takibi)
- **Ekran:** `ShopFloor > IE-2026-0089`
- **Login:** `zeynep@atlastekstil.com.tr` (Operator)
- **Islem:** Dikis operasyonunu kaydet (gunluk ilerleme)
  ```
  Gun 1-2 (09-11 / 09-12):  Beyaz seri — 520 adet
  Gun 3-4 (09-13 / 09-14):  Beyaz seri — 530 adet (Beyaz toplam: 1.050)
  Gun 5-7 (09-15 / 09-17):  Mavi seri — 900 adet
  Gun 8   (09-18):           Mavi seri — 600 adet (Mavi toplam: 1.500)
  Gun 9-10 (09-19 / 09-22): Siyah seri — 950 adet

  Toplam dikilen: 3.500 adet
  2. kalite (dikis hatali): 47 adet (tamir icin ayrildi)
  Tamir edilen: 38 adet → uretime geri dondu
  Net fire (tamir edilemeyen): 9 adet

  Operator Bazli Performans (notta belirtilecek):
  Band 1 ortalama: 22 adet/operator/gun
  Band 2 ortalama: 20 adet/operator/gun
  ```
- **Beklenen:** Is emri durumu "Tamamlandi", uretim miktari 3.500 adet, fire: 9 adet
- [ ] GECTI / [ ] KALDI
- **Not:** Operator bazli performans takibi Quvex'te ayri modül olmadigindan, is emri notuna yazilir.

### Adim 6.5 — Ara Kalite Kontrol: Dikis Kalitesi
- **Ekran:** `Kalite > Yeni Muayene`
- **Login:** `ayse@atlastekstil.com.tr` (Kalite Muduru)
- **Islem:** Dikis kalite kontrolu — band uzerinde gezici kontrol
  ```
  Muayene Tipi:    Ara Kalite Kontrol — Dikis Kalitesi
  Referans:        IE-2026-0089 (Dikis Is Emri)
  Kontrol Zamani:  Her 2 saatte 1 (gunluk 4 kontrol)
  Orneklem:        Her kontrolde 10 adet rastgele

  Kontrol Noktalari ve Sonuclar:
  ───────────────────────────────
  1. Igne Araligi (SPI — Stitches Per Inch)
     Hedef: 12 SPI (±1)
     Olcum:  Beyaz seri: 12.0, 11.5, 12.2 → KABUL
             Mavi seri:  11.8, 12.1, 12.0 → KABUL
             Siyah seri: 12.3, 12.0, 11.9 → KABUL

  2. Dikis Payi
     Hedef: 1.0 cm (±0.2 cm)
     Olcum:  Beyaz: 1.0, 0.9, 1.1 → KABUL
             Mavi:  1.0, 1.0, 0.8 → KABUL (sinirda)
             Siyah: 1.0, 1.1, 1.0 → KABUL

  3. Iplik Gerginligi
     Hedef: Esit gerginlik (alt-ust iplik dengeli)
     Sonuc: Tum serilerde KABUL

  4. Dikis Tipi
     Hedef: 301 (zincir dikis — gomlek govde), 504 (overlok — kenarlar)
     Sonuc: UYGUN

  Genel Sonuc: KABUL — kritik hata yok, minor hata orani <%2
  ```
- **Beklenen:** Muayene kaydedildi, sonuc "KABUL"
- [ ] GECTI / [ ] KALDI

### Adim 6.6 — Ara Kalite Kontrol: Olcu Kontrolu
- **Ekran:** `Kalite > Yeni Muayene`
- **Islem:** Dikiş sonrasi beden olculerinin kontrolu
  ```
  Muayene Tipi:    Ara Kalite Kontrol — Olcu Kontrolu
  Referans:        IE-2026-0089 (Dikis Is Emri)
  Orneklem:        Her bedenden 5 adet (toplam 25 adet)
  Tolerans:        ±1.0 cm

  Sonuclar (cm):
  # | Beden | Gogus (Hedef) | Olcum | Boy (Hedef) | Olcum | Kol (Hedef) | Olcum | Sonuc
  1 | S     | 96            | 96.5  | 72          | 72.0  | 62          | 62.3  | KABUL
  2 | M     | 100           | 100.2 | 74          | 73.8  | 63          | 63.0  | KABUL
  3 | L     | 104           | 104.0 | 76          | 76.5  | 64          | 63.7  | KABUL
  4 | XL    | 108           | 107.5 | 78          | 78.2  | 65          | 65.0  | KABUL
  5 | XXL   | 112           | 112.8 | 80          | 79.5  | 66          | 66.1  | KABUL

  Genel Sonuc: KABUL — tum olculer tolerans icinde
  ```
- **Beklenen:** Muayene kaydedildi, tum bedenler tolerans icinde, sonuc "KABUL"
- [ ] GECTI / [ ] KALDI

### Adim 6.7 — Yikama/Finish Operasyonu
- **Ekran:** `Uretim > Is Emirleri > Yeni`
- **Login:** `serkan@atlastekstil.com.tr` (Uretim Muduru)
- **Islem:** Yikama operasyonu is emri ac ve tamamla
  ```
  Is Emri No:      IE-2026-0090
  Operasyon:       Yikama / Finish
  Onceki Is Emri:  IE-2026-0089 (Dikim)
  Baslangic:       2026-09-23
  Bitis:           2026-09-25 (3 gun)

  Yikama Programi:
  ──────────────────
  Islem:           Enzim yikama (soft finish)
  Sicaklik:        40°C
  Sure:            45 dakika
  Kimyasal:        Selulaz enzim (0.5 g/L)
  Durulama:        2 kez, 30°C
  Sikma:           60 RPM
  Kurutma:         Tambur kurutma 60°C, 25 dakika

  Parti Bilgisi:
  Parti 1: Beyaz seri (1.050 adet) — 2026-09-23
  Parti 2: Mavi seri (1.500 adet) — 2026-09-24
  Parti 3: Siyah seri (950 adet) — 2026-09-25

  Sonuc: Tum partiler basariyla yikandi, soft-touch hissi elde edildi
  Fire: 3 adet (yikama sirasinda leke — 2 beyaz, 1 siyah)
  ```
- **Beklenen:** Is emri tamamlandi, 3.497 adet (3.500 - 3 fire)
- [ ] GECTI / [ ] KALDI

### Adim 6.8 — Utu/Press Operasyonu
- **Ekran:** `Uretim > Is Emirleri > Yeni`
- **Islem:** Utu operasyonu is emri ac ve tamamla
  ```
  Is Emri No:      IE-2026-0091
  Operasyon:       Utu / Press
  Onceki Is Emri:  IE-2026-0090 (Yikama)
  Baslangic:       2026-09-26
  Bitis:           2026-09-29 (2 is gunu)

  Utu Ayarlari:
  ──────────────
  Sicaklik:    180°C (pamuk ayari)
  Buhar:       Evet (orta seviye)
  Press Suresi: 15 saniye / gomlek
  Yaka Press:  Ayri pres makinesi (220°C, 20 saniye)

  Sonuc: 3.497 adet basariyla utulendi
  Fire: 0 (utu asamasinda fire beklenmez)
  ```
- **Beklenen:** Is emri tamamlandi, 3.497 adet
- [ ] GECTI / [ ] KALDI

---

# ══════════════════════════════════════════════════
# FAZ 7: SON MUAYENE ve NCR
# Bagimlilik: Faz 6 tamamlanmis olmali (Uretim bitmis)
# Tahmini Sure: 5 dakika
# Login: Ayse Kaliteci
# ══════════════════════════════════════════════════

### Adim 7.1 — Son Muayene: AQL 2.5 Ornekleme
- **Ekran:** `Kalite > Yeni Muayene` (veya `Son Muayene`)
- **Login:** `ayse@atlastekstil.com.tr` (Kalite Muduru)
- **Islem:** AQL 2.5 orneklemesine gore son muayene yap
  ```
  Muayene Tipi:    Son Muayene — AQL 2.5 (Normal Inspection Level II)
  Referans:        SIP-2026-0033 (Koton Siparisi)
  Standart:        ISO 2859-1 / ANSI Z1.4

  AQL Hesaplama:
  ──────────────
  Parti Buyuklugu (N):  3.497 adet
  Orneklem Kodu:        L (1201-3200 arası → Seviye II)
  Orneklem Buyuklugu:   200 adet
  Kabul Sayisi (Ac):    Major: 10, Minor: 14
  Red Sayisi (Re):      Major: 11, Minor: 15

  Hata Siniflandirmasi:
  ─────────────────────
  MAJOR HATALAR (urun islevini etkiler):
  - Yanlis beden etiketi
  - Dugme eksik / yanlis pozisyon
  - Yaka simetrisi bozuk (>3mm)
  - Dikis patlagi / acik dikis
  - Yanlis renk eslesme

  MINOR HATALAR (gorunumu etkiler, islevi etkilemez):
  - Kucuk iplik fazlaligi (<3mm)
  - Hafif utu izi
  - Kucuk dikis kaymasi (<2mm)
  - Etiket yerlestirme sapması

  Muayene Sonuclari (200 adet orneklem):
  ────────────────────────────────────
  Major Hatalar:   7 adet (Ac=10'dan kucuk → KABUL)
    - 2× dugme pozisyon sapması
    - 1× yaka simetrisi bozuk
    - 2× dikis patlagi (yan dikis)
    - 1× yanlis beden etiketi (L etiketi M gomlek uzerinde)
    - 1× on pat dikis kaymasi
  
  Minor Hatalar:   12 adet (Ac=14'ten kucuk → KABUL)
    - 5× iplik fazlaligi
    - 3× hafif utu izi
    - 2× dikis kaymasi
    - 2× etiket yerlestirme

  GENEL SONUC: KABUL (Major: 7 < 10, Minor: 12 < 14)
  ```
- **Beklenen:**
  - Muayene kaydedildi
  - AQL sonucu "KABUL" olarak goruntuleniyor
  - Hata detaylari (major/minor) listelenebiliyor
- [ ] GECTI / [ ] KALDI
- **Not:** AQL tablolari Quvex'te otomatik hesaplanmaz. Orneklem buyuklugu ve kabul/red sayilari ISO 2859-1 tablosundan manuel belirlenmistir. Muayene formuna bu degerler elle girilir.

### Adim 7.2 — NCR Olustur (Hatali Urunler Icin)
- **Ekran:** `Kalite > NCR > Yeni`
- **Islem:** Son muayenede tespit edilen hatalı urunler icin NCR ac
  ```
  NCR No:          NCR-2026-0019
  Tarih:           2026-09-30
  Kaynak:          Son Muayene — AQL 2.5 (Adim 7.1)
  Urun:            ATX-GML serisi (karisik beden-renk)
  Hatali Miktar:   19 adet (major hatalı orneklerden tahmini — parti genelinde)
  
  Hata Dagilimi:
  - Dikis patlagi:         8 adet → Tamir edilecek (dikis bandina geri gonder)
  - Yanlis etiket:         4 adet → Etiket degisimi yapilacak
  - Yaka simetrisi:        3 adet → 2. kalite olarak ayrilacak
  - Dugme pozisyon:        4 adet → Dugme sokulup tekrar dikilecek

  Karar:
  - 12 adet tamir → uretime geri doner
  - 4 adet etiket degisimi → depo tarafindan yapilir
  - 3 adet 2. kalite → ayri depolanir (outlet satis)

  Kok Neden Analizi:
  - Dikis patlagi: Band 2'de iplik gerginligi ayarinda sapma (makine bakim yapildi)
  - Yanlis etiket: Etiket besleme sırası karisikligi (prosedur guncellendi)
  - Yaka simetrisi: Kalip asınması (kalip yenilendi)

  Duzeltici Faaliyet:
  - Band 2 makineleri icin haftalik iplik gerginligi kontrol checklist eklendi
  - Etiket besleme proseduru guncellendi (beden sirali kutu sistemi)
  - Yaka kaliplari her 500 uretim sonrası kontrol edilecek
  ```
- **Beklenen:**
  - NCR kaydedildi, durumu "Acik"
  - Hatali miktar ve hata turleri goruntuleniyor
  - Duzeltici faaliyet alani doldurulabiliyor
- [ ] GECTI / [ ] KALDI

---

# ══════════════════════════════════════════════════
# FAZ 8: PAKETLEME, DEPO ve SEVKIYAT
# Bagimlilik: Faz 7 tamamlanmis olmali (Son muayene gecmis)
# Tahmini Sure: 4 dakika
# Login: Hakan Depoci
# ══════════════════════════════════════════════════

### Adim 8.1 — Paketleme (Beden-Renk Bazli)
- **Ekran:** `Uretim > Is Emirleri > Yeni` (veya `Stok > Depo Girisi`)
- **Login:** `hakan@atlastekstil.com.tr` (Depo)
- **Islem:** Paketleme islemini kaydet
  ```
  Is Emri No:      IE-2026-0092
  Operasyon:       Paketleme
  Baslangic:       2026-09-30
  Bitis:           2026-10-02

  Paketleme Sureci:
  1. Gomlek katlama (standart magazin katlama)
  2. Plastik elbise askisina asma
  3. Seffaf posete yerlestirme
  4. Barkod etiketi yapistirma (urun kodu + beden + renk + seri no)
  5. Koliye yerlestirme (20 adet/koli, ayni beden-ayni renk)

  Koli Dagilimi:
  ────────────────────────────────────
  # | Urun            | Adet  | Koli Sayisi | Koli No Aralik
  1 | S Beyaz          | 100   | 5           | KL-001 — KL-005
  2 | M Beyaz          | 200   | 10          | KL-006 — KL-015
  3 | L Beyaz          | 300   | 15          | KL-016 — KL-030
  4 | XL Beyaz         | 250   | 13          | KL-031 — KL-043 (son koli 10'lu)
  5 | XXL Beyaz        | 197   | 10          | KL-044 — KL-053 (son koli 17'li)
  6 | S Mavi           | 150   | 8           | KL-054 — KL-061 (son koli 10'lu)
  7 | M Mavi           | 300   | 15          | KL-062 — KL-076
  8 | L Mavi           | 400   | 20          | KL-077 — KL-096
  9 | XL Mavi          | 350   | 18          | KL-097 — KL-114 (son koli 10'lu)
  10| XXL Mavi         | 300   | 15          | KL-115 — KL-129
  11| S Siyah          | 100   | 5           | KL-130 — KL-134
  12| M Siyah          | 200   | 10          | KL-135 — KL-144
  13| L Siyah          | 247   | 13          | KL-145 — KL-157 (son koli 7'li)
  14| XL Siyah         | 200   | 10          | KL-158 — KL-167
  15| XXL Siyah        | 200   | 10          | KL-168 — KL-177
  ────────────────────────────────────
  TOPLAM:              3.494*  177 koli
  
  * 3.500 - 3 (yikama fire) - 3 (2. kalite NCR) = 3.494 adet net sevk edilebilir
    (Not: 12 adet tamir + 4 etiket degisimi = 16 adet uretime geri dondu)
  ```
- **Beklenen:** Paketleme is emri tamamlandi, koli bazli kayit olusturuldu
- [ ] GECTI / [ ] KALDI
- **Not:** Barkod formati: ATX-GML-[BEDEN]-[RENK]-[SERINO] (ornegin: ATX-GML-M-BYZ-0001). Barkod basımı Quvex'ten direkt yapilmaz, harici barkod yazilimi kullanilir. Koli barkodu: KL-[NO] formati.

### Adim 8.2 — Depo Girisi (Koli Bazli)
- **Ekran:** `Stok > Depo Girisi`
- **Islem:** Paketlenen urunlerin depo girisini yap
  ```
  Giris Tipi:       Uretimden Depo Girisi
  Referans:         IE-2026-0092 (Paketleme Is Emri)
  Depo:             Mamul Deposu — A Rafi
  Tarih:            2026-10-02

  Giris Detayi (15 kalem — her beden-renk kombinasyonu):
  Toplam: 3.494 adet, 177 koli

  Raf Yerlesimi:
  A-01: Beyaz seri (53 koli)
  A-02: Mavi seri (76 koli)
  A-03: Siyah seri (48 koli)
  ```
- **Beklenen:**
  - Stok miktarlari guncellendi (mamul deposunda 3.494 adet)
  - Her varyant icin ayri stok karti goruntulenebiliyor
  - Toplam stok degeri hesaplandi
- [ ] GECTI / [ ] KALDI

### Adim 8.3 — Sevkiyat Hazirlama
- **Ekran:** `Stok > Sevkiyat` (veya `Satis > SIP-2026-0033 > Sevkiyat`)
- **Islem:** Koton siparisine gore sevkiyat hazirla
  ```
  Siparis No:       SIP-2026-0033
  Musteri:          Koton Magazacilik Tekstil San. ve Tic. A.S.
  Teslimat Adresi:  Hadimkoy Lojistik Merkezi D Blok Arnavutkoy/Istanbul (Depo adresi)
  Sevk Tarihi:      2026-10-03
  Tasiyici:         Atlas Lojistik (firma araci)

  Sevkiyat Ozeti:
  Toplam Koli:      177
  Toplam Adet:      3.494
  Eksik:            6 adet (siparis: 3.500 — sevk: 3.494)
  Eksik Nedeni:     3 adet yikama fire + 3 adet 2. kalite (NCR-2026-0019)

  Not: Musteri ile eksik adet icin bilgilendirme yapildi.
  6 adet eksik tutar: ~1.770 TL (ortalama birim fiyat × 6)
  Fatura eksik miktar kadar dusulecek.
  ```
- **Beklenen:**
  - Sevkiyat kaydedildi
  - Siparis durumu "Kismi Teslim" veya "Teslim Edildi" (6 adet eksik tolere edilirse)
  - Stok miktari 3.494 adet azaldi (mamul deposu sifir veya 6 adet 2. kalite kaldi)
- [ ] GECTI / [ ] KALDI

---

# ══════════════════════════════════════════════════
# FAZ 9: FATURALAMA ve ODEME
# Bagimlilik: Faz 8 tamamlanmis olmali (Sevkiyat yapilmis)
# Tahmini Sure: 3 dakika
# Login: Elif Muhasebe
# ══════════════════════════════════════════════════

### Adim 9.1 — Irsaliye ve Satis Faturasi
- **Ekran:** `Fatura > Yeni Fatura` (veya `Satis > SIP-2026-0033 > Fatura Olustur`)
- **Login:** `elif@atlastekstil.com.tr` (Muhasebe rolu)
- **Islem:** Sevkiyata istinaden irsaliye ve satis faturasi olustur
  ```
  Fatura No:       FTR-2026-0055
  Fatura Tarihi:   2026-10-03
  Irsaliye No:     IRS-2026-0089
  Musteri:         Koton Magazacilik Tekstil San. ve Tic. A.S.
  Siparis Ref:     SIP-2026-0033
  Vade:            60 gun (2026-12-02)

  Kalemler (gerceklesen adetler uzerinden):
  ────────────────────────────────────────────────
  # | Urun              | Adet | Birim Fiyat | Tutar
  1 | ATX-GML-S-BYZ     | 100  | 285,00      | 28.500,00
  2 | ATX-GML-M-BYZ     | 200  | 285,00      | 57.000,00
  3 | ATX-GML-L-BYZ     | 300  | 285,00      | 85.500,00
  4 | ATX-GML-XL-BYZ    | 250  | 290,00      | 72.500,00
  5 | ATX-GML-XXL-BYZ   | 197  | 290,00      | 57.130,00  [*3 eksik]
  6 | ATX-GML-S-MVI     | 150  | 295,00      | 44.250,00
  7 | ATX-GML-M-MVI     | 300  | 295,00      | 88.500,00
  8 | ATX-GML-L-MVI     | 400  | 295,00      | 118.000,00
  9 | ATX-GML-XL-MVI    | 350  | 300,00      | 105.000,00
  10| ATX-GML-XXL-MVI   | 300  | 300,00      | 90.000,00
  11| ATX-GML-S-SYH     | 100  | 295,00      | 29.500,00
  12| ATX-GML-M-SYH     | 200  | 295,00      | 59.000,00
  13| ATX-GML-L-SYH     | 247  | 295,00      | 72.865,00  [*3 eksik]
  14| ATX-GML-XL-SYH    | 200  | 300,00      | 60.000,00
  15| ATX-GML-XXL-SYH   | 200  | 300,00      | 60.000,00
  ────────────────────────────────────────────────
  ARA TOPLAM:            3.494                 1.027.745,00
  KDV (%10):                                     102.774,50
  GENEL TOPLAM:                                1.130.519,50
  ```
- **Beklenen:**
  - Fatura olusturuldu, 15 kalem listeleniyor
  - Toplam tutar 1.130.519,50 TL (6 adet eksik nedeniyle orijinal tekliften 1.930,50 TL dusuk)
  - Fatura durumu "Acik"
  - KDV dogru hesaplandi
- [ ] GECTI / [ ] KALDI
- **Not:** XXL Beyaz: 200-3=197 adet, L Siyah: 250-3=247 adet (fire dagilimi bu bedenlere dusmus).

### Adim 9.2 — Odeme Takibi
- **Ekran:** `Fatura > FTR-2026-0055 > Odeme Ekle`
- **Islem:** Koton'dan gelen odemeyi kaydet
  ```
  Odeme Tarihi:    2026-12-01 (vadeden 1 gun once)
  Odeme Turu:      Banka Havalesi
  Banka:           Is Bankasi
  Tutar:           1.130.519,50 TL (tam odeme)
  Aciklama:        Koton AW26 gomlek siparisi — FTR-2026-0055
  ```
- **Beklenen:**
  - Odeme kaydedildi
  - Fatura durumu "Acik" → "Odendi" olarak degisti
  - Musteri bakiyesi sifirlandi
- [ ] GECTI / [ ] KALDI

---

# ══════════════════════════════════════════════════
# FAZ 10: RAPORLAMA ve ANALIZ
# Bagimlilik: Faz 9 tamamlanmis olmali
# Tahmini Sure: 4 dakika
# Login: Ahmet Atlas (Admin)
# ══════════════════════════════════════════════════

### Adim 10.1 — Fire/Hurda Raporu
- **Ekran:** `Raporlar > Uretim Raporu` (veya ilgili rapor ekrani)
- **Login:** `ahmet@atlastekstil.com.tr` (Admin)
- **Islem:** Siparis bazli fire raporunu goruntule
  ```
  FIRE/HURDA RAPORU — SIP-2026-0033 (Koton AW26 Gomlek)
  ═══════════════════════════════════════════════════════
  
  KUMASI FIRE:
  ─────────────
  Toplam kumasi kullanilan:  6.320 metre
  Kesim fire:                158 metre (%2.5)
  Hesaplanan net tuketim:    6.162 metre
  Sektor ortalamasi:         %3-5 (basarili)

  URETIM FIRE:
  ─────────────
  Dikis fire (tamir edilemeyen):  9 adet
  Yikama fire:                    3 adet
  2. kalite (NCR):                3 adet
  TOPLAM URETIM FIRE:            15 adet (%0.43)
  Sektor ortalamasi:             %1-2 (cok basarili)

  MALIYET ETKISI:
  ─────────────
  Kumasi fire maliyeti:      158m × ~90 TL (ort.) = 14.220 TL
  Uretim fire maliyeti:      15 adet × ~175 TL (uretim maliyeti) = 2.625 TL
  TOPLAM FIRE MALIYETI:      16.845 TL
  Satis cirosuna orani:      %1.6
  ```
- **Beklenen:** Fire raporu goruntulendi, kumasi ve uretim fire oranlari ayri ayri listelenebiliyor
- [ ] GECTI / [ ] KALDI
- **Not:** Quvex'te fire raporu dogrudan olmayabilir. Bu durumda is emri notlarindan ve stok hareketlerinden fire bilgileri toplanarak manuel hesaplanir.

### Adim 10.2 — Maliyet Karsilastirma (Planlanan vs Gerceklesen)
- **Ekran:** `Raporlar > Maliyet Raporu`
- **Islem:** Planlanan ve gerceklesen maliyetleri karsilastir
  ```
  MALIYET KARSILASTIRMA RAPORU — SIP-2026-0033
  ═════════════════════════════════════════════
  
  HAMMADDE MALIYETI:
  ──────────────────────────────────────────────
  Kalem              | Planlanan    | Gerceklesen  | Fark
  Kumasi (Beyaz)     | 161.500,00   | 161.500,00   | 0,00
  Kumasi (Mavi)      | 256.500,00   | 256.500,00   | 0,00
  Kumasi (Siyah)     | 163.400,00   | 163.400,00   | 0,00
  Aksesuar           | 49.640,00    | 49.640,00    | 0,00
  TOPLAM HAMMADDE    | 631.040,00   | 631.040,00   | 0,00

  ISCILIK MALIYETI:
  ──────────────────────────────────────────────
  Kalem              | Planlanan    | Gerceklesen  | Fark
  Kesim (3 gun)      | 18.000,00    | 18.000,00    | 0,00
  Dikis (10 gun)     | 120.000,00   | 125.000,00   | +5.000 (fazla mesai)
  Yikama (3 gun)     | 15.000,00    | 15.000,00    | 0,00
  Utu (2 gun)        | 8.000,00     | 8.000,00     | 0,00
  Paketleme (3 gun)  | 12.000,00    | 12.000,00    | 0,00
  TOPLAM ISCILIK     | 173.000,00   | 178.000,00   | +5.000

  GENEL GIDERLER:
  ──────────────────────────────────────────────
  Enerji             | 8.500,00     | 9.200,00     | +700
  Amortisman         | 5.000,00     | 5.000,00     | 0,00
  Kira (payı)        | 12.000,00    | 12.000,00    | 0,00
  TOPLAM GENEL       | 25.500,00    | 26.200,00    | +700

  ═══════════════════════════════════════════════
  TOPLAM MALIYET     | 829.540,00   | 835.240,00   | +5.700 (%0.7)
  BIRIM MALIYET      | 237,01       | 239,03       | +2,02
  ═══════════════════════════════════════════════

  KARLILK ANALIZI:
  Satis Geliri:       1.027.745,00 TL (KDV haric)
  Uretim Maliyeti:      835.240,00 TL
  BRUT KAR:             192.505,00 TL
  BRUT KAR MARJI:       %18.7

  Hedef kar marji:      %20 → Sapma: -%1.3 (dikis fazla mesaisi ve enerji artisi nedeniyle)
  ```
- **Beklenen:** Maliyet raporu goruntulendi, planlanan ve gerceklesen degerler karsilastiriliyor
- [ ] GECTI / [ ] KALDI

### Adim 10.3 — Tedarikci Degerlendirme
- **Ekran:** `Tedarikci > Soke Pamuk > Degerlendirme` (veya `Raporlar > Tedarikci Performansi`)
- **Islem:** Kumasi tedarikcisini degerlendir
  ```
  TEDARIKCI DEGERLENDIRME — Soke Pamuk Dokuma San. A.S.
  ═══════════════════════════════════════════════════════
  Degerlendirme Donemi: 2026 Q3
  Siparis Ref:          SAT-2026-0071

  KRITERLER:
  ──────────────────────────────────────────────
  # | Kriter                      | Puan (1-10) | Agirlik | Not
  1 | Teslimat Zamanliligi         | 9           | %25     | 1 gun gec (plan: 09-05, gelen: 09-06)
  2 | Miktar Uygunlugu             | 10          | %15     | Tam miktar teslim
  3 | Kalite — Gramaj              | 9           | %20     | Tum toplar tolerans icinde (MVI-T003 sinirda)
  4 | Kalite — Renk Tutarliligi    | 6           | %25     | MVI-T003 dE=1.3 (RED) — farkli boya lot
  5 | Kalite — Cekme Testi         | 8           | %10     | Kabul sinirinda
  6 | Iletisim / Dokumantasyon     | 8           | %5      | Iyi iletisim, sertifikalar tamam
  ──────────────────────────────────────────────

  AGIRLIKLI PUAN:
  (9×0.25)+(10×0.15)+(9×0.20)+(6×0.25)+(8×0.10)+(8×0.05)
  = 2.25 + 1.50 + 1.80 + 1.50 + 0.80 + 0.40
  = 8.25 / 10

  GENEL DEGERLENDIRME: IYI (8.25/10)
  
  IYILESTIRME TALEBI:
  - Boya lot tutarliligi saglanmali — tek siparis tek lot olarak sevk edilmeli
  - Farkli lot kacinilmaz ise onceden bildirilmeli ve numune gonderilmeli
  
  KARAR: Tedarikci listesinde kalir, sonraki siparislerde boya lot sarti eklenir.
  ```
- **Beklenen:** Tedarikci degerlendirme formu kaydedildi, puan goruntuleniyor
- [ ] GECTI / [ ] KALDI
- **Not:** Quvex'te tedarikci degerlendirme modulu sinirli olabilir. Bu durumda degerlendirme NCR veya musteri karti notlarina yazilir.

---

# ══════════════════════════════════════════════════
# FAZ 11: ROL BAZLI ERISIM TESTI
# Bagimlilik: Tum fazlar tamamlanmis olmali
# Tahmini Sure: 4 dakika
# ══════════════════════════════════════════════════

### Adim 11.1 — Uretim Muduru Erisim Testi
- **Ekran:** Tum ekranlar
- **Login:** `serkan@atlastekstil.com.tr` (Uretim Muduru)
- **Islem:** Asagidaki ekranlara erisimi test et
  ```
  GOREBILMELI:
  [x] Uretim > Is Emirleri (liste + detay)
  [x] Uretim > Gantt Grafigi (is emri planlama)
  [x] Stok > Stok Listesi (goruntuleme)
  [x] ShopFloor ekrani
  [x] Raporlar > Uretim Raporu

  GOREMEMELI:
  [ ] Fatura modulu → "Yetkiniz yok" mesaji
  [ ] Satis > Siparis Fiyatlari → Fiyat bilgisi gizli
  [ ] Ayarlar > Kullanicilar → "Yetkiniz yok"
  [ ] Kalite > NCR Olustur → "Yetkiniz yok" (sadece gorebilir)
  ```
- **Beklenen:** Yetkili ekranlar aciliyor, yetkisiz ekranlarda "Yetkiniz yok" (NotAuthorized) sayfasi gorunuyor
- [ ] GECTI / [ ] KALDI

### Adim 11.2 — Kalite Muduru Erisim Testi
- **Ekran:** Tum ekranlar
- **Login:** `ayse@atlastekstil.com.tr` (Kalite Muduru)
- **Islem:** Asagidaki ekranlara erisimi test et
  ```
  GOREBILMELI:
  [x] Kalite > Muayene (giris/ara/son)
  [x] Kalite > NCR (olustur + duzenle)
  [x] Kalite > CAPA
  [x] Raporlar > Kalite Raporu
  [x] Uretim > Is Emirleri (sadece goruntuleme)

  GOREMEMELI:
  [ ] Satin Alma > Yeni Siparis → "Yetkiniz yok"
  [ ] Fatura modulu → "Yetkiniz yok"
  [ ] Ayarlar > Kullanicilar → "Yetkiniz yok"
  ```
- **Beklenen:** Kalite ekranlarinda tam erisim, diger modullerde kisitlama
- [ ] GECTI / [ ] KALDI

### Adim 11.3 — Satin Alma Erisim Testi
- **Ekran:** Tum ekranlar
- **Login:** `fatma@atlastekstil.com.tr` (Satin Alma)
- **Islem:** Erisimi test et
  ```
  GOREBILMELI:
  [x] Satin Alma > Siparisler (olustur + duzenle)
  [x] Musteriler (type=suppliers — tedarikci listesi)
  [x] Stok > Mal Kabul
  [x] Stok > Stok Listesi (goruntuleme)

  GOREMEMELI:
  [ ] Uretim > Is Emri Olustur → "Yetkiniz yok"
  [ ] Kalite > NCR → "Yetkiniz yok"
  [ ] Satis > Teklif → "Yetkiniz yok"
  [ ] Ayarlar → "Yetkiniz yok"
  ```
- **Beklenen:** Satin alma ekranlarinda tam erisim, diger modullerde kisitlama
- [ ] GECTI / [ ] KALDI

### Adim 11.4 — Operator Erisim Testi (ShopFloor)
- **Ekran:** Tum ekranlar
- **Login:** `murat@atlastekstil.com.tr` (Operator)
- **Islem:** Erisimi test et
  ```
  GOREBILMELI:
  [x] ShopFloor ekrani (atanmis is emirleri)
  [x] Is emri detay (sadece atanmis olanlar)
  [x] Uretim kaydi girisi (adet, sure, not)

  GOREMEMELI:
  [ ] Sol menude sadece ShopFloor gorunmeli
  [ ] Musteri listesi → "Yetkiniz yok"
  [ ] Teklif / Siparis → "Yetkiniz yok"
  [ ] Fatura → "Yetkiniz yok"
  [ ] Stok → "Yetkiniz yok"
  [ ] Kalite → "Yetkiniz yok"
  [ ] Ayarlar → "Yetkiniz yok"
  [ ] Baska operatorun is emri gorunmemeli
  ```
- **Beklenen:** Sadece ShopFloor ekrani erislebilir, diger tum moduller engelli
- [ ] GECTI / [ ] KALDI
- **Not:** Operator en kisitli role sahip. Sadece kendisine atanmis is emirlerini gormeli ve uretim kaydi girebilmeli.

---

# ══════════════════════════════════════════════════
# SONUC VE DEGERLENDIRME
# ══════════════════════════════════════════════════

## Test Ozeti Tablosu

| Faz | Aciklama                      | Adim Sayisi | Gecti | Kaldi |
|-----|-------------------------------|-------------|-------|-------|
| 0   | Firma Kaydi ve Giris          | 3           |       |       |
| 1   | Musteri ve Tedarikci          | 3           |       |       |
| 2   | Urun ve Varyant               | 6           |       |       |
| 3   | Teklif ve Siparis             | 3           |       |       |
| 4   | Satin Alma                    | 2           |       |       |
| 5   | Mal Kabul ve Giris Kalite     | 5           |       |       |
| 6   | Uretim (Kesim-Dikim-Yika-Utu)| 8           |       |       |
| 7   | Son Muayene ve NCR            | 2           |       |       |
| 8   | Paketleme, Depo, Sevkiyat    | 3           |       |       |
| 9   | Faturalama ve Odeme           | 2           |       |       |
| 10  | Raporlama ve Analiz           | 3           |       |       |
| 11  | Rol Bazli Erisim Testi        | 4           |       |       |
| **TOPLAM** |                        | **44**      |       |       |

## Kritik Basari Kriterleri

Asagidaki kriterlerden herhangi biri basarisiz olursa, test KALDI olarak degerlendirilir:

| # | Kriter | Adim | Sonuc |
|---|--------|------|-------|
| 1 | Musteri kaydi ve teslimat adresleri dogru kaydedildi | 1.1 | [ ] |
| 2 | 15 beden-renk varyanti urun olarak olusturulabildi | 2.3 | [ ] |
| 3 | BOM tanimlanabildi (kumasi + aksesuar) | 2.5 | [ ] |
| 4 | Teklif → Siparis donusumu calisti | 3.3 | [ ] |
| 5 | Satin alma siparisi olusturulabildi | 4.1 | [ ] |
| 6 | Mal kabul sonrasi stok guncellendi | 5.1 | [ ] |
| 7 | Giris kalite muayenesi kaydedilebildi | 5.2-5.4 | [ ] |
| 8 | Is emirleri (Kesim→Dikim→Yikama→Utu) sirayla acilabildi | 6.1-6.8 | [ ] |
| 9 | AQL son muayene kaydedilebildi | 7.1 | [ ] |
| 10 | NCR olusturulabildi | 7.2 | [ ] |
| 11 | Depo girisi ve stok hareketi dogru calisti | 8.2 | [ ] |
| 12 | Fatura olusturuldu ve KDV dogru hesaplandi | 9.1 | [ ] |
| 13 | Odeme kaydedildi ve fatura kapandi | 9.2 | [ ] |
| 14 | Operator sadece ShopFloor gorebiliyor | 11.4 | [ ] |

## Tekstil Sektorune Ozel Notlar

1. **Beden-Renk Matrisi:** Quvex'te varyant modulu olmadigindan, 15 ayri urun karti olusturulmaktadir. Bu, urun listesini kalabaliklas tirir. Gelecek surumde varyant matrisi modulu eklenmesi onerilir.

2. **Kumasi Takibi (Metraj):** Kumasi stok takibi metre yerine kilogram veya top adet ile yapilabilir. Metraj-kilogram donusumu gramaj uzerinden hesaplanir: `metre = (kg × 1.000.000) / (gramaj × en_cm)`. Ornegin: `1 kg = (1.000.000) / (120 × 150) = 55.6 metre`.

3. **Boya Lot Esleme:** Tekstilde boya lot tutarliligi kritik oneme sahiptir. Ayni siparisteki tum urunlerin ayni boya lotundan kesilmesi gerekir. Farkli lotlar renk farkina neden olur. Quvex'te boya lot takibi urun notu ve muayene kaydi ile yapilir.

4. **AQL Ornekleme:** ISO 2859-1 standartindaki AQL tablolari Quvex'te dahili degildir. Kalite muduru, orneklem buyuklugunu ve kabul/red sayilarini harici tablodan bakarak girer. Gelecek surumde AQL hesaplama modulu eklenmesi onerilir.

5. **Pastal Plan:** Tekstilde kumasi verimi (marker efficiency) kritik maliyet kalemidir. %87 verim sektorde kabul edilebilir, %90+ iyi kabul edilir. Quvex'te pastal plan optimizasyonu yoktur, CAD yazilimlari (Lectra, Gerber) ile yapilir.

6. **Operasyon Sirasi:** Tekstilde standart uretim akisi: Kesim → Dikis → Yikama → Utu → Paketleme seklindedir. Her operasyon ayri is emri ile takip edilir. Is emirleri arasindaki bagimlilik referans alani ile belirtilir.

7. **Sezon Yonetimi:** Hazir giyimde sezonlar (SS=Ilkbahar/Yaz, AW=Sonbahar/Kis) kritiktir. Urun kodlarina sezon bilgisi eklenmesi (ATX-GML-**2026AW**) ve teklif/siparis bazinda sezon filtresi kullanilmasi onerilir.

---

## Ek: Tekstil Hata Siniflandirma Rehberi (AQL Referans)

Test sirasinda AQL muayenesinde kullanilmak uzere:

### Kritik Hatalar (Kabul Edilemez — Tum Lot Red)
- Igne kirigi gomlek icinde kalmiş
- Cürüyücü/toksik kimyasal kalintisi
- Yangin riski (yanici madde kalintisi)

### Major Hatalar (Fonksiyon/Satilabirlik Etkiler)
| Kod | Hata | Aciklama |
|-----|------|----------|
| M01 | Dikis patlagi | Acik dikis, dikis geri donusu yok |
| M02 | Yanlis beden | Etiket ile olcu uyumsuz |
| M03 | Yanlis renk | Siparis renginden farkli |
| M04 | Dugme eksik | Bir veya daha fazla dugme yok |
| M05 | Yaka bozuk | Simetri bozuklugu >3mm |
| M06 | Kumasi hatasi | Delik, yirtik, leke (>5mm) |
| M07 | Boy farki | Sol-sag boy farki >1cm |
| M08 | Kol farki | Sag-sol kol boy farki >1cm |
| M09 | Cep bozuklugu | Cep egri dikilmis >3mm |
| M10 | Yikama talimatı yanlis | Yanlis bakim etiketi |

### Minor Hatalar (Gorunum Etkiler, Fonksiyon Etkilemez)
| Kod | Hata | Aciklama |
|-----|------|----------|
| m01 | Iplik fazlaligi | Kesilmemis iplik ucu <3mm |
| m02 | Utu izi | Hafif parlama, kalici olmayan |
| m03 | Dikis kaymasi | <2mm dikis sapması |
| m04 | Etiket kaymasi | Etiket pozisyon sapması <5mm |
| m05 | Kucuk leke | Cikarilabilir leke <3mm |
| m06 | Renk tonu farki | Gorunur ama dE <1.0 |
| m07 | Katlanma izi | Kumasi katlanma izi (yikaninca cikar) |
| m08 | Dugme hizasi | Dugme pozisyon sapması <2mm |
| m09 | Overlok duzgunsuzlugu | Hafif overlok kaymasi |
| m10 | Ambalaj | Poset kirisik, etiket yamuk |

---

## Ek: AQL 2.5 Hizli Referans Tablosu (Normal Inspection Level II)

| Parti Buyuklugu | Orneklem | Ac (Major) | Re (Major) | Ac (Minor) | Re (Minor) |
|-----------------|----------|------------|------------|------------|------------|
| 2-8             | 2        | 0          | 1          | 0          | 1          |
| 9-15            | 3        | 0          | 1          | 0          | 1          |
| 16-25           | 5        | 0          | 1          | 1          | 2          |
| 26-50           | 8        | 0          | 1          | 1          | 2          |
| 51-90           | 13       | 1          | 2          | 1          | 2          |
| 91-150          | 20       | 1          | 2          | 2          | 3          |
| 151-280         | 32       | 2          | 3          | 3          | 4          |
| 281-500         | 50       | 3          | 4          | 5          | 6          |
| 501-1200        | 80       | 5          | 6          | 7          | 8          |
| 1201-3200       | 125      | 7          | 8          | 10         | 11         |
| **3201-10000**  | **200**  | **10**     | **11**     | **14**     | **15**     |
| 10001-35000     | 315      | 14         | 15         | 21         | 22         |

> Senaryo parti buyuklugu: 3.497 → Orneklem: 200, Major Ac/Re: 10/11, Minor Ac/Re: 14/15

---

## Ek: Kumasi Sarfiyat Hesaplama Formulu

```
Toplam Kumasi Ihtiyaci (metre) = SUM(beden_adeti × birim_sarfiyat × (1 + fire_orani))

Birim Sarfiyat (metre/adet):
  S:   1.40 m (net) × 1.07 (fire) = 1.50 m
  M:   1.52 m (net) × 1.09 (fire) = 1.65 m
  L:   1.60 m (net) × 1.09 (fire) = 1.75 m
  XL:  1.70 m (net) × 1.09 (fire) = 1.85 m
  XXL: 1.80 m (net) × 1.08 (fire) = 1.95 m

Marker Verimi = (Net Parca Alani / Serim Alani) × 100
  Hedef: >%85 (iyi), >%90 (cok iyi)
  Senaryo: %87 (iyi)

Top Sayisi = Toplam Metraj / Top Uzunlugu (ortalama 900-1100 m/top)
```

---

**Test Hazirlayan:** QA Ekibi
**Onaylayan:** _________________________
**Tarih:** 2026-04-10
**Versiyon:** 1.0

---

> Bu dokuman Quvex ERP'nin tekstil / hazir giyim sektoru icin uctan uca test senaryosudur.
> Gercek uretim ortaminda test edilmesi tavsiye edilir.
> Herhangi bir adim basarisiz olursa, detayli hata raporu (screenshot + adim no + beklenen/gerceklesen) ile JIRA'ya kaydedilmelidir.
