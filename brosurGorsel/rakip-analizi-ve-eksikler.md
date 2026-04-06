# Quvex ERP — Rakip Analizi ve Eksik Ozellik Raporu
## Tarih: 2026-03-15

---

## 1. ANA RAKIPLER

### A. Global KOBİ Uretim ERP'leri

| Rakip | Fiyat/Ay/Kul. | Guc | Zayif |
|-------|---------------|-----|-------|
| **MRPeasy** | $49-69 | Kolay UI, bulut, hizli kurulum | AS9100 yok, kalite sinirli, max 200 kisi |
| **Odoo** | $24-36 | Acik kaynak, 40+ modul, buyuk ekosistem | Karmasik kurulum, moduller daginik, destek zayif |
| **ERPNext** | Ucretsiz/Bulut | Acik kaynak, Python, esnek | Dokumantasyon zayif, UI eski, destek topluluk bazli |
| **Acumatica** | Teklif bazli | Sinrsiz kullanici, guclu muhasebe | Pahali, karmasik, yerellestirme zayif |
| **SAP B1** | $150+ | Kurumsal guc, global destek | Cok pahali, agir, uzun kurulum |

### B. Turkiye Yerli Rakipler

| Rakip | Guc | Zayif |
|-------|-----|-------|
| **Logo ERP** | Pazar lideri, muhasebe guclu, e-fatura | Uretim/kalite modulleri zayif, eski UI |
| **DIA ERP** | Bulut tabanli, muhasebe/finans guclu | Uretim takibi sinirli, kalite modulu yok |
| **Canias ERP** | Uretim odakli, ozellestirilebilir | Pahali, agir, uzun kurulum |
| **Netsis** | Yaygin, muhasebe guclu | Eski teknoloji, modern UI yok |
| **IAS ERP** | Uretim sektorune odakli | Kapali mimari, sinirli entegrasyon |

---

## 2. OZELLIK KARSILASTIRMASI

### Quvex'in GUCLU Oldugu Alanlar (rekabet avantaji)

| Ozellik | Quvex | MRPeasy | Odoo | ERPNext | Logo |
|---------|:-----:|:-------:|:----:|:-------:|:----:|
| AS9100 tam uyum (FAI,CoC,MRB) | **VAR** | YOK | YOK | YOK | YOK |
| 23 kalite alt modulu | **VAR** | 3-4 | 5-6 | 5-6 | 1-2 |
| Entegre CMMS + OEE | **VAR** | Kismi | Ayri modul | Ayri modul | YOK |
| PPAP + SPC + FMEA | **VAR** | YOK | YOK | Kismi | YOK |
| Tek lisans (ek modul yok) | **VAR** | Tier bazli | Modul bazli | Modul bazli | Modul bazli |
| Turkce tam arayuz | **VAR** | YOK | Kismi | Kismi | VAR |
| Hizli kurulum (1-4 hafta) | **VAR** | VAR | 4-8 hafta | 2-6 hafta | 4-12 hafta |

### Quvex'in ZAYIF / EKSIK Oldugu Alanlar (kritik)

| Eksik Ozellik | MRPeasy | Odoo | ERPNext | Oncelik |
|---------------|:-------:|:----:|:-------:|:-------:|
| **Mobil uygulama (native)** | VAR | VAR | VAR | **P0** |
| **AI / ML tahminleme** | Kismi | VAR | Kismi | **P0** |
| **IoT / makine entegrasyonu** | YOK | Plugin | YOK | **P1** |
| **CRM modulu** | VAR | VAR | VAR | **P1** |
| **Multi-tenant SaaS** | VAR | VAR | VAR | **P1** |
| **Multi-language** | VAR | VAR | VAR | **P2** |
| **Webhook / Zapier** | VAR | VAR | VAR | **P2** |
| **Dashboard ozellestirme** | VAR | VAR | VAR | **P2** |
| **Onboarding wizard** | VAR | VAR | VAR | **P2** |
| **Marketplace / eklenti** | YOK | VAR | VAR | **P3** |

---

## 3. DETAYLI EKSIK ANALIZI

### P0 — KRITIK EKSIKLER (Satis kaybina neden olur)

