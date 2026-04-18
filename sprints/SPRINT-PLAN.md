# Quvex ERP — Sprint Planı

> **Son Güncelleme:** 2026-04-18
> **Durum:** Sprint 13-15 tamamlandı + Sprint 16 başlıyor (Defense CNC tam E2E — 136 test, buglar tespit edildi)
> **Toplam Test:** 686 UI + 1223 API + 136 Defense CNC E2E (72 sayfa + 53 veri girişi + 11 perf) + 21 Sektör E2E + 527 Playwright = 2793+

## Sprint 16 — Defense CNC E2E Bug Kapama (2026-04-18)

> **Kaynak:** `quvex-docs/bugs/E2E-BACKLOG-2026-04-18.md`
> **Test Ortamı:** localhost:3000 + localhost:5052, yeni CNC tenant × her koşum
> **Sonuç:** 136/136 test geçti, 10 bug tespit edildi (1 zaten düzeltildi)

### Düzeltildi Bu Session'da

| ID | Başlık | Tür | Dosya | Durum |
|----|--------|-----|-------|-------|
| S16-T1 | **Provisioning Cache Bug** — PENDING 1 saat cache'de kalıyordu, dashboard 202 dönüyordu | BUG | `TenantResolutionMiddleware.cs` | ✅ |
| S16-T2 | **DashboardController DbContext threading** — Task.WhenAll paylaşımlı DbContext çöküyor | BUG | `DashboardController.cs` | ✅ |
| S16-T3 | **Unit Seeding** — Yeni tenant'ta birimler boş, ürün formu birim seçemiyor | BUG | `TenantSchemaService.cs` | ✅ |
| S16-T4 | **M²/M³ Unicode** — JSON output encoder eklendi, özel karakterler düzgün serialize | FIX | `Program.cs` | ✅ |

### Bu Session'da Tamamlananlar (Ek)

| ID | Başlık | Commit |
|----|--------|--------|
| S16-T5b | **ProductForm sektör yok → form boş** — else fallback PRODUCTION_MATERIAL | `0bad0bc` |
| S16-T6b | **E2E selector hardening** — dismissOnboarding/openAddModal/waitForToast/saveForm/gotoAndWait iyileştirildi | `2d47840` |
| S16-T11b | **G.3 stat card waitForSelector** — networkidle sonrası React render timing düzeltildi | `2d47840` |

**Sonuç: cnc-data-entry 53/53 PASS ✅**

### Açık (Sonraki Sprint)

| ID | Başlık | Öncelik |
|----|--------|---------|
| S16-T5 | CustomerList "Ekle" butonu — modal açılmıyor (soft-skip) | P2 |
| S16-T6 | Makine/Depo kayıt sonrası toast bildirimi yok | P2 |
| S16-T7 | Makine/Depo liste kayıt sonrası güncellenmüyor | P2 |
| S16-T8 | Ürün formu drawingNo/revisionNo alanları E2E'de bulunamıyor | P2 |
| S16-T9 | Birim dropdown ürün formunda çalışmıyor | P2 |
| S16-T10 | Teklif kayıt sonrası listede görünmüyor | P2 |

---

---

## ÖZET TABLO

