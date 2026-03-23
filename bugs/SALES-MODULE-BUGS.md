# Quvex ERP — Satis Modulu Hata & Iyilestirme Raporu

> **Olusturma:** 2026-03-14
> **Scrum Master:** Claude (AI)
> **Durum:** Analiz tamamlandi — Sprint baslatilmayi bekliyor
> **Analiz Ekibi:** 4 QA Agent (Teklif, Siparis, Fatura/Sevkiyat, Cari/Satinalma)

---

## OZET

| Kategori | Kritik | Yuksek | Orta | Dusuk | Toplam |
|----------|--------|--------|------|-------|--------|
| Bug | 5 | 6 | 10 | 8 | 29 |
| UX | — | 3 | 5 | 6 | 14 |
| **Toplam** | **5** | **9** | **15** | **14** | **43** |

---

## A — KRITIK BUGLAR (Islevsellik Bozuk)

| # | Modul | Sayfa | Hata | Dosya | Cozum Onerisi |
|---|-------|-------|------|-------|---------------|
| SAT-001 | Cari | `/customer-statement` | `customerService.getAll(true)` — tedarikciler musteri dropdown'unda gorunuyor | CustomerStatement.js:30 | `getAll('customers')` olarak degistir |
| SAT-002 | Satinalma | `/purchase-orders` | PurchaseOrderList'te `Include(Supplier)` eksik — tedarikci adi hep `-` | PurchaseOrderController.cs:33 | `.Include(p => p.Supplier)` ekle |
| SAT-003 | Fatura | InvoiceDetail | Payment API endpoint path yanlis (`/invoice/` vs `/by-invoice/`) | InvoiceDetail.js:32 | Path'i `/by-invoice/` olarak duzelt |
| SAT-004 | Teklif | OfferFormItemsAdditionInfo | `disabled={props.readOnly}` — Ant Design Form'da disabled prop calismaz | OfferFormItemsAdditionInfo.js:118 | Field'lari individual disable et |
| SAT-005 | Teklif | PurchaseOfferForm | `offerDate.format()` — null ise crash | PurchaseOfferForm.js:48 | Null check ekle: `?.format()` |

---

## B — YUKSEK ONCELIKLI BUGLAR

| # | Modul | Sayfa | Hata | Dosya | Cozum Onerisi |
|---|-------|-------|------|-------|---------------|
| SAT-006 | Satinalma | PurchaseOrderDetail | Mal alim modalinda depo secimi validasyonu yok | PurchaseOrderDetail.js | `selectedWarehouse` required validation ekle |
| SAT-007 | Siparis | SalesController | REJECTED durumundan geri donus yok — revize edilemez | SalesController.cs:527-543 | `REJECTED → IN_OFFER` transition ekle |
| SAT-008 | Teklif | OfferFormItems | Urun Ekle butonunda validation olmadan satir ekleniyor | OfferFormItems.js:391 | `formItems.validateFields()` cagir once |
| SAT-009 | Teklif | PurchaseOfferList | Durum sutununda `supplied` boolean — label yok | PurchaseOfferList.js:83 | `Tedarik Saglandi / Bekliyor` label goster |
| SAT-010 | Teklif | OfferFormItemsPreview | `SUBRECORD_WAITING` status API'de yok — kontrol her zaman false | OfferFormItemsPreview.js:4 | Status'u API ile esle veya kaldir |
| SAT-011 | Sevkiyat | ShippingDetailsController | Tarih filtresi N+1 query — son kayit tum production'lar icin karsilastiriliyor | ShippingDetailsController.cs:63-66 | Product'a ozgu tarih filtresi yaz |

---

## C — ORTA ONCELIKLI BUGLAR

| # | Modul | Sayfa | Hata | Dosya |
|---|-------|-------|------|-------|
| SAT-012 | Siparis | Sale.js | Filtre temizle butonu tarih alanlarini tam temizleyemiyor | Sale.js:258-262 |
| SAT-013 | Siparis | SalesForm.js | `response.data[0]` — bos array crash riski | SalesForm.js:42 |
| SAT-014 | Siparis | SaleDetail.js | useEffect'te redundant `getAllData()` cagrisi | SaleDetail.js:252-253 |
| SAT-015 | Siparis | SaleDetail.js | Agac yapisinda tum dugumler acik — buyuk veri performans sorunu | SaleDetail.js:201 |
| SAT-016 | Teklif | OfferForm.js | Yeni teklif (id==null) SENT'e cekilirken urun validasyonu yok | OfferForm.js:198-213 |
| SAT-017 | Teklif | SmartProductSearch | Min karakter tutarsizligi: SmartProductSearch=2, OxitAutoComplete=3 | Genel |
| SAT-018 | Cari | CustomerForm | E-posta format validasyonu eksik | CustomerForm.js |
| SAT-019 | Cari | CustomerStatement | `financeService.getStatement()` params wrapper dogrulamasi | CustomerStatement.js:61 |
| SAT-020 | Satinalma | PurchaseOrderForm | Response wrapper fallback pattern (code smell) | PurchaseOrderForm.js |
| SAT-021 | Satinalma | PurchaseOrderForm | Kalem key'i `Date.now()` — hizli tiklarda cakisabilir | PurchaseOrderForm.js |

