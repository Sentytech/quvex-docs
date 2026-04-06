# Savunma Sanayi Talasli Imalat — Adim Adim Test Rehberi

> **Bu rehber ne icin?**
> Quvex ERP'yi gercek bir savunma sanayi senaryosuyla uctan uca test etmek icin.
> Her adimda hangi ekrana girecegini, hangi alanlari dolduracagini ve **neden** bu adimlarin
> yapildigini ogreneceksin. Hem sistemi test et, hem savunma sanayi is sureclerini ogren.
>
> **Onkoşul:** API (localhost:5052) ve UI (localhost:3000) calisiyor olmali.
> **Giris:** admin@quvex.com / Admin123!@#$

---

# ═══════════════════════════════════════════════════════════════
# KISIM A: SISTEM HAZIRLIGI (Tek Seferlik Kurulum)
# ═══════════════════════════════════════════════════════════════

Bu kisimda uretim yapabilmek icin gereken temel tanimlamalari yapiyoruz.
Gercek hayatta bir fabrika acildiginda ilk is budur: makineler, operasyonlar,
olcum aletleri tanimlanir.

---

## ADIM 1: Makine Tanimlari

### Neden?
> Talasli imalatta her is belirli bir makinede yapilir. CNC torna dis cap keser,
> CNC freze kanal/cep acar, taslama hassas toleransa getirir. Her makinenin saat
> maliyeti farklidir — bu maliyet hesabinin temelidir. Bir Mazak torna saatte 450 TL
> yakarken, bir taslama 350 TL yakar. Patron "bu parça bana kaça mal oluyor?"
> sorusunun cevabini ancak makine maliyetlerini bilirse verebilir.

### Nasil?
1. Sol menuden **Ayarlar > Makineler** tikla
2. Sag ustteki **+ Yeni** butonuna tikla
3. Asagidaki 6 makineyi sirayla ekle:

**Makine 1:**
```
Makine Kodu:    CNC-T01
Makine Adi:     Mazak QT-250 CNC Torna
Marka:          Mazak
Yil:            2019
Aciklama:       2 eksenli CNC torna, max Ø300 x 500mm
Saat Ucreti:    450
Setup Ucreti:   350
```

**Makine 2:**
```
Makine Kodu:    CNC-T02
Makine Adi:     Doosan Lynx 220 CNC Torna
Marka:          Doosan
Yil:            2021
Aciklama:       2 eksenli CNC torna, max Ø220 x 300mm, kucuk parcalar icin
Saat Ucreti:    400
Setup Ucreti:   300
```

**Makine 3:**
```
Makine Kodu:    CNC-F01
Makine Adi:     Haas VF-2 CNC Freze
Marka:          Haas
Yil:            2020
Aciklama:       3 eksenli dikey isleme merkezi, 762x406x508mm tabla
Saat Ucreti:    500
Setup Ucreti:   400
```

**Makine 4:**
```
Makine Kodu:    CNC-F02
Makine Adi:     Mazak VCN-530C CNC Freze
Marka:          Mazak
Yil:            2022
Aciklama:       3 eksenli dikey isleme merkezi, yuksek hassasiyet
Saat Ucreti:    550
Setup Ucreti:   450
```

**Makine 5:**
```
Makine Kodu:    TAS-01
Makine Adi:     Okamoto OGM-250 Silindirik Taslama
Marka:          Okamoto
Yil:            2018
Aciklama:       Silindirik dis/ic taslama, max Ø250 x 500mm
Saat Ucreti:    350
Setup Ucreti:   250
```

**Makine 6:**
```
Makine Kodu:    TAS-02
Makine Adi:     Chevalier FSG-1224 Duz Taslama
Marka:          Chevalier
Yil:            2017
Aciklama:       Duz yuzey taslama, 300x600mm tabla
Saat Ucreti:    300
Setup Ucreti:   200
```

### Kontrol
- [ ] 6 makine listede gorunuyor mu?
- [ ] Saat ucretleri dogru girildi mi?

---

## ADIM 2: Operasyon Adimlari (Is Emri Adimlari)

### Neden?
> Talasli imalatta bir parca tek seferde bitmez. Bir dizi operasyondan gecer:
> once tornada dis capi kesilir, sonra frezede kanal acilir, sonra taslamada
> hassas toleransa getirilir, capak alinir, olculur, gerekirse disariya
> isil islem/kaplamaya gider, son olarak kaliteci final muayene yapar.
>
> Bu operasyon sirasina "routing" (rotalama) denir. AS9100'de her operasyonun
> tanimli olmasi zorunludur. "Kim, hangi makinede, ne kadar surede, hangi
> takimla, hangi toleransta" calisti kayit altina alinir.
>
> **OP numaralari neden 10'ar 10'ar artar?**
> Geleneksel olarak OP10, OP20, OP30 seklinde numaralanir. Arada OP15 gibi
> ara operasyonlar eklenebilsin diye 10'ar arttirilir.

### Nasil?
1. Sol menuden **Ayarlar > Is Emri Adimlari** tikla
2. **+ Yeni** ile asagidaki 7 operasyonu ekle:

**Operasyon 1:**
```
Kod:                    OP10
Isim:                   CNC Torna — Dis Cap Isleme
Varsayilan Makine:      CNC-T01 (Mazak QT-250) [dropdown'dan sec]
Hazirlik Suresi (dk):   30
Calisma Suresi (dk):    12
Gerekli Takimlar:       CNMG 120408 kesici uc, 3 cenenli ayna, canli merkez
Tolerans Bilgisi:       Genel tolerans IT7, yuzey Ra 1.6
Aciklama:               Hammadde bloktan dis cap tornalama, boy kesme, pah kirma
Beceri Seviyesi:        3 — Usta
```

> **Business bilgi — Setup (Hazirlik) nedir?**
> Makineye is parcasini baglamak, takimi takmak, programi yuklemek, ilk parcayi
> denemek icin gecen suredir. Seri uretimde setup bir kere yapilir. 60 parcalik
> isde 30 dk setup + (60 x 12 dk run) = 750 dk toplam. Setup suresi sabittir,
> parca sayisi arttikca birim maliyeti duşer. Bu yuzden kucuk partiler pahalidir.

**Operasyon 2:**
```
Kod:                    OP20
Isim:                   CNC Freze — Cep ve Kanal Isleme
Varsayilan Makine:      CNC-F01 (Haas VF-2)
Hazirlik Suresi (dk):   45
Calisma Suresi (dk):    18
Gerekli Takimlar:       D10 karbur parmak freze, D6 parmak freze, mengeneli baglama aparati
Tolerans Bilgisi:       Konum toleransi ±0.05mm, delik H7
Aciklama:               Cep frezeleme, delik delme/raybalama, kanal acma
Beceri Seviyesi:        3 — Usta
```

> **Business bilgi — H7 tolerans ne demek?**
> ISO tolerans sistemi: H7 bir delik toleransidir. Ø8 H7 = 8.000 ile 8.015mm arasi.
> Bu cok hassas bir deliktir — icerisine bir pin veya rulman oturacak demektir.
> Savunma parcalarinda bu toleranslar cok yaygindır cunku hidrolik basinca
> dayanikli sizdirmaz baglanti gerekir.

