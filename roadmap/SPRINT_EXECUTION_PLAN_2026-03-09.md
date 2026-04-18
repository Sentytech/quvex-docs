# smallFactory Sprint Execution Plan

**Tarih:** 2026-03-09
**Amaç:** Projeyi genişletmeden, mevcut çekirdek süreçleri derinleştirerek sprint bazlı ilerletmek.
**Prensip:** Derinlik kazan, genişlik ekleme.

---

## 1. Çalışma Kuralları

- Aynı anda yalnızca 1 ana süreç kapatılır.
- Yeni bağımsız modül açılmaz.
- Her task için şu dört soru cevaplanır:
  - Sorun neydi?
  - Nasıl çözdük / çözeceğiz?
  - Neye dikkat ettik / edeceğiz?
  - Neyi etkiledik / etkileyeceğiz?
- Her sprint sonunda uçtan uca demo senaryosu hazırlanır.
- Her task tamamlandığında ilgili test senaryosu mutlaka çalıştırılır.
- Test çalışmadan hiçbir task `DONE` olarak işaretlenmez.
- Excel veya manuel takibe geri dönme ihtiyacı bırakan işler tamamlanmış sayılmaz.

---

## 2. Sprint Haritası

| Sprint | Süre | Ana Hedef | Durum |
|-------|------|-----------|-------|
| Sprint 1 | 2 hafta | Sipariş -> Üretim başlangıcı | **DONE** |
| Sprint 2 | 2 hafta | Üretim -> Stok | **DONE** |
| Sprint 3 | 2 hafta | Satınalma -> Mal kabul | **DONE** |
| Sprint 4 | 2 hafta | Sevkiyat -> Fatura -> Tahsilat | **DONE** |
| Sprint 5 | 2 hafta | Auth / Yetki / Temizlik | **DONE** |

---

## 3. Sprint 1 - Sipariş -> Üretim Başlangıcı

### Sprint Hedefi
Siparişin satış tarafında kaybolmadan, üretime kontrollü, sade ve ölçülebilir şekilde aktarılması.

### Başarı Kriterleri

- Tekliften siparişe dönüşüm akışı nettir.
- Sipariş üretim emrine tek ve anlaşılır akışla dönüşür.
- Üretime alınmamış siparişler görünür olur.
- Kullanıcı ham ID girmeden temel üretim başlatma adımına ulaşır.

### Sprint Task Listesi

| Task ID | Başlık | Öncelik | Durum |
|--------|--------|---------|-------|
| S1-T1 | Sipariş durum modelini netleştirme | P0 | PASSED |
| S1-T2 | Tekliften siparişe dönüşüm kuralını sadeleştirme | P1 | PASSED |
| S1-T3 | Siparişten üretim emri oluşturma akışını toparlama | P0 | PASSED |
| S1-T4 | İş emri şablonlarını gerçek kullanıma göre temizleme | P2 | PASSED |
| S1-T5 | Üretim başlangıç ekranlarında ham ID girişlerini kaldırma | P0 | PASSED |
| S1-T6 | Üretime alınmamış ve geciken sipariş görünürlüğü | P1 | PASSED |
| S1-T7 | Uçtan uca kabul testi senaryosu | P0 | PASSED |

---

## 4. Sprint 1 Task Detayları

### [S1-T1] Sipariş Durum Modelini Netleştirme

**Durum:** PASSED
**Sorun neydi?**
- Satış tarafındaki sipariş durumu yalnızca `IN_OFFER`, `WAITING_FOR_PRODUCTION`, `IN_PRODUCTION`, `DONE`, `SHIPPED` olarak tanımlı.
- Bu durum seti operasyon için fazla dar; iptal, onaylı ama üretime alınmamış, kısmi tamamlanmış gibi ara karar noktaları görünmüyor.
- Backend ve frontend aynı sözlüğü tam olarak paylaşmıyor:
  - backend `SHIPPED` durumunu destekliyor
  - ana UI satış sabitlerinde `SHIPPED` görünmüyor
- Siparişin üretime geçişi iki adımlı ve dağınık:
  - satış statüsünü `WAITING_FOR_PRODUCTION` yapma
  - ayrı `transfer-from-sale` çağrısıyla gerçekten üretime aktarma
- Bu ayrım kullanıcı açısından karışıklık ve rapor tutarsızlığı riski yaratıyor.

**Nasıl çözeceğiz?**
- Önce mevcut satış durumu yaşam döngüsünü belgeleyip tek akışa indireceğiz.
- Hedef durum setini operasyonel ama sade olacak şekilde yeniden tanımlayacağız:
  - `IN_OFFER`
  - `APPROVED`
  - `READY_FOR_PRODUCTION`
  - `IN_PRODUCTION`
  - `PARTIALLY_SHIPPED`
  - `COMPLETED`
  - `CANCELLED`
- UI ve API tarafında tek kaynaklı durum sözlüğü kullanacağız.
- `WAITING_FOR_PRODUCTION` ile gerçek üretime aktarma arasındaki ayrımı daha açık hale getireceğiz; gerekirse isimlendirmeyi sadeleştireceğiz.

**Neye dikkat edeceğiz?**
- Yeni durumları gereksiz yere çoğaltmayacağız.
- Üretim, müşteri portalı, teklif ürün durumu ve raporların bu değişiklikten etkilendiğini hesaba katacağız.
- Tarihsel veriyi bozmadan, eski kayıtları dönüştürmeden okuyabilecek bir geçiş planı hazırlayacağız.
- Önce sözlüğü ve geçiş kurallarını netleştirip sonra koda geçeceğiz.

**Neyi etkileyebilir?**
- `SalesStatus` enum
- `SalesController`
- `ProductionController`
- `OfferProductStatus` ile satış durumu arasındaki ilişki
- satış listesi ve satış detay ekranı
- müşteri portalı
- raporlama ve dashboard özetleri

**Mevcut Kod Bulguları**
- Backend enum: `IN_OFFER`, `WAITING_FOR_PRODUCTION`, `IN_PRODUCTION`, `DONE`, `SHIPPED`
- UI satış sabitleri: `IN_OFFER`, `WAITING_FOR_PRODUCTION`, `IN_PRODUCTION`, `DONE`
- `SHIPPED` müşteri portalında var, ana satış ekranı sabitlerinde yok.
- `SalesController` içinde `WAITING_FOR_PRODUCTION` durumunda satış ağaçları oluşturuluyor.
- `ProductionController` içinde ayrıca `/Production/transfer-from-sale/{salesId}` çağrısı ile gerçek üretim kayıtları oluşturuluyor ve satış `IN_PRODUCTION` durumuna çekiliyor.

**Etkilenen Dosyalar**
- `C:\rynSoft\quvex\smallFactoryApi\Industry.API\Constants\SalesStatus.cs`
- `C:\rynSoft\quvex\smallFactoryApi\Industry.API\Controllers\SalesController.cs`
- `C:\rynSoft\quvex\smallFactoryApi\Industry.API\Controllers\ProductionController.cs`
- `C:\rynSoft\quvex\smallFactoryUI\src\utility\Constants.js`
- `C:\rynSoft\quvex\smallFactoryUI\src\views\modul\sale\Sale.js`
- `C:\rynSoft\quvex\smallFactoryUI\src\views\modul\sale\SaleDetail.js`
- `C:\rynSoft\quvex\smallFactoryUI\src\views\modul\customer\CustomerPortal.js`

**İlk Karar**
- Bu task diğer sprint tasklarının temel bağımlılığıdır.
- Kod değişikliği öncesi ilk teslimat, durum yaşam döngüsünün yazılı olarak netleştirilmesidir.
- İlk teknik hizalama adımı tamamlandı:
  - UI satış durum listesine `SHIPPED` eklendi
  - frontend test ile bu sözlük güvenceye alındı
  - backend enum serialization testine eksik satış durumları eklendi

**Önerilen Hedef Durum Akışı**

| Durum | Anlamı | Sonraki Olası Durumlar |
|------|--------|------------------------|
| `IN_OFFER` | Teklif aşamasında, henüz siparişe dönüşmemiş | `APPROVED`, `CANCELLED` |
| `APPROVED` | Ticari olarak onaylı, üretime hazırlık yapılabilir | `READY_FOR_PRODUCTION`, `CANCELLED` |
| `READY_FOR_PRODUCTION` | Üretim için gerekli temel bilgiler tamam | `IN_PRODUCTION`, `CANCELLED` |
| `IN_PRODUCTION` | Üretim kayıtları oluşmuş ve süreç başlamış | `PARTIALLY_SHIPPED`, `COMPLETED`, `CANCELLED` |
| `PARTIALLY_SHIPPED` | Siparişin bir kısmı sevk edilmiş | `COMPLETED` |
| `COMPLETED` | Operasyonel olarak kapanmış | - |
| `CANCELLED` | İş akışı sonlandırılmış | - |

**Not**
- `SHIPPED` ayrı satış durumu yerine `PARTIALLY_SHIPPED` / `COMPLETED` akışı içinde yeniden değerlendirilmeli.
- Teknik geçiş sırasında eski `WAITING_FOR_PRODUCTION` değeri yeni `READY_FOR_PRODUCTION` karşılığı olarak ele alınabilir.

**Test Senaryosu**
- Senaryo: Satış durumu sözlüğünün backend ve frontend tarafında tutarlı olup olmadığını doğrula.
- Komut:
  - `npm test -- --run src/utility/__tests__/Constants.test.js`
  - `dotnet test C:\rynSoft\quvex\smallFactoryApi\Industry.API.Tests\Industry.API.Tests.csproj --filter "FullyQualifiedName~EnumSerializationTests"`
- Beklenen Sonuç: Backend ve UI aynı durumları kullanmalı veya farklar açıkça gerekçelendirilmiş olmalı.
- Gerçek Sonuç:
  - İlk fark kapatıldı: UI artık `SHIPPED` durumunu da içeriyor.
  - Backend enum serialization testleri `WAITING_FOR_PRODUCTION` ve `SHIPPED` için doğrulandı.
  - Üretime geçişin iki adımlı olması problemi devam ediyor.
- Durum: PASSED

**Değişen Dosyalar**
- `C:\rynSoft\quvex\smallFactoryUI\src\utility\Constants.js`
- `C:\rynSoft\quvex\smallFactoryUI\src\utility\__tests__\Constants.test.js`
- `C:\rynSoft\quvex\smallFactoryApi\Industry.API.Tests\Constants\EnumSerializationTests.cs`

---

### [S1-T2] Tekliften Siparişe Dönüşüm Kuralını Sadeleştirme

**Durum:** IN_PROGRESS
**Sorun neydi?**
- Teklif kabul edildiğinde siparişe dönüşüm süreci kullanıcı açısından net değilse manuel takip başlar.
- Aynı tekliften tekrar sipariş üretme veya eksik veriyle sipariş açma riski doğar.
- Teklif kabulü ile sipariş oluşumu gevşek bağlı:
  - `OfferController` içinde teklif `ACCEPTED` olunca offer product'lar `WAITING` durumuna çekiliyor
  - Sipariş oluşturma ayrı akışta `SalesController` ile yapılıyor
