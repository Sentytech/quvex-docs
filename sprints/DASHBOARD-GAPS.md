# Dashboard Eksik Bilgi Raporu (2026-04-23)

Uretim detay sayfasi UX analizi sirasinda 10 farkli rol/kisi ile yapilan
saha gorusmeleri sonucu tespit edilen eksikler.

## Uretim Detay Sayfasi — TAMAMLANDI

| # | Talep | Oncelik | Durum |
|---|-------|---------|-------|
| 1 | Musteri + Teslim Tarihi + Gecikme | P0 | DONE (a564afa) |
| 2 | Durum suresi ("3 gundur uretimde") | P0 | DONE (a564afa) |
| 3 | Risk gostergesi (yesil/sari/kirmizi) | P1 | DONE (renk kodlu bant) |
| 4 | BOM'da stok durumu | P1 | BEKLIYOR |
| 5 | Tahmini bitis zamani | P2 | BEKLIYOR |

---

## Diger Dashboard'larda Eksikler

### 1. ShopFloor Terminal (Operator)
| Eksik | Aciklama | Oncelik | Durum |
|-------|---------|---------|-------|
| Onceki adim ozeti | Operator tornaya gelen parcayi bilmiyor | P1 | DONE (dd85080) |
| Inline 3D/teknik cizim | Drawer'da var ama direkt gorunmuyor | P2 | BEKLIYOR |

### 2. Quality Dashboard (Kalite Muduru)
| Eksik | Aciklama | Oncelik |
|-------|---------|---------|
| Is emri bazli olcum ozeti | Ana ekranda yok, tab'a girmek lazim | P1 |
| Son olcum sonuclari hero view'da | Quick inline sampling eksik | P2 |

### 3. Warehouse Dashboard (Depo Sorumlusu)
| Eksik | Aciklama | Oncelik |
|-------|---------|---------|
| BOM ihtiyac listesi | Uretim emirleri icin malzeme ihtiyaci hic yok | P0 |
| Uretim talep sinyali | Hangi uretim hangi malzemeyi bekliyor? | P1 |

### 4. Executive Dashboard (Patron)
| Eksik | Aciklama | Oncelik |
|-------|---------|---------|
| Geciken siparis listesi | Sadece genel KPI var, detay yok | P0 | DONE (ee0f5d6) |
| Risk skoru / isi haritasi | Hangi uretimler riskli? | P1 | DONE (dd85080) |
| OTD (On-Time Delivery) % | Zamaninda teslim orani net degil | P2 | BEKLIYOR |

### 5. Financial Dashboard (Muhasebe)
| Eksik | Aciklama | Oncelik |
|-------|---------|---------|
| Planlanan vs gercek maliyet | Sadece COPQ var, uretim bazli karsilastirma yok | P1 |
| Maliyet sapma analizi | Butce vs fiili eksik | P2 |

---

## Oncelik Sirasi (Sonraki Sprint)

### Sprint P0 (Acil)
1. Depo: BOM ihtiyac listesi (uretim emirleriyle baglantili)
2. Patron: Geciken siparis listesi (detayli)

### Sprint P1
3. Operator: Onceki adim ozeti
4. Kalite: Is emri bazli olcum ozeti
5. Patron: Risk skoru
6. Depo: Uretim talep sinyali
7. Muhasebe: Planlanan vs gercek maliyet

### Sprint P2
8. Operator: Inline 3D/teknik cizim
9. Patron: OTD %
10. Muhasebe: Maliyet sapma analizi

---

## Notlar

- Uretim detay ekranini gercekte kullanan: Uretim Muduru (her gun) + bazen Kalite/Planlama
- Operator ShopFloor Terminal kullanir, bu ekrana girmez
- Patron Executive Dashboard'a bakar
- Depo/Muhasebe kendi dashboard'larini kullanir
- Her rolun kendi dashboard'undaki eksikler o dashboard'da cozulmeli
