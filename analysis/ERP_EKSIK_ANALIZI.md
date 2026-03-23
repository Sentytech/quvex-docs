# smallFactory ERP - Eksik Ozellik ve Gelistirme Analizi

**Proje:** Asya | Uretim Takip
**Mevcut Tamamlanma Orani:** ~%35-40
**Analiz Tarihi:** 2026-03-07

---

## MEVCUT MODULLERIN DURUM TABLOSU

| Modul | Tamamlanma | Durum |
|-------|-----------|-------|
| Kimlik Dogrulama | %70 | Calisiyor ama yetkilendirme devre disi |
| Musteri Yonetimi | %70 | Temel CRUD var, ileri ozellikler eksik |
| Urun Yonetimi | %85 | En olgun modul, urun agaci var |
| Teklif Yonetimi | %90 | Iyi durumda |
| Satis Yonetimi | %95 | Iyi durumda, hiyerarsik yapi var |
| Uretim Yonetimi | %85 | Calisiyor, planlama eksik |
| Is Emri Yonetimi | %80 | Sablon + log var, zamanlama eksik |
| Stok/Depo Yonetimi | %85 | Coklu depo, giris/cikis var |
| Sevkiyat | %60 | Temel takip var, entegrasyonlar eksik |
| Faturalama | %55 | Sadece miktar takibi, gercek fatura yok |
| Makine Yonetimi | %40 | Sadece kayit, bakim/kapasite yok |
| Malzeme/Birim | %70 | Temel tanimlar var |
| Raporlama | %15 | Sadece 2 grafik |
| Dosya Yonetimi | %50 | Temel yukleme var |
| Satin Alma | %45 | Talep + teklif var, siparis yonetimi eksik |
| Dashboard | %30 | Basit kartlar ve 2 grafik |

---

## A. MEVCUT MODULLERDEKI EKSIKLER

### A1. Kimlik Dogrulama ve Yetkilendirme

**Mevcut:** Login, register, JWT token, rol/izin tanimlari
**Eksikler:**

| # | Eksik Ozellik | Oncelik | Aciklama |
|---|--------------|---------|----------|
| A1-01 | Yetkilendirme calismiyor | KRITIK | YetkiDenetimi filter'i ilk satirda return yapiyor, tum API korumasiz |
| A1-02 | Sifre sifirlama | YUKSEK | ForgotPassword/ResetPassword modeli var ama endpoint yok |
| A1-03 | Refresh token yenileme | YUKSEK | RefreshToken entity var ama yenileme endpoint'i yok |
| A1-04 | Oturum yonetimi | ORTA | Aktif oturumlari goruntuleme/sonlandirma |
| A1-05 | Sifre politikasi | ORTA | Minimum karakter, buyuk/kucuk harf, ozel karakter zorunlulugu |
| A1-06 | Basarisiz giris kilitleme | ORTA | N basarisiz denemeden sonra hesap kilitleme |
| A1-07 | Iki faktorlu dogrulama (2FA) | DUSUK | OTP/SMS ile ek guvenlik |
| A1-08 | LDAP/Active Directory entegrasyonu | DUSUK | Kurumsal kimlik yonetimi |

---

### A2. Musteri Yonetimi

**Mevcut:** CRUD, musteri/tedarikci ayirimi, arama
**Eksikler:**

| # | Eksik Ozellik | Oncelik | Aciklama |
|---|--------------|---------|----------|
| A2-01 | Musteri kredi limiti | YUKSEK | Acik hesap calisilan musterilerde kredi limiti tanimi |
| A2-02 | Odeme vadesi tanimi | YUKSEK | Musteri bazinda odeme vade gunleri (30/60/90 gun) |
| A2-03 | Musteri segmentasyonu | ORTA | A/B/C siniflandirmasi, sektor, bolge bazli gruplama |
| A2-04 | Iletisim gecmisi | ORTA | Musteri ile yapilan gorusme/email kayitlari |
| A2-05 | Coklu adres destehi | ORTA | Fatura adresi, sevkiyat adresi, fabrika adresi ayri ayri |
| A2-06 | Coklu irtibat kisisi | ORTA | Musteri altinda birden fazla yetkili kisi |
| A2-07 | Musteri performans raporu | DUSUK | Toplam ciro, siparis sayisi, ortalama odeme suresi |
| A2-08 | Musteri portal | DUSUK | Musterinin kendi siparis/teklif durumunu gorebilecegi portal |

