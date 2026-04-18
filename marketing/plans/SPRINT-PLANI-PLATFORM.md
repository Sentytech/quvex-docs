# QUVEX PLATFORM SPRINT PLANI
## Tarih: 2026-03-15
## Durum: Multi-tenant altyapi %70 hazir, diger isler sifir

---

# MEVCUT DURUM TESPITI

## Multi-Tenant SaaS — %70 HAZIR
| Bileşen | Durum | Eksik |
|---------|-------|-------|
| Tenant modeli | ✅ Var | MaxUsers, SchemaName DB'de yok |
| TenantContext | ✅ Var | — |
| TenantResolutionMiddleware | ✅ Var | Test edilmedi |
| TenantSchemaService | ✅ Var | Test edilmedi |
| TenantController (register) | ✅ Var | Test edilmedi |
| Global query filter | ✅ Var | TenantId [NotMapped] — calismaz |
| Migration | ✅ Var ama DB uyumsuz | Tenants tablosu eksik kolonlar |
| UI Register sayfasi | ✅ Var | Test edilmedi |
| UI tenantResolver | ✅ Var | — |
| UI tenantService | ✅ Var | — |
| UI api.js X-Tenant-Id header | ✅ Var | — |
| Login'de setTenantInfo | ✅ Var | — |
| Odeme/faturalama | ❌ Yok | Stripe/iyzico |
| Admin paneli | ❌ Yok | — |

## Cloud Demo — %0
## Multi-Language — %0
## Mobil App — %0

---

# SPRINT 1: MULTI-TENANT FIX + DEMO ORTAMI (Hafta 1-2)

## Sprint 1 Amaci
Multi-tenant altyapiyi calistir, demo.quvex.io icin seed data hazirla.

### Task 1.1: Tenants tablo migration duzelt
**Dosya:** Migration veya direkt DB
**Is:** MaxUsers, ContactEmail, ContactPhone, SchemaName, CreatedAt kolonlarini ekle
**Test:** `SELECT * FROM "Tenants"` tum kolonlar gorunur
**Efor:** 1 saat

### Task 1.2: TenantId [NotMapped] sorununu coz
**Dosya:** BaseFullModel.cs, IndustryDBContext.cs
**Is:** Global query filter TenantId [NotMapped] ile calismaz.
Secenek A: Schema-per-tenant kullan (mevcut TenantSchemaService)
  → Global filter gereksiz, schema zaten izole
Secenek B: TenantId kolonunu tum tablolara ekle (cok buyuk migration)
**Karar:** Secenek A — Schema izolasyonu yeterli, global filter devre disi birak
**Test:** API localhost'ta hatasiz calisir
**Efor:** 2 saat

### Task 1.3: Tenant registration akisini test et
**Is:** POST /api/Tenant/register cagir → schema olusur mu, kullanici olusur mu
**Test:** curl ile register → login → veri izole mi
**Efor:** 3 saat (fix dahil)

### Task 1.4: Demo seed data scripti
**Dosya:** Yeni: SeedDemoService.cs
**Is:**
- 1 fabrika: "Quvex Demo Fabrika"
- 2 depo: Ana Depo, Hammadde Depo
- 5 makine: CNC-01, CNC-02, Torna-01, Freze-01, Montaj-01
- 50 urun (10 hammadde + 20 yari mamul + 20 mamul)
- 10 musteri, 5 tedarikci
- 20 teklif (8 kabul, 5 red, 7 bekleyen)
- 15 siparis (5 tamamlanan, 5 devam, 5 bekleyen)
- 10 uretim (3 tamamlanan, 4 devam, 3 geciken)
- 5 NCR (2 acik, 2 kapali, 1 incelemede)
- 3 CAPA
- 10 kalibrasyon ekipmani (2 vadesi gecmis)
- 3 bakim plani (1 geciken)
- 5 fatura (2 odenmis, 2 vadesi gecmis, 1 bekleyen)
- WorkOrderLogs (OEE verisi icin)
- ScrapRecords (fire verisi)
- AI Insights dashboard dolu gorunsun
**Test:** Seed calistir → login → dashboard dolu
**Efor:** 1 gun

