# Quvex ERP — API-UI Endpoint Haritasi

> Son guncelleme: 2026-04-12 (Sprint 11)
> Test: `npx playwright test e2e/api-endpoint-health.spec.js --grep "Full endpoint summary"`
> Durum: **170+ endpoint (Sprint 11 ile 30+ yeni eklendi)**

## Nasil Kullanilir

```bash
# Tum endpoint'leri test et (ozet rapor)
npx playwright test e2e/api-endpoint-health.spec.js --grep "Full endpoint summary" --retries=0

# Tek tek endpoint testleri (detayli)
npx playwright test e2e/api-endpoint-health.spec.js --grep "Health Check" --retries=0

# HTML rapor olustur
npx playwright test e2e/api-endpoint-health.spec.js --reporter=html
npx playwright show-report
```

## Yeni Endpoint Ekleme

`e2e/api-endpoint-health.spec.js` dosyasindaki `ENDPOINTS` dizisine:
```js
['GET', '/YeniController/endpoint', 200, '/ui-route', 'Aciklama'],
```

---

## Endpoint Haritasi

### Authentication & Account
| Method | API Endpoint | UI Sayfasi | Aciklama |
|--------|-------------|-----------|----------|
| POST | `/Account/authenticate` | `/login` | Giris |
| POST | `/Account/register` | `/settings/users` | Kayit |
| POST | `/Account/logout` | - | Cikis |
| GET | `/Account/GetAllAsync` | `/settings/users` | Tum kullanicilar |
| GET | `/Account/GetRoles` | `/settings/rollers` | Roller |
| GET | `/Account/my-permissions` | `/` | Izinler |

### Dashboard
| Method | API Endpoint | UI Sayfasi | Aciklama |
|--------|-------------|-----------|----------|
| GET | `/Chart/offer` | `/home` | Teklif chart |
| GET | `/Chart/work-load` | `/home` | Is yuku chart |
| GET | `/Report/stock-status` | `/home` | Stok durumu |
| GET | `/Report/delayed-orders` | `/home` | Geciken siparisler |
| GET | `/Report/production-performance` | `/home` | Uretim performansi |
| GET | `/Production/summary/counts` | `/home` | Uretim ozet |
| GET | `/PurchaseOrder/summary/counts` | `/home` | Satinalma ozet |
| GET | `/StockAlert/alerts` | `/home` | Stok uyarilari |
| GET | `/Maintenance/overdue` | `/home` | Geciken bakimlar |
| GET | `/Tasks` | `/home` | Gorevler |
| GET | `/ProductionPlanning/summary` | `/home` | Planlama ozeti |

### Products
| Method | API Endpoint | UI Sayfasi | Aciklama |
|--------|-------------|-----------|----------|
| GET | `/Product` | `/products` | Urun listesi |
| GET | `/Product/{id}` | `/products/form/:id` | Urun detay |
| GET | `/Product/next-code` | `/products/form` | Sonraki kod |
| POST | `/Product` | `/products/form` | Urun olustur |
| PUT | `/Product` | `/products/form/:id` | Urun guncelle |
| DELETE | `/Product/{id}` | `/products` | Urun sil |

### Offers
| Method | API Endpoint | UI Sayfasi | Aciklama |
|--------|-------------|-----------|----------|
| GET | `/Offer` | `/offers` | Teklif listesi |
| GET | `/Offer/{id}` | `/offers/form/:id` | Teklif detay |
| POST | `/Offer` | `/offers/form` | Teklif olustur |
| PUT | `/Offer` | `/offers/form/:id` | Teklif guncelle |
| DELETE | `/Offer/{id}` | `/offers` | Teklif sil |
| GET | `/OfferProduct/offer/{offerId}` | `/offers/form/:id` | Teklif kalemleri |

