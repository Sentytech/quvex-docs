# Quvex ERP — Bakim Modulu Hata & Iyilestirme Raporu

> **Olusturma:** 2026-03-14
> **Durum:** Analiz tamamlandi

---

## OZET

| Kategori | Kritik | Orta | Dusuk | Toplam |
|----------|--------|------|-------|--------|
| Bug | 2 | 4 | — | 6 |
| UX/Feature | — | — | 5 | 5 |
| **Toplam** | **2** | **4** | **5** | **11** |

## HATALAR

| # | Siddet | Sorun | Dosya |
|---|--------|-------|-------|
| BAK-001 | KRITIK | CompleteWorkOrder: UI PUT gonderiyor, API POST bekliyor → 405 | MaintenanceController + maintenanceService.js |
| BAK-002 | KRITIK | WorkOrder StartDate NULL kalıyor | MaintenanceService.cs |
| BAK-003 | ORTA | OEE Service'de AsNoTracking yok | OeeService.cs |
| BAK-004 | ORTA | ResolvedDate otomatik set — explicit alan olmali | MaintenanceService.cs |
| BAK-005 | ORTA | OEE NULL MachineId filtreleme sorunu | OeeService.cs |
| BAK-006 | ORTA | MRP null reference riski (ReorderPoint/MinStock) | AdvancedMrpService.cs |

## UX/FEATURE

| # | Sorun |
|---|-------|
| BAK-007 | Bakim plani takvim gorunumu yok |
| BAK-008 | Makine durumu badge yok |
| BAK-009 | Bildirim entegrasyonu yok |
| BAK-010 | OEE planlı saat hardcoded 8h/gun |
| BAK-011 | Modal responsive tasarim |
