# Quvex ERP — Uctan Uca Test Plani v4
# Savunma Sanayi Talasli Imalat Atolyesi (5-15 CNC, 5-30 Personel)

> **Son Guncelleme:** 2026-04-08
> **Test Suresi:** ~50 dakika (68 adim)
> **Onkosul:** https://quvex.io erisilebiyor (API + DB + UI canli)
> **Hedef Profil:** Savunma yan sanayici, AS9100 gereksinimli, 8 CNC tezgah, 12 personel

---

## NASIL KULLANILIR

Bu dokuman PDF olarak yazdirilip, test ekibine dagitilabilir.
Her adimda:
- **[ ]** kutucugunu isaretleyin (gecti/kaldi)
- **Ekran** → hangi sayfa acilacak
- **Islem** → ne yapilacak
- **Beklenen** → ne olmali
- **Bagimlilk** → onceki hangi adim tamamlanmis olmali

Her faz basindaki **bagimlilk** kontrolu yapilmadan o faza gecilmez.

## SENARYO OZETI

**Firma:** Karadag Hassas Isleme San. Tic. Ltd. Sti. (8 CNC tezgah, 12 personel)
**Musteri:** ROKETSAN A.S. — hassas toleransli fuze baslik govdesi siparisi
**Urun:** RKT-BHG-7075 Fuze Baslik Govdesi (Al 7075-T6, hassas islem)
**Hammadde:** Al 7075-T6 Cubuk D80x150mm (havaclik sertifikali)
**Fason:** Sert Anodize Kaplama (dis tedarikci)
**Tolerans:** Dis cap ±0.01mm, boy ±0.05mm, ic delik H7 (kritik)

**Personel Yapisi:**
| Rol | Kisi | Not |
|-----|------|-----|
| Patron/Genel Mudur | Kemal Karadag | Admin — her seyi goruyor |
| Uretim Muduru | Serkan Usta | Uretim + is emri yonetimi |
| Kaliteci | Elif Kalite | Kalite modulleri (opsiyonel — yoksa patron yapar) |
| Operator 1 | Murat Tornaci | CNC Torna |
| Operator 2 | Hakan Frezeci | CNC Freze |
| Operator 3 | Yusuf Taslama | Taslama |
| Muhasebeci | Zeynep Muhasebe | Fatura + odeme |

> **Not:** "Kaliteci yok" senaryosunda Elif'in islemlerini Kemal (Admin) yapar.
> Test planinda bu durum `[KALITECI_YOKSA: Admin yapar]` notu ile belirtilmistir.

---

# ══════════════════════════════════════════════════
# FAZ 0: KAYIT ve GIRIS
# Bagimlilk: Yok (ilk adim)
# ══════════════════════════════════════════════════

### 0.1 Firma Kaydi
- **Ekran:** `quvex.io/register`
- **Islem:** Asagidaki bilgilerle kayit ol
  ```
  Firma Adi:    Karadag Hassas Isleme San. Tic. Ltd. Sti.
  Alt Alan:     karadaghassas
  Ad Soyad:     Kemal Karadag
  Email:        kemal@karadaghassas.com
  Telefon:      532 777 8899
  Sifre:        Karadag2026!@#$
  Sektor:       CNC / Metal Isleme Atolyesi
  ```
- **Beklenen:** "Hesabiniz basariyla olusturuldu" mesaji
- [ ] GECTI / [ ] KALDI
- **Not:**

### 0.2 Giris Yap
- **Ekran:** `quvex.io/login`
- **Islem:** Kayit oldugu email ve sifre ile giris yap
- **Beklenen:** Anasayfa acilir, menu gorunur, sektor profili CNC uyumlu
- [ ] GECTI / [ ] KALDI

### 0.3 Onboarding Wizard
- **Ekran:** Onboarding sayfasi (otomatik yonlendirme)
- **Islem:** Sektor secimini "CNC / Metal Isleme" olarak onayla
- **Beklenen:** Menu, CNC sektorune uygun modullerle yuklenmiş
- [ ] GECTI / [ ] KALDI

---

# ══════════════════════════════════════════════════
# FAZ 1: TEMEL TANIMLAR
# Bagimlilk: FAZ 0 tamamlanmis olmali
# ══════════════════════════════════════════════════

### 1.1 Birimler
- **Ekran:** Ayarlar > Birimler (`/settings/units`)
- **Islem:** Asagidaki birimleri ekle (seed data ile gelmis olabilir — kontrol et)
  ```
  Adet, Kg, Metre, Litre, Takim, Set
  ```
- **Beklenen:** 6 birim listede gorunuyor
- [ ] GECTI / [ ] KALDI

### 1.2 Roller ve Yetkilendirme
- **Ekran:** Ayarlar > Roller (`/settings/rollers`)
- **Islem:** 4 rol olustur (sablon varsa sablondan, yoksa elle)
  ```
  Rol 1: UretimMuduru
    Yetkiler: Uretim (Goruntule+Kaydet), Stok (Goruntule+Kaydet),
              Kalite (Goruntule), Musteri (Goruntule), Teklif (Goruntule)

  Rol 2: Kaliteci
    Yetkiler: Kalite (Goruntule+Kaydet), Uretim (Goruntule),
              Stok (Goruntule), Rapor (Goruntule)

  Rol 3: Operator
    Yetkiler: Uretim (Goruntule), Stok (Goruntule)
    Not: Sadece Atolye Terminali ve ilgili menuler

  Rol 4: Muhasebe
    Yetkiler: Fatura (Goruntule+Kaydet), Musteri (Goruntule),
              Stok (Goruntule), Rapor (Goruntule), Muhasebe (Goruntule+Kaydet)
  ```
- **Beklenen:** 4 rol listede, yetkiler atanmis
- [ ] GECTI / [ ] KALDI

### 1.3 Kullanicilar
- **Ekran:** Ayarlar > Kullanicilar (`/settings/users`)
- **Islem:** 6 kullanici ekle
  ```
  Serkan Usta      | serkan@karadaghassas.com  | Serkan2026!@#$ | Rol: UretimMuduru
  Elif Kalite      | elif@karadaghassas.com    | Elif2026!@#$   | Rol: Kaliteci
  Murat Tornaci    | murat@karadaghassas.com   | Murat2026!@#$  | Rol: Operator
  Hakan Frezeci    | hakan@karadaghassas.com   | Hakan2026!@#$  | Rol: Operator
  Yusuf Taslama    | yusuf@karadaghassas.com   | Yusuf2026!@#$  | Rol: Operator
  Zeynep Muhasebe  | zeynep@karadaghassas.com  | Zeynep2026!@#$ | Rol: Muhasebe
  ```
