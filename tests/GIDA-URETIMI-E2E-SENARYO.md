# Gida Uretimi — Uctan Uca Test Senaryosu
# Taze Gida San. A.S. — Sut Urunleri & Unlu Mamuller

**Firma:** Taze Gida Sanayi ve Ticaret A.S.
**Sektor:** Sut urunleri (yogurt, ayran) / Unlu mamuller (biskuvi, kraker)
**Standart:** ISO 22000:2018 Gida Guvenligi Yonetim Sistemi, HACCP
**Test suresi:** ~45 dakika
**Adim sayisi:** 38
**Tarih:** 2026-04-10
**Hazirlayan:** QA Ekibi

---

## SUREC HARITASI (Process Map)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                   TAZE GIDA SAN. — ERP SUREC HARITASI                       │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  TANIMLAR & TEDARIK                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐                    │
│  │Tedarikci │→│ Hammadde  │→│  Recete   │→│  HACCP   │                    │
│  │  Kaydi   │  │  Tanimi   │  │  (BOM)   │  │ CCP Plan │                    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘                    │
│       ↓                                                                      │
│  SATIN ALMA                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                                  │
│  │  Talep   │→│ Siparis   │→│ Mal Kabul │                                  │
│  │  Olustur │  │  Onayla   │  │(Sicaklik)│                                  │
│  └──────────┘  └──────────┘  └──────────┘                                  │
│       ↓                                                                      │
│  GIRIS KALITE                                                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                                  │
│  │Mikrobiyoloji│→│ Allerjen │→│ Onay/Red │                                  │
│  │  Testi   │  │  Testi   │  │          │                                  │
│  └──────────┘  └──────────┘  └──────────┘                                  │
│       ↓                                                                      │
│  URETIM (Yogurt Hatti)                                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐                    │
│  │Pastoriz. │→│Kulturleme │→│ Sogutma  │→│Ambalajlama│                    │
│  │72°C/15sn │  │43°C/6saat│  │ 4°C     │  │Etiketleme│                    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘                    │
│       ↓              ↓              ↓              ↓                         │
│  KALITE KONTROL                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                                  │
│  │ pH/Kivam │→│Son Muayene│→│ Sertifika│                                  │
│  │ Olcumu   │  │(Fiz+Kim) │  │ (CoC)   │                                  │
│  └──────────┘  └──────────┘  └──────────┘                                  │
│       ↓                                                                      │
│  DEPO & SEVKIYAT                                                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐                    │
│  │Soguk Depo│→│   FIFO   │→│ Sevkiyat │→│  Fatura  │                    │
│  │  Giris   │  │ Yonetimi │  │(Sog.Znc.)│  │          │                    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘                    │
│       ↓                                                                      │
│  IZLENEBILIRLIK & GERI CAGIRMA                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐                    │
│  │Lot Bazli │→│Ileri/Geri│→│  Recall  │→│Tedarikci│                    │
│  │ Izleme   │  │ Izleme   │  │ Senaryosu│  │Degerlend.│                    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘                    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## ZAMAN CIZELGESI

```
Nisan 2026
  07.04  Tedarikci kayitlari, hammadde tanimlari, recete/BOM olusturma
  07.04  HACCP Kontrol Plani olusturma (CCP1: Pastorizasyon, CCP2: Sogutma)
  08.04  Satin alma siparisleri (sut, un, seker, kultur, ambalaj)
  08.04  Mal kabul — sicaklik kontrolu, mikrobiyoloji numune alma
  09.04  Giris kalite testleri (mikrobiyoloji, allerjen)
  09.04  Yogurt uretim emri acma, parti/lot atama
  09.04  Uretim: Pastorizasyon → Kulturleme baslangici
  10.04  Uretim: Kulturleme tamamlama → Sogutma → Ambalajlama
  10.04  Ara kalite kontrol (pH, kivam), son muayene
  10.04  Etiketleme, soguk depo girisi (FIFO)
  10.04  Raf omru sorgulama, sevkiyat hazirlama
  11.04  Irsaliye + Fatura, izlenebilirlik raporu
  11.04  GERI CAGIRMA (Recall) senaryosu
  11.04  Maliyet analizi, tedarikci degerlendirme
```

---

## ON KOSULLAR

| # | Kosul | Aciklama |
|---|-------|----------|
| 1 | Quvex ERP aktif | http://localhost:3000 erisim acik |
| 2 | API aktif | http://localhost:5052 erisim acik |
| 3 | Tenant olusturulmus | `taze_gida` tenant schema'si hazir |
| 4 | Admin kullanici | admin@tazegida.com.tr / TazeGida2026!@# |
| 5 | Roller tanimli | Kalite Muduru, Depo Sorumlusu, Uretim Operatoru, Satin Alma Uzm. |
| 6 | Birimler tanimli | kg, litre, adet, paket, koli, ton |
| 7 | Depolar tanimli | SOGUK-DEPO-01 (2-6°C), SOGUK-DEPO-02 (0-4°C), KURU-DEPO-01 (18-22°C), AMBALAJ-DEPO |
| 8 | Makineler tanimli | PAST-01 (Pastorizator), KULT-01 (Kulturleme Tanki), DOLUM-01 (Dolum Makinesi), FIRIN-01 (Tunel Firin) |
| 9 | Doviz | TRY (Turk Lirasi) |
| 10 | ISO 22000 surecleri | HACCP prensipleri tanimlanmis |
| 11 | Tarayici (Browser) | Chrome 120+ veya Firefox 120+ |

---

## KULLANICI ROLLERI

| Rol | Kullanici | Erisim |
|-----|-----------|--------|
| Sistem Admin | admin@tazegida.com.tr | Tum moduller |
| Kalite Muduru | kalite@tazegida.com.tr | HACCP, Muayene, NCR, Izlenebilirlik, Tedarikci Deger. |
| Depo Sorumlusu | depo@tazegida.com.tr | Stok, Lot Yonetimi, FIFO, Mal Kabul, Sevkiyat |
| Uretim Operatoru | operator@tazegida.com.tr | ShopFloor Terminal, Uretim Kaydi |
| Satin Alma Uzmani | satinalma@tazegida.com.tr | Tedarikci, Talep, Siparis, Alis Faturasi |

---

## TEST ADIMLARI

---

### Adim 1: Tedarikci Kaydi — Sut Ciftligi (ISO 22000 Sertifikali)

**Ekran:** Tedarikci Yonetimi → Yeni Tedarikci
**Giris Yapan:** admin@tazegida.com.tr
**Islem:** ISO 22000 sertifikali sut tedarikcisin kaydet

**Veri:**

| Alan | Deger |
|------|-------|
| Firma Adi | Yesil Vadi Sut Ciftligi A.S. |
| Vergi No | 1234567890 |
| Vergi Dairesi | Bolu |
| Adres | Abant Yolu Km 12, Bolu |
| Telefon | 0374 253 1234 |
| E-posta | satis@yesilvadisutu.com.tr |
| Yetkili | Ahmet Yilmaz |
| Kategori | Hammadde Tedarikci |
| Sertifika | ISO 22000:2018 (Gecerlilik: 2027-12-31) |
| Not | Gunluk sut kapasitesi 5000 litre, soguk zincir tasima garantili |

**Beklenen Sonuc:** Tedarikci basariyla kaydedilir, listede goruntulenir.
**Dogrulama:**
- [x] Tedarikci listesinde "Yesil Vadi Sut Ciftligi A.S." gorunuyor
- [x] Vergi numarasi 10 hane kontrolu gecti
- [x] Sertifika bilgisi not alaninda kayitli

---

### Adim 2: Tedarikci Kaydi — Un Fabrikasi

**Ekran:** Tedarikci Yonetimi → Yeni Tedarikci
**Islem:** Un ve hububat tedarikcisin kaydet

**Veri:**

| Alan | Deger |
|------|-------|
| Firma Adi | Anadolu Un Sanayi Ltd. Sti. |
| Vergi No | 9876543210 |
| Vergi Dairesi | Konya |
| Adres | Organize Sanayi Bolgesi 3. Cadde No:45, Konya |
| Telefon | 0332 444 5678 |
| E-posta | siparis@anadoluun.com.tr |
| Yetkili | Fatma Demir |
| Kategori | Hammadde Tedarikci |
| Sertifika | ISO 22000:2018, Helal Sertifikasi |

**Beklenen Sonuc:** Ikinci tedarikci basariyla kaydedilir.
**Dogrulama:**
- [x] Tedarikci listesinde 2 kayit gorunuyor
- [x] Filtreleme: "Hammadde Tedarikci" kategorisi ile 2 sonuc

---

### Adim 3: Hammadde Tanimi — Cig Sut

**Ekran:** Urun Yonetimi → Yeni Urun
**Islem:** Sut hammaddesi tanimla (lot zorunlu, raf omru 3 gun, sicaklik kontrolu gerekli)

**Veri:**

| Alan | Deger |
|------|-------|
| Urun Adi | Cig Inek Sutu |
| Urun Kodu | HM-SUT-001 |
| Kategori | Hammadde |
| Birim | Litre |
| Lot Zorunlu | Evet |
| Raf Omru | 3 gun |
| Depolama Kosulu | Soguk Depo (2-4°C) |
| Allerjen | Laktoz, Sut Proteini |
| Tedarikci | Yesil Vadi Sut Ciftligi A.S. |
| Birim Fiyat | 18,50 TL/litre |
| Kritik Stok | 500 litre |
| Not | Sicaklik limiti: MAX 4°C. Kabul sirasinda sicaklik olcumu zorunludur. |

**Beklenen Sonuc:** Hammadde karti olusturulur, lot zorunlulugu aktif.
**Dogrulama:**
- [x] Urun listesinde "HM-SUT-001" kodu ile gorunuyor
- [x] Lot zorunlu alani "Evet" olarak isaretli
- [x] Raf omru "3 gun" olarak kayitli
- [x] Allerjen bilgisi not alaninda goruntuleniyor

---

### Adim 4: Hammadde Tanimi — Bugday Unu

**Ekran:** Urun Yonetimi → Yeni Urun
**Islem:** Un hammaddesi tanimla (lot zorunlu, raf omru 180 gun)

**Veri:**

| Alan | Deger |
|------|-------|
| Urun Adi | Bugday Unu (Tip 550) |
| Urun Kodu | HM-UN-001 |
| Kategori | Hammadde |
| Birim | kg |
| Lot Zorunlu | Evet |
| Raf Omru | 180 gun |
| Depolama Kosulu | Kuru Depo (18-22°C, nem <%60) |
| Allerjen | Gluten |
| Tedarikci | Anadolu Un Sanayi Ltd. Sti. |
| Birim Fiyat | 22,00 TL/kg |
| Kritik Stok | 1000 kg |

