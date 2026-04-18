# Savunma Sanayi Kaynak Atolyesi — Uctan Uca Test Senaryosu

> **Firma Profili:** Ozdemir Kaynak Muhendislik Ltd.Sti. — 25 personel, 4 TIG kaynak kabini, 1 plazma kaynak sistemi, 1 temiz oda (kaynak oncesi hazirlik)
> **Sertifikalar:** AS9100 Rev D, ISO 9001:2015, AWS D17.1 (Havacilik Kaynagi), ASME IX (Basinc Kabı Kaynagi)
> **NADCAP:** Kaynak (Fusion Welding) — Ozel Proses Onay Kapsaminda
> **Musteriler:** TAI, ROKETSAN, TUSAS Motor Sanayii (TEI) tedarikcisi
> **Urunler:** Fuze govde kaynak gruplari, motor tutucu braketler, yapisal kaynak asambleleri
> **Senaryo:** TAI'den gelen fuze motor tutucu braketi siparisi — hammadde alimi, kaynakci sertifika kontrolu, WPS hazirlik, paso paso uretim, NDT muayene, isil islem, sevkiyat ve faturaya kadar tum surecleri kapsar

---

## BILINEN KISITLAMALAR (Quvex'te Henuz Mevcut Degil)

> Bu kisitlamalar test sirasinda ilgili adimlarda **not alanlarina** yazilacaktir.
> Test raporunda bu maddeler "WORKAROUND" olarak isaretlenecektir.

| # | Eksik Modul/Ozellik | Workaround |
|---|---------------------|------------|
| K1 | WPS (Welding Procedure Specification) / WPQR ayri modul yok | Kontrol Plani + not alanlarina WPS bilgileri yazilir |
| K2 | Kaynakci sertifika suresi otomatik uyari yok | Kalibrasyon modulunde "ekipman" olarak kaynakci sertifikalari takip edilir |
| K3 | Pasolar arasi sicaklik otomatik kayit yok | ShopFloor terminalinde operasyon notlarina manuel girilir |
| K4 | NDT film/dijital goruntu yukleme ozel alani yok | Genel dosya eki (attachment) olarak yuklenir |
| K5 | Isi girdisi (heat input) otomatik hesaplama yok | Not alanina formul sonucu yazilir: HI = (V x A x 60) / (Hiz mm/dk x 1000) |
| K6 | Kaynak dikis haritasi (weld map) cizim modulu yok | PDF olarak yuklenir, kontrol planinda referans verilir |
| K7 | Koruyucu gaz akis hizi otomatik izleme yok | Operasyon parametrelerine manuel girilir |
| K8 | Arka koruma (purge) gaz O2 seviyesi kaydi yok | Not alanina ppm degeri yazilir |

---

## BOLUM 0: SISTEM KURULUMU (Tek Seferlik)

### 0.1 Makine / Ekipman Tanimlari
**Ekran:** Ayarlar > Makineler (`/settings/machines`)
**API:** `POST /machines`

| Makine Kodu | Makine Adi | Marka/Model | Yil | Saat Ucreti | Setup Ucreti |
|-------------|------------|-------------|-----|-------------|--------------|
| TIG-01 | TIG Kaynak Kabini 1 — Inconel/Paslanmaz | Lincoln Electric Invertec V310-T AC/DC | 2021 | 600 TL/saat | 200 TL/saat |
| TIG-02 | TIG Kaynak Kabini 2 — Aluminyum | Miller Dynasty 350 AC/DC | 2020 | 550 TL/saat | 200 TL/saat |
| TIG-03 | TIG Kaynak Kabini 3 — Genel Amacli | Fronius MagicWave 230i | 2022 | 500 TL/saat | 180 TL/saat |
| TIG-04 | TIG Kaynak Kabini 4 — Hassas Mikro Kaynak | Fronius TransTig 230i | 2023 | 650 TL/saat | 250 TL/saat |
| PLZ-01 | Plazma Kaynak Sistemi | Thermal Dynamics PWM-300 | 2019 | 700 TL/saat | 300 TL/saat |
| KES-01 | Bant Testere + Plazma Kesim | Behringer HBP-263A | 2018 | 250 TL/saat | 100 TL/saat |
| TEM-01 | Temiz Oda (Kaynak Oncesi Hazirlik) | Ozel Yapim — Laminar Akis | 2021 | 150 TL/saat | — |

**Dogrulama:**
- [ ] 7 makine/ekipman basariyla tanimlandi
- [ ] Saat ucretleri ve setup ucretleri girildi
- [ ] Makine listesinde tumu gorunuyor

### 0.2 Is Emri Adimlari (Operasyon Tanimlari — Kaynak Sureci)
**Ekran:** Ayarlar > Is Emri Adimlari (`/settings/work-order-steps`)
**API:** `POST /workordersteps`

| Kod | Operasyon Adi | Vars. Makine | Setup (dk) | Beceri |
|-----|--------------|-------------|------------|--------|
| OP10 | Hazirlik — Kesme, Pah Kirma, Temizleme | KES-01 + TEM-01 | 20 | 2 (Kalfa) |
| OP20 | Puntalama (Tack Welding) | TIG-01 | 15 | 3 (Usta) |
| OP30 | Kok Paso (Root Pass) | TIG-01 | 10 | 4 (Uzman — 6G Sertifikali) |
| OP40 | Dolgu Pasolari (Fill Passes) | TIG-01 | 5 | 3 (Usta) |
| OP50 | Kapak Paso (Cap Pass) | TIG-01 | 5 | 4 (Uzman) |
| OP60 | Temizleme + Gorsel Kontrol (VT) | — | 10 | 3 (Usta) |
| OP70 | NDT — Rontgen Muayene (Fason) | — | — | — (Fason) |
| OP80 | Isil Islem — Gerilim Giderme (Fason) | — | — | — (Fason) |
| OP90 | Son Boyut Kontrolu + Sertlik Testi | — | 15 | 4 (Uzman) |
| OP100 | Final Muayene + FAI + CoC | — | 30 | 4 (Uzman) |

**Dogrulama:**
- [ ] 10 operasyon adimi tanimlandi
- [ ] Fason operasyonlar (OP70, OP80) icin makine atanmadi
- [ ] Beceri seviyeleri kaynakci yetkinligine gore atandi

### 0.3 Genel Gider Yapilandirmasi
**Ekran:** Uretim > Maliyet Analizi (`/production/part-cost`)
**API:** `POST /partcost/overheads`

| Ad | Yuzde | Gecerlilik |
|----|-------|------------|
| Genel Imalat Giderleri | %20 | 2026-01-01 → — |
| Koruyucu Gaz Tuketimi (Argon) | %12 | 2026-01-01 → — |
| Amortisman | %8 | 2026-01-01 → — |
| Enerji (Kaynak Makineleri Yuksek Tuketim) | %10 | 2026-01-01 → — |

**Dogrulama:**
- [ ] 4 genel gider kalemi tanimlandi (%50 toplam overhead)
- [ ] Argon gaz tuketimi ayri kalem olarak takip ediliyor

### 0.4 Kalibrasyon Ekipmanlari
**Ekran:** Kalite > Kalibrasyon (`/quality/calibration`)
**API:** `POST /calibration/equipment`

| Kod | Ekipman | Marka/Model | Dogruluk | Frekans | Son Kalibrasyon | Sonraki |
|-----|---------|-------------|----------|---------|-----------------|---------|
| MIK-001 | Dis Mikrometre 0-25mm | Mitutoyo 103-137 | 0.001mm | Yillik | 2026-01-15 | 2027-01-15 |
| MIK-002 | Dis Mikrometre 25-50mm | Mitutoyo 103-138 | 0.001mm | Yillik | 2026-01-15 | 2027-01-15 |
| KAL-001 | Dijital Kumpas 0-200mm | Mitutoyo 500-197 | 0.01mm | 6 Aylik | 2026-02-01 | 2026-08-01 |
| AMP-001 | Kaynak Ampermetre (Clamp-on) | Fluke 376 FC | ±%1.5 | 6 Aylik | 2026-03-01 | 2026-09-01 |
| VOLT-001 | Kaynak Voltmetre | Fluke 87V | ±%0.05 | 6 Aylik | 2026-03-01 | 2026-09-01 |
| TEMP-001 | Temassiz Sicaklik Olcer (IR) | Fluke 62 MAX+ | ±%1.0 | Yillik | 2026-01-15 | 2027-01-15 |
| TEMP-002 | Temaslı Termokupl (K Tipi) | Omega HH-20A | ±%0.5 | 6 Aylik | 2026-02-01 | 2026-08-01 |
| SRT-001 | Sertlik Olcer (Portatif) | Proceq Equotip 550 | ±%0.5 HRC | Yillik | 2026-01-15 | 2027-01-15 |
| GAZ-001 | Gaz Akis Olcer (Argon) | Harris 355-2 | ±%2 | Yillik | 2026-01-15 | 2027-01-15 |
| O2-001 | Oksijen Analizoru (Purge) | Teledyne 3190 | ±10 ppm | 6 Aylik | 2026-03-01 | 2026-09-01 |

