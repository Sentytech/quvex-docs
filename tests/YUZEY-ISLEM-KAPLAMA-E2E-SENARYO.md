# Yuzey Islem / Kaplama Atolyesi — Uctan Uca Test Senaryosu
# Fason Kaplama → Mal Kabul → Proses → Kalite Kontrol → Sertifika → Teslim

> **Firma:** Guven Kaplama Sanayi Ltd.Sti.
> **Sektor:** Yuzey islem / kaplama (fason)
> **Hizmetler:** Kadmiyum kaplama, nikel kaplama, krom kaplama, anodize (Tip II/III), pasivizasyon, fosfatlama, boya
> **Ekipman:** 8 kaplama hatti (tankli), kurutma firinlari, XRF kalinlik olcum cihazi, yapisma test seti
> **Standartlar:** AS9100, MIL-PRF-81706 (kadmiyum), MIL-A-8625 (anodize), AMS-QQ-N-290 (nikel), ASTM B117 (tuz spreyi)
> **Is Modeli:** FASON — musterinin parcasini alir, kaplama yapar, sertifika ile teslim eder
> **Musteriler:** ASELSAN alt yuklenicileri, savunma CNC atolyeleri, TAI alt yukleniciler
> **Test Tarihi:** 2026-04-10
> **Test Ortami:** quvex.io (production) veya localhost (development)
> **Test Suresi:** ~45 dakika
> **Adim Sayisi:** 35

---

# BILINEN KISITLAMALAR

Bu test senaryosu yazilirken Quvex ERP'nin mevcut modulleri ile yuzey islem sektorunun
ozel ihtiyaclari arasindaki uyumsuzluklar belirlenmistir:

| Kisitlama | Workaround |
|-----------|-----------|
| Banyo analizi (pH, konsantrasyon, sicaklik) icin ayri modul yok | Muayene kaydi olarak girilir, olcum degerleri muayene notuna yazilir |
| Kimyasal stok tuketim otomatik dusumu yok | Manuel stok hareketi ile dusulur |
| Tuz spreyi test suresi takibi (96 saat vb.) yok | Muayene notu + baslangic/bitis tarihi olarak girilir |
| Maskeleme detaylari icin ayri alan yok | Is emri notuna "MASKELEME: vida delikleri M4x3 adet, A yuzey" seklinde yazilir |
| Cevresel raporlama (REACH, atik beyani) yok | Harici sistem, Quvex'te sadece not |
| Hidrojen gevreklesme bake suresi otomatik uyari yok | Operasyon suresi olarak girilir, ShopFloor'da manuel takip |
| Banyo omru / kullanim sayisi takibi yok | Kimyasal stok karti notuna yazilir |
| Kaplama kalinlik olcum sonuclarini tablo olarak girme yok | Muayene notuna min/max/ortalama yazilir |

---

# ══════════════════════════════════════════════════════════════
# ADIM 0: KAYIT ve GIRIS
# ══════════════════════════════════════════════════════════════

## 0.1 Firma Kaydi
**Ekran:** /register
**API:** POST /TenantRegistration/self-register

```
Firma Adi:      Guven Kaplama Sanayi Ltd.Sti.
Alt Alan:       guvenkaplama  (guvenkaplama.quvex.io)
Ad Soyad:       Mehmet Guven
Email:          mehmet@guvenkaplama.com
Telefon:        312 555 7788
Sifre:          Kaplama2026!@#$
Sektor:         Yuzey Islem / Kaplama [dropdown]
```

**Dogrulama:**
- [ ] Kayit basarili, onboarding ekrani acildi
- [ ] Admin kullanici olusturuldu
- [ ] Tenant schema olusturuldu
- [ ] guvenkaplama.quvex.io alt alani aktif

**Bilinen Sorunlar:**
- ⚠️ "Yuzey Islem / Kaplama" sektor profili dropdown'da mevcut mu? Yoksa "Diger" secilecek

## 0.2 Onboarding Wizard
**Ekran:** /onboarding

```
Adim 1: Firma bilgileri
  Vergi No: 9876543210
  Vergi Dairesi: Ostim
  Adres: Organize Sanayi Bolgesi 12. Cad. No:8, Ankara
  Telefon: 0312 385 4455
  Faaliyet: Fason yuzey islem ve kaplama hizmetleri
Adim 2: Sektor secimi (zaten secildi)
Adim 3: Ilk kullanici davet (opsiyonel, atlanabilir)
```

**Dogrulama:**
- [ ] Onboarding tamamlandi
- [ ] Dashboard'a yonlendirildi

## 0.3 Ek Kullanicilar Olustur
**Ekran:** Ayarlar > Kullanicilar
**API:** POST /Users

```
Kullanici 1 (Kalite Muduru):
  Ad: Ayse Kalite
  Email: ayse.kalite@guvenkaplama.com
  Rol: Kalite Muduru
  Yetkiler: Muayene Goruntule, Muayene Kaydet, NCR Goruntule, NCR Kaydet,
            Sertifika Goruntule, Sertifika Kaydet, CoC Goruntule, CoC Kaydet

Kullanici 2 (Kaplama Operatoru):
  Ad: Hasan Operator
  Email: hasan@guvenkaplama.com
  Rol: Operator
  Yetkiler: ShopFloor Goruntule, Is Emri Goruntule, Operasyon Goruntule

Kullanici 3 (Depo / Mal Kabul):
  Ad: Veli Depo
  Email: veli@guvenkaplama.com
  Rol: Depo Sorumlusu
  Yetkiler: Stok Goruntule, Stok Kaydet, Depolar Goruntule
```

**Dogrulama:**
- [ ] 3 kullanici olusturuldu
- [ ] Her kullaniciya dogru yetkiler atandi
- [ ] Her kullanici kendi ekranina giris yapabiliyor

---

# ══════════════════════════════════════════════════════════════
# ADIM 1-2: MUSTERI KAYDI ve FASON IS TALEBI
# ══════════════════════════════════════════════════════════════

## Adim 1: Musteri Kaydi — Yildiz CNC
**Ekran:** Musteriler > Yeni Musteri
**API:** POST /Customer
**Rol:** Yonetici

```
Firma Adi:        Yildiz CNC Hassas Islem Ltd.Sti.
Tip:              customers
Vergi No:         1122334455
Vergi Dairesi:    Sincan
Adres:            OSTiM OSB 28. Cad. No:5, Ankara
Telefon:          0312 354 8899
Email:            info@yildizcnc.com.tr
Ilgili Kisi:      Murat Yildiz
Ilgili Tel:       532 444 8899
Not:              ASELSAN alt yuklenicisi. Savunma parcalari isliyor.
                  Anodize ve pasivizasyon talepleri yogun.
```

**Dogrulama:**
- [ ] Musteri kaydi basarili (201 Created)
- [ ] Musteri listesinde gorunuyor
- [ ] type=customers filtresi ile listeleniyor

## Adim 2: Fason Is Talebi — SubcontractOrder
**Ekran:** Fason Isler > Yeni Fason Is Emri
**API:** POST /SubcontractOrder
**Rol:** Yonetici

```
Musteri:          Yildiz CNC Hassas Islem Ltd.Sti.
Is Turu:          Kaplama — Tip III Sert Anodize
Referans No:      YC-2026-0042
Parca Adi:        Al 7075-T6 Optik Montaj Braketi
Parca Kodu:       OPT-BRK-7075
Malzeme:          Aluminyum 7075-T6
Miktar:           50 adet
Birim Fiyat:      185,00 TL
Toplam:           9.250,00 TL

Kaplama Spesifikasyonu:
  Proses:         Tip III Sert Anodize (Hard Anodize)
  Standart:       MIL-A-8625 Type III, Class 2
  Renk:           Siyah (Black Dye)
  Kalinlik:       50-75 mikron (0.050-0.075 mm)
  Yapisma:        ASTM D3359 Class 4B minimum
  Ek Gereksinim:  Maskeleme — M5 vida delikleri (6 adet) + alt montaj yüzeyi

Termin:           2026-04-25 (15 gun)
Oncelik:          Yuksek
Not:              ASELSAN projesi — AS9100 sertifika gerekli.
                  Parca sertlik durumu: T6 (SHT + Age).
                  Maskeleme detaylari teknik resimde belirtilmistir.
```

**Dogrulama:**
- [ ] SubcontractOrder olusturuldu (201 Created)
- [ ] Fason is listesinde "Beklemede" statusu ile gorunuyor
- [ ] Musteri bilgileri dogru eslesti
- [ ] Fiyat hesaplama dogru: 50 x 185 = 9.250 TL
- [ ] Termin tarihi 2026-04-25

