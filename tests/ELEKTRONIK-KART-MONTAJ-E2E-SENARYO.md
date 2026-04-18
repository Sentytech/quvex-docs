# Savunma Sanayi Elektronik Kart Montaji — Uctan Uca Test Senaryosu

> **Firma Profili:** Delta Elektronik Savunma San. Ltd.Sti. — 35 personel, 1 SMD hatti, 1 dalga lehim, 2 el lehim istasyonu, 1 conformal coating kabini, ESD korumalı uretim alani
> **Sertifikalar:** AS9100 Rev D, ISO 9001:2015, IPC-A-610 Class 3 (Yuksek Guvenilirlik), IPC J-STD-001, MIL-STD-883
> **Musteriler:** HAVELSAN, ASELSAN, SDT (Savunma ve Dijital Teknoloji) tedarikcisi
> **Urunler:** Aviyonik kontrol kartlari, radar sinyal isleme modulleri, haberlesme PCB asambleleri
> **Senaryo:** HAVELSAN'dan gelen aviyonik kontrol karti siparisi — bilesen tedariği, counterfeit kontrolu, SMD/THT montaj, reflow/dalga lehim, AOI/ICT/fonksiyonel test, conformal coating, FAI ve sevkiyata kadar tum surecleri kapsar

---

## BILINEN KISITLAMALAR (Quvex'te Henuz Mevcut Degil)

> Bu kisitlamalar test sirasinda ilgili adimlarda **not alanlarina** yazilacaktir.
> Test raporunda bu maddeler "WORKAROUND" olarak isaretlenecektir.

| # | Eksik Modul/Ozellik | Workaround |
|---|---------------------|------------|
| K1 | Reflow sicaklik profili (preheat/soak/reflow/cool egrisi) otomatik kayit yok | Operasyon not alanina profil parametreleri ve thermocouple olcum degerleri yazilir |
| K2 | AOI (Otomatik Optik Muayene) goruntu entegrasyonu yok | AOI cikti raporu PDF/gorsel olarak dosya eki (attachment) yuklenir |
| K3 | MSD (Moisture Sensitive Device) floor life otomatik sayac yok | Bilesen lot notuna acilma tarihi/saati ve kalan floor life yazilir |
| K4 | Bilesen counterfeit veritabani (GIDEP/ERAI) entegrasyonu yok | Giris kalite muayene notlarina counterfeit kontrol sonucu yazilir |
| K5 | ICT/Fonksiyonel test cihazi veri entegrasyonu yok | Muayene kayitlarina test sonuclari manuel girilir, test raporu ek olarak yuklenir |
| K6 | Stencil baski SPI (Solder Paste Inspection) entegrasyonu yok | Baski sonrasi gorsel kontrol notu yazilir |
| K7 | Pick & place feeder pozisyon/program yonetimi yok | Operasyon notlarina makine programi referans numarasi yazilir |
| K8 | BGA X-ray muayene goruntu kaydı yok | X-ray sonuc raporu dosya eki olarak yuklenir |
| K9 | Conformal coating kalinlik olcum otomasyonu yok | Muayene kaydina manuel kalinlik degerleri (mikron) girilir |
| K10 | BOM 127 bilesen — buyuk liste performansi izlenecek | Yuklenme suresi ve sayfalama davranisi not edilir |

---

## BOLUM 0: SISTEM KURULUMU (Tek Seferlik)

### 0.1 Makine / Ekipman Tanimlari
**Ekran:** Ayarlar > Makineler (`/settings/machines`)
**API:** `POST /machines`

| Makine Kodu | Makine Adi | Marka/Model | Yil | Saat Ucreti | Setup Ucreti |
|-------------|------------|-------------|-----|-------------|--------------|
| SMD-01 | SMD Yerlestirme Makinesi (Pick & Place) | Yamaha YSM20R | 2022 | 1200 TL/saat | 400 TL/saat |
| RFW-01 | Reflow Firin (10 Bolgeli) | Heller 1913 MK5 | 2021 | 800 TL/saat | 300 TL/saat |
| DLH-01 | Dalga Lehim Makinesi | SEHO PowerSelective | 2020 | 700 TL/saat | 250 TL/saat |
| AOI-01 | Otomatik Optik Muayene | Koh Young Zenith | 2023 | 500 TL/saat | 200 TL/saat |
| ICT-01 | In-Circuit Test Fixturu | Keysight i3070 | 2022 | 600 TL/saat | 300 TL/saat |
| FNK-01 | Fonksiyonel Test Fixturu | Ozel Tasarim — HAVELSAN Spec | 2024 | 500 TL/saat | 350 TL/saat |
| STN-01 | Stencil Baski Makinesi | DEK Horizon 03iX | 2021 | 400 TL/saat | 150 TL/saat |
| CCT-01 | Conformal Coating Kabini | Nordson Asymtek Select Coat | 2023 | 450 TL/saat | 200 TL/saat |
| ELH-01 | El Lehim Istasyonu 1 (THT) | Weller WXA 2 | 2022 | 200 TL/saat | 50 TL/saat |
| ELH-02 | El Lehim Istasyonu 2 (Rework) | JBC RMSE-2A | 2023 | 250 TL/saat | 50 TL/saat |
| XRY-01 | X-Ray Muayene Cihazi | Nikon XT V 160 | 2022 | 900 TL/saat | 200 TL/saat |
| TMZ-01 | Ultrasonik Temizleme Banyosu | Branson 8510 | 2020 | 150 TL/saat | — |

**Dogrulama:**
- [ ] 12 makine/ekipman basariyla tanimlandi
- [ ] Saat ucretleri ve setup ucretleri girildi
- [ ] SMD hatti ekipmanlari (STN-01, SMD-01, RFW-01, AOI-01) sirasıyla listeleniyor
- [ ] Test ekipmanlari (ICT-01, FNK-01) tanimlandi

### 0.2 Is Emri Adimlari (Operasyon Tanimlari — PCB Montaj Sureci)
**Ekran:** Ayarlar > Is Emri Adimlari (`/settings/work-order-steps`)
**API:** `POST /workordersteps`

| Kod | Operasyon Adi | Vars. Makine | Setup (dk) | Beceri |
|-----|--------------|-------------|------------|--------|
| OP10 | Stencil Baski (Lehim Pastasi) | STN-01 | 30 | 3 (Usta) |
| OP20 | SMD Yerlestirme (Pick & Place) | SMD-01 | 45 | 3 (Usta) |
| OP30 | Reflow Lehim | RFW-01 | 15 | 3 (Usta) |
| OP40 | AOI — Otomatik Optik Muayene | AOI-01 | 10 | 3 (Usta) |
| OP50 | THT Bilesen Montaji (Manuel) | ELH-01 | 10 | 3 (Usta — IPC Sertifikali) |
| OP60 | Dalga Lehim | DLH-01 | 20 | 3 (Usta) |
| OP70 | Temizleme (Flux Kalintisi) | TMZ-01 | 10 | 2 (Kalfa) |
| OP80 | Gorsel Muayene (IPC-A-610 Class 3) | — | 15 | 4 (Uzman — IPC-A-610 CIS) |
| OP90 | ICT — In-Circuit Test | ICT-01 | 20 | 3 (Usta) |
| OP100 | Fonksiyonel Test (Fixture) | FNK-01 | 25 | 4 (Uzman) |
| OP110 | Conformal Coating Uygulama | CCT-01 | 20 | 3 (Usta) |
| OP120 | Conformal Coating Kurleme | — | 5 | 2 (Kalfa) |
| OP130 | Son Test + Etiketleme | — | 20 | 4 (Uzman) |

**Dogrulama:**
- [ ] 13 operasyon adimi tanimlandi
- [ ] Operasyon sirasi PCB montaj akisini dogru yansitiyor (baski→yerlestirme→reflow→AOI→THT→dalga→temizlik→muayene→test→coating→son test)
- [ ] Beceri seviyeleri IPC sertifika gereksinimlerine gore atandi

### 0.3 Genel Gider Yapilandirmasi
**Ekran:** Uretim > Maliyet Analizi (`/production/part-cost`)
**API:** `POST /partcost/overheads`

| Ad | Yuzde | Gecerlilik |
|----|-------|------------|
| Genel Imalat Giderleri | %18 | 2026-01-01 → — |
| ESD Koruma Altyapisi | %5 | 2026-01-01 → — |
| Amortisman (SMD Hatti) | %12 | 2026-01-01 → — |
| Enerji (Reflow + Dalga Lehim) | %7 | 2026-01-01 → — |
| Temiz Oda / Iklimlendirme | %4 | 2026-01-01 → — |

**Dogrulama:**
- [ ] 5 genel gider kalemi tanimlandi (%46 toplam overhead)
- [ ] ESD koruma altyapisi ayri kalem olarak takip ediliyor
- [ ] Reflow/dalga lehim enerji tuketimi dahil

### 0.4 Kalibrasyon Ekipmanlari
**Ekran:** Kalite > Kalibrasyon (`/quality/calibration`)
**API:** `POST /calibration/equipment`