**Dogrulama:**
- [ ] 10 kalibrasyon ekipmani tanimlandi
- [ ] Kaynak spesifik olcum aletleri (ampermetre, voltmetre, sicaklik, O2) dahil
- [ ] Kalibrasyon tarihleri ve frekanslari girildi
- [ ] Dashboard'da uyumluluk % gorunuyor

### 0.5 Kaynakci Sertifika Takibi (WORKAROUND — Kalibrasyon Modulu)
**Ekran:** Kalite > Kalibrasyon (`/quality/calibration`)
**API:** `POST /calibration/equipment`

> **NOT:** Quvex'te kaynakci sertifika modulu bulunmadigi icin, kalibrasyon modulunde
> "ekipman" olarak kaynakci sertifikalari takip edilir. Kisitlama K2.

| Kod | "Ekipman" (Kaynakci) | Sertifika | Kapsam | Frekans | Son Yenileme | Sonraki |
|-----|----------------------|-----------|--------|---------|--------------|---------|
| KAY-001 | Ahmet Demir — Usta Kaynakci | AWS D17.1 + ASME IX | GTAW 6G, Inconel/Ni-bazli, SS, Al | 2 Yillik | 2025-06-15 | 2027-06-15 |
| KAY-002 | Mehmet Kaya — Usta Kaynakci | AWS D17.1 | GTAW 6G, Al 5083/6061, Ti | 2 Yillik | 2025-09-01 | 2027-09-01 |
| KAY-003 | Ali Yilmaz — Kaynakci | ASME IX | GTAW 6G, SS 304/316, CS | 2 Yillik | 2026-01-10 | 2028-01-10 |
| KAY-004 | Hasan Celik — Kaynakci (Plazma) | AWS D17.1 | PAW 2G, Inconel/Ti | 2 Yillik | 2025-11-20 | 2027-11-20 |

**Dogrulama:**
- [ ] 4 kaynakci sertifikasi kalibrasyon modulunde tanimlandi
- [ ] Kapsam bilgileri (pozisyon, malzeme, standart) not alanina yazildi
- [ ] Suresi dolan sertifikalar icin uyari gorunuyor
- [ ] KAY-001 (Ahmet Demir) Inconel kapsaminda — bu is emri icin uygun

---

## BOLUM 1: MUSTERI ve SOZLESME

### 1.1 Musteri Tanimi
**Ekran:** Musteriler (`/customers`)
**API:** `POST /customer`

```
Firma Adi: TAI — Turk Havacilik ve Uzay Sanayii A.S.
Yetkili: Burak Ozkan (Fuze Sistemleri Satin Alma)
Email: burak.ozkan@tai.com.tr
Telefon: +90 312 811 1800
Adres: Fethiye Mah. Havacilik Blv. No:17, 06980 Kazan/Ankara
Vergi No: 1234567890 | Vergi Dairesi: Kazan
Kategori: A (Stratejik Musteri)
Doviz: USD
Odeme Vadesi: 60 gun
```

**Musteri Notu:** AS9100+NADCAP kaynak zorunlu, AWS D17.1 kaynakci sertifikasi, %100 NDT,
MTR orijinal belge, isil islem sonrasi mekanik test raporu zorunlu

**Dogrulama:**
- [ ] Musteri karti olusturuldu
- [ ] Adres ve iletisim bilgileri girildi
- [ ] Kategori A (Stratejik) olarak isaretlendi
- [ ] Zorunlu kalite gereksinimleri not alanina yazildi
- [ ] AS9100 + NADCAP + AWS D17.1 gereksinimleri belgelendi

### 1.2 Sozlesme Gozden Gecirme (Contract Review — AS9100 8.2.3)
**Ekran:** Kalite > Sozlesme Gozden Gecirme
**API:** `POST /contractreview`

```
Musteri Gereksinimleri:
  - Malzeme: Inconel 718 (AMS 5662 — cubuk), dolgu: ERNiCrMo-3 (Inconel 625)
  - Kaynak Standardi: AWS D17.1 Sinif A (en yuksek kalite — havacilik yapisi)
  - WPS onayi zorunlu — her dikis tipi icin onaylanmis WPS referansi
  - Kaynakci sertifikasi: 6G pozisyon, AWS D17.1 kapsaminda
  - NDT: %100 Radyografik Muayene (RT) — ASTM E1742, kabul kriteri AWS D17.1
  - Isil islem: Gerilim giderme — AMS 5663 (620°C / 1 saat, firin sogutma)
  - Olcusel toleranslar: Cizim TAI-DWG-FMB-2026-001 Rev A
  - Teslimat: 20 adet, 60 gun icinde
  - Ozel kosullar: Her parca seri numarali, tam izlenebilirlik
  - FAI: Ilk 3 parca icin AS9102 raporu zorunlu
  - CoC: Her sevkiyatta Uygunluk Sertifikasi zorunlu
  - Data Pack: Malzeme sertifikasi + WPS + Kaynakci sertifikasi + NDT raporu + Isil islem raporu

Ozel Proses: Kaynak NADCAP(kendi), NDT fason NADCAP, Isil islem fason NADCAP
Ihracat: ITAR/EAR kontrolu gerekebilir (fuze bileseni)
Risk: YUKSEK (Inconel 718 kaynak — ozel proses, hassas malzeme)
```

**Dogrulama:**
- [ ] Contract review olusturuldu, tum gereksinimler belgelendi
- [ ] HasFirstArticle=true, HasCertificateRequirement=true, Risk=YUKSEK, ITAR notu
- [ ] Gozden gecirme APPROVED

---

## BOLUM 2: URUN ve MALZEME HAZIRLIGI

### 2.1 Urun Tanimi (Ana Urun — Kaynak Grubu)
**Ekran:** Urunler (`/products/form`)
**API:** `POST /product`

**Ana Urun:**
```
Urun Adi: Fuze Motor Tutucu Braketi — Inconel 718 Kaynak Grubu
Urun Kodu: TAI-FMB-2026-001
Revizyon: Rev A
Tip: Mamul (Finished Good)
Birim: Adet
Kalite Kontrol Gerekli: Evet
Seri Takip: Evet
Lot Takip: Evet
Teknik Cizim No: TAI-DWG-FMB-2026-001
Malzeme: Inconel 718 (AMS 5662)
Kaynak Standardi: AWS D17.1 Sinif A
```

**BOM (Malzeme Listesi):**
| # | Alt Urun | Tip | Miktar | Birim | Aciklama |
|---|----------|-----|--------|-------|----------|
| 1 | Inconel 718 Cubuk Ø50x120mm | Hammadde | 2 | Adet | AMS 5662 — MTR zorunlu |
| 2 | Inconel 718 Levha 100x80x6mm | Hammadde | 1 | Adet | AMS 5596 — MTR zorunlu |
| 3 | ERNiCrMo-3 Dolgu Teli Ø1.6mm | Sarf Malzeme | 0.5 | kg | AWS A5.14 — Lot sertifikasi zorunlu |
| 4 | Argon Gaz (%99.999 Saflik) | Sarf Malzeme | 2 | m3 | Saflik sertifikasi zorunlu |
| 5 | Tungsten Elektrot (%2 La2O3) Ø2.4mm | Sarf Malzeme | 3 | Adet | AWS A5.12 EWLa-2 |
| 6 | NDT Rontgen Muayene (Fason) | Hizmet | 1 | Takım | NADCAP onayli NDT firmasi |
| 7 | Isil Islem — Gerilim Giderme (Fason) | Hizmet | 1 | Takım | AMS 5663, NADCAP onayli |

**Dogrulama:**
- [ ] Ana urun + 7 BOM kalemi, seri/lot takip aktif, AWS D17.1-A not edildi, fason BOM'da

### 2.2 Ikinci Urun Tanimi (Al 5083 Yapisal Kaynak Grubu)
**Ekran:** Urunler (`/products/form`) | **API:** `POST /product`

```
Urun: Al 5083 Yapisal Kaynak Grubu — Govde Paneli (TAI-YKG-2026-002 Rev A)
Malzeme: Al 5083-H321 (AMS 4057) | Kaynak Standardi: AWS D17.1 Sinif B
```
> Ana senaryo Inconel 718 uzerinden yurutulur, Al 5083 farkliliklari Bolum 14'te.

**Dogrulama:** [ ] Urun tanimlandi, Al 5083 spec girildi, Sinif B not edildi

### 2.3 Kontrol Plani Tanimlama — WPS Bilgileri Dahil (AS9100 8.5.1.1)
**Ekran:** Kalite > Kontrol Planlari (`/quality/control-plans`)
**API:** `POST /controlplan` → `POST /controlplan/items`

```
Plan No: KP-TAI-FMB-001
Urun: Fuze Motor Tutucu Braketi — Inconel 718
Revizyon: A
Durum: DRAFT → ACTIVE
```

