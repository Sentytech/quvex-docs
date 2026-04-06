# Savunma Sanayi Talasli Imalat — Uctan Uca Test Senaryosu

> **Firma Profili:** RynSoft Hassas Makine San. A.S. — 45 personel, 12 CNC tezgah
> **Sertifikalar:** AS9100 Rev D, ISO 9001:2015, NADCAP (ozel proses yok, disaridan aliyor)
> **Musteriler:** TAI, ASELSAN, TUSAS, ROKETSAN tedarikcisi
> **Urunler:** Havacilik parcalari — hidrolik bloklar, mil, pim, burcu, flanslari
> **Senaryo:** TAI'den gelen yeni parca siparisi, malzeme alimi ile baslayip sevkiyat ve faturaya kadar tum surecleri kapsar

---

## BOLUM 0: SISTEM KURULUMU (Tek Seferlik)

### 0.1 Makine Tanimlari
**Ekran:** Ayarlar > Makineler (`/settings/machines`)
**API:** `POST /machines`

| Makine Kodu | Makine Adi | Marka | Yil | Saat Ucreti | Setup Ucreti |
|-------------|------------|-------|-----|-------------|--------------|
| CNC-T01 | Mazak QT-250 CNC Torna | Mazak | 2019 | 450 TL/saat | 350 TL/saat |
| CNC-T02 | Doosan Lynx 220 CNC Torna | Doosan | 2021 | 400 TL/saat | 300 TL/saat |
| CNC-F01 | Haas VF-2 CNC Freze | Haas | 2020 | 500 TL/saat | 400 TL/saat |
| CNC-F02 | Mazak VCN-530C CNC Freze | Mazak | 2022 | 550 TL/saat | 450 TL/saat |
| TAS-01 | Okamoto OGM-250 Silindirik Taslama | Okamoto | 2018 | 350 TL/saat | 250 TL/saat |
| TAS-02 | Chevalier FSG-1224 Duz Taslama | Chevalier | 2017 | 300 TL/saat | 200 TL/saat |

**Dogrulama:**
- [ ] 6 makine basariyla tanimlandi
- [ ] Saat ucretleri girildi
- [ ] Makine listesinde hepsi gorunuyor

### 0.2 Is Emri Adimlari (Operasyon Tanimlari)
**Ekran:** Ayarlar > Is Emri Adimlari (`/settings/work-order-steps`)
**API:** `POST /workordersteps`

| Kod | Operasyon Adi | Varsayilan Makine | Setup (dk) | Calisma (dk) | Takim | Tolerans | Beceri |
|-----|--------------|-------------------|------------|--------------|-------|----------|--------|
| OP10 | CNC Torna — Dis Cap Isleme | CNC-T01 (Mazak QT-250) | 30 | — | CNMG 120408 kesici uc, mandren | Genel tolerans IT7 | 3 (Usta) |
| OP20 | CNC Freze — Cep ve Kanal Isleme | CNC-F01 (Haas VF-2) | 45 | — | D10 karbur parmak freze, mengeneli baglama | Konum toleransi ±0.05 | 3 (Usta) |
| OP30 | Silindirik Taslama | TAS-01 (Okamoto OGM-250) | 20 | — | CBN taslik Ø300, arasinda baglama | h6 tolerans (Ø25: +0.000/-0.013) | 4 (Uzman) |
| OP40 | Capak Alma & Yuzey Temizleme | — | 5 | — | El aleti, zimpara, hava tabancasi | Gorse kontrol, capaksiz yuzey | 1 (Cirak) |
| OP50 | CNC Olcum (CMM) | — | 10 | — | CMM probe, fikstir | AS9102 olcum raporu | 4 (Uzman) |
| OP60 | Yuzey Islemi (Fason) | — | — | — | — | Kaplama kalınligi spec'e gore | — |
| OP70 | Final Muayene | — | 15 | — | Mikrometre, kaliper, uc olcer | Tum kritik olculer, CoC | 4 (Uzman) |

**Dogrulama:**
- [ ] 7 operasyon adimi tanimlandi
- [ ] Makine, sure, takim bilgileri girildi
- [ ] Beceri seviyeleri atandi

### 0.3 Genel Gider Yapilandirmasi
**Ekran:** Uretim > Maliyet Analizi (`/production/part-cost`)
**API:** `POST /partcost/overheads`

| Ad | Yuzde | Gecerlilik |
|----|-------|------------|
| Genel Imalat Giderleri | %25 | 2026-01-01 → — |
| Amortisman | %10 | 2026-01-01 → — |
| Enerji | %8 | 2026-01-01 → — |

**Dogrulama:**
- [ ] 3 genel gider kalemi tanimlandi (%43 toplam overhead)

### 0.4 Kalibrasyon Ekipmanlari
**Ekran:** Kalite > Kalibrasyon (`/quality/calibration`)
**API:** `POST /calibration/equipment`

| Kod | Ekipman | Marka/Model | Dogruluk | Frekans | Son Kalibrasyon | Sonraki |
|-----|---------|-------------|----------|---------|-----------------|---------|
| MIK-001 | Dis Mikrometre 0-25mm | Mitutoyo 103-137 | 0.001mm | Yillik | 2026-01-15 | 2027-01-15 |
| MIK-002 | Dis Mikrometre 25-50mm | Mitutoyo 103-138 | 0.001mm | Yillik | 2026-01-15 | 2027-01-15 |
| KAL-001 | Dijital Kumpas 0-150mm | Mitutoyo 500-196 | 0.01mm | 6 Aylik | 2026-02-01 | 2026-08-01 |
| UC-001 | Uc Olcer M8 6H | — | Go/NoGo | Yillik | 2025-12-01 | 2026-12-01 |
| CMM-001 | Koordinat Olcum Makinesi | Hexagon GLOBAL S | 0.001mm | 6 Aylik | 2026-03-01 | 2026-09-01 |
| YUZ-001 | Yuzey Puruzluluk Olcer | Mitutoyo SJ-210 | 0.01 Ra | Yillik | 2026-01-15 | 2027-01-15 |

**Dogrulama:**
- [ ] 6 kalibrasyon ekipmani tanimlandi
- [ ] Kalibrasyon tarihleri ve frekanslari girildi
- [ ] Dashboard'da uyumluluk % gorunuyor

---

## BOLUM 1: MUSTERI ve SOZLESME

### 1.1 Musteri Tanimi
**Ekran:** Musteriler (`/customers`)
**API:** `POST /customer`

```
Firma Adi: TAI — Turk Havacilik ve Uzay Sanayii A.S.
Yetkili: Mehmet Yilmaz (Satin Alma Mudurlugu)
Email: mehmet.yilmaz@tai.com.tr
Telefon: +90 312 811 1800
Adres: Fethiye Mah. Havacilik Blv. No:17, 06980 Kazan/Ankara
Vergi No: 1234567890 | Vergi Dairesi: Kazan
Kategori: A (Stratejik Musteri)
Doviz: USD
Odeme Vadesi: 60 gun
```

