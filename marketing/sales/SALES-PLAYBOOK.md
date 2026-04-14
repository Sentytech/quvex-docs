# Quvex Sales Playbook

> Versiyon: 1.0
> Tarih: 2026-04-12
> Sahibi: Sales & Customer Success
> Hedef kitle: Quvex satis ekibi, partner satis temsilcileri, kurucular
> Tamamlayici dokumanlar:
> - `SALES-PITCH-DECK.md` (slide anlatim)
> - `DEMO-SCRIPT.md` (15/30dk demo akisi)
> - `PRICING-STRATEGY.md` (fiyat detay + reseller)
> - `SALES-OBJECTION-LIBRARY.md` (itiraz cep kartti)
> - `EMAIL-DRIP-CAMPAIGN.md` (14 gun trial nurturing)
> - `derin-rakip-karsilastirma.md` (rekabet derinlik)

Bu playbook **tek master dokuman**. Lead bulma → demo → kapanis → onboarding handoff. Sayisal hedef: **Yil 1 = 1.000 odeme yapan musteri, $1.8M ARR, %25 trial-to-paid donusum, %10 yillik churn.**

---

## BOLUM 1 — Quvex Overview

### Elevator Pitch (15 saniye)

> *"Quvex, Turkiye'nin KOBI uretim sektorune ozel tasarlanmis bulut tabanli ERP'sidir. Mehmet Bey 5 dakikada kurar, 18 sektor sablonundan kendi sektorunu secer, atolyede tablete bakar — kalite/uretim/stok/satis tek yerden. Logo ve Mikro'nun yapamadigi sey: sektor disiplini (AS9100, HACCP, IATF, CE), mobil-once tasarim, real-time TV pano, WhatsApp bildirimi ve KVKK uyumlu schema-per-tenant izolasyon. Aylik 1.499 TL'den baslar."*

### Top 5 Ayirt Edici Ozellik

| # | Ozellik | Rakipte var mi? | Quvex farki |
|---|---------|-----------------|-------------|
| 1 | **5 dakikada onboarding + 8 sektor demo data** | ❌ Logo/Mikro/SAP 2-6 ay danismanlik | Mehmet Bey kendi kuruyor, ASELSAN/ROKETSAN demo dataset hazir |
| 2 | **18 sektor disiplin paketi** (AS9100/IATF/HACCP/CE/AWS D17) | ⚠️ Ek modul, ek lisans | Sablon dahil — savunma, gida, kaynak, makine, tekstil her sey hazir |
| 3 | **Real-time TV Pano + WhatsApp 8 sablon** | ❌ Yok | Atolyede 50" TV'de canli OEE, patron WhatsApp'tan onayliyor |
| 4 | **ShopFloor Terminal — 80px buton, eldivenle calisir** | ❌ Masaustu zorunlu | Veli Usta tablete bakip is emrini bitiriyor, foto cekip kalite kayit |
| 5 | **Multi-tenant + KVKK uyumlu** (schema-per-tenant + AES-256-GCM) | ⚠️ SAP'ta var, fiyati 100x | Savunma sanayi tedarikcisi gonul rahatligi ile kullanir |

### Ideal Customer Profile (ICP) — Genel

- **Sektor:** Uretim KOBI (10-100 kisi)
- **Cografya:** Turkiye (Istanbul/Bursa/Ankara/Izmir/Konya/Kocaeli/Gaziantep ilk dalga)
- **Karar verici:** Patron / yonetici ortagi (Mehmet Bey persona)
- **Aci noktalari:** Excel/Logo iliski karmasasi, kalite belgesi denetim stresi, mobil/atolye gorunurluk eksikligi, KVKK panigi
- **Butce sinyali:** Aylik 1.500-12.000 TL ERP harcamasi yapabiliyor (eski Logo/Mikro lisans bedeli)
- **Tetikleyici olaylar:** Yeni mudahale (ISO/AS9100 denetimi), yeni musteri (otomotiv yan sanayi), yangin (Excel kayboldu), buyume (10 → 30 kisi)

---

## BOLUM 2 — 3 Hedef Musteri Profili (ICP Detay)

### ICP-1: 10-50 kisilik CNC / Savunma Atolyesi

| Boyut | Detay |
|-------|-------|
| Firma buyuklugu | 10-50 kisi, yillik ciro 5-50 milyon TL |
| Sektor | CNC machining, savunma sanayi tedarikcisi (Tier 2/3) |
| Karar verici | Patron (50-65 yas, makine muhendisi geçmis), Kalite Muduru (35-50 yas) |
| Lokasyon | Bursa, Eskisehir, Ankara OSTIM, Kocaeli |
| Sertifika ihtiyaci | **AS9100 zorunlu**, ISO 9001, NADCAP (bazilarinda) |
| Mevcut yazilim | Excel + Logo Tiger + AutoCAD + el yazisi formlar |
| Pain points | (1) AS9100 denetimi 6 ay sonra, FAI/PPAP/MRB doldurmak korkutuyor (2) ASELSAN'a 3000 parca teslim, lot izlenebilirlik kanit istenecek (3) Veli Usta CNC basinda, kagit fiston is emri kaybediyor (4) Patron WhatsApp'tan teklif onayliyor, sistem yok (5) "5 yil veri sakla" zorunlulugu var, Excel guvenli mi? |
| Quvex cozumu | (1) AS9100 modul: NCR, CAPA, FAI, PPAP, MRB hazir (2) Forward/backward trace lot bazli (3) ShopFloor Terminal tablette is emri (4) WhatsApp 8 sablon: teklif onay, is emri tamam, kalite ret (5) AES-256-GCM + 7 yil arsivleme |
| Plan onerisi | **Pro (3.999 TL)** veya Enterprise (savunma sanayi %15 indirim) |
| Kapanis suresi | 21-45 gun (denetim acilis varsa 7 gun) |
| ROI mesaji | "AS9100 denetim hazirligi 6 hafta → 1 hafta. NCR doldurma 30 dk → 3 dk. ASELSAN'a teslim red orani %4 → %0.5." |

