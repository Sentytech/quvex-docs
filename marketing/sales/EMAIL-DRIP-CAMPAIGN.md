# Quvex Email Drip Campaign — 14 Gun Trial Nurturing

> Versiyon: 1.0
> Tarih: 2026-04-12
> Kampanya: Yeni trial kayit eden kullanici icin 14 gun + 1 gun win-back
> Hedef donusum: **%25 trial → paid** (sektor ort %15-20)
> Gonderim kanali: E-mail birincil + WhatsApp yedek (onay alinmissa)
> Kisisellestirme: {{firstName}}, {{sector}}, {{plan}}, {{companyName}}
> Sender: "Ayse Yilmaz — Quvex Customer Success <ayse@quvex.app>" (human-first, marka kis)

---

## Kampanya Ozet Tablosu

| # | Gun | Konu (tema) | Gonderim saati | Hedef aksiyon | Success metrik |
|---|-----|-------------|----------------|---------------|----------------|
| 1 | 0 (kayit sonra 5 dk) | Hos geldin + 5 dk onboarding | Anlik | Ilk login | Login rate ≥ %85 |
| 2 | 1 | Demo veri ile dene | 09:30 | Ilk customer ekleme | Customer added ≥ %60 |
| 3 | 3 | "Ilk musterini ekledin mi?" + sektor ozel ipucu | 10:00 | Product/order olustur | Order created ≥ %45 |
| 4 | 5 | Sektor ozel niş modul tanitim | 14:00 | Modul aktivasyonu | Module used ≥ %35 |
| 5 | 7 | Yarisini basardin + ROI | 09:30 | Patron dashboardu | Dashboard view ≥ %55 |
| 6 | 9 | Case study (sosyal kanit) | 11:00 | Upgrade sayfasi | Pricing page view ≥ %30 |
| 7 | 11 | Mobil indir | 15:00 | Mobil app install | Install ≥ %25 |
| 8 | 12 | "2 gun kaldi" + plan seçim yardimi | 10:00 | Plan secimi | Plan click ≥ %35 |
| 9 | 13 | Son 24 saat + Founders Club indirimi | 14:00 | Upgrade/odeme | Payment start ≥ %20 |
| 10 | 15 (bitiminden 1 gun sonra) | Veriler 30 gun korunuyor + win-back | 10:00 | Geri donus | Win-back ≥ %5 |

**Toplam donusum hedefi:** %25 (trial → paid). Bunun %15'i gun 11-13 (urgency), %10'u gun 14 oncesi (erken karar), %5'i gun 15+ (win-back).

---

## EMAIL 1 — GUN 0 — Hos geldin

**Gonderim:** Kayit sonrasi 5 dakika icinde
**Amac:** Ilk login yap-tir, momentum yarat.

### Konu satirlari (A/B test)

- **A:** "{{firstName}}, Quvex'e hos geldiniz — 5 dakikada hazir"
- **B:** "Merhaba {{firstName}} — uretiminizi 5 dakikada devreye alalim"

### Gövde (HTML-friendly)

```
Merhaba {{firstName}},

Quvex ailesine hos geldiniz! {{companyName}} icin 14 gun ucretsiz
deneme süreniz basladi — kredi karti bilgisi vermediniz, endiselenmeyin.

Ilk 5 dakikada ne yapacaginiz:

  1. Sektorunuzu secin (18 sektor — CNC, Gida, Tekstil, Otomotiv...)
  2. Demo data otomatik yuklensin (gercek firmalar + urunler + makineler)
  3. Patron dashboardunda ilk veriyi gorun

--> [SIMDI BASLA] <--
    https://app.quvex.com/onboarding?token={{trialToken}}

Onboarding tamamlaninca size ozel bir e-posta daha gelecek.

Takıldığınız bir yer olursa direkt yanitlayin bu e-postayi — ben bakiyorum.

Sevgiler,
Ayse Yilmaz
Customer Success @ Quvex
+90 xxx xxx xx xx (WhatsApp)

PS: 3 dakikada ilk is emrinizi olusturabilirsiniz. Bunu bilmeniz lazim.
```