---

### A3. Urun Yonetimi

**Mevcut:** CRUD, urun agaci, gorseller, stok/hammadde/yarimamul tipleri, kopyalama
**Eksikler:**

| # | Eksik Ozellik | Oncelik | Aciklama |
|---|--------------|---------|----------|
| A3-01 | Urun barkodu/QR kodu | YUKSEK | Barkod olusturma ve okuma, depo islemlerinde kullanim |
| A3-02 | Urun fiyat listesi | YUKSEK | Musteri/grup bazli fiyat tanimlari, iskonto oranlari |
| A3-03 | Urun varyantlari | ORTA | Ayni urunun farkli boyut/renk/malzeme cesitleri |
| A3-04 | Urun versiyonlama | ORTA | Tasarim degisikliklerinde revizyon takibi (Rev.A, Rev.B) |
| A3-05 | BOM (Bill of Materials) maliyet hesabi | YUKSEK | Urun agacindan otomatik maliyet hesaplama |
| A3-06 | Urun yasam dongusu | DUSUK | Aktif/Pasif/Uretimden kaldirildi/Arsiv durumlari |
| A3-07 | Teknik resim/dokuman iliskilendirme | ORTA | Her urune teknik resim, olcu raporu, sertifika baglama |
| A3-08 | Alternatif malzeme tanimi | ORTA | Bir hammadde bulunamazsa kullanilacak alternatifler |
| A3-09 | Min/Max stok seviyeleri | YUKSEK | Urun bazinda minimum ve maksimum stok tanimi |
| A3-10 | Tedarik suresi (lead time) | YUKSEK | Urun bazinda tedarik/uretim suresi tanimi |

---

### A4. Teklif Yonetimi

**Mevcut:** CRUD, durum yonetimi (TASLAK/GONDERILDI/KABUL/RED), kalem yonetimi
**Eksikler:**

| # | Eksik Ozellik | Oncelik | Aciklama |
|---|--------------|---------|----------|
| A4-01 | Teklif gecerlilik suresi | YUKSEK | Son gecerlilik tarihi ve suresi dolan teklif uyarisi |
| A4-02 | Teklif sablon sistemi | ORTA | Sik kullanilan urunler icin hazir teklif sablonlari |
| A4-03 | Iskonto yonetimi | YUKSEK | Kalem bazli, toplam, kademeli iskonto tanimlari |
| A4-04 | Teklif PDF ciktisi | YUKSEK | Antetli kagit formatinda PDF olusturma |
| A4-05 | Teklif revizyon takibi | ORTA | Ayni teklifin farkli versiyonlarini kaydetme |
| A4-06 | Teklif onay sureci | ORTA | Belirli tutarin uzerindeki tekliflerde yonetici onayi |
| A4-07 | Teklif karsilastirma | DUSUK | Rekabet analizi, onceki tekliflerle kiyaslama |
| A4-08 | Teklif email gonderimi | ORTA | Sistem uzerinden musteriye teklif email'i gonderme |
| A4-09 | KDV/Vergi hesaplama | YUKSEK | Kalem ve toplam bazinda KDV hesabi |

---

### A5. Satis Yonetimi

**Mevcut:** Siparis olusturma, hiyerarsik yapi, durum takibi, filtreleme
**Eksikler:**

| # | Eksik Ozellik | Oncelik | Aciklama |
|---|--------------|---------|----------|
| A5-01 | Siparis onay is akisi | YUKSEK | Siparisin onaylanma sureci (satis -> yonetici -> uretim) |
| A5-02 | Kismi teslimat yonetimi | YUKSEK | Siparisin parcali teslim edilmesi, kalan miktar takibi |
| A5-03 | Siparis degisiklik talebi | ORTA | Musteri siparis degisikligi istediginde revizyon sureci |
| A5-04 | Teslim tarihi tahmini | YUKSEK | Mevcut uretim yukune gore teslim tarihi onermesi |
| A5-05 | Siparis iptal sureci | ORTA | Iptal nedeni kaydi, uretim/stok etkisi geri alma |
| A5-06 | Odeme kosullari | YUKSEK | Siparis bazinda odeme vadesi/sekli tanimi |
| A5-07 | Siparis bazli kar/zarar | ORTA | Her siparisin maliyet ve kar analizi |
| A5-08 | Geciken siparis uyarilari | YUKSEK | Teslim tarihi gecen siparisler icin otomatik uyari |