**Dogrulama:**
- [ ] Musteri karti olusturuldu
- [ ] Adres bilgileri girildi
- [ ] Kategori A olarak isaretlendi

### 1.2 Sozlesme Gozden Gecirme (Contract Review — AS9100 8.2.3)
**Ekran:** Kalite > (Henuz ayri ekran yok, ContractReview API uzerinden)
**API:** `POST /contractreview`

```
Satis Siparisi: (1.4'te olusturulacak)
Musteri Gereksinimleri:
  - Malzeme: 7075-T6 Aluminyum (AMS 4078)
  - Kaplama: Kadmiyum kaplama (AMS-QQ-P-416 Tip II Sinif 3)
  - Olcusel toleranslar: Cizim TAI-DWG-2026-0142 Rev B
  - Teslimat: 60 adet, 45 gun icinde
  - Ozel kosullar: FOD hassas bolge, tum parcalar seri numarali
  - Ilk parca muayenesi (FAI) zorunlu — ilk 3 parca icin AS9102 raporu
  - Kalite belgesi: CoC (Uygunluk Sertifikasi) zorunlu
Ozel Proses Gereksinimleri: Kadmiyum kaplama (NADCAP onayli fason)
Ihracat Kontrolu: Yok (yurt ici)
Risk Degerlendirmesi: Orta (yeni parca, ilk siparis)
```

**Dogrulama:**
- [ ] Contract review kaydi olusturuldu
- [ ] Tum gereksinimler (malzeme, kaplama, FAI, CoC) belgelendi
- [ ] HasFirstArticle = true, HasCertificateRequirement = true
- [ ] Gozden gecirme APPROVED olarak onaylandi

### 1.3 Teklif Hazirlama
**Ekran:** Teklifler (`/offers/form`)
**API:** `POST /offer`

```
Teklif No: TKL-2026-0089
Musteri: TAI
Gecerlilik: 30 gun
Doviz: USD

Kalemler:
  Parca: Hidrolik Manifold Blogu (TAI-2026-0142)
  Adet: 60
  Birim Fiyat: $85.00
  Toplam: $5,100.00

Not: Ilk 3 adet FAI kapsaminda. Kadmiyum kaplama fason olarak yapilacaktir.
Teslimat: Siparis onayi + 45 gun
```

**Dogrulama:**
- [ ] Teklif olusturuldu ve kodu otomatik atandi
- [ ] Kalem bilgileri (urun, adet, fiyat) dogru
- [ ] Teklif durumu: HAZIRLANDI

### 1.4 Teklif → Siparis Donusumu
**Ekran:** Teklifler → Siparislere Aktar
**API:** `PUT /offer/change-status/{id}/APPROVED` → `POST /sales`

```
Siparis No: SIP-2026-0142
Kaynak Teklif: TKL-2026-0089
Musteri PO No: TAI-PO-2026-4821 (Musteri satin alma siparis numarasi)
Toplam: $5,100.00
Teslimat Tarihi: 2026-05-20
```

**Dogrulama:**
- [ ] Teklif durumu APPROVED oldu
- [ ] Satis siparisi olusturuldu
- [ ] Musteri PO numarasi islendi
- [ ] Teslimat tarihi 45 gun sonrasina ayarlandi

---

## BOLUM 2: URUN ve MALZEME HAZIRLIGI

### 2.1 Urun Tanimi (BOM ile)
**Ekran:** Urunler (`/products/form`)
**API:** `POST /product`

**Ana Urun:**
```
Urun Adi: Hidrolik Manifold Blogu
Urun Kodu: TAI-2026-0142
Revizyon: Rev B
Tip: Mamul (Finished Good)
Birim: Adet
Kalite Kontrol Gerekli: Evet
Seri Takip: Evet
Lot Takip: Evet
Teknik Cizim No: TAI-DWG-2026-0142
Malzeme: 7075-T6 Aluminyum
```

**BOM (Malzeme Listesi):**
| # | Alt Urun | Tip | Miktar | Birim | Aciklama |
|---|----------|-----|--------|-------|----------|
| 1 | 7075-T6 Al Blok 80x60x45mm | Hammadde | 1 | Adet | AMS 4078 sertifikali |
| 2 | Kadmiyum Kaplama (Fason) | Hizmet | 1 | Adet | AMS-QQ-P-416 Tip II Sinif 3 |

**Dogrulama:**
- [ ] Ana urun ve 2 BOM kalemi olusturuldu
- [ ] Seri takip ve lot takip aktif
- [ ] Kalite kontrol gereksinimleri isaretlendi

### 2.2 Kontrol Plani Tanimlama (AS9100 8.5.1.1)
**Ekran:** Kalite > Kontrol Planlari (`/quality/control-plans`)
**API:** `POST /controlplan` → `POST /controlplan/items`

```
Plan No: KP-TAI-0142
Urun: Hidrolik Manifold Blogu
Revizyon: A
Durum: DRAFT → ACTIVE
```

**Kontrol Plani Kalemleri:**
| Adim | Proses Adimi | Karakteristik | Spesifikasyon | Tolerans+ | Tolerans- | Metod | Alet | Ornekleme | Kritik |
|------|-------------|---------------|---------------|-----------|-----------|-------|------|-----------|--------|
| 1 | OP10 Torna | Dis Cap Ø25 | 25.000 | 0.010 | 0.000 | Olcum | Mikrometre MIK-001 | %100 | EVET |
| 2 | OP10 Torna | Toplam Boy 42 | 42.000 | 0.050 | 0.050 | Olcum | Kumpas KAL-001 | %100 | Hayir |
| 3 | OP10 Torna | Yuzey Puruzlulugu Ra | 1.600 | 0.000 | 0.800 | Olcum | Puruzluluk YUZ-001 | Ilk Parca | Hayir |
| 4 | OP20 Freze | Cep Derinligi 12.5 | 12.500 | 0.050 | 0.050 | Olcum | Kumpas KAL-001 | %100 | Hayir |
| 5 | OP20 Freze | Delik Capi Ø8 H7 | 8.000 | 0.015 | 0.000 | Olcum | Uc Olcer UC-001 | %100 | EVET |
| 6 | OP20 Freze | Delik Konumu X | 15.000 | 0.050 | 0.050 | CMM | CMM-001 | Ilk Parca | EVET |
| 7 | OP20 Freze | Delik Konumu Y | 20.000 | 0.050 | 0.050 | CMM | CMM-001 | Ilk Parca | EVET |
| 8 | OP30 Taslama | Dis Cap Ø25 h6 | 25.000 | 0.000 | 0.013 | Olcum | Mikrometre MIK-001 | %100 | EVET |
| 9 | OP30 Taslama | Silindiriklik | 0.005 | 0.000 | 0.005 | CMM | CMM-001 | %20 | EVET |
| 10 | OP70 Final | Tum boyutlar | — | — | — | Gorsel+Olcum | Tum | %100 | — |

**Muayene Noktasi Baglantisi:**
**API:** `POST /workordersteps/{id}/inspection-points`