**Bilinen Sorunlar:**
- ⚠️ SubcontractOrder FK sorunu — mevcut bilinen sorun (Defense Machining sprint'inden)
- ⚠️ Kaplama spesifikasyonu (kalinlik, standart, renk) icin ayri alan yok — Not alanina yazilir

---

# ══════════════════════════════════════════════════════════════
# ADIM 3-4: MAL KABUL ve LOT ATAMA
# ══════════════════════════════════════════════════════════════

## Adim 3: Musteri Parcalarini Mal Kabul
**Ekran:** Stok > Stok Girisi (veya Fason Isler > Mal Kabul)
**API:** POST /Stock/movement
**Rol:** Depo Sorumlusu (Veli Depo)

```
Hareket Tipi:     Giris (Fason Mal Kabul)
Urun:             OPT-BRK-7075 — Al 7075-T6 Optik Montaj Braketi
Miktar:           50 adet
Kaynak:           Yildiz CNC (musteri parcasi)
Depo:             Mal Kabul Deposu
Irsaliye No:      YC-IRS-2026-0042

Gorsel Kontrol Notu:
  - 50 adet sayildi, irsaliye ile uyumlu
  - CNC isleme kalitesi: Capak yok, yuzey puruzlulugu Ra 1.6 uygun
  - Parcalar koruyucu yagli ambalajda geldi
  - 2 parcada hafif cizik (kabul edilebilir seviye)
  - Maskeleme gereken bolgeler teknik resim ile karsilastirildi
```

**Dogrulama:**
- [ ] Stok girisi basarili
- [ ] Depo bakiyesi 50 adet gorunuyor
- [ ] Irsaliye numarasi kayitli

## Adim 4: Lot Numarasi Atama
**Ekran:** Stok > Lot / Seri Numarasi
**API:** POST /SerialNumber (veya /Lot)
**Rol:** Depo Sorumlusu

```
Lot No:           GK-ANO-2026-0042
Urun:             OPT-BRK-7075
Miktar:           50 adet
Malzeme:          Al 7075-T6
Musteri Ref:      YC-2026-0042
Giris Tarihi:     2026-04-10
Malzeme Sertifikasi: Musteri tarafindan saglanmistir (7075-T6 mill cert)
```

**Dogrulama:**
- [ ] Lot numarasi atandi: GK-ANO-2026-0042
- [ ] Lot, stok hareketi ile iliskilendirildi
- [ ] Malzeme sertifikasi notu kayitli

---

# ══════════════════════════════════════════════════════════════
# ADIM 5-6: KAPLAMA HATTI KONTROLLERI ve ON ISLEM PLANI
# ══════════════════════════════════════════════════════════════

## Adim 5: Kaplama Hatti / Banyo Analizi Kontrolu
**Ekran:** Muayene > Yeni Muayene Kaydi (Proses Ici)
**API:** POST /Inspection
**Rol:** Kalite Muduru (Ayse Kalite)

Banyo analizleri Quvex'te ayri modul olmadigi icin muayene kaydi olarak girilir.

```
Muayene Tipi:     Proses Ici Kontrol — Banyo Analizi
Is Emri Ref:      GK-ANO-2026-0042
Tarih:            2026-04-11

Anodize Hatti (Hat 3) — Sulfurik Asit Banyosu:
  Olcum 1: Sulfurik asit konsantrasyonu
    Hedef:        165-185 g/L
    Olculen:      172 g/L
    Sonuc:        UYGUN ✓
  Olcum 2: Aluminyum iyonu konsantrasyonu
    Hedef:        < 20 g/L
    Olculen:      8.5 g/L
    Sonuc:        UYGUN ✓
  Olcum 3: Banyo sicakligi
    Hedef:        -2°C ile +2°C arasi (sert anodize icin)
    Olculen:      0.5°C
    Sonuc:        UYGUN ✓
  Olcum 4: Rektifiyer akimi
    Hedef:        24 ASF (Amper/ft2) ayarli
    Olculen:      24 ASF
    Sonuc:        UYGUN ✓

Anot Kontrol:
  Durum:          Kursun anot %85 verimli, degisim gerektirmiyor
  Sonuc:          UYGUN ✓

Genel Sonuc:      UYGUN — Hat 3 uretime hazir
```

**Dogrulama:**
- [ ] Muayene kaydi olusturuldu
- [ ] Banyo parametreleri muayene notunda kayitli
- [ ] Sonuc: UYGUN olarak islendi
- [ ] Hat 3 uretime hazir durumda

**Bilinen Sorunlar:**
- ⚠️ Banyo analiz sonuclari (konsantrasyon, pH) icin yapisal alan yok — serbest metin
- ⚠️ Banyo omru / toplam Ah (Amper-saat) takibi yok

## Adim 6: Operasyon Routing Olusturma — Anodize Is Emri
**Ekran:** Uretim > Is Emri > Operasyonlar
**API:** POST /WorkOrder + POST /Operation (coklu)
**Rol:** Yonetici

```
Is Emri No:       IE-GK-2026-0042
Urun:             OPT-BRK-7075 — Al 7075-T6 Optik Montaj Braketi
Miktar:           50 adet
Fason Ref:        SubcontractOrder YC-2026-0042
Lot:              GK-ANO-2026-0042

Operasyon Plani:
  Op10: Yag Alma (Alkalin Temizleme)
    Makine:       Alkalin Temizleme Tanki (TK-01)
    Sure:         15 dk
    Sicaklik:     55-65°C
    Not:          Alkalin degreaser, ultrasonik destekli

  Op20: Asit Daglama (Deoxidizer)
    Makine:       Asit Daglama Tanki (TK-02)
    Sure:         5 dk
    Sicaklik:     Oda sicakligi
    Not:          Kromat-fosforik asit deoxidizer (MIL-A-8625 uyumlu)

  Op30: Maskeleme
    Makine:       Maskeleme Tezgahi (MASK-01)
    Sure:         45 dk (50 parca)
    Not:          MASKELEME DETAY:
                  - M5 vida delikleri (6 adet/parca) — silikon tapa
                  - Alt montaj yuzeyi (23x45mm alan) — maskeleme bandi
                  - Teknik resim ref: OPT-BRK-7075-REV-C sayfa 2

  Op40: Anodize (Sulfurik Asit — Sert Anodize)
    Makine:       Anodize Hatti 3 (ANO-03)
    Sure:         45 dk
    Sicaklik:     0°C (± 2°C)
    Akim:         24 ASF
    Not:          Tip III sert anodize, MIL-A-8625 Type III Class 2
                  Hedef kalinlik: 50-75 mikron
                  Banyo: Sulfurik asit 170 g/L

  Op50: Boyama (Siyah Organik Boya)
    Makine:       Boya Tanki (DYE-01)
    Sure:         15 dk
    Sicaklik:     60°C
    Not:          Siyah organik boya, yogunluk kontrolu yapildi

  Op60: Sizdimazlik (Sealing)
    Makine:       Sealing Tanki (SEAL-01)
    Sure:         30 dk
    Sicaklik:     95-100°C (sicak su sealing)
    Not:          Sicak su sealing, DI water, pH 5.5-6.5

  Op70: Maskeleme Sokme
    Makine:       Maskeleme Tezgahi (MASK-01)
    Sure:         20 dk
    Not:          Silikon tapalar ve maskeleme bantlari sokuldu
                  Maskeleme alti yuzey kontrol: temiz, hasar yok

  Op80: Son Temizleme + Kurutma
    Makine:       Kurutma Firini (FRN-01)
    Sure:         30 dk
    Sicaklik:     65°C
    Not:          DI su ile son durulama + sicak hava kurutma
```

**Dogrulama:**
- [ ] Is emri olusturuldu: IE-GK-2026-0042
- [ ] 8 operasyon sirasiyla tanimlandi (Op10-Op80)
- [ ] Her operasyona makine atandi
- [ ] Maskeleme detaylari Op30 notuna yazildi
- [ ] Anodize parametreleri (sicaklik, akim, sure) Op40 notuna yazildi
- [ ] Toplam proses suresi hesaplandi

---

# ══════════════════════════════════════════════════════════════
# ADIM 7-10: KAPLAMA PROSES YURUTME (SHOPFLOOR)
# ══════════════════════════════════════════════════════════════

## Adim 7: ShopFloor — Kaplama Operatoru On Islem Baslat
**Ekran:** ShopFloor Terminal
**API:** POST /ShopFloor/start-operation
**Rol:** Operator (Hasan Operator)

```
Operator:         Hasan Operator (barkod/kart ile giris)
Is Emri:          IE-GK-2026-0042
Operasyon:        Op10 — Yag Alma

Baslat:           2026-04-11 08:00
Bitis:            2026-04-11 08:15
Miktar:           50 adet (tum lot)
Durum:            Tamamlandi ✓

Not:              Alkalin temizleme 60°C, 15 dk. Parcalar yuzey temiz.
```

**Sonraki operasyonlari sirayla tamamla:**

```
Op20: Asit Daglama
  Baslat: 08:20 → Bitis: 08:25 → 50 adet ✓
  Not: Deoxidizer 5 dk, durulama yapildi

Op30: Maskeleme
  Baslat: 08:30 → Bitis: 09:15 → 50 adet ✓
  Not: 50 parcada toplam 300 vida deligi maskelendi + 50 alt yuzey maskelendi

Op40: Anodize (KRITIK OPERASYON)
  Baslat: 09:30 → Bitis: 10:15 → 50 adet ✓
  Not: Sulfurik asit banyosu, 0°C, 24 ASF, 45 dk.
        Akim sabitleme: 10 dk ramp-up + 35 dk sabit.
        Banyo lot: BANYO-ANO03-2026-04

Op50: Boyama
  Baslat: 10:20 → Bitis: 10:35 → 50 adet ✓
  Not: Siyah organik boya, 60°C, 15 dk. Renk homojen.

Op60: Sealing
  Baslat: 10:40 → Bitis: 11:10 → 50 adet ✓
  Not: Sicak su sealing, 96°C, 30 dk. pH: 5.8

Op70: Maskeleme Sokme
  Baslat: 11:15 → Bitis: 11:35 → 50 adet ✓
  Not: Tum maskelemeler sokuldu. Maskeleme alti yuzeyler temiz.

Op80: Son Temizleme + Kurutma
  Baslat: 11:40 → Bitis: 12:10 → 50 adet ✓
  Not: DI su durulama + 65°C kurutma. Parcalar ambalaja hazir.
```

**Dogrulama:**
- [ ] 8 operasyon sirasi ile tamamlandi
- [ ] Her operasyonda baslangic/bitis zamani kayitli
- [ ] ShopFloor'da is emri "Tamamlandi" statusune gecti
- [ ] Toplam proses suresi: ~4 saat 10 dk
- [ ] Operator adi her operasyonda kayitli

## Adim 8: Proses Ici Kontrol — Anodize Sonrasi Hizli Kalinlik
**Ekran:** Muayene > Yeni Muayene (Proses Ici)
**API:** POST /Inspection
**Rol:** Kalite Muduru (Ayse Kalite)

Op40 (Anodize) tamamlandiktan hemen sonra, sealing oncesi hizli kalinlik kontrolu:

```
Muayene Tipi:     Proses Ici — Kalinlik On Kontrol
Is Emri:          IE-GK-2026-0042
Operasyon Ref:    Op40 Anodize
Tarih:            2026-04-11 10:20

Olcum Cihazi:     XRF Kalinlik Olcer (Fischer XDL-B)
Olcum Yontemi:    Eddy-current (aluminyum uzerinde anodize)

Numune: 3 parca (partiden rastgele)
  Parca 1:  Nokta-A: 62 µm | Nokta-B: 58 µm | Nokta-C: 65 µm
  Parca 2:  Nokta-A: 55 µm | Nokta-B: 60 µm | Nokta-C: 63 µm
  Parca 3:  Nokta-A: 59 µm | Nokta-B: 57 µm | Nokta-C: 61 µm

Min: 55 µm | Max: 65 µm | Ortalama: 60 µm
Hedef Aralik: 50-75 µm

Sonuc: UYGUN ✓ — Sealing'e devam edilebilir
```

**Dogrulama:**
- [ ] Proses ici muayene kaydi olusturuldu
- [ ] Kalinlik degerleri muayene notunda kayitli
- [ ] Sonuc UYGUN — devam karari verildi

---

# ══════════════════════════════════════════════════════════════
# ADIM 9-12: KALITE KONTROL ve MUAYENE
# ══════════════════════════════════════════════════════════════

## Adim 9: Son Muayene — Kalinlik Olcumu (Tam Kontrol)
**Ekran:** Muayene > Son Muayene > Yeni
**API:** POST /FinalInspection
**Rol:** Kalite Muduru (Ayse Kalite)

```
Muayene Tipi:     Son Muayene — Kaplama Kalinlik Olcumu
Is Emri:          IE-GK-2026-0042
Lot:              GK-ANO-2026-0042
Tarih:            2026-04-11 13:00
Standart:         MIL-A-8625 Type III, Class 2

Olcum Cihazi:     XRF Kalinlik Olcer (Fischer XDL-B)
                  Kalibrasyon: GK-KAL-2026-003 (gecerlilik: 2026-09-15)

Numune Plani:     AQL — her partiden 5 parca, parca basina 3 nokta

Parca 01: Nokta-A: 63 µm | Nokta-B: 58 µm | Nokta-C: 67 µm | Ort: 62.7 µm ✓
Parca 02: Nokta-A: 55 µm | Nokta-B: 61 µm | Nokta-C: 59 µm | Ort: 58.3 µm ✓
Parca 03: Nokta-A: 71 µm | Nokta-B: 66 µm | Nokta-C: 68 µm | Ort: 68.3 µm ✓
Parca 04: Nokta-A: 52 µm | Nokta-B: 57 µm | Nokta-C: 54 µm | Ort: 54.3 µm ✓
Parca 05: Nokta-A: 43 µm | Nokta-B: 47 µm | Nokta-C: 45 µm | Ort: 45.0 µm ✗ RED!

Lot Ozet:
  Min: 43 µm (Parca 05, Nokta-A) — SPEK DISI (hedef min 50 µm)
  Max: 71 µm (Parca 03, Nokta-A)
  Ortalama: 57.7 µm

Sonuc: KOSULLU KABUL — 1 parca ret (Parca 05)
       49 parca UYGUN, 1 parca kalinlik yetersiz
```

**Dogrulama:**
- [ ] Son muayene kaydi olusturuldu
- [ ] 5 parca x 3 nokta = 15 olcum kayitli
- [ ] Parca 05 kalinlik yetersiz olarak isaretlendi
- [ ] Genel sonuc: KOSULLU KABUL

## Adim 10: Yapisma Testi (Tape Test)
**Ekran:** Muayene > Yeni Muayene
**API:** POST /Inspection
**Rol:** Kalite Muduru

```
Muayene Tipi:     Yapisma Testi (Adhesion Test)
Is Emri:          IE-GK-2026-0042
Standart:         ASTM D3359 Method B (Cross-Cut Tape Test)

Test Proseduru:
  1. Capraz kesim yapildi (1mm aralikli grid, 25 kare)
  2. 3M 250 bandi uygulanarak 90° ile cekildi
  3. Kopma degerlendirmesi yapildi

Numune: 2 parca
  Parca 01: 5B (hic kopma yok, %0) → UYGUN ✓
  Parca 02: 4B (%5'ten az kopma) → UYGUN ✓ (minimum 4B gerekli)

Hedef:            ASTM D3359 Class 4B minimum
Sonuc:            UYGUN ✓
```

**Dogrulama:**
- [ ] Yapisma testi kaydi olusturuldu
- [ ] Her iki numune de 4B veya ustu
- [ ] ASTM D3359 referansi kayitli
- [ ] Sonuc: UYGUN

## Adim 11: Renk Kontrolu
**Ekran:** Muayene > Yeni Muayene
**API:** POST /Inspection
**Rol:** Kalite Muduru

```
Muayene Tipi:     Gorsel Kontrol — Renk
Is Emri:          IE-GK-2026-0042

Kontrol:
  Referans:       Siyah anodize renk kartelasi (RAL 9005 benzeri)
  Isik:           D65 standart isik altinda
  Yuzey:          Mat siyah, homojen, leke/cizik yok
  Maskeleme bolgesi: Temiz, kaplama tasmasi yok

Numune: 5 parca gorsel kontrol
  Sonuc:          5/5 UYGUN ✓
```

**Dogrulama:**
- [ ] Renk kontrol muayenesi kayitli
- [ ] Gorsel sonuc: UYGUN

## Adim 12: NCR — Kalinlik Yetersiz Parca (Parca 05)
**Ekran:** Kalite > NCR (Uygunsuzluk Raporu) > Yeni
**API:** POST /MRB (Material Review Board)
**Rol:** Kalite Muduru

```
NCR No:           NCR-GK-2026-0012
Is Emri:          IE-GK-2026-0042
Lot:              GK-ANO-2026-0042
Parca:            Parca 05 (seri: OPT-BRK-05)
Uygunsuzluk:      Kaplama kalinligi yetersiz
Detay:            Kalinlik olcumu: 43-47 µm (hedef: 50-75 µm)
                  MIL-A-8625 Type III minimum kalinlik: 50 µm
                  Parca spesifikasyon disinda.

Kok Neden Analizi:
  Olasi neden:    Parca anodize rack'inda uc pozisyonda,
                  akim dagilimsizligi (edge effect tersi)
  Onleyici aksiyon: Rack yerlesim plani gozden gecirilecek

Karar:            YENIDEN ISLEM (Rework)
Aksiyon:          1. Mevcut anodize tabakasini soy (NaOH cozeltisi)
                  2. Yuzey hazirlik (deoxidize)
                  3. Yeniden anodize (ayni parametreler)
                  4. Yeniden kalinlik olcum
Sorumlu:          Hasan Operator + Ayse Kalite
Termin:           2026-04-13
```

**Dogrulama:**
- [ ] NCR kaydi olusturuldu: NCR-GK-2026-0012
- [ ] MRB karari: YENIDEN ISLEM (Rework)
- [ ] Aksiyon plani tanimli
- [ ] Sorumlu ve termin atandi

---

# ══════════════════════════════════════════════════════════════
# ADIM 13-14: YENIDEN ISLEM (REWORK) ve TEKRAR KONTROL
# ══════════════════════════════════════════════════════════════

## Adim 13: Rework — Parca 05 Soyma + Yeniden Anodize
**Ekran:** ShopFloor Terminal
**API:** POST /ShopFloor/start-operation (ek operasyonlar)
**Rol:** Operator (Hasan Operator)

```
Is Emri:          IE-GK-2026-0042 (devam)
NCR Ref:          NCR-GK-2026-0012

Ek Operasyonlar (Rework):
  Op90: Anodize Soyma
    Makine:       Soyma Tanki (STR-01)
    Sure:         20 dk
    Not:          NaOH %10, 60°C. Anodize tabakasi tamamen sokuldu.
    Sonuc:        Tamamlandi ✓

  Op91: Yuzey Hazirlik (Deoxidize)
    Makine:       TK-02
    Sure:         5 dk
    Sonuc:        Tamamlandi ✓

  Op92: Yeniden Anodize
    Makine:       ANO-03
    Sure:         48 dk (biraz uzun tutuldu — kalinlik artisi icin)
    Not:          Ayni parametreler, rack orta pozisyon.
    Sonuc:        Tamamlandi ✓

  Op93: Boyama + Sealing
    Sure:         45 dk (boyama 15dk + sealing 30dk)
    Sonuc:        Tamamlandi ✓

  Op94: Kurutma
    Sure:         30 dk
    Sonuc:        Tamamlandi ✓
```

**Dogrulama:**
- [ ] Rework operasyonlari eklendi ve tamamlandi
- [ ] NCR referansi ile iliskilendirildi
- [ ] Rework sureci toplam ~2.5 saat

## Adim 14: Rework Sonrasi Tekrar Muayene
**Ekran:** Muayene > Son Muayene > Yeni
**API:** POST /FinalInspection
**Rol:** Kalite Muduru

```
Muayene Tipi:     Rework Sonrasi Kontrol
NCR Ref:          NCR-GK-2026-0012
Parca:            Parca 05

Kalinlik Olcumu:
  Nokta-A: 61 µm | Nokta-B: 58 µm | Nokta-C: 64 µm
  Ortalama: 61.0 µm
  Sonuc: UYGUN ✓ (50-75 µm araliginda)

Yapisma Testi:
  Sonuc: 5B → UYGUN ✓

Renk:
  Sonuc: Siyah, homojen, diger parcalarla uyumlu → UYGUN ✓

NCR Kapatma:
  Sonuc: BASARILI — Parca 05 yeniden islem sonrasi kabul
```

**Dogrulama:**
- [ ] Rework sonrasi muayene UYGUN
- [ ] NCR-GK-2026-0012 kapatildi
- [ ] Parca 05 kabul edildi
- [ ] Toplam lot: 50/50 UYGUN

---

# ══════════════════════════════════════════════════════════════
# ADIM 15-16: SERTIFIKA ve TESLIMAT
# ══════════════════════════════════════════════════════════════

## Adim 15: Kaplama Sertifikasi / CoC Olustur
**Ekran:** Kalite > CoC (Certificate of Conformance) > Yeni
**API:** POST /CertificateOfConformance
**Rol:** Kalite Muduru

```
Sertifika No:     CoC-GK-2026-0042
Musteri:          Yildiz CNC Hassas Islem Ltd.Sti.
Musteri Ref:      YC-2026-0042
Parca:            Al 7075-T6 Optik Montaj Braketi (OPT-BRK-7075)
Miktar:           50 adet
Lot:              GK-ANO-2026-0042

Proses Detaylari:
  Kaplama:        Tip III Hard Anodize (Sulfuric Acid)
  Standart:       MIL-A-8625 Type III, Class 2
  Renk:           Siyah (Black Dye)

Test Sonuclari:
  Kalinlik:
    Yontem:       Eddy-current (Fischer XDL-B, Kal: GK-KAL-2026-003)
    Min:          52 µm (rework sonrasi guncellenmis)
    Max:          71 µm
    Ortalama:     60.2 µm
    Spesifikasyon: 50-75 µm → UYGUN

  Yapisma:
    Yontem:       ASTM D3359 Method B (Cross-Cut Tape Test)
    Sonuc:        Class 4B-5B → UYGUN (min 4B gerekli)

  Gorsel:
    Renk:         Siyah, homojen, mat
    Yuzey:        Kusursuz, cizik/leke yok

Banyo Bilgileri:
  Banyo Lot:      BANYO-ANO03-2026-04
  Proses Tarihi:  2026-04-11

Operator:         Hasan Operator
Kalite Onay:      Ayse Kalite (Kalite Muduru)
Tarih:            2026-04-12

Beyanlar:
  "Bu sertifika, yukarida belirtilen parcalarin MIL-A-8625 Type III Class 2
   gereksinimlerine uygun olarak kaplandigini ve test edildigini beyan eder.
   Islem AS9100 kalite yonetim sistemi kapsaminda gerceklestirilmistir."
```

**Dogrulama:**
- [ ] CoC olusturuldu: CoC-GK-2026-0042
- [ ] Tum test sonuclari dahil (kalinlik, yapisma, gorsel)
- [ ] Standart referanslari dogru (MIL-A-8625, ASTM D3359)
- [ ] Operator ve kalite onay isimleri kayitli
- [ ] PDF olarak indirilebilir / yazdirilabilir

## Adim 16: Teslimat + Fatura
**Ekran:** Stok > Stok Cikisi + Finans > Fatura > Yeni
**API:** POST /Stock/movement + POST /Invoice
**Rol:** Yonetici

### 16a: Stok Cikisi (Sevkiyat)
```
Hareket Tipi:     Cikis (Fason Teslim)
Urun:             OPT-BRK-7075
Miktar:           50 adet
Hedef:            Yildiz CNC (musteri iade)
Irsaliye No:      GK-IRS-2026-0042
Lot:              GK-ANO-2026-0042
Ekler:            CoC-GK-2026-0042 (kaplama sertifikasi)
```

### 16b: Fason Is Faturasi
```
Fatura No:        GK-FTR-2026-0042
Musteri:          Yildiz CNC Hassas Islem Ltd.Sti.
Fason Ref:        SubcontractOrder YC-2026-0042

Kalem:
  Tip III Sert Anodize (MIL-A-8625)
  Parca: OPT-BRK-7075 Al 7075-T6 Optik Montaj Braketi
  Miktar: 50 adet
  Birim Fiyat: 185,00 TL
  Ara Toplam: 9.250,00 TL
  KDV (%20): 1.850,00 TL
  Toplam: 11.100,00 TL

Vade:             30 gun (2026-05-12)
```

**Dogrulama:**
- [ ] Stok cikisi yapildi, depo bakiyesi 0
- [ ] Irsaliye numarasi kayitli
- [ ] Fatura olusturuldu: 11.100 TL (KDV dahil)
- [ ] SubcontractOrder statusu "Tamamlandi" olarak guncellendi
- [ ] CoC sertifikasi fatura/irsaliye ile iliskilendirildi

---

# ══════════════════════════════════════════════════════════════
# ADIM 17-22: IKINCI SENARYO — KADMIYUM KAPLAMA
# ══════════════════════════════════════════════════════════════

## Adim 17: Ikinci Musteri Kaydi — Anka Muhendislik (TAI alt yuklenici)
**Ekran:** Musteriler > Yeni Musteri
**API:** POST /Customer
**Rol:** Yonetici

```
Firma Adi:        Anka Muhendislik ve Savunma San. A.S.
Tip:              customers
Vergi No:         5566778899
Vergi Dairesi:    Cayyolu
Adres:            Savunma Sanayi Bolgesi Lot 14, Ankara
Telefon:          0312 488 5566
Email:            siparis@ankamuh.com.tr
Ilgili Kisi:      Zeynep Korkmaz
Not:              TAI alt yuklenicisi. Celik ve titanyum parca isleme.
                  Kadmiyum ve nikel kaplama talepleri.
                  NADCAP kaplama sertifikasi soruyor (mevcut degil — bilgilendir)
```

**Dogrulama:**
- [ ] Musteri kaydi basarili
- [ ] NADCAP uyarisi not olarak kayitli

## Adim 18: Kadmiyum Kaplama Fason Talebi
**Ekran:** Fason Isler > Yeni Fason Is Emri
**API:** POST /SubcontractOrder
**Rol:** Yonetici

```
Musteri:          Anka Muhendislik ve Savunma San. A.S.
Is Turu:          Kadmiyum Kaplama + Kromat Donusum
Referans No:      AN-2026-0088
Parca Adi:        AISI 4340 Baglanti Elemani (Bolt)
Parca Kodu:       BLT-4340-M12
Malzeme:          Celik 4340 (Isil islem: Q&T, 42-46 HRC)
Miktar:           100 adet
Birim Fiyat:      95,00 TL
Toplam:           9.500,00 TL

Kaplama Spesifikasyonu:
  Proses:         Kadmiyum Kaplama + Kromat Donusum Kaplama
  Standart:       MIL-PRF-81706 (QQ-P-416 yerine), Class 1, Type II
                  Kromat: Class 1A (Gold/Iridescent)
  Kalinlik:       8-13 mikron (0.008-0.013 mm)
  Yapisma:        ASTM B571
  Tuz Spreyi:     96 saat minimum (ASTM B117)

  KRITIK NOT — Hidrojen Gevreklesme:
    Parca sertligi 42-46 HRC (>40 HRC siniri asildigi icin)
    Hidrojen gevreklesme giderme (bake) ZORUNLU:
    190°C (± 15°C) / minimum 23 saat
    Kaplama sonrasi 4 saat icinde baslatilmali!

  Cevresel Not:
    Kadmiyum REACH Ek XIV — kisitli madde.
    Savunma sektoru muafiyeti gecerli.
    Atik kadmiyum cozeltisi → lisansli atik firmasina teslim.

Termin:           2026-04-30
Oncelik:          Normal
```

**Dogrulama:**
- [ ] SubcontractOrder olusturuldu
- [ ] MIL-PRF-81706 referansi kayitli
- [ ] Hidrojen gevreklesme uyarisi notta belirtildi
- [ ] Birim fiyat ve toplam dogru: 100 x 95 = 9.500 TL

## Adim 19: Kadmiyum Kaplama Is Emri ve Operasyon Routing
**Ekran:** Uretim > Is Emri > Yeni + Operasyonlar
**API:** POST /WorkOrder + POST /Operation
**Rol:** Yonetici

```
Is Emri No:       IE-GK-2026-0088
Urun:             BLT-4340-M12 — AISI 4340 Baglanti Elemani
Miktar:           100 adet
Lot:              GK-CD-2026-0088

Operasyon Plani:
  Op10: Yag Alma (Elektrolitik)
    Makine:       Elektrolitik Yag Alma Tanki (EL-01)
    Sure:         10 dk
    Not:          Celik parca — elektrolitik alkalin temizleme

  Op20: Asit Aktivasyon
    Makine:       HCl Aktivasyon Tanki (ACT-01)
    Sure:         3 dk
    Not:          %10 HCl, oda sicakligi

  Op30: Kadmiyum Kaplama
    Makine:       Kadmiyum Kaplama Tanki (CD-01)
    Sure:         35 dk
    Not:          Siyanurlu kadmiyum banyosu
                  Akim: 15-25 ASF
                  Sicaklik: 20-30°C
                  Hedef: 8-13 µm
                  DIKKAT: Siyanur — is guvenligi protokolu aktif!

  Op40: Durulama (3 kademe)
    Makine:       Durulama Tanklari (RNS-01/02/03)
    Sure:         5 dk
    Not:          3 kademeli karsi akimli durulama

  Op50: Kromat Donusum Kaplama
    Makine:       Kromat Tanki (CR-01)
    Sure:         1 dk (daldirma)
    Not:          Alodine 1200S, Class 1A (gold/iridescent)
                  pH: 1.6-1.8

  Op60: Son Durulama + Kurutma
    Makine:       FRN-01
    Sure:         15 dk
    Not:          Havada kurutma (kromat tabakasi hassas — mekanik temas yasak)

  Op70: Hidrojen Gevreklesme Giderme (BAKE) — KRITIK
    Makine:       Bake Firini (BAKE-01)
    Sure:         23 saat (1380 dk!)
    Sicaklik:     190°C (± 15°C)
    Not:          ZORUNLU — Parca sertligi 42-46 HRC
                  Kaplama bitis saatinden itibaren MAX 4 saat icinde baslamali!
                  Firin sicaklik kaydi (chart recorder) tutulacak.
                  Baslatma zamani kayit altina alinacak.

  Op80: Son Muayene Oncesi Bekleme
    Sure:         60 dk
    Not:          Parcalar oda sicakligina donecek
```

**Dogrulama:**
- [ ] 8 operasyon tanimlandi
- [ ] Op70 (Bake) suresi 23 saat olarak girildi
- [ ] Kritik notlar (siyanur guvenligi, bake zamanlama) operasyon notlarinda
- [ ] Toplam proses suresi: ~25.5 saat (bake dahil)

## Adim 20: Kadmiyum Kaplama Proses Yurutme
**Ekran:** ShopFloor Terminal
**API:** POST /ShopFloor/start-operation
**Rol:** Operator (Hasan Operator)

```
Operator:         Hasan Operator
Is Emri:          IE-GK-2026-0088

Op10-Op60: Normal proses (toplam ~70 dk)
  Tum operasyonlar sirayla tamamlandi ✓
  Kadmiyum kaplama 35 dk, kromat 1 dk

Op70: Hidrojen Gevreklesme Bake
  Kaplama Bitis:  2026-04-12 14:00
  Bake Baslat:    2026-04-12 14:30 (kaplama bitisinden 30 dk sonra — 4 saat limitinde ✓)
  Bake Bitis:     2026-04-13 13:30 (23 saat)
  Firin Sicaklik:  190°C sabitleme teyidi, chart recorder kaydi tutuldu

Op80: Bekleme
  Bitis: 2026-04-13 14:30 → Parcalar muayeneye hazir
```

**Dogrulama:**
- [ ] Tum operasyonlar tamamlandi
- [ ] Bake baslama zamani kaplama bitisinden 4 saat icinde ✓
- [ ] Bake suresi 23 saat tamamlandi
- [ ] Firin sicaklik kaydi notta belirtildi

**Bilinen Sorunlar:**
- ⚠️ Bake baslama suresi icin otomatik uyari/alarm yok — manuel takip gerekli
- ⚠️ 23 saatlik operasyon suresi ShopFloor'da dogru goruntuleniyor mu?

## Adim 21: Kadmiyum Kaplama Son Muayene
**Ekran:** Muayene > Son Muayene > Yeni
**API:** POST /FinalInspection
**Rol:** Kalite Muduru

```
Muayene Tipi:     Son Muayene — Kadmiyum Kaplama
Is Emri:          IE-GK-2026-0088
Lot:              GK-CD-2026-0088
Standart:         MIL-PRF-81706 Class 1 Type II

Kalinlik Olcumu (XRF):
  Cihaz:          Fischer XDL-B (Kal: GK-KAL-2026-003)
  Numune:         5 parca x 3 nokta

  Parca 01: 10.2 µm | 11.5 µm | 9.8 µm | Ort: 10.5 µm ✓
  Parca 02: 12.1 µm | 11.8 µm | 12.5 µm | Ort: 12.1 µm ✓
  Parca 03: 9.5  µm | 10.0 µm | 10.3 µm | Ort: 9.9  µm ✓
  Parca 04: 11.0 µm | 10.5 µm | 11.2 µm | Ort: 10.9 µm ✓
  Parca 05: 8.8  µm | 9.2  µm | 9.5  µm | Ort: 9.2  µm ✓

  Min: 8.8 µm | Max: 12.5 µm | Ortalama: 10.5 µm
  Spesifikasyon: 8-13 µm → TUM PARCALAR UYGUN ✓

Yapisma Testi (ASTM B571 — Bend Test):
  Numune: 2 parca
  Sonuc: Kopma/soyulma yok → UYGUN ✓

Kromat Gorunum:
  Renk: Gold/Iridescent (Class 1A uyumlu) → UYGUN ✓
  Yuzey: Homojen, leke yok

Hidrojen Gevreklesme Dogrulamasi:
  Bake suresi:    23 saat teyit (firin kaydi mevcut)
  Bake baslama:   Kaplama bitisinden 30 dk sonra (4 saat limiti ✓)
  Firin sicaklik:  190°C ± 5°C (tolerans icinde)

Tuz Spreyi Notu:
  ASTM B117 tuz spreyi testi bu partiden uygulanmayacak
  (musteri talep etmedi, standart numune arsivlendi)

Genel Sonuc:      UYGUN ✓ — 100/100 parca kabul
```

**Dogrulama:**
- [ ] Son muayene kaydi olusturuldu
- [ ] Kalinlik sonuclari 8-13 µm araliginda
- [ ] Yapisma testi uygun
- [ ] Bake suresi ve zamanlama dogrulamasi kayitli
- [ ] Genel sonuc: UYGUN

## Adim 22: Kadmiyum Kaplama Sertifikasi + Teslimat
**Ekran:** Kalite > CoC > Yeni + Finans > Fatura
**API:** POST /CertificateOfConformance + POST /Invoice
**Rol:** Kalite Muduru + Yonetici

### 22a: CoC
```
Sertifika No:     CoC-GK-2026-0088
Musteri:          Anka Muhendislik ve Savunma San. A.S.
Parca:            AISI 4340 Baglanti Elemani (BLT-4340-M12)
Miktar:           100 adet

Proses:           Kadmiyum Kaplama + Kromat Donusum
Standart:         MIL-PRF-81706 Class 1, Type II
Kromat:           Class 1A (Gold/Iridescent)

Test Sonuclari:
  Kalinlik:       Min 8.8 µm / Max 12.5 µm / Ort 10.5 µm (spek: 8-13 µm) ✓
  Yapisma:        ASTM B571 — Kopma yok ✓
  H2 Bake:        190°C / 23 saat — Tamamlandi ✓
  Gorsel:         Gold kromat, homojen ✓

Cevresel Beyan:
  "Kadmiyum kaplama REACH Ek XIV kisitli maddedir.
   Bu islem savunma sektoru muafiyeti kapsaminda gerceklestirilmistir."

Kalite Onay:      Ayse Kalite
Tarih:            2026-04-14
```

### 22b: Fatura
```
Fatura No:        GK-FTR-2026-0088
Musteri:          Anka Muhendislik
Kalem:            Kadmiyum Kaplama + Kromat (MIL-PRF-81706)
Miktar:           100 adet x 95,00 TL = 9.500,00 TL
KDV (%20):        1.900,00 TL
Toplam:           11.400,00 TL
Vade:             30 gun
```

**Dogrulama:**
- [ ] CoC olusturuldu, kadmiyum ve kromat standartlari kayitli
- [ ] H2 bake bilgileri sertifikada mevcut
- [ ] REACH beyani sertifikaya eklendi
- [ ] Fatura olusturuldu: 11.400 TL
- [ ] SubcontractOrder "Tamamlandi" statusune gecti
- [ ] Stok cikisi yapildi, irsaliye kesildi

---

# ══════════════════════════════════════════════════════════════
# ADIM 23-26: UCUNCU SENARYO — PASIVIZASYON
# ══════════════════════════════════════════════════════════════

## Adim 23: Pasivizasyon Is Talebi
**Ekran:** Fason Isler > Yeni Fason Is Emri
**API:** POST /SubcontractOrder
**Rol:** Yonetici

```
Musteri:          Yildiz CNC Hassas Islem Ltd.Sti. (mevcut musteri)
Is Turu:          Pasivizasyon
Referans No:      YC-2026-0055
Parca Adi:        AISI 316L Hidrolik Manifold
Parca Kodu:       HYD-MNF-316L
Malzeme:          Paslanmaz Celik 316L
Miktar:           25 adet
Birim Fiyat:      65,00 TL
Toplam:           1.625,00 TL

Spesifikasyon:
  Proses:         Pasivizasyon (Nitrik Asit Yontemi)
  Standart:       ASTM A967 / ASTM A380
  Yontem:         Nitrik Asit Yontemi 2 (%20-25 HNO3, 50°C, 30 dk)
  Test:           Bakirsulfat testi (ASTM A967 Practice A) veya
                  Nem testi (24 saat, %95 RH) — musteri tercih edecek

Termin:           2026-04-20
Not:              Hidrolik sistem parcasi, temizlik kritik.
                  Parca yuzeyinde yag/gres kalmamali.
```

**Dogrulama:**
- [ ] SubcontractOrder olusturuldu
- [ ] Mevcut musteriye (Yildiz CNC) bagli
- [ ] ASTM A967 referansi kayitli

## Adim 24: Pasivizasyon Is Emri + Proses
**Ekran:** Uretim > Is Emri + ShopFloor
**API:** POST /WorkOrder + /ShopFloor/start-operation
**Rol:** Yonetici + Operator

```
Is Emri No:       IE-GK-2026-0055
Lot:              GK-PAS-2026-0055

Operasyon Plani + Yurutme:
  Op10: Yag Alma (Alkalin Temizleme)
    Sure: 15 dk → Tamamlandi ✓

  Op20: Durulama
    Sure: 3 dk → Tamamlandi ✓

  Op30: Pasivizasyon (Nitrik Asit)
    Makine:       Pasivizasyon Tanki (PAS-01)
    Sure:         30 dk
    Sicaklik:     50°C
    Konsantrasyon: %22 HNO3
    Not:          ASTM A967, Nitric Acid Method 2
    → Tamamlandi ✓

  Op40: Durulama (3 kademe DI su)
    Sure: 5 dk → Tamamlandi ✓

  Op50: Kurutma
    Sure: 20 dk → Tamamlandi ✓
```

**Dogrulama:**
- [ ] 5 operasyon tamamlandi
- [ ] Pasivizasyon parametreleri (konsantrasyon, sicaklik, sure) kayitli

## Adim 25: Pasivizasyon Kalite Kontrol
**Ekran:** Muayene > Son Muayene
**API:** POST /FinalInspection
**Rol:** Kalite Muduru

```
Muayene Tipi:     Son Muayene — Pasivizasyon
Is Emri:          IE-GK-2026-0055
Standart:         ASTM A967

Test 1: Bakirsulfat Testi (ASTM A967 Practice A)
  Yontem:         CuSO4 cozeltisi parca yuzeyine uygulandi, 6 dk beklendi
  Sonuc:          Bakir cokelmesi YOK → Pasif tabaka UYGUN ✓
  Numune:         3 parca test edildi

Test 2: Nem Testi (Opsiyonel — musteri istedi)
  Yontem:         %95 RH, 35°C, 24 saat
  Baslangic:      2026-04-16 09:00
  Bitis:          2026-04-17 09:00
  Sonuc:          Pas / korozyon izi YOK → UYGUN ✓

Gorsel Kontrol:
  Yuzey:          Parlak metalik, leke/pas yok
  Sonuc:          UYGUN ✓

Genel Sonuc:      UYGUN — 25/25 parca kabul
```

**Dogrulama:**
- [ ] Bakirsulfat testi sonucu kayitli
- [ ] Nem testi baslangic/bitis tarihi kayitli
- [ ] 25 parca kabul

**Bilinen Sorunlar:**
- ⚠️ Nem testi 24 saat suresi icin zamanlama/hatirlatma yok
- ⚠️ Bakirsulfat test proseduru standart form olarak tanimli degil

## Adim 26: Pasivizasyon Sertifika + Teslimat + Fatura
**Ekran:** Kalite > CoC + Stok > Cikis + Finans > Fatura
**API:** POST /CertificateOfConformance + POST /Stock/movement + POST /Invoice
**Rol:** Kalite Muduru + Yonetici

```
CoC No:           CoC-GK-2026-0055
Proses:           Pasivizasyon — Nitrik Asit Yontemi (ASTM A967)
Test:             Bakirsulfat (ASTM A967 Practice A) — UYGUN
                  Nem testi (24 saat) — UYGUN
Miktar:           25 adet

Fatura No:        GK-FTR-2026-0055
Miktar:           25 x 65,00 TL = 1.625,00 TL
KDV (%20):        325,00 TL
Toplam:           1.950,00 TL
```

**Dogrulama:**
- [ ] CoC, stok cikisi ve fatura olusturuldu
- [ ] SubcontractOrder "Tamamlandi"
- [ ] Pasivizasyon sertifikasinda test sonuclari mevcut

---

# ══════════════════════════════════════════════════════════════
# ADIM 27-30: AY SONU RAPORLARI ve STOK YONETIMI
# ══════════════════════════════════════════════════════════════

## Adim 27: Kimyasal Stok Takibi
**Ekran:** Stok > Urun Listesi + Stok Hareketleri
**API:** GET /Product + GET /Stock
**Rol:** Yonetici

Kaplama atolyesinin kimyasal hammaddeleri urun olarak tanimlanir ve stok takibi yapilir.

```
Kimyasal Stok Karti Ornekleri:

  1. Sulfurik Asit (%98 teknik)
     Kod:          KIM-H2SO4-98
     Birim:        kg
     Mevcut Stok:  450 kg
     Min Stok:     200 kg
     Tedarikci:    Merck Kimya
     Not:          Anodize banyosu icin. MSDS mevcut.

  2. Kadmiyum Anodu (Cd %99.99)
     Kod:          KIM-CD-ANOD
     Birim:        kg
     Mevcut Stok:  25 kg
     Min Stok:     10 kg
     Tedarikci:    Kocaer Metal
     Not:          REACH kisitli — savunma muafiyeti.
                   Atik kayit defteri zorunlu.

  3. Alodine 1200S (Kromat Donusum)
     Kod:          KIM-ALOD-1200S
     Birim:        lt
     Mevcut Stok:  35 lt
     Min Stok:     15 lt
     Tedarikci:    Henkel
     Not:          Kromat donusum kaplama (altivalent krom icermez — trivalent)

  4. Nitrik Asit (%65)
     Kod:          KIM-HNO3-65
     Birim:        lt
     Mevcut Stok:  80 lt
     Min Stok:     30 lt
     Not:          Pasivizasyon banyosu icin

  5. Siyah Organik Boya (Anodize)
     Kod:          KIM-DYE-BLK
     Birim:        lt
     Mevcut Stok:  18 lt
     Min Stok:     10 lt
     Not:          Anodize boyama (siyah)
```

**Dogrulama:**
- [ ] 5 kimyasal urun tanimli
- [ ] Min stok seviyeleri girildi
- [ ] Stok bakiyeleri dogru gorunuyor
- [ ] Birim (kg/lt) dogru

**Bilinen Sorunlar:**
- ⚠️ Kimyasal tuketim otomatik dusumu yok — is emri kapatiginda manuel stok hareketi gerekli
- ⚠️ MSDS (Guvenlik Bilgi Formu) dosya eki icin ayri alan yok — Dosya modulu kullanilabilir

## Adim 28: Manuel Kimyasal Tuketim Dusumu
**Ekran:** Stok > Stok Cikisi
**API:** POST /Stock/movement
**Rol:** Yonetici

```
Nisan ayi sonunda yapilan kimyasal tuketim kaydlari:

Hareket 1:
  Urun:           KIM-H2SO4-98 (Sulfurik Asit)
  Miktar:         15 kg (cikis)
  Neden:          Anodize banyosu takviyesi (IE-GK-2026-0042)
  Kalan Stok:     435 kg

Hareket 2:
  Urun:           KIM-CD-ANOD (Kadmiyum Anodu)
  Miktar:         3 kg (cikis)
  Neden:          Kadmiyum kaplama (IE-GK-2026-0088)
  Kalan Stok:     22 kg

Hareket 3:
  Urun:           KIM-DYE-BLK (Siyah Boya)
  Miktar:         2 lt (cikis)
  Neden:          Anodize boyama (IE-GK-2026-0042)
  Kalan Stok:     16 lt

Hareket 4:
  Urun:           KIM-HNO3-65 (Nitrik Asit)
  Miktar:         5 lt (cikis)
  Neden:          Pasivizasyon (IE-GK-2026-0055)
  Kalan Stok:     75 lt
```

**Dogrulama:**
- [ ] 4 stok cikisi basarili
- [ ] Stok bakiyeleri guncellendi
- [ ] Is emri referanslari stok hareketlerinde kayitli

## Adim 29: Atik Yonetimi Notu
**Ekran:** (Quvex'te ayri modul yok — stok notu veya genel not olarak)
**Rol:** Yonetici

```
ATIK YONETIMI KAYDI — Nisan 2026

Kadmiyum Atik:
  Atik Turu:      Tehlikeli atik — kadmiyum iceren cozeltiler
  Atik Kodu:      11 01 09* (sulu yikama cozeltileri)
  Miktar:         ~200 lt birikti
  Lisansli Firma: Cevko Cevre Hizmetleri A.S.
  Teslim Tarihi:  2026-04-28 (planli)
  MOTAT Kodu:     Girilecek
  Not:            Kadmiyum atik beyani Cevre Mudurlugu'ne bildirilecek

Kromat Atik:
  Atik Turu:      Tehlikeli atik — krom iceren cozeltiler
  Atik Kodu:      11 01 09*
  Miktar:         ~100 lt birikti
  Teslim:         Kadmiyum atik ile birlikte

Genel Asidik Atik:
  Atik Turu:      Asidik cozeltiler (sulfurik, nitrik, HCl)
  Atik Kodu:      11 01 05*
  Miktar:         ~300 lt birikti
  Notralizasyon:  Kireç ile pH 6-9 ayarlandi
  Teslim:         Atiksu aritma tesisine deşarj (limit degerleri icinde)
```

**Dogrulama:**
- [ ] Atik kayitlari not olarak girildi
- [ ] Tehlikeli atik kodlari belirtildi
- [ ] Lisansli firma bilgisi kayitli

**Bilinen Sorunlar:**
- ⚠️ Atik yonetimi / cevresel raporlama modulu yok
- ⚠️ MOTAT (Mobil Atik Takip Sistemi) entegrasyonu yok
- ⚠️ Bu bilgiler sadece serbest metin not olarak kaydedilebilir

## Adim 30: Ay Sonu Raporlari
**Ekran:** Dashboard + Raporlar
**API:** GET /Report/* (cesitli endpointler)
**Rol:** Yonetici

```
NISAN 2026 — GUVEN KAPLAMA AY SONU RAPORU

Uretim Ozeti:
  Toplam Fason Is:          3 adet
  Toplam Parca Islenen:     175 adet (50 + 100 + 25)
  Tamamlanan:               3/3 (%100)
  Ortalama Teslim Suresi:   8 gun

Kalite Metrikleri:
  Son Muayene Gecis Orani:  %99.4 (174/175 ilk gecis)
  NCR Sayisi:               1 (NCR-GK-2026-0012 — kalinlik)
  Rework Orani:             %0.6 (1/175)
  Musteri Iade:             0
  NCR Kapatma:              1/1 (%100)

Finansal Ozet:
  Toplam Ciro:
    Anodize (YC-2026-0042):     9.250,00 TL
    Kadmiyum (AN-2026-0088):    9.500,00 TL
    Pasivizasyon (YC-2026-0055): 1.625,00 TL
    TOPLAM:                     20.375,00 TL (KDV haric)
    KDV (%20):                   4.075,00 TL
    GENEL TOPLAM:               24.450,00 TL

  Tahsilat Durumu:
    Vadesi gelen:    0 TL
    Vadesi gelmemis: 24.450,00 TL

Kimyasal Tuketim:
  Sulfurik Asit:    15 kg
  Kadmiyum Anodu:   3 kg
  Siyah Boya:       2 lt
  Nitrik Asit:      5 lt

Kaplama Hatti Kullanim Orani:
  Hat 3 (Anodize):       %35 (aylik kapasiteye gore)
  Hat CD-01 (Kadmiyum):  %20
  Hat PAS-01 (Pasiviz.): %10
  Genel Ortalama:        %22

Banyo Durum:
  Anodize banyosu:    Al iyon 8.5 g/L (limit 20) — devam
  Kadmiyum banyosu:   Son analiz uygun — devam
  Pasivizasyon:       Nitrik asit takviye gerekecek
```

**Dogrulama:**
- [ ] Dashboard'da ay sonu ozet goruntulenebiliyor
- [ ] Uretim, kalite, finansal veriler tutarli
- [ ] Ciro toplami dogru: 20.375 TL
- [ ] NCR ve ret oranlari hesaplanabilir

**Bilinen Sorunlar:**
- ⚠️ Kaplama hatti kullanim orani otomatik hesaplanmiyor
- ⚠️ Kimyasal tuketim raporu ayri modul olarak mevcut degil
- ⚠️ Banyo durumu raporlamasi yok — muayene kayitlarindan cikarilmali

---

# ══════════════════════════════════════════════════════════════
# ADIM 31-35: ROL BAZLI TEST ve YETKI DOGRULAMASI
# ══════════════════════════════════════════════════════════════

## Adim 31: Yonetici Rol Testi
**Ekran:** Tum ekranlar
**Rol:** Mehmet Guven (Admin)

```
Erisim Kontrolu — Yonetici:

  ✅ Musteriler:          Goruntule + Kaydet + Sil
  ✅ Fason Isler:         Goruntule + Kaydet + Sil
  ✅ Uretim / Is Emri:    Goruntule + Kaydet + Sil
  ✅ Stok:                Goruntule + Kaydet + Sil
  ✅ Muayene:             Goruntule + Kaydet
  ✅ NCR / MRB:           Goruntule + Kaydet
  ✅ CoC / Sertifika:     Goruntule + Kaydet
  ✅ Finans / Fatura:     Goruntule + Kaydet + Sil
  ✅ Raporlar:            Goruntule
  ✅ Ayarlar:             Goruntule + Kaydet
  ✅ Kullanicilar:        Goruntule + Kaydet + Sil
  ✅ Fiyatlandirma:       Goruntule + Kaydet
  ✅ Kimyasal Stok:       Goruntule + Kaydet
```

**Dogrulama:**
- [ ] Yonetici tum ekranlara erisebiliyor
- [ ] CRUD islemleri calisiyor
- [ ] Fiyatlandirma alanlari gorunur

## Adim 32: Kalite Muduru Rol Testi
**Ekran:** Muayene, NCR, CoC
**Rol:** Ayse Kalite (Kalite Muduru)

```
Erisim Kontrolu — Kalite Muduru:

  ✅ Muayene:             Goruntule + Kaydet (proses ici + son muayene)
  ✅ NCR / MRB:           Goruntule + Kaydet
  ✅ CoC / Sertifika:     Goruntule + Kaydet
  ✅ Is Emri:             Goruntule (salt okunur)
  ✅ Stok:                Goruntule (salt okunur)

  ❌ Fason Isler:         ERISIM YOK (403)
  ❌ Fatura:              ERISIM YOK (403)
  ❌ Fiyatlandirma:       ERISIM YOK (403)
  ❌ Kullanicilar:        ERISIM YOK (403)
  ❌ Ayarlar:             ERISIM YOK (403)
```

**Dogrulama:**
- [ ] Kalite Muduru muayene, NCR, CoC ekranlarini goruyor
- [ ] Is emri ve stok salt okunur
- [ ] Fason is, fatura, fiyat, ayarlar ekranlari 403 donuyor
- [ ] Kalinlik olcum kaydi olusturabilir
- [ ] NCR acip kapatabilir
- [ ] CoC olusturup onaylayabilir

## Adim 33: Operator Rol Testi (ShopFloor)
**Ekran:** ShopFloor Terminal
**Rol:** Hasan Operator

```
Erisim Kontrolu — Operator:

  ✅ ShopFloor:           Goruntule + Operasyon Baslat/Bitir
  ✅ Is Emri:             Goruntule (salt okunur, sadece kendine atanan)

  ❌ Muayene:             ERISIM YOK (403)
  ❌ NCR:                 ERISIM YOK (403)
  ❌ CoC:                 ERISIM YOK (403)
  ❌ Stok:                ERISIM YOK (403)
  ❌ Fatura:              ERISIM YOK (403)
  ❌ Musteriler:          ERISIM YOK (403)
  ❌ Ayarlar:             ERISIM YOK (403)
  ❌ Fiyatlandirma:       ERISIM YOK (403)

ShopFloor Islevler:
  ✅ Barkod/kart ile giris
  ✅ Is emri secimi
  ✅ Operasyon baslat (zaman damgasi)
  ✅ Operasyon bitir + miktar girisi
  ✅ Proses notu ekleme (banyo parametreleri vb.)
  ❌ Operasyon silme/duzeltme: ERISIM YOK
```

**Dogrulama:**
- [ ] Operator sadece ShopFloor'a erisebiliyor
- [ ] Operasyon baslat/bitir calisiyor
- [ ] Banyo parametrelerini proses notuna yazabiliyor
- [ ] Diger ekranlar 403 donuyor
- [ ] Is emri detaylarini gorebilir ama duzenleyemez

## Adim 34: Cross-Tenant Izolasyon Testi
**Ekran:** Tum ekranlar
**Rol:** Yonetici

```
Test Senaryosu:
  Farkli bir tenant (ornegin OzkanPlastik) ile giris yapildiginda
  Guven Kaplama'nin verileri GORULMEMELI.

Kontrol:
  1. OzkanPlastik tenant'i ile giris yap
  2. Musteri listesini ac → Yildiz CNC, Anka Muhendislik GORULMEMELI
  3. Fason is listesini ac → GK fason isleri GORULMEMELI
  4. Stok listesini ac → KIM-H2SO4-98 vb. GORULMEMELI
  5. API'ye direkt istek: GET /Customer → Sadece kendi tenant verileri

Sonuc: Tenant izolasyonu DOGRU ✓
```

**Dogrulama:**
- [ ] Farkli tenant verileri gorunmuyor
- [ ] API seviyesinde HasQueryFilter calisiyor
- [ ] Cross-tenant veri sizintisi yok

## Adim 35: Toplu Veri Dogrulama ve Senaryo Kapanisi
**Ekran:** Tum ekranlar
**Rol:** Yonetici

```
SENARYO SONU — TOPLU DOGRULAMA

Musteri Verileri:
  ✅ 2 musteri kayitli (Yildiz CNC, Anka Muhendislik)

Fason Isler:
  ✅ 3 SubcontractOrder — tumu "Tamamlandi"
     YC-2026-0042 (Anodize)    → Tamamlandi
     AN-2026-0088 (Kadmiyum)   → Tamamlandi
     YC-2026-0055 (Pasivizasyon) → Tamamlandi

Is Emirleri:
  ✅ 3 is emri — tumu kapatildi
     IE-GK-2026-0042 (8 op + 5 rework op)
     IE-GK-2026-0088 (8 op)
     IE-GK-2026-0055 (5 op)

Muayene Kayitlari:
  ✅ Banyo analizi muayenesi (1)
  ✅ Proses ici kalinlik kontrolu (1)
  ✅ Son muayeneler (3 — anodize, kadmiyum, pasivizasyon)
  ✅ Yapisma testleri (2 — anodize, kadmiyum)
  ✅ Renk kontrolu (1)
  ✅ Rework sonrasi kontrol (1)
  Toplam muayene kaydi: 9

NCR:
  ✅ 1 NCR acildi ve kapatildi (NCR-GK-2026-0012)

Sertifikalar:
  ✅ 3 CoC olusturuldu
     CoC-GK-2026-0042 (MIL-A-8625)
     CoC-GK-2026-0088 (MIL-PRF-81706)
     CoC-GK-2026-0055 (ASTM A967)

Faturalar:
  ✅ 3 fatura kesildi
     GK-FTR-2026-0042: 11.100 TL
     GK-FTR-2026-0088: 11.400 TL
     GK-FTR-2026-0055:  1.950 TL
     TOPLAM: 24.450 TL (KDV dahil)

Stok:
  ✅ Musteri parcalari: giris → cikis tamamlandi (bakiye: 0)
  ✅ Kimyasal stok: 4 cikis hareketi kayitli
  ✅ Min stok uyarilari: aktif (kontrol edilecek)

Kullanicilar:
  ✅ 4 kullanici (1 admin + 3 rol)
  ✅ Yetki testleri gecti
```

**Dogrulama:**
- [ ] Tum veriler tutarli
- [ ] Stok bakiyeleri dogru (musteri parcalari 0, kimyasallar guncellenmis)
- [ ] Fatura toplamlari dogru
- [ ] SubcontractOrder'lar tamamlandi statusunde
- [ ] NCR kapatildi
- [ ] CoC'ler mevcut ve dogru standart referansli

---

# ══════════════════════════════════════════════════════════════
# KAPLAMA SEKTORUNE OZEL GELECEK GELISTIRME ONERILERI
# ══════════════════════════════════════════════════════════════

Bu test senaryosunda ortaya cikan, kaplama sektorune ozel Quvex gelistirme onerileri:

## Oncelik 1 — Kritik
| # | Ozellik | Aciklama |
|---|---------|----------|
| 1 | Banyo Analiz Modulu | pH, konsantrasyon, sicaklik, Ah sayaci — yapisal veri girisi |
| 2 | Kalinlik Olcum Tablosu | Parca x Nokta matrisinde kalinlik girisi, min/max/ort otomatik |
| 3 | H2 Bake Zamanlama Alarmi | Kaplama bitisinden 4 saat icinde bake baslatilmazsa uyari |
| 4 | Kimyasal Tuketim Otomatik | Is emri kapatiginda tanimlanan kimyasal reçeteden stok dusumu |

## Oncelik 2 — Onemli
| # | Ozellik | Aciklama |
|---|---------|----------|
| 5 | Maskeleme Detay Alani | Operasyon kaydinda yapisal maskeleme bilgisi (bolge, yontem) |
| 6 | Tuz Spreyi Sureci Takip | Baslangic/bitis zamani + otomatik hatirlatma |
| 7 | Banyo Omru / Ah Takibi | Toplam Amper-saat veya islem sayisi ile banyo degisim planlama |
| 8 | MSDS Dosya Yonetimi | Kimyasal urun kartina MSDS (SDS) dosya ekleme |

## Oncelik 3 — Gelecek
| # | Ozellik | Aciklama |
|---|---------|----------|
| 9 | NADCAP Hazirlik | Kaplama sektoru ozel kalite denetim sablonlari |
| 10 | Atik Yonetimi Modulu | MOTAT entegrasyonu, atik beyani, lisansli firma takibi |
| 11 | Cevresel Raporlama | REACH, RoHS beyan sablonlari |
| 12 | Rektifiyer Entegrasyon | IoT — akim, voltaj, sure otomatik kayit |

---

# ══════════════════════════════════════════════════════════════
# TEST SONUC TABLOSU
# ══════════════════════════════════════════════════════════════

| Adim | Aciklama | Beklenen | Durum |
|------|----------|----------|-------|
| 0.1 | Firma kaydi | Tenant olusturuldu | ☐ |
| 0.2 | Onboarding | Dashboard acildi | ☐ |
| 0.3 | Kullanici olusturma | 3 kullanici + yetkiler | ☐ |
| 1 | Musteri kaydi — Yildiz CNC | 201 Created | ☐ |
| 2 | Fason is talebi — Anodize | SubcontractOrder olusturuldu | ☐ |
| 3 | Mal kabul | Stok girisi 50 adet | ☐ |
| 4 | Lot atama | GK-ANO-2026-0042 | ☐ |
| 5 | Banyo analizi kontrolu | Muayene UYGUN | ☐ |
| 6 | Operasyon routing | 8 operasyon tanimli | ☐ |
| 7 | ShopFloor proses | 8 operasyon tamamlandi | ☐ |
| 8 | Proses ici kalinlik | On kontrol UYGUN | ☐ |
| 9 | Son muayene — kalinlik | 1 parca RED | ☐ |
| 10 | Yapisma testi | ASTM D3359 UYGUN | ☐ |
| 11 | Renk kontrolu | Gorsel UYGUN | ☐ |
| 12 | NCR — kalinlik yetersiz | NCR acildi, rework karari | ☐ |
| 13 | Rework proses | Soyma + yeniden anodize | ☐ |
| 14 | Rework sonrasi kontrol | UYGUN, NCR kapatildi | ☐ |
| 15 | CoC sertifikasi | MIL-A-8625 sertifika | ☐ |
| 16 | Teslimat + fatura | 11.100 TL | ☐ |
| 17 | Ikinci musteri — Anka Muh. | 201 Created | ☐ |
| 18 | Kadmiyum fason talebi | SubcontractOrder olusturuldu | ☐ |
| 19 | Kadmiyum operasyon routing | 8 op (bake 23 saat) | ☐ |
| 20 | Kadmiyum proses yurutme | Bake zamanlama dogru | ☐ |
| 21 | Kadmiyum son muayene | 100/100 UYGUN | ☐ |
| 22 | Kadmiyum CoC + fatura | 11.400 TL + REACH beyani | ☐ |
| 23 | Pasivizasyon talebi | SubcontractOrder olusturuldu | ☐ |
| 24 | Pasivizasyon proses | 5 op tamamlandi | ☐ |
| 25 | Pasivizasyon muayene | Bakirsulfat + nem testi UYGUN | ☐ |
| 26 | Pasivizasyon CoC + fatura | 1.950 TL | ☐ |
| 27 | Kimyasal stok tanimi | 5 kimyasal urun | ☐ |
| 28 | Kimyasal tuketim dusumu | 4 cikis hareketi | ☐ |
| 29 | Atik yonetimi notu | Tehlikeli atik kaydi | ☐ |
| 30 | Ay sonu raporlari | Ozet veriler tutarli | ☐ |
| 31 | Yonetici yetki testi | Tum ekranlar erisim ✓ | ☐ |
| 32 | Kalite Muduru yetki testi | Muayene/NCR/CoC ✓, diger ✗ | ☐ |
| 33 | Operator yetki testi | ShopFloor ✓, diger ✗ | ☐ |
| 34 | Tenant izolasyon testi | Cross-tenant veri yok | ☐ |
| 35 | Toplu veri dogrulama | Tum veriler tutarli | ☐ |

---

# STANDART REFERANS TABLOSU

Bu senaryoda kullanilan askeri ve endustriyel standartlar:

| Standart | Aciklama | Kullanim |
|----------|----------|----------|
| MIL-A-8625 | Aluminyum Anodize Kaplama | Tip III Sert Anodize |
| MIL-PRF-81706 | Kadmiyum Kaplama (QQ-P-416 yerine) | Kadmiyum + Kromat |
| AMS-QQ-N-290 | Nikel Kaplama | (senaryoda kullanilmadi, referans) |
| ASTM B117 | Tuz Spreyi (Korozyon) Testi | Kadmiyum dayanim |
| ASTM D3359 | Yapisma Testi (Tape Test) | Anodize yapisma |
| ASTM B571 | Yapisma Testi (Metal Kaplama) | Kadmiyum yapisma |
| ASTM A967 | Paslanmaz Celik Pasivizasyonu | Pasivizasyon prosesi |
| ASTM A380 | Paslanmaz Celik Temizleme | Pasivizasyon oncesi |
| AS9100 | Havacilik/Savunma Kalite Yonetimi | Genel kalite sistemi |
| REACH Ek XIV | Avrupa Kimyasal Mevzuati | Kadmiyum kisitlama |

---

> **Hazirlayan:** QA Ekibi
> **Tarih:** 2026-04-10
> **Versiyon:** 1.0
> **Toplam Adim:** 35 (0.1-0.3 kurulum + 1-35 senaryo)
> **Tahmini Sure:** 45 dakika (ilk calistirma)
> **Onkosul:** Quvex ERP kurulu ve calisir durumda, PostgreSQL aktif, test tenant'i olusturulabilir