# Quvex ERP - Pazar & Rakip Analizi
**Tarih:** 2026-03-15

---

## 1. HEDEF PAZAR

### Türkiye Küçük Üretim Fabrikaları
| Veri | Rakam |
|------|-------|
| Türkiye'de üretim firması | ~435.000 |
| KOBİ oranı (üretimde) | %85 (~370.000) |
| Organize sanayi bölgesi | 120 (4.500+ firma) |
| Hedef segment | 10-200 çalışanlı üretici |
| **Erişilebilir KOBİ (Sprint 10 öncesi)** | **51.000** (CNC + Otomotiv + kısmi sektörler) |
| **Erişilebilir KOBİ (Sprint 11 sonrası)** | **133.000** (+82K, 10 sektör) |
| **Pazar genişleme oranı** | **+%160** |

### Sprint 11 Sonrası Sektör Hazırlık Skorları (2026-04-12)

| Sektör | KOBİ | Önce | Sonra | İyileşme | Blocker Kapanışı |
|--------|------|------|-------|----------|------------------|
| Otomotiv | 15K | 6.8 | **8.5** | +1.7 | - |
| CNC | 5K | 6.4 | **8.0** | +1.6 | - |
| Metal/Çelik | 45K | 5.8 | **7.5** | +1.7 | - |
| Kaynak | 5K | 5.7 | **8.0** | +2.3 | WPS/WPQR |
| Plastik | 12K | 5.6 | **8.0** | +2.4 | MoldInventory |
| Mobilya | 35K | 5.4 | **7.0** | +1.6 | - |
| Medikal | 3K | 5.3 | **7.0** | +1.7 | - |
| Gıda | 25K | 5.0 | **8.5** | +3.5 | HACCP + Recall |
| Makine | 10K | 5.0 | **7.5** | +2.5 | CE Technical File |
| Tekstil | 30K | 4.6 | **8.0** | +3.4 | ProductVariant |

**Ortalama skor:** 5.4 → **7.8** (+2.4, +%44)

### Hedef Profil
- 10-50 çalışanlı metal/makine/plastik üretim atölyeleri
- OSTİM, İvedik, Ankara/İstanbul/Bursa/Kocaeli sanayi bölgeleri
- Excel veya eski masaüstü yazılımdan geçiş yapacak firmalar
- Havacılık/savunma tedarik zincirine girmek isteyen KOBİ'ler

---

## 2. TÜRKİYE PAZARI RAKİP ANALİZİ

| Yazılım | Hedef | Fiyat (aylık tahmini) | Güçlü Yanı | Zayıf Yanı |
|---------|-------|----------------------|-------------|-------------|
| **Logo Tiger/Go** | KOBİ-Büyük | ₺3.000-15.000+ | Muhasebe/e-fatura güçlü, yaygın bayi ağı | Üretim modülü zayıf, UI eski, özelleştirme pahalı |
| **Mikro (Run/Jump/Fly)** | Küçük-Orta | ₺1.500-5.000 | Uygun fiyat, kolay kurulum | Üretim/kalite modülü yok, masaüstü odaklı |
| **Netsis** | Orta-Büyük | ₺5.000-20.000+ | Kapsamlı, Logo altyapısı | Pahalı, karmaşık, uzun kurulum |
| **Canias ERP** | Büyük | ₺15.000-50.000+ | Endüstriyel güç, SAP alternatifi | Çok pahalı, karmaşık, küçük firma için overkill |
| **DIA** | KOBİ | ₺2.000-8.000 | Üretim modülü var | Sınırlı kalite, eski UI |

### Kritik Pazar Boşluğu
Türkiye'de küçük üreticiler için **uygun fiyatlı, modern UI'lı, üretim+kalite odaklı** bir çözüm YOK:
- Logo/Netsis → muhasebe güçlü ama üretim modülleri zayıf
- Mikro → ucuz ama üretim/kalite yok
- Canias → üretim güçlü ama küçük firma için çok pahalı
- Hiçbirinin AS9100 kalite modülü yok
- Hiçbirinin modern web UI + mobil app'i yok

---

## 3. AS9100 NİŞ PAZARI (GLOBAL)

| Yazılım | Hedef | Fiyat/ay | Özellik |
|---------|-------|---------|---------|
| **QT9 QMS** | Küçük-Orta üretici | ~$500-2.000 (eşzamanlı lisans) | 25+ modül, AS9100, kolay kullanım |
| **ETQ Reliance** | Büyük kurumsal | $2.000-10.000+ | 40+ modül, drag-drop, enterprise |
| **MasterControl** | Medikal/Büyük | $3.000-15.000+ | Medikal odaklı, en pahalı |

