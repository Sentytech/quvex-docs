# Quvex ERP — Test Ekibi Rehberi
## Savunma & Havacilik Sektoru Ozel

**Hedef kitle:** QA muhendisleri, testciler, UAT koordinatorleri
**Amac:** Savunma sektorune ozgu test senaryolarini bilmek, kritik akislari dogrulamak

---

## 1. TEST STRATEJISI

### 1.1 Test Katmanlari

| Katman | Arac | Kapsam | Sorumluluk |
|--------|------|--------|-----------|
| Unit Test | xUnit + Vitest | Servis/Component bazli | Gelistirici |
| Integration Test | xUnit + InMemory DB | API endpoint bazli | Gelistirici + QA |
| Tenant Isolation Test | xUnit (25 test) | Cross-tenant veri sizintisi | QA (kritik) |
| E2E Test | Playwright | Tam kullanici akisi | QA |
| UAT | Manuel | Sektor senaryolari | QA + Musteri |
| Guvenlik Testi | Manuel + Otomatik | OWASP Top 10 + tenant isolation | Guvenlik |
| Performans | k6 | 50 tenant / 500 kullanici | DevOps + QA |

### 1.2 Mevcut Test Durumu

| Kategori | Sayi | Durum |
|----------|------|-------|
| API Unit/Integration | 1.200+ | Aktif |
| UI Component/Unit | 600+ | Aktif |
| Tenant Isolation | 25 | Aktif — HER DEPLOY ONCESI ZORUNLU |
| Guvenlik Testleri | 57 | Aktif |
| Help Content Coverage | ~145 route | %95 kapsam |

---

## 2. KRITIK TEST SENARYOLARI (SAVUNMA SEKTORU)

### Senaryo 1: Siparis → Uretim → Kalite → Teslim (Ana Akis)

```
ONKOSUL: Musteri, urun, depo, is emri sablonu tanimli

1. Yeni siparis olustur
   - Musteri: "TUSAS"
   - Urun: "Ti-6Al-4V Baglanti Parcasi Rev.C"
   - Miktar: 50 adet
   - Teslim tarihi: 45 gun sonra

2. Is emri olustur (siparisten)
   - Is emri sablonu sec
   - Baslangic/bitis tarihi gir
   - Makine ata

3. Operator terminalde is goruntuler
   - Operator hesabiyla giris yap
   - Atanan isi gor
   - "Baslat" tikla

4. Uretim tamamla
   - Olcu kontrol yap (SPC veri girisi)
   - Seri numarasi ata
   - "Tamamla" tikla

5. NCR ac (opsiyonel — hata senaryosu)
   - "Olcu tolerans disi — 3 adet hurda"
   - Ciddiyet: Minor
   - CAPA baslat → Kok neden analizi

6. CoC (Uygunluk Sertifikasi) olustur
   - Uretim + urun otomatik gelmeli
   - PDF indir

7. Fatura kes
   - Siparisten otomatik gelir
   - Tutar + KDV kontrol

BEKLENEN: Tum adimlar hatasiz tamamlanir. Audit trail'de her adim gorulur.
```

### Senaryo 2: Tenant Izolasyonu (KRITIK)

```
ONKOSUL: En az 2 tenant (tenant_a, tenant_b)

1. Tenant A ile giris yap
   - Musteri ekle: "TUSAS Test"
   - Urun ekle: "Gizli Parca"
   - NCR ac: "Test NCR"

2. Tenant B ile giris yap (farkli tarayici veya incognito)
   - Musteri listesini kontrol et → "TUSAS Test" GORUNMEMELI
   - Urun listesini kontrol et → "Gizli Parca" GORUNMEMELI
   - NCR listesini kontrol et → "Test NCR" GORUNMEMELI
   - Stok, siparis, fatura, dokuman — HICBIRI gorunmemeli

3. API dogrudan test (Postman/curl)
   - Tenant B token'i ile GET /api/Customer → Tenant A musterileri gelmemeli
   - Tenant B token'i ile GET /api/Product → Tenant A urunleri gelmemeli
   - X-Tenant-Id header'i degistirerek dene → Yetki hatasi almali

KABUL KRITERI: Cross-tenant veri sizintisi = 0. Tek bir kayit bile sizarsa BLOCKER bug.
```

### Senaryo 3: Kalite Modulleri (AS9100)

```
3a. NCR → CAPA Akisi
   1. NCR olustur (uygunsuzluk kaydi)
   2. CAPA baslat (duzeltici faaliyet)
   3. Kok neden analizi yap
   4. Duzeltici aksiyon tanimla
   5. Aksiyon tamamla
   6. NCR kapat
   → Audit trail'de tum adimlar gorulur

3b. FAI (Ilk Madde Muayenesi)
   1. Yeni urun icin FAI baslat
   2. Karakteristikleri tanimla (olcu, malzeme, yuzey)
   3. Olcum sonuclarini gir
   4. Kabul/red karar ver
   → PDF rapor indir

3c. SPC (Istatistiksel Proses Kontrol)
   1. Kontrol plani olustur
   2. En az 25 olcum gir
   3. X-bar, R chart otomatik cizilmeli
   4. Cp, Cpk hesaplanmali
   → Kontrol disi nokta varsa uyari vermeli

3d. Kalibrasyon
   1. Ekipman tanimla (mikrometre, kumpas)
   2. Son kalibrasyon tarihi + periyot gir
   3. Kalibrasyon suresi gelen ekipmanlari listele
   → Hatirlatma bildirimi gelmeli

3e. Egitim Takibi
   1. Egitim kaydi olustur
   2. Katilimci ekle
   3. Yetkinlik matrisi kontrol et
   → Egitimi eksik personel raporu
```

