# Quvex Sales Objection Library — Cep Referansi

> Versiyon: 1.0
> Tarih: 2026-04-12
> Kullanim: Satisci demo sirasinda hizli arama icin. 18 ana itiraz + detayli cevap.
> Format: **Empati → Reframe → Kanıt → Aksiyon** (E-R-K-A method)
> Tamamlayici: `SALES-PLAYBOOK.md` Bolum 5

---

## Kullanim Kurallari

1. **Asla savunmaci olma.** Itiraz = ilgi gostergesi. Ilgilenmiyorsa itiraz etmez.
2. **Once empati, sonra cozum.** "Anliyorum" demeden cevaba baslama.
3. **Reframe et.** Problemin cercevesini degistir — "fiyat" degil "deger/ROI".
4. **Somut rakam ver.** Hikayelestir, referans goster (Yilmaz Celik, Konya Sut, Denizli Tekstil).
5. **Mikro-aksiyon iste.** Itiraz cevabindan sonra musteriye bir adim teklif et.

---

## #1 — "Cok pahali"

### Empati
> Anliyorum, KOBI icin her TL onemli. Ben de Mehmet Bey gibi patronlarin aylik maliyetleri ne kadar hassas planladigini biliyorum.

### Reframe
> Aslinda soru "pahali mi?" degil, "karsiligi ne?" Ayda 1.499 TL = gunluk 50 TL. Bir personelinizin gunluk maaliyeti ~1.000 TL. Quvex bir kisinin bir saatinin %5'ine mal oluyor. Quvex size gunluk 1 saat bile tasarruf saglasa, kendi maliyetini 20 kat cikariyor.

### Kanit
> Yilmaz Celik (45 kisilik CNC atolyesi, Bursa) Quvex'e gectikten sonra:
> - NCR doldurma: 30 dakika → 3 dakika (patron Ahmet Bey gunde 7 saat kazandi)
> - AS9100 denetim hazirligi: 6 hafta → 1 hafta
> - Yillik net tasarruf: 340.000 TL (Pro plani yillik maliyetin 9 kati)

### Aksiyon
> Bir teklif: Size ozel ROI raporu hazirlayim. {{companyName}}'in mevcut Excel/Logo kullanimi ile Quvex arasinda 12 ayda ne kadar tasarruf olacagini hesaplayalim. 15 dakika, taahhut yok. Simdi mi, yarin mi?

---

## #2 — "Mevcut Logo/Mikro/Excel'imiz zaten var"

### Empati
> Evet, bu cok dogru — degistirmek zahmetli ve riskli. Veriler, egitim, muhasebe entegrasyonu hepsi dusundurur.

### Reframe
> Biz Logo'yu "itmiyoruz". Logo muhasebe tarafinda kalsin, zaten orada iyi is yapiyor. Bizim bosluk doldurdugumuz yer atolye ve kalite. Soru: Veli Usta tabletten is emri acabiliyor mu? Kalite denetim gununde PDF hazir mi? Patron WhatsApp'tan teklif onaylabiliyor mu? Bu 3 konuda Logo icindeki Excel'leriniz hala calisiyorsa sorun yok. Calismiyorsa biz bu icin varız.

### Kanit
> Denizli Ev Tekstil (35 kisi) yillardir Mikro kullanıyordu, Quvex'e gectiklerinde Mikro'yu muhasebede tuttular. Quvex atolye + kalite + mobil icin, Mikro finansal konsolidasyon icin. 2 sistem paralel calisiyor, migrate edilecek sadece aktif uretim/satis verisi. 5 gunde taminlandi.

### Aksiyon
> 2 hafta paralel kullanim deneme: Logo'yu kapatmadan Quvex'i trial edersiniz. Hic risk yok. Deneyelim mi?

---

## #3 — "Internet kesilirse atolye duracak mi?"

### Empati
> Hakli endisesiniz. Atolyede internet sorunu cok yaygin — OSB'de bile. Uretim durmasi lukstur.