**CTA:** `[SIMDI BASLA]` → Onboarding wizard direkt
**Success metrik:** Ilk login rate ≥ %85 (gun 0 gece yarisi olcumu)

---

## EMAIL 2 — GUN 1 — Demo veri ile dene

**Gonderim:** Gun 1, 09:30
**Amac:** Ilk customer eklenmesini saglamak.

### Konu satirlari (A/B)

- **A:** "{{firstName}}, ilk musterinizi 30 saniyede ekleyelim"
- **B:** "Demo veri hazir — ama kendi musterinizi eklemek daha guclu"

### Gövde

```
Merhaba {{firstName}},

Dun Quvex'e giris yaptiginizi gordum — harika! Sektoriniz {{sector}}
icin demo data da yuklendi (ASELSAN, ROKETSAN, BAYKAR gibi gercek firmalar).

Simdi bir adim daha: **kendi musterinizi** ekleyin.

Neden? Cunku:
  • Kendi veriniz ile calismak 10x daha gercek hissi verir
  • 14 gun sonunda zaten bu musteri sizinle kalacak
  • 30 saniye suruyor — isim + telefon + vergi no yeter

--> [ILK MUSTERIMI EKLE] <--
    https://app.quvex.com/customers/new?trial={{trialToken}}

Ipucu: Yukleyecek cok musteriniz varsa Excel import'u da var.
  Destek makalesi: https://docs.quvex.app/import

Yardim gerekirse yanitlayin, 10 dakika icinde donerim.

Sevgiler,
Ayse

PS: Sektorunuz {{sector}} icin sizce en faydali modul hangisi?
   Cevabinizi yazmaniz benim icin inanılmaz faydali olur.
```

**CTA:** Ilk customer formu (minimal mode)
**Success metrik:** Customer added ≥ %60 (gun 2 gece yarisi)

---

## EMAIL 3 — GUN 3 — Ilk musteri check-in + sektor ipucu

**Gonderim:** Gun 3, 10:00
**Amac:** Product/order olustur.

### Konu satirlari (A/B)

- **A:** "Ilk musteriniz eklendi mi? {{sector}} icin 3 ipucu"
- **B:** "{{firstName}}, Quvex'ten {{sector}} uzmanindan 3 taktik"

### Gövde

```
Merhaba {{firstName}},

3. gundeyiz — istatistiklerimize gore trial kullanıcıların %78'i bu
noktada ilk musterisini ekler. Siz ne durumdasiniz?

{{#if customerAdded}}
  Harika, musterinizi gordum — {{customerName}}.
  Simdi bir urun ekleyelim ve ilk siparisi olusturalim.
{{else}}
  Hala cekingenseniz, direkt buradan basliyabilirsiniz:
  [MUSTERI EKLE]
{{/if}}

{{sector}} sektoru icin size en faydali 3 ipucu:

{{#sectorTipsBlock}}
  CNC / Savunma:
  1. AS9100 sablonunu aktif et (NCR/CAPA/FAI hazir)
  2. Lot trace icin hammadde LOT kodunu kaydet
  3. ShopFloor terminali tablete tanimla — Veli Usta kullanabilsin

  Gida:
  1. HACCP CCP'leri bugun tanimla (7 kontrol noktasi hazir sablon)
  2. Sıcaklık olcumunu tabletten gir — manuel kayit bitti
  3. Recall testi yap — lot hangi bayilere gitti?

  Tekstil:
  1. ProductVariant kullan — Beden x Renk matrisini 30 saniyede
  2. Coklu kanal stok: Trendyol/Web/Magaza/B2B tek ekranda
  3. Fason is emri + barkod takip

  (Diger 15 sektor icin benzer 3-ipucu)
{{/sectorTipsBlock}}

--> [SEKTOR DEMO VIDEOSU (3 DK)] <--
    https://quvex.app/demo/{{sector}}

Bir takiliyor musunuz, arayabilir miyim?

Sevgiler,
Ayse
```

