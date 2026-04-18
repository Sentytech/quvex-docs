# Mobilya Imalati — Uctan Uca Test Senaryosu

> **Firma Profili:** Oz Ahsap Mobilya San. Ltd.Sti. — 30 personel, 1 CNC router (Biesse), 1 CNC panel kesim, 1 kenar bantlama makinesi, 1 zimpara hatti, 1 boya kabini (lake), 1 montaj hatti, 1 IR kurutma firini
> **Sertifikalar:** ISO 9001:2015, FSC (Forest Stewardship Council — surdurulebilir ahsap), EN 16139 (mobilya dayaniklilik)
> **Musteriler:** Otel zincirleri, insaat firmalari, mimarlik burolari, AVM mobilya maĝazalari
> **Urunler:** Otel yatak odasi seti (karyola + komodin + dolap + calisma masasi + TV unitesi), ofis mobilyalari, ozel tasarim mutfak dolaplari
> **Senaryo:** Grand Otel Grubu'ndan gelen 200 oda mobilya seti siparisi — BOM hazirlik, panel kesim optimizasyonu, kenar bantlama, CNC router islemeleri, boya/lake sureci, montaj, numune onay, seri uretim, depolama, sevkiyat ve faturaya kadar tum surecleri kapsar

---

## BILINEN KISITLAMALAR (Quvex'te Henuz Mevcut Degil)

> Bu kisitlamalar test sirasinda ilgili adimlarda **not alanlarina** yazilacaktir.
> Test raporunda bu maddeler "WORKAROUND" olarak isaretlenecektir.

| # | Eksik Modul/Ozellik | Workaround |
|---|---------------------|------------|
| K1 | Panel kesim optimizasyonu (nesting) modulu yok — CNC programi disinda | Is emri notuna CNC nesting programi referansi (Biesse OptiNest) ve fire orani yazilir |
| K2 | 3D urun gorsellestirme/render modulu yok | Urun kartina 3D render PDF/gorsel dosya eki olarak yuklenir |
| K3 | Oda bazli set takibi (oda no → 5 parca eslesmesi) sinirli | Siparis notuna oda numarasi ve set eslesmesi yazilir, seri numarada oda referansi kullanilir |
| K4 | Mobilya ozel renk/doku tanimlama alani yok (RAL, NCS, doku kodu) | Urun not alanina renk kodu (RAL 9010), parlatma derecesi ve doku bilgisi yazilir |
| K5 | Boya kabin ortam izleme (sicaklik, nem, toz) otomatik kayit yok | Operasyon notlarina boya kabini sicaklik, nem ve filtre durumu yazilir |
| K6 | Montaj kilavuzu/exploded view modulu yok | Montaj kilavuzu PDF dosya eki olarak yuklenir |
| K7 | Mobilya dayaniklilik testi (EN 16139) kayit alani yok | Test sonuclari not alanina ve dosya eki olarak yazilir |
| K8 | Nakliye hasar takip modulu yok (sevkiyat sonrasi) | NCR ile hasar kaydi olusturulur, fotograf dosya eki olarak yuklenir |
| K9 | Fire optimizasyon raporu (panel kesim → gercek fire karsilastirma) yok | Is emri not alanina planlanan vs gercek fire orani yazilir |
| K10 | Montaj ekibi saha takibi (otel yerinde montaj) yok | Fason siparis olarak montaj hizmeti tanimlenir, tamamlanma not alaninda izlenir |

---

## BOLUM 0: SISTEM KURULUMU (Tek Seferlik)

### 0.1 Makine / Ekipman Tanimlari
**Ekran:** Ayarlar > Makineler (`/settings/machines`)
**API:** `POST /machines`

| Makine Kodu | Makine Adi | Marka/Model | Yil | Saat Ucreti | Setup Ucreti |
|-------------|------------|-------------|-----|-------------|--------------|
| PKS-01 | CNC Panel Kesim (Beam Saw) | Holzma HPP 300 | 2021 | 800 TL/saat | 200 TL/saat |
| CNC-01 | CNC Router (5-Eksen) | Biesse Rover B FT 1536 | 2022 | 1200 TL/saat | 400 TL/saat |
| KBN-01 | Kenar Bantlama Makinesi (Otomatik) | Biesse Akron 1440 | 2021 | 600 TL/saat | 150 TL/saat |
| ZMP-01 | Zimpara Hatti (Genis Bant) | Viet Valeria 213 | 2020 | 400 TL/saat | 100 TL/saat |
| BYK-01 | Boya Kabini (Lake — Robotik Tabanca) | Wagner GA 4000 EC | 2022 | 700 TL/saat | 200 TL/saat |
| KRT-01 | IR Kurutma Firini (Konveyor) | Infragas IR-3000 | 2021 | 500 TL/saat | 100 TL/saat |
| MNT-01 | Montaj Hatti (Pnomatik Mengene + Press) | Ozel Yapim | 2020 | 300 TL/saat | 50 TL/saat |
| PRE-01 | Hidrolik Pres (Laminasyon) | Ozel Yapim 120T | 2019 | 350 TL/saat | 100 TL/saat |
| LZR-01 | Lazer Kenar (Kenar Bant Yapistirma — Gorunmez Derz) | Biesse AirForce System | 2023 | 700 TL/saat | 200 TL/saat |

**Dogrulama:**
- [ ] 9 makine/ekipman basariyla tanimlandi
- [ ] Saat ucretleri ve setup ucretleri girildi
- [ ] CNC Router en yuksek saat ucretli makine (1200 TL/saat)
- [ ] Boya hatti ekipmanlari (BYK-01, KRT-01) tanimlandi

### 0.2 Is Emri Adimlari (Operasyon Tanimlari — Mobilya Uretim Sureci)
**Ekran:** Ayarlar > Is Emri Adimlari (`/settings/work-order-steps`)
**API:** `POST /workordersteps`

| Kod | Operasyon Adi | Vars. Makine | Setup (dk) | Beceri |
|-----|--------------|-------------|------------|--------|
| OP10 | CNC Panel Kesim (Nesting — Fire Minimizasyon) | PKS-01 | 30 | 3 (Usta) |
| OP20 | Kenar Bantlama | KBN-01 | 15 | 2 (Kalfa) |
| OP30 | CNC Router (Mentese Yuvasi, Dubel Deligi, Kablo Gecisi) | CNC-01 | 30 | 3 (Usta) |
| OP40 | Zimpara (120-180-240 Kum) | ZMP-01 | 10 | 2 (Kalfa) |
| OP50 | Astar (Primer) Uygulama | BYK-01 | 15 | 3 (Usta) |
| OP60 | Lake Boya 1. Kat | BYK-01 | 15 | 3 (Usta — Boya Ustasi) |
| OP70 | Kurutma (IR Firin) | KRT-01 | 5 | 2 (Kalfa) |
| OP80 | Ara Zimpara (400 Kum) | ZMP-01 | 10 | 2 (Kalfa) |
| OP90 | Son Kat Lake Boya | BYK-01 | 15 | 3 (Usta — Boya Ustasi) |
| OP100 | Final Kurutma (IR Firin) | KRT-01 | 5 | 2 (Kalfa) |
| OP110 | Govde Montaj (Cam/Dubel/Vida) | MNT-01 | 15 | 3 (Usta) |
| OP120 | Aksesuar Montaj (Mentese, Ray, Kulp) | MNT-01 | 10 | 2 (Kalfa) |
| OP130 | Elektrik Montaj (LED, Salter — TV Unitesi) | MNT-01 | 20 | 3 (Usta — Elektrikci) |
| OP140 | Cam Montaj | MNT-01 | 15 | 3 (Usta) |
| OP150 | Son Kontrol + Paketleme | — | 20 | 3 (Usta — Kalite) |

**Dogrulama:**
- [ ] 15 operasyon adimi tanimlandi
- [ ] Operasyon sirasi mobilya uretim akisini dogru yansitiyor (kesim→bant→router→zimpara→astar→lake→kurutma→ara zimpara→son lake→kurutma→montaj→aksesuar→elektrik→cam→kontrol)
- [ ] Boya sureci 6 adim (OP40-OP100) — endustriyel lake standardi
- [ ] Montaj sureci 4 adim (OP110-OP140) — mobilya montaj sirasi
- [ ] Beceri seviyeleri dogru atandi (boya ustasi, elektrikci)

### 0.3 Genel Gider Yapilandirmasi
**Ekran:** Uretim > Maliyet Analizi (`/production/part-cost`)
**API:** `POST /partcost/overheads`

| Ad | Yuzde | Gecerlilik |
|----|-------|------------|
| Genel Imalat Giderleri | %12 | 2026-01-01 → — |
| Boya Hatti Isletme (Filtre, Havalandirma) | %8 | 2026-01-01 → — |
| Amortisman (CNC Router + Panel Kesim) | %10 | 2026-01-01 → — |
| Enerji | %6 | 2026-01-01 → — |
| Depo + Lojistik | %5 | 2026-01-01 → — |

**Dogrulama:**
- [ ] 5 genel gider kalemi tanimlandi (%41 toplam overhead)
- [ ] Boya hatti isletme gideri ayri kalem (filtre degisimi, havalandirma)
- [ ] Depo + lojistik gideri mobilya sektore ozgu (buyuk hacimli urunler)

### 0.4 Kalibrasyon Ekipmanlari
**Ekran:** Kalite > Kalibrasyon (`/quality/calibration`)
**API:** `POST /calibration/equipment`

| Kod | Ekipman | Marka/Model | Dogruluk | Frekans | Son Kalibrasyon | Sonraki |
|-----|---------|-------------|----------|---------|-----------------|---------|
| KAL-001 | Dijital Kumpas 0-300mm | Mitutoyo 500-173 | 0.01mm | 6 Aylik | 2026-02-01 | 2026-08-01 |
| MET-001 | Metre (3m Celik) | Stanley FatMax | ±1mm/3m | Yillik | 2026-01-15 | 2027-01-15 |
| NEM-001 | Nem Olcer (Ahsap/MDF) | Testo 606-2 | ±%0.5 | 6 Aylik | 2026-02-01 | 2026-08-01 |
| KLN-001 | Boya Kalinlik Olcer | Elcometer 456 | ±%1 um | 6 Aylik | 2026-03-01 | 2026-09-01 |
| PRZ-001 | Yuzey Puruzluluk (Boya) | Mitutoyo SJ-210 | Ra 0.01 um | Yillik | 2026-01-15 | 2027-01-15 |
| SCK-001 | Sicaklik/Nem Datalogger (Boya Kabini) | Testo 174H | ±0.5°C / ±%3 RH | 6 Aylik | 2026-02-01 | 2026-08-01 |
| GNY-001 | Gonyemetre (Koselik) | Mitutoyo 187-907 | ±0.01° | Yillik | 2026-01-15 | 2027-01-15 |
| TRK-001 | Tork Olcumu (Vida Sikilik) | Tohnichi BTG-I | ±%3 Nm | Yillik | 2026-01-15 | 2027-01-15 |
| PRK-001 | Parlaklik Olcer (Boya Yuzey) | BYK-Gardner micro-TRI-gloss | ±0.5 GU | 6 Aylik | 2026-03-01 | 2026-09-01 |