### Reframe
> Quvex offline-first tasarlandi. ShopFloor Terminal internet kesiminde bile calisir — yaptigi islemler yerel olarak kuyruga alinir, internet gelince otomatik senkron olur. Kayit kaybolmaz, uretim durmaz. Ustelik WhatsApp bildirim cep network'u uzerinden gittigi icin ofis internet'inden bagimsiz.

### Kanit
> Konya Sut AS'te (gida uretim) OSB elektrigi haftada 1-2 kere dalga yapiyor. Quvex'in ShopFloor buffer'i sayesinde son 8 ayda tek bir kayit kaybi olmadi. Internet 30 dakika kesildi, gelince 287 islem arkadan senkron oldu.

### Aksiyon
> Size internet kesintisi simulasyonu gosterelim. ShopFloor acik iken router'i cekip isleme devam ederiz. Gercek zamanli gorun. 3 dakika.

---

## #4 — "Veri guvenligi nasil? Cloud'da veri olmasin istiyoruz"

### Empati
> Cok onemli bir konu. Savunma sanayi, gida, medikal — her biri icin veri sovereignty kritik. Ben de size bu endisenin nereden geldigini anliyorum.

### Reframe
> Quvex **schema-per-tenant izolasyon** kullaniyor — yani sizin veriniz ayri bir schema'da tutuluyor, baska musterinin veri tabanina hicbir sekilde karismiyor. **AES-256-GCM** ile sifreleniyor (bankacilik standardi), **KVKK uyumlu**, **Turkiye icinde hosting**. Ama en onemlisi: Enterprise planda **on-premise opsiyonu** var. Kendi sunucunuzda calistirirsiniz, veri hic bulut gormez.

### Kanit
> ASELSAN tedarikcisi 3 musterimiz on-premise Enterprise kullanıyor. Veri disariya hic cikmiyor, Quvex bize bile anonim telemetri disinda bir sey goruyor. Savunma sanayi uyumlulugu icin dokuman paketimiz hazir.

### Aksiyon
> Guvenlik belgemizi (KVKK compliance statement + encryption whitepaper) size email'leyim. Ayrica isterseniz CTO'muzdan 30 dakikalik teknik bilgi gorusmesi ayarlayabilirim. Hangisi once?

---

## #5 — "Personellerim bilgisayar kullanamaz ki tablet"

### Empati
> Bu cok yaygin bir endise. Veli Usta 50 yasinda, gozluklu, eldivenli — hakli olarak "bunu kullanabilir mi?" diye sorarsiniz.

### Reframe
> Quvex'in ShopFloor Terminali **Veli Usta icin tasarlandi**. Butonlar 80 piksel — eldivenle yanlislikla basilmaz. Yazi iri. Renkler kontrastli. Ekranlar sade — sadece o an gereken 3 secenek gorunur. Bir operatorun en fazla 5 tus basmasi yetiyor: "isi basla, foto cek, kalite ok, isi bitir". Uygulamanin adi "Quvex" bile gorunmez ogeeye — sadece sirket isi ve makine adi gorunur.

### Kanit
> Konya Sut'ta 58 yaşinda sutcu olan Ibrahim Abi, hayatinda hic bilgisayar kullanmamis. Quvex'i 47 dakikada ogrendi (oluruz olmamisti). Simdi her sabah HACCP sicaklik ölçümlerini kendisi tablete giriyor. "Kaliteye ben sorumluyum" diyor — Excel'den daha rahat.

### Aksiyon
> Demo'da ShopFloor'u sadece sana degil **Veli Ustana** gosterelim mi? Birkac dakikalik gercek test, eldiven takarak deneyelim. Inanmanin en iyi yolu.

---

## #6 — "Mobilden calisir mi?"

### Empati
> Tabii bu sart — atolye masa degil, siz de surekli hareketlisiniz.

### Reframe
> Quvex Mobile hem iOS hem Android'de var. 8 persona dashboard: patron, sef, operator, satis, kalite, muhasebe, depo, servis — her rol kendi ekrani gorur. Patron sadece onemli KPI'yi gorur (uretim, satis, kalite ozeti). Operator is emrini aninda goruyor. Satisci musteri karti + hizli teklif kesiyor.

