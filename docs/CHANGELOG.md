# Quvex ERP — Changelog

## [2026-04-05] — Savunma Sanayi Talaşlı İmalat İyileştirmeleri

### Features (8 geliştirme)
- **FEAT-003:** Operasyon Routing — WorkOrderSteps'e makine, setup/run süresi, takım, tolerans, beceri seviyesi eklendi
- **FEAT-004:** Terminal Ölçüm Girişi — Operasyon bitişinde ControlPlan'dan ölçüm noktaları, tablet-optimized modal, otomatik pass/fail
- **FEAT-005:** Maliyet Hesaplama — PartCostController + CostCalculationService (Malzeme + İşçilik + Makine + Genel Gider)
- **FEAT-006:** Malzeme Sertifikası — MaterialCertificate entity (MTR, CoC, Isıl İşlem, Kaplama, NDT), lot/muayene bağlantısı
- **FEAT-007:** Fason İş Akışı — SubcontractProcessType enum (11 tip), AT_SUPPLIER/INSPECTED status, workflow butonları, geri sayım
- **FEAT-008:** Operasyon-Muayene Bağlantısı — WorkOrderStepInspectionPoint entity, kalite gate enforcement, quality-blocked badge
- **FEAT-009:** Menü Sadeleştirme — Defense profilde rol bazlı alt profiller (Operator/Kaliteci/Yönetici)
- **FEAT-010:** Türkçeleştirme — CAPA, SPC, PPAP, FOD, OEE, MRP, ECN, FMEA → açık Türkçe etiketler

### New Entities
- `MaterialCertificate` — Malzeme sertifikası (MTR, CoC, test raporu, ısıl işlem, kaplama, NDT)
- `WorkOrderStepInspectionPoint` — Operasyon adımı ↔ kontrol planı muayene noktası bağlantısı
- `OverheadConfig` — Genel gider yapılandırması (yüzde bazlı)
- `SubcontractProcessType` — Fason proses tipi enum (11 değer)

### New Controllers & Services
- `MaterialCertificateController` — CRUD + by-lot + by-inspection
- `PartCostController` — calculate, estimate, overhead CRUD
- `CostCalculationService` — Malzeme + İşçilik + Makine + Genel gider hesaplama
- `ShopFloorController` — measurement-points, submit-measurements, approve-quality endpoints

### New UI Pages & Components
- `PartCostBreakdown.js` — Maliyet analizi sayfası (kart + pasta grafik + tahmin modu)
- `materialCertificateService.js` — API service
- `partCostService.js` — API service
- ShopFloorTerminal: Ölçüm modal (büyük inputlar, gerçek zamanlı tolerans kontrolü)
- SubcontractOrderList: Status workflow butonları, ProcessType dropdown, geri sayım badge
- InspectionList: Sertifika drawer/modal
- WorkOrderStepsForm: 7 yeni alan (makine, süre, takım, tolerans, beceri)
- MachinesForm: Saat ücreti alanları

### Migration
- `DefenseImprovements` (2026-04-04)

### Commits
- API: `a329129` (25 dosya, +16,008 satır)
- UI: `8456d26` (17 dosya, +1,781 satır)

---

## [2026-03-23]

### Bug Fixes
- **BUG-001:** Swagger 500 — OfferProductController.ChangeOfferProductStatus metodu [NonAction] eksikti
- **BUG-002:** DB 29 tabloda TenantId kolonu eksik — HasQueryFilter calismiyor, tum tenant sorgulari hata veriyordu
- **BUG-003:** DB NonConformanceReports tablosunda ScrapCost/ReworkCost/ReturnCost kolonlari eksik — NCR, CAPA, AdvancedQuality sayfaları 500 donuyordu
- **BUG-004:** DB CorrectiveActions tablosunda EffectivenessVerified kolonu eksik — CAPA sayfasi 500
- **BUG-005:** DB Tenants tablosunda IsDemoTenant/DemoExpiresAt/OnboardingCompleted kolonlari eksik — Manage dashboard 500
- **BUG-006:** DB ChangelogEntries tablosu eksik — Changelog sayfasi 500
- **BUG-007:** UI 22 dosyada pagination uyumsuzlugu — API paginated response donuyor, UI array bekliyor (Stok, Urun, Depo, Makine, Fatura, Ayarlar sayfalarinda "liste yuklenemedi" ve "rawData.some is not a function" hatalari)
- **BUG-008:** Changelog/latest bos tabloda 404 donuyordu — Ok(null) ile degistirildi
- **BUG-009:** Dashboard'da /WorkOrder ve /Machine 404 — dogru isimler /WorkOrderLogs ve /Machines

### Features
- **FEAT-001:** E2E API endpoint health check test altyapisi (131 GET endpoint, Playwright)
- **FEAT-002:** API-UI endpoint haritasi dokumani (758 endpoint kayit)

### Infrastructure
- **INFRA-001:** E2E test klasor yapisini yeniden organize et (api/, auth/, crud/, screens/, quality/, core/)
- **INFRA-002:** smallFactory merkez hub kurulumu (analysis, bugs, docs, roadmap, sprints, tasks, tests)
- **INFRA-003:** CLAUDE.md merkez kurallar dokumani olusturuldu
- **INFRA-004:** Admin email degisikligi: admin@asya.com → admin@quvex.com

## [2026-03-22]

### Previous State
- 1128 API tests passing, 601 UI tests passing
- 7 completed phases (Faz 1-7)
- Multi-tenancy, AS9100, security hardening complete