**Beklenen Sonuc:** Un hammaddesi basariyla tanimlandi.
**Dogrulama:**
- [x] Urun kodu "HM-UN-001" benzersiz
- [x] Raf omru 180 gun olarak kayitli
- [x] Allerjen: Gluten notu kayitli

---

### Adim 5: Hammadde Tanimi — Toz Seker

**Ekran:** Urun Yonetimi → Yeni Urun
**Islem:** Seker hammaddesi tanimla (lot zorunlu)

**Veri:**

| Alan | Deger |
|------|-------|
| Urun Adi | Kristal Toz Seker |
| Urun Kodu | HM-SEK-001 |
| Kategori | Hammadde |
| Birim | kg |
| Lot Zorunlu | Evet |
| Raf Omru | 730 gun (2 yil) |
| Depolama Kosulu | Kuru Depo (18-22°C) |
| Allerjen | Yok |
| Birim Fiyat | 32,00 TL/kg |
| Kritik Stok | 500 kg |

**Beklenen Sonuc:** Seker hammaddesi basariyla tanimlandi.
**Dogrulama:**
- [x] Lot zorunlu: Evet
- [x] Allerjen alani bos veya "Yok" olarak isaretli

---

### Adim 6: Yari Mamul / Yardimci Malzeme Tanimlari

**Ekran:** Urun Yonetimi → Yeni Urun (tekrarli)
**Islem:** Yogurt uretimi icin gerekli diger malzemeleri tanimla

**Veri:**

| Urun Kodu | Urun Adi | Birim | Lot | Raf Omru | Depolama |
|-----------|----------|-------|-----|----------|----------|
| HM-KUL-001 | Yogurt Kulturleri (Lactobacillus) | gram | Evet | 90 gun | Dondurulmus (-18°C) |
| AM-KAP-001 | Yogurt Kabi 200ml (PP) | adet | Hayir | - | Ambalaj Depo |
| AM-KAP-002 | Aluminyum Kapak Folyo | adet | Hayir | - | Ambalaj Depo |
| AM-ETK-001 | Yogurt Etiketi (Baskili) | adet | Hayir | - | Ambalaj Depo |
| HM-YAG-001 | Tereyagi | kg | Evet | 90 gun | Soguk Depo (2-6°C) |
| HM-TUZ-001 | Iyotlu Sofra Tuzu | kg | Evet | 1095 gun | Kuru Depo |

**Beklenen Sonuc:** Toplam 10 urun/malzeme karti tanimlanmis.
**Dogrulama:**
- [x] Urun listesinde 10 kayit mevcut
- [x] Lot zorunlu olan urunler dogru isaretlenmis
- [x] Donmus depolama gereken kultur -18°C notu kayitli

---

### Adim 7: HACCP Kontrol Plani Olusturma

**Ekran:** Kalite Yonetimi → Kontrol Planlari → Yeni Plan
**Giris Yapan:** kalite@tazegida.com.tr (Kalite Muduru)
**Islem:** Yogurt uretim hatti icin HACCP kontrol plani olustur

**Veri:**

| Alan | Deger |
|------|-------|
| Plan Adi | HACCP-YGT-001: Yogurt Uretim Hatti |
| Standart | ISO 22000:2018 / HACCP |
| Urun Grubu | Sut Urunleri — Yogurt |
| Gecerlilik | 2026-04-07 / 2027-04-07 |
| Revizyon | Rev.0 |
| Hazirlayan | Kalite Muduru |
| Onaylayan | Genel Mudur |

**CCP (Kritik Kontrol Noktalari):**

| CCP No | Islem | Tehlike | Kritik Limit | Izleme Yontemi | Duzeltici Faaliyet |
|--------|-------|---------|--------------|-----------------|-------------------|
| CCP-1 | Pastorizasyon | Patojen mikroorganizmalar (Salmonella, E.coli, Listeria) | Sicaklik: min 72°C, Sure: min 15 saniye | Her parti: sicaklik/sure kaydi | Yeniden pastorizasyon veya imha |
| CCP-2 | Sogutma | Patojen uremesi | Sicaklik: max 4°C, 2 saat icinde ulasilmali | Sicaklik kaydi her 15 dk | Sogutma sistemi kontrolu, urun imha |
| CCP-3 | Depolama | Bozulma, patojen ureme | Sicaklik: 2-6°C surekli | Depo sicaklik loglari (otomatik) | Urun izolasyonu, imha degerlendirmesi |

**Operasyonel On Kosul Programlari (OPRP):**

| OPRP No | Islem | Kontrol | Limit |
|---------|-------|---------|-------|
| OPRP-1 | Hammadde kabul | Sut sicakligi | Max 4°C |
| OPRP-2 | Kulturleme | Inkubasyon sicakligi | 42-44°C |
| OPRP-3 | Ambalajlama | Kapatma butunlugu | Gozle kontrol + sizma testi |

**Beklenen Sonuc:** HACCP kontrol plani olusturulur, 3 CCP + 3 OPRP tanimlanir.
**Dogrulama:**
- [x] Kontrol plani listesinde "HACCP-YGT-001" gorunuyor
- [x] 3 CCP noktasi tanimli
- [x] Her CCP icin kritik limit, izleme yontemi ve duzeltici faaliyet girilmis
- [x] Plan durumu "Onay Bekliyor" veya "Aktif"

---

### Adim 8: Recete/BOM Tanimi — Yogurt (1000 adet x 200ml)

**Ekran:** Urun Yonetimi → Recete (BOM) → Yeni Recete
**Islem:** Yogurt mamul urun recetesi olustur

**Mamul Urun:**

| Alan | Deger |
|------|-------|
| Urun Adi | Dogal Yogurt 200ml |
| Urun Kodu | MU-YGT-001 |
| Kategori | Mamul Urun |
| Birim | adet |
| Lot Zorunlu | Evet |
| Raf Omru | 21 gun |
| Depolama | Soguk Depo (2-6°C) |
| Allerjen | Laktoz, Sut Proteini |
| Satis Fiyati | 14,50 TL/adet |

**Recete Bilesenleri (1000 adet uretim icin):**

| Hammadde | Miktar | Birim | Fire Orani |
|----------|--------|-------|------------|
| Cig Inek Sutu (HM-SUT-001) | 220 | litre | %2 |
| Yogurt Kulturleri (HM-KUL-001) | 44 | gram | %0 |
| Yogurt Kabi 200ml (AM-KAP-001) | 1000 | adet | %3 |
| Aluminyum Kapak Folyo (AM-KAP-002) | 1000 | adet | %3 |
| Yogurt Etiketi (AM-ETK-001) | 1000 | adet | %5 |

**Uretim Adimlari (Routing):**

| Sira | Operasyon | Makine | Standart Sure |
|------|-----------|--------|---------------|
| 1 | Pastorizasyon | PAST-01 | 30 dakika |
| 2 | Sogutma (42-44°C) | PAST-01 | 15 dakika |
| 3 | Kulturleme | KULT-01 | 360 dakika (6 saat) |
| 4 | Sogutma (4°C) | KULT-01 | 120 dakika |
| 5 | Dolum + Kapatma | DOLUM-01 | 90 dakika |
| 6 | Etiketleme | DOLUM-01 | 30 dakika |

**Beklenen Sonuc:** Recete olusturulur, toplam maliyet hesaplanir.
**Dogrulama:**
- [x] Recete "MU-YGT-001" urunune baglanmis
- [x] 5 bilesen tanimli
- [x] 6 operasyon adimi tanimli
- [x] Fire oranlari kayitli
- [x] Tahmini maliyet hesaplandi (sut: 220x18.50 = 4.070 TL + diger bilesenler)

---

### Adim 9: Satin Alma Siparisi Olusturma

**Ekran:** Satin Alma → Yeni Siparis
**Giris Yapan:** satinalma@tazegida.com.tr
**Islem:** Yogurt uretimi icin hammadde satin alma siparisi olustur

**Siparis 1 — Sut Ciftligi:**

| Alan | Deger |
|------|-------|
| Tedarikci | Yesil Vadi Sut Ciftligi A.S. |
| Siparis No | SA-2026-0041 |
| Teslim Tarihi | 2026-04-08 |
| Teslim Yeri | SOGUK-DEPO-01 |

| Kalem | Miktar | Birim | Birim Fiyat | Toplam |
|-------|--------|-------|-------------|--------|
| Cig Inek Sutu | 500 | litre | 18,50 TL | 9.250,00 TL |

**Siparis 2 — Un Fabrikasi:**

| Alan | Deger |
|------|-------|
| Tedarikci | Anadolu Un Sanayi Ltd. Sti. |
| Siparis No | SA-2026-0042 |
| Teslim Tarihi | 2026-04-08 |
| Teslim Yeri | KURU-DEPO-01 |

| Kalem | Miktar | Birim | Birim Fiyat | Toplam |
|-------|--------|-------|-------------|--------|
| Bugday Unu (Tip 550) | 2000 | kg | 22,00 TL | 44.000,00 TL |
| Kristal Toz Seker | 500 | kg | 32,00 TL | 16.000,00 TL |

**Beklenen Sonuc:** 2 satin alma siparisi olusturulur ve tedarikciye gonderilir.
**Dogrulama:**
- [x] Siparis durumu: "Tedarikciye Gonderildi"
- [x] Siparis toplami: SA-0041 = 9.250 TL, SA-0042 = 60.000 TL
- [x] KDV hesaplamasi dogru (%10 gida KDV)

---

### Adim 10: Mal Kabul — Sut Teslimati (Sicaklik Kontrolu)

**Ekran:** Depo Yonetimi → Mal Kabul → Yeni Kabul
**Giris Yapan:** depo@tazegida.com.tr (Depo Sorumlusu)
**Islem:** Sut teslimatini kabul et, sicaklik olcumu yap

**Veri:**

| Alan | Deger |
|------|-------|
| Siparis Ref. | SA-2026-0041 |
| Teslim Tarihi | 2026-04-08 |
| Tedarikci | Yesil Vadi Sut Ciftligi A.S. |
| Lot No | SUT-20260408-001 |
| Miktar | 500 litre |
| Arac Plaka | 14 ABC 456 |
| Tasima Sicakligi (olculen) | 3,2°C |
| Kabul Limiti | Max 4°C |
| Gorsel Kontrol | Renk normal, koku normal, yabanci madde yok |
| Numune Alindi | Evet — 2 adet numune (mikrobiyoloji lab) |
| Hedef Depo | SOGUK-DEPO-01 |

