# QUVEX PLATFORM FAZ PLANI
## P0: Mobil App + Multi-Language + Cloud Demo + SaaS
## Tarih: 2026-03-15

---

# GENEL BAKIS

| Is Paketi | Efor | Oncelik | Bagimlillik |
|-----------|------|---------|-------------|
| A. Cloud Demo / Trial | 2-3 hafta | **ILK** | Yok — hemen baslanabilir |
| B. Multi-Language (i18n) | 4-6 hafta | **IKINCI** | Yok — paralel baslanabilir |
| C. Mobil App (React Native) | 8-12 hafta | **UCUNCU** | API hazir (665 endpoint) |
| D. Multi-Tenant SaaS | 8-12 hafta | **DORDUNCU** | DB mimari degisiklik |

**Toplam:** ~22-33 hafta (5-8 ay) — A+B paralel, C+D sirali

---

# A. CLOUD DEMO / TRIAL ORTAMI

## Amac
Potansiyel musteri siteye geldiginde 30 saniyede kayit olup
hazir verili demo ortaminda Quvex'i deneyebilsin.

## Faz A1: Statik Demo (Hafta 1)

### Yapilacaklar
1. **demo.quvex.io subdomain** olustur
2. **Hazir demo verisi** hazirla (seed data):
   - 1 fabrika, 2 depo, 5 makine
   - 50 urun, 10 musteri, 5 tedarikci
   - 20 teklif (kabul/red/bekleyen), 15 siparis
   - 10 uretim (tamamlanan/devam eden/geciken)
   - 5 NCR, 3 CAPA, 2 kalibrasyon ekipmani
   - 3 bakim plani, 2 ariza kaydi
   - 5 fatura, 3 odeme
   - AI Insights dashboard verili gorunsun
3. **Salt okunur demo kullanici**: demo@quvex.io / Demo1234
4. **Her 24 saatte veri reset** (cron job)
5. **Demo banner**: Ust kisimda "Bu demo ortamidir" uyarisi

### Teknik
- Docker container: ayni API + UI image
- Ayri PostgreSQL DB (demo_db)
- Seed script: `dotnet run --seed-demo`
- Nginx: demo.quvex.io → docker container

### Cikti
- demo.quvex.io canli
- 30 saniyede deneme baslat

---

## Faz A2: Self-Service Trial (Hafta 2-3)

### Yapilacaklar
1. **Kayit sayfasi** (register.quvex.io):
   - Firma adi, ad soyad, e-posta, telefon
   - Sifre belirleme
   - Kredi karti ISTENMEZ (ucretsiz 14 gun)
2. **Otomatik tenant olusturma**:
   - Kayit oldugunda yeni DB schema olustur
   - Bos veri + ornek veri secenegi
   - Subdomain ata: firmaadi.quvex.io
3. **Trial suresi yonetimi**:
   - 14 gun ucretsiz (30 gune uzatilabilir)
   - Trial bitmeden 3/1 gun once e-posta uyari
   - Biten trial: salt okunur mod (veri silinmez)
4. **Onboarding wizard** (ilk giris):
   - Adim 1: Firma bilgileri (logo, adres, vergi no)
   - Adim 2: Ilk depo tanimlama
   - Adim 3: Ilk makine tanimlama
   - Adim 4: Ilk urun ekleme (veya Excel import)
   - Adim 5: "Hazirsiniz!" — dashboard'a yonlendir

### Teknik
- Yeni: RegistrationController, TenantService
- DB: Schema-per-tenant veya ayri DB
- E-posta: Trial uyari sablonlari
- UI: RegisterPage.js, OnboardingWizard.js

### Cikti
- Self-service kayit canli
- Ortalama kayit → ilk kullanim: 5 dakika

---

# B. MULTI-LANGUAGE (i18n)

## Amac
En az Turkce + Ingilizce. Altyapi hazir olunca yeni dil eklemek
1-2 gunluk ceviri isi olsun.

## Faz B1: Altyapi (Hafta 1-2)

### Yapilacaklar
1. **i18n kutuphanesi sec ve kur**:
   - Onerilen: `react-i18next` (React ekosisteminde standart)
   - `i18next-browser-languagedetector` (tarayici dil algılama)
   - `i18next-http-backend` (ceviri dosyalarini lazy load)
