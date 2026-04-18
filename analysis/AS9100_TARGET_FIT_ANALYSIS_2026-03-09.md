# smallFactory AS9100 Hedef Uygunluk Analizi

**Tarih:** 2026-03-09  
**Kapsam:** `C:\rynSoft\quvex\quvex-docs`, `C:\rynSoft\quvex\smallFactoryApi`, `C:\rynSoft\quvex\smallFactoryUI`  
**Hedef persona:** 10-200 calisan, buyuk savunma sanayi ana yuklenicilerine calisan, AS9100 sertifikali veya sertifikasyon disiplinine gore isleyen alt yuklenici

## 1. Kisa Sonuc

Kisa ve net yorumum su:

Bu proje bugunku haliyle **"genel bir KOBI ERP" olmaktan daha iyi**, ama **"AS9100 odakli savunma/havacilik operasyon sistemi" olmak icin henuz tam kapanmamis bir urun**.

Benim teknik kanaatim:

- **ERP / operasyon omurgasi:** guclu
- **Kalite ve uyum temeli:** beklentinin uzerinde guclu
- **Savunma alt yukleniciye satilabilirlik:** var
- **Denetim gunu rahatligi / audit-grade kapatilma:** henuz eksik
- **Tam muhasebe ERP seviyesi:** eksik
- **As-built / serial genealogy / contract review / formal release:** zayif veya yok

Ozetle:

Bu urun, hedefledigimiz profildeki firmalarin sorunlarinin **onemli bir kismini** cozmeye aday. Ama bugun daha cok:

- **uretim + kalite + izlenebilirlik + operasyonel finans** urunu

ve daha az:

- **tam kapanmis savunma ERP + audit-proof QMS + tam muhasebe**

durumunda.

## 2. Genel Degerlendirme

Bu kod tabaninin gucu, isim listesi degil; canli modullerin genisligi. API tarafinda 80+ controller seviyesinde bir kapsam var. UI tarafinda kalite, tedarikci, revizyon, audit, FAI, calibration, counterfeit, customer property, MRP, lot, maintenance gibi alanlar yalnizca menu olarak degil, servis ve ekran seviyesinde de gorunuyor.

Bu cok onemli bir avantaj. Cunku savunma/havacilik alt yuklenicileri icin asıl deger yalnizca teklif-siparis-fatura degil; su alanlarda cikiyor:

- izlenebilirlik
- revizyon disiplini
- tedarikci kalite yonetimi
- uygunsuzluk ve duzeltici faaliyet
- ozel proses ve kalifikasyon
- FAI / kontrol plani / denetim izi

Bu proje bu alanlarda bekledigimden daha fazla sey barindiriyor.

Ancak ayni anda ikinci gercek de var:

Bu modullerin onemli bir kismi **iyi bir temel**, ama hepsi henuz **tam kapali, audit-day hazir, prosedurle birebir entegre is akislarina** donusmus degil.

## 3. Ne Kadarini Karsiliyor?

Asagidaki tablo, hedef personanin ihtiyacina gore benim pratik degerlendirmemdir.

| Alan | Durum | Yorum |
|------|------|-------|
| Teklif / siparis / musteri | Kismen guclu | teklif, satis, musteri, portal var; formal contract review zayif |
| Urun / BOM / revizyon | Guclu | urun, ECN, revizyon, dokuman versiyonlama var |
| Uretim yonetimi | Guclu | production, planning, capacity, operation time, MRP, maintenance var |
| Stok ve lot izleme | Orta-iyi | lot takibi var; seri bazli genealogy seviyesi net degil |
| Kalite yonetimi | Guclu | incoming inspection, NCR, CAPA, SPC, control plan, FAI, audit, calibration var |
| Tedarikci kalite | Guclu | supplier evaluation, supply chain risk, counterfeit prevention var |
| Yetkinlik / ozel proses | Orta-iyi | training, competency, special process var |
| Audit trail / kayit kontrolu | Orta | audit trail var ama tum sureclere ne kadar derin gomulu oldugu sinirli |
| Muhasebe / finans | Orta | invoice, payment, statement, e-invoice var; tam genel muhasebe yok |
| Guvenlik / role governance | Orta-alt | permission sistemi var ama auth pipeline standarda tam oturmuyor |

