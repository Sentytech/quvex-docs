# Quvex ERP — Derin Süreç Analizi ve Fazlandırılmış İş Planı

**Versiyon:** 1.1
**Tarih:** 2026-03-10
**Son Güncelleme:** Faz 1 ✅ tamamlanmış olarak tespit edildi, Faz 2 büyük oranda tamamlanmış, kalan 3 task implementasyonu yapıldı.
**Kaynak:** PRD.md v3.0, ERP_EKSIK_ANALIZI.md, GAP_ANALYSIS_AND_WORKPLAN.md, AS9100_TARGET_FIT_ANALYSIS.md
**Yöntem:** PRD hedefleri vs mevcut kod tabanı karşılaştırması + kullanıcı senaryosu bazlı süreç analizi

---

## BÖLÜM 1: MEVCUT DURUM ÖZETİ

### Sayısal Tablo

| Metrik | Değer |
|--------|-------|
| API Controller | 91 |
| API Service | 65 |
| API Model/Entity | 75+ |
| API DTO | 101 |
| API Test | 709/710 ✅ |
| UI View | 130+ |
| UI Route | 88 |
| UI Service | 41 |
| UI Test | 413/413 ✅ |
| DB Migration | 29 |
| Kalite Modülü | 21 alt modül |

### Ana Zincir Durumu (PRD Bölüm 2)

```
MÜŞTERİ ──→ TEKLİF ──→ SİPARİŞ ──→ ÜRETİM ──→ SEVKİYAT ──→ FATURA ──→ TAHSİLAT
   ✅          ✅          ✅          ✅         ⚠️           ⚠️          ⚠️
```

- ✅ = Temel akış çalışıyor (API + UI)
- ⚠️ = API var ama UI eksik/zayıf veya süreç tam kapanmıyor

---

## BÖLÜM 2: SÜREÇ BAZLI DERİN ANALİZ

Her süreç, **kullanıcı senaryosu** üzerinden analiz edilmiştir. "Bu rolde bu görevi yapan kişi bugün ne yapabilir, nerede takılır?" sorusu sorulmuştur.

---

### 2.1 TEKLİF SÜRECİ

**Kullanıcı:** Satış sorumlusu
**Senaryo:** Müşteriden gelen talep için teklif hazırla, gönder, takip et

| Adım | Durum | Detay |
|------|-------|-------|
| Müşteri seç, kalem ekle | ✅ | Çalışıyor |
| Fiyat, miktar, iskonto, KDV | ✅ | Hesaplamalar otomatik |
| Durum akışı (Taslak→Gönderildi→Kabul/Red) | ✅ | Çalışıyor |
| Revizyon oluşturma | ✅ | Bağımsız kayıt + referans |
| Geçerlilik süresi | ✅ | API + UI tamamlandı |
| **PDF çıktı almak** | ⛔ API ✅, UI ❌ | PdfService var, buton yok |
| **Tekliften siparişe dönüşüm** | ✅ | Çalışıyor |
| **Teklif email gönderimi** | ❌ | SmtpEmailService var, entegrasyon yok |
| **Teklif onay süreci (yönetici)** | ❌ | Büyük tutarlı tekliflerde onay mekanizması yok |

**Kritik Boşluklar:**
1. PDF butonu olmadan müşteriye resmi teklif gönderilemiyor → Excel'e dönüş
2. Email entegrasyonu olmadan manuel iletişim gerekiyor

---

### 2.2 SİPARİŞ ve SATIŞ SÜRECİ

**Kullanıcı:** Satış sorumlusu + Üretim planlayıcı
**Senaryo:** Kabul edilen teklifi siparişe çevir, üretim planla

| Adım | Durum | Detay |
|------|-------|-------|
| Tekliften sipariş oluşturma | ✅ | Otomatik numara, hiyerarşik yapı |
| BOM'dan alt sipariş açma | ✅ | Recursive alt sipariş |
| Tedarik tipi (iç/dış) seçimi | ✅ | Çalışıyor |
| Üretime aktarma | ✅ | Tek tıkla |
| **Stok rezervasyonu** | ⛔ API ✅, UI ⚠️ | Otomatik rezerv çalışıyor, UI'da reserved/available gösterilmiyor |
| **Sipariş onay iş akışı** | ❌ | Satış→Yönetici→Üretim onay zinciri yok |
| **Kısmi teslimat takibi** | ⚠️ | Sevkiyatta kısmi var, UI'da netlik az |
| **Geciken sipariş uyarıları** | ⚠️ | Alert altyapısı var, dashboard'da belirgin değil |

**Kritik Boşluklar:**
1. Stok rezervasyonu UI'da görünmüyor → Aynı stok birden fazla siparişe söz verilir
2. Sipariş onay süreci yok → Yetkisiz sipariş riski

---

### 2.3 ÜRETİM SÜRECİ

**Kullanıcı:** Üretim planlayıcı + Operatör
**Senaryo:** İş emri planla, üret, tamamla

