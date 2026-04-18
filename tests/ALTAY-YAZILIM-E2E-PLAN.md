# ALTAY YAZILIM SAVUNMA - Uctan Uca E2E Test Plani
# Durbun Uretim & Satis Senaryosu

**Firma:** ALTAY YAZILIM SAVUNMA ENDUSTRiYEL SANAYi VE TiCARET A.S.
**Urun:** Askeri Durbun (Satis Fiyati: $20.000)
**Donem:** Ocak - Subat 2026
**Doviz:** USD ($) — Odemeler TRY'ye MB kurundan cevrilir

---

## SUREC HARITASI (Process Map)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        ALTAY YAZILIM ERP SUREC HARITASI                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  TENANT & TANIMLAR                                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐               │
│  │  Tenant   │→│  Roller   │→│Kullanicilar│→│ Makineler │               │
│  │  Olustur  │  │  Tanimla  │  │   Ekle    │  │   Ekle   │               │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘               │
│       ↓                                                                 │
│  URUN & STOK                                                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐               │
│  │ Birimler  │→│  Depolar  │→│ Malzemeler│→│  Urun     │               │
│  │  Tanimla  │  │  Olustur  │  │ (BOM)    │  │(Durbun)  │               │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘               │
│       ↓                                                                 │
│  SATIN ALMA (Tedarik Zinciri)                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐               │
│  │Tedarikci │→│  Talep    │→│  Teklif   │→│ Siparis   │→ Alis Faturasi│
│  │  Tanimla  │  │  Olustur  │  │  Al/Ver  │  │  Olustur │               │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘               │
│       ↓                                                                 │
│  SATIS (Musteri Sureci)                                                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐               │
│  │ Musteri   │→│  Teklif   │→│ Siparis   │→│Satis Ftr. │               │
│  │  Tanimla  │  │  Olustur  │  │  Olustur │  │  Olustur │               │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘               │
│       ↓                                                                 │
│  URETIM                                                                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐               │
│  │ Is Emri   │→│Lens Montaj│→│ Mercek    │→│  Govde   │               │
│  │ Olustur   │  │           │  │Entegrasyon│  │  Montaj  │               │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘               │
│       ↓              ↓              ↓              ↓                    │
│  ┌──────────┐  ┌──────────┐                                            │
│  │Kalibrasyon│→│Son Kontrol│→ TAMAMLANDI                               │
│  └──────────┘  └──────────┘                                            │
│       ↓                                                                 │
│  KALITE                                                                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐               │
│  │Giris Kntrl│  │   NCR    │→│   CAPA   │  │Kalibrasyon│               │
│  │(Malzeme) │  │ (Sorun)  │  │(Duzeltme)│  │  Takibi  │               │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘               │
│       ↓                                                                 │
│  FINANS                                                                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐               │
│  │Kasa/Banka│→│  Odeme   │→│Yaslandirma│→│  Raporlar │               │
│  │  Hesaplar│  │ Tahsilat │  │  Analizi  │  │AI Insight│               │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘               │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## ZAMAN CIZELGESI

```
Aralik 2025
  25.12  Tenant olustur, tanimlar, tedarikci/musteri kayitlari
  26.12  Satin alma talepleri (Lens 10, Mercek 15, Tutucu 20)
  27.12  Satin alma teklifleri → siparisleri
  28.12  Alis faturalari, malzeme depoya giris
  29.12  Roketsan Parti-1 (5 adet) uretim baslangici
  30.12  Aselsan Parti (4 adet) uretim baslangici

Ocak 2026
  01.01  Roketsan Parti-1 tamamlandi → Satis faturasi (5 x $20.000 = $100.000)
  02.01  Aselsan Parti tamamlandi → Satis faturasi (4 x $20.000 = $80.000)
  03.01  Kalite sorunu: Roketsan Parti-1'de 1 adet lens kusuru → NCR → rework
  05.01  Roketsan odemesi: $100.000 → Kasa (43.10 TL/$ = 4.310.000 TL)
  06.01  Roketsan Parti-2 (10 adet) uretim baslangici
         → Stok yetersiz! 2. satin alma turu baslar
  10.01  Roketsan Parti-2 tamamlandi → Satis faturasi (10 x $20.000 = $200.000)
         → ODEME YOK
  12.01  Kalite sorunu: Aselsan partisinde 1 adet mercek odak hatasi → NCR → red
  15.01  Roketsan Parti-3 (8 adet) uretim baslangici
  20.01  Roketsan Parti-3 tamamlandi → Satis faturasi (8 x $20.000 = $160.000)
         → ODEME YOK

Subat 2026
  02.02  Aselsan odemesi: $80.000 → Banka (43.50 TL/$ = 3.480.000 TL)
```

---

## DOVIZ KURLARI (TCMB Referans)

| Tarih | USD/TRY | Kaynak |
|-------|---------|--------|
| 25.12.2025 | 42.95 | Satin alma faturalari |
| 01.01.2026 | 43.00 | Roketsan satis faturasi |
| 02.01.2026 | 43.02 | Aselsan satis faturasi |
| 05.01.2026 | 43.10 | Roketsan tahsilat |
| 10.01.2026 | 43.15 | Roketsan satis faturasi |
| 20.01.2026 | 43.20 | Roketsan satis faturasi |
| 02.02.2026 | 43.50 | Aselsan tahsilat |

---

## KULLANICI LISTESI

| # | Ad Soyad | Email | Rol | Cinsiyet |
|---|----------|-------|-----|----------|
| 1 | Murat Altay | murat.altay@altayyazilim.com | Yonetici | Erkek |
| 2 | Kemal Yildirim | kemal.yildirim@altayyazilim.com | Uretim Muduru | Erkek |
| 3 | Elif Sahin | elif.sahin@altayyazilim.com | Operasyon Sorumlusu | Kadin |
| 4 | Zeynep Kara | zeynep.kara@altayyazilim.com | Operasyon Sorumlusu | Kadin |
| 5 | Hasan Demir | hasan.demir@altayyazilim.com | Operator | Erkek |
| 6 | Fatma Celik | fatma.celik@altayyazilim.com | Kaliteci | Kadin |

---

## BOM (Urun Agaci) — Askeri Durbun

| # | Parca | Kod | Birim Fiyat | Birim | Adet/Durbun | Tedarikci |
|---|-------|-----|-------------|-------|-------------|-----------|
| 1 | Lens | MLZ-001 | $50 | Adet | 1 | Optik-Tek Lens San. A.S. |
| 2 | Mercek | MLZ-002 | $1.000 | Adet | 1 | Gorus Optik Sistemleri Ltd. Sti. |
| 3 | Tutucu | MLZ-003 | $10 | Adet | 1 | Altin Metal San. Tic. Ltd. Sti. |
| 4 | Govde (Aluminyum) | MLZ-004 | $150 | Adet | 1 | Savunma Govde Muhendislik A.S. |
| 5 | Optik Cam | MLZ-005 | $25 | Adet | 2 | Kristal Cam Optik A.S. |
| 6 | Montaj Vidasi Seti | MLZ-006 | $5 | Takim | 1 | Baglanti Elemanlari San. Ltd. Sti. |

**Birim BOM Maliyeti:** $50 + $1.000 + $10 + $150 + $50 + $5 = **$1.265**
**Satis Fiyati:** $20.000
**Brut Kar Marji:** %93,7

---

## TEDARIKCI LISTESI

| # | Firma Adi | Sektor | Sehir | VKN | Urun |
|---|-----------|--------|-------|-----|------|
| 1 | Optik-Tek Lens San. A.S. | Optik | Ankara | 1112223334 | Lens |
| 2 | Gorus Optik Sistemleri Ltd. Sti. | Optik | Istanbul | 2223334445 | Mercek |
| 3 | Altin Metal San. Tic. Ltd. Sti. | Metal | Kocaeli | 3334445556 | Tutucu |
| 4 | Savunma Govde Muhendislik A.S. | Savunma | Ankara | 4445556667 | Govde |
| 5 | Kristal Cam Optik A.S. | Cam/Optik | Izmir | 5556667778 | Optik Cam |
| 6 | Baglanti Elemanlari San. Ltd. Sti. | Baglanti | Bursa | 6667778889 | Montaj Seti |

---

## MUSTERI LISTESI

| # | Firma Adi | Sektor | Sehir | VKN |
|---|-----------|--------|-------|-----|
| 1 | Roketsan A.S. | Savunma/Havacılık | Ankara | 7778889990 |
| 2 | Aselsan A.S. | Savunma/Elektronik | Ankara | 8889990001 |

---

## MAKINE LISTESI

| # | Makine Adi | Kod | Aciklama |
|---|------------|-----|----------|
| 1 | Lens Montaj Istasyonu | MONTAJ-01 | Lens bileseni montaj tezgahi |
| 2 | Optik Kalibrasyon Cihazi | OPTIK-01 | Mercek hizalama ve kalibrasyon |
| 3 | Govde Montaj Istasyonu | MONTAJ-02 | Ana govde ve tutucu montaji |
| 4 | Fonksiyon Test Cihazi | TEST-01 | Son kalite ve fonksiyon testi |

---

## URETIM ADIMLARI (Is Emri Sablonu: "Askeri Durbun Uretimi")

| Adim | Operasyon | Makine | Atanan Kisi | Sure | Kalite | Onkosul |
|------|-----------|--------|-------------|------|--------|---------|
| 1 | Lens Montaji | MONTAJ-01 | Elif Sahin | 45 dk | Hayir | - |
| 2 | Mercek Entegrasyonu | OPTIK-01 | Zeynep Kara | 60 dk | Hayir | Adim 1 |
| 3 | Govde Montaji | MONTAJ-02 | Hasan Demir | 30 dk | Hayir | Adim 2 |
| 4 | Kalibrasyon | OPTIK-01 | Zeynep Kara | 40 dk | Hayir | Adim 3 |
| 5 | Son Kontrol | TEST-01 | Fatma Celik | 30 dk | Evet | Adim 4 |

---

## FINANS HESAPLARI