**Operasyon 3:**
```
Kod:                    OP30
Isim:                   Silindirik Taslama
Varsayilan Makine:      TAS-01 (Okamoto OGM-250)
Hazirlik Suresi (dk):   20
Calisma Suresi (dk):    8
Gerekli Takimlar:       CBN taslik Ø300, arasinda baglama aparati, 3 nokta mikrometre
Tolerans Bilgisi:       h6 tolerans (Ø25: 24.987-25.000mm), silindiriklik 0.005mm
Aciklama:               Tornadan gelen dis capi hassas toleransa getirme, yuzey iyilestirme
Beceri Seviyesi:        4 — Uzman
```

> **Business bilgi — h6 tolerans neden onemli?**
> h6 = sabit mil toleransi. Ø25 h6 demek 24.987 ile 25.000mm arasi — sadece 13 mikron
> (bir sac teli 70 mikron). Bu hassasiyette sadece taslama veya honlama yapabilir.
> Savunma parcalarinda bu seviye standarttir cunku kayan yuzeyler, o-ring yuvalari
> ve hidrolik pistonlar bu hassasiyeti gerektirir.

**Operasyon 4:**
```
Kod:                    OP40
Isim:                   Capak Alma ve Yuzey Temizleme
Varsayilan Makine:      [bos birak — el isi]
Hazirlik Suresi (dk):   5
Calisma Suresi (dk):    3
Gerekli Takimlar:       Capak bicagi, zimpara (400-600 kum), hava tabancasi, temizleme bezi
Tolerans Bilgisi:       Gorsel kontrol — capaksiz, ciziksiz yuzey
Aciklama:               Tum keskin kenarlarin capak alinmasi, parcalarin temizlenmesi
Beceri Seviyesi:        1 — Cirak
```

> **Business bilgi — Capak alma neden ayri operasyon?**
> CNC islemede her kesme isleminden sonra capak olusur (metal kirpintisi).
> Capak birakilan parca: (1) montajda sorun cikarir, (2) FOD (yabanci cisim)
> riski olusturur — ucakta loose capak felaket demek, (3) kaplama tutmaz.
> AS9100'de FOD onleme zorunludur. Capak alma basit gorunur ama havacilikta
> kritik bir operasyondur.

**Operasyon 5:**
```
Kod:                    OP50
Isim:                   CMM Olcum (3 Boyutlu Koordinat Olcum)
Varsayilan Makine:      [bos birak — olcum cihazi]
Hazirlik Suresi (dk):   10
Calisma Suresi (dk):    15
Gerekli Takimlar:       CMM prob seti, fikstir, referans blok
Tolerans Bilgisi:       Tum kritik boyutlar, AS9102 raporu icin veri toplama
Aciklama:               Tum kritik boyutlarin 3B koordinat olcum makinesiyle olculmesi
Beceri Seviyesi:        4 — Uzman
```

> **Business bilgi — CMM nedir?**
> Coordinate Measuring Machine = 3 boyutlu olcum makinesi. Prob ile parcaya
> dokunarak X, Y, Z koordinatlarini 0.001mm hassasiyetle olcer.
> Savunma parcalarinda CMM olcumu zorunludur cunku:
> - Mikrometre ile olculemeyen geometriler vardir (konum toleransi gibi)
> - AS9102 FAI raporu icin tum boyutlarin kayit altina alinmasi gerekir
> - Musteri (TAI, ASELSAN) CMM raporunu ister

**Operasyon 6:**
```
Kod:                    OP60
Isim:                   Yuzey Islemi — Fason
Varsayilan Makine:      [bos birak — disari gidecek]
Hazirlik Suresi (dk):   [bos]
Calisma Suresi (dk):    [bos]
Gerekli Takimlar:       [bos]
Tolerans Bilgisi:       Kaplama spesifikasyonuna gore (musteri cizimine bakilir)
Aciklama:               Disarida yapilan islem: kaplama, isil islem, boya, anodizasyon vb.
Beceri Seviyesi:        1 — Cirak (sadece sevk/teslim takibi)
```

> **Business bilgi — Fason is neden var?**
> Her fabrika her isi yapamaz. Kadmiyum kaplama, isil islem, NDT (tahribatsiz muayene)
> gibi "ozel prosesler" ozel lisans/ekipman gerektirir. Bunlar NADCAP sertifikali
> firmalara yaptirmak zorundayiz. AS9100'de ozel proses tedarikcilerinin onayli olmasi
> ve her is icin sertifika vermesi zorunludur.

**Operasyon 7:**
```
Kod:                    OP70
Isim:                   Final Muayene
Varsayilan Makine:      [bos birak]
Hazirlik Suresi (dk):   15
Calisma Suresi (dk):    10
Gerekli Takimlar:       Mikrometre, kumpas, uc olcer, yuzey puruzluluk olcer, buyutec
Tolerans Bilgisi:       Tum boyutlar + kaplama kontrolu + gorsel + FOD
Aciklama:               Sevkiyat oncesi son kontrol — parca uygunsa CoC ile gonder
Beceri Seviyesi:        4 — Uzman
```

> **Business bilgi — Final muayene neden ayri?**
> Uretim sirasinda her operasyonda olcum yapilsa bile, final muayene ayri bir
> kalite muhendisi tarafindan yapilir (kendi isini kendi kontrol etme yasagi).
> Final muayene gecmeden sevkiyat yapilamaz — bu AS9100 8.6 maddesidir.
> Final muayenede CoC (Certificate of Conformance = Uygunluk Sertifikasi)
> imzalanir. Musteri bu belgeyi gormeden parcayi kabul etmez.

### Kontrol
- [ ] 7 operasyon adimi eklendi mi?
- [ ] Her birine makine, sure, takim bilgisi girildi mi?

---

## ADIM 3: Genel Gider Tanimlari

### Neden?
> Parca maliyeti sadece malzeme + iscilik + makine degildir. Fabrikanin kirasi,
> elektrik faturasi, amortisman, sigortasi da maliyetin parcasidir. Bunlara
> "overhead" (genel gider) denir ve genellikle direkt maliyetin yuzde olarak
> eklenir. Turkiye'de tipik bir CNC atölyede %35-50 arasi genel gider vardir.

### Nasil?
1. Sol menuden **Uretim > Maliyet Analizi** tikla
2. "Genel Giderler" sekmesine gec (veya sayfanin alt kismindaki tablo)
3. Asagidaki 3 kalemi ekle:

```
Kalem 1:
  Ad:               Genel Imalat Giderleri
  Yuzde:            25
  Gecerlilik:       2026-01-01
  Bitis:            [bos — surresiz]

Kalem 2:
  Ad:               Amortisman (Makine + Tesis)
  Yuzde:            10
  Gecerlilik:       2026-01-01

Kalem 3:
  Ad:               Enerji (Elektrik + Dogalgaz)
  Yuzde:            8
  Gecerlilik:       2026-01-01
```

> **Business bilgi:** Toplam %43 overhead demek, 100 TL direkt maliyet olan parca
> icin 43 TL daha eklenir → 143 TL toplam maliyet. Kar marjini bunun uzerine koyarsin.
> Savunma sanayinde %20-40 arasi kar marji normaldir (ticari ise %10-15).

### Kontrol
- [ ] 3 genel gider kalemi eklendi mi?

---

## ADIM 4: Kalibrasyon Ekipmanlari

