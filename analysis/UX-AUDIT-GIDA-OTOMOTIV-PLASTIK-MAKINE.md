# Quvex ERP — Sektörel UX Denetimi: Gıda · Otomotiv · Plastik · Makine

> Tarih: 2026-04-10
> Yöntem: Kod seviyesinde derin inceleme + persona simülasyonu (CNC denetimiyle aynı metodoloji)
> Kapsam: 4 hedef sektör — Gıda Üretimi, Otomotiv Yan Sanayi, Plastik Enjeksiyon, Makine İmalatı
> Referans: `CNC-USER-JOURNEY-UX-AUDIT.md` (12.04.2026) — CNC atölyesi (Mehmet Bey) yolculuğu
> Toplam ~62.000 KOBİ potansiyel pazar

---

## YÖNETİCİ ÖZETİ

Bu denetim, Quvex'in CNC dışındaki 4 öncelikli sektör için kullanıcı yolculuklarını, persona mutluluğunu ve sektöre özgü boşlukları inceler.

**Kritik bulgu:** Quvex'in altyapısı (PPAP, SPC, FMEA, ProcessCapability, ProjectManagement, StockLot) birçok sektör için **çekirdek modüllere sahip** — ancak sektöre özgü **operasyonel bütünleştirme eksik**.

**Sektör-hazırlık skorları:**

| Sektör | Altyapı | UX Olgunluk | Kritik Eksik | Genel Hazırlık |
|--------|---------|-------------|--------------|----------------|
| **Gıda Üretimi** | 4/10 | 5/10 | HACCP/CCP, Recall, Sıcaklık log | **4/10** |
| **Otomotiv Yan Sanayi** | 8/10 | 6/10 | 8D, APQP Gate, IMDS, CSR yönetimi | **6/10** |
| **Plastik Enjeksiyon** | 6/10 | 5/10 | Kalıp envanteri, Çevrim süresi, Setup | **5/10** |
| **Makine İmalatı** | 5/10 | 5/10 | Çok seviyeli BOM, CE dosya, Commissioning | **5/10** |

**Genel not:** Otomotiv en hazır sektör — kalite modülleri (PPAP/SPC/FMEA) yüksek kalite. Gıda ise en az hazır — kritik HACCP/Recall modülleri yok.

---

# BÖLÜM 1 — GIDA ÜRETİMİ (Taze Gıda A.Ş.)

## 1.1 Ekip Değerlendirmesi

| Rol | Persona | Profil |
|-----|---------|--------|
| **Patron** | Taze Bey, 42 | Süt ürünleri üreticisi, HACCP bilir, ISO 22000 sertifikasyonu almış |
| **Üretim Müdürü** | Pınar Hanım | Pastörizasyon + kültürleme + dolum hatlarını yönetir |
| **Operatör** | İbrahim Usta, 48 | Dolum makinesi, eldiven+bone, hijyen katı |
| **Kaliteci** | Tülay Hanım | Mikrobiyoloji numune, pH/kıvam, allerjen matrisi |
| **Depocu** | Erdal Bey | Soğuk zincir (2-6°C), FIFO sıkı, raf ömrü kritik |

## 1.2 Ekran Skorları — Gıda Sektörü

| Ekran | Persona | Karmaşıklık | Kullanılabilirlik | HACCP Uyum | Mobile | Genel |
|-------|---------|-------------|-------------------|------------|--------|-------|
| **Register / Sektör: food** | Taze Bey | 3/10 | 8/10 | — | 8/10 | **7/10** |
| **ProductForm (hammadde: süt)** | Pınar | 9/10 | 3/10 | 2/10 | 5/10 | **3/10** |
| **StockReceiptForm** | Erdal | 6/10 | 6/10 | **2/10** | 6/10 | **5/10** |
| **StockLotList** ✅ | Erdal | 4/10 | 8/10 | 7/10 | 7/10 | **7/10** |
| **WarehouseForm (sıcaklık)** | Erdal | 5/10 | 5/10 | **1/10** | 5/10 | **4/10** |
| **InspectionList (mikrobiyoloji)** | Tülay | 6/10 | 6/10 | 4/10 | 5/10 | **5/10** |
| **Production (yogurt hattı)** | Pınar | 6/10 | 6/10 | 3/10 | 6/10 | **5/10** |
| **ShopFloorTerminal** | İbrahim | 2/10 | 9/10 | 5/10 | 9/10 | **7/10** |
| **ControlPlan (CCP)** | Tülay | 7/10 | 6/10 | **3/10** | 5/10 | **5/10** |
| **NcrList** | Tülay | 6/10 | 7/10 | 6/10 | 6/10 | **6/10** |
| **DataPackButton (izlenebilirlik)** | Taze Bey | 6/10 | 6/10 | 5/10 | 5/10 | **6/10** |
| **Recall (YOK)** ⚠️ | Taze Bey | — | **0/10** | **0/10** | — | **0/10** |

**Ortalama: 5.0/10** — Gıda için en düşük skor. StockLot ve ShopFloor kuvvetli, ama sektörün kalbini oluşturan HACCP/Recall/Sıcaklık yok.

## 1.3 Taze Bey'in Yolculuğu (İlk 2 Saat)

### Dakika 0-5: Register
- Sektör seçiminde "Gıda / İlaç Üretimi" profili mevcut (`uiConfig.js` food profili doğrulandı)
- Modüller: stockLots + controlPlans + inspections + ncr — iyi temel
- ⚠️ **food profilinde qualityDashboard var ama HACCP/CCP modülü yok**

### Dakika 5-20: Onboarding + Hammadde Tanımı
- Taze Bey "Çiğ Süt" ürün kartı açıyor
- `ProductForm` 30+ alan — GTIP, Teknik Resim No, Kritiklik Sınıfı görünce kafa karışıyor
- **Gıda için olması gereken alanlar YOK:** allerjen (gluten, laktoz, yumurta...), E-kodları, mikrobiyolojik limit (koliform <10 kob/g), raf ömrü varsayılan, depolama sıcaklığı
- Sonuç: Taze Bey "Bu form bizim için değil" hissi

### Dakika 20-40: Tedarikçi + Lot Girişi
- `StockLotList` iyi çalışıyor — son kullanma uyarısı (30g), renk kodu, expire log
- ✅ Kuvvetli nokta: Alert, stat kartları, expiry validation
- ⚠️ Eksik: **"Lot kabul sırasında sıcaklık ölçümü" alanı yok**. Erdal Bey süt tankerinden indirken 4°C ölçmeli — sisteme girilmiyor
- ⚠️ Eksik: Tedarikçi analiz sertifikası (CoA) upload zorunluluğu yok

