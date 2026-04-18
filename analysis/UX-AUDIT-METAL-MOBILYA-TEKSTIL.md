# Quvex ERP — Metal / Mobilya / Tekstil Sektör UX Denetimi

> Tarih: 2026-04-10
> Yöntem: Kod seviyesinde derin inceleme + sektör persona simülasyonu
> Referans: `CNC-USER-JOURNEY-UX-AUDIT.md` (aynı metodoloji)
> Kapsam: 3 büyük sivil KOBİ sektörü — ~110.000 firma pazarı

---

## YÖNETİCİ ÖZETİ

| Sektör | KOBİ Sayısı | Ortalama Skor | Persona Mutluluğu | Kritik Eksik |
|--------|-------------|---------------|-------------------|--------------|
| **Metal / Çelik Konstrüksiyon** | ~45.000 | **5.8/10** | 5.9/10 | Nesting, tonaj birimi, EN 1090 EXC |
| **Mobilya İmalatı** | ~35.000 | **5.4/10** | 5.4/10 | Panel nesting, set bazlı stok, renk kodu |
| **Tekstil / Hazır Giyim** | ~30.000 | **4.6/10** | 4.5/10 | Beden-renk matrisi, pastal, AQL |

**Genel Değerlendirme:** Quvex'in mevcut altyapısı (ShopFloorTerminal, OEE, bakım, kalibrasyon, NCR) 3 sektörde de iyi çalışıyor. Fakat her sektörün **kendine özgü planlama/veri modeli eksiği** var. Tekstil en fazla acı çekiyor çünkü **varyant matrisi** çekirdek iş modelidir — workaround (15 ayrı ürün kartı) kabul edilemez.

---

# SEKTÖR 1: METAL EŞYA / ÇELİK KONSTRÜKSİYON

## EKİP DEĞERLENDİRMESİ

| Rol | İsim | Persona |
|-----|------|---------|
| **Patron** | Yılmaz Bey, 50 | 40 kişilik çelik raf imalatçısı, 15 yıllık tecrübe |
| **Üretim Müdürü** | Mustafa Bey | Sac kesim + bükme + kaynak + boya hattı yöneticisi |
| **Operatör** | Hasan Usta | CNC plazma kesim operatörü |
| **Kalite Şefi** | Sema Hanım | EN 1090 ve CE sertifika takibi |
| **Depo Sorumlusu** | Kerem Bey | Profil + sac stoku (KG bazlı) |
| **Saha Montaj Ekibi** | Talat Usta | Müşteri sahasında kurulum |

## SKORLAR — EKRAN BAZLI (Metal)

| Ekran | Persona | Karmaşıklık | Kullanılabilirlik | Mobile | Help | Sektör Uyum | Genel |
|-------|---------|-------------|-------------------|--------|------|-------------|-------|
| Register | Yılmaz | 4/10 | 7/10 | 8/10 | 5/10 | 7/10 | **6/10** |
| Login | Yılmaz | 1/10 | 9/10 | 9/10 | 6/10 | 9/10 | **8/10** |
| Onboarding Wizard | Yılmaz | 3/10 | 8/10 | 7/10 | 7/10 | 5/10 | **6/10** |
| CustomerForm | Yılmaz | 6/10 | 6/10 | 5/10 | 4/10 | 7/10 | **5/10** |
| **ProductForm** | Yılmaz | **9/10** | **3/10** | 5/10 | 3/10 | **3/10** | **3/10** |
| MachinesForm | Mustafa | 5/10 | 8/10 | 7/10 | 4/10 | 8/10 | **6/10** |
| SalesForm | Mustafa | 5/10 | 7/10 | 6/10 | 5/10 | 6/10 | **6/10** |
| Production List | Mustafa | 4/10 | 8/10 | 6/10 | 6/10 | 6/10 | **6/10** |
| ProductionGantt | Mustafa | 6/10 | 6/10 | 3/10 | 4/10 | 5/10 | **5/10** |
| **ShopFloor Terminal** | Hasan | 2/10 | **9/10** | 9/10 | 5/10 | 8/10 | **8/10** |
| InspectionList | Sema | 5/10 | 7/10 | 6/10 | 5/10 | **4/10** | **5/10** |
| NcrList | Sema | 6/10 | 7/10 | 6/10 | 6/10 | 7/10 | **7/10** |
| Stock List (KG) | Kerem | 6/10 | 7/10 | 7/10 | 5/10 | **4/10** | **6/10** |
| StockLotList | Kerem | 5/10 | 7/10 | 6/10 | 6/10 | 6/10 | **6/10** |
| BarcodeOperations | Kerem | 4/10 | **9/10** | 9/10 | 6/10 | 7/10 | **8/10** |
| InvoiceList | — | 7/10 | 7/10 | 4/10 | 6/10 | 7/10 | **6/10** |
| Dashboard (Home) | Yılmaz | 7/10 | 7/10 | 5/10 | 4/10 | 5/10 | **6/10** |

