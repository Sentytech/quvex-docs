# Quvex ERP — Changelog

## [2026-03-23]

### Bug Fixes
- **BUG-001:** Swagger 500 — OfferProductController.ChangeOfferProductStatus metodu [NonAction] eksikti
- **BUG-002:** DB 29 tabloda TenantId kolonu eksik — HasQueryFilter calismiyor, tum tenant sorgulari hata veriyordu
- **BUG-003:** DB NonConformanceReports tablosunda ScrapCost/ReworkCost/ReturnCost kolonlari eksik — NCR, CAPA, AdvancedQuality sayfaları 500 donuyordu
- **BUG-004:** DB CorrectiveActions tablosunda EffectivenessVerified kolonu eksik — CAPA sayfasi 500
- **BUG-005:** DB Tenants tablosunda IsDemoTenant/DemoExpiresAt/OnboardingCompleted kolonlari eksik — Manage dashboard 500
- **BUG-006:** DB ChangelogEntries tablosu eksik — Changelog sayfasi 500
- **BUG-007:** UI 18 dosyada pagination uyumsuzlugu — API paginated response donuyor, UI array bekliyor (Stok, Urun, Depo, Makine, Fatura sayfalarinda "liste yuklenemedi" hatalari)

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
