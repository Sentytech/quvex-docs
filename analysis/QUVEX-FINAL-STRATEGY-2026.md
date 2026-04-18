# QUVEX ERP — 2026 NİHAİ STRATEJİ BELGESİ

> Tarih: 2026-04-10
> Hazırlayan: Kıdemli Ürün Stratejisi Ekibi
> Kapsam: 5 UX denetim raporunun konsolidasyonu (18 sektör, 8 persona, ~40 quick win, 10 büyük modül)
> Kaynaklar:
> - `CNC-USER-JOURNEY-UX-AUDIT.md`
> - `UX-AUDIT-METAL-MOBILYA-TEKSTIL.md`
> - `UX-AUDIT-GIDA-OTOMOTIV-PLASTIK-MAKINE.md`
> - `UX-AUDIT-KAYNAK-MEDIKAL.md`
> - `UX-AUDIT-MASTER-CROSS-SECTOR.md`
> Süre: Önümüzdeki 6 ay ürün yol haritasını yönlendirir.

---

## 1. YÖNETİCİ ÖZETİ

**Quvex'in bugünkü hali:** 155 controller, 220+ view, 1223 API testi + 686 UI testi ile production-grade olgun bir KOBİ ERP temeli — teknik olarak "satılabilir" ama UX ve sektörel derinleşme açısından "son %30" eksik.

**Ne sorun var?** Kullanıcının ilk 5 dakikası korkutucu: ProductForm (3/10) ve CustomerForm (5/10) gibi "ilk temas" ekranları 30+ alanla patronu kaçırıyor. Sektör terminolojisine (WPS, UDI, HACCP, PPAP, IMDS) tooltip/glossary desteği yok — Mehmet Bey jargonda kayboluyor. 18 sektörün her birinde 1-3 kritik "killer feature" eksik (UDI, HACCP/Recall, Kalıp Envanteri, CE Teknik Dosya, Beden-Renk Varyantı) ve bu eksikler satışın önündeki tek taş.

**Ne yapılmalı?** (1) 2-3 haftalık "Quick Win Sprint" ile ProductForm minimal mode, CustomerForm minimal mode, GlossaryTooltip, role-based routing, demo data prominent gibi 25-30 iyileştirmeyi uygula. (2) Ardından 4 ay boyunca sırayla "Niş Modül Paketleri" geliştir: Otomotiv PPAP Export, Gıda HACCP+Recall, Plastik MoldInventory, Makine CE, Tekstil ProductVariant. (3) 5. ayda persona-bazlı dashboard ve ProductionGantt v2 refactor, 6. ayda cilalama ve pazara hazırlık.

**ROI:** 6 ay sonunda ortalama sektör skoru **5.4/10 → 7.5/10**, trial dönüşüm oranı **%34 → %81**, adreslenebilir pazar 18 sektörde **~280.000 KOBİ'ye** ulaşır, tahmini MRR 180-250k USD aralığında.

---

## 2. PAZAR FOTOĞRAFI

### 2.1 Adreslenebilir Toplam Pazar (Türkiye KOBİ İmalat)

| # | Sektör | KOBİ Sayısı | Mevcut Skor | Satış-Hazır mı? |
|---|--------|-------------|-------------|------------------|
| 1 | Metal / Çelik Konstrüksiyon | ~45.000 | 5.8/10 | Eksikli |
| 2 | Mobilya İmalatı | ~35.000 | 5.4/10 | Eksikli |
| 3 | Tekstil / Hazır Giyim | ~30.000 | 4.6/10 | **Yetersiz** (varyant olmadan) |
| 4 | Gıda / İçecek Üretimi | ~25.000 | 4.5/10 | **Yetersiz** (recall olmadan) |
| 5 | Otomotiv Yan Sanayi | ~15.000 | 6.6/10 | **Satılabilir** ✅ |
| 6 | Plastik Enjeksiyon | ~12.000 | 5.5/10 | Eksikli |
| 7 | Makine İmalatı (MTO) | ~10.000 | 5.0/10 | Eksikli |
| 8 | CNC Talaşlı İmalat | ~20.000 | 6.4/10 | **Satılabilir** ✅ |
| 9 | Sac Metal / Lazer | ~15.000 | 5.5/10 | Eksikli |
| 10 | Elektronik / PCB Assembly | ~8.000 | 5.2/10 | Eksikli |
| 11 | Kimya / Boya | ~6.000 | 4.3/10 | **Yetersiz** (recipe olmadan) |
| 12 | Kauçuk | ~4.000 | 5.0/10 | Eksikli |
| 13 | Döküm | ~5.000 | 5.2/10 | Eksikli |
| 14 | Ambalaj | ~12.000 | 5.5/10 | Eksikli |
| 15 | Tarım Makinaları | ~6.000 | 6.0/10 | **Satılabilir** ✅ |
| 16 | Enerji / Panel Üretici | ~3.000 | 5.7/10 | Eksikli |
| 17 | Kaynak / Savunma Alt Yüklenici | ~5.000 | 5.7/10 | Eksikli |
| 18 | Medikal Cihaz | ~3.000 | 5.3/10 | **Yetersiz** (UDI olmadan) |
| **TOPLAM** | | **~259.000 KOBİ** | **Ort. 5.4/10** | |

### 2.2 Şu An Satılabilir Sektörler (Skor > 6.0)
- ✅ **Otomotiv Yan Sanayi** (6.6/10) — PPAP/SPC/FMEA altyapısı zaten profesyonel
- ✅ **CNC Talaşlı İmalat** (6.4/10) — Referans senaryo
- ✅ **Makine İmalatı (bazı segmentler)** (6.0/10)
- ✅ **Tarım Makinaları** (6.0/10)

**Toplam erişim:** ~51.000 KOBİ — bugün bile satılabilir.

### 2.3 Blocker Nedeniyle Kayıp Sektörler (Skor < 5.0 veya "Yetersiz")
- ❌ **Tekstil** (30K KOBİ) — ProductVariant yok. Atlas Bey gömleğini 15 ayrı ürün kartıyla açmaya razı değil → VAZGEÇİYOR.
- ❌ **Gıda** (25K KOBİ) — HACCP/Recall yok. Taze Bey denetçiye cevap veremeyeceği için Quvex'i satın almıyor.
- ❌ **Medikal** (3K KOBİ) — UDI yok. Sezgin Bey MDR uyumsuzluğu riskini alamıyor.
- ❌ **Kimya / Boya** (6K KOBİ) — Recipe/MSDS yok.
- ❌ **Plastik** (12K KOBİ) — Kalıp yönetimi yok, Özkan Bey "plastik ERP'si değil bu" diyor.

**Kayıp pazar büyüklüğü:** ~76.000 KOBİ × ortalama 400 USD/ay × 12 ay = **~365M USD yıllık kayıp TAM**.
(Gerçekçi pazar payı %2 varsayılsa bile ~7.3M USD/yıl kaybediliyor.)

### 2.4 Özet
Quvex bugün **~51K KOBİ'ye (toplam pazarın %20'si)** satabilir. Doğru 6 aylık yatırımla bu rakam **~220K KOBİ'ye (%85)** çıkabilir.

---

## 3. 10 ORTAK PROBLEM (Tüm Sektörler)

### 3.1 Problem #1 — ProductForm "Wall of Text" Sendromu