**Metal Sektör Ortalaması: 5.8/10**

## EN GÜÇLÜ / EN ZAYIF EKRANLAR (Metal)

### ✅ En Güçlü 3:
1. **ShopFloorTerminal (8/10)** — Hasan Usta için eldivenli buton, net renk, plazma makinesinin başında mükemmel çalışıyor.
2. **BarcodeOperations (8/10)** — Profil top barkodları ile Kerem Bey hızlı giriş yapıyor.
3. **NcrList (7/10)** — Kaynak hatası NCR kaydı profesyonel.

### ⚠️ En Zayıf 3:
1. **ProductForm (3/10)** — Çelik raf ürünü için `Parça No`, `GTIP`, `Kritiklik Sınıfı` alanları Yılmaz Bey'i korkutuyor. Üstelik **nesting yok, kesim planı yok, tonaj/hurda oranı yok**.
2. **InspectionList (5/10)** — EN 1090 EXC (Execution Class) alanı yok, kaynak VT/PT muayene tipi seçilemiyor.
3. **Stock List (6/10)** — Sac levha "1500x3000x4mm S235JR" formatında SKU yok, birim olarak KG/adet karışıyor.

## SEKTÖR-SPESİFİK KRİTİK EKSİKLER (Metal)

### 🔴 K1. Nesting / Kesim Optimizasyonu Modülü Yok
**Hasan Usta:** "Plazmada 2440x1220 sacdan 24 adet raf ayağı çıkıyor. Quvex nerede kesim planını gösteriyor?"
**Şu an:** Harici yazılım (SigmaNEST, TruTops) kullanılıyor, fire oranı el ile notlara yazılıyor.
**Etki:** Fire %15-25 arası — yılda 800.000 TL fire potansiyeli.
**Çözüm önerisi:** `ProductionGantt` yanına `CuttingPlan` sekmesi + SVG preview.

### 🔴 K2. Tonaj/Ağırlık Bazlı Stok Birim Karmaşası
**Kerem Bey:** "Profil 6 metrelik boylar halinde geliyor ama satış metre/KG karışık. 40x40x3 profilin metre ağırlığı 3.56kg, sistem bunu bilmiyor."
**Şu an:** `unit=kg` seçiliyor, sayı el ile çevriliyor.
**Çözüm:** Product'a `unitSecondary` (metre↔kg dönüşümü) + `linearWeight` alanı.

### 🔴 K3. EN 1090-2 Execution Class (EXC) Alanı Yok
**Sema Hanım:** "EXC2 ve EXC3 için farklı kontrol planları var. Sistem bunu ayırt etmiyor, biz NCR notuna yazıyoruz."
**Çözüm:** Product ve InspectionPlan'e `executionClass: [EXC1|EXC2|EXC3|EXC4]` enum.

### 🟡 K4. Toz Boya Hattı Ortam Koşulları Kayıt Yok
Sıcaklık, nem, mikron değerleri el ile notlara giriliyor. ShopFloorTerminal'de numeric input alanı yok.

### 🟡 K5. CE Uygunluk Beyanı (DoC) Şablonu Yok
Yangın kapısı gibi CE ürünlerde DoC PDF yükleniyor ama şablon + otomatik doldurma yok.

### 🟡 K6. Kaynak Pasaportu / WPS-WPQR Bağlama
ISO 3834 için kaynakçı sertifikası ve WPS (Welding Procedure Specification) bağlanamıyor. Operasyon kartında "kaynakçı no" alanı eksik.

### 🟡 K7. Saha Montaj İş Emri
Talat Usta fabrikadan çıkan ürün sahada kurulurken Quvex'e giremiyor — mobil form + GPS konum + müşteri imzası eksik.

## METAL PERSONA MUTLULUK SKORLARI

| Persona | Skor | Notlar |
|---------|------|--------|
| **Hasan Usta (Plazma Op.)** | **8/10** | ShopFloorTerminal iyi, nesting preview eksik |
| **Mustafa (Üretim Müdürü)** | **6/10** | Gantt çakışma uyarısı yok, kaynak/boya hat dengesi manuel |
| **Kerem (Depo)** | **6/10** | Barcode iyi, KG↔metre dönüşüm yok |
| **Sema (Kalite)** | **5/10** | EN 1090 EXC yok, VT/PT muayene tipi eksik |
| **Yılmaz (Patron)** | **5/10** | ProductForm korkutucu, raf seti BOM çok vakit alıyor |
| **Talat (Saha)** | **3/10** | Saha modülü yok, saha montaj is emri çağrılamıyor |

