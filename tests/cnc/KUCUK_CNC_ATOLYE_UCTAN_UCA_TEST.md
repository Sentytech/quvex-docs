# Kucuk CNC Atolyesi — Uctan Uca Test Senaryosu
# Sifirdan Register → Ilk Siparis → Uretim → Sevkiyat

> **Firma:** Demir CNC Hassas Isleme — 8 personel, 5 CNC tezgah
> **Sektor:** Savunma alt yüklenicisi (Tier-3), otomotiv yan sanayi
> **Hedef:** quvex.io'ya yeni kayit olan bir firmanin ilk 2 haftasini simule et
> **Test Tarihi:** 2026-04-06
> **Test Ortami:** quvex.io (production) veya localhost (development)

---

# ══════════════════════════════════════════════════════════════
# ADIM 0: KAYIT ve GIRIS (Self-Registration)
# ══════════════════════════════════════════════════════════════

## 0.1 Firma Kaydi
**Ekran:** /register
**API:** POST /TenantRegistration/self-register

```
Firma Adi:      Demir CNC Hassas Isleme
Alt Alan:       demircnc  (demircnc.quvex.io)
Ad Soyad:       Ahmet Demir
Email:          ahmet@demircnc.com
Telefon:        532 111 2233
Sifre:          Test1234!@#$
Sektor:         CNC / Metal Isleme Atolyesi [dropdown]
```

**Dogrulama:**
- [ ] Kayit basarili, onboarding ekrani acildi
- [ ] Sektor profili CNC secildi (6 menu)
- [ ] Admin kullanici olusturuldu
- [ ] Tenant schema olusturuldu

**Bilinen Sorunlar:**
- ⚠️ TenantId atamasi — yeni kayitlarda TenantId dogru atanmali
- ⚠️ Sektor profili secimi kayit sirasinda calisiyormu?

## 0.2 Onboarding Wizard
**Ekran:** /onboarding

```
Adim 1: Firma bilgileri (vergi no, adres)
Adim 2: Sektor secimi (zaten secildi)
Adim 3: Ilk kullanici davet (opsiyonel)
```

**Dogrulama:**
- [ ] Onboarding tamamlandi
- [ ] Dashboard'a yonlendirildi

## 0.3 Ek Kullanicilar Olustur
**Ekran:** Ayarlar > Kullanicilar

```
Kullanici 1 (Operator):
  Ad: Mustafa Tornaci
  Email: mustafa@demircnc.com
  Rol: Operator
  
Kullanici 2 (Kaliteci):
  Ad: Mehmet Kaliteci  
  Email: mehmet@demircnc.com
  Rol: Kaliteci
```

**Dogrulama:**
- [ ] 2 kullanici olusturuldu
- [ ] Roller atandi
- [ ] Operator sadece 5 menu goruyor (rol bazli profil)

**Bilinen Sorunlar:**
- ⚠️ Rol bazli menu filtreleme calisiyor mu? (uiConfig.js roleProfiles)

---

# ══════════════════════════════════════════════════════════════
# ADIM 1: FABRIKA KURULUMU (Ilk Gun)
# ══════════════════════════════════════════════════════════════

## 1.1 Makineler (5 tezgah)
**Ekran:** Ayarlar > Makineler
**API:** POST /Machines

| Kod | Makine | Marka | Saat Ucreti | Setup |
|-----|--------|-------|-------------|-------|
| T01 | CNC Torna 1 | Doosan Lynx 220 | 400 | 300 |
| T02 | CNC Torna 2 | Mazak QT-200 | 420 | 320 |
| F01 | CNC Freze 1 | Haas VF-2 | 500 | 400 |
| F02 | CNC Freze 2 | Haas VF-3 | 520 | 420 |
| TAS | Taslama | Okamoto OGM-250 | 350 | 250 |

**Dogrulama:**
- [ ] 5 makine eklendi
- [ ] Saat ucretleri girildi
- [ ] Makine listesinde gorunuyor

**Bilinen Sorunlar:**
- ⚠️ HourlyRate ve SetupHourlyRate alanlari UI'da gorunuyor mu?

## 1.2 Operasyon Adimlari (5 temel operasyon)
**Ekran:** Ayarlar > Is Emri Adimlari
**API:** POST /WorkOrderSteps