**Beklenen Sonuc:** Sut teslimati kabul edilir, lot numarasi atanir, kalite kontrole yonlendirilir.
**Dogrulama:**
- [x] Lot no "SUT-20260408-001" otomatik veya manuel atanmis
- [x] Sicaklik kaydi: 3,2°C (limit icinde: GECTI)
- [x] Stok durumu: "Kalite Kontrol Bekliyor" (henuz serbest degil)
- [x] Numune kaydi olusturulmus

---

### Adim 11: Mal Kabul — Un ve Seker Teslimati

**Ekran:** Depo Yonetimi → Mal Kabul → Yeni Kabul
**Islem:** Un ve seker teslimatini kabul et

**Veri:**

| Kalem | Lot No | Miktar | Depo | Sicaklik | Nem | Gorsel |
|-------|--------|--------|------|----------|-----|--------|
| Bugday Unu (Tip 550) | UN-20260408-001 | 2000 kg | KURU-DEPO-01 | 20°C | %55 | Ambalaj sag, bocek yok |
| Kristal Toz Seker | SEK-20260408-001 | 500 kg | KURU-DEPO-01 | 20°C | %50 | Ambalaj sag, topaklanma yok |

**Beklenen Sonuc:** Her iki kalem lot numarasi ile kabul edilir.
**Dogrulama:**
- [x] Un ve seker icin ayri lot numaralari atanmis
- [x] Kuru depo sicaklik ve nem uygun (18-22°C, <%60)
- [x] Stok durumu: "Kalite Kontrol Bekliyor"

---

### Adim 12: Giris Kalite Kontrol — Mikrobiyoloji Testi (Sut)

**Ekran:** Kalite Yonetimi → Giris Muayene → Yeni Muayene
**Giris Yapan:** kalite@tazegida.com.tr (Kalite Muduru)
**Islem:** Sut numunesine mikrobiyoloji testi uygula

**Veri:**

| Alan | Deger |
|------|-------|
| Muayene No | GM-2026-0087 |
| Malzeme | Cig Inek Sutu (HM-SUT-001) |
| Lot No | SUT-20260408-001 |
| Tedarikci | Yesil Vadi Sut Ciftligi A.S. |
| Muayene Tipi | Mikrobiyoloji |
| Numune Sayisi | 2 |

**Test Sonuclari:**

