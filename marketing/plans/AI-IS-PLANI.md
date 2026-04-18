# QUVEX ERP — YAPAY ZEKA IS PLANI
## Tarih: 2026-03-15
## Katilimcilar: AI Takimi, Yazilim Ekibi, Saha/Satis, Uretim Mudurleri

---

# VERI ENVANTORI

Quvex 1 yillik kullanımda fabrika basina ~52.000-150.000 islem kaydı uretir.
126 tablo, 70+ entity, zamansal + iliskisel + kategorik veri zenginligi.
Bu veri uzerinde asagidaki AI ozelliklerini kurgulayabiliriz.

---

# MODUL BAZLI AI OZELLIK HARITASI

---

## 1. URETIM MODULU

### 1.1 Uretim Gecikme Tahmini
**Kullanici:** Uretim Muduru, Planlama Sorumlusu
**Veri Kaynaklari:** Productions (PlannedStart/End, ActualStart/End, Status), WorkOrderLogs (Start/End/Machine/User), MachineFailures, ScrapRecords
**Model:** Gradient Boosted Trees (XGBoost) — tablo verisinde en basarili
**Cikti:** Her aktif uretim icin "Gecikme Riski: %78 — Tahmini 2 gun gecikecek" uyarisi
**MVP:**
- Gecmis uretim surelerinden ortalama sapma hesapla
- Makine arizasi gecmisi + mevcut is yukune gore risk skoru uret
- Dashboard'da kirmizi/sari/yesil trafik isigi
**Saha Degeri:** "Musteriye teslimat tarihinden ONCE gecikme bilgisi verebiliyoruz"
**Teknik:** Python microservice (FastAPI) + PostgreSQL sorgu + React dashboard widget

### 1.2 Akilli Is Emri Siralama
**Kullanici:** Uretim Planlama
**Veri Kaynaklari:** Productions (Priority, PlannedDates), Machines (kapasite), WorkOrderLogs (ortalama sureler)
**Model:** Constraint-based optimization (OR-Tools veya basit heuristic)
**Cikti:** "Onerilen siralama: A parcasi > C parcasi > B parcasi (toplam sure %12 azalir)"
**MVP:**
- Makine bazli kuyruk siralama
- Oncelik + teslim tarihi + setup suresi minimize
**Saha Degeri:** "Makine bos kalma suresi %15 azaldi"

### 1.3 Operasyon Suresi Tahmini
**Kullanici:** Teklif Hazirlayan, Uretim Planlama
**Veri Kaynaklari:** WorkOrderLogs (Sure, Makine, Operator, Urun)
**Model:** Linear Regression veya Random Forest
**Cikti:** "Bu parca CNC'de tahmini 3.2 saat surecek (gecmis 47 kayda gore)"
**MVP:**
- Urun + Makine + Operasyon bazli ortalama sure
- Guven araligi (%90 olasilikla 2.8 - 3.6 saat)
**Saha Degeri:** "Teklif hazirlarken gercekci sure ve fiyat verebiliyoruz"

---

## 2. STOK MODULU

### 2.1 Talep Tahmini (Demand Forecasting)
**Kullanici:** Satinalma, Stok Sorumlusu
**Veri Kaynaklari:** Sales (tarih, urun, miktar), Productions (tuketim), StockReceipt (giris)
**Model:** Prophet (Facebook) veya basit exponential smoothing
**Cikti:** "Onumuzdeki 30 gunde M8 Civata tahmini tuketim: 4.500 adet"
**MVP:**
- Son 6-12 aylik satis/tuketim trendinden ileri tahmin
- Mevsimsellik ve trend tespiti
- Haftalik/aylik tahmin grafigi
**Saha Degeri:** "Stoksuz kalmiyoruz, fazla stok tutmuyoruz"

