# QUVEX ERP
## Kuecuk ve Orta Oelcekli Ueretim Isletmeleri Icin Tuemlesik Yoenetim Platformu

---

# Yoenetici Oezeti Brosuerue

---

## Neden Quvex?

Quvex, uretim yapan kucuk ve orta olcekli isletmeler icin gelistirilmis, **tek platformda tum is sureclerini yonetebilen** tuemlesik bir ERP sistemidir.

Excel tablolari, dagnik yazilimlar ve kagit bazli surecler yerine; siparis, uretim, stok, kalite, bakim, muhasebe, kasa/banka ve raporlamayi **tek ekrandan** yonetin.

**Multi-tenant SaaS mimarisi** ile 50+ isletmeye esanli hizmet verebilen, savunma sanayii duezeyinde veri izolasyonu sunan, sektoeruenueze oezel yapilandirma ile dakikalar icinde devreye alinan bir platform.

---

## Rakamlarla Quvex

| Metrik | Deger |
|--------|-------|
| Fonksiyonel Moduel | 14 |
| Ekran / Sayfa | 120+ |
| API Endpoint | 750+ |
| Veritabani Tablosu | 140+ |
| Controller | 115+ |
| Toplam Test | 1819 (1128 API + 691 UI) |
| Standart Rapor | 13 |
| Kalite Alt Modeulue | 23 |
| Desteklenen Sektoer | 11 |
| Desteklenen Standart | AS9100 / ISO 9001 |

---

## 14 Ana Moduel

### 1. URETIM YONETIMI
- Siparis takibi ve is emri yonetimi
- Gantt grafigi ile goersel planlama
- Kapasite planlama ve cakisma kontrolue
- **Operator Terminali (ShopFloor)** — dokunmatik optimize, NumPad girisi, barkod okutma, glassmorphism UI, offline-first
- Fason is emri takibi
- Seri numara ve izlenebilirlik
- BOM patlama ve MRP hesaplama

### 2. STOK YONETIMI
- Coklu depo ve lokasyon yonetimi
- Stok giris/cikis ve transfer
- Lot/parti takibi ve son kullanma tarihi
- Stok sayim ve mutabakat
- ABC analizi ve stok degerleme (FIFO/LIFO/Agirlikli Ortalama)
- Min/max stok uyarilari
- Barkod islemleri ve okutma

### 3. SATIS ve MUSTERI
- Teklif hazirlama ve teklif doenusuem takibi
- Siparis acma ve uretim aktarma
- Musteri cari hesap ekstre
- **Cari bakiye otomatik guncelleme** (fatura kesimi + odeme aninda)
- Musteri memnuniyet ve sikayet yonetimi
- Iletisim kisi ve adres yonetimi

### 4. SATINALMA
- Satinalma talep ve teklif yonetimi
- Tedarikci degerlendirme ve onaylama
- Satinalma siparisi ve mal alim
- Otomatik satinalma oenerisi

### 5. MUHASEBE
- Satis ve alis faturasi
- Iade faturasi (credit note)
- OEdeme takibi ve vade yonetimi
- Banka mutabakat
- Tevkifat ve KDV hesaplama
- Kar-zarar analizi
- **TCMB doeviz kuru entegrasyonu** (5 guenluk fallback ile otomatik cekme)

### 6. KASA / BANKA YONETIMI (YENI)
- Kasa hesabi ve banka hesabi tanimlama
- Para yatirma / cekme islemleri
- Hesaplar arasi transfer
- Kasa/banka ekstre ve defteri
- Fatura odemesinde otomatik bakiye guncelleme
- Coklu doeviz destegi

### 7. KALITE YONETIMI (23 Alt Moduel)
- Uygunsuzluk (NCR) ve CAPA
- Giris kontrol ve muayene
- Kalibrasyon yonetimi
- Risk analizi ve FMEA
- Kontrol planlari
- Ic denetim
- Tedarikci degerlendirme
- FAI (AS9102), PPAP, SPC
- Sahte parca oenlemei, FOD oenlemei
- Konfigurasyon yonetimi
- Ueruen guevenligi
- Tasarim ve gelistirme
- Tedarik zinciri risk yonetimi

### 8. BAKIM YONETIMI (CMMS)
- Koruyucu / duzeltici / kestirimci bakim planlari
- Is emri olusturma ve tamamlama
- Ariza kaydi ve koek neden analizi
- OEE (Genel Ekipman Etkinligi) dashboard
- Makine gecmisi (MTBF / MTTR)