**Dogrulama:**
- [ ] 9 kalibrasyon ekipmani tanimlandi
- [ ] Mobilya spesifik ekipmanlar: nem olcer (NEM-001), boya kalinlik (KLN-001), parlaklik (PRK-001)
- [ ] Boya kabini sicaklik/nem takibi (SCK-001) dahil
- [ ] Kalibrasyon tarihleri ve frekanslari girildi
- [ ] Dashboard'da uyumluluk % gorunuyor

---

## BOLUM 1: MUSTERI VE URUN TANIMLARI

### Adim 1 — Musteri Kaydi: Grand Otel Grubu
**Ekran:** Musteriler (`/customers`)
**API:** `POST /customer`
**Rol:** Satis Muduru

```
Firma Adi: Grand Otel Grubu A.S.
Yetkili: Mehmet Aksoy (Satin Alma ve Proje Koordinatoru)
Email: mehmet.aksoy@grandotel.com.tr
Telefon: +90 212 555 0 888
Adres: Levent Mah. Buyukdere Cad. No:185, 34394 Sisli/Istanbul
Vergi No: 5678901234 | Vergi Dairesi: Mecidiyekoy
Kategori: A (Stratejik Musteri — buyuk proje)
Doviz: TRY
Odeme Vadesi: 60 gun
Not: 200 oda yatak odasi mobilya seti projesi. 
     Numune onay sureci zorunlu (1 oda seti prototip).
     FSC sertifikali ahsap kullanimi tercih edilir.
     RAL 9010 (Saf Beyaz) lake boya — tum mobilyalarda ayni renk.
```

**Dogrulama:**
- [ ] Musteri karti basariyla olusturuldu
- [ ] Not alaninda proje detayi, numune onay, FSC tercihi ve renk kodu var
- [ ] Musteri listesinde gorunuyor, kategorisi A
- [ ] Odeme vadesi 60 gun

### Adim 2 — Musteri Adres ve Iletisim
**Ekran:** Musteriler > Adresler (`/customers/{id}/addresses`)
**API:** `POST /customer/{id}/addresses`

| Adres Tipi | Adres | Ilgili |
|------------|-------|--------|
| Fatura | Levent Mah. Buyukdere Cad. No:185, Sisli/Istanbul | Muhasebe |
| Sevkiyat — Otel Projesi | Grand Otel Belek, Serik/Antalya | Serif Kaya (Santiye Sefi) |
| Sevkiyat — Depo (Gecici) | Oz Ahsap Mobilya Depo, Ikitelli/Istanbul | Depo Sorumlusu |

**Dogrulama:**
- [ ] 3 adres (1 fatura + 1 otel projesi + 1 gecici depo) tanimlandi
- [ ] Otel adresi Antalya — farkli sehir sevkiyat
- [ ] Gecici depo adresi (uretim tamamlanana kadar stoklama)

### Adim 3 — Urun Tanimlari: Otel Yatak Odasi Seti (5 Parca)
**Ekran:** Urunler (`/products`)
**API:** `POST /product`
**Rol:** Uretim Muduru

**Urun 1 — Karyola:**
```
Urun Kodu: MOB-KRY-180
Urun Adi: Otel Karyola — 180×200cm, MDF + Mese Kaplama
Kategori: Yatak Odasi Mobilyasi
Birim: Adet
Boyutlar: 180×200×105cm (GenislikxDerinlikxYukseklik)
Malzeme: 18mm MDF govde + 0.6mm mese kaplama + lake boya RAL 9010
Not: Bas ucu dekoratif panel, metal kose takviye, demonte tasima (K2)
```

**Urun 2 — Komodin:**
```
Urun Kodu: MOB-KMD-50
Urun Adi: Otel Komodin — 50×40×55cm, MDF + Lake Boya
Kategori: Yatak Odasi Mobilyasi
Birim: Adet (set basina 2 adet)
Boyutlar: 50×40×55cm
Malzeme: 18mm MDF + PU lake RAL 9010
Not: 1 cekmece (frenli ray), soft-close, USB sarj yuva (K3 — oda seti eslesmesi)
```

**Urun 3 — Gardrop:**
```
Urun Kodu: MOB-GRD-120
Urun Adi: Otel Gardrop — 120×60×210cm, Surgu Kapak
Kategori: Yatak Odasi Mobilyasi
Birim: Adet
Boyutlar: 120×60×210cm
Malzeme: 25mm sunta govde + melamin kaplama (iç) + 18mm MDF dis yuzey + lake RAL 9010
Not: 2 surgu kapak (aluminyum ray), ici melamin beyaz, asklik + raf, ayna (ic kapak)
```

**Urun 4 — Calisma Masasi:**
```
Urun Kodu: MOB-CMS-120
Urun Adi: Otel Calisma Masasi — 120×60×76cm, MDF + Metal Ayak
Kategori: Yatak Odasi Mobilyasi
Birim: Adet
Boyutlar: 120×60×76cm
Malzeme: 25mm MDF tabla + lake RAL 9010 + krom metal ayak (50×50mm profil)
Not: 1 cekmece, kablo gecisi (masa arkasi), metal ayak tedarik (dis)
```

**Urun 5 — TV Unitesi:**
```
Urun Kodu: MOB-TVU-150
Urun Adi: Otel TV Unitesi — 150×40×50cm, MDF + Cam + LED
Kategori: Yatak Odasi Mobilyasi
Birim: Adet
Boyutlar: 150×40×50cm
Malzeme: 18mm MDF + 6mm temperli cam (kapanetli) + LED serit aydinlatma + lake RAL 9010
Not: 2 kapak (soft-close), 1 acik raf, LED aydinlatma (12V), kablo yonetim sistemi (K3)
```

**Dogrulama:**
- [ ] 5 urun basariyla tanimlandi
- [ ] Her urun farkli boyut ve malzeme kombinasyonu iceriyor
- [ ] RAL 9010 renk kodu tum urunlerde belirtildi (K4)
- [ ] Komodin set basina 2 adet notu var
- [ ] 3D render gorsel yuklendi (K2)
- [ ] Oda seti eslesmesi notu var (K3)

### Adim 4 — BOM Tanimlari (Her Parca Icin Alt BOM)

#### 4.1 BOM — Karyola (MOB-KRY-180)
**Ekran:** Urunler > BOM (`/products/{id}/bom`)
**API:** `POST /product/{id}/bom`

| # | Kalem | Kod | Miktar | Birim | Birim Fiyat | Aciklama |
|---|-------|-----|--------|-------|-------------|----------|
| 1 | 18mm MDF Panel (2800×2100) | PNL-MDF-18 | 1.5 | Tabaka | 750.00 TRY | Govde + bas paneli |
| 2 | 0.6mm Mese Kaplama | KPL-MSE-06 | 3.0 | m² | 180.00 TRY/m² | Bas ucu dekoratif |
| 3 | ABS Kenar Bandi 2mm (Beyaz) | KBN-ABS-2W | 8.0 | metre | 12.00 TRY/m | Gorunen kenarlar |
| 4 | ABS Kenar Bandi 0.8mm (Beyaz) | KBN-ABS-08W | 6.0 | metre | 6.00 TRY/m | Ic kenarlar |
| 5 | Mentese (110° Soft-Close) | AKS-MNT-110 | 4 | Adet | 45.00 TRY | Blum Clip Top |
| 6 | Kose Takviye (Metal L) | AKS-KST-L | 8 | Adet | 15.00 TRY | Yapisal guclendiirme |
| 7 | Dubel (8×35mm Ahsap) | AKS-DBL-835 | 24 | Adet | 1.50 TRY | Birlesim |
| 8 | Cam Tutkal (PVA D3) | KIM-PVA-D3 | 0.1 | Litre | 80.00 TRY/lt | Kaplama yapistirma |
| 9 | PU Lake Boya (RAL 9010) | BYA-PU-9010 | 0.8 | Litre | 220.00 TRY/lt | 2 kat + astar |
| 10 | Primer (Ahsap Astar) | BYA-PRM-01 | 0.3 | Litre | 120.00 TRY/lt | 1 kat |
| 11 | Ambalaj (Kose Koruma + Streç) | AMB-KRY-01 | 1 | Set | 85.00 TRY | Demonte paketleme |

**BOM Toplam Karyola:** ~2,320 TRY / adet

#### 4.2 BOM — Komodin (MOB-KMD-50) — set basina 2 adet
**Ekran:** Urunler > BOM

| # | Kalem | Kod | Miktar | Birim | Birim Fiyat | Aciklama |
|---|-------|-----|--------|-------|-------------|----------|
| 1 | 18mm MDF Panel (2800×2100) | PNL-MDF-18 | 0.3 | Tabaka | 750.00 TRY | Govde |
| 2 | ABS Kenar Bandi 2mm | KBN-ABS-2W | 4.0 | metre | 12.00 TRY/m | Gorunen kenarlar |
| 3 | Frenli Cekmece Rayi (350mm) | AKS-RAY-350 | 1 | Cift | 95.00 TRY | Blum Tandem Frenli |
| 4 | Cekmece Kulp (Gomme) | AKS-KLP-G01 | 1 | Adet | 65.00 TRY | Paslanmaz gomme |
| 5 | USB Sarj Modulu (2 port) | ELK-USB-2P | 1 | Adet | 120.00 TRY | 5V/2.4A |
| 6 | Dubel (6×30mm) | AKS-DBL-630 | 12 | Adet | 1.00 TRY | Birlesim |
| 7 | PU Lake Boya (RAL 9010) | BYA-PU-9010 | 0.3 | Litre | 220.00 TRY/lt | 2 kat |
| 8 | Primer | BYA-PRM-01 | 0.1 | Litre | 120.00 TRY/lt | 1 kat |
| 9 | Ambalaj | AMB-KMD-01 | 1 | Set | 35.00 TRY | |

**BOM Toplam Komodin:** ~680 TRY / adet (× 2 = 1,360 TRY / oda)

#### 4.3 BOM — Gardrop (MOB-GRD-120)
**Ekran:** Urunler > BOM

