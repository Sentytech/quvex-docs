# Quvex ERP — E2E Test Checklist v2
# Her adim test edildiginde [x] isaretlenir
# Hata varsa → HATA: aciklama yazilir

---

## FAZ 0: Tenant & Giris
- [ ] 0.1 Register → Yeni tenant olustur (firma adi, email, sifre min 8, sektor: CNC)
- [ ] 0.2 Giris yap (yeni tenant email + sifre)
- [ ] 0.3 Onboarding wizard gosterildi mi? Sektor secimi CNC mi?
- [ ] 0.4 Ana sayfa yuklenidi mi? Menu CNC profiline uygun mu?
  - [ ] Gorunen menuler: Stok, Satis, Uretim, Finans, Ayarlar
  - [ ] Gorunmeyen: Kalite, AI, IK Dashboard, Bakim, Raporlar

## FAZ 1: Temel Tanimlar
- [ ] 1.1 Ayarlar → Birimler:
  - [ ] "Adet" eklendi
  - [ ] "Kg" eklendi
  - [ ] "Metre" eklendi
  - [ ] "Litre" eklendi
  - [ ] "Takim" eklendi
- [ ] 1.2 Ayarlar → Roller:
  - [ ] "Yonetici" rolu kontrol/olustur
    - Izinler: Tum Goruntule + Tum Kaydet
    - Uretim.Goruntule, Uretim.Kaydet
    - Stok.Goruntule, Stok.Kaydet
    - Satis.Goruntule, Satis.Kaydet
    - Muhasebe.Goruntule, Muhasebe.Kaydet
    - IK.Goruntule, IK.Kaydet
    - Bakim.Goruntule, Bakim.Kaydet
    - Kalite.Goruntule, Kalite.Kaydet
  - [ ] "Operator" rolu kontrol/olustur
    - Izinler: Uretim.Goruntule, Uretim.Kaydet, Stok.Goruntule
  - [ ] "Muhasebe" rolu kontrol/olustur
    - Izinler: Muhasebe.Goruntule, Muhasebe.Kaydet, Satis.Goruntule, Stok.Goruntule
  - [ ] Roller listede gorunuyor mu?
  - [ ] Rol adlarinda tenant prefix gorunmuyor mu? (sadece "Yonetici" gorunmeli)
- [ ] 1.3 Ayarlar → Is Emri Adimlari (WorkOrderSteps):
  - [ ] KESIM / Kesim eklendi
  - [ ] TORNALAMA / Tornalama eklendi
  - [ ] TASLAMA / Taslama eklendi
  - [ ] FREZELEME / Frezeleme eklendi
  - [ ] DELME / Delme eklendi
  - [ ] KAYNAK / Kaynak eklendi
  - [ ] MONTAJ / Montaj eklendi
  - [ ] BOYAMA / Boyama eklendi
  - [ ] KALITE / Kalite Kontrol eklendi
  - [ ] PAKETLEME / Paketleme eklendi
  - [ ] Adimlar listede gorunuyor mu?

## FAZ 2: Makine & Personel
- [ ] 2.1 Uretim → Makineler:
  - [ ] CNC-01 / M001 / Torna Tezgahi eklendi
  - [ ] CNC-02 / M002 / Freze Tezgahi eklendi
  - [ ] TASLAMA-01 / M003 / Taslama eklendi
  - [ ] Makineler listede gorunuyor mu?
  - [ ] Makine duzenle → kaydet → kaybolmuyor mu?
- [ ] 2.2 Ayarlar → Kullanicilar:
  - [ ] Operator 1: Ali Usta / ali@test.com / Ali12345! / Rol: Operator
  - [ ] Operator 2: Veli Demir / veli@test.com / Veli1234! / Rol: Operator
  - [ ] Muhasebe: Ayse Hanim / ayse@test.com / Ayse1234! / Rol: Muhasebe
  - [ ] Kullanicilar listede gorunuyor mu?

## FAZ 3: Is Emri Sablonu (Makine + Kullanici gerekli)
- [ ] 3.1 Ayarlar → Is Emri Sablonlari:
  - [ ] "CNC Mil Uretimi" sablonu olustur
  - [ ] Adim 1: Kesim — Makine: CNC-01, Kullanici: Ali Usta
  - [ ] Adim 2: Tornalama — Makine: CNC-01, Kullanici: Ali Usta
  - [ ] Adim 3: Taslama — Makine: TASLAMA-01, Kullanici: Veli Demir
  - [ ] Adim 4: Kalite Kontrol — Makine: -, Kullanici: -
  - [ ] Sablon kaydedildi mi? Listede gorunuyor mu?