- OP10 → Kalem 1, 2, 3
- OP20 → Kalem 4, 5, 6, 7
- OP30 → Kalem 8, 9
- OP70 → Kalem 10

**Dogrulama:**
- [ ] Kontrol plani ACTIVE olarak etkinlestirildi
- [ ] 10 muayene noktasi tanimlandi
- [ ] 5 kritik karakteristik (KC) isaretlendi
- [ ] Her operasyon adimina muayene noktalari baglandi

### 2.3 Is Emri Sablonu Olusturma
**Ekran:** Ayarlar > Is Emri Sablonlari (`/settings/work-order-templates`)
**API:** `POST /workordertemplates`

```
Sablon Adi: TAI-0142 Hidrolik Manifold Operasyon Sirasi
Adimlar (sirali):
  1. OP10 — CNC Torna (Makine: CNC-T01, Setup: 30dk, Run: 12dk/adet, Kalite: EVET)
  2. OP20 — CNC Freze (Makine: CNC-F01, Setup: 45dk, Run: 18dk/adet, Kalite: EVET)
  3. OP30 — Taslama (Makine: TAS-01, Setup: 20dk, Run: 8dk/adet, Kalite: EVET)
  4. OP40 — Capak Alma (Setup: 5dk, Run: 3dk/adet, Kalite: HAYIR)
  5. OP50 — CMM Olcum (Setup: 10dk, Run: 15dk/adet, Kalite: EVET)
  6. OP60 — Kaplama Fason (Kalite: EVET — donus muayenesi)
  7. OP70 — Final Muayene (Setup: 15dk, Run: 10dk/adet, Kalite: EVET)
```

**Dogrulama:**
- [ ] 7 adimli is emri sablonu olusturuldu
- [ ] Prerequisite (onkosul) baglantilari: OP20→OP10, OP30→OP20, OP40→OP30, OP50→OP40, OP60→OP50, OP70→OP60
- [ ] Kalite kontrol adimlarinda RequiresQualityCheck = true
- [ ] Tahmini toplam sure hesaplandi

### 2.4 Maliyet Tahmini (Uretim Oncesi)
**Ekran:** Uretim > Maliyet Analizi (`/production/part-cost`)
**API:** `GET /partcost/estimate?productId={id}&quantity=60`

```
Beklenen Cikti:
  Malzeme Maliyeti: 60 x 320 TL (7075 blok) = 19,200 TL
  Iscilik Maliyeti: (setup + run sureleri x iscilik ucreti)
  Makine Maliyeti: (setup + run sureleri x makine saat ucreti)
  Genel Gider: %43 x (Malzeme + Iscilik + Makine)
  Birim Maliyet: ~xxx TL/adet
  Toplam Maliyet: ~xxx TL
  Satis Fiyati: 60 x $85 x 38 TL = 193,800 TL
  Kar Marji: Hesaplanan %
```

**Dogrulama:**
- [ ] Tahmin sayfasi yuklendi, maliyet kirilimi gorunuyor
- [ ] Pasta grafik: Malzeme / Iscilik / Makine / Genel Gider dagalimi
- [ ] Birim maliyet ve toplam maliyet hesaplandi

---

## BOLUM 3: MALZEME TEDARIEGI

### 3.1 Satin Alma Talebi
**Ekran:** Satinalma > Talepler (`/purchase-requests`)
**API:** `POST /purchaserequest`

```
Malzeme: 7075-T6 Al Blok 80x60x45mm
Miktar: 65 adet (60 siparis + 5 fire payi)
Aciliyet: Yuksek
Talep Eden: Uretim Planlama
Gerekce: TAI SIP-2026-0142 icin
```

**Dogrulama:**
- [ ] Talep olusturuldu
- [ ] Urun ve miktar dogru

### 3.2 Tedarikci Secimi ve Siparis
**Ekran:** Satinalma > Siparisler (`/purchase-orders`)
**API:** `POST /purchaseorder`

```
Tedarikci: Alcoa Aluminyum San. (Onayli tedarikci — AS9100 sertifikali)
Malzeme: 7075-T6 Aluminyum Blok
Spesifikasyon: AMS 4078
Miktar: 65 adet
Birim Fiyat: 320 TL
Toplam: 20,800 TL
Teslimat: 7 gun
Notlar: 
  - Mill Test Report (MTR) zorunlu
  - Her lot icin ayri sertifika
  - Malzeme mensei belgesi gerekli
```

**Dogrulama:**
- [ ] Satin alma siparisi olusturuldu
- [ ] Tedarikci sertifika durumu kontrol edildi
- [ ] MTR ve mensei belgesi notu eklendi

### 3.3 Malzeme Giris (Stok Fisi)
**Ekran:** Stok > Giris/Cikis (`/stock/receipts`)
**API:** `POST /stockreceipts`

```
Urun: 7075-T6 Al Blok 80x60x45mm
Miktar: 65 adet
Tedarikci: Alcoa
Lot No: ALC-2026-0487
Depo: Ana Hammadde Deposu
Irsaliye No: ALC-IRS-2026-1234
```

**Dogrulama:**
- [ ] Stok girisi yapildi
- [ ] Lot numarasi atandi
- [ ] Stok miktari guncellendi

### 3.4 Giris Muayenesi (Incoming Inspection)
**Ekran:** Kalite > Giris Kontrol (`/quality/inspections`)
**API:** `POST /incominginspection`

```
Urun: 7075-T6 Al Blok
Tedarikci: Alcoa
Lot No: ALC-2026-0487
Gelen Miktar: 65
Muayene Tarihi: 2026-04-06

AQL Ornekleme:
  Lot Buyuklugu: 65
  AQL Seviyesi: 1.0
  Muayene Seviyesi: Normal (II)
  Orneklem: 8 adet

Sonuc:
  Kabul: 65
  Red: 0
  Sonuc: GECTI (PASS)
  Muayeneci: Ahmet Kaya (Kalite Muhendisi)
```

**Dogrulama:**
- [ ] Muayene kaydi olusturuldu
- [ ] AQL hesaplamasi dogru
- [ ] Sonuc PASS olarak islendi

### 3.5 Malzeme Sertifikasi Yukleme
**Ekran:** Kalite > Giris Kontrol > Sertifikalar (InspectionList drawer)
**API:** `POST /materialcertificate`

| Sertifika No | Tip | Malzeme Spec | Lot | Verilis Tarihi |
|-------------|-----|--------------|-----|---------------|
| ALC-MTR-2026-0487 | MTR (Mill Test Report) | 7075-T6 / AMS 4078 | ALC-2026-0487 | 2026-04-01 |
| ALC-COC-2026-0487 | CoC (Uygunluk Sertifikasi) | AMS 4078 uyumlu | ALC-2026-0487 | 2026-04-01 |

**Dogrulama:**
- [ ] 2 sertifika yuklendi ve muayeneye baglandi
- [ ] Lot numarasi ile eslesti
- [ ] Sertifika dosyalari (PDF) yuklendi

---

## BOLUM 4: URETIM PLANLAMA

