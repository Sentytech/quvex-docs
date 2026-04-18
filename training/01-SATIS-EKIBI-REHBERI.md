# Quvex ERP — Satis Ekibi Rehberi
## Savunma & Havacilik Sektoru Ozel

**Hedef kitle:** Satis ekibi, is gelistirme, pre-sales muhendisleri
**Amac:** Savunma sanayindeki musteriye degerimizi anlatabilmek

---

## 1. SEKTOR BILGISI — Savunma Sanayi Nasil Calisir?

### 1.1 Kim Kimdir?

| Firma Tipi | Ornekler | Quvex Hedefi |
|-----------|----------|-------------|
| **Ana yuklenici (OEM)** | TUSAS, ASELSAN, Roketsan, TAI, BMC | Degil (cok buyuk) |
| **Tier 1 tedarikci** | Alp Havacilik, KALE Arge, TEI, Nurol | Belki (50-200 kisi) |
| **Tier 2-3 tedarikci** | CNC atolyeleri, kaplama firmalari, kablo uretimi | **ASIL HEDEFIMIZ** |
| **Bakim/Onarim (MRO)** | THY Teknik, Havelsan | Degil (farkli yazilim) |

### 1.2 Neden AS9100?

- Savunma tedarik zincirinde calismak icin **AS9100 sertifikasi zorunlu**
- AS9100 = ISO 9001 + havacilik/savunma ek gereksinimleri
- Sertifikasyon olmadan TUSAS/ASELSAN'a parca satamaz
- Sertifikasyon surecinde **dokumante edilmis kalite sistemi** sart
- **Burada biz devreye giriyoruz** — Quvex bu dokumantasyonu otomatik uretir

### 1.3 Musterinin Gunluk Hayati

```
Sabah 08:00 — TUSAS'tan siparis maili gelir
  ↓ "50 adet Ti-6Al-4V parcasi, Rev.C cizimine gore, 45 gun teslim"
  ↓ Sertifikali hammadde kullanilacak (izlenebilirlik zorunlu)

Is emri acilir → CNC tezgaha verilir → Giris muayene → Isleme → Olcu kontrol
  ↓ NCR cikarsa → CAPA baslatilir → Kök neden analizi
  ↓ Her parca seri numarali → Data pack dosyasi hazirlanir

Teslim → CoC (Uygunluk Sertifikasi) + Fatura + Sevkiyat
```

**Bu akisin TAMAMI Quvex'te var.**

### 1.4 Musterinin Acisi (Pain Points)

| Aci | Detay | Quvex Cozumu |
|-----|-------|-------------|
| "Excel cehenneminde yasiyoruz" | NCR, CAPA, FAI, CoC hep Excel | 20+ kalite modulu |
| "Denetciye data bulamiyoruz" | Audit oncesi panic | Audit trail + dokuman yonetimi |
| "Izlenebilirlik elden gidiyor" | Hangi lot, hangi parcada, kime gitti? | Seri no + lot + genealogy |
| "ERP var ama kalite yok" | Logo/Netsis kullaniyorlar ama kalite ayri | ERP + QMS tek platform |
| "Her sertifikasyonda deli oluyoruz" | 2 hafta hazirliyorlar | Quvex'te gunluk olarak hazirlaniyor |
| "Fason takip edemioyurz" | Kaplama/boya/isil islem fason | Fason siparis modulu |

---

## 2. SATIS KONUSMASI — Ne Soylemeli?

### 2.1 Acilis (30 saniye)

> "Biz Quvex'i, sizin gibi havacilik/savunma tedarikcilerinin hem uretim hem kalite yonetimini **tek platformda** yapabilmesi icin gelistirdik. Turkiye'de AS9100 uyumlu, uretim + kalite birlesik bir ERP **baska yok.**"

### 2.2 3 Temel Mesaj

**1. Tek platform** — "ERP ayri, kalite ayri degil. Siparis → Uretim → Kalite → Fatura tek akista."

**2. AS9100 hazir** — "NCR, CAPA, FAI, FMEA, SPC, CoC, MRB, kontrol plani, egitim takibi... 20+ kalite modulu hazir. Denetciye tek tikla rapor."

**3. Izlenebilirlik** — "Hangi hammadde, hangi lot, hangi tezgahta, kim isledi, olcusu ne, kime gitti — hepsi kayitli. Data pack otomatik."

### 2.3 Sik Gelen Itirazlar