| # | Kalem | Kod | Miktar | Birim | Birim Fiyat | Aciklama |
|---|-------|-----|--------|-------|-------------|----------|
| 1 | 25mm Sunta Panel (2800×2100) | PNL-SNT-25 | 2.0 | Tabaka | 420.00 TRY | Govde ici |
| 2 | 18mm MDF Panel | PNL-MDF-18 | 1.0 | Tabaka | 750.00 TRY | Dis yuzey (lake) |
| 3 | Melamin Kaplama (Beyaz, ic) | KPL-MLM-W | 5.0 | m² | 45.00 TRY/m² | Ic yuzeyler |
| 4 | Aluminyum Surgu Ray Sistemi | AKS-SRG-AL | 1 | Set | 450.00 TRY | 2 kapak surgu seti |
| 5 | Ayna (3mm, ic kapak) | CAM-AYN-3 | 1 | Adet | 280.00 TRY | Temperli ayna |
| 6 | Asklik Boru (Krom, Oval) | AKS-ASK-KR | 1 | Adet | 85.00 TRY | 118cm |
| 7 | Raf Takanagi (Ayarlanabilir) | AKS-RAF-AY | 16 | Adet | 3.50 TRY | 4 raf x 4 takanak |
| 8 | ABS Kenar Bandi 2mm | KBN-ABS-2W | 12.0 | metre | 12.00 TRY/m | |
| 9 | PU Lake Boya | BYA-PU-9010 | 1.2 | Litre | 220.00 TRY/lt | Dis yuzey |
| 10 | Primer | BYA-PRM-01 | 0.4 | Litre | 120.00 TRY/lt | |
| 11 | Ambalaj | AMB-GRD-01 | 1 | Set | 120.00 TRY | Demonte + koruma |

**BOM Toplam Gardrop:** ~2,650 TRY / adet

#### 4.4 BOM — Calisma Masasi (MOB-CMS-120)
**Ekran:** Urunler > BOM

| # | Kalem | Kod | Miktar | Birim | Birim Fiyat | Aciklama |
|---|-------|-----|--------|-------|-------------|----------|
| 1 | 25mm MDF Panel | PNL-MDF-25 | 0.6 | Tabaka | 950.00 TRY | Masa tablasi |
| 2 | Metal Ayak (Krom 50×50mm Profil) | MTL-AYK-KR | 1 | Set | 650.00 TRY | 4 ayak + baglanti |
| 3 | Frenli Cekmece Rayi (400mm) | AKS-RAY-400 | 1 | Cift | 110.00 TRY | Blum Tandem |
| 4 | Cekmece Kulp (Gomme) | AKS-KLP-G01 | 1 | Adet | 65.00 TRY | |
| 5 | Kablo Gecis Kapaği (60mm) | AKS-KBL-60 | 1 | Adet | 25.00 TRY | Krom |
| 6 | ABS Kenar Bandi 2mm | KBN-ABS-2W | 5.0 | metre | 12.00 TRY/m | |
| 7 | PU Lake Boya | BYA-PU-9010 | 0.5 | Litre | 220.00 TRY/lt | Tabla + cekmece |
| 8 | Primer | BYA-PRM-01 | 0.2 | Litre | 120.00 TRY/lt | |
| 9 | Ambalaj | AMB-CMS-01 | 1 | Set | 65.00 TRY | |

**BOM Toplam Calisma Masasi:** ~1,780 TRY / adet

#### 4.5 BOM — TV Unitesi (MOB-TVU-150)
**Ekran:** Urunler > BOM

| # | Kalem | Kod | Miktar | Birim | Birim Fiyat | Aciklama |
|---|-------|-----|--------|-------|-------------|----------|
| 1 | 18mm MDF Panel | PNL-MDF-18 | 0.8 | Tabaka | 750.00 TRY | Govde |
| 2 | 6mm Temperli Cam (Kapanetli) | CAM-TMP-6 | 1 | Adet | 350.00 TRY | Acik raf kapagi |
| 3 | LED Serit (12V, Sicak Beyaz, 3000K) | ELK-LED-3K | 2.0 | metre | 45.00 TRY/m | Raf alti aydinlatma |
| 4 | LED Trafo (12V/2A) | ELK-TRF-12 | 1 | Adet | 85.00 TRY | |
| 5 | Mentese (110° Soft-Close) | AKS-MNT-110 | 4 | Adet | 45.00 TRY | 2 kapak x 2 |
| 6 | Cam Mentese | AKS-MNT-CM | 2 | Adet | 55.00 TRY | Cam kapak icin |
| 7 | Kablo Yonetim Kanalin | AKS-KBL-KN | 1 | Set | 40.00 TRY | Arka panel |
| 8 | ABS Kenar Bandi 2mm | KBN-ABS-2W | 6.0 | metre | 12.00 TRY/m | |
| 9 | PU Lake Boya | BYA-PU-9010 | 0.6 | Litre | 220.00 TRY/lt | |
| 10 | Primer | BYA-PRM-01 | 0.2 | Litre | 120.00 TRY/lt | |
| 11 | Ambalaj | AMB-TVU-01 | 1 | Set | 75.00 TRY | Cam koruma ozel |

**BOM Toplam TV Unitesi:** ~1,690 TRY / adet

**SET TOPLAM BOM (1 Oda):**

| Parca | Miktar | Birim Maliyet | Toplam |
|-------|--------|---------------|--------|
| Karyola | 1 | 2,320 TRY | 2,320 TRY |
| Komodin | 2 | 680 TRY | 1,360 TRY |
| Gardrop | 1 | 2,650 TRY | 2,650 TRY |
| Calisma Masasi | 1 | 1,780 TRY | 1,780 TRY |
| TV Unitesi | 1 | 1,690 TRY | 1,690 TRY |
| **SET TOPLAMI** | **6 parca** | | **9,800 TRY** |

**Dogrulama:**
- [ ] 5 urunun her biri icin ayri BOM tanimlandi
- [ ] Toplam BOM kalem sayisi: 51 (farkli malzeme ve aksesuar)
- [ ] Set toplam malzeme maliyeti ~9,800 TRY/oda
- [ ] Komodin x2 hesabi dogru (680 × 2 = 1,360)
- [ ] Tum lake boya RAL 9010 olarak belirtildi (K4)
- [ ] Elektrik bilesenleri (USB, LED, trafo) dahil

---

## BOLUM 2: TEKLIF VE SIPARIS

### Adim 5 — Teklif Hazirlama
**Ekran:** Teklifler (`/offers`)
**API:** `POST /offer`
**Rol:** Satis Muduru

```
Musteri: Grand Otel Grubu A.S.
Teklif No: TKF-2026-0112
Tarih: 2026-04-12
Gecerlilik: 45 gun
Doviz: TRY
Odeme: %30 siparis onayinda, %40 uretim ortasinda, %30 teslimat sonrasi (60 gun)
Teslimat: 16 hafta (numune onay + seri uretim + montaj)
```

| # | Urun | Miktar | Birim Fiyat | Toplam |
|---|------|--------|-------------|--------|
| 1 | MOB-KRY-180 — Karyola | 200 | 4,200.00 TRY | 840,000.00 TRY |
| 2 | MOB-KMD-50 — Komodin | 400 | 1,200.00 TRY | 480,000.00 TRY |
| 3 | MOB-GRD-120 — Gardrop | 200 | 4,800.00 TRY | 960,000.00 TRY |
| 4 | MOB-CMS-120 — Calisma Masasi | 200 | 3,200.00 TRY | 640,000.00 TRY |
| 5 | MOB-TVU-150 — TV Unitesi | 200 | 3,100.00 TRY | 620,000.00 TRY |

```
Ara Toplam (Mobilya): 3,540,000.00 TRY
Nakliye (Istanbul → Antalya, 10 TIR): 180,000.00 TRY
Montaj (200 oda × 2 gun/10 oda = 40 gun ekip): 200,000.00 TRY
GENEL TOPLAM: 3,920,000.00 TRY

Notlar:
- Set fiyat (1 oda): 17,700 TRY (mobilya) + 900 TRY (nakliye) + 1,000 TRY (montaj) = 19,600 TRY
- Numune onay: 1 oda seti prototip uretilecek, musteri yerinde gorsel onay
- FSC sertifikali MDF/sunta kullanilacak (temin edilebilirlik kontrolu sonrasi)
- RAL 9010 Pure White — tum mobilyalar ayni renk
- Demonte tasima, otel yerinde montaj ekibi ile kurulum
- 2 yil garanti (normal kullanim kosullarinda)
```

**Dogrulama:**
- [ ] Teklif basariyla olusturuldu
- [ ] 5 urun kalemi dogru miktar ve fiyatla
- [ ] Nakliye ve montaj ayri kalemler olarak eklendi
- [ ] Odeme plani (%30/%40/%30) belirtildi
- [ ] Genel toplam 3,920,000 TRY
- [ ] Numune onay sureci notu var

### Adim 6 — Contract Review
**Ekran:** Teklifler > Contract Review (`/offers/{id}/contract-review`)
**API:** `POST /offer/{id}/contract-review`
**Rol:** Uretim Muduru + Satis Muduru

| Kriter | Deger | Sonuc |
|--------|-------|-------|
| Teknik Yeterlilik | MDF/sunta isleme, lake boya kapasitesi VAR | UYGUN |
| Makine Yeterliligi | CNC Panel Kesim + Router + Boya Hatti MEVCUT | UYGUN |
| Kapasite | 200 set / 12 hafta = ~17 set/hafta — TEK VARDIYA YETMEZ | DIKKAT |
| Malzeme Temini | MDF, sunta, aksesuar — stok + 4 hafta temin suresi | UYGUN |
| FSC Sertifika | FSC sertifikali MDF tedarikci teyit edilmeli | KONTROL |
| Nakliye | 10 TIR — lojistik firma anlasmasi gerekli | UYGUN |
| Montaj | 4 kisilik montaj ekibi — 40 gun sahada | UYGUN |
| Risk Seviyesi | ORTA (buyuk proje, tek musteri, kapasite siniri) | ORTA |

```
Not: Kapasite icin cift vardiya veya fazla mesai planlanmali.
     Metal ayak (krom profil) dis tedarik — temin suresi 3 hafta.
     FSC MDF tedarikci: Kastamonu Entegre (FSC-C012345) teyit alinacak.
```

**Dogrulama:**
- [ ] Contract review 8 kriter ile tamamlandi
- [ ] Kapasite uyarisi (cift vardiya gerekli) var
- [ ] FSC tedarikci kontrolu notu eklendi
- [ ] Risk ORTA (buyuk proje)

### Adim 7 — Tekliften Siparise Donusum
**Ekran:** Teklifler > Siparise Donustur
**API:** `POST /offer/{id}/convert-to-order`
**Rol:** Satis Muduru

