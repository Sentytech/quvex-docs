# Quvex ERP - Küçük → Orta Ölçek Yol Haritası
**Tarih:** 2026-03-15

---

## MEVCUT DURUM: 7/10 (Startup MVP)
Tüm özellikler mevcut, ticari SaaS altyapısı eksik.

---

## 1. BACKEND ALTYAPI EKSİKLERİ (27-38 gün)

| # | Eksik | Ne Lazım | Efor | Öncelik |
|---|-------|----------|------|---------|
| 1 | **Redis Cache** | IMemoryCache → IDistributedCache + Redis | 3-4 gün | Faz 1 |
| 2 | **DB Backup/DR** | pg_dump otomasyonu, 30 gün retention, restore testi | 2-3 gün | Faz 1 |
| 3 | **Cloud File Storage** | Local disk → Azure Blob/S3 abstraction | 3-4 gün | Faz 2 |
| 4 | **Hangfire** | Mevcut ScheduledService → Hangfire persistent queue | 3-4 gün | Faz 2 |
| 5 | **Monitoring** | Prometheus + Grafana (CPU, RAM, latency, DB pool) | 3-4 gün | Faz 2 |
| 6 | **Centralized Logging** | Serilog → Seq veya ELK stack | 2-3 gün | Faz 3 |
| 7 | **Kubernetes** | Helm chart, liveness/readiness probes, HPA | 5-7 gün | Faz 2 |
| 8 | **HTTPS/SSL** | Let's Encrypt automation, cert-manager | 1-2 gün | Faz 1 |
| 9 | **Email Templates** | HTML email şablonları + queue (Hangfire ile) | 2-3 gün | Faz 2 |
| 10 | **Row-Level Security** | Tenant izolasyonu güçlendirme (PostgreSQL RLS) | 3-4 gün | Faz 3 |

---

## 2. FRONTEND / UI EKSİKLERİ (33-46 gün)

| # | Eksik | Ne Lazım | Efor | Öncelik |
|---|-------|----------|------|---------|
| 1 | **Accessibility (A11Y)** | ARIA labels, keyboard nav, focus indicators (WCAG AA) | 7-10 gün | Faz 3 |
| 2 | **Mobile Responsive** | Tablo responsive, KPI card flex, breakpoint düzeltmeleri | 5-7 gün | Faz 3 |
| 3 | **PWA / Offline** | Service worker + Workbox, app shell caching | 3-4 gün | Faz 3 |
| 4 | **Form Validation** | Tüm formlarda tutarlı Yup schema validation | 4-5 gün | Faz 2 |
| 5 | **PDF Export** | jsPDF/react-pdf ile tüm raporlarda PDF export | 3-4 gün | Faz 1 |
| 6 | **Excel Export** | Tüm tablo sayfalarına standart export butonu | 2-3 gün | Faz 1 |
| 7 | **Virtual Scrolling** | Büyük veri setleri için tablo performansı | 2-3 gün | Faz 2 |
| 8 | **Bundle Optimization** | Moment.js → dayjs, tree-shaking, CDN | 2-3 gün | Faz 2 |
| 9 | **Onboarding Genişletme** | Dashboard dışı modüllere guided tour | 3-4 gün | Faz 3 |
| 10 | **Print Styles** | Fatura, rapor, CoC için print-friendly CSS | 2-3 gün | Faz 1 |

---

## 3. MOBİL APP EKSİKLERİ (21-30 gün)

| # | Eksik | Ne Lazım | Efor | Öncelik |
|---|-------|----------|------|---------|
| 1 | **Dark Mode** | ThemeContext var ama UI'a uygulanmamış | 3-4 gün | Faz 2 |
| 2 | **Offline Support** | AsyncStorage cache + sync queue | 5-7 gün | Faz 3 |
| 3 | **Push Notifications** | Expo notifications entegrasyonu | 2-3 gün | Faz 2 |
| 4 | **Eksik Ekranlar** | Hesap bilgi, dil, yardım, bildirim ayarları | 3-4 gün | Faz 2 |
| 5 | **Input Validation** | NCR/Inspection formlarında doğrulama | 2-3 gün | Faz 1 |
| 6 | **Error Handling** | Alert → Toast notification sistemi | 2-3 gün | Faz 2 |
| 7 | **Pagination** | Liste ekranlarında sayfalama | 2-3 gün | Faz 2 |
| 8 | **App Store Hazırlık** | Icon set, splash, screenshots, store listing | 2-3 gün | Faz 1 |

---

## 4. TİCARİ HAZIRLIK EKSİKLERİ (33-46 gün)

