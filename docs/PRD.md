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

*Bu doküman ürünün ne olduğunu, neyi çözdüğünü, mevcut kapsamını ve bir sonraki adımda neyin yapılacağını tanımlar. Teknik implementasyon detayları (entity tasarımı, API spesifikasyonu, sprint planı) ayrı dokümanlarda yönetilir.*