- **Beklenen:** 7 kullanici listede (Admin + 6 yeni)
- **Kontrol:** Her kullanici ile login olup menu kontrolu yap
  - Operator: sadece Atolye Terminali goruyor mu?
  - Muhasebe: sadece Finans modulleri goruyor mu?
  - Kaliteci: Kalite modulleri + Uretim goruntuleme goruyor mu?
- [ ] GECTI / [ ] KALDI

### 1.4 Is Emri Adimlari (Operasyonlar)
- **Ekran:** Ayarlar > Is Emri Adimlari (`/settings/work-order-steps`)
- **Islem:** 7 operasyon ekle
  ```
  OP10 | Testere Kesim       | Makine: -      | Setup: 10dk | Run: 3dk  | Beceri: 1-Cirak
  OP20 | CNC Torna Kaba      | Makine: CNC-T1 | Setup: 25dk | Run: 12dk | Beceri: 3-Usta
  OP30 | CNC Torna Hassas    | Makine: CNC-T1 | Setup: 15dk | Run: 18dk | Beceri: 4-Uzman
  OP40 | CNC Freze           | Makine: CNC-F1 | Setup: 30dk | Run: 15dk | Beceri: 3-Usta
  OP50 | Taslama             | Makine: TAS-01 | Setup: 20dk | Run: 8dk  | Beceri: 4-Uzman
  OP60 | Capak Alma + Yikama | Makine: -      | Setup: 5dk  | Run: 3dk  | Beceri: 1-Cirak
  OP70 | Final Olcum         | Makine: -      | Setup: 10dk | Run: 10dk | Beceri: 4-Uzman
  ```
- **Beklenen:** 7 operasyon listede, her birinde makine, sure, beceri bilgisi var
- [ ] GECTI / [ ] KALDI

> **Business:** Savunma sanayinde operasyon routing cok onemlidir. Her parca
> ayni siradan gecer, atlanma veya siralama degisikligi yapilmaz.
> Setup suresi = tezgahi hazirlama, Run suresi = parca basina islem suresi.

---

# ══════════════════════════════════════════════════
# FAZ 2: MAKINE PARKI ve DEPO YAPISI
# Bagimlilk: FAZ 1 (Birimler, Roller)
# ══════════════════════════════════════════════════

### 2.1 Makineler
- **Ekran:** Ayarlar > Makineler (`/settings/machines`)
- **Islem:** 8 makine ekle
  ```
  CNC-T1 | Doosan Lynx 220 CNC Torna       | Saat: 450 TL | Setup: 350 TL
  CNC-T2 | Mazak QT-250 CNC Torna           | Saat: 480 TL | Setup: 380 TL
  CNC-T3 | Hyundai Wia L230A CNC Torna      | Saat: 420 TL | Setup: 320 TL
  CNC-F1 | Haas VF-2SS CNC Freze            | Saat: 550 TL | Setup: 450 TL
  CNC-F2 | Haas VF-3 CNC Freze              | Saat: 580 TL | Setup: 470 TL
  CNC-F3 | DMG Mori CMX 600V CNC Freze      | Saat: 650 TL | Setup: 550 TL
  TAS-01 | Okamoto OGM-250 Silindirik Taslama| Saat: 400 TL | Setup: 300 TL
  TES-01 | Kasto Win A 3.3 Serit Testere    | Saat: 150 TL | Setup: 100 TL
  ```
- **Beklenen:** 8 makine listede, saat ucretleri girilmis
- **Kontrol:** Makine kodlari ve saat ucretleri dogru gorunuyor mu?
- [ ] GECTI / [ ] KALDI

### 2.2 Depolar
- **Ekran:** Stok > Depolar (`/warehouses`)
- **Islem:** 3 depo ekle
  ```
  DEPO-HAM  | Hammadde Deposu     | Sertifikali hammaddeler
  DEPO-YARI | Yari Mamul Deposu   | Islem arasi parcalar
  DEPO-MAM  | Mamul Deposu        | Sevkiyata hazir urunler
  ```
- **Beklenen:** 3 depo listede
- [ ] GECTI / [ ] KALDI

### 2.3 Kalibrasyon Ekipmanlari
- **Ekran:** Kalite > Kalibrasyon (`/quality/calibration`)
- **Islem:** 4 olcum aleti ekle + her birine kalibrasyon kaydi gir
  ```
  MIK-001 | Dis Mikrometre 0-25mm   | Mitutoyo 293-240 | 0.001mm | Yillik
  MIK-002 | Dis Mikrometre 25-50mm  | Mitutoyo 293-241 | 0.001mm | Yillik
  KAL-001 | Dijital Kumpas 150mm    | Mitutoyo 500-196 | 0.01mm  | 6 Aylik
  ICM-001 | Ic Mikrometre 20-50mm   | Mitutoyo 345-251 | 0.005mm | Yillik
  ```
  Her birine kalibrasyon kaydi:
  ```
  Sertifika No: KAL-[ALET-KODU]-2026
  Tarih: 2026-01-10
  Sonraki: 2027-01-10 (veya 2026-07-10, 6 aylik icin)
  Lab: TUBITAK UME
  Sonuc: GECTI
  ```
- **Beklenen:** Dashboard'da "Uyumluluk: %100" gorunuyor
- **Kontrol:** Kalibrasyon tarihleri suresi dolmus alet var mi? (olmamali)
- [ ] GECTI / [ ] KALDI

### 2.4 Genel Giderler
- **Ekran:** Uretim > Maliyet Analizi (`/production/part-cost`)
- **Islem:** 4 genel gider kalemi ekle
  ```
  Genel Imalat Giderleri  | %25
  Amortisman              | %12
  Enerji                  | %8
  Kalite Kontrol Gideri   | %5
  ```
- **Beklenen:** Toplam %50 genel gider
- [ ] GECTI / [ ] KALDI

---

# ══════════════════════════════════════════════════
# FAZ 3: MUSTERI, TEDARIKCI, URUN TANIMLARI
# Bagimlilk: FAZ 2 (Depolar, Makineler)
# ══════════════════════════════════════════════════

