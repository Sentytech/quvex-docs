# Plastik Enjeksiyon Atolyesi — Uctan Uca Test Senaryosu
# Sifirdan Kurulum → Siparis → Uretim → Sevkiyat → Maliyet Analizi

> **Firma:** Ozkan Plastik San. Ltd.Sti.
> **Sektor:** Plastik enjeksiyon / ambalaj
> **Urun:** Plastik kasa (PP Polipropilen, enjeksiyon kaliplama)
> **Standart:** ISO 9001
> **Test Tarihi:** 2026-04-10
> **Test Ortami:** quvex.io (production) veya localhost (development)
> **Test Suresi:** ~35 dakika
> **Adim Sayisi:** 33

---

# ══════════════════════════════════════════════════════════════
# ADIM 0: KAYIT ve GIRIS
# ══════════════════════════════════════════════════════════════

## 0.1 Firma Kaydi
**Ekran:** /register
**API:** POST /TenantRegistration/self-register

```
Firma Adi:      Ozkan Plastik San. Ltd.Sti.
Alt Alan:       ozkanplastik  (ozkanplastik.quvex.io)
Ad Soyad:       Kemal Ozkan
Email:          kemal@ozkanplastik.com
Telefon:        533 222 4455
Sifre:          Test1234!@#$
Sektor:         Plastik Enjeksiyon [dropdown]
```

**Dogrulama:**
- [ ] Kayit basarili, onboarding ekrani acildi
- [ ] Sektor profili "Plastik Enjeksiyon" secildi
- [ ] Admin kullanici olusturuldu
- [ ] Tenant schema olusturuldu

**Bilinen Sorunlar:**
- ⚠️ TenantId atamasi — yeni kayitlarda TenantId dogru atanmali
- ⚠️ Sektor profili secimi kayit sirasinda aktif mi?

## 0.2 Onboarding Wizard
**Ekran:** /onboarding

```
Adim 1: Firma bilgileri
  Vergi No: 1234567890
  Vergi Dairesi: Nilufer
  Adres: Organize Sanayi Bolgesi 7. Cd. No:14, Bursa
  Telefon: 0224 441 5566
Adim 2: Sektor secimi (zaten secildi — Plastik Enjeksiyon)
Adim 3: Ilk kullanici davet (opsiyonel, atlanabilir)
```

**Dogrulama:**
- [ ] Onboarding tamamlandi
- [ ] Dashboard'a yonlendirildi

## 0.3 Ek Kullanicilar Olustur
**Ekran:** Ayarlar > Kullanicilar
**API:** POST /Users

```
Kullanici 1 (Depo Sorumlusu):
  Ad: Fatma Depocu
  Email: fatma@ozkanplastik.com
  Rol: Depo Sorumlusu
  Yetkiler: Stok Goruntule, Stok Kaydet, Depolar Goruntule

Kullanici 2 (Satinalma):
  Ad: Murat Satinalma
  Email: murat@ozkanplastik.com
  Rol: Satinalma
  Yetkiler: Satin Alma Goruntule, Satin Alma Kaydet, Tedarikci Goruntule

Kullanici 3 (Operator):
  Ad: Ali Operator
  Email: ali@ozkanplastik.com
  Rol: Operator
  Yetkiler: Atolye Terminali Goruntule, Is Emri Goruntule

Kullanici 4 (Kaliteci):
  Ad: Zeynep Kaliteci
  Email: zeynep@ozkanplastik.com
  Rol: Kaliteci
  Yetkiler: Kalite Goruntule, Kalite Kaydet, Muayene Goruntule
```

**Dogrulama:**
- [ ] 4 kullanici olusturuldu
- [ ] Roller atandi
- [ ] Operator sadece atanan menuleri goruyor
- [ ] Depo Sorumlusu sadece stok menulerini goruyor
- [ ] Satinalma sadece satin alma menulerini goruyor

**Bilinen Sorunlar:**
- ⚠️ Rol bazli menu filtreleme calisiyor mu? (uiConfig.js roleProfiles)

---

# ══════════════════════════════════════════════════════════════
# ADIM 1: MUSTERI KAYDI (Perakende Zinciri)
# ══════════════════════════════════════════════════════════════

## 1.1 Musteri Olustur
**Ekran:** Musteriler
**API:** POST /Customer

```
Firma:      A101 Yeni Magazacilik A.S.
Yetkili:    Hasan Perakende
Email:      hasan.perakende@a101.com.tr
Telefon:    532 888 9900
Adres:      Sancaktepe Merkez Depo, Istanbul
Vergi No:   8765432109
Doviz:      TRY
Vade:       60 gun
Kategori:   A
isCustomer: true
```

**Dogrulama:**
- [ ] Musteri olusturuldu
- [ ] Musteri listesinde gorunuyor (`/Customer?type=customers`)
- [ ] Yetkili bilgileri dogru

**Bilinen Sorunlar:**
- ⚠️ `isCustomer: true` gonderilmeli (type: 'customers' degil)
- ⚠️ Musteri listesi `/Customer?type=customers` ile filtreleniyor

---

# ══════════════════════════════════════════════════════════════
# ADIM 2: URUN TANIMLARI
# ══════════════════════════════════════════════════════════════

## 2.1 Hammadde: PP Granul
**Ekran:** Urunler
**API:** POST /Product

```
Ad:              PP Polipropilen Granul (MH12)
Kod:             HAM-PP-MH12
Tip:             Hammadde
Birim:           kg
Alis Fiyati:     32 TL/kg
Min Stok:        2000 kg
productType:     PRODUCTION_MATERIAL
supplyType:      OUTER_SUPPLY (1)
Aciklama:        Polipropilen homopolimer, MFI 12 g/10dk, beyaz dogal
```

## 2.2 Hammadde: Boya Masterbatch
**Ekran:** Urunler
**API:** POST /Product

```
Ad:              Mavi Masterbatch MB-42
Kod:             HAM-MB-MAVI42
Tip:             Hammadde
Birim:           kg
Alis Fiyati:     85 TL/kg
Min Stok:        100 kg
productType:     PRODUCTION_MATERIAL
supplyType:      OUTER_SUPPLY (1)
Aciklama:        Konsantre mavi renk masterbatch, PP bazli, %3 katkim orani
```

## 2.3 Hammadde: Ambalaj Malzemesi
**Ekran:** Urunler
**API:** POST /Product

```
Ad:              Streç Film 50cm
Kod:             HAM-STREC-50
Tip:             Hammadde
Birim:           Rulo
Alis Fiyati:     120 TL/rulo
Min Stok:        20 rulo
productType:     PRODUCTION_MATERIAL
supplyType:      OUTER_SUPPLY (1)
```

## 2.4 Mamul: Plastik Kasa
**Ekran:** Urunler
**API:** POST /Product

```
Ad:              Plastik Kasa 40x30x15 Mavi (PP)
Kod:             MAM-KASA-4030-M
Tip:             Mamul
Birim:           Adet
Satis Fiyati:    28 TL
Kalite Kontrol:  Evet
Seri Takip:      Hayir (lot takip yeterli)
Lot Takip:       Evet
productType:     PRODUCTION_MATERIAL
supplyType:      INNER_SUPPLY (0)
Aciklama:        40x30x15cm tasinma kasasi, gida uyumlu, istifleme ozelligi
Kalip No:        KLP-4030-001
Agirlik:         620 gr (+-15gr tolerans)
```

**Dogrulama:**
- [ ] 4 urun olusturuldu (3 hammadde + 1 mamul)
- [ ] Urunler sayfasinda gorunuyor
- [ ] Birimler dogru (kg, rulo, adet)

**Bilinen Sorunlar:**
- ⚠️ `productType: PRODUCTION_MATERIAL` olmali — yoksa Urunler sayfasinda gorunmez
- ⚠️ Stok sayfasinda gorunmesi icin `productType: STOCK` olmali

---

# ══════════════════════════════════════════════════════════════
# ADIM 3: KALIP ve MAKINE TANIMLARI
# ══════════════════════════════════════════════════════════════

## 3.1 Enjeksiyon Makineleri
**Ekran:** Ayarlar > Makineler
**API:** POST /Machines

| Kod  | Makine                 | Marka             | Kapama Kuv. | Saat Ucreti | Setup |
|------|------------------------|-------------------|-------------|-------------|-------|
| ENJ1 | Enjeksiyon 1 (250T)   | Haitian MA2500    | 250 ton     | 350         | 250   |
| ENJ2 | Enjeksiyon 2 (350T)   | Engel Victory 350 | 350 ton     | 450         | 300   |
| ENJ3 | Enjeksiyon 3 (150T)   | Arburg 470E       | 150 ton     | 280         | 200   |