**CTA:** Sektor demo video + product/order olusturma
**Success metrik:** Order created ≥ %45

---

## EMAIL 4 — GUN 5 — Sektor ozel niş modul tanitim

**Gonderim:** Gun 5, 14:00
**Amac:** Niş modul aktivasyonu (differansiasyon noktasi).

### Konu satirlari

- **A:** "{{sector}} icin Quvex'in gizli kozu: {{nicheModule}}"
- **B:** "Bu ozellik {{sector}} sektoru disinda hic kimsede yok"

### Gövde

```
Merhaba {{firstName}},

Bu modulu ozellikle size gostermek istiyorum — cunku {{sector}} sektoru
icin rakiplerimizde olmayan bir sey.

{{#switch sector}}
  case "CNC" / "Savunma":
  --------------------------
  **AS9100 Modulu + FAI/PPAP/MRB**
  ASELSAN tedarikcisi 3 musterimiz bunun sayesinde 6 haftalik denetim
  hazirligini 1 haftaya indirdi. Ornek:
  • NCR doldurma: 30 dk -> 3 dk
  • FAI rapor: 2 saat -> 15 dakika
  • Denetim hazirligi: 6 hafta -> 1 hafta

  case "Gida":
  -----------
  **HACCP/Recall Modulu — 7 step recall wizard**
  Migros tedarikcisi bir musterimiz recall sirasinda etkilenen
  lot bulma suresini 3 haftadan 2 saate indirdi. Ornek:
  • Forward trace BFS: hangi bayi, hangi lot, kac adet?
  • SMS/WhatsApp otomatik bildirim
  • Migros denetim raporu PDF

  case "Tekstil":
  ---------------
  **ProductVariant bulk-generate**
  S/M/L/XL × 5 renk = 20 SKU, **30 saniyede**. Excel'de 1 gun
  surecek is. LCW tedarikcilerimiz sezonluk koleksiyon hazirligini
  3 gunden 4 saate indirdi.

  case "Plastik":
  ---------------
  **MoldInventory — kavite, shot counter, bakim esigi**
  Kalip omru artik bilinmiyor degil. Her enjeksiyon sayildi,
  bakim esiginde otomatik uyari.

  case "Makine":
  --------------
  **CE Technical File — 19 alan otomatik**
  Denetim dosyasi 1 hafta -> 1 gun. Makine direktif 2006/42/EC
  + risk analizi + uygunluk degerlendirme.

  default:
  --------
  **18 sektor disiplin modulu**
  Sektorunuze ozel sablonlar aktif hale gelecek.
{{/switch}}

--> [MODULU SIMDI AKTIFLE] <--
    https://app.quvex.com/modules/{{nicheModule}}

Sevgiler,
Ayse

PS: Bu moduller Pro planinda, Starter'da yok. Ama 14 gun trialinizde
   Pro seviyesinde acik — istediginiz kadar test edin.
```

**CTA:** Niş modul aktivasyonu + video
**Success metrik:** Module used ≥ %35

---

## EMAIL 5 — GUN 7 — Yari yolda + ROI

**Gonderim:** Gun 7, 09:30 (yari sure)
**Amac:** Engagement kontrolu, ROI hissi yaratmak.

### Konu satirlari

- **A:** "{{firstName}}, yari yolda — ROI raporunuz hazir"
- **B:** "7 gun gecti, {{companyName}} icin somut rakamlar"

### Gövde