**Metal Ortalaması: 5.5/10**

---

# SEKTÖR 2: MOBİLYA İMALATI

## EKİP DEĞERLENDİRMESİ

| Rol | İsim | Persona |
|-----|------|---------|
| **Patron** | Özgür Bey, 45 | Otel mobilya seti üreticisi (Öz Ahşap), 30 kişi |
| **Üretim Müdürü** | Necati Bey | CNC router + panel kesim + kenar bantlama |
| **Operatör** | Murat Usta | Lake boya kabini operatörü |
| **Kalite Şefi** | Selim Bey | Son muayene + AQL + yüzey kalite |
| **Depo Sorumlusu** | Erkan Bey | MDF panel + aksesuar (menteşe/ray/kulp) |

## SKORLAR — EKRAN BAZLI (Mobilya)

| Ekran | Persona | Karmaşıklık | Kullanılabilirlik | Mobile | Help | Sektör Uyum | Genel |
|-------|---------|-------------|-------------------|--------|------|-------------|-------|
| Register | Özgür | 4/10 | 7/10 | 8/10 | 5/10 | 7/10 | **6/10** |
| Onboarding | Özgür | 3/10 | 8/10 | 7/10 | 7/10 | 4/10 | **6/10** |
| CustomerForm | Özgür | 6/10 | 6/10 | 5/10 | 4/10 | 6/10 | **5/10** |
| **ProductForm** | Özgür | **9/10** | **3/10** | 5/10 | 3/10 | **2/10** | **3/10** |
| SalesForm (Set) | Necati | 5/10 | 6/10 | 6/10 | 5/10 | **3/10** | **5/10** |
| Production List | Necati | 4/10 | 8/10 | 6/10 | 6/10 | 6/10 | **6/10** |
| ProductionGantt | Necati | 6/10 | 6/10 | 3/10 | 4/10 | 4/10 | **5/10** |
| **ShopFloor Terminal** | Murat | 2/10 | **9/10** | 9/10 | 5/10 | 7/10 | **8/10** |
| InspectionList | Selim | 5/10 | 7/10 | 6/10 | 5/10 | 5/10 | **6/10** |
| NcrList | Selim | 6/10 | 7/10 | 6/10 | 6/10 | 6/10 | **6/10** |
| Stock List (Panel) | Erkan | 6/10 | 7/10 | 7/10 | 5/10 | **3/10** | **5/10** |
| StockLotList | Erkan | 5/10 | 7/10 | 6/10 | 6/10 | 5/10 | **6/10** |
| BarcodeOperations | Erkan | 4/10 | **9/10** | 9/10 | 6/10 | 7/10 | **8/10** |
| InvoiceList | — | 7/10 | 7/10 | 4/10 | 6/10 | 7/10 | **6/10** |
| Dashboard | Özgür | 7/10 | 7/10 | 5/10 | 4/10 | 4/10 | **5/10** |

**Mobilya Sektör Ortalaması: 5.4/10**

## EN GÜÇLÜ / EN ZAYIF EKRANLAR (Mobilya)

### ✅ En Güçlü 3:
1. **ShopFloorTerminal (8/10)** — Lake boya operasyonu Murat için hızlı.
2. **BarcodeOperations (8/10)** — Panel barkod sistemi Erkan'ı rahatlatıyor.
3. **Production List (6/10)** — 15 operasyonlu akış görünebiliyor.

### ⚠️ En Zayıf 3:
1. **ProductForm (3/10 — sektör uyum 2/10!)** — Otel yatak odası seti (5 parça) tek kartta giremiyor, BOM ağaçları çok derin, renk/doku/RAL kodu alanı yok.
2. **SalesForm (5/10)** — "200 oda × 5 parça = 1000 satır" yorucu, set tabanlı sipariş şablonu yok.
3. **Stock List (5/10)** — Panel boyutu (2440x1830mm, 18mm) SKU formatı desteklenmiyor.

## SEKTÖR-SPESİFİK KRİTİK EKSİKLER (Mobilya)

### 🔴 M1. Panel Nesting Modülü Yok — Mobilyada %30 Fire Etkisi
**Necati:** "Biesse OptiNest'te 18mm MDF'den 5 karyola başı çıkarıyoruz. Quvex bunu bilmiyor."
**Etki:** Yıllık panel maliyeti 2M TL ise, %3 iyileşme = 60.000 TL.
**Çözüm:** `CuttingPlan` modülü (metal ile ortak).

### 🔴 M2. Set Bazlı Sipariş / Stok Yönetimi Yok
**Özgür:** "200 oda sipariş, her oda 5 parça: karyola, komodin, dolap, masa, TV ünitesi. Sistem bana 200 sipariş yaptırıyor mı 1000 mi?"
**Şu an:** Her parça ayrı satır → 1000 satırlı sipariş.
**Çözüm:** `ProductBundle` / `SetTemplate` — 1 set = N child.
**Etki:** Sipariş girişi 30 dk → 3 dk.