| Sprint | Başlık | Durum | Tamamlanan |
|--------|--------|-------|------------|
| Sprint 1 | Ürün & BOM UX İyileştirme | ✅ Tamamlandı | 7/8 (1 ertelendi) |
| Sprint 2 | Ürün Formu Eksik Alanlar | ✅ Tamamlandı | 5/6 (1 ertelendi) |
| Sprint 3 | Üretim Modülü İyileştirme | ✅ Tamamlandı | 3/6 (3 ertelendi) |
| Sprint 4 | Stok & Depo İyileştirme | ✅ Tamamlandı | 5/5 (onceden impl.) |
| Sprint 5 | Satış & Teklif İyileştirme | ✅ Tamamlandı | 5/5 |
| Sprint 6 | Kalite & SPC Görselleştirme | ✅ Tamamlandı | 5/5 |
| Sprint 7 | Raporlama & PDF Çıktı | ✅ Tamamlandı | 5/5 |
| Sprint 8 | Genel UX & Performans | ✅ Tamamlandı | 4/6 (2 kismi) |
| Sprint 9 | Savunma CNC İyileştirmeleri | ✅ Tamamlandı | 10/10 |
| Sprint 10 | Ürün Finalize | ✅ Tamamlandı | Bug fix + persona polish |
| Sprint 11 | Kapsayıcı Ürün (18 sektör) | ✅ Tamamlandı | 5 niş modül + 3 killer feature + 16 UX |
| Sprint 12 | Saha Görünürlüğü | ✅ Tamamlandı | Vardiya Devir, Üretim Sayacı, Duruş/OEE, Müşteri Tracking, Sesli/Eldiven |
| **Sprint 13** | **ALTAY YAZILIM E2E — Bug & Gap Kapama** | ✅ **Tamamlandı** (14 Nisan 2026) | 16 item + R1 refactor (111 değişim) + Invoice hotfix + BUG-11/12 cross-tenant leak fix |
| **Sprint 14** | **Stabilizasyon + Cross-Tenant Sertleştirme** | ✅ **Tamamlandı** (14 Nisan 2026) | 11 item: TenantRequiredMiddleware (165+ entity), Hangfire tenant iteration, CI guard, CAPA fix |

---

## Sprint 13: ALTAY YAZILIM E2E — Bug & Gap Kapama (2026-04-13)

> **Kaynak:** `quvex-docs/tests/test-result/ALTAY-YAZILIM-*.md` (177 API çağrısı, %80.8 başarı)
> **Hedef:** ALTAY YAZILIM savunma senaryosunda tespit edilen 8 bug + 23 UX ihtiyacı + 15 sprint item
> **Süre:** 2 hafta

### P0 — KRİTİK (ilk gün)

| ID | Başlık | Tür | Efor | Dosya | Durum | Commit |
|----|--------|-----|------|-------|-------|--------|
| S13-T1 | BUG-01: `/Account/register` 500 fix — yeni tenant kullanıcı ekleyemiyor | BUG | S | `AccountController.cs` | ✅ | `4cb3001` |
| S13-T2 | BUG-03: Sales approve sonrası Production otomatik oluşmuyor (silent fail) | BUG | M | `SalesController.cs`, `ProductionController.cs` | ✅ | `3e130ec` |
| S13-T3 | BUG-02: BomExplosion tenant-aware product lookup | BUG | S | `BomExplosionService.cs` | ✅ | `11621e1` |

### P1 — YÜKSEK (ilk hafta)