```
Siparis No: SIP-2026-0078
PO Referansi: GO-PO-2026-MBL-001 (Grand Otel PO)
Miktar: 200 set (1200 parca — 200 karyola + 400 komodin + 200 gardrop + 200 masa + 200 TV)
Teslim Tarihi: 2026-08-01 (montaj baslangici)
Sevkiyat: Grand Otel Belek, Antalya
Odeme 1 (%30): 1,176,000 TRY — siparis onayinda (2026-04-20)
```

**Dogrulama:**
- [ ] Siparis basariyla olusturuldu
- [ ] 5 urun kalemi dogru miktarlarla aktarildi
- [ ] Toplam 1200 parca (6 parca/set × 200 oda)
- [ ] PO referansi eslesmesi var
- [ ] Odeme plani ilk taksit tarihi belirlendi

---

## BOLUM 3: SATINALMA VE MAL KABUL

### Adim 8 — MRP Hesaplama ve Satinalma
**Ekran:** Satinalma (`/purchasing`)
**API:** `POST /purchaseorder`
**Rol:** Satinalma Sorumlusu

**Panel Ihtiyaci (Set Toplam × 200 + %8 Fire Payi):**

| Malzeme | Birim Ihtiyac/Set | 200 Set | +%8 Fire | Siparis |
|---------|-------------------|---------|----------|---------|
| 18mm MDF (2800×2100) | 2.6 tabaka | 520 | 562 | 570 tabaka |
| 25mm Sunta (2800×2100) | 2.0 tabaka | 400 | 432 | 440 tabaka |
| 25mm MDF (2800×2100) | 0.6 tabaka | 120 | 130 | 135 tabaka |
| 0.6mm Mese Kaplama | 3.0 m² | 600 m² | 648 m² | 650 m² |
| ABS Kenar Bandi 2mm | 37 m | 7,400 m | 7,992 m | 8,000 m (rulo) |
| PU Lake Boya RAL 9010 | 3.4 lt | 680 lt | 734 lt | 750 litre |
| Primer | 1.2 lt | 240 lt | 259 lt | 260 litre |

**Aksesuar Ihtiyaci:**

| Aksesuar | Birim/Set | 200 Set | Siparis |
|----------|-----------|---------|---------|
| Mentese 110° Soft-Close (Blum) | 12 | 2,400 | 2,500 adet |
| Frenli Cekmece Rayi (350mm) | 2 cift | 400 cift | 420 cift |
| Frenli Cekmece Rayi (400mm) | 1 cift | 200 cift | 210 cift |
| Cekmece Kulp (Gomme) | 3 | 600 | 630 adet |
| Aluminyum Surgu Ray Seti | 1 | 200 | 210 set |
| Dubel (karisik) | 36 | 7,200 | 7,500 adet |
| USB Sarj Modulu | 2 | 400 | 420 adet |
| LED Serit + Trafo Seti | 1 | 200 | 210 set |
| Metal Ayak Seti (Krom) | 1 | 200 | 210 set |
| 6mm Temperli Cam | 1 | 200 | 210 adet |
| 3mm Ayna | 1 | 200 | 210 adet |

**Satinalma Siparisleri:**

| PO No | Tedarikci | Icerik | Tutar | Teslim |
|-------|-----------|--------|-------|--------|
| SAT-2026-0201 | Kastamonu Entegre (FSC) | 18mm MDF 570 tbk + 25mm MDF 135 tbk | 532,500 TRY | 2026-05-01 |
| SAT-2026-0202 | Kastamonu Entegre | 25mm Sunta 440 tbk | 184,800 TRY | 2026-05-01 |
| SAT-2026-0203 | Blum Turkiye | Mentese + Ray + Kulp | 424,350 TRY | 2026-05-05 |
| SAT-2026-0204 | Bayraktar Cam | Temperli cam + Ayna | 133,000 TRY | 2026-05-10 |
| SAT-2026-0205 | AkBoya Kimya | Lake boya + Primer | 196,200 TRY | 2026-04-28 |
| SAT-2026-0206 | Metal Form A.S. | Krom Ayak Seti 210 | 136,500 TRY | 2026-05-10 |
| SAT-2026-0207 | Elektro Market | USB modulu + LED seti | 66,600 TRY | 2026-05-05 |

**Dogrulama:**
- [ ] 7 satinalma siparisi olusturuldu
- [ ] Panel ihtiyaci fire payi (%8) dahil hesaplandi
- [ ] Aksesuar ihtiyaci set bazli dogru (200 set × adet/set)
- [ ] FSC sertifikali MDF tedarikci (Kastamonu Entegre) secildi
- [ ] Teslim tarihleri uretim planina uygun (en gec 2026-05-10)
- [ ] Toplam satinalma ~1,673,950 TRY

### Adim 9 — Mal Kabul (Panel Malzeme)
**Ekran:** Mal Kabul (`/receiving`)
**API:** `POST /receiving`
**Rol:** Depo Sorumlusu + Kalite

```
Irsaliye No: KE-IRS-2026-2201
Tedarikci: Kastamonu Entegre (FSC-C012345)
Teslim Tarihi: 2026-05-02
Gelen: 18mm MDF 570 tabaka + 25mm MDF 135 tabaka
Lot No: KE-MDF-2026-05-A
FSC Sertifika No: FSC-C012345-MF
```

**Giris Kalite Kontrolu (5 tabaka numune):**

| # | Tabaka | Kalinlik (18.0 ±0.3mm) | Nem (<%8) | Yuzey (Cizik/Leke) | Boyut (2800×2100 ±2mm) | Sonuc |
|---|--------|------------------------|-----------|--------------------|------------------------|-------|
| 1 | MDF-001 | 18.1mm | %6.5 | Temiz | 2801×2100mm | KABUL |
| 2 | MDF-150 | 17.9mm | %6.8 | Temiz | 2800×2101mm | KABUL |
| 3 | MDF-300 | 18.0mm | %7.1 | Temiz | 2800×2100mm | KABUL |
| 4 | MDF-450 | 18.2mm | %6.4 | Temiz | 2799×2100mm | KABUL |
| 5 | MDF-570 | 18.0mm | %6.9 | Temiz | 2800×2100mm | KABUL |

**Sonuc:** 5/5 KABUL — Lot KABUL edildi. FSC sertifika dogrulandi.

**Dogrulama:**
- [ ] Mal kabul kaydi olusturuldu
- [ ] 5 numune — kalinlik, nem, yuzey, boyut — tumu UYGUN
- [ ] FSC sertifika numarasi kaydedildi
- [ ] Lot numarasi izlenebilirlik icin atandi
- [ ] MDF depo alanina transfer edildi

---

## BOLUM 4: URETIM (IS EMRI VE OPERASYONLAR)

### Adim 10 — Is Emri Olusturma (Karyola — 200+Fire)
**Ekran:** Uretim > Is Emirleri (`/production/work-orders`)
**API:** `POST /workorders`
**Rol:** Uretim Muduru

> **NOT:** Her urun icin ayri is emri olusturulur. Asagida karyola ornegi detayli verilir.
> Diger 4 urun icin benzer is emirleri olusturulacaktir.

```
Is Emri No: IE-2026-0112-KRY
Urun: MOB-KRY-180 — Otel Karyola
Siparis Ref: SIP-2026-0078
Miktar: 210 adet (200 siparis + %5 fire payi)
Hammadde: 18mm MDF — Lot: KE-MDF-2026-05-A
Baslangic: 2026-05-05
Bitis (Planlanan): 2026-06-20
```

**Operasyon Routing (Karyola):**

| Sira | Operasyon | Makine | Plan. Sure/Parca | Operasyon Toplam | Operator |
|------|-----------|--------|-------------------|------------------|----------|
| OP10 | CNC Panel Kesim | PKS-01 | 8 dk (batch 10) | 28 saat | Kesim Ustasi |
| OP20 | Kenar Bantlama | KBN-01 | 5 dk | 17.5 saat | Bant Operatoru |
| OP30 | CNC Router | CNC-01 | 6 dk | 21 saat | CNC Operatoru |
| OP40 | Zimpara (3 kum) | ZMP-01 | 4 dk | 14 saat | Zimpara Operatoru |
| OP50 | Astar (Primer) | BYK-01 | 3 dk | 10.5 saat | Boya Ustasi |
| OP60 | Lake 1. Kat | BYK-01 | 4 dk | 14 saat | Boya Ustasi |
| OP70 | IR Kurutma | KRT-01 | 2 dk (batch) | 7 saat | Kalfa |
| OP80 | Ara Zimpara (400) | ZMP-01 | 2 dk | 7 saat | Zimpara Operatoru |
| OP90 | Son Kat Lake | BYK-01 | 4 dk | 14 saat | Boya Ustasi |
| OP100 | Final Kurutma | KRT-01 | 2 dk (batch) | 7 saat | Kalfa |
| OP110 | Govde Montaj | MNT-01 | 12 dk | 42 saat | Montajci |
| OP120 | Aksesuar Montaj | MNT-01 | 8 dk | 28 saat | Montajci |
| OP150 | Son Kontrol + Paketleme | — | 10 dk | 35 saat | Kalite |

**Diger Is Emirleri (Ozet):**

| Is Emri No | Urun | Miktar | Baslangic | Bitis |
|------------|------|--------|-----------|-------|
| IE-2026-0112-KMD | Komodin | 420 (400+%5) | 2026-05-05 | 2026-06-15 |
| IE-2026-0112-GRD | Gardrop | 210 (200+%5) | 2026-05-12 | 2026-06-27 |
| IE-2026-0112-CMS | Calisma Masasi | 210 (200+%5) | 2026-05-12 | 2026-06-20 |
| IE-2026-0112-TVU | TV Unitesi | 210 (200+%5) | 2026-05-19 | 2026-06-27 |

**Dogrulama:**
- [ ] 5 is emri basariyla olusturuldu (1 detayli + 4 ozet)
- [ ] Karyola is emri 13 operasyon dogru routing'de
- [ ] Toplam uretim parcasi: 210+420+210+210+210 = 1,260 adet
- [ ] Baslangic tarihleri kademeli (kapasite dengeleme)
- [ ] Fire payi %5 dahil

### Adim 11 — OP10: CNC Panel Kesim (Nesting)
**Ekran:** ShopFloor Terminali (`/shopfloor`)
**API:** `POST /shopfloor/start-operation`
**Rol:** Operator (Kesim Ustasi)

```
Operasyon: OP10 — CNC Panel Kesim
Makine: PKS-01 (Holzma HPP 300)
Program: Biesse OptiNest — Nesting Plan #NP-KRY-001
Panel: 18mm MDF (KE-MDF-2026-05-A)
```

**Nesting Raporu (K1 — manuel kayit):**