| Kod | Operasyon | Makine | Setup | Run | Beceri |
|-----|----------|--------|-------|-----|--------|
| OP10 | CNC Torna | T01 | 20dk | 8dk | 3-Usta |
| OP20 | CNC Freze | F01 | 30dk | 12dk | 3-Usta |
| OP30 | Taslama | TAS | 15dk | 5dk | 4-Uzman |
| OP40 | Capak Alma | — | 5dk | 2dk | 1-Cirak |
| OP50 | Final Kontrol | — | 10dk | 5dk | 4-Uzman |

**Dogrulama:**
- [ ] 5 operasyon eklendi
- [ ] Makine, sure, takim bilgileri girildi
- [ ] Yeni alanlar (setup/run/tooling/tolerance/skill) calisiyor mu?

**Bilinen Sorunlar:**
- ⚠️ WorkOrderSteps form'da yeni alanlar gorunuyor mu?
- ⚠️ DefaultMachineId dropdown calisiyor mu?

## 1.3 Depo
**Ekran:** Stok > Depolar
**API:** POST /Warehouses

```
Depo 1:
  Kod: ANA-DEPO
  Ad: Ana Depo
  Aciklama: Hammadde ve mamul deposu
```

**Dogrulama:**
- [ ] Depo olusturuldu

## 1.4 Kalibrasyon (3 temel alet)
**Ekran:** Kalite > Kalibrasyon
**API:** POST /Calibration/equipment

| Kod | Alet | Dogruluk | Frekans |
|-----|------|----------|---------|
| MIK-01 | Mikrometre 0-25mm | 0.001mm | Yillik |
| KAL-01 | Kumpas 0-150mm | 0.01mm | 6 Aylik |
| UC-01 | Uc Olcer M6 | Go/NoGo | Yillik |

Her birine kalibrasyon kaydi ekle:
```
Sertifika No: KAL-2026-001
Tarih: 2026-01-15
Sonraki: 2027-01-15
Lab: Turk Loydu
Sonuc: GECTI
```

**Dogrulama:**
- [ ] 3 ekipman + kalibrasyon kaydi
- [ ] Dashboard'da uyumluluk %100

**Bilinen Sorunlar:**
- ⚠️ Kalibrasyon kaydi eklerken alan adi `calibrationEquipmentId` (equipmentId degil)

---

# ══════════════════════════════════════════════════════════════
# ADIM 2: ILK MUSTERI ve URUN
# ══════════════════════════════════════════════════════════════

## 2.1 Musteri
**Ekran:** Musteriler
**API:** POST /Customer

```
Firma: ASELSAN A.S.
Yetkili: Ali Savunma
Email: ali@aselsan.com.tr
Telefon: 532 444 5566
Adres: ASELSAN Macunkoy Tesisi, Ankara
Vergi No: 9876543210
Doviz: TRY
Vade: 45 gun
Kategori: A
```

**Dogrulama:**
- [ ] Musteri olusturuldu
- [ ] Musteri listesinde gorunuyor

**Bilinen Sorunlar:**
- ⚠️ `isCustomer: true` gonderilmeli (type: 'customers' degil)
- ⚠️ Musteri listesi `/Customer?type=customers` ile filtreleniyor

## 2.2 Urunler
**Ekran:** Urunler
**API:** POST /Product

**Hammadde:**
```
Ad: St37 Celik Cubuk Ø30x200mm
Kod: HAM-ST37-030200
Tip: Hammadde
Birim: Adet
Alis Fiyati: 85 TL
Min Stok: 50
productType: PRODUCTION_MATERIAL
supplyType: OUTER_SUPPLY (1)
```

**Mamul (Ana Urun):**
```
Ad: ASELSAN Konnektor Pimi
Kod: ASL-PIN-2026-001
Tip: Mamul
Birim: Adet
Satis Fiyati: 45 TL
Kalite Kontrol: Evet
Seri Takip: Hayir (kucuk parca, lot yeterli)
Lot Takip: Evet
productType: PRODUCTION_MATERIAL
supplyType: INNER_SUPPLY (0)
```

**BOM:**
- 1x HAM-ST37-030200 (hammadde)

**Dogrulama:**
- [ ] 2 urun olusturuldu
- [ ] BOM baglantisi yapildi
- [ ] Urunler sayfasinda gorunuyor