| Kod | Ekipman | Marka/Model | Dogruluk | Frekans | Sonraki |
|-----|---------|-------------|----------|---------|---------|
| MLT-001 | Dijital Multimetre | Keysight 34465A | 6.5 digit | Yillik | 2027-01-10 |
| OSK-001 | Osiloskop 4 Kanalli | Tektronix MSO54 | 1 GHz BW | Yillik | 2027-01-10 |
| GUC-001 | Prog. Guc Kaynagi | Keysight E36312A | ±%0.02 | Yillik | 2027-02-01 |
| LCR-001 | LCR Metre | Keysight E4980A | ±%0.05 | Yillik | 2027-01-10 |
| THR-001 | Termocouple Kalibrator | Fluke 714B | ±0.5°C | 6 Aylik | 2026-09-01 |
| KLN-001 | Coating Kalinlik Olcer | Elcometer 456 | ±%1 | 6 Aylik | 2026-09-01 |
| ESD-001 | ESD Wrist Strap Tester | Desco 19250 | ±%5 | 3 Aylik | 2026-06-01 |
| ESD-002 | ESD Yuzey Direnc Olcer | Desco 19780 | 10^3-10^12 ohm | 6 Aylik | 2026-08-01 |
| VIS-001 | Viskozimetre | Brookfield DV2T | ±%1 | 6 Aylik | 2026-09-01 |
| MIK-001 | Stereo Mikroskop | Olympus SZX16 | 7x-115x | Yillik | 2027-01-10 |
| NEM-001 | Nem/Sicaklik Datalogger | Vaisala HMT330 | ±%1 RH | 6 Aylik | 2026-09-01 |

**Dogrulama:**
- [ ] 11 kalibrasyon ekipmani tanimlandi (test + ESD + proses kontrol)
- [ ] Kalibrasyon tarihleri ve frekanslari girildi, dashboard uyumluluk % gorunuyor

### 0.5 IPC Sertifika Takibi (WORKAROUND — Kalibrasyon Modulu)
**Ekran:** Kalite > Kalibrasyon (`/quality/calibration`)
**API:** `POST /calibration/equipment`

> **NOT:** Quvex'te personel sertifika modulu bulunmadigi icin, kalibrasyon modulunde
> "ekipman" olarak IPC sertifikalari takip edilir. Kalibrasyon frekansı = sertifika yenileme suresi.

| Kod | "Ekipman" (Personel) | Sertifika | Kapsam | Frekans | Son Yenileme | Sonraki |
|-----|----------------------|-----------|--------|---------|--------------|---------|
| IPC-001 | Mehmet Yilmaz — SMD Operatoru | IPC J-STD-001 CIS | Lehim (SMD + THT + Rework) | 2 Yillik | 2025-09-01 | 2027-09-01 |
| IPC-002 | Ayse Kara — Kalite Muayene | IPC-A-610 CIS | Elektronik Montaj Kabul Kriteri Class 3 | 2 Yillik | 2025-06-15 | 2027-06-15 |
| IPC-003 | Hasan Demir — THT Operatoru | IPC J-STD-001 CIS | Lehim (THT + Wave) | 2 Yillik | 2025-11-01 | 2027-11-01 |
| IPC-004 | Fatma Ozturk — Coating Operatoru | IPC-CC-830B | Conformal Coating Uygulama | 2 Yillik | 2026-01-15 | 2028-01-15 |
| IPC-005 | Ali Celik — Rework Teknisyeni | IPC 7711/7721 CIS | Rework/Repair (BGA, QFP, THT) | 2 Yillik | 2025-08-01 | 2027-08-01 |

**Dogrulama:**
- [ ] 5 IPC sertifikali personel tanimlandi
- [ ] Sertifika turleri (J-STD-001, A-610, CC-830B, 7711/7721) dogru girildi
- [ ] Yenileme tarihleri gelecek tarihlere ayarlandi (suresi dolmamis)

---

## BOLUM 1: MUSTERI ve URUN TANIMLARI

### Adim 1 — Musteri Kaydi: HAVELSAN
**Ekran:** Musteriler (`/customers`)
**API:** `POST /customer`
**Rol:** Satis Muduru

| Alan | Deger |
|------|-------|
| Firma Adi | HAVELSAN Hava Elektronik San. ve Tic. A.S. |
| Vergi No | 1234567890 |
| Vergi Dairesi | Ankara Kurumlar |
| Adres | ODTU Teknokent, 06800 Ankara |
| Telefon | +90 312 123 45 67 |
| Tip | Musteri |
| Notlar | IPC-A-610 Class 3 zorunlu — Yuksek Guvenilirlik. Tum urunlerde ESD koruma + MIL-STD-883 uyumlu test gerekli. HAVELSAN tedarikci denetimi 2026-Q2 planlandi. |

**Ilgili Kisi:**
| Ad | Gorevi | Telefon | E-posta |
|----|--------|---------|---------|
| Murat Aksoy | Tedarik Zinciri Muduru | +90 312 123 45 70 | murat.aksoy@havelsan.com.tr |
| Zeynep Sahin | Kalite Guvence Muhendisi | +90 312 123 45 72 | zeynep.sahin@havelsan.com.tr |

**Dogrulama:**
- [ ] Musteri karti olusturuldu, `/Customer?type=customers` listesinde gorunuyor
- [ ] IPC Class 3 notu acikca yazildi
- [ ] Ilgili kisiler eklendi

### Adim 2 — Urun Tanimi: Aviyonik Kontrol Karti
**Ekran:** Urunler (`/products`)
**API:** `POST /product`
**Rol:** Muhendislik

| Alan | Deger |
|------|-------|
| Urun Kodu | AVK-PCB-001-B |
| Urun Adi | Aviyonik Kontrol Karti — Rev B |
| Birim | Adet |
| Kategori | PCB Montaj |
| Notlar | 4 katmanli FR4 PCB, 1.6mm kalinlik, 127 bilesen (95 SMD + 32 THT). IPC Class 3. HAVELSAN P/N: HVL-ACK-2026-001. Conformal coating zorunlu (HumiSeal 1B73). Boyut: 160x100mm. Baski devre tasarimi Rev B — ECN-2026-042 ile guncellendi. |

**Dogrulama:**
- [ ] Urun karti olusturuldu
- [ ] Urun kodu `AVK-PCB-001-B` formatinda (Rev B dahil)
- [ ] IPC Class 3 + conformal coating notu mevcut
- [ ] Autocomplete'de aranabilir (`/Autocomplete/product`)

### Adim 3 — BOM (Urun Agaci) Tanimi: 127 Bilesen
**Ekran:** Urunler > Recete / BOM (`/products/{id}/bom`)
**API:** `POST /product/{id}/bom`
**Rol:** Muhendislik

> **PERFORMANS NOTU (K10):** 127 bilesen satiri — BOM listesi yuklenme suresini ve sayfalama
> davranisini not edin. 3 saniyenin uzerinde yukleme varsa performans sorunu olarak raporlayin.

**PCB Bare Board:**

| # | Malzeme Kodu | Malzeme Adi | Miktar | Birim | Tedarikci | Aciklama |
|---|-------------|-------------|--------|-------|-----------|----------|
| 1 | PCB-4L-FR4-001 | 4 Katmanli PCB Bare Board | 1 | Adet | Epec Engineered Technologies | FR4, 1.6mm, ENIG finish, IPC Class 3, 160x100mm |

**SMD Bilesenler (95 farkli parca — temsili ornekler):**

| # | Malzeme Kodu | Malzeme Adi | Miktar | Package | Aciklama |
|---|-------------|-------------|--------|---------|----------|
| 2 | IC-FPGA-001 | Xilinx Artix-7 XC7A35T | 1 | BGA-236 | Ana FPGA — MSD Level 3 |
| 3 | IC-ADC-001 | AD7606 16-bit ADC | 2 | LQFP-64 | 8 kanal ADC — MSD Level 2 |
| 4 | IC-DAC-001 | AD5764 16-bit DAC | 1 | TQFP-32 | 4 kanal DAC |
| 5-8 | IC-REG/BUF/MEM | LDO, DCDC, Buffer, SRAM | 10 | SOT/QFN/TSSOP/TSOP | Guc + lojik IC'ler |
| 9-11 | RES-0402-xxx | Direncler 100R-10K 1% | 85 | 0402 | Ince film, ±50ppm/°C |
| 12-14 | CAP-xxx | Kapasitorler 100nF-100uF | 73 | 0402/0805/1206 | MLCC + Tantal |
| 15 | KON-SMD-001 | Hirose DF12 80-pin | 2 | SMD | Kart-kart konnektor — MSD Level 1 |
| 16-17 | LED-0603 | LED Yesil/Kirmizi | 6 | 0603 | Durum gostergesi |

> Toplam: 95 farkli SMD bilesen, ~260 adet/kart

**THT Bilesenler (32 farkli parca — temsili ornekler):**