| Panel Tipi | Tabaka Sayisi | Parca/Tabaka | Toplam Parca | Fire Orani |
|------------|---------------|-------------|--------------|------------|
| 18mm MDF — Karyola (Govde) | 85 | ~8 panel/tabaka | 680 panel | %12.5 |
| 18mm MDF — Karyola (Bas) | 28 | ~8 panel/tabaka | 224 panel | %10.8 |

```
Not (K1): CNC nesting programi ref: OptiNest NP-KRY-001
Planlanan fire: %10 (optimizasyon sonrasi)
Gercek fire: %11.7 (ortalama)
Fire parcalari: Kucuk parcalar aksesuvar uretiminde kullanildi
```

**Dogrulama:**
- [ ] OP10 baslatildi, nesting programi referansi yazildi (K1)
- [ ] Fire orani kaydedildi (%11.7 gercek vs %10 planlanan)
- [ ] Panel tabaka tuketimi kayit altinda
- [ ] Fire parcalari degerlendirme notu eklendi (K9)

### Adim 12 — OP20-OP30: Kenar Bantlama + CNC Router
**Ekran:** ShopFloor Terminali (`/shopfloor`)
**Rol:** Operatorler

**OP20 — Kenar Bantlama:**
```
Operasyon: OP20 — Kenar Bantlama
Makine: KBN-01 (Biesse Akron 1440)
ABS Bant: 2mm Beyaz (gorunen kenarlar) + 0.8mm Beyaz (ic kenarlar)
Sicaklik: 200°C (yapistiırma), Hiz: 12 m/dk
```

| Kontrol | Spec | Sonuc |
|---------|------|-------|
| Yapisma kuvveti | Cikarma ile kontrol — saglamn | UYGUN |
| Derz gorunumu | Gorunur bosluk/tasma YOK | UYGUN |
| Kose kalitesi | Catlak/kirilma YOK | UYGUN |

**OP30 — CNC Router:**
```
Operasyon: OP30 — CNC Router
Makine: CNC-01 (Biesse Rover B FT)
Program: PRG-KRY-ROUTER-01
Islemler: Mentese yuvasi (35mm), dubel delikleri (8mm), kablo gecis deligi
```

| Kontrol | Spec | Sonuc |
|---------|------|-------|
| Mentese yuvasi cap | 35.00 ±0.10mm | 35.05mm — UYGUN |
| Mentese yuvasi derinlik | 13.00 ±0.20mm | 12.95mm — UYGUN |
| Dubel deligi cap | 8.00 ±0.05mm | 8.02mm — UYGUN |
| Dubel deligi derinlik | 30.00 ±0.50mm | 29.8mm — UYGUN |

**Dogrulama:**
- [ ] OP20 kenar bantlama tamamlandi, yapisme ve derz kalitesi UYGUN
- [ ] OP30 CNC router tamamlandi, mentese yuvasi ve dubel deligi tolerans icinde
- [ ] Her iki operasyon icin ilk parca kontrolu yapildi

### Adim 13 — OP40-OP100: Boya Sureci (Zimpara → Astar → Lake → Kurutma → Ara Zimpara → Son Lake → Kurutma)
**Ekran:** ShopFloor Terminali (`/shopfloor`)
**Rol:** Boya Ustasi + Kalfa

**OP40 — Zimpara:**
```
Zimpara Siralamasi: 120 kum → 180 kum → 240 kum
Makine: ZMP-01 (Viet Valeria)
Yuzey: Ra < 15 um (boyaya hazir)
```

**OP50 — Astar (Primer):**
```
Primer: Ahsap astar, beyaz (BYA-PRM-01)
Kalinlik: 80-120 um (yas)
```

**OP60 — Lake 1. Kat:**
```
Boya: PU Lake RAL 9010 Pure White (BYA-PU-9010)
Kalinlik: 100-150 um (yas)
```

**Boya Kabini Ortam Kaydi (K5 — manuel):**

| Parametre | Spec | Olculen | Sonuc |
|-----------|------|---------|-------|
| Kabin sicakligi | 18-25°C | 22°C | UYGUN |
| Kabin nem | %40-65 RH | %52 RH | UYGUN |
| Hava filtre durumu | Temiz (< 500 saat) | 380 saat | UYGUN |
| Boya viskozitesi | 18-22 sn (DIN Cup 4) | 20 sn | UYGUN |

**OP70 — IR Kurutma (1. Kat):**
```
Sicaklik: 60°C, Sure: 30 dk, Konveyor hizi: 2 m/dk
```

**OP80 — Ara Zimpara (400 Kum):**
```
Hafif zimpara — yuzey puruzlulugu giderme, toz alma
Ra < 8 um (son kat boyaya hazir)
```

**OP90 — Son Kat Lake:**
```
Boya: PU Lake RAL 9010 (son kat — parlak/mat secimi)
Kalinlik: 100-150 um (yas)
Parlaklik: %30 GU (yarı mat — otel tercihi)
```

**OP100 — Final Kurutma:**
```
Sicaklik: 60°C, Sure: 45 dk (son kat — ekstra kurutma)
24 saat oda sicakliginda dinlenme (tam kurleme)
```

**Boya Kalite Kontrolu (5 numune):**

| # | Parca | Kalinlik (kuru, 80-120um) | Parlaklik (%30 ±5 GU) | Renk (RAL 9010) | Yuzey | Sonuc |
|---|-------|---------------------------|-----------------------|-----------------|-------|-------|
| 1 | KRY-001 | 95 um | 28 GU | UYGUN | Temiz | KABUL |
| 2 | KRY-050 | 102 um | 31 GU | UYGUN | Temiz | KABUL |
| 3 | KRY-100 | 88 um | 29 GU | UYGUN | Temiz | KABUL |
| 4 | KRY-150 | 110 um | 32 GU | UYGUN | Temiz | KABUL |
| 5 | KRY-200 | 97 um | 30 GU | UYGUN | 1 toz tanesi | KABUL (minör) |

**Sonuc:** 5/5 KABUL — Boya kalitesi UYGUN. 1 minor toz tanesi (satin hissedilmez).

**Dogrulama:**
- [ ] 7 boya sureci operasyonu (OP40-OP100) tamamlandi
- [ ] Boya kabini ortam parametreleri kaydedildi (K5)
- [ ] Boya kalinligi, parlaklik, renk uyumu kontrol edildi
- [ ] RAL 9010 renk eslesmesi teyit edildi
- [ ] Zimpara → astar → lake → kurutma → ara zimpara → son lake → kurutma akisi dogru

### Adim 14 — OP110-OP140: Montaj Sureci
**Ekran:** ShopFloor Terminali (`/shopfloor`)
**Rol:** Montajcilar

**OP110 — Govde Montaj (Karyola):**
```
Birlesim: Cam/dubel + PVA D3 tutkal
Press suresi: 5 dk/parca
Kose takviye: 8 adet metal L bracket
Tork: 2.5 Nm (vida sikilik)
```

**OP120 — Aksesuar Montaj:**
```
Mentese: 4 adet Blum Clip Top 110° — soft-close ayari
Kontrol: Kapak acilma/kapanma — yumusak kapama calisiyor
```

**OP130 — Elektrik Montaj (TV Unitesi Icin):**
```
LED Serit: 2m Sicak Beyaz (3000K) — raf alti
LED Trafo: 12V/2A — govde icine gizli montaj
Kablo: H05VV-F 2×0.75mm²
Fis: 2 pin Euro fis
Elektrik testi: Izolasyon OK, LED yanma OK
```

**OP140 — Cam Montaj (TV Unitesi + Gardrop Ayna):**
```
TV Unitesi: 6mm temperli cam — cam mentese ile montaj
Gardrop: 3mm temperli ayna — ic kapak yapistirma + mekanik tutucular
Kose koruma: Cam kenarlari 10mm pah
```

**Montaj Kalite Kontrolu (10 numune — her urun 2 adet):**

| Urun | # | Govde | Kapak | Cekmece | Elektrik | Sonuc |
|------|---|-------|-------|---------|----------|-------|
| Karyola | 1 | Saglam | Soft-close OK | — | — | KABUL |
| Karyola | 2 | Saglam | Soft-close OK | — | — | KABUL |
| Komodin | 1 | Saglam | — | Frenli OK | USB OK | KABUL |
| Komodin | 2 | Saglam | — | Frenli OK | USB OK | KABUL |
| Gardrop | 1 | Saglam | Surgu OK | — | Ayna OK | KABUL |
| Gardrop | 2 | Saglam | Surgu OK | — | Ayna OK | KABUL |
| C. Masasi | 1 | Saglam | — | Frenli OK | — | KABUL |
| C. Masasi | 2 | Saglam | — | Frenli OK | — | KABUL |
| TV Unitesi | 1 | Saglam | Soft-close OK | — | LED OK | KABUL |
| TV Unitesi | 2 | Saglam | Soft-close OK | — | LED OK | KABUL |

**Dogrulama:**
- [ ] 4 montaj operasyonu (OP110-OP140) tamamlandi
- [ ] Govde saglarnligi, kapak fonksiyonu, cekmece hareketi kontrol edildi
- [ ] Elektrik testi (LED + USB) basarili
- [ ] Cam montaji guvenli (temperli cam + pah kenarlari)
- [ ] 10 numune / 5 urun — tumu KABUL

---

## BOLUM 5: NUMUNE ONAY VE SERI URETIM

### Adim 15 — Prototip/Numune Onay (1 Oda Seti)
**Ekran:** Is Emirleri > Not Alani
**API:** Iliskili kayitlar
**Rol:** Satis Muduru + Kalite

```
Numune Seti: 1 karyola + 2 komodin + 1 gardrop + 1 masa + 1 TV unitesi
Uretim: Ilk is emrinden ayrilan 1 set
Musteri Sunumu: 2026-05-25 — Oz Ahsap showroom'unda
Katilimcilar: Grand Otel Ic Mimar + Satin Alma Koordinatoru
```

**Musteri Degerlendirmesi:**

| Kriter | Puan (1-5) | Yorum |
|--------|------------|-------|
| Boyut/Olcu | 5 | Projeye tam uyumlu |
| Renk (RAL 9010) | 4 | Cok hafif sari ton — kabul edilebilir |
| Yuzey Kalitesi | 5 | Lake cok duzgun, parlaklik dogru |
| Fonksiyon (kapak/cekmece) | 5 | Soft-close mukemmel |
| Montaj Kolayligi | 4 | Demonte kilavuz iyilestirilebilir |
| LED Aydinlatma | 5 | Sicak beyaz dogru ton |
| Genel Gorunum | 5 | Otel konseptine uygun |

**Musteri Karari:** ONAYLANDI — 1 reviizyon talebi var:
> Montaj kilavuzu fotograf destekli olarak guncellenmeli (K6).

