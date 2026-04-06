# Quvex ERP — Uctan Uca Test Plani v3
# Talasli Imalat Atölyesi (5-10 CNC Tezgah)

> **Son Guncelleme:** 2026-04-06
> **Test Suresi:** ~35 dakika (52 adim)
> **Onkosul:** API + DB + UI calisiyor
> **Test Sonucu:** 75/79 OK, 4 WARN, 0 FAIL (otomatik test ile dogrulanmis)

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

---

# ══════════════════════════════════════════════════
# FAZ 0: KAYIT ve GIRIS
# Bagimlilk: Yok (ilk adim)
# ══════════════════════════════════════════════════

### 0.1 Firma Kaydi
- **Ekran:** `localhost:3000/register`
- **Islem:** Asagidaki bilgilerle kayit ol
  ```
  Firma Adi:    Demir CNC Hassas Isleme
  Alt Alan:     demircnc
  Ad Soyad:     Ahmet Demir
  Email:        ahmet@demircnc.com
  Telefon:      532 111 2233
  Sifre:        Test1234!@#$
  Sektor:       CNC / Metal Isleme Atolyesi
  ```
- **Beklenen:** "Hesabiniz basariyla olusturuldu" mesaji
- [ ] GECTI / [ ] KALDI
- **Not:**