### 4.1 Siparis → Uretim Emri Aktarimi
**Ekran:** Satislar > Uretime Aktar
**API:** `PUT /sales/approve/{id}` (auto-transfer)

```
Siparis: SIP-2026-0142
Uretim Emri: URE-2026-0142
Urun: Hidrolik Manifold Blogu
Miktar: 60 adet
Planlanan Baslangic: 2026-04-07
Planlanan Bitis: 2026-05-15
Oncelik: Yuksek
Is Emri Sablonu: TAI-0142 Hidrolik Manifold Operasyon Sirasi
```

**Dogrulama:**
- [ ] Uretim emri otomatik olusturuldu
- [ ] 7 is emri adimi (WorkOrder) sablondan kopyalandi
- [ ] Baslangic/bitis tarihleri atandi
- [ ] Durum: BEKLIYOR (WAITING)

### 4.2 Seri Numarasi Olusturma
**Ekran:** Uretim > Seri Numaralari (`/serial-numbers`)
**API:** `POST /serialnumber`

```
Urun: Hidrolik Manifold Blogu
Prefix: TAI-0142-
Baslangic: 001
Adet: 60
Revizyon: Rev B

Olusturulan: TAI-0142-001, TAI-0142-002, ..., TAI-0142-060
```

**Dogrulama:**
- [ ] 60 seri numarasi olusturuldu
- [ ] Hepsi CREATED durumunda
- [ ] Uretim emri ile iliskilendirildi

### 4.3 Kapasite Planlama
**Ekran:** Uretim > Kapasite Planlama (`/production/capacity-scheduling`)
**API:** `POST /capacityscheduling`

| Makine | Operasyon | Planlanan Baslangic | Planlanan Bitis | Durum |
|--------|----------|--------------------|--------------------|-------|
| CNC-T01 | OP10 Torna | 2026-04-07 08:00 | 2026-04-10 17:00 | PLANLI |
| CNC-F01 | OP20 Freze | 2026-04-11 08:00 | 2026-04-16 17:00 | PLANLI |
| TAS-01 | OP30 Taslama | 2026-04-17 08:00 | 2026-04-19 17:00 | PLANLI |

**Dogrulama:**
- [ ] 3 makine icin plan olusturuldu
- [ ] Cakisma yok (makineler musait)
- [ ] Gantt chart'ta gorunuyor

---

## BOLUM 5: ATOLYE — URETIM YURUTME

### 5.1 OP10: CNC Torna — Dis Cap Isleme

#### 5.1.1 Operatorun Isi Baslatmasi
**Ekran:** Atolye Terminali (`/shop-floor-terminal`)
**API:** `POST /shopfloor/start-work`

```
Operator: Mustafa Demir (CNC Tornaci)
Is Emri: WO-OP10 (CNC Torna — Dis Cap Isleme)
Makine: CNC-T01 (Mazak QT-250)
Baslama: 2026-04-07 08:15
```

**Dogrulama:**
- [ ] Is baslatildi, zamanlayici calisiyor
- [ ] Terminal ekraninda operasyon bilgisi gorunuyor
- [ ] Makine durumu "CALISIYOR" olarak guncellendi

#### 5.1.2 Operatorun Isi Tamamlamasi + Olcum Girisi
**API:** `PUT /shopfloor/complete-work/{logId}`
**API:** `GET /shopfloor/measurement-points/{workOrderId}`
**API:** `POST /shopfloor/submit-measurements/{workOrderId}`

Operator 60 parcayi tamamladi. RequiresQualityCheck=true oldugu icin olcum modali acilir:

**Olcum Girisi (Ornek — ilk parca):**
| Karakteristik | Spesifikasyon | Tolerans | Olculen Deger | Sonuc |
|--------------|---------------|----------|---------------|-------|
| Dis Cap Ø25 | 25.000 | +0.010/-0.000 | 25.006 | GECTI ✅ |
| Toplam Boy 42 | 42.000 | ±0.050 | 41.98 | GECTI ✅ |
| Yuzey Puruzlulugu Ra | 1.600 | +0.000/-0.800 | 1.2 | GECTI ✅ |

**Dogrulama:**
- [ ] Olcum modali acildi (3 olcum noktasi)
- [ ] Degerler girildi, gercek zamanli pass/fail gorunuyor
- [ ] Tum olcumler GECTI → Kalite otomatik onaylandi
- [ ] Is tamamlandi, 60 adet islendi
- [ ] Gecen sure kaydedildi

### 5.2 OP20: CNC Freze — Cep ve Kanal Isleme

#### 5.2.1 Onkosul Kontrolu
Operator OP20'yi baslatmak istiyor. Sistem OP10'un kalite kontrolunun gectigini dogruluyor.

**API:** `POST /shopfloor/start-work` (iceride prerequisite check)

**Dogrulama:**
- [ ] OP10 kalite onaylanmis → OP20 baslatilabilir
- [ ] (Eger OP10 kalitesi onaylanmamis olsaydi "Onceki operasyonun kalite kontrolu tamamlanmadi" hatasi verecekti)

#### 5.2.2 Uretim ve Olcum
```
Operator: Kemal Yildiz (CNC Frezeci)
Makine: CNC-F01 (Haas VF-2)
Baslama: 2026-04-11 08:00
Bitis: 2026-04-16 16:30
```

**Olcum Girisi:**
| Karakteristik | Spesifikasyon | Tolerans | Olculen | Sonuc |
|--------------|---------------|----------|---------|-------|
| Cep Derinligi 12.5 | 12.500 | ±0.050 | 12.52 | GECTI ✅ |
| Delik Capi Ø8 H7 | 8.000 | +0.015/-0.000 | 8.008 | GECTI ✅ |
| Delik Konumu X | 15.000 | ±0.050 | 15.02 | GECTI ✅ |
| Delik Konumu Y | 20.000 | ±0.050 | 19.97 | GECTI ✅ |

**Dogrulama:**
- [ ] 4 olcum noktasi girildi, hepsi GECTI
- [ ] Kalite otomatik onaylandi, OP30 baslatilabilir

### 5.3 OP30: Silindirik Taslama

```
Operator: Ibrahim Celik (Taslamaci)
Makine: TAS-01 (Okamoto OGM-250)
```

**Olcum Girisi:**
| Karakteristik | Spesifikasyon | Tolerans | Olculen | Sonuc |
|--------------|---------------|----------|---------|-------|
| Dis Cap Ø25 h6 | 25.000 | +0.000/-0.013 | 24.994 | GECTI ✅ |
| Silindiriklik | 0.005 | +0.000/-0.005 | 0.003 | GECTI ✅ |

**Dogrulama:**
- [ ] h6 toleransi icinde olcum yapildi
- [ ] Silindiriklik kontrolu gecti

### 5.4 OP40: Capak Alma

```
Operator: Yusuf Sahin (Cirak)
Kalite Kontrol: HAYIR (RequiresQualityCheck=false)
```

