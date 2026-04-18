# Quvex ERP — Kaynak Atolyesi + Medikal Cihaz UX Denetimi

> Tarih: 2026-04-10
> Yontem: Kod seviyesinde derin inceleme + persona simulasyonu + E2E senaryo capraz okuma
> Kapsam: 2 nis sektor (Savunma Kaynak + Medikal Implant)
> Referans: CNC-USER-JOURNEY-UX-AUDIT.md, KAYNAK-ATOLYESI-E2E-SENARYO.md, MEDIKAL-CIHAZ-E2E-SENARYO.md

---

## YONETICI OZETI

Iki sektor de AS9100 / ISO 13485 gibi **yuksek duzenleyici cerceve** gerektiren nis pazarlar. Quvex'in mevcut kalite/uretim/izlenebilirlik altyapisi %70-80 oraninda bu ihtiyaclari karsiliyor — ancak sektore ozel "kritik" is akislari (WPS/WPQR, UDI, sterilizasyon validasyonu, recall) **modul duzeyinde eksik**. E2E senaryolar bu eksikleri 8-10 "workaround" olarak kodlamis — yani "not alanina yaz" ile gecilen yerler var.

**Buyuk resim:** Quvex bu sektorleri bugun satabilir (kalite temelleri hazir), ama **premium fiyati ancak sektor-spesifik modul tamamlanirsa** gerceklesir. AS9100/ISO 13485 musterileri "not alanina yazdim" ile mutlu olmaz — denetci kayit ister.

---

## EKIP — KAYNAK ATOLYESI

| Rol | Isim | Persona |
|-----|------|---------|
| **Patron** | Ozdemir Bey, 52 | TIG/GTAW kaynak atolyesi sahibi, TAI alt yuklenici |
| **Uretim Muduru** | Kemal Bey | Kaynak operasyonu yonetici, 15 yillik deneyim |
| **Kaynakci** | Yusuf Usta, 42 | AWS D17.1 6G sertifikali, eldivenli, mesafeli |
| **Kaliteci** | Hatice Hanim | NDT muayene + sertifika takibi |
| **Muhendis** | Onur Bey | WPS/WPQR yazan metalurji muhendisi |

## EKIP — MEDIKAL CIHAZ

| Rol | Isim | Persona |
|-----|------|---------|
| **Patron** | MedTek Bey, 48 | Ortopedik vida ureticisi, Acibadem tedarikcisi |
| **Uretim Muduru** | Demet Hanim | Swiss CNC + temiz oda koordinasyonu |
| **Operator** | Tarik Usta | Lazer markalama + pasivizasyon |
| **Kaliteci** | Banu Hanim | ISO 13485 + risk yonetimi + FAI |
| **Regulatory** | Sezgin Bey | MDR/UDI/EUDAMED sorumlusu |

---

## SKORLAR — EKRAN BAZLI (KAYNAK ATOLYESI)

