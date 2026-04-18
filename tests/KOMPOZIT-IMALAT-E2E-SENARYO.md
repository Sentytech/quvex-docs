# Kompozit Imalat — Uctan Uca Test Senaryosu
# IHA/SiHA Govde Paneli: Teklif → Prepreg Serim → Otoklav Kur → NDT → Sevkiyat

> **Firma:** Kartal Kompozit Havacilik San. A.S. (30 kisi)
> **Sektor:** Savunma havacilik — IHA/SiHA kompozit yapi parcalari
> **Musteri:** TAI (Turk Havacilik ve Uzay Sanayii A.S.) — ANKA IHA programi
> **Urun:** Karbon fiber/epoksi kompozit govde paneli (CFRP), cam fiber radome
> **Standartlar:** AS9100 Rev D, NADCAP Composites, ASTM D3039, ASTM D2344 (ILSS)
> **Ekipman:** Clean room (sinif 100.000), vakum torba sistemi, otoklav (3m, 200°C/150psi), ultrasonik NDT (C-scan)
> **Test Tarihi:** 2026-04-10
> **Test Ortami:** localhost:3000 (development) veya quvex.io (production)
> **Test suresi:** ~55 dakika
> **Adim sayisi:** 38

---

## Senaryo Ozeti

Bu senaryo, bir savunma havacilik kompozit imalat firmasinin (Kartal Kompozit) TAI'den gelen
ANKA IHA govde paneli talebini karsilamasi icin tum surecleri kapsar:

1. Musteri ve urun tanimlari (TAI, AS9100/NADCAP gereksinimleri)
2. Hammadde tanimlari (prepreg, film yapistiricisi, sarf malzemeler + lot/out-time takibi)
3. BOM/Recete olusturma (8 kat prepreg + yapistiricisi + sarf)
4. Teklif → Siparis (teknik sartname referansli)
5. Satin alma → Mal kabul → Giris kalite (lot sertifika, kupon testi)
6. Clean room ortam kontrolu
7. Lay-up (serim) is emri — 9 operasyon (kalip hazirlik → debulk)
8. Otoklav kurleme — 3 operasyon (yukleme → kurleme → sogutma)
9. Kaliptan cikarma + gorsel kontrol
10. Ultrasonik NDT (C-scan) — delaminasyon/porozite kontrolu
11. Trim/drill (CNC kenar kesim + delik delme)
12. Boyutsal kontrol (CMM)
13. FAI (AS9102) + CoC
14. Seri numara izlenebilirlik (prepreg lot → panel seri no)
15. Paketleme → Sevkiyat → Fatura
16. Maliyet analizi (prepreg fire minimizasyonu)

Her adimda API endpoint'i, form verileri, beklenen sonuc ve dogrulama checklist'i verilmistir.

---

## On Kosullar

Asagidaki kosullar test baslangicinda saglanmis olmalidir:

- [ ] Quvex uygulamasi calisiyor (API: localhost:5052, UI: localhost:3000)
- [ ] PostgreSQL veritabani erisim durumu: aktif (`smallfactory-postgres` container)
- [ ] Admin kullanici ile giris yapilabiliyor (admin@quvex.com / Admin123!@#$)
- [ ] Temel ayarlar yapilmis: Birim tanimlari (Adet, Kg, m², Metre, Rulo)
- [ ] KDV oranlari tanimli (%20 standart)
- [ ] Depo tanimlari: Sogutucu Depo (DP01, -18°C prepreg), Clean Room (DP02), Mamul Depo (DP03), Sevkiyat Alani (DP04)
- [ ] Makine tanimlari: Otoklav-01 (3m cap, max 200°C/150psi), CNC-Trim-01 (5 eksen router)
- [ ] Roller tanimli: Admin, Uretim Muduru, Kalite Muduru, Muhasebeci, Operator, Depocu
- [ ] Olcum aletleri kalibrasyonu gecerli: CMM, termocouple, ultrasonik NDT cihazi

---

## Bilinen Kisitlamalar (Quvex'te Eksik Moduller)

Kompozit imalat surecine ozgu asagidaki islevler Quvex'te yerel olarak mevcut degildir.
Her kisitlama icin workaround (gecici cozum) belirtilmistir:

| # | Eksik Islev | Workaround |
|---|------------|------------|
| K1 | Prepreg out-time otomatik kumulatif takip | Lot notuna manuel "Oda cikis: tarih-saat" yazilir. Kalibrasyon modulu ile periyodik hatirlatma kurulur. |
| K2 | Fiber oryantasyon (0°/±45°/90°) ayri veri alani | Operasyon notuna "Oryantasyon: 0°" seklinde yazilir. Is emri aciklamasinda lay-up sirasi belirtilir. |
| K3 | Otoklav sicaklik/basinc egrisi otomatik kayit | Otoklav PLC'den alinan cure cycle raporu PDF olarak is emrine dosya eki yuklenir. |
| K4 | C-scan goruntusu otomatik entegrasyon | NDT C-scan PNG/PDF muayene kaydina dosya eki olarak yuklenir. |
| K5 | Clean room ortam logu (sicaklik/nem surekli) | Ortam olcumleri muayene kaydi olarak girilir (Op basinda/sonunda). |
| K6 | Ply-by-ply (kat kat) izlenebilirlik | Her kat icin ayri operasyon tanimlandi; operasyon notu ile prepreg rulo segmenti eslesmesi yapilir. |
| K7 | Vacuum integrity test otomatik kayit | Vakum degerleri (mbar) operasyon olcum kaydina manuel girilir. |

---

# ══════════════════════════════════════════════════════════════
# BOLUM 1: MUSTERI ve URUN TANIMLARI
# ══════════════════════════════════════════════════════════════

## Adim 1: Musteri Kaydi (TAI)
**Ekran:** Musteri Yonetimi > Yeni Musteri
**API:** POST /Customer
**Menu yolu:** Sol menu > Musteri Yonetimi > Musteriler
**Rol:** Admin

**Veri:**

| Alan | Deger |
|------|-------|
| Firma Adi | Turk Havacilik ve Uzay Sanayii A.S. |
| Kisa Adi | TAI |
| Tipi | Musteri |
| Vergi Dairesi | Ankara Kurumlar |
| Vergi No | 1234567891 |
| Telefon | 0312 811 1800 |
| E-posta | tedarik@tai.com.tr |
| Web | www.tai.com.tr |
| Adres | Fethiye Mah. Havacilik Bulvari No:17, Kahramankazan / Ankara |
| Ulke | Turkiye |
| Sehir | Ankara |
| Sektor | Savunma Havacilik |
| Notlar | AS9100 Rev D + NADCAP Composites sertifikasi zorunlu. ITAR/EAR kapsaminda ihracat kontrol mevzuatina tabi. ANKA IHA programi ana yuklenici. Kalite onay sureci: FAI + CoC + data pack. |

**Beklenen Sonuc:**
- Musteri basariyla kaydedildi
- Musteri listesinde "TAI" gorunuyor
- Musteri detay sayfasinda tum bilgiler dogru

**Dogrulama:**
- [ ] Musteri kaydi olusturuldu (201 Created)
- [ ] Musteri listesinde gorunuyor (/Customer?type=customers)
- [ ] Vergi no benzersizlik kontrolu calisti
- [ ] Adres bilgileri dogru kaydedildi
- [ ] Notlar alaninda AS9100 + NADCAP bilgisi gorunuyor
- [ ] Savunma havacilik sektoru secimi yapildi

---

## Adim 2: Musteri Irtibat Kisileri
**Ekran:** Musteri Detay > Irtibat Kisileri
**API:** POST /CustomerContact
**Rol:** Admin

**Veri — Satin Alma:**

| Alan | Deger |
|------|-------|
| Ad Soyad | Cpt. Burak Ozturk |
| Unvan | Kompozit Tedarik Sorumlusu |
| Telefon | 0532 211 3344 |
| E-posta | burak.ozturk@tai.com.tr |
| Departman | Tedarik Zinciri |

**Veri — Kalite:**

| Alan | Deger |
|------|-------|
| Ad Soyad | Dr. Elif Sahin |
| Unvan | Kompozit Malzeme Kalite Muhendisi |
| Telefon | 0533 422 5566 |
| E-posta | elif.sahin@tai.com.tr |
| Departman | Gelen Kalite / Kompozit |

**Veri — Muhendislik:**

| Alan | Deger |
|------|-------|
| Ad Soyad | Muh. Kerem Aydogan |
| Unvan | Yapisal Tasarim Muhendisi |
| Telefon | 0535 677 8899 |
| E-posta | kerem.aydogan@tai.com.tr |
| Departman | Yapisal Tasarim |

**Dogrulama:**
- [ ] 3 irtibat kisisi eklendi
- [ ] Irtibat bilgileri musteri detayinda gorunuyor
- [ ] Telefon ve e-posta formatlari dogru
- [ ] Departman bilgileri dogru

---

## Adim 3: Urun Tanimi — CFRP Govde Paneli
**Ekran:** Urun Yonetimi > Yeni Urun
**API:** POST /Product
**Menu yolu:** Sol menu > Urun Yonetimi > Urunler
**Rol:** Uretim Muduru

**Veri:**

| Alan | Deger |
|------|-------|
| Urun Adi | CFRP Govde Paneli — ANKA IHA |
| Urun Kodu | KKH-CFRP-001 |
| Birim | Adet |
| Kategori | Kompozit Yapi Parcasi |
| Aciklama | Karbon fiber/epoksi prepreg kompozit govde paneli. 8 kat T700/2510 prepreg, [0/+45/-45/90]s simetrik lay-up. Boyut: 600x400x3mm (±0.2mm). Otoklav kurlemeli. TAI ANKA IHA govde alt paneli. |
| Teknik Cizim No | TAI-ANKA-GP-2024-001 Rev.B |
| Malzeme Spesifikasyonu | TAI-MS-CFRP-012 |
| Net Agirlik | 1.44 kg |
| Brut Agirlik | 1.52 kg (trim payi dahil) |
| Birim Fiyat | 4,250.00 TL |
| KDV | %20 |

**Beklenen Sonuc:**
- Urun basariyla kaydedildi
- Urun kodu benzersizlik kontrolu calisti
- Urun listesinde gorunuyor

**Dogrulama:**
- [ ] Urun kaydi olusturuldu (201 Created)
- [ ] Urun kodu KKH-CFRP-001 dogru
- [ ] Boyut bilgisi aciklamada mevcut (600x400x3mm)
- [ ] Teknik cizim referansi dogru
- [ ] Birim fiyat 4,250.00 TL
- [ ] OxitAutoComplete ile "CFRP" aramasiyla bulunuyor

---

## Adim 4: Urun Tanimi — Cam Fiber Radome
**Ekran:** Urun Yonetimi > Yeni Urun
**API:** POST /Product
**Rol:** Uretim Muduru

**Veri:**

| Alan | Deger |
|------|-------|
| Urun Adi | GFRP Radome — ANKA IHA |
| Urun Kodu | KKH-GFRP-002 |
| Birim | Adet |
| Kategori | Kompozit Yapi Parcasi |
| Aciklama | Cam fiber/epoksi radome. S2 cam fiber prepreg, 6 kat, [0/60/-60]s lay-up. Cap: 320mm, yukseklik: 180mm. Otoklav kurlemeli. Radar gecirgenlik testi gerekli. |
| Teknik Cizim No | TAI-ANKA-RD-2024-003 Rev.A |
| Net Agirlik | 0.62 kg |
| Birim Fiyat | 6,800.00 TL |

**Dogrulama:**
- [ ] Urun kaydi olusturuldu (201 Created)
- [ ] Urun kodu KKH-GFRP-002 benzersiz
- [ ] Radome aciklamasi radar gecirgenlik notu iceriyor

---

# ══════════════════════════════════════════════════════════════
# BOLUM 2: HAMMADDE ve TEDARIKCI TANIMLARI
# ══════════════════════════════════════════════════════════════

## Adim 5: Tedarikci Kaydi — Prepreg Tedarikci (Toray)
**Ekran:** Musteri Yonetimi > Yeni Musteri (Tedarikci modu)
**API:** POST /Customer
**Filtre:** /Customer?type=suppliers
**Rol:** Admin

**Veri:**

| Alan | Deger |
|------|-------|
| Firma Adi | Toray Advanced Composites — Turkiye Distributorlugu |
| Kisa Adi | Toray TR |
| Tipi | Tedarikci |
| Vergi No | 9876543210 |
| Telefon | 0216 555 7700 |
| E-posta | sales@toray-composites.com.tr |
| Adres | Gebze Organize Sanayi Bolgesi, Kocaeli |
| Notlar | Prepreg ana tedarikci. Lot bazli sertifika zorunlu. Soguk zincir (cold chain) teslimat. Out-time takibi icin cikis zamani mutlaka kayit altina alinacak. Min. siparis: 50 m². Lead time: 8-12 hafta. |

**Dogrulama:**
- [ ] Tedarikci kaydedildi (201 Created)
- [ ] /Customer?type=suppliers listesinde gorunuyor
- [ ] Soguk zincir ve lot sertifika notu kayitli

---

## Adim 6: Hammadde Tanimi — Prepreg (Toray T700/2510)
**Ekran:** Urun Yonetimi > Yeni Urun (Hammadde)
**API:** POST /Product
**Rol:** Uretim Muduru

**Veri:**

| Alan | Deger |
|------|-------|
| Urun Adi | Prepreg — Toray T700/2510 Karbon Fiber/Epoksi |
| Urun Kodu | HM-PREG-T700-2510 |
| Birim | m² |
| Kategori | Hammadde — Prepreg |
| Aciklama | Toray T700 karbon fiber / 2510 epoksi recine sistemi. UD (tek yonlu) prepreg. Areal weight: 190 g/m². Recine icerigi: %35±3. Rulo genisligi: 1000mm. Raf omru: -18°C'de 12 ay, oda sicakliginda (22°C) kumulatif 30 gun out-time. Tg (cam gecis sicakligi): 180°C min. |
| Birim Fiyat | 385.00 TL/m² |
| Kritik Stok | 100 m² |
| Depolama | Sogutucu Depo (DP01, -18°C) — ZORUNLU |

> **ONEMLI — OUT-TIME TAKIBI (Kisitlama K1):**
> Prepreg oda sicakligina cikarildiginda out-time sayaci baslar. Kumulatif oda suresi
> 30 gunu gecerse malzeme KULLANILMAZ. Her oda cikisinda lot notuna
> "OUT: YYYY-MM-DD HH:mm → YYYY-MM-DD HH:mm (X saat)" yazilmalidir.
> Kalibrasyon modulunde "Prepreg out-time hatirlatici" kurulmalidir.

**Dogrulama:**
- [ ] Hammadde kaydedildi (201 Created)
- [ ] Birim m² olarak ayarli
- [ ] Aciklamada out-time bilgisi (30 gun) mevcut
- [ ] Kritik stok seviyesi 100 m²
- [ ] Sogutucu depo zorunlulugu not edilmis

---

## Adim 7: Hammadde Tanimi — Film Yapistiricisi (FM300-2K)
**Ekran:** Urun Yonetimi > Yeni Urun (Hammadde)
**API:** POST /Product
**Rol:** Uretim Muduru

**Veri:**

| Alan | Deger |
|------|-------|
| Urun Adi | Film Yapistiricisi — Cytec FM300-2K |
| Urun Kodu | HM-FILM-FM300-2K |
| Birim | m² |
| Kategori | Hammadde — Yapistiricisi |
| Aciklama | Cytec FM300-2K yapisal film yapistiricisi. 177°C kur. Areal weight: 300 g/m². Peel ply ile birlikte kullanilir. Raf omru: -18°C'de 12 ay, oda sicakliginda 20 gun. |
| Birim Fiyat | 520.00 TL/m² |
| Depolama | Sogutucu Depo (DP01, -18°C) — ZORUNLU |

**Dogrulama:**
- [ ] Hammadde kaydedildi (201 Created)
- [ ] Birim m² dogru
- [ ] Raf omru bilgisi aciklamada mevcut

---

## Adim 8: Sarf Malzeme Tanimlari
**Ekran:** Urun Yonetimi > Yeni Urun (Hammadde)
**API:** POST /Product (4 adet kayit)
**Rol:** Uretim Muduru

**Veri — Peel Ply:**

| Alan | Deger |
|------|-------|
| Urun Adi | Peel Ply — Nylon Release Fabric |
| Urun Kodu | HM-SARF-PEELPLY |
| Birim | m² |
| Kategori | Sarf Malzeme — Kompozit |
| Birim Fiyat | 18.50 TL/m² |

**Veri — Vakum Torba:**

| Alan | Deger |
|------|-------|
| Urun Adi | Vakum Torba Film — Nylon 6 (PA6) |
| Urun Kodu | HM-SARF-VACBAG |
| Birim | m² |
| Kategori | Sarf Malzeme — Kompozit |
| Aciklama | 50 mikron kalinlik. Otoklav sicakligina dayanikli (200°C). Tek kullanimlik. |
| Birim Fiyat | 12.00 TL/m² |

**Veri — Sealant Tape:**

| Alan | Deger |
|------|-------|
| Urun Adi | Vakum Sealant Bant — Butyl |
| Urun Kodu | HM-SARF-SEALANT |
| Birim | Metre |
| Kategori | Sarf Malzeme — Kompozit |
| Aciklama | Butyl bazli vakum sizdimazlik bandi. 12mm genislik. Otoklav uyumlu. |
| Birim Fiyat | 8.00 TL/m |

**Veri — Breather:**

| Alan | Deger |
|------|-------|
| Urun Adi | Breather Kece — Polyester |
| Urun Kodu | HM-SARF-BREATHER |
| Birim | m² |
| Kategori | Sarf Malzeme — Kompozit |
| Aciklama | Hava gecirgen polyester kece. Vakum dagilimi icin. 4mm kalinlik. |
| Birim Fiyat | 22.00 TL/m² |

**Dogrulama:**
- [ ] 4 sarf malzeme kaydedildi (4x 201 Created)
- [ ] Her biri dogru birimde (m², Metre)
- [ ] Kategoriler "Sarf Malzeme — Kompozit" olarak atandi
- [ ] Stok takip birimleri dogru

---

## Adim 9: BOM/Recete Olusturma — CFRP Govde Paneli
**Ekran:** Urun Yonetimi > Urun Detay > Recete
**API:** POST /Recipe
**Rol:** Uretim Muduru

**Ana Urun:** KKH-CFRP-001 (CFRP Govde Paneli)

**BOM Satirlari:**

| # | Malzeme | Kod | Miktar | Birim | Fire % | Toplam | Aciklama |
|---|---------|-----|--------|-------|--------|--------|----------|
| 1 | Prepreg T700/2510 | HM-PREG-T700-2510 | 1.92 | m² | %12 | 2.15 m² | 8 kat × 0.24 m²/kat (600×400mm) + kenar payi |
| 2 | Film Yapistiricisi FM300-2K | HM-FILM-FM300-2K | 0.24 | m² | %5 | 0.25 m² | 1 kat, panel boyutunda |
| 3 | Peel Ply | HM-SARF-PEELPLY | 0.50 | m² | %10 | 0.55 m² | Alt + ust yuzey |
| 4 | Vakum Torba Film | HM-SARF-VACBAG | 0.80 | m² | %15 | 0.92 m² | Kalip sarma payi |
| 5 | Sealant Bant | HM-SARF-SEALANT | 2.40 | Metre | %10 | 2.64 m | Kalip cevresi (600+400)×2 + ek |
| 6 | Breather Kece | HM-SARF-BREATHER | 0.50 | m² | %10 | 0.55 m² | Vakum torba altina |

> **HESAPLAMA NOTU:**
> - Prepreg: Her kat 0.6m × 0.4m = 0.24 m². 8 kat = 1.92 m² net.
>   Fire payi %12 (kenar kesim + oryantasyon uyumu): 1.92 × 1.12 = 2.15 m²
> - 1 adet panel icin toplam prepreg maliyeti: 2.15 × 385 = 827.75 TL
> - Fire minimizasyonu KRITIK: Prepreg m² fiyati yuksek, nesting optimizasyonu gerekli.

**Dogrulama:**
- [ ] Recete olusturuldu (201 Created)
- [ ] 6 BOM satiri dogru
- [ ] Fire oranlari girilmis
- [ ] Toplam prepreg miktari 2.15 m² (fire dahil)
- [ ] Maliyet hesaplamasi dogru (prepreg: 827.75 TL)
- [ ] Recete urun detayinda gorunuyor

---

# ══════════════════════════════════════════════════════════════
# BOLUM 3: TEKLIF ve SIPARIS
# ══════════════════════════════════════════════════════════════

## Adim 10: Teklif Olusturma (TAI — CFRP Panel)
**Ekran:** Teklif Yonetimi > Yeni Teklif
**API:** POST /Offer
**Menu yolu:** Sol menu > Satis > Teklifler
**Rol:** Admin

**Veri:**

| Alan | Deger |
|------|-------|
| Musteri | TAI (Turk Havacilik ve Uzay Sanayii A.S.) |
| Teklif No | TKL-2026-0042 |
| Teklif Tarihi | 2026-04-10 |
| Gecerlilik | 30 gun |
| Para Birimi | TL |
| Aciklama | ANKA IHA govde alt paneli (CFRP). TAI-ANKA-GP-2024-001 Rev.B teknik cizime gore. AS9100 + NADCAP Composites kapsaminda uretim. FAI + CoC + data pack teslimati dahil. |

**Teklif Kalemleri:**

| # | Urun | Kod | Miktar | Birim Fiyat | Toplam |
|---|------|-----|--------|-------------|--------|
| 1 | CFRP Govde Paneli | KKH-CFRP-001 | 50 Adet | 4,250.00 TL | 212,500.00 TL |
| 2 | GFRP Radome | KKH-GFRP-002 | 20 Adet | 6,800.00 TL | 136,000.00 TL |

| | Tutar |
|---|-------|
| Ara Toplam | 348,500.00 TL |
| KDV (%20) | 69,700.00 TL |
| Genel Toplam | 418,200.00 TL |

> **TAI TEKNIK SARTNAME REFERANSLARI:**
> - TAI-ANKA-GP-2024-001 Rev.B (CFRP panel teknik cizim)
> - TAI-ANKA-RD-2024-003 Rev.A (Radome teknik cizim)
> - TAI-MS-CFRP-012 (Malzeme spesifikasyonu)
> - TAI-QR-2024-005 (Kalite gereksinimleri — FAI/CoC/NDT)

**Dogrulama:**
- [ ] Teklif olusturuldu (201 Created)
- [ ] 2 kalem dogru (50 panel + 20 radome)
- [ ] Toplam tutar 418,200.00 TL (KDV dahil)
- [ ] Teknik sartname referanslari aciklamada mevcut
- [ ] Teklif PDF ciktisi alinabiliyor

---

## Adim 11: Teklif → Siparis Donusumu
**Ekran:** Teklif Detay > Siparise Donustur
**API:** POST /Order (veya teklif donusum endpoint'i)
**Rol:** Admin

**Islem:**
1. Teklif detay sayfasinda "Siparise Donustur" butonu tiklanir
2. TAI siparis numarasi eklenir: TAI-PO-2026-1187
3. Termin tarihi: 2026-06-15 (yaklasik 9 hafta)
4. Siparis notu: "TAI-PO-2026-1187 referansli. Ilk teslimat: 10 adet CFRP panel, 2026-05-20'ye kadar. Kalan partiler haftalik 10'ar adet."

**Dogrulama:**
- [ ] Siparis olusturuldu (201 Created)
- [ ] Siparis kalemleri teklifle ayni (50 panel + 20 radome)
- [ ] TAI siparis numarasi (TAI-PO-2026-1187) kayitli
- [ ] Termin tarihi 2026-06-15
- [ ] Teklif durumu "Siparise Donusturuldu" olarak guncellendi
- [ ] Siparis listesinde gorunuyor

---

# ══════════════════════════════════════════════════════════════
# BOLUM 4: SATIN ALMA ve GIRIS KALITE
# ══════════════════════════════════════════════════════════════

## Adim 12: Satin Alma Talebi — Prepreg
**Ekran:** Satin Alma > Yeni Satin Alma
**API:** POST /PurchaseOrder
**Rol:** Uretim Muduru

**Veri:**

| Alan | Deger |
|------|-------|
| Tedarikci | Toray TR |
| Talep Tarihi | 2026-04-10 |
| Termin Tarihi | 2026-04-25 |
| Aciklama | ANKA IHA projesi icin prepreg tedariği. Soguk zincir teslimat zorunlu. Lot sertifikasi (CoA) ile birlikte teslim edilmeli. |

**Kalemler:**

| # | Malzeme | Kod | Miktar | Birim | Birim Fiyat | Toplam |
|---|---------|-----|--------|-------|-------------|--------|
| 1 | Prepreg T700/2510 | HM-PREG-T700-2510 | 120.00 | m² | 385.00 TL | 46,200.00 TL |
| 2 | Film Yapistiricisi FM300-2K | HM-FILM-FM300-2K | 15.00 | m² | 520.00 TL | 7,800.00 TL |

| | Tutar |
|---|-------|
| Ara Toplam | 54,000.00 TL |
| KDV (%20) | 10,800.00 TL |
| Genel Toplam | 64,800.00 TL |

> **NEDEN 120 m²?**
> 50 panel × 2.15 m²/panel = 107.5 m² (fire dahil).
> +%10 guvenlik stoku + kupon testi numunesi = ~120 m²

**Dogrulama:**
- [ ] Satin alma olusturuldu (201 Created)
- [ ] 2 kalem dogru
- [ ] Toplam tutar 64,800.00 TL (KDV dahil)
- [ ] Tedarikci "Toray TR" secilmis
- [ ] Soguk zincir notu aciklamada var

---

## Adim 13: Mal Kabul — Prepreg Teslim Alma
**Ekran:** Depo > Mal Kabul / Stok Giris
**API:** POST /StockMovement (veya mal kabul endpoint'i)
**Rol:** Depocu

**Veri:**

| Alan | Deger |
|------|-------|
| Tedarikci | Toray TR |
| Irsaliye No | TRC-2026-04-0088 |
| Teslim Tarihi | 2026-04-25 |
| Hedef Depo | Sogutucu Depo (DP01) |

**Teslim Alinan Malzemeler:**

| # | Malzeme | Miktar | Lot No | Uretim Tarihi | Son Kull. Tarihi | Sertifika |
|---|---------|--------|--------|----------------|-----------------|-----------|
| 1 | Prepreg T700/2510 | 120 m² (4 rulo × 30 m²) | LOT-T700-2026-0341 | 2026-03-15 | 2027-03-15 | CoA mevcut |
| 2 | Film FM300-2K | 15 m² (1 rulo) | LOT-FM300-2026-0112 | 2026-03-20 | 2027-03-20 | CoA mevcut |

> **SOGUK ZINCIR KONTROLU:**
> Teslim alindiginda prepreg ambalaj sicakligi kontrol edilmeli.
> Sicaklik indikatoru (cold chain indicator) "OK" olmalidir.
> Soguk zincir kirilmasi durumunda malzeme RED edilir.

**Dogrulama:**
- [ ] Mal kabul islemi tamamlandi
- [ ] Prepreg stoku 120 m² olarak guncellendi (Sogutucu Depo)
- [ ] Film yapistiricisi stoku 15 m² olarak guncellendi
- [ ] Lot numaralari kaydedildi (LOT-T700-2026-0341, LOT-FM300-2026-0112)
- [ ] Son kullanma tarihleri girildi
- [ ] Irsaliye numarasi kayitli

---

## Adim 14: Giris Kalite Kontrolu — Prepreg Lot Sertifika Dogrulama
**Ekran:** Kalite > Muayene Kaydi > Yeni (Giris Muayene)
**API:** POST /Inspection
**Rol:** Kalite Muduru

**Veri:**

| Alan | Deger |
|------|-------|
| Muayene Tipi | Giris Muayene |
| Malzeme | Prepreg T700/2510 (LOT-T700-2026-0341) |
| Muayene Tarihi | 2026-04-25 |
| Muayene Eden | Kalite Muduru |

**Kontrol Edilecek Parametreler:**

| # | Parametre | Spesifikasyon | Olcum | Sonuc |
|---|-----------|---------------|-------|-------|
| 1 | Areal Weight | 190 ±10 g/m² | 192 g/m² | KABUL |
| 2 | Recine Icerigi | %35 ±3 | %34.2 | KABUL |
| 3 | Tg (Cam Gecis Sicakligi) | ≥180°C | 185°C | KABUL |
| 4 | Fiber Hacim Orani | %55 ±5 | %57 | KABUL |
| 5 | Kalan Raf Omru | ≥6 ay | 11.5 ay | KABUL |
| 6 | Soguk Zincir Indikatoru | Kirilmamis | OK | KABUL |
| 7 | Gorsel Kontrol | Kirisiklik/yirtik/nem yok | Temiz | KABUL |

**Sonuc:** KABUL — Lot kullanima uygundur.

> **KUPON TEST NOTU (Adim 15'te detaylandirilmistir):**
> CoA degerlerinin dogrulanmasi icin prepreg rulolarindan test kuponu kesilecektir.
> Cekme testi ASTM D3039, ILSS testi ASTM D2344 uygulanacaktir.

**Dogrulama:**
- [ ] Giris muayene kaydi olusturuldu (201 Created)
- [ ] 7 parametre girildi ve hepsi KABUL
- [ ] Lot numarasi muayene kaydiyla eslesti
- [ ] Lot sertifikasi (CoA) dosya eki olarak yuklendi
- [ ] Genel sonuc KABUL olarak isaretlendi
- [ ] Malzeme kullanima serbest birakildi

---

## Adim 15: Kupon Testi — Cekme Testi (ASTM D3039)
**Ekran:** Kalite > Muayene Kaydi > Yeni (Kupon Test)
**API:** POST /Inspection
**Rol:** Kalite Muduru

**Veri:**

| Alan | Deger |
|------|-------|
| Muayene Tipi | Kupon Test |
| Malzeme | Prepreg T700/2510 (LOT-T700-2026-0341) |
| Test Standardi | ASTM D3039 — Cekme Testi |
| Numune Sayisi | 5 adet (250×25×3mm) |
| Muayene Tarihi | 2026-04-26 |

**Test Sonuclari:**

| Numune | Cekme Dayanimi (MPa) | Elastisite Modulu (GPa) | Kopma Uzamasi (%) | Sonuc |
|--------|---------------------|------------------------|-------------------|-------|
| K1 | 2,150 | 135 | 1.58 | KABUL |
| K2 | 2,180 | 137 | 1.61 | KABUL |
| K3 | 2,095 | 133 | 1.52 | KABUL |
| K4 | 2,210 | 138 | 1.63 | KABUL |
| K5 | 2,140 | 134 | 1.55 | KABUL |
| **Ort.** | **2,155** | **135.4** | **1.578** | **KABUL** |

**Kabul Kriteri:**
- Cekme dayanimi: ≥2,000 MPa (ortalama), ≥1,800 MPa (minimum) → KABUL
- Elastisite modulu: 130-145 GPa → KABUL
- Kopma uzamasi: ≥1.3% → KABUL

**Dogrulama:**
- [ ] Kupon test muayene kaydi olusturuldu (201 Created)
- [ ] 5 numune sonucu girildi
- [ ] Ortalama cekme dayanimi 2,155 MPa (≥2,000 MPa) → KABUL
- [ ] ASTM D3039 referansi kayitli
- [ ] Test raporu PDF dosya eki olarak yuklendi
- [ ] Lot durumu "Kalite Onayli" olarak guncellendi

---

# ══════════════════════════════════════════════════════════════
# BOLUM 5: URETIM — CLEAN ROOM KONTROLU ve IS EMRI
# ══════════════════════════════════════════════════════════════

## Adim 16: Clean Room Ortam Kontrolu (Uretim Oncesi)
**Ekran:** Kalite > Muayene Kaydi > Yeni (Ortam Kontrolu)
**API:** POST /Inspection
**Rol:** Kalite Muduru
**Kisitlama:** K5 — Clean room ortam logu yok, muayene kaydi olarak girilir.

**Veri:**

| Alan | Deger |
|------|-------|
| Muayene Tipi | Ortam Kontrolu |
| Lokasyon | Clean Room (DP02) |
| Muayene Tarihi | 2026-04-28 08:00 |
| Muayene Eden | Kalite Muduru |

**Olcum Degerleri:**

| # | Parametre | Spesifikasyon | Olcum | Sonuc |
|---|-----------|---------------|-------|-------|
| 1 | Sicaklik | 22 ±3°C | 21.5°C | KABUL |
| 2 | Bagil Nem | <%60 | %48 | KABUL |
| 3 | Partikul Sayimi | Sinif 100.000 | 87.500 partikul/ft³ | KABUL |
| 4 | Diferansiyel Basinc | >0.02 inH₂O (pozitif) | 0.035 inH₂O | KABUL |

**Sonuc:** KABUL — Clean room uretim icin uygun.

> **ONEMLI:** Clean room ortam degerleri vardiya basinda ve sonunda kontrol edilmeli.
> Sicaklik 22±3°C veya nem ≥%60 olursa uretim DURDURULUR.
> Prepreg neme maruz kalirsa mekanik ozellikler bozulur (delaminasyon riski).

**Dogrulama:**
- [ ] Ortam kontrolu muayene kaydi olusturuldu (201 Created)
- [ ] 4 parametre girildi, hepsi KABUL
- [ ] Sicaklik ve nem degerleri spesifikasyon icinde
- [ ] Clean room uretim icin uygun onay verildi

---

## Adim 17: Prepreg Out-Time Kaydi (Sogutucu Depodan Cikis)
**Ekran:** Depo > Stok Hareketi / Urun Detay > Notlar
**API:** POST /StockMovement + lot notu guncelleme
**Rol:** Depocu
**Kisitlama:** K1 — Out-time otomatik takip yok, lot notuna yazilir.

**Islem:**
1. Prepreg rulosu (LOT-T700-2026-0341, Rulo-1) Sogutucu Depodan (DP01) cikartilir
2. Clean Room (DP02) deposuna transfer edilir
3. Lot notuna out-time kaydi eklenir

**Veri:**

| Alan | Deger |
|------|-------|
| Kaynak Depo | Sogutucu Depo (DP01) |
| Hedef Depo | Clean Room (DP02) |
| Malzeme | Prepreg T700/2510 (LOT-T700-2026-0341, Rulo-1) |
| Miktar | 30 m² |
| Lot Notu Ekleme | "OUT-START: 2026-04-28 08:15 — Rulo-1 oda sicakligina cikarildi. Kumulatif out-time: 0 saat. Max: 720 saat (30 gun)." |

> **OUT-TIME HESAPLAMA:**
> Kumulatif oda suresi = Onceki out-time + mevcut seans.
> Her iade/cikista guncellenir. 720 saati (30 gun) gecerse → RED.
> Ornek: Bugun 8 saat kullanilip iade → Kumulatif: 8 saat.
> Yarin 10 saat daha → Kumulatif: 18 saat. vs.

**Dogrulama:**
- [ ] Depo transfer islemi tamamlandi
- [ ] Sogutucu Depo stoku 30 m² azaldi
- [ ] Clean Room stoku 30 m² artti
- [ ] Lot notunda out-time baslangic zamani kayitli
- [ ] Transfer hareketi stok gecmisinde gorunuyor

---

## Adim 18: Is Emri Olusturma — CFRP Panel Lay-Up (Serim)
**Ekran:** Uretim > Is Emirleri > Yeni Is Emri
**API:** POST /WorkOrder
**Rol:** Uretim Muduru

**Veri:**

| Alan | Deger |
|------|-------|
| Is Emri No | IE-2026-0078 |
| Siparis Referansi | TAI-PO-2026-1187 |
| Urun | CFRP Govde Paneli (KKH-CFRP-001) |
| Miktar | 5 Adet (ilk parti) |
| Baslangic Tarihi | 2026-04-28 |
| Bitis Tarihi | 2026-05-02 |
| Oncelik | Yuksek |
| Aciklama | ANKA IHA govde paneli. 8 kat T700/2510 prepreg, [0/+45/-45/90]s simetrik lay-up. Clean room ortaminda serim. Otoklav kurleme: 177°C/120dk/85psi. TAI FAI zorunlu (ilk parca). |

**Dogrulama:**
- [ ] Is emri olusturuldu (201 Created)
- [ ] Siparis referansi bagli
- [ ] Miktar 5 adet
- [ ] Is emri listesinde gorunuyor
- [ ] Baslangic/bitis tarihleri dogru

---

## Adim 19: Operasyon Tanimlari — Lay-Up (Serim) Sureci
**Ekran:** Uretim > Is Emri Detay > Operasyonlar
**API:** POST /WorkOrderOperation (9 adet)
**Rol:** Uretim Muduru
**Kisitlama:** K2 — Fiber oryantasyon alani yok, operasyon notuna yazilir.
**Kisitlama:** K6 — Ply-by-ply izlenebilirlik operasyon notu ile saglanir.

**Operasyonlar:**

| Sira | Op No | Operasyon Adi | Makine | Tahmini Sure | Not |
|------|-------|---------------|--------|-------------|-----|
| 1 | Op10 | Kalip Hazirlik —離型 (Release Agent) | — | 30 dk | Frekeote/離型 ayirici uygulama. 3 kat frekote + kuruma suresi. Kalip yuzey temizligi kontrol. |
| 2 | Op20 | 1. Kat Serim (0°) | — | 20 dk | Oryantasyon: 0° (uzunlamasina). Prepreg rulo segmenti: Rulo-1, 0.26 m² (fire dahil). Hava kabarcigi kontrolu. |
| 3 | Op30 | 2. Kat Serim (+45°) | — | 25 dk | Oryantasyon: +45°. Katlararasi hava alma (hand roller). Onceki kata tam yapismis olmali. |
| 4 | Op40 | 3. Kat Serim (-45°) | — | 25 dk | Oryantasyon: -45°. Simetrik lay-up'in alt yarisi tamamlaniyor. |
| 5 | Op50 | 4. Kat Serim (90°) | — | 25 dk | Oryantasyon: 90° (enine). Orta duzlem. Debulk oncesi son kat. |
| 6 | Op60 | 5-8. Kat Serim (Simetrik) | — | 60 dk | Simetri: [90/-45/+45/0]. 4 kat daha. Her 2 katta bir debulk. Toplam 8 kat tamamlandi. |
| 7 | Op70 | Film Yapistiricisi Uygulama | — | 15 dk | FM300-2K film yapistiricisi. Panel kenarlarina uygulama (gerekirse). |
| 8 | Op80 | Vakum Torba Hazirlama | — | 30 dk | Peel ply → breather → vakum torba → sealant bant. Vakum portlari yerlestirildi. |
| 9 | Op90 | Debulk (On Vakum) | — | 45 dk | Vakum: ≥-0.90 bar (≤100 mbar mutlak). 15 dk/kat arasi uygulandi. Son debulk: 30 dk. Vakum sizdimazlik testi: 5 dk'da ≤25 mbar dusus. |

> **LAY-UP SIRALAMASI [0/+45/-45/90]s:**
> ```
> Kat 1: 0°   (alt yuzey, kalip tarafi)
> Kat 2: +45°
> Kat 3: -45°
> Kat 4: 90°  (orta duzlem — simetri ekseni)
> Kat 5: 90°  (simetrik tekrar baslar)
> Kat 6: -45°
> Kat 7: +45°
> Kat 8: 0°   (ust yuzey)
> ```
> Bu quasi-izotropik lay-up IHA govdesi icin en yaygin konfigurasyondur.
> Her yonde esit mukavemet saglar.

**Dogrulama:**
- [ ] 9 operasyon olusturuldu
- [ ] Operasyon siralari dogru (Op10 → Op90)
- [ ] Her operasyonda oryantasyon bilgisi notta mevcut (K2 workaround)
- [ ] Tahmini sureler toplamda ~275 dk (~4.5 saat)
- [ ] Vakum degerleri Op90 notunda belirtilmis

---

## Adim 20: Operasyon Tanimlari — Otoklav Kurleme
**Ekran:** Uretim > Is Emri Detay > Operasyonlar (devam)
**API:** POST /WorkOrderOperation (3 adet)
**Rol:** Uretim Muduru
**Kisitlama:** K3 — Otoklav egrisi otomatik kayit yok, PDF eki yuklenir.

**Operasyonlar:**

| Sira | Op No | Operasyon Adi | Makine | Tahmini Sure | Not |
|------|-------|---------------|--------|-------------|-----|
| 10 | Op100 | Otoklav Yukleme + Termocouple | Otoklav-01 | 45 dk | Panel+kalip otoklava yerlestirildi. 3 adet termocouple takildi (panel merkezi, kenar, kalip). Vakum hatti baglanildi. Otoklav kapagi kapatildi. |
| 11 | Op110 | Otoklav Kurleme Dongusu | Otoklav-01 | 300 dk | KURE PROGRAMI: Rampa 2°C/dk → 177°C → 120 dk hold → Sogutma 2°C/dk. Basinc: 85 psi (5.9 bar). Vakum: surekli -0.90 bar. Termocouple okuma: her 5 dk kayit. |
| 12 | Op120 | Kontrollü Sogutma + Bosaltma | Otoklav-01 | 90 dk | Sogutma: 2°C/dk (max 3°C/dk). 60°C altina dusunce basinc bosaltma. Kaliptan cikarma sicakligi: ≤40°C. |

> **OTOKLAV KURE DONGUSU PROFILI:**
> ```
> Sicaklik (°C)
>   200 |
>   177 |............__________.............   ← 120 dk hold
>       |       /                  \
>   100 |     /                      \
>       |   / 2°C/dk                   \ 2°C/dk
>    22 |__/                              \___
>       |----------------------------------------→ Zaman
>         0    80   100  220  240    320  435 dk
>
> Basinc: 85 psi (rampa ile birlikte baslar, sogutma sonuna kadar)
> Vakum: -0.90 bar (surekli, kure boyunca)
> ```

**Dogrulama:**
- [ ] 3 otoklav operasyonu olusturuldu
- [ ] Makine: Otoklav-01 atandi
- [ ] Kurleme parametreleri notlarda mevcut (177°C/120dk/85psi)
- [ ] Sogutma hizi notu var (2°C/dk)
- [ ] Toplam otoklav suresi ~435 dk (~7.25 saat)

---

## Adim 21: Operasyon Tanimlari — Son Islemler
**Ekran:** Uretim > Is Emri Detay > Operasyonlar (devam)
**API:** POST /WorkOrderOperation (5 adet)
**Rol:** Uretim Muduru
**Kisitlama:** K4 — C-scan goruntusu dosya eki olarak yuklenir.

**Operasyonlar:**

| Sira | Op No | Operasyon Adi | Makine | Tahmini Sure | Not |
|------|-------|---------------|--------|-------------|-----|
| 13 | Op130 | Kaliptan Cikarma + Gorsel Kontrol | — | 30 dk |离型 etkisi ile dikkatli cikarma. Gorsel kontrol: catlak, delaminasyon, recine akmasi, yuzey hatasi. Kabul/Red formu doldur. |
| 14 | Op140 | Ultrasonik NDT (C-Scan) | NDT C-Scan | 60 dk | Delaminasyon, porozite, dahili bosluk kontrolu. Kabul: porozite <%2, delaminasyon yok. C-scan goruntusu PNG olarak kaydet ve dosya eki yukle. |
| 15 | Op150 | Trim/Drill (CNC Kenar Kesim) | CNC-Trim-01 | 45 dk | Net boyuta kenar kesim (600×400mm ±0.2mm). Delik delme (montaj delikleri). Elmas kapli takimlar kullanimi zorunlu. Toz emme aktif. |
| 16 | Op160 | Boyutsal Kontrol (CMM) | CMM | 30 dk | CMM ile boyut dogrulama: 600±0.2mm × 400±0.2mm × 3±0.15mm. Delik pozisyonlari: ±0.1mm. Duzluk: ≤0.5mm/m. |
| 17 | Op170 | Agirlik Kontrolu | Terazi | 10 dk | Panel net agirlik: 1.44 ±0.05 kg. Tolerans asimi → recine fazlaligi veya fiber hacim orani sorunu. |

**Dogrulama:**
- [ ] 5 son islem operasyonu olusturuldu
- [ ] NDT operasyonunda porozite limiti (%2) belirtilmis
- [ ] CNC makine atamasi dogru (CNC-Trim-01)
- [ ] CMM boyut toleranslari notlarda mevcut
- [ ] Agirlik toleransi (1.44 ±0.05 kg) kayitli

---

# ══════════════════════════════════════════════════════════════
# BOLUM 6: SHOPFLOOR — OPERASYON KAYITLARI
# ══════════════════════════════════════════════════════════════

## Adim 22: ShopFloor — Lay-Up Serim Kaydi (Operator)
**Ekran:** ShopFloor Terminal
**API:** POST /WorkOrderOperation/start, /WorkOrderOperation/complete
**Rol:** Operator
**Is Emri:** IE-2026-0078, Panel Seri No: KKH-CFRP-001-0001

**Islem — Op10 (Kalip Hazirlik):**
1. Operator ShopFloor ekranina giris yapar
2. Is emri IE-2026-0078 secilir
3. Op10 "Basla" butonuna basilir → Zamanlayici baslar
4. Kalip yuzey temizligi yapilir, 3 kat frekote uygulanir
5. Op10 "Tamamla" → Sure kaydedilir

**Operasyon Kayitlari (Op10-Op50):**

| Op | Baslangic | Bitis | Fiili Sure | Operator Notu |
|----|-----------|-------|-----------|---------------|
| Op10 | 08:30 | 09:05 | 35 dk | Kalip yuzey temiz. 3 kat Frekote 770-NC uygulanildi. 30 dk kuruma beklendi. |
| Op20 | 09:10 | 09:32 | 22 dk | 1. kat (0°) serim tamamlandi. Rulo-1 segment A. Hava kabarcigi yok. |
| Op30 | 09:35 | 10:02 | 27 dk | 2. kat (+45°) serim. Oryantasyon acisi sablon ile dogrulandi. |
| Op40 | 10:05 | 10:30 | 25 dk | 3. kat (-45°) serim. Katlararasi yapisma iyi. |
| Op50 | 10:35 | 11:02 | 27 dk | 4. kat (90°) serim. Orta duzlem tamamlandi. Debulk hazirligi. |

> **OPERATOR NOTU FORMATI (K2 + K6 Workaround):**
> Her serim operasyonunda asagidaki bilgiler not alanina yazilir:
> - Oryantasyon acisi (0°, +45°, -45°, 90°)
> - Prepreg rulo no ve segment referansi
> - Hava kabarcigi durumu
> - Katlararasi yapisma kontrolu

**Dogrulama:**
- [ ] Op10-Op50 baslangic/bitis kayitlari dogru
- [ ] Fiili sureler kaydedildi
- [ ] Operator notlari oryantasyon bilgisi iceriyor (K2 workaround)
- [ ] Her operasyon ShopFloor'da "Tamamlandi" durumunda
- [ ] Prepreg rulo referansi notlarda mevcut (K6 workaround)

---

## Adim 23: ShopFloor — Devam (Op60-Op90)
**Ekran:** ShopFloor Terminal
**API:** POST /WorkOrderOperation/start, /WorkOrderOperation/complete
**Rol:** Operator

**Operasyon Kayitlari:**

| Op | Baslangic | Bitis | Fiili Sure | Operator Notu |
|----|-----------|-------|-----------|---------------|
| Op60 | 11:10 | 12:15 | 65 dk | 5-8. katlar simetrik serim. [90/-45/+45/0] sirasi ile. Her 2 katta debulk uygulanildi (15 dk). Toplam 8 kat tamamlandi. |
| Op70 | 12:20 | 12:38 | 18 dk | FM300-2K film yapistiricisi panel kenarlarina uygulanildi. LOT-FM300-2026-0112. |
| Op80 | 13:00 | 13:35 | 35 dk | Peel ply + breather + vakum torba + sealant bant uygulanildi. 2 adet vakum portu yerlestirildi. |
| Op90 | 13:40 | 14:35 | 55 dk | Son debulk: Vakum uygulandi. Olcum: -0.92 bar (hedef: ≥-0.90 bar). Sizdimazlik testi: 5 dk'da 12 mbar dusus (limit: ≤25 mbar). KABUL. |

> **VAKUM SIZDIMAZLIK TESTI (K7 Workaround):**
> Op90 notuna asagidaki degerler kaydedilir:
> - Vakum degeri: -0.92 bar (100 mbar abs → 8 mbar abs mutlak)
> - 5 dakika test: 8 mbar → 20 mbar = 12 mbar dusus
> - Kabul kriteri: ≤25 mbar/5dk → KABUL
> Sizdimazlik basarisiz olursa → sealant bant yeniden uygulanir, tekrar test.

**Dogrulama:**
- [ ] Op60-Op90 kayitlari tamamlandi
- [ ] Simetrik lay-up sirasi notlarda dogru ([90/-45/+45/0])
- [ ] Film yapistiricisi lot numarasi kayitli (LOT-FM300-2026-0112)
- [ ] Vakum degeri ve sizdimazlik testi sonucu Op90 notunda (K7 workaround)
- [ ] Tum 9 serim operasyonu "Tamamlandi" durumunda

---

## Adim 24: ShopFloor — Otoklav Kurleme Kaydi
**Ekran:** ShopFloor Terminal
**API:** POST /WorkOrderOperation/start, /WorkOrderOperation/complete
**Rol:** Operator
**Kisitlama:** K3 — Cure cycle PDF eki yuklenir.

**Operasyon Kayitlari:**

| Op | Baslangic | Bitis | Fiili Sure | Operator Notu |
|----|-----------|-------|-----------|---------------|
| Op100 | 15:00 | 15:50 | 50 dk | Panel+kalip otoklava yuklendi. 3 termocouple takildi (TC1: merkez, TC2: kenar, TC3: kalip). Vakum hatti baglandi. Otoklav kapak mühürlendi. |
| Op110 | 16:00 | 23:00 | 420 dk | Cure cycle baslatildi. Rampa: 2.1°C/dk. Hold: 177°C'de 120 dk. Max TC farki: 5°C. Basinc: 85 psi stabil. Vakum: -0.91 bar surekli. PLC kaydi: CURE-2026-0078-A.pdf yuklendi. |
| Op120 | 23:00 | 00:35+1 | 95 dk | Sogutma: 1.8°C/dk (spec: max 3°C/dk). 60°C'de basinc bosaltildi. 38°C'de kaliptan cikarma yapildi. |

> **TERMOCOUPLE OKUMALARI (Ornek — Op110 notuna eklenir):**
> | Zaman | TC1 (°C) | TC2 (°C) | TC3 (°C) | Basinc (psi) | Vakum (bar) |
> |-------|----------|----------|----------|-------------|-------------|
> | 16:00 | 22 | 22 | 23 | 0 | -0.91 |
> | 16:40 | 100 | 98 | 99 | 85 | -0.91 |
> | 17:20 | 177 | 175 | 176 | 85 | -0.90 |
> | 17:25 | 177 | 177 | 177 | 85 | -0.91 |
> | 19:25 | 177 | 177 | 177 | 85 | -0.91 |
> | 20:00 | 150 | 148 | 149 | 85 | -0.90 |
> | 22:30 | 60 | 58 | 59 | 0 | -0.91 |
> | 00:35 | 38 | 37 | 38 | 0 | — |
>
> PLC cure cycle raporu PDF olarak is emrine eklenir (K3 workaround).

**Dogrulama:**
- [ ] Op100-Op120 kayitlari tamamlandi
- [ ] Otoklav makine atamasi dogru (Otoklav-01)
- [ ] Kurleme parametreleri notlarda kayitli (177°C/120dk/85psi)
- [ ] Termocouple okumalari kayitli (en az ozet)
- [ ] Sogutma hizi notu var (1.8°C/dk, spec dahilinde)
- [ ] PLC cure cycle PDF dosya eki yuklendi (K3 workaround)
- [ ] Kaliptan cikarma sicakligi 38°C (≤40°C limit)

---

## Adim 25: ShopFloor — Kaliptan Cikarma + Gorsel Kontrol
**Ekran:** ShopFloor Terminal
**API:** POST /WorkOrderOperation/complete
**Rol:** Operator + Kalite Muduru

**Op130 Kaydi:**

| Alan | Deger |
|------|-------|
| Baslangic | 2026-04-29 08:00 |
| Bitis | 2026-04-29 08:35 |
| Fiili Sure | 35 dk |
| Operator Notu | Kaliptan dikkatli cikarma.離型 etkisi iyi, yapisma yok. Gorsel kontrol: Yuzey duzgun, catlak yok, delaminasyon belirtisi yok, recine akmasi yok. Panel kenarlari temiz. Gorsel kontrol: KABUL. |

**Gorsel Kontrol Checklist:**

| # | Kontrol | Sonuc |
|---|---------|-------|
| 1 | Yuzey catlagi | YOK — KABUL |
| 2 | Delaminasyon belirtisi (beyazlama) | YOK — KABUL |
| 3 | Recine akmasi / recine zengin bolge | YOK — KABUL |
| 4 | Recine fakir bolge (kuru fiber gorunumu) | YOK — KABUL |
| 5 | Porozite (yuzey goz delikleri) | YOK — KABUL |
| 6 | Yabanci cisim kalintisi | YOK — KABUL |
| 7 | Kalip izi / kalip hasari | YOK — KABUL |
| 8 | Kenar durumu | Duzgun — trim'e hazir |

**Dogrulama:**
- [ ] Op130 tamamlandi
- [ ] Gorsel kontrol notu detayli
- [ ] 8 kontrol kalemi hepsi KABUL
- [ ] Kaliptan cikarma fotografi dosya eki olarak yuklenebilir

---

## Adim 26: NDT — Ultrasonik C-Scan Kontrolu
**Ekran:** Kalite > Muayene Kaydi > Yeni (NDT Muayene)
**API:** POST /Inspection
**Rol:** Kalite Muduru
**Kisitlama:** K4 — C-scan goruntusu dosya eki olarak yuklenir.

**Veri:**

| Alan | Deger |
|------|-------|
| Muayene Tipi | NDT — Ultrasonik C-Scan |
| Is Emri | IE-2026-0078 |
| Panel Seri No | KKH-CFRP-001-0001 |
| Muayene Tarihi | 2026-04-29 |
| Muayene Eden | Kalite Muduru (NDT Level II Sertifikali) |
| Cihaz | Olympus OmniScan MX2 |
| Prob | 5 MHz phased array, 64 element |

**NDT Sonuclari:**

| # | Parametre | Spesifikasyon | Olcum | Sonuc |
|---|-----------|---------------|-------|-------|
| 1 | Delaminasyon | Yok (≤6mm² izin verilen) | Yok | KABUL |
| 2 | Porozite | <%2 (hacimsel) | %0.8 | KABUL |
| 3 | Dahili Bosluk (Void) | ≤3mm tek, ≤6mm² toplam | 1.2mm tek | KABUL |
| 4 | Kalinlik Homojenliği | ±0.15mm | ±0.08mm | KABUL |
| 5 | Fiber/Recine Dagilimi | Homojen | Homojen | KABUL |

**Sonuc:** KABUL — Panel NDT kontrolu basarili, uretim akisina devam.

> **C-SCAN RAPORU:**
> C-scan goruntusu (renkli harita) PNG formatiyla kaydedilir:
> - Yesil: Saglam bolge (sinyal zayiflamasi <%6)
> - Sari: Dikkat bolgesi (%6-12 zayiflama)
> - Kirmizi: Red bolgesi (>%12 zayiflama, delaminasyon/porozite)
> Panel KKH-CFRP-001-0001: Tamamen yesil → KABUL

**Dogrulama:**
- [ ] NDT muayene kaydi olusturuldu (201 Created)
- [ ] 5 parametre girildi, hepsi KABUL
- [ ] Porozite %0.8 (<%2 limiti icinde)
- [ ] C-scan goruntusu PNG dosya eki yuklendi (K4 workaround)
- [ ] NDT operatoru Level II sertifika bilgisi kayitli
- [ ] Cihaz ve prob bilgileri notlarda mevcut

---

## Adim 27: ShopFloor — Trim/Drill ve Boyutsal Kontrol
**Ekran:** ShopFloor Terminal + Kalite
**API:** POST /WorkOrderOperation/complete + POST /Inspection
**Rol:** Operator (trim) + Kalite Muduru (CMM)

**Op150 — CNC Trim/Drill:**

| Alan | Deger |
|------|-------|
| Baslangic | 2026-04-29 13:00 |
| Bitis | 2026-04-29 13:48 |
| Fiili Sure | 48 dk |
| Makine | CNC-Trim-01 |
| Operator Notu | Elmas kapli takimla kenar kesim tamamlandi. 4 adet montaj deligi (Ø6.35mm) delindi. Toz emme aktif. Kenar delaminasyonu yok. CNC programi: ANKA-GP-TRIM-v2.nc |

**Op160 — CMM Boyutsal Kontrol:**

| # | Olcu | Nominal | Tolerans | Olcum | Sonuc |
|---|------|---------|----------|-------|-------|
| 1 | Uzunluk | 600 mm | ±0.2 mm | 599.92 mm | KABUL |
| 2 | Genislik | 400 mm | ±0.2 mm | 400.08 mm | KABUL |
| 3 | Kalinlik (merkez) | 3.00 mm | ±0.15 mm | 3.02 mm | KABUL |
| 4 | Kalinlik (kenar) | 3.00 mm | ±0.15 mm | 2.98 mm | KABUL |
| 5 | Delik 1 pozisyon X | 50.00 mm | ±0.1 mm | 50.04 mm | KABUL |
| 6 | Delik 1 pozisyon Y | 50.00 mm | ±0.1 mm | 49.97 mm | KABUL |
| 7 | Delik capi | 6.35 mm | ±0.05 mm | 6.37 mm | KABUL |
| 8 | Duzluk | — | ≤0.5 mm/m | 0.32 mm/m | KABUL |

**Op170 — Agirlik Kontrolu:**

| Alan | Deger |
|------|-------|
| Panel net agirlik | 1.43 kg |
| Tolerans | 1.44 ±0.05 kg (1.39 - 1.49 kg) |
| Sonuc | KABUL |

**Dogrulama:**
- [ ] Op150 (Trim) tamamlandi, kenar delaminasyonu yok
- [ ] Op160 (CMM) 8 olcu hepsi tolerans icinde
- [ ] Kalinlik homojen (3.02 vs 2.98 mm, fark 0.04 mm)
- [ ] Delik pozisyonlari ±0.1 mm icinde
- [ ] Duzluk 0.32 mm/m (≤0.5 limit)
- [ ] Agirlik 1.43 kg (tolerans icinde)
- [ ] CMM raporu dosya eki olarak yuklendi

---

# ══════════════════════════════════════════════════════════════
# BOLUM 7: KALITE — FAI, CoC, IZLENEBILIRLIK
# ══════════════════════════════════════════════════════════════

## Adim 28: Seri Numara Atama ve Izlenebilirlik
**Ekran:** Uretim > Seri Numara / Urun Detay
**API:** POST /SerialNumber
**Rol:** Kalite Muduru

**Veri — Panel Seri Numarasi:**

| Alan | Deger |
|------|-------|
| Urun | CFRP Govde Paneli (KKH-CFRP-001) |
| Seri No | KKH-CFRP-001-0001 |
| Is Emri | IE-2026-0078 |
| Uretim Tarihi | 2026-04-29 |

**Izlenebilirlik Zinciri (Genealogy):**

| Seviye | Kaynak | Referans | Aciklama |
|--------|--------|----------|----------|
| L1 — Hammadde | Prepreg T700/2510 | LOT-T700-2026-0341, Rulo-1 | Toray CoA mevcut |
| L1 — Hammadde | Film FM300-2K | LOT-FM300-2026-0112 | Cytec CoA mevcut |
| L2 — Giris Kalite | Kupon Test | ASTM D3039, 5 numune | Cekme: 2,155 MPa ort. |
| L3 — Uretim | Lay-up Operasyonlari | Op10-Op90 | 8 kat, [0/+45/-45/90]s |
| L3 — Uretim | Otoklav Kurleme | Op110 | 177°C/120dk/85psi, CURE-2026-0078-A.pdf |
| L4 — NDT | C-Scan | Olympus OmniScan | Porozite %0.8, delaminasyon yok |
| L5 — Son Kontrol | CMM Boyutsal | 8 olcu | Hepsi tolerans icinde |
| L5 — Son Kontrol | Agirlik | 1.43 kg | Tolerans icinde |

> **IZLENEBILIRLIK ONEM NOTU:**
> Savunma havacilik sektorunde izlenebilirlik kritiktir.
> Panel seri numarasindan geriye dogru:
> - Hangi lot prepreg kullanildi?
> - Hangi otoklav dongusuyle kurlendi?
> - NDT sonucu nedir?
> - Kim, ne zaman, hangi operasyonu yapti?
> Tum bu sorularin cevaplanabilmesi ZORUNLUDUR (AS9100 + NADCAP).

**Dogrulama:**
- [ ] Seri numara atandi (KKH-CFRP-001-0001)
- [ ] Is emri ile eslesti
- [ ] Prepreg lot numarasi izlenebilirlik zincirinde mevcut
- [ ] Otoklav cure referansi bagli
- [ ] NDT sonucu bagli
- [ ] CMM olcumleri bagli
- [ ] Izlenebilirlik zinciri eksiksiz (L1→L5)

---

## Adim 29: FAI — Ilk Madde Muayenesi (AS9102)
**Ekran:** Kalite > Son Muayene / FAI
**API:** POST /FinalInspection (FAI modu)
**Rol:** Kalite Muduru

**Veri:**

| Alan | Deger |
|------|-------|
| Muayene Tipi | FAI (Ilk Madde Muayenesi) — AS9102 |
| Is Emri | IE-2026-0078 |
| Urun | CFRP Govde Paneli (KKH-CFRP-001) |
| Seri No | KKH-CFRP-001-0001 |
| Referans Cizim | TAI-ANKA-GP-2024-001 Rev.B |
| Muayene Tarihi | 2026-04-30 |

**AS9102 Form 1 — Part Number Accountability:**

| Alan | Deger |
|------|-------|
| Part Number | KKH-CFRP-001 |
| Part Name | CFRP Govde Paneli — ANKA IHA |
| Drawing Number | TAI-ANKA-GP-2024-001 |
| Drawing Revision | B |
| Organization | Kartal Kompozit Havacilik San. A.S. |
| FAI Type | Ilk uretim (First Production) |

**AS9102 Form 2 — Material & Process:**

| # | Malzeme/Proses | Spesifikasyon | Sonuc |
|---|----------------|---------------|-------|
| 1 | Prepreg | Toray T700/2510, LOT-T700-2026-0341 | UYGUN |
| 2 | Film Yapistiricisi | Cytec FM300-2K, LOT-FM300-2026-0112 | UYGUN |
| 3 | Lay-up Prosesi | [0/+45/-45/90]s, 8 kat | UYGUN |
| 4 | Otoklav Kurleme | 177°C/120dk/85psi | UYGUN |
| 5 | NDT (C-Scan) | Porozite <%2, delaminasyon yok | UYGUN |
| 6 | Trim/Drill | CNC, elmas takimlar | UYGUN |

**AS9102 Form 3 — Characteristic Accountability (Boyutsal):**

| # | Karakteristik | Nominal | Tolerans | Olcum | Sonuc |
|---|--------------|---------|----------|-------|-------|
| 1 | Uzunluk | 600 mm | ±0.2 | 599.92 | KABUL |
| 2 | Genislik | 400 mm | ±0.2 | 400.08 | KABUL |
| 3 | Kalinlik | 3.00 mm | ±0.15 | 3.02 | KABUL |
| 4 | Delik capi | 6.35 mm | ±0.05 | 6.37 | KABUL |
| 5 | Delik pozisyon X | 50.00 mm | ±0.1 | 50.04 | KABUL |
| 6 | Delik pozisyon Y | 50.00 mm | ±0.1 | 49.97 | KABUL |
| 7 | Duzluk | — | ≤0.5 mm/m | 0.32 | KABUL |
| 8 | Net agirlik | 1.44 kg | ±0.05 | 1.43 | KABUL |
| 9 | Porozite | — | <%2 | %0.8 | KABUL |
| 10 | Cekme dayanimi | ≥2000 MPa | — | 2155 | KABUL |

**FAI Sonucu:** KABUL — Ilk parca tum gereksinimleri karsilamaktadir.

**Dogrulama:**
- [ ] FAI kaydi olusturuldu (201 Created)
- [ ] AS9102 Form 1 (Part Number) dolduruldu
- [ ] AS9102 Form 2 (Material & Process) 6 kalem UYGUN
- [ ] AS9102 Form 3 (Characteristics) 10 kalem KABUL
- [ ] Cizim referansi (TAI-ANKA-GP-2024-001 Rev.B) kayitli
- [ ] FAI raporu PDF olarak indirilebiliyor
- [ ] Seri no ile eslesme dogru

---

## Adim 30: CoC (Uygunluk Sertifikasi) Olusturma
**Ekran:** Kalite > CoC
**API:** POST /CertificateOfConformance
**Rol:** Kalite Muduru

**Veri:**

| Alan | Deger |
|------|-------|
| CoC No | COC-2026-0078-001 |
| Musteri | TAI |
| Siparis No | TAI-PO-2026-1187 |
| Urun | CFRP Govde Paneli (KKH-CFRP-001) |
| Seri Numaralari | KKH-CFRP-001-0001 ~ 0005 (5 adet) |
| Uretim Tarihi | 2026-04-28 ~ 2026-04-30 |
| Referans | TAI-ANKA-GP-2024-001 Rev.B |
| Beyan | Yukarida belirtilen parcalar, ilgili teknik cizim, spesifikasyon ve kalite gereksinimlerine uygun olarak uretilmistir. AS9100 Rev D ve NADCAP Composites kapsaminda tum prosesler uygulanmistir. |

**CoC Ekleri:**
1. FAI Raporu (AS9102 Form 1-3)
2. NDT C-Scan Raporu
3. CMM Boyutsal Rapor
4. Otoklav Cure Cycle Kaydı
5. Prepreg Lot Sertifikasi (CoA)
6. Kupon Test Raporu (ASTM D3039)

**Dogrulama:**
- [ ] CoC olusturuldu (201 Created)
- [ ] 5 seri numara listeye dahil
- [ ] Siparis referansi dogru (TAI-PO-2026-1187)
- [ ] Beyan metni uygun
- [ ] 6 ek dokuman referans verilmis
- [ ] CoC PDF indirilebiliyor
- [ ] Kalite Muduru imzasi/onay kaydi mevcut

---

# ══════════════════════════════════════════════════════════════
# BOLUM 8: PAKETLEME, SEVKIYAT, FATURA
# ══════════════════════════════════════════════════════════════

## Adim 31: Paketleme (Hasar Koruma)
**Ekran:** Depo > Sevkiyat Hazirlama
**Rol:** Depocu

**Paketleme Talimati:**

| # | Islem | Aciklama |
|---|-------|----------|
| 1 | Panel arasi seperator | PE foam (5mm) her panel arasina |
| 2 | Kenar koruma | Kose koruyucu profil (L-profil karton) |
| 3 | Nem koruma | Silica gel paketi (4 adet) + nem indikatoru karti |
| 4 | Vakum paket | Paneller PE torbaya konulup vakumlanir |
| 5 | Dis ambalaj | Ahsap sandik (ISPM-15 isil islem damgali) |
| 6 | Etiketleme | Seri no, miktar, agirlik, "KIRILACAK/FRAGILE", "YUKARI/THIS SIDE UP" |

> **ONEMLI:** CFRP paneller darbe hasarina karsi hassastir.
> Gozle gorunmeyen darbe hasari (BVID — Barely Visible Impact Damage)
> mekanik ozellikleri %50'ye kadar dusurur. Ozenli paketleme ZORUNLU.

**Dogrulama:**
- [ ] Paketleme talimati uygulanildi
- [ ] Nem koruma (silica gel + indikatoru) mevcut
- [ ] Dis ambalaj ISPM-15 uyumlu
- [ ] Etiketleme eksiksiz

---

## Adim 32: Sevkiyat (Irsaliye)
**Ekran:** Depo > Sevkiyat > Yeni Irsaliye
**API:** POST /Shipment (veya irsaliye endpoint'i)
**Rol:** Depocu / Admin

**Veri:**

| Alan | Deger |
|------|-------|
| Musteri | TAI |
| Siparis Referansi | TAI-PO-2026-1187 |
| Irsaliye No | IRS-2026-0042 |
| Sevkiyat Tarihi | 2026-05-02 |
| Teslimat Adresi | TAI Tesisleri, Fethiye Mah. Havacilik Bulvari No:17, Kahramankazan / Ankara |
| Tasiyici | Ozel kurye (havacilik parcasi tasimacilik sertifikali) |

**Sevkiyat Kalemleri:**

| # | Urun | Seri No Araligi | Miktar | Aciklama |
|---|------|-----------------|--------|----------|
| 1 | CFRP Govde Paneli | KKH-CFRP-001-0001 ~ 0005 | 5 Adet | Ilk parti teslimat |

**Sevkiyat Belgeleri:**
1. Irsaliye (IRS-2026-0042)
2. CoC (COC-2026-0078-001)
3. FAI Raporu (ilk parti icin)
4. NDT Raporlari (5 panel)
5. Prepreg Lot Sertifikalari
6. Data Pack (tum izlenebilirlik dokumanlari)

**Dogrulama:**
- [ ] Irsaliye olusturuldu
- [ ] 5 adet CFRP panel sevk edildi
- [ ] Seri numaralari irsaliyede listelendi
- [ ] Stoktan 5 adet dustu
- [ ] 6 belge sevkiyat paketinde mevcut
- [ ] Siparis durumu "Kismi Teslim" (50'de 5 teslim edildi)

---

## Adim 33: Fatura Olusturma
**Ekran:** Finans > Faturalar > Yeni Fatura
**API:** POST /Invoice
**Rol:** Muhasebeci

**Veri:**

| Alan | Deger |
|------|-------|
| Musteri | TAI |
| Fatura No | FTR-2026-0042 |
| Fatura Tarihi | 2026-05-02 |
| Irsaliye Referansi | IRS-2026-0042 |
| Siparis Referansi | TAI-PO-2026-1187 |

**Fatura Kalemleri:**

| # | Urun | Miktar | Birim Fiyat | Tutar |
|---|------|--------|-------------|-------|
| 1 | CFRP Govde Paneli (KKH-CFRP-001) | 5 Adet | 4,250.00 TL | 21,250.00 TL |

| | Tutar |
|---|-------|
| Ara Toplam | 21,250.00 TL |
| KDV (%20) | 4,250.00 TL |
| Genel Toplam | 25,500.00 TL |

**Dogrulama:**
- [ ] Fatura olusturuldu (201 Created)
- [ ] 5 adet × 4,250.00 TL = 21,250.00 TL dogru
- [ ] KDV %20 hesaplamasi dogru (4,250.00 TL)
- [ ] Toplam 25,500.00 TL
- [ ] Irsaliye ve siparis referanslari bagli
- [ ] Fatura PDF indirilebiliyor

---

## Adim 34: Odeme Kaydi
**Ekran:** Finans > Odemeler > Yeni Odeme
**API:** POST /Payment
**Rol:** Muhasebeci

**Veri:**

| Alan | Deger |
|------|-------|
| Musteri | TAI |
| Fatura Referansi | FTR-2026-0042 |
| Odeme Tarihi | 2026-05-30 |
| Odeme Tutari | 25,500.00 TL |
| Odeme Yontemi | Banka Havale / EFT |
| Banka | Ziraat Bankasi |
| Aciklama | TAI-PO-2026-1187, IRS-2026-0042 referansli odeme. |

**Dogrulama:**
- [ ] Odeme kaydi olusturuldu (201 Created)
- [ ] Odeme tutari fatura ile esit (25,500.00 TL)
- [ ] Fatura durumu "Odendi" olarak guncellendi
- [ ] Odeme yontemi ve banka bilgisi kayitli
- [ ] Musteri cari bakiye sifirlandi

---

# ══════════════════════════════════════════════════════════════
# BOLUM 9: MALIYET ANALIZI ve FIRE TAKIBI
# ══════════════════════════════════════════════════════════════

## Adim 35: Maliyet Analizi — CFRP Panel Birim Maliyet
**Ekran:** Raporlar > Maliyet Analizi / Is Emri Maliyet
**API:** GET /WorkOrder/{id}/cost (veya maliyet rapor endpoint'i)
**Rol:** Uretim Muduru

**Beklenen Maliyet Tablosu (1 Adet CFRP Panel):**

| # | Kalem | Miktar | Birim Fiyat | Maliyet | Oran |
|---|-------|--------|-------------|---------|------|
| 1 | Prepreg T700/2510 | 2.15 m² | 385.00 TL/m² | 827.75 TL | %46.8 |
| 2 | Film FM300-2K | 0.25 m² | 520.00 TL/m² | 130.00 TL | %7.3 |
| 3 | Peel Ply | 0.55 m² | 18.50 TL/m² | 10.18 TL | %0.6 |
| 4 | Vakum Torba | 0.92 m² | 12.00 TL/m² | 11.04 TL | %0.6 |
| 5 | Sealant Bant | 2.64 m | 8.00 TL/m | 21.12 TL | %1.2 |
| 6 | Breather | 0.55 m² | 22.00 TL/m² | 12.10 TL | %0.7 |
| 7 | Iscilik (Lay-up) | 4.5 saat | 120.00 TL/saat | 540.00 TL | %30.5 |
| 8 | Iscilik (Otoklav) | 1.5 saat | 100.00 TL/saat | 150.00 TL | %8.5 |
| 9 | Iscilik (Trim+Kontrol) | 0.5 saat | 100.00 TL/saat | 50.00 TL | %2.8 |
| 10 | Enerji (Otoklav) | 7.25 saat | 3.50 TL/saat | 17.68 TL | %1.0 |
| | **TOPLAM** | | | **1,769.87 TL** | **%100** |

> **MALIYET ANALIZI NOTLARI:**
> - Prepreg maliyeti toplamın %46.8'ini olusturuyor → fire minimizasyonu KRITIK
> - Satis fiyati: 4,250.00 TL → Brut kar: 2,480.13 TL → Brut kar marji: %58.4
> - Genel giderler (kira, amortisman, kalite lab, NDT cihaz) dahil degildir
> - Genel gider dahil tahmini net kar marji: ~%30-35
>
> **FIRE MINIMIZASYON STRATEJISI:**
> - Nesting optimizasyonu: Birden fazla paneli ayni ruloya yerlestir
> - Prepreg fire orani hedefi: ≤%10 (mevcut: %12)
> - Kenar payi azaltma: Kalip tasarimini optimize et
> - Scrap prepreg: Kupon testi numunesi olarak degerlendir

**Dogrulama:**
- [ ] Maliyet raporu is emrinden goruntulenebiliyor
- [ ] Malzeme maliyetleri BOM ile uyumlu
- [ ] Iscilik maliyetleri operasyon sureleriyle uyumlu
- [ ] Prepreg maliyet orani ~%47 (en yuksek kalem)
- [ ] Birim maliyet vs satis fiyati karsilastirmasi yapilabiliyor
- [ ] Fire orani (%12) raporlaniyor

---

## Adim 36: Prepreg Out-Time Iade Kaydi (Kullanim Sonrasi)
**Ekran:** Depo > Stok Hareketi
**API:** POST /StockMovement
**Rol:** Depocu
**Kisitlama:** K1 — Out-time notu guncellenir.

**Islem:**
1. Kullanilmayan prepreg Clean Room'dan Sogutucu Depoya iade edilir
2. Lot notuna out-time kapanisi eklenir

**Veri:**

| Alan | Deger |
|------|-------|
| Kaynak Depo | Clean Room (DP02) |
| Hedef Depo | Sogutucu Depo (DP01) |
| Malzeme | Prepreg T700/2510 (LOT-T700-2026-0341, Rulo-1) |
| Iade Miktar | 19.25 m² (30 - 10.75 kullanilan) |
| Lot Notu Guncelleme | "OUT-END: 2026-04-29 16:00 — Rulo-1 sogutucu depoya iade. Bu seans: 2026-04-28 08:15 → 2026-04-29 16:00 = 31.75 saat. KUMULATIF OUT-TIME: 31.75 saat / 720 saat max. KALAN: 688.25 saat." |

> **STOK DURUMU (5 panel uretimi sonrasi):**
> - Prepreg kullanilan: 5 × 2.15 = 10.75 m² (fire dahil)
> - Prepreg kalan (Sogutucu Depo): 120 - 10.75 = 109.25 m²
> - Film kullanilan: 5 × 0.25 = 1.25 m²
> - Film kalan: 15 - 1.25 = 13.75 m²

**Dogrulama:**
- [ ] Depo transferi (iade) tamamlandi
- [ ] Clean Room stoku azaldi
- [ ] Sogutucu Depo stoku artti
- [ ] Lot notunda kumulatif out-time guncellendi (31.75 saat)
- [ ] Kalan out-time hesabi dogru (688.25 saat)
- [ ] Prepreg kalan stok: 109.25 m²

---

# ══════════════════════════════════════════════════════════════
# BOLUM 10: ROL BAZLI TEST SENARYOLARI
# ══════════════════════════════════════════════════════════════

## Adim 37: Rol Bazli Yetki Testi — Kalite Muduru
**Ekran:** Cesitli
**Rol:** Kalite Muduru (admin@quvex.com ile degil, kalite.muduru@quvex.com ile giris)

**Erisim Kontrolu:**

| # | Islem | Beklenen Sonuc |
|---|-------|----------------|
| 1 | Muayene kaydi olusturma (NDT, kupon, ortam) | ERISIM VAR |
| 2 | FAI kaydi olusturma | ERISIM VAR |
| 3 | CoC olusturma | ERISIM VAR |
| 4 | C-scan goruntusu yukleme | ERISIM VAR |
| 5 | Seri numara atama | ERISIM VAR |
| 6 | Is emri olusturma | ERISIM YOK (sadece goruntuleyebilir) |
| 7 | Fatura olusturma | ERISIM YOK |
| 8 | Satin alma olusturma | ERISIM YOK |
| 9 | Musteri silme | ERISIM YOK |

**Dogrulama:**
- [ ] Kalite Muduru kalite islemlerini yapabiliyor
- [ ] Kalite Muduru is emri olusturamaz (403 Forbidden)
- [ ] Kalite Muduru fatura olusturamaz
- [ ] Yetki hata mesaji "Yetkiniz bulunmamaktadir" seklinde gorunuyor

---

## Adim 38: Rol Bazli Yetki Testi — Uretim Muduru
**Ekran:** Cesitli
**Rol:** Uretim Muduru (uretim.muduru@quvex.com)

**Erisim Kontrolu:**

| # | Islem | Beklenen Sonuc |
|---|-------|----------------|
| 1 | Is emri olusturma | ERISIM VAR |
| 2 | Operasyon tanimi | ERISIM VAR |
| 3 | BOM/Recete olusturma | ERISIM VAR |
| 4 | Makine atama | ERISIM VAR |
| 5 | Uretim planlama | ERISIM VAR |
| 6 | Maliyet raporu goruntuleme | ERISIM VAR |
| 7 | FAI onaylama | ERISIM YOK (sadece goruntuleyebilir) |
| 8 | CoC olusturma | ERISIM YOK |
| 9 | Odeme kaydi | ERISIM YOK |

**Dogrulama:**
- [ ] Uretim Muduru uretim islemlerini yapabiliyor
- [ ] Uretim Muduru FAI onaylayamaz
- [ ] Uretim Muduru odeme kaydi olusturamaz

---

## Adim 39: Rol Bazli Yetki Testi — Operator (ShopFloor)
**Ekran:** ShopFloor Terminal
**Rol:** Operator (operator@quvex.com)

**Erisim Kontrolu:**

| # | Islem | Beklenen Sonuc |
|---|-------|----------------|
| 1 | ShopFloor'da is emri goruntuleme | ERISIM VAR |
| 2 | Operasyon baslatma/tamamlama | ERISIM VAR |
| 3 | Operasyon notu ekleme (oryantasyon, vakum degeri) | ERISIM VAR |
| 4 | Dosya eki yukleme (cure cycle PDF) | ERISIM VAR |
| 5 | Is emri olusturma | ERISIM YOK |
| 6 | Is emri silme | ERISIM YOK |
| 7 | Musteri bilgilerini goruntuleme | ERISIM YOK |
| 8 | Fiyat bilgilerini goruntuleme | ERISIM YOK |
| 9 | Stok transferi yapma | ERISIM YOK |

**Dogrulama:**
- [ ] Operator sadece ShopFloor islemlerini yapabiliyor
- [ ] Operator is emri olusturamaz/silemez
- [ ] Operator musteri ve fiyat bilgilerini goremez
- [ ] ShopFloor'da serim ve otoklav operasyonlari listelenebiliyor

---

# ══════════════════════════════════════════════════════════════
# BOLUM 11: RED SENARYOSU (NEGATIF TEST)
# ══════════════════════════════════════════════════════════════

## Adim 40: Red Senaryosu — NDT'de Delaminasyon Tespit Edilmesi
**Ekran:** Kalite > Muayene Kaydi
**API:** POST /Inspection
**Rol:** Kalite Muduru

**Senaryo:**
Ikinci partiden bir panel (KKH-CFRP-001-0008) NDT C-scan kontrolunde
delaminasyon tespit ediliyor.

**NDT Sonuclari (RED):**

| # | Parametre | Spesifikasyon | Olcum | Sonuc |
|---|-----------|---------------|-------|-------|
| 1 | Delaminasyon | Yok (≤6mm²) | 22mm² bolge tespit | **RED** |
| 2 | Porozite | <%2 | %1.2 | KABUL |
| 3 | Dahili Bosluk | ≤3mm | 1.5mm | KABUL |

**Sonuc:** RED — Delaminasyon tespit edildi (22mm² > 6mm² limit).

**Red Sonrasi Akis:**

| Adim | Islem | Aciklama |
|------|-------|----------|
| 1 | Red kaydi olustur | Muayene sonucu: RED. Sebep: Delaminasyon 22mm². |
| 2 | MRB (Material Review Board) toplantisi | Kalite + Uretim + Muhendislik karar verir. |
| 3 | Karar: Hurda | Panel kurtarilamaz, hurda olarak ayrilir. |
| 4 | Kok neden analizi | Olasi sebepler: Yetersiz debulk, vakum kaçağı, kirlilik. |
| 5 | Duzeltici faaliyet | Debulk suresini artir (15→20 dk/kat). Vakum test kriterini sikistir. |
| 6 | Yeniden uretim | Yedek panel uretimi is emri acilir. |

> **KOK NEDEN ANALIZI (5 Neden):**
> 1. Neden delaminasyon olustu? → Katlar arasi hava kaldi.
> 2. Neden hava kaldi? → Debulk yetersiz.
> 3. Neden debulk yetersiz? → 15 dk/kat yeterli olmadi (kalinlik artisi).
> 4. Neden sure yetmedi? → 8. kat sonrasi toplam kalinlik artti, difuzyon yolu uzadi.
> 5. Neden onceden farkedilmedi? → Proses parametresi 4 kata gore ayarlanmisti.
>
> **DUZELTICI FAALIYET:** Debulk suresini 20 dk/kat olarak guncelle (Op90 revizyon).

**Dogrulama:**
- [ ] NDT muayene RED olarak kaydedildi
- [ ] Red sebebi "Delaminasyon 22mm²" olarak not edildi
- [ ] MRB kaydi olusturuldu
- [ ] MRB karari: Hurda
- [ ] Duzeltici faaliyet kaydi acildi
- [ ] Panel KKH-CFRP-001-0008 "Hurda" durumuna alindi
- [ ] Yedek uretim is emri acildi
- [ ] Stoktan 1 adet hurda olarak dustu

---

# ══════════════════════════════════════════════════════════════
# BOLUM 12: PREPREG RAF OMRU SENARYOSU (NEGATIF TEST)
# ══════════════════════════════════════════════════════════════

## Adim 41 (Bonus): Out-Time Asimi Senaryosu
**Ekran:** Depo > Stok / Urun Notu
**Rol:** Kalite Muduru + Depocu
**Kisitlama:** K1 — Manuel takip

**Senaryo:**
Bir prepreg rulosu (LOT-T700-2026-0341, Rulo-3) farkli projelerde
tekrar tekrar oda sicakligina cikarilmistir. Kumulatif out-time 720 saati asmistir.

**Out-Time Gecmisi:**

| # | Cikis Tarihi | Iade Tarihi | Seans Suresi | Kumulatif |
|---|-------------|-------------|-------------|-----------|
| 1 | 2026-04-28 08:15 | 2026-04-29 16:00 | 31.75 saat | 31.75 saat |
| 2 | 2026-05-05 09:00 | 2026-05-07 17:00 | 56.00 saat | 87.75 saat |
| 3 | 2026-05-12 08:00 | 2026-05-19 18:00 | 178.00 saat | 265.75 saat |
| 4 | 2026-05-26 07:30 | 2026-06-15 17:30 | 490.00 saat | **755.75 saat** |

**755.75 saat > 720 saat limit → MALZEME KULLANIMA UYGUN DEGILDIR.**

**Akis:**

| Adim | Islem |
|------|-------|
| 1 | Kalite Muduru lot notunu kontrol eder |
| 2 | Kumulatif out-time limitin uzerinde: 755.75 > 720 saat |
| 3 | Malzeme "KULLANILMAZ — Out-Time Asimi" olarak isaretlenir |
| 4 | MRB'ye bildirim: Hurda veya tedarikci iade karari |
| 5 | Stoktan dusme islemi yapilir |

**Dogrulama:**
- [ ] Out-time asimi tespit edildi (lot notu uzerinden)
- [ ] Malzeme "Kullanilmaz" olarak isaretlendi
- [ ] MRB kaydi olusturuldu
- [ ] Stoktan dusme (hurda) islemi yapildi
- [ ] Yeni prepreg satin alma talebi acildi

---

# ══════════════════════════════════════════════════════════════
# SONUC ve OZET
# ══════════════════════════════════════════════════════════════

## Test Ozet Tablosu

| Bolum | Adim Araligi | Konu | Adim Sayisi |
|-------|-------------|------|-------------|
| 1 — Musteri/Urun | 1-4 | Musteri, urun tanimlari | 4 |
| 2 — Hammadde/Tedarik | 5-9 | Tedarikci, hammadde, BOM | 5 |
| 3 — Teklif/Siparis | 10-11 | Teklif, siparis donusumu | 2 |
| 4 — Satin Alma/Kalite | 12-15 | Satin alma, mal kabul, giris kalite, kupon test | 4 |
| 5 — Uretim Hazirlama | 16-21 | Clean room, out-time, is emri, operasyonlar | 6 |
| 6 — ShopFloor | 22-27 | Serim, otoklav, trim, NDT, CMM | 6 |
| 7 — Kalite Belgeleme | 28-30 | Seri no, FAI, CoC | 3 |
| 8 — Sevkiyat/Fatura | 31-34 | Paketleme, sevkiyat, fatura, odeme | 4 |
| 9 — Maliyet | 35-36 | Maliyet analizi, out-time iade | 2 |
| 10 — Rol Testi | 37-39 | Kalite Muduru, Uretim Muduru, Operator | 3 |
| 11-12 — Red/Negatif | 40-41 | NDT red + out-time asimi | 2 |
| **TOPLAM** | **1-41** | | **41** |

## Toplam Dogrulama Kontrol Sayisi

| Kategori | Kontrol Sayisi |
|----------|---------------|
| Musteri/Urun CRUD | 28 |
| Hammadde/BOM | 24 |
| Teklif/Siparis | 12 |
| Satin Alma/Mal Kabul | 16 |
| Giris Kalite/Kupon Test | 20 |
| Clean Room/Out-Time | 12 |
| Is Emri/Operasyon | 22 |
| ShopFloor Kayitlari | 28 |
| NDT/CMM/Agirlik | 18 |
| FAI/CoC/Seri No | 24 |
| Sevkiyat/Fatura/Odeme | 20 |
| Maliyet Analizi | 8 |
| Rol Bazli Yetki | 16 |
| Red/Negatif Senaryo | 14 |
| **TOPLAM** | **~262** |

## Kompozit Imalata Ozgu Kritik Kontrol Noktalari

| # | Kontrol Noktasi | Neden Kritik | Quvex Cozumu |
|---|----------------|-------------|-------------|
| 1 | Prepreg out-time takibi | Oda sicakliginda recine omru kisaliyor, mekanik ozellikler dusebilir | Lot notu + kalibrasyon hatirlatici (K1) |
| 2 | Clean room ortam kontrolu | Nem/sicaklik prepreg kalitesini bozar | Muayene kaydi ile periyodik olcum (K5) |
| 3 | Otoklav cure cycle | Sicaklik/basinc/vakum egrisi kritik | Operasyon notu + PLC PDF eki (K3) |
| 4 | NDT C-scan | Delaminasyon/porozite ic yapi hasari gostergesi | Muayene kaydi + PNG/PDF eki (K4) |
| 5 | Fiber oryantasyon dizilimi | Yanlis oryantasyon mekanik ozellikleri %50+ dusurur | Operasyon notu (K2) |
| 6 | Vakum sizdimazlik | Vakum kaybi porozite/delaminasyon sebebi | Operasyon olcum notu (K7) |
| 7 | Lot izlenebilirlik | Geri cagirma (recall) durumunda lot bazli takip | Seri no + genealogy zinciri |
| 8 | Soguk zincir teslimat | Prepreg nakliye sirasinda isiya maruz kalirsa kullanilmaz | Mal kabul kontrolu + not |

## API Endpoint Ozeti

| # | Endpoint | Method | Kullanim |
|---|----------|--------|----------|
| 1 | /Customer | POST | Musteri/Tedarikci kaydi |
| 2 | /Customer?type=customers | GET | Musteri listesi |
| 3 | /Customer?type=suppliers | GET | Tedarikci listesi |
| 4 | /CustomerContact | POST | Irtibat kisisi |
| 5 | /Product | POST | Urun/Hammadde tanimi |
| 6 | /Recipe | POST | BOM/Recete |
| 7 | /Offer | POST | Teklif |
| 8 | /Order | POST | Siparis |
| 9 | /PurchaseOrder | POST | Satin alma |
| 10 | /StockMovement | POST | Mal kabul, depo transferi |
| 11 | /Inspection | POST | Muayene (giris, NDT, ortam, kupon) |
| 12 | /WorkOrder | POST | Is emri |
| 13 | /WorkOrderOperation | POST | Operasyon tanimi |
| 14 | /WorkOrderOperation/start | POST | ShopFloor baslatma |
| 15 | /WorkOrderOperation/complete | POST | ShopFloor tamamlama |
| 16 | /SerialNumber | POST | Seri numara |
| 17 | /FinalInspection | POST | FAI (AS9102) |
| 18 | /CertificateOfConformance | POST | CoC |
| 19 | /Shipment | POST | Sevkiyat/Irsaliye |
| 20 | /Invoice | POST | Fatura |
| 21 | /Payment | POST | Odeme |
| 22 | /Autocomplete/product | GET | Urun arama (OxitAutoComplete) |

---

## Son Notlar

1. **Bu senaryo CFRP panel odaklidir.** Radome (GFRP) icin benzer akis uygulanir ancak
   cam fiber prepreg (S2 glass) ve farkli lay-up kullanilir.

2. **NADCAP Composites denetimi** icin ek olarak:
   - Proses spesifikasyonlari (kurleme parametreleri) dokumante edilmeli
   - Operatorlerin egitimleri ve yetkinlikleri kayit altinda olmali
   - NDT operatoru NAS 410 Level II sertifikali olmali
   - Otoklav kalibrasyon kayitlari guncel olmali

3. **Gercek uretimde ek prosesler:**
   - Lightning strike koruma (bakir mesh ekleme) — ozel projeler icin
   - Boya/primer uygulama — yuzey hazirlama sonrasi
   - Montaj (bonding/fastening) — diger yapi elemanlari ile birlestirme
   - Yipranma testi (fatigue) — seri uretim oncesi tip testi

4. **Quvex gelistirme onerileri (gelecek surumler):**
   - Prepreg out-time otomatik kumulatif sayac modulu
   - Otoklav entegrasyonu (OPC-UA ile PLC'den cure data cekme)
   - C-scan goruntusu dogrudan muayene kaydina entegrasyon
   - Clean room IoT sensor entegrasyonu (sicaklik/nem surekli izleme)
   - Fiber oryantasyon sema editoru (ply-by-ply gorsel lay-up plani)

---

> **Hazirlayan:** QA Ekibi — Kartal Kompozit Havacilik Senaryosu
> **Tarih:** 2026-04-10
> **Versiyon:** 1.0
> **Quvex Surumu:** v2.x (Sprint 9 sonrasi)
> **Toplam Adim:** 41 (38 ana + 3 bonus/negatif)
> **Toplam Dogrulama:** ~262 kontrol noktasi