| Adım | Durum | Detay |
|------|-------|-------|
| İş emri şablonu seçme | ✅ | Template + step yapısı |
| Gantt'ta planlama | ✅ | 6 haftalık, gecikme vurgusu |
| Operatör tamamlama girişi | ✅ | Miktar, süre, makine, operatör |
| Malzeme tüketimi (stoktan) | ✅ | Otomatik çıkış |
| Fire/hurda kaydı | ✅ | 7 neden kategorisi |
| Kapasite planlama | ✅ | Makine bazlı |
| **Kalite kapısı (quality gate)** | ⛔ API ✅, UI ❌ | Backend'de var, UI toggle/onay butonu yok |
| **Operasyon sırası zorlama** | ✅ | Backend kontrol + UI uyarısı |
| **Maliyet takibi (gerçekleşen)** | ✅ | 5 kategori maliyet |
| **Varyans analizi** | ✅ | Standart vs gerçekleşen |

**Kritik Boşluklar:**
1. Kalite kapısı UI eksik → Denetimde "ara kontrol noktanız nerede?" sorusuna cevap yok
2. Atölye terminali yok → Operatör masabaşı bilgisayara gitmek zorunda

---

### 2.4 SATINALMA SÜRECİ

**Kullanıcı:** Satınalma sorumlusu
**Senaryo:** İhtiyaç doğ, teklif topla, sipariş ver, mal al

| Adım | Durum | Detay |
|------|-------|-------|
| Tedarik talebi oluşturma | ✅ | Üretimden veya stoktan |
| Tedarikçi teklifi toplama | ✅ | Çoklu teklif karşılaştırma |
| MRP bazlı otomatik öneri | ✅ | BOM patlatma + net ihtiyaç |
| **PO (Satınalma siparişi)** | ⛔ API ✅, UI ❌ | PurchaseOrderController var, UI sayfaları yok |
| **PO → Mal alım → Fatura eşleşme** | ❌ | 3'lü eşleşme akışı yok |
| **Tedarikçiye resmi sipariş belgesi** | ❌ | PDF PO belgesi yok |

**Kritik Boşluklar:**
1. PO UI yok → Tedarikçiye resmi sipariş verilemez, mal alım bağlanamaz
2. Bu, PRD Bölüm 6'da "operasyonu bloke eden" #1 madde

---

### 2.5 STOK ve DEPO SÜRECİ

**Kullanıcı:** Depo sorumlusu
**Senaryo:** Mal kabul et, sayım yap, stok izle, transfer et

| Adım | Durum | Detay |
|------|-------|-------|
| Çoklu depo yönetimi | ✅ | Depo CRUD |
| Giriş/çıkış fişleri | ✅ | IN/OUT, negatif stok engeli |
| Stok sayım | ✅ | Taslak→Devam→Tamamlandı→Onaylandı |
| Lot/parti takibi | ✅ | Lot no, üretim tarihi, SKT, FIFO |
| Stok değerleme (FIFO/Ort.) | ✅ | API + UI |
| Min/max uyarı | ✅ | 3 seviye uyarı |
| Barkod işlemleri | ✅ | EAN-13, arama, yazdırma |
| Otomatik satınalma talebi | ✅ | Yeniden sipariş noktasında tetiklenir |
| **Depolar arası transfer** | ⛔ API ✅, UI ❌ | StockTransferController var, UI sayfaları yok |
| **Stok renk kodlama** | ⚠️ | Alert API var, listede renk yok |
| **Seri numara takibi** | ❌ | PRD'de ertelenen, AS9100 için gerekli |

**Kritik Boşluklar:**
1. Transfer UI yok → İki ayrı fiş (çıkış+giriş) workaround'u gerekiyor
2. Seri numara yok → AS9100 serial-level izlenebilirlik eksik

---

### 2.6 SEVKİYAT SÜRECİ

**Kullanıcı:** Depo sorumlusu + Satış sorumlusu
**Senaryo:** Üretimi biten ürünü sevk et, irsaliye oluştur

| Adım | Durum | Detay |
|------|-------|-------|
| Sevke hazır ürünleri gör | ✅ | Üretim tamamlananlar |
| İrsaliye bilgisi girme | ✅ | İrsaliye no, miktar, tarih |
| Sevk miktarı takibi | ✅ | Kısmi sevk destekli |
| **İrsaliye PDF** | ❌ | PdfService'te irsaliye desteği yok |
| **Sevk onay süreci (kalite sonrası)** | ❌ | Kalite onayı olmadan sevk edilebilir |
| **Final inspection release** | ❌ | AS9100 gereği final muayene serbest bırakma yok |
| **CoC / teslim dosyası** | ❌ | Certificate of Conformance otomatik üretimi yok |

**Kritik Boşluklar:**
1. İrsaliye PDF yok → Müşteriye resmi belge gönderilemiyor
2. Final release + CoC yok → Savunma sanayi denetiminde ciddi boşluk

---

### 2.7 FATURA ve FİNANS SÜRECİ

**Kullanıcı:** Muhasebe
**Senaryo:** Sevk edilen sipariş için fatura kes, ödeme takip et

