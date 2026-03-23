# Quvex ERP — Kapsamli Yol Haritasi
> Tarih: 2026-03-20 | 6 Analiz Birlestirildi

---

## OZET TABLO

| Analiz | Critical | High | Medium | Low | Toplam |
|--------|----------|------|--------|-----|--------|
| Backend Guvenlik | 0 | 1 | 5 | 0 | 6 |
| Frontend Guvenlik | 2 | 4 | 4 | 2 | 12 |
| Backend Performans | 4 | 5 | 8 | 3 | 20 |
| Frontend Performans | 2 | 4 | 12 | 1 | 19 |
| Backend Mimari | 3 | 3 | 10 | 5 | 21 |
| Tenant Dashboard | - | - | - | - | 35 widget/ozellik |
| **TOPLAM** | **11** | **17** | **39** | **11** | **78+ bulgu** |

---

## FAZ A — Acil Duzeltmeler (1-2 Gun)

### A1: Backend Performans — Quick Wins
| # | Dosya | Sorun | Fix |
|---|-------|-------|-----|
| A1.1 | AutoPurchaseService.cs:77 | SaveChangesAsync foreach icinde — N kayit = N DB roundtrip | Loop disina tasi |
| A1.2 | StockRequestsController.cs:73 | .ToList() sync, .FirstOrDefault() sync | .ToListAsync() + .FirstOrDefaultAsync() |
| A1.3 | PurchaseOrderController.cs:114,129 | .Count() sync cagrilar | .CountAsync() |
| A1.4 | ChartController.cs:65 | ToList() sonra Select() — tum tabloyu memory'ye yukluyor | .ToLookup() kullan |

### A2: Frontend Performans — Quick Wins
| # | Dosya | Sorun | Fix |
|---|-------|-------|-----|
| A2.1 | Home.js:899,945,1104 | Array index key={idx} — gereksiz re-render | Unique ID kullan (order.id, item.id) |
| A2.2 | Product.js:247, Purchase.js:129 | Search input debounce yok — her tussa API call | 300ms debounce ekle |
| A2.3 | Home.js:662-709 | Chart options her render'da yeniden olusturuluyor | useMemo ile sar |
| A2.4 | Home.js:456-472 | 16 ayri useState hook — fragmentli state | 2-3 state object'e birlestir |
| A2.5 | Router.js:138 | Suspense fallback={null} — bos ekran | LoadingSpinner ekle |

### A3: Frontend Guvenlik — Kritik
| # | Dosya | Sorun | Fix |
|---|-------|-------|-----|
| A3.1 | useSignalR.js:13 | localStorage fallback token icin — XSS riski | Sadece sessionStorage kullan |
| A3.2 | BarcodeOperations.js:75 | dangerouslySetInnerHTML SVG — XSS | DOMPurify ile sanitize et |
| A3.3 | BarcodeOperations.js:176, CustomerStatement.js:108 | innerHTML print window'da — XSS | textContent veya sanitize kullan |

---

## FAZ B — Veritabani & Mimari (1 Hafta)

### B1: Eksik Indeksler (195+ FK)
| # | Tablo | Kolon | Oncelik |
|---|-------|-------|---------|
| B1.1 | Productions | SalesId, ProductId, ParentId | CRITICAL |
| B1.2 | Sales | OfferProductId, ProductionId | CRITICAL |
| B1.3 | StockRequests | ProductId, Status | HIGH |
| B1.4 | PurchaseOrder | SupplierId, Status | HIGH |
| B1.5 | SerialNumber | ProductionId, ProductId | HIGH |
| B1.6 | Invoice | CustomerId, Status | HIGH |
| B1.7 | OfferProducts | OfferId, ProductId | MEDIUM |
| B1.8 | WorkOrderSteps | Code (GroupBy icin) | MEDIUM |
| B1.9 | Customer | TaxId, Name | MEDIUM |
| B1.10 | Product | ProductNumber (unique per tenant) | MEDIUM |

