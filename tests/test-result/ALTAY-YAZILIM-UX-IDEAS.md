# ALTAY YAZILIM SAVUNMA - E2E Test UX/UI Ihtiyaclari

**Test Tarihi:** 2026-04-13
**Kaynak:** 177 API cagrisi analizi + ALTAY-YAZILIM-E2E-PLAN.md senaryo kontrol listesi

Bu dosya, E2E testi sirasinda ortaya cikan API davranislari ve senaryo isteklerinin UI tarafinda yaratacagi sorunlari ve iyilestirme gereksinimlerini detaylandirir.

---

## 1. Eksik Endpoint'ler (UI ekranlari icin gerekli ama API'da yok)

### 1.1. `POST /Role`, `GET /Role`, `DELETE /Role/{id}` — Rol CRUD yok
- **Etki:** Ayarlar -> Roller ekrani senaryoda acilabilir olmali. Custom rol yaratma (Uretim Muduru, Kaliteci gibi) mumkun degil — sadece register sirasinda seed edilen Admin/Manager/Operator var.
- **UI etkisi:** `/settings/roles` sayfasi POST yapamaz, 404 gorur. Kullaniciya "Rol olusturma su an kullanilabilir degil" mesaji gorunecektir veya sessiz crash.
- **Ihtiyac:** `RoleController.cs` scaffold + permission tree UI bileseni.

### 1.2. `POST /PurchaseRequest` — Satin alma talebi
- **Etki:** Senaryonun "Faz 7A Satin alma talepleri" adimi tamamen atlanir. Uretim muduru talebi -> yonetici onayi -> teklif -> siparis akis kirilir.
- **UI etkisi:** `/purchase-request` sayfasi form submit ettiginde 404.
- **Ihtiyac:** `PurchaseRequestController` + talep onay workflow (status: PENDING -> APPROVED -> REJECTED).

### 1.3. `GET /ProductVariant?productId={id}` — Liste endpoint'i
- **Etki:** Tekstil/Gida urunleri icin variant sayfasi acilamaz.
- **Not:** Savunma icin kritik degil ama Sprint 11 Dalga 2'nin amaci Tekstil'e hitap etmekti.

### 1.4. `/Accounting/aging` ve `/Accounting/exchange-rates` routing
- **Etki:** Finans -> Yaslandirma sayfasi bos gorunur. TCMB kur guncelleme butonu calismaz.
- **Ihtiyac:** UI side veya API side alias — `[Route("accounting/aging")]` alias controller'a eklenmeli.

### 1.5. `POST /Bom`, `GET /Bom?parentId={id}`, `DELETE /Bom/{id}`
- **Etki:** BOM tree UI bileseni (nested) kullanilamaz. Sadece `Product.ParentProductId` ile implicit parent-child, ancak UI'da BOM editor'a ihtiyac var.
- **Not:** Product PUT uzerinden yonetim suboptimal. Hem UX hem de data modeli acisindan ayri BOM tablosu gerekir.

### 1.6. User management `GET /Account` (users list)
- **Etki:** `/settings/users` sayfasi kullanici listesini gosteremez. Admin yeni user goremez.
- **Ihtiyac:** `GET /Account` veya `GET /Users` endpoint'i ile paged listing.

### 1.7. `GET /Production/bySalesId/{id}` veya response'a productionId embed
- **Etki:** Sales approve sonrasi, UI'da kullanici "Uretime Gonder" butonuna bastiginda, hangi production'a yonlendirilecegi belirsiz. Su an `GET /Production?pageSize=20` ile manuel arama gerekir.
- **Ihtiyac:** `Sales/approve` response'unda yeni `productionId` donmeli veya `GET /Production/by-sales/{salesId}` endpoint'i eklenmeli.

---

## 2. Tutarsizliklar (Field mismatch, naming inconsistency)

### 2.1. User registration: `firstName/lastName` vs `Name/SurName`
- **Kaynak:** `RegisterRequestValidator.cs:14-20` PascalCase `Name`/`SurName` bekliyor; ancak `SelfRegistrationRequest` (public register) camelCase `fullName` kullaniyor.
- **Etki:** Iki farkli register endpoint'i iki farkli DTO schema'si kullaniyor. Frontend development'inda bu hata kolayca yapilabilir.
- **Oneri:**
  - Ya ikisini de camelCase yap (`name`, `surName`)
  - Ya da public/private icin tutarli schema olustur: `firstName`, `lastName`

### 2.2. Currency field'i Customer vs Product'ta USD
- **Test sonucu:** `Customer.currency="USD"` ve `Product.currency="USD"` kabul edildi (Invoice de OK).
- **Belirsizlik:** Invoice'daki `exchangeRate` field'i manuel giriliyor, TCMB fetch yok. UI'da kullanici bugunku kuru otomatik mi gorecek yoksa elle mi girecek?
- **Oneri:** Invoice create endpoint'inde `exchangeRate` null ise backend `DateTime` uzerinden o gunun TCMB kurunu otomatik cekmeli (ExchangeRateService var mi kontrol edilmeli).