### 2.2 Akilli Min/Max Onerisi
**Kullanici:** Stok Sorumlusu
**Veri Kaynaklari:** StockWarehouses, Sales hizi, tedarik lead time
**Model:** Safety stock formula (istatistiksel) + demand forecast ciktisi
**Cikti:** "M8 Civata icin Min: 2.000, Max: 6.000, Siparis Noktasi: 3.500 onerilir"
**MVP:**
- Her urun icin son 90 gunluk tuketim hizi
- Tedarikci ortalama teslim suresi
- Servis seviyesi (%95) hedefine gore min/max hesapla
**Saha Degeri:** "Excel'de elle hesaplamak yerine sistem otomatik oneriyor"

### 2.3 Yavaş Hareket Eden Stok Tespiti
**Kullanici:** Stok Muduru, Finans
**Veri Kaynaklari:** StockWarehouses + son hareketler + StockReceipt tarihleri
**Model:** Kural bazli (son 90/180 gun hareket yok = yavas)
**Cikti:** "23 urun 180+ gundur hareket gormuyor. Toplam deger: 45.000 TL"
**MVP:** Basit sorgu + dashboard karti
**Saha Degeri:** "Olue stogu tespit edip nakde ceviriyoruz"

---

## 3. KALITE MODULU

### 3.1 Kalite Anomali Tespiti
**Kullanici:** Kalite Muduru
**Veri Kaynaklari:** IncomingInspection (olcum degerleri), ScrapRecords, NCR
**Model:** Statistical Process Control (SPC) + Z-score anomali
**Cikti:** "Son 3 partideki M8 Civata cap olcumu trendi dusme gosteriyor — kontrol limiti asilmak uzere"
**MVP:**
- SPC verilerinden otomatik trend analizi
- Kontrol limiti asilma uyarisi (push notification)
- Western Electric rules otomatik kontrol
**Saha Degeri:** "Hatali parca musteriye gitmeden yakaliyoruz"

### 3.2 Tedarikci Risk Skoru
**Kullanici:** Satinalma, Kalite
**Veri Kaynaklari:** IncomingInspection (accept/reject), PurchaseOrder (teslimat zamani), NCR (tedarikci kaynakli)
**Model:** Weighted scoring (teslimat + kalite + fiyat + iletisim)
**Cikti:** "Tedarikci ABC Ltd: Risk Skoru 72/100 — Son 6 ayda %8 ret orani, ortalama 3 gun gecikmeli teslimat"
**MVP:**
- Kabul/ret orani hesaplama
- Teslimat performansi (zamaninda oran)
- Otomatik puanlama ve siralama
**Saha Degeri:** "Tedarikci seciminde veriye dayali karar veriyoruz"

### 3.3 NCR Kok Neden Siniflandirici
**Kullanici:** Kalite Muhendisi
**Veri Kaynaklari:** NCR (Description, RootCause, Severity), ScrapRecords (Reason enum)
**Model:** Text classification (TF-IDF + Naive Bayes) veya kural bazli
**Cikti:** "Bu NCR'nin tahmini kok nedeni: HAMMADDE HATASI (%67 guevenle)"
**MVP:**
- Gecmis NCR aciklamalarindan kategori onerisi
- En sik 5 kok neden siralama
**Saha Degeri:** "CAPA surecini hizlandiriyoruz"

---

## 4. BAKIM MODULU

### 4.1 Kestirimci Bakim (Predictive Maintenance)
**Kullanici:** Bakim Muduru, Uretim Muduru
**Veri Kaynaklari:** MachineFailures (tarih, kok neden, durus suresi), MaintenanceWorkOrders, WorkOrderLogs (makine calisma saatleri)
**Model:** Survival Analysis veya basit MTBF trend
**Cikti:** "CNC-01 makinesi icin tahmini sonraki ariza: 12 gun icinde (%73 olasilik)"
**MVP:**
- Makine bazli MTBF hesaplama ve trend
- Son ariza tarihinden beri gecen sure / ortalama MTBF orani
- Kirmizi/sari/yesil risk gostergesi
**Saha Degeri:** "Plansiz durus %40 azaldi"