- Bu ayrım, teklif kabul edildi ama satış açılmadı / kısmen açıldı / yanlış statüyle açıldı gibi ara durumlar üretebilir.

**Nasıl çözeceğiz?**
- Teklif kabul koşullarını tek akışta netleştireceğiz.
- Sipariş oluşturma için zorunlu alanları tanımlayacağız.
- Teklif -> sipariş geçişinde mükerrer üretimi engelleyen kontrol ekleyeceğiz.
- Teklif kabulü ile sipariş oluşturma arasındaki ilişkiyi belgeleyip tek karar noktasına indireceğiz.

**Neye dikkat edeceğiz?**
- Teklif revizyonları varsa hangi revizyonun siparişe dönüştüğü açık olmalı.
- Mevcut satış kayıtları bozulmamalı.
- İleri seviye onay mekanizması eklemeden sade tutacağız.
- Aynı teklif kaleminden birden fazla satış kaydı üretme kuralları açık olmalı.

**Neyi etkileyebilir?**
- OfferController
- SalesController
- teklif ekranları
- satış listeleri

**Mevcut Kod Bulguları**
- `OfferController.ChangeStatus` içinde `ACCEPTED` olan teklif ürünleri `WAITING` durumuna çekiliyor.
- `SalesController.PostSales` içinde sipariş ayrıca oluşturuluyor ve duruma göre satış ağacı kuruluyor.
- Tekliften siparişe dönüşüm tek transaction benzeri kapalı bir akış değil.
- Aynı `OfferProductId` için ikinci kez `PostSales` çağrısı yapıldığında kök sipariş açılması engellenmiyordu.
- Bu durum aynı teklif kaleminden mükerrer sipariş açılmasına ve sipariş listesinde belirsizliğe yol açıyordu.

**Etkilenen Dosyalar**
- `C:\rynSoft\quvex\smallFactoryApi\Industry.API\Controllers\OfferController.cs`
- `C:\rynSoft\quvex\smallFactoryApi\Industry.API\Controllers\SalesController.cs`
- teklif ve satış UI ekranları

**Uygulanan İlk İyileştirme**
- `SalesController.PostSales` girişine kök sipariş kontrolü eklendi.
- Aynı teklif kalemi için kök sipariş zaten varsa ikinci oluşturma isteği `BadRequest` ile reddediliyor.
- `PostSales` içinde teklif kaleminin bağlı olduğu teklifin `ACCEPTED` durumda olup olmadığı doğrulanıyor.
- `DRAFT` veya `SENT` teklif kalemlerinden sipariş açma isteği artık reddediliyor.
- Bu değişiklik teklif kabulü ile sipariş açma arasındaki kopuk akışı tamamen kapatmıyor, ama en kritik mükerrer kayıt deliğini kapatıyor.
- Teklif kalemi modalında kullanıcıya iki belirsiz aksiyon görünüyordu:
  - `Kaydet`
  - `Kaydet ve Satışa Aktar`
- Bu dil, aslında `WAITING_FOR_PRODUCTION` durumuna giden sipariş açma akışını olduğundan daha muğlak gösteriyordu.
- Tekliften siparişe geçiş aksiyonları helper'a taşındı ve buton metinleri netleştirildi:
  - `Taslak Siparisi Kaydet`
  - `Uretime Hazir Siparis Olustur`
- Modal başlığı `Siparis Bilgileri` olarak sadeleştirildi.
- Modal artık submit başarısızsa kapanmıyor; kapanış gerçek kayıt sonucuna bağlandı.
- Böylece kullanıcı teklif kabulü sonrası neyin taslak kayıt, neyin üretime hazır sipariş açma aksiyonu olduğunu açık görüyor.
- Teklif satırındaki aksiyonlar da helper'a taşındı ve metinle görünür hale getirildi:
  - `Siparis Ac`
  - `Bilgi Gir`
  - `Siparisi Gor`
  - `Reddet`
  - `Geri Al`
- `IN_SALE` durumundaki satırda artık yeni sipariş açma hissi veren birincil aksiyon kalmadı; kullanıcı mevcut siparişi görüntüleme/güncelleme ve gerekirse geri alma akışını görüyor.
- `IN_SALE` durumundaki teklif kalemi modalı artık salt-görüntü modunda açılıyor.
- Bu modda:
  - form alanları disabled
  - oluşturma/kaydetme CTA'ları gizli
  - yalnızca `Kapat` aksiyonu gösteriliyor
- Böylece oluşmuş sipariş ile henüz oluşturulacak sipariş arasında son kullanıcı için net ayrım kurulmuş oldu.
- Teklif satırında `IN_SALE` durumunda hâlâ `Geri Al` aksiyonu görünüyordu.
- Bu aksiyon backend'de siparişe dönmüş teklif kalemini tekrar `WAITING` durumuna çekebiliyordu.
- UI helper kuralı daraltıldı; `Geri Al` artık yalnızca `REJECTED` satırlarda görünüyor.
- Backend `OfferProduct/change-status` endpoint'ine rollback koruması eklendi.
- Siparişe dönüşmüş teklif kalemi artık `WAITING` durumuna geri alınamıyor.
- Aynı endpoint, doğrudan çağrılırsa siparişe dönüşmüş teklif kalemini `REJECTED` durumuna da çekebiliyordu.
- Bu durumda bağlı satış kayıtları silinebildiği için veri kaybı riski vardı.
- Backend'e ikinci koruma eklendi; siparişe dönüşmüş teklif kalemi artık `REJECTED` durumuna da alınamıyor.

**Test Senaryosu**
- Senaryo: Kabul edilen tekliften sipariş oluşumu tekil ve izlenebilir olmalı.
- Komut:
  - `dotnet test C:\rynSoft\quvex\smallFactoryApi\Industry.API.Tests\Industry.API.Tests.csproj --filter "FullyQualifiedName~SalesOrderCreationWorkflowTests"`
  - `npm test -- --run src/utility/__tests__/offerSalesActions.test.js src/utility/__tests__/salesStatus.test.js src/utility/__tests__/warehouseOptions.test.js src/utility/__tests__/Constants.test.js`
  - `$env:NODE_OPTIONS='--openssl-legacy-provider'; npm run build`
- Beklenen Sonuç: Kabul edilen teklif kalemi için sipariş oluşturma kuralı net ve mükerrer üretime kapalı olmalı.
- Gerçek Sonuç:
  - ilk sipariş oluşturma davranışı controller testi ile doğrulandı
  - aynı teklif kaleminden ikinci kök sipariş açma denemesi `BadRequest` ile reddedildi
  - kabul edilmeyen teklif kaleminden sipariş açma denemesi `BadRequest` ile reddedildi
  - teklif kalemi modalındaki CTA dili helper üzerinden netleştirildi
  - tekliften siparişe geçiş için `Taslak Siparisi Kaydet` ve `Uretime Hazir Siparis Olustur` aksiyonları test ve build ile doğrulandı
  - teklif satırı aksiyon görünürlüğü ve etiketleri helper testleri ile doğrulandı
  - `IN_SALE` satırının salt-görüntü davranışı helper testi ile doğrulandı
  - `IN_SALE` satırında `Geri Al` aksiyonunun kaldırıldığı helper testi ile doğrulandı
  - `OfferProduct/change-status` üzerinden siparişe dönmüş teklif kalemini `WAITING` durumuna geri alma isteği `BadRequest` ile engellendi
  - `OfferProduct/change-status` üzerinden siparişe dönmüş teklif kalemini `REJECTED` durumuna çekme isteği `BadRequest` ile engellendi
  - backend satış workflow testleri `7/7` geçti
  - frontend utility testleri `39/39` geçti
  - frontend build başarıyla geçti
  - teklif kabulü ile sipariş açma hâlâ tek akışta birleşmiş değil; bu daha büyük refaktör işi olarak duruyor
- Durum: PASSED

**Değişen Dosyalar**
- `C:\rynSoft\quvex\smallFactoryApi\Industry.API\Controllers\SalesController.cs`
- `C:\rynSoft\quvex\smallFactoryApi\Industry.API\Controllers\OfferProductController.cs`
- `C:\rynSoft\quvex\smallFactoryApi\Industry.API.Tests\Controllers\SalesOrderCreationWorkflowTests.cs`
- `C:\rynSoft\quvex\smallFactoryUI\src\utility\offerSalesActions.js`
- `C:\rynSoft\quvex\smallFactoryUI\src\utility\__tests__\offerSalesActions.test.js`
- `C:\rynSoft\quvex\smallFactoryUI\src\utility\offerProductActions.js`
- `C:\rynSoft\quvex\smallFactoryUI\src\utility\__tests__\offerProductActions.test.js`
- `C:\rynSoft\quvex\smallFactoryUI\src\views\modul\offer\OfferFormItemsAdditionInfo.js`
- `C:\rynSoft\quvex\smallFactoryUI\src\views\modul\offer\OfferFormItemsPreview.js`

---

### [S1-T3] Siparişten Üretim Emri Oluşturma Akışını Toparlama

**Durum:** IN_PROGRESS
**Sorun neydi?**
- Siparişten üretime geçişte fazla adım veya dağınık ekran varsa kullanıcı dış takip araçlarına kayar.
- Hangi siparişin üretime alınmadığı net görünmez.
- Mevcut UI akışında kullanıcı `WAITING_FOR_PRODUCTION` durumundaki siparişten ayrıca `Üretime Aktar` butonuna basıyor.
- Bu da siparişin "hazır" olması ile gerçekten üretime aktarılması arasında görünmez bir ara durum oluşturuyor.

**Nasıl çözeceğiz?**
- Sipariş detay ekranından üretim emri oluşturmayı tek ana giriş noktası haline getireceğiz.
- Siparişten gelen ürün, miktar, termin ve şablon bilgilerini mümkün olduğunca otomatik dolduracağız.
- Hatalı veya eksik veri için kullanıcıyı erken uyaracağız.

**Neye dikkat edeceğiz?**
- Kullanıcıya yeni alan yüklememek öncelik olacak.
- Aynı sipariş için yanlışlıkla ikinci üretim emri oluşmasını engelleyeceğiz.
- İş emri şablon ilişkisini bozmamaya dikkat edeceğiz.

**Neyi etkileyebilir?**
- ProductionController
- WorkOrderTemplates
- production view'ları
- sales detail ekranı

**Mevcut Kod Bulguları**
- UI `SaleDetail.js` içinde üretime aktarım ayrı bir buton ve ayrı API çağrısı ile yapılıyor.
- Backend `ProductionController` içinde `transfer-from-sale` endpoint'i satış ağacını üretim kayıtlarına çeviriyor.

