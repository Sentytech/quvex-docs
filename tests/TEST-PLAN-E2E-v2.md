# Quvex ERP — Uctan Uca Test Plani v2
# Bagimliliklara gore dogru sira

---

## FAZ 0: Tenant & Giris (On kosul)
```
0.1  Register sayfasi → Yeni tenant olustur
     - Firma adi, email, sifre (min 8 hane), sektor sec (CNC)
0.2  Giris yap (yeni tenant ile)
0.3  Onboarding wizard → sektor secimi (CNC secilmis olmali)
0.4  Ana sayfa gorunuyor mu? Menu sektor profiline uygun mu?
```

## FAZ 1: Temel Tanimlar (Hicbir seye bagimli degil)
```
1.1  Ayarlar → Birimler → Ekle: Adet, Kg, Metre, Litre, Takim
1.2  Ayarlar → Roller → Sablon ile olustur:
     - "Yonetici" → Yonetici sablonu sec (tum Goruntule + Kaydet)
     - "Operator" → Operator sablonu sec (Uretim + Stok goruntule)
     - "Muhasebe" → Muhasebe sablonu sec (Finans + Satis goruntule)
1.3  Ayarlar → Is Emri Adimlari (WorkOrderSteps) → Ekle:
     - KESIM / Kesim
     - TORNALAMA / Tornalama
     - TASLAMA / Taslama
     - FREZELEME / Frezeleme
     - DELME / Delme
     - KAYNAK / Kaynak
     - MONTAJ / Montaj
     - BOYAMA / Boyama
     - KALITE / Kalite Kontrol
     - PAKETLEME / Paketleme
     (Bu adimlar is emri sablonunda dropdown olarak gelecek)
```

## FAZ 2: Makine & Personel (Birim + Rol gerekli)
```
2.1  Uretim → Makineler → Ekle:
     - CNC-01 / M001 / Torna Tezgahi
     - CNC-02 / M002 / Freze Tezgahi
     - TASLAMA-01 / M003 / Taslama
2.2  Ayarlar → Kullanicilar → Ekle:
     - Operator 1: Ali Usta / ali@test.com / Ali12345! / Rol: Operator
     - Operator 2: Veli Demir / veli@test.com / Veli1234! / Rol: Operator
     - Muhasebe: Ayse Hanim / ayse@test.com / Ayse1234! / Rol: Muhasebe
```

## FAZ 3: Is Emri Sablonu (Is Adimi + Makine + Kullanici gerekli)
```
3.1  Ayarlar → Is Emri Sablonlari → "CNC Mil Uretimi" olustur:
     - Adim 1: Kesim (Makine: CNC-01, Kullanici: Ali Usta, Sure: 30dk, Kalite: Hayir, Onkosul: -)
     - Adim 2: Tornalama (Makine: CNC-01, Kullanici: Ali Usta, Sure: 45dk, Kalite: Hayir, Onkosul: Adim 1)
     - Adim 3: Taslama (Makine: TASLAMA-01, Kullanici: Veli Demir, Sure: 20dk, Kalite: Hayir, Onkosul: Adim 2)
     - Adim 4: Kalite Kontrol (Makine: -, Kullanici: -, Sure: 15dk, Kalite: Evet, Onkosul: Adim 3)
3.2  Kaydet → Listede gorunuyor mu?
3.3  Duzenle → Adimlar, makine atamalari ve kullanici atamalari dogru yuklenmiş mi?
```

## FAZ 4: Depo & Stok Yapisi (Birim gerekli)
```
4.1  Stok → Depolar → Ekle:
     - ANA / Ana Depo
     - HAMMADDE / Hammadde Deposu
     - MAMUL / Mamul Deposu
4.2  Stok → Urun & Malzeme → Malzeme (STOCK) ekle:
     - S001 / Celik Cubuk Ø20mm / Kg / Min:50 Max:500 / Alis: 45 TL
     - S002 / Rulman 6205 / Adet / Min:20 Max:200 / Alis: 35 TL
     - S003 / Conta Seti / Takim / Min:10 Max:100 / Alis: 25 TL
4.3  Stok → Urun & Malzeme → Urun (PRODUCTION_MATERIAL) ekle:
     - PRD-001 / CNC Islenmis Mil / Adet / Satis: 500 TL
       → Is emri sablonu: "CNC Mil Uretimi" sec
     - PRD-002 / Hidrolik Silindir Govdesi / Adet / Satis: 1.200 TL
4.4  Stok → Stok Giris/Cikis → Giris fisi:
     - Celik Cubuk 200 Kg → Hammadde Deposu
     - Rulman 50 Adet → Ana Depo
     - Conta Seti 30 Takim → Ana Depo
4.5  KONTROL: Stok listesinde fiili stok dogru mu?
```

