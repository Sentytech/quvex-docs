# Quvex ERP — Pricing Strategy

> Versiyon: 2.0
> Tarih: 2026-04-12
> Onceki versiyon: 1.0 (USD-birincil, 99/199/399)
> **Bu versiyonda:** Landing site TL fiyatlari (1.499/3.999/7.999 TL) tek gercek kaynak. USD ekvivalan sadece parantez icinde bilgi amacli. Kullanici sayilari landing ile hizalandi (5/15/30).
> Hedef: Satis ekibi + yonetim karar dokumu
> Temel prensip: **Seffaf, cep dostu, sektor hazir.**

---

## 0. Tutarsizlik Kararnamesi (Onemli)

Sprint 18 oncesinde landing site (1.499/3.999/7.999 TL) ile bu dokuman (~3.000/6.000/12.000 TL, $99/199/399 USD) arasinda tutarsizlik vardi.

**Karar:** Landing site fiyatlari gecerli. Sebepler:
1. **Psikolojik fiyat noktasi** — "1.499 TL" "2.000 TL alti" hissi verir, KOBI patronu satin alma direnci dusuk
2. **Pazar acisi** — 3.000 TL "orta-yuksek ERP" algisi yaratir, Logo Tiger ile kafa kafaya; 1.499 "belirgin ucuz" konum
3. **Vaka testi** — Mehmet Bey persona demo sirasinda 1.499'u "tamam, denerim" karsilar; 3.000 "dusunmeliyim"
4. **Global uyum** — $50/$133/$267 USD ekvivalan hala rakiplere gore ucuz (SAP $500+, Netsuite $999+)

**Yenilenen plan:**

| Plan | Eski (v1.0) | Yeni (v2.0) | Kullanici eski | Kullanici yeni |
|------|-------------|-------------|----------------|----------------|
| Starter | ~3.000 TL ($99) | **1.499 TL (~$50)** | 5 | 5 |
| Pro | ~6.000 TL ($199) | **3.999 TL (~$133)** | 25 | 15 |
| Enterprise | ~12.000 TL ($399) | **7.999 TL (~$267)** | Sinirsiz | 30 (+ek) |

**Fiyat dusurulmedi** — aslinda, yapisal olarak olcum noktalari degisti: TL birincil, USD ekvivalan. Global musteriler icin USD takibi yapilmaya devam ediyor.

---

## 1. Fiyatlandirma Felsefesi

Quvex fiyatlandirmasi 3 temel prensip uzerine kurulu:

1. **Erisebilirlik** — KOBI patronu (Mehmet Bey) karta bakip "denerim" diyebilmeli. Baslangic plani **aylik 1.500 TL altinda**.
2. **Seffaflik** — Gizli lisans, gizli bakim, kullanici basli surpriz fatura **yok**. Aylik sabit.
3. **Yukseltme serbestligi** — Basla, buyu, iste. Plan degistirme anlik. Ceza yok.

> **Karsilastirma:** Logo/Mikro kullanici bazli fiyatlandirirken, SAP B1 yillik lisans istemekte. Quvex **yer bazli** (firma basina) — KOBI'nin 3 kisilik muhasebe ekibini 10'a cikarmasi cepten vurmasin.

---

## 2. 3 Plan — Detay Tablo

