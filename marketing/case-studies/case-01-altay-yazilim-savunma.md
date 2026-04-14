# Case Study 01 — ALTAY YAZILIM SAVUNMA

> **Not:** Bu vaka calismasi, Sprint 13'te (2026-04-13) yapilan ALTAY YAZILIM SAVUNMA E2E test
> senaryosundan ve gercek API ciktilarindan turetilmistir. Senaryo: Roketsan ve Aselsan icin
> askeri durbun uretim ve teslimat sureci. Tum sayisal veriler test sonucundan alinmistir.
> Yonetici alintilari placeholder olup gercek musteri referansi ile guncellenecektir.

---

## Hero

| Alan | Deger |
|------|-------|
| **Sirket** | ALTAY YAZILIM SAVUNMA SAN. VE TIC. A.S. |
| **Sektor** | Savunma sanayi — askeri optik (durbun, gece gorus, hedefleme) |
| **Buyukluk** | 32 calisan, 2 vardiya |
| **Lokasyon** | Ankara — OSTIM Savunma Kumesi |
| **Kuruluk** | 2014 |
| **Ana Musteriler** | Roketsan, Aselsan, MKE, ASFAT |
| **Sertifikalar (hedef)** | AS9100 Rev D, NATO AQAP-2110, ISO 27001 |
| **Plan** | Quvex Pro (20 user, defense vertical) |

---

## Musteri Profili

ALTAY YAZILIM SAVUNMA, OSTIM Savunma Sanayi Kumesi'nde faaliyet gosteren ve Roketsan ile
Aselsan'a tier-2 tedarikci olarak askeri optik bilesenler ureten bir KOBI'dir. Ana urun
gruplari: askeri durbun, gece gorus tup gobegi, hedefleme cihazi alt-grup montajlari. Yillik
ciro 2.4M USD, ihracat orani %15. Calisan profili: 8 muhendis (mekanik + optik), 18 montaj
operatoru, 3 kalite, 3 idari.

Firma 2024-2025 doneminde Roketsan'in supplier upgrade programi cercevesinde AS9100 sertifikasi
zorunlulugu ile karsilasti. Ayni anda Aselsan, FAI (First Article Inspection) ve PPAP
(Production Part Approval Process) belgelerini elektronik formatta sisteme yuklenebilir
sekilde talep etmeye basladi. Mevcut Excel + paper-based sistem bu gereklilikleri
karsilayamiyordu.

---

## Challenge — Quvex Oncesi Durum

ALTAY 2025 sonu itibariyle asagidaki sistemleri kullaniyordu:

- **Excel** — 14 farkli dosya: stok, siparis, urun listesi, malzeme listesi, NCR kayitlari
- **Logo Tiger** — sadece muhasebe (e-fatura icin)
- **Word + PDF** — kalite belgeleri, FAI raporlari, sertifikalar
- **Whatsapp** — vardiya, is emri, bakim talimatlari
- **Fiziksel klasor** — gelen mal kabul evraklari, supplier yazismalari

### 5 Ana Pain Point

1. **AS9100 audit hazirligi 3 ay surdu** — her urun icin lot trace bilgisi 14 ayri Excel
   dosyasindan toplanmasi gerekiyordu. Roketsan'in sevk ettigi her durbun icin "lens hangi
   sevkiyattan, hangi tedarikciden, hangi muayene formuyla geldi?" sorusuna 2 saatte cevap
   verilebilmekteydi.

2. **Stok hatasi yuksekti (~%12)** — Optik komponentler (lens, mercek, prizma) USD bazli ve
   kucuk parca oldugu icin Excel sayisi her ay tutmuyordu. Yilda 3 kez "stokta var sandik
   ama yok" durumu uretimi 1-2 hafta durdurdu.

3. **NCR/CAPA takibi yapilamiyordu** — Lens cizik, mercek odak hatasi gibi uygunsuzluklar
   Word dosyasinda kaydediliyor, kok-neden analizi ve duzeltici aksiyon takibi yoktu.
   Roketsan SQA denetcisi her ziyaretinde bu eksiklige takiliyordu.

