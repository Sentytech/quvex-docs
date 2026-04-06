# Quvex ERP — Kapsamli Analiz ve Rekabet Prompt Sablonu

## Kullanim: Bu prompt'u Claude Code veya herhangi bir LLM ile kullanarak Quvex ERP'nin guncel durumunu, rakip konumlanmasini ve pazar hazirligini analiz edebilirsiniz.

---

## PROMPT 1: SAHA UZMANI ANALIZI (Field Expert Analysis)

```
Sen bir uretim muhendisi ve saha uzmanisisn. 10+ yillik kucuk ve orta olcekli fabrikalarda ERP uygulama deneyimin var. Asagidaki ERP sistemini bir fabrika sahasinda gunluk kullanim acisindan degerlendir.

## Sistem Bilgileri:
- **Urun Adi:** Quvex ERP
- **Hedef Pazar:** 10-100 calisanli uretim KOBi'leri (ozellikle havacilik/savunma alt yuklenicileri)
- **Teknoloji:** .NET 8 API + React 18 UI, PostgreSQL, Redis, Docker/Kubernetes
- **Mimari:** Cok kiracili SaaS (schema-per-tenant)

## Mevcut Moduller:
### Uretim (Production)
- Is emri yonetimi (WorkOrder + Steps + Templates)
- Uretim planlama (Gantt, kapasite)
- Shop Floor Terminal (dark tema, mobil-optimize, 80px butonlar, tam ekran)
- OEE hesaplama
- Hurda/fire takibi (ScrapRecord)
- Fason takibi (SubcontractOrder)
- Uretim maliyet raporu

### Kalite (Quality — AS9100 tam paket)
- NCR (Uygunsuzluk Raporu)
- CAPA (Duzeltici/Onleyici Faaliyet)
- 8D Problem Cozme (D1-D8 adimlari)
- SPC Kontrol Kartlari + Cp/Cpk/Pp/Ppk hesaplama
- Gage R&R / MSA (Olcum Sistemi Analizi)
- FAI (Ilk Urun Muayenesi — AS9102)
- FMEA (Hata Turleri ve Etkileri Analizi)
- AQL Hesaplayici (ANSI Z1.4)
- PPAP (Uretim Parcasi Onay Sureci)
- MRB (Malzeme Inceleme Kurulu)
- COPQ (Kalite Maliyetleri)
- Gelen Mal Muayenesi (otomatik tetikleme)
- Kalibrasyon takibi
- Kontrol planlari
- Ic denetim yonetimi
- Egitim kayitlari
- RMA (Iade/Garanti is akisi)
- Dokuman Kontrol (DCC — revizyon, onay, dagitim)
- Sahte Parca Onleme
- FOD (Yabanci Cisim Hasari) Kontrolu
- Konfigürasyon Yonetimi
- Ozel Proses Yonetimi
- Urun Guvenligi

### Stok/Depo (Inventory)
- Coklu depo + lokasyon yonetimi
- Barkod okuyucu ile stok giris/cikis/transfer (mobil-optimize)
- Lot/seri takibi
- Min/Max stok uyarilari → otomatik satin alma talebi (Hangfire saatlik job)
- Stok sayim (cycle count)
- Stok degerleme (FIFO/agirlikli ortalama)
- ABC analizi (Pareto grafigi, donemsel karsilastirma)
- MTBF/MTTR guvenirlilk metrikleri

### Satin Alma (Purchasing)
- Satin alma talebi + teklif isteme
- Satin alma siparisi (PO)
- Onay mekanizmasi (tutar bazli hiyerarsi)
- Otomatik satin alma tetikleme
- Tedarikci degerlendirme
- Tedarikci portali (siparis onay, teslimat guncelleme)
- Fason siparis yonetimi

### Finans (Finance)
- Fatura yonetimi
- Odeme takibi
- Cari hesap yaslandirma analizi (aging: 0-30, 31-60, 61-90, 90+)
- Cek/Senet portfoy yonetimi (ciro, tahsilat, protesto)
- Banka mutabakati
- Doviz kuru yonetimi (TCMB gunluk otomatik cekme)
- Kur farki hesaplama
- e-Fatura altyapisi (UBL-TR)
- Maliyet kayitlari + standart maliyet

### Bakim (Maintenance — CMMS)
- Onleyici bakim planlari
- Bakim is emirleri
- Ariza kayitlari
- MTBF/MTTR hesaplama (trend grafigi, availability gauge)
- Bakim-Uretim entegre takvimi (cakisma uyarisi)
- Yedek parca stok entegrasyonu

### Raporlama & BI
- Yonetim kokpiti (Executive Dashboard — KPI kartlari, trend grafikleri, 5dk auto-refresh)
- ABC analizi (urun/musteri/tedarikci)
- Dinamik rapor olusturucu
- KPI tanimlama ve takip
- AI Insights (tahminleme, anomali tespiti)

### Diger
- KVKK uyumluluk modulu (veri envanteri, basvuru, riza, ihlal)
- i18n (Turkce + Ingilizce)
- Onay mekanizmasi (approval workflow)
- Musteri portali + Tedarikci portali
- SignalR canli bildirimler
- Offline-first destegi (IndexedDB queue)
- PWA (Progressive Web App)

## Degerlendirme Kriterleri:
1. **Saha Kullanilabilirligi** — Fabrika ortaminda gunluk kullanim kolayligi
2. **Operasyonel Kapsam** — Bir KOBi fabrikasinin tum ihtiyaclarini karsilar mi?
3. **Kalite Yonetimi Derinligi** — AS9100 denetiminden gecer mi?
4. **Entegrasyon** — Moduller arasi veri akisi kopuk mu?
5. **Eksik Ozellikler** — Hangi kritik ozellikler hala eksik?
6. **Rekabetci Konum** — Turkiye'deki alternatiflerle karsilastirildiginda nerede?

Lutfen her kriter icin 1-10 puan ver ve detayli yorum yap. Sonunda "sahada kullanima hazir mi?" sorusuna net cevap ver.
```