| Parametre | Limit | Sonuc | Durum |
|-----------|-------|-------|-------|
| Toplam Bakteri Sayisi (TBS) | Max 100.000 kob/ml | 45.000 kob/ml | GECTI |
| Koliform | Max 100 kob/ml | 12 kob/ml | GECTI |
| E. coli | 0 kob/ml | 0 kob/ml | GECTI |
| Maya-Kuf | Max 100 kob/ml | 8 kob/ml | GECTI |
| Salmonella (25ml'de) | Negatif | Negatif | GECTI |
| Listeria monocytogenes | Negatif | Negatif | GECTI |
| Somatik Hucre Sayisi | Max 400.000 /ml | 185.000 /ml | GECTI |

**Beklenen Sonuc:** Mikrobiyoloji testi GECTI, malzeme uretime uygun.
**Dogrulama:**
- [x] Tum parametreler limit icinde
- [x] Muayene sonucu: "KABUL"
- [x] Lot durumu guncellendi: "Kalite Kontrol Bekliyor" → "Serbest"
- [x] Sonuc belgesi/raporu olusturulabilir

---

### Adim 13: Giris Kalite Kontrol — Allerjen Testi ve Bildirimi

**Ekran:** Kalite Yonetimi → Giris Muayene → Allerjen Kontrol
**Islem:** Sut numunesi icin allerjen testi ve laktoz bildirimi

**Veri:**

| Alan | Deger |
|------|-------|
| Muayene No | GM-2026-0088 |
| Malzeme | Cig Inek Sutu (HM-SUT-001) |
| Lot No | SUT-20260408-001 |
| Test Tipi | Allerjen Tarama |

**Allerjen Sonuclari:**

| Allerjen | Test Sonucu | Etiket Bildirimi |
|----------|-------------|-----------------|
| Laktoz | POZITIF (dogal bilesen) | "Laktoz icerir" zorunlu |
| Sut Proteini (Kazein) | POZITIF (dogal bilesen) | "Sut proteini icerir" zorunlu |
| Gluten | NEGATIF | — |
| Soya | NEGATIF | — |
| Findik/Fistiik | NEGATIF | — |

**Beklenen Sonuc:** Allerjen profili belirlenir, etiket icin bildirim zorunluluklari kaydedilir.
**Dogrulama:**
- [x] Allerjen bilgisi urun kartina islenmis
- [x] Not alaninda: "Laktoz icerir, Sut proteini icerir — Etiket bildirimi zorunludur"
- [x] HACCP dosyasina allerjen kaydi eklenmis

> **BILINEN KISITLAMA:** Quvex'te ayri bir allerjen matrisi modulu yoktur.
> Allerjen bilgileri urun kartinin not alanina ve muayene raporuna yazilir.

---

### Adim 14: Uretim Emri Acma — Yogurt Partisi

**Ekran:** Uretim Yonetimi → Yeni Is Emri
**Giris Yapan:** admin@tazegida.com.tr
**Islem:** 1000 adet yogurt icin uretim emri ac, parti/lot numarasi otomatik ata

**Veri:**

| Alan | Deger |
|------|-------|
| Is Emri No | IE-2026-0156 |
| Mamul | Dogal Yogurt 200ml (MU-YGT-001) |
| Miktar | 1000 adet |
| Baslangic Tarihi | 2026-04-09 |
| Bitis Tarihi | 2026-04-10 |
| Parti/Lot No | YGT-20260409-001 (OTOMATIK) |
| Oncelik | Yuksek |
| Recete | BOM-YGT-001 (Rev.0) |

**Otomatik Malzeme Rezervasyonu:**

| Malzeme | Gerekli | Lot | Stok | Durum |
|---------|---------|-----|------|-------|
| Cig Inek Sutu | 224,4 lt (fire dahil) | SUT-20260408-001 | 500 lt | Yeterli |
| Yogurt Kulturleri | 44 gr | KUL-20260401-001 | 200 gr | Yeterli |
| Yogurt Kabi 200ml | 1030 adet (fire dahil) | — | 5000 adet | Yeterli |
| Al. Kapak Folyo | 1030 adet | — | 5000 adet | Yeterli |
| Yogurt Etiketi | 1050 adet | — | 10000 adet | Yeterli |

**Beklenen Sonuc:** Is emri olusturulur, lot numarasi OTOMATIK atanir, malzeme rezervasyonu yapilir.
**Dogrulama:**
- [x] Is emri durumu: "Planlanmis"
- [x] Parti/Lot numarasi formati: YGT-YYYYMMDD-XXX
- [x] Tum malzemeler "Yeterli" durumda
- [x] Fire oranlari receteden otomatik hesaplandi (sut: 220 x 1.02 = 224,4 lt)
- [x] Hammadde lotlari (SUT-20260408-001) is emrine baglandi → izlenebilirlik

---

### Adim 15: Uretim Kaydi — Pastorizasyon (CCP-1)

**Ekran:** ShopFloor Terminal / Uretim Kaydi
**Giris Yapan:** operator@tazegida.com.tr (Uretim Operatoru)
**Islem:** Pastorizasyon islemini kaydet — CCP-1 kritik kontrol noktasi

**Veri:**

| Alan | Deger |
|------|-------|
| Is Emri | IE-2026-0156 |
| Operasyon | 1 — Pastorizasyon |
| Makine | PAST-01 |
| Operator | Mehmet Ozkan |
| Baslangic | 2026-04-09 08:00 |
| Bitis | 2026-04-09 08:30 |
| Sure | 30 dakika |

**CCP-1 Olcum Kaydi:**

| Parametre | Hedef | Olculen | Tolerans | Durum |
|-----------|-------|---------|----------|-------|
| Pastorizasyon Sicakligi | 72°C | 73,5°C | Min 72°C | GECTI |
| Bekletme Suresi | 15 saniye | 16 saniye | Min 15 sn | GECTI |
| Sut Giris Sicakligi | — | 4,1°C | — | Kayit |
| Sut Cikis Sicakligi | — | 73,5°C | — | Kayit |

**Beklenen Sonuc:** Pastorizasyon operasyonu tamamlandi, CCP-1 kaydi basarili.
**Dogrulama:**
- [x] Operasyon durumu: "Tamamlandi"
- [x] CCP-1 kritik limitler icinde (72°C+ ve 15sn+)
- [x] Sicaklik ve sure kayitlari saklanmis (izlenebilirlik)
- [x] Operator bilgisi kayitli

> **BILINEN KISITLAMA:** Quvex'te sicaklik/nem sensor entegrasyonu yoktur.
> Tum olcumler operator tarafindan manuel olarak girilir.

---

### Adim 16: Uretim Kaydi — Sogutma (42-44°C icin)

**Ekran:** ShopFloor Terminal
**Islem:** Pastorize sut kulturleme sicakligina sogutuluyor

**Veri:**

| Alan | Deger |
|------|-------|
| Operasyon | 2 — Sogutma (Kulturleme Sicakligi) |
| Makine | PAST-01 |
| Baslangic | 2026-04-09 08:30 |
| Bitis | 2026-04-09 08:45 |
| Cikis Sicakligi | 43,0°C |

**Beklenen Sonuc:** Sut kulturleme sicakligina sogutuludu.
**Dogrulama:**
- [x] Sicaklik 42-44°C araliginda: GECTI
- [x] Operasyon suresi: 15 dakika kayitli

---

### Adim 17: Uretim Kaydi — Kulturleme (OPRP-2)

**Ekran:** ShopFloor Terminal
**Islem:** Yogurt kulturleri eklenerek inkubasyon baslatildi

**Veri:**

| Alan | Deger |
|------|-------|
| Operasyon | 3 — Kulturleme |
| Makine | KULT-01 (Kulturleme Tanki) |
| Operator | Mehmet Ozkan |
| Baslangic | 2026-04-09 09:00 |
| Bitis | 2026-04-09 15:00 |
| Sure | 360 dakika (6 saat) |

**OPRP-2 Olcum Kaydi (her saat basinda):**

| Saat | Sicaklik | pH | Durum |
|------|----------|----|-------|
| 09:00 | 43,0°C | 6,5 | Baslangic |
| 10:00 | 43,2°C | 6,1 | Normal |
| 11:00 | 43,1°C | 5,7 | Normal |
| 12:00 | 43,0°C | 5,2 | Normal |
| 13:00 | 42,8°C | 4,8 | Normal |
| 14:00 | 43,1°C | 4,5 | Normal |
| 15:00 | 43,0°C | 4,3 | Hedef pH ulasildi |

**Kultur Kullanimi:**

| Malzeme | Lot | Miktar |
|---------|-----|--------|
| Yogurt Kulturleri | KUL-20260401-001 | 44 gram |

**Beklenen Sonuc:** Kulturleme islemi tamamlandi, pH hedef degere ulasti.
**Dogrulama:**
- [x] Inkubasyon suresi 6 saat kayitli
- [x] Sicaklik tum olcumlerde 42-44°C araliginda
- [x] pH 6,5'ten 4,3'e dustu (normal fermentasyon)
- [x] Kultur lot numarasi (KUL-20260401-001) uretim emrine bagli → izlenebilirlik

---

### Adim 18: Uretim Kaydi — Sogutma (CCP-2)

**Ekran:** ShopFloor Terminal
**Islem:** Yogurt 4°C'ye sogutulur — CCP-2 kritik kontrol noktasi

**Veri:**

| Alan | Deger |
|------|-------|
| Operasyon | 4 — Sogutma (4°C) |
| Makine | KULT-01 |
| Baslangic | 2026-04-09 15:00 |
| Bitis | 2026-04-09 17:00 |
| Sure | 120 dakika |

**CCP-2 Olcum Kaydi:**

| Parametre | Hedef | Olculen | Tolerans | Durum |
|-----------|-------|---------|----------|-------|
| Son Sicaklik | 4°C | 3,8°C | Max 4°C | GECTI |
| Soguma Suresi | Max 120 dk | 115 dk | Max 120 dk | GECTI |
| 43°C'den 4°C'ye gecis | Max 2 saat | 1 saat 55 dk | HACCP limit | GECTI |

**Beklenen Sonuc:** Sogutma tamamlandi, CCP-2 limitleri karsilandi.
**Dogrulama:**
- [x] CCP-2 kritik limit: 2 saat icinde 4°C'ye ulasildi — GECTI
- [x] Son sicaklik 3,8°C kayitli
- [x] CCP-2 kaydi HACCP dosyasina islendi

---

### Adim 19: Ara Kalite Kontrol — pH Olcumu ve Kivam

**Ekran:** Kalite Yonetimi → Proses Muayene → Yeni Muayene
**Giris Yapan:** kalite@tazegida.com.tr
**Islem:** Sogutma sonrasi yogurt numunesine ara kalite kontrol uygula

**Veri:**

| Alan | Deger |
|------|-------|
| Muayene No | PM-2026-0034 |
| Is Emri | IE-2026-0156 |
| Lot | YGT-20260409-001 |
| Asama | Sogutma sonrasi (dolum oncesi) |

**Test Sonuclari:**

| Parametre | Spesifikasyon | Sonuc | Durum |
|-----------|--------------|-------|-------|
| pH | 4,0 - 4,5 | 4,3 | GECTI |
| Asitlik (°SH) | 35 - 45 | 40 | GECTI |
| Kivam (viskozite) | 2000 - 4000 cP | 3200 cP | GECTI |
| Renk | Beyaz-krem | Beyaz-krem | GECTI |
| Koku | Karakteristik | Karakteristik | GECTI |
| Tat | Karakteristik, hafif eksi | Normal | GECTI |
| Yabanci Madde | Yok | Yok | GECTI |

**Beklenen Sonuc:** Ara kalite kontrol GECTI, uretim devam edebilir.
**Dogrulama:**
- [x] Tum parametreler spesifikasyon icinde
- [x] Muayene sonucu: "KABUL — Doluma uygun"
- [x] Sonuc is emrine baglandi

---

### Adim 20: Uretim Kaydi — Dolum ve Kapatma

**Ekran:** ShopFloor Terminal
**Islem:** Yogurt kaplara dolum yapilir, aluminyum kapak ile kapatilir

**Veri:**

| Alan | Deger |
|------|-------|
| Operasyon | 5 — Dolum + Kapatma |
| Makine | DOLUM-01 |
| Operator | Ayse Kara |
| Baslangic | 2026-04-10 08:00 |
| Bitis | 2026-04-10 09:30 |
| Sure | 90 dakika |
| Uretilen Adet | 1000 adet |
| Fire | 18 adet (kap hatali) + 7 adet (kapak sizmasi) = 25 adet |
| Net Uretim | 975 adet |

**OPRP-3 Kontrol:**

| Kontrol | Sonuc |
|---------|-------|
| Kapak butunlugu | 25 adet red, 975 adet uygun |
| Dolum miktari | 200ml ± 5ml — ornekleme kontrolu GECTI |
| Sizma testi | 10 adet numune — sizma yok |

**Beklenen Sonuc:** Dolum tamamlandi, 975 adet uygun urun.
**Dogrulama:**
- [x] Uretilen miktar: 975 adet (1000 - 25 fire)
- [x] Fire orani: %2,5 (beklenen: %3 — kabul edilebilir)
- [x] Ambalaj malzeme tuketimleri stoktan dusuldu

---

### Adim 21: Etiketleme (Lot, Uretim Tarihi, SKT, Allerjen)

**Ekran:** Uretim Yonetimi → Etiketleme
**Islem:** Yogurt kaplarina yasal etiket bilgileri bastirilir

**Etiket Icerigi:**

| Alan | Deger |
|------|-------|
| Urun Adi | Dogal Yogurt |
| Net Miktar | 200 ml |
| Lot No | YGT-20260409-001 |
| Uretim Tarihi | 09.04.2026 |
| Son Kullanma Tarihi | 30.04.2026 (21 gun) |
| Depolama Kosulu | 2-6°C'de muhafaza ediniz |
| Allerjen Bildirimi | "LAKTOZ ICERIR, SUT PROTEINI ICERIR" |
| Icerik | Pastorize inek sutu, yogurt kulturleri |
| Uretici | Taze Gida San. A.S. — Bolu |
| Barkod | 8690001234567 |

**Beklenen Sonuc:** 975 adet yogurt etiketlendi.
**Dogrulama:**
- [x] SKT = Uretim tarihi + 21 gun = 30.04.2026
- [x] Allerjen bildirimi buyuk harflerle yazilmis
- [x] Lot numarasi etiket ile uretim emri eslesiyor
- [x] Operasyon durumu: "Tamamlandi"

---

### Adim 22: Son Muayene (Fiziksel + Kimyasal + Mikrobiyoloji)

**Ekran:** Kalite Yonetimi → Son Muayene → Yeni Muayene
**Giris Yapan:** kalite@tazegida.com.tr
**Islem:** Uretim tamamlanan yogurt partisine son muayene uygula

**Veri:**

| Alan | Deger |
|------|-------|
| Muayene No | SM-2026-0072 |
| Mamul | Dogal Yogurt 200ml (MU-YGT-001) |
| Lot | YGT-20260409-001 |
| Is Emri | IE-2026-0156 |
| Numune | 10 adet (AQL 2.5, Seviye II) |

**Fiziksel Testler:**

| Parametre | Spesifikasyon | Sonuc | Durum |
|-----------|--------------|-------|-------|
| Dolum Miktari | 200ml ± 5ml | 201ml (ort.) | GECTI |
| Kapak Butunlugu | Sizma yok | Sizma yok | GECTI |
| Etiket Yapistirma | Tam yapismis | Tam | GECTI |
| Barkod Okunurluk | Okunur | Okunur | GECTI |

**Kimyasal Testler:**

| Parametre | Spesifikasyon | Sonuc | Durum |
|-----------|--------------|-------|-------|
| pH | 4,0 - 4,5 | 4,25 | GECTI |
| Yag Orani | Min %3,0 | %3,4 | GECTI |
| Kuru Madde | Min %11,0 | %12,8 | GECTI |
| Protein | Min %3,0 | %3,6 | GECTI |

**Mikrobiyoloji Testleri:**

| Parametre | Limit | Sonuc | Durum |
|-----------|-------|-------|-------|
| Toplam Canli | Max 10^5 kob/g | 2,3 x 10^4 | GECTI |
| Koliform | Max 10 kob/g | <1 kob/g | GECTI |
| E. coli | 0 | 0 | GECTI |
| Maya-Kuf | Max 100 kob/g | 5 kob/g | GECTI |
| Salmonella (25g) | Negatif | Negatif | GECTI |

**Beklenen Sonuc:** Son muayene KABUL, parti serbest birakilir.
**Dogrulama:**
- [x] Tum test parametreleri spesifikasyon dahilinde
- [x] Muayene sonucu: "KABUL"
- [x] Lot durumu: "Serbest — Sevkiyata Uygun"
- [x] CoC (Uygunluk Sertifikasi) olusturulabilir
- [x] Son muayene raporu PDF olarak indirilebilir

---

### Adim 23: Depo Girisi — Soguk Depo (FIFO Zorunlu)

**Ekran:** Depo Yonetimi → Depo Girisi
**Giris Yapan:** depo@tazegida.com.tr
**Islem:** Son muayeneden gecen yogurtlari soguk depoya yerleştir (FIFO kurali)

**Veri:**

| Alan | Deger |
|------|-------|
| Depo | SOGUK-DEPO-01 |
| Lokasyon | SD01-R03-K02 (Raf 3, Konum 2) |
| Urun | Dogal Yogurt 200ml (MU-YGT-001) |
| Lot | YGT-20260409-001 |
| Miktar | 975 adet |
| Depo Sicakligi | 4,0°C |
| CCP-3 | Soguk depo limiti: 2-6°C — UYGUN |
| Giris Tarihi | 2026-04-10 10:00 |

**FIFO Kontrolu:**

| Sira | Lot No | Uretim Tarihi | SKT | Miktar | Oncelik |
|------|--------|---------------|-----|--------|---------|
| 1 | YGT-20260402-001 | 02.04.2026 | 23.04.2026 | 320 adet | ONCE SEVK |
| 2 | YGT-20260405-001 | 05.04.2026 | 26.04.2026 | 540 adet | — |
| 3 | YGT-20260409-001 | 09.04.2026 | 30.04.2026 | 975 adet | SON SEVK |

**Beklenen Sonuc:** Yogurt soguk depoya giris yapti, FIFO sirasina eklendi.
**Dogrulama:**
- [x] Stok miktari guncellendi: +975 adet
- [x] FIFO siralama: Eski tarihli lot once sevk edilecek
- [x] Depo sicakligi CCP-3 limitleri icinde (2-6°C)
- [x] Lokasyon bilgisi kayitli

---

### Adim 24: Stok Sorgulama — Raf Omru Yaklasan Urunler

**Ekran:** Depo Yonetimi → Stok Raporu → Raf Omru Uyarisi
**Islem:** Raf omru 7 gun icinde dolacak urunleri sorgula

**Tarih:** 2026-04-18 (simule edilen sorgu tarihi)

**Beklenen Rapor:**

| Urun | Lot | SKT | Kalan Gun | Miktar | Depo | Uyari |
|------|-----|-----|-----------|--------|------|-------|
| Dogal Yogurt 200ml | YGT-20260402-001 | 23.04.2026 | 5 gun | 120 adet | SOGUK-DEPO-01 | KRITIK |
| Dogal Yogurt 200ml | YGT-20260405-001 | 26.04.2026 | 8 gun | 340 adet | SOGUK-DEPO-01 | UYARI |
| Cig Inek Sutu | SUT-20260416-002 | 19.04.2026 | 1 gun | 80 litre | SOGUK-DEPO-01 | ACIL |

**Beklenen Sonuc:** Raf omru yaklasan urunler listelenir, renk kodlu uyari gosterilir.
**Dogrulama:**
- [x] Kalan gun <= 3: KIRMIZI (ACIL)
- [x] Kalan gun 4-7: TURUNCU (KRITIK)
- [x] Kalan gun 8-14: SARI (UYARI)
- [x] Rapordan FIFO siralamasi goruntuleniyor
- [x] SKT gecmis urun varsa "SURESI DOLMUS — SEVK EDILEMEZ" uyarisi

---

### Adim 25: Musteri Siparisi ve Sevkiyat Hazirlama

**Ekran:** Satis → Siparisler / Depo → Sevkiyat Hazirlama
**Islem:** Musteri siparisi icin soguk zincir kontrolu ile sevkiyat hazirla

**Musteri Siparisi:**

| Alan | Deger |
|------|-------|
| Musteri | MarketZincir A.S. |
| Siparis No | SS-2026-0089 |
| Teslim Tarihi | 2026-04-11 |

| Kalem | Miktar | Birim Fiyat | Toplam |
|-------|--------|-------------|--------|
| Dogal Yogurt 200ml | 500 adet | 14,50 TL | 7.250,00 TL |

**Sevkiyat Hazirlama (FIFO uygulamasi):**

| Lot | SKT | Miktar | Sevkiyat Notu |
|-----|-----|--------|---------------|
| YGT-20260402-001 | 23.04.2026 | 320 adet | FIFO — en eski lot once |
| YGT-20260405-001 | 26.04.2026 | 180 adet | FIFO — ikinci lot |
| **TOPLAM** | — | **500 adet** | — |

**Soguk Zincir Kontrolu:**

| Parametre | Limit | Olculen | Durum |
|-----------|-------|---------|-------|
| Arac Kasa Sicakligi | 2-6°C | 3,5°C | GECTI |
| Yuklemede Urun Sicakligi | Max 6°C | 4,2°C | GECTI |
| Sogutma Unitesi Calisiyor | Evet | Evet | GECTI |
| Termograf Kayit Cihazi | Aktif | Aktif | GECTI |

**Beklenen Sonuc:** Sevkiyat hazirlandi, FIFO'ya uygun lotlar secildi, soguk zincir onaylandi.
**Dogrulama:**
- [x] FIFO: Eski tarihli lot (YGT-20260402-001) once secildi
- [x] Soguk zincir tum parametreleri GECTI
- [x] Stoktan dusum: 320 + 180 = 500 adet
- [x] Kalan stok dogru hesaplandi

---

### Adim 26: Irsaliye Olusturma

**Ekran:** Satis → Irsaliye → Yeni Irsaliye
**Islem:** Sevkiyat icin irsaliye olustur

**Veri:**

| Alan | Deger |
|------|-------|
| Irsaliye No | IR-2026-0112 |
| Musteri | MarketZincir A.S. |
| Siparis Ref. | SS-2026-0089 |
| Cikis Tarihi | 2026-04-11 |
| Teslim Adresi | MarketZincir Dagitim Merkezi, Gebze |
| Arac | 34 XYZ 789 — Sogutmali TIR |
| Sofor | Hasan Yildiz |

| Kalem | Lot | Miktar | Birim |
|-------|-----|--------|-------|
| Dogal Yogurt 200ml | YGT-20260402-001 | 320 | adet |
| Dogal Yogurt 200ml | YGT-20260405-001 | 180 | adet |

**Beklenen Sonuc:** Irsaliye olusturuldu, lot detaylari yer aliyor.
**Dogrulama:**
- [x] Irsaliye uzerinde lot numaralari goruntuleniyor
- [x] Toplam miktar: 500 adet
- [x] Irsaliye PDF olarak indirilebilir
- [x] Soguk zincir bilgisi irsaliye notlarinda

---

### Adim 27: Satis Faturasi Olusturma

**Ekran:** Finans → Satis Faturasi → Yeni Fatura
**Islem:** Irsaliyeye bagli satis faturasi olustur

**Veri:**

| Alan | Deger |
|------|-------|
| Fatura No | SF-2026-0098 |
| Musteri | MarketZincir A.S. |
| Irsaliye Ref. | IR-2026-0112 |
| Fatura Tarihi | 2026-04-11 |
| Vade | 30 gun (11.05.2026) |

| Kalem | Miktar | Birim Fiyat | KDV | Toplam |
|-------|--------|-------------|-----|--------|
| Dogal Yogurt 200ml | 500 adet | 14,50 TL | %10 | 7.975,00 TL |

| | Tutar |
|---|-------|
| Ara Toplam | 7.250,00 TL |
| KDV (%10) | 725,00 TL |
| Genel Toplam | 7.975,00 TL |

**Beklenen Sonuc:** Fatura olusturuldu, muhasebe kaydina islendi.
**Dogrulama:**
- [x] KDV orani %10 (gida) dogru uygulanmis
- [x] Fatura PDF olarak indirilebilir
- [x] Musteri cari bakiyesi: 7.975,00 TL (borc)
- [x] Irsaliye-fatura baglantisi kayitli

---

### Adim 28: Izlenebilirlik Raporu — Lot Bazli Ileri Izleme

**Ekran:** Izlenebilirlik → Lot Sorgulama → Ileri Izleme
**Giris Yapan:** kalite@tazegida.com.tr
**Islem:** Hammadde lotundan mamul ve musteriye kadar ileri izleme yap

**Sorgu:** Hammadde Lot: SUT-20260408-001

**Beklenen Rapor (Ileri Izleme — Forward Trace):**

```
SUT-20260408-001 (Cig Inek Sutu — 500 lt)
├── Tedarikci: Yesil Vadi Sut Ciftligi A.S.
├── Kabul Tarihi: 08.04.2026
├── Giris Muayene: GM-2026-0087 (KABUL), GM-2026-0088 (Allerjen OK)
│
├── Uretim Emri: IE-2026-0156
│   ├── Mamul: Dogal Yogurt 200ml
│   ├── Lot: YGT-20260409-001
│   ├── Miktar: 975 adet
│   ├── CCP-1: Pastorizasyon 73,5°C/16sn — GECTI
│   ├── CCP-2: Sogutma 3,8°C/115dk — GECTI
│   ├── Ara Kontrol: PM-2026-0034 — KABUL
│   └── Son Muayene: SM-2026-0072 — KABUL
│
├── Sevkiyat:
│   ├── Irsaliye: IR-2026-0112 (11.04.2026)
│   ├── Fatura: SF-2026-0098
│   ├── Musteri: MarketZincir A.S.
│   └── Lot YGT-20260409-001: 180 adet sevk (kalan: 795 adet depoda)
│
└── Kalan Stok: 795 adet (SOGUK-DEPO-01, SKT: 30.04.2026)
```

**Beklenen Sonuc:** Hammaddeden musteriye kadar tam izlenebilirlik raporu goruntulenir.
**Dogrulama:**
- [x] Hammadde → Uretim → Mamul → Sevkiyat → Musteri zinciri tam
- [x] Tum CCP kayitlari gorunuyor
- [x] Tum muayene sonuclari listeleniy
- [x] Hangi musteriye kac adet gittigi belli

---

### Adim 29: Izlenebilirlik Raporu — Geri Izleme (Backward Trace)

**Ekran:** Izlenebilirlik → Lot Sorgulama → Geri Izleme
**Islem:** Mamul lot numarasindan geri izleme ile tum hammaddelere ulas

**Sorgu:** Mamul Lot: YGT-20260409-001

**Beklenen Rapor (Geri Izleme — Backward Trace):**

```
YGT-20260409-001 (Dogal Yogurt 200ml — 975 adet)
│
├── Hammaddeler:
│   ├── Cig Inek Sutu — Lot: SUT-20260408-001 (224,4 lt kullanildi)
│   │   ├── Tedarikci: Yesil Vadi Sut Ciftligi A.S.
│   │   ├── Giris Muayene: GM-2026-0087 KABUL
│   │   └── Allerjen: Laktoz, Sut Proteini
│   │
│   ├── Yogurt Kulturleri — Lot: KUL-20260401-001 (44 gr kullanildi)
│   │   └── Tedarikci: BioCulture Ltd. (Danimarka)
│   │
│   ├── Yogurt Kabi 200ml — (1030 adet tuketildi, 25 fire)
│   ├── Al. Kapak Folyo — (1030 adet tuketildi, 25 fire)
│   └── Yogurt Etiketi — (975 adet tuketildi)
│
├── Uretim:
│   ├── Is Emri: IE-2026-0156
│   ├── Makine: PAST-01, KULT-01, DOLUM-01
│   ├── Operatorler: Mehmet Ozkan, Ayse Kara
│   └── Tarih: 09-10.04.2026
│
└── Kalite:
    ├── CCP-1: 73,5°C/16sn GECTI
    ├── CCP-2: 3,8°C/115dk GECTI
    ├── pH: 4,25 (spec: 4,0-4,5)
    └── Son Muayene: SM-2026-0072 KABUL
```

**Beklenen Sonuc:** Mamulden tum hammaddelere, tedarikcilere ve kalite kayitlarina geri izleme tamamlandi.
**Dogrulama:**
- [x] Tum hammadde lotlari listeleniy
- [x] Tedarikci bilgileri goruntuleniyor
- [x] Kalite kayitlari (CCP, muayene) tamam
- [x] Gida guvenligi acisinden "1 yukarı, 1 asagi" kuralina uygun izlenebilirlik

---

### Adim 30: GERI CAGIRMA (RECALL) SENARYOSU

**Ekran:** Kalite Yonetimi → NCR (Uygunsuzluk) → Yeni NCR
**Giris Yapan:** kalite@tazegida.com.tr
**Islem:** Mikrobiyoloji labindan POZITIF sonuc geldi — geri cagirma sureci baslatilir

**SENARYO:**
> Dis laboratuvardan gelen rutin numune sonucu: YGT-20260409-001 lotunda
> Listeria monocytogenes POZITIF tespit edildi. Acil geri cagirma gereklidir.

**Adim 30a: NCR (Uygunsuzluk Raporu) Olustur**

| Alan | Deger |
|------|-------|
| NCR No | NCR-2026-0015 |
| Tip | Kritik Uygunsuzluk — Gida Guvenligi |
| Urun | Dogal Yogurt 200ml (MU-YGT-001) |
| Lot | YGT-20260409-001 |
| Tespit Tarihi | 2026-04-14 |
| Tespit Eden | Dis Lab — Mikrobiyoloji Raporu #LAB-2026-4521 |
| Aciklama | Listeria monocytogenes pozitif — halk sagligi riski |
| Oncelik | ACIL |

**Adim 30b: Lot Bazli Etki Analizi (Izlenebilirlik Kullanarak)**

Sistem uzerinden YGT-20260409-001 lot sorgulama yapilir:

| Bilgi | Deger |
|-------|-------|
| Toplam Uretim | 975 adet |
| Sevk Edilen | 180 adet (MarketZincir A.S. — IR-2026-0112) |
| Depoda Kalan | 795 adet (SOGUK-DEPO-01) |
| Etkilenen Musteri | MarketZincir A.S. |
| Musteri Iletisim | 0216 555 7890 — tedarik@marketzincir.com.tr |

**Adim 30c: Aksiyonlar**

| Aksiyon | Sorumlu | Durum |
|---------|---------|-------|
| Depodaki 795 adet: IZOLE ET, "BLOKE" durumuna al | Depo Sorumlusu | Yapildi |
| MarketZincir'e acil bildirim: 180 adet geri cagirma | Kalite Muduru | Yapildi |
| Geri donus yapilan urunler: IMHA karari | Kalite Muduru | Bekliyor |
| Hammadde lot izleme: SUT-20260408-001 diger uretimde kullanildi mi? | Kalite Muduru | Kontrol ediliyor |
| Tedarikci Yesil Vadi'ya bildirim | Satin Alma | Yapildi |
| Tarım ve Orman Bakanligi bildirimi (yasal zorunluluk) | Genel Mudur | Yapildi |
| Kok neden analizi (Root Cause) | Kalite Muduru | Baslatildi |

**Adim 30d: Stok BLOKE Islemi**

**Ekran:** Depo Yonetimi → Stok → Lot Durumu Degistir

| Alan | Deger |
|------|-------|
| Lot | YGT-20260409-001 |
| Onceki Durum | Serbest |
| Yeni Durum | BLOKE — Geri Cagirma |
| Neden | NCR-2026-0015: Listeria pozitif |

**Beklenen Sonuc:** Geri cagirma sureci baslatildi, etkilenen lot ve musteriler belirlendi.
**Dogrulama:**
- [x] NCR kaydı olusturuldu (NCR-2026-0015)
- [x] Lot durumu "BLOKE" olarak guncellendi
- [x] Depodaki 795 adet sevkiyata kapali
- [x] Izlenebilirlik ile etkilenen musteriler (MarketZincir) tespit edildi
- [x] Hammadde geriye izleme yapildi (SUT-20260408-001)
- [x] Aksiyonlar kayit altina alindi

> **BILINEN KISITLAMA:** Quvex'te otomatik HACCP CCP alarm sistemi yoktur.
> Geri cagirma sureci manuel olarak baslatilir, sistem izlenebilirlik raporlarini saglar.

---

### Adim 31: Geri Cagirma — Musteri Iadesi Kaydi

**Ekran:** Satis → Iade → Yeni Iade
**Islem:** MarketZincir'den geri donen urunleri kaydet

**Veri:**

| Alan | Deger |
|------|-------|
| Iade No | IA-2026-0023 |
| Musteri | MarketZincir A.S. |
| Irsaliye Ref. | IR-2026-0112 |
| Iade Nedeni | Geri Cagirma — NCR-2026-0015 |

| Kalem | Lot | Gonderilen | Iade Edilen | Satilmis |
|-------|-----|------------|------------|----------|
| Dogal Yogurt 200ml | YGT-20260402-001 | 320 adet | 285 adet | 35 adet (tuketilmis) |
| Dogal Yogurt 200ml | YGT-20260405-001 | 180 adet | 180 adet | 0 adet |

**Toplam Iade:** 465 adet
**Tuketilen (satilmis, geri dondurulemeyen):** 35 adet

**Beklenen Sonuc:** Iade kaydi olusturulur, stok ve cari hesap guncellenir.
**Dogrulama:**
- [x] Iade miktari stoga BLOKE olarak giris yapti
- [x] Musteri cari hesabindan 465 x 14,50 = 6.742,50 TL + KDV alacak kaydedildi
- [x] NCR ile iade iliskilendirildi
- [x] Tuketilen 35 adet icin takip notu olusturuldu

---

### Adim 32: Imha Karari ve Kaydi

**Ekran:** Kalite Yonetimi → NCR → NCR-2026-0015 → Karar
**Islem:** Bloke urunler icin imha karari ver ve kaydet

**Veri:**

| Alan | Deger |
|------|-------|
| NCR | NCR-2026-0015 |
| Karar | IMHA |
| Imha Edilecek Miktar | 795 (depo) + 465 (iade) = 1.260 adet |
| Imha Yontemi | Lisansli atik bertaraf tesisi |
| Imha Tarihi | 2026-04-16 |
| Imha Tutanagi | Foto + tutanak eklenecek |
| Onaylayan | Genel Mudur |

**Mali Etki:**

| Kalem | Tutar |
|-------|-------|
| Uretim Maliyeti (975 adet) | ~6.500 TL |
| Iade Alacak Notu | 7.416,75 TL (465 adet + KDV) |
| Imha Maliyeti | ~800 TL |
| Toplam Zarar | ~14.716,75 TL |

**Beklenen Sonuc:** Imha karari kayda alinir, bloke stok dusulur.
**Dogrulama:**
- [x] Bloke stok sifira dusuruldu
- [x] Imha tutanagi NCR'ye eklendi
- [x] Mali kayip raporu goruntuleniyor
- [x] NCR durumu: "Kapatma Bekliyor"

---

### Adim 33: Kok Neden Analizi ve Duzeltici Faaliyet (CAPA)

**Ekran:** Kalite Yonetimi → CAPA → Yeni CAPA
**Islem:** NCR-2026-0015 icin kok neden analizi yap ve duzeltici faaliyet planla

**Veri:**

| Alan | Deger |
|------|-------|
| CAPA No | CAPA-2026-0008 |
| NCR Ref. | NCR-2026-0015 |
| Tip | Duzeltici Faaliyet |
| Oncelik | Kritik |
| Sorumlu | Kalite Muduru |
| Hedef Tamamlanma | 2026-04-30 |

**Kok Neden (5 Neden Analizi):**

```
Neden 1: Listeria monocytogenes mamul urunde tespit edildi.
  Neden 2: Pastorizasyon sonrasi kontaminasyon olustu.
    Neden 3: Kulturleme tanki CIP (Clean-in-Place) yetersiz yapilmis.
      Neden 4: CIP proseduru guncellenmemis (eski deterjan konsantrasyonu).
        Neden 5: CIP validasyonu son 6 aydir yapilmamis.
          → KOK NEDEN: CIP validasyon periyodu asimi
```

**Duzeltici Faaliyetler:**

| # | Faaliyet | Sorumlu | Termin |
|---|----------|---------|--------|
| 1 | CIP proseduru guncelle (deterjan konsantrasyonu arttir) | Uretim Sefi | 20.04.2026 |
| 2 | CIP validasyonu yap (swab testi) | Kalite Muduru | 22.04.2026 |
| 3 | CIP validasyon periyodunu 3 aya indirge | Kalite Muduru | 25.04.2026 |
| 4 | Tum personele Listeria onleme egitimi ver | Kalite Muduru | 30.04.2026 |
| 5 | Cevre numune plani olustur (aylik) | Kalite Muduru | 30.04.2026 |

**Beklenen Sonuc:** CAPA kaydi olusturuldu, kok neden ve duzeltici aksiyonlar tanimlandi.
**Dogrulama:**
- [x] CAPA — NCR iliskisi kuruldu
- [x] 5 Neden analizi kayitli
- [x] Duzeltici faaliyet takvimi belirlenmis
- [x] CAPA durumu: "Acik — Takipte"

---

### Adim 34: Maliyet Analizi — Yogurt Partisi

**Ekran:** Raporlar → Uretim Maliyet Analizi
**Islem:** YGT-20260409-001 partisinin maliyet dagilimini incele

**Beklenen Rapor:**

| Maliyet Kalemi | Birim | Miktar | Birim Maliyet | Toplam |
|----------------|-------|--------|---------------|--------|
| Cig Inek Sutu | litre | 224,4 | 18,50 TL | 4.151,40 TL |
| Yogurt Kulturleri | gram | 44 | 2,50 TL | 110,00 TL |
| Yogurt Kabi 200ml | adet | 1030 | 0,85 TL | 875,50 TL |
| Al. Kapak Folyo | adet | 1030 | 0,25 TL | 257,50 TL |
| Yogurt Etiketi | adet | 975 | 0,15 TL | 146,25 TL |
| **Hammadde Toplam** | | | | **5.540,65 TL** |
| Iscilik (direkt) | saat | 12 | 85,00 TL | 1.020,00 TL |
| Enerji (pastorizator + sogutma) | — | — | — | 320,00 TL |
| Genel Uretim Gideri | — | — | — | 450,00 TL |
| **Toplam Uretim Maliyeti** | | | | **7.330,65 TL** |

| Analiz | Deger |
|--------|-------|
| Net Uretim | 975 adet |
| Birim Maliyet | 7.330,65 / 975 = 7,52 TL/adet |
| Satis Fiyati | 14,50 TL/adet |
| Brut Kar Marji | (14,50 - 7,52) / 14,50 = %48,1 |
| Fire Maliyeti | 25 adet x 7,52 = 188,00 TL |

**Beklenen Sonuc:** Maliyet analizi raporu goruntulenir.
**Dogrulama:**
- [x] Hammadde, iscilik, enerji ve genel gider kalemleri ayri gorunuyor
- [x] Birim maliyet hesaplamasi dogru
- [x] Kar marji hesaplamasi dogru
- [x] Fire maliyeti ayri goruntuleniyor
- [x] Recall maliyeti (Adim 32) ayri rapor olarak mevcut

---

### Adim 35: Tedarikci Degerlendirme

**Ekran:** Tedarikci Yonetimi → Degerlendirme → Yeni Degerlendirme
**Islem:** Yesil Vadi Sut Ciftligi performans degerlendirmesi

**Veri:**

| Alan | Deger |
|------|-------|
| Tedarikci | Yesil Vadi Sut Ciftligi A.S. |
| Donem | Q2 2026 (Nisan - Haziran) |
| Degerlendirme Tarihi | 2026-04-11 |
| Degerlendiren | Kalite Muduru + Satin Alma Uzmani |

**Degerlendirme Kriterleri:**

| Kriter | Agirlik | Puan (1-10) | Agirlikli Puan |
|--------|---------|-------------|----------------|
| Kalite (giris muayene gecme orani) | %30 | 8 | 2,40 |
| Zamaninda Teslimat | %20 | 9 | 1,80 |
| Fiyat Rekabetciligi | %15 | 7 | 1,05 |
| Soguk Zincir Uyumu | %15 | 9 | 1,35 |
| ISO 22000 Sertifika Gecerliligi | %10 | 10 | 1,00 |
| Iletisim ve Cozum Hizi | %10 | 8 | 0,80 |
| **TOPLAM** | **%100** | — | **8,40 / 10** |

**Degerlendirme Sinifi:**

| Puan Araligi | Sinif | Karar |
|-------------|-------|-------|
| 9,0 - 10,0 | A (Mukemmel) | Tercihli tedarikci |
| 7,0 - 8,9 | B (Iyi) | Onaylanmis tedarikci |
| 5,0 - 6,9 | C (Kabul Edilebilir) | Izleme altinda |
| 0,0 - 4,9 | D (Yetersiz) | Tedarik durdurulur |

**Sonuc:** 8,40 puan → **Sinif B (Iyi) — Onaylanmis Tedarikci**

**Beklenen Sonuc:** Tedarikci degerlendirmesi tamamlandi, sonuc kaydedildi.
**Dogrulama:**
- [x] Agirlikli puan hesaplamasi dogru (8,40)
- [x] Degerlendirme sinifi "B — Iyi" olarak belirlenmis
- [x] Tedarikci kartinda degerlendirme gecmisi gorunuyor
- [x] Onceki donem degerlendirmeleri ile karsilastirma yapilabilir

---

### Adim 36: Recall Sonrasi Tedarikci Ozel Degerlendirmesi

**Ekran:** Tedarikci Yonetimi → Degerlendirme
**Islem:** Listeria olayi sonrasi tedarikciye ozel degerlendirme notu ekle

**Veri:**

| Alan | Deger |
|------|-------|
| Tedarikci | Yesil Vadi Sut Ciftligi A.S. |
| Ozel Not | Recall NCR-2026-0015 — Listeria kontaminasyonu. Kok neden CIP prosedurumuzde bulunsa da, tedarikci hammaddesi de arastirilmali. |
| Ek Aksiyon | Tedarikci denetimi planla (Mayis 2026) |
| Onerilen Durum | Sinif B korunur, denetim sonucuna gore yeniden degerlendirilecek |

**Beklenen Sonuc:** Tedarikci kartina ozel recall notu eklendi.
**Dogrulama:**
- [x] Not tedarikci gecmisinde gorunuyor
- [x] Denetim plani takvime eklenmis

---

### Adim 37: Kapatis Kontrolleri — Stok Tutarliligi

**Ekran:** Depo Yonetimi → Stok Raporu
**Islem:** Tum islemler sonrasi stok tutarliligini dogrula

**Beklenen Stok Durumu:**

| Urun | Lot | Hareket | Miktar | Kalan |
|------|-----|---------|--------|-------|
| Cig Inek Sutu | SUT-20260408-001 | Giris: 500 lt | — | — |
| | | Uretime cikis: 224,4 lt | — | 275,6 lt |
| Dogal Yogurt 200ml | YGT-20260409-001 | Uretim: 975 adet | — | — |
| | | Sevkiyat: 180 adet | — | — |
| | | Bloke + Imha: 795 adet | — | 0 adet |
| Dogal Yogurt 200ml | YGT-20260402-001 | Sevkiyat: 320 adet | — | — |
| | | Iade: 285 adet (BLOKE) | — | — |
| | | Imha: 285 adet | — | 0 adet |
| Dogal Yogurt 200ml | YGT-20260405-001 | Sevkiyat: 180 adet | — | — |
| | | Iade: 180 adet (BLOKE) | — | — |
| | | Imha: 180 adet | — | 0 adet |
| Bugday Unu | UN-20260408-001 | Giris: 2000 kg | — | 2000 kg |
| Kristal Toz Seker | SEK-20260408-001 | Giris: 500 kg | — | 500 kg |

**Beklenen Sonuc:** Stok kayitlari tum girdi/cikti hareketleri ile tutarli.
**Dogrulama:**
- [x] Hammadde stoklari giris - cikis = kalan formulune uygun
- [x] Mamul stoklari uretim - sevkiyat - imha = kalan formulune uygun
- [x] Bloke/imha edilen lotlar sifir stokta
- [x] FIFO sirasi bozulmamis
- [x] Negatif stok yok

---

### Adim 38: Kapatis Kontrolleri — Mali Tutarlilik

**Ekran:** Finans → Raporlar → Cari Hesap Ozeti
**Islem:** Musteri ve tedarikci cari hesap bakiyelerini dogrula

**Beklenen Bakiyeler:**

| Hesap | Borc | Alacak | Bakiye |
|-------|------|--------|--------|
| **Tedarikciler:** | | | |
| Yesil Vadi Sut Ciftligi | — | 10.175,00 TL (9.250 + KDV) | -10.175,00 TL (borclu) |
| Anadolu Un Sanayi | — | 66.000,00 TL (60.000 + KDV) | -66.000,00 TL (borclu) |
| **Musteriler:** | | | |
| MarketZincir A.S. | 7.975,00 TL (fatura) | 7.416,75 TL (iade alacak) | 558,25 TL (alacakli) |

**Aciklama:**
- MarketZincir faturasi: 500 adet x 14,50 TL x 1,10 KDV = 7.975,00 TL
- MarketZincir iade: 465 adet x 14,50 TL x 1,10 KDV = 7.416,75 TL
- Net alacak: 7.975,00 - 7.416,75 = 558,25 TL (tuketilen 35 adet bedeli)

**Beklenen Sonuc:** Cari hesaplar tutarli.
**Dogrulama:**
- [x] Tedarikci borclari dogru hesaplanmis
- [x] Musteri cari hesabi fatura - iade = net bakiye formulune uygun
- [x] KDV hesaplamalari dogru (%10 gida)
- [x] Imha maliyeti gider hesabina yansimis

---

## ROL BAZLI ERISIM TESTLERI

### Test R1: Kalite Muduru Erisimi

**Giris:** kalite@tazegida.com.tr / KaliteTaze2026!@#
**Beklenen Erisim:**

| Modul | Erisim | Dogrulama |
|-------|--------|-----------|
| HACCP Kontrol Planlari | Goruntuleme + Duzenleme | [x] CCP tanimlari gorunuyor |
| Giris Muayene | Goruntuleme + Duzenleme | [x] Muayene formu aciyor |
| Proses Muayene | Goruntuleme + Duzenleme | [x] Uretim arasi kontrol |
| Son Muayene | Goruntuleme + Duzenleme | [x] Kabul/Red karari verebilir |
| NCR (Uygunsuzluk) | Goruntuleme + Duzenleme | [x] NCR olusturabilir |
| CAPA | Goruntuleme + Duzenleme | [x] CAPA olusturabilir |
| Izlenebilirlik | Goruntuleme | [x] Lot sorgulama yapabili |
| Tedarikci Degerlendirme | Goruntuleme + Duzenleme | [x] Puan girebilir |
| Uretim Emri | ERISIM YOK | [x] 403 veya yonlendirme |
| Satin Alma | ERISIM YOK | [x] 403 veya yonlendirme |
| Finans/Fatura | ERISIM YOK | [x] 403 veya yonlendirme |

---

### Test R2: Depo Sorumlusu Erisimi

**Giris:** depo@tazegida.com.tr / DepoTaze2026!@#
**Beklenen Erisim:**

| Modul | Erisim | Dogrulama |
|-------|--------|-----------|
| Mal Kabul | Goruntuleme + Duzenleme | [x] Teslim alim yapabilir |
| Stok Yonetimi | Goruntuleme + Duzenleme | [x] Giris/cikis yapabilir |
| Lot Yonetimi | Goruntuleme + Duzenleme | [x] Lot durumu degistirebilir |
| FIFO Raporu | Goruntuleme | [x] Siralama goruntuleniyor |
| Sevkiyat | Goruntuleme + Duzenleme | [x] Sevkiyat hazirlayabilir |
| Depo Sicaklik Kaydi | Goruntuleme + Duzenleme | [x] Manuel sicaklik girisi |
| HACCP | ERISIM YOK | [x] 403 veya yonlendirme |
| NCR/CAPA | ERISIM YOK | [x] 403 veya yonlendirme |
| Finans | ERISIM YOK | [x] 403 veya yonlendirme |

---

### Test R3: Uretim Operatoru Erisimi (ShopFloor Terminal)

**Giris:** operator@tazegida.com.tr / OperatorTaze2026!@#
**Beklenen Erisim:**

| Modul | Erisim | Dogrulama |
|-------|--------|-----------|
| ShopFloor Terminal | Goruntuleme + Duzenleme | [x] Atanmis is emrini goruyor |
| Operasyon Kaydi | Duzenleme | [x] Baslat/Durdur/Bitir yapabilir |
| CCP Olcum Girisi | Duzenleme | [x] Sicaklik/sure girebilir |
| Is Emri Olusturma | ERISIM YOK | [x] Sadece mevcut emirleri goruyor |
| Kalite | ERISIM YOK | [x] 403 veya yonlendirme |
| Stok | ERISIM YOK | [x] 403 veya yonlendirme |
| Finans | ERISIM YOK | [x] 403 veya yonlendirme |

---

## NEGATIF TEST SENARYOLARI

### N1: Sicaklik Limiti Asilmasi — Mal Kabul Red

**Islem:** Sut teslimati sicakligi 7,5°C olarak girilir (limit: max 4°C)
**Beklenen:**
- Sistem UYARI gosterir: "Sicaklik limiti asildi! Kabul edilemez."
- Mal kabul durumu: "RED" olarak kaydedilir
- Stoga giris ENGELLENIR
- NCR otomatik olarak olusturulur (veya olusturulmasi icin uyari verilir)

### N2: Raf Omru Dolmus Urun Sevkiyati

**Islem:** SKT'si gecmis (20.03.2026) bir yogurt lotunu sevkiyata eklemeye calis
**Beklenen:**
- Sistem UYARI: "Bu lotun son kullanma tarihi gecmistir. Sevk edilemez."
- Sevkiyat listesine EKLENMEZ
- Lot durumu otomatik olarak "SURESI DOLMUS" olarak guncellenir

### N3: FIFO Ihlali Denemesi

**Islem:** Eski tarihli lot varken yeni tarihli lotu sevkiyata secmeye calis
**Beklenen:**
- Sistem UYARI: "FIFO kurali ihlali! Lot YGT-20260402-001 (SKT: 23.04.2026) once sevk edilmelidir."
- Kullanici onay vermeden yeni lot SECILEMEZ (veya uyari/force secenek)

### N4: CCP Kritik Limit Asilmasi — Pastorizasyon

**Islem:** Pastorizasyon sicakligini 68°C olarak gir (limit: min 72°C)
**Beklenen:**
- Sistem UYARI: "CCP-1 kritik limit altinda! 68°C < 72°C"
- Operasyon "GECTI" olarak ISARETLENEMEZ
- Duzeltici faaliyet notu zorunlu hale gelir
- CCP kaydi "BASARISIZ" olarak saklanir

### N5: Lot Numarasi Olmadan Uretim Baslangici

**Islem:** Lot zorunlu bir hammadde icin lot numarasi girmeden uretim emrine eklemeye calis
**Beklenen:**
- Sistem HATA: "Bu malzeme icin lot numarasi zorunludur."
- Uretim emri KAYDEDILEMEZ

### N6: Stok Yetersizligi ile Uretim Emri

**Islem:** 5000 adet yogurt icin uretim emri ac (stokta yeterli sut yok)
**Beklenen:**
- Sistem UYARI: "Cig Inek Sutu icin yeterli stok yok. Gerekli: 1100 lt, Mevcut: 275,6 lt"
- Uretim emri "Malzeme Eksik" durumuna duser

### N7: Yetkisiz Erisim Denemesi

**Islem:** Operator hesabiyla NCR olusturmaya calis
**Beklenen:**
- 403 Forbidden veya "Bu isleme yetkiniz bulunmamaktadir" mesaji
- Islem loglara kaydedilir (SecurityAuditService)

---

## BILINEN KISITLAMALAR

| # | Kisitlama | Aciklama | Gecici Cozum |
|---|-----------|----------|--------------|
| 1 | Sicaklik/nem sensor entegrasyonu yok | IoT cihazlarindan otomatik veri cekilemez | Manuel giris, operator olcum kaydeder |
| 2 | HACCP CCP otomatik alarm yok | Kritik limit asildiginda otomatik bildirim gonderilmez | Manuel kontrol, CCP formunda uyari mesaji |
| 3 | Allerjen matrisi modulu yok | Ayri bir allerjen yonetim ekrani bulunmaz | Urun kartinin not alanina yazilir |
| 4 | Barkod/QR okuyucu entegrasyonu yok | Fiziksel barkod tarayici ile direk entegrasyon yok | Manuel lot/barkod girisi |
| 5 | Soguk zincir izleme yok | Tasima sirasinda gercek zamanli sicaklik takibi yok | Yuklemede ve teslimde manuel olcum |
| 6 | Laboratuvar bilgi yonetim sistemi (LIMS) entegrasyonu yok | Mikrobiyoloji sonuclari otomatik gelmiyor | Manuel sonuc girisi |
| 7 | Uretim hatti PLC entegrasyonu yok | Makine parametreleri otomatik cekilmez | Operator ShopFloor terminalden girer |
| 8 | CIP (Clean-in-Place) kayit modulu yok | Temizlik validasyon kayitlari ayri tutulmaz | Not alanina veya harici dokumana kaydedilir |

---

## GIDA GUVENLIGI OZEL KONTROL LISTESI

Bu kontrol listesi ISO 22000 ve HACCP gereksinimlerine yonelik Quvex ERP uzerinden yapilabilecek kontrolleri icerir.

| # | Kontrol | Quvex Modulu | Durum |
|---|---------|-------------|-------|
| 1 | Hammadde lot izlenebilirligi | Izlenebilirlik | Destekleniyor |
| 2 | CCP kaydi ve dokumantasyonu | Kalite → Kontrol Plani | Destekleniyor (manuel) |
| 3 | Giris kalite muayenesi | Kalite → Giris Muayene | Destekleniyor |
| 4 | FIFO stok yonetimi | Depo → FIFO | Destekleniyor |
| 5 | Raf omru takibi | Urun + Stok | Destekleniyor |
| 6 | Tedarikci sertifika takibi | Tedarikci Yonetimi | Not alaninda |
| 7 | Geri cagirma (Recall) sureci | NCR + Izlenebilirlik | Manuel baslatma |
| 8 | Allerjen yonetimi | Urun Karti (not alani) | Sinirli |
| 9 | Uretim kaydi (sicaklik, sure) | Uretim → ShopFloor | Manuel giris |
| 10 | Kimyasal analiz (pH, yag, protein) | Kalite → Muayene | Destekleniyor (manuel) |
| 11 | Mikrobiyoloji sonuclari | Kalite → Muayene | Manuel giris |
| 12 | Imha kaydi | NCR → Karar | Destekleniyor |
| 13 | CAPA (Duzeltici/Onleyici Faaliyet) | CAPA modulu | Destekleniyor |
| 14 | Tedarikci degerlendirme | Tedarikci → Degerlendirme | Destekleniyor |
| 15 | Maliyet izleme | Raporlar → Maliyet | Destekleniyor |

---

## TEST SONUC OZETI SABLONU

| Kategori | Toplam Adim | Basarili | Basarisiz | Atlanan | Basari Orani |
|----------|-------------|----------|-----------|---------|-------------|
| Tedarikci & Tanim (1-6) | 6 | _ | _ | _ | _% |
| HACCP & Recete (7-8) | 2 | _ | _ | _ | _% |
| Satin Alma & Mal Kabul (9-11) | 3 | _ | _ | _ | _% |
| Giris Kalite (12-13) | 2 | _ | _ | _ | _% |
| Uretim (14-21) | 8 | _ | _ | _ | _% |
| Son Muayene (22) | 1 | _ | _ | _ | _% |
| Depo & FIFO (23-24) | 2 | _ | _ | _ | _% |
| Sevkiyat & Fatura (25-27) | 3 | _ | _ | _ | _% |
| Izlenebilirlik (28-29) | 2 | _ | _ | _ | _% |
| Geri Cagirma (30-33) | 4 | _ | _ | _ | _% |
| Maliyet & Tedarikci Deg. (34-36) | 3 | _ | _ | _ | _% |
| Kapatis Kontrolleri (37-38) | 2 | _ | _ | _ | _% |
| Rol Bazli Testler (R1-R3) | 3 | _ | _ | _ | _% |
| Negatif Testler (N1-N7) | 7 | _ | _ | _ | _% |
| **TOPLAM** | **46** | _ | _ | _ | _% |

---

## EK-A: TEST VERILERI REFERANS TABLOSU

### Tedarikci Verileri

| Kod | Firma | Vergi No | Sertifika |
|-----|-------|----------|-----------|
| T-001 | Yesil Vadi Sut Ciftligi A.S. | 1234567890 | ISO 22000 |
| T-002 | Anadolu Un Sanayi Ltd. Sti. | 9876543210 | ISO 22000, Helal |

### Urun/Malzeme Kodlari

| Kod | Urun | Birim | Lot | Raf Omru |
|-----|------|-------|-----|----------|
| HM-SUT-001 | Cig Inek Sutu | litre | Evet | 3 gun |
| HM-UN-001 | Bugday Unu (Tip 550) | kg | Evet | 180 gun |
| HM-SEK-001 | Kristal Toz Seker | kg | Evet | 730 gun |
| HM-KUL-001 | Yogurt Kulturleri | gram | Evet | 90 gun |
| AM-KAP-001 | Yogurt Kabi 200ml | adet | Hayir | — |
| AM-KAP-002 | Al. Kapak Folyo | adet | Hayir | — |
| AM-ETK-001 | Yogurt Etiketi | adet | Hayir | — |
| HM-YAG-001 | Tereyagi | kg | Evet | 90 gun |
| HM-TUZ-001 | Iyotlu Sofra Tuzu | kg | Evet | 1095 gun |
| MU-YGT-001 | Dogal Yogurt 200ml | adet | Evet | 21 gun |

### Lot Numaralari

| Lot No | Malzeme | Tarih | Durum |
|--------|---------|-------|-------|
| SUT-20260408-001 | Cig Inek Sutu | 08.04.2026 | Serbest |
| UN-20260408-001 | Bugday Unu | 08.04.2026 | Serbest |
| SEK-20260408-001 | Kristal Toz Seker | 08.04.2026 | Serbest |
| KUL-20260401-001 | Yogurt Kulturleri | 01.04.2026 | Serbest |
| YGT-20260402-001 | Dogal Yogurt | 02.04.2026 | Imha Edildi |
| YGT-20260405-001 | Dogal Yogurt | 05.04.2026 | Imha Edildi |
| YGT-20260409-001 | Dogal Yogurt | 09.04.2026 | Imha Edildi |

### CCP Referans Limitleri

| CCP | Parametre | Alt Limit | Ust Limit | Birim |
|-----|-----------|-----------|-----------|-------|
| CCP-1 | Pastorizasyon Sicakligi | 72 | — | °C |
| CCP-1 | Pastorizasyon Suresi | 15 | — | saniye |
| CCP-2 | Sogutma Son Sicaklik | — | 4 | °C |
| CCP-2 | Sogutma Suresi | — | 120 | dakika |
| CCP-3 | Depo Sicakligi | 2 | 6 | °C |

---

## EK-B: ISO 22000 / HACCP TERMINOLOJI

| Terim | Aciklama |
|-------|----------|
| CCP (Critical Control Point) | Tehlikenin onlendigi, elimine edildigi veya kabul edilebilir seviyeye indirildigi kontrol noktasi |
| OPRP (Operational Prerequisite Programme) | Operasyonel on kosul programi — CCP olmayan ama gida guvenligi icin gerekli kontrol |
| HACCP | Tehlike Analizi ve Kritik Kontrol Noktalari (Hazard Analysis Critical Control Points) |
| Recall | Geri cagirma — piyasaya surulmus uygunsuz urunun toplanmasi |
| CoC | Certificate of Conformance — Uygunluk Sertifikasi |
| NCR | Non-Conformance Report — Uygunsuzluk Raporu |
| CAPA | Corrective and Preventive Action — Duzeltici ve Onleyici Faaliyet |
| FIFO | First In, First Out — Ilk giren ilk cikar stok yonetimi |
| CIP | Clean-in-Place — Yerinde temizlik sistemi |
| SKT | Son Kullanma Tarihi |
| AQL | Acceptable Quality Level — Kabul edilebilir kalite seviyesi |
| TBS | Toplam Bakteri Sayisi |
| kob/ml | Koloni olusturan birim / mililitre |

---

**Doküman Sonu**
**Versiyon:** 1.0
**Son Guncelleme:** 2026-04-10
**Hazirlayan:** QA Ekibi — Quvex ERP