### Neden?
> AS9100'de kullanilan her olcum aletinin kalibre olmasi zorunludur (madde 7.1.5).
> Kalibre olmayan aletle yapilan olcum gecersizdir. Kalibrasyon suresi gecmis
> aletle uretim yapildiginda musteri tum o partinin reddini isteyebilir.
> Bu yuzden kalibrasyon takibi kritiktir.

### Nasil?
1. Sol menuden **Kalite > Kalibrasyon** tikla
2. "Ekipman" sekmesinde **+ Yeni Ekipman** ile ekle:

**Ekipman 1:**
```
Ekipman Kodu:       MIK-001
Ad:                 Dis Mikrometre 0-25mm
Uretici:            Mitutoyo
Model:              103-137
Seri No:            MIK-2019-0042
Konum:              Kalite Lab
Dogruluk:           0.001mm
Frekans:            Yillik
```
Ekledikten sonra "Kalibrasyon Kaydi Ekle":
```
Sertifika No:       KAL-MIK001-2026
Kalibrasyon Tarihi: 2026-01-15
Sonraki Tarih:      2027-01-15
Kalibre Eden:       Turk Loydu
Lab:                Turk Loydu Kalibrasyon Lab.
Dis/Ic:             Dis (Harici)
Sonuc:              GECTI
```

**Ekipman 2:**
```
Ekipman Kodu:       KAL-001
Ad:                 Dijital Kumpas 0-150mm
Uretici:            Mitutoyo
Model:              500-196
Seri No:            KAL-2020-0018
Konum:              Atolye
Dogruluk:           0.01mm
Frekans:            6 Aylik
```
Kalibrasyon kaydi:
```
Sertifika No:       KAL-KAL001-2026
Kalibrasyon Tarihi: 2026-02-01
Sonraki Tarih:      2026-08-01
Kalibre Eden:       Turk Loydu
Sonuc:              GECTI
```

**Ekipman 3:**
```
Ekipman Kodu:       CMM-001
Ad:                 Koordinat Olcum Makinesi
Uretici:            Hexagon
Model:              GLOBAL S 7.10.7
Seri No:            CMM-2021-0003
Konum:              Kalite Lab (klimali oda)
Dogruluk:           0.001mm (MPEE = 1.5 + L/333 mikron)
Frekans:            6 Aylik
```
Kalibrasyon kaydi:
```
Sertifika No:       KAL-CMM001-2026
Kalibrasyon Tarihi: 2026-03-01
Sonraki Tarih:      2026-09-01
Kalibre Eden:       Hexagon Turkiye
Sicaklik:           20
Nem:                45
Sonuc:              GECTI
```

**Ekipman 4:**
```
Ekipman Kodu:       UC-001
Ad:                 Uc Olcer (Thread Gauge) M8 6H
Uretici:            —
Model:              Go/NoGo M8x1.25 6H
Seri No:            UC-2020-0007
Konum:              Atolye
Dogruluk:           Go/NoGo
Frekans:            Yillik
```

**Ekipman 5:**
```
Ekipman Kodu:       YUZ-001
Ad:                 Yuzey Puruzluluk Olcer
Uretici:            Mitutoyo
Model:              SJ-210
Seri No:            YUZ-2020-0012
Konum:              Kalite Lab
Dogruluk:           0.01 Ra
Frekans:            Yillik
```

> **Business bilgi — Neden sicaklik ve nem kaydediliyor?**
> Metal parcalar sicaklikla genlesir. 20°C referans sicakliktir. CMM odasinin
> 20±1°C olmasi gerekir. 25°C'de yapilan olcum ile 20°C'de yapilan olcum
> arasinda mikron seviyesinde fark olur. Bu yuzden CMM odalari klimali olmalidir
> ve kalibrasyon sirasindaki sicaklik/nem kaydedilmelidir.

### Kontrol
- [ ] 5 kalibrasyon ekipmani eklendi mi?
- [ ] Her birinin kalibrasyon kaydi girildi mi?
- [ ] Dashboard'da "Uyumluluk: %100" gorunuyor mu?

---

# ═══════════════════════════════════════════════════════════════
# KISIM B: SIPARIS SURECI
# ═══════════════════════════════════════════════════════════════

Artik fabrikamiz hazir. Simdi gercek bir musteri siparisi ile calismaya basliyoruz.

---

## ADIM 5: Musteri Tanimi

### Neden?
> Savunma sanayinde musteri sayisi azdir ama her biri stratejiktir.
> TAI, ASELSAN, TUSAS, ROKETSAN, HAVELSAN — bunlar ana yukleniciler (OEM).
> Biz onlarin "alt yuklenicisiyiz" (Tier-2 veya Tier-3). Bu musterilerin
> ozel gereksinimleri vardir: AS9100 zorunlu, FOD hassas, FAI zorunlu, CoC zorunlu.
> Odeme vadeleri genellikle 60-90 gundur.

### Nasil?
1. Sol menuden **Musteriler** tikla
2. **+ Yeni Musteri** tikla
3. Sekmeleri sirayla doldur:

**Genel sekmesi:**
```
Firma Adi:          TAI — Turk Havacilik ve Uzay Sanayii A.S.
Yetkili Kisi:       Mehmet Yilmaz
Email:              mehmet.yilmaz@tai.com.tr
Telefon:            5321234567
Faks:               03128111899
Website:            www.tai.com.tr
```

**Adres & Vergi sekmesi:**
```
Adres:              Fethiye Mah. Havacilik Blv. No:17
Ulke:               Turkiye
Sehir:              Ankara
Posta Kodu:         06980
Vergi No:           1234567890
Vergi Dairesi:      Kazan
```

**Ticari Bilgiler sekmesi:**
```
Sektor:             Havacilik & Savunma
Kategori:           A (Stratejik)
Para Birimi:        USD
Odeme Vadesi:       60
Kredi Limiti:       500000
Iskonto Orani:      0
```

**Banka & Notlar sekmesi:**
```
Notlar:             AS9100 zorunlu. Tum parcalar seri numarali. 
                    FAI (AS9102) ilk partide zorunlu. 
                    CoC her sevkiyatta zorunlu.
                    FOD hassas uretim alani gerekli.
```

### Kontrol
- [ ] TAI musteri karti olusturuldu mu?
- [ ] Doviz USD olarak secildi mi?
- [ ] Kategori A (stratejik) mi?

---

## ADIM 6: Urun Tanimi (BOM dahil)

### Neden?
> Uretilecek parcayi tum detaylariyla tanimlamaliyiz. BOM (Bill of Materials =
> Malzeme Listesi) parcayi uretmek icin gereken her seyi listeler. Bir CNC
> parcasi icin BOM genellikle basittir: hammadde + fason islem. Ama bir montaj
> parcasinda onlarca alt bilesen olabilir.

### Nasil?

#### 6.1 Hammadde Tanimlama
1. Sol menuden **Urunler** tikla
2. **+ Yeni** ile hammaddeyi tanimla:

```
Urun Adi:           7075-T6 Aluminyum Blok 80x60x45mm
Urun Kodu:          HAM-7075-080060045
Tip:                Hammadde (Raw Material)
Birim:              Adet
Alis Fiyati:        320 TL
Aciklama:           AMS 4078 sertifikali 7075-T6 aluminyum alaşim blok
Min Stok:           20
```