| # | Malzeme Kodu | Malzeme Adi | Miktar | Aciklama |
|---|-------------|-------------|--------|----------|
| 96 | TRF-001 | Guc Trafosu 12V/5A | 1 | Toroidal, EMI kalkanli |
| 97 | RLE-001 | Role 24VDC DPDT | 4 | Omron G2R-2 — MIL-PRF-39016 |
| 98-99 | CAP-ELK | Elektrolitik 470uF-1000uF | 5 | 105°C, uzun omur |
| 100 | KON-THT-001 | MIL-DTL-38999 Konnektor | 1 | Circular, 19 pin, EMI filtreli |
| 101-103 | KON/FUZ/KRS | DB-25, Sigorta, Kristal | 4 | RS-232, 3A slow-blow, 25MHz |

> Toplam: 32 farkli THT bilesen

**Sarf Malzemeler:**

| # | Malzeme Kodu | Malzeme Adi | Miktar | Birim | Aciklama |
|---|-------------|-------------|--------|-------|----------|
| 128 | LP-SAC305 | Lehim Pastasi SAC305 (Sn96.5/Ag3.0/Cu0.5) | 50 | gram | Kester NXG1, Type 4, No-Clean |
| 129 | FLX-001 | Flux (No-Clean) | 10 | ml | Kester 951, IPC J-STD-004 ROL0 |
| 130 | SOL-001 | Temizleme Solventi | 100 | ml | Zestron VIGON N 600, defluxing |
| 131 | CCT-HUM | Conformal Coating HumiSeal 1B73 | 30 | ml | Akrilik bazli, MIL-I-46058C Type AR |
| 132 | LHM-001 | Lehim Teli SAC305 0.5mm | 5 | metre | THT el lehim icin |

**Dogrulama:**
- [ ] BOM tamami girildi (127 bilesen + 5 sarf = 132 satir)
- [ ] BOM yukleme suresi 3 saniyenin altinda (K10 performans)
- [ ] MSD level bilgileri not alanlarinda mevcut (Level 1/2/3)
- [ ] Bilesen package tipleri (BGA, LQFP, QFN, 0402, THT) dogru girildi
- [ ] Sarf malzemeler (lehim pastasi, flux, coating) dahil edildi

---

## BOLUM 2: TEKLIF ve SIPARIS

### Adim 4 — Teklif Hazirlama
**Ekran:** Satis > Teklifler (`/sales/offers`)
**API:** `POST /offer`
**Rol:** Satis Muduru

| Alan | Deger |
|------|-------|
| Musteri | HAVELSAN |
| Teklif No | TKL-2026-0078 |
| Gecerlilik | 30 gun |
| Notlar | HAVELSAN RFQ-2026-ACK-001. IPC-A-610 Class 3 zorunlu. ESD korumalı uretim. MIL-STD-883 uyumlu test. Conformal coating HumiSeal 1B73. Toplam 50 adet, 3 lot halinde teslimat. |

**Teklif Kalemleri:**

| Urun | Miktar | Birim Fiyat | Toplam |
|------|--------|-------------|--------|
| AVK-PCB-001-B (Aviyonik Kontrol Karti) | 50 | 12.500 TL | 625.000 TL |

> Birim fiyat icerigi: Malzeme ~6.800 TL + Iscilik ~2.200 TL + Test ~1.500 TL + Overhead ~2.000 TL

**Dogrulama:**
- [ ] Teklif olusturuldu, PDF ciktisi alinabilir
- [ ] IPC Class 3 + MIL-STD + conformal coating gereksinimleri notlarda
- [ ] Birim fiyat malzeme + iscilik + test + overhead'i karsilar
- [ ] Gecerlilik suresi 30 gun

### Adim 5 — Teklif Onay ve Siparis Donusumu
**Ekran:** Satis > Teklifler > Siparise Donustur
**API:** `POST /offer/{id}/convert`
**Rol:** Satis Muduru

| Alan | Deger |
|------|-------|
| Siparis No | SIP-2026-0145 |
| Lot 1 | 20 adet — Termin: 2026-06-15 |
| Lot 2 | 15 adet — Termin: 2026-08-15 |
| Lot 3 | 15 adet — Termin: 2026-10-15 |
| Ozel Sartlar | Contract Review yapildi: IPC Class 3 kabul kriterlerini karsilama kabiliyetimiz teyit edildi. ESD korumalı alan mevcut. AOI + ICT + fonksiyonel test kapasite musait. Reflow profil HAVELSAN onayina sunulacak. |

**Dogrulama:**
- [ ] Siparis olusturuldu, siparis listesinde gorunuyor
- [ ] 3 lot halinde teslimat tarihleri girildi
- [ ] Contract review notu kaydedildi (AS9100 gereksinimi)
- [ ] Toplam tutar: 50 x 12.500 = 625.000 TL

---

## BOLUM 3: BILESEN TEDARIĞI ve MAL KABUL

### Adim 6 — Bilesen Satin Alma Siparisleri
**Ekran:** Satinalma > Siparisler (`/purchasing/orders`)
**API:** `POST /purchaseorder`
**Rol:** Satinalma Muduru

> Kritik bilesenler icin ayri satin alma siparisleri olusturulur.
> Tedarik suresi uzun bilesenler (FPGA, ADC, konnektor) oncelikli.

| Siparis | Icerik | Tedarikci | Lead Time | Tutar |
|---------|--------|-----------|-----------|-------|
| SAT-1 Kritik IC | FPGA(55), ADC(110), DAC(55), SRAM(55) | Mouser/DigiKey/Arrow | 6-12 hafta | ~165K TL |
| SAT-2 Pasif+Kon. | Direnç/Kap/LED(lot), DF12(110), MIL-38999(55) | Farnell/Mouser/TE | 4-10 hafta | ~180K TL |
| SAT-3 PCB | 4 Katman FR4 160x100mm ENIG (60 adet, %20 fire) | Epec Eng. Tech. | 5 hafta | ~23K TL |
| SAT-4 Sarf | Lehim pastasi(5), Flux(3), Solvent(2), Coating(2) | Kester/Zestron/HumiSeal | 2-3 hafta | ~16K TL |

> **NOT:** IC'lerde %10 fire payi (55 adet/50 siparis). PCB'de %20 fire (60 adet).

**Dogrulama:**
- [ ] 4 satin alma siparisi olusturuldu
- [ ] Kritik IC lead time'lari 8-12 hafta arasinda (uzun tedarik suresi)
- [ ] Fire paylari dahil edildi (%10 bilesen, %20 PCB)
- [ ] Tedarikci bilgileri girildi

### Adim 7 — Mal Kabul: IC Bilesenler + Counterfeit Kontrolu
**Ekran:** Depo > Mal Kabul (`/warehouse/receiving`)
**API:** `POST /receiving`
**Rol:** Depo Sorumlusu + Kalite

> **KRITIK ADIM:** Savunma sanayi bilesen tedariğinde sahte (counterfeit) bilesen riski yuksektir.
> Ozellikle FPGA ve ADC gibi yuksek degerli IC'ler icin ek dogrulama gerekir.

**Mal Kabul Kaydi:**

| Alan | Deger |
|------|-------|
| Satin Alma Ref | SAT-2026-0201 |
| Tedarikci | Mouser Electronics (Yetkili Distribütor) |
| Irsaliye No | MOU-2026-TR-00456 |
| Tarih | 2026-05-10 |

**Kabul Edilen Kalemler:**

| Malzeme | Siparis | Gelen | Kabul | Ret | Aciklama |
|---------|---------|-------|-------|-----|----------|
| Xilinx Artix-7 XC7A35T | 55 | 55 | 55 | 0 | Lot: XC7A-2025-W42. CoC mevcut. |
| AD7606 ADC | 110 | 110 | 110 | 0 | Lot: AD76-2026-W08. CoC mevcut. |

**Counterfeit Kontrol Kaydi (WORKAROUND K4):**

> Giris kalite muayene notlarina yazilir: Tedarikci yetkili distributor (Xilinx franchise), GIDEP/ERAI alert YOK, HIC PEMBE (<%10 RH), Date Code 2025/W42 (18 ay icinde), Laser marking UYGUN → counterfeit riski DUSUK.

**Dogrulama:**
- [ ] Mal kabul kaydi olusturuldu, stok miktarlari guncellendi
- [ ] Lot numaralari girildi (izlenebilirlik icin)
- [ ] Counterfeit kontrol notu detayli yazildi (GIDEP, ERAI, ambalaj, date code)
- [ ] HIC (Nem Gostergesi) durumu kaydedildi

### Adim 8 — MSD (Nem Hassas Bilesen) Floor Life Kontrolu
**Ekran:** Depo > Stok Detay > Lot Notu
**API:** `PUT /stock/{id}/lot-note`
**Rol:** Depo Sorumlusu

> **WORKAROUND K3:** MSD floor life otomatik sayaç yok. Lot notuna yazilir.
> IPC/JEDEC J-STD-033 standardi geregince MSD bilesen yonetimi zorunludur.

**MSD Bilesen Kaydi:**

| Bilesen | MSD Level | Floor Life | Paket Acilma Tarihi | Bitis |
|---------|-----------|------------|---------------------|-------|
| Xilinx Artix-7 XC7A35T (BGA-236) | Level 3 | 168 saat (7 gun) | 2026-05-12 08:00 | 2026-05-19 08:00 |
| AD7606 ADC (LQFP-64) | Level 2 | 1 yil | 2026-05-12 08:30 | 2027-05-12 |
| Hirose DF12 Konnektor | Level 1 | Sinirsiz | — | — |