| Ekran | Persona | Karmasiklik | Kullanilabilirlik | Mobile | Help | Genel |
|-------|---------|-------------|-------------------|--------|------|-------|
| **Register + Onboarding** | Ozdemir | 3/10 | 8/10 | 8/10 | 7/10 | **7/10** |
| **MachinesForm** (TIG-01..04) | Ozdemir | 5/10 | 8/10 | 7/10 | 4/10 | **6/10** |
| **WorkOrderSteps** (OP10..OP100) | Onur | 6/10 | 7/10 | 5/10 | 4/10 | **6/10** |
| **CalibrationManagement** (MIK/AMP/VOLT) | Hatice | 6/10 | 8/10 | 5/10 | 7/10 | **7/10** |
| **TrainingManagement** (Kaynakci sert.) ⚠️ | Hatice | 5/10 | **4/10** | 5/10 | **3/10** | **4/10** |
| **ControlPlanManagement** (WPS workaround) ⚠️ | Onur | **8/10** | 5/10 | 4/10 | 4/10 | **5/10** |
| **ProductForm** (Fuze braketi) ⚠️ | Kemal | **9/10** | 3/10 | 5/10 | 3/10 | **3/10** |
| **OfferForm** (TAI RFQ) | Kemal | 6/10 | 6/10 | 6/10 | 5/10 | **6/10** |
| **SalesForm** | Kemal | 5/10 | 7/10 | 6/10 | 5/10 | **6/10** |
| **ProductionGantt** (Paso planlama) | Kemal | 7/10 | 5/10 | 3/10 | 4/10 | **5/10** |
| **ShopFloorTerminal** (Paso paso) | Yusuf | 2/10 | 8/10 | 9/10 | 4/10 | **7/10** |
| **OperationInspections** (VT/NDT) | Hatice | 5/10 | 7/10 | 6/10 | 5/10 | **6/10** |
| **NcrList** (Kaynak hatasi) | Hatice | 6/10 | 7/10 | 6/10 | 6/10 | **7/10** |
| **SubcontractOrderList** (Isil islem + NDT) ⚠️ | Kemal | 6/10 | 6/10 | 4/10 | 4/10 | **5/10** |
| **SpecialProcessManagement** (NADCAP) | Hatice | 7/10 | 6/10 | 5/10 | 5/10 | **6/10** |
| **FaiManagement** (AS9102) | Hatice | 6/10 | 7/10 | 5/10 | 6/10 | **6/10** |
| **SerialNumberList** (Trace) | Hatice | 5/10 | 7/10 | 6/10 | 5/10 | **6/10** |

**Kaynak sektoru ortalama: 5.7/10** — CNC'den 0.7 puan dusuk. Sebebi: **WPS/WPQR/kaynakci sertifika/heat input** is akislari icin ayri modul yok.

## SKORLAR — EKRAN BAZLI (MEDIKAL CIHAZ)

| Ekran | Persona | Karmasiklik | Kullanilabilirlik | Mobile | Help | Genel |
|-------|---------|-------------|-------------------|--------|------|-------|
| **ProductForm** (Ti vida + UDI) ⚠️ | MedTek | **9/10** | 3/10 | 5/10 | 2/10 | **3/10** |
| **CustomerForm** (Hastane grubu) | MedTek | 6/10 | 6/10 | 5/10 | 4/10 | **5/10** |
| **ControlPlanManagement** (Risk+ISO 14971 workaround) ⚠️ | Banu | 8/10 | 5/10 | 4/10 | 4/10 | **5/10** |
| **CalibrationManagement** (CMM/Optik) | Banu | 6/10 | 8/10 | 5/10 | 7/10 | **7/10** |
| **OperationInspections** (Temiz oda) | Banu | 5/10 | 7/10 | 6/10 | 5/10 | **6/10** |
| **SpecialProcessManagement** (Pasivizasyon) | Banu | 7/10 | 6/10 | 5/10 | 5/10 | **6/10** |
| **ShopFloorTerminal** (Lazer + UDI) ⚠️ | Tarik | 3/10 | 7/10 | 9/10 | 4/10 | **6/10** |
| **SubcontractOrderList** (EtO sterilizasyon) ⚠️ | Demet | 6/10 | 6/10 | 4/10 | 4/10 | **5/10** |
| **SerialNumberList** (Lot+UDI) ⚠️ | Sezgin | 5/10 | 6/10 | 6/10 | 4/10 | **5/10** |
| **FaiManagement** (ilk parca) | Banu | 6/10 | 7/10 | 5/10 | 6/10 | **6/10** |
| **NcrList + 8D + CAPA** (Recall!) ⚠️ | Banu | 7/10 | 6/10 | 5/10 | 5/10 | **5/10** |
| **DocumentApprovalList** (Teknik dosya) | Sezgin | 6/10 | 7/10 | 5/10 | 5/10 | **6/10** |
| **TrainingManagement** (Temiz oda sert.) | Banu | 5/10 | 5/10 | 5/10 | 3/10 | **4/10** |
| **RiskFmeaManagement** ⚠️ | Banu | **9/10** | 4/10 | 4/10 | 3/10 | **4/10** |
| **ProductionGantt** (Temiz oda slot) | Demet | 7/10 | 5/10 | 3/10 | 4/10 | **5/10** |

**Medikal sektoru ortalama: 5.3/10** — En dusuk sektor. Sebebi: **UDI, sterilizasyon validasyonu, biyouyumluluk, recall, risk yonetimi** 5 kritik modul eksik.