| Adım | Durum | Detay |
|------|-------|-------|
| Fatura oluşturma | ✅ | Numara sistemi, kalem bazlı |
| KDV hesaplama (%1, %10, %20) | ✅ | Otomatik |
| Fatura durum akışı | ✅ | Taslak→Gönderildi→Ödendi/Kısmi/Gecikmiş |
| Ödeme kaydı (4 yöntem) | ✅ | Nakit, havale, KK, çek |
| Kısmi ödeme | ✅ | Çoklu ödeme desteği |
| Cari hesap ekstre | ✅ | Borç/alacak, bakiye, tarih filtresi |
| Ödeme vadesi (8 tip) | ✅ | Peşin'den özel'e kadar |
| **İade faturası (credit note)** | ⛔ API ✅, UI ❌ | Endpoint var, formda seçenek yok |
| **Tevkifat (stopaj)** | ⛔ API ✅, UI ❌ | Hesaplama var, UI'da oran girişi yok |
| **Fatura PDF** | ⛔ API ✅, UI ❌ | PdfService var, buton yok |
| **e-Fatura GİB** | ⚠️ | Stub altyapı, gerçek provider yok |

**Kritik Boşluklar:**
1. İade faturası ve tevkifat UI yok → B2B ticarette yasal zorunluluk
2. Fatura PDF yok → Müşteriye resmi fatura gönderilemiyor

---

### 2.8 KALİTE SÜREÇLERİ

**Kullanıcı:** Kalite mühendisi
**Senaryo:** Gelen malzeme kontrol, üretim kalite, NCR aç, CAPA takip et

| Adım | Durum | Detay |
|------|-------|-------|
| Giriş kalite kontrol | ✅ | Ölçüm kaydı, kabul/red |
| NCR (uygunsuzluk) | ✅ | Kök neden, durum takibi |
| CAPA | ✅ | Düzeltici/önleyici faaliyet |
| FAI (AS9102 Form 1/2/3) | ✅ | Karakteristik bazlı |
| Kalibrasyon yönetimi | ✅ | Takvim, sertifika, uyarı |
| Kontrol planları | ✅ | Proses bazlı |
| Risk ve FMEA | ✅ | 5×5 matris, RPN |
| İç denetim | ✅ | Planlama, bulgu, sınıflandırma |
| SPC | ✅ | 7 kart tipi, Cp/Cpk |
| PPAP | ✅ | 5 seviye, 18 element |
| Tedarikçi değerlendirme | ✅ | Puanlama, risk, dashboard |
| **MRB / karantina akışı** | ❌ | Uygunsuz malzeme karantina yönetimi yok |
| **Customer concession/deviation** | ❌ | Müşteri sapma onayı yok |
| **Contract review / flow-down** | ❌ | Müşteri gereksinimlerinin üretime akması yok |

**Kritik Boşluklar:**
1. MRB/karantina yok → Uygunsuz malzeme izolasyonu sistematik değil
2. Contract review yok → AS9100'ün en kritik eksiklerinden biri

---

### 2.9 DESTEK SÜREÇLERİ

| Süreç | Durum | Detay |
|-------|-------|-------|
| Bakım (CMMS) | ✅ | Plan, iş emri, arıza |
| OEE | ✅ | Dashboard |
| İK ve vardiya | ✅ | Çalışan, vardiya, devam |
| Eğitim/yetkinlik | ✅ | Eğitim, matris |
| Doküman yönetimi | ✅ | Yükleme, versiyon |
| Proje yönetimi | ✅ | Milestone, görev |
| Bildirimler | ⚠️ | Altyapı var, aktif tetikleyiciler sınırlı |
| Raporlama | ⚠️ | API var, UI'da Dashboard dışında raporlar zayıf |
| Import/Export | ⚠️ | Altyapı var, UI butonları eksik |

---

## BÖLÜM 3: KONSOLİDE İHTİYAÇ LİSTESİ

Tüm süreç analizlerinden çıkan ihtiyaçlar, **etki** ve **efor** bazında önceliklendirilmiştir.

### Öncelik Tanımları
- **P0 — Blocker:** Bu olmadan sistem gerçek operasyonda kullanılamaz
- **P1 — Kritik:** İlk 3 ayda olmazsa ciddi kullanıcı kaybı
- **P2 — Önemli:** Kullanıcı deneyimini belirgin iyileştirir
- **P3 — Değerli:** Rekabet avantajı, denetim güvencesi
- **P4 — İyileştirme:** Nice-to-have, uzun vadeli

