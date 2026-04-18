# Endustriyel Makine Imalati — Uctan Uca Test Senaryosu

> **Firma Profili:** Teknik Makine Muhendislik San. A.S. — 60 personel, CNC torna/freze, kaynak, montaj hatti, elektrik pano montaj, test alani
> **Sertifikalar:** ISO 9001:2015, CE Makine Direktifi 2006/42/EC, EN ISO 12100
> **Musteri:** Saglikli Gida A.S. — Gida fabrikasi otomasyon yatirimi
> **Urunler:** Bant konveyor sistemi (12m) + Ozel tasarim paketleme makinesi
> **Is Modeli:** Proje bazli siparise ozel uretim (Engineer-to-Order)
> **Senaryo:** Musteri kaydi → teklif → cok seviyeli BOM → MRP → 6 tedarikciden satin alma → 4 is emri (sasi, mil, mekanik montaj, elektrik) → fonksiyonel test → NCR → CE dosya → paketleme → nakliye → saha montaj → musteri kabul → FAI/CoC/CE → 3 asamali fatura → maliyet analizi

---

## BILINEN KISITLAMALAR

| # | Eksik Modul/Ozellik | Workaround |
|---|---------------------|------------|
| K1 | Proje yonetimi (milestone) ayri modul yok | Gantt + is emri gruplama ile takip |
| K2 | CE teknik dosya sablonu yok | Dokuman modulune PDF yuklenir |
| K3 | Devreye alma (commissioning) ayri modul yok | Is emri olarak tanimlanir |
| K4 | Garanti takibi ayri modul yok | Musteri kartina not eklenir |
| K5 | Cok seviyeli BOM agac gorunumu sinirli | Alt montaj gruplari ayri urun olarak tanimlanir |
| K6 | Risk degerlendirmesi sablonu yok | Kontrol plani + PDF risk matrisi |
| K7 | Fonksiyonel test protokolu ozel formu yok | Final muayene formunda kayit |
| K8 | Proje bazli faturalandirma otomatik takip yok | Ayri faturalar kesilir |
| K9 | Elektrik semasi cizim modulu yok | CAD dosyasi dokuman olarak eklenir |

---

## BOLUM 0: SISTEM KURULUMU (Tek Seferlik)

### 0.1 Makine / Ekipman Tanimlari
**Ekran:** Ayarlar > Makineler (`/settings/machines`) | **API:** `POST /machines`

| Makine Kodu | Makine Adi | Marka/Model | Saat Ucreti | Setup Ucreti |
|-------------|------------|-------------|-------------|--------------|
| CNC-T01 | CNC Torna — Buyuk Cap | Doosan Puma 3100Y | 800 TL | 300 TL |
| CNC-T02 | CNC Torna — Hassas | Mazak QT-250MSY | 900 TL | 350 TL |
| CNC-F01 | CNC Freze — 3 Eksen | Haas VF-4 | 750 TL | 280 TL |
| CNC-F02 | CNC Freze — 5 Eksen | DMG Mori DMU 50 | 1200 TL | 450 TL |
| KYN-01 | MIG/MAG Kaynak | Lincoln PowerWave S500 | 500 TL | 150 TL |
| KYN-02 | TIG Kaynak | Fronius MagicWave 230i | 550 TL | 180 TL |
| KES-01 | Bant Testere | Behringer HBP-320A | 250 TL | 80 TL |
| KES-02 | Plazma Kesim | Hypertherm Powermax 105 | 450 TL | 150 TL |
| KES-03 | Lazer Kesim (Sac) | Trumpf TruLaser 3030 | 1100 TL | 400 TL |
| KUM-01 | Kumlama Kabini | Guyson Euroblast 9SF | 200 TL | 80 TL |
| BYA-01 | Toz Boya Hatti | Wagner PEM-X1 | 350 TL | 120 TL |
| TSL-01 | CNC Taslama | Studer S33 | 1000 TL | 400 TL |
| MNT-01 | Montaj Hatti — Mekanik | Ozel Tasarim | 300 TL | — |
| MNT-02 | Montaj — Elektrik Pano | Rittal TS 8 Masasi | 350 TL | — |
| TST-01 | Test Alani | Ozel — Guc + Olcum | 400 TL | 200 TL |

**Dogrulama:** [ ] 15 makine tanimlandi [ ] Saat/setup ucretleri girildi

### 0.2 Is Emri Adimlari
**Ekran:** Ayarlar > Is Emri Adimlari (`/settings/work-order-steps`) | **API:** `POST /workordersteps`

| Kod | Operasyon Adi | Vars. Makine | Setup | Beceri |
|-----|--------------|-------------|-------|--------|
| OP10 | Malzeme Kesim | KES-01/02/03 | 15dk | 2 |
| OP20 | CNC Torna | CNC-T01/T02 | 30dk | 3 |
| OP30 | CNC Freze | CNC-F01/F02 | 25dk | 3 |
| OP40 | Kaynak (MIG/MAG) | KYN-01 | 20dk | 3 |
| OP50 | Kumlama | KUM-01 | 10dk | 2 |
| OP60 | Boyama (Toz Boya) | BYA-01 | 15dk | 2 |
| OP70 | CNC Taslama | TSL-01 | 20dk | 4 |
| OP80 | Isil Islem (Fason) | — | — | Fason |
| OP90 | Mekanik Montaj | MNT-01 | 30dk | 3 |
| OP100 | Elektrik Montaj + Kablaj | MNT-02 | 45dk | 3 |
| OP110 | Fonksiyonel Test | TST-01 | 60dk | 4 |
| OP120 | Boyut Kontrolu + Kalite | — | 30dk | 4 |
| OP130 | Final Muayene + FAI + CoC | — | 45dk | 4 |

### 0.3 Genel Gider Yapilandirmasi
**Ekran:** Uretim > Maliyet Analizi (`/production/part-cost`) | **API:** `POST /partcost/overheads`

| Ad | Yuzde | Gecerlilik |
|----|-------|------------|
| Genel Imalat Giderleri | %18 | 2026-01-01 → — |
| Kaynak Sarf Malzeme (Tel/Gaz) | %8 | 2026-01-01 → — |
| Kalite Kontrol + Olcum | %5 | 2026-01-01 → — |
| Ambalaj + Nakliye Paylasilmaz | %3 | 2026-01-01 → — |

**Dogrulama:** [ ] 4 genel gider tanimlandi [ ] Toplam %34 makul

### 0.4 Kontrol Plani Sablonlari
**Ekran:** Kalite > Kontrol Planlari (`/quality/control-plans`) | **API:** `POST /controlplans`