**Dogrulama:**
- [ ] Is tamamlandi, olcum istenmedi (kalite kontrol gereksiz)
- [ ] OP50'ye gecis serbest

### 5.5 OP50: CMM Olcum (Koordinat Olcum Makinesi)

```
Operator: Ahmet Kaya (Kalite Muhendisi)
Makine: CMM-001 (Hexagon GLOBAL S)
```

Tum kritik boyutlarin CMM ile olcumu — bu adimda AS9102 FAI raporu icin veri toplanir.

**Dogrulama:**
- [ ] CMM olcum verileri girildi
- [ ] Tum olcumler tolerans icinde
- [ ] FAI raporu icin veri hazir

---

## BOLUM 6: FASON IS (DISARI VERILEN PROSES)

### 6.1 Fason Siparis Olusturma (Kadmiyum Kaplama)
**Ekran:** Uretim > Fason Is Emirleri (`/subcontract-orders`)
**API:** `POST /subcontractorder`

```
Siparis No: FSN-2026-0042
Tedarikci: Yilmaz Kaplama San. (NADCAP Onayli)
Uretim: URE-2026-0142
Urun: Hidrolik Manifold Blogu
Proses Tipi: SURFACE_COATING (Yuzey Kaplama)
Proses Tanimi: Kadmiyum Kaplama — AMS-QQ-P-416 Tip II Sinif 3
Gonderilen Miktar: 60 adet
Beklenen Donus: 2026-04-28 (7 is gunu)
Kalite Gereksinimi: 
  - Kaplama kalinligi: 8-13 mikron
  - Yapisme testi sonucu
  - Hidrojen gevreklesme (baking) tamamlanmis olmali
Muayene Gerekli: EVET
Birim Fiyat: 45 TL/adet
Toplam: 2,700 TL
```

**Dogrulama:**
- [ ] Fason siparis olusturuldu
- [ ] Proses tipi SURFACE_COATING secildi
- [ ] Beklenen donus tarihi girildi
- [ ] RequiresInspection = true

### 6.2 Fason Gonderim
**API:** `PUT /subcontractorder/{id}/status` → SENT

```
Gonderim Tarihi: 2026-04-21
Irsaliye No: RSM-IRS-2026-0089
Durum: GONDERILDI → TEDARIKCIDE
```

**Dogrulama:**
- [ ] Durum SENT oldu
- [ ] Geri sayim badge gorunuyor: "Tahmini donus: 7 gun"

### 6.3 Fason Donus ve Muayene
**API:** `PUT /subcontractorder/{id}/status` → COMPLETED

```
Donus Tarihi: 2026-04-28
Gelen Miktar: 60 adet
Tedarikci Sertifika No: YK-COC-2026-0487
```

Donus muayenesi:
```
Kaplama Kalinligi Olcumu:
  Ornek 1: 10.2 mikron (8-13 arasi → GECTI)
  Ornek 2: 9.8 mikron (GECTI)
  Ornek 3: 11.1 mikron (GECTI)
Yapisme Testi: GECTI
Gorsel Kontrol: GECTI (pitting yok, homojen kaplama)
```

**API:** `PUT /subcontractorder/{id}/status` → INSPECTED

**Dogrulama:**
- [ ] Durum COMPLETED → INSPECTED oldu
- [ ] Tedarikci sertifikasi yuklendi (MaterialCertificate)
- [ ] Muayene kaydi olusturuldu
- [ ] 60 adet kabul edildi

---

## BOLUM 7: ILK PARCA MUAYENESI (FAI — AS9102)

### 7.1 FAI Kaydi Olusturma
**Ekran:** Kalite > FAI (`/quality/fai`)
**API:** `POST /fai`

```
FAI No: FAI-2026-0042
Tip: FULL (Tam FAI)
Neden: NEW_PART (Yeni Parca)
Parca No: TAI-2026-0142
Parca Adi: Hidrolik Manifold Blogu
Revizyon: Rev B
Cizim No: TAI-DWG-2026-0142
Siparis Referansi: SIP-2026-0142
Seri No: TAI-0142-001, TAI-0142-002, TAI-0142-003
Malzeme: 7075-T6 Aluminyum
Uretim Prosesi: CNC Torna + CNC Freze + Taslama + Kadmiyum Kaplama
Durum: DRAFT
```

### 7.2 FAI Karakteristik Olcumleri
**API:** `POST /fai/characteristics`

| # | Karakteristik | Cizim Ref | Spesifikasyon | Tol+ | Tol- | Olculen (1) | Olculen (2) | Olculen (3) | Sonuc | Alet | KC |
|---|--------------|-----------|---------------|------|------|-------------|-------------|-------------|-------|------|-----|
| 1 | Dis Cap Ø25 h6 | A-A kesit | 25.000 | 0.000 | 0.013 | 24.994 | 24.996 | 24.993 | PASS | MIK-001 | EVET |
| 2 | Toplam Boy 42 | Genel | 42.000 | 0.050 | 0.050 | 41.98 | 42.01 | 41.99 | PASS | KAL-001 | — |
| 3 | Cep Derinligi 12.5 | Detay B | 12.500 | 0.050 | 0.050 | 12.52 | 12.48 | 12.51 | PASS | KAL-001 | — |
| 4 | Delik Capi Ø8 H7 | Detay C | 8.000 | 0.015 | 0.000 | 8.008 | 8.006 | 8.010 | PASS | UC-001 | EVET |
| 5 | Delik Konum X | Detay C | 15.000 | 0.050 | 0.050 | 15.02 | 14.98 | 15.01 | PASS | CMM-001 | EVET |
| 6 | Delik Konum Y | Detay C | 20.000 | 0.050 | 0.050 | 19.97 | 20.02 | 19.99 | PASS | CMM-001 | EVET |
| 7 | Silindiriklik | A-A kesit | 0.005 | — | — | 0.003 | 0.004 | 0.003 | PASS | CMM-001 | EVET |
| 8 | Yuzey Ra | A-A kesit | 1.600 | — | 0.800 | 1.2 | 1.1 | 1.3 | PASS | YUZ-001 | — |
| 9 | Kaplama Kalinligi | Genel | 10.000 | 3.000 | 2.000 | 10.2 | 9.8 | 11.1 | PASS | Kaplama olcum | — |

### 7.3 FAI Onay ve PDF
**API:** `PUT /fai/{id}/status` → APPROVED
**API:** `GET /fai/{id}/report/pdf`

**Dogrulama:**
- [ ] FAI kaydi olusturuldu
- [ ] 9 karakteristik girildi, hepsi PASS
- [ ] 5 Key Characteristic (KC) isaretlendi
- [ ] 3 parca icin olcum yapildi
- [ ] Durum DRAFT → IN_PROGRESS → PENDING_APPROVAL → APPROVED
- [ ] AS9102 PDF raporu olusturuldu
- [ ] PDF musteri (TAI) ile paylasilabilir durumda

---

## BOLUM 8: FINAL MUAYENE ve SEVKIYAT

### 8.1 Final Muayene (OP70)
**Ekran:** Atolye Terminali veya Kalite modulu
**API:** `POST /finalinspectionrelease`