**Dogrulama:**
- [ ] 3 makine eklendi
- [ ] Saat ucretleri girildi
- [ ] Makine listesinde gorunuyor

**Bilinen Sorunlar:**
- ⚠️ HourlyRate ve SetupHourlyRate alanlari UI'da gorunuyor mu?

## 3.2 Kalip Tanimlamasi (Ozel Alan / Not)
**Not:** Kalip modulu henuz ayri bir entity olarak mevcut degildir.
Kalip bilgileri urun notuna veya makine notuna yazilir.

```
Kalip Bilgileri (Urun notuna eklenir):
  Kalip No:        KLP-4030-001
  Gozlu Sayisi:    4 goz (4 adet/cevrim)
  Sogutma Suresi:  18 sn
  Enjeksiyon Bas.: 85 bar
  Eriyik Sicaklik: 220°C
  Kalip Sicaklik:  45°C
  Cevrim Suresi:   32 sn (toplam)
  Kalip Omru:      500.000 cevrim (mevcut: 120.000)
```

**Dogrulama:**
- [ ] Kalip bilgileri urun aciklamasina eklendi
- [ ] Bilgiler kaydedildi ve gorulebiliyor

## 3.3 Operasyon Adimlari
**Ekran:** Ayarlar > Is Emri Adimlari
**API:** POST /WorkOrderSteps

| Kod  | Operasyon           | Makine | Setup  | Run     | Beceri   |
|------|---------------------|--------|--------|---------|----------|
| OP10 | Enjeksiyon Kaliplama| ENJ1   | 45dk   | 32sn/cy | 3-Usta   |
| OP20 | Sogutma + Capak     | —      | 5dk    | 15sn    | 1-Cirak  |
| OP30 | Montaj (kulp takma) | —      | 10dk   | 20sn    | 2-Kalfa  |
| OP40 | Kalite Kontrol      | —      | 5dk    | 30sn    | 3-Usta   |
| OP50 | Paketleme           | —      | 5dk    | 10sn    | 1-Cirak  |

**Dogrulama:**
- [ ] 5 operasyon eklendi
- [ ] Makine, sure, takim bilgileri girildi

---

# ══════════════════════════════════════════════════════════════
# ADIM 4: BOM / RECETE TANIMI
# ══════════════════════════════════════════════════════════════

## 4.1 Urun Agaci (BOM)
**Ekran:** Urunler > MAM-KASA-4030-M > BOM
**API:** POST /ProductRecipe (veya /BillOfMaterial)

```
Mamul: Plastik Kasa 40x30x15 Mavi (MAM-KASA-4030-M)
Miktar: 1 adet uretim icin gerekli malzeme:

| # | Malzeme            | Kod            | Miktar  | Birim | Fire % |
|---|--------------------|----------------|---------|-------|--------|
| 1 | PP Granul (MH12)   | HAM-PP-MH12    | 0.650   | kg    | %5     |
| 2 | Mavi Masterbatch   | HAM-MB-MAVI42  | 0.020   | kg    | %2     |
| 3 | Strec Film         | HAM-STREC-50   | 0.005   | rulo  | %0     |
```

**Hesaplama Notu:**
- 1 adet kasa = 620gr PP + 20gr masterbatch = 640gr toplam
- Fire dahil: PP 650gr, MB 20.4gr ≈ 21gr
- Ambalaj: 200 kasa = 1 rulo strec → kasa basi 0.005 rulo

**Dogrulama:**
- [ ] BOM 3 kalemli olusturuldu
- [ ] Fire oranlari girildi
- [ ] Mamul-hammadde iliskisi kuruldu
- [ ] BOM agaci gorunuyor

**Bilinen Sorunlar:**
- ⚠️ BOM endpoint `ProductRecipe` veya `BillOfMaterial` olabilir — API'ye gore kontrol
- ⚠️ Fire orani alani mevcut mu? Yoksa miktar icinde hesaplanmali

---

# ══════════════════════════════════════════════════════════════
# ADIM 5: TEKLIF ve SIPARIS
# ══════════════════════════════════════════════════════════════

## 5.1 Teklif Hazirlama
**Ekran:** Teklifler
**API:** POST /Offer + POST /OfferProduct

```
Adim 1 — Teklif Header:
  Musteri:      A101 Yeni Magazacilik A.S.
  Tarih:        2026-04-10
  Gecerlilik:   30 gun
  Not:          Ilk parti teklif, teslimat 3 hafta

Adim 2 — Kalem Ekle:
  Urun:         Plastik Kasa 40x30x15 Mavi (MAM-KASA-4030-M)
  Miktar:       10.000 adet
  Birim Fiyat:  28 TL
  Tutar:        280.000 TL
```

**Dogrulama:**
- [ ] Teklif olusturuldu (2 adimli: header + kalem)
- [ ] Teklif kalemi eklendi
- [ ] Toplam 280.000 TL

**Bilinen Sorunlar:**
- ⚠️ Teklif olusturma 2 adimli: (1) POST /Offer header, (2) POST /OfferProduct kalem
- ⚠️ Nested offerProducts ile olusturma circular ref hatasi veriyor

## 5.2 Teklif Onayi → Siparis
**Ekran:** Teklifler → Satislar
**API:** PUT /Offer/change-status/{id}/2 + POST /Sales

```
Akis:
  1. Teklif durumu ACCEPTED (status=2) yapilir
  2. Siparis olusturulur: offerProductId ile

Siparis:
  Musteri:   A101
  Kalem:     MAM-KASA-4030-M x 10.000 adet
  Tutar:     280.000 TL
  Teslimat:  2026-05-01 (3 hafta)
```

**Dogrulama:**
- [ ] Teklif ACCEPTED oldu
- [ ] Siparis olusturuldu
- [ ] Siparis tutari 280.000 TL

**Bilinen Sorunlar:**
- ⚠️ Offer status enum: 0=DRAFT, 1=SENT, 2=ACCEPTED, 3=REJECTED
- ⚠️ Sales olusturmak icin Offer ACCEPTED olmali

---

# ══════════════════════════════════════════════════════════════
# ADIM 6: MRP CALISTIR — Ihtiyac Planlama
# ══════════════════════════════════════════════════════════════

## 6.1 MRP Calistirma
**Ekran:** Uretim > MRP
**API:** POST /Mrp/run (veya /Mrp/calculate)

```
Parametreler:
  Siparis:       10.000 adet Plastik Kasa
  BOM Patlatma:  Otomatik (receteden hesapla)
  Mevcut Stok:   Sifir (yeni firma)
  Temin Suresi:  PP → 5 gun, MB → 3 gun, Strec → 1 gun

Beklenen Sonuc (Net Ihtiyac):
  | Malzeme          | Brut Ihtiyac | Stok | Net Ihtiyac | Satin Alma Onerisi |
  |------------------|-------------|------|-------------|-------------------|
  | PP Granul (MH12) | 6.500 kg    | 0    | 6.500 kg    | EVET              |
  | Mavi Masterbatch | 200 kg      | 0    | 200 kg      | EVET              |
  | Strec Film       | 50 rulo     | 0    | 50 rulo     | EVET              |

  Hesaplama:
    PP:  10.000 x 0.650 kg = 6.500 kg
    MB:  10.000 x 0.020 kg = 200 kg
    SF:  10.000 x 0.005 rulo = 50 rulo
```

**Dogrulama:**
- [ ] MRP calistirildi
- [ ] BOM patlatma dogru calisti (3 hammadde)
- [ ] Net ihtiyac miktarlari dogru
- [ ] Satin alma onerileri olusturuldu
- [ ] Temin sureleri hesaba katildi

**Bilinen Sorunlar:**
- ⚠️ MRP modulu mevcut mu? Yoksa manuel hesaplama yapilmali
- ⚠️ Fire orani MRP'de hesaba katiliyor mu?

---

# ══════════════════════════════════════════════════════════════
# ADIM 7: SATIN ALMA SIPARISI
# ══════════════════════════════════════════════════════════════

## 7.1 Tedarikci Kaydi
**Ekran:** Musteriler (Tedarikci modu)
**API:** POST /Customer (isSupplier: true)

```
Tedarikci 1:
  Firma:     Petkim Petrokimya A.S.
  Yetkili:   Ayse Kimyager
  Email:     ayse@petkim.com.tr
  Telefon:   532 333 4455
  Adres:     Aliaga Petrokimya Tesisleri, Izmir
  Vergi No:  1112223334
  isCustomer: false
  isSupplier: true

Tedarikci 2:
  Firma:     Baskent Masterbatch Ltd.
  Yetkili:   Caner Boyaci
  Email:     caner@basmas.com
  Telefon:   533 555 6677
  isCustomer: false
  isSupplier: true
```