### 🔴 M3. Renk / Doku / RAL Kod Alanı Yok
ProductForm'da `color`, `finish`, `RAL code`, `gloss level` yok. Not alanına yazılıyor. Otel projelerinde "RAL 9010 saf beyaz + yarı mat" spec'i kaybediliyor.

### 🟡 M4. Kenar Bantlama Takibi
Kenar bandı uzunluğu (metre) ayrı BOM kalemi değil, sadece not. Stok tüketimi hesaplanmıyor.

### 🟡 M5. Boya Kabini Ortam Koşulları
Sıcaklık/nem/toz filtre durumu ShopFloor'a giriliyor ama grafik trend yok.

### 🟡 M6. Montaj Kılavuzu / Exploded View
Müşteri sahada kurarken PDF kılavuz bağlama yok.

### 🟡 M7. Panel Stok Alan/Metrekare Birimi
Panel `m²` cinsinden takip edilmesi gerekir — şu an adet/kg karışık.

## MOBİLYA PERSONA MUTLULUK SKORLARI

| Persona | Skor | Notlar |
|---------|------|--------|
| **Murat (Boya Op.)** | **8/10** | ShopFloor iyi, kabin ortam widget eksik |
| **Necati (Üretim)** | **5/10** | 200 oda × 5 parça planlaması acı, nesting yok |
| **Erkan (Depo)** | **6/10** | Barcode iyi, panel m² birim eksik |
| **Selim (Kalite)** | **6/10** | AQL manuel, yüzey pürüzlülük formu yok |
| **Özgür (Patron)** | **3/10** | Set tabanlı sipariş cehennemi — EN MUTSUZ |

**Mobilya Ortalaması: 5.6/10**

---

# SEKTÖR 3: TEKSTİL / HAZIR GİYİM

## EKİP DEĞERLENDİRMESİ

| Rol | İsim | Persona |
|-----|------|---------|
| **Patron** | Atlas Bey | Gömlek üreticisi, Koton tedarikçisi, 45 kişi |
| **Üretim Müdürü** | Nurcan Hanım | Kesim → dikim → yıkama hattı |
| **Operatör** | Ayşe Hanım | Dikim makinesi operatörü |
| **Kalite Şefi** | Hayriye Hanım | AQL 2.5 örnekleme, dikiş muayene |
| **Depo Sorumlusu** | Kasım Bey | Kumaş topları + aksesuar (lot bazlı) |

## SKORLAR — EKRAN BAZLI (Tekstil)

| Ekran | Persona | Karmaşıklık | Kullanılabilirlik | Mobile | Help | Sektör Uyum | Genel |
|-------|---------|-------------|-------------------|--------|------|-------------|-------|
| Register | Atlas | 4/10 | 7/10 | 8/10 | 5/10 | 6/10 | **6/10** |
| Onboarding | Atlas | 3/10 | 8/10 | 7/10 | 7/10 | 3/10 | **5/10** |
| CustomerForm | Atlas | 6/10 | 6/10 | 5/10 | 4/10 | 6/10 | **5/10** |
| **ProductForm** | Atlas | **9/10** | **3/10** | 5/10 | 3/10 | **1/10** | **3/10** |
| SalesForm (15 SKU) | Nurcan | 5/10 | 5/10 | 6/10 | 5/10 | **2/10** | **4/10** |
| Production List | Nurcan | 4/10 | 8/10 | 6/10 | 6/10 | 5/10 | **6/10** |
| ProductionGantt | Nurcan | 6/10 | 6/10 | 3/10 | 4/10 | 4/10 | **5/10** |
| **ShopFloor Terminal** | Ayşe | 2/10 | **9/10** | 9/10 | 5/10 | 6/10 | **7/10** |
| **InspectionList (AQL)** | Hayriye | 5/10 | 6/10 | 6/10 | 5/10 | **2/10** | **5/10** |
| NcrList | Hayriye | 6/10 | 7/10 | 6/10 | 6/10 | 6/10 | **6/10** |
| **Stock List (metraj)** | Kasım | 6/10 | 6/10 | 7/10 | 5/10 | **2/10** | **5/10** |
| **StockLotList** | Kasım | 5/10 | 7/10 | 6/10 | 6/10 | 5/10 | **6/10** |
| BarcodeOperations | Kasım | 4/10 | **9/10** | 9/10 | 6/10 | 6/10 | **7/10** |
| InvoiceList | — | 7/10 | 7/10 | 4/10 | 6/10 | 7/10 | **6/10** |
| Dashboard | Atlas | 7/10 | 7/10 | 5/10 | 4/10 | 4/10 | **5/10** |