```
Uretim: URE-2026-0142
Muayeneci: Ahmet Kaya (Kalite Muhendisi)
Muayene Tarihi: 2026-05-02

Sonuc: ONAYLANDI (APPROVED)
Kontrol Edilen:
  - Tum boyutsal olcumler tolerans icinde
  - Kaplama gorunumu uygun
  - FOD kontrol — yabanci cisim yok
  - Seri numaralari okunabilir
  - Parcalar etiketlendi
  - CoC bilgileri hazir
Kosullu Kabul: HAYIR
```

**Dogrulama:**
- [ ] Final muayene kaydi APPROVED
- [ ] Uretim durumu READY (sevke hazir)
- [ ] Muayene onaylanmadan sevkiyat engelleniyor (gate)

### 8.2 Sevkiyat
**Ekran:** Sevkiyat
**API:** `POST /shippingdetails`

```
Musteri: TAI
Siparis: SIP-2026-0142
Miktar: 60 adet
Irsaliye No: RSM-IRS-2026-0092
Sevk Tarihi: 2026-05-03
Tasiyici: Kendi aracimiz
Paketleme: ESD korumalı kutu, FOD onleyici ambalaj
Ekler:
  - CoC (Uygunluk Sertifikasi)
  - FAI Raporu (AS9102 PDF)
  - Malzeme Sertifikasi (MTR)
  - Kaplama Sertifikasi
  - Irsaliye
```

**Dogrulama:**
- [ ] Sevkiyat kaydi olusturuldu
- [ ] Seri numaralari SHIPPED durumuna gecti
- [ ] Siparis durumu SHIPPING_DONE
- [ ] Uretim durumu TAMAMLANDI

### 8.3 Fatura Kesme
**Ekran:** Faturalar (`/invoices/form`)
**API:** `POST /invoice`

```
Fatura No: FTR-2026-0089
Musteri: TAI
Siparis Ref: SIP-2026-0142
Tarih: 2026-05-03
Vade: 60 gun (2026-07-02)
Doviz: USD

Kalemler:
  Hidrolik Manifold Blogu x 60 adet x $85.00 = $5,100.00
  KDV (%20): $1,020.00
  Toplam: $6,120.00
```

**Dogrulama:**
- [ ] Fatura olusturuldu
- [ ] Siparis ile eslesti
- [ ] Vade 60 gun olarak ayarlandi
- [ ] e-Fatura gonderime hazir

---

## BOLUM 9: KALITE OLAYLARI (SORUN SENARYOLARI)

### 9.1 Senaryo: Taslama Sirasinda Tolerans Disi Parca

OP30'da operator bir parcayi olcuyor: Ø24.980 (spec: 25.000 +0.000/-0.013 → kabul: 24.987-25.000)
Deger tolerans disi → Olcum modalinda KIRMIZI gosterilir.

#### 9.1.1 NCR Olusturma
**Ekran:** Kalite > Uygunsuzluk (`/quality/ncr`)
**API:** `POST /ncr`

```
NCR No: NCR-2026-0018
Siddet: MAJOR
Urun: Hidrolik Manifold Blogu
Uretim: URE-2026-0142
Seri No: TAI-0142-023
Tespit Tarihi: 2026-04-18
Tespit Eden: Ibrahim Celik (Taslamaci)
Etkilenen Miktar: 1 adet

Tanim: Silindirik taslama sonrasi dis cap olcusu 24.980mm.
       Tolerans: Ø25 h6 (24.987-25.000). Deger 0.007mm alt sinirin altinda.
       Muhtemel sebep: Taslik asinmasi, besleme fazla.
```

#### 9.1.2 MRB Karari (Material Review Board)
```
Karar: HURDA (SCRAP)
Gerekce: Boyutsal olarak kurtarilamaz, yeniden isleme imkani yok
Maliyet: ~350 TL (malzeme + iscilik)
```

#### 9.1.3 Kok Neden Analizi
```
Kok Neden: Taslik asinma limiti asilmis, taslik dressleme peryodu kacirilmis
Duzeltici Faaliyet: Taslik dressleme peryodu 50 parca → 30 parcaya dusuruldu
Onleyici Faaliyet: Bakim planina taslik dressleme hatirlatmasi eklendi
Durum: OPEN → UNDER_REVIEW → CORRECTIVE_ACTION → CLOSED
```

**Dogrulama:**
- [ ] NCR olusturuldu, MAJOR siddet
- [ ] Hurda maliyeti islendi
- [ ] Kok neden girilmeden NCR kapatilamadi (AS9100 enforcement)
- [ ] Seri numarasi TAI-0142-023 SCRAPPED durumuna gecti
- [ ] Yeni parca uretimi icin ek malzeme talebi olusturuldu

### 9.2 Senaryo: NCR'den CAPA Olusturma
**Ekran:** Kalite > CAPA (`/quality/capa`)
**API:** `POST /capa`

```
CAPA No: CAPA-2026-0011
Tip: CORRECTIVE (Duzeltici)
Kaynak: NCR (NCR-2026-0018)
Oncelik: HIGH
Tanim: Taslik asinma kontrolu yetersiz, dressleme peryodu kacirildi

Kok Neden Metodu: 5 Neden (5 Why)
  1. Neden parca tolerans disi? → Taslik asinmis
  2. Neden taslik asinmis? → Dressleme yapilmamis
  3. Neden dressleme yapilmamis? → Peryot takibi yok
  4. Neden takip yok? → Bakim planinda tanimli degil
  5. Neden tanimli degil? → Yeni makine, plan olusturulmamis

Aksiyon: Bakim planina TAS-01 taslik dressleme eklendi (her 30 parcada)
Dogrulama: Sonraki 100 parcada boyutsal SPC analizi
Son Tarih: 2026-04-25
```

**Dogrulama:**
- [ ] CAPA olusturuldu ve NCR'ye baglandi
- [ ] 5 Neden analizi yapildi
- [ ] Aksiyon plani tanimlandi
- [ ] Durum: OPEN → ROOT_CAUSE → ACTION_PLANNED → IN_PROGRESS → VERIFICATION → CLOSED
- [ ] Etkinlik dogrulamasi yapildi

### 9.3 Senaryo: SPC Analizi (Taslama Operasyonu)
**Ekran:** Kalite > SPC (`/quality/spc`)
**API:** `POST /advancedquality/spc-charts`

```
Kart Adi: OP30 Dis Cap Ø25 h6
Kart Tipi: X-bar R
Urun: Hidrolik Manifold Blogu
Olcum: Dis Cap (mm)
USL: 25.000
LSL: 24.987
Hedef: 24.993
Alt Grup: 5 adet

Veri Noktalari (60 parca, 12 alt grup):
  Alt Grup 1: 24.994, 24.996, 24.993, 24.995, 24.991
  Alt Grup 2: 24.992, 24.995, 24.994, 24.993, 24.996
  ... (devam)
```

