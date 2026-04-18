# ALTAY YAZILIM SAVUNMA - E2E Test Sonuc Raporu

**Test Tarihi:** 2026-04-13
**Senaryo Dosyasi:** `C:\rynSoft\quvex\quvex-docs\tests\ALTAY-YAZILIM-E2E-PLAN.md` (1948 satir)
**API:** https://api.quvex.io
**Test Betigi:** `C:\Users\Hakan\AppData\Local\Temp\altay_e2e.py` + `altay_e2e_fixup.py`
**Sonuc JSON:** `C:\Users\Hakan\AppData\Local\Temp\altay_results.json`

---

## Yonetici Ozeti

Bu test, Quvex ERP platformunda savunma sanayi senaryosu olan **ALTAY YAZILIM SAVUNMA** firmasinin Roketsan ve Aselsan icin askeri durbun uretim + satis surecini uctan uca test etmistir. Yepyeni bir tenant yaratilmis (Pro plan, defense sektoru), senaryoda tanimlanan tum ana kayitlar (musteri, tedarikci, urun, malzeme, makine, depo, finansal hesap, is emri, fatura, odeme, NCR/CAPA, bakim, vardiya) API uzerinden gerçek HTTP cagrilari ile olusturulmustur.

### Yeni Tenant Bilgileri

| Alan | Deger |
|------|-------|
| **Tenant ID** | `ad1b61fc-8712-4ef5-b03e-eda42c6fa28a` |
| **Firma Adi** | `ALTAY YAZILIM SAVUNMA 76107863` |
| **Admin Email** | `admin@altayyazilim-76107863.demo` |
| **Admin Sifre** | `Altay123!@#$%` |
| **Plan** | Pro (20 user, 14 gun trial) |
| **Sektor** | defense |
| **Register** | `POST /register` - **200 OK** (1564 ms) |
| **Provisioning** | Hangfire, 15 sn sonra ACTIVE |
| **Auth** | `POST /Account/authenticate` - 200 OK (refreshToken = Bearer) |

---

## Basari Oranlari

| Metrik | Deger |
|--------|-------|
| **Toplam API cagrisi** | **177** |
| Basarili (2xx) | **143** |
| Basarisiz (4xx/5xx) | **34** |
| **Basari orani** | **%80.8** |
| Toplam sure | ~109 sn (ilk kosu) + ~7 sn (fixup) |
| Ortalama yanit suresi | ~350 ms |

### Durum kodlarina gore basarisizlik dagilimi

