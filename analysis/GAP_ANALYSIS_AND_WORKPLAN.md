# Quvex ERP — Boşluk Analizi ve İş Planı

**Tarih:** 2026-03-10
**Kaynak:** PRD.md v3.0 vs Mevcut Durum Karşılaştırması

---

## Mevcut Durum Özeti

| Metrik | Değer |
|--------|-------|
| API Controller | 91 |
| UI Route | 88 |
| API Test | 709/710 ✅ |
| UI Test | 413/413 ✅ |
| PRD Bölüm 6 (8 iyileştirme) | 8/8 API ✅, 1/8 UI ✅ |

---

## BOŞLUK ANALİZİ

### Kategori 1: API tamamlandı — UI eksik (PRD Bölüm 6)

| # | Özellik | API | UI | Eksik |
|---|---------|-----|-----|-------|
| A1 | Satınalma Siparişi (PO) | ✅ `PurchaseOrderController` | ❌ | PO liste, form, detay, mal alım sayfaları |
| A2 | Stok Rezervasyonu | ✅ Otomatik rezerv | ⚠️ | Stok listesinde ReservedQty / AvailableQty gösterimi |
| A3 | İade Faturası + Tevkifat | ✅ Credit note endpoint | ❌ | Fatura formunda iade tipi, tevkifat oranı, orijinal fatura referansı |
| B1 | PDF Çıktılar | ✅ `/api/Pdf/offer/{id}`, `invoice/{id}` | ❌ | Teklif ve fatura sayfalarına PDF indirme butonları |
| B2 | Depolar Arası Transfer | ✅ `StockTransferController` | ❌ | Transfer liste, form, onay sayfaları |
| B3 | Teklif Geçerlilik | ✅ API + UI | ✅ | — |
| C1 | Kalite Kapısı | ✅ quality-gate, quality-approve | ❌ | Üretim iş emri adımında kalite kapısı toggle + onay butonu |
| C2 | Operasyon Sırası | ✅ Sıra zorlama | ✅ | Backend-only kontrol, UI'da uyarı mesajı zaten geliyor |

### Kategori 2: PRD'de tanımlı — API var, UI eksik/zayıf

| # | PRD Bölümü | API | UI | Eksik |
|---|-----------|-----|-----|-------|
| D1 | İrsaliye PDF (B1 kapsamı) | ❌ | ❌ | PdfService'e irsaliye desteği + sevkiyat sayfasına buton |
| D2 | Stok listesinde renk kodlama (3.5) | ✅ Alert API | ⚠️ | Min altı kırmızı, sipariş noktası turuncu, max üstü mavi |
| D3 | Dashboard KPI kartları (3.5) | ✅ Kısmi | ⚠️ | Stok uyarı sayıları, PO durumları, üretim özeti |
| D4 | Excel export butonları (3.9) | ✅ ExportService | ⚠️ | Raporlama sayfalarında görünür buton |
| D5 | Cari hesap ekstre raporu | ✅ CustomerStatementService | ⚠️ | Ekstre sayfasında PDF/yazdır |

### Kategori 3: PRD Bölüm 6 — Ertelenenler (henüz başlanmadı)

| # | Özellik | Karmaşıklık | Notlar |
|---|---------|-------------|--------|
| E1 | Atölye terminali (tablet UI) | Yüksek | Operatör için basitleştirilmiş touch-friendly ekran |
| E2 | Fason/taşeron iş emri | Orta | Dış tedarikçiye iş emri gönderme, takip |
| E3 | Çoklu adres ve iletişim kişisi | Düşük | Customer model genişletme |
| E4 | Seri numara takibi | Orta | Lot'a benzer ama birebir izlenebilirlik |
| E5 | e-Fatura GİB entegrasyonu | Yüksek | Foriba/Logo Connect provider bağlantısı |
| E6 | Depo lokasyon hiyerarşisi (raf/bin) | Orta | Warehouse alt yapısı genişletme |
| E7 | Sonlu kapasite çizelgeleme | Yüksek | Algoritma + Gantt entegrasyonu |

---

## FAZLANDIRMA

### 🔵 Faz 1 — UI Tamamlama (Öncelik: Kritik)
**Hedef:** PRD Bölüm 6'daki 8 iyileştirmenin UI'larını tamamla. API hazır, sadece frontend.