---

## PROMPT 2: KALITE UZMANI ANALIZI (Quality Expert Analysis)

```
Sen AS9100 Rev D bas denetcisisin. 15+ yil havacilik/savunma sektorunde kalite yonetim sistemi kurma ve denetleme deneyimin var. Asagidaki ERP sisteminin kalite modullerini AS9100 uyumlulugu acisindan degerlendir.

[Yukaridaki sistem bilgilerini buraya yapistir]

## Degerlendirme Kriterleri (AS9100 Maddeleri):

### Madde 4 — Organizasyon Baglami
- Risk tabanli dusunme destegi (FMEA, Risk Degerlendirme)
- Paydas gereksinimleri takibi

### Madde 7 — Destek
- 7.1.5: Olcum izlenebilirligi (Kalibrasyon)
- 7.1.6: Organizasyonel bilgi (Dokuman Kontrol)
- 7.2: Yetkinlik (Egitim kayitlari, Yetkinlik Matrisi)
- 7.5: Dokumante edilmis bilgi (DCC, revizyon kontrolu)

### Madde 8 — Operasyon
- 8.1: Operasyonel planlama (Uretim planlama, is emri)
- 8.2: Urun gereksinimleri (Sozlesme inceleme)
- 8.3: Tasarim gelistirme (Design Development)
- 8.4: Disaridan temin (Tedarikci degerlendirme, gelen mal muayene)
- 8.5: Uretim ve hizmet sunumu (SPC, proses kontrolu)
- 8.5.2: Tanimlama ve izlenebilirlik (Lot/Seri, Konfigürasyon)
- 8.5.3: Musteri/dis saglayici mulku (Customer Property)
- 8.6: Urun serbest birakma (FAI, Final Inspection)
- 8.7: Uygun olmayan ciktilar (NCR, MRB, CAPA)

### Madde 9 — Performans Degerlendirme
- 9.1: Izleme, olcme, analiz (KPI, SPC, OEE)
- 9.2: Ic denetim
- 9.3: Yonetimin gozden gecirmesi (Executive Dashboard)

### Madde 10 — Iyilestirme
- 10.2: Uygunsuzluk ve duzeltici faaliyet (NCR + CAPA + 8D)
- 10.3: Surekli iyilestirme

### AS9100 Ozel Gereksinimler
- Sahte parca onleme (Counterfeit Part Prevention)
- FOD kontrolu
- Ozel proses yonetimi
- Ilk urun muayenesi (FAI — AS9102)
- PPAP
- Konfigürasyon yonetimi

Her madde icin:
1. Karsilaniyor mu? (Evet/Hayir/Kismi)
2. Kanit nedir? (Hangi modul karsilar)
3. Eksik ne var?
4. Denetim riski (Dusuk/Orta/Yuksek)

Sonunda genel AS9100 uyumluluk puani ver (0-100) ve "denetimden gecer mi?" sorusuna net cevap ver.
```

