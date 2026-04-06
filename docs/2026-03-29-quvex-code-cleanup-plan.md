# Quvex ERP — Kod Düzenleme ve Clean Architecture Tamamlama Planı

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Clean Architecture migration'ı %35'ten %100'e tamamlamak, UI sorunlarını gidermek ve kod kalitesini artırmak.

**Architecture:** Strangler Fig pattern ile aşamalı geçiş — her faz sonunda tüm testler geçmeli, sıfır downtime. Servis interface'leri Application katmanına, implementasyonlar önce Infrastructure'a (external/infra servisler) sonra Application/Services (business logic) altına taşınacak. UI tarafında ESLint config düzeltmesi ve bundle optimization.

**Tech Stack:** .NET 8, EF Core 8, PostgreSQL 16, React 18, Vite 6.4, Ant Design 5, xUnit, Vitest

---

## Mevcut Durum Özeti

| Metrik | Değer |
|--------|-------|
| API Tests | 1,123 xUnit (1 pre-existing fail) |
| UI Tests | 688 Vitest + 40+ E2E Playwright |
| Controllers | 120 |
| Services in API (taşınacak) | 85 |
| Interfaces in API (taşınacak) | 74 |
| Duplicate services (API + Infrastructure) | 10 |
| Infrastructure/Services (tamamlanmış) | 11 |
| ESLint errors | 2 (parser config) |
| Bundle size warning | Ant Design chunk 1.4 MB |

## Faz Yapısı

| Faz | Kapsam | Tahmini Task |
|-----|--------|-------------|
| **Faz A** | UI Quick Wins (ESLint, bundle) | 3 task |
| **Faz B** | Duplicate servis temizliği | 2 task |
| **Faz C** | Interface'leri Application katmanına taşı | 3 task |
| **Faz D** | Business servisleri taşı (batch 1-4) | 8 task |
| **Faz E** | DI registration & Program.cs cleanup | 2 task |
| **Faz F** | Test refactoring & validation | 2 task |

---

## Faz A: UI Quick Wins

### Task 1: ESLint Parser Düzeltmesi

**Files:**
- Modify: `C:\rynSoft\smallFactoryUI\.eslintrc.js`
- Modify: `C:\rynSoft\smallFactoryUI\package.json` (devDependencies)

**Problem:** ESLint 7.11.0 default parser, class field syntax ve JSX'i desteklemiyor. `ErrorBoundary.jsx` (line 18) ve `OfferProduct.js` (line 2) parse hatası veriyor.

- [ ] **Step 1: @babel/eslint-parser paketini ekle**

```bash
cd /c/rynSoft/smallFactoryUI
npm install --save-dev @babel/eslint-parser @babel/preset-env @babel/plugin-proposal-class-properties
```

- [ ] **Step 2: .eslintrc.js parser config'ini güncelle**

```javascript
// .eslintrc.js — değiştirilecek satırlar (line 3-17 arası)
module.exports = {
  ignorePatterns: ['src/@core/**'],
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    requireConfigFile: false,
    babelOptions: {
      presets: ['@babel/preset-env'],
      plugins: ['@babel/plugin-proposal-class-properties'],
    },
    ecmaFeatures: {
      jsx: true,
      modules: true,
    },
  },
  env: {
    node: true,
    es6: true,
    browser: true,
  },
  // ... rules kısmı aynı kalacak
};
```

- [ ] **Step 3: Lint çalıştır ve hata olmadığını doğrula**

```bash
cd /c/rynSoft/smallFactoryUI
npx eslint src/components/ErrorBoundary.jsx src/models/OfferProduct.js --no-eslintrc --parser @babel/eslint-parser --parser-options=requireConfigFile:false
```

Expected: 0 errors, 0 warnings (veya sadece rule-based uyarılar)

- [ ] **Step 4: Tüm testlerin geçtiğini doğrula**

```bash
cd /c/rynSoft/smallFactoryUI
npx vitest run
```

Expected: 688 tests passing

- [ ] **Step 5: Commit**

```bash
cd /c/rynSoft/smallFactoryUI
git add .eslintrc.js package.json package-lock.json
git commit -m "fix: ESLint parser config — add @babel/eslint-parser for class field syntax support"
```

---

### Task 2: Ant Design Bundle Optimization (Tree Shaking Check)

**Files:**
- Modify: `C:\rynSoft\smallFactoryUI\vite.config.js`

**Problem:** `vendor-antd` chunk 1.4 MB (minified). Ant Design v5 zaten tree-shakeable ama icons paketi tamamı import ediliyor olabilir.

- [ ] **Step 1: Mevcut bundle boyutlarını ölç**

```bash
cd /c/rynSoft/smallFactoryUI
npx vite build 2>&1 | grep -E "(vendor-antd|chunk)" | head -20
```