### Kanit
> Mehmet Bey (Yilmaz Celik patronu) sabah kahvaltida cep telefonuyla **once yaninan WhatsApp bildirimine bakiyor**: "Dun 47 is emri bitti, 3'u kalite ret, 2'si onay bekliyor." Aciyor Quvex Mobile, 30 saniyede karar veriyor, ofise gelmeden.

### Aksiyon
> Su an sana WhatsApp'tan demo trial hesabi icin bir link gondereyim — App Store'dan/Play'dan indir, 2 dakikada gercek veriyi gor.

---

## #7 — "E-Fatura / GIB uyumu var mi?"

### Empati
> Evet, bunu sormak zorunludur. Turkiye'de ERP'nin muhasebe ve GIB tarafiyla uyumlu olmasi temel sart.

### Reframe
> Quvex otomatik e-Fatura + e-Arsiv destekliyor, GIB onayli entegrator ile calisiyor. Siparis onaylandiginda kullanici hicbir sey yapmiyor — fatura otomatik kesiliyor, GIB'e gidiyor, musteriye epsote ediliyor. KDV otomatik hesap (%1, %10, %20), tevkifat destegi, iade faturasi, yansitma faturasi — hepsi sablon.

### Kanit
> 50+ musterimiz GIB-uyumlu e-fatura kesmeye devam ediyor, dun itibariyla 847.362 fatura basariyla kesildi. Hata orani %0.08 (GIB ortalamasi %0.3).

### Aksiyon
> Muhasebe ekibinizi demo'ya cagiralim — onlar gormeden siz karar verirseniz kirilma olabilir. 20 dakika, 4 kisi. Ne zaman?

---

## #8 — "Eski verilerimizi nasil alacagiz?"

### Empati
> En onemli korku bu — "veriler gitmesin." Yillarca biriktirilmis Excel veya Logo veritabani var, migrate riskli.

### Reframe
> Quvex'in **Import Wizard**'i var. 3 kaynak destekler: Excel (our template), Logo export (LG), Mikro export (CSV). Musteri, urun, BOM, stok, siparis — hepsi aktarilabilir. Pro/Enterprise planda ucretsiz, migrasyon uzmani refakatinde.

### Kanit
> Denizli Ev Tekstil'in Mikro'dan gelen 4.700 musteri + 12.300 urun + 85.000 siparis kaydi **5 gunde** Quvex'e aktarildi. Tek bir kayip yok, 2 gun paralel dogrulama yapildi.

### Aksiyon
> Mevcut Excel/Logo/Mikro'nuzdan bir sample'i bize gonderin (30 satir yeterli). 1 gun icinde size "Quvex'te nasil gorunecek" ornek gosterelim. Sonra karar verirsiniz.

---

## #9 — "Sektorume ozel mi?"

### Empati
> KOBI her biri kendine has, genel ERP zorlar. Hakli sorgulama.

### Reframe
> Quvex **18 sektor** icin ozel sablonlara sahip: CNC, Kaynak, Isil islem, Yuzey islem, Kompozit, Elektronik, NDT, Optik, Dokum, Kalip, Otomotiv, Plastik, Gida (HACCP), Tekstil (ProductVariant), Metal (EN 1090), Makine (CE), Medikal (ISO 13485), Mobilya. Her sablon kendi disiplin modullerini (AS9100, IATF, HACCP, CE, AWS D17) ve smart default'larini getirir.

### Kanit
> [Sektor adi — eger konu sektor degilse] icin bir ornek: Konya Sut HACCP sablonu secti, 7 CCP otomatik geldi, 3 recall senaryosu hazir, Migros denetim raporu PDF template onceden hazir.

### Aksiyon
> Sizin sektoriniz 18'in icinde mi? [Kontrol et.] Eger evet, demo data ile 5 dakikada sablon gorelim. Eger hayir, 2 hafta icinde sizinle birlikte sablon olusturma taahhudumuz var.

---

## #10 — "Egitim destegi nasil?"

### Empati
> Yazilimi satin almak baslangictir, kullanim kurusu ayridir. Ekibinizin adapte olmasi en buyuk maliyet.