**Dogrulama:**
- [ ] 2 tedarikci olusturuldu
- [ ] `/Customer?type=suppliers` ile listeleniyorlar
- [ ] Musteri listesinde gorunmuyorlar

## 7.2 Satin Alma Siparisi Olustur (Satinalma Rolu ile)
**Ekran:** Satin Alma
**API:** POST /PurchaseOrder
**Kullanici:** Murat Satinalma (satinalma rolu)

```
Siparis 1 — Petkim (PP Granul):
  Tedarikci:  Petkim Petrokimya A.S.
  Kalemler:
    - HAM-PP-MH12 x 6.500 kg x 32 TL/kg = 208.000 TL
  Teslimat:   2026-04-17 (5 is gunu)
  Not:        MRP onerisi — Siparis No: SIP-2026-001

Siparis 2 — Baskent Masterbatch:
  Tedarikci:  Baskent Masterbatch Ltd.
  Kalemler:
    - HAM-MB-MAVI42 x 200 kg x 85 TL/kg = 17.000 TL
  Teslimat:   2026-04-14 (3 is gunu)

Siparis 3 — Strec Film (herhangi tedarikci):
  Kalemler:
    - HAM-STREC-50 x 50 rulo x 120 TL/rulo = 6.000 TL
  Teslimat:   2026-04-11 (1 is gunu)
```

**Dogrulama:**
- [ ] 3 satin alma siparisi olusturuldu
- [ ] Toplam: 208.000 + 17.000 + 6.000 = 231.000 TL
- [ ] Satinalma roluyle giris yapildi, sadece ilgili menuler gorunuyor
- [ ] Satinalma kullanicisi musteri menulerini goremiyor

**Bilinen Sorunlar:**
- ⚠️ PurchaseOrder format kontrolu — details array zorunlu mu?

---

# ══════════════════════════════════════════════════════════════
# ADIM 8: MAL KABUL + GIRIS KALITE KONTROL
# ══════════════════════════════════════════════════════════════

## 8.1 Mal Kabul — Stok Girisi (Depo Sorumlusu Rolu ile)
**Ekran:** Stok > Giris/Cikis
**API:** POST /StockReceipts
**Kullanici:** Fatma Depocu (depo sorumlusu rolu)

```
Giris 1 — PP Granul:
  Depo:       ANA-DEPO
  Belge No:   IRS-2026-001
  Tedarikci:  Petkim
  Kalemler:
    - HAM-PP-MH12 x 6.500 kg x 32 TL
  Lot No:     PP-2026-04-001

Giris 2 — Masterbatch:
  Depo:       ANA-DEPO
  Belge No:   IRS-2026-002
  Kalemler:
    - HAM-MB-MAVI42 x 200 kg x 85 TL
  Lot No:     MB-2026-04-001

Giris 3 — Strec Film:
  Depo:       ANA-DEPO
  Belge No:   IRS-2026-003
  Kalemler:
    - HAM-STREC-50 x 50 rulo x 120 TL
```

**Dogrulama:**
- [ ] 3 stok girisi yapildi
- [ ] Stok miktarlari guncellendi
- [ ] Depo Sorumlusu roluyle giris yapildi
- [ ] Depo Sorumlusu sadece stok menulerini goruyor
- [ ] Uretim, teklif, fatura menuleri gorunmuyor

**Bilinen Sorunlar:**
- ⚠️ StockReceipts format: `{ warehousesId, type:0, documentNo, details:[{productId, quantity, unitPrice}] }`
- ⚠️ Lot numarasi atama mekanizmasi mevcut mu?

## 8.2 Giris Kalite Kontrol (Hammadde)
**Ekran:** Kalite > Giris Kontrol
**API:** POST /IncomingInspection

```
Muayene 1 — PP Granul:
  Urun:       HAM-PP-MH12
  Lot:        PP-2026-04-001
  Gelen:      6.500 kg
  Kabul:      6.500 kg
  Red:        0
  Sonuc:      PASS
  Kontroller:
    - MFI degeri: 12.3 g/10dk (spec: 11-13) ✅
    - Nem orani: %0.03 (spec: <%0.05) ✅
    - Renk: Beyaz dogal ✅
    - Sertifika: Parti analiz belgesi mevcut ✅

Muayene 2 — Masterbatch:
  Urun:       HAM-MB-MAVI42
  Lot:        MB-2026-04-001
  Gelen:      200 kg
  Kabul:      200 kg
  Red:        0
  Sonuc:      PASS
  Kontroller:
    - Renk tutarliligi: Delta-E < 1.0 ✅
    - Dagilim: Homojen ✅
```

**Dogrulama:**
- [ ] 2 muayene kaydi olusturuldu
- [ ] Sonuclar PASS
- [ ] Lot numaralari dogru baglandi
- [ ] Muayene detaylari kaydedildi

---

# ══════════════════════════════════════════════════════════════
# ADIM 9: DEPO TANIMLARI
# ══════════════════════════════════════════════════════════════

## 9.1 Depo ve Lokasyonlar
**Ekran:** Stok > Depolar
**API:** POST /Warehouses

```
Depo 1:
  Kod:       ANA-DEPO
  Ad:        Ana Hammadde Deposu
  Aciklama:  PP granul, masterbatch ve ambalaj malzemeleri

Depo 2:
  Kod:       MAMUL-DEPO
  Ad:        Mamul Deposu
  Aciklama:  Uretim cikisi plastik kasalar — istifleme alani
```

**Dogrulama:**
- [ ] 2 depo olusturuldu
- [ ] Depo listesinde gorunuyor

---

# ══════════════════════════════════════════════════════════════
# ADIM 10: IS EMRI ve URETIM PLANLAMA
# ══════════════════════════════════════════════════════════════

## 10.1 Is Emri Sablonu
**Ekran:** Ayarlar > Is Emri Sablonlari
**API:** POST /WorkOrderTemplates

```
Sablon: Plastik Kasa Uretim Operasyonlari
Adimlar:
  1. OP10 — Enjeksiyon Kaliplama (ENJ1, Setup:45dk, Run:32sn/cevrim, Kalite:EVET)
  2. OP20 — Sogutma + Capak Alma (Setup:5dk, Run:15sn, Kalite:HAYIR)
  3. OP30 — Montaj / Kulp Takma (Setup:10dk, Run:20sn, Kalite:HAYIR)
  4. OP40 — Kalite Kontrol (Setup:5dk, Run:30sn, Kalite:EVET)
  5. OP50 — Paketleme (Setup:5dk, Run:10sn, Kalite:HAYIR)
```

**Dogrulama:**
- [ ] 5 adimli sablon olusturuldu
- [ ] Prerequisite baglantilari dogru (OP20→OP10, OP30→OP20, vs.)

**Bilinen Sorunlar:**
- ⚠️ Template field adi `title` (name degil)
- ⚠️ `workOrders: []` bos array gondermek zorunlu (yoksa validation hatasi)

## 10.2 Siparis Onayi → Uretim Emri
**Ekran:** Satislar → Onayla → Uretime Aktar
**API:** PUT /Sales/request-approval/{id} + PUT /Sales/approve/{id} + POST /Production/transfer-from-sale/{salesId}

```
Akis:
  1. IN_OFFER → request-approval → PENDING_APPROVAL
  2. PENDING_APPROVAL → approve (autoTransfer=false) → APPROVED
  3. APPROVED → transfer-from-sale → Production olusturuldu

Uretim Emri:
  Urun:     MAM-KASA-4030-M
  Miktar:   10.000 adet
  Durum:    WAITING
```

**Dogrulama:**
- [ ] Uretim emri olusturuldu
- [ ] 10.000 adet, durum WAITING
- [ ] Siparis durumu guncellendi

**Bilinen Sorunlar:**
- ⚠️ Siparis direkt approve edilemez — once request-approval yapilmali
- ⚠️ approve body zorunlu: `{ notes: "..." }`
- ⚠️ transfer-from-sale ayri cagrilmali

## 10.3 Is Emri Atama + Gantt Planlama
**Ekran:** Uretim > Detay > Is Emri Olustur + Gantt
**API:** POST /WorkOrderTemplates/assign