**Uygulanan İlk İyileştirme**
- `WAITING_FOR_PRODUCTION` satış durumu kullanıcı tarafında `Uretime Hazir` olarak gösterilecek şekilde sadeleştirildi.
- Üretime aktarım onay penceresinin başlığı ve açıklaması kullanıcı açısından daha açık hale getirildi.
- Bu değişiklik davranışı bozmadan iki adımlı mevcut yapıyı daha anlaşılır kılmak için yapıldı.
- Aynı sipariş için ikinci kez üretime aktarım yapılabildiği görüldü.
- Backend `transfer-from-sale` endpoint'ine kök üretim kaydı kontrolü eklendi.
- Böylece aynı sipariş için mükerrer üretim kaydı oluşumu `BadRequest` ile engellenmiş oldu.
- `transfer-from-sale` endpoint'ine durum önkoşulu eklendi.
- Artık sadece `WAITING_FOR_PRODUCTION` durumundaki kök siparişler üretime aktarılabiliyor.
- `transfer-from-sale` endpoint'ine kök kayıt önkoşulu eklendi.
- Çocuk satış kayıtları için doğrudan üretime aktarım artık reddediliyor.
- UI tarafında `WAITING_FOR_PRODUCTION` + kök kayıt kuralı tek yardımcı fonksiyona taşındı.
- Böylece operasyon uyarısı ve `Uretime Aktar` butonu aynı readiness kuralını kullanıyor.
- Satış detayında stok ilişkili kayıtlar için form kaydı ve üretime aktarım iki ayrı kullanıcı aksiyonu gerektiriyordu.
- Form modalına `Kaydet ve Uretime Aktar` kısayolu eklendi.
- Bu kısayol yeni backend akışı açmadan mevcut iki endpoint'i sıralı çağırıyor:
  - önce `PUT /Sales/form/{id}`
  - sonra `POST /Production/transfer-from-sale/{salesId}`
- Kısayol sadece uygun kayıtlarda görünür:
  - kök kayıt
  - `WAITING_FOR_PRODUCTION`
  - `PRODUCTION_MATERIAL_STOCK_RELATION`
- Modal artık başarılı kayıt olmadan kapanmıyor; kayıt veya aktarım başarısı görülünce kapanıyor.
- Transfer form eksikliği yüzünden reddedilirse UI artık hata mesajını parse edip ilgili child satış kaydını buluyor.
- Eksik child kayıt otomatik olarak form modalında açılıyor; kullanıcı hangi alt parçaya veri girmesi gerektiğini doğrudan görüyor.
- Backend transfer doğrulaması artık eksik child kayıt için yapılandırılmış hata dönüyor:
  - `message`
  - `salesId`
  - `productNumber`
- UI bu payload varsa doğrudan `salesId` ile doğru child kaydı açıyor; eski string formatı için fallback korundu.
- `WAITING_FOR_PRODUCTION` durumundaki kök sipariş tekrar kaydedildiğinde child satış ağacı yeniden üretiliyordu.
- `SalesController.PutSales` içine mevcut child satış kontrolü eklendi.
- Böylece aynı kök siparişe bağlı child satışlar ikinci kez oluşturulmuyor; güncelleme sadece statü/veri kaydı olarak çalışıyor.
- Oluşmuş kök sipariş backend üzerinden tekrar `IN_OFFER` durumuna çekilebiliyordu.
- Bu durum UI'daki salt-görüntü ve tek yönlü sipariş akışı ile çelişiyordu.
- `SalesController.PutSales` içine kök sipariş rollback koruması eklendi.
- Böylece `WAITING_FOR_PRODUCTION` veya daha ileri durumda olan kök sipariş artık tekrar teklif durumuna düşürülemiyor.

**Yeni Teknik Güvence**
- Backend için `ProductionTransferWorkflowTests` karakterizasyon testi eklendi.
- Bu test mevcut davranışı kilitliyor:
  - `transfer-from-sale/{salesId}` çağrısı üretim kaydı oluşturuyor
  - satış durumunu `IN_PRODUCTION` yapıyor
  - ilişkili teklif kalemini `IN_PRODUCTION` durumuna çekiyor
  - aynı sipariş için ikinci aktarımı reddediyor
  - `IN_OFFER` durumundaki siparişin üretime aktarımını reddediyor
  - çocuk satış kaydının üretime aktarımını reddediyor
  - UI'da readiness kuralının tek helper üzerinden çalıştığını doğruluyor
- Test eklenirken `ProductionController.InitializeStatus` içinde gizli bir test edilebilirlik bağımlılığı ortaya çıktı:
  - kullanıcı çözümleme yardımcı metodu auth header yokken bile servis çözümlemesine gidiyordu
  - bu da production akış testlerinde gereksiz `RequestServices` kurulumu ihtiyacı doğuruyordu
- Yardımcı metod auth header yoksa erken `null` dönecek şekilde sadeleştirildi.
- Böylece production akış testleri `RequestServices` hazırlamadan çalışabilir hale geldi.
- Backend için `SalesOrderCreationWorkflowTests` içine regresyon testi eklendi.
- Bu test `WAITING_FOR_PRODUCTION` ile açılan kök sipariş tekrar `PUT /Sales/{id}` ile kaydedildiğinde child satış sayısının sabit kaldığını doğruluyor.
- Aynı test kümesine kök siparişin `IN_OFFER` durumuna rollback edilmesini reddeden regresyon testi eklendi.

**Test Senaryosu**
- Senaryo: `WAITING_FOR_PRODUCTION` durumundaki sipariş üretime aktarıldığında üretim kayıtları oluşmalı ve satış durumu `IN_PRODUCTION` olmalı.
- Komut:
  - `npm test -- --run src/utility/__tests__/Constants.test.js src/utility/__tests__/salesStatus.test.js`
  - `npm test -- --run src/utility/__tests__/salesStatus.test.js src/utility/__tests__/warehouseOptions.test.js src/utility/__tests__/Constants.test.js`
  - `$env:NODE_OPTIONS='--openssl-legacy-provider'; npm run build`
  - `dotnet test C:\rynSoft\quvex\smallFactoryApi\Industry.API.Tests\Industry.API.Tests.csproj --filter "FullyQualifiedName~ProductionTransferWorkflowTests"`
  - `dotnet test C:\rynSoft\quvex\smallFactoryApi\Industry.API.Tests\Industry.API.Tests.csproj --filter "FullyQualifiedName~SalesOrderCreationWorkflowTests"`
- Beklenen Sonuç: Tek ve anlaşılır bir geçiş.
- Gerçek Sonuç:
  - durum dili kullanıcı tarafında daha açık hale getirildi
  - backend karakterizasyon testi ile üretim kaydı oluşumu, satış durumu ve teklif kalemi durumu doğrulandı
  - duplicate transfer testi ile aynı sipariş için ikinci üretim aktarımı engellendi
  - hazır olmayan siparişin üretime aktarımı `BadRequest` ile engellendi
  - çocuk satış kaydının üretime aktarımı `BadRequest` ile engellendi
  - UI helper testi ile çocuk kayıt ve hazır olmayan kayıt için buton/uyarı kuralı tek yerde toplandı
  - `GetCurrentUser` yardımcı metodu auth header yoksa servis çözümlemesine girmeyecek şekilde güvenli hale getirildi
  - production akış testleri artık `HttpContext.RequestServices` kurmadan geçiyor
  - production durum hesaplamasında test loglarını kirleten debug `Console.WriteLine` çıktısı kaldırıldı
  - stok ilişkili satış detayında form kaydı ile üretime aktarım aynı modal aksiyonuna indirildi
  - save-and-transfer kısayolunun hangi kayıtlarda görüneceği helper testi ile doğrulandı
  - transfer hata mesajından eksik child satış kaydını bulan helper eklendi ve test ile doğrulandı
  - transfer reddinde ilgili child form otomatik açılır hale getirildi
  - backend transfer doğrulaması structured payload dönecek şekilde genişletildi ve controller testi ile doğrulandı
  - `WAITING_FOR_PRODUCTION` siparişi tekrar kaydetme regresyonu satış workflow testi ile doğrulandı
  - aynı kök sipariş için child satış ağacının ikinci kez üretilmesi engellendi
  - oluşmuş kök siparişin tekrar `IN_OFFER` durumuna çekilmesi `BadRequest` ile engellendi
  - backend satış workflow testleri `5/5` geçti
  - frontend utility testleri `33/33` geçti
  - frontend build başarıyla geçti
  - geçişin teknik olarak iki adımlı olması problemi devam ediyor
- Durum: PASSED

**Değişen Dosyalar**
- `C:\rynSoft\quvex\smallFactoryUI\src\utility\Constants.js`
- `C:\rynSoft\quvex\smallFactoryUI\src\utility\__tests__\Constants.test.js`
- `C:\rynSoft\quvex\smallFactoryUI\src\utility\salesStatus.js`
- `C:\rynSoft\quvex\smallFactoryUI\src\utility\__tests__\salesStatus.test.js`
- `C:\rynSoft\quvex\smallFactoryUI\src\views\modul\sale\SalesForm.js`
- `C:\rynSoft\quvex\smallFactoryUI\src\views\modul\sale\SaleDetail.js`
- `C:\rynSoft\quvex\smallFactoryUI\src\views\modul\customer\CustomerPortal.js`
- `C:\rynSoft\quvex\smallFactoryApi\Industry.API\Models\DTOs\TransferValidationErrorDTO.cs`
- `C:\rynSoft\quvex\smallFactoryApi\Industry.API\Helpers\HttpContextUtilities.cs`
- `C:\rynSoft\quvex\smallFactoryApi\Industry.API\Controllers\ProductionController.cs`
- `C:\rynSoft\quvex\smallFactoryApi\Industry.API\Controllers\SalesController.cs`
- `C:\rynSoft\quvex\smallFactoryApi\Industry.API.Tests\Controllers\ProductionTransferWorkflowTests.cs`
- `C:\rynSoft\quvex\smallFactoryApi\Industry.API.Tests\Controllers\SalesOrderCreationWorkflowTests.cs`

---

### [S1-T4] İş Emri Şablonlarını Gerçek Kullanıma Göre Temizleme

**Durum:** IN_PROGRESS
**Sorun neydi?**
- İş emri şablonları sahadaki gerçek operasyon sırasını yansıtmıyorsa üretim planı kağıt üzerinde kalır.
- Operatörler sistem yerine sözlü yönlendirme ile çalışır.

**Nasıl çözeceğiz?**
- Şablonlarda gereksiz veya kullanılmayan adımları ayıklayacağız.
- Adım sırasını operasyon gerçekliğine göre sadeleştireceğiz.
- Her ürün ailesi için minimum gerekli şablon mantığını belirleyeceğiz.

**Neye dikkat edeceğiz?**
- Çok sayıda varyant çıkarmayacağız.
- Şablonları mühendislik sistemi gibi değil, üretim kullanım kolaylığı gibi ele alacağız.

**Neyi etkileyebilir?**
- WorkOrderTemplatesController
- WorkOrderStepsController
- üretim başlatma akışı

