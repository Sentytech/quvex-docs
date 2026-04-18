# Savunma Ozel Prosesler — Uctan Uca Test Senaryolari

> 4 alt sektor senaryosu: NDT, Optik/Hassas Montaj, Hassas Dokum, Kalip/Takim Imalati
> Her senaryo 15-20 adim, kompakt format
> Toplam: ~60-80 adim, 4 farkli savunma alt sektoru

---

## Senaryo 1: NDT (Tahribatsiz Muayene) Firmasi

### Senaryo Bilgileri

| Bilgi | Deger |
|-------|-------|
| **Firma** | Guventest NDT Hizmetleri Ltd.Sti. |
| **Personel** | 10 kisi (3 Level II, 1 Level III NDT inspektur) |
| **Sektor** | Fason NDT hizmetleri — savunma CNC/kaynak atblyeleri |
| **Standartlar** | NAS 410, ASNT SNT-TC-1A, ASTM E1444 (MT), ASTM E165 (PT), ASTM E1742 (RT), ASTM E2375 (UT) |
| **Hizmetler** | Radyografik (RT), Ultrasonik (UT), Sivi Penetrant (PT), Manyetik Parcacik (MT) |
| **Adim Sayisi** | 18 |
| **Senaryo** | CNC atoly esinden gelen kaynak grubu parcalarin NDT muayenesi — parca kabul, metod secimi, muayene, degerlendirme, rapor, sertifika, fatura |

### Bilinen Kisitlamalar

| # | Eksik Modul/Ozellik | Workaround |
|---|---------------------|------------|
| K1 | NDT rapor sablonu (RT/UT/PT/MT) ozel modulu yok | Kontrol Plani + not alanlarina muayene sonuclari yazilir |
| K2 | Film/dijital goruntu yukleme ozel alani yok | Genel dosya eki (attachment) olarak yuklenir |
| K3 | NDT personel sertifika seviyesi (Level I/II/III) ayri alan yok | Kalibrasyon modulunde ekipman olarak takip edilir |
| K4 | Kabul/ret kriterleri standartlara gore otomatik degerlendirme yok | Muayene sonucunda elle Kabul/Ret/Kosullu Kabul secilir |
| K5 | Film yogunluk/IQI duyarlilik kaydı ozel alan yok | Not alanina yazilir |

### On Kosullar

- Quvex sistemine NDT firmasi olarak giris yapilmis
- Kalibrasyon modulunde NDT ekipmanlari tanimli (X-ray tup, UT cihazi, UV lamba, yoke)
- NDT personel sertifikalari kalibrasyon modulunde "ekipman" olarak tanimli
- En az 1 musteri (CNC atoly esi) tanimli

---

### Adim 1: Musteri Tanimi
**Ekran:** Musteriler (`/customers`)
**API:** `POST /customer`

| Alan | Deger |
|------|-------|
| Firma Adi | Ozdemir Kaynak Muhendislik Ltd.Sti. |
| Yetkili | Kemal Ozdemir |
| Telefon | +90 312 555 4400 |
| Email | kemal@ozdemiркaynak.com.tr |
| Vergi No | 9876543210 |
| Kategori | B (Duzenly Musteri) |
| Not | AWS D17.1 kaynak atoly esi, NADCAP kaynak onayli |

**Beklenen Sonuc:** Musteri karti olusturuldu, listede gorunuyor
**Dogrulama:**
- [ ] Musteri `/customers` listesinde gorunuyor
- [ ] Iletisim bilgileri eksiksiz

### Adim 2: NDT Personel Sertifika Tanimi (Kalibrasyon Workaround)
**Ekran:** Kalite > Kalibrasyon (`/quality/calibration`)
**API:** `POST /calibration/equipment`

| Kod | Personel | Sertifika | Seviye | Metod | Frekans | Son | Sonraki |
|-----|----------|-----------|--------|-------|---------|-----|---------|
| NDT-001 | Hasan Yilmaz | ASNT SNT-TC-1A | Level III | RT, UT, PT, MT | 5 Yillik | 2024-06-01 | 2029-06-01 |
| NDT-002 | Emre Kara | ASNT SNT-TC-1A | Level II | RT, UT | 5 Yillik | 2025-01-15 | 2030-01-15 |
| NDT-003 | Serkan Demir | ASNT SNT-TC-1A | Level II | PT, MT | 5 Yillik | 2025-03-20 | 2030-03-20 |
| NDT-004 | Murat Celik | NAS 410 | Level II | RT | 5 Yillik | 2024-09-01 | 2029-09-01 |

**Beklenen Sonuc:** 4 NDT personel sertifikasi kalibrasyon modulunde gorunuyor
**Dogrulama:**
- [ ] Seviye bilgileri (Level I/II/III) not alaninda yazili
- [ ] Metod kapsamlari (RT/UT/PT/MT) belgelendi
- [ ] Suresi yaklasanlar icin uyari mekanizmasi aktif

### Adim 3: NDT Ekipman Kalibrasyonu
**Ekran:** Kalite > Kalibrasyon (`/quality/calibration`) | **API:** `POST /calibration/equipment`

| Kod | Ekipman | Frekans | Son → Sonraki |
|-----|---------|---------|---------------|
| RT-001 | X-Ray Tup (YXLON Y.MU2000-D) | Yillik | 2026-01-15 → 2027-01-15 |
| RT-002 | Densitometre (X-Rite 361T) | 6 Aylik | 2026-02-01 → 2026-08-01 |
| UT-001 | UT Dedektoru (Olympus Epoch 650) | 6 Aylik | 2026-03-01 → 2026-09-01 |
| PT-001 | UV-A Lamba (Magnaflux ZB-100F) | 6 Aylik | 2026-02-15 → 2026-08-15 |
| MT-001 | AC Yoke (Parker DA-400) | Yillik | 2026-01-10 → 2027-01-10 |
| IQI-001 | IQI Seti (ASTM E1025) | Yillik | 2026-01-15 → 2027-01-15 |

**Dogrulama:** 6 ekipman tanimli, tumu kalibrasyon suresi icinde, dashboard %100

### Adim 4: Hizmet Urunu Tanimlari
**Ekran:** Urunler (`/products/form`)
**API:** `POST /product`

| Urun Kodu | Hizmet Adi | Birim | Fiyat |
|-----------|------------|-------|-------|
| NDT-RT-01 | Radyografik Muayene (RT) — Film/Dijital | Pozlama | 850 TL |
| NDT-UT-01 | Ultrasonik Muayene (UT) — Temas Yontemi | Saat | 600 TL |
| NDT-PT-01 | Sivi Penetrant Muayene (PT) | Parca | 350 TL |
| NDT-MT-01 | Manyetik Parcacik Muayene (MT) | Parca | 400 TL |

**Beklenen Sonuc:** 4 hizmet urunu tanimlandi
**Dogrulama:**
- [ ] Urun tipleri "Hizmet" olarak isaretli
- [ ] Birim fiyatlari girildi

### Adim 5: Fason Is Alimi — Siparis
**Ekran:** Siparisler (`/orders/form`)
**API:** `POST /order`

| Alan | Deger |
|------|-------|
| Musteri | Ozdemir Kaynak Muhendislik Ltd.Sti. |
| Siparis No | NDT-2026-0042 |
| Referans | Ozdemir Kaynak IS-2026-188 (kaynak grubu RT muayene) |
| Urun | NDT-RT-01 (Radyografik Muayene) |
| Miktar | 8 pozlama (4 parca x 2 dikis/parca) |
| Termin | 5 is gunu |
| Not | AWS D17.1 Sinif A kabul kriteri, %100 RT, Inconel 718 kaynak dikisleri |

**Beklenen Sonuc:** Siparis olusturuldu, durumu ONAYLANDI
**Dogrulama:**
- [ ] Siparis listesinde gorunuyor
- [ ] Termin tarihi dogru hesaplandi

### Adim 6: Parca Kabul ve Seri Numara Atama
**Ekran:** Depo > Giris (`/warehouse/receiving`)
**API:** `POST /warehouse/receiving`

| Alan | Deger |
|------|-------|
| Gondertici | Ozdemir Kaynak Muhendislik |
| Parca | Fuze Motor Tutucu Braketi — Kaynak Grubu |
| Miktar | 4 adet |
| Seri No | OZD-FMB-001 ~ OZD-FMB-004 |
| Durum | Muayene Bekliyor |

**Beklenen Sonuc:** 4 parca depoya giris yapti, seri numaralari atandi
**Dogrulama:**
- [ ] Seri numaralar izlenebilirlik modulunde gorunuyor
- [ ] Stok durumu "Muayene Bekliyor"

### Adim 7: Is Emri Olusturma — NDT Operasyonlari
**Ekran:** Uretim > Is Emirleri (`/production/work-orders/form`)
**API:** `POST /workorder`

| Alan | Deger |
|------|-------|
| Is Emri No | WO-NDT-2026-0042 |
| Siparis | NDT-2026-0042 |
| Urun | NDT-RT-01 |
| Miktar | 8 pozlama |

**Operasyon Adimlari:**
| Adim | Operasyon | Sorumlu | Sure |
|------|-----------|---------|------|
| OP10 | Parca Kabul + Yuzey Temizligi | Level II (Emre Kara) | 30 dk |
| OP20 | Film/Panel Hazirligi + IQI Yerlestirme | Level II (Emre Kara) | 45 dk |
| OP30 | Pozlama (X-Ray) | Level II (Murat Celik) | 120 dk |
| OP40 | Film Banyo / Dijital Okuma | Level II (Murat Celik) | 60 dk |
| OP50 | Degerlendirme (Film Yorumlama) | Level III (Hasan Yilmaz) | 90 dk |
| OP60 | Rapor Hazirlama + Sertifika | Level III (Hasan Yilmaz) | 60 dk |

**Beklenen Sonuc:** Is emri olusturuldu, 6 operasyon atandi
**Dogrulama:**
- [ ] Operasyonlar sirasıyla listelendi
- [ ] Level III personel degerlendirme adimina atandi

### Adim 8: ShopFloor — Parca Kabul ve Yuzey Kontrolu
**Ekran:** ShopFloor Terminal (`/shopfloor`)
**API:** `POST /workorder/{id}/operations/{opId}/start`

| Alan | Deger |
|------|-------|
| Operasyon | OP10 — Parca Kabul + Yuzey Temizligi |
| Operator | Emre Kara (NDT-002, Level II) |
| Kontrol | Yuzey pislik/yag/boya kalintisi yok, kaynak dikisleri erisilebilir |
| Not | 4 parca kabul edildi, OZD-FMB-001~004, yuzey temizligi OK |

