# Quvex ERP — MASTER UX Denetimi — Capraz Sektor Sentezi

> Tarih: 2026-04-10
> Kapsam: 18 sektor (3 derin inceleme + 7 ek inceleme + 8 cikarsama)
> Yontem: Kod seviyesi derin okuma + persona simulasyonu + E2E senaryo capraz-analizi
> Kaynaklar:
> - `CNC-USER-JOURNEY-UX-AUDIT.md`
> - `UX-AUDIT-KAYNAK-MEDIKAL.md` (bu oturum)
> - E2E senaryo dosyalari (`quvex-docs/tests/*`)
> - Kod tabani: `smallFactoryUI/src/views/modul/*`

---

## 1. YONETICI OZETI

Quvex ERP, 155 controller ve 220+ view ile Turk KOBI uretim pazarinin neredeyse tamamini kapsayan **olgun bir temel altyapiya** sahiptir. CNC icin **6.4/10**, Kaynak icin **5.7/10**, Medikal icin **5.3/10** ortalama ekran skorlari — urunun "satilabilir ama cilalanmasi gereken" bir asamada oldugunu gosteriyor.

### Temel Bulgu
**Quvex'in problemi "eksiklik" degil, "erisilebilirlik". Ozellik var, ama Mehmet Bey ilk 5 dakikada bulamiyor.**

### 3 Esas Sorun (Tum Sektorlerde Ortak)
1. **Ilk Kullanici Deneyimi Korkutucu** — ProductForm (3/10) ve CustomerForm (5/10) gibi "ilk temas" ekranlari 30+ alanla karsilayip kullaniciyi kaciriyor.
2. **Yardim Ekosistemi %60 Kapsamli** — Sektor jargonlari (WPS, UDI, NCR, CAPA, GTIP, MRB, OEE, PPAP, HACCP) tooltip/glossary'siz.
3. **Nis Sektore Ozel 1-3 Modul Eksik Her Sektorde** — Genel altyapi var ama sektor-spesifik "killer feature" yok.

### Stratejik Oneri
- **Once "Quick Win Sprint" (2 hafta)** — 30+ quick win ile tum sektorlerin puanini +1.5 artir.
- **Sonra "Nis Modul Sprint'leri"** — Her nis sektore 1-2 aylik ozel gelistirme (UDI, HACCP, PPAP, nesting, vb).
- **Pazarlama mesaji:** "Quvex, kendi sektorunuzun diline konusan ERP" — nis modul paketleri.

### Mehmet Bey Metrigi
Bugunku basari orani (ilk 1 saatte anlamli is yapma): **%30-40**. Quick Win'ler sonrasi tahmin: **%70-75**. Nis modul paketi tamamlandiginda sektor bazinda **%80-90**.

---

## 2. SEKTOR SKORLARI KARSILASTIRMA TABLOSU