- [ ] 3.2 Duzenle → Adimlar ve atamalar dogru gorunuyor mu?

## FAZ 4: Depo & Stok
- [ ] 4.1 Stok → Depolar:
  - [ ] ANA / Ana Depo eklendi
  - [ ] HAMMADDE / Hammadde Deposu eklendi
  - [ ] MAMUL / Mamul Deposu eklendi
- [ ] 4.2 Stok → Urun & Malzeme → Malzeme (tip: Malzeme/Hammadde):
  - [ ] S001 / Celik Cubuk Ø20mm / Kg / Min:50 Max:500 / Alis:45 TL
  - [ ] S002 / Rulman 6205 / Adet / Min:20 Max:200 / Alis:35 TL
  - [ ] S003 / Conta Seti / Takim / Min:10 Max:100 / Alis:25 TL
  - [ ] Urunler listede gorunuyor mu? Tip dogru mu?
- [ ] 4.3 Stok → Urun & Malzeme → Urun (tip: Urun):
  - [ ] PRD-001 / CNC Islenmis Mil / Adet / Satis:500 TL / Is emri sablonu: "CNC Mil Uretimi"
  - [ ] PRD-002 / Hidrolik Silindir Govdesi / Adet / Satis:1.200 TL
- [ ] 4.4 Stok → Stok Giris/Cikis:
  - [ ] Giris fisi: Celik Cubuk 200 Kg → Hammadde Deposu
  - [ ] Giris fisi: Rulman 50 Adet → Ana Depo
  - [ ] Giris fisi: Conta Seti 30 Takim → Ana Depo
- [ ] 4.5 KONTROL: Stok listesi → fiili stoklar dogru mu?
  - [ ] Celik Cubuk: 200 Kg
  - [ ] Rulman: 50 Adet
  - [ ] Conta Seti: 30 Takim

## FAZ 5: Musteri & Tedarikci
- [ ] 5.1 Satis → Musteriler:
  - [ ] ASELSAN A.S. / Savunma / Ankara / VKN:1234567890
  - [ ] TEK MAKINA LTD. / Makina / Istanbul
  - [ ] Adres eklendi mi? Iletisim kisi eklendi mi?
- [ ] 5.2 Satinalma → Tedarikciler:
  - [ ] ERDEMIR A.S. / Celik / Eregli
  - [ ] RULMAN SAN. / Rulman / Konya
  - [ ] Adres + iletisim kisi eklendi mi?

## FAZ 6: Finans Kurulumu
- [ ] 6.1 Finans → Kasa/Banka:
  - [ ] KAS-01 / Ana Kasa / Kasa / TRY / Acilis: 10.000 TL
  - [ ] BNK-01 / Ziraat Bankasi / Banka / TRY / Acilis: 50.000 TL / IBAN girildi
- [ ] 6.2 KONTROL: Ozet kartlar dogru mu?
  - [ ] Kasa Toplami: 10.000 TL
  - [ ] Banka Toplami: 50.000 TL
  - [ ] Genel Toplam: 60.000 TL

## FAZ 7: Satis Sureci
- [ ] 7.1 Satis → Teklif → Yeni:
  - [ ] Musteri: ASELSAN secildi
  - [ ] Kalem 1: CNC Mil x15 @ 500 TL eklendi
  - [ ] Kalem 2: Hidrolik Silindir x5 @ 1.200 TL eklendi
  - [ ] Toplam dogru mu? (13.500 + KDV)
- [ ] 7.2 Teklif kaydedildi mi? No: T2026-XXXXX?
- [ ] 7.3 "Gonderildi" durumu basarili mi?
- [ ] 7.4 "Kabul Edildi" → Siparis olusturuldu mu?
- [ ] 7.5 KONTROL: Satis → Satislar → Siparis gorunuyor mu?

## FAZ 8: Satinalma Sureci
- [ ] 8.1 Satinalma → Siparis → Yeni:
  - [ ] Tedarikci: ERDEMIR secildi
  - [ ] Kalem: Celik Cubuk 300 Kg @ 45 TL
- [ ] 8.2 Siparis "Gonderildi" yapildi mi?
- [ ] 8.3 "Teslim Al" yapildi mi?
- [ ] 8.4 KONTROL: Stok → Celik Cubuk: 200+300 = 500 Kg?