### Customers & Suppliers
| Method | API Endpoint | UI Sayfasi | Aciklama |
|--------|-------------|-----------|----------|
| GET | `/Customer?type=customers` | `/customers` | Musteriler |
| GET | `/Customer?type=suppliers` | `/suppliers` | Tedarikciler |
| GET | `/Customer/{id}` | - | Musteri detay |
| POST | `/Customer` | `/customers` | Musteri olustur |
| PUT | `/Customer` | `/customers` | Musteri guncelle |
| DELETE | `/Customer/{id}` | `/customers` | Musteri sil |
| GET | `/CustomerStatement/balances` | `/customer-statement` | Bakiyeler |
| GET | `/AgingAnalysis` | `/accounting/aging` | Yaslandirma analizi listesi |
| GET | `/AgingAnalysis/{customerId}` | `/accounting/aging` | Musteri yaslandirma detay |
| GET | `/AgingAnalysis/summary` | `/accounting/aging` | Yaslandirma ozeti |
| GET | `/AgingAnalysis/export` | `/accounting/aging` | Yaslandirma Excel export |
| GET | `/CustomerFeedback/complaints` | `/customer-feedback` | Sikayetler |
| GET | `/CustomerFeedback/surveys` | `/customer-feedback` | Anketler |
| GET | `/CustomerFeedback/dashboard` | `/customer-feedback` | Geri bildirim panosu |
| GET | `/CustomerAddress/customer/{id}` | - | Adresler |
| GET | `/ContactPerson/customer/{id}` | - | Irtibat kisileri |

### Sales & Purchase Orders
| Method | API Endpoint | UI Sayfasi | Aciklama |
|--------|-------------|-----------|----------|
| GET | `/Sales` | `/sales` | Satis listesi |
| GET | `/PurchaseOrder` | `/purchase-orders` | Satinalma siparisleri |
| GET | `/PurchaseOrder/next-number` | `/purchase-orders/form` | Sonraki no |
| POST | `/PurchaseOrder` | `/purchase-orders/form` | SO olustur |
| PUT | `/PurchaseOrder/{id}` | `/purchase-orders/form/:id` | SO guncelle |
| PUT | `/PurchaseOrder/change-status/{id}/{status}` | - | Durum degistir |
| PUT | `/PurchaseOrder/receive/{id}` | - | Teslim al |
| POST | `/OrderTracking/{orderId}/link` | `/sales/:id` (modal) | Musteri public takip linki uret (Sprint 12 T86) |
| GET | `/OrderTracking/{orderId}/links` | `/sales/:id` (modal) | Siparise ait linkleri listele |
| DELETE | `/OrderTracking/{linkId}` | - | Linki iptal et |
| GET | `/track/{token}` | `/track/:token` | **Public** musteri sipariş takip sayfasi (auth gerektirmez) |

### Production
| Method | API Endpoint | UI Sayfasi | Aciklama |
|--------|-------------|-----------|----------|
| GET | `/Production` | `/production` | Uretim listesi |
| GET | `/Production/{id}` | `/production/detail/:id` | Uretim detay |
| GET | `/ProductionPlanning/gantt` | `/production/planning` | Gantt |
| GET | `/ShopFloor/dashboard` | `/shop-floor` | Atolye panosu |
| GET | `/ShopFloor/my-tasks` | `/shop-floor` | Gorevlerim |
| GET | `/SubcontractOrder` | `/subcontract-orders` | Fason siparisler |
| GET | `/SerialNumber` | `/serial-numbers` | Seri numaralari |
| GET | `/CapacityPlanning/machines` | `/production/capacity-scheduling` | Makine kapasite |
| GET | `/CapacityPlanning/overview` | `/production/capacity-scheduling` | Kapasite genel |