- **Sorun nedir:** ProductForm 30+ alan, 6 section, tree view, ağır jargon (GTIP, Teknik Resim No, Kritiklik Sınıfı, Parça No). İlk ürün ekleme gerçek kullanıcılarda 8-12 dakika — olması gereken <1 dakika.
- **Hangi sektörlerde:** CNC, Kaynak, Medikal, Metal, Mobilya, Tekstil, Gıda, Otomotiv, Plastik, Makine, PCB, Kimya — **18/18 sektör**.
- **Etki seviyesi:** 🔴 Kritik — ürünü kaybediyoruz. Trial dönüşümün tek numaralı blokajı.
- **Kanıt:** CNC audit "ProductForm 3/10", Metal/Mobilya/Tekstil audit "sektör uyumu 1-3/10", Gıda audit "Taze Bey form bizim için değil hissi".
- **Önerilen çözüm:** 3 modlu form:
  1. **Hızlı Mod:** 3 zorunlu alan (Ad, Kod, Birim)
  2. **Standart Mod:** 10 alan (kategori, tedarikçi, fiyat, stok min/maks)
  3. **Detaylı Mod:** 30+ alan (mevcut form)
  Sektör profiline göre default mod; "detayları sonra ekleyebilirsiniz" mesajı.
- **Efor:** 3 saat (minimal mode) + 3 gün (sektör default + Smart Mode tam implementasyon).
- **Kazanım:** Tüm sektörlerde Patron mutluluk skoru +2.0 puan. Trial dönüşüm %30 → %50.

### 3.2 Problem #2 — CustomerForm Tab Chaos

- **Sorun nedir:** 6 tab, 15+ alan ilk kayıtta, VKN/TCKN katı validasyon.
- **Hangi sektörlerde:** 18/18.
- **Etki seviyesi:** 🔴 Kritik.
- **Kanıt:** CNC audit 5/10, Metal/Mobilya/Tekstil tümünde 5/10.
- **Önerilen çözüm:** Minimal insert (Ad, Vergi No, Telefon) → Save → Update'te tabs açılır.
- **Efor:** 2 saat.
- **Kazanım:** +1.5 puan.

### 3.3 Problem #3 — Tooltip / Glossary %60 Coverage

- **Sorun nedir:** Sektör terimleri (CCP, Cpk, PPAP, IMDS, UDI, WPS, HACCP, MRB, GTIP, RPN, AQL, MFI, NCR, CAPA, FAI, MSA, DoC) tooltip'siz. Mehmet Bey "ne lan bu?" diyor.
- **Hangi sektörlerde:** 18/18 (terimler değişir, sorun aynı).
- **Etki seviyesi:** 🟡 Yüksek.
- **Önerilen çözüm:** `GlossaryTooltip` componenti + sektör filtreli `glossary.json` (50-80 terim × 18 sektör).
- **Efor:** 2 saat (component) + 4 saat (50 terim) + sektör başına 2 saat.
- **Kazanım:** +1.0 puan.

### 3.4 Problem #4 — İlk Kullanıcı Yolculuğu (Onboarding + Demo)

- **Sorun nedir:** "Demo Yükle" butonu zayıf konumlanmış. Register'da sektör seçimi yapılıyor ama **hiçbir şey değişmiyor** — aynı menü, aynı form, aynı dashboard. Sektör şablonu yok.
- **Hangi sektörlerde:** 18/18.
- **Etki seviyesi:** 🔴 Kritik — ilk 5 dakikada "vay anasını" anı eksik.
- **Önerilen çözüm:** (a) Onboarding hero butonu "Demo Yükle" prominent, (b) Sektör bazlı demo veri setleri (makine listesi, örnek müşteri, örnek ürün BOM, operasyon şablonu), (c) Register → Sektör seç → Demo yüklendi → kullanıcı hazır dashboard'da.
- **Efor:** 30 dk (buton) + 1 gün × 18 sektör (demo data).
- **Kazanım:** +1.5 puan, trial %30 → %55.

### 3.5 Problem #5 — ProductionGantt Drag-Drop Yok

- **Sorun nedir:** Sadece modal ile manuel planlama, çakışma uyarısı yok, tablet uyumlu değil (3/10 mobile).
- **Hangi sektörlerde:** CNC, Metal, Mobilya, Tekstil, Gıda, Otomotiv, Plastik, Makine, Kaynak, Medikal = 10+ sektör.
- **Etki seviyesi:** 🟡 Yüksek.
- **Önerilen çözüm:** react-gantt-task veya gantt-task-react kütüphanesi, drag-drop, çakışma renkli overlay, WebSocket real-time update.
- **Efor:** 5-7 gün.
- **Kazanım:** Üretim Müdürü personası +2.0 puan.

### 3.6 Problem #6 — Multi-Rol Dashboard Yok (Role-Based Home Routing)

- **Sorun nedir:** Hasan Bey (Depo) ExecutiveDashboard görüyor. Veli Usta (Operatör) finansal widgetları görüyor. Herkes aynı home sayfasında.
- **Hangi sektörlerde:** 18/18.
- **Etki seviyesi:** 🟡 Yüksek.
- **Önerilen çözüm:** Login sonrası role bazlı routing: Operatör → ShopFloor, Depo → WarehouseDashboard, Finansçı → FinanceDashboard, Bakım → MaintenanceDashboard, Patron → Executive.
- **Efor:** 2 gün.
- **Kazanım:** +1.5 puan.

### 3.7 Problem #7 — ShopFloor ↔ Kalite Otomatik Veri Akışı Yok

- **Sorun nedir:** Operatör ShopFloorTerminal'de ölçüm yapsa SPC'ye otomatik gitmiyor. Esra Hanım aynı veriyi manuel giriyor. HACCP CCP ölçümü → otomatik NCR tetikleme yok. Kalıp çevrim sayacı → OEE bağlantısı yok.
- **Hangi sektörlerde:** Otomotiv, Gıda, Plastik, CNC, Medikal, Kaynak, Metal.
- **Etki seviyesi:** 🟡 Yüksek (veri bütünlüğü + çifte giriş emeği).
- **Önerilen çözüm:** ShopFloor event bus → measurement → {SPC | NCR | HACCP | OEE} router.
- **Efor:** 6-8 gün.
- **Kazanım:** Kaliteci + Operatör mutluluğu +1.5 puan.

### 3.8 Problem #8 — Workflow Engine Yok

- **Sorun nedir:** HACCP recall, APQP gate, CE onay, NCR→Root Cause→CAPA→Verify→Close, 8D — hepsi benzer state machine ama **manuel** ilerliyor. Otomasyon kuralı yok: "Tolerance dışı ölçüm → Auto NCR → Email quality mgr" gibi.
- **Hangi sektörlerde:** 18/18.
- **Etki seviyesi:** 🟡 Yüksek.
- **Önerilen çözüm:** Generic workflow engine + visual flow editor + kurallar.
- **Efor:** 3-4 hafta (büyük yatırım).
- **Kazanım:** +2.0 puan (uzun vadeli).

### 3.9 Problem #9 — Mobile/Tablet Form Rendering Zayıf

- **Sorun nedir:** ProductForm, ProductionGantt, InvoiceList, SPC giriş ekranı tablette bozuluyor. Esra Hanım tabletten SPC giremiyor, üretim müdürü Gantt'a tabletten bakamıyor.
- **Hangi sektörlerde:** 18/18 (özellikle planlama/kalite tarafı).
- **Etki seviyesi:** 🟡 Yüksek.
- **Önerilen çözüm:** Responsive grid refactor, büyük buton, hızlı input.
- **Efor:** 3-5 gün (planlama/kalite ekranları).
- **Kazanım:** Tablet kullanıcı mutluluğu +1.5.

### 3.10 Problem #10 — Rapor PDF Export Modül Bazlı Eksik