**Beklenen Sonuc:** OP10 tamamlandi, parca muayene hattina hazirlandi
**Dogrulama:**
- [ ] ShopFloor'da operasyon "Tamamlandi" durumunda
- [ ] Gecen sure kaydedildi

### Adim 9: ShopFloor — Pozlama (X-Ray)
**Ekran:** ShopFloor Terminal (`/shopfloor`)
**API:** `POST /workorder/{id}/operations/{opId}/start`

| Alan | Deger |
|------|-------|
| Operasyon | OP30 — Pozlama |
| Operator | Murat Celik (NDT-004, Level II RT) |
| Parametreler | 200 kV, 5 mA, 45 saniye, FFD: 700mm |
| Not | IQI: 2-2T (ASTM E1025), Film: AGFA D7, Parca OZD-FMB-001 dikis 1 |

**Beklenen Sonuc:** 8 pozlama tamamlandi (4 parca x 2 dikis)
**Dogrulama:**
- [ ] Her pozlama icin parametreler kaydedildi
- [ ] Film/panel numaralari not alaninda

### Adim 10: Film Degerlendirme — Level III
**Ekran:** ShopFloor Terminal (`/shopfloor`)
**API:** `POST /workorder/{id}/operations/{opId}/start`

| Alan | Deger |
|------|-------|
| Operasyon | OP50 — Degerlendirme |
| Operator | Hasan Yilmaz (NDT-001, Level III) |
| Film Yogunluk | 2.0 - 3.5 (kabul araliginda) |
| IQI Duyarlilik | 2-2T gorulebilir — Level 2 duyarlilik saglanmis |

**Degerlendirme Sonuclari:**
| Parca | Dikis | Bulgu | Karar |
|-------|-------|-------|-------|
| OZD-FMB-001 | Dikis 1 | Bulgu yok | KABUL |
| OZD-FMB-001 | Dikis 2 | Bulgu yok | KABUL |
| OZD-FMB-002 | Dikis 1 | Bulgu yok | KABUL |
| OZD-FMB-002 | Dikis 2 | Gaz porositesi (0.8mm) — limit icinde | KABUL |
| OZD-FMB-003 | Dikis 1 | Yetersiz penetrasyon (2mm) — limit disi | RET |
| OZD-FMB-003 | Dikis 2 | Bulgu yok | KABUL |
| OZD-FMB-004 | Dikis 1 | Bulgu yok | KABUL |
| OZD-FMB-004 | Dikis 2 | Bulgu yok | KABUL |

**Beklenen Sonuc:** 7 dikis KABUL, 1 dikis RET (OZD-FMB-003 Dikis 1)
**Dogrulama:**
- [ ] Degerlendirme sonuclari muayene raporunda kayitli
- [ ] Ret edilen parca icin bildirim olusturuldu

### Adim 11: Ret Edilen Parca — MRB Sureci
**Ekran:** Kalite > MRB (`/quality/mrb`)
**API:** `POST /mrb`

| Alan | Deger |
|------|-------|
| Parca | OZD-FMB-003 |
| Hata | Yetersiz penetrasyon — Dikis 1, 2mm boyutunda |
| Referans | AWS D17.1 Sinif A — yetersiz penetrasyon kabul edilemez |
| Karar | TAMIR — musteri kaynakcisi tamir edecek, tekrar RT gerekli |

**Beklenen Sonuc:** MRB kaydi olusturuldu, parca musteriye iade icin isaretlendi
**Dogrulama:**
- [ ] MRB durumu ACIK
- [ ] Duzeltici faaliyet: "Parca musteriye iade — tamir sonrasi tekrar RT"

### Adim 12: NDT Rapor Hazirlama
**Ekran:** Kalite > Muayene (`/quality/inspection`)
**API:** `POST /inspection`

| Alan | Deger |
|------|-------|
| Rapor No | GNT-RT-2026-0042 |
| Standart | ASTM E1742 |
| Kabul Kriteri | AWS D17.1 Sinif A |
| Muayene Metodu | Radyografik Muayene (RT) |
| Sonuc | 7/8 dikis KABUL, 1/8 dikis RET |
| Degerlendiren | Hasan Yilmaz — Level III (NDT-001) |
| Onaylayan | Hasan Yilmaz — Level III |
| Ek Dosyalar | Film dijital kopyalari (8 adet) — dosya eki olarak yuklendi |

**Beklenen Sonuc:** Muayene raporu olusturuldu, filmler ek olarak yuklendi (K2 workaround)
**Dogrulama:**
- [ ] Rapor PDF olarak indirilebilir
- [ ] Film/dijital goruntuler eklenmis
- [ ] Level III imzasi mevcut

### Adim 13: Uygunluk Sertifikasi (CoC)
**Ekran:** Kalite > CoC (`/quality/coc`)
**API:** `POST /coc`

| Alan | Deger |
|------|-------|
| Sertifika No | GNT-COC-2026-0042 |
| Musteri | Ozdemir Kaynak Muhendislik |
| Kapsam | RT muayene — 3 parca KABUL (OZD-FMB-001, 002, 004) |
| Standart | ASTM E1742 / AWS D17.1 Sinif A |
| Personel | Level III: Hasan Yilmaz (NDT-001) |

**Beklenen Sonuc:** CoC olusturuldu, kabul edilen 3 parca icin gecerli
**Dogrulama:**
- [ ] CoC'de ret edilen parca (OZD-FMB-003) YER ALMIYOR
- [ ] Level III personel referansi mevcut

### Adim 14: Teslimat
**Ekran:** Sevkiyat (`/shipments/form`)
**API:** `POST /shipment`

| Alan | Deger |
|------|-------|
| Musteri | Ozdemir Kaynak Muhendislik |
| Parcalar | OZD-FMB-001, 002, 004 (3 adet KABUL) + OZD-FMB-003 (1 adet RET — iade) |
| Belgeler | RT Raporu + CoC + Film CD |
| Not | OZD-FMB-003 tamir icin iade, tekrar muayene gerekecek |

**Beklenen Sonuc:** 4 parca sevk edildi (3 kabul + 1 iade)
**Dogrulama:**
- [ ] Sevk irsaliyesi olusturuldu
- [ ] Kabul/ret durumu sevkiyat notunda belirtildi

### Adim 15: Fatura
**Ekran:** Finans > Faturalar (`/finance/invoices/form`)
**API:** `POST /invoice`

| Alan | Deger |
|------|-------|
| Musteri | Ozdemir Kaynak Muhendislik |
| Kalem | RT Muayene — 8 pozlama x 850 TL = 6.800 TL |
| KDV | %20 = 1.360 TL |
| Toplam | 8.160 TL |
| Not | Ret edilen parca (OZD-FMB-003) dahil — muayene hizmeti tamamlandi |

**Beklenen Sonuc:** Fatura olusturuldu, ret parcasi dahil faturalandr (muayene yapildi)
**Dogrulama:**
- [ ] Fatura toplami dogru
- [ ] Siparis-fatura eslesmesi tamam

### Adim 16: Tekrar Muayene (Tamir Sonrasi)
**Ekran:** Siparisler (`/orders/form`) + Is Emri
**API:** `POST /order` + `POST /workorder`

| Alan | Deger |
|------|-------|
| Siparis No | NDT-2026-0042-R1 (tekrar muayene) |
| Parca | OZD-FMB-003 (tamir edilmis) |
| Miktar | 1 pozlama (tamir edilen dikis) |

**Beklenen Sonuc:** Tekrar muayene siparisi olusturuldu
**Dogrulama:**
- [ ] Orijinal MRB kaydina referans verildi
- [ ] Izlenebilirlik zinciri korunuyor

### Adim 17: Tekrar RT Degerlendirme + Kabul
**Ekran:** ShopFloor + Muayene
**API:** `POST /inspection`

| Alan | Deger |
|------|-------|
| Parca | OZD-FMB-003 — Dikis 1 (tamir sonrasi) |
| Sonuc | Bulgu yok — KABUL |
| Degerlendiren | Hasan Yilmaz — Level III |
| Not | Tamir kaynak + tekrar RT — AWS D17.1 Sinif A kabul kriteri karsilandi |

**Beklenen Sonuc:** Parca kabul edildi, MRB kapatildi
**Dogrulama:**
- [ ] MRB durumu KAPATILDI
- [ ] Yeni CoC olusturuldu (GNT-COC-2026-0042-R1)
- [ ] Izlenebilirlik: orijinal ret → tamir → tekrar muayene → kabul zinciri tamam

### Adim 18: Maliyet Analizi ve Kapanls
**Ekran:** Uretim > Maliyet Analizi (`/production/part-cost`)
**API:** `GET /partcost/{productId}`

| Maliyet Kalemi | Tutar |
|----------------|-------|
| Personel (Level II + III) | 3.200 TL |
| Film/Sarf Malzeme | 1.600 TL |
| Ekipman Amortismanl | 800 TL |
| Genel Gider | 1.200 TL |
| **Toplam Maliyet** | **6.800 TL** |
| **Fatura Tutari** | **6.800 TL** |
| **Kar Marji** | **%0 (fiyat=maliyet kontrol)** |

**Beklenen Sonuc:** Maliyet analizi goruntulenebilir
**Dogrulama:**
- [ ] Is emri maliyetleri dogru hesaplandi
- [ ] Fatura tutari ile maliyet karsilastirmasi yapilabilir

### Rol Bazli Test

| Rol | Test | Beklenen |
|-----|------|----------|
| NDT Level II | Pozlama yapabilir, degerlendirme yapaMAZ | Degerlendirme butonu gorunmez |
| NDT Level III | Degerlendirme + onay yapabilir | Tam erisim |
| Uretim Planlama | Is emri olusturabilir, muayene yapaMAZ | Muayene formu readonly |
| Muhasebe | Fatura olusturabilir, muayene sonucu degistiremez | Muayene alanlari kilitli |

---
---

## Senaryo 2: Optik / Hassas Montaj Atolyesi

### Senaryo Bilgileri

| Bilgi | Deger |
|-------|-------|
| **Firma** | Vizyon Optik Savunma San. Ltd.Sti. |
| **Personel** | 20 kisi (5 optik teknisyen, 2 kalite, 1 tasarim muhendisi) |
| **Sektor** | Savunma optik bilesen montaji — termal kamera / gece gorus |
| **Standartlar** | AS9100 Rev D, MIL-PRF-13830 (optik bilesen), ISO 10110 (optik cizim) |
| **Musteri** | ASELSAN — termal kamera lens grubu montaji |
| **Urunler** | Germanium (Ge) lens, ZnSe pencere, lens barrel montaj grubu |
| **Adim Sayisi** | 17 |
| **Senaryo** | ASELSAN termal kamera lens grubu montaji — optik bilesen satin alma, giris kalite, clean room montaj, alignment, fonksiyonel test, FAI, CoC, paketleme, sevkiyat |

