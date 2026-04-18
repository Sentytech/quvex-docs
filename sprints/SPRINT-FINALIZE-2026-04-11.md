# Quvex ERP — Urun Finalize Sprint (2026-04-11 ~ 2026-04-12)

> Hedef: Quvex'i rafa koyulabilir urun haline getirmek. 2 gun yogun calisma.
> Kararlar: Detayli rol hiyerarsisi, test+dokumantasyon odakli, tenant user UI, MD+Playwright

---

## ANALIZ OZETI

### Genel Durum
- **API:** 149 controller, 758 endpoint, 1223 test, 89 permission — PRODUCTION-READY
- **UI:** React 18 + Vite 6.4, 686 test, PWA, i18n — PRODUCTION-READY (minor gaps)
- **Mobile:** 24 ekran, Expo 55 — FUNCTIONAL
- **Docs:** 130+ dosya, FILE-MAP.md — ORGANIZED
- **Landing:** Astro, 3 sayfa — DEPLOYED
- **Toplam Test:** 1997+

### Sektor Hazirlik Durumu
| Sektor | Durum | Eksik |
|--------|-------|-------|
| CNC/Savunma | %65 | 3 API bug, tool life yok, SPC zayif, MSA yok |
| Otomotiv Yan Sanayi | %50 | E2E test senaryosu yok |
| Genel Uretim (Plastik/Kaucuk) | %0 | Hicbir dokuman/test yok |
| Gida Uretimi | %0 | Hicbir dokuman/test yok |
| Tekstil | %0 | Hicbir dokuman/test yok |

### Rol/Yetki Durumu
| Sorun | Etki |
|-------|------|
| Multi-role bug: sadece ilk rol yukleniyor | User 2 role sahipse 2. rol yok sayiliyor |
| Operator disinda herkes full menu goruyor | Kaliteci fatura goruyor, muhasebeci uretim goruyor |
| Uretim Muduru vs Operator ayrimi yok | Ikisi de ayni "Uretim" rolu |
| `/Account/my-permissions` sadece superadmin | Normal user permission refresh yapamiyor |
| Tenant admin user yonetim UI'i yok | Fabrika kendi kullanicilarini yonetemez |

---

## ROL-EKRAN MATRISI (HEDEF)

### 8 Rol → Menu Kisitlama

```
YONETICI (Admin)
  ✓ TUM ekranlar + Ayarlar + Kullanici Yonetimi + Raporlar
  ✓ Dashboard: Genel ozet, finansal, KPI
  ✓ Tenant ayarlari (user ekleme, rol atama)

URETIM MUDURU
  ✓ Is Emirleri, Uretim Planlama, Gantt, MRP
  ✓ Operasyon routing, Makine atama, Kapasite
  ✓ Uretim Raporlari, OEE, Fire takibi
  ✓ Dashboard: Uretim KPI
  ✗ Fatura, Odeme, Cari, Banka
  ✗ Kullanici Yonetimi, Ayarlar

KALITE MUDURU
  ✓ NCR, CAPA, FAI, Muayene (giris/proses/son)
  ✓ Kalibrasyon, Kontrol Plani, SPC
  ✓ Malzeme Sertifikasi, CoC, MRB
  ✓ Kalite Raporlari
  ✓ Dashboard: Kalite KPI, ret orani
  ✗ Fatura, Odeme, Stok hareketi
  ✗ Kullanici Yonetimi

DEPO SORUMLUSU
  ✓ Stok, Lot, Transfer, Sayim
  ✓ Depo lokasyonlari, Mal kabul
  ✓ Stok Raporlari, ABC Analiz
  ✗ Uretim planlama, Fatura
  ✗ Kalite (NCR, CAPA)

MUHASEBECI
  ✓ Fatura, Odeme, Cari Hesap, Banka
  ✓ Maliyet raporlari, Aging analiz
  ✓ Finansal Dashboard
  ✗ Uretim, Kalite, Stok hareketi
  ✗ Kullanici Yonetimi

SATINALMA
  ✓ Satin Alma Siparis, Tedarikci, Teklif
  ✓ Mal Kabul, Tedarikci Degerlendirme
  ✓ Satin Alma Raporlari
  ✗ Uretim, Fatura, Kalite

BAKIM TEKNISYENI
  ✓ Bakim Planlari, Ariza Kayit
  ✓ Ekipman, OEE, MTBF/MTTR
  ✓ Bakim Raporlari
  ✗ Fatura, Stok, Kalite, Uretim planlama

OPERATOR
  ✓ ShopFloor Terminal (ana ekran)
  ✓ Barkod Tarayici
  ✓ Bekleyen Onaylar
  ✓ Bildirimler
  ✗ Diger tum ekranlar
```