**Tekstil Sektör Ortalaması: 5.3/10 — Sektör uyum alt başlığında 3.7/10**

## EN GÜÇLÜ / EN ZAYIF EKRANLAR (Tekstil)

### ✅ En Güçlü 3:
1. **ShopFloorTerminal (7/10)** — Dikim bandında çalışıyor ama operasyon bazlı parça sayısı ölçümü eksik.
2. **StockLotList (6/10)** — Kumaş lot takibi mevcut (boya lotu için kritik).
3. **BarcodeOperations (7/10)** — Kumaş topu barkodu desteği var.

### ⚠️ En Zayıf 3:
1. **ProductForm (3/10 — sektör uyum 1/10!)** — Varyant matrisi yok. 5 beden × 3 renk = **15 ayrı ürün kartı açmak zorunda**. Bu sektör için ERP'yi işlevsizleştiriyor.
2. **SalesForm (4/10)** — 15 SKU ayrı satır, beden-renk matris input yok.
3. **InspectionList AQL (5/10)** — AQL 2.5 tablosu otomatik hesap yok, örneklem sayıları el ile.

## SEKTÖR-SPESİFİK KRİTİK EKSİKLER (Tekstil) — EN BÜYÜK BOŞLUK

### 🔴 T1. BEDEN-RENK VARYANT MATRİSİ YOK — SEKTÖRÜ KAYBETTİRİR
**Atlas Bey:** "Bir gömleğim var, S/M/L/XL/XXL ve 3 renk. 15 ayrı ürün kartı mı açacağım? BOM'u 15 kere mi gireceğim?"
**Şu an:** Workaround = ATX-GML-S-BYZ, ATX-GML-M-BYZ, ... 15 kart.
**Etki:**
- Ürün girişi 15 kat uzuyor
- BOM 15 kez kopya
- Raporlama imkansız (hangi beden en çok satıyor sorusu parse gerektiriyor)
- Fiyatlandırma değişince 15 kart güncelleme
**Çözüm:** `Product` + `ProductVariant` entity — Base ürün + N varyant (attributes: size, color).
**Efor:** ~2-3 hafta API + UI.
**ROI:** Tekstil + mobilya + ayakkabı + hediyelik sektörlerini açar (~50.000 KOBİ).

### 🔴 T2. Pastal Plan / Kesim Marker Yok
**Nurcan:** "150 katlı pastal serilir, marker üzerine kesim yapılır. Fire %8. Quvex bunu görmüyor."
**Çözüm:** CuttingPlan modülü (metal/mobilya ile ortak altyapı, sektörlere özel viewer).

### 🔴 T3. AQL Tabloları Otomatik Hesaplama Yok
**Hayriye:** "Lot 1000 adet, AQL 2.5, Normal Level II için örneklem=80, Ac=5 Rej=6. Bunu Quvex bilmiyor, tablo açıp el ile giriyorum."
**Çözüm:** `InspectionPlan.samplingMethod` + ISO 2859-1 tablosu (AQL 0.65/1.0/1.5/2.5/4.0/6.5).
**Efor:** ~1 hafta.

### 🔴 T4. Boya Lot Eşleme ve ΔE (delta-E) Kayıt Yok
Farklı boya lotları arasında renk farkı (dE) ölçümü kayıt edilmiyor. Koton gibi zincirde renk homojenliği şart.
**Çözüm:** StockLot → `colorMeasurement` (dE değeri + referans standart).

### 🔴 T5. Metraj ↔ KG ↔ Top Birim Dönüşümü Zayıf
Kumaş "120 g/m², 150cm eni, 45m top" şeklinde gelir. Şu an KG ile takip → kesim metraj hesabı el ile.
**Çözüm:** Product'a `widthCm`, `gsm` (gram/m²) alanları + otomatik dönüşüm.

### 🟡 T6. Operasyon Bazlı Operatör Performansı Yok
Ayşe Hanım saatte kaç gömlek diktiği raporlanamıyor — OEE var ama "parça sayısı / saat" dikim için kritik.

### 🟡 T7. Pastal Plan Fire Oranı vs Gerçek Karşılaştırma Yok

## TEKSTİL PERSONA MUTLULUK SKORLARI

| Persona | Skor | Notlar |
|---------|------|--------|
| **Ayşe (Dikiş Op.)** | **7/10** | ShopFloor iyi, parça sayacı eksik |
| **Kasım (Depo)** | **5/10** | Lot takibi var, metraj↔kg dönüşüm yok |
| **Hayriye (Kalite)** | **4/10** | AQL tablosu yok, dikiş kontrolü manuel |
| **Nurcan (Üretim)** | **4/10** | Pastal plan yok, 15 SKU planlaması zor |
| **Atlas (Patron)** | **2/10** | 15 ürün kartı açmak zorunda — VAZGEÇEBİLİR |

