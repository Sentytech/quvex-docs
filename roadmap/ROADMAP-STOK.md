# Quvex ERP — Stok & Depo Modulu Gelistirme Yol Haritasi

> **Perspektif:** Depo Sorumlusu + Satinalma Uzmani
> **Skor:** 6.5/10

---

## HEMEN YAPILACAKLAR

### 1. Batch Stok Girisi
- StockReceiptForm'da toplu urun girisi (Ctrl+V / CSV yapistir)
- 100 malzeme tek seferde girilsin

### 2. Stok Formu Basitlestir
- 4 tab → 2 tab yap: "Genel" + "Detay"
- Depo sorumlusu icin Teknik/Kalite tab'lari gizle (rol bazli)

### 3. Min/Max Inline Edit
- Stok Uyarilari sayfasinda modal yerine satir ici duzenleme
- Hizli Min/Max/Reorder duzenleme

---

## KISA VADELI (1-2 gun)

### 4. Otomatik Satinalma Neden Atladi?
- Auto-purchase API return'de skip reason goster
- "Tedarikci tanimlanmamis" / "Min stok ayarlanmamis" gibi

### 5. Barkod Tarama → Stok Girisi Entegrasyonu
- StockReceiptForm'da barkod okutarak urun ekle
- BarcodeOperations'taki tarama mantigi yeniden kullanim

### 6. Transfer Onay Basitlestir
- Tek adimda "Olustur ve Onayla" secenegi
- Kucuk transferler icin onay gerektirmesin

### 7. Sayim PDF Cikti
- Sayim formu yazdirilabilir PDF
- Fiziksel sayim icin barkut listesi

---

## MEVCUT IYI OZELLIKLER (DOKUNMA)

- [x] 4'lu stat kartlari (Min Alti kirmizi, Siparis turuncu)
- [x] Satir renklendirmesi (kritik stoklar vurgulu)
- [x] CSV export
- [x] Otomatik satinalma onerisi 1 buton
- [x] ABC analizi Pareto grafigi
- [x] Lot takibi son kullanma uyarisi (30 gun)
- [x] Barkod tarama + etiket yazdirma
- [x] Depo lokasyonu agac yapisi
- [x] Stok hareket gecmisi
- [x] Enter ile yeni satir + auto-focus
