# Quvex ERP — Uretim Modulu Gelistirme Yol Haritasi

> **Perspektif:** Saha Operatoru + Uretim Muduru
> **Odak:** Kolay kullanim, minimum tiklama, hizli is akisi

---

## HEMEN YAPILACAKLAR (1-2 saat)

### 1. Is Tamamlama Modal — Otomatik Tarih
- EnterCompletion modal'inda Baslangic/Bitis tarihi otomatik `moment()` gelsin
- Operator sadece miktar + personel secsin (2 alan)
- Dosya: ProductionWorkOrderStatus.js

### 2. KPI Kartlari Responsive
- `Col span={5}` → `Col xs={12} sm={8} md={6} lg={5}`
- Mobilde 2'li satir, tablette 3'lu, desktop 5'li
- Dosya: Production.js

### 3. Filtreler Acik Baslasin
- Collapse defaultActiveKey={['1']} olarak degistir
- Dosya: Production.js

### 4. Bos Layout Satirlari Temizle
- ProductionItem.js'deki bos `<Row>` satirini kaldir
- Butonlari duzgun hizala (CSS text-align)

---

## KISA VADELI (1-2 gun)

### 5. Uretim Tablosuna Makine Kolonu
- Production.js tablo'suna "Makine" kolonu ekle
- API'den machine bilgisi zaten geliyor (WorkOrderTemplate uzerinden)
- Uretim muduru "Hangi makine hangi iste?" gorebilmeli

### 6. Sag Tikla Menu Kaldir
- Quality Gate icin sag tikla menu → inline buton/switch'e cevir
- Mobilde sag tik calismaz
- Dosya: ProductionWorkOrderStatus.js

### 7. Dashboard Otomatik Yenileme
- Home.js'e 30 saniye interval ekle
- `setInterval(() => loadAll(), 30000)` + cleanup

### 8. Is Baslat/Bitir — 1 Tikla
- Uretim listesinde her satira "Baslat/Tamamla" inline buton ekle
- Modal acmadan hizli islem (miktar default = kalan miktar)

---

## ORTA VADELI (1 hafta)

### 9. Uretim Muduru Dashboard
- Ayri sayfa: Makine doluluk + Personel performans + Darbogaz
- Makine bazli: Hangi makine bosta, hangisi dolu
- Personel bazli: Kim kac is tamamladi

### 10. Gantt Drag-Drop
- Planlama icin surukle-birak destegi
- Cizelge uzerinde tarih degistirme

### 11. Kapasite Planlama — Uretim Dropdown
- CapacityScheduling form'da "Uretim ID" string → dropdown
- OxitAutoComplete ile uretim secimi

### 12. Shop Floor Terminal Optimizasyonu
- Barkod tara → Is listesi → 1 tikla tamamla
- Tek sayfa operasyon

---

## MEVCUT IYI OZELLIKLER (DOKUNMA)

- [x] Dashboard KPI kartlari zengin
- [x] Geciken siparisler kirmizi uyarili
- [x] Pie chart durum dagilimi
- [x] Progress bar (uretim + sevk)
- [x] Gantt tasarimi cok iyi
- [x] Toplu durum guncelleme
- [x] Turkce ceviri tutarli
- [x] Kapasite planlama yuzdeleri gorsel