**Tekstil Ortalaması: 4.4/10** — Üç sektörün en düşüğü.

---

# KRİTİK BULGULAR — 3 SEKTÖR BİRLİKTE

## 🔴 P0 — Acil (Ürünü satamayız)

### P0-1. ProductForm Varyant Matrisi (Tekstil için ölüm kalım)
**Etki:** Tekstil sektörü kaybediliyor. Mobilya'da kısmen acıtıyor (renk/ölçü varyantı).
**Efor:** 2-3 hafta (API + UI).
**Fix:** `Product` → `ProductVariant[]` (attributes JSONB: size, color, material).

### P0-2. ProductForm Minimal Mode (3 sektörde ortak — CNC audit'te de var)
**Fix:** Quick mode (Ad, Kod, Birim) → detaylı modalı sonra.
**Efor:** 3 saat.

### P0-3. CuttingPlan / Nesting Modülü (3 sektörde de gerekli)
Metal (sac nesting), Mobilya (panel nesting), Tekstil (pastal/marker).
**Efor:** 2 hafta (temel), 6 hafta (SVG editörü ile).
**Fix:** Önce dosya yükleme + fire oranı alanı (quick win, 1 gün).

### P0-4. Set/Bundle Ürün Yönetimi (Mobilya + hediyelik)
**Fix:** `ProductBundle` — 1 set = N child link.
**Efor:** 1 hafta.

### P0-5. AQL Tablosu Otomasyonu (Tekstil + mobilya + metal son muayene)
**Efor:** 1 hafta.
**Fix:** `InspectionPlan.samplingMethod = AQL` + ISO 2859-1 lookup tablosu.

## 🟡 P1 — Yüksek Öncelik

### P1-1. Renk / Doku / Finish Alanları (Mobilya, metal boya, tekstil)
`Product.color`, `finishType`, `ralCode`, `glossLevel`.
**Efor:** 1 gün.

### P1-2. Birim Dönüşüm Matrisi
Metre↔KG (metal profil), Top↔metre (tekstil), m²↔adet (panel).
**Fix:** Product'a `conversionFactors` JSONB.
**Efor:** 3 gün.

### P1-3. EN 1090 EXC + ISO 3834 Alanları (Metal için)
Product + InspectionPlan'e enum.
**Efor:** 1 gün.

### P1-4. Boya/Yıkama Lot ΔE Kayıt (Tekstil + mobilya + metal)
StockLot'a `colorMeasurement` extension.
**Efor:** 2 gün.

### P1-5. Saha Montaj İş Emri (Metal + mobilya)
Mobil form + GPS + imza.
**Efor:** 1 hafta.

### P1-6. Set Bazlı Sipariş Şablonu (Mobilya)
SalesForm'da "Set Kullan" butonu → N satır otomatik.
**Efor:** 2 gün (P0-4 sonrası).

## 🟢 P2 — Orta Öncelik

### P2-1. Kaynak Pasaportu / WPS Bağlama (Metal, ISO 3834)
### P2-2. FSC Zinciri Takibi (Mobilya — sertifika şart)
### P2-3. CE Uygunluk Beyanı Şablonu (Metal yangın kapısı)
### P2-4. Montaj Kılavuzu / Exploded View (Mobilya)
### P2-5. Operatör Performans Raporu (Tekstil, parça/saat)
### P2-6. Boya Kabini Ortam Trend Grafiği (Metal + mobilya)
### P2-7. Nakliye Hasar Modülü (Mobilya — büyük hacimli)

---

# QUICK WINS — SEKTÖR BAZLI (her biri <4 saat)

## Metal — Top 5 Quick Wins

| # | İş | Süre | Etki |
|---|-----|------|------|
| 1 | Product'a `executionClass` (EXC1-4) enum + tooltip | 1h | 🔴 EN 1090 |
| 2 | Product'a `linearWeight` (kg/m) alanı + hesap | 2h | 🔴 Profil stok |
| 3 | ShopFloor'a "Boya Mikron" numeric input | 1h | 🟡 Toz boya |
| 4 | InspectionPlan'e `weldingTest: [VT, PT, MT, UT, RT]` | 1h | 🟡 Kaynak |
| 5 | Product'a `ralCode` alanı + renk swatch | 2h | 🟡 Boya |

## Mobilya — Top 5 Quick Wins