> **ONEMLI — WPS BILGILERI (Kisitlama K1 Workaround):**
> Kontrol planinin basina asagidaki WPS bilgileri **plan notu** olarak eklenir:
>
> ```
> === WPS (KAYNAK PROSEDUR SARTNAMESI) ===
> WPS No: WPS-INC718-GTAW-001 Rev A
> Kaynak Yontemi: GTAW (TIG) — AWS D17.1 Sinif A
> Temel Metal: Inconel 718 (UNS N07718), AMS 5662 / AMS 5596
> Dolgu Metali: ERNiCrMo-3 (Inconel 625), AWS A5.14, Ø1.6mm
> Koruyucu Gaz: Argon %99.999, akis hizi 12-18 L/dk
> Arka Koruma (Purge): Argon %99.999, O2 < 50 ppm (hedef < 20 ppm)
> On Isitma: Yok (Inconel — on isitma yapilmaz)
> Pasolar Arasi Sicaklik: Max 150°C
> Akım Araligi: 80-120A (DC, elektrot negatif — DCEN)
> Voltaj Araligi: 12-15V
> Kaynak Hizi: 80-150 mm/dk
> Tungsten Elektrot: EWLa-2 (%2 Lantanyum Oksit), Ø2.4mm
> Dikis Tipi: Alın dikisi (butt joint), V-agiz (60°±5°)
> Pozisyon: 6G (tum pozisyonlar)
> Isi Girdisi (Heat Input): Max 1.5 kJ/mm
>   Formul: HI = (V x A x 60) / (Hiz mm/dk x 1000)
>   Ornek: (14V x 100A x 60) / (120 mm/dk x 1000) = 0.70 kJ/mm — UYGUN
>
> === Al 5083 ICIN FARKLAR ===
> WPS No: WPS-AL5083-GTAW-002 Rev A
> Temel Metal: Al 5083-H321 (UNS A95083), AMS 4057
> Dolgu Metali: ER5356, AWS A5.10, Ø1.6mm
> On Isitma: 150°C (min) — temaslı termokupl ile dogrulama
> Pasolar Arasi Sicaklik: Max 200°C
> Akım: AC, 120-180A
> Koruyucu Gaz: Argon %99.998 (AC icin pure argon zorunlu)
> ```

**Kontrol Plani Kalemleri:**
| Adim | Proses Adimi | Karakteristik | Spesifikasyon | Tol+ | Tol- | Metod | Alet | Ornekleme | Kritik |
|------|-------------|---------------|---------------|------|------|-------|------|-----------|--------|
| 1 | OP10 Hazirlik | Pah acisi (V-agiz) | 60° | 5° | 5° | Olcum | Aci olcer | %100 | EVET |
| 2 | OP10 Hazirlik | Kok araligi (root gap) | 2.0mm | 0.5 | 0.5 | Olcum | Kaynak mastarı | %100 | EVET |
| 3 | OP10 Hazirlik | Yuzey temizligi | Yagsiz, oksitsiz | — | — | Gorsel | Goz | %100 | EVET |
| 4 | OP20 Puntalama | Punta sayisi ve konumu | Cizime gore | — | — | Gorsel | Goz + kumpas | %100 | Hayir |
| 5 | OP30 Kok Paso | Akim (A) | 80-120A | — | — | Olcum | AMP-001 | Her paso | EVET |
| 6 | OP30 Kok Paso | Voltaj (V) | 12-15V | — | — | Olcum | VOLT-001 | Her paso | EVET |
| 7 | OP30 Kok Paso | Kok nufuziyeti | Tam nufuziyet | — | — | Gorsel | Goz (ters taraf) | %100 | EVET |
| 8 | OP40 Dolgu | Pasolar arasi sicaklik | Max 150°C | — | — | Olcum | TEMP-001 / TEMP-002 | Her paso arasi | EVET |
| 9 | OP40 Dolgu | Isi girdisi (kJ/mm) | Max 1.5 | — | — | Hesap | Not alanı (K5) | Her paso | EVET |
| 10 | OP40 Dolgu | Arka koruma O2 seviyesi | < 50 ppm | — | — | Olcum | O2-001 | Surekli | EVET |
| 11 | OP50 Kapak Paso | Dikis genisligi | Cizime gore ±1mm | 1.0 | 1.0 | Olcum | KAL-001 | %100 | Hayir |
| 12 | OP50 Kapak Paso | Dikis yuksekligi (takviye) | Max 1.5mm | — | — | Olcum | KAL-001 | %100 | EVET |
| 13 | OP60 Gorsel (VT) | Catlak | Yok — kabul edilemez | — | — | Gorsel | Buyutec 10x | %100 | EVET |
| 14 | OP60 Gorsel (VT) | Gozeneklilik (porosity) | AWS D17.1 Tablo 8.1 | — | — | Gorsel | Buyutec 10x | %100 | EVET |
| 15 | OP60 Gorsel (VT) | Alt kesme (undercut) | Max 0.25mm | — | — | Olcum | Kaynak mastarı | %100 | EVET |
| 16 | OP60 Gorsel (VT) | Sicrama (spatter) | Yok — tam temizlik | — | — | Gorsel | Goz | %100 | Hayir |
| 17 | OP60 Gorsel (VT) | Renk degisimi (oksidlenme) | Acik saman sarisi kabul | — | — | Gorsel | Goz | %100 | EVET |
| 18 | OP70 NDT (RT) | Radyografik muayene | ASTM E1742, kabul: AWS D17.1 | — | — | RT | Fason NDT | %100 | EVET |
| 19 | OP80 Isil Islem | Firin sicakligi | 620°C ±10°C | 10 | 10 | Kayit | Firin chart | %100 | EVET |
| 20 | OP80 Isil Islem | Tutma suresi | 60 dk (min) | — | — | Kayit | Firin chart | %100 | EVET |
| 21 | OP80 Isil Islem | Sogutma yontemi | Firin sogutma (< 50°C/saat) | — | — | Kayit | Firin chart | %100 | EVET |
| 22 | OP90 Son Kontrol | Sertlik (HRC) | 36-42 HRC (AMS 5663 sonrasi) | — | — | Olcum | SRT-001 | %100 | EVET |
| 23 | OP90 Son Kontrol | Kaynak carpilmasi — duzluk | Max 0.5mm/100mm | — | — | Olcum | Duzluk mastarı | %100 | EVET |
| 24 | OP90 Son Kontrol | Genel boyutlar | Cizim TAI-DWG-FMB-2026-001 | — | — | Olcum | KAL-001 + MIK-001 | %100 | EVET |
| 25 | OP100 Final | Tum boyutlar + gorsel | AS9102 FAI formu | — | — | Tum | Tum | %100 | — |

**Muayene Noktasi Baglantisi:**
**API:** `POST /workordersteps/{id}/inspection-points`

- OP10 → Kalem 1, 2, 3
- OP20 → Kalem 4
- OP30 → Kalem 5, 6, 7
- OP40 → Kalem 8, 9, 10
- OP50 → Kalem 11, 12
- OP60 → Kalem 13, 14, 15, 16, 17
- OP70 → Kalem 18
- OP80 → Kalem 19, 20, 21
- OP90 → Kalem 22, 23, 24
- OP100 → Kalem 25

**Dogrulama:**
- [ ] Kontrol plani ACTIVE, 25 muayene noktasi, 18 KC, WPS notta (K1), operasyonlara bagli

---

## BOLUM 3: TEKLIF ve SIPARIS

### 3.1 Teklif Hazirlama
**Ekran:** Teklifler (`/offers/form`)
**API:** `POST /offer`

```
TKL-2026-0147 | TAI | 30 gun gecerlilik | USD
  1. Fuze Motor Tutucu Braketi Inc718 (TAI-FMB-2026-001): 20 ad x $320 = $6,400
  2. Al 5083 Yapisal Kaynak Grubu (TAI-YKG-2026-002): 30 ad x $145 = $4,350
  Toplam: $10,750 | Teslimat: +60 gun | FAI: ilk 3 adet AS9102
  NDT+isil islem fason NADCAP onayli | Data pack her sevkiyatta
```

**Dogrulama:**
- [ ] Teklif olusturuldu, kodu otomatik atandi
- [ ] 2 kalem (Inconel braket + Al kaynak grubu) dogru fiyatlarla girildi
- [ ] Teklif durumu: HAZIRLANDI

### 3.2 Teklif Onay → Siparis Donusumu
**Ekran:** Teklifler → Siparislere Aktar
**API:** `PUT /offer/change-status/{id}/APPROVED` → `POST /sales`

```
Siparis No: SIP-2026-0198
Kaynak Teklif: TKL-2026-0147
Musteri PO No: TAI-PO-FMB-2026-3847
Toplam: $10,750.00
Teslimat Tarihi: 2026-06-10
```

**Dogrulama:**
- [ ] Teklif durumu APPROVED oldu
- [ ] Satis siparisi olusturuldu
- [ ] Musteri PO numarasi islendi
- [ ] Teslimat tarihi 60 gun sonrasina ayarlandi

---

## BOLUM 4: SATIN ALMA ve MAL KABUL

### 4.1 Hammadde Satin Alma — Inconel 718 Cubuk
**Ekran:** Satinalma (`/purchasing/form`)
**API:** `POST /purchasing`

```
Tedarikci: Bohler Turkiye | PO: SA-2026-0312
  1. Inconel 718 Cubuk Ø50x120 — 50 ad x $85 (AMS 5662, MTR ZORUNLU)
  2. Inconel 718 Levha 100x80x6 — 25 ad x $65 (AMS 5596, MTR ZORUNLU)
  3. ERNiCrMo-3 Dolgu Teli Ø1.6 — 10 kg x $120 (AWS A5.14, lot sertifika, nem kontrollu)
  4. Argon Gaz %99.999 — 5 tup x $45 (ISO 14175-I1, saflik sertifika ZORUNLU)
```