| # | Hesap Adi | Tip | Para Birimi | Acilis Bakiye |
|---|-----------|-----|-------------|---------------|
| 1 | Ana Kasa | Kasa | TRY | 50.000 TL |
| 2 | Dolar Kasa | Kasa | USD | $5.000 |
| 3 | Ziraat Bankasi | Banka | TRY | 200.000 TL |

---

# ═══════════════════════════════════════
# FAZ 0: TENANT OLUSTURMA & GIRIS
# ═══════════════════════════════════════

```
EKRAN: /register
────────────────────────────────────────────────────────────

0.1  Register sayfasina git
     - Firma Adi: "ALTAY YAZILIM SAVUNMA END. SAN. VE TIC. A.S."
     - Email: murat.altay@altayyazilim.com
     - Sifre: AltayDef2026!@  (min 12 karakter, buyuk+kucuk+rakam+ozel)
     - Sektor: Savunma
     - KAYDET

0.2  KONTROL: Basarili kayit mesaji gorundü mu?

0.3  Giris yap: murat.altay@altayyazilim.com / AltayDef2026!@
     KONTROL: Ana sayfa yuklendi mi?

0.4  Onboarding wizard varsa → Sektor: Savunma sec
     KONTROL: Menu savunma profiline uygun mu?
```

---

# ═══════════════════════════════════════
# FAZ 1: TEMEL TANIMLAR
# ═══════════════════════════════════════

```
EKRAN: Ayarlar → Birimler
────────────────────────────────────────────────────────────

1.1  Birim Ekle:
     - Adet (AD)
     - Takim (TK)
     - Kg (KG)

     KONTROL: 3 birim listede gorunuyor mu?
```

```
EKRAN: Ayarlar → Roller
────────────────────────────────────────────────────────────

1.2  Rol Olustur — "Yonetici":
     - Sablon: Yonetici sablonu sec
     - Tum moduller: Goruntule + Kaydet + Sil

1.3  Rol Olustur — "Uretim Muduru":
     - Uretim: Goruntule + Kaydet + Sil
     - Stok: Goruntule + Kaydet
     - Satinalma: Goruntule + Kaydet
     - Kalite: Goruntule + Kaydet
     - Satis: Goruntule

1.4  Rol Olustur — "Operasyon Sorumlusu":
     - Uretim: Goruntule + Kaydet
     - Stok: Goruntule + Kaydet
     - Kalite: Goruntule
     - Satinalma: Goruntule

1.5  Rol Olustur — "Operator":
     - Uretim: Goruntule
     - ShopFloor Terminal: Goruntule + Kaydet

1.6  Rol Olustur — "Kaliteci":
     - Kalite: Goruntule + Kaydet + Sil
     - Uretim: Goruntule
     - Stok: Goruntule

     KONTROL: 5 rol listede gorunuyor mu?
```

```
EKRAN: Ayarlar → Is Emri Adimlari (WorkOrderSteps)
────────────────────────────────────────────────────────────

1.7  Is Emri Adimlari Ekle:
     - LENS_MONTAJ / Lens Montaji
     - MERCEK_ENTEGRASYON / Mercek Entegrasyonu
     - GOVDE_MONTAJ / Govde Montaji
     - KALIBRASYON / Kalibrasyon
     - SON_KONTROL / Son Kontrol

     KONTROL: 5 adim listede gorunuyor mu?
```

---

# ═══════════════════════════════════════
# FAZ 2: MAKINE & PERSONEL
# ═══════════════════════════════════════

```
EKRAN: Uretim → Makineler (/machines)
────────────────────────────────────────────────────────────

2.1  Makine Ekle:
     - Ad: Lens Montaj Istasyonu    | Kod: MONTAJ-01
     - Ad: Optik Kalibrasyon Cihazi | Kod: OPTIK-01
     - Ad: Govde Montaj Istasyonu   | Kod: MONTAJ-02
     - Ad: Fonksiyon Test Cihazi    | Kod: TEST-01

     KONTROL: 4 makine listede gorunuyor mu?
```

```
EKRAN: Ayarlar → Kullanicilar
────────────────────────────────────────────────────────────

2.2  Kullanici Ekle — Uretim Muduru:
     - Ad: Kemal Yildirim
     - Email: kemal.yildirim@altayyazilim.com
     - Sifre: KemalUretim2026!
     - Rol: Uretim Muduru

2.3  Kullanici Ekle — Operasyon Sorumlusu 1:
     - Ad: Elif Sahin
     - Email: elif.sahin@altayyazilim.com
     - Sifre: ElifOps2026!@#
     - Rol: Operasyon Sorumlusu

2.4  Kullanici Ekle — Operasyon Sorumlusu 2:
     - Ad: Zeynep Kara
     - Email: zeynep.kara@altayyazilim.com
     - Sifre: ZeynepOps2026!@
     - Rol: Operasyon Sorumlusu

2.5  Kullanici Ekle — Operator:
     - Ad: Hasan Demir
     - Email: hasan.demir@altayyazilim.com
     - Sifre: HasanOp2026!@#
     - Rol: Operator

2.6  Kullanici Ekle — Kaliteci:
     - Ad: Fatma Celik
     - Email: fatma.celik@altayyazilim.com
     - Sifre: FatmaQC2026!@#
     - Rol: Kaliteci

     KONTROL: 5 yeni kullanici + 1 admin = 6 kullanici listede?
```

---

# ═══════════════════════════════════════
# FAZ 3: IS EMRI SABLONU
# ═══════════════════════════════════════

```
EKRAN: Ayarlar → Is Emri Sablonlari
────────────────────────────────────────────────────────────

3.1  Yeni Sablon Olustur: "Askeri Durbun Uretimi"

     Adim 1: Lens Montaji
       - Makine: MONTAJ-01 (Lens Montaj Istasyonu)
       - Kullanici: Elif Sahin
       - Sure: 45 dakika
       - Kalite Adimi: Hayir
       - Onkosul: —

     Adim 2: Mercek Entegrasyonu
       - Makine: OPTIK-01 (Optik Kalibrasyon Cihazi)
       - Kullanici: Zeynep Kara
       - Sure: 60 dakika
       - Kalite Adimi: Hayir
       - Onkosul: Adim 1

     Adim 3: Govde Montaji
       - Makine: MONTAJ-02 (Govde Montaj Istasyonu)
       - Kullanici: Hasan Demir
       - Sure: 30 dakika
       - Kalite Adimi: Hayir
       - Onkosul: Adim 2

     Adim 4: Kalibrasyon
       - Makine: OPTIK-01 (Optik Kalibrasyon Cihazi)
       - Kullanici: Zeynep Kara
       - Sure: 40 dakika
       - Kalite Adimi: Hayir
       - Onkosul: Adim 3

     Adim 5: Son Kontrol
       - Makine: TEST-01 (Fonksiyon Test Cihazi)
       - Kullanici: Fatma Celik
       - Sure: 30 dakika
       - Kalite Adimi: Evet
       - Onkosul: Adim 4

3.2  KAYDET
     KONTROL: Sablon listesinde "Askeri Durbun Uretimi" gorunuyor mu?

3.3  Sablonu tekrar ac
     KONTROL: 5 adim, makine atamalari, kullanici atamalari dogru yuklendi mi?
```

---

# ═══════════════════════════════════════
# FAZ 4: DEPO & STOK YAPISI
# ═══════════════════════════════════════

```
EKRAN: Stok → Depolar
────────────────────────────────────────────────────────────

4.1  Depo Ekle:
     - HAMMADDE / Hammadde Deposu
     - MAMUL / Mamul Deposu
     - SEVKIYAT / Sevkiyat Deposu

     KONTROL: 3 depo listede gorunuyor mu?
```

```
EKRAN: Stok → Urun & Malzeme
────────────────────────────────────────────────────────────

4.2  Malzeme (STOCK) Ekle — Hammaddeler:

     a) Kod: MLZ-001 | Ad: Lens
        Birim: Adet | Alis Fiyati: $50 | Min: 10 | Max: 100

     b) Kod: MLZ-002 | Ad: Mercek
        Birim: Adet | Alis Fiyati: $1.000 | Min: 5 | Max: 50

     c) Kod: MLZ-003 | Ad: Tutucu
        Birim: Adet | Alis Fiyati: $10 | Min: 10 | Max: 100

     d) Kod: MLZ-004 | Ad: Govde (Aluminyum)
        Birim: Adet | Alis Fiyati: $150 | Min: 5 | Max: 50

     e) Kod: MLZ-005 | Ad: Optik Cam
        Birim: Adet | Alis Fiyati: $25 | Min: 10 | Max: 100

     f) Kod: MLZ-006 | Ad: Montaj Vidasi Seti
        Birim: Takim | Alis Fiyati: $5 | Min: 10 | Max: 100

     KONTROL: 6 malzeme listede gorunuyor mu?
```

```
4.3  Urun (PRODUCTION_MATERIAL) Ekle:

     Kod: PRD-001 | Ad: Askeri Durbun
     Birim: Adet | Satis Fiyati: $20.000
     Is Emri Sablonu: "Askeri Durbun Uretimi" sec
     BOM (Urun Agaci):
       - MLZ-001 Lens x1
       - MLZ-002 Mercek x1
       - MLZ-003 Tutucu x1
       - MLZ-004 Govde x1
       - MLZ-005 Optik Cam x2
       - MLZ-006 Montaj Vidasi Seti x1

     KONTROL: Urun detayinda BOM 6 kalem, toplam maliyet $1.265 gorunuyor mu?
```

```
EKRAN: Stok → Stok Giris/Cikis
────────────────────────────────────────────────────────────

4.4  Stok Giris Fisi — Ek malzemeler icin ilk stok (satin alma disindakiler):

     a) Govde (MLZ-004) → 30 Adet → Hammadde Deposu
     b) Optik Cam (MLZ-005) → 60 Adet → Hammadde Deposu
     c) Montaj Vidasi Seti (MLZ-006) → 30 Takim → Hammadde Deposu

     KONTROL: Stok listesinde fiili stoklar dogru mu?
     - Govde: 30 Adet
     - Optik Cam: 60 Adet
     - Montaj Seti: 30 Takim
     - Lens, Mercek, Tutucu: 0 (satin alma ile gelecek)
```

