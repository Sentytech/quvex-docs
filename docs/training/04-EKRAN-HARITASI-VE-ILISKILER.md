# Quvex ERP — Ekran Haritasi & Modul Iliskileri
## Dahili Ekip Egitim Dokumani

**Amac:** Her ekranin ne yaptigi, diger modullerle iliskisi, veri akisi

---

## 1. ANA IS AKISI (Buyuk Resim)

```
TEKLIF ──onay──→ SIPARIS ──uretim emri──→ URETIM ──tamamla──→ FATURA
  │                 │                        │                    │
  │                 │                        ↓                    │
  │                 │                   KALITE KONTROL             │
  │                 │                   (NCR, Muayene)            │
  │                 │                        │                    │
  │                 ↓                        ↓                    │
  │            STOK KONTROL            CoC OLUSTUR                │
  │            (yeterli mi?)           (Uygunluk Sertif.)        │
  │                 │                                             │
  │                 ↓                                             │
  │            SATIN ALMA                                         │
  │            (eksik malzeme)                                    │
  │                 │                                             │
  │                 ↓                                             │
  │            TEDARIKCI SIPARIS                                  │
  │            → Malzeme gelir                                    │
  │            → Giris muayene                                    │
  │            → Stoga girer                                      │
  └─────────────────────────────────────────────────────────────→ │
                                                          TAHSILAT
```

**Bu akis QUVEX'in kalbidir. Her modul bu zincirin bir halkasi.**

---

## 2. MODUL BAZLI EKRAN DETAYLARI

### 2.1 SATIS MODULU (Teklif + Siparis + Musteri)

| Ekran | Yol | Ne Yapar | Nereden Gelir | Nereye Gider |
|-------|-----|----------|---------------|-------------|
| Musteri Listesi | /customers | Musteri kayitlarini yonetir | — | Teklif, Siparis |
| Musteri Portali | /customer-portal | Musteri kendi siparislerini gorur | — | — |
| Teklif Listesi | /offers | Tum teklifleri listeler | — | Teklif Form |
| Teklif Form | /offers/form/:id | Teklif olustur/duzenle | Musteri secimi | Siparise donustur |
| Siparis Listesi | /sales | Onaylanan siparisleri listeler | Teklif onay | Siparis Detay |
| Siparis Detay | /sales/detail/:id | Siparis icerigi + islemler | Siparis Listesi | Uretim Emri |

**Kritik Iliski:**
```
Teklif (KABUL) → otomatik Siparis olusur
Siparis detayinda "Uretime Gonder" butonu → Uretim emri olusur
Siparis > 50.000 TL → Yonetici onay gerekir (/pending-approvals)
```

### 2.2 URETIM MODULU

| Ekran | Yol | Ne Yapar | Nereden Gelir | Nereye Gider |
|-------|-----|----------|---------------|-------------|
| Uretim Listesi | /production | Is emirlerini listeler | Siparis | Uretim Detay |
| Uretim Detay | /production/detail/:id | Is emri detayi, adimlar, malzeme | Uretim Listesi | Kalite, Fatura |
| Gantt Planlama | /production/planning | Gorsel planlama | Uretim Listesi | — |
| Kapasite | /production/capacity-scheduling | Makine doluluk | — | — |
| Atolye Terminali | /shop-floor-terminal | Operatorun gorusu | — | Is bitir, sorun bildir |
| Seri Numaralari | /serial-numbers | Parca izlenebilirlik | Uretim | CoC, Data Pack |
| Fason Isler | /subcontract-orders | Dis kaynak takibi | Uretim | Stok giris |
| MRP | /mrp | Malzeme ihtiyac planlama | Urun agaci (BOM) | Satin alma talep |

**Uretim Detay Icindeki Sekmeler:**
```
Uretim Detay (/production/detail/:id)
├── Genel Bilgi (siparis, urun, miktar, tarihler)
├── Is Emri Adimlari (kesim → isleme → olcu → paketleme)
├── Malzeme Ihtiyaci → Stok talebi olusturur
├── Seri Numaralari → Her parcaya seri no atar
├── Final Muayene → Kalite kontrol sonucu
├── CoC Olustur → Uygunluk sertifikasi (PDF)
└── Sevkiyat → Faturaya baglanir
```

**Kritik Iliski:**
```
Siparis "Uretime Gonder" → Uretim emri olusur
Uretim malzeme ihtiyaci → Stok talebi → Satin alma sureci
Uretim tamamlaninca → Stoga mamul girer
Uretim muayene gecerse → CoC olusturulabilir
Uretimde hata bulunursa → NCR acilir → CAPA baslar
```

### 2.3 STOK & DEPO MODULU