### ICP-2: 30-100 kisilik Gida Uretici

| Boyut | Detay |
|-------|-------|
| Firma buyuklugu | 30-100 kisi, yillik ciro 20-200 milyon TL |
| Sektor | Sut urunleri, biskuvi, dondurulmus gida, baharatlik, glikoz/sirup |
| Karar verici | Patron (60+ yas, ailesinden ikinci nesil), Kalite/Gida muhendisi (28-40 yas) |
| Lokasyon | Konya, Gaziantep, Bursa, Izmir |
| Sertifika ihtiyaci | **HACCP zorunlu**, ISO 22000, BRC/IFS (ihracat varsa), helal sertifikasi |
| Mevcut yazilim | Excel + Mikro + manuel sicaklik kayit defteri |
| Pain points | (1) Migros denetcisi 2 hafta sonra geliyor, CCP kayitlari kagitta (2) Lot izleme yok — recall olsa kim ne aldi bilemeyecek (3) Sicaklik ölçümü el yazisi, denetlende guvenilirlik dusuk (4) BIM'e gonderilen 1 lot bozuk cikti, geri cagirmak 3 hafta surdu (5) ihracatta CE/halal belgesi entegrasyonu yok |
| Quvex cozumu | (1) HACCP/CCP modulu: 7 CCP hazir, sicaklik ölçümlerini tablette gir, otomatik NCR (2) RecallEvent 7-step wizard, forward trace BFS — saat 1'de tum bayilere SMS (3) ShopFloor sicaklik ölçüm girisi 80px (4) Recall trial: 3 hafta → 4 saat (5) Ihracat icin BRC/IFS sablonu eklendi |
| Plan onerisi | **Pro (3.999 TL)** — HACCP/Recall ozellikleri Pro'da |
| Kapanis suresi | 14-30 gun (denetim baskisi varsa 5 gun) |
| ROI mesaji | "HACCP denetim hazirligi 4 hafta → 3 gun. Recall sirasinda etkilenen lot bulma 3 hafta → 2 saat. Migros'tan red %2 → %0.3." |

### ICP-3: 20-80 kisilik Tekstil / Hazir Giyim

| Boyut | Detay |
|-------|-------|
| Firma buyuklugu | 20-80 kisi, yillik ciro 10-100 milyon TL |
| Sektor | Hazir giyim, ev tekstili, yatak tekstili, fason imalat |
| Karar verici | Patron (45-60 yas), satis muduru (esi/cocugu), uretim sefi |
| Lokasyon | Istanbul (Merter, Zeytinburnu), Denizli, Bursa, Tekirdag |
| Sertifika ihtiyaci | OEKO-TEX, GOTS (organik), AQL kalite |
| Mevcut yazilim | Excel + bazi tekstil ozel yazilimi (eski) + manuel kesim plani |
| Pain points | (1) Bedne×Renk matrisi: S/M/L × 5 renk = 15 SKU, Excel'de duzenleme cinnet (2) LCW siparis yarisi web yarisi magaza, stok tek yerden gorulmuyor (3) Fasoncuya 3000 parca verildi, kac geldi bilinmiyor (4) Trendyol/Hepsiburada/magaza/B2B 4 kanal var, sayim yok (5) AQL sample alimi manuel, denetimde patlak veriyor |
| Quvex cozumu | (1) **ProductVariant**: bulk-generate (S/M/L × Beyaz/Mavi/Siyah = 15 SKU otomatik) (2) Multi-channel stok (Trendyol/Web/Magaza/B2B) (3) Fason is emri + barkod takip (4) Konsolide stok ekrani (5) AQL sample plan otomatik |
| Plan onerisi | **Pro (3.999 TL)** |
| Kapanis suresi | 14-21 gun |
| ROI mesaji | "SKU yonetimi 6 saat/hafta → 30 dk. Stok hatasi %12 → %2. Sezonluk koleksiyon hazirligi 3 gun → 4 saat." |

---

## BOLUM 3 — 18 Sektor Hizli Pitch

> Her sektor icin: 1 cumle pain + 1 cumle Quvex + niş modul ismi
> Sektor skorlari: Sprint 11 sonu UX audit (10 uzerinden)

### Savunma Sanayi (10 sektor)

