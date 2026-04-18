# Quvex ERP — Product Requirements Document

**Versiyon:** 3.0
**Tarih:** 2026-03-10
**Durum:** Aktif geliştirme — Derinleştirme aşaması

---

## 1. Ürün Tanımı

### Quvex nedir?

Quvex, savunma ve havacılık sektöründe çalışan küçük-orta ölçekli üretim tesisleri (10-200 çalışan) için geliştirilmiş bir operasyon yönetim platformudur.

Teklif verirsin, sipariş alırsın, üretirsin, sevk edersin, faturalarsın — ve tüm bu zincir boyunca kalite kayıtların denetim günü hazır olur.

### Hangi problemi çözüyor?

Hedef firmalarda bugün yaşanan gerçeklik:
- Teklifler Excel'de hazırlanıyor, revizyon takibi yapılamıyor
- Sipariş girildikten sonra üretim planlaması tahtada veya kafada yapılıyor
- Stok bilgisi güvenilir değil, aynı malzeme birden fazla siparişe söz veriliyor
- Kalite kayıtları klasörlerde, denetim günü aranıyor bulunmuyor
- Fatura ile sipariş arasındaki bağlantı kopuk
- Tedarikçi performansı hissiyata göre değerlendiriliyor

Quvex bu süreçlerin tamamını tek platformda dijitalleştirerek fabrikayı Excel'den kurtarır.

### Hedef müşteri profili

Büyük savunma/havacılık firmalarına (ana yüklenicilere) parça veya alt sistem üreten firmalar. AS9100 sertifikalı veya bu disipline göre çalışan kuruluşlar.

**Tipik firma profili:**
- 10-200 çalışan
- CNC tezgahları, montaj hattı veya özel proses (kaynak, boya, ısıl işlem) yapan tesis
- Yılda 50-500 farklı iş emri
- Ana yükleniciden gelen kalite gereksinimleri (FAI, NCR, CAPA, izlenebilirlik)
- Mevcut durumda Logo/Mikro ile muhasebe, Excel ile üretim takibi yapıyor

### Günlük kullanıcılar

| Rol | Sistemde ne yapar? |
|-----|-------------------|
| Satış sorumlusu | Teklif hazırlar, sipariş takip eder, müşteri portalını paylaşır |
| Üretim planlayıcı | İş emri oluşturur, Gantt'ta planlar, kapasite izler |
| Operatör | İş emri adımlarını tamamlar, süre ve miktar girer |
| Kalite mühendisi | NCR açar, CAPA takip eder, FAI doldurur, giriş kontrol yapar |
| Depo sorumlusu | Stok giriş/çıkış yapar, sayım yapar, barkod ile işlem yapar |
| Satınalma | Tedarik talebi oluşturur, tedarikçi teklifi toplar, değerlendirir |
| Muhasebe | Fatura keser, ödeme kaydeder, cari ekstre çıkarır |
| Yönetici | Dashboard ve KPI'lardan operasyonu izler |

---

## 2. Ana İş Akışı

Sistemin omurgası tek bir zincirdir. Her adım bir öncekine bağlıdır:

```
MÜŞTERİ ──→ TEKLİF ──→ SİPARİŞ ──→ ÜRETİM ──→ SEVKİYAT ──→ FATURA ──→ TAHSİLAT
```

### Akış detayı

**1. Teklif aşaması**
- Müşteri seçilir, ürün kalemleri eklenir
- Her kalem için miktar, birim fiyat, teslimat tarihi, iskonto girilir
- KDV otomatik hesaplanır
- Teklif TASLAK → GÖNDERİLDİ → KABUL veya RED durumlarından geçer
- İhtiyaç halinde revizyon oluşturulur (REV-01, REV-02...)
- Kabul edilen kalemler tek tıkla siparişe dönüşür

**2. Sipariş aşaması**
- Kabul edilen her teklif kalemi için satış kaydı oluşur
- BOM (ürün ağacı) varsa alt siparişler otomatik açılır
- Her alt sipariş için tedarik tipi belirlenir: İç üretim veya dış tedarik
- Depo ataması yapılır
- Sipariş üretime aktarılır

**3. Üretim aşaması**
- İş emri şablonu seçilir (hangi adımlardan geçecek)
- Gantt üzerinde planlanır (tarih, makine, öncelik)
- Operatör her adımda tamamlama girişi yapar (miktar, süre, makine, operatör)
- Malzeme stoktan tüketilir
- Son adım tamamlanınca mamul stoka girer
- Fire/hurda ayrıca kaydedilir

**4. Sevkiyat aşaması**
- Üretimi tamamlanan sipariş sevke hazır olur
- İrsaliye bilgileri girilir (irsaliye no, miktar, tarih)
- Sevk edilen miktar takip edilir

**5. Fatura aşaması**
- Sevk edilen sipariş için fatura oluşturulur
- KDV hesabı yapılır (%1, %10, %20)
- Fatura TASLAK → GÖNDERİLDİ → ÖDENDİ / KISMİ ÖDENDİ / GECİKMİŞ akışını takip eder
- Ödemeler kaydedilir (nakit, havale, kredi kartı, çek)
- Kısmi ödeme desteklenir

**Paralel kalite akışı**

Ana zincirin yanında kalite kayıtları sürekli çalışır:
- Gelen malzeme → Giriş kalite kontrol
- Üretim sırasında → Kontrol planı, SPC ölçümü
- Sorun çıkarsa → NCR açılır → CAPA başlatılır
- İlk üretim → FAI (AS9102 Form 1/2/3) doldurulur
- Periyodik olarak → İç denetim, kalibrasyon kontrolü, tedarikçi değerlendirme