**Lot Notu Ornegi (FPGA):** MSD Level 3, Floor Life 168 saat, Acilma: 2026-05-12 08:00, Son Tarih: 2026-05-19 08:00, Ortam: 22°C/%45 RH. UYARI: Floor life asiminda bake gerekir (125°C, 24 saat).

**Dogrulama:**
- [ ] MSD bilesen kayitlari lot notlarina yazildi
- [ ] Floor life bitis tarihleri hesaplandi
- [ ] Ortam sicaklik/nem kosullari not edildi
- [ ] Bake proseduru uyarisi eklendi (floor life asiminda)

### Adim 9 — Giris Kalite Muayene
**Ekran:** Kalite > Muayene (`/quality/inspection`)
**API:** `POST /inspection`
**Rol:** Kalite Muhendisi

> Kritik bilesenler icin giris kalite muayenesi yapilir.
> X-ray kontrolu ozellikle BGA IC'ler icin zorunludur (lehim topu butunlugu).

| Muayene | Malzeme | Numune | Kriter | Sonuc |
|---------|---------|--------|--------|-------|
| X-ray (K8) | FPGA BGA-236 | 5/55 | Lehim topu uniform, eksik yok | 5/5 KABUL, goruntular ek yuklendi |
| Viskozite | Lehim pastasi SAC305 (Lot NXG1-2026-B12) | — | 550-700 kcps | 635 kcps @ 25°C → KABUL |
| PCB Boyut+Gorsel | FR4 PCB (Lot PCB-2026-0560) | 10/60 | 160±0.15 x 100±0.15mm, IPC-A-600 Class 3 | 10/10 KABUL |

**Dogrulama:**
- [ ] 3 giris kalite muayenesi olusturuldu ve KABUL (X-ray ek yuklendi K8, viskozite spesifikasyon icinde, PCB IPC-A-600 Class 3)

---

## BOLUM 4: ESD KONTROL ve URETIM HAZIRLIK

### Adim 10 — ESD Korumalı Uretim Alani Kontrolu
**Ekran:** Kalite > Muayene (`/quality/inspection`)
**API:** `POST /inspection`
**Rol:** Kalite Muhendisi

> Uretim baslangicinda ESD korumalı alan kontrolleri yapilir.
> ANSI/ESD S20.20 standardina gore EPA (ESD Protected Area) dogrulamasi gereklidir.

**ESD Alan Kontrol:** Yuzey direnci 2.4x10^7 (10^6-10^9), Zemin 8.1x10^7, Bilek kayisi 1.2M (750K-10M), Toprak <1ohm (0.3), Nem %45 (>%30), Sicaklik 22°C (20-26), Iyonizer +12/-15V (±25V), ESD isareti mevcut → TUM UYGUN.

**Muayene Notu:** EPA tum kontrol noktaları UYGUN. Ekipman: ESD-001, ESD-002. Ortam: 22°C/%45 RH. Operatorler ESD egitimi guncel. ONAY: Uretim baslatilabilir.

**Dogrulama:**
- [ ] ESD alan kontrol muayenesi olusturuldu
- [ ] Tum kontrol noktalari UYGUN
- [ ] Ortam kosullari (nem, sicaklik) kayit altinda
- [ ] Operator ESD egitim durumu kontrol edildi

---

## BOLUM 5: IS EMRI ve URETIM

### Adim 11 — Is Emri Olusturma (Lot 1 — 20 Adet)
**Ekran:** Uretim > Is Emirleri (`/production/work-orders`)
**API:** `POST /workorder`
**Rol:** Uretim Muduru

| Alan | Deger |
|------|-------|
| Is Emri No | IE-2026-0312 |
| Siparis Ref | SIP-2026-0145 (Lot 1) |
| Urun | AVK-PCB-001-B (Aviyonik Kontrol Karti — Rev B) |
| Miktar | 20 adet |
| Baslama | 2026-05-12 |
| Termin | 2026-06-10 (5 gun teslimat tamponu) |
| Oncelik | Yuksek |
| Notlar | HAVELSAN Lot 1. IPC-A-610 Class 3. ESD zorunlu. MSD bilesen floor life takip edilecek — FPGA son kullanim: 2026-05-19. Reflow profil HAVELSAN onayli (Profil No: RFP-AVK-001-B). |

**Operasyon Routing:** 13 adim otomatik atanir (OP10→OP130). Parca basi sureler: Stencil 3dk, SMD 8dk, Reflow 6dk, AOI 4dk, THT 25dk, Dalga 5dk, Temizlik 4dk, Gorsel 15dk, ICT 5dk, FNK 12dk, Coating 8dk, Kurleme 120dk(toplu), Son test 10dk. **Toplam: ~38 saat (20 adet).**