| Plan Adi | Olcum Noktalari | Tolerans | Ekipman |
|----------|----------------|----------|---------|
| KP-MIL-01: Tahrik Mili | Cap, uzunluk, kama genislik/derinlik, sertlik (HRC), yuzey | h6, +-0.1mm, js9, 45-50 HRC, Ra 0.4 | Mikrometre, kumpas, sertlik olcer |
| KP-SASI-01: Konveyor Sasisi | Duzluk, kaynak dikis gorunum, montaj deligi pozisyon | 2mm/m, VT kabul, +-0.5mm | Su terazisi, kaynak inspektoru, sablon |
| KP-PANO-01: Elektrik Pano | Izolasyon direnci, topraklama surekliligi, etiket | >1MOhm, <0.1Ohm, tam | Megger, multimetre, gorsel |
| KP-FTEST-01: Fonksiyonel Test | Motor yonu, bant hizi, acil stop suresi, sensor algilama | Dogru, 0.5-2.0m/s, <500ms, %100 | Takometre, kronometre, test aparati |

**Dogrulama:** [ ] 4 kontrol plani olusturuldu [ ] Olcum noktalari ve toleranslar tanimli [ ] Ekipman atamalari yapildi

---

## BOLUM 1: MUSTERI VE PROJE TANIMI

### Adim 1 — Musteri Kaydi: Saglikli Gida A.S.
**Ekran:** Musteriler (`/customers`) | **API:** `POST /customer` | **Rol:** Satis Muhendisi

| Alan | Deger |
|------|-------|
| Firma Adi | Saglikli Gida A.S. |
| Vergi Dairesi / No | Bayrampasa V.D. / 7891234560 |
| Adres | Hadimkoy OSB, 4. Cadde No:18, Arnavutkoy / Istanbul |
| Yetkili | Mehmet Yilmaz — Fabrika Muduru |
| Telefon | +90 212 876 54 32 |
| E-posta | mehmet.yilmaz@saglikligigida.com.tr |
| Sektor | Gida Isleme / Fabrika Otomasyonu |
| Notlar | Yeni fabrika hatti kurulumu. 2 makine: konveyor + paketleme. CE belgesi zorunlu. |
| Tip | Musteri (type=customers) |

**Dogrulama:**
- [ ] Musteri karti olusturuldu
- [ ] Tip "customers" olarak secildi
- [ ] Adres, telefon, e-posta eksiksiz

### Adim 2 — Urun Tanimlari
**Ekran:** Urunler (`/products`) | **API:** `POST /products` | **Rol:** Uretim Muhendisi

**Ana Urunler:** KNV-12000-SG (Bant Konveyor 12m PVC Gida Sinifi), PKT-AUTO-SG (Oto. Paketleme Makinesi Ozel)

**Alt Montaj Gruplari (Seviye 2):** KNV-SAS-01 (Sasi — St37 kaynak konstrüksiyon), KNV-TAH-01 (Tahrik — motor+reduktor+kasnak), KNV-BNT-01 (Bant — PVC+tambur+gerdirme), KNV-ELK-01 (Elektrik Pano — PLC+inverter+sensor), KNV-GUV-01 (Guvenlik — acil stop+korkuluk+kapak)

### Adim 3 — Cok Seviyeli BOM (80+ Parca)
**Ekran:** Urunler > BOM (`/products/{id}/bom`) | **API:** `POST /bom`

**Seviye 1: KNV-12000-SG** → 5 alt montaj + RAL 7035 boya (15kg) + baglanti seti

**Seviye 2 — Sasi Grubu (KNV-SAS-01):** Profil 80x40x3 (48m), 60x40x3 (24m), 40x40x2 (18m), ayarlanabilir ayak M16 (8), yatak/motor montaj plakasi (5), capraz berkitme L50x5 (8), kaynak teli SG2 (5kg)

**Seviye 2 — Tahrik Grubu (KNV-TAH-01):** AC Motor 4kW IE3 (**4 hft temin**), Reduktor i=20 (**4 hft**), Tahrik Mili dia50 L:700 (imalat), Kasnak dia250+dia200 (imalat), V-Kayis SPB2360 (2), UCP210 Rulman (4), Kama 14x9 (2), Kaplin RN-42, Gerdirme mekanizmasi

**Seviye 2 — Bant Grubu (KNV-BNT-01):** PVC Bant 600mm FDA 25m (**3 hft**), Tahrik Tamburu dia250 (imalat), Gerdirme Tamburu dia200 (imalat), Yon Tamburu dia150 (2, imalat), Tasiyici Rulo dia60 (18), Skraper

**Seviye 2 — Elektrik Pano (KNV-ELK-01):** S7-1200 PLC (**3 hft**), KTP700 HMI (**3 hft**), V20 4kW Inverter (**3 hft**), Kontaktor 3RT2026 (2), Termik 3RU2126 (2), Kacak Akim 30mA, Pano Rittal AE1060, Proksimite M18 (4), Fotoelektrik (2), Kablo+Klemens seti, Acil Stop (3)

**Seviye 2 — Guvenlik (KNV-GUV-01):** Korkuluk 40x40 (12), Koruma Kapagi sac 2mm (4), Emniyet Sivici (4), Uyari Etiketi Seti, Sinyal Lambasi Kule, Guvenlik Kordonu (2)

**Dogrulama:**
- [ ] Seviye 1: 7 kalem (5 alt montaj + boya + baglanti seti)
- [ ] Seviye 2 toplam: 80+ parca tanimlandi
- [ ] Imalat/satin alma/stok turu her parcada belirli
- [ ] Temin suresi kritik parcalar (motor 4hft, PLC 3hft, inverter 3hft) girildi
- [ ] Gida uygunlugu gereken parcalarda (PVC bant) FDA notu var

---

## BOLUM 2: TEKLIF VE SIPARIS

### Adim 4 — Proje Bazli Teklif
**Ekran:** Teklifler (`/offers`) | **API:** `POST /offers` | **Rol:** Satis Muhendisi

| Kalem | Tutar |
|-------|-------|
| KNV-12000-SG Konveyor Sistemi | 485.000 TL |
| PKT-AUTO-SG Paketleme Makinesi | 620.000 TL |
| Muhendislik + Tasarim | 75.000 TL |
| Nakliye + Montaj + Devreye Alma | 45.000 TL |
| **Ara Toplam / KDV / GENEL TOPLAM** | **1.225.000 / 245.000 / 1.470.000 TL** |

**Odeme Plani (K8 — teklif notlarina yazilir):**
- %30 Avans: Siparis onayi ile — 367.500 TL
- %40 Teslim: Fabrikadan sevkiyatta — 490.000 TL
- %30 Devreye Alma: Basarili kabul testinden sonra — 367.500 TL (45 gun vade)

**Dogrulama:**
- [ ] Teklif olusturuldu, teklif numarasi atandi
- [ ] 4 kalem eklendi (2 urun + muhendislik + montaj)
- [ ] Odeme plani notlara yazildi
- [ ] Toplam tutar dogru hesaplandi
- [ ] PDF cikti alinabilir