---

## KAYNAK — KRITIK BULGULAR

### P0 — WPS/WPQR Modulu Yok
**Sorun:** Kaynakta en onemli dokuman WPS (Welding Procedure Specification). Quvex'te modul yok, kontrol planina "referans" olarak yaziliyor.
**Denetci:** "WPS-001 Rev B aktif mi? Hangi WPQR destekliyor? Hangi lot'ta kullanildi?" — Quvex cevabi yok.
**Fix:** Document Control uzerine **WPS template + WPQR referans tablosu** — 5-8 gun.

### P0 — Kaynakci Sertifika Suresi Otomatik Uyari Yok
**Sorun:** AWS D17.1 6G sertifikasi 6 ayda bir yenilenir. Quvex **TrainingManagement**'ta egitim kaydi var ama **son kullanma uyarisi yok**.
**Senaryo:** Yusuf Usta'nin sertifikasi 2 hafta sonra dolacak, kimse bilmiyor. Ust paso yaparken sertifika expire. Denetci NCR yazar.
**Fix:** TrainingManagement'e `expiryDate` + 30/60/90 gun onceden bildirim + dashboard widget. 2 gun.

### P0 — Heat Input Otomatik Hesaplama Yok
**Sorun:** HI = (V x A x 60) / (Hiz mm/dk x 1000) — operator not alanina manuel yaziyor. Havacilikta toleranslar sikidir (tipik 0.5-2.5 kJ/mm).
**Fix:** ShopFloorTerminal'e voltaj/amperaj/hiz girdiginde **otomatik HI kart** goster. 1 gun.

### P0 — NDT (Rontgen) Dosya Yukleme Ozel Alani Yok
**Sorun:** Rontgen filmi / dijital goruntu genel attachment. **Kabul/red decision kaydi, muayene personeli sertifika no (ASNT Level II)** yok.
**Fix:** OperationInspections'a NDT-specific form: `method (RT/UT/PT/MT)`, `inspector`, `certLevel`, `result`, `filmImage`. 3 gun.

### P1 — Pasolar Arasi Sicaklik (Interpass) Kayit Yok
**Sorun:** Nikel alasim, paslanmaz celik kaynaginda interpass temp **kritik**. Simdilik not alanina yaziliyor.
**Fix:** ShopFloorTerminal'de her paso girisinde `interpassTemp` required field. 1 gun.

### P1 — Fason Isil Islem Gonderim/Takibi
**Sorun:** SubcontractOrder var ama "gerilim giderme sicaklik-sure diagrami" ozel alan yok. Sertifika karsilasma manuel.
**Fix:** SubcontractOrder type=`HEAT_TREATMENT` ise: setpoint temp, ramp, hold, cooling rate alanlari. 2 gun.

### P1 — Koruyucu Gaz / Purge O2 Kayit Yok
**Sorun:** Ti-6Al-4V kaynaginda O2 < 50 ppm sart. Kayit yok.
**Fix:** Operasyon parametrelerine custom field tanimi. 1 gun.

### P2 — Kaynak Dikis Haritasi (Weld Map) Yok
**Fix:** Uzun vadede DrawingManagement modulu. 5-8 gun.

---

## MEDIKAL — KRITIK BULGULAR

### P0 — UDI (Unique Device Identification) Modulu Yok
**Sorun:** MDR 2017/745'e gore her medikal cihazin UDI-DI + UDI-PI'si olmali. EUDAMED'e yuklenmeli. Quvex'te **UDI field yok, otomatik olusturma yok, EUDAMED entegrasyonu yok**.
**Senaryo:** Sezgin Bey ornek olarak manuel olusturuyor, lazer markalama operatoru not alanindan okuyor. **Hata riski: lot ile UDI eslesmeyebilir.**
**Fix:**
- Product entity'ye `udiDi`, `udiPiPattern` alanlari
- ProductionOrder'da UDI-PI otomatik generate (lot+exp+serial)
- LazerMarkalama operasyonunda otomatik aktar
- EUDAMED export (CSV/XML) stub
- **Efor: 8-12 gun. Etki: Medikal sektorunun olmazsa olmazi.**