**Dogrulama:**
- [ ] SPC karti olusturuldu
- [ ] UCL, LCL, CL cizgileri gorunuyor
- [ ] Kontrol disi nokta varsa isaretlendi
- [ ] Durum: IN_CONTROL veya WARNING

### 9.4 Senaryo: Proses Yeterliligi (Cp/Cpk)
**Ekran:** Kalite > Proses Yeterlilik (`/quality/process-capability`)
**API:** `POST /advancedquality/process-capability/calculate`

```
Beklenen Sonuc:
  Cp >= 1.33 (Proses potansiyeli yeterli)
  Cpk >= 1.33 (Proses gercek yeterliligi yeterli)
  Pp, Ppk: Uzun vadeli performans indeksleri
  PPM: < 66 (milyon basina hata)
```

**Dogrulama:**
- [ ] Cp/Cpk hesaplandi
- [ ] Histogram + normal dagilim grafigi gorunuyor
- [ ] Renk kodlu sonuc: >= 1.33 → Yesil (Iyi)

---

## BOLUM 10: BAKIM ve KALIBRASYON

### 10.1 Makine Bakimi
**Ekran:** Bakim (`/maintenance`)
**API:** `POST /maintenance`

```
Bakim Tipi: PREVENTIVE (Onleyici)
Makine: CNC-T01 (Mazak QT-250)
Tanim: 6 aylik genel bakim — yag degisimi, filtreleme, geometri kontrolu
Planlanan Tarih: 2026-04-15
Sorumlu: Ramazan Usta (Bakim Teknisyeni)
Tahmini Sure: 4 saat
Durum: PLANLI → DEVAM EDIYOR → TAMAMLANDI
```

**Dogrulama:**
- [ ] Bakim plani olusturuldu
- [ ] Tamamlandiktan sonra OEE verileri guncellendi

### 10.2 Kalibrasyon Hatirlatma
**Ekran:** Kalite > Kalibrasyon (`/quality/calibration`)
**API:** `GET /calibration/due-soon?days=30`

```
Yaklasan Kalibrasyonlar:
  KAL-001 (Kumpas) — Son tarih: 2026-08-01 (117 gun)
  CMM-001 — Son tarih: 2026-09-01 (148 gun)
```

**Dogrulama:**
- [ ] Dashboard'da yaklasan kalibrasyonlar gorunuyor
- [ ] Suresi gecmis ekipman varsa KIRMIZI uyari
- [ ] Uyumluluk yuzdesi hesaplandi

---

## BOLUM 11: RAPORLAMA ve YONETIM

### 11.1 Maliyet Analizi (Gerceklesen)
**Ekran:** Uretim > Maliyet Analizi (`/production/part-cost/{productionId}`)
**API:** `GET /partcost/{productionId}`

```
Beklenen Rapor:
  Malzeme: 61 x 320 TL = 19,520 TL (60 siparis + 1 hurda)
  Iscilik: (tum operasyonlarin toplam suresi x iscilik ucreti)
  Makine: (tum operasyonlarin toplam suresi x makine ucreti)
  Fason: 60 x 45 TL = 2,700 TL
  Genel Gider: %43 x (Malzeme + Iscilik + Makine)
  TOPLAM MALiYET: xxx TL
  Birim Maliyet: xxx TL/adet
  Satis: 60 x $85 x 38 = 193,800 TL
  KAR MARJI: %xx
```

**Dogrulama:**
- [ ] Gerceklesen maliyet hesaplandi (tahmin ile karsilastir)
- [ ] Hurda maliyeti dahil edildi
- [ ] Pasta grafik dagilimi dogru

### 11.2 Executive Dashboard
**Ekran:** Yonetim Kokpiti (`/executive-dashboard`)

```
Kontrol Edilecekler:
  - Toplam Gelir: $5,100 (bu ay)
  - Acik Siparisler: 1 (TAI)
  - OEE: CNC-T01 %xx, CNC-F01 %xx, TAS-01 %xx
  - Ilk Seferde Gecme Orani: 59/60 = %98.3
  - Acik NCR: 0 (kapatildi)
  - Acik CAPA: 0 (kapatildi)
  - Zamaninda Teslimat: %100 (teslim edildi)
```

**Dogrulama:**
- [ ] Tum KPI'lar gorunuyor
- [ ] Veriler dogru (siparis, uretim, kalite tutarli)
- [ ] Yazdirilabilir (management review icin)

### 11.3 Tedarikci Degerlendirme
**Ekran:** Kalite > Tedarikci Degerlendirme (`/quality/supplier-evaluation`)

```
Alcoa Aluminyum:
  Kalite Puani: 95/100 (malzeme sertifikali, sorunsuz)
  Teslimat Puani: 90/100 (zamaninda)
  Fiyat Puani: 80/100 (piyasa ortalamasi)
  Genel: 88/100 — ONAYLI

Yilmaz Kaplama:
  Kalite Puani: 100/100 (kaplama sorunsuz)
  Teslimat Puani: 100/100 (zamaninda)
  Fiyat Puani: 85/100
  Genel: 95/100 — ONAYLI
```

**Dogrulama:**
- [ ] Her iki tedarikci icin donem degerlendirmesi yapildi
- [ ] Puanlar renk kodlu gorunuyor

---

## BOLUM 12: DOGRULAMA KONTROL LISTESI (GENEL)

### Uctan Uca Akis Dogrulamasi

