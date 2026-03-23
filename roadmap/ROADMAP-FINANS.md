# Quvex ERP — Finans & Yonetim Modulu Gelistirme Yol Haritasi

> **Perspektif:** Genel Mudur + Muhasebe Sorumlusu + Sistem Yoneticisi
> **Hazirlik:** Dashboard ✅ | Faturalar ✅ | Cari ✅ | Banka ⚠️ | Raporlar ⚠️ | IK ⚠️

---

## HEMEN YAPILACAKLAR

### 1. Dashboard Tarih Araligi Secimi
- Home.js'e RangePicker ekle (son 1 hafta/ay/ceyrek/yil)
- Hardcoded monthAgo → kullanici secimi
- Export/Print butonu ekle

### 2. Fatura Kalan Bakiye Gorunumu
- InvoiceList'e "Kalan" kolonu (GrandTotal - PaidAmount)
- Kismi odeme durumlari net gorunsun

### 3. Global Arama (Search)
- Navbar'a global search ekle
- Musteri adi, fatura no, siparis no ile hizli arama
- Ctrl+K kisayol

---

## KISA VADELI (1-2 gun)

### 4. Banka Mutabakat Basitlestir
- 5 adim → 2 adim: "Eslestir" butonuna basin → otomatik oneri goster → onayla
- Eslestirme on izlemesi ekle

### 5. Odeme Kaydi Flow'u Netlestir
- Fatura detayinda "Odeme Ekle" butonu bariz olsun
- Kalan miktar otomatik gelsin

### 6. Cari Ekstre Excel Export
- CustomerStatement'a Excel indirme butonu
- Muhasebe icin zorunlu

---

## ORTA VADELI (1 hafta)

### 7. KDV Raporu
- Aylik KDV bildirimi hazirla
- Satis KDV - Alis KDV = Odenecek/Iade

### 8. Kar-Zarar Dogrulama
- Gelir = Satis faturalari
- Gider = Satin alma faturalari + iscilik + genel gider
- Standart muhasebe formati

### 9. IK Izin Yonetimi
- Yillik/hastalik izin basvuru formu
- Onay akisi (calisan → mudur → IK)
- Kalan izin gun sayisi

### 10. Favori Menuler
- Kullanici bazli "Sik Kullanilanlar" quick access
- Muhasebe: Faturalar, Ekstre, Banka hep basta

---

## MEVCUT IYI OZELLIKLER (DOKUNMA)

- [x] Dashboard 12+ KPI karti
- [x] Geciken siparis + stok uyari + kalite ozeti tek ekranda
- [x] Fatura listesi 7 durum filtresi
- [x] Toplu fatura gonderme
- [x] Cari ekstre borclu/alacakli renklendirme
- [x] Banka mutabakat otomatik eslestirme
- [x] Raporlar 8 tur + Excel export
- [x] Dinamik rapor builder 6 sablon
- [x] Bildirim sistemi (polling 60s)
- [x] Turkce tam + para birimi formatlama
- [x] Profesyonel menu yapisi (8 ana modul)
- [x] CASL permission sistemi