## 4. Guclu Taraflar

## 4.1 Kalite tarafi beklenenden guclu

Asagidaki alanlar canli kodda dogrudan goruluyor:

- `NcrController`
- `CapaController`
- `IncomingInspectionController`
- `InternalAuditController`
- `CalibrationController`
- `RiskController`
- `ControlPlanController`
- `FaiController`
- `SpcController`
- `SupplierEvaluationController`
- `SupplyChainRiskController`
- `CounterfeitPartController`
- `CustomerPropertyController`
- `SpecialProcessController`
- `TrainingController`

Bu liste, projenin kaliteyi sonradan eklenmis bir mod gibi degil, ana urun omurgasi olarak ele almaya basladigini gosteriyor.

Pratik anlami:

- AS9100 sahibi alt yuklenicilerin denetim diliyle konusabilecek bir urun zemini var
- "yalnizca ERP" degil, "ERP + QMS-lite / QMS-core" arasi bir urune donusuyor

## 4.2 Revizyon ve konfigurasyon yonu dogru

Canli kodda gorulenler:

- `EcnController`
- urun revizyonlari
- dokuman versiyon gecmisi
- teklif revizyonlari
- kontrol plani revizyonlari
- audit trail

Bu, savunma/havacilikta cok kritik olan "hangi revizyonla calistim?" sorusuna gitmek icin dogru yon.

## 4.3 Tedarik zinciri ve sahte parca farkindaligi iyi

Ozellikle su alanlar fark yaratir:

- approved supplier yaklasimi
- supplier evaluation
- supply chain risk
- counterfeit part verification
- traceability details alanlari
- certificate of conformance referanslari

Bu, buyuk savunma sanayi tedarik zincirine giren firmalar icin ciddi bir ticari arti.

## 4.4 Uretim omurgasi yalnizca CRUD degil

Su basliklar degerli:

- production planning gantt
- capacity planning
- operation time
- OEE
- scrap tracking
- advanced MRP
- purchase suggestions
- stock valuation
- labor cost / standard cost / production cost reporting

Bu nedenle proje "basit ticari paket" gorunumunden daha derinde.

## 5. En Kritik Eksikler

Burasi en onemli bolum. Bence proje sahada en cok buradan zorlanir.

### 5.1 Formal contract review ve customer requirement flow-down zayif

Savunma/havacilik alt yuklenicisinde tekliften once ve siparis alindiginda su sorulari sistematik yonetmek gerekir:

- musteri ozel sartlari neler?
- cizim / spec / kalite isterleri ne?
- bunlar uretime nasil akacak?
- tedarikciye ne kadar flow-down edilecek?
- source inspection veya FAI zorunlulugu var mi?
- teslim dosyasi hangi kayitlari icerecek?

Kodda teklif, satis ve musteri modulleri var. Ancak formal "contract review / requirements review / customer-specific requirements flow-down" akisina dair belirgin bir kabiliyet gormedim.

Etkisi:

- sistem teklif-siparisi kaydeder
- ama savunma tedarik zincirinin "gereksinimlerin kapatilmasi" tarafinda manual surece fazla alan birakir

Bu, buyuk bir eksik.

### 5.2 Lot takibi var, ama serial-level as-built genealogy gorunmuyor

Projede lot/parti takibi acikca var:

- `StockLotController`
- lot number
- supplier, expiry, quantity, manufacture date
- incoming inspection icinde lot baglami
- special process records icinde lot/batch alanlari

Ama sahada ozellikle havacilik ve savunmada daha kritik soru su olur:

- tekil seri numarali urun hangi lotlardan beslendi?
- hangi operator, hangi proses, hangi ekipman, hangi revizyon ile islem yapti?
- teslim edilen urunun as-built kaydi cikiyor mu?

Kodda bu zincirin uc uca "serial genealogy / as-built device history" seviyesinde kapandigina dair yeterli kanit goremedim.

Etkisi:

- lot bazli izlenebilirlik var
- ama ileri seviye teslimat ve geri cagirma / failure investigation icin eksik kalabilir

### 5.3 Final inspection release / CoC / shipment package seviyesinde kapanis zayif