2. **Ceviri dosyasi yapisi**:
   ```
   src/locales/
     tr/
       common.json      — genel: Kaydet, Iptal, Sil, Duzenle...
       navigation.json   — menu: Uretim, Stok, Kalite...
       production.json   — uretim modulu tum label'lar
       stock.json
       quality.json
       maintenance.json
       accounting.json
       reports.json
       settings.json
       ai.json
       errors.json       — hata mesajlari
       validation.json   — form validasyon
     en/
       (ayni dosya yapisi)
   ```
3. **Dil secici component**:
   - Navbar'da bayrak ikonu
   - Secim localStorage'a kaydet
   - Sayfa yenilenmeden dil degisimi
4. **API tarafinda dil destegi**:
   - Hata mesajlari: `Accept-Language` header'a gore
   - `resources/messages.tr.json` ve `messages.en.json`

### Teknik Detay
```bash
npm install react-i18next i18next i18next-browser-languagedetector
```
```javascript
// src/i18n.js
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import tr from './locales/tr/common.json'
import en from './locales/en/common.json'

i18n.use(initReactI18next).init({
  resources: { tr: { translation: tr }, en: { translation: en } },
  lng: localStorage.getItem('quvex_lang') || 'tr',
  fallbackLng: 'tr',
  interpolation: { escapeValue: false }
})
```

---

## Faz B2: Turkce Ceviri Cikarma (Hafta 2-3)

### Yapilacaklar
1. **Tum hardcoded Turkce string'leri tara**:
   - 105 ekranda tahmini 3.000-4.000 string
   - Araclari: `grep -rn "'" src/views/` ile string listesi cikar
   - Oncelik: Navigation menu → Dashboard → Uretim → Stok → Kalite
2. **Her dosyayi donustur**:
   ```javascript
   // ONCE:
   <Button>Kaydet</Button>

   // SONRA:
   import { useTranslation } from 'react-i18next'
   const { t } = useTranslation()
   <Button>{t('common.save')}</Button>
   ```
3. **common.json olustur** (en sik kullanilan ~200 string):
   ```json
   {
     "save": "Kaydet",
     "cancel": "Iptal",
     "delete": "Sil",
     "edit": "Duzenle",
     "add": "Ekle",
     "search": "Ara",
     "loading": "Yukleniyor...",
     "noData": "Veri Yok",
     "confirm": "Emin misiniz?",
     "success": "Islem basarili",
     "error": "Hata olustu"
   }
   ```

### Efor Tahmini
| Kategori | Dosya Sayisi | String Sayisi | Sure |
|----------|-------------|---------------|------|
| common (ortak) | 1 | ~200 | 1 gun |
| navigation | 1 | ~80 | 0.5 gun |
| production (12 dosya) | 12 | ~500 | 2 gun |
| stock (10 dosya) | 10 | ~400 | 2 gun |
| quality (15 dosya) | 15 | ~600 | 3 gun |
| accounting (5 dosya) | 5 | ~300 | 1.5 gun |
| maintenance (3 dosya) | 3 | ~150 | 1 gun |
| settings (8 dosya) | 8 | ~300 | 1.5 gun |
| reports (5 dosya) | 5 | ~200 | 1 gun |
| ai (1 dosya) | 1 | ~100 | 0.5 gun |
| **TOPLAM** | **~65** | **~2.830** | **~14 gun** |

---

## Faz B3: Ingilizce Ceviri (Hafta 4-5)

### Yapilacaklar
1. **en/ klasorundeki tum JSON dosyalarini cevir**
2. **Teknik terimler sozlugu** olustur:
   - NCR = Non-Conformance Report
   - CAPA = Corrective and Preventive Action
   - Teklif = Quotation
   - Siparis = Sales Order
   - Uretim = Production / Manufacturing
   - Is Emri = Work Order
   - Stok = Inventory
   - Depo = Warehouse
   - Fatura = Invoice
   - Tedarikci = Supplier
   - Kalibrasyon = Calibration
3. **API hata mesajlari ceviri**:
   - ~100 hata mesaji
   - Accept-Language middleware