---

## 3. Modül Detayları

### 3.1 Müşteri ve Tedarikçi Yönetimi

Müşteri ve tedarikçi aynı kayıt yapısındadır. Bir firma hem müşteri hem tedarikçi olabilir.

**Kayıt bilgileri:** Ad, yetkili kişi, email, telefon (2 adet), faks, website, adres, şehir, ülke, posta kodu, vergi no, vergi dairesi, sektör, kategori (A/B/C), döviz tercihi, ödeme vadesi (gün), kredi limiti, iskonto oranı, banka bilgileri, notlar.

**Filtreleme:** Ad, yetkili, email, telefon, vergi no, sektör, kategori bazında. Müşteri ve tedarikçi ayrı listeler halinde görüntülenir.

**Alt modüller:**
- **Müşteri şikayet yönetimi:** Şikayet kaydı → Araştırma → Aksiyon → Çözüm → Kapatma. Kök neden, düzeltici/önleyici faaliyet, memnuniyet puanı.
- **Müşteri memnuniyet anketi:** Kalite, teslimat, iletişim, fiyat, hizmet boyutlarında puanlama. Dönemsel (çeyreklik/yıllık) anket yönetimi.
- **Müşteri portalı:** Müşterinin kendi sipariş durumunu, üretim ilerlemesini, fatura ve tekliflerini self-servis görebildiği ekran.
- **Cari hesap ekstre:** Fatura (borç) ve ödeme (alacak) hareketleri, bakiye hesabı, tarih aralığı filtreleme.

---

### 3.2 Teklif Yönetimi

**Yaşam döngüsü:** TASLAK → GÖNDERİLDİ → KABUL EDİLDİ / REDDEDİLDİ

Her durumdan bir öncekine dönülebilir (rollback). Kabul edilen veya gönderilmiş tekliften yeni revizyon oluşturulabilir.

**Numara sistemi:** T{YYYY}-{6 haneli sıra} (örn: T2026-000042)

**Teklif başlığı:** Müşteri, teklif tarihi, açıklama, tahmini maliyet, ödeme koşulu (8 farklı vade tipi + özel), toplam tutarlar (ara toplam, iskonto, KDV, genel toplam).

**Teklif kalemleri:** Her kalem için ürün, miktar, birim fiyat, teslimat tarihi, yüzde iskonto, KDV oranı. Tüm hesaplamalar (iskonto tutarı, KDV tutarı, satır toplamı) otomatik.

**Revizyon:** Her revizyon bağımsız bir kayıt olarak saklanır, orijinal teklife referans verir. Revizyon tarihçesi timeline olarak görüntülenir.

**Tekliften satışa dönüşüm:** Kabul edilen teklifin her kalemi tek tek veya toplu olarak siparişe çevrilebilir. Sipariş numarası otomatik oluşur.

---

### 3.3 Satış Yönetimi

**Numara sistemi:** S{YYYY}-{6 haneli sıra}

**Sipariş yapısı:** Hiyerarşik. Bir ana sipariş altında, ürünün BOM ağacından türetilen alt siparişler otomatik oluşur. Her alt sipariş için tedarik tipi seçilir:
- **İç tedarik:** Fabrika içinde üretilecek
- **Dış tedarik:** Tedarikçiden satın alınacak (blanket no ile takip)

**Yaşam döngüsü:** TEKLİFTE → ÜRETİM BEKLİYOR → ÜRETİMDE → TAMAMLANDI → SEVK EDİLDİ

**Ek bilgiler:** Proje adı, satınalma sorumlusu, revizyon no, depo ataması.

**Üretime aktarma:** Sipariş tek tıkla üretime aktarılır. BOM ağacı varsa alt üretim emirleri recursive olarak oluşur.

---

### 3.4 Üretim Yönetimi

**Üretim emri:** Satış siparişinden otomatik oluşur. Hiyerarşik yapıdadır (ana ürün + alt montaj/yarımamul).

**Durum akışı:** BEKLIYOR → ALT ÜRÜN BEKLİYOR → ÜRETİM BEKLİYOR → TEDARİKTE → İŞLEMDE → HAZIR → TAMAMLANDI → SEVK TAMAMLANDI

**İş emri yönetimi:**
- Şablon bazlı: Önceden tanımlanmış adım sıraları (kesme → tornalama → kaynak → yüzey işlem → kontrol gibi)
- Her adımda tamamlama girişi: miktar, başlangıç/bitiş saati, operatör, makine
- Adım tamamlandığında otomatik sonraki adıma geçiş

**Planlama:**
- Gantt görünümü (6 haftalık, bugün çizgisi, geciken vurgusu, hafta sonu gösterimi)
- Öncelik bazlı sıralama
- Makine ataması
- Planlanmamış iş emirleri ayrı bölümde

**Kapasite planlama:**
- Makine bazlı kullanım oranı (%)
- Aşırı yüklenmiş makineler tespiti
- Zaman dilimi bazlı doluluk görünümü

**BOM ve MRP:**
- Çok seviyeli BOM patlatma (recursive)
- Net ihtiyaç hesaplama: Brüt ihtiyaç - mevcut stok - rezerve = net ihtiyaç
- Otomatik satınalma önerisi (öncelik sıralamalı)

**Maliyet takibi:**
- Gerçekleşen maliyet: Malzeme + İşçilik + Genel gider + Fason + Diğer
- Standart maliyet tanımı (ürün bazlı, dönemsel)
- Varyans analizi: Gerçekleşen vs standart sapma (% ve tutar)
- İşçilik: WorkOrderLog'lardan otomatik hesaplanan saat × saat ücreti