Sonucu not al (baseline).

- [ ] **Step 2: @ant-design/icons import'larını kontrol et**

```bash
cd /c/rynSoft/smallFactoryUI
grep -r "from '@ant-design/icons'" src/ --include="*.jsx" --include="*.js" | head -30
```

Barrel import (`import { X, Y } from '@ant-design/icons'`) var mı kontrol et. Vite + esbuild genelde tree-shake yapabilir, ama Ant Design icons özel.

- [ ] **Step 3: manualChunks'ı icons için ayır**

`vite.config.js` satır 107-114 arasındaki `manualChunks` bölümünü güncelle:

```javascript
manualChunks: {
    'vendor-react': ['react', 'react-dom', 'react-router-dom'],
    'vendor-antd-core': ['antd'],
    'vendor-antd-icons': ['@ant-design/icons'],
    'vendor-charts': ['recharts', 'react-apexcharts', 'apexcharts'],
    'vendor-utils': ['axios', 'dayjs', 'file-saver', 'i18next', 'react-i18next'],
    'vendor-calendar': ['@fullcalendar/core', '@fullcalendar/react', '@fullcalendar/daygrid', '@fullcalendar/timegrid', '@fullcalendar/interaction', '@fullcalendar/list'],
    'vendor-table': ['react-data-table-component'],
},
```

- [ ] **Step 4: Build ve boyut karşılaştır**

```bash
cd /c/rynSoft/smallFactoryUI
npx vite build 2>&1 | grep -E "(vendor-antd|chunk)" | head -20
```

Expected: `vendor-antd-core` ve `vendor-antd-icons` ayrı chunk'lar, toplam boyut benzer ama lazy-loading avantajı.

- [ ] **Step 5: Testleri çalıştır**

```bash
cd /c/rynSoft/smallFactoryUI
npx vitest run
```

Expected: 688 tests passing

- [ ] **Step 6: Commit**

```bash
cd /c/rynSoft/smallFactoryUI
git add vite.config.js
git commit -m "perf: Split Ant Design icons into separate chunk for better caching"
```

---

### Task 3: React Testing Library Deprecation Uyarıları

**Files:**
- Modify: `C:\rynSoft\smallFactoryUI\src\setupTests.js`

**Problem:** LoadingWrapper testlerinde React 18 deprecated `ReactDOM.render`/`act` uyarıları.

- [ ] **Step 1: setupTests.js'de global act uyarısını sustur (geçici)**

Eğer `setupTests.js` zaten import var:
```javascript
import '@testing-library/jest-dom';
```

Ekle:
```javascript
import '@testing-library/jest-dom';

// Suppress React 18 act() warnings from React Testing Library (RTL 12.x compat)
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
```

- [ ] **Step 2: Test çalıştır**

```bash
cd /c/rynSoft/smallFactoryUI
npx vitest run 2>&1 | tail -5
```

Expected: 688 tests passing, uyarılar azalmış.

- [ ] **Step 3: Commit**

```bash
cd /c/rynSoft/smallFactoryUI
git add src/setupTests.js
git commit -m "fix: Suppress React 18 act() deprecation warnings in test setup"
```

---

## Faz B: API — Duplicate Servis Temizliği

### Task 4: Duplicate Servisleri Tespit Et ve Infrastructure Versiyonlarını Koru

**Files:**
- Delete: 10 duplicate files in `src/Quvex.API/Services/`
- Verify: 10 files in `src/Quvex.Infrastructure/Services/`

**Problem:** 10 servis hem API/Services hem Infrastructure/Services altında var. Infrastructure versiyonları korunacak, API kopyaları silinecek.

**Duplicate list:**
1. EmailTemplateService.cs
2. ExportService.cs
3. IyzicoBillingService.cs
4. LocalFileStorageService.cs
5. LogEmailService.cs
6. NotificationService.cs
7. PdfService.cs
8. ScheduledReportService.cs
9. SeedDemoService.cs
10. SmtpEmailService.cs

- [ ] **Step 1: Her duplicate çiftin namespace'ini karşılaştır**

```bash
cd /c/rynSoft/smallFactoryApi
for f in EmailTemplateService ExportService IyzicoBillingService LocalFileStorageService LogEmailService NotificationService PdfService ScheduledReportService SeedDemoService SmtpEmailService; do
  echo "=== $f ==="
  head -5 src/Quvex.API/Services/${f}.cs 2>/dev/null
  echo "---"
  head -5 src/Quvex.Infrastructure/Services/${f}.cs 2>/dev/null
  echo ""
done
```

Infrastructure namespace: `Quvex.Infrastructure.Services`
API namespace: `Quvex.Application.Services` (veya `Quvex.API.Services`)

- [ ] **Step 2: Program.cs'deki using'leri kontrol et**