## FAZ 9: Uretim
- [ ] 9.1 Uretim → Is Emirleri → Otomatik uretim emri var mi?
- [ ] 9.2 CNC Mil emri → Uretim Durumu:
  - [ ] Progress stepper gorunuyor mu?
  - [ ] "Sonraki Adim" butonu var mi?
- [ ] 9.3 Adim adim:
  - [ ] Kesim → miktar 15 → Tamamla
  - [ ] Tornalama → Tamamla
  - [ ] Taslama → Tamamla
  - [ ] Kalite Kontrol → Tamamla
- [ ] 9.4 KONTROL: Uretim "Tamamlandi" mi?

## FAZ 10: ShopFloor Terminal
- [ ] 10.1 Cikis → operator@test.com ile giris
- [ ] 10.2 Saha Terminali acildi mi?
- [ ] 10.3 Makine secildi (CNC-01)?
- [ ] 10.4 Is listesinden is secildi?
- [ ] 10.5 BASLAT → sure sayaci calisiyor mu?
- [ ] 10.6 NumPad ile miktar girildi?
- [ ] 10.7 DURDUR → Durus sebebi secildi?
- [ ] 10.8 BASLAT → devam edildi?
- [ ] 10.9 TAMAMLA basarili mi?
- [ ] 10.10 Vardiya ozeti dogru mu?
- [ ] 10.11 Admin ile tekrar giris yapildi

## FAZ 11: Kalite
- [ ] 11.1 NCR → Yeni:
  - [ ] Urun: CNC Mil, Ciddiyet: Orta
  - [ ] "Olcu toleransi disi" aciklamasi
- [ ] 11.2 NCR "Inceleniyor" durumuna gecti mi?
- [ ] 11.3 CAPA → Duzeltici faaliyet acildi mi?
- [ ] 11.4 Giris Kontrol → ERDEMIR, Celik Cubuk, Gecti
- [ ] 11.5 Kalibrasyon → Mikrometre MK-001 eklendi
- [ ] 11.6 Tedarikci Degerlendirme → ERDEMIR puanlandi

## FAZ 12: Satis Faturasi & Tahsilat
- [ ] 12.1 Satis Faturasi → ASELSAN, CNC Mil x15 @ 500 TL
- [ ] 12.2 Fatura "Gonderildi" yapildi
- [ ] 12.3 KONTROL: Cari → ASELSAN 9.000 TL borclu?
- [ ] 12.4 Odeme: 5.000 TL nakit, Ana Kasa
- [ ] 12.5 KONTROL: Kasa 15.000 TL?
- [ ] 12.6 KONTROL: Cari 4.000 TL kalan?
- [ ] 12.7 Odeme: 4.000 TL havale, Ziraat
- [ ] 12.8 KONTROL: Fatura "Odendi"? Cari 0?

## FAZ 13: Alis Faturasi & Odeme
- [ ] 13.1 Alis Faturasi → ERDEMIR, Celik Cubuk 300 Kg
- [ ] 13.2 "Gonderildi" yapildi
- [ ] 13.3 KONTROL: Cari → ERDEMIR'e 16.200 borclu?
- [ ] 13.4 Odeme: 16.200 TL, Ziraat
- [ ] 13.5 KONTROL: Banka dustu mu? Cari 0?

## FAZ 14: Iade
- [ ] 14.1 Iade Faturasi → ASELSAN, CNC Mil x2
- [ ] 14.2 "Gonderildi" yapildi
- [ ] 14.3 KONTROL: Cari → ASELSAN'a 1.200 borclu muyuz?

## FAZ 15: Kasa/Banka Transfer
- [ ] 15.1 Transfer: Kasadan Bankaya 5.000 TL
- [ ] 15.2 KONTROL: Kasa ve Banka bakiyeleri?
- [ ] 15.3 Defter → hareket gecmisi dogru mu?

## FAZ 16: Bakim
- [ ] 16.1 Bakim plani → CNC-01 haftalik yaglama
- [ ] 16.2 Is emri olusturuldu mu?
- [ ] 16.3 Is emri tamamlandi mi?

## FAZ 17: IK & Vardiya
- [ ] 17.1 Vardiya → Sabah (06:00-14:00) tanimlandi
- [ ] 17.2 Devam → Giris/Cikis kaydi eklendi
- [ ] 17.3 Izin → Yeni talep (yillik, 2 gun)
- [ ] 17.4 Izin onaylandi
- [ ] 17.5 Yetkinlik → operator + CNC-01
- [ ] 17.6 Sertifika → Forklift eklendi

