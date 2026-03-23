# Quvex ERP — AI-Powered ERP Donusum Yol Haritasi

> **Tarih:** 15 Mart 2026
> **Vizyon:** Turkiye'nin ilk AI-destekli uretim ERP platformu
> **Mevcut Durum:** AIInsightsService + AdvancedMrpService + OeeService ZATEN MEVCUT

---

## RAKIP KARSILASTIRMA

| Ozellik | SAP S/4HANA | Oracle ERP Cloud | Microsoft Dynamics | Odoo | **Quvex (Hedef)** |
|---------|-------------|-------------------|-------------------|------|-------------------|
| Talep Tahmini | Var | Var | Var | Plugin | **Var (80% hazir)** |
| Predictive Maintenance | Var | Var | Kismi | Yok | **Planli** |
| Dynamic Pricing | Var | Var | Yok | Yok | **Planli** |
| AI Chatbot | Joule | AI Agent | Copilot | Yok | **Planli** |
| Anomaly Detection | Var | Var | Var | Yok | **DTO hazir** |
| SPC AI Alerts | Kismi | Yok | Yok | Yok | **Planli** |
| Document OCR | Var | Var | Var | Yok | **Planli** |
| Fiyat: KOBİ/ay | ~$500+ | ~$300+ | ~$200+ | ~$50+ | **$30-100** |

**Quvex Avantaji:** KOBİ odakli + ucuz + Turkce + AS9100 → rakiplerin sunmadigi nicheularda AI

---

## 35 AI OZELLIGI — 7 MODUL

### URETIM (5 AI)

| # | Ozellik | Zorluk | Etki | Hazirlik |
|---|---------|--------|------|----------|
| AI-01 | Predictive Maintenance (Ongorucu Bakim) | Orta | Yuksek | MTBF/MTTR mevcut |
| AI-02 | Production Scheduling Optimization | Zor | Yuksek | Gantt + Capacity mevcut |
| AI-03 | Quality Prediction (Hata Tahmini) | Orta | Orta | ScrapTracking mevcut |
| AI-04 | OEE Optimization Onerileri | Kolay | Orta | OeeService %100 hazir |
| AI-05 | Anomaly Detection | Orta | Orta | AnomalyReportDTO HAZIR |

### STOK & DEPO (5 AI)

| # | Ozellik | Zorluk | Etki | Hazirlik |
|---|---------|--------|------|----------|
| AI-06 | Demand Forecasting (Talep Tahmini) | Kolay | Yuksek | **%80 HAZIR** (AIInsightsService) |
| AI-07 | Smart Reorder Point | Orta | Yuksek | AdvancedMrpService mevcut |
| AI-08 | Inventory Optimization (EOQ) | Kolay | Yuksek | EOQ hesaplamasi mevcut |
| AI-09 | Supplier Lead Time Prediction | Kolay | Orta | SupplierEval mevcut |
| AI-10 | Stock-Out Prevention | Kolay | Yuksek | **%80 HAZIR** (DaysUntilStockout) |

### SATIS & TEKLIF (6 AI)

| # | Ozellik | Zorluk | Etki | Hazirlik |
|---|---------|--------|------|----------|
| AI-11 | Dynamic Pricing | Orta | Yuksek | OfferCalcService mevcut |
| AI-12 | Win/Loss Prediction | Orta | Orta | Offer history mevcut |
| AI-13 | Customer Churn Prediction | Kolay | Yuksek | RFM analizi yapilabilir |
| AI-14 | Sales Forecasting | Orta | Orta | ReportService mevcut |
| AI-15 | Cross-sell/Up-sell | Orta | Orta | Co-purchase analizi |
| AI-16 | AI Delivery Estimation | Orta-Zor | Yuksek | Multi-factor tahmin |

### KALITE (6 AI)