### Dakika 40-60: HACCP Kontrol Planı
- Kullanıcı `/quality/control-plans` arar — `ControlPlanManagement` açılır
- ⚠️ **Kritik sorun:** ControlPlan generic — CCP (Critical Control Point) kavramı, critical limit, izleme sıklığı, düzeltici aksiyon tetikleme yok
- CCP1: Pastörizasyon 72°C/15sn → Quvex bunu anlayamaz, operatör değer girse bile **otomatik NCR tetikleme yok**
- Tülay Hanım: "Bunu tablo olarak Excel'de tutuyoruz, sistemde izlenemiyor"

### Dakika 60-90: Üretim Emri (Yogurt)
- BOM: Çiğ süt + süt tozu + kültür + ambalaj → Yogurt
- İbrahim ShopFloor'da "Pastörize Et" adımını başlatır → 72°C ölçer
- ⚠️ Eksik: **ShopFloorTerminal'de "Sıcaklık alanı" yok.** Operatör değer giremez, sadece saat/miktar
- ⚠️ Eksik: Otomatik pH/kıvam ölçümü için özel input yok

### Dakika 90-120: Sevkiyat + Soğuk Zincir
- Irsaliye hazırlanırken araç sıcaklık logger bilgisi yok
- "Araç soğutma cihazı sağlam mı?" checklist yok
- ⚠️ Kritik eksik: **Soğuk zincir kırılması takibi yok**

## 1.4 Recall Senaryosu (Gıdanın KALBİ) — ⚠️ YOK

**Senaryo:** Tülay Hanım mikrobiyoloji raporu alıyor — LOT-2026-045 (çilekli yogurt, 3200 adet) listeria pozitif.

**Gereken akış:**
1. Lot numarasından ileri izlenebilirlik → hangi siparişlere gitti?
2. Müşteri başına adet raporu (Ford Market: 400 adet, A101: 800 adet, vb.)
3. Müşterilere otomatik bildirim (email/SMS şablonu)
4. Recall raporu PDF (Tarım Bakanlığı formatı)
5. Hammadde geri izleme → hangi süt tankeri, hangi kültür lot?
6. Kök sebep analizi → CAPA tetikleme

**Quvex'te mevcut durum:**
- SerialNumberList / DataPackButton mevcut — ama **recall workflow'u YOK**
- Lot bazlı arama mevcut — ama "müşteri başına dağılım raporu" için manuel SQL gerekir
- ⚠️ **Taze Bey için deal-breaker:** Gıda müşterisi recall olmadan Quvex alamaz

## 1.5 Gıda Sektörüne Özgü Boşluklar

| # | Eksik | Öncelik | Etki |
|---|-------|---------|------|
| G1 | **HACCP CCP modülü** (critical limit, izleme sıklığı, düzeltici aksiyon) | P0 | 🔴 Sektör zorunluluğu |
| G2 | **Recall (Geri Çağırma) iş akışı** — ileri/geri lot, müşteri dağılımı, bildirim | P0 | 🔴 Yasal zorunluluk |
| G3 | **Allerjen matrisi** ürün kartında (gluten, laktoz, yumurta, soya, fıstık) | P0 | 🔴 Etiket yasası |
| G4 | **Raf ömrü otomatik hesaplama** (üretim tarihi + X gün) | P0 | 🔴 ISO 22000 |
| G5 | **Sıcaklık logging** — WarehouseForm'da min/max + ShopFloor'da ölçüm input | P0 | 🔴 Soğuk zincir |
| G6 | **Analiz sertifikası (CoA) upload** hammadde lot kabul sırasında | P1 | 🟡 |
| G7 | **FIFO zorunluluk** stok çıkışında (en eski lot otomatik seçilsin) | P1 | 🟡 |
| G8 | **Temizlik/dezenfeksiyon check-list** ekipmana bağlı | P1 | 🟡 |
| G9 | **Numune saklama kaydı** (her parti için retain sample) | P2 | 🟢 |
| G10 | **Metal dedektör/X-ray** CCP entegrasyonu | P2 | 🟢 |
| G11 | **Onaylı tedarikçi listesi** (Tarım Bakanlığı kayıt no) | P1 | 🟡 |

## 1.6 Gıda — Persona Mutluluk Skoru

| Persona | Skor | Not |
|---------|------|-----|
| **İbrahim (Operatör)** | **7/10** | ShopFloor iyi — sıcaklık/pH input yok |
| **Erdal (Depocu)** | **6/10** | StockLot iyi — FIFO ve sıcaklık yok |
| **Tülay (Kaliteci)** | **4/10** | HACCP/CCP yok, allerjen yok |
| **Pınar (Ür. Müdürü)** | **5/10** | Üretim akışı generic, pastörizasyon otomasyonu yok |
| **Taze Bey (Patron)** | **3/10** | Recall yok = kabul edilemez |

**Ortalama: 5.0/10** — Sektörel derinleşme yapılmazsa Quvex gıda pazarında satılmaz.

---

# BÖLÜM 2 — OTOMOTİV YAN SANAYİ (Aslan Otomotiv)

## 2.1 Ekip Değerlendirmesi

| Rol | Persona | Profil |
|-----|---------|--------|
| **Patron** | Aslan Bey, 50 | Kauçuk conta üreticisi, Ford Otosan Tier-2 tedarikçisi |
| **Üretim Müdürü** | Burak Bey | Vulkanizasyon preslerinde 3 vardiya |
| **Operatör** | Ramazan Usta | Pres operatörü, hızlı kalıp değişimi |
| **Kaliteci** | Esra Hanım | SPC/Cp-Cpk takip, boyut ölçümü |
| **APQP Sorumlusu** | Cem Bey | PPAP belge yöneticisi, müşteri portalı takibi |

## 2.2 Ekran Skorları — Otomotiv Sektörü

