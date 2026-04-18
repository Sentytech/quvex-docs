# Otomotiv Yan Sanayi — Uctan Uca Test Senaryosu
# Kaucuk Conta Uretimi: Teklif → Uretim → PPAP → Sevkiyat

> **Firma:** Aslan Otomotiv Parca A.S.
> **Sektor:** Otomotiv yan sanayi — OEM tedarikci (Tier-2)
> **Musteri:** Ford Otosan (Kocaeli Fabrikasi)
> **Urun:** Kaucuk conta (NBR-70 rubber gasket) — Motor blogu su kanali contasi
> **Standartlar:** IATF 16949, PPAP Level 3, ISO 9001:2015
> **Test Tarihi:** 2026-04-10
> **Test Ortami:** localhost:3000 (development) veya quvex.io (production)
> **Test suresi:** ~40 dakika
> **Adim sayisi:** 38

---

## Senaryo Ozeti

Bu senaryo, bir otomotiv yan sanayi firmasinin (Aslan Otomotiv) Ford Otosan'dan gelen
kaucuk conta talebini karsilamasi icin tum surecleri kapsar:

1. Musteri ve urun tanimlari
2. Teklif → Siparis → Uretim planlama
3. Hammadde tedarik → Giris kalite kontrol
4. Uretim → Proses kontrol → Son muayene
5. PPAP dokumantasyonu → Sevkiyat → Fatura → Odeme
6. Tedarikci degerlendirme ve maliyet analizi

Her adimda API endpoint'i, form verileri, beklenen sonuc ve dogrulama checklist'i verilmistir.

---

## On Kosullar

Asagidaki kosullar test baslangicinda saglanmis olmalidir:

- [ ] Quvex uygulamasi calisiyor (API: localhost:5052, UI: localhost:3000)
- [ ] PostgreSQL veritabani erisim durumu: aktif (`smallfactory-postgres` container)
- [ ] Admin kullanici ile giris yapilabiliyor (admin@quvex.com / Admin123!@#$)
- [ ] Temel ayarlar yapilmis: Birim tanimlari (Adet, Kg, Metre), KDV oranlari (%20)
- [ ] Depo tanimlari: Ana Depo (DP01), Hammadde Deposu (DP02), Sevkiyat Alani (DP03)
- [ ] Makine tanimlari: En az 1 kaucuk presleme makinesi tanimli
- [ ] Roller tanimli: Admin, Uretim Muduru, Kalite Muduru, Muhasebeci, Operator

---

# ══════════════════════════════════════════════════════════════
# BOLUM 1: MUSTERI ve URUN TANIMLARI
# ══════════════════════════════════════════════════════════════

## Adim 1: Musteri Kaydi (Ford Otosan)
**Ekran:** Musteri Yonetimi > Yeni Musteri
**API:** POST /Customer
**Menü yolu:** Sol menu > Musteri Yonetimi > Musteriler

**Veri:**

| Alan | Deger |
|------|-------|
| Firma Adi | Ford Otosan Otomotiv San. A.S. |
| Kisa Adi | Ford Otosan |
| Tipi | Musteri |
| Vergi Dairesi | Kocaeli |
| Vergi No | 1234567890 |
| Telefon | 0262 315 5000 |
| E-posta | satin.alma@ford.com.tr |
| Web | www.fordotosan.com.tr |
| Adres | Sanayi Mah. D-100 Karayolu, Golcuk / Kocaeli |
| Ulke | Turkiye |
| Sehir | Kocaeli |
| Sektor | Otomotiv OEM |
| Notlar | PPAP Level 3 zorunlu. IATF 16949 sertifika talebi var. |

**Beklenen Sonuc:**
- Musteri basariyla kaydedildi
- Musteri listesinde "Ford Otosan" gorunuyor
- Musteri detay sayfasinda tum bilgiler dogru

**Dogrulama:**
- [ ] Musteri kaydi olusturuldu (201 Created)
- [ ] Musteri listesinde gorunuyor (/Customer?type=customers)
- [ ] Vergi no benzersizlik kontrolu calisti
- [ ] Adres bilgileri dogru kaydedildi
- [ ] Notlar alaninda PPAP bilgisi gorunuyor

---

## Adim 2: Musteri Irtibat Kisi Tanimlari
**Ekran:** Musteri Detay > Irtibat Kisileri
**API:** POST /CustomerContact

**Veri:**

| Alan | Deger |
|------|-------|
| Ad Soyad | Mehmet Yilmaz |
| Unvan | Satin Alma Muduru |
| Telefon | 0532 111 2233 |
| E-posta | mehmet.yilmaz@ford.com.tr |
| Departman | Satin Alma |

| Alan | Deger |
|------|-------|
| Ad Soyad | Ayse Kaya |
| Unvan | Kalite Muhendisi |
| Telefon | 0533 444 5566 |
| E-posta | ayse.kaya@ford.com.tr |
| Departman | Gelen Kalite |

**Dogrulama:**
- [ ] 2 irtibat kisisi eklendi
- [ ] Irtibat bilgileri musteri detayinda gorunuyor
- [ ] Telefon ve e-posta formatlari dogru

---

## Adim 3: Hammadde Tedarikci Kaydi
**Ekran:** Musteri Yonetimi > Yeni Musteri (Tedarikci modu)
**API:** POST /Customer
**Filtre:** /Customer?type=suppliers

**Veri:**

| Alan | Deger |
|------|-------|
| Firma Adi | Kaucuk-Tech Polimer San. Tic. Ltd. Sti. |
| Kisa Adi | KaucukTech |
| Tipi | Tedarikci |
| Vergi Dairesi | Gebze |
| Vergi No | 9876543210 |
| Telefon | 0262 655 4400 |
| E-posta | satis@kaucuktech.com.tr |
| Adres | Gebze OSB, 3. Cadde No:45, Gebze / Kocaeli |
| Sektor | Kaucuk / Polimer |
| Notlar | NBR-70 hammadde tedarikcisi. ISO 9001 sertifikali. |

**Dogrulama:**
- [ ] Tedarikci kaydi olusturuldu
- [ ] /Customer?type=suppliers filtresinde gorunuyor
- [ ] Musteri filtresinde gorunmuyor (/Customer?type=customers)

---

## Adim 4: Urun Tanimi (Kaucuk Conta)
**Ekran:** Urun Yonetimi > Yeni Urun
**API:** POST /Product

**Veri:**

| Alan | Deger |
|------|-------|
| Urun Kodu | ASL-CNT-001 |
| Urun Adi | Kaucuk Conta NBR-70 - Motor Blogu Su Kanali |
| Kategori | Mamul |
| Birim | Adet |
| Satis Fiyati | 12.50 TL |
| KDV Orani | %20 |
| Teknik Cizim No | DWG-CNT-001-R03 |
| Malzeme | NBR-70 (Acrylonitrile Butadiene Rubber) |
| Sertlik | Shore A 70 ±5 |
| Ic Cap | 45.00 mm ±0.15 |
| Dis Cap | 65.00 mm ±0.20 |
| Kalinlik | 3.50 mm ±0.10 |
| Renk | Siyah |
| Min Stok | 5000 |
| Notlar | Ford Otosan P/N: FO-GSK-2026-045. PPAP Level 3. |

**Beklenen Sonuc:**
- Urun kartinda teknik bilgiler dogru gorunuyor
- Urun kodu benzersiz

**Dogrulama:**
- [ ] Urun olusturuldu (201 Created)
- [ ] Urun listesinde gorunuyor
- [ ] Kategori "Mamul" olarak secildi
- [ ] Teknik cizim no alani doldu
- [ ] Min stok seviyesi 5000 olarak ayarlandi

---

## Adim 5: Hammadde Tanimlari
**Ekran:** Urun Yonetimi > Yeni Urun (her biri icin)
**API:** POST /Product

**Hammadde 1 — NBR-70 Kaucuk Levha:**

| Alan | Deger |
|------|-------|
| Urun Kodu | HM-KAU-001 |
| Urun Adi | NBR-70 Kaucuk Levha (2m x 1m x 4mm) |
| Kategori | Hammadde |
| Birim | Adet (levha) |
| Alis Fiyati | 850.00 TL |
| Tedarikci | KaucukTech |
| Min Stok | 50 |
| Notlar | Shore A 70, -30°C/+120°C calisma sicakligi. Lot bazli sertifika zorunlu. |

**Hammadde 2 — Vulkanizasyon Katkisi:**

| Alan | Deger |
|------|-------|
| Urun Kodu | HM-VUL-001 |
| Urun Adi | Vulkanizasyon Katki Maddesi (Kukurt bazli) |
| Kategori | Hammadde |
| Birim | Kg |
| Alis Fiyati | 120.00 TL/Kg |
| Tedarikci | KaucukTech |
| Min Stok | 20 |

**Hammadde 3 — Ambalaj Malzemesi:**

| Alan | Deger |
|------|-------|
| Urun Kodu | HM-AMB-001 |
| Urun Adi | PE Torba (Conta Ambalaj) 100'lu Paket |
| Kategori | Hammadde |
| Birim | Paket |
| Alis Fiyati | 25.00 TL |
| Min Stok | 100 |

**Dogrulama:**
- [ ] 3 hammadde tanimlandı (HM-KAU-001, HM-VUL-001, HM-AMB-001)
- [ ] Kategoriler dogru (Hammadde)
- [ ] Tedarikci baglantisi kuruldu
- [ ] Min stok seviyeleri ayarlandi

---

## Adim 6: BOM / Recete Tanimi
**Ekran:** Urun Detay > Recete (BOM)
**API:** POST /ProductRecipe (veya ilgili BOM endpoint)

**Ana Urun:** ASL-CNT-001 (Kaucuk Conta)
**Parti buyuklugu:** 1000 adet

| Hammadde | Kod | Miktar (1000 adet icin) | Birim | Fire Orani |
|----------|-----|------------------------|-------|------------|
| NBR-70 Kaucuk Levha | HM-KAU-001 | 5 | Adet (levha) | %3 |
| Vulkanizasyon Katkisi | HM-VUL-001 | 2.5 | Kg | %2 |
| PE Ambalaj Torba | HM-AMB-001 | 10 | Paket | %1 |

**Beklenen Sonuc:**
- BOM/Recete olusturuldu
- Hammadde listesi urun detayinda gorunuyor
- Fire oranlari dahil toplam maliyet hesaplaniyor

**Dogrulama:**
- [ ] Recete 3 kalemden olusuyor
- [ ] Fire oranlari girildi
- [ ] Toplam hammadde maliyeti: (5 x 850) + (2.5 x 120) + (10 x 25) = 4,800 TL (1000 adet icin)
- [ ] Birim hammadde maliyeti: 4.80 TL/adet
- [ ] Recete urun kartinda gorunuyor

---

# ══════════════════════════════════════════════════════════════
# BOLUM 2: TEKLIF ve SIPARIS
# ══════════════════════════════════════════════════════════════

## Adim 7: Teklif Olustur
**Ekran:** Teklif Yonetimi > Yeni Teklif
**API:** POST /Offer

**Veri:**

| Alan | Deger |
|------|-------|
| Teklif No | TKL-2026-0042 |
| Musteri | Ford Otosan |
| Tarih | 2026-04-10 |
| Gecerlilik | 30 gun |
| Para Birimi | TRY |
| Odeme Kosulu | 60 gun vadeli |
| Teslimat Suresi | 15 is gunu |
| Not | PPAP Level 3 dokumantasyonu dahildir. |

**Teklif Kalemleri:**

| Urun | Miktar | Birim Fiyat | Toplam |
|------|--------|-------------|--------|
| ASL-CNT-001 (Kaucuk Conta NBR-70) | 10,000 | 12.50 TL | 125,000.00 TL |

**Fiyat Detayi:**

| Kalem | Tutar |
|-------|-------|
| Ara Toplam | 125,000.00 TL |
| KDV (%20) | 25,000.00 TL |
| Genel Toplam | 150,000.00 TL |

**Beklenen Sonuc:**
- Teklif olusturuldu, durumu "Taslak"
- PDF ciktisi alinabiliyor

**Dogrulama:**
- [ ] Teklif kaydedildi
- [ ] Teklif no otomatik atandi
- [ ] Musteri bilgileri dogru
- [ ] KDV hesabi dogru (%20)
- [ ] Teklif PDF ciktisi alinabiliyor
- [ ] Gecerlilik suresi gorunuyor

---

## Adim 8: Teklif Musteriye Gonder
**Ekran:** Teklif Detay > Durumu Guncelle
**API:** PUT /Offer/{id}/status

**Islem:**
- Teklif durumunu "Taslak" → "Gonderildi" olarak degistir
- (Gercek senaryoda e-posta gonderimi de tetiklenir)

**Dogrulama:**
- [ ] Teklif durumu "Gonderildi" oldu
- [ ] Tarih/saat kaydedildi
- [ ] Teklif listesinde durum filtresi calisiyor

---

## Adim 9: Teklif Onayi
**Ekran:** Teklif Detay > Durumu Guncelle
**API:** PUT /Offer/{id}/status

**Islem:**
- Teklif durumunu "Gonderildi" → "Onaylandi" olarak degistir
- Ford Otosan satin alma onayi simulasyonu

**Dogrulama:**
- [ ] Teklif durumu "Onaylandi" oldu
- [ ] Onaylanan tekliften siparis olusturma butonu aktif
- [ ] Teklif artik duzenlenemiyor (readonly)

---

## Adim 10: Satis Siparisi Olustur
**Ekran:** Siparis Yonetimi > Yeni Siparis (veya Tekliften Olustur)
**API:** POST /SalesOrder

**Veri:**

| Alan | Deger |
|------|-------|
| Siparis No | SIP-2026-0078 |
| Musteri | Ford Otosan |
| Kaynak Teklif | TKL-2026-0042 |
| Tarih | 2026-04-10 |
| Termin Tarihi | 2026-05-02 (15 is gunu) |
| Odeme Kosulu | 60 gun vadeli |
| Teslimat Adresi | Ford Otosan Golcuk Fab., Dock 7 |
| Notlar | PPAP Level 3 — ilk sevkiyatta PPAP dosyasi teslim edilecek. |

**Siparis Kalemleri:**

| Urun | Miktar | Birim Fiyat | Toplam |
|------|--------|-------------|--------|
| ASL-CNT-001 | 10,000 | 12.50 TL | 125,000.00 TL |

**Beklenen Sonuc:**
- Siparis olusturuldu, teklif ile baglantili
- Termin tarihi gorunuyor

**Dogrulama:**
- [ ] Siparis kaydedildi
- [ ] Teklif referansi dogru (TKL-2026-0042)
- [ ] Siparis kalemleri tekliften dogru tasindi
- [ ] Termin tarihi 2026-05-02
- [ ] Siparis durumu "Yeni" veya "Acik"
- [ ] Siparis listesinde musteri filtreleme calisiyor

---

# ══════════════════════════════════════════════════════════════
# BOLUM 3: KALITE PLANLAMA (PPAP HAZIRLIGI)
# ══════════════════════════════════════════════════════════════

## Adim 11: Kontrol Plani Olustur
**Ekran:** Kalite > Kontrol Planlari > Yeni Kontrol Plani
**API:** POST /ControlPlan (veya ilgili kalite endpoint)

**Veri:**

| Alan | Deger |
|------|-------|
| Plan No | KP-CNT-001 |
| Urun | ASL-CNT-001 (Kaucuk Conta) |
| Revizyon | Rev.A |
| Tipi | Uretim Kontrol Plani |

**Kontrol Noktalari:**

| No | Proses | Kontrol Noktasi | Olcum Yontemi | Numune | Frekans | Spesifikasyon |
|----|--------|-----------------|---------------|--------|---------|---------------|
| 1 | Hammadde Giris | Kaucuk sertlik | Durometer Shore A | 3/lot | Her lot | 70 ±5 Shore A |
| 2 | Hammadde Giris | Malzeme sertifikasi | Gorsel kontrol | %100 | Her lot | Lot no, test raporu |
| 3 | Presleme | Ic cap olcusu | Kaliper (dijital) | 5/saat | Saatlik | 45.00 ±0.15 mm |
| 4 | Presleme | Dis cap olcusu | Kaliper (dijital) | 5/saat | Saatlik | 65.00 ±0.20 mm |
| 5 | Presleme | Kalinlik | Mikrometre | 5/saat | Saatlik | 3.50 ±0.10 mm |
| 6 | Presleme | Gorsel kontrol | Ciplak goz + buyutec | 5/saat | Saatlik | Capak, catlik, renk yok |
| 7 | Vulkanizasyon | Sicaklik | Termocouple | Surekli | Surekli | 160°C ±5°C |
| 8 | Vulkanizasyon | Sure | Zamanlayici | Surekli | Surekli | 8 dk ±30 sn |
| 9 | Son Muayene | Sertlik testi | Durometer Shore A | 5/lot | Her lot | 70 ±5 Shore A |
| 10 | Son Muayene | Boyut kontrolu (tam set) | Kaliper + Mikrometre | 5/lot | Her lot | Tum spec'ler |
| 11 | Son Muayene | Gorsel muayene | Ciplak goz | %100 | %100 | Gorsel kusur yok |
| 12 | Ambalaj | Etiket kontrolu | Gorsel | %100 | %100 | Lot no, P/N, miktar |

**Dogrulama:**
- [ ] Kontrol plani olusturuldu
- [ ] 12 kontrol noktasi tanimlandi
- [ ] Urun ile baglantili
- [ ] Spesifikasyon limitleri girildi
- [ ] Numune buyuklugu ve frekans tanimli

---

## Adim 12: Proses FMEA Girisi
**Ekran:** Kalite > FMEA > Yeni FMEA (veya Risk Analizi modulu)
**API:** POST /RiskAnalysis (veya ilgili FMEA endpoint)

**Not:** Quvex'te tam kapsamli FMEA modulu bulunmayabilir.
Bu adim mevcut risk analizi veya dokuman yonetimi modulleri ile simule edilir.

**Veri:**

| Proses Adimi | Potansiyel Hata | Etki (S) | Olasilik (O) | Tespit (D) | RPN | Onlem |
|--------------|-----------------|----------|---------------|------------|-----|-------|
| Kaucuk Kesim | Yanlis olcu kesim | 7 | 3 | 4 | 84 | Sablon kullanimi |
| Presleme | Eksik vulkanizasyon | 9 | 2 | 3 | 54 | Sicaklik alarm |
| Presleme | Capak olusumu | 5 | 4 | 5 | 100 | Kalip bakim periyodu |
| Boyut Kontrol | Olcum hatasi | 8 | 2 | 2 | 32 | Kalibrasyon takibi |
| Ambalajlama | Yanlis etiketleme | 7 | 3 | 3 | 63 | Barkod dogrulama |

**Beklenen Sonuc:**
- FMEA/Risk analizi kaydi olusturuldu
- RPN degerleri hesaplandi (S x O x D)
- Yuksek RPN'ler isaretlendi (>100)

**Dogrulama:**
- [ ] Risk analizi kaydedildi
- [ ] RPN otomatik hesaplandi
- [ ] En yuksek RPN: Capak olusumu (100)
- [ ] Onlem aksiyonlari girildi

**Bilinen Kisitlama:**
- Quvex'te AIAG formatinda FMEA modulu yok. Risk analizi veya dokuman yonetimi uzerinden islem yapilir.

---

# ══════════════════════════════════════════════════════════════
# BOLUM 4: SATIN ALMA ve HAMMADDE GIRIS
# ══════════════════════════════════════════════════════════════

## Adim 13: Hammadde Satin Alma Siparisi
**Ekran:** Satin Alma > Yeni Siparis
**API:** POST /PurchaseOrder (veya SubcontractOrder)

**Veri:**

| Alan | Deger |
|------|-------|
| Siparis No | SAT-2026-0034 |
| Tedarikci | KaucukTech Polimer |
| Tarih | 2026-04-10 |
| Termin | 2026-04-15 |
| Notlar | 10,000 adet conta uretimi icin. Lot bazli malzeme sertifikasi istenmektedir. |

**Siparis Kalemleri:**

| Hammadde | Miktar | Birim Fiyat | Toplam |
|----------|--------|-------------|--------|
| HM-KAU-001 (NBR-70 Levha) | 55 | 850.00 TL | 46,750.00 TL |
| HM-VUL-001 (Vulk. Katkisi) | 28 Kg | 120.00 TL | 3,360.00 TL |
| HM-AMB-001 (PE Torba) | 110 Paket | 25.00 TL | 2,750.00 TL |

**Not:** Fire oranlari dahil edilerek fazladan malzeme siparis edilmistir
(ornek: 50 levha gerekli + %3 fire + %7 emniyet = 55 levha)

**Dogrulama:**
- [ ] Satin alma siparisi olusturuldu
- [ ] Tedarikci dogru secildi
- [ ] 3 kalem eklendi
- [ ] Toplam tutar: 52,860.00 TL
- [ ] Termin tarihi 2026-04-15

---

## Adim 14: Mal Kabul (Hammadde Teslim Alma)
**Ekran:** Depo > Mal Kabul / Stok Giris
**API:** POST /StockMovement (veya ilgili depo giris endpoint)

**Veri:**

| Alan | Deger |
|------|-------|
| Islem Tipi | Satin Alma Girisi |
| Tedarikci | KaucukTech |
| Referans | SAT-2026-0034 |
| Depo | DP02 (Hammadde Deposu) |
| Tarih | 2026-04-15 |

**Gelen Malzemeler:**

| Hammadde | Siparis | Gelen | Lot No | Durum |
|----------|---------|-------|--------|-------|
| HM-KAU-001 (NBR-70 Levha) | 55 | 55 | LOT-KT-2026-0412 | Kalite Bekliyor |
| HM-VUL-001 (Vulk. Katkisi) | 28 Kg | 28 Kg | LOT-KT-2026-0413 | Kalite Bekliyor |
| HM-AMB-001 (PE Torba) | 110 | 110 | — | Kabul |

**Dogrulama:**
- [ ] Mal kabul kaydedildi
- [ ] Stok miktarlari guncellendi (DP02)
- [ ] Lot numaralari atandi
- [ ] Kalite bekleme durumu (kaucuk ve katki icin)
- [ ] Ambalaj direkt kabul (kalite kontrole gerek yok)

---

## Adim 15: Giris Kalite Kontrol (Hammadde Sertifika Dogrulama)
**Ekran:** Kalite > Muayene > Giris Kalite Kontrol
**API:** POST /QualityInspection (veya ilgili muayene endpoint)

**Veri — NBR-70 Kaucuk Levha:**

| Alan | Deger |
|------|-------|
| Muayene No | GKK-2026-0089 |
| Malzeme | HM-KAU-001 (NBR-70 Levha) |
| Lot No | LOT-KT-2026-0412 |
| Tedarikci | KaucukTech |
| Numune Sayisi | 3 levha |

**Olcum Sonuclari:**

| Kontrol | Spesifikasyon | Numune 1 | Numune 2 | Numune 3 | Sonuc |
|---------|---------------|----------|----------|----------|-------|
| Sertlik (Shore A) | 70 ±5 | 71 | 69 | 70 | UYGUN |
| Kalinlik (mm) | 4.00 ±0.10 | 4.02 | 3.98 | 4.01 | UYGUN |
| Gorsel kontrol | Kusursuz | OK | OK | OK | UYGUN |
| Malzeme Sertifikasi | Mevcut | Var | — | — | UYGUN |

**Karar:** KABUL

**Dogrulama:**
- [ ] Muayene kaydedildi
- [ ] Tum olcumler spec icerisinde
- [ ] Malzeme sertifikasi dogrulandi
- [ ] Lot durumu "Kalite Bekliyor" → "Kabul" oldu
- [ ] Stok durumu "Kullanilabilir" olarak guncellendi

---

# ══════════════════════════════════════════════════════════════
# BOLUM 5: URETIM PLANLAMA ve BASLANGIC
# ══════════════════════════════════════════════════════════════

## Adim 16: Is Emri Ac
**Ekran:** Uretim > Is Emirleri > Yeni Is Emri
**API:** POST /WorkOrder

**Veri:**

| Alan | Deger |
|------|-------|
| Is Emri No | IE-2026-0156 |
| Urun | ASL-CNT-001 (Kaucuk Conta NBR-70) |
| Miktar | 10,000 Adet |
| Siparis Referansi | SIP-2026-0078 |
| Baslangic Tarihi | 2026-04-16 |
| Bitis Tarihi | 2026-04-25 |
| Oncelik | Yuksek |
| Notlar | Ford Otosan siparisi. PPAP Level 3. Ilk 100 adet FAI icin ayrilacak. |

**Beklenen Sonuc:**
- Is emri olusturuldu, siparis ile baglantili
- Uretim takviminde gorunuyor

**Dogrulama:**
- [ ] Is emri olusturuldu
- [ ] Siparis referansi dogru
- [ ] Tarih araligi 2026-04-16 — 2026-04-25
- [ ] Oncelik "Yuksek"
- [ ] Urun ve miktar dogru

---

## Adim 17: Operasyon Routing Tanimla
**Ekran:** Is Emri Detay > Operasyonlar
**API:** POST /WorkOrderStep (veya Operasyon Routing endpoint)

**Operasyon Sirasi:**

| Sira | Operasyon Kodu | Operasyon Adi | Makine | Setup (dk) | Islem (dk/100 adet) | Aciklama |
|------|---------------|---------------|--------|------------|---------------------|----------|
| OP10 | KES | Kaucuk Kesim | KES-01 (Hidrolik Pres) | 15 | 20 | Levhadan sablon ile kesim |
| OP20 | KAR | Karistirma + Katki | MIX-01 (Mikser) | 10 | 30 | NBR + vulk. katkisi karistirma |
| OP30 | PRS | Presleme / Kaliplama | PRS-01 (Kaucuk Pres) | 30 | 45 | 160°C, 8 dk vulkanizasyon |
| OP40 | CPK | Capak Alma | — (Manuel) | 5 | 60 | Manuel capak temizligi |
| OP50 | PKK | Proses Kalite Kontrol | — (Kalite Lab) | 10 | 15 | Boyut + sertlik |
| OP60 | AMB | Ambalajlama | — (Manuel) | 5 | 10 | 100'lu PE torba + etiket |

**Dogrulama:**
- [ ] 6 operasyon eklendi
- [ ] Sira numaralari dogru (OP10-OP60)
- [ ] Makine atamalari yapildi (OP10, OP20, OP30)
- [ ] Setup ve islem sureleri girildi
- [ ] Toplam uretim suresi hesaplaniyor

**Tahmini Sureler (10,000 adet icin):**
- OP10: 15 + (100 x 20) = 2,015 dk ≈ 33.6 saat
- OP20: 10 + (100 x 30) = 3,010 dk ≈ 50.2 saat
- OP30: 30 + (100 x 45) = 4,530 dk ≈ 75.5 saat (darboğaz)
- OP40: 5 + (100 x 60) = 6,005 dk ≈ 100.1 saat
- OP50: 10 + (100 x 15) = 1,510 dk ≈ 25.2 saat
- OP60: 5 + (100 x 10) = 1,005 dk ≈ 16.8 saat

---

## Adim 18: Uretim Baslat
**Ekran:** Is Emri Detay > Durum Guncelle / Uretim Terminali
**API:** PUT /WorkOrder/{id}/status

**Islem:**
- Is emri durumunu "Yeni" → "Uretimde" olarak degistir
- Baslangic tarihi: 2026-04-16 08:00

**Dogrulama:**
- [ ] Is emri durumu "Uretimde"
- [ ] Baslangic zamani kaydedildi
- [ ] Dashboard'da aktif is emri olarak gorunuyor

---

## Adim 19: Operasyon Kayit (Terminal)
**Ekran:** Uretim Terminali (ShopFloor)
**API:** POST /WorkOrderStepLog (veya Terminal endpoint)

**OP10 — Kaucuk Kesim (tamamlandi):**

| Alan | Deger |
|------|-------|
| Operator | Mustafa Yilmaz |
| Makine | KES-01 |
| Baslangic | 2026-04-16 08:00 |
| Bitis | 2026-04-16 12:30 |
| Uretilen | 2,800 adet |
| Hurda | 45 adet |
| Notlar | Ilk sablon ayari 15 dk. Nominal uretim hizi. |

**OP20 — Karistirma (devam ediyor):**

| Alan | Deger |
|------|-------|
| Operator | Ali Kaya |
| Makine | MIX-01 |
| Baslangic | 2026-04-16 09:00 |
| Durum | Devam ediyor |

**Dogrulama:**
- [ ] Operasyon kayitlari olusturuldu
- [ ] Operator ve makine bilgileri dogru
- [ ] Uretilen ve hurda miktarlari girildi
- [ ] Hurda orani: 45/2845 = %1.58 (kabul edilebilir, <%3)
- [ ] Terminal ekraninda operasyon ilerlemesi gorunuyor

---

# ══════════════════════════════════════════════════════════════
# BOLUM 6: KALITE KONTROL (URETIM SIRASI ve SONU)
# ══════════════════════════════════════════════════════════════

## Adim 20: Proses Kalite Kontrol (SPC Olcum)
**Ekran:** Kalite > Proses Kontrol / Muayene
**API:** POST /QualityInspection

**Veri:**

| Alan | Deger |
|------|-------|
| Muayene No | PKK-2026-0234 |
| Is Emri | IE-2026-0156 |
| Operasyon | OP30 (Presleme) |
| Kontrol Tipi | Proses Kontrol |
| Tarih | 2026-04-17 10:00 |

**SPC Olcum Verileri (Ic Cap — 5 numune x 5 alt grup):**

| Alt Grup | N1 | N2 | N3 | N4 | N5 | Ortalama | Range |
|----------|------|------|------|------|------|----------|-------|
| 1 (08:00) | 44.98 | 45.02 | 45.01 | 44.99 | 45.00 | 45.000 | 0.04 |
| 2 (09:00) | 45.01 | 44.97 | 45.03 | 45.00 | 44.99 | 45.000 | 0.06 |
| 3 (10:00) | 45.02 | 45.01 | 44.98 | 45.00 | 45.01 | 45.004 | 0.04 |
| 4 (11:00) | 44.99 | 45.00 | 45.02 | 44.98 | 45.01 | 45.000 | 0.04 |
| 5 (12:00) | 45.00 | 45.01 | 44.99 | 45.02 | 44.98 | 45.000 | 0.04 |

**Hesaplanan Degerler:**

| Parametre | Deger | Kabul Kriteri |
|-----------|-------|---------------|
| X-bar (Ortalama) | 45.001 mm | 44.85 — 45.15 |
| R-bar (Ort. Range) | 0.044 mm | — |
| Sigma (tahmini) | 0.019 mm | — |
| Cp | 5.26 | >1.33 UYGUN |
| Cpk | 5.21 | >1.33 UYGUN |

**Beklenen Sonuc:**
- SPC olcumleri kaydedildi
- Cp/Cpk degerleri yuksek (proses yeterli)
- Kontrol limitlerinin disinda olcum yok

**Dogrulama:**
- [ ] Proses kontrol kaydedildi
- [ ] 25 bireysel olcum girildi (5 x 5)
- [ ] Cp > 1.33 (UYGUN)
- [ ] Cpk > 1.33 (UYGUN)
- [ ] Kontrol limiti disi numune yok
- [ ] Sonuc: KABUL

**Bilinen Kisitlama:**
- Quvex'te tam kapsamli SPC modulu (X-bar R chart, kontrol limitleri, Cp/Cpk otomatik hesaplama) bulunmayabilir. Olcum degerleri muayene formuna manuel girilir.

---

## Adim 21: Sertlik Testi (Proses Kontrol)
**Ekran:** Kalite > Muayene (ayni muayene kaydina ek)

**Olcum Verileri (Shore A Sertlik — 5 numune):**

| Numune | Olcum | Spesifikasyon | Sonuc |
|--------|-------|---------------|-------|
| 1 | 71 | 70 ±5 | UYGUN |
| 2 | 69 | 70 ±5 | UYGUN |
| 3 | 70 | 70 ±5 | UYGUN |
| 4 | 72 | 70 ±5 | UYGUN |
| 5 | 70 | 70 ±5 | UYGUN |

**Ortalama:** 70.4 Shore A — UYGUN

**Dogrulama:**
- [ ] Sertlik olcumleri girildi
- [ ] Tum numueler spec icerisinde (65-75 Shore A)
- [ ] Ortalama 70.4 — nominal degere yakin

---

## Adim 22: Son Muayene (Final Inspection)
**Ekran:** Kalite > Son Muayene > Yeni Muayene
**API:** POST /FinalInspection (veya QualityInspection tipi: Final)

**Veri:**

| Alan | Deger |
|------|-------|
| Muayene No | SM-2026-0156 |
| Is Emri | IE-2026-0156 |
| Urun | ASL-CNT-001 |
| Toplam Uretim | 10,150 adet |
| Numune Buyuklugu | 200 adet (AQL 1.0, Level II) |
| Tarih | 2026-04-25 |

**Son Muayene Sonuclari:**

| Kontrol | Yontem | Numune | Kabul/Red | Sonuc |
|---------|--------|--------|-----------|-------|
| Ic Cap (45.00 ±0.15mm) | Kaliper | 200 | 0 red | UYGUN |
| Dis Cap (65.00 ±0.20mm) | Kaliper | 200 | 0 red | UYGUN |
| Kalinlik (3.50 ±0.10mm) | Mikrometre | 200 | 1 sinir | UYGUN |
| Sertlik (70 ±5 Shore A) | Durometer | 20 | 0 red | UYGUN |
| Gorsel Muayene | Buyutec | 200 | 2 kusur | UYGUN (AQL icerisinde) |

**Toplam Sonuc:**

| Kalem | Deger |
|-------|-------|
| Toplam Uretim | 10,150 |
| Hurda (toplam) | 150 |
| Sevk Edilebilir | 10,000 |
| Hurda Orani | %1.48 |
| Genel Sonuc | KABUL |

**Dogrulama:**
- [ ] Son muayene kaydedildi
- [ ] Tum kontrol noktalari degerlendirildi
- [ ] AQL bazli numuneleme yapildi (200/10,150)
- [ ] Gorsel kusur AQL limitinde (2 ≤ Ac=5)
- [ ] Genel sonuc KABUL
- [ ] Is emri "Muayene Tamam" durumuna gecti

---

## Adim 23: FAI — Ilk Parca Onay (First Article Inspection)
**Ekran:** Kalite > FAI / Ilk Parca Muayene
**API:** POST /FirstArticleInspection (veya ayri bir muayene tipi)

**Veri:**

| Alan | Deger |
|------|-------|
| FAI No | FAI-2026-0042 |
| Urun | ASL-CNT-001 |
| Is Emri | IE-2026-0156 |
| Numune | Ilk 5 adet (seri uretim oncesi) |
| Tarih | 2026-04-16 (uretim ilk gunu) |

**FAI Olcum Detayi (5 parca, tum boyutlar):**

| Boyut | Nominal | Tolerans | P1 | P2 | P3 | P4 | P5 | Sonuc |
|-------|---------|----------|----|----|----|----|----|-------|
| Ic Cap | 45.00 | ±0.15 | 45.01 | 44.99 | 45.02 | 45.00 | 44.98 | UYGUN |
| Dis Cap | 65.00 | ±0.20 | 65.02 | 64.98 | 65.01 | 65.00 | 65.03 | UYGUN |
| Kalinlik | 3.50 | ±0.10 | 3.51 | 3.49 | 3.50 | 3.52 | 3.48 | UYGUN |
| Sertlik | 70 | ±5 | 71 | 70 | 69 | 72 | 70 | UYGUN |

**Karar:** ONAYLANDI — Seri uretime devam

**Dogrulama:**
- [ ] FAI kaydedildi
- [ ] 5 numune, 4 boyut — 20 bireysel olcum
- [ ] Tum olcumler spec icerisinde
- [ ] FAI durumu "Onaylandi"
- [ ] FAI raporu PDF olarak alinabiliyor

**Bilinen Kisitlama:**
- Quvex'te ayri bir FAI modulu olmayabilir. Son muayene veya kontrol plani uzerinden FAI tipi olarak isaretlenebilir.

---

## Adim 24: CoC (Uygunluk Sertifikasi) Olustur
**Ekran:** Kalite > CoC / Uygunluk Sertifikasi
**API:** POST /CertificateOfConformity (veya CoC endpoint)

**Veri:**

| Alan | Deger |
|------|-------|
| CoC No | COC-2026-0078 |
| Musteri | Ford Otosan |
| Siparis Ref | SIP-2026-0078 |
| Urun | ASL-CNT-001 (Kaucuk Conta NBR-70) |
| Miktar | 10,000 Adet |
| Standart | IATF 16949 / ISO 9001:2015 |
| Beyan | "Yukarida belirtilen urun, musteri spesifikasyonlarina ve IATF 16949 gereksinimlerine uygun olarak uretilmis ve muayene edilmistir." |
| Onaylayan | Kalite Muduru — Hakan Ozturk |
| Tarih | 2026-04-25 |

**Dogrulama:**
- [ ] CoC belgesi olusturuldu
- [ ] Musteri ve siparis referanslari dogru
- [ ] Standart bilgisi gorunuyor
- [ ] PDF ciktisi alinabiliyor
- [ ] Dijital imza / onay tarihi mevcut

---

# ══════════════════════════════════════════════════════════════
# BOLUM 7: LOT TAKIBI ve DEPOLAMA
# ══════════════════════════════════════════════════════════════

## Adim 25: Lot / Seri Numara Atama
**Ekran:** Uretim > Lot Yonetimi / Seri Numara
**API:** POST /SerialNumber (veya Lot endpoint)

**Veri:**

| Alan | Deger |
|------|-------|
| Lot No | LOT-ASL-2026-0416 |
| Urun | ASL-CNT-001 |
| Is Emri | IE-2026-0156 |
| Miktar | 10,000 Adet |
| Uretim Tarihi | 2026-04-16 — 2026-04-25 |
| Hammadde Lot | LOT-KT-2026-0412 (NBR-70 izlenebilirlik) |
| Raf Omru | 24 ay (Son Kull. Tarihi: 2028-04-25) |

**Dogrulama:**
- [ ] Lot numarasi atandi
- [ ] Hammadde lot'u ile baglanti kuruldu (izlenebilirlik/genealogy)
- [ ] Uretim tarihi ve raf omru kaydedildi
- [ ] Lot bazli sorgulama calisiyor

---

## Adim 26: Depo Girisi (Mamul)
**Ekran:** Depo > Stok Hareketi > Giris
**API:** POST /StockMovement

**Veri:**

| Alan | Deger |
|------|-------|
| Islem Tipi | Uretim Girisi |
| Urun | ASL-CNT-001 |
| Miktar | 10,000 Adet |
| Depo | DP01 (Ana Depo) |
| Lot No | LOT-ASL-2026-0416 |
| Referans | IE-2026-0156 |
| Tarih | 2026-04-25 |

**Dogrulama:**
- [ ] Stok girisi yapildi
- [ ] DP01 stok miktari +10,000
- [ ] Lot numarasi stok hareketiyle eslesti
- [ ] Is emri durumu "Tamamlandi" olarak guncellendi
- [ ] Min stok kontrolu: 10,000 > 5,000 (Min stok ustu, uyari yok)

---

# ══════════════════════════════════════════════════════════════
# BOLUM 8: SEVKIYAT ve FATURA
# ══════════════════════════════════════════════════════════════

## Adim 27: Sevkiyat Hazirla
**Ekran:** Depo > Sevkiyat / Stok Cikis
**API:** POST /StockMovement (cikis tipi)

**Veri:**

| Alan | Deger |
|------|-------|
| Islem Tipi | Satis Cikisi |
| Musteri | Ford Otosan |
| Siparis Ref | SIP-2026-0078 |
| Urun | ASL-CNT-001 |
| Miktar | 10,000 Adet |
| Kaynak Depo | DP01 → DP03 (Sevkiyat Alani) |
| Lot No | LOT-ASL-2026-0416 |
| Tarih | 2026-04-28 |

**Dogrulama:**
- [ ] Stok cikisi yapildi
- [ ] DP01 stok: -10,000 (kalan: 0)
- [ ] Sevkiyat alani (DP03) stok: +10,000
- [ ] Lot izlenebilirlik korunuyor

---

## Adim 28: Irsaliye Olustur
**Ekran:** Sevkiyat > Irsaliye / Dokuman
**API:** POST /Waybill (veya ilgili sevkiyat dokuman endpoint)

**Veri:**

| Alan | Deger |
|------|-------|
| Irsaliye No | IRS-2026-0156 |
| Musteri | Ford Otosan |
| Siparis Ref | SIP-2026-0078 |
| Teslimat Adresi | Ford Otosan Golcuk Fab., Dock 7 |
| Tasiyici | Aslan Otomotiv kendi aracı |
| Plaka | 41 ABC 789 |
| Sevk Tarihi | 2026-04-28 |

**Irsaliye Kalemleri:**

| Urun | Miktar | Birim | Koli/Palet | Lot No |
|------|--------|-------|------------|--------|
| ASL-CNT-001 | 10,000 | Adet | 10 koli x 1,000 | LOT-ASL-2026-0416 |

**Dogrulama:**
- [ ] Irsaliye olusturuldu
- [ ] Siparis referansi dogru
- [ ] Lot numarasi irsaliyede gorunuyor
- [ ] PDF ciktisi alinabiliyor (tasiyiciya verilecek suret)

**Bilinen Kisitlama:**
- Quvex'te ayri bir irsaliye modulu olmayabilir. Sevkiyat fisi veya stok cikis belgesi olarak kullanilabilir.

---

## Adim 29: Fatura Olustur
**Ekran:** Fatura Yonetimi > Yeni Fatura
**API:** POST /Invoice

**Veri:**

| Alan | Deger |
|------|-------|
| Fatura No | FTR-2026-0312 |
| Fatura Tipi | Satis Faturasi |
| Musteri | Ford Otosan |
| Siparis Ref | SIP-2026-0078 |
| Fatura Tarihi | 2026-04-28 |
| Vade Tarihi | 2026-06-27 (60 gun) |
| Para Birimi | TRY |

**Fatura Kalemleri:**

| Urun | Miktar | Birim Fiyat | Tutar |
|------|--------|-------------|-------|
| ASL-CNT-001 (Kaucuk Conta NBR-70) | 10,000 | 12.50 TL | 125,000.00 TL |

**Fatura Ozeti:**

| Kalem | Tutar |
|-------|-------|
| Ara Toplam | 125,000.00 TL |
| KDV (%20) | 25,000.00 TL |
| Genel Toplam | 150,000.00 TL |

**Dogrulama:**
- [ ] Fatura olusturuldu
- [ ] Siparis referansi dogru baglandi
- [ ] KDV hesabi dogru
- [ ] Vade tarihi 60 gun sonra (2026-06-27)
- [ ] Fatura PDF ciktisi alinabiliyor
- [ ] e-Fatura entegrasyonu tetiklendi (stub seviyesinde)
- [ ] Fatura durumu "Kesildi"

---

## Adim 30: Odeme Takibi
**Ekran:** Finans > Odeme Kayitlari / Cari Hesap
**API:** POST /Payment

**Senaryo 1 — Kismi Odeme (30. gün):**

| Alan | Deger |
|------|-------|
| Odeme No | OD-2026-0445 |
| Musteri | Ford Otosan |
| Fatura Ref | FTR-2026-0312 |
| Odeme Tarihi | 2026-05-28 |
| Tutar | 75,000.00 TL |
| Odeme Yontemi | Banka Havale |
| Banka | Garanti BBVA |
| Notlar | 1. taksit odemesi |

**Senaryo 2 — Kalan Odeme (60. gün):**

| Alan | Deger |
|------|-------|
| Odeme No | OD-2026-0501 |
| Musteri | Ford Otosan |
| Fatura Ref | FTR-2026-0312 |
| Odeme Tarihi | 2026-06-27 |
| Tutar | 75,000.00 TL |
| Odeme Yontemi | Banka Havale |
| Banka | Garanti BBVA |
| Notlar | 2. taksit odemesi — fatura kapandi |

**Dogrulama:**
- [ ] 1. odeme kaydedildi (75,000 TL)
- [ ] Fatura kalan bakiyesi: 75,000 TL
- [ ] 2. odeme kaydedildi (75,000 TL)
- [ ] Fatura durumu "Odendi" olarak guncellendi
- [ ] Cari hesap bakiyesi: 0 TL
- [ ] Odeme gecmisi listesinde 2 kayit gorunuyor

**Bilinen Kisitlama:**
- Payment.Amount tipi `double` (decimal degil). Buyuk tutarlarda yuvarlama hatasi olusabilir.

---

# ══════════════════════════════════════════════════════════════
# BOLUM 9: PPAP PAKET ve DOKUMANTASYON
# ══════════════════════════════════════════════════════════════

## Adim 31: PPAP Paket Dosyasi Hazirla
**Ekran:** Kalite > Dokuman Yonetimi / PPAP
**API:** Mevcut dokümanlardan derleme (manuel veya otomatik)

**PPAP Level 3 icerigi (Ford Otosan talepleri):**

| PPAP Elementi | Dokuman | Quvex Modulu | Durum |
|---------------|---------|-------------|-------|
| 1. Design Records | Teknik cizim DWG-CNT-001-R03 | Urun Yonetimi | Mevcut |
| 2. Engineering Change Docs | — | — | N/A (ilk uretim) |
| 3. Customer Approval | Ford Otosan onay maili | Dokuman | Manuel yukleme |
| 4. Design FMEA | — | — | Musteri sorumlulugunda |
| 5. Process Flow Diagram | Proses akis semasi | Dokuman | Manuel yukleme |
| 6. Process FMEA | FMEA kaydı (Adim 12) | Kalite | Mevcut |
| 7. Control Plan | KP-CNT-001 (Adim 11) | Kalite | Mevcut |
| 8. MSA (Measurement System Analysis) | Gage R&R raporu | Dokuman | Manuel yukleme |
| 9. Dimensional Results | FAI olcumleri (Adim 23) | Kalite | Mevcut |
| 10. Material/Performance Test | Sertlik, boyut test | Kalite | Mevcut |
| 11. Initial Process Studies | SPC/Cp/Cpk (Adim 20) | Kalite | Mevcut |
| 12. Qualified Lab Docs | Lab sertifikasi | Dokuman | Manuel yukleme |
| 13. Appearance Approval | Gorsel onay formu | Dokuman | Manuel yukleme |
| 14. Sample Parts | 5 numune (fiziksel) | — | Fiziksel teslimat |
| 15. Master Sample | 1 referans numune | — | Fiziksel |
| 16. Checking Aids | — | — | N/A |
| 17. Customer Requirements | Ford Otosan spec | Dokuman | Manuel yukleme |
| 18. PSW (Part Submission Warrant) | PSW formu | Dokuman/CoC | Olusturulacak |

**Dogrulama:**
- [ ] PPAP dosya listesi olusturuldu
- [ ] Quvex'ten otomatik cekilebilen dokumanlar: Kontrol Plani, FAI, SPC, CoC
- [ ] Manuel yuklenmesi gereken dokumanlar belirlendi
- [ ] PSW formu olusturuldu veya sablonu mevcut
- [ ] PPAP paketi PDF/ZIP olarak indirilebiliyor

**Bilinen Kisitlama:**
- Quvex'te tam kapsamli PPAP workflow'u bulunmuyor. 18 elementten 5-6'si sistem uzerinden otomatik cekilebilir; geri kalani dokuman yonetimi uzerinden manuel yuklenir.
- MSA (Gage R&R), Proses Akis Diyagrami, Gorsel Onay formlari ayri moduller olarak mevcut degil.

---

# ══════════════════════════════════════════════════════════════
# BOLUM 10: TEDARIKCI DEGERLENDIRME ve MALIYET ANALIZI
# ══════════════════════════════════════════════════════════════

## Adim 32: Tedarikci Degerlendirme
**Ekran:** Kalite > Tedarikci Degerlendirme / Tedarikci Performans
**API:** POST /SupplierEvaluation (veya ilgili endpoint)

**Degerlendirme — KaucukTech Polimer:**

| Kriter | Agirlik | Puan (1-10) | Agirlikli Puan |
|--------|---------|-------------|----------------|
| Kalite (Giris KK ret orani) | %30 | 9 | 2.70 |
| Teslimat (zamaninda teslimat) | %25 | 8 | 2.00 |
| Fiyat rekabetciligi | %20 | 7 | 1.40 |
| Dokumantasyon (sertifika) | %15 | 9 | 1.35 |
| Iletisim / Destek | %10 | 8 | 0.80 |
| **TOPLAM** | **%100** | — | **8.25 / 10** |

**Degerlendirme Sonucu:** A sinifi tedarikci (>8.0) — Tercih Edilen

**Dogrulama:**
- [ ] Tedarikci degerlendirme kaydedildi
- [ ] Agirlikli puan otomatik hesaplandi
- [ ] Siniflandirma: A (8.25 >= 8.0)
- [ ] Degerlendirme gecmisi gorunuyor

**Bilinen Kisitlama:**
- Quvex'te tam kapsamli tedarikci degerlendirme skorkart modulu olmayabilir. Basit not/puan alani ile kayit tutulabilir.

---

## Adim 33: Maliyet Analizi (Gerceklesen vs Planlanan)
**Ekran:** Raporlar > Maliyet Analizi / Is Emri Maliyet
**API:** GET /WorkOrder/{id}/cost (veya maliyet raporu endpoint)

**Planlanan Maliyet (10,000 adet):**

| Kalem | Planlanan | Birim |
|-------|-----------|-------|
| Hammadde | 48,000 TL | (50 levha x 850 + 25 Kg x 120 + 100 paket x 25) |
| Iscilik | 18,000 TL | (tahmini 300 saat x 60 TL/saat) |
| Genel Gider | 9,000 TL | (%50 iscilik ustu) |
| **Toplam** | **75,000 TL** | |
| **Birim Maliyet** | **7.50 TL/adet** | |

**Gerceklesen Maliyet (10,000 adet):**

| Kalem | Gerceklesen | Fark | Aciklama |
|-------|-------------|------|----------|
| Hammadde | 52,860 TL | +4,860 TL (+%10.1) | Fire + emniyet stogu |
| Iscilik | 19,200 TL | +1,200 TL (+%6.7) | OP40 capak alma beklentiden uzun |
| Genel Gider | 9,600 TL | +600 TL | Iscilik artisina paralel |
| **Toplam** | **81,660 TL** | **+6,660 TL (+%8.9)** | |
| **Birim Maliyet** | **8.17 TL/adet** | **+0.67 TL** | |

**Kar Analizi:**

| Kalem | Tutar |
|-------|-------|
| Satis Geliri | 125,000 TL |
| Toplam Maliyet | 81,660 TL |
| Brut Kar | 43,340 TL |
| Kar Marji | %34.7 |
| Planlanan Kar Marji | %40.0 |
| Sapma | -%5.3 puan |

**Dogrulama:**
- [ ] Maliyet raporu goruntulenebiliyor
- [ ] Hammadde maliyeti dogru hesaplandi
- [ ] Iscilik maliyeti operasyon surelerinden turetildi
- [ ] Gerceklesen vs planlanan karsilastirma tablosu mevcut
- [ ] Kar marji hesaplandi (%34.7)
- [ ] Sapma analizi: hammadde fire orani beklentiden yuksek

**Bilinen Kisitlama:**
- Quvex'te detayli ABC maliyet muhasebesi modulu yok. Is emri bazli basit maliyet takibi yapilabilir.

---

# ══════════════════════════════════════════════════════════════
# BOLUM 11: EK ISLEMLER ve KAPANIŞ
# ══════════════════════════════════════════════════════════════

## Adim 34: Siparis Durumu Guncelle
**Ekran:** Siparis Yonetimi > Siparis Detay
**API:** PUT /SalesOrder/{id}/status

**Islem:**
- Siparis durumunu "Acik" → "Tamamlandi" olarak degistir
- Tum kalemler sevk edildi, fatura kesildi

**Dogrulama:**
- [ ] Siparis durumu "Tamamlandi"
- [ ] Siparis listesinde durum filtresi calisiyor
- [ ] Sipariste sevkiyat, fatura, odeme baglantilari gorunuyor

---

## Adim 35: Is Emri Kapanisi
**Ekran:** Uretim > Is Emri Detay
**API:** PUT /WorkOrder/{id}/status

**Islem:**
- Is emri durumunu "Tamamlandi" olarak onayla
- Tum operasyonlar kapandi, son muayene KABUL

**Kapanis Ozeti:**

| Alan | Deger |
|------|-------|
| Toplam Uretim | 10,150 adet |
| Hurda | 150 adet (%1.48) |
| Sevk Edilen | 10,000 adet |
| Toplam Sure | 7.5 is gunu |
| Makine Verimlilik | %87 (OEE tahmini) |

**Dogrulama:**
- [ ] Is emri "Tamamlandi" durumunda
- [ ] Tum operasyonlar kapandi
- [ ] Hurda kayitlari dogru
- [ ] Is emri suresi dogru hesaplandi

---

## Adim 36: Musteri Iade Senaryosu (Negatif Test)
**Ekran:** Kalite > MRB (Material Review Board) / Iade
**API:** POST /CustomerReturn (veya MRB endpoint)

**Senaryo:** Ford Otosan 50 adet contanin sertliginin dusuk oldugunu raporladi

**Veri:**

| Alan | Deger |
|------|-------|
| Iade No | IAD-2026-0012 |
| Musteri | Ford Otosan |
| Urun | ASL-CNT-001 |
| Miktar | 50 adet |
| Sebep | Sertlik dusuk (olcum: 63 Shore A, spec: 65-75) |
| Lot No | LOT-ASL-2026-0416 |
| Tarih | 2026-05-15 |

**Beklenen Aksiyonlar:**
1. MRB toplantisi kaydi olustur
2. Kok neden analizi yap (8D veya 5-Why)
3. Karar: Red — 50 adet hurda
4. Duzeltici faaliyet ac (vulkanizasyon parametreleri gozden gecir)
5. Musteri bilgilendirme

**Dogrulama:**
- [ ] Iade kaydi olusturuldu
- [ ] Lot bazli izlenebilirlik calisti (LOT-ASL-2026-0416)
- [ ] MRB kaydi olusturuldu
- [ ] Duzeltici faaliyet acildi
- [ ] Stok duzeltmesi yapildi (-50 adet hurda)

**Bilinen Kisitlama:**
- Quvex'te 8D rapor sablonu yok. MRB ve duzeltici faaliyet modulleri mevcut ancak IATF 16949'un tam 8D formatini desteklemiyor.

---

## Adim 37: Stok Durumu Kontrol
**Ekran:** Depo > Stok Durumu / Stok Raporu
**API:** GET /Stock (veya StockReport)

**Beklenen Stok Durumlari (test sonrasi):**

| Urun | Depo | Miktar | Not |
|------|------|--------|-----|
| ASL-CNT-001 (Conta) | DP01 | 0 | Tumu sevk edildi |
| ASL-CNT-001 (Conta) | DP03 | 0 | Sevk tamamlandi |
| HM-KAU-001 (Kaucuk Levha) | DP02 | 5 | 55 geldi - 50 kullanildi (fire dahil) |
| HM-VUL-001 (Vulk. Katkisi) | DP02 | 2.5 Kg | 28 - 25.5 kullanildi |
| HM-AMB-001 (PE Torba) | DP02 | 10 | 110 - 100 kullanildi |

**Dogrulama:**
- [ ] Stok raporu dogru
- [ ] Tum stok hareketleri izlenebilir (giris/cikis/uretim)
- [ ] Hammadde kalan miktarlari dogru
- [ ] Negatif stok olusmadigini kontrol et
- [ ] Min stok uyarisi: HM-KAU-001 kalan 5 < min 50 — UYARI bekleniyor

---

## Adim 38: Dashboard ve Raporlar
**Ekran:** Ana Sayfa / Dashboard
**API:** GET /Dashboard (veya ilgili rapor endpoint'leri)

**Kontrol Edilecek Dashboard Verileri:**

| Widget | Beklenen Deger |
|--------|---------------|
| Acik Siparis Sayisi | Degismemeli (bu siparis kapandi) |
| Aylik Ciro | +125,000 TL (Nisan) |
| Tahsilat Durumu | 150,000 TL (odendi) |
| Aktif Is Emri | 0 (IE-2026-0156 kapandi) |
| Hurda Orani (aylik) | %1.48 |
| Kalite Performansi | %100 (son muayene kabul) |

**Dogrulama:**
- [ ] Dashboard verileri guncel
- [ ] Ciro ve tahsilat tutarlari dogru
- [ ] Grafik ve widget'lar yukluyor
- [ ] NaN veya bos deger yok
- [ ] Filtreleme calisiyor (tarih, musteri, urun)

---

# ══════════════════════════════════════════════════════════════
# ROL BAZLI TEST
# ══════════════════════════════════════════════════════════════

Asagidaki testler farkli kullanici rolleriyle giris yaparak yurutulmelidir.
Her rol icin gorunurluk ve erisim kontrolu test edilir.

---

## Rol 1: Uretim Muduru
**Giris:** uretim.muduru@aslanotomotiv.com / TestSifre123!@

**Gorunmesi Gereken Menuler:**
- [x] Uretim > Is Emirleri
- [x] Uretim > Uretim Terminali
- [x] Uretim > Operasyon Takibi
- [x] Uretim > Makine Durumu
- [x] Uretim > Kapasite Planlama
- [x] Stok > Stok Durumu (salt okunur)
- [x] Raporlar > Uretim Raporlari

**Gorunmemesi Gereken Menuler:**
- [ ] Fatura Yonetimi
- [ ] Odeme Kayitlari
- [ ] Finans Raporlari
- [ ] Teklif Yonetimi (satis)
- [ ] Kullanici Yonetimi (admin)

**Test Islemleri:**
1. Is emri ac — BASARILI olmali
2. Operasyon kaydi gir — BASARILI olmali
3. Fatura olustur — YETKISIZ (403 veya menu gorunmez)
4. Kullanici ekle — YETKISIZ

**Dogrulama:**
- [ ] Sadece uretim menuleri gorunuyor
- [ ] Is emri CRUD islemleri calisiyor
- [ ] Finans islemleri engellendi
- [ ] Yetkisiz erisim denemesinde uygun hata mesaji

---

## Rol 2: Kalite Muduru
**Giris:** kalite.muduru@aslanotomotiv.com / TestSifre123!@

**Gorunmesi Gereken Menuler:**
- [x] Kalite > Muayene Kayitlari
- [x] Kalite > Kontrol Planlari
- [x] Kalite > CoC / Sertifikalar
- [x] Kalite > MRB / Iade
- [x] Kalite > Son Muayene
- [x] Kalite > FAI
- [x] Kalite > Tedarikci Degerlendirme
- [x] Raporlar > Kalite Raporlari

**Gorunmemesi Gereken Menuler:**
- [ ] Fatura Yonetimi
- [ ] Odeme Kayitlari
- [ ] Satin Alma Siparisleri
- [ ] Kullanici Yonetimi

**Test Islemleri:**
1. Muayene kaydi olustur — BASARILI olmali
2. CoC olustur — BASARILI olmali
3. Son muayene onayla — BASARILI olmali
4. Fatura goruntule — YETKISIZ
5. Is emri ac — YETKISIZ (sadece goruntuleyebilir)

**Dogrulama:**
- [ ] Kalite menuleri tam erisim
- [ ] Muayene CRUD islemleri calisiyor
- [ ] Finans ve satin alma engellendi
- [ ] Is emri salt okunur goruntulenebilir (uretim bilgisi icin)

---

## Rol 3: Muhasebeci
**Giris:** muhasebe@aslanotomotiv.com / TestSifre123!@

**Gorunmesi Gereken Menuler:**
- [x] Fatura Yonetimi
- [x] Odeme Kayitlari
- [x] Cari Hesaplar
- [x] Finans Raporlari
- [x] Banka Mutabakati
- [x] Musteri Yonetimi (cari bilgileri icin)
- [x] Raporlar > Maliyet / Finans

**Gorunmemesi Gereken Menuler:**
- [ ] Uretim > Is Emirleri
- [ ] Uretim > Operasyon Takibi
- [ ] Kalite > Muayene
- [ ] Kalite > FMEA
- [ ] Kullanici Yonetimi

**Test Islemleri:**
1. Fatura olustur — BASARILI olmali
2. Odeme kaydi gir — BASARILI olmali
3. Cari hesap bakiyesi sorgula — BASARILI olmali
4. Is emri ac — YETKISIZ
5. Muayene kaydi olustur — YETKISIZ

**Dogrulama:**
- [ ] Finans menuleri tam erisim
- [ ] Fatura ve odeme CRUD calisiyor
- [ ] Uretim ve kalite engellendi
- [ ] Cari hesap mutabakati gorunuyor

---

## Rol 4: Operator (ShopFloor)
**Giris:** operator@aslanotomotiv.com / TestSifre123!@

**Gorunmesi Gereken Menuler:**
- [x] Uretim Terminali (ShopFloor)
- [x] Kendi operasyonlari (atanmis isler)

**Gorunmemesi Gereken Menuler:**
- [ ] Musteri Yonetimi
- [ ] Teklif / Siparis
- [ ] Fatura / Odeme
- [ ] Kalite (muayene olusturma)
- [ ] Raporlar (yonetim raporlari)
- [ ] Ayarlar

**Test Islemleri:**
1. Terminal ekraninda atanmis isi gor — BASARILI
2. Operasyon basla/bitir — BASARILI
3. Hurda miktari gir — BASARILI
4. Is emri ac — YETKISIZ
5. Musteri kaydi gor — YETKISIZ
6. Fiyat bilgisi gor — YETKISIZ (fiyat alanlari gizli)

**Dogrulama:**
- [ ] Sadece terminal ekrani gorunuyor
- [ ] Atanmis operasyonlar listeleniyor
- [ ] Baslat/Bitir/Hurda kaydi calisiyor
- [ ] Fiyat bilgileri tamamen gizli
- [ ] Yonetim menuleri gorunmuyor

---

# ══════════════════════════════════════════════════════════════
# BILINEN KISITLAMALAR
# ══════════════════════════════════════════════════════════════

Asagidaki ozellikler Quvex'in mevcut kapsaminda tam olarak desteklenmemektedir.
Otomotiv yan sanayi senaryosu icin gelecekte gelistirilmesi onerilen alanlardir.

### 1. PPAP Workflow
- **Durum:** Tam kapsamli PPAP modulu yok
- **Etki:** 18 PPAP elementinden sadece 5-6'si Quvex'ten otomatik cekilebilir
- **Cozum:** Dokuman yonetimi uzerinden manuel yukleme
- **Oneri:** PPAP sablon ve workflow modulu eklenmeli

### 2. SPC (Statistical Process Control)
- **Durum:** Otomatik Cp/Cpk hesaplama, X-bar R chart modulu yok
- **Etki:** Proses kontrol degerleri manuel girilir, grafiksel analiz yok
- **Cozum:** Muayene formuna olcum degerleri girilir, hesaplama dis aracla yapilir
- **Oneri:** SPC modulu: Kontrol grafikleri, proses yeterlilik otomatik hesaplama

### 3. FMEA (Failure Mode and Effects Analysis)
- **Durum:** AIAG/VDA FMEA 5th edition formatinda modul yok
- **Etki:** Risk analizi basit not/puan bazli
- **Cozum:** Risk analizi modulu veya dokuman olarak yukleme
- **Oneri:** FMEA modulu: S/O/D puanlama, RPN hesaplama, aksiyonlar

### 4. MSA (Measurement System Analysis)
- **Durum:** Gage R&R modulu yok
- **Etki:** Olcum sistemi analizi dis aracla yapilmali
- **Oneri:** Basit Gage R&R sablon ve hesaplama

### 5. 8D Rapor
- **Durum:** 8D problem cozme sablonu yok
- **Etki:** Musteri sikayetleri icin standart 8D formatinda rapor uretilemez
- **Cozum:** MRB ve duzeltici faaliyet modulleri kullanilir
- **Oneri:** 8D rapor sablonu ve musteri sikayet workflow'u

### 6. Irsaliye Modulu
- **Durum:** Ayri irsaliye modulu sinirli olabilir
- **Etki:** Sevkiyat belgesi olarak stok cikis fisi kullanilir
- **Cozum:** Stok cikis belgesi PDF olarak duzenlenebilir
- **Oneri:** e-Irsaliye entegrasyonu (GIB)

### 7. Maliyet Muhasebesi
- **Durum:** ABC (Activity Based Costing) modulu yok
- **Etki:** Detayli maliyet dagilimi (direkt/endirekt) yapilamaz
- **Cozum:** Is emri bazli basit maliyet takibi
- **Oneri:** Maliyet merkezleri, genel gider dagilim anahtarlari

### 8. Otomotiv Spesifik Alanlar
- **PPAP Level secimi:** Siparis formunda PPAP Level dropdown yok
- **Ford Otosan P/N:** Musteri parca numarasi alani sinirli
- **EDI entegrasyonu:** Ford Otosan elektronik veri degisimi (EDIFACT) destegi yok
- **Barkod/QR:** Ambalaj etiketi icin barkod uretimi sinirli
- **IMDS:** International Material Data System entegrasyonu yok

### 9. Payment.Amount Veri Tipi
- **Durum:** `double` tipi kullanilmaktadir
- **Etki:** Buyuk tutarlarda (>1M TL) veya cok sayida islemde yuvarlama hatasi riski
- **Oneri:** `decimal` tipine gecis yapilmali

### 10. Tedarikci Degerlendirme
- **Durum:** Basit not/puan sistemi
- **Etki:** Agirlikli skorkart, otomatik siniflandirma (A/B/C) yok
- **Oneri:** Tedarikci performans skorkart modulu

---

# ══════════════════════════════════════════════════════════════
# TEST SONUC OZETI SABLONU
# ══════════════════════════════════════════════════════════════

Test tamamlandiginda asagidaki tablo doldurulur:

| Bolum | Adim Sayisi | Basarili | Basarisiz | Atlanan | Notlar |
|-------|-------------|----------|-----------|---------|--------|
| 1. Musteri ve Urun | 6 | | | | |
| 2. Teklif ve Siparis | 4 | | | | |
| 3. Kalite Planlama | 2 | | | | |
| 4. Satin Alma | 3 | | | | |
| 5. Uretim | 4 | | | | |
| 6. Kalite Kontrol | 5 | | | | |
| 7. Lot ve Depo | 2 | | | | |
| 8. Sevkiyat ve Fatura | 4 | | | | |
| 9. PPAP Paket | 1 | | | | |
| 10. Tedarikci/Maliyet | 2 | | | | |
| 11. Ek Islemler | 5 | | | | |
| **TOPLAM** | **38** | | | | |

| Rol Test | Basarili | Basarisiz | Notlar |
|----------|----------|-----------|--------|
| Uretim Muduru | | | |
| Kalite Muduru | | | |
| Muhasebeci | | | |
| Operator | | | |

---

**Test Hazirlayan:** QA Muhendisi
**Tarih:** 2026-04-10
**Revizyon:** Rev.A
**Sonraki Gozden Gecirme:** Sprint sonrasi veya yeni modul eklenmesinde