**Dogrulama:**
- [ ] Is emri olusturuldu, uretim listesinde gorunuyor
- [ ] 13 operasyon otomatik atandi (BOM'dan routing)
- [ ] MSD floor life uyarisi not alaninda
- [ ] Tahmini toplam sure ~38 saat
- [ ] Termin tarihi (2026-06-10) gerçekci

### Adim 12 — OP10: Stencil Baski (Lehim Pastasi)
**Ekran:** Uretim > ShopFloor Terminali (`/production/shopfloor`)
**API:** `POST /workorder/{id}/operation/{opId}/start` → `POST .../complete`
**Rol:** Operator (Mehmet Yilmaz — IPC-001)

| Alan | Deger |
|------|-------|
| Operasyon | OP10 — Stencil Baski |
| Makine | STN-01 (DEK Horizon 03iX) |
| Operator | Mehmet Yilmaz |
| Baslama | 2026-05-12 08:00 |
| Bitis | 2026-05-12 09:35 |
| Parca Sayisi | 20 adet |
| Stencil | STN-AVK-001-B (150um aciklik, laser kesim, nano-coat) |

**Operasyon Notlari (WORKAROUND K6):** Stencil STN-AVK-001-B (150um, laser-cut, nano-coated). Pasta: Kester NXG1 SAC305, Lot NXG1-2026-B12 (635 kcps). Baski: 40 mm/s, 4.5 kg basinc, ayirma 2 mm/s. Her 5 baskida temizleme. SPI: Ilk 3 kart kontrol UYGUN. Ortam: 22°C/%45 RH.

**Dogrulama:**
- [ ] OP10 baslatildi ve tamamlandi
- [ ] Operator ismi ve makine kaydi dogru
- [ ] Stencil baski parametreleri not alanina yazildi
- [ ] SPI kontrol notu mevcut (WORKAROUND K6)
- [ ] 20 adet islendi

### Adim 13 — OP20: SMD Yerlestirme (Pick & Place)
**Ekran:** Uretim > ShopFloor Terminali
**API:** `POST /workorder/{id}/operation/{opId}/start` → `POST .../complete`
**Rol:** Operator (Mehmet Yilmaz — IPC-001)

| Alan | Deger |
|------|-------|
| Operasyon | OP20 — SMD Yerlestirme |
| Makine | SMD-01 (Yamaha YSM20R) |
| Operator | Mehmet Yilmaz |
| Baslama | 2026-05-12 09:45 |
| Bitis | 2026-05-12 13:15 |
| Parca Sayisi | 20 adet |

**Operasyon Notlari (WORKAROUND K7):** Program PRG-AVK-001-B-R03. 95 bilesen, 48 slot, 2 pas (Pas1: IC+buyuk, Pas2: pasifler). BGA nozzle: Yamaha 7.0mm. Dogruluk: ±0.04mm@3sigma, Hiz: ~15.000 CPH. Toplam ~4.800 yerlestirme. Feeder hatasi: 0.

**Dogrulama:**
- [ ] OP20 baslatildi ve tamamlandi
- [ ] Makine programi referans numarasi yazildi (WORKAROUND K7)
- [ ] 2 pas gerektigine dair bilgi mevcut
- [ ] Feeder hata kaydi (veya hatasiz notu) mevcut

### Adim 14 — OP30: Reflow Lehim
**Ekran:** Uretim > ShopFloor Terminali
**API:** `POST /workorder/{id}/operation/{opId}/start` → `POST .../complete`
**Rol:** Operator (Mehmet Yilmaz — IPC-001)

| Alan | Deger |
|------|-------|
| Operasyon | OP30 — Reflow Lehim |
| Makine | RFW-01 (Heller 1913 MK5) |
| Operator | Mehmet Yilmaz |
| Baslama | 2026-05-12 13:30 |
| Bitis | 2026-05-12 15:45 |
| Parca Sayisi | 20 adet |

**Operasyon Notlari (WORKAROUND K1):**

| Profil Bolgesi | Parametre | Deger |
|----------------|-----------|-------|
| Preheat (B1-3) | 25→150°C | Rampa: 1.5°C/s (max 3) |
| Soak (B4-6) | 150→200°C | Sure: 60-90s |
| Reflow (B7-8) | Peak: 245°C | TAL: 45-75s |
| Cool (B9-10) | 245→25°C | Rampa: -3°C/s (max -6) |

**Thermocouple Olcum (Kart #1):** TC1 (BGA merkez): Peak 243°C/TAL 62s, TC2 (kenar): 238°C/52s, TC3 (kart kenari): 235°C/48s. Delta T: 8°C (max 10°C) → UYGUN. Konveyor: 85 cm/dk. N2 aktif. MSD: 6 saat (limit 168) → UYGUN.

**Dogrulama:**
- [ ] OP30 baslatildi ve tamamlandi
- [ ] Reflow profil parametreleri detayli yazildi (WORKAROUND K1)
- [ ] Thermocouple olcum degerleri kaydedildi
- [ ] Peak sicaklik 245°C, TAL 45-75s → IPC J-STD-001 uyumlu
- [ ] MSD floor life kontrolu yapildi ve UYGUN

### Adim 15 — OP40: AOI (Otomatik Optik Muayene)
**Ekran:** Kalite > Muayene (`/quality/inspection`) + ShopFloor
**API:** `POST /inspection` + `POST /workorder/{id}/operation/{opId}/complete`
**Rol:** Kalite (Ayse Kara — IPC-002)

| Alan | Deger |
|------|-------|
| Operasyon | OP40 — AOI Muayene |
| Makine | AOI-01 (Koh Young Zenith) |
| Muayene Eden | Ayse Kara |
| Muayene Edilen | 20 adet |

**AOI Sonuclari:**

| Kart No | Sonuc | Hata Sayisi | Hata Tipleri |
|---------|-------|-------------|-------------|
| AVK-001 → AVK-016 | PASS | 0 | — |
| AVK-017 | FAIL | 2 | Tombstone (R47), Insufficient solder (C12) |
| AVK-018 | PASS | 0 | — |
| AVK-019 | FAIL | 1 | Bridge (IC7 pin 24-25) |
| AVK-020 | PASS | 0 | — |

**AOI Hata Detaylari:**

| Kart | Ref Des | Bilesen | Hata Tipi | IPC-A-610 Ref | Karar |
|------|---------|---------|-----------|---------------|-------|
| AVK-017 | R47 | 10K 0402 | Tombstone (mezar tasi) | IPC-A-610 8.3.3 | RET — Rework gerekli |
| AVK-017 | C12 | 100nF 0402 | Insufficient Solder | IPC-A-610 8.3.1 | RET — Rework gerekli |
| AVK-019 | IC7 | SN74LVC8T245 | Solder Bridge (pin 24-25) | IPC-A-610 8.3.6 | RET — Rework gerekli |

**Muayene Notu (WORKAROUND K2):** Program AOI-PRG-AVK-001-B-R02. 20 kart, 1900 nokta. 18 PASS, 2 FAIL. Hata orani %0.16. AOI PDF (AOI-RPT-20260512.pdf) ek olarak yuklendi. 2 kart REWORK, 18 kart OP50'ye devam.

**Dogrulama:**
- [ ] AOI kaydi: 18 PASS, 2 FAIL (hata tipleri IPC-A-610 referansli), rapor ek yuklendi (K2), FAIL kartlar rework'te

### Adim 16 — OP50: THT Bilesen Montaji (Manuel)
**Ekran:** Uretim > ShopFloor Terminali
**API:** `POST /workorder/{id}/operation/{opId}/start` → `POST .../complete`
**Rol:** Operator (Hasan Demir — IPC-003)

| Alan | Deger |
|------|-------|
| Operasyon | OP50 — THT Bilesen Montaji |
| Makine | ELH-01 (Weller WXA 2) |
| Operator | Hasan Demir |
| Baslama | 2026-05-13 08:00 |
| Bitis | 2026-05-13 16:30 |
| Parca Sayisi | 18 adet (2 adet rework bekliyor) |

**Operasyon Notlari:** 32 bilesen/kart, 18 kart. Montaj sirasi: dusuk→yuksek profil. Lehim teli SAC305 0.5mm (Lot LT-2026-0089), havya 350°C. IPC J-STD-001 Class 3: min %75 barrel dolgusu. MIL-DTL-38999 konnektor pin yonlendirme semasina gore montajlandi. Her kart gorsel kontrol edildi.

**Dogrulama:**
- [ ] OP50 tamamlandi (18 adet — 2 rework hariç)
- [ ] THT montaj sirasi ve parametreleri not edildi
- [ ] IPC J-STD-001 Class 3 lehim dolgusu kriteri referans verildi
- [ ] MIL-DTL-38999 konnektor ozel montaj notu mevcut

### Adim 17 — OP60: Dalga Lehim
**Ekran:** Uretim > ShopFloor Terminali
**API:** `POST /workorder/{id}/operation/{opId}/start` → `POST .../complete`
**Rol:** Operator (Hasan Demir — IPC-003)

| Alan | Deger |
|------|-------|
| Operasyon | OP60 — Dalga Lehim |
| Makine | DLH-01 (SEHO PowerSelective) |
| Operator | Hasan Demir |
| Baslama | 2026-05-14 08:00 |
| Bitis | 2026-05-14 10:15 |
| Parca Sayisi | 18 adet |

**Operasyon Notlari:** SEHO PowerSelective (selective soldering). Banyo: SAC305, 260°C±3°C. Flux: Kester 951 spray. Preheat: IR 110°C. Konveyor: 10 mm/s, nozzle 6mm. N2 aktif. Ilk kart kontrol UYGUN.

**Dogrulama:**
- [ ] OP60 tamamlandi (18 adet)
- [ ] Dalga lehim parametreleri (sicaklik, hiz, flux) kayit altinda
- [ ] Selective soldering kullanildi (SMD bilesenler korundu)

### Adim 18 — OP70: Temizleme (Flux Kalintisi)
**Ekran:** Uretim > ShopFloor Terminali
**API:** `POST /workorder/{id}/operation/{opId}/start` → `POST .../complete`
**Rol:** Operator

| Alan | Deger |
|------|-------|
| Operasyon | OP70 — Temizleme |
| Makine | TMZ-01 (Branson 8510) |
| Baslama | 2026-05-14 10:30 |
| Bitis | 2026-05-14 12:00 |
| Parca Sayisi | 18 adet |

**Operasyon Notlari:** Ultrasonik banyo Zestron VIGON N 600, 55°C, 10 dk + 5 dk DI su durulama + kurutma. Ion kontaminasyon (IPC-CH-65): 0.82 ug/cm2 (limit <1.56) → UYGUN.

**Dogrulama:**
- [ ] OP70 tamamlandi
- [ ] Temizleme parametreleri kayit altinda
- [ ] Ion kontaminasyon testi yapildi ve UYGUN

### Adim 19 — OP80: Gorsel Muayene (IPC-A-610 Class 3)
**Ekran:** Kalite > Muayene (`/quality/inspection`)
**API:** `POST /inspection`
**Rol:** Kalite (Ayse Kara — IPC-002, IPC-A-610 CIS)

| Alan | Deger |
|------|-------|
| Muayene Tipi | Proses Ici — Gorsel Muayene |
| Standart | IPC-A-610 Rev G, Class 3 (Yuksek Guvenilirlik) |
| Muayene Eden | Ayse Kara (IPC-A-610 CIS sertifikali) |
| Ekipman | MIK-001 (Stereo Mikroskop, 20x buyutme) |
| Numune | 18 adet (%100 muayene — savunma sanayi) |

**Kontrol Listesi (IPC-A-610 Class 3):** SMD dolgusu (8.3.1) 18/18, THT dolgusu (7.3.1) 18/18, Bridge (8.3.6) 18/18, Soguk lehim (8.3.7) 17/18 (1 suphe), Yonlendirme (8.2.4) 18/18, PCB hasar (10.2) 18/18, Temizlik (10.3) 18/18.

**Sonuc:** 17 KABUL + AVK-003 SARTLI KABUL (IC3 pin 8 soguk lehim suphesi — ICT'de dogrulanacak).

**Dogrulama:**
- [ ] %100 gorsel muayene yapildi (18 adet)
- [ ] IPC-A-610 Class 3 kontrol listesi detayli dolduruldu
- [ ] 17 KABUL, 1 SARTLI KABUL (soguk lehim suphesi)
- [ ] Sartli kabul notu ICT dogrulama referansi iceriyor

### Adim 20 — OP90: ICT (In-Circuit Test)
**Ekran:** Kalite > Muayene (`/quality/inspection`) + ShopFloor
**API:** `POST /inspection` + `POST /workorder/{id}/operation/{opId}/complete`
**Rol:** Test Muhendisi

| Alan | Deger |
|------|-------|
| Operasyon | OP90 — ICT |
| Makine | ICT-01 (Keysight i3070) |
| Test Programi | ICT-AVK-001-B-R02 |
| Test Eden | Test Teknisyeni |
| Test Edilen | 18 adet |

**ICT Sonuclari (WORKAROUND K5):**

| Kart No | Sonuc | Hata | Detay |
|---------|-------|------|-------|
| AVK-001 → AVK-002 | PASS | — | — |
| AVK-003 | FAIL | IC3 pin 8 open | Soguk lehim teyit edildi — gorsel muayene ile uyumlu |
| AVK-004 → AVK-016 | PASS | — | — |
| AVK-018 | PASS | — | — |
| AVK-020 | PASS | — | — |

**ICT Ozet:** Program ICT-AVK-001-B-R02, 127 bilesen, 312 test noktasi. 17 PASS, 1 FAIL (AVK-003 IC3 pin 8 OPEN — soguk lehim). Toplam 3 kart rework: AVK-003, AVK-017, AVK-019. ICT raporu ek yuklendi (ICT-RPT-20260514.pdf).

**Dogrulama:**
- [ ] ICT: 17 PASS, 1 FAIL (AVK-003, gorsel muayene ile tutarli), rapor ek yuklendi (K5)

### Adim 21 — AOI FAIL Kartlar Rework (Lehim Tamir)
**Ekran:** Uretim > ShopFloor + Kalite > Muayene
**API:** Rework operasyonu
**Rol:** Rework Teknisyeni (Ali Celik — IPC-005, IPC 7711/7721 CIS)

> 3 kart rework gerekli: AVK-003 (soguk lehim IC3), AVK-017 (tombstone R47 + insufficient C12), AVK-019 (bridge IC7)

**Rework Kaydi:**

| Kart | Hata | Rework Islemi | IPC 7711/7721 Ref | Sonuc |
|------|------|---------------|-------------------|-------|
| AVK-003 | IC3 pin 8 soguk lehim | Flux uygula + lehim eritme + yeni lehim ekleme | 7.1 (Through-hole) | TAMAM |
| AVK-017 | R47 tombstone | Bilesen cikart + yeni bilesen yerlestir + reflow | 7.3 (Chip component) | TAMAM |
| AVK-017 | C12 insufficient solder | Flux + lehim ekleme | 7.2 (Solder joint) | TAMAM |
| AVK-019 | IC7 pin 24-25 bridge | Flux + lehim fitili ile fazla lehim alma | 7.2 (Solder joint) | TAMAM |

**Rework Notu:** Teknisyen Ali Celik (IPC 7711/7721 CIS), Ekipman: ELH-02 (JBC RMSE-2A), Flux: Kester 951. AVK-003: IC3 yeniden lehim. AVK-017: R47 degistirildi + C12 lehim eklendi. AVK-019: IC7 bridge lehim fitili ile alindi. Tum kartlar 40x gorsel muayene UYGUN. Sonraki: ICT → FNK tekrar test.

**Dogrulama:**
- [ ] 3 kart rework (IPC 7711/7721), gorsel muayene UYGUN, sertifikali teknisyen (IPC-005)

### Adim 22 — Rework Kartlar Tekrar Test (ICT + Fonksiyonel)
**Ekran:** Kalite > Muayene
**API:** `POST /inspection`
**Rol:** Test Muhendisi

**Tekrar ICT:**

| Kart | Sonuc | Not |
|------|-------|-----|
| AVK-003 | PASS | IC3 pin 8 — rework sonrasi open hatasi giderildi |
| AVK-017 | PASS | R47, C12 — rework sonrasi tum test noktaları PASS |
| AVK-019 | PASS | IC7 — bridge giderildi, tum pinler bagimsiz |

**Dogrulama:**
- [ ] 3 rework kart ICT'den PASS gecti
- [ ] Onceki hata kodlari giderildi

### Adim 23 — OP100: Fonksiyonel Test (Fixture)
**Ekran:** Kalite > Muayene + ShopFloor
**API:** `POST /inspection` + `POST /workorder/{id}/operation/{opId}/complete`
**Rol:** Test Muhendisi

| Alan | Deger |
|------|-------|
| Operasyon | OP100 — Fonksiyonel Test |
| Makine | FNK-01 (Ozel Tasarim — HAVELSAN Spec) |
| Test Programi | FNK-AVK-001-B-R01 |
| Test Eden | Test Muhendisi |
| Test Edilen | 20 adet (17 normal + 3 rework) |

**Fonksiyonel Test Sonuclari (WORKAROUND K5):**

| Test Parametresi | Kriter | Olcum (20 kart) | Sonuc |
|-----------------|--------|-----------------|-------|
| Guc 5V / 3.3V | 450±50 / 320±40 mA | 428-471 / 305-342 mA | UYGUN |
| FPGA Boot | <2 s | 0.8-1.2 s | UYGUN |
| ADC/DAC Dogruluk | ±2 / ±1 LSB | ±1.2 / ±0.8 LSB | UYGUN |
| Dijital I/O (19 pin) | Toggle tumu | 19/19 PASS | UYGUN |
| RS-232 Loopback | PASS | 20/20 PASS | UYGUN |
| Watchdog Timer | 5s ±0.5s | 4.8-5.3s | UYGUN |

**Fonksiyonel Test Ozet:** Fixture FNK-AVK-001-B-R01, ort. 11 dk/kart. 20/20 PASS. Rework kartlar (AVK-003/017/019) dahil tum testlerden PASS. FNK raporu ek yuklendi (FNK-RPT-20260515.pdf).

**Dogrulama:**
- [ ] FNK: 20/20 PASS (rework kartlar dahil), olcumler kayitli, rapor ek yuklendi (K5)

### Adim 24 — OP110-OP120: Conformal Coating Uygulama ve Kurleme
**Ekran:** Uretim > ShopFloor Terminali
**API:** `POST /workorder/{id}/operation/{opId}/start` → `POST .../complete`
**Rol:** Operator (Fatma Ozturk — IPC-004, IPC-CC-830B)

| Alan | Deger |
|------|-------|
| Operasyon | OP110 — Conformal Coating + OP120 — Kurleme |
| Makine | CCT-01 (Nordson Asymtek Select Coat) |
| Operator | Fatma Ozturk |
| Baslama | 2026-05-16 08:00 |
| Bitis | 2026-05-16 14:00 (kurleme dahil) |
| Parca Sayisi | 20 adet |

**Coating Parametreleri:** HumiSeal 1B73 akrilik, Lot HUM-2026-0234. MIL-I-46058C Type AR, IPC-CC-830B. Selective coating — maskeleme: MIL-38999, DB-25, test noktaları, sigorta holderlari. Kalinlik: 25-75 um. Kurleme: 80°C/30 dk. UV muayene: homojen, atlama YOK.

**Dogrulama:**
- [ ] OP110+OP120 tamamlandi, lot kaydedildi, maskeleme + kurleme + UV muayene UYGUN

### Adim 25 — Conformal Coating Kalinlik Kontrolu
**Ekran:** Kalite > Muayene (`/quality/inspection`)
**API:** `POST /inspection`
**Rol:** Kalite (Ayse Kara — IPC-002)

**Kalinlik Olcumleri (WORKAROUND K9):** 5 numune kart (AVK-001/005/010/015/020), 3 bolge/kart. Olcumler: 33-52 um (ortalamalar 40-44 um). Kriter 25-75 um → TUM UYGUN.

**Muayene Notu:** Ekipman KLN-001. 5/20 numune, 3 bolge/kart. Tum olcumler 33-52 um (kriter 25-75). Maskeleme UYGUN. UV muayene 20 kart kontrol — atlama/bosluk YOK.

**Dogrulama:**
- [ ] Coating kalinlik: 5 numune, 15 olcum, 33-52um (25-75 kriter), maskeleme + UV UYGUN (K9)

### Adim 26 — OP130: Son Test + Etiketleme
**Ekran:** Uretim > ShopFloor Terminali
**API:** `POST /workorder/{id}/operation/{opId}/complete`
**Rol:** Kalite + Uretim

| Alan | Deger |
|------|-------|
| Operasyon | OP130 — Son Test + Etiketleme |
| Test Eden | Test Muhendisi |
| Tarih | 2026-05-16 16:00 |
| Parca Sayisi | 20 adet |

**Son Test:** Gorsel kontrol (coating sonrasi) 20/20, guc acilma 20/20, seri no barkod 20/20, HAVELSAN P/N 20/20 → TUM UYGUN.

**Etiket:** Seri No DE-AVK-2026-0001→0020, HAVELSAN P/N HVL-ACK-2026-001, Uretim 2026-05-16, Lot 1.

**Dogrulama:**
- [ ] OP130 tamamlandi, is emri KAPANDI
- [ ] 20 kart son testten PASS
- [ ] Seri numaralari (DE-AVK-2026-0001 → 0020) atandi
- [ ] Barkod etiketleri basildi ve okunabilirligi dogrulandi
- [ ] HAVELSAN P/N etiketi yapildi

---

## BOLUM 6: NCR (UYGUNSUZLUK) YONETIMI

### Adim 27 — NCR Kaydi: Soguk Lehim Hatasi
**Ekran:** Kalite > Uygunsuzluk (NCR) (`/quality/mrb`)
**API:** `POST /mrb`
**Rol:** Kalite Muhendisi

| Alan | Deger |
|------|-------|
| NCR No | NCR-2026-0089 |
| Tarih | 2026-05-14 |
| Kaynak | ICT Test (OP90) |
| Urun | AVK-PCB-001-B |
| Etkilenen Kart | AVK-003 (Seri: DE-AVK-2026-0003) |
| Uygunsuzluk | IC3 (SN74LVC8T245) pin 8 — soguk lehim, acik devre |
| Standart Referans | IPC-A-610 Rev G, 8.3.7 (Cold/Disturbed Solder) Class 3 — DEFECT |

**Kok Neden Analizi (5-Why):**
- Why 1: Pin 8 reflow'da tam erimedi → Why 2: Termal golge (buyuk ground plane) → Why 3: PCB bakir kalinlik varyasyonu (lot farki) → Why 4: Giris kalitede bakir olcum yok → Why 5: Mikroseksiyon ekipmani yok
- **Kok Neden:** PCB bakir kalinlik varyasyonu + termal golge
- **Onleyici:** (1) PCB tedarikcisine tolerans sikilastirma (±10%), (2) Soak sure +10s, (3) Suphelilere X-ray
- **Duzeltici:** AVK-003 rework (Ali Celik) → ICT + FNK PASS → KABUL

**Dogrulama:**
- [ ] NCR kaydi olusturuldu (NCR-2026-0089)
- [ ] Kok neden analizi (5-Why) detayli yazildi
- [ ] Onleyici ve duzeltici faaliyetler tanimlandi
- [ ] Rework referansi ve test sonucu baglandi
- [ ] NCR durumu KAPATILDI (duzeltme tamamlandi)

---

## BOLUM 7: FAI, CoC ve IZLENEBILIRLIK

### Adim 28 — FAI (AS9102 First Article Inspection)
**Ekran:** Kalite > Final Muayene (`/quality/final-inspection`)
**API:** `POST /finalinspection`
**Rol:** Kalite Muhendisi (Ayse Kara — IPC-002)

> AS9102 Rev C — 3 form: Form 1 (Part Number), Form 2 (Material/Process), Form 3 (Characteristic)

**FAI Kaydi:**

| Alan | Deger |
|------|-------|
| FAI No | FAI-2026-0045 |
| Urun | AVK-PCB-001-B |
| Kart | AVK-001 (Seri: DE-AVK-2026-0001) — ilk uretim parcasi |
| Musteri | HAVELSAN |
| Siparis Ref | SIP-2026-0145 |

**Form 1:** P/N AVK-PCB-001-B, S/N DE-AVK-2026-0001, DWG-AVK-001-B Rev 2 (ECN-2026-042).

**Form 2 (Malzeme/Proses):** PCB FR4 (IPC-4101/21) UYGUN, Lehim SAC305 (J-STD-004) UYGUN, Reflow (J-STD-001 Class 3) UYGUN, Coating (MIL-I-46058C) UYGUN, Temizleme (IPC-CH-65, 0.82 ug/cm2) UYGUN.

**Form 3 (Karakteristik):** PCB boyut 159.98x100.05mm (±0.15), Guc 5V 435mA/3.3V 312mA, ADC ±1.0 LSB, Coating 43um, FPGA boot 0.95s → TUM UYGUN.

**Dogrulama:**
- [ ] FAI AS9102 (3 form) tamamlandi, tum karakteristikler UYGUN, PDF ciktisi alinabilir

### Adim 29 — CoC (Certificate of Conformance)
**Ekran:** Kalite > CoC (`/quality/coc`)
**API:** `POST /coc`
**Rol:** Kalite Muduru

| Alan | Deger |
|------|-------|
| CoC No | COC-2026-0078 |
| Musteri | HAVELSAN |
| Siparis | SIP-2026-0145 (Lot 1) |
| Urun | AVK-PCB-001-B — 20 adet |
| Seri No Araligi | DE-AVK-2026-0001 → DE-AVK-2026-0020 |

**CoC Icerigi:** Urun AVK-PCB-001-B, HAVELSAN P/N HVL-ACK-2026-001, 20 adet, Seri DE-AVK-2026-0001→0020. Uygunluk: IPC-A-610 Class 3, J-STD-001, MIL-STD-883, IPC-CC-830B, AS9100 Rev D. Test: AOI/ICT/FNK 20/20 PASS. Coating: 33-52 um. NCR-2026-0089 KAPATILDI. FAI-2026-0045 UYGUN.

**Dogrulama:**
- [ ] CoC olusturuldu (PDF), seri no 0001-0020, standartlar + test ozeti + NCR/FAI referanslari dahil

### Adim 30 — Seri Numara Izlenebilirlik Zinciri
**Ekran:** Kalite > Izlenebilirlik (`/quality/traceability`)
**API:** `GET /traceability/{serialNumber}`
**Rol:** Kalite Muhendisi

> **Ornek izlenebilirlik sorgusu:** DE-AVK-2026-0003 (rework yapilan kart)

**Beklenen Izlenebilirlik Zinciri (DE-AVK-2026-0003):**

| Katman | Detay |
|--------|-------|
| Urun | AVK-PCB-001-B, HAVELSAN, SIP-2026-0145, IE-2026-0312 |
| Bilesen Lotlari | PCB: PCB-2026-0560, FPGA: XC7A-2025-W42, ADC: AD76-2026-W08, Pasta: NXG1-2026-B12, Coating: HUM-2026-0234 |
| Uretim | OP10→OP40 (05-12), OP50 (05-13), OP60-OP80 (05-14), OP80 SARTLI KABUL, OP90 FAIL |
| Rework | 05-15, Ali Celik, IPC 7711/7721 — IC3 pin 8 soguk lehim tamiri |
| Tekrar Test | ICT PASS, FNK PASS (05-15), Coating (05-16), Son Test PASS (05-16) |
| Kalite | NCR-2026-0089 KAPATILDI, FAI-2026-0045, CoC COC-2026-0078 |
| Counterfeit | FPGA + ADC: GIDEP/ERAI clear, yetkili distributor |

**Dogrulama:**
- [ ] Izlenebilirlik: lot→seri no baglanti, operasyon kronolojisi, rework gecmisi, NCR/FAI/CoC ref, counterfeit kaydi

---

## BOLUM 8: SEVKIYAT ve FATURA

### Adim 31 — ESD Korumalı Paketleme ve Sevkiyat
**Ekran:** Depo > Sevkiyat (`/warehouse/shipping`)
**API:** `POST /shipping`
**Rol:** Depo Sorumlusu

| Alan | Deger |
|------|-------|
| Sevkiyat No | SEV-2026-0198 |
| Siparis Ref | SIP-2026-0145 (Lot 1) |
| Musteri | HAVELSAN |
| Miktar | 20 adet |
| Seri No Araligi | DE-AVK-2026-0001 → DE-AVK-2026-0020 |
| Tarih | 2026-05-17 |
| Tasima | Kara — ozel kurye (titresim korumalı) |

**Paketleme Notu:** Anti-statik poset + MBB (nem bariyeri) + desiccant + HIC. PE foam koruma. ESD + KIRILACAK + NEM HASSAS etiketleri. 20 adet sayildi, seri no listesi teyit edildi. Packing list dahil.

**Dogrulama:**
- [ ] Sevkiyat: 20 adet stoktan dusuruldu, ESD paketleme, seri no listesi bagli, titresim korumalı tasima

### Adim 32 — Fatura Kesimi
**Ekran:** Finans > Faturalar (`/finance/invoices`)
**API:** `POST /invoice`
**Rol:** Muhasebe

| Alan | Deger |
|------|-------|
| Fatura No | FTR-2026-0234 |
| Musteri | HAVELSAN |
| Sevkiyat Ref | SEV-2026-0198 |
| Kalem | AVK-PCB-001-B x 20 adet x 12.500 TL |
| Ara Toplam | 250.000 TL |
| KDV (%20) | 50.000 TL |
| Toplam | 300.000 TL |
| Vade | 60 gun |

**Dogrulama:**
- [ ] Fatura olusturuldu ve PDF ciktisi alinabilir
- [ ] Tutar: 20 x 12.500 = 250.000 TL + KDV
- [ ] Siparis → sevkiyat → fatura zinciri tutarli
- [ ] Vade tarihi 60 gun olarak girildi

---

## BOLUM 9: MALIYET ANALIZI ve IZLEME

### Adim 33 — Uretim Maliyet Analizi
**Ekran:** Uretim > Maliyet Analizi (`/production/part-cost`)
**API:** `GET /partcost/{productId}`
**Rol:** Uretim Muduru

**Birim Maliyet Tablosu (1 adet AVK-PCB-001-B):**

| Maliyet Grubu | Tutar | Oran | Detay |
|---------------|-------|------|-------|
| Malzeme | 6.800 TL | %68 | FPGA 1.850 + ADC 840 + DAC 380 + Konnektorler 2.450 + Pasifler 450 + PCB 380 + THT 280 + Sarf 75 + SRAM 95 |
| Iscilik | 1.850 TL | %18.5 | SMD hatti 650 + THT/Dalga 420 + Temizlik/Muayene 280 + Coating 350 + Son test 150 |
| Test | 650 TL | %6.5 | AOI 120 + ICT 180 + Fonksiyonel 350 |
| Genel Gider (%46) | 1.426 TL | %14.3 | Imalat %18 + ESD %5 + Amortisman %12 + Enerji %7 + Temiz oda %4 |
| Rework | 22.5 TL | %0.2 | 3 kart/20 lot = 450 TL / 20 |
| **BIRIM MALIYET** | **~10.749 TL** | | |
| **SATIS FIYATI** | **12.500 TL** | | **Kar marji: ~%14 (1.751 TL)** |

**Dogrulama:**
- [ ] Maliyet analizi ekrani acildi
- [ ] Malzeme maliyeti BOM'dan otomatik cekildi
- [ ] Iscilik maliyeti operasyon surelerinden hesaplandi
- [ ] Genel gider %46 olarak uygulandi
- [ ] Rework maliyeti dahil edildi
- [ ] Kar marji ~%14 — savunma sanayi icin makul

### Adim 34 — Bilesen Obsolescence Takibi
**Ekran:** Urunler > BOM + Stok Notlari
**API:** `GET /product/{id}/bom`
**Rol:** Muhendislik + Satinalma

> **WORKAROUND:** Quvex'te bilesen yasam dongusu yonetimi (lifecycle) modulu yok.
> BOM notlarina ve stok lot notlarina obsolescence bilgileri yazilir.

**Obsolescence Risk Tablosu:**

| Bilesen | Uretici Durumu | Risk | Aksiyon |
|---------|---------------|------|---------|
| Xilinx Artix-7 XC7A35T | Active | DUSUK | — (Xilinx/AMD devam) |
| AD7606 ADC | Active | DUSUK | — |
| AD5764 DAC | NRND (Not Recommended for New Design) | ORTA | Alternatif: AD5764R degerlendiriliyor. 2 yillik guvenli stok planla. |
| IS62WV51216 SRAM | Active | DUSUK | — |
| Omron G2R-2 Role | Active | DUSUK | — |
| MIL-DTL-38999 Konnektor | Active (mil-spec) | DUSUK | Askeri standart — uzun omurlu |
| Hirose DF12 80-pin | Active | DUSUK | — |

**BOM Notu (AD5764 DAC):** NRND — PCN-2026-0023, tahmini EOL 2028-Q4. Aksiyon: (1) AD5764R degerlendirme, (2) 100 adet stok guvence siparisi, (3) Rev C cizim guncelleme plani. Sorumlu: Muhendislik + Satinalma.

**Dogrulama:**
- [ ] BOM bilesen durumu (Active/NRND/EOL) incelendi
- [ ] NRND bilesen (AD5764) icin obsolescence notu yazildi
- [ ] Alternatif bilesen onerisi (AD5764R) kaydedildi
- [ ] Stok guvence siparis plani belirtildi
- [ ] Diger bilesenler Active — risk dusuk

---

## BOLUM 10: ROL BAZLI TEST OZETI

| Rol | Adimlar | Kritik Dogrulamalar |
|-----|---------|---------------------|
| **Kalite Muhendisi** (Ayse Kara) | 9, 10, 15, 19, 25, 27, 28, 29, 30 | Giris kalite (3 muayene), AOI (18P/2F), IPC-A-610 Class 3 gorsel, coating kalinlik, NCR 5-Why, FAI AS9102, CoC, izlenebilirlik |
| **Uretim Muduru** | 11, 14, 33 | Is emri (13 op, 20 adet), reflow profil HAVELSAN onayli, maliyet ~10.749 TL |
| **Satinalma Muduru** | 6, 7, 8, 34 | 4 satin alma siparisi, counterfeit (GIDEP/ERAI), MSD floor life, obsolescence (AD5764 NRND) |
| **Operator** (ShopFloor) | 12, 13, 14, 16, 17, 24 | Stencil baski+SPI, SMD pick&place, reflow, THT montaj, dalga lehim, conformal coating |
| **Test Muhendisi** | 20, 22, 23, 26 | ICT (17P/1F), rework tekrar test (3 PASS), fonksiyonel (20/20), son test+etiket |
| **Rework Teknisyeni** (Ali Celik) | 21, 22 | 3 kart lehim tamir (IPC 7711/7721), ICT+FNK PASS |

---

## BOLUM 11: KAPSAMLI DOGRULAMA CHECKLIST

### 11.1 Veri Butunlugu

- [ ] Musteri → Teklif → Siparis → Is Emri → Sevkiyat → Fatura zinciri kopuksuz
- [ ] BOM 127 bilesen + 5 sarf = 132 satir — tumu girildi
- [ ] Seri numaralar (DE-AVK-2026-0001 → 0020) atandi ve izlenebilir
- [ ] Bilesen lot numaralari → kart seri numaralarina izlenebilirlik zinciri kuruldu
- [ ] NCR → Rework → Tekrar Test zinciri kayit altinda
- [ ] Stok hareketleri tutarli (giris, sarf, cikis miktarlari)

### 11.2 AS9100 Uyumluluk

- [ ] Contract Review notu (Adim 5) mevcut
- [ ] FAI AS9102 (3 form) tamamlandi (Adim 28)
- [ ] CoC olusturuldu (Adim 29)
- [ ] NCR kok neden analizi + onleyici/duzeltici faaliyet (Adim 27)
- [ ] Kalibrasyon ekipmanlari guncel (Bolum 0.4)
- [ ] Izlenebilirlik zinciri calistirildi (Adim 30)

### 11.3 IPC Uyumluluk

- [ ] IPC-A-610 Class 3 gorsel muayene yapildi (Adim 19)
- [ ] IPC J-STD-001 lehim gereksinimleri karsilandi (reflow + wave + el lehim)
- [ ] IPC-CC-830B conformal coating kalinlik kontrolu (Adim 25)
- [ ] IPC 7711/7721 rework proseduru uygulandi (Adim 21)
- [ ] IPC J-STD-033 MSD bilesen yonetimi yapildi (Adim 8)
- [ ] IPC sertifikali personel takibi mevcut (Bolum 0.5)

### 11.4 Savunma Sanayi Ozel

- [ ] ESD korumalı uretim alani kontrolu (Adim 10)
- [ ] Counterfeit bilesen kontrolu — GIDEP/ERAI (Adim 7)
- [ ] MSD floor life takibi (Adim 8)
- [ ] MIL-DTL-38999 konnektor ozel montaj (Adim 16)
- [ ] MIL-STD-883 referansi CoC'de mevcut (Adim 29)
- [ ] ESD korumalı paketleme (Adim 31)
- [ ] Obsolescence takibi (Adim 34)

### 11.5 Performans ve Workaround

- [ ] BOM 132 satir yukleme <3s (K10), 13 op routing sorunsuz, PDF ciktilari calisiyor
- [ ] Workaround K1-K10: Tum kisitlamalar icin not/dosya eki workaround'lari uygulandı mi?
  - K1(reflow profil→not), K2(AOI→ek), K3(MSD→lot notu), K4(counterfeit→kalite notu)
  - K5(ICT/FNK→muayene+ek), K6(SPI→not), K7(P&P→not), K8(X-ray→ek), K9(coating→muayene), K10(BOM→performans)

---

## BOLUM 12: TEST SONUC RAPORU SABLONU

> Tarih: ___ | Test Eden: ___ | Ortam: Quvex v___ / Chrome ___
> Toplam Adim: 34 | PASS: ___ | FAIL: ___ | BLOCKED: ___ | WORKAROUND: 10 (K1-K10)
> Performans: BOM(132 satir) ___ ms | Is Emri Routing ___ ms | Izlenebilirlik ___ ms
>
> **Oncelikli Iyilestirme:** (1) MSD floor life sayac (K3), (2) ICT/FNK cihaz entegrasyonu (K5), (3) AOI goruntu (K2), (4) Reflow profil (K1), (5) Counterfeit DB (K4)

---

## EK A: TERMINOLOJI SOZLUGU

| Kisaltma | Aciklama | Kisaltma | Aciklama |
|----------|----------|----------|----------|
| AOI | Otomatik Optik Muayene | MSD | Nem Hassas Bilesen |
| BGA | Ball Grid Array (IC paket) | NCR | Uygunsuzluk Raporu |
| BOM | Urun Agaci | PCB | Baski Devre Karti |
| CoC | Uygunluk Sertifikasi | SAC305 | Kurslunsuz lehim (Sn96.5/Ag3/Cu0.5) |
| ESD | Elektrostatik Desarj | SMD | Yuzey Montaj Bilesen |
| FAI | Ilk Parca Muayenesi (AS9102) | SPI | Lehim Pastasi Muayenesi |
| FR4 | PCB laminat malzemesi | TAL | Time Above Liquidus |
| HIC | Nem Gosterge Karti | THT | Delikten Gecme Teknolojisi |
| ICT | Devre Ici Test | ENIG | Nikel-Altin PCB kaplama |
| MBB | Nem Bariyerli Torba | NRND | Yeni tasarimda onerilmez |

---

> **Dokuman Bilgileri**
> Olusturma: 2026-04-10
> Versiyon: 1.0
> Hazirlayan: QA Muhendisligi
> Kapsam: HAVELSAN aviyonik kontrol karti montaji — 34 adim, 10 workaround, 127 bilesen BOM
> Ilgili Standartlar: AS9100 Rev D, IPC-A-610 Class 3, IPC J-STD-001, IPC-CC-830B, MIL-STD-883, IPC 7711/7721, IPC J-STD-033
