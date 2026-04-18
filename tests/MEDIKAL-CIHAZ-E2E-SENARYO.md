# Medikal Cihaz Imalati — Uctan Uca Test Senaryosu

> **Firma Profili:** MedTek Cerrahi Aletler San. Ltd.Sti. — 25 personel, 1 Swiss-type CNC torna, 1 5-eksen CNC freze, temiz oda (Class 7), pasivizasyon hatti, lazer markalama, ultrasonik yikama istasyonu
> **Sertifikalar:** ISO 13485:2016 (Medikal QMS), MDR 2017/745 (EU Medical Device Regulation), ISO 14971 (Risk Yonetimi), ISO 9001:2015
> **Musteriler:** Hastane gruplari, medikal distributorleri, ortopedi klinikleri
> **Urunler:** Ortopedik kemik vidasi (Ti-6Al-4V titanyum), cerrahi makas (AISI 420 paslanmaz celik), kemik plagi (titanyum)
> **Senaryo:** Anadolu Saglik Grubu'ndan gelen ortopedik kemik vidasi siparisi — hammadde tedariği, malzeme sertifikasi dogrulama, CNC islemeleri, pasivizasyon, temiz oda islemleri, lazer markalama (UDI), sterilizasyon (fason EtO), son muayene, lot bazli izlenebilirlik, RECALL senaryosu ve sevkiyata kadar tum surecleri kapsar

---

## BILINEN KISITLAMALAR (Quvex'te Henuz Mevcut Degil)

> Bu kisitlamalar test sirasinda ilgili adimlarda **not alanlarina** yazilacaktir.
> Test raporunda bu maddeler "WORKAROUND" olarak isaretlenecektir.

| # | Eksik Modul/Ozellik | Workaround |
|---|---------------------|------------|
| K1 | UDI (Unique Device Identification) veritabani entegrasyonu yok (EUDAMED/GUDID) | UDI kodu urun not alanina ve lazer markalama operasyonuna manuel yazilir |
| K2 | Sterilizasyon validasyon modulu yok (IQ/OQ/PQ) | Fason sterilizasyon siparisi + sertifika dosya eki olarak yuklenir |
| K3 | Biyouyumluluk test takibi yok (ISO 10993) | Dis lab test raporu dosya eki olarak yuklenir, kontrol planinda referans verilir |
| K4 | MDR teknik dosya sablonu yok (Annex II/III) | Not alanina MDR referans numarasi yazilir, teknik dosya PDF olarak yuklenir |
| K5 | ISO 14971 risk yonetimi matris modulu yok | Kontrol planinda risk seviyesi notu + risk dosyasi ek olarak yuklenir |
| K6 | Temiz oda ortam izleme (partikul sayaci) otomatik kayit yok | Operasyon notlarina partikul sayimi ve ortam sicaklik/nem degerleri yazilir |
| K7 | Pasivizasyon banyosu pH/konsantrasyon otomatik izleme yok | Operasyon notlarina pH, sicaklik, sure ve konsantrasyon degerleri yazilir |
| K8 | RECALL yonetim modulu (FSCA — Field Safety Corrective Action) yok | NCR + CAPA sureci ile RECALL izlenir, etkilenen lotlar not alaninda listelenir |
| K9 | Etiket tasarim modulu yok (MDR gereklilikleri: CE, UDI barcode, lot, uretici) | Etiket sablonu PDF olarak yuklenir, kontrol listesinde dogrulanir |
| K10 | Sterilite test (biyolojik indikatoru) kayit alani yok | Sterilizasyon sertifikasi icinde BI sonucu kontrolu, not alanina yazilir |

---

## BOLUM 0: SISTEM KURULUMU (Tek Seferlik)

### 0.1 Makine / Ekipman Tanimlari
**Ekran:** Ayarlar > Makineler (`/settings/machines`)
**API:** `POST /machines`

| Makine Kodu | Makine Adi | Marka/Model | Yil | Saat Ucreti | Setup Ucreti |
|-------------|------------|-------------|-----|-------------|--------------|
| SWT-01 | Swiss-Type CNC Torna | Tornos SwissNano 7 | 2022 | 1400 TL/saat | 500 TL/saat |
| CNC5-01 | 5-Eksen CNC Freze | DMG Mori DMU 50 | 2021 | 1600 TL/saat | 600 TL/saat |
| TMB-01 | Tumbling / Capak Alma | Rosler R 220 EC | 2020 | 200 TL/saat | 50 TL/saat |
| PAS-01 | Pasivizasyon Hatti (Sitrik Asit) | Ozel Yapim — 6 Tankli | 2021 | 300 TL/saat | 100 TL/saat |
| ULT-01 | Ultrasonik Yikama Istasyonu (Temiz Oda) | Branson 8510R | 2022 | 250 TL/saat | 50 TL/saat |
| LZR-01 | Lazer Markalama Makinesi | FOBA M3000 | 2023 | 400 TL/saat | 150 TL/saat |
| CMM-01 | Koordinat Olcum Makinesi (CMM) | Zeiss Contura | 2021 | 500 TL/saat | 200 TL/saat |
| OPT-01 | Optik Profil Projektoru | Nikon V-24B | 2020 | 300 TL/saat | 100 TL/saat |
| SEL-01 | Paket Seal Makinesi (Tyvek) | Hawo HD 680 DE-V | 2022 | 150 TL/saat | 30 TL/saat |

**Dogrulama:**
- [ ] 9 makine/ekipman basariyla tanimlandi
- [ ] Saat ucretleri ve setup ucretleri girildi
- [ ] Swiss CNC ve 5-eksen CNC en yuksek saat ucretli makineler
- [ ] Temiz oda ekipmanlari (ULT-01, SEL-01) tanimlandi

### 0.2 Is Emri Adimlari (Operasyon Tanimlari — Medikal Implant Sureci)
**Ekran:** Ayarlar > Is Emri Adimlari (`/settings/work-order-steps`)
**API:** `POST /workordersteps`

| Kod | Operasyon Adi | Vars. Makine | Setup (dk) | Beceri |
|-----|--------------|-------------|------------|--------|
| OP10 | Swiss CNC Torna (Vida Profili + Bas Sekillendirme) | SWT-01 | 45 | 4 (Uzman — Medikal CNC) |
| OP20 | CNC Freze (Hex Soket Isleme) | CNC5-01 | 30 | 3 (Usta) |
| OP30 | Capak Alma (Tumbling) | TMB-01 | 10 | 2 (Kalfa) |
| OP40 | Pasivizasyon (ASTM A967, Sitrik Asit) | PAS-01 | 15 | 3 (Usta) |
| OP50 | Temiz Oda Yikama (Ultrasonik) | ULT-01 | 10 | 2 (Kalfa) |
| OP60 | Gorsel Muayene (10x Buyutec, Temiz Oda) | — | 15 | 4 (Uzman — QC Sertifikali) |
| OP70 | Boyutsal Kontrol (CMM + Optik) | CMM-01 | 20 | 4 (Uzman — CMM Operatoru) |
| OP80 | Lazer Markalama (UDI + Lot No + Uretici) | LZR-01 | 15 | 3 (Usta) |
| OP90 | Sterilizasyon Paketleme (Tyvek Poset + Seal) | SEL-01 | 10 | 2 (Kalfa) |
| OP100 | EtO Sterilizasyon (Fason) | — | — | — (Fason) |

**Dogrulama:**
- [ ] 10 operasyon adimi tanimlandi
- [ ] Operasyon sirasi medikal implant uretim akisini dogru yansitiyor (torna→freze→capak→pasivizasyon→yikama→muayene→olcum→markalama→paketleme→sterilizasyon)
- [ ] Temiz oda operasyonlari (OP50, OP60) arka arkaya
- [ ] Fason operasyon (OP100 — EtO sterilizasyon) icin makine atanmadi
- [ ] Beceri seviyeleri medikal sertifika gereksinimlerine gore atandi

### 0.3 Genel Gider Yapilandirmasi
**Ekran:** Uretim > Maliyet Analizi (`/production/part-cost`)
**API:** `POST /partcost/overheads`

| Ad | Yuzde | Gecerlilik |
|----|-------|------------|
| Genel Imalat Giderleri | %15 | 2026-01-01 → — |
| Temiz Oda Isletme (HEPA, Iklimlendirme) | %8 | 2026-01-01 → — |
| Amortisman (Swiss CNC + 5-Eksen) | %14 | 2026-01-01 → — |
| Enerji | %5 | 2026-01-01 → — |
| Kalibrasyon + Validasyon | %4 | 2026-01-01 → — |

**Dogrulama:**
- [ ] 5 genel gider kalemi tanimlandi (%46 toplam overhead)
- [ ] Temiz oda isletme gideri ayri kalem olarak takip ediliyor
- [ ] Kalibrasyon + validasyon gideri medikal sektore ozgu olarak eklendi

### 0.4 Kalibrasyon Ekipmanlari
**Ekran:** Kalite > Kalibrasyon (`/quality/calibration`)
**API:** `POST /calibration/equipment`

| Kod | Ekipman | Marka/Model | Dogruluk | Frekans | Son Kalibrasyon | Sonraki |
|-----|---------|-------------|----------|---------|-----------------|---------|
| MIK-001 | Dis Mikrometre 0-25mm | Mitutoyo 293-240 | 0.001mm | Yillik | 2026-01-15 | 2027-01-15 |
| MIK-002 | Dis Mikrometre 25-50mm | Mitutoyo 293-241 | 0.001mm | Yillik | 2026-01-15 | 2027-01-15 |
| KAL-001 | Dijital Kumpas 0-150mm | Mitutoyo 500-196 | 0.01mm | 6 Aylik | 2026-02-01 | 2026-08-01 |
| YUZ-001 | Yuzey Puruzluluk Olcumu | Mitutoyo SJ-410 | Ra 0.01 um | 6 Aylik | 2026-02-01 | 2026-08-01 |
| SRT-001 | Mikro Sertlik Olcumu (Vickers) | Shimadzu HMV-G21 | HV ±%2 | Yillik | 2026-01-15 | 2027-01-15 |
| PH-001 | pH Metre (Pasivizasyon Banyosu) | Mettler Toledo SevenExcellence | ±0.01 pH | 3 Aylik | 2026-03-01 | 2026-06-01 |
| TEMP-001 | Sicaklik Datalogger (Temiz Oda) | Vaisala HMT330 | ±0.1°C / ±%1 RH | 6 Aylik | 2026-02-01 | 2026-08-01 |
| PRT-001 | Partikul Sayaci (Temiz Oda) | Lighthouse 3016-IAQ | 0.3-10 um | Yillik | 2026-01-15 | 2027-01-15 |
| TRK-001 | Tork Olcumu (Vida Baglanti) | Tohnichi BTG-I | ±%1 Ncm | 6 Aylik | 2026-03-01 | 2026-09-01 |
| PIN-001 | Pin Gauge Seti (Go/NoGo) | Ojiyas 0.10-10.00mm | Class Z | Yillik | 2026-01-15 | 2027-01-15 |
| BYT-001 | 10x/20x Buyutec (Muayene) | Olympus SZX7 | 10x-45x | 2 Yillik | 2025-06-01 | 2027-06-01 |

