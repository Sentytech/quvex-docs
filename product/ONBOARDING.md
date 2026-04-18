# Quvex ERP - Kapsamli Proje Dokumantasyonu

> **Son Guncelleme:** Mart 2026
> **Hedef Kitle:** Projeye yeni katilan gelistiriciler, teknik liderler, proje yoneticileri

---

## Icindekiler

1. [Proje Hakkinda](#1-proje-hakkinda)
2. [Mimari Genel Bakis](#2-mimari-genel-bakis)
3. [Teknoloji Yigini](#3-teknoloji-yigini)
4. [Gelistirme Ortami Kurulumu](#4-gelistirme-ortami-kurulumu)
5. [API Katmani (Backend)](#5-api-katmani-backend)
6. [UI Katmani (Frontend)](#6-ui-katmani-frontend)
7. [Veritabani](#7-veritabani)
8. [Kimlik Dogrulama ve Yetkilendirme](#8-kimlik-dogrulama-ve-yetkilendirme)
9. [Modul Haritasi ve Is Akislari](#9-modul-haritasi-ve-is-akislari)
10. [Kod Yazim Standartlari](#10-kod-yazim-standartlari)
11. [Test Stratejisi](#11-test-stratejisi)
12. [Deployment ve Ortamlar](#12-deployment-ve-ortamlar)
13. [Sikca Karsilasilan Sorunlar](#13-sikca-karsilasilan-sorunlar)
14. [Yol Haritasi](#14-yol-haritasi)
15. [Sektor Bazli 5-Dakika Onboarding (Sprint 11)](#15-sektor-bazli-5-dakika-onboarding-sprint-11)

---

## 1. Proje Hakkinda

### Ne?
**Quvex**, kucuk ve orta olcekli uretim isletmeleri icin gelistirilen kapsamli bir **Uretim Yonetim Sistemi (ERP)** uygulamasidir. Eski adi "Asya Uretim Takip" olup 2026'da Quvex olarak yeniden markalasmistir.

### Neden?
Turkiye'deki kucuk fabrikalarin cogu hala Excel veya kagit bazli uretim takibi yapmaktadir. Quvex, bu isletmelere:
- Siparis ve uretim planlama
- Stok ve depo yonetimi
- Kalite kontrol (AS9100 / IATF 16949 uyumlu)
- Maliyet takibi ve muhasebe entegrasyonu
- Bakim yonetimi ve OEE takibi
- MRP (Malzeme Ihtiyac Planlama) saglar.

### Kime?
- **Uretim Muduru:** Siparisleri, is emirlerini, uretim durumunu gorur
- **Kalite Muduru:** NCR, CAPA, giris kontrol, kalibrasyon, SPC takibi
- **Depo Sorumlusu:** Stok giris/cikis, sayim, lot takibi, barkod islemleri
- **Satin Alma:** Tedarikci yonetimi, teklif toplama, otomatik satin alma talebi
- **Muhasebe:** Fatura, sevk, odeme takibi
- **Ust Yonetim:** Dashboard'lar, KPI'lar, raporlar

---

## 2. Mimari Genel Bakis

```
+------------------------------------------+
|              KULLANICI (Tarayici)         |
|          http://localhost:3000            |
+------------------+-----------------------+
                   |
                   | HTTP (REST API)
                   |
+------------------v-----------------------+
|              REACT UI (Frontend)         |
|  - React 18 + Redux Toolkit             |
|  - Ant Design v5 + Reactstrap           |
|  - ApexCharts + Chart.js                |
|  - Axios HTTP Client                    |
+------------------+-----------------------+
                   |
                   | JSON / JWT Token
                   |
+------------------v-----------------------+
|           .NET 8 API (Backend)           |
|  - ASP.NET Core Web API                 |
|  - Entity Framework Core                |
|  - JWT Authentication                   |
|  - YetkiDenetimi (Custom Auth Filter)   |
+------------------+-----------------------+
                   |
                   | EF Core / Npgsql
                   |
+------------------v-----------------------+
|          PostgreSQL (Veritabani)          |
|  - Docker Container                     |
|  - DB: quvex_dev                         |
+------------------------------------------+
```

### Katmanli Mimari (Backend)

```
Controller  -->  Service (Is Mantigi)  -->  Repository  -->  DbContext  -->  PostgreSQL
     |                |                         |
     |           IService                 IGenericRepository
     |          (Interface)                  (Interface)
     |                |                         |
     +--- DTO <-- AutoMapper <-- Entity Model --+
```

- **Controller:** HTTP isteklerini karsilar, yetki kontrolu yapar, Service'e yonlendirir
- **Service:** Is mantigini icerir, validasyon yapar, DTO donusumu saglar
- **Repository:** Veritabani CRUD islemlerini gerceklestirir (Generic Repository Pattern)
- **DbContext:** EF Core ile PostgreSQL baglantisini yonetir
- **DTO:** Dis dunyaya gonderilen veri modeli (Entity'den farkli olabilir)
- **Entity/Model:** Veritabani tablosunun C# karsiligi

---

## 3. Teknoloji Yigini

### Backend (.NET 8)

| Kategori | Teknoloji | Versiyon |
|----------|-----------|----------|
| Framework | ASP.NET Core | 8.0 |
| ORM | Entity Framework Core | 8.x |
| Veritabani | PostgreSQL (Npgsql) | 16+ |
| Auth | ASP.NET Core Identity + JWT | - |
| Validasyon | FluentValidation | - |
| Mapping | AutoMapper | - |
| Loglama | Serilog | - |
| Test | xUnit + Moq + FluentAssertions | - |

### Frontend (React)

| Kategori | Teknoloji | Versiyon |
|----------|-----------|----------|
| Framework | React | 18.3.1 |
| State | Redux Toolkit | 1.2.5 |
| UI Library | Ant Design | 5.29.3 |
| CSS Framework | Bootstrap 5 + Reactstrap | 9.2.3 |
| HTTP Client | Axios | 0.24.0 |
| Router | React Router DOM | 5.2.0 |
| Grafikler | ApexCharts + Chart.js + Recharts | - |
| Ikonlar | React Feather + Ant Design Icons | - |
| Build | Create React App (Craco) | - |
| Test | Vitest + Testing Library | 3.2.4 |
| Font | Inter + Montserrat | Google Fonts |

### Altyapi

| Kategori | Araclari |
|----------|----------|
| Veritabani | PostgreSQL Docker Container (`smallfactory-postgres`) |
| Versiyon Kontrol | Git |
| IDE | Visual Studio / VS Code |
| API Dokumantasyon | Swagger (Development modunda) |

---

## 4. Gelistirme Ortami Kurulumu

### On Kosullar
- Node.js 18+ ve npm
- .NET 8 SDK
- Docker Desktop (PostgreSQL icin)
- Git

### Adim 1: PostgreSQL Veritabanini Baslat
```bash
# Docker container zaten olusturulmus ise:
docker start smallfactory-postgres

# Yoksa:
docker run --name smallfactory-postgres \
  -e POSTGRES_DB=quvex_dev \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=<sifre> \
  -p 5432:5432 -d postgres:16
```

### Adim 2: API'yi Baslat
```bash
cd C:\rynSoft\quvex\smallFactoryApi

# Migration uygula (ilk kurulum veya model degisikliklerinde)
dotnet ef database update --project Industry.API/Industry.API.csproj

# API'yi calistir
dotnet run --project Industry.API/Industry.API.csproj
# --> http://localhost:5052
# --> Swagger: http://localhost:5052/swagger
```

### Adim 3: UI'yi Baslat
```bash
cd C:\rynSoft\quvex\smallFactoryUI

# Bagimliliklari yukle (ilk kurulumda)
npm install --legacy-peer-deps

# Gelistirme sunucusunu baslat
npm start
# --> http://localhost:3000
```

### Adim 4: Giris Yap
```
URL:    http://localhost:3000/login
E-posta: admin@asya.com
Sifre:   Admin123!
```

### Ortam Degiskenleri

**UI (.env.development):**
```
REACT_APP_API_ENDPOINT=http://localhost:5052/api
REACT_APP_API_URL=http://localhost:5052
```

**API (Environment Variables veya appsettings):**
```
DB_CONNECTION_STRING=<PostgreSQL connection string>
JWT_SECRET_KEY=<JWT imzalama anahtari>
CORS_ORIGIN=http://localhost:3000
```

---

## 5. API Katmani (Backend)

### Dosya Yapisi

```
C:\rynSoft\quvex\smallFactoryApi\
├── Industry.API/
│   ├── Auth/                    # Kimlik dogrulama (JWT, YetkiDenetimi)
│   ├── Common/                  # Ortak yardimci siniflar
│   ├── Constants/               # Enum'lar ve sabitler (48 dosya)
│   ├── Controllers/             # API endpoint'leri (83 controller)
│   ├── DataAccess/              # EF Core DbContext
│   ├── Exceptions/              # Ozel exception siniflar
│   ├── Helpers/                 # Yardimci metodlar
│   ├── Interfaces/              # Servis arayuzleri (62 interface)
│   ├── Middleware/               # Exception handler middleware
│   ├── Migrations/              # EF Core migration dosyalari
│   ├── Models/                  # Entity modelleri ve DTO'lar
│   │   ├── Base/                # BaseFullModel, BaseSimpleModel
│   │   ├── DTOs/                # Veri transfer nesneleri (60+)
│   │   └── Mappers/            # AutoMapper profilleri
│   ├── Repositories/            # GenericRepository + UnitOfWork
│   ├── Services/                # Is mantigi servisleri (63 servis)
│   ├── Settings/                # Konfigurasyon siniflari
│   ├── Utilities/               # Permissions.cs
│   ├── Validators/              # FluentValidation kurallari
│   └── Program.cs              # Uygulama baslangic noktasi
├── Industry.API.Tests/          # Test projesi (79 test dosyasi)
└── docs/                        # Proje dokumantasyonu
```

### Yeni Bir Endpoint Nasil Eklenir? (Adim Adim)

Ornek: "MalzemeGrubu" (MaterialGroup) modulu eklemek

#### 1. Model Olustur
```csharp
// Models/MaterialGroup.cs
public class MaterialGroup : BaseFullModel<Guid>
{
    public string Name { get; set; }
    public string? Description { get; set; }
    public bool IsActive { get; set; } = true;
}
```

#### 2. DbContext'e Ekle
```csharp
// DataAccess/IndustryDBContext.cs
public DbSet<MaterialGroup> MaterialGroups { get; set; }
```

#### 3. Migration Olustur ve Uygula
```bash
dotnet ef migrations add AddMaterialGroup --project Industry.API/Industry.API.csproj
dotnet ef database update --project Industry.API/Industry.API.csproj
```

#### 4. Interface Olustur
```csharp
// Interfaces/IMaterialGroupService.cs
public interface IMaterialGroupService
{
    Task<List<MaterialGroup>> GetAllAsync();
    Task<MaterialGroup> GetByIdAsync(Guid id);
    Task<MaterialGroup> CreateAsync(MaterialGroup model);
    Task UpdateAsync(Guid id, MaterialGroup model);
    Task DeleteAsync(Guid id);
}
```

#### 5. Service Olustur
```csharp
// Services/MaterialGroupService.cs
public class MaterialGroupService : IMaterialGroupService
{
    private readonly IndustryDBContext _context;

    public MaterialGroupService(IndustryDBContext context)
    {
        _context = context;
    }

    public async Task<List<MaterialGroup>> GetAllAsync()
    {
        return await _context.MaterialGroups.ToListAsync();
    }

    public async Task<MaterialGroup> GetByIdAsync(Guid id)
    {
        return await _context.MaterialGroups
            .AsTracking()  // ONEMLI: Guncelleme/silme icin AsTracking kullan
            .FirstOrDefaultAsync(x => x.Id == id)
            ?? throw new NotFoundException("Malzeme grubu bulunamadi");
    }

    public async Task<MaterialGroup> CreateAsync(MaterialGroup model)
    {
        _context.MaterialGroups.Add(model);
        await _context.SaveChangesAsync();
        return model;
    }
    // ... Update ve Delete
}
```

#### 6. DI'a Kaydet
```csharp
// Program.cs
builder.Services.AddScoped<IMaterialGroupService, MaterialGroupService>();
```

#### 7. Controller Olustur
```csharp
// Controllers/MaterialGroupController.cs
[ApiController]
[Route("api/[controller]")]
public class MaterialGroupController : ControllerBase
{
    private readonly IMaterialGroupService _service;

    public MaterialGroupController(IMaterialGroupService service)
    {
        _service = service;
    }

    [HttpGet]
    [YetkiDenetimi(Permissions.Ayarlar.All)]
    public async Task<ActionResult> GetAll()
    {
        var result = await _service.GetAllAsync();
        return Ok(result);
    }

    [HttpPost]
    [YetkiDenetimi(Permissions.Ayarlar.All)]
    public async Task<ActionResult> Create([FromBody] MaterialGroup model)
    {
        var result = await _service.CreateAsync(model);
        return Ok(result);
    }
}
```

### Kritik Kurallar (Backend)

| Kural | Aciklama |
|-------|----------|
| **AsTracking()** | EF Core varsayilan olarak NoTracking kullanir. Update/Delete islemlerinde `.AsTracking()` eklemelisiniz |
| **Enum -> String** | Enum'lar veritabaninda string olarak saklanir. `IndustryDBContext.OnModelCreating` icinde `HasConversion` kaydi gerekir |
| **BaseFullModel** | Tum entity'ler `BaseFullModel<Guid>` icinden turetilir (Id, CreateDate, CreatorId, EditDate, EditorId) |
| **YetkiDenetimi** | Standart `[Authorize]` KULLANILMAZ. Ozel `[YetkiDenetimi(Permissions.X.Y)]` attribute'u kullanilir |
| **Async/Await** | Tum servis ve controller metodlari async olmalidir |

### Base Model Yapisi

```
BaseFullModel<Guid>
├── Guid Id                 (Primary Key - otomatik UUID)
├── DateTime? CreateDate    (Olusturma tarihi)
├── Guid? CreatorId         (Olusturan kullanici)
├── DateTime? EditDate      (Son duzenleme tarihi)
└── Guid? EditorId          (Son duzenleyen kullanici)
```

### Hata Yonetimi

Global `ExceptionHandlingMiddleware` tum hatalari yakalar:

| Exception Tipi | HTTP Kodu | Aciklama |
|---------------|-----------|----------|
| `NotFoundException` | 404 | Kayit bulunamadi |
| `ValidationException` | 400 | Gecersiz veri |
| `UnauthorizedException` | 403 | Yetkisiz erisim |
| `BusinessException` | 422 | Is kurali ihlali |
| Diger hatalar | 500 | Beklenmeyen hata |

---

## 6. UI Katmani (Frontend)

### Dosya Yapisi

```
C:\rynSoft\quvex\smallFactoryUI\src\
├── @core/                       # Vuexy template cekirdegi
│   ├── components/              # Temel bilesenler (avatar, spinner, wizard...)
│   ├── layouts/                 # Sayfa duzenleri (Horizontal, Vertical, Blank)
│   │   └── components/
│   │       ├── navbar/          # Ust navigasyon cubugu
│   │       ├── footer/          # Alt bilgi
│   │       └── menu/            # Menu bilesenleri
│   └── scss/                    # Bootstrap + tema SCSS dosyalari
│       └── base/
│           ├── bootstrap-extended/  # Bootstrap degisken overrides
│           ├── components/          # Dark theme degiskenleri
│           └── themes/              # Tema varyantlari
├── assets/
│   ├── images/logo/             # Quvex logo dosyalari (SVG)
│   └── scss/style.scss          # Ana ozel stil dosyasi
├── configs/
│   ├── themeConfig.js           # Genel tema ayarlari
│   └── antdTheme.js             # Ant Design v5 tema tokenlari (light + dark)
├── navigation/
│   └── horizontal/index.js      # Menu yapisini tanimlar (tum moduller)
├── redux/
│   ├── store.js                 # Redux store
│   ├── rootReducer.js           # Kok reducer
│   ├── authentication.js        # Auth state
│   └── layout.js                # Tema/layout state (light/dark)
├── router/routes/index.js       # TUM ROTALAR BURADA (72 rota)
├── services/                    # API servis katmani (41 servis)
│   ├── api.js                   # Axios base client
│   ├── errorHandler.js          # Hata yonetimi
│   └── [modul]Service.js        # Her modul icin bir servis dosyasi
├── utility/
│   ├── Constants.js             # Sabitler, enum'lar
│   ├── Utils.js                 # Yardimci fonksiyonlar
│   ├── context/ThemeColors.js   # Tema renk context'i
│   └── hooks/                   # Custom React hook'lari
├── views/
│   ├── Home.js                  # Ana dashboard sayfasi
│   ├── Login.js                 # Giris sayfasi
│   └── modul/                   # MODUL SAYFALARI (132 bilesen)
│       ├── dashboard/           # Dashboard grafikleri
│       ├── production/          # Uretim modulu (13 dosya)
│       ├── product/             # Urun/Stok formlari
│       ├── stock/               # Stok yonetimi
│       ├── customer/            # Musteri yonetimi
│       ├── offer/               # Teklif yonetimi
│       ├── invoice/             # Fatura islemleri
│       ├── purchase/            # Satin alma
│       ├── sale/                # Satis modulu
│       ├── quality/             # Kalite modulu (21 dosya)
│       ├── maintenance/         # Bakim & OEE
│       ├── accounting/          # Muhasebe
│       ├── hr/                  # IK & Vardiya
│       ├── reports/             # Raporlar & KPI
│       ├── settings/            # Ayarlar (27 dosya)
│       └── tasks/               # Gorev yonetimi
└── App.js                       # Ana uygulama bileseni
```

### Yeni Bir Sayfa Nasil Eklenir? (Adim Adim)

Ornek: "Malzeme Gruplari" sayfasi eklemek

#### 1. Service Olustur
```javascript
// src/services/materialGroupService.js
import api from './api'

const materialGroupService = {
  getAll: () => api.get('/api/MaterialGroup'),
  getById: (id) => api.get(`/api/MaterialGroup/${id}`),
  create: (data) => api.post('/api/MaterialGroup', data),
  update: (id, data) => api.put(`/api/MaterialGroup/${id}`, data),
  delete: (id) => api.delete(`/api/MaterialGroup/${id}`)
}

export default materialGroupService
```

#### 2. Sayfa Bileseni Olustur
```jsx
// src/views/modul/settings/materialGroups/MaterialGroups.js
import { Table, Button, Modal, Form, Input, Space, Popconfirm } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useState, useEffect, useRef } from 'react'
import { Card, CardBody, CardHeader, CardTitle } from 'reactstrap'
import materialGroupService from '../../../../services/materialGroupService'
import UILoader from '../../../../@core/components/ui-loader'

const MaterialGroups = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  // ... CRUD islemleri
}

export default MaterialGroups
```

#### 3. Rota Ekle
```javascript
// src/router/routes/index.js
{
  path: '/settings/material-groups',
  component: lazy(() => import('../../views/modul/settings/materialGroups/MaterialGroups'))
},
```

#### 4. Menuye Ekle
```javascript
// src/navigation/horizontal/index.js
// Settings children icine:
{
  id: 'material-groups',
  title: 'Malzeme Gruplari',
  icon: <Grid size={16} color={c.settings} />,
  navLink: '/settings/material-groups',
}
```

### Tema Sistemi

Quvex iki katmanli tema sistemi kullanir:

**1. Bootstrap/SCSS Katmani** (Reactstrap bilesenleri icin):
- `@core/scss/base/bootstrap-extended/_variables.scss` - Renk degiskenleri
- `@core/scss/base/components/_variables-dark.scss` - Dark mod
- `assets/scss/style.scss` - Ozel CSS (--qx-* custom properties)

**2. Ant Design ConfigProvider** (antd bilesenleri icin):
- `configs/antdTheme.js` - Light ve dark tema tokenlari
- `App.js` icinde Redux `skin` state'ine gore otomatik degisir

```
Redux layout.skin ("light" / "dark")
    |
    +--> body class (.dark-layout) --> Bootstrap/SCSS
    |
    +--> ConfigProvider theme={lightTheme/darkTheme} --> Ant Design
```

### Renk Paleti

| Renk | Hex (Light) | Hex (Dark) | Kullanim |
|------|-------------|------------|----------|
| Primary | `#6366f1` | `#818cf8` | Ana renk, butonlar, linkler |
| Success | `#10b981` | `#34d399` | Basari, onay |
| Warning | `#f59e0b` | `#fbbf24` | Uyari |
| Danger | `#f43f5e` | `#fb7185` | Hata, silme |
| Info | `#06b6d4` | `#22d3ee` | Bilgi |
| Background | `#f4f5fa` | `#12142a` | Sayfa arka plan |
| Card BG | `#ffffff` | `#1e2140` | Kart arka plan |
| Border | `#e8e9f5` | `#2e3360` | Cerceveler |

### Menu Renkleri (Modul Bazli)

Her modulun kendine ozel ikon rengi vardir:
- Anasayfa: Indigo (`#6366f1`)
- Gorevler: Amber (`#f59e0b`)
- Stok: Cyan (`#06b6d4`)
- Satinalma: Violet (`#8b5cf6`)
- Satis: Emerald (`#10b981`)
- Uretim: Orange (`#f97316`)
- Muhasebe: Teal (`#14b8a6`)
- Kalite: Pink (`#ec4899`)
- Bakim: Red (`#ef4444`)
- IK: Blue (`#3b82f6`)
- Raporlar: Purple (`#a855f7`)
- Ayarlar: Slate (`#64748b`)

### API Cagri Deseni

```javascript
// Servis dosyasi (services/xxxService.js)
import api from './api'

// api.js axios instance kullanir: base URL = REACT_APP_API_ENDPOINT
// Tum istekler otomatik olarak base URL'e eklenir

// GET istegi
api.get('/api/Product', { page: 1, size: 20 })

// POST istegi
api.post('/api/Product', { name: 'Yeni Urun', unit: 'Adet' })

// PUT istegi
api.put('/api/Product/GUID', { name: 'Guncellenmis Urun' })

// DELETE istegi
api.delete('/api/Product/GUID')
```

### Sik Kullanilan Bilesenler

| Bilesen | Kaynak | Kullanim Alani |
|---------|--------|---------------|
| `<Table>` | antd | Veri tablolari |
| `<Modal>` | antd | Form diyaloglari |
| `<Form>`, `<Form.Item>` | antd | Form yonetimi |
| `<Select>`, `<Input>` | antd | Form alanlari |
| `<Tag>` | antd | Durum etiketleri |
| `<Collapse>` | antd | Filtre panelleri |
| `<Popconfirm>` | antd | Silme onay diyalogu |
| `<Card>`, `<CardBody>` | reactstrap | Kart layout |
| `<Row>`, `<Col>` | reactstrap | Grid layout |
| `<UILoader>` | @core | Yukleme animasyonu |
| `<Tabs>` | antd | Tab navigasyonu |

---

## 7. Veritabani

### Baglanti Bilgileri
- **Host:** localhost:5432 (Docker)
- **DB Adi:** quvex_dev
- **Container:** smallfactory-postgres

### Tablo Sayisi
128+ tablo (DbSet koleksiyonu)

### Temel Tablolar

```
                     +----------------+
                     |   AspNetUsers   |  (Kullanicilar)
                     +--------+-------+
                              |
              +---------------+--------------+
              |                              |
     +--------v-------+            +--------v--------+
     |   Productions   |            |     Offers      |
     | (Uretim Sip.)   |            | (Sat. Teklifleri)|
     +--------+-------+            +---------+-------+
              |                               |
     +--------v-------+            +----------v------+
     |   WorkOrder     |            |  OfferProducts   |
     | (Is Emirleri)   |            | (Teklif Kaleml.) |
     +--------+-------+            +-----------------+
              |
     +--------v-------+
     | WorkOrderSteps  |     +----------------+     +----------------+
     | (Is Adimları)   |     |    Products    |<--->| StockWarehouses|
     +----------------+      | (Urunler)      |     | (Depo Stoklari)|
                             +--------+-------+     +----------------+
                                      |
                    +-----------------+-----------------+
                    |                 |                 |
           +--------v---+    +-------v------+   +------v--------+
           |  StockLot   |    | StockReceipt |   |    Invoice    |
           | (Lot Takip) |    | (Stok Giris) |   | (Faturalar)   |
           +------------+    +--------------+   +-------+-------+
                                                         |
                                                 +-------v-------+
                                                 |  InvoiceItem   |
                                                 | (Fatura Kalm.) |
                                                 +---------------+

     +----------------+     +----------------+     +----------------+
     |   Customer     |     |   Machines     |     | MaintenancePlan|
     | (Musteriler)   |     | (Makineler)    |     | (Bakim Plani)  |
     +----------------+     +--------+-------+     +----------------+
                                      |
                              +-------v--------+
                              |      Oee       |
                              | (OEE Verileri) |
                              +----------------+
```

### Migration Yonetimi

```bash
# Yeni migration olustur (model degisikliginden sonra)
dotnet ef migrations add <MigrationAdi> --project Industry.API/Industry.API.csproj

# Migration uygula
dotnet ef database update --project Industry.API/Industry.API.csproj

# Son migration'i geri al
dotnet ef migrations remove --project Industry.API/Industry.API.csproj
```

> **ONEMLI:** Migration olusturmadan once API'nin KAPALI olmasi gerekir (DLL kilidi sorunu).

---

## 8. Kimlik Dogrulama ve Yetkilendirme

### Giris Akisi

```
1. Kullanici login ekraninda e-posta + sifre girer
2. POST /api/Account/authenticate
3. API: Identity UserManager ile dogrulama
4. Basarili ise JWT token uretilir
5. Token localStorage'a kaydedilir
6. Sonraki istekler Authorization: Bearer <token> header'i ile gonderilir
```

### YetkiDenetimi Akisi

```
HTTP Istegi --> Controller Method
    |
    +--[YetkiDenetimi("Stok.Goruntule")]
    |
    +-- 1. Authorization header'dan token al
    |-- 2. RefreshToken tablosundan token dogrula (10dk cache)
    |-- 3. UserManager ile kullaniciyi bul
    |-- 4. Kullanicinin rolunu ve rol claim'lerini al
    |-- 5. Gerekli yetkiyi (Stok.Goruntule) kontrol et
    |-- 6. Token suresi +2 saat uzatilir
    |-- 7. Yetki varsa --> Controller calismaya devam eder
    |   Yetki yoksa --> 403 Forbidden
```

### Yetki Modulleri (15 Modul, 55+ Yetki)

```
Permissions.cs:

Stok          --> Goruntule, Kaydet, Sil
Uretim        --> Goruntule, Kaydet, Sil
Satis         --> Goruntule, Kaydet, Sil
Musteri       --> Goruntule, Kaydet, Sil
Teklif        --> Goruntule, Kaydet, Sil
Satinalma     --> Goruntule, Kaydet, Sil
Fatura        --> Goruntule, Kaydet, Sil
Kalite        --> Goruntule, Kaydet, Sil
Bakim         --> Goruntule, Kaydet, Sil
IK            --> Goruntule, Kaydet, Sil
Rapor         --> Goruntule
MRP           --> Goruntule, Kaydet
Proje         --> Goruntule, Kaydet, Sil
Dokuman       --> Goruntule, Kaydet, Sil
Bildirim      --> Goruntule, Kaydet
Muhasebe      --> Goruntule, Kaydet
Kullanici     --> Goruntule, Kaydet, Sil
Role          --> Goruntule, Kaydet, Sil
Ayarlar       --> All
```

---

## 9. Modul Haritasi ve Is Akislari

### Modul Ozeti

| # | Modul | Rota | Controller | Aciklama |
|---|-------|------|-----------|----------|
| 1 | **Anasayfa** | `/home` | ChartController, ReportController | Dashboard, KPI, grafikler |
| 2 | **Gorevler** | `/tasks` | TasksController | Kisisel gorev yonetimi |
| 3 | **Stok** | `/stocks`, `/stock/*` | ProductController, Stock*Controller | Urun, depo, stok islemleri |
| 4 | **Satinalma** | `/purchase-*` | StockRequestsController | Satin alma talepleri, teklifler |
| 5 | **Satis** | `/customers`, `/offers`, `/sales` | CustomerController, OfferController, SalesController | Musteri, teklif, satis |
| 6 | **Uretim** | `/production` | ProductionController, ProductionPlanningController | Siparis, is emri, planlama |
| 7 | **Muhasebe** | `/invoices`, `/accounting/*` | InvoiceController, BillingDetailsController | Fatura, sevk, odeme |
| 8 | **Kalite** | `/quality/*` | 15+ controller | NCR, CAPA, SPC, FAI, Kalibrasyon... |
| 9 | **Bakim** | `/maintenance`, `/oee` | MaintenanceController, OeeController | Bakim planlari, OEE, ariza |
| 10 | **IK** | `/hr`, `/documents` | HrController, DocumentController | Personel, vardiya, dokuman |
| 11 | **Raporlar** | `/reports`, `/reports/kpi` | ReportController, KpiController | Uretim, stok, satis raporlari |
| 12 | **Ayarlar** | `/settings/*` | RoleController, MachinesController... | Kullanicilar, roller, makineler |

### Siparis-Uretim Is Akisi (Ana Akis)

```
[1. TEKLIF]
Musteri teklif ister
    |
    v
Teklif olusturulur (Offers)
    |-- Urun kalemleri eklenir (OfferProducts)
    |-- Fiyat hesaplanir
    |-- Musteriye gonderilir
    |
    v
Musteri onaylar
    |
    v
[2. SIPARIS / URETIM EMRI]
Uretim siparisi olusturulur (Productions)
    |-- Status: "Bekliyor"
    |-- Urun ve miktar belirlenir
    |
    v
[3. MRP - MALZEME PLANLAMA]
BOM patlatilir (BomExplosion)
    |-- Urun agaci cozumlenir
    |-- Net ihtiyaclar hesaplanir (NetRequirement)
    |-- Stoktan dusulur
    |-- Eksik malzeme icin satin alma talebi olusturulur (PurchaseSuggestion)
    |
    v
[4. IS EMRI]
Is emri olusturulur (WorkOrder)
    |-- Is emri adimlari tanimlanir (WorkOrderSteps)
    |-- Makineye atanir
    |-- Operator atanir
    |
    v
[5. URETIM BASLAR]
Status: "Uretimde"
    |-- Operatorler is emri adimlarini tamamlar
    |-- Calisma kayitlari tutulur (WorkOrderLogs)
    |-- Malzeme tuketimi kaydi (UseStockUp)
    |-- Fire kaydi (ScrapTracking)
    |
    v
[6. KALITE KONTROL]
Uretilen urun kontrol edilir
    |-- Giris kontrol (IncomingInspection)
    |-- SPC olcumleri (SpcDataPoint)
    |-- Uygunsuzluk varsa NCR acilir
    |-- CAPA sureci baslatilir
    |
    v
[7. TAMAMLAMA]
Status: "Tamamlandi"
    |-- Stoga giris yapilir (StockReceipt)
    |-- Lot/Parti numarasi atanir (StockLot)
    |
    v
[8. SEVKIYAT]
Musteri sevk formu olusturulur (ShippingDetails)
    |-- Irsaliye kesilir
    |
    v
[9. FATURALAMA]
Fatura olusturulur (Invoice)
    |-- KDV hesaplanir (TaxCalculation)
    |-- E-fatura gonderilir (EInvoice)
    |
    v
[10. ODEME TAKIBI]
Odeme kaydi yapilir (Payment)
    |-- Musteri ekstre (CustomerStatement)
    |-- Bakiye takibi
```

### Stok Yonetimi Is Akisi

```
STOK GIRISI                          STOK CIKISI
-----------                          -----------
Satin alma geldi                     Uretim icin malzeme
    |                                    |
    v                                    v
StockReceipt (Giris Fisi)           UseStockUp (Uretim Tuketim)
    |                                    |
    +-- Depo secimi (Warehouses)         +-- Is emri referansi
    +-- Lot atamasi (StockLot)           +-- Miktar dusumu
    +-- Giris kontrol (Inspection)       |
    |                                    v
    v                                StockWarehouses guncellenir
StockWarehouses guncellenir              |
    |                                    v
    v                                Min stok kontrolu
Min/Max stok kontrolu                   |
    |                                Stok uyarisi < min ise
    +-- Stok uyarisi (StockAlert)       |
    +-- Oto satin alma talebi           +-- Otomatik satin alma talebi

STOK SAYIMI                          STOK DEGERLEME
-----------                          ---------------
StockCount olusturulur               FIFO veya Ortalama Maliyet
    |                                hesaplanir (StockValuation)
    v
StockCountItem satir satir sayilir
    |
    v
Farklar kaydedilir
    |
    v
Onaylanirsa stok miktari guncellenir
```

### Kalite Yonetimi Modulleri

```
KALITE YONETIM SISTEMI
========================

TEMEL KALITE                    ILERI KALITE                  UYUMLULUK
-----------                     -----------                   ---------
NCR (Uygunsuzluk)             SPC (Istatistik Kontrol)      FAI (AS9102)
CAPA (Duz./Onl. Faaliyet)     FMEA (Risk Analizi)           PPAP
Giris Kontrol                  Kontrol Planlari              Konfigürasyon Yonetimi
Kalibrasyon                    Tedarikci Degerlendirme       Ozel Prosesler
                               Ic Denetim                    FOD Onleme
                               Egitim & Yetkinlik            Sahte Parca Onleme
                               Tasarim & Gelistirme          Urun Guvenligi
                               Tedarik Zinciri Risk          Musteri Mulkiyeti
```

---

## 10. Kod Yazim Standartlari

### Backend (C#)
- **Async/Await:** Tum servis metodlari async olmali
- **Naming:** PascalCase (sinif, metod), camelCase (degisken, parametre)
- **DI:** Constructor injection kullan (field injection degil)
- **Null Safety:** Nullable reference types aktif (`string?`)
- **Exception:** Is kurali hatalari icin `BusinessException` kullan
- **Commit Format:** `[FAZ{N}][TASK_ID] Aciklama`

### Frontend (JavaScript/React)
- **Fonksiyonel Bilesenler:** Class component KULLANMA
- **Hooks:** useState, useEffect, useRef, useContext
- **State:** Genel state icin Redux, local state icin useState
- **Import Sirasi:** React -> 3rd party -> local bilesenler -> servisler -> stiller
- **Dosya Adlandirma:** PascalCase (bilesenler), camelCase (servisler)
- **API Cagrilari:** Servis dosyasi uzerinden (dogrudan axios kullanma)

### Ortak
- **Turkce Label:** Tum UI metinleri Turkce
- **Yorum:** Sadece karmasik is mantigi icin yorum yaz
- **DRY:** Tekrarlayan kodu utility veya ortak bilesene tasi
- **KISS:** Basit tut, over-engineering'den kacin

---

## 11. Test Stratejisi

### Backend Testleri (79 test dosyasi)
- **Framework:** xUnit + Moq + FluentAssertions
- **Konum:** `Industry.API.Tests/`
- **Calistirma:** `dotnet test Industry.API.Tests/Industry.API.Tests.csproj`

```bash
# Tum testleri calistir
dotnet test

# Belirli bir servis testini calistir
dotnet test --filter "FullyQualifiedName~ProductServiceTests"
```

### Frontend Testleri (43 test dosyasi)
- **Framework:** Vitest + Testing Library
- **Konum:** `src/services/__tests__/`, `src/views/__tests__/`
- **Calistirma:**

```bash
# Tum testleri calistir
npx vitest run

# Izleme modunda calistir
npx vitest

# Coverage raporu
npx vitest run --coverage
```

### Test Kaliplari

**Backend Service Test:**
```csharp
public class ProductServiceTests
{
    private readonly Mock<IUnitOfWork> _unitOfWork;
    private readonly ProductService _sut;

    public ProductServiceTests()
    {
        _unitOfWork = new Mock<IUnitOfWork>();
        _sut = new ProductService(_unitOfWork.Object);
    }

    [Fact]
    public async Task GetAll_ReturnsProducts()
    {
        // Arrange
        _unitOfWork.Setup(x => x.Products.GetAll()).ReturnsAsync(testData);
        // Act
        var result = await _sut.GetAllAsync();
        // Assert
        result.Should().HaveCount(3);
    }
}
```

**Frontend Service Test:**
```javascript
import { describe, it, expect, vi } from 'vitest'
import api from '../api'
import productService from '../productService'

vi.mock('../api')

describe('productService', () => {
  it('getAll calls GET /api/Product', async () => {
    api.get.mockResolvedValue({ data: [] })
    await productService.getAll()
    expect(api.get).toHaveBeenCalledWith('/api/Product')
  })
})
```

---

## 12. Deployment ve Ortamlar

### Ortamlar

| Ortam | UI | API | DB |
|-------|----|----|-----|
| **Development** | localhost:3000 | localhost:5052 | Docker localhost:5432 |
| **Test** | .env.test | - | Test DB |
| **BMT** | .env.bmt | - | BMT DB |
| **Saha** | .env.saha | - | Saha DB |

### Build Komutlari

```bash
# UI Production Build
cd C:\rynSoft\quvex\smallFactoryUI
NODE_OPTIONS=--openssl-legacy-provider npx craco build

# Ortama ozel build
npm run build:test    # .env.test ile
npm run build:bmt     # .env.bmt ile
npm run build:saha    # .env.saha ile

# API Production Build
cd C:\rynSoft\quvex\smallFactoryApi
dotnet publish Industry.API/Industry.API.csproj -c Release -o ./publish
```

---

## 13. Sikca Karsilasilan Sorunlar

### API Build Hatasi: "DLL kopyalanamadi"
**Sebep:** API calisirken build yapmaya calisildi
**Cozum:** Calisan API process'ini durdurun, sonra build yapin

### UI: `npm install` ERESOLVE hatasi
**Sebep:** @casl/react peer dependency uyusmazligi
**Cozum:** `npm install --legacy-peer-deps`

### UI: `NODE_OPTIONS` hatasi (build)
**Sebep:** OpenSSL legacy provider gerekli
**Cozum:** `NODE_OPTIONS=--openssl-legacy-provider npx craco build`

### EF Core: AsTracking unutuldu
**Belirti:** Update/Delete islemlerinde degisiklik kaydedilmiyor
**Sebep:** Default NoTracking modu
**Cozum:** `.AsTracking()` ekleyin: `_context.Products.AsTracking().First()`

### Ant Design Dark Mode calismadi
**Sebep:** SCSS ile Ant Design CSS-in-JS tema sistemi farkli
**Cozum:** `ConfigProvider` ile tema tokenlari kullanin (antdTheme.js), SCSS `!important` hack'leri KULLANMAYIN

### Menu dropdown tiklanmiyor
**Sebep:** CSS `overflow: hidden` veya `margin-top` dropdown'u kesiyor
**Cozum:** `.horizontal-menu-wrapper` icin overflow ve margin degerlerini kontrol edin

### Customer endpoint'e type parametresi
**Sebep:** `/Customer` endpoint'i `type` query parametresi bekler
**Cozum:** `?type=customers` veya `?type=suppliers` kullanin (path degil, query param)

---

## 14. Yol Haritasi

| Faz | Baslik | Durum | Icerik |
|-----|--------|-------|--------|
| **Faz 1** | Temel Duzeltmeler | TAMAMLANDI | Guvenlik, altyapi, repository pattern, test |
| **Faz 2** | Finansal Temel | TAMAMLANDI | Fatura, vergi, odeme, maliyet |
| **Faz 3** | Uretim Olgunlastirma | TAMAMLANDI | Planlama, MRP, kalite, kapasite |
| **Faz 4** | Stok ve Tedarik Zinciri | DEVAM EDIYOR | Stok sayim, lot, degerleme, barkod, min/max |
| **Faz 5** | Raporlama ve Bildirimler | PLANLI | Raporlar, KPI, bildirimler, Excel export |
| **Faz 6** | Entegrasyon | PLANLI | e-Fatura, Excel import, API dokumantasyon |
| **Faz 7** | Ileri Ozellikler | PLANLI | Bakim, IK, OEE, ileri MRP, DMS |

### Toplam Test Sayisi: 411+ (API: 79 dosya, UI: 43 dosya)

---

## Hizli Referans

| Ne Yapacagim? | Nereye Bakacagim? |
|---------------|-------------------|
| Yeni API endpoint | `Controllers/` + `Services/` + `Interfaces/` + `Program.cs` |
| Yeni UI sayfasi | `views/modul/` + `services/` + `router/routes/index.js` + `navigation/horizontal/index.js` |
| Yeni DB tablosu | `Models/` + `DataAccess/IndustryDBContext.cs` + migration |
| Tema degistirme | `configs/antdTheme.js` + `assets/scss/style.scss` |
| Yetki ekleme | `Utilities/Permissions.cs` + Controller'da `[YetkiDenetimi]` |
| Filtre ekleme | Controller GET endpoint + UI'da `Collapse > Form` |
| Enum ekleme | `Constants/` + `IndustryDBContext.OnModelCreating` HasConversion |
| Test yazma | `Industry.API.Tests/Services/` veya `src/services/__tests__/` |

---

---

## 15. Sektor Bazli 5-Dakika Onboarding (Sprint 11)

Sprint 11 ile Quvex, yeni bir tenant'in **20 dakikadan 3 dakikaya** (7.5x hizli) hazir hale gelmesini saglayan "5-Dakika Onboarding" sistemini ekledi. Yeni kullanici sektorunu secer → sistem otomatik olarak o sektore ozgu ornek musteriler, urunler, makineler ve yapilandirmalari seed eder.

### 15.1 Akis

```
Kullanici (yeni tenant)
    |
    v
OnboardingWizard.js
    |
    v
Sektor secimi (10 UI secenek)
    |
    v
Otomatik mapping (10 UI sektor -> 8 API template)
    |
    v
POST /Onboarding/seed-demo/{sectorCode}
    |
    v
IOnboardingService.SeedSectorDemoDataAsync(sectorCode)
    |
    v
SectorDemoTemplates.cs -> ilgili sablon
    |
    v
Musteri + Urun + Makine + Sektor Extras seed (idempotent)
    |
    v
Dashboard'a yonlendirme (3 dk tamam)
```

### 15.2 8 Sektor Sablonu

| Sektor | Ornek Musteriler | Urunler | Makineler | Sektor Ekstra |
|--------|------------------|---------|-----------|---------------|
| **CNC** | ASELSAN, ROKETSAN, HAVELSAN, BAYKAR, FNSS | 5 parca (flan$, bushing, bracket, pin, housing) | DMG MORI, Mazak, Haas | 2 ornek iş emri |
| **Tekstil** | KOTON, LC Waikiki, Mavi | Gomlek, Bluz | Juki diki$ makinesi, kesim | **ProductVariants** (beden×renk) |
| **Gida** | Migros, BIM, CarrefourSA | Yogurt, Biskuvi | Pastorizator, Dolum | **3 HACCP CCP** (pasto, sogutma, metal detektor) |
| **Otomotiv** | Ford Otosan, TOFAS, BMC | Conta, braket | Vulkanizasyon, CNC | PPAP-hazir urunler |
| **Plastik** | Coca-Cola, Yildiz Holding | Pet sise, bidon | Arburg enjeksiyon | **2 Mold** (kalip shot counter ile) |
| **Metal** | Migros (raf), ISKI | Raf sistemi, yangin kapisi | Plazma, abkant | EN 1090 uyumlu |
| **Mobilya** | Hilton, IKEA | Otel mobilya seti | Biesse CNC router | Lake boya proses |
| **Makine** | Sagliklı Gida, Anadolu | Konveyor, paketleme makinesi | CNC torna, freze | CE Technical File hazir |

### 15.3 API

**Service:**
```csharp
public interface IOnboardingService
{
    Task<SeedResult> SeedSectorDemoDataAsync(string sectorCode);
}
```

**Endpoint:**
```
POST /Onboarding/seed-demo/{sectorCode}
```

**Ozellikler:**
- **Idempotent:** Ayni sektor tekrar cagirilsa duplicate olu$maz (kontrol: tenant zaten seed edilmi$ mi)
- **Atomic:** Transaction icinde — hata olursa rollback
- **Tenant-izole:** Yalnizca cagiran kullanicinin tenant'inda seed yapilir
- **Sektor Ekstra Handling:** Sablon "HACCP" ekstrasi iceriyorsa HaccpControlPoint kayitlari da olu$ur

**Sablon dosyasi:** `SectorDemoTemplates.cs`

### 15.4 UI

**OnboardingWizard.js (genisletildi):**
- Adim 1: Tenant bilgileri (isim, logo, vb.)
- Adim 2: **Sektor secimi** (10 gorsel kart)
- Adim 3: Demo data onayi (hero banner)
- Adim 4: Seed yukleme + dashboard'a gecis

**10 UI sektor -> 8 API template mapping:**
```javascript
const sectorToTemplate = {
  'cnc-machining': 'cnc',
  'defense': 'cnc',
  'aerospace': 'cnc',
  'textile': 'textile',
  'food': 'food',
  'automotive': 'automotive',
  'plastic': 'plastic',
  'metal': 'metal',
  'furniture': 'furniture',
  'machinery': 'machinery',
};
```

### 15.5 Yeni Gelistirici Kurulumu

Sprint 11 ile gelen yeni modullerin kurulum notlari:

#### ProductVariant Modulu
```bash
# API tarafi
cd C:\rynSoft\smallFactoryApi
dotnet ef database update  # ProductVariant migration

# UI tarafi
# Yeni bile$en: ProductVariantMatrix.js
# Route: /product/:id/variants
```

#### HACCP/CCP + Recall Modulu
```bash
# 3 yeni entity icin migration
dotnet ef database update

# UI:
# - HaccpControlPointList.js
# - RecallWizard.js (7 adim)
# - RecallEventList.js
```

Migration adi: `Sprint11_NichesModules`

#### MoldInventory Modulu
```bash
# Tek entity
dotnet ef database update

# UI:
# - MoldList.js (shot counter kolonu)
# - MoldForm.js
```

#### CE Technical File Modulu
```bash
# 19 alan entity
dotnet ef database update

# UI:
# - CeTechnicalFileForm.js (sekme yapisi)
```

#### WPS/WPQR + Welder Certificate Modulu
```bash
# 2 entity
dotnet ef database update

# UI:
# - WpsList.js
# - WelderCertificateList.js (expiry renklendirme)
```

### 15.6 SignalR ProductionDashboardHub

Yeni real-time uretim panosu:

```
Hub endpoint: /hubs/production-board
Group: production_{tenantId}
Service: ProductionBoardService
Broadcast job: Hangfire, her 5 dakikada bir
Route (UI): /production/live-board (BlankLayout, TV-ready)
```

**Baglanti:**
```javascript
const conn = new signalR.HubConnectionBuilder()
  .withUrl('/hubs/production-board')
  .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
  .build();

conn.on('BoardUpdated', (data) => {
  // makine durumlari, aktif WO, trend, alerts
});
```

### 15.7 WhatsApp Notification Entegrasyonu

```
Service: IWhatsAppService / WhatsAppService
Provider: Meta Cloud Graph API
Config: appsettings.json -> WhatsApp:AccessToken, WhatsApp:PhoneNumberId
Resilience: Polly retry policy (3 retry, exponential backoff)
```

**Endpoint'ler:**
- `GET /WhatsApp/status`
- `POST /WhatsApp/send-test`
- `POST /WhatsApp/send`
- `POST /WhatsApp/send-template`
- `GET /WhatsApp/templates`

Yapilandirilmazsa graceful fallback (NotificationService hata vermez, yalnizca WhatsApp kanalini atlar).

---

> **Bu dokumanin guncellenmesi gerektiginde:** `/docs/ONBOARDING.md` dosyasini duzenleyin.
> **Sorular icin:** Proje reposu uzerinden issue aciniz.
