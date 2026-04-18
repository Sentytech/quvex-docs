# Quvex ERP — Teknik Destek Rehberi
## Savunma & Havacilik Sektoru Ozel

**Hedef kitle:** Teknik destek, uygulama danismani, customer success
**Amac:** Musteri sorunlarini hizli cozebilmek, sistemi konfigure edebilmek

---

## 1. MIMARI BILGISI

### 1.1 Sistem Mimarisi

```
Kullanici (Browser/Mobil)
    ↓ HTTPS
Nginx (SSL termination + static assets)
    ↓
ASP.NET Core API (Docker container)
    ↓
TenantResolutionMiddleware → JWT → Schema cozumleme
    ↓
PostgreSQL (schema-per-tenant + RLS)
    ↓
Redis (cache + rate limit + connection limit)
```

### 1.2 Tenant Izolasyonu (Musteri Verisi Guvenligi)

| Katman | Mekanizma | Ne Yapar |
|--------|----------|----------|
| 1 | Schema isolation | Her tenant ayri PostgreSQL schema'da |
| 2 | HasQueryFilter (124) | EF Core otomatik WHERE TenantId = X ekler |
| 3 | RLS (119 tablo) | Veritabani seviyesinde satir izolasyonu |
| 4 | SignalR tenant group | Bildirimler sadece kendi tenant'ina gider |
| 5 | API response validator | Frontend'de cross-tenant veri kontrolu |

**ONEMLI:** Bir tenant'in verisi ASLA baska tenant'a sizamaz. 5 katman savunma.

### 1.3 Tier Sistemi

| Tier | Aciklama | Kullanim |
|------|----------|----------|
| **Tier 1 (Shared)** | Ayni DB, ayri schema | Cogu musteri |
| **Tier 2 (Dedicated DB)** | Kendi PostgreSQL DB'si | Savunma firmalari |

Tier 2'ye yukseltme: Admin panel → Tenant → "Tier 2'ye Yukselt"

---

## 2. KURULUM & KONFIGURASYON

### 2.1 Yeni Tenant Olusturma

```
Admin Panel → Tenantlar → Yeni Tenant
  1. Firma bilgileri (ad, subdomain, VKN, iletisim)
  2. Plan secimi (Enterprise veya Savunma Paketi)
  3. Admin kullanici (email + sifre)
  → Schema otomatik olusturulur
  → Admin kullanicisi otomatik yaratilir
  → Welcome email gider
```

### 2.2 Sektor Profili Ayarlama

Musteri ilk girisinde veya `Ayarlar > Moduller`:
- **"Havacilik / Savunma"** profilini sec
- 25 menu item gorunur (tam kalite dahil)
- Form modu: Detayli (66 alan)
- Dashboard: Tam (10+ widget)

### 2.3 Ilk Yapilandirma Checklist

```
[ ] Firma bilgileri girildi (Ayarlar > Firma Bilgileri)
[ ] Depolar tanimlandi (en az 1: Hammadde Deposu)
[ ] Birimler kontrol edildi (adet, kg, metre, mm)
[ ] Is emri sablonlari olusturuldu (CNC, torna, freze, kaplama)
[ ] Is emri adimlari tanimlandi (kesim, isleme, olcu kontrol, paketleme)
[ ] Makineler eklendi (CNC-01, Torna-01, vb.)
[ ] Kalite kontrol plani sablonu olusturuldu
[ ] Kullanici rolleri ayarlandi (Admin, Kalite, Uretim, Operator)
[ ] Operator kullanicilari olusturuldu (atolye terminali icin)
```

### 2.4 Rol Yapisi Onerisi (Savunma Firması)

| Rol | Kim | Yetkiler |
|-----|-----|---------|
| Admin | Patron/GM | Her sey |
| Kalite Muduru | Kalite sorumlusu | Kalite tum (NCR, CAPA, FAI, audit...) + raporlar |
| Uretim Sefi | Uretim sorumlusu | Is emri, uretim, makine, bakim |
| Operator | Tezgah basindaki usta | Sadece atolye terminali + is bitir + sorun bildir |
| Muhasebe | Muhasebeci | Fatura, odeme, banka, doviz |
| Satin Alma | Satin almaci | Talep, teklif, siparis, tedarikci |
| Depocu | Depo sorumlusu | Stok, giris/cikis, sayim, transfer |

---

## 3. SIK SORULAN SORULAR (DESTEK)

### 3.1 Giris / Kimlik Dogrulama

| Sorun | Cozum |
|-------|-------|
| "Giris yapamiyorum" | Sifre 12+ karakter mi? Hesap kilitli mi? (5 basarisiz → 15dk kilit) |
| "Sifre unuttum" | Admin panelden sifre sifirlama |
| "Baska tenant'in verisi gorunuyor" | OLAMAZ — 5 katman izolasyon var. Log kontrol et, tenant ID'yi dogrula |
| "Oturum surekli kapaniyor" | 30 dk inactivity timeout. Normal. Uzatmak icin Settings'ten ayarla |

