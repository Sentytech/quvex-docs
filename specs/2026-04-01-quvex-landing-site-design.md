# Quvex.com.tr - Landing Site Design Spec

**Tarih:** 2026-04-01
**Domain:** quvex.com.tr
**Durum:** Onaylandi

## Ozet

Quvex ERP icin tanitim web sitesi. Hedef kitle: Turkiye'deki KOBI fabrika sahipleri ve uretim mudurleri.

## Kararlar

| Karar | Secim |
|-------|-------|
| Tema | Quvex Brand renkleri + gri tonlar (navy #0e2240, accent #4da6ff, primary #6366f1) |
| Ton | Hibrit: Kurumsal guvenilirlik + modern teknoloji |
| Yapi | Ana sayfa + Sektor landing page'leri (ilk etap: 2-3 sektor) |
| Fiyat | Hibrit: "...den baslayan" + teklif formu |
| Dil | Turkce oncelikli, Ingilizce altyapi hazir |
| Iletisim | Form + WhatsApp + Calendly-tarz demo rezervasyon |
| Musteri Girisi | Nav'da buton → https://quvex.io |

## Renk Paleti

- Navy: #0e2240 (logo/nav/hero/footer)
- Shield: #1a3d6d (gradient)
- Accent: #4da6ff (logo mavisi, hover, vurgular)
- Primary: #6366f1 (CTA butonlar, indigo)
- Tagline: #7a9bb8 (ikincil metin)
- Gray BG: #f4f6f8 (section arkaplan)
- White: #ffffff (kart arkaplan)
- Border: #e5e7eb (kartlar, tablolar)

## Ana Sayfa Section'lari (10 bolum)

1. **Hero** — Navy gradient, baslik, CTA butonlar, istatistik bari (14 modul, 750+ endpoint, 1819 test, 11 sektor)
2. **Guven Bari** — Desteklenen sektor logolari
3. **Problem → Cozum** — Sol: dertler / Sag: Quvex cozumleri
4. **14 Modul** — 4x4 grid, tum moduller tek bakista
5. **11 Sektor** — Sektor kartlari, her biri kendi landing page'ine link
6. **Karsilastirma Tablosu** — Excel vs Basit ERP vs SAP vs Quvex
7. **Fiyatlandirma** — 3 paket: Baslangic / Profesyonel / Kurumsal
8. **Referanslar** — Musteri yorumlari (3 kart)
9. **Son CTA** — Demo + WhatsApp + e-posta
10. **Footer** — Urun, Sektorler, Sirket linkleri + KVKK

## Sektor Landing Page'leri (Ilk Etap)

1. Savunma & Havacilik (AS9100) — en guclu USP
2. CNC & Metal Isleme — en buyuk KOBI segmenti
3. Otomotiv Yan Sanayi — PPAP/SPC gereksinimleri

Her sektor sayfasi: Hero + Zorunlu gereksinimler tablosu + Quvex karsiligi + Ornek senaryo + CTA

## Teknik Yapilandirma

- **Framework:** Static HTML/CSS/JS (hizli, SEO uyumlu, hosting kolay)
- **Responsive:** Mobile-first, tablet + desktop
- **Performans:** Lazy load, optimize gorseller, minimal JS
- **SEO:** Meta tags, Open Graph, structured data (Organization, Product)
- **Analytics:** Google Analytics 4 + Meta Pixel hazir
- **Hosting:** Statik (Netlify, Vercel veya Nginx)
- **Proje dizini:** C:\rynSoft\quvex-landing\

## Sayfa Listesi

```
index.html              — Ana sayfa
sektor/savunma.html     — Savunma & Havacilik
sektor/cnc.html         — CNC & Metal Isleme
sektor/otomotiv.html    — Otomotiv Yan Sanayi
css/style.css           — Ana stil dosyasi
css/responsive.css      — Responsive breakpoint'ler
js/main.js              — Scroll animasyonlari, WhatsApp widget, nav
img/                    — Logo, sektor iconlari, ekran goruntuleri
```