**Dogrulama:**
- [ ] SA olusturuldu (4 kalem), tedarikci dogru, MTR/sertifika gereksinimleri not edildi

### 4.2 Mal Kabul — Girdi Kalite Kontrol
**Ekran:** Satinalma > Mal Kabul / Kalite > Muayene
**API:** `PUT /purchasing/{id}/receive` → `POST /inspection`

**Adim 1: Fiziksel Mal Kabul** — Tarih: 2026-04-15, Irsaliye: BLR-2026-7842
- [ ] Paket hasari yok, miktar dogru (50 cubuk, 25 levha, 10kg tel, 5 tup gaz), etiketler OK

**Adim 2: Malzeme Sertifikasi (MTR) Dogrulama**
**Ekran:** Kalite > Malzeme Sertifikalari (`/quality/material-certificates`) | **API:** `POST /materialcertificate`

**Inconel 718 Cubuk — MTR Kontrolu:**
```
Sertifika No: BLR-MTR-2026-4521 | Heat No: HT-718-2026-0089 | Lot No: LT-5662-0412

Kimyasal Kompozisyon (AMS 5662): Ni 52.8%, Cr 19.1%, Fe 18.2%, Nb+Ta 5.12%,
  Mo 3.05%, Ti 0.92%, Al 0.55%, Co 0.15%, C 0.04%, S 0.002%, P 0.008% → Tumu UYGUN

Mekanik: UTS 1310 MPa (min 1240), Akma 1095 MPa (min 1035),
  Uzama %16.5 (min %12), Sertlik 39 HRC (min 36) → Tumu UYGUN

Sonuc: KABUL
```

**Dogrulama:**
- [ ] MTR yuklendi, heat/lot no girildi, 11 element+mekanik UYGUN, durum: ONAYLANDI

**ERNiCrMo-3 Dolgu Teli — Lot Sertifika Kontrolu:**
Lot: AWS-LT-625-2026-0087 | Sertifika: LS-A514-0087
- [ ] Lot no etiketle eslesti, kimya AWS A5.14 OK, Ø1.6mm ±0.02 OK, ambalaj bozulmamis

### 4.3 Giris Kalite Kontrol — Boyutsal ve Yuzey
**Ekran:** Kalite > Muayene | **API:** `POST /inspection`

```
GKK-2026-0089 | Inconel 718 Cubuk Ø50 | 5 numune (%10)
Cap Ø50: 50.02-50.06mm (spec +0.10/-0) → UYGUN
Boy 120: 120.1-120.3mm (spec +0.50/-0) → UYGUN
Yuzey: Oksitsiz, capaksiz → UYGUN | Sonuc: KABUL — Uretime serbest
```

**Dogrulama:**
- [ ] GKK olusturuldu, 5 numune 4 parametre UYGUN, malzeme uretime serbest

---

## BOLUM 5: IS EMRI ve URETIM

### 5.1 Is Emri Olusturma
**Ekran:** Uretim > Is Emirleri (`/production/work-orders/form`)
**API:** `POST /workorder`

```
Is Emri No: IE-2026-0198-001
Satis Siparisi: SIP-2026-0198
Urun: Fuze Motor Tutucu Braketi — Inconel 718 (TAI-FMB-2026-001)
Miktar: 20 adet (+ 2 adet yedek parca = 22 toplam uretim)
Bitis Tarihi: 2026-06-05 (sevkiyat oncesi 5 gun kalite kontrol suresi)
Oncelik: Yuksek
```

**Operasyon Routing (Is Emri Adimlari):**
| Sira | Operasyon | Makine | Planlanan Sure (dk/parca) | Kaynakci | Notlar |
|------|-----------|--------|---------------------------|----------|--------|
| OP10 | Hazirlik — Kesme, Pah, Temizlik | KES-01 + TEM-01 | 25 | — | V-agiz 60°, aseton temizlik |
| OP20 | Puntalama | TIG-01 | 10 | KAY-001 (Ahmet Demir) | Min 4 punta, simetrik |
| OP30 | Kok Paso (Root Pass) | TIG-01 | 20 | KAY-001 (Ahmet Demir) | 90A, 13V, tam nufuziyet |
| OP40 | Dolgu Pasolari (Fill — 3 paso) | TIG-01 | 35 | KAY-001 (Ahmet Demir) | 100A, 14V, HI < 1.5 kJ/mm |
| OP50 | Kapak Paso | TIG-01 | 15 | KAY-001 (Ahmet Demir) | 95A, 13V, takviye max 1.5mm |
| OP60 | Temizleme + VT | — | 15 | Kalite Teknisyeni | AWS D17.1 gorsel kriterler |
| OP70 | NDT — RT (Fason) | — | — | Fason NDT | ASTM E1742 |
| OP80 | Isil Islem (Fason) | — | — | Fason Isil Islem | AMS 5663, 620°C/1h |
| OP90 | Son Kontrol + Sertlik | — | 20 | Kalite Muduru | HRC 36-42, carpilma max 0.5mm |
| OP100 | Final Muayene + FAI | — | 30 | Kalite Muduru | AS9102 (ilk 3 adet) |

**Dogrulama:**
- [ ] IE olusturuldu, SIP bagli, 10 op routing, KAY-001 atandi, fason OP70/OP80 isaretli

### 5.2 Kaynakci Sertifika Dogrulamasi (Uretim Oncesi)
**Ekran:** Kalite > Kalibrasyon — KAY-001 | **API:** `GET /calibration/equipment/KAY-001`

```
KAY-001 Ahmet Demir: AWS D17.1+ASME IX, GTAW 6G, Inconel/Ni-bazli
Gecerlilik: 2025-06-15 → 2027-06-15 — GECERLI | Sureklilik: Ocak 2026 — OK
```

**Dogrulama:**
- [ ] Sertifika gecerli, kapsam Inconel uygun, sureklilik OK, is emrine not eklendi

### 5.3 Uretim Baslangici — OP10: Hazirlik
**Ekran:** ShopFloor Terminal (`/shop-floor`)
**API:** `POST /workorder/{id}/start-operation`
**Rol:** Operator (Kalfa seviyesi)

```
Operasyon: OP10 — Hazirlik (Kesme, Pah Kirma, Temizleme)
Baslangic: 2026-04-16 08:00
Operator: Mustafa Sahin (Kalfa)

Islem Adimlari:
  1. Inconel 718 cubuk (Ø50x120mm) bant testerede kesildi
     - Kesme parametreleri: dusuk hiz, sogutma sivisi ile
     - Not: Inconel sert malzeme — testere omru kisitli
  
  2. V-agiz (60°±5°) takim tezgahinda acildi
     - Olcum: Aci olcer ile 62° olculdu → UYGUN (60°+5° limitinde)
  
  3. Kok araligi (root gap) ayarlandi
     - Olcum: Kaynak mastariyla 2.0mm → 1.8mm olculdu → UYGUN (2.0±0.5mm)
  
  4. Temiz odada (TEM-01) temizleme:
     - Aseton ile yaglarin temizlenmesi
     - Paslanmaz celik tel firca ile mekanik temizleme
     - Son kontrol: beyaz bez testi — iz yok → UYGUN
  
Bitis: 2026-04-16 08:25
Gercek Sure: 25 dk/parca
```

**Dogrulama:**
- [ ] OP10 baslatildi ve tamamlandi
- [ ] Pah acisi ve kok araligi olcum sonuclari girildi
- [ ] Temizlik kontrolu notu eklendi
- [ ] Operasyon suresi kaydedildi

### 5.4 Uretim — OP20: Puntalama (Tack Welding)
**Ekran:** ShopFloor Terminal (`/shop-floor`)
**API:** `POST /workorder/{id}/start-operation`
**Rol:** Operator (Usta Kaynakci — KAY-001)

```
Operasyon: OP20 — Puntalama
Makine: TIG-01 (Lincoln Invertec V310-T)
Kaynakci: Ahmet Demir (KAY-001)
Baslangic: 2026-04-16 08:30

Islem:
  - Parcalar fikstirde hizalandi
  - 4 adet punta kaynagi yapildi (simetrik, 90° aralikli)
  - Punta parametreleri: 70A, 12V, kisa ark
  - Puntalar arasi hizalama kontrolu: kumpas ile OK
  
  Koruyucu Gaz:
  - On gaz: Argon 15 L/dk
  - Arka gaz (purge): Argon, O2 olcumu → 18 ppm → UYGUN (< 50 ppm)
  
Bitis: 2026-04-16 08:40
Gercek Sure: 10 dk/parca
```

**Dogrulama:**
- [ ] OP20 tamamlandi
- [ ] Kaynakci (KAY-001) kayda girdi
- [ ] Punta konumlari ve sayisi not edildi
- [ ] Purge O2 seviyesi kaydedildi (18 ppm — Kisitlama K8)