**Bilinen Sorunlar:**
- ⚠️ `productType: PRODUCTION_MATERIAL` olmali — yoksa Urunler sayfasinda gorunmez
- ⚠️ Stok sayfasinda gorunmesi icin `productType: STOCK` olmali — ayni urun iki yerde gorunemez

## 2.3 Kontrol Plani
**Ekran:** Kalite > Kontrol Planlari
**API:** POST /ControlPlan + POST /ControlPlan/items

```
Plan No: KP-ASL-001
Urun: ASELSAN Konnektor Pimi
```

| Adim | Operasyon | Olcu | Spec | Tol+ | Tol- | Metod | Kritik |
|------|----------|------|------|------|------|-------|--------|
| 1 | OP10 Torna | Dis Cap Ø6 | 6.000 | 0.010 | 0.000 | Mikrometre | EVET |
| 2 | OP10 Torna | Boy 35 | 35.000 | 0.050 | 0.050 | Kumpas | Hayir |
| 3 | OP30 Taslama | Dis Cap Ø6 h6 | 6.000 | 0.000 | 0.008 | Mikrometre | EVET |

**Dogrulama:**
- [ ] Kontrol plani + 3 kalem olusturuldu
- [ ] Plan ACTIVE durumunda

---

# ══════════════════════════════════════════════════════════════
# ADIM 3: ILK SIPARIS (Teklif → Siparis)
# ══════════════════════════════════════════════════════════════

## 3.1 Teklif Hazirlama
**Ekran:** Teklifler
**API:** POST /Offer + POST /OfferProduct

```
Musteri: ASELSAN
Kalem: ASL-PIN-2026-001 x 500 adet x 45 TL = 22,500 TL
Not: Ilk siparis, 30 gun teslimat
```

**Dogrulama:**
- [ ] Teklif olusturuldu
- [ ] Teklif kalemi eklendi (ayri endpoint)
- [ ] Toplam 22,500 TL

**Bilinen Sorunlar:**
- ⚠️ Teklif olusturma 2 adimli: (1) POST /Offer header, (2) POST /OfferProduct kalem
- ⚠️ Nested offerProducts ile olusturma circular ref hatasi veriyor

## 3.2 Teklif Onayi → Siparis
**Ekran:** Teklifler → Satislar
**API:** PUT /Offer/change-status/{id}/2 + POST /Sales

```
Teklif ACCEPTED (status=2)
Siparis olustur: offerProductId ile
```

**Dogrulama:**
- [ ] Teklif ACCEPTED oldu
- [ ] Siparis olusturuldu

**Bilinen Sorunlar:**
- ⚠️ Offer status enum: 0=DRAFT, 1=SENT, 2=ACCEPTED, 3=REJECTED
- ⚠️ Sales olusturmak icin Offer ACCEPTED olmali

---

# ══════════════════════════════════════════════════════════════
# ADIM 4: MALZEME TEDARIK
# ══════════════════════════════════════════════════════════════

## 4.1 Stok Girisi
**Ekran:** Stok > Giris/Cikis
**API:** POST /StockReceipts

```
Depo: ANA-DEPO
Belge No: IRS-2026-001
Kalemler:
  - HAM-ST37-030200 x 550 adet x 85 TL (500 + %10 fire payi)
```

**Dogrulama:**
- [ ] Stok girisi yapildi
- [ ] Stok sayfasinda gorunuyor

**Bilinen Sorunlar:**
- ⚠️ StockReceipts format: `{ warehousesId, type:0, documentNo, details:[{productId, quantity, unitPrice}] }`
- ⚠️ Sadece `productId + quantity` gondermek yetmez — details array zorunlu

## 4.2 Giris Muayenesi
**Ekran:** Kalite > Giris Kontrol
**API:** POST /IncomingInspection

```
Urun: HAM-ST37-030200
Lot: ST37-2026-001
Gelen: 550 adet
Kabul: 550
Red: 0
Sonuc: PASS
```

**Dogrulama:**
- [ ] Muayene kaydi olusturuldu

## 4.3 Malzeme Sertifikasi
**Ekran:** Giris Kontrol > Sertifika ikonu
**API:** POST /MaterialCertificate

```
Sertifika 1:
  No: ST37-MTR-2026-001
  Tip: MTR
  Malzeme: St37 / DIN EN 10025
  
Sertifika 2:
  No: ST37-COC-2026-001
  Tip: CoC
```