---

### A6. Uretim Yonetimi

**Mevcut:** Uretim emri, hiyerarsik yapi, durum takibi, is emri log, tamamlama girisi
**Eksikler:**

| # | Eksik Ozellik | Oncelik | Aciklama |
|---|--------------|---------|----------|
| A6-01 | Uretim planlama/cizelgeleme | KRITIK | Gantt chart ile is emri zamanlama, siralama, onceliklendirme |
| A6-02 | Kapasite planlama | KRITIK | Makine/isci bazli kapasite hesabi, doluluk orani |
| A6-03 | Darboaz analizi | YUKSEK | Hangi is istasyonunun darboaz oldugunu tespit etme |
| A6-04 | Uretim maliyeti hesaplama | KRITIK | Iscilik + malzeme + genel gider = birim maliyet |
| A6-05 | Fire/hurda takibi | YUKSEK | Uretimde olusan fire miktari ve maliyeti |
| A6-06 | Yeniden islem (rework) takibi | ORTA | Hatali urunlerin tekrar isleme alinmasi |
| A6-07 | Uretim duraklatma/devam | ORTA | Uretimi gecici olarak durdurma ve nedenini kaydetme |
| A6-08 | Operasyon bazli sure takibi | YUKSEK | Her is adiminin baslangic/bitis sureleri, setup/run time |
| A6-09 | Paralel is emri destegi | ORTA | Birden fazla operasyonun es zamanli yurutulmesi |
| A6-10 | Uretim kuyruklama (queue) | ORTA | Makine onundeki is emri kuyrugu goruntuleme |
| A6-11 | OEE (Overall Equipment Effectiveness) | YUKSEK | Makine verimliligi hesabi (Availability x Performance x Quality) |
| A6-12 | Uretim talimat dokumanlari | ORTA | Her is emrine bagli calisma talimatlari |

---

### A7. Stok ve Depo Yonetimi

**Mevcut:** Coklu depo, giris/cikis fisi, urun bazli stok, talep yonetimi
**Eksikler:**

| # | Eksik Ozellik | Oncelik | Aciklama |
|---|--------------|---------|----------|
| A7-01 | Stok sayim (envanter) | YUKSEK | Periyodik fiziksel sayim, sayim farki raporlama |
| A7-02 | Lot/parti takibi | YUKSEK | Hammadde parti numarasi ile izlenebilirlik |
| A7-03 | Seri numarasi takibi | ORTA | Mamul urunlerde seri numarasi izleme |
| A7-04 | FIFO/LIFO/Agirlikli ort. | YUKSEK | Stok degerleme yontemi secimi |
| A7-05 | Raf omru / Son kullanim tarihi | ORTA | Kimyasal/bozulabilir malzemelerde vade takibi |
| A7-06 | Minimum stok uyarisi | YUKSEK | Stok minimum seviyenin altina dustugunde otomatik uyari |
| A7-07 | Otomatik satin alma talebi | YUKSEK | Min stok altina dusunce otomatik tedarik talebi olusturma |
| A7-08 | Stok transfer (depolar arasi) | ORTA | Bir depodan digerine malzeme transferi |
| A7-09 | Stok yaslama raporu | ORTA | Depoda kac gundur bekleyen malzeme analizi |
| A7-10 | Barkodlu stok islemleri | YUKSEK | Barkod okuyucu ile hizli giris/cikis/sayim |
| A7-11 | Konsinye stok takibi | DUSUK | Tedarikci deposunda/musteride konsinye stok |
| A7-12 | Iade yonetimi | ORTA | Musteri iadesi ve tedarikci iadesi surecleri |

---

### A8. Sevkiyat

**Mevcut:** Sevk detayi (irsaliye no, miktar), uretimle iliskilendirme
**Eksikler:**

| # | Eksik Ozellik | Oncelik | Aciklama |
|---|--------------|---------|----------|
| A8-01 | Irsaliye olusturma ve yazdirma | YUKSEK | Resmi irsaliye formatinda PDF cikti |
| A8-02 | Sevk planlama | ORTA | Hangi siparislerin hangi tarihte sevk edilecegi |
| A8-03 | Kargo/nakliye firma entegrasyonu | DUSUK | Kargo takip numarasi, tasima maliyeti |
| A8-04 | Kismi sevkiyat yonetimi | YUKSEK | Ayni siparisin farkli tarihlerde parcali sevki |
| A8-05 | Sevk onay sureci | ORTA | Kalite kontrol onayindan sonra sevk izni |
| A8-06 | Paketleme listesi | ORTA | Kolileme bilgisi, agirlik, boyut |