| Ekran | Persona | Karmaşıklık | Kullanılabilirlik | IATF Uyum | Mobile | Genel |
|-------|---------|-------------|-------------------|-----------|--------|-------|
| **Register / Sektör: automotive** | Aslan Bey | 3/10 | 8/10 | — | 8/10 | **7/10** |
| **CustomerForm (Ford, CSR alan)** | Aslan Bey | 7/10 | 5/10 | 4/10 | 5/10 | **5/10** |
| **ProductForm (kauçuk conta)** | Cem Bey | 9/10 | 4/10 | 5/10 | 5/10 | **5/10** |
| **OfferForm (RFQ)** | Cem Bey | 6/10 | 6/10 | 5/10 | 5/10 | **6/10** |
| **ControlPlanManagement** ✅ | Esra | 6/10 | 7/10 | 8/10 | 5/10 | **7/10** |
| **RiskFmeaManagement (PFMEA)** ✅ | Cem Bey | 7/10 | 7/10 | 8/10 | 5/10 | **7/10** |
| **SpcManagement** ✅ | Esra | 7/10 | 8/10 | **9/10** | 5/10 | **8/10** |
| **ProcessCapability (Cp/Cpk)** ✅ | Esra | 6/10 | 8/10 | **9/10** | 5/10 | **8/10** |
| **PpapManagement** ✅ | Cem Bey | 7/10 | 7/10 | **8/10** | 5/10 | **7/10** |
| **FaiManagement** ✅ | Cem Bey | 7/10 | 7/10 | 7/10 | 4/10 | **7/10** |
| **GageRRManagement (MSA)** ✅ | Esra | 8/10 | 6/10 | 8/10 | 4/10 | **6/10** |
| **ShopFloorTerminal** | Ramazan | 2/10 | 9/10 | 6/10 | 9/10 | **8/10** |
| **SupplierEvaluation** | Aslan Bey | 5/10 | 7/10 | 7/10 | 5/10 | **7/10** |
| **CustomerPortal** | Aslan Bey | 5/10 | 6/10 | 6/10 | 5/10 | **6/10** |
| **8D Workflow** (eightD klasör) | Cem Bey | 7/10 | 6/10 | 6/10 | 5/10 | **6/10** |

**Ortalama: 6.6/10** — Otomotiv için en yüksek skor. Kalite altyapısı profesyonel.

## 2.3 Aslan Bey'in Yolculuğu

### Dakika 0-10: Register + Ford Otosan Kaydı
- `automotive` sektör profili seçilir — 20 modül otomatik aktif
- PPAP, SPC, FMEA, ProcessCapability, GageRR, FAI, CustomerPortal, SupplierEval hepsi menüde
- ⚠️ **Sorun:** CustomerForm'da Ford özel gereklilikleri (CSR = Customer Specific Requirements) için alan yok — sadece "Notlar" alanına yazılabiliyor

### Dakika 10-30: Kauçuk Conta Ürün Tanımı
- ProductForm açılır — 30+ alan korkutuyor (Mehmet Bey ile aynı sorun)
- ⚠️ **Otomotiv için eksik alanlar:** IMDS madde deklarasyonu, sorumluluk düzeyi (ESD/SC/CC), kritik karakteristikler listesi, kontrol planı linki
- ⚠️ Eksik: "Müşteri çizim revizyonu" versioning (Rev A, Rev B otomatik takip)

### Dakika 30-60: PFMEA + ControlPlan + PPAP Başlatma
- `RiskFmeaManagement` 211 satır, PFMEA için yeterli
- ✅ RPN (Severity × Occurrence × Detection) var
- `ControlPlanManagement` ürünle bağlanır
- ✅ PPAP Level 3 seçilir (`PpapManagement`), 18 eleman otomatik oluşur — bu **profesyonel** bir davranış
- ⚠️ **Eksik:** PPAP elemanları arasındaki **zorunlu bağlantılar** (PFMEA → ControlPlan → PPAP bağı otomatik değil, manuel referans)
- ⚠️ Eksik: **APQP Gate gözden geçirme** (5 aşamalı) modülü yok

### Dakika 60-90: Üretim + SPC Ölçümü
- Ramazan Usta ShopFloor'da vulkanizasyon başlatır
- Esra Hanım SPC chart'ına X-bar R tipinde subgroup 5 veri girer
- ✅ `SpcManagement` mükemmel çalışır: UCL/LCL/CL çizgileri, violation tespiti, Cpk hesaplanır
- ⚠️ **Küçük sorun:** Veri giriş modal'ı masaüstü oriented — Esra tablet'ten çalışmak isteyebilir
- ⚠️ **Eksik:** SPC ile ShopFloor **otomatik bağlantı yok** — operatör ölçüm yapsa SPC'ye otomatik gitmiyor, manuel giriş gerekir

### Dakika 90-120: PPAP Submission + Sevkiyat
- `PpapManagement`'dan "Sun" tıklanır → Submitted → Approved
- ⚠️ **Kritik eksik:** PPAP paketinin tek PDF olarak export'u yok. Cem Bey Ford'a her elemanı tek tek göndermez — **tek paketlenmiş PDF** (Warrant + 18 eleman) beklenir.
- ⚠️ Eksik: Ford Otosan müşteri portalı entegrasyonu (SSC, Covisint benzeri)

## 2.4 Otomotiv Sektörüne Özgü Boşluklar

| # | Eksik | Öncelik | Etki |
|---|-------|---------|------|
| O1 | **PPAP paket PDF export** (Warrant + 18 eleman tek dosya) | P0 | 🔴 Müşteri teslim formatı |
| O2 | **PFMEA → ControlPlan → PPAP otomatik bağlantı** | P0 | 🔴 IATF gereklilik |
| O3 | **Müşteri CSR (Customer Specific Requirements)** yönetimi | P0 | 🔴 Ford/Tofaş zorunlu |
| O4 | **APQP 5 Gate gözden geçirme** modülü | P1 | 🟡 IATF referans |
| O5 | **IMDS madde deklarasyonu** ürün kartında | P1 | 🟡 AB zorunlu |
| O6 | **8D Rapor template + PDF** (eightD klasörü var ama PDF export yok) | P1 | 🟡 Müşteri şikayeti |
| O7 | **ShopFloor → SPC otomatik veri akışı** | P1 | 🟡 Veri bütünlüğü |
| O8 | **ECN (Engineering Change Notice)** workflow — çizim revizyon | P1 | 🟡 |
| O9 | **Yedek parça matrix** (Service Parts interchangeability) | P2 | 🟢 |
| O10 | **Kontrol planı otomatik revizyon** (çizim değişince kontrol planı bayraklanır) | P1 | 🟡 |

## 2.5 Otomotiv — Persona Mutluluk Skoru

| Persona | Skor | Not |
|---------|------|-----|
| **Ramazan (Operatör)** | **8/10** | ShopFloor mükemmel |
| **Esra (Kaliteci)** | **8/10** | SPC/ProcessCapability/FMEA profesyonel — tablet UX iyileştirilmeli |
| **Cem (APQP)** | **5/10** | PPAP var ama paket export + CSR yok |
| **Burak (Ür. Müdürü)** | **6/10** | Üretim iyi — vulkanizasyon hat tipi özel alan yok |
| **Aslan Bey (Patron)** | **7/10** | Ford tedarikçi gereksinimlerini büyük oranda karşılıyor |