## FAZ 18: Raporlar & Analiz
- [ ] 18.1 KPI Dashboard gorunuyor mu?
- [ ] 18.2 Dinamik Rapor → "Uretim Ozet" calistirildi
- [ ] 18.3 AI Insights kontrol
- [ ] 18.4 Fatura Izleme → filtreler calisiyor mu?
- [ ] 18.5 Yaslandirma dogru mu?
- [ ] 18.6 Doviz Kurlari → TCMB guncellendi mi?

## FAZ 19: Dosya & Yardim
- [ ] 19.1 Dosya Yonetimi → dosya yuklendi
- [ ] 19.2 Kota dogru mu?
- [ ] 19.3 Terimler Sozlugu gorunuyor mu?

---

## HATA KAYIT
| # | Faz | Adim | Hata | Oncelik | Durum |
|---|-----|------|------|---------|-------|
|   |     |      |      |         |       |

---

## FAZ 20: SPRINT 11 — SEKTOR E2E KAPSAMI (2026-04-12)

**Referans:** `tests/e2e/sectors/*.spec.js` — 4 Playwright spec dosyasi, 21 senaryo

### 20.1 Tekstil Sektoru (ProductVariant)
- [ ] 20.1.1 Sektor demo data seed (KOTON/LC WAIKIKI/MAVI musteri)
- [ ] 20.1.2 Urun olustur → varyant matrisi ac (Beden: S/M/L, Renk: Beyaz/Mavi/Siyah)
- [ ] 20.1.3 Bulk-generate 9 SKU olustu mu? (3×3 matris)
- [ ] 20.1.4 Her varyant icin ayri stok takibi calisiyor mu?
- [ ] 20.1.5 Varyant bazli satis siparisi olusturulabiliyor mu?

### 20.2 Gida Sektoru (HACCP + Recall)
- [ ] 20.2.1 Sektor demo data seed (Migros/BIM/CarrefourSA)
- [ ] 20.2.2 3 HACCP CCP olustu mu? (Pastorizasyon sicakligi, metal detektor, vb.)
- [ ] 20.2.3 HaccpMeasurement kayit + out-of-range → otomatik NCR
- [ ] 20.2.4 Recall wizard 7 adim (baslat → kapsam → etkilenen lot → musteri → bildirim → toplama → kapanis)
- [ ] 20.2.5 Forward trace BFS — lot → tum sevkiyat + musteri zinciri

### 20.3 Plastik Sektoru (MoldInventory)
- [ ] 20.3.1 Sektor demo data seed (Coca-Cola, Yildiz Holding musteri; Arburg makine)
- [ ] 20.3.2 2 Mold kaydi olustu mu? (sise kalibi, bidon kalibi)
- [ ] 20.3.3 Shot sayaci artiyor mu? (her uretim cikisinda +1)
- [ ] 20.3.4 Bakim esigi asildiginda alarm gorunuyor mu?

### 20.4 Makine Sektoru (CE Technical File)
- [ ] 20.4.1 Sektor demo data seed (Anadolu Isuzu vb. musteri)
- [ ] 20.4.2 CE Technical File 19 alan (risk degerlendirme, direktifler, dokuman listesi)
- [ ] 20.4.3 Machinery sektor profili dogru menuleri gosteriyor mu?

### 20.5 Kaynak Sektoru (WPS/WPQR)
- [ ] 20.5.1 WPS olustur (19 process parametresi: akim, voltaj, hiz, gaz, vb.)
- [ ] 20.5.2 Welder Certificate — kaynakci sertifikasi + expiry tarihi
- [ ] 20.5.3 Expiry yaklasinca turuncu, gectiginde kirmizi vurgu

### 20.6 Killer Feature Testleri
- [ ] 20.6.1 Onboarding wizard — 8 sektor seciminden birinde demo data seed 5 dk icinde tamamlaniyor
- [ ] 20.6.2 `/hubs/production-board` SignalR baglandi mi?
- [ ] 20.6.3 ProductionLiveBoard — dark theme, 56px KPI, auto-reconnect
- [ ] 20.6.4 Makine karti color-coded (Yesil/Sari/Kirmizi)
- [ ] 20.6.5 WhatsApp test mesaj gonder (send-test endpoint)
- [ ] 20.6.6 8 sablon listesi (order, shipment, payment, NCR, work order, stock, maintenance)

**Toplam Sektor Senaryo:** 21 | **Spec Dosyalari:** 4