---

## D — DUSUK ONCELIKLI BUGLAR / IYILESTIRMELER

| # | Modul | Sayfa | Hata/Iyilestirme | Tip |
|---|-------|-------|------------------|-----|
| SAT-022 | Fatura | InvoiceForm | Fatura tarihi default bugun olmali | UX |
| SAT-023 | Fatura | InvoiceForm | Son kalem silme tooltip eksik | UX |
| SAT-024 | Siparis | SaleDetail | `canTransferAfterSalesForm` alt parcalarda confusing | UX |
| SAT-025 | Siparis | OrderTimeline | Gecmis adimlar yesil isaretlenmeli (statik timeline) | UX |
| SAT-026 | Siparis | SalesForm | `PaymentTermNotes` alani formda gosterilmiyor | UX |
| SAT-027 | Siparis | ContractReviewTab | REJECTED → DRAFT donus yok (revize yapilamaz) | Bug |
| SAT-028 | Siparis | SalesDTO | Karlillik analizi yok (fiyat vs maliyet karsilastirmasi) | Feature |
| SAT-029 | Teklif | OfferFormItemsPreview | Turkce yazim hatalari: "Siparis Gor", "Vazgec" | UX |
| SAT-030 | Teklif | OfferFormItems | `addToACList()`, `removeFromACList()` bos fonksiyonlar | Code |
| SAT-031 | Teklif | OfferForm | Hata mesajlarinda bos string — fallback mesaj yok | UX |
| SAT-032 | Teklif | PurchaseOfferForm | onSelect callback'ler — daha clean pattern kullanilmali | Code |
| SAT-033 | Cari | Customer/Supplier | Default/Primary degistirmede gorsel refresh yok | UX |
| SAT-034 | Satinalma | PurchaseOrderForm | Tax rate hardcoded (%1, %10, %20) | UX |
| SAT-035 | Genel | Pagination | Format tutarsizligi: "teklif" vs "kayit" vs "siparis" | UX |

---

## SPRINT PLANI

### Sprint SA-1: Kritik Buglar (5 bug)
> **Hedef:** Islevselligi bozan hatalari duzeltmek
> **Tahmini Sure:** 1 oturum

| Task | Bug | Sorumlu | Bagimlilk |
|------|-----|---------|-----------|
| SA1-T1 | SAT-001 | Frontend | — |
| SA1-T2 | SAT-002 | Backend | — |
| SA1-T3 | SAT-003 | Frontend | — |
| SA1-T4 | SAT-004 | Frontend | — |
| SA1-T5 | SAT-005 | Frontend | — |

### Sprint SA-2: Yuksek Oncelikli Buglar (6 bug)
> **Hedef:** Onemli is mantigi ve validasyon hatalarini duzeltmek
> **Tahmini Sure:** 1 oturum

| Task | Bug | Sorumlu | Bagimlilk |
|------|-----|---------|-----------|
| SA2-T1 | SAT-006 | Frontend | — |
| SA2-T2 | SAT-007 | Backend | — |
| SA2-T3 | SAT-008 | Frontend | — |
| SA2-T4 | SAT-009 | Frontend | — |
| SA2-T5 | SAT-010 | Frontend | — |
| SA2-T6 | SAT-011 | Backend | — |

### Sprint SA-3: Orta + Dusuk Buglar + UX (22 item)
> **Hedef:** Kullanilabilirlik ve kod kalitesi iyilestirmeleri
> **Tahmini Sure:** 1-2 oturum

---

## AGENT TEAMS CALISMA PLANI

```
Sprint SA-1 (Paralel):
  Agent-Backend  → SAT-002 (PO Include Supplier)
  Agent-Frontend → SAT-001 (CustomerStatement getAll fix)
                 + SAT-003 (Payment endpoint fix)
                 + SAT-004 (Form disabled fix)
                 + SAT-005 (offerDate null check)
  Agent-Test     → Tum fix'leri dogrula

Sprint SA-2 (Paralel):
  Agent-Backend  → SAT-007 (REJECTED transition)
                 + SAT-011 (ShippingDetails query fix)
  Agent-Frontend → SAT-006 (PO depo validation)
                 + SAT-008 (Offer item validation)
                 + SAT-009 (supplied label)
                 + SAT-010 (SUBRECORD_WAITING fix)
  Agent-Test     → Tum fix'leri dogrula
```

---

## NOTLAR

- Satis modulu genel olarak %85 uretim hazir
- En kritik bulgu: SAT-001 (musteri/tedarikci karismasi) ve SAT-002 (tedarikci adi bos)
- SAT-007 (REJECTED geri donus) is mantigi karari — onay gerekli
- SAT-011 (N+1 query) performans etkisi buyuk veri setlerinde hissedilir
- Teklif modulu en zengin ozellikli modul — revizyon, onay, PDF, email destegi mevcut