### 0.2 Giris Yap
- **Ekran:** `localhost:3000/login`
- **Islem:** Kayit oldugu email ve sifre ile giris yap
- **Beklenen:** Anasayfa acilir, menu gorunur
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
  Adet, Kg, Metre, Litre, Takim
  ```
- **Beklenen:** 5 birim listede gorunuyor
- [ ] GECTI / [ ] KALDI

### 1.2 Roller ve Kullanicilar
- **Ekran:** Ayarlar > Kullanicilar (`/settings/users`)
- **Islem:** 2 yeni kullanici ekle
  ```
  Kullanici 1:
    Ad: Mustafa Tornaci
    Email: mustafa@demircnc.com
    Sifre: Test1234!@#$
    Rol: Operator

  Kullanici 2:
    Ad: Mehmet Kaliteci
    Email: mehmet@demircnc.com
    Sifre: Test1234!@#$
    Rol: Kalite
  ```
- **Beklenen:** 3 kullanici listede (Admin + Operator + Kaliteci)
- **Kontrol:** Her kullanici ile ayri ayri login olup menu kontrolu yap
  - Operator: sadece Uretim + Atolye Terminali goruyor mu?
  - Kaliteci: sadece Kalite modulleri goruyor mu?
- [ ] GECTI / [ ] KALDI

### 1.3 Is Emri Adimlari (Operasyonlar)
- **Ekran:** Ayarlar > Is Emri Adimlari (`/settings/work-order-steps`)
- **Islem:** 5 operasyon ekle (seed data ile gelenlere ek olarak)
  ```
  OP10 | CNC Torna          | Makine: CNC-01 | Setup: 20dk | Run: 8dk  | Beceri: 3-Usta
  OP20 | CNC Freze           | Makine: CNC-02 | Setup: 30dk | Run: 12dk | Beceri: 3-Usta
  OP30 | Taslama             | Makine: TAS-01 | Setup: 15dk | Run: 5dk  | Beceri: 4-Uzman
  OP40 | Capak Alma          | Makine: -      | Setup: 5dk  | Run: 2dk  | Beceri: 1-Cirak
  OP50 | Final Kontrol       | Makine: -      | Setup: 10dk | Run: 5dk  | Beceri: 4-Uzman
  ```
- **Beklenen:** Her operasyonda makine, setup/run suresi, takim bilgisi, beceri seviyesi girilmis
- [ ] GECTI / [ ] KALDI

> **Business:** Operasyon adimlari uretim rotasinin temelidir. Her parca bu
> adimlardan gecer. Setup suresi = makineyi hazirlama, Run suresi = parca basina islem.

---

# ══════════════════════════════════════════════════
# FAZ 2: MAKINE ve DEPO
# Bagimlilk: FAZ 1 (Birimler, Roller)
# ══════════════════════════════════════════════════

### 2.1 Makineler
- **Ekran:** Ayarlar > Makineler (`/settings/machines`)
- **Islem:** 5 makine ekle
  ```
  T01  | Doosan Lynx 220 CNC Torna | Saat: 400 TL | Setup: 300 TL
  T02  | Mazak QT-200 CNC Torna    | Saat: 420 TL | Setup: 320 TL
  F01  | Haas VF-2 CNC Freze       | Saat: 500 TL | Setup: 400 TL
  F02  | Haas VF-3 CNC Freze       | Saat: 520 TL | Setup: 420 TL
  TAS  | Okamoto OGM-250 Taslama   | Saat: 350 TL | Setup: 250 TL
  ```
- **Beklenen:** 5 makine listede, saat ucretleri girilmis
- **Kontrol:** Saat ucreti ve setup ucreti alanlari gorunuyor mu?
- [ ] GECTI / [ ] KALDI

### 2.2 Depolar
- **Ekran:** Stok > Depolar (`/warehouses`)
- **Islem:** 2 depo ekle
  ```
  DEPO-HAM | Hammadde Deposu    | Hammadde ve yari mamul
  DEPO-MAM | Mamul Deposu       | Bitmis urun, sevkiyat oncesi
  ```
- **Beklenen:** 2 depo listede
- [ ] GECTI / [ ] KALDI

### 2.3 Kalibrasyon Ekipmanlari
- **Ekran:** Kalite > Kalibrasyon (`/quality/calibration`)
- **Islem:** 3 olcum aleti ekle + her birine kalibrasyon kaydi gir
  ```
  MIK-01 | Dis Mikrometre 0-25mm | Mitutoyo  | 0.001mm | Yillik
  KAL-01 | Dijital Kumpas 150mm  | Mitutoyo  | 0.01mm  | 6 Aylik
  UC-01  | Uc Olcer M6 Go/NoGo   | -         | Go/NoGo | Yillik
  ```
  Her birine kalibrasyon kaydi:
  ```
  Sertifika No: KAL-MIK01-2026
  Tarih: 2026-01-15
  Sonraki: 2027-01-15
  Lab: Turk Loydu
  Sonuc: GECTI
  ```
- **Beklenen:** Dashboard'da "Uyumluluk: %100" gorunuyor
- [ ] GECTI / [ ] KALDI

### 2.4 Genel Gider
- **Ekran:** Uretim > Maliyet Analizi (`/production/part-cost`)
- **Islem:** 3 genel gider kalemi ekle
  ```
  Genel Imalat Giderleri  | %25
  Amortisman              | %10
  Enerji                  | %8
  ```
- **Beklenen:** Toplam %43 genel gider
- [ ] GECTI / [ ] KALDI

---

# ══════════════════════════════════════════════════
# FAZ 3: MUSTERI, TEDARIKCI, URUN
# Bagimlilk: FAZ 2 (Depolar, Makineler)
# ══════════════════════════════════════════════════

### 3.1 Musteri
- **Ekran:** Musteriler (`/customers`)
- **Islem:** Musteri ekle
  ```
  Firma: ASELSAN A.S.
  Yetkili: Ali Savunma
  Email: ali@aselsan.com.tr
  Telefon: 532 444 5566
  Adres: ASELSAN Macunkoy, Ankara
  Vergi No: 9876543210
  Doviz: TRY
  Vade: 45 gun
  ```
- **Beklenen:** Musteri listesinde ASELSAN gorunuyor
- **Kontrol:** Musteriler sayfasinda "Veri Yok" yerine ASELSAN gorunuyor mu?
- [ ] GECTI / [ ] KALDI

### 3.2 Tedarikci + Fason Tedarikci
- **Ekran:** Musteriler (type: Tedarikci)
- **Islem:** 2 tedarikci ekle
  ```
  Tedarikci 1:
    Firma: Ankara Celik Depo
    Yetkili: Veli Celikci
    Tip: Tedarikci (isSupplier: Evet)

  Tedarikci 2 (Fason):
    Firma: Yilmaz Isil Islem San.
    Yetkili: Hasan Isil
    Tip: Tedarikci (isSupplier: Evet)
  ```
- **Beklenen:** 2 tedarikci listede
- [ ] GECTI / [ ] KALDI

### 3.3 Urunler (Mamul + Hammadde)
- **Ekran:** Urunler (`/products`)
- **Islem:** 2 urun ekle (Urunler sayfasinda gorunmesi icin Tip: PRODUCTION_MATERIAL)
  ```
  Hammadde:
    Ad: St37 Celik Cubuk D30x200mm
    Kod: HAM-ST37-030200
    Tip: Hammadde (PRODUCTION_MATERIAL, OUTER_SUPPLY)
    Birim: Adet
    Alis Fiyati: 85 TL
    Min Stok: 50

  Mamul:
    Ad: ASELSAN Konnektor Pimi ASL-K7
    Kod: ASL-PIN-2026-001
    Tip: Mamul (PRODUCTION_MATERIAL, INNER_SUPPLY)
    Birim: Adet
    Satis Fiyati: 45 TL
    Kalite Kontrol: Evet
    Lot Takip: Evet
    Teknik Cizim No: ASL-DWG-K7-001
  ```
- **Beklenen:** Urunler sayfasinda 2 urun gorunuyor
- **Kontrol:** Seri Takip, Lot Takip, Kalite Kontrol isaretleri dogru mu?
- [ ] GECTI / [ ] KALDI

### 3.4 Stok Kartlari
- **Ekran:** Stok (`/stocks`)
- **Islem:** 2 stok karti ekle (Stok sayfasinda gorunmesi icin Tip: STOCK)
  ```
  Stok 1:
    Ad: St37 Celik Cubuk D30x200mm
    Kod: STK-ST37-030200
    Tip: STOCK
    Min Stok: 50

  Stok 2:
    Ad: ASELSAN Konnektor Pimi ASL-K7
    Kod: STK-ASL-PIN-001
    Tip: STOCK
    Min Stok: 100
  ```
- **Beklenen:** Stok sayfasinda 2 stok karti gorunuyor
- **Onemli:** Urunler sayfasi PRODUCTION_MATERIAL, Stok sayfasi STOCK tipini gosterir
- [ ] GECTI / [ ] KALDI

### 3.5 Kontrol Plani
- **Ekran:** Kalite > Kontrol Planlari (`/quality/control-plans`)
- **Islem:** Kontrol plani olustur + 4 kalem ekle + aktifles
  ```
  Plan No: KP-ASL-K7-001
  Urun: ASELSAN Konnektor Pimi

  Kalem 1: OP10 Torna | Dis Cap D6 | 6.000 | +0.010/-0.000 | Mikrometre | %100 | KRITIK
  Kalem 2: OP10 Torna | Boy 35     | 35.000 | ±0.050       | Kumpas    | %100 |
  Kalem 3: OP20 Freze | Kama Gen.  | 2.000 | +0.020/-0.000 | Kumpas    | %100 | KRITIK
  Kalem 4: OP30 Taslama | Dis Cap h6 | 6.000 | +0.000/-0.008 | Mikrometre | %100 | KRITIK
  ```
- **Beklenen:** Kontrol plani ACTIVE durumunda, 4 kalem gorünüyor
- [ ] GECTI / [ ] KALDI

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
  Kalem: STK-ST37-030200 x 550 adet x 85 TL
  Not: 500 siparis + %10 fire payi
  ```