| # | Eksik | Ne Lazım | Efor | Öncelik |
|---|-------|----------|------|---------|
| 1 | **Landing Page** | Quvex.app tanıtım sitesi (Next.js/Astro) | 5-7 gün | Faz 1 |
| 2 | **Demo Ortamı** | Auto-reset demo tenant, demo.quvex.app | 3-4 gün | Faz 1 |
| 3 | **Subscription/Billing** | Stripe/iyzico entegrasyonu, plan yönetimi | 7-10 gün | Faz 2 |
| 4 | **Tenant Self-Registration** | Kayıt ol → otomatik tenant oluştur → onboarding | 4-5 gün | Faz 2 |
| 5 | **Admin Panel** | Tenant yönetimi, kullanım istatistikleri, billing dashboard | 5-7 gün | Faz 3 |
| 6 | **SLA Monitoring** | Uptime monitoring (UptimeRobot/Pingdom) | 1 gün | Faz 1 |
| 7 | **KVKK/GDPR + Legal** | Uyum, kullanım sözleşmesi, gizlilik politikası | 3-5 gün | Faz 1 |
| 8 | **Documentation** | API docs, kullanım kılavuzu, video tutorials | 5-7 gün | Faz 2 |

---

## TOPLAM TAHMİN

| Kategori | Min | Max |
|----------|-----|-----|
| Backend Altyapı | 27 gün | 38 gün |
| Frontend/UI | 33 gün | 46 gün |
| Mobil App | 21 gün | 30 gün |
| Ticari Hazırlık | 33 gün | 46 gün |
| **TOPLAM** | **114 gün** | **160 gün** |

### Ekip Bazlı Süre
- **1 geliştirici:** ~4-6 ay
- **2 geliştirici:** ~2.5-3.5 ay
- **3 geliştirici (backend+frontend+mobil):** ~2-2.5 ay

---

## FAZ PLANI

### Faz 1 — Satışa Hazırlık (4-6 hafta)
**Hedef:** İlk müşteriye demo gösterilebilir duruma gelmek

- [ ] Landing page (quvex.app)
- [ ] Demo ortamı (demo.quvex.app)
- [ ] DB backup otomasyonu
- [ ] Redis cache
- [ ] HTTPS/SSL
- [ ] PDF/Excel export tüm sayfalara
- [ ] Print styles (fatura, rapor, CoC)
- [ ] Mobile app store hazırlık
- [ ] Mobile input validation
- [ ] SLA monitoring
- [ ] KVKK/Legal dokümanlar

### Faz 2 — Ölçekleme (4-6 hafta)
**Hedef:** Çoklu müşteri, ödeme alabilir duruma gelmek

- [ ] Kubernetes + Helm
- [ ] Cloud file storage (Azure Blob/S3)
- [ ] Hangfire background jobs
- [ ] Monitoring (Prometheus+Grafana)
- [ ] Subscription/Billing (Stripe/iyzico)
- [ ] Tenant self-registration + onboarding
- [ ] Form validation standardizasyonu
- [ ] Virtual scrolling (büyük tablolar)
- [ ] Bundle optimization (moment→dayjs)
- [ ] Email templates + queue
- [ ] Mobile dark mode, push notifications, pagination
- [ ] Documentation + video tutorials

### Faz 3 — Kurumsal Kalite (4-6 hafta)
**Hedef:** Enterprise müşteri gereksinimlerini karşılamak

- [ ] Accessibility (WCAG AA)
- [ ] Mobile responsive düzeltmeleri
- [ ] PWA offline support
- [ ] Centralized logging (Seq/ELK)
- [ ] Row-Level Security (PostgreSQL RLS)
- [ ] Admin panel (tenant yönetimi, billing dashboard)
- [ ] Onboarding genişletme (tüm modüller)
- [ ] Mobile offline support

---

## PRODUCTION READINESS MEVCUT DURUM

| Alan | Durum | Notlar |
|------|-------|--------|
| Multi-tenancy | ✅ | Schema-per-tenant, subdomain routing |
| Rate Limiting | ✅ | 100/min genel, 10/min login, 5/min upload |
| i18n (TR/EN) | ✅ | Full, extensible |
| API Docs (Swagger) | ✅ | Full OpenAPI 3.0 |
| Env Config | ✅ | 3-tier, env variable override |
| Auth & Security | ✅ | YetkiDenetimi, CSRF, lockout, audit |
| Logging | ⚠️ | Serilog+Sentry, centralized yok |
| Email | ⚠️ | SMTP basic, template yok |
| Caching | ⚠️ | In-memory only, Redis yok |
| Monitoring | ⚠️ | Health check only, metrics yok |
| HTTPS | ⚠️ | Partial, cert management yok |
| Deployment | ⚠️ | Docker ready, K8s yok |
| File Storage | ⚠️ | Local disk only |
| Backup/DR | ❌ | Yok — KRİTİK |
| K8s/Orchestration | ❌ | Yok |
| A11Y (WCAG) | ❌ | Minimal ARIA |
| PWA/Offline | ❌ | Service worker yok |