### 2.3. Invoice status transitioning
- **Senaryo:** Create (DRAFT) -> Send (SENT) -> Paid (PAID). `PUT /Invoice/{id}/status` endpoint'i kullaniliyor, `{ "status": "SENT" }` body ile.
- **Belirsizlik:** UI'da "Gonder" butonu ile otomatik SENT mi yapiliyor, yoksa draft create'ten sonra ayri bir action mi? Senaryoda bu "KAYDET -> Gonderildi yap" olarak belirtilmis. API iki adim gerektiriyor.
- **Oneri:** Tek query parameter ile `POST /Invoice?autoSend=true` veya UI create form'unda "kaydet" ile "kaydet+gonder" butonlarini ayri goster.

### 2.4. Payment `financialAccountId` vs `accountId`
- **Test sonucu:** `financialAccountId` payload ile 201 OK. Ancak cnc_e2e.py'da bu field atlanmisti (400 degil, default bir hesap kullanildi).
- **Oneri:** Payment modeline zorunlu `financialAccountId` validation eklenmeli — aksi halde yanlis hesaba yaslanir.

---

## 3. Hayati kolaylastiracak yeni endpoint onerileri

### 3.1. `POST /Onboarding/quick-setup`
Senaryo Faz 0-6'yi 1 cagri ile yapacak. Payload:
```json
{
  "sector": "defense",
  "warehouses": ["HAMMADDE", "MAMUL", "SEVKIYAT"],
  "financialAccounts": [
    {"name": "Ana Kasa", "type": "CASH", "currency": "TRY", "balance": 0}
  ],
  "shifts": ["Sabah 07-15", "Aksam 15-23"],
  "demoData": true
}
```
Yoruma: Sprint 11 "5 dk Onboarding" hedefinin API destekli versiyonu.

### 3.2. `POST /Sales/{id}/auto-produce`
Acilik: Sales approve sonrasi `POST /Sales/{id}/auto-produce` ile explicit olarak production olusturacak endpoint. Response `{productionId, workOrderIds[]}` dondurur. BUG-03'un yerine saf-auto mekanizmaya guvenmek yerine kontrollu yaklasim.

### 3.3. `GET /Dashboard/defense` — Savunma sektoru dashboard
Senaryo FAZ 22'de "savunma profiline uygun menu" isteniyor. Dashboard API'sinin sektor-bazli widget donmesi:
- AS9100 NCR sayaci
- Seri numara izlenebilirlik yuzdesi
- Kalibrasyon gecerlilik durumu
- USD kur risk pozisyonu

### 3.4. `POST /Exchange/fetch-tcmb` — Manual tetik
Senaryo 22.7 "TCMB Guncelle" butonu. Su an endpoint bulunmadi. Gunluk cron job + manuel tetik endpoint'i gerekli.

### 3.5. `POST /Ncr/{id}/disposition` — NCR karar flow
Senaryo 11A.3 "NCR karari: Rework". Su an NCR create'inden sonra karar vermek icin ayri endpoint yok — `PUT /Ncr/{id}` ile full payload gonderilir. `POST /Ncr/{id}/disposition` + body `{action: "REWORK|SCRAP|RETURN", responsibleId, targetDate}` daha ergonomik.

### 3.6. `GET /Report/customer-aging?customerId={id}&asOf={date}&currency=USD`
Musteri bazli yaslandirma + currency conversion tek cagrida.

---

## 4. Workflow eksikleri

### 4.1. Otomatik stok dusme (material consumption)
- **Senaryo beklentisi:** Production baslarken BOM'a gore `StockReceipts` (OUT) otomatik olusmali ve stok dusmeli.
- **Test gozlemi:** Production otomatigi test edilemedi (BUG-03), manuel StockReceipt OUT olusturma denenmedi. Ancak API'da `POST /Production/{id}/consume-materials` gibi bir endpoint de bulunamadi.
- **Oneri:** Production start'ta veya work order step tamamlanirken otomatik material consumption.

### 4.2. Otomatik mamul girisi
- **Senaryo beklentisi:** Son adim (Son Kontrol) tamamlaninca mamul depoya otomatik girer.
- **Test gozlemi:** Production tamamlanma flow'u test edilemedi.
- **Oneri:** `POST /Production/{id}/complete` endpoint'i mamul stok girisi otomatik yapmali.

### 4.3. NCR -> Sevkiyat blocklama
- **Senaryo:** Kalite sorunu olan parti, sevkiyatta bloklanmali.
- **API gozlemi:** NCR status transitions, NCR-product iliskisinin sevkiyat moduluyle baglanti kurup kurmadigi test edilmedi.