### Implementasyon: navigation/vertical/index.js

```javascript
const ROLE_MENU_MAP = {
  Admin:      null, // null = tum menu
  Uretim:     ['home', 'production', 'workOrders', 'gantt', 'mrp',
               'operations', 'machines', 'capacity', 'fireTracking',
               'productionReports', 'notifications'],
  Kalite:     ['home', 'quality', 'ncr', 'capa', 'fai', 'inspection',
               'calibration', 'controlPlan', 'spc', 'materialCert',
               'coc', 'mrb', 'qualityReports', 'notifications'],
  Depo:       ['home', 'stock', 'lots', 'transfers', 'stockCount',
               'warehouseLocations', 'receiving', 'stockReports',
               'abcAnalysis', 'notifications'],
  Muhasebe:   ['home', 'invoices', 'payments', 'currentAccounts',
               'bank', 'costReports', 'agingAnalysis',
               'financialDashboard', 'notifications'],
  Satin_Alma: ['home', 'purchaseOrders', 'suppliers', 'rfq',
               'receiving', 'supplierEval', 'purchaseReports',
               'notifications'],
  Bakim:      ['home', 'maintenance', 'equipment', 'faultRecords',
               'oee', 'maintenanceReports', 'notifications'],
  Operator:   ['home', 'shopFloorTerminal', 'barcodeScanner',
               'pendingApprovals', 'notifications', 'todo']
}
```

---

## SAVUNMA/TALASLI IMALAT ANALIZI

### Mevcut Durum (18+ Controller)
| Ozellik | Controller | Durum |
|---------|-----------|-------|
| Operasyon routing | WorkOrderStepsController (10 ep) | ✅ Tam |
| FAI (AS9102) | FaiController (8 ep) | ✅ Tam |
| Kalibrasyon | CalibrationController (8 ep) | ✅ Tam |
| Malzeme sertifikasi | MaterialCertificateController (5 ep) | ✅ Tam |
| Fason is | SubcontractOrderController (12 ep) | ✅ Tam |
| NCR | NcrController (8 ep) | ✅ Tam |
| CAPA | CapaController (7 ep) | ✅ Tam |
| MRB | MrbController (6 ep) | ✅ Tam |
| CoC | CocController (4 ep) | ✅ Tam |
| Sozlesme inceleme | ContractReviewController (4 ep) | ✅ Tam |
| Seri numara/genealogy | SerialNumberController (11 ep) | ✅ Tam |
| Izlenebilirlik | TraceabilityController (2 ep) | ✅ Tam |
| Data pack | DataPackController (2 ep) | ✅ Tam |
| Konfigürasyon yonetimi | ConfigurationManagementController (7 ep) | ⚠️ Kismi |
| Proses yeterliligi (Cp/Cpk) | ProcessCapabilityController (4 ep) | ⚠️ Kismi |