**Dogrulama:**
- [ ] 11 kalibrasyon ekipmani tanimlandi (olcum + proses + temiz oda)
- [ ] Temiz oda spesifik ekipmanlar (TEMP-001, PRT-001) dahil
- [ ] Pasivizasyon banyosu pH olcumu (PH-001) dahil
- [ ] Kalibrasyon tarihleri ve frekanslari girildi
- [ ] Dashboard'da uyumluluk % gorunuyor

### 0.5 Personel Sertifika Takibi (WORKAROUND — Kalibrasyon Modulu)
**Ekran:** Kalite > Kalibrasyon (`/quality/calibration`)
**API:** `POST /calibration/equipment`

> **NOT:** Quvex'te personel sertifika modulu bulunmadigi icin, kalibrasyon modulunde
> "ekipman" olarak personel sertifikalari takip edilir.

| Kod | "Ekipman" (Personel) | Sertifika | Kapsam | Frekans | Son Yenileme | Sonraki |
|-----|----------------------|-----------|--------|---------|--------------|---------|
| PRS-001 | Emre Yilmaz — Swiss CNC Operatoru | ISO 13485 QMS Egitimi | Medikal CNC Isleme, GD&T | 2 Yillik | 2025-09-01 | 2027-09-01 |
| PRS-002 | Zeynep Kara — Kalite Muayene | ISO 13485 Internal Auditor | Giris + Proses + Son Muayene | 3 Yillik | 2025-06-15 | 2028-06-15 |
| PRS-003 | Burak Celik — CMM Operatoru | CMM Operatoru Seviye 2 | Boyutsal Olcum + GD&T + SPC | 2 Yillik | 2025-11-01 | 2027-11-01 |
| PRS-004 | Ayse Demir — Temiz Oda Operatoru | Temiz Oda Calisma Sertifikasi | Class 7 Protokol, Ultrasonik Yikama | 2 Yillik | 2026-01-15 | 2028-01-15 |
| PRS-005 | Murat Ozturk — Pasivizasyon Operatoru | ASTM A967 Proses Egitimi | Pasivizasyon + Kimyasal Islem | 2 Yillik | 2025-08-01 | 2027-08-01 |

**Dogrulama:**
- [ ] 5 sertifikali personel tanimlandi
- [ ] Sertifika turleri (ISO 13485, CMM, Temiz Oda, ASTM A967) dogru girildi
- [ ] Yenileme tarihleri gelecek tarihlere ayarlandi (suresi dolmamis)

---

## BOLUM 1: MUSTERI VE URUN TANIMLARI

### Adim 1 — Musteri Kaydi: Anadolu Saglik Grubu
**Ekran:** Musteriler (`/customers`)
**API:** `POST /customer`
**Rol:** Satis Muduru

```
Firma Adi: Anadolu Saglik Grubu A.S.
Yetkili: Dr. Hakan Yildiz (Ortopedi Bolumu Satin Alma Koordinatoru)
Email: hakan.yildiz@anadolusaglik.com.tr
Telefon: +90 216 444 0 555
Adres: Cumhuriyet Mah. Saglik Blv. No:42, 34846 Maltepe/Istanbul
Vergi No: 9876543210 | Vergi Dairesi: Maltepe
Kategori: A (Stratejik Musteri)
Doviz: TRY
Odeme Vadesi: 45 gun
Not: ISO 13485 onayina tabi tedarikci, yillik tedarikci denetimi zorunlu. 
     MDR 2017/745 kapsaminda izlenebilirlik zorunlulugu var.
```

**Dogrulama:**
- [ ] Musteri karti basariyla olusturuldu
- [ ] Not alaninda ISO 13485 + MDR referansi yazili
- [ ] Musteri listesinde gorunuyor, kategorisi A

### Adim 2 — Musteri Adres ve Iletisim
**Ekran:** Musteriler > Adresler (`/customers/{id}/addresses`)
**API:** `POST /customer/{id}/addresses`

| Adres Tipi | Adres | Ilgili |
|------------|-------|--------|
| Fatura | Cumhuriyet Mah. Saglik Blv. No:42, Maltepe/Istanbul | Muhasebe Birimi |
| Sevkiyat — Hastane 1 | Anadolu Saglik Merkezi, Gebze/Kocaeli | Dr. Mehmet Ergin (Ortopedi) |
| Sevkiyat — Hastane 2 | Anadolu Saglik Merkezi, Atasehir/Istanbul | Dr. Selin Aydin (Ortopedi) |

**Dogrulama:**
- [ ] 3 adres (1 fatura + 2 sevkiyat) basariyla tanimlandi
- [ ] Her adres tipi dogru secildi
- [ ] Sevkiyat adresleri farkli hastanelere isaret ediyor

### Adim 3 — Urun Tanimi: Ortopedik Kemik Vidasi
**Ekran:** Urunler (`/products`)
**API:** `POST /product`
**Rol:** Uretim Muduru

```
Urun Kodu: MED-BV-4535-TI
Urun Adi: Ortopedik Kemik Vidasi — Ti-6Al-4V, Ø4.5×35mm, Self-Tapping
Kategori: Medikal Implant — Class IIb (MDR)
Birim: Adet
Malzeme: Ti-6Al-4V (Grade 5 Titanyum) — ASTM F136
Tolerans: Dis profil ±0.02mm, Bas geometrisi ±0.05mm
Yuzey: Ra < 0.4 um (pasivize)
Agirlik: ~3.2 gram
Not: UDI-DI: (01)08699999000012 (GTIN-14 formati)
     MDR Sinifi: Class IIb — implant edilebilir cihaz
     Risk Sinifi: ISO 14971 uyarinca YUKSEK risk (implant)
     ASTM F136 zorunlu — ASTM F67 (CP Ti) KABUL EDILMEZ
```

**Dogrulama:**
- [ ] Urun basariyla tanimlandi, urun kodu unik
- [ ] Not alaninda UDI-DI, MDR sinifi ve risk sinifi bilgileri var (K1, K4, K5)
- [ ] ASTM F136 malzeme spesifikasyonu acikca belirtildi
- [ ] Tolerans ve yuzey puruzluluk degerleri yazildi

### Adim 4 — BOM (Bill of Materials)
**Ekran:** Urunler > BOM (`/products/{id}/bom`)
**API:** `POST /product/{id}/bom`
**Rol:** Uretim Muduru

| # | Kalem | Kod | Miktar | Birim | Birim Fiyat | Aciklama |
|---|-------|-----|--------|-------|-------------|----------|
| 1 | Ti-6Al-4V Cubuk Ø6×50mm (ASTM F136) | HAM-TI6AL4V-06 | 1 | Adet | 85.00 TRY | Ana hammadde, sertifikali |
| 2 | Tyvek Sterilizasyon Poseti (100×200mm) | PKT-TYV-100 | 1 | Adet | 3.50 TRY | DuPont Tyvek 1073B |
| 3 | Sterilizasyon Indikatoru (EtO) | PKT-IND-ETO | 1 | Adet | 1.20 TRY | Kimyasal indikatoru |
| 4 | UDI Etiket (Barcode + Okunabilir) | ETK-UDI-45 | 1 | Adet | 0.80 TRY | MDR uyumlu etiket |
| 5 | Sitrik Asit Cozeltisi (%10) | KIM-SIT-10 | 0.005 | Litre | 120.00 TRY/lt | Pasivizasyon — ASTM A967 |
| 6 | Ultrasonik Yikama Sivisi (Enzimatik) | KIM-ULT-ENZ | 0.002 | Litre | 250.00 TRY/lt | Temiz oda yikama |
| 7 | EtO Sterilizasyon (Fason) | FSN-ETO-001 | 1 | Adet | 15.00 TRY | Fason proses — Medsteril Ltd. |

**Dogrulama:**
- [ ] 7 BOM kalemi basariyla eklendi
- [ ] Hammadde (Ti-6Al-4V) en yuksek maliyetli kalem
- [ ] Fason sterilizasyon (FSN-ETO-001) ayri BOM kalemi olarak tanimlandi
- [ ] Kimyasal malzemeler (sitrik asit, yikama sivisi) hacimsel birimle girildi
- [ ] Toplam malzeme maliyeti hesaplandi (~107 TRY)

### Adim 5 — Kontrol Plani (Risk Analizi Referansi ile)
**Ekran:** Kalite > Kontrol Plani (`/quality/control-plans`)
**API:** `POST /controlplans`
**Rol:** Kalite Muduru

```
Plan Adi: MED-BV-4535-TI — Ortopedik Vida Kontrol Plani
Urun: MED-BV-4535-TI
Standart: ISO 13485:2016 + ASTM F136
Risk Referansi: ISO 14971 Risk Dosyasi Ref# RA-2026-012 (K5 — dosya eki olarak yuklenir)
```

| Kontrol Noktasi | Parametre | Tolerans | Yontem | Frekans | Sorumlu |
|-----------------|-----------|----------|--------|---------|---------|
| Hammadde Giris | Kimyasal kompozisyon (MTR) | ASTM F136 limitleri | Sertifika dogrulama | Her lot | QC |
| Hammadde Giris | Mekanik ozellikler (MTR) | UTS ≥860 MPa, Akma ≥795 MPa | Sertifika dogrulama | Her lot | QC |
| Hammadde Giris | Cubuk capi | Ø6.00 ±0.05mm | Mikrometre | Her cubuk | QC |
| OP10 Torna | Vida dis profili | M4.5×0.8 — ISO 5835 uyumlu | Optik profil | %100 | Operator + QC |
| OP10 Torna | Bas capi | Ø8.00 ±0.05mm | Mikrometre | %100 | Operator |
| OP10 Torna | Toplam boy | 35.00 ±0.10mm | Kumpas | %100 | Operator |
| OP20 Freze | Hex soket derinlik | 3.50 ±0.05mm | Pin gauge | %100 | Operator |
| OP40 Pasivizasyon | Banyo pH | 2.5-3.5 | pH metre | Her sarz | Operator |
| OP40 Pasivizasyon | Banyo sicakligi | 55 ±5°C | Termometre | Her sarz | Operator |
| OP40 Pasivizasyon | Bekleme suresi | 30 ±2 dk | Kronometre | Her sarz | Operator |
| OP60 Gorsel | Yuzey kusuru | Catlak/capak/cizik YOK | 10x buyutec | %100 | QC |
| OP60 Gorsel | Self-tapping ucunun butunlugu | Kirilma/deformasyon YOK | 10x buyutec | %100 | QC |
| OP70 Boyutsal | Dis profili — tam geometri | ISO 5835 uygunluk | CMM (3D tarama) | AQL 1.0 (n=32) | QC |
| OP70 Boyutsal | Yuzey puruzlulugu | Ra < 0.4 um | Profilometre | AQL 1.0 | QC |
| OP80 Markalama | UDI kodu okunabilirlik | ISO/IEC 16022 (Data Matrix) | Barkod okuyucu | %100 | Operator |
| OP80 Markalama | Markalama derinligi | 20-50 um (malzemeye zarar vermez) | Profilometre | Ilk parca + AQL | QC |
| OP90 Paketleme | Seal butunlugu | Peel testi ≥1.5 N/15mm | Peel tester | AQL 2.5 | QC |
| OP100 Sterilizasyon | SAL (Sterility Assurance Level) | SAL 10^-6 | BI (biyolojik indikatoru) | Her sarz | Fason + QC |