```
Merhaba {{firstName}},

Trial'inizin yari yolundasiniz. Bu hafta kullandiginiz ozellikleri
topladim, benim icin size ozel bir ROI tahmini yaptim.

SIZIN TRIAL AKTIVITENIZ (son 7 gun):
  • Musteri eklendi:      {{customerCount}}
  • Urun eklendi:         {{productCount}}
  • Is emri olusturuldu:  {{orderCount}}
  • Kalite kayit:         {{qualityCount}}
  • Mobil giris:          {{mobileLogins}}

SEKTOR BENCHMARK ({{sector}}):
  • Ortalama ay tasarruf:  {{avgHoursSaved}} saat/ay
  • Is emri suresi:        %{{avgEfficiency}} iyilesme
  • Hatalı urun:           %{{avgDefectReduction}} azalma

SIZIN TAHMINI ROI (Pro plan, yillik):
  • Aylik maliyet:         3.999 TL
  • Tahmini tasarruf:      {{estimatedMonthlySaving}} TL/ay
  • Amortize suresi:       {{payback}} ay
  • 1 yil net:             {{netYearly}} TL kazanc

--> [DETAYLI ROI RAPORUMU INDIR] <--
    https://app.quvex.com/roi-report/{{trialToken}}

Kisisellestirilmis hesaplamanin tam PDF raporu ekli — ayrica
yoneticinize gondermek isterseniz forward edebilirsiniz.

7 gun daha var, ama benim tavsiyem: bu hafta sonu {{companyName}}
patronu ile 15 dakika oturun, raporu birlikte inceleyin.

Yardimci olabilir miyim?

Sevgiler,
Ayse
```

**CTA:** ROI PDF rapor + patron ile paylaşma
**Success metrik:** Dashboard view ≥ %55, ROI report indirme ≥ %40

---

## EMAIL 6 — GUN 9 — Case Study (sosyal kanit)

**Gonderim:** Gun 9, 11:00
**Amac:** Sosyal kanit + pricing sayfasi zieri.

### Konu satirlari

- **A:** "{{sector}} sektorunden {{caseCompany}} boyle basardi"
- **B:** "Mehmet Bey 3 ayda %40 verimlilik — ve hikayesi"

### Gövde

```
Merhaba {{firstName}},

Bugun size bir hikaye gondermek istiyorum — {{sector}} sektorunden
bir firma, tipki sizinki gibi:

{{#switch sector}}
  case "CNC" / "Savunma":
  -----------------------
  YILMAZ CELIK — 45 KISI — BURSA
  "Biz de Logo Tiger + Excel ile calisiyorduk. AS9100 denetimi
  3 ay sonra gelecekti, elimiz koynumuzda."
  • Quvex'e gecisi: 5 gun
  • Denetim hazirligi: 6 hafta -> 1 hafta
  • NCR doldurma: 30 dk -> 3 dk
  • ASELSAN'a tedarik red orani: %4 -> %0.5
  • Toplam tasarruf (yil 1): 340.000 TL

  case "Gida":
  ------------
  KONYA SUT AS — 60 KISI — KONYA
  "Recall korkusu gece uyutmuyor, Excel'deki lot kayitlari denetimde
  patlaktir."
  • Quvex HACCP modulu: 4 gun kurulum
  • Recall testi: 3 hafta -> 2 saat
  • Migros denetim raporu: 1 hafta -> 1 gun
  • Toplam tasarruf (yil 1): 220.000 TL

  case "Tekstil":
  ---------------
  DENIZLI EV TEKSTIL — 35 KISI — DENIZLI
  "Excel'de beden x renk matrisi cinnet, fason takibi yok."
  • Quvex ProductVariant: 3 gun
  • Sezonluk koleksiyon hazirligi: 3 gun -> 4 saat
  • Stok hatasi: %12 -> %2
  • Toplam tasarruf (yil 1): 185.000 TL

  (Diger 15 sektor icin benzer case study)
{{/switch}}

--> [TAM CASE STUDY OKU (PDF)] <--
    https://quvex.app/case-studies/{{sector}}

Bu firma patronuyla gorusmek ister misiniz? Referans goruşmesi
duzenleyebilirim — genelde 15 dakika, samimi.

Yarin "patronun tanidigi bir ses" duyacaksiniz.

Sevgiler,
Ayse

PS: Plan fiyatlarini gozden gecirmek isterseniz:
   https://quvex.app/pricing
   Yillik odemede %20 indirim var, bu hafta hatirlatayim.
```

