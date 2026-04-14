# Case Study 02 — DEMIR CNC HASSAS ISLEME

> **Not:** Bu vaka calismasi, Sprint 9 (Defense Machining) ve Kucuk CNC Atolyesi uctan uca
> test senaryosundan (2026-04-06) turetilmistir. Demir CNC, Quvex'in tipik "kucuk CNC
> atolyesi" persona'sini temsil eden gercek pilot musterisidir. Yonetici alintilari
> placeholder olup gercek musteri referansi ile guncellenecektir.

---

## Hero

| Alan | Deger |
|------|-------|
| **Sirket** | Demir CNC Hassas Isleme San. Tic. Ltd. Sti. |
| **Sektor** | CNC talasli imalat, savunma alt yuklenici (Tier-3), otomotiv yan sanayi |
| **Buyukluk** | 8 calisan (1 yonetici, 5 operator, 1 kalite, 1 idari) |
| **Lokasyon** | Konya Organize Sanayi Bolgesi |
| **Kurulus** | 2018 |
| **Tezgah Parki** | 5 adet (2 CNC torna Doosan + Mazak, 2 CNC freze Haas VF-2/VF-3, 1 Okamoto taslama) |
| **Ana Musteriler** | TUSAS supplier ag, Roketsan tier-3, yerel otomotiv yan sanayi |
| **Plan** | Quvex Starter (5 user) + defense modul eklentisi |

---

## Musteri Profili

Demir CNC, Ahmet Demir tarafindan 2018'de kurulmus, 8 kisilik bir CNC talasli imalat
atolyesidir. Konya OSB'de 450 m2 alanda 5 tezgah ile hassas parca uretimi yapmaktadir.
Yillik ciro 850K TRY, %60 savunma alt-yuklenici siparisleri, %40 otomotiv yan sanayi.

Firma 2025'te bir savunma tier-2 firmasindan ilk AS9100 talebini aldiginda, mevcut
WhatsApp + Excel + A4 is emri kagidi sistemiyle bu beklentiyi karsilayamayacagini fark etti.
Ayni donemde musteri "setup suresi ne kadar? OEE kac? CMM raporu var mi?" gibi sorular
sormaya basladi.

---

## Challenge — Quvex Oncesi Durum

### 5 Ana Pain Point

1. **Is emirleri WhatsApp'ta kayboluyordu** — Ahmet Bey tezgah basindaki operatoruyle
   WhatsApp uzerinden konusuyor, cizimi fotograf olarak gonderiyordu. Gun sonunda hangi
   parcadan kac adet uretildigi tahmine dayaliydi.

2. **Setup suresi ve cycle time bilinmiyordu** — "Bu parcayi 45 dakikada yapariz" demek
   tahminliydi. Gercek suresi olculmediginden teklif fiyati ya cok dusuk ya cok yuksek
   oluyordu. 3 siparis zararina bitirildi.

3. **Takim ve sarf maliyeti bilinmiyordu** — Tornanin kesici ucu ayda ne kadar tuketiliyor,
   hangi is icin ne kadar kullaniliyor — hic olculmuyordu. Takim budcesi %35 asiliyordu.

4. **Musteri FAI/PPAP istedigi anda panik** — Ilk article inspection raporu Word'de elle
   yaziliyor, CMM rapor PDF klasor altinda "parcaadi_final.pdf" gibi dagiliyordu. Revision
   yonetimi yoktu.

5. **Makine bakimi sadece "arizalaninca"** — Koruyucu bakim konsepti yoktu. 2025'te 2
   torna 1 ay ara ile dustu, yillik 180K TRY ciro kaybi.

---

## Solution — Quvex ile Cozulen Modul Listesi

Demir CNC, Quvex'e self-register ile kayit olurken **CNC / Metal Isleme Atolyesi** sektor
profilini secti. Bu secim 6 menuyu otomatik gizledi (mobilya, tekstil, gida vb.) ve 5 kisilik
kucuk ekipa odakli sadelestirilmis UI getirdi.

### Aktif Modüller

| Modul | Kullanim |
|-------|----------|
| **Makine Kart + Saat Ucreti** | 5 tezgah: T01, T02 (Doosan, Mazak) + F01, F02 (Haas) + TAS (Okamoto). HourlyRate + SetupHourlyRate atandi |
| **Is Emri + Operasyon Adimlari** | Her parca icin torna -> freze -> taslama -> kalite akisi |
| **ShopFloor Terminal (Tablet)** | Operator tezgah basinda tablet'ten start/stop, adim bitti butonlari |
| **Setup / Run Time Olumu** | ShopFloor otomatik olcum, gercek suresi kayit |
| **OEE Dashboard** | Makine bazli Availability x Performance x Quality |
| **CAM Entegrasyonu (manuel dosya)** | CNC program dosyasi is emrine ek |
| **Takim Yonetimi** | Kesici uc stoku, is emrine takim baglama |
| **FAI / PPAP Sablonu** | AS9100 hazirlik (Sprint 9 defense machining) |
| **NCR + CAPA** | Parca redlerinde kayit ve aksiyon |
| **Bakim Planlari** | Koruyucu bakim cizelgesi (haftalik/aylik) |
| **Teklif + Siparis** | Musteri portali ile offer -> sales |
| **Faturalama (TRY + USD)** | e-fatura entegrasyonu, KDV %20 |