| # | İhtiyaç | Öncelik | Etki Alanı | Efor |
|---|---------|---------|------------|------|
| N01 | PO (Satınalma Siparişi) UI sayfaları | P0 | Satınalma | Orta |
| N02 | Fatura PDF indirme butonu | P0 | Finans | Düşük |
| N03 | Teklif PDF indirme butonu | P0 | Satış | Düşük |
| N04 | İade faturası + tevkifat UI | P0 | Finans | Düşük |
| N05 | Stok transfer UI sayfaları | P1 | Stok | Orta |
| N06 | Kalite kapısı UI (üretim adımında) | P1 | Üretim/Kalite | Düşük |
| N07 | Stok rezervasyon gösterimi (UI) | P1 | Stok | Düşük |
| N08 | İrsaliye PDF oluşturma (API + UI) | P1 | Sevkiyat | Orta |
| N09 | Stok listesinde renk kodlama | P2 | Stok | Düşük |
| N10 | Dashboard genişletme (PO, stok uyarı, üretim özet) | P2 | Genel | Orta |
| N11 | Excel export butonları (raporlarda) | P2 | Raporlama | Düşük |
| N12 | Cari ekstre yazdır/PDF | P2 | Finans | Düşük |
| N13 | PO ↔ Mal Alım ↔ Fatura 3'lü eşleşme | P2 | Satınalma/Finans | Yüksek |
| N14 | Contract review / müşteri gereksinim akışı | P3 | Kalite/AS9100 | Yüksek |
| N15 | Serial number / as-built genealogy | P3 | Stok/Kalite | Yüksek |
| N16 | Final inspection release + CoC | P3 | Kalite/Sevkiyat | Yüksek |
| N17 | MRB / karantina / disposition akışı | P3 | Kalite | Orta |
| N18 | Kontrollü doküman onay workflow | P3 | Doküman | Orta |
| N19 | Fason/taşeron iş emri | P3 | Üretim | Orta |
| N20 | Çoklu adres ve iletişim kişisi | P4 | Müşteri | Düşük |
| N21 | Depo lokasyon hiyerarşisi (raf/bin) | P4 | Stok | Orta |
| N22 | Seri bildirim sistemi (SignalR) | P4 | Altyapı | Yüksek |
| N23 | e-Fatura GİB entegrasyonu | P4 | Finans/Entegrasyon | Yüksek |
| N24 | Atölye terminali (tablet UI) | P4 | Üretim | Yüksek |
| N25 | Sonlu kapasite çizelgeleme | P4 | Üretim | Çok Yüksek |
| N26 | Sipariş onay iş akışı | P2 | Satış | Orta |
| N27 | Teklif email gönderimi | P2 | Satış | Orta |
| N28 | Sevk öncesi kalite onay süreci | P3 | Kalite/Sevkiyat | Orta |
| N29 | Geciken sipariş uyarıları (dashboard) | P2 | Satış | Düşük |
| N30 | PO PDF belgesi (tedarikçiye gönderim) | P1 | Satınalma | Orta |

---

## BÖLÜM 4: FAZLANDIRMA

Her faz, kendi içinde **bağımsız olarak test edilebilir ve commit'lenebilir task'lara** bölünmüştür.

### Commit ve Test Kuralları (Tüm Fazlar İçin)

```
Her task için:
1. Branch: faz{N}/task-{ID}-kısa-açıklama
2. API değişikliği varsa: xUnit test yazılır (minimum 3 test/endpoint)
3. UI değişikliği varsa: Vitest test yazılır (render + interaction)
4. Commit mesajı: "feat(modül): kısa açıklama" veya "fix(modül): kısa açıklama"
5. Task tamamlandığında: tüm testler geçer (API 709+ / UI 413+)
6. PR açılmadan önce: lint + build + test clean
```

---

### FAZ 1: OPERASYONELLEŞTİRME (Blocker'ları Kaldır)

**Hedef:** PRD Bölüm 6'daki "operasyonu bloke eden" eksikleri kapat. Kullanıcı ana zinciri baştan sona UI üzerinden tamamlayabilsin.
**Süre tahmini:** 2-3 hafta
**Başarı kriteri:** Teklif→Sipariş→Üretim→Sevk→Fatura→Tahsilat zinciri PDF çıktılarıyla birlikte uçtan uca çalışır.

| Task ID | İş | Tip | Efor | Test Gereksinimi | Bağımlılık |
|---------|-----|-----|------|-----------------|-----------|
| F1-01 | **Teklif PDF butonu** — OfferForm/OfferDetail'e "PDF İndir" butonu ekle, `/api/Pdf/offer/{id}` endpoint'ini çağır | UI | 2s | 1 test: buton render + click mock | — |
| F1-02 | **Fatura PDF butonu** — InvoiceDetail'e "PDF İndir" butonu ekle, `/api/Pdf/invoice/{id}` endpoint'ini çağır | UI | 2s | 1 test: buton render + click mock | — |
| F1-03 | **İade faturası UI** — InvoiceForm'a fatura tipi seçimi (Satış/İade), iade seçilince orijinal fatura referansı + tevkifat oranı alanları | UI | 4s | 2 test: tip toggle, tevkifat alanları görünürlük | — |
| F1-04 | **PO Liste sayfası** — PurchaseOrderList.js oluştur (tablo, filtreleme, durum badge) | UI | 6s | 2 test: liste render, filtre | — |
| F1-05 | **PO Form sayfası** — PurchaseOrderForm.js oluştur (tedarikçi seç, kalem ekle, kaydet) | UI | 8s | 3 test: form render, kalem ekleme, submit | F1-04 |
| F1-06 | **PO Detay sayfası** — PurchaseOrderDetail.js oluştur (PO bilgileri, kalemler, durum akışı) | UI | 6s | 2 test: detay render, durum değişikliği | F1-04 |
| F1-07 | **PO route tanımları** — Router'a PO sayfalarının route'larını ekle, menüye satınalma altında ekle | UI | 1s | — | F1-04 |
| F1-08 | **Stok rezervasyon kolonları** — Stock listesine "Rezerve" ve "Kullanılabilir" kolonları ekle | UI | 2s | 1 test: kolon render | — |
| F1-09 | **Kalite kapısı UI** — Üretim iş emri adım listesinde quality gate toggle + kalite onay butonu | UI | 4s | 2 test: toggle render, onay butonu interaction | — |