### Adim 5 — Siparis Onayi + Proje Plani
**Ekran:** Siparisler (`/orders`) | **API:** `POST /orders` | **Rol:** Satis Muduru

| Alan | Deger |
|------|-------|
| Siparis No | SIP-2026-0052 |
| Teklif Ref | TKL-2026-0087 |
| Musteri | Saglikli Gida A.S. |
| Siparis Tarihi | 2026-04-14 |
| Teslim Tarihi | 2026-06-20 (10 hafta) |
| Durum | Onaylandi |

**Proje Gantt (K1 — is emri tarihleri ile takip):**

| Hafta | Faaliyet | Suresi |
|-------|----------|--------|
| H1 | Satin alma emirleri (kritik: motor, PLC, inverter) | 1 hafta |
| H1-H2 | Detay tasarim + CNC program hazirlama | 2 hafta |
| H2-H3 | Sasi imalati (profil kesim, kaynak, CNC isleme) | 2 hafta |
| H3-H4 | Tahrik mili imalati (CNC torna/freze, isil islem, taslama) | 2 hafta |
| H4 | Kumlama + Boya (sasi) | 1 hafta |
| H5-H6 | Mekanik montaj (mil, yatak, tahrik, bant) | 2 hafta |
| H6-H7 | Elektrik pano montaj + kablaj | 2 hafta |
| H7-H8 | Fonksiyonel test + CE dosya + duzeltme | 2 hafta |
| H9 | Paketleme + Nakliye | 1 hafta |
| H10 | Saha montaj + devreye alma + musteri kabul | 1 hafta |

**Dogrulama:**
- [ ] Siparis teklif referansiyla olusturuldu
- [ ] Siparis durumu "Onaylandi"
- [ ] Proje plani notlara/gantt'a islendi

---

## BOLUM 3: MRP VE SATIN ALMA

### Adim 6 — MRP Calistirma
**Ekran:** MRP (`/mrp`) | **API:** `POST /mrp/run`

**Kritik Yol:** Motor+Reduktor (4 hft — HEMEN siparis!), PLC+Inverter+HMI (3 hft), PVC Bant (3 hft), Profil/Sac (1 hft), Standart parcalar (stoktan)

### Adim 7 — Satin Alma (6 Tedarikci)
**Ekran:** Satin Alma (`/purchasing`) | **API:** `POST /purchaseorders`

**SA-0098: Elektro Otomasyon (Siemens dist.) — 63.760 TL (3 hft)**
PLC S7-1200 (18.500), HMI KTP700 (14.200), Inverter V20 (12.800), Kontaktor (2x1.450), Termik (2x980), Kacak akim (2.100), Sensor proksimite (4x650), Sensor foto (2x1.200), Kablo seti (3.500), Klemens seti (2.800)

**SA-0099: Ana Makine Tic. (Motor/Reduktor) — 44.400 TL (4 hft — KRITIK)**
Motor 4kW IE3 ABB (22.500), Reduktor Bonfiglioli i=20 (18.700), Kaplin RN-42 (3.200)

**SA-0100: Ozdemir Demir Celik — 30.220 TL (1 hft)**
Profil 80x40 (8x1.850), 60x40 (4x1.420), 40x40 (3x980), Sac t:10 (4.200), Sac t:12 (1.100), Kosebent (2x750)

**SA-0101: Anadolu Bant Konveyor — 38.860 TL (3 hft)**
PVC Bant FDA 25m (28.500), Rulo dia60 (18x420), Skraper (2.800)

**SA-0102: Guler Kaplama — 12.200 TL (3 gun)**
Toz boya RAL7035 25kg (4.800), Epoxi astar (2x2.200), Kumlama abrazif (2x1.500)

**SA-0103: Rulman Market (SKF/NSK) — 35.720 TL (1 hft)**
UCP210 (4x2.850), V-Kayis (2x680), Ayak M16 (8x320), Pano Rittal (8.900), Sinyal lambasi (3.400), Emniyet sivici (4x1.100), Guvenlik kordonu (2x1.850)

**Dogrulama:** [ ] 6 SA emri [ ] Toplam ~225.160 TL [ ] Kritik yol H1'de siparis edildi

---

## BOLUM 4: MAL KABUL VE GIRIS KALITE

### Adim 8 — Mal Kabul: Motor ve Reduktor (Kritik Yol)
**Ekran:** Depo > Mal Kabul (`/warehouse/receiving`) | **API:** `POST /receiving` | **Rol:** Depo Sorumlusu

| Alan | Deger |
|------|-------|
| Satin Alma Ref | SA-2026-0099 |
| Tedarikci | Ana Makine Ticaret A.S. |
| Teslim Tarihi | 2026-05-12 (H4 basi — plana uygun) |

| Kalem | Miktar | Durum |
|-------|--------|-------|
| AC Motor 4kW 1450rpm IE3 (ABB M3BP 112MLA 4) | 1 | Teslim alindi |
| Helisel Reduktor i=20 (Bonfiglioli A202) | 1 | Teslim alindi |
| Esnek Kaplin RN-42 | 1 | Teslim alindi |

**Kontroller:** Motor tip etiketi: 4kW, 1450rpm, 400V, IE3 — UYGUN. Reduktor: i=20, cikis 75rpm — UYGUN. Hasar yok, ambalaj saglam.

**Dogrulama:** [ ] Mal kabul kaydi olusturuldu [ ] SA emrine baglandi [ ] Stok guncellendi

### Adim 9 — Mal Kabul: Elektrik Malzemesi
**Ekran:** Depo > Mal Kabul | **API:** `POST /receiving`

SA-2026-0098 ref., Tarih: 2026-05-05 (H3 basi). 10 kalem teslim alindi.

**Kritik Seri Numaralari:**
- Siemens S7-1200: 6ES7 214-1AG40-0XB0 / SN:SVP37520844
- Siemens KTP700: 6AV2 123-2GB03-0AX0 / SN:SVP41283761
- Siemens V20 4kW: 6SL3210-5BE24-0UV0 / SN:T-E84020183

**Dogrulama:** [ ] 10 kalem mal kabul [ ] PLC, HMI, Inverter seri numaralari kaydedildi [ ] Stok guncellendi

### Adim 10 — Giris Kalite Kontrolu (Kritik Parcalar)
**Ekran:** Kalite > Muayene (`/quality/inspections`) | **API:** `POST /inspections` | **Rol:** Kalite Kontrol

**Kontrol 1: Tahrik Mili Hammaddesi (42CrMo4)**
- Malzeme sertifikasi (3.1) kontrol — Kimyasal bilesim uygun
- Cap olcumu: dia55 +0/-0.5mm — UYGUN (55.2mm olculdu)

**Kontrol 2: UCP210 Flansl Rulman**
- Marka/model dogrulama: SKF UCP210 — UYGUN
- Ic cap: 50mm — UYGUN
- Donme kontrol: Serbest, takirtisiz — UYGUN

