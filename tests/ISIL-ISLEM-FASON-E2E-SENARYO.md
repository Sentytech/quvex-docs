# Isil Islem Fason Imalat — Uctan Uca Test Senaryosu
# Savunma Sanayi Fason Isil Islem: Is Alimi → Islem → Sertifika → Teslim

> **Firma:** Atas Metalurji San. Ltd. Sti.
> **Sektor:** Fason isil islem — savunma sanayi alt yuklenici
> **Personel:** 15 kisi (3 operator, 1 kalite muduru, 1 yonetici, 10 uretim)
> **Is Modeli:** FASON — Musteri parcalarini alir, isil islem uygular, sertifika ile teslim eder
> **Standartlar:** AS9100 Rev D, AMS 2759 (Heat Treating of Steel Parts), NADCAP Heat Treating
> **Ekipman:** 3 vakum firin, 2 atmosfer firin, su/yag sondurme tanklari, sertlik test cihazi (Rockwell + Vickers)
> **Test Tarihi:** 2026-04-10
> **Test Ortami:** localhost:3000 (development) veya quvex.io (production)
> **Test suresi:** ~50 dakika
> **Adim sayisi:** 33

---

## Senaryo Ozeti

Bu senaryo, bir fason isil islem firmasinin (Atas Metalurji) savunma sanayi CNC talaslama
atolyelerinden gelen parcalara isil islem hizmeti vermesinin tum sureclerini kapsar:

1. Musteri ve tedarikci tanimlari
2. Fason is talebi alimi (SubcontractOrder olarak kayit)
3. Mal kabul — musteri parcalarinin teslim alinmasi ve giris kontrolu
4. Firin kalibrasyon kontrolu (TUS/SAT)
5. Isil islem recetesi secimi ve is emri olusturma
6. Operasyon kaydi — firin sicaklik/sure/atmosfer verisi
7. Sondurme sonrasi gorsel kontrol
8. Sertlik testi — HRC olcumu ve kabul/ret karari
9. Uygunsuzluk (NCR) yonetimi — ret olan parca icin yeniden islem
10. Isil islem sertifikasi ve sertlik test raporu hazirlama
11. Sevkiyat ve faturalama
12. Ikinci musteri — nitrurleme islemi (farkli recete)
13. Ay sonu raporlari ve tedarikci degerlendirme

**KRITIK NOT:** Bu bir FASON isletmedir. Urun uretmez, baskasinin parcasini isler.
SubcontractOrder modulu "fason is alimi" icin tersine kullanilir — firma alt yuklenici degil,
kendisi is alan taraftir. Giren parca = musterinin parcasi, cikan parca = ayni parca + isil islem sertifikasi.

---

## On Kosullar

Asagidaki kosullar test baslangicinda saglanmis olmalidir:

- [ ] Quvex uygulamasi calisiyor (API: localhost:5052, UI: localhost:3000)
- [ ] PostgreSQL veritabani erisim durumu: aktif (`smallfactory-postgres` container)
- [ ] Admin kullanici ile giris yapilabiliyor (admin@quvex.com / Admin123!@#$)
- [ ] Temel ayarlar yapilmis: Birim tanimlari (Adet, Kg), KDV oranlari (%20)
- [ ] Depo tanimlari: Giris Deposu (DP01), Islem Alani (DP02), Cikis Deposu (DP03)
- [ ] Makine tanimlari: Vakum Firin 1 (VF-01), Vakum Firin 2 (VF-02), Atmosfer Firin 1 (AF-01)
- [ ] Roller tanimli: Admin (Yonetici), Kalite Muduru, Operator
- [ ] Kalibrasyon modulu aktif

---

## Rol Bazli Erisim Matrisi

| Islem | Yonetici | Kalite Muduru | Operator |
|-------|----------|---------------|----------|
| Musteri kaydi | EVET | HAYIR | HAYIR |
| Fason is alimi (SubcontractOrder) | EVET | HAYIR | HAYIR |
| Mal kabul / giris kontrol | EVET | EVET | HAYIR |
| Kalibrasyon kaydi | HAYIR | EVET | HAYIR |
| Is emri olusturma | EVET | HAYIR | HAYIR |
| Firin kaydi (ShopFloor) | HAYIR | HAYIR | EVET |
| Sertlik testi / muayene | HAYIR | EVET | HAYIR |
| NCR olusturma | HAYIR | EVET | HAYIR |
| Sertifika hazirlama | HAYIR | EVET | HAYIR |
| Fatura olusturma | EVET | HAYIR | HAYIR |
| Raporlar | EVET | EVET (kalite) | HAYIR |
| Fiyatlandirma | EVET | HAYIR | HAYIR |

---

## Bilinen Kisitlamalar

1. **Firin sicaklik egrisi (pyrometry)** otomatik kayit yok — manuel giris yapilacak
2. **TUS/SAT raporlari** icin ayri modul yok — kalibrasyon modulunde not olarak girilecek
3. **Sondurme medyasi sicaklik takibi** yok — muayene notlarina yazilacak
4. **Nitrur derinlik olcumu** icin ayri alan yok — muayene notu olarak girilecek
5. **Fason is alimi** SubcontractOrder ile yapilir (tersine kullanim — firma is alan taraf)
6. **Firin atmosfer kaydi** (azot, argon, vakum seviyesi) ayri alan yok — operasyon notuna yazilacak
7. **Sondurme egrisi** (cooling curve) kaydi yok — sadece sondurme medyasi ve sicakligi girilir

---

# ══════════════════════════════════════════════════════════════
# BOLUM 1: MUSTERI ve TEDARIKCI TANIMLARI
# ══════════════════════════════════════════════════════════════

## Adim 1: Musteri Kaydi (Yildiz CNC — Savunma Talasli Imalat)
**Ekran:** Musteri Yonetimi > Yeni Musteri
**API:** POST /Customer
**Menu yolu:** Sol menu > Musteri Yonetimi > Musteriler
**Rol:** Yonetici (Admin)

**Veri:**

| Alan | Deger |
|------|-------|
| Firma Adi | Yildiz CNC Hassas Imalat San. ve Tic. A.S. |
| Kisa Adi | Yildiz CNC |
| Tipi | Musteri |
| Vergi Dairesi | OSTiM |
| Vergi No | 3456789012 |
| Telefon | 0312 354 7800 |
| E-posta | satin.alma@yildizcnc.com.tr |
| Web | www.yildizcnc.com.tr |
| Adres | OSTiM OSB, 18. Cadde No:22, Yenimahalle / Ankara |
| Ulke | Turkiye |
| Sehir | Ankara |
| Sektor | Savunma — Talasli Imalat |
| Notlar | AS9100 sertifikali. NADCAP isil islem sertifikasi talep ediyor. Tum parcalar icin malzeme sertifikasi zorunlu. |

**Beklenen Sonuc:**
- Musteri basariyla kaydedildi
- Musteri listesinde "Yildiz CNC" gorunuyor
- Musteri detay sayfasinda tum bilgiler dogru

**Dogrulama:**
- [ ] Musteri kaydi olusturuldu (201 Created)
- [ ] Musteri listesinde gorunuyor (/Customer?type=customers)
- [ ] Vergi no benzersizlik kontrolu calisti
- [ ] Adres ve sektor bilgileri dogru kaydedildi
- [ ] Notlarda AS9100 ve NADCAP bilgisi gorunuyor

---

## Adim 2: Musteri Irtibat Kisi Tanimlari
**Ekran:** Musteri Detay > Irtibat Kisileri
**API:** POST /CustomerContact
**Rol:** Yonetici (Admin)

**Veri — Irtibat 1:**

| Alan | Deger |
|------|-------|
| Ad Soyad | Kemal Ozturk |
| Unvan | Uretim Planlama Sefi |
| Telefon | 0532 444 7788 |
| E-posta | kemal.ozturk@yildizcnc.com.tr |
| Departman | Uretim Planlama |

**Veri — Irtibat 2:**

| Alan | Deger |
|------|-------|
| Ad Soyad | Selin Arslan |
| Unvan | Kalite Guvence Muhendisi |
| Telefon | 0533 222 9900 |
| E-posta | selin.arslan@yildizcnc.com.tr |
| Departman | Kalite Guvence |

**Dogrulama:**
- [ ] 2 irtibat kisisi basariyla eklendi
- [ ] Irtibat bilgileri musteri detayinda gorunuyor
- [ ] Telefon ve e-posta formatlari dogru

---

## Adim 3: Gaz Tedarikcisi Kaydi (Atmosfer Gazi)
**Ekran:** Musteri Yonetimi > Yeni Musteri (Tedarikci modu)
**API:** POST /Customer
**Filtre:** /Customer?type=suppliers
**Rol:** Yonetici (Admin)

**Veri:**

| Alan | Deger |
|------|-------|
| Firma Adi | Linde Gaz A.S. |
| Kisa Adi | Linde Gaz |
| Tipi | Tedarikci |
| Vergi Dairesi | Gebze |
| Vergi No | 5678901234 |
| Telefon | 0262 999 5000 |
| E-posta | satis@linde.com.tr |
| Adres | Gebze OSB, Kimya Sok. No:8, Gebze / Kocaeli |
| Sektor | Endustriyel Gaz |
| Notlar | Azot, argon, hidrojen gaz tedarikcisi. ISO 9001 sertifikali. Sondurme gazi ve firin atmosfer gazi temini. |

**Dogrulama:**
- [ ] Tedarikci kaydi olusturuldu (201 Created)
- [ ] /Customer?type=suppliers filtresinde gorunuyor
- [ ] Musteri filtresinde gorunmuyor (/Customer?type=customers)

---

# ══════════════════════════════════════════════════════════════
# BOLUM 2: FASON IS ALIMI ve MAL KABUL
# ══════════════════════════════════════════════════════════════

## Adim 4: Fason Is Talebi Alimi — SubcontractOrder Kaydi
**Ekran:** Fason Isler > Yeni Fason Is Emri
**API:** POST /SubcontractOrder
**Menu yolu:** Sol menu > Fason Isler > Fason Is Emirleri
**Rol:** Yonetici (Admin)

**ACIKLAMA:** Fason is alimi icin SubcontractOrder modulu tersine kullanilir.
Normalde bu modul "disariya is verme" icindir, ancak burada "disaridan is alma"
olarak kullanilir. Musteri tarafindan gelen is talebi bu sekilde kayit altina alinir.

**Veri:**

| Alan | Deger |
|------|-------|
| Musteri | Yildiz CNC Hassas Imalat San. ve Tic. A.S. |
| Is Emri No | FI-2026-0042 |
| Tarih | 2026-04-10 |
| Termin | 2026-04-17 |
| Parca Adi | 4140 Celik Disli — Z=24, M=3 |
| Parca Kodu | YCN-DSL-4140-024 |
| Malzeme | AISI 4140 (42CrMo4) Alasimsiz Celik |
| Adet | 20 |
| Istenen Islem | Sertlestirme + Temperleme |
| Hedef Sertlik | HRC 58-62 |
| Referans Standart | AMS 2759/1 (Heat Treatment of Carbon and Low-Alloy Steel Parts) |
| Teknik Cizim No | YCN-DSL-024-R02 |
| Birim Fiyat | 350.00 TL/adet |
| Toplam Tutar | 7,000.00 TL + KDV |
| Notlar | Musterinin teknik ciziminde belirtilen sertlik degerleri: HRC 58-62 (yuzey). Parcalar talasli islem sonrasi geliyor, isil islem oncesi temizlik gerekli. NADCAP uyumlu sertifika isteniyor. |

**Beklenen Sonuc:**
- SubcontractOrder basariyla olusturuldu
- Is emri listesinde gorunuyor
- Durum: "Beklemede" (Pending)

**Dogrulama:**
- [ ] SubcontractOrder kaydi olusturuldu (201 Created)
- [ ] Is emri no benzersiz (FI-2026-0042)
- [ ] Musteri bilgisi dogru baglandi
- [ ] Termin tarihi kayitli (2026-04-17)
- [ ] Birim fiyat ve toplam tutar dogru
- [ ] AMS 2759/1 referansi notlarda gorunuyor

---

## Adim 5: Mal Kabul — Musteri Parcalarinin Teslim Alinmasi
**Ekran:** Fason Isler > FI-2026-0042 > Mal Kabul
**API:** POST /Inspection (Giris Muayenesi)
**Rol:** Kalite Muduru

**ACIKLAMA:** Musterinin gonderdigi parcalar teslim alinir. Parca sayisi, gorsel durum
ve giris sertlik olcumu yapilir. Lot numarasi atanir.

**Veri — Giris Muayenesi:**

| Alan | Deger |
|------|-------|
| Muayene Tipi | Giris Muayenesi |
| Iliskili Kayit | FI-2026-0042 |
| Tarih | 2026-04-10 |
| Muayeneci | Kalite Muduru |
| Lot No | LOT-2026-0410-001 |
| Gelen Adet | 20 |
| Kabul Adedi | 20 |
| Ret Adedi | 0 |

**Kontrol Adimlari:**

| Kontrol | Sonuc | Kabul Kriteri |
|---------|-------|---------------|
| Parca Sayisi | 20 adet (tam) | Siparis adedi ile uyumlu |
| Gorsel Kontrol (catlak) | Yok | Gozle gorunur catlak yok |
| Gorsel Kontrol (capak) | Yok | Keskin capak yok |
| Gorsel Kontrol (pas/oksidasyon) | Yok | Yuzey temiz |
| Boyutsal Kontrol (cizime uygunluk) | Uygun | Teknik cizim toleranslari icinde |
| Giris Sertlik Olcumu — Parca 1 | HRC 22 | HRC 18-28 (islem oncesi beklenen deger) |
| Giris Sertlik Olcumu — Parca 5 | HRC 23 | HRC 18-28 |
| Giris Sertlik Olcumu — Parca 10 | HRC 21 | HRC 18-28 |
| Giris Sertlik Olcumu — Parca 20 | HRC 24 | HRC 18-28 |
| Malzeme Sertifikasi Kontrolu | Var — 4140 mill cert mevcut | Musteriden gelen 3.1 sertifika |

**Muayene Notu:**
> 20 adet 4140 celik disli teslim alindi. Parcalar talasli islem sonrasi temiz durumda.
> Giris sertlik degerleri HRC 21-24 arasinda, beklenen aralikta. Malzeme sertifikasi (3.1) musteri
> tarafindan teslim edildi. Lot numarasi LOT-2026-0410-001 atandi. Parcalar isil islem icin uygun.

**Dogrulama:**
- [ ] Giris muayene kaydi olusturuldu (201 Created)
- [ ] Lot numarasi atandi (LOT-2026-0410-001)
- [ ] Giris sertlik degerleri kaydedildi
- [ ] Malzeme sertifikasi notu girildi
- [ ] Muayene sonucu: KABUL
- [ ] 20/20 parca kabul edildi

---

## Adim 6: Lot Numarasi ve Izlenebilirlik Kaydi
**Ekran:** Izlenebilirlik > Seri/Lot Numarasi
**API:** POST /SerialNumber (veya /Traceability)
**Rol:** Kalite Muduru

**Veri:**

| Alan | Deger |
|------|-------|
| Lot No | LOT-2026-0410-001 |
| Parca Kodu | YCN-DSL-4140-024 |
| Malzeme | AISI 4140 (42CrMo4) |
| Musteri | Yildiz CNC |
| Adet | 20 |
| Musteri Sertifika No | MC-4140-2026-0388 (Musterinin malzeme sertifikasi) |
| Giris Tarihi | 2026-04-10 |
| Durum | Islem Bekliyor |

**Dogrulama:**
- [ ] Lot kaydi olusturuldu
- [ ] Lot numarasi SubcontractOrder ile iliskilendirildi
- [ ] Izlenebilirlik zinciri basladi (giris → islem → cikis)

---

# ══════════════════════════════════════════════════════════════
# BOLUM 3: FIRIN KALIBRASYON ve ISIL ISLEM HAZIRLIGI
# ══════════════════════════════════════════════════════════════

## Adim 7: Firin Kalibrasyon Kontrolu — TUS ve SAT
**Ekran:** Kalite > Kalibrasyon > Ekipman Detay
**API:** GET /Calibration?equipmentId={firinId}
**Rol:** Kalite Muduru

**ACIKLAMA:** AMS 2750 (Pyrometry) gerekliliklerine gore firin kullanilmadan once
kalibrasyon durumu kontrol edilir. TUS (Temperature Uniformity Survey) ve SAT
(System Accuracy Test) gecerlilik tarihleri dogrulanir.

**Kontrol — Vakum Firin 1 (VF-01):**

| Kalibrasyon Tipi | Son Tarih | Gecerlilik | Sonraki Tarih | Durum |
|-----------------|-----------|------------|---------------|-------|
| TUS (Sicaklik Homojenlik Testi) | 2026-03-15 | 3 ay | 2026-06-15 | GECERLI |
| SAT (Sistem Dogruluk Testi) | 2026-04-01 | 1 ay | 2026-05-01 | GECERLI |
| Termokupl Kalibrasyonu | 2026-03-20 | 6 ay | 2026-09-20 | GECERLI |

**Firin Sinifi:** Sinif 2 (±10°C) — AMS 2750E

**Kalibrasyon Notu:**
> VF-01 vakum firin tum kalibrasyon parametreleri gecerli. TUS raporu 2026-03-15 tarihli,
> 9 noktadan sicaklik olcumu yapilmis, max sapma ±7°C (Sinif 2 limiti ±10°C icinde).
> SAT testi 2026-04-01 tarihli, 3 kontrol termokuplu kalibre. Firin is icin hazir.

**Dogrulama:**
- [ ] VF-01 kalibrasyon kayitlari goruntulenebiliyor
- [ ] TUS gecerlilik tarihi kontrol edildi (2026-06-15'e kadar gecerli)
- [ ] SAT gecerlilik tarihi kontrol edildi (2026-05-01'e kadar gecerli)
- [ ] Firin sinifi Sinif 2 olarak kayitli
- [ ] Suresi gecmis kalibrasyon uyarisi gelmiyor (tum kalibrasyonlar gecerli)

---

## Adim 8: Isil Islem Recetesi / Plani Tanimla
**Ekran:** Uretim > Operasyon Routing / Recete Tanimi
**API:** POST /OperationRouting (veya urun recetesi)
**Rol:** Yonetici (Admin)

**ACIKLAMA:** 4140 celik icin sertlestirme + temperleme recetesi tanimlanir.
AMS 2759/1 standardina uygun parametre seti olusturulur.

**Recete: RCP-4140-SERT-TEMP (4140 Sertlestirme + Temperleme)**

| Operasyon | Kod | Islem | Sicaklik | Sure | Atmosfer | Ekipman | Not |
|-----------|-----|-------|----------|------|----------|---------|-----|
| Op10 | YUK | Yukleme + Firin Yerlesim | - | 15 dk | - | VF-01 | Parcalar sepetin ortasina yerlestirilecek, aralarda min 10mm bosluk |
| Op20 | ONI | On Isitma | 400°C | 30 dk | Vakum (<1 mbar) | VF-01 | Termal sok onleme — kademeli isitma |
| Op30 | OST | Ostenitleme | 845°C ±10°C | 45 dk | Vakum (<0.1 mbar) | VF-01 | AMS 2759/1 Tablo 1: 4140 icin 830-860°C |
| Op40 | SND | Sondurme | Yag 60°C ±10°C | 5 dk | - | Yag Tanki YT-01 | Hizli batirma, max 15 sn transfer suresi |
| Op50 | TMP | Temperleme | 200°C ±10°C | 120 dk | Hava | AF-01 | HRC 58-62 hedef — AMS 2759/1 Tablo 2 |
| Op60 | SOG | Sogutma (Havada) | Oda sicakligi | 60 dk | Hava | - | Havada sogutma, su temas ettirmemek |

**Dogrulama:**
- [ ] Recete basariyla tanimlandi
- [ ] 6 operasyon adimi kayitli
- [ ] Her operasyonda sicaklik, sure, atmosfer bilgisi var
- [ ] AMS 2759/1 referanslari notlarda belirtilmis
- [ ] Recete kodu benzersiz (RCP-4140-SERT-TEMP)

---

# ══════════════════════════════════════════════════════════════
# BOLUM 4: IS EMRI ve URETIM (ISIL ISLEM SURECI)
# ══════════════════════════════════════════════════════════════

## Adim 9: Is Emri Olusturma
**Ekran:** Uretim > Yeni Is Emri
**API:** POST /WorkOrder
**Rol:** Yonetici (Admin)

**Veri:**

| Alan | Deger |
|------|-------|
| Is Emri No | IE-2026-0410-001 |
| Iliskili Fason Is | FI-2026-0042 |
| Urun/Parca | 4140 Celik Disli — YCN-DSL-4140-024 |
| Lot No | LOT-2026-0410-001 |
| Adet | 20 |
| Recete | RCP-4140-SERT-TEMP |
| Baslangic Tarihi | 2026-04-11 |
| Bitis Tarihi (Planlanan) | 2026-04-12 |
| Oncelik | Yuksek |
| Atanan Firin | VF-01 (Vakum Firin 1) |
| Notlar | Yildiz CNC — savunma parca. NADCAP uyumlu dokumantasyon. Sondurme transfer suresi max 15 sn. |

**Beklenen Sonuc:**
- Is emri olusturuldu
- 6 operasyon otomatik olarak is emrine baglandi (receteden)
- Durum: "Planlanmis"

**Dogrulama:**
- [ ] Is emri olusturuldu (201 Created)
- [ ] Operasyon listesi receteden dogru geldi (Op10-Op60)
- [ ] Lot numarasi ile iliskilendirildi
- [ ] SubcontractOrder (FI-2026-0042) ile baglanti kuruldu
- [ ] Firin atamasi yapildi (VF-01)

---

## Adim 10: Op10 — Yukleme ve Firin Yerlesim Kaydi (Operator)
**Ekran:** ShopFloor Terminal > Is Emri > Op10
**API:** POST /WorkOrderOperation/{id}/start + PUT /WorkOrderOperation/{id}/complete
**Rol:** Operator

**Veri:**

| Alan | Deger |
|------|-------|
| Operasyon | Op10 — Yukleme + Firin Yerlesim |
| Operator | Ahmet Yilmaz (Operator-1) |
| Baslangic | 2026-04-11 08:00 |
| Bitis | 2026-04-11 08:15 |
| Parca Sayisi | 20 adet |
| Firin | VF-01 |
| Sepet No | SPT-003 |
| Yerlesim Notu | 4 katman, katman basina 5 parca. Katmanlar arasi seramik ayiriciler. Min 10mm bosluk saglanmis. |

**Dogrulama:**
- [ ] Operator ShopFloor'da Op10'u baslatti
- [ ] Baslangic/bitis zamani kaydedildi
- [ ] Yukleme notu girildi
- [ ] Operasyon durumu: Tamamlandi

---

## Adim 11: Op20 — On Isitma Kaydi (Operator)
**Ekran:** ShopFloor Terminal > Is Emri > Op20
**API:** PUT /WorkOrderOperation/{id}/complete
**Rol:** Operator

**Veri:**

| Alan | Deger |
|------|-------|
| Operasyon | Op20 — On Isitma |
| Hedef Sicaklik | 400°C |
| Gerceklesen Sicaklik | 398°C |
| Sure | 30 dk |
| Baslangic | 2026-04-11 08:20 |
| Bitis | 2026-04-11 08:50 |
| Atmosfer | Vakum — 0.8 mbar |
| Termokupl Okumasi (Alt) | 396°C |
| Termokupl Okumasi (Orta) | 398°C |
| Termokupl Okumasi (Ust) | 401°C |
| Operasyon Notu | On isitma tamamlandi. Sicaklik homojenlik max sapma ±3°C. Vakum seviyesi stabil. |

**Dogrulama:**
- [ ] Sicaklik degerleri kaydedildi (398°C)
- [ ] Atmosfer bilgisi girildi (vakum 0.8 mbar)
- [ ] 3 termokupl okumasi not olarak girildi
- [ ] Operasyon suresi 30 dk olarak kayitli

---

## Adim 12: Op30 — Ostenitleme Kaydi (Operator)
**Ekran:** ShopFloor Terminal > Is Emri > Op30
**API:** PUT /WorkOrderOperation/{id}/complete
**Rol:** Operator

**Veri:**

| Alan | Deger |
|------|-------|
| Operasyon | Op30 — Ostenitleme |
| Hedef Sicaklik | 845°C ±10°C |
| Gerceklesen Sicaklik | 843°C |
| Sure | 45 dk |
| Baslangic | 2026-04-11 08:50 |
| Bitis | 2026-04-11 09:35 |
| Atmosfer | Vakum — 0.05 mbar |
| Termokupl Okumasi (Alt) | 840°C |
| Termokupl Okumasi (Orta) | 843°C |
| Termokupl Okumasi (Ust) | 848°C |
| Operasyon Notu | Ostenitleme 845°C'de 45 dk tamamlandi. Max sapma ±5°C (Sinif 2 limiti ±10°C icinde). Ostenit donusumu tamamlanmis sayiliyor. Sondurmeye transfer icin hazir. |

**KRITIK — AMS 2759/1 Uyumluluk:**
- 4140 celik icin ostenitleme sicakligi: 830-860°C (Tablo 1)
- Gerceklesen: 843°C — UYGUN
- Tutma suresi: min 30 dk/inch kalinlik — 45 dk UYGUN

**Dogrulama:**
- [ ] Ostenitleme sicakligi 843°C olarak kaydedildi
- [ ] Sure 45 dk kaydedildi
- [ ] Vakum seviyesi not edildi (0.05 mbar)
- [ ] AMS 2759/1 limitlerinde (830-860°C)
- [ ] Operasyon durumu: Tamamlandi

---

## Adim 13: Op40 — Sondurme Kaydi (Operator)
**Ekran:** ShopFloor Terminal > Is Emri > Op40
**API:** PUT /WorkOrderOperation/{id}/complete
**Rol:** Operator

**Veri:**

| Alan | Deger |
|------|-------|
| Operasyon | Op40 — Sondurme (Yag) |
| Sondurme Medyasi | Yag — Houghton Quench Oil G |
| Yag Sicakligi (Baslangic) | 58°C |
| Yag Sicakligi (Bitis) | 64°C |
| Transfer Suresi (firin → yag) | 12 saniye |
| Baslangic | 2026-04-11 09:35 |
| Bitis | 2026-04-11 09:40 |
| Operasyon Notu | Sondurme tamamlandi. Transfer suresi 12 sn (max 15 sn limiti icinde). Yag sicakligi 58→64°C yukseldi (max 80°C limiti icinde). Parcalar tamamen battirildi, hava kabarcigi yok. Cikista gorsel kontrol yapilacak. |

**KRITIK — Sondurme Parametreleri:**
- Transfer suresi: 12 sn (max 15 sn — AMS 2759 gereklilik)
- Yag sicakligi: 58-64°C (kabul araligi: 50-80°C)
- Her iki parametre de UYGUN

**Dogrulama:**
- [ ] Sondurme medyasi ve sicakligi kaydedildi
- [ ] Transfer suresi 12 sn olarak not edildi
- [ ] Yag sicakligi baslangic/bitis kayitli
- [ ] Operasyon suresi 5 dk kaydedildi

---

## Adim 14: Op50 — Temperleme Kaydi (Operator)
**Ekran:** ShopFloor Terminal > Is Emri > Op50
**API:** PUT /WorkOrderOperation/{id}/complete
**Rol:** Operator

**Veri:**

| Alan | Deger |
|------|-------|
| Operasyon | Op50 — Temperleme |
| Hedef Sicaklik | 200°C ±10°C |
| Gerceklesen Sicaklik | 198°C |
| Sure | 120 dk (2 saat) |
| Baslangic | 2026-04-11 10:00 |
| Bitis | 2026-04-11 12:00 |
| Atmosfer | Hava (atmosfer firin) |
| Firin | AF-01 (Atmosfer Firin 1) |
| Termokupl Okumasi | 196°C / 198°C / 201°C |
| Operasyon Notu | Temperleme 200°C'de 2 saat tamamlandi. HRC 58-62 hedef sertlik bekleniyor. Parcalar firindan cikarildi, havada sogumaya birakildi. |

**AMS 2759/1 Uyumluluk:**
- 4140 celik temperleme: HRC 58-62 icin 190-210°C (Tablo 2)
- Gerceklesen: 198°C — UYGUN
- Tutma suresi: min 1 saat — 2 saat UYGUN

**Dogrulama:**
- [ ] Temperleme sicakligi 198°C kaydedildi
- [ ] Sure 120 dk kaydedildi
- [ ] Firin AF-01 olarak kayitli
- [ ] Termokupl okumalari not edildi

---

## Adim 15: Op60 — Sogutma Kaydi (Operator)
**Ekran:** ShopFloor Terminal > Is Emri > Op60
**API:** PUT /WorkOrderOperation/{id}/complete
**Rol:** Operator

**Veri:**

| Alan | Deger |
|------|-------|
| Operasyon | Op60 — Sogutma (Havada) |
| Baslangic Sicaklik | 198°C |
| Bitis Sicaklik | Oda sicakligi (~25°C) |
| Sure | 60 dk |
| Baslangic | 2026-04-11 12:00 |
| Bitis | 2026-04-11 13:00 |
| Operasyon Notu | Havada sogutma tamamlandi. Parcalar oda sicakligina ulasti. Su veya hava ucgun ile temas ettirilmedi. Sertlik testi icin kalite birimine iletilecek. |

**Dogrulama:**
- [ ] Sogutma operasyonu kaydedildi
- [ ] Tum 6 operasyon tamamlandi (Op10-Op60)
- [ ] Is emri durumu: "Uretim Tamamlandi" veya "Kalite Kontrol Bekliyor"

---

# ══════════════════════════════════════════════════════════════
# BOLUM 5: KALITE KONTROL ve NCR YONETIMI
# ══════════════════════════════════════════════════════════════

## Adim 16: Sondurme Sonrasi Gorsel Kontrol
**Ekran:** Kalite > Muayene > Yeni Muayene
**API:** POST /Inspection
**Rol:** Kalite Muduru

**Veri:**

| Alan | Deger |
|------|-------|
| Muayene Tipi | Proses Muayenesi |
| Iliskili Is Emri | IE-2026-0410-001 |
| Lot No | LOT-2026-0410-001 |
| Tarih | 2026-04-11 |
| Muayeneci | Kalite Muduru |

**Gorsel Kontrol Sonuclari:**

| Kontrol | Parca 1-18 | Parca 19 | Parca 20 |
|---------|-----------|----------|----------|
| Catlak | Yok | Yok | Yok |
| Carpilma | Yok | Yok | Yok |
| Yuzey Rengi | Koyu gri (normal) | Koyu gri | Koyu gri |
| Kabuk/Tufal | Minimal | Minimal | Minimal |
| Sondurme Lekesi | Yok | Yok | Yok |

**Muayene Notu:**
> Sondurme sonrasi 20 parca gorsel kontrolden gecti. Catlak, carpilma, anormal yuzey
> durumu yok. Tum parcalar koyu gri renkte (normal sondurme sonrasi gorunum).
> Sertlik testine gonderilebilir.

**Dogrulama:**
- [ ] Gorsel kontrol muayene kaydi olusturuldu
- [ ] 20/20 parca gorsel kontrolden gecti
- [ ] Catlak/carpilma tespit edilmedi
- [ ] Muayene sonucu: KABUL

---

## Adim 17: Sertlik Testi — HRC Olcumu (20 Parca)
**Ekran:** Kalite > Muayene > Yeni Muayene (Son Muayene)
**API:** POST /Inspection
**Rol:** Kalite Muduru

**ACIKLAMA:** Her parcadan 3 noktadan Rockwell C (HRC) sertlik olcumu yapilir.
Hedef: HRC 58-62 (AMS 2759/1 gerekliligi). Numune plani: %100 kontrol
(savunma sanayi gereksinimi).

**Sertlik Test Sonuclari (numune — ilk 5 parca + son 2):**

| Parca No | Nokta 1 (HRC) | Nokta 2 (HRC) | Nokta 3 (HRC) | Ortalama | Karar |
|----------|---------------|---------------|---------------|----------|-------|
| 1 | 59 | 60 | 59 | 59.3 | KABUL |
| 2 | 55 | 56 | 54 | 55.0 | **RET** |
| 3 | 61 | 60 | 60 | 60.3 | KABUL |
| 4 | 58 | 59 | 58 | 58.3 | KABUL |
| 5 | 60 | 61 | 60 | 60.3 | KABUL |
| ... | ... | ... | ... | ... | ... |
| 19 | 59 | 58 | 59 | 58.7 | KABUL |
| 20 | 60 | 60 | 61 | 60.3 | KABUL |

**Ozet:**
- Kabul: 19 parca (HRC 58-62 araliginda)
- Ret: 1 parca (Parca 2 — HRC 55.0, alt limit HRC 58'in altinda)
- Ret orani: %5

**Muayene Notu:**
> 20 parcaya %100 sertlik testi uygulandi (3 nokta/parca, Rockwell C skalasi).
> 19 parca HRC 58-62 araliginda — KABUL. Parca 2 ortalama HRC 55.0 ile spec disinda — RET.
> Parca 2 icin uygunsuzluk raporu (NCR) acilacak. Dusuk sertligin muhtemel nedeni:
> sondurme sirasinda ust bolge sicaklik sapmasi.

**Dogrulama:**
- [ ] Sertlik testi muayene kaydi olusturuldu (201 Created)
- [ ] Her parca icin 3 olcum degeri girildi
- [ ] 19 KABUL + 1 RET sonucu dogru kaydedildi
- [ ] Ret olan parca (No:2) acikca isaretlendi
- [ ] Muayene notu AMS 2759/1 referansi iceriyor

---

## Adim 18: Uygunsuzluk Raporu (NCR) — Parca 2 Icin
**Ekran:** Kalite > NCR > Yeni NCR
**API:** POST /NonConformanceReport
**Rol:** Kalite Muduru

**Veri:**

| Alan | Deger |
|------|-------|
| NCR No | NCR-2026-0042 |
| Tarih | 2026-04-11 |
| Iliskili Is Emri | IE-2026-0410-001 |
| Lot No | LOT-2026-0410-001 |
| Parca No | 2 |
| Uygunsuzluk Tipi | Sertlik Spec Disi |
| Tespit Asama | Son Muayene — Sertlik Testi |
| Beklenen Deger | HRC 58-62 |
| Gerceklesen Deger | HRC 55.0 (ortalama 3 nokta: 55, 56, 54) |
| Sapma Miktari | -3 HRC (alt limitin 3 puan altinda) |
| Ciddiyet | Orta (yeniden islem ile giderilebilir) |

**Kok Neden Analizi:**

| Alan | Deger |
|------|-------|
| Analiz Yontemi | 5 Neden (5 Why) |
| Neden 1 | Parca 2 sertligi dusuk cikti (HRC 55 vs hedef 58-62) |
| Neden 2 | Ostenitleme sirasinda parca yeterli sicakliga ulasamadi |
| Neden 3 | Firin ust bolgesi alt bolgeye gore 5°C dusuk okudu |
| Neden 4 | Parca 2 sepetin en ust katmaninda, kapaga yakin konumdaydi |
| Neden 5 | Ust katman parcalari kapagin sogutma etkisi nedeniyle daha dusuk sicakliga maruz kaldi |
| Kok Neden | Firin ust bolge sicaklik sapma + parca yerlesim pozisyonu |

**Karar:**

| Alan | Deger |
|------|-------|
| Duzeltici Faaliyet | Yeniden isil islem (2. deneme) |
| Onleyici Faaliyet | Firin yerlesim prosedurunu guncelle — ust katmana max 3 parca, seramik izolatör ekle |
| Termin | 2026-04-12 (yeniden islem) |
| Sorumlu | Kalite Muduru + Operator |

**Dogrulama:**
- [ ] NCR kaydi olusturuldu (201 Created)
- [ ] NCR numarasi benzersiz (NCR-2026-0042)
- [ ] Kok neden analizi girildi
- [ ] Duzeltici faaliyet tanimlandi (yeniden isil islem)
- [ ] Onleyici faaliyet tanimlandi (yerlesim proseduru guncellemesi)
- [ ] NCR durumu: Acik

---

## Adim 19: Yeniden Isil Islem — Parca 2 Icin Ikinci Deneme
**Ekran:** Uretim > Is Emri (ek operasyon) veya Yeni Is Emri
**API:** POST /WorkOrder veya PUT /WorkOrder/{id}
**Rol:** Yonetici + Operator

**ACIKLAMA:** Parca 2 icin ayni recete (sertlestirme + temperleme) ikinci kez uygulanir.
Bu sefer parca sepetin orta katmanina yerlestirilerek sicaklik homojenlik sorunu onlenir.

**Islem Parametreleri (2. Deneme):**

| Operasyon | Parametre | Deger |
|-----------|-----------|-------|
| Ostenitleme | Sicaklik | 845°C |
| Ostenitleme | Sure | 50 dk (5 dk artirildi — emniyetli) |
| Sondurme | Medya | Yag 60°C |
| Sondurme | Transfer suresi | 10 sn |
| Temperleme | Sicaklik | 200°C |
| Temperleme | Sure | 120 dk |
| Yerlesim | Pozisyon | Sepetin orta katmani (2. katman) |

**Dogrulama:**
- [ ] Yeniden islem is emri/operasyonu olusturuldu
- [ ] NCR ile iliskilendirildi
- [ ] Operasyon kayitlari tamamlandi

---

## Adim 20: Yeniden Islem Sonrasi Sertlik Testi — Parca 2
**Ekran:** Kalite > Muayene > Yeni Muayene
**API:** POST /Inspection
**Rol:** Kalite Muduru

**Sertlik Test Sonucu (2. Deneme):**

| Parca No | Nokta 1 (HRC) | Nokta 2 (HRC) | Nokta 3 (HRC) | Ortalama | Karar |
|----------|---------------|---------------|---------------|----------|-------|
| 2 (2. deneme) | 60 | 61 | 59 | 60.0 | **KABUL** |

**Muayene Notu:**
> Parca 2 yeniden isil islem sonrasi sertlik testi. 3 noktadan olcum: 60, 61, 59 HRC.
> Ortalama 60.0 HRC — spec araliginda (58-62). KABUL. NCR kapanabilir.

**Dogrulama:**
- [ ] Sertlik testi kaydi olusturuldu
- [ ] 3 olcum degeri kaydedildi (60, 61, 59)
- [ ] Sonuc: KABUL
- [ ] NCR-2026-0042 durumu "Kapatildi" olarak guncellendi

---

## Adim 21: NCR Kapatma
**Ekran:** Kalite > NCR > NCR-2026-0042 > Kapat
**API:** PUT /NonConformanceReport/{id}
**Rol:** Kalite Muduru

**Veri:**

| Alan | Deger |
|------|-------|
| Kapatma Tarihi | 2026-04-12 |
| Kapatma Notu | Parca 2 yeniden isil islem uygulandi. 2. denemede sertlik HRC 60.0 — KABUL. Duzeltici faaliyet tamamlandi. Onleyici faaliyet olarak firin yerlesim proseduru guncellendi (PR-FYP-003 Rev B). |
| Durum | Kapatildi |
| Dogrulama Kaniti | Sertlik test raporu + guncellenmis yerlesim proseduru |

**Dogrulama:**
- [ ] NCR durumu "Kapatildi" olarak guncellendi
- [ ] Kapatma notu ve tarih girildi
- [ ] Duzeltici faaliyet tamamlanmis olarak isaretlendi
- [ ] Onleyici faaliyet kaydedildi

---

# ══════════════════════════════════════════════════════════════
# BOLUM 6: SERTIFIKA, SEVKIYAT ve FATURA
# ══════════════════════════════════════════════════════════════

## Adim 22: Isil Islem Sertifikasi Hazirlama (MaterialCertificate)
**Ekran:** Kalite > Malzeme Sertifikasi > Yeni Sertifika
**API:** POST /MaterialCertificate
**Rol:** Kalite Muduru

**ACIKLAMA:** Isil islem tamamlanan parcalar icin AMS 2759/1 uyumlu sertifika hazirlanir.
Bu sertifika musteri ile birlikte parcayi takip edecek resmi dokumantasyondur.

**Veri:**

| Alan | Deger |
|------|-------|
| Sertifika No | IIS-2026-0042-001 |
| Sertifika Tipi | Isil Islem Sertifikasi |
| Tarih | 2026-04-12 |
| Musteri | Yildiz CNC Hassas Imalat San. ve Tic. A.S. |
| Parca Adi | 4140 Celik Disli — Z=24, M=3 |
| Parca Kodu | YCN-DSL-4140-024 |
| Malzeme | AISI 4140 (42CrMo4) |
| Lot No | LOT-2026-0410-001 |
| Adet | 20 |
| Uygulanan Islem | Sertlestirme + Temperleme |
| Referans Standart | AMS 2759/1 — Heat Treatment of Carbon and Low-Alloy Steel Parts |
| Firin | VF-01 (Vakum Firin 1) — Sinif 2 (AMS 2750E) |
| Ostenitleme | 843°C / 45 dk / Vakum |
| Sondurme | Yag (Houghton Quench Oil G) / 58°C / Transfer 12 sn |
| Temperleme | 198°C / 120 dk / Hava (AF-01) |
| Sertlik Sonucu | HRC 58-62 (tum parcalar spec icinde) |
| TUS Rapor No | TUS-VF01-2026-0315 |
| SAT Rapor No | SAT-VF01-2026-0401 |
| Termokupl Kalibrasyon No | TC-VF01-2026-0320 |
| Onaylayan | Kalite Muduru |
| NADCAP Uyumluluk | Evet |
| Not | Tum parcalar AMS 2759/1 gerekliliklerini karsilamaktadir. Parca 2 yeniden islem gormus olup nihai sertlik degeri HRC 60.0'dir (NCR-2026-0042 ref). 20/20 parca KABUL. |

**Dogrulama:**
- [ ] Sertifika kaydi olusturuldu (201 Created)
- [ ] Sertifika numarasi benzersiz
- [ ] Firin, recete, sicaklik parametreleri dogru
- [ ] Sertlik sonuclari kaydedildi
- [ ] TUS/SAT referans numaralari mevcut
- [ ] NADCAP uyumluluk isaretlendi
- [ ] NCR referansi notlarda belirtildi (Parca 2)

---

## Adim 23: Sertlik Test Raporu Hazirlama
**Ekran:** Kalite > Muayene Raporu veya MaterialCertificate ek dokuman
**API:** Mevcut Inspection kayitlari uzerinden rapor ciktisi
**Rol:** Kalite Muduru

**ACIKLAMA:** 20 parcanin tamaminin sertlik olcum degerlerini iceren detayli rapor
hazirlanir. Bu rapor isil islem sertifikasinin eki olarak musteriye teslim edilecektir.

**Rapor Icerigi:**

| Alan | Deger |
|------|-------|
| Rapor No | STR-2026-0042-001 |
| Tarih | 2026-04-12 |
| Test Cihazi | Rockwell Sertlik Olcer — Model: Wilson RB2000 |
| Kalibrasyon Durumu | Gecerli (son kalibrasyon: 2026-02-15, sonraki: 2026-08-15) |
| Test Skalasi | Rockwell C (HRC) |
| Olcum Noktasi Sayisi | 3 nokta/parca |
| Toplam Olcum | 60 olcum (20 parca x 3 nokta) |
| Min Deger | HRC 58 |
| Max Deger | HRC 62 |
| Ortalama | HRC 59.7 |
| Kabul Kriteri | HRC 58-62 (AMS 2759/1) |
| Sonuc | 20/20 KABUL (%100 uygunluk) |

**Dogrulama:**
- [ ] Sertlik test raporu olusturu/goruntulenebildi
- [ ] Tum parca sonuclari listelendi
- [ ] Min/max/ortalama degerleri dogru
- [ ] Test cihazi kalibrasyon bilgisi mevcut

---

## Adim 24: Kalibrasyon Kaydi Guncelleme (Firin Kullanim Sayisi)
**Ekran:** Kalite > Kalibrasyon > VF-01 Detay
**API:** PUT /Calibration/{id}
**Rol:** Kalite Muduru

**Veri:**

| Alan | Deger |
|------|-------|
| Ekipman | VF-01 — Vakum Firin 1 |
| Son Kullanim Tarihi | 2026-04-11 |
| Toplam Kullanim (ay icinde) | 18 cevrim |
| Sonraki TUS Tarihi | 2026-06-15 |
| Sonraki SAT Tarihi | 2026-05-01 |
| Not | Is emri IE-2026-0410-001 icin kullanildi. 20 adet 4140 disli sertlestirme + temperleme. |

**Dogrulama:**
- [ ] Firin kullanim kaydi guncellendi
- [ ] Kullanim sayisi artirildi
- [ ] Sonraki kalibrasyon tarihleri degismedi (suresi gecmemis)

---

## Adim 25: Sevkiyat Hazirligi ve Teslim
**Ekran:** Sevkiyat / SubcontractOrder Teslim
**API:** PUT /SubcontractOrder/{id} (durum guncelleme)
**Rol:** Yonetici (Admin)

**Veri:**

| Alan | Deger |
|------|-------|
| Fason Is No | FI-2026-0042 |
| Teslim Tarihi | 2026-04-12 |
| Teslim Edilen Adet | 20 |
| Teslim Alan | Kemal Ozturk (Yildiz CNC — Uretim Planlama Sefi) |
| Ekli Dokumanlar | IIS-2026-0042-001 (Isil Islem Sertifikasi), STR-2026-0042-001 (Sertlik Test Raporu) |
| Sevkiyat Notu | 20 adet 4140 celik disli isil islem tamamlanmis olarak teslim edildi. Isil islem sertifikasi ve sertlik test raporu ekte. NADCAP uyumlu dokumantasyon saglanmistir. |
| Durum | Tamamlandi |

**Dogrulama:**
- [ ] SubcontractOrder durumu "Tamamlandi" olarak guncellendi
- [ ] Teslim tarihi ve adedi kaydedildi
- [ ] Sertifika ve rapor referanslari baglandi
- [ ] Sevkiyat notu girildi

---

## Adim 26: Fatura Olusturma (Fason Iscilik Faturasi)
**Ekran:** Muhasebe > Fatura > Yeni Fatura
**API:** POST /Invoice
**Rol:** Yonetici (Admin)

**Veri:**

| Alan | Deger |
|------|-------|
| Fatura No | FTR-2026-0412-001 |
| Fatura Tarihi | 2026-04-12 |
| Musteri | Yildiz CNC Hassas Imalat San. ve Tic. A.S. |
| Fatura Tipi | Satis Faturasi |
| Iliskili Fason Is | FI-2026-0042 |

**Kalemler:**

| Sira | Aciklama | Birim | Miktar | Birim Fiyat | Tutar |
|------|----------|-------|--------|-------------|-------|
| 1 | 4140 Celik Disli — Sertlestirme + Temperleme (AMS 2759/1) | Adet | 20 | 350.00 TL | 7,000.00 TL |
| 2 | Yeniden Isil Islem (NCR-2026-0042, Parca 2) | Adet | 1 | 0.00 TL | 0.00 TL |

| | Tutar |
|---|-------|
| Ara Toplam | 7,000.00 TL |
| KDV (%20) | 1,400.00 TL |
| Genel Toplam | 8,400.00 TL |

**NOT:** Yeniden isil islem (Parca 2) firma hatasi kaynakli oldugu icin musteriye fatura edilmez.
Fatura kalemi olarak 0.00 TL ile gosterilerek kayit altina alinir.

**Dogrulama:**
- [ ] Fatura olusturuldu (201 Created)
- [ ] Fatura numarasi benzersiz
- [ ] 2 kalem dogru girildi (isil islem + yeniden islem)
- [ ] Yeniden islem 0.00 TL olarak fatura edildi
- [ ] KDV hesaplamasi dogru (%20)
- [ ] Genel toplam 8,400.00 TL
- [ ] SubcontractOrder ile iliskilendirildi

---

# ══════════════════════════════════════════════════════════════
# BOLUM 7: IKINCI MUSTERI SENARYOSU — NITRURLEME
# ══════════════════════════════════════════════════════════════

## Adim 27: Ikinci Musteri Kaydi — Defne Makina
**Ekran:** Musteri Yonetimi > Yeni Musteri
**API:** POST /Customer
**Rol:** Yonetici (Admin)

**Veri:**

| Alan | Deger |
|------|-------|
| Firma Adi | Defne Makina Sanayi ve Tic. Ltd. Sti. |
| Kisa Adi | Defne Makina |
| Tipi | Musteri |
| Vergi Dairesi | Ikitelli |
| Vergi No | 7890123456 |
| Telefon | 0212 549 3300 |
| E-posta | uretim@defnemakina.com.tr |
| Adres | Ikitelli OSB, Deri Yan San. Sit. 3. Blok No:17, Basaksehir / Istanbul |
| Sektor | Savunma — Hassas Mekanik Parca |
| Notlar | Plazma nitrurleme talepleri. AS9100 sertifikali. Yuzey sertligi + nitrur derinlik raporu zorunlu. |

**Dogrulama:**
- [ ] Musteri kaydi olusturuldu (201 Created)
- [ ] Musteri listesinde gorunuyor

---

## Adim 28: Nitrurleme Fason Is Alimi
**Ekran:** Fason Isler > Yeni Fason Is Emri
**API:** POST /SubcontractOrder
**Rol:** Yonetici (Admin)

**Veri:**

| Alan | Deger |
|------|-------|
| Musteri | Defne Makina Sanayi ve Tic. Ltd. Sti. |
| Is Emri No | FI-2026-0045 |
| Tarih | 2026-04-12 |
| Termin | 2026-04-19 |
| Parca Adi | 4140 Celik Saft — D=45mm, L=320mm |
| Parca Kodu | DFN-SFT-4140-045 |
| Malzeme | AISI 4140 (42CrMo4) — On isil islem gormus (sertlestirilmis + temperlenmis, HRC 28-32) |
| Adet | 10 |
| Istenen Islem | Plazma Nitrurleme |
| Hedef Yuzey Sertligi | HV 700+ (Vickers) |
| Hedef Nitrur Derinligi | 0.3 — 0.5 mm |
| Referans Standart | AMS 2759/10 (Automated Gaseous Nitriding) |
| Birim Fiyat | 500.00 TL/adet |
| Toplam Tutar | 5,000.00 TL + KDV |
| Notlar | On isil islem gormus saftlar (HRC 28-32). Plazma nitrurleme sonrasi yuzey HV 700+ ve nitrur tabaka 0.3-0.5mm bekleniyor. Maskeli bolge: Saft uclari (her iki uctan 15mm). |

**Dogrulama:**
- [ ] SubcontractOrder olusturuldu (201 Created)
- [ ] Parca bilgileri dogru
- [ ] Nitrur derinlik hedefi notlarda mevcut (0.3-0.5mm)
- [ ] Maskeleme bilgisi kayitli

---

## Adim 29: Nitrurleme Recetesi ve Is Emri
**Ekran:** Uretim > Operasyon Routing + Yeni Is Emri
**API:** POST /OperationRouting + POST /WorkOrder
**Rol:** Yonetici + Operator

**Recete: RCP-4140-PLAZMA-NIT (4140 Plazma Nitrurleme)**

| Operasyon | Kod | Islem | Parametre | Sure | Ekipman | Not |
|-----------|-----|-------|-----------|------|---------|-----|
| Op10 | TEM | Temizlik + Yaglama Giderme | Solvent temizlik + ultrasonik | 30 dk | Temizlik Unitesi | Yuzey yagsiz ve temiz olmali |
| Op20 | MSK | Maskeleme | Saft uclari (15mm) Cu bant | 20 dk | Manuel | Nitrur istenmeiyen bolgelere Cu bant |
| Op30 | YUK | Yukleme | Dikey pozisyon | 15 dk | Plazma Firin PF-01 | Saftlar dikey, aralarda 20mm |
| Op40 | IST | Sputter Temizlik (Plazma) | H2 plazma, 350°C | 60 dk | PF-01 | Yuzey aktivasyonu |
| Op50 | NIT | Plazma Nitrurleme | 520°C, %25 N2 + %75 H2 | 480 dk (8 saat) | PF-01 | AMS 2759/10 parametreleri |
| Op60 | SOG | Firindan Sogutma | N2 atmosferde | 120 dk | PF-01 | Kontrollü sogutma |
| Op70 | MSC | Maske Cikarma + Temizlik | Cu bant cikarma | 15 dk | Manuel | Maskeleme kontrolu |

**Is Emri:**

| Alan | Deger |
|------|-------|
| Is Emri No | IE-2026-0412-002 |
| Iliskili Fason Is | FI-2026-0045 |
| Adet | 10 |
| Recete | RCP-4140-PLAZMA-NIT |
| Firin | PF-01 (Plazma Nitrurleme Firini) |

**Operator Kayitlari (ozet):**
Operator tum operasyonlari ShopFloor'dan kaydeder:
- Temizlik: Tamamlandi
- Maskeleme: Cu bant uygulanmis
- Sputter: 350°C, 60 dk, H2 plazma
- Nitrurleme: 520°C, 480 dk, %25 N2 + %75 H2, voltaj 650V, akim 8A
- Sogutma: N2 atmosferde 120 dk

**Dogrulama:**
- [ ] Recete 7 operasyon ile tanimlandi
- [ ] Is emri olusturuldu ve recete baglandi
- [ ] Tum operasyonlar ShopFloor'dan kaydedildi
- [ ] Nitrurleme parametreleri (sicaklik, gaz oranlari, sure) kayitli

---

## Adim 30: Nitrurleme Sonrasi Kalite Kontrol
**Ekran:** Kalite > Muayene > Yeni Muayene
**API:** POST /Inspection
**Rol:** Kalite Muduru

**ACIKLAMA:** Nitrurleme sonrasi yuzey sertligi (Vickers) ve nitrur tabaka derinligi
olculur. Nitrur derinlik icin ayri alan bulunmadigi icin muayene notuna yazilir.

**Yuzey Sertlik Test Sonuclari (Vickers — HV 0.5):**

| Parca No | Olcum 1 (HV) | Olcum 2 (HV) | Olcum 3 (HV) | Ortalama | Karar |
|----------|-------------|-------------|-------------|----------|-------|
| 1 | 720 | 735 | 728 | 727.7 | KABUL |
| 2 | 715 | 722 | 730 | 722.3 | KABUL |
| 3 | 740 | 738 | 745 | 741.0 | KABUL |
| 4 | 710 | 718 | 725 | 717.7 | KABUL |
| 5 | 730 | 742 | 735 | 735.7 | KABUL |
| 6 | 725 | 720 | 732 | 725.7 | KABUL |
| 7 | 718 | 730 | 722 | 723.3 | KABUL |
| 8 | 735 | 740 | 738 | 737.7 | KABUL |
| 9 | 712 | 720 | 715 | 715.7 | KABUL |
| 10 | 728 | 732 | 725 | 728.3 | KABUL |

**Nitrur Tabaka Derinligi (metalografik kesit — numune parca uzerinden):**

| Olcum | Deger | Kabul Kriteri | Karar |
|-------|-------|---------------|-------|
| Numune 1 — sol | 0.38 mm | 0.3 — 0.5 mm | KABUL |
| Numune 1 — orta | 0.42 mm | 0.3 — 0.5 mm | KABUL |
| Numune 1 — sag | 0.40 mm | 0.3 — 0.5 mm | KABUL |
| Maskeleme Kontrolu | Saft uclari nitrursuz (Cu bant etkili) | Maske bolgesi yumusak | KABUL |

**Muayene Notu:**
> 10 adet 4140 saft plazma nitrurleme sonrasi muayene. Yuzey sertligi HV 710-745
> araliginda — tum parcalar HV 700+ hedefini karsilamaktadir. Nitrur tabaka derinligi
> metalografik kesit ile 0.38-0.42mm olarak olculdu (hedef 0.3-0.5mm, UYGUN).
> Maskeleme kontrolu: saft uclari nitrur almamis, Cu bant maskeleme basarili.
> 10/10 parca KABUL.

**Dogrulama:**
- [ ] Muayene kaydi olusturuldu (201 Created)
- [ ] Yuzey sertlik degerleri (Vickers HV) kaydedildi
- [ ] Nitrur derinlik olcumleri muayene notuna yazildi (0.38-0.42mm)
- [ ] Maskeleme kontrolu notu girildi
- [ ] 10/10 parca KABUL
- [ ] NCR gerekmiyor (%0 ret)

---

## Adim 31: Nitrurleme Sertifikasi + Fatura
**Ekran:** Kalite > Malzeme Sertifikasi + Muhasebe > Fatura
**API:** POST /MaterialCertificate + POST /Invoice
**Rol:** Kalite Muduru (sertifika) + Yonetici (fatura)

**Sertifika Verisi:**

| Alan | Deger |
|------|-------|
| Sertifika No | IIS-2026-0045-001 |
| Sertifika Tipi | Isil Islem Sertifikasi (Nitrurleme) |
| Musteri | Defne Makina |
| Parca | 4140 Celik Saft — DFN-SFT-4140-045 |
| Adet | 10 |
| Islem | Plazma Nitrurleme |
| Firin | PF-01 |
| Nitrurleme Sicakligi | 520°C / 8 saat |
| Gaz Karisimi | %25 N2 + %75 H2 |
| Yuzey Sertligi | HV 710-745 (hedef: HV 700+) |
| Nitrur Derinligi | 0.38-0.42 mm (hedef: 0.3-0.5 mm) |
| Referans Standart | AMS 2759/10 |
| Sonuc | 10/10 KABUL |

**Fatura Verisi:**

| Alan | Deger |
|------|-------|
| Fatura No | FTR-2026-0419-002 |
| Musteri | Defne Makina |
| Iliskili Fason Is | FI-2026-0045 |

| Sira | Aciklama | Birim | Miktar | Birim Fiyat | Tutar |
|------|----------|-------|--------|-------------|-------|
| 1 | 4140 Celik Saft — Plazma Nitrurleme (AMS 2759/10) | Adet | 10 | 500.00 TL | 5,000.00 TL |

| | Tutar |
|---|-------|
| Ara Toplam | 5,000.00 TL |
| KDV (%20) | 1,000.00 TL |
| Genel Toplam | 6,000.00 TL |

**Dogrulama:**
- [ ] Nitrurleme sertifikasi olusturuldu
- [ ] Yuzey sertlik ve nitrur derinlik bilgileri sertifikada mevcut
- [ ] Fatura olusturuldu (5,000 TL + KDV)
- [ ] SubcontractOrder durumu "Tamamlandi"

---

# ══════════════════════════════════════════════════════════════
# BOLUM 8: RAPORLAMA ve TEDARIKCI DEGERLENDIRME
# ══════════════════════════════════════════════════════════════

## Adim 32: Ay Sonu Raporlari
**Ekran:** Raporlar (cesitli)
**API:** GET /Report/* endpointleri
**Rol:** Yonetici + Kalite Muduru

**32a. Firin Kullanim Orani Raporu:**

| Firin | Cevrim Sayisi (Nisan) | Kapasite | Kullanim Orani |
|-------|-----------------------|----------|----------------|
| VF-01 (Vakum Firin 1) | 18 | 25 | %72 |
| VF-02 (Vakum Firin 2) | 12 | 25 | %48 |
| AF-01 (Atmosfer Firin 1) | 22 | 30 | %73 |
| PF-01 (Plazma Firin) | 8 | 15 | %53 |
| AF-02 (Atmosfer Firin 2) | 5 | 30 | %17 |

**32b. Ret Orani Raporu:**

| Ay | Toplam Parca | Ret | Oran | Kok Neden |
|----|-------------|-----|------|-----------|
| Nisan 2026 | 340 | 4 | %1.2 | 2x sicaklik sapmasi, 1x sondurme gecikmesi, 1x malzeme hatasi |
| Mart 2026 | 310 | 2 | %0.6 | 1x kalibrasyon, 1x operator |
| Subat 2026 | 285 | 3 | %1.1 | 2x sicaklik, 1x gaz karisim |

**32c. Musteri Bazli Is Hacmi:**

| Musteri | Is Sayisi | Parca Adedi | Ciro (KDV Haric) |
|---------|-----------|-------------|-----------------|
| Yildiz CNC | 8 | 145 | 48,500 TL |
| Defne Makina | 5 | 62 | 31,000 TL |
| Koroglu Savunma | 3 | 88 | 22,400 TL |
| Diger | 6 | 45 | 12,600 TL |
| **TOPLAM** | **22** | **340** | **114,500 TL** |

**Dogrulama:**
- [ ] Firin kullanim raporu goruntulenebildi
- [ ] Ret orani raporu mevcut ve NCR kayitlari ile uyumlu
- [ ] Musteri bazli ciro raporu dogru
- [ ] Raporlar tarih araligina gore filtrelenebildi

---

## Adim 33: Tedarikci Degerlendirme (Gaz Tedarikcisi)
**Ekran:** Musteri Yonetimi > Tedarikci Detay > Degerlendirme
**API:** POST /SupplierEvaluation veya /CustomerEvaluation
**Rol:** Yonetici (Admin)

**Veri — Linde Gaz Degerlendirmesi:**

| Kriter | Puan (1-5) | Aciklama |
|--------|-----------|----------|
| Teslim Zamanliligi | 5 | Siparisler zamaninda, genelde 1-2 gun once |
| Urun Kalitesi | 5 | Gaz safligi sertifikalari tam, spec'e uygun |
| Fiyat Rekabetciligi | 3 | Piyasa ortalamasinin %10 uzerinde |
| Iletisim/Destek | 4 | Teknik destek iyi, acil teslimat zayif |
| Dokumantasyon | 5 | Lot bazli saflik sertifikalari tam |
| Genel Ortalama | **4.4 / 5.0** | |

**Degerlendirme Notu:**
> Linde Gaz 2026 Q1 performansi genel olarak iyi. Gaz safligi ve dokumantasyon
> mukemmel. Fiyat konusunda alternatif teklifler degerlendirilebilir. Acil teslimat
> kapasitesi iyilestirilmeli (hafta sonu ve resmi tatil teslimat yok).
> Oneri: Sozlesme yenilemede fiyat indirimi muzakeresi + acil teslimat kosulueklenmesi.

**Dogrulama:**
- [ ] Tedarikci degerlendirme kaydi olusturuldu
- [ ] 5 kriter puanlandi
- [ ] Genel ortalama dogru hesaplandi (4.4)
- [ ] Degerlendirme notu kaydedildi
- [ ] Tedarikci gecmis degerlendirmeleri listelenebiliyor

---

# ══════════════════════════════════════════════════════════════
# ROL BAZLI ERISIM TESTLERI
# ══════════════════════════════════════════════════════════════

## Ek Test A: Operator Erisim Kisitlamalari
**Rol:** Operator

**Test Edilecek Kisitlamalar:**

| Islem | Beklenen Sonuc |
|-------|---------------|
| Musteri listesi goruntulem | ENGELLENDI — 403 Forbidden |
| Fason is emri olusturma | ENGELLENDI — 403 Forbidden |
| Fiyat bilgisi goruntuleme | ENGELLENDI — fiyat alanlari gizli |
| ShopFloor operasyon kaydi | ERISIM VAR — normal calisir |
| Sertlik testi sonucu girme | ENGELLENDI — 403 Forbidden (sadece Kalite Muduru) |
| Kalibrasyon kaydi goruntuleme | ENGELLENDI — 403 Forbidden |
| Raporlar | ENGELLENDI — 403 Forbidden |
| Kendi operasyon gecmisi | ERISIM VAR — sadece kendi kayitlari |

**Dogrulama:**
- [ ] Operator sadece ShopFloor ekranina erisebiliyor
- [ ] Musteri, fiyat, rapor sayfalari engelleniyor
- [ ] Kalite islemleri engelledniyor
- [ ] 403 hatasi dogru donuyor (NotAuthorized sayfasina yonlendirme)

---

## Ek Test B: Kalite Muduru Erisim Kontrolu
**Rol:** Kalite Muduru

**Test Edilecek Erisimler:**

| Islem | Beklenen Sonuc |
|-------|---------------|
| Muayene kaydi olusturma | ERISIM VAR |
| NCR olusturma/kapatma | ERISIM VAR |
| Sertifika hazirlama | ERISIM VAR |
| Kalibrasyon kaydi | ERISIM VAR |
| Fason is emri olusturma | ENGELLENDI — 403 Forbidden |
| Fatura olusturma | ENGELLENDI — 403 Forbidden |
| Fiyatlandirma | ENGELLENDI — fiyat alanlari gizli |
| Kalite raporlari | ERISIM VAR (sadece kalite raporlari) |
| Musteri kaydi olusturma | ENGELLENDI — 403 Forbidden |

**Dogrulama:**
- [ ] Kalite Muduru kalite modulllerine tam erisebiliyor
- [ ] Muhasebe ve satis islemleri engelleniyor
- [ ] Fiyat bilgileri gorunmuyor
- [ ] Kalite raporlari erisilebilir

---

## Ek Test C: Yonetici (Admin) Tam Erisim
**Rol:** Yonetici (Admin)

**Test Edilecek Erisimler:**

| Islem | Beklenen Sonuc |
|-------|---------------|
| Musteri CRUD | ERISIM VAR |
| SubcontractOrder CRUD | ERISIM VAR |
| Is emri CRUD | ERISIM VAR |
| Fatura CRUD | ERISIM VAR |
| Raporlar (tumu) | ERISIM VAR |
| Kalibrasyon (goruntule) | ERISIM VAR |
| NCR (goruntule) | ERISIM VAR |
| Fiyatlandirma | ERISIM VAR |
| Kullanici yonetimi | ERISIM VAR |

**Dogrulama:**
- [ ] Admin tum ekranlara erisebiliyor
- [ ] Fiyatlandirma ve finansal veriler gorunuyor
- [ ] Kullanici yonetimi aktif

---

# ══════════════════════════════════════════════════════════════
# SENARYO OZETI ve BASARI KRITERLERI
# ══════════════════════════════════════════════════════════════

## Kapsam Ozeti

| Bolum | Adim Sayisi | Kapsanan Moduller |
|-------|-------------|-------------------|
| Musteri/Tedarikci Tanimlari | 3 | Customer, CustomerContact |
| Fason Is Alimi + Mal Kabul | 3 | SubcontractOrder, Inspection, SerialNumber/Traceability |
| Kalibrasyon + Recete | 2 | Calibration, OperationRouting |
| Uretim (Isil Islem) | 7 | WorkOrder, WorkOrderOperation, ShopFloor |
| Kalite Kontrol + NCR | 6 | Inspection, NonConformanceReport |
| Sertifika + Sevkiyat + Fatura | 5 | MaterialCertificate, SubcontractOrder, Invoice |
| Ikinci Musteri (Nitrurleme) | 5 | (ayni moduller, farkli recete) |
| Raporlama + Tedarikci Deg. | 2 | Report, SupplierEvaluation |
| **TOPLAM** | **33** | **12 modul** |

## Basari Kriterleri

Senaryo asagidaki TUM kriterleri karsiladiginda BASARILI sayilir:

- [ ] 33 adimin tamami hatasiz tamamlandi
- [ ] 2 farkli musteri, 2 farkli isil islem tipi (sertlestirme, nitrurleme) test edildi
- [ ] Fason is alimi → islem → kalite kontrol → sertifika → teslim → fatura dongusu tamamlandi
- [ ] NCR acma → kok neden analizi → yeniden islem → NCR kapatma dongusu calisiyor
- [ ] Isil islem sertifikasi AMS 2759 referanslarini iceriyor
- [ ] Sertlik testi sonuclari (HRC ve HV) dogru kaydedildi
- [ ] Firin kalibrasyon kayitlari (TUS/SAT) goruntulenebildi
- [ ] Izlenebilirlik: lot numarasi → isil islem kaydi → sertifika zinciri izlenebildi
- [ ] Fatura dogru tutarlarda olusturuldu (yeniden islem 0 TL)
- [ ] 3 rol (Yonetici, Kalite Muduru, Operator) erisim kontrolu calisiyor
- [ ] Raporlar (firin kullanimi, ret orani, musteri ciro) goruntulenebildi

## Toplam Dogrulama Sayisi

| Kategori | Onay Kutusu Sayisi |
|----------|-------------------|
| Ana Senaryo (33 adim) | ~130 |
| Rol Bazli Testler (3 ek) | ~25 |
| **TOPLAM** | **~155 dogrulama noktasi** |

---

## Referans Standartlar

| Standart | Konu | Kullanim |
|----------|------|----------|
| AMS 2759/1 | Carbon/Low-Alloy Steel Isil Islem | Sertlestirme + Temperleme parametreleri |
| AMS 2759/10 | Automated Gaseous Nitriding | Plazma nitrurleme parametreleri |
| AMS 2750E | Pyrometry | Firin kalibrasyonu, TUS/SAT, siniflandirma |
| AS9100 Rev D | Havacilik/Savunma Kalite Yonetimi | Genel kalite sistemi gereklilikleri |
| NADCAP AC7102 | Heat Treating | Ozel proses onay gereklilikleri |

---

## Senaryo Hazirlayan

| Alan | Deger |
|------|-------|
| Hazirlayan | QA Muhendisi |
| Tarih | 2026-04-10 |
| Versiyon | 1.0 |
| Durum | Taslak — Gozden Gecirme Bekliyor |

---

> **NOT:** Bu senaryo bir fason (job-shop) isil islem isletmesinin Quvex ERP uzerindeki
> tum is akislarini kapsamaktadir. Gercek uretim ortaminda ek olarak firin atmosfer
> kontrolu (oksijen probe), sondurme egrisi (cooling curve) kaydi ve otomatik sicaklik
> loglama (SCADA entegrasyonu) gibi ozellikler de bulunabilir ancak bu ozellikler
> Quvex'in mevcut modul yapisinda desteklenmemektedir (bkz. Bilinen Kisitlamalar).