**Commit planı:**
```
commit 1: feat(offer): add PDF download button to offer detail
commit 2: feat(invoice): add PDF download button to invoice detail
commit 3: feat(invoice): add credit note type and withholding tax UI
commit 4: feat(purchase-order): add PO list page with filtering
commit 5: feat(purchase-order): add PO creation form
commit 6: feat(purchase-order): add PO detail page with status flow
commit 7: feat(purchase-order): add routes and navigation menu items
commit 8: feat(stock): show reserved and available quantity columns
commit 9: feat(production): add quality gate toggle and approval UI
```

---

### FAZ 2: KULLANICI DENEYİMİ ve BELGE ÜRETİMİ

**Hedef:** "Excel'e dönüş yok" ve "Belge üretilebilir" PRD başarı kriterlerini karşıla. Kullanıcı hiçbir noktada sistemi terk edip Excel'e geçmek zorunda kalmasın.
**Süre tahmini:** 2-3 hafta
**Ön koşul:** Faz 1 tamamlanmış olmalı
**Başarı kriteri:** Teklif, fatura, irsaliye PDF çıktı alınabilir. Stok renk kodlu. Dashboard bilgilendirici.

| Task ID | İş | Tip | Efor | Test Gereksinimi | Bağımlılık |
|---------|-----|-----|------|-----------------|-----------|
| F2-01 | **İrsaliye PDF API** — PdfService'e `GenerateShippingPdf` metodu ekle | API | 6s | 3 test: PDF üretimi, içerik doğrulama, hata durumu | — |
| F2-02 | **İrsaliye PDF UI** — Sevkiyat sayfasına "İrsaliye PDF İndir" butonu | UI | 2s | 1 test: buton render + click | F2-01 |
| F2-03 | **Stok Transfer Liste** — StockTransferList.js oluştur | UI | 6s | 2 test: liste render, filtre | — |
| F2-04 | **Stok Transfer Form** — StockTransferForm.js oluştur (kaynak/hedef depo, kalemler) | UI | 6s | 3 test: form render, depo seçimi, submit | F2-03 |
| F2-05 | **Stok Transfer route** — Router + menü entegrasyonu | UI | 1s | — | F2-03 |
| F2-06 | **Stok renk kodlama** — Stok listesinde min altı kırmızı, sipariş noktası turuncu, max üstü mavi | UI | 3s | 2 test: renk class doğrulama | — |
| F2-07 | **Dashboard genişletme** — PO durum kartı, stok uyarı sayıları, üretim özet widget | UI | 6s | 3 test: her widget render | — |
| F2-08 | **Excel export butonları** — Rapor sayfalarına "Excel İndir" butonları | UI | 3s | 1 test: buton render | — |
| F2-09 | **Cari ekstre yazdır** — CustomerStatement sayfasına yazdır/PDF butonu | UI | 3s | 1 test: buton render | — |
| F2-10 | **Geciken sipariş widget** — Dashboard'a geciken siparişler uyarı kartı | UI | 3s | 1 test: widget render | — |
| F2-11 | **PO PDF belgesi** — PdfService'e `GeneratePurchaseOrderPdf` ekle + PO detay sayfasına buton | API+UI | 6s | 3 test: PDF üretimi, buton render | Faz 1 |

**Commit planı:**
```
commit 1: feat(pdf): add shipping document PDF generation
commit 2: feat(shipping): add shipping PDF download button
commit 3: feat(stock-transfer): add transfer list page
commit 4: feat(stock-transfer): add transfer form with source/target warehouse
commit 5: feat(stock-transfer): add routes and navigation
commit 6: feat(stock): add color coding for min/max/reorder levels
commit 7: feat(dashboard): add PO status, stock alerts, production summary widgets
commit 8: feat(reports): add Excel export buttons to report pages
commit 9: feat(finance): add print/PDF button to customer statement
commit 10: feat(dashboard): add overdue orders warning widget
commit 11: feat(pdf): add purchase order PDF generation and download
```

---

### FAZ 3: SATIŞ ve SATIN ALMA SÜRECİ DERİNLEŞTİRME

**Hedef:** Satınalma-satış döngüsünü kapatmak. PO↔Fatura eşleşmesi, sipariş onay akışı, teklif email.
**Süre tahmini:** 3-4 hafta
**Ön koşul:** Faz 1 + Faz 2
**Başarı kriteri:** PO→Mal alım→Fatura 3'lü eşleşme çalışır. Sipariş onaylı akışa sahiptir.