- **Beklenen:** Stok sayfasinda hammadde 550 adet goruyor
- **Kontrol:** Stok kartinda fiili stok 550 mi?
- [ ] GECTI / [ ] KALDI

### 4.2 Giris Muayenesi
- **Ekran:** Kalite > Giris Kontrol (`/quality/inspections`)
- **Islem:** Muayene kaydi olustur
  ```
  Urun: St37 Celik Cubuk
  Tedarikci: Ankara Celik Depo
  Lot No: ST37-LOT-2026-001
  Gelen: 550 adet
  Kabul: 550
  Red: 0
  Sonuc: GECTI
  ```
- **Beklenen:** Muayene kaydi "PASS" durumunda
- [ ] GECTI / [ ] KALDI

### 4.3 Malzeme Sertifikalari
- **Ekran:** Giris Kontrol > Sertifika ikonu (satirdaki kilit/kalkan ikonu)
- **Islem:** 2 sertifika yukle
  ```
  Sertifika 1:
    No: ACD-MTR-2026-001
    Tip: MTR (Mill Test Report)
    Malzeme: St37 / DIN EN 10025

  Sertifika 2:
    No: ACD-COC-2026-001
    Tip: CoC (Uygunluk Sertifikasi)
  ```
- **Beklenen:** Drawer'da 2 sertifika gorunuyor (MTR + CoC)
- **Kontrol:** Sertifikalar muayene kaydina bagli mi?
- [ ] GECTI / [ ] KALDI