---

# ═══════════════════════════════════════
# FAZ 5: MUSTERI & TEDARIKCI
# ═══════════════════════════════════════

```
EKRAN: Satinalma → Tedarikciler (/suppliers)
────────────────────────────────────────────────────────────

5.1  Tedarikci Ekle — Optik-Tek Lens San. A.S.:
     - Sektor: Optik
     - Sehir: Ankara
     - VKN: 1112223334
     - Adres: Ostim OSB Mah. 1234 Sok. No:5, Yenimahalle/Ankara
     - Iletisim: Ahmet Koc / ahmet@optiktek.com / 0312 555 1001

5.2  Tedarikci Ekle — Gorus Optik Sistemleri Ltd. Sti.:
     - Sektor: Optik
     - Sehir: Istanbul
     - VKN: 2223334445
     - Adres: IMES San. Sit. A Blok No:12, Umraniye/Istanbul
     - Iletisim: Mehmet Isik / mehmet@gorusoptik.com / 0216 555 2002

5.3  Tedarikci Ekle — Altin Metal San. Tic. Ltd. Sti.:
     - Sektor: Metal Isleme
     - Sehir: Kocaeli
     - VKN: 3334445556
     - Adres: KOSBI OSB 3. Cad. No:8, Gebze/Kocaeli
     - Iletisim: Ayse Yildiz / ayse@altinmetal.com / 0262 555 3003

5.4  Tedarikci Ekle — Savunma Govde Muhendislik A.S.:
     - Sektor: Savunma
     - Sehir: Ankara
     - VKN: 4445556667
     - Adres: ASO 2. OSB 5. Cad. No:15, Sincan/Ankara
     - Iletisim: Can Ozturk / can@savunmagovde.com / 0312 555 4004

5.5  Tedarikci Ekle — Kristal Cam Optik A.S.:
     - Sektor: Cam/Optik
     - Sehir: Izmir
     - VKN: 5556667778
     - Adres: Ataturk OSB 8. Sok. No:3, Cigli/Izmir
     - Iletisim: Deniz Yalcin / deniz@kristalcam.com / 0232 555 5005

5.6  Tedarikci Ekle — Baglanti Elemanlari San. Ltd. Sti.:
     - Sektor: Baglanti Elemanlari
     - Sehir: Bursa
     - VKN: 6667778889
     - Adres: BOSB 7. Cad. No:22, Nilufer/Bursa
     - Iletisim: Emre Aksoy / emre@baglantielem.com / 0224 555 6006

     KONTROL: 6 tedarikci listede gorunuyor mu?
```

```
EKRAN: Satis → Musteriler (/customers?type=customers)
────────────────────────────────────────────────────────────

5.7  Musteri Ekle — Roketsan A.S.:
     - Sektor: Savunma/Havacilik
     - Sehir: Ankara
     - VKN: 7778889990
     - Adres: Kemaliye Mah. Sehit Pilot Mahmut Nedim Sok. No:10, Elmadag/Ankara
     - Iletisim: Burak Cetin / burak.cetin@roketsan.com / 0312 800 1000

5.8  Musteri Ekle — Aselsan A.S.:
     - Sektor: Savunma/Elektronik
     - Sehir: Ankara
     - VKN: 8889990001
     - Adres: Mehmet Akif Ersoy Mah. 296. Cad. No:16, Yenimahalle/Ankara
     - Iletisim: Selin Dogan / selin.dogan@aselsan.com / 0312 800 2000

     KONTROL: 2 musteri listede gorunuyor mu?
```

---

# ═══════════════════════════════════════
# FAZ 6: FINANS KURULUMU
# ═══════════════════════════════════════

```
EKRAN: Finans → Kasa/Banka (/accounting/cash-bank)
────────────────────────────────────────────────────────────

6.1  Hesap Olustur — Ana Kasa:
     - Ad: Ana Kasa
     - Tip: Kasa
     - Para Birimi: TRY
     - Acilis Bakiye: 50.000 TL

6.2  Hesap Olustur — Dolar Kasa:
     - Ad: Dolar Kasa
     - Tip: Kasa
     - Para Birimi: USD
     - Acilis Bakiye: $5.000

6.3  Hesap Olustur — Ziraat Bankasi:
     - Ad: Ziraat Bankasi
     - Tip: Banka
     - Para Birimi: TRY
     - Acilis Bakiye: 200.000 TL
     - IBAN: TR00 0001 0000 0000 0000 0050 00
     - Sube: Ankara Merkez

     KONTROL: Ozet kartlar:
     - Ana Kasa: 50.000 TL
     - Dolar Kasa: $5.000
     - Ziraat: 200.000 TL
```

```
EKRAN: Finans → Doviz Kurlari (/accounting/exchange-rates)
────────────────────────────────────────────────────────────

6.4  TCMB kurlarini guncelle (veya manuel giris):
     - USD/TRY: 42.95 (25.12.2025 icin)

     KONTROL: Doviz kuru sayfasinda USD/TRY gorunuyor mu?
```

---

# ═══════════════════════════════════════
# FAZ 7: SATIN ALMA SURECI — 1. TUR
# (Lens 10, Mercek 15, Tutucu 20)
# ═══════════════════════════════════════

## 7A: Satin Alma Talepleri

```
EKRAN: Satinalma → Satin Alma Talepleri (/purchase-request)
────────────────────────────────────────────────────────────

7A.1  Yeni Talep — Lens:
      - Talep Eden: Kemal Yildirim (Uretim Muduru)
      - Tarih: 26.12.2025
      - Aciklama: "Roketsan & Aselsan siparisleri icin lens tedarigi"
      - Kalem: MLZ-001 Lens x10 Adet
      - Oncelik: Yuksek
      - Ihtiyac Tarihi: 28.12.2025
      KAYDET

7A.2  Yeni Talep — Mercek:
      - Talep Eden: Kemal Yildirim
      - Tarih: 26.12.2025
      - Aciklama: "Durbun uretimi icin mercek tedarigi"
      - Kalem: MLZ-002 Mercek x15 Adet
      - Oncelik: Yuksek
      - Ihtiyac Tarihi: 28.12.2025
      KAYDET

7A.3  Yeni Talep — Tutucu:
      - Talep Eden: Kemal Yildirim
      - Tarih: 26.12.2025
      - Aciklama: "Durbun montaj hatti icin tutucu tedarigi"
      - Kalem: MLZ-003 Tutucu x20 Adet
      - Oncelik: Normal
      - Ihtiyac Tarihi: 28.12.2025
      KAYDET

      KONTROL: 3 talep listede "Beklemede" durumunda gorunuyor mu?

7A.4  Her 3 talebi "Onaylandi" durumuna gecir (Yonetici onayi)
      KONTROL: Durumlar "Onaylandi" olarak guncellendi mi?
```

## 7B: Satin Alma Teklifleri

```
EKRAN: Satinalma → Satin Alma Teklifleri (/purchase-offers)
────────────────────────────────────────────────────────────

7B.1  Yeni Teklif — Lens (Optik-Tek'ten):
      - Tedarikci: Optik-Tek Lens San. A.S.
      - Tarih: 27.12.2025
      - Kalem: MLZ-001 Lens x10 @ $50 = $500
      - Gecerlilik: 15 gun
      - Odeme Kosulu: 30 gun vadeli
      KAYDET → "Gonderildi" yap

7B.2  Yeni Teklif — Mercek (Gorus Optik'ten):
      - Tedarikci: Gorus Optik Sistemleri Ltd. Sti.
      - Tarih: 27.12.2025
      - Kalem: MLZ-002 Mercek x15 @ $1.000 = $15.000
      - Gecerlilik: 15 gun
      - Odeme Kosulu: 30 gun vadeli
      KAYDET → "Gonderildi" yap

7B.3  Yeni Teklif — Tutucu (Altin Metal'den):
      - Tedarikci: Altin Metal San. Tic. Ltd. Sti.
      - Tarih: 27.12.2025
      - Kalem: MLZ-003 Tutucu x20 @ $10 = $200
      - Gecerlilik: 15 gun
      - Odeme Kosulu: Pesin
      KAYDET → "Gonderildi" yap

      KONTROL: 3 teklif listede "Gonderildi" durumunda gorunuyor mu?

7B.4  Her 3 teklifi "Kabul Edildi" durumuna gecir
      KONTROL: Durumlar guncellendi mi?
```

## 7C: Satin Alma Siparisleri

```
EKRAN: Satinalma → Satin Alma Siparisleri (/purchase-orders)
────────────────────────────────────────────────────────────

7C.1  Tekliften Siparis Olustur — Lens:
      - Teklif 7B.1'den "Siparis Olustur" tikla
      - Siparis No kontrol (SA2025-XXXXX veya otomatik)
      - Tedarikci: Optik-Tek Lens San. A.S.
      - Kalem: MLZ-001 Lens x10 @ $50 = $500
      - Teslim Tarihi: 28.12.2025
      KAYDET → "Gonderildi" yap

7C.2  Tekliften Siparis Olustur — Mercek:
      - Teklif 7B.2'den "Siparis Olustur" tikla
      - Tedarikci: Gorus Optik Sistemleri Ltd. Sti.
      - Kalem: MLZ-002 Mercek x15 @ $1.000 = $15.000
      - Teslim Tarihi: 28.12.2025
      KAYDET → "Gonderildi" yap

7C.3  Tekliften Siparis Olustur — Tutucu:
      - Teklif 7B.3'den "Siparis Olustur" tikla
      - Tedarikci: Altin Metal San. Tic. Ltd. Sti.
      - Kalem: MLZ-003 Tutucu x20 @ $10 = $200
      - Teslim Tarihi: 28.12.2025
      KAYDET → "Gonderildi" yap

      KONTROL: 3 siparis listede "Gonderildi" durumunda gorunuyor mu?
```

## 7D: Malzeme Teslim Alma & Giris Kontrol