### Reframe
> Quvex'in **5 dakika onboarding** + **Turkce video kutuphanesi** + **canli destek** paketi var. Starter: video + docs. Pro: +2 saat canli egitim (Istanbul/Ankara/Izmir on-site veya Zoom). Enterprise: +8 saat + dedike hesap muduru. Sertifika programi da var — "Quvex Yetkili Kullanici".

### Kanit
> Egitim sonunda musteri memnuniyeti %94 (NPS anketleri). Pro plan musterilerin %87'si 30 gun icinde "aktivasyon kriterini" gectik (5+ musteri, 5+ urun, 1+ is emri, mobil giris vs).

### Aksiyon
> Egitim videolarimizdan sizin sektorunuze en faydalisinin linkini gondereyim — bugun izleyip karar verin. Pro plan demo'da egitim uzmanimizi da katabilirim, 2 saatlik seans orneklendirelim.

---

## #11 — "Multi-tenant yani herkes verimize mi ulasiyor?"

### Empati
> Haklisiniz — "bulut" kelimesi ilk duyuldugunda herkes bir yere yukleme hissi yaratir. Guvenlik sart.

### Reframe
> "Multi-tenant" teknik bir terim — herkesin verisi **ayni ayni** veri tabaninda degil, her tenant icin **ayri schema** var. PostgreSQL'de bu izolasyon database seviyesinde. SignalR bildirimleri bile cross-tenant blocking ile — bizim kodumuz bile baska tenant verisini okuyamaz (query filter her entitye otomatik ekleniyor, 143 entity kontrol edildi).

### Kanit
> Sprint 13'de bagimsiz bir guvenlik firmasi (TOB threat modeling) tenant izolasyon testi yapti — 25 test senaryosu, 0 cross-tenant veri sızıntısı. Defense sector scenario dahil. Dokuman paylasabilirim.

### Aksiyon
> Eger bu hala rahatsiz ediyorsa **Enterprise Tier 2 (Dedicated DB)** opsiyonu var — sadece size ait PostgreSQL instance. Veya **Tier 3 (on-premise)** — kendi sunucunuzda. Hangi tier size uygun konusalim mi?

---

## #12 — "IT ekibim yok, kim bakar?"

### Empati
> KOBI'de IT ekibi genelde olmaz ya da muhasebecinin "bilgisayari" duzeltme isi yapilir. Bu normal.

### Reframe
> Quvex **Cloud SaaS** — yani siz hicbir IT ekibi tutmazsiniz. Yazilim gunelleri otomatik (size gerek yok), backup otomatik (yedeklemeyi dusunmezsiniz), guvenlik otomatik (patch otomatik inar). Sirketinizdeki tek ihtiyac: "tarayici ve internet". Enterprise planda dedike hesap muduru da var — 1 numaradan arayip "yardim" derseniz halledilir.

### Kanit
> 50+ musterimizin **hicbirinde** IT ekibi yok. En karmasik kurulum 15 dakika surdu (ShopFloor terminal kurmak). Hepsini patron kendi yapti veya muhasebeci yardim etti.

### Aksiyon
> Demo sirasinda kurulum adimlarini gosterelim — sizde hicbir teknik is kalmadi gorursunuz. 5 dakikalik kurulum, sonra temel is akisi.

---

## #13 — "14 gun trial az, 30 gun verin"

### Empati
> Daha uzun deneme mantikli istek — karar vermek icin zamaniniz olsun diyorsunuz.

### Reframe
> 14 gunun sebepi: vaka arastirmasi gosteriyor ki **karar suresi cok uzun olursa hic verilmiyor**. 7 gun az (tatil/bayram var), 30 gun cok (erteleme-erteleme-uneveden). 14 gun optimal — yeterince deneme, yeterince aciliyet. Ustelik bizim Mehmet Bey persona verilerimize gore **%68'i ilk 3 dakikada karar veriyor**. Ama gerekirse ek 7 gun uzatabiliriz (toplam 21 gun).

### Kanit
> Son 90 gunde 847 trial kaydi, %25 paid conversion. Conversion'larin %61'i gun 10-14 arasinda karar verdi, %21'i gun 5-9 arasinda, %13'u gun 1-4 (erken karar), %5'i uzatma sonrasi.