---

# ══════════════════════════════════════════════════
# FAZ 5: TEKLIF → SIPARIS
# Bagimlilk: FAZ 3 (Musteri, Urunler)
# ══════════════════════════════════════════════════

### 5.1 Teklif Hazirlama
- **Ekran:** Teklifler (`/offers/form`)
- **Islem:** Yeni teklif olustur
  ```
  Musteri: ASELSAN
  Kalem: ASL-PIN-2026-001 x 500 adet x 45 TL
  Toplam: 22,500 TL
  Not: Ilk siparis, 30 gun teslimat, FAI zorunlu
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
- **Kontrol:** Siparis → Teklif iliskisi dogru mu?
- [ ] GECTI / [ ] KALDI

---

# ══════════════════════════════════════════════════
# FAZ 6: IS EMRI SABLONU
# Bagimlilk: FAZ 1.3 (Operasyonlar), FAZ 2.1 (Makineler)
# ══════════════════════════════════════════════════

### 6.1 Sablon Olustur
- **Ekran:** Ayarlar > Is Emri Sablonlari (`/settings/work-order-templates`)
- **Islem:** Sablon olustur + adimlar ekle
  ```
  Sablon: ASL-K7 Konnektor Pimi Operasyon Sirasi

  Adim 1: OP10 Torna    | Makine: T01 | Setup: 20dk | Run: 8dk  | Kalite: EVET | Onkosul: -
  Adim 2: OP20 Freze    | Makine: F01 | Setup: 30dk | Run: 12dk | Kalite: EVET | Onkosul: 1
  Adim 3: OP30 Taslama  | Makine: TAS | Setup: 15dk | Run: 5dk  | Kalite: EVET | Onkosul: 2
  Adim 4: OP40 Capak    | -           | Setup: 5dk  | Run: 2dk  | Kalite: HAYIR | Onkosul: 3
  Adim 5: OP50 Final    | -           | Setup: 10dk | Run: 5dk  | Kalite: EVET | Onkosul: 4
  ```
- **Beklenen:** 5 adimli sablon, surukle-birak ile siralanabilir
- **Kontrol:** Prerequisite (onkosul) baglantilari dogru mu? Kalite kontrol isaretleri dogru mu?
- [ ] GECTI / [ ] KALDI

---

# ══════════════════════════════════════════════════
# FAZ 7: SIPARIS ONAY → URETIM EMRI
# Bagimlilk: FAZ 5 (Siparis), FAZ 6 (Sablon)
# ══════════════════════════════════════════════════

### 7.1 Siparis Onay Akisi
- **Ekran:** Satislar → siparis detay
- **Islem:** 3 adimli onay:
  1. **"Onay Talep Et"** → Durum: ONAY BEKLIYOR
  2. **"Onayla"** → Durum: ONAYLANDI
  3. **"Uretime Aktar"** → Uretim emri olusturulur
- **Beklenen:** Uretim sayfasinda yeni uretim emri gorunuyor
- **Kontrol:** Siparis durumu "URETIMDE" mi?
- [ ] GECTI / [ ] KALDI

> **Onemli:** Siparis direkt onaylanamaz — once "Onay Talep Et" yapilmali.
> Bu AS9100 sozlesme gozden gecirme gereksinimini karsilar.

### 7.2 Is Emri Atama
- **Ekran:** Uretim > detay > sag panel
- **Islem:** "Is Emri Olustur" → Sablon sec (ASL-K7)
- **Beklenen:** Uretim Durumu sekmesinde 5 operasyon adimi gorunuyor
- **Kontrol:** Progress stepper calisiyor mu? Adimlar sirali mi?
- [ ] GECTI / [ ] KALDI

---

# ══════════════════════════════════════════════════
# FAZ 8: ATOLYE TERMINALI (OPERATOR AKISI)
# Bagimlilk: FAZ 7 (Uretim Emri + Is Emirleri)
# ══════════════════════════════════════════════════

### 8.1 Operator Girisi
- **Ekran:** Login → `mustafa@demircnc.com`
- **Islem:** Operator olarak giris yap
- **Beklenen:** Sadece Atolye Terminali ve ilgili menuler gorunuyor
- [ ] GECTI / [ ] KALDI

### 8.2 OP10 — CNC Torna
- **Ekran:** Atolye Terminali (`/shop-floor-terminal`)
- **Islem:**
  1. Sag panelde "Bugunku Is Emirleri" listesinden **OP10** sec
  2. **BASLAT** butonu → zamanlayici calismaya baslar
  3. Buton **DURDUR** olur
  4. **DURDUR** → Durma nedeni modali acilir
     - Neden sec (ornegin: "Takim Degisimi")
     - "Durdur" tikla
  5. Buton **DEVAM ET** olur
  6. **DEVAM ET** → zamanlayici devam eder
  7. Miktar gir: **500**
  8. **TAMAMLA** → Olcum modali acilir (RequiresQualityCheck=true)
  9. Olcumleri gir:
     ```
     Dis Cap D6:  6.005 → YESIL (tolerans icinde)
     Boy 35:      34.98 → YESIL
     ```
  10. **"Olcumleri Kaydet & Tamamla"**
- **Beklenen:**
  - Is Emri No: OP10 (GUID degil)
  - Urun: ASELSAN Konnektor Pimi
  - DURDUR'da kontroller devre disi
  - PAUSED'da miktar degistirilemez
  - Olcum modali buyuk inputlarla, gercek zamanli pass/fail
- [ ] GECTI / [ ] KALDI

### 8.3 Kalite Onay (Kaliteci)
- **Ekran:** Login → `mehmet@demircnc.com` (Kaliteci)
- **Islem:**
  1. Kalite > **Operasyon Muayeneleri** (`/quality/operation-inspections`)
  2. OP10 "Bekliyor" olarak gorunmeli
  3. **"Onayla"** butonu → not gir → onayla
- **Beklenen:**
  - OP10 "Onaylandi" (yesil) olarak gorunuyor
  - Uretim Durumu ekraninda da "Kalite Onayli" badge var
  - OP20 artik baslatilabilir
- [ ] GECTI / [ ] KALDI

> **AS9100 Notu:** Operasyon kalite onayi ayri ekranda — operatorun kendi isini
> kendi kontrol etmesi yasagi. Kaliteci kendi modulunden onaylar.

### 8.4 OP20-OP50 Tekrar
- **Islem:** Her operasyon icin 8.2 + 8.3 adimlarini tekrarla
  - OP20 Freze → Operator baslatir → Kaliteci onaylar
  - OP30 Taslama → Operator baslatir → Kaliteci onaylar
  - OP40 Capak → Kalite kontrol yok, direkt tamamlanir
  - OP50 Final → Son operasyon, kaliteci onaylar
- **Kontrol:** Prerequisite calisiyor mu? OP20 baslatilmadan OP10 kalitesi onaylanmis olmali
- [ ] GECTI / [ ] KALDI

---

# ══════════════════════════════════════════════════
# FAZ 9: KALITE OLAYLARI
# Bagimlilk: FAZ 8 (Uretim yapilmis olmali)
# ══════════════════════════════════════════════════

### 9.1 NCR (Uygunsuzluk Raporu)
- **Ekran:** Kalite > Uygunsuzluk (`/quality/ncr`)
- **Islem:** NCR ac + workflow tamamla
  ```
  Siddet: MINOR
  Urun: ASELSAN Konnektor Pimi
  Etkilenen: 3 adet
  Tanim: OP30 taslamada 3 parca dis cap tolerans disi (5.988mm, spec: 5.992-6.000)

  Workflow:
    OPEN → UNDER_REVIEW → CORRECTIVE_ACTION → CLOSED
    Kok Neden: Taslik asinma limiti asilmis
    Duzeltici: Taslik degistirildi, dressleme peryodu 30 parcaya dusuruldu
    Onleyici: Tum taslama makineleri icin bakim planina eklendi
  ```
- **Beklenen:** NCR "CLOSED" durumunda, kok neden girilmis
- **Kontrol:** Kok neden girilmeden NCR kapatilamiyor mu? (AS9100 zorunlulugu)
- [ ] GECTI / [ ] KALDI

### 9.2 CAPA (Duzeltici Faaliyet)
- **Ekran:** Kalite > CAPA (`/quality/capa`)
- **Islem:** CAPA olustur
  ```
  Tip: Duzeltici (CORRECTIVE)
  Kaynak: NCR
  Oncelik: Orta
  Kok Neden: 5 Neden analizi
  Aksiyon: Bakim planina ekleme + operator egitimi
  ```
- **Beklenen:** CAPA olusturuldu
- [ ] GECTI / [ ] KALDI

### 9.3 FAI (Ilk Parca Muayenesi)
- **Ekran:** Kalite > FAI (`/quality/fai`)
- **Islem:** FAI olustur + 5 karakteristik + onayla
  ```
  Tip: FULL | Neden: Yeni Parca
  Parca: ASL-PIN-2026-001

  Karakteristik 1: Dis Cap D6     | 6.000 | +0.010/-0.000 | 6.005  | GECTI | KRITIK
  Karakteristik 2: Boy 35         | 35.000 | ±0.050       | 34.98  | GECTI
  Karakteristik 3: Kama Gen. 2    | 2.000 | +0.020/-0.000 | 2.010  | GECTI | KRITIK
  Karakteristik 4: Dis Cap h6     | 6.000 | +0.000/-0.008 | 5.995  | GECTI | KRITIK
  Karakteristik 5: Sertlik (HRC)  | 60.0  | ±2.0         | 60.5   | GECTI
  ```
- **Beklenen:** FAI "APPROVED" durumunda, 5 karakteristik girilmis, 3 Key Characteristic isaretli
- **Kontrol:** AS9102 PDF raporu indirilebiliyor mu?
- [ ] GECTI / [ ] KALDI

---

# ══════════════════════════════════════════════════
# FAZ 10: FASON IS
# Bagimlilk: FAZ 3 (Fason Tedarikci, Urun)
# ══════════════════════════════════════════════════

### 10.1 Fason Siparis
- **Ekran:** Uretim > Fason Is Emirleri (`/subcontract-orders`)
- **Islem:** Fason siparis olustur
  ```
  Tedarikci: Yilmaz Isil Islem
  Proses: Isil Islem (HEAT_TREATMENT)
  Adet: 500
  Fiyat: 3 TL/adet
  Beklenen Donus: 5 is gunu
  Muayene Gerekli: EVET
  ```
- **Beklenen:** Fason siparis listede, geri sayim badge gorunuyor
- **Kontrol:** Status workflow calisyor mu? (DRAFT → SENT → AT_SUPPLIER → COMPLETED → INSPECTED)
- [ ] GECTI / [ ] KALDI

---

# ══════════════════════════════════════════════════
# FAZ 11: FATURA ve ODEME
# Bagimlilk: FAZ 5 (Siparis), FAZ 3 (Musteri)
# ══════════════════════════════════════════════════

### 11.1 Satis Faturasi
- **Ekran:** Faturalar (`/invoices/form`)
- **Islem:** Satis faturasi olustur
  ```
  Musteri: ASELSAN
  Kalem: Konnektor Pimi x 500 adet x 45 TL = 22,500 TL
  KDV: %20 = 4,500 TL
  Toplam: 27,000 TL
  Vade: 45 gun
  ```
- **Beklenen:** Fatura numarasi (FTR-2026-XXXXX), toplam 27,000 TL
- [ ] GECTI / [ ] KALDI

### 11.2 Fatura Gonderme + Odeme
- **Islem:**
  1. Fatura durumunu **GONDERILDI** yap
  2. Odeme ekle: 15,000 TL Nakit
  3. Odeme ekle: 12,000 TL Havale
- **Beklenen:** Fatura "ODENDI", Cari bakiye 0
- **Kontrol:** Kasa/banka bakiyeleri dogru mu?
- [ ] GECTI / [ ] KALDI

### 11.3 Alis Faturasi
- **Ekran:** Faturalar > Alis Faturasi
- **Islem:** Tedarikci faturasi gir
  ```
  Tedarikci: Ankara Celik Depo
  Kalem: St37 Cubuk 550 x 85 TL + KDV = 56,100 TL
  ```
- [ ] GECTI / [ ] KALDI

---

# ══════════════════════════════════════════════════
# FAZ 12: BAKIM
# Bagimlilk: FAZ 2 (Makineler)
# ══════════════════════════════════════════════════

### 12.1 Bakim Plani
- **Ekran:** Bakim > Bakim Planlari
- **Islem:** Onleyici bakim plani olustur
  ```
  Makine: CNC-01 (T01)
  Baslik: Haftalik Yaglama
  Tip: ONLEYICI (PREVENTIVE)
  Frekans: Haftalik
  Tahmini Sure: 1 saat
  ```
- **Beklenen:** Bakim plani listede
- [ ] GECTI / [ ] KALDI

### 12.2 Bakim Is Emri
- **Islem:** Bakim planinan "Is Emri Olustur" tikla
- **Beklenen:** Bakim is emri olusturuldu
- [ ] GECTI / [ ] KALDI

---

# ══════════════════════════════════════════════════
# FAZ 13: IK ve VARDIYA
# Bagimlilk: FAZ 1 (Kullanicilar)
# ══════════════════════════════════════════════════

### 13.1 Vardiya Tanimlama
- **Ekran:** IK > Vardiya Planlama
- **Islem:** Vardiya olustur
  ```
  Ad: Sabah Vardiyasi
  Baslangic: 06:00
  Bitis: 14:00
  Mola: 30 dk
  ```
- [ ] GECTI / [ ] KALDI

### 13.2 Devam Takibi
- **Islem:** Giris/Cikis kaydi olustur
- [ ] GECTI / [ ] KALDI

### 13.3 Izin Talebi
- **Islem:** Yillik izin talebi olustur (2 gun) → Onayla
- [ ] GECTI / [ ] KALDI

---

# ══════════════════════════════════════════════════
# FAZ 14: RAPORLAR ve DASHBOARD
# Bagimlilk: FAZ 8-11 (Veri olmali)
# ══════════════════════════════════════════════════

### 14.1 Yonetim Kokpiti
- **Ekran:** Yonetim Kokpiti (`/executive-dashboard`)
- **Kontrol:**
  - [ ] Toplam gelir gorunuyor
  - [ ] OEE metrikleri
  - [ ] Acik NCR/CAPA sayilari
  - [ ] Zamaninda teslimat orani

### 14.2 Kalite Dashboard
- **Ekran:** Kalite > Dashboard
- **Kontrol:**
  - [ ] NCR ozet sayilari dogru
  - [ ] Tedarikci kalite puanlari

### 14.3 Uretim Raporlari
- **Ekran:** Raporlar
- **Kontrol:**
  - [ ] Uretim performansi
  - [ ] Stok durumu
  - [ ] Satis analizi

### 14.4 Maliyet Analizi
- **Ekran:** Uretim > Maliyet Analizi (`/production/part-cost`)
- **Kontrol:**
  - [ ] Malzeme + Iscilik + Makine + Genel gider kirilimi
  - [ ] Pasta grafik gorunuyor
  - [ ] Birim maliyet hesaplandi

---

# ══════════════════════════════════════════════════
# BAGIMLILK DIAGRAMI
# ══════════════════════════════════════════════════

```
FAZ 0 (Kayit + Giris)
  │
  ├── FAZ 1 (Birimler, Roller, Operasyonlar)
  │     │
  │     ├── FAZ 2 (Makineler, Depolar, Kalibrasyon, Genel Gider)
  │     │     │
  │     │     └── FAZ 6 (Is Emri Sablonu) ← Operasyonlar + Makineler
  │     │
  │     └── FAZ 13 (IK, Vardiya) ← Kullanicilar
  │
  ├── FAZ 3 (Musteri, Tedarikci, Urunler, Stok Karti, Kontrol Plani)
  │     │
  │     ├── FAZ 4 (Stok Girisi → Muayene → Sertifika) ← Depo + Urun
  │     │
  │     ├── FAZ 5 (Teklif → Siparis) ← Musteri + Urun
  │     │     │
  │     │     └── FAZ 7 (Siparis Onay → Uretim Emri + Is Emri) ← Sablon
  │     │           │
  │     │           └── FAZ 8 (Atolye Terminali) ← Operator + Is Emri
  │     │                 │
  │     │                 └── FAZ 9 (Kalite: NCR, CAPA, FAI)
  │     │
  │     ├── FAZ 10 (Fason Is) ← Fason Tedarikci + Urun
  │     │
  │     └── FAZ 11 (Fatura + Odeme) ← Musteri + Urun
  │
  ├── FAZ 12 (Bakim) ← Makineler
  │
  └── FAZ 14 (Raporlar) ← Tum veriler