| Ozellik | **Starter** | **Professional** ⭐ | **Enterprise** |
|---------|-------------|--------------------|---------------|
| **Aylik fiyat (TL, KDV haric)** | **1.499 TL** | **3.999 TL** | **7.999 TL** |
| **Yillik fiyat (%20 indirim)** | 14.390 TL/yil | 38.390 TL/yil | 76.790 TL/yil |
| **Aylik ekvivalan (yillik odemede)** | 1.199 TL | 3.199 TL | 6.399 TL |
| **USD ekvivalan (~30 TL/USD)** | ~$50/ay | ~$133/ay | ~$267/ay |
| **Kullanici sayisi** | 5 | 15 | 30 (+ek kullanici) |
| **Firma / Tenant** | 1 | 1 | 1 (multi-tenant ek) |
| **Depo sayisi** | 1 | 5 | Sinirsiz |
| **Temel ERP (teklif → fatura)** | ✅ | ✅ | ✅ |
| **Stok yonetimi** | ✅ | ✅ | ✅ |
| **Sektor sablonu (18 sektor)** | ✅ | ✅ | ✅ |
| **5dk Onboarding + demo data** | ✅ | ✅ | ✅ |
| **Persona dashboard (8 rol)** | ✅ | ✅ | ✅ |
| **E-Fatura / e-Arsiv (GIB)** | ✅ | ✅ | ✅ |
| **Kalite modulu (NCR, CAPA)** | ⚠️ Temel | ✅ Full | ✅ Full |
| **Sektor disiplin modulleri** (AS9100/IATF/HACCP/CE/AWS) | ❌ | ✅ | ✅ |
| **Niş modul** (ProductVariant/HACCP/Recall/MoldInventory/WPS/CE Tech File) | ❌ | ✅ | ✅ |
| **FAI / PPAP / Recall / MRB** | ❌ | ✅ | ✅ |
| **ShopFloor Terminal** | 1 makine | 5 makine | Sinirsiz |
| **WhatsApp bildirim (8 sablon)** | ❌ | ✅ | ✅ |
| **Real-time TV Pano (SignalR)** | ❌ | ✅ | ✅ |
| **API erisim (REST)** | ❌ | ✅ 10K req/gun | ✅ Sinirsiz |
| **Webhook / entegrasyon** | ❌ | ✅ | ✅ |
| **Multi-tenant (coklu firma/holding)** | ❌ | ❌ | ✅ |
| **White label (kendi marka)** | ❌ | ❌ | ✅ |
| **SSO (SAML/OAuth/AD)** | ❌ | ❌ | ✅ |
| **Dedike DB tier** | ❌ | ❌ | ✅ opsiyonel |
| **Dedike sunucu / on-premise** | ❌ | ❌ | ✅ (+%50 ek) |
| **Destek** | Email (48h) | Email + Tel (24h) | 7/24 + dedike hesap muduru |
| **Egitim** | Video + docs | + 2 saat canli | + 8 saat canli |
| **SLA** | Best effort | 99.5% | 99.9% |
| **Veri tasima (import)** | $199 tek seferlik | Ucretsiz | Ucretsiz + uzman |
| **Yedekleme** | Gunluk | Gunluk + 30 gun arsiv | Gunluk + 90 gun arsiv |

---

## 3. Tier 2 & Tier 3 — Infrastructure Opsiyonlari (Enterprise icin)

Sprint 12-17'de multi-tenancy + backup/quota/dunning altyapisi eklendi. Enterprise icin ek infra opsiyonlari:

| Tier | Tanim | Ek fiyat | Kullanim durumu |
|------|-------|----------|------------------|
| **Tier 1 (Shared)** | Schema-per-tenant, paylasilan DB/server | Dahil | Default Enterprise |
| **Tier 2 (Dedicated DB)** | Ayri PostgreSQL instance, AES-256-GCM connection | +%30 (aylik 2.399 TL ek) | Yuksek islem hacmi, data sovereignty |
| **Tier 3 (Dedicated Server)** | Ayri sunucu, opsiyonel on-premise | +%50 (aylik 4.000 TL ek) | Savunma sanayi, kurum politikasi, on-premise zorunlulugu |

### On-premise teklifi (Tier 3 ustu)

- Tek seferlik kurulum: **50.000-150.000 TL** (karmasikliga gore)
- Yillik lisans + bakim: **standart Enterprise fiyatin %75'i**
- 7/24 uzaktan destek + yilda 2 on-site ziyaret
- Upgrade penceresi aylik, musteri kontrolu

---

## 4. Plan Secim Rehberi (Satis ekibi icin)

### Kime hangi plan?

**Starter (1.499 TL/ay)** — **Giris secenegi:**
- 1-10 kisilik mikro firma
- Excel'den ilk defa cikti durum
- Muhasebe zaten Logo/Mikro'da, ERP ilk defa
- Sadece teklif-siparis-fatura zinciri yeterli
- Sektor disiplini (AS9100/HACCP/CE) gerekmez
- **Ornek:** 5 kisilik mobilya atolyesi, 3 kisilik makina imalat, 8 kisilik kucuk atölye

**Professional (3.999 TL/ay)** — **En cok satan (flagship — default teklif):**
- 10-50 kisilik KOBI
- Sektor disiplini gerekli (AS9100, HACCP, IATF, CE, AWS D17)
- Atolyede ShopFloor terminali + tablet
- Patron WhatsApp uzerinden izlemek istiyor
- Real-time TV pano atolyede
- Niş modul (ProductVariant/HACCP/MoldInventory/CE Tech File/WPS) ihtiyac
- **Ornek:** 40 kisilik otomotiv yan sanayi, 30 kisilik tekstil uretim, 25 kisilik gida, 35 kisilik CNC