### P0 — Sterilizasyon Validasyon (IQ/OQ/PQ) Modulu Yok
**Sorun:** EtO, gamma, otoklav — her birinin validasyon raporu var. Quvex'te fason siparis + dosya eki ile "iskelet" cozuluyor.
**Denetci:** "OQ rev 3 tarihi? BI sonucu SAL 10^-6 karsilandi mi?" — Quvex cevabi yok.
**Fix:** SpecialProcess template: `STERILIZATION` type → IQ/OQ/PQ revizyonlari + BI kayit + cycle data upload. 6-8 gun.

### P0 — Risk Yonetimi (ISO 14971) Modulu Eksik
**Sorun:** `RiskFmeaManagement.js` var ama **FMEA-merkezli**. Medikal risk yonetimi ayri: hazard identification → risk estimation (S x O) → risk control → residual risk → overall risk acceptability.
**Senaryo:** Banu Hanim FMEA tablosunu zorla medikal risk icin kullaniyor — alan adlari uyumsuz.
**Fix:** RiskManagement template=`ISO_14971` + hazard table + benefit-risk analysis. 5-7 gun.

### P0 — Recall / FSCA Workflow Yok
**Sorun:** Bu **kritik**. Medikalde recall olursa: etkilenen lotlar → musteriler → bildirim → geri toplama → CAPA → yetkili makam raporu. Quvex'te NCR + CAPA "zorlayarak" yapilir, **otomatik lot-musteri-sevkiyat genealogy** yok.
**Senaryo:** MedTek'te titanium batch'te pit korozyonu. Hangi lot hangi hastaneye gitti? SerialNumberList'te manuel sorgu gerekiyor.
**Fix:** RecallManagement modulu → lot girdisi → etkilenen musteri+sevkiyat otomatik liste → toplu bildirim → kapatma raporu. **Efor: 10-14 gun. Etki: olmazsa medikal satilmaz.**

### P0 — Biyouyumluluk (ISO 10993) Test Takibi Yok
**Fix:** MaterialCertificate'e biyouyumluluk test tipi + rapor upload. 2 gun.

### P1 — Temiz Oda Ortam Izleme Kayit Alani Yok
**Sorun:** Partikul sayimi, sicaklik, nem her batch icin gerekli. Simdilik operasyon notu.
**Fix:** Operation custom field `cleanroomClass`, `particleCount`, `temp`, `humidity`. 1 gun.

### P1 — Pasivizasyon Banyosu Parametre Kayit Yok
**Fix:** SpecialProcess `PASSIVATION` → pH, konsantrasyon, sicaklik, sure + ASTM A967 referans. 2 gun.

### P1 — Etiket Tasarim Modulu Yok (CE, UDI, Lot)
**Fix:** LabelDesign modulu (basit template) — 4-6 gun.

### P1 — Lot Bazli Tam Izlenebilirlik (Hammadde → Hasta) Eksik
**Sorun:** SerialNumberList var ama "hammadde sertifikasindan → uretim lot'una → sevkiyata → hasta UDI-PI'ye" tek ekranda genealogy agaci yok.
**Fix:** Trace Tree view — SerialNumberList'e drill-down agaci. 4-5 gun.

### P2 — MDR Teknik Dosya Sablonu Yok
**Fix:** DocumentControl template `MDR_TECHNICAL_FILE` (Annex II/III bolum yapisi). 3 gun.

---

## KAYNAK — PERSONA MUTLULUK

| Persona | Skor | Notlar |
|---------|------|--------|
| **Yusuf Usta (Kaynakci)** | **6/10** | ShopFloor iyi ama heat input/interpass manuel. Sertifika uyarisi yok. |
| **Hatice (Kaliteci)** | **5/10** | NDT dosya genel. Kalibrasyon iyi. WPS yok. |
| **Onur (Muhendis)** | **4/10** | WPS/WPQR modulu yok — en mutsuz. |
| **Kemal (Uretim Mud.)** | **5/10** | Gantt drag-drop yok, fason isil islem takibi zayif. |
| **Ozdemir (Patron)** | **5/10** | Dashboard iyi, ilk kurulum korkutucu (ProductForm). |