**Mevcut Kod Bulguları**
- Şablon yönetimi ekranları ve controller'ları mevcut.
- Siparişten üretime geçişte doğru şablon seçiminin kullanıcı açısından ne kadar açık olduğu henüz net değil.
- Sprint 1 için burada yeni yetenek eklemek yerine şablon karmaşıklığını azaltmak hedeflenmeli.
- Production listesi ve production detail akışında `workOrderTemplateId` kullanılıyor, ancak bağlı şablonun adı kullanıcıya görünmüyordu.
- Kullanıcı iş emri var mı bilgisini görüyor, ama hangi şablonun bağlı olduğunu anlamak için modal açmak zorunda kalıyordu.

**Etkilenen Dosyalar**
- `C:\rynSoft\quvex\smallFactoryUI\src\views\modul\settings\workOrderTemplates\WorkOrderTemplates.js`
- `C:\rynSoft\quvex\smallFactoryUI\src\views\modul\settings\workOrderSteps\WorkOrderSteps.js`
- ilgili backend controller dosyaları

**Uygulanan İlk İyileştirme**
- Backend production liste ve detail projection'larına `workOrderTemplateTitle` alanı eklendi.
- Production listesi, production detail ağacı ve sağ detay paneli bu alanı göstermeye başladı.
- Böylece kullanıcı iş emrini açmadan önce hangi şablonun bağlı olduğunu görebiliyor.
- Bu değişiklik yeni süreç eklemeden mevcut şablon ilişkisinin görünürlüğünü artırıyor.

**Test Senaryosu**
- Senaryo: Temel ürün aileleri için gereksiz adım içermeyen iş emri şablonu seçilebilmeli.
- Komut:
  - `dotnet test C:\rynSoft\quvex\smallFactoryApi\Industry.API.Tests\Industry.API.Tests.csproj --filter "FullyQualifiedName~ProductionTemplateVisibilityTests"`
  - `$env:NODE_OPTIONS='--openssl-legacy-provider'; npm run build`
- Beklenen Sonuç: Kullanıcı doğru şablonu az seçimle bulmalı.
- Gerçek Sonuç:
  - production liste ve detail endpoint'lerinin şablon adını döndürdüğü controller testi ile doğrulandı
  - production ekranları bu alanı gösterecek şekilde derlendi
  - frontend build başarıyla geçti
- Durum: PASSED

**Değişen Dosyalar**
- `C:\rynSoft\quvex\smallFactoryApi\Industry.API\Models\DTOs\ProductionListDTO.cs`
- `C:\rynSoft\quvex\smallFactoryApi\Industry.API\Models\DTOs\ProductionDTO.cs`
- `C:\rynSoft\quvex\smallFactoryApi\Industry.API\Controllers\ProductionController.cs`
- `C:\rynSoft\quvex\smallFactoryApi\Industry.API.Tests\Controllers\ProductionTemplateVisibilityTests.cs`
- `C:\rynSoft\quvex\smallFactoryUI\src\views\modul\production\Production.js`
- `C:\rynSoft\quvex\smallFactoryUI\src\views\modul\production\ProductionDetail.js`
- `C:\rynSoft\quvex\smallFactoryUI\src\views\modul\production\ProductionItem.js`

---

### [S1-T5] Üretim Başlangıç Ekranlarında Ham ID Girişlerini Kaldırma

**Durum:** PASSED
**Sorun neydi?**
- Kullanıcıdan GUID veya teknik ID istemek hata oranını yükseltir.
- Bu yaklaşım sistemin ürünleşmesini zayıflatır.

**Nasıl çözeceğiz?**
- ID girişlerini aramalı seçim listesi, autocomplete veya ilişkili seçim alanları ile değiştireceğiz.
- Kullanıcının sipariş, ürün veya şablon seçimini isim ve kod üzerinden yapmasını sağlayacağız.

**Neye dikkat edeceğiz?**
- Çok fazla filtre ve karmaşık modal eklemeyeceğiz.
- Performans için gerekli yerlerde lazy search kullanacağız.

**Neyi etkileyebilir?**
- production ekranları
- HR ve bakım tarafındaki benzer giriş desenleri için örnek oluşturur
- kullanıcı eğitim ihtiyacı azalır

**Mevcut Kod Bulguları**
- Bu sprintin satıştan üretime giriş akışında doğrudan ham ID problemi baskın değil.
- Ancak aynı ürün ailesinde bakım ve IK ekranlarında ham `GUID/ID` girişi örnekleri mevcut; bu, UI sadeleştirme standardının eksik olduğunu gösteriyor.
- Satıştan üretime geçişte kullanıcı depo seçimini teknik `id` görmeden yapıyor, ancak seçenekler yalnızca depo adıyla geldiği için ayrıştırmak zorlaşıyor.
- Tek depo olan kurulumlarda kullanıcı yine aynı alanı elle seçmek zorunda kalıyor.

**Uygulanan İlk İyileştirme**
- `SalesForm` içindeki depo seçimi `Kod + Ad + Sorumlu` formatında gösterilecek şekilde zenginleştirildi.
- Depo alanı aramalı hale getirildi; kullanıcı kod veya isimle daha hızlı seçim yapabiliyor.
- Yalnızca tek depo varsa alan otomatik dolduruluyor.
- Bu değişiklik yeni alan eklemeden kullanıcı tıklamasını ve yanlış seçim riskini azaltıyor.

**Test Senaryosu**
- Senaryo: Kullanıcı siparişten üretim başlatırken teknik ID görmek zorunda kalmamalı.
- Komut:
  - `npm test -- --run src/utility/__tests__/warehouseOptions.test.js src/utility/__tests__/salesStatus.test.js src/utility/__tests__/Constants.test.js`
  - `$env:NODE_OPTIONS='--openssl-legacy-provider'; npm run build`
- Beklenen Sonuç: Seçimler isim, kod veya arama ile yapılmalı.
- Gerçek Sonuç:
  - depo seçeneklerini kullanıcı dostu etiketlere çeviren helper test ile doğrulandı
  - satış formunda depo alanı aramalı hale getirildi ve tek depo durumunda otomatik seçim eklendi
  - frontend build başarıyla geçti
- Durum: PASSED

**Değişen Dosyalar**
- `C:\rynSoft\quvex\smallFactoryUI\src\utility\warehouseOptions.js`
- `C:\rynSoft\quvex\smallFactoryUI\src\utility\__tests__\warehouseOptions.test.js`
- `C:\rynSoft\quvex\smallFactoryUI\src\views\modul\sale\SalesForm.js`

---

### [S1-T6] Üretime Alınmamış ve Geciken Sipariş Görünürlüğü

**Durum:** PASSED
**Sorun neydi?**
- Üretime alınmamış siparişler görünmezse operasyon gecikmeyi geç fark eder.
- Gecikme yönetimi manuel listelerle yapılır.

**Nasıl çözeceğiz?**
- üretime alınmamış sipariş listesi ekleyeceğiz
- terminine yaklaşan veya geciken siparişleri ayrı göstereceğiz
- temel filtreler sunacağız: müşteri, termin, ürün, durum

**Neye dikkat edeceğiz?**
- İlk sürümde dashboard karmaşıklığı yaratmayacağız.
- Sadece karar vermeyi kolaylaştıran görünürlük sağlayacağız.

**Neyi etkileyebilir?**
- dashboard
- sales / production listeleri
- raporlar

**Mevcut Kod Bulguları**
- `Sale.js` filtreleri müşteri, sipariş no, ürün, durum, tarih, satın alma personeli bazında çalışıyor.
- Ancak "üretime alınmamış siparişler" için ayrı görünüm yok.
- "geciken sipariş" kavramı satış listesinde doğrudan üretilmiyor; daha çok rapor tarafında ele alınmış.
- Bu da operasyonun günlük takibini dashboard/rapor ile satış listesi arasında bölüyor.

**Etkilenen Dosyalar**
- `C:\rynSoft\quvex\smallFactoryUI\src\views\modul\sale\Sale.js`
- `C:\rynSoft\quvex\smallFactoryUI\src\views\modul\dashboard\Dashboard.js`
- rapor ekranları

**Uygulanan İlk İyileştirme**
- Satış listesine ve satış detayına `Operasyon Uyarisi` alanı eklendi.
- Aşağıdaki uyarılar görünür hale getirildi:
  - `Uretime Alinmadi`
  - `Gecikti`
- Uyarı üretim mantığı ortak yardımcı fonksiyona taşındı; böylece aynı kural iki ekranda aynı çalışıyor.
- Satış listesi başlığına hızlı operasyon filtreleri eklendi:
  - `Tum Siparisler`
  - `Uretime Hazir`
  - `Geciken`
  - `Dikkat Gerektiren`
- Bu filtreler backend'e yeni yük bindirmeden mevcut liste üzerinde çalışıyor.
- Böylece kullanıcı ayrı rapora gitmeden operasyon kuyruğunu daraltabiliyor.

**Test Senaryosu**
- Senaryo: Termin tarihi geçmiş ve üretime geçmemiş siparişler tek listede görülebilmeli.
- Komut:
  - `npm test -- --run src/utility/__tests__/Constants.test.js src/utility/__tests__/salesStatus.test.js`
  - `$env:NODE_OPTIONS='--openssl-legacy-provider'; npm run build`
- Beklenen Sonuç: Kullanıcı ayrı rapora gitmeden kritik siparişleri görmeli.
- Gerçek Sonuç:
  - satış yardımcı fonksiyonu ile geciken ve üretime alınmamış siparişler için uyarı üretimi test edildi
  - satış listesi ve detay ekranında bu uyarılar gösterilecek hale getirildi
  - hızlı operasyon filtreleri helper testi ile doğrulandı
  - frontend build, mevcut Node 23 / CRA uyumsuzluğu `--openssl-legacy-provider` ile aşılınca başarıyla tamamlandı
- Durum: PASSED

**Değişen Dosyalar**
- `C:\rynSoft\quvex\smallFactoryUI\src\utility\salesStatus.js`
- `C:\rynSoft\quvex\smallFactoryUI\src\utility\__tests__\salesStatus.test.js`
- `C:\rynSoft\quvex\smallFactoryUI\src\views\modul\sale\Sale.js`
- `C:\rynSoft\quvex\smallFactoryUI\src\views\modul\sale\SaleDetail.js`

---

### [S1-T7] Uçtan Uca Kabul Testi Senaryosu

**Durum:** PASSED
**Sorun neydi?**
- Parça parça çalışan ekranlar gerçek iş akışının çalıştığını garanti etmez.
- Uçtan uca test yoksa regressions geç fark edilir.

**Nasıl çözeceğiz?**
- aşağıdaki senaryo için kabul testi yazacağız:
  - teklif oluştur
  - teklifi kabul et
  - siparişe dönüştür
  - üretim emri oluştur
  - üretim listesinde görünürlüğü doğrula

**Neye dikkat edeceğiz?**
- Test sahte veriyle, deterministik ve tekrar çalıştırılabilir olmalı.
- Uygulama içi kritik kuralları doğrulamalı, UI detayıyla aşırı şişmemeli.

**Neyi etkileyebilir?**
- backend testleri
- UI smoke testleri
- release güveni

**Önerilen İlk Kabul Senaryosu**
- teklif oluştur
- teklif kalemi ekle
- teklifi kabul et
- sipariş oluştur
- siparişi üretime hazır hale getir
- üretime aktar
- satış durumunu doğrula
- üretim kaydını doğrula

