# Quvex ERP — E2E Baseline Raporu (2026-04-14)

## Amaç

Sprint 13 deploy **öncesi** tüm E2E test senaryolarını 3 bağımsız yeni tenant'ta çalıştırarak mevcut durumu belgelemek. Deploy sonrası aynı testler tekrar çalıştırılıp before/after karşılaştırması yapılacak.

> **Not:** Bu baseline, Sprint 13 P0 fix'leri (BUG-01 Account/register Name alanı, BUG-02 BomExplosion, BUG-03 Sales approve) **canlıya ÇIKMADAN** ölçülmüştür. `api.quvex.io` hâlâ eski commit'te çalışıyor.

## Test Matrisi

| # | Tenant | Senaryo | Çağrı | Başarı | Pass % |
|---|---|---|---|---|---|
| 1 | CNC Baseline Demo 1776122070 | CNC talaşlı imalat (genel + AS9100) | 74 | 59 | **79.7%** |
| 2 | Finansal Baseline Demo 1776122070 | 13 finansal modül (FinAcct, Invoice, E-Invoice, Payment, BankRecon, Cost, Accounting) | 79 | 46 | **58.2%** |
| 3 | ALTAY Baseline Demo 1776122070 | Savunma — askeri dürbün üretimi, Roketsan/Aselsan satış, 3 tur üretim | 127 | 41 | **32.3%** |
| **TOPLAM** | — | — | **280** | **146** | **52.1%** |

> **Uyarı:** 3 script paralel çalıştırıldığı için önemli bir miktar `HTTP 429 Too Many Requests` hatası oluştu (rate-limiter). Gerçek başarı oranı sekans çalışımda belirgin şekilde daha yüksek olacaktır. Deploy sonrası karşılaştırmada 3 script **sıralı** (CNC → FIN → ALTAY) çalıştırılmalıdır; bu sayede 429 kaynaklı gürültü ortadan kalkar.

## Tenant Bilgileri

| # | Tenant ID | Admin Email | Şifre | Sektör |
|---|---|---|---|---|
| 1 | `a765078e-b9de-4bdd-bdda-17e0691a3e8b` | `admin@cnc-baseline-1776122070.demo` | `CncBase123!@#$%` | general |
| 2 | `69288031-7b5f-43b6-aec9-783acf7792df` | `admin@finansal-baseline-1776122070.demo` | `FinBase123!@#$%` | general |
| 3 | `c5d20df9-519b-4e1e-b290-e6ea9336b42c` | `admin@altay-baseline-1776122070.demo` | `AltayBase123!@#$%` | defense |

## Sonuç Özeti

### 1. CNC Baseline Demo — %79.7 (59/74)

**Modül başarı oranları (tümü, kısmi):**

| Modül | Başarı | Not |
|---|---|---|
| Customer, Product, Machine, Warehouse, WorkOrder, Sales, Production, Maintenance, HR, Dashboard, ShopFloor, Traceability, DocControl, Audit | 100% | Tam başarılı |
| Quality | 12/16 (75%) | FinalInspectionRelease 400 (InspectedById zorunlu) + 3x 429 |
| Finance | 4/5 (80%) | 1x 429 |
| Subcontract, Stock, Purchase, Onboarding | 50% | Karma: 400 + 429 |
| Risk, Config, Supplier, Report | 0% | Tamamı 429 (rate limit) |

**Gerçek (non-429) hatalar:**

| # | Endpoint | Status | Hata | Kategori |
|---|---|---|---|---|
| 1 | `POST /FinalInspectionRelease` | 400 | "Final muayene kaydı oluşturmak için muayene yapan kişi (InspectedById) girilmelidir. AS9100 gereksinimi." | Test payload eksik |
| 2 | `GET /Onboarding/sample-data` | 400 | "Bu hesapta zaten veri bulunuyor" | Beklenen (idempotent) |

> CNC senaryosunda **tek gerçek deploy-bekleyen hata yok**. 400'ler test script eksikliği (InspectedById göndermemiz gerek) ve beklenen davranış.

### 2. Finansal Baseline Demo — %58.2 (46/79)

**Tam yeşil modüller (100%):** Customer, Product, PaymentTerm, Tax, FinancialAccount, Invoice, EInvoice — **13/13 FinAcct + 10/10 EInvoice + 9/9 Invoice çağrıları** başarılı.