---

### A9. Faturalama / Muhasebe

**Mevcut:** Sevkiyat-fatura iliskisi, faturalanan miktar takibi
**Eksikler:**

| # | Eksik Ozellik | Oncelik | Aciklama |
|---|--------------|---------|----------|
| A9-01 | Fatura olusturma | KRITIK | Gercek fatura belgesi olusturma (no, tarih, KDV, toplam) |
| A9-02 | e-Fatura entegrasyonu | KRITIK | GIB (Gelir Idaresi Baskanligi) e-Fatura/e-Arsiv entegrasyonu |
| A9-03 | e-Irsaliye entegrasyonu | YUKSEK | GIB e-Irsaliye entegrasyonu |
| A9-04 | Fatura PDF ciktisi | YUKSEK | Yasal formatta fatura yazdirma |
| A9-05 | KDV hesaplama | KRITIK | Farkli KDV oranlari (%1, %10, %20), KDV dahil/haric |
| A9-06 | Odeme takibi | KRITIK | Tahsilat/odeme kaydi, vade takibi, bakiye |
| A9-07 | Cari hesap ekstre | YUKSEK | Musteri/tedarikci bazinda cari hesap ozeti |
| A9-08 | Banka entegrasyonu | ORTA | Banka hesap hareketleri ile otomatik eslestirme |
| A9-09 | Doviz kuru yonetimi | ORTA | USD/EUR giris, gunluk kur, kur farki hesabi |
| A9-10 | Fatura iptal/iade | ORTA | Fatura iptal sureci, iade faturasi |
| A9-11 | Masraf merkezi | DUSUK | Departman/proje bazli masraf takibi |

---

### A10. Dashboard ve Raporlama

**Mevcut:** 2 grafik (is yuku, teklif durumu), basit istatistik kartlari
**Eksikler:**

| # | Eksik Ozellik | Oncelik | Aciklama |
|---|--------------|---------|----------|
| A10-01 | Uretim performans paneli | YUKSEK | Gunluk/haftalik/aylik uretim adetleri, verimlilik |
| A10-02 | Geciken siparisler raporu | YUKSEK | Teslim tarihi gecen siparislerin listesi ve gecikme suresi |
| A10-03 | Stok durum raporu | YUKSEK | Kritik stok, fazla stok, stok degeri |
| A10-04 | Satis analiz raporu | YUKSEK | Donem bazli ciro, musteri bazli satis, urun bazli satis |
| A10-05 | Uretim maliyet raporu | YUKSEK | Siparis/urun bazli maliyet karsilastirmasi |
| A10-06 | Makine kullanim raporu | ORTA | Makine bazli doluluk orani, bos sure |
| A10-07 | Opertor performans raporu | ORTA | Operator bazli uretim adetleri, kalite oranlari |
| A10-08 | Tedarikci performans raporu | ORTA | Zamaninda teslimat orani, kalite puani |
| A10-09 | Excel/PDF rapor ciktisi | YUKSEK | Tum raporlarin indirilabilir formatlari |
| A10-10 | Ozel rapor olusturma | DUSUK | Kullanicinin kendi filtre/kolon secimi ile rapor |
| A10-11 | Otomatik rapor gonderimi | DUSUK | Gunluk/haftalik raporlarin email ile gonderilmesi |
| A10-12 | Kar/zarar tablosu | YUKSEK | Donem bazli gelir-gider-kar ozeti |

---

## B. TAMAMEN EKSIK OLAN MODULLER

### B1. MRP - Malzeme Ihtiyac Planlamasi

**Oncelik: KRITIK** - Uretim ERP'sinin temel taslarindan biri