| # | Ozellik | Zorluk | Etki | Hazirlik |
|---|---------|--------|------|----------|
| AI-17 | Defect Prediction | Orta | Yuksek | NCR + ScrapRecords mevcut |
| AI-18 | Root Cause Analysis (NLP) | Zor | Orta | NCR description verisi var |
| AI-19 | SPC Intelligent Alerts | Orta | Yuksek | SpcService + Rules mevcut |
| AI-20 | Supplier Risk Scoring AI | Kolay | Orta | SupplierEvalService mevcut |
| AI-21 | Inspection Optimization | Orta | Orta | AQL + QCPlan mevcut |
| AI-22 | CAPA Effectiveness | Orta | Orta | CAPA workflow mevcut |

### FINANS (5 AI)

| # | Ozellik | Zorluk | Etki | Hazirlik |
|---|---------|--------|------|----------|
| AI-23 | Cash Flow Forecasting | Orta | Yuksek | Invoice + Payment mevcut |
| AI-24 | Payment Delay Prediction | Kolay | Yuksek | Odeme gecmisi var |
| AI-25 | Invoice Anomaly Detection | Orta | Orta | Fatura verileri var |
| AI-26 | Smart Bank Reconciliation | Orta | Orta | BankReconciliation mevcut |
| AI-27 | Profitability Analysis AI | Kolay | Orta | Cost + Revenue var |

### BAKIM & MRP (5 AI)

| # | Ozellik | Zorluk | Etki | Hazirlik |
|---|---------|--------|------|----------|
| AI-28 | Predictive Maintenance ML | Orta | Yuksek | Failure data mevcut |
| AI-29 | Optimal Maintenance Schedule | Orta | Orta | MaintenanceService mevcut |
| AI-30 | Spare Parts Demand | Kolay | Orta | StockAlert + Maintenance link |
| AI-31 | Energy Optimization | Zor | Orta | WorkOrderLogs mevcut |
| AI-32 | Demand-Driven MRP | Orta | Yuksek | AdvancedMrpService mevcut |

### CROSS-MODULE (3 AI)

| # | Ozellik | Zorluk | Etki | Hazirlik |
|---|---------|--------|------|----------|
| AI-33 | AI Assistant (Chatbot) | Zor | Yuksek | Claude API entegrasyonu |
| AI-34 | Smart Dashboard (Kisisel KPI) | Orta | Orta | Dashboard + KPI mevcut |
| AI-35 | Document OCR (Fatura Okuma) | Orta | Yuksek | FileManager mevcut |

---

## IMPLEMENTASYON FAZI

### FAZ 1: Hizli Kazanimlar (2-3 hafta)
> Zaten %80 hazir olan ozellikler — sadece UI entegrasyonu gerekli

| # | Ozellik | Islem |
|---|---------|-------|
| AI-06 | Demand Forecasting | AIInsightsService.GetDemandForecastAsync() → UI grafigi ekle |
| AI-10 | Stock-Out Prevention | DaysUntilStockout → Dashboard widget |
| AI-04 | OEE Suggestions | OeeService → "Neden dusuk?" onerileri ekle |
| AI-08 | EOQ Optimization | AdvancedMrpService.CalculateEoqAsync() → StockAlerts'e entegre |
| AI-20 | Supplier Risk Score | SupplierEvalService → otomatik risk hesaplama |

### FAZ 2: Core AI (3-4 hafta)
> Algoritma implementasyonu + UI

| # | Ozellik | Algoritma |
|---|---------|-----------|
| AI-07 | Smart Reorder Point | Newsvendor Model + Lead Time Analysis |
| AI-01 | Predictive Maintenance | Weibull Distribution + MTBF trend |
| AI-05 | Production Anomaly | Statistical Z-score + Isolation Forest |
| AI-13 | Customer Churn | RFM Analysis + Churn Risk Score |
| AI-24 | Payment Delay | Logistic Regression (gecmis odeme verileri) |