### 4.2 Bakim Maliyet Optimizasyonu
**Kullanici:** Bakim Muduru, Finans
**Veri Kaynaklari:** MaintenanceWorkOrders (ActualCost, Duration), MachineFailures (RepairCost)
**Model:** Cost-benefit analizi (koruyucu bakim maliyeti vs ariza maliyeti)
**Cikti:** "CNC-01 icin aylik koruyucu bakim: 2.000 TL → Ariza olmasa kazanim: 15.000 TL/ay"
**MVP:**
- Makine bazli toplam bakim maliyeti vs ariza maliyeti karsilastirma
- ROI hesaplama
**Saha Degeri:** "Bakim butcesini veriyle savunuyoruz"

---

## 5. SATIS MODULU

### 5.1 Teklif Donusum Tahmini
**Kullanici:** Satis Muduru
**Veri Kaynaklari:** Offers (status, fiyat, musteri, tarih), Sales (donusen teklifler)
**Model:** Logistic Regression
**Cikti:** "Bu teklifin kabul olma olasiligi: %65 — Benzer tekliflerin %72'si kabul edilmis"
**MVP:**
- Musteri gecmis donusum orani
- Teklif tutari / ortalama teklif orani
- Teklif yasi (gun) etkisi
**Saha Degeri:** "Yuksek ihtimalli tekliflere odaklaniyoruz"

### 5.2 Musteri Kayip Riski (Churn)
**Kullanici:** Satis, Yonetim
**Veri Kaynaklari:** Sales (son siparis tarihi), Offers (ret orani), Payments (gecikme)
**Model:** Kural bazli (son X ayda siparis yok = risk)
**Cikti:** "3 musteri 90+ gundur siparis vermedi — kayip riski yuksek"
**MVP:**
- Son siparis tarihi bazli uyari
- Musteri aktivite skoru
**Saha Degeri:** "Musterimizi kaybetmeden harekete geciyoruz"

---

## 6. SATINALMA MODULU

### 6.1 Otomatik Satinalma Onerisi (Akilli)
**Kullanici:** Satinalma Sorumlusu
**Veri Kaynaklari:** StockWarehouses, Talep Tahmini ciktisi, PurchaseOrder gecmisi
**Model:** Demand forecast + lead time + EOQ hesaplama
**Cikti:** "5 urun icin satinalma onerisi olusturuldu — toplam 23.000 TL, tahmini 7 gun icinde gerekli"
**MVP:**
- Stok < reorder point olan urunler
- Tahmini tuketim hizina gore miktar hesapla
- Tek tikla PO olusturma
**Saha Degeri:** "Stoksuz kalma sifira indi"

---

## 7. MUHASEBE MODULU

### 7.1 Nakit Akis Tahmini
**Kullanici:** Finans Muduru, Genel Mudur
**Veri Kaynaklari:** Invoices (DueDate, GrandTotal), Payments (tarih, tutar), PurchaseOrders (odeme vadeleri)
**Model:** Time-series projection (gecmis tahsilat hizi + vadesi gelen faturalar)
**Cikti:** "Onumuzdeki 30 gun: Tahmini gelir 450K TL, tahmini gider 320K TL, net: +130K TL"
**MVP:**
- Vadesi gelen faturalar toplami (gelir)
- Bekleyen PO odemeleri (gider)
- Gecmis tahsilat hizina gore duzeltme
**Saha Degeri:** "Nakit sikisikligi onceden goruyoruz"

### 7.2 Odeme Gecikme Tahmini
**Kullanici:** Muhasebe
**Veri Kaynaklari:** Payments (tarih vs vade), Customer (gecmis odeme davranisi)
**Model:** Musteri bazli ortalama gecikme gunu
**Cikti:** "Musteri XYZ: Ortalama 12 gun gec oduyor — bu fatura tahmini odeme: 15.04.2026"
**MVP:** Basit ortalama hesaplama
**Saha Degeri:** "Tahsilat takibini onceliklendiriyoruz"

---

## 8. RAPORLAMA MODULU