**Kontrol 3: Motor Etiket Dogrulama**
- Guc: 4kW ✓ | Devir: 1450rpm ✓ | Gerilim: 400V 3-Faz ✓ | Verimlilik: IE3 ✓

**Dogrulama:**
- [ ] 3 giris kalite kaydi olusturuldu
- [ ] Olcum sonuclari tolerans icinde
- [ ] Uygunluk durumu "KABUL"
- [ ] Malzeme sertifikasi (3.1) referans verildi

---

## BOLUM 5: IMALAT

### Adim 11 — Is Emri #1: Sasi Imalati (IE-2026-0112)
**Ekran:** Uretim > Is Emirleri (`/production/work-orders`) | **API:** `POST /workorders`
**Rol:** Uretim Muduru

| Alan | Deger |
|------|-------|
| Is Emri No | IE-2026-0112 |
| Urun | KNV-SAS-01 — Konveyor Sasi Grubu |
| Siparis Ref | SIP-2026-0052 |
| Miktar | 1 |
| Baslangic / Bitis | 2026-04-28 → 2026-05-09 |
| Oncelik | Yuksek |

**Operasyonlar ve ShopFloor Kayitlari:**

| Op | Operasyon | Makine | Plan | Gercek | Operator | Notlar |
|----|-----------|--------|------|--------|----------|--------|
| 10 | Profil Kesim | KES-01 | 8s | 8.5s | Ahmet Kaya (Kalfa) | 80x40: 16 boy, 60x40: 8, 40x40: 6. 2 boy uzun — tekrar kesildi |
| 20 | Kaynak — Sasi Iskelet | KYN-01 | 24s | 25s | Hasan Demir (Usta) | SG2 tel 1.0mm, %80Ar/%20CO2 karisim gaz. Ana cerceve + capraz berkitme |
| 30 | CNC Freze — Yatak Yuvasi | CNC-F01 | 6s | 6.5s | Murat Ozturk (Usta) | 4x yatak montaj H7, motor plaka delikleri. Sablon ile pozisyon kontrolu |
| 40 | Kumlama | KUM-01 | 3s | 3.5s | Ali Yildiz (Kalfa) | Sa 2.5 yuzey temizligi |
| 50 | Toz Boya | BYA-01 | 4s | 5s | Kemal Sahin (Kalfa) | RAL 7035, 180C 20dk firinlama, 72 mikron kuru film olculdu |

**Dogrulama:**
- [ ] Is emri 5 operasyonla olusturuldu
- [ ] Her operasyona makine atandi
- [ ] Operator kayitlari ShopFloor'dan girildi
- [ ] Gerceklesen sureler kaydedildi
- [ ] Kaynak parametreleri (gaz, tel) notlara yazildi

### Adim 12 — Is Emri #2: Tahrik Mili Imalati (IE-2026-0113)
**Urun:** TAH-MIL-01 dia50 L:700mm (42CrMo4 celik)
**Tarih:** 2026-04-28 → 2026-05-12 | **Oncelik:** Yuksek

| Op | Operasyon | Makine | Plan | Gercek | Detay |
|----|-----------|--------|------|--------|-------|
| 10 | CNC Torna | CNC-T02 | 4s | 4.5s | dia55→50 h6, kademe, Ra 0.8, taslama payi |
| 20 | CNC Freze — Kama Kanali | CNC-F01 | 2s | 2s | 14x9 js9, 2 adet, L:80mm |
| 30 | Isil Islem (FASON) | — | 2 gun | 5 gun | Anadolu Isil Islem, HRC 45-50, 4.500 TL |
| 40 | CNC Taslama | TSL-01 | 3s | 3.5s | h6 final, Ra 0.4, merkezler arasi |

**Fason Isil Islem (Op30):**
**Ekran:** Fason Is Emirleri (`/production/subcontract-orders`) | **API:** `POST /subcontractorders`

| Alan | Deger |
|------|-------|
| Fason Firma | Anadolu Isil Islem San. Ltd. |
| Proses | Induksiyon Sertlestirme |
| Hedef Sertlik | HRC 45-50 |
| Derinlik | 2-3mm etkin sertlik derinligi |
| Teslim Tarihi | 2026-05-05 |
| Fiyat | 4.500 TL |
| Gonderim | 2026-04-29 — Mil fason firmaya gonderildi |
| Donus | 2026-05-04 — Sertlik: HRC 47 (yatak), HRC 48 (kama) — UYGUN |

**Kalite — KP-MIL-01 Sonuclari:**

| Olcum | Nominal | Tolerans | Olculen | Sonuc |
|-------|---------|----------|---------|-------|
| Mil Capi | 50.000mm | h6 (0/−0.016) | 50.005mm | UYGUN |
| Uzunluk | 700mm | +-0.1 | 699.95mm | UYGUN |
| Kama Genislik | 14mm | js9 (+-0.021) | 14.02mm | UYGUN |
| Kama Derinlik | 5.5mm | +0.1/0 | 5.52mm | UYGUN |
| Sertlik (yatak) | HRC 47 | 45-50 | 47 | UYGUN |
| Yuzey | Ra 0.4 | max 0.4 | Ra 0.35 | UYGUN |

**Dogrulama:**
- [ ] Is emri 4 operasyonla olusturuldu
- [ ] Fason isil islem ayri kayit olusturuldu
- [ ] CNC torna/freze/taslama kayitlari girildi
- [ ] Sertlik sonuclari fason donus sonrasi girildi
- [ ] h6 tolerans olcumleri kalite kaydinda mevcut
- [ ] Kontrol plani KP-MIL-01 uygulanarak sonuclar kaydedildi

### Adim 13 — Kasnak ve Tambur Imalati (IE-2026-0114)
**Urun:** Kasnak + Tambur parcalari | **Tarih:** 2026-04-30 → 2026-05-09

| Parca | Op10: Torna | Op20: Freze | Op30: Kaynak | Toplam |
|-------|-------------|-------------|-------------|--------|
| Tahrik Kasnagi dia250 | 3s | 1s (kama) | — | 4s |
| Bos Donucu Kasnak dia200 | 2.5s | — | — | 2.5s |
| Tahrik Tamburu dia250 L:650 | 3s | — | 2s (flans) | 5s |
| Gerdirme Tamburu dia200 L:650 | 2.5s | — | 1.5s | 4s |
| Yon Degistirme Tamburu x2 | 4s | — | 2s | 6s |
| **TOPLAM** | | | | **21.5s** |

**Dogrulama:** [ ] 6 parca imalati tamamlandi [ ] CNC torna + kaynak operasyonlari kaydedildi

### Adim 14 — Is Emri #3: Mekanik Montaj (IE-2026-0115)
**Urun:** KNV-12000-SG Mekanik | **Tarih:** 2026-05-12 → 2026-05-23
**On Kosul:** IE-0112 (sasi), IE-0113 (mil), IE-0114 (kasnak/tambur) tamamlanmis