| # | Sektor | Inceleme | Ortalama | Persona | Guclu Yan | Zayif Yan | Satilabilirlik |
|---|--------|----------|----------|---------|-----------|-----------|----------------|
| 1 | **CNC Talaşlı** | Derin | 6.4/10 | 6.5/10 | ShopFloor, OEE, Barkod | ProductForm, Gantt | **Satilabilir** |
| 2 | **Kaynak (Savunma)** | Derin | 5.7/10 | 5.0/10 | Kalibrasyon, NCR | WPS, Sertifika expiry, NDT | Eksikli |
| 3 | **Medikal Cihaz** | Derin | 5.3/10 | 4.2/10 | Serial, FAI | UDI, Recall, ISO 14971, Sterilizasyon | **Satilamaz** |
| 4 | **Sac Metal / Lazer** | Cikarim | 5.5/10 | 5.0/10 | Barkod, Stok | Nesting, malzeme verim | Eksikli |
| 5 | **Mobilya** | Cikarim | 5.3/10 | 4.5/10 | Proje, BOM | Panel kesim, set stok, renk/olcu | Eksikli |
| 6 | **Tekstil / Konfeksiyon** | Cikarim | 4.8/10 | 4.0/10 | Siparis, Sevkiyat | Beden-renk matris, kumas tuketim | **Yetersiz** |
| 7 | **Gida / Icecek** | Cikarim | 4.5/10 | 3.8/10 | Lot, SKT | HACCP, Recall, Alerjen, Soguk zincir | **Yetersiz** |
| 8 | **Otomotiv (Tier-2)** | Cikarim | 5.8/10 | 5.2/10 | Kalite, Trace | PPAP paket, EDI, APQP | Eksikli |
| 9 | **Plastik Enjeksiyon** | Cikarim | 5.5/10 | 5.0/10 | BOM, Bakım | Kalip yonetimi, cevrim sayaci, hot runner | Eksikli |
| 10 | **Makine Imalat (MTO)** | Cikarim | 6.0/10 | 5.5/10 | Proje, BOM tree | Multi-level BOM ECO, revizyon | **Satilabilir** |
| 11 | Elektronik PCB Assembly | Cikarim | 5.2/10 | 4.8/10 | Kalite, Trace | Component lot, AOI entegrasyon | Eksikli |
| 12 | Kimya / Boya | Cikarim | 4.3/10 | 3.5/10 | Lot | Recipe, MSDS, reg. compliance | **Yetersiz** |
| 13 | Kauçuk | Cikarim | 5.0/10 | 4.5/10 | BOM | Recipe, vulkanizasyon cycle | Eksikli |
| 14 | Dokum | Cikarim | 5.2/10 | 4.5/10 | Kalite, NDT | Alacak takip, curuf, metalurji | Eksikli |
| 15 | Ambalaj | Cikarim | 5.5/10 | 5.0/10 | Stok, Baski | Buyuk rulo kesim, multi-color baski | Eksikli |
| 16 | Tarim Makinalari | Cikarim | 6.0/10 | 5.5/10 | Proje, Servis | Saha servis, garanti trace | Orta |
| 17 | Enerji / Panel Uretici | Cikarim | 5.7/10 | 5.2/10 | Proje | Panel test, sertifika | Eksikli |
| 18 | Savunma Elektronik | Cikarim | 5.5/10 | 5.0/10 | Trace, FAI | ITAR/ihracat, config mgmt | Eksikli |

**Ortalama: 5.4/10** — Urun bu haliyle "orta-iyi" ama hicbir sektorde "wow" degil.

---

## 3. ORTAK PROBLEMLER (Tum sektorlerde tekrarliyor)

### 3.1 ProductForm — "Wall of Text" Sendromu
**Gorulen Her Sektorde:** CNC, Kaynak, Medikal, Mobilya, Gida, Otomotiv — herkes ayni sikayetle geliyor: "30+ alan, section'lar, tree view, jargon."
- **Sureler:** Ilk urun ekleme 8-12 dakika (olmasi gereken: < 1 dakika).
- **Etki:** Mehmet Bey'ler trial'da kaciyor.
- **Cozum:** Zorunlu 3 alan + "Detaylari sonra ekleyin" davranisi. **3 saat is, %40 retention artisi.**

### 3.2 CustomerForm — Tab Chaos
**Her sektorde:** 6 tab, vergi no validation katı, 15+ alan. Ilk temas noktasinda korkutucu.
**Cozum:** Minimal insert (3 alan), tab'lar Update'te acilir. **2 saat is.**

### 3.3 Tooltip/Glossary %60 Coverage
**Eksik terimler her sektorde farkli:**
- CNC: OEE, MTBF, FAI, NCR, CAPA, SPC, Cpk
- Kaynak: WPS, WPQR, heat input, interpass, PWHT
- Medikal: UDI-DI, UDI-PI, MDR, FSCA, SAL, IQ/OQ/PQ
- Gida: HACCP, CCP, MRL, alerjen
- Otomotiv: PPAP, APQP, IATF, FMEA, 8D
- Tekstil: shrinkage, GSM, tex
- Plastik: sot, cevrim, hot runner
- Mobilya: CNC nesting, panel optim, set, kaplama

**Cozum:** `GlossaryTooltip` componenti + sektor bazli `glossary.json` dosyasi. **Her sektore 2-4 saat is, 50+ terim/sektor.**

