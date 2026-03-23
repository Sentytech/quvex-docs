# Quvex ERP — Satis Modulu Gelistirme Yol Haritasi

> **Perspektif:** Satis Muduru + Teklif Hazirlayan + Ust Yonetim
> **Skor:** 7.5/10

---

## HEMEN YAPILACAKLAR

### 1. Teklif → Satis Donusum Butonu
- ACCEPTED teklifte "Satis Olustur" butonu ekle
- 1 tikla siparis olusturup yonlendir
- Dosya: OfferForm.js + OfferFormItemsPreview.js

### 2. "Gonderildi" Buton Metni Netlestir
- "Gonderildi" → "Durumu: Gonderildi Yap"
- "Email Gonder" butonu ayri ve bariz kalmali
- Kullanici karisiklarini onle

### 3. Aylik Satis Toplami Dashboard'a Ekle
- Home.js'e "Bu Ay Toplam Satis: X TL" KPI karti
- API: /Report/sales-analysis'ten cekilebilir

---

## KISA VADELI (1-2 gun)

### 4. Fatura Sablonlari
- Sik kullanilan fatura icin "Sablon Kaydet" / "Sablondan Olustur"
- Tekrarlayan faturalar icin zaman tasarrufu

### 5. Siparis → Sevkiyat Butonu
- Siparis detayinda "Sevkiyat Olustur" direkt link
- DONE durumundaki siparisler icin 1 tikla sevk

### 6. Fatura Kalan Bakiye Kolonu
- InvoiceList'e "Kalan" kolonu ekle (GrandTotal - PaidAmount)
- Kismi odeme durumlari net gorunsun

---

## MEVCUT IYI OZELLIKLER (DOKUNMA)

- [x] Teklif olusturma 4 adim (hedef: 5'ten az)
- [x] Enter ile hizli urun girisi
- [x] Otomatik fiyat hesaplama (KDV + iskonto)
- [x] PDF cikti 1 tikla
- [x] Email gonderme
- [x] Geciken siparis filtreleme (4 buton)
- [x] Operasyon uyarilari (kirmizi/turuncu tag)
- [x] Teklif donusum raporu
- [x] Cari hesap ekstre + yazdir
- [x] Toplu fatura gonderme
- [x] Revizyon sistemi
- [x] 50.000 TL ustu onay uyarisi
