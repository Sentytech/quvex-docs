# Metal Esya / Celik Konstruksiyon — Uctan Uca Test Senaryosu

> **Firma Profili:** Yilmaz Celik Konstruksiyon San. Ltd. Sti. — 40 personel, CNC plazma kesim, abkant pres (bukme), kaynak robotlari + manuel TIG/MIG, toz boya hatti, montaj hatti
> **Sertifikalar:** EN 1090-2 (Celik yapi imalati), ISO 3834-2 (Kaynak kalite), ISO 9001:2015, CE isaretlemesi
> **Musteriler:** Insaat firmalari, market zincirleri, lojistik firmalari
> **Urunler:** Celik depo raf sistemi (1000 set siparis), yangin kapisi (CE belgeli — EI60)
> **Is Modeli:** Hem stoka uretim (standart raf), hem siparise ozel (yangin kapisi, ozel celik konstruksiyon)
> **Senaryo:** ABC Lojistik'ten gelen 1000 set depo raf sistemi siparisi — musteri kaydi, urun/BOM tanimi, teklif, siparis, MRP, satin alma, uretim (kesim/bukme/kaynak/boya), kalite kontrol, depo, sevkiyat, fatura. Ek olarak CE belgeli yangin kapisi uretim senaryosu.

---

## BILINEN KISITLAMALAR (Quvex'te Henuz Mevcut Degil)

> Bu kisitlamalar test sirasinda ilgili adimlarda **not alanlarina** yazilacaktir.
> Test raporunda bu maddeler "WORKAROUND" olarak isaretlenecektir.

| # | Eksik Modul/Ozellik | Workaround |
|---|---------------------|------------|
| K1 | Nesting / kesim optimizasyonu modulu yok | CNC plazma programi harici yazilimda yapilir, fire orani ShopFloor notuna girilir |
| K2 | Tonaj/agirlik bazli stok takibi ayri alan yok | Birim olarak KG kullanilir, profil/sac stoku KG cinsinden izlenir |
| K3 | Kamyon kapasite planlama (agirlik/hacim) modulu yok | Sevkiyat notu alanina kamyon detaylari ve agirlik hesabi yazilir |
| K4 | Montaj sahasi takibi (saha is emri) sinirli | Montaj hizmeti ayri is emri olarak acilir, saha notlari eklenir |
| K5 | EN 1090-2 EXC (Execution Class) ayri alani yok | Urun notuna ve kontrol planina EXC sinifi yazilir |
| K6 | Boya kalinligi otomatik kayit (dijital olcerden veri aktarimi) yok | ShopFloor terminalinde manuel mikron degeri girilir |
| K7 | Yapistirma testi (cross-cut) sonuc formu ayri modul yok | Muayene formunda not alani + dosya eki olarak yuklenir |
| K8 | CE Uygunluk Beyani (Declaration of Conformity) sablonu yok | PDF olarak dosya ekine yuklenir, CoC modulunde referans verilir |
| K9 | Set bazli otomatik stok hareketi (set gir → parcalar otomatik dus) yok | Her parca ayri stok hareketi ile girilir, set bazli takip not alaniyla yapilir |

---

## BOLUM 0: SISTEM KURULUMU (Tek Seferlik)

### 0.1 Makine / Ekipman Tanimlari
**Ekran:** Ayarlar > Makineler (`/settings/machines`)
**API:** `POST /machines`

| Makine Kodu | Makine Adi | Marka/Model | Yil | Saat Ucreti | Setup Ucreti |
|-------------|------------|-------------|-----|-------------|--------------|
| PLZ-01 | CNC Plazma Kesim Masasi 3000x1500 | Hypertherm XPR300 | 2022 | 450 TL/saat | 150 TL/saat |
| GYT-01 | Giyotin Makas 3000mm | Baykal HGL 3100x6 | 2020 | 200 TL/saat | 80 TL/saat |
| ABK-01 | Abkant Pres 3100mm 135 ton | Baykal APHS 31135 | 2021 | 350 TL/saat | 120 TL/saat |
| ABK-02 | Abkant Pres 2600mm 60 ton | Ermaksan Speed-Bend Pro | 2019 | 300 TL/saat | 100 TL/saat |
| KRB-01 | Kaynak Robotu (MIG/MAG) | Fronius TPS 500i + Fanuc ArcMate 100iD | 2023 | 500 TL/saat | 200 TL/saat |
| KAY-01 | Manuel TIG Kaynak Kabini | Lincoln Electric Invertec V205-T | 2020 | 350 TL/saat | 100 TL/saat |
| KAY-02 | Manuel MIG/MAG Kaynak Seti | Fronius TransSteel 3500 | 2021 | 300 TL/saat | 80 TL/saat |
| KUM-01 | Kumlama Kabini (Bilyali) | Guyson Euroblast 9SF | 2018 | 200 TL/saat | 60 TL/saat |
| BOY-01 | Toz Boya Hatti (Otomatik) | Gema OptiFlex Pro | 2022 | 400 TL/saat | 150 TL/saat |
| FRN-01 | Kur Firini (Boya) 4m x 2m x 2m | Ozel Yapim — Dogalgaz | 2022 | 250 TL/saat | 50 TL/saat |
| TST-01 | Bant Testere (Profil Kesim) | Behringer HBP-263A | 2019 | 180 TL/saat | 60 TL/saat |
| MNT-01 | Montaj Hatti (Manuel) | Ozel Yapim — Pnomatik Tork Aleti | 2021 | 150 TL/saat | 30 TL/saat |

**Dogrulama:**
- [ ] 12 makine/ekipman basariyla tanimlandi
- [ ] Saat ucretleri ve setup ucretleri girildi
- [ ] Plazma, giyotin, abkant, kaynak, kumlama, boya, montaj makineleri listede gorunuyor
- [ ] Makine listesinde tumu gorunuyor

### 0.2 Is Emri Adimlari (Operasyon Tanimlari)
**Ekran:** Ayarlar > Is Emri Adimlari (`/settings/work-order-steps`)
**API:** `POST /workordersteps`

| Kod | Operasyon Adi | Vars. Makine | Setup (dk) | Beceri |
|-----|--------------|-------------|------------|--------|
| OP10 | Profil / Sac Kesim (Plazma / Giyotin / Testere) | PLZ-01, GYT-01, TST-01 | 15 | 2 (Kalfa) |
| OP20 | Delik Delme / Punclama | PLZ-01 | 10 | 2 (Kalfa) |
| OP30 | Capak Alma / Kaynak Agzi Hazirlik | — (Manuel) | 10 | 1 (Isci) |
| OP40 | Abkant Bukme | ABK-01, ABK-02 | 20 | 3 (Usta) |
| OP50 | Kaynak (Robot MIG/MAG) | KRB-01 | 25 | 3 (Usta) |
| OP55 | Kaynak (Manuel TIG/MIG) | KAY-01, KAY-02 | 15 | 3 (Usta) |
| OP60 | Kaynak Gorsel Kontrol (VT) | — | 10 | 3 (Usta) |
| OP70 | Kumlama (Sa 2.5) | KUM-01 | 15 | 2 (Kalfa) |
| OP80 | Toz Boya Uygulama | BOY-01 | 20 | 2 (Kalfa) |
| OP90 | Kur Firini (Polimerizasyon) | FRN-01 | 5 | 1 (Isci) |
| OP100 | Boyut / Kalite Kontrol | — | 15 | 3 (Usta) |
| OP110 | Montaj (Set Birlestirme) | MNT-01 | 10 | 2 (Kalfa) |
| OP120 | Son Muayene + Paketleme | — | 20 | 3 (Usta) |

**Dogrulama:**
- [ ] 13 operasyon adimi tanimlandi
- [ ] Makine atamalari dogru
- [ ] Kaynak icin ayri robot (OP50) ve manuel (OP55) operasyonlar var
- [ ] Boya sureci 2 adim: uygulama (OP80) + kur (OP90)

### 0.3 Genel Gider Yapilandirmasi
**Ekran:** Uretim > Maliyet Analizi (`/production/part-cost`)
**API:** `POST /partcost/overheads`

| Ad | Yuzde | Gecerlilik |
|----|-------|------------|
| Genel Imalat Giderleri | %18 | 2026-01-01 → — |
| Enerji (Plazma + Boya Firini Yuksek Tuketim) | %8 | 2026-01-01 → — |
| Amortisman | %7 | 2026-01-01 → — |
| Koruyucu Gaz Tuketimi (MIG/MAG Argon-CO2) | %5 | 2026-01-01 → — |
| Toz Boya Malzeme Tuketimi | %6 | 2026-01-01 → — |

**Dogrulama:**
- [ ] 5 genel gider kalemi tanimlandi (%44 toplam overhead)
- [ ] Boya ve gaz tuketimi ayri kalem olarak takip ediliyor

### 0.4 Kalibrasyon Ekipmanlari
**Ekran:** Kalite > Kalibrasyon (`/quality/calibration`)
**API:** `POST /calibration/equipment`

| Kod | Ekipman | Marka/Model | Dogruluk | Frekans | Son Kalibrasyon | Sonraki |
|-----|---------|-------------|----------|---------|-----------------|---------|
| KAL-001 | Dijital Kumpas 0-300mm | Mitutoyo 500-197-30 | 0.01mm | 6 Aylik | 2026-01-15 | 2026-07-15 |
| MIK-001 | Dis Mikrometre 0-25mm | Mitutoyo 103-137 | 0.001mm | Yillik | 2026-01-15 | 2027-01-15 |
| MET-001 | Celik Metre 5m | Stanley FatMax | ±1mm/m | Yillik | 2026-01-15 | 2027-01-15 |
| ACI-001 | Dijital Aci Olcer | Mitutoyo Pro 3600 | 0.01° | Yillik | 2026-02-01 | 2027-02-01 |
| BOY-001 | Boya Kalinlik Olcer (Kuru Film) | Elcometer 456 | ±%1-3 | 6 Aylik | 2026-02-01 | 2026-08-01 |
| YAP-001 | Yapisma Test Kiti (Cross-Cut) | Elcometer 107 | ISO 2409 | Yillik | 2026-01-15 | 2027-01-15 |
| AMP-001 | Kaynak Ampermetre | Fluke 376 FC | ±%1.5 | 6 Aylik | 2026-03-01 | 2026-09-01 |
| TORK-001 | Tork Anahtari 10-110 Nm | Stahlwille 730/40 | ±%4 | Yillik | 2026-01-15 | 2027-01-15 |

**Dogrulama:**
- [ ] 8 kalibrasyon ekipmani tanimlandi
- [ ] Boya kalinlik olcer ve yapisma test kiti dahil
- [ ] Kaynak ampermetre dahil
- [ ] Kalibrasyon tarihleri ve frekanslari girildi
- [ ] Dashboard'da uyumluluk % gorunuyor

---

## BOLUM 1: MUSTERI ve TEKLIF

### 1.1 Musteri Tanimi — ABC Lojistik
**Ekran:** Musteriler (`/customers`)
**API:** `POST /customer`

```
Firma Adi: ABC Lojistik ve Depoculuk A.S.
Yetkili: Serkan Demirel (Tesis Yonetimi Muduru)
Email: serkan.demirel@abclojistik.com.tr
Telefon: +90 212 555 3400
Adres: Tuzla Organize Sanayi Bolgesi, 2. Cadde No:15, 34959 Tuzla/Istanbul
Vergi No: 9876543210 | Vergi Dairesi: Tuzla
Kategori: A (Buyuk Musteri)
Doviz: TRY
Odeme Vadesi: 45 gun
```

**Musteri Notu:** EN 1090-2 EXC2 uyumlu celik konstruksiyon zorunlu, toz boya RAL renk secimi
musteri tarafindan belirlenir, montaj hizmeti dahil, 3 yil garanti