### 3.1 Musteri
- **Ekran:** Musteriler (`/customers`)
- **Islem:** 2 musteri ekle
  ```
  Musteri 1:
    Firma: ROKETSAN A.S.
    Yetkili: Cmdr. Yilmaz Savunma
    Email: yilmaz@roketsan.com.tr
    Telefon: 312 860 0000
    Adres: ROKETSAN Elmadag Tesisleri, Ankara
    Vergi No: 1234567890
    Doviz: TRY
    Vade: 60 gun

  Musteri 2:
    Firma: ASELSAN A.S.
    Yetkili: Dr. Ayse Elektronik
    Email: ayse@aselsan.com.tr
    Telefon: 312 592 1000
    Adres: ASELSAN Macunkoy, Ankara
    Vergi No: 9876543210
    Doviz: TRY
    Vade: 45 gun
  ```
- **Beklenen:** 2 musteri listede gorunuyor
- **Kontrol:** Adres ve iletisim bilgileri kayitli mi?
- [ ] GECTI / [ ] KALDI

### 3.2 Tedarikciler (Hammadde + Fason)
- **Ekran:** Musteriler (type: Tedarikci)
- **Islem:** 3 tedarikci ekle
  ```
  Tedarikci 1 (Hammadde):
    Firma: Alcoa Turkiye (Aluminyum)
    Yetkili: Mehmet Aluminyum
    Tip: Tedarikci (isSupplier: Evet)

  Tedarikci 2 (Hammadde):
    Firma: Boehler Turkiye (Takim Celigi)
    Yetkili: Hans Celik
    Tip: Tedarikci (isSupplier: Evet)

  Tedarikci 3 (Fason — Kaplama):
    Firma: Anodize Teknik San.
    Yetkili: Ali Kaplama
    Tip: Tedarikci (isSupplier: Evet)
    Not: Sert anodize kaplama fason tedarikcisi
  ```
- **Beklenen:** 3 tedarikci listede
- [ ] GECTI / [ ] KALDI

### 3.3 Urunler (Mamul + Hammadde)
- **Ekran:** Urunler (`/products`)
- **Islem:** 2 urun ekle
  ```
  Hammadde:
    Ad: Al 7075-T6 Cubuk D80x150mm
    Kod: HAM-AL7075-080150
    Tip: Hammadde (PRODUCTION_MATERIAL, OUTER_SUPPLY)
    Birim: Adet
    Alis Fiyati: 320 TL
    Min Stok: 100
    Not: Havaclik/savunma sertifikali aluminyum

  Mamul:
    Ad: ROKETSAN Fuze Baslik Govdesi RKT-BHG-7075
    Kod: RKT-BHG-7075
    Tip: Mamul (PRODUCTION_MATERIAL, INNER_SUPPLY)
    Birim: Adet
    Satis Fiyati: 1.850 TL
    Kalite Kontrol: Evet
    Lot Takip: Evet
    Seri Takip: Evet
    Teknik Cizim No: RKT-DWG-BHG-7075-R02
  ```
- **Beklenen:** Urunler sayfasinda 2 urun gorunuyor
- **Kontrol:** Seri Takip, Lot Takip, Kalite Kontrol isaretleri dogru mu?
- [ ] GECTI / [ ] KALDI

> **Business:** Savunma sanayinde her parca seri numarasi ile izlenir.
> Hammadde sertifikasi (MTR) olmadan uretime baslanamaZ.

### 3.4 Stok Kartlari
- **Ekran:** Stok (`/stocks`)
- **Islem:** 2 stok karti ekle
  ```
  Stok 1:
    Ad: Al 7075-T6 Cubuk D80x150mm
    Kod: STK-AL7075-080150
    Tip: STOCK
    Min Stok: 100

  Stok 2:
    Ad: ROKETSAN Fuze Baslik Govdesi
    Kod: STK-RKT-BHG-7075
    Tip: STOCK
    Min Stok: 50
  ```
- **Beklenen:** Stok sayfasinda 2 stok karti gorunuyor
- [ ] GECTI / [ ] KALDI

### 3.5 Kontrol Plani
- **Ekran:** Kalite > Kontrol Planlari (`/quality/control-plans`)
- **Islem:** Kontrol plani olustur + 6 kalem ekle + aktifles
  ```
  Plan No: KP-RKT-BHG-001
  Urun: ROKETSAN Fuze Baslik Govdesi

  Kalem 1: OP20 Torna Kaba  | Dis Cap D75    | 75.000 | ±0.100       | Kumpas     | %20  |
  Kalem 2: OP30 Torna Hassas | Dis Cap D72h6  | 72.000 | +0.000/-0.019| Mikrometre | %100 | KRITIK
  Kalem 3: OP30 Torna Hassas | Boy 142        | 142.000| ±0.050       | Kumpas     | %100 |
  Kalem 4: OP40 Freze        | Kama Gen. 8H7  | 8.000  | +0.015/-0.000| Ic Mikro   | %100 | KRITIK
  Kalem 5: OP50 Taslama      | Dis Cap D72h6  | 72.000 | +0.000/-0.019| Mikrometre | %100 | KRITIK
  Kalem 6: OP70 Final        | Yuzey Puruz Ra | 0.800  | max 0.8      | Puruzluluk | %100 | KRITIK
  ```
- **Beklenen:** Kontrol plani ACTIVE durumunda, 6 kalem gorunuyor, 4 KRITIK isaretli
- [ ] GECTI / [ ] KALDI

> **AS9100 Notu:** Kontrol plani olmadan uretime baslamak AS9100'e aykiridir.
> Kritik karakteristikler (KC) ozel isaret gerektirir.

---

# ══════════════════════════════════════════════════
# FAZ 4: MALZEME TEDARIK (Stok + Muayene + Sertifika)
# Bagimlilk: FAZ 3 (Urunler, Depolar, Tedarikciler)
# ══════════════════════════════════════════════════

### 4.1 Hammadde Stok Girisi
- **Ekran:** Stok > Giris/Cikis
- **Islem:** Stok girisi yap
  ```
  Depo: Hammadde Deposu
  Belge No: IRS-2026-001
  Kalem: STK-AL7075-080150 x 250 adet x 320 TL
  Not: 200 siparis + %25 fire payi (savunma standardi)
  ```
- **Beklenen:** Stok sayfasinda hammadde 250 adet gorunuyor
- **Kontrol:** Stok kartinda fiili stok 250 mi?
- [ ] GECTI / [ ] KALDI