**Ortalama: 6.8/10** — Otomotiv pazarı için Quvex **satılabilir** durumda. 10 saatlik iyileştirme ile 8.5/10'a çıkar.

---

# BÖLÜM 3 — PLASTİK ENJEKSİYON (Özkan Plastik)

## 3.1 Ekip Değerlendirmesi

| Rol | Persona | Profil |
|-----|---------|--------|
| **Patron** | Özkan Bey, 47 | Plastik kasa üreticisi, 8 enjeksiyon makinesi |
| **Üretim Müdürü** | Cengiz Bey | OEE takip, hat dengeleme, setup süresi azaltma |
| **Operatör** | Mahmut Usta | Kalıp değişimi yapan, SMED eğitimli |
| **Kaliteci** | Defne Hanım | Boyut + ağırlık kontrol, renk kontrol |
| **Depocu** | Ahmet Bey | Granül + masterbatch, nem kontrolü, kurutucu |

## 3.2 Ekran Skorları — Plastik Sektörü

| Ekran | Persona | Karmaşıklık | Kullanılabilirlik | Plastik Uyum | Mobile | Genel |
|-------|---------|-------------|-------------------|--------------|--------|-------|
| **Register / Sektör: plastic** | Özkan | 3/10 | 8/10 | — | 8/10 | **7/10** |
| **MachinesForm (enjeksiyon)** | Cengiz | 5/10 | 7/10 | **3/10** | 7/10 | **5/10** |
| **Kalıp Envanteri (YOK)** ⚠️ | Mahmut | — | **0/10** | **0/10** | — | **0/10** |
| **ProductForm (plastik kasa)** | Özkan | 9/10 | 4/10 | 4/10 | 5/10 | **4/10** |
| **StockLotList (granül)** ✅ | Ahmet | 4/10 | 8/10 | 6/10 | 7/10 | **7/10** |
| **Production (enjeksiyon emri)** | Cengiz | 6/10 | 6/10 | 3/10 | 6/10 | **5/10** |
| **ShopFloorTerminal** | Mahmut | 2/10 | 9/10 | 5/10 | 9/10 | **7/10** |
| **OeeDashboard** ✅ | Cengiz | 7/10 | 9/10 | 8/10 | 5/10 | **8/10** |
| **CapacityScheduling** | Cengiz | 6/10 | 6/10 | 4/10 | 4/10 | **5/10** |
| **SpcManagement (boyut)** | Defne | 7/10 | 8/10 | 7/10 | 5/10 | **7/10** |
| **Setup Süre Takibi (YOK)** ⚠️ | Mahmut | — | **0/10** | **0/10** | — | **0/10** |
| **Çevrim Süresi (YOK)** ⚠️ | Cengiz | — | **0/10** | **0/10** | — | **0/10** |

**Ortalama: 5.0/10** — OEE dashboard ve SPC kuvvetli, ama plastiğin kalbi olan **kalıp** hiç yok.

## 3.3 Özkan Bey'in Yolculuğu

### Dakika 0-10: Register + Setup
- `plastic` sektör profili seçilir → menü 17 modül (OEE, ProcessCapability, stockLots)
- ✅ İyi haber: OEE varsayılan `dashboardMode: full`

### Dakika 10-30: Makine + Kalıp Tanımı
- 8 enjeksiyon makinesi `MachinesForm`'da girilir (Arburg, Engel, Krauss-Maffei)
- ⚠️ **Kritik sorun:** Kalıp tanımı için **ayrı bir modül yok**. Mahmut 40+ kalıbını nasıl takip edecek?
- Workaround: Her kalıp ayrı "ürün" veya "ekipman" olarak tanımlanabilir — ama bu yanlış model
- ⚠️ **Kalıp meta-verileri YOK:** kavite sayısı, klem kuvveti gereksinimi, çevrim süresi, maksimum enjeksiyon basıncı, sıcaklık profili, kalıp ömrü (çevrim sayısı), bakım tarihi

### Dakika 30-60: Granül Lot Kabul
- `StockLotList` çalışıyor — PP granül LOT-2026-003, 1000 kg
- ✅ Kuvvetli: son kullanma tarihi, tedarikçi, not alanı
- ⚠️ **Eksik:** Nem oranı (PP için %0.05 max), MFI (Melt Flow Index), renk, masterbatch oranı
- ⚠️ Granül kurutma öncesi/sonrası stok ayrımı yok

### Dakika 60-90: Üretim + Setup
- Üretim emri: "10.000 adet PP kasa, KALIP-M12 ile"
- ShopFloor'da Mahmut "Başla" basar
- ⚠️ **Eksik:** **Setup süresi takibi yok.** SMED metodolojisinde setup süresi = kritik KPI. Quvex'te sadece operasyon toplam süresi var
- ⚠️ **Eksik:** **Çevrim süresi takibi yok.** Plastikte 30sn çevrim × 10.000 adet = 83 saat. Saatlik çevrim sayısı otomasyon gerektirir
- ⚠️ Workaround: `ProductionWorkOrderStatus` ile manuel girilir — ama gerçek zamanlı değil

### Dakika 90-120: OEE + Fire Analizi
- ✅ `OeeDashboard` mükemmel — Availability × Performance × Quality
- ⚠️ **Eksik:** Plastiğe özgü fire kategorileri:
  - Çapak (flash)
  - Çekme (sink)
  - Yanık (burn)
  - Kısa dolum (short shot)
  - Gaz kabarcığı
  - Renk hatası (streaks)
- Kalite modülü "NCR" olarak generic alır — plastikçinin sınıflandırması kaybolur

## 3.4 Plastik Sektörüne Özgü Boşluklar

| # | Eksik | Öncelik | Etki |
|---|-------|---------|------|
| P1 | **Kalıp envanteri modülü** (Mold Inventory — kavite, ömür, bakım) | P0 | 🔴 Plastiğin kalbi |
| P2 | **Çevrim süresi gerçek zamanlı takip** (target vs actual) | P0 | 🔴 KPI zorunlu |
| P3 | **Setup süre takibi (SMED)** — kalıp değişim başlat/bitir | P0 | 🔴 Verimlilik |
| P4 | **Kalıp-makine uyum matrisi** (hangi kalıp hangi makinede çalışır) | P0 | 🔴 |
| P5 | **Fire kategorileri** (çapak, çekme, yanık, kısa dolum) | P1 | 🟡 Kalite sınıflandırma |
| P6 | **Masterbatch oranı hesaplama** (renk + baz granül otomatik BOM) | P1 | 🟡 |
| P7 | **Granül nem/MFI ölçüm kaydı** | P1 | 🟡 |
| P8 | **Kalıp bakım planlaması** (her 50.000 çevrimde bakım) | P1 | 🟡 |
| P9 | **Kalıp ısıtma/soğutma sıcaklık profili** makine parametresinde | P2 | 🟢 |
| P10 | **Çevrim sayacı → OEE otomatik veri** | P0 | 🔴 |

