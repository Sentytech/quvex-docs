# Quvex ERP — Stok Modülü Hata & Sprint Planı

> **Oluşturma:** 2026-03-14
> **Scrum Master:** Claude (AI)
> **Durum:** ✅ TÜM SPRİNTLER TAMAMLANDI
> **Toplam Hata:** 24 (19 Bug, 4 UX, 1 Kontrol) — HEPSİ ÇÖZÜLDÜ
> **API Commit:** `738b21c` | **UI Commit:** `3c60662`
> **BONUS:** 30+ service dosyasında /api/ çift prefix düzeltildi (tüm modülleri etkileyen sistemik hata)

---

## TAKIM YAPISI (Agent Teams)

| Rol | Agent | Sorumluluk |
|-----|-------|------------|
| **Scrum Master** | Claude (Ana) | Sprint yönetimi, koordinasyon, code review, merge |
| **Uzman Analist** | Agent-Analist | Hata kök neden analizi, API response inceleme, veri akışı tespiti |
| **Uzman Backend Developer** | Agent-Backend | .NET API fix'leri, service/controller düzeltmeleri, DB sorguları |
| **Uzman Yazılım Mimarı** | Agent-Mimar | Mimari kararlar, ortak pattern belirleme, teknik borç tespiti |
| **Uzman Frontend Developer** | Agent-Frontend | React component fix'leri, form/UX düzeltmeleri, state yönetimi |
| **Uzman Test 1** | Agent-Test-1 | API endpoint testleri, integration test, veri doğrulama |
| **Uzman Test 2** | Agent-Test-2 | UI fonksiyonel test, form validasyon, kullanıcı akış testi |

---

## HATA KAYIT LİSTESİ

### A — KRİTİK BUGLAR (Kayıt/Listeleme Çalışmıyor)

| # | Sayfa | Hata Açıklaması | Olası Kök Neden | Öncelik |
|---|-------|-----------------|-----------------|---------|
| BUG-001 | `/stocks` | Yeni kayıtta stok kodu hep S000001 geliyor | API: CurrentProductNo update'de siliniyor + duplicate check tersten | ~~KRİTİK~~ **FIX YAPILDI** |
| BUG-002 | `/stock-receipts` | Kaydet çalışmıyor | API endpoint veya request payload uyumsuzluğu | KRİTİK |
| BUG-003 | `/stock-receipts` | Düzenle'ye basınca veri gelmiyor | loadInitialData / GET endpoint hatası | KRİTİK |
| BUG-004 | `/products` (BOM) | Stok eklerken "ürün adı zorunludur" uyarısı | Form field mapping veya validation kuralı hatası | KRİTİK |
| BUG-005 | `/products/form` | Dosya yöneticisinde dosya yüklenmiyor/görünmüyor | Upload endpoint veya dosya listesi GET hatası | KRİTİK |
| BUG-010 | `/warehouses` | "The Value '' is valid" hatası — kayıt yapılamıyor | API validation — boş string Guid parse hatası | KRİTİK |
| BUG-013 | `/warehouse-locations` | "Aranan kayıt bulunamadı" — yeni lokasyon eklenemiyor | API endpoint 404 veya response parse hatası | KRİTİK |

### B — ORTA BUGLAR (Listeleme/Veri Görünmüyor)

| # | Sayfa | Hata Açıklaması | Olası Kök Neden | Öncelik |
|---|-------|-----------------|-----------------|---------|
| BUG-014 | `/stock/count` | Listeleme "Aranan kayıt bulunamadı" | API endpoint veya response yapısı uyumsuz | YÜKSEK |
| BUG-015 | `/stock/count` | Yeni sayım oluşturulamıyor | POST endpoint veya payload hatası | YÜKSEK |
| BUG-016 | `/stock/lots` | Listeleme "Aranan kayıt bulunamadı" | API endpoint veya response yapısı uyumsuz | YÜKSEK |
| BUG-017 | `/stock/lots` | Yeni lot kaydı oluşturulamıyor | POST endpoint veya payload hatası | YÜKSEK |
| BUG-018 | `/stock/valuation` | "Aranan kayıt bulunamadı" | API endpoint veya response yapısı uyumsuz | YÜKSEK |
| BUG-020 | `/stock/alerts` | "Aranan kayıt bulunamadı" | API endpoint veya response yapısı uyumsuz | YÜKSEK |
| BUG-021 | `/stock/alerts` | Otomatik satın alma butonu başarısız | POST endpoint veya iş mantığı hatası | YÜKSEK |
| BUG-022 | `/stock/barcode` | "Aranan kayıt bulunamadı" | API endpoint veya response yapısı uyumsuz | YÜKSEK |
| BUG-023 | `/stock/barcode` | "Barkod oluşturulamadı" hatası | Barkod generate endpoint hatası | YÜKSEK |
| BUG-024 | `/stock/transfers` | "Aranan kayıt bulunamadı" | API endpoint veya response yapısı uyumsuz | YÜKSEK |

### C — UX İYİLEŞTİRMELER