### 5.5 Uretim — OP30: Kok Paso (Root Pass) — KRITIK ADIM
**Ekran:** ShopFloor Terminal (`/shop-floor`)
**API:** `POST /workorder/{id}/start-operation`
**Rol:** Operator (Uzman Kaynakci — KAY-001)

```
Operasyon: OP30 — Kok Paso (Root Pass)
Makine: TIG-01
Kaynakci: Ahmet Demir (KAY-001)
Baslangic: 2026-04-16 08:45

Kaynak Parametreleri (Her parca icin kayit):
  | Parametre | WPS Degeri | Gercek | Durum |
  |-----------|-----------|--------|-------|
  | Akim (A) | 80-120A | 90A | UYGUN |
  | Voltaj (V) | 12-15V | 13V | UYGUN |
  | Hiz (mm/dk) | 80-150 | 110 | UYGUN |
  | Isi Girdisi | Max 1.5 kJ/mm | 0.64 kJ/mm | UYGUN |
  | Koruyucu Gaz | 12-18 L/dk | 15 L/dk | UYGUN |
  | Purge O2 | < 50 ppm | 15 ppm | UYGUN |
  
  Isi Girdisi Hesabi (Kisitlama K5 — not alanina yazilir):
    HI = (13V x 90A x 60) / (110 mm/dk x 1000) = 0.64 kJ/mm — UYGUN

  Gorsel Kontrol (kok paso ters taraf):
  - Tam nufuziyet: EVET — ters tarafta duzgun dikis gorunuyor
  - Kok paso iç yuzey: Duzgun, cokme yok
  - Renk: Acik altin sarisi — UYGUN (argon koruması yeterli)

Bitis: 2026-04-16 09:05
Gercek Sure: 20 dk/parca
```

**Dogrulama:**
- [ ] OP30 tamamlandi
- [ ] Kaynak parametreleri (akim, voltaj, hiz) kaydedildi
- [ ] Isi girdisi hesaplandi ve not alanina yazildi (K5)
- [ ] Kok nufuziyeti gorsel kontrolu UYGUN
- [ ] Purge O2 degeri kaydedildi (K8)

### 5.6 Uretim — OP40: Dolgu Pasolari (Fill Passes) — 3 Paso
**Ekran:** ShopFloor Terminal (`/shop-floor`)
**API:** `POST /workorder/{id}/start-operation`
**Rol:** Operator (Usta Kaynakci — KAY-001)

```
Operasyon: OP40 — Dolgu Pasolari
Makine: TIG-01
Kaynakci: Ahmet Demir (KAY-001)
Baslangic: 2026-04-16 09:10

=== PASO 1 (Dolgu 1) ===
  Sicaklik Kontrolu (paso oncesi): 85°C → UYGUN (max 150°C)
  | Parametre | Gercek |
  |-----------|--------|
  | Akim | 100A |
  | Voltaj | 14V |
  | Hiz | 120 mm/dk |
  | HI | 0.70 kJ/mm |
  | Purge O2 | 12 ppm |
  Gorsel: Temiz dikis, capak yok → UYGUN

=== PASO 2 (Dolgu 2) ===
  Sicaklik Kontrolu (paso oncesi): 120°C → UYGUN (max 150°C)
  Not: Sicaklik yukselmekte — bekleme suresi gerekebilir
  | Parametre | Gercek |
  |-----------|--------|
  | Akim | 105A |
  | Voltaj | 14V |
  | Hiz | 115 mm/dk |
  | HI | 0.77 kJ/mm |
  | Purge O2 | 14 ppm |
  Gorsel: UYGUN

=== PASO 3 (Dolgu 3) ===
  Sicaklik Kontrolu (paso oncesi): 145°C → UYGUN (max 150°C — sinirda!)
  UYARI: Sicaklik sinira yakin — 5 dk bekleme uygulandi
  Bekleme sonrasi: 128°C → devam edildi
  | Parametre | Gercek |
  |-----------|--------|
  | Akim | 100A |
  | Voltaj | 14V |
  | Hiz | 125 mm/dk |
  | HI | 0.67 kJ/mm |
  | Purge O2 | 16 ppm |
  Gorsel: UYGUN

Bitis: 2026-04-16 09:45
Gercek Sure: 35 dk/parca (bekleme dahil)
```

**Dogrulama:**
- [ ] 3 dolgu pasosu tamamlandi ve ayri ayri kaydedildi
- [ ] Her paso oncesi sicaklik olcumu yapildi (Kisitlama K3 — manuel)
- [ ] Paso 3'te sicaklik uyarisi not edildi (145°C — sinirda)
- [ ] Bekleme suresi ve soguma kaydedildi
- [ ] Her paso icin isi girdisi hesaplandi — tumu < 1.5 kJ/mm

### 5.7 Uretim — OP50: Kapak Paso (Cap Pass)
**Ekran:** ShopFloor Terminal (`/shop-floor`)
**API:** `POST /workorder/{id}/start-operation`
**Rol:** Operator (Uzman Kaynakci — KAY-001)

```
Operasyon: OP50 — Kapak Paso
Makine: TIG-01
Kaynakci: Ahmet Demir (KAY-001)
Baslangic: 2026-04-16 09:50

Sicaklik Kontrolu (paso oncesi): 95°C → UYGUN
  | Parametre | Gercek |
  |-----------|--------|
  | Akim | 95A |
  | Voltaj | 13V |
  | Hiz | 100 mm/dk |
  | HI | 0.74 kJ/mm |
  | Purge O2 | 18 ppm |

Kapak Paso Spesifik Kontroller:
  - Dikis genisligi: 12.5mm (spec: 12.0±1.0mm) → UYGUN
  - Dikis yuksekligi (takviye): 1.2mm (max 1.5mm) → UYGUN
  - Kenar gecis acisi: Duzgun, keskin gecis yok → UYGUN

Bitis: 2026-04-16 10:05
Gercek Sure: 15 dk/parca
```

**Dogrulama:**
- [ ] OP50 tamamlandi
- [ ] Kapak paso boyutlari (genislik, yukseklik) olculdu ve kaydedildi
- [ ] Tum kaynak parametreleri WPS limitlerinde

### 5.8 Uretim — OP60: Temizleme + Gorsel Muayene (VT)
**Ekran:** ShopFloor Terminal + Kalite > Muayene
**API:** `POST /workorder/{id}/start-operation` → `POST /inspection`
**Rol:** Kalite Teknisyeni + Kalite Muduru (Onay)

```
Operasyon: OP60 — Temizleme ve Gorsel Muayene (VT)
Baslangic: 2026-04-16 10:10
Inspector: Kalite Teknisyeni + Kalite Muduru onay

=== TEMIZLEME ===
  - Paslanmaz celik tel firca ile curuf temizligi
  - Aseton ile son temizlik
  - Sicrama (spatter) kontrolu: Yok — TIG prosesinde beklenen

=== GORSEL MUAYENE (VT) — AWS D17.1 Sinif A ===
  10 kriter: Catlak(yok), Gozeneklilik(yok), Alt kesme(0.1mm<0.25), Nufuziyet(tam),
  Ergime eksikligi(yok), Sicrama(yok-TIG), Profil(duzgun), Renk(acik altin-OK),
  Carpilma(yok), Baslangic/bitis(temiz) → 10/10 UYGUN

=== PARCA #7 — UYGUNSUZLUK ===
  Gozeneklilik: Ø1.2mm goz (maks Ø0.8mm) → RET → NCR (Bolum 6)

Bitis: 2026-04-16 11:30
```