1. **CNC Machining (6.4)** — Pain: AS9100 FAI/PPAP doldurmak ay aliyor. Quvex: NCR/CAPA/FAI/PPAP modulu hazir, lot trace BFS, ShopFloor terminal eldivenle. → **AS9100 modul**
2. **Kaynak (5.7)** — Pain: AWS D17.1 WPS/WPQR Excel'de. Quvex: WPS/WPQR + Welder Certification + sertifika expiry alarmi. → **WPS/WPQR modulu**
3. **Isil islem (5.5)** — Pain: AMS 2759 firinin sicaklik chart'i kagit. Quvex: Sicaklik logger entegrasyonu + AMS 2759 sablon + lot trace. → **HeatTreatment modul**
4. **Yuzey islem (5.4)** — Pain: MIL-PRF kalinlik raporlama manuel. Quvex: Coating thickness + MIL-PRF/MIL-DTL/MIL-A sablon. → **Coating modul**
5. **Kompozit (5.3)** — Pain: NADCAP kalite kayit ezici. Quvex: NADCAP audit modul + autoclave cycle + ply layout. → **Composite modul**
6. **Elektronik PCB (5.2)** — Pain: IPC-A-610 kayit + counterfeit risk. Quvex: IPC-A-610 inspection + serial trace + counterfeit register. → **PCB Quality modul**
7. **NDT/Tahribatsiz Test (5.1)** — Pain: NDT operator sertifika takibi. Quvex: NDT method (UT/RT/MT/PT) + operator cert expiry. → **NDT modul**
8. **Optik (5.0)** — Pain: Optik kalite (lens/yansıma) Excel. Quvex: Optical inspection sablon + ISO 10110. → **Optical modul**
9. **Dokum (4.9)** — Pain: Dokum hatasi (porozite/cekme) kayit yok. Quvex: Casting defect register + heat lot trace. → **Casting modul**
10. **Kalip (4.8)** — Pain: Kalip omru bilinmiyor. Quvex: MoldInventory shot counter + bakim esigi. → **MoldInventory**

### Sivil (8 sektor)

11. **Otomotiv yan sanayi (6.8)** — Pain: IATF 16949 PPAP, Ford'a 8D raporu. Quvex: IATF + APQP + 8D + PPAP modul. → **Automotive QMS**
12. **Plastik (5.6)** — Pain: Kalip durumu, granul lot, cevrim suresi. Quvex: MoldInventory + injection cycle + granul lot. → **MoldInventory**
13. **Gida (5.0)** — Pain: HACCP CCP, recall korkusu. Quvex: HACCP modul + RecallEvent 7-step wizard. → **HACCP/Recall**
14. **Tekstil (4.6)** — Pain: Beden×Renk matrisi. Quvex: ProductVariant bulk-generate. → **ProductVariant**
15. **Metal esya (5.8)** — Pain: EN 1090 CE markalama. Quvex: EN 1090 sablon + WPS uyum + tracability. → **EN 1090 modul**
16. **Makine imalat (5.0)** — Pain: CE Teknik Dosya. Quvex: CE Technical File 19 alan + machinery sektor profili. → **CE Technical File**
17. **Medikal cihaz (5.3)** — Pain: ISO 13485 + UDI. Quvex: ISO 13485 modul + UDI tracking + DHF. → **Medical Device QMS**
18. **Mobilya (5.4)** — Pain: Sezonluk koleksiyon, fason takip. Quvex: Variant + fason is emri + montaj plani. → **Furniture Variant**

**TOP 5 oncelik sirasi (en yuksek pazar potansiyeli):** Otomotiv yan sanayi → CNC Machining → Mobilya → Tekstil → Gida

---

## BOLUM 4 — Pricing Logic

> **Tutarsizlik kararim:** Landing site fiyatlari (1.499/3.999/7.999 TL) gecerli kabul edildi. Sebep: KOBI patronu icin "1.499" psikolojik olarak "2.000 TL altinda" hissi verir; "3.000 TL" demek satin alma direnci uretir. PRICING-STRATEGY.md tamamen yenilenip TL bazli yapildi, USD ekvivalan parantezde gosteriliyor (~$50/$133/$267 @ 30 TL/USD).

### 4.1 3 Plan Ozet (TL Birincil)

| Plan | Aylik (TL) | Yillik (TL, %20) | USD ekv. | Kullanici | ShopFloor | Hedef |
|------|------------|------------------|----------|-----------|-----------|-------|
| **Starter** | **1.499 TL** | 14.390 TL | ~$50 | 5 | 1 makine | Mikro firma, ilk ERP |
| **Professional** ⭐ | **3.999 TL** | 38.390 TL | ~$133 | 15 | 5 makine | KOBI flagship — sektor disiplinli |
| **Enterprise** | **7.999 TL** | 76.790 TL | ~$267 | 30 (sinirsiz ek) | Sinirsiz | Buyuk/holding/savunma |

**Detaylar PRICING-STRATEGY.md'de.** Bu bolum sadece satis ekibi cep ozeti.

### 4.2 Plan Secim Karari (Quick Decision Tree)

```
Musteri kac kisi?
├── 1-10 kisi
│   ├── Sektor disiplini? (AS9100/HACCP/CE)
│   │   ├── Hayir → Starter (1.499 TL)
│   │   └── Evet → Professional (3.999 TL)
│   └── Sadece teklif-fatura? → Starter
├── 10-50 kisi
│   └── Default: Professional (3.999 TL) — En cok satan
├── 50+ kisi
│   ├── Tek tenant? → Professional veya Enterprise
│   └── Coklu sirket / holding? → Enterprise (7.999 TL)
└── Savunma sanayi tedarikcisi → Pro/Enterprise + %15 indirim
```