| # | Sayfa | İyileştirme Açıklaması | Öncelik |
|---|-------|------------------------|---------|
| UX-006 | `/stock-receipts` | Depo arama alanı gelişmiş dropdown ile aranabilir olmalı | ORTA |
| UX-007 | `/stock-receipts` | Ürün ekle → Stok Adı alanına auto-focus + etiket "Stok" → "Stok Adı" | ORTA |
| UX-008 | `/stock-receipts` | Adet + Enter → otomatik yeni satır + Stok Adı'na focus | ORTA |
| UX-009 | `/stock-receipts` | Fiş tarihi varsayılan günün tarihi | ORTA |
| UX-011 | `/warehouses` | Depo sorumlusu kullanıcılar dropdown'ından seçilmeli | ORTA |
| UX-012 | `/warehouses` | Kodu ile Adı sütun sırası değişmeli (Kod önce) | ORTA |

### D — KONTROL GEREKLİ

| # | Sayfa | Açıklama | Öncelik |
|---|-------|----------|---------|
| CHK-019 | `/stock/abc-analysis` | Kayıt gelmiyor — hata mı veri eksikliği mi kontrol edilecek | ORTA |

---

## SPRİNT PLANI

### Sprint S1: Kritik Kayıt/Listeleme Bugları (Öncelik: KRİTİK)
> **Hedef:** Kayıt yapılamayan ve listelenemeyen ekranları çalışır hale getirmek
> **Tahmini Süre:** 1 oturum
> **Definition of Done:** Tüm CRUD işlemleri çalışıyor, testler geçiyor

| Task | Bug | Sorumlu Agent | Bağımlılık |
|------|-----|---------------|------------|
| S1-T1 | BUG-002, BUG-003 | Agent-Analist + Agent-Backend | — |
| S1-T2 | BUG-004 | Agent-Frontend | — |
| S1-T3 | BUG-005 | Agent-Backend + Agent-Frontend | — |
| S1-T4 | BUG-010, BUG-012 | Agent-Backend + Agent-Frontend | — |
| S1-T5 | BUG-013 | Agent-Backend + Agent-Frontend | — |
| S1-T6 | Tüm S1 fix'leri | Agent-Test-1 + Agent-Test-2 | S1-T1..T5 |

**Agent Teams Çalışma Planı:**
```
Paralel Grup 1 (bağımsız):
  - Agent-Backend → BUG-002, BUG-003 (stock-receipts API analiz + fix)
  - Agent-Frontend → BUG-004 (BOM ürün adı validation fix)
  - Agent-Mimar → Ortak "Aranan kayıt bulunamadı" pattern analizi (tüm sayfalarda aynı mı?)

Paralel Grup 2 (Grup 1 sonrası):
  - Agent-Backend → BUG-010 (warehouses validation fix)
  - Agent-Frontend → BUG-005 (dosya yöneticisi fix)
  - Agent-Backend → BUG-013 (warehouse-locations fix)

Test:
  - Agent-Test-1 → API endpoint testleri (her fix sonrası)
  - Agent-Test-2 → UI fonksiyonel testler (her fix sonrası)
```

---

### Sprint S2: Orta Öncelikli Listeleme Bugları (Öncelik: YÜKSEK)
> **Hedef:** "Aranan kayıt bulunamadı" hatası alan tüm ekranları düzeltmek
> **Tahmini Süre:** 1 oturum
> **Definition of Done:** Tüm liste ekranları veri gösteriyor, CRUD çalışıyor

| Task | Bug | Sorumlu Agent | Bağımlılık |
|------|-----|---------------|------------|
| S2-T1 | BUG-014, BUG-015 | Agent-Backend + Agent-Frontend | S1 (mimar analizi) |
| S2-T2 | BUG-016, BUG-017 | Agent-Backend + Agent-Frontend | S1 (mimar analizi) |
| S2-T3 | BUG-018 | Agent-Backend + Agent-Frontend | — |
| S2-T4 | BUG-020, BUG-021 | Agent-Backend + Agent-Frontend | — |
| S2-T5 | BUG-022, BUG-023 | Agent-Backend + Agent-Frontend | — |
| S2-T6 | BUG-024 | Agent-Backend + Agent-Frontend | — |
| S2-T7 | CHK-019 | Agent-Analist | — |
| S2-T8 | Tüm S2 fix'leri | Agent-Test-1 + Agent-Test-2 | S2-T1..T7 |

**Agent Teams Çalışma Planı:**
```
Ön Analiz (Mimar):
  - "Aranan kayıt bulunamadı" hatası ortak pattern mi? (muhtemelen response.data yapısı)
  - Tek seferde tüm ekranlara uygulanabilecek ortak fix var mı?

Paralel Grup 1 (bağımsız — ortak fix uygulanabilirse toplu):
  - Agent-Backend → BUG-014/015 (stock count) + BUG-016/017 (lots)
  - Agent-Frontend → BUG-018 (valuation) + BUG-020/021 (alerts)
  - Agent-Analist → CHK-019 (ABC analysis kontrol)

Paralel Grup 2:
  - Agent-Backend → BUG-022/023 (barcode)
  - Agent-Frontend → BUG-024 (transfers)

Test:
  - Agent-Test-1 → API endpoint testleri
  - Agent-Test-2 → UI fonksiyonel testler
```

