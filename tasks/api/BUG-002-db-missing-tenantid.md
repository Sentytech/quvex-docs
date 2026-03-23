# [BUG-002] DB — 29 Tabloda TenantId Kolonu Eksik

## Tur: BUG
## Durum: DONE
## Tarih: 2026-03-23
## Etki Seviyesi: KRITIK

## Sorun
Birden fazla endpoint 500 donuyordu: "column X.TenantId does not exist"
HasQueryFilter tenant izolasyonu TenantId kolonuna bagimliydi ama DB'de kolon yoktu.

Etkilenen sayfalar: HR/Attendance, Cybersecurity, ECN (ProductRevisions), ve 26 tablo daha.

## Kok Neden
EF Core model'lerine `BaseFullModel` uzerinden `TenantId` eklenmisti ancak
DB migration calistirilmamis — kolon fiziksel olarak tablolarda olusturulmamisti.

## Cozum
29 tabloya `ALTER TABLE ADD COLUMN IF NOT EXISTS "TenantId" uuid` eklendi.
3 semaya (public, tenant_rynsoft, tenant_demo) ayni islem uygulandi.

Etkilenen tablolar:
ApprovedPartSources, Attendances, AuditTrailEntries, CompetencyMatrices,
ConfigurationChanges, CustomerPropertyIncidents, DesignProjects, DesignReviews,
DesignVerifications, EmployeeShifts, Files, FodAreaChecks, KpiDefinitions,
KpiMeasurements, Menu, MenuPermission, ProductFiles, ProductRevisions,
ProductionStatusLogs, ProjectMilestones, ProjectTasks, Projects, SafetyHazards,
SecurityIncidents, SecurityPolicies, SpecialProcessOperators, SpecialProcessRecords,
SupplyChainMitigationActions, SupplyChainRisks

## Etki Analizi
- Tum tenant-scoped endpoint'ler artik dogru calisiyor
- HasQueryFilter izolasyonu aktif

## Degisen Dosyalar
| Dosya | Degisiklik |
|-------|-----------|
| DB (quvex_dev) | 29 tabloya TenantId kolonu (3 sema) |

## Test Sonucu
- 131/131 endpoint health test passed