| Op | Operasyon | Plan | Gercek | Detay |
|----|-----------|------|--------|-------|
| 10 | Yatak + Mil Montaj | 8s | 9s | 4x UCP210, tork 85Nm, bosluk 0.1-0.3mm |
| 20 | Tahrik Grubu | 12s | 12s | Motor+reduktor, kaplin lazer hizalama (0.05mm), kayis gergi |
| 30 | Bant Grubu | 10s | 11s | Tambur, rulo, PVC bant sarma, gerdirme, bant ekleme (fason vulkanizasyon) |
| 40 | Koruma/Guvenlik | 6s | 6s | 12 korkuluk, 4 kapak, 4 emniyet sivici, 3 acil stop, 2 guvenlik kordonu |

Montajci: Osman Polat (Montaj Ustasi) + yardimcilar. Toplam: plan 36s → gercek 38s.

**Montaj Notlari:**
- Op10: Yatak sabitleme torku 85Nm, mil eksenel bosluk 0.1-0.3mm kontrol edildi
- Op20: Motor-reduktor kaplin hizalama lazer ile (0.05mm icinde), V-kayis gerginligi 10mm sehim/1kg
- Op30: PVC bant ekleme (vulkanizasyon) fason firma tarafindan yapildi, rulo araligi 300mm
- Op40: 12 korkuluk, 4 kapak, 4 emniyet sivici, 3 acil stop, 2 kordonu, sinyal lambasi kule

**Dogrulama:**
- [ ] Is emri 4 operasyonla olusturuldu
- [ ] On kosul (sasi+mil+kasnak hazir) dogrulandi
- [ ] Montaj torklari ve hizalama notlara yazildi

### Adim 15 — Is Emri #4: Elektrik Montaj (IE-2026-0116)
**Urun:** KNV-ELK-01 | **Tarih:** 2026-05-16 → 2026-05-27

| Op | Operasyon | Plan | Gercek | Detay |
|----|-----------|------|--------|-------|
| 10 | Pano Ic Montaj | 12s | 12s | PLC, HMI, inverter, kontaktor, klemens, DIN ray |
| 20 | Kablaj | 16s | 18s | Motor 3x2.5mm2, sensor 4x0.75mm2 ekranli, acil stop NC seri |
| 30 | Topraklama | 4s | 4s | Sasi→PE 16mm2, motor→sasi 6mm2, pano→sasi 10mm2 |

Elektrikci: Serkan Arslan (Usta Elektrikci).

**Kablaj Detaylari:**
- Motor baglantisi: 3x2.5mm2 + PE, U/V/W dogru faz sirasi
- Sensor kablolari: 4x0.75mm2 ekranli, ekran tek uctan toprak
- Acil stop: NC kontak, seri bagli (3 buton + 2 guvenlik kordonu)
- Topraklama: Sasi→PE 16mm2 yesil/sari, Motor→sasi 6mm2, Pano→sasi 10mm2
- Topraklama surekliligi olcumu: 0.04 Ohm (<0.1 ✓)

**Dogrulama:**
- [ ] Is emri 3 operasyonla olusturuldu
- [ ] Pano montaj ve kablaj detaylari kaydedildi
- [ ] Topraklama surekliligi olcum sonucu girildi
- [ ] PLC/HMI/Inverter seri numaralari is emrine baglandi

---

## BOLUM 6: TEST VE KALITE

### Adim 16 — Fonksiyonel Test (Fabrikada)
**Ekran:** Kalite > Muayene (`/quality/inspections`) | **API:** `POST /inspections`
**Kontrol Plani:** KP-FTEST-01

| Test | Kriter | Ilk Sonuc |
|------|--------|-----------|
| FT-01: Motor Donus Yonu | Saat yonunun tersi | **BASARISIZ** (ters donuyor!) |
| FT-02 → FT-12 | Hiz, acil stop, sensor, HMI, PLC | BEKLEMEDE (FT-01 duzeltilecek) |

### Adim 17 — NCR: Inverter Parametre Hatasi (NCR-2026-0034)
**Ekran:** Kalite > NCR (`/quality/ncr`) | **API:** `POST /ncr`

| Alan | Deger |
|------|-------|
| Tur | Dahili — Fonksiyonel Test |
| Aciklama | Motor donus yonu yanlis, konveyor geriye hareket ediyor |
| Kok Neden | Inverter P0700 parametresi yanlis (yazilimsal ters cevirme aktif) |
| Onlem | P0700: 0→1, P1300 rampa: 5s→3s |
| Sorumlu | Serkan Arslan |

**Duzeltme Sonrasi Yeniden Test — 12/12 BASARILI:**

| Test | Kriter | Sonuc |
|------|--------|-------|
| FT-01: Motor Yonu | Saat yonu tersi | Dogru ✓ |
| FT-02: Min Hiz | 0.5 m/s | 0.48 ✓ |
| FT-03: Max Hiz | 2.0 m/s | 2.02 ✓ |
| FT-04/05/06: Acil Stop (3 buton) | <500ms | 320/350/310ms ✓ |
| FT-07: Guvenlik Kordonu | Dur | 280ms ✓ |
| FT-08: Kapak Sivici | Dur | OK ✓ |
| FT-09: Proksimite | 5-10mm | 8mm ✓ |
| FT-10: Fotoelektrik | Cisim algilama | PLC sinyal OK ✓ |
| FT-11: HMI | Hiz/Durum/Alarm | Dogru ✓ |
| FT-12: PLC Program | Otomatik mod | Sorunsuz ✓ |

### Adim 18 — CE Teknik Dosya (K2)
**Ekran:** Dokumanlar (`/documents`) | **API:** `POST /documents`

Yuklenen dokumanlar: CE-KNV-001 Risk Degerlendirmesi (EN ISO 12100), CE-KNV-002 Elektrik Semasi, CE-KNV-003 Montaj Resmi, CE-KNV-004 Kullanim Kilavuzu (TR+EN), CE-KNV-005 Malzeme Sertifikalari, CE-KNV-006 Test Raporlari, CE-KNV-007 CE Uygunluk Beyani

**Risk Degerlendirmesi Ozeti (K6):**

| Tehlike | Once | Onlem | Sonra |
|---------|------|-------|-------|
| Sikisma (bant-tambur) | 16 | Koruma kapak + emniyet sivici | 4 |
| Elektrik carpmasi | 15 | Kacak akim + topraklama | 3 |
| Dolanma (kayis/kasnak) | 12 | Kayis koruma kapagi | 4 |
| Yanma (motor yuzey) | 6 | Uyari etiketi + fan muhafaza | 3 |

---

## BOLUM 7: SEVKIYAT VE DEVREYE ALMA