**Dogrulama:**
- [ ] 2 sertifika yuklendi
- [ ] Muayeneye bagli

---

# ══════════════════════════════════════════════════════════════
# ADIM 5: URETIM PLANLAMA
# ══════════════════════════════════════════════════════════════

## 5.1 Is Emri Sablonu
**Ekran:** Ayarlar > Is Emri Sablonlari
**API:** POST /WorkOrderTemplates

```
Sablon: ASL-PIN Konnektor Pimi Operasyon Sirasi
Adimlar:
  1. OP10 — Torna (T01, Setup:20dk, Run:8dk, Kalite:EVET)
  2. OP20 — Freze (F01, Setup:30dk, Run:12dk, Kalite:EVET)
  3. OP30 — Taslama (TAS, Setup:15dk, Run:5dk, Kalite:EVET)
  4. OP40 — Capak Alma (Setup:5dk, Run:2dk, Kalite:HAYIR)
  5. OP50 — Final Kontrol (Setup:10dk, Run:5dk, Kalite:EVET)
```

**Dogrulama:**
- [ ] 5 adimli sablon olusturuldu
- [ ] Prerequisite baglantilari dogru

**Bilinen Sorunlar:**
- ⚠️ Template field adi `title` (name degil)
- ⚠️ `workOrders: []` bos array gondermek zorunlu (yoksa validation hatasi)

## 5.2 Siparis Onayi → Uretim Emri
**Ekran:** Satislar → Onayla → Uretime Aktar
**API:** PUT /Sales/request-approval/{id} + PUT /Sales/approve/{id} + POST /Production/transfer-from-sale/{salesId}

```
Akis:
  1. IN_OFFER → request-approval → PENDING_APPROVAL
  2. PENDING_APPROVAL → approve (autoTransfer=false) → APPROVED
  3. APPROVED → transfer-from-sale → Production olusturuldu
```

**Dogrulama:**
- [ ] Uretim emri olusturuldu
- [ ] 500 adet, durum WAITING

**Bilinen Sorunlar:**
- ⚠️ Siparis direkt approve edilemez — once request-approval yapilmali
- ⚠️ approve body zorunlu: `{ notes: "..." }`
- ⚠️ transfer-from-sale ayri cagrilmali (autoTransfer icerden HttpContext gerektirir)

## 5.3 Is Emri Atama
**Ekran:** Uretim > Detay > Is Emri Olustur

```
Sablon: ASL-PIN Konnektor Pimi
→ 5 operasyon otomatik olusturulur
→ Her operasyona 500 adet atanir
```

**Dogrulama:**
- [ ] Is emri sablonu atandi
- [ ] 5 WorkOrder olusturuldu

**Bilinen Sorunlar:**
- ⚠️ WorkOrder TenantId = Guid.Empty olabilir → NULL olmali
- ⚠️ WorkOrder UserId atanmamis olabilir → pending-tasks'te gorunmez

---

# ══════════════════════════════════════════════════════════════
# ADIM 6: ATOLYE — URETIM YURUTME
# ══════════════════════════════════════════════════════════════

## 6.1 Operator Girisi + OP10 Baslat
**Ekran:** Atolye Terminali (/shop-floor-terminal)
**API:** POST /ShopFloor/start-work

```
Operator: Mustafa (operator rolunde)
Is: OP10 — CNC Torna
Makine: T01
```

**Dogrulama:**
- [ ] Operator sadece kendi islerini goruyor
- [ ] "Bugunku Is Emirleri" listesinde isler gorunuyor
- [ ] BASLAT → zamanlayici calisiyor
- [ ] Buton DURDUR'a donustu

**Bilinen Sorunlar:**
- ⚠️ start-work endpoint WorkOrderLogs.MachinesId shadow property hatasi → Raw SQL workaround
- ⚠️ GetUserId() JWT sub claim Guid degil string → email ile resolve
- ⚠️ pending-tasks: admin tum isleri gormeli, operator sadece kendisine atanmislari
- ⚠️ UI'da workOrderId yerine workOrderLogId gonderiliyordu → duzeltildi