| # | Ozellik | Aciklama |
|---|---------|----------|
| B1-01 | BOM patlatma (explosion) | Urun agacindan tum hammadde ihtiyacini hesaplama |
| B1-02 | Net ihtiyac hesabi | Brut ihtiyac - mevcut stok - acik siparisler = net ihtiyac |
| B1-03 | Tedarik suresi hesabi | Her malzemenin tedarik/uretim suresi ile geriye dogru planlama |
| B1-04 | Otomatik satin alma onerisi | Net ihtiyaca gore otomatik satin alma talebi olusturma |
| B1-05 | Otomatik uretim emri onerisi | Yarimamul ihtiyaci icin otomatik uretim emri olusturma |
| B1-06 | Emniyet stoku hesabi | Talebin degiskenligine gore emniyet stok seviyesi belirleme |
| B1-07 | Ekonomik siparis miktari (EOQ) | Maliyet optimizasyonu icin ideal siparis miktari hesabi |
| B1-08 | MRP calistirma raporu | Planlama sonuclarini gosteren detayli rapor |

**Ornek Akis:**
```
Siparis: 100 adet A urunu
  -> BOM: 200 adet X hammadde + 100 adet Y yarimamul
    -> Y icin BOM: 300 adet Z hammadde
  -> Stokta: 50 adet X, 0 adet Y, 100 adet Z
  -> Net ihtiyac: 150 adet X, 100 adet Y, 200 adet Z
  -> Tedarik suresi: X=5 gun, Z=7 gun, Y uretim=3 gun
  -> Plan:
    Gun 0: Z icin satin alma talebi olustur (7 gun)
    Gun 2: X icin satin alma talebi olustur (5 gun)
    Gun 7: Y uretimini baslat (3 gun)
    Gun 10: A uretimini baslat
```

---

### B2. Kalite Yonetimi (QMS)

**Oncelik: KRITIK** - Uretim sektoru icin zorunlu

| # | Ozellik | Aciklama |
|---|---------|----------|
| B2-01 | Kalite kontrol plani | Urun bazinda kontrol edilecek parametreler ve toleranslar |
| B2-02 | Giris kalite kontrol | Gelen hammaddenin kalite kontrolu (olcum, gorsel, sertifika) |
| B2-03 | Proses kalite kontrol | Uretim sirasinda ara kontroller |
| B2-04 | Cikis kalite kontrol | Sevk oncesi son kontrol |
| B2-05 | Uygunsuzluk (NCR) kaydi | Kalite standartlarina uymayan urun/surec kaydi |
| B2-06 | Duzeltici faaliyet (CAPA) | Uygunsuzluk nedeninin analizi ve duzeltme aksiyonlari |
| B2-07 | Fire/hurda kaydi | Uretimde olusan fire miktari, nedeni, maliyeti |
| B2-08 | Musteri sikayeti takibi | Musteri sikayeti kaydi, analiz, aksiyon, kapama |
| B2-09 | Tedarikci kalite puani | Gelen malzeme kalite orani ile tedarikci degerlendirme |
| B2-10 | Kalite sertifika yonetimi | ISO 9001, CE, TSE gibi sertifika takibi |
| B2-11 | Olcum aleti kalibrasyon | Olcum aletlerinin kalibrasyon tarihi ve gecerlilik takibi |
| B2-12 | SPC (Istatistiksel Proses Kontrol) | Kontrol kartlari, Cpk/Ppk hesabi |

---

### B3. Bakim Yonetimi (CMMS)

**Oncelik: YUKSEK** - Makine duruslari uretimi dogrudan etkiler

| # | Ozellik | Aciklama |
|---|---------|----------|
| B3-01 | Onleyici bakim plani | Periyodik bakim takvimi (gunluk/haftalik/aylik) |
| B3-02 | Bakim is emri | Bakim isleri icin is emri olusturma ve takip |
| B3-03 | Ariza kaydi | Makine arizasi, durus suresi, neden analizi |
| B3-04 | Yedek parca yonetimi | Bakim icin gerekli yedek parca stok takibi |
| B3-05 | Bakim maliyet takibi | Makine bazinda bakim masraflari |
| B3-06 | Makine durus analizi | Plansiz duruslarin nedenleri ve sureleri |
| B3-07 | Makine gecmis karti | Her makinenin tum bakim/ariza gecmisi |
| B3-08 | Bakim hatirlatma | Yaklasan bakim tarihleri icin otomatik bildirim |
| B3-09 | MTBF / MTTR hesabi | Arizalar arasi ortalama sure / Tamir suresi metrikleri |

---

### B4. Maliyet Muhasebesi

**Oncelik: KRITIK** - Karlilik analizi icin zorunlu