Program.cs satır 9'da `using Quvex.Infrastructure.Services;` zaten var.
Satır 13'te `using Quvex.Application.Services;` — bu API/Services namespace'ini referans ediyor.

Controller'ların hangi namespace'i kullandığını kontrol et:
```bash
cd /c/rynSoft/smallFactoryApi
grep -r "using.*Application\.Services" src/Quvex.API/Controllers/ | head -5
grep -r "using.*Infrastructure\.Services" src/Quvex.API/Controllers/ | head -5
```

- [ ] **Step 3: API duplicate'leri sil**

```bash
cd /c/rynSoft/smallFactoryApi
rm src/Quvex.API/Services/EmailTemplateService.cs
rm src/Quvex.API/Services/ExportService.cs
rm src/Quvex.API/Services/IyzicoBillingService.cs
rm src/Quvex.API/Services/LocalFileStorageService.cs
rm src/Quvex.API/Services/LogEmailService.cs
rm src/Quvex.API/Services/NotificationService.cs
rm src/Quvex.API/Services/PdfService.cs
rm src/Quvex.API/Services/ScheduledReportService.cs
rm src/Quvex.API/Services/SeedDemoService.cs
rm src/Quvex.API/Services/SmtpEmailService.cs
```

- [ ] **Step 4: Program.cs DI kayıtlarını Infrastructure namespace'ine yönlendir**

DI satırlarında çakışma var mı kontrol et. Eğer `using Quvex.Infrastructure.Services;` zaten varsa, silinen API dosyalarının namespace'inden gelen tipler artık Infrastructure'dan resolve edilecek.

Build et:
```bash
cd /c/rynSoft/smallFactoryApi
dotnet build src/Quvex.API/Quvex.API.csproj
```

Expected: 0 errors. Eğer namespace çakışması varsa, explicit `Quvex.Infrastructure.Services.XxxService` kullan.

- [ ] **Step 5: Testleri çalıştır**

```bash
cd /c/rynSoft/smallFactoryApi
dotnet test tests/Quvex.API.Tests/Quvex.API.Tests.csproj
```

Expected: 1,122+ tests passing (1 pre-existing fail OK)

- [ ] **Step 6: Commit**

```bash
cd /c/rynSoft/smallFactoryApi
git add -A
git commit -m "[ARCH] Remove 10 duplicate services from API layer — Infrastructure versions retained"
```

---

### Task 5: Infrastructure DI Registration Genişlet

**Files:**
- Modify: `src/Quvex.Infrastructure/DependencyInjection.cs`

**Problem:** Infrastructure'daki 11 servis DI'da kayıtlı değil — sadece repo'lar ve TenantConnectionFactory kayıtlı.

- [ ] **Step 1: DependencyInjection.cs'e infrastructure servis kayıtlarını ekle**

```csharp
using Microsoft.Extensions.DependencyInjection;
using Quvex.Application.Interfaces;
using Quvex.Application.Interfaces.Repositories;
using Quvex.Infrastructure.Repositories;
using Quvex.Infrastructure.Services;

namespace Quvex.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services)
    {
        // Tenant Connection Factory
        services.AddSingleton<ITenantConnectionFactory, TenantConnectionFactory>();

        // Repository & UnitOfWork
        services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
        services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
        services.AddScoped<IUnitOfWork, UnitOfWork>();

        // Infrastructure Services (external dependencies: email, file, PDF, billing)
        // NOT: Interface'ler henüz Application'da değil, Program.cs'den kayıt devam ediyor.
        // Bu satırlar interface migration (Faz C) tamamlanınca aktif edilecek.

        return services;
    }
}
```

**Not:** Bu adım hazırlık — interface'ler Application'a taşındığında (Faz C) buradaki kayıtlar aktif edilecek.

- [ ] **Step 2: Build doğrula**

```bash
cd /c/rynSoft/smallFactoryApi
dotnet build src/Quvex.Infrastructure/Quvex.Infrastructure.csproj
```

Expected: 0 errors

- [ ] **Step 3: Commit**

```bash
cd /c/rynSoft/smallFactoryApi
git add src/Quvex.Infrastructure/DependencyInjection.cs
git commit -m "[ARCH] Prepare Infrastructure DI for service registration expansion"
```

---

## Faz C: Interface'leri Application Katmanına Taşı

### Task 6: Application/Interfaces/Services Dizinini Oluştur ve Interface'leri Taşı (Batch 1 — Sales/Billing: 20 interface)

**Files:**
- Create: `src/Quvex.Application/Interfaces/Services/` directory
- Move: 20 interface files from `src/Quvex.API/Interfaces/` → `src/Quvex.Application/Interfaces/Services/`
- Modify: Namespace in each moved file