### Stock & Warehouse
| Method | API Endpoint | UI Sayfasi | Aciklama |
|--------|-------------|-----------|----------|
| GET | `/Warehouses` | `/warehouses` | Depolar |
| GET | `/WarehouseLocation/warehouse/{id}` | `/warehouse-locations` | Lokasyonlar |
| GET | `/StockCount` | `/stock/count` | Sayim listesi |
| GET | `/StockLot` | `/stock/lots` | Lot listesi |
| GET | `/StockValuation` | `/stock/valuation` | Stok degerleme |
| GET | `/StockAlert/alerts` | `/stock/alerts` | Uyarilar |
| GET | `/StockAlert/levels` | `/stock/alerts` | Seviyeler |
| GET | `/AutoPurchase/suggestions` | `/auto-purchase` | Dusuk stok onerileri |
| POST | `/AutoPurchase/generate` | `/auto-purchase` | Otomatik satin alma |
| POST | `/AutoPurchase/generate-single` | `/auto-purchase` | Tekil talep olustur |
| POST | `/AutoPurchase/generate-all` | `/auto-purchase` | Toplu talep olustur |
| GET | `/AutoPurchase/settings` | `/auto-purchase` | Ayarlar |
| PUT | `/AutoPurchase/settings` | `/auto-purchase` | Ayar guncelle |
| GET | `/MaterialTypes` | `/settings/material-types` | Malzeme tipleri |

### Invoice & Payments
| Method | API Endpoint | UI Sayfasi | Aciklama |
|--------|-------------|-----------|----------|
| GET | `/Invoice` | `/invoices` | Fatura listesi |
| GET | `/Invoice/next-number` | `/invoices/form` | Sonraki no |
| POST | `/Invoice` | `/invoices/form` | Fatura olustur |
| GET | `/Payment` | `/invoices` | Odemeler |
| GET | `/Tax/rates` | `/invoices/form` | Vergi oranlari |
| GET | `/PaymentTerm` | `/invoices/form` | Odeme vadeleri |
| GET | `/BankReconciliation` | `/bank-reconciliation` | Mutabakatlar |
| GET | `/BankReconciliation/summary` | `/bank-reconciliation` | Ozet |

### Quality Management
| Method | API Endpoint | UI Sayfasi | Aciklama |
|--------|-------------|-----------|----------|
| GET | `/AdvancedQuality/dashboard` | `/quality/dashboard` | Kalite panosu |
| GET | `/IncomingInspection` | `/quality/inspections` | Giris kontrol |
| GET | `/Ncr` | `/quality/ncr` | Uygunsuzluk |
| GET | `/Capa` | `/quality/capa` | DOF listesi |
| GET | `/Capa/dashboard` | `/quality/capa` | DOF panosu |
| GET | `/Capa/overdue` | `/quality/capa` | Geciken DOF |
| GET | `/Calibration/equipment` | `/quality/calibration` | Ekipmanlar |
| GET | `/Calibration/dashboard` | `/quality/calibration` | Kalibrasyon panosu |
| GET | `/Calibration/overdue` | `/quality/calibration` | Geciken |
| GET | `/ControlPlan` | `/quality/control-plans` | Kontrol planlari |
| GET | `/Ecn` | `/settings/ecn` | Muhendislik degisiklikleri |

### AS9100 Compliance
| Method | API Endpoint | UI Sayfasi | Aciklama |
|--------|-------------|-----------|----------|
| GET | `/Coc` | `/quality` | Uygunluk sertifikalari |
| GET | `/ContractReview/sales/{id}` | `/quality` | Sozlesme inceleme |
| GET | `/FinalInspectionRelease/production/{id}` | `/production/detail/:id` | Son kontrol |
| GET | `/CustomerConcession` | `/quality` | Musteri tavizi |
| GET | `/MRB` | `/quality` | MRB |
| GET | `/Risk` | `/quality/risk-fmea` | Risk listesi |
| GET | `/Risk/dashboard` | `/quality/risk-fmea` | Risk panosu |
| GET | `/InternalAudit` | `/quality/internal-audit` | Ic denetim |
| GET | `/SupplierEvaluation` | `/quality/supplier-evaluation` | Tedarikci degerlendirme |
| GET | `/FAI` | `/quality/fai` | Ilk parca kontrol |
| GET | `/CounterfeitPart/verifications` | `/quality/counterfeit-prevention` | Sahte parca |
| GET | `/ConfigurationManagement/items` | `/quality/configuration` | Konfigurasyon |
| GET | `/SpecialProcess` | `/quality/special-processes` | Ozel proses |
| GET | `/FOD/incidents` | `/quality/fod` | YCT olaylari |
| GET | `/CustomerProperty` | `/quality/customer-property` | Musteri mulkiyeti |
| GET | `/Spc/charts` | `/quality/spc` | IPK grafikleri |
| GET | `/ProcessCapability` | `/quality/process-capability` | Surec yeterlilik gecmis |
| POST | `/ProcessCapability/calculate` | `/quality/process-capability` | Surec yeterlilik hesapla |
| GET | `/ProcessCapability/from-spc/{id}` | `/quality/process-capability` | SPC'den hesapla |
| POST | `/ProcessCapability/save` | `/quality/process-capability` | Surec yeterlilik kaydet |
| GET | `/PPAP` | `/quality/ppap` | PPAP |
| GET | `/DesignDevelopment` | `/quality/design-development` | Tasarim gelistirme |
| GET | `/SupplyChainRisk` | `/quality/supply-chain-risk` | Tedarik zinciri riski |
| GET | `/ProductSafety` | `/quality/product-safety` | Urun guvenligi |
| GET | `/Training` | `/quality/training` | Egitim |
| GET | `/Training/competency` | `/quality/training` | Yetkinlik matrisi |