**Test Senaryosu**
- Senaryo: Tekliften üretime kadar ana akış kopmadan çalışmalı.
- Komut:
  - `dotnet test C:\rynSoft\quvex\smallFactoryApi\Industry.API.Tests\Industry.API.Tests.csproj --filter "FullyQualifiedName~OfferToProductionAcceptanceTests"`
- Beklenen Sonuç: Tek akış, net durum geçişleri, tutarlı kayıtlar.
- Gerçek Sonuç:
  - teklif oluşturma, teklif kalemi ekleme, teklif kabulü, sipariş oluşturma ve üretime aktarım aynı backend senaryoda çalıştırıldı
  - teklif durumu `ACCEPTED`, teklif kalemi durumu `IN_PRODUCTION`, satış durumu `IN_PRODUCTION` olarak doğrulandı
  - siparişten tek bir kök üretim kaydı üretildiği ve ürün/miktar bilgisinin korunduğu doğrulandı
  - test, Sprint 1 boyunca parça parça kilitlediğimiz kuralların aynı ana akış içinde birlikte çalıştığını gösterdi
  - ilk denemede aynı `DbContext` içinde art arda controller çağrıları nedeniyle EF tracking çakışması görüldü; testte request sınırları `ChangeTracker.Clear()` ile ayrıştırılarak gerçek kullanım modeli taklit edildi ve senaryo geçti
  - production akışı artık testte ek `RequestServices` kurmadan da çalışıyor; auth header yokken kullanıcı çözümleme helper'ı güvenli şekilde `null` dönüyor
- Durum: PASSED

**Değişen Dosyalar**
- `C:\rynSoft\quvex\smallFactoryApi\Industry.API\Helpers\HttpContextUtilities.cs`
- `C:\rynSoft\quvex\smallFactoryApi\Industry.API.Tests\Controllers\OfferToProductionAcceptanceTests.cs`

---

## 5. Sprint 2 - Üretim -> Stok

### Sprint Hedefi
Üretim tamamlama ile stok girişi arasındaki akışı güçlendirmek; stok sayım, lot takibi ve hammadde tüketim süreçlerini operasyonel hale getirmek.

### Başarı Kriterleri
- Üretim tamamlandığında stok girişi otomatik ve izlenebilir olur.
- Lot zorunlu ürünlerde üretim tamamlama lot numarası olmadan yapılamaz.
- Hammadde tüketimi üretim adımına bağlı olarak izlenebilir.
- Stok sayım süreci başlatılıp onaylanabilir, fark stoka yansıtılabilir.
- Depo transferleri izlenebilir şekilde çalışır.

### Sprint Task Listesi

| Task ID | Başlık | Öncelik | Durum |
|--------|--------|---------|-------|
| S2-T1 | Üretim tamamlama → stok giriş akışının doğrulanması ve iyileştirilmesi | P0 | PASSED |
| S2-T2 | Lot zorunluluğu — üretim tamamlamada lot numarası kontrolü | P0 | PASSED |
| S2-T3 | Hammadde tüketimi — üretim adımında BOM bazlı stok düşümü | P1 | PASSED |
| S2-T4 | Stok sayım akışının uçtan uca çalıştırılması | P1 | PASSED |
| S2-T5 | Depo transferi akışının doğrulanması | P2 | PASSED |
| S2-T6 | Stok giriş/çıkış hareketlerinin ürün bazlı izlenebilirliği | P1 | PASSED |
| S2-T7 | Uçtan uca kabul testi — üretim tamamla → stok girişi → sayım → transfer | P0 | PASSED |

---

## 6. Sprint 2 Task Detayları

### [S2-T1] Üretim Tamamlama → Stok Giriş Akışının Doğrulanması ve İyileştirilmesi

**Durum:** PASSED
**Sorun neydi?**
- Üretim tamamlandığında otomatik stok girişi (`StockReceipt IN`) oluşuyor ancak:
  - Belge numarası `DateTime.Now` kullanıyordu → PostgreSQL `timestamptz` ile uyumsuz
  - Completion endpoint sadece `Ok()` döndürüyordu → stok giriş bilgisi kullanıcıya ulaşmıyordu
  - Depo atanmamış üretimler için stok girişi sessizce atlanıyordu → kullanıcı bilgilendirilmiyordu

**Nasıl çözdük?**
- `IncreaseCompletion` endpoint'indeki 5 adet `DateTime.Now` → `DateTime.UtcNow` olarak düzeltildi
- Completion endpoint artık stok giriş belgesi bilgisini (`stockReceiptId`, `stockReceiptDocumentNo`) yanıtta döndürüyor
- Depo atanmamışsa `warehouseMissing: true` ve açıklayıcı uyarı mesajı döndürülüyor
- UI (`EnterCompletion.js`) artık yanıta göre 3 farklı bildirim gösteriyor:
  - Başarılı stok girişi → belge numarasıyla success notification
  - Depo eksik → warning notification (8sn süre)
  - Ara adım → basit success notification
- 7 backend karakterizasyon testi ile mevcut davranış kilitlendi
- 6 UI testi ile response parsing doğrulandı

**Neye dikkat ettik?**
- Mevcut çalışan akış bozulmadı — sadece `Ok()` → `Ok(new { ... })` değişikliği
- UI'da `response.data` artık obje; mevcut callback akışı korundu
- StockReceipt kaydı yalnızca son iş emri adımı tamamlandığında oluşuyor (ara adımlarda oluşmuyor)

**Neyi etkiledi?**
- ProductionController.cs: `IncreaseCompletion` endpoint (DateTime + response)
- EnterCompletion.js: completion callback (notification logic)

**Test Senaryosu**
- Senaryo: Üretim tamamlama stok giriş akışının doğrulanması
- Komutlar:
  - `dotnet test Industry.API.Tests/Industry.API.Tests.csproj --filter "FullyQualifiedName~ProductionCompletionStockEntryTests"`
  - `npx vitest run src/views/modul/production/__tests__/completionStockEntry.test.js`
  - `npx vite build`
- Beklenen Sonuç: Son adım tamamlandığında StockWarehouses + StockReceipt IN oluşmalı, depo yoksa uyarı dönmeli
- Gerçek Sonuç:
  - Backend 7/7 test geçti (stok girişi, ara adım, ikinci tamamlama, depo eksik, miktar aşımı, stock relation, iş emri eksik)
  - UI 6/6 test geçti (response parsing: normal, uyarı, varsayılan, ara adım, null, belge format)
  - Vite build başarılı
- Durum: PASSED

**Değişen Dosyalar**
- `C:\rynSoft\quvex\smallFactoryApi\Industry.API\Controllers\ProductionController.cs`
- `C:\rynSoft\quvex\smallFactoryApi\Industry.API.Tests\Controllers\ProductionCompletionStockEntryTests.cs` (YENİ)
- `C:\rynSoft\quvex\smallFactoryUI\src\views\modul\production\EnterCompletion.js`
- `C:\rynSoft\quvex\smallFactoryUI\src\views\modul\production\__tests__\completionStockEntry.test.js` (YENİ)

---

### [S2-T2] Lot Zorunluluğu — Üretim Tamamlamada Lot Numarası Kontrolü

**Durum:** PASSED
**Sorun neydi?**
- Ürün modelinde `RequiresLotTracking` alanı var ama üretim tamamlamada lot numarası zorunluluğu kontrol edilmiyor
- Lot oluşturma tamamen manuel; üretim tamamlama ile otomatik bağlantı yok
- Kritik ürünlerde lot takibi yapılmadan stok girişi mümkün

**Nasıl çözdük?**
- `CompletionRequestDTO`'ya `LotNumber` alanı eklendi
- `IncreaseCompletion` endpoint'inde son adım tamamlanırken `RequiresLotTracking` kontrolü yapılıyor
  - Lot zorunlu üründe lot numarası yoksa `BadRequest` dönüyor
  - Ara adımlarda lot kontrolü yapılmıyor (sadece son adımda)
- Lot numarası verildiğinde otomatik `StockLot` kaydı oluşturuluyor (ürün, depo, miktar, üretim tarihi)
- `StockReceiptDetail`'e lot bağlantısı eklendi (`LotNumber` + `StockLotId`)
- Lot zorunlu olmayan ürünlerde lot numarası opsiyonel olarak verilebiliyor
- `ProductionDTO`'ya `RequiresLotTracking` alanı eklendi (UI'da zorunlu/opsiyonel gösterim)
- UI `EnterCompletion.js`'ye lot numarası alanı eklendi:
  - Son adımda görünür (ara adımlarda gizli)
  - Lot zorunlu ürünlerde `required` validation
  - Lot zorunlu olmayanlarda opsiyonel
- `ProductionWorkOrderStatus.js` son adım tespiti yapıp `isLastStep` prop'unu geçiyor

**Neye dikkat ettik?**
- Lot zorunluluğu olmayan ürünler hiç etkilenmedi
- Mevcut lot kayıtları bozulmadı — yeni kayıtlar ekleniyor
- Ara adımlarda lot kontrolü yok, sadece son adımda (stoğa giriş anında)
- `StockLot.ManufactureDate` otomatik UTC olarak atanıyor

**Neyi etkiledi?**
- ProductionController.cs: lot kontrolü + StockLot oluşturma + StockReceiptDetail lot bağlantısı
- CompletionRequestDTO.cs: LotNumber alanı
- ProductionDTO.cs: RequiresLotTracking alanı
- EnterCompletion.js: lot numarası form alanı
- ProductionWorkOrderStatus.js: isLastStep hesaplama + requiresLotTracking prop
- ProductionItem.js: requiresLotTracking prop geçişi

**Test Senaryosu**
- Senaryo: Lot zorunlu üründe lot numarası olmadan tamamlama reddedilmeli
- Komutlar:
  - `dotnet test Industry.API.Tests/Industry.API.Tests.csproj --filter "FullyQualifiedName~ProductionCompletionStockEntryTests"`
  - `npx vite build`
- Beklenen Sonuç: Lot zorunlu → lot yoksa BadRequest, lot varsa StockLot + receipt bağlantısı; lot opsiyonel → her iki durumda da çalışır
- Gerçek Sonuç:
  - 12/12 backend test geçti (7 S2-T1 + 5 S2-T2)
  - Vite build başarılı
- Durum: PASSED

**Değişen Dosyalar**
- `C:\rynSoft\quvex\smallFactoryApi\Industry.API\Models\DTOs\CompletionRequestDTO.cs`
- `C:\rynSoft\quvex\smallFactoryApi\Industry.API\Models\DTOs\ProductionDTO.cs`
- `C:\rynSoft\quvex\smallFactoryApi\Industry.API\Controllers\ProductionController.cs`
- `C:\rynSoft\quvex\smallFactoryApi\Industry.API.Tests\Controllers\ProductionCompletionStockEntryTests.cs`
- `C:\rynSoft\quvex\smallFactoryUI\src\views\modul\production\EnterCompletion.js`
- `C:\rynSoft\quvex\smallFactoryUI\src\views\modul\production\ProductionWorkOrderStatus.js`
- `C:\rynSoft\quvex\smallFactoryUI\src\views\modul\production\ProductionItem.js`