| # | Adim | Ekran | API | Durum |
|---|------|-------|-----|-------|
| 1 | Musteri tanimlandi | /customers | POST /customer | [ ] |
| 2 | Teklif hazirlandi | /offers/form | POST /offer | [ ] |
| 3 | Teklif onaylandi, siparis olusturuldu | /sales | POST /sales | [ ] |
| 4 | Sozlesme gozden gecirildi | — | POST /contractreview | [ ] |
| 5 | Urun ve BOM tanimlandi | /products/form | POST /product | [ ] |
| 6 | Kontrol plani olusturuldu | /quality/control-plans | POST /controlplan | [ ] |
| 7 | Is emri sablonu hazirlandi | /settings/work-order-templates | POST /workordertemplates | [ ] |
| 8 | Maliyet tahmini yapildi | /production/part-cost | GET /partcost/estimate | [ ] |
| 9 | Satin alma siparisi verildi | /purchase-orders | POST /purchaseorder | [ ] |
| 10 | Malzeme geldi, stok girisi yapildi | /stock/receipts | POST /stockreceipts | [ ] |
| 11 | Giris muayenesi yapildi | /quality/inspections | POST /incominginspection | [ ] |
| 12 | Malzeme sertifikasi yuklendi | InspectionList drawer | POST /materialcertificate | [ ] |
| 13 | Uretim emri olusturuldu | /production | PUT /sales/approve | [ ] |
| 14 | Seri numaralari atandi | /serial-numbers | POST /serialnumber | [ ] |
| 15 | Kapasite planlandi | /production/capacity-scheduling | POST /capacityscheduling | [ ] |
| 16 | OP10 Torna baslatildi | /shop-floor-terminal | POST /shopfloor/start-work | [ ] |
| 17 | OP10 tamamlandi + olcum girildi | /shop-floor-terminal | POST /shopfloor/submit-measurements | [ ] |
| 18 | OP20 Freze baslatildi (onkosul gecti) | /shop-floor-terminal | POST /shopfloor/start-work | [ ] |
| 19 | OP20 tamamlandi + olcum girildi | /shop-floor-terminal | POST /shopfloor/submit-measurements | [ ] |
| 20 | OP30 Taslama + olcum | /shop-floor-terminal | POST /shopfloor/submit-measurements | [ ] |
| 21 | OP40 Capak alma (olcum yok) | /shop-floor-terminal | PUT /shopfloor/complete-work | [ ] |
| 22 | OP50 CMM olcum | /shop-floor-terminal | POST /shopfloor/submit-measurements | [ ] |
| 23 | Fason siparis olusturuldu (kaplama) | /subcontract-orders | POST /subcontractorder | [ ] |
| 24 | Fason gonderildi | /subcontract-orders | PUT status → SENT | [ ] |
| 25 | Fason dondu, muayene edildi | /subcontract-orders | PUT status → INSPECTED | [ ] |
| 26 | Fason sertifikasi yuklendi | InspectionList drawer | POST /materialcertificate | [ ] |
| 27 | FAI olusturuldu (ilk 3 parca) | /quality/fai | POST /fai | [ ] |
| 28 | FAI karakteristikleri girildi | /quality/fai | POST /fai/characteristics | [ ] |
| 29 | FAI onaylandi + PDF olusturuldu | /quality/fai | PUT status + GET report/pdf | [ ] |
| 30 | Final muayene onaylandi | — | POST /finalinspectionrelease | [ ] |
| 31 | Sevkiyat yapildi | /shipments | POST /shippingdetails | [ ] |
| 32 | Fatura kesildi | /invoices/form | POST /invoice | [ ] |
| 33 | NCR olusturuldu (hurda parca) | /quality/ncr | POST /ncr | [ ] |
| 34 | CAPA olusturuldu (NCR'den) | /quality/capa | POST /capa | [ ] |
| 35 | SPC karti olusturuldu | /quality/spc | POST spc-charts | [ ] |
| 36 | Cp/Cpk hesaplandi | /quality/process-capability | POST calculate | [ ] |
| 37 | Maliyet analizi yapildi (gerceklesen) | /production/part-cost | GET /partcost/{id} | [ ] |
| 38 | Tedarikci degerlendirme yapildi | /quality/supplier-evaluation | POST evaluation | [ ] |
| 39 | Executive dashboard kontrol edildi | /executive-dashboard | — | [ ] |

### AS9100 Uyumluluk Kontrol Listesi

| Madde | Gereksinim | Karsilayan Modul | Test Edildimi |
|-------|-----------|-----------------|---------------|
| 8.2.3 | Sozlesme Gozden Gecirme | ContractReview | [ ] |
| 8.3 | Tasarim Kontrolu | FAI + DocumentControl | [ ] |
| 8.4.1 | Tedarikci Kontrolu | SupplierEvaluation + MaterialCertificate | [ ] |
| 8.5.1 | Uretim Kontrolu | WorkOrder + ShopFloor + ControlPlan | [ ] |
| 8.5.1.1 | Ozel Proses Kontrolu | SubcontractOrder (NADCAP tedarikci) | [ ] |
| 8.5.2 | Tanimlama ve Izlenebilirlik | SerialNumber + StockLot + MaterialCert | [ ] |
| 8.5.3 | Musteri Mulkiyeti | CustomerProperty | [ ] |
| 8.5.4 | Koruma (FOD) | FOD modulu | [ ] |
| 8.6 | Urun Serbest Birakma | FinalInspectionRelease | [ ] |
| 8.7 | Uygun Olmayan Cikti | NCR + MRB | [ ] |
| 9.1.1 | Izleme ve Olcme | SPC + ProcessCapability + GageRR | [ ] |
| 10.2 | Duzeltici Faaliyet | CAPA | [ ] |

---

## BOLUM 13: ROL BAZLI KULLANIM SENARYOLARI

### 13.1 Operator (Mustafa — CNC Tornaci)
**Profil:** Operator (5 menu)
**Gorecegi:** Anasayfa, Atolye Terminali, Makineler, Uretim Emirleri, Bildirimler

Gunluk is akisi:
1. Terminale giris yap
2. "Benim Islerim" listesinden siradaki isi sec
3. "Baslat" tusuna bas
4. Parcayi isle
5. "Tamamla" tusuna bas → Olcum modali acilir
6. Olculeri gir (buyuk rakam gosterge, pass/fail aninda)
7. "Kaydet & Tamamla" → Sonraki ise gec

**Dogrulama:**
- [ ] Operator sadece 5 menu goruyor
- [ ] Terminal tablet uyumlu, buyuk butonlar
- [ ] Olcum modali kolay kullaniliyor

### 13.2 Kalite Muhendisi (Ahmet — Kaliteci)
**Profil:** Kaliteci (12 menu)
**Gorecegi:** Kalite Dashboard, NCR, Muayeneler, CAPA, Kalibrasyon, FAI, SPC, Kontrol Planlari, vb.

Gunluk is akisi:
1. Kalite Dashboard'u kontrol et — acik NCR, yaklasan kalibrasyon
2. Giris muayenesi yap (gelen malzeme)
3. Malzeme sertifikalarini yukle
4. FAI raporu hazirla (yeni parca)
5. NCR ac (sorunlu parca)
6. CAPA takibi yap
7. SPC kartlarini incele
8. Final muayene onayla

**Dogrulama:**
- [ ] Kaliteci sadece kalite menulerini goruyor
- [ ] Tum kalite modulleri erisilebilir

### 13.3 Firma Sahibi (Hakan Bey — Patron)
**Profil:** Yonetici (18 menu)
**Gorecegi:** Yonetim Kokpiti, Musteriler, Teklifler, Satislar, Uretim, Kalite ozet, Finans, Raporlar, Ayarlar

Gunluk is akisi:
1. Executive Dashboard — bugunun ozeti
2. Acik siparisler ve teslimat durumlari
3. Maliyet analizi — kar marji kontrolu
4. Vade analizi — tahsilat takibi
5. Kalite metrikleri — NCR/CAPA ozet
6. Makine doluluk oranlari
7. Tedarikci performansi

**Dogrulama:**
- [ ] Yonetici dashboard'u bilgilendirici
- [ ] Maliyet ve kar marji gorunuyor
- [ ] Kritik uyarilar (geciken siparis, suresi gecen kalibrasyon) belirgin

---

> **Son Guncelleme:** 2026-04-05
> **Hazirlayan:** Claude Opus 4.6 + Hakan Bey (RynSoft)
> **Kapsam:** Quvex ERP v1.0 — Savunma Sanayi Talasli Imalat
> **Toplam Test Adimi:** 39 uctan uca + 12 AS9100 uyumluluk = 51 kontrol noktasi