### Task 1.5: Demo ortam Docker compose
**Dosya:** docker-compose.demo.yml
**Is:** demo.quvex.io icin docker-compose:
- PostgreSQL (demo_db)
- API (dotnet)
- UI (nginx)
- Cron: her 24 saatte DB reset
**Test:** docker compose up → demo.quvex.io erisim
**Efor:** 4 saat

### Task 1.6: Demo banner component
**Dosya:** UI — DemoBanner.js
**Is:** Demo ortaminda ust kisimda sari banner: "Bu bir demo ortamidir. Veriler her 24 saatte sifirlanir."
**Test:** Banner gorunur, production'da gorunmez
**Efor:** 1 saat

**Sprint 1 Toplam:** ~3-4 gun
**Sprint 1 Teslim:** Demo ortami hazir, multi-tenant calisiyor

---

# SPRINT 2: i18n ALTYAPI + TURKCE CIKARMA (Hafta 3-4)

### Task 2.1: react-i18next kurulumu
**Is:**
- `npm install react-i18next i18next i18next-browser-languagedetector`
- src/i18n.js konfigurasyonu
- App.js'e I18nextProvider sarma
- Test: `t('common.save')` calisiyor
**Efor:** 2 saat

### Task 2.2: common.json — ortak stringler (200)
**Is:** Kaydet, Iptal, Sil, Ara, Yuklenior, Veri Yok, Filtrele, Export...
**Test:** Tum butonlar t() ile calisiyor
**Efor:** 4 saat

### Task 2.3: navigation.json — menu (80 string)
**Is:** 12 ana menu + 80 alt menu item
**Test:** Menu Turkce ve Ingilizce gorunuyor
**Efor:** 3 saat