### Adim 19 — Paketleme ve Sevkiyat Hazirligi (IE-2026-0117)
**Ekran:** Uretim > Is Emirleri | **Tarih:** 2026-05-29 → 2026-05-30

**Sokum ve Paletleme Plani:**

| Palet | Icerik | Boyut (cm) | Agirlik |
|-------|--------|-----------|---------|
| PLT-01 | Sasi Grubu — Bolum 1 | 650x80x60 | 480 kg |
| PLT-02 | Sasi Grubu — Bolum 2 | 650x80x60 | 420 kg |
| PLT-03 | Tahrik Grubu (motor+reduktor+kasnak) | 120x80x80 | 280 kg |
| PLT-04 | Bant Grubu (PVC bant + tamburlar) | 200x80x60 | 180 kg |
| PLT-05 | Elektrik Pano + Kablo harness | 100x80x60 | 85 kg |
| PLT-06 | Guvenlik + korkuluk + aksesuar | 150x80x60 | 120 kg |
| PLT-07 | Baglanti elemanlari + yedek + dokuman | 60x40x40 | 25 kg |

Toplam: 7 palet, ~1590 kg. Nakliye: Kapali tir (12m icine sigar).

### Adim 20 — Nakliye (SVK-2026-0041)
**Ekran:** Sevkiyat (`/shipments`) | **API:** `POST /shipments`

Cikis: Teknik Makine — Gebze OSB → Varis: Saglikli Gida — Hadimkoy OSB
Nakliyeci: Aras Kargo / Proje Nakliyat, Kapali Tir 34 ABC 789, 2026-06-02, Nakliye sigortali.

### Adim 21 — Saha Montaj + Devreye Alma (IE-2026-0118, K3)
**Ekran:** Uretim > Is Emirleri | **Tarih:** 2026-06-08 → 2026-06-14

**Saha Montaj Plani:**

| Gun | Faaliyet | Ekip |
|-----|----------|------|
| G1 | Sasi birlestirme + ayak montaji + tesviye | Montajci (2 kisi) |
| G2 | Tahrik grubu montaj + mil/yatak | Montajci (2 kisi) |
| G3 | Bant grubu montaj + gerdirme | Montajci + Yardimci |
| G4 | Elektrik pano montaj + kablaj | Elektrikci + Yardimci |
| G5 | Devreye alma: PLC yukleme, inverter parametre, test | Otomasyon Muhendisi |

**Devreye Alma Kontrol Listesi:**
- [ ] Fabrika guc kaynagi: 380V 3-Faz, 50Hz — OK
- [ ] Topraklama: Fabrika topraklama barasina baglandi — OK
- [ ] PLC programi: V1.2 yuklendi (fabrika testinde dogrulanmis) — OK
- [ ] Inverter parametreleri: P0700=1, P1300=3s, P1120=50Hz — OK
- [ ] Motor donus yonu: DOGRU
- [ ] Bant hizi: HMI uzerinden 0.5-2.0 m/s ayarlandi — OK
- [ ] Acil stop: 3 buton + 2 kordonu test edildi — OK
- [ ] Sensor kalibrasyonu: proksimite 8mm, fotoelektrik — OK
- [ ] 2 saat surekli calisma testi: sorunsuz — OK

**Dogrulama:**
- [ ] Saha montaj is emri olusturuldu
- [ ] 5 gunluk plan kaydedildi
- [ ] Devreye alma kontrol listesi operasyon notlarina yazildi

### Adim 22 — Musteri Kabul Testi (SAT)
**Ekran:** Kalite > Muayene | **Tarih:** 2026-06-15
**Katilimcilar:** Kalite Md. + Proje Muh. / Musteri: Fabrika Md. + Bakim Muh.

| Test | Sonuc | Musteri |
|------|-------|--------|
| Genel gorunum (boyali, hasarsiz) | OK | ONAY |
| Min hiz 0.5 m/s | 0.49 | ONAY |
| Max hiz 2.0 m/s | 2.01 | ONAY |
| Yuklu calisma 50kg — 2 saat | Kayma yok | ONAY |
| Acil stop tum noktalar | <500ms | ONAY |
| Guvenlik (kapak/kordonu) | OK | ONAY |
| Gurultu <75 dB(A) | 68 dB(A) | ONAY |
| HMI Turkce arayuz | OK | ONAY |
| Dokuman teslimi | Teslim | ONAY |

**Sonuc:** KABUL — Mehmet Yilmaz imza — 2026-06-15

---

## BOLUM 8: BELGELENDIRME VE FATURA

### Adim 23 — FAI + CoC + CE Beyani
**Ekran:** Kalite > FAI (`/quality/fai`) | **API:** `POST /fai`

**FAI-2026-0021 Kritik Parametreler:**
Toplam uzunluk 12004mm (+-10 ✓), Bant genisligi 598mm (+-5 ✓), Duzluk 1.2mm/m (max 2 ✓), Mil dia 50.005 (h6 ✓), Hiz 0.49-2.02 (✓), Acil stop 320ms (✓), Izolasyon 485MOhm (✓), Toprak 0.04Ohm (✓)

**CoC:** COC-2026-0021 — ISO 9001, EN ISO 12100, EN 60204-1 uygunlugu
**CE Beyani:** 2006/42/EC, EN ISO 12100:2010, EN 60204-1:2018, EN ISO 13857:2019

### Adim 24 — Proje Bazli Faturalandirma (K8)
**Ekran:** Faturalar (`/invoices`) | **API:** `POST /invoices`

| Fatura | Tarih | Asama | Tutar | KDV | Toplam |
|--------|-------|-------|-------|-----|--------|
| FTR-0187 | 2026-04-15 | Avans %30 | 367.500 | 73.500 | 441.000 |
| FTR-0234 | 2026-06-02 | Teslim %40 | 490.000 | 98.000 | 588.000 |
| FTR-0251 | 2026-06-15 | Devreye alma %30 (45 gun vade) | 367.500 | 73.500 | 441.000 |
| **TOPLAM** | | | **1.225.000** | **245.000** | **1.470.000** |

### Adim 25 — Garanti Takibi (K4)
**Ekran:** Musteriler > Musteri Detay (`/customers/{id}`) | **API:** `PUT /customer/{id}`

| Alan | Deger |
|------|-------|
| Not Basligi | GARANTI — KNV-12000-SG Konveyor Sistemi |
| Garanti Suresi | 24 ay (2026-06-15 → 2028-06-15) |
| Kapsam | Mekanik: sasi, mil, yatak, kasnak. Elektrik: PLC, inverter, sensor. Bant: 12 ay. |
| Haric | Sarf malzeme (kayis, skraper), kullanimdan kaynaklanan hasar, bant asinma |
| Periyodik Bakim | 6 ayda bir: yaglama, kayis kontrolu, sensor temizligi |
| Iletisim | servis@teknikmakine.com / +90 262 555 12 34 |