**Dogrulama:**
- [ ] Numune seti uretildi ve musteriye sunuldu
- [ ] 7 kriter degerlendi — ortalama 4.7/5
- [ ] ONAYLANDI — seri uretime gecis izni
- [ ] 1 revizyon (montaj kilavuzu) not alandi
- [ ] Montaj kilavuzu PDF yuklendi (K6)

### Adim 16 — Seri Uretim Takibi
**Ekran:** Uretim > Is Emirleri
**Rol:** Uretim Muduru

**Haftalik Ilerleme:**

| Hafta | Tarih | Karyola | Komodin | Gardrop | Masa | TV Unitesi | Toplam Set |
|-------|-------|---------|---------|---------|------|------------|------------|
| H1 | 05-09 Mayis | 35 | 70 | — | — | — | ~35 |
| H2 | 12-16 Mayis | 40 | 80 | 30 | 30 | — | ~65 |
| H3 | 19-23 Mayis | 40 | 80 | 40 | 40 | 35 | ~105 |
| H4 | 26-30 Mayis | 40 | 80 | 40 | 40 | 40 | ~145 |
| H5 | 02-06 Haziran | 35 | 70 | 40 | 40 | 40 | ~180 |
| H6 | 09-13 Haziran | 20 | 40 | 30 | 30 | 35 | ~200+ |
| H7 | 16-20 Haziran | Yedek | Yedek | 30 | 30 | 30 | Tamamlama |

**Dogrulama:**
- [ ] Haftalik uretim takibi yapildi
- [ ] Uretim kademeli baslatildi (karyola + komodin once, gardrop/masa/TV sonra)
- [ ] 7. hafta sonunda 200+ set tamamlandi
- [ ] Cift vardiya uygulamasi not edildi (kapasite plani)

---

## BOLUM 6: SON KONTROL VE KALITE

### Adim 17 — Son Kontrol (OP150)
**Ekran:** Kalite > Son Muayene (`/quality/final-inspection`)
**API:** `POST /inspections`
**Rol:** Kalite Sorumlusu

**%100 Gorsel + Fonksiyonel Kontrol (Her Parca):**

| Kontrol | Kriter | Karyola (210) | Komodin (420) | Gardrop (210) | Masa (210) | TV (210) |
|---------|--------|---------------|---------------|---------------|------------|----------|
| Boyut | Tolerans icinde | 208 K / 2 R | 418 K / 2 R | 209 K / 1 R | 210 K | 208 K / 2 R |
| Boya yuzey | Cizik/toz/akma YOK | 206 K / 4 R | 416 K / 4 R | 207 K / 3 R | 208 K / 2 R | 206 K / 4 R |
| Renk | RAL 9010 eslesmesi | 210 K | 420 K | 210 K | 210 K | 210 K |
| Fonksiyon | Kapak/cekmece/LED OK | 210 K | 420 K | 208 K / 2 R | 210 K | 208 K / 2 R |
| Montaj | Saglam, sallanma YOK | 210 K | 418 K / 2 R | 210 K | 210 K | 210 K |

**Ret Ozeti:**

| Urun | Toplam Uretim | Kabul | Ret | Ret Orani | Ret Nedeni |
|------|---------------|-------|-----|-----------|------------|
| Karyola | 210 | 204 | 6 | %2.9 | 2 boyut, 4 boya |
| Komodin | 420 | 410 | 10 | %2.4 | 2 boyut, 4 boya, 2 montaj, 2 cekmece rayi |
| Gardrop | 210 | 203 | 7 | %3.3 | 1 boyut, 3 boya, 2 surgu, 1 ayna cizik |
| Calisma Masasi | 210 | 206 | 4 | %1.9 | 2 boya, 2 boyut (metal ayak hizasi) |
| TV Unitesi | 210 | 202 | 8 | %3.8 | 2 boyut, 4 boya, 2 LED ariza |
| **TOPLAM** | **1,260** | **1,225** | **35** | **%2.8** | |

> **NOT:** 35 ret parcasi tamir edilecek (boya kusuru → yeniden boya, fonksiyon → aksesuar degisimi).
> 1,225 parca = 200 set + 25 yedek parca.

**Dogrulama:**
- [ ] %100 son kontrol yapildi (1,260 parca)
- [ ] 35 ret (%2.8 ortalama) — mobilya sektoru icin kabul edilebilir
- [ ] 200 set + yedek parca yeterli
- [ ] Ret nedenleri kategorize edildi (boya %49, boyut %23, fonksiyon %17, diger %11)
- [ ] Tamir plani olusturuldu

### Adim 18 — Fire Raporu
**Ekran:** Uretim > Raporlar
**Rol:** Uretim Muduru

**Panel Fire Analizi (K9):**

| Malzeme | Kullanilan | Planlanan | Gercek Fire | Hedef Fire | Fark |
|---------|-----------|-----------|-------------|------------|------|
| 18mm MDF | 570 tabaka | %10 | %11.7 | %10 | +%1.7 |
| 25mm Sunta | 440 tabaka | %8 | %9.2 | %8 | +%1.2 |
| 25mm MDF | 135 tabaka | %8 | %7.5 | %8 | -%0.5 (iyi) |

**Boya Sarfiyat Analizi:**

| Malzeme | Planlanan (lt) | Kullanilan (lt) | Fark | Aciklama |
|---------|---------------|-----------------|------|----------|
| PU Lake RAL 9010 | 680 | 725 | +%6.6 | Tamir boya dahil |
| Primer | 240 | 248 | +%3.3 | Normal |

**Dogrulama:**
- [ ] Fire raporu olusturuldu (K9)
- [ ] Panel fire ortalaması %11.7 → hedefe yakin ancak iyilestirme gerekli
- [ ] Boya sarfiyati +%6.6 (tamir boya dahil) — kabul edilebilir
- [ ] Nesting optimizasyonu icin CNC program guncelleme onerisi not edildi

---

## BOLUM 7: DEPO, SEVKIYAT VE FATURA

### Adim 19 — Depo (Set Bazli Stok)
**Ekran:** Depo (`/warehouse`)
**API:** `POST /warehouse/stock`
**Rol:** Depo Sorumlusu

```
Depo: Oz Ahsap Mobilya Ana Depo — Ikitelli/Istanbul
Stok Durumu (Set Bazli):
- 200 oda seti × 6 parca = 1,200 parca (paketli)
- 25 yedek parca (karisik)
- Her parca demonte paketli, koli numarali (ODA-001 ~ ODA-200)
- Set eslesmesi: Her oda numarasi icin 6 koli (K3)
```

**Koli Numaralama (K3 — oda bazli set eslesmesi):**
```
ODA-001-KRY (Karyola) | ODA-001-KMD-1 (Komodin 1) | ODA-001-KMD-2 (Komodin 2)
ODA-001-GRD (Gardrop) | ODA-001-CMS (Masa) | ODA-001-TVU (TV Unitesi)
...
ODA-200-KRY | ODA-200-KMD-1 | ODA-200-KMD-2 | ODA-200-GRD | ODA-200-CMS | ODA-200-TVU
```

**Dogrulama:**
- [ ] 1,200 parca (200 set) depo girisi yapildi
- [ ] Koli bazli oda numarasi eslesmesi var (K3)
- [ ] Her koli uzerinde oda no + parca tipi etiketi
- [ ] Yedek parcalar ayri stok kodu ile

### Adim 20 — Sevkiyat Planlama ve Yukleme
**Ekran:** Sevkiyat (`/shipments`)
**API:** `POST /shipment`
**Rol:** Depo Sorumlusu + Lojistik

```
Guzergah: Ikitelli/Istanbul → Grand Otel Belek, Serik/Antalya (~720 km)
Arac: TIR (13.6m tenteli) — her TIR 20 oda seti kapasitesi
TIR Sayisi: 10 arac (200 oda / 20 oda/TIR)
Lojistik Firma: AnatoliaKargo Lojistik Ltd.Sti.
Yukleme Baslangici: 2026-07-14
Son Yukleme: 2026-07-18
Montaj Baslangic: 2026-07-21
```

**Sevkiyat Detayi:**

| Sevkiyat # | Irsaliye | TIR Plaka | Oda Araligi | Koli Sayisi | Tarih |
|------------|----------|-----------|-------------|-------------|-------|
| SVK-01 | MBL-IRS-2026-01 | 34 XX 001 | ODA-001 ~ ODA-020 | 120 koli | 2026-07-14 |
| SVK-02 | MBL-IRS-2026-02 | 34 XX 002 | ODA-021 ~ ODA-040 | 120 koli | 2026-07-14 |
| SVK-03 | MBL-IRS-2026-03 | 34 XX 003 | ODA-041 ~ ODA-060 | 120 koli | 2026-07-15 |
| SVK-04 | MBL-IRS-2026-04 | 34 XX 004 | ODA-061 ~ ODA-080 | 120 koli | 2026-07-15 |
| SVK-05 | MBL-IRS-2026-05 | 34 XX 005 | ODA-081 ~ ODA-100 | 120 koli | 2026-07-16 |
| SVK-06 | MBL-IRS-2026-06 | 34 XX 006 | ODA-101 ~ ODA-120 | 120 koli | 2026-07-16 |
| SVK-07 | MBL-IRS-2026-07 | 34 XX 007 | ODA-121 ~ ODA-140 | 120 koli | 2026-07-17 |
| SVK-08 | MBL-IRS-2026-08 | 34 XX 008 | ODA-141 ~ ODA-160 | 120 koli | 2026-07-17 |
| SVK-09 | MBL-IRS-2026-09 | 34 XX 009 | ODA-161 ~ ODA-180 | 120 koli | 2026-07-18 |
| SVK-10 | MBL-IRS-2026-10 | 34 XX 010 | ODA-181 ~ ODA-200 + Yedek | 125 koli | 2026-07-18 |

**Dogrulama:**
- [ ] 10 sevkiyat kaydi olusturuldu
- [ ] Oda bazli yukleme sirasi dogru (montaj onceligi ile)
- [ ] Toplam 1,205 koli (1,200 + 5 yedek koli)
- [ ] Her irsaliyede koli listesi ve oda numaralari var
- [ ] Lojistik firma ve arac plaka bilgileri girildi

### Adim 21 — Montaj (Fason Hizmet — Otel Yerinde)
**Ekran:** Fason Siparis (`/subcontract-orders`)
**API:** `POST /subcontractorder`
**Rol:** Uretim Muduru