| Task ID | İş | Tip | Efor | Test Gereksinimi | Bağımlılık |
|---------|-----|-----|------|-----------------|-----------|
| F3-01 | **Mal alım (Goods Receipt) API** — PO'ya bağlı mal alım endpointleri (oluştur, listele, onayla) | API | 8s | 5 test: CRUD + stok güncelleme | — |
| F3-02 | **Mal alım UI** — GoodsReceiptList + GoodsReceiptForm sayfaları | UI | 8s | 3 test: liste, form, submit | F3-01 |
| F3-03 | **3'lü eşleşme** — PO detayda mal alım ve fatura eşleşme gösterimi | API+UI | 6s | 3 test: eşleşme doğrulama, UI gösterimi | F3-01 |
| F3-04 | **Sipariş onay iş akışı API** — Sales'e approval endpoint (request→approve→reject) | API | 6s | 4 test: onay akışı durumları | — |
| F3-05 | **Sipariş onay UI** — SaleDetail'de onay butonları + onay geçmişi | UI | 4s | 2 test: buton render, onay interaction | F3-04 |
| F3-06 | **Teklif email gönderimi** — SmtpEmailService entegrasyonu + OfferDetail'de "Email Gönder" butonu | API+UI | 6s | 3 test: email gönderim mock, buton | — |
| F3-07 | **Teklif onay süreci** — Belirli tutar üstü tekliflerde yönetici onayı | API+UI | 6s | 3 test: eşik kontrolü, onay akışı | — |

**Commit planı:**
```
commit 1: feat(purchase): add goods receipt API endpoints
commit 2: feat(purchase): add goods receipt list and form pages
commit 3: feat(purchase): add PO-receipt-invoice three-way matching
commit 4: feat(sales): add order approval workflow API
commit 5: feat(sales): add approval buttons and history to order detail
commit 6: feat(offer): add email sending integration
commit 7: feat(offer): add manager approval for high-value offers
```

---

### FAZ 4: AS9100 DENETİM HAZIRLIĞI

**Hedef:** Denetim günü güvencesi. Contract review, final release, CoC, MRB/karantina, doküman onay gibi AS9100'ün en kritik eksiklerini kapat.
**Süre tahmini:** 4-6 hafta
**Ön koşul:** Faz 1-3
**Başarı kriteri:** AS9100 denetçisinin sorduğu temel sorulara sistem üzerinden cevap verilebilir.

| Task ID | İş | Tip | Efor | Test Gereksinimi | Bağımlılık |
|---------|-----|-----|------|-----------------|-----------|
| F4-01 | **Contract Review modeli** — Entity: ContractReview (müşteri gereksinimleri, özel şartlar, flow-down checklist) | API | 8s | 5 test: CRUD + checklist doğrulama | — |
| F4-02 | **Contract Review UI** — Sipariş detayında "Sözleşme İnceleme" sekmesi | UI | 6s | 3 test: form, checklist, kayıt | F4-01 |
| F4-03 | **Final Inspection Release API** — Sevkiyat öncesi final muayene onay endpointleri | API | 6s | 4 test: release akışı, yetki kontrolü | — |
| F4-04 | **Final Inspection Release UI** — Sevkiyat sayfasında "Final Onay" butonu + kalite onay geçmişi | UI | 4s | 2 test: buton, onay gösterimi | F4-03 |
| F4-05 | **CoC (Certificate of Conformance) API** — Otomatik CoC belgesi oluşturma | API | 8s | 4 test: belge üretimi, içerik, lot bağlantısı | F4-03 |
| F4-06 | **CoC PDF + UI** — CoC PDF oluşturma + sevkiyat sayfasına "CoC İndir" butonu | API+UI | 6s | 3 test: PDF, buton | F4-05 |
| F4-07 | **MRB / Karantina API** — NCR'den türeyen karantina alanı, MRB kararı (use-as-is/rework/scrap/return), disposition akışı | API | 8s | 5 test: karantina, karar tipleri, stok etkisi | — |
| F4-08 | **MRB / Karantina UI** — NCR detayında karantina bölümü + MRB karar formu | UI | 6s | 3 test: karantina gösterimi, karar formu | F4-07 |
| F4-09 | **Customer Concession/Deviation API** — Müşteri sapma onayı endpoint | API | 4s | 3 test: CRUD + durum akışı | — |
| F4-10 | **Customer Concession UI** — NCR/MRB akışında müşteri sapma onayı sekmesi | UI | 4s | 2 test: form, onay durumu | F4-09 |
| F4-11 | **Doküman onay workflow API** — Doküman review→approve→release→obsolete akışı | API | 6s | 4 test: durum geçişleri, yetki | — |
| F4-12 | **Doküman onay workflow UI** — Doküman detayında onay butonları + geçmiş | UI | 4s | 2 test: butonlar, geçmiş listesi | F4-11 |
| F4-13 | **Sevk öncesi kalite onayı** — Sevkiyat akışına kalite kontrol onay adımı ekle | API+UI | 6s | 3 test: onay bloklama, onay sonrası sevk | F4-03 |

**Commit planı:**
```
commit 1: feat(quality): add contract review entity and API
commit 2: feat(quality): add contract review UI tab in order detail
commit 3: feat(quality): add final inspection release API
commit 4: feat(quality): add final inspection release UI
commit 5: feat(quality): add certificate of conformance generation API
commit 6: feat(quality): add CoC PDF and download button
commit 7: feat(quality): add MRB quarantine and disposition API
commit 8: feat(quality): add MRB quarantine UI in NCR detail
commit 9: feat(quality): add customer concession/deviation API
commit 10: feat(quality): add customer concession UI
commit 11: feat(document): add approval workflow API
commit 12: feat(document): add approval workflow UI
commit 13: feat(shipping): add pre-shipment quality approval step
```

---