---

## PROMPT 3: RAKIP ANALIZI (Competitive Analysis)

```
Sen bir ERP pazar analisti ve strateji danismanisin. Asagidaki urun icin Turkiye ve global pazarda rekabet analizi yap.

## Urun: Quvex ERP
- Hedef: 10-100 calisanli Turk uretim KOBi'leri (ozellikle havacilik/savunma)
- 137 API Controller, 806+ endpoint, 103 domain entity
- Tam AS9100 kalite paketi (20+ modul)
- Cok kiracili bulut SaaS
- Turkce + Ingilizce
- e-Fatura, KVKK, TCMB, Cek/Senet destegi

## Karsilastirilacak Rakipler:

### Turkiye Pazari:
1. Logo Yazilim (Tiger, Netsis) — Pazar lideri
2. Mikro Yazilim — KOBi segmenti
3. Canias ERP — Uretim odakli
4. Dia Yazilim — Bulut Turk ERP
5. IAS — Uretim ERP

### Global Bulut:
6. Katana MRP — KOBi uretim
7. MRPeasy — Kucuk uretici
8. Odoo Manufacturing — Acik kaynak
9. SAP Business One — KOBi tier
10. Oracle NetSuite — Bulut ERP

## Her rakip icin analiz et:
1. Hedef pazar ve fiyat
2. Kalite yonetimi derinligi (NCR, CAPA, SPC, 8D, FAI var mi?)
3. AS9100 uyumlulugu
4. Turk yerellesitmesi (e-Fatura, KVKK, Turkce)
5. Mobil/saha ozellikleri
6. Cok kiracili SaaS mi?

## Sonuc olarak:
1. Quvex'in rekabetci USP'si (Unique Selling Proposition) nedir?
2. Hangi segmentte kazanir?
3. Hangi segmentte kaybeder?
4. Pazar giris stratejisi onerileri
5. Fiyatlama onerisi (aylik kullanici basi)
```

---

## PROMPT 4: PAZAR HAZIRLIK KONTROLU (Go-to-Market Checklist)