### 4.3 Trial Kosullari

- **14 gun ucretsiz**, kredi karti yok
- Tum ozellikler acik (Pro plan seviyesi)
- Otomatik freeze gun 14'te (ucretlendirme yok)
- Veriler **30 gun korunur** (geri donusum penceresi)
- 1 kez 7 gun uzatma izni (satis onayi ile)

### 4.4 Indirim Politikasi (sınırlar)

| Indirim turu | Miktar | Yetki | Kosul |
|--------------|--------|-------|-------|
| Yillik odeme | %20 | Otomatik | Pesin yillik |
| Egitim/MYO/Universite | %50 | Satis muduru | Belge |
| Savunma sanayi | %15 | Satis muduru | Tedarikci sertifikasi (ASELSAN/ROKETSAN/HAVELSAN/BAYKAR vs.) |
| TUBITAK/KOSGEB <2 yil | %50 ilk yil | Satis muduru | Belge |
| Reseller komisyon | %30-40 | Otomatik (program) | Partner anlasmasi |
| Founders Club ilk 100 | %30 hayat boyu | Otomatik | Ilk 100 musteri |
| Volume 5+ tenant | %10 | Satis muduru | Kontrat |
| Volume 10+ tenant | %15 | Satis muduru | Kontrat |
| Volume 25+ tenant | %25 | CTO/CEO | Stratejik hesap |
| Pro plan ek pazarlik | %5 | Satis temsilcisi | Yillik odemede |

**Kural:** Starter plani **pazarlik yok**. Pro %5'e kadar yillik kosulla. Enterprise her zaman custom quote.

### 4.5 Odeme

- **Saglayicilar:** PayTR (birincil), Iyzico (yedek)
- **Kabul:** Kredi kart (Visa/Master/Troy), banka havalesi, ATM
- **Vade:** Aylik (otomatik tahsilat), yillik (pesin)
- **KDV:** %20 dahil — fiyatlar **KDV haric**, fatura kdv ile kesilir
- **Kurumsal odeme:** Yillik kontrat + havale + cek (Enterprise)
- **Iptal:** Aylik abonelik anlik iptal, yillik pro-rata iade ilk 30 gunde

---

## BOLUM 5 — 18 Itiraz + Cevap (Ozet)

> Tam Library: `SALES-OBJECTION-LIBRARY.md`
> Format: Empati → Reframe → Kanit → Aksiyon

| # | Itiraz | Hizli Cevap (1 satir) |
|---|--------|----------------------|
| 1 | "Cok pahali" | Ayda 1.499 TL = gunluk 50 TL = bir personelin saat ucreti %5'i. ROI ortalama 6 ay. |
| 2 | "Mevcut Logo/Excel'imiz var" | Logo'yu muhasebede tut, atolye ve kalite Quvex'te. Paralel kullanim, 2 hafta migration kit. |
| 3 | "Internet kesilirse ne olur?" | ShopFloor offline buffer + WhatsApp fallback. Kayit kaybolmaz, bagdaginca senkron. |
| 4 | "Veri guvenligi nasil?" | Schema-per-tenant + AES-256-GCM + KVKK uyum + Turkiye host + Enterprise on-premise opsiyon. |
| 5 | "Personellerim kullanamaz" | ShopFloor 80px buton, eldivenle calisir. Veli Usta (50+) icin tasarlandi, 1 saatte egitim. |
| 6 | "Mobilden calisir mi?" | Quvex Mobile (iOS/Android) + 8 persona dashboard. Patron her yerden onay verir. |
| 7 | "E-Fatura/GIB uyumu var mi?" | Evet, otomatik e-fatura/e-arsiv, GIB onayli, KDV otomatik hesap. |
| 8 | "Eski verilerimiz nasil gelecek?" | Excel/Logo/Mikro export → Quvex import wizard. Pro/Enterprise icin ucretsiz, Starter $199 tek seferlik. |
| 9 | "AS9100/HACCP/CE belgemiz icin uygun mu?" | Modulleri sertifika ekipleri ile birlikte tasarlandi. ASELSAN/Migros tedarikcileri kullaniyor. |
| 10 | "Egitim destegi var mi?" | 5 dk onboarding + Turkce video + canli destek. Pro: 2 saat canli, Enterprise: 8 saat. |
| 11 | "Multi-tenant mi yani veriniz herkes goruyor mu?" | Schema izolasyon + cross-tenant blocking. Bankacilik standardi. Hicbir tenant baska tenant verisini goremez. |
| 12 | "Sirketimde IT yok, kim yonetir?" | Cloud SaaS — IT gerekmez. Quvex update'leri otomatik, backup otomatik. Enterprise icin dedike hesap muduru. |
| 13 | "Sektorume ozel olur mu?" | 18 sektor sablonu, smart defaults. CNC/Gida/Tekstil/Otomotiv hazir. Sizinki yoksa 2 hafta icinde uyarlariz. |
| 14 | "Bekleyelim, sonra bakariz" | 14 gun trial bedava. 3 dakikada karar veriliyor (Mehmet Bey persona test). Bekleyecekseniz bile bugun deneyin. |
| 15 | "Logo'nun ek modullerini alirim olur" | Logo ek modul = 50K TL + 4 ay danismanlik + lisans. Quvex Pro = 4K TL/ay, 5 dakika. Hesap eden zaten geldi. |
| 16 | "Sertifika denetciniz onayladi mi?" | AS9100 — TUV NORD, BSI ile uyum testi yapildi. HACCP — Migros denetcisi referans. Liste verebilirim. |
| 17 | "Sahip-yonetici degistirirsek?" | Cloud SaaS, hesap devri 5 dakika. Veri sizin (export her zaman acik). Cikis kapisi acik. |
| 18 | "Buyukse maliyet artar mi?" | Plan icinde sınırsız siparis/urun. Sadece kullanici ve makine sayisi sınırı. Buyudukce upgrade et, anlik. |