## 3.5 Plastik — Persona Mutluluk Skoru

| Persona | Skor | Not |
|---------|------|-----|
| **Mahmut (Operatör)** | **6/10** | ShopFloor iyi — setup süre takibi yok, kalıp değişimi anlamsız |
| **Ahmet (Depocu)** | **6/10** | StockLot iyi — nem/MFI alanı yok |
| **Defne (Kaliteci)** | **7/10** | SPC iyi, fire kategorileri yok |
| **Cengiz (Ür. Müdürü)** | **5/10** | OEE iyi ama kalıp yönetimi kritik eksik |
| **Özkan Bey (Patron)** | **4/10** | "Kalıp yok = plastik sistemi değil" |

**Ortalama: 5.6/10** — OEE/SPC kuvvetli ama **kalıp envanteri olmadan plastik sektörüne satılamaz**.

---

# BÖLÜM 4 — MAKİNE İMALATI (Teknik Makine Mühendislik)

## 4.1 Ekip Değerlendirmesi

| Rol | Persona | Profil |
|-----|---------|--------|
| **Patron** | Teknik Bey, 55 | Konveyör/paketleme makinesi üretir, proje bazlı iş |
| **Üretim Müdürü** | Bahadır Bey | 60 personel, montaj hatları + elektrik pano |
| **Operatör** | Sercan Usta | Mekanik montajcı, 15 yıl tecrübeli |
| **Kaliteci** | Tuncer Bey | Fonksiyonel test + CE dosya sorumlusu |
| **Tasarım** | Yusuf Mühendis | CE teknik dosya hazırlayan, CAD kullanıcısı |

## 4.2 Ekran Skorları — Makine İmalatı

| Ekran | Persona | Karmaşıklık | Kullanılabilirlik | Proje Uyum | Mobile | Genel |
|-------|---------|-------------|-------------------|------------|--------|-------|
| **Register (makinery profili YOK)** ⚠️ | Teknik | — | **2/10** | — | — | **2/10** |
| **CustomerForm (Sağlıklı Gıda)** | Teknik | 6/10 | 6/10 | 5/10 | 5/10 | **6/10** |
| **ProductForm (konveyör 200+ parça)** ⚠️ | Yusuf | **10/10** | **2/10** | 3/10 | 4/10 | **3/10** |
| **ProductTreeView (multi-level BOM)** | Yusuf | 8/10 | 5/10 | 4/10 | 3/10 | **5/10** |
| **OfferForm (ETO teklif)** | Teknik | 7/10 | 5/10 | 4/10 | 5/10 | **5/10** |
| **ProjectManagement** ✅ | Teknik | 6/10 | 7/10 | 7/10 | 5/10 | **7/10** |
| **ProductionGantt** | Bahadır | 6/10 | 6/10 | 5/10 | 3/10 | **5/10** |
| **Production (4 is emri)** | Bahadır | 6/10 | 6/10 | 5/10 | 6/10 | **6/10** |
| **ShopFloorTerminal** | Sercan | 2/10 | 9/10 | 6/10 | 9/10 | **8/10** |
| **FaiManagement (final test)** | Tuncer | 6/10 | 7/10 | 6/10 | 4/10 | **6/10** |
| **CE Dosya Yönetimi (YOK)** ⚠️ | Yusuf | — | **0/10** | **0/10** | — | **0/10** |
| **Commissioning (YOK)** ⚠️ | Bahadır | — | **0/10** | **0/10** | — | **0/10** |
| **Garanti Takibi (YOK)** ⚠️ | Teknik | — | **0/10** | **0/10** | — | **0/10** |

**Ortalama: 5.0/10** — ProjectManagement güzel bir temel, ama ETO iş modeline özel araçlar eksik.

## 4.3 Teknik Bey'in Yolculuğu

### Dakika 0-10: Register
- ⚠️ **Kritik sorun:** `uiConfig.js`'de **"machinery" sektör profili YOK**
- Teknik Bey "general" veya "defense" profilinden seçmek zorunda
- Menüler yanlış optimize — gıda tarımı alanları görünür, gerekli CE/Proje modülleri otomatik gelmez

### Dakika 10-30: Müşteri + Proje Kaydı
- ✅ `ProjectManagement` açılır — Proje adı, müşteri, sözleşme no, bütçe, öncelik, milestone, task
- İyi temel — AS9100 8.1.1 referansı var
- ⚠️ **Eksik:** Proje ile **üretim iş emri bağlantısı** belirsiz — iş emri projeye mi yoksa sipariş'e mi bağlanıyor?
- ⚠️ Eksik: Milestone-based invoicing (aşama bazlı fatura: %30 sipariş + %40 teslim + %30 montaj sonrası)

### Dakika 30-90: Çok Seviyeli BOM (200+ parça)
- Konveyör: Şasi + Motor + Bant + Sensörler + Elektrik Pano + ...
- Her ana grup alt gruplara ayrılır — 3-4 seviye BOM
- ⚠️ **Kritik sorun:** `ProductTreeView.js` (424 satır) var ama:
  - Alt montaj grubunu "ayrı ürün" olarak tanımlama gerekir (K5 — bilinen kısıtlama!)
  - Aynı parça farklı yerlerde kullanılıyorsa tekrar girmek gerekir
  - Parça listesi Excel'den import edilemez (CAD/PLM sistemlerinden export edilir normalde)
- ⚠️ **Eksik:** CAD dosyası (STEP/DWG) ürün kartına link + önizleme
- ⚠️ **Eksik:** Where-used analysis (bu parça hangi ana ürünlerde kullanılıyor)

### Dakika 90-120: Malzeme İhtiyaç + MRP
- MRP modülü var (`modul/mrp/`), Teknik Bey çalıştırır
- ⚠️ **Eksik:** Proje bazlı MRP — "Sadece Proje-12 için ne eksik?"
- Satın alma önerileri listelenir ama **projeye maliyet dağıtımı zor**

