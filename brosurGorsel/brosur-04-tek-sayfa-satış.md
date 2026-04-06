# QUVEX ERP

## Fabrikani Tek Ekrandan Yoenet

---

```
+------------------------------------------------------------------+
|                                                                  |
|              [ QUVEX LOGO ]                                      |
|                                                                  |
|         Kucuk Fabrikalar Icin Buyuk ERP                          |
|                                                                  |
+------------------------------------------------------------------+

+------------------+  +------------------+  +------------------+
|   SIPARIS        |  |   URETIM         |  |   KALITE         |
|   Teklif →       |  |   Planlama →     |  |   NCR →          |
|   Siparis →      |  |   Is Emri →      |  |   CAPA →         |
|   Fatura →       |  |   Tamamlama →    |  |   Muayene →      |
|   Tahsilat       |  |   Sevkiyat       |  |   CoC Belgesi    |
+------------------+  +------------------+  +------------------+

+------------------+  +------------------+  +------------------+
|   STOK           |  |   BAKIM          |  |   KASA / BANKA   |
|   Coklu Depo     |  |   Koruyucu Plan  |  |   Nakit Takibi   |
|   Lot Takibi     |  |   OEE Dashboard  |  |   Banka Hesaplari|
|   Barkod         |  |   Ariza Kaydi    |  |   Virman/Havale  |
|   ABC Analizi    |  |   MTBF / MTTR    |  |   Hareket Defteri|
+------------------+  +------------------+  +------------------+

+------------------+  +------------------+  +------------------+
|   RAPORLAMA      |  |   AI INSIGHTS    |  |   OPERATOR       |
|   13+ Rapor      |  |   Akilli Analiz  |  |   Touch Terminal |
|   KPI Analitik   |  |   Tahmin Modeli  |  |   Barkod Tarama  |
|   Excel Export   |  |   Anomali Tespiti|  |   Offline Kuyruk |
|   Dinamik Rapor  |  |   Sektor Profili |  |   Sesli Bildirim |
+------------------+  +------------------+  +------------------+
```

---

### 8 NEDEN QUVEX

**1. HER SEY DAHIL**
14 moduel, 120+ ekran, 23 kalite alt modeulue.
Ek lisans yok, ek modeul yok.

**2. HIZLI KURULUM**
1-4 haftada devreye alma.
5 adimli sihirbaz ile sektor bazli otomatik yapilandirma.

**3. KOLAY KULLANIM**
Tuerkce arayuez, Excel benzeri veri girisi.
Enter ile huecre gecisi, akilli ueruen arama.

**4. AS9100 / ISO 9001 UYUMLU**
FAI, PPAP, SPC, FMEA, CoC, MRB...
Denetim hazir dokuemantasyon.

**5. GERCEK ZAMANLI**
SignalR anlik bildirimler, sesli uyarilar.
Canli dashboard, atolye terminali ile saha takibi.

**6. GUEVENLI**
Rol bazli erisim, denetim izi, Sentry hata takibi.
CSRF, CSP, sifrelenmis iletisim, hesap kilitleme.

**7. AI INSIGHTS**
Yapay zeka destekli analiz ve tahmin.
11 sektor profili ile akilli oeneriler.

**8. KASA / BANKA**
Nakit ve banka hesap yoenetimi, virman, havale.
Fatura odeme otomatik bakiye, TCMB doeviz kuru entegrasyonu.

---

### OPERATOR TERMINALI

```
+------------------------------------------------------------------+
|                                                                  |
|   [=] Touch-Optimize Atolye Ekrani                               |
|                                                                  |
|   +--NumPad Overlay--+    +--Is Emri Detay--------+             |
|   |  7  8  9  |GER|  |    | FRN-2026-0142          |             |
|   |  4  5  6  |SIL|  |    | Miktar: 250 / 1000     |             |
|   |  1  2  3  |  0|  |    | Durum: Devam Ediyor     |             |
|   +-------------------+    +------------------------+             |
|                                                                  |
|   [BASLAT]  [DURAKLAT]  [TAMAMLA]  [BARKOD TARA]               |
|                                                                  |
|   Glassmorphism UI  |  PWA Offline  |  Sesli Bildirim           |
+------------------------------------------------------------------+
```

---

### SAAS & MULTI-TENANCY

- Schema-per-tenant izolasyon (savunma sanayi duezeyinde)
- 11 sektor profili: CNC, Genel, Savunma/AS9100, Gida, Otomotiv, Mobilya, Tekstil, Plastik, Elektronik, Medikal, Ambalaj
- PWA: Offline calisma, kurulabilir uygulama, StaleWhileRevalidate cache
- 750+ API endpoint, 1819 test ile kanitlanmis kararlilik

---

### DASHBOARD'DA GOERDUEKLERINIZ

```
+-------+-------+-------+-------+-------+-------+
| 142   | 28    | 5     | 3     | 2     | 15K   |
|Siparis|Beklyen|Geciken|NCR    |Bakim  |Kasa TL|
+-------+-------+-------+-------+-------+-------+

[====== Is Yuekue Grafigi ======]  [== Teklif Dagilimi ==]

+-Geciken Siparisler-+  +-Stok Uyarilari-----+
| FRN-001  3 gun     |  | Vida M8   Min:100  |
| FRN-002  1 gun     |  | Civata    Min:200  |
+--------------------+  +--------------------+

+-Kalite Oezeti------+  +-Ueretim Performans-+
| NCR: 3 acik        |  | Verimlilik: %87    |
| CAPA: 2 devam      |  | Zamaninda: %92     |
| Muayene: 5 bekliyor|  | Fire: %2.1         |
+--------------------+  +--------------------+

+-Kasa / Banka-------+  +-AI Insights---------+
| Kasa: 15,240 TL    |  | Stok Tahmini: 7 gun |
| Banka: 142,500 TL  |  | Verim Trendi: ↑%3   |
| Bugun: +2,300 TL   |  | Anomali: 0          |
+--------------------+  +---------------------+
```

---

### HEMEN BASLATIN

| Adim | Yapilacak |
|------|-----------|
| 1 | Demo goeruesme planlayalim (30 dk) |
| 2 | Suereclerinizi birlikte analiz edelim |
| 3 | 1 haftada pilot sistem kuralim |
| 4 | 2 haftada tam gecis yapalim |

---

**Tel:** +90 (___) ___ __ __
**E-posta:** info@quvex.io
**Web:** quvex.io
**Demo:** demo.quvex.io

---

*Quvex — Uretiminizi dijitallestirin, kalitenizi yueseltin.*