### FAZ 5: İZLENEBİLİRLİK ve SERİ NUMARA

**Hedef:** AS9100 serial-level izlenebilirlik. Seri numara takibi, as-built genealogy, teslim dosyası.
**Süre tahmini:** 3-4 hafta
**Ön koşul:** Faz 4
**Başarı kriteri:** Tekil seri numaralı ürün hangi lotlardan, hangi operatör ile, hangi revizyon ile üretildiği sorgulanabilir.

| Task ID | İş | Tip | Efor | Test Gereksinimi | Bağımlılık |
|---------|-----|-----|------|-----------------|-----------|
| F5-01 | **Serial Number entity** — SerialNumber modeli (ürün, seri no, lot bağlantısı, üretim tarihi, durum) | API | 6s | 4 test: CRUD + uniqueness | — |
| F5-02 | **Serial number üretim bağlantısı** — WorkOrderLog'a serial number alanı, üretim tamamlamada seri atama | API | 6s | 4 test: atama, çoklu seri, doğrulama | F5-01 |
| F5-03 | **As-built genealogy API** — Seri numaraya bağlı tüm üretim geçmişi (lot, operatör, makine, proses, revizyon) sorgulama | API | 8s | 5 test: genealogy zinciri derinlik testleri | F5-02 |
| F5-04 | **Serial number UI** — Seri numara listesi, arama, detay sayfası | UI | 6s | 3 test: liste, arama, detay | F5-01 |
| F5-05 | **As-built genealogy UI** — Seri numaradan geriye doğru tüm üretim zincirini gösteren tree view | UI | 6s | 2 test: tree render, derinlik | F5-03 |
| F5-06 | **Teslim dosyası (data pack) API** — Sipariş bazında tüm kalite kayıtlarını (FAI, CoC, inspection, NCR, lot) bir pakette toplayan endpoint | API | 8s | 4 test: paket içeriği, dosya bağlantıları | Faz 4 |
| F5-07 | **Teslim dosyası UI** — Sevkiyat sayfasında "Teslim Dosyası İndir" butonu | UI | 4s | 1 test: buton render | F5-06 |

**Commit planı:**
```
commit 1: feat(serial): add serial number entity and CRUD API
commit 2: feat(serial): link serial numbers to work order completion
commit 3: feat(serial): add as-built genealogy query API
commit 4: feat(serial): add serial number list, search, detail pages
commit 5: feat(serial): add as-built genealogy tree view
commit 6: feat(shipping): add delivery data pack assembly API
commit 7: feat(shipping): add delivery data pack download button
```

---

### FAZ 6: ENTEGRASYON ve İLETİŞİM

**Hedef:** Dış sistemlerle bağlantı. e-Fatura altyapısı, gelişmiş bildirim sistemi, fason iş emri.
**Süre tahmini:** 4-6 hafta
**Ön koşul:** Faz 1-5

| Task ID | İş | Tip | Efor | Test Gereksinimi | Bağımlılık |
|---------|-----|-----|------|-----------------|-----------|
| F6-01 | **SignalR bildirim altyapısı** — Real-time in-app bildirimler | API+UI | 8s | 4 test: bağlantı, mesaj iletimi, UI gösterimi | — |
| F6-02 | **Bildirim tetikleyicileri** — Düşük stok, geciken sipariş, bakım hatırlatma, üretim tamamlanma | API | 6s | 4 test: her tetikleyici | F6-01 |
| F6-03 | **Bildirim tercihleri UI** — Kullanıcı bazında bildirim ayarları | UI | 4s | 2 test: tercih kayıt | F6-01 |
| F6-04 | **Fason/taşeron iş emri API** — Dış tedarikçiye iş emri gönderme, takip, teslim alma | API | 8s | 5 test: CRUD + durum akışı | — |
| F6-05 | **Fason iş emri UI** — Liste, form, detay sayfaları | UI | 8s | 3 test: form, liste, detay | F6-04 |
| F6-06 | **Çoklu adres/kişi API** — Customer'a Address[] ve ContactPerson[] ilişkisi | API | 4s | 3 test: CRUD | — |
| F6-07 | **Çoklu adres/kişi UI** — Müşteri formunda adres ve kişi sekmeleri | UI | 4s | 2 test: sekme render, CRUD | F6-06 |
| F6-08 | **e-Fatura provider entegrasyonu** — Foriba/Logo Connect stub'dan gerçek provider'a geçiş | API | 10s | 5 test: provider mock, format doğrulama | — |

**Commit planı:**
```
commit 1: feat(notification): add SignalR real-time notification infrastructure
commit 2: feat(notification): add event triggers for stock, orders, maintenance
commit 3: feat(notification): add user notification preferences UI
commit 4: feat(production): add subcontractor work order API
commit 5: feat(production): add subcontractor work order UI pages
commit 6: feat(customer): add multiple address and contact person API
commit 7: feat(customer): add address and contact tabs to customer form
commit 8: feat(integration): add e-invoice provider integration
```

---

### FAZ 7: İLERİ ÖZELLİKLER

**Hedef:** Rekabet avantajı. Depo lokasyon, sonlu kapasite, atölye terminali.
**Süre tahmini:** 6-8 hafta
**Ön koşul:** Faz 1-6