### 4.2 Giris Muayenesi
- **Ekran:** Kalite > Giris Kontrol (`/quality/inspections`)
- **`[KALITECI_YOKSA: Admin yapar]`**
- **Islem:** Muayene kaydi olustur
  ```
  Urun: Al 7075-T6 Cubuk
  Tedarikci: Alcoa Turkiye
  Lot No: AL7075-LOT-2026-001
  Gelen: 250 adet
  Kabul: 250
  Red: 0
  Sonuc: GECTI
  Not: Eriyik analizi ve mekanik testler uygun
  ```
- **Beklenen:** Muayene kaydi "PASS" durumunda
- [ ] GECTI / [ ] KALDI

### 4.3 Malzeme Sertifikalari
- **Ekran:** Giris Kontrol > Sertifika ikonu (satirdaki kalkan ikonu)
- **`[KALITECI_YOKSA: Admin yapar]`**
- **Islem:** 2 sertifika yukle
  ```
  Sertifika 1:
    No: ALC-MTR-2026-0147
    Tip: MTR (Mill Test Report)
    Malzeme: Al 7075-T6 / AMS 4050 / QQ-A-250/12
    Erime No: HT-7075-2026-0042
    Not: Cekme dayanimi 503 MPa, Akmadayanimi 434 MPa, Uzama %11

  Sertifika 2:
    No: ALC-COC-2026-0147
    Tip: CoC (Certificate of Conformance)
    Not: AMS 2770 isil islem uygunlugu
  ```
- **Beklenen:** Drawer'da 2 sertifika gorunuyor (MTR + CoC)
- **Kontrol:** Sertifikalar muayene kaydina bagli mi? Erime numarasi girilmis mi?
- [ ] GECTI / [ ] KALDI

> **Savunma Notu:** Hammadde sertifikasi (MTR) olmadan malzeme uretime verilemez.
> Erime numarasi izlenebilirlik icin zorunludur. Parca → Hammadde → Erime No zinciri kurulur.

---

# ══════════════════════════════════════════════════
# FAZ 5: TEKLIF → SIPARIS DONGUSU
# Bagimlilk: FAZ 3 (Musteri, Urunler)
# ══════════════════════════════════════════════════

### 5.1 Teklif Hazirlama
- **Ekran:** Teklifler (`/offers/form`)
- **Islem:** Yeni teklif olustur
  ```
  Musteri: ROKETSAN A.S.
  Kalem: RKT-BHG-7075 x 200 adet x 1.850 TL
  Toplam: 370.000 TL
  Not: 45 is gunu teslimat, FAI ilk 5 parca zorunlu,
       tum parcalar seri numarali, malzeme sertifikasi MTR gerekli
  ```
- **Beklenen:** Teklif numarasi atanmis (T2026-XXXXX), toplam dogru
- [ ] GECTI / [ ] KALDI

> **Teknik Not:** Teklif 2 adimda olusturulur — once header (POST /Offer),
> sonra kalem (POST /OfferProduct). UI bunu tek formda yapar.

### 5.2 Teklif Onayi → Siparis
- **Ekran:** Teklifler listesi
- **Islem:**
  1. Teklif durumunu **KABUL EDILDI** yap
  2. **"Siparis Olustur"** tikla
- **Beklenen:** Satislar sayfasinda siparis gorunuyor (S2026-XXXXX)
- **Kontrol:** Siparis → Teklif iliskisi dogru mu? Adet: 200, birim fiyat: 1.850 TL
- [ ] GECTI / [ ] KALDI

---

# ══════════════════════════════════════════════════
# FAZ 6: IS EMRI SABLONU (Uretim Rotasi)
# Bagimlilk: FAZ 1.4 (Operasyonlar), FAZ 2.1 (Makineler)
# ══════════════════════════════════════════════════

### 6.1 Sablon Olustur
- **Ekran:** Ayarlar > Is Emri Sablonlari (`/settings/work-order-templates`)
- **Islem:** Sablon olustur + 7 adim ekle
  ```
  Sablon: RKT-BHG-7075 Fuze Baslik Govdesi Operasyon Rotasi

  Adim 1: OP10 Testere Kesim    | Makine: TES-01 | Setup: 10dk | Run: 3dk  | Kalite: HAYIR | Onkosul: -
  Adim 2: OP20 CNC Torna Kaba   | Makine: CNC-T1 | Setup: 25dk | Run: 12dk | Kalite: EVET  | Onkosul: 1
  Adim 3: OP30 CNC Torna Hassas  | Makine: CNC-T1 | Setup: 15dk | Run: 18dk | Kalite: EVET  | Onkosul: 2
  Adim 4: OP40 CNC Freze         | Makine: CNC-F1 | Setup: 30dk | Run: 15dk | Kalite: EVET  | Onkosul: 3
  Adim 5: OP50 Taslama           | Makine: TAS-01 | Setup: 20dk | Run: 8dk  | Kalite: EVET  | Onkosul: 4
  Adim 6: OP60 Capak + Yikama    | Makine: -      | Setup: 5dk  | Run: 3dk  | Kalite: HAYIR | Onkosul: 5
  Adim 7: OP70 Final Olcum       | Makine: -      | Setup: 10dk | Run: 10dk | Kalite: EVET  | Onkosul: 6
  ```
- **Beklenen:** 7 adimli sablon, surukle-birak ile siralanabilir
- **Kontrol:** Prerequisite baglantilari dogru mu? Kalite kontrol isaretleri 5/7 mi?
- [ ] GECTI / [ ] KALDI

> **Business:** Bu rota ROKETSAN sozlesmesine ozgudur. Her farkli parca icin
> ayri sablon olusturulur. Savunma sanayinde rota degisikligi ECN gerektirir.

---

# ══════════════════════════════════════════════════
# FAZ 7: SIPARIS ONAY → URETIM EMRI
# Bagimlilk: FAZ 5 (Siparis), FAZ 6 (Sablon)
# ══════════════════════════════════════════════════

### 7.1 Sozlesme Gozden Gecirme (Contract Review)
- **Ekran:** Satislar → siparis detay
- **`[KALITECI_YOKSA: Admin yapar]`**
- **Islem:** Sozlesme gozden gecirme formu doldur
  ```
  Teknik yeterlilik: EVET (8 CNC tezgah, Al 7075 deneyimi var)
  Kapasite: EVET (gunluk 8 parca, 200 parca = 25 is gunu)
  Hammadde: EVET (250 adet stokta, 200 gerekli)
  Ozel gereksinim: FAI ilk 5 parca, seri numara zorunlu
  Sonuc: ONAYLANDI
  ```
- **Beklenen:** Contract Review kaydi olusturuldu, durum ONAYLANDI
- [ ] GECTI / [ ] KALDI

