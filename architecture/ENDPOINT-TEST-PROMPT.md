# Quvex API-UI Endpoint Test Prompt

Bu prompt'u Claude Code'a yapistirarak hizli endpoint testi yapabilirsiniz.

---

## Hizli Test Prompt'u (Kopyala-Yapistir)

```
Quvex API-UI endpoint testini calistir ve sonuclari raporla.

Adimlar:
1. API'nin ayakta olup olmadigini kontrol et: curl http://localhost:5052/swagger/index.html
2. UI'nin ayakta olup olmadigini kontrol et: curl http://localhost:3000
3. Eger kapaliysa:
   - API: cd /c/rynSoft/quvex/smallFactoryApi/src/Quvex.API && nohup dotnet run --no-build > /dev/null 2>&1 &
   - UI: cd /c/rynSoft/quvex/smallFactoryUI && nohup npx vite --port 3000 > /dev/null 2>&1 &
4. Playwright endpoint testini calistir:
   cd /c/rynSoft/quvex/smallFactoryUI && npx playwright test e2e/api-endpoint-health.spec.js --project=setup --project=chromium --grep "Full endpoint summary" --retries=0
5. Basarisiz endpoint'ler varsa:
   a. 429 (rate limiting) ise: tekrar calistir, gecici sorun
   b. 404 ise: controller route'unu kontrol et, UI service dosyasindaki path'i kontrol et
   c. 500 ise: API loglarini kontrol et, muhtemelen DB'de eksik kolon/tablo var
   d. 401 ise: Token dogrulama sorunu — YetkiDenetimi ve RefreshToken tablosunu kontrol et
6. DB eksik kolon/tablo duzeltme:
   - Kolon: docker exec smallfactory-postgres psql -U postgres -d quvex_dev -c "ALTER TABLE public.\"TabloAdi\" ADD COLUMN IF NOT EXISTS \"KolonAdi\" tip DEFAULT deger;"
   - Ayni kolonu tenant semalarina da ekle: tenant_rynsoft, tenant_demo
7. Duzeltmelerden sonra testi tekrar calistir
8. architecture/API-UI-ENDPOINT-MAP.md dosyasini guncelle

Test dosyasi: e2e/api-endpoint-health.spec.js
Endpoint haritasi: architecture/API-UI-ENDPOINT-MAP.md
Login: admin@quvex.com / Admin123!@#$
API: http://localhost:5052
UI: http://localhost:3000
DB: quvex_dev (PostgreSQL, Docker: smallfactory-postgres)
```

---

## Yeni Modul Eklendiginde Prompt

```
Yeni bir modul/endpoint eklendi. Endpoint testine ekle ve dogrula.

1. Yeni controller'in route'unu bul: grep -n "Http\|Route" /c/rynSoft/quvex/smallFactoryApi/src/Quvex.API/Controllers/YeniController.cs
2. UI'da hangi sayfadan cagrildigi bul: grep -r "YeniEndpoint" /c/rynSoft/quvex/smallFactoryUI/src/services/
3. e2e/api-endpoint-health.spec.js ENDPOINTS dizisine ekle:
   ['GET', '/YeniController/endpoint', 200, '/ui-route', 'Aciklama'],
4. Testi calistir: npx playwright test e2e/api-endpoint-health.spec.js --grep "Full endpoint summary" --retries=0
5. architecture/API-UI-ENDPOINT-MAP.md dosyasini guncelle
```

---

## DB Migration Sonrasi Prompt

```
DB'de yeni tablo veya kolon eklendi. Tum semalarda guncelle ve test et.

1. EF model'i kontrol et: cat /c/rynSoft/quvex/smallFactoryApi/src/Quvex.API/Models/YeniModel.cs
   veya: cat /c/rynSoft/quvex/smallFactoryApi/src/Quvex.Domain/Entities/.../YeniModel.cs
2. DB'deki mevcut kolonlari kontrol et:
   docker exec smallfactory-postgres psql -U postgres -d quvex_dev -c "SELECT column_name FROM information_schema.columns WHERE table_schema='public' AND table_name='TabloAdi';"
3. Eksik kolonlari public + tenant semalarina ekle
4. TenantId kontrolu: BaseFullModel'den miras alan tum tablolarda TenantId olmali
   docker exec smallfactory-postgres psql -U postgres -d quvex_dev -c "
   SELECT table_name FROM information_schema.columns
   WHERE table_schema='public' AND column_name='CreatorId'
   AND table_name NOT IN (SELECT table_name FROM information_schema.columns WHERE table_schema='public' AND column_name='TenantId');"
5. Endpoint testini calistir
```

---

## Sorun Giderme Rehberi

| Hata | Sebep | Cozum |
|------|-------|-------|
| 401 Token gecersiz | UI jwToken gonderiyor, API refreshToken bekliyor | Login.js'te `accessToken: res.data.userData.refreshToken` olmali |
| 404 Endpoint bulunamadi | Controller route farki | Controller'daki `[HttpGet]` route'larini kontrol et |
| 405 Method Not Allowed | Root GET yok | Sub-route kullan (orn: `/verifications`, `/items`) |
| 429 Rate Limiting | Cok hizli istek | Test'te delay artir veya tekrar calistir |
| 500 Column not exist | DB'de eksik kolon | ALTER TABLE ile ekle (public + tenant semalari) |
| 500 Relation not exist | DB'de eksik tablo | CREATE TABLE ile olustur |
| Swagger 500 | Controller'da HTTP method eksik | `[NonAction]` attribute ekle |

---

## Dosya Konumlari

| Dosya | Konum |
|-------|-------|
| Endpoint test | `C:\rynSoft\quvex\smallFactoryUI\e2e\api-endpoint-health.spec.js` |
| Endpoint haritasi | `C:\rynSoft\quvex\smallFactoryUI\docs\API-UI-ENDPOINT-MAP.md` |
| Auth setup | `C:\rynSoft\quvex\smallFactoryUI\e2e\auth.setup.js` |
| Playwright config | `C:\rynSoft\quvex\smallFactoryUI\playwright.config.js` |
| API Controllers | `C:\rynSoft\quvex\smallFactoryApi\src\Quvex.API\Controllers\` |
| UI Services | `C:\rynSoft\quvex\smallFactoryUI\src\services\` |
| UI Routes | `C:\rynSoft\quvex\smallFactoryUI\src\router\routes\index.js` |
| DB | `quvex_dev` @ `smallfactory-postgres:5432` (mapped 5433) |