#### 3.1 Mobil Uygulama (Native iOS/Android)
**Durum:** Sadece responsive web. Native uygulama yok.
**Rakip:** MRPeasy, Odoo, ERPNext hepsinde mobil app var.
**Etki:** Atolye operatorleri, saha personeli, yoneticiler mobil kullanamaz.
**Gereken:**
- Atolye terminali (barkod tarama, is baslat/tamamla)
- Dashboard goruntulemesi
- Push notification
- Offline mod (baglanti kesildiginde is devam etsin)

#### 3.2 AI / Yapay Zeka Ozellikleri
**Durum:** Sifir AI ozelligi.
**Rakip:** 2026'da AI, ERP'nin #1 trendi. Oracle, SAP, Odoo hepsi AI ekliyor.
**Etki:** Satis sunumlarinda "AI'niz var mi?" sorusuna hayir demek zorunda kalma.
**Gereken:**
- Talep tahmini (demand forecasting) — gecmis satis verisinden
- Stok optimizasyonu onerisi — min/max otomatik ayarlama
- Uretim gecikme tahmini — mevcut is yuku + kapasite analizi
- Anomali tespiti — OEE/kalite verilerinde sapma uyarisi
- Dogal dil rapor sorgulama — "geciken siparisleri goster" seklinde

#### 3.3 Canli Demo / Trial Ortami
**Durum:** Demo icin kurulum gerekli.
**Rakip:** MRPeasy 30 gun ucretsiz, Odoo online demo, ERPNext demo.erpnext.com
**Etki:** Potansiyel musteriler hemen deneyemiyor.
**Gereken:**
- demo.quvex.io adresi ile hazir verili demo ortami
- 14-30 gun ucretsiz trial
- Self-service kayit (kredi karti olmadan)

### P1 — YUKSEK ONCELIK

#### 3.4 IoT / Makine Entegrasyonu
**Durum:** Manuel veri girisi.
**Rakip:** Odoo IoT Box, Fabrico Computer Vision, MES platformlari.
**Gereken:**
- OPC-UA / MQTT protokol destegi
- Makine sinyallerinden otomatik basla/durdur
- Enerji tuketim takibi
- Sensor verisi toplama API'si

#### 3.5 CRM Modulu
**Durum:** Musteri listesi var ama CRM yok.
**Rakip:** Odoo, MRPeasy, SAP hepsinde CRM var.
**Gereken:**
- Lead/firsat yonetimi
- Teklif → firsat donusum takibi
- Musteri iletisim gecmisi (timeline)
- Hatirlatma ve gorev atama

#### 3.6 Multi-Tenant SaaS Mimarisi
**Durum:** Tek tenant, on-premise kurulum.
**Rakip:** MRPeasy, Odoo, Acumatica hepsi multi-tenant bulut.
**Gereken:**
- Tenant izolasyonu (DB veya schema bazli)
- Self-service kayit ve odeme
- Otomatik olceklendirme
- Merkezi yonetim paneli

#### 3.7 Gelismis Dashboard Ozellestirme
**Durum:** Sabit dashboard, kullanici ozellestiremez.
**Rakip:** Odoo'da surukle-birak dashboard, ERPNext'te widget sistemi.
**Gereken:**
- Kullanici bazli widget ekleme/cikarma
- Surukle-birak layout
- Ozel KPI karti olusturma
- Departman bazli gorunum

### P2 — ORTA ONCELIK

#### 3.8 Multi-Language Destegi
**Durum:** Sadece Turkce.
**Etki:** Uluslararasi musteriler, ihracatci firmalar kullanamaz.
**Gereken:** i18n altyapisi, en az Turkce + Ingilizce

#### 3.9 Webhook ve Dis Entegrasyon
**Durum:** REST API var ama webhook/event sistemi yok.
**Gereken:**
- Olay bazli webhook (siparis olusturuldu, uretim tamamlandi vb.)
- Zapier / Make.com entegrasyonu
- API key yonetimi (3. parti erisim icin)