**CTA:** Case study PDF + pricing page
**Success metrik:** Pricing page view ≥ %30, case study download ≥ %25

---

## EMAIL 7 — GUN 11 — Mobil indir

**Gonderim:** Gun 11, 15:00
**Amac:** Mobil aktivasyon (persistence + patron engagement).

### Konu satirlari

- **A:** "{{firstName}}, Quvex cebinizde — QR kodu tarayin"
- **B:** "Patron WhatsApp'tan onay veriyor — mobil app indirdiniz mi?"

### Gövde

```
Merhaba {{firstName}},

Trial'iniz 14 gunluk — ama zamaninizin cogu masa basinda degil.
Atolyede, toplantida, yolda olur musunuz?

Quvex Mobile indirdigimiz mi?

NE YAPAR:
  • Patron: Teklif onay, uretim ozeti, gunluk KPI (8 persona dash)
  • Sef: Is emri atama, operator takibi, OEE
  • Operator: Is emri baslatma, foto cekme, kalite kayit
  • Satis: Musteri kartviziti, hizli teklif, stok sorgu
  • Kalite: NCR olusturma, denetim kontrol listesi
  • Muhasebe: Fatura onay, odeme takibi
  • Depo: Sayim, giris/cikis, barkod
  • Servis: Bakim, ariza kayit

ANDROID:    [Play Store QR]
IOS:        [App Store QR]

Veya direkt link:
  Android: https://play.google.com/store/apps/details?id=app.quvex
  iOS:     https://apps.apple.com/tr/app/quvex/id000000

Giris yapin, ayni {{username}} + sifre. Demo data hemen gelir.

Bu hafta sonu patronunuza indirtin — pazartesi ofise gelmeden
5 dakikada haftalik ozeti gormus olacak.

Sevgiler,
Ayse

PS: 3 gun kaldi — bu hafta sonu karar vermek iyi olur. Yillik
   odemede %20 indirim + Founders Club bugun hala acik.
```

**CTA:** Mobil app install (QR)
**Success metrik:** Install ≥ %25

---

## EMAIL 8 — GUN 12 — "2 gun kaldi, plan sec"

**Gonderim:** Gun 12, 10:00
**Amac:** Plan secimi, conversion push.

### Konu satirlari

- **A:** "{{firstName}}, 2 gun kaldi — hangi plan?"
- **B:** "48 saat: Starter mi Pro mu Enterprise mi?"

### Gövde

```
Merhaba {{firstName}},

Trial'iniz 2 gun sonra bitecek. {{companyName}} icin en uygun plan
hangisi — size yardimci olayim.

KISISELLESTIRILMIS ONERIM:

{{#personalizedRecommendation}}
  Sizin aktivitenize baktim:
  - {{userCount}} kullanici aktif
  - {{orderCount}} siparis
  - {{moduleList}} modul kullanim

  ONERIM: **{{recommendedPlan}}** — {{recommendedPlanPrice}} TL/ay
  Sebep: {{recommendationReason}}
{{/personalizedRecommendation}}

PLAN KARSILASTIRMA:

  STARTER — 1.499 TL/ay
    5 kullanici, temel ERP, 1 ShopFloor
    Size: {{#if recommendedPlan=='Starter'}}✓ ONERILIR{{/if}}

  PROFESSIONAL — 3.999 TL/ay  (en cok tercih edilen)
    15 kullanici, sektor modulleri, 5 ShopFloor, WhatsApp, TV pano
    Size: {{#if recommendedPlan=='Professional'}}✓ ONERILIR{{/if}}

  ENTERPRISE — 7.999 TL/ay
    30+ kullanici, multi-tenant, SSO, on-premise, SLA 99.9%
    Size: {{#if recommendedPlan=='Enterprise'}}✓ ONERILIR{{/if}}

YILLIK ODEME -> %20 INDIRIM
  Pro yillik: 38.390 TL (3.199 TL/ay = 800 TL/ay tasarruf)
  = 2 ay ucretsiz gibi

--> [PLAN SEC + ODEME] <--
    https://app.quvex.com/upgrade/{{trialToken}}

Veya beni arayin, 10 dakika content 5 dakikasi plan karari:
  +90 xxx xxx xx xx

Sevgiler,
Ayse

PS: 2 gun sonra trial bitiyor, ama verileriniz 30 gun daha
   korunacak — aciliyet yok demiyorum ama panik de yok.
```