```
EKRAN: Satinalma → Satin Alma Siparisleri → Detay
────────────────────────────────────────────────────────────

7D.1  Lens Siparisini Teslim Al:
      - Siparis 7C.1'i ac → "Teslim Al" tikla
      - Miktar: 10 Adet
      - Hedef Depo: Hammadde Deposu
      - Irsaliye No: IRS-2025-001

7D.2  Mercek Siparisini Teslim Al:
      - Siparis 7C.2'yi ac → "Teslim Al"
      - Miktar: 15 Adet
      - Hedef Depo: Hammadde Deposu
      - Irsaliye No: IRS-2025-002

7D.3  Tutucu Siparisini Teslim Al:
      - Siparis 7C.3'u ac → "Teslim Al"
      - Miktar: 20 Adet
      - Hedef Depo: Hammadde Deposu
      - Irsaliye No: IRS-2025-003

      KONTROL: Stok durumlari:
      - Lens: 10 Adet (Hammadde Deposu)
      - Mercek: 15 Adet (Hammadde Deposu)
      - Tutucu: 20 Adet (Hammadde Deposu)
      - Govde: 30 Adet (Hammadde Deposu)
      - Optik Cam: 60 Adet (Hammadde Deposu)
      - Montaj Seti: 30 Takim (Hammadde Deposu)
```

## 7E: Alis Faturalari

```
EKRAN: Satis → Faturalar → Alis Faturasi (/invoices/purchase)
────────────────────────────────────────────────────────────

7E.1  Alis Faturasi — Lens:
      - Tedarikci: Optik-Tek Lens San. A.S.
      - Fatura Tarihi: 28.12.2025
      - Kalem: MLZ-001 Lens x10 @ $50 = $500
      - KDV: %20 = $100
      - Toplam: $600
      - Kur: 42.95 TL/$ → TRY karsiligi: 25.770 TL
      KAYDET → "Gonderildi" yap

7E.2  Alis Faturasi — Mercek:
      - Tedarikci: Gorus Optik Sistemleri Ltd. Sti.
      - Fatura Tarihi: 28.12.2025
      - Kalem: MLZ-002 Mercek x15 @ $1.000 = $15.000
      - KDV: %20 = $3.000
      - Toplam: $18.000
      - Kur: 42.95 TL/$ → TRY karsiligi: 773.100 TL
      KAYDET → "Gonderildi" yap

7E.3  Alis Faturasi — Tutucu:
      - Tedarikci: Altin Metal San. Tic. Ltd. Sti.
      - Fatura Tarihi: 28.12.2025
      - Kalem: MLZ-003 Tutucu x20 @ $10 = $200
      - KDV: %20 = $40
      - Toplam: $240
      - Kur: 42.95 TL/$ → TRY karsiligi: 10.308 TL
      KAYDET → "Gonderildi" yap

      KONTROL: Cari bakiyeler:
      - Optik-Tek'e borcumuz: $600 (25.770 TL)
      - Gorus Optik'e borcumuz: $18.000 (773.100 TL)
      - Altin Metal'e borcumuz: $240 (10.308 TL)
      - TOPLAM TEDARIKCI BORCU: $18.840

7E.4  Tedarikci odeme — Altin Metal (pesin):
      - Fatura 7E.3'u ac → Odeme Ekle
      - Tutar: $240 (10.308 TL)
      - Yontem: Havale
      - Hesap: Ziraat Bankasi
      KONTROL: Ziraat bakiye: 200.000 - 10.308 = 189.692 TL
      KONTROL: Altin Metal cari: 0
```

---

# ═══════════════════════════════════════
# FAZ 8: SATIS SURECI — ROKETSAN PARTI-1 (5 Adet)
# ═══════════════════════════════════════

## 8A: Satis Teklifi

```
EKRAN: Satis → Teklifler (/offers)
────────────────────────────────────────────────────────────

8A.1  Yeni Teklif:
      - Musteri: Roketsan A.S.
      - Teklif Tarihi: 26.12.2025
      - Gecerlilik: 30 gun
      - Kalem: PRD-001 Askeri Durbun x5 @ $20.000 = $100.000
      - KDV: %0 (savunma sanayi istisnasi)
      - Toplam: $100.000
      - Not: "Roketsan Askeri Durbun Projesi - Parti 1"
      KAYDET

8A.2  Teklif durumunu "Gonderildi" yap
      KONTROL: Teklif No (T2026-XXXXX) kontrol

8A.3  Teklif durumunu "Kabul Edildi" yap → "Siparis Olustur" tikla
      KONTROL: Otomatik siparis olusturuldu mu?
```

## 8B: Satis Siparisi

```
EKRAN: Satis → Satislar (/sales)
────────────────────────────────────────────────────────────

8B.1  Roketsan Siparis kontrol:
      - Musteri: Roketsan A.S.
      - Kalem: Askeri Durbun x5 @ $20.000
      - Toplam: $100.000
      - Teslim Tarihi: 01.01.2026
      - Durum: "Uretime Hazir"

8B.2  "Uretime Hazir Siparis Olustur" tikla
      KONTROL: Uretim → Is Emirleri'nde yeni is emri olusturuldu mu?
```

---

# ═══════════════════════════════════════
# FAZ 9: URETIM — ROKETSAN PARTI-1 (5 Adet Durbun)
# ═══════════════════════════════════════

```
EKRAN: Uretim → Is Emirleri (/production)
────────────────────────────────────────────────────────────

9.1  Roketsan Parti-1 is emrini ac:
     - Siparis: Roketsan 5 adet
     - Urun: Askeri Durbun (PRD-001)
     - Miktar: 5
     - Sablon: "Askeri Durbun Uretimi" otomatik yuklenmis mi?
     - 5 adim gorunuyor mu? (Lens Montaj → Mercek Enteg. → Govde Montaj → Kalibrasyon → Son Kontrol)

     KONTROL: Progress stepper gorunuyor mu?
```

```
9.2  Malzeme Cekisi (BOM kontrolu):
     Stoktan cekilecek:
     - Lens: 5 Adet (stok: 10 → kalan: 5)
     - Mercek: 5 Adet (stok: 15 → kalan: 10)
     - Tutucu: 5 Adet (stok: 20 → kalan: 15)
     - Govde: 5 Adet (stok: 30 → kalan: 25)
     - Optik Cam: 10 Adet (stok: 60 → kalan: 50)
     - Montaj Seti: 5 Takim (stok: 30 → kalan: 25)

     KONTROL: Stok yeterli mi? Uyari var mi?
```

```
9.3  ADIM 1 — Lens Montaji:
     - Atanan: Elif Sahin
     - Makine: MONTAJ-01
     - Miktar: 5
     - "Baslat" tikla → sure sayaci calisiyor mu?
     - "Tamamla" tikla
     KONTROL: Adim 1 "Tamamlandi" durumunda

9.4  ADIM 2 — Mercek Entegrasyonu:
     - Atanan: Zeynep Kara
     - Makine: OPTIK-01
     - Miktar: 5
     - "Baslat" → "Tamamla"
     KONTROL: Adim 2 tamamlandi

9.5  ADIM 3 — Govde Montaji:
     - Atanan: Hasan Demir
     - Makine: MONTAJ-02
     - Miktar: 5
     - "Baslat" → "Tamamla"
     KONTROL: Adim 3 tamamlandi

9.6  ADIM 4 — Kalibrasyon:
     - Atanan: Zeynep Kara
     - Makine: OPTIK-01
     - Miktar: 5
     - "Baslat" → "Tamamla"
     KONTROL: Adim 4 tamamlandi

9.7  ADIM 5 — Son Kontrol (Kalite Adimi):
     - Atanan: Fatma Celik
     - Makine: TEST-01
     - Miktar: 5
     - "Baslat" → "Tamamla"
     KONTROL: Kalite kaydi otomatik olusturuldu mu?

9.8  KONTROL: Is emri durumu "Tamamlandi"
     KONTROL: Mamul Deposu'nda 5 adet Askeri Durbun gorunuyor mu?
```

---

# ═══════════════════════════════════════
# FAZ 10: SHOPFLOOR TERMINAL — Operator Deneyimi
# ═══════════════════════════════════════

```
NOT: Bu faz, FAZ 9 sirasinda veya sonrasinda operator perspektifinden test eder.
Mevcut oturumu kapatip operator ile giris yapmak gerekir.

EKRAN: /shop-floor-terminal
────────────────────────────────────────────────────────────

10.1  Cikis yap (Murat Altay)
10.2  Giris yap: hasan.demir@altayyazilim.com / HasanOp2026!@#

10.3  Uretim → Saha Terminali'ne git
      KONTROL: Basitlesirilmis terminal arayuzu gorunuyor mu?

10.4  Makine sec: MONTAJ-02 (Govde Montaj Istasyonu)
      KONTROL: Atanmis isler gorunuyor mu?

10.5  Listeden bir is sec (Roketsan Parti-1 veya sonraki parti)
10.6  BASLAT tikla → sure sayaci calisiyor mu?
10.7  NumPad ile miktar gir: 5
10.8  DURDUR tikla → Durus sebebi: "Malzeme Bekleme" sec
10.9  BASLAT → devam et
10.10 TAMAMLA tikla

      KONTROL: Vardiya ozeti ekraninda:
      - Toplam calisma suresi
      - Durus suresi ve sebebi
      - Tamamlanan miktar

10.11 Cikis yap → Admin ile tekrar giris:
      murat.altay@altayyazilim.com / AltayDef2026!@
```

---

# ═══════════════════════════════════════
# FAZ 11: KALITE MODULU — SORUN SENARYOLARI
# ═══════════════════════════════════════

## 11A: Kalite Sorunu 1 — Lens Kusuru (Roketsan Parti-1)