**Dogrulama:**
- [ ] 20 parca icin gorsel muayene yapildi
- [ ] 19 parca KABUL, 1 parca (#7) RET
- [ ] RET nedeni detayli belgelendi (gozeneklilik Ø1.2mm > maks Ø0.8mm)
- [ ] Gorsel muayene sonuclari is emrine baglandi
- [ ] Ret olan parca icin NCR sureci tetiklendi

---

## BOLUM 6: UYGUNSUZLUK YONETIMI (NCR/CAPA)

### 6.1 NCR Olusturma — Parca #7 Gozeneklilik
**Ekran:** Kalite > NCR (`/quality/ncr/form`)
**API:** `POST /ncr`
**Rol:** Kalite Muduru

```
NCR-2026-0034 | IE-2026-0198-001 | Parca #7 | OP60-VT | 2026-04-16
Bulgu: Dikis ortasinda Ø1.2mm goz (porosity) — AWS D17.1-A maks Ø0.8mm → SINIR DISI
Sinif: MAJOR (fuze bileseni — guvenlik etkili)
Olasi nedenler: 1) Dolgu telinde nem 2) Gaz akis dususu 3) Mikro kirlilik 4) Ark mesafesi
Karar: TAMIR — taslama + yeniden kaynak
```

**Dogrulama:**
- [ ] NCR olusturuldu ve is emrine baglandi
- [ ] Uygunsuzluk detayli tanimlandi (olcu, kriter, siniflandirma)
- [ ] Olasi nedenler listelendi
- [ ] Karar: TAMIR olarak secildi
- [ ] NCR durumu: ACIK

### 6.2 Tamir Kaynagi Uygulama
**Ekran:** ShopFloor Terminal + NCR takibi
**API:** `PUT /ncr/{id}/update`
**Rol:** Usta Kaynakci (KAY-001) + Kalite Muduru (onay)

```
1. Taslama: Karbur freze ile gozenekli bolge acildi (3.2mm derinlik), PT→TEMIZ
2. Temizleme: Aseton + paslanmaz tel firca, beyaz bez testi→TEMIZ
3. Tamir kaynagi: KAY-001, 85A/12.5V yavas ilerleyis, HI 0.55 kJ/mm
4. Yeniden VT: Gozeneklilik YOK, catlak YOK, profil UYGUN → KABUL
5. NOT: NDT (RT) TEKRAR yapilacak (Bolum 7)
```

**Dogrulama:**
- [ ] Tamir kaynagi adimlari belgelendi
- [ ] Penetrant test sonucu (tamir oncesi) kaydedildi
- [ ] Tamir kaynagi parametreleri kaydedildi
- [ ] Yeniden gorsel muayene KABUL
- [ ] NCR durumu: TAMIR TAMAMLANDI — NDT BEKLIYOR
- [ ] Tekrar NDT gereksinimleri not edildi

### 6.3 CAPA Baslat (Duzeltici Faaliyet)
**Ekran:** Kalite > CAPA
**API:** `POST /capa`
**Rol:** Kalite Muduru

```
CAPA-2026-0018 | NCR-2026-0034 | Duzeltici Faaliyet
Kok Neden: Dolgu teli nem almasi (atolye nem %68, max %50 olmali)
Aksiyonlar: 1) Depolama kabin silika jel (Depo, 04-20) 2) Gunluk nem kaydi (Kalite, 04-18)
  3) Acik tel 4 saat limiti (Kalite, 04-22) 4) Nem etkisi egitimi (Kalite, 04-25)
Dogrulama: 2026-05-15
```

**Dogrulama:**
- [ ] CAPA olusturuldu ve NCR'a baglandi
- [ ] Kok neden belgelendi (dolgu telinde nem)
- [ ] 4 aksiyon maddesi tanimlandi
- [ ] Her aksiyon icin sorumlu ve termin belirlendi
- [ ] CAPA durumu: ACIK

---

## BOLUM 7: FASON ISLEMLER (NDT + ISIL ISLEM)

### 7.1 Fason NDT Siparisi — Rontgen (RT) Muayene
**Ekran:** Fason Siparisler (`/subcontract-orders/form`)
**API:** `POST /subcontractorder`
**Rol:** Satinalma

```
FSN-2026-0089 | Safran NDT Hizmetleri A.S. (NADCAP: NDT-0892741)
IE: IE-2026-0198-001 | OP70 | 21 adet (20+1 tamir) | RT ASTM E1742, kabul AWS D17.1-A
Film: D4/dijital, IQI: ASTM E747 | $35/parca = $735 | Termin: 2026-04-22
Not: #7 tamir kaynagi isaretli, RT film/goruntu teslimi (K4), dikis haritasi ekte (K6)
```

**Dogrulama:**
- [ ] FSN olusturuldu, NADCAP tedarikci, #7 tamir notu, ASTM E1742 standart, IE bagli

### 7.2 NDT Sonuc Degerlendirme
**Ekran:** Fason Siparisler > Sonuc Girisi + Kalite > Muayene
**API:** `PUT /subcontractorder/{id}/complete` → `POST /inspection`
**Rol:** Kalite Muduru

```
NDT Rapor No: SAFRAN-RT-2026-4521
Tarih: 2026-04-22
Muayene Eden: Safran NDT — Seviye III RT Uzmani

Sonuclar:
  - Parca #1-#6, #8-#21: Alin dikisi, IQI 2-2T, bulgu yok → KABUL
  - Parca #7 (tamir): IQI 2-2T, tamir bolgesi temiz, yeni goz yok → KABUL

Genel Sonuc: 21/21 KABUL — AWS D17.1 Sinif A kriterlerine uygun
```

**Dogrulama:**
- [ ] NDT raporu sisteme girildi
- [ ] 21 parcanin tumu KABUL
- [ ] Parca #7 (tamir sonrasi) KABUL — NCR kapatilabilir
- [ ] RT filmleri/dijital goruntuler dosya eki olarak yuklendi (K4)
- [ ] Fason siparis durumu: TAMAMLANDI
- [ ] NCR-2026-0034 durumu: KAPATILDI (tamir basarili, NDT kabul)

### 7.3 Fason Isil Islem Siparisi — Gerilim Giderme
**Ekran:** Fason Siparisler (`/subcontract-orders/form`)
**API:** `POST /subcontractorder`
**Rol:** Satinalma

```
FSN-2026-0090 | Anatolian Heat Treatment A.S. (NADCAP: HT-0756892)
IE: IE-2026-0198-001 | OP80 | 21 adet | Gerilim Giderme AMS 5663
620°C ±10°C, 60 dk min, firin sogutma max 50°C/saat, vakum/argon atmosfer
$28/parca = $588 | Termin: 2026-04-28
Not: Firin chart + SAT gecerli firin + kontakt termokupl zorunlu, parcalar temassiz dikey
```

**Dogrulama:**
- [ ] Fason isil islem siparisi olusturuldu
- [ ] NADCAP onayli tedarikci secildi
- [ ] Isil islem parametreleri (sicaklik, sure, sogutma) detayli belirtildi
- [ ] Firin chart talebi notu eklendi
- [ ] Is emrine baglandi (OP80)

### 7.4 Isil Islem Sonuc Kabul
**Ekran:** Fason Siparisler > Sonuc Girisi
**API:** `PUT /subcontractorder/{id}/complete`
**Rol:** Kalite Muduru

```
AHT-2026-SR-0412 | Firin: VAC-03 | SAT: 2026-03-15 (gecerli)
Isitma: 180dk→620°C | Tutma: 620°C±8°C, 65dk (min 60→OK) | Sogutma: 42°C/saat (max 50→OK)
Atmosfer: Vakum <10^-3 mbar | Sonuc: 21/21 basarili
```

**Dogrulama:**
- [ ] Isil islem raporu ve firin chart sisteme yuklendi
- [ ] Sicaklik, sure, sogutma hizi parametreleri kontrol edildi — UYGUN
- [ ] SAT gecerliligi dogrulandi
- [ ] Fason siparis durumu: TAMAMLANDI

---

## BOLUM 8: SON KONTROL ve KALITE ONAY

### 8.1 OP90: Son Boyut Kontrolu + Sertlik Testi
**Ekran:** Kalite > Muayene + ShopFloor Terminal
**API:** `POST /inspection`
**Rol:** Kalite Muduru

```
Operasyon: OP90 — Son Boyut Kontrolu + Sertlik Testi
Tarih: 2026-04-29

=== SERTLIK TESTI (Isil islem sonrasi) ===
  Alet: Proceq Equotip 550 (SRT-001) | Spec: AMS 5663 sonrasi — 36-42 HRC
  Sonuc: 20/20 UYGUN — Aralik: 38.1-39.5 HRC (3 olcum ortalamasi/parca)

=== KAYNAK CARPILMASI OLCUMU ===
  Alet: Duzluk mastari + feeler gauge | Spec: Max 0.5mm/100mm
  Sonuc: 20/20 UYGUN — Aralik: 0.12-0.35 mm/100mm
  Not: Parca #7 (tamir) en yuksek: 0.35mm — limitde ama UYGUN

=== BOYUTSAL KONTROL ===
  Referans: TAI-DWG-FMB-2026-001 Rev A | Alet: KAL-001 + MIK-001
  | Olcum | Spec | Tolerans | Min | Max | Durum |
  |-------|------|----------|-----|-----|-------|
  | Toplam boy | 115.0mm | ±0.3 | 114.8 | 115.2 | UYGUN |
  | Braket genislik | 80.0mm | ±0.2 | 79.9 | 80.15 | UYGUN |
  | Montaj deligi Ø | 12.0mm H7 | +0.018/0 | 12.002 | 12.015 | UYGUN |
  | Dikis merkez | 45.0mm | ±0.5 | 44.7 | 45.3 | UYGUN |
```

**Dogrulama:**
- [ ] 20/20 sertlik (36-42 HRC), 20/20 carpilma (<0.5mm), boyutsal UYGUN, #7 limitde (0.35mm)

### 8.2 OP100: FAI — Ilk Parca Muayenesi (AS9102)
**Ekran:** Kalite > FAI (`/quality/fai`)
**API:** `POST /fai`
**Rol:** Kalite Muduru

```
FAI No: FAI-2026-0042
Urun: Fuze Motor Tutucu Braketi — Inconel 718 (TAI-FMB-2026-001)
Revizyon: Rev A
Parcalar: #1, #2, #3 (ilk 3 adet)

Form 1: 24 olcum noktasi — tumu UYGUN
Form 2: Inc718 AMS5662 (Bohler) + Dolgu AWS A5.14 + GTAW AWS D17.1 (NADCAP) +
  NDT ASTM E1742 (Safran) + Isil islem AMS 5663 (Anatolian) → 5/5 UYGUN
Form 3: 24 nokta x 3 parca = 72 olcum → tumu UYGUN
Sonuc: KABUL — Seri uretime serbest | Onay: Kalite Muduru, 2026-04-30
```

**Dogrulama:**
- [ ] FAI kaydi olusturuldu (AS9102 formati)
- [ ] Form 1: 24 olcum noktasi tanimlandi
- [ ] Form 2: 5 malzeme/ozel proses referansi girildi
- [ ] Form 3: 72 olcum (3 parca x 24 nokta) kaydedildi — tumu UYGUN
- [ ] FAI durumu: KABUL
- [ ] Kalite Muduru onayi alindi

### 8.3 CoC (Uygunluk Sertifikasi) Olusturma
**Ekran:** Kalite > CoC (`/quality/coc`)
**API:** `POST /coc`
**Rol:** Kalite Muduru

```
CoC No: COC-2026-0198
Satis Siparisi: SIP-2026-0198
Musteri PO: TAI-PO-FMB-2026-3847
Urun: Fuze Motor Tutucu Braketi — Inconel 718
Miktar: 20 adet
Revizyon: Rev A

Beyan: 20 adet parca — Inc718 AMS5662, AWS D17.1-A, %100 RT, AMS5663 isil islem,
  AS9102 FAI kabul, seri numarali, tam izlenebilirlik

Data Pack (10 ek): MTR, Dolgu lot sertifika, WPS referans, Kaynakci sertifika,
  NDT raporu, Isil islem+firin chart, Sertlik, Boyutsal, FAI (AS9102), Seri no listesi

Onaylayan: Kalite Muduru | Tarih: 2026-05-01
```

**Dogrulama:**
- [ ] CoC olusturuldu ve satis siparisine baglandi
- [ ] Beyan metni tum standart referanslarini iceriyor
- [ ] 10 ek belge (data pack) listelendi
- [ ] Kalite Muduru onayi verildi
- [ ] CoC yazdirmaya hazir

---

## BOLUM 9: SERI NUMARA ve IZLENEBILIRLIK

### 9.1 Seri Numara Atama
**Ekran:** Uretim > Seri Numaralari (`/production/serial-numbers`)
**API:** `POST /serialnumber` | **Rol:** Uretim Muduru

```
Format: FMB-2026-XXXX | Aralik: FMB-2026-0001 → FMB-2026-0020
Her seri numarada: Heat No (HT-718-2026-0089), Lot No (AWS-LT-625-0087),
  Kaynakci (KAY-001), NDT (SAFRAN-4521), Isil Islem (AHT-0412)
Ozel notlar: #1-#3 = FAI parca | #7 = Tamir kaynagi — NCR-0034
```

**Dogrulama:**
- [ ] 20 parca icin seri numara atandi (FMB-2026-0001 — FMB-2026-0020)
- [ ] Her seri numarada: heat no, lot no, kaynakci, NDT rapor, isil islem baglantisi
- [ ] Parca #7 (FMB-2026-0007) NCR referansi mevcut
- [ ] FAI parcalari (#1-#3) isaretli

### 9.2 Izlenebilirlik Raporu (Genealogy)
**Ekran:** Uretim > Izlenebilirlik (`/production/traceability`)
**API:** `GET /traceability/{serialNumber}`
**Rol:** Kalite Muduru

```
Ornek Sorgu: FMB-2026-0007 (Tamir gorulen parca)

Izlenebilirlik Zinciri:
  Malzeme → Bohler (HT-718-2026-0089, MTR-4521) + Dolgu (LT-625-0087)
  Giris KK → GKK-2026-0089 KABUL
  Uretim → IE-2026-0198-001, OP10-OP60 (KAY-001), VT RET (goz Ø1.2mm)
  NCR → NCR-2026-0034, TAMIR, yeniden VT KABUL, KAPATILDI
  Fason → NDT: FSN-0089 KABUL | Isil Islem: FSN-0090 TAMAMLANDI
  Son Kontrol → Sertlik 39.2 HRC, Carpilma 0.35mm → UYGUN
  Belgeler → CoC: COC-0198, CAPA: CAPA-0018 (nem kontrol)
```

**Dogrulama:**
- [ ] Izlenebilirlik raporu tam zinciri gosteriyor (malzeme → uretim → NCR → fason → kontrol)
- [ ] Parca #7'nin NCR gecmisi gorunuyor
- [ ] Tum fason islem referanslari mevcut
- [ ] Heat number → MTR → tedarikci zinciri kurulu
- [ ] Kaynakci kimlik bilgisi her operasyonda gorunuyor

---

## BOLUM 10: SEVKIYAT ve FATURA

### 10.1 Paketleme ve Sevkiyat
**Ekran:** Satis > Sevkiyat
**API:** `POST /shipping`
**Rol:** Uretim Muduru + Depo

```
SVK-2026-0198 | SIP-2026-0198 | TAI | 2026-05-02
20 adet (FMB-2026-0001→0020), Sandik 1/1
Paketleme: VCI kagit, separasyon, ahsap sandik (MIL-STD-2073), silika jel
Belgeler: CoC, Data Pack (10 belge), Irsaliye, Seri No Listesi, Paketleme Listesi
Teslimat: Ozel kurye (savunma malzemesi — guvenli tasima)
```

**Dogrulama:**
- [ ] Sevkiyat kaydi olusturuldu
- [ ] 20 parca seri numaralari eslestirildi
- [ ] CoC ve data pack sevkiyata eklendi
- [ ] Paketleme bilgileri not edildi
- [ ] Sevkiyat durumu: GONDERILDI

### 10.2 Fatura Olusturma
**Ekran:** Finans > Faturalar (`/invoices/form`)
**API:** `POST /invoice`
**Rol:** Muhasebe

```
FTR-2026-0198 | SIP-2026-0198 | TAI | 2026-05-02 | Vade: 60 gun (2026-07-01)
Inc718 Braket (TAI-FMB-2026-001): 20 ad x $320 = $6,400 + KDV %20 = $7,680
Not: Al 5083 icin ayri fatura (ayri sevkiyat)
```

**Dogrulama:**
- [ ] Fatura olusturuldu ve satis siparisine baglandi
- [ ] Miktar ve birim fiyat dogru
- [ ] KDV hesaplandi
- [ ] Vade tarihi 60 gun
- [ ] Fatura yazdirmaya hazir

---

## BOLUM 11: MALIYET ANALIZI

### 11.1 Parca Basi Maliyet Hesaplama
**Ekran:** Uretim > Maliyet Analizi (`/production/part-cost`)
**API:** `GET /partcost/{workOrderId}`
**Rol:** Uretim Muduru + Muhasebe

```
Urun: Fuze Motor Tutucu Braketi — Inconel 718
Is Emri: IE-2026-0198-001
Uretim Adedi: 22 (20 sevk + 2 yedek)

=== MALIYET OZETI (Parca Basi) ===
  | Kalem | Detay | Maliyet |
  |-------|-------|---------|
  | Malzeme | Inc718 cubuk 2x$85 + levha $65 + dolgu $3 + gaz $4.50 + tungsten $0.75 | **$243.25** |
  | Iscilik | 145 dk/parca (OP10-OP100), TIG-01 600 TL/saat agirlikli | **$40.37** (~1,292 TL, kur 32) |
  | Fason | NDT-RT $35 + Isil Islem $28 | **$63.00** |
  | Genel Gider | %50 x ($243.25+$40.37+$63.00) = %50 x $346.62 | **$173.31** |
  | **TOPLAM** | | **$519.93** |

=== KARLILIK ===
  Satis: $320.00 | Maliyet: $519.93 | **ZARAR: -$199.93/adet (-%62.5)**
  Neden: Inconel malzeme %47, TIG iscilik yogun, fason $63/parca
  Oneri: Sonraki teklifte min $650/parca
```

**Dogrulama:**
- [ ] Maliyet analizi 4 kategoride hesaplandi (malzeme, iscilik, fason, genel gider)
- [ ] Parca basi toplam maliyet: $519.93
- [ ] Kar/zarar analizi gorunuyor — ZARAR tespit edildi
- [ ] Fiyat guncelleme onerildi (gelecek teklifler icin)

---

## BOLUM 12: KAYNAKCI PERFORMANS DEGERLENDIRME

### 12.1 Kaynakci Ret Orani Analizi
**Ekran:** Uretim > Raporlar / Kalite > NCR Raporlari
**API:** `GET /reports/welder-performance` (varsa) veya `GET /ncr?operator=KAY-001`
**Rol:** Kalite Muduru + Uretim Muduru

```
KAY-001 (Ahmet Demir) | IE-2026-0198-001 | 22 parca
VT ret: 1/22 = %4.5 (hedef <%5 → UYGUN) | NDT ret: 0/22 = %0 (hedef <%2 → MUKEMMEL)
Tamir basari: %100 | WPS uyum: %100 | Kayit: Tam
Genel: BASARILI — Nem kontrolu (CAPA-0018) sonrasi ret dusmesi bekleniyor
```

**Dogrulama:**
- [ ] Kaynakci performans raporu olusturuldu
- [ ] Ret orani hesaplandi (%4.5 VT, %0 NDT)
- [ ] WPS uyumluluk %100
- [ ] CAPA referansi eklendi (nem kontrolu)
- [ ] Genel degerlendirme: BASARILI

---

## BOLUM 13: ROL BAZLI ERISIM ve YETKI TESTI

### 13.1 Kalite Muduru Rol Testi
**Giris:** kalite.muduru@ozdemirkaynak.com
- [ ] ERISIM VAR: NDT, NCR, CAPA, FAI, CoC, Kontrol Plani, Kalibrasyon, Malzeme Sertifikasi (goruntule+kaydet)
- [ ] ERISIM YOK: Is Emri olusturma, Fatura
- [ ] Silme yetkisi yok (hicbir ekranda)

### 13.2 Uretim Muduru Rol Testi
**Giris:** uretim.muduru@ozdemirkaynak.com
- [ ] ERISIM VAR: Is Emri, Operasyon Routing, Makineler, ShopFloor (goruntule+kaydet)
- [ ] SADECE GORUNTULE: Maliyet Analizi, NCR
- [ ] ERISIM YOK: Fatura

### 13.3 Operator (Kaynakci) Rol Testi
**Giris:** ahmet.demir@ozdemirkaynak.com (KAY-001)
- [ ] ERISIM VAR: ShopFloor — kendi is emirleri, operasyon baslat/bitir, parametre girisi
- [ ] ERISIM YOK: Diger operatorlerin is emirleri, Is Emri tam detay, Kalite, Musteri, Fiyat
- [ ] Kaynak parametreleri (akim, voltaj, hiz) ve sicaklik notu girebiliyor

### 13.4 Satinalma Rol Testi
**Giris:** satinalma@ozdemirkaynak.com
- [ ] ERISIM VAR: Satinalma Siparis, Fason Siparis (NDT+Isil Islem), Mal Kabul, Tedarikci (goruntule+kaydet)
- [ ] SADECE GORUNTULE: Is Emri
- [ ] ERISIM YOK: Kalite ekranlari

---

## BOLUM 14: AL 5083 KAYNAK FARKLILIKLARI (Ek Senaryo)

### 14.1 Al 5083 — Inconel'den Farklar
| Parametre | Inconel 718 | Al 5083 |
|-----------|-------------|---------|
| On isitma | Yok | 150°C min (TEMP-002 ile dogrulama) |
| Akim tipi | DC (DCEN) | AC (oksit temizleme) |
| Akim araligi | 80-120A | 120-180A |
| Dolgu metali | ERNiCrMo-3 (Inc 625) | ER5356 (AWS A5.10) |
| Pasolar arasi maks | 150°C | 200°C |
| Koruyucu gaz | Argon %99.999 | Argon %99.998+ (pure, He karisim yok) |
| NDT yontemi | RT (rontgen) | PT veya UT tercih edilir |
| Isil islem | Gerilim giderme 620°C/1h | YAPILMAZ (H321 temper bozulur) |
| Kaynakci | KAY-001 (Ahmet Demir) | KAY-002 (Mehmet Kaya — Al sertifikali) |

**Dogrulama:**
- [ ] Ayri kontrol plani (WPS-AL5083-GTAW-002), on isitma, farkli kaynakci, isil islem YOK
- [ ] NDT yontemi PT/UT, routing'de OP80 (isil islem) cikarilmis

---

## BOLUM 15: KRITIK IS KURALLARI ve DOGRULAMA MATRISI

### 15.1 End-to-End Dogrulama Matrisi

| # | Kontrol Noktasi | Bolum | Beklenen | Test Durumu |
|---|----------------|-------|----------|-------------|
| 1 | Musteri karti AS9100+NADCAP notu | 1.1 | Zorunlu alanlar dolu | [ ] |
| 2 | Contract review YUKSEK risk | 1.2 | Risk = YUKSEK, ITAR notu var | [ ] |
| 3 | Teklif → Siparis donusumu | 3.2 | Siparis olusturuldu, PO eslesmesi | [ ] |
| 4 | BOM — 7 kalem (malzeme + sarf + fason) | 2.1 | 7 BOM kalemi dogru | [ ] |
| 5 | WPS bilgileri kontrol planinda | 2.3 | WPS not alaninda (K1) | [ ] |
| 6 | Kaynakci sertifika gecerlilik | 5.2 | KAY-001 gecerli, 6G, Inconel kapsam | [ ] |
| 7 | MTR kimyasal dogrulama (11 element) | 4.2 | Tum elementler AMS 5662 limitinde | [ ] |
| 8 | MTR mekanik ozellikler | 4.2 | UTS, akma, uzama, sertlik UYGUN | [ ] |
| 9 | Giris kalite kontrol — KABUL | 4.3 | 5 numune, 4 parametre UYGUN | [ ] |
| 10 | Is emri — 10 operasyon routing | 5.1 | OP10-OP100, kaynakci atamasi | [ ] |
| 11 | Kok paso nufuziyet kontrolu | 5.5 | Tam nufuziyet, parametreler WPS'te | [ ] |
| 12 | Dolgu paso sicaklik kaydi (3 paso) | 5.6 | Her paso < 150°C, bekleme notu | [ ] |
| 13 | Isi girdisi hesaplama (K5) | 5.5-5.7 | HI < 1.5 kJ/mm, not alaninda | [ ] |
| 14 | Purge O2 kaydi (K8) | 5.4-5.5 | < 50 ppm, not alaninda | [ ] |
| 15 | VT muayene — 10 kriter | 5.8 | 19 KABUL, 1 RET (#7) | [ ] |
| 16 | NCR olusturma (gozeneklilik) | 6.1 | MAJOR, tamir karari | [ ] |
| 17 | Tamir kaynagi + yeniden VT | 6.2 | Tamir basarili, VT KABUL | [ ] |
| 18 | CAPA (kok neden: nem) | 6.3 | 4 aksiyon maddesi | [ ] |
| 19 | Fason NDT siparis (NADCAP onayli) | 7.1 | Parca #7 notu, standart referans | [ ] |
| 20 | NDT sonuc — 21/21 KABUL | 7.2 | Tamir parca dahil KABUL | [ ] |
| 21 | NCR kapatma (NDT sonrasi) | 7.2 | NCR-0034 KAPATILDI | [ ] |
| 22 | Fason isil islem siparis | 7.3 | AMS 5663, 620°C/1h | [ ] |
| 23 | Isil islem sonuc (firin chart) | 7.4 | Sicaklik, sure, sogutma UYGUN | [ ] |
| 24 | Sertlik testi (isil islem sonrasi) | 8.1 | 20/20, 36-42 HRC | [ ] |
| 25 | Carpilma olcumu | 8.1 | 20/20, < 0.5mm/100mm | [ ] |
| 26 | Boyutsal kontrol | 8.1 | Tum kritik olcular UYGUN | [ ] |
| 27 | FAI (AS9102, 3 form) | 8.2 | 3 parca, 24 olcu noktasi, KABUL | [ ] |
| 28 | CoC + data pack (10 belge) | 8.3 | Beyan + ekler tam | [ ] |
| 29 | Seri numara atama (20 parca) | 9.1 | Heat, lot, kaynakci, NDT baglantisi | [ ] |
| 30 | Izlenebilirlik — tam zincir | 9.2 | Malzeme→Uretim→NCR→Fason→Kontrol | [ ] |
| 31 | Sevkiyat | 10.1 | Paketleme notu, CoC eki | [ ] |
| 32 | Fatura | 10.2 | Dogru tutar, KDV, vade | [ ] |
| 33 | Maliyet analizi — ZARAR tespiti | 11.1 | $519.93 > $320.00 = ZARAR | [ ] |
| 34 | Kaynakci performans — %4.5 ret | 12.1 | VT %4.5, NDT %0 | [ ] |
| 35 | Kalite Muduru erisim | 13.1 | Kalite ekranlari OK, is emri HAYIR | [ ] |
| 36 | Uretim Muduru erisim | 13.2 | Uretim OK, fatura HAYIR | [ ] |
| 37 | Operator erisim (ShopFloor) | 13.3 | Sadece kendi is emri, fiyat HAYIR | [ ] |
| 38 | Satinalma erisim | 13.4 | Satin alma + fason OK, kalite HAYIR | [ ] |

### 15.2 Workaround Dogrulama (K1-K8)
- [ ] K1 WPS→kontrol plani notu (2.3) | K2 Sertifika→kalibrasyon (0.5) | K3 Sicaklik→manuel (5.6)
- [ ] K4 NDT goruntu→dosya eki (7.2) | K5 HI→not alani (5.5) | K6 Dikis haritasi→PDF (7.1)
- [ ] K7 Gaz akis→manuel (5.4) | K8 Purge O2→not alani (5.4)

---

## SONUC

**Kapsam:** 38 dogrulama + 8 workaround | 19 Quvex modul | 4 rol | GTAW Inconel 718 + Al 5083

**Gelecek Gelistirme:** WPS modulu, kaynakci sertifika yonetimi, paso kayit sistemi,
HI otomatik hesap, NDT goruntu yonetimi, purge O2 alani, dikis haritasi, kaynakci dashboard

---

> **Hazirlayan:** QA Ekibi
> **Tarih:** 2026-04-10
> **Revizyon:** A
> **Durum:** TASLAK — Gozden gecirme bekliyor
> **Referans CNC Senaryosu:** `tests/cnc/E2E_DEFENSE_CNC_TEST_SCENARIO.md`