### 8.1 Dogal Dil Sorgu (NLQ)
**Kullanici:** Tum yoneticiler
**Veri Kaynaklari:** Tum tablolar
**Model:** LLM (Claude API veya GPT) + SQL generation
**Cikti:** Kullanici yazar: "Gecen ay en cok fire veren 5 urun" → Sistem tablo + grafik gosterir
**MVP:**
- 10-15 hazir soru sablonu (template-based)
- Serbest metin → parametre esleme
- Sonuc tablo + grafik
**Saha Degeri:** "Rapor icin IT'ye basvurmak yerine dogrudan soruyoruz"

### 8.2 Otomatik Anomali Raporu
**Kullanici:** Genel Mudur, Uretim Muduru
**Veri Kaynaklari:** Tum KPI ve metrikler
**Model:** Z-score / IQR bazli anomali tespiti
**Cikti:** Her sabah e-posta: "Dun 3 anomali tespit edildi: CNC-01 OEE %45'e dustu (normali %78), M8 Civata fire orani %8'e cikti (normali %2)"
**MVP:**
- Gunluk KPI snapshot
- Sapmalar icin otomatik uyari
- E-posta veya push bildirim
**Saha Degeri:** "Sorunlari dashboarda bakmadan ogreniyoruz"

---

## 9. IK MODULU

### 9.1 Vardiya Optimizasyonu
**Kullanici:** IK, Uretim Muduru
**Veri Kaynaklari:** Attendance, WorkOrderLogs (operator verimlilik), ShiftDefinition
**Model:** Basit istatistik (en verimli operator-makine eslesmesi)
**Cikti:** "A operatoru sabah vardiyasinda %22 daha verimli — sabaha atanmasi onerilir"
**MVP:**
- Operator x vardiya x makine verimlilik matrisi
- En iyi esleme onerisi
**Saha Degeri:** "Dogru kisiler dogru yerde"

---

## 10. PROJE YONETIMI MODULU

### 10.1 Proje Gecikme Erken Uyari
**Kullanici:** Proje Yoneticisi
**Veri Kaynaklari:** Project (PlannedDates, completion %), Milestones, Tasks
**Model:** Earned Value Analysis (EVM) — SPI/CPI
**Cikti:** "Proje X: SPI=0.82 — Mevcut hizla 15 gun gecikmeli tamamlanacak"
**MVP:** SPI (Schedule Performance Index) hesaplama
**Saha Degeri:** "Gecikmeyi proje ortasinda goruyoruz, sonunda degil"

---

## 11. GENEL — CROSS-MODULE AI

### 11.1 Akilli Bildirim Motoru
**Kullanici:** Tum kullanicilar
**Model:** Kural motoru + oncelik skorlama
**Cikti:** Bildirimleri oncelik sirasina gore siralar, gereksiz tekrarlari filtreler
**MVP:** Bildirim gruplama + onceliklendirme

### 11.2 Quvex Asistan (Chatbot)
**Kullanici:** Tum kullanicilar
**Model:** LLM (Claude API) + RAG (Retrieval Augmented Generation)
**Cikti:** "Gecen ayin OEE'si kacti?" → Cevap + grafik
**MVP:**
- SSS bazli yanit
- Navigasyon yardimi ("Kalibrasyon ekranina nasil giderim?")
- Basit veri sorgulari

---

# UYGULAMA YOLHARITASI

## Faz 1: TEMEL AI (Ay 1-3) — MVP
**Hedef:** Demo'da gosterilebilir, satis'ta fark yaratir

| Ozellik | Efor | Takim | Teknoloji |
|---------|------|-------|-----------|
| Talep Tahmini (basit) | 2 hafta | 1 BE + 1 FE | Python statsmodels + API endpoint |
| Akilli Min/Max Onerisi | 1 hafta | 1 BE | SQL bazli hesaplama |
| Uretim Gecikme Riski | 2 hafta | 1 BE + 1 FE | XGBoost + Dashboard widget |
| Yavas Stok Tespiti | 3 gun | 1 BE | SQL sorgu + kart |
| Tedarikci Risk Skoru | 1 hafta | 1 BE + 1 FE | Weighted scoring |
| Anomali Raporu (e-posta) | 1 hafta | 1 BE | Z-score + SMTP |
| **TOPLAM** | **~7 hafta** | **2-3 kisi** | |