**Dogrulama:** [ ] Garanti notu musteri kartina eklendi [ ] Sure ve kapsam belirtildi

---

## BOLUM 9: MALIYET ANALIZI

### Adim 26 — Planlanan vs Gerceklesen
**Ekran:** Uretim > Maliyet Analizi (`/production/part-cost`)

| Kategori | Planlanan | Gerceklesen | Fark |
|----------|----------|-------------|------|
| Malzeme (6 tedarikci) | 231.000 | 225.160 | -5.840 (%97.5) |
| Iscilik (7 is emri, 192→203.5 saat) | 120.000 | 127.200 | +7.200 (%106) |
| Fason (isil islem + vulkanizasyon) | 8.000 | 8.300 | +300 (%103.8) |
| Diger (muhendislik+nakliye+konaklama) | 60.000 | 65.500 | +5.500 (%109.2) |
| **TOPLAM MALIYET** | **419.000** | **426.160** | **+7.160 (%101.7)** |
| **Satis (KDV haric)** | | **1.225.000** | |
| **Brut Kar / Marj** | **806.000 / %65.8** | **798.840 / %65.2** | **-0.6 puan** |

**Sapma:** Malzeme tasarruf (+%2.5 pazarlik), iscilik fazla (%6 — NCR + montaj zorlugu), nakliye/konaklama fazla (%9 — saha suresi). Toplam sapma +%1.7 — KABUL EDILEBILIR.

---

## BOLUM 10: IKINCI URUN — PAKETLEME MAKINESI (KISALTILMIS)

### Adim 27 — PKT-AUTO-SG BOM ve Imalat

**Konveyorden Farkli Noktalar:**
- Termal yapistirma unitesi (isitici eleman + PID sicaklik kontrolor)
- Pnomatik sistem (Festo/SMC silindir, yonlu valf, basinc regulatoru)
- Servo motor + driver (Siemens V90 — paket pozisyonlama)
- Paslanmaz celik sac (AISI 304 — gida temasi yuzeyler)
- PLC programi daha karmasik (20+ I/O, resept yonetimi, paket sayac, gramaj kontrol)

**Ek Satin Alma Kalemleri:**
- Pnomatik malzeme (Festo DSBC silindir, VUVS valf) — ~18.000 TL
- Servo motor V90 + driver — ~24.000 TL
- Isitici eleman + PID kontrolor — ~8.500 TL
- Paslanmaz sac AISI 304 t:1.5mm — ~12.000 TL

**Ek Test Kalemleri:**
- Paketleme hizi: 30 paket/dk — hedef +-10%
- Yapistirma mukavemeti: cekme testi min 5N/15mm
- Hijyen testi: gida temasi yuzeyler paslanmaz, Ra <0.8
- Gramaj hassasiyeti: +-2g

**Dogrulama:**
- [ ] Paketleme makinesi BOM olusturuldu
- [ ] Ek is emirleri (mekanik + pnomatik + elektrik) planlandi
- [ ] Pnomatik ve servo malzeme SA emirleri verildi
- [ ] Paketleme hizi ve hijyen testleri basarili

### Adim 28 — Proje Kapanisi
**Ekran:** Siparisler > Siparis Detay (`/orders/{id}`) | **API:** `PUT /orders/{id}`

| Alan | Deger |
|------|-------|
| Siparis | SIP-2026-0052 |
| Durum | Tamamlandi |
| Kapanma Tarihi | 2026-06-15 |
| Teslim Suresi | 9 hafta (planlanan 10 — 1 hafta erken!) |
| Musteri Memnuniyeti | 5/5 |

**Proje Dersleri (notlara yazilir):**

| # | Ders | Aksiyon |
|---|------|---------|
| 1 | Motor/reduktor 4 hft — kritik yol dogru belirlendi | Uzun temin sureli parcalarda siparis onden verilsin |
| 2 | Inverter parametre hatasi NCR olusturdu | Devreye alma oncesi parametre kontrol listesi zorunlu |
| 3 | Saha montaj 5→6 gun surdu | Saha icin %20 buffer eklensin |
| 4 | Malzeme maliyeti beklentinin %2.5 altinda | Toplu satin almada pazarlik avantaji devam ettirilsin |
| 5 | CNC toleranslar ilk seferde tuttu | CAM programlari kalibre, operatorler deneyimli |

**Dogrulama:**
- [ ] Siparis "Tamamlandi" olarak guncellendi
- [ ] Proje dersleri kaydedildi
- [ ] Teslim: 9 hafta (erken teslim)

---

## ADIM OZET TABLOSU

| Adim | Baslik | Modul | Rol | Kritiklik |
|------|--------|-------|-----|-----------|
| 1 | Musteri Kaydi | Musteriler | Satis | Normal |
| 2 | Urun Tanimlari (2 ana + 5 alt montaj) | Urunler | Uretim Muh. | Yuksek |
| 3 | Cok Seviyeli BOM (80+ parca) | BOM | Uretim Muh. | Yuksek |
| 4 | Proje Bazli Teklif | Teklifler | Satis | Normal |
| 5 | Siparis Onayi + Proje Plani | Siparisler | Satis Md. | Yuksek |
| 6 | MRP + Kritik Yol | MRP | Uretim Planlama | Kritik |
| 7 | Satin Alma (6 tedarikci) | Satin Alma | Satinalma | Kritik |
| 8 | Mal Kabul: Motor/Reduktor | Depo | Depo | Yuksek |
| 9 | Mal Kabul: Elektrik | Depo | Depo | Normal |
| 10 | Giris Kalite | Kalite | Kalite | Yuksek |
| 11 | Is Emri #1: Sasi | Uretim | Uretim Md. | Yuksek |
| 12 | Is Emri #2: Tahrik Mili | Uretim | Uretim Md. | Kritik |
| 13 | Kasnak/Tambur Imalati | Uretim | Uretim Md. | Yuksek |
| 14 | Is Emri #3: Mekanik Montaj | Uretim | Uretim Md. | Kritik |
| 15 | Is Emri #4: Elektrik Montaj | Uretim | Uretim Md. | Kritik |
| 16 | Fonksiyonel Test | Kalite | Kalite Muh. | Kritik |
| 17 | NCR — Inverter Hatasi | Kalite | Kalite Muh. | Yuksek |
| 18 | CE Teknik Dosya | Dokumanlar | Kalite Md. | Yuksek |
| 19 | Paketleme + Sevkiyat | Uretim/Sevkiyat | Lojistik | Normal |
| 20 | Nakliye | Sevkiyat | Lojistik | Normal |
| 21 | Saha Montaj + Devreye Alma | Uretim | Proje Muh. | Kritik |
| 22 | Musteri Kabul Testi | Kalite | Kalite Md. | Kritik |
| 23 | FAI + CoC + CE Beyani | Kalite | Kalite Md. | Yuksek |
| 24 | Faturalandirma (3 asama) | Faturalar | Muhasebe | Yuksek |
| 25 | Garanti Takibi | Musteriler | Satis | Normal |
| 26 | Proje Maliyet Analizi | Maliyet | Uretim Md. | Yuksek |
| 27 | Paketleme Makinesi (2. urun) | Uretim | Uretim Md. | Yuksek |
| 28 | Proje Kapanisi | Siparisler | Proje Muh. | Normal |