**Dogrulama:**
- [ ] Musteri karti olusturuldu
- [ ] Adres ve iletisim bilgileri girildi
- [ ] Kategori A olarak isaretlendi
- [ ] EN 1090-2 gereksinimleri not alanina yazildi

### 1.2 Musteri Tanimi — Yangin Kapisi Musterisi
**Ekran:** Musteriler (`/customers`)
**API:** `POST /customer`

```
Firma Adi: Mega Insaat Taahhut A.S.
Yetkili: Fatma Koc (Proje Satin Alma Sefi)
Email: fatma.koc@megainsaat.com.tr
Telefon: +90 312 444 7800
Adres: Ostim OSB, 100. Yil Blv. No:42, 06374 Yenimahalle/Ankara
Vergi No: 1122334455 | Vergi Dairesi: Ostim
Kategori: B (Orta Musteri)
Doviz: TRY
Odeme Vadesi: 30 gun
```

**Dogrulama:**
- [ ] Musteri karti olusturuldu
- [ ] Adres ve iletisim bilgileri girildi

### 1.3 Tedarikci Tanimlari
**Ekran:** Musteriler > Tedarikciler (`/customers?type=suppliers`)
**API:** `POST /customer` (type=supplier)

| Tedarikci | Urun Grubu | Yetkili | Odeme | Not |
|-----------|------------|---------|-------|-----|
| Erdemir Celik Servis Merkezi | S235JR profil, DKP sac | Murat Yildirim | 30 gun | 3.1 malzeme sertifikasi zorunlu |
| Akzo Nobel Turkiye | Toz boya (RAL renk katalogu) | Elif Arslan | 45 gun | Lot bazli renk uyumu garantisi |
| Bolte Baglantilar | M10 civata, somun, pul (DIN 933/934/125) | Hakan Ozturk | 15 gun | Sinif 8.8 sertifikali |

**Dogrulama:**
- [ ] 3 tedarikci tanimlandi (celik, boya, baglanti)
- [ ] Odeme vadeleri girildi
- [ ] Malzeme sertifikasi gereksinimleri not alanina yazildi

---

## BOLUM 2: URUN ve BOM TANIMI

### 2.1 Ana Urun Tanimi — Depo Raf Sistemi (Set)
**Ekran:** Urunler (`/products/form`)
**API:** `POST /product`

```
Urun Adi: Celik Depo Raf Sistemi — Agir Yuklu (2000 kg/kat)
Urun Kodu: YCK-RAF-001
Revizyon: Rev A
Tip: Mamul (Finished Good)
Birim: SET
Kalite Kontrol Gerekli: Evet
Seri Takip: Hayir (seri uretim — lot bazli)
Lot Takip: Evet
Not: 1 SET = 4 Dikme + 8 Kiris + 4 Panel + 1 Baglanti Seti
     EN 1090-2 EXC2 uyumlu (Kisitlama K5 — not alaninda)
     Yuk kapasitesi: 2000 kg/kat, 5 kat, toplam 10.000 kg
```

**Dogrulama:**
- [ ] Urun tanimlandi, birim SET olarak girildi
- [ ] Lot takip aktif
- [ ] EN 1090-2 EXC2 notu girildi

### 2.2 Alt Urun Tanimlari (BOM Bilesenleri)
**Ekran:** Urunler (`/products/form`)
**API:** `POST /product`

**Dikme Profili:**
```
Urun Adi: Raf Dikme Profili — 80x40x2mm, H=2400mm
Urun Kodu: YCK-DKM-001
Tip: Yari Mamul
Birim: Adet
Kalite Kontrol Gerekli: Evet
Agirlik: 5.86 kg/adet (hesap: 80+40+80+40=240mm cevre x 2mm et x 2400mm boy x 7.85 g/cm3)
```

**Kiris Profili:**
```
Urun Adi: Raf Kiris Profili — 40x20x1.5mm, L=1200mm (uc plakali)
Urun Kodu: YCK-KRS-001
Tip: Yari Mamul
Birim: Adet
Kalite Kontrol Gerekli: Evet
Agirlik: 1.68 kg/adet (profil 1.34 kg + uc plaka 2x0.17 kg)
```

**Panel:**
```
Urun Adi: Raf Paneli — DKP Sac 1mm, 1200x600mm (U bukumlu)
Urun Kodu: YCK-PNL-001
Tip: Yari Mamul
Birim: Adet
Kalite Kontrol Gerekli: Evet
Agirlik: 6.28 kg/adet (1200x600x1mm DKP + bukum paylari)
```

**Baglanti Seti:**
```
Urun Adi: Raf Baglanti Seti — Civata M10x30 DIN933 + Somun M10 DIN934 + Pul M10 DIN125
Urun Kodu: YCK-BAG-001
Tip: Satinalma (Ticari Mal)
Birim: SET (1 set = 32 civata + 32 somun + 64 pul — tek raf icin)
Sinif: 8.8 (civata), 8 (somun)
```

**Dogrulama:**
- [ ] 4 alt urun tanimlandi (dikme, kiris, panel, baglanti)
- [ ] Birimleri dogru (Adet, Adet, Adet, SET)
- [ ] Agirlik bilgileri girilebildi (not alanina)

### 2.3 BOM (Urun Agaci) Tanimi — 1 Set Raf
**Ekran:** Urunler > BOM (`/products/bom`)
**API:** `POST /product/bom`

**Ana BOM — YCK-RAF-001 (1 SET):**
| # | Alt Urun | Miktar | Birim | Aciklama |
|---|----------|--------|-------|----------|
| 1 | YCK-DKM-001 — Dikme Profili | 4 | Adet | 2 set dikme (on-arka) x 2 |
| 2 | YCK-KRS-001 — Kiris Profili | 8 | Adet | 4 kat x 2 kiris (on-arka) |
| 3 | YCK-PNL-001 — Panel | 4 | Adet | 4 kat x 1 panel |
| 4 | YCK-BAG-001 — Baglanti Seti | 1 | SET | 32 civata + 32 somun + 64 pul |

**Alt BOM — YCK-DKM-001 (Dikme — Hammadde):**
| # | Malzeme | Miktar | Birim | Aciklama |
|---|---------|--------|-------|----------|
| 1 | S235JR Profil 80x40x2mm (6m cubuk) | 0.4 | Adet | 2400mm/6000mm = 0.4 cubuk (fire dahil 0.42) |

**Alt BOM — YCK-KRS-001 (Kiris — Hammadde):**
| # | Malzeme | Miktar | Birim | Aciklama |
|---|---------|--------|-------|----------|
| 1 | S235JR Profil 40x20x1.5mm (6m cubuk) | 0.2 | Adet | 1200mm/6000mm = 0.2 cubuk |
| 2 | S235JR Levha 60x40x3mm (uc plaka) | 2 | Adet | Kaynak ile birlestirilir |

**Alt BOM — YCK-PNL-001 (Panel — Hammadde):**
| # | Malzeme | Miktar | Birim | Aciklama |
|---|---------|--------|-------|----------|
| 1 | DKP Sac 1mm (1500x3000 levha) | 0.16 | Adet | 1200x700mm acilim / 4.5m2 levha |

**Dogrulama:**
- [ ] Ana BOM 4 bilesenden olusuyor
- [ ] Alt BOM'lar hammaddeye kadar iniyor
- [ ] Fire payi hesaba katildi (dikme profilde %5)
- [ ] Toplam malzeme hesabi: 1000 set icin ~1680 adet 80x40 profil cubuk, ~1600 adet 40x20 profil cubuk, ~160 adet DKP sac levha

### 2.4 Hammadde Tanimlari
**Ekran:** Urunler (`/products/form`)
**API:** `POST /product`

| Kodu | Malzeme Adi | Birim | Stok Birimi | Aciklama |
|------|-------------|-------|-------------|----------|
| HMM-PRF-001 | S235JR Profil 80x40x2mm — 6m Cubuk | Adet | KG (K2 — tonaj takibi) | EN 10219, sicak hadde, 7.85 kg/m |
| HMM-PRF-002 | S235JR Profil 40x20x1.5mm — 6m Cubuk | Adet | KG | EN 10219, 2.15 kg/m |
| HMM-LVH-001 | S235JR Levha 60x40x3mm (Uc Plaka) | Adet | Adet | On kesilmis parca |
| HMM-SAC-001 | DKP Sac 1mm — 1500x3000mm Levha | Adet | KG | EN 10130, DC01, 35.3 kg/levha |
| HMM-BOY-001 | Toz Boya — RAL 5010 (Gentian Mavi) | KG | KG | Polyester, dis mekan, 60-80 mikron |
| HMM-BOY-002 | Toz Boya — RAL 7035 (Acik Gri) | KG | KG | Polyester, yangin kapisi icin |
| HMM-GAZ-001 | Argon + CO2 Karisim Gazi (%82 Ar / %18 CO2) | Tup | Tup | MIG/MAG kaynak, 50L tup |
| HMM-KAY-001 | MIG Kaynak Teli SG2 — 1.0mm | KG | KG | EN ISO 14341, 15 kg makara |

**Dogrulama:**
- [ ] 8 hammadde tanimlandi
- [ ] Profil ve sac icin KG cinsinden stok izleme notu girildi (K2)
- [ ] Boya renk kodlari (RAL) belirtildi
- [ ] Kaynak sarf malzemeleri dahil

---

## BOLUM 3: TEKLIF ve SIPARIS

### 3.1 Teklif Olusturma — Depo Raf Sistemi
**Ekran:** Teklifler (`/offers/form`)
**API:** `POST /offer`

```
Musteri: ABC Lojistik ve Depoculuk A.S.
Teklif No: TKL-2026-0042
Tarih: 2026-04-10
Gecerlilik: 30 gun
Doviz: TRY
```

**Teklif Kalemleri:**
| # | Urun | Miktar | Birim Fiyat | Toplam | Not |
|---|------|--------|-------------|--------|-----|
| 1 | Celik Depo Raf Sistemi (1 SET) | 1.000 | 8.500 TL | 8.500.000 TL | EN 1090-2 EXC2, RAL 5010 |
| 2 | Montaj Hizmeti (saha montaj) | 1.000 | 750 TL/set | 750.000 TL | Tuzla depo sahasi |
| 3 | Nakliye (Istanbul ici) | 25 | 12.000 TL/sefer | 300.000 TL | TIR ile, ~40 set/sefer |
|   | **Ara Toplam** | | | **9.550.000 TL** | |
|   | **KDV (%20)** | | | **1.910.000 TL** | |
|   | **Genel Toplam** | | | **11.460.000 TL** | |

**Dogrulama:**
- [ ] Teklif olusturuldu, 3 kalem girildi
- [ ] Birim fiyat x miktar toplami dogru
- [ ] KDV orani %20 olarak hesaplandi
- [ ] Teklif PDF ciktisi alinabildi
- [ ] Gecerlilik suresi 30 gun olarak gorunuyor

### 3.2 Teklif Onay ve Siparise Donusum
**Ekran:** Teklifler (`/offers`)
**API:** `PUT /offer/{id}` → `POST /order`

1. Teklif durumunu ONAYLANDI olarak guncelle
2. "Siparise Donustur" butonuna tikla
3. Siparis otomatik olusur

```
Siparis No: SIP-2026-0038
Musteri: ABC Lojistik
Termin: 2026-06-30 (yakl. 80 gun)
Teslimat: Kademeli — Haftalik 100 set (10 hafta)
Odeme: 45 gun vadeli
```

**Dogrulama:**
- [ ] Teklif → Siparis donusumu basarili
- [ ] Siparis kalemleri tekliften dogru aktarildi
- [ ] Termin tarihi ve teslimat notu girildi
- [ ] Siparis listesinde gorunuyor