```
SENARYO: Roketsan Parti-1'den 1 adet durbunde lens yuzeyinde cizik tespit edildi.
TARIH: 03.01.2026
────────────────────────────────────────────────────────────

EKRAN: Kalite → NCR (/quality/ncr)

11A.1  Yeni NCR Olustur:
       - Tarih: 03.01.2026
       - Urun: Askeri Durbun (PRD-001)
       - Referans: Roketsan Parti-1, Seri No: DRB-2026-003
       - Ciddiyet: Orta
       - Kaynak: Uretim Ici
       - Tespit Asama: Son Kontrol
       - Aciklama: "Lens yuzeyinde 2mm cizik tespit edildi. Optik performansi etkileyebilir."
       - Tespit Eden: Fatma Celik (Kaliteci)
       - Miktar: 1 Adet
       KAYDET

11A.2  NCR durumunu "Inceleniyor" yap
       KONTROL: NCR No otomatik atandi mi? (NCR-2026-XXXXX)

11A.3  NCR karari: "Rework (Yeniden Isleme)"
       - Aksiyon: Lens degisimi yapilacak
       - Sorumlu: Elif Sahin
       - Hedef Tarih: 04.01.2026

       KONTROL: NCR durumu "Rework" olarak guncellendi mi?
```

```
EKRAN: Kalite → CAPA (/quality/capa)

11A.4  NCR'dan CAPA Olustur:
       - Tur: Duzeltici Faaliyet (Corrective Action)
       - Ilgili NCR: NCR-2026-XXXXX (11A.1'den)
       - Kok Neden Analizi:
         "Lens montaj istasyonunda (MONTAJ-01) pozisyonlama hassasiyeti kaybi.
          Jigin asinmasi nedeniyle lens yuzeyine temas olusmuş."
       - Kok Neden: Ekipman Asinmasi
       - Aksiyon Plani:
         1. Lens montaj jigi degistirilecek (Sorumlu: Kemal Yildirim, Tarih: 05.01.2026)
         2. Jig kontrol periyodu 500 adet'ten 250 adet'e dusurulecek
         3. Operator egitimi yapilacak
       - Oncelik: Yuksek
       KAYDET

       KONTROL: CAPA listesinde yeni kayit gorunuyor mu?
       KONTROL: CAPA durumu "Acik"?
```

```
EKRAN: Kalite → NCR → NCR-2026-XXXXX

11A.5  Rework tamamlandi:
       - Lens degistirildi, yeniden test yapildi
       - Sonuc: GECTI
       - NCR durumunu "Kapatildi" yap
       - Kapanis Notu: "Lens degisimi yapildi, optik test basarili."

       KONTROL: NCR kapatildi mi?
```

## 11B: Kalite Sorunu 2 — Mercek Odak Hatasi (Aselsan Parti)

```
SENARYO: Aselsan partisinden 1 adet durbunde mercek odak problemi.
         Tedarikci kaynakli sorun — mercek spesifikasyona uygun degil.
TARIH: 12.01.2026
────────────────────────────────────────────────────────────

EKRAN: Kalite → NCR (/quality/ncr)

11B.1  Yeni NCR Olustur:
       - Tarih: 12.01.2026
       - Urun: Mercek (MLZ-002)
       - Referans: Aselsan Parti, Lot No: MRC-2025-LOT02
       - Ciddiyet: Yuksek
       - Kaynak: Tedarikci
       - Tedarikci: Gorus Optik Sistemleri Ltd. Sti.
       - Tespit Asama: Kalibrasyon (Adim 4)
       - Aciklama: "Mercek odak mesafesi spesifikasyon disinda. Beklenen: 150mm ±0.5mm, Olculen: 152.3mm.
                    Tedarikci lot numarasi: MRC-2025-LOT02"
       - Tespit Eden: Zeynep Kara (Operasyon Sorumlusu)
       - Miktar: 1 Adet
       KAYDET

11B.2  NCR durumunu "Inceleniyor" yap

11B.3  NCR karari: "Red (Reject)"
       - Aksiyon: Tedarikciye iade edilecek, yeni mercek talep edilecek
       - Sorumlu: Kemal Yildirim
       - Not: "Tedarikci bilgilendirilecek, 8D raporu talep edilecek"

       KONTROL: NCR durumu "Red"?
```

```
EKRAN: Kalite → CAPA (/quality/capa)

11B.4  NCR'dan CAPA Olustur:
       - Tur: Onleyici Faaliyet (Preventive Action)
       - Ilgili NCR: NCR-2026-XXXXX (11B.1'den)
       - Kok Neden: Tedarikci Kalite Problemi
       - Aksiyon Plani:
         1. Gorus Optik'ten 8D raporu talep edildi (Tarih: 15.01.2026)
         2. Giris kontrol prosedurune mercek odak testi eklendi
         3. Tedarikci denetimi planlanacak (Tarih: 01.02.2026)
       KAYDET
```

```
EKRAN: Kalite → Tedarikci Degerlendirme
────────────────────────────────────────────────────────────

11B.5  Gorus Optik Sistemleri Ltd. Sti. degerlendirmesi:
       - Kalite Puani: %75 (dusuk — NCR nedeniyle)
       - Teslimat Puani: %90
       - Genel Puan: %82.5
       - Not: "Mercek lot kontrolu yetersiz. 8D raporu bekleniyor."

       KONTROL: Tedarikci karnesi listesinde gorunuyor mu?
```

## 11C: Giris Kontrol & Kalibrasyon

```
EKRAN: Kalite → Giris Kontrol (/quality/inspections)
────────────────────────────────────────────────────────────

11C.1  Yeni Giris Kontrol — Lens (1. Parti):
       - Tedarikci: Optik-Tek Lens San. A.S.
       - Malzeme: MLZ-001 Lens
       - Miktar: 10 Adet
       - Kontrol Tarihi: 28.12.2025
       - Kontrol Eden: Fatma Celik
       - Sonuc: GECTI
       - Not: "Tum lensler spesifikasyona uygun. Yuzey kalitesi A sinifi."
       KAYDET

11C.2  Yeni Giris Kontrol — Mercek (1. Parti):
       - Tedarikci: Gorus Optik Sistemleri Ltd. Sti.
       - Malzeme: MLZ-002 Mercek
       - Miktar: 15 Adet
       - Kontrol Tarihi: 28.12.2025
       - Kontrol Eden: Fatma Celik
       - Sonuc: GECTI (Not: Lot MRC-2025-LOT01, sorunlu lot LOT02 henuz gelmedi)
       KAYDET

11C.3  Yeni Giris Kontrol — Tutucu:
       - Tedarikci: Altin Metal San. Tic. Ltd. Sti.
       - Malzeme: MLZ-003 Tutucu
       - Miktar: 20 Adet
       - Kontrol Tarihi: 28.12.2025
       - Kontrol Eden: Fatma Celik
       - Sonuc: GECTI
       KAYDET

       KONTROL: 3 giris kontrol kaydi listede gorunuyor mu?
       KONTROL: Tumu "GECTI" durumunda mi?
```

```
EKRAN: Kalite → Kalibrasyon (/quality/calibration)
────────────────────────────────────────────────────────────

11C.4  Kalibrasyon Kaydi Ekle:
       - Cihaz Adi: Optik Test Cihazi
       - Cihaz Kodu: OTC-001
       - Son Kalibrasyon: 01.12.2025
       - Sonraki Kalibrasyon: 01.06.2026 (+6 ay)
       - Kalibrasyon Yapan: Fatma Celik
       - Sertifika No: KAL-2025-0158
       - Durum: Gecerli
       KAYDET

11C.5  Kalibrasyon Kaydi Ekle:
       - Cihaz Adi: Dijital Mikrometre
       - Cihaz Kodu: MIK-001
       - Son Kalibrasyon: 15.11.2025
       - Sonraki Kalibrasyon: 15.05.2026 (+6 ay)
       - Durum: Gecerli
       KAYDET

       KONTROL: 2 kalibrasyon kaydi listede, "Gecerli" durumunda?
```

---

# ═══════════════════════════════════════
# FAZ 12: SATIS FATURASI & TAHSILAT — ROKETSAN PARTI-1
# ═══════════════════════════════════════

```
EKRAN: Satis → Faturalar → Satis Faturasi (/invoices/sales)
────────────────────────────────────────────────────────────

12.1  Yeni Satis Faturasi:
      - Musteri: Roketsan A.S.
      - Fatura Tarihi: 01.01.2026
      - Kalem: PRD-001 Askeri Durbun x5 @ $20.000 = $100.000
      - KDV: %0 (savunma sanayi istisnasi)
      - Toplam: $100.000
      - Kur: 43.00 TL/$ → TRY karsiligi: 4.300.000 TL
      - Aciklama: "Roketsan Askeri Durbun Projesi - Parti 1"
      KAYDET

12.2  Faturayi "Gonderildi" yap
      KONTROL: Fatura No (F2026-XXXXX) atandi mi?

12.3  KONTROL: Cari bakiye:
      - Roketsan bize borclu: $100.000 (4.300.000 TL)
```

```
EKRAN: Fatura Detay → Odeme Ekle
────────────────────────────────────────────────────────────

12.4  Roketsan Odemesi (05.01.2026):
      - Fatura 12.1'i ac → "Odeme Ekle"
      - Tarih: 05.01.2026
      - Tutar: $100.000
      - Kur: 43.10 TL/$ → TRY: 4.310.000 TL
      - Yontem: Nakit
      - Hesap: Ana Kasa
      - Not: "Roketsan Parti-1 tam odeme"
      KAYDET

      KONTROL:
      - Ana Kasa bakiye: 50.000 + 4.310.000 = 4.360.000 TL
      - Roketsan cari: $0 (borcunu odedi)
      - Fatura durumu: "Odendi"
      - Kur farki geliri: ($100.000 x 43.10) - ($100.000 x 43.00) = 10.000 TL (pozitif)
```

---

# ═══════════════════════════════════════
# FAZ 13: URETIM & SATIS — ASELSAN (4 Adet)
# ═══════════════════════════════════════

## 13A: Satis Teklifi & Siparis

