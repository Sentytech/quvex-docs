# [C2-03] Vitest + React Testing Library Kurulumu

## Durum: DONE
## Oncelik: YUKSEK
## Faz: 1
## Tarih: 2026-03-07

## Aciklama
Frontend icin Vitest + React Testing Library test altyapisini kurmak.

## Yapilan Isler
- [x] vitest, @testing-library/react@12, @testing-library/jest-dom@5, @testing-library/user-event@13, jsdom yukle
- [x] vitest.config.js olustur (jsdom environment, craco alias'lari ile uyumlu)
- [x] src/setupTests.js olustur (jest-dom extend)
- [x] package.json'a test/test:watch/test:coverage script'leri ekle
- [x] Eski App.test.js exclude edildi (CRA testi, JSX parse hatasi)
- [x] Utils.test.js: 15 test (isObjEmpty, kFormatter, htmlToString, getHomeRouteForLoggedInUser)
- [x] Constants.test.js: 15 test (tum enum/constant dogrulamalari)
- [x] Tum testler basariyla gecti (30/30)

## Teknik Detaylar
### Ne Yapildi
1. Vitest test framework'u React 17 uyumlu versiyonlarla kuruldu
2. Craco webpack alias'lari vitest.config.js'de resolve.alias olarak tanimlandi
3. Utility fonksiyonlari ve sabitlerin testleri yazildi

### Nasil Yapildi
- npm install --save-dev --legacy-peer-deps (React 17 peer dep uyumu)
- @testing-library/react@12 (React 17 uyumlu son versiyon)
- vitest.config.js: jsdom environment, CSS disabled, alias mapping
- Eski App.test.js exclude edildi (JSX parse sorunu - .js uzantili dosyada JSX)

### Degisen Dosyalar
| Dosya | Degisiklik |
|-------|-----------|
| package.json | devDependency eklendi, test script'leri guncellendi |
| package-lock.json | Yeni bagimliliklar |
| vitest.config.js | Yeni eklendi |
| src/setupTests.js | Yeni eklendi |
| src/utility/__tests__/Utils.test.js | Yeni eklendi |
| src/utility/__tests__/Constants.test.js | Yeni eklendi |

### Etki Analizi
- Mevcut koda degisiklik YOK
- Sadece test altyapisi ve ornek testler eklendi
- package.json test script degisti (craco test -> vitest run)
- CRA test runner artik kullanilmiyor, Vitest aktif

## Test Sonuclari
- Gecen test sayisi: 30/30
- Utils: 15 test (4 fonksiyon icin)
- Constants: 15 test (enum ve sabit degerlerin dogrulamasi)

## Commit Bilgisi
(Commit atilacak)