### Dakika 120-180: Üretim — 4 İş Emri Paralel
- İş emri 1: Şasi (kesim + kaynak)
- İş emri 2: Tahrik mili (torna + freze)
- İş emri 3: Mekanik montaj
- İş emri 4: Elektrik pano
- ⚠️ **Sorun:** Gantt'te bu 4 iş emrinin **proje bağı** görsel olarak net değil
- ⚠️ Gantt drag-drop yok (CNC auditinde de aynı tespit)

### Dakika 180-210: Fonksiyonel Test + CE Dosya
- Tuncer Bey `FaiManagement` kullanır — iyi bir temel
- ⚠️ **Kritik eksik:** **CE Teknik Dosya şablonu YOK** (K2 — bilinen kısıtlama)
- CE dosyası için gereken:
  - EN ISO 12100 risk değerlendirmesi (yok — K6)
  - Uygunluk beyanı (Declaration of Conformity) PDF şablonu yok
  - Kullanım kılavuzu versiyon yönetimi yok
  - Elektrik şeması link yok (K9)
- Workaround: Klasör içinde PDF saklanır (DocumentControlForm)

### Dakika 210-240: Devreye Alma (Commissioning) + Garanti
- Makine müşteri sahasına gönderilir — Bahadır ekibi montaja gider
- ⚠️ **Eksik:** **Saha montaj modülü yok** (K3) — iş emri olarak tanımlanır (workaround)
- Müşteri kabul sonrası garanti başlar — ⚠️ **Garanti takip modülü yok** (K4)

## 4.4 Makine İmalatı Sektörüne Özgü Boşluklar

| # | Eksik | Öncelik | Etki |
|---|-------|---------|------|
| M1 | **"machinery" sektör profili** `uiConfig.js`'e eklenmeli | P0 | 🔴 Başlangıç |
| M2 | **Çok seviyeli BOM görsel ağaç** (drag-drop, collapse, where-used) | P0 | 🔴 ETO zorunlu |
| M3 | **CE Teknik Dosya modülü** (uygunluk beyanı, risk, kılavuz, şema) | P0 | 🔴 AB ihracat |
| M4 | **Risk Değerlendirmesi** EN ISO 12100 şablonu | P0 | 🔴 CE zorunlu |
| M5 | **Milestone-based faturalandırma** (aşamalı fatura otomatik) | P1 | 🟡 Nakit akış |
| M6 | **Commissioning modülü** (saha montaj checklist, müşteri imza) | P1 | 🟡 |
| M7 | **Garanti takibi** (başlangıç/bitiş, çağrı kaydı, yedek parça) | P1 | 🟡 |
| M8 | **Proje maliyet dağıtımı** (iş emri saat → proje bütçesi) | P1 | 🟡 |
| M9 | **Kullanım kılavuzu versiyonlama** (PDF + revizyon notu) | P2 | 🟢 |
| M10 | **CAD dosyası link + 3D önizleme** (STEP/IGES) | P2 | 🟢 |
| M11 | **Müşteri eğitim kayıtları** (makine teslimi sonrası) | P2 | 🟢 |

## 4.5 Makine İmalatı — Persona Mutluluk Skoru

| Persona | Skor | Not |
|---------|------|-----|
| **Sercan (Operatör)** | **8/10** | ShopFloor mükemmel, montaj checklist olursa 9/10 |
| **Tuncer (Kaliteci)** | **5/10** | FAI var, CE dosya ve risk değerlendirmesi yok |
| **Yusuf (Tasarım)** | **3/10** | Multi-level BOM zor, CAD link yok, CE dosya yok |
| **Bahadır (Ür. Müdürü)** | **5/10** | ProjectManagement iyi ama commissioning eksik |
| **Teknik Bey (Patron)** | **4/10** | Garanti/CE olmadan makine satışı tamamlanmaz |

**Ortalama: 5.0/10** — Makine imalatı için Quvex **temel proje yönetimi** sunuyor ama **ETO iş modeline** özel araçlar eksik.

---

# BÖLÜM 5 — ÇAPRAZ SEKTÖR ORTAK BULGULAR

## 5.1 Tüm Sektörlerde Ortak Sorunlar (CNC + 4 yeni sektör)

| # | Sorun | Sektörler | Öncelik |
|---|-------|-----------|---------|
| C1 | **ProductForm 30+ alan** — minimal mode yok | Hepsi | P0 |
| C2 | **CustomerForm 6 tab** — insert karmaşık | Hepsi | P0 |
| C3 | **Mobil/tablet UX zayıf** planlama ekranlarında (Gantt, SPC giriş, PPAP elemanlar) | Hepsi | P1 |
| C4 | **Excel import** yok — büyük veri set'leri için kritik (BOM 200 parça, PPAP 18 eleman) | Hepsi | P1 |
| C5 | **Rapor PDF export** modül bazlı eksik (PPAP paket, Recall, CE dosya, HACCP plan) | Hepsi | P0 |
| C6 | **ShopFloor ↔ Kalite otomatik veri akışı yok** (ölçüm → SPC/NCR otomatik) | Hepsi | P1 |
| C7 | **Sektöre özgü alan/terim** ProductForm'da yok (allerjen/IMDS/kavite/BOM level) | Hepsi | P0 |
| C8 | **Workflow engine yok** (HACCP recall, APQP gate, CE onay, commissioning) | Hepsi | P1 |
| C9 | **Glossary (CCP, Cpk, PPAP, IMDS) tooltip coverage ~%30** — teknik terim patlaması | Hepsi | P2 |
| C10 | **Yardım/Help içerik sektöre göre filtrelenmiyor** — herkes tüm jargonu görür | Hepsi | P2 |

## 5.2 Sektöre Özgü Kritik Modül Eksiklikleri (Özet)

| Sektör | En Kritik 3 Eksik |
|--------|-------------------|
| **Gıda** | 1) HACCP/CCP modülü 2) Recall workflow 3) Allerjen matrisi |
| **Otomotiv** | 1) PPAP PDF paket export 2) CSR yönetimi 3) PFMEA→ControlPlan→PPAP otomatik bağ |
| **Plastik** | 1) Kalıp envanteri modülü 2) Çevrim süresi gerçek zamanlı 3) Setup (SMED) takip |
| **Makine** | 1) machinery sektör profili 2) CE teknik dosya modülü 3) Çok seviyeli BOM ağacı |

## 5.3 Sektör Hazırlık Matrisi

