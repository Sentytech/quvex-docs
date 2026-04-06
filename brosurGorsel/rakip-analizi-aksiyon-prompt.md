# QUVEX ERP — RAKIP ANALIZI SONRASI AKSIYON PROMPT'U

Bu prompt'u Claude Code veya baska bir AI aracinda kullanarak
Quvex'in eksik ozelliklerini sistematik olarak planlayabilirsiniz.

---

## PROMPT:

```
Sen bir uretim sektoru ERP uzmanisin. Quvex ERP projesi icin rakip analizi
sonucunda tespit edilen eksiklikleri cozecek bir urun yol haritasi (roadmap)
olusturmanı istiyorum.

## MEVCUT DURUM

Quvex, kucuk-orta olcekli fabrikalar icin gelistirilmis bir ERP sistemidir.

Guclu yanlari:
- 12 modul, 105 ekran, 665 API endpoint, 126 DB tablosu
- AS9100 tam uyumluluk (FAI, CoC, MRB, PPAP, SPC, FMEA — 23 kalite alt modulu)
- ERP + MES + QMS + CMMS tek platformda, tek lisansla
- .NET 8 API + React 18 UI + PostgreSQL
- 1.781 otomatik test, 0 npm zafiyet
- Turkce tam arayuz, Excel-tarz veri girisi

## TESPIT EDILEN EKSIKLER (oncelik sirasina gore)

### P0 — KRITIK (satis kaybina neden oluyor)
1. MOBIL UYGULAMA: Native iOS/Android app yok. Sadece responsive web var.
   - Atolye operatoru barkod tarayamıyor, is baslat/tamamla yapamiyor
   - Yoneticiler saha disinda dashboard goremıyor
   - Push notification yok
   - Offline mod yok

2. AI / YAPAY ZEKA: Sifir AI ozelligi var.
   - Talep tahmini (demand forecasting) yok
   - Stok optimizasyonu onerisi yok
   - Uretim gecikme tahmini yok
   - OEE/kalite anomali tespiti yok
   - Dogal dil rapor sorgulama yok

3. CANLI DEMO / TRIAL: Self-service deneme ortami yok.
   - demo.quvex.io adresi yok
   - Ucretsiz trial yok
   - Potansiyel musteriler hemen deneyemiyor

### P1 — YUKSEK
4. IOT ENTEGRASYONU: OPC-UA / MQTT destegi yok, makine verisi manuel giriliyor
5. CRM MODULU: Lead/firsat yonetimi, musteri timeline yok
6. MULTI-TENANT SAAS: Tek tenant, self-service kayit ve odeme yok
7. DASHBOARD OZELLESTIRME: Kullanici widget ekleyip cikaramiyor

### P2 — ORTA
8. MULTI-LANGUAGE: Sadece Turkce, i18n altyapisi yok
9. WEBHOOK / EVENT SISTEMI: Dis entegrasyon icin olay bazli webhook yok
10. ONBOARDING WIZARD: Ilk giris rehberi, ornek veri, video tur yok
11. GELISMIS RAPORLAMA: Zamanlanmis rapor, pivot tablo, donem karsilastirma yok

### P3 — GELECEK
12. Plugin marketplace
13. Muhasebe yazilimi entegrasyonu (Logo, Luca)
14. Chatbot / yardim asistani
15. Gamification

## RAKIPLER
- MRPeasy: $49/ay, bulut, mobil app var, kalite sinirli, AS9100 yok
- Odoo: Acik kaynak, 40+ modul, IoT Box, AI var, kurulum karmasik
- ERPNext: Ucretsiz, Python, esnek, UI eski, topluluk destegi
- Logo ERP: Turkiye pazar lideri, muhasebe guclu, uretim/kalite zayif
- Canias ERP: Uretim odakli, pahali, agir

## 2026 SEKTOR TRENDLERI
- AI-Powered ERP (talep tahmin, anomali tespit, agentic AI)
- Cloud-native SaaS (multi-tenant, auto-scale)
- Mobil-first (native app, offline, push)
- IoT / Real-time (OPC-UA, MQTT, sensor data)
- Low-code ozellestirme

## ISTENEN CIKTI

Asagidaki formatta detayli bir yol haritasi olustur:

1. ONCELIK SIRASI: Hangi eksik once kapatilmali? Her biri icin
   is degeri (revenue impact), teknik karmasiklik (effort), ve
   sure tahmini ver.

2. HER OZELLIK ICIN:
   - Kullanici hikayeleri (user stories)
   - Teknik mimari onerisi (hangi teknoloji, hangi pattern)
   - MVP kapsami (minimum ne yapilmali)
   - Fase plani (MVP → V1 → V2)
   - Mevcut Quvex mimarisine entegrasyon noktalarini goster
     (hangi controller, hangi service, hangi UI component etkilenir)

3. REKABET FARKLILASMASI: Her ozellik icin Quvex'i rakiplerden
   nasil farklilastirabiliriz? Ornegin AI ozelliginde AS9100
   kalite verisiyle birlestirerek savunma sektorune ozel tahmin
   modeli olusturmak gibi.

4. GO-TO-MARKET: Her ozellik lansmaninda nasil pazarlanmali?
   - Hedef musteri segmenti
   - Satis mesaji
   - Demo senaryosu

5. KAYNAK PLANI: Her fase icin kac gelistirici, kac hafta,
   hangi teknoloji stack gerekiyor?

Yaniti Turkce olarak, teknik detaylarla, somut ve uygulanabilir
sekilde ver. Genel tavsiyeler degil, Quvex'e ozel cozumler oner.
```

---

## KULLANIM

Bu prompt'u su sekillerde kullanabilirsiniz:

1. **Claude Code'da:** Bu prompt'u yapistirin, Quvex kaynak koduna
   erisimi olan bir oturumda calistirin

2. **Claude.ai'da:** Proje bilgilerini context olarak verin,
   sonra bu prompt'u gonderin

3. **Takim toplantisinda:** Ciktiyi urun yol haritasi olarak
   kullanin, sprint planlama icin parcalayin

4. **Yatirimci sunumunda:** Rakip analizi + yol haritasi birlikte
   sunun