### Quvex vs AS9100 QMS Rakipleri

| Özellik | QT9/ETQ/MC | Quvex |
|---------|-----------|-------|
| Kalite (NCR, CAPA, SPC) | ✅ | ✅ |
| AS9100 (FAI, PPAP, CoC, MRB) | ✅ | ✅ |
| Üretim yönetimi | ❌ | ✅ |
| Stok/Depo | ❌ | ✅ |
| Satış/Fatura | ❌ | ✅ |
| MRP/Planlama | ❌ | ✅ |
| Mobil uygulama | ❌ (çoğunda) | ✅ |
| Türkçe + e-Fatura | ❌ | ✅ |

**Kritik fark:** Rakipler SADECE QMS (kalite yönetim sistemi). Quvex = ERP + QMS birleşik.

---

## 4. GLOBAL KOBİ ÜRETİM ERP KARŞILAŞTIRMASI

| Yazılım | Fiyat/ay | Üretim | Kalite | AS9100 | Türkçe | Mobil |
|---------|---------|--------|--------|--------|--------|-------|
| **MRPeasy** | $49/kullanıcı | ✅ | Basit | ❌ | ❌ | ❌ |
| **Katana** | $359+ sabit | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Odoo** | $25/kullanıcı | ✅ | Modül | ❌ | ✅ | Kısıtlı |
| **Quvex** | TBD | ✅ | ✅✅ | ✅ | ✅ | ✅ |

---

## 5. FİYATLANDIRMA STRATEJİSİ

Global SaaS ERP trendi: kullanıcı başı aylık veya hibrit model ($40-150/kullanıcı/ay).

| Plan | Hedef | Fiyat Önerisi | İçerik |
|------|-------|--------------|--------|
| **Starter** | Mikro üretici (1-10 kişi) | ₺1.499/ay (5 kullanıcı dahil) | Üretim + Stok + Satış + Fatura |
| **Professional** | Küçük fabrika (10-50) | ₺3.999/ay (15 kullanıcı dahil) | Starter + Kalite + MRP + Bakım + Mobil |
| **Enterprise** | Orta fabrika (50-200) | ₺7.999/ay (30 kullanıcı dahil) | Professional + AS9100 + AI Insights + API |
| **Ek kullanıcı** | - | ₺199/kullanıcı/ay | - |

---

## 6. QUVEX ÜRÜN KAPASİTESİ

### Platform
| Kanal | Teknoloji | Durum |
|-------|-----------|-------|
| Web UI | React 18, Vite, Ant Design | Production-ready (132+ route, 60+ ekran) |
| API | .NET 8, EF Core, PostgreSQL | Production-ready (119 controller, 900+ endpoint) |
| Mobil | Expo 55 / React Native | %70 hazır (11 ekran) |

### 12 Ana Modül
1. **Satış** — Teklif → Sipariş → Fatura → Tahsilat zinciri
2. **Üretim** — İş emirleri, Gantt planlama, seri takip, fason iş
3. **Stok** — Çoklu depo, lot takip, barkod, ABC analizi, min/max
4. **Satınalma** — Talep → teklif → sipariş, tedarikçi değerlendirme
5. **Kalite (AS9100)** — NCR, CAPA, FAI, PPAP, SPC, FMEA, CoC, MRB (20+ alt modül)
6. **Muhasebe** — Fatura, ödeme, banka mutabakat, maliyet muhasebesi
7. **Bakım** — Önleyici/düzeltici bakım, OEE, kalibrasyon
8. **İK** — Vardiya, yoklama, eğitim, yetkinlik matrisi
9. **MRP/APS** — Net ihtiyaç, EOQ, kapasite planlama
10. **Proje Yönetimi** — Proje, milestone, görev takibi
11. **Raporlama** — Dinamik rapor, KPI, AI insights
12. **Entegrasyonlar** — e-Fatura (GİB), SignalR bildirim, PDF/Excel

### İstatistikler
| Metrik | Değer |
|--------|-------|
| Controller | 119 |
| API Endpoint | 900+ |
| Model/Tablo | 100+ |
| Servis | 69 |
| UI Ekran | 60+ |
| Route | 132+ |
| API Test | 933 |
| UI Test | 413+ |
| Mobil Ekran | 11 |
| Güvenlik Testi | 57 |
| npm güvenlik açığı | 0 |

---

## 7. BENZERSİZ DEĞER TEKLİFİ (USP)

> **"Küçük fabrikalar için AS9100-hazır, kullanıcı dostu üretim ERP'si — tek platformda üretim, kalite ve finans."**