**Fire/hurda takibi:**
- 7 neden kategorisi (malzeme hatası, makine hatası, operatör hatası, proses hatası, tasarım hatası, takım aşınması, diğer)
- Geri kazanılabilirlik flag'i
- Maliyet etkisi hesabı

**Üretim durum logu:** Her durum değişikliği kayıt altına alınır (eski durum, yeni durum, değiştiren kullanıcı, tarih).

---

### 3.5 Stok Yönetimi

**Depo yapısı:** Çoklu depo desteği. Her depo için kod, ad ve sorumlu tanımlanır.

**Stok hareketleri:** Giriş (IN) ve çıkış (OUT) fişleri ile takip. Her fiş bir depoya aittir, birden fazla kalem içerebilir. Çıkış fişi negatif stok oluşturmaz (sistem engeller). Üretim tamamlanınca otomatik giriş, malzeme tüketiminde otomatik çıkış oluşur.

**Stok sayım:**
- TASLAK → DEVAM EDİYOR → TAMAMLANDI → ONAYLANDI akışı
- Her kalem için sistem miktarı vs sayılan miktar, fark otomatik hesaplanır
- Onay sırasında stoku otomatik düzeltme opsiyonu

**Lot/parti takibi:**
- Lot numarası, üretim tarihi, son kullanma tarihi, tedarikçi bağlantısı
- Son kullanma uyarısı (30 gün eşiği)
- FIFO sıralaması (son kullanma tarihine göre)
- Süresi dolmuş lotlar kırmızı, dolmak üzere olanlar turuncu

**Stok değerleme:**
- FIFO yöntemi
- Ağırlıklı ortalama yöntemi
- Ürün bazlı birim maliyet ve toplam değer hesabı

**Min/max uyarı sistemi:**
- Ürün bazında minimum stok, maksimum stok ve yeniden sipariş noktası tanımı
- Üç uyarı seviyesi: Minimum altı (kırmızı), sipariş noktası altı (turuncu), maksimum üstü (mavi)
- Stok listesinde renk kodlu satırlar
- Dashboard kartlarında sayısal özet