### Bilinen Kisitlamalar

| # | Eksik Modul/Ozellik | Workaround |
|---|---------------------|------------|
| K1 | MTF (Modulation Transfer Function) test verisi ozel alan yok | Not alanina MTF degerleri yazilir |
| K2 | Scratch-dig sinifi (60-40, 40-20 vb.) ozel alan yok | Muayene formunda not alanina yazilir |
| K3 | Clean room sinifi (Class 1000/10000) ortam takibi yok | Operasyon notlarina clean room durumu yazilir |
| K4 | Optik alignment/collimation verisi ozel alan yok | Not alanina acısal sapma degerleri yazilir |
| K5 | AR coating transmittans grafigi yukleme ozel alani yok | Dosya eki olarak yuklenir |
| K6 | Nem/sicaklik ortam logu otomatik kayit yok | ShopFloor terminalinde manuel girilir |

### On Kosullar

- Quvex sistemine optik firma olarak giris yapilmis
- Clean room ekipmanlari (partikul sayici, laminar akis) kalibrasyon modulunde tanimli
- Optik olcum cihazlari (interferometre, MTF tezgahi) tanimli
- ASELSAN musteri olarak tanimli

---

### Adim 1: Musteri ve Sozlesme
**Ekran:** Musteriler (`/customers`) + Kalite > Sozlesme (`/quality/contract-review`)
**API:** `POST /customer` + `POST /contractreview`

| Alan | Deger |
|------|-------|
| Firma | ASELSAN A.S. — Savunma Sistem Teknolojileri |
| Yetkili | Dr. Elif Sahin (Optik Sistemler Muhendisligi) |
| Email | elif.sahin@aselsan.com.tr |
| Kategori | A (Stratejik) |
| Siparis | ASELSAN-OPT-2026-077 — Termal Kamera Lens Grubu |
| Miktar | 12 set |
| Termin | 45 gun |
| Ozel Kosullar | MIL-PRF-13830 uyumlu, scratch-dig 60-40 max, AR coating >%97 transmittans (8-12 um), Class 1000 clean room montaj zorunlu, her set seri numarali |

**Beklenen Sonuc:** Musteri + sozlesme olusturuldu, tum optik gereksinimler belgelendi
**Dogrulama:**
- [ ] Contract review ONAYLANDI
- [ ] HasFirstArticle=true, Risk=YUKSEK (savunma optik)

### Adim 2: Urun ve BOM Tanimi
**Ekran:** Urunler (`/products/form`)
**API:** `POST /product`

**Ana Urun:**
```
Urun Adi: Termal Kamera Lens Grubu ASEL-TK-LG-077
Urun Kodu: VIZ-LG-2026-077
Tip: Mamul
Birim: Set
Seri Takip: Evet
```

**BOM:**
| # | Bilesen | Tip | Miktar | Birim | Tedarikci | Not |
|---|---------|-----|--------|-------|-----------|-----|
| 1 | Ge Lens O50mm f/1.0 — AR coated | Satin Alma | 1 | Adet | Umicore (Belcika) | AR coating sertifikasi zorunlu |
| 2 | Ge Lens O25mm f/2.0 — AR coated | Satin Alma | 1 | Adet | Umicore (Belcika) | AR coating sertifikasi zorunlu |
| 3 | ZnSe Pencere O60mm t=3mm — AR coated | Satin Alma | 1 | Adet | II-VI Inc. (ABD) | ITAR kontrol — ihracat lisansi |
| 4 | Lens Barrel — Al 6061-T6 CNC islenmis | Yari Mamul | 1 | Adet | Ic uretim | Anodize siyah — Ra 0.8 |
| 5 | O-Ring Viton (3 farkli cap) | Satin Alma | 3 | Adet | Parker Hannifin | MIL-R-83248 uyumlu |
| 6 | Desikant Paket (silika jel) | Sarf | 2 | Adet | — | Nem koruma, paketleme icin |

**Beklenen Sonuc:** Urun + BOM tanimlandi, ITAR notu girildi
**Dogrulama:**
- [ ] BOM'da 6 bilesen mevcut
- [ ] ITAR kontrollu malzeme (ZnSe) isaretlendi

### Adim 3: Optik Bilesen Satin Alma
**Ekran:** Satin Alma (`/purchasing/form`)
**API:** `POST /purchase`

| Tedarikci | Malzeme | Miktar | Birim Fiyat | Doviz | Termin |
|-----------|---------|--------|-------------|-------|--------|
| Umicore | Ge Lens O50mm AR coated | 14 (12+2 yedek) | 2.800 EUR | EUR | 20 gun |
| Umicore | Ge Lens O25mm AR coated | 14 | 1.400 EUR | EUR | 20 gun |
| II-VI Inc. | ZnSe Pencere O60mm AR coated | 14 | 3.200 USD | USD | 25 gun (ITAR lisans suresi dahil) |

**Beklenen Sonuc:** 3 satin alma siparisi olusturuldu
**Dogrulama:**
- [ ] Doviz cinsleri dogru (EUR + USD)
- [ ] ITAR notu satin alma notunda

### Adim 4: Giris Kalite — Optik Bilesen Kontrolu
**Ekran:** Kalite > Giris Muayene (`/quality/incoming-inspection`)
**API:** `POST /inspection`

| Bilesen | Kontrol | Kriter | Sonuc |
|---------|---------|--------|-------|
| Ge Lens O50mm | Scratch-dig | 60-40 max (MIL-PRF-13830) | 40-20 — KABUL |
| Ge Lens O50mm | AR coating transmittans | >%97 (8-12 um bant) | %98.2 — KABUL |
| Ge Lens O50mm | Yuzey duzlugu (interferometre) | < lambda/4 @ 10.6um | lambda/6 — KABUL |
| ZnSe Pencere | Scratch-dig | 60-40 max | 60-40 — KABUL (sinirda) |
| ZnSe Pencere | AR coating | >%97 | %97.5 — KABUL |

**Beklenen Sonuc:** Tum optik bilesenler giris muayenesinden gecti
**Dogrulama:**
- [ ] Scratch-dig degerleri not alaninda kayitli (K2 workaround)
- [ ] AR coating sertifikalari dosya eki olarak yuklendi (K5 workaround)
- [ ] Tedarikci sertifikalari (CoC) eslendi

### Adim 5: Malzeme Sertifika Eslestirme
**Ekran:** Kalite > Malzeme Sertifikasi
**API:** `POST /materialcertificate`

| Malzeme | Sertifika No | Tedarikci | Lot | Icerik |
|---------|-------------|-----------|-----|--------|
| Ge Lens O50mm | UMI-2026-GE50-LOT44 | Umicore | L44 | AR coating spec, transmittans raporu |
| ZnSe Pencere | IIVI-2026-ZNSE60-LOT12 | II-VI Inc. | L12 | ITAR lisans no, transmittans raporu |
| Al 6061-T6 Barrel | MTR-AL6061-2026-088 | Alcoa | H088 | Kimyasal analiz, mekanik test |

**Beklenen Sonuc:** 3 malzeme sertifikasi eslendi
**Dogrulama:**
- [ ] Her sertifika ilgili BOM kalemitine baglandr

### Adim 6: Is Emri — Clean Room Montaj
**Ekran:** Uretim > Is Emirleri (`/production/work-orders/form`)
**API:** `POST /workorder`

| Alan | Deger |
|------|-------|
| Is Emri No | WO-OPT-2026-077 |
| Urun | VIZ-LG-2026-077 (Termal Kamera Lens Grubu) |
| Miktar | 12 set |

**Operasyonlar:**
| Adim | Operasyon | Ortam | Sure/Set |
|------|-----------|-------|----------|
| OP10 | Lens barrel CNC isleme + anodize | Atoly e | 4 saat |
| OP20 | Optik bilesen temizleme (IPA + clean wipe) | Clean Room | 30 dk |
| OP30 | Lens montaj (Ge O50 + Ge O25 + ZnSe) | Clean Room Class 1000 | 2 saat |
| OP40 | Alignment + Collimation | Clean Room | 1.5 saat |
| OP50 | Fonksiyonel Test (MTF + Transmittans) | Test Lab | 1 saat |
| OP60 | Son Kontrol + FAI (ilk 3 set) | Kalite | 45 dk |

**Beklenen Sonuc:** Is emri 6 operasyonla olusturuldu
**Dogrulama:**
- [ ] Clean room operasyonlari isaretlendi
- [ ] FAI ilk 3 set icin planlandr

### Adim 7: ShopFloor — Lens Barrel CNC + Anodize
**Ekran:** ShopFloor Terminal (`/shopfloor`)
**API:** `POST /workorder/{id}/operations/{opId}/start`

| Alan | Deger |
|------|-------|
| Operasyon | OP10 — Lens Barrel CNC + Anodize |
| Operator | Ahmet Korkmaz (CNC Operatoru) |
| Olcum | Bore O50.00 +0.005/-0.000 mm, Ra 0.8 max |
| Sonuc | O50.003mm, Ra 0.6 — KABUL |
| Anodize | Siyah Tip III (MIL-A-8625), 25 mikron |

**Beklenen Sonuc:** 12 barrel islendi + anodize tamamlandi
**Dogrulama:**
- [ ] Boyutsal olcumler kaydedildi
- [ ] Anodize kalınlik raporu eklendi

### Adim 8: ShopFloor — Clean Room Montaj
**Ekran:** ShopFloor Terminal (`/shopfloor`)
**API:** `POST /workorder/{id}/operations/{opId}/start`

| Alan | Deger |
|------|-------|
| Operasyon | OP30 — Lens Montaj |
| Operator | Zeynep Arslan (Optik Teknisyen, Kidemli) |
| Ortam | Clean Room Class 1000 — partikul: 980/ft3 (limit: 1000) |
| Sicaklik | 22.0°C (±1°C) |
| Nem | %45 RH (±5%) |
| Islem | Ge O50 → barrel'a press-fit, Ge O25 → retainer ring ile, ZnSe → O-ring ile seal |