## FAZ 5: Musteri & Tedarikci (Bagimsizdır)
```
5.1  Satis → Musteriler → Ekle:
     - ASELSAN A.S. / Savunma / Ankara / VKN: 1234567890
       → Adres + Iletisim kisi ekle
     - TEK MAKINA LTD. / Makina / Istanbul
5.2  Satinalma → Tedarikciler → Ekle:
     - ERDEMIR A.S. / Celik / Eregli
       → Adres + Iletisim kisi ekle
     - RULMAN SAN. / Rulman / Konya
```

## FAZ 6: Finans Kurulumu (Bagimsizdir)
```
6.1  Finans → Kasa/Banka → Hesap olustur:
     - KAS-01 / Ana Kasa / Kasa / TRY / Acilis: 10.000 TL
     - BNK-01 / Ziraat Bankasi / Banka / TRY / Acilis: 50.000 TL
       → IBAN gir, Sube: Merkez
6.2  KONTROL: Ozet kartlar: Kasa 10.000 + Banka 50.000 = Toplam 60.000?
```

## FAZ 7: Satis Sureci (Musteri + Urun gerekli)
```
7.1  Satis → Teklif → Yeni Teklif:
     - Musteri: ASELSAN
     - Kalem 1: CNC Mil x15 @ 500 TL
     - Kalem 2: Hidrolik Silindir x5 @ 1.200 TL
     - Toplam: 13.500 TL + KDV
7.2  Kaydet → Teklif No kontrol (T2026-XXXXX)
7.3  "Gonderildi" durumuna gecir
7.4  "Kabul Edildi" → Siparis Olustur:
     - Siparis No gir, "Uretime Hazir Siparis Olustur"
7.5  KONTROL: Satis → Satislar → Siparis gorunuyor mu?
```

## FAZ 8: Satinalma Sureci (Tedarikci + Malzeme gerekli)
```
8.1  Satinalma → Siparis → Yeni:
     - Tedarikci: ERDEMIR
     - Kalem: Celik Cubuk 300 Kg @ 45 TL = 13.500 TL
8.2  Siparisi "Gonderildi" yap
8.3  Mal geldiginde "Teslim Al"
8.4  KONTROL: Stok → Celik Cubuk: 200 + 300 = 500 Kg?
```

## FAZ 9: Uretim (Siparis + Is Emri Sablonu gerekli)
```
9.1  Uretim → Is Emirleri → Siparis otomatik uretim emri olusturmus mu?
9.2  CNC Mil uretim emrini ac → Uretim Durumu:
     - Progress stepper gorunuyor mu?
     - "Sonraki Adim" butonu var mi?
9.3  Adim adim tamamla:
     - Kesim → miktar 15 → Tamamla
     - Tornalama → Tamamla
     - Taslama → Tamamla
     - Kalite Kontrol → Tamamla
9.4  KONTROL: Uretim durumu "Tamamlandi" mi?
```

## FAZ 10: ShopFloor Terminal (Operator kullanici + Uretim gerekli)
```
10.1 Cikis yap → operator@test.com ile giris
10.2 Uretim → Saha Terminali
10.3 Makine sec: CNC-01
10.4 Is listesinden bir is sec
10.5 BASLAT → sure sayaci calisiyor mu?
10.6 NumPad ile miktar gir
10.7 DURDUR → Durus sebebi: "Malzeme Bekleme" sec
10.8 BASLAT → devam
10.9 TAMAMLA
10.10 Vardiya ozeti kontrol
10.11 Admin ile tekrar giris
```

## FAZ 11: Kalite (Urun + Tedarikci + Makine gerekli)
```
11.1 Kalite → NCR → Yeni:
     - Urun: CNC Mil, Ciddiyet: Orta
     - Aciklama: "Olcu toleransi disi, Ø20 yerine Ø20.15"
11.2 NCR "Inceleniyor" durumuna gecir
11.3 Kalite → CAPA → NCR'dan duzeltici faaliyet:
     - Kok neden: Takim asinmasi
     - Aksiyon: Takim degisim periyodu guncelle
11.4 Kalite → Giris Kontrol → Yeni:
     - Tedarikci: ERDEMIR, Malzeme: Celik Cubuk
     - Sonuc: Gecti
11.5 Kalite → Kalibrasyon → Ekle:
     - Mikrometre MK-001, Son: bugun, Sonraki: +6 ay
11.6 Kalite → Tedarikci Degerlendirme → ERDEMIR:
     - Kalite: %95, Teslimat: %90
```