### 9. IK ve VARDIYA
- Vardiya tanimlama ve personel atama
- Giris/cikis takibi
- Egitim ve yetkinlik matrisi
- Dokueman yonetimi ve versiyon kontrolue

### 10. RAPORLAMA ve ANALITIK
- 13 standart rapor (ueretim, stok, satis, kalite, maliyet)
- Dinamik rapor olusturucu
- KPI analitik panosu
- Excel export
- Teklif doenusuem, teslimat tahmini, NCR trend

### 11. PROJE YONETIMI
- Proje olusturma ve durum takibi
- Kilometre tasi yonetimi
- Gorev atama ve ilerleme izleme
- Buetce takibi

### 12. ENTEGRASYON
- e-Fatura (GIB) entegrasyonu
- SignalR ile anlik bildirimler + sesli uyari (Web Audio API)
- Excel import/export
- PDF rapor ciktisi
- REST API ile disaridan erisim (750+ endpoint)
- TCMB doeviz kuru servisi

### 13. GUEVENLIK ve YONETIM
- Rol bazli erisim kontrolue (RBAC + CASL)
- Izin bazli yetkilendirme
- Denetim izi (audit trail)
- Siber guevenlik politika ve olay yonetimi
- Hesap kilitleme (5 deneme → 15dk kilit) ve sifre politikasi (12+ karakter)
- CORS, CSRF, CSP (no unsafe-eval), rate limiting
- Sentry hata takibi (API + UI)
- Multi-tenant veri izolasyonu (schema-per-tenant)

### 14. AI INSIGHTS (YENI)
- Yapay zeka destekli ueretim oengoerueleri
- Akilli raporlama ve trend analizi
- Veri odakli karar destek sistemi

---

## Oenemli Farkliliklar

### Operator Terminali (ShopFloor)
Atolyede tablet veya dokunmatik ekranla kullanilmak uezere tasarlanmis, **glassmorphism tasarimli** ozel arayuez. NumPad ile hizli veri girisi, barkod okutma, offline-first calisma. Operatorlerin is emri baslama/bitirme, fire bildirimi ve kalite kaydi islemlerini saniyeler icinde yapmasini saglar.

### Multi-Tenancy (Coklu Kiralaci)
Schema-per-tenant mimarisi ile **50+ isletmeye** esanli hizmet. Savunma sanayii duezeyinde veri izolasyonu, sifrelenmis baglanti dizileri (AES-256-GCM), Redis onbellek ile yuksek performans.

### Sektoerel Onboarding Wizard
5 adimli rehberli kurulum sihirbazi ile sektoeruenueze oezel yapilandirma. **11 sektoer profili** arasindan secerek dakikalar icinde sistemi devreye alin.

### PWA ve Offline-First
Progressive Web App olarak kurulabilir. Service worker ile cevrmdisi calisma, anlik yeniden senkronizasyon.

---

## 11 Desteklenen Sektoer

1. CNC ve Metal Isleme
2. Genel Ueretim
3. Savunma ve Havacilik (AS9100)
4. Gida ve Kimya
5. Otomotiv Yan Sanayi
6. Mobilya ve Ahsap
7. Tekstil ve Hazir Giyim
8. Plastik ve Kaucuk
9. Elektronik ve Kablo Montaj
10. Medikal Cihaz
11. Ambalaj ve Paketleme

---

## Teknik Altyapi

| Katman | Teknoloji |
|--------|-----------|
| Frontend | React 18, Vite 6, Ant Design 5.29, Redux Toolkit, Framer Motion |
| Backend | .NET 8 LTS, Entity Framework Core 8, Clean Architecture |
| Veritabani | PostgreSQL 16 |
| Gercel Zamanli | SignalR + Web Audio API (sesli bildirim) |
| Guvenlik | JWT + RBAC + CASL + CSRF + CSP + Rate Limiting + Sentry |
| Deployment | Docker (non-root), Nginx reverse proxy |
| CI/CD | GitHub Actions, Dependabot, Trivy, Husky pre-commit |
| Test | 1819 test (xUnit + Vitest) |
| PWA | Service Worker, offline-first, installable |

---

## Iletisim

**Quvex ERP**
Web: quvex.io
E-posta: info@quvex.io

*Quvex — Uretiminizi dijitallestirin, kalitenizi yueseltin.*