### 3.2 Uretim

| Sorun | Cozum |
|-------|-------|
| "Is emri olusturamiyorum" | Siparis onaylanmis mi? Urun tanimli mi? Sablon var mi? |
| "Gantt'ta gorunmuyor" | Baslangic/bitis tarihi girilmis mi? |
| "Operator terminalde is gormuyor" | Operator rolu atanmis mi? Is emri "Devam" durumunda mi? |
| "Seri numarasi otomatik gelmiyor" | Urun kaydinda "Seri No Takibi Gerekli" isaretli mi? |

### 3.3 Kalite (AS9100)

| Sorun | Cozum |
|-------|-------|
| "NCR nasil acilir?" | Kalite → Uygunsuzluk → Yeni NCR. Zorunlu alanlar: NCR no, aciklama, tespit tarihi, ciddiyet |
| "CAPA NCR'a baglanmiyor" | NCR detayinda "CAPA Baslat" butonu var. Oradan baglanir |
| "CoC nasil olusturulur?" | Uretim tamamlandiktan sonra Kalite → CoC → Yeni. Uretim ve urun otomatik gelir |
| "FAI raporu eksik" | Kalite → FAI → Yeni. Ilk madde muayenesi icin urun ve karakteristikler girilmeli |
| "Kalibrasyon hatirlatmasi gelmiyor" | Kalibrasyon → Ekipman → son kalibrasyon tarihi ve periyot girilmis mi? |
| "SPC grafigi gorunmuyor" | En az 25 olcum verisi girilmeli. Kontrol limitleri otomatik hesaplanir |

### 3.4 Stok & Depo

| Sorun | Cozum |
|-------|-------|
| "Stok eksi gorunuyor" | Stok giris fisi kesilmeden uretim yapilmis. Giris fisi olustur |
| "Lot takibi acik ama lot gorunmuyor" | Urun kaydinda "Lot Takibi Gerekli" isaretli mi? Giris fisinde lot no girilmis mi? |
| "Depo transferi yapilamıyor" | Kaynak depoda yeterli stok var mi? |

### 3.5 Fatura & Muhasebe

| Sorun | Cozum |
|-------|-------|
| "e-Fatura gonderilemiyor" | E-fatura saglayicisi (Foriba/Logo) ayarlari dogru mu? |
| "Doviz kuru eski" | TCMB otomatik cekme Hangfire job'u calisiyor mu? Manuel: Doviz Kurlari sayfasi |

---

## 4. SORUN GIDERME ARACLARI

### 4.1 Admin Panel → Monitoring

```
/admin/monitoring → Platform genel durum
  - Tenant saglik skorlari (0-100)
  - Aktif alertler (STORAGE_HIGH, TRIAL_EXPIRING, ERROR_RATE_HIGH...)
  - Son aktiviteler (kim ne yapti)
```

### 4.2 Schema Karsilastirma

```
/admin/schema/compare → Tum tenant schemalari kontrol
  - Eksik tablo var mi?
  - Eksik kolon var mi?
  - "Onar" butonu ile otomatik duzelt
```

### 4.3 Audit Trail

```
/admin/audit-logs → Cross-tenant audit kayitlari
  - Filtre: tenant, tarih, islem tipi, kullanici
  - "Kim ne zaman ne yapti?" sorusuna cevap
```

### 4.4 Health Check

```
/api/metrics/health-detailed → Sistem sagligi
  - DB durumu + latency
  - Redis durumu
  - Disk alani
  - Bellek kullanimi
  - Hata orani
```

### 4.5 Log Kontrol

```
Serilog → Console + File
  [SECURITY] prefixi → Guvenlik olaylari (login, lockout, permission denied)
  [MIGRATION] → SQL migration islemleri
  [BILLING] → Odeme islemleri
  [KVKK] → Veri silme/anonimlestime
  [SCHEMA] → Schema karsilastirma/onarim
```

---

## 5. ESCALATION MATRISI

| Seviye | Kimde | Ornek | SLA |
|--------|-------|-------|-----|
| L1 | Teknik Destek | Giris sorunu, menü gorunmuyor, sifre reset | 2 saat |
| L2 | Uygulama Danismani | Konfigurasyon, is akisi degisikligi, rapor | 1 is gunu |
| L3 | Yazilim Gelistirici | Bug, performans sorunu, veri sorunu | 3 is gunu |
| L4 | CTO / Architect | Guvenlik ihlali, veri sizintisi suphesi, mimari sorun | Aninda |

**KURAL:** Veri sizintisi suphesi → ANINDA L4. Bekletme yok.
