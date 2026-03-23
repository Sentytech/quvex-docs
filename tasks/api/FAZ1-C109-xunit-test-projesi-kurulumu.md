# [C1-09] xUnit Test Projesi Kurulumu + .NET 8 Upgrade

## Durum: DONE
## Oncelik: YUKSEK
## Faz: 1
## Tarih: 2026-03-07

## Aciklama
Backend icin xUnit + Moq + FluentAssertions test projesi olusturup, ilk ornek testleri yazmak.
.NET 7 EOL oldugu icin .NET 8 upgrade da bu task kapsaminda yapildi.

## Yapilan Isler
- [x] .NET 7 -> .NET 8 upgrade (csproj, Dockerfile, global.json)
- [x] C# 10 -> C# 12 LangVersion upgrade
- [x] Newtonsoft.Json -> System.Text.Json gecisi (9 enum dosyasi + 4 controller/auth dosyasi)
- [x] NuGet paketleri 7.0 -> 8.0 upgrade (EF Core, Identity, Npgsql vb.)
- [x] Program.cs: IgnoreNullValues -> DefaultIgnoreCondition (deprecated API duzeltme)
- [x] Microsoft.VisualStudio.Web.CodeGeneration.Design paketi kaldirildi (gereksiz)
- [x] Quvex.API.Tests xUnit projesi olusturuldu
- [x] Moq 4.20.70, FluentAssertions 6.12.0, EF Core InMemory 8.0.0 eklendi
- [x] TestDbContextFactory helper olusturuldu (InMemory DB)
- [x] EnumSerializationTests: 21 test (tum enum'larin serialize/deserialize dogrulamasi)
- [x] IndustryDBContextTests: 4 test (Customer, Product, Offer CRUD + Delete)
- [x] Tum testler basariyla gecti (25/25)

## Teknik Detaylar
### Ne Yapildi
1. Ana proje .NET 8'e yukseltildi (EOL .NET 7'den gecis)
2. Tum Newtonsoft.Json kullanimlari System.Text.Json'a donusturuldu
3. xUnit test projesi olusturuldu, solution'a eklendi
4. InMemory database ile calisan test helper olusturuldu
5. Enum serialization testleri ile .NET 8 gecisi dogrulandi
6. DbContext CRUD testleri ile veri erisim katmani dogrulandi

### Nasil Yapildi
- csproj: TargetFramework net7.0 -> net8.0, LangVersion 10 -> 12
- NuGet: Tum Microsoft paketleri 8.0.0'a guncellendi
- Constants/*.cs: `using Newtonsoft.Json` -> `using System.Text.Json.Serialization`
- Controllers + Auth: `JsonConvert.SerializeObject` -> `JsonSerializer.Serialize`
- Controllers + Auth: `JsonConvert.DeserializeObject` -> `JsonSerializer.Deserialize`
- Dockerfile: sdk:7.0/aspnet:7.0 -> sdk:8.0/aspnet:8.0
- Test projesi: `dotnet new xunit -n Quvex.API.Tests -f net8.0`

### Degisen Dosyalar
| Dosya | Degisiklik |
|-------|-----------|
| Quvex.API/Quvex.API.csproj | net7.0->net8.0, paket versiyonlari guncellendi |
| Quvex.API/Program.cs | IgnoreNullValues -> DefaultIgnoreCondition |
| Quvex.API/global.json | 7.0.0 -> 8.0.0 |
| Quvex.API/Dockerfile | sdk:7.0->8.0, aspnet:7.0->8.0 |
| Quvex.API/Constants/*.cs (9 dosya) | Newtonsoft -> System.Text.Json |
| Quvex.API/Auth/YetkiDenetimi.cs | Newtonsoft -> System.Text.Json |
| Quvex.API/Controllers/SalesController.cs | Newtonsoft -> System.Text.Json |
| Quvex.API/Controllers/ProductController.cs | Newtonsoft -> System.Text.Json |
| Quvex.API/Controllers/ChartController.cs | Newtonsoft -> System.Text.Json |
| Quvex.API.Tests/ (yeni proje) | xUnit test projesi |
| Quvex.API.Tests/Helpers/TestDbContextFactory.cs | Yeni eklendi |
| Quvex.API.Tests/Constants/EnumSerializationTests.cs | Yeni eklendi |
| Quvex.API.Tests/DataAccess/IndustryDBContextTests.cs | Yeni eklendi |

### Etki Analizi
- **Backend:** .NET 8 runtime gerekli (production server guncellenmeli)
- **Docker:** Image'lar 8.0 base kullanacak
- **CI/CD:** Jenkins pipeline'da .NET 8 SDK yuklu olmali
- **Frontend:** Etkilenmiyor (API response formati ayni, enum'lar string olarak donuyor)
- **JSON davranisi:** Newtonsoft'tan System.Text.Json'a geciste enum serialization AYNI kaliyor
- **Newtonsoft paketi:** Artik NuGet referansi yok, tamamen kaldirildi

## Test Sonuclari
- Test dosyasi: Quvex.API.Tests/
- Gecen test sayisi: 25/25
- Enum Serialization: 21 test (tum enum tipleri icin serialize + deserialize)
- DbContext CRUD: 4 test (Customer, Product, Offer create/read + delete)
- Kapsam: Constants ve DataAccess katmanlari

## Commit Bilgisi
- Commit hash: 0a85f2c
- Commit mesaji: [FAZ1][C1-09] .NET 8 upgrade + xUnit test projesi kurulumu