### 3.4 Empty State Tutarsiz
Bazi sayfalarda emoji, bazilarinda icon, bazilarinda sade metin. **Cozum:** Tek `EmptyState` component. 4 saat.

### 3.5 Onay Dialoglari Eksik
Stock transfer, invoice paid-mark, production cancel — direkt calisiyor. **Cozum:** `Popconfirm` wrapper pattern. 2 saat.

### 3.6 Multi-Rol Dashboard Yok
Butun personalar ExecutiveDashboard goruyor. **Cozum:** Role-based home routing (OperatorDashboard, FinanceDashboard, QualityDashboard, WarehouseDashboard). 2 gun.

### 3.7 Mobile/Tablet Form Rendering Zayif
ProductForm, ProductionGantt, InvoiceList tablette bozuluyor. **Cozum:** Responsive grid refactor. 3-5 gun.

### 3.8 Keyboard Shortcuts Minimal
Sadece InvoiceForm'da Enter-nav var. **Cozum:** Global Ctrl+S, Esc, Alt+N, Alt+F standardi. 1 gun.

### 3.9 Dashboard Drill-Down Yok
"Top Musteri" pie'a tiklayinca detay yok. **Cozum:** onClick → filtered list. 2 saat.

### 3.10 Onboarding Demo Data Butonu Gizli
"Demo Yukle" butonu zayif konumlanmis. **Cozum:** Hero placement. 30 dakika.

---

## 4. SEKTOR-SPESIFIK PROBLEMLER (Her sektorde 1-3 kritik gap)

### Sac Metal / Lazer Kesim
- **Nesting / Kesim Optimizasyonu Yok:** Sac plakadan max verim almak icin 3rd-party (DeepNest, SigmaNEST) entegrasyonu yok.
- **Malzeme Verim (Scrap %) Takibi Yok**
- **Plakalik izleme eksik**

### Mobilya
- **Panel Kesim Listesi Yok** — MDF/sunta kesim optim yok.
- **Set Bazli Stok Yok** — "Mutfak seti 12 parca" tek BOM'da yonetilemiyor.
- **Renk + Olcu Varyant Matrisi Yok**
- **Kaplama/boyama operasyonu ozel alanlari yok**

### Tekstil / Konfeksiyon
- **Beden-Renk-Model Matris Varyant Yok** — Urun * beden * renk = 50-200 SKU manuel.
- **Kumas Tuketim Hesabi (markerle) Yok**
- **Kesim Party yonetimi yok**
- **Dikim serit/operasyon dengelemesi yok**