### 4.4. Invoice otomatik Sales ile link
- **Test gozlemi:** `POST /Invoice` kendi basina cagrildi, Sales ile otomatik bagli degil. Sales modeli `Invoice` field'i iceriyor mu belirsiz. Manuel link gerekebilir.
- **Oneri:** `POST /Sales/{id}/create-invoice` endpoint'i tek adimli aksi anda yayinlar.

### 4.5. Payment allocation (coklu fatura)
- **Senaryo:** Bir tahsilat bircok fatura kapatabilir.
- **API gozlemi:** `POST /Payment` body'sinde `invoiceId` tek id field'i. Multiple invoice icin ya ayri ayri Payment yaratilmasi ya da allocation concept gerek.
- **Oneri:** `POST /PaymentAllocation { paymentId, allocations: [{invoiceId, amount}] }`.

### 4.6. Real-time notification (SignalR)
- **API gozlemi:** SignalR hub var (`/hubs/notification`), ancak test script bagli degil. NCR olusturma sonrasi Kaliteci kullanicisina push gidiyor mu, operator'a is emri atanmasi notification olarak mi geliyor belirsiz.
- **Oneri:** UI'da notification dropdown + unread counter.

---

## 5. UI Ekran Tahmin Hatalari (API response yapisina bagli)

### 5.1. USD->TL donusumu gosterilmiyor riski
API'da `exchangeRate` field'i mevcut ama dual-currency display (ornegin "$100.000 = 4.300.000 TL") UI'da nasil gosterilecek? Invoice list sayfasinda iki column mu, yoksa toggle mu?
- **Oneri:** Invoice liste grid'inde hem `currency`'e gore hem de converted TRY gosterilmeli; kullanicisi tenant settings'ten varsayilan para birimini secebilmeli.

### 5.2. Stok seviye uyarisi (min stock)
- **Test:** `Product.minStock` field'i kabul ediliyor, ancak "KRITIK stok" uyarisi API'nin mi yoksa UI'nin mi hesapliyor?
- **Oneri:** `GET /Product/low-stock` endpoint'i mevcut mu test edilmedi. Yoksa UI client-side filter yapiyor olabilir — ki bu pagination'da patlar.

### 5.3. Tedarikci karnesi (supplier scorecard)
- **Senaryo 11B.5:** Gorus Optik'in kalite puani %75 olarak gosterilmesi isteniyor.
- **Test gozlemi:** `POST /SupplierEvaluation` denenmedi ama var (read probe OK). UI'da bu scorecard NCR kayitlarindan otomatik hesaplanmali.
- **Oneri:** API'da `GET /SupplierEvaluation/{supplierId}/scorecard` yeni endpoint: ortalama kalite/teslimat skorlari + son 6 aylik trend.

### 5.4. "Stok yetersiz" uyarisi Sales approve'da
- **Senaryo 14:** Roketsan Parti-2 icin stok yetersizligi uyarisi.
- **Oneri:** Sales approve action'da, `POST /Sales/{id}/validate-stock` pre-check endpoint'i UI tarafindan cagirilir, eksik malzeme listesi donduur.

---

## 6. Mobile / Touch UX (ShopFloor Terminal)

Test script ShopFloor uygulamasini sadece `GET /ShopFloor/pending-tasks` seviyesinde test etti. Senaryo Faz 10 operator deneyimini detayli isterken:
- **Buyuk butonlar** — API'nin `taskType` gibi field donmesi gerekli (UI'da renk/ikon secimi icin)
- **Numpad quantity entry** — API minimum/maximum quantity dondurmeli
- **Durus sebebi listesi** — enum degil, tenant-configured `DowntimeReasonCategory` olmasi daha iyi

**Oneri:** `GET /ShopFloor/downtime-reasons` — tenant'a ozel durus sebepleri listesi.

---

## 7. Oncelikli UX Aksiyonlari (Etki/Efor matrisi)

| # | Aksiyon | Etki | Efor |
|---|---------|------|------|
| 1 | BUG-01 (user creation 500) duzeltme | KRITIK | S |
| 2 | BUG-03 (auto production) duzeltme | YUKSEK | M |
| 3 | `POST /Role` endpoint + permission tree UI | YUKSEK | L |
| 4 | `POST /PurchaseRequest` endpoint + UI | YUKSEK | M |
| 5 | TCMB exchange rate auto-fetch | ORTA | S |
| 6 | BomExplosion tenant-aware fix | ORTA | S |
| 7 | `GET /Account` user listing | ORTA | S |
| 8 | Accounting aging/exchange route alias | DUSUK | S |
| 9 | Sales -> Invoice shortcut | ORTA | M |
| 10 | Payment allocation (coklu fatura) | ORTA | L |