### 3.3 MRP Calistirma — BOM Patlatma ve Net Ihtiyac
**Ekran:** Uretim > MRP (`/production/mrp`)
**API:** `POST /mrp/run`

**Beklenen BOM Patlatma Sonucu (1000 set):**
| Malzeme | Brut Ihtiyac | Mevcut Stok | Net Ihtiyac | Tedarik Tipi |
|---------|-------------|-------------|-------------|--------------|
| YCK-DKM-001 Dikme | 4.000 adet | 0 | 4.000 adet | Uretim |
| YCK-KRS-001 Kiris | 8.000 adet | 0 | 8.000 adet | Uretim |
| YCK-PNL-001 Panel | 4.000 adet | 0 | 4.000 adet | Uretim |
| YCK-BAG-001 Baglanti Seti | 1.000 set | 50 | 950 set | Satin Alma |
| HMM-PRF-001 Profil 80x40 | 1.680 cubuk (~47 ton) | 100 cubuk | 1.580 cubuk | Satin Alma |
| HMM-PRF-002 Profil 40x20 | 1.600 cubuk (~20.6 ton) | 80 cubuk | 1.520 cubuk | Satin Alma |
| HMM-LVH-001 Uc Plaka | 16.000 adet | 500 | 15.500 adet | Satin Alma |
| HMM-SAC-001 DKP Sac | 640 levha (~22.6 ton) | 30 levha | 610 levha | Satin Alma |
| HMM-BOY-001 Toz Boya Mavi | ~2.000 kg | 100 kg | 1.900 kg | Satin Alma |
| HMM-GAZ-001 Karisim Gazi | 50 tup | 5 tup | 45 tup | Satin Alma |
| HMM-KAY-001 Kaynak Teli | 500 kg | 30 kg | 470 kg | Satin Alma |

**Dogrulama:**
- [ ] MRP calistirildi, BOM patlatma sonuclari listelendi
- [ ] Mevcut stok dusuldu (net ihtiyac hesaplandi)
- [ ] Satin alma onerileri olusturuldu
- [ ] Uretim onerileri (yari mamul) olusturuldu
- [ ] Toplam celik ihtiyaci ~90 ton (profil + sac) — K2 not olarak

---

## BOLUM 4: SATIN ALMA

### 4.1 Satin Alma Siparisleri Olusturma
**Ekran:** Satin Alma > Siparisler (`/purchasing/orders`)
**API:** `POST /purchaseorder`

**Siparis 1 — Celik Tedarikci (Erdemir Servis Merkezi):**
```
Tedarikci: Erdemir Celik Servis Merkezi
SA Siparis No: SA-2026-0091
Termin: 2026-04-25 (15 gun)
```
| # | Malzeme | Miktar | Birim Fiyat | Toplam | Not |
|---|---------|--------|-------------|--------|-----|
| 1 | S235JR Profil 80x40x2mm (6m) | 1.580 cubuk | 290 TL | 458.200 TL | EN 10219, 3.1 sertifika |
| 2 | S235JR Profil 40x20x1.5mm (6m) | 1.520 cubuk | 135 TL | 205.200 TL | EN 10219, 3.1 sertifika |
| 3 | S235JR Levha 60x40x3mm (uc plaka) | 15.500 adet | 3.50 TL | 54.250 TL | On kesilmis |
| 4 | DKP Sac 1mm (1500x3000) | 610 levha | 520 TL | 317.200 TL | EN 10130 DC01, 3.1 sertifika |
|   | **Toplam** | | | **1.034.850 TL** | |

**Siparis 2 — Boya Tedarikci (Akzo Nobel):**
```
Tedarikci: Akzo Nobel Turkiye
SA Siparis No: SA-2026-0092
Termin: 2026-04-28 (18 gun)
```
| # | Malzeme | Miktar | Birim Fiyat | Toplam |
|---|---------|--------|-------------|--------|
| 1 | Toz Boya RAL 5010 Mavi | 1.900 kg | 85 TL/kg | 161.500 TL |
| 2 | Toz Boya RAL 7035 Gri (yangin kapisi) | 200 kg | 92 TL/kg | 18.400 TL |
|   | **Toplam** | | | **179.900 TL** |

**Siparis 3 — Baglanti Tedarikci (Bolte):**
```
Tedarikci: Bolte Baglantilar
SA Siparis No: SA-2026-0093
Termin: 2026-04-20 (10 gun)
```
| # | Malzeme | Miktar | Birim Fiyat | Toplam |
|---|---------|--------|-------------|--------|
| 1 | Baglanti Seti (civata+somun+pul) | 950 set | 28 TL/set | 26.600 TL |
|   | **Toplam** | | | **26.600 TL** |

**Dogrulama:**
- [ ] 3 satin alma siparisi olusturuldu
- [ ] Toplam satin alma tutari: ~1.241.350 TL
- [ ] Termin tarihleri uretim baslangicina uygun (en gec 2026-04-28)
- [ ] Malzeme sertifikasi gereksinimleri siparis notlarinda

### 4.2 Fiyat Karsilastirma Notu
**Satin Alma Notu (Not Alanina Girilir):**
```
Celik Fiyat Karsilastirma (2026-04 Donemi):
- Erdemir Servis: 80x40 profil 290 TL/cubuk — en uygun, 3.1 sertifika dahil
- Colakoglu Celik: 80x40 profil 305 TL/cubuk — 2 hafta termin
- Kardemir Servis: 80x40 profil 310 TL/cubuk — stok problemi
Karar: Erdemir Servis Merkezi secildi (fiyat + termin + sertifika)
```

**Dogrulama:**
- [ ] Fiyat karsilastirma notu satin alma siparisine eklendi

---

## BOLUM 5: MAL KABUL ve GIRIS KALITE

### 5.1 Mal Kabul — Celik Profil Teslimat 1
**Ekran:** Depo > Mal Kabul
**API:** `POST /receiving`

```
SA Siparis: SA-2026-0091 (Erdemir)
Irsaliye No: ERD-2026-4521
Tarih: 2026-04-25
Teslim Alan: Depo Sorumlusu — Kemal Arslan
```

| Malzeme | Siparis | Gelen | Birim | Tartim (Kantar) | Not |
|---------|---------|-------|-------|-----------------|-----|
| S235JR 80x40x2mm Profil | 1.580 | 800 | cubuk | 22.560 kg | Kısmi teslimat 1/2 |
| S235JR 40x20x1.5mm Profil | 1.520 | 760 | cubuk | 9.804 kg | Kısmi teslimat 1/2 |
| S235JR Uc Plaka 60x40x3mm | 15.500 | 8.000 | adet | 452 kg | |
| DKP Sac 1mm 1500x3000 | 610 | 310 | levha | 10.943 kg | |

**Belgeler Kontrol:**
- [ ] 3.1 Malzeme Sertifikasi (EN 10204 Tip 3.1) — her erime numarasi icin ayri
- [ ] Celik kalite belgesi: S235JR, kimyasal analiz (C, Mn, Si, P, S)
- [ ] Mekanik test sonuclari: cekme dayanimi (360-510 MPa), akma (min 235 MPa)
- [ ] Irsaliye ile fiziksel sayim uyumu

**Dogrulama:**
- [ ] Mal kabul karti olusturuldu
- [ ] Gelen miktar girisi yapildi (kismi teslimat)
- [ ] Kantar tartim degerleri not olarak girildi (K2 — tonaj takibi)
- [ ] 3.1 sertifika dosya eki olarak yuklendi
- [ ] Kalan bakiye (800 cubuk + 760 cubuk) gorunuyor

### 5.2 Giris Kalite Kontrol — Profil ve Sac
**Ekran:** Kalite > Giris Muayene
**API:** `POST /qualityinspection`

**Ornekleme:** Her lot'tan %5 numune (AQL 2.5, Seviye II)

**Profil 80x40x2mm Kontrol:**
| # | Kontrol Parametresi | Spesifikasyon | Olcum Sonucu | Alet | Karar |
|---|---------------------|---------------|-------------- |------|-------|
| 1 | Dis boyut (80mm kenari) | 80 ±0.5mm | 80.12mm | KAL-001 Kumpas | GECTI |
| 2 | Dis boyut (40mm kenari) | 40 ±0.5mm | 39.95mm | KAL-001 Kumpas | GECTI |
| 3 | Et kalinligi | 2.0 ±0.1mm | 2.02mm | MIK-001 Mikrometre | GECTI |
| 4 | Boy (6m cubuk) | 6000 ±5mm | 6002mm | MET-001 Celik Metre | GECTI |
| 5 | Yuzey kalitesi | Pas, ezik, cizik yok | Temiz yuzey | Gorsel | GECTI |
| 6 | Durusluk (egilme) | Max 2mm/m | 1.5mm/m | MET-001 + sehpa | GECTI |

**DKP Sac 1mm Kontrol:**
| # | Kontrol Parametresi | Spesifikasyon | Olcum Sonucu | Alet | Karar |
|---|---------------------|---------------|-------------- |------|-------|
| 1 | Kalinlik | 1.0 ±0.07mm | 1.02mm | MIK-001 | GECTI |
| 2 | Boyut (1500x3000) | ±2mm | 1501x3001mm | MET-001 | GECTI |
| 3 | Yuzey kalitesi | Pas, cizik, leke yok | Temiz, yagli | GECTI (normal yag) |
| 4 | Duzluk | Max 5mm/m | 3mm/m | MET-001 + sehpa | GECTI |

**Genel Sonuc:** KABUL — Uretim icin serbest

**Dogrulama:**
- [ ] Giris muayene karti olusturuldu
- [ ] Ornekleme yapildi (%5 numune)
- [ ] Tum olcum sonuclari girildi
- [ ] Sonuc KABUL olarak isaretlendi
- [ ] Malzeme "Uretim icin Serbest" durumuna gecti

---

## BOLUM 6: URETIM — IS EMRI #1 (DIKME URETIMI)

### 6.1 Is Emri Olusturma — Dikme Profili
**Ekran:** Uretim > Is Emirleri (`/production/work-orders`)
**API:** `POST /workorder`

```
Is Emri No: IE-2026-0145
Urun: YCK-DKM-001 — Raf Dikme Profili
Miktar: 400 adet (ilk hafta — 100 set x 4 dikme)
Termin: 2026-05-05
Oncelik: Yuksek
Siparis Ref: SIP-2026-0038
```

**Operasyon Rotasi:**
| Sira | Operasyon | Makine | Setup | Parca Basi Sure | Toplam (400 adet) |
|------|-----------|--------|-------|-----------------|-------------------|
| OP10 | Profil Kesim (boy kesim 2400mm) | TST-01 Bant Testere | 15 dk | 1.5 dk | ~625 dk (10.4 saat) |
| OP20 | CNC Plazma Delik (4 delik/dikme) | PLZ-01 | 20 dk | 2.0 dk | ~820 dk (13.7 saat) |
| OP30 | Capak Alma | Manuel | 5 dk | 1.0 dk | ~405 dk (6.8 saat) |
| OP70 | Kumlama (Sa 2.5) | KUM-01 | 15 dk | 0.8 dk | ~335 dk (5.6 saat) |
| OP80 | Toz Boya (RAL 5010, 60-80 mikron) | BOY-01 | 20 dk | 1.2 dk | ~500 dk (8.3 saat) |
| OP90 | Kur Firini (200°C, 20 dk) | FRN-01 | 5 dk | Batch (50 adet/batch) | ~165 dk (2.8 saat) |
| OP100 | Boyut / Kalite Kontrol | — | 10 dk | 0.5 dk | ~210 dk (3.5 saat) |