```
Sablon:    Plastik Kasa Uretim Operasyonlari
→ 5 operasyon otomatik olusturulur
→ Her operasyona 10.000 adet atanir

Gantt Planlama:
  OP10 (Enjeksiyon):  2026-04-17 08:00 — 2026-04-21 17:00
    Hesap: 10.000 adet / 4 goz = 2.500 cevrim x 32sn = ~22 saat
  OP20 (Sogutma):     2026-04-17 08:30 — 2026-04-21 17:30
    (enjeksiyonla paralel, 30dk gecikme)
  OP30 (Montaj):      2026-04-18 08:00 — 2026-04-22 17:00
  OP40 (Kalite):      2026-04-18 14:00 — 2026-04-22 17:00
    (montajla paralel, ilk parti hazir oldugunda baslar)
  OP50 (Paketleme):   2026-04-19 08:00 — 2026-04-23 12:00
```

**Dogrulama:**
- [ ] Is emri sablonu atandi
- [ ] 5 WorkOrder olusturuldu
- [ ] Gantt gorunumunde gorunuyor
- [ ] Tarihler ve sureler mantikli

---

# ══════════════════════════════════════════════════════════════
# ADIM 11: URETIM BASLAT — Enjeksiyon Operasyonu
# ══════════════════════════════════════════════════════════════

## 11.1 Operator Girisi + OP10 Baslat
**Ekran:** Atolye Terminali (/shop-floor-terminal)
**API:** POST /ShopFloor/start-work
**Kullanici:** Ali Operator (operator rolu)

```
Operator: Ali Operator
Is:       OP10 — Enjeksiyon Kaliplama
Makine:   ENJ1 (Haitian MA2500, 250T)

Kalip Parametreleri (operatorun kontrol etmesi gereken):
  - Eriyik Sicakligi: 220°C
  - Kalip Sicakligi: 45°C
  - Enjeksiyon Basinci: 85 bar
  - Tutma Basinci: 65 bar
  - Sogutma Suresi: 18 sn
  - Cevrim Suresi: 32 sn
```

**Dogrulama:**
- [ ] Operator sadece kendi islerini goruyor
- [ ] "Bugunku Is Emirleri" listesinde OP10 gorunuyor
- [ ] BASLAT → zamanlayici calisiyor
- [ ] Buton DURDUR'a donustu
- [ ] Operator uretim/teklif/fatura menulerini goremiyor (sadece terminal)

**Bilinen Sorunlar:**
- ⚠️ start-work endpoint WorkOrderLogs.MachinesId shadow property hatasi → Raw SQL workaround
- ⚠️ GetUserId() JWT sub claim Guid degil string → email ile resolve

## 11.2 Uretim Devam — Cevrim Kayit
```
Cevrim bazli uretim:
  Her cevrim = 32 sn → 4 adet kasa (4 gozlu kalip)
  1 saatte: 3600/32 = 112.5 cevrim → 450 adet/saat
  8 saatlik vardiya: ~3.600 adet (duruslar haric)
  
Operator her 2 saatte bir adet raporu girer:
  Saat 10:00 → 900 adet tamamlandi
  Saat 12:00 → 1.800 adet tamamlandi (ogle arasi oncesi)
  Saat 14:00 → 2.500 adet (ogle sonrasi)
  Saat 16:00 → 3.400 adet
```

---

# ══════════════════════════════════════════════════════════════
# ADIM 12: FIRE / HURDA KAYDI
# ══════════════════════════════════════════════════════════════

## 12.1 Enjeksiyon Fireleri
**Ekran:** Atolye Terminali > Fire Kayit
**API:** PUT /ShopFloor/complete-work/{logId} (scrapQuantity parametresi)

```
Beklenen Fire Turleri (Plastik Enjeksiyon):

| Fire Turu      | Adet | Aciklama                              | Neden Kodu       |
|----------------|------|---------------------------------------|------------------|
| Capak (Flash)  | 45   | Kalip birlestirme hattinda fazla malz | CAPAK            |
| Cokme (Sink)   | 22   | Sogutma yetersizligi, yuzey cokmesi   | COKME            |
| Yanik (Burn)   | 8    | Hava tahliye yetersiz, sari lekeler   | YANIK            |
| Cekme (Warp)   | 15   | Carpilma, boyut bozulmasi             | CEKME            |
| Kirik          | 5    | Kaliptan cikarma sirasinda kirilma    | KIRIK            |
| Renk Hatasi    | 12   | Masterbatch dagilim sorunu            | RENK_HATASI      |

Toplam Fire: 107 adet
Fire Orani: 107 / 10.000 = %1.07

Ilk vardiya sonu raporu:
  Uretilen: 3.400 adet
  Fire: 42 adet
  Net: 3.358 adet
```

**Dogrulama:**
- [ ] Fire kaydi yapildi
- [ ] Fire turleri ve miktarlari girildi
- [ ] Toplam uretim = iyi adet + fire adet
- [ ] Fire orani hesaplanabiliyor

**Bilinen Sorunlar:**
- ⚠️ Fire/hurda kaydi icin ayri endpoint var mi yoksa complete-work icinde mi?
- ⚠️ Fire neden kodlari sisteme tanimli mi?

---

# ══════════════════════════════════════════════════════════════
# ADIM 13: DURUS KAYDI
# ══════════════════════════════════════════════════════════════

## 13.1 Makine Durusu
**Ekran:** Atolye Terminali > Durdur
**API:** PUT /ShopFloor/pause-work/{logId}

```
Senaryo 1 — Kalip Degisimi:
  DURDUR → Neden: "Kalip Bakimi"
  Not: "Kalip sogutma kanallari temizligi, 45dk"
  Baslangic: 2026-04-18 10:00
  Bitis: 2026-04-18 10:45
  Sure: 45 dakika

Senaryo 2 — Malzeme Bekleme:
  DURDUR → Neden: "Malzeme Bekleme"
  Not: "PP granul bitti, yeni big-bag bekleniyor"
  Baslangic: 2026-04-18 14:30
  Bitis: 2026-04-18 14:50
  Sure: 20 dakika

Senaryo 3 — Ariza:
  DURDUR → Neden: "Makine Arizasi"
  Not: "Hidrolik basinc dusumu, teknisyen cagrildi"
  Baslangic: 2026-04-19 09:15
  Bitis: 2026-04-19 11:30
  Sure: 135 dakika (2 saat 15 dk)
```

**Dogrulama:**
- [ ] Durdur modali acildi, neden secildi
- [ ] PAUSED durumunda miktar/tamamla/hurda kontrolleri devre disi
- [ ] DEVAM ET → IN_PROGRESS'e doner
- [ ] Durus suresi kaydedildi
- [ ] Toplam durus suresi: 200 dakika

**Bilinen Sorunlar:**
- ⚠️ Durus zamanlari DB'ye kaydedilmiyor (sadece client-side) — kontrol edilmeli

---

# ══════════════════════════════════════════════════════════════
# ADIM 14: ARA KALITE KONTROL
# ══════════════════════════════════════════════════════════════

## 14.1 Operasyon Sonrasi Olcum (OP10 Tamamla)
**Ekran:** Atolye Terminali > Tamamla
**API:** PUT /ShopFloor/complete-work/{logId}

```
OP10 Enjeksiyon Tamamlandi:
  Toplam Uretim: 10.107 adet (10.000 iyi + 107 fire)
  
Olcum Modali (RequiresQualityCheck=true):
  | Olcum Noktasi    | Spec    | Tol+   | Tol-   | Olculen | Sonuc |
  |------------------|---------|--------|--------|---------|-------|
  | Dis Boyut (en)   | 400mm   | +0.5   | -0.5   | 400.2   | ✅    |
  | Dis Boyut (boy)  | 300mm   | +0.5   | -0.5   | 299.8   | ✅    |
  | Yukseklik        | 150mm   | +0.3   | -0.3   | 150.1   | ✅    |
  | Agirlik          | 620gr   | +15    | -15    | 618     | ✅    |
  | Et Kalinligi     | 2.5mm   | +0.2   | -0.2   | 2.45    | ✅    |
  | Gorsel Kontrol   | TAMAM   | —      | —      | TAMAM   | ✅    |
```

**Dogrulama:**
- [ ] Olcum modali acildi (kontrol planindan)
- [ ] Gercek zamanli pass/fail gorunuyor
- [ ] Tum olcumler gecti → kalite otomatik onaylandi
- [ ] OP20 baslatilabilir durumda

## 14.2 Kalite Onay (Kaliteci)
**Ekran:** Kalite > Operasyon Muayeneleri (/quality/operation-inspections)
**API:** POST /ShopFloor/approve-quality/{workOrderId}
**Kullanici:** Zeynep Kaliteci (kaliteci rolu)

```
Kaliteci Zeynep bu ekrani acar:
  OP10 "Bekliyor" olarak gorunur
  → Olcum sonuclarini inceler
  → Onayla → not: "Tum boyutlar tolerans icinde, gorsel uygun"
  → Status: "Onaylandi"
  → OP20 baslatilabilir
```

