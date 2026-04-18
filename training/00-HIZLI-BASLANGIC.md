# Quvex ERP — Hizli Baslangic (Tum Ekip)
## 5 Dakikada Quvex'i Anla

---

## Bu Nedir?

Quvex, **kucuk-orta olcekli uretim fabrikalari** icin gelistirilen bir ERP + Kalite Yonetim platformudur.

**Tek cumle:** Siparis al → Uret → Kalite kontrol et → Faturala. Hepsi tek yerde.

---

## Kime Satiyoruz?

**3-50 tezgahli CNC/metal isleme, kaplama, montaj atolyeleri.**
Ozellikle: TUSAS, ASELSAN, Roketsan gibi firmalara parca ureten tedarikciler.

---

## Neden Biz?

| Rakipler | Sorun | Biz |
|----------|-------|-----|
| Logo/Netsis | Kalite modulu yok | **ERP + Kalite tek platform** |
| QT9/ETQ | Uretim yok, Turkce yok | **Uretim + Kalite + Turkce** |
| Excel | Izlenebilirlik yok, denetim zor | **Otomatik kayit + audit trail** |

---

## Ne Var Icinde?

```
12 Ana Modul:
├── Satis (Teklif → Siparis → Fatura)
├── Uretim (Is emri, Gantt, seri takip, fason)
├── Stok (Coklu depo, lot, barkod)
├── Satinalma (Talep → Teklif → Siparis)
├── Kalite/AS9100 (NCR, CAPA, FAI, SPC, FMEA, CoC — 20+ alt modul)
├── Muhasebe (Fatura, odeme, banka, doviz)
├── Bakim (Onleyici, OEE, kalibrasyon)
├── IK (Vardiya, egitim, yetkinlik)
├── MRP (Malzeme planlama)
├── Proje Yonetimi
├── Raporlama (KPI, AI insights)
└── Entegrasyon (e-Fatura, SignalR, PDF/Excel)
```

---

## Teknik Ozellikler (Kisaca)

- **Multi-tenant:** 50 firma ayni anda, veriler birbirinden izole
- **5 katman izolasyon:** Schema + HasQueryFilter + RLS + SignalR + API validator
- **12 sektor profili:** CNC, Savunma, Gida, Otomotiv, Mobilya, Tekstil, Plastik, Elektronik, Medikal, Ambalaj...
- **Option bazli UI:** Patron 9 menu gorur, savunma firmasi 25 menu
- **Yardim sistemi:** Her ekranda ? butonu + F1, %95 kapsam, Turkce
- **1.200+ API test, 600+ UI test, 25 tenant izolasyon testi**

---

## Detayli Rehberler

| Dokuman | Kime | Icerik |
|---------|------|--------|
| [01-SATIS-EKIBI-REHBERI.md](01-SATIS-EKIBI-REHBERI.md) | Satis | Sektor bilgisi, satis konusmasi, demo senaryo, fiyat, itiraz cevaplari |
| [02-TEKNIK-DESTEK-REHBERI.md](02-TEKNIK-DESTEK-REHBERI.md) | Teknik Destek | Mimari, konfigurasyon, SSS, sorun giderme, escalation |
| [03-TEST-EKIBI-REHBERI.md](03-TEST-EKIBI-REHBERI.md) | Test/QA | Test stratejisi, 5 kritik senaryo, regresyon checklist, bug onceliklendirme |

---

## Anahtar Rakamlar (Ezberle)

- **124** entity'de tenant filtresi (HasQueryFilter)
- **119** tabloda RLS (veritabani seviyesi izolasyon)
- **25** tenant izolasyon testi
- **20+** kalite modulu (AS9100)
- **12** sektor profili
- **~145** ekranda yardim icerigi (%95)
- **403 KB** Turkce help content
- **Fiyat:** 1.499 TL'den baslar, savunma 9.999 TL/ay