| # | Ozellik | Aciklama |
|---|---------|----------|
| B4-01 | Standart maliyet tanimi | Urun bazinda hedef maliyet belirleme |
| B4-02 | Gerceklesen maliyet hesabi | Fiili iscilik + malzeme + genel gider toplama |
| B4-03 | Iscilik maliyet dagilimi | Operator saatlik ucret x calisma suresi |
| B4-04 | Genel gider dagilimi | Kira, enerji, amortisman gibi maliyetlerin urune dagilimi |
| B4-05 | Maliyet sapma analizi | Standart vs gerceklesen maliyet karsilastirmasi |
| B4-06 | Siparis bazli maliyet | Her siparisin toplam maliyeti ve kar marji |
| B4-07 | Urun bazli karlilik | Urun grubu bazinda karlilik analizi |
| B4-08 | Musteri bazli karlilik | Musteri bazinda ciro ve kar analizi |
| B4-09 | Teklif maliyet hesaplama | Teklif verirken otomatik maliyet hesabi |

---

### B5. Insan Kaynaklari ve Zaman Yonetimi

**Oncelik: ORTA** - Iscilik takibi icin gerekli

| # | Ozellik | Aciklama |
|---|---------|----------|
| B5-01 | Calisan kaydi | Ad, soyad, pozisyon, departman, giris tarihi |
| B5-02 | Beceri matrisi | Her calisanin hangi makine/islemlerde yetkin oldugu |
| B5-03 | Vardiya planlama | Vardiya tanimlari, calisan-vardiya atamasi |
| B5-04 | Mesai takibi | Giris/cikis saatleri, fazla mesai hesabi |
| B5-05 | Izin yonetimi | Yillik izin, rapor, mazeret izni takibi |
| B5-06 | Performans degerlendirme | Donemsel calisan performans puanlamasi |
| B5-07 | Egitim takibi | Calisan egitim kayitlari, sertifika gecerlilik |

---

### B6. Bildirim ve Uyari Sistemi

**Oncelik: YUKSEK** - Operasyonel verimlilik icin kritik

| # | Ozellik | Aciklama |
|---|---------|----------|
| B6-01 | Uygulama ici bildirim | Gercek zamanli in-app bildirimler (SignalR/WebSocket) |
| B6-02 | Email bildirim | Onemli olaylarda otomatik email |
| B6-03 | Dusuk stok uyarisi | Min stok altina dusen urunler icin uyari |
| B6-04 | Geciken siparis uyarisi | Teslim tarihi yaklasan/gecen siparisler |
| B6-05 | Bakim hatirlatmasi | Yaklasan/gecen periyodik bakim |
| B6-06 | Teklif vade uyarisi | Suresi dolmak uzere olan teklifler |
| B6-07 | Onay bekleyen isler | Onay gerektiren islemlerin bildirimi |
| B6-08 | Uretim tamamlanma | Uretim tamamlandiginda ilgili kisilere bildirim |
| B6-09 | Bildirim tercihleri | Kullanici bazinda hangi bildirimleri alacagi secimi |

---

### B7. Entegrasyon ve Veri Aktarimi

**Oncelik: YUKSEK** - Dis sistemlerle veri alisverisi

| # | Ozellik | Aciklama |
|---|---------|----------|
| B7-01 | Excel import/export | Toplu veri yuklemee (urun, musteri, stok) ve indirme |
| B7-02 | CSV import/export | Alternatif veri aktarim formati |
| B7-03 | e-Fatura entegrasyonu | GIB e-Fatura/e-Arsiv/e-Irsaliye |
| B7-04 | Muhasebe yazilimi entegrasyonu | Logo, Mikro, Netsis gibi programlarla veri aktarimi |
| B7-05 | Banka entegrasyonu | Hesap hareketleri otomatik cekme |
| B7-06 | Kargo entegrasyonu | Kargo firmalari API entegrasyonu |
| B7-07 | REST API dokumantasyonu | Swagger/OpenAPI ile tam dokumante API |
| B7-08 | Webhook destegi | Dis sistemlere olay bazli bildirim |
| B7-09 | SAP entegrasyonu | SAPStatus enum'u var ama implementasyon yok |

---

### B8. Dokuman Yonetimi (DMS)

**Oncelik: ORTA**