| Sıra | İş | Tahmini Dosya | Bağımlılık |
|------|-----|--------------|-----------|
| 1.1 | **PO Sayfaları** — PurchaseOrderList, PurchaseOrderForm, PurchaseOrderDetail, ReceiveGoods | 4 yeni sayfa + route | — |
| 1.2 | **PDF Butonları** — Teklif detayda "PDF İndir", Fatura detayda "PDF İndir" | 2 dosya edit | — |
| 1.3 | **Stok Transfer Sayfaları** — StockTransferList, StockTransferForm | 2 yeni sayfa + route | — |
| 1.4 | **İade Faturası UI** — InvoiceForm'a tip seçimi (satış/iade), tevkifat oranı, orijinal fatura referansı | 1 dosya edit | — |
| 1.5 | **Kalite Kapısı UI** — Üretim adım listesinde kalite kapısı toggle + onay butonu | 1-2 dosya edit | — |
| 1.6 | **Stok Rezervasyon Gösterimi** — Stok listesinde Reserved / Available kolonları | 1 dosya edit | — |

**Tamamlanma kriteri:** Kullanıcı tüm Bölüm 6 özelliklerini UI üzerinden kullanabilir.

---

### 🟢 Faz 2 — Kullanıcı Deneyimi İyileştirmeleri
**Hedef:** PRD'deki "Excel'e dönüş yok" ve "Belge üretilebilir" kriterlerini karşıla.

| Sıra | İş | Detay |
|------|-----|-------|
| 2.1 | **İrsaliye PDF** | PdfService'e GenerateShippingPdf ekle, sevkiyat sayfasına buton |
| 2.2 | **Stok Renk Kodlama** | Stok listesinde min/max/sipariş noktası renkleri |
| 2.3 | **Dashboard Genişletme** | PO durumları kartı, stok uyarı sayıları, üretim özet widget |
| 2.4 | **Excel Export Butonları** | Rapor sayfalarına görünür "Excel İndir" butonları |
| 2.5 | **Cari Ekstre Yazdır/PDF** | Ekstre sayfasına yazdır butonu |
| 2.6 | **PO ↔ Fatura Eşleştirme** | 3'lü eşleşme: PO → Mal Alım → Fatura bağlantısı |

---

### 🟡 Faz 3 — PRD Ertelenen Özellikler (Seçmeli)
**Hedef:** Müşteri değeri en yüksek ertelenen özellikleri al.

| Öncelik | İş | Gerekçe |
|---------|-----|---------|
| 1 | **E3: Çoklu adres/kişi** | Düşük efor, yüksek günlük kullanım değeri |
| 2 | **E2: Fason iş emri** | Savunma sektöründe yaygın ihtiyaç |
| 3 | **E4: Seri numara takibi** | AS9100 izlenebilirlik gereksinimi |
| 4 | **E6: Depo lokasyon** | Büyüyen depolar için gerekli |
| 5 | **E5: e-Fatura GİB** | Yasal zorunluluk (provider bağımlı) |
| 6 | **E1: Atölye terminali** | Operatör verimliliği (ayrı UI tasarımı gerektirir) |
| 7 | **E7: Sonlu kapasite** | Algoritmik karmaşıklık yüksek, şimdilik Gantt yeterli |

---

### 🔴 Faz 4 — PRD Başarı Kriterleri Doğrulama

PRD Bölüm 8'deki 5 kriter:

| # | Kriter | Mevcut Durum | Gerekli Aksiyon |
|---|--------|-------------|----------------|
| 1 | Zincir kesintisiz | ⚠️ PO UI eksik | Faz 1.1 tamamlanınca ✅ |
| 2 | Denetim günü hazır | ✅ Kalite modülleri tam | Faz 1.5 (kalite kapısı UI) |
| 3 | Excel'e dönüş yok | ⚠️ PDF çıktı yok | Faz 1.2 + Faz 2.1 + 2.4 |
| 4 | Stok güvenilir | ⚠️ Rezervasyon UI yok | Faz 1.6 |
| 5 | Belge üretilebilir | ⚠️ PDF buton yok | Faz 1.2 + Faz 2.1 |

---

## ÖNERİLEN BAŞLANGIÇ SIRASI

```
Faz 1.2 (PDF butonları)          ← En hızlı, en görünür etki
Faz 1.6 (Stok rezervasyon UI)    ← 1 dosya edit
Faz 1.1 (PO sayfaları)           ← En büyük iş, en kritik boşluk
Faz 1.4 (İade faturası UI)       ← Mevcut form genişletme
Faz 1.3 (Stok transfer UI)       ← Yeni sayfalar
Faz 1.5 (Kalite kapısı UI)       ← Üretim modülüne ekleme
```

**Not:** Her iş kalemi için commit + test kuralı geçerli.

---

*Bu doküman PRD.md v3.0 baz alınarak hazırlanmıştır. Güncellemeler için IMPLEMENTATION_SUMMARY.md ile birlikte okunmalıdır.*