## 6.2 Durdur + Devam Et
```
DURDUR → Neden modali acilir (7 neden + Diger aciklama)
  - Makine Arizasi, Malzeme Bekleme, Takim Degisimi
  - Setup, Planli Bakim, Mola, Diger
→ PAUSED durumunda: miktar/tamamla/hurda devre disi
→ DEVAM ET → IN_PROGRESS'e doner

Durus zamani kaydediliyor:
  stopLog: [{ reason, note, startTime, endTime }]
```

**Dogrulama:**
- [ ] Durdur modali acildi, neden secildi
- [ ] PAUSED'da kontroller devre disi
- [ ] Devam et calisti
- [ ] Durus suresi kaydedildi

## 6.3 OP10 Tamamla + Olcum Girisi
**API:** PUT /ShopFloor/complete-work/{logId}

```
Adet: 500
→ Olcum modali acilir (RequiresQualityCheck=true)

Olcum 1: Dis Cap Ø6 — Spec:6.000, +0.010/-0.000 → Olculen: 6.005 ✅
Olcum 2: Boy 35 — Spec:35.000, ±0.050 → Olculen: 34.98 ✅
```

**Dogrulama:**
- [ ] Olcum modali acildi
- [ ] Gercek zamanli pass/fail gorunuyor
- [ ] Tum olcumler gecti → kalite otomatik onaylandi
- [ ] OP20 baslatilabilir durumda

**Bilinen Sorunlar:**
- ⚠️ Olcum modali: ControlPlan'dan olcum noktalarinin gelmesi icin WorkOrderStepInspectionPoint baglantisi gerekli
- ⚠️ submit-measurements: tolerance kontrolu server-side yapiliyor

## 6.4 Kalite Onay (Kaliteci)
**Ekran:** Kalite > Operasyon Muayeneleri (/quality/operation-inspections)
**API:** POST /ShopFloor/approve-quality/{workOrderId}

```
Kaliteci Mehmet bu ekrani acar
OP10 "Bekliyor" olarak gorunur
→ Onayla → not gir → "Onaylandi"
→ OP20 baslatilabilir
```

**Dogrulama:**
- [ ] Operasyon Muayeneleri sayfasinda bekleyen isler gorunuyor
- [ ] Onayla calisti, status "Onaylandi" oldu
- [ ] Reddet calisti, status "Reddedildi" oldu, NCR acildi

**Bilinen Sorunlar:**
- ⚠️ approve-quality endpoint her zaman true yapiyordu → approved parametresi eklendi
- ⚠️ WorkOrderTemplates GET response'unda quality alanlari eksikti → eklendi
- ⚠️ WorkOrderDTO'da quality alanlari eksikti → eklendi
- ⚠️ templateId alan adi: `workorderTemplateId` (kucuk o)

## 6.5 Sonraki Operasyonlar (OP20 → OP50)
Her operasyon icin ayni akis tekrarlanir:
1. Operator terminalden is baslatir
2. Uretir
3. Tamamlar (olcum girer — kalite kontrollu adimlar icin)
4. Kaliteci onaylar
5. Sonraki operasyona gecilir

**Prerequisite Kontrolu:**
- OP20 → OP10 kalite onaylanmis olmali
- OP30 → OP20 kalite onaylanmis olmali
- OP40 → OP30 (kalite yok, otomatik gecis)
- OP50 → OP40

---

# ══════════════════════════════════════════════════════════════
# ADIM 7: KALITE OLAYLARI
# ══════════════════════════════════════════════════════════════

## 7.1 NCR (Uygunsuzluk)
**Ekran:** Kalite > Uygunsuzluk
**API:** POST /Ncr

```
OP30 taslamada 3 parca tolerans disina cikti
Siddet: MINOR
Etkilenen: 3 adet
Kok Neden: Taslik asinmasi
Duzeltici: Taslik degistirildi
Onleyici: Dressleme peryodu kisaltildi
```

**Workflow:** OPEN → UNDER_REVIEW → CORRECTIVE_ACTION → CLOSED

**Dogrulama:**
- [ ] NCR olusturuldu
- [ ] Kok neden girilmeden kapatilamadi (AS9100 enforcement)
- [ ] CLOSED durumuna gecti

## 7.2 CAPA
**Ekran:** Kalite > CAPA
**API:** POST /Capa

```
Tip: CORRECTIVE
Kaynak: NCR
Kok Neden: 5 Neden analizi
```