**CTA:** Upgrade sayfasi + telefon/WhatsApp
**Success metrik:** Plan page click ≥ %35, Upgrade start ≥ %15

---

## EMAIL 9 — GUN 13 — "Yarin bitiyor, ozel teklif"

**Gonderim:** Gun 13, 14:00
**Amac:** Last chance urgency + indirim.

### Konu satirlari

- **A:** "Yarin bitiyor — Founders Club %30 indirim bugun"
- **B:** "Son 24 saat {{firstName}} — ozel teklif icin aciyorum"

### Gövde

```
Merhaba {{firstName}},

Son 24 saat. Yarin saat 23:59'da trial bitiyor.

Ben son saatlerde sana bir ozel teklif acabilmek icin yoneticime
basvurdum — cunku {{companyName}} gorunurde ciddi bir degerlendirme
yapiyor ve {{usage_summary}}.

ONAY ALDIM:

**FOUNDERS CLUB — HAYAT BOYU %30 INDIRIM**

Bu ilk 100 musteriye mahsus. Bugun karar verirseniz:

  Pro plan:       3.999 TL/ay -> **2.799 TL/ay** (hayat boyu)
  Pro yillik:    38.390 TL/yil -> **26.873 TL/yil**

  Ek olarak:
  - Ozel rozet: "Founder Member"
  - Aylik 1 saat CTO call (kurucuyla direkt)
  - Feature request oy hakki
  - Yillik Quvex Summit davetiyesi

ANCAK: Sadece bugun (gun 13). Yarin (gun 14) bu teklif tanumsik.

--> [FOUNDERS CLUB UYE OL] <--
    https://app.quvex.com/founders/{{trialToken}}

Veya direkt arayalim:
  +90 xxx xxx xx xx  (benim direkt hattim)
  15:00-18:00 arasi musaidim.

"Son dakika" mesaji degil — gercek. Bu hafta 100. musteriyi
alacagiz, siz 97. olabilirsiniz.

Sevgiler,
Ayse

PS: Trial bittikten sonra bile verileriniz 30 gun korunuyor — ama
   Founders Club indirimi bir daha acilmayacak.
```

**CTA:** Founders Club sayfa + telefon
**Success metrik:** Payment start ≥ %20, Founders signup ≥ %8

---

## EMAIL 10 — GUN 15 — Win-back

**Gonderim:** Gun 15, 10:00 (trial bitimi + 1 gun)
**Amac:** Vazgecenleri geri kazanmak, veri korunma guvencesi.

### Konu satirlari

- **A:** "{{firstName}}, verileriniz 30 gun daha korunuyor — donebilirsiniz"
- **B:** "Trial bitti — ama karar hala size kaldi"

### Gövde

