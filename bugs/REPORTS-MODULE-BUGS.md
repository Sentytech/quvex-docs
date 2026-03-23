# Quvex ERP — Raporlar Modulu Hata & Iyilestirme Raporu

> **Olusturma:** 2026-03-14
> **Durum:** Analiz tamamlandi — Sprint baslatilmayi bekliyor

---

## OZET

| Kategori | Kritik | Yuksek | Orta | Dusuk | Toplam |
|----------|--------|--------|------|-------|--------|
| Bug | 3 | 5 | 6 | 3 | 17 |
| UX | — | 2 | 4 | 3 | 9 |
| Feature | — | 1 | 2 | 3 | 6 |
| **Toplam** | **3** | **8** | **12** | **9** | **32** |

---

## A — KRITIK BUGLAR

| # | Sorun | Dosya |
|---|-------|-------|
| RAP-001 | SupplierPerformance: Invoice ile Supplier karistiriliyor (CustomerId != SupplierId) | ReportService.cs:266-306 |
| RAP-002 | QualityScore formulu negatif olabilir (ncrCount*10 > 100 durumunda) | ReportService.cs:585 |
| RAP-003 | InspectionCost aylik trend'de hardcoded 0 | ReportService.cs:631 |

## B — YUKSEK ONCELIKLI

| # | Sorun | Dosya |
|---|-------|-------|
| RAP-004 | Tarih parametresi gecisi raporlar arasinda farkli (params vs {params:{...}}) | Tum rapor sayfalari |
| RAP-005 | Bos veri mesajlari hicbir raporda yok | Tum rapor sayfalari |
| RAP-006 | NotificationBell reportService kullanmiyor — direct axios, error handling eksik | NotificationBell.js:36 |
| RAP-007 | KpiDashboard form validation eksik (name, unit, actualValue required degil) | KpiDashboard.js:31 |
| RAP-008 | api.get() 3. parametre almiyor — export blob response calismayabilir | reportService.js + api.js |

## C — ORTA ONCELIKLI

| # | Sorun | Dosya |
|---|-------|-------|
| RAP-009 | NotificationBell TotalUnread PascalCase vs API camelCase | NotificationBell.js:31 |
| RAP-010 | DynamicReportBuilder .xls dosya adi ama TSV icerigi | DynamicReportBuilder.js:114 |
| RAP-011 | DeliveryEstimation tarih filtresi destegi yok | DeliveryEstimation.js |
| RAP-012 | OfferConversion tarih parametresi cok karisik | OfferConversion.js:18-21 |
| RAP-013 | KpiDashboard loading state eksik | KpiDashboard.js |
| RAP-014 | Rework cost hesaplamasi karisik ve hata egilimli | ReportService.cs:605-606 |
| RAP-015 | Turkce label/typo hatalari (Uretim, Kullanim, Tedarikci vb) | ReportsDashboard.js |

## D — DUSUK ONCELIKLI / UX

| # | Sorun | Tip |
|---|-------|-----|
| RAP-016 | Export sadece 5 raporda var — diger 8 raporda yok | Feature |
| RAP-017 | PDF export hicbir raporda yok (sadece 2 ayri PDF endpoint) | Feature |
| RAP-018 | Drill-down/detail view hicbir raporda yok | Feature |
| RAP-019 | NCR Trend severity label'lari Ingilizce | UX |
| RAP-020 | SupplierQualityTrend coklu tedarikci karsilastirmasi yok | Feature |
| RAP-021 | NotificationBell SignalR yerine 60s polling | UX |
| RAP-022 | QualityCost kursel/yuzdelik gosterim karisik | UX |

---

## SPRINT PLANI

### Sprint RAP-1: Kritik + Yuksek (8 item)
> API mantik hatalari + parametre standardizasyonu

### Sprint RAP-2: Orta (7 item)
> UI iyilestirmeleri + validation

### Sprint RAP-3: Dusuk + Feature (9 item)
> Export genisletme + UX

---

## POZITIF BULGULAR

- 35/35 API endpoint eslesmesi dogru
- Recharts grafik kullanimi tutarli
- KPI dashboard 3 tab yapisi iyi tasarlanmis
- Dinamik rapor builder 6 template ile calisiyor
- Bildirim sistemi polling ile aktif
- Tum controller'lar YetkiDenetimi ile korunuyor
- Production/Stock/Sales hesaplamalari dogru