---

## BOLUM 6 — Demo Akisi

> Detayli script: `DEMO-SCRIPT.md` (mevcut, bu bolum onun uzerine inşa edilmis)

### 6.1 Pre-Demo Discovery Call (15 dk)

**Amac:** Demo'da hangi modulu/sektoru gosterecegimi netlestir.

**6 Anahtar Soru:**

1. *"Su an uretim/satis/stok takibi nasil yapiliyor?"* (Excel mi, Logo mi, manuel mi)
2. *"Firmaniz hangi sektorde, kac kisi calisiyor?"* (sablon + plan secimi)
3. *"Hangi sertifikalara sahipsiniz veya ihtiyac duyuyorsunuz?"* (AS9100/HACCP/IATF/CE)
4. *"En sik karsilastiginiz problem ne?"* (gercek pain point)
5. *"Atolyede / sahada calisanlariniz tablete bakar mi?"* (ShopFloor uygun mu)
6. *"Karar vereniz kim, ne zaman karar verebilirsiniz?"* (BANT — Budget/Authority/Need/Timeline)

**Discovery sonrasi:** 15dk demo mu 30dk demo mu, hangi sektor, hangi modul karari ver.

### 6.2 15 Dakika Demo (Hizli Tetikleme)

| Dk | Konu | Vurgu |
|----|------|-------|
| 0-2 | Hosgeldin + Mehmet Bey hikayesi | Empati: "Sizin gibi 50+ KOBI patronu Excel'den geldi" |
| 2-4 | 5 dakika onboarding (gercek zamanli) | Sektor sec → demo data hazir → tek tikla giris |
| 4-7 | Sektor demo (CNC/Gida/Tekstil) | Gercek dataset (ASELSAN/Migros/LCW) |
| 7-10 | ShopFloor tablete demo | Veli Usta is emri, foto cek, kalite kayit |
| 10-12 | WhatsApp bildirim canli | Patron telefonuna anlik bildirim |
| 12-14 | Real-time TV pano | OEE canli, atolye verimliligi |
| 14-15 | Trial kayit + sonraki adim | "Bugun deneyebilirsiniz, bedava" |

### 6.3 30 Dakika Demo (Derin Inceleme)

15 dk demo + ek 15 dk:
- Ek 5 dk: Niş modul (HACCP/AS9100/ProductVariant — sektore gore)
- Ek 5 dk: Mobil persona dashboard (patron + sef + operator)
- Ek 3 dk: Multi-tenant + KVKK + on-premise (Enterprise icin)
- Ek 2 dk: Soru-cevap

### 6.4 Sektor Bazli Demo Varyasyonlari

**CNC/Savunma demo flow:**
1. CNC sablonu yukle (ASELSAN/ROKETSAN/HAVELSAN/BAYKAR/FNSS demo data)
2. Yeni siparis: "ASELSAN braket 1000 adet"
3. Is emri olustur → ShopFloor terminale dus → Veli Usta DMG MORI'da uretiyor
4. NCR olustur (kalite hatasi simulasyonu) → CAPA aksiyon
5. Lot trace: "Bu braket hangi cubuk celiklen geldi?"
6. AS9100 FAI doldurma demo
7. WhatsApp: "Uretim tamam, kalite onayli, sevkiyat hazir"

**Gida demo flow:**
1. Gida sablonu (Migros/BIM/CarrefourSA + Yogurt/Biskuvi + Pastor/Dolum)
2. Yeni lot: "Yogurt LOT-2026-04-12-001"
3. HACCP CCP girdi (sicaklik, pH) — tablette
4. Anomali — sicaklik dustu → otomatik NCR → Recall wizard
5. Recall trial: "Bu lot hangi bayilere gitti?" → 7-step wizard → SMS/email
6. Migros denetim raporu PDF

**Tekstil demo flow:**
1. Tekstil sablonu (KOTON/LCW/MAVI + Gomlek/Bluz)
2. Yeni urun: "Erkek gomlek slim fit"
3. ProductVariant bulk: S/M/L/XL × Beyaz/Mavi/Siyah/Yesil = 16 SKU 30 saniyede
4. LCW siparis: "1000 adet, Trendyol kanaliyla"
5. Fason is emri: kesim yer, dikim yer, kalite kontrol
6. Multi-channel stok ekrani (Trendyol/Web/Magaza/B2B)