> **AS9100 Notu:** Siparis onaylamadan once sozlesme gozden gecirme (8.2.3) zorunludur.
> Teknik yeterlilik, kapasite ve hammadde yeterliligi degerlendirilir.

### 7.2 Siparis Onay Akisi
- **Ekran:** Satislar → siparis detay
- **Islem:** 3 adimli onay:
  1. **"Onay Talep Et"** → Durum: ONAY BEKLIYOR
  2. **"Onayla"** → Durum: ONAYLANDI
  3. **"Uretime Aktar"** → Uretim emri olusturulur
- **Beklenen:** Uretim sayfasinda yeni uretim emri gorunuyor
- **Kontrol:** Siparis durumu "URETIMDE" mi?
- [ ] GECTI / [ ] KALDI

### 7.3 Is Emri Atama
- **Ekran:** Uretim > detay > sag panel
- **Islem:** "Is Emri Olustur" → Sablon sec (RKT-BHG-7075)
- **Beklenen:** Uretim Durumu sekmesinde 7 operasyon adimi gorunuyor
- **Kontrol:** Progress stepper calisiyor mu? Adimlar sirali mi?
- [ ] GECTI / [ ] KALDI

---

# ══════════════════════════════════════════════════
# FAZ 8: ATOLYE TERMINALI (OPERATOR AKISI)
# Bagimlilk: FAZ 7 (Uretim Emri + Is Emirleri)
# ══════════════════════════════════════════════════

### 8.1 Operator Girisi
- **Ekran:** Login → `murat@karadaghassas.com`
- **Islem:** Operator (Murat Tornaci) olarak giris yap
- **Beklenen:** Sadece Atolye Terminali ve ilgili menuler gorunuyor
- [ ] GECTI / [ ] KALDI

### 8.2 OP10 — Testere Kesim
- **Ekran:** Atolye Terminali (`/shop-floor-terminal`)
- **Islem:**
  1. Sag panelde "Bugunku Is Emirleri" listesinden **OP10 Testere Kesim** sec
  2. **BASLAT** → zamanlayici calismaya baslar
  3. Miktar gir: **200**
  4. **TAMAMLA** → Kalite kontrol yok (RequiresQualityCheck=false), direkt tamamlanir
- **Beklenen:**
  - Is emri OP10 olarak gorunuyor (GUID degil)
  - Urun: ROKETSAN Fuze Baslik Govdesi
  - Durum: TAMAMLANDI
- [ ] GECTI / [ ] KALDI

### 8.3 OP20 — CNC Torna Kaba
- **Ekran:** Atolye Terminali
- **Islem:**
  1. **OP20 CNC Torna Kaba** sec
  2. **BASLAT** → zamanlayici baslar
  3. 2 dakika calistir → **DURDUR**
  4. Durma nedeni modali: **"Takim Degisimi"** sec → Durdur
  5. **DEVAM ET** → zamanlayici devam
  6. Miktar: **200**
  7. **TAMAMLA** → Olcum modali acilir (RequiresQualityCheck=true)
  8. Olcumleri gir:
     ```
     Dis Cap D75: 75.05 → YESIL (tolerans ±0.100 icinde)
     ```
  9. **"Olcumleri Kaydet & Tamamla"**
- **Beklenen:**
  - DURDUR'da kontroller devre disi
  - PAUSED'da miktar degistirilemez
  - Olcum modali buyuk inputlarla, gercek zamanli pass/fail gosteriyor
- [ ] GECTI / [ ] KALDI

### 8.4 OP30 — CNC Torna Hassas (Kritik Operasyon)
- **Ekran:** Atolye Terminali
- **Islem:**
  1. **OP30 CNC Torna Hassas** sec → BASLAT
  2. Miktar: **200**
  3. **TAMAMLA** → Olcum modali
  4. Olcumleri gir:
     ```
     Dis Cap D72h6:  71.990 → YESIL (tolerans +0.000/-0.019, olculen 71.990 > 71.981)
     Boy 142:        141.97 → YESIL (tolerans ±0.050)
     ```
  5. Kaydet & Tamamla
- **Beklenen:** Kritik olculer YESIL, tum degerler tolerans icinde
- [ ] GECTI / [ ] KALDI

### 8.5 Kalite Onay — OP20 & OP30
- **Ekran:** Login → `elif@karadaghassas.com` (Kaliteci)
- **`[KALITECI_YOKSA: Admin (kemal@karadaghassas.com) yapar]`**
- **Islem:**
  1. Kalite > **Operasyon Muayeneleri** (`/quality/operation-inspections`)
  2. OP20 ve OP30 "Bekliyor" olarak gorunmeli
  3. OP20 icin **"Onayla"** → not: "Kaba torna uygun" → onayla
  4. OP30 icin **"Onayla"** → not: "Hassas torna kritik olculer uygun" → onayla
- **Beklenen:**
  - OP20, OP30 "Onaylandi" (yesil) gorunuyor
  - OP40 artik baslatilabilir (prerequisite karsilandi)
- [ ] GECTI / [ ] KALDI

> **AS9100 Notu:** Operasyon kalite onayi ayri ekranda yapilir.
> Operatorun kendi isini kendi kontrol etmesi yasagi vardir.
> Kaliteci yoksa patron/yonetici yapar, ama ayni kisi uretim+kalite YAPMAMALIDIR.

### 8.6 OP40-OP70 Tamamlama
- **Islem:** Her operasyon icin 8.3/8.4 + 8.5 adimlarini tekrarla
  ```
  OP40 CNC Freze:
    Operator: Hakan (hakan@karadaghassas.com ile login)
    Olcum: Kama Gen. 8H7 → 8.008 (YESIL, tolerans +0.015/-0.000)
    Kaliteci onay: EVET

  OP50 Taslama:
    Operator: Yusuf (yusuf@karadaghassas.com ile login)
    Olcum: Dis Cap D72h6 → 71.993 (YESIL)
    Kaliteci onay: EVET

  OP60 Capak + Yikama:
    Operator: Murat
    Kalite kontrol YOK → direkt tamamlanir

  OP70 Final Olcum:
    Operator: Elif (Kaliteci) veya Admin
    Olcum: Yuzey Puruz Ra → 0.65 (YESIL, max 0.8)
    Kaliteci onay: EVET (son operasyon, baskasi onaylamali)
  ```
- **Kontrol:** Prerequisite calisiyor mu? OP40, OP30 kalite onayi olmadan baslatilamamali
- [ ] GECTI / [ ] KALDI