**Mimari:** .NET 8 icinde yeni AIService katmani + /api/AI/* endpoint'leri
**Faz 1 Demo Mesaji:** "Quvex artik tahmin ediyor — stok, gecikme, tedarikci riski"

## Faz 2: ILERI AI (Ay 4-6)
**Hedef:** Gercek deger ureten, gunluk kullanilan ozellikler

| Ozellik | Efor | Takim | Teknoloji |
|---------|------|-------|-----------|
| Kestirimci Bakim | 2 hafta | 1 AI + 1 FE | Survival analysis |
| Teklif Donusum Tahmini | 1 hafta | 1 BE | Logistic regression |
| Nakit Akis Tahmini | 1 hafta | 1 BE | Time-series projection |
| SPC Anomali Otomatik | 2 hafta | 1 AI + 1 FE | Statistical rules engine |
| Operasyon Suresi Tahmini | 1 hafta | 1 BE | Random forest |
| Akilli Is Emri Siralama | 2 hafta | 1 AI + 1 FE | OR-Tools / heuristic |
| Musteri Kayip Riski | 3 gun | 1 BE | Kural bazli |
| **TOPLAM** | **~9 hafta** | **2-3 kisi** | |

**Faz 2 Demo Mesaji:** "Quvex makinenizin ne zaman arizalanacagini biliyor"

## Faz 3: LLM ENTEGRASYONU (Ay 7-9)
**Hedef:** "Wow" etkisi, rakiplerden tam farklilasma

| Ozellik | Efor | Takim | Teknoloji |
|---------|------|-------|-----------|
| Dogal Dil Rapor Sorgu | 3 hafta | 1 AI + 1 FE | Claude API + SQL gen |
| NCR Kok Neden Onerisi | 2 hafta | 1 AI | Text classification |
| Quvex Asistan (chatbot) | 4 hafta | 1 AI + 1 FE | Claude API + RAG |
| Vardiya Optimizasyonu | 1 hafta | 1 BE | Istatistik |
| Proje Gecikme EVM | 1 hafta | 1 BE | EVM formulleri |
| **TOPLAM** | **~11 hafta** | **2-3 kisi** | |

**Faz 3 Demo Mesaji:** "Quvex'e sorun, o cevaplasin"

---

# TEKNIK MIMARI

```
+------------------+     +------------------+     +------------------+
|  React UI        |     |  .NET 8 API      |     |  PostgreSQL      |
|  AI Dashboard    | <-> |  AIController    | <-> |  Uretim verisi   |
|  Chat Widget     |     |  AIService       |     |  126 tablo       |
|  Prediction Cards|     |  ForecastService |     |                  |
+------------------+     +------------------+     +------------------+
                                |
                         +------+------+
                         |             |
                  +------------+ +------------+
                  | Python ML  | | Claude API |
                  | FastAPI    | | (LLM)      |
                  | XGBoost    | | RAG        |
                  | Prophet    | | NLQ        |
                  +------------+ +------------+
```

**Secenekler:**
- **Basit modeller (Faz 1-2):** .NET icinde ML.NET veya dogrudan SQL istatistik
- **Ileri modeller (Faz 2-3):** Python FastAPI microservice
- **LLM (Faz 3):** Claude API (Anthropic SDK) — mevcut CLAUDE.md'de kullanim bilgisi var

---

# SAHA PERSPEKTIFI — HER ROL ICIN AI DEGERI

## Genel Mudur
- "Sabah e-postamda fabrika ozeti + anomaliler var"
- "Nakit akis tahmini ile finansal planlama yapiyorum"
- "Musterimiz gitmeden once uyari aliyorum"

## Uretim Muduru
- "Hangi siparisin gecikmesi riski var tek bakista goruyorum"
- "Makine siralama onerisiyle setup suresini azalttim"
- "Is emri suresi tahminleri teklif fiyatlandirmada kullaniyor"

## Kalite Muduru
- "SPC trendi bozan olcumde otomatik uyari geliyor"
- "NCR actigimda sistem otomatik kok neden oneriyor"
- "Tedarikci seciminde risk skoru karar vermemi kolaylastiriyor"

## Bakim Muduru
- "Makine arizalanmadan ONCE bakim planliyorum"
- "Bakim butcemi veriye dayali savunuyorum"
- "MTBF trendinden hangi makinenin degistirilmesi gerektigini goruyorum"

## Satinalma Sorumlusu
- "Sistem bana ne zaman, ne kadar siparis vermem gerektigini soyluyor"
- "Stoksuz kalmak veya fazla stok tutmak tarihe karisti"
- "Tedarikci performans karsilastirmasi tek tikla"

## Satis Muduru
- "Hangi teklifin kapanma ihtimali yuksek biliyorum"
- "Musterimin kayip riski oldugunda uyari aliyorum"
- "Teklif hazirlarken gercekci sure ve fiyat veriyorum"

## Finans Muduru
- "30 gunluk nakit akis tahmini ile borc yonetimi"
- "Hangi musterinin gec odeyecegini biliyorum"
- "Olu stok raporuyla nakde cevirme firsati goruyorum"

---

# BUTCE ve KAYNAK PLANI

## Faz 1 (3 ay)
| Kalem | Maliyet |
|-------|---------|
| 1 Senior Backend Developer (AI entegrasyonu) | Mevcut takim |
| 1 Frontend Developer (dashboard) | Mevcut takim |
| Claude API kullanimi (~100K token/gun) | ~$50-100/ay |
| Python hosting (FastAPI - opsiyonel) | ~$20-50/ay |
| **Toplam ek maliyet** | **~$150/ay** |

## Faz 2 (3 ay)
| Kalem | Maliyet |
|-------|---------|
| 1 ML Engineer (part-time veya freelance) | Ek kaynak |
| Python microservice sunucusu | ~$50-100/ay |
| **Toplam ek maliyet** | **~$200/ay + ML engineer** |

## Faz 3 (3 ay)
| Kalem | Maliyet |
|-------|---------|
| Claude API (yuksek kullanim — chatbot) | ~$200-500/ay |
| RAG icin vektör DB (pgvector) | PostgreSQL icerisinde, ucretsiz |
| **Toplam ek maliyet** | **~$500/ay** |

---

# REKABET FARKLILASMASI

| Rakip | AI Durumu | Quvex Farki |
|-------|-----------|-------------|
| MRPeasy | AI yok | Quvex: Tahmin + anomali + chatbot |
| Odoo | Basit AI (sales forecast) | Quvex: AS9100 kalite verisiyle birlesen AI |
| ERPNext | AI yok | Quvex: Entegre CMMS+OEE+AI |
| Logo | AI yok | Quvex: Turkce NLQ + uretim AI |
| SAP B1 | AI cok pahali (ek modul) | Quvex: AI dahil, ek maliyet yok |

**Benzersiz pozisyon:** "Savunma sektorunde AS9100 kalite verisini AI ile birlestiren tek KOBİ ERP'si"

---

# BASARI METRIKLERI

| Metrik | Faz 1 Hedef | Faz 2 Hedef | Faz 3 Hedef |
|--------|-------------|-------------|-------------|
| AI kullanan musteri orani | %30 | %60 | %80 |
| Stoksuz kalma azalma | %20 | %40 | %50 |
| Plansiz durus azalma | - | %25 | %40 |
| Teklif hazirlama hizi | %15 artis | %30 artis | %40 artis |
| Musteri memnuniyeti | +5 puan | +10 puan | +15 puan |
| Satis sunumunda AI demo | Var | Gelismis | "Wow" etkisi |

---

# SONRAKI ADIM

1. **Bu hafta:** Faz 1 icin teknik spike — talep tahmini prototipi
2. **2. hafta:** Dashboard AI widget tasarimi (Figma)
3. **3. hafta:** AIService + AIController iskelet kodu
4. **4. hafta:** Ilk 3 AI ozellik canli test
5. **Ay 2-3:** Geri kalan Faz 1 ozellikleri + musteri pilot

**Onay:** Bu plan onaylandiginda Faz 1 gelistirmeye baslanacaktir.