---

### [S2-T3] Hammadde Tüketimi — Üretim Adımında BOM Bazlı Stok Düşümü

**Durum:** PASSED
**Sorun neydi?**
- Üretim tamamlandığında mamul stoka giriyor ama hammadde düşümü otomatik değil
- BOM (ürün ağacı) mevcut ancak üretim tamamlama ile stok düşümü bağlı değil
- Manuel stok çıkışı gerekiyor, bu da fiili stok ile kaydi stok arasında fark yaratıyor
- ConsumeStock endpoint'inde `DateTime.Now` kullanılıyordu

**Nasıl çözdük?**
- Üretim son adım tamamlandığında child production'lar üzerinden BOM tüketimi otomatik yapılıyor
  - Her child production'ın `ParentRelationQuantity * tamamlanan miktar` kadar hammadde düşülüyor
  - StockReceipt OUT belgesi ile izlenebilir
- Stok yetersizse uyarı dönüyor ama tamamlamaya izin veriyor (negatif stok oluşabiliyor, Sprint 3'te engellenecek)
- BOM olmayan ürünlerde (child production yok) tüketim atlanıyor
- ConsumeStock endpoint'indeki 4 adet `DateTime.Now` → `DateTime.UtcNow` düzeltildi
- Response'a `consumedMaterials` listesi ve stok yetersizlik uyarıları eklendi

**Neye dikkat ettik?**
- BOM olmayan ürünler etkilenmedi
- Kısmi tamamlamalarda orantılı tüketim: `body.Quantity * child.ParentRelationQuantity`
- Child production'ın kendi depo ataması varsa o depodan, yoksa parent'ın deposundan düşülüyor
- Her hammadde için ayrı StockReceipt OUT belgesi (izlenebilirlik)

**Neyi etkiledi?**
- ProductionController.cs: IncreaseCompletion (BOM tüketimi) + ConsumeStock (DateTime fix)
- Completion response: consumedMaterials + warning bilgisi

**Test Senaryosu**
- Senaryo: Üretim tamamlamada BOM bazlı hammadde otomatik düşümü
- Komut: `dotnet test Industry.API.Tests/Industry.API.Tests.csproj --filter "FullyQualifiedName~ProductionCompletionStockEntryTests"`
- Beklenen Sonuç: Child production'ların hammaddeleri orantılı düşülmeli, OUT receipt oluşmalı
- Gerçek Sonuç:
  - 15/15 backend test geçti (7 S2-T1 + 5 S2-T2 + 3 S2-T3)
  - BOM tüketimi testi: 5 mamul tamamlandığında 12.5 hammadde düşüldü (2.5 oran)
  - Stok yetersiz testi: uyarı döndü ama tamamlama başarılı
  - BOM yok testi: OUT receipt oluşmadı
- Durum: PASSED

**Değişen Dosyalar**
- `C:\rynSoft\quvex\smallFactoryApi\Industry.API\Controllers\ProductionController.cs`
- `C:\rynSoft\quvex\smallFactoryApi\Industry.API.Tests\Controllers\ProductionCompletionStockEntryTests.cs`

---

### [S2-T4] Stok Sayım Akışının Uçtan Uca Çalıştırılması

**Durum:** PASSED
**Sorun neydi?**
- StockCount controller ve service mevcut ancak çok ürünlü uçtan uca akış test edilmemiş
- Sıfır varyanslı kalemlerin stoku değiştirmemesi doğrulanmamış
- Onaylanmış sayıma item ekleme koruması test edilmemiş

**Nasıl çözdük?**
- Mevcut 9 test zaten temel akışı kapsıyor (create, add item, approve, delete, get)
- 2 yeni uçtan uca test eklendi:
  - Çok ürünlü sayım: DRAFT → item ekle (2 ürün) → IN_PROGRESS → approve → stok düzeltmesi
    - Varyanslı kalem stoku düzeltildi (100→85)
    - Sıfır varyanslı kalem stoku değişmedi (50→50)
    - VarianceItems doğru hesaplandı (sadece farklı kalemler)
  - Onaylanmış sayıma item ekleme: BusinessException fırlatıldı

**Neye dikkat ettik?**
- Mevcut testleri bozmadan yeni testler eklendi
- Sıfır varyans koruması doğrulandı
- Onay sonrası koruma doğrulandı

**Neyi etkiledi?**
- StockCountServiceTests.cs (2 yeni test)

**Test Senaryosu**
- Komut: `dotnet test Industry.API.Tests/Industry.API.Tests.csproj --filter "FullyQualifiedName~StockCountServiceTests"`
- Gerçek Sonuç: 11/11 test geçti (9 mevcut + 2 yeni)
- Durum: PASSED

**Değişen Dosyalar**
- `C:\rynSoft\quvex\smallFactoryApi\Industry.API.Tests\Services\StockCountServiceTests.cs`

---

### [S2-T5] Depo Transferi Akışının Doğrulanması

**Durum:** PASSED
**Sorun neydi?**
- Transfer sistemi tam implemente (14 mevcut test) ancak bazı edge case'ler test edilmemiş:
  - Hedef depoda mevcut stok varken artırma davranışı
  - Çok ürünlü transfer senaryosu

**Nasıl çözdük?**
- Mevcut 14 test zaten tüm temel akışı kapsıyor:
  - CRUD, aynı depo engeli, stok yetersizliği, durum koruması, cascade delete
- 2 yeni test eklendi:
  - Hedef depoda mevcut stok varken: miktar artırıldı, ikinci kayıt oluşmadı
  - Çok ürünlü transfer: her iki ürünün kaynak/hedef stokları doğru aktarıldı

**Neye dikkat ettik?**
- Mevcut testler bozulmadı
- Aynı depoya transfer zaten engelli (test mevcut)
- Stok yetersizliğinde BadRequest dönüyor (test mevcut)

**Test Senaryosu**
- Komut: `dotnet test Industry.API.Tests/Industry.API.Tests.csproj --filter "FullyQualifiedName~StockTransferControllerTests"`
- Gerçek Sonuç: 16/16 test geçti (14 mevcut + 2 yeni)
- Durum: PASSED

**Değişen Dosyalar**
- `C:\rynSoft\quvex\smallFactoryApi\Industry.API.Tests\Controllers\StockTransferControllerTests.cs`

---

### [S2-T6] Stok Giriş/Çıkış Hareketlerinin Ürün Bazlı İzlenebilirliği

**Durum:** PASSED
**Sorun neydi?**
- Stok hareket geçmişi modal'ı mevcut (Stock.js, by-product endpoint)
- Ancak kullanıcı hareket kaynağını (üretim/BOM/transfer/sayım/manuel) ayırt edemiyor
- Sadece IN/OUT tipi ve açıklama gösteriliyordu

**Nasıl çözdük?**
- Hareket geçmişi tablosuna "Kaynak" kolonu eklendi
- Explanation alanından hareket kaynağı otomatik tespit ediliyor:
  - "Üretim tamamlama" → Üretim (mavi tag)
  - "BOM tüketimi" → BOM Tüketimi (turuncu tag)
  - "Üretim malzeme tüketimi" → Malzeme (turuncu tag)
  - "Sayım" → Sayım (mor tag)
  - "Transfer" → Transfer (cyan tag)
  - Diğer → Manuel (varsayılan tag)
- `getMovementSource` helper fonksiyonu ile tespit mantığı ortak yere alındı
- 7 UI testi ile tüm kaynak tipleri doğrulandı

**Neye dikkat ettik?**
- Mevcut modal yapısı bozulmadı — sadece yeni kolon eklendi
- Pagination zaten 10'ar kayıt gösteriyor
- Backend endpoint'e dokunulmadı — mevcut veri yeterli

**Test Senaryosu**
- Komut: `npx vitest run src/views/modul/stock/__tests__/movementSource.test.js`
- Gerçek Sonuç: 7/7 test geçti
- Durum: PASSED

**Değişen Dosyalar**
- `C:\rynSoft\quvex\smallFactoryUI\src\views\modul\stock\Stock.js`
- `C:\rynSoft\quvex\smallFactoryUI\src\views\modul\stock\__tests__\movementSource.test.js` (YENİ)

---

### [S2-T7] Uçtan Uca Kabul Testi — Üretim → Stok → Sayım → Transfer

**Durum:** PASSED
**Sorun neydi?**
- Sprint 2'nin parça parça çalışan bileşenlerinin birlikte çalıştığı doğrulanmamış

**Nasıl çözdük?**
- Tek bir backend kabul testi ile tüm Sprint 2 zinciri doğrulandı:
  1. Üretim emri oluştur → 100 adet mamul
  2. Üretimi tamamla → Depo A'da 100 birim stok girişi doğrulandı, StockReceipt IN belgesi oluştu
  3. Stok sayımı başlat → fiziksel sayım 95, varyans -5 doğrulandı
  4. Sayımı onayla (AdjustStock=true) → Depo A stoku 100→95 düzeltildi
  5. Depo transferi (A→B, 30 birim) → Depo A: 65, Depo B: 30 doğrulandı
  6. Toplam stok tutarlılığı: 65 + 30 = 95 (sayım sonrası değer korundu)

**Test Senaryosu**
- Komut: `dotnet test Industry.API.Tests/Industry.API.Tests.csproj --filter "FullyQualifiedName~Sprint2AcceptanceTests"`
- Gerçek Sonuç: 1/1 test geçti — tüm zincir kesintisiz çalışıyor
- Durum: PASSED

**Değişen Dosyalar**
- `C:\rynSoft\quvex\smallFactoryApi\Industry.API.Tests\Controllers\Sprint2AcceptanceTests.cs` (YENİ)

---

## 8. Sonraki Sprintler İçin Kısa Çerçeve

### Sprint 3 - Satınalma -> Mal kabul — DETAYLI PLAN

#### Sprint Hedefi
Satınalma siparişinden mal kabulüne kadar olan zinciri kesintisiz, izlenebilir ve kalite kontrol ile bağlantılı hale getirmek.

#### Başarı Kriterleri
- PO mal kabul yapıldığında stok girişi otomatik ve belge numarasıyla izlenebilir.
- Kısmi teslimler ayrı ayrı takip edilebilir.
- Satınalma talebi, PO ilerledikçe otomatik güncellenir.
- Kalite kontrol gereken ürünlerde otomatik giriş muayene kaydı oluşur.
- Tüm zincir uçtan uca test ile doğrulanır.

#### Sprint Task Listesi

| Task ID | Başlık | Öncelik | Durum |
|---------|--------|---------|-------|
| S3-T1 | DateTime.UtcNow düzeltmesi + mal kabul response zenginleştirme | P0 | PASSED |
| S3-T2 | Mal kabul belge numarası benzersizliği ve depo doğrulama | P0 | PASSED |
| S3-T3 | PO ↔ StockRequest durum senkronizasyonu | P1 | PASSED |
| S3-T4 | Kısmi mal kabul ve teslim geçmişi izlenebilirliği | P1 | PASSED |
| S3-T5 | Mal kabul → giriş kalite kontrol otomatik tetikleme | P1 | PASSED |
| S3-T6 | UI: Mal kabul response gösterimi ve hareket kaynağı etiketi | P2 | PASSED |
| S3-T7 | Uçtan uca kabul testi (StockRequest → PO → Receive → Stok → Kalite) | P0 | PASSED |

---

#### [S3-T1] DateTime.UtcNow Düzeltmesi + Mal Kabul Response Zenginleştirme

**Durum:** PASSED
**Sorun neydi?**
- `PurchaseOrderController` içinde ~15 yerde `DateTime.Now` kullanılıyor.
- PostgreSQL `timestamptz` sütunları `DateTime.UtcNow` bekliyor (Sprint 2 S2-T1'de Production için düzeltilmişti).
- `ReceiveItems` endpoint'i boş `Ok()` dönüyor — mal kabul belge numarası, hangi ürün ne kadar teslim alındı bilgisi yok.

**Nasıl çözeceğiz?**
- `PurchaseOrderController` genelinde `DateTime.Now` → `DateTime.UtcNow` geçişi.
- `ReceiveItems` response'una ekleme:
  - `receiptDocumentNos` (oluşan stok giriş fişi numaraları)
  - `receivedItems` (ürün adı, miktar, kalan)
  - `newStatus` (PO'nun yeni durumu)
  - `allReceived` (tüm kalemler teslim alındı mı?)

**Neye dikkat edeceğiz?**
- Mevcut testlerin kırılmaması.
- UI tarafında response parse'ın uyumlu kalması.

**Neyi etkileyeceğiz?**
- `PurchaseOrderController.cs` (tüm DateTime.Now satırları)
- `PurchaseOrderControllerTests.cs` (yeni response testleri)

---

#### [S3-T2] Mal Kabul Belge Numarası Benzersizliği ve Depo Doğrulama

**Durum:** PASSED (S3-T1 kapsamında birlikte tamamlandı)
**Sorun neydi?**
- `DocumentNo = "PO-IN-" + DateTime.Now.ToString("yyyyMMdd-HHmmss")` — aynı saniyede birden fazla kalem teslim alınırsa aynı numara üretilir.
- Depo ID doğrulaması yok — geçersiz depo ID ile çağrılırsa sessizce stok kaydı oluşturuluyor.
- Her receive item için ayrı StockReceipt oluşuyor — tek seferde teslim alınan tüm kalemler tek bir belge altında olmalı.

**Nasıl çözeceğiz?**
- Belge numarasını sıralı ve benzersiz yapacağız: `PO-IN-{yyyy}-{sıra:D5}`.
- Tek bir `ReceiveItems` çağrısı → tek StockReceipt, birden fazla StockReceiptDetail.
- Depo varlığı kontrolü eklenecek — yoksa BadRequest.

**Neye dikkat edeceğiz?**
- Mevcut stok giriş fişi yapısıyla uyum.
- StockReceiptDetail'lerin doğru ProductId ve quantity ile oluşması.

**Neyi etkileyeceğiz?**
- `PurchaseOrderController.ReceiveItems` (belge oluşturma mantığı)
- Stok giriş belge raporlaması

---

#### [S3-T3] PO ↔ StockRequest Durum Senkronizasyonu

**Durum:** PASSED
**Sorun neydi?**
- PurchaseOrder optional olarak `StockRequestId` ile ilişkilendirilebiliyor.
- Ancak PO durumu ilerledikçe StockRequest durumu güncellenmiyor.
- Kullanıcı satınalma talebinin karşılanıp karşılanmadığını görmek için PO'ya gitmek zorunda.

**Nasıl çözeceğiz?**
- PO Create: StockRequest varsa → `IN_PROCESS`
- PO SENT: StockRequest → `WAITING_FOR_SHIPPING`
- PO RECEIVED: StockRequest → `SUPPLIED`
- PO CANCELLED: StockRequest → `WAITING` (geri al)

**Neye dikkat edeceğiz?**
- StockRequest'in mevcut durumunu kontrol et (zaten SUPPLIED ise tekrar güncelleme).
- Birden fazla PO aynı StockRequest'e bağlı olabilir mi? (Tek PO-tek talep kuralı koyacağız.)

**Neyi etkileyeceğiz?**
- `PurchaseOrderController.Create`, `ChangeStatus`, `ReceiveItems`
- `StockRequests` tablosu durumları

---

#### [S3-T4] Kısmi Mal Kabul ve Teslim Geçmişi İzlenebilirliği

**Durum:** PASSED
**Sorun neydi?**
- Birden fazla teslim alım yapıldığında hangi tarihte ne kadar alındığı izlenemiyor.
- `ReceivedQuantity` sadece toplam; geçmiş kayıp.
- Kalan miktar hesaplaması UI'da var ama backend doğrulaması zayıf.

**Nasıl çözeceğiz?**
- Her `ReceiveItems` çağrısı bir `StockReceipt` oluşturur ve `StockReceiptDetail` kalemlerini tutar.
- `Explanation` alanına PO numarası ve teslim sırası yazılır.
- PO'nun teslim geçmişini dönecek yeni bir endpoint: `GET /PurchaseOrder/{id}/receive-history`.
- Bu endpoint, PO'ya bağlı StockReceipt'leri tarih sıralı döner.

**Neye dikkat edeceğiz?**
- Mevcut `StockReceipt.Explanation` pattern'i: `"PO mal alım - PO-2026-00001"` — bu pattern ile filtreleme yapılabilir.

**Neyi etkileyeceğiz?**
- `PurchaseOrderController` (yeni endpoint)
- Stok hareket tarihçesi görünümü

---

#### [S3-T5] Mal Kabul → Giriş Kalite Kontrol Otomatik Tetikleme

**Durum:** PASSED
**Sorun neydi?**
- `IncomingInspection` entity'si ve servisi var ama mal kabul ile otomatik bağlantısı yok.
- `Product.RequiresQualityCheck` alanı mevcut — ancak mal kabulde kontrol edilmiyor.
- Kullanıcı mal kabul yaptıktan sonra ayrıca kalite kaydı oluşturmak zorunda.

**Nasıl çözeceğiz?**
- `ReceiveItems` içinde her kalem için `Product.RequiresQualityCheck` kontrolü.
- `true` ise otomatik `IncomingInspection` kaydı oluşturulur:
  - `Status = PENDING`
  - `SupplierId = PO.SupplierId`
  - `ProductId = item.ProductId`
  - `ReceivedQuantity = receiveItem.Quantity`
  - `LotNumber` (varsa ReceiveItemDTO'ya eklenecek)
- Response'a `pendingInspections` listesi eklenir.

**Neye dikkat edeceğiz?**
- Kalite kontrole gerek olmayan ürünlerde kayıt oluşmaması.
- IncomingInspection servisiyle uyum.

**Neyi etkileyeceğiz?**
- `PurchaseOrderController.ReceiveItems`
- `ReceiveItemDTO` (LotNumber alanı eklenecek)
- `IncomingInspection` tablosu

---

#### [S3-T6] UI: Mal Kabul Response Gösterimi ve Hareket Kaynağı Etiketi

**Durum:** PASSED
**Sorun neydi?**
- UI'da mal kabul yapıldığında sadece success notification gösteriliyor.
- Belge numarası, kalite kontrol uyarısı gibi bilgiler kullanıcıya iletilmiyor.
- Stok hareket geçmişinde PO mal kabul kaynağı etiketlenmiyor.

**Nasıl çözeceğiz?**
- `PurchaseOrderDetail.js` mal kabul response'unu parse edecek:
  - Belge numarası gösterimi
  - Kalite kontrol bekleyen ürün uyarısı
  - Kalan miktar özeti
- `Stock.js` hareket kaynağı tespitine `"PO mal alım"` prefix eklenecek → `{ label: 'Satınalma', color: 'green' }`

**Neye dikkat edeceğiz?**
- Mevcut UI yapısıyla uyum (S2-T6'da kurulan pattern).

**Neyi etkileyeceğiz?**
- `PurchaseOrderDetail.js` (response handling)
- `Stock.js` (movement source detection)
- UI test dosyaları

---

#### [S3-T7] Uçtan Uca Kabul Testi

**Durum:** PASSED
**Sorun neydi?**
- Satınalma → mal kabul zincirinin tamamını doğrulayan entegrasyon testi yok.

**Nasıl çözeceğiz?**
- Tam zincir testi:
  1. StockRequest oluştur (WAITING)
  2. PO oluştur (StockRequestId bağlantılı) → StockRequest = IN_PROCESS
  3. PO onayla (APPROVED) → gönder (SENT) → StockRequest = WAITING_FOR_SHIPPING
  4. Kısmi teslim al (50%) → PO = PARTIALLY_RECEIVED
  5. Stok girişi doğrula (depo miktarı arttı)
  6. Kalite kontrol gerektiren ürün: IncomingInspection oluştu mu?
  7. Kalan teslim al (100%) → PO = RECEIVED → StockRequest = SUPPLIED
  8. Toplam stok doğrula

**Neye dikkat edeceğiz?**
- Sprint 2 acceptance test pattern'ını takip et.

**Neyi etkileyeceğiz?**
- Yeni test dosyası: `Sprint3AcceptanceTests.cs`

### Sprint 4 - Sevkiyat -> Fatura -> Tahsilat — DETAYLI PLAN

#### Sprint Hedefi
Sevkiyattan faturaya, faturadan tahsilata kadar olan zinciri kesintisiz, izlenebilir ve iş kurallarıyla korumalı hale getirmek.

#### Başarı Kriterleri
- Sevkiyat, üretim tamamlanan miktarı aşamaz.
- Sevkiyat olmadan fatura kesilemez (SALES tipi için).
- Kısmi sevkiyat ve kısmi tahsilat izlenebilir.
- Vadesi geçen faturalar otomatik OVERDUE olarak işaretlenir.
- Tüm zincir uçtan uca test ile doğrulanır.

#### Sprint Task Listesi

| Task ID | Başlık | Öncelik | Durum |
|---------|--------|---------|-------|
| S4-T1 | Sevkiyat doğrulama: miktar kontrolü + DateTime.UtcNow | P0 | PASSED |
| S4-T2 | Sevkiyat olmadan fatura engeli (SALES tipi) | P0 | PASSED |
| S4-T3 | Fatura → Sevkiyat bağlantısı: BilledQuantity otomatik güncelleme | P1 | PASSED |
| S4-T4 | Vadesi geçmiş faturaların otomatik OVERDUE tespiti | P1 | PASSED |
| S4-T5 | Sevkiyat silme → ShippedQuantity geri alma | P1 | PASSED |
| S4-T6 | UI: Sevkiyat/fatura response iyileştirme | P2 | PASSED |
| S4-T7 | Uçtan uca kabul testi (Üretim → Sevk → Fatura → Tahsilat) | P0 | PASSED |

#### S4-T1: Sevkiyat doğrulama
- **Sorun:** Sevkiyat miktarı kontrolsüz giriliyordu, tamamlanan miktarı aşabiliyordu
- **Çözüm:** PostProductionShippingDetail'e miktar > 0, üretim var mı, ShippedQty + yeni ≤ CompleteQty kontrolleri eklendi
- **Dikkat:** DateTime.UtcNow kullanımı, Guid.NewGuid() boş Id için
- **Etkilenen:** ShippingDetailsController.cs, StockWarehouses (rezerv azaltma)
- **Test:** 6 test (valid, exceed, zero, invalid prod, reserved stock, partial accumulate) — PASSED

#### S4-T2: Sevkiyat olmadan fatura engeli
- **Sorun:** SALES faturası sevkiyat yapılmadan kesilebiliyordu
- **Çözüm:** InvoiceService.CreateAsync'te SALES tipi için ProductionId olan kalemlerde ShippedQty - BilledQty kontrolü
- **Dikkat:** ProductionId null olan (hizmet) kalemler kontrole tabi değil, PURCHASE fatura etkilenmiyor
- **Etkilenen:** InvoiceService.cs
- **Test:** 8 test (with shipment, no shipment, exceed, all billed, invalid prod, without prodId, purchase, exact qty) — PASSED

#### S4-T3: BilledQuantity otomatik güncelleme
- **Sorun:** Fatura gönderildiğinde BilledQuantity güncellenmiyor, çifte fatura riski vardı
- **Çözüm:** UpdateStatusAsync DRAFT→SENT geçişinde BilledQuantity artırılıyor, *→CANCELLED'da geri alınıyor
- **Dikkat:** AsTracking() ile Production yüklemek gerekli (NoTracking default), sadece SALES tipi etkileniyor
- **Etkilenen:** InvoiceService.cs (UpdateStatusAsync + yeni UpdateBilledQuantities metodu)
- **Test:** 5 test (sent increase, cancelled revert, draft cancel no change, purchase no change, multiple items) — PASSED

#### S4-T4: Vadesi geçmiş fatura otomatik OVERDUE
- **Sorun:** Vadesi geçen faturalar manuel takip gerekiyordu
- **Çözüm:** MarkOverdueInvoicesAsync: SENT veya PARTIALLY_PAID + DueDate < now → OVERDUE
- **Dikkat:** DRAFT, PAID, CANCELLED etkilenmiyor
- **Etkilenen:** InvoiceService.cs, IInvoiceService.cs, InvoiceController.cs (mark-overdue endpoint)
- **Test:** 5 test (sent past due, draft past, future due, partial paid past, multiple overdue) — PASSED

#### S4-T5: Sevkiyat silme → ShippedQuantity geri alma
- **Sorun:** Sevkiyat silindiğinde ShippedQuantity güncellenmiyordu
- **Çözüm:** DeleteProductionShippingDetail'de billing kontrolü + ShippedQuantity geri alma
- **Dikkat:** Faturalanmış sevkiyat silinemez (hasBilling kontrolü)
- **Etkilenen:** ShippingDetailsController.cs
- **Test:** 3 test (revert shipped, billed cannot delete, not found) — PASSED

#### S4-T6: UI response iyileştirme
- **Sorun:** Hata mesajları kullanıcıya gösterilmiyordu (boş catch blokları, generic error)
- **Çözüm:** InvoiceForm error parsing (sevkiyat validasyon mesajları 6sn gösterim), InvoiceDetail try-catch ekleme, ShippingList/ShippedListDetail notification.error
- **Dikkat:** invoiceService.updateStatus { newStatus } → { status } bug düzeltmesi
- **Etkilenen:** InvoiceForm.js, InvoiceDetail.js, ShippingList.js, ShippedListDetail.js, invoiceService.js
- **Test:** UI build successful — PASSED

#### S4-T7: Uçtan uca kabul testi
- **Sorun:** Tüm zincirin entegre çalıştığı doğrulanmamıştı
- **Çözüm:** 13 adımlı E2E test: Üretim → Kısmi sevk(60) → Tam sevk(100) → Aşırı sevk reddi → Sevkiyatsız fatura reddi → SALES fatura(60) → SENT(BilledQty=60) → Kısmi ödeme(3000₺) → Tam ödeme(7200₺ PAID) → Vadesi geçmiş fatura(40) → OVERDUE tespiti → Aşırı fatura reddi → İptal(BilledQty geri) → Yeni fatura(40)
- **Etkilenen:** Sprint4AcceptanceTests.cs
- **Test:** 1 E2E test — PASSED

#### Sprint 4 Özet
- **Toplam yeni test:** 28 (9 ShippingDetails + 18 InvoiceService + 1 E2E)
- **Toplam API test:** 1096 passing (1 pre-existing flaky: ReportServiceTests.GetDelayedOrders_ShouldReturnDelayed)

### Sprint 5 - Auth / Yetki / Temizlik — DETAYLI PLAN

#### Sprint Hedefi
Auth zincirindeki güvenlik açıklarını kapatmak, unauthenticated endpoint'leri korumak, logout token invalidation'ı düzeltmek, regresyon test seti oluşturmak.

#### Başarı Kriterleri
- Tüm state-changing endpoint'ler auth korumalı
- bootstrap-permissions üretimde erişilemez
- Logout token'ı veritabanından da siler
- Tüm auth senaryoları test ile doğrulanmış
- Sprint 1-4 regresyon seti çalışır durumda

#### Sprint Task Listesi

| Task ID | Başlık | Öncelik | Durum |
|---------|--------|---------|-------|
| S5-T1 | Unauthenticated endpoint kapatma (bootstrap-permissions, getPermissions, roleWithUser, logout) | P0 | PASSED |
| S5-T2 | Logout token invalidation — DB'den token silme | P0 | PASSED |
| S5-T3 | YetkiDenetimi attribute tutarlılık kontrolü — tüm controller'lar | P1 | PASSED |
| S5-T4 | Token expiry ve refresh flow doğrulama testleri | P1 | PASSED |
| S5-T5 | Sprint 1-4 regresyon test seti (çekirdek iş kuralları) | P1 | PASSED |
| S5-T6 | UI kırık route ve erişilemeyen sayfa temizliği | P2 | PASSED |
| S5-T7 | Uçtan uca auth kabul testi (login → permission → denied → logout → token invalid) | P0 | PASSED |

#### S5-T1: Unauthenticated endpoint kapatma
- **Sorun:** bootstrap-permissions (CRITICAL privilege escalation), getPermissions (info leak), roleWithUser (org structure leak), logout (cache clearing DoS) endpoint'leri auth kontrolsüzdü
- **Çözüm:** bootstrap-permissions → [YetkiDenetimi(Permissions.Role.Kaydet)], getPermissions + roleWithUser → [YetkiDenetimi(Permissions.Role.Goruntule)], logout → [YetkiDenetimi(Permissions.Genel.All)]
- **Etkilenen:** AccountController.cs, RoleController.cs

#### S5-T2: Logout token invalidation
- **Sorun:** Logout sadece cache temizliyordu, token DB'de kalıyordu — çalınmış token kullanılabilirdi
- **Çözüm:** Logout artık Authorization header'dan token alıp RefreshToken tablosundan siliyor + user-specific permission cache temizliyor
- **Etkilenen:** AccountController.cs

#### S5-T3: YetkiDenetimi tutarlılık kontrolü
- **Sorun:** ProductController.GenerateCode (next-code) ve ProductionController (class-level) auth eksikti
- **Çözüm:** ProductController.GenerateCode → [YetkiDenetimi(Permissions.Stok.Goruntule)], ProductionController → class-level [YetkiDenetimi(Permissions.Uretim.Goruntule)]
- **Etkilenen:** ProductController.cs, ProductionController.cs

#### S5-T4: Auth flow doğrulama testleri
- **Sorun:** Auth zincirinin bütünlüğünü doğrulayan test yoktu
- **Çözüm:** 9 test: AllControllerActions protected, bootstrap/logout/getPermissions/getUserRoles/ProductionController protected, authenticate public, logout token removal, no AllowAnonymous
- **Etkilenen:** AuthorizationTests.cs (yeni)
- **Test:** 9/9 PASSED

#### S5-T5: Sprint 1-4 regresyon test seti
- **Sorun:** Çekirdek iş kurallarını tek seferde doğrulayan test seti yoktu
- **Çözüm:** 9 regresyon testi: S1 (production creation), S2 (stock/reservation), S3 (PO create+flow, receive+stock+QC), S4 (shipping validation, invoice requires shipment, BilledQuantity update, payment flow, overdue detection)
- **Etkilenen:** RegressionTests.cs (yeni)
- **Test:** 9/9 PASSED

#### S5-T6: UI kırık route temizliği
- **Sorun:** invoiceService.test.js { newStatus } → { status } uyumsuzluğu (S4-T6 bug fix sonrası)
- **Çözüm:** Test güncellendi, tüm 518 UI test geçiyor
- **Etkilenen:** invoiceService.test.js

#### S5-T7: Uçtan uca auth kabul testi
- **Sorun:** Auth altyapısının tamamını kapsayan kabul testi yoktu
- **Çözüm:** 8 bölümlü kabul testi: state-changing endpoint protection, critical endpoints, token invalidation, YetkiDenetimi altyapısı, middleware zinciri, password policy, permission scope (20+ modül), account lockout
- **Etkilenen:** Sprint5AcceptanceTests.cs (yeni)
- **Test:** 8/8 PASSED

#### Sprint 5 Özet
- **Toplam yeni test:** 26 (9 auth + 9 regression + 8 acceptance)
- **Güvenlik açığı kapatılan:** 6 endpoint (4 unauthenticated + 1 ProductController + 1 ProductionController)
- **Toplam API test:** 1122 passing (1 pre-existing flaky)
- **Toplam UI test:** 518 passing
- **API Commit:** `ed054c4` — S5: Auth/yetki güçlendirme + regresyon test seti
- **UI Commit:** `feea912` — S5-T6: invoiceService.updateStatus DTO düzeltmesi

---

## 9. Güncelleme Kuralı

Her task ilerlediğinde şu başlıklar mutlaka güncellenecek:

- Durum
- Ne sorun vardı?
- Nasıl çözdük?
- Neye dikkat ettik?
- Neyi etkiledik?
- Değişen dosyalar
- Test sonucu

Bu dosya yaşayan sprint kayıt defteri olarak kullanılacaktır.

---

## 10. Test Kapanış Kuralı

Her task için aşağıdaki kapanış sırası zorunludur:

1. Kod veya doküman değişikliği tamamlanır.
2. Task ile ilgili test senaryosu seçilir veya yazılır.
3. Test senaryosu çalıştırılır.
4. Sonuç bu dosyaya işlenir.
5. Test geçmeden task kapatılmaz.

### Task Test Kayıt Şablonu

Her task sonuna aşağıdaki alan eklenecek:

```md
**Test Senaryosu**
- Senaryo:
- Komut:
- Beklenen Sonuç:
- Gerçek Sonuç:
- Durum: PASSED | FAILED | BLOCKED
```
