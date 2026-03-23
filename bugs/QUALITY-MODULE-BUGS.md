# Quvex ERP — Kalite Modulu Hata & Iyilestirme Raporu

> **Olusturma:** 2026-03-14
> **Scrum Master:** Claude (AI)
> **Durum:** Analiz tamamlandi — Sprint baslatilmayi bekliyor
> **Analiz Ekibi:** 4 QA Agent (Giris Kontrol+NCR, SPC+Tedarikci, AS9100, Izlenebilirlik)

---

## OZET

| Kategori | Kritik | Yuksek | Orta | Dusuk | Toplam |
|----------|--------|--------|------|-------|--------|
| Bug | 3 | 7 | 8 | 4 | 22 |
| UX | — | 2 | 8 | 6 | 16 |
| Feature | 1 | 3 | 4 | 5 | 13 |
| **Toplam** | **4** | **12** | **20** | **15** | **51** |

---

## A — KRITIK (Islevsellik Eksik / Bozuk)

| # | Modul | Sorun | Dosya | Cozum |
|---|-------|-------|-------|-------|
| KAL-001 | Document Approval | UI sayfasi tamamen eksik — API var ama frontend yok | DocumentController.cs | Yeni sayfa olustur |
| KAL-002 | Inspection | PUT endpoint ve update methodu yok — duzenleme imkansiz | IncomingInspectionController.cs | UpdateAsync + PUT endpoint ekle |
| KAL-003 | Inspection | Quantity validasyon eksik: Kabul+Red > Alinan kontrol yok | InspectionList.js + Service | Client+server validation |
| KAL-004 | SPC | Grafik visualization tamamen yok — sadece tablo gosteriliyor | SpcManagement.js | Recharts LineChart + UCL/LCL |

---

## B — YUKSEK ONCELIKLI

| # | Modul | Sorun | Dosya |
|---|-------|-------|-------|
| KAL-005 | Final Inspection | InspectedDate hic set edilmiyor — audit trail eksik | FinalInspectionRelease Controller |
| KAL-006 | Final Inspection | Kosullu onay conditions kaydedilmiyor | FinalInspectionPanel.js:122 |
| KAL-007 | CoC | PDF path yanlis — REACT_APP_API_ENDPOINT + '/Pdf/coc/' | FinalInspectionPanel.js:133 |
| KAL-008 | MRB | DecidedById hic yakalanmiyor — karar veren belli degil | MrbDispositionPanel.js:60 |
| KAL-009 | Tedarikci Degerleme | Agirliklar 2 sistemde farkli (40/30/15/15 vs 50/30/20) | SupplierEvalService vs AdvancedQualityService |
| KAL-010 | Tedarikci Degerleme | Yeni tedarikci score=0 → otomatik CRITICAL | SupplierEvaluationService.cs:163 |
| KAL-011 | Seri Numara | Urun secimi UUID manuel giris — OxitAutoComplete olmali | SerialNumberList.js:97 |
| KAL-012 | CoC/MRB/Concession | Dedicated liste sayfalari yok — sadece embedded panel | Routes |
| KAL-013 | Inspection | POST/PUT/DELETE sadece Goruntule ile korunuyor — Kaydet/Sil permission eksik | Controllers |
| KAL-014 | NCR | Durum gecis validasyonu yok — OPEN → CLOSED direkt gecilebilir | NcrService |

---

## C — ORTA ONCELIKLI

| # | Modul | Sorun | Tip |
|---|-------|-------|-----|
| KAL-015 | Customer Feedback | Category dropdown form'da yok — API bekliyor | Bug |
| KAL-016 | Customer Concession | ExpiryDate hic set edilmiyor | Bug |
| KAL-017 | Customer Concession | Form'da customer field yok — kime gonderilecegi belirsiz | Bug |
| KAL-018 | SPC | Nelson Rules (6/7) define edilmis ama implement edilmemis | Feature |
| KAL-019 | SPC | USL/LSL hardcoded (10/0) — urun spec'ten otomatik yuklenmeli | UX |
| KAL-020 | SPC | Dual DTO sistemi (SpcDTO vs AdvancedQualityDTO) — code smell | Bug |
| KAL-021 | Quality Dashboard | Price score hardcoded 75.0 — gercek maliyetten cekilmeli | Bug |
| KAL-022 | Data Pack | PDF/Excel export/download yok — sadece modal goruntuluyor | Feature |
| KAL-023 | Inspection | Quality Control Plan secimi form'da yok — AQL eksik | Feature |
| KAL-024 | Inspection | Olcum detaylari (Measurements) alt tablosu form'da yok | Feature |
| KAL-025 | Tedarikci Degerleme | Form'da eksik alanlar (Technical, Financial, Compliance) | UX |
| KAL-026 | Tedarikci Degerleme | Tarih araligei filtreleme yok | UX |
| KAL-027 | Seri Numara | Arama 200 ile sinirli (hard-coded Take(200)) | Bug |
| KAL-028 | Data Pack | Inspection Take(10) hard-coded — eksik veri | Bug |
| KAL-029 | Control Plan | getItems endpoint UI'da cagiriliyor ama API'de var mi? | Bug |
| KAL-030 | Document Approval | File upload size limit kontrolu yok | Security |

