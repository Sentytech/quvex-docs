# Sprint — Bug Fix & UX (02 Nisan 2026)

## KRİTİK — API 500 Hataları
| # | Endpoint | Hata | Çözüm | Efor |
|---|----------|------|-------|------|
| 1 | POST /Product → 500 | `function getproducttree(uuid) does not exist` | PostgreSQL stored function eksik — migration'a ekle | M |
| 2 | POST /Hr/timesheet/generate → 500 | `Kullanici bulunamadi` — userId GUID gönderiliyor ama User tablosunda bulamıyor | HrService userId lookup fix | S |

## API 404 — Eksik Endpoint'ler
| # | Endpoint | Çözüm | Efor |
|---|----------|-------|------|
| 3 | GET /Admin/monitoring/health | Admin monitoring endpoint'leri eksik (health, alerts, activity, health-check) | M |
| 4 | GET /Hr/employee-shifts | Endpoint adı yanlış — shifts olmalı veya yeni route ekle | S |
| 5 | GET /Warehouse (tekil) | Route /Warehouses (çoğul) — frontend çağrısı düzeltilmeli | S |
| 6 | GET /Changelog/latest → 401 | Auth gerektirmemeli veya public olmalı | S |

## API 400 — Validasyon Hataları
| # | Endpoint | Sorun | Çözüm | Efor |
|---|----------|-------|-------|------|
| 7 | POST /Product → 400 | "daha önce eklenmiş" — unique constraint boş DB'de bile | Unique check logic düzelt | S |
| 8 | POST /Customer → 400 | Validasyon hatası | Hata mesajını kontrol et | S |
| 9 | PUT /StockRequests/{id} → 400 | Güncelleme validasyon hatası | Request body kontrol | S |
| 10 | PUT /SupplierEvaluation/{id}/status → 400 | Status güncelleme hatası | Request body kontrol | S |

## Menü Düzenleme
| # | Sorun | Efor |
|---|-------|------|
| 11 | Stok menü sıralama: Ürünler → Depolar → Stok Giriş/Çıkış | S |
| 12 | Satınalma: Tedarikçiler ilk sırada | S |
| 13 | Tedarikçi Portalı: Satış → Satınalma altına taşı | S |

## Kasa/Banka
| # | Sorun | Efor |
|---|-------|------|
| 14 | Kasa tab sadece kasa, Banka tab sadece banka | S |
| 15 | Defter butonunun sağındaki butonlar kesilmiş (overflow) | S |
| 16 | Filtreleme: tarih, arama, tutar filtresi ekle | M |

## İK
| # | Sorun | Efor |
|---|-------|------|
| 17 | Tüm "Personel ID" input → Kullanıcı Select dropdown | M |
| 18 | İzin talebinde personel Select ile seçilmeli | S |

## Label & Kavram
| # | Sorun | Efor |
|---|-------|------|
| 19 | Tüm faturalarda kalem "Stok" → "Ürün" | S |
| 20 | Fason İş Emirleri: tedarikçi alanı sadece IsSupplier=true | S |

## Validasyon & Format
| # | Sorun | Efor |
|---|-------|------|
| 21 | Telefon formatı "545 555 55 55" tüm ekranlar | M |

## Bakım
| # | Sorun | Efor |
|---|-------|------|
| 22 | İş emri generate: stub → gerçek implementasyon | M |

---

## Özet
- **Toplam:** 22 iş
- **Kritik (500):** 2
- **API 404:** 4
- **API 400:** 4
- **UI/UX:** 12
- **Efor:** S=13, M=9
- **Tahmini süre:** ~4-5 saat

## Öncelik Sırası
1. Kritik 500'ler (1-2) — ürün ekleme ve puantaj çalışmalı
2. API 404'ler (3-6) — eksik endpoint'ler
3. Menü düzenleme (11-13) — hızlı, görünür etki
4. Kasa/Banka tab fix (14-15) — hızlı
5. Label düzeltme (19-20) — hızlı
6. İK personel select (17-18)
7. Validasyon 400'ler (7-10)
8. Telefon format (21)
9. Kasa/Banka filtre (16)
10. Bakım generate (22)