| Sektör | Altyapı | UX | Sektör-özel | Satış-Hazır? |
|--------|---------|-----|-------------|--------------|
| **CNC Talaşlı** (referans) | 8/10 | 6/10 | 7/10 | ✅ Evet (Quick Win sonrası 8/10) |
| **Otomotiv** | 8/10 | 7/10 | 7/10 | ✅ Evet (PPAP export + CSR ile 9/10) |
| **Plastik** | 6/10 | 6/10 | 3/10 | ⚠️ Kalıp modülü olmadan HAYIR |
| **Makine** | 5/10 | 6/10 | 3/10 | ⚠️ CE dosya + BOM ağacı olmadan zor |
| **Gıda** | 4/10 | 5/10 | 2/10 | ❌ HACCP + Recall olmadan HAYIR |

---

# BÖLÜM 6 — SEKTÖR BAZLI TOP QUICK WINS

## 6.1 Gıda Sektörü — Top 10 Quick Wins

| # | İş | Süre | Öncelik |
|---|-----|------|---------|
| 1 | ProductForm'a allerjen seçici (checkbox matris) | 3h | P0 |
| 2 | ProductForm'a raf ömrü gün + varsayılan saklama sıcaklığı | 2h | P0 |
| 3 | WarehouseForm'a min/max sıcaklık aralığı | 1h | P0 |
| 4 | StockLotList'e sıcaklık log tab (manuel giriş + grafik) | 5h | P0 |
| 5 | RecallModal component — lot → müşteri dağılımı + PDF export | 12h | P0 |
| 6 | ControlPlanManagement'e CCP bayrağı + kritik limit alanları | 4h | P0 |
| 7 | ShopFloor ölçüm alanı (CCP değer girişi — sıcaklık, pH) | 3h | P0 |
| 8 | Stok çıkışında FIFO otomatik lot seçimi + override | 3h | P1 |
| 9 | CoA upload zorunluluğu StockReceipt'te | 2h | P1 |
| 10 | Gıda sektörü help content (HACCP sözlüğü, ISO 22000) | 2h | P2 |

**Toplam: ~37 saat — Gıda pazarına giriş eşiği**

## 6.2 Otomotiv Sektörü — Top 10 Quick Wins

| # | İş | Süre | Öncelik |
|---|-----|------|---------|
| 1 | PPAP PDF paket export (tüm elemanlar tek dosya) | 10h | P0 |
| 2 | CustomerForm'a CSR (Customer Specific Requirements) tab | 3h | P0 |
| 3 | PFMEA → ControlPlan → PPAP otomatik bağlantı | 6h | P0 |
| 4 | SPC veri girişi tablet-friendly (büyük buton, hızlı input) | 4h | P1 |
| 5 | ShopFloor → SPC otomatik veri transferi | 6h | P1 |
| 6 | 8D Rapor PDF template + export | 4h | P1 |
| 7 | ECN (Engineering Change Notice) workflow | 8h | P1 |
| 8 | IMDS alan Product kartında | 2h | P1 |
| 9 | Çizim revizyon versiyon takibi (A, B, C) | 3h | P1 |
| 10 | PPAP element tooltip/glossary (CP, FMEA, MSA, AAR, DFMEA...) | 2h | P2 |

**Toplam: ~48 saat — Otomotiv tedarikçi pazarı için "bayrak gemisi"**

## 6.3 Plastik Sektörü — Top 10 Quick Wins

| # | İş | Süre | Öncelik |
|---|-----|------|---------|
| 1 | Kalıp envanteri modülü (MoldInventory) — kavite, ömür, bakım | 14h | P0 |
| 2 | Kalıp-makine uyum matrisi | 4h | P0 |
| 3 | Setup süre takibi (SMED — başlat/bitir) ShopFloor'da | 4h | P0 |
| 4 | Çevrim süresi gerçek zamanlı hesaplama (target vs actual) | 5h | P0 |
| 5 | OEE'ye çevrim sayacı otomatik veri (machine counter) | 6h | P0 |
| 6 | Fire kategorileri enum (çapak, çekme, yanık, kısa dolum) NCR'de | 2h | P1 |
| 7 | Granül StockLot'a nem + MFI alanları | 2h | P1 |
| 8 | Masterbatch oranı otomatik BOM hesaplama | 4h | P1 |
| 9 | Kalıp bakım plan (her X çevrimde) | 4h | P1 |
| 10 | Plastik sektörü sözlük (MFI, kavite, çevrim, flash, short shot) | 2h | P2 |

**Toplam: ~47 saat — Plastik pazarına giriş eşiği**

## 6.4 Makine İmalatı — Top 10 Quick Wins

| # | İş | Süre | Öncelik |
|---|-----|------|---------|
| 1 | `uiConfig.js`'e "machinery" sektör profili ekle | 1h | P0 |
| 2 | ProductTreeView'e drag-drop + collapse/expand iyileştir | 8h | P0 |
| 3 | CE Teknik Dosya modülü (yeni — DoC, risk, kılavuz, şema) | 14h | P0 |
| 4 | Risk Değerlendirmesi (EN ISO 12100) şablonu — FMEA benzeri | 8h | P0 |
| 5 | Where-used analizi (bu parça hangi ürünlerde?) | 4h | P1 |
| 6 | Milestone-based faturalandırma (proje + aşama → fatura) | 6h | P1 |
| 7 | Commissioning modülü (saha montaj checklist) | 8h | P1 |
| 8 | Garanti takibi (başlangıç/bitiş + çağrı kaydı) | 6h | P1 |
| 9 | Proje maliyet dağıtımı (iş emri saat → proje bütçe) | 5h | P1 |
| 10 | BOM Excel import (CSV/XLSX) | 4h | P1 |

**Toplam: ~64 saat — Makine imalatı pazarı için temel yeterlik**

## 6.5 Tüm Sektörlere Fayda — Çapraz Quick Wins

| # | İş | Süre | Kazanç |
|---|-----|------|--------|
| 1 | ProductForm 3 mod (Hızlı/Standart/Detaylı) + sektör default | 6h | Hepsi |
| 2 | CustomerForm minimal insert (3 alan) | 2h | Hepsi |
| 3 | GlossaryTooltip sektör filtreli (50 yeni terim) | 4h | Hepsi |
| 4 | PDF Export servisi generic (Recall, PPAP, CE, HACCP) | 8h | Hepsi |
| 5 | Workflow engine skeleton (HACCP recall, APQP gate, CE onay) | 16h | Hepsi |
| 6 | Sektöre göre home/dashboard routing | 3h | Hepsi |
| 7 | Excel import pattern (Product, BOM, CustomerList) | 8h | Hepsi |
| 8 | Help content sektör filtresi (`uiConfig.sector` üzerinden) | 3h | Hepsi |

**Toplam: ~50 saat — Tüm sektörlere yayılan altyapı kazancı**

---

# BÖLÜM 7 — STRATEJİK ÖNERİLER