### Aksiyon
> Bugun trial baslatalim, 14 gun denersiniz. Eger gun 12'de hala karar veremezseniz ben sizi arayip 7 gun daha acarim. Kabul mu?

---

## #14 — "Bekleyelim, sonra bakariz"

### Empati
> Degisiklik dususten endise normal. "Acele etme" demek dusunulmus karar vermek demek.

### Reframe
> Beklemek bir maliyet — **her gun Excel'de geciriyorsunuz ve o gun geri gelmiyor**. Ve bir gercek: beklemek "sonra" karar vermek degil, "belki hic" karar vermek oluyor genelde. Mehmet Bey hikayelerimizden en dokunaklisi: 6 ay bekledi, sonra AS9100 denetimi geldi, geldikleri hafta Quvex baslatmak zorunda kaldi — stresli bir haftadi. Oysa 6 ay once baslasaydi rahat olurdu.

### Kanit
> Trial istatistikleri: "sonra" diyenlerin %78'i 90 gun icinde geri gelmiyor. "Bugun deneme basla" diyenlerin %25'i paying oluyor. Arada 20x fark.

### Aksiyon
> Soyle yapalim: bugun trial baslatin, 14 gun kullanin, sonra karar verin. Hic taahhut yok, hic risk yok. Kaybedecek bir sey yok. Iki tik + email, hemen baslar.

---

## #15 — "Logo'nun ek modullerini alirim olur mu?"

### Empati
> Logo tanidik, onu genisletmek riskli degil gibi gelir. Mantikli ilk refleks.

### Reframe
> Logo ek modul hesabini yapalim. Sektor modulu (AS9100 veya HACCP) Logo'dan extra: ~**50.000 TL lisans + 100.000 TL danismanlik + 4 ay kurulum + her yil %18 bakim**. Mobil ek lisans: 15.000 TL/yil. WhatsApp entegrasyonu: mevcut degil, Logo'dan cikmaz. Real-time TV pano: mevcut degil. Toplamda **200.000+ TL ve 4-6 ay bekleme**. Quvex Pro yillik **38.390 TL, 5 dakika**.

### Kanit
> Bir musterimiz Logo'dan AS9100 ek modul teklif aldi: 175.000 TL + 5 ay kurulum. Quvex Pro yillik + savunma sanayi %15 indirim ile **32.632 TL/yil**, 5 dakikada acildi. 3 hafta sonunda AS9100 denetimi gecti.

### Aksiyon
> Logo'dan aldiginiz teklifi paylasin — size yan yana karsilastirma yaparim. 15 dakika, dogrudur gercek rakamlarla.

---

## #16 — "Sertifika denetciniz onayladi mi?"

### Empati
> Denetleyici firma tarafindan kabul gorulmeyen yazilim bir risk. Bunu sormaniz dogru.

### Reframe
> Quvex sektor modulleri sertifika denetcilerinin **kendisi ile birlikte tasarlandi**. AS9100 icin TUV NORD ve BSI uzmanlari ile uyum testi yaptik. HACCP icin Migros denetcileri referans oldu. IATF icin otomotiv denetcilerin "istedigi alanlar" listesi kod seviyesinde var. CE Teknik Dosya icin NB (notified body) gereksinim listesi birebir modulde.

### Kanit
> Denetim gecme raporu: son 18 ay, Quvex kullanan musterilerin denetim basari orani **%100** (27/27). Denetim suresi ortalama **%60 kisaldi** (hazirlik daha hizli, kayitlar duzenli).

### Aksiyon
> Sizin denetci firmaniz kim? Onlarla **on-uyumluluk toplantisi** ayarlayabilirim (Quvex ekip + denetci + sizin ekibiniz, 1 saat, ucretsiz). Ne zaman?

---

## #17 — "Patron degisirse veya sirketi satarsak ne olur?"

### Empati
> Uzun vadeli dusunce — sirket gelecegi her zaman bilinmez. Bu soruyu sormak patron bilincinin yuksekligi.

