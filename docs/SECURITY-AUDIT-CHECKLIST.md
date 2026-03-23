# Guvenlik Denetimi Hazirlik Kontrol Listesi

## 1. Kimlik Dogrulama ve Yetkilendirme

### Kimlik Dogrulama
- [x] JWT tabanlı kimlik dogrulama
- [x] Refresh token mekanizmasi (opaque random token)
- [x] Sifre politikasi: min 12 karakter, buyuk/kucuk harf, rakam, ozel karakter
- [x] Hesap kilitleme: 5 basarisiz deneme → 15 dk kilit
- [x] Sifre hash: ASP.NET Identity (PBKDF2)
- [x] Token suresi sinirli (JWT: 30 dk, Refresh: 7 gun)
- [x] Cikis yaparken refresh token iptal edilir

### Yetkilendirme
- [x] Rol tabanli erisim kontrolu (RBAC)
- [x] YetkiDenetimi ActionFilterAttribute ile controller-seviyesi koruma
- [x] Granüler izinler: Goruntule/Kaydet/Sil
- [x] Multi-tenant izolasyon (schema-per-tenant + HasQueryFilter)
- [x] Super admin ayri yetki seviyesi
- [x] Frontend: CASL ability + route guard

## 2. Veri Sifreleme

### Aktarim Sirasinda (In-Transit)
- [x] HTTPS zorunlu (HSTS header ile)
- [x] TLS 1.2+ destegi
- [x] SSL sertifika yonetimi dokumante (docs/SSL-SETUP.md)
- [x] Ingress TLS terminasyonu (Kubernetes)

### Duragan Halde (At-Rest)
- [ ] PostgreSQL transparent data encryption (TDE) — onerilen
- [x] Sifreler hash olarak saklanir (asla plain text degil)
- [x] JWT secret key environment variable ile yonetilir
- [x] Hassas veriler (DB connection string, JWT key) environment variable'da

## 3. Girdi Dogrulama ve Sanitizasyon

### Sunucu Tarafi
- [x] FluentValidation ile model dogrulama
- [x] Parametreli sorgular (SQL injection koruması)
- [x] RequestValidationMiddleware: Content-Type, boyut limitleri
- [x] Dosya yukleme: whitelist (izin verilen uzantilar), 10MB limit
- [x] Path traversal korumasi
- [x] MIME type dogrulama

### Istemci Tarafi
- [x] Form validasyonu
- [x] XSS korumasi (React otomatik escaping)
- [x] CSP meta tag

## 4. Bagimlilık Guvenlik Yonetimi

### .NET Backend
- [x] Dependabot yapilandirilmis
- [x] GitHub Actions guvenlik is akislari (Trivy, TruffleHog)
- [x] NuGet paket guncellemeleri duzgun takip edilir

### Frontend
- [x] npm audit: 0 guvenlik acigi
- [x] Dependabot yapilandirilmis
- [x] Axios 1.13.6 (guncel)
- [x] Kullanilmayan bagimliliklar kaldirildi

## 5. Loglama ve Izleme

### Loglama
- [x] Serilog ile yapilandirilmis loglama
- [x] Konsol + dosya + Seq (opsiyonel) cikislari
- [x] SecurityAuditService: [SECURITY] onekli loglar
- [x] Request/Response loglama (RequestLoggingMiddleware)
- [x] Audit trail (AuditTrailEntry entity)
- [x] Tenant bilgisi loglarla zenginlestirilmis (TenantLogEnricher)

### Izleme
- [x] Prometheus uyumlu /metrics endpoint (MetricsMiddleware)
- [x] Saglik kontrol endpointi (/health)
- [x] Sentry hata izleme (API + UI)
- [x] AlertService: sistem uyarilari (her 5 dk)
- [x] SLA metrikleri: uptime %, P95 gecikme, hata orani

### Guvenlik Olaylari
- [x] Basarisiz giris denemeleri loglanir
- [x] Hesap kilitleme olaylari loglanir
- [x] Yetki ihlalleri loglanir
- [x] Rate limit asimi loglanir
- [x] Dosya yukleme denemeleri loglanir

## 6. Olay Mudahale Plani

### Seviye 1 — Dusuk (Bilgilendirme)
- Basarisiz giris denemeleri (< 3)
- Rate limit uyarilari
- **Mudahale:** Log izleme, trend analizi

### Seviye 2 — Orta (Uyari)
- Hesap kilitleme olaylari
- Birden fazla basarisiz giris (5+)
- Anormal API kullanim kaliplari
- **Mudahale:** Ilgili hesabi inceleme, IP adresini izleme

### Seviye 3 — Yuksek (Kritik)
- SQL injection denemesi tespit edildi
- Yetkisiz veri erisimi denemesi
- Sifir-gun guvenlik acigi bildirimi
- **Mudahale:** Etkilenen hesaplari kilitle, sistemi izole et, olay inceleme baslat

### Seviye 4 — Acil (Veri Ihlali)
- Kisisel veri sizintisi
- Veritabani yetkisiz erisim
- **Mudahale:**
  1. Sistemi izole et (15 dk icinde)
  2. Olay inceleme ekibini bilgilendir
  3. KVKK Kurulu'na 72 saat icinde bildirim
  4. Etkilenen kullanicilara bildirim
  5. Kök neden analizi ve duzeltme

### Iletisim Bilgileri
- Guvenlik Ekibi: security@quvex.com
- DPO: dpo@quvex.com
- Acil Durum Telefonu: [Guncellenecek]

## 7. Ek Kontroller

### Oturum Yonetimi
- [x] SameSite=Strict cookie politikasi
- [x] Secure=Always cookie bayraklari
- [x] Inaktivite zamanlayicisi (frontend)
- [x] sessionStorage kullanimi (localStorage degil)

### Altyapi
- [x] Docker non-root kullanici
- [x] HEALTHCHECK Docker directive
- [x] Kubernetes readiness/liveness probe'lari
- [x] HPA ile otomatik olceklendirme
- [x] Ingress rate limiting
- [x] Response compression (Brotli + Gzip)

### Kod Guvenligi
- [x] Husky + lint-staged pre-commit hook'lari
- [x] Source map'ler production'da devre disi
- [x] .env.example dosyasi (gercek secret'lar repoda degil)
- [x] CORS: yalnizca bilinen origin'ler (wildcard yasak)