**Beklenen Sonuc:** 12 set montaj tamamlandi, ortam kosullari kaydedildi (K3/K6 workaround)
**Dogrulama:**
- [ ] Clean room parametreleri operasyon notunda
- [ ] Her set icin seri numara montaj kaydinda

### Adim 9: ShopFloor — Alignment ve Fonksiyonel Test
**Ekran:** ShopFloor Terminal (`/shopfloor`)
**API:** `POST /workorder/{id}/operations/{opId}/start`

| Alan | Deger |
|------|-------|
| Operasyon | OP40 + OP50 — Alignment + Test |
| Operator | Dr. Can Ozturk (Optik Muhendis) |
| Alignment | Optik eksen sapma: <0.5 arcmin (12 setten 11'i OK, 1 set 0.8 arcmin — TEKRAR) |
| MTF | >0.4 @ 17 lp/mm (tum setler OK) |
| Transmittans | >%92 sistem toplam (8-12 um) |

**Beklenen Sonuc:** 11 set KABUL, 1 set alignment tekrari gerekli
**Dogrulama:**
- [ ] MTF degerleri not alaninda (K1 workaround)
- [ ] Alignment ret edilen set isemri'nde isaretli

### Adim 10: Alignment Tekrari + Kabul
**Ekran:** ShopFloor Terminal (`/shopfloor`)
**API:** `POST /workorder/{id}/operations/{opId}/start`

| Alan | Deger |
|------|-------|
| Parca | Set-07 (alignment tekrari) |
| Islem | Lens sokum → temizlik → tekrar montaj → alignment |
| Sonuc | 0.3 arcmin — KABUL |

**Beklenen Sonuc:** Set-07 duzeltildi, 12/12 set KABUL
**Dogrulama:**
- [ ] Duzeltme operasyonu kaydedildi
- [ ] Toplam 12 set gecti

### Adim 11: FAI (Ilk 3 Set — AS9102)
**Ekran:** Kalite > FAI (`/quality/fai`)
**API:** `POST /fai`

| Alan | Deger |
|------|-------|
| Parcalar | Set-01, Set-02, Set-03 |
| Form 1 | Parca numarasi, revizyon, malzeme, ozel proses |
| Form 2 | Hammadde izlenebilirlik (Ge lot, ZnSe lot, Al lot) |
| Form 3 | 18 boyutsal karakteristik + 4 fonksiyonel karakteristik |
| Sonuc | Tum karakteristikler tolerans icinde — FAI ONAYLANDI |

**Beklenen Sonuc:** AS9102 FAI 3 form tamamlandi
**Dogrulama:**
- [ ] FAI raporu indirilebilir
- [ ] Musteri onay butonu aktif

### Adim 12: CoC + Data Pack
**Ekran:** Kalite > CoC (`/quality/coc`)
**API:** `POST /coc`

| Alan | Deger |
|------|-------|
| Sertifika No | VIZ-COC-2026-077 |
| Kapsam | 12 set Termal Kamera Lens Grubu |
| Icerdikleri | Ge lens CoC, ZnSe CoC, AR coating raporu, FAI, boyutsal rapor, MTF raporu |

**Beklenen Sonuc:** CoC + data pack olusturuldu
**Dogrulama:**
- [ ] 12 set icin tek CoC
- [ ] Data pack'te tum alt sertifikalar mevcut

### Adim 13: Ozel Paketleme
**Ekran:** Sevkiyat (`/shipments/form`)
**API:** `POST /shipment`

| Alan | Deger |
|------|-------|
| Paketleme | Her set bireysel anti-statik torba + desikant + shock indicator |
| Dis Ambalaj | ESD korumali koli + koypu + nem gostergesi |
| Not | MIL-STD-2073 paketleme standardi referans |

**Beklenen Sonuc:** Paketleme talimati olusturuldu, sevkiyat hazirlandi
**Dogrulama:**
- [ ] Paketleme gereksinimleri sevkiyat notunda

### Adim 14: Sevkiyat
**Ekran:** Sevkiyat (`/shipments/form`)
**API:** `POST /shipment`

| Alan | Deger |
|------|-------|
| Musteri | ASELSAN A.S. |
| Miktar | 12 set |
| Belgeler | CoC + Data Pack + Fatura + Irsaliye |
| Tasima | Ozel kurye (sicaklik kontrolllu) |

**Beklenen Sonuc:** Sevkiyat tamamlandi
**Dogrulama:**
- [ ] Irsaliye olusturuldu
- [ ] Stok dustu

### Adim 15: Fatura
**Ekran:** Finans > Faturalar (`/finance/invoices/form`)
**API:** `POST /invoice`

| Kalem | Miktar | Birim Fiyat | Tutar |
|-------|--------|-------------|-------|
| Termal Kamera Lens Grubu | 12 set | 28.500 TL | 342.000 TL |
| KDV %20 | | | 68.400 TL |
| **Toplam** | | | **410.400 TL** |

**Beklenen Sonuc:** Fatura olusturuldu
**Dogrulama:**
- [ ] Siparis-irsaliye-fatura eslesmesi tamam
- [ ] Cari hesapta alacak gorunuyor

### Adim 16: Maliyet Analizi
**Ekran:** Uretim > Maliyet Analizi (`/production/part-cost`)
**API:** `GET /partcost/{productId}`

| Kalem | Tutar/Set | Toplam (12 set) |
|-------|-----------|-----------------|
| Optik bilesenler (Ge + ZnSe) | 18.200 TL | 218.400 TL |
| Barrel CNC + Anodize | 2.400 TL | 28.800 TL |
| Clean room iscilik | 3.800 TL | 45.600 TL |
| Sarf (O-ring, desikant, ambalaj) | 350 TL | 4.200 TL |
| Genel gider (%15) | 3.712 TL | 44.550 TL |
| **Toplam Maliyet** | **28.462 TL** | **341.550 TL** |
| **Satis** | **28.500 TL** | **342.000 TL** |
| **Kar Marji** | | **%0.13** |

**Beklenen Sonuc:** Maliyet analizi goruntulenebilir
**Dogrulama:**
- [ ] Optik bilesen maliyeti toplam maliyetin >%60'i (yuksek malzeme yogun)

### Adim 17: Musteri Geri Bildirimi + Garanti Takibi
**Ekran:** Musteriler > Notlar
**API:** `PUT /customer/{id}`

| Alan | Deger |
|------|-------|
| Geri Bildirim | ASELSAN: 12 set kabul, MTF degerleri spec icinde, 2. parti siparis planlaniyor |
| Garanti | 12 ay (optik performans garantisi — normal kullanim kosullarinda) |

**Beklenen Sonuc:** Musteri memnuniyeti kaydedildi
**Dogrulama:**
- [ ] Musteri notunda geri bildirim mevcut
- [ ] Tekrar siparis potansiyeli isaretlendi

### Rol Bazli Test

| Rol | Test | Beklenen |
|-----|------|----------|
| Optik Teknisyen | Clean room montaj yapabilir, FAI onaylaYAMAZ | FAI onay butonu gorunmez |
| Kalite Muhendisi | FAI + CoC olusturabilir, fatura kesEMEZ | Fatura modulu erisim yok |
| Satin Alma | Optik bilesen siparisi verebilir, montaj yapaMAZ | ShopFloor erisim yok |
| Genel Mudur | Maliyet analizi gorebilir | Tam erisim |

---
---

## Senaryo 3: Hassas Dokum (Investment Casting)

### Senaryo Bilgileri

| Bilgi | Deger |
|-------|-------|
| **Firma** | Anatolya Dokum San. A.S. |
| **Personel** | 40 kisi (dokum, seramik, isil islem, NDT, kalite) |
| **Sektor** | Hassas dokum (investment casting / kayip mum) — havacilik turbin bilesen |
| **Standartlar** | AS9100 Rev D, AMS 5391 (Inconel 713C), ASTM A732, AMS 2175 (rontgen kabul) |
| **Musteri** | TUSAS Motor Sanayii (TEI) — turbin kanadi |
| **Urunler** | Inconel 713C turbin blade — kayip mum dokum |
| **Adim Sayisi** | 20 |
| **Senaryo** | TEI turbin kanadi uretimi — mum model, seramik kabuk, dokum, isil islem, NDT, metalurji test, FAI, sertifika, teslim |

### Bilinen Kisitlamalar

| # | Eksik Modul/Ozellik | Workaround |
|---|---------------------|------------|
| K1 | Dokum parametreleri (dokum sicakligi, vakum seviyesi, dokulme hizi) ozel alan yok | Operasyon notlarina yazilir |
| K2 | Seramik kabuk kat takibi (8 kat detayi) ozel modul yok | Is emri notlarinda kat kat kayit tutulur |
| K3 | Mum model enjeksiyon parametreleri (basinc, sicaklik) ozel alan yok | Operasyon notlarina yazilir |
| K4 | Metalurjik test sonuclari (tane boyutu, porozite %) ozel alan yok | Muayene notuna ve dosya ekine yazilir |
| K5 | Dokum defekt kategorileri (porozite, shrinkage, inclusion, misrun, cold shut) ayri alan yok | Muayene sonucunda not alanina detay yazilir |
| K6 | Vakum firin log verisi otomatik entegrasyon yok | Manuel kayit, PDF olarak yuklenir |
| K7 | Mum agac (tree) yerlesim plani modulu yok | Cizim dosya eki olarak yuklenir |

### On Kosullar

- Quvex sistemine dokum firmasi olarak giris yapilmis
- Dokum ekipmanlari (vakum firin, seramik kabuk hatti, autoclave) tanimli
- NDT ve metalurji lab ekipmanlari kalibrasyon modulunde tanimli
- TEI musteri olarak tanimli

---

### Adim 1: Musteri ve Sozlesme
**Ekran:** Musteriler (`/customers`) + Kalite > Sozlesme (`/quality/contract-review`)
**API:** `POST /customer` + `POST /contractreview`

| Alan | Deger |
|------|-------|
| Firma | TUSAS Motor Sanayii A.S. (TEI) |
| Yetkili | Mustafa Koc (Turbin Bilesen Satin Alma) |
| Email | mustafa.koc@tei.com.tr |
| Kategori | A (Stratejik) |
| Siparis | TEI-TB-2026-015 — 1. Kademe Turbin Kanadi |
| Malzeme | Inconel 713C (AMS 5391) |
| Miktar | 50 adet (+ %10 fire payi = 55 dokum) |
| Termin | 90 gun |
| Ozel Kosullar | %100 rontgen (AMS 2175), %100 FPI, metalurjik test (her lot), FAI ilk 5 parca, tam izlenebilirlik, NADCAP dokum onayi zorunlu |

**Beklenen Sonuc:** Musteri + sozlesme olusturuldu
**Dogrulama:**
- [ ] Contract review ONAYLANDI, Risk=COK YUKSEK
- [ ] HasFirstArticle=true, NADCAP gereksinimleri belgelendi

### Adim 2: Urun ve BOM
**Ekran:** Urunler (`/products/form`)
**API:** `POST /product`

**Ana Urun:**
```
Urun Adi: 1. Kademe Turbin Kanadi — Inconel 713C
Urun Kodu: TEI-TB-713C-2026-015
Tip: Mamul
Birim: Adet
Seri Takip: Evet, Lot Takip: Evet
```

**BOM:**
| # | Bilesen | Tip | Miktar/Parca | Birim | Not |
|---|---------|-----|-------------|-------|-----|
| 1 | Inconel 713C Kulce (AMS 5391) | Hammadde | 0.8 | kg | MTR + kimyasal analiz zorunlu |
| 2 | Mum (Wax) — Paramount PW-2 | Sarf | 0.3 | kg | Enjeksiyon mumu |
| 3 | Seramik Slurry — Zirkon bazli | Sarf | 1.2 | kg | 8 kat kabuk icin |
| 4 | Stucco (Alumina grit) | Sarf | 0.8 | kg | Kabuk aralari |
| 5 | Filtre (Seramik kop filtre) | Sarf | 1 | Adet | Inkluzyon onleme |

**Beklenen Sonuc:** Urun + BOM tanimlandi
**Dogrulama:**
- [ ] BOM'da 5 kalem mevcut
- [ ] Inconel 713C MTR zorunlulugu isaretlendi

### Adim 3: Hammadde Satin Alma + Giris Kalite
**Ekran:** Satin Alma (`/purchasing/form`) + Kalite > Giris Muayene
**API:** `POST /purchase` + `POST /inspection`

| Malzeme | Tedarikci | Miktar | Fiyat | Kontrol |
|---------|-----------|--------|-------|---------|
| Inconel 713C Kulce | Special Metals (ABD) | 50 kg | 85 USD/kg | Kimyasal analiz: Cr %12.5, Mo %4.2, Al %6.1 — AMS 5391 uygun |

**Beklenen Sonuc:** Hammadde kabul edildi, MTR eslendi
**Dogrulama:**
- [ ] Kimyasal analiz degerleri AMS 5391 limitlerinde
- [ ] MTR sertifikasi dosya eki olarak yuklendi
- [ ] Lot numarasi atandi: LOT-713C-2026-015

### Adim 4: Is Emri Olusturma — Dokum Sureci
**Ekran:** Uretim > Is Emirleri (`/production/work-orders/form`)
**API:** `POST /workorder`

| Alan | Deger |
|------|-------|
| Is Emri No | WO-DOK-2026-015 |
| Miktar | 55 adet (50 + %10 fire) |

**Operasyonlar:**
| Adim | Operasyon | Sure/Parca | Toplam |
|------|-----------|-----------|--------|
| OP10 | Mum Model Enjeksiyon | 5 dk | 4.5 saat |
| OP20 | Mum Agac Montaj (8 parca/agac) | 30 dk/agac | 3.5 saat |
| OP30 | Seramik Kabuk (8 kat — 3 gun kuruma) | 72 saat | 72 saat |
| OP40 | Mum Eritme (Autoclave 150°C) | 1 saat/agac | 7 saat |
| OP50 | Dokum (Vakum induksiyon 1350°C) | 45 dk/agac | 5.5 saat |
| OP60 | Kabuk Kirma + Kesme + Taslama | 20 dk/parca | 18 saat |
| OP70 | Isil Islem (Cozelti + Yaslama) | 24 saat/lot | 24 saat |
| OP80 | NDT — Rontgen + FPI | 15 dk/parca | 14 saat |
| OP90 | Boyutsal Kontrol (CMM) | 10 dk/parca | 9 saat |
| OP100 | Metalurjik Test (kesit — her lot) | 4 saat/lot | 4 saat |
| OP110 | Final Muayene + FAI + CoC | 20 dk/parca | 18 saat |

**Beklenen Sonuc:** 11 operasyonlu is emri olusturuldu
**Dogrulama:**
- [ ] Toplam sure ~180 saat (seramik kabuk kuruma dahil)
- [ ] Her operasyon sirasi dogru

### Adim 5: ShopFloor — Mum Model Enjeksiyon
**Ekran:** ShopFloor Terminal (`/shopfloor`)
**API:** `POST /workorder/{id}/operations/{opId}/start`

| Alan | Deger |
|------|-------|
| Operasyon | OP10 — Mum Model Enjeksiyon |
| Parametreler | Basinc: 35 bar, Sicaklik: 65°C, Tutma: 30 sn (K3 — nota yazildi) |
| Sonuc | 55 mum model enjekte edildi, 2 adet yuzey hatali → hurda |
| Net | 53 mum model KABUL |

**Beklenen Sonuc:** 53 mum model hazirlandi
**Dogrulama:**
- [ ] Enjeksiyon parametreleri not alaninda (K3 workaround)
- [ ] Fire/hurda kaydedildi (2 adet)

### Adim 6: Seramik Kabuk Yapimi (8 Kat)
**Ekran:** ShopFloor Terminal (`/shopfloor`)
**API:** `POST /workorder/{id}/operations/{opId}/start`

| Kat | Slurry | Stucco | Kuruma |
|-----|--------|--------|--------|
| 1 (Prime) | Zirkon — ince | Zirkon kum 120 mesh | 8 saat |
| 2-3 | Zirkon — ince | Zirkon kum 80 mesh | 8 saat/kat |
| 4-6 | Alumina — orta | Alumina grit 30 mesh | 8 saat/kat |
| 7-8 (Seal) | Alumina — kalin | — | 12 saat |

| Alan | Deger |
|------|-------|
| Operasyon | OP30 — Seramik Kabuk |
| Agac Sayisi | 7 agac (53 parca / 8 parca-agac = ~7 agac) |
| Toplam Kuruma | 72 saat (3 gun) |
| Not | Kat detaylari is emri notuna yazildi (K2 workaround) |

**Beklenen Sonuc:** 7 agac seramik kabuk tamamlandi
**Dogrulama:**
- [ ] 8 kat detayi not alaninda
- [ ] Kuruma sureleri kaydedildi

### Adim 7: Mum Eritme + Vakum Dokum
**Ekran:** ShopFloor Terminal (`/shopfloor`)
**API:** `POST /workorder/{id}/operations/{opId}/start`

| Alan | Deger |
|------|-------|
| OP40 — Mum Eritme | Autoclave: 150°C, 7 bar, 10 dk — mum tamamen eritildi |
| OP50 — Vakum Dokum | Sicaklik: 1350°C, Vakum: 10^-3 mbar, Dokulme: 8 sn (K1 — nota yazildi) |
| Sonuc | 7 agac basariyla dokuldu, 1 agac misrun (eksik dolum) — 5 parca HURDA |
| Net Parca | 48 adet (53 - 5 hurda) |

**Beklenen Sonuc:** 48 ham dokum parca elde edildi
**Dogrulama:**
- [ ] Dokum parametreleri not alaninda (K1 workaround)
- [ ] Misrun hatasi kaydi olusturuldu
- [ ] Hurda sayisi (5) kaydedildi

### Adim 8: Kabuk Kirma + Kesme + Taslama
**Ekran:** ShopFloor Terminal (`/shopfloor`)
**API:** `POST /workorder/{id}/operations/{opId}/start`

| Alan | Deger |
|------|-------|
| Operasyon | OP60 — Kabuk Kirma + Kesme + Taslama |
| Islem | Vibrasyonlu kabuk kirma → bant testere ile agactan kesme → CNC taslama |
| Sonuc | 48 parca islendi, 1 parca kesme hatasi (catlak) — HURDA |
| Net | 47 adet |

**Beklenen Sonuc:** 47 parca sonraki asamaya hazirlandi
**Dogrulama:**
- [ ] Hurda toplami: 2 (mum) + 5 (misrun) + 1 (kesme) = 8 hurda

### Adim 9: Isil Islem
**Ekran:** ShopFloor Terminal (`/shopfloor`)
**API:** `POST /workorder/{id}/operations/{opId}/start`

| Alan | Deger |
|------|-------|
| Operasyon | OP70 — Isil Islem |
| Cozelti Islemi | 1175°C / 2 saat / gaz sogutma (Argon) |
| Yaslama | 845°C / 24 saat / hava sogutma |
| Firin | Ipsen VTTC — vakumlu isil islem firini |
| Sertlik | HRC 36-40 (kriter: 35-42) — UYGUN |

**Beklenen Sonuc:** 47 parca isil islem tamamlandi
**Dogrulama:**
- [ ] Firin log'u dosya eki olarak yuklendi (K6 workaround)
- [ ] Sertlik degerleri kaydedildi

### Adim 10: NDT — Rontgen + FPI
**Ekran:** ShopFloor + Kalite > Muayene
**API:** `POST /inspection`

| Muayene | Standart | Sonuc |
|---------|----------|-------|
| Rontgen (RT) | AMS 2175 Seviye 1 | 44 KABUL, 3 RET (porozite + shrinkage) |
| FPI (Floresan Penetrant) | ASTM E1417 | 44 KABUL, 0 ek ret |

**Ret Detayi:**
| Parca | Hata | Kategori | Karar |
|-------|------|----------|-------|
| TB-017 | Mikro porozite — Level 2 (limit: Level 1) | Porozite (K5) | RET |
| TB-031 | Shrinkage cavity 1.5mm | Shrinkage (K5) | RET |
| TB-042 | Gas porosity cluster | Porozite (K5) | RET |

**Beklenen Sonuc:** 44 parca NDT gecti, 3 parca reddedildi
**Dogrulama:**
- [ ] Defekt kategorileri muayene notunda (K5 workaround)
- [ ] Ret edilen parcalar MRB'ye yonlendirildi
- [ ] Net kabul: 44 adet (50 hedef icin yeterli — 44<50 DIKKAT)

### Adim 11: MRB — Ret Edilen Parcalar
**Ekran:** Kalite > MRB (`/quality/mrb`)
**API:** `POST /mrb`

| Parca | Karar | Aciklama |
|-------|-------|----------|
| TB-017 | HURDA | Mikro porozite — tamir edilemez |
| TB-031 | HURDA | Shrinkage — yapisal butunluk risk |
| TB-042 | HURDA | Gas porosity — kabul edilemez |

**Beklenen Sonuc:** 3 parca hurda, toplam hurda: 11, net: 44 adet
**Dogrulama:**
- [ ] MRB kayitlari olusturuldu
- [ ] Hurda parcalar stoktan dustu
- [ ] 44 < 50 hedef — ek dokum karari alinmali (not)

### Adim 12: Ek Dokum Karari
**Ekran:** Uretim > Is Emirleri (`/production/work-orders/form`)
**API:** `POST /workorder`

| Alan | Deger |
|------|-------|
| Is Emri | WO-DOK-2026-015-R1 (ek dokum) |
| Miktar | 10 adet (6 eksik + fire payi) |
| Not | Orijinal is emrine bagll ek dokum |

**Beklenen Sonuc:** Ek dokum is emri olusturuldu
**Dogrulama:**
- [ ] Orijinal is emrine referans verildi
- [ ] Ayni lot hammaddeden uretim planlandr

### Adim 13: Boyutsal Kontrol (CMM)
**Ekran:** ShopFloor Terminal + Muayene
**API:** `POST /inspection`

| Alan | Deger |
|------|-------|
| Operasyon | OP90 — Boyutsal Kontrol |
| Cihaz | Zeiss Contura CMM |
| Kontrol Edilen | 44 parca — profil toleransi, duvar kalinligi, agirlik |
| Sonuc | 44/44 tolerans icinde — KABUL |
| Kritik Olcum | Duvar kalinligi: 1.20mm ±0.10mm — tumu 1.15-1.28mm arasinda |

**Beklenen Sonuc:** 44 parca boyutsal kontrol gecti
**Dogrulama:**
- [ ] CMM raporu eklendi
- [ ] Kritik olcumler kaydedildi

### Adim 14: Metalurjik Test
**Ekran:** Kalite > Muayene (`/quality/inspection`)
**API:** `POST /inspection`

| Test | Standart | Sonuc |
|------|----------|-------|
| Tane Boyutu | ASTM E112 | ASTM 3 (kriter: 1-5) — UYGUN |
| Mikro Porozite | AMS 5391 | <%0.5 — UYGUN |
| Karbur Dagrlimi | Spesifikasyon | Homojen — UYGUN |
| Cekme Mukavemeti | AMS 5391 | 758 MPa (min: 740 MPa) — UYGUN |
| Akma Mukavemeti | AMS 5391 | 655 MPa (min: 620 MPa) — UYGUN |
| Uzama | AMS 5391 | %5.2 (min: %3) — UYGUN |
| Creep Testi | TEI Spec | 30 saat @ 980°C/150MPa — UYGUN |

**Beklenen Sonuc:** Metalurjik testler tamami UYGUN
**Dogrulama:**
- [ ] Test degerleri muayene notunda (K4 workaround)
- [ ] Metalurji raporu dosya eki olarak yuklendi
- [ ] Lot bazinda test (temsili numune)

### Adim 15: FAI (Ilk 5 Parca — AS9102)
**Ekran:** Kalite > FAI (`/quality/fai`)
**API:** `POST /fai`

| Alan | Deger |
|------|-------|
| Parcalar | TB-001 ~ TB-005 |
| Form 1 | Parca no, revizyon, ozel proses (dokum, isil islem) |
| Form 2 | Inconel 713C LOT-713C-2026-015 izlenebilirlik |
| Form 3 | 24 boyutsal + 8 metalurjik + 2 NDT karakteristik = 34 toplam |
| Sonuc | FAI ONAYLANDI |

**Beklenen Sonuc:** AS9102 FAI tamamlandi
**Dogrulama:**
- [ ] 34 karakteristik tamami tolerans icinde
- [ ] TEI onay bekleniyor

### Adim 16: CoC + Data Pack
**Ekran:** Kalite > CoC (`/quality/coc`)
**API:** `POST /coc`

| Alan | Deger |
|------|-------|
| Sertifika No | ANT-COC-2026-015 |
| Kapsam | 44 adet turbin kanadi (ilk parti) |
| Data Pack | MTR + kimyasal analiz + isil islem raporu + NDT (RT+FPI) + CMM + metalurji + FAI |

**Beklenen Sonuc:** CoC + data pack olusturuldu
**Dogrulama:**
- [ ] Tum alt sertifikalar data pack'te mevcut
- [ ] Izlenebilirlik zinciri: kulce lot → dokum lot → parca seri no

### Adim 17: Sevkiyat (Kismi — 44/50)
**Ekran:** Sevkiyat (`/shipments/form`)
**API:** `POST /shipment`

| Alan | Deger |
|------|-------|
| Musteri | TEI |
| Miktar | 44 adet (50 hedefin kismi teslimat) |
| Paketleme | Bireysel VCI torba + korucu koypu + ahsap sandik |
| Belgeler | CoC + Data Pack + Irsaliye |

**Beklenen Sonuc:** Kismi sevkiyat tamamlandr (44/50)
**Dogrulama:**
- [ ] Siparis durumu "KISMI TESLIM"
- [ ] Kalan 6 adet ek dokumdan gelecek

### Adim 18: Fatura (Kismi)
**Ekran:** Finans > Faturalar (`/finance/invoices/form`)
**API:** `POST /invoice`

| Kalem | Miktar | Birim Fiyat | Tutar |
|-------|--------|-------------|-------|
| Turbin Kanadi Inconel 713C | 44 adet | 12.500 TL | 550.000 TL |
| KDV %20 | | | 110.000 TL |
| **Toplam** | | | **660.000 TL** |

**Beklenen Sonuc:** Kismi fatura olusturuldu
**Dogrulama:**
- [ ] 44/50 icin kismi fatura
- [ ] Kalan 6 adet icin 2. fatura planlandr

### Adim 19: Fire/Verim Analizi
**Ekran:** Uretim > Raporlar
**API:** `GET /reports/production`

| Metrik | Deger |
|--------|-------|
| Baslangic (mum) | 55 |
| Mum hurda | 2 |
| Misrun hurda | 5 |
| Kesme hurda | 1 |
| NDT ret (hurda) | 3 |
| **Toplam Hurda** | **11** |
| **Net Kabul** | **44** |
| **Verim** | **%80** (44/55) |
| **Hedef Verim** | **%85** |

**Beklenen Sonuc:** Verim analizi goruntulenebilir
**Dogrulama:**
- [ ] Verim %80 — hedefin altinda, duzeltici aksiyon gerekli
- [ ] Hurda dagilimi: misrun %45, NDT ret %27, mum %18, kesme %9

### Adim 20: Duzeltici Faaliyet
**Ekran:** Kalite > MRB veya notlar
**API:** `PUT /mrb/{id}`

| Alan | Deger |
|------|-------|
| Sorun | Misrun orani yuksek (5/55 = %9) |
| Kok Neden | Dokum sicakligi kontrolu — 1350°C hedef, olcumde 1320-1360°C dalgalanma |
| Duzeltici Aksiyon | Termokupl kalibrasyon + dokum hizi standardizasyonu |
| Hedef | Bir sonraki partide misrun <%2 |

**Beklenen Sonuc:** Duzeltici faaliyet kaydedildi
**Dogrulama:**
- [ ] MRB duzeltici aksiyon alani dolu
- [ ] Sonraki parti icin izleme planlandi

### Rol Bazli Test

| Rol | Test | Beklenen |
|-----|------|----------|
| Dokum Operatoru | ShopFloor'da dokum parametrelerini girebilir, MRB kararı verEMEZ | MRB onay butonu yok |
| NDT Inspektur | Rontgen/FPI degerlendirme yapabilir, dokum is emri olusturAMAZ | Is emri form erisim yok |
| Metalurji Muhendisi | Metalurjik test sonuclarini girebilir, fatura kesEMEZ | Finans modulu erisim yok |
| Kalite Muduru | MRB karari + FAI + CoC olusturabilir | Tam kalite erisimi |

---
---

## Senaryo 4: Kalip ve Takim Imalati

### Senaryo Bilgileri

| Bilgi | Deger |
|-------|-------|
| **Firma** | Celik Kalip Muhendislik Ltd.Sti. |
| **Personel** | 15 kisi (CNC, tel erozyon, dalma erozyon, montaj, kalite) |
| **Sektor** | Savunma sanayi kalip/takim imalati — muhimmat, havacilik sac kalip |
| **Standartlar** | AS9100 Rev D, DIN 16750 (kalip standartlari), ISO 2768-mK (genel tolerans) |
| **Musteri** | Muhimmat fabrikasi — 7.62mm fisek kovani progresif sac kalip |
| **Urunler** | Progresif sac kalip (SKD11 takim celigi), CNC elektrod, ozel takimlar |
| **Adim Sayisi** | 18 |
| **Senaryo** | Fisek kovani kalip uretimi — tasarim referans, CNC kaba isleme, isil islem, hassas isleme, tel erozyon, dalma erozyon, polisaj, montaj, deneme basimi (tryout), musteri onay, teslim |

### Bilinen Kisitlamalar

| # | Eksik Modul/Ozellik | Workaround |
|---|---------------------|------------|
| K1 | Kalip tasarim revizyon takibi ayri modul yok | Urun revizyonu + not alani kullanilir |
| K2 | Tryout (deneme basimi) dongusu sayisi ayri alan yok | Is emri notuna tryout sayisi ve sonuclari yazilir |
| K3 | Erozyon elektrod takibi (adet, asrnma, yenileme) ayri alan yok | Sarf malzeme olarak BOM'a eklenir |
| K4 | Kalip omru (shot count) takip modulu yok | Not alanina tahmini omur yazilir |
| K5 | Musteri numune parsa (tryout ciktisi) olcum formu ozel modulu yok | Muayene formuna tryout sonuclari yazilir |
| K6 | Tel erozyon (WEDM) parametreleri (tel cap, hiz, basinc) ozel alan yok | Operasyon notuna yazilir |

### On Kosullar

- Quvex sistemine kalip firması olarak giris yapilmis
- CNC, tel erozyon (WEDM), dalma erozyon (EDM sinker) makineleri tanimli
- Isil islem fason tedarikci tanimli
- Muhimmat fabrikasi musteri olarak tanimli

---

### Adim 1: Musteri ve Sozlesme
**Ekran:** Musteriler (`/customers`) + Kalite > Sozlesme (`/quality/contract-review`)
**API:** `POST /customer` + `POST /contractreview`

| Alan | Deger |
|------|-------|
| Firma | MKE Silah Fabrikasi |
| Yetkili | Yarbay Ozgur Sahin (Uretim Planlama) |
| Email | ozgur.sahin@mke.gov.tr |
| Kategori | A (Stratejik — Kamu/Savunma) |
| Siparis | MKE-KLP-2026-008 — 7.62mm Fisek Kovani Progresif Kalip |
| Ozellikler | 12 istasyonlu progresif kalip, SKD11, HRC 60-62, 5 milyon shot omur |
| Termin | 75 gun |
| Ozel Kosullar | Tryout: 1000 adet deneme basimi, musteri yerinde kabul, 6 ay garanti |

**Beklenen Sonuc:** Musteri + sozlesme olusturuldu
**Dogrulama:**
- [ ] Contract review ONAYLANDI
- [ ] Tryout gereksinimleri belgelendi
- [ ] Kalip omru spesifikasyonu kayitli (K4 — nota yazildr)

### Adim 2: Urun ve BOM
**Ekran:** Urunler (`/products/form`)
**API:** `POST /product`

**Ana Urun:**
```
Urun Adi: 7.62mm Fisek Kovani Progresif Sac Kalip — 12 Istasyon
Urun Kodu: MKE-PK-762-2026-008
Tip: Mamul
Birim: Takim (Set)
Seri Takip: Evet
Tahmini Omur: 5.000.000 shot (K4 — nota yazildr)
```

**BOM:**
| # | Bilesen | Malzeme | Miktar | Birim | Not |
|---|---------|---------|--------|-------|-----|
| 1 | Ust Kalip Plakasi 400x300x80mm | SKD11 | 1 | Adet | HRC 60-62 gerekli |
| 2 | Alt Kalip Plakasi 400x300x60mm | SKD11 | 1 | Adet | HRC 60-62 gerekli |
| 3 | Zımba Seti (12 istasyon) | SKD11 / ASP23 (HSS) | 12 | Adet | Kritik parcalar — hassas tolerans |
| 4 | Matris Seti (12 istasyon) | SKD11 | 12 | Adet | Tel erozyon ile kesilecek |
| 5 | Kilavuz Kolonu + Burc | SUJ2 (rulman celigi) | 4+4 | Adet | HRC 62, Ra 0.2 polisaj |
| 6 | Yay Seti (soyma/baski) | SWP-B | 24 | Adet | Standart kalip yayi |
| 7 | Bakir Elektrod (dalma erozyon) | Elektrolitik Cu | 8 | Adet | CNC ile islenir (K3) |
| 8 | Kalip Alti Plaka + Baglama | S55C | 1 | Set | Normalize edilmis |

**Beklenen Sonuc:** Urun + 8 BOM kalemi tanimlandi
**Dogrulama:**
- [ ] SKD11 parcalar isil islem gereksinimi isaretli
- [ ] Elektrod malzemesi BOM'da sarf olarak mevcut (K3 workaround)

### Adim 3: Hammadde Satin Alma
**Ekran:** Satin Alma (`/purchasing/form`)
**API:** `POST /purchase`

| Malzeme | Tedarikci | Miktar | Fiyat | Not |
|---------|-----------|--------|-------|-----|
| SKD11 Blok 400x300x80mm | Bohler Turkiye | 2 adet | 18.500 TL/adet | Sertifika zorunlu |
| SKD11 Cubuk O40x200mm | Bohler Turkiye | 24 adet | 950 TL/adet | Zimba + matris hammaddesi |
| ASP23 (HSS) Cubuk O25x150mm | Bohler Turkiye | 4 adet | 2.200 TL/adet | Yuksek asinma dayanimi |
| Cu Elektrod Blok 100x80x60mm | Eti Bakir | 8 adet | 650 TL/adet | Elektrolitik bakir |

**Beklenen Sonuc:** 4 satin alma siparisi olusturuldu
**Dogrulama:**
- [ ] SKD11 malzeme sertifikasi (MTR) zorunlulugu isaretli
- [ ] Toplam hammadde: ~66.000 TL

### Adim 4: Is Emri Olusturma
**Ekran:** Uretim > Is Emirleri (`/production/work-orders/form`)
**API:** `POST /workorder`

| Alan | Deger |
|------|-------|
| Is Emri No | WO-KLP-2026-008 |
| Miktar | 1 takim (set) |

**Operasyonlar:**
| Adim | Operasyon | Makine | Sure |
|------|-----------|--------|------|
| OP10 | Kaba CNC Freze (ust+alt plaka) | CNC-01 (3 eksen) | 24 saat |
| OP20 | CNC Elektrod Isleme (8 adet Cu) | CNC-02 (5 eksen) | 16 saat |
| OP30 | Zimba/Matris Kaba Torna + Freze | CNC-01 | 32 saat |
| OP40 | Isil Islem — Sertlestirme HRC 60-62 (Fason) | — (Fason) | 48 saat |
| OP50 | CNC Hassas Freze (isil islem sonrasi) | CNC-03 (HSC) | 40 saat |
| OP60 | Tel Erozyon — WEDM (matris profilleri) | WEDM-01 | 36 saat |
| OP70 | Dalma Erozyon — EDM (ozel formlar) | EDM-01 | 24 saat |
| OP80 | Taslama (yuzey + silindirik) | TAS-01 | 16 saat |
| OP90 | Polisaj (zimba/matris Ra 0.2) | Manuel | 20 saat |
| OP100 | Montaj + Uyum Kontrolu | Montaj Tezgahi | 16 saat |
| OP110 | Deneme Basimi — Tryout (1000 adet) | Musteri Presi | 8 saat |
| OP120 | Duzeltme (tryout sonrasi) | CNC/WEDM/EDM | 16 saat (tahmini) |
| OP130 | Final Kontrol + Olcu Raporu | CMM | 8 saat |

**Beklenen Sonuc:** 13 operasyonlu is emri olusturuldu
**Dogrulama:**
- [ ] Fason isil islem (OP40) isaretlendi
- [ ] Tryout (OP110) musteri yerinde planlandi
- [ ] Toplam sure: ~304 saat (38 is gunu — 75 gun icinde uygun)

### Adim 5: ShopFloor — Kaba CNC Isleme
**Ekran:** ShopFloor Terminal (`/shopfloor`)
**API:** `POST /workorder/{id}/operations/{opId}/start`

| Alan | Deger |
|------|-------|
| Operasyon | OP10 — Kaba CNC Freze |
| Operator | Volkan Arslan (CNC Operatoru, Kidemli) |
| Makine | CNC-01 — Mazak VTC-300C |
| Islem | Ust plaka: cep acma, kilavuz delikleri / Alt plaka: matris yuvalari kaba |
| Not | Her yuzde 0.3mm hassas isleme payi birakildi |

**Beklenen Sonuc:** Kaba isleme tamamlandi
**Dogrulama:**
- [ ] Islem sureleri kaydedildi
- [ ] Hassas isleme payı birakildi

### Adim 6: CNC Elektrod Isleme
**Ekran:** ShopFloor Terminal (`/shopfloor`)
**API:** `POST /workorder/{id}/operations/{opId}/start`

| Alan | Deger |
|------|-------|
| Operasyon | OP20 — CNC Elektrod |
| Makine | CNC-02 — Makino D500 (5 eksen) |
| Cikti | 8 adet Cu elektrod — dalma erozyon icin |
| Tolerans | ±0.01mm (elektrod asinma payi dahil: 0.05mm/yuzde overcut) |

**Beklenen Sonuc:** 8 elektrod CNC ile islendi
**Dogrulama:**
- [ ] Elektrod olculeri kontrol edildi
- [ ] Overcut payi hesaplandi

### Adim 7: Isil Islem (Fason)
**Ekran:** Fason Is Emirleri + ShopFloor
**API:** `POST /subcontractorder`

| Alan | Deger |
|------|-------|
| Tedarikci | Anadolu Isil Islem A.S. (NADCAP onayli) |
| Parcalar | Ust plaka, alt plaka, 12 zimba, 12 matris = 26 parca |
| Islem | Vakum sertlestirme: 1030°C / yag sogutma + 3x temperlem 200°C |
| Hedef Sertlik | HRC 60-62 |
| Sonuc | 26/26 parca HRC 60.5-61.8 — UYGUN |

**Beklenen Sonuc:** Fason isil islem tamamlandr, sertlik raporlari alindi
**Dogrulama:**
- [ ] Fason siparis olusturuldu ve kapatildi
- [ ] Sertlik raporu dosya eki olarak yuklendi
- [ ] Tum parcalar hedef HRC araliginda

### Adim 8: Hassas CNC Isleme (Isil Islem Sonrasi)
**Ekran:** ShopFloor Terminal (`/shopfloor`)
**API:** `POST /workorder/{id}/operations/{opId}/start`

| Alan | Deger |
|------|-------|
| Operasyon | OP50 — CNC Hassas Freze |
| Makine | CNC-03 — Roeders RXP500 (HSC — High Speed Cutting) |
| Islem | Sertlesmis SKD11 (HRC 60) uzerinde hassas freze — matris yuvalari, kilavuz delikleri |
| Tolerans | ±0.005mm |
| Not | CBN kaplama takim kullanildi, 15.000 RPM |

**Beklenen Sonuc:** Hassas isleme tamamlandi
**Dogrulama:**
- [ ] Kritik olcumler kaydedildi
- [ ] Toleranslar ±0.005mm icinde

### Adim 9: Tel Erozyon (WEDM)
**Ekran:** ShopFloor Terminal (`/shopfloor`)
**API:** `POST /workorder/{id}/operations/{opId}/start`

| Alan | Deger |
|------|-------|
| Operasyon | OP60 — Tel Erozyon |
| Makine | WEDM-01 — Sodick ALC400G |
| Islem | 12 matris profili kesimi — 7.62mm kovan formu |
| Parametreler | Tel: O0.25mm pirinc, 4 kesim (kaba + 3 hassas), yuzey Ra 0.4 (K6 — nota yazildi) |
| Tolerans | ±0.003mm (profil) |

**Beklenen Sonuc:** 12 matris profili kesildi
**Dogrulama:**
- [ ] WEDM parametreleri not alaninda (K6 workaround)
- [ ] Profil olculeri kontrol edildi

### Adim 10: Dalma Erozyon (EDM Sinker)
**Ekran:** ShopFloor Terminal (`/shopfloor`)
**API:** `POST /workorder/{id}/operations/{opId}/start`

| Alan | Deger |
|------|-------|
| Operasyon | OP70 — Dalma Erozyon |
| Makine | EDM-01 — Sodick AG40L |
| Islem | 4 ozel form kavitesi — Cu elektrod ile |
| Elektrod | 8 adet kullanildi (4 kaba + 4 hassas), 2 adet asinmis → yenilendi (K3) |
| Yuzey | Ra 0.8 (erozyon sonrasi) → polisaj ile Ra 0.2'ye indirilecek |

**Beklenen Sonuc:** Dalma erozyon tamamlandi
**Dogrulama:**
- [ ] Elektrod kullanim sayisi notda (K3 workaround)
- [ ] Erozyon yuzey kalitesi kaydedildi

### Adim 11: Taslama + Polisaj
**Ekran:** ShopFloor Terminal (`/shopfloor`)
**API:** `POST /workorder/{id}/operations/{opId}/start`

| Alan | Deger |
|------|-------|
| OP80 — Taslama | Duz yuzeyler: Ra 0.4, paralellik ±0.005mm, kilavuz delikleri H6 |
| OP90 — Polisaj | Zimba/matris calisma yuzey leri: Ra 0.2 (ayna polisaj) |
| Not | 12 zimba + 12 matris + 4 kilavuz kolonu polisaj tamamlandi |

**Beklenen Sonuc:** Yuzey islemleri tamamlandi
**Dogrulama:**
- [ ] Ra deger leri kaydedildi
- [ ] Paralellik toleransi icinde

### Adim 12: Montaj + Uyum Kontrolu
**Ekran:** ShopFloor Terminal (`/shopfloor`)
**API:** `POST /workorder/{id}/operations/{opId}/start`

| Alan | Deger |
|------|-------|
| Operasyon | OP100 — Montaj |
| Operator | Usta Erhan Koc (Kalip Montajcisi, 20 yil deneyim) |
| Islem | 12 istasyon zimba-matris montaji, yay yerlesimi, kilavuz uyumu, stroke ayari |
| Kontrol | Her istasyonda ust-alt uyum kontrolu (mavi boya testi) |
| Sonuc | 11 istasyon OK, Istasyon 7 — matris 0.02mm kaydirmis → duzeltme gerekli |

**Beklenen Sonuc:** Montaj %92 tamamlandi, 1 istasyon duzeltme gerekli
**Dogrulama:**
- [ ] Mavi boya testi sonuclari notda
- [ ] Istasyon 7 duzeltme is emri olusturuldu

### Adim 13: Istasyon 7 Duzeltme
**Ekran:** ShopFloor Terminal (`/shopfloor`)
**API:** `POST /workorder/{id}/operations/{opId}/start`

| Alan | Deger |
|------|-------|
| Islem | Matris yuvasi WEDM ile 0.02mm duzeltme → tekrar montaj |
| Sonuc | Istasyon 7 uyum kontrolu OK |

**Beklenen Sonuc:** Duzeltme tamamlandi, montaj %100
**Dogrulama:**
- [ ] Duzeltme operasyonu kaydedildi
- [ ] 12/12 istasyon uyumlu

### Adim 14: Deneme Basimi — Tryout (Musteri Yerinde)
**Ekran:** ShopFloor + Muayene
**API:** `POST /workorder/{id}/operations/{opId}/start` + `POST /inspection`

| Alan | Deger |
|------|-------|
| Operasyon | OP110 — Tryout |
| Yer | MKE Silah Fabrikasi — uretim hatti |
| Pres | 200 ton eksantrik pres |
| Malzeme | Pirinc CuZn30 sac 0.8mm (fisek kovani malzemesi) |
| Basim | 1000 adet deneme |

**Tryout Sonuclari:**
| Istasyon | Islem | Sonuc | Not |
|----------|-------|-------|-----|
| 1-3 | Kesme + delme | OK | Capak <0.05mm |
| 4-6 | Cekme (1. kademe) | OK | Duvar kalinligi uniform |
| 7-8 | Cekme (2. kademe) | Ist.8: hafif cizik | Matris polisaj gerekli |
| 9-10 | Boyun daralma + agiz | OK | — |
| 11 | Taban kesme | OK | — |
| 12 | Olcum + ayirma | OK | — |

**Beklenen Sonuc:** 1000 adet basıldi, 1 istasyonda minor sorun
**Dogrulama:**
- [ ] Tryout sonuclari muayene formunda (K5 workaround)
- [ ] Tryout dongu sayisi: 1 (K2 — nota yazildi)
- [ ] Istasyon 8 polisaj duzeltme gerekli

### Adim 15: Tryout Duzeltme + 2. Deneme
**Ekran:** ShopFloor Terminal
**API:** `POST /workorder/{id}/operations/{opId}/start`

| Alan | Deger |
|------|-------|
| Duzeltme | Istasyon 8 matris — ek polisaj Ra 0.15 |
| 2. Tryout | 500 adet basım — 12/12 istasyon OK, cizik sorunu giderildi |
| Tryout Dongusu | 2 (K2 — nota yazildi) |
| Musteri Kabul | MKE kalite kontrol — numune olcum 50 adet: tumu tolerans icinde |

**Beklenen Sonuc:** Kalip musteri tarafindan kabul edildi
**Dogrulama:**
- [ ] 2. tryout BASARILI
- [ ] Musteri onay notu girildi
- [ ] Numune olcumleri kaydedildi

### Adim 16: Final Kontrol + Olcu Raporu
**Ekran:** Kalite > Muayene (`/quality/inspection`)
**API:** `POST /inspection`

| Kontrol | Kriter | Sonuc |
|---------|--------|-------|
| Kalip dis olculeri | Cizim referans ±0.01mm | UYGUN |
| Zimba-matris boslugu | 0.04mm (%5 sac kalinligi) | UYGUN |
| Kilavuz kolonu uyumu | <0.005mm oynama | UYGUN |
| Sertlik | HRC 60-62 | HRC 60.5-61.8 UYGUN |
| Yuzey kalitesi | Ra 0.2 (calisma yuzeyleri) | Ra 0.15-0.20 UYGUN |
| Tryout cikti kalitesi | MKE tolerans tablosu | 50/50 numune UYGUN |

**Beklenen Sonuc:** Final kontrol GECTI
**Dogrulama:**
- [ ] Olcu raporu olusturuldu
- [ ] Sertlik ve yuzey deger leri kaydedildi
- [ ] Tryout numune sonuclari eklendi

### Adim 17: Sevkiyat + Fatura
**Ekran:** Sevkiyat + Finans
**API:** `POST /shipment` + `POST /invoice`

| Alan | Deger |
|------|-------|
| Teslimat | Kalip seti + yedek zimba seti (12 adet) + bakim kilavuzu |
| Paketleme | Ahsap sandik, pas onleyici yag, silika jel |
| Garanti | 6 ay veya 500.000 shot (hangisi once dolarsa) |

| Fatura Kalemi | Tutar |
|---------------|-------|
| 7.62mm Progresif Kalip — 12 Istasyon | 485.000 TL |
| Yedek Zimba Seti (12 adet) | 36.000 TL |
| Ara Toplam | 521.000 TL |
| KDV %20 | 104.200 TL |
| **Toplam** | **625.200 TL** |

**Beklenen Sonuc:** Sevkiyat + fatura tamamlandi
**Dogrulama:**
- [ ] Irsaliye olusturuldu
- [ ] Yedek parcalar ayri kalem olarak faturalandr
- [ ] Garanti kosullari sevkiyat notunda

### Adim 18: Maliyet Analizi + Kapanls
**Ekran:** Uretim > Maliyet Analizi (`/production/part-cost`)
**API:** `GET /partcost/{productId}`

| Kalem | Tutar |
|-------|-------|
| Hammadde (SKD11 + ASP23 + Cu) | 66.000 TL |
| CNC Isleme (kaba + hassas) | 96.000 TL |
| Tel Erozyon (WEDM) | 54.000 TL |
| Dalma Erozyon (EDM) | 36.000 TL |
| Isil Islem (fason) | 18.000 TL |
| Taslama + Polisaj | 28.000 TL |
| Montaj | 24.000 TL |
| Tryout (yol masrafi + iscilik) | 12.000 TL |
| Genel Gider (%15) | 50.100 TL |
| **Toplam Maliyet** | **384.100 TL** |
| **Satis (kalip + yedek)** | **521.000 TL** |
| **Kar** | **136.900 TL** |
| **Kar Marji** | **%26.3** |

**Beklenen Sonuc:** Maliyet analizi dogru, kar marji hesaplandi
**Dogrulama:**
- [ ] En buyuk maliyet kalemi: CNC isleme (%25)
- [ ] Fason isil islem ayri gorunuyor
- [ ] Tryout maliyeti dahil edilmis
- [ ] Kar marji %26 — hedef %20-30 arasinda, UYGUN

### Rol Bazli Test

| Rol | Test | Beklenen |
|-----|------|----------|
| CNC Operatoru | ShopFloor'da isleme yapabilir, tryout yapaMAZ | Tryout operasyonu atanmamis |
| Kalip Montajcisi | Montaj + tryout yapabilir, fatura kesEMEZ | Finans erisim yok |
| Kalite Kontrol | Olcu raporu + final onay yapabilir | Kalite tam erisim |
| Satin Alma | Hammadde + fason siparis verebilir, uretim yapaMAZ | ShopFloor erisim yok |

---

## OZET: 4 Senaryo Toplam Istatistik

| Senaryo | Firma | Adim | Kritik Kisitlama | Toplam Fatura |
|---------|-------|------|-------------------|---------------|
| 1 — NDT | Guventest NDT | 18 | NDT rapor sablonu yok, personel sertifika seviyesi ayri alan yok | 8.160 TL |
| 2 — Optik Montaj | Vizyon Optik | 17 | MTF/scratch-dig ozel alan yok, clean room takibi yok | 410.400 TL |
| 3 — Hassas Dokum | Anatolya Dokum | 20 | Dokum parametreleri, seramik kat, defekt kategorisi ayri alan yok | 660.000 TL |
| 4 — Kalip Imalati | Celik Kalip | 18 | Tryout dongusu, elektrod takibi, kalip omru ayri alan yok | 625.200 TL |
| **TOPLAM** | | **73** | **24 kisitlama (workaround ile cozulur)** | **1.703.760 TL** |

---

> **Not:** Bu senaryolar Quvex ERP'nin mevcut modulleri ile calistirilacaktir.
> Bilinen kisitlamalar "not alani" ve "dosya eki" workaround'lari ile yonetilir.
> Her senaryo bagimsiz olarak test edilebilir veya sirali olarak calistirilabilir.
> Tryout dongusu (Senaryo 4), tekrar muayene (Senaryo 1), ve ek dokum (Senaryo 3) iteratif surecleri icerir.