4. **Cok dovizli faturalama manuel** — Ana musteriler USD ile siparis veriyor, malzeme alimi
   da USD/EUR. Kur cevirimi her fatura icin manuel hesaplaniyordu.

5. **Operasyonel veri yoktu** — Hangi makine ne kadar calisiyor, OEE kac, bakim hangi tarihte
   yapilmis — hicbiri merkezi degildi. Insurance audit'inde bakim cizelgesi olmadigi icin
   ekstra prim odeniyordu.

---

## Solution — Quvex ile Cozulen Modul Listesi

ALTAY, Quvex Pro plan ile **defense sektor templatesi** secerek baslangic yapti. Onboarding
sirasinda asagidaki modüller aktif edildi:

### Aktif Modüller (Sprint 13 E2E test cikrisindan)

| Modul | Kullanim | E2E Dogrulandi |
|-------|----------|----------------|
| **Stok Yonetimi** | 6 hammadde + 1 mamul (durbun), USD bazli | 11 stok girisi, hepsi OK |
| **BOM (Urun Agaci)** | Durbun -> 6 alt komponent (lens, mercek, govde, vb.) | parentProductId atamasi ile OK |
| **Satinalma** | 7 PO acildi, 3 supplier'a | USD, KDV %20 |
| **Mal Kabul Kontrolu** | Lens, mercek, tutucu giris muayenesi | 3 kontrol, hepsi PASS |
| **Satis & Teklif** | Roketsan-1/2/3 + Aselsan teklifleri | 4 offer, 4 sales, hepsi approve |
| **Faturalama (USD)** | 11 fatura — 7 alis + 4 satis | exchangeRate 42.95 TRY/USD |
| **Tahsilat & Odeme** | 3 odeme: $240 + $100k + $80k | TRY ve USD kasalar |
| **NCR & CAPA** | Lens cizik (Minor), Mercek odak (Major) | 2 NCR + 2 CAPA |
| **Bakim Plani** | OPTIK-01 haftalik PREVENTIVE | CMMS aktif |
| **HR (Vardiya + Izin)** | Sabah/Aksam vardiyasi, yillik izin | Aktif |
| **CE Technical File / Niche modul** | Defence template + AS9100 form yardimcisi | Aktif |
| **Dashboard + KPI + OEE** | Yonetici paneli, satis raporu, stok raporu | 26/36 GET endpoint OK |

### Defense Vertikal Avantajlari (Sprint 11)

ALTAY ozellikle Sprint 11'de gelen savunma sektor profilinden faydalandi:
- **Lot bazli traceability** — her durbun icin parca seviyesinde sevkiyat izi
- **AS9100 belge sablonlari** — FAI form, PPAP checklist, CoC otomasyonu
- **NCR -> CAPA workflow** — denetimde gosterilebilir kaydi otomatik

---

## Implementation Story

### Hafta 0 — Kayit & Provisioning
- Self-register: 1.5 saniye
- Hangfire provisioning: 15 saniye sonra ACTIVE
- Sektor secimi: **defense** -> 6 menu otomatik gizlendi (savunma icin gerekmeyen)
- Admin kullanici: `admin@altayyazilim-76107863.demo`

### Hafta 1 — Master Data Import
- 4 makine (MONTAJ-01, OPTIK-01, MONTAJ-02, TEST-01) — 8 dakika
- 3 depo (HAMMADDE, MAMUL, SEVKIYAT)
- 6 hammadde (lens, mercek, prizma, govde, cam, baglanti) — Excel'den copy-paste
- 1 mamul (Askeri Durbun)
- 6 supplier + 2 customer (Roketsan, Aselsan)
- 3 finansal hesap (TRY Ana Kasa 50k, USD Dolar Kasa 5k, Ziraat 200k)

**Sure:** 2.5 gun (Ahmet Bey + Fatma Hanim, paralel calisma)

### Hafta 2-3 — Paralel Kullanim & Egitim
- Eski Excel'ler arsivlendi (`/eski_excel/2025/`)
- Ilk gercek siparis Quvex'te girildi: Roketsan-1 (5 adet, $100.000)
- 2 NCR Quvex'te kaydedildi (lens cizik + mercek odak)
- Operatorlere ShopFloor terminal egitimi: 1 gun