### 6.5 Post-Demo Follow-Up

**0. saat:** Tesekkur emaili + trial kayit linki + demo recording
**1. gun:** "Ilk login yapildi mi?" check-in
**3. gun:** Sektor ozel ipucu video (3 dk)
**5. gun:** Case study (sektor uyumlu)
**7. gun:** Karar destek call teklifi (opsiyonel)
**13. gun:** Yillik %20 indirim hatirlatma
**14. gun:** Plan secimi + onboarding handoff

> Detayli email akisi: `EMAIL-DRIP-CAMPAIGN.md`

---

## BOLUM 7 — CRM Sureci

### 7.1 Lead Lifecycle

```
Lead → MQL → SQL → Opportunity → Closed Won/Lost
```

| Asama | Tanim | Kriter | Aktivite | Hedef sure |
|-------|-------|--------|----------|------------|
| **Lead** | Ilk temas (form, etkinlik, referans) | E-mail veya tel + sektor bilgisi | Otomatik welcome email | 0 |
| **MQL** (Marketing Qualified) | Ilgi gosterdi (broşür indirdi, demo izledi, blog okudu) | Lead score ≥ 30 | Demo davetiyesi | 1-3 gun |
| **SQL** (Sales Qualified) | Discovery call yapildi, BANT dogrulandi | Budget + Authority + Need + Timeline | Demo schedule | 3-7 gun |
| **Opportunity** | Demo izledi, trial baslatti veya teklif istedi | Trial kayit veya RFP | Pipeline'a ekle, deal value tahmini | 7-21 gun |
| **Closed Won** | Sozlesme imzalandi, ilk odeme alindi | Stripe/PayTR confirmation | CS handoff | 14-45 gun (toplam) |
| **Closed Lost** | Vazgecti veya rakibi sectil | Lost reason etiketle | Win-back kampanyaya gir | - |

### 7.2 Lead Scoring (0-100)

| Sinyal | Puan |
|--------|------|
| Form doldurma | +20 |
| E-book indirme | +10 |
| Webinar katilim | +15 |
| Demo izleme (kayit) | +25 |
| Demo izleme (canli) | +35 |
| Discovery call rezerve | +30 |
| Sektor: Savunma/Otomotiv/Gida | +15 |
| Firma buyuklugu 30+ | +10 |
| Patron / yonetici unvani | +20 |
| Karar verici dogrulandi | +25 |
| Trial kayit | +40 |
| Trial gun 3 aktivite (>5 islem) | +30 |
| Pricing sayfasinda 5+ dakika | +15 |
| Email yanit verme | +10 |
| WhatsApp yaniti | +15 |
| Mevcut sertifika (AS9100/HACCP/IATF) | +20 |

**Esikler:**
- 0-29: Cold (drip campaign)
- 30-59: MQL (sales follow-up)
- 60-79: SQL (active outreach)
- 80+: Hot (1 saatte ara)

### 7.3 Lost Reason Taxonomy (10 madde)

1. **Fiyat** — Pahali bulundu (%30 tahmin)
2. **Mevcut sistem yeterli** — Logo/Mikro/Excel ile devam
3. **Zamanlama uygunsuz** — Suanda sira degil ("3 ay sonra")
4. **Sektor uyumsuz** — Quvex sektorlerinde yok (yeni sablon yapilana kadar)
5. **Decision-maker bulunamadi** — Patron erisilemedi
6. **Rakibi sectil** — Logo, Mikro, Netsis, SAP B1, Odoo, custom
7. **Veri migrasyon korkusu** — Eski veri tasinamaz endisesi
8. **Cloud guvensizlik** — On-premise istiyor (Enterprise satilamadi)
9. **Internal kapasitesizlik** — Kurum ici resource yok
10. **Anlasilmadi** — Demo'yu iyi anlatamadik (eğitim gerekli)

> **Aksiyon:** Lost reason raporu **haftalik review**, top 3 sebebi sales enablement ve product team'e geri besle.

### 7.4 Lead → MQL → SQL Donusum Hedefleri

| Donusum | Sektor std | Quvex hedefi |
|---------|-----------|--------------|
| Lead → MQL | %25-35 | %35 |
| MQL → SQL | %30-40 | %40 |
| SQL → Opportunity | %50-60 | %60 |
| Opportunity → Closed Won | %20-25 | %25 |
| Trial → Paid | %15-20 | %25 |
| Genel (lead → paying) | %1-2 | %2.1 |

---

## BOLUM 8 — Rekabet Battlecard (Ozet)

> Detayli analiz: `derin-rakip-karsilastirma.md`

### Quick Battlecard