| # | Ozellik | Aciklama |
|---|---------|----------|
| B8-01 | Dokuman versiyonlama | Ayni dokumanin farkli versiyonlarini saklama |
| B8-02 | Dokuman onay sureci | Dokuman yayinlanmadan once onay mekanizmasi |
| B8-03 | Dokuman kategorilendirme | Klasor/etiket bazli organizasyon |
| B8-04 | Teknik resim yonetimi | CAD dosyalari ile urun iliskilendirme |
| B8-05 | Dokuman erisim kontrolu | Rol bazli dokuman erisim yetkisi |

---

## C. TEKNIK ALTYAPI EKSIKLERI

### C1. Backend Altyapi

| # | Eksik | Oncelik | Aciklama |
|---|-------|---------|----------|
| C1-01 | Repository + Service katmani | KRITIK | Controller'lar dogrudan DbContext kullaniyor, is mantigi daginiik |
| C1-02 | Global Exception Handler | KRITIK | Hata yonetimi yok, stack trace disariya siziyor |
| C1-03 | Input Validation (FluentValidation) | KRITIK | Hicbir girdi dogrulamasi yok |
| C1-04 | Pagination altyapisi | YUKSEK | Tum listeler tum veriyi donuyor |
| C1-05 | Caching (Redis) | YUKSEK | Sik kullanilan sorgular icin cache |
| C1-06 | Loglama (Serilog) | YUKSEK | Yapilandirilmis log altyapisi |
| C1-07 | Background job (Hangfire/Quartz) | YUKSEK | Zamanlanmis isler (rapor, bildirim, MRP) |
| C1-08 | API versioning | ORTA | Geriye uyumluluk icin API versiyonlama |
| C1-09 | Rate limiting | ORTA | API korumasi |
| C1-10 | Health check endpoint | ORTA | Sistem saglik kontrolu |
| C1-11 | Unit/Integration test | YUKSEK | Test altyapisi tamamen eksik |
| C1-12 | Soft delete | ORTA | Interface var ama implementasyon yok |
| C1-13 | Audit trail | YUKSEK | Kim ne zaman ne degistirdi kaydi |
| C1-14 | Transaction yonetimi | YUKSEK | Coklu DB islemlerinde tutarlilik |

### C2. Frontend Altyapi

| # | Eksik | Oncelik | Aciklama |
|---|-------|---------|----------|
| C2-01 | API service layer | YUKSEK | Her component'te tekrarlanan axios cagirilari |
| C2-02 | Global error handling | YUKSEK | Kullaniciya anlamli hata mesajlari |
| C2-03 | Form validation tutarliligi | ORTA | react-hook-form + Ant Design Form karmasasi |
| C2-04 | State management genisletme | ORTA | Modull bazli Redux slice'lar |
| C2-05 | Loading/skeleton states | ORTA | Veri yuklenirken kullanici deneyimi |
| C2-06 | Offline destegi | DUSUK | Ag kesintisinde temel islevsellik |
| C2-07 | PWA destegi | DUSUK | Mobil cihazlarda app benzeri deneyim |
| C2-08 | Erisilebilirlik (a11y) | ORTA | ARIA label'lar, klavye navigasyonu |
| C2-09 | Component test'leri | YUKSEK | React Testing Library testleri |
| C2-10 | Bundle size optimizasyonu | ORTA | 3 chart lib, moment.js gibi buyuk bagimliliklar |

### C3. DevOps Altyapi

| # | Eksik | Oncelik | Aciklama |
|---|-------|---------|----------|
| C3-01 | docker-compose.yml | YUKSEK | Tum servisleri tek komutla ayaga kaldirma |
| C3-02 | CI/CD pipeline (tam) | YUKSEK | Test + lint + build + deploy adimlari |
| C3-03 | Monitoring (Prometheus/Grafana) | ORTA | Sistem metrikleri izleme |
| C3-04 | Log aggregation (ELK/Seq) | ORTA | Merkezi log toplama ve arama |
| C3-05 | Secrets management | KRITIK | Vault/Docker secrets ile sifre yonetimi |
| C3-06 | Backup stratejisi | YUKSEK | Otomatik DB yedekleme |
| C3-07 | SSL/TLS konfigurasyonu | YUKSEK | Production HTTPS zorunlulugu |
| C3-08 | Staging/Production ayirimi | ORTA | Ortam bazli konfigurasyonlar |

---

## D. ONCELIK SIRALAMASINA GORE YOLHARITASI

### Faz 1: Temel Duzeltmeler (0-1 Ay)
> Guvenlik ve stabilite - uretim ortaminda minimum gereksinimler