**Dogrulama:**
- [ ] Operasyon Muayeneleri sayfasinda bekleyen isler gorunuyor
- [ ] Kaliteci sadece kalite menulerini goruyor
- [ ] Onayla calisti, status "Onaylandi" oldu
- [ ] Sonraki operasyona gecis mumkun

---

# ══════════════════════════════════════════════════════════════
# ADIM 15-17: SONRAKI OPERASYONLAR (OP20 → OP40)
# ══════════════════════════════════════════════════════════════

## 15.1 OP20 — Sogutma + Capak Alma
```
Operator: Ali
Makine: — (elle islem)
Baslat → Capak biçagiyla kalip hatti temizligi
Tamamla: 10.000 adet (fire ayrılmıs)
Kalite: HAYIR (otomatik gecis)
→ OP30 baslatilabilir
```

## 16.1 OP30 — Montaj (Kulp Takma)
```
Operator: Ali
Makine: — (montaj bankasi)
Baslat → Plastik kulp klips sistemiyle takılır
Tamamla: 10.000 adet
Kalite: HAYIR (otomatik gecis)
→ OP40 baslatilabilir
```

## 17.1 OP40 — Kalite Kontrol (Son Parcada)
```
Operator: Zeynep (kaliteci)
Baslat → Numune bazlı kontrol (AQL 1.0, Seviye II)
  Parti: 10.000 adet
  Numune: 200 adet (MIL-STD-1916)
  
  Kontrol Noktalari:
    - Boyut (en/boy/yukseklik): 200/200 GECTI
    - Agirlik: 200/200 GECTI (615-635gr arasi)
    - Gorsel (cizik, leke, renk): 198/200 GECTI (2 adet renk tonu farki → kabul)
    - Istifleme testi: GECTI (10 kasa ust uste, deformasyon yok)
    - Yuk testi: GECTI (25 kg yuk, 24 saat → carpılma yok)

Sonuc: KABUL (AQL kriterlerine uygun)
Tamamla: 10.000 adet
```

**Dogrulama:**
- [ ] OP20-OP40 sirasiyla tamamlandi
- [ ] Prerequisite kontrolu calisti (sira atlanamiyor)
- [ ] OP40 kalite sonuclari kaydedildi

---

# ══════════════════════════════════════════════════════════════
# ADIM 18: SON MUAYENE
# ══════════════════════════════════════════════════════════════

## 18.1 Final Muayene
**Ekran:** Uretim Detay > Final Muayene & CoC
**API:** POST /FinalInspectionRelease

```
Final Muayene Raporu:
  Urun:       MAM-KASA-4030-M
  Parti:      10.000 adet
  Muayeneci:  Zeynep Kaliteci
  Tarih:      2026-04-23
  
  Kontrol Listesi:
    ✅ Boyutsal kontrol (AQL sonuclari uygun)
    ✅ Agirlik kontrolu (ortalama: 619gr, spec: 620±15gr)
    ✅ Gorsel kontrol (renk, yuzey, baski)
    ✅ Istifleme testi (10 kasa, 48 saat)
    ✅ Gida uygunluk belgesi (PP MH12 sertifikasi mevcut)
    ✅ Ambalaj kontrol (strec film, etiketleme)
    
  Sonuc: ONAYLANDI
  Not: "Tum testler uygun, sevkiyata hazir"
```

**Dogrulama:**
- [ ] Final muayene onaylandi
- [ ] Uretim durumu TAMAMLANDI'ya dondu
- [ ] Sevkiyat acildi

---

# ══════════════════════════════════════════════════════════════
# ADIM 19: OP50 PAKETLEME + DEPO GIRISI
# ══════════════════════════════════════════════════════════════

## 19.1 Paketleme (OP50)
```
Operator: Ali
Paketleme:
  - 10.000 adet kasa → 20'ser istiflenerek paletlenir
  - 500 palet x 20 adet = 10.000 adet
  - Her palet strec film ile sarilir
  - Palet etiketi: Lot no, urun kodu, miktar, tarih
Tamamla: 10.000 adet
```

## 19.2 Mamul Depo Girisi (Lot Bazli)
**Ekran:** Stok > Giris/Cikis
**API:** POST /StockReceipts
**Kullanici:** Fatma Depocu (depo sorumlusu)

```
Depo:       MAMUL-DEPO
Belge No:   URE-GIR-2026-001
Kalemler:
  - MAM-KASA-4030-M x 10.000 adet x 28 TL (maliyet fiyati)
Lot No:     LOT-KASA-2026-04-001
Aciklama:   Uretim cikisi — Siparis SIP-2026-001
```

**Dogrulama:**
- [ ] Mamul deposuna 10.000 adet giris yapildi
- [ ] Lot numarasi atandi
- [ ] Stok sayfasinda 10.000 adet gorunuyor
- [ ] Depo sorumlusu roluyle islem yapildi

---

# ══════════════════════════════════════════════════════════════
# ADIM 20-22: SEVKIYAT → IRSALIYE → FATURA
# ══════════════════════════════════════════════════════════════

## 20.1 Sevkiyat Olustur
**Ekran:** Sevkiyat
**API:** POST /Shipment

```
Sevkiyat:
  Musteri:    A101 Yeni Magazacilik A.S.
  Adres:      Sancaktepe Merkez Depo, Istanbul
  Tarih:      2026-04-25
  Irsaliye No: OZK-IRS-2026-001
  
  Kalemler:
    - MAM-KASA-4030-M x 10.000 adet
    
  Paketleme:  500 palet (20 adet/palet)
  Tasima:     TIR — 2 arac (250 palet/TIR)
  Not:        A101 Sancaktepe deposuna teslimat
```

**Dogrulama:**
- [ ] Sevkiyat kaydi olusturuldu
- [ ] Stoktan 10.000 adet dustu (MAMUL-DEPO)
- [ ] Siparis durumu guncellendi

## 21.1 Irsaliye
**Ekran:** Irsaliyeler
**API:** POST /Waybill (veya sevkiyat icinde)

```
Irsaliye No:  OZK-IRS-2026-001
Musteri:      A101
Tarih:        2026-04-25
Kalemler:     MAM-KASA-4030-M x 10.000 adet
Sevk Adresi:  Sancaktepe Merkez Depo
```

**Dogrulama:**
- [ ] Irsaliye olusturuldu
- [ ] Sevkiyata bagli

## 22.1 Satis Faturasi
**Ekran:** Faturalar
**API:** POST /Invoice

```
Fatura:
  Musteri:     A101 Yeni Magazacilik A.S.
  Fatura No:   OZK-FAT-2026-001
  Tarih:       2026-04-25
  Tip:         SALES
  Vade:        60 gun (2026-06-24)
  
  Kalemler:
    - MAM-KASA-4030-M x 10.000 adet x 28 TL = 280.000 TL
    
  Ara Toplam:  280.000 TL
  KDV (%20):    56.000 TL
  Genel Toplam: 336.000 TL
```

**Dogrulama:**
- [ ] Fatura olusturuldu
- [ ] Toplam 336.000 TL (KDV dahil)
- [ ] Fatura tipi SALES
- [ ] Vade 60 gun olarak girildi

**Bilinen Sorunlar:**
- ⚠️ Invoice items alan adi: `items` (invoiceItems degil)
- ⚠️ InvoiceType: 'SALES'

---

# ══════════════════════════════════════════════════════════════
# ADIM 23: MALIYET ANALIZI
# ══════════════════════════════════════════════════════════════

## 23.1 Uretim Maliyet Hesaplama
**Ekran:** Uretim > Maliyet Analizi
**API:** GET /PartCost/estimate