> **Business bilgi — 7075-T6 nedir?**
> Aluminyum alasim serileri: 2xxx (bakir), 5xxx (magnezyum), 6xxx (silisyum),
> 7xxx (cinko). 7075 en yuksek mukavemetli aluminyum alasimidir — havacilikta
> en cok kullanilan malzeme. T6 = isil islem gomus (cozeltiye alma + yaslandirma).
> AMS 4078 = havacilık malzeme spesifikasyonu. MTR (Mill Test Report) bu
> spesifikasyona uygunlugu kanitlar.

#### 6.2 Ana Urun Tanimlama
```
Urun Adi:           Hidrolik Manifold Blogu
Urun Kodu:          TAI-2026-0142
Tip:                Mamul (Finished Good)
Birim:              Adet
Satis Fiyati:       85 (USD cinsinden)
Kalite Kontrol:     Evet [isaretli]
Seri Takip:         Evet [isaretli]
Lot Takip:          Evet [isaretli]
Teknik Cizim No:    TAI-DWG-2026-0142
Revizyon:           Rev B
Malzeme:            7075-T6 Aluminyum
Aciklama:           TAI havacilik projesi icin hidrolik manifold blogu.
                    Kadmiyum kaplama gerekli (AMS-QQ-P-416).
```

#### 6.3 BOM (Malzeme Listesi) Ekleme
Urun formu acikken alt kisimda "Alt Urunler (BOM)" bolumune:
```
Alt Urun 1:
  Urun:     HAM-7075-080060045 (7075-T6 Al Blok)
  Miktar:   1
```

> **Business bilgi — Neden sadece 1 malzeme?**
> CNC talasli imalatta genellikle tek bir hammadde blogundan parca cikarilir.
> Montaj parcalarinda ise BOM'da vidalar, o-ringler, pinler gibi bilesenler de olur.
> Bizim parcamiz tek parca (monolitik) oldugu icin BOM'da sadece hammadde var.
> Kaplama ise fason hizmet olarak ayri takip edilir.

### Kontrol
- [ ] Hammadde tanimlandi mi?
- [ ] Ana urun tanimlandi mi?
- [ ] BOM'da hammadde baglandi mi?
- [ ] Seri takip ve kalite kontrol aktif mi?

---

## ADIM 7: Teklif Hazirlama

### Neden?
> Savunma sanayinde is genellikle teklif (RFQ) ile baslar. Musteri bize cizim gonderir,
> biz maliyetimizi hesaplar ve fiyat teklif ederiz. Teklif onaylanirsa siparis olur.

### Nasil?
1. Sol menuden **Teklifler** tikla
2. **+ Yeni Teklif** tikla

```
Musteri:            TAI [dropdown'dan sec]
Teklif Tarihi:      [bugun]
Gecerlilik:         [30 gun sonrasi]
Para Birimi:        USD

Kalemler:
  Urun:             TAI-2026-0142 (Hidrolik Manifold Blogu) [arama ile sec]
  Teslimat Tarihi:  [45 gun sonrasi]
  Miktar:           60
  Birim Fiyat:      85
```

Not alani:
```
- Ilk 3 adet FAI (AS9102) kapsamindadir
- Kadmiyum kaplama AMS-QQ-P-416 Tip II Sinif 3 uygulanacaktir
- Teslimat: Siparis onayi + 45 takvim gunu
- Ambalaj: ESD korumalı, FOD onleyici
- Her sevkiyatta CoC verilecektir
```

**Kaydet** butonuna bas.

### Kontrol
- [ ] Teklif olusturuldu, teklif numarasi atandi mi?
- [ ] Toplam $5,100.00 gorunuyor mu?

---

## ADIM 8: Teklif Onayi ve Siparis Olusturma

### Neden?
> Musteri teklifi kabul edince bize PO (Purchase Order) gonderir. Biz de
> sisteme satis siparisi gireriz. Siparis, tum akisin tetikleyicisidir:
> malzeme al → uret → kalite kontrol → sevk et → faturala.

### Nasil?
1. Teklifler listesinde olusturdugun teklifi bul
2. **Durum Degistir** → **ONAYLANDI** sec

3. Sol menuden **Satislar** tikla
4. **+ Yeni Siparis** veya "Tekliften Aktar" tikla

```
Musteri:            TAI
Siparis Tarihi:     [bugun]
Teslimat Tarihi:    [45 gun sonra]
Kaynak Teklif:      TKL-2026-0089 [otomatik gelir]
```

> **Business bilgi — PO numarasi nedir?**
> PO = Purchase Order. Musterinin sana gonderdigi satin alma siparisi numarasidir.
> Faturanda bu numarayi yazmalisin yoksa odeme yapmazlar. Savunma firmalarinda
> PO olmadan is yapilmaz. TAI'nin PO numarasi mesela "TAI-PO-2026-4821" olabilir.

### Kontrol
- [ ] Siparis olusturuldu mu?
- [ ] Siparis durumu "BEKLIYOR" mu?

---

# ═══════════════════════════════════════════════════════════════
# KISIM C: MALZEME TEDARIEGI
# ═══════════════════════════════════════════════════════════════

Siparis elimizde, simdi uretim icin malzeme almamiz gerekiyor.

---

## ADIM 9: Satin Alma ve Stok Girisi

### Neden?
> Malzeme olmadan uretim yapamazsin. Ama savunma sanayinde malzeme alimi
> sıradan degildir. Malzemenin: (1) AMS/ASTM spesifikasyonuna uygun olmasi,
> (2) Mill Test Report (MTR) ile gelmesi, (3) onaylanmis tedarikçiden alinmasi
> zorunludur.

### Nasil?

#### 9.1 Stok Girisi
1. Sol menuden **Stok > Giris/Cikis** tikla
2. **+ Yeni** tikla

```
Islem Tipi:         Giris (Alis)
Urun:               HAM-7075-080060045 (7075-T6 Al Blok)
Miktar:             65
Depo:               Ana Depo [dropdown'dan sec]
Lot No:             ALC-2026-0487
Aciklama:           TAI-2026-0142 siparisi icin. Alcoa teslimat.
```

> **Business bilgi — Neden 65 adet? Siparis 60 degil mi?**
> Uretimde fire (hurda) olasiligi vardir. Ozellikle yeni bir parcada %5-10
> fire payi normaldır. 60 siparis + 5 fire payi = 65 adet hammadde alinir.
> Fire orani duser ama ilk partide tedbir alinir.

### Kontrol
- [ ] 65 adet stok girisi yapildi mi?
- [ ] Lot numarasi atandi mi?

---

## ADIM 10: Giris Muayenesi

### Neden?
> Tedarikci "7075-T6 gonderdim" dedi ama gercekten oyle mi? Malzeme sertifikasini
> kontrol etmek, fiziksel boyut kontrolu yapmak ve gerekirse numune test ettirmek
> gerekir. AS9100 8.4.2'de tedarikci urunlerinin dogrulanmasi zorunludur.

### Nasil?
1. Sol menuden **Kalite > Giris Kontrol** tikla
2. **+ Yeni Muayene** tikla

```
Urun:               HAM-7075-080060045 [dropdown'dan sec]
Tedarikci:          [varsa tedarikci kaydi, yoksa bos birak]
Lot No:             ALC-2026-0487
Gelen Miktar:       65
Muayene Tarihi:     [bugun]

Kabul:              65
Red:                0
Sonuc:              GECTI (PASS) [dropdown'dan sec]
Notlar:             MTR kontrol edildi. Kimyasal analiz ve mekanik ozellikler AMS 4078 uyumlu.
                    Boyutsal kontrol: 80.2 x 60.1 x 45.3mm — tolerans icinde.
```