## FAZ 12: Faturalama (Kasa/Banka + Musteri + Urun gerekli)
```
12.1 Satis → Faturalar → Satis Faturasi:
     - Musteri: ASELSAN
     - Kalem: CNC Mil x15 @ 500 TL = 7.500 + %20 KDV = 9.000 TL
12.2 Faturay "Gonderildi" yap
12.3 KONTROL: Cari bakiye → ASELSAN 9.000 TL borclu?
12.4 Fatura detay → Odeme ekle:
     - 5.000 TL, Nakit, Ana Kasa sec
12.5 KONTROL: Kasa 10.000 + 5.000 = 15.000?
12.6 KONTROL: Cari: 9.000 - 5.000 = 4.000 kalan?
12.7 Ikinci odeme: 4.000 TL, Havale, Ziraat sec
12.8 KONTROL: Fatura "Odendi"? Cari 0?
```

## FAZ 13: Alis Faturasi & Odeme (Tedarikci + Kasa/Banka gerekli)
```
13.1 Satis → Faturalar → Alis Faturasi:
     - Tedarikci: ERDEMIR
     - Kalem: Celik Cubuk 300 Kg @ 45 TL + KDV = 16.200 TL
13.2 "Gonderildi" yap
13.3 KONTROL: Cari → ERDEMIR'e 16.200 borcluyuz?
13.4 Odeme yap: 16.200 TL, Ziraat
13.5 KONTROL: Banka bakiye dustu mu? Cari 0?
```

## FAZ 14: Iade Sureci
```
14.1 Satis → Faturalar → Iade Faturasi:
     - ASELSAN, CNC Mil x2 iade = 1.000 + KDV = 1.200 TL
14.2 "Gonderildi" yap
14.3 KONTROL: Cari → ASELSAN'a 1.200 borclu muyuz?
```

## FAZ 15: Kasa/Banka Islemleri
```
15.1 Finans → Kasa/Banka → Transfer:
     - Kasadan Bankaya 5.000 TL
15.2 KONTROL: Kasa ve Banka bakiyeleri dogru mu?
15.3 Kasa → Defter → Hareket gecmisi dogru mu?
```

## FAZ 16: Bakim (Makine gerekli)
```
16.1 Bakim → Bakim Planlari → Yeni:
     - CNC-01, Haftalik yaglama
16.2 "Is Emri Olustur" → bakim is emri oldu mu?
16.3 Is emrini tamamla
```

## FAZ 17: IK & Vardiya (Kullanici gerekli)
```
17.1 IK → Vardiya Planlama → Sabah (06:00-14:00) tanimla
17.2 Devam Takibi → Giris/Cikis kaydi
17.3 Izin → Yeni talep (yillik, 2 gun)
17.4 Izni onayla
17.5 Yetkinlik → operator'e CNC-01 yetkinlik ekle
17.6 Sertifika → Forklift sertifikasi ekle
```

## FAZ 18: Raporlar & Analiz
```
18.1 Raporlar → KPI Dashboard
18.2 Dinamik Rapor → "Uretim Ozet" calistir
18.3 AI Insights → kontrol
18.4 Finans → Fatura Izleme → filtreler calisyor mu?
18.5 Finans → Yaslandirma → dogru mu?
18.6 Finans → Doviz Kurlari → TCMB guncelle
```

## FAZ 19: Dosya & Yardim
```
19.1 Ayarlar → Dosya Yonetimi → dosya yukle
19.2 Kota kontrol
19.3 Ayarlar → Terimler Sozlugu → sayfa kontrol
```

---

## BAGIMLILIK SIRASI
```
FAZ 0 (Tenant)
  → FAZ 1 (Birim, Rol)
    → FAZ 2 (Makine, Kullanici)
      → FAZ 3 (Is Emri Sablonu)
  → FAZ 4 (Depo → Malzeme/Urun → Stok Giris)
  → FAZ 5 (Musteri, Tedarikci)
  → FAZ 6 (Kasa/Banka)
    → FAZ 7 (Teklif → Siparis) ← Musteri + Urun
      → FAZ 9 (Uretim) ← Siparis + Sablon
        → FAZ 10 (ShopFloor) ← Operator + Uretim
    → FAZ 8 (Satinalma) ← Tedarikci + Malzeme
    → FAZ 11 (Kalite) ← Urun + Tedarikci
    → FAZ 12-15 (Fatura/Odeme) ← Kasa + Musteri
  → FAZ 16 (Bakim) ← Makine
  → FAZ 17 (IK) ← Kullanici
  → FAZ 18-19 (Rapor, Dosya) ← veri olmali
```