### Maintenance & OEE
| Method | API Endpoint | UI Sayfasi | Aciklama |
|--------|-------------|-----------|----------|
| GET | `/Maintenance/plans` | `/maintenance` | Bakim planlari |
| GET | `/Maintenance/work-orders` | `/maintenance` | Bakim is emirleri |
| GET | `/Maintenance/failures` | `/maintenance` | Ariza kayitlari |
| GET | `/Oee` | `/oee` | OEE verileri |

### Machines & Settings
| Method | API Endpoint | UI Sayfasi | Aciklama |
|--------|-------------|-----------|----------|
| GET | `/Machines` | `/settings/machines` | Makine listesi |
| GET | `/WorkOrderSteps` | `/settings/work-order-steps` | Is emri adimlari |
| GET | `/WorkOrderTemplates` | `/settings/work-order-templates` | Is emri sablonlari |
| GET | `/WorkOrderLogs` | `/settings/work-order-logs` | Is emri loglari |

### HR & Documents
| Method | API Endpoint | UI Sayfasi | Aciklama |
|--------|-------------|-----------|----------|
| GET | `/Hr/shifts` | `/hr` | Vardiyalar |
| GET | `/Hr/attendance` | `/hr` | Puantaj |
| GET | `/Document/search` | `/documents` | Dokuman arama |
| GET | `/LaborCost/rates` | `/hr` | Iscilik oranlari |

### Reports
| Method | API Endpoint | UI Sayfasi | Aciklama |
|--------|-------------|-----------|----------|
| GET | `/Report/sales-analysis` | `/reports` | Satis analizi |
| GET | `/Report/machine-utilization` | `/reports` | Makine kullanimi |
| GET | `/Report/supplier-performance` | `/reports` | Tedarikci performansi |
| GET | `/Report/profit-loss` | `/reports` | Kar-zarar |
| GET | `/Report/offer-conversion` | `/reports` | Teklif donusum |
| GET | `/Report/delivery-estimation` | `/reports` | Teslimat tahmini |
| GET | `/Report/ncr-trend` | `/reports` | Uygunsuzluk trendi |
| GET | `/Report/supplier-quality` | `/reports` | Tedarikci kalite |
| GET | `/Report/quality-cost` | `/reports` | Kalite maliyeti |
| GET | `/DynamicReport/templates` | `/dynamic-reports` | Dinamik rapor sablonlari |
| GET | `/Notification` | `/notifications` | Bildirimler |
| GET | `/Notification/summary` | `/notifications` | Bildirim ozeti |
| GET | `/Kpi/dashboard` | `/reports/kpi` | KPI panosu |