```
HAMMADDE MALIYETI:
  | Malzeme          | Miktar    | Birim Fiyat | Toplam     |
  |------------------|-----------|-------------|------------|
  | PP Granul (MH12) | 6.500 kg  | 32 TL/kg    | 208.000 TL |
  | Mavi Masterbatch | 200 kg    | 85 TL/kg    | 17.000 TL  |
  | Strec Film       | 50 rulo   | 120 TL/rulo | 6.000 TL   |
  | TOPLAM           |           |             | 231.000 TL |

ISCILIK MALIYETI:
  | Operasyon         | Sure (toplam) | Isci Sayisi | Saat Ucreti | Toplam    |
  |-------------------|---------------|-------------|-------------|-----------|
  | OP10 Enjeksiyon   | 24 saat       | 1           | 150 TL/saat | 3.600 TL  |
  | OP20 Sogutma      | 42 saat       | 2           | 100 TL/saat | 8.400 TL  |
  | OP30 Montaj       | 56 saat       | 2           | 120 TL/saat | 13.440 TL |
  | OP40 Kalite       | 12 saat       | 1           | 150 TL/saat | 1.800 TL  |
  | OP50 Paketleme    | 28 saat       | 2           | 100 TL/saat | 5.600 TL  |
  | TOPLAM            |               |             |             | 32.840 TL |

MAKINE MALIYETI:
  | Makine | Sure     | Saat Ucreti | Toplam    |
  |--------|----------|-------------|-----------|
  | ENJ1   | 24 saat  | 350 TL/saat | 8.400 TL  |
  | TOPLAM |          |             | 8.400 TL  |

FIRE MALIYETI:
  107 adet fire x (hammadde birim maliyet)
  107 x (0.650kg x 32 + 0.020kg x 85) = 107 x 22.50 = 2.407 TL

DURUS MALIYETI:
  200 dk durus x (makine saat ucreti / 60) = 200/60 x 350 = 1.167 TL

GENEL GIDER (%15 overhead):
  (231.000 + 32.840 + 8.400) x 0.15 = 40.836 TL

════════════════════════════════
TOPLAM URETIM MALIYETI:      316.643 TL
BIRIM MALIYET:               31.66 TL/adet
SATIS FIYATI:                28.00 TL/adet
SATIS TOPLAMI:               280.000 TL
BRUT KAR/ZARAR:              -36.643 TL (ZARAR)
KAR MARJI:                   -%13.1
════════════════════════════════

NOT: Bu ornekte bilinçli olarak zararda bir senaryo olusturulmustur.
Gercek hayatta fiyat revizyonu veya verimlilik artisi gerekecektir.
```

**Dogrulama:**
- [ ] Maliyet analizi sayfasi aciliyor
- [ ] Hammadde, iscilik, makine maliyetleri gorunuyor
- [ ] Fire maliyeti hesaba katiliyor
- [ ] Birim maliyet dogru hesaplaniyor
- [ ] Kar/zarar analizi gorunuyor

---

# ══════════════════════════════════════════════════════════════
# ADIM 24: STOK ABC ANALIZI
# ══════════════════════════════════════════════════════════════

## 24.1 ABC Analizi
**Ekran:** Stok > ABC Analizi (veya Raporlar)
**API:** GET /Stock/abc-analysis

```
Beklenen Siniflandirma:
  | Urun             | Deger (TL)  | Kumulatif % | Sinif |
  |------------------|-------------|-------------|-------|
  | PP Granul (MH12) | 208.000     | %74.1       | A     |
  | Mavi Masterbatch | 17.000      | %80.2       | B     |
  | Strec Film       | 6.000       | %82.3       | B     |

A Sinifi: %70-80 deger, %10-20 kalem → PP Granul
B Sinifi: %15-25 deger, %20-30 kalem → Masterbatch, Strec
C Sinifi: —
```

**Dogrulama:**
- [ ] ABC analizi calisiyor
- [ ] PP Granul A sinifinda
- [ ] Grafik/tablo gorunuyor
- [ ] Kalem oranları dogru

**Bilinen Sorunlar:**
- ⚠️ ABC analizi modulu mevcut mu? Yoksa stok raporlarindan cikarilmali

---

# ══════════════════════════════════════════════════════════════
# ADIM 25-27: ROL BAZLI ERISIM TESTLERI
# ══════════════════════════════════════════════════════════════

## 25.1 Depo Sorumlusu (Fatma) — Erisim Testi
**Kullanici:** fatma@ozkanplastik.com / Test1234!@#$

```
GOREBILMELI (✅):
  - Stok > Stok Listesi
  - Stok > Giris/Cikis
  - Stok > Depolar
  - Stok > Stok Hareketleri

GOREMEMELI (❌):
  - Teklifler
  - Satislar
  - Uretim
  - Faturalar
  - Satin Alma
  - Kalite
  - Ayarlar > Kullanicilar
```

**Dogrulama:**
- [ ] Fatma ile giris yapildi
- [ ] Sadece stok menuleri gorunuyor
- [ ] Diger menuler gorunmuyor
- [ ] URL ile direkt erisim denendi → /offers sayfasi "Yetkiniz Yok" dondu
- [ ] API'ye direkt istek → 403 Forbidden

## 26.1 Satinalma (Murat) — Erisim Testi
**Kullanici:** murat@ozkanplastik.com / Test1234!@#$

```
GOREBILMELI (✅):
  - Satin Alma > Siparisler
  - Satin Alma > Tedarikci Listesi
  - Stok > Stok Listesi (sadece goruntuleme)

GOREMEMELI (❌):
  - Teklifler
  - Satislar
  - Uretim
  - Faturalar
  - Kalite (kaydet haric)
  - Ayarlar > Kullanicilar
```

**Dogrulama:**
- [ ] Murat ile giris yapildi
- [ ] Sadece satin alma menuleri gorunuyor
- [ ] Tedarikci olusturma calisiyor
- [ ] Satin alma siparisi olusturma calisiyor
- [ ] Fatura menusune erisemiyor

## 27.1 Operator (Ali) — Erisim Testi
**Kullanici:** ali@ozkanplastik.com / Test1234!@#$

```
GOREBILMELI (✅):
  - Atolye Terminali (/shop-floor-terminal)
  - Is Emirlerim (kendi atanan isleri)

GOREMEMELI (❌):
  - Tum diger menuler
  - Baska operatorlerin isleri
  - Yonetim ekranlari
```

**Dogrulama:**
- [ ] Ali ile giris yapildi
- [ ] Sadece atolye terminali gorunuyor
- [ ] Kendi islerini gordu, baskalarinikini goremedi
- [ ] Dashboard'a erisim yok
- [ ] /production URL'si "Yetkiniz Yok" dondu

---

# ══════════════════════════════════════════════════════════════
# ADIM 28: KALITE OLAYLARI (NCR / CAPA)
# ══════════════════════════════════════════════════════════════

## 28.1 NCR — Uygunsuzluk Kaydi
**Ekran:** Kalite > Uygunsuzluk
**API:** POST /Ncr

```
Senaryo: Montaj hattinda 35 adet kasada kulp klips yuvasinda catlaklık tespit edildi

NCR Kaydi:
  Urun:         MAM-KASA-4030-M
  Operasyon:    OP30 Montaj
  Siddet:       MINOR
  Etkilenen:    35 adet
  Tespit Eden:  Zeynep Kaliteci
  Aciklama:     Kulp takma yuvasinda mikro catlak, muhtemelen sogutma
                suresi yetersizligi nedeniyle ic gerilim olusmus
  
  Kok Neden:    Sogutma suresi 18sn → yetersiz, 22sn olmali
  Duzeltici:    Sogutma suresi 22sn'ye cikartildi, etkilenen 35 adet ayrıldı
  Onleyici:     Kalip sogutma parametreleri revize edildi,
                SPC kontrol kartina "sogutma suresi" eklendi
```

**Workflow:** OPEN → UNDER_REVIEW → CORRECTIVE_ACTION → CLOSED

**Dogrulama:**
- [ ] NCR olusturuldu
- [ ] Kok neden girilmeden kapatilamiyor (ISO 9001 enforcement)
- [ ] Duzeltici/onleyici faaliyet girildi
- [ ] CLOSED durumuna gecti

## 28.2 CAPA — Duzeltici Faaliyet
**Ekran:** Kalite > CAPA
**API:** POST /Capa

```
CAPA Kaydi:
  Tip:          CORRECTIVE
  Kaynak:       NCR (yukaridaki)
  Kok Neden:    Sogutma parametresi optimizasyonu yetersiz
  Analiz:       5 Neden (5-Why) Analizi
    1. Neden catlak olustu? → Ic gerilim
    2. Neden ic gerilim? → Yetersiz sogutma
    3. Neden yetersiz sogutma? → Parametre 18sn (eskiden yeterli)
    4. Neden parametre degismedi? → Yeni kalip revizyon sonrasi guncellenmedi
    5. Neden guncellenmedi? → Kalip degisiklik proseduru eksik
    
  Faaliyet:     Kalip degisiklik yonetimi proseduru yazildi (PR-QC-012)
  Dogrulama:    30 gun sonra sonuc kontrolu
  Sorumlu:      Zeynep Kaliteci
  Hedef Tarih:  2026-05-25
```

**Dogrulama:**
- [ ] CAPA olusturuldu, NCR'ye bagli
- [ ] 5-Why analizi girildi
- [ ] Workflow calisti
- [ ] Takip tarihi atandi

---