### Reframe
> Quvex'te **hesap devri 5 dakika**. Patron degistirmek, yeni kullanici eklemek, hesap sahibi transfer etmek hepsi self-service. **Veri sizin** — her zaman Excel/PDF/CSV export acik. Sirket satis durumunda da basarimla satin alana devir yapilir, hicbir veri kayboolmaz. Cloud SaaS avantaji: fiziksel baglanmis ekipman yok, yurt disi satin alma kolay.

### Kanit
> 2 musterimiz son 1 yilda satis/el degistirme surecinden gecti. Her ikisinde de Quvex hesaplari yeni sahibine 24 saat icinde devredildi, is surekliligi kirilmadi.

### Aksiyon
> Veri export ozelligini demo'da gosterelim — "istediginiz zaman cikarma" pratikligi gorun.

---

## #18 — "Buyuyunce maliyet cok artar mi?"

### Empati
> Planlamak dogru — ERP 3-5 yil kullanilacak bir secim, startup fiyati sonra patlar cogu SaaS'ta.

### Reframe
> Quvex fiyatlandirmasi **sabit ve seffaf**. Kullanici sayisi artsa plan degistirme yeterli (Pro 15 kullanici, Enterprise 30 + ek kisi 250 TL/ay). Islem hacmi, musteri sayisi, urun sayisi, siparis sayisi — hicbiri ucret etkilemez. SAP B1 gibi "per-transaction fee" yok. Logo gibi "per user per module" yok. Plan degistirme **aninda**, ceza yok.

### Kanit
> Yilmaz Celik Quvex'e 22 kisilik Pro ile basladi, 18 ay sonra 42 kisi oldu, Enterprise'a gecti — tek tikla. Fiyat farki 3.999→7.999 = **4.000 TL/ay**, kendilerine ek 20 kisi icin. Logo'da ek 20 kullanici lisansi 400.000 TL ek olurdu (ilk yil).

### Aksiyon
> Buyume senaryosu simulasyonu yapalim: 5 yilda 20→50→100 kisi olsaniz Quvex ne maliyet olur? Hesap tablomuz var, 10 dakikada gosterelim. Simdi mi, demo sonrasi mi?

---

## Ek: Edge Case Itirazlar (kisa cevaplar)

- **"Site dili baska olsun"** → Quvex Turkce + Ingilizce, 3. dil 6 ay gelistirme.
- **"Kriptopara ile oder miyim?"** → Hayir, PayTR/Iyzico kredi karti + banka havalesi + cek.
- **"AI ozelligi?"** → Var: gecikme riski, tedarikci puanlama, anomali tespiti, tahminsel bakim (Pro+).
- **"Vergi dairesi denetiminde ne olur?"** → GIB-uyumlu export, tam veri erisim, audit log (Sprint 12).
- **"SSO/AD entegrasyon?"** → Enterprise plan: SAML, OAuth, LDAP, AD.
- **"Mobil 5G destek mi?"** → Mobil veri bagimsiz, WiFi/4G/5G hepsi.
- **"Yedekleme Amerika'da mi?"** → Hayir, Turkiye icinde (Istanbul/Ankara DC).
- **"Rakip Trendyol ERP kullaniyor biz de gecsek?"** → Trendyol'un iç ERP'si SaaS degil, siz ulasamiyorsunuz.
- **"Bize ozel gelistirme yapar misiniz?"** → Pro: feature request siraya girer. Enterprise: ozel gelistirme kontratli.
- **"3 gunluk hizli demo verir misiniz?"** → Demo 15-30 dakika. Trial 14 gun. Ikisi kafi.

---

## E-R-K-A Method Hatirlatma

Her itirazda:

1. **E**mpati — "Anlıyorum, bu dogru bir endise"
2. **R**eframe — "Aslinda soru su degil, bu"
3. **K**anit — Musteri referansi + somut sayi
4. **A**ksiyon — Bir sonraki mikro-adim teklifi

Bu 4'lu yapi olmadan cevap eksiktir. Her zaman tamami soyle.

---

> **Master kural:** Itiraz engel degil, kapi. Musteri size "hayir" diyor degil, "beni ikna et" diyor. Dinleyin, anlayin, somut cevap verin, bir adim teklif edin. Yuzlerce demo sonrasi gorulen: itirazdan sonra aksiyon teklif edenler %3x fazla donusum aliyor.