### B2: Multi-Tenant Query Filter
| # | Entity | Sorun | Fix |
|---|--------|-------|-----|
| B2.1 | Customer | HasQueryFilter yok — tenant izolasyonu eksik | TenantId filter ekle |
| B2.2 | Product | HasQueryFilter yok | TenantId filter ekle |
| B2.3 | Sales, Offer, Invoice | HasQueryFilter yok | TenantId filter ekle |
| B2.4 | Production, StockRequest | HasQueryFilter yok | TenantId filter ekle |

### B3: Mimari Refactoring
| # | Sorun | Fix | Efor |
|---|-------|-----|------|
| B3.1 | Controller→Controller injection (Production→Sales) | Service layer'a tasi | M |
| B3.2 | 46 controller direkt DbContext kullaniyor | Service/Repository uzerinden eris | L |
| B3.3 | 4 DTO entity DbSet olarak tanimli | Query Object pattern'e gec | M |
| B3.4 | GetListRecursively N+1 sorunu | Recursive CTE veya tek sorgu | M |

---

## FAZ C — Backend Guvenlik & Performans (1 Hafta)

### C1: Guvenlik
| # | Dosya | Sorun | Fix |
|---|-------|-------|-----|
| C1.1 | YetkiDenetimi.cs | IP validasyonu yok — token replay riski | Token IP kontrolu ekle |
| C1.2 | AccountController.cs:437 | Console.WriteLine(ex.Message) — hassas veri | _logger.LogError() kullan |
| C1.3 | AccountController.cs:264 | GetAllAsync — pagination yok, tum kullanicilari doner | Pagination ekle |
| C1.4 | FileManagerController.cs:44 | Dosya indirmede erisim kontrolu zayif | Entity ownership dogrula |
| C1.5 | FileManagerController.cs:87 | tableName/tableId parametreleri dogrulanmiyor | Whitelist validasyon |