**Dogrulama:**
- [ ] CAPA olusturuldu, NCR'ye bagli
- [ ] Workflow calisti

---

# ══════════════════════════════════════════════════════════════
# ADIM 8: FASON IS (Opsiyonel)
# ══════════════════════════════════════════════════════════════

## 8.1 Fason Siparis (Isil Islem)
**Ekran:** Uretim > Fason Is Emirleri
**API:** POST /SubcontractOrder

```
Tedarikci: Isil Islem A.S.
Proses: HEAT_TREATMENT (Isil Islem)
Adet: 500
Fiyat: 3 TL/adet
Beklenen Donus: 5 is gunu
```

**Workflow:** DRAFT → SENT → AT_SUPPLIER → COMPLETED → INSPECTED

**Dogrulama:**
- [ ] Fason siparis olusturuldu
- [ ] Durum akisi calisti
- [ ] Geri sayim badge gorunuyor

**Bilinen Sorunlar:**
- ⚠️ SubcontractOrder.ProductionId Guid? nullable yapildi (onceden zorunluydu)

---

# ══════════════════════════════════════════════════════════════
# ADIM 9: FINAL ve SEVKIYAT
# ══════════════════════════════════════════════════════════════

## 9.1 Final Muayene
**Ekran:** Uretim Detay > Final Muayene & CoC
**API:** POST /FinalInspectionRelease

```
Sonuc: ONAYLANDI
Muayeneci: Mehmet (Kaliteci)
Not: Tum boyutlar tolerans icinde, gorsel uygun
```

**Dogrulama:**
- [ ] Final muayene onaylandi
- [ ] Sevkiyat acildi

## 9.2 Sevkiyat
**Ekran:** Sevkiyat
```
Irsaliye No: DMR-IRS-2026-001
Adet: 500
Paketleme: Kutulu
```

**Dogrulama:**
- [ ] Sevkiyat kaydi olusturuldu
- [ ] Uretim durumu TAMAMLANDI

## 9.3 Fatura
**Ekran:** Faturalar
**API:** POST /Invoice

```
Musteri: ASELSAN
Kalem: ASL-PIN-2026-001 x 500 x 45 TL = 22,500 TL
KDV: %20 = 4,500 TL
Toplam: 27,000 TL
Vade: 45 gun
```

**Dogrulama:**
- [ ] Fatura olusturuldu
- [ ] Toplam 27,000 TL

**Bilinen Sorunlar:**
- ⚠️ Invoice items alan adi: `items` (invoiceItems degil)
- ⚠️ InvoiceType: 'SALES'

---

# ══════════════════════════════════════════════════════════════
# ADIM 10: MALIYET ve RAPORLAR
# ══════════════════════════════════════════════════════════════

## 10.1 Maliyet Analizi
**Ekran:** Uretim > Maliyet Analizi
**API:** GET /PartCost/estimate

```
Beklenen:
  Malzeme: 500 x 85 TL = 42,500 TL
  Iscilik: (setup + run sureleri)
  Makine: (makine saat ucretleri)
  Fason: 500 x 3 TL = 1,500 TL
  Genel Gider: %43
  Toplam: ~xxx TL
  Birim: ~xxx TL
  Satis: 22,500 TL
  Kar: %xx
```

## 10.2 Dashboard
**Ekran:** Yonetim Kokpiti

```
Kontrol:
- [ ] Toplam gelir gorunuyor
- [ ] OEE metrikleri
- [ ] NCR/CAPA sayilari
- [ ] Zamaninda teslimat orani
```

---

# ══════════════════════════════════════════════════════════════
# BILINEN SORUNLAR OZETI
# ══════════════════════════════════════════════════════════════

## Kritik (Patlayan Noktalar)

| # | Sorun | Nerede | Durum |
|---|-------|--------|-------|
| 1 | WorkOrderLogs MachinesId shadow property | ShopFloor start-work | ✅ Raw SQL workaround |
| 2 | GetUserId() JWT sub claim string | ShopFloor controller | ✅ Email ile resolve |
| 3 | WorkOrder TenantId = Guid.Empty | Template PUT | ⚠️ DB'den NULL yapilmali |
| 4 | approve-quality her zaman true | ShopFloor controller | ✅ Approved param eklendi |
| 5 | Teklif nested offerProducts | Offer POST | ✅ 2 adimli akis (header+kalem) |
| 6 | Siparis direkt approve edilemez | Sales controller | ✅ request-approval oncesi |
| 7 | ProductType PRODUCTION_MATERIAL zorunlu | Product entity | ✅ Urunler sayfasi icin |
| 8 | IsCustomer flag eksik | Customer entity | ✅ isCustomer:true gonderilmeli |