> **Business bilgi — AQL nedir?**
> AQL (Acceptable Quality Level) = orneklem bazli kalite kontrol. 65 adetlik
> partiden hepsini tek tek kontrol etmek yerine, istatistiksel olarak belirlenmis
> sayida numune kontrolu yapilir. AQL 1.0, Normal (II) seviye: 65 adetlik partide
> 8 numune alinir. 0 hata → kabul, 1+ hata → tum parti ret.
> Ama hammaddede genellikle %100 sertifika kontrolu yapilir.

### Kontrol
- [ ] Giris muayene kaydi olusturuldu mu?
- [ ] Sonuc PASS mi?

---

## ADIM 11: Malzeme Sertifikasi Yukleme

### Neden?
> Savunma sanayinde malzeme sertifikasi olmadan uretim yapilmaz. MTR (Mill Test
> Report) malzemenin kimyasal bilesimini, mekanik ozelliklerini (cekme dayanimi,
> sertlik) ve isil islem durumunu kanitlar. Bu belge parcayla birlikte omur boyu
> saklanir. 20 yil sonra bile "bu parcada hangi malzeme kullanildi?" sorusuna
> cevap verebilmelisiniz.

### Nasil?
1. Giris Kontrol listesinde az once olusturdugune muayeneyi bul
2. Satirdaki **sertifika ikonu** (kilit veya kalkan ikonu) tikla
3. Acilan drawer'da **+ Ekle** tikla

**Sertifika 1:**
```
Sertifika No:       ALC-MTR-2026-0487
Tip:                MTR (Mill Test Report) [dropdown'dan sec]
Malzeme Spec:       7075-T6 / AMS 4078
Lot No:             ALC-2026-0487
Verilis Tarihi:     2026-04-01
Notlar:             Kimyasal analiz: Zn 5.6%, Mg 2.5%, Cu 1.6% — spec dahilinde.
                    Cekme dayanimi: 572 MPa (min 503). Sertlik: 87 HRB.
```

**Sertifika 2:**
```
Sertifika No:       ALC-COC-2026-0487
Tip:                CoC (Uygunluk Sertifikasi) [dropdown'dan sec]
Malzeme Spec:       AMS 4078 uyumlu
Lot No:             ALC-2026-0487
Verilis Tarihi:     2026-04-01
Notlar:             Alcoa kalite departmani tarafindan imzali CoC.
```

> **Business bilgi — MTR'de ne var?**
> Tipik bir MTR icerigi:
> - **Kimyasal analiz:** Al, Zn, Mg, Cu, Cr, Mn, Si, Fe, Ti yuzdeleri
> - **Mekanik ozellikler:** Cekme dayanimi (UTS), akma dayanimi (YS), uzama (%), sertlik
> - **Isil islem:** T6 (cozeltiye alma 480°C/2h + yapay yaslandirma 120°C/24h)
> - **Lot no, erime no (heat number):** Izlenebilirlik icin
> - **Uretici imza ve tarih**

### Kontrol
- [ ] 2 sertifika yuklendi mi?
- [ ] Sertifikalar muayene kaydina baglandi mi?

---

# ═══════════════════════════════════════════════════════════════
# KISIM D: URETIM
# ═══════════════════════════════════════════════════════════════

Malzeme geldi, muayenesi gecti, sertifikalari yuklendi. Simdi uretim basliyor.

---

## ADIM 12: Is Emri Sablonu ve Uretim Emri

### Neden?
> Uretim emri olusturuldugunda, parcanin hangi operasyonlardan gececegini
> belirleyen bir "is emri sablonu" atanir. Bu sablon ADIM 2'de tanimladigimiz
> operasyonlari siralar ve her birine makine, sure, kalite kontrol atar.

### Nasil?

#### 12.1 Is Emri Sablonu Olusturma
1. Sol menuden **Ayarlar > Is Emri Sablonlari** tikla
2. **+ Yeni Sablon** tikla

```
Sablon Adi:     TAI-0142 Hidrolik Manifold Operasyon Sirasi
```

Adimlar (sirayla ekle — surukle birak ile sirala):
```
Sira 1: OP10 — CNC Torna
  Makine: CNC-T01
  Kullanici: [bos veya atanacak operator]
  Tahmini Sure: 12 dk
  Hazirlik: 30 dk
  Calisma: 12 dk
  Kalite Kontrol: EVET [isaretli]
  Onkosul: — (ilk adim)

Sira 2: OP20 — CNC Freze
  Makine: CNC-F01
  Tahmini Sure: 18 dk
  Hazirlik: 45 dk
  Calisma: 18 dk
  Kalite Kontrol: EVET
  Onkosul: 1 (OP10 bitmeden baslamaz)

Sira 3: OP30 — Taslama
  Makine: TAS-01
  Tahmini Sure: 8 dk
  Hazirlik: 20 dk
  Calisma: 8 dk
  Kalite Kontrol: EVET
  Onkosul: 2

Sira 4: OP40 — Capak Alma
  Makine: [bos]
  Tahmini Sure: 3 dk
  Hazirlik: 5 dk
  Calisma: 3 dk
  Kalite Kontrol: HAYIR
  Onkosul: 3

Sira 5: OP50 — CMM Olcum
  Makine: [bos]
  Tahmini Sure: 15 dk
  Hazirlik: 10 dk
  Calisma: 15 dk
  Kalite Kontrol: EVET
  Onkosul: 4

Sira 6: OP60 — Fason Kaplama
  Makine: [bos]
  Kalite Kontrol: EVET
  Onkosul: 5

Sira 7: OP70 — Final Muayene
  Makine: [bos]
  Tahmini Sure: 10 dk
  Hazirlik: 15 dk
  Calisma: 10 dk
  Kalite Kontrol: EVET
  Onkosul: 6
```

#### 12.2 Siparis → Uretim Emri Aktarimi
1. Sol menuden **Satislar** tikla
2. TAI siparisini bul
3. **Onayla ve Uretime Aktar** butonuna tikla
4. Is Emri Sablonu olarak **TAI-0142** sec

> **Business bilgi — "Uretime aktarma" ne yapar?**
> Sistem otomatik olarak: (1) Uretim emri olusturur, (2) Is emri sablonundaki
> 7 adimi kopyalar, (3) Her adim icin WorkOrder kaydi olusturur, (4) Durumu
> BEKLIYOR yapar. Artik operator terminalinde bu isler gorunur.

### Kontrol
- [ ] 7 adimli is emri sablonu olusturuldu mu?
- [ ] Uretim emri olusturuldu mu?
- [ ] 7 is emri (WorkOrder) uretim emrine baglandi mi?

---

## ADIM 13: Atolye Terminali — OP10 CNC Torna

### Neden?
> Artik fabrika katindayiz. Operator tablette "Atolye Terminali" ekranini acar,
> kendine atanan isi gorur, "Baslat" tuşuna basar ve calismaya baslar. Bitirince
> "Tamamla" der, olculeri girer. Sistem otomatik olarak pass/fail kontrol eder.

### Nasil?
1. Sol menuden **Atolye Terminali** tikla (veya `/shop-floor-terminal` git)
2. "Benim Islerim" listesinde **OP10 — CNC Torna** gorunmeli
3. **Baslat** butonuna bas