```
EKRAN: Satis → Teklifler (/offers)
────────────────────────────────────────────────────────────

13A.1  Yeni Teklif — Aselsan:
       - Musteri: Aselsan A.S.
       - Teklif Tarihi: 28.12.2025
       - Kalem: PRD-001 Askeri Durbun x4 @ $20.000 = $80.000
       - KDV: %0
       - Toplam: $80.000
       - Not: "Aselsan Gozlem Sistemleri Projesi"
       KAYDET → "Gonderildi" → "Kabul Edildi" → "Siparis Olustur"

13A.2  KONTROL: Siparis olusturuldu mu?
       - Musteri: Aselsan A.S.
       - Kalem: Askeri Durbun x4
       - Teslim Tarihi: 02.01.2026

13A.3  "Uretime Hazir Siparis Olustur" tikla
```

## 13B: Uretim (4 Adet)

```
EKRAN: Uretim → Is Emirleri (/production)
────────────────────────────────────────────────────────────

13B.1  Aselsan is emrini ac:
       - Miktar: 4
       - Sablon: Askeri Durbun Uretimi
       
       Stoktan cekilecek:
       - Lens: 4 Adet (stok: 5 → kalan: 1)
       - Mercek: 4 Adet (stok: 10 → kalan: 6)
       - Tutucu: 4 Adet (stok: 15 → kalan: 11)
       - Govde: 4 Adet (stok: 25 → kalan: 21)
       - Optik Cam: 8 Adet (stok: 50 → kalan: 42)
       - Montaj Seti: 4 Takim (stok: 25 → kalan: 21)

13B.2  Adim adim tamamla:
       - Adim 1: Lens Montaji → Elif Sahin → Tamamla
       - Adim 2: Mercek Entegrasyonu → Zeynep Kara → Tamamla
       - Adim 3: Govde Montaji → Hasan Demir → Tamamla
       - Adim 4: Kalibrasyon → Zeynep Kara → Tamamla
       - Adim 5: Son Kontrol → Fatma Celik → Tamamla

13B.3  KONTROL: Is emri "Tamamlandi"
       KONTROL: Mamul Deposu'nda 4 adet Askeri Durbun eklendi
```

## 13C: Satis Faturasi (Odeme 02.02.2026'da)

```
EKRAN: Satis → Faturalar → Satis Faturasi
────────────────────────────────────────────────────────────

13C.1  Yeni Satis Faturasi:
       - Musteri: Aselsan A.S.
       - Fatura Tarihi: 02.01.2026
       - Kalem: PRD-001 Askeri Durbun x4 @ $20.000 = $80.000
       - KDV: %0
       - Toplam: $80.000
       - Kur: 43.02 TL/$ → TRY: 3.441.600 TL
       KAYDET → "Gonderildi"

       KONTROL: Aselsan cari: $80.000 borclu (3.441.600 TL)
       KONTROL: Fatura durumu "Odenmedi"
```

---

# ═══════════════════════════════════════
# FAZ 14: SATIN ALMA — 2. TUR (Stok Yetersizligi)
# ═══════════════════════════════════════

```
SENARYO: Roketsan Parti-2 (10 adet) icin malzeme yetersiz.
Mevcut stok: Lens 1, Mercek 6, Tutucu 11
Ihtiyac: Lens 10, Mercek 10, Tutucu 10
Eksik: Lens 9+, Mercek 4+, Tutucu yeterli (11 ≥ 10)
→ Yeni satin alma: Lens 20, Mercek 10 (stok tampon icin fazla alinir)
────────────────────────────────────────────────────────────

EKRAN: Satinalma → Satin Alma Talepleri (/purchase-request)

14.1  Yeni Talep — Lens (2. Tur):
      - Talep Eden: Kemal Yildirim
      - Tarih: 04.01.2026
      - Kalem: MLZ-001 Lens x20 Adet
      - Oncelik: Acil
      - Aciklama: "Roketsan Parti-2 & 3 icin lens yetersiz. Acil tedarik."
      KAYDET → "Onaylandi"

14.2  Yeni Talep — Mercek (2. Tur):
      - Talep Eden: Kemal Yildirim
      - Tarih: 04.01.2026
      - Kalem: MLZ-002 Mercek x10 Adet
      - Oncelik: Acil
      - Aciklama: "Roketsan Parti-2 icin mercek yetersiz."
      KAYDET → "Onaylandi"
```

```
EKRAN: Satinalma → Satin Alma Siparisleri (/purchase-orders)
────────────────────────────────────────────────────────────

14.3  Yeni Siparis — Lens 2. Tur (teklif adimi atlaniyor — acil):
      - Tedarikci: Optik-Tek Lens San. A.S.
      - Kalem: MLZ-001 Lens x20 @ $50 = $1.000
      - Teslim Tarihi: 05.01.2026
      KAYDET → "Gonderildi"

14.4  Yeni Siparis — Mercek 2. Tur:
      - Tedarikci: Gorus Optik Sistemleri Ltd. Sti.
      - Kalem: MLZ-002 Mercek x10 @ $1.000 = $10.000
      - Teslim Tarihi: 05.01.2026
      KAYDET → "Gonderildi"

14.5  Teslim Al — Lens 20 Adet → Hammadde Deposu
14.6  Teslim Al — Mercek 10 Adet → Hammadde Deposu

      KONTROL: Guncel stok:
      - Lens: 1 + 20 = 21 Adet
      - Mercek: 6 + 10 = 16 Adet
      - Tutucu: 11 Adet
      - Govde: 21 Adet
      - Optik Cam: 42 Adet
      - Montaj Seti: 21 Takim
```

```
EKRAN: Satis → Faturalar → Alis Faturasi
────────────────────────────────────────────────────────────

14.7  Alis Faturasi — Lens 2. Tur:
      - Tedarikci: Optik-Tek Lens San. A.S.
      - Fatura Tarihi: 05.01.2026
      - Kalem: MLZ-001 Lens x20 @ $50 = $1.000 + KDV %20 = $1.200
      - Kur: 43.10 TL/$
      KAYDET → "Gonderildi"

14.8  Alis Faturasi — Mercek 2. Tur:
      - Tedarikci: Gorus Optik Sistemleri Ltd. Sti.
      - Fatura Tarihi: 05.01.2026
      - Kalem: MLZ-002 Mercek x10 @ $1.000 = $10.000 + KDV %20 = $12.000
      - Kur: 43.10 TL/$
      KAYDET → "Gonderildi"

      KONTROL: Guncel tedarikci borclari:
      - Optik-Tek: $600 (1. tur) + $1.200 (2. tur) = $1.800
      - Gorus Optik: $18.000 (1. tur) + $12.000 (2. tur) = $30.000
```

---

# ═══════════════════════════════════════
# FAZ 15: URETIM & SATIS — ROKETSAN PARTI-2 (10 Adet)
# ═══════════════════════════════════════

## 15A: Satis Teklifi & Siparis

```
EKRAN: Satis → Teklifler
────────────────────────────────────────────────────────────

15A.1  Yeni Teklif — Roketsan Parti-2:
       - Musteri: Roketsan A.S.
       - Teklif Tarihi: 05.01.2026
       - Kalem: PRD-001 Askeri Durbun x10 @ $20.000 = $200.000
       - KDV: %0
       - Not: "Roketsan Askeri Durbun - Parti 2"
       KAYDET → "Gonderildi" → "Kabul Edildi" → "Siparis Olustur"

15A.2  Siparis → "Uretime Hazir Siparis Olustur"
```

## 15B: Uretim (10 Adet)

```
EKRAN: Uretim → Is Emirleri
────────────────────────────────────────────────────────────

15B.1  Roketsan Parti-2 is emrini ac:
       - Miktar: 10
       
       Stoktan cekilecek:
       - Lens: 10 (stok: 21 → kalan: 11)
       - Mercek: 10 (stok: 16 → kalan: 6)
       - Tutucu: 10 (stok: 11 → kalan: 1)
       - Govde: 10 (stok: 21 → kalan: 11)
       - Optik Cam: 20 (stok: 42 → kalan: 22)
       - Montaj Seti: 10 (stok: 21 → kalan: 11)

15B.2  5 adim tamamla (9.3-9.7 ile ayni akis)
       KONTROL: Is emri "Tamamlandi"
```

## 15C: Satis Faturasi (ODEME YOK)

```
EKRAN: Satis → Faturalar → Satis Faturasi
────────────────────────────────────────────────────────────

15C.1  Yeni Satis Faturasi:
       - Musteri: Roketsan A.S.
       - Fatura Tarihi: 10.01.2026
       - Kalem: PRD-001 Askeri Durbun x10 @ $20.000 = $200.000
       - KDV: %0
       - Toplam: $200.000
       - Kur: 43.15 TL/$ → TRY: 8.630.000 TL
       KAYDET → "Gonderildi"

       KONTROL:
       - Fatura durumu: "Odenmedi"
       - Roketsan cari: $200.000 borclu (onceki Parti-1 odendi, sadece bu kaldi)
```

---

# ═══════════════════════════════════════
# FAZ 16: URETIM & SATIS — ROKETSAN PARTI-3 (8 Adet)
# ═══════════════════════════════════════

## 16A: Stok Kontrol & 3. Satin Alma (Gerekirse)

```
MEVCUT STOK (Parti-2 sonrasi):
- Lens: 11 Adet (8 icin yeterli ✓)
- Mercek: 6 Adet (8 icin yetersiz ✗ → 2 eksik)
- Tutucu: 1 Adet (8 icin yetersiz ✗ → 7 eksik)
- Govde: 11 Adet (yeterli ✓)
- Optik Cam: 22 Adet (16 gerekli, yeterli ✓)
- Montaj Seti: 11 Takim (yeterli ✓)

→ 3. Satin Alma Turu Gerekli: Mercek + Tutucu
────────────────────────────────────────────────────────────

EKRAN: Satinalma → Satin Alma Siparisleri

16A.1  Yeni Siparis — Mercek 3. Tur:
       - Tedarikci: Gorus Optik Sistemleri Ltd. Sti.
       - Kalem: MLZ-002 Mercek x10 @ $1.000 = $10.000
       - Teslim Tarihi: 14.01.2026
       KAYDET → "Gonderildi" → Teslim Al → Hammadde Deposu

16A.2  Yeni Siparis — Tutucu 3. Tur:
       - Tedarikci: Altin Metal San. Tic. Ltd. Sti.
       - Kalem: MLZ-003 Tutucu x15 @ $10 = $150
       - Teslim Tarihi: 14.01.2026
       KAYDET → "Gonderildi" → Teslim Al → Hammadde Deposu

       KONTROL: Guncel stok:
       - Lens: 11 | Mercek: 16 | Tutucu: 16
       - Govde: 11 | Optik Cam: 22 | Montaj Seti: 11

16A.3  Alis Faturalari:
       - Gorus Optik: $10.000 + KDV = $12.000, Kur: 43.15 TL/$
       - Altin Metal: $150 + KDV = $180, Kur: 43.15 TL/$
       KAYDET → "Gonderildi"
```