| Ekran | Yol | Ne Yapar | Nereden Gelir | Nereye Gider |
|-------|-----|----------|---------------|-------------|
| Urunler | /products | Urun ana verileri (BOM dahil) | — | Teklif, Siparis, Uretim |
| Urun Form | /products/form/:id | Urun ekle/duzenle (66 alan) | Urun Listesi | — |
| Stok Listesi | /stocks | Anlik stok durumu | — | — |
| Giris/Cikis | /stock-receipts | Stok hareketi kaydi | Satin alma, Uretim | Stok |
| Depolar | /warehouses | Depo tanimlari | — | Transfer |
| Transfer | /stock/transfers | Depolar arasi aktarim | — | Stok |
| Sayim | /stock/count | Fiziksel sayim | — | Stok duzeltme |
| Lot Takibi | /stock/lots | Parti/lot numarasi | Giris fisi | Izlenebilirlik |
| Stok Uyarilari | /stock/alerts | Min/max uyari | — | Satin alma |
| Barkod | /stock/barcode | Barkod islemleri | — | Giris/cikis |

**Kritik Iliski:**
```
Urun kaydinda "Recete (BOM)" → MRP bu receteyi kullanir
Stok < Min stok → Otomatik uyari → Satin alma talep
Lot numarasi → Uretimde izlenebilirlik → CoC'de gorulur
Stok giris fisi → Muhasebede maliyet hesabi
```

### 2.4 SATIN ALMA MODULU

| Ekran | Yol | Ne Yapar | Nereden Gelir | Nereye Gider |
|-------|-----|----------|---------------|-------------|
| Talepler | /purchase-request | Malzeme talepleri | Uretim / Manuel | Teklif toplama |
| Tedarikciler | /suppliers | Tedarikci ana verileri | — | Satin alma siparis |
| Teklif Toplama | /purchase-offers | Tedarikci teklifleri | Talep | Siparis |
| Siparis | /purchase-orders | Satin alma siparisleri | Teklif secimi | Stok giris |
| Otomatik Satin Alma | /auto-purchase | Min stok otomatik talep | Stok uyari | Talep |

**Kritik Iliski:**
```
Uretim "Malzeme Ihtiyaci" → Satin alma talebi olusur
Talep → Birden fazla tedarikciden teklif alinir
En uygun teklif secilir → Satin alma siparisi
Malzeme gelince → Stok giris fisi + Giris muayene
Giris muayene FAIL → NCR acilir
```

### 2.5 KALITE MODULU (AS9100) — 26+ Ekran

#### Ana Kalite Ekranlari

| Ekran | Yol | Ne Yapar | Tetikleyen | Sonraki Adim |
|-------|-----|----------|-----------|-------------|
| Kalite Dashboard | /quality/dashboard | Genel durum ozeti | — | — |
| **NCR** | /quality/ncr | Uygunsuzluk kaydi | Uretim/muayene hatasi | CAPA |
| **CAPA** | /quality/capa | Duzeltici/onleyici aksiyon | NCR | NCR kapatma |
| **Muayeneler** | /quality/inspections | Giris/proses/final muayene | Stok giris / Uretim | NCR (fail ise) |
| **FAI** | /quality/fai | Ilk madde muayenesi | Yeni urun/degisiklik | Uretime onay |
| **CoC** | Uretim detay icinde | Uygunluk sertifikasi | Final muayene onay | Sevkiyat |
| **SPC** | /quality/spc | Istatistiksel proses kontrol | Olcum verileri | Kontrol grafikleri |
| Kalibrasyon | /quality/calibration | Olcum aleti takibi | Periyodik | Hatirlatma |
| Egitim | /quality/training | Personel egitim kaydi | IK ihtiyac | Yetkinlik matrisi |
| Ic Denetim | /quality/internal-audit | AS9100 ic audit | Yillik plan | Bulgu → CAPA |

#### Kalite Iliski Haritasi

```
GIRIS MUAYENE
  Malzeme geldi → Muayene → FAIL → NCR ac → Tedarikci NCR
                           → PASS → Stoga al

PROSES MUAYENE
  Uretim sirasinda → Olcu kontrol (SPC) → Tolerans disi → NCR ac
                                         → Tolerans ici → Devam

FINAL MUAYENE
  Uretim bitti → Final kontrol → FAIL → NCR → CAPA → Yeniden uretim
                                → PASS → CoC olustur → Sevk et

NCR → CAPA AKISI
  NCR acildi → Ciddiyet belirlendi (Minor/Major/Critical)
  → CAPA baslatildi → Kok neden analizi
  → Duzeltici aksiyon tanimlandi → Aksiyon tamamlandi
  → Etkinlik dogrulamasi → NCR kapatildi

FAI AKISI
  Yeni urun → FAI baslat → Karakteristik tanimla
  → Olcum yap → Kabul/Red → KABUL ise uretime onay

SPC AKISI
  Kontrol plani olustur → Olcum verisi gir (25+ nokta)
  → X-bar, R chart → Cp, Cpk hesapla
  → Kontrol disi → Alarm → NCR
```