### FAZ 3: Ileri AI (4-6 hafta)
> ML modelleri + karmasik ozellikler

| # | Ozellik | Algoritma |
|---|---------|-----------|
| AI-11 | Dynamic Pricing | Elasticity Model + Margin Optimization |
| AI-12 | Win/Loss Prediction | Logistic Regression / XGBoost |
| AI-17 | Defect Prediction | Random Forest (uretim parametreleri → hata) |
| AI-19 | SPC Intelligent Alerts | Trend tahmini + Nelson Rules |
| AI-23 | Cash Flow Forecasting | ARIMA Time Series |

### FAZ 4: Game Changer (6-8 hafta)
> Rakiplerden ayristirici ozellikler

| # | Ozellik | Teknoloji |
|---|---------|-----------|
| AI-33 | AI Assistant (Chatbot) | Claude API / GPT-4 entegrasyonu |
| AI-35 | Document OCR | Azure AI Vision / Tesseract |
| AI-18 | Root Cause NLP | Sentence embeddings + similarity search |
| AI-02 | Production Optimization | Constraint Programming (OR-Tools) |

---

## TEKNOLOJI YIGIN

| Katman | Teknoloji | Neden |
|--------|-----------|-------|
| ML Backend | **ML.NET** | .NET 8 native, EF Core uyumlu |
| Alternatif ML | Python FastAPI microservice | Scikit-learn, XGBoost, Prophet |
| Time Series | ML.NET TimeSeriesCatalog | ARIMA, SSA (Singular Spectrum) |
| NLP | Claude API / OpenAI | Chatbot + root cause analysis |
| OCR | Azure AI Vision / Tesseract | Fatura/irsaliye okuma |
| Batch Jobs | Hangfire | Gunluk tahmin calistirma |
| Gorsellestirme | Recharts (mevcut) | Prediction charts |
| Real-time | SignalR (mevcut) | Anomaly push notifications |

---

## MEVCUT HAZIR ALTYAPI (DOKUNMADAN KULLANILANLAR)

```
AIInsightsService.cs — Demand Forecast, Anomaly DTO'lari HAZIR
AdvancedMrpService.cs — Safety Stock, EOQ hesaplamalari HAZIR
OeeService.cs — Availability/Performance/Quality HAZIR
SpcService.cs — Cp/Cpk hesaplama + violation detection HAZIR
SupplierEvaluationService.cs — Scoring + Risk Level HAZIR
MaintenanceService.cs — MTBF/MTTR hesaplama HAZIR
ReportService.cs — 13 rapor endpoint HAZIR
ScrapTrackingService.cs — Fire/hurda takibi HAZIR
```

**Sonuc:** Altyapinin %60'i zaten mevcut. AI donusumu icin yeni kod yazma orani sadece %40.

---

## ROI HESABI

| Metrik | Mevcut (AI'siz) | AI ile | Kazanim |
|--------|-----------------|--------|---------|
| Makine downtime | 15% | 8% | **%47 azalma** |
| Stok tukenmesi | Ayda 5 kez | Ayda 1 kez | **%80 azalma** |
| Teklif kazanma | %35 | %45 | **%29 artis** |
| Geciken siparis | %20 | %8 | **%60 azalma** |
| Stok maliyeti | 100% | 75% | **%25 azalma** |
| Musteri kaybi | %15/yil | %10/yil | **%33 azalma** |
| Ortalama siparis degeri | 100% | 115% | **%15 artis** |

---

## PAZARLAMA MESAJI

> **Quvex AI-ERP: Fabrikaniz Icin Akilli Beyin**
>
> - "Makineniz arizalanmadan ONCE uyarir"
> - "Stogunuz tukenmeden ONCE siparis verir"
> - "Musteriniz ayrılmadan ONCE uyarir"
> - "Teklifinizin kazanma sansini ONCEDEN gosterir"
> - "Faturanizi okuyup OTOMATIK sisteme girer"
