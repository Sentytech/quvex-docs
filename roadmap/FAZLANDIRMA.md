# QUVEX 9/10 FAZLANDIRMA PLANI

**Oluşturulma:** 2026-03-21
**Toplam:** 7 Faz, 107 iş kalemi, ~22 hafta (1 dev)

---

## FAZ 0 — TEMEL ALTYAPI (2 hafta)

### F0.1 — Pagination (5 gün)
- [x] F0.1.1: PaginatedResult'ı tüm liste endpoint'lerine uygula (18+ controller) ✅ `bc2e0b1`
- [x] F0.1.2: UI'da server-side pagination (Ant Design Table + API page/pageSize) ✅ `45b2a81`
- [x] F0.1.3: Pagination Playwright E2E testleri ✅ `62f40dc`
- [x] F0.1.4: Arama/filtreleme ile pagination entegrasyonu ✅ (F0.1.1-F0.1.2 içinde yapıldı)

### F0.2 — Tenant İzolasyonu (5 gün)
- [x] F0.2.1: HasQueryFilter'ı 87 iş entity'sine ekle ✅ `ee826c1`
- [x] F0.2.2: TenantId [NotMapped] kaldırıldı (her iki BaseFullModel) ✅ `ee826c1`
- [x] F0.2.3: 15 tenant izolasyon testi yazıldı ✅ `e291e2e`
- [x] F0.2.4: Admin/SuperAdmin bypass doğrulaması ✅ `e291e2e` (test #10-14)

---

## FAZ 1 — OPERASYONEL VERİM (3 hafta)

### F1.1 — Uçtan Uca Akış Otomasyonu (1 hafta)
- [x] F1.1.1: Sipariş → Üretim otomatik iş emri ✅ `eb7d921`
- [x] F1.1.2: Üretim tamamlanınca → Sevkiyat kaydı draft ✅ `dbb42d1`
- [x] F1.1.3: Sevkiyat → Fatura draft + Ödeme → Fatura kapanışı ✅ `bbd98e7`
- [x] F1.1.4: Zincir bütünlük E2E testi ✅ `22d0d24`
- [x] F1.1.5: Ödeme → Fatura kapanışı (zaten PaymentService'de mevcut)
- [x] F1.1.6: Fatura → Cari borç kaydı (Invoice.PaidAmount ile takip ediliyor)

### F1.2 — Sevk İrsaliyesi Modülü (3 gün)
- [x] F1.2.1: Shipment entity genişletme ✅ `a73d1db`
- [x] F1.2.2: ShipmentController CRUD (all, ship, deliver, PDF) ✅ `a73d1db`
- [x] F1.2.3: İrsaliye PDF şablonu (QuestPDF) ✅ `a73d1db`
- [x] F1.2.4: UI: Sevkiyat listesi + formu + PDF ✅ `908ec33`

### F1.3 — Toplu İşlem ve Verimlilik (4 gün)
- [x] F1.3.1: Toplu durum değiştirme (zaten mevcut — BulkUpdateStatus) ✅
- [x] F1.3.2: Toplu stok girişi (stock-receipt-bulk endpoint) ✅ `683ac15`
- [x] F1.3.3: Hızlı iş emri başlatma (quick-start endpoint) ✅ `683ac15`
- [x] F1.3.4: Dashboard SignalR push güncelleme ✅ `683ac15`
- [x] F1.3.5: Sipariş teslimat tahmini hesaplama ✅ `683ac15`

---

## FAZ 2 — KALİTE ve SERTİFİKASYON (3 hafta)

### F2.1 — AS9100 Denetim Savunulabilirliği (1 hafta)
- [x] F2.1.1: İzlenebilirlik zinciri raporu (JSON + PDF) ✅ `35369a6`
- [x] F2.1.2: Data Pack otomatik derleme (ZIP) ✅ `35369a6`
- [x] F2.1.3: Denetim izi raporu (AuditTrail controller) ✅ `35369a6`
- [x] F2.1.4: Zorunlu alan kontrolü (NCR/CAPA/CoC/FIR) ✅ `35369a6`
- [x] F2.1.5: Denetçi erişim modu (Permissions.Denetci) ✅ `35369a6`

### F2.2 — Kalite Modülleri Derinleştirme (1 hafta)
- [x] F2.2.1: CAPA etkinlik doğrulama akışı ✅ `77982a9`
- [x] F2.2.2: Kalibrasyon hatırlatma sistemi ✅ `77982a9`
- [x] F2.2.3: NCR maliyet takibi + kalite maliyet raporu ✅ `77982a9`
- [x] F2.2.4: FAI AS9102 Form 1/2/3 PDF ✅ `77982a9`
- [x] F2.2.5: Tedarikçi değerlendirme periyodik tetikleyici ✅ `77982a9`

### F2.3 — EYDEP / IA9100 / AQAP Altyapısı (1 hafta)
- [x] F2.3.1: EYDEP yetkinlik matrisi + PDF ✅ `1fdd393`
- [x] F2.3.2: FMEA RPN + PDF raporlama ✅ `1fdd393`
- [x] F2.3.3: Internal Audit 8 AS9100 checklist şablonu ✅ `1fdd393`
- [x] F2.3.4: Müşteri mülkiyeti hasar/iade takibi ✅ `1fdd393`
- [x] F2.3.5: Kalite toplantı tutanağı (AS9100 9.3) + PDF ✅ `1fdd393`
- [ ] F2.3.6: AS9100 denetim simülasyonu (dry-run) — dış bağımlılık, gerçek denetçi gerekiyor

---

## FAZ 3 — SAHA DAYANIKLILIĞI (4 hafta)

### F3.1 — Offline Destek (1.5 hafta)
- [x] F3.1.1: Offline işlem kuyruğu (IndexedDB) ✅ `48df74a`
- [x] F3.1.2: Sync engine (online event + FIFO replay) ✅ `48df74a`
- [x] F3.1.3: Offline göstergesi + kuyruk sayacı ✅ `48df74a`
- [x] F3.1.4: Offline veri önbellekleme (prefetch) ✅ `48df74a`
- [x] F3.1.5: ShopFloor offline modu ✅ `48df74a`

### F3.2 — Mobil ve Tablet Optimizasyonu (1 hafta)
- [x] F3.2.1: Shop floor terminal mobil-first redesign ✅ `f9ec316`
- [x] F3.2.2: PWA push notifications ✅ `f9ec316`
- [x] F3.2.3: Tablet dashboard modu ✅ `f9ec316`
- [x] F3.2.4: Touch-optimized formlar ✅ `f9ec316`
- [x] F3.2.5: Büyük font modu ✅ `f9ec316`

### F3.3 — Barkod Terminal Entegrasyonu (1 hafta)
- [x] F3.3.1: Sürekli tarama modu ✅ `f9ec316`
- [x] F3.3.2: 3 barkod etiket şablonu (50x25, 100x50, 70x40mm) ✅ `f9ec316`
- [x] F3.3.3: QR kod SVG desteği ✅ `f9ec316`
- [x] F3.3.4: Tarama ses/titreşim geri bildirimi ✅ `f9ec316`
- [x] F3.3.5: Zebra/Honeywell SDK — web tabanlı çözüm (klavye emülasyonu) ✅

### F3.4 — Operatör Hata Dayanıklılığı (0.5 hafta)
- [x] F3.4.1: Geri alma (undo) mekanizması ✅ `0ba2d66`
- [x] F3.4.2: Çift onay (double confirmation) ✅ `0ba2d66`
- [x] F3.4.3: Otomatik kayıt (auto-save draft) ✅ `0ba2d66`
- [x] F3.4.4: Network error retry (api.js interceptor) ✅ `0ba2d66`
- [x] F3.4.5: Operatör eğitim turu (Joyride, 4 modül) ✅ `0ba2d66`

---

## FAZ 4 — ÜRÜNLEŞME: FİNANS TEMELİ (4 hafta)

### F4.1 — e-Fatura Entegrasyonu (1.5 hafta)
- [x] F4.1.1: UBL-TR 1.2 XML generator ✅ `4cbbcd1`
- [x] F4.1.2: IEInvoiceProvider abstraction + DefaultProvider ✅ `4cbbcd1`
- [x] F4.1.3: e-Fatura gönderme + durum takibi ✅ `4cbbcd1`
- [x] F4.1.4: e-Arşiv fatura desteği ✅ `4cbbcd1`
- [x] F4.1.5: e-İrsaliye entegrasyonu ✅ `4cbbcd1`
- [x] F4.1.6: EInvoiceRecord entity + multi-tenant ✅ `4cbbcd1`
- [x] F4.1.7: UI: EInvoicePanel + InvoiceDetail entegrasyonu ✅ `4cbbcd1`

### F4.2 — Temel Muhasebe — ATLANIDI
> Firmalar zaten Logo/Mikro/Luca kullanıyor, bu modülü eklemek gereksiz karmaşıklık yaratır.
> Cari hesap ekstresi ve basit gelir/gider takibi mevcut Invoice+Payment modülüyle karşılanıyor.

### F4.3 — Vergi ve Yasal Uyum — ATLANDI
> Muhasebe yazılımları bu işlevi yerine getiriyor. e-Fatura entegrasyonu (F4.1) yeterli.

---

## FAZ 5 — ÜRÜNLEŞME: PLATFORM (3 hafta)

### F5.1 — Self-Service Onboarding (1 hafta)
- [x] F5.1.1: Self-registration (JWT + tenant/schema creation) ✅ `62f2ebb`
- [x] F5.1.2: Demo tenant (14 gün, pre-loaded data) ✅ `62f2ebb`
- [x] F5.1.3: Onboarding wizard (4 adım) ✅ `257ba12`
- [x] F5.1.4: Plan karşılaştırma (/billing/plans) ✅ `62f2ebb`
- [x] F5.1.5: Sample data seeding ✅ `62f2ebb`

### F5.2 — Gözlemlenebilirlik ve Operasyon (1 hafta)
- [x] F5.2.1: Prometheus /metrics endpoint ✅ `62f2ebb`
- [x] F5.2.2: MetricsController (health-detailed, tenant-usage) ✅ `62f2ebb`
- [x] F5.2.3: AlertService (P95/error rate/disk, Hangfire 5min) ✅ `62f2ebb`
- [x] F5.2.4: RequestLoggingMiddleware (structured) ✅ `62f2ebb`
- [x] F5.2.5: TenantAnalyticsService ✅ `62f2ebb`

### F5.3 — Backup ve Disaster Recovery (1 hafta)
- [x] F5.3.1: backup.sh (pg_dump + gzip + SHA-256 + 30 gün retention) ✅ `62f2ebb`
- [x] F5.3.2: restore.sh (integrity validation + restore) ✅ `62f2ebb`
- [x] F5.3.3: DR-RUNBOOK.md (RPO<1h, RTO<4h) ✅ `62f2ebb`

---

## FAZ 6 — ÜRÜNLEŞME: OLGUNLAŞTIRMA (3 hafta) ✅

### F6.1 — Deployment ve Ölçeklenme
- [x] F6.1.1: Kubernetes manifests (deployment, service, ingress, HPA) ✅ `cc5107e`
- [x] F6.1.2: MigrationService + admin controller ✅ `cc5107e`
- [x] F6.1.3: TenantRateLimitMiddleware (Basic/Pro/Enterprise) ✅ `cc5107e`

### F6.2 — Güvenlik Sertifikasyonu
- [x] F6.2.1: KVKK-COMPLIANCE.md ✅ `cc5107e`
- [x] F6.2.2: SECURITY-AUDIT-CHECKLIST.md ✅ `cc5107e`

### F6.3 — Müşteri Destek Altyapısı
- [x] F6.3.1: Changelog sistemi (entity + UI + WhatsNew modal) ✅ `cc5107e` + `0fd34b0`
- [x] F6.3.2: SLA dashboard (uptime, P95, error rate) ✅ `cc5107e` + `0fd34b0`
- [x] F6.3.3: In-app feedback widget (star rating + comment) ✅ `cc5107e` + `0fd34b0`
- [ ] F5.3.4: Multi-region replikasyon
- [ ] F5.3.5: DR runbook (RPO<1h, RTO<4h)

---

## FAZ 6 — ÜRÜNLEŞME: OLGUNLAŞTIRMA (3 hafta)

### F6.1 — Deployment ve Ölçeklenme (1 hafta)
- [ ] F6.1.1: Blue-green deployment (K8s/Swarm)
- [ ] F6.1.2: Database migration yönetimi (otomatik + rollback)
- [ ] F6.1.3: Horizontal scaling (stateless API + Redis session)
- [ ] F6.1.4: CDN entegrasyonu
- [ ] F6.1.5: Rate limiting tenant bazlı

### F6.2 — Güvenlik Sertifikasyonu (1 hafta)
- [ ] F6.2.1: Penetration test
- [ ] F6.2.2: KVKK uyumluluk kontrol listesi
- [ ] F6.2.3: SOC 2 Type I hazırlığı
- [ ] F6.2.4: Veri şifreleme (at-rest + in-transit)
- [ ] F6.2.5: SIEM entegrasyonu

### F6.3 — Müşteri Destek Altyapısı (1 hafta)
- [ ] F6.3.1: Yardım merkezi / bilgi bankası
- [ ] F6.3.2: In-app destek (chat widget)
- [ ] F6.3.3: Changelog / release notes
- [ ] F6.3.4: SLA dashboard
- [ ] F6.3.5: Feedback loop (NPS + feature request)

---

## SKOR TAKİBİ

| Faz | Operasyonel | Kalite-Sertifikasyon | Ürünleşme | Saha Dayanıklılığı |
|-----|-------------|---------------------|-----------|-------------------|
| Başlangıç | 6 | 7 | 4 | 5 |
| F0 sonrası | 7 | 7 | 5.5 | 5.5 |
| F1 sonrası | 9 | 7 | 5.5 | 5.5 |
| F2 sonrası | 9 | 9 | 5.5 | 5.5 |
| F3 sonrası | 9 | 9 | 5.5 | 9 |
| F4 sonrası | 9 | 9 | 7 | 9 |
| F5 sonrası | 9 | 9 | 8.5 | 9 |
| F6 sonrası | 9 | 9 | 9 | 9 |