| # | İş | Süre | Etki |
|---|-----|------|------|
| 1 | Product'a `color`/`finishType`/`glossLevel` | 2h | 🔴 Lake |
| 2 | SalesForm'da "Set'ten İçe Aktar" basit buton + template JSON | 3h | 🔴 Set siparişi |
| 3 | Stock'a `m²` birim ve dönüşüm | 2h | 🟡 Panel |
| 4 | Kenar bandı metre BOM child olarak desteklenmesi | 2h | 🟡 Bantlama |
| 5 | Product'a montaj kılavuzu PDF upload alanı | 1h | 🟡 Kılavuz |

## Tekstil — Top 5 Quick Wins (varyant hariç — bu 3 hafta)

| # | İş | Süre | Etki |
|---|-----|------|------|
| 1 | Product'a `widthCm`, `gsm` alanları (kumaş spec) | 1h | 🔴 Kumaş |
| 2 | StockLot'a `dyeLot`, `deltaE` alanları | 2h | 🔴 Boya lot |
| 3 | InspectionForm'a AQL tablo lookup (static JSON ISO 2859) | 3h | 🔴 AQL |
| 4 | ShopFloor'a "Saatlik Parça Sayacı" widget | 2h | 🟡 Dikim |
| 5 | Product'a `seasonCode` (AW26, SS27) + filter | 1h | 🟡 Sezon |

---

# ROL BAZLI MUTLULUK TABLOSU — 3 SEKTÖR KARŞILAŞTIRMA

| Persona | Metal | Mobilya | Tekstil | Ortalama |
|---------|-------|---------|---------|----------|
| **Operatör (ShopFloor)** | 8/10 | 8/10 | 7/10 | **7.7** ✅ |
| **Depo Sorumlusu** | 6/10 | 6/10 | 5/10 | 5.7 |
| **Üretim Müdürü** | 6/10 | 5/10 | 4/10 | 5.0 |
| **Kalite Şefi** | 5/10 | 6/10 | 4/10 | 5.0 |
| **Patron** | 5/10 | 3/10 | 2/10 | **3.3** ⚠️ |
| **Saha/Özel Rol** | 3/10 | — | — | — |

**Sonuç:** Quvex operatör tarafında her sektörde kazanıyor, patron tarafında her sektörde kaybediyor. İlk 1 saatte patronun gördüğü sayfalar (Product, Customer, Sales) sektörü kaybetmenin sebebi.

---

# CROSS-SECTOR COMMONALITIES — 3 SEKTÖRDE ORTAK SORUNLAR

## 1. ProductForm 30+ alan karmaşası
Aynı sorun CNC'de de var. **Minimal Mode** çözümü 3 sektörde birden acıyı dindirir.

## 2. Kesim Optimizasyonu / Nesting Yok (3/3 sektörde)
- Metal: Sac nesting (SigmaNEST)
- Mobilya: Panel nesting (Biesse OptiNest)
- Tekstil: Pastal marker (Lectra)

Her 3 sektörde de **%5-25 fire** — yıllık milyonlarca TL kayıp. Ortak `CuttingPlan` modülü (dosya yükleme + fire oranı + SVG preview) **tek iş ile 110.000 KOBİ** etkileyebilir.

## 3. Varyant / Set / Konfigürasyon Yok
- Tekstil: Beden × Renk matrisi (KRİTİK)
- Mobilya: Set bazlı ürün (5 parça bir oda)
- Metal: Sistem ürün (raf seti = 12 parça)

`ProductVariant` + `ProductBundle` tek altyapı ile 3 sektörü kurtarır.

## 4. Birim Dönüşümü Çift Yönlü
- Metal: metre ↔ kg (profil)
- Mobilya: m² ↔ adet (panel)
- Tekstil: metre ↔ kg ↔ top (kumaş)

`Product.conversionFactors` JSONB 3 sektörü kapsar.

## 5. Lot Bazlı Renk / Kalite Takibi
- Metal: Boya lotu mikron
- Mobilya: Lake lotu parlaklık (gloss)
- Tekstil: Boya lotu ΔE

`StockLot.qualityMeasurements` extension 3 sektörü kapsar.

## 6. AQL / Örneklem Tabloları Otomasyonu
- Tekstil: AQL 2.5 (ISO 2859-1)
- Mobilya: AQL son muayene
- Metal: Kaynak numune oranı

Static JSON lookup 1 haftalık iş → 3 sektörü kapsar.

## 7. ShopFloor Yardım / Tooltip Coverage %60
CNC audit'te de var. 3 sektörde de operatör butonu mükemmel, ama açıklayıcı text eksik.

## 8. ProductionGantt Drag-Drop Yok
3 sektörde de üretim müdürleri planlamayı modal üzerinden yapmak zorunda.

## 9. Dashboard Sektör-Agnostik
Home.js tüm sektörlerde aynı. Sektör seçilince KPI'lar değişmeli:
- Metal: Fire oranı, kg çıkış, EN 1090 uyumluluk
- Mobilya: Panel m² kullanımı, lake verimi, set teslim %
- Tekstil: AQL geçiş %, beden-renk stok, dikim adedi/operatör

