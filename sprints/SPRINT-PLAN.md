# Quvex ERP — Sprint Planı

> **Son Güncelleme:** 2026-04-05
> **Durum:** 8 temel sprint + 1 savunma sprinti tamamlandı
> **Toplam Test:** 686 UI + 1223 API test geçiyor

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
| Sprint 9 | Savunma CNC İyileştirmeleri | ✅ Tamamlandı | 8/8 |

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