### C2: Caching
| # | Endpoint | TTL | Oncelik |
|---|----------|-----|---------|
| C2.1 | /api/Units (GET) | 1 saat | HIGH |
| C2.2 | /api/Autocomplete/* | 5 dakika | HIGH |
| C2.3 | /api/WorkOrderTemplates | 30 dakika | MEDIUM |
| C2.4 | /api/Machines | 15 dakika | MEDIUM |
| C2.5 | /api/Warehouses | 30 dakika | MEDIUM |
| C2.6 | Cache invalidation | Create/Update/Delete'te temizle | HIGH |

### C3: Async Duzeltmeler
| # | Dosya | Sorun | Fix |
|---|-------|-------|-----|
| C3.1 | SalesController GetListRecursively | Sync ToList + memory filtreleme | Async + DB filtreleme |
| C3.2 | ProductionController recursive | N+1 query pattern | Eager loading + CTE |
| C3.3 | FileManagerController:59 | File.ReadAllBytes — tum dosya memory'de | PhysicalFile stream |

---

## FAZ D — Frontend Performans & Guvenlik (1 Hafta)

### D1: Bundle Optimizasyonu
| # | Sorun | Fix |
|---|-------|-----|
| D1.1 | 3 chart kutuphanesi (apexcharts, recharts, chart.js) | Tek kutuphanede standartlas veya lazy load |
| D1.2 | FullCalendar 6 paket unconditional import | Lazy load calendar component |
| D1.3 | Image optimizasyon eksik | Vite image plugin + WebP |

### D2: Rendering Optimizasyonu
| # | Dosya | Fix |
|---|-------|-----|
| D2.1 | Home.js inline subcomponents (6 adet) | React.memo ile extract et |
| D2.2 | Home.js 16 useState | useReducer veya birlestir |
| D2.3 | Home.js auto-refresh her notification'da | 10sn debounce |
| D2.4 | HeatmapWidget duplicate /Chart/work-load | Context/Redux ile paylас |

### D3: Frontend Guvenlik
| # | Dosya | Fix |
|---|-------|-----|
| D3.1 | userData localStorage'da | Hassas verileri minimize et |
| D3.2 | FinalRoute permission localStorage'dan | Server-side dogrulama zorunlu |
| D3.3 | File upload client-side MIME check eksik | Frontend + backend cift validasyon |

---

## FAZ E — Tenant Dashboard (2-3 Hafta)

### E1: Tenant Admin Dashboard — Must Have (~30 saat)
| # | Widget | API | Efor |
|---|--------|-----|------|
| E1.1 | User Capacity Gauge (current/max) | Mevcut endpoint genislet | 2s |
| E1.2 | Active Sessions Card | YENi: GET /api/Manage/active-sessions | 4s |
| E1.3 | Quick Actions Toolbar | Frontend only | 2s |
| E1.4 | Recent Activity Feed | Mevcut audit-logs | 2s |
| E1.5 | Storage & Quota Meter | Endpoint genislet | 4s |
| E1.6 | Order & Revenue Summary | YENi: GET /api/Manage/business-metrics | 5s |
| E1.7 | Quality Metrics Card | Mevcut KPI endpoints | 4s |
| E1.8 | Production Health Card | Mevcut + yeni OEE | 5s |
| E1.9 | Subscription & Billing Card | YENi: GET /api/Manage/subscription-info | 6s |

### E2: Super Admin Dashboard — Must Have (~25 saat)
| # | Widget | API | Efor |
|---|--------|-----|------|
| E2.1 | Tenant Growth Chart | YENi: GET /api/Admin/tenant-growth | 4s |
| E2.2 | Revenue Dashboard (MRR/ARR) | YENi: GET /api/Admin/revenue-metrics | 8s |
| E2.3 | System Health Monitor | YENi: GET /api/Admin/system-health | 8s |
| E2.4 | Recent Registrations Feed | Mevcut tenants endpoint | 2s |
| E2.5 | Churn & Retention Metrics | YENi: GET /api/Admin/retention-metrics | 6s |

### E3: User Management Enhancements (~20 saat)
| # | Ozellik | Efor |
|---|---------|------|
| E3.1 | Reset Password | 3s |
| E3.2 | Invite User by Email | 5s |
| E3.3 | User Activity Log | 2s |
| E3.4 | Disable/Suspend User | 3s |
| E3.5 | Bulk CSV Import | 5s |

### E4: Settings Enhancements (~25 saat)
| # | Tab | Efor |
|---|-----|------|
| E4.1 | Billing & Subscription | 8s |
| E4.2 | Security Settings (MFA, IP whitelist) | 10s |
| E4.3 | Integration Settings (API keys, webhooks) | 10s |
| E4.4 | Localization & Timezone | 4s |

---

## FAZ F — Pagination Genisleme (1 Hafta)

### F1: Oncelik 2 Controller'lar (10 adet)
NcrController, CapaController, IncomingInspectionController,
MachinesController, MaintenanceController, CalibrationController,
TasksController, PaymentController, StockLotController, SubcontractOrderController

### F2: Oncelik 3 Controller'lar (6 adet)
UnitsController, WarehousesController, MaterialTypesController,
WorkOrderTemplatesController, WorkOrderStepsController, EcnController

### F3: Kalan Controller'lar (29 adet)
Kalite, Bakim, IK sub-endpoint'ler

---

## FAZ G — .NET Upgrade (Ayri Sprint)

| # | Sorun | Oneri | Not |
|---|-------|-------|-----|
| G1 | .NET 8 LTS (Kasim 2026'ya kadar destek) | .NET 9'a yukselt | Stabil, production-ready |
| G2 | EF Core 8 | EF Core 9'a yukselt | Performans iyilestirmeleri |
| G3 | .NET 10 | Kasim 2026'da cikacak (preview) | Production icin BEKLENMELI |

---

## TOPLAM EFOR TAHMINI

| Faz | Sure | Oncelik |
|-----|------|---------|
| A — Acil Duzeltmeler | 1-2 gun | HEMEN |
| B — DB & Mimari | 1 hafta | YUKSEK |
| C — Backend Guvenlik & Performans | 1 hafta | YUKSEK |
| D — Frontend Performans & Guvenlik | 1 hafta | ORTA |
| E — Tenant Dashboard | 2-3 hafta | ORTA |
| F — Pagination Genisleme | 1 hafta | DUSUK |
| G — .NET Upgrade | 1 hafta | PLANLI |
| **TOPLAM** | **~8-10 hafta** | |