```
Zamanlayici baslar: 00:00:00 → ilerliyor
Makine secimi: CNC-T01 (otomatik gelir)
```

4. (Uretim yapildigini farz et — 60 parça islendi)
5. **Tamamla** butonuna bas
6. Adet gir: **60**
7. **Olcum modali acilir** (RequiresQualityCheck=true oldugu icin)

### Olcum Girisi
Modal'da 3 olcum noktasi gorunur (kontrol planindan):

```
Olcum 1: Dis Cap Ø25
  Spesifikasyon: 25.000
  Tolerans: +0.010 / -0.000
  Kabul araligi: 25.000 — 25.010
  ──────────────────────
  OLCULEN DEGER: 25.006  [yaz]
  → YESIL TIKLAMA ✅ (tolerans icinde)

Olcum 2: Toplam Boy 42
  Spesifikasyon: 42.000
  Tolerans: ±0.050
  Kabul araligi: 41.950 — 42.050
  ──────────────────────
  OLCULEN DEGER: 41.98   [yaz]
  → YESIL TIKLAMA ✅

Olcum 3: Yuzey Ra
  Spesifikasyon: 1.600
  Tolerans: +0.000 / -0.800
  Kabul araligi: 0.800 — 1.600
  ──────────────────────
  OLCULEN DEGER: 1.2     [yaz]
  → YESIL TIKLAMA ✅
```

8. Altta ozet: **"3/3 Olcum Gecti"** (yesil)
9. **"Olcumleri Kaydet & Tamamla"** butonuna bas

> **Business bilgi — Neden operator olcum yapar?**
> Savunma sanayinde "self-inspection" (kendi isini kontrol etme) zorunludur.
> Operator her parcayi olcer, kayit eder. Ancak final muayene ayri bir kisi
> tarafindan yapilir. Bu ikili kontrol AS9100'un temelidir.

### Kontrol
- [ ] Is baslatildi, zamanlayici calisti mi?
- [ ] Olcum modali acildi mi? 3 nokta gorundu mu?
- [ ] Degerler girilince aninda pass/fail gorundu mu?
- [ ] Tum olcumler gecince otomatik kalite onayi geldi mi?
- [ ] OP10 tamamlandi, OP20 baslatilabilir durumda mi?

---

## ADIM 14: OP20 CNC Freze (Onkosul Kontrolu ile)

### Nasil?
1. Atolye Terminalinde **OP20 — CNC Freze** gorulmeli
2. **Baslat** tusuna bas

> **Onemli:** Sistem arka planda OP10'un kalite kontrolunun gectigini dogrular.
> Eger OP10 kalitesi onaylanmamis olsaydi "Onceki operasyonun kalite kontrolu
> tamamlanmadi" hatasi verirdi ve "Kalite Kontrol Bekliyor" kirmizi badge gorunurdu.

3. Is tamamlaninca 4 olcum noktasi gelir:

```
Olcum 1: Cep Derinligi 12.5
  Spec: 12.500 / ±0.050
  OLCULEN: 12.52  → ✅

Olcum 2: Delik Capi Ø8 H7
  Spec: 8.000 / +0.015/-0.000
  OLCULEN: 8.008  → ✅

Olcum 3: Delik Konum X
  Spec: 15.000 / ±0.050
  OLCULEN: 15.02  → ✅

Olcum 4: Delik Konum Y
  Spec: 20.000 / ±0.050
  OLCULEN: 19.97  → ✅
```

### Kontrol
- [ ] Onkosul kontrolu calisti mi? (OP10 kalite gecmis olmali)
- [ ] 4 olcum girildi, hepsi gecti mi?

---

## ADIM 15: OP30 Taslama, OP40 Capak, OP50 CMM

Ayni mantikla devam et:

**OP30 Taslama:**
```
Olcum 1: Dis Cap Ø25 h6 — Spec: 25.000, +0.000/-0.013 → OLCULEN: 24.994 ✅
Olcum 2: Silindiriklik — Spec: 0.005, +0.000/-0.005 → OLCULEN: 0.003 ✅
```

**OP40 Capak Alma:**
```
Kalite kontrol yok — sadece adet gir (60) ve tamamla.
Olcum modali acilMAZ.
```

**OP50 CMM Olcum:**
```
Tum kritik boyutlarin CMM ile olcumu.
Bu adimda FAI icin detayli veri toplanir.
```

### Kontrol
- [ ] OP30: h6 toleransi icinde olcum girildi mi?
- [ ] OP40: Olcum istenmeden tamamlandi mi?
- [ ] OP50: CMM olcumleri girildi mi?

---

# ═══════════════════════════════════════════════════════════════
# KISIM E: FASON IS
# ═══════════════════════════════════════════════════════════════

## ADIM 16: Fason Siparis (Kadmiyum Kaplama)

### Neden?
> Parcalarimiz CNC islemelerden gecti, simdi yuzey kaplamasi gerekiyor.
> Kadmiyum kaplama korozyona karsi koruma saglar ve havacilikta standart
> kaplamadır. Biz bunu yapamayiz — NADCAP onayli bir kaplama firmasina
> yaptirmamiz gerekir.

### Nasil?
1. Sol menuden **Uretim > Fason Is Emirleri** tikla (veya `/subcontract-orders`)
2. **+ Yeni** tikla

```
Tedarikci:              [tedarikci kaydi varsa sec, yoksa notu yaz]
Uretim:                 URE-2026-0142 [dropdown'dan sec]
Urun:                   TAI-2026-0142 (Hidrolik Manifold)
Proses Tipi:            Yuzey Kaplama [dropdown'dan sec]
Proses Tanimi:          Kadmiyum kaplama — AMS-QQ-P-416 Tip II Sinif 3
                        Kalinlik: 8-13 mikron
                        Hidrojen gevreklesme bakisi (baking) 190°C/23h zorunlu
Gonderilen Miktar:      60
Siparis Miktari:        60
Birim Fiyat:            45
Para Birimi:            TRY
Beklenen Donus:         [7 is gunu sonrasi]
Kalite Gereksinimi:     Kaplama CoC, kalinlik olcum raporu, yapisme test sonucu
Muayene Gerekli:        EVET [isaretli]
```

> **Business bilgi — Neden kadmiyum kaplama?**
> Kadmiyum: (1) Mukemmel korozyon korumasi, (2) Galvanik uyumluluk (aluminyum+celik
> birlesimlerinde), (3) Dusuk surtunme (vidalarda onemli), (4) Kendini iyilestirme
> (ciziklerde bile koruma devam eder). Dezavantajı: Toksik madde, REACH kısıtlı.
> Ama havacilikta hala en cok kullanilan kaplamadir. RoHS muaf.

3. Kaydet → Durum: TASLAK (DRAFT)
4. **Gonder** butonuna bas → Durum: GONDERILDI (SENT)

### Geri sayim gorunuyor mu?
```
"Tahmini donus: 7 gun" [yesil badge]
```

5. (7 gun sonra parcalar dondugunu farz et)
6. **Tedarikcide** butonuna bas → AT_SUPPLIER
7. **Basladi** butonuna bas → IN_PROGRESS
8. **Tamamlandi** butonuna bas → COMPLETED
   - Gelen Miktar: 60
   - Tedarikci Sertifika No: YK-COC-2026-0487