### AI Insights
| Method | API Endpoint | UI Sayfasi | Aciklama |
|--------|-------------|-----------|----------|
| GET | `/AIInsights/dashboard` | `/ai-insights` | AI panosu |
| GET | `/AIInsights/anomalies` | `/ai-insights` | Anomali tespiti |
| GET | `/AIInsights/demand-forecast` | `/ai-insights` | Talep tahmini |
| GET | `/AIInsights/smart-min-max` | `/ai-insights` | Akilli min-max |
| GET | `/AIInsights/delay-risks` | `/ai-insights` | Gecikme riskleri |
| GET | `/AIInsights/slow-stock` | `/ai-insights` | Yavas stok |
| GET | `/AIInsights/supplier-risk` | `/ai-insights` | Tedarikci riski |
| GET | `/AIInsights/predictive-maintenance` | `/ai-insights` | Ongorucu bakim |
| GET | `/AIInsights/offer-conversion` | `/ai-insights` | Teklif donusum AI |
| GET | `/AIInsights/cash-flow` | `/ai-insights` | Nakit akis tahmini |
| GET | `/AIInsights/churn-risk` | `/ai-insights` | Musteri kayip riski |
| GET | `/AIInsights/operation-time` | `/ai-insights` | Operasyon suresi |

### Cybersecurity
| Method | API Endpoint | UI Sayfasi | Aciklama |
|--------|-------------|-----------|----------|
| GET | `/Cybersecurity/dashboard` | `/settings/cybersecurity` | Siber guvenlik panosu |
| GET | `/Cybersecurity/policies` | `/settings/cybersecurity` | Politikalar |
| GET | `/Cybersecurity/incidents` | `/settings/cybersecurity` | Olaylar |

### Admin Panel
| Method | API Endpoint | UI Sayfasi | Aciklama |
|--------|-------------|-----------|----------|
| GET | `/Admin/audit-logs` | `/admin/audit-logs` | Denetim loglari |
| GET | `/Admin/tenants` | `/admin/tenants` | Tenant listesi |
| GET | `/Admin/system-health` | `/admin/dashboard` | Sistem sagligi |

### Changelog
| Method | API Endpoint | UI Sayfasi | Aciklama |
|--------|-------------|-----------|----------|
| GET | `/Changelog` | `/changelog` | Degisiklik gunlugu |

### Sprint 11 — Tekstil (ProductVariant)
| Method | API Endpoint | UI Sayfasi | Izin | Aciklama |
|--------|-------------|-----------|------|----------|
| GET | `/ProductVariant/by-product/{productId}` | `/products/form/:id` | ProductVariant.Goruntule | Urune bagli varyant listesi |
| GET | `/ProductVariant/{id}` | `/products/variants/:id` | ProductVariant.Goruntule | Varyant detay |
| POST | `/ProductVariant` | `/products/variants` | ProductVariant.Kaydet | Varyant olustur |
| POST | `/ProductVariant/bulk-generate` | `/products/variants` | ProductVariant.Kaydet | Beden/renk matrisi toplu uret |
| PUT | `/ProductVariant/{id}` | `/products/variants/:id` | ProductVariant.Kaydet | Varyant guncelle |
| DELETE | `/ProductVariant/{id}` | `/products/variants` | ProductVariant.Sil | Varyant sil |
| GET | `/ProductVariant/{id}/stock-history` | `/products/variants/:id` | ProductVariant.Goruntule | Varyant stok hareket gecmisi |

### Sprint 11 — Gida (HACCP)
| Method | API Endpoint | UI Sayfasi | Izin | Aciklama |
|--------|-------------|-----------|------|----------|
| GET | `/Haccp/control-points` | `/haccp/control-points` | Haccp.Goruntule | CCP listesi |
| POST | `/Haccp/control-points` | `/haccp/control-points` | Haccp.Kaydet | CCP olustur |
| PUT | `/Haccp/control-points/{id}` | `/haccp/control-points` | Haccp.Kaydet | CCP guncelle |
| DELETE | `/Haccp/control-points/{id}` | `/haccp/control-points` | Haccp.Sil | CCP sil |
| GET | `/Haccp/measurements` | `/haccp/measurements` | Haccp.Goruntule | Olcum listesi |
| POST | `/Haccp/measurements` | `/haccp/measurements` | Haccp.Kaydet | Olcum kaydet (sapmada otomatik NCR) |
| GET | `/Haccp/dashboard` | `/haccp/dashboard` | Haccp.Goruntule | HACCP panosu |