**Dogrulama:**
- [ ] 18 kontrol noktasi tanimlandi
- [ ] ISO 14971 risk referansi not alaninda (K5)
- [ ] %100 muayene (implant — kritik olculer) ve AQL bazli kontrol karisimi uygun
- [ ] Pasivizasyon proses parametreleri (pH, sicaklik, sure) kontrol altinda
- [ ] Sterilizasyon SAL 10^-6 kriteri tanimli

---

## BOLUM 2: TEKLIF VE SIPARIS

### Adim 6 — Teklif Hazirlama
**Ekran:** Teklifler (`/offers`)
**API:** `POST /offer`
**Rol:** Satis Muduru

```
Musteri: Anadolu Saglik Grubu A.S.
Teklif No: TKF-2026-0089
Tarih: 2026-04-15
Gecerlilik: 30 gun
Doviz: TRY
Odeme: 45 gun vade
Teslimat: 8 hafta (sterilizasyon dahil)
```

| # | Urun | Miktar | Birim Fiyat | Toplam |
|---|------|--------|-------------|--------|
| 1 | MED-BV-4535-TI — Ortopedik Kemik Vidasi Ø4.5×35mm | 500 | 380.00 TRY | 190,000.00 TRY |

```
Notlar:
- Fiyata EtO sterilizasyon dahildir
- Lot bazli izlenebilirlik paketi (malzeme sertifikasi + CoC + sterilizasyon sertifikasi) dahildir
- MDR 2017/745 uyumlu UDI markalama dahildir
- ISO 13485 uyumlu uretim sureci
- FAI (First Article Inspection) ilk 3 parca icin uygulanacak
- ASTM F136 sertifikali hammadde kullanilacak
```

**Dogrulama:**
- [ ] Teklif basariyla olusturuldu
- [ ] Birim fiyat ve toplam tutar dogru (500 × 380 = 190,000 TRY)
- [ ] Teslimat suresi 8 hafta (sterilizasyon fason suresi dahil)
- [ ] Not alaninda medikal spesifik bilgiler yazili (UDI, MDR, ISO 13485, FAI)

### Adim 7 — Contract Review (Sozlesme Incelemesi)
**Ekran:** Teklifler > Contract Review (`/offers/{id}/contract-review`)
**API:** `POST /offer/{id}/contract-review`
**Rol:** Kalite Muduru

| Kriter | Deger | Sonuc |
|--------|-------|-------|
| Teknik Yeterlilik | Ti-6Al-4V CNC isleme kapasitesi VAR | UYGUN |
| Makine Yeterliligi | Swiss CNC + 5-Eksen CNC + CMM MEVCUT | UYGUN |
| Kalite Sistem | ISO 13485:2016 gecerli | UYGUN |
| Malzeme Temini | Ti-6Al-4V ASTM F136 tedarikci mevcut | UYGUN |
| Fason Surec | EtO sterilizasyon — Medsteril Ltd. sozlesmesi aktif | UYGUN |
| Kapasite | 500 adet / 8 hafta = 12.5 adet/gun — UYGUN | UYGUN |
| Risk Seviyesi | YUKSEK (Class IIb implant, MDR kapsaminda) | YUKSEK |

```
Not: YUKSEK risk — implant urun. Tum retler %100 kayit altinda olacak.
     ISO 14971 risk dosyasi (RA-2026-012) guncellendi.
     Musteri denetim hakki saklıdır (yillik tedarikci denetimi).
```

**Dogrulama:**
- [ ] Contract review tamamlandi, 7 kriter degerlendi
- [ ] Risk seviyesi YUKSEK olarak isaretlendi (implant urun)
- [ ] ISO 14971 referansi var
- [ ] Musteri denetim hakki notu eklendi

### Adim 8 — Tekliften Siparise Donusum
**Ekran:** Teklifler > Siparise Donustur
**API:** `POST /offer/{id}/convert-to-order`
**Rol:** Satis Muduru

```
Siparis No: SIP-2026-0067
PO Referansi: ASG-PO-2026-4412 (Anadolu Saglik PO numarasi)
Miktar: 500 adet
Teslim Tarihi: 2026-06-10
Sevkiyat Adresi: Anadolu Saglik Merkezi, Gebze/Kocaeli (Hastane 1 — 300 adet)
                 Anadolu Saglik Merkezi, Atasehir/Istanbul (Hastane 2 — 200 adet)
```

**Dogrulama:**
- [ ] Siparis basariyla olusturuldu
- [ ] Teklif bilgileri siparise dogru aktarildi (fiyat, miktar, notlar)
- [ ] PO referansi eslesmesi var (ASG-PO-2026-4412)
- [ ] Iki farkli sevkiyat adresi tanimli (300 + 200 = 500)
- [ ] Teslim tarihi 2026-06-10

---

## BOLUM 3: HAMMADDE TEDARIQI VE MAL KABUL

### Adim 9 — Satinalma Siparisi: Ti-6Al-4V Cubuk
**Ekran:** Satinalma (`/purchasing`)
**API:** `POST /purchaseorder`
**Rol:** Satinalma Sorumlusu

```
Tedarikci: TitanMetal Endustriyel A.S.
PO No: SAT-2026-0134
Malzeme: Ti-6Al-4V Cubuk Ø6×1000mm (ASTM F136 — Medikal Grade)
Miktar: 30 cubuk (her cubuktan ~18 vida kesilir, 30×18=540 > 500+fire)
Birim Fiyat: 1,700.00 TRY / cubuk
Toplam: 51,000.00 TRY
Teslim: 2026-04-25
```

```
Ozel Kosullar:
- ASTM F136 sertifika ZORUNLU (heat no bazli)
- Kimyasal analiz raporu (Al, V, Fe, O, N, C, H sinirlari)
- Mekanik test raporu (cekme, akma, uzama, yorulma)
- Ultrasonik muayene (cubuk ic kusur) raporu
- Her cubuk bireysel lot numarali
- Malzeme ASTM F67 (CP Ti) KABUL EDILMEZ
```

**Dogrulama:**
- [ ] Satinalma siparisi olusturuldu
- [ ] ASTM F136 ozel kosul acikca yazildi
- [ ] Miktar hesabi dogru (30 cubuk → ~540 vida kapasitesi > 500 + fire payi)
- [ ] Sertifika gereksinimleri detayli listelendi (kimyasal, mekanik, ultrasonik)

### Adim 10 — Mal Kabul ve Malzeme Sertifikasi Dogrulama
**Ekran:** Mal Kabul (`/receiving`)
**API:** `POST /receiving`
**Rol:** Kalite Muduru

```
Irsaliye No: TM-IRS-2026-0891
Teslim Alan: Depo Sorumlusu
Teslim Tarihi: 2026-04-25
Gelen Miktar: 30 cubuk
Heat No: HT-2026-TI-0456
Lot No: TM-LOT-2026-0891
```

**Malzeme Sertifikasi (MTR) Dogrulama — Kimyasal Kompozisyon:**

| Element | ASTM F136 Min | ASTM F136 Max | Sertifika Degeri | Sonuc |
|---------|---------------|---------------|------------------|-------|
| Al (Aluminyum) | 5.50% | 6.75% | 6.12% | UYGUN |
| V (Vanadyum) | 3.50% | 4.50% | 4.05% | UYGUN |
| Fe (Demir) | — | 0.30% | 0.18% | UYGUN |
| O (Oksijen) | — | 0.13% | 0.11% | UYGUN |
| N (Azot) | — | 0.05% | 0.012% | UYGUN |
| C (Karbon) | — | 0.08% | 0.025% | UYGUN |
| H (Hidrojen) | — | 0.012% | 0.004% | UYGUN |
| Ti (Titanyum) | Kalan | — | Kalan | UYGUN |

**Malzeme Sertifikasi (MTR) Dogrulama — Mekanik Ozellikler:**

| Ozellik | ASTM F136 Min | Sertifika Degeri | Sonuc |
|---------|---------------|------------------|-------|
| Cekme Dayanimi (UTS) | 860 MPa | 945 MPa | UYGUN |
| Akma Dayanimi (0.2%) | 795 MPa | 880 MPa | UYGUN |
| Uzama (%) | 10% | 14% | UYGUN |
| Kesit Daralma (%) | 25% | 36% | UYGUN |

**Dogrulama:**
- [ ] Mal kabul kaydi olusturuldu
- [ ] 8 kimyasal element ASTM F136 limitleri icinde — tumu UYGUN
- [ ] 4 mekanik ozellik ASTM F136 limitlerinin uzerinde — tumu UYGUN
- [ ] Heat no (HT-2026-TI-0456) ve lot no (TM-LOT-2026-0891) kaydedildi
- [ ] MTR PDF dosya eki yuklendi

### Adim 11 — Giris Kalite Kontrolu
**Ekran:** Kalite > Muayene (`/quality/inspections`)
**API:** `POST /inspections`
**Rol:** Kalite Muduru