```

---

# ══════════════════════════════════════════════════
# SONUC TABLOSU
# ══════════════════════════════════════════════════

| Faz | Baslik | Adim | Gecti | Kaldi | Not |
|-----|--------|------|-------|-------|-----|
| 0 | Kayit + Giris | 2 | | | |
| 1 | Birimler + Roller + Operasyonlar | 3 | | | |
| 2 | Makine + Depo + Kalibrasyon + Gider | 4 | | | |
| 3 | Musteri + Tedarikci + Urun + Stok + KP | 5 | | | |
| 4 | Stok Girisi + Muayene + Sertifika | 3 | | | |
| 5 | Teklif → Siparis | 2 | | | |
| 6 | Is Emri Sablonu | 1 | | | |
| 7 | Siparis Onay → Uretim | 2 | | | |
| 8 | Atolye Terminali (Operator + Kaliteci) | 4 | | | |
| 9 | NCR + CAPA + FAI | 3 | | | |
| 10 | Fason Is | 1 | | | |
| 11 | Fatura + Odeme | 3 | | | |
| 12 | Bakim | 2 | | | |
| 13 | IK + Vardiya | 3 | | | |
| 14 | Raporlar + Dashboard | 4 | | | |
| **TOPLAM** | | **42** | | | |

---

**Test Eden:** ___________________  
**Tarih:** ___________________  
**Imza:** ___________________

> Bu test plani `full-19-phase-test.spec.js` otomatik testi ile dogrulanmistir.
> Otomatik test sonucu: 52/52 PASSED, 75 OK + 4 WARN + 0 FAIL