### Sprint 11 — Gida (Recall / Urun Geri Cagirma)
| Method | API Endpoint | UI Sayfasi | Izin | Aciklama |
|--------|-------------|-----------|------|----------|
| POST | `/Recall/initiate` | `/recall` | Recall.Kaydet | Geri cagirma baslat |
| POST | `/Recall/{id}/trace-affected-lots` | `/recall/:id` | Recall.Kaydet | BFS ile etkilenen lot izi |
| POST | `/Recall/{id}/notify-customers` | `/recall/:id` | Recall.Kaydet | Musterilere bildirim gonder |
| PUT | `/Recall/{id}/status` | `/recall/:id` | Recall.Kaydet | Recall durum guncelle |
| GET | `/Recall/{id}/timeline` | `/recall/:id` | Recall.Goruntule | Geri cagirma zaman cizelgesi |

### Sprint 11 — Plastik (Mold / Kalip Envanteri)
| Method | API Endpoint | UI Sayfasi | Izin | Aciklama |
|--------|-------------|-----------|------|----------|
| GET | `/Mold` | `/molds` | Mold.Goruntule | Kalip listesi (paginated) |
| GET | `/Mold/{id}` | `/molds/form/:id` | Mold.Goruntule | Kalip detay |
| POST | `/Mold` | `/molds/form` | Mold.Kaydet | Kalip olustur |
| PUT | `/Mold/{id}` | `/molds/form/:id` | Mold.Kaydet | Kalip guncelle |
| DELETE | `/Mold/{id}` | `/molds` | Mold.Sil | Kalip sil |
| POST | `/Mold/{id}/record-shots` | `/molds/form/:id` | Mold.Kaydet | Shot sayisi kaydet |
| GET | `/Mold/{id}/maintenance-due` | `/molds/form/:id` | Mold.Goruntule | Bakim zamani kontrolu |

### Sprint 11 — Makine (CE Technical File)
| Method | API Endpoint | UI Sayfasi | Izin | Aciklama |
|--------|-------------|-----------|------|----------|
| GET | `/CeTechnicalFile` | `/ce-technical-files` | CeTechnicalFile.Goruntule | CE teknik dosya listesi |
| GET | `/CeTechnicalFile/{id}` | `/ce-technical-files/form/:id` | CeTechnicalFile.Goruntule | Teknik dosya detay |
| POST | `/CeTechnicalFile` | `/ce-technical-files/form` | CeTechnicalFile.Kaydet | Teknik dosya olustur |
| PUT | `/CeTechnicalFile/{id}` | `/ce-technical-files/form/:id` | CeTechnicalFile.Kaydet | Teknik dosya guncelle |
| DELETE | `/CeTechnicalFile/{id}` | `/ce-technical-files` | CeTechnicalFile.Sil | Teknik dosya sil |
| GET | `/CeTechnicalFile/by-product/{productId}` | `/products/form/:id` | CeTechnicalFile.Goruntule | Urune bagli CE dosyasi |

### Sprint 11 — Kaynak (Welding / WPS / WPQR)
| Method | API Endpoint | UI Sayfasi | Izin | Aciklama |
|--------|-------------|-----------|------|----------|
| GET | `/Welding/wps` | `/welding/wps` | Welding.Goruntule | WPS listesi |
| POST | `/Welding/wps` | `/welding/wps` | Welding.Kaydet | WPS olustur |
| PUT | `/Welding/wps/{id}` | `/welding/wps` | Welding.Kaydet | WPS guncelle |
| DELETE | `/Welding/wps/{id}` | `/welding/wps` | Welding.Sil | WPS sil |
| GET | `/Welding/certificates` | `/welding/certificates` | Welding.Goruntule | Kaynakci sertifikalari |
| POST | `/Welding/certificates` | `/welding/certificates` | Welding.Kaydet | Sertifika olustur |
| PUT | `/Welding/certificates/{id}` | `/welding/certificates` | Welding.Kaydet | Sertifika guncelle |
| GET | `/Welding/expiring-certificates?days=30` | `/welding/certificates` | Welding.Goruntule | Suresi dolmak uzere olan sertifikalar |