**Numune Secimi:** 5 cubuk (30'dan rastgele — AQL Level II)

| # | Cubuk No | Cap (Ø6.00 ±0.05mm) | Yuzey (Cizik/Carpi) | Sertlik (HRC 33-39) | Sonuc |
|---|----------|----------------------|----------------------|---------------------|-------|
| 1 | C-001 | 6.02mm | Temiz | 35 HRC | KABUL |
| 2 | C-008 | 5.98mm | Temiz | 36 HRC | KABUL |
| 3 | C-015 | 6.01mm | Temiz | 35 HRC | KABUL |
| 4 | C-022 | 6.03mm | Temiz | 37 HRC | KABUL |
| 5 | C-029 | 5.99mm | Temiz | 36 HRC | KABUL |

**Sonuc:** 5/5 KABUL — Lot KABUL edildi.

**Dogrulama:**
- [ ] 5 numune olcumu girildi
- [ ] Cap, yuzey ve sertlik parametreleri olculdu
- [ ] Tum numuneler tolerans icinde — lot KABUL
- [ ] Muayene kaydi mal kabul ile iliskilendirildi
- [ ] Malzeme uretime serbest birakildi

---

## BOLUM 4: URETIM (IS EMRI VE OPERASYONLAR)

### Adim 12 — Is Emri Olusturma
**Ekran:** Uretim > Is Emirleri (`/production/work-orders`)
**API:** `POST /workorders`
**Rol:** Uretim Muduru

```
Is Emri No: IE-2026-0089
Urun: MED-BV-4535-TI — Ortopedik Kemik Vidasi Ø4.5×35mm
Siparis Ref: SIP-2026-0067
Miktar: 520 adet (500 siparis + %4 fire payi)
Hammadde: Ti-6Al-4V Cubuk Ø6×50mm — Lot: TM-LOT-2026-0891 / Heat: HT-2026-TI-0456
Baslangic: 2026-04-28
Bitis (Planlanan): 2026-05-23 (sterilizasyon oncesi)
```

**Operasyon Routing:**

| Sira | Operasyon | Makine | Plan. Sure/Parca | Operasyon Toplam | Operator |
|------|-----------|--------|-------------------|------------------|----------|
| OP10 | Swiss CNC Torna | SWT-01 | 4.5 dk | 39 saat | Emre Yilmaz |
| OP20 | CNC Freze (Hex Soket) | CNC5-01 | 2.0 dk | 17.3 saat | CNC Operatoru |
| OP30 | Capak Alma (Tumbling) | TMB-01 | 0.5 dk (batch 50) | 5.2 saat | Kalfa |
| OP40 | Pasivizasyon | PAS-01 | 1.0 dk (batch 100) | 5.2 saat | Murat Ozturk |
| OP50 | Ultrasonik Yikama | ULT-01 | 0.5 dk (batch 50) | 5.2 saat | Ayse Demir |
| OP60 | Gorsel Muayene (Temiz Oda) | — | 1.5 dk | 13 saat | Zeynep Kara |
| OP70 | Boyutsal Kontrol (CMM) | CMM-01 | 3.0 dk (AQL n=32+kritik %100) | 26 saat | Burak Celik |
| OP80 | Lazer Markalama | LZR-01 | 1.0 dk | 8.7 saat | Operator |
| OP90 | Sterilizasyon Paketleme | SEL-01 | 0.5 dk | 4.3 saat | Ayse Demir |
| OP100 | EtO Sterilizasyon (Fason) | — (Fason) | — | 5 is gunu | Medsteril Ltd. |

**Dogrulama:**
- [ ] Is emri basariyla olusturuldu
- [ ] 10 operasyon dogru sirayla routing'de gorunuyor
- [ ] Hammadde lot/heat numarasi is emri ile iliskilendirildi
- [ ] Fire payi (%4) dahil — 520 adet planlandi
- [ ] Fason operasyon (OP100) is takviminde 5 is gunu olarak planlandi
- [ ] Her operasyona uygun operator/sorumlu atandi

### Adim 13 — OP10: Swiss CNC Torna (Vida Profili + Bas Sekillendirme)
**Ekran:** ShopFloor Terminali (`/shopfloor`)
**API:** `POST /shopfloor/start-operation`
**Rol:** Operator (Emre Yilmaz)

```
Operasyon: OP10 — Swiss CNC Torna
Makine: SWT-01 (Tornos SwissNano 7)
Program No: PRG-BV4535-01
Baslangic: 2026-04-28 08:00
Setup Suresi: 45 dk
Parca Suresi: 4.5 dk/adet
CNC Parametreleri:
  - Devir: 4000 RPM (vida profili), 6000 RPM (bas sekillendirme)
  - Ilerleme: 0.08 mm/dev (dis acma), 0.05 mm/dev (finisaj)
  - Kesme Sivisi: Tam sentetik, medikal grade (yag bazli DEGIL)
  - Takim: Vida dis acma insert + form takim (bas)
```

**Ilk Parca Kontrolu (Setup Dogrulama):**

| Olcu | Nominal | Tolerans | Olculen | Sonuc |
|------|---------|----------|---------|-------|
| Dis profili (major dia) | 4.50mm | ±0.02mm | 4.51mm | UYGUN |
| Dis profili (minor dia) | 3.18mm | ±0.02mm | 3.19mm | UYGUN |
| Dis hatve | 0.80mm | ±0.01mm | 0.80mm | UYGUN |
| Bas capi | 8.00mm | ±0.05mm | 8.02mm | UYGUN |
| Toplam boy | 35.00mm | ±0.10mm | 35.04mm | UYGUN |
| Self-tapping ucu | Gorsel OK | — | Temiz, capaksiz | UYGUN |

**Dogrulama:**
- [ ] OP10 ShopFloor'dan baslatildi
- [ ] Makine, program ve parametreler girildi
- [ ] Ilk parca kontrolu 6 parametre — tumu UYGUN
- [ ] Seri uretim onaylandi
- [ ] Kesme sivisi notu (medikal grade sentetik) yazildi

### Adim 14 — OP20: CNC Freze (Hex Soket)
**Ekran:** ShopFloor Terminali (`/shopfloor`)
**API:** `POST /shopfloor/start-operation`
**Rol:** Operator

```
Operasyon: OP20 — CNC Freze (Hex Soket)
Makine: CNC5-01 (DMG Mori DMU 50)
Program No: PRG-BV4535-02
Parca Suresi: 2.0 dk/adet
Ilerleme: 0.04 mm/dev (hassas isleme)
```

**Ilk Parca Kontrolu:**

| Olcu | Nominal | Tolerans | Olculen | Sonuc |
|------|---------|----------|---------|-------|
| Hex soket genislik (AF) | 3.50mm | ±0.03mm | 3.52mm | UYGUN |
| Hex soket derinlik | 3.50mm | ±0.05mm | 3.48mm | UYGUN |
| Hex duz yuzey (//lik) | — | 0.02mm | 0.01mm | UYGUN |

**Dogrulama:**
- [ ] OP20 baslatildi ve ilk parca kontrolu yapildi
- [ ] 3 parametre UYGUN
- [ ] Seri uretime gecildi

### Adim 15 — OP30: Capak Alma (Tumbling)
**Ekran:** ShopFloor Terminali (`/shopfloor`)
**API:** `POST /shopfloor/start-operation`
**Rol:** Operator

```
Operasyon: OP30 — Capak Alma
Makine: TMB-01 (Rosler R 220 EC)
Batch Boyutu: 50 adet/batch
Medya: Seramik — hassas parcalar icin (agresif DEGIL)
Sure: 15 dk / batch
Devir: 25 RPM
Not: Ti-6Al-4V icin seramik medya kullanilir. Celik medya kirlenme riski!
```

**Dogrulama:**
- [ ] OP30 baslatildi
- [ ] Batch boyutu ve medya tipi notu girildi
- [ ] Seramik medya secimi notu (celik medya yasak — kirlenme) yazildi
- [ ] Her batch icin sure ve devir parametreleri kaydedildi

### Adim 16 — OP40: Pasivizasyon (ASTM A967 — Sitrik Asit)
**Ekran:** ShopFloor Terminali (`/shopfloor`)
**API:** `POST /shopfloor/start-operation`
**Rol:** Operator (Murat Ozturk)

```
Operasyon: OP40 — Pasivizasyon
Makine: PAS-01 (Pasivizasyon Hatti)
Batch Boyutu: 100 adet/batch
Standart: ASTM A967 — Citric Acid Method
```

**Proses Parametreleri (K7 — manuel kayit):**

| Parametre | Spec | Olculen (Batch 1) | Sonuc |
|-----------|------|--------------------|-------|
| Sitrik asit konsantrasyonu | %8-12 | %10.2 | UYGUN |
| Banyo sicakligi | 50-60°C | 56°C | UYGUN |
| Batirilma suresi | 28-32 dk | 30 dk | UYGUN |
| Banyo pH | 2.0-4.0 | 2.8 | UYGUN |
| Durulama | DI Water (18 MΩ) | 18.2 MΩ | UYGUN |
| Kurutma | Sicak hava 60°C | 62°C | UYGUN |

**Dogrulama:**
- [ ] OP40 baslatildi, ASTM A967 referansi yazildi
- [ ] 6 proses parametresi manuel olarak kaydedildi (K7)
- [ ] DI water kalitesi notu girildi (18 MΩ — ultra saf su)
- [ ] Her batch icin ayri kayit olusturuldu

### Adim 17 — OP50: Temiz Oda Yikama (Ultrasonik)
**Ekran:** ShopFloor Terminali (`/shopfloor`)
**API:** `POST /shopfloor/start-operation`
**Rol:** Operator (Ayse Demir)

```
Operasyon: OP50 — Ultrasonik Yikama
Makine: ULT-01 (Branson 8510R)
Temiz Oda: Class 7 (ISO 14644-1)
Batch Boyutu: 50 adet
```

**Proses Parametreleri (K6 — temiz oda kaydi):**

| Parametre | Spec | Olculen | Sonuc |
|-----------|------|---------|-------|
| Ultrasonik frekans | 40 kHz | 40 kHz | UYGUN |
| Yikama suresi | 10 dk | 10 dk | UYGUN |
| Yikama sivisi sicakligi | 45 ±5°C | 46°C | UYGUN |
| Durulama (DI Water) | 18 MΩ min | 18.3 MΩ | UYGUN |
| Temiz oda partikul (0.5um) | ≤352,000/m³ (Class 7) | 185,000/m³ | UYGUN |
| Temiz oda sicaklik | 20 ±2°C | 20.5°C | UYGUN |
| Temiz oda nem | 45 ±10% RH | 48% RH | UYGUN |

**Dogrulama:**
- [ ] OP50 baslatildi, temiz oda giydirme protokolu uygulanir
- [ ] 7 parametre kaydedildi (K6 — temiz oda ortam verileri)
- [ ] Partikul sayimi Class 7 limitinde
- [ ] Temiz oda sicaklik ve nem kaydi girildi

### Adim 18 — OP60: Gorsel Muayene (Temiz Odada)
**Ekran:** Kalite > Muayene (`/quality/inspections`)
**API:** `POST /inspections`
**Rol:** Kalite Muduru (Zeynep Kara)

**Muayene: %100 gorsel (520 adet — 10x buyutec altinda)**

| Kontrol | Kriter | Kabul | Ret | Toplam |
|---------|--------|-------|-----|--------|
| Yuzey catlagi | Gorunur catlak YOK | 516 | 0 | 516 |
| Capak | Hissedilir capak YOK | 514 | 2 | 516 |
| Cizik | Derin cizik YOK (kozmetik hafif OK) | 515 | 1 | 516 |
| Self-tapping ucu | Kirilma/deformasyon YOK | 516 | 0 | 516 |
| Dis profili gorsel | Acik kusur YOK | 516 | 0 | 516 |
| Temizlik | Kalinti/leke YOK | 516 | 0 | 516 |

**Sonuc:** 513 KABUL, 3 RET (2 capak + 1 derin cizik), 4 onceki operasyonda hurda = toplam 520 - 4 = 516 muayene edildi

> **NOT:** 3 ret parcasi HURDA olarak ayrilir (implant = tamir YOK). Toplam: 513 UYGUN parca.

**Dogrulama:**
- [ ] %100 gorsel muayene kaydi girildi (516 adet muayene edildi)
- [ ] 3 ret parcasi HURDA olarak ayrildi (implant — tamir yapilmaz)
- [ ] Ret nedenleri (capak, derin cizik) detayli kaydedildi
- [ ] Ret orani: 3/516 = %0.58 — kabul edilebilir seviye

### Adim 19 — OP70: Boyutsal Kontrol (CMM + Optik)
**Ekran:** Kalite > Muayene (`/quality/inspections`)
**API:** `POST /inspections`
**Rol:** Kalite Muduru (Burak Celik — CMM Operatoru)

**Numune Secimi:** AQL 1.0, Level II — n=32 adet (513 lot buyuklugu)

**CMM Olcum Sonuclari (32 numune ozeti):**

| Olcu | Nominal ± Tol | Min Olculen | Max Olculen | Ortalama | Cp | Cpk | Sonuc |
|------|---------------|-------------|-------------|----------|-----|------|-------|
| Dis major Ø | 4.50 ±0.02 | 4.49 | 4.52 | 4.505 | 1.85 | 1.62 | UYGUN |
| Dis minor Ø | 3.18 ±0.02 | 3.17 | 3.20 | 3.185 | 1.78 | 1.55 | UYGUN |
| Hatve | 0.80 ±0.01 | 0.798 | 0.802 | 0.800 | 2.10 | 1.95 | UYGUN |
| Bas Ø | 8.00 ±0.05 | 7.97 | 8.04 | 8.01 | 1.92 | 1.70 | UYGUN |
| Toplam boy | 35.00 ±0.10 | 34.93 | 35.08 | 35.01 | 1.65 | 1.48 | UYGUN |
| Hex AF | 3.50 ±0.03 | 3.48 | 3.52 | 3.505 | 1.88 | 1.65 | UYGUN |
| Hex derinlik | 3.50 ±0.05 | 3.47 | 3.54 | 3.505 | 1.75 | 1.52 | UYGUN |
| Yuzey Ra | <0.4 um | 0.18 | 0.35 | 0.26 | — | — | UYGUN |

**Sonuc:** 32/32 KABUL — Tum boyutlar tolerans icinde. Cpk > 1.33 (medikal minimum).

**Dogrulama:**
- [ ] CMM olcum sonuclari 32 numune icin girildi
- [ ] 8 parametre tumu tolerans icinde — KABUL
- [ ] Cpk degerleri 1.33'un uzerinde (medikal implant minimum gereksinimi)
- [ ] Yuzey puruzlulugu Ra < 0.4 um — pasivizasyon sonrasi uygun
- [ ] CMM raporu dosya eki olarak yuklendi

### Adim 20 — OP80: Lazer Markalama (UDI + Lot No)
**Ekran:** ShopFloor Terminali (`/shopfloor`)
**API:** `POST /shopfloor/start-operation`
**Rol:** Operator

```
Operasyon: OP80 — Lazer Markalama
Makine: LZR-01 (FOBA M3000)
Program No: PRG-UDI-BV4535
```

**Markalama Icerigi:**

| Alan | Icerik | Format |
|------|--------|--------|
| UDI-DI | (01)08699999000012 | GS1 Data Matrix |
| UDI-PI (Lot) | (10)L2026-0891 | GS1-128 |
| UDI-PI (Uretim Tarihi) | (11)260520 | GS1 AI(11) |
| Uretici | MedTek | Okunabilir metin |
| CE Isareti | CE 0197 | Okunabilir metin |

**Markalama Kalite Kontrolu (K1 — UDI workaround):**

| Kontrol | Spec | Sonuc |
|---------|------|-------|
| Data Matrix okunabilirlik | ISO/IEC 15415 Grade C min | Grade B — UYGUN |
| Markalama derinligi | 20-50 um | 32 um — UYGUN |
| Markalama kontrast | Acik/koyu kontrast belirgin | UYGUN |
| Malzeme hasari | Catlak/deformasyon YOK | UYGUN |

**Dogrulama:**
- [ ] 513 adet lazer markalama tamamlandi
- [ ] UDI-DI ve UDI-PI kodlari dogru formatta (K1 — not alaninda UDI detayi)
- [ ] Data Matrix okunabilirlik Grade B — UYGUN
- [ ] Markalama derinligi spesifikasyon icinde (32 um)
- [ ] CE isareti ve uretici bilgisi okunabilir

### Adim 21 — OP90: Sterilizasyon Paketleme
**Ekran:** ShopFloor Terminali (`/shopfloor`)
**API:** `POST /shopfloor/start-operation`
**Rol:** Operator (Ayse Demir — Temiz Oda)

```
Operasyon: OP90 — Sterilizasyon Paketleme
Makine: SEL-01 (Hawo HD 680 DE-V)
Ortam: Temiz Oda Class 7
Paketleme: Tyvek/Film poset — tek vida/poset
```

**Seal Kalite Kontrolu:**

| Kontrol | Spec | Sonuc |
|---------|------|-------|
| Seal genisligi | ≥6mm | 8mm — UYGUN |
| Peel kuvveti | ≥1.5 N/15mm | 2.1 N/15mm — UYGUN |
| Seal butunlugu (gorsel) | Kirisik/delik/aciklik YOK | UYGUN |
| Indikatoru konumu | Poset uzerinde gorunur | UYGUN |
| Etiket | UDI + Lot + Son kullanma | UYGUN (K9) |

**Dogrulama:**
- [ ] 513 adet bireysel paketlendi (tek vida/poset)
- [ ] Seal kalite testi UYGUN (peel ≥1.5 N/15mm)
- [ ] Sterilizasyon indikatoru her posette mevcut
- [ ] Etiket bilgileri (UDI, lot, son kullanma) dogru (K9)
- [ ] Temiz oda ortam kaydi girildi

---

## BOLUM 5: FASON STERILIZASYON

### Adim 22 — Fason EtO Sterilizasyon Siparisi
**Ekran:** Fason Siparis (`/subcontract-orders`)
**API:** `POST /subcontractorder`
**Rol:** Satinalma Sorumlusu

```
Tedarikci: Medsteril Sterilizasyon Hizmetleri Ltd.Sti.
Fason Siparis No: FSN-2026-0034
Proses: EtO (Etilen Oksit) Sterilizasyon
Standart: ISO 11135:2014 (EtO sterilizasyon validasyonu)
Miktar: 513 adet (bireysel paketli)
Lot No: L2026-0891
Beklenen Sure: 5 is gunu (conditioning + sterilizasyon + aerasyon)
Tutar: 513 × 15.00 = 7,695.00 TRY
```

```
Ozel Kosullar:
- ISO 11135 validasyonlu EtO siklus
- SAL (Sterility Assurance Level): 10^-6
- Biyolojik indikatoru (BI) sonucu zorunlu
- EtO rezidu testi zorunlu (ISO 10993-7: ≤4 mg/cihaz)
- Her palet icin sicaklik/nem/EtO konsantrasyon karti
- Sterilizasyon sertifikasi (lot bazli)
```

**Dogrulama:**
- [ ] Fason siparis olusturuldu
- [ ] ISO 11135 referansi ve SAL 10^-6 kriteri yazildi
- [ ] EtO rezidu limiti (≤4 mg/cihaz) belirtildi
- [ ] Biyolojik indikatoru (BI) sonucu zorunlulugu eklendi (K2, K10)
- [ ] 513 adet x 15 TRY = 7,695 TRY tutar dogru

### Adim 23 — Fason Sterilizasyon Sonuc Kaydi
**Ekran:** Fason Siparis > Sonuc Girisi
**API:** `PUT /subcontractorder/{id}/result`
**Rol:** Kalite Muduru

```
Sterilizasyon Sertifikasi No: MS-CERT-2026-0891
Sterilizasyon Tarihi: 2026-05-26
Siklus No: ETO-2026-0456
```

**Sterilizasyon Parametreleri (Sertifikadan):**

| Parametre | Spec | Gerceklesen | Sonuc |
|-----------|------|-------------|-------|
| EtO konsantrasyonu | 450-600 mg/L | 520 mg/L | UYGUN |
| Oda sicakligi | 50-60°C | 55°C | UYGUN |
| Nem | 40-80% RH | 62% RH | UYGUN |
| Maruz kalma suresi | ≥120 dk | 180 dk | UYGUN |
| Aerasyon suresi | ≥48 saat | 72 saat | UYGUN |
| BI sonucu | Negatif (uresiz) | Negatif | UYGUN (K10) |
| EtO rezidu | ≤4 mg/cihaz | 1.2 mg/cihaz | UYGUN |
| Indikatoru renk degisimi | Renk degisti | EVET | UYGUN |

**Dogrulama:**
- [ ] Sterilizasyon sertifikasi dosya eki yuklendi
- [ ] 8 parametre tumu UYGUN
- [ ] BI sonucu NEGATIF — sterilite saglandi (K10)
- [ ] EtO rezidu 1.2 mg < 4 mg limit — hasta guvenligi UYGUN
- [ ] Sertifika lot numarasi (L2026-0891) eslesmesi dogruland

---

## BOLUM 6: SON MUAYENE VE SERTIFIKALAR

### Adim 24 — Son Muayene (%100 Gorsel + AQL Boyutsal)
**Ekran:** Kalite > Son Muayene (`/quality/final-inspection`)
**API:** `POST /inspections`
**Rol:** Kalite Muduru (Zeynep Kara)

**%100 Gorsel (Paketli Urun):**

| Kontrol | Kriter | Kabul | Ret | Sonuc |
|---------|--------|-------|-----|-------|
| Paket butunlugu | Yirtik/delik/aciklik YOK | 513 | 0 | UYGUN |
| Indikatoru renk degisimi | Sterilize rengi (pembe→kahve) | 513 | 0 | UYGUN |
| Etiket okunabilirlik | UDI + lot + tarih okunur | 512 | 1 | 1 RET |
| UDI barkod tarama | Scanner ile okunur | 512 | 0 | UYGUN |

> **NOT:** 1 adet etiket okunabilirlik RET — etiket bulanık basim. Parca hurda (steril paket acilamaz — yeniden sterilizasyon maliyeti > parca degeri).

**AQL Boyutsal (n=32, sterilize paketli parcalardan acilmadan gorsel kontrol):**
- Paket ici vida pozisyonu: 32/32 UYGUN
- Paket seal butunlugu: 32/32 UYGUN

**Final Sonuc:** 512 KABUL, 1 RET (etiket) → 500 + 12 yedek = 512 sevk edilecek

**Dogrulama:**
- [ ] Son muayene kaydi girildi
- [ ] %100 gorsel + AQL boyutsal kombinasyonu uygulandr
- [ ] 1 etiket ret — hurda olarak kaydedildi
- [ ] 512 adet sevkiyata hazir (500 siparis + 12 yedek)

### Adim 25 — FAI (First Article Inspection)
**Ekran:** Kalite > FAI (`/quality/fai`)
**API:** `POST /fai`
**Rol:** Kalite Muduru

> **NOT:** AS9102 FAI formati kullanilabilir — ISO 13485 ile %80 ortak. Quvex'te AS9102 modulu mevcut.

```
FAI No: FAI-2026-0045
Urun: MED-BV-4535-TI
Numune: 3 adet (ilk, orta, son uretimden)
Referans: ISO 13485:2016 Section 7.5.1 + ASTM F136
```

**FAI Form 1 — Parca Numarasi Dogrulama:**
- Parca No: MED-BV-4535-TI | Rev: A | Siparis: SIP-2026-0067

**FAI Form 2 — Urun Dogrulama:**
- Malzeme: Ti-6Al-4V ASTM F136 — Heat HT-2026-TI-0456 — DOGRULANDI
- Proses: 10 operasyon tamamlandi — DOGRULANDI
- Ozel Proses: Pasivizasyon (ASTM A967) + EtO Sterilizasyon (ISO 11135) — DOGRULANDI

**FAI Form 3 — Olcum Sonuclari (3 numune):**

| Olcu | Nominal ± Tol | Numune 1 | Numune 2 | Numune 3 | Sonuc |
|------|---------------|----------|----------|----------|-------|
| Dis major Ø | 4.50 ±0.02 | 4.51 | 4.50 | 4.52 | UYGUN |
| Dis minor Ø | 3.18 ±0.02 | 3.19 | 3.18 | 3.19 | UYGUN |
| Hatve | 0.80 ±0.01 | 0.80 | 0.80 | 0.80 | UYGUN |
| Bas Ø | 8.00 ±0.05 | 8.02 | 8.01 | 8.03 | UYGUN |
| Boy | 35.00 ±0.10 | 35.04 | 35.02 | 35.06 | UYGUN |
| Hex AF | 3.50 ±0.03 | 3.52 | 3.51 | 3.52 | UYGUN |
| Ra | <0.4 um | 0.25 | 0.28 | 0.22 | UYGUN |
| Sertlik | 33-39 HRC | 36 | 35 | 37 | UYGUN |

**FAI Sonuc:** KABUL — 3 numune, 8 olcu noktasi, tumu tolerans icinde.

**Dogrulama:**
- [ ] FAI 3 form (AS9102 formati) dolduruldu
- [ ] 3 numune x 8 parametre = 24 olcum — tumu UYGUN
- [ ] Malzeme, proses ve ozel proses dogrulandi
- [ ] FAI raporu dosya eki olarak yuklendi

### Adim 26 — Sertifika Paketi (CoC + Ekler)
**Ekran:** Kalite > CoC (`/quality/coc`)
**API:** `POST /coc`
**Rol:** Kalite Muduru

```
CoC No: COC-2026-0067
Siparis: SIP-2026-0067
Musteri: Anadolu Saglik Grubu A.S.
Urun: MED-BV-4535-TI — Ortopedik Kemik Vidasi Ø4.5×35mm
Miktar: 512 adet (500 siparis + 12 yedek)
Lot: L2026-0891
```

**Beyan:**
> MedTek Cerrahi Aletler San. Ltd.Sti. olarak, yukarida belirtilen urunlerin
> ISO 13485:2016 kalite yonetim sistemi kapsaminda, ASTM F136 malzeme
> spesifikasyonuna, ASTM A967 pasivizasyon standardina ve ISO 11135
> sterilizasyon standardina uygun olarak uretildigini beyan ederiz.

**Ek Belgeler:**

| # | Belge | Dosya Adi | Durum |
|---|-------|-----------|-------|
| 1 | CoC (Uygunluk Beyannamesi) | COC-2026-0067.pdf | HAZIRLANDI |
| 2 | Malzeme Sertifikasi (MTR — ASTM F136) | MTR-HT-2026-TI-0456.pdf | EKLENDI |
| 3 | Kimyasal Analiz Raporu | CHEM-HT-2026-TI-0456.pdf | EKLENDI |
| 4 | Mekanik Test Raporu | MECH-HT-2026-TI-0456.pdf | EKLENDI |
| 5 | Pasivizasyon Sertifikasi (ASTM A967) | PAS-L2026-0891.pdf | EKLENDI |
| 6 | Sterilizasyon Sertifikasi (ISO 11135) | STER-MS-CERT-2026-0891.pdf | EKLENDI |
| 7 | EtO Rezidu Test Raporu | RESIDU-L2026-0891.pdf | EKLENDI |
| 8 | CMM Olcum Raporu | CMM-IE-2026-0089.pdf | EKLENDI |
| 9 | FAI Raporu (AS9102 formati) | FAI-2026-0045.pdf | EKLENDI |
| 10 | Gorsel Muayene Raporu | VIS-IE-2026-0089.pdf | EKLENDI |
| 11 | Biyouyumluluk Test Raporu (ISO 10993) | BIO-REF-2025-088.pdf | REFERANS (K3) |

**Dogrulama:**
- [ ] CoC olusturuldu, beyan metni medikal standartlari iceriyor
- [ ] 11 belge listelendi (10 ek + 1 referans)
- [ ] Biyouyumluluk raporu referans olarak eklendi — dis lab raporu (K3)
- [ ] Tum belgeler dosya eki olarak yuklendi
- [ ] Lot numarasi tum belgelerde tutarli (L2026-0891)

---

## BOLUM 7: IZLENEBILIRLIK VE UDI

### Adim 27 — Lot Bazli Izlenebilirlik
**Ekran:** Uretim > Seri Numaralar (`/production/serial-numbers`)
**API:** `POST /serialnumbers`
**Rol:** Kalite Muduru

**Izlenebilirlik Zinciri:**

```
Hammadde Lot: TM-LOT-2026-0891 (TitanMetal — Ti-6Al-4V Cubuk)
    └── Heat No: HT-2026-TI-0456 (ASTM F136 sertifikali)
        └── Uretim Lot: L2026-0891 (MedTek — 520 parca uretildi)
            └── Pasivizasyon Batch: PAS-B01 ~ PAS-B06 (6 batch × ~87 adet)
                └── Sterilizasyon Lot: ETO-2026-0456 (Medsteril — 513 adet)
                    └── Son Muayene: 512 KABUL
                        ├── Sevkiyat 1: Gebze Hastanesi — 300 adet (UDI seri bazli)
                        └── Sevkiyat 2: Atasehir Hastanesi — 200 adet (UDI seri bazli)
                            └── (Hasta bazli implant kaydı — HASTANE SORUMLULUĞU)
```

**Dogrulama:**
- [ ] Izlenebilirlik zinciri eksiksiz olusturuldu
- [ ] Hammadde lot → Uretim lot → Sterilizasyon lot → Sevkiyat baglantisi var
- [ ] UDI kodlari lot bazli (bireysel seri no yok — lot izlenebilirlik)
- [ ] Hastane'ye kadar izlenebilirlik saglanmis (hasta bazli = hastane sorumluluğu)

### Adim 28 — Etiketleme (MDR Gereklilikleri)
**Ekran:** Uretim > Is Emirleri (not alani)
**Rol:** Kalite Muduru

> **NOT:** MDR 2017/745 Article 27 ve Annex I Chapter III — etiketleme gereklilikleri.
> Quvex'te etiket tasarim modulu yok (K9). Etiket kontrolu kontrol listesi ile yapilir.

**Etiket Kontrol Listesi:**

| # | MDR Gereksinimi | Etiket Uzerinde | Sonuc |
|---|-----------------|-----------------|-------|
| 1 | Uretici adi ve adresi | MedTek Cerrahi Aletler, Istanbul | UYGUN |
| 2 | Urun adi | Ortopedik Kemik Vidasi Ø4.5×35mm | UYGUN |
| 3 | UDI (barcode + okunabilir) | (01)08699999000012(10)L2026-0891(11)260520 | UYGUN |
| 4 | Lot numarasi | L2026-0891 | UYGUN |
| 5 | Son kullanma tarihi (sterilite) | 2031-05 (5 yil raf omru) | UYGUN |
| 6 | CE isareti + NB numarasi | CE 0197 | UYGUN |
| 7 | "STERIL — EtO" sembol | ISO 15223-1:2021 Sembol 5.2.4 | UYGUN |
| 8 | "Tek kullanimlik" sembol | ISO 15223-1:2021 Sembol 5.4.2 | UYGUN |
| 9 | Malzeme (implant) | Ti-6Al-4V (ASTM F136) | UYGUN |
| 10 | MR uyumluluk | "MR Conditional" sembol | UYGUN |
| 11 | Kullanim talimati referansi | IFU Ref: IFU-BV-4535-A | UYGUN |

**Dogrulama:**
- [ ] 11 MDR etiketleme gereksinimi kontrol edildi — tumu UYGUN (K9)
- [ ] UDI barcode scanner ile okunabilirlik teyit edildi
- [ ] ISO 15223-1 sembolleri dogru kullanildi
- [ ] Etiket kontrol listesi dosya eki olarak yuklendi

---

## BOLUM 8: PAKETLEME, SEVKIYAT VE FATURA

### Adim 29 — Paketleme
**Ekran:** Depo > Paketleme (is emri not alani)
**Rol:** Depo Sorumlusu

```
Paketleme:
- Bireysel steril posetler (512 adet — Adim 21'de paketlendi)
- 50'li kutular: 10 kutu x 50 adet + 1 kutu x 12 adet = 11 kutu
- Dis ambalaj: 2 koli (5+6 kutu) — karton + sisme koruma
- Her koli uzerinde: Lot no, miktar, sevkiyat adresi, "STERIL — DIKKAT" etiketi
```

**Dogrulama:**
- [ ] 512 adet 11 kutuya paketlendi
- [ ] Her kutu uzerinde lot ve miktar bilgisi
- [ ] Koli bazli sevkiyat adresi etiketi yapildi
- [ ] "STERIL" uyari etiketi tum kolilerde

### Adim 30 — Sevkiyat
**Ekran:** Sevkiyat (`/shipments`)
**API:** `POST /shipment`
**Rol:** Depo Sorumlusu

**Sevkiyat 1:**
```
Irsaliye No: MED-IRS-2026-0089-A
Musteri: Anadolu Saglik Grubu — Gebze Hastanesi
Miktar: 300 adet (6 kutu)
Adres: Anadolu Saglik Merkezi, Gebze/Kocaeli
Tasima: Soguk zincir kurye (sicaklik kontrol)
CoC Eki: COC-2026-0067 (kopya)
```

**Sevkiyat 2:**
```
Irsaliye No: MED-IRS-2026-0089-B
Musteri: Anadolu Saglik Grubu — Atasehir Hastanesi
Miktar: 200 adet (4 kutu) + 12 yedek (1 kutu)
Adres: Anadolu Saglik Merkezi, Atasehir/Istanbul
Tasima: Soguk zincir kurye
CoC Eki: COC-2026-0067 (kopya)
```

**Dogrulama:**
- [ ] 2 ayri sevkiyat olusturuldu (2 farkli hastane)
- [ ] Toplam 300 + 212 = 512 adet sevk edildi
- [ ] Her sevkiyatta CoC kopyasi eklendi
- [ ] Soguk zincir kurye notu yazildi (steril urun tasima kosulu)
- [ ] Irsaliyeler basiyla olusturuldu

### Adim 31 — Fatura
**Ekran:** Faturalar (`/invoices`)
**API:** `POST /invoice`
**Rol:** Muhasebe

```
Fatura No: FTR-2026-0089
Musteri: Anadolu Saglik Grubu A.S.
Siparis Ref: SIP-2026-0067
Fatura Tarihi: 2026-06-01
Vade: 45 gun (2026-07-16)
```

| # | Kalem | Miktar | Birim Fiyat | Toplam |
|---|-------|--------|-------------|--------|
| 1 | MED-BV-4535-TI — Ortopedik Kemik Vidasi | 500 | 380.00 TRY | 190,000.00 TRY |

```
Ara Toplam: 190,000.00 TRY
KDV (%10 — medikal cihaz): 19,000.00 TRY
Genel Toplam: 209,000.00 TRY
Not: Yedek 12 adet bedelsiz sevk edilmistir.
```

**Dogrulama:**
- [ ] Fatura olusturuldu, siparis referansi dogru
- [ ] 500 adet fatura edildi (512 sevk, 12 yedek bedelsiz)
- [ ] KDV orani %10 (medikal cihaz indirimi)
- [ ] Genel toplam 209,000 TRY
- [ ] Vade 45 gun dogru hesaplandi

---

## BOLUM 9: RECALL SENARYOSU

### Adim 32 — RECALL Tetikleme: Sterilizasyon Parametresi Sapma
**Ekran:** Kalite > NCR (`/quality/ncr`)
**API:** `POST /ncr`
**Rol:** Kalite Muduru

> **SENARYO:** Fason sterilizasyon firmasindan (Medsteril) bildirim geldi:
> EtO siklus ETO-2026-0456'da sicaklik sensoru kalibrasyonunda sapma tespit edildi.
> Gercek sicaklik 45°C olabilir (spec: 50-60°C). SAL garantisi sorgulanir.

```
NCR No: NCR-2026-0078
Tip: KRITIK — Hasta Guvenligi
Kaynak: Fason Tedarikci Bildirimi (Medsteril)
Lot: L2026-0891
Etkilenen Miktar: 512 adet (300 Gebze + 212 Atasehir)
Sorun: EtO sterilizasyon sicakligi spec disinda olabilir → SAL 10^-6 garantisi yok
```

**Dogrulama:**
- [ ] NCR KRITIK seviyede olusturuldu
- [ ] Lot numarasi (L2026-0891) ile izlenebilirlik baglantisi kuruldu
- [ ] Etkilenen miktar ve lokasyonlar (2 hastane) belirlendi
- [ ] Hasta guvenligi riski acikca belirtildi

### Adim 33 — RECALL Lot Izleme ve Etkilenen Hastaneler
**Ekran:** Uretim > Seri Numaralar > Izlenebilirlik
**API:** `GET /serialnumbers?lot=L2026-0891`
**Rol:** Kalite Muduru

**Lot Izleme Sonucu (K8 — RECALL workaround):**

| Sevkiyat | Hastane | Miktar | Irsaliye | Teslim Tarihi | Durum |
|----------|---------|--------|----------|---------------|-------|
| MED-IRS-2026-0089-A | Gebze Hastanesi | 300 | Teslim edildi | 2026-06-02 | RECALL GEREKLI |
| MED-IRS-2026-0089-B | Atasehir Hastanesi | 212 | Teslim edildi | 2026-06-03 | RECALL GEREKLI |

```
FSCA (Field Safety Corrective Action) Notu (K8):
- Etkilenen UDI-DI: (01)08699999000012
- Etkilenen Lot: L2026-0891
- Aksiyon: Tum lotu geri cagir — yeniden sterilizasyon veya imha
- Bildirim: Hastane eczane birimleri + TITCK (Turkiye Ilac ve Tibbi Cihaz Kurumu)
- Hasta takibi: Implante edilmis urunler icin hastane kayitlari kontrol edilecek
```

**Dogrulama:**
- [ ] Lot izleme ile tum sevkiyatlar tespit edildi
- [ ] 2 hastane ve miktarlar dogru listelendi
- [ ] FSCA notu yazildi (K8 — RECALL workaround)
- [ ] TITCK bildirim gereksinimi not edildi
- [ ] Hasta takibi sorumluluğu hastaneye iletildi

### Adim 34 — RECALL CAPA
**Ekran:** Kalite > CAPA (`/quality/capa`)
**API:** `POST /capa`
**Rol:** Kalite Muduru

```
CAPA No: CAPA-2026-0034
Iliskili NCR: NCR-2026-0078
Kok Neden: Fason sterilizasyon firmasinda (Medsteril) sicaklik sensoru kalibrasyon hatasi
Analiz Yontemi: 5 Why + Ishikawa
```

**Kok Neden Analizi (5 Why):**
1. Neden sterilizasyon sicakligi dusuk? → Sicaklik sensoru yalnis okuyor
2. Neden sensor yanlis okuyor? → Kalibrasyon suresi gecmis (+2 ay)
3. Neden kalibrasyon suresi gecmis? → Medsteril IC kalibrasyon takvimi takibi yetersiz
4. Neden takvim takibi yetersiz? → Manuel takip sistemi, otomatik uyari yok
5. Neden otomatik uyari yok? → Medsteril CMMS (bakim yonetim sistemi) guncel degil

**Aksiyonlar:**

| # | Aksiyon | Sorumlu | Hedef Tarih | Durum |
|---|---------|---------|-------------|-------|
| 1 | Medsteril'e kalibrasyon sistemi iyilestirme talebi | Satinalma | 2026-06-15 | ACIK |
| 2 | Alternatif sterilizasyon tedarikci degerlendirme | Kalite Muduru | 2026-06-30 | ACIK |
| 3 | Gelen sterilizasyon sertifikasinda kalibrasyon tarihi kontrolu ekleme | Kalite Muduru | 2026-06-10 | ACIK |
| 4 | Recall lotu yeniden sterilizasyon (yeni tedarikci ile) | Satinalma | 2026-06-20 | ACIK |
| 5 | TITCK FSCA bildirimi gonderme | Kalite Muduru | 2026-06-05 | ACIK |
| 6 | Hasta takibi icin hastanelere bildirim | Kalite Muduru | 2026-06-05 | ACIK |

**Dogrulama:**
- [ ] CAPA olusturuldu, NCR ile iliskilendirildi
- [ ] 5 Why analizi tamamlandi — kok neden: fason tedarikci kalibrasyon hatasi
- [ ] 6 aksiyon maddesi eklendi (recall + duzeltici + onleyici)
- [ ] TITCK bildirimi ve hasta takibi aksiyonlari kritik oncelikli
- [ ] Alternatif tedarikci degerlendirmesi planlanmis

---

## BOLUM 10: MALIYET ANALIZI

### Adim 35 — Maliyet Hesaplama
**Ekran:** Uretim > Maliyet Analizi (`/production/part-cost`)
**API:** `GET /partcost/{workOrderId}`
**Rol:** Uretim Muduru

**Birim Maliyet Hesabi (1 vida):**

| Kalem | Tutar (TRY) | Aciklama |
|-------|-------------|----------|
| Hammadde (Ti-6Al-4V) | 98.08 | 1700 TRY/cubuk ÷ 18 vida/cubuk + %3.5 fire |
| Tyvek poset | 3.50 | Paketleme |
| Sterilizasyon indikatoru | 1.20 | EtO kimyasal indikatoru |
| UDI etiket | 0.80 | MDR uyumlu |
| Sitrik asit | 0.60 | Pasivizasyon payi |
| Yikama sivisi | 0.50 | Ultrasonik yikama payi |
| **Malzeme Toplam** | **104.68** | |
| OP10 Swiss CNC Torna | 105.00 | 4.5 dk × 1400 TRY/saat ÷ 60 |
| OP20 CNC Freze | 53.33 | 2.0 dk × 1600 TRY/saat ÷ 60 |
| OP30 Capak Alma | 1.67 | 0.5 dk × 200 TRY/saat ÷ 60 |
| OP40 Pasivizasyon | 5.00 | 1.0 dk × 300 TRY/saat ÷ 60 |
| OP50 Ultrasonik Yikama | 2.08 | 0.5 dk × 250 TRY/saat ÷ 60 |
| OP70 CMM Kontrol | 25.00 | 3.0 dk × 500 TRY/saat ÷ 60 |
| OP80 Lazer Markalama | 6.67 | 1.0 dk × 400 TRY/saat ÷ 60 |
| OP90 Paketleme | 1.25 | 0.5 dk × 150 TRY/saat ÷ 60 |
| **Iscilik Toplam** | **200.00** | |
| Fason EtO Sterilizasyon | 15.00 | Medsteril |
| **Fason Toplam** | **15.00** | |
| Genel Imalat Giderleri (%15) | 47.95 | |
| Temiz Oda Isletme (%8) | 25.57 | |
| Amortisman (%14) | 44.75 | |
| Enerji (%5) | 15.98 | |
| Kalibrasyon + Validasyon (%4) | 12.79 | |
| **Genel Gider Toplam (%46)** | **147.04** | |
| **BIRIM MALIYET** | **466.72 TRY** | |
| **SATIS FIYATI** | **380.00 TRY** | |
| **KAR/ZARAR** | **-86.72 TRY (ZARAR!)** | |
| **Kar Marji** | **-%22.8** | |

> **UYARI:** ZARAR! Birim maliyet (466.72 TRY) > satis fiyati (380.00 TRY).
> Swiss CNC torna maliyeti cok yuksek. Teklif revizyonu veya proses optimizasyonu gerekli.
> **Oneriler:** (1) Swiss CNC cycle time optimizasyonu, (2) Sonraki teklifte fiyat artisi,
> (3) Batch buyutme ile setup maliyeti dusurme

**Dogrulama:**
- [ ] Maliyet analizi hesaplandi
- [ ] ZARAR tespit edildi (-%22.8 kar marji)
- [ ] Malzeme (%22.4), iscilik (%42.9), fason (%3.2), genel gider (%31.5) dagilimi gorunuyor
- [ ] Swiss CNC torna en yuksek iscilik kalemi (105 TRY — toplamin %22.5'i)
- [ ] Uyari/rapor olusturuldu — yonetime bildirim

---

## BOLUM 11: TEDARIKCI DEGERLENDIRME

### Adim 36 — Tedarikci Degerlendirme
**Ekran:** Tedarikci Degerlendirme (`/supplier-evaluation`)
**API:** `GET /supplier-evaluation`
**Rol:** Kalite Muduru

**Tedarikci 1: TitanMetal Endustriyel A.S. (Ti-6Al-4V Hammadde)**

| Kriter | Puan (1-5) | Aciklama |
|--------|------------|----------|
| Kalite | 5 | ASTM F136 tam uyum, tum parametreler limitlerde |
| Teslimat | 5 | Zamaninda teslim (planlanan: 25 Nisan, gercek: 25 Nisan) |
| Fiyat | 3 | Piyasa ortalamasi ustu (1700 TRY/cubuk) |
| Dokumantasyon | 5 | MTR, kimyasal, mekanik, ultrasonik — eksiksiz |
| Iletisim | 4 | Hizli donus, teknik destek iyi |
| **Ortalama** | **4.4** | **ONAYLANMIS TEDARIKCI — A Sinifi** |

**Tedarikci 2: Medsteril Sterilizasyon Hizmetleri Ltd.Sti. (Fason EtO)**

| Kriter | Puan (1-5) | Aciklama |
|--------|------------|----------|
| Kalite | 1 | KRITIK HATA — sicaklik sensoru kalibrasyon sapması, RECALL |
| Teslimat | 4 | 5 is gununde teslim (planlandigi gibi) |
| Fiyat | 4 | Makul (15 TRY/adet) |
| Dokumantasyon | 3 | Sertifika tamam, kalibrasyon bilgisi yetersiz |
| Iletisim | 3 | Sorun bildirimi gecikti (2 hafta sonra) |
| **Ortalama** | **3.0** | **KOSULLU ONAYLI — Iyilestirme gerekli, alternatif aranacak** |

**Dogrulama:**
- [ ] 2 tedarikci degerlendirmesi yapildi
- [ ] TitanMetal: A sinifi, ONAYLANMIS (4.4/5)
- [ ] Medsteril: KOSULLU ONAYLI (3.0/5) — RECALL nedeniyle kalite puani 1
- [ ] Degerlendirme gecmisi kaydedildi
- [ ] Alternatif sterilizasyon tedarikci arama notu eklendi

---

## BOLUM 12: ROL TESTLERI

### 12.1 Kalite Muduru Rol Testi
**Giris:** zeynep.kara@medtek.com.tr
- [ ] ERISIM VAR: Muayene, Kontrol Plani, NCR, CAPA, FAI, CoC, Kalibrasyon, Tedarikci Degerlendirme, Son Muayene (goruntule+kaydet+sil)
- [ ] ERISIM VAR: Izlenebilirlik (seri numara, lot takip)
- [ ] SADECE GORUNTULE: Is Emri, Siparis, Maliyet Analizi
- [ ] ERISIM YOK: Fatura, Fiyat duzenleme

### 12.2 Uretim Muduru Rol Testi
**Giris:** uretim.muduru@medtek.com.tr
- [ ] ERISIM VAR: Is Emri, Operasyon Routing, Makineler, ShopFloor, Maliyet Analizi (goruntule+kaydet)
- [ ] ERISIM VAR: BOM (goruntule+kaydet)
- [ ] SADECE GORUNTULE: Muayene, NCR
- [ ] ERISIM YOK: Fatura, CoC duzenleme

### 12.3 Operator Rol Testi
**Giris:** emre.yilmaz@medtek.com.tr (Swiss CNC Operatoru)
- [ ] ERISIM VAR: ShopFloor — kendi is emirleri, operasyon baslat/bitir, parametre girisi
- [ ] ERISIM VAR: Ilk parca olcum girisi
- [ ] ERISIM YOK: Diger operatorlerin is emirleri, Is Emri tam detay, Kalite, Musteri, Fiyat
- [ ] CNC parametreleri (devir, ilerleme) ve temiz oda notlarini girebiliyor

### 12.4 Satinalma Rol Testi
**Giris:** satinalma@medtek.com.tr
- [ ] ERISIM VAR: Satinalma Siparis, Fason Siparis (EtO sterilizasyon), Mal Kabul, Tedarikci (goruntule+kaydet)
- [ ] SADECE GORUNTULE: Is Emri, Stok
- [ ] ERISIM YOK: Kalite ekranlari (NCR, CAPA, CoC), Fatura

---

## BOLUM 13: BIYOUYUMLULUK TEST REFERANSI (Ek Senaryo)

### 13.1 ISO 10993 Biyouyumluluk Testleri (K3 — Dis Lab Referansi)

> **NOT:** Biyouyumluluk testleri dis laboratuvarda yapilir. Quvex'te biyouyumluluk test
> takip modulu yok (K3). Dis lab raporu dosya eki olarak CoC paketine eklenir.

**Gerekli Testler (Ti-6Al-4V implant — ISO 10993 serisi):**

| Test | Standart | Lab | Sonuc | Gecerlilik |
|------|----------|-----|-------|------------|
| Sitotoksisite | ISO 10993-5 | TUBITAK MAM | GECTI | 3 yil (2025-2028) |
| Sensitizasyon | ISO 10993-10 | TUBITAK MAM | GECTI | 3 yil |
| Irritasyon | ISO 10993-10 | TUBITAK MAM | GECTI | 3 yil |
| Akut Sistemik Toksisite | ISO 10993-11 | TUBITAK MAM | GECTI | 3 yil |
| Genotoksisite | ISO 10993-3 | TUBITAK MAM | GECTI | 3 yil |
| Implantasyon | ISO 10993-6 | TUBITAK MAM | GECTI | 3 yil |
| Kronik Toksisite | ISO 10993-11 | TUBITAK MAM | GECTI | 5 yil |

**Dogrulama:**
- [ ] 7 biyouyumluluk test raporu referans olarak kaydedildi (K3)
- [ ] Tum testler TUBITAK MAM tarafindan yapilmis
- [ ] Gecerlilik tarihleri mevcut (2025-2028/2030)
- [ ] Raporlar CoC paketinde referans olarak listelendi

---

## BOLUM 14: KRITIK IS KURALLARI VE DOGRULAMA MATRISI

### 14.1 End-to-End Dogrulama Matrisi

| # | Kontrol Noktasi | Bolum | Beklenen | Test Durumu |
|---|----------------|-------|----------|-------------|
| 1 | Musteri karti ISO 13485 + MDR notu | 1.1 | Zorunlu alanlar dolu | [ ] |
| 2 | Urun tanimi UDI + MDR sinifi + risk | 1.3 | Not alaninda tumu var | [ ] |
| 3 | BOM — 7 kalem (malzeme + sarf + fason) | 1.4 | 7 BOM kalemi dogru | [ ] |
| 4 | Kontrol plani 18 kontrol noktasi | 1.5 | ISO 14971 risk referansi var | [ ] |
| 5 | Contract review YUKSEK risk | 2.7 | Risk = YUKSEK, implant notu | [ ] |
| 6 | Teklif → Siparis donusumu | 2.8 | Siparis olusturuldu, PO eslesmesi | [ ] |
| 7 | MTR kimyasal dogrulama (8 element) | 3.10 | Tum elementler ASTM F136 limitinde | [ ] |
| 8 | MTR mekanik ozellikler (4 parametre) | 3.10 | UTS, akma, uzama, daralma UYGUN | [ ] |
| 9 | Giris kalite kontrol — 5 numune KABUL | 3.11 | Cap, yuzey, sertlik UYGUN | [ ] |
| 10 | Is emri — 10 operasyon routing | 4.12 | OP10-OP100, operator atamasi | [ ] |
| 11 | Swiss CNC ilk parca — 6 parametre | 4.13 | Tumu tolerans icinde | [ ] |
| 12 | Pasivizasyon — 6 proses parametresi (K7) | 4.16 | ASTM A967 limitleri icinde | [ ] |
| 13 | Temiz oda ortam kaydi (K6) | 4.17 | Class 7 limitleri icinde | [ ] |
| 14 | %100 gorsel muayene — 3 ret | 4.18 | 513 KABUL, 3 HURDA (implant) | [ ] |
| 15 | CMM 32 numune — 8 parametre | 4.19 | Cpk > 1.33, tumu UYGUN | [ ] |
| 16 | UDI markalama — okunabilirlik | 4.20 | Grade B min, derinlik 20-50um | [ ] |
| 17 | Sterilizasyon paketleme — seal testi | 4.21 | Peel ≥1.5 N/15mm | [ ] |
| 18 | Fason EtO siparis — ISO 11135 | 5.22 | SAL 10^-6, BI zorunlu | [ ] |
| 19 | Sterilizasyon sonuc — 8 parametre | 5.23 | BI negatif, EtO rezidu <4mg | [ ] |
| 20 | Son muayene — 512 KABUL | 6.24 | %100 gorsel + AQL boyutsal | [ ] |
| 21 | FAI — 3 numune × 8 olcu | 6.25 | AS9102 formati, tumu UYGUN | [ ] |
| 22 | CoC — 11 belge | 6.26 | Beyan + tum ekler tam | [ ] |
| 23 | Izlenebilirlik zinciri — tam | 7.27 | Hammadde→Uretim→Sterilizasyon→Hastane | [ ] |
| 24 | MDR etiketleme — 11 gereksinim | 7.28 | Tumu UYGUN | [ ] |
| 25 | 2 sevkiyat (300 + 212) | 8.30 | 2 hastane, CoC eki | [ ] |
| 26 | Fatura — 500 adet × 380 TRY | 8.31 | 209,000 TRY (%10 KDV) | [ ] |
| 27 | RECALL NCR — KRITIK | 9.32 | Hasta guvenligi, lot izleme | [ ] |
| 28 | RECALL lot izleme — 2 hastane | 9.33 | 512 adet, FSCA notu | [ ] |
| 29 | RECALL CAPA — 6 aksiyon | 9.34 | 5 Why, kok neden, TITCK bildirimi | [ ] |
| 30 | Maliyet — ZARAR tespiti | 10.35 | 466.72 > 380 = ZARAR | [ ] |
| 31 | Tedarikci — TitanMetal A sinifi | 11.36 | 4.4/5 ONAYLANMIS | [ ] |
| 32 | Tedarikci — Medsteril KOSULLU | 11.36 | 3.0/5, RECALL nedeniyle | [ ] |
| 33 | Kalite Muduru erisim | 12.1 | Kalite ekranlari OK, fatura HAYIR | [ ] |
| 34 | Uretim Muduru erisim | 12.2 | Uretim OK, CoC duzenleme HAYIR | [ ] |
| 35 | Operator erisim (ShopFloor) | 12.3 | Sadece kendi is emri, fiyat HAYIR | [ ] |
| 36 | Satinalma erisim | 12.4 | Satin alma + fason OK, kalite HAYIR | [ ] |

### 14.2 Workaround Dogrulama (K1-K10)
- [ ] K1 UDI→urun notu + markalama notu (3, 20) | K2 Sterilizasyon→fason sertifika (22, 23) | K3 Biyouyumluluk→dis lab referansi (26, 13.1)
- [ ] K4 MDR teknik dosya→not alani (3) | K5 Risk matris→kontrol plani notu (5) | K6 Temiz oda→manuel kayit (17)
- [ ] K7 Pasivizasyon→manuel kayit (16) | K8 RECALL→NCR+CAPA sureci (32-34) | K9 Etiket→kontrol listesi (28)
- [ ] K10 BI sonucu→sterilizasyon sertifikasi icinde (23)

### 14.3 ISO 13485 ile AS9100 Ortak Moduller

> **ONEMLI:** Quvex AS9100 icin gelistirildi, ancak asagidaki moduller ISO 13485'e dogrudan uygulanabilir:

| Quvex Modulu | AS9100 Kullanimi | ISO 13485 Kullanimi | Uyumluluk |
|--------------|-----------------|---------------------|-----------|
| Contract Review | Sozlesme incelemesi | Sozlesme incelemesi | %100 |
| Kontrol Plani | Proses kontrol | Proses validasyon + kontrol | %90 |
| FAI (AS9102) | Ilk urün muayene | Tasarim dogrulama | %80 |
| CoC | Uygunluk beyanı | Uygunluk beyanı | %100 |
| NCR / CAPA | Uygunsuzluk yonetimi | Uygunsuzluk yonetimi | %100 |
| Malzeme Sertifikasi | Hammadde izlenebilirlik | Hammadde izlenebilirlik | %100 |
| Seri No / Lot Takip | Izlenebilirlik | Cihaz izlenebilirlik (UDI) | %85 |
| Fason Siparis | Ozel proses tedarikcisi | Ozel proses tedarikcisi | %100 |
| Kalibrasyon | Olcum ekipmani | Olcum ekipmani | %100 |
| Tedarikci Degerlendirme | Tedarikci yonetimi | Tedarikci yonetimi | %100 |

**Sonuc:** Quvex'in 10 kalite modulunden 10'u ISO 13485'te kullanilabilir (%80-100 uyum).

---

## SONUC

**Kapsam:** 36 dogrulama + 10 workaround | 15 Quvex modul | 4 rol | Ti-6Al-4V Ortopedik Vida + Temiz Oda + EtO Sterilizasyon + RECALL

**ISO 13485 → AS9100 Sinerjisi:** Quvex AS9100 kalite modulleri medikal sektore %80-100 oraninda dogrudan uygulanabilir. Eksik moduller (UDI, sterilizasyon validasyon, risk matris, RECALL yonetimi) workaround ile karsilanmistir.

**Gelecek Gelistirme:** UDI veritabani modulu, sterilizasyon validasyon (IQ/OQ/PQ), ISO 14971 risk matris, RECALL (FSCA) yonetim modulu, MDR teknik dosya sablonu, biyouyumluluk test takibi, temiz oda ortam izleme dashboard, pasivizasyon proses izleme

---

> **Hazirlayan:** QA Ekibi
> **Tarih:** 2026-04-10
> **Revizyon:** A
> **Durum:** TASLAK — Gozden gecirme bekliyor
> **Referans Senaryolar:** `tests/KAYNAK-ATOLYESI-E2E-SENARYO.md`, `tests/ELEKTRONIK-KART-MONTAJ-E2E-SENARYO.md`