### Eksik Olanlar (2 gunde YAPILMAYACAK — dokumante edilecek)
| Eksik | Neden Onemli | Efor (gelecek sprint) |
|-------|-------------|----------------------|
| Takim omru takibi (tool life) | CNC'de kritik, maliyet etkisi | 1 hafta |
| SPC gercek zamanli kontrol kartlari | 7 kart tipi, alarm sistemi | 1 hafta |
| MSA / Gage R&R | AS9100 audit zorunlu | 3-5 gun |
| Ozel proses kontrol parametreleri | Kaynak, isil islem, yuzey islem | 1 hafta |
| Musteri emanet malzeme (CFM) | Savunma sektorunde yasal zorunluluk | 3 gun |
| Teslim dosyasi release workflow | Formal onay sureci | 3 gun |
| FAIR balon cizim ek aciklama | Teknik cizimle olcum esleme | 5 gun |

### Bu Sprintte Yapilacak Savunma Isleri
1. ✅ 3 API bug fix (OfferProduct, SubcontractOrder, Invoice)
2. ✅ Savunma sektor testi detaylandirilacak (mevcut 48 test varken eksik adimlari belirle)
3. ✅ Eksik ozellikler PRD'ye "Gelecek Surum" olarak dokumante edilecek
4. ✅ Mevcut AS9100 ozelliklerinin tam test edilmesi

---

## TENANT KULLANICI YONETIMI (TEMEL UI)

### Hedef
Tenant admin (fabrika yoneticisi) kendi panelinden:
- Kullanicilari listeleyebilsin
- Yeni kullanici ekleyebilsin (ad, soyad, email, rol)
- Rol atayabilsin (8 rolden birini sec)
- Kullanici silebilsin/pasif yapabilsin
- Kalan kullanici kotasini gorebilsin

### Mevcut API Altyapisi
- `POST /Account/register` → user olusturma (TenantId otomatik) ✅
- `GET /Account/users` → tenant kullanicilari listele ✅
- `PUT /Account/{id}/role` → rol ata ✅
- `DELETE /Account/{id}` → user sil ✅
- `tenant.MaxUsers` limit kontrolu ✅

### Yapilacak UI Isler
| # | Is | Dosya | Efor |
|---|---|-------|------|
| T1 | Kullanici Listesi sayfasi | views/admin/UserManagement.js | 2 saat |
| T2 | Kullanici Ekleme modal | components/UserCreateModal.js | 1 saat |
| T3 | Rol atama dropdown | UserManagement icerisinde | 30 dk |
| T4 | Menu'ye "Kullanici Yonetimi" ekle (sadece Admin rolu) | navigation/ | 15 dk |
| T5 | Route + permission guard | router/routes/ | 15 dk |

---

## GUNCEL 2 GUNLUK SPRINT PLANI

### GUN 1 (2026-04-11) — Altyapi + Roller + Otomotiv/Plastik Testi

| Saat | Task | ID | Detay |
|------|------|----|-------|
| 09:00-09:30 | P0: Quick fixes | QF1-5 | 404 route, robots.txt, .dockerignore, Dockerfile HEALTHCHECK |
| 09:30-11:00 | P0: 3 API bug fix | BF1-3 | OfferProduct, SubcontractOrder FK, Invoice fields |
| 11:00-12:00 | P0: Multi-role fix | MR1 | AccountController: tum roller + permissions yukle (FirstOrDefault → ToList) |
| 12:00-13:00 | P0: Rol menu kisitlama | RM1 | navigation/index.js: ROLE_MENU_MAP + filterMenuByRole guncelle |
| 13:00-13:30 | P0: Permission refresh fix | PR1 | `/Account/my-permissions` → authenticated user icin ac |
| 13:30-14:00 | Test calistir | - | `dotnet test` + `npx vitest run` → regression yok |
| 14:00-17:00 | P1: Otomotiv E2E | OT1 | MD senaryo (PPAP/FMEA/SPC) + Playwright spec |
| 17:00-19:30 | P1: Plastik Enjeksiyon E2E | PE1 | MD senaryo (BOM/MRP/fire) + Playwright spec |
| 19:30-20:00 | Savunma eksik analizi dokumante | SA1 | PRD'ye "Gelecek Surum" bolumu ekle |