---

### Sprint S3: UX İyileştirmeler (Öncelik: ORTA)
> **Hedef:** Stok giriş ve depo formlarının kullanılabilirliğini artırmak
> **Tahmini Süre:** 1 oturum
> **Definition of Done:** UX iyileştirmeleri uygulanmış, kullanıcı akışı test edilmiş

| Task | Bug | Sorumlu Agent | Bağımlılık |
|------|-----|---------------|------------|
| S3-T1 | UX-006 | Agent-Frontend | S1 (stock-receipts fix) |
| S3-T2 | UX-007 | Agent-Frontend | S1 (stock-receipts fix) |
| S3-T3 | UX-008 | Agent-Frontend | S3-T2 |
| S3-T4 | UX-009 | Agent-Frontend | S1 (stock-receipts fix) |
| S3-T5 | UX-011, UX-012 | Agent-Backend + Agent-Frontend | S1 (warehouses fix) |
| S3-T6 | Tüm S3 fix'leri | Agent-Test-1 + Agent-Test-2 | S3-T1..T5 |

**Agent Teams Çalışma Planı:**
```
Paralel Grup 1 (bağımsız):
  - Agent-Frontend → UX-006 (depo arama dropdown)
  - Agent-Frontend → UX-007 + UX-008 (auto-focus + enter ile yeni satır)
  - Agent-Backend → UX-011 (kullanıcı listesi endpoint kontrolü)

Paralel Grup 2:
  - Agent-Frontend → UX-009 (fiş tarihi default)
  - Agent-Frontend → UX-012 (kolon sırası)

Test:
  - Agent-Test-2 → UX akış testleri (form açma → veri girişi → kaydet → listele)
```

---

## TEST METODOLOJİSİ

Her fix sonrası aşağıdaki test senaryoları uygulanacak:

### 1. Veri Girişi Testi
- [ ] Form açılıyor mu?
- [ ] Tüm alanlar görünüyor ve düzenlenebilir mi?
- [ ] Zorunlu alan validasyonları çalışıyor mu?
- [ ] Dropdown/autocomplete alanları veri getiriyor mu?

### 2. Kayıt Testi
- [ ] Yeni kayıt (INSERT) başarılı mı?
- [ ] Başarı bildirimi gösteriliyor mu?
- [ ] Kayıt sonrası liste güncelleniyor mu?
- [ ] API'ye doğru payload gidiyor mu? (Network tab kontrolü)

### 3. Listeleme Testi
- [ ] Liste ekranı açılınca veriler yükleniyor mu?
- [ ] Boş veri durumunda anlamlı mesaj var mı?
- [ ] Pagination çalışıyor mu?

### 4. Düzenleme Testi
- [ ] Düzenle butonuna basınca form dolarak geliyor mu?
- [ ] Güncelleme (UPDATE) başarılı mı?
- [ ] Değişiklikler listeye yansıyor mu?

### 5. Silme Testi
- [ ] Silme onay dialogu çıkıyor mu?
- [ ] Silme başarılı mı?
- [ ] Silinen kayıt listeden kalkıyor mu?

### 6. Filtreleme Testi
- [ ] Filtre alanları çalışıyor mu?
- [ ] Filtre sonuçları doğru mu?
- [ ] Filtre temizleme çalışıyor mu?

---

## AGENT TEAMS KULLANIM KILAVUZU

### Oturum Başlatma
```
1. Bu dosyayı oku: C:\rynSoft\quvex\quvex-docs\bugs\STOCK-MODULE-BUGS.md
2. Sprint seç (S1 → S2 → S3 sırasıyla)
3. Agent teams ile paralel çalışma başlat
4. Her fix sonrası test agent'ları çalıştır
5. Sprint bittiğinde bu dosyayı güncelle
```

### Agent Çağırma Şablonu
```
Agent-Analist:  "Analyze [BUG-XXX] — find root cause in API + UI code"
Agent-Backend:  "Fix [BUG-XXX] — [specific API fix description]"
Agent-Frontend: "Fix [BUG-XXX] — [specific UI fix description]"
Agent-Mimar:    "Review [pattern] — suggest shared solution for [bug group]"
Agent-Test-1:   "Test API endpoints for [module] — verify CRUD operations"
Agent-Test-2:   "Test UI flows for [module] — verify form/list/edit/delete"
```

### Sprint Durum Güncelleme
Her task tamamlandığında:
- Durum → ✅ Done
- Commit hash ekle
- Test sonucu ekle
- Bu dosyayı güncelle

---

## NOTLAR

- BUG-001 zaten fix edildi (stok kodu S000001 sorunu) — API commit bekliyor
- "Aranan kayıt bulunamadı" hataları büyük olasılıkla ortak bir kök nedene sahip (response.data parse)
- Sprint S1 en kritik — kayıt yapılamayan ekranlar öncelikli
- Agent teams ile S1 ve S2 paralel çalıştırılabilir (bağımsız bug'lar)
- Her sprint sonunda `dotnet test` ve `npx vitest run` geçmeli