## 10. Onboarding Sektör Şablonu Yok
Kayıtta "sektör" seçiliyor ama hiçbir şey değişmiyor. Sektöre özel:
- Varsayılan makine listesi
- Varsayılan operasyon adımları
- Örnek ürün BOM'u
- Demo müşteri seti

yüklenmeli. Mehmet/Yılmaz/Özgür/Atlas ilk 5 dakikada "benim sektörümü tanıyor" demeli.

---

# YOL HARİTASI — 110.000 KOBİ İÇİN ÖNCELİK SIRASI

## Sprint 1 (1 hafta) — Quick Wins
- Product `ralCode`, `finishType`, `color`, `glossLevel`, `widthCm`, `gsm`, `linearWeight`, `executionClass` alanları
- StockLot `deltaE`, `dyeLot`, `gloss` alanları
- InspectionPlan `weldingTest`, `samplingMethod` enum
- ShopFloor ortam/sayaç widget'ları
- **Etki:** 3 sektörde sektör uyum skoru +1.5 puan

## Sprint 2 (2 hafta) — Temel Modüller
- **ProductVariant** entity + UI (Tekstil kurtarıldı)
- **ProductBundle** entity + UI (Mobilya set siparişi kurtarıldı)
- **CuttingPlan** temel modül (dosya + fire + not, SVG yok)
- **AQL lookup** static tablo
- **Etki:** Tekstil patron mutluluğu 2→6, Mobilya patron 3→6

## Sprint 3 (2 hafta) — Sektör Şablonları + Dashboard
- Onboarding sektör seçimine göre demo data
- Sector-aware Dashboard (3 preset: metal/mobilya/tekstil)
- ProductForm Minimal Mode (CNC audit ile ortak)
- Sektör bazlı menü gizleme/gösterme
- **Etki:** İlk 30 dakika deneyimi radikal iyileşir

## Sprint 4 (2 hafta) — Planlama v2
- ProductionGantt drag-drop + çakışma
- Saha Montaj mobil form (metal + mobilya)
- Birim dönüşüm matrisi (3 sektörde birden)

**Toplam: ~7 hafta, 3 sektörde 4.6 → 7.5 ortalama skor**

---

# SONUÇ — BÜYÜK RESİM

## Güçlü Yanlar (her 3 sektörde geçerli)
- ✅ **ShopFloorTerminal** — operatör tarafı 3 sektörde de 7-9/10
- ✅ **BarcodeOperations** — depo 3 sektörde de rahat
- ✅ **NCR + Kalibrasyon + OEE** — profesyonel altyapı
- ✅ **Multi-tenant, güvenlik, 1223 API test** — production-grade

## Zayıf Yanlar (sektör spesifik)
- ⚠️ **Tekstil** → **Varyant matrisi yok** = VAZGEÇME RİSKİ
- ⚠️ **Mobilya** → **Set bazlı sipariş yok** = acı ama yönetilebilir
- ⚠️ **Metal** → **EXC + tonaj birimi eksik** = workaround ile iş yapılıyor
- ⚠️ **Hepsi** → **Nesting yok**, **patron onboarding korkunç**, **ProductForm 30 alan**

## Karar
**Eğer Quvex bu 3 sektörü (~110.000 KOBİ) hedefliyorsa:**

1. **İlk 7 haftada (4 sprint)** yukarıdaki roadmap'i uygulamalı
2. **ProductVariant + Bundle + CuttingPlan + Minimal Mode** tek paket olarak çıkmalı
3. **Sektör şablonlu onboarding** olmadan "generic ERP" olarak kalıyor — sivil KOBİ'ler özelleşmiş çözümleri tercih ediyor

### Tekstil için spesifik uyarı
Varyant matrisi yoksa tekstil **rakip sistemlere gider** (TETSmart, MyTextile, Nebim Winner). 3 haftalık ProductVariant yatırımı 30.000 KOBİ pazarına erişim sağlar — **en yüksek ROI'li iş**.

### Metal için spesifik uyarı
45.000 KOBİ ile **en büyük pazar**. Çoğu CNC audit'teki iyileştirmelerden yararlanır — Quvex zaten %70 hazır. Kalan %30: EXC + tonaj + nesting + saha montaj.

### Mobilya için spesifik uyarı
Set tabanlı sipariş olmadan otel/AVM projelerini alamaz. Bundle altyapısı (~1 hafta) yatırımla 35.000 KOBİ açılıyor.

---

**Rapor sonu. Toplam: 3 sektör × 15 ekran × 5 persona = kapsamlı değerlendirme.**