---

## D — DUSUK ONCELIKLI / IYILESTIRME

| # | Modul | Sorun | Tip |
|---|-------|-------|-----|
| KAL-031 | Inspection | Listede filtreleme yok (supplier, result) | UX |
| KAL-032 | Inspection | FAIL → otomatik NCR olusturma workflow yok | Feature |
| KAL-033 | SPC | Grafik tipi seciminde rehberlik/aciklama yok | UX |
| KAL-034 | SPC | Batch veri import yok (CSV/Excel) | Feature |
| KAL-035 | Seri Numara | Batch print yok — toplu barkod yazdirma | UX |
| KAL-036 | Genealogy | Ayri sayfa yok — sadece modal icinde | UX |
| KAL-037 | Customer Feedback | Survey close confirmation dialog yok | UX |
| KAL-038 | MRB | Quarantine location required degil ama olmali | UX |
| KAL-039 | MRB | Rework deadline/schedule field eksik | Feature |
| KAL-040 | Customer Concession | APPROVED → REVISION_REQUESTED transition yok | Feature |
| KAL-041 | Document Approval | IN_REVIEW → DRAFT geri donus yok | Bug |
| KAL-042 | Control Plan | Durum makinesinde REVISION sonrasi akis belirsiz | UX |
| KAL-043 | Lot Numarasi | Serbest metin — format standardizasyonu yok | UX |

---

## SPRINT PLANI

### Sprint KAL-1: Kritik + Yuksek Oncelikli (14 item)
> **Hedef:** Islevselligi bozan ve audit trail eksiklerini gidermek
> **Tahmini Sure:** 1-2 oturum

**Paralel Grup 1 (API):**
- KAL-002: Inspection PUT endpoint + UpdateAsync
- KAL-005: InspectedDate set etme
- KAL-008: MRB DecidedById fix
- KAL-013: Permission attribute'lari duzeltme
- KAL-014: NCR status transition validation

**Paralel Grup 2 (UI):**
- KAL-003: Quantity validation (client-side)
- KAL-004: SPC grafik (Recharts LineChart)
- KAL-006: Conditional approval modal fix
- KAL-007: CoC PDF path fix
- KAL-009/010: Tedarikci scoring fix
- KAL-011: Serial number urun secimi OxitAutoComplete

### Sprint KAL-2: Orta Oncelikli (16 item)
> **Hedef:** Form eksiklikleri ve veri tutarsiliklikki gidermek

### Sprint KAL-3: Dusuk + Feature (13 item)
> **Hedef:** UX iyilestirmeleri ve yeni ozellikler

---

## POZITIF BULGULAR

| Ozellik | Durum |
|---------|-------|
| MRB + Karantina + Customer Concession workflow | Cok iyi entegre |
| NCR Dashboard tiklanabilir status filtreleri | Mukemmel UX |
| Seri numara lifecycle (CREATED→SHIPPED) | Dogru is mantigi |
| Data Pack icerigi (10+ dokuman tipi) | Kapsamli |
| Kontrol Plani kontrol noktalari (8 metot, 5 ornekleme tipi) | AS9100 uyumlu |
| Notification entegrasyonu (NCR → assigned user) | Iyi |
| Permission sistemi (YetkiDenetimi) | Guvenli |
| XSS korumasi (barkod sanitize) | Guvenli |
| Cp/Cpk hesaplamalari | Istatistiksel dogru |

---

## NOTLAR

- Kalite modulu API tarafinda %90 tamamlanmis, frontend %65
- Document Approval tamamen eksik (KAL-001) — en buyuk bosluk
- SPC grafik olmadan operasyonel kullanim mumkun degil (KAL-004)
- CoC/MRB/Concession icin dedicated listeler gerekli (KAL-012)
- Tedarikci puanlama iki farkli agirlik sistemi kullaniyor (KAL-009)
