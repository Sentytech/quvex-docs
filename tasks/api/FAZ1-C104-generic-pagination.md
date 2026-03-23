# [C1-04] Generic Pagination Altyapisi

## Durum: DONE
## Oncelik: YUKSEK
## Faz: 1
## Tarih: 2026-03-07

## Aciklama
Tum liste endpoint'lerine pagination, sorting ve filtering destegi eklemek.

## Yapilan Isler
- [x] PagedRequest DTO (page, pageSize, sortBy, sortDirection, searchTerm)
- [x] PagedResponse<T> DTO (items, totalCount, page, pageSize, totalPages, hasNext/Prev)
- [x] IQueryable extension: ToPagedResponse, ToPagedResponseAsync, ApplySorting
- [x] 11 adet xUnit testi yazildi

## Teknik Detaylar
### Ne Yapildi
1. PagedRequest: page (min 1), pageSize (1-100, default 20), sortBy, sortDirection, searchTerm
2. PagedResponse<T>: items, totalCount, page, pageSize, totalPages, hasPreviousPage, hasNextPage
3. QueryableExtensions:
   - ToPagedResponse: sync pagination (Skip/Take + Count)
   - ToPagedResponseAsync: async pagination
   - ApplySorting: dynamic property-based sorting (reflection + Expression)

### Degisen Dosyalar
| Dosya | Degisiklik |
|-------|-----------|
| Models/DTOs/PagedRequest.cs | Yeni - sayfalama istek DTO |
| Models/DTOs/PagedResponse.cs | Yeni - sayfalama yanit DTO |
| Helpers/QueryableExtensions.cs | Yeni - IQueryable extension method'lar |
| Tests/Helpers/PaginationTests.cs | 11 yeni test |

### Etki Analizi
- Controller'lar PagedRequest kabul edip PagedResponse donebilir
- Mevcut endpoint'ler henuz degismedi (kademeli gecis icin hazir)
- Frontend'e PagedResponse formati icin destek eklenmeli

## Test Sonuclari
77/77 test PASSED
- PaginationTests: 11 test (defaults, clamping, totalpages, sorting, paging)

## Commit Bilgisi
[FAZ1][C1-04] Generic Pagination - PagedRequest/PagedResponse ve sorting altyapisi