9. **Muayene Tamamlandi** butonuna bas → INSPECTED
   - Muayene Notlari: "Kaplama kalinligi 9-11 mikron, homojen. Yapisme testi GECTI. Gorsel uygun."

### Kontrol
- [ ] Fason siparis olusturuldu mu?
- [ ] Proses tipi SURFACE_COATING secildi mi?
- [ ] Durum akisi DRAFT→SENT→AT_SUPPLIER→IN_PROGRESS→COMPLETED→INSPECTED calisti mi?
- [ ] Geri sayim badge gorundu mu?

---

# ═══════════════════════════════════════════════════════════════
# KISIM F: ILK PARCA MUAYENESI (FAI)
# ═══════════════════════════════════════════════════════════════

## ADIM 17: FAI (First Article Inspection — AS9102)

### Neden?
> Savunma sanayinde yeni bir parca uretildiginde, ilk partiden 3 parca secilir
> ve TUM boyutlari tek tek olculur. Buna FAI (First Article Inspection) denir.
> Sonuc AS9102 formatiyla raporlanir ve musteriye gonderilir. Musteri FAI'yi
> onaylamadan seri uretim yapilamaz.
>
> FAI 3 formdan olusur:
> - Form 1: Parca numarasi hesap verebilirlik
> - Form 2: Urun hesap verebilirlik — malzeme, ozel proses, fonksiyonel test
> - Form 3: Boyutsal dogrulama — her olcu tek tek

### Nasil?
1. Sol menuden **Kalite > FAI** tikla (veya `/quality/fai`)
2. **+ Yeni FAI** tikla

```
Tip:                FULL (Tam FAI)
Neden:              Yeni Parca (NEW_PART)
Parca No:           TAI-2026-0142
Parca Adi:          Hidrolik Manifold Blogu
Revizyon:           Rev B
Cizim No:           TAI-DWG-2026-0142
Siparis Referansi:  SIP-2026-0142
Seri No:            TAI-0142-001
Malzeme:            7075-T6 Aluminyum (AMS 4078)
Uretim Prosesi:     CNC Torna + CNC Freze + Taslama + Kadmiyum Kaplama
```

Kaydet → Durum: DRAFT
Durum degistir → IN_PROGRESS

3. **Karakteristikler** sekmesine gec
4. Her olcu icin **+ Ekle** ile karakteristik gir:

```
Karakteristik 1:
  Kalem No:             1
  Tanim:                Dis Cap Ø25 h6
  Cizim Referansi:      A-A kesit
  Spesifikasyon:        25.000
  Tolerans +:           0.000
  Tolerans -:           0.013
  Olculen Deger:        24.994
  Sonuc:                GECTI [dropdown]
  Olcum Aleti:          Mikrometre MIK-001
  Anahtar Karakteristik: EVET [isaretli]

Karakteristik 2:
  Kalem No:             2
  Tanim:                Toplam Boy
  Spesifikasyon:        42.000
  Tolerans +:           0.050
  Tolerans -:           0.050
  Olculen Deger:        41.98
  Sonuc:                GECTI
  Olcum Aleti:          Kumpas KAL-001
  Anahtar Karakteristik: Hayir

Karakteristik 3:
  Kalem No:             3
  Tanim:                Cep Derinligi
  Spesifikasyon:        12.500
  Tolerans +:           0.050
  Tolerans -:           0.050
  Olculen Deger:        12.52
  Sonuc:                GECTI
  Olcum Aleti:          Kumpas KAL-001

Karakteristik 4:
  Kalem No:             4
  Tanim:                Delik Capi Ø8 H7
  Spesifikasyon:        8.000
  Tolerans +:           0.015
  Tolerans -:           0.000
  Olculen Deger:        8.008
  Sonuc:                GECTI
  Olcum Aleti:          Uc Olcer UC-001
  Anahtar Karakteristik: EVET

Karakteristik 5:
  Kalem No:             5
  Tanim:                Delik Konum X
  Spesifikasyon:        15.000
  Tolerans +:           0.050
  Tolerans -:           0.050
  Olculen Deger:        15.02
  Sonuc:                GECTI
  Olcum Aleti:          CMM-001
  Anahtar Karakteristik: EVET

Karakteristik 6:
  Kalem No:             6
  Tanim:                Delik Konum Y
  Spesifikasyon:        20.000
  Tolerans +:           0.050
  Tolerans -:           0.050
  Olculen Deger:        19.97
  Sonuc:                GECTI
  Olcum Aleti:          CMM-001
  Anahtar Karakteristik: EVET

Karakteristik 7:
  Kalem No:             7
  Tanim:                Silindiriklik
  Spesifikasyon:        0.005
  Tolerans +:           0.000
  Tolerans -:           0.005
  Olculen Deger:        0.003
  Sonuc:                GECTI
  Olcum Aleti:          CMM-001
  Anahtar Karakteristik: EVET

Karakteristik 8:
  Kalem No:             8
  Tanim:                Yuzey Puruzlulugu Ra
  Spesifikasyon:        1.600
  Tolerans +:           0.000
  Tolerans -:           0.800
  Olculen Deger:        1.2
  Sonuc:                GECTI
  Olcum Aleti:          Puruzluluk YUZ-001

Karakteristik 9:
  Kalem No:             9
  Tanim:                Kaplama Kalinligi
  Spesifikasyon:        10.000
  Tolerans +:           3.000
  Tolerans -:           2.000
  Olculen Deger:        10.2
  Sonuc:                GECTI
  Olcum Aleti:          Kaplama kalinlik olcer
```

5. Durum degistir → PENDING_APPROVAL → **APPROVED**
6. **PDF Rapor Indir** butonuna tikla

> **Business bilgi — KC (Key Characteristic) nedir?**
> Anahtar Karakteristik = Parcenin fonksiyonunu, performansini veya guvenligini
> dogrudan etkileyen olcu. Ornegin Ø25 h6 bir KC cunku bir sizdirmazlik
> o-ringi bu yüzeyde oturuyor. KC'ler FAI'da ayrica isaretlenir ve SPC ile
> surekli izlenmesi gerekir.

### Kontrol
- [ ] FAI kaydi olusturuldu mu?
- [ ] 9 karakteristik girildi, hepsi PASS mi?
- [ ] 5 Key Characteristic isaretlendi mi?
- [ ] Durum APPROVED oldu mu?
- [ ] AS9102 PDF raporu indirilebildi mi?

---

# ═══════════════════════════════════════════════════════════════
# KISIM G: FINAL ve SEVKIYAT
# ═══════════════════════════════════════════════════════════════

## ADIM 18: Final Muayene ve Sevkiyat

### 18.1 Final Muayene Onay
> Final muayene, son kalite kapisidir. Gecmeden sevkiyat yapilamaz.

### 18.2 Fatura
1. Sol menuden **Faturalar** tikla → **+ Yeni Fatura**

```
Musteri:            TAI
Siparis Ref:        SIP-2026-0142
Fatura Tarihi:      [bugun]
Vade:               60 gun

Kalem:
  Urun:             TAI-2026-0142 (Hidrolik Manifold Blogu)
  Miktar:           60
  Birim Fiyat:      85
  Para Birimi:      USD
  KDV:              %20
```

### Kontrol
- [ ] Fatura olusturuldu mu?
- [ ] Toplam $6,120 (KDV dahil) mi?

---