**Barkod:**
- EAN-13 otomatik barkod üretimi (869 Türkiye prefix'i)
- Barkod arama, ürüne atama
- Code128B SVG barkod yazdırma (etiket çıktısı)
- Barkod ile hızlı ürün bilgisi görüntüleme

**Otomatik satınalma:** Stok yeniden sipariş noktasının altına düştüğünde otomatik tedarik talebi oluşturma.

---

### 3.6 Satınalma

**Tedarik talebi:** Üretim ihtiyacından veya stok uyarısından oluşur. BEKLIYOR → İŞLEMDE → SİPARİŞ VERİLDİ → TEDARİK EDİLDİ akışı.

**Tedarikçi teklifi:** Her talep için birden fazla tedarikçiden teklif toplanır. Birim fiyat, tarih ve tedarik durumu kayıt altında.

**Otomatik satınalma önerisi:** BOM patlatma sonucu net ihtiyaç hesaplanır, stok-ihtiyaç oranına göre öncelik atanır (KRİTİK / YÜKSEK / ORTA / NORMAL).

**Tedarikçi değerlendirme:**
- Onaylı tedarikçi kaydı (9 kategori: hammadde, komponent, alt montaj, hizmet, kalibrasyon, özel proses, takım, ambalaj, lojistik)
- Periyodik puanlama (Kalite %40 + Teslimat %30 + Fiyat %15 + İletişim %15)
- Risk seviyesi otomatik hesaplama
- Onay durumu: Beklemede → Koşullu Onay → Onaylı → Askıya Alınmış → Diskalifiye
- Dashboard: Toplam, onaylı, askıda, geciken değerlendirme sayıları, en iyi/en kötü performans

---

### 3.7 Fatura ve Finans

**Fatura:**
- Numara sistemi: FTR-{YYYY}-{5 haneli sıra}
- Yaşam döngüsü: TASLAK → GÖNDERİLDİ → ÖDENDİ / KISMİ ÖDENDİ / GECİKMİŞ / İPTAL
- Kalem bazlı: Ürün, açıklama, miktar, birim fiyat, iskonto %, KDV %
- Desteklenen KDV oranları: %1, %10, %20
- Satır bazlı iskonto ve KDV hesaplaması
- Fatura toplamları: Ara toplam, iskonto toplamı, KDV toplamı, genel toplam

**Ödeme takibi:**
- Kısmi ödeme desteği (aynı faturaya birden fazla ödeme)
- 4 ödeme yöntemi: Nakit, banka transferi, kredi kartı, çek
- Fatura durumu ödemeye göre otomatik güncellenir
- Ödeme silme durumunda bakiye geri hesaplanır
- Ödeme referans numarası ve not alanı

**Ödeme vadesi:** 8 vade tipi (peşin, 15/30/45/60/90 gün vadeli, taksitli, avans, özel) + özel gün sayısı tanımı.

**Cari hesap ekstre:**
- Borç (fatura) ve alacak (ödeme) hareketleri kronolojik sırada
- İşlem bazlı bakiye hesabı
- Tarih aralığı filtreleme
- Tüm müşteriler için bakiye özeti raporu

**Maliyet muhasebesi:**
- Üretim bazlı gerçekleşen maliyet (5 kategori)
- Ürün bazlı standart maliyet tanımı (geçerlilik tarihli)
- Maliyet sapma analizi (gerçekleşen vs standart)
- İşçilik maliyet hesabı (saat × saat ücreti, fazla mesai çarpanı)

**e-Fatura:** GİB entegrasyonu için altyapı hazır (stub). Gerçek provider (Foriba, Logo Connect vb.) entegrasyonu bekliyor.

---

### 3.8 Kalite ve Uyumluluk Modülleri

Bu modüller Quvex'in **asıl farklılaşma noktasıdır.** Rakip KOBİ ERP'lerde bu genişlikte kalite kapsamı bulunmaz.

#### Temel Kalite Süreçleri

**NCR — Uygunsuzluk Kaydı** (AS9100 Madde 10.2)
Üretim, giriş kontrol veya müşteri şikayetinden doğan uygunsuzlukların kaydı. Kök neden analizi, düzeltici faaliyet bağlantısı, durum takibi.

**CAPA — Düzeltici ve Önleyici Faaliyet** (AS9100 Madde 10.2)
NCR'den veya bağımsız olarak açılır. Düzeltici faaliyet tanımı, sorumlu atama, hedef tarih, etkinlik doğrulama, kapatma.

**Giriş Kalite Kontrol** (AS9100 Madde 8.4)
Gelen malzemenin muayenesi. Ölçüm kayıtları, kabul/red kararı, tedarikçi bağlantısı.

**Kalibrasyon Yönetimi** (AS9100 Madde 7.1.5)
Ölçüm aletleri envanteri, kalibrasyon takvimi, sertifika takibi, gecikme uyarıları.

**Kontrol Planları** (AS9100 Madde 8.5.1)
Proses kontrol noktaları tanımı, ölçüm yöntemleri, kabul kriterleri, reaksiyon planları.

**Risk ve FMEA** (AS9100 Madde 8.1.1)
5×5 risk matrisi, FMEA analizi (RPN hesaplama), risk azaltma aksiyon planları.

**İç Denetim** (AS9100 Madde 9.2)
Denetim planlama, bulgu kaydı, bulgu sınıflandırma, düzeltici faaliyet entegrasyonu.

**FAI — İlk Parça Muayene** (AS9102)
AS9102 Form 1 (Part Number), Form 2 (Product), Form 3 (Characteristic). Karakteristik bazlı ölçüm kaydı, onay süreci.

#### İleri Kalite ve Uyumluluk

**Tedarikçi Değerlendirme** (AS9100 Madde 8.4)
Onaylı tedarikçi yönetimi, periyodik puanlama, risk seviyesi, performans dashboard.

**Eğitim ve Yetkinlik** (AS9100 Madde 7.2)
Eğitim planlama ve takip, yetkinlik matrisi (kişi × beceri), etkinlik değerlendirme.

**ECN — Mühendislik Değişiklik Bildirimi** (AS9100 Madde 8.3)
Ürün/proses değişiklik kaydı, revizyon takibi, değişiklik onay süreci.

**Konfigürasyon Yönetimi** (AS9100 Madde 8.1.6)
Konfigürasyon ögesi tanımı, baseline yönetimi, değişiklik kontrol.

**Özel Proses Yönetimi** (AS9100 Madde 8.5.1.2)
Kaynak, boya, ısıl işlem gibi özel proseslerin tanımı. Operatör yetkilendirme, proses validasyonu, periyodik yeniden doğrulama.

**FOD Önleme** (AS9100 Madde 8.5.4)
Yabancı madde risk bölgeleri, kontrol noktaları, olay kaydı, önleyici tedbirler.

**Müşteri Mülkiyeti** (AS9100 Madde 8.5.3)
Müşteriye ait malzeme/takım/fikstür kaydı. 11 mülk tipi, 7 durum. Hasar/kayıp olay kaydı, müşteri bildirimi.

**Sahte Parça Önleme** (AS9100 Madde 8.1.4)
Parça doğrulama süreci, tedarikçi kontrol, şüpheli bildirimi, izlenebilirlik kayıtları.

**SPC — İstatistiksel Proses Kontrol** (IA9100)
7 kontrol kartı tipi (X-bar R, X-bar S, Individual MR, P, NP, C, U). UCL/LCL otomatik hesaplama, Cp/Cpk proses yeterlilik, Western Electric kurallarının tespiti.

**PPAP — Üretim Parçası Onay Süreci** (IA9100)
5 seviye sunum, 18 PPAP elementi, element bazlı onay, sunum durumu takibi.

**Tasarım ve Geliştirme** (AS9100 Madde 8.3)
8 fazlı tasarım yaşam döngüsü. Design review (5 tip), design verification (5 tip), faz geçiş yönetimi.

**Tedarik Zinciri Risk** (IA9100)
10 risk kategorisi, 5×5 matris, risk azaltma aksiyonları, otomatik durum geçişi.

**Ürün Güvenliği** (IA9100 / MIL-STD-882E)
Risk değerlendirme, tehlike analizi, güvenlik olayı kaydı, MIL-STD-882E tehlike sınıflandırması.

**KPI ve Performans Analitik** (IA9100)
8 kategori (Kalite, Teslimat, Üretim, Maliyet, Güvenlik, Müşteri Memnuniyeti, Tedarikçi, Çevre). Otomatik hedef değerlendirme (yeşil/sarı/kırmızı), trend analizi (iyileşiyor/stabil/kötüleşiyor).

**Siber Güvenlik** (IA9100 / ISO 27001)
Varlık envanteri, güvenlik kontrolleri, olay yönetimi.

**Denetim İzi**
Tüm kritik işlemler için değişiklik kaydı (kim, ne zaman, ne değiştirdi).

---

### 3.8.1 Sektör Bazlı Nis Modüller (Sprint 11)

Sprint 11 ile Quvex, savunma/havacılık odağını koruyarak 18 sektöre kapsayıcı hâle getirildi. Her sektörün blocker gereksinimini kapatan 5 nis modül eklendi:

**ProductVariant — Beden × Renk Matrisi (Tekstil)**
- Parent ürün altında çoklu varyant yönetimi (ParentProductId, SizeCode, ColorCode, SkuSuffix)
- Bulk-generate: S/M/L × Beyaz/Mavi/Siyah seçimi ile tek tıkla 15 SKU oluşturma
- ProductVariantMatrix UI — matris görünümü ve stok takibi
- Hedef sektör: 30K tekstil KOBİ

**HACCP/CCP + Recall — Kritik Kontrol Noktası ve Geri Çağırma (Gıda)**
- 3 entity: HaccpControlPoint (CCP tanımı), HaccpMeasurement (sıcaklık/nem/pH ölçümü), RecallEvent
- Forward trace BFS: Lot kime sevk edildi, hangi siparişlere girdi
- 7-step recall wizard: olay tanımı → etkilenen lotlar → müşteri listesi → bildirim → toplama → imha → kapatma
- Otomatik NCR açılması (CCP limiti aşılınca)
- Hedef sektör: 25K gıda KOBİ

**MoldInventory — Kalıp Yönetimi (Plastik)**
- Mold entity: CavityCount, CycleTimeSeconds, ShotCounter, MaintenanceThresholdShots
- Shot sayacı otomatik artar, eşik aşılınca bakım uyarısı
- Kalıp bazlı çevrim süresi ve üretim kapasitesi hesabı
- Hedef sektör: 12K plastik enjeksiyon KOBİ

**CE Technical File — CE Teknik Dosya (Makine)**
- CeTechnicalFile entity (19 alan): risk assessment ref, document refs, directives (2006/42/EC Machinery Directive, LVD, EMC), notified body
- Machinery sektör profili eklendi
- CE işaretleme için gerekli teknik dosya yapısı dijital
- Hedef sektör: 10K makine imalat KOBİ

**WPS/WPQR + Welder Certificate — Kaynak Prosedürü ve Kaynakçı Sertifikası (Kaynak)**
- WeldingProcedureSpecification (19 proses parametresi: akım, voltaj, hız, koruma gazı, pozisyon vb.)
- WelderCertificate entity — sertifika expiry alarm (kırmızı/turuncu vurgu)
- EN ISO 15614 / AWS D1.1 uyumlu
- Hedef sektör: 5K kaynak atölyesi KOBİ

---

### 3.9 Destek Modülleri

**Bakım Yönetimi (CMMS):** Planlı bakım takvimi, bakım iş emri, arıza kaydı. OEE dashboard (Kullanılabilirlik × Performans × Kalite).

**İK ve Vardiya:** Çalışan kaydı, vardiya tanımı, çalışan-vardiya ataması, devam takibi.

**Doküman Yönetimi:** Doküman yükleme, versiyonlama, ürün/proses ile ilişkilendirme.

**Raporlama:** 8+ rapor tipi, Excel export desteği.

**Bildirimler:** Sistem içi bildirim altyapısı.

**Proje Yönetimi:** Proje oluşturma, milestone tanımı, görev ataması, otomatik tamamlanma yüzdesi.

---

## 4. Standart Uyumluluk

### AS9100 Rev D Karşılıkları

| AS9100 Maddesi | Konu | Quvex Modülü |
|----------------|------|-------------|
| 4.4 | Kalite Yönetim Sistemi | Kalite Dashboard, Doküman Yönetimi |
| 6.1 | Risk ve Fırsatlar | Risk & FMEA |
| 7.1.5 | İzleme ve Ölçme Kaynakları | Kalibrasyon |
| 7.2 | Yetkinlik | Eğitim & Yetkinlik |
| 8.1.1 | Operasyonel Planlama | Proje Yönetimi, Risk |
| 8.1.4 | Sahte Parça Önleme | Sahte Parça Önleme |
| 8.1.6 | Konfigürasyon Yönetimi | Konfigürasyon |
| 8.3 | Tasarım & Geliştirme | Tasarım, ECN |
| 8.4 | Dışarıdan Temin Edilen Süreçler | Tedarikçi Değerlendirme, Giriş Kontrol |
| 8.5.1 | Üretim ve Hizmet Sunumu | Kontrol Planları, Üretim |
| 8.5.1.2 | Özel Prosesler | Özel Proses Yönetimi |
| 8.5.3 | Müşteri Mülkiyeti | Müşteri Mülkiyeti |
| 8.5.4 | Muhafaza (FOD dahil) | FOD Önleme |
| 9.1.2 | Müşteri Memnuniyeti | Şikayet Yönetimi, Anket |
| 9.2 | İç Denetim | İç Denetim |
| 10.2 | Uygunsuzluk & Düzeltici Faaliyet | NCR, CAPA |

### IA9100 (2026) Karşılıkları

| Gereksinim | Quvex Modülü |
|-----------|-------------|
| Siber Güvenlik | Siber Güvenlik Yönetimi |
| Ürün Güvenliği | Ürün Güvenliği |
| Veri Tabanlı Karar Alma | KPI & Performans Analitik |
| Tedarik Zinciri Risk | Tedarik Zinciri Risk |
| İstatistiksel Proses Kontrol | SPC |
| Üretim Parçası Onay Süreci | PPAP |
| Tasarım & Geliştirme | Tasarım Yönetimi |

### EYDEP A Seviye Karşılıkları

| EYDEP Kriteri | Quvex Modülü |
|--------------|-------------|
| Kalite Yönetim Sistemi | NCR, CAPA, Kontrol Planları, Kalibrasyon |
| Üretim Yönetimi | Üretim Planlama, Kapasite, Maliyet |
| Stok & Malzeme | Stok (7 alt modül), MRP |
| Tedarik Zinciri | Tedarikçi Değerlendirme, Tedarik Zinciri Risk |
| İnsan Kaynakları | İK & Vardiya, Eğitim & Yetkinlik |
| Doküman Yönetimi | Doküman, ECN |
| Kalite Denetim | İç Denetim, Kalibrasyon |
| Maliyet Muhasebesi | Fatura, Ödeme, Maliyet Hesaplama |
| Müşteri İlişkileri | Müşteri Yönetimi, Portal, Memnuniyet |
| Raporlama & Analiz | Raporlar, KPI Dashboard |

---

## 5. Bilinen Sınırlar

Aşağıdaki konular bilinçli olarak kapsam dışında bırakılmıştır. Bu kararlar hedef kullanıcının gerçek ihtiyacı, ürünün odağı ve karmaşıklık dengesine göre verilmiştir.

| Konu | Neden kapsam dışı? |
|------|-------------------|
| Genel muhasebe (yevmiye, büyük defter, bilanço) | Hedef firma zaten Logo, Mikro veya Netsis kullanıyor. Quvex operasyonel finans sağlar, muhasebe paketi değildir. |
| Çoklu döviz | Hedef firmaların büyük çoğunluğu TRY ile çalışır. Currency alanı mevcutta kayıtlıdır, kur dönüşümü eklenmemiştir. |
| Mobil uygulama | Web responsive yeterli. Ayrı native app öncelik değil. |
| Multi-tenant | Tek firma, tek instance. SaaS modeli şu an hedefte değil. |
| ERP entegrasyonu (SAP/Oracle) | Hedef firma ölçeğinde SAP yok. Excel import/export yeterli. |
| IoT / sensör verisi | Makine sensör entegrasyonu ayrı ürün olarak değerlendirilecek. |
| Gelişmiş CRM analitiği | 10-200 çalışanlı firma 50-100 müşteriyle çalışır. RFM, CLV, churn analizi gereksiz karmaşıklık yaratır. |
| Tam e-ticaret / B2B portal | Müşteri portalı salt okunur takip amaçlıdır. Sipariş verme özelliği yoktur. |

---

## 6. Sıradaki İyileştirmeler

Yeni modül açılmayacak. Mevcut süreçlerdeki gerçek kullanım engelleri giderilecek.

### A — Operasyonu bloke eden

**A1. Satınalma siparişi (PO)**
Şu an sadece tedarik "talebi" var. Formal bir satınalma sipariş belgesi yok. Bu olmadan:
- Tedarikçiye resmi sipariş verilemiyor
- Gelen malzeme bir siparişe bağlanamıyor
- Fatura ile sipariş eşleştirmesi yapılamıyor (3'lü eşleşme)

Gerekli: PO belgesi oluşturma, yaşam döngüsü (taslak → onay → gönderildi → teslim alındı → kapatıldı), mal alım ve fatura ile bağlantı.

**A2. Stok rezervasyonu**
Sipariş alındığında stok ayrılmıyor. Aynı malzeme birden fazla siparişe söz verilebilir. ReservedQuantity alanı mevcut ama aktif değil.

Gerekli: Sipariş oluştuğunda otomatik rezerv, sevkiyat veya iptalda serbest bırakma, kullanılabilir stok = toplam - rezerve hesabı.

**A3. İade faturası ve stopaj**
İade faturası (credit note) oluşturulamıyor. Türk B2B ticaretinde zorunlu olan KDV tevkifatı (stopaj) hesaplanamıyor. Bu ikisi olmadan gerçek operasyona çıkılamaz.

Gerekli: İade faturası tipi, orijinal faturaya referans, tevkifat oranı (%50, %70, %90) ve tutarı hesaplama.

### B — Kullanıcı deneyimini önemli ölçüde iyileştiren

**B1. PDF çıktılar**
Teklif, fatura ve irsaliye için yazdırılabilir/gönderilebilir belge formatı yok. Müşteriye ekrandan kopyala-yapıştır yapılıyor.

Gerekli: Antetli kağıt formatında teklif PDF, fatura PDF, irsaliye PDF.

**B2. Depolar arası transfer**
Bir depodan diğerine malzeme transferi tek fiş ile yapılamıyor. İki ayrı fiş (çıkış + giriş) ile workaround gerekiyor.

Gerekli: Tek transfer belgesi (kaynak depo → hedef depo), transfer onayı.

**B3. Teklif geçerlilik süresi**
Teklifin ne zaman geçersiz olacağı belirtilemiyor. Süresi dolan teklifler listede aktif olarak kalmaya devam ediyor.

Gerekli: Geçerlilik tarihi alanı, süresi geçen teklifler için görsel uyarı.

### C — Denetim günü güvencesi

**C1. Üretimde kalite kapısı**
Üretim adımları kalite onayı olmadan ilerleyebiliyor. Denetçi "ara kontrol noktanız nerede?" diye sorduğunda gösterecek sistem kaydı yok.

Gerekli: Belirli üretim adımlarına kalite kontrol noktası tanımlama, kontrol onaylanmadan sonraki adıma geçişi engelleme.

**C2. Operasyon sırası zorlama**
İş emri adımları sırasız tamamlanabiliyor. 2. adım bitmeden 3. başlayabiliyor. Bu izlenebilirliği zayıflatır.

Gerekli: Önceki adım tamamlanmadan sonraki adımın tamamlama girişini engelleme.

### Bilinçli olarak ertelenenler

Aşağıdaki maddeler değerlidir ancak yukarıdaki 8 madde kapatılmadan başlanmayacaktır:
- Atölye terminali (mobil/tablet operatör ekranı)
- Fason/taşeron iş emri yönetimi
- Çoklu adres ve çoklu iletişim kişisi
- Seri numara takibi
- e-Fatura gerçek GİB entegrasyonu
- Depo içi lokasyon hiyerarşisi (raf/bin)
- Sonlu kapasite çizelgeleme algoritması

---

## 7. Teknoloji Özeti

| Katman | Teknoloji |
|--------|-----------|
| Backend | .NET 8, C# 12, Entity Framework Core 8, PostgreSQL |
| Frontend | React 18, Redux Toolkit, Ant Design 5, Axios |
| Kimlik Doğrulama | JWT + ASP.NET Identity |
| Yetkilendirme | Custom YetkiDenetimi (16 modül, 55 izin) |
| Validasyon | FluentValidation (auto-validation) |
| Loglama | Serilog (günlük dosya, 30 gün saklama) |
| Test | xUnit + FluentAssertions (~693 test), Vitest (~389 test) |
| Altyapı | Docker, Jenkins CI/CD, Swagger/OpenAPI |

**Mimari:** Interface → Service → Controller. Dependency Injection. Entity↔DTO dönüşümü AutoMapper ile. EF Core NoTracking default. Tüm enumlar string olarak saklanır.

**Ölçek:** 86 controller, 64 service, 130+ DbSet, 55+ UI route.

---

## 8. Başarı Kriterleri

Quvex başarılı olmuştur eğer:

1. **Zincir kesintisiz çalışıyorsa** — Teklif → sipariş → üretim → sevk → fatura akışı baştan sona tek platformda tamamlanabiliyor.

2. **Denetim günü hazırsa** — NCR, CAPA, FAI, kalibrasyon, tedarikçi değerlendirme, eğitim kayıtları sisteme girilmiş ve erişilebilir durumda.

3. **Excel'e dönüş yoksa** — Kullanıcı hiçbir adımda sistemi terk edip Excel'e geçmek zorunda kalmıyor.

4. **Stok güvenilirse** — Fiziksel stok ile sistem stoku tutarlı. Lot izlenebilir. Aynı stok iki siparişe söz verilemiyor.

5. **Belge üretilebiliyorsa** — Teklif, fatura ve irsaliye müşteriye gönderilebilir formatta çıktı alınabiliyor.

---

---

## 9. Gelecek Surum — Planlanan Ozellikler

> Bu bolum mevcut surumde yer almayan ancak urun yol haritasinda onceliklendirilen ozellikleri listeler.
> Son guncelleme: 2026-04-11

### 9.1 Savunma / Talasli Imalat Derinlestirme

| # | Ozellik | Oncelik | Aciklama | Tahmini Efor |
|---|---------|---------|----------|-------------|
| S1 | Takim Omru Takibi (Tool Life) | YUKSEK | CNC takim envanteri, beklenen omur, tuketim loglama, prediktif degisim uyarisi | 1 hafta |
| S2 | SPC Gercek Zamanli Kontrol Kartlari | YUKSEK | 7 kart tipi (X-bar/R, X-bar/S, p, np, c, u, CUSUM), otomatik alarm, trend analizi | 1 hafta |
| S3 | MSA / Gage R&R Analizi | YUKSEK | Olcum sistemi analizi, tekrarlanabilirlik/tekrar uretebilirlik, AS9100 audit zorunlu | 3-5 gun |
| S4 | Ozel Proses Kontrol | ORTA | Kaynak/isil islem/yuzey islem parametre takibi, yeterlilik kaydi zorunlulugu | 1 hafta |
| S5 | Musteri Emanet Malzeme (CFM) | ORTA | Teslim alma, segregasyon, kullanim mutabakat, iade/hasar takibi | 3 gun |
| S6 | Teslim Dosyasi Release Workflow | ORTA | Formal onay sureci, teslim dosyasi icerigi kontrol, musteri onay akisi | 3 gun |
| S7 | FAIR Balon Cizim Esleme | DUSUK | Teknik cizim uzerinde olcum noktasi isaretleme, boyutsal sertifika baglantisi | 5 gun |
| S8 | Konfigrasyon Durum Muhasebesi (CSA) | DUSUK | Baseline yonetimi, uretim baslangic snapshot, degisiklik izleme | 3 gun |

### 9.2 Platform / Multi-Tenant

| # | Ozellik | Oncelik | Aciklama | Tahmini Efor |
|---|---------|---------|----------|-------------|
| P1 | Dinamik Rol/Permission Olusturma | ORTA | Tenant admin kendi rolleri + permission seti olusturabilsin | 1 hafta |
| P2 | Trial → Ucretli Gecis Odeme Akisi | YUKSEK | Plan secimi, odeme entegrasyonu (PayTR), otomatik tier yukseltme | 1 hafta |
| P3 | PostgreSQL Row-Level Security (RLS) | DUSUK | Schema izolasyonuna ek ikinci savunma katmani | 3 gun |
| P4 | Tenant Bazli Sifreli Anahtarlar | DUSUK | Her tenant icin ayri sifreleme anahtari (vault entegrasyonu) | 3 gun |
| P5 | GDPR Veri Silme Akisi | ORTA | Kullanici/tenant veri silme talebi islem sureci | 3 gun |

### 9.3 Sektor Spesifik Genisleme

| # | Ozellik | Oncelik | Aciklama | Tahmini Efor |
|---|---------|---------|----------|-------------|
| K1 | Gida Sektoru HACCP Modulu | ORTA | Kritik kontrol noktasi tanimi, sicaklik/nem loglama, allerjen yonetimi | 2 hafta |
| K2 | Tekstil Beden-Renk Varyant Yonetimi | ORTA | Coklu varyant, boya lot esleme, renk farki (dE) olcum | 1 hafta |
| K3 | Otomotiv PPAP Paket Olusturma | YUKSEK | 18 element otomatik paketleme, musteri portal entegrasyonu | 1 hafta |
| K4 | Sektor Bazli Dashboard KPI | ORTA | Sektor'e gore ozellesmis dashboard widgetlari | 1 hafta |

> **NOT (2026-04-12):** K1 (HACCP) ve K2 (Tekstil Varyant) Sprint 11'de tamamlandi. Bkz. §10.

---

## 10. Sprint 11 Guncellemeleri (2026-04-12)

Sprint 11 ile Quvex savunma/havacilik odagini koruyarak 18 sektore kapsayici hale getirildi. Referans: `sprints/SPRINT-11-KAPSAYICI-URUN-2026-04-12.md`

### 10.1 Yeni Modüller

**5 Nis Modul** (bkz. §3.8.1): ProductVariant (Tekstil), HACCP/CCP + Recall (Gida), MoldInventory (Plastik), CE Technical File (Makine), WPS/WPQR + Welder Certificate (Kaynak).

### 10.2 Killer Feature'lar

**5-Dakika Onboarding + Sektor Demo Data**
- 8 sektor icin hazir sablon (CNC, Tekstil, Gida, Otomotiv, Plastik, Metal, Mobilya, Makine)
- `IOnboardingService.SeedSectorDemoDataAsync(sectorCode)` — idempotent seed
- `POST /Onboarding/seed-demo/{sectorCode}`
- Her sablon: ornek musteriler (ASELSAN, KOTON, Migros, Ford Otosan vb.), urunler, makineler, sektor ekstralari (ProductVariants, HACCP CCP, Mold)
- Mehmet Bey ilk kullanim suresi: 20 dk → 3 dk

**Real-time Uretim Panosu (TV Dashboard)**
- `ProductionDashboardHub` (SignalR) `/hubs/production-board`
- Tenant-isolated groups: `production_{tenantId}`
- TV-ready dark theme, 56px KPI rakamlar, color-coded machine cards
- Route: `/production/live-board`
- Hangfire job her 5 dakikada board refresh

**WhatsApp Bildirim Entegrasyonu**
- Meta Cloud Graph API + Polly resilience
- Turkiye telefon normalle$tirme (`5551234567` → `905551234567`)
- 8 hazir Turkce sablon: siparis onay, kargo bildirim, odeme hatirlat, odeme alindi, NCR uyarisi, is emri atama, stok uyari, bakim hatirlat
- NotificationService entegrasyonu additive (Email + SignalR + WhatsApp paralel)

### 10.3 UX ve Persona Iyile$tirmeleri

**8 Quick Win UX:** ProductForm minimal mode (5 alan + toggle), CustomerForm minimal mode (4 alan + tabs), HelpButton (10 sayfa floating ?), GlossaryTooltip 16 → 55 terim, Persona Dashboard routing (6 rol), EmptyState bilesen (6 sayfa), mobile responsive tables (iOS HIG 44px), demo data hero banner.

**8 Persona Polish:** Veli Usta (ShopFloor Joyride), Huseyin Bey (2-step hizli ariza + foto), Hasan Bey (sapma sebebi dropdown), Selma Hanim (drag-drop sertifika upload), Ayse Hanim (e-Fatura kolonu), Ahmet Bey (makine multi-select filter), Mehmet Bey ("Bugunkü Ozet" kart), **Fatma Hanim (tedarikci kar$ila$tirma matrisi — en kritik)**.

### 10.4 Sektor Desteği — 18 Sektor Tam

Quvex artik tam kapsayici olarak **18 sektore** hitap ediyor:

**Savunma / Havacilik alt sektorleri (10):** CNC Talasli Imalat, Kaynak Atolyesi, Isil Islem Fason, Yuzey Islem/Kaplama, Kompozit Imalat, Elektronik Kart Montaji, NDT (Tahribatsiz Muayene), Optik, Dokum, Kalip Imalat.

**Sivil sektorler (8):** Otomotiv Yan Sanayi, Plastik Enjeksiyon, Gida Uretimi, Tekstil, Metal Esya / Celik Konstruksiyon, Makine Imalati, Medikal Cihaz, Mobilya Imalati.

### 10.5 Pazar Etkisi

| Metrik | Onceden | Sprint 11 Sonrasi |
|--------|---------|-------------------|
| KOBI erisimi | 51K | **133K** (+%160) |
| Desteklenen sektor | Kismi 10 | **18 tam** |
| Sektor skor ortalamasi | 5.4/10 | **7.8/10** |
| Mehmet Bey ilk kullanim | 20 dk | **3 dk** (7.5x) |
| Trial conversion (tahmini) | %34 | **%75** |

**Pazar genislemesi:** 82K yeni KOBI — ozellikle Tekstil (30K), Gida (25K), Plastik (12K), Makine (10K), Kaynak (5K).

---

*Bu doküman ürünün ne olduğunu, neyi çözdüğünü, mevcut kapsamını ve bir sonraki adımda neyin yapılacağını tanımlar. Teknik implementasyon detayları (entity tasarımı, API spesifikasyonu, sprint planı) ayrı dokümanlarda yönetilir.*