# ══════════════════════════════════════════════════════════════
# ADIM 29: KONTROL PLANI
# ══════════════════════════════════════════════════════════════

## 29.1 Kontrol Plani Olusturma
**Ekran:** Kalite > Kontrol Planlari
**API:** POST /ControlPlan + POST /ControlPlan/items

```
Plan No:    KP-KASA-001
Urun:       Plastik Kasa 40x30x15 Mavi
Standart:   ISO 9001

| # | Operasyon    | Olcu Noktasi    | Spec   | Tol+  | Tol-  | Metod      | Frekans    | Kritik |
|---|-------------|-----------------|--------|-------|-------|------------|------------|--------|
| 1 | OP10 Enj.   | Dis Boyut (en)  | 400mm  | +0.5  | -0.5  | Kumpas     | Her 50 cy  | HAYIR  |
| 2 | OP10 Enj.   | Dis Boyut (boy) | 300mm  | +0.5  | -0.5  | Kumpas     | Her 50 cy  | HAYIR  |
| 3 | OP10 Enj.   | Yukseklik       | 150mm  | +0.3  | -0.3  | Kumpas     | Her 50 cy  | HAYIR  |
| 4 | OP10 Enj.   | Agirlik         | 620gr  | +15   | -15   | Terazi     | Her 10 cy  | EVET   |
| 5 | OP10 Enj.   | Et Kalinligi    | 2.5mm  | +0.2  | -0.2  | Kalinlik o | Her 100 cy | EVET   |
| 6 | OP10 Enj.   | Gorsel          | TAMAM  | —     | —     | Gozle      | %100       | HAYIR  |
| 7 | OP30 Montaj | Kulp Saglamlik  | 5 kg   | —     | —     | Cekme test | Her 200 ad | EVET   |
| 8 | OP40 Final  | Istifleme       | 10 kat | —     | —     | Istifleme  | Her parti  | EVET   |
| 9 | OP40 Final  | Yuk Testi       | 25 kg  | —     | —     | Statik yuk | Her parti  | EVET   |
```

**Dogrulama:**
- [ ] Kontrol plani + 9 kalem olusturuldu
- [ ] Plan ACTIVE durumunda
- [ ] Kritik olcum noktalari isaretlendi

---

# ══════════════════════════════════════════════════════════════
# ADIM 30: KALIBRASYON
# ══════════════════════════════════════════════════════════════

## 30.1 Kalibrasyon Ekipmanlari
**Ekran:** Kalite > Kalibrasyon
**API:** POST /Calibration/equipment

| Kod    | Alet                    | Dogruluk | Frekans  |
|--------|-------------------------|----------|----------|
| KMP-01 | Kumpas 0-300mm          | 0.02mm   | 6 Aylik  |
| TRZ-01 | Hassas Terazi 0-5kg     | 0.1 gr   | Yillik   |
| KLN-01 | Kalinlik Olcer 0-10mm   | 0.01mm   | 6 Aylik  |
| CMT-01 | Cekme Testi Cihazi      | 0.5 kg   | Yillik   |

Her birine kalibrasyon kaydi:
```
Sertifika No: KAL-2026-001 (KMP-01 icin)
Tarih: 2026-02-15
Sonraki: 2026-08-15
Lab: TUBITAK UME
Sonuc: GECTI
```

**Dogrulama:**
- [ ] 4 ekipman + kalibrasyon kaydi eklendi
- [ ] Sonraki kalibrasyon tarihleri dogru

---

# ══════════════════════════════════════════════════════════════
# ADIM 31: DASHBOARD ve RAPORLAR
# ══════════════════════════════════════════════════════════════

## 31.1 Yonetim Kokpiti
**Ekran:** Dashboard (/dashboard)

```
Kontrol Noktalari:
  - [ ] Toplam satis tutari: 280.000 TL gorunuyor
  - [ ] Acik siparis sayisi: 0 (teslim edildi)
  - [ ] Uretim durumu: 1 tamamlanmis is emri
  - [ ] Stok durumu: PP stok azaldi (uyari)
  - [ ] Kalite metrikleri: 1 NCR, 1 CAPA
  - [ ] Fire orani: %1.07
  - [ ] Zamaninda teslimat: %100 (1/1)
  - [ ] OEE: Hesaplanabiliyorsa goruntulensin
```

## 31.2 Stok Raporu
**Ekran:** Stok > Raporlar

```
Mevcut Stok Durumu:
  | Urun             | Depo      | Miktar | Birim | Deger      |
  |------------------|-----------|--------|-------|------------|
  | PP Granul (MH12) | ANA-DEPO  | ~0 kg  | kg    | ~0 TL      |
  | Mavi Masterbatch | ANA-DEPO  | ~0 kg  | kg    | ~0 TL      |
  | Strec Film       | ANA-DEPO  | ~0 rulo| rulo  | ~0 TL      |
  | Plastik Kasa     | MAMUL-DEPO| 0 adet | adet  | 0 TL       |

  Not: Tum hammadde tuketildi, tum mamul sevk edildi
```

**Dogrulama:**
- [ ] Stok raporu aciliyor
- [ ] Depo bazli stok gorunuyor
- [ ] Hareketler (giris/cikis) izlenebiliyor

---

# ══════════════════════════════════════════════════════════════
# ADIM 32: SATIN ALMA FATURASI (Gider)
# ══════════════════════════════════════════════════════════════

## 32.1 Tedarikci Faturalari
**Ekran:** Faturalar
**API:** POST /Invoice

```
Fatura 1 — Petkim:
  Tedarikci:   Petkim Petrokimya A.S.
  Fatura No:   PTK-FAT-2026-0412
  Tip:         PURCHASE
  Kalemler:
    - HAM-PP-MH12 x 6.500 kg x 32 TL = 208.000 TL
  KDV (%20):   41.600 TL
  Toplam:      249.600 TL

Fatura 2 — Baskent Masterbatch:
  Tedarikci:   Baskent Masterbatch Ltd.
  Fatura No:   BAS-FAT-2026-0414
  Tip:         PURCHASE
  Kalemler:
    - HAM-MB-MAVI42 x 200 kg x 85 TL = 17.000 TL
  KDV (%20):   3.400 TL
  Toplam:      20.400 TL
  
Fatura 3 — Strec Film:
  Tip:         PURCHASE
  Kalemler:
    - HAM-STREC-50 x 50 rulo x 120 TL = 6.000 TL
  KDV (%20):   1.200 TL
  Toplam:      7.200 TL
```

**Dogrulama:**
- [ ] 3 alis faturasi olusturuldu
- [ ] Toplam gider: 277.200 TL (KDV dahil)
- [ ] Fatura tipi PURCHASE

---

# ══════════════════════════════════════════════════════════════
# ADIM 33: GENEL DOGRULAMA ve TEMIZLIK
# ══════════════════════════════════════════════════════════════

## 33.1 Veri Butunlugu Kontrolu

```
Siparis → Uretim → Sevkiyat Zinciri:
  - [ ] Siparis 10.000 adet → Uretim 10.000 adet → Sevk 10.000 adet ✅
  - [ ] Stok hareketi: +10.000 (uretim girisi) → -10.000 (sevk cikisi) = 0
  - [ ] Fatura tutari: Satis 280.000 TL, Alis 231.000 TL (KDV haric)

BOM Tutarliligi:
  - [ ] 10.000 adet x 0.650 kg PP = 6.500 kg → Satin alinan: 6.500 kg ✅
  - [ ] 10.000 adet x 0.020 kg MB = 200 kg → Satin alinan: 200 kg ✅
  - [ ] 10.000 adet x 0.005 rulo SF = 50 rulo → Satin alinan: 50 rulo ✅

Kalite Izlenebilirlik:
  - [ ] Hammadde lot → Giris muayene → Uretim → Final muayene → Sevkiyat
  - [ ] NCR → CAPA baglantisi mevcut
  - [ ] Kontrol plani → Olcum kaydi baglantisi mevcut

Mali Ozet:
  - [ ] Satis geliri: 280.000 TL (KDV haric)
  - [ ] Hammadde gideri: 231.000 TL
  - [ ] Iscilik + Makine: 41.240 TL
  - [ ] Fire + Durus: 3.574 TL
  - [ ] Brut kar/zarar hesaplama tutarli
```

## 33.2 Performans Kontrolu
```
  - [ ] Sayfa yukleme sureleri < 2 saniye
  - [ ] Stok listesi 10.000+ kayitla yavaslamiyor
  - [ ] MRP hesaplama < 5 saniye
  - [ ] Rapor sayfasi hatasiz yukluyor
```

---

# ══════════════════════════════════════════════════════════════
# BILINEN SORUNLAR OZETI
# ══════════════════════════════════════════════════════════════