# ═══════════════════════════════════════════════════════════════
# KISIM H: KALITE OLAYLARI (SORUN SENARYOSU)
# ═══════════════════════════════════════════════════════════════

## ADIM 19: NCR (Uygunsuzluk Raporu)

### Neden?
> Gercek hayatta her sey mukemmel gitmez. Bir parca tolerans disina cikar,
> malzeme hatali gelir, kaplama tutmaz. Boyle durumlarda NCR (Non-Conformance
> Report) acilir. NCR, sorunun kayit altina alinmasi, kok nedenin bulunmasi
> ve cozulmesini saglar. AS9100'de NCR zorunludur.

### Nasil?
1. Sol menuden **Kalite > Uygunsuzluk (NCR)** tikla
2. **+ Yeni** tikla

```
Siddet:             MAJOR [dropdown]
Tespit Tarihi:      [bugun]
Urun:               TAI-2026-0142 [arama ile sec]
Etkilenen Miktar:   1
Tanim:              OP30 silindirik taslama sirasinda Seri No TAI-0142-023 
                    parcasinin dis cap olcusu 24.980mm olarak olculmustur.
                    Tolerans: Ø25 h6 (24.987-25.000mm). 
                    Deger 7 mikron alt sinirin altinda.
                    Muhtemel neden: Taslik asinmasi, besleme hizi fazla.
```

3. NCR durumunu ilerlet:
   - OPEN → UNDER_REVIEW → CORRECTIVE_ACTION

4. Kok neden ve aksiyonlari gir:
```
Kok Neden:          Taslik asinma limiti asilmis. Dressleme peryodu (50 parca)
                    kacirilmis. Bakim planinda taslik dressleme tanimli degil.

Duzeltici Faaliyet: Taslik dressleme peryodu 50 parcadan 30 parcaya dusuruldu.
                    TAS-01 bakim planina "her 30 parcada taslik dressleme" eklendi.

Onleyici Faaliyet:  Tum taslama makineleri icin dressleme peryodu 
                    bakim planina eklendi. Operator egitimi verildi.
```

5. Durumu CLOSED yap

> **Business bilgi — NCR kapatma kurali:**
> AS9100'de NCR kapatilmadan once kok neden (root cause) girilmek ZORUNDADIR.
> Quvex'te bu kural kodda enforce ediliyor — kok neden bos birakarak NCR
> kapatamazsiniz.

### Kontrol
- [ ] NCR olusturuldu mu?
- [ ] Kok neden girilmeden kapatma engellendi mi?
- [ ] CLOSED durumuna gecti mi?

---

## ADIM 20: CAPA (Duzeltici Faaliyet)

### Nasil?
1. **Kalite > CAPA** tikla → **+ Yeni**

```
Tip:                Duzeltici (Corrective)
Kaynak:             NCR [dropdown]
Oncelik:            Yuksek (HIGH)
Tanim:              Taslik asinma kontrolu yetersiz, dressleme peryodu kacirildi.
Son Tarih:          [10 gun sonra]

Kok Neden Metodu:   5 Neden (5 Why)
Kok Neden:          Bakim planinda taslik dressleme tanimli degil
Onerilen Aksiyon:   Bakim planina ekleme + operator egitimi
Alinan Aksiyon:     Tamamlandi — bakim plani guncellendi, egitim verildi
Dogrulama Yontemi:  Sonraki 100 parcada SPC analizi
```

2. Durumlari sirayla ilerlet:
   OPEN → ROOT_CAUSE → ACTION_PLANNED → IN_PROGRESS → VERIFICATION → CLOSED

3. Etkinlik dogrulamasi:
```
Etkin mi: EVET — Sonraki 100 parcada tolerans disi parca cikmadi.
```

### Kontrol
- [ ] CAPA olusturuldu ve NCR'ye baglandi mi?
- [ ] 6 adimli workflow calisti mi?
- [ ] Etkinlik dogrulamasi yapildi mi?

---

# ═══════════════════════════════════════════════════════════════
# KISIM I: MALIYET ve RAPORLAR
# ═══════════════════════════════════════════════════════════════

## ADIM 21: Maliyet Analizi

1. Sol menuden **Uretim > Maliyet Analizi** tikla
2. Uretim emrini sec (URE-2026-0142)
3. Maliyet kirilimi gorunecek:

```
Beklenen goruntu:
┌─────────────────────────────────────────┐
│  MALZEME        │  İŞÇİLİK    │  MAKİNE  │
│  19,520 TL      │  xxx TL      │  xxx TL  │
│                 │              │          │
│  GENEL GİDER    │  TOPLAM      │  BİRİM   │
│  xxx TL (%43)   │  xxx TL      │  xxx TL  │
└─────────────────────────────────────────┘
  + Pasta grafik (4 dilim)
  + Kalem detay tablosu
```

### Kontrol
- [ ] Maliyet sayfasi yuklendi mi?
- [ ] 4 maliyet kategorisi gorunuyor mu?
- [ ] Pasta grafik dogru mu?

---

## ADIM 22: Executive Dashboard Kontrolu

1. Sol menuden **Yonetim Kokpiti** tikla
2. Kontrol et:
   - [ ] Toplam gelir gorunuyor mu?
   - [ ] Acik siparis sayisi dogru mu?
   - [ ] OEE metrikleri var mi?
   - [ ] NCR/CAPA sayilari dogru mu?
   - [ ] Zamaninda teslimat orani dogru mu?

---

# ═══════════════════════════════════════════════════════════════
# SONUC: TAMAMLANMA KONTROL LISTESI
# ═══════════════════════════════════════════════════════════════

Tum adimlari tamamladigin: (isaretleyerek ilerle)

| # | Adim | Tamamlandi |
|---|------|-----------|
| 1 | 6 makine tanimlandi | [ ] |
| 2 | 7 operasyon adimi tanimlandi | [ ] |
| 3 | 3 genel gider kalemi eklendi | [ ] |
| 4 | 5 kalibrasyon ekipmani + kayitlari | [ ] |
| 5 | TAI musteri karti olusturuldu | [ ] |
| 6 | Urun + BOM tanimlandi | [ ] |
| 7 | Teklif hazirlandi | [ ] |
| 8 | Siparis olusturuldu | [ ] |
| 9 | Malzeme stok girisi yapildi | [ ] |
| 10 | Giris muayenesi yapildi | [ ] |
| 11 | Malzeme sertifikasi yuklendi | [ ] |
| 12 | Is emri sablonu + uretim emri | [ ] |
| 13 | OP10 Torna — basla, olc, tamamla | [ ] |
| 14 | OP20 Freze — onkosul + olcum | [ ] |
| 15 | OP30/40/50 — taslama/capak/CMM | [ ] |
| 16 | Fason kaplama siparisi + donus | [ ] |
| 17 | FAI (9 karakteristik + PDF) | [ ] |
| 18 | Final muayene + fatura | [ ] |
| 19 | NCR (tolerans disi parca) | [ ] |
| 20 | CAPA (duzeltici faaliyet) | [ ] |
| 21 | Maliyet analizi | [ ] |
| 22 | Executive dashboard | [ ] |

**Toplam: 22 ana adim, ~50 alt islem**

> Bu rehberi tamamladiginizda, bir savunma sanayi CNC atölyesinin
> tum is sureclerini Quvex ERP'de uctan uca yurutmus olacaksiniz.