```
Merhaba {{firstName}},

Dun trialiniz bitti. Ama size bir seyi soylemek istedim:

**Verileriniz 30 gun daha korunuyor.**

{{customerCount}} musteri, {{productCount}} urun, {{orderCount}}
siparis — hicbiri silinmedi. Karar icin 30 gun daha zamaniniz var.

NEDEN VAZGECTINIZ? (anket — 2 dakika)

Samimi olarak bilmek istiyorum:
  [ ] Fiyat
  [ ] Mevcut sistemimiz yeterli
  [ ] Zamanlama uygun degil
  [ ] Ozellik eksikligi
  [ ] Anlayamadim
  [ ] Rakibi sectim
  [ ] Diger: ________________

  --> [ANKETE CEVAP VER] <--
      https://quvex.app/feedback/{{trialToken}}

Cevabiniza gore kisisel bir cozum sunmaya calisayim. Belki Starter
plani daha uygun, belki 6 ay sonra gerisi, belki bedava bir egitim
seansi.

Ve bilmenizi istiyorum: **donmek istediginizde 2 tikla hazir.**
Plan secip odeme yapmak yeterli, hicbir sey kaybolmaz.

Sevgiler,
Ayse

PS: Eger rakibi sectiyseniz, hangi rakibi? Cunku benim isim rakip
   analizi yapmak — geri donus almak bile faydali olacak. Durust
   cevap icin tesekkur ederim pesinen.

PPS: 30 gun sonra verileriniz silinecek. O zamana kadar donme firsati
    acik kalacak — ama Founders Club tekrar acilmayacak.
```

**CTA:** Geri besleme anketi + reactivation + Founders Club son sans
**Success metrik:** Win-back ≥ %5, anket cevap orani ≥ %15

---

## Kampanya Yonetim Notlari

### Gönderim kurallari

- **Gun 0-7:** Sadece e-mail. WhatsApp'a baglanma opsiyonel (KVKK onay alinmissa).
- **Gun 8-13:** E-mail + WhatsApp (onay varsa). Urgency fazi.
- **Gun 14-15:** Sadece e-mail. WhatsApp push yapma (rahatsiz edici algilanir).

### Kisisellestirme alanlari

- `{{firstName}}` - kayit formundan
- `{{sector}}` - seçilen sektor (18'den biri)
- `{{companyName}}` - firma adi
- `{{customerCount}}`, `{{productCount}}`, `{{orderCount}}` - trial aktivite (gunluk cron)
- `{{nicheModule}}` - sektor uzerine belirlenen niş modul
- `{{recommendedPlan}}` - usage'a gore algoritmik plan onerisi
- `{{estimatedMonthlySaving}}` - sektor benchmark + kullanima gore hesap

### Unsubscribe / Suppression

- Her e-postada footer "Bu e-postayi almak istemiyorum" linki
- Gun 2'de unsubscribe → kalan kampanya iptal, tek hosguldun gelir
- Gun 9+ unsubscribe → sadece gun 15 win-back gider (opsiyonel toggle)

### A/B Test Plani

- Her e-mail icin 2 konu satiri (A/B)
- %10 test trafigi, kazanan konu %90'e uygulanir
- Gun 1, 7, 13 kritik — burada ekstra variant test

### Test metrikleri (haftalik review)

| Metrik | Hedef | Nasil olcum |
|--------|-------|-------------|
| Open rate | %35 | Sendgrid/Postmark |
| Click rate | %8 | UTM links |
| Trial → Paid | %25 | Stripe/PayTR webhook |
| Unsubscribe | <%2 | Supression list |
| Spam report | <%0.1 | ESP dashboard |

### Email 11+ — Post-conversion onboarding

Musteri odeme yapmissa bu kampanyadan cikar, **post-conversion kampanyasina** gecer:
- Gun +1: Welcome to Quvex family + CSM tanitim
- Gun +7: Ilk haftanin degerlendirmesi
- Gun +30: ROI rapor + NPS anketi
- Gun +90: Case study davet (basari hikayenizi paylasir misiniz?)

> **Master kural:** Her e-posta bir aksiyon icin — aksiyonu net goster, tek CTA. Uzun olma korkusu yok ama onemli kisim ilk 3 satirda olsun.