### 2.6 MUHASEBE MODULU

| Ekran | Yol | Ne Yapar | Nereden Gelir | Nereye Gider |
|-------|-----|----------|---------------|-------------|
| Fatura Listesi | /invoices | Satis + alis faturalari | Siparis/Uretim | Tahsilat |
| Fatura Form | /invoices/form/:id | Fatura olustur/duzenle | Siparis detay | e-Fatura |
| Sevkiyat | /accounting/shipped | Gonderilen siparisler | Uretim tamamla | Fatura |
| Faturalanan | /accounting/billed | Faturasi kesilen isler | Fatura | — |
| Vade Analizi | /accounting/aging | Vade takibi | Fatura | — |
| Cek/Senet | /accounting/negotiable-instruments | Cek/senet takibi | — | — |
| Doviz Kurlari | /accounting/exchange-rates | TCMB otomatik | Hangfire job | Fatura (doviz) |
| Banka Mutabakat | /bank-reconciliation | Banka ekstresi eslestir | Banka | — |

### 2.7 BAKIM MODULU

| Ekran | Yol | Ne Yapar | Nereden Gelir | Nereye Gider |
|-------|-----|----------|---------------|-------------|
| Bakim Planlari | /maintenance | Onleyici bakim takvimi | Makine tanimlari | Is emri |
| OEE | /oee | Makine verimlilik | Uretim verileri | — |
| MTBF/MTTR | /mtbf-mttr | Ariza analizi | Makine arizalari | — |
| Takvim | /maintenance/integrated-calendar | Bakim + uretim takvimi | — | — |

### 2.8 AYARLAR MODULU

| Ekran | Yol | Ne Yapar | Neden Onemli |
|-------|-----|----------|-------------|
| Kullanicilar | /settings/users | Kullanici yonetimi | Rol atama (Operator, Kalite, Admin) |
| Roller | /settings/rollers | Yetki gruplari | Hangi modul kime acik |
| Makineler | /settings/machines | Tezgah tanimlari | Uretim + OEE + bakim |
| Birimler | /settings/units | Olcu birimleri | Tum modullerde kullanilir |
| Is Emri Sablonlari | /settings/work-order-templates | Uretim sablonu | Is emri olusturmada kullanilir |
| Is Emri Adimlari | /settings/work-order-steps | Isleme adimlari | Is emri akisini belirler |
| Malzeme Tipleri | /settings/material-types | Hammadde siniflama | Stok ve satin alma |
| KVKK | /settings/kvkk | Veri koruma | GDPR uyumluluk |
| Audit Trail | /settings/audit-trail | Kim ne yapti? | Denetim kaniti |
| Modul Yonetimi | Ayarlar > Moduller | Hangi modul acik/kapali | Sektor profili |

---

## 3. VERI AKIS MATRISI

**Hangi modul hangi modulun verisini kullanir:**

```
              Teklif Siparis Uretim Stok  Satin  Fatura Kalite Bakim
Teklif          -     →       -     -      -      -      -      -
Siparis         ←     -       →     ↔      →      →      -      -
Uretim          -     ←       -     ↔      →      →      →      →
Stok            -     -       ↔     -      ←      ↔      ←      -
Satin Alma      -     -       ←     →      -      →      ←      -
Fatura          -     ←       ←     -      ←      -      -      -
Kalite          -     -       ↔     ←      ←      -      -      -
Bakim           -     -       ←     -      -      -      -      -

→ = veri gonderir  ← = veri alir  ↔ = iki yonlu  - = dogrudan iliski yok
```

---

## 4. OPERATOR GORUSU vs PATRON GORUSU

### Operator (Atolye Terminali)

```
Operatorun gordugu: 4 buyuk buton
┌───────────┐ ┌───────────┐
│ ISLERIM   │ │ SORUN     │
│ (3 adet)  │ │ BILDIR    │
└───────────┘ └───────────┘
┌───────────┐ ┌───────────┐
│ IS BITIR  │ │ MALZEME   │
│           │ │ TALEP     │
└───────────┘ └───────────┘

Operator bilmesi gereken:
1. Atanan isi gor
2. "Baslat" tikla
3. Isleme bitince "Tamamla"
4. Sorun varsa "Sorun Bildir" (NCR olusturur)
5. Malzeme lazimsa "Malzeme Talep"
```