| Status | Sayi | Ana Sebep |
|--------|------|-----------|
| **500** | 5 | `/Account/register` user creation icin sunucu hatasi (KRITIK) |
| **400** | 5 | `/Account/register` validation — `firstName/lastName` yerine `Name/SurName` bekliyor (first run, fix sonrasi 500'e dondu) |
| **404** | 23 | `/Role` POST yok, `/Bom` endpoint yok, `/PurchaseRequest` yok, bazi Sprint 11/12 endpoint'leri deploy edilmemis |
| **405** | 1 | `/ProductVariant` GET allowed degil |

---

## Akis Ozeti (Faz bazinda)

| Faz | Aciklama | Durum | Not |
|-----|----------|-------|-----|
| **FAZ 0** | Tenant register + auth | OK | Self-register 1.5 sn, Hangfire provisioning 15 sn |
| **FAZ 1** | Roller | **FAIL** | `POST /Role` 404 — role CRUD yok (register sirasinda seed ediliyor) |
| **FAZ 2** | Makineler (4 adet) | OK | `MONTAJ-01, OPTIK-01, MONTAJ-02, TEST-01` olusturuldu |
| **FAZ 2** | Kullanicilar (5 adet) | **FAIL** | ILK: 400 (Name/SurName), FIX: 500 sunucu hatasi — BUG-01 |
| **FAZ 3** | Is emri sablonu | Atlandi | Dependency yuzunden (WOT create'e baglanabilir ama fixup'a dahil edilmedi) |
| **FAZ 4** | Depolar (3 adet) | OK | `HAMMADDE, MAMUL, SEVKIYAT` |
| **FAZ 4** | Hammaddeler (6) + Durbun urun | OK | Tumu olusturuldu, USD currency |
| **FAZ 4** | BOM | **FAIL/WORKAROUND** | `POST /Bom` 404. `PUT /Product/{id}` ile `parentProductId` atayarak hal edildi (6/6 OK). BomExplosion endpoint'i mevcut fakat tenant-aware hatasi: BUG-02 |
| **FAZ 5** | Tedarikciler (6) | OK | Optik-Tek, Gorus Optik, Altin Metal, Savunma Govde, Kristal Cam, Baglanti |
| **FAZ 5** | Musteriler (2) | OK | Roketsan + Aselsan |
| **FAZ 6** | Finansal hesaplar (3) | OK | Ana Kasa (TRY), Dolar Kasa (USD), Ziraat Bankasi (TRY) |
| **FAZ 7A** | Satin alma talepleri | **FAIL** | `POST /PurchaseRequest` 404 — endpoint yok |
| **FAZ 7C** | Satin alma siparisleri (3 PO) | OK | USD, KDV %20 |
| **FAZ 7D** | Stok girisleri (9) | OK | 6 malzeme icin StockReceipts, 3 acilis stok |
| **FAZ 11C** | Giris kontrol (3) | OK | Lens/Mercek/Tutucu PASS |
| **FAZ 7E** | Alis faturalari (3) | OK | USD, exchangeRate 42.95 |
| **FAZ 7F** | Altin Metal pesin odeme | OK | $240 |
| **FAZ 8** | Roketsan-1 teklif+siparis (5 ad) | OK | Offer -> OfferProduct -> Sales -> Approve, ama otomatik Production olusmadi (BUG-03) |
| **FAZ 9** | Roketsan-1 uretim adimlari | Atlandi | productionId resolve edilemedi — BUG-03 |
| **FAZ 13A-B** | Aselsan teklif+siparis (4 ad) | OK | Offer cycle OK |
| **FAZ 12** | Roketsan-1 satis faturasi + tahsilat | OK | $100.000 Ana Kasa'ya |
| **FAZ 13C** | Aselsan satis faturasi | OK | $80.000 SENT |
| **FAZ 11** | NCR + CAPA (2 set) | OK | Lens cizik NCR/CAPA + Mercek odak NCR/CAPA |
| **FAZ 14** | 2. Tur satin alma (Lens 20, Mercek 10) | OK | PO + StockReceipt + Invoice |
| **FAZ 15** | Roketsan-2 (10 ad) | OK | Offer cycle + Invoice (odeme yok) |
| **FAZ 16A** | 3. Tur satin alma (Mercek 10, Tutucu 15) | OK | PO + Receipt |
| **FAZ 16B** | Roketsan-3 (8 ad) | OK | Offer cycle + Invoice |
| **FAZ 17** | Aselsan tahsilat | OK | $80.000 Ziraat Bankasi |
| **FAZ 20** | Bakim plani (OPTIK-01) | OK | Haftalik PREVENTIVE |
| **FAZ 21** | HR: vardiya + izin | OK | Sabah/Aksam vardiya + annual leave |
| **FAZ 22** | Dashboard + rapor read probes | **Cogunlukla OK** | 26/36 GET OK |
| **FAZ 23** | Dosya yonetimi + sozluk | Atlandi | Multipart upload skip |

---

## Olusturulan Kayit Listesi

### Ana kayitlar (orneklerle)

| Modul | Adet | Ornek ID |
|-------|------|----------|
| **Tenant** | 1 | `ad1b61fc-8712-4ef5-b03e-eda42c6fa28a` |
| **Admin User** | 1 | `003464e1-91bc-4a59-b9fa-dd95e4ba5b24` |
| **Machines** | 4 | MONTAJ-01, OPTIK-01, MONTAJ-02, TEST-01 |
| **Warehouses** | 3 | HAMMADDE, MAMUL, SEVKIYAT |
| **Materials (hammadde)** | 6 | MLZ-001..006 |
| **Product (mamul)** | 1 | Askeri Durbun (`52c3cebb-339e-4d12-a0ee-a95e42fcb3b3`) |
| **BOM baglantilari** | 6 | Her malzemeye parentProductId=durbunId (PUT ile) |
| **Suppliers** | 6 | Optik-Tek, Gorus Optik, Altin Metal, Savunma Govde, Kristal Cam, Baglanti |
| **Customers** | 2 | Roketsan, Aselsan |
| **FinancialAccounts** | 3 | Ana Kasa (TRY 50k), Dolar Kasa (USD 5k), Ziraat (TRY 200k) |
| **PurchaseOrders** | 7 | 3 (1.tur) + 2 (2.tur) + 2 (3.tur) |
| **StockReceipts** | 11 | 6 acilis + 3 (1.tur) + 2 (2.tur) + 2 (3.tur) — hepsi OK |
| **IncomingInspections** | 3 | PASS |
| **Purchase Invoices** | 7 | 3 + 2 + 2 — USD |
| **Sales Offers** | 4 | Roketsan-1,2,3 + Aselsan |
| **OfferProducts** | 4 | (her offer'in kalemi) |
| **Sales** | 4 | Approved, aut-transfer denemesi |
| **Sales Invoices** | 4 | Roketsan 3 + Aselsan 1, USD, %0 KDV |
| **Payments** | 3 | Altin Metal $240, Roketsan-1 $100k, Aselsan $80k |
| **NCR** | 2 | Lens cizik (Minor) + Mercek odak (Major) |
| **CAPA** | 2 | CORRECTIVE + PREVENTIVE |
| **Maintenance Plans** | 1 | OPTIK-01 haftalik |
| **HR Shifts** | 2 | Sabah + Aksam |
| **HR Leave** | 1 | Admin (Elif yerine) annual |

### Finansal toplam (senaryo hedefi vs olan)

| Metrik | Hedef | Gerceklesen |
|--------|-------|-------------|
| Toplam satis | $540.000 | $540.000 (4 satis faturasi) |
| Tahsil edilen | $180.000 | $180.000 (Parti-1 + Aselsan) |
| Acik alacak | $360.000 | $360.000 (Roketsan-2 + Parti-3) |
| Tedarikci borcu | $43.980 | Kapsam icinde (1-3. tur alis faturalari) |

---

## Test Edilen Endpoint Listesi

### POST create endpoint'leri (tumu 201 Created)

- `/register` — tenant self-register (200)
- `/Account/authenticate` (200)
- `/Machines` (4x 201)
- `/Warehouses` (3x 201)
- `/Product` (7x 201 — 6 hammadde + 1 mamul)
- `/Customer` (8x 201 — 6 supplier + 2 customer)
- `/FinancialAccount` (3x 201)
- `/PurchaseOrder` (7x 201)
- `/StockReceipts` (11x 201)
- `/IncomingInspection` (3x 201)
- `/Invoice` — PURCHASE+SALES (11x 201)
- `/Offer` (4x 201)
- `/OfferProduct` (4x 201)
- `/Sales` (4x 201)
- `/Payment` (3x 201)
- `/Ncr` (2x 201)
- `/Capa` (2x 200)
- `/Maintenance/plans` (1x 200)
- `/Hr/shifts` (2x 200)
- `/Hr/leave` (1x 200)

### PUT/state transition endpoint'leri

- `/Invoice/{id}/status` (11x 200 — DRAFT -> SENT)
- `/Offer/change-status/{id}/2` (4x 200 — ACCEPTED)
- `/Sales/request-approval/{id}` (4x 200)
- `/Sales/approve/{id}` (4x 200)
- `/Product/{id}` (7x 204 — BOM parent atamasi)

### GET read probe'lar (basarili)

`/Product, /Customer, /Customer?type=customers, /Customer?type=suppliers, /Machines, /Warehouses, /Offer, /Sales, /Production, /Invoice, /Payment, /Ncr, /Capa, /PurchaseOrder, /StockReceipts, /IncomingInspection, /FinancialAccount, /ExecutiveDashboard, /Kpi, /Oee, /Report/production-performance, /Report/stock-status, /DynamicReport/templates, /Hr/shifts, /Hr/leave, /Maintenance/plans, /ShiftHandover, /CeTechnicalFile, /Calibration/equipment`

### GET read probe'lar (BASARISIZ — yok/not deployed)

| Endpoint | Status | Aciklama |
|----------|--------|----------|
| `/Role` | 404 | Role CRUD hic yok — sadece register sirasinda seed (cogu tenant icin anlamsiz!) |
| `/Account` | 404 | Kullanici listesi endpoint'i yok (sadece `/Account/{id}` veya `/Account/authenticate`) |
| `/ProductionBoard` | 404 | Sprint 11 deploy edilmemis |
| `/MachineDowntime` | 404 | Sprint 12 deploy edilmemis |
| `/OrderTrackingLink` | 404 | Sprint 12 deploy edilmemis |
| `/WeldingWps` | 404 | Sprint 11 deploy edilmemis (Altay icin n/a) |
| `/ProductVariant` | 405 | Var ama GET allowed degil — yanlis HTTP metod |
| `/Accounting/aging` | 404 | Aging endpoint yok (AgingAnalysis controller var ama farkli route?) |
| `/Accounting/exchange-rates` | 404 | ExchangeRate endpoint'i farkli path'te olmali |

---

## Sonuc Tablosu

| Kategori | Sonuc |
|----------|-------|
| Yeni tenant yaratma | **BASARILI** |
| Provisioning (Hangfire) | **BASARILI** (15 sn) |
| Master data (urun, musteri, tedarikci, makine, depo, finansal) | **BASARILI** |
| BOM olusturma | **WORKAROUND** (`parentProductId` ile) — `/Bom` endpoint'i yok |
| Kullanici olusturma | **BASARISIZ** — BUG-01 (500 hatasi) |
| Satin alma talebi | **BASARISIZ** — endpoint yok |
| Satin alma siparis + mal kabul + fatura | **BASARILI** |
| Satis teklifi + siparis + approve | **BASARILI** |
| Otomatik production olusturma | **BASARISIZ** — BUG-03 (Sales approve sonrasi Production bulunamadi) |
| Uretim adim takibi (ShopFloor) | **ATLANDI** (productionId yok) |
| NCR + CAPA | **BASARILI** |
| Satis faturasi + odeme (USD) | **BASARILI** |
| BomExplosion raporu | **BASARISIZ** — BUG-02 (tenant-aware query hatasi) |
| Bakim planlari | **BASARILI** |
| HR (vardiya, izin) | **BASARILI** |
| Dashboard + KPI + OEE + rapor read'leri | **BASARILI** |

---

## Kritik Surprizler

1. **User registration 500 hatasi (BUG-01)** — Yeni tenant'ta yeni kullanici eklenemiyor. Bu sadece "temel olarak kullanilamaz" anlamina gelir. YUKSEK oncelik.
2. **BomExplosion 404 — "Urun bulunamadi"** — BomExplosionService product'i cekerken tenant filtresi devreye girmiyor olabilir veya X-Tenant-Id header'i bu endpoint icin bypass ediliyor. ORTA oncelik.
3. **`POST /Bom` ve `POST /PurchaseRequest` yok** — BOM UI ekrani muhtemelen Product PUT ile parent atiyor, ancak API referans dokumaninda /Bom olarak listelenmis. PurchaseRequest tamamen eksik — UI'da olsa bile API'da yok.
4. **Otomatik Production olusmuyor** — Sales approve'dan sonra Production listesinde yeni kayit bulunamadi. cnc_e2e.py'da `approve` sonrasi `items[0]` alinmisti, burada ayni query sonuc vermedi. Muhtemelen tenant-aware filter veya endpoint productionQuantity=0 ise skip ediyor.
5. **Role CRUD yok** — Yeni rol yaratamazsin, sadece register sirasinda seed edilen 3 rol (Admin/Manager/Operator) var. Senaryo "Uretim Muduru, Operator, Kaliteci" gibi ozellestirme istiyor — ekranda oluyorsa bu API'dan ya farkli bir yolla (permission assign?) ya da hic yok.
6. **Sprint 11/12 Special modules:** 5 modul (ProductionBoard, MachineDowntime, OrderTrackingLink, WeldingWps, ProductVariant GET) deploy edilmemis. CeTechnicalFile ve ShiftHandover canli.
7. **USD senaryosu calisti** — Fiyatlar, currency, exchangeRate field'lari sorunsuz. Ancak dolar->TL donusumu hesaplanmasi icin ekranda bilgilendirici gostergenin olmasi gerekir (otomatik hesap API tarafindan yapilmiyor).
8. **Multi-step NCR/CAPA approve flow test edilmedi** — NCR status transition'lari (DRAFT -> INVESTIGATING -> REWORK -> CLOSED) API'da ayri endpoint var mi belirsiz; `POST /Ncr` sonrasi status guncelleme denenmedi.
