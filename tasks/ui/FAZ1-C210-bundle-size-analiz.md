# [C2-10] Bundle Size Analizi + Optimizasyon Plani

## Durum: DONE
## Oncelik: DUSUK
## Faz: 1
## Tarih: 2026-03-07

## Aciklama
Mevcut bundle size'i analiz edip, optimizasyon plani cikar.
3 chart kutuphanesi, moment.js gibi buyuk bagimliliklarin etkisini olc.

## Yapilan Isler
- [x] Buyuk bagimliliklarin boyut analizi (node_modules uzerinden)
- [x] Kullanilmayan bagimliliklarin tespiti (grep ile import taramasi)
- [x] Her biri icin alternatif/optimizasyon onerisi
- [x] docs/BUNDLE_ANALYSIS.md raporu yazildi
- [x] Faz bazli aksiyon plani olusturuldu

## Teknik Detaylar
### Ne Yapildi
1. Tum buyuk paketlerin minified boyutlari olculdu
2. Her paketin src/ icinde kullanim sayisi grep ile tespit edildi
3. Kullanilmayan paketler belirlendi (jquery, draft-js, vb.)
4. 3 chart kutuphanesi sorunu dokumante edildi (~2.8 MB toplam)
5. moment.js -> dayjs gecis potansiyeli belirlendi (%98 kucultme)

### Onemli Bulgular
- 3 chart kutuphanesi: recharts (2.1 MB), apexcharts (486 KB), chart.js (192 KB)
- moment.js 22 dosyada kullaniliyor, dayjs ile degistirilebilir (369 KB -> 7 KB)
- jquery ve draft-js hic kullanilmiyor - kaldirilabilir
- Toplam potansiyel tasarruf: ~2.5 MB (minified)

### Degisen Dosyalar
| Dosya | Degisiklik |
|-------|-----------|
| docs/BUNDLE_ANALYSIS.md | Yeni - detayli analiz raporu |

### Etki Analizi
- Sadece analiz, kod degisikligi YOK
- Sonraki fazlarda optimizasyonlar uygulanacak

## Test Sonuclari
Kod degisikligi yok, test gerekmiyor. Mevcut: 83/83 PASSED

## Commit Bilgisi
[FAZ1][C2-10] Bundle size analizi - buyuk bagimliliklar ve optimizasyon plani