---

## ROL BAZLI TEST MATRISI

### Uretim Muduru
| # | Kontrol | Ekran | Beklenen |
|---|---------|-------|----------|
| R1 | Proje Gantt | /production/work-orders | 6 is emri tarih sirasinda |
| R2 | Operasyon ilerleme | /production/work-orders/{id} | % ilerleme gorunur |
| R3 | Gecikme uyarisi | Dashboard | IE-0116 elektrik 2 gun gecikti |
| R4 | Kapasite | /capacity | CNC-T02 H2'de %90 dolu |
| R5 | Maliyet | /production/part-cost | Is emri bazli |
| R6 | Fason | /production/subcontract-orders | Isil islem "Tamamlandi" |

### Satin Alma Sorumlusu
| # | Kontrol | Ekran | Beklenen |
|---|---------|-------|----------|
| R7 | Kritik tedarik | /purchasing | Motor/reduktor "KRITIK" |
| R8 | Temin suresi | /purchasing/{id} | 4 hafta, teslim tarihi gorunur |
| R9 | Mal kabul bildirimi | /warehouse/receiving | Bildirim gelir |
| R10 | Tedarikci performansi | /suppliers | Zamaninda teslim orani |

### Kalite Muduru
| # | Kontrol | Ekran | Beklenen |
|---|---------|-------|----------|
| R11 | NCR | /quality/ncr | NCR-0034 "Kapatildi" |
| R12 | FAI | /quality/fai | 9 parametre UYGUN |
| R13 | Test sonuclari | /quality/inspections | 12/12 BASARILI |
| R14 | CE dosya | /documents | 7 dokuman yuklu |
| R15 | Kontrol planlari | /quality/control-plans | 4 plan uygulanmis |

### Operator (ShopFloor)
| # | Kontrol | Beklenen |
|---|---------|----------|
| R16 | Atanmis is listesi | Gunluk is emirleri gorunur |
| R17 | Baslat/Bitir | Zaman kaydi yapilabiyor |
| R18 | Olcum girisi | Mil cap, kama genislik girilebiliyor |
| R19 | Not ekleme | Operasyon notlari (gaz, sogutucu) eklenebiliyor |

---

## PERFORMANS VE ENTEGRASYON

### Performans
| Test | Kriter |
|------|--------|
| BOM yukleme (80+ kalem) | < 3 sn |
| MRP calisma (200+ parca) | < 10 sn |
| Is emri listesi | < 2 sn |
| Maliyet raporu | < 5 sn |
| PDF uretimi (FAI/CoC) | < 3 sn |

### Entegrasyon
| Test | Kontrol |
|------|---------|
| E1: Teklif → Siparis | Kalemler dogru aktarildi mi? |
| E2: Siparis → MRP → SA | MRP ciktisi SA emrine donustu mu? |
| E3: SA → Mal kabul → Stok | Stok otomatik guncellendi mi? |
| E4: Stok → IE malzeme cekisi | Malzeme stoktan dustu mu? |
| E5: IE → Maliyet | Operasyon sureleri maliyete yansidi mi? |
| E6: Muayene → NCR → DF | NCR akisi eksiksiz mi? |
| E7: Fason → Mal kabul → IE devam | IE fason donus sonrasi devam ediyor mu? |
| E8: Test → FAI → CoC | Sonuclar FAI'da referans mi? |
| E9: Fatura → Siparis bakiye | 3 fatura sonrasi bakiye sifir mi? |
| E10: Bildirimler (SignalR) | NCR, gecikme, mal kabul bildirimi geliyor mu? |

---

## EDGE CASE SENARYOLARI

| # | Senaryo | Beklenen |
|---|---------|----------|
| EC1 | Motor tedarik gecikmesi (4→6 hafta) | IE tarihleri guncellenir, musteri bilgilendirilir |
| EC2 | Isil islem sertlik disinda (HRC 42) | NCR, tekrar fason emri |
| EC3 | PVC bant FDA belgesi eksik | Mal kabul red, tedarikci iletisim |
| EC4 | Acil stop calismiyor | IE durdurulur, CE verilemez, NCR |
| EC5 | Musteri kabul testi red | Duzeltme, yeniden test, fatura ertelenir |
| EC6 | 2. fatura odenmez | Devreye alma baslamaz (is sureci notu) |
| EC7 | Saha montajda eksik parca | Acil sevkiyat, ek malzeme, maliyet guncellenir |

---

## TEST CALISTIRMA TALIMATI

### Hazirlik
- Temiz veritabani (seed: 15 makine, 13 operasyon, 4 genel gider, 4 kontrol plani)
- Kullanicilar: uretim.muduru, satinalma, kalite.muduru, operator, satis, muhasebe
- Role uygun izinler (Permissions.cs)

### Calistirma Sirasi
1. Bolum 0: Kurulum (makine, operasyon, gider, kontrol plani)
2. Bolum 1-2: Musteri → Urun → BOM → Teklif → Siparis (Adim 1-5)
3. Bolum 3: MRP → Satin Alma (Adim 6-7)
4. Bolum 4: Mal Kabul → Giris Kalite (Adim 8-10)
5. Bolum 5: 4 Is Emri — sasi, mil, montaj, elektrik (Adim 11-15)
6. Bolum 6: Test → NCR → CE (Adim 16-18)
7. Bolum 7: Paketleme → Nakliye → Saha → Kabul (Adim 19-22)
8. Bolum 8: FAI/CoC → Fatura → Garanti (Adim 23-25)
9. Bolum 9-10: Maliyet + 2. Urun + Kapanma (Adim 26-28)
10. Rol bazli + Performans + Entegrasyon (R1-R19, P1-P5, E1-E10)

### Tahmini Sure
- **Tam senaryo:** 3-4 saat
- **Kritik yol:** 1.5-2 saat (Adim 1,3,6,7,11,12,14,15,16,17,22,23)
- **Regresyon:** 1-1.5 saat

**Toplam: 28 adim + 19 rol kontrol + 5 performans + 10 entegrasyon + 7 edge case = 69 test noktasi**

---

> **Hazirlayan:** QA Ekibi — Quvex ERP
> **Tarih:** 2026-04-10
> **Versiyon:** v1.0
> **Sektor:** Endustriyel Makine Imalati (Engineer-to-Order)
> **Standartlar:** ISO 9001:2015, CE 2006/42/EC, EN ISO 12100, EN 60204-1