## 16B: Satis & Uretim

```
EKRAN: Satis → Teklifler
────────────────────────────────────────────────────────────

16B.1  Yeni Teklif — Roketsan Parti-3:
       - Musteri: Roketsan A.S.
       - Kalem: PRD-001 Askeri Durbun x8 @ $20.000 = $160.000
       - KDV: %0
       KAYDET → Kabul → Siparis Olustur → Uretime Al
```

```
EKRAN: Uretim → Is Emirleri
────────────────────────────────────────────────────────────

16B.2  Roketsan Parti-3 is emri:
       - Miktar: 8

       Stoktan cekilecek:
       - Lens: 8 (stok: 11 → kalan: 3)
       - Mercek: 8 (stok: 16 → kalan: 8)
       - Tutucu: 8 (stok: 16 → kalan: 8)
       - Govde: 8 (stok: 11 → kalan: 3)
       - Optik Cam: 16 (stok: 22 → kalan: 6)
       - Montaj Seti: 8 (stok: 11 → kalan: 3)

16B.3  5 adim tamamla
       KONTROL: Is emri "Tamamlandi"
```

## 16C: Satis Faturasi (ODEME YOK)

```
EKRAN: Satis → Faturalar → Satis Faturasi
────────────────────────────────────────────────────────────

16C.1  Yeni Satis Faturasi:
       - Musteri: Roketsan A.S.
       - Fatura Tarihi: 20.01.2026
       - Kalem: PRD-001 Askeri Durbun x8 @ $20.000 = $160.000
       - KDV: %0
       - Kur: 43.20 TL/$ → TRY: 6.912.000 TL
       KAYDET → "Gonderildi"

       KONTROL:
       - Fatura durumu: "Odenmedi"
       - Roketsan toplam acik bakiye: $200.000 + $160.000 = $360.000
```

---

# ═══════════════════════════════════════
# FAZ 17: ASELSAN TAHSILAT (02.02.2026)
# ═══════════════════════════════════════

```
EKRAN: Satis → Faturalar → Fatura Detay (Aselsan faturasi 13C.1)
────────────────────────────────────────────────────────────

17.1  Aselsan Faturasini ac → "Odeme Ekle":
      - Tarih: 02.02.2026
      - Tutar: $80.000
      - Kur: 43.50 TL/$ → TRY: 3.480.000 TL
      - Yontem: Havale
      - Hesap: Ziraat Bankasi
      - Not: "Aselsan tam odeme - Gozlem Sistemleri Projesi"
      KAYDET

      KONTROL:
      - Ziraat Bankasi bakiye: 189.692 + 3.480.000 = 3.669.692 TL
      - Aselsan cari: $0 (borcunu odedi)
      - Fatura durumu: "Odendi"
      - Kur farki: ($80.000 x 43.50) - ($80.000 x 43.02) = 38.400 TL (pozitif)
```

---

# ═══════════════════════════════════════
# FAZ 18: KASA/BANKA ISLEMLERI & KONTROL
# ═══════════════════════════════════════

```
EKRAN: Finans → Kasa/Banka (/accounting/cash-bank)
────────────────────────────────────────────────────────────

18.1  Kasa → Defter → Ana Kasa hareketleri:
      KONTROL:
      - Acilis: 50.000 TL
      - + Roketsan Parti-1 tahsilat: 4.310.000 TL (05.01.2026)
      - Guncel bakiye: 4.360.000 TL
      
      Hareket gecmisi dogru siralanmis mi?

18.2  Banka → Defter → Ziraat hareketleri:
      KONTROL:
      - Acilis: 200.000 TL
      - − Altin Metal odeme: 10.308 TL (28.12.2025)
      - + Aselsan tahsilat: 3.480.000 TL (02.02.2026)
      - Guncel bakiye: 3.669.692 TL
      
      Hareket gecmisi dogru mu?

18.3  Transfer Testi:
      - Ana Kasa'dan Ziraat Bankasi'na 1.000.000 TL transfer
      KONTROL:
      - Ana Kasa: 4.360.000 - 1.000.000 = 3.360.000 TL
      - Ziraat: 3.669.692 + 1.000.000 = 4.669.692 TL
```

---

# ═══════════════════════════════════════
# FAZ 19: CARI HESAP OZETI & YASLANDIRMA
# ═══════════════════════════════════════

```
EKRAN: Finans → Fatura Izleme (/invoices)
────────────────────────────────────────────────────────────

19.1  Filtre: Musteri = Roketsan
      KONTROL:
      | Fatura | Tarih | Tutar | Durum |
      |--------|-------|-------|-------|
      | Parti-1 | 01.01.2026 | $100.000 | Odendi |
      | Parti-2 | 10.01.2026 | $200.000 | Odenmedi |
      | Parti-3 | 20.01.2026 | $160.000 | Odenmedi |
      
      Toplam acik: $360.000

19.2  Filtre: Musteri = Aselsan
      KONTROL:
      | Fatura | Tarih | Tutar | Durum |
      |--------|-------|-------|-------|
      | Parti-1 | 02.01.2026 | $80.000 | Odendi |
```

```
EKRAN: Finans → Yaslandirma (/accounting/aging)
────────────────────────────────────────────────────────────

19.3  Musteri yaslandirma raporu:
      KONTROL — Roketsan:
      | Vade Dilimi | Tutar |
      |-------------|-------|
      | 0-30 gun | $160.000 (Parti-3, 20.01.2026) |
      | 31-60 gun | $200.000 (Parti-2, 10.01.2026) |
      | 61-90 gun | — |
      | 90+ gun | — |
      
      (Tarihler test kosma tarihine gore degisir)

19.4  Tedarikci yaslandirma raporu:
      KONTROL:
      - Optik-Tek: $1.800 acik
      - Gorus Optik: $42.000 acik ($18.000 + $12.000 + $12.000)
      - Altin Metal: $180 acik (3. tur faturasi)
```

---

# ═══════════════════════════════════════
# FAZ 20: BAKIM MODULU
# ═══════════════════════════════════════

```
EKRAN: Bakim → Bakim Planlari
────────────────────────────────────────────────────────────

20.1  Yeni Bakim Plani:
      - Makine: OPTIK-01 (Optik Kalibrasyon Cihazi)
      - Tur: Periyodik Bakim
      - Periyot: Haftalik
      - Aciklama: "Optik hizalama kontrolu ve temizlik"
      KAYDET

20.2  "Is Emri Olustur" tikla → Bakim is emri olusturuldu mu?

20.3  Bakim is emrini tamamla:
      - Yapilan islem: "Optik hizalama kontrolu tamamlandi, tum degerler tolerans icinde."
      - Tamamlayan: Kemal Yildirim
      KONTROL: Bakim gecmisinde kayit gorunuyor mu?
```

---

# ═══════════════════════════════════════
# FAZ 21: IK & VARDIYA
# ═══════════════════════════════════════

```
EKRAN: IK → Vardiya Planlama
────────────────────────────────────────────────────────────

21.1  Vardiya Tanimla:
      - Sabah Vardiyasi: 07:00 - 15:30 (30 dk mola)
      - Aksam Vardiyasi: 15:30 - 00:00 (30 dk mola)

21.2  Personel Atama:
      - Elif Sahin → Sabah Vardiyasi
      - Zeynep Kara → Sabah Vardiyasi
      - Hasan Demir → Sabah Vardiyasi
      - Fatma Celik → Sabah Vardiyasi
```

```
EKRAN: IK → Devam Takibi
────────────────────────────────────────────────────────────

21.3  Giris/Cikis kaydi olustur:
      - Hasan Demir: Giris 07:00, Cikis 15:30, Tarih: 29.12.2025
      KONTROL: Kayit listede gorunuyor mu?
```

```
EKRAN: IK → Izin Yonetimi
────────────────────────────────────────────────────────────

21.4  Yeni Izin Talebi:
      - Calisan: Elif Sahin
      - Tur: Yillik Izin
      - Baslangic: 06.01.2026
      - Bitis: 07.01.2026 (2 gun)
      - Aciklama: "Kisisel nedenler"
      KAYDET

21.5  Izni Onayla (Yonetici)
      KONTROL: Izin durumu "Onaylandi"?
      KONTROL: 06-07.01.2026 tarihlerinde Elif'in is emri atamalari etkileniyor mu?
```

```
EKRAN: IK → Yetkinlik & Sertifika
────────────────────────────────────────────────────────────

21.6  Yetkinlik Ekle — Hasan Demir:
      - Yetkinlik: Govde Montaj Istasyonu (MONTAJ-02) operatorlugu
      - Seviye: Uzman
      - Gecerlilik: Surekli

21.7  Sertifika Ekle — Fatma Celik:
      - Sertifika: AS9100 Ic Denetci
      - Veren Kurum: TUV SUD
      - Gecerlilik: 01.01.2025 - 01.01.2028
      KONTROL: Sertifika listede gorunuyor mu?
```

---

# ═══════════════════════════════════════
# FAZ 22: RAPORLAR, DASHBOARD & AI INSIGHTS
# ═══════════════════════════════════════