## 7.1 Sektör Bazlı Go-To-Market Önceliği

**Önerilen sıralama (geliştirme efor / satış potansiyeli):**

1. **Otomotiv Yan Sanayi (1. öncelik)** — ~48h geliştirme → pazara hazır. 15.000 KOBİ, yüksek ARPU potansiyeli. PPAP/SPC altyapısı zaten profesyonel.

2. **Gıda Üretimi (2. öncelik)** — ~37h geliştirme → HACCP/Recall kritik. 25.000 KOBİ, en büyük pazar. Recall olmadan satılamaz ama tamamlanırsa **USP** olur (Türkiye'de az rakip).

3. **Plastik Enjeksiyon (3. öncelik)** — ~47h geliştirme → Kalıp envanteri ana blok. 12.000 KOBİ. OEE/SPC zaten var, kalıp modülü eklenince tam paket.

4. **Makine İmalatı (4. öncelik)** — ~64h geliştirme → CE dosya + BOM ağacı büyük iş. 10.000 KOBİ. Proje bazlı iş modeli ERP'den çok "PLM" gerektirir, scope dikkat.

## 7.2 Sektör Başına 4 Yeni Büyük Özellik Önerisi

### A. HACCP CCP Engine (Gıda)
- `QualityModule` altına `HaccpCcpManagement` yeni modül
- Kritik limit + izleme sıklığı + düzeltici aksiyon + sorumlu
- ShopFloor entegrasyonu: CCP ölçümü → tolerans dışı → otomatik NCR + HACCP alarmı
- ISO 22000 uyumlu PDF export

### B. RecallCommandCenter (Gıda)
- Lot → ileri izleme → müşteri dağılımı → iletişim + PDF raporlama
- "Simüle et" modu (gerçek recall öncesi hazırlık)
- Tarım Bakanlığı ve AB (RASFF) bildirim şablonları

### C. MoldInventory (Plastik)
- Kalıp kartı: kavite, ağırlık, klem kuvveti, çevrim süresi, ömür, bakım
- Kalıp-makine uyum matrisi
- Çevrim sayacı → OEE otomatik
- SMED timer: Kalıp değişimi başlat/bitir → hedef süre karşılaştırma

### D. CE Technical File Manager (Makine)
- Uygunluk beyanı (DoC) template + versiyon
- EN ISO 12100 risk değerlendirmesi şablonu (PFMEA benzeri engine)
- Kullanım kılavuzu revizyon takibi
- Elektrik şeması + CAD dosyası link yönetimi
- "CE dosyası eksik belgeler" checklist dashboard

## 7.3 Ortak Altyapı Yatırımları (Tek Efor, Çoklu Kazanç)

1. **Workflow Engine** — HACCP recall, APQP gate, CE onay, commissioning, 8D hepsi benzer durum makinesi. Tek engine ile 4 sektöre fayda. (~24h + kurucu modüller ayrı)

2. **Sektörel Glossary Katmanı** — `glossary.js` genişletme + sektör filtresi. CCP, IMDS, MFI, RPN, APQP, SPC, DoC... ~80 terim. (~4h)

3. **PDF Report Builder** — Recall raporu, PPAP paketi, HACCP planı, CE dosyası, 8D raporu hepsi benzer PDF şablon ihtiyacı. Tek servis + modül başına template. (~12h + şablonlar)

4. **Excel Import Pattern** — Product, BOM, Customer, Supplier için generic import wizard. ETO makine sektöründe 200+ parça Excel'den gelir. (~10h)

5. **ShopFloor Measurement Field Kit** — CCP değeri, SPC ölçümü, fire kategorisi, setup timer — hepsi ShopFloor'a dinamik alan olarak eklenebilir. Sektör profiline göre field set yükleme. (~10h)

---

# BÖLÜM 8 — SONUÇ

## 8.1 Quvex'in Sektörel Pozisyonu

**Güçlü olduğu sektörler:**
- ✅ **Otomotiv Yan Sanayi** — PPAP, SPC, FMEA, ProcessCapability, GageRR, FAI kuvvetli altyapı
- ✅ **CNC Talaşlı İmalat** — Referans senaryo, temel özellikler tam
- 🟡 **Plastik Enjeksiyon** — OEE/SPC var, kalıp eksik

**Zayıf olduğu sektörler:**
- ❌ **Gıda Üretimi** — HACCP/Recall kritik eksik
- 🟡 **Makine İmalatı** — Proje yönetimi var ama ETO derinleşmesi yok

## 8.2 Toplam Efor Tahmini

| Paket | Süre | Kazanç |
|-------|------|--------|
| **Tüm sektör Quick Wins** (37+48+47+64) | ~196h (~25 gün) | 4 sektör pazara hazır |
| **Ortak altyapı** (workflow, PDF, glossary, import) | ~50h (~7 gün) | Tüm modüllere yayılım |
| **4 Büyük Modül** (HACCP, Recall, Mold, CE) | ~80h (~10 gün) | USP oluşturma |
| **TOPLAM** | **~326h (~42 gün)** | **5 sektör hazır** |

## 8.3 Mehmet Bey'den Beş Yeni Patrona

CNC denetiminde "Mehmet Bey'in 14 günlük trial sürecinde vay anasını demesi" hedeflendi. Benzer hedef 4 yeni persona için:

- **Taze Bey (Gıda):** Recall ve HACCP modülleri olmadan Quvex'i değerlendirmez. Quick Win'lerden sonra: %20 → %65 satın alma olasılığı.
- **Aslan Bey (Otomotiv):** PPAP paket PDF export olursa Ford Otosan uyumluluğu görüyor. %55 → %85 olasılık.
- **Özkan Bey (Plastik):** Kalıp modülü olmadan "bu bizim için değil" der. %25 → %70 olasılık.
- **Teknik Bey (Makine):** CE dosya modülü olmadan AB ihracat yapan müşterileri ikna edemez. %30 → %65 olasılık.

**Tüm sektörler için Quvex'in ortalama hazırlık skoru: 5.2/10 → hedeflenen iyileştirmelerden sonra 7.5/10**

## 8.4 Tek Cümle Özet

> **Quvex, otomotiv yan sanayi için bugün satılabilir durumda; gıda, plastik ve makine imalatı için ise **sektöre özgü dört büyük modül** (HACCP/Recall, Kalıp Envanteri, CE Teknik Dosya) ve **ortak altyapı yatırımı** (workflow engine, PDF builder, Excel import) ile 6 hafta içinde 5 sektöre birden girebilecek güçlü bir platform olur.**

---

*Denetim sonu — 2026-04-10*