**Interface list (Sales & Billing group):**
IProductService, IInvoiceService, IPaymentService, ICustomerStatementService, IOfferCalculationService, ICostAccountingService, IStandardCostService, ILaborCostService, ICustomerPortalService, ICustomerFeedbackService, ICustomerPropertyService, IExportService, IImportExportService, IEmailService, IFileStorageService, IEmailTemplateService (interface), INotificationService (interface), IBillingService, IEInvoiceService, IEInvoiceProvider

- [ ] **Step 1: Dizin oluştur**

```bash
mkdir -p /c/rynSoft/smallFactoryApi/src/Quvex.Application/Interfaces/Services
```

- [ ] **Step 2: Interface'leri taşı ve namespace güncelle**

Her dosya için:
1. `src/Quvex.API/Interfaces/IXxxService.cs` → `src/Quvex.Application/Interfaces/Services/IXxxService.cs`
2. Namespace değiştir: `namespace Quvex.API.Interfaces;` → `namespace Quvex.Application.Interfaces.Services;`
3. API'daki eski dosyayı sil

```bash
cd /c/rynSoft/smallFactoryApi

# Batch move script
for f in IProductService IInvoiceService IPaymentService ICustomerStatementService IOfferCalculationService ICostAccountingService IStandardCostService ILaborCostService ICustomerPortalService ICustomerFeedbackService ICustomerPropertyService IExportService IImportExportService IEmailService IFileStorageService IEInvoiceService IEInvoiceProvider IBillingService INotificationService IEmailTemplateService; do
  if [ -f "src/Quvex.API/Interfaces/${f}.cs" ]; then
    cp "src/Quvex.API/Interfaces/${f}.cs" "src/Quvex.Application/Interfaces/Services/${f}.cs"
    # Namespace fix
    sed -i 's/namespace Quvex\.API\.Interfaces/namespace Quvex.Application.Interfaces.Services/' "src/Quvex.Application/Interfaces/Services/${f}.cs"
    rm "src/Quvex.API/Interfaces/${f}.cs"
    echo "Moved: ${f}.cs"
  fi
done
```

- [ ] **Step 3: API Controller using'lerini güncelle**

```bash
cd /c/rynSoft/smallFactoryApi
# API Interfaces namespace yerine Application namespace kullan
grep -rl "using Quvex.API.Interfaces;" src/Quvex.API/Controllers/ | head -5
```

Her controller'da:
```csharp
// Eski:
using Quvex.API.Interfaces;
// Yeni (ekle):
using Quvex.Application.Interfaces.Services;
```

Toplu değiştirme:
```bash
cd /c/rynSoft/smallFactoryApi
find src/Quvex.API/Controllers/ -name "*.cs" -exec sed -i 's/using Quvex\.API\.Interfaces;/using Quvex.Application.Interfaces.Services;/' {} \;
```

**NOT:** Eğer bazı controller'lar hala API.Interfaces'teki diğer interface'leri kullanıyorsa, HER İKİ using'i de tut:
```csharp
using Quvex.API.Interfaces; // kalan interface'ler için
using Quvex.Application.Interfaces.Services; // taşınanlar için
```

- [ ] **Step 4: Program.cs using'ini güncelle**

Program.cs satır 8 zaten `using Quvex.Application.Interfaces.Services;` içeriyor — sorun yok.
Ama satır 12'deki duplicate using'i kontrol et ve kaldır.

- [ ] **Step 5: Build et**

```bash
cd /c/rynSoft/smallFactoryApi
dotnet build src/Quvex.API/Quvex.API.csproj
```

Expected: 0 errors. Eğer hata varsa, eksik using'leri düzelt.

- [ ] **Step 6: Testleri çalıştır**

```bash
cd /c/rynSoft/smallFactoryApi
dotnet test tests/Quvex.API.Tests/Quvex.API.Tests.csproj
```

Expected: 1,122+ tests passing

- [ ] **Step 7: Commit**

```bash
cd /c/rynSoft/smallFactoryApi
git add -A
git commit -m "[ARCH] Move 20 Sales/Billing interfaces to Application layer"
```

---

### Task 7: Interface'leri Taşı (Batch 2 — Production/Inventory/Quality: 27 interface)

**Files:**
- Move: 27 interface files from `src/Quvex.API/Interfaces/` → `src/Quvex.Application/Interfaces/Services/`

**Interface list:**
IProductionPlanningService, ICapacityPlanningService, IProductionCostReportService, IScrapTrackingService, IOperationTimeService, IBomExplosionService, INetRequirementService, IPurchaseSuggestionService, IQualityControlPlanService, IIncomingInspectionService, INcrService, IStockCountService, IStockLotService, IStockValuationService, IStockAlertService, IStockBulkService, IAutoPurchaseService, IBarcodeLookupService, ICalibrationService, ICapaService, IRiskService, IControlPlanService, IEcnService, IAdvancedQualityService, IAdvancedMrpService, IOeeService, IMaintenanceService