**Enterprise (7.999 TL/ay)** — **Buyuk/karmasik:**
- 30+ kisilik firma
- Coklu firma / tenant (holding yapisi)
- Kendi markasiyla satmak isteyen reseller
- On-premise zorunluluk (savunma sanayi, kurum ici politika)
- SSO + gelismis guvenlik + dedike DB/sunucu
- **Ornek:** 150 kisilik savunma yan sanayi, 80 kisilik otomotiv kalip uretim holding, 60 kisilik ihracat odakli gida

---

## 5. Indirim Stratejileri

### 5.1 Yillik odeme — %20

- Aylik yerine yillik pesin odeme → %20 indirim
- **Starter:** 1.499 × 12 × 0.80 = **14.390 TL/yil** (aylik ekv 1.199 TL)
- **Pro:** 3.999 × 12 × 0.80 = **38.390 TL/yil** (aylik ekv 3.199 TL)
- **Enterprise:** 7.999 × 12 × 0.80 = **76.790 TL/yil** (aylik ekv 6.399 TL)
- **Satis avantaji:** Pesin nakit akisi, %0 churn riski ilk yil, "2 ay ucretsiz gibi" mesaji

### 5.2 Egitim / Startup — %50

- Universite / MYO / meslek lisesi egitim laboratuvarlari: **%50 indirim**
- TUBITAK/KOSGEB destekli yeni kurulmus firma (<2 yil): **%50 indirim** (ilk yil)
- Ogrenci projesi / tez: **%100 ucretsiz** (3 ay)
- **Stratejik hedef:** Mezun olan ogrenci/calisan Quvex'i taniyacak, is hayatinda tavsiye edecek

### 5.3 Savunma Sanayi — %15

- ASELSAN/ROKETSAN/HAVELSAN/BAYKAR/FNSS/TUSAS/MKE tedarikcisi (belgeli) — **%15 indirim**
- AS9100 sertifikali firmalar — **%10 ek indirim** (ilk yil)
- On-premise opsiyonu ek ucretsiz konsultasyon (2 saat)

### 5.4 Volume Discount (coklu tenant)

| Tenant sayisi | Indirim | Ornek kullanim |
|---------------|---------|----------------|
| 1-4 | %0 | Standard |
| 5-9 | %10 | Bolge dagıtıcı, kucuk holding |
| 10-24 | %15 | Orta holding, reseller |
| 25-49 | %20 | Buyuk holding, kurumsal reseller |
| 50+ | %25 (custom quote) | Enterprise reseller, OSB isbirligi |

**Not:** Volume indirim Pro/Enterprise planlarinda gecerli. Starter volume indirimi yok.

### 5.5 Erken benimseyen indirimi — Founders Club

- **Ilk 100 musteri** icin hayat boyu **%30 indirim** (grandfathering)
- Launch kampanyasi: "Quvex Founders Club"
- Referans verirse ek %10
- **Ozel ayricaliklar:**
  - Ozel rozet (LinkedIn + dashboard "Founder Member")
  - Aylik 1 saat CTO call
  - Feature request oy hakki (roadmap)
  - Yillik Quvex Summit davetlisi

### 5.6 Referans programi

- Musteri yeni musteri getirirse: **2 ay ucretsiz**
- Getirilen musteri: **%10 ilk yil indirim**
- Limit yok, kumulatif

---

## 6. Reseller / Partner Programi

### Hedef: Muhasebeci / IT danismani / mali musavir / OSB isbirligi

Turkiye'de KOBI patronuna en yakin kisi muhasebecisi. Onu partner yaparsak satis erisimi 10x.

### Partner komisyon tablosu

| Seviye | Yillik satis | Ilk yil komisyon | Yenileme komisyon | Kazanım (Pro yillik) |
|--------|--------------|------------------|-------------------|---------------------|
| **Silver** | 0-10 musteri | %30 | %15 | 11.517 TL/musteri |
| **Gold** | 11-50 musteri | %35 | %18 | 13.437 TL/musteri |
| **Platinum** | 50+ musteri | %40 | %20 | 15.356 TL/musteri |