### GUN 2 (2026-04-12) — Gida/Tekstil + Tenant UI + Polish

| Saat | Task | ID | Detay |
|------|------|----|-------|
| 09:00-12:00 | P1: Gida Uretimi E2E | GD1 | MD senaryo (HACCP/lot/recall) + Playwright spec |
| 12:00-14:30 | P1: Tekstil E2E | TX1 | MD senaryo (boya lot/AQL) + Playwright spec |
| 14:30-16:30 | P1: Tenant User Yonetim UI | T1-5 | UserManagement sayfa + modal + menu + route |
| 16:30-18:00 | P1: 3 sektor user-guide HTML | UG1-3 | Plastik, gida, tekstil sektor rehberleri |
| 18:00-18:30 | P2: CI/CD pipeline | CI1 | GitHub Actions: build → test |
| 18:30-19:00 | P3: OG tags + sitemap + robots | PL1 | index.html meta, public/ dosyalari |
| 19:00-19:30 | Tam dogrulama | - | Tum testler, build, docker, E2E, rol testi |
| 19:30-20:00 | DURUM + CHANGELOG guncelle | - | Final durum raporu |

---

## SEKTOR TEST SENARYOLARI

### Format: Her senaryo icin
1. **MD Dokuman** → `tests/{sektor}-E2E-SENARYO.md` (Turkce, adim adim)
2. **Playwright Spec** → `tests/e2e/{sektor}/{sektor}-e2e.spec.js` (otomatik)

### Senaryo 1: Otomotiv Yan Sanayi (PPAP)
```
Firma: Aslan Otomotiv Parca A.S. (OEM: Ford Otosan)
Sektor: Kaucuk conta / metal parca
Standart: IATF 16949, PPAP Level 3
Is Akisi (35-40 adim):
  1. Musteri kaydi (Ford Otosan, PPAP zorunlu)
  2. Teklif → Siparis (PPAP Level 3 ile)
  3. Urun tanimi (Conta, hammadde: Kaucuk NBR-70)
  4. APQP sureci → Kontrol plani olustur
  5. Proses FMEA hazirla
  6. SPC olcum kaydi (Cp/Cpk hesapla, hedef >1.33)
  7. Is emri ac → Uretim baslat
  8. Giris kalite kontrol (hammadde sertifika)
  9. Proses kalite kontrol (SPC ile)
  10. Son muayene → PPAP paket hazirla
  11. Sevkiyat + Irsaliye → Fatura + Odeme
Rol Testi: Uretim Muduru, Kaliteci, Muhasebeci ayri ayri login
```

### Senaryo 2: Genel Uretim — Plastik Enjeksiyon
```
Firma: Ozkan Plastik San. Ltd.Sti.
Sektor: Plastik kasa / ambalaj
Standart: ISO 9001
Is Akisi (30-35 adim):
  1. Musteri + Urun tanimi (Plastik kasa, PP Polipropilen)
  2. BOM/Recete (hammadde + boya + ambalaj)
  3. Kalip tanimi (makine parametreleri)
  4. Teklif → Siparis
  5. MRP: BOM patlatma → net ihtiyac → satin alma onerisi
  6. Satin alma → Mal kabul → Giris kalite
  7. Is emri → Uretim (fire/hurda dahil)
  8. Son muayene → Depo → Sevkiyat → Fatura
Rol Testi: Depo Sorumlusu, Satinalma, Operator login
```

### Senaryo 3: Gida Uretimi
```
Firma: Taze Gida San. A.S.
Sektor: Sut urunleri / unlu mamuller
Standart: ISO 22000, HACCP
Is Akisi (35-40 adim):
  1. Tedarikci kaydi (ISO 22000 sertifikali)
  2. Hammadde tanimi (lot + raf omru zorunlu)
  3. HACCP kontrol plani
  4. Satin alma → Mal kabul (sicaklik kontrolu)
  5. Giris kalite (mikrobiyoloji, allerjen)
  6. Recete/BOM → Uretim emri (Parti/Lot otomatik)
  7. Uretim kaydi (sicaklik, nem, sure)
  8. Son muayene → Etiketleme → FIFO depo
  9. Sevkiyat → Izlenebilirlik raporu
  10. BONUS: Geri cagirma (recall) — lot bazli geriye izleme
Rol Testi: Kalite Muduru, Depo Sorumlusu login
```