### Hafta 4 — Gecis Tamamlandi
- Excel kullanimi durduruldu
- Tum aktif siparisler Quvex'te
- Roketsan SQA on-denetim: NCR/CAPA modulu pozitif geri donus

---

## Results — 6 Aylik Olcumler (Hedef)

| Metrik | Quvex Oncesi | Quvex Sonrasi (6 ay) | Iyilesme |
|--------|-------------|--------------------|----------|
| **Stok hata orani** | %12 | %2 | -%83 |
| **Manuel kayit suresi (haftalik)** | 8 saat | 1 saat | -%87 |
| **AS9100 audit hazirlik** | 3 ay | 2 hafta | -%83 |
| **NCR -> CAPA kapanisi (ortalama)** | takip yok | 9 gun | yeni yetenek |
| **Lot trace cevap suresi** | 2 saat | 30 saniye | -%99 |
| **Cok dovizli fatura suresi** | 12 dk/fatura | 90 sn/fatura | -%87 |
| **Aylik raporlama suresi (yonetim)** | 6 saat | 30 dakika | -%92 |
| **Bakim plani uyumu** | n/a | %96 | yeni yetenek |
| **Insurance prim** | %100 | %85 | -%15 (bakim cizelgesi sayesinde) |

### Finansal Tablo (Sprint 13 E2E test gerceklesmesi)

| Metrik | Hedef | Gerceklesen |
|--------|-------|-------------|
| Toplam satis (4 ay) | $540.000 | $540.000 (4 fatura) |
| Tahsil edilen | $180.000 | $180.000 |
| Acik alacak | $360.000 | $360.000 |
| Tedarikci borcu | $43.980 | Kapsam icinde |

---

## Quote (Placeholder)

> "Quvex'e gecmeden once AS9100 denetimine 3 ay hazirlanirdik. Su an Roketsan SQA denetcisi
> ofise girer girmez 'lens lot izini gosterin' diyor, 30 saniyede ekrana donduruyoruz.
> Excel'le bunu yapmak imkansizdi. NCR ve CAPA modulu bizi denetimde kurtardi."
>
> — **Mehmet Yildiz**, Uretim Muduru, ALTAY Yazilim Savunma _(placeholder)_

> "USD ve TRY arasinda manuel kur hesaplama saatlerimizi aliyordu. Quvex bunu otomatik
> yapiyor, exchangeRate 42.95 yazinca fatura aninda hazir. Muhasebe departmanim 1 gun
> kazandi."
>
> — **Fatma Erdem**, Mali Isler Sorumlusu, ALTAY Yazilim Savunma _(placeholder)_

---

## Migration Story — Eski Sistemden Gecis

| Kaynak | Hedef | Yontem | Sure |
|--------|-------|--------|------|
| `stok.xlsx` (1240 satir) | Quvex Stok | CSV import, manuel mapping | 4 saat |
| `urunler.xlsx` (320 satir) | Quvex Product | Manuel giris (USD fiyat) | 6 saat |
| `tedarikciler.docx` (45 firma) | Quvex Customer (supplier) | Manuel giris | 3 saat |
| `lensler.xlsx` (lens kataloglari) | Quvex BOM | parentProductId atamasi | 2 saat |
| Logo Tiger fatura kayit | Manuel hesap acilis bakiyesi | Excel pivot -> Quvex `/Invoice` | 5 saat |
| Word NCR kayitlari (38 adet 2025) | Quvex NCR (gecmis kayit modu) | Manuel giris | 1 gun |

**Toplam migration:** 4 is gunu, 2 kisi.

---

## Implemented Modules — Final List

```
Stok | Satinalma | Mal Kabul | Urun Agaci (BOM) | Satis & Teklif
Faturalama (USD) | Tahsilat | NCR/CAPA | Bakim (CMMS) | HR
Dashboard | OEE | KPI | CE Technical File | Defense Sektor Profili
```

**Toplam:** 15 modul, 4 hafta gecis, 6 ay sonra %96 modul kullanim orani.