---

# ══════════════════════════════════════════════════
# FAZ 9: FASON IS (Sert Anodize Kaplama)
# Bagimlilk: FAZ 3 (Fason Tedarikci), FAZ 8 (Uretim tamamlanmis)
# ══════════════════════════════════════════════════

### 9.1 Fason Siparis Olustur
- **Ekran:** Uretim > Fason Is Emirleri (`/subcontract-orders`)
- **Islem:** Fason siparis olustur
  ```
  Tedarikci: Anodize Teknik San.
  Proses: Sert Anodize Kaplama (SURFACE_TREATMENT)
  Urun: RKT-BHG-7075
  Adet: 200
  Fiyat: 25 TL/adet
  Toplam: 5.000 TL
  Beklenen Donus: 7 is gunu
  Muayene Gerekli: EVET
  Ozel Not: MIL-A-8625 Type III, Class 2, 50±5 mikron
  ```
- **Beklenen:** Fason siparis listede, geri sayim badge gorunuyor
- **Kontrol:** Status workflow: DRAFT → SENT → AT_SUPPLIER → COMPLETED → INSPECTED
- [ ] GECTI / [ ] KALDI

### 9.2 Fason Donus + Muayene
- **Islem:**
  1. Fason siparis durumunu **AT_SUPPLIER** → **COMPLETED** yap
  2. Giris muayenesi olustur (kaplama kalinligi olcumu)
  3. Sonuc: GECTI
- **Beklenen:** Fason siparis INSPECTED durumunda
- [ ] GECTI / [ ] KALDI

---

# ══════════════════════════════════════════════════
# FAZ 10: KALITE OLAYLARI
# Bagimlilk: FAZ 8 (Uretim yapilmis olmali)
# ══════════════════════════════════════════════════

### 10.1 FAI (Ilk Parca Muayenesi)
- **Ekran:** Kalite > FAI (`/quality/fai`)
- **`[KALITECI_YOKSA: Admin yapar]`**
- **Islem:** FAI olustur + 6 karakteristik + onayla
  ```
  Tip: FULL | Neden: Yeni Parca | Sozlesme: ROKETSAN
  Parca: RKT-BHG-7075

  Karakteristik 1: Dis Cap D72h6     | 72.000 | +0.000/-0.019 | 71.992 | GECTI | KRITIK
  Karakteristik 2: Boy 142           | 142.000| ±0.050        | 141.98 | GECTI
  Karakteristik 3: Kama Gen. 8H7     | 8.000  | +0.015/-0.000 | 8.007  | GECTI | KRITIK
  Karakteristik 4: Yuzey Puruz Ra    | 0.800  | max 0.8       | 0.62   | GECTI | KRITIK
  Karakteristik 5: Sertlik (HRB)     | 85.0   | min 80        | 87.5   | GECTI
  Karakteristik 6: Anodize Kalinlik  | 50.0   | ±5.0 mikron   | 48.5   | GECTI | KRITIK
  ```
- **Beklenen:** FAI "APPROVED" durumunda, 6 karakteristik, 4 KRITIK
- **Kontrol:** AS9102 PDF raporu indirilebiliyor mu?
- [ ] GECTI / [ ] KALDI

> **Savunma Notu:** ROKETSAN sozlesmesi FAI zorunlu kilar. Ilk 5 parca tam olcum
> yapilir, musteriye rapor gonderilir. FAI onaylanmadan seri uretime gecilemez.

### 10.2 NCR (Uygunsuzluk Raporu)
- **Ekran:** Kalite > Uygunsuzluk (`/quality/ncr`)
- **`[KALITECI_YOKSA: Admin yapar]`**
- **Islem:** NCR ac + workflow tamamla
  ```
  Siddet: MAJOR
  Urun: RKT-BHG-7075
  Etkilenen: 5 adet (OP50 taslamada dis cap tolerans disi)
  Tanim: 5 parca D72h6 dis cap 71.960mm olculmus, spec: min 71.981mm
         Taslik asinmasi nedeniyle tolerans disi uretim

  Workflow:
    OPEN → UNDER_REVIEW → CORRECTIVE_ACTION → CLOSED
    Kok Neden: Taslik asinma limiti asilmis, dressleme peryodu 80 parca
    Duzeltici: Taslik degistirildi, dressleme peryodu 40 parcaya dusuruldu
    Onleyici: Tum taslama makineleri icin SPC kontrol karti baslatildi
    Disposition: 5 parca HURDA (scrap) → ROKETSAN onayiyla imha
  ```
- **Beklenen:** NCR "CLOSED" durumunda, kok neden girilmis, disposition belirlenmis
- **Kontrol:** Kok neden girilmeden NCR kapatilamiyor mu? (AS9100 zorunlulugu)
- [ ] GECTI / [ ] KALDI

### 10.3 CAPA (Duzeltici & Onleyici Faaliyet)
- **Ekran:** Kalite > CAPA (`/quality/capa`)
- **`[KALITECI_YOKSA: Admin yapar]`**
- **Islem:** CAPA olustur
  ```
  Tip: Duzeltici (CORRECTIVE)
  Kaynak: NCR (yukardaki)
  Oncelik: Yuksek
  Kok Neden: 5 Neden analizi → Taslik asinma takibi yetersiz
  Aksiyon 1: Dressleme peryodu 80 → 40 parcaya dusuruldu
  Aksiyon 2: Taslama operasyonu icin SPC kontrol karti baslatildi
  Aksiyon 3: Operator egitimi planlanacak (taslik asinma belirtileri)
  Hedef Tarih: 2026-04-15
  ```
- **Beklenen:** CAPA olusturuldu, aksiyonlar atanmis
- [ ] GECTI / [ ] KALDI

### 10.4 Giris Muayenesi (Fason Donus)
- **Ekran:** Kalite > Giris Kontrol (`/quality/inspections`)
- **`[KALITECI_YOKSA: Admin yapar]`**
- **Islem:** Fason donus muayenesi
  ```
  Urun: RKT-BHG-7075 (anodize sonrasi)
  Tedarikci: Anodize Teknik
  Lot No: ANO-LOT-2026-001
  Gelen: 195 adet (5 hurda NCR'de)
  Kabul: 195
  Red: 0
  Sonuc: GECTI
  Olcum: Kaplama kalinligi 48-52 mikron arasi (spec: 50±5)
  ```
- **Beklenen:** Muayene kaydi PASS
- [ ] GECTI / [ ] KALDI

---