**Dogrulama:**
- [ ] Is emri olusturuldu, 7 operasyon atandi
- [ ] Makine atamalari dogru
- [ ] Tahmini toplam sure: ~51 saat (6.4 is gunu)
- [ ] Is emri durumu: PLANLANDI

### 6.2 ShopFloor — Dikme Kesim (OP10)
**Ekran:** Uretim > ShopFloor (`/production/shop-floor`)
**API:** `POST /workorder/{id}/operations/{opId}/start` → `/complete`

**Operator:** Recep Korkmaz (Testere Operatoru)
**Rol:** Operator

```
Is Emri: IE-2026-0145
Operasyon: OP10 — Profil Kesim
Makine: TST-01 Bant Testere
Baslangic: 2026-04-28 08:00
Bitis: 2026-04-28 18:30
Uretilen: 400 adet
```

**Kesim Detaylari:**
- 6m cubuk → 2 x 2400mm + 1200mm fire parça (baska is emrinde kullanilabilir)
- 200 cubuk kesildi → 400 dikme + 200 adet 1200mm artik parca
- Bant testere bicak degisimi: 1 kez (150 kesim sonrasi)

**Dogrulama:**
- [ ] ShopFloor'da operasyon baslatildi
- [ ] Operator adi ve makine secildi
- [ ] Uretilen miktar 400 adet olarak girildi
- [ ] Operasyon TAMAMLANDI olarak isaretlendi

### 6.3 ShopFloor — CNC Plazma Delik (OP20)
**Ekran:** Uretim > ShopFloor
**API:** `POST /workorder/{id}/operations/{opId}/start` → `/complete`

**Operator:** Ismail Sahin (CNC Plazma Operatoru)

```
Operasyon: OP20 — CNC Plazma Delik
Makine: PLZ-01
Baslangic: 2026-04-29 08:00
Bitis: 2026-04-29 22:00
Uretilen: 398 adet
Hurda: 2 adet (plazma nozul asinmasi — delik olcusu tolerans disi)
```

