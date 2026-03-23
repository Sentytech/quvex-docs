# Quvex ERP — Satis Modulleri UX Sprint Plani

> **Olusturma:** 2026-03-13
> **Kapsam:** Teklif, Siparis, Fatura ekranlarinin derin analizi ve iyilestirmesi
> **Analiz Metodu:** Kullanici adim adim senaryo, kod inceleme, API/UI cross-check

---

## ANALIZ OZETI

| Modul | Kritik Bug | UX Sorunu | Eksik Ozellik | Toplam |
|-------|-----------|-----------|---------------|--------|
| Teklif (Offer) | 3 | 5 | 12 | 20+ |
| Siparis (Sales) | 3 | 5 | 10 | 18+ |
| Fatura (Invoice) | 4 | 5 | 8 | 17+ |
| **Toplam** | **10** | **15** | **30** | **55+** |

---

## SPRINT 9: Kritik Bug Fix & Veri Butunlugu

> **Hedef:** Uretimi engelleyen bug'lari duzeltmek, veri kaybi riskini sifirlamak

| ID | Baslik | Aciklama | Modul | Oncelik |
|----|--------|----------|-------|---------|
| S9-01 | DateTime.UtcNow fix | Tum DateTime.Now → UtcNow (PostgreSQL uyumu) | API | ✅ Done `c983603` |
| S9-02 | SalesController tarih filtre bug | endOpeningDate copy-paste hatasi duzeltme | API | ✅ Done `c983603` |
| S9-03 | Fatura yuvarlama hatasi | UI'da Math.round eksik — API ile tutarsiz toplam | Fatura | ✅ Done `7f8728d` |
| S9-04 | Fatura BilledQuantity guncelleme | DRAFT'ta BilledQuantity henuz artmamis — sorun yok | Fatura API | ✅ N/A (bug degil) |
| S9-05 | PurchaseOrderId kaybolmasi | CreateInvoiceRequest DTO'ya PurchaseOrderId ekle | Fatura API | ✅ Done `d44dfa3` |
| S9-06 | Iade faturada tevkifat | CREDIT_NOTE'ta tevkifat otomatik 0 olmali | Fatura | ✅ Done `7f8728d` |
| S9-07 | Teklif no thread-safety | Retry pattern ile duplicate engelleme | Teklif API | ✅ Done `d44dfa3` |
| S9-08 | Siparis durum gecis validasyonu | Backend'de gecersiz status degisimi engellenmeli | Siparis API | ✅ Done `d44dfa3` |

---

## SPRINT 10: Teklif Formu UX Iyilestirme

> **Hedef:** Teklif olusturma surecini kolay, hizli ve hatasiz yapmak

| ID | Baslik | Aciklama | Detay |
|----|--------|----------|-------|
| S10-01 | Form validasyon iyilestirme | ValidUntilDate >= OfferSentDate, zorunlu alan mesajlari | ✅ Done `6b0920b` |
| S10-02 | Hata bildirim ekleme | Tum catch bloklarina notification['error'] ekle | ✅ Done `6b0920b` |
| S10-03 | Toplam gosterimi | GrandTotal, SubTotal, TaxTotal header'da goster | ✅ Done `6b0920b` |
| S10-04 | Status renk sabitleri | Tekrar eden statusColor map'i Constants.js'e tasi | ✅ Done `6b0920b` |
| S10-05 | Teklif listesi sayfalama | Client-side pagination (20/sayfa, boyut secici) | ✅ Done `6b0920b` |
| S10-06 | Gecerlilik suresi uyarisi | Suresi dolmus tekliflerde kabul engelleme | ✅ Done `6b0920b` |

---

## SPRINT 11: Siparis Modulu Iyilestirme

> **Hedef:** Siparis surecini uctan uca takip edilebilir ve guvenlir yapmak

| ID | Baslik | Aciklama | Detay |
|----|--------|----------|-------|
| S11-01 | SalesForm genisleme | ProjectName, RevisionNo, PaymentTerm, PaymentTermDays eklendi | ✅ Done `fb0a164` |
| S11-02 | Onay bilgisi gosterimi | ApprovedDate, ApprovalNotes SaleDetail'da gosteriliyor | ✅ Done `fb0a164` |
| S11-03 | Depo stok validasyonu | Uretim transferi oncesi depo stok yeterliligi kontrol | ⏳ Sprint 13'e ertelendi |
| S11-04 | Siparis klonlama | Tekrar eden musteriler icin siparis kopyalama | ⏳ Sprint 13'e ertelendi |
| S11-05 | Odeme kosullari gosterimi | PaymentTerm ve PaymentTermDays detay sayfasinda goster | ✅ Done `fb0a164` |
| S11-06 | Red nedeni gosterimi | REJECTED siparislerde red nedenini goster | ✅ Done `fb0a164` |

---

## SPRINT 12: Fatura UX & Hesaplama Iyilestirme

> **Hedef:** Fatura islemlerini dogru, hizli ve profesyonel yapmak

| ID | Baslik | Aciklama | Detay |
|----|--------|----------|-------|
| S12-01 | Fatura no onizleme | Kaydetmeden once otomatik fatura numarasi gosteriliyor | ✅ Done `c3d0e71` |
| S12-02 | Kalem validasyonu | Bos aciklama/miktar kaydedilemiyor, hata mesaji | ✅ Done `c3d0e71` |
| S12-03 | Odeme formu validasyonu | Tutar/yontem zorunlu, overpayment kontrolu | ✅ Done `c3d0e71` |
| S12-04 | Iade fatura miktari siniri | Iade miktari <= orijinal miktar UI kontrolu | ✅ Done `c3d0e71` |
| S12-05 | Hizli iade butonu | Liste gorunumunde direkt iade faturasi butonu | ✅ Done `c3d0e71` |
| S12-06 | Toplu fatura islemi | Coklu secim + toplu SENT durumuna gecis | ✅ Done `c3d0e71` |