#### 3.10 Onboarding ve Kurulum Sihirbazi
**Durum:** Bos sistem, kullanici ne yapacagini bilmiyor.
**Gereken:**
- Ilk giris setup wizard (firma bilgileri, depo, makine tanimlama)
- Adim adim rehberli tur
- Ornek veri ile demo mod
- Video egitim entegrasyonu

#### 3.11 Gelismis Raporlama
**Durum:** 13 rapor + dinamik builder var ama sinirli.
**Gereken:**
- Rapor zamanlama (her Pazartesi otomatik e-posta)
- PDF rapor sablonu ozellestirme
- Pivot tablo / cross-tab analiz
- Karsilastirmali donem raporu (bu ay vs gecen ay)

### P3 — DUSUK ONCELIK (gelecek surum)

#### 3.12 Marketplace / Plugin Sistemi
#### 3.13 Muhasebe Entegrasyonu (Logo, Parasoft, Luca)
#### 3.14 Chatbot / Yardim Asistani
#### 3.15 Gamification (uretim performans yarismasi)

---

## 4. 2026 SEKTOR TRENDLERI vs QUVEX

| Trend | Sektor Durumu | Quvex Durumu | Gap |
|-------|--------------|--------------|-----|
| AI-Powered ERP | Hizla yayiliyor | YOK | **BUYUK** |
| Agentic AI (otonom ajanlar) | Erken donem | YOK | ORTA |
| Cloud-native SaaS | Standart | On-premise agirlikli | **BUYUK** |
| Mobil-first | Zorunlu | Responsive web | **BUYUK** |
| IoT / Real-time data | Yayginlasiyor | YOK | ORTA |
| Low-code/No-code ozellestirme | Trend | YOK | ORTA |
| API-first / Headless | Standart | 665 endpoint (iyi) | AZ |
| Cybersecurity & compliance | Zorunlu | Guclu (6 katman) | YOK |
| ESG / surdurulebilirlik raporlama | Yeni trend | YOK | DUSUK |

---

## 5. REKABET POZISYONU OZETI

### Quvex'in Benzersiz Deger Onerisi (USP)
1. **AS9100 tam uyumluluk** — Hicbir KOBİ ERP'sinde bu kadar kapsamli yok
2. **ERP + MES + QMS + CMMS tek platform** — Rakipler ayri satiyor
3. **23 kalite alt modulu** — Sektorde en kapsamli
4. **Turkce tam arayuz** — Yerli rakipler haric hicbirinde yok
5. **Tek lisans, ek modul yok** — Fiyat seffafligi

### Kapatilmasi Gereken En Kritik 3 Gap
1. **Mobil Uygulama** — Olmadan atolye kullanimini satmak cok zor
2. **AI Temel Ozellikler** — 2026'da AI olmadan ERP satisi zorlasacak
3. **Cloud SaaS + Demo** — Self-service deneme olmadan lead donusumu dusuk

---

## 6. KAYNAK ve REFERANSLAR

- [Turkiye'de ERP Programlari (Mavvo)](https://mavvo.com.tr/blog/turkiyede-kullanilan-erp-programlari-nelerdir/)
- [Turkiye ERP Listesi (Thro)](https://thro.com.tr/turkiyede-erp-programlari-listesi/)
- [Top 10 Manufacturing ERP 2026](https://www.top10erp.org/blog/manufacturing-erp)
- [Best ERP for Small Manufacturers (MIE)](https://mie-solutions.com/10-best-manufacturing-erp-systems-that-small-businesses-trust-in-2026/)
- [MRPeasy Features 2026 (GetApp)](https://www.getapp.com/operations-management-software/a/mrpeasy/)
- [Odoo Manufacturing Features](https://www.odoo.com/app/manufacturing-features)
- [ERPNext Quality Management](https://www.erpresearch.com/erp/erpnext/quality-management)
- [ERP Trends 2026: AI & IoT](https://kpcteam.com/kpposts/erp-trends-manufacturing-2026)
- [Manufacturing ERP Market 2026](https://mie-solutions.com/manufacturing-erp-production-planning-guide-in-2026/)
- [Smart Manufacturing AI Platforms](https://www.iiot-world.com/smart-manufacturing/2026-smart-manufacturing-ecosystem-industrial-ai-platforms/)
