# [C403] Yetki Matrisi: 82 Controller Yetkilendirme

## Durum: DONE
## Oncelik: KRITIK
## Faz: 4
## Tarih: 2026-03-08

## Aciklama
Tum API controller'larina modul bazli YetkiDenetimi uygulamasi yapildi.
Daha once 13 controller [Authorize] kullaniyordu (401 redirect sorununa neden oluyordu),
69 controller hicbir yetkilendirme yoktu. Simdi 82 controller'in tamami korunuyor.

## Yapilan Isler
- [x] 82 controller'a YetkiDenetimi attribute eklendi
- [x] Permissions.cs: 16 modul, 55 yetki tanimlamasi
- [x] YetkiDenetimi.cs: Null check ve hata mesajlari iyilestirildi
- [x] bootstrap-permissions endpoint olusturuldu
- [x] RoleController IMemoryCache DI duzeltildi
- [x] Program.cs: AddMemoryCache, HTTPS redirect fix
- [x] ExceptionHandlingMiddleware: Dev ortaminda detayli hata

## Teknik Detaylar
### Modul-Permission Eslemesi
- Stok controllerlari -> Stok.Goruntule/Kaydet/Sil
- Kalite controllerlari -> Kalite.Goruntule/Kaydet/Sil
- Uretim controllerlari -> Uretim.Goruntule/Kaydet/Sil
- Utility controllerlari (Units, Machines, Shared) -> Genel.All

### Degisen Dosyalar (API repo)
| Dosya | Degisiklik |
|-------|-----------|
| 82 Controller dosyasi | YetkiDenetimi attribute eklendi |
| Auth/YetkiDenetimi.cs | Null check, hata mesajlari |
| Utilities/Permissions.cs | 16 modul, 55 yetki |
| Controllers/AccountController.cs | bootstrap-permissions endpoint |
| Controllers/RoleController.cs | IMemoryCache DI fix |
| Program.cs | AddMemoryCache, HTTPS fix |
| Middleware/ExceptionHandlingMiddleware.cs | Dev detayli hata |

### Degisen Dosyalar (UI repo)
| Dosya | Degisiklik |
|-------|-----------|
| src/navigation/horizontal/index.js | Tum moduller eklendi |

### Etki Analizi
- Tum API endpoint'leri artik yetki kontrolu altinda
- 401 redirect sorunu cozuldu
- Admin rolu bootstrap-permissions ile tum yetkileri alabiliyor