```
Fason Siparis No: FSN-2026-0055
Tedarikci: Oz Ahsap Mobilya — Kendi Montaj Ekibi (4 kisi)
Proses: Otel yerinde oda montaji
Lokasyon: Grand Otel Belek, Serik/Antalya
Sure: 40 is gunu (10 oda/gun × 4 kisi)
Baslangic: 2026-07-21
Bitis: 2026-09-12
Tutar: 200,000 TRY (200 oda × 1,000 TRY/oda)
```

```
Not (K10):
- Montaj ekibi konaklama: Otel tarafindan karsilanacak
- Montaj sonrasi oda bazli kontrol: Ic mimar onayı
- Hasar durumunda: Yedek parca mevcut (25 adet depo stogu)
- Montaj kilavuzu her oda setinde mevcut (K6)
```

**Dogrulama:**
- [ ] Fason montaj siparisi olusturuldu (K10)
- [ ] Lokasyon (Antalya) ve sure (40 is gunu) dogru
- [ ] Tutar siparis ile uyumlu (200,000 TRY)
- [ ] Montaj kilavuzu ve yedek parca notu var

### Adim 22 — Fatura (3 Taksit)
**Ekran:** Faturalar (`/invoices`)
**API:** `POST /invoice`
**Rol:** Muhasebe

**Fatura 1 — Siparis Onayi (%30):**
```
Fatura No: FTR-2026-0112-A
Tarih: 2026-04-20
Tutar: 1,176,000.00 TRY (3,920,000 × %30)
KDV (%20): 235,200.00 TRY
Toplam: 1,411,200.00 TRY
Vade: Pesin
```

**Fatura 2 — Uretim Ortasi (%40):**
```
Fatura No: FTR-2026-0112-B
Tarih: 2026-06-15
Tutar: 1,568,000.00 TRY (3,920,000 × %40)
KDV (%20): 313,600.00 TRY
Toplam: 1,881,600.00 TRY
Vade: 30 gun
```

**Fatura 3 — Teslimat Sonrasi (%30):**
```
Fatura No: FTR-2026-0112-C
Tarih: 2026-09-15 (montaj tamamlama sonrasi)
Tutar: 1,176,000.00 TRY (3,920,000 × %30)
KDV (%20): 235,200.00 TRY
Toplam: 1,411,200.00 TRY
Vade: 60 gun
```

**Fatura Ozeti:**

| # | Fatura | Tutar | KDV | Toplam | Vade | Durum |
|---|--------|-------|-----|--------|------|-------|
| 1 | FTR-2026-0112-A | 1,176,000 | 235,200 | 1,411,200 | Pesin | ODENDI |
| 2 | FTR-2026-0112-B | 1,568,000 | 313,600 | 1,881,600 | 30 gun | BEKLIYOR |
| 3 | FTR-2026-0112-C | 1,176,000 | 235,200 | 1,411,200 | 60 gun | PLANLI |
| **TOPLAM** | | **3,920,000** | **784,000** | **4,704,000** | | |

**Dogrulama:**
- [ ] 3 fatura olusturuldu (taksitli odeme plani)
- [ ] %30 + %40 + %30 = %100 dogru dagilim
- [ ] KDV %20 dogru hesaplandi
- [ ] Genel toplam 4,704,000 TRY (KDV dahil)
- [ ] Ilk taksit ODENDI durumunda
- [ ] Vade tarihleri proje takvimine uygun

---

## BOLUM 8: SEVKIYAT SONRASI HASAR SENARYOSU

### Adim 23 — Nakliye Hasari (NCR)
**Ekran:** Kalite > NCR (`/quality/ncr`)
**API:** `POST /ncr`
**Rol:** Kalite Sorumlusu

> **SENARYO:** TIR-03 (ODA-041 ~ ODA-060) nakliyesinde 5 komodinde boya hasari tespit edildi.
> Koli korumasi yetersiz — kose darbesi.

```
NCR No: NCR-2026-0092
Tip: MINOR — Nakliye Hasari
Kaynak: Montaj ekibi bildirimi (otel yerinde tespit)
Sevkiyat: SVK-03 (MBL-IRS-2026-03)
Etkilenen: ODA-043-KMD-1, ODA-047-KMD-2, ODA-051-KMD-1, ODA-055-KMD-2, ODA-058-KMD-1
Sorun: Boya yuzeyinde kose darbe hasari (3-5cm alan, lake cikmis)
```

**Aksiyon (K8):**
```
1. Hasarli 5 komodin fotoğraflandi (dosya eki yuklendi)
2. Yedek stoktan 5 adet komodin gonderilecek (SVK-11)
3. Hasarli parcalar fabrikaya iade → tamir (yeniden zimpara + lake)
4. Nakliye firmasina hasar bildirimi + sigorta talebi
5. Paketleme iyilestirme: Ek kose koruma (koselikleri kalinlastirma)
```

**Dogrulama:**
- [ ] NCR olusturuldu, nakliye hasari olarak siniflandirildi (K8)
- [ ] 5 hasarli parca seri numaralari ile tespit edildi
- [ ] Yedek stoktan gonderim planlandi
- [ ] Nakliye sigortasi talebi notu eklendi
- [ ] Paketleme iyilestirme CAPA'ya baglandi

### Adim 24 — Nakliye Hasari CAPA
**Ekran:** Kalite > CAPA (`/quality/capa`)
**API:** `POST /capa`
**Rol:** Kalite Sorumlusu

```
CAPA No: CAPA-2026-0041
Iliskili NCR: NCR-2026-0092
Kok Neden: Ambalaj kose koruma yetersiz — 720 km nakliye mesafesi icin daha saglam koruma gerekli
Analiz: Ishikawa (Malzeme/Metod/Makine/Insan)
```

**Aksiyonlar:**

| # | Aksiyon | Sorumlu | Hedef Tarih | Durum |
|---|---------|---------|-------------|-------|
| 1 | Kose koruma kalinligi 20mm → 40mm yukseltme | Ambalaj | 2026-07-20 | ACIK |
| 2 | TIR icine ayirici bariyer ekleme | Lojistik | 2026-07-20 | ACIK |
| 3 | Nakliye sigortasi kapsamini genisletme | Finans | 2026-07-25 | ACIK |
| 4 | SVK-04 ~ SVK-10 icin guclendirilmis ambalaj uygulama | Ambalaj | 2026-07-15 | ACIL |

**Dogrulama:**
- [ ] CAPA olusturuldu, NCR ile iliskilendirildi
- [ ] Kok neden: ambalaj yetersizligi
- [ ] 4 aksiyon maddesi (duzeltici + onleyici)
- [ ] Kalan sevkiyatlar icin ACIL aksiyon planlanmis

---

## BOLUM 9: MALIYET ANALIZI

### Adim 25 — Set Bazli Maliyet Hesaplama
**Ekran:** Uretim > Maliyet Analizi (`/production/part-cost`)
**API:** `GET /partcost/{workOrderId}`
**Rol:** Uretim Muduru

**Birim Maliyet — 1 Oda Seti (6 parca):**

| Parca | Malzeme | Iscilik | Genel Gider (%41) | Birim Maliyet |
|-------|---------|---------|-------------------|---------------|
| Karyola | 2,320 | 1,450 | 1,546 | 5,316 TRY |
| Komodin (×2) | 1,360 | 720 | 853 | 2,933 TRY |
| Gardrop | 2,650 | 1,680 | 1,775 | 6,105 TRY |
| Calisma Masasi | 1,780 | 980 | 1,132 | 3,892 TRY |
| TV Unitesi | 1,690 | 1,100 | 1,144 | 3,934 TRY |
| **SET TOPLAMI** | **9,800** | **5,930** | **6,450** | **22,180 TRY** |

**Proje Maliyet Ozeti (200 set):**

| Kalem | Tutar (TRY) | Oran |
|-------|-------------|------|
| Malzeme (200 set) | 1,960,000 | %44.6 |
| Iscilik (200 set) | 1,186,000 | %27.0 |
| Genel Gider (200 set) | 1,290,000 | %29.4 |
| **Uretim Toplam** | **4,436,000** | |
| Nakliye (gercek) | 180,000 | |
| Montaj (gercek) | 200,000 | |
| Nakliye Hasari (tamir + ek sevkiyat) | 12,000 | |
| **PROJE TOPLAM MALIYET** | **4,828,000** | |
| **PROJE SATIS GELIRI** | **3,920,000** | |
| **KAR / ZARAR** | **-908,000 TRY (ZARAR!)** | |
| **Kar Marji** | **-%23.2** | |

> **UYARI:** CIDDI ZARAR! Proje maliyeti (4,828,000) > satis geliri (3,920,000).
> **Kok Neden:** Genel gider orani cok yuksek (%41) + iscilik maliyeti beklenenin uzerinde.
> **Oneriler:**
> 1. Set fiyatini 19,600 → 25,000 TRY'ye revize etme (sonraki projeler icin)
> 2. Boya sureci otomasyonu ile iscilik dusurme
> 3. Panel kesim fire oranini %8'e dusurme (nesting optimizasyonu)
> 4. Cift vardiya yerine fazla mesai ile kapasite karsilama (daha dusuk maliyet)
> 5. Sunta/melamin ile MDF+lake karmasik parcalar icin maliyet karsilastirma

**Dogrulama:**
- [ ] Set bazli maliyet hesaplandi (22,180 TRY/set vs 19,600 TRY satis)
- [ ] Proje bazli ZARAR tespit edildi (-908,000 TRY = -%23.2)
- [ ] Malzeme %44.6, iscilik %27, genel gider %29.4 dagilimi
- [ ] Nakliye hasari ek maliyeti dahil (12,000 TRY)
- [ ] 5 iyilestirme onerisi not edildi

---

## BOLUM 10: ROL TESTLERI

### 10.1 Uretim Muduru Rol Testi
**Giris:** uretim.muduru@ozahsap.com.tr
- [ ] ERISIM VAR: Is Emri (5 is emri), Operasyon Routing, Makineler, ShopFloor, BOM, Maliyet Analizi (goruntule+kaydet)
- [ ] ERISIM VAR: Uretim Raporlari (fire, ilerleme, kapasite)
- [ ] SADECE GORUNTULE: Siparis, Musteri, Muayene
- [ ] ERISIM YOK: Fatura, Fiyat duzenleme

### 10.2 Depo Sorumlusu Rol Testi
**Giris:** depo@ozahsap.com.tr
- [ ] ERISIM VAR: Mal Kabul, Depo/Stok, Sevkiyat, Paketleme (goruntule+kaydet)
- [ ] ERISIM VAR: Koli numaralama ve set eslesmesi
- [ ] SADECE GORUNTULE: Is Emri (tamamlanan)
- [ ] ERISIM YOK: Kalite, Fatura, Maliyet

