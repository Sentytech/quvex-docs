# Quvex ERP — Sales Pitch Deck

> Versiyon: 1.0
> Tarih: 2026-04-12
> Sunum suresi: 15-20 dakika
> Hedef: KOBI imalat firmasi karar vericisi (Mehmet Bey persona)

---

## Slayt 1 — Baslik

![Quvex Logo — V4 Shield+Factory]

# **Quvex ERP**
## Sahanin ERP'si

> **"Excel'den 5 dakikada profesyonel ERP'ye."**

Turkiye'nin 18 imalat sektorune kapsayici, savunma sanayisi seviyesinde kalite disiplini, atolye seviyesinde basitlik.

*Sunum: [Ad Soyad] — Quvex Sales Team*

---

## Slayt 2 — Problem

### Turkiye imalat sektorunun gercegi

- **200.000+ KOBI uretim firmasi** var (ISO, TOBB verileri).
- **%80'i hala Excel kullaniyor.** Teklif Excel'de, uretim tahtada, kalite klasorde.
- Mevcut ERP'ler iki uca kutuplanmis:
  - **Cok pahali** — SAP B1, Oracle (50-100K TL/ay + lisans).
  - **Sektore uymuyor** — Logo/Mikro muhasebe odakli, atolye yok.
- Turk firmasi icin eksikler:
  - Turkce arayuz degil (yabanci jargon).
  - Mobil calismiyor (atolyede tablet yok).
  - **WhatsApp entegrasyonu yok** (Turkiye'de must-have).
  - Sektor sablonu yok — her firmaya sifirdan kurulum gerekiyor.

> **Sonuc:** Mehmet Bey (patron) ya Excel'e mahkum, ya 200K TL'lik SAP projesine.

---

## Slayt 3 — Cozum

### Quvex — Turkiye'nin ilk sahayi konusan ERP'si

- **18 sektore hazir sablon** — CNC, Tekstil, Gida, Otomotiv, Plastik, Metal, Mobilya, Makine, Kaynak, Medikal...
- **5 dakikada kurulum** — Sektor sec, "Demo Veri Yukle"ye bas, calisir durumda sistem.
- **Mobil + WhatsApp + Turkce** — Atolyede tablet, sahada telefon, patronun cebinde WhatsApp.
- **Uyumluluk hazir** — AS9100 (defans), ISO 13485 (medikal), IATF 16949 (otomotiv), HACCP (gida), CE (makine).
- **Sahadan patrona tek zincir:** Teklif → Siparis → Uretim → Sevk → Fatura → Tahsilat.

> **Mehmet Bey karsisindaki zaman:** 20 dakikadan **3 dakikaya** dustu. (Sprint 11 olcumu — 7.5x hiz.)

---

## Slayt 4 — Pazar (TAM / SAM / SOM)

### Sayilarla firsat

| Pazar | Tanim | Firma sayisi | Yillik degeri |
|-------|-------|--------------|---------------|
| **TAM** | Turkiye tum KOBI imalat | 200.000 | 200K × $200/ay × 12 = **$480M/yil** |
| **SAM** | 10 buyuk sektor (Quvex hedefi) | 133.000 | 133K × $200/ay × 12 = **$319M/yil** |
| **SOM — Yil 1** | Ilk yil realistik hedef | 1.000 musteri | 1K × $150/ay × 12 = **$1.8M ARR** |
| **SOM — Yil 3** | 3 yillik buyume hedefi | 10.000 musteri | **$24M ARR** |

> **Sprint 11 sonrasi:** 51K KOBI erisiminden **133K KOBI'ye** cikti (+%160 buyume).

---

## Slayt 5 — Sektorler

### 10 buyuk sektor — hepsine hazir

| Sektor | KOBI | Neden Quvex? |
|--------|------|--------------|
| **Savunma / Havacilik** | 2K | AS9100 hazir, denetim gunu hazir, FAI/NCR/CAPA/izlenebilirlik |
| **Otomotiv** | 15K | PPAP export, IATF 16949, IMDS, 8D raporu |
| **Metal / Celik** | 45K | BOM, Uretim takip, maliyetleme |
| **Tekstil / Hazir giyim** | 30K | **Beden × Renk varyant matrisi, pastal plan** |
| **Gida** | 25K | **HACCP + CCP + Recall wizard, lot trace, geri cagirma** |
| **Mobilya** | 35K | Set yonetimi, CNC (Biesse) entegrasyon |
| **Plastik** | 12K | **Kalip envanteri, shot sayaci, bakim esigi** |
| **Makine imalat** | 10K | **CE Teknik Dosya (19 alan)**, machinery direktif |
| **Kaynak / Celik konstruksiyon** | 5K | **WPS/WPQR, kaynakci sertifika expiry alarm** |
| **Medikal** | 3K | ISO 13485, UDI, serializasyon |

> **Slogan ayirimlari:**
> - Savunma + Otomotiv: **"Denetim gunu hazir."**
> - Tekstil + Mobilya: **"Varyant ve set bir tikta."**
> - Gida: **"HACCP + recall 7 adimda."**

---

## Slayt 6 — Killer Features

### Rakip hic birinde olmayan 5 ozellik

1. **5dk Onboarding** — *"vay anasini"* ani
   - Sektor sec → demo veri yukle → 30 saniyede 5 musteri, 5 urun, 3 makine, 2 siparis hazir.
   - Tekstil'de varyantlar, gidada HACCP CCP'leri, plastik'te kalip — otomatik.

2. **ShopFloor Terminal** — 50 yasindaki Veli Usta icin
   - 80px buton, eldivenle tiklanir, barkod scan, tek elle kullanim.
   - iOS HIG 44px uzerinde, tablet yatay mod.

3. **Real-time TV Dashboard** — atolyede TV'ye koy
   - `/production/live-board` — dark theme, 56px KPI rakamlari.
   - SignalR canli, 5 dakikada bir yenilenir, makineler yesil/sari/kirmizi.

4. **WhatsApp bildirim** — Turkiye must-have
   - 8 hazir Turkce sablon: siparis onay, odeme hatirlatma, NCR uyari, bakim zamani...
   - Meta Graph API, polly resilience, Turkiye telefon normalizasyonu.

5. **8 rol icin ayri dashboard** — Patron, Uretim Muduru, Operator, Kalite, Depo, Satinalma, Muhasebe, Satis
   - Her persona kendi giris sayfasini gorur.

---

## Slayt 7 — Ekran goruntuleri

### Urunu gostermeden satis olmaz

1. **[SCREENSHOT_1 buraya]** — Executive Dashboard (Patron gorunumu, KPI widget'lar)
2. **[SCREENSHOT_2 buraya]** — ShopFloor Terminal (80px buton, barkod ekrani)
3. **[SCREENSHOT_3 buraya]** — ProductVariant Matrix (S/M/L × Beyaz/Mavi/Siyah tablosu)
4. **[SCREENSHOT_4 buraya]** — HACCP Control Points + Recall wizard
5. **[SCREENSHOT_5 buraya]** — Real-time TV Production Board (dark theme)
6. **[SCREENSHOT_6 buraya]** — WhatsApp bildirim ornegi (telefon ekrani)

> *Not: Canli demo bu slayttan sonra yapilir (DEMO-SCRIPT.md).*

---

## Slayt 8 — Persona Mutlulugu

### 8 persona — her biri neyi kazaniyor?

| Persona | Rol | Ne kazaniyor? |
|---------|-----|---------------|
| **Veli Usta** | Operator | "ShopFloor'da eldivenle calisir, barkod okutur, 2 saniyede is emri tamamlar." |
| **Mehmet Bey** | Patron | "Telefonda 1 bakista her sey — ciro, stok, gecikme. WhatsApp'ta gunluk ozet." |
| **Fatma Hanim** | Satinalma | "Tedarikci karsilastirma 5 dakika, 3 tedarikciden fiyat tek ekranda." |
| **Ahmet Bey** | Uretim Muduru | "Gantt'ta drag-drop, kapasite uyarisi, makine cakismasi otomatik." |
| **Hasan Abi** | Depo | "Barkod ile giris-cikis, sayim tabletle, min stok alarmi." |
| **Ayse Hanim** | Kalite Muhendisi | "NCR acma 30 saniye, FAI otomatik, denetim gunu PDF export." |
| **Cem Bey** | Satis | "Teklif 3 dakikada, revizyon takip, musteri portalinda takip." |
| **Selin Hanim** | Muhasebe | "Fatura siparisle otomatik bagli, cari ekstre tek tikla." |

> **Sprint 11 Patron skoru:** 4.2/10 → **8.0/10** (hedef). Karar verici mutlu olunca satis kolay.

---

## Slayt 9 — Rekabet

### Karsilastirma — neden Quvex?

| Ozellik | **Quvex** | Logo Tiger | Mikro Y | SAP B1 |
|---------|-----------|------------|---------|--------|
| Turkce arayuz | ✅ Native | ✅ | ✅ | ⚠️ Kismen |
| Mobil / Tablet | ✅ Full | ⚠️ Kismen | ❌ | ⚠️ Ek lisans |
| WhatsApp entegrasyon | ✅ 8 sablon | ❌ | ❌ | ❌ |
| Sektor sablonu | ✅ 18 sektor | ❌ | ❌ | ⚠️ Ek modul |
| ShopFloor terminal | ✅ Native | ❌ | ❌ | ⚠️ Ek modul |
| AS9100 / HACCP / CE | ✅ Dahil | ❌ | ❌ | ⚠️ Ek lisans |
| 5dk kurulum | ✅ | ❌ 2-6 ay | ❌ 2-6 ay | ❌ 6-18 ay |
| Real-time TV pano | ✅ SignalR | ❌ | ❌ | ⚠️ Ek urun |
| **Baslangic fiyat** | **$99/ay** | ~$500/ay | ~$400/ay | ~$2000/ay |

> **Quvex ayirt edici:** Sektor + mobil + WhatsApp + fiyat. **%50-80 daha ucuz.**

---

## Slayt 10 — Fiyatlandirma

### Cep dostu, seffaf, 14 gun ucretsiz

| Plan | **Baslangic** | **Pro** | **Enterprise** |
|------|---------------|---------|----------------|
| Aylik | $99 (~3K TL) | $199 (~6K TL) | $399 (~12K TL) |
| Kullanici | 5 | 25 | Sinirsiz |
| Moduller | Temel ERP | + Kalite + AS9100 | + Multi-tenant |
| ShopFloor | 1 makine | 5 makine | Sinirsiz |
| WhatsApp bildirim | ❌ | ✅ | ✅ |
| Real-time Pano | ❌ | ✅ | ✅ |
| Sektor sablonu | ✅ | ✅ | ✅ |
| Destek | Email | Email + Telefon | 7/24 + dedike |

- **14 gun ucretsiz** — kredi karti yok.
- **Setup ucreti yok.**
- **Sektor sablonu dahil.**
- Yillik odeme: **%20 indirim.**

> Detaylar: `PRICING-STRATEGY.md`

---

## Slayt 11 — Musteri Basari Hikayesi

### Yilmaz Celik A.S. — 40 kisi, Bursa

**Profil:**
- Otomotiv yan sanayi, Ford Otosan'a conta ve braket uretiyor.
- 8 CNC tezgahi, 3 kaynak robotu, 40 calisan.
- Aylik ~200 is emri.

**Onceden:**
- Teklif Excel, uretim tahta, kalite klasor.
- **Patron Ahmet Bey gunde 8 saat Excel basinda.**
- Musteri denetiminde 3 gun NCR dosyasi aranir.
- PPAP paketi her siparis icin 2 gun manuel hazirlanir.

**Quvex sonrasi (3 ay):**
- Teklif Quvex'te 3 dakika, PPAP otomatik export.
- **Patron gunde 1 saat Quvex'te** — kalan 7 saat saha ve musteri.
- Denetim gunu PDF tek tik.
- WhatsApp bildirim ile operatorlere is emri direkt.

**Kazanc:**
- **35.000 TL/ay verimlilik tasarrufu** (7 saat × 20 gun × patron saat maliyeti).
- Musteri memnuniyeti: Ford gecikme sifir.
- Yatirimi **1 ayda amortize** etti.

> *"Quvex olmasa Ford projelerini birakirdim. Simdi iki yeni sozlesme aldim."* — Ahmet Yilmaz, Genel Mudur.

---

## Slayt 12 — Cagri

## Basla. Bugun.

### Simdi ne yapmalisiniz?

1. **14 gun ucretsiz dene** — kredi karti yok, kurulum yok.
2. **Demo planla** — 15 dakikada sektorunuze ozel gosterim.
3. **Sektor sablonu ile baslat** — 5 dakikada calisir sistem.

### Iletisim

- 🌐 **Web:** https://quvex.io
- 📅 **Demo:** https://demo.quvex.io
- 📱 **WhatsApp:** +90 555 XXX XX XX
- ✉️ **Email:** info@quvex.io

---

> **Quvex — Turkiye'nin 200.000 KOBI imalatcisinin Excel'den kurtulacagi yer.**
>
> *Sahanin ERP'si. Bugun baslayin.*