### Neden Kazanır?
1. **Türkiye'de rakipsiz niş** — Üretim+Kalite birleşik, modern UI, uygun fiyat
2. **AS9100 premium katmanı** — Havacılık/savunma tedarikçileri için global rekabet avantajı
3. **Mobil app** — Atölye/saha çalışanları için (Türk ERP'lerde yok)
4. **e-Fatura/Türkçe** — Yerelleştirilmiş (global rakiplerde yok)
5. **AI Insights** — Küçük üretici ERP'lerde nadir

### Sprint 11 Sonrası Yeni Rekabet Avantajları (2026-04-12)

| Avantaj | Quvex | Rakipler (Logo/Mikro/Netsis/Odoo/MRPeasy) |
|---------|-------|-------------------------------------------|
| **5 dakikada onboarding** | ✅ 8 sektör hazır demo data + wizard | ❌ 2-4 hafta kurulum |
| **WhatsApp bildirim entegrasyonu** | ✅ 8 Türkçe şablon (Meta Cloud API) — Türkiye must-have | ❌ Yok veya sınırlı |
| **Real-time TV üretim panosu** | ✅ SignalR dashboard, dark theme, TV-ready | ❌ Yok |
| **Sektör hazır şablonları** | ✅ 8 sektör (CNC, Tekstil, Gıda, Plastik, Otomotiv, Metal, Mobilya, Makine) | ❌ Yok |
| **Tekstil varyant matrisi** | ✅ Beden×Renk bulk-generate | ⚠️ Sınırlı |
| **Gıda HACCP + Recall wizard** | ✅ 7 adımlı recall + forward trace BFS | ❌ Yok |
| **Plastik mold inventory** | ✅ Shot sayaç, bakım eşiği | ❌ Yok |
| **Makine CE Technical File** | ✅ 19 alan, direktif takibi | ❌ Yok |
| **Kaynak WPS/WPQR** | ✅ 19 parametre + sertifika expiry alarm | ❌ Yok |

### TAM / SAM / SOM (Sprint 11 Güncellemesi)

| Segment | Önce | Sonra |
|---------|------|-------|
| **TAM** (Türkiye üretim firması) | ~435K | ~435K |
| **SAM** (10-200 çalışanlı KOBİ) | ~51K (CNC + Otomotiv odaklı) | **~133K** (10 sektör) |
| **SOM** (İlk 3 yıl hedef, %2 pazar) | ~1.000 tenant | **~2.660 tenant** |

---

## 8. BAŞLANGIÇ STRATEJİSİ

### Faz 1: Pilot (0-3 ay)
- 3-5 fabrikada ücretsiz pilot uygulama
- OSTİM/İvedik bölgesinde metal/makine atölyeleri
- Geri bildirim toplama, ürün iyileştirme
- Referans müşteri oluşturma

### Faz 2: Lansman (3-6 ay)
- Starter plan ile düşük bariyerli giriş
- Landing page + demo ortamı
- LinkedIn + sanayi dergi reklamları
- OSB yönetimleri ile işbirliği

### Faz 3: Büyüme (6-12 ay)
- Kalite modülü upsell → Professional plana yükseltme
- AS9100 ihtiyacı olan firmalar → Enterprise plan
- Bayi/danışman ağı oluşturma
- Havacılık/savunma fuarlarına katılım

---

## KAYNAKLAR
- [Türkiye'de Kullanılan ERP Programları](https://mavvo.com.tr/blog/turkiyede-kullanilan-erp-programlari-nelerdir/)
- [ERP Kullanımı Kolay Mı?](https://mavvo.com.tr/blog/erp-kullanimi-kolay-mi-logo-dia-micro-sap-canias-ifs/)
- [Logo Netsis 2026 Fiyat Listesi](https://www.evoset.com.tr/logo-netsis-2026-fiyatlari/)
- [QT9 AS9100 Aerospace QMS](https://qt9software.com/qms/industry/aerospace)
- [Best QMS Software 2026](https://softwareconnect.com/roundups/best-quality-management-systems-software/)
- [MRPeasy Pricing](https://dev.saasworthy.com/product/mrpeasy)
- [Katana Pricing 2026](https://www.capterra.com/p/172888/Katana-MRP/)
- [ERP Pricing Guide 2026](https://www.top10erp.org/blog/erp-price)
- [SaaS Pricing Models 2026](https://sysgenpro.com/resources/erp-saas-pricing-models-guide)
- [Turkey Manufacturing Statistics](https://www.statista.com/outlook/io/manufacturing/turkey)
- [Turkey SME Statistics](https://data.tuik.gov.tr/Bulten/Index?p=49438&dil=2)
- [Small Business Manufacturing Software 2026](https://softwareconnect.com/roundups/best-small-business-manufacturing-software/)