Counterfeit ve traceability tarafinda `CertificateOfConformance` referanslari mevcut. Ancak su akislarin sistematik kapanisi belirgin degil:

- final inspection release authority
- shipment release checklist
- certificate pack / data pack assembly
- customer teslim dokuman seti
- CoC otomatik uretilmesi
- teslim edilen urunun kabul otoritesi ve onay izi

Savunma alt yuklenicisi icin bunlar kritik.

Bugunku resimde:

- sevkiyat ve fatura tarafi var
- kalite ve dokuman modulleri de var
- ama bunlarin "final release paketi" olarak tek noktada kapandigina dair net bir akis gormedim

### 5.4 Tam muhasebe ERP seviyesi yok

Finans tarafinda mevcut guclu alanlar:

- invoice
- payment
- payment term
- customer statement
- tax/KDV hesaplari
- e-invoice
- cost accounting / standard cost / labor cost

Ama bunlar daha cok:

- operasyonel finans
- cari / tahsilat
- fatura ve maliyet gorunurlugu

tarafini karsiliyor.

Goremedigim veya belirgin bulmadigim alanlar:

- chart of accounts
- yevmiye / fis mantigi
- buyuk defter
- mizan
- banka mutabakati
- genel muhasebe kapanis akislari
- kur farki / muhasebe entegrasyon derinligi
- tam AP/AR muhasebe denetim izi

Yani:

Bu urun "muhasebeyi yonetiyor" demekten once **"fatura-tahsilat-maliyet tarafini yonetiyor"** demek daha dogru.

Eger hedef musteri "Logo/Netsis/Mikro yerine tek sistem istiyorum" derse yetersiz kalir.
Eger hedef musteri "uretim+kalite+izlenebilirlik merkezde olsun, finans operasyonel olarak gorunsun" derse daha mantikli olur.

### 5.5 Dokuman yonetimi var, ama kontrollu dokuman yasam dongusu tam degil

Dokuman tarafinda guclu seyler var:

- arama
- kategori
- tag
- referans tabloya baglama
- versiyon gecmisi
- yeni versiyon olusturma

Ama audit-grade dokuman yonetiminde genelde su alanlar beklenir:

- review / approval workflow
- effective date
- obsolete / superseded yonetimi
- controlled copy mantigi
- yalnizca gecerli versiyonun shop-floor kullanimi
- elektronik onay kaydi

Kodda versiyon zinciri var, ama bu tam kontrollu dokuman proseduuru seviyesine ulasmamis gorunuyor.

### 5.6 MRB, quarantine, concession/deviation gibi kapanis akislarinin derinligi sinirli

NCR, CAPA ve counterfeit modulleri mevcut. Bu cok iyi. Ama su detaylarin ne kadar kapali oldugu net degil:

- quarantine area mantigi
- MRB karar akisi
- use-as-is / rework / scrap / return disposition
- customer concession / deviation approval
- supplier corrective action closure

Bu basliklar denetim ve saha uygulamasinda fark yaratir.

### 5.7 Yetki ve audit trail tum sistemde esit derinlikte degil

Permission yapisi ve `YetkiDenetimi` var. Audit trail de var. Ama iki sorun suruyor:

- auth pipeline standart ASP.NET authentication akisi ile tam hizali degil
- audit trail belirli alanlarda var, ama tum kritik entity degisikliklerinin garanti altinda oldugu net degil

Savunma sanayi profilinde "kim, neyi, ne zaman degistirdi?" sorusu tutarli cevaplanmali.

## 6. AS9100 Acisindan En Guclu Karsilanan Alanlar

Benim kanaatimce proje, AS9100'e en yakin oldugu alanlarda gayet dogru yolda:

### 6.1 Uygunsuzluk ve duzeltici faaliyet

- NCR
- CAPA
- risk/FMEA
- internal audit bulgulari
- supplier ve quality feedback akisi

Bu alan ciddi bir arti.

### 6.2 Muayene ve olcum disiplini

- incoming inspection
- control plan
- SPC
- calibration
- FAI

Bu, urunu sahada diger KOBI ERP'lerden ayiran en guclu kisimlardan biri.

### 6.3 Tedarikci kalite ve sahte parca onleme

- supplier evaluation
- approved source
- counterfeit verification
- qualification basis
- traceability details

