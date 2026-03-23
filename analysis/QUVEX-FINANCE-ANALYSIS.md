# Quvex ERP — Finansal Olgunluk Analizi
> Tarih: 2026-03-20 | Rakip Karsilastirmali

## GENEL SKOR: 5.8/10

---

## RAKIP KARSILASTIRMA

| Ozellik | Quvex | Logo Tiger | Mikro | Netsis | Parasut | SAP B1 |
|---------|-------|-----------|-------|--------|---------|--------|
| Fatura Yonetimi | 3.5 | 5 | 4.5 | 5 | 4 | 5 |
| Odeme Takibi | 3 | 5 | 4 | 5 | 4 | 5 |
| Banka Mutabakat | 3 | 5 | 4 | 5 | 4 | 5 |
| Cari Hesap | 3.5 | 5 | 4.5 | 5 | 4 | 5 |
| Maliyet Muhasebesi | 3.5 | 4.5 | 4 | 5 | 2.5 | 5 |
| Mali Raporlama | 2.5 | 5 | 4.5 | 5 | 4 | 5 |
| e-Fatura | 1 | 5 | 5 | 5 | 4.5 | 5 |
| Cok Para Birimi | 2 | 5 | 4 | 5 | 3.5 | 5 |
| Vergi Uyumu | 2 | 5 | 4.5 | 5 | 4 | 5 |
| **ORTALAMA** | **2.8** | **4.9** | **4.3** | **5.0** | **3.9** | **5.0** |

---

## KRITIK EKSIKLER (Orta Olcek Firmalar Icin Engelleyici)

### 1. Genel Muhasebe (GL) — YOK
- Hesap plani, yevmiye kaydi, mizan yok
- P&L, Bilanco uretilemiyor
- Banka kredi basvurusu yapilamiyor
- **Efor: 3-4 ay, 50-80 story point**

### 2. e-Fatura / e-Arsiv — SADECE STUB
- GIB API entegrasyonu yok (Foriba, Logo Connect vb.)
- Yasal zorunluluk — cezasi 100.000+ TL
- **Efor: 2-3 ay, 40-60 story point**

### 3. Mali Tablolar — YOK
- Gelir tablosu, bilanco, nakit akim tablosu
- Yatirimci/banka raporlama imkansiz
- **Efor: 4-6 hafta (GL'ye bagimli)**

### 4. Vergi Uyumlulugu — EKSIK
- KDV beyannamesi, stopaj raporu, damga vergisi
- BA/BS formlari
- **Efor: 4-8 hafta**

### 5. Gelismis Alacak Takibi (AR) — KISMI
- Vade analizi (30/60/90 gun) yok
- Kredi limiti zorlamasi yok (alan var, kullanilmiyor)
- Otomatik odeme hatirlatma (dunning) yok
- **Efor: 4-6 hafta**

### 6. Borc Hesaplari (AP) — YOK
- Tedarikci fatura eslestirme (3-way match)
- Odeme vade takibi, erken odeme iskontosu
- **Efor: 4-6 hafta**

### 7. Cok Para Birimi — MINIMAL
- Doviz kuru yonetimi yok
- Dovizli fatura yok
- Kur farki kar/zarar takibi yok
- **Efor: 6-8 hafta**

---

## MEVCUT GUCLU YANLAR

1. **Uretim Entegrasyonu** — Fatura→Uretim baglantisi (Parasut/Bizim Hesap'ta yok)
2. **Is Bazli Maliyet** — Uretim emri bazinda maliyet takibi
3. **AS9100 Kalite** — Ayni sistemde izlenebilirlik (benzersiz avantaj)
4. **Modern Teknoloji** — Clean Architecture + React 18 (eski sistemlere gore ustun)
5. **Multi-Tenant SaaS** — Sifirdan SaaS uyumlu
6. **API-First** — Kolay entegrasyon

---

## ONCELIKLI YOL HARITASI

### FAZ 1: Yasal Uyumluluk (Ay 1-3) — KRITIK
| # | Is | Efor | Oncelik |
|---|---|------|---------|
| 1 | e-Fatura entegrasyonu (Foriba/Logo Connect) | 60 sp | KRITIK |
| 2 | Genel Muhasebe temeli (hesap plani, yevmiye, mizan) | 50 sp | KRITIK |
| 3 | Gelir Tablosu & Bilanco | 20 sp | KRITIK |
| **Toplam** | | **130 sp** | **3 ay, 2-3 gelistirici** |

### FAZ 2: Rekabet Esitligi (Ay 4-6)
| # | Is | Efor |
|---|---|------|
| 4 | Vergi raporlama (KDV, stopaj, BA/BS) | 40 sp |
| 5 | Gelismis alacak takibi (vade, kredi, dunning) | 25 sp |
| 6 | Banka hesap ekstresi aktarimi (OFX/MT940) | 30 sp |
| **Toplam** | | **95 sp, 2.5 ay** |

### FAZ 3: Rekabet Avantaji (Ay 7-9)
| # | Is | Efor |
|---|---|------|
| 7 | Gelismis maliyet muhasebesi (ABC, maliyet merkezi) | 60 sp |
| 8 | Cok para birimi (doviz kuru, fatura, GL) | 40 sp |
| 9 | Musteri/tedarikci karlilik analizi | 25 sp |
| **Toplam** | | **125 sp, 3 ay** |

---

## SONUC

Quvex **kucuk fabrikalar** (1-20 calisan, <1M$ ciro) icin uygun.
**Orta olcek** ($1-10M, 50-200 calisan) icin eksik:
- GL + Mali tablolar (banka/yatirimci icin zorunlu)
- e-Fatura (yasal zorunluluk)
- Vergi uyumlulugu
- AR/AP tam suit

**Tahmini yatirim:** 12-15 ay, 3-4 gelistirici