- [ ] **Step 1: Batch taşı ve namespace güncelle**

```bash
cd /c/rynSoft/smallFactoryApi

for f in IProductionPlanningService ICapacityPlanningService IProductionCostReportService IScrapTrackingService IOperationTimeService IBomExplosionService INetRequirementService IPurchaseSuggestionService IQualityControlPlanService IIncomingInspectionService INcrService IStockCountService IStockLotService IStockValuationService IStockAlertService IStockBulkService IAutoPurchaseService IBarcodeLookupService ICalibrationService ICapaService IRiskService IControlPlanService IEcnService IAdvancedQualityService IAdvancedMrpService IOeeService IMaintenanceService; do
  if [ -f "src/Quvex.API/Interfaces/${f}.cs" ]; then
    cp "src/Quvex.API/Interfaces/${f}.cs" "src/Quvex.Application/Interfaces/Services/${f}.cs"
    sed -i 's/namespace Quvex\.API\.Interfaces/namespace Quvex.Application.Interfaces.Services/' "src/Quvex.Application/Interfaces/Services/${f}.cs"
    rm "src/Quvex.API/Interfaces/${f}.cs"
    echo "Moved: ${f}.cs"
  fi
done
```

- [ ] **Step 2: Controller using'lerini güncelle (zaten Batch 1'de yapıldıysa skip)**

Task 6'da toplu `sed` ile değiştirilmişse, burada ek iş yok. Kontrol et:

```bash
cd /c/rynSoft/smallFactoryApi
grep -r "using Quvex.API.Interfaces;" src/Quvex.API/Controllers/ | wc -l
```