Savunma/havacilik alt yuklenicisi icin bunu urunde erken dusunmus olman cok degerli.

### 6.4 Ozel proses ve yetkinlik

- special process qualification
- operator certification
- training
- competency matrix

Bu da yine guclu bir savunma sanayi farklastiricisi.

## 7. Ticari Olarak En Mantikli Konumlandirma

Bu urunu bugun pazarda su sekilde anlatmak daha dogru olur:

**Dogru konumlandirma:**

- savunma/havacilik alt yuklenicisi icin
- uretim + kalite + izlenebilirlik + revizyon + operasyonel finans platformu

**Yanlis konumlandirma:**

- tam kapsamli genel muhasebe ERP'si
- tum AS9100 denetimini tek basina kapatan bitmis uyum platformu
- PLM/MES/QMS/ERP'nin tamami yerine gececek enterprise suite

En iyi musteri profili:

- Excel, klasor ve manuel kayitla yasayan
- kalite disiplini olan ama sistem daginik olan
- ana yukleniciye kalite kaniti gostermek zorunda olan
- lot bazli izlenebilirlik ve denetim izi isteyen
- buyuk ERP'lere gore daha hizli ve daha yerel bir cozum isteyen firmalar

En zor musteri profili:

- tam muhasebe ve finansal kapanis ERP'si bekleyen
- as-built serial genealogy ve teslim dosyasini bugun eksiksiz isteyen
- derin PLM / baselining / configuration status accounting bekleyen
- cok sert denetim ve askeri konfigurasyon akisi isteyen daha olgun firmalar

## 8. Benim Teknik Hukumum

Sana duz ve net gorusumu soyleyeyim:

Bu proje bos degil. Aksine, savunma alt yuklenicisi dunyasina gercekten dokunabilecek moduller yazilmis. Bircok yerli ERP'nin hic girmedigi kalite ve uyum alanlarina sen girmissin. Bu cok ciddi bir avantaj.

Ama ayni anda su da net:

Bu urun henuz "tam kapanmis savunma sanayi ERP'si" degil.

Bugunku haliyle bence su seviyede:

- **ERP omurgasi:** iyi
- **QMS omurgasi:** iyi
- **AS9100 destek seviyesi:** orta-iyi
- **audit-day kapanis seviyesi:** orta
- **tam savunma/havacilik dijital thread seviyesi:** orta-alt
- **tam muhasebe ERP seviyesi:** orta-alt

Pratikte benim yuzdeyle ifade etmem gerekirse:

- hedefledigin profilin operasyonel ihtiyacinin yaklasik **%65-75** bandina temas ediyor
- audit-grade kanit ve tam surec kapanisinin ise yaklasik **%40-55** bandinda oldugunu dusunuyorum

Bu oranlar olculmus bir metrik degil; canli kod kapsamindan cikan teknik kanaattir.

## 9. Oncelikli Eksik Listesi

Eger bu urunu "savunma sanayi alt yuklenicisine sahada rahat satilir" seviyeye tasimak istiyorsan benim oncelik siram su olur:

1. **Contract review ve customer requirement flow-down**
2. **Serial no / as-built / genealogy zinciri**
3. **Final inspection release + CoC + shipment package**
4. **Controlled document approval workflow**
5. **MRB / quarantine / deviation-concession akislarinin kapatilmasi**
6. **Tum kritik entity'lerde audit trail standardizasyonu**
7. **Tam muhasebe yapmayacaksan urunu operasyonel finans diye net konumlandirma**
8. **Auth ve role governance sertlestirmesi**

## 10. Son Soz

Benim fikrim cok net:

Bu proje **yanlis yolda degil**, hatta savunma/havacilik KOBI alt yuklenicisi icin dogru yone gitmis. Ozellikle kalite, izlenebilirlik, ozel proses, tedarikci kalite ve FAI taraflari urunun en degerli tarafi.

Ama bugun bu urunu en dogru cumleyle soylemek gerekirse:

**"Savunma ve havacilik alt yuklenicileri icin ERP tabanli uretim-kalite-izlenebilirlik platformu"**

demek dogru.

**"Tam kapanmis savunma ERP + tam muhasebe + audit-proof AS9100 platformu"**

demek icin ise biraz daha yol var.