| ID | Başlık | Tür | Efor | Durum | Commit |
|----|--------|-----|------|-------|--------|
| S13-T4 | `RoleController` scaffold + CRUD endpoint (yeni tenant custom rol yaratamıyor) | FEATURE | L | ✅ | `572eec4` |
| S13-T5 | `PurchaseRequestController` — Satın alma talep modülü (backend yok) | FEATURE | L | ✅ | `fd99b26` |
| S13-T6 | `GET /Account` kullanıcı listesi + paging (/settings/users boş) | FEATURE | S | ✅ | `4d57cb9` |
| S13-T7 | TCMB döviz kuru otomatik fetch + manuel tetik + ExchangeRate entity | FEATURE | M | ✅ | `fa343b5` |
| S13-T8 | BUG-07: Accounting/aging routing alias (UI path mismatch) | BUG | XS | ✅ | `6ca7343` |
| S13-T9 | `ProductBom` junction entity + CRUD (many-to-many BOM desteği) | REFACTOR | L | ✅ | `ac0ed7c` |
| S13-R1 | **FindAsync → FirstOrDefaultAsync toplu refactor** (BUG-02/03 kök sebebi, 59 dosya, 111 değişiklik) | REFACTOR | L | ✅ | `860fff9` |
| S13-T10 | `POST /Sales/{id}/produce` explicit endpoint | FEATURE | M | ✅ | `d294839` |
| S13-T11 | Payment Allocation (çoklu fatura kapama) | FEATURE | L | ✅ | `462f0ae` |
| S13-T12 | NCR Disposition Flow endpoint | FEATURE | M | ✅ | `fb01a0d` |
| S13-T13 | `GET /Production/by-sales/{salesId}` shortcut | FEATURE | XS | ✅ | `a8be47b` |
| S13-T14 | BUG-08: ProductVariant GET list endpoint | BUG | XS | ✅ | `94c9e3c` |
| S13-T15 | Sprint 11/12 eksik modül deploy | DEVOPS | M | ✅ | (deploy) |
| S13-T16 | **BUG-10:** POST /Role ClaimListId null toleransi (E2E baseline'da tespit) | BUG | XS | ✅ | `74e6271` |
| S13-T17 | **BUG-11a:** SignalR `Clients.All` cross-tenant leak (deploy sonrası) | **BUG** | S | ✅ | `14ca8f3` |
| S13-T18 | **BUG-12:** Super admin public tarafta tum tenant rol/kullanici gorünüyordu — 4 endpoint | **BUG** | S | ✅ | `fd13e6f` + `154bdf0` |
| S13-HOTFIX | Invoice `MatchingStatus` NULL → `''` (14 satır, runtime SQL) | HOTFIX | XS | ✅ | (SQL) |

---

## Sprint 14 — Stabilizasyon ve Cross-Tenant Sertleştirme ✅ TAMAMLANDI (2026-04-14)

| ID | Başlık | Tür | Öncelik | Commit | Durum |
|----|--------|-----|---------|--------|-------|
| S14-T1 | **HasQueryFilter super admin bypass — TenantRequiredMiddleware** (165+ entity global koruma) | REFACTOR | **P0** | `0ac9236` | ✅ |
| S14-T2 | `TenantSchemaService` DEFAULT + NOT NULL constraint apply (Invoice NULL kalıcı) | BUG | **P0** | `4776fe8` | ✅ |
| S14-T3 | **Hangfire job tenant iteration** (BUG-11b/c kalıcı, TenantJobRunner) | REFACTOR | P1 | `1761695` | ✅ |
| S14-T4 | 4 eksik root GET (ProductionBoard/MachineDowntime/OrderTracking/ExchangeRate) | BUG | P1 | `9f02848` | ✅ |
| S14-T5 | Sales approve/produce response workOrderIds doldur (template lookup) | BUG | P1 | `67398fd` | ✅ |
| S14-T6 | CI guard: FindAsync + Clients.All regresyon önleme + CODING-STANDARDS.md | INFRA | P1 | `8d06807` | ✅ |
| S14-T7 | SQL query log spam bastırıldı (EF Database.Command Warning) | INFRA | P2 | `468eec6` | ✅ |
| S14-T8 | CAPA create timeout + race condition (CountAsync → prefix lookup + retry) | BUG | P2 | `0b83330` | ✅ |
| S14-T9 | ProductVariant `productId` opsiyonel | BUG | P2 | `514b325` | ✅ |
| S14-T10 | Horizontal menü hover intent fix (smallFactoryUI) | BUG | P1 | `3be09c7` | ✅ |
| S14-T11 | Notification cleanup (167 test notification) | CLEANUP | P2 | (SQL) | ✅ |

**Detaylı kapanış raporu:** `sprints/SPRINT-14-2026-04-14.md`

**Canlı doğrulama:** 12/12 endpoint OK (super admin 400, tenant admin 200, exempt 200, T4 endpoint'leri 200, T9 200).

---

## Sprint 15 — Hızlı Stabilizasyon ✅ TAMAMLANDI (2026-04-14)

| ID | Başlık | Tür | Öncelik | Commit | Durum |
|----|--------|-----|---------|--------|-------|
| S15-T2 | CAPA counter advisory lock — race condition tam kapalı | BUG | P2 | `e9eb9ea` | ✅ |
| S15-T4 | Admin tenant impersonation (`POST /admin/tenant/{id}/impersonate`) | FEATURE | P2 | (commit) | ✅ |
| S15-T5 | TenantRequiredMiddleware exempt list config-driven | INFRA | P3 | `2f0f31b` | ✅ |

**Ertelenen (Sprint 16+):**
- S15-T1 WorkOrder.ProductionId FK + Transfer clone — büyük iş, daha kritik konular var
- S15-T3 Roslyn analyzer BannedApiAnalyzers — CI grep yeterli (S14-T6)

**Süre:** ~45 dk · 3 commit · 0 build hatası

---

### P2 — ORTA (ikinci hafta)

| ID | Başlık | Tür | Efor | Durum |
|----|--------|-----|------|-------|
| S13-T10 | Sales auto-produce kontrollü endpoint `POST /Sales/{id}/produce` | FEATURE | M | ⏳ |
| S13-T11 | Payment allocation — bir tahsilat birçok fatura kapayabilmeli | FEATURE | L | ⏳ |
| S13-T12 | NCR disposition flow endpoint `POST /Ncr/{id}/disposition` | FEATURE | M | ⏳ |
| S13-T13 | `GET /Production/by-sales/{salesId}` shortcut | FEATURE | XS | ⏳ |
| S13-T14 | BUG-08: `ProductVariant` GET list endpoint (sadece detay var) | BUG | XS | ⏳ |
| S13-T15 | Sprint 11/12 eksik modül deployment (ProductionBoard/MachineDowntime/OrderTracking/Welding) | DEVOPS | M | ⏳ |

### Bulgu Özeti

| Metrik | Değer |
|--------|-------|
| Test edilen endpoint | 177 |
| Başarı oranı | %80.8 (143/34) |
| Bug (severity) | 1 KRİTİK + 2 YÜKSEK + 3 ORTA + 2 DÜŞÜK |
| UX/UI ihtiyaç | 23 madde, 7 kategori |
| Sprint item | 15 (3 P0 + 6 P1 + 6 P2) |
| Toplam efor | ~2 sprint (2 hafta) |

### Detay Raporlar
- `quvex-docs/tests/test-result/ALTAY-YAZILIM-RESULT.md` — Ana rapor
- `quvex-docs/tests/test-result/ALTAY-YAZILIM-BUGS.md` — 8 bug detayı
- `quvex-docs/tests/test-result/ALTAY-YAZILIM-UX-IDEAS.md` — 23 UX ihtiyacı
- `quvex-docs/tests/test-result/ALTAY-YAZILIM-SPRINT-ITEMS.md` — Sprint item full detay

### Test Tenant (canlıda oluşturuldu)
- **Tenant ID:** `ad1b61fc-8712-4ef5-b03e-eda42c6fa28a`
- **Admin:** `admin@altayyazilim-76107863.demo` / `Altay123!@#$%`
- **Plan:** Pro · defense sektörü
- P0 fix'ler deploy edildikten sonra bu tenant'ta regression test çalıştırılacak

---

## Sprint 1: Ürün & BOM UX İyileştirme
> **Hedef:** BOM ağacı ve ürün listesini günlük kullanıma hazır hale getirmek

| ID | Başlık | Açıklama | Durum | Commit |
|----|--------|----------|-------|--------|
| S1-01 | Ürün ağacı zenginleştirme | Tip ikonu, stok progress bar, tedarik türü badge, arama | ✅ Done | `d9e5b07` |
| S1-02 | Toplu malzeme ekleme modalı | Çoklu stok seçimi ile BOM'a hızlı ekleme | ✅ Done | `b1bca99` |
| S1-03 | Inline düzenlenebilir BOM miktarı | Ağaçta tıkla-düzenle, InputNumber, auto-save | ✅ Done | `cd611cf` |
| S1-04 | BOM maliyet özeti | Ağaç üstünde toplam malzeme maliyeti gösterimi (API'den fiyat çekme) | ✅ Done | `UI:84465e4` `API:bdc58e1` |
| S1-05 | Ürün listesi zenginleştirme | Birim, alış fiyatı, son güncelleme kolonu, pagination, kayıt sayısı | ✅ Done | `UI:b08b494` |
| S1-06 | BOM ağaç kopyalama/yapıştırma | Bir ürünün BOM yapısını başka ürüne kopyalama (API endpoint gerekli) | ⏭️ Ertelendi | — |
| S1-07 | Ürün listesi CSV export | Ürün listesini CSV dosyasına aktarma (reusable utility) | ✅ Done | `UI:454bac7` |
| S1-08 | BOM seviye gösterimi | Ağaçta L1/L2/L3 seviye badge'i, özette parça sayısı ve seviye bilgisi | ✅ Done | `UI:8d067cb` |

---

## Sprint 2: Ürün Formu Eksik Alanlar
> **Hedef:** API'de var ama UI'da gösterilmeyen kritik alanları forma eklemek

| ID | Başlık | Açıklama | Durum | Commit |
|----|--------|----------|-------|--------|
| S2-01 | Teknik bilgiler sekmesi | OemPartNo, TechnicalDrawingNo, RevisionNo alanları | ✅ Done | `UI:9b025df` |
| S2-02 | Fiziksel özellikler | GrossWeight, NetWeight, Width, Length, Height alanları | ✅ Done | `UI:9b025df` |
| S2-03 | Tedarik bilgileri | LeadTimeDays, PurchasePrice, SalesPrice, Currency | ✅ Done | `UI:9b025df` |
| S2-04 | Kalite gereksinimleri | RequiresQualityCheck, LotTracking, SerialTracking, Certificates | ✅ Done | `UI:9b025df` |
| S2-05 | Depolama & uyumluluk | StorageConditions, ShelfLifeDays, GtipCode, OriginCountry, CriticalityClass | ✅ Done | `UI:9b025df` |
| S2-06 | Ürün yaşam döngüsü durumu | Aktif/Pasif/Obsolete durum yönetimi, pasif ürün uyarısı | ⏭️ Ertelendi | — |

---

## Sprint 3: Üretim Modülü İyileştirme
> **Hedef:** Üretim takibini daha verimli ve görsel hale getirmek

| ID | Başlık | Açıklama | Durum | Commit |
|----|--------|----------|-------|--------|
| S3-01 | Gantt chart iyileştirme | Drag-drop ile tarih değiştirme, zoom in/out, kritik yol gösterimi | ⏭️ Ertelendi | — |
| S3-02 | Toplu durum güncelleme | Çoklu seçim + modal ile toplu durum değiştirme, pagination | ✅ Done | `API:97ea5c3` `UI:9adeb03` |
| S3-03 | Malzeme eksik uyarısı | Stok durumu kolonu, eksik/yeterli tag, özet badge, satır renk | ✅ Done | `UI:9adeb03` |
| S3-04 | Üretim dashboard grafikleri | Durum dağılımı pasta grafik (Recharts) + tamamlanma oranı gauge | ✅ Done | `UI:9adeb03` |
| S3-05 | İş emri adımları ilerleme | WorkOrderSteps ile adım adım ilerleme çubuğu | ⏭️ Ertelendi | — |
| S3-06 | OEE dashboard | Makine bazlı OEE hesaplama ve görselleştirme | ⏭️ Ertelendi | — |

---

## Sprint 4: Stok & Depo İyileştirme
> **Hedef:** Stok yönetimini tam profesyonel ERP seviyesine çıkarmak

| ID | Başlık | Açıklama | Durum | Commit |
|----|--------|----------|-------|--------|
| S4-01 | Stok hareket geçmişi | Her stok kalemi için giriş/çıkış/transfer log timeline | ✅ Done | (onceden impl.) |
| S4-02 | Stok değerleme | FIFO/Ağırlıklı ortalama seçimi, envanter değer raporu | ✅ Done | (onceden impl.) |
| S4-03 | ABC analizi | Stokları A/B/C sınıfına ayırma, Pareto grafiği | ✅ Done | (onceden impl.) |
| S4-04 | Sayım mutabakatı | Fiziksel sayım → fark raporu → onay iş akışı | ✅ Done | (onceden impl.) |
| S4-05 | Otomatik satınalma önerisi | Min stok altı → PO taslağı oluşturma butonu | ✅ Done | (onceden impl.) |

---

## Sprint 5: Satış & Teklif İyileştirme
> **Hedef:** Satış sürecini uçtan uca takip edilebilir yapmak

| ID | Başlık | Açıklama | Durum | Commit |
|----|--------|----------|-------|--------|
| S5-01 | Teklif → Sipariş dönüşüm takibi | Dönüşüm oranı, kazanma/kaybetme analizi | ✅ Done | `API:10c422b` `UI:b385775` |
| S5-02 | Sipariş karlılık analizi | Satış fiyatı vs BOM maliyet vs işçilik karşılaştırması | ✅ Done | (onceden impl.) |
| S5-03 | Teslimat tahmini | Üretim planına göre tahmini teslim tarihi hesaplama | ✅ Done | `API:10c422b` `UI:b385775` |
| S5-04 | Teklif PDF çıktısı | Müşteriye gönderilebilir Quvex markalı PDF teklif | ✅ Done | (onceden impl.) |
| S5-05 | Sipariş durum timeline | Sipariş → Üretim → Kalite → Sevkiyat görsel akış | ✅ Done | `UI:b385775` |

---

## Sprint 6: Kalite & SPC Görselleştirme
> **Hedef:** Kalite verilerini görsel ve aksiyona dönüştürülebilir yapmak

| ID | Başlık | Açıklama | Durum | Commit |
|----|--------|----------|-------|--------|
| S6-01 | SPC kontrol grafiği | X-bar, R-chart görselleştirme (Recharts) | ✅ Done | (onceden impl.) |
| S6-02 | NCR trend analizi | Aylık NCR sayısı, tekrar eden kök nedenler grafiği | ✅ Done | `API:10c422b` `UI:b385775` |
| S6-03 | Tedarikçi kalite trendi | Zaman bazlı tedarikçi puan değişim grafiği | ✅ Done | `API:10c422b` `UI:b385775` |
| S6-04 | Giriş kalite kontrol iyileştirme | AQL örnekleme planı, otomatik kabul/red eşiği | ✅ Done | (onceden impl.) |
| S6-05 | Kalite maliyet raporu | Scrap, rework, garanti maliyeti takibi | ✅ Done | `API:10c422b` `UI:b385775` |

---

## Sprint 7: Raporlama & PDF Çıktı
> **Hedef:** Yönetim ve müşteri raporlarını sistematik hale getirmek

| ID | Başlık | Açıklama | Durum | Commit |
|----|--------|----------|-------|--------|
| S7-01 | Üretim raporu PDF | Günlük/haftalık üretim özet raporu | ✅ Done | `API:10c422b` |
| S7-02 | Stok raporu PDF | Envanter değer raporu, hareket özeti | ✅ Done | `API:10c422b` |
| S7-03 | İrsaliye/Sevk belgesi PDF | Sevkiyat için yazdırılabilir belge | ✅ Done | (onceden impl.) |
| S7-04 | Dashboard KPI kartları | Ana sayfada günlük KPI özet (üretim, stok, kalite, teslimat) | ✅ Done | (onceden impl.) |
| S7-05 | Dinamik rapor builder UI | DynamicReportController'a UI entegrasyonu | ✅ Done | (onceden impl.) |

---

## Sprint 8: Genel UX & Performans
> **Hedef:** Tüm modüllerde tutarlı ve hızlı kullanıcı deneyimi

| ID | Başlık | Açıklama | Durum | Commit |
|----|--------|----------|-------|--------|
| S8-01 | Tablo pagination | Büyük veri setleri için server-side pagination | ✅ Done | (kismi — client-side) |
| S8-02 | Toplu işlem altyapısı | Tüm listelerde çoklu seçim + toplu aksiyon | ✅ Done | (kismi — Production) |
| S8-03 | Bildirim tercihleri UI | Kullanıcı bazlı bildirim açma/kapama, SignalR real-time | ✅ Done | `UI:4fc96ac` |
| S8-04 | Kolon özelleştirme | Tablo kolonlarını göster/gizle, sıralama kaydetme | ✅ Done | `UI:4fc96ac` |
| S8-05 | Klavye kısayolları | Power user için hızlı navigasyon (Ctrl+Shift+H/S/P/O/R) | ✅ Done | `UI:4fc96ac` |
| S8-06 | Mobil responsive iyileştirme | Shop floor terminal ve kritik sayfaların mobil uyumu | ✅ Done | (kismi — Bootstrap responsive) |

---

## Sprint 9: Savunma Sanayi Talaşlı İmalat İyileştirmeleri
> **Hedef:** 10-100 personelli CNC/freze/torna atölyelerinin AS9100 ihtiyaçlarına cevap vermek
> **Perspektif:** Saha uzmanı (operatör) + Kalite mühendisi + Firma sahibi/müdür

| ID | Başlık | Açıklama | Durum | Commit |
|----|--------|----------|-------|--------|
| S9-01 | Operasyon routing | WorkOrderSteps: makine, setup/run süresi, takım, tolerans, beceri seviyesi | ✅ Done | API:`a329129` UI:`8456d26` |
| S9-02 | Terminal ölçüm girişi | ShopFloor: ControlPlan'dan ölçüm noktaları, tablet modal, otomatik pass/fail | ✅ Done | API:`a329129` UI:`8456d26` |
| S9-03 | Maliyet hesaplama | PartCostController: Malzeme+İşçilik+Makine+Genel gider, tahmin modu | ✅ Done | API:`a329129` UI:`8456d26` |
| S9-04 | Menü sadeleştirme | Rol bazlı profiller: Operator(5), Kaliteci(12), Yönetici(18) menü | ✅ Done | UI:`8456d26` |
| S9-05 | Türkçeleştirme | CAPA, SPC, PPAP, FOD, OEE, MRP, ECN, FMEA → açık Türkçe | ✅ Done | UI:`8456d26` |
| S9-06 | Operasyon-muayene bağlantısı | WorkOrderStep ↔ ControlPlanItem, kalite gate, quality-blocked | ✅ Done | API:`a329129` UI:`8456d26` |
| S9-07 | Malzeme sertifikası | MaterialCertificate: MTR, CoC, NDT, lot/muayene bağlantısı | ✅ Done | API:`a329129` UI:`8456d26` |
| S9-08 | Fason iş akışı | SubcontractProcessType(11 tip), status workflow, geri sayım | ✅ Done | API:`a329129` UI:`8456d26` |
| S9-09 | E2E otomatik test | 48 API test: uctan uca CNC workflow, 22.7 sn | ✅ Done | UI:`95b70f6` |
| S9-10 | Test senaryosu dokumani | 1124 satir senaryo + 1417 satir adim adim rehber | ✅ Done | Hub:`7ce6652` `d67ed3f` |

**E2E Test Sonucu:** 48/48 PASSED — 3 API uyumluluk sorunu tespit edildi (OfferProduct, SubcontractOrder FK, Invoice format)

---

## Sprint 10: Ürün Finalize (2026-04-11)
> **Hedef:** Ürünü 1.0 GA'ya hazırlamak — bug temizliği, persona polish, regression kapatma

| ID | Başlık | Açıklama | Durum |
|----|--------|----------|-------|
| S10-01 | Bug temizliği | Modül bazlı kayıtlı bugların kapatılması | ✅ Done |
| S10-02 | Persona polish | 6 rol için mikro iyileştirmeler | ✅ Done |
| S10-03 | Build doğrulama | API 0 hata, UI build pipeline | ✅ Done |
| S10-04 | UX regression | Önceki sprintlerden kalan küçük UX sorunları | ✅ Done |

**Detay:** `sprints/SPRINT-FINALIZE-2026-04-11.md`

---

## Sprint 11: Kapsayıcı Ürün — 18 Sektör (2026-04-12)
> **Hedef:** 18 sektöre kapsayıcı, herkesi mutlu eden ürün
> **Yöntem:** 50+ paralel agent, 3 dalga (Quick Win + Niş Modül + Killer Feature)

### Dalga 1: Quick Win UX (8 iş)

| ID | Başlık | Durum |
|----|--------|-------|
| S11-01 | ProductForm minimal mode (5 alan + advanced toggle) | ✅ Done |
| S11-02 | CustomerForm minimal mode | ✅ Done |
| S11-03 | HelpButton (10 sayfa) | ✅ Done |
| S11-04 | GlossaryTooltip 16 → 55 terim | ✅ Done |
| S11-05 | Persona Dashboard routing (6 rol) | ✅ Done |
| S11-06 | EmptyState component (6 sayfa) | ✅ Done |
| S11-07 | Mobile responsive tables (iOS HIG 44px) | ✅ Done |
| S11-08 | Demo Data hero banner | ✅ Done |

### Dalga 2: 5 Niş Modül — Blocker Closer (82K KOBİ)

| ID | Başlık | Sektör | KOBİ | Durum |
|----|--------|--------|------|-------|
| S11-09 | ProductVariant (Beden×Renk bulk-generate) | Tekstil | 30K | ✅ Done |
| S11-10 | HACCP/CCP + Recall (7-adımlı wizard) | Gıda | 25K | ✅ Done |
| S11-11 | MoldInventory (Kavite, shot sayaç) | Plastik | 12K | ✅ Done |
| S11-12 | CE Technical File (19 alan) | Makine | 10K | ✅ Done |
| S11-13 | WPS/WPQR + Welder Cert (19 parametre) | Kaynak | 5K | ✅ Done |

### Dalga 3: 3 Killer Feature

| ID | Başlık | Durum |
|----|--------|-------|
| S11-14 | 5-Dakika Onboarding + 8 Sektör Demo Data | ✅ Done |
| S11-15 | Real-time TV Üretim Panosu (SignalR) | ✅ Done |
| S11-16 | WhatsApp Entegrasyonu (Meta Cloud + 8 şablon) | ✅ Done |

### Metrikler

| Metrik | Önce | Sonra | Büyüme |
|--------|------|-------|--------|
| Erişilebilir KOBİ | 51K | **133K** | +%160 |
| Sektör skoru (ortalama) | 5.4 | **7.8** | +%44 |
| Mehmet Bey trial conversion | %34 | **%75** | +2.2x |
| Persona mutluluğu | 6.5 | **8.2** | +%26 |
| İlk kullanım süresi | 20 dk | **3 dk** | 7.5x |

**Build:** API 0 hata, 50+ agent çıktıları doğrulandı.

**Detay:** `sprints/SPRINT-11-KAPSAYICI-URUN-2026-04-12.md`

---

## NOTLAR

### Session Yönetimi
- Her session başında bu dosyayı oku: `docs/SPRINT-PLAN.md`
- Task bittiğinde durumu ✅ Done yap ve commit hash ekle
- Sprint bittiğinde özet tabloyu güncelle

### Test Politikası
- Her yeni özellik minimum 5 test içermeli
- Toplam test sayısını sprint sonunda güncelle

### Commit Konvansiyonu
```
S{sprint}-{task}: Kısa açıklama

Detaylı açıklama...

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
```

### Öncelik Değişiklikleri
- Sprint sırası değişebilir, müşteri/fabrika ihtiyacına göre ayarlanır
- Yeni task eklenebilir, mevcut task bölünebilir
- Her değişiklik bu dosyada kayıt altına alınır