### Senaryo 4: Tekstil Uretimi
```
Firma: Atlas Tekstil San. Ltd.Sti.
Sektor: Hazir giyim (gomlek)
Standart: ISO 9001, AQL 2.5
Is Akisi (35-40 adim):
  1. Musteri kaydi (marka: Koton)
  2. Urun + Beden-renk varyant tanimi
  3. BOM (kumas + dugme + iplik + etiket + ambalaj)
  4. Boya lot (renk kodu + parti esleme)
  5. Teklif → Siparis (beden/renk dagilimi)
  6. Kumas satin alma → Mal kabul (metraj, renk)
  7. Giris kalite (gramaj, renk farki dE)
  8. Kesim → Dikim → Ara kalite → Yikama/finish
  9. Son muayene (AQL 2.5) → Paketleme → Barkod
  10. Sevkiyat → Fatura
Rol Testi: Uretim Muduru, Operator login
```

---

## BASARI KRITERLERI

| Kriter | Hedef |
|--------|-------|
| API test | 1223+ (bug fixler dahil) |
| UI test | 686+ |
| E2E sektor senaryolari | 5 (savunma + otomotiv + plastik + gida + tekstil) |
| E2E Playwright spec | 36+ (mevcut 32 + 4 yeni sektor) |
| User guide sektor | 6 (mevcut 3 + plastik + gida + tekstil) |
| Rol menu kisitlama | 8 rol icin ayri menu ✓ |
| Multi-role bug | Fix ✓ |
| Permission refresh | Normal user icin acik ✓ |
| Tenant user UI | Listele/ekle/sil/rol ata ✓ |
| 404 sayfasi | Calisiyor ✓ |
| robots.txt | Mevcut ✓ |
| API bug | 0 bilinen kritik ✓ |
| Savunma eksikler | PRD'de "Gelecek Surum" dokumante ✓ |

---

## SAVUNMA GELECEK SURUM (PRD'ye eklenecek)

2 gunluk sprinte sigmayan ama urun yol haritasina eklenmesi gereken ozellikler:

| # | Ozellik | Oncelik | Efor |
|---|---------|---------|------|
| 1 | Takim omru takibi (tool life management) | YUKSEK | 1 hafta |
| 2 | SPC gercek zamanli kontrol kartlari (7 tip) | YUKSEK | 1 hafta |
| 3 | MSA / Gage R&R analizi | YUKSEK | 3-5 gun |
| 4 | Ozel proses kontrol (kaynak/isil islem parametreleri) | ORTA | 1 hafta |
| 5 | Musteri emanet malzeme (CFM) takibi | ORTA | 3 gun |
| 6 | Teslim dosyasi formal release workflow | ORTA | 3 gun |
| 7 | FAIR balon cizim esleme | DUSUK | 5 gun |
| 8 | Dinamik rol/permission olusturma (tenant admin) | ORTA | 1 hafta |
| 9 | Trial → Ucretli gecis odeme akisi | YUKSEK | 1 hafta |
| 10 | PostgreSQL RLS (Row-Level Security) | DUSUK | 3 gun |

---

## NOTLAR

- Her sektor senaryosu MD + Playwright olarak yazilacak
- Senaryo icinde ROL TESTI var: farkli roller ile login edip dogru ekranlari gorduğunu dogrula
- Basarisiz adimlar bug olarak kaydedilir
- Savunma eksikleri "yapilmiyor" degil "planli" — PRD'de versiyonlanacak
- Tenant user UI basit ama fonksiyonel — wizard/onboarding sonraki sprint