### Gida / Icecek
- **HACCP CCP Kayit Modulu Yok** — Kritik kontrol noktasi sicaklik/sure kayitlari yok.
- **Recall Workflow Yok** (medikalle ayni problem — ama Gida'da daha sik!)
- **Alerjen Izleme Yok**
- **Soguk Zincir Tracking Yok**
- **Raf Omru / SKT Dashboard Zayif**

### Otomotiv (Tier-2)
- **PPAP Paket Otomasyonu Yok** — 18 element document bundle hazirlanmiyor.
- **APQP Phase Gate Yonetimi Yok**
- **EDI Musteri Entegrasyonu Yok** (VDA/ANSI X12 stub bile yok)
- **IATF 16949 iliskili dokumanter gereklilikler yariyariya**

### Plastik Enjeksiyon
- **Kalip Yonetimi Modulu Yok** — Kalip omrunde cevrim sayaci, bakim plani, lokasyon takibi yok.
- **Hot Runner Parametre Takibi Yok**
- **Cevrim Suresi Histogrami Yok**
- **Master Batch / Renklendirici Recipe Yok**

### Makine Imalati (MTO / Proje)
- **Multi-Level BOM (6-10 seviye) Zayif** — Tree view var ama ECO (engineering change order) yok.
- **Revizyon Yonetimi (Rev A→B→C) Eksik**
- **Proje Milestone Gantt yok** — ProductionGantt operasyonel, proje duzeyinde yok.
- **As-built vs as-designed fark izleme yok**

### Kaynak (detay icin UX-AUDIT-KAYNAK-MEDIKAL.md)
- WPS/WPQR modulu
- Kaynakci sertifika expiry
- Heat input otomatik hesap
- NDT template
- Interpass temp

### Medikal (detay icin UX-AUDIT-KAYNAK-MEDIKAL.md)
- UDI (DI + PI + EUDAMED)
- Sterilizasyon IQ/OQ/PQ
- ISO 14971 risk
- Recall / FSCA
- Biyouyumluluk test

### CNC (detay icin CNC-USER-JOURNEY-UX-AUDIT.md)
- Tool life management
- SPC real-time dashboard
- Probing/terminal olcum integration

### Elektronik PCB
- **Component Lot & Date Code Izleme Eksik**
- **AOI/SPI/ICT sonuc entegrasyonu yok**
- **BOM match to CAD (centroid file) yok**

### Kimya / Boya
- **Recipe Yonetimi Yok** (formula, yield, reaction)
- **MSDS/SDS Yonetimi Yok**
- **REACH/CLP Regulatory Takip Yok**

### Dokum
- **Curuf / alacak takip yok**
- **Metalurji sertifika (kimyasal analiz) upload yok**
- **Firin cycle (sicaklik profili) kayit yok**

### Ambalaj
- **Buyuk rulo→kesim optim yok**
- **Multi-color baski tabaka yonetimi yok**

### Savunma Elektronik
- **ITAR/ihracat kontrol yok**
- **Configuration management baseline yok**

---

## 5. PRIORITY MATRIX (Etki x Efor)

### 🔥 HIGH IMPACT + LOW EFFORT → **HEMEN YAP**
1. ProductForm minimal mode (3 saat) — tum sektor
2. CustomerForm minimal mode (2 saat) — tum sektor
3. Stock transfer validation (1 saat) — tum sektor
4. Sertifika expiry uyarilari (TrainingManagement) (1 gun) — Kaynak, Medikal, CNC
5. GlossaryTooltip 50 terim (2 saat) — tum sektor
6. Dashboard drill-down (2 saat) — tum sektor
7. Role-based home routing (2 gun) — tum sektor
8. Onboarding demo data prominent (30 dk) — tum sektor
9. UDI field in ProductForm (2 gun) — Medikal
10. Heat input calculator ShopFloor (1 gun) — Kaynak
11. Popconfirm wrapper pattern (2 saat) — tum sektor
12. Empty State unification (4 saat) — tum sektor
13. Keyboard shortcuts global (1 gun) — tum sektor

### 🟡 HIGH IMPACT + HIGH EFFORT → **PLANLA / SPRINT**
14. Recall / FSCA workflow (10-14 gun) — Medikal, Gida, Otomotiv
15. WPS/WPQR modulu (5-8 gun) — Kaynak, Dokum
16. PPAP paket otomasyonu (6-10 gun) — Otomotiv, Savunma
17. HACCP + CCP modulu (8-12 gun) — Gida
18. Nesting entegrasyon (DeepNest stub) (4-6 gun) — Sac Metal, Mobilya
19. Varyant matris (beden-renk-olcu) (6-8 gun) — Tekstil, Mobilya
20. ISO 14971 risk management (5-7 gun) — Medikal
21. Kalip yonetimi modulu (6-8 gun) — Plastik, Dokum
22. Multi-level BOM ECO + Revizyon (8-10 gun) — Makine, Otomotiv, Elektronik
23. Recipe yonetimi modulu (6-8 gun) — Kimya, Gida, Kaucuk
24. Sterilizasyon IQ/OQ/PQ (6-8 gun) — Medikal
25. Tool life management (4-5 gun) — CNC, Plastik
26. SPC real-time dashboard (4-6 gun) — CNC, Otomotiv, Medikal
27. ProductionGantt drag-drop v2 (5-7 gun) — tum sektor
28. MSDS/SDS yonetimi (3-5 gun) — Kimya, Boya, Kaucuk
29. Persona-bazli dashboardlar (5 farkli) (5-7 gun) — tum sektor
30. LabelDesign modulu (4-6 gun) — Medikal, Gida, Ambalaj
31. EDI entegrasyon stub (VDA/X12) (8-10 gun) — Otomotiv

### 🟢 LOW IMPACT + LOW EFFORT → **BOSLUK DOLDURMA**
32. Subdomain explanation tooltip (15 dk)
33. Password complexity esnetme (30 dk)
34. MachinesForm setup ucret tooltip (15 dk)
35. Purge O2 custom field (30 dk)
36. Interpass temp required (30 dk)
37. Fason heat treatment parametre alani (2 gun)

### ⚪ LOW IMPACT + HIGH EFFORT → **ŞIMDILIK YAPMA**
- ITAR export control modulu (5 gun, cok az musteri)
- Weld map gorsel cizim modulu (8 gun, manual PDF upload yeterli)
- Savunma elektronik configuration baseline (6 gun, niş)

---

## 6. KONSOLIDE QUICK WIN BACKLOG (30+ item önceliklendirilmiş)

| # | Oncelik | Is | Sure | Etkilenen Sektor | Mutluluk Artisi |
|---|---------|-----|------|------------------|-----------------|
| 1 | P0 | ProductForm minimal mode | 3 saat | Tum | +2.0 |
| 2 | P0 | CustomerForm minimal mode | 2 saat | Tum | +1.5 |
| 3 | P0 | Stock transfer validation | 1 saat | Tum | +1.0 |
| 4 | P0 | Vergi no VKN/TCKN aciklama | 30 dk | Tum | +0.5 |
| 5 | P0 | Sertifika expiry uyari (TrainingMgmt) | 1 gun | Kaynak/Medikal/CNC | +2.0 |
| 6 | P0 | UDI field ProductForm | 2 gun | Medikal | +3.0 |
| 7 | P0 | Heat input calculator | 1 gun | Kaynak | +2.0 |
| 8 | P0 | Role-based home routing | 2 gun | Tum | +1.5 |
| 9 | P0 | Recall trigger modal (NCR->Recall) | 3 gun | Medikal/Gida/Otomotiv | +2.5 |
| 10 | P0 | HACCP CCP kayit form | 3 gun | Gida | +2.5 |
| 11 | P1 | GlossaryTooltip 50 terim | 2 saat | Tum | +1.0 |
| 12 | P1 | Dashboard drill-down | 2 saat | Tum | +0.5 |
| 13 | P1 | Popconfirm wrapper | 2 saat | Tum | +0.5 |
| 14 | P1 | Empty State standart | 4 saat | Tum | +0.5 |
| 15 | P1 | Onboarding demo prominent | 30 dk | Tum | +1.0 |
| 16 | P1 | Demo data per sektor | 1 gun | Tum | +1.5 |
| 17 | P1 | ShopFloor "?" help button | 30 dk | Tum | +0.5 |
| 18 | P1 | Gantt cakisma uyarisi | 1 gun | Tum | +1.0 |
| 19 | P1 | PO-Fatura matching tooltip | 2 saat | Tum | +0.5 |
| 20 | P1 | NDT inspection template | 3 gun | Kaynak/Dokum | +2.0 |
| 21 | P1 | WPS minimal template (DocCtrl) | 3 gun | Kaynak | +2.5 |
| 22 | P1 | UDI-PI auto-generate production | 2 gun | Medikal | +2.5 |
| 23 | P1 | Lazer markalama UDI beslemesi | 1 gun | Medikal | +2.0 |
| 24 | P1 | SerialNumber genealogy tree | 4 gun | Medikal/Gida/Otomotiv | +2.5 |
| 25 | P1 | Sterilizasyon cycle data upload | 2 gun | Medikal | +2.0 |
| 26 | P1 | Temiz oda custom field | 1 gun | Medikal | +1.0 |
| 27 | P1 | Interpass temp required | 30 dk | Kaynak | +0.5 |
| 28 | P1 | Purge O2 custom field | 30 dk | Kaynak | +0.5 |
| 29 | P1 | Fason heat treatment params | 2 gun | Kaynak | +1.0 |
| 30 | P1 | ISO 14971 hazard template | 3 gun | Medikal | +2.0 |
| 31 | P1 | Pasivizasyon parametre template | 1 gun | Medikal | +1.0 |
| 32 | P2 | Keyboard shortcuts global | 1 gun | Tum | +0.5 |
| 33 | P2 | Alerjen field ProductForm | 30 dk | Gida | +1.0 |
| 34 | P2 | SKT dashboard widget | 2 gun | Gida | +1.5 |
| 35 | P2 | Password complexity esnet | 30 dk | Tum | +0.5 |
| 36 | P2 | MaterialCert biyouyumluluk alani | 1 gun | Medikal | +1.0 |
| 37 | P2 | FAI AS9102 pre-fill | 2 gun | Kaynak/Savunma | +1.0 |
| 38 | P2 | Weld map PDF upload | 1 gun | Kaynak | +0.5 |
| 39 | P2 | Bundle size / lazy loading | 3 gun | Tum | +0.5 |
| 40 | P2 | Multi-select bulk operations | 2 gun | Tum | +0.5 |

**Toplam tahmini efor: ~55-65 gun** (2-3 gelistirici, 5-6 hafta).
**Toplam mutluluk kazanimi tahmini: +45 puan dağıtık** — ortalama sektor skoru **5.4 → 7.2**.

---

## 7. STRATEJIK BUYUK ISLER (5-10 buyuk refactor)

### A. Persona-Bazli Dashboard Sistemi
- 5-6 role-specific dashboard (Executive, Finance, Warehouse, Quality, Maintenance, Operator)
- Role-based home routing
- Her dashboard icin sektor bazli widget havuzu
- **Efor: 2-3 hafta, 1 gelistirici.**

### B. ProductForm / CustomerForm Smart Mode
- 3 mod: Hizli / Standart / Detayli
- Sektor profiline gore default mod
- Wizard tarzi akis
- **Efor: 1-1.5 hafta.**

### C. Workflow Engine UI
- Visual flow editor (NCR → Root Cause → CAPA → Verify → Close, Recall flow, PPAP flow)
- Otomasyon kurallari GUI: "Tolerance disi ölçüm → Auto NCR → Email quality mgr"
- **Efor: 3-4 hafta.**

### D. ProductionGantt v2 (Drag-Drop)
- react-dnd + gantt-task-react veya benzeri lib
- Cakisma uyarisi, kapasitete senkron
- Mobile/tablet uyumu
- **Efor: 1.5-2 hafta.**

### E. SectorModulePack Mimarisi
- Her sektor icin "feature flag + modul bundle" yapisi
- `sector=medikal` → UDI + Recall + Sterilizasyon modulleri aktif
- `sector=gida` → HACCP + Alerjen + SKT modulleri aktif
- Lisanslama acisindan da onemli: "Medikal Paketi +500 USD/ay"
- **Efor: 1 hafta altyapi + her sektor icin ayri sprint.**

### F. Document Control Template Library
- WPS, WPQR, PPAP, MDR, HACCP, FMEA-14971 template yapisi
- Document versioning, approval workflow aktif kullanim
- **Efor: 2-3 hafta.**

### G. Serial/Lot Genealogy Tree View
- Hammadde → Ara urun → Final → Sevkiyat → Musteri → (medikalde) Hasta UDI-PI
- Visual tree, click-to-drill
- Recall trigger noktasi
- **Efor: 1.5-2 hafta.**

### H. EDI / Integration Hub
- Otomotiv musterileri icin VDA/ANSI X12
- E-Fatura/GIB full entegrasyon
- Bank MT940 (BankReconciliation mevcut ama format desteği sinirli)
- **Efor: 4-6 hafta.**

### I. Mobile-First Refactor (ShopFloor disindaki ekranlar)
- Tablet operatör kullanim senaryolari
- ProductForm, OperationInspection, StockCount tablette tam calisir
- **Efor: 3-4 hafta.**

### J. Help / Onboarding Ecosystem
- GlossaryTooltip component
- Joyride tour her ana ekrana
- Contextual help panel (sag kenar)
- Video thumbnail library
- **Efor: 2 hafta.**

---

## 8. 18 SEKTOR x QUICK WIN MATRISI

Hangi quick win hangi sektorü kapsar?

| # | Quick Win | CNC | Kaynak | Medikal | Sac | Mob | Tek | Gida | Oto | Plas | Mak | PCB | Kim | Kau | Dok | Amb | Tar | Enr | Sav |
|---|-----------|-----|--------|---------|-----|-----|-----|------|-----|------|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| 1 | ProductForm minimal | X | X | X | X | X | X | X | X | X | X | X | X | X | X | X | X | X | X |
| 2 | CustomerForm minimal | X | X | X | X | X | X | X | X | X | X | X | X | X | X | X | X | X | X |
| 5 | Sertifika expiry | X | X | X | - | - | - | X | X | - | X | X | X | - | X | - | - | X | X |
| 6 | UDI field | - | - | X | - | - | - | - | - | - | - | - | - | - | - | - | - | - | - |
| 7 | Heat input calc | - | X | - | - | - | - | - | - | - | - | - | - | - | X | - | - | - | - |
| 9 | Recall workflow | - | - | X | - | - | - | X | X | - | - | - | X | - | - | - | - | - | X |
| 10 | HACCP CCP | - | - | - | - | - | - | X | - | - | - | - | - | - | - | - | - | - | - |
| 11 | GlossaryTooltip | X | X | X | X | X | X | X | X | X | X | X | X | X | X | X | X | X | X |
| 20 | NDT template | - | X | - | - | - | - | - | - | - | X | - | - | - | X | - | - | - | - |
| 21 | WPS template | - | X | - | - | - | - | - | - | - | - | - | - | - | X | - | - | - | - |
| 22-23 | UDI PI + Lazer | - | - | X | - | - | - | - | - | - | - | - | - | - | - | - | - | - | - |
| 24 | Genealogy tree | X | X | X | - | - | X | X | X | - | X | X | - | - | - | - | X | - | X |
| 25 | Sterilizasyon cycle | - | - | X | - | - | - | X | - | - | - | - | - | - | - | - | - | - | - |
| 30 | ISO 14971 hazard | - | - | X | - | - | - | - | - | - | - | - | - | - | - | - | - | - | - |
| 33 | Alerjen field | - | - | - | - | - | - | X | - | - | - | - | - | - | - | - | - | - | - |
| 34 | SKT dashboard | - | - | X | - | - | - | X | - | - | - | - | X | - | - | X | - | - | - |

**Okuma:** ProductForm/CustomerForm minimal ve Glossary **tum sektorlere** catchment — oncelik bu.
**Sektore ozel killer:** UDI (Medikal tek basina), HACCP (Gida tek basina), WPS (Kaynak+Dokum), PPAP (Otomotiv).

---

## 9. MEHMET BEY METRIGI — Sektor Bazli Ilk 1 Saat Basari Orani

**Senaryo:** Kullanici (Mehmet Bey ismiyle anacagimiz "non-tech KOBI sahibi") Quvex'e register olur, kendi sektor profiline uygun demo data yukler, **1 saat icinde** anlamli bir is yapmaya calisir (1 musteri, 1 urun, 1 teklif, 1 is emri, 1 ShopFloor scan).

### Olcum: Su an vs. Quick Win sonrasi

| Sektor | Bugunku Basari Orani | Quick Win Sonrasi | Nis Modul Sonrasi |
|--------|----------------------|-------------------|---------------------|
| CNC Talaşlı | %40 | %75 | %85 |
| Kaynak Savunma | %30 | %65 | %85 |
| Medikal Cihaz | %20 | %55 | %85 |
| Sac Metal | %40 | %70 | %80 |
| Mobilya | %35 | %65 | %80 |
| Tekstil | %25 | %60 | %80 |
| Gida | %20 | %50 | %80 |
| Otomotiv | %40 | %70 | %85 |
| Plastik | %40 | %70 | %80 |
| Makine Imalat | %45 | %75 | %85 |
| PCB | %35 | %65 | %80 |
| Kimya | %20 | %50 | %75 |
| Kaucuk | %35 | %65 | %75 |
| Dokum | %35 | %65 | %80 |
| Ambalaj | %40 | %65 | %75 |
| Tarim Mak. | %45 | %70 | %80 |
| Enerji | %40 | %70 | %80 |
| Savunma Elekt. | %35 | %60 | %80 |
| **Ortalama** | **%34** | **%65** | **%81** |

### 5 / 30 / 60 Dakika Kesitleri

**Ilk 5 Dakika (bugun):**
- Register + Login OK
- Dashboard goruntuleme OK
- "Simdi ne yapacagim?" — **belirsiz**
- Demo data yukleme butonu gizli → %40 kullanici kaciriyor

**Ilk 5 Dakika (Quick Win sonrasi):**
- Register → Sektor secimi (yeni eklendi)
- Login → Onboarding Wizard otomatik
- "Demo Data Yukle" hero buton → Bir tiklama ile **sektor demosu** hazir
- Persona-bazli dashboard acilir
- **Basari orani: %85**

**Ilk 30 Dakika (bugun):**
- Onboarding wizard kismen tamam
- Ilk musteri eklemek: CustomerForm 6 tab → Mehmet Bey panik
- Ilk urun: ProductForm 30+ alan → pes ediyor
- **Basari orani: %30**

**Ilk 30 Dakika (Quick Win sonrasi):**
- Minimal form (3 alan) ile 30 saniyede musteri + urun eklenir
- Glossary tooltip ile jargon anlasilir
- **Basari orani: %70**

**Ilk 1 Saat (bugun):**
- Teklif → Siparis → Is emri manuel ama zorlu
- ShopFloor scan icin sifre/rol karmasasi
- Ilk rapor ureten kullanici orani: **%30-35**

**Ilk 1 Saat (Quick Win sonrasi):**
- Role-based routing ile her kullanici kendi ekrana direkt gidiyor
- Dashboard drill-down ile anlik feedback
- ShopFloor "?" yardim butonu
- **Basari orani: %70-75**

**Ilk 1 Saat (Nis modul sonrasi, her sektorde):**
- Sektor terminolojisi tam (UDI gorundugu yerde anlamli)
- Sektor demo verisi gercekci senaryolarla
- Sektor-spesifik is akislari (recall, WPS, HACCP) calisir
- **Basari orani: %80-90**

---

## 10. SONUC VE TAVSIYE

### Quvex'in Bugunku Durumu
- Temel altyapi **guclu** (155 controller, 220+ view, 1223 API + 686 UI test)
- 18 sektor **test senaryosuyla** pazar hazirligi yapilmis
- Guvenlik, multi-tenancy, i18n production-ready
- Ama **UX tarafinda "son %30"** eksik — ve bu %30 trial donusum oranini belirliyor

### Stratejik Yol Haritasi

**Sprint "Quick Win" (2-3 hafta, 2 gelistirici)**
- 30 item quick win backlogundan ilk 25 tanesi
- Ortalama sektor skoru: 5.4 → 7.0
- Trial donusum: %34 → %65

**Sprint "Nis Modul Paketleri" (Her sektor 2-3 hafta)**
- Sira: Medikal (MDR pazar fiyati) → Gida (KOBI sayisi) → Otomotiv (Tier-2 buyuk fiyat) → Kaynak (savunma nisi)
- Her sektore 1 "killer feature"
- Paket fiyatlandirmasi: +500-1500 USD/ay marji

**Sprint "Buyuk Refactor" (4-6 hafta, kademeli)**
- Persona-bazli dashboardlar
- ProductionGantt v2
- Workflow engine UI

### Pazarlama Mesaji
**"Quvex — kendi sektorunuzun diline konusan ERP"**

Mehmet Bey ilk 5 dakikada kendi sektorunu goruyor, 30 dakikada ilk urununu ekliyor, 1 saatte ilk is emrini olusturuyor. Denetciler UDI/WPS/HACCP'yi gorduklerinde Quvex'i onayliyor.

**Bugun %34, yarin %81.**

---

## EKLER

- Detay raporlar:
  - `CNC-USER-JOURNEY-UX-AUDIT.md` (referans + detayli CNC)
  - `UX-AUDIT-KAYNAK-MEDIKAL.md` (kaynak + medikal detayli)
- E2E senaryo dosyalari: `quvex-docs/tests/*.md` (18 sektor)
- Kod tabani: `smallFactoryUI/src/views/modul/*`

**Bu doküman, Quvex urun stratejisi icin "tek sayfa harita" olarak tutulabilir. 6 ayda bir yenilenmeli.**