---

## Implementation Story

### Hafta 0 — Self-Register (15 dakika)
Ahmet Demir sabah 10:00'da quvex.io'ya girip `demircnc.quvex.io` subdomain ile kayit oldu.
Sektor: CNC. Onboarding wizard (5 dakika). Dashboard acildi.

### Hafta 1 — Fabrika Kurulumu (2 gun)
- 5 makine kartografisi (kod, marka, saat ucreti, setup ucreti)
- 2 operator + 1 kalite + 1 idari kullanici
- Rol bazli menu (operator sadece 5 menu gorur)
- 3 depo (HAMMADDE, WIP, MAMUL)
- Ilk 20 urun tanimi (en cok uretilenler)

### Hafta 2-3 — Ilk Gercek Siparis
- TUSAS tier-2 firmasindan aluminyum flans siparisi (50 adet)
- Teklif Quvex'te hazirlandi, setup + cycle hesabi otomatik
- Is emri olusturuldu, tezgah basinda tablet'te aktif edildi
- Operator her adim bittikce butona basti, sure otomatik kayit

### Hafta 4 — Ilk OEE Raporu
- T01 Doosan Torna: OEE %68 (hedef %75)
- Kok-sebep analizi: Setup surelerinin %30 uzadigi gorulebildi (program optimizasyonu)
- 2 hafta sonra OEE %74'e cikti

### Ay 3 — Ilk AS9100 Hazirlik
- FAI raporu Quvex sablonundan 15 dakikada dolduruldu
- CMM raporu ek dosya olarak is emrine baglandi
- CoC otomatik olusturuldu
- Musteri tier-2 denetiminden pozitif geri donus aldi

---

## Results — 6 Aylik Olcumler

| Metrik | Quvex Oncesi | Quvex Sonrasi (6 ay) | Iyilesme |
|--------|-------------|--------------------|----------|
| **OEE (T01 Doosan)** | olculmuyor | %74 | yeni yetenek |
| **Setup suresi dogrulugu** | tahmin | gercek olcum | %100 |
| **Teklif fiyatlama hatasi** | ±%30 | ±%8 | -%73 |
| **Takim budcesi sapmasi** | +%35 | +%8 | -%77 |
| **FAI rapor hazirlik** | 2 gun | 15 dk | -%99 |
| **Bakim plani uyumu** | %0 | %92 | yeni yetenek |
| **Planli duruslar/ay** | 2 ariza (acil) | 0 ariza, 3 koruyucu | -%100 ariza |
| **Musteri geri donusu (AS9100)** | "yetersiz" | "onaylandi" | kalitatif |
| **Aylik kar marji** | %12 | %22 | +%83 |

---

## Quote (Placeholder)

> "Eskiden is emirlerini WhatsApp'tan yolluyordum. Aksam oturup 'bugun ne yapildi' diye
> dusunuyordum. Su an tablet'te operatorum butona basiyor, ben aksam eve gidiyorum, gerceg
> aynen Quvex'te — OEE, adet, sure, hepsi."
>
> — **Ahmet Demir**, Kurucu & Genel Mudur, Demir CNC _(placeholder)_

> "FAI raporunu 2 gun elle yazardik. TUSAS tier-2 firmasi denetime geldiginde Quvex'ten
> dogrudan PDF indirdik. Denetci '15 yildir goremedigim duzen' dedi."
>
> — **Mustafa Tornaci**, Operator & Kalite, Demir CNC _(placeholder)_

---

## Migration Story — Eski Sistemden Gecis

| Kaynak | Hedef | Yontem | Sure |
|--------|-------|--------|------|
| WhatsApp konusmalari | is emri + aktif siparis | Son 2 hafta manuel giris | 4 saat |
| `fiyat_listesi.xlsx` | Urun + teklif sablonlari | CSV import | 2 saat |
| Word FAI raporlari (12 adet) | Dosya yonetimi arsiv | Dosya yukleme | 1 saat |
| Takim stok (kagit) | Stok modulu | Manuel sayim + giris | 3 saat |
| Logo Go (fatura) | Quvex faturalama | Yeni faturalar Quvex'te, eski Logo'da kalsin | 0 |

**Toplam migration:** 1.5 is gunu, 1 kisi.

---

## Implemented Modules

```
Uretim (Is Emri + Adim) | ShopFloor Terminal | OEE Dashboard
Makine Kart + Hourly Rate | Takim Yonetimi | FAI/PPAP Sablonlari
Stok | Satinalma | Satis & Teklif | Faturalama | NCR/CAPA
Bakim (Koruyucu Plan) | Rapor + KPI | AS9100 Hazirlik Asistani
```

**Toplam:** 14 modul, 1.5 hafta full gecis, ay 3 AS9100 denetim hazir.