## Kritik (Patlayan Noktalar)

| # | Sorun | Nerede | Durum |
|---|-------|--------|-------|
| 1 | WorkOrderLogs MachinesId shadow property | ShopFloor start-work | ⚠️ Kontrol edilmeli |
| 2 | GetUserId() JWT sub claim Guid/string | ShopFloor controller | ⚠️ Email ile resolve |
| 3 | Teklif nested offerProducts circular ref | Offer POST | ✅ 2 adimli akis |
| 4 | Siparis direkt approve edilemez | Sales controller | ✅ request-approval oncesi |
| 5 | ProductType PRODUCTION_MATERIAL zorunlu | Product entity | ✅ Urunler sayfasi icin |
| 6 | isCustomer/isSupplier flag | Customer entity | ✅ Dogru flag gonderilmeli |
| 7 | MRP modulu mevcut mu? | MRP | ⚠️ Kontrol edilmeli |
| 8 | Fire/hurda ayri endpoint | ShopFloor | ⚠️ Kontrol edilmeli |

## Orta (UX Sorunlari)

| # | Sorun | Nerede | Durum |
|---|-------|--------|-------|
| 9 | Kalip modulu ayri entity yok | Makineler/Urunler | ⚠️ Not alani kullaniliyor |
| 10 | Lot numarasi otomatik atama | StockReceipts | ⚠️ Manuel giris gerekebilir |
| 11 | ABC analizi modulu | Stok raporlari | ⚠️ Kontrol edilmeli |
| 12 | BOM fire orani alani | ProductRecipe | ⚠️ Mevcut mu kontrol |
| 13 | Durus zamanlari DB kaydi | ShopFloor stopLog | ⚠️ Client-side olabilir |

## Dusuk (Gelecek Sprint)

| # | Sorun | Nerede |
|---|-------|--------|
| 14 | Kalip omru / cevrim sayaci | Makine/Kalip modulu |
| 15 | SPC kontrol karti | Kalite modulu |
| 16 | OEE hesaplama | Dashboard |
| 17 | Cevrim bazli uretim takibi (enjeksiyona ozel) | ShopFloor |
| 18 | Sogutma parametreleri otomatik kontrol | Uretim terminali |

---

# ══════════════════════════════════════════════════════════════
# PLASTIK ENJEKSIYON SEKTORUNE OZEL NOTLAR
# ══════════════════════════════════════════════════════════════

## Sektor Farkliliklari (CNC vs Plastik Enjeksiyon)

| Ozellik | CNC Metal Isleme | Plastik Enjeksiyon |
|---------|------------------|-------------------|
| Uretim Hizi | Dakikalar/parca | Saniyeler/parca (cevrim bazli) |
| Parti Buyuklugu | 50-500 adet | 5.000-100.000 adet |
| Fire Turu | Talas (geri donusumsuz) | Plastik (geri donusumlu) |
| Kalip | Takim tutucu (ucuz) | Enjeksiyon kalıbi (cok pahali, 50K-500K TL) |
| Parametre | Devir, ilerleme, derinlik | Sicaklik, basinc, cevrim suresi |
| Tolerans | 0.001-0.01mm | 0.1-0.5mm |
| Hammadde | Metal cubuk/levha | Granul (kg bazli) |
| Makine Maliyeti | 200-500K TL | 500K-5M TL |
| Kalite Kontrol | Boyutsal (mikrometre) | Boyut + agirlik + gorsel |
| Geri Donusum | Hayir | Evet (kirik parcalar ogutulur) |

## Quvex Plastik Enjeksiyon Uyumluluk Durumu

```
✅ Desteklenen:
  - Musteri/Tedarikci yonetimi
  - Urun + BOM tanimlari
  - Teklif → Siparis → Uretim akisi
  - Is emri ve operasyon yonetimi
  - Atolye terminali (baslat/durdur/tamamla)
  - Kalite kontrol (boyut, agirlik)
  - Stok yonetimi (lot bazli)
  - Fatura (alis/satis)
  - NCR / CAPA

⚠️ Kismi Destek (Gelistirme Gerekli):
  - Kalip yonetimi (ayri modül yok, not alani)
  - Cevrim bazli uretim takibi (saniye bazli)
  - Fire geri donusum yonetimi (ogutme → tekrar kullanim)
  - Kalip parametreleri (sicaklik, basinc, cevrim) otomatik izleme
  - MRP (temel seviye, BOM patlatma)

❌ Henuz Yok:
  - Kalip omru / cevrim sayaci
  - SPC (Istatistiksel Proses Kontrol) karti
  - OEE (Genel Ekipman Etkinligi) hesaplama
  - IoT entegrasyonu (makine veri toplama — Field Gateway ile planli)
  - Enerji tuketim takibi (kWh/parca)
```

---

# ══════════════════════════════════════════════════════════════
# TEST SONUC TABLOSU
# ══════════════════════════════════════════════════════════════

| Adim | Islem | Durumu | Not |
|------|-------|--------|-----|
| 0.1 | Firma kaydi (register) | [ ] | |
| 0.2 | Onboarding | [ ] | |
| 0.3 | 4 kullanici + roller | [ ] | |
| 1.1 | Musteri (A101) | [ ] | |
| 2.1 | PP Granul hammadde | [ ] | |
| 2.2 | Masterbatch hammadde | [ ] | |
| 2.3 | Strec Film hammadde | [ ] | |
| 2.4 | Plastik Kasa mamul | [ ] | |
| 3.1 | 3 enjeksiyon makinesi | [ ] | |
| 3.2 | Kalip bilgileri | [ ] | |
| 3.3 | 5 operasyon | [ ] | |
| 4.1 | BOM (3 kalem + fire %) | [ ] | |
| 5.1 | Teklif (280.000 TL) | [ ] | |
| 5.2 | Siparis (teklif onayi) | [ ] | |
| 6.1 | MRP calistir | [ ] | |
| 7.1 | 2 tedarikci | [ ] | |
| 7.2 | 3 satin alma siparisi | [ ] | |
| 8.1 | 3 stok girisi (mal kabul) | [ ] | |
| 8.2 | 2 giris muayenesi | [ ] | |
| 9.1 | 2 depo | [ ] | |
| 10.1 | Is emri sablonu (5 adim) | [ ] | |
| 10.2 | Uretim emri (3 adimli akis) | [ ] | |
| 10.3 | Is emri atama + Gantt | [ ] | |
| 11.1 | OP10 baslat (operator terminali) | [ ] | |
| 11.2 | Uretim cevrim kayit | [ ] | |
| 12.1 | Fire/hurda kayit (107 adet) | [ ] | |
| 13.1 | 3 durus kaydi (200dk) | [ ] | |
| 14.1 | Ara kalite kontrol (olcum) | [ ] | |
| 14.2 | Kalite onay (kaliteci) | [ ] | |
| 15-17 | OP20-OP40 (3 operasyon) | [ ] | |
| 18.1 | Final muayene | [ ] | |
| 19.1 | Paketleme (OP50) | [ ] | |
| 19.2 | Mamul depo girisi (lot bazli) | [ ] | |
| 20.1 | Sevkiyat | [ ] | |
| 21.1 | Irsaliye | [ ] | |
| 22.1 | Satis faturasi (336.000 TL) | [ ] | |
| 23.1 | Maliyet analizi | [ ] | |
| 24.1 | Stok ABC analizi | [ ] | |
| 25.1 | Depo Sorumlusu erisim testi | [ ] | |
| 26.1 | Satinalma erisim testi | [ ] | |
| 27.1 | Operator erisim testi | [ ] | |
| 28.1 | NCR (uygunsuzluk) | [ ] | |
| 28.2 | CAPA (duzeltici faaliyet) | [ ] | |
| 29.1 | Kontrol plani (9 kalem) | [ ] | |
| 30.1 | Kalibrasyon (4 ekipman) | [ ] | |
| 31.1 | Dashboard kontrol | [ ] | |
| 31.2 | Stok raporu | [ ] | |
| 32.1 | 3 alis faturasi (277.200 TL) | [ ] | |
| 33.1 | Veri butunlugu kontrolu | [ ] | |
| 33.2 | Performans kontrolu | [ ] | |

**Toplam: 33 adim (48 alt islem)**

---

> **Hazirlayan:** Claude Opus 4.6 + Hakan Bey
> **Son Guncelleme:** 2026-04-10
> **Hedef:** Plastik enjeksiyon sektoru icin Quvex ERP uyumluluk testi
> **Firma Profili:** Kucuk-orta olcekli plastik enjeksiyon atölyesi (15-30 personel, 3 makine)