| Itiraz | Cevap |
|--------|-------|
| "Logo kullaniyoruz zaten" | "Logo'nun kalite modulu yok. Siz simdiye kadar NCR'lari nerede takip ediyorsunuz? Excel? Biz Logo'nun ustune geliyoruz, Logo'yu degistirmenize gerek yok — muhasebe Logo'da kalsin, uretim ve kalite Quvex'te olsun." |
| "Cok pahali olur" | "Baslangic 1.499 TL/ay. Bir denetim oncesi hazirliga harcadiginiz efor buna deger. Ustelik 14 gun ucretsiz deneme." |
| "Biz kucuguz, bize fazla" | "CNC profili sectiginde sadece 9 menu gorunur. Karmasik degil. Buyudukce modul acarsın." |
| "Cloud'a guvenemeyiz, savunma verisi" | "Tier 2 planimizda size ozel database verilir, verileriniz baska tenant'lardan fiziksel olarak ayrilir. AES-256 sifreli. On-premise seceneği de planlaniyor." |
| "Baska ERP denedik, vaz gectik" | "Bizde sektor profili var — havacilik sectiginde size ozel arayuz gelir. 60+ ekran degil, sadece sizin ihtiyaciniz olan 25 ekran." |

### 2.4 Demo Senaryosu (15 dakika)

```
1. Giris → Havacilik profili secilmis dashboard goster (2 dk)
2. Siparis olustur: "TUSAS'tan 50 adet parca siparisi" (2 dk)
3. Is emri olustur → Gantt'ta goster (2 dk)
4. Atolye terminali: Operator gorusu (1 dk)
5. NCR ac: "Olcu tolerans disi" → CAPA baslat (3 dk)
6. CoC (Uygunluk Sertifikasi) otomatik olustur (1 dk)
7. Fatura kes (1 dk)
8. Yardim butonu (?) tiklat — "Bakin her ekranda Turkce yardim var" (1 dk)
9. Audit trail goster — "Denetciye bunu gostereceksiniz" (2 dk)
```

---

## 3. FIYATLANDIRMA

| Plan | Fiyat | Kime | Icindekiler |
|------|-------|------|------------|
| **Baslangic** | 1.499 TL/ay (5 kull.) | Yeni kurulan tedarikci | Uretim + Stok + Satis + Fatura |
| **Profesyonel** | 3.999 TL/ay (20 kull.) | Mevcut tedarikci | + Kalite + Bakim + MRP + Mobil |
| **Kurumsal** | 7.999 TL/ay (30 kull.) | AS9100 zorunlu firma | + Tam AS9100 + AI + API + Tier 2 DB |
| **Savunma Paketi** | 9.999 TL/ay (50 kull.) | Tier 1-2 tedarikci | + Dedicated DB + KVKK + on-prem opsiyon |
| Ek kullanici | +199 TL/kull./ay | — | — |

### Indirim Politikasi
- Yillik odeme: %15 indirim
- 3+ yil taahhut: %25 indirim
- Pilot musteri (ilk 10): 3 ay ucretsiz + Enterprise plan

---

## 4. HEDEF MUSTERI PROFILI

### Ideal musteri:
- 10-100 calisan
- CNC/torna/freze atolyesi veya kaplama/isil islem firması
- AS9100 sertifikasi var veya almayi planliyor
- TUSAS, ASELSAN, Roketsan, TAI gibi OEM'lere parca tedarik ediyor
- Simdi Excel + Logo/Mikro kullaniyor
- Konum: Ankara (OSTIM, Ivedik), Eskisehir, Istanbul, Bursa, Kayseri

### Nereden bulunur?
- OSTİM OSB dernek uyeleri listesi
- SASAD (Savunma Sanayii Dernegi) uye listesi
- TUSAS/ASELSAN tedarikci portallari
- AS9100 sertifika kuruluslari (BSI, TUV) musteri referanslari
- Savunma fuarlari: IDEF, SAHA Expo
- LinkedIn: "AS9100", "havacilik kalite", "CNC savunma" aramalari

---

## 5. RAKIP KIYASLAMA (MUSTERI ONUNDE)

| Ozellik | Quvex | Logo Tiger | QT9 QMS | Odoo |
|---------|-------|-----------|---------|------|
| Uretim takibi | Guclu | Zayif | Yok | Orta |
| AS9100 kalite (NCR, CAPA, FAI...) | 20+ modul | Yok | 25+ modul | Yok |
| Turkce | Evet | Evet | Hayir | Evet |
| e-Fatura | Planli | Evet | Hayir | Eklenti |
| Fiyat (5 kull.) | 1.499 TL | 3.000+ TL | ~$500 | $125 |
| Uretim + Kalite tek platform | **EVET** | Hayir | Hayir | Hayir |
| Veri izolasyonu (savunma) | Tier 2 DB | Yok | Cloud | Yok |
| Mobil (atolye) | Evet | Sinirli | Hayir | Sinirli |

**En buyuk farkimiz: ERP + QMS tek platform. Rakipler ya ERP ya QMS — ikisi birden biz.**