## MEDIKAL — PERSONA MUTLULUK

| Persona | Skor | Notlar |
|---------|------|--------|
| **Tarik (Operator)** | **6/10** | Lazer markalama icin UDI'yi notdan okuyor — hata riski. |
| **Demet (Uretim Mud.)** | **5/10** | Temiz oda slotlama Gantt'ta net degil. |
| **MedTek (Patron)** | **4/10** | UDI/recall/sterilizasyon yok — ISO 13485 denetcisi gelse panik. |
| **Banu (Kaliteci)** | **3/10** | Risk yonetimi (ISO 14971) icin FMEA'yi zorla kullaniyor. Recall yok. **EN MUTSUZ.** |
| **Sezgin (Reg. Affairs)** | **3/10** | MDR teknik dosya, EUDAMED entegrasyonu, UDI yok. **EN MUTSUZ.** |

---

## KAYNAK — TOP 10 QUICK WIN

| # | Is | Sure | Etki |
|---|-----|------|------|
| 1 | Kaynakci sertifika expiry + dashboard widget | 1 gun | Kritik |
| 2 | Heat input otomatik hesaplama (ShopFloor) | 1 gun | Yuksek |
| 3 | Interpass temp required field | 0.5 gun | Yuksek |
| 4 | NDT inspection template (RT/UT/PT/MT + inspector cert) | 3 gun | Kritik |
| 5 | WPS minimum template (DocumentControl) | 3 gun | Yuksek |
| 6 | SubcontractOrder heat treatment parametreleri | 2 gun | Orta |
| 7 | Purge O2 ppm + gas flow custom field | 0.5 gun | Orta |
| 8 | FAI (AS9102) pre-fill for welded assemblies | 2 gun | Orta |
| 9 | Weld map PDF upload + referans | 1 gun | Dusuk |
| 10 | WPS coverage rapor (hangi is emri hangi WPS) | 1 gun | Orta |

## MEDIKAL — TOP 10 QUICK WIN

| # | Is | Sure | Etki |
|---|-----|------|------|
| 1 | Product UDI-DI + UDI-PI pattern fields | 2 gun | Kritik |
| 2 | ProductionOrder'da UDI-PI auto generate | 2 gun | Kritik |
| 3 | LazerMarkalama operasyonuna UDI otomatik besleme | 1 gun | Kritik |
| 4 | Lot expiry + sterilite tarihi zorunlu | 0.5 gun | Yuksek |
| 5 | SerialNumber genealogy tree view (hammadde→hasta) | 4 gun | Kritik |
| 6 | Recall trigger modal (NcrList'ten) + etkilenen lot listesi | 3 gun | Kritik |
| 7 | Sterilizasyon cycle data upload (CSV) + BI sonucu alani | 2 gun | Yuksek |
| 8 | Temiz oda ortam izleme custom field set | 1 gun | Orta |
| 9 | ISO 14971 hazard list template | 3 gun | Yuksek |
| 10 | Pasivizasyon parametre template | 1 gun | Orta |

---

## SEKTOR ORTALAMASI

| Sektor | Ortalama | Persona Mutlulugu |
|--------|----------|-------------------|
| Kaynak Atolyesi | **5.7/10** | 5.0/10 |
| Medikal Cihaz | **5.3/10** | 4.2/10 |
| (Referans: CNC) | 6.4/10 | 6.5/10 |

**Sonuc:** Her iki sektor de CNC'nin altinda. Temel sebep: **kalite temel altyapisi guclu (%80 ortak AS9100/ISO 13485 kapsaminda), ama sektore ozel 4-6 kritik modul eksik.**

---

## SONUC

Kaynak icin Quvex **"dun bugun" satilabilir** ama 10-15 ek muhendislik gunu ile **nis lider** olabilir (WPS + sertifika + NDT + heat input).

Medikal icin Quvex **"bugun henuz yeterli degil"** — UDI, sterilizasyon, recall, ISO 14971 eksikligi ISO 13485 denetciden gecmez. **35-50 muhendislik gunu gerekli.** Ancak tamamlanirsa bu pazarda **aylik 3000-5000 USD** fiyatlandirilabilir — yuksek marjli nis.