### Efor
- Turkce → Ingilizce ceviri: ~5 gun (AI destekli)
- API mesajlari: ~2 gun

---

## Faz B4: Test ve Kalite (Hafta 5-6)

### Yapilacaklar
1. Tum ekranlari Ingilizce modda gez — eksik ceviri tespit
2. Layout tasmasi kontrolu (Ingilizce daha uzun olabilir)
3. Tarih/sayi formatlama: TR: 1.234,56 vs EN: 1,234.56
4. Para birimi: TL vs $ gosterim
5. Testlere i18n mock ekle

---

# C. MOBIL UYGULAMA

## Amac
Atolye operatorleri tablet/telefondan is baslatsin, barkod taratin,
yoneticiler saha disinda dashboard goruntulesin.

## Teknoloji Secimi

| Secenek | Avantaj | Dezavantaj | Onerilen |
|---------|---------|------------|----------|
| React Native | React bilgisi var, kod paylasim | Native bridge sorunlari | ✅ **ONERILEN** |
| Flutter | Hizli, tek codebase | Dart ogrenmek gerekli | Alternatif |
| PWA | En hizli, kurulum yok | Push notification sinirli, kamera/barkod zayif | MVP icin dusunulebilir |

**Karar: React Native (Expo)** — Mevcut React bilgisi kullanilir, 665 API endpoint hazir.

## Faz C1: MVP — Atolye Terminali (Hafta 1-4)

### Ekranlar
1. **Login**: E-posta + sifre, token sessionStorage
2. **Dashboard**: 6 KPI karti (aktif uretim, geciken, NCR, bakim, stok, fatura)
3. **Barkod Tarama**: Kamera ile barkod/QR oku → urun/seri no bilgisi goster
4. **Aktif Islerim**: Operatorun devam eden is listesi
5. **Is Baslat**: Barkod tara → makine sec → baslat
6. **Is Tamamla**: Miktar gir → fire gir → tamamla
7. **Bildirimler**: Push notification listesi

### API Entegrasyonu
```
Login:        POST /api/Account/authenticate
Dashboard:    GET  /api/AIInsights/dashboard
Barkod:       GET  /api/ShopFloor/scan/{code}
Islerim:      GET  /api/ShopFloor/my-tasks
Is Baslat:    POST /api/ShopFloor/start-work
Is Tamamla:   PUT  /api/ShopFloor/complete-work/{id}
Bildirimler:  GET  /api/Notification/summary
```

### Teknik
- Framework: React Native + Expo
- State: React Context (basit) veya Zustand
- Barkod: `expo-barcode-scanner`
- Push: `expo-notifications` + SignalR fallback
- Offline: AsyncStorage ile kuyruk (baglanti gelince sync)

---

## Faz C2: Yonetici Modulu (Hafta 5-8)

### Ekranlar
8. **AI Insights**: Gecikme riski, tedarikci skor, stok tukenme
9. **Uretim Listesi**: Aktif uretimler, durum filtre, ilerleme bar
10. **Uretim Detay**: Is emri adimlari, tamamlanma yuzdesi
11. **Stok Durumu**: Urun ara, mevcut stok, min/max
12. **Teklif/Siparis**: Son teklifler, bekleyen siparisler
13. **Onay Ekrani**: Bekleyen onaylar (kalite, dokuman, NCR)
14. **Raporlar**: Gunluk/haftalik ozet grafikleri

### Teknik
- Grafikler: `react-native-chart-kit` veya `victory-native`
- Pull-to-refresh: Her listede
- Offline okuma: Son veri cache

---

## Faz C3: Kalite Modulu + Polish (Hafta 9-12)

### Ekranlar
15. **NCR Olustur**: Fotoğraf cek + aciklama yaz + kaydet
16. **Muayene Sonuc Gir**: Olcum degerlerini mobilde gir
17. **Kalibrasyon Hatirlatma**: Vadesi gelen kalibrasyonlar
18. **Ariza Bildir**: Fotoğraf + aciklama + makine sec

### Ek Ozellikler
- Kamera ile fotograf ekleme (NCR, ariza)
- Offline mod (baglanti kesilince is kaydet, sonra sync)
- Dark mode
- App Store / Google Play yayinlama