### Sprint 11 — Production Board (Gercek Zamanli)
| Method | API Endpoint | UI Sayfasi | Izin | Aciklama |
|--------|-------------|-----------|------|----------|
| GET | `/ProductionBoard/current` | `/production-board` | Production.Goruntule | Canli uretim panosu (SignalR push) |

**SignalR Hub:** `/hubs/production-board` (ProductionDashboardHub)
- Grup: `production_{tenantId}`
- Events: `BoardUpdated`, `WorkOrderUpdated`, `MachineStatusChanged`, `RefreshBoard`

### Sprint 11 — WhatsApp Entegrasyonu
| Method | API Endpoint | UI Sayfasi | Izin | Aciklama |
|--------|-------------|-----------|------|----------|
| GET | `/WhatsApp/status` | `/settings/whatsapp` | WhatsApp.Goruntule | Baglanti durumu |
| POST | `/WhatsApp/send-test` | `/settings/whatsapp` | WhatsApp.Kaydet | Test mesaji |
| POST | `/WhatsApp/send` | `/settings/whatsapp` | WhatsApp.Kaydet | Mesaj gonder |
| POST | `/WhatsApp/send-template` | `/settings/whatsapp` | WhatsApp.Kaydet | Sablon mesaj gonder |
| GET | `/WhatsApp/templates` | `/settings/whatsapp` | WhatsApp.Goruntule | Sablon listesi |

### Sprint 11 — Onboarding (Sektor Secimi)
| Method | API Endpoint | UI Sayfasi | Izin | Aciklama |
|--------|-------------|-----------|------|----------|
| POST | `/Onboarding/seed-demo/{sectorCode}` | `/onboarding` | (auth) | Sektor demo verisi yukle |
| GET | `/Onboarding/sectors` | `/onboarding` | (auth) | Desteklenen sektor listesi |

### SMS Yonetimi
| Method | API Endpoint | UI Sayfasi | Aciklama |
|--------|-------------|-----------|----------|
| GET | `/Sms/config` | `/settings/sms` | SMS yapilandirmasi |
| PUT | `/Sms/config` | `/settings/sms` | SMS yapilandirma guncelle |
| POST | `/Sms/send` | `/settings/sms` | SMS gonder |
| POST | `/Sms/send-bulk` | `/settings/sms` | Toplu SMS gonder |
| GET | `/Sms/dashboard` | `/settings/sms` | SMS dashboard |
| GET | `/Sms/logs` | `/settings/sms` | SMS loglari |
| GET | `/Sms/balance` | `/settings/sms` | SMS bakiye sorgula |
| POST | `/Sms/test` | `/settings/sms` | Test SMS gonder |
| GET | `/Sms/templates` | `/settings/sms` | SMS sablonlari |

---

## Onemli Notlar

1. **Auth**: UI `refreshToken`'i Bearer token olarak kullanir (JWT degil). `YetkiDenetimi` filtresi `RefreshToken` tablosundan dogrular.
2. **Rate Limiting**: API'de rate limiter var. Test'te 500ms delay kullaniliyor.
3. **Tenant**: Admin kullanici (`admin@asya.com`) tenant'siz calisir. `/Manage/*` endpoint'leri tenant gerektirir.
4. **Controller Route Farkliliklari**:
   - `ContractReview`: Root GET yok, `sales/{salesId}` ve `{id}` var
   - `DataPack`: Root GET yok, `production/{productionId}` gerekli
   - `CounterfeitPart`: Root GET yok, `verifications` kullan
   - `ConfigurationManagement`: Root GET yok, `items` kullan
   - `FOD`: Root GET yok, `incidents` kullan
5. **DB**: Yeni kolon/tablo eklendiginde `public` + `tenant_*` semalarina da eklenmeli.
