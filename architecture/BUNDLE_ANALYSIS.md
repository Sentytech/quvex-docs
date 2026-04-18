# Bundle Size Analizi

Tarih: 2026-03-07
Proje: smallFactoryUI (React 17 + CRA + Craco)

## Buyuk Bagimliliklar (Minified boyutlarina gore)

| Paket | Min Boyut | Kullanim | Oneri |
|-------|----------|---------|-------|
| recharts | ~2.1 MB | Dashboard (3 dosya) | Faz 6: Sadece kullanilan chart tiplerini import et (tree-shake) |
| xlsx | ~945 KB | Export islemleri | Faz 5: Lazy import ile sadece export aninda yukle |
| antd | ~928 KB | Tum uygulama | Faz 3: babel-plugin-import ile tree-shaking (sadece kullanilan component'ler) |
| apexcharts | ~486 KB | Dashboard (5 dosya) | Faz 6: recharts ile birlestir, birini kaldir |
| moment.js | ~369 KB | 22 dosya (tarih formatlama) | Faz 3: dayjs ile degistir (~7 KB) - EN YUKSEK ROI |
| chart.js | ~192 KB | Dashboard (3 dosya) | Faz 6: 3 chart kutuphanesi var, 1'e indir |
| draft-js | ~173 KB | Kullanilmiyor! | Faz 2: Kaldir - sifir kullanim |
| jquery | ~89 KB | Kullanilmiyor! | Faz 2: Kaldir - sifir kullanim |
| sweetalert2 | ~42 KB | Az sayida dosya | Faz 4: antd Modal/notification ile degistir |

## Kullanilmayan Bagimliliklar (Kaldirilabilir)

| Paket | Neden |
|-------|-------|
| jquery | React projede jQuery gereksiz, hicbir dosyada import yok |
| draft-js + react-draft-wysiwyg + draftjs-to-html + html-to-draftjs | Rich text editor - hicbir dosyada import yok |
| react-data-table-component | Ant Design Table kullaniliyor |
| react-shepherd | Tour/wizard - aktif kullanim yok |
| apexcharts-clevision | apexcharts fork'u, gereksiz |
| axios-mock-adapter | Test icin vitest mock kullaniliyor |
| craco (paket) | @craco/craco zaten var, ayri 'craco' paketi gereksiz |
| npm (paket) | npm dependency olarak eklenmis, gereksiz |
| yarn (paket) | yarn dependency olarak eklenmis, gereksiz |

## 3 Chart Kutuphanesi Sorunu

Projede 3 farkli chart kutuphanesi var:
1. **recharts** (~2.1 MB) - Dashboard'da kullaniliyor
2. **apexcharts + react-apexcharts** (~486 KB) - Dashboard widget'larinda
3. **chart.js + react-chartjs-2** (~192 KB) - Dashboard'da

**Toplam: ~2.8 MB** sadece chart icin. Tek bir kutuphaneye inmek ~1.8 MB tasarruf saglar.

## moment.js Sorunu

moment.js (369 KB) 22 dosyada kullaniliyor. dayjs (7 KB) drop-in replacement'tir
ve ayni API'yi sunar. **%98 boyut azalmasi** mumkun.

## Gercek Build Sonuclari

Build komutu: `NODE_OPTIONS=--openssl-legacy-provider craco build`

| Metrik | Deger |
|--------|-------|
| Toplam JS (source maps haric) | **6.6 MB** |
| Toplam CSS | **5.2 MB** |
| Chunk sayisi | 75 JS dosyasi |
| En buyuk chunk | 939 KB (chunk 11) |
| 2. buyuk chunk | 695 KB (chunk 43) |
| 3. buyuk chunk | 464 KB (chunk 12) |

Not: CRA code splitting zaten aktif (75 chunk). Ancak buyuk bagimliliklar
hala ana chunk'larda yer aliyor.

## Aksiyon Plani

### Faz 2 (Hemen yapilabilir - Sifir risk)
- [ ] jquery, draft-js, react-draft-wysiwyg, draftjs-to-html, html-to-draftjs kaldir
- [ ] react-shepherd, apexcharts-clevision, axios-mock-adapter kaldir
- [ ] npm, yarn, craco (duplike) paketlerini kaldir
- **Tahmini tasarruf: ~400 KB**

### Faz 3 (moment.js + antd optimizasyon)
- [ ] moment.js -> dayjs gecisi (22 dosya)
- [ ] babel-plugin-import ile antd tree-shaking
- **Tahmini tasarruf: ~900 KB**

### Faz 5 (Lazy loading)
- [ ] xlsx lazy import (React.lazy + dynamic import)
- [ ] Route-based code splitting (React.lazy + Suspense)
- **Tahmini tasarruf: ilk yukleme ~500 KB azalir**

### Faz 6 (Chart birlestirme)
- [ ] 3 chart kutuphanesini 1'e indir (recharts veya apexcharts)
- **Tahmini tasarruf: ~700 KB**

### Toplam Potansiyel Tasarruf: ~2.5 MB (minified), ~700 KB (gzipped)