---

## Mobil App Ekran Haritasi

```
Login
  |
  +-- Dashboard (6 KPI)
  |     |
  |     +-- AI Insights
  |
  +-- Barkod Tara
  |     |
  |     +-- Urun Detay / Seri No Bilgi
  |
  +-- Islerim
  |     |
  |     +-- Is Baslat (barkod + makine)
  |     +-- Is Tamamla (miktar + fire)
  |
  +-- Uretim
  |     |
  |     +-- Liste (filtre + arama)
  |     +-- Detay (is emri adimlari)
  |
  +-- Stok
  |     +-- Ara + mevcut goster
  |
  +-- Kalite
  |     +-- NCR Olustur (foto + aciklama)
  |     +-- Muayene Gir
  |
  +-- Bildirimler
  |
  +-- Profil / Ayarlar / Cikis
```

---

# D. MULTI-TENANT SaaS

## Amac
Her musteri kendi izole ortaminda calissin, self-service kayit olsun,
merkezi yonetim panelinden tum tenant'lar izlensin.

## Faz D1: Tenant Izolasyonu (Hafta 1-4)

### Mimari Karar

| Yaklasim | Avantaj | Dezavantaj | Onerilen |
|----------|---------|------------|----------|
| Ayri DB per tenant | Tam izolasyon, kolay backup | Cok DB yonetimi | Kucuk musteri sayisi icin |
| Schema per tenant | Iyi izolasyon, tek DB | Schema migration karmasik | **ONERILEN** |
| Shared DB + TenantId | Basit, tek DB | Veri sizintisi riski | Buyuk olcek icin |

**Karar: Schema-per-tenant** (PostgreSQL schema destegi guclu)

### Yapilacaklar
1. **TenantContext middleware**:
   - Her request'te subdomain'den tenant tespit
   - `firmaadi.quvex.io` → TenantId resolve
   - DB connection string'e schema ekle
2. **Tenant tablosu** (public schema):
   ```sql
   tenants: id, name, subdomain, plan, is_active,
            db_schema, created_at, trial_ends_at,
            max_users, current_users
   ```
3. **Schema olusturma servisi**:
   - Yeni kayit → `CREATE SCHEMA tenant_xxx`
   - Tum tablolari o schema'ya migrate et
   - Seed data (ornek veri) yukle
4. **Global query filter**:
   - `_context.Schema = tenant.DbSchema`
   - Tum sorgular otomatik dogru schema'dan okur
5. **Tenant resolver**:
   ```
   api.firmaadi.quvex.io → schema: tenant_firmaadi
   firmaadi.quvex.io → UI build (ayni, sadece API URL degisir)
   ```

---

## Faz D2: Yonetim Paneli (Hafta 5-8)

### Admin Panel (admin.quvex.io)
1. **Tenant listesi**: Tum musteriler, plan, kullanici sayisi, son giris
2. **Yeni tenant olustur**: Manuel kayit
3. **Plan yonetimi**: FREE / STARTER / PRO / ENTERPRISE
4. **Kullanici limiti**: Plan bazli max kullanici
5. **Modul erisimi**: Plan bazli modul acma/kapama
6. **Faturalama**: Aylik/yillik fatura olusturma
7. **Kullanim metrikleri**: API cagri sayisi, storage kullanimi
8. **Destek**: Tenant bazli ticket sistemi

### Plan Yapilandirmasi
```
FREE (Trial):
  - 14 gun
  - 3 kullanici
  - 500 MB storage
  - Tum moduller acik

STARTER ($XX/ay):
  - 10 kullanici
  - 5 GB storage
  - Uretim + Stok + Satis + Muhasebe

PRO ($XX/ay):
  - 25 kullanici
  - 20 GB storage
  - Tum moduller + Kalite + Bakim

ENTERPRISE (Ozel):
  - Sinirsiz kullanici
  - Sinirsiz storage
  - Tum moduller + AI + Ozel entegrasyon + SLA
```

---

## Faz D3: Odeme ve Faturalama (Hafta 9-12)

### Yapilacaklar
1. **Odeme gateway entegrasyonu**:
   - Turkiye: iyzico veya PayTR
   - Global: Stripe