### Task 2.4: Dil secici component
**Dosya:** LanguageSwitcher.js (navbar'a ekle)
**Is:** TR/EN bayrak toggle, localStorage'a kaydet
**Test:** Dil degistir → sayfa yenilenmeden tum label degisir
**Efor:** 2 saat

### Task 2.5: Dashboard + Home i18n (100 string)
**Dosya:** Home.js, AI dashboard
**Test:** Dashboard TR/EN arasi gecis sorunsuz
**Efor:** 4 saat

### Task 2.6: Uretim modulu i18n (500 string)
**Dosya:** Production.js, ProductionDetail.js, ProductionItem.js vb. (12 dosya)
**Test:** Uretim ekranlari TR/EN calisiyor
**Efor:** 1.5 gun

### Task 2.7: Stok modulu i18n (400 string)
**Dosya:** 10 dosya
**Efor:** 1 gun

### Task 2.8: Kalite modulu i18n (600 string)
**Dosya:** 15 dosya
**Efor:** 1.5 gun

### Task 2.9: Diger moduller i18n (1.150 string)
**Dosya:** Muhasebe, satis, satinalma, bakim, IK, raporlar, ayarlar
**Efor:** 2.5 gun

**Sprint 2 Toplam:** ~8-9 gun
**Sprint 2 Teslim:** Tum UI i18n altyapisi hazir, Turkce calisiyor

---

# SPRINT 3: INGILIZCE CEVIRI + API MESAJLARI (Hafta 5-6)

### Task 3.1: common.json EN ceviri
**Efor:** 2 saat

### Task 3.2: navigation.json EN ceviri
**Efor:** 1 saat

### Task 3.3: Tum modul JSON dosyalari EN ceviri
**Is:** ~2.830 string TR → EN
**Yontem:** AI destekli ceviri + manuel kontrol
**Efor:** 3 gun

### Task 3.4: API hata mesajlari i18n
**Dosya:** Yeni: resources/messages.tr.json, messages.en.json
**Is:** ~100 API hata mesaji + Accept-Language middleware
**Efor:** 1 gun

### Task 3.5: Tarih/sayi/para format lokalizasyon
**Is:** TR: 1.234,56 TL / EN: $1,234.56
**Dosya:** formatters.js utility
**Efor:** 4 saat

### Task 3.6: Layout tasma testi
**Is:** Ingilizce modda tum 105 ekrani gez, tasma kontrolu
**Efor:** 1 gun

### Task 3.7: i18n testleri
**Is:** Vitest'e i18n mock ekle, mevcut testler gecsin
**Efor:** 4 saat

**Sprint 3 Toplam:** ~7 gun
**Sprint 3 Teslim:** Turkce + Ingilizce tam calisiyor

---

# SPRINT 4: MOBIL APP MVP (Hafta 7-10)

### Task 4.1: React Native Expo proje kurulumu
**Is:**
```bash
npx create-expo-app QuvexMobile --template blank-typescript
cd QuvexMobile
npx expo install expo-barcode-scanner expo-camera expo-notifications
npm install @react-navigation/native @react-navigation/bottom-tabs
npm install axios react-native-chart-kit
```
**Efor:** 4 saat

### Task 4.2: Login ekrani
**Is:** E-posta + sifre, API authenticate, token sakla
**Test:** Login basarili, token AsyncStorage'da
**Efor:** 4 saat

### Task 4.3: Bottom tab navigation
**Is:** 5 tab: Dashboard, Barkod, Islerim, Bildirim, Profil
**Efor:** 3 saat

### Task 4.4: Dashboard ekrani
**Is:** 6 KPI karti (AI Insights dashboard'dan veri)
**API:** GET /api/AIInsights/dashboard
**Test:** KPI verisi gorunuyor
**Efor:** 1 gun

### Task 4.5: Barkod tarama ekrani
**Is:** Kamera ac → barkod/QR tara → sonuc goster
**API:** GET /api/ShopFloor/scan/{code}
**Test:** Urun barkodunu tara → bilgi gorunur
**Efor:** 1 gun

### Task 4.6: Aktif islerim ekrani
**Is:** Operatorun devam eden is listesi + tamamla butonu
**API:** GET /api/ShopFloor/my-tasks
**Test:** Is listesi gorunuyor
**Efor:** 1 gun

### Task 4.7: Is baslat ekrani
**Is:** Barkod tara → makine sec → baslat
**API:** POST /api/ShopFloor/start-work
**Test:** Is baslatildi bildirimi
**Efor:** 1 gun

### Task 4.8: Is tamamla modal
**Is:** Miktar gir + fire gir + tamamla
**API:** PUT /api/ShopFloor/complete-work/{id}
**Test:** Is tamamlandi, liste guncellendi
**Efor:** 4 saat

### Task 4.9: Push notification altyapisi
**Is:** Expo notifications + SignalR baglantisi
**Test:** Bildirim geldiginde telefona push
**Efor:** 1 gun

### Task 4.10: Offline kuyruk
**Is:** Baglanti yokken islemleri AsyncStorage'a kaydet, gelince sync
**Test:** Ucak modunda is tamamla → wifi ac → sync
**Efor:** 1 gun

**Sprint 4 Toplam:** ~8-9 gun
**Sprint 4 Teslim:** Mobil MVP (atolye terminali) test edilebilir

---

# SPRINT 5: MOBIL YONETICI + KALITE (Hafta 11-14)

### Task 5.1: AI Insights tam ekran
**Is:** Gecikme riski, tedarikci skor, stok tukenme tablolari
**Efor:** 1 gun

### Task 5.2: Uretim listesi + detay
**Is:** Aktif uretimler, filtre, ilerleme bar, is emri adimlari
**Efor:** 1.5 gun

### Task 5.3: Stok durumu ekrani
**Is:** Urun ara, mevcut stok, min/max gosterge
**Efor:** 1 gun

### Task 5.4: Teklif/siparis listesi
**Is:** Son teklifler, bekleyen siparisler ozet
**Efor:** 1 gun

### Task 5.5: Onay ekrani
**Is:** Bekleyen onaylar (kalite, dokuman)
**Efor:** 1 gun

### Task 5.6: NCR olustur (fotograf)
**Is:** Kamera ile foto cek + aciklama + kaydet
**Efor:** 1 gun

### Task 5.7: Muayene sonuc girisi
**Is:** Olcum degerlerini mobilde gir
**Efor:** 1 gun

### Task 5.8: Dark mode + UI polish
**Is:** Karanlik tema, animasyonlar, splash screen
**Efor:** 1 gun

### Task 5.9: App Store / Google Play hazirligi
**Is:** Icon, screenshot, description, privacy policy
**Efor:** 1 gun

### Task 5.10: Beta test + bug fix
**Efor:** 2 gun

**Sprint 5 Toplam:** ~11 gun
**Sprint 5 Teslim:** Mobil app beta (atolye + yonetici + kalite)

---

# SPRINT 6: SaaS TAMAMLAMA + ODEME (Hafta 15-18)

### Task 6.1: Admin paneli — tenant listesi
**Is:** admin.quvex.io → tum tenant'lar, kullanici sayisi, plan, durum
**Efor:** 2 gun

### Task 6.2: Admin paneli — tenant detay
**Is:** Tenant duzenle, plan degistir, kullanici limiti
**Efor:** 1 gun

### Task 6.3: Admin paneli — kullanim metrikleri
**Is:** API cagri sayisi, storage, son giris tarihi
**Efor:** 1 gun

### Task 6.4: Odeme gateway — iyzico entegrasyonu
**Is:** Kart bilgisi alma, abonelik olusturma, otomatik yenileme
**Efor:** 3 gun

### Task 6.5: Fatura olusturma
**Is:** Aylik otomatik fatura + PDF + e-posta
**Efor:** 2 gun

### Task 6.6: Plan yukseltme/dusurme
**Is:** Self-service plan degisikligi
**Efor:** 1 gun

### Task 6.7: Trial suresi yonetimi
**Is:** 14 gun sonra salt okunur, uyari e-postalari
**Efor:** 1 gun

### Task 6.8: Guvenlik ve penetrasyon testi
**Is:** Tenant izolasyon testi, veri sizintisi kontrolu
**Efor:** 2 gun

**Sprint 6 Toplam:** ~13 gun
**Sprint 6 Teslim:** Tam SaaS canli, odeme aliniyor

---

# ZAMAN CIZELGESI

```
Hafta:  1    2    3    4    5    6    7    8    9   10   11   12   13   14   15   16   17   18
       [Sprint 1: MT Fix+Demo ][Sprint 2: i18n TR   ][Sprint 3: EN+Test  ]
                                                      [Sprint 4: Mobil MVP               ]
                                                                           [Sprint 5: Mobil Full    ]
                                                                                                    [Sprint 6: SaaS+Odeme         ]
```

| Sprint | Hafta | Teslim |
|--------|-------|--------|
| **1** | 1-2 | Demo ortami + multi-tenant calisiyor |
| **2** | 3-4 | i18n altyapi + Turkce cikarma tamamlandi |
| **3** | 5-6 | Ingilizce calisiyor, tum ekranlar test edildi |
| **4** | 7-10 | Mobil MVP: login, dashboard, barkod, is yonetimi |
| **5** | 11-14 | Mobil full: yonetici + kalite + App Store |
| **6** | 15-18 | SaaS tam: admin panel + odeme + trial |

---

# BU HAFTA BASLANACAKLAR (Sprint 1)

| # | Task | Oncelik | Atanan |
|---|------|---------|--------|
| 1.1 | Tenants tablo kolonlarini duzelt | P0 | Backend |
| 1.2 | TenantId/schema izolasyon karari | P0 | Backend |
| 1.3 | Tenant register akisi testi | P0 | Backend |
| 1.4 | Demo seed data scripti | P0 | Backend |
| 1.5 | Docker compose demo | P1 | DevOps |
| 1.6 | Demo banner component | P2 | Frontend |