**Dogrulama:**
- [ ] Plazma delik operasyonu tamamlandi
- [ ] 2 adet hurda kaydi yapildi (Bolum 8'de ayrintili)
- [ ] Uretilen miktar 398 adet

### 6.4 ShopFloor — Capak Alma (OP30), Kumlama (OP70), Boya (OP80-90)
**Ekran:** Uretim > ShopFloor

**OP30 Capak Alma:**
```
Operator: Emre Yildiz | Manuel | 398 adet | 1 gun
```

**OP70 Kumlama (Sa 2.5):**
```
Operator: Huseyin Kara | KUM-01 | 398 adet | 1 gun
Not: Sa 2.5 seviyesi gorsel olarak dogrulandi (ISO 8501-1 referans fotograflari)
```

**OP80 Toz Boya + OP90 Kur:**
```
Operator: Murat Demir | BOY-01 + FRN-01
Boya: RAL 5010 Gentian Mavi, hedef 60-80 mikron
Kur: 200°C, 20 dakika
Uretilen: 396 adet (2 adet boya hatasi — akma, turuncu kabugu)
Batch: 8 batch x 50 adet (son batch 48 adet)
```

**Dogrulama:**
- [ ] OP30, OP70, OP80, OP90 tamamlandi
- [ ] Kumlama seviyesi notu girildi
- [ ] Boya parametreleri (RAL, mikron, kur sicakligi) notu girildi
- [ ] 2 adet boya hatasi hurda kaydi
- [ ] Kalan iyi parca: 396 adet

---

## BOLUM 7: URETIM — IS EMRI #2 (KIRIS URETIMI)

### 7.1 Is Emri Olusturma — Kiris
**Ekran:** Uretim > Is Emirleri
**API:** `POST /workorder`

```
Is Emri No: IE-2026-0146
Urun: YCK-KRS-001 — Raf Kiris Profili
Miktar: 800 adet (ilk hafta — 100 set x 8 kiris)
Termin: 2026-05-07
```

**Operasyon Rotasi:**
| Sira | Operasyon | Makine | Parca Basi Sure |
|------|-----------|--------|-----------------|
| OP10 | Profil Kesim (1200mm) | TST-01 | 1.2 dk |
| OP40 | Abkant Bukme (90° — uc kivirma) | ABK-01 | 1.5 dk |
| OP55 | Kaynak — Uc Plaka TIG | KAY-01 | 3.0 dk |
| OP60 | Kaynak Gorsel Kontrol | — | 0.5 dk |
| OP70 | Kumlama | KUM-01 | 0.6 dk |
| OP80 | Toz Boya + Kur | BOY-01 + FRN-01 | 1.0 dk |

### 7.2 ShopFloor — Kiris Uretimi
**Ekran:** Uretim > ShopFloor

**OP10 Kesim:**
```
Operator: Recep Korkmaz | TST-01 | 800 adet | 2026-05-01
6m cubuk → 5 x 1200mm (sifir fire!) — verimli kesim plani
160 cubuk kullanildi
```

**OP40 Abkant Bukme:**
```
Operator: Selim Ozdemir (Abkant Ustasi) | ABK-01
Bukme: 90° ± 0.5° (uc kivirma — profil uclarinda)
Kalip: V16 alt kalip + 88° ust zımba
800 adet bukuldu | 2026-05-02
Not: Her 50 parcada bir aci kontrolu — ACI-001 dijital aci olcer
```

**OP55 Kaynak — Uc Plaka (TIG):**
```
Operator: Ahmet Celik (Kaynakci) | KAY-01 TIG
Her kirise 2 adet uc plaka TIG ile kaynak edilir
Kaynak parametreleri: 110A, 14V, Argon 12 L/dk
800 adet x 2 plaka = 1600 kaynak noktasi | 2026-05-03 — 2026-05-04
Hurda: 3 adet (kaynak porozitesi — gorsel kontrolde tespit)
```

**OP60 Kaynak Gorsel Kontrol (VT):**
```
Kontrolcu: Kalite Sorumlusu — Zeynep Arslan
%100 gorsel kontrol: catlak, porozite, alt kesme, sicrama
3 adet RED (kaynak hatasi) → OP55'e iade
797 adet GECTI
```

**OP70-80-90 Kumlama + Boya + Kur:**
```
794 adet (3 adet daha boya hatasi) — toplam iyi parca: 794 adet
```

**Dogrulama:**
- [ ] Kiris is emri 6 operasyonla tamamlandi
- [ ] Abkant bukme acisi kontrolu notu girildi
- [ ] TIG kaynak parametreleri (amper, voltaj, gaz akisi) notu girildi
- [ ] Kaynak gorsel kontrol %100 yapildi
- [ ] Hurda: 3 kaynak + 3 boya = 6 adet toplam

---

## BOLUM 8: URETIM — IS EMRI #3 (PANEL URETIMI)

### 8.1 Is Emri Olusturma — Panel
**Ekran:** Uretim > Is Emirleri
**API:** `POST /workorder`

```
Is Emri No: IE-2026-0147
Urun: YCK-PNL-001 — Raf Paneli
Miktar: 400 adet (100 set x 4 panel)
Termin: 2026-05-07
```

**Operasyon Rotasi:**
| Sira | Operasyon | Makine | Parca Basi Sure |
|------|-----------|--------|-----------------|
| OP10 | Sac Kesim (1200x700mm acilim) | GYT-01 Giyotin | 0.8 dk |
| OP40 | Abkant Bukme (U profil — 2 bukum) | ABK-02 | 2.0 dk |
| OP70 | Kumlama | KUM-01 | 1.0 dk |
| OP80 | Toz Boya + Kur | BOY-01 + FRN-01 | 1.5 dk |

### 8.2 ShopFloor — Panel Uretimi
**Ekran:** Uretim > ShopFloor

**OP10 Giyotin Kesim:**
```
Operator: Recep Korkmaz | GYT-01
1500x3000mm levha → 2 x (1200x700mm) acilim + fire parca
200 levha kesildi → 400 panel acilimi + fire saclar
Not: Fire sac parcalari hurda kutusuna (Bolum 8.3'te fire kaydi)
```

**OP40 Abkant Bukme (U Profil):**
```
Operator: Selim Ozdemir | ABK-02
2 bukum (90° + 90°) → U profil seklinde
Acilim: 1200x700mm → Bukum sonrasi: 1200x600x50mm (U)
398 adet (2 adet bukum catlagi — sac kalitesi sorunu)
```

**OP70-80 Kumlama + Boya:**
```
396 adet tamamlandi (2 adet daha boya hatasi)
```

**Dogrulama:**
- [ ] Panel is emri 4 operasyonla tamamlandi
- [ ] Giyotin kesim plani notu girildi
- [ ] U profil bukum parametreleri kaydedildi
- [ ] Hurda: 2 bukum + 2 boya = 4 adet

---

## BOLUM 9: FIRE / HURDA KAYIT ve TAKIP

### 9.1 Fire Kayitlari (Tum Is Emirleri)
**Ekran:** Uretim > Fire/Hurda Kayit
**API:** `POST /scrap`

| Is Emri | Operasyon | Miktar | Sebep | Fire Tipi | Agirlik (tahmini) |
|---------|-----------|--------|-------|-----------|-------------------|
| IE-2026-0145 (Dikme) | OP20 Plazma Delik | 2 adet | Nozul asinmasi — delik tolerans disi | Hurda (donusum) | 11.7 kg |
| IE-2026-0145 (Dikme) | OP80 Toz Boya | 2 adet | Boya akma, turuncu kabugu | Yeniden isleme | 11.7 kg |
| IE-2026-0146 (Kiris) | OP55 TIG Kaynak | 3 adet | Porozite | Hurda (donusum) | 5.0 kg |
| IE-2026-0146 (Kiris) | OP80 Toz Boya | 3 adet | Boya hatasi | Yeniden isleme | 5.0 kg |
| IE-2026-0147 (Panel) | OP40 Abkant Bukme | 2 adet | Bukum catlagi | Hurda (donusum) | 12.6 kg |
| IE-2026-0147 (Panel) | OP80 Toz Boya | 2 adet | Boya hatasi | Yeniden isleme | 12.6 kg |

**Kesim Firesi (Profil):**
```
Dikme kesim: 200 cubuk x 1200mm artik = 240m artik profil (~1.13 ton)
  → Artik profiller 1200mm → Kiris kesimine yonlendirilebilir!
Panel kesim: 200 levha x fire parca (300x1500mm) = 90m2 fire sac (~707 kg)
  → Hurda saclar preste sikistirilip hurda satisina
```

**Fire Orani Hesabi:**
| Parca | Hedef Fire (%) | Gerceklesen Fire (%) | Durum |
|-------|---------------|---------------------|-------|
| Dikme | <%3 | %1.0 (4/400) | BASARILI |
| Kiris | <%3 | %0.75 (6/800) | BASARILI |
| Panel | <%3 | %1.0 (4/400) | BASARILI |
| **Kesim Firesi (malzeme)** | **<%5** | **~%4.2** | **BASARILI** |

**Dogrulama:**
- [ ] Fire/hurda kayitlari is emri bazinda girildi
- [ ] Fire sebepleri (nozul asinmasi, porozite, bukum catlagi, boya hatasi) belirtildi
- [ ] Fire tipi (hurda donusum / yeniden isleme) ayrimi yapildi
- [ ] Kesim firesi %5'in altinda — hedef karsilandi
- [ ] Boya hatali parcalar yeniden isleme (soyma + tekrar boya) olarak isaretlendi
- [ ] Hurda agirlik notu girildi (K2 — tonaj)

---

## BOLUM 10: ARA KALITE KONTROL

### 10.1 Bukme Acisi Kontrolu
**Ekran:** Kalite > Muayene
**API:** `POST /qualityinspection`

**Kiris Bukme Kontrolu (OP40 sonrasi):**
| # | Parametre | Spesifikasyon | Olcum | Alet | Sonuc |
|---|-----------|---------------|-------|------|-------|
| 1 | Bukme acisi | 90° ± 0.5° | 89.8° | ACI-001 | GECTI |
| 2 | Ic radius | R=3mm (kalip) | R=3.1mm | KAL-001 | GECTI |
| 3 | Bukme hattinda catlak | Yok | Yok | Gorsel 10x | GECTI |
| 4 | Geri yaylanma (springback) | Hesaba katildi | 89.8° (0.2° geri yayl.) | ACI-001 | GECTI |

**Panel Bukme Kontrolu (OP40 sonrasi):**
| # | Parametre | Spesifikasyon | Olcum | Alet | Sonuc |
|---|-----------|---------------|-------|------|-------|
| 1 | U profil ic genislik | 600 ± 1mm | 600.3mm | KAL-001 | GECTI |
| 2 | Bukme acisi (her iki taraf) | 90° ± 1° | 90.2° / 89.7° | ACI-001 | GECTI |
| 3 | Catlak | Yok | Yok | Gorsel | GECTI |

### 10.2 Kaynak Gorsel Kontrol (VT — EN 970)
**Ekran:** Kalite > Muayene

**Kiris Uc Plaka Kaynak Kontrolu (OP55/OP60 sonrasi):**
| # | Parametre | Spesifikasyon | Olcum | Sonuc |
|---|-----------|---------------|-------|-------|
| 1 | Dikis surekliligi | Tam cevre kaynak | Tam | GECTI |
| 2 | Dikis genisligi | 4-6mm | 5.2mm | GECTI |
| 3 | Alt kesme (undercut) | Max 0.5mm (EN 1090-2 EXC2) | 0.2mm | GECTI |
| 4 | Gozeneklilik | EN ISO 5817 Kalite Seviyesi C | Yok | GECTI |
| 5 | Catlak | Kabul edilemez | Yok | GECTI |
| 6 | Sicrama (spatter) | Minimum | Az (temizlendi) | GECTI |

### 10.3 Boya Kalinligi Kontrolu
**Ekran:** Kalite > Muayene

**Toz Boya Kalinlik Kontrolu (OP80/OP90 sonrasi):**
| # | Olcum Noktasi | Hedef | Olcum | Alet | Sonuc |
|---|---------------|-------|-------|------|-------|
| 1 | Dikme — duz yuzey | 60-80 μm | 68 μm | BOY-001 | GECTI |
| 2 | Dikme — kose | 60-80 μm | 55 μm | BOY-001 | SINIRDA (not) |
| 3 | Kiris — duz yuzey | 60-80 μm | 72 μm | BOY-001 | GECTI |
| 4 | Panel — ic yuzey | 60-80 μm | 64 μm | BOY-001 | GECTI |
| 5 | Panel — dis yuzey | 60-80 μm | 71 μm | BOY-001 | GECTI |

**Not:** Kose kalinligi 55 μm — alt sinira yakin. Boya tabancasi kose ayari gozden gecirilecek.

**Dogrulama:**
- [ ] Bukme, kaynak ve boya kalite kontrolleri girildi
- [ ] Olcum sonuclari spesifikasyon ile karsilastirildi
- [ ] Sinirda degerler icin not girildi
- [ ] Tum ara kontroller GECTI

---

## BOLUM 11: SON MUAYENE (FINAL INSPECTION)

### 11.1 Boyut Kontrolu — Tamamlanmis Parcalar
**Ekran:** Kalite > Son Muayene (`/quality/final-inspection`)
**API:** `POST /finalinspection`

**Dikme Son Boyut:**
| # | Parametre | Spesifikasyon | Olcum | Alet | Sonuc |
|---|-----------|---------------|-------|------|-------|
| 1 | Toplam boy | 2400 ± 2mm | 2401mm | MET-001 | GECTI |
| 2 | Delik capi (montaj delikleri) | Ø12 ± 0.3mm | Ø12.1mm | KAL-001 | GECTI |
| 3 | Delik step araligi | 75mm ± 0.5mm (her katta) | 74.8mm | KAL-001 | GECTI |
| 4 | Profil dikdortgenlik | Kosegen farki max 1mm | 0.6mm | KAL-001 | GECTI |

### 11.2 Boya Yapistirma Testi (Cross-Cut — ISO 2409)
**Ekran:** Kalite > Son Muayene

```
Test Metodu: ISO 2409 Cross-Cut (capraz kesim)
Alet: YAP-001 Yapisma Test Kiti
Ornekleme: Her lot'tan 5 adet numune

Sonuc: GT0 (en iyi) — Kesim hattinda hicbir kopma yok
Kabul Kriteri: GT0 veya GT1 (EN 1090-2 icin GT0 hedeflenir)
Karar: GECTI
```

**Not (K7):** Cross-cut test sonucu muayene formunda not alanina "ISO 2409, GT0, tum numuneler" olarak girildi.
Fotoğraf dosya eki olarak yuklendi.

### 11.3 Montaj Uyumu Testi
**Ekran:** Kalite > Son Muayene

```
Test: 1 set montaj denemesi (4 dikme + 8 kiris + 4 panel + baglanti seti)
Sonuc:
  - Dikme/kiris baglanti: Civata delikleri hizali, M10 civata rahat giriyor
  - Panel oturma: U profil kirislere duzgun oturuyor
  - Set stabilitesi: 2000 kg test yuku ile sehim max 3mm (hedef <5mm)
  - Montaj suresi: 1 set = 2 kisi x 45 dk (hedef 60 dk — basarili)
Karar: GECTI
```

**Dogrulama:**
- [ ] Son muayene raporu olusturuldu
- [ ] Boyut, boya, yapisma ve montaj uyumu kontrolleri tamamlandi
- [ ] Tum testler GECTI
- [ ] Muayene raporu PDF olarak cikti alindi
- [ ] "Sevkiyata Hazir" durumuna gecti

---

## BOLUM 12: YANGIN KAPISI SENARYOSU (CE Belgeli — EI60)

### 12.1 Yangin Kapisi Urun Tanimi
**Ekran:** Urunler (`/products/form`)
**API:** `POST /product`

```
Urun Adi: Celik Yangin Kapisi — EI60, Tek Kanat, 900x2100mm
Urun Kodu: YCK-YK60-001
Revizyon: Rev B
Tip: Mamul (Finished Good)
Birim: Adet
Kalite Kontrol Gerekli: Evet
Seri Takip: Evet (CE zorunlu — her kapi seri numarali)
Lot Takip: Evet
Not: CE belgeli, EN 1634-1 yangin dayanim testi, EI60 (60 dakika)
     Yangin sertifika no: NB-xxxx-CPR-yyyy
     EN 1090-2 EXC2, EN 1154 kapi kapaticisi, EN 1125 panik bar
```

### 12.2 Yangin Kapisi BOM
**API:** `POST /product/bom`

| # | Bilesen | Miktar | Birim | Aciklama |
|---|---------|--------|-------|----------|
| 1 | Celik Sac 1.5mm (kapi paneli) | 2 | adet (900x2100 acilim) | DKP, EN 10130 |
| 2 | Celik Sac 0.8mm (ic dolgu sacı) | 1 | adet | |
| 3 | Tas Yunu Dolgu (50mm, 120 kg/m3) | 1.89 | m2 | Yangin yalitim — A1 sinifi |
| 4 | Celik Kasa Profili (1.5mm) | 1 | set | 2 dikme + 1 ust kasa |
| 5 | Mentese (EN 1935) | 3 | adet | CE uyumlu, yangin sinifli |
| 6 | Kilit + Silindir (EN 12209) | 1 | set | Yangin sinifli |
| 7 | Kapi Kapaticisi (EN 1154) | 1 | adet | Sinif 3-5, yangin sinifli |
| 8 | Fitil — Intumescent (kabarici) | 5 | metre | Yangin durumunda kabarir, duman/alev keser |
| 9 | Toz Boya RAL 7035 (Gri) | 0.3 | kg | |
| 10 | Etiket + CE Plakasi | 1 | adet | Seri no, NB no, EI sinifi yazili |

### 12.3 Yangin Kapisi Siparis ve Is Emri
**Ekran:** Siparisler → Is Emirleri

```
Musteri: Mega Insaat Taahhut A.S.
Siparis: SIP-2026-0039 — 50 adet Yangin Kapisi EI60
Termin: 2026-06-15
Is Emri: IE-2026-0148
```

**Operasyon Rotasi (Yangin Kapisi):**
| Sira | Operasyon | Makine | Not |
|------|-----------|--------|-----|
| OP10 | Sac Kesim (panel + kasa) | GYT-01 / PLZ-01 | |
| OP40 | Abkant Bukme (kasa profili) | ABK-01 | |
| OP55 | Kaynak (kasa montaj + mentese kaynak) | KAY-02 MIG | EN 1090-2 EXC2 |
| OP60 | Kaynak Gorsel Kontrol | — | %100 VT |
| OP-YK1 | Dolgu Montaj (tas yunu + ic sac) | Manuel | Yangin yalitim malzemesi |
| OP-YK2 | Fitil Yapistirma (intumescent) | Manuel | Kanal icine oturma kontrolu |
| OP70 | Kumlama | KUM-01 | |
| OP80 | Toz Boya RAL 7035 | BOY-01 | |
| OP90 | Kur | FRN-01 | Dikkat: 180°C max (tas yunu erimez ama fitil etkilenebilir) |
| OP-YK3 | Aksesuar Montaj (kilit, mentese, kapatici) | Manuel | Tork kontrolu — TORK-001 |
| OP-YK4 | CE Etiketi + Seri No Yazdirma | Manuel | Her kapida benzersiz seri no |
| OP120 | Son Muayene (yangin kapisi ozel) | — | Asagida ayrintili |

### 12.4 Yangin Kapisi — Ozel Kalite Kontrol
**Ekran:** Kalite > Son Muayene

| # | Kontrol | Spesifikasyon | Metod | Kritik |
|---|---------|---------------|-------|--------|
| 1 | Kapi boyutlari | 900x2100 ±2mm | Olcum | EVET |
| 2 | Kasa-kapi aralik | 3 ±1mm (esit cevre) | Olcum | EVET |
| 3 | Tas yunu dolgu | Tam dolgu, bosluk yok | Gorsel (montaj ozel) | EVET |
| 4 | Intumescent fitil | Kanal icinde tam oturma, kopma yok | Gorsel | EVET |
| 5 | Mentese hizasi | Duzgun kapanis, sizma yok | Fonksiyon | EVET |
| 6 | Kilit fonksiyon | Acma-kapama 10 kez test | Fonksiyon | EVET |
| 7 | Kapatici fonksiyon (EN 1154) | Kapanis hizi, gecikme ayari | Fonksiyon | EVET |
| 8 | Boya kalinligi | 60-80 μm | BOY-001 | Hayir |
| 9 | CE etiketi | Seri no, NB no, EI60 sinifi, uretici bilgisi | Gorsel | EVET |
| 10 | Genel gorunum | Cizik, ezik, boya hatasi yok | Gorsel | Hayir |

### 12.5 CE Uygunluk Beyani ve Sertifika
**Ekran:** Kalite > CoC (Certificate of Conformity)
**API:** `POST /coc`

```
CoC No: COC-YCK-2026-0015
Urun: Celik Yangin Kapisi EI60
Standart: EN 1634-1, EN 13501-2, EN 1090-2
CE Isaret: Evet
Notified Body: NB-xxxx
Performans Beyani (DoP): DoP-YCK-YK60-001 Rev B

Not (K8): CE Uygunluk Beyani (Declaration of Conformity) PDF olarak dosya ekine yuklendi.
```

**Dogrulama:**
- [ ] Yangin kapisi urunu seri takipli olarak tanimlandi
- [ ] BOM 10 bilesenden olusuyor (yangin yalitim malzemeleri dahil)
- [ ] Is emri ozel operasyonlar iceriyor (dolgu, fitil, CE etiketi)
- [ ] Kalite kontrol daha siki (10 kontrol noktasi, cogunlugu KRITIK)
- [ ] CE uygunluk beyani PDF olarak yuklendi (K8)
- [ ] Seri numarasi her kapiya atandi
- [ ] CoC olusturuldu

---

## BOLUM 13: DEPO ve STOK YONETIMI

### 13.1 Uretim Cikis — Depo Giris (Dikme, Kiris, Panel)
**Ekran:** Depo > Stok Hareketleri
**API:** `POST /stock/movement`

| Urun | Miktar | Hareket | Depo Lokasyonu | Not |
|------|--------|---------|----------------|-----|
| YCK-DKM-001 Dikme | 396 adet | Uretim Cikis → Depo Giris | RAF-A Bolge 1 | Ilk hafta dikme |
| YCK-KRS-001 Kiris | 794 adet | Uretim Cikis → Depo Giris | RAF-A Bolge 2 | Ilk hafta kiris |
| YCK-PNL-001 Panel | 396 adet | Uretim Cikis → Depo Giris | RAF-B Bolge 1 | Ilk hafta panel |
| YCK-BAG-001 Baglanti | 100 set | Satin Alma → Depo Giris | RAF-C (kucuk malz.) | Bolte'den teslim |

### 13.2 Set Bazli Stok Hesabi (K9 — Workaround)
**Depo Sorumlusu Notu:**

```
Set Bazli Stok Durumu (2026-05-07):
  Dikme: 396 adet / 4 = 99 set kapasitesi (darbogazdir)
  Kiris:  794 adet / 8 = 99.25 → 99 set
  Panel:  396 adet / 4 = 99 set
  Baglanti: 100 set
  
  Minimum set kapasitesi: 99 SET → 99 SET sevkiyata hazir
  
  NOT (K9): Set bazli otomatik hesaplama yok.
  Her parca ayri stok hareketi ile izleniyor.
  99 SET icin gerekli:
    396 dikme (tamami kullanilir)
    792 kiris (2 fazla stokta kalir)
    396 panel (tamami kullanilir)
    99 baglanti seti (1 fazla stokta kalir)
```

**Dogrulama:**
- [ ] Uretim cikis stok hareketleri girildi
- [ ] Depo lokasyonlari atandi
- [ ] Set bazli stok hesabi notu girildi (K9)
- [ ] Baglanti seti satin almadan depo girisi yapildi

---

## BOLUM 14: SEVKIYAT PLANLAMA ve TESLIMAT

### 14.1 Sevkiyat Planlama
**Ekran:** Sevkiyat > Planlama
**API:** `POST /shipment`

**Kapasite Hesabi (K3 — Workaround Not Alanina):**
```
1 SET Raf Agirligi:
  4 dikme x 5.86 kg = 23.44 kg
  8 kiris x 1.68 kg = 13.44 kg
  4 panel x 6.28 kg = 25.12 kg
  1 baglanti seti = 3.50 kg
  TOPLAM: 65.50 kg/set

Kamyon Kapasitesi: TIR (13.6m dorse), max 24 ton
  24.000 kg / 65.50 kg = 366 set (agirlik siniri)
  Hacim siniri: ~40 set/TIR (dikme 2400mm uzunluk, istifleme limiti)
  → DARBOGAZDIR: HACIM (40 set/TIR)

99 set icin: 99 / 40 = 2.48 → 3 TIR gerekli
  TIR-1: 40 set (2.620 kg)
  TIR-2: 40 set (2.620 kg)
  TIR-3: 19 set (1.245 kg)
```

### 14.2 Ilk Sevkiyat — 40 Set
**Ekran:** Sevkiyat

```
Sevkiyat No: SVK-2026-0022
Musteri: ABC Lojistik
Adres: Tuzla OSB, 2. Cadde No:15
Tarih: 2026-05-08
Arac: TIR — 34 ABC 01 (Tasimacilik firması)
```

| Urun | Miktar | Agirlik | Not |
|------|--------|---------|-----|
| YCK-RAF-001 Set | 40 set | 2.620 kg | Palet uzerine sarilmis |

**Dogrulama:**
- [ ] Sevkiyat planlama notu girildi (K3 — kamyon hesabi)
- [ ] Sevkiyat karti olusturuldu
- [ ] Miktar ve agirlik bilgileri girildi
- [ ] Teslimat adresi dogru

---

## BOLUM 15: IRSALIYE, FATURA ve ODEME

### 15.1 Irsaliye Olusturma
**Ekran:** Satis > Irsaliyeler (`/sales/delivery-notes`)
**API:** `POST /deliverynote`

```
Irsaliye No: IRS-2026-0045
Sevkiyat Ref: SVK-2026-0022
Tarih: 2026-05-08
Musteri: ABC Lojistik
```

| Kalem | Miktar | Birim | Not |
|-------|--------|-------|-----|
| Celik Depo Raf Sistemi | 40 | SET | Kismi teslimat 1/10 |

### 15.2 Fatura Olusturma
**Ekran:** Finans > Faturalar (`/finance/invoices`)
**API:** `POST /invoice`

```
Fatura No: FTR-2026-0067
Irsaliye Ref: IRS-2026-0045
Tarih: 2026-05-10
Musteri: ABC Lojistik
Vade: 2026-06-24 (45 gun)
```

| Kalem | Miktar | Birim Fiyat | Toplam |
|-------|--------|-------------|--------|
| Celik Depo Raf Sistemi | 40 set | 8.500 TL | 340.000 TL |
| Montaj Hizmeti | 40 set | 750 TL | 30.000 TL |
| Nakliye | 1 sefer | 12.000 TL | 12.000 TL |
| **Ara Toplam** | | | **382.000 TL** |
| **KDV (%20)** | | | **76.400 TL** |
| **Toplam** | | | **458.400 TL** |

### 15.3 Odeme Takibi
**Ekran:** Finans > Odemeler (`/finance/payments`)
**API:** `POST /payment`

```
Vade: 2026-06-24
Beklenen Tutar: 458.400 TL
Odeme Durumu: BEKLIYOR
```

**Dogrulama:**
- [ ] Irsaliye olusturuldu, sevkiyat referansi bagli
- [ ] Fatura olusturuldu, irsaliye referansi bagli
- [ ] KDV dogru hesaplandi (%20)
- [ ] Odeme vadesi 45 gun
- [ ] Odeme listesinde BEKLIYOR durumunda gorunuyor
- [ ] Kismi teslimat notu: 40/1000 set teslim edildi

---

## BOLUM 16: MONTAJ HIZMETI TAKIBI

### 16.1 Montaj Is Emri (Saha)
**Ekran:** Uretim > Is Emirleri
**API:** `POST /workorder`

```
Is Emri No: IE-2026-0149
Tip: Montaj Hizmeti (Saha)
Musteri: ABC Lojistik
Lokasyon: Tuzla OSB Depo Sahasi
Miktar: 40 set raf montaji
Termin: 2026-05-12
Ekip: 4 kisi (2 montajci + 1 kaynak/baglanti + 1 sefligi)
```

**Montaj Operasyonlari (K4 — saha is emri workaround):**
| Sira | Operasyon | Sure/Set | Toplam (40 set) |
|------|-----------|----------|-----------------|
| 1 | Zemin isareti + dubel montaj | 15 dk | 10 saat |
| 2 | Dikme montaj (dik konumlandirma) | 10 dk | 6.7 saat |
| 3 | Kiris montaj (civatalama) | 15 dk | 10 saat |
| 4 | Panel yerlestirme | 5 dk | 3.3 saat |
| 5 | Tork kontrolu (tum civatalar) | 10 dk | 6.7 saat |
| 6 | Sehim kontrolu (yuk testi) | 5 dk/10 set | 2 saat |

**Saha Notu:**
```
Montaj tamamlama: 2026-05-12 — 4 kisi, 2 gun
40 set basariyla monte edildi
Musteri teslim tutanagi imzalandi
Tork kontrolu: Tum M10 civatalar 45 Nm ± 5 Nm (TORK-001)
Sehim testi: 2000 kg yuk ile max 4mm sehim (hedef <5mm) — GECTI
```

**Dogrulama:**
- [ ] Montaj is emri olusturuldu (K4 — saha workaround)
- [ ] Montaj operasyonlari ve sureleri girildi
- [ ] Tork kontrol degerleri notu girildi
- [ ] Sehim test sonucu notu girildi
- [ ] Musteri teslim tutanagi dosya eki olarak yuklendi
- [ ] Is emri TAMAMLANDI olarak kapatildi

---

## BOLUM 17: MALIYET ANALIZI

### 17.1 Birim Maliyet Hesabi — 1 Set Depo Rafi
**Ekran:** Uretim > Maliyet Analizi (`/production/part-cost`)
**API:** `GET /partcost/{productId}`

**Malzeme Maliyeti (1 SET):**
| Malzeme | Miktar | Birim Fiyat | Maliyet |
|---------|--------|-------------|---------|
| S235JR 80x40 profil (dikme) | 1.68 cubuk | 290 TL | 487.20 TL |
| S235JR 40x20 profil (kiris) | 1.60 cubuk | 135 TL | 216.00 TL |
| S235JR uc plaka | 16 adet | 3.50 TL | 56.00 TL |
| DKP sac 1mm (panel) | 0.64 levha | 520 TL | 332.80 TL |
| Toz boya RAL 5010 | 2.0 kg | 85 TL | 170.00 TL |
| Karisim gazi | 0.05 tup | 350 TL | 17.50 TL |
| Kaynak teli SG2 | 0.5 kg | 42 TL | 21.00 TL |
| Baglanti seti | 1 set | 28 TL | 28.00 TL |
| **Malzeme Toplam** | | | **1.328.50 TL** |

**Iscilik Maliyeti (1 SET):**
| Operasyon | Sure | Makine Ucret | Maliyet |
|-----------|------|-------------|---------|
| Kesim (dikme+kiris+panel) | 0.15 saat | 200 TL/saat ort. | 30.00 TL |
| Plazma delik | 0.08 saat | 450 TL/saat | 36.00 TL |
| Capak alma | 0.06 saat | 100 TL/saat (manuel) | 6.00 TL |
| Abkant bukme | 0.12 saat | 325 TL/saat ort. | 39.00 TL |
| Kaynak (kiris uc plaka) | 0.10 saat | 350 TL/saat | 35.00 TL |
| Kumlama | 0.10 saat | 200 TL/saat | 20.00 TL |
| Toz boya + kur | 0.15 saat | 325 TL/saat ort. | 48.75 TL |
| Kalite kontrol | 0.05 saat | 150 TL/saat | 7.50 TL |
| **Iscilik Toplam** | | | **222.25 TL** |

**Genel Giderler (%44):**
```
(Malzeme + Iscilik) x %44 = (1.328.50 + 222.25) x 0.44 = 682.33 TL
```

**Toplam Uretim Maliyeti (1 SET):**
```
Malzeme:    1.328.50 TL
Iscilik:      222.25 TL
Genel Gider:  682.33 TL
--------------------------
TOPLAM:     2.233.08 TL
```

**Kar Analizi:**
```
Satis Fiyati: 8.500 TL/set (uretim) + 750 TL (montaj) = 9.250 TL
Uretim Maliyeti: 2.233.08 TL
Montaj Maliyeti: ~400 TL (iscilik + nakliye payi)
Nakliye Payi: 300 TL/set (12.000 TL / 40 set)
--------------------------
Toplam Maliyet: 2.933.08 TL/set
Brut Kar: 9.250 - 2.933 = 6.317 TL/set
Brut Kar Marji: %68.3

1000 set icin toplam brut kar: ~6.317.000 TL
```

**Dogrulama:**
- [ ] Malzeme, iscilik ve genel gider maliyetleri hesaplandi
- [ ] Birim maliyet raporunda dogru gorunuyor
- [ ] Kar marji %68+ — seri uretim avantaji
- [ ] Montaj ve nakliye maliyetleri dahil edildi

---

## BOLUM 18: TEDARIKCI DEGERLENDIRME

### 18.1 Tedarikci Performans Degerlendirme
**Ekran:** Satin Alma > Tedarikci Degerlendirme
**API:** `POST /supplier/evaluation`

| Tedarikci | Kalite (30%) | Termin (30%) | Fiyat (20%) | Iletisim (20%) | Toplam |
|-----------|-------------|-------------|-------------|----------------|--------|
| Erdemir Celik Servis | 90 | 85 | 95 | 80 | **87.5** |
| Akzo Nobel Turkiye | 95 | 90 | 75 | 90 | **87.5** |
| Bolte Baglantilar | 85 | 95 | 90 | 85 | **88.5** |

**Degerlendirme Notlari:**
```
Erdemir Celik:
  (+) 3.1 sertifika eksiksiz, S235JR kalitesi iyi
  (+) Fiyat rekabetci (piyasa ortalamasinin %5 alti)
  (-) Kismi teslimat — 2 partide teslim etti (termin %85)
  (-) Iletisim zaman zaman gecikti

Akzo Nobel:
  (+) Toz boya lot bazli renk tutarliligi mukemmel
  (+) Termin uyumu iyi
  (-) Fiyat piyasa ortalamasinin %10 ustu

Bolte:
  (+) 8.8 sinif civata sertifikalari tam
  (+) Termin uyumu mukemmel (2 gun erken teslim)
  (+) Fiyat makul
```

**Dogrulama:**
- [ ] 3 tedarikci degerlendirmesi girildi
- [ ] Puanlama kategorileri dogru agirliklandi
- [ ] Degerlendirme notlari detayli girildi
- [ ] Tum tedarikciler 85+ puan — onaylanmis tedarikci

---

## BOLUM 19: ROL BAZLI TEST SENARYOLARI

### 19.1 Uretim Muduru Rolu
**Kullanici:** Cengiz Yilmaz (Uretim Muduru)
**Yetki:** Is emri yonetimi, Gantt, fire takibi, kapasite planlama

| # | Test Adimi | Beklenen Sonuc | Dogrulama |
|---|------------|---------------|-----------|
| 1 | Dashboard'a giris | Uretim ozet gorunumu: acik is emri sayisi, gunluk uretim, fire orani | [ ] |
| 2 | Is emri listesi filtrele (SIP-2026-0038) | 4 is emri gorunur (dikme, kiris, panel, montaj) | [ ] |
| 3 | Gantt gorunumu ac | Is emirleri zaman cizelgesinde, makine bazli cakisma yok | [ ] |
| 4 | Kesim plani goruntule | Profil kesim plani: 6m cubuk → 2x2400mm (dikme) veya 5x1200mm (kiris) | [ ] |
| 5 | Fire raporu goruntule | Dikme %1, Kiris %0.75, Panel %1 — hedef <%3 icinde | [ ] |
| 6 | Kapasite kullanimi kontrol | Plazma %85, Abkant %70, Boya %90 (darbogazdir) | [ ] |
| 7 | Haftalik uretim plani gir | 100 set/hafta tempo, 10 hafta plan | [ ] |

### 19.2 Depo Sorumlusu Rolu
**Kullanici:** Kemal Arslan (Depo Sorumlusu)
**Yetki:** Stok goruntuleme, mal kabul, sevkiyat, depo hareketleri

| # | Test Adimi | Beklenen Sonuc | Dogrulama |
|---|------------|---------------|-----------|
| 1 | Stok durumu goruntule | Profil, sac, boya, baglanti stok seviyeleri | [ ] |
| 2 | Kritik stok uyarisi kontrol | Stok min. seviye altindaysa uyari | [ ] |
| 3 | Mal kabul islemleri | Celik teslimat → tartim → kalite'ye yonlendirme | [ ] |
| 4 | Set bazli depo raporu | 99 set kapasitesi hesabi (K9 — manuel not) | [ ] |
| 5 | Sevkiyat hazirlama | 40 set paletleme, agirlik hesabi, TIR planlama | [ ] |
| 6 | Profil stok takibi (KG) | Tonaj bazli stok degeri: ~47 ton 80x40, ~20 ton 40x20 (K2) | [ ] |
| 7 | Fire/hurda stok etkisi | Hurda parcalarin stoktan dusuldugunu dogrula | [ ] |

### 19.3 Satin Alma Rolu
**Kullanici:** Derya Aksoy (Satin Alma Sefi)
**Yetki:** SA siparis, teklif isteme, fiyat karsilastirma, tedarikci degerlendirme

| # | Test Adimi | Beklenen Sonuc | Dogrulama |
|---|------------|---------------|-----------|
| 1 | MRP sonucu satin alma onerileri | Profil, sac, boya, baglanti onerileri | [ ] |
| 2 | SA siparis olustur (3 tedarikci) | Erdemir, Akzo Nobel, Bolte | [ ] |
| 3 | Fiyat karsilastirma notu gir | 3 celik tedarikci fiyat karsilastirmasi | [ ] |
| 4 | Celik piyasa fiyat takibi | Not alanina guncel celik fiyati girilir | [ ] |
| 5 | Teslimat takibi | Kismi teslimat durumu goruntulenebilir | [ ] |
| 6 | Tedarikci degerlendirme | 3 tedarikci puanlamasi | [ ] |
| 7 | Satin alma butcesi | Toplam SA tutari: ~1.241.350 TL | [ ] |

### 19.4 Operator Rolu (ShopFloor Terminal)
**Kullanici:** Recep Korkmaz (Testere/Kesim Operatoru), Selim Ozdemir (Abkant), Ahmet Celik (Kaynakci), Murat Demir (Boyaci)
**Yetki:** Atanan operasyonu baslat/bitir, miktar gir, hurda gir

| # | Test Adimi | Beklenen Sonuc | Dogrulama |
|---|------------|---------------|-----------|
| 1 | ShopFloor'a giris (operator) | Atanan is emirleri listesi gorunur | [ ] |
| 2 | Operasyon baslat (OP10 Kesim) | Baslangic zamani otomatik, makine secimi | [ ] |
| 3 | Uretilen miktar gir | 400 adet dikme girildi | [ ] |
| 4 | Hurda kaydi gir | 2 adet plazma hatasi sebebiyle | [ ] |
| 5 | Operasyon bitir | Bitis zamani, toplam sure otomatik hesap | [ ] |
| 6 | Sonraki operasyona gec | OP20'ye gecis, kuyruk durumu | [ ] |
| 7 | Boya parametreleri notu gir | RAL 5010, 68 mikron, kur 200°C/20dk | [ ] |
| 8 | Kaynak parametreleri notu gir | 110A, 14V, Argon 12 L/dk (kiris TIG) | [ ] |

---

## BOLUM 20: KAPALI DONUS TESTI (END-TO-END DOGRULAMA)

### 20.1 Siparis → Uretim → Teslimat → Tahsilat Dongusu
**Amac:** Tum surec boyunca veri butunlugu ve izlenebilirlik kontrolu

| # | Kontrol Noktasi | Beklenen | Dogrulama |
|---|----------------|----------|-----------|
| 1 | Siparis durumu | 40/1000 set teslim edildi — KISMEN TESLIM | [ ] |
| 2 | Is emri → Siparis baglantisi | IE-2026-0145/146/147 → SIP-2026-0038 | [ ] |
| 3 | Satin alma → Mal kabul baglantisi | SA-2026-0091 → Mal Kabul kaydi | [ ] |
| 4 | Uretim → Stok hareketi | Uretim cikis → depo giris tutarliligi | [ ] |
| 5 | Stok → Sevkiyat | 40 set stoktan dustu | [ ] |
| 6 | Sevkiyat → Irsaliye | SVK-2026-0022 → IRS-2026-0045 | [ ] |
| 7 | Irsaliye → Fatura | IRS-2026-0045 → FTR-2026-0067 | [ ] |
| 8 | Fatura → Odeme | FTR-2026-0067 → Odeme takibi (BEKLIYOR) | [ ] |
| 9 | Fire kaydi → Stok etkisi | 14 adet toplam hurda stoktan dustu | [ ] |
| 10 | Maliyet → Kar analizi | Birim maliyet 2.933 TL, satis 9.250 TL, kar %68 | [ ] |
| 11 | Tedarikci degerlendirme | 3 tedarikci puanlandi, hepsi 85+ | [ ] |
| 12 | Yangin kapisi seri takip | Her kapi benzersiz seri no + CE etiketi | [ ] |

### 20.2 Rapor Dogrulamalari

| Rapor | Icerik Dogrulama | [ ] |
|-------|-----------------|-----|
| Siparis Takip | 1000 set, 40 teslim, 960 kalan | [ ] |
| Uretim Durumu | 3 is emri kapatildi, fire oranlari <%3 | [ ] |
| Stok Raporu | Parca bazli + set bazli (K9 not) | [ ] |
| Maliyet Raporu | Birim maliyet, kar marji, overhead orani | [ ] |
| Kalite Raporu | Giris + ara + son muayene sonuclari | [ ] |
| Tedarikci Raporu | 3 tedarikci performans puanlari | [ ] |
| Sevkiyat Raporu | 3 TIR planlama, 1. TIR teslim edildi | [ ] |

---

## BOLUM 21: OZEL DURUMLAR ve HATA SENARYOLARI

### 21.1 Celik Fiyat Artisi Senaryosu
```
Senaryo: Siparis sirasinda celik fiyati %15 artti
Etki: Profil 80x40 birim fiyat 290 TL → 333.50 TL
Aksiyon:
  1. Yeni SA siparisi guncellenmis fiyatla girilir
  2. Maliyet analizi yeniden calistirilir
  3. Kar marji %68 → %65'e dustu — kabul edilebilir
  4. Musteri fiyat revizyonu gerekmiyor (sabit teklif)
```

### 21.2 Kalite Red Senaryosu (Profil Boyut Hatasi)
```
Senaryo: Bir parti profil (50 cubuk) dis boyut tolerans disi
Etki: 80.8mm (spec: 80 ±0.5mm) — RED
Aksiyon:
  1. Giris kalite muayenesinde RED karari
  2. MRB (Material Review Board) toplantisi
  3. Tedarikciye iade → yeni parti talep
  4. Uretim programi 2 gun kayma
  5. Tedarikci degerlendirmede Kalite puani dusur (90→75)
```

### 21.3 Boya Hatti Ariza Senaryosu
```
Senaryo: Toz boya tabancasi ariza — 1 gun uretim durdu
Etki: 100 adet boya operasyonu ertelendi
Aksiyon:
  1. Makine ariza kaydi girilir (BOY-01)
  2. Is emri durumu BEKLEMEDE
  3. Yedek tabanca ile devam (kapasite %50'ye dustu)
  4. Bakım calismasi tamamlandi → normal uretime donus
  5. Gantt'ta 1 gunluk kayma gorunur
```

### 21.4 Montaj Sahasi Sorunu
```
Senaryo: Sahada 5 set rafin delik hizasi uyumsuz
Etki: Montaj tamamlanamadi, 5 set iade
Aksiyon:
  1. Kalite uygunsuzluk raporu (NCR) acilir
  2. Kok neden analizi: CNC plazma nozul asinmasi (OP20)
  3. Nozul degisim frekansi guncellenir (150 kesim → 100 kesim)
  4. 5 set yeniden delme + boya tamir → tekrar sevk
  5. Musteri memnuniyet notu: Hizli cozum saglanmistir
```

**Dogrulama:**
- [ ] Her ozel durum senaryosu icin islem adimlarinin tamamlanabilirligi test edildi
- [ ] Hata senaryolarinda workaround'lar calistirildi
- [ ] Kalite red → MRB → tedarikci iade sureci test edildi
- [ ] Makine ariza → is emri duraklatma → devam sureci test edildi

---

## BOLUM 22: KONTROL PLANI (EN 1090-2 ve ISO 3834-2)

### 22.1 Kontrol Plani Tanimi
**Ekran:** Kalite > Kontrol Planlari (`/quality/control-plans`)
**API:** `POST /controlplan` → `POST /controlplan/items`

```
Plan No: KP-YCK-RAF-001
Urun: Celik Depo Raf Sistemi YCK-RAF-001
Revizyon: A
Durum: DRAFT → ACTIVE

Not (K5): EN 1090-2 Execution Class 2 (EXC2) gereksinimleri:
  - Kaynak kalite seviyesi: ISO 5817 Seviye C
  - Kaynak personeli sertifikasi: EN ISO 9606-1
  - Yuzey hazirlama: ISO 8501-1, Sa 2.5
  - Boya: EN ISO 12944 uyumlu toz boya sistemi
  - Mekanik baglanti: DIN 18800/EN 1993 uyumlu
```

**Kontrol Plani Kalemleri:**
| Adim | Proses | Karakteristik | Spec | Tol+ | Tol- | Metod | Alet | Ornekleme | Kritik |
|------|--------|---------------|------|------|------|-------|------|-----------|--------|
| 1 | Hammadde Giris | Profil boyutu | Nominal ±0.5mm | 0.5 | 0.5 | Olcum | KAL-001 | %5 AQL 2.5 | EVET |
| 2 | Hammadde Giris | 3.1 sertifika | S235JR uyumlu | — | — | Belge | — | %100 | EVET |
| 3 | OP10 Kesim | Boy olcusu | 2400/1200 ±2mm | 2 | 2 | Olcum | MET-001 | Her 50 parcada 1 | Hayir |
| 4 | OP20 Plazma | Delik capi | Ø12 ±0.3mm | 0.3 | 0.3 | Olcum | KAL-001 | Her 50 parcada 1 | EVET |
| 5 | OP20 Plazma | Delik step | 75 ±0.5mm | 0.5 | 0.5 | Olcum | KAL-001 | Her 50 parcada 1 | EVET |
| 6 | OP40 Bukme | Bukme acisi | 90° ±0.5° | 0.5 | 0.5 | Olcum | ACI-001 | Her 50 parcada 1 | EVET |
| 7 | OP55 Kaynak | Dikis surekliligi | Tam cevre | — | — | Gorsel | Goz | %100 | EVET |
| 8 | OP55 Kaynak | Alt kesme | Max 0.5mm | — | — | Olcum | Kaynak mastarı | %10 | EVET |
| 9 | OP55 Kaynak | Catlak | Yok | — | — | Gorsel | Goz | %100 | EVET |
| 10 | OP70 Kumlama | Yuzey temizlik | Sa 2.5 (ISO 8501-1) | — | — | Gorsel | Referans foto | %10 | EVET |
| 11 | OP80 Boya | Kuru film kalinligi | 60-80 μm | — | — | Olcum | BOY-001 | Her 20 parcada 1 | EVET |
| 12 | OP80 Boya | Yapisma (cross-cut) | GT0 veya GT1 | — | — | Test | YAP-001 | Lot basi 5 adet | EVET |
| 13 | OP110 Montaj | Civata torku | 45 ±5 Nm | 5 | 5 | Olcum | TORK-001 | %5 | Hayir |
| 14 | OP120 Son Muayene | Set montaj uyumu | Cizime gore | — | — | Fonksiyon | — | %2 | EVET |
| 15 | OP120 Son Muayene | Genel gorunum | Cizik/ezik/leke yok | — | — | Gorsel | Goz | %100 | Hayir |

**Dogrulama:**
- [ ] Kontrol plani 15 kontrol noktasi ile olusturuldu
- [ ] EN 1090-2 EXC2 gereksinimleri not alaninda (K5)
- [ ] Kritik karakteristikler isaretlendi
- [ ] Ornekleme oranlari proses tipine gore belirlendi
- [ ] Kullanilacak olcum aletleri atandi

---

## BOLUM 23: PERFORMANS ve OZET METRIKLERI

### 23.1 Uretim Performansi (Ilk Hafta — 100 Set Hedef)
| Metrik | Hedef | Gerceklesen | Durum |
|--------|-------|-------------|-------|
| Uretim adedi (set) | 100 | 99 | YAKIN (1 set eksik — parca uyumsuzlugu) |
| Fire orani (dikme) | <%3 | %1.0 | BASARILI |
| Fire orani (kiris) | <%3 | %0.75 | BASARILI |
| Fire orani (panel) | <%3 | %1.0 | BASARILI |
| Kesim fire orani (malzeme) | <%5 | %4.2 | BASARILI |
| Boya birinci gecis orani | >%95 | %98.5 | BASARILI |
| Kaynak birinci gecis orani | >%95 | %99.6 | BASARILI |
| Zamaninda teslimat | %100 | %100 (40 set zamaninda) | BASARILI |

### 23.2 Finansal Ozet
| Kalem | Tutar |
|-------|-------|
| Toplam siparis degeri | 11.460.000 TL (KDV dahil) |
| Satin alma (ilk parti) | 1.241.350 TL |
| Birim uretim maliyeti | 2.233 TL/set |
| Birim satis fiyati (montaj+nakliye dahil) | 9.250 TL/set |
| Brut kar marji | %68.3 |
| Ilk teslimat fatura | 458.400 TL (40 set) |

### 23.3 Kalite Ozet
| Kontrol | Toplam | Gecti | Red | Gecis Orani |
|---------|--------|-------|-----|-------------|
| Giris muayene (profil/sac) | 6 parametre | 6 | 0 | %100 |
| Ara kontrol (bukme/kaynak/boya) | 15 parametre | 15 | 0 | %100 |
| Son muayene (boyut/yapisma/montaj) | 10+ parametre | Hepsi | 0 | %100 |
| Yangin kapisi ozel kontrol | 10 parametre | 10 | 0 | %100 |

---

## TEST YURUTME OZETI

| Bolum | Adim Sayisi | Kapsam | Sure (Tahmini) |
|-------|------------|--------|----------------|
| 0 — Sistem Kurulumu | 4 | Makine, operasyon, gider, kalibrasyon | 45 dk |
| 1 — Musteri ve Teklif | 4 | Musteri, tedarikci, teklif | 30 dk |
| 2 — Urun ve BOM | 4 | Urun, alt urun, BOM, hammadde | 45 dk |
| 3 — Teklif ve Siparis | 3 | Teklif, siparis, MRP | 30 dk |
| 4 — Satin Alma | 2 | SA siparis (3 tedarikci), fiyat karsilastirma | 20 dk |
| 5 — Mal Kabul ve Kalite | 2 | Mal kabul, giris muayene | 25 dk |
| 6 — Uretim: Dikme | 4 | Is emri, ShopFloor (kesim, plazma, boya) | 35 dk |
| 7 — Uretim: Kiris | 2 | Is emri, ShopFloor (kesim, bukme, kaynak, boya) | 30 dk |
| 8 — Uretim: Panel | 2 | Is emri, ShopFloor (kesim, bukme, boya) | 20 dk |
| 9 — Fire/Hurda | 1 | Fire kayitlari, fire orani hesabi | 15 dk |
| 10 — Ara Kalite | 3 | Bukme, kaynak, boya kalinligi kontrol | 20 dk |
| 11 — Son Muayene | 3 | Boyut, yapisma, montaj uyumu | 20 dk |
| 12 — Yangin Kapisi | 5 | Urun, BOM, uretim, kalite, CE | 40 dk |
| 13 — Depo/Stok | 2 | Uretim cikis, set bazli stok | 15 dk |
| 14 — Sevkiyat | 2 | Kamyon planlama, sevkiyat | 15 dk |
| 15 — Irsaliye/Fatura | 3 | Irsaliye, fatura, odeme | 20 dk |
| 16 — Montaj Hizmeti | 1 | Saha montaj is emri | 15 dk |
| 17 — Maliyet Analizi | 1 | Birim maliyet, kar hesabi | 15 dk |
| 18 — Tedarikci Deger. | 1 | 3 tedarikci puanlama | 10 dk |
| 19 — Rol Bazli Test | 4 | Mudur, depocu, satinalma, operator | 40 dk |
| 20 — Kapali Donus | 2 | E2E dogrulama, rapor kontrol | 25 dk |
| 21 — Hata Senaryolari | 4 | Fiyat artisi, red, ariza, saha sorunu | 30 dk |
| 22 — Kontrol Plani | 1 | EN 1090-2, 15 kontrol noktasi | 15 dk |
| 23 — Performans | 3 | Uretim, finansal, kalite ozeti | 10 dk |
| **TOPLAM** | **~56 adim** | | **~9 saat** |

---

## NOTLAR ve ACIKLAMALAR

1. **Seri vs. Siparise Ozel Uretim:** Bu senaryo her iki modeli de kapsar:
   - Depo raf sistemi → stoka/siparise seri uretim (1000 set)
   - Yangin kapisi → siparise ozel, CE sertifikali, seri numarali

2. **Tonaj/Agirlik Takibi (K2):** Celik sektorunde malzeme tonaj bazli satin alinir ama parca bazli kullanilir. Quvex'te KG birimi ile takip edilir, ancak otomatik donusum (cubuk sayisi ↔ kg) yoktur.

3. **Nesting/Kesim Optimizasyonu (K1):** Gercek uretimde plazma kesim icin nesting yazilimi (SigmaNEST, ProNest vb.) kullanilir. Quvex'te bu harici tutulur, sadece fire orani kaydi yapilir.

4. **EN 1090-2 Uyumu:** Celik yapi imalatinda EN 1090-2 zorunludur. EXC sinifi (1-4) urun notuna yazilir (K5). Gercek uyumda kaynak proseduru (WPS), kaynakci sertifikasi ve NDT gereksinimleri EXC sinifina gore degisir.

5. **Toz Boya Sureci:** Toz boya hatti 2 adimdir: (1) Elektrostatik toz uygulama, (2) Kur firini polimerizasyonu (tipik 180-200°C, 15-20 dk). Boya kalinligi kuru film olcerle kontrol edilir.

6. **Montaj Hizmeti:** Metal esya sektorunde musteri sahasinda montaj onemli bir gelir kalemidir. Quvex'te saha is emri sinirli oldugundan (K4) ayri is emri + notlar ile izlenir.

7. **Yangin Kapisi CE:** CE isareti zorunlu (Construction Products Regulation — CPR). Urun seri numarali olmali, Notified Body onayli yangin testi (EN 1634-1) referansi olmali. Declaration of Performance (DoP) her urun icin duzenlenmeli.

---

*Bu test senaryosu Yilmaz Celik Konstruksiyon ornegi uzerinden metal esya ve celik konstruksiyon sektoru icin Quvex ERP sisteminin uctan uca testini kapsamaktadir. Toplam ~56 test adimi, 4 farkli kullanici rolu ve 2 farkli urun tipi (seri uretim raf + CE belgeli yangin kapisi) ile gercek uretim kosullarini simule etmektedir.*