```
Asagidaki ERP urununun pazara cikis hazirligini kontrol et. Her madde icin Hazir/Eksik/Kismi durumu belirt.

[Sistem bilgilerini buraya yapistir]

## Kontrol Listesi:

### Urun Hazirlik
- [ ] Tum moduller calisir durumda
- [ ] API build 0 hata
- [ ] Unit test kapsami ≥%80
- [ ] E2E testler tum kritik akislari kapsiyor
- [ ] Performans testi (100 concurrent user)
- [ ] Guvenlik testi (OWASP Top 10)
- [ ] Mobil/tablet uyumluluk testi
- [ ] Cevrimdisi (offline) calisma testi

### Yasal & Uyumluluk
- [ ] GIB e-Fatura entegratoru bagli (Foriba/Sovos/Logo)
- [ ] KVKK uyumluluk (veri envanteri, aydinlatma metni)
- [ ] TDMS hesap plani destegi
- [ ] KDV beyanname format destegi
- [ ] Ba/Bs formu otomasyonu
- [ ] e-Defter destegi
- [ ] Kisisel verilerin yurt disina aktarimi politikasi

### Altyapi
- [ ] Turkiye'de hosting (data residency)
- [ ] SSL/TLS sertifikasi
- [ ] Yedekleme politikasi (RPO < 1 saat)
- [ ] Felaket kurtarma plani (RTO < 4 saat)
- [ ] Uptime SLA ≥%99.5
- [ ] DDoS korumasi
- [ ] Log yonetimi ve izleme (Sentry, Seq)

### Dokumantasyon
- [ ] Kullanici kilavuzu (Turkce)
- [ ] API dokumantasyonu (Swagger)
- [ ] AS9100 validasyon paketi (IQ/OQ/PQ)
- [ ] Veri goc rehberi
- [ ] Egitim videolari
- [ ] SLA dokumani

### Satis & Pazarlama
- [ ] Web sitesi (landing page)
- [ ] Demo ortami (sandbox tenant)
- [ ] Fiyat listesi
- [ ] 2-3 pilot musteri (referans)
- [ ] Satis sunumu / pitch deck
- [ ] ROI hesaplayici
- [ ] Rakip karsilastirma tablosu

### Destek
- [ ] Destek kanali (email/chat/telefon)
- [ ] SLA tanimi (yanit suresi)
- [ ] Bilgi bankasi / FAQ
- [ ] Onboarding sureci tanimli
- [ ] Geri bildirim mekanizmasi

Her eksik madde icin: oncelik (Kritik/Yuksek/Orta/Dusuk), tahmini sure, ve cozum onerisi belirt.
```

---

## PROMPT 5: TEKNIK BORC VE MIMARI ANALIZ

```
Sen bir yazilim mimari ve teknik borc uzmanisisn. Asagidaki ERP projesinin teknik borcunu ve mimari sagligini degerlendir.

## Proje Bilgileri:
- Backend: .NET 8, EF Core, PostgreSQL, 137 controller, 103 entity
- Frontend: React 18, Vite, Ant Design, Redux Toolkit, 150 route
- Mimari: Clean Architecture (kismi goc — ~35% tamamlanmis)
- Test: 71 UI test dosyasi, API testleri mevcut
- Multi-tenancy: Schema-per-tenant + HasQueryFilter
- Caching: Redis + in-memory fallback
- Background: Hangfire (saatlik stok kontrol, gunluk TCMB kur)
- Real-time: SignalR

## Degerlendir:
1. Clean Architecture goc durumu — ne kadar tamamlandi?
2. DbContext'in API katmaninda olmasi sorunu
3. Service katmaninin API'de mi Application'da mi oldugu
4. DTO/Entity ayrimlari tutarli mi?
5. N+1 query riskleri
6. Pagination kapsami (137 controller'dan kacinda var?)
7. Error handling tutarliligi
8. Logging/monitoring yeterliligi
9. Test kapsami yeterliligi
10. Guvenlik aciklari (OWASP Top 10)

Her alan icin 1-10 puan ver. Sonunda toplam teknik borc puani ve "uretim ortamina deploy edilebilir mi?" sorusuna cevap ver.
```

---

## Kullanim Notlari:

1. **Prompt'lari tek tek kullanin** — Her biri farkli bir uzman perspektifi saglar
2. **Sistem bilgilerini guncelleyin** — Controller/entity/route sayilarini guncel tutun
3. **Ciktilari birlestirin** — 5 analizin sonuclarini tek bir karar matrisinde toplayin
4. **Periyodik tekrarlayin** — Her sprint sonunda Prompt 1 ve 5'i tekrarlayin
5. **Rakip analizini 3 ayda bir guncelleyin** — Pazar hizla degisiyor

---

## Guncel Istatistikler (29 Mart 2026):

| Metrik | Deger |
|--------|-------|
| API Controller | 137 |
| API Endpoint | 806+ |
| Domain Entity | 103 |
| UI Sayfa/Component | 201 |
| UI Service | 118 |
| Route | 150 |
| Test Dosyasi | 71 (UI) |
| Build Durumu | 0 Hata |
| Genel Olgunluk | %80 |
| AS9100 Kapsam | %90+ |