2. **Abonelik yonetimi**:
   - Plan yukseltme/dusurme
   - Otomatik yenileme
   - Iptal ve veri saklama suresi (90 gun)
3. **Fatura olusturma**:
   - Otomatik aylik/yillik fatura
   - PDF fatura e-posta gonderimi
4. **Kullanim bazli faturalama** (opsiyonel):
   - API cagri sayisi
   - Storage kullanimi
   - Ek kullanici

---

# TOPLAM ZAMAN CIZELGESI

```
Ay 1        Ay 2        Ay 3        Ay 4        Ay 5        Ay 6        Ay 7        Ay 8
|-----------|-----------|-----------|-----------|-----------|-----------|-----------|-----------|
[=== A1 ===][=== A2 ====]
[======= B1-B2 ========][=== B3 ===][= B4 =]
                        [======== C1: Mobil MVP ========][====== C2: Yonetici ======][= C3: Kalite =]
                                                        [======= D1: Tenant ========][=== D2: Admin ==][= D3: Odeme =]
```

| Ay | Teslimat |
|----|----------|
| 1 | Demo ortami canli (demo.quvex.io) |
| 2 | Self-service trial + i18n altyapi + Turkce cikarma |
| 3 | Ingilizce ceviri + Mobil MVP baslangic |
| 4 | Mobil MVP canli (atolye terminali) |
| 5 | Mobil yonetici modulu + tenant izolasyonu |
| 6 | Mobil kalite modulu + admin paneli |
| 7 | Odeme entegrasyonu + app store yayinlama |
| 8 | Tam SaaS canli |

---

# TAKIM IHTIYACI

| Rol | A (Demo) | B (i18n) | C (Mobil) | D (SaaS) |
|-----|----------|----------|-----------|----------|
| Senior Backend | 0.5 | 0.5 | 0.5 | 1 |
| Frontend (React) | 0.5 | 1 | — | 0.5 |
| React Native Dev | — | — | 1 | — |
| DevOps | 0.5 | — | 0.5 | 1 |
| QA / Test | — | 0.5 | 0.5 | 0.5 |
| Ceviri (TR→EN) | — | 1 (geçici) | — | — |
| **Minimum takim** | **1-2 kisi** | **2-3 kisi** | **2 kisi** | **2-3 kisi** |

**Minimum toplam:** 3-4 full-time gelistirici + 1 DevOps (part-time)
**Ideal:** 5-6 kisi (paralel calisma icin)

---

# BASARI METRIKLERI

| Metrik | Hedef (Ay 3) | Hedef (Ay 6) | Hedef (Ay 8) |
|--------|-------------|-------------|-------------|
| Demo sayfasi ziyaretci | 500/ay | 1.000/ay | 2.000/ay |
| Trial kayit | 50/ay | 100/ay | 200/ay |
| Trial → Odeme donusum | %5 | %8 | %12 |
| Mobil app indirme | — | 100 | 500 |
| Ingilizce musteri | 0 | 5 | 15 |
| Aktif tenant | 3 (pilot) | 15 | 30 |
| MRR (Aylik Tekrar Gelir) | — | $2K | $8K |

---

# RISK ve AZALTMA

| Risk | Olasilik | Etki | Azaltma |
|------|----------|------|---------|
| i18n donusum cok uzun surer | Yuksek | Gecikme | Once en kritik 20 ekrani donustur |
| Mobil app barkod performansi | Orta | UX | Expo Camera test'i Faz C1 basinda yap |
| Multi-tenant veri sizintisi | Dusuk | Kritik | Schema izolasyon + penetrasyon testi |
| Trial musteri destek yuku | Yuksek | Kaynak | Self-service dokumantasyon + video |
| Odeme gateway entegrasyonu | Orta | Gecikme | Iyzico ile erken POC |

---

# ILKEL AKSIYONLAR (BU HAFTA)

1. **Demo seed data** script'i yazilmaya baslansin
2. **react-i18next** kurulumu ve common.json olusturulsun
3. **React Native Expo** projesi initialize edilsin
4. **PostgreSQL schema-per-tenant** POC yapilsin
5. **Rekabet slide'i** satis ekibine gonderilsin (derin-rakip-karsilastirma.md)