# ══════════════════════════════════════════════════
# FAZ 11: FINANS KURULUMU
# Bagimlilk: Yok (bagimsiz)
# ══════════════════════════════════════════════════

### 11.1 Kasa ve Banka Hesaplari
- **Ekran:** Finans > Kasa/Banka (`/accounting/cash-bank`)
- **Islem:** 2 hesap olustur
  ```
  KAS-01 | Atolye Kasasi    | Kasa  | TRY | Acilis: 25.000 TL
  BNK-01 | Ziraat Bankasi   | Banka | TRY | Acilis: 150.000 TL
           IBAN: TR33 0001 0012 3456 7890 1234 56
  ```
- **Beklenen:** Kasa 25.000 + Banka 150.000 = Toplam 175.000 TL
- [ ] GECTI / [ ] KALDI

---

# ══════════════════════════════════════════════════
# FAZ 12: FATURA ve ODEME
# Bagimlilk: FAZ 5 (Siparis), FAZ 11 (Kasa/Banka)
# ══════════════════════════════════════════════════

### 12.1 Satis Faturasi
- **Ekran:** Faturalar (`/invoices/form`)
- **Islem:** Satis faturasi olustur
  ```
  Musteri: ROKETSAN A.S.
  Kalem: Fuze Baslik Govdesi x 195 adet x 1.850 TL = 360.750 TL
  KDV: %20 = 72.150 TL
  Toplam: 432.900 TL
  Vade: 60 gun
  Not: 5 parca hurda (NCR), 195 adet sevk edildi
  ```
- **Beklenen:** Fatura numarasi (FTR-2026-XXXXX), toplam 432.900 TL
- [ ] GECTI / [ ] KALDI

### 12.2 Fatura Gonderme + Odeme
- **Islem:**
  1. Fatura durumunu **GONDERILDI** yap
  2. Odeme ekle: 200.000 TL Havale (Ziraat)
  3. Odeme ekle: 232.900 TL Havale (Ziraat)
- **Beklenen:** Fatura "ODENDI", Cari bakiye 0
- **Kontrol:** Banka bakiyesi: 150.000 + 200.000 + 232.900 = 582.900 TL
- [ ] GECTI / [ ] KALDI

### 12.3 Alis Faturasi (Hammadde)
- **Ekran:** Faturalar > Alis Faturasi
- **Islem:** Tedarikci faturasi gir
  ```
  Tedarikci: Alcoa Turkiye
  Kalem: Al 7075-T6 Cubuk 250 x 320 TL = 80.000 TL + KDV %20 = 96.000 TL
  ```
- **Kontrol:** Cari: Alcoa'ya 96.000 TL borclu
- [ ] GECTI / [ ] KALDI

### 12.4 Alis Faturasi (Fason)
- **Islem:** Fason faturasi gir
  ```
  Tedarikci: Anodize Teknik
  Kalem: Sert Anodize 200 x 25 TL = 5.000 TL + KDV = 6.000 TL
  ```
- [ ] GECTI / [ ] KALDI

### 12.5 Tedarikci Odemeleri
- **Islem:**
  1. Alcoa odemesi: 96.000 TL Havale (Ziraat)
  2. Anodize Teknik odemesi: 6.000 TL Nakit (Kasa)
- **Kontrol:** Cariler 0, Kasa: 25.000 - 6.000 = 19.000, Banka: 582.900 - 96.000 = 486.900
- [ ] GECTI / [ ] KALDI

---

# ══════════════════════════════════════════════════
# FAZ 13: BAKIM
# Bagimlilk: FAZ 2 (Makineler)
# ══════════════════════════════════════════════════

### 13.1 Onleyici Bakim Plani
- **Ekran:** Bakim > Bakim Planlari
- **Islem:** 2 bakim plani olustur
  ```
  Plan 1:
    Makine: CNC-T1 (Doosan Lynx)
    Baslik: Haftalik CNC Bakim
    Tip: ONLEYICI (PREVENTIVE)
    Frekans: Haftalik
    Kontrol Listesi:
      - Yaglama kontrol
      - Sogutma sivisi seviye
      - Spindle sicakligi
    Tahmini Sure: 1 saat

  Plan 2:
    Makine: TAS-01 (Okamoto Taslama)
    Baslik: Taslik Dressleme Kontrol
    Tip: ONLEYICI (PREVENTIVE)
    Frekans: Her 40 parca (NCR sonucu eklendi)
    Tahmini Sure: 30 dakika
  ```
- **Beklenen:** 2 bakim plani listede
- [ ] GECTI / [ ] KALDI

### 13.2 Bakim Is Emri
- **Islem:** Plan 1'den "Is Emri Olustur" tikla → tamamla
- **Beklenen:** Bakim is emri olusturuldu ve tamamlandi
- [ ] GECTI / [ ] KALDI

---

# ══════════════════════════════════════════════════
# FAZ 14: IK ve VARDIYA
# Bagimlilk: FAZ 1 (Kullanicilar)
# ══════════════════════════════════════════════════

### 14.1 Vardiya Tanimlama
- **Ekran:** IK > Vardiya Planlama
- **Islem:** 2 vardiya olustur
  ```
  Vardiya 1: Sabah | 07:00 - 16:00 | Mola: 60dk
  Vardiya 2: Aksam | 16:00 - 00:00 | Mola: 45dk
  ```
- [ ] GECTI / [ ] KALDI

### 14.2 Devam Takibi
- **Islem:** 3 operator icin giris/cikis kaydi olustur
- [ ] GECTI / [ ] KALDI

### 14.3 Izin Talebi
- **Islem:** Murat Tornaci icin 2 gunluk yillik izin talebi → Onayla
- [ ] GECTI / [ ] KALDI

### 14.4 Operator Yetkinlik
- **Islem:** Murat'a CNC Torna yetkinligi (Seviye: Uzman), Hakan'a CNC Freze (Seviye: Usta) ekle
- [ ] GECTI / [ ] KALDI

---

# ══════════════════════════════════════════════════
# FAZ 15: RAPORLAR ve DASHBOARD
# Bagimlilk: FAZ 8-12 (Veri olmali)
# ══════════════════════════════════════════════════

### 15.1 Yonetim Kokpiti
- **Ekran:** Yonetim Kokpiti (`/executive-dashboard`)
- **Kontrol:**
  - [ ] Toplam gelir: 432.900 TL gorunuyor
  - [ ] Acik NCR: 0 (kapatilmis)
  - [ ] Uretim tamamlanma: %100
  - [ ] Hurda orani: 5/200 = %2.5