**429 nedeniyle düşen modüller (%0'a kadar gerileyenler):**

| Modül | Başarı | 429 sayısı |
|---|---|---|
| Payment | 3/7 (43%) | 4x 429 |
| BankRecon | 0/5 | 5x 429 |
| Production | 0/1 | 1x 429 |
| CostRecord, LaborCost, PartCost, StandardCost | 0/12 | 12x 429 |
| AcctInteg | 0/11 | 11x 429 |

> Finansal senaryoda **tek bir gerçek functional hata yoktur**. 33 failure'ın tamamı rate-limit. Sıralı çalıştırmada bu senaryo %100'e yakın geçmesi beklenir.

### 3. ALTAY Baseline Demo — %32.3 (41/127)

**Çalışan modüller:** register, Bom (100%), PurchaseRequest (100%), Calibration (100%), Machines (80%), Warehouses (75%), Product (88%), Customer (89%), FinancialAccount (75%).

**Gerçek (non-429, non-404) hatalar:**

| # | Endpoint | Status | Hata | Kategori | Bug ref |
|---|---|---|---|---|---|
| 1 | `POST /Role` x4 | 400 | `ClaimListId: The ClaimListId field is required.` | Validation — zorunlu alan | **YENİ BULGU** |
| 2 | `POST /Account/register` x5 | 400 | `Name: The Name field is required.` | Validation — DTO'da `Name` zorunlu ama `firstName/lastName` gönderiliyor | **BUG-01** (biliniyor, Sprint 13'te fix'lendi, deploy bekliyor) |
| 3 | `GET /ProductionBoard` | 404 | — | Deploy bekliyor (Sprint 11) | BİLİNEN |
| 4 | `GET /MachineDowntime` | 404 | — | Deploy bekliyor (Sprint 12) | BİLİNEN |
| 5 | `GET /OrderTrackingLink` | 404 | — | Deploy bekliyor (Sprint 12) | BİLİNEN |
| 6 | `GET /WeldingWps` | 404 | — | Deploy bekliyor (Sprint 11) | BİLİNEN |
| 7 | `GET /Exchange Rates` | 404 | — | Endpoint mevcut değil | BİLİNEN |
| 8 | `GET /ProductVariant` | 405 | Method mismatch | Sprint 11 deploy bekliyor | BİLİNEN |

**429 nedeniyle düşenler:** 71 çağrı (StockReceipts, Invoice, Offer, Sales, NCR/CAPA, GET probe'lar). Sıralı çalıştırmada tamamına yakını geçecek.

## Konsolide Bug Listesi (gerçek, 429 hariç)

| # | Endpoint | Status | Occurrence | Severity | Bug ref |
|---|---|---|---|---|---|
| 1 | `POST /Account/register` | 400 — `Name` required | 5 (ALTAY) | **P0** | BUG-01 (Sprint 13) — Deploy bekliyor |
| 2 | `POST /Role` | 400 — `ClaimListId` required | 4 (ALTAY) | P1 | **YENİ BULGU** — rapora eklenecek |
| 3 | `POST /FinalInspectionRelease` | 400 — `InspectedById` required | 1 (CNC) | P2 | Test payload eksik (AS9100 doğru davranış) |
| 4 | `GET /ProductionBoard` | 404 | 1 (ALTAY) | P1 | Sprint 11 — Deploy bekliyor |
| 5 | `GET /MachineDowntime` | 404 | 1 (ALTAY) | P1 | Sprint 12 — Deploy bekliyor |
| 6 | `GET /OrderTrackingLink` | 404 | 1 (ALTAY) | P1 | Sprint 12 — Deploy bekliyor |
| 7 | `GET /WeldingWps` | 404 | 1 (ALTAY) | P2 | Sprint 11 — Deploy bekliyor |
| 8 | `GET /ProductVariant` | 405 | 1 (ALTAY) | P2 | Sprint 11 — Deploy bekliyor |
| 9 | `GET /Exchange Rates` | 404 | 1 (ALTAY) | P3 | Test script hatası / endpoint yok |

**Yeni bulgu (Sprint 13'e eklenecek):** `POST /Role` endpoint'i `ClaimListId` alanını zorunlu istiyor ama dokümante edilmemiş. Admin UI tenant onboarding'inde role yaratma başarısız olur. Sprint 13 backlog'una eklenmeli.

## En Sık Fail Olan 5 Endpoint (konsolide, 429 dahil)

1. `GET /Report/stock-status` — 2x [429]
2. `GET /StockReceipts` — 2x [429]
3. `GET /PurchaseOrder` — 2x [429]
4. `POST /Account/register` — 5x [400] (Name required — BUG-01)
5. `POST /Role` — 4x [400] (ClaimListId required — yeni)

## Before/After Karşılaştırma (deploy sonrası doldurulacak)

| Senaryo | Önce (2026-04-14) | Sonra | Fark | 429 temizlenmiş önce |
|---|---|---|---|---|
| CNC | 79.7% (59/74) | - | - | ~97% (tahmini, 2 gerçek hata hariç) |
| Finansal | 58.2% (46/79) | - | - | ~100% (tamamı 429) |
| ALTAY | 32.3% (41/127) | - | - | ~80% (71 tanesi 429; 15 gerçek hata kalır) |
| **Toplam** | **52.1% (146/280)** | - | - | **~92%** (gerçek fail sayısı: ~22) |

## Metodoloji Uyarıları

1. **Paralel çalıştırma 429 üretir.** 3 test scripti aynı anda çalıştığında rate-limiter tetiklenir ve %30-50 false-negative oluşturur. Deploy sonrası karşılaştırma için scriptler **sıralı** (CNC → FIN → ALTAY, her biri arasında 30sn bekleme) çalıştırılmalıdır.
2. **BUG-01 önceden bilinen.** Sprint 13 commit'te fix'lendi ama canlıya gitmediği için baseline'da gözüküyor; deploy sonrası bu 5 fail sıfırlanmalıdır.
3. **Sprint 11/12 endpoint'leri.** ProductionBoard, MachineDowntime, OrderTrackingLink, WeldingWps, ProductVariant controller'ları canlı API'de yok; Sprint 13 kapsamında deploy edilecek → 404 → 200'e dönüşmeli.
4. **CNC InspectedById.** Test script'i FinalInspectionRelease payload'ına `inspectedById` eklemeli (AS9100 validation bilinçli). Bu bir bug değil; test hatası.
5. **YENİ: Role ClaimListId.** Sprint 13 backlog'una eklenmeli: ya DTO'dan zorunluluk kaldırılsın ya da optional olsun ya da örnek request body dokümante edilsin.

## Script Konumları

| Dosya | Yol |
|---|---|
| Ortak helper | `C:\Users\Hakan\AppData\Local\Temp\e2e_baseline\_common.py` |
| CNC script | `C:\Users\Hakan\AppData\Local\Temp\e2e_baseline\cnc_e2e_v2.py` |
| Finansal script | `C:\Users\Hakan\AppData\Local\Temp\e2e_baseline\financial_e2e_v2.py` |
| ALTAY script | `C:\Users\Hakan\AppData\Local\Temp\e2e_baseline\altay_e2e_v2.py` |
| CNC sonucu | `C:\Users\Hakan\AppData\Local\Temp\e2e_baseline\cnc_baseline_results.json` |
| Finansal sonucu | `C:\Users\Hakan\AppData\Local\Temp\e2e_baseline\financial_baseline_results.json` |
| ALTAY sonucu | `C:\Users\Hakan\AppData\Local\Temp\e2e_baseline\altay_baseline_results.json` |
| Aggregate JSON | `C:\Users\Hakan\AppData\Local\Temp\e2e_baseline\_aggregate.json` |
| Aggregate script | `C:\Users\Hakan\AppData\Local\Temp\e2e_baseline\_aggregate.py` |

## Yeniden Çalıştırma Komutları (Deploy Sonrası)

Her biri sıralı, 30sn ara ile:

```bash
# 1. CNC
python cnc_e2e_v2.py --register \
  --company-name "CNC AfterDeploy Demo $(date +%s)" \
  --admin-email "admin@cnc-after-$(date +%s).demo" \
  --password "CncAfter123!@#\$%" \
  --sector general \
  --output "cnc_after_results.json"

# 2. Finansal
python financial_e2e_v2.py --register ...

# 3. ALTAY
python altay_e2e_v2.py --company-name "ALTAY After Demo $(date +%s)" ...
```

## Sprint 13 Deploy Kontrol Listesi

Deploy sonrası bu endpoint'lerin durumunu doğrula:

- [ ] `POST /Account/register` — `Name` artık opsiyonel / `firstName+lastName` desteği (BUG-01)
- [ ] `POST /Role` — `ClaimListId` opsiyonel veya varsayılan değer (YENİ bulgu)
- [ ] `GET /ProductionBoard` — 404 → 200 (Sprint 11)
- [ ] `GET /MachineDowntime` — 404 → 200 (Sprint 12)
- [ ] `GET /OrderTrackingLink` — 404 → 200 (Sprint 12)
- [ ] `GET /WeldingWps` — 404 → 200 (Sprint 11)
- [ ] `GET /ProductVariant` — 405 → 200 (Sprint 11)
- [ ] `POST /BomExplosion` — BUG-02 fix çalışıyor mu
- [ ] `PUT /Sales/approve/{id}` — BUG-03 fix çalışıyor mu

---
**Üretildi:** 2026-04-14 (Sprint 13 deploy öncesi baseline)
**Yöntem:** [E2E-BASELINE-METHODOLOGY.md](../E2E-BASELINE-METHODOLOGY.md)