## Orta (UX Sorunlari)

| # | Sorun | Nerede | Durum |
|---|-------|--------|-------|
| 9 | WorkOrderDTO quality alanlari eksik | Production/status | ✅ Eklendi |
| 10 | WorkOrderTemplates quality alanlari eksik | GET response | ✅ Eklendi |
| 11 | templateId alan adi kucuk 'o' | Production response | ✅ Her ikisini de destekle |
| 12 | Horizontal nav eksik | OperationInspections | ✅ Eklendi |
| 13 | Terminal GUID gosteriyor | ShopFloor my-tasks | ✅ Code + productName eklendi |
| 14 | BASLAT/DURDUR/DEVAM buton gecisi | ShopFloor Terminal | ✅ Duzeltildi |
| 15 | PAUSED'da kontroller aktif | ShopFloor Terminal | ✅ Disabled yapildi |

## Dusuk (Gelecek Sprint)

| # | Sorun | Nerede |
|---|-------|--------|
| 16 | Stok sayfasi STOCK, Urun sayfasi PRODUCTION_MATERIAL — ayni urun iki yerde gorunemez | ProductType tasarimi |
| 17 | Durus zamanlari DB'ye kaydedilmiyor (sadece client-side) | ShopFloor stopLog |
| 18 | SQL fonksiyonlari (getproducttree) migration'da yok | DB setup |
| 19 | CalibrationRecords field: calibrationEquipmentId (equipmentId degil) | API naming |
| 20 | complete-work endpoint MachinesId shadow property | WorkOrderLogs entity |

---

# ══════════════════════════════════════════════════════════════
# TEST SONUC TABLOSU
# ══════════════════════════════════════════════════════════════

| Adim | Islem | Durumu | Not |
|------|-------|--------|-----|
| 0.1 | Firma kaydi (register) | [ ] | |
| 0.2 | Onboarding | [ ] | |
| 0.3 | Kullanicilar | [ ] | |
| 1.1 | 5 makine | [ ] | |
| 1.2 | 5 operasyon | [ ] | |
| 1.3 | 1 depo | [ ] | |
| 1.4 | 3 kalibrasyon + kayit | [ ] | |
| 2.1 | Musteri (ASELSAN) | [ ] | |
| 2.2 | 2 urun + BOM | [ ] | |
| 2.3 | Kontrol plani + 3 kalem | [ ] | |
| 3.1 | Teklif (2 adimli) | [ ] | |
| 3.2 | Siparis (teklif onayi) | [ ] | |
| 4.1 | Stok girisi (550 adet) | [ ] | |
| 4.2 | Giris muayenesi | [ ] | |
| 4.3 | 2 sertifika (MTR+CoC) | [ ] | |
| 5.1 | Is emri sablonu | [ ] | |
| 5.2 | Uretim emri (3 adim) | [ ] | |
| 5.3 | Is emri atama | [ ] | |
| 6.1 | OP10 baslat (terminal) | [ ] | |
| 6.2 | Durdur + devam et | [ ] | |
| 6.3 | OP10 tamamla + olcum | [ ] | |
| 6.4 | Kalite onay (ayri ekran) | [ ] | |
| 6.5 | OP20-OP50 (tekrar) | [ ] | |
| 7.1 | NCR (workflow) | [ ] | |
| 7.2 | CAPA | [ ] | |
| 8.1 | Fason siparis | [ ] | |
| 9.1 | Final muayene | [ ] | |
| 9.2 | Sevkiyat | [ ] | |
| 9.3 | Fatura (27,000 TL) | [ ] | |
| 10.1 | Maliyet analizi | [ ] | |
| 10.2 | Dashboard | [ ] | |

**Toplam: 31 adim**

---

> **Hazirlayan:** Claude Opus 4.6 + Hakan Bey
> **Son Guncelleme:** 2026-04-06
> **Hedef:** quvex.io'da 2 tenant ile persambe gunu test