### Patron (CNC Profili — 9 Menu)

```
Patronun gordugu:
1. Anasayfa → Bugunun ozeti (bekleyen/devam/geciken)
2. Musteriler → Kim siparis veriyor
3. Teklifler → Kime ne teklif ettik
4. Siparisler → Ne siparis aldik
5. Uretim → Ne uretiyoruz, nerede
6. Stok → Ne var depoda
7. Faturalar → Kime ne kestik
8. Bildirimler → Ne oldu
9. Ayarlar → Kullanici, birim
```

### Kalite Muduru (Savunma Profili)

```
Kalite mudurunun ek gordugu (patronunkine ek):
- Kalite Dashboard → Ozet
- NCR Listesi → Acik uygunsuzluklar
- CAPA → Duzeltici aksiyonlar
- Muayeneler → Giris/proses/final
- FAI → Ilk madde muayenesi
- SPC → Istatistiksel kontrol
- Kalibrasyon → Alet takibi
- Ic Denetim → Audit plani
- Egitim → Personel yetkinlik
- Dokuman Onay → Kalite dokumanlar
```

---

## 5. KRITIK ISLEM ADIMLARI (Adim Adim)

### Senaryo: TUSAS'tan Siparis Geldi

```
Adim 1: TEKLIF OLUSTUR
  Ekran: /offers/form
  - Musteri: TUSAS
  - Urun: Ti-6Al-4V Baglanti Parcasi
  - Miktar: 50 adet
  - Birim fiyat: 1.200 TL
  - Teslim suresi: 45 gun
  → Kaydet → PDF gonder

Adim 2: TEKLIF KABUL → SIPARIS
  Ekran: /offers (listeden sec)
  - Durum: KABUL EDILDI
  → Otomatik siparis olusur

Adim 3: SIPARIS → URETIM
  Ekran: /sales/detail/:id
  - "Uretime Gonder" butonu tikla
  → Is emri olusur

Adim 4: MALZEME KONTROL
  Ekran: /production/detail/:id → Malzeme sekmesi
  - Ti-6Al-4V cubuk stokta var mi?
  - Yoksa → Satin alma talebi olustur

Adim 5: URETIM BASLAT
  Ekran: /shop-floor-terminal (Operator)
  - Operator isi gorur
  - "Baslat" tiklar
  - CNC programini calistirir

Adim 6: OLCU KONTROL (SPC)
  Ekran: /quality/spc
  - Her 5. parcada olcu al
  - X-bar chart'a gir
  - Tolerans icinde mi?

Adim 7: SORUN BULUNURSA → NCR
  Ekran: /quality/ncr → Yeni NCR
  - "3 adet parcada tolerans asimi"
  - Ciddiyet: Minor
  - CAPA baslat → Kok neden: "Takim asinmasi"
  - Aksiyon: "Takim degistirme periyodu kisalt"

Adim 8: URETIM TAMAMLA
  Ekran: /production/detail/:id
  - 47 adet tamamlandi (3 hurda)
  - Seri numaralari atandi

Adim 9: FINAL MUAYENE + CoC
  Ekran: /production/detail/:id → Final Muayene sekmesi
  - Muayene sonucu: KABUL
  - CoC Olustur → PDF indir

Adim 10: FATURA KES
  Ekran: /invoices/form
  - Siparis otomatik gelir
  - 47 adet x 1.200 TL = 56.400 TL + KDV
  → e-Fatura gonder

TOPLAM SURE: ~45 is gunu
KULLANILAN EKRANLAR: 10 farkli ekran, 5 modul
```

---

## 6. MODUL ILISKILERI OZET TABLOSU

| Bu modulu bilmek icin | Su modulleri de bilmen lazim |
|-----------------------|---------------------------|
| Teklif | Musteri, Urun |
| Siparis | Teklif, Musteri, Urun |
| Uretim | Siparis, Stok, Makine, Is emri sablonlari |
| Stok | Urun, Depo, Birimler |
| Satin Alma | Tedarikci, Stok, Uretim (malzeme ihtiyac) |
| Fatura | Siparis, Uretim, Musteri |
| Kalite (NCR) | Uretim, Urun, Siparis |
| Kalite (CAPA) | NCR |
| Kalite (FAI) | Urun, Olcu karakteristikleri |
| Kalite (SPC) | Kontrol plani, Urun, Uretim |
| Kalite (CoC) | Uretim, Final muayene |
| Bakim | Makine, Uretim (OEE) |
| MRP | Urun agaci (BOM), Stok, Satin alma |