| Rakip | Onlarin gucu | Onlarin zaafi | Quvex koz | Ne zaman onlar kazanir |
|-------|-------------|---------------|-----------|------------------------|
| **Logo Tiger** | Marka taninirligi, muhasebe entegre, Turkiye %40 pazar payi | Mobil zayif, sektor sablonu yok, 2-6 ay kurulum, kullanici basli ucretlendirme | Quvex sektor disiplinli + 5 dk kurulum + mobil-once + sabit fiyat | Muhasebe + ERP tek paket istiyorsa |
| **Mikro Y** | Fiyat orta, KOBI'ye yakın, bayi agi | Sektor sablonu yok, mobil cok zayif, eski UI | Quvex modern UI + sektor + WhatsApp + TV pano | Cok kucuk firma (5 alti) |
| **Netsis** | Buyuk firma deneyimi, finansal modul guclu | Cok karmasik, kucuk firmaya ezici, mobil yok | Quvex hafiflik + sektor + KOBI dostu | 200+ kisi, kompleks finansal yapi |
| **ETA** | Klasik, eski musteriler sadik | UI 1990, mobil yok, modern entegrasyon yok | Quvex modernlik + bulut + mobil | Mevcut ETA musterisi degisim istemeyen |
| **SAP Business One** | Kurumsal taninirlik, derin ozellik | Cok pahali (200K+ TL), 6-18 ay kurulum, danismanlik bagimliligi | Quvex 1/17 fiyat + 5 dk kurulum | Coklu sirket + uluslararasi operasyon |
| **Odoo (self-host)** | Acik kaynak, ucretsiz cekirdek | IT bagimliligi, Turkce eksik, e-fatura yok, sektor yok | Quvex Turkce + e-fatura + sektor + IT gerektirmez | IT ekibi guclu, butce yok |

### Quvex Ne Zaman ONERILMEZ (durustluk)

- **5 alti calisan + ciro <2M TL** — Excel yetiyor, henuz ERP zorunlu degil
- **Cok ileri finansal konsolidasyon** (15+ sirket holding) — SAP B1 daha uygun
- **Sadece muhasebe ihtiyaci** (uretim/atolye yok) — Logo yetiyor
- **24/7 7/24 fiziksel destek garanti istegi** — Enterprise plan + ek SLA, yine de bazilarini karsilamayabilir
- **Bagimsiz ofkeli IT departmani** — Customizasyon kontrolu istiyorsa, Odoo daha esnek

> **Durustluk satisi guc verir.** Yanlis musteri = churn = kotu referans. Hayir demek bilinmek zorunda.

---

## BOLUM 9 — Kapanis Teknikleri

### 9.1 Trial → Paid Donusum Taktikleri

1. **Erken Aktivasyon Push** — Gun 1: Ilk customer/product ekleme zorunlu hissi yarat ("Ilk 5 dakika kritik")
2. **Yarim Mid-Trial Call** — Gun 7: Customer Success'in arayip "Sorun var mi?" demesi (5dk)
3. **ROI Hesabi** — Gun 9: Kisisellestirilmis ROI raporu ("Sizin sektorunuzde 6 ayda amorti")
4. **Yillik Indirim Tetigi** — Gun 11: "Yillik odeme %20 indirim, ek 2 ay bedava"
5. **Last Chance Urgency** — Gun 13: "Yarin trial bitiyor, bugun karar verirseniz Founders Club"
6. **Win-Back** — Gun 14+1: "Verileriniz 30 gun korunuyor, donun"

### 9.2 Demo → Trial Donusum

- **Demo sonu 5 dakika icinde** trial kaydi linki gonder (sicakken)
- "Burada otururken trial baslatabilirim, gosterirsiniz" — buyuk donusum yarayan
- Trial kayit formunu **3 alana** indirgedik (email, telefon, sirket)
- WhatsApp ile trial onay linki — direkt clickable

### 9.3 "Simdi Al" Sebepleri (Urgency Triggers)

- **Founders Club %30 hayat boyu** — Ilk 100 musteri
- **Yillik odeme %20 indirim** — Bugun karar verirsen
- **Sertifika denetimi yaklasiyor** — Mevcut sektor pain'i kullan
- **Yeni musteri kazanildi** — "Tedarikciniz X bunu kullaniyor"
- **Yil sonu butce** — Aralik kapanisinda butce kullanma baskisi
- **Vergi avantaji** — Yillik odemenin gider gosterimi

### 9.4 Negotiation Sinirlari

| Plan | Standart fiyat | Min teklif (yillik kosulla) | Yetki |
|------|---------------|------------------------------|-------|
| Starter | 1.499 TL | 1.499 TL (pazarlik yok) | Hicbiri |
| Professional | 3.999 TL | 3.799 TL (-%5) | Satis temsilcisi |
| Pro yillik | 38.390 TL | 36.470 TL (-%5) | Satis temsilcisi |
| Enterprise | 7.999 TL | 6.799 TL (-%15) | Satis muduru |
| Enterprise yillik | 76.790 TL | 65.270 TL (-%15) | Satis muduru |
| 25+ tenant | Custom | -%25 | CTO/CEO |

**Asla:** Ek modul bedava verme. Trial 1 ay uzatma. Ucretsiz egitim ekstrası (paket disi).
**Her zaman:** Yillik odemeyi tesvik et — cash flow + churn dusurur.

---

## BOLUM 10 — Onboarding Handoff (Sales → Customer Success)

### 10.1 Handoff Anaforma (kapanis sonrasi 24 saat icinde)

