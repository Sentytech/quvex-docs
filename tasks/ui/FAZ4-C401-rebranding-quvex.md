# [C401] Rebranding: Asya Uretim Takip -> Quvex

## Durum: DONE
## Oncelik: YUKSEK
## Faz: 4
## Tarih: 2026-03-08

## Aciklama
Proje ismi "Asya Uretim Takip" yerine global ve profesyonel "Quvex" markasina donusturuldu.
Yeni SVG logo tasarlandi (V4 Shield + Factory silhouette). Tum UI genelinde marka uygulamasi yapildi.

## Yapilan Isler
- [x] Proje ismi "Quvex" olarak belirlendi
- [x] V4 Shield+Factory SVG logo tasarlandi (koyu + beyaz versiyonlar)
- [x] Login sayfasi yeniden tasarlandi (fabrika foto slideshow)
- [x] Tum sayfalarda marka guncellendi
- [x] Navbar, footer, spinner, hata sayfalarina logo eklendi

## Teknik Detaylar
### Ne Yapildi
- 2 SVG logo dosyasi olusturuldu (quvex-logo.svg, quvex-logo-white.svg)
- Login.js: Fabrika foto slideshow + overlay + feature tag'leri
- themeConfig.js: appName ve appLogoImage guncellendi
- Tum "Asya" referanslari "Quvex" ile degistirildi

### Degisen Dosyalar
| Dosya | Degisiklik |
|-------|-----------|
| src/assets/images/logo/quvex-logo.svg | Yeni eklendi |
| src/assets/images/logo/quvex-logo-white.svg | Yeni eklendi |
| src/assets/images/login/factory1.jpg | Yeni eklendi |
| src/assets/images/login/factory2.jpg | Yeni eklendi |
| src/assets/images/login/factory3.jpg | Yeni eklendi |
| src/views/Login.js | Tamamen yeniden tasarlandi |
| src/configs/themeConfig.js | Logo ve isim guncellendi |
| src/@core/layouts/HorizontalLayout.js | Logo guncellendi |
| src/@core/layouts/components/footer/index.js | Logo + Quvex eklendi |
| src/@core/layouts/components/menu/vertical-menu/VerticalMenuHeader.js | Logo guncellendi |
| src/@core/components/spinner/Fallback-spinner.js | Logo guncellendi |
| src/views/Error.js | Logo guncellendi |
| src/views/NotAuthorized.js | Logo guncellendi |
| src/views/UnderConstruction.js | Logo guncellendi |
| src/views/Home.js | Logo + isim guncellendi |
| src/router/routes/index.js | TemplateTitle guncellendi |
| public/index.html | Title guncellendi |

### Etki Analizi
- Tum sayfalar etkilendi (navbar logo)
- Login sayfasi tamamen yeni tasarim
- Footer tum sayfalarda Quvex markasi gosteriyor