### Senaryo 4: Sektor Profili (UX)

```
1. Yeni tenant olustur
2. Ilk giriste "CNC / Metal Isleme" profili sec
   → 9 menu gorunmeli (79 degil)
   → Kalite menusu GORUNMEMELI
3. Ayarlar > Moduller'e git
   → "Kalite Yonetimi" toggle'ini ac
   → Menu'de kalite gorunmeli
4. Form modu "Basit" → urun formunda 8 alan
   → "Detayli" yap → 66 alan gorunmeli
5. Profili "Havacilik/Savunma" olarak degistir
   → 25 menu gorunmeli, kalite dahil
```

### Senaryo 5: Yardim Sistemi

```
Her ana ekranda:
1. Sag alttaki "?" butonuna tikla VEYA F1 bas
   → Drawer acilmali
   → O ekrana ozel Turkce icerik gelmeli
   → Basliklar: hizli baslangiç, adimlar, ipuclari, iliskili ekranlar

Test edilecek ekranlar (ornekleme):
- /home → Dashboard yardimi
- /products → Urun yardimi
- /quality/ncr → NCR yardimi (AS9100 referansi olmali)
- /admin/monitoring → Monitoring yardimi
- /admin/schema → Schema yardimi

KABUL: Her ekranda anlamli icerik olmali. "Bu sayfa icin icerik hazirlaniyor" = BUG.
```

---

## 3. REGRESYON TEST CHECKLIST

Her deploy oncesi asagidaki kontroller yapilir:

### Zorunlu (Her Deploy)
```
[ ] API build 0 hata
[ ] Test build 0 hata
[ ] 25/25 tenant isolation test gecti
[ ] Ana akis (siparis→uretim→fatura) calisiyor
[ ] Login/Logout calisiyor
[ ] Operator terminali calisiyor
[ ] Schema karsilastirma OK (drift yok)
```

### Haftalik
```
[ ] Tum kalite modulleri (NCR, CAPA, FAI, SPC) tek tek test
[ ] Fason siparis akisi
[ ] Stok giris/cikis/transfer/sayim
[ ] Rapor ekranlari veri getiriyor
[ ] Yardim icerigi tum ekranlarda gorunuyor
[ ] Mobil/tablet layout dogru calisiyor
```

### Aylik
```
[ ] k6 performans testi (50 tenant / 500 user)
[ ] Guvenlik testi (SQL injection, XSS, CSRF)
[ ] Backup/restore testi
[ ] Tier 2 promote/demote testi
[ ] KVKK data export + silme testi
```

---

## 4. BUG ONCELIK MATRISI

| Oncelik | Tanim | SLA | Ornek |
|---------|-------|-----|-------|
| **P0 (Blocker)** | Sistem kullanilamaz, veri kaybı/sizinti riski | 2 saat | Cross-tenant veri sizintisi, login calismıyor, veri kaybı |
| **P1 (Critical)** | Ana is akisi kirik, workaround yok | 4 saat | Siparis olusturulamiyor, NCR acilamiyor, fatura kesilemiyor |
| **P2 (Major)** | Is akisi etkili, workaround var | 1 is gunu | SPC grafigi yanlis hesapliyor, export calismıyor |
| **P3 (Minor)** | Kozmetik, UX, performans | 1 hafta | Yanlis icon, yavas yuklenen sayfa, yazim hatasi |
| **P4 (Trivial)** | Gelecek versiyona | Sprint sonu | Oneriler, "nice to have" |

**KURAL:** Tenant izolasyon ihlali = HER ZAMAN P0. Istisna yok.

---

## 5. TEST ORTAMI

| Ortam | URL | Amac | Veri |
|-------|-----|------|------|
| Dev | localhost:3000 + localhost:5052 | Gelistirme | Test verisi |
| Test | quvex.sentytech.com | QA test | Demo + test verisi |
| Staging | staging.quvex.app | Pre-prod | Prod benzeri veri |
| Prod | quvex.app | Canli | Gercek musteri verisi |

### Test Hesaplari
| Ortam | Email | Sifre | Rol |
|-------|-------|-------|-----|
| Dev/Test | admin@quvex.com | Admin123!@#$ | SuperAdmin |
| Dev/Test | operator@test.com | Test123!@#$% | Operator |
| Dev/Test | kalite@test.com | Test123!@#$% | Kalite Muduru |