Expected: 0 (hepsi zaten Application.Interfaces.Services'e dönmüşse)

- [ ] **Step 3: Build et**

```bash
cd /c/rynSoft/smallFactoryApi
dotnet build src/Quvex.API/Quvex.API.csproj
```

- [ ] **Step 4: Test çalıştır**

```bash
cd /c/rynSoft/smallFactoryApi
dotnet test tests/Quvex.API.Tests/Quvex.API.Tests.csproj
```

- [ ] **Step 5: Commit**

```bash
cd /c/rynSoft/smallFactoryApi
git add -A
git commit -m "[ARCH] Move 27 Production/Inventory/Quality interfaces to Application layer"
```

---

### Task 8: Interface'leri Taşı (Batch 3 — Advanced/Admin/Remaining: 27 interface)

**Files:**
- Move: Remaining 27 interfaces from `src/Quvex.API/Interfaces/` → `src/Quvex.Application/Interfaces/Services/`

**Interface list:**
IAIInsightsService, IAlertService, IAuditService (interface), IChangelogService, IConfigurationManagementService, ICounterfeitPartService, ICybersecurityService, IDesignDevelopmentService, IDocumentService, IFaiService, IFodService, IHrService, IInternalAuditService, IKpiService, IMigrationService, IOnboardingService, IPpapService, IProductSafetyService, IProjectManagementService, IQualityMeetingService, IReportService, ISlaMetricsService, ISpcService, ISpecialProcessService, ISupplierEvaluationService, ISupplyChainRiskService, ITenantAnalyticsService, ITenantMigrationService, ITrainingService, IUserFeedbackService

- [ ] **Step 1: Batch taşı**

```bash
cd /c/rynSoft/smallFactoryApi

for f in IAIInsightsService IAlertService IAuditService IChangelogService IConfigurationManagementService ICounterfeitPartService ICybersecurityService IDesignDevelopmentService IDocumentService IFaiService IFodService IHrService IInternalAuditService IKpiService IMigrationService IOnboardingService IPpapService IProductSafetyService IProjectManagementService IQualityMeetingService IReportService ISlaMetricsService ISpcService ISpecialProcessService ISupplierEvaluationService ISupplyChainRiskService ITenantAnalyticsService ITenantMigrationService ITrainingService IUserFeedbackService; do
  if [ -f "src/Quvex.API/Interfaces/${f}.cs" ]; then
    cp "src/Quvex.API/Interfaces/${f}.cs" "src/Quvex.Application/Interfaces/Services/${f}.cs"
    sed -i 's/namespace Quvex\.API\.Interfaces/namespace Quvex.Application.Interfaces.Services/' "src/Quvex.Application/Interfaces/Services/${f}.cs"
    rm "src/Quvex.API/Interfaces/${f}.cs"
    echo "Moved: ${f}.cs"
  fi
done
```

- [ ] **Step 2: API/Interfaces dizininin boş kaldığını doğrula**

```bash
ls /c/rynSoft/smallFactoryApi/src/Quvex.API/Interfaces/
```

Expected: Boş (veya sadece ISecurityAuditService gibi API-specific interface'ler kalmış olabilir)

- [ ] **Step 3: ISecurityAuditService varsa API'da bırak** (bu API-specific bir concern)

```bash
cd /c/rynSoft/smallFactoryApi
ls src/Quvex.API/Interfaces/ 2>/dev/null
```

Eğer dosya kaldıysa, API-specific olanları `Quvex.API.Auth` veya `Quvex.API.Interfaces` altında tut.

- [ ] **Step 4: Build + Test**

```bash
cd /c/rynSoft/smallFactoryApi
dotnet build src/Quvex.API/Quvex.API.csproj && dotnet test tests/Quvex.API.Tests/Quvex.API.Tests.csproj
```

- [ ] **Step 5: Commit**

```bash
cd /c/rynSoft/smallFactoryApi
git add -A
git commit -m "[ARCH] Move remaining 27 interfaces to Application layer — API/Interfaces cleared"
```

---

## Faz D: Business Servisleri API'dan Taşı

**Strateji:** 75 business servis (duplicate'ler çıktıktan sonra) Application katmanına taşınacak. Her batch ~19 servis.

**ÖNEMLİ:** Servisler şu an `QuvexDBContext`'e doğrudan bağımlı (API layer'da). Taşırken:
1. Servisi `src/Quvex.API/Services/` → `src/Quvex.Application/Services/` altına kopyala
2. Namespace'i `Quvex.Application.Services` olarak güncelle
3. Using'leri kontrol et — `QuvexDBContext` API katmanında kaldığı için, servisler `IUnitOfWork` veya `IGenericRepository<T>` üzerinden DB'ye erişmeli
4. Eğer servis doğrudan DbContext kullanıyorsa, **o servisi şimdilik API'da bırak** ve TODO ekle

### Task 9: Servisleri Taşı — Batch 1 (Sales/Customer: 10 servis)

**Files:**
- Move: 10 files from `src/Quvex.API/Services/` → `src/Quvex.Application/Services/`

**Service list:**
CustomerFeedbackService, CustomerPortalService, CustomerPropertyService, CustomerStatementService, OfferCalculationService, ChangelogService, UserFeedbackService, AlertService, BarcodeLookupService, AIInsightsService

- [ ] **Step 1: Application/Services dizinini oluştur**

```bash
mkdir -p /c/rynSoft/smallFactoryApi/src/Quvex.Application/Services
```

- [ ] **Step 2: İlk servisi incele — DbContext bağımlılığı var mı?**

```bash
cd /c/rynSoft/smallFactoryApi
head -30 src/Quvex.API/Services/CustomerFeedbackService.cs
```

Eğer `QuvexDBContext` constructor'da inject ediliyorsa → servis DbContext'e bağımlı.
Eğer `IGenericRepository<T>` veya `IUnitOfWork` kullanıyorsa → taşınabilir.

- [ ] **Step 3: DbContext bağımlılığını tüm servisler için kontrol et**

```bash
cd /c/rynSoft/smallFactoryApi
for f in CustomerFeedbackService CustomerPortalService CustomerPropertyService CustomerStatementService OfferCalculationService ChangelogService UserFeedbackService AlertService BarcodeLookupService AIInsightsService; do
  echo "=== $f ==="
  grep -c "QuvexDBContext\|_context\|_db" "src/Quvex.API/Services/${f}.cs" 2>/dev/null
done
```

**Karar noktası:**
- DbContext kullananlar → **şimdilik API'da bırak**, `// TODO: [ARCH] Move to Application after DbContext abstraction` comment ekle
- Repository/UnitOfWork kullananlar → taşı

- [ ] **Step 4: Taşınabilir servisleri kopyala ve namespace güncelle**

```bash
cd /c/rynSoft/smallFactoryApi
# Sadece DbContext KULLANMAYAN servisleri taşı
for f in <TAŞINABILIR_SERVİSLER>; do
  cp "src/Quvex.API/Services/${f}.cs" "src/Quvex.Application/Services/${f}.cs"
  sed -i 's/namespace Quvex\.Application\.Services/namespace Quvex.Application.Services/' "src/Quvex.Application/Services/${f}.cs"
  # API using'lerini Application using'lerine çevir
  sed -i 's/using Quvex\.API\.Interfaces/using Quvex.Application.Interfaces.Services/' "src/Quvex.Application/Services/${f}.cs"
  rm "src/Quvex.API/Services/${f}.cs"
  echo "Moved: ${f}.cs"
done
```

- [ ] **Step 5: Application.csproj'a gerekli referansları ekle (gerekirse)**

Application şu an sadece Domain'e referans veriyor. Eğer servisler AutoMapper, FluentValidation gibi paketler kullanıyorsa bunlar zaten Application.csproj'ta mevcut.

- [ ] **Step 6: Build + Test**

```bash
cd /c/rynSoft/smallFactoryApi
dotnet build src/Quvex.API/Quvex.API.csproj && dotnet test tests/Quvex.API.Tests/Quvex.API.Tests.csproj
```

- [ ] **Step 7: Commit**

```bash
cd /c/rynSoft/smallFactoryApi
git add -A
git commit -m "[ARCH] Move Sales/Customer services to Application layer (Batch 1)"
```

---

### Task 10: Servisleri Taşı — Batch 2 (Production/Planning: ~18 servis)

Aynı pattern Task 9 ile. Servis listesi:
ProductionPlanningService, CapacityPlanningService, ProductionCostReportService, ScrapTrackingService, OperationTimeService, BomExplosionService, NetRequirementService, PurchaseSuggestionService, AdvancedMrpService, OeeService, MaintenanceService, HrService, TrainingService, DocumentService, ProjectManagementService, MigrationService, OnboardingService, TenantMigrationService

### Task 11: Servisleri Taşı — Batch 3 (Quality/Compliance: ~18 servis)

QualityControlPlanService, IncomingInspectionService, NcrService, CalibrationService, CapaService, RiskService, ControlPlanService, EcnService, AdvancedQualityService, FaiService, PpapService, SpcService, QualityMeetingService, InternalAuditService, ConfigurationManagementService, SpecialProcessService, CounterfeitPartService, FodService

### Task 12: Servisleri Taşı — Batch 4 (Inventory/Finance/Remaining: ~19 servis)

StockCountService, StockLotService, StockValuationService, StockAlertService, StockBulkService, AutoPurchaseService, InvoiceService, PaymentService, CostAccountingService, StandardCostService, LaborCostService, TaxCalculationService, EInvoiceService, DefaultEInvoiceProvider, ProductService, ReportService, KpiService, AuditService, ImportExportService, SlaMetricsService, TenantAnalyticsService, SecurityAuditService

**NOT:** Task 10-12 tamamen Task 9 ile aynı pattern'ı izler. Her batch için:
1. DbContext bağımlılığını kontrol et
2. Taşınabilir olanları taşı
3. Namespace güncelle
4. Build + Test
5. Commit

---

### Task 13-14: DbContext Bağımlı Servisleri Refactor Et

**Bu task'lar Faz D sonrası yapılacak.** DbContext'e doğrudan bağımlı servisler için:

1. Servis constructor'ına `IGenericRepository<T>` veya `IUnitOfWork` inject et
2. `_context.Xxx.Where(...)` → `_repository.GetAllAsync(...)` şeklinde refactor et
3. Refactor sonrası servisi Application katmanına taşı
4. Build + Test

**Bu büyük bir refactoring — her servis için ayrı commit.**

---

## Faz E: DI Registration Cleanup

### Task 15: Program.cs'den Servis Kayıtlarını Application DI'a Taşı

**Files:**
- Create: `src/Quvex.Application/DependencyInjection.cs`
- Modify: `src/Quvex.API/Program.cs` (satır 188-271 arası)

- [ ] **Step 1: Application DependencyInjection.cs oluştur**

```csharp
using Microsoft.Extensions.DependencyInjection;
using Quvex.Application.Interfaces.Services;
using Quvex.Application.Services;

namespace Quvex.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        // Application layer business services
        // Taşınan her servis burada kayıt edilecek
        // Örnek:
        // services.AddScoped<ICustomerFeedbackService, CustomerFeedbackService>();

        return services;
    }
}
```

- [ ] **Step 2: Program.cs'e AddApplication() çağrısını ekle**

Program.cs'de `builder.Services.AddInfrastructure()` satırından sonra:
```csharp
builder.Services.AddApplication();
builder.Services.AddInfrastructure();
```

- [ ] **Step 3: Taşınan servislerin DI kayıtlarını Program.cs'den Application DI'a taşı**

Her taşınan servis için Program.cs'den satırı kaldır, AddApplication()'a ekle.

- [ ] **Step 4: Build + Test**

```bash
cd /c/rynSoft/smallFactoryApi
dotnet build src/Quvex.API/Quvex.API.csproj && dotnet test tests/Quvex.API.Tests/Quvex.API.Tests.csproj
```

- [ ] **Step 5: Commit**

```bash
cd /c/rynSoft/smallFactoryApi
git add -A
git commit -m "[ARCH] Add Application DI extension — centralize business service registration"
```

---

### Task 16: Infrastructure DI Genişlet

**Files:**
- Modify: `src/Quvex.Infrastructure/DependencyInjection.cs`

Infrastructure'daki servisleri (email, file, PDF, billing) `AddInfrastructure()` altında kaydet, Program.cs'den kaldır.

```csharp
public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
{
    // Repos (mevcut)
    services.AddSingleton<ITenantConnectionFactory, TenantConnectionFactory>();
    services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
    services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
    services.AddScoped<IUnitOfWork, UnitOfWork>();

    // Email
    if (!string.IsNullOrEmpty(configuration["Email:SmtpHost"]))
        services.AddScoped<IEmailService, SmtpEmailService>();
    else
        services.AddScoped<IEmailService, LogEmailService>();

    // File Storage
    services.AddSingleton<IFileStorageService, LocalFileStorageService>();
    services.AddSingleton<IEmailTemplateService, EmailTemplateService>();

    // PDF & Export
    services.AddScoped<PdfService>();
    services.AddScoped<IExportService, ExportService>();

    // Billing
    services.AddScoped<IBillingService, IyzicoBillingService>();

    // Notifications
    services.AddScoped<INotificationService, NotificationService>();

    return services;
}
```

---

## Faz F: Test Refactoring & Validation

### Task 17: Test Namespace Güncellemesi

**Files:**
- Modify: Test files in `tests/Quvex.API.Tests/` that reference moved interfaces/services

- [ ] **Step 1: Test dosyalarında eski namespace kullanımını bul**

```bash
cd /c/rynSoft/smallFactoryApi
grep -rl "using Quvex.API.Interfaces;" tests/ | wc -l
grep -rl "using Quvex.Application.Services;" tests/ | wc -l
```

- [ ] **Step 2: Toplu güncelle**

```bash
cd /c/rynSoft/smallFactoryApi
find tests/ -name "*.cs" -exec sed -i 's/using Quvex\.API\.Interfaces;/using Quvex.Application.Interfaces.Services;/' {} \;
```

- [ ] **Step 3: Full test suite çalıştır**

```bash
cd /c/rynSoft/smallFactoryApi
dotnet test tests/Quvex.API.Tests/Quvex.API.Tests.csproj --verbosity normal
```

Expected: 1,122+ passing

- [ ] **Step 4: Commit**

```bash
cd /c/rynSoft/smallFactoryApi
git add -A
git commit -m "[ARCH] Update test namespaces for Application layer migration"
```

---

### Task 18: Architecture Test Güncellemesi

**Files:**
- Modify: `tests/Quvex.API.Tests/Architecture/CleanArchitectureTests.cs`

- [ ] **Step 1: Architecture test dosyasını oku**

```bash
cd /c/rynSoft/smallFactoryApi
cat tests/Quvex.API.Tests/Architecture/CleanArchitectureTests.cs
```

- [ ] **Step 2: Yeni katman kurallarını ekle/güncelle**

```csharp
[Fact]
public void Application_Should_Not_Reference_Infrastructure()
{
    var result = Types.InAssembly(typeof(Quvex.Application.DependencyInjection).Assembly)
        .ShouldNot()
        .HaveDependencyOn("Quvex.Infrastructure")
        .GetResult();

    result.IsSuccessful.Should().BeTrue();
}

[Fact]
public void Application_Should_Not_Reference_API()
{
    var result = Types.InAssembly(typeof(Quvex.Application.DependencyInjection).Assembly)
        .ShouldNot()
        .HaveDependencyOn("Quvex.API")
        .GetResult();

    result.IsSuccessful.Should().BeTrue();
}
```

- [ ] **Step 3: Test çalıştır**

```bash
cd /c/rynSoft/smallFactoryApi
dotnet test tests/Quvex.API.Tests/Quvex.API.Tests.csproj --filter "CleanArchitecture"
```

- [ ] **Step 4: Commit**

```bash
cd /c/rynSoft/smallFactoryApi
git add -A
git commit -m "[ARCH] Update architecture tests for completed layer migration"
```

---

## Özet & Öncelik Sırası

| Öncelik | Faz | Tahmini Süre | Risk |
|---------|-----|-------------|------|
| 🔴 P0 | Faz A: UI Quick Wins | 30 dk | Düşük |
| 🔴 P0 | Faz B: Duplicate temizliği | 30 dk | Düşük |
| 🟡 P1 | Faz C: Interface migration | 1-2 saat | Orta (namespace çakışma) |
| 🟡 P1 | Faz D: Service migration | 3-4 saat | Yüksek (DbContext bağımlılık) |
| 🟢 P2 | Faz E: DI cleanup | 1 saat | Düşük |
| 🟢 P2 | Faz F: Test refactoring | 1 saat | Düşük |

**Toplam tahmini: 7-9 saat**

**Kritik risk:** Faz D'deki DbContext bağımlılığı. 85 servisin çoğu doğrudan `QuvexDBContext` kullanıyor olabilir. Bu durumda servislerin Repository pattern'a refactor edilmesi gerekir — bu en büyük iş kalemi.

**Tavsiye:** Faz A ve B ile başla (quick wins), sonra Faz C (interface'ler — risk düşük). Faz D'ye başlamadan önce DbContext bağımlılık analizi yap ve scope'u daralt.