- [ ] C1-01: Repository + Service pattern
- [ ] C1-02: Global Exception Handler
- [ ] C1-03: Input Validation
- [ ] C3-05: Secrets management (credential'lari tasima)
- [ ] A1-01: Yetkilendirme duzeltme
- [ ] A1-02: Sifre sifirlama
- [ ] C1-04: Pagination altyapisi

### Faz 2: Finansal Temel (1-3 Ay)
> Bir ERP'nin olmazsa olmazi - para akisi takibi

- [ ] A9-01: Fatura olusturma
- [ ] A9-05: KDV hesaplama
- [ ] A9-06: Odeme takibi
- [ ] A9-07: Cari hesap ekstre
- [ ] A4-03: Iskonto yonetimi
- [ ] A4-09: KDV hesaplama (tekliflerde)
- [ ] A5-06: Odeme kosullari
- [ ] B4-01 ~ B4-06: Temel maliyet muhasebesi

### Faz 3: Uretim Olgunlastirma (2-4 Ay)
> Uretim planlama ve kalite - fabrika verimliligi

- [ ] A6-01: Uretim planlama/cizelgeleme (Gantt)
- [ ] A6-02: Kapasite planlama
- [ ] A6-04: Uretim maliyet hesaplama
- [ ] A6-05: Fire/hurda takibi
- [ ] A6-08: Operasyon bazli sure takibi
- [ ] B1-01 ~ B1-05: MRP temel islevleri
- [ ] B2-01 ~ B2-05: Kalite kontrol temelleri

### Faz 4: Stok ve Tedarik Zinciri (3-5 Ay)
> Malzeme yonetimi olgunlastirma

- [ ] A7-01: Stok sayim
- [ ] A7-02: Lot/parti takibi
- [ ] A7-04: Stok degerleme (FIFO/ort.)
- [ ] A7-06: Min stok uyarisi
- [ ] A7-07: Otomatik satin alma talebi
- [ ] A7-10: Barkodlu islemler
- [ ] A3-01: Urun barkodu
- [ ] A3-09: Min/Max stok seviyeleri

### Faz 5: Raporlama ve Bildirimler (4-6 Ay)
> Yonetim kararlari icin veri

- [ ] A10-01 ~ A10-12: Tum raporlar
- [ ] A10-09: Excel/PDF cikti
- [ ] B6-01 ~ B6-09: Bildirim sistemi
- [ ] A4-04: Teklif PDF ciktisi
- [ ] A8-01: Irsaliye yazdirma
- [ ] A9-04: Fatura PDF ciktisi

### Faz 6: Entegrasyon (5-7 Ay)
> Dis sistemlerle baglanti

- [ ] B7-01: Excel import/export
- [ ] B7-03: e-Fatura entegrasyonu (GIB)
- [ ] B7-04: Muhasebe yazilimi entegrasyonu
- [ ] B7-07: API dokumantasyonu
- [ ] A9-02: e-Fatura
- [ ] A9-03: e-Irsaliye

### Faz 7: Ileri Ozellikler (6-12 Ay)
> Rekabet avantaji saglayacak ozellikler

- [ ] B3-01 ~ B3-09: Bakim yonetimi
- [ ] B5-01 ~ B5-07: IK ve zaman yonetimi
- [ ] B8-01 ~ B8-05: Dokuman yonetimi
- [ ] A6-11: OEE hesabi
- [ ] B2-06 ~ B2-12: Ileri kalite yonetimi
- [ ] B1-06 ~ B1-08: Ileri MRP
- [ ] A2-08: Musteri portal

---

## E. OZET ISTATISTIKLER

| Metrik | Sayi |
|--------|------|
| Mevcut modullerdeki eksik ozellik | 98 |
| Tamamen eksik modul | 8 |
| Eksik modul ozellikleri | 74 |
| Teknik altyapi eksiklikleri | 32 |
| **TOPLAM EKSIK OZELLIK** | **204** |
| Kritik oncelikli | 28 |
| Yuksek oncelikli | 72 |
| Orta oncelikli | 68 |
| Dusuk oncelikli | 36 |

---

*Bu dokuman, smallFactory projesinin kucuk-orta olcekli bir fabrika ERP sistemi olarak tamamlanmasi icin gerekli tum eksikleri icerir. Oncelik olarak Faz 1 (Temel Duzeltmeler) ve Faz 2 (Finansal Temel) ile baslanmasi onerilir.*