---

## SPRINT 13: Gelismis Ozellikler

> **Hedef:** ERP'yi profesyonel seviyeye cikarmak

| ID | Baslik | Aciklama | Detay |
|----|--------|----------|-------|
| S13-01 | Teklif onay is akisi | 50K TL uzerinde yonetici onayi uyarisi + Modal onay | ✅ Done `d37d7d7` |
| S13-02 | Kismi sevkiyat destegi | Uretim ilerleme cubuklari + renkli durum etiketleri | ✅ Done `d37d7d7` |
| S13-03 | Fatura hatirlatma | Vadesi gecen otomatik OVERDUE + uyari banner | ✅ Done `d37d7d7` |
| S13-04 | Siparis degisiklik yonetimi | Musteri degisiklik talebi → revizyon is akisi | ⏳ Gelecek faz |
| S13-05 | Coklu para birimi | Fatura/teklif'te USD/EUR destegi, kur takibi | ⏳ Gelecek faz |
| S13-06 | Audit trail | Tum durum degisikliklerinde kim/ne zaman/ne log'u | ⏳ Gelecek faz |

---

## BULUNAN KRITIK BUGLAR DETAYI

### BUG-1: Fatura UI Yuvarlama Hatasi
**Dosya:** `InvoiceForm.js:113-120`
```javascript
// HATA: Ara degerler yuvarlanmiyor
const tax = line * ((item.taxRate || 0) / 100)  // Yuvarlama YOK!

// DUZELTME:
const tax = Math.round(line * ((item.taxRate || 0) / 100) * 100) / 100
```
**Etki:** UI'da 599.99 gosterirken API'de 600.01 kaydediliyor

### BUG-2: PurchaseOrderId Kayip
**Dosya:** `InvoiceDTO.cs - CreateInvoiceRequest`
- UI `purchaseOrderId` gonderiyor ama DTO'da alan YOK
- Alis faturasi → PO baglantisi kaydedilmiyor

### BUG-3: BilledQuantity Guncellenmiyor
**Dosya:** `InvoiceService.cs:140-193`
- Fatura olusturulunca BilledQuantity artiyor
- Fatura DUZENLENINCE eski deger kalıyor (azalmıyor)
- Sonraki fatura fazla miktar faturalayabiliyor

### BUG-4: Teklif No Cakismasi (Race Condition)
**Dosya:** `OfferController.cs:238-250`
- `MAX(CurrentOfferNo) + 1` thread-safe degil
- 2 esanli istek ayni numarayi alabilir

### BUG-5: Siparis Tarih Filtre Hatasi
**Dosya:** `SalesController.cs:113` — ✅ DUZELTILDI
- `endOpeningDate` filtresi `endDeliveryDate` parametresini kullaniyordu

---

## KULLANICI SENARYOLARI & UX SORUNLARI

### Senaryo 1: Yeni Teklif Olusturma
1. Satis → Teklifler → Yeni Teklif
2. Musteri sec ✅
3. Kaydet → **Onceki sorun: DateTime.Now hatasi** ✅ DUZELTILDI
4. Kalem ekle → SmartProductSearch ile urun ara ✅ YENi
5. Fiyat otomatik doluyor ✅ YENi
6. **Sorun:** ValidUntilDate < OfferSentDate girilebiliyor ❌
7. **Sorun:** Hata olursa kullaniciya bildirim yok ❌

### Senaryo 2: Teklif → Siparis Donusumu
1. Teklifi kabul et → Siparis olustur ✅
2. **Sorun:** SalesForm sadece 3 alan gosteriyor (depo, tedarik turu, siparis no) ❌
3. **Sorun:** Odeme kosullari, proje adi gibi alanlar eksik ❌
4. Onaya gonder → Onayla → Uretime aktar ✅
5. **Sorun:** Onay bilgisi (kim onayl, ne zaman) gorunmuyor ❌

### Senaryo 3: Fatura Olusturma
1. Muhasebe → Faturalar → Yeni Fatura
2. Musteri sec ✅
3. Kalem ekle → SmartProductSearch ile urun ara ✅ YENi
4. **Sorun:** Bos satirla kaydedilebiliyor ❌
5. KDV ve tevkifat hesabi ✅ (formul dogru)
6. **Sorun:** UI ve API toplami farkli olabiliyor (yuvarlama) ❌
7. Kaydet → Fatura no otomatik olusuyor ama onceden gorunmuyor ❌

### Senaryo 4: Odeme Kaydi
1. Fatura detay → Odeme ekle
2. **Sorun:** Tutar ve yontem validasyonu yok ❌
3. **Sorun:** Fazla odeme kontrolu tolerance cok katı (0.01 TL) ❌

---

## NOTLAR

### Sprint Oncelikleri
- Sprint 9: KRITIK — uretim engelleyen bug'lar (hemen basla)
- Sprint 10-11: YUKSEK — gunluk kullanimi etkileyen UX
- Sprint 12: ORTA — fatura islemi iyilestirme
- Sprint 13: DUSUK — gelecek faz ozellikleri

### Test Politikasi
- Her fix minimum 3 test icermeli
- Regression testi zorunlu (mevcut testler kirilmamali)

### Commit Konvansiyonu
```
S{sprint}-{task}: Kisa aciklama

Detayli aciklama...

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
```