| Task ID | İş | Tip | Efor | Test Gereksinimi |
|---------|-----|-----|------|-----------------|
| F7-01 | **Depo lokasyon hiyerarşisi** — Warehouse → Zone → Aisle → Rack → Bin modeli | API+UI | 8s | 5 test |
| F7-02 | **Lokasyon bazlı stok takibi** — StockWarehouse'a location bağlantısı | API+UI | 6s | 4 test |
| F7-03 | **Atölye terminali (tablet UI)** — Operatör için touch-friendly basitleştirilmiş ekran | UI | 12s | 5 test |
| F7-04 | **Sonlu kapasite çizelgeleme** — Algoritmik planlama + Gantt entegrasyonu | API+UI | 15s | 8 test |
| F7-05 | **Banka mutabakat API** — Banka hesap hareketleri ile fatura/ödeme otomatik eşleşme | API+UI | 8s | 5 test |
| F7-06 | **Gelişmiş raporlama** — Özel rapor oluşturma (dinamik filtre/kolon seçimi) | API+UI | 10s | 5 test |
| F7-07 | **Otomatik rapor gönderimi** — Zamanlanmış rapor email'i (Hangfire/Quartz) | API | 6s | 3 test |

---

## BÖLÜM 5: ÖZET TAKVİM

```
Faz 1: Operasyonelleştirme .............. Hafta 1-3    (9 task, 9 commit)
Faz 2: UX ve Belge Üretimi .............. Hafta 3-6    (11 task, 11 commit)
Faz 3: Satış/Satınalma Derinleştirme .... Hafta 6-10   (7 task, 7 commit)
Faz 4: AS9100 Denetim Hazırlığı ......... Hafta 10-16  (13 task, 13 commit)
Faz 5: İzlenebilirlik ve Seri Numara .... Hafta 16-20  (7 task, 7 commit)
Faz 6: Entegrasyon ve İletişim .......... Hafta 20-26  (8 task, 8 commit)
Faz 7: İleri Özellikler ................. Hafta 26-34  (7 task, 7 commit)
```

### Toplam

| Metrik | Değer |
|--------|-------|
| Toplam faz | 7 |
| Toplam task | 62 |
| Toplam commit | 62 |
| API task | ~28 |
| UI task | ~34 |
| Tahmini test artışı | API: +120, UI: +80 |
| Tahmini toplam süre | 34 hafta (~8 ay) |

---

## BÖLÜM 6: PRD BAŞARI KRİTERLERİ HARİTASI

PRD Bölüm 8'deki 5 kriter, hangi faz tamamlanınca karşılanır:

| # | Kriter | Gerekli Faz | Açıklama |
|---|--------|-------------|----------|
| 1 | **Zincir kesintisiz** | Faz 1 | PO UI tamamlanınca tüm zincir uçtan uca çalışır |
| 2 | **Denetim günü hazır** | Faz 4 | Contract review, final release, CoC, MRB kapanınca |
| 3 | **Excel'e dönüş yok** | Faz 2 | Tüm PDF çıktılar + Excel export butonları |
| 4 | **Stok güvenilir** | Faz 1 + 2 | Rezervasyon gösterimi + renk kodlama + transfer |
| 5 | **Belge üretilebilir** | Faz 2 | Teklif, fatura, irsaliye, PO PDF'leri |

### AS9100 Karşılama Haritası

| AS9100 Maddesi | Gerekli Faz | Mevcut | Eksik |
|----------------|-------------|--------|-------|
| 8.2.1 Contract Review | Faz 4 | ❌ | Tam modül |
| 8.4 Tedarikçi Kontrol | ✅ Mevcut | ✅ | — |
| 8.5.2 İzlenebilirlik | Faz 5 | ⚠️ Lot var | Serial genealogy |
| 8.6 Ürün Serbest Bırakma | Faz 4 | ❌ | Final release + CoC |
| 10.2.1 NCR/CAPA | ✅ Mevcut | ✅ | — |
| 10.2 MRB/Disposition | Faz 4 | ❌ | Karantina + karar |
| 7.5 Doküman Kontrolü | Faz 4 | ⚠️ | Onay workflow |

---

## BÖLÜM 7: RİSK VE DİKKAT NOKTALARI

| Risk | Etki | Azaltma |
|------|------|---------|
| Faz 1 uzarsa tüm plan kayar | Yüksek | F1 task'ları strict scope, feature creep yok |
| Test sayısı artışı CI süresini uzatır | Orta | Paralel test runner, test kategorileri |
| e-Fatura provider bağımlılığı | Yüksek | Mock/sandbox ile geliştir, provider'ı son ekle |
| Sonlu kapasite algoritması karmaşıklığı | Yüksek | Faz 7'ye bırakıldı, mevcut Gantt yeterli |
| AS9100 denetim gereksinimleri değişebilir | Orta | Contract review modülünü esnek/configurable yap |

---

*Bu doküman, PRD v3.0 ve mevcut kod tabanının çapraz analizi sonucu oluşturulmuştur. Her faz bağımsız olarak değerlendirilebilir ve iş planı olarak kullanılabilir. Fazlar arası bağımlılıklar task seviyesinde belirtilmiştir.*