### 10.3 Satinalma Rol Testi
**Giris:** satinalma@ozahsap.com.tr
- [ ] ERISIM VAR: Satinalma Siparis (7 PO), Fason Siparis (montaj), Mal Kabul, Tedarikci (goruntule+kaydet)
- [ ] SADECE GORUNTULE: Is Emri, Stok
- [ ] ERISIM YOK: Kalite, Fatura, Maliyet detayi

### 10.4 Operator Rol Testi (CNC Kesim Ustasi)
**Giris:** kesim.ustasi@ozahsap.com.tr
- [ ] ERISIM VAR: ShopFloor — kendi is emirleri, operasyon baslat/bitir
- [ ] ERISIM VAR: Nesting programi referansi ve fire kaydi girisi
- [ ] ERISIM YOK: Diger operatorlerin is emirleri, Fiyat, Musteri, Kalite
- [ ] Panel kesim parametreleri ve fire oranini girebiliyor

---

## BOLUM 11: MOBILYA SEKTORU — EN 16139 DAYANIKLILIK TESTI (Ek Senaryo)

### 11.1 Dayaniklilik Testi (K7 — Dis Lab / Ic Test)

> **NOT:** EN 16139 (Ticari olmayan mobilya dayanikliligi) testi otel mobilyasi icin zorunludur.
> Quvex'te dayaniklilik test modulu yok (K7). Test sonuclari not alani ve dosya eki olarak kaydedilir.

**Test Sonuclari (1 numune set — dis lab):**

| Test | Standart | Urun | Dongu/Yuk | Sonuc | Degerlendirme |
|------|----------|------|-----------|-------|---------------|
| Yatak Stabilite | EN 16139 | Karyola | 100,000 dongu, 100kg | Deformasyon YOK | GECTI |
| Cekmece Acma/Kapama | EN 16139 | Komodin | 50,000 dongu | Frenli ray saglan | GECTI |
| Kapak Acma/Kapama | EN 16139 | Gardrop | 50,000 dongu | Soft-close OK | GECTI |
| Surgu Kapak | EN 16139 | Gardrop | 20,000 dongu | Ray hasar YOK | GECTI |
| Masa Dikey Yuk | EN 16139 | Masa | 100kg statik | Deformasyon < 1mm | GECTI |
| TV Unitesi Yuk | EN 16139 | TV Unitesi | 50kg (TV agirlik) | Egilme < 2mm | GECTI |
| Cam Darbe | EN 12150-1 | TV Unitesi | 6mm temperli | Kirilma YOK | GECTI |

**Dogrulama:**
- [ ] 7 dayaniklilik testi sonucu kaydedildi (K7)
- [ ] Tum testler GECTI — EN 16139 uyumlu
- [ ] Test raporu dosya eki olarak yuklendi
- [ ] Cam darbe testi ayrica EN 12150-1'e gore yapildi

---

## BOLUM 12: KRITIK IS KURALLARI VE DOGRULAMA MATRISI

### 12.1 End-to-End Dogrulama Matrisi

| # | Kontrol Noktasi | Bolum | Beklenen | Test Durumu |
|---|----------------|-------|----------|-------------|
| 1 | Musteri karti (otel, proje, FSC, RAL) | 1.1 | Zorunlu alanlar dolu | [ ] |
| 2 | 5 urun tanimi (boyut, malzeme, renk) | 1.3 | 5 urun dogru detayla | [ ] |
| 3 | BOM — 51 kalem (5 urun × alt BOM) | 1.4 | Set toplam 9,800 TRY | [ ] |
| 4 | Teklif — 5 kalem + nakliye + montaj | 2.5 | 3,920,000 TRY toplam | [ ] |
| 5 | Contract review — kapasite uyarisi | 2.6 | Cift vardiya notu, FSC kontrolu | [ ] |
| 6 | Siparis donusumu — 1,200 parca | 2.7 | 200 set, PO eslesmesi | [ ] |
| 7 | MRP — 7 satinalma siparisi | 3.8 | Panel + aksesuar + boya + metal | [ ] |
| 8 | Mal kabul — MDF kalinlik/nem | 3.9 | 5 numune, FSC sertifika | [ ] |
| 9 | 5 is emri — kademeli baslangic | 4.10 | 1,260 parca toplam | [ ] |
| 10 | CNC nesting — fire kaydi (K1) | 4.11 | Planlanan vs gercek fire | [ ] |
| 11 | Kenar bant + CNC router | 4.12 | Mentese yuvasi, dubel deligi OK | [ ] |
| 12 | Boya sureci — 7 operasyon | 4.13 | RAL 9010, kalinlik, parlaklik | [ ] |
| 13 | Boya kabini ortam kaydi (K5) | 4.13 | Sicaklik, nem, filtre | [ ] |
| 14 | Montaj — 4 operasyon | 4.14 | Govde + aksesuar + elektrik + cam | [ ] |
| 15 | Numune onay — musteri 4.7/5 | 5.15 | ONAYLANDI, 1 revizyon | [ ] |
| 16 | Seri uretim — 7 hafta takip | 5.16 | 200+ set tamamlandi | [ ] |
| 17 | Son kontrol — %2.8 ret | 6.17 | 1,225 KABUL, 35 RET | [ ] |
| 18 | Fire raporu (K9) | 6.18 | Panel %11.7, boya +%6.6 | [ ] |
| 19 | Depo — oda bazli set eslesmesi (K3) | 7.19 | 200 set × 6 koli | [ ] |
| 20 | 10 sevkiyat — TIR bazli | 7.20 | 1,205 koli, oda sirali | [ ] |
| 21 | Fason montaj siparisi (K10) | 7.21 | Otel yerinde, 40 is gunu | [ ] |
| 22 | 3 fatura (%30/%40/%30) | 7.22 | 4,704,000 TRY (KDV dahil) | [ ] |
| 23 | Nakliye hasari NCR (K8) | 8.23 | 5 komodin, fotograf eki | [ ] |
| 24 | Nakliye hasari CAPA | 8.24 | Ambalaj iyilestirme, 4 aksiyon | [ ] |
| 25 | Set maliyet — ZARAR tespiti | 9.25 | 22,180 > 19,600 = ZARAR | [ ] |
| 26 | Proje maliyet — -908,000 TRY | 9.25 | -%23.2 kar marji | [ ] |
| 27 | Uretim Muduru erisim | 10.1 | Uretim OK, fatura HAYIR | [ ] |
| 28 | Depo Sorumlusu erisim | 10.2 | Depo/sevkiyat OK, kalite HAYIR | [ ] |
| 29 | Satinalma erisim | 10.3 | Satin alma + fason OK, maliyet HAYIR | [ ] |
| 30 | Operator erisim (ShopFloor) | 10.4 | Sadece kendi is emri | [ ] |
| 31 | EN 16139 dayaniklilik (K7) | 11.1 | 7 test GECTI | [ ] |

### 12.2 Workaround Dogrulama (K1-K10)
- [ ] K1 Nesting→is emri notu (11) | K2 3D render→dosya eki (3) | K3 Oda eslesmesi→seri no + koli etiketi (19)
- [ ] K4 Renk/doku→urun notu RAL 9010 (3) | K5 Boya kabin→manuel kayit (13) | K6 Montaj kilavuzu→PDF eki (15, 21)
- [ ] K7 Dayaniklilik→not + dosya eki (11.1) | K8 Nakliye hasar→NCR (23) | K9 Fire rapor→is emri notu (18)
- [ ] K10 Saha montaj→fason siparis (21)

### 12.3 Mobilya Sektoru — Quvex Modul Uyumu

> **NOT:** Quvex imalat ERP olarak mobilya sektorune de uygulanabilir. Asagida modul uyum tablosu:

| Quvex Modulu | Mobilya Kullanimi | Uyumluluk | Not |
|--------------|-------------------|-----------|-----|
| Musteri + Adres | Otel/firma kaydı + proje adresi | %100 | |
| Urun + BOM | Alt BOM destegi ile set tanimi | %90 | Set bazli BOM gorsel eksik |
| Teklif + Siparis | Set fiyat + nakliye + montaj | %100 | |
| Satinalma + MRP | Panel + aksesuar + boya tedariği | %95 | MRP otomatik degil, manuel hesap |
| Mal Kabul + Kalite | Panel kalinlik, nem, yuzey kontrolu | %100 | |
| Is Emri + Routing | 15 operasyon, kademeli uretim | %100 | |
| ShopFloor | Operasyon baslat/bitir, parametre | %95 | Nesting referansi workaround (K1) |
| Boya Proses | Kalinlik, parlaklik, renk kontrolu | %85 | Kabin ortam izleme workaround (K5) |
| Son Kontrol | Boyut, boya, fonksiyon kontrolu | %100 | |
| Depo + Sevkiyat | Koli bazli stok, TIR bazli yukleme | %85 | Oda-set eslesmesi workaround (K3) |
| Fason Siparis | Montaj hizmeti, nakliye | %100 | |
| Fatura | Taksitli fatura, KDV | %100 | |
| NCR + CAPA | Nakliye hasari, kok neden, aksiyon | %100 | |
| Maliyet Analizi | Set bazli maliyet, kar/zarar | %100 | |
| Tedarikci Deg. | FSC sertifikali tedarikci | %90 | FSC ozel alan yok |

**Sonuc:** Quvex 15 modulden 15'i mobilya sektorunde kullanilabilir (%85-100 uyum).

---

## SONUC

**Kapsam:** 31 dogrulama + 10 workaround | 15 Quvex modul | 4 rol | 5 Farkli Mobilya Parcasi + Lake Boya + Montaj + 10-TIR Sevkiyat

**Mobilya Sektoru Farklliklari:**
- Buyuk hacimli urunler (1,200+ koli, 10 TIR sevkiyat)
- Set bazli takip (oda numarasi → 6 parca eslesmesi)
- Boya/lake sureci uzun (7 operasyon) ve ortam kosullarına baĝimli
- Musteri onay sureci (prototip 1 oda seti)
- Nakliye hasari riski yuksek (buyuk, kirilgan parcalar)
- Yerinde montaj hizmeti (fason olarak takip)

**Gelecek Gelistirme:** Panel nesting entegrasyonu (Biesse OptiNest API), 3D urun gorsellestirme, oda bazli set takip modulu, renk/doku tanimlama alanlari (RAL, NCS), boya kabin ortam izleme dashboard, nakliye hasar takip modulu, montaj ekibi saha takip, fire optimizasyon raporu

---

> **Hazirlayan:** QA Ekibi
> **Tarih:** 2026-04-10
> **Revizyon:** A
> **Durum:** TASLAK — Gozden gecirme bekliyor
> **Referans Senaryolar:** `tests/KAYNAK-ATOLYESI-E2E-SENARYO.md`, `tests/MEDIKAL-CIHAZ-E2E-SENARYO.md`