| Bilgi | Kaynak | CRM alani |
|-------|--------|-----------|
| Firma + adres + vergi no | Sozlesme | Account |
| Sektor + buyukluk + sablon secimi | Discovery | Account.Sector |
| Karar verici + birincil kullanici | Discovery | Contact (Primary/Decision) |
| Ana pain point + amaclar (top 3) | Discovery | Account.PainPoints |
| Mevcut sistem (Logo/Excel/Mikro?) | Discovery | Account.LegacySystem |
| Migration ihtiyaci | Discovery | Account.MigrationNeeded |
| Sertifika hedefi (AS9100/HACCP/CE) | Discovery | Account.Certification |
| Plan + odeme tipi + indirim | Sozlesme | Subscription |
| Beklenen go-live tarihi | Discovery | Account.GoLiveDate |
| Risk faktorleri | Sales notu | Account.Risks |

### 10.2 Ilk 30 Gun Playbook

| Hafta | Faaliyet | Sahip | Cikti |
|-------|----------|-------|-------|
| **Hafta 0 (gun 0-2)** | Welcome call + onboarding plani | CSM | Onboarding plan dokumani |
| **Hafta 1 (gun 3-7)** | Sektor sablonu kurulum + demo data temizleme | CSM + musteri | Live data ile baslangic |
| **Hafta 1** | Master data import (Excel/Logo/Mikro export) | Migration uzman | Customers, products, BOM yuklendi |
| **Hafta 2 (gun 8-14)** | Kullanici egitimi (Pro 2 saat / Enterprise 8 saat) | Egitim uzman | Eğitim sertifikasi + recording |
| **Hafta 2** | ShopFloor terminal kurulum | Teknik destek | 1+ tablette canli |
| **Hafta 3 (gun 15-21)** | Ilk gercek is emri + kalite kayit | CSM (gozetim) | Patron WhatsApp bildirimi aldi |
| **Hafta 3** | Sektor modul aktivasyon (HACCP/AS9100/CE) | Uzman + musteri | Modul calisir |
| **Hafta 4 (gun 22-30)** | Aktivasyon review + ROI hesabi | CSM | Health score raporu |

### 10.3 Aktivasyon Kriterleri (Sprint 16 T10 Funnel ile uyumlu)

> Funnel asamalari: Trial Started → Activated → Engaged → Converted → Power User

**"Activated" kabul edilmek icin (gun 14):**
- ✅ 5+ customer eklendi
- ✅ 5+ product eklendi
- ✅ 1+ siparis olusturuldu
- ✅ 1+ is emri tablette acildi
- ✅ 1+ kalite kayit (NCR/HACCP)
- ✅ 1+ kullanici giris yapti (patron disinda)

**"Engaged" (gun 30):**
- ✅ Yukaridaki + 30+ gunluk islem
- ✅ Sektor modul aktif kullanim
- ✅ Mobil app indirildi
- ✅ WhatsApp bildirim aktive

**"Power User" (gun 90):**
- ✅ 100+ siparis
- ✅ 3+ kullanici aktif
- ✅ Real-time TV pano kullaniliyor
- ✅ ROI raporu pozitif

> **Aktivasyon kriterleri tamam degil ise** → CSM eskaler, gerekirse re-onboarding seansi.

### 10.4 Health Score (Aylik)

| Sinyal | Puan |
|--------|------|
| Aktif kullanici / lisans | 0-25 |
| Gunluk islem hacmi | 0-25 |
| Mobil kullanim | 0-15 |
| Sektor modul kullanim | 0-15 |
| WhatsApp bildirim aktivasyonu | 0-10 |
| NPS yaniti | 0-10 |
| Acik destek talebi | -10 (her acik) |

- **80+:** Healthy (upsell hedefi)
- **50-79:** At Risk (CSM intervention)
- **<50:** Churn Risk (acil cagri + rescue plan)

---

## EK — Satis Ekibi Cep Karti (Yazdir)

```
QUVEX SATIS CEP KARTI
─────────────────────
Plan:   Starter 1.499 / Pro 3.999 / Ent 7.999 (TL/ay, KDV haric)
Yillik: %20 indirim
Trial:  14 gun, kart yok
Default plan: PRO (Mehmet Bey icin)
Top 5 koz: Sektor / Mobil / TV pano / WhatsApp / 5dk kurulum
Karar tetigi: Sertifika denetimi, yeni musteri, yangin
Itiraz #1: "Pahali" → "Gunluk 50 TL, ROI 6 ay"
Itiraz #2: "Logo'm var" → "Logo'yu tut, atolyeyi Quvex'e ver"
Itiraz #3: "Personeller" → "ShopFloor 80px, 1 saatte egitim"
Demo akisi: Onboarding → Sektor demo → ShopFloor → WhatsApp → TV pano
Kapanis: Trial linki demo sonunda, yillik odeme tetigi, urgency
Pazarlik: Pro -%5 (yillik), Ent -%15 (savunma), Founders %30
Asla: Starter pazarlik, modul bedava, trial 30 gun
Hedef yil 1: 1000 musteri, $1.8M ARR, %25 trial→paid
─────────────────────
```

---

> **Master kural:** Mehmet Bey 3 dakikada karar veriyor, 14 gunde emin oluyor, 1 ayda amortize ediyor. Bizim isimiz Mehmet Bey'i bulup, dinleyip, dogru plana yerlestirip, basariya ulasmasini saglamak. **Satis = empati + sayisal kanit + dogru zamanlama.**