### 15.2 Kalite Dashboard
- **Ekran:** Kalite > Dashboard
- **Kontrol:**
  - [ ] NCR ozet: 1 kapatilmis (MAJOR)
  - [ ] CAPA: 1 acik
  - [ ] FAI: 1 onaylanmis
  - [ ] Kalibrasyon: %100 uyumlu

### 15.3 Maliyet Analizi
- **Ekran:** Uretim > Maliyet Analizi (`/production/part-cost`)
- **Kontrol:**
  - [ ] Malzeme maliyeti: 320 TL/parca
  - [ ] Fason maliyeti: 25 TL/parca
  - [ ] Makine + iscilik + genel gider kirilimi gorunuyor
  - [ ] Birim maliyet hesaplandi
  - [ ] Kar marji: (1.850 - birim maliyet) gorunuyor

### 15.4 Tedarikci Degerlendirme
- **Ekran:** Kalite > Tedarikci Degerlendirme
- **Islem:** Alcoa ve Anodize Teknik icin degerlendirme yap
  ```
  Alcoa: Kalite %98, Teslimat %95, Fiyat %85
  Anodize Teknik: Kalite %100, Teslimat %90, Fiyat %80
  ```
- [ ] GECTI / [ ] KALDI

---

# ══════════════════════════════════════════════════
# BAGIMLILK DIAGRAMI
# ══════════════════════════════════════════════════

```
FAZ 0 (Kayit + Giris + Onboarding)
  │
  ├── FAZ 1 (Birimler, Roller, Kullanicilar, Operasyonlar)
  │     │
  │     ├── FAZ 2 (Makineler, Depolar, Kalibrasyon, Genel Gider)
  │     │     │
  │     │     ├── FAZ 6 (Is Emri Sablonu) ← Operasyonlar + Makineler
  │     │     │
  │     │     ├── FAZ 13 (Bakim) ← Makineler
  │     │     │
  │     │     └── FAZ 3 (Musteri, Tedarikci, Urunler, Stok, Kontrol Plani)
  │     │           │
  │     │           ├── FAZ 4 (Stok Girisi → Muayene → Sertifika) ← Depo + Urun + Tedarikci
  │     │           │
  │     │           ├── FAZ 5 (Teklif → Siparis) ← Musteri + Urun
  │     │           │     │
  │     │           │     └── FAZ 7 (Contract Review → Onay → Uretim Emri + Is Emri) ← Sablon
  │     │           │           │
  │     │           │           └── FAZ 8 (Atolye Terminali — 7 Operasyon) ← Operator + Is Emri
  │     │           │                 │
  │     │           │                 ├── FAZ 9 (Fason Is — Anodize Kaplama)
  │     │           │                 │
  │     │           │                 └── FAZ 10 (Kalite: FAI, NCR, CAPA, Muayene)
  │     │           │
  │     │           └── FAZ 12 (Fatura + Odeme) ← Siparis + Kasa/Banka
  │     │
  │     └── FAZ 14 (IK, Vardiya, Yetkinlik) ← Kullanicilar
  │
  ├── FAZ 11 (Kasa/Banka Kurulumu) ← bagimsiz
  │
  └── FAZ 15 (Raporlar, Dashboard, Maliyet) ← Tum veriler
```

---

# ══════════════════════════════════════════════════
# SONUC TABLOSU
# ══════════════════════════════════════════════════

| Faz | Baslik | Adim | Gecti | Kaldi | Not |
|-----|--------|------|-------|-------|-----|
| 0 | Kayit + Giris + Onboarding | 3 | | | |
| 1 | Birimler + Roller + Kullanicilar + Operasyonlar | 4 | | | |
| 2 | Makine + Depo + Kalibrasyon + Genel Gider | 4 | | | |
| 3 | Musteri + Tedarikci + Urun + Stok + Kontrol Plani | 5 | | | |
| 4 | Stok Girisi + Muayene + Sertifika | 3 | | | |
| 5 | Teklif → Siparis | 2 | | | |
| 6 | Is Emri Sablonu | 1 | | | |
| 7 | Contract Review + Siparis Onay → Uretim | 3 | | | |
| 8 | Atolye Terminali (7 Operasyon + Kalite Onay) | 6 | | | |
| 9 | Fason Is (Anodize Kaplama) | 2 | | | |
| 10 | FAI + NCR + CAPA + Muayene | 4 | | | |
| 11 | Kasa/Banka Kurulumu | 1 | | | |
| 12 | Fatura + Odeme (Satis + Alis + Fason) | 5 | | | |
| 13 | Bakim | 2 | | | |
| 14 | IK + Vardiya + Yetkinlik | 4 | | | |
| 15 | Raporlar + Dashboard + Maliyet | 4 | | | |
| **TOPLAM** | | **53** | | | |

---

# ══════════════════════════════════════════════════
# KALITECI YOK SENARYOSU — FARKLILKLAR
# ══════════════════════════════════════════════════

Asagidaki adimlar kaliteci yoksa Admin (Kemal Karadag) tarafindan yapilir:

| Faz | Adim | Normal | Kaliteci Yoksa |
|-----|------|--------|----------------|
| 1.2 | Rol olusturma | Kaliteci rolu eklenir | Kaliteci rolu EKLENMEZ |
| 1.3 | Kullanici | Elif eklenir | Elif EKLENMEZ (6 degil 5 kullanici) |
| 4.2 | Giris muayenesi | Elif yapar | Admin yapar |
| 4.3 | Sertifika | Elif yapar | Admin yapar |
| 7.1 | Contract Review | Elif yapar | Admin yapar |
| 8.5 | Operasyon kalite onay | Elif yapar | Admin yapar |
| 10.1 | FAI | Elif yapar | Admin yapar |
| 10.2 | NCR | Elif yapar | Admin yapar |
| 10.3 | CAPA | Elif yapar | Admin yapar |
| 10.4 | Giris muayenesi | Elif yapar | Admin yapar |

> **Uyari:** Kaliteci yoksa ayni kisi hem uretim hem kalite yapacagi icin
> AS9100 acisindan risk olusturur. Savunma musterileri bunu sorgulayabilir.

---

**Test Eden:** ___________________
**Tarih:** ___________________
**Imza:** ___________________
**Senaryo:** [ ] Tam Ekip (Kaliteci var) / [ ] Minimal (Kaliteci yok)

> Bu test plani `defense-cnc-full-e2e.spec.js` otomatik testi ile dogrulanacaktir.
