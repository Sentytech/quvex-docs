# [C2-09] Environment Config Duzenleme

## Durum: DONE
## Oncelik: ORTA
## Faz: 1
## Tarih: 2026-03-07

## Aciklama
Environment dosyalarini duzenleme. Hassas URL'leri git'ten cikarma.

## Yapilan Isler
- [x] .env.example dosyasi olusturuldu (guvenli varsayilanlarla)
- [x] .env.* dosyalari .gitignore'a eklendi (!.env.example haric)
- [x] Mevcut .env dosyalari git tracking'den cikarildi (lokal kalir)
- [x] 4 adet Vitest testi yazildi

## Teknik Detaylar
### Ne Yapildi
1. .env.example: REACT_APP_API_ENDPOINT, REACT_APP_BASENAME, SKIP_PREFLIGHT_CHECK
2. .gitignore: `.env.*` eklendi, `!.env.example` istisna
3. git rm --cached: .env.bmt, .env.development, .env.production, .env.saha, .env.test
   Bu dosyalar artik git'te takip edilmiyor (lokal kalir, commit'lenmez)

### Degisen Dosyalar
| Dosya | Degisiklik |
|-------|-----------|
| .env.example | Yeni - guvenli varsayilanlar |
| .gitignore | .env.* eklendi |
| .env.* | git tracking'den cikarildi |
| src/config/__tests__/environment.test.js | 4 yeni test |

### Etki Analizi
- Production URL'leri (sahasavunma.com, sentytech.web.tr) artik git'te olmayacak
- Yeni gelistiriciler .env.example'i kopyalayip .env.development yapmali
- Mevcut lokal dosyalar etkilenmez (sadece git tracking durur)

## Test Sonuclari
51/51 UI test PASSED

## Commit Bilgisi
[FAZ1][C2-09] Environment config - hassas URL'leri git'ten cikarma