**Ornek:** Silver partner yilda 10 Pro yillik musteri → 115.170 TL komisyon + yenileme payi (yil 2 ~%15 = 57.585 TL/yil).

### Partner destek paketi

- **Ucretsiz egitim** (2 gun, Istanbul/Ankara/Izmir)
- **Satis kit** (SALES-PLAYBOOK, DEMO-SCRIPT, broşür, fiyat listesi)
- **Beyaz etiket sunum** (kendi logolariyla)
- **Lead paylasimi** (Quvex websitesinden gelen lead'ler bolgeye gore)
- **Teknik destek** (partner ozel Slack/Telegram kanali)
- **Partner portal** (commission takip, lead CRM, marka materyal)
- **Markalama destegi** (Quvex Certified Partner logo kullanim hakki)

### Partner ilk yil hedefi

- **20 aktif partner** (silver)
- **5 gold partner**
- **1 platinum partner**
- **Partner kanali uzerinden toplam satis:** Yil 1 = 200 musteri = ~7.6M TL ARR

---

## 7. Rekabet Karsilastirmasi

| Cozum | Aylik fiyat (TL) | Kurulum suresi | Sektor hazir mi? | Turkce? | WhatsApp? | Mobil? | KVKK? |
|-------|------------------|----------------|------------------|---------|-----------|--------|-------|
| **Quvex Starter** | **1.499 TL** | **5 dakika** | ✅ 18 sektor | ✅ | ❌ (Pro+) | ✅ | ✅ |
| **Quvex Professional** ⭐ | **3.999 TL** | **5 dakika** | ✅ 18 sektor | ✅ | ✅ | ✅ | ✅ |
| **Quvex Enterprise** | **7.999 TL** | **5 dakika** | ✅ 18 sektor | ✅ | ✅ | ✅ | ✅ + on-prem |
| Logo Tiger | 15.000-30.000 TL | 2-6 ay | ❌ | ✅ | ❌ | ⚠️ Kismen | ✅ |
| Mikro Y | 10.000-20.000 TL | 2-6 ay | ❌ | ✅ | ❌ | ❌ | ⚠️ |
| Netsis | 12.000-25.000 TL | 2-4 ay | ❌ | ✅ | ❌ | ❌ | ⚠️ |
| ETA | 8.000-15.000 TL | 2-4 ay | ❌ | ✅ | ❌ | ❌ | ⚠️ |
| SAP Business One | 50.000-150.000 TL | 6-18 ay | ⚠️ Ek modul | ⚠️ Kismen | ❌ | ⚠️ Ek lisans | ✅ |
| Odoo (self-host) | ~5.000 TL + IT maas | 3-12 ay | ❌ | ⚠️ Kismen | ❌ | ⚠️ | ❌ manuel |

### Quvex fiyat avantaji

- Logo/Mikro/Netsis'e gore **Starter %85 daha ucuz, Pro %70 daha ucuz** (en ust plan bile).
- SAP B1'e gore **Enterprise %90-95 daha ucuz**.
- **Sektor sablonu dahil** — rakipler extra ucret istiyor veya yok.
- **5 dakikada kurulum** — rakipler 2-6 ay danismanlik ucreti istiyor (~50-200K TL).

### Gercek TCO (Toplam Sahiplik Maliyeti) karsilastirmasi — 3 yillik

| Cozum | Lisans (3 yil) | Kurulum | Egitim | Bakim | **TCO** |
|-------|---------------|---------|--------|-------|---------|
| **Quvex Pro (aylik)** | 143.964 TL | 0 | Dahil | Dahil | **143.964 TL** |
| **Quvex Pro (yillik)** | 115.170 TL | 0 | Dahil | Dahil | **115.170 TL** |
| Logo Tiger | 720.000 TL | 100.000 TL | 50.000 TL | 108.000 TL | **978.000 TL** |
| Netsis | 540.000 TL | 80.000 TL | 40.000 TL | 81.000 TL | **741.000 TL** |
| SAP B1 | 2.700.000 TL | 500.000 TL | 150.000 TL | 405.000 TL | **3.755.000 TL** |
| Odoo (self-host) | 180.000 TL | 150.000 TL | 60.000 TL | IT ekibi maas | **390.000+ TL** |

> **Quvex Pro yillik = Logo'nun 1/8'i, SAP B1'in 1/32'si.**

---

## 8. Fiyat Objection Handling

### "Cok pahali" (Starter bile)

> *"Ayda 1.499 TL aslinda gunluk 50 TL. Bir personelinizin gunluk maaliyeti ~1000 TL. Quvex bir kisinin bir saatinin %5'ine mal oluyor. Ve bu personel size sadece Quvex ile 1 saat tasarruf sagliyor mu? Sagladigi kanitlidir — Yilmaz Celik ornegindeki Ahmet Bey gunde 7 saat kazandi."*

### "Logo/Mikro zaten varim"

> *"Muhasebe tarafinda Logo'yu tutun — problem yok, zaten entegrasyon yapacagiz. Ama atolyeniz Logo'da degil. Veli Usta tabletle is emri girebiliyor mu? Kaliteyi denetim gunu PDF olarak cikarabiliyor musunuz? WhatsApp'a bildirim gonderiyor musunuz? Biz bu boslugu dolduruyoruz, Logo'yu itmiyoruz."*

### "Bekleyelim, belki gelecek yil"

> *"14 gun ucretsiz, kredi karti yok, risk yok. Bekleyecekseniz bile bugun deneyin — cunku Sprint 11 sonrasi verilerimize gore ilk 3 dakikada karar veriyorsunuz. Kaybedecek bir seyiniz yok, ama 14 gun sonra donup 'neden daha once baslamadim' diyebilirsiniz."*

### "Personellerim kullanamaz"

> *"Bu yuzden ShopFloor Terminal 80 piksel butonlarla tasarlandi. Veli Usta 50 yasinda, gozluklu, eldivenli — demo'yu gosterelim, 2 dakika sonra kullanmaya baslar. Garantimizdir: 1 saatte egitim biter."*

### "Verilerim guvenli mi?"

> *"AES-256-GCM sifreleme, schema-per-tenant izolasyon, Turkiye icinde hosting, KVKK uyumlu. Enterprise planda on-premise secenegi de var — kendi sunucunuzda calistirirsiniz, veri hic bulut gormez. Savunma sanayi musterilerimiz de bu sekilde kullaniyor."*

### "Pro ile Enterprise arasinda fark nedir?"

> *"Pro tek firma, 15 kullanici, tum sektor modulleri, WhatsApp, TV pano — KOBI'nin %80'ine yeter. Enterprise holding icin — coklu firma, SSO, on-premise, 30+ kullanici. Once Pro ile baslayin, buyuyunce upgrade anlik."*

---

## 9. Launch Fiyat Kampanyasi (Ilk 100 Musteri)

### "Quvex Founders Club"

- Ilk 100 musteri: **Hayat boyu %30 indirim** (grandfathering)
- Ozel rozet (LinkedIn + dashboard'da "Founder Member")
- Yonetime direkt erisim (aylik 1 saat CTO call)
- Feature request onceligi (roadmap'te oy hakki)
- Yillik Quvex Summit davetli

### Hedef: Ilk 100 musteri ile **7.5M TL ARR**

| Plan | Founder fiyati (aylik) | Yillik (Founders + yillik %20 = %44 total) | Musteri sayisi | Katki |
|------|------------------------|----|----------------|-------|
| Starter %30 | 1.049 TL | 10.073 TL/yil | 50 | 503.650 TL |
| Pro %30 | 2.799 TL | 26.873 TL/yil | 40 | 1.074.920 TL |
| Enterprise %30 | 5.599 TL | 53.749 TL/yil | 10 | 537.490 TL |
| **Toplam** | | | **100** | **~2.1M TL/yil** |

> **Not:** Founder fiyati hayat boyu. Grandfathering fark yaratir — sadakat %95+.

---

## 10. Ucretsiz Deneme (Trial) Stratejisi

### 14 gun ucretsiz, kredi karti yok

**Neden 14 gun?**
- 7 gun az — patron tatilden donemiyor, deneyemiyor
- 30 gun cok — aciliyet hissi kayboluyor
- **14 gun optimal** — 2 hafta icinde demo data ile oynayip karar verir

**Trial sirasinda yapilacaklar:** (tam ayrinti `EMAIL-DRIP-CAMPAIGN.md`)

| Gun | Otomatik aksiyon | Amac |
|-----|-------------------|------|
| 0 | Welcome email + onboarding linki | Ilk temas |
| 1 | "Ilk musteriyi ekle" | Aktivasyon |
| 3 | Sektor ozel ipucu | Engagement |
| 5 | Niş modul tanitim | Differansiasyon |
| 7 | ROI rapor | Mid-point push |
| 9 | Case study | Sosyal kanit |
| 11 | Mobil indir | Persona expansion |
| 12 | Plan secimi | Decision |
| 13 | Last chance + Founders Club | Urgency |
| 15 | Win-back + "veriler 30 gun korunuyor" | Reactivation |

**Trial → Paying donusum hedefi:** **%25** (sektor ortalamasi %15-20)

---

## 11. Churn ve Retention Stratejisi

### Churn onleme

- **Ilk 30 gun kritik** — en cok churn burada olur
- **Patron-CTO iliskisi** — Enterprise musterileri icin CEO direkt temas
- **Feature request karsilama** — sektor spesifik taleplere hizli cevap
- **Kucuk musteriler icin** — otomatik health check (haftalik kullanim rapor)
- **Sprint 14 dunning flow** — odeme basarisiz → grace period → dondurma → veri koruma

### Retention hedefi

- **Yillik churn < %10** (ilk yil)
- **Net Revenue Retention > %110** (upsell ile)
- **Starter → Pro upgrade:** %20 ilk yil
- **Pro → Enterprise upgrade:** %5 yil 2

---

## 12. Ozet Kurallar (Satis ekibi icin cep kartti)

1. **Fiyat listesini ezberle** — 1.499 / 3.999 / 7.999 TL (KDV haric). USD ekv ~$50/$133/$267.
2. **Once deger, sonra fiyat.** Demo yapmadan fiyat konusma.
3. **Pro plan ile baslat** — default teklif. Starter'a dusme, Enterprise'a cikma gerekirse.
4. **Yillik odemeyi tesvik et** — %20 indirim cazibesi guclu.
5. **14 gun trial her zaman seste** — risk sifir.
6. **Founders Club'a bugun katil** — ilk 100 musteri hayat boyu %30.
7. **Rakibi kucumseme.** Logo/Mikro kotu degil, biz farkliyiz — sektor ve mobil.
8. **"Excel'den kurtulus"** — mesaj hep ayni. Her musteride bu vurgu.

---

## 13. SSS (Satis ekibi icin)

**S: Trial bitince otomatik ucretlendirme var mi?**
C: Hayir. Kart bilgisi almadik, iptal otomatik. Musteri karar vermeli.

**S: Trial suresini uzatabilir miyiz?**
C: Evet, 7 gun daha 1 kez uzatilabilir (satis onayi ile).

**S: Plan degistirme ne kadar surer?**
C: Anlik. Upgrade iki tik, downgrade periyodu sonunda.

**S: Fiyati pazarlik edebilir miyiz?**
C: Starter — hayir. Pro — yillik odemede %5 ek verilebilir. Enterprise — custom quote her zaman (%15'e kadar savunma sanayi).

**S: On-premise ek ucret ne kadar?**
C: Enterprise + %50 aylik + 50-150K TL tek seferlik kurulum.

**S: API erisimi limitsiz mi?**
C: Pro: 10K request/gun. Enterprise: sinirsiz.

**S: Veri tasima ucretli mi?**
C: Pro ve Enterprise icin ucretsiz (Excel/Logo/Mikro export). Starter plani icin opsiyonel $199 tek seferlik.

**S: KDV dahil mi?**
C: Hayir, fiyatlar KDV haric. Fatura %20 KDV ile kesilir (Pro aylik 3.999 + 800 KDV = 4.799 TL toplam).

**S: Ek kullanici ekleme?**
C: Enterprise'da ek kullanici 250 TL/ay/kullanici. Pro'da limit 15 — asilacaksa Enterprise'a gecis.

**S: Odeme saglayicilari?**
C: PayTR (birincil), Iyzico (yedek). Kredi kart + havale + cek (kurumsal).

---

> **Temel mesaj:** Quvex **adil fiyatli, seffaf, sektor hazir**. Mehmet Bey 1.499 TL'lik karar verebilir, Excel'den 5 dakikada cikar, 14 gunde emin olur, 1 ayda amortize eder.
>
> **Satis ekibi hedefi — Yil 1:**
> - 1.000 odeme yapan musteri
> - ~30M TL ARR (mix: %50 Starter, %40 Pro, %10 Enterprise, yillik odeme orani %40)
> - %25 trial-to-paid donusum
> - %10 yillik churn
> - 20 aktif partner, 200 musteri partner kanali
