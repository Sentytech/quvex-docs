# Quvex ERP - Is Bilgisi ve Uretim Surecleri Rehberi

> Bir uretim fabrikasinda gunluk isler nasil yurur, hangi departman ne yapar,
> siparisler nasil dogup urunlere donusur — hepsini bu dokumanda bulacaksiniz.

---

## Icindekiler

1. [Fabrika Nedir? Buyuk Resim](#1-fabrika-nedir-buyuk-resim)
2. [Bir Siparisin Hayat Dongusu](#2-bir-siparisin-hayat-dongusu)
3. [Departmanlar ve Roller](#3-departmanlar-ve-roller)
4. [Stok ve Depo Yonetimi](#4-stok-ve-depo-yonetimi)
5. [Uretim Planlama ve MRP](#5-uretim-planlama-ve-mrp)
6. [Kalite Yonetimi](#6-kalite-yonetimi)
7. [Satin Alma Sureci](#7-satin-alma-sureci)
8. [Satis ve Teklif Sureci](#8-satis-ve-teklif-sureci)
9. [Muhasebe ve Faturalama](#9-muhasebe-ve-faturalama)
10. [Bakim Yonetimi ve OEE](#10-bakim-yonetimi-ve-oee)
11. [Insan Kaynaklari ve Vardiya](#11-insan-kaynaklari-ve-vardiya)
12. [Temel Kavramlar Sozlugu](#12-temel-kavramlar-sozlugu)
13. [Gercek Senaryo Ornekleri](#13-gercek-senaryo-ornekleri)

---

## 1. Fabrika Nedir? Buyuk Resim

Bir uretim fabrikasini soyle dusunun:

```
HAMMADDE GIRER  -->  ISLEM GORUR  -->  URUN CIKAR

  Celik levha         CNC kesim          Ucak parcasi
  Aluminyum           Torna isleme       Otomobil parcasi
  Plastik granul      Freze              Makine komponenti
  Elektronik parcalar Montaj             Medikal cihaz
  Boya, kimyasal      Boyama/Kaplama     Savunma sanayi parcasi
```

### Quvex Kimin Icin?

Quvex ozellikle **10-200 calisan arasi** kucuk/orta olcekli fabrikalari hedefler:
- **CNC taslama atolyeleri** (havaclik parcasi ureten)
- **Metal isleme fabrikalari** (otomotiv parcasi ureten)
- **Plastik enjeksiyon** tesisleri
- **Elektronik montaj** atolyeleri
- **Savunma sanayi** alt yuklenicileri (AS9100 sertifika zorunlulugu)

Bu fabrikalar genelde:
- 5-50 arasi makine (CNC, torna, freze, taslama...)
- 10-200 calisan
- Ayda 50-500 arasi is emri
- 100-5000 arasi farkli urun/parca
- 20-200 arasi musteri
- Havaclik/otomotiv/savunma sektoru kalite gereksinimleri

---

## 2. Bir Siparisin Hayat Dongusu

Bu bolum projenin EN ONEMLI is akisidir. Bir musterinin "su parcadan 100 adet istiyorum"
demesinden, parcalarin uretilip faturalanmasina kadar olan tum sureci anlatir.

```
MUSTERI                  FABRIKA                          TEDARIKCI
-------                  -------                          ----------

"100 adet               Teklif hazirla
 X parcasi               (fiyat, termin)
 istiyorum"                  |
    |                        v
    |<--- Teklif gonder ----+
    |
    +--- "Tamam, onay" ---->+
                             |
                        Siparis olustur
                             |
                        MRP calistir
                        "Hangi malzeme lazim?"
                             |
                    +--------+--------+
                    |                 |
               Stokta var        Stokta yok
                    |                 |
                    |           Satin alma talebi ---> Tedarikci
                    |                 |                    |
                    |                 |<-- Malzeme geldi --+
                    |                 |
                    +--------+--------+
                             |
                        IS EMRI OLUSTUR
                        "Hangi makinede,
                         kim yapacak?"
                             |
                        URETIM BASLA
                        (CNC kes, torna isle,
                         freze, montaj...)
                             |
                        KALITE KONTROL
                        "Olcu tuttu mu?
                         Yuzey kalitesi?"
                             |
                    +--------+--------+
                    |                 |
                 UYGUN            UYGUNSUZ
                    |                 |
                    |            NCR ac
                    |            (Neden bozuk?)
                    |            CAPA baslat
                    |            (Nasil onleriz?)
                    |                 |
                    +--------+--------+
                             |
                        STOKA GIRIS
                        (Lot numarasi ata)
                             |
                        SEVKIYAT
                        (Paketle, gonder)
                             |
                        FATURA KES
                             |
                        ODEME TAKIBI
                        "Para geldi mi?"
```

### Bu Akisin Sistemdeki Karsiliklari

| Gercek Hayat | Sistemdeki Modul | Ana Tablo |
|-------------|------------------|-----------|
| Musteri teklif ister | Satis > Teklif | `Offers` + `OfferProducts` |
| Siparis olusur | Uretim > Siparisler | `Productions` |
| Malzeme ihtiyaci belirlenir | Uretim > MRP | `BomExplosion` + `NetRequirement` |
| Malzeme satin alinir | Satinalma | `StockRequests` + `StockRequestOffers` |
| Malzeme depoya gelir | Stok > Giris/Cikis | `StockReceipt` + `StockReceiptDetail` |
| Is emri acilir | Uretim > Siparisler | `WorkOrder` + `WorkOrderSteps` |
| Operator uretim yapar | Uretim > Calisma Kayitlari | `WorkOrderLogs` |
| Kalite kontrol edilir | Kalite > Giris Kontrol | `IncomingInspection` |
| Uygunsuzluk bulunursa | Kalite > NCR | `NonConformanceReport` |
| Urun stoga girer | Stok > Giris/Cikis | `StockReceipt` + `StockLot` |
| Urun sevk edilir | Muhasebe > Sevk | `ShippingDetails` |
| Fatura kesilir | Muhasebe > Faturalar | `Invoice` + `InvoiceItem` |
| Odeme alinir | Muhasebe > Odemeler | `Payment` |

---

## 3. Departmanlar ve Roller

### Satis Departmani
**Ne yapar:** Musteri bulur, teklif hazirlar, siparis alir, musteri iliskilerini yonetir.

- **Musteri Karti:** Her musterinin iletisim, vergi, banka, odeme vadesi, kategori (A/B/C) bilgileri
- **Teklif:** Hangi urun, kac adet, birim fiyat, toplam tutar, gecerlilik suresi
- **Satis:** Onaylanan tekliflerin siparise donusmesi

**Ornek:** Musteri "THY" bize "Ucak X'in Y parcasindan 500 adet" icin teklif istiyor.
Satis departmani maliyetleri hesaplar, kar marji ekler, teklifi hazirlar.

### Uretim Planlama
**Ne yapar:** Siparisleri makinelere dagitir, uretim sirasini belirler, terminleri planlar.

- **Siparis:** Musteri siparisi + urun + miktar + termin tarihi
- **Is Emri:** Bir siparisin fabrikadaki "yapilacaklar listesi"
- **Is Emri Adimlari:** Sirayla yapilacak islemler (1. CNC kesim, 2. Torna, 3. Taslama...)
- **Gantt:** Hangi makine ne zaman bos, hangi is ne zaman baslar

**Ornek:** 500 adetlik siparis icin:
- 1. Adim: CNC'de kesim (3 gun)
- 2. Adim: Torna'da isleme (2 gun)
- 3. Adim: Taslama (1 gun)
- 4. Adim: Boyama (1 gun)
- 5. Adim: Kalite kontrol (0.5 gun)

### Depo / Stok
**Ne yapar:** Hammadde ve urunleri saklar, giris/cikis yapar, sayim yapar.

- **Stok Karti:** Her urun/malzemenin mevcut miktar, minimum stok, depo konumu
- **Stok Giris:** Tedarikci malzeme getirdi, uretime girmeden depoya koyduk
- **Stok Cikis:** Uretim icin depodan malzeme aldik
- **Stok Sayim:** Fiziksel olarak sayip sistemle karsilastirma
- **Lot/Parti:** Ayni urunun farkli uretim partileri (izlenebilirlik icin)

**Ornek:** Depoda 200 kg aluminyum levha var. Uretim 50 kg istedi. Stok cikisi yapildi.
Kalan: 150 kg. Minimum stok 100 kg. Henuz uyari yok. Ama 80 kg daha ciksa uyari gelecek.

### Kalite
**Ne yapar:** Uretilen urunlerin teknik cizime ve standartlara uygunlugunu kontrol eder.

- **Giris Kontrol:** Tedarikciden gelen malzemeyi kontrol et
- **Proses Kontrol:** Uretim sirasinda olcum yap
- **Final Kontrol:** Biten urunu musteriye gondermeden kontrol et
- **NCR (Uygunsuzluk):** "Bu parca bozuk cikti" kaydini tutma
- **CAPA:** "Neden bozuk cikti ve bir daha olmasin diye ne yapacagiz?"
- **Kalibrasyon:** Olcum aletlerinin (mikrometre, kaliper) duzenli kalibrasyon kaydi

**Ornek:** CNC'den cikan parcanin capi 25.00 mm olmali. Olctuk 25.03 mm cikti.
Tolerans +/- 0.05 mm. Uygun! Ama 25.08 mm ciksaydi uygunsuzluk (NCR) acardik.

### Satin Alma
**Ne yapar:** Uretim icin gereken hammadde ve malzemeyi tedarikci firmalardan satin alir.

- **Satin Alma Talebi:** "Suna ihtiyacimiz var" resmi istegi
- **Teklif Toplama:** 3 tedarikci'den fiyat isteme
- **Siparis Verme:** En uygun tedarikci'ye siparis
- **Teslimat Takibi:** Malzeme ne zaman gelecek?

**Ornek:** MRP "500 adet uretim icin 600 kg aluminyum lazim, stokta 150 kg var,
450 kg satin alinmali" dedi. Satin alma 3 tedarikci'den teklif aldi, en uygununa siparis verdi.

### Muhasebe
**Ne yapar:** Fatura keser, odemeleri takip eder, cari hesaplari yonetir.

- **Fatura:** Urun/hizmet karsiligi resmi belge (KDV dahil)
- **Irsaliye/Sevk:** Malzemenin fiziksel olarak gonderilmesi
- **Odeme:** Musteriden gelen para veya tedarikci'ye yapilan odeme
- **Cari Hesap:** Musteri/tedarikci ile karsilikli borc/alacak durumu

**Ornek:** 500 adet parca x 100 TL = 50.000 TL + %20 KDV = 60.000 TL fatura kesildi.
Musteri 30 gun vadeli oder. 30 gun sonra 60.000 TL odeme bekleniyor.

### Bakim
**Ne yapar:** Makinelerin duzenli bakim ve onarimini planlar, arizalari kayit altina alir.

- **Periyodik Bakim:** Her 500 saatte yag degisimi, her ayda filtre degisimi
- **Ariza Kaydi:** Makine bozuldu, ne oldu, ne kadar durdu
- **OEE:** Makinenin ne kadar verimli calistigini gosteren metrik

**Ornek:** CNC-01 makinesi 3 ayda bir yag degisimi gerektirir.
Son degisim 2.5 ay once yapildi. 2 hafta sonra bakimi var — sistem uyari verir.

### IK (Insan Kaynaklari)
**Ne yapar:** Personel bilgilerini tutar, vardiya planlamasi yapar.

- **Personel Karti:** Ad, pozisyon, departman, giris tarihi
- **Vardiya:** Sabah 06-14, Ogle 14-22, Gece 22-06
- **Yetkinlik:** Hangi operator hangi makineyi kullanabilir

---

## 4. Stok ve Depo Yonetimi

### Stok Turleri

Fabrikada 4 tur stok vardir:

| Tur | Aciklama | Ornek |
|-----|----------|-------|
| **Hammadde** (MATERIAL) | Dis kaynaktan satin alinan, islenmemis malzeme | Celik cubuk, aluminyum levha, vida |
| **Yari Mamul** (SEMI_FINISHED) | Fabrikada islenmis ama henuz bitmemis urun | Kesimden cikan ama tornasi yapilmamis parca |
| **Mamul** (FINISHED) | Uretimi tamamlanmis, musteriye gonderilecek urun | Bitmis ucak parcasi |
| **Stok** (STOCK) | Genel depo kalemi (sarfmalzeme vb.) | Eldiven, yag, kesici ucu |

### Urun Agaci (BOM - Bill of Materials)

Bir urun baska urunlerden olusabilir. Buna **Urun Agaci** veya **BOM** denir.

```
UCAK PARCASI X (Mamul)
├── Alt Parca A (Yari Mamul) x 2 adet
│   ├── Aluminyum Levha (Hammadde) x 0.5 kg
│   └── Vida M6 (Hammadde) x 4 adet
├── Alt Parca B (Yari Mamul) x 1 adet
│   ├── Celik Cubuk (Hammadde) x 0.3 kg
│   └── Rondela (Hammadde) x 2 adet
└── Boya (Hammadde) x 0.1 lt
```

Bu agac sayesinde "100 adet X uretmek icin ne kadar malzeme lazim?" sorusunu cevaplariz.
Buna **BOM Patlatma (BOM Explosion)** denir.

### Min/Max Stok ve Otomatik Satin Alma

- **Minimum Stok:** Bu seviyenin altina duserse uyari ver (ornek: 100 kg aluminyum)
- **Maximum Stok:** Bu seviyenin ustune cikmamali (depo kapasitesi siniri)
- **Guvenlik Stoku:** Tedarik gecikmelerine karsi ekstra tutulan miktar
- **Otomatik Satin Alma:** Stok minimum seviyenin altina dusunce otomatik talep olustur

### Lot/Parti Takibi

Havaclik sektorunde **izlenebilirlik** zorunludur. Her malzeme partisinin:
- Nereden geldigi (tedarikci, fatura no)
- Ne zaman geldigi
- Hangi urunde kullanildigi
- Son kullanma tarihi (varsa)

kayit altina alinir. Bir parca bozuk cikarsa, ayni partideki diger parcalar da takip edilir.

### Stok Degerleme

Stoktaki malzemenin maddi degeri nasil hesaplanir?

| Yontem | Aciklama | Ornek |
|--------|----------|-------|
| **FIFO** | Ilk giren ilk cikar. En eski malzeme once tuketilir | 100 kg x 50 TL (eski), 100 kg x 60 TL (yeni). 50 kg cikis = 50 x 50 TL = 2.500 TL |
| **Ortalama Maliyet** | Tum maliyetlerin ortalamasi alinir | (100x50 + 100x60) / 200 = 55 TL/kg. 50 kg cikis = 50 x 55 TL = 2.750 TL |

### Barkod Islemleri

Her urune barkod atanabilir. Barkod okuyucu ile:
- Stok giris/cikis hizlanir
- Sayim kolaylasir
- Hatali urun girisi azalir

---

## 5. Uretim Planlama ve MRP

### Is Emri Nedir?

**Is Emri = Fabrikaya "su urunu uret" diyecek resmi belge**

Bir is emri sunlari icerir:
- Hangi urun uretilecek
- Kac adet
- Hangi makinelerde islenecek
- Islem siralamasi (adimlar)
- Baslangic ve bitis tarihi
- Atanan operator

### Is Emri Adimlari (Work Order Steps)

Bir urunun uretimi icin sirayla yapilacak islemler:

```
IS EMRI: Ucak Parcasi X - 100 adet

Adim 1: CNC Kesim         Makine: CNC-01    Sure: 4 saat    Operator: Ahmet
Adim 2: Torna Isleme      Makine: TORNA-03  Sure: 6 saat    Operator: Mehmet
Adim 3: Taslama            Makine: TASL-02   Sure: 2 saat    Operator: Ali
Adim 4: Yuzey Isleme       Makine: BOYA-01   Sure: 3 saat    Operator: Veli
Adim 5: Kalite Kontrol     Makine: -         Sure: 1 saat    Operator: Ayse
```

### Is Emri Sablonlari

Ayni urunu tekrar tekrar urettigimiz icin, is emri adimlarini sablona kaydederiz.
Yeni siparis geldiginde sablondan otomatik is emri olusur.

### MRP (Malzeme Ihtiyac Planlama)

MRP su soruyu cevaplar: **"Bu siparisi yerine getirmek icin ne kadar malzeme lazim
ve stokta ne var, ne eksik?"**

```
SIPARIS: 100 adet Ucak Parcasi X

URUN AGACI (BOM):
  1 adet X = 0.5 kg Aluminyum + 4 adet Vida M6 + 0.1 lt Boya

BRUT IHTIYAC (BOM Patlatma):
  Aluminyum: 100 x 0.5 = 50 kg
  Vida M6:   100 x 4   = 400 adet
  Boya:      100 x 0.1 = 10 lt

STOK DURUMU:
  Aluminyum: 30 kg mevcut
  Vida M6:   500 adet mevcut
  Boya:      5 lt mevcut

NET IHTIYAC:
  Aluminyum: 50 - 30 = 20 kg EKSIK --> Satin alma talebi
  Vida M6:   400 - 500 = YOK (yeterli)
  Boya:      10 - 5 = 5 lt EKSIK --> Satin alma talebi
```

### Kapasite Planlama

Her makinenin gunluk/haftalik kapasitesi vardir:
- CNC-01: Gunluk 8 saat, haftada 5 gun = 40 saat/hafta
- Eger 60 saatlik is varsa, 1.5 hafta surer veya baska makinede paralel islenebilir

### Gantt Seması

Uretim planlamasi gorsel olarak Gantt chart ile yapilir:

```
Makine    |  Pzt  |  Sal  |  Car  |  Per  |  Cum  |
----------|-------|-------|-------|-------|-------|
CNC-01    |[Siparis A     ]|[Siparis B     ]|       |
CNC-02    |[Siparis C                      ]|       |
TORNA-01  |       |[Sip A ]|[Sip B ]|       |       |
TORNA-02  |[Siparis D            ]|[Sip C  ]|       |
TASLAMA   |       |       |[Sip A ]|[Sip B ]|[Sip C]|
```

---

## 6. Kalite Yonetimi

### Neden Bu Kadar Onemli?

Havaclik sektorunde bir parca bozuk cikarsa **ucak dusubilir**. Bu yuzden:
- Her parca olculur, kaydedilir
- Her malzemenin nereden geldigi izlenir
- Her hata kayit altina alinir ve kokeni arastirilir
- Fabrika yilda en az 1 kez dis denetimden gecer

### Kalite Standartlari

| Standart | Sektor | Aciklama |
|----------|--------|----------|
| **AS9100** | Havaclik | Havaclik sektoru kalite yonetim sistemi |
| **IATF 16949** | Otomotiv | Otomotiv sektoru kalite yonetimi |
| **ISO 9001** | Genel | Genel kalite yonetim sistemi |
| **NADCAP** | Havaclik | Ozel prosesler (kaynak, kaplama, isil islem) |

### NCR (Non-Conformance Report - Uygunsuzluk Raporu)

Bir urun teknik cizime veya standarda uymuyorsa NCR acilir.

```
NCR ORNEK:
  Urun: Ucak Parcasi X
  Hata: Dis cap 25.08 mm (Tolerans: 25.00 +/- 0.05)
  Tespit: Final kalite kontrol
  Karar: RED (Hurda) / ISLEM (Tamir edilecek) / KABUL (Musteriden izin)
  Miktar: 3 adet / 100 adet
```

### CAPA (Corrective and Preventive Action)

NCR'nin bir sonraki adimidir. "Bozuk cikti, tamam da BIR DAHA OLMASIN diye ne yapacagiz?"

```
CAPA ORNEK:
  Iliskili NCR: NCR-2024-042
  Kok Neden: CNC kesici ucun asinmis olmasi
  Duzeltici Faaliyet: Kesici ucu degistirildi, operatora bildirildi
  Onleyici Faaliyet: Kesici uc omru 200 parcada bir degistirilecek (onden)
  Dogrulama: 50 parca uretildi, hepsi tolerans icinde
  Kapatma Tarihi: 15.03.2026
```

### SPC (Istatistiksel Proses Kontrol)

Uretim sirasinda surekli olcum yaparak prosesin kontrol altinda olup olmadigini izler.

```
Ornek: Dis cap olcumleri (hedef: 25.00 mm)

  25.05 |                         *
  25.03 |  USL (Ust Sinir) -------*---------
  25.02 |     *     *                *
  25.00 | ---*---*---*---*---*---*---*---*--- (Hedef)
  24.98 |        *        *  *
  24.97 |  LSL (Alt Sinir) ------------------
  24.95 |

  USL = 25.05 mm (Ust Spesifikasyon Limiti)
  LSL = 24.95 mm (Alt Spesifikasyon Limiti)
  Tum olcumler sinirlar icerisinde = Proses kontrol altinda
```

### Diger Kalite Modulleri

| Modul | Ne Yapar | Ornek |
|-------|----------|-------|
| **Giris Kontrol** | Tedarikciden gelen malzemeyi kontrol eder | Aluminyum sertifika kontrolu, boyut olcumu |
| **Kalibrasyon** | Olcum aletlerinin dogrulugunu teyit eder | Mikrometre yilda 1 kez kalibre edilir |
| **FAI (AS9102)** | Ilk uretim parcasinin tum olculerini dokumante eder | Yeni urunde ilk parcanin 50 olcusu kaydedilir |
| **PPAP** | Otomotiv sektoru icin uretim parcasi onay sureci | Musteriye uretim yetkinligimizi kanitlama |
| **FMEA** | Olasi hatalarin onceden analiz edilmesi | "CNC kesici kirilirsa ne olur?" risk degerlendirmesi |
| **Kontrol Plani** | Her urunde hangi olculer, ne siklikta kontrol edilecek | "Her 50 parcada 1 olcum yap" |
| **Ic Denetim** | Fabrikanin kendi kendini denetlemesi | Yilda 2 kez tum prosesleri gozden gecir |
| **Tedarikci Degerlendirme** | Tedarikci performansini puanlar | Teslimat zamanliligi, kalite, fiyat puanlama |
| **Egitim** | Personelin hangi egitimi aldigi, yetkinlik matrisi | Ahmet: CNC operatoru sertifikasi var |
| **FOD Onleme** | Yabanci cisim hasarini onleme (havaclik zorunlu) | Uretim alaninda aksesuar yasagi |
| **Sahte Parca** | Sahte/taklit malzeme girisini onleme | Tedarikci sertifika dogrulama |
| **Musteri Mulkiyeti** | Musteri'nin birakip gittigi malzeme takibi | THY'nin biraktigi kalip takibi |

---

## 7. Satin Alma Sureci

### Satin Alma Nasil Tetiklenir?

3 farkli yolla tetiklenebilir:

```
1. MANUEL TALEP
   Depo sorumlusu: "Aluminyum azaldi, siparis verelim"
   --> Satin Alma Talebi olusturur

2. MRP OTOMATIK
   MRP hesaplamasi: "Siparis icin 20 kg aluminyum eksik"
   --> Otomatik satin alma talebi olusur

3. MIN STOK UYARISI
   Sistem: "Aluminyum 100 kg minimum stokun altina dustu"
   --> Otomatik satin alma talebi olusur
```

### Satin Alma Akisi

```
Talep Olusur
    |
    v
Teklif Toplama (min 3 tedarikci)
    |-- Tedarikci A: 50 TL/kg, 5 gun teslimat
    |-- Tedarikci B: 48 TL/kg, 7 gun teslimat
    |-- Tedarikci C: 55 TL/kg, 3 gun teslimat
    |
    v
Degerlendirme ve Onay
    |-- Fiyat, teslimat suresi, kalite gecmisi
    |
    v
Siparis Verme (Tedarikci B secildi)
    |
    v
Teslimat Takibi
    |
    v
Malzeme Teslim Alindi
    |-- Giris kontrol (kalite)
    |-- Stoka giris
    |-- Fatura eslestirme
```

### Tedarikci Degerlendirme

Her tedarikci su kriterlere gore puanlanir:
- **Kalite:** Bozuk parca orani (target: <%1)
- **Teslimat:** Zamaninda teslimat orani (target: >%95)
- **Fiyat:** Piyasa ortalamasina gore rekabetcilik
- **Hizmet:** Iletisim, sorun cozme hizi

---

## 8. Satis ve Teklif Sureci

### Teklif Hazirlama

```
TEKLIF KALEMI ORNEK:

Musteri: THY Teknik A.S.
Urun: Ucak Parcasi X (PN: THY-2024-001)
Miktar: 500 adet
Birim Fiyat: 120 TL
Toplam: 60.000 TL
KDV (%20): 12.000 TL
Genel Toplam: 72.000 TL
Gecerlilik: 30 gun
Termin: Siparis tarihinden 45 is gunu
```

### Teklif Durumlari

```
TASLAK --> GONDERILDI --> ONAYLANDI --> SIPARISE DONUSTU
                     \--> REDDEDILDI
                     \--> SURESI DOLDU
```

### Musteri Kategorileri

| Kategori | Anlami | Ornek |
|----------|--------|-------|
| **A** | Yuksek hacim, stratejik musteri | THY, TAI, ASELSAN |
| **B** | Orta hacim, duzenli musteri | Kucuk otomotiv firmalari |
| **C** | Dusuk hacim, ara sira siparis | Tek seferlik projeler |

Kategori, oncelik siralama ve iskonto orani belirlemede kullanilir.

---

## 9. Muhasebe ve Faturalama

### Fatura Turleri

| Tur | Aciklama |
|-----|----------|
| **Satis Faturasi** | Musteriye kesilen fatura |
| **Alis Faturasi** | Tedarikci'den gelen fatura |
| **Iade Faturasi** | Geri gonderilen urunler icin |

### Fatura Akisi

```
Uretim tamamlandi
    |
    v
Sevk formu hazirlandi (irsaliye)
    |-- Paketleme
    |-- Kargo/nakliye
    |
    v
Fatura kesildi
    |-- Urun kalemleri
    |-- KDV hesaplandi
    |-- E-fatura olarak gonderildi (GIB)
    |
    v
Odeme bekleniyor
    |-- Vade: 30/60/90 gun
    |
    v
Odeme geldi --> Cari hesap kapandi
```

### Cari Hesap (Musteri Ekstre)

Her musterinin bir "cari hesabi" vardir:

```
MUSTERI: THY Teknik A.S.
EKSTRE:
Tarih      | Aciklama              | Borc      | Alacak    | Bakiye
-----------|-----------------------|-----------|-----------|--------
01.01.2026 | Fatura #F-2026-001    | 72.000 TL |           | 72.000
15.01.2026 | Odeme (Havale)        |           | 72.000 TL | 0
01.02.2026 | Fatura #F-2026-015    | 45.000 TL |           | 45.000
15.02.2026 | Fatura #F-2026-022    | 30.000 TL |           | 75.000
20.02.2026 | Odeme (Havale)        |           | 45.000 TL | 30.000
```

### Odeme Vadesi

- **Pesin:** Teslimatta odeme
- **30 gun:** Fatura tarihinden 30 gun sonra
- **60 gun:** Genelde buyuk firmalarda
- **90 gun:** Kamu ihaleleri, savunma sanayi

---

## 10. Bakim Yonetimi ve OEE

### Bakim Turleri

| Tur | Aciklama | Ornek |
|-----|----------|-------|
| **Periyodik Bakim** | Belirli araliklarda yapilan planli bakim | Her 500 saatte yag degisimi |
| **Koruyucu Bakim** | Ariza olmadan once onlem alma | Kayis degistirme (yipranma belirtisi) |
| **Ariza Bakim** | Makine bozuldugunda acil mudahale | Motor yandiktan sonra degisim |
| **Kestirimci Bakim** | Sensor verileriyle ariza tahmini | Titresim artti = yatak yakinda bozulacak |

### OEE (Overall Equipment Effectiveness - Genel Ekipman Verimlilik)

Bir makinenin ne kadar verimli calistigini gosteren altin metrik:

```
OEE = Kullanilabilirlik x Performans x Kalite

Ornek: CNC-01 makinesi (8 saatlik vardiya)

KULLANILABILIRLIK:
  Planli calisma: 8 saat
  Durma suresi: 1 saat (ariza + setup)
  Calisma suresi: 7 saat
  Kullanilabilirlik: 7/8 = %87.5

PERFORMANS:
  Teorik kapasite: Saatte 10 parca
  Beklenen uretim: 7 x 10 = 70 parca
  Gercek uretim: 60 parca
  Performans: 60/70 = %85.7

KALITE:
  Uretilen: 60 parca
  Hurdaya ayrilan: 2 parca
  Iyi parca: 58 parca
  Kalite: 58/60 = %96.7

OEE = 0.875 x 0.857 x 0.967 = %72.4

Dunya sinifi OEE: %85+
Ortalama fabrika: %60
Kotu durum: %40 alti
```

### Ariza Kaydi

```
ARIZA KAYDI ORNEK:
  Makine: CNC-01
  Tarih: 05.03.2026 14:30
  Ariza: Spindle motoru durdu
  Sebep: Yatak asinmasi
  Durma Suresi: 4 saat
  Yapilan Islem: Yatak degistirildi
  Maliyet: 5.000 TL (yedek parca) + 4 saat uretim kaybi
```

---

## 11. Insan Kaynaklari ve Vardiya

### Vardiya Sistemi

Cogu fabrika 2 veya 3 vardiya calisir:

| Vardiya | Saat | Aciklama |
|---------|------|----------|
| Sabah | 06:00 - 14:00 | Ana uretim vardiyasi |
| Oglen | 14:00 - 22:00 | Ikinci vardiya |
| Gece | 22:00 - 06:00 | Yogun donemde acilir |

### Yetkinlik Matrisi

Her operatorun hangi makineleri kullanabilecegi kayit altindadir:

```
Operator  | CNC | Torna | Freze | Taslama | Kaynak
----------|-----|-------|-------|---------|-------
Ahmet     |  X  |   X   |       |    X    |
Mehmet    |  X  |       |   X   |         |   X
Ali       |     |   X   |   X   |    X    |
Ayse      |  X  |   X   |   X   |    X    |   X    (Uzman)
```

---

## 12. Temel Kavramlar Sozlugu

| Terim | Turkce | Aciklama |
|-------|--------|----------|
| **BOM** | Urun Agaci | Bir urunun hangi malzemelerden olustugunu gosteren liste |
| **MRP** | Malzeme Ihtiyac Planlama | Uretim icin gereken malzemeleri hesaplama |
| **NCR** | Uygunsuzluk Raporu | Standarda uymayan urun/proses kaydi |
| **CAPA** | Duzeltici/Onleyici Faaliyet | Hatanin kok nedenini bulup tekrarini onleme |
| **SPC** | Istatistiksel Proses Kontrol | Uretim surecini istatistiksel izleme |
| **OEE** | Genel Ekipman Verimliligi | Makine verimlilik metrigi |
| **FAI** | Ilk Urun Muayenesi | Yeni urunde ilk parcanin detayli olcumu (AS9102) |
| **PPAP** | Uretim Parcasi Onay Sureci | Otomotiv sektoru onay dokumani |
| **FMEA** | Hata Modu ve Etki Analizi | Potansiyel hatalari onceden tahmin etme |
| **ECN** | Muhendislik Degisiklik Bildirimi | Urun/proses degisikliginin resmi kaydi |
| **FOD** | Yabanci Cisim Hasari | Havaclik: uretim alaninda istenmeyen cisimler |
| **Lot/Parti** | Uretim Partisi | Ayni kosullarda uretilen urun grubu |
| **FIFO** | Ilk Giren Ilk Cikar | Stok degerleme yontemi |
| **Cari Hesap** | Musteri/Tedarikci Hesabi | Karsilikli borc-alacak takibi |
| **Irsaliye** | Sevk Belgesi | Malzemenin fiziksel teslimatini belgeleyen evrak |
| **KDV** | Katma Deger Vergisi | %1, %10, %20 oranlarinda uygulanan vergi |
| **Kalibrasyon** | Olcum Aleti Dogrulama | Olcum aletlerinin dogrulugunun teyit edilmesi |
| **Tolerans** | Izin Verilen Sapma | 25.00 +/- 0.05 mm gibi kabul edilebilir olcu araligi |
| **Fire/Hurda** | Kullanilmaz Urun | Uretimde bozuk cikan, tamir edilemez parca |
| **Setup/Hazirlik** | Makine Hazirlama | Is degisikliginde makinenin ayarlanmasi |
| **Lead Time** | Tedarik Suresi | Siparis verdikten teslim alincaya kadar gecen sure |
| **WIP** | Yari Mamul | Uretim hattinda islem goren, henuz bitmemis urunler |

---

## 13. Gercek Senaryo Ornekleri

### Senaryo 1: Normal Siparis Akisi

```
GUN 1: THY "Ucak Parcasi X'den 200 adet" icin teklif istedi
GUN 2: Satis teklif hazirladi: 200 x 150 TL = 30.000 TL + KDV, 30 is gunu termin
GUN 3: THY teklifi onayladi
GUN 4: Siparis olusturuldu, MRP calisti:
        - 100 kg aluminyum gerekli, stokta 40 kg var -> 60 kg satin alma talebi
        - 800 adet vida gerekli, stokta 1000 var -> Yeterli
GUN 5: Satin alma 60 kg aluminyum icin 3 tedarikci'den teklif istedi
GUN 7: En uygun tedarikci secildi, siparis verildi
GUN 12: Aluminyum teslim alindi, giris kontrol yapildi, stoka girildi
GUN 13: Is emri acildi: CNC kesim -> Torna -> Taslama -> Boya -> Kalite kontrol
GUN 14-28: Uretim devam etti, operatorler calisma kayitlarini girdi
GUN 29: 200 adet tamamlandi, kalite kontrol gecti
GUN 30: Stoka girildi, lot numarasi atandi
GUN 31: Paketlendi, sevk edildi, irsaliye kesildi
GUN 32: Fatura kesildi: 36.000 TL (KDV dahil)
GUN 62: THY 30 gun sonra odemeyi yapti -> Cari hesap kapandi
```

### Senaryo 2: Kalite Problemi

```
GUN 20: Kalite kontrol, taslama sonrasi 200 parcadan 15 tanesinin
        yuzey puruzlulugunu olctu: Ra 1.6 (spesifikasyon: Ra 0.8 max)

        --> NCR acildi: NCR-2026-015
        --> 15 parca "ISLEM" karari (yeniden taslama)
        --> CAPA acildi: CAPA-2026-008

Kok Neden Analizi:
  - Taslama tasinun asinmis oldugu tespit edildi
  - Operatorun tasi kontrol etmedigi belirlendi

Duzeltici Faaliyet:
  - 15 parca yeniden taslandi, olcumler gecti
  - Taslama tasi degistirildi

Onleyici Faaliyet:
  - Taslama tasi her 100 parcada bir kontrol edilecek (prosedure eklendi)
  - Operatorlere egitim verildi

Dogrulama:
  - Sonraki 100 parcada sorun cikmadi
  - CAPA kapatildi
```

### Senaryo 3: Stok Krizi

```
SABAH 08:00: Uretim muduru "Celik cubuktan 50 adet parca kesmemiz lazim" dedi
SABAH 08:15: Depoya bakild - stokta 5 kg celik cubuk var, 20 kg lazim
SABAH 08:30: Sistem zaten 3 gun once min stok uyarisi vermis ama kimse gormemis!

COZUM:
1. Acil satin alma talebi olusturuldu
2. En yakin tedarikci'den aynı gun teslimat istendi (express fiyat: %30 fazla)
3. Oglen 13:00'te malzeme geldi, giris kontrol yapildi
4. Uretim 2 saat gecikmeli basladi

ONLEM:
- Bildirim sistemi aktif edildi (e-posta + sistem uyarisi)
- Min stok seviyeleri gozden gecirildi
- Kritik malzemeler icin guvenlik stoku artirildi
```

### Senaryo 4: Makine Arizasi

```
SALI 10:30: CNC-01 makinesi "spindle alarm" verip durdu
10:35: Operator ariza kaydini sisteme girdi
10:40: Bakim ekibi geldi, inceleme basladi
11:30: Teshis: Spindle yatagi bozulmus
11:45: Yedek parca kontrolu: Stokta yok!
12:00: Acil siparis verildi (2 gun teslimat)
PERSEMBE 10:00: Yedek parca geldi
PERSEMBE 14:00: Tamir tamamlandi, makine teste alindi
PERSEMBE 15:00: Makine uretime dondu

KAYIP:
- Durma suresi: 2 is gunu (16 saat)
- Uretim kaybi: 160 parca (saatte 10 parca x 16 saat)
- Yedek parca maliyeti: 8.000 TL
- Acil kargo: 500 TL

OEE ETKISI:
- Haftalik OEE: %85 -> %62 (durma suresi nedeniyle)

ONLEM:
- Spindle yatagi yedek stoka eklendi
- Periyodik bakim planina "spindle titresim olcumu" eklendi
```

---

> **Bu dokuman, Quvex ERP projesinin is mantigini ve uretim sektorunun
> temel kavramlarini anlamak isteyen herkes icin hazirlanmistir.**
>
> Sorulariniz icin proje ekibine danisiniz.