```
EKRAN: Ana Sayfa / Dashboard
────────────────────────────────────────────────────────────

22.1  Dashboard Kartlari Kontrol:
      KONTROL:
      - Toplam Satis: $440.000 (Roketsan $460.000 + Aselsan $80.000 = $540.000... 
        Hesap: 5x$20k + 10x$20k + 8x$20k + 4x$20k = $540.000)
      - Acik Alacak: $360.000 (Roketsan Parti-2 + Parti-3)
      - Tahsil Edilen: $180.000 (Parti-1 $100k + Aselsan $80k)
      - Uretim Tamamlanan: 27 adet
      - Acik NCR: Duruma gore (kapatilan varsa daha az)
      - Acik CAPA: 2 adet

22.2  Grafik Kontrol:
      - Aylik satis trendi gorunuyor mu?
      - Uretim performans grafigi gorunuyor mu?
```

```
EKRAN: Raporlar → KPI Dashboard
────────────────────────────────────────────────────────────

22.3  KPI Kartlari:
      - OEE (Overall Equipment Effectiveness)
      - Uretim Tamamlanma Orani: 27/27 = %100
      - Kalite Orani: 25/27 = %92.6 (2 NCR)
      - Zamaninda Teslim Orani
      - Tedarikci Performansi
```

```
EKRAN: Raporlar → Dinamik Rapor
────────────────────────────────────────────────────────────

22.4  Rapor: "Uretim Ozet" calistir
      KONTROL: Rapor verileri uretim kayitlariyla uyumlu mu?

22.5  Rapor: "Satis Analiz" calistir
      KONTROL: Musteri bazinda satis toplamlari dogru mu?
```

```
EKRAN: Raporlar → AI Insights
────────────────────────────────────────────────────────────

22.6  AI Insights Kontrol:
      Beklenen oneriler (varsa):
      - "Roketsan'dan $360.000 acik alacak var. Tahsilat takibi onerilir."
      - "Gorus Optik Sistemleri mercek kalitesinde sorun tespit edildi. Alternatif tedarikci arastirmasi onerilir."
      - "Lens stoku kritik seviyeye yaklasti (3 adet). Satin alma talebi olusturulmali."
      - "Govde stoku 3 adet — minimum stok seviyesi (5) altinda."
      - "Optik Cam stoku 6 adet — minimum stok seviyesi (10) altinda."
      
      KONTROL: AI insight sayfasi yukleniyor mu?
      KONTROL: En az 1 oneri/uyari gorunuyor mu?
```

```
EKRAN: Finans → Doviz Kurlari (/accounting/exchange-rates)
────────────────────────────────────────────────────────────

22.7  TCMB kur guncelleme:
      - "TCMB Guncelle" butonuna tikla
      KONTROL: USD/TRY kuru guncellendi mi?
      KONTROL: Son guncelleme tarihi gorunuyor mu?
```

---

# ═══════════════════════════════════════
# FAZ 23: DOSYA YONETIMI & YARDIM
# ═══════════════════════════════════════

```
EKRAN: Ayarlar → Dosya Yonetimi
────────────────────────────────────────────────────────────

23.1  Dosya Yukle:
      - Test dosyasi yukle (ornek: kalite-raporu.pdf, 1MB)
      KONTROL: Dosya listesinde gorunuyor mu?

23.2  Kota Kontrol:
      KONTROL: Kullanilan alan ve kota bilgisi gorunuyor mu?
```

```
EKRAN: Ayarlar → Terimler Sozlugu
────────────────────────────────────────────────────────────

23.3  Terimler Sozlugu sayfasi kontrol:
      KONTROL: Sayfa aciliyor mu? Terimler listeleniyor mu?
```

---

# ═══════════════════════════════════════
# OZET KONTROL TABLOSU
# ═══════════════════════════════════════

## Finansal Ozet (Tum islemler sonrasi)

### Musteri Cari Bakiyeleri
| Musteri | Toplam Satis | Tahsil Edilen | Acik Bakiye |
|---------|-------------|---------------|-------------|
| Roketsan A.S. | $460.000 | $100.000 | **$360.000** |
| Aselsan A.S. | $80.000 | $80.000 | $0 |
| **TOPLAM** | **$540.000** | **$180.000** | **$360.000** |

### Tedarikci Cari Bakiyeleri
| Tedarikci | Toplam Alis | Odenen | Acik Borc |
|-----------|------------|--------|-----------|
| Optik-Tek (Lens) | $1.800 | $0 | **$1.800** |
| Gorus Optik (Mercek) | $42.000 | $0 | **$42.000** |
| Altin Metal (Tutucu) | $420 | $240 | **$180** |
| **TOPLAM** | **$44.220** | **$240** | **$43.980** |

### Kasa / Banka Bakiyeleri (Transfer sonrasi)
| Hesap | Bakiye |
|-------|--------|
| Ana Kasa (TRY) | 3.360.000 TL |
| Dolar Kasa (USD) | $5.000 |
| Ziraat Bankasi (TRY) | 4.669.692 TL |

### Stok Durumu (Tum uretimler sonrasi)
| Malzeme | Kalan Stok | Min Stok | Durum |
|---------|-----------|----------|-------|
| Lens (MLZ-001) | 3 Adet | 10 | ⚠️ KRITIK |
| Mercek (MLZ-002) | 8 Adet | 5 | ✅ Normal |
| Tutucu (MLZ-003) | 8 Adet | 10 | ⚠️ Dusuk |
| Govde (MLZ-004) | 3 Adet | 5 | ⚠️ KRITIK |
| Optik Cam (MLZ-005) | 6 Adet | 10 | ⚠️ Dusuk |
| Montaj Seti (MLZ-006) | 3 Takim | 10 | ⚠️ KRITIK |

### Kalite Ozeti
| Metrik | Deger |
|--------|-------|
| Toplam Uretim | 27 adet |
| NCR Sayisi | 2 |
| CAPA Sayisi | 2 |
| Kalite Orani | %92.6 |
| Giris Kontrol | 3 (tumu GECTI) |
| Kalibrasyon | 2 cihaz (tumu GECERLI) |

---

## BAGIMLILIK SIRASI (Dependency Graph)

```
FAZ 0 (Tenant Olustur)
  │
  ├→ FAZ 1 (Birim, Rol, Is Adimlari)
  │    │
  │    ├→ FAZ 2 (Makine, Kullanici)
  │    │    │
  │    │    └→ FAZ 3 (Is Emri Sablonu)
  │    │         │
  │    │         └→ FAZ 9, 13B, 15B, 16B (Uretim)
  │    │              │
  │    │              └→ FAZ 10 (ShopFloor Terminal)
  │    │
  │    └→ FAZ 4 (Depo → Malzeme → Urun → BOM → Stok Giris)
  │
  ├→ FAZ 5 (Musteri + Tedarikci)
  │    │
  │    ├→ FAZ 7 (Satin Alma: Talep → Teklif → Siparis → Fatura)
  │    │    │
  │    │    └→ FAZ 14 (2. Satin Alma Turu)
  │    │         │
  │    │         └→ FAZ 16A (3. Satin Alma Turu)
  │    │
  │    ├→ FAZ 8 (Satis Teklif → Siparis → Roketsan-1)
  │    ├→ FAZ 13A (Satis → Aselsan)
  │    ├→ FAZ 15A (Satis → Roketsan-2)
  │    └→ FAZ 16B (Satis → Roketsan-3)
  │
  ├→ FAZ 6 (Kasa/Banka Hesaplar)
  │    │
  │    ├→ FAZ 12 (Roketsan-1 Fatura + Tahsilat)
  │    ├→ FAZ 13C (Aselsan Fatura)
  │    ├→ FAZ 15C (Roketsan-2 Fatura — ODEME YOK)
  │    ├→ FAZ 16C (Roketsan-3 Fatura — ODEME YOK)
  │    ├→ FAZ 17 (Aselsan Tahsilat)
  │    └→ FAZ 18 (Kasa/Banka Islemleri)
  │
  ├→ FAZ 11 (Kalite: NCR, CAPA, Giris Kontrol, Kalibrasyon)
  │    └── Bagimliliklari: Urun + Tedarikci + Makine + Uretim tamamlandi
  │
  ├→ FAZ 19 (Cari Hesap, Yaslandirma)
  ├→ FAZ 20 (Bakim)
  ├→ FAZ 21 (IK & Vardiya)
  ├→ FAZ 22 (Raporlar, Dashboard, AI Insights)
  └→ FAZ 23 (Dosya, Yardim)
```

---

## TEST KOSMA SIRASI (Onerilen)

```
1. FAZ 0  → Tenant & Giris
2. FAZ 1  → Tanimlar (Birim, Rol, Is Adimlari)
3. FAZ 2  → Makine & Personel
4. FAZ 3  → Is Emri Sablonu
5. FAZ 4  → Depo & Stok
6. FAZ 5  → Musteri & Tedarikci
7. FAZ 6  → Finans Kurulumu
8. FAZ 7  → 1. Satin Alma (Lens 10, Mercek 15, Tutucu 20)
9. FAZ 8  → Roketsan-1 Satis Teklif & Siparis
10. FAZ 9 → Roketsan-1 Uretim (5 adet)
11. FAZ 10 → ShopFloor Terminal
12. FAZ 13A-B → Aselsan Satis & Uretim (4 adet)
13. FAZ 12 → Roketsan-1 Fatura & Tahsilat ($100k → Kasa)
14. FAZ 13C → Aselsan Fatura (odeme 02.02'de)
15. FAZ 11 → Kalite Sorunlari (NCR, CAPA, Giris Kontrol)
16. FAZ 14 → 2. Satin Alma (Stok yetersizligi)
17. FAZ 15 → Roketsan-2 (10 adet) — ODEME YOK
18. FAZ 16 → Roketsan-3 (8 adet) — ODEME YOK
19. FAZ 17 → Aselsan Tahsilat ($80k → Banka)
20. FAZ 18 → Kasa/Banka Kontrol
21. FAZ 19 → Cari & Yaslandirma
22. FAZ 20 → Bakim
23. FAZ 21 → IK & Vardiya
24. FAZ 22 → Raporlar & AI Insights
25. FAZ 23 → Dosya & Yardim
```

---

**Toplam Kontrol Noktasi:** ~120+
**Toplam Faz:** 23
**Tahmini Test Sayisi (Playwright):** ~80-100 test case