- **Sorun nedir:** PPAP paket PDF (Otomotiv), Recall raporu (Gıda), CE teknik dosya (Makine), HACCP planı (Gıda), 8D raporu — hiçbiri tek PDF olarak çıkarılamıyor. Cem Bey Ford'a 18 dosyayı tek tek gönderemez.
- **Hangi sektörlerde:** Otomotiv, Gıda, Medikal, Makine, Kaynak, Savunma.
- **Etki seviyesi:** 🔴 Kritik (teslim formatı).
- **Önerilen çözüm:** Generic PDF Report Builder servisi + modül başına template.
- **Efor:** 8 saat (servis) + 2-4 saat/şablon × 6 şablon.
- **Kazanım:** Otomotiv, Gıda, Medikal'de +2.0 puan.

---

## 4. SEKTÖR-SPESİFİK İHTİYAÇLAR (18 Sektör)

### 4.1 CNC Talaşlı İmalat (~20.000 KOBİ)
- **Mevcut skor:** 6.4/10
- **Blocker:** Yok — en hazır sektör.
- **Niş modül ihtiyacı:** Tool Life Management, SPC real-time dashboard, terminal ölçüm entegrasyonu (Sprint 9'da kısmen yapıldı).
- **Persona mutluluğu:** Ortalama 6.5/10 (Veli Usta 9, Mehmet Bey 5).
- **İhtiyaç → Çözüm:** ProductForm minimal mode + Gantt v2 + PurchaseOfferComparison → **hedef 8.5/10**.

### 4.2 Metal / Çelik Konstrüksiyon (~45.000 KOBİ)
- **Mevcut skor:** 5.8/10
- **Blocker:** Yok ama niş alanlar eksik.
- **Niş modül ihtiyacı:** CuttingPlan/Nesting, EN 1090 EXC alanı, linearWeight (kg/m), saha montaj mobil form, kaynak pasaportu WPS bağlantısı.
- **Persona mutluluğu:** 5.5/10 — Talat Usta (saha) 3/10 EN MUTSUZ.
- **İhtiyaç → Çözüm:** Product.executionClass + linearWeight + ralCode → **hedef 7.5/10**.

### 4.3 Mobilya İmalatı (~35.000 KOBİ)
- **Mevcut skor:** 5.4/10
- **Blocker:** Set bazlı sipariş yok (otel projelerini alamıyor).
- **Niş modül ihtiyacı:** ProductBundle/SetTemplate, Panel nesting, renk/doku/RAL, kenar bantlama BOM.
- **Persona mutluluğu:** 5.6/10 — Özgür Bey 3/10 EN MUTSUZ (200 oda × 5 parça cehennemi).
- **İhtiyaç → Çözüm:** ProductBundle (1 hafta) → **hedef 7.0/10**, 35K KOBİ açılır.

### 4.4 Tekstil / Hazır Giyim (~30.000 KOBİ)
- **Mevcut skor:** 4.6/10 — **en düşük ana sektör**
- **Blocker:** 🔴 ProductVariant yok. Atlas Bey 15 ayrı ürün kartı açmaya razı değil.
- **Niş modül ihtiyacı:** ProductVariant (beden × renk matrisi), AQL tablosu, dyeLot ΔE, pastal/marker.
- **Persona mutluluğu:** 4.4/10 — Atlas Bey 2/10 EN MUTSUZ.
- **İhtiyaç → Çözüm:** ProductVariant (2-3 hafta) → **hedef 7.5/10**, 30K KOBİ kurtulur. **En yüksek ROI'li iş.**

### 4.5 Gıda / İçecek Üretimi (~25.000 KOBİ)
- **Mevcut skor:** 4.5/10
- **Blocker:** 🔴 HACCP/CCP yok, 🔴 Recall workflow yok.
- **Niş modül ihtiyacı:** HaccpCcpManagement, RecallCommandCenter, allerjen matrisi, soğuk zincir sıcaklık log, CoA upload, FIFO zorunluluk.
- **Persona mutluluğu:** 5.0/10 — Taze Bey 3/10, Tülay Hanım 4/10.
- **İhtiyaç → Çözüm:** HACCP (8-12 gün) + Recall (10-14 gün) + allerjen field (30 dk) → **hedef 7.5/10**.

### 4.6 Otomotiv Yan Sanayi (~15.000 KOBİ)
- **Mevcut skor:** 6.6/10 — **en hazır sektör**
- **Blocker:** PPAP PDF paket export yok (tek dosya teslim formatı).
- **Niş modül ihtiyacı:** PPAP PDF Export, CSR (Customer Specific Requirements), PFMEA→CP→PPAP otomatik bağ, IMDS alanı, 8D PDF export, APQP Gate.
- **Persona mutluluğu:** 6.8/10 — Esra 8, Aslan Bey 7.
- **İhtiyaç → Çözüm:** PPAP PDF (10h) + CSR (3h) + otomatik bağ (6h) → **hedef 8.5/10**. Tier-2 tedarikçi pazarı için "bayrak gemisi".

### 4.7 Plastik Enjeksiyon (~12.000 KOBİ)
- **Mevcut skor:** 5.5/10
- **Blocker:** 🔴 Kalıp envanteri modülü yok. "Plastik ERP'si olmaz kalıp olmadan."
- **Niş modül ihtiyacı:** MoldInventory (kavite, ömür, bakım), SMED setup timer, çevrim süresi gerçek zamanlı, fire kategorileri (çapak/çekme/yanık), masterbatch oranı, hot runner.
- **Persona mutluluğu:** 5.6/10 — Özkan Bey 4/10.
- **İhtiyaç → Çözüm:** MoldInventory (6-8 gün) + setup + çevrim (4 gün) → **hedef 7.5/10**.

### 4.8 Makine İmalatı (MTO) (~10.000 KOBİ)
- **Mevcut skor:** 5.0-6.0/10
- **Blocker:** 🔴 CE Teknik Dosya modülü yok (AB ihracatı), 🔴 "machinery" sektör profili bile yok.
- **Niş modül ihtiyacı:** CE Technical File (DoC, risk, kılavuz, şema), EN ISO 12100 risk değerlendirmesi, multi-level BOM tree (drag-drop + where-used), commissioning modülü, garanti takibi, milestone-based invoicing.
- **Persona mutluluğu:** 5.0/10 — Yusuf Mühendis 3/10.
- **İhtiyaç → Çözüm:** CE File (14h) + ISO 12100 (8h) + BOM tree (8h) → **hedef 7.5/10**.

### 4.9 Sac Metal / Lazer (~15.000 KOBİ)
- **Mevcut skor:** 5.5/10
- **Blocker:** Nesting entegrasyonu yok.
- **Niş modül ihtiyacı:** CuttingPlan (metal ile ortak), malzeme verim scrap %, plaka izleme.
- **Persona mutluluğu:** 5.0/10.
- **İhtiyaç → Çözüm:** CuttingPlan temel (1 hafta) → **hedef 7.0/10**.

### 4.10 Elektronik / PCB Assembly (~8.000 KOBİ)
- **Mevcut skor:** 5.2/10
- **Blocker:** Component lot & date code izleme eksik.
- **Niş modül ihtiyacı:** AOI/SPI/ICT sonuç entegrasyonu, BOM match to CAD centroid, component datecode.
- **Persona mutluluğu:** 4.8/10.
- **İhtiyaç → Çözüm:** PCB modülü + genealogy → **hedef 7.0/10**.

### 4.11 Kimya / Boya (~6.000 KOBİ)
- **Mevcut skor:** 4.3/10 — **18 sektörün en düşüğü**
- **Blocker:** Recipe yönetimi yok, MSDS/SDS yok, REACH/CLP yok.
- **Niş modül ihtiyacı:** RecipeManagement (formula, yield, reaction), MSDS kütüphanesi, regulatory compliance.
- **Persona mutluluğu:** 3.5/10.
- **İhtiyaç → Çözüm:** Recipe (6-8 gün) + MSDS (3-5 gün) → **hedef 6.5/10**.

### 4.12 Kauçuk (~4.000 KOBİ)
- **Mevcut skor:** 5.0/10
- **Niş modül ihtiyacı:** Recipe, vulkanizasyon cycle.
- **Persona mutluluğu:** 4.5/10.

### 4.13 Döküm (~5.000 KOBİ)
- **Mevcut skor:** 5.2/10
- **Niş modül ihtiyacı:** Cüruf/alacak, metalürji sertifika (kimyasal analiz), fırın cycle sıcaklık profili.
- **Persona mutluluğu:** 4.5/10.

### 4.14 Ambalaj (~12.000 KOBİ)
- **Mevcut skor:** 5.5/10
- **Niş modül ihtiyacı:** Büyük rulo → kesim optim, multi-color baskı tabaka yönetimi.
- **Persona mutluluğu:** 5.0/10.

### 4.15 Tarım Makinaları (~6.000 KOBİ)
- **Mevcut skor:** 6.0/10
- **Niş modül ihtiyacı:** Saha servis, garanti trace.
- **Persona mutluluğu:** 5.5/10.

### 4.16 Enerji / Panel Üretici (~3.000 KOBİ)
- **Mevcut skor:** 5.7/10
- **Niş modül ihtiyacı:** Panel test, sertifika.

### 4.17 Kaynak / Savunma Alt Yüklenici (~5.000 KOBİ)
- **Mevcut skor:** 5.7/10
- **Blocker:** WPS/WPQR modülü yok, kaynakçı sertifika expiry yok.
- **Niş modül ihtiyacı:** WPS/WPQR, heat input calculator, interpass temp, NDT template, kaynakçı sertifika dashboard, purge O2.
- **Persona mutluluğu:** 5.0/10 — Onur Mühendis 4/10.
- **İhtiyaç → Çözüm:** 10-15 gün iş → **hedef 8.0/10** (niş lider).

### 4.18 Medikal Cihaz (~3.000 KOBİ)
- **Mevcut skor:** 5.3/10
- **Blocker:** 🔴 UDI yok, 🔴 Recall yok, 🔴 Sterilizasyon IQ/OQ/PQ yok, 🔴 ISO 14971 risk yönetimi yok.
- **Niş modül ihtiyacı:** UDI Manager (DI + PI + EUDAMED), RecallCommandCenter, IQ/OQ/PQ, ISO 14971, biyouyumluluk, temiz oda ortam izleme, MDR teknik dosya.
- **Persona mutluluğu:** 4.2/10 — Banu Hanım 3/10 EN MUTSUZ, Sezgin Bey 3/10.
- **İhtiyaç → Çözüm:** 35-50 gün yatırım → **hedef 8.0/10**, ayda 3000-5000 USD fiyatlandırma.

---

## 5. PERSONA MUTLULUK MATRİSİ (Özet 8 Persona × Kritik Sektör)

Aşağıdaki matris 8 personanın her bir sektördeki mutluluk skorunu gösterir (0-10 skala). "Şu an" / "Sonra" formatında.

### 5.1 Operatör (Veli Usta tarzı)

| Sektör | Şu An | İhtiyaç | Sonra |
|--------|-------|---------|-------|
| CNC | 9 | Help button | 9 |
| Metal | 8 | Boya mikron input | 9 |
| Mobilya | 8 | Kabin ortam widget | 9 |
| Tekstil | 7 | Saatlik parça sayacı | 9 |
| Gıda | 7 | Sıcaklık/pH input | 9 |
| Otomotiv | 8 | SPC auto akış | 9 |
| Plastik | 6 | SMED timer | 8 |
| Makine | 8 | Montaj checklist | 9 |
| Kaynak | 6 | Heat input calc | 9 |
| Medikal | 6 | UDI otomatik besleme | 9 |
| **Ortalama** | **7.3** | | **8.9** |

Yorum: Operatör personası zaten ShopFloorTerminal sayesinde mutlu. Hedef: mevcut seviyeyi koru + help butonu ekle + sektörel measurement field'lar.

### 5.2 Üretim Müdürü (Ahmet Bey tarzı)

| Sektör | Şu An | İhtiyaç | Sonra |
|--------|-------|---------|-------|
| CNC | 6 | Gantt drag-drop | 8 |
| Metal | 6 | Çakışma uyarısı | 8 |
| Mobilya | 5 | Set sipariş | 8 |
| Tekstil | 4 | Pastal plan + varyant | 8 |
| Gıda | 5 | HACCP akış | 7 |
| Otomotiv | 6 | Hat dengesi | 8 |
| Plastik | 5 | Kalıp, çevrim | 8 |
| Makine | 5 | Proje bağ + ETO | 8 |
| Kaynak | 5 | Fason ısıl işlem | 7 |
| Medikal | 5 | Temiz oda slot | 8 |
| **Ortalama** | **5.2** | | **7.8** |

Yorum: Üretim Müdürü 3 puan artış bekleniyor — Gantt v2 + sektör modülleri ile.

### 5.3 Kaliteci (Selma/Tülay/Esra/Banu)

| Sektör | Şu An | İhtiyaç | Sonra |
|--------|-------|---------|-------|
| CNC | 7 | SPC dashboard | 8 |
| Metal | 5 | EN 1090 EXC + VT/PT | 7 |
| Mobilya | 6 | AQL lookup | 8 |
| Tekstil | 4 | AQL tablo + ΔE | 8 |
| Gıda | 4 | HACCP/CCP | 8 |
| Otomotiv | 8 | Tablet SPC | 9 |
| Plastik | 7 | Fire kategori | 8 |
| Makine | 5 | CE dosya + risk | 7 |
| Kaynak | 5 | NDT template + WPS | 8 |
| Medikal | 3 | ISO 14971 + Recall | 8 |
| **Ortalama** | **5.4** | | **7.9** |

### 5.4 Finansçı (Ayşe Hanım)

| Sektör | Şu An | İhtiyaç | Sonra |
|--------|-------|---------|-------|
| Tüm | 6 | e-Fatura görünürlük, aging drill-down, banka API, tahsilat dashboard | 8 |

### 5.5 Patron (Mehmet/Yılmaz/Özgür/Atlas/Taze/Aslan/Özkan/Teknik/Ozdemir/MedTek)

| Sektör | Şu An | İhtiyaç | Sonra |
|--------|-------|---------|-------|
| CNC (Mehmet) | 5 | ProductForm minimal | 8 |
| Metal (Yılmaz) | 5 | Minimal + EXC | 8 |
| Mobilya (Özgür) | **3** | Set bundle | 7 |
| Tekstil (Atlas) | **2** | ProductVariant | 8 |
| Gıda (Taze) | **3** | Recall + HACCP | 8 |
| Otomotiv (Aslan) | 7 | PPAP export | 9 |
| Plastik (Özkan) | **4** | Mold inventory | 8 |
| Makine (Teknik) | **4** | CE dosya | 8 |
| Kaynak (Ozdemir) | 5 | WPS + sertifika | 8 |
| Medikal (MedTek) | **4** | UDI + Recall | 8 |
| **Ortalama** | **4.2** | | **8.0** |

Yorum: **Patron personası en mutsuz (4.2/10) — Quvex'i satın alma kararını veren kişi.** 6 ay sonunda 8.0'a çıkarmak stratejik önceliğimiz.

### 5.6 Depo Sorumlusu (Hasan Bey)

| Sektör | Şu An | Sonra |
|--------|-------|-------|
| Ortalama | 6.0 | 7.5 |

İhtiyaç: Lot FIFO otomatik, birim dönüşüm (kg↔m↔m²), sıcaklık log, CoA upload.

### 5.7 Satınalma (Fatma Hanım)

| Sektör | Şu An | Sonra |
|--------|-------|-------|
| CNC | **4** (en mutsuz) | 8 |

İhtiyaç: PurchaseOfferComparison matrisi, PO onay workflow, PO-Fatura matching tooltip.

### 5.8 Bakım Teknisyeni (Hüseyin Bey)

| Sektör | Şu An | Sonra |
|--------|-------|-------|
| Ortalama | 8.0 | 9.0 |

İhtiyaç: Prediktif bakım, kalıp bakım planı (plastik), WPS-makine uyumu.

---

## 6. ÜRÜNÜ SATMAK İÇİN NE EKLEMELİYİZ?

### 6.A KILLER FEATURES (Satışı Kazandıracak)

#### A1. Persona-Bazlı Dashboard'lar (5-6 farklı)
- **ExecutiveDashboard** (Patron) — satış, nakit akış, OEE özet, WhatsApp günlük özet
- **OperatorDashboard** (Operatör) — Doğrudan ShopFloor'a yönlendir
- **WarehouseDashboard** (Depo) — Stok uyarı, lot expiry, transfer listesi
- **FinanceDashboard** (Finansçı) — Aging, e-Fatura durumu, tahsilat
- **QualityDashboard** (Kaliteci) — Açık NCR, CAPA, sertifika expiry, SPC violations
- **MaintenanceDashboard** (Bakım) — OEE, MTBF, bakım planı
- **Efor:** 2-3 hafta
- **Kazanım:** +1.5 puan tüm sektörlerde

#### A2. 5 Dakika Onboarding ("Vay Anasını" Anı)
- Register → Sektör seçimi → Demo veri otomatik yüklendi → Persona dashboard hazır → İlk müşteri 30sn → İlk ürün 30sn → İlk teklif 1 dk → ShopFloor demo
- Joyride tour her ana adımda
- **Efor:** 1 hafta
- **Kazanım:** Trial dönüşüm %34 → %70

#### A3. Sektör Bazlı Demo Data Şablonları
- 18 sektör için gerçekçi demo: örnek makine listesi, 20 örnek ürün, 5 müşteri, 10 sipariş, 3 açık NCR
- Tek tıkla yükle → Atlas Bey 5 dakikada kendi gömlek ürününü görüyor
- **Efor:** 18 gün (1 gün/sektör)
- **Kazanım:** İlk 5 dakika "bu sistem benim sektörümü biliyor" hissi

#### A4. Mobil Shop Floor Uygulaması
- ShopFloor zaten 9/10 — PWA / React Native wrap
- Offline-first (audit'te kanıtlanmış)
- Push notification (yeni iş emri, NCR)
- **Efor:** 3-4 hafta
- **Kazanım:** 50 yaşındaki operatör bile kullanır → pazarlama vaadi

#### A5. Real-Time Üretim Panosu (Factory TV)
- Fabrika büyük ekranına yansıtılan real-time pano: aktif iş emirleri, OEE live, kalite bayrakları, hedef vs gerçek
- WebSocket ile canlı güncellenen
- **Efor:** 1-2 hafta
- **Kazanım:** Patron "vay anasını" faktörü, showroom etkisi

#### A6. WhatsApp Entegrasyonu (Türkiye için Kritik)
- Mehmet Bey günlük özeti WhatsApp'tan alıyor
- Kritik NCR → WhatsApp bildirim
- Sipariş teslimi onayı WhatsApp
- e-Fatura link WhatsApp
- **Efor:** 1-2 hafta (WhatsApp Business API)
- **Kazanım:** Türk KOBİ patronunun #1 beklentisi. Pazarlama silahı.

### 6.B NİŞ MODÜLLER (Sektör Pazarı Açacak)

| # | Modül | Sektör | KOBİ Hedefi | Efor | Öncelik |
|---|-------|--------|-------------|------|---------|
| 1 | **ProductVariant** (beden × renk matrisi) | Tekstil + Mobilya + Ayakkabı + Hediyelik | 30K+ | 2-3 hafta | P0 |
| 2 | **HACCP/CCP Engine** (critical limit + monitoring + auto NCR) | Gıda + İçecek | 25K | 8-12 gün | P0 |
| 3 | **RecallCommandCenter** (lot→müşteri→bildirim→PDF) | Gıda + Medikal + Otomotiv | 28K+ | 10-14 gün | P0 |
| 4 | **MoldInventory** (kavite + ömür + bakım + uyum matrisi) | Plastik + Kauçuk + Döküm | 16K | 6-8 gün | P0 |
| 5 | **CE Technical File Manager** (DoC + risk + kılavuz + şema) | Makine + Tarım Mak. | 16K | 14h + 8h risk | P0 |
| 6 | **WPS/WPQR + Kaynakçı Sertifika** | Kaynak + Savunma + Metal | 50K | 5-8 gün | P1 |
| 7 | **CuttingPlan / Nesting** (SVG preview + fire oranı) | Metal + Mobilya + Tekstil + Sac | 125K | 1-2 hafta temel | P1 |
| 8 | **UDI Manager** (DI + PI + EUDAMED + lazer otomatik) | Medikal | 3K | 8-12 gün | P0 |
| 9 | **PPAP PDF Export Paket** (Warrant + 18 eleman tek PDF) | Otomotiv + Savunma | 20K | 10 saat | P0 |
| 10 | **ToolLife Management** | CNC + Otomotiv + Plastik | 47K | 4-5 gün | P1 |
| 11 | **Sterilizasyon IQ/OQ/PQ** | Medikal | 3K | 6-8 gün | P0 |
| 12 | **ISO 14971 Risk Management** | Medikal | 3K | 5-7 gün | P0 |
| 13 | **Recipe Management** (formula + MSDS) | Kimya + Boya + Kauçuk + Gıda | 36K | 6-8 gün | P1 |
| 14 | **ProductBundle / SetTemplate** | Mobilya + Hediyelik | 40K | 1 hafta | P0 |
| 15 | **ECN / ECO Workflow** (Engineering Change) | Makine + Otomotiv + PCB | 33K | 1 hafta | P1 |

### 6.C UX İYİLEŞTİRMELERİ (Trial Dönüşüm Artırır)

- **ProductForm minimal mode** (3 alan)
- **CustomerForm minimal mode** (3 alan)
- **Tooltip ekosistemi** — `GlossaryTooltip` componenti + 50+ terim/sektör
- **Empty state tutarlılığı** — Tek `EmptyState` componenti
- **Help button (?)** her sayfada — Joyride tour tetikleyici
- **Sektör wizard'ları** — 18 farklı onboarding
- **Keyboard shortcuts** — Ctrl+S, Esc, Alt+N, Alt+F standardı
- **Popconfirm wrapper** — risky actions için
- **Dashboard drill-down** — pie'a tıkla → filtered list
- **Responsive form grid** — Tablet tam uyumlu

### 6.D PAZARLAMA AÇISI (Sales Pitch)

1. **"Excel'den 5 dakikada Quvex'e geç"** — Demo data + minimal form + sektör şablonu
2. **"ShopFloor Terminal — operatörünüz 50 yaşında bile kullanır"** — Audit kanıtı: 9/10
3. **"HACCP, PPAP, AS9100 — denetim günü hazır"** — Niş modül paketleri
4. **"Türkçe, mobil uyumlu, online+offline"** — PWA ShopFloor
5. **"İlk 14 gün ücretsiz, kredi kartı yok"** — Trial friction azaltma
6. **"WhatsApp'tan günlük özet al"** — Türkiye'ye özel USP
7. **"Kendi sektörünüzün diline konuşan ERP"** — Master slogan

---

## 7. ÇALIŞAN MUTLULUĞU İÇİN

### 7.1 Operatör (Veli Usta) — Şu An 9/10, Hedef 9/10 (KORU)
- **Mevcut durum:** ShopFloorTerminal mükemmel (80px buton, renk, offline, barkod).
- **Ne yapmalı:** Mevcut seviyeyi KORUMAK için,
  - Help butonu (?) header'a → 30 dk
  - Sesli komut POC (arka plan) → gelecek
  - Dokunmatik optimize validation (eldiven testi)
  - Sektörel measurement field (sıcaklık, pH, interpass, çevrim sayacı)
- **Kazanım:** +0 puan (zaten zirvede) ama kaybı önleme kritik.

### 7.2 Üretim Müdürü (Ahmet Bey) — Şu An 5-6/10, Hedef 8/10
- **Acı noktalar:** Gantt drag-drop yok, çakışma uyarısı yok, set siparişte çöküyor, mobil uyumsuz.
- **Çözümler:**
  - Drag-drop Gantt (react-gantt-task) → 5-7 gün
  - Real-time KPI (WebSocket) → 3 gün
  - Çakışma uyarıları (handleSave'de overlap detection) → 1 gün
  - Mobil Gantt (tablet responsive) → 3-5 gün
  - Sektör bazlı Gantt preset (temiz oda slot, hat dengeleme)
- **Kazanım:** +2.5 puan.

### 7.3 Kaliteci (Selma Hanım) — Şu An 5-7/10, Hedef 8/10
- **Acı noktalar:** Sertifika upload yorucu, SPC manuel giriş, NCR manuel tetikleme, AQL tablosu el ile.
- **Çözümler:**
  - Sertifika upload drag-drop + OCR (uzun vadeli)
  - SPC dashboard görselleştir + tablet input → 4-6 gün
  - NCR otomatik tetikleme (tolerance dışı → auto) → workflow engine
  - AQL tablo lookup (static ISO 2859) → 1 hafta
  - ShopFloor → SPC otomatik akış → 6 gün
- **Kazanım:** +2.5 puan.

### 7.4 Finansçı (Ayşe Hanım) — Şu An 6/10, Hedef 8/10
- **Acı noktalar:** e-Fatura görünürlük zayıf, aging drill-down eksik, banka API yok.
- **Çözümler:**
  - e-Fatura durum sütunu InvoiceList'te + renk kodu → 1 gün
  - Aging drill-down (pie'a tıkla) → 2 saat
  - Banka API entegrasyonu (Garanti, İş Bank open banking) → 2-3 hafta
  - Tahsilat takip dashboard → 1 hafta
  - PO-Fatura matching tooltip + detay → 2 saat
- **Kazanım:** +2.0 puan.

### 7.5 Patron (Mehmet Bey) — Şu An 3-5/10, Hedef 8/10 ⚠️ EN MUTSUZ
- **Acı noktalar:** ProductForm korkutuyor, CustomerForm tab cehennemi, dashboard generic, hiçbir şey sektörünü bilmiyor.
- **Çözümler:**
  - **ExecutiveDashboard persona-bazlı** → 5 gün
  - **Mobil özet PWA** → 3-4 hafta
  - **WhatsApp bildirimi** → 1-2 hafta
  - **Onboarding wizard sektör bazlı** → 1 hafta
  - **ProductForm minimal mode** → 3 saat
  - **CustomerForm minimal mode** → 2 saat
  - **Sektör demo data** → 18 gün (1/sektör)
  - **Sektör şablonu onboarding** → dahil
  - **5 dakika "vay anasını" akışı** → 1 hafta
- **Kazanım:** +4 puan — en büyük transformasyon. Satın alma kararını bu kişi veriyor.

### 7.6 Depo Sorumlusu (Hasan Bey) — Şu An 6-7/10, Hedef 8/10
- **Çözümler:** Lot FIFO otomatik, birim dönüşüm (kg↔m↔m²), sıcaklık log widget, CoA upload zorunluluk, StockTransfer validation (1 saat).
- **Kazanım:** +1.5 puan.

### 7.7 Satınalma (Fatma Hanım) — Şu An 4/10, Hedef 8/10 ⚠️
- **Çözümler:** PurchaseOfferComparison matrisi, PO onay workflow, PO-Fatura matching visual, karşılaştırma auto-recommend.
- **Efor:** 1-2 hafta.
- **Kazanım:** +4 puan — EN BÜYÜK iyileştirme potansiyeli.

### 7.8 Bakım Teknisyeni (Hüseyin Bey) — Şu An 8/10, Hedef 9/10
- **Çözümler:** Prediktif bakım (sensör + ML POC), kalıp bakım planı, WPS-makine uyum matrisi.
- **Kazanım:** +1 puan (zaten yüksek).

---

## 8. ÖNCELİKLENDİRİLMİŞ AKSİYON LİSTESİ (TOP 30)

| # | İş | Süre (saat/gün) | Etki (sektör sayısı) | ROI | Bağımlılık |
|---|-----|-----------------|----------------------|-----|------------|
| 1 | ProductForm minimal mode (3 alan) | 3h | 18 | 🔴🔴🔴 | — |
| 2 | CustomerForm minimal mode (3 alan) | 2h | 18 | 🔴🔴🔴 | — |
| 3 | Onboarding "Demo Yükle" prominent hero | 30dk | 18 | 🔴🔴 | — |
| 4 | StockTransfer validation (negatif stok önle) | 1h | 18 | 🔴 | — |
| 5 | GlossaryTooltip componenti + 50 terim | 4h | 18 | 🔴🔴 | — |
| 6 | Role-based home routing | 2 gün | 18 | 🔴🔴 | — |
| 7 | Empty State unification componenti | 4h | 18 | 🟡 | — |
| 8 | Popconfirm wrapper pattern | 2h | 18 | 🟡 | — |
| 9 | Dashboard drill-down onClick | 2h | 18 | 🟡 | — |
| 10 | Keyboard shortcuts global (Ctrl+S, Esc) | 1 gün | 18 | 🟡 | — |
| 11 | Sertifika expiry + dashboard widget | 1 gün | 10 | 🔴🔴 | — |
| 12 | Sektör bazlı demo data (18 sektör) | 18 gün | 18 | 🔴🔴🔴 | — |
| 13 | Machinery sektör profili ekle | 1h | 1 (10K) | 🟡 | — |
| 14 | ShopFloor "?" help button | 30dk | 18 | 🟡 | — |
| 15 | PPAP PDF paket export | 10h | 2 (35K) | 🔴🔴🔴 | — |
| 16 | CSR (Customer Specific Req.) tab | 3h | 1 (15K) | 🔴🔴 | — |
| 17 | PFMEA→ControlPlan→PPAP otomatik bağ | 6h | 1 (15K) | 🔴🔴 | — |
| 18 | HACCP CCP kayıt form | 3 gün | 1 (25K) | 🔴🔴🔴 | — |
| 19 | Recall trigger modal + etkilenen lot listesi | 3 gün | 3 (43K) | 🔴🔴🔴 | 5 |
| 20 | Allerjen matrisi ProductForm'a | 3h | 1 (25K) | 🔴🔴 | 1 |
| 21 | Sıcaklık log StockLotList'e | 5h | 2 (28K) | 🔴🔴 | — |
| 22 | ProductVariant entity + UI | 2-3 hafta | 3 (65K) | 🔴🔴🔴 | — |
| 23 | ProductBundle / SetTemplate | 1 hafta | 2 (40K) | 🔴🔴 | — |
| 24 | CuttingPlan temel modül | 1-2 hafta | 4 (125K) | 🔴🔴🔴 | — |
| 25 | MoldInventory modülü | 6-8 gün | 3 (16K) | 🔴🔴🔴 | — |
| 26 | CE Technical File modülü | 14h | 2 (16K) | 🔴🔴🔴 | — |
| 27 | EN ISO 12100 risk değerlendirmesi | 8h | 2 (16K) | 🔴🔴 | 26 |
| 28 | UDI field + auto PI generate | 2 gün | 1 (3K) | 🔴🔴🔴 | — |
| 29 | Lazer markalama UDI otomatik besleme | 1 gün | 1 (3K) | 🔴🔴 | 28 |
| 30 | SerialNumber genealogy tree view | 4-5 gün | 6 (80K) | 🔴🔴🔴 | — |

**Toplam efor:** ~50-65 gün (2 geliştirici paralel çalışsa 5-7 hafta).
**Toplam mutluluk kazanımı:** ~+45 puan dağıtık. Ortalama sektör 5.4 → 7.2.

---

## 9. 6 AYLIK ROADMAP

### AY 1 — QUICK WIN SPRINT (Tüm Sektörler)
**Hedef sektörler:** 18/18 (yataylayıcı etki)
**Çıktılar:**
- ProductForm minimal mode
- CustomerForm minimal mode
- GlossaryTooltip ekosistemi (50 terim)
- Role-based home routing
- Onboarding demo prominent + 18 sektör demo data (ilk 6 sektör)
- Popconfirm, EmptyState, Dashboard drill-down, Sertifika expiry widget
- StockTransfer validation
- Keyboard shortcuts
- ShopFloor help button

**Mutluluk skorları:** Ortalama 5.4 → 6.5
**Pazar erişimi:** Trial dönüşüm %34 → %60
**Efor:** 20-25 gün / 2 geliştirici

### AY 2 — OTOMOTİV + TEKSTİL PRODUCTVARIANT
**Hedef sektörler:** Otomotiv (15K), Tekstil (30K)
**Çıktılar:**
- **ProductVariant entity + UI** (Tekstil kurtarma — en yüksek ROI)
- PPAP PDF paket export
- CSR tab (CustomerForm)
- PFMEA→ControlPlan→PPAP otomatik bağ
- 8D Rapor PDF template
- AQL tablo lookup (ISO 2859)
- ShopFloor → SPC otomatik akış
- Kalan 12 sektör demo data

**Mutluluk skorları:** Otomotiv 6.6 → 8.5, Tekstil 4.6 → 7.0
**Pazar erişimi:** +45K KOBİ açılır (Tekstil + Otomotiv tam pazar)
**Efor:** 20-25 gün

### AY 3 — GIDA HACCP + RECALL
**Hedef sektörler:** Gıda (25K), Medikal (3K), Otomotiv (overlap)
**Çıktılar:**
- **HaccpCcpManagement modülü** (critical limit + monitoring + auto NCR)
- **RecallCommandCenter** (lot→müşteri→bildirim→PDF)
- Allerjen matrisi
- Soğuk zincir sıcaklık log
- CoA upload zorunluluk
- FIFO otomatik
- ShopFloor sektörel measurement field kit
- SerialNumber genealogy tree view

**Mutluluk skorları:** Gıda 4.5 → 7.5, Medikal kısmi 5.3 → 6.5
**Pazar erişimi:** +28K KOBİ açılır
**Efor:** 20-25 gün

### AY 4 — PLASTİK MOLD + MAKİNE CE
**Hedef sektörler:** Plastik (12K), Makine (10K), Kauçuk (4K), Döküm (5K)
**Çıktılar:**
- **MoldInventory modülü** (kavite + ömür + bakım + uyum)
- SMED timer + çevrim süresi gerçek zamanlı
- Fire kategorileri enum
- **CE Technical File Manager**
- EN ISO 12100 risk değerlendirmesi
- Machinery sektör profili
- Multi-level BOM drag-drop + where-used
- Commissioning modülü
- Garanti takibi

**Mutluluk skorları:** Plastik 5.5 → 7.5, Makine 5.0 → 7.5
**Pazar erişimi:** +31K KOBİ
**Efor:** 25 gün

### AY 5 — NİŞ MODÜLLER + UX POLISH
**Hedef sektörler:** Kaynak (5K), Medikal tam (3K), Metal (45K), Mobilya (35K)
**Çıktılar:**
- **WPS/WPQR** + kaynakçı sertifika expiry
- Heat input calculator + interpass + NDT template
- **UDI Manager** (DI + PI + EUDAMED)
- **Sterilizasyon IQ/OQ/PQ**
- **ISO 14971 Risk Management**
- ProductBundle (Mobilya set)
- CuttingPlan temel (Metal + Mobilya + Tekstil)
- Renk/doku/RAL alanları
- EN 1090 EXC
- Birim dönüşüm matrisi (kg↔m↔m²)
- Saha montaj mobil form

**Mutluluk skorları:** Kaynak 5.7 → 8.0, Medikal 5.3 → 8.0, Metal 5.8 → 7.5, Mobilya 5.4 → 7.5
**Pazar erişimi:** +88K KOBİ (en büyük tek ay)
**Efor:** 25-30 gün

### AY 6 — PERSONA DASHBOARD + BÜYÜK REFACTOR
**Hedef sektörler:** Tüm 18, persona cilalama
**Çıktılar:**
- **5-6 Persona Dashboard** (Executive, Operator, Warehouse, Finance, Quality, Maintenance)
- **ProductionGantt v2** drag-drop + çakışma + mobil
- **Workflow Engine UI** (visual flow editor — NCR, Recall, APQP, CE onay)
- **PDF Report Builder servisi** (generic template)
- Mobile-first refactor (planlama/kalite ekranları tablet uyumu)
- WhatsApp entegrasyonu
- Real-time üretim panosu (Factory TV)
- PurchaseOfferComparison
- Excel import pattern (Product/BOM/Customer)
- Tool Life Management
- Bundle size / lazy loading (700KB → 400KB)
- Final QA + pazarlama materyalleri

**Mutluluk skorları:** Ortalama 7.2 → 7.8
**Pazar erişimi:** Trial dönüşüm %80+
**Efor:** 25-30 gün

### 6 AY TOPLAM ÖZET

| Metrik | Başlangıç | 6 Ay Sonra | Değişim |
|--------|-----------|------------|---------|
| Ortalama sektör skoru | 5.4/10 | 7.5-7.8/10 | +2.1 |
| Patron persona ortalaması | 4.2/10 | 8.0/10 | +3.8 |
| Satılabilir sektör sayısı | 4 | 16 | +12 |
| Trial dönüşüm oranı | %34 | %80 | +46pp |
| Adreslenebilir pazar (KOBİ) | 51K | 220K | +169K |
| İlk 5 dakika başarı oranı | %30 | %85 | +55pp |
| İlk 1 saat başarı oranı | %34 | %81 | +47pp |

**Efor tahmini:** ~135 geliştirici-günü (2 geliştirici × 6 ay). Ortak altyapı + niş modüller + refactor.

---

## 10. FİNANSAL PROJEKSİYON

### 10.1 Varsayımlar
- Ortalama aylık abonelik: 400 USD (Temel), 800 USD (Profesyonel), 1500 USD (Enterprise / Niş modül), 3000-5000 USD (Medikal)
- Trial → ödemeli dönüşüm: %5 (pesimist), %10 (gerçekçi), %15 (iyimser)
- Yıllık churn: %15
- CAC (Customer Acquisition Cost): 1500 USD/müşteri

### 10.2 6 Ay Sonrası Pazar Hesabı

| Sektör | KOBİ | Realizasyon %1.5 | Ort. Abone/ay | Aylık Gelir (USD) |
|--------|------|-------------------|---------------|-------------------|
| Otomotiv | 15K | 225 | 1500 | 337.500 |
| CNC | 20K | 300 | 800 | 240.000 |
| Metal | 45K | 675 | 600 | 405.000 |
| Mobilya | 35K | 525 | 600 | 315.000 |
| Tekstil | 30K | 450 | 600 | 270.000 |
| Gıda | 25K | 375 | 1000 | 375.000 |
| Plastik | 12K | 180 | 900 | 162.000 |
| Makine | 10K | 150 | 1200 | 180.000 |
| Medikal | 3K | 45 | 3500 | 157.500 |
| Kaynak (savunma) | 5K | 75 | 1500 | 112.500 |
| Diğer 8 sektör | 64K | 960 | 600 | 576.000 |
| **TOPLAM** | **264K** | **~4000** | **~850** | **~3.1M USD/ay** |

**Pesimist senaryo (%0.3 realizasyon):** ~800 müşteri × 750 USD = **600K USD/ay MRR**.
**Gerçekçi senaryo (%0.8 realizasyon):** ~2100 müşteri × 800 USD = **1.68M USD/ay MRR**.
**İyimser senaryo (%1.5 realizasyon):** ~4000 müşteri × 850 USD = **3.1M USD/ay MRR**.

### 10.3 En Yüksek Değerli Segmentler
1. **Medikal** (3K KOBİ × 3500 USD) — Düşük hacim, yüksek ARPU. USD pazarı.
2. **Otomotiv** (15K KOBİ × 1500 USD) — Tier-2 tedarikçiler, büyük firmalar.
3. **Gıda** (25K KOBİ × 1000 USD) — Rakip az, USP kritik.
4. **Makine MTO** (10K KOBİ × 1200 USD) — ETO'ya premium.
5. **Kaynak/Savunma** (5K × 1500 USD) — Savunma sanayii ekosistemi.

### 10.4 Trial Dönüşüm Tahmini
- Ayda 500 trial kayıt varsayımıyla:
- **Şu an (%34 success × %5 conversion)** = 8.5 yeni müşteri/ay
- **6 ay sonra (%81 success × %10 conversion)** = 40 yeni müşteri/ay (**~5x artış**)

---

## 11. RİSKLER & VARSAYIMLAR

### 11.1 Teknik Borç
- **Bundle size 700KB gzipped** — lazy loading gerekli (3 gün, düşük risk)
- **Vite 5.4 → Vite 6 geçişi riski** — sass 1.32.13 bağımlılığı
- **ProductForm refactor büyük** — mevcut 30+ alan geriye uyumlu kalmalı
- **Workflow engine büyük yatırım** — scope creep riski; modül bazlı başlanmalı
- **Çoklu sektör profili uiConfig karmaşıklığı** — test coverage kritik

### 11.2 Pazar Değişimi
- **Ekonomik durgunluk** — KOBİ yatırımları azalabilir. Fiyat esnekliği (temel plan ucuz tut) şart.
- **Regülasyon değişimi** — AB MDR/GDPR, Türkiye KVKK güncellemeleri hızlı uyumluluk gerektirir.
- **AI trend** — rakipler "AI destekli ERP" pitch'i yapıyor. Quvex'in AI roadmap'i olmalı (ör. ML-based demand forecasting, anomaly detection).

### 11.3 Rekabet
- **Yerli:** Logo, Mikro, Netsis, Nebim Winner, TETSmart — büyük ve yerleşik.
- **Global:** SAP B1, Odoo, NetSuite — büyük firma odaklı.
- **Niş:** Manufactio (gıda), Arena (medikal PLM), Seradex (metal).
- **Savunma:** ProShop, DELMIAWorks.
- **USP:** Türkçe + mobil ShopFloor + AS9100 defans + 18 sektör modül paketleri + uygun fiyat.

### 11.4 Kaynak Kısıtları
- **2 geliştirici 6 ay** varsayımı — 1 eksildiyse plan kayar.
- **Sektör uzmanlığı eksik alanlar** — Medikal MDR, Gıda HACCP danışman gerekebilir.
- **QA kapasitesi** — 1223 API + 686 UI test mevcut; yeni modüller için +300-500 test yazılmalı.
- **Pazarlama bütçesi** — Trial akışı iyileştirildikten sonra pazarlama başlatılmalı (ay 4-5).

### 11.5 Kritik Varsayımlar
1. ShopFloorTerminal'in 9/10 skoru KORUNACAK (regresyon yok).
2. Multi-tenancy altyapısı 50 tenant'ı kaldırabilecek (TENANT-50-PLAN.md doğrulandı).
3. PostgreSQL schema-per-tenant performance 50 tenant × 18 sektör yük için yeterli.
4. E2E test (189 test, %99.5 pass) yeni eklenen modüllerle kapsanacak.
5. Vite 5.4 + React 18 stack en az 12 ay daha stable kalacak.

---

## 12. SONUÇ — TEK CÜMLELİK MİSYON

> **"Quvex, 6 ay içinde Türkiye'nin 18 imalat sektörünün her birinin kendi dilini konuşan, ilk 5 dakikada patronuna 'vay anasını' dedirten, operatöründen denetçisine kadar 8 farklı personanın mutlu olduğu, HACCP'ten PPAP'a, UDI'den WPS'e kadar sektörel derinliğe sahip, ~220.000 KOBİ'ye hitap edebilen, Türkiye'nin en kapsamlı KOBİ imalat ERP'si olmalıdır — ve bugün bu vizyonun %70'i kod halinde hazırdır, eksik olan %30 bu belgedeki yol haritasıyla tamamlanabilir."**

### Kapanış Notları

**Bu belgede belirtilen her sorunun çözümü vardır, her çözümün eforu hesaplanmıştır, her eforun kazanımı öngörülmüştür.** Yol haritasının özü şudur:

1. **İlk ay tüm sektöre dokun** — Quick Win Sprint ile 18 sektörde +1 puan artış.
2. **İkinci ay Tekstil + Otomotiv aç** — ProductVariant ve PPAP Export ile 45K KOBİ kapıyı aç.
3. **Üçüncü ay Gıda'yı kurtarır** — HACCP + Recall ile 25K KOBİ, Türkiye'de az rakip.
4. **Dördüncü ay Plastik + Makine** — Mold + CE ile 22K KOBİ.
5. **Beşinci ay Medikal + Kaynak + Metal/Mobilya** — Niş modüller + 88K KOBİ.
6. **Altıncı ay cilalama** — Persona dashboard, Gantt v2, WhatsApp, Workflow engine.

**Başarının ölçütü tek bir metriktir:** *"Mehmet Bey 6 ay sonra trial'a girip ilk 1 saatte ilk iş emrini açabiliyor mu?"* — bugün bu oran %34, 6 ay sonra %81.

**Bu belge 6 ayda bir yenilenmeli, her ayın sonunda skorlar güncellenmelidir.**

---

## EKLER

- `CNC-USER-JOURNEY-UX-AUDIT.md` — CNC detay denetim (6.4/10)
- `UX-AUDIT-METAL-MOBILYA-TEKSTIL.md` — 3 sivil sektör (110K KOBİ)
- `UX-AUDIT-GIDA-OTOMOTIV-PLASTIK-MAKINE.md` — 4 hedef sektör (62K KOBİ)
- `UX-AUDIT-KAYNAK-MEDIKAL.md` — 2 niş sektör (savunma + medikal)
- `UX-AUDIT-MASTER-CROSS-SECTOR.md` — 18 sektör çapraz sentez
- `docs/SPRINT-PLAN.md` — Mevcut sprint takibi
- `docs/TENANT-50-PLAN.md` — 50 tenant multi-tenancy planı
- E2E senaryo dosyaları: `quvex-docs/tests/*.md` (18 sektör)

**Hazırlayan:** Kıdemli Ürün Stratejisi Ekibi
**Tarih:** 2026-04-10
**Versiyon:** 1.0 — İlk nihai sürüm
**Sonraki güncelleme:** 2026-10-10 (6 ay sonra)
