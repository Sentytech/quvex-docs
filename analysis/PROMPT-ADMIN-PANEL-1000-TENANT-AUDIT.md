# Prompt: Quvex Admin Panel — 1000 Tenant Olgunluk Analizi

> Bu prompt, Quvex'in mevcut admin panelinin 1000 tenant ölçeğinde
> yeterli olup olmadığını analiz etmek için tasarlanmıştır.
> Bir AI agent'a (veya insan ekibine) verilebilir.

---

## ROL ve PERSPEKTİF

Sen üç farklı disiplinden uzmanlığı birleştiren bir SaaS architect'sin:

1. **Operations Lead** — eski Insider/Trendyol/Hepsiburada Tech. 200+ tenant'lı multi-tenant SaaS'ları yönetmiş. Quota, lifecycle automation, bulk operations konularında derin deneyim.

2. **Senior SRE** — eski Vodafone Cloud/Hepsiburada SRE. PostgreSQL/.NET ekosisteminde 1000+ tenant ölçeğine çıkarılmış sistemleri yaşamış. Per-tenant resource isolation, observability, incident response uzmanı.

3. **Customer Success Manager** — eski Algolia/Iyzico CS. Trial→Pro conversion funnel, churn prevention, health scoring, in-app NPS sistemleri kurmuş. SaaS metrics (MRR/ARR, NRR, churn, activation rate) net konuşur.

Üçü birlikte Quvex'e dışarıdan gelmiş bir **due diligence ekibi** olarak değerlendirme yapacak. Hem dürüst hem yapıcı, hem kısa vadeli quick win hem uzun vadeli stratejik roadmap çıkaracaklar.

---

## BAĞLAM

Quvex bir **multi-tenant ERP SaaS** ürünüdür:
- Stack: .NET 8, PostgreSQL (schema-per-tenant), Redis, Hangfire, SignalR, React UI
- Mimari: 50 tenant aktif, 1000 tenant hedefi
- Multi-tenant strategy: Schema-per-tenant (Tier 1 Shared) + Dedicated DB (Tier 2) + Dedicated Server (Tier 3)
- Sektör: Türkiye KOBİ üretim/ERP, 18 dikey
- Mevcut admin altyapısı: ~30 API endpoint + ~14 React sayfası

## KAYNAK DOSYALAR

- API kontrolör'leri: `C:\rynSoft\quvex\smallFactoryApi\src\Quvex.API\Controllers\Admin*Controller.cs`, `Tenant*Controller.cs`
- Application service'leri: `C:\rynSoft\quvex\smallFactoryApi\src\Quvex.Application\Services\Tenant*Service.cs`, `*MonitoringService.cs`
- React UI: `C:\rynSoft\quvex\smallFactoryUI\src\views\admin\*`, `src\views\modul\admin\*`
- Mevcut planlar: `C:\rynSoft\quvex\quvex-docs\architecture\1000-TENANT-SCALABILITY-PLAN.md`, `TENANT-50-PLAN.md`, `TENANT-*.md`
- Sprint'ler: `C:\rynSoft\quvex\quvex-docs\sprints\` (Sprint 1-15, özellikle 13-14 cross-tenant fix'leri)

---

## ANALİZ İSTENEN

### Bölüm 1 — Mevcut Envanter (Olduğu gibi tarama)

Aşağıdakileri exhaustive listele:

1. **Admin API endpoint'leri** — her endpoint için: HTTP metodu + path + kısa amaç + permission + kullanım örneği
2. **Admin UI sayfaları** — her sayfa için: rota + amaç + hangi endpoint'leri çağırıyor + ekran görüntüsü tahmini
3. **Background job'lar** — Hangfire recurring + on-demand
4. **Mevcut izleme/metrik altyapısı** — neyi ölçüyoruz (Sentry, Seq, Prometheus, custom)
5. **Mevcut tenant lifecycle akışı** — register'dan suspension'a kadar adım adım
6. **Mevcut billing entegrasyonu** — PayTR, Iyzico, plan tanımları
7. **Mevcut backup/restore mekanizması** — hangi script'ler, hangi tetikleyici, RTO/RPO

### Bölüm 2 — 4 Disiplin Bazlı Eksiklik Analizi

Her disiplin için `[KRİTİK | YÜKSEK | ORTA | DÜŞÜK]` severity ile **eksik özellik listesi**:

#### 2.1 Operations
- Tenant lifecycle automation (trial expire, freeze, archive, delete, restore)
- Quota enforcement (DB size, storage MB, API rate, user count)
- Bulk operations (filter → action: 500 tenant'a tek tıklama)
- Tenant search/filter (advanced — plan, lastLogin, sector, MRR)
- Maintenance window scheduling
- Per-tenant feature flags
- Notification template editor (in-app + email + WhatsApp)
- Audit log (immutable, searchable, exportable)

#### 2.2 SRE / Infrastructure
- Per-tenant resource metrics (CPU, RAM, IOPS, connection count)
- Slow query log per tenant (`pg_stat_statements` entegre)
- Connection pool dashboard
- Hangfire job health (admin'e entegre)
- Backup verification + restore drill
- Disaster recovery runbook + tooling
- Capacity forecasting (6 ay disk, RAM, connection trend)
- Incident timeline / status page
- Synthetic monitoring (kullanıcı şikayet etmeden tespit)
- SSL/domain management (custom domain support)
- Per-tenant rate limit dashboard (mevcut middleware var, görünür mü?)
- Postgres replication lag monitoring
- Redis cache hit/miss + eviction stats

#### 2.3 Customer Success / Sales Ops
- Trial conversion funnel (register → first customer → first invoice → paid)
- Activation event tracking (timeline per tenant)
- Health score (yeşil/sarı/kırmızı per tenant — risk skoru)
- Tenant cohort analysis (sector × plan × week)
- Customer interaction log (gönderilen mail, WhatsApp, support ticket)
- Support ticket integration (Intercom, Zendesk, Freshdesk veya in-house)
- NPS / CSAT collection (in-app survey)
- Onboarding stuck detection (3 günden fazla "sadece login")
- Demo scheduling (sales req → calendar)
- Personalized communication template (sektör/plan bazlı)
- Win/lost reason tracking

#### 2.4 Billing / Finance
- Subscription overview dashboard
- Failed payment dashboard + dunning workflow
- Invoice/receipt generation
- MRR/ARR tracking
- Revenue per tenant
- Plan distribution + churn cohort
- Trial → paid conversion rate
- Refund management
- Tax compliance reports (KDV, e-fatura)
- Annual prepay discount management

### Bölüm 3 — 1000 Tenant Senaryosu Stres Analizi

Aşağıdaki senaryolar için "şu an çalışır mı, kırılır mı, ne zaman kırılır?":

1. **Cuma 17:00 — 50 yeni tenant register oluyor** (bayram öncesi son anki crunch)
2. **Pazartesi 09:00 — 1000 tenant'ta toplu trial bitti** (haftalık dunning batch)
3. **Salı 14:00 — Bir tenant 50K kayıt import ediyor** (DB yorulur, diğer tenant'ları yorar mı?)
4. **Çarşamba 23:00 — Hangfire stock-alerts job 1000 tenant'ı tarıyor** (job süresi, pool exhaustion)
5. **Perşembe 03:00 — Postgres restart** (tenant'ların kaçı RTO içinde geri gelir?)
6. **Cuma 11:00 — Sentry alarm: bir tenant DB'yi %80 doldurdu** (ne yapacağız adım adım?)
7. **Hafta sonu — admin tatilde, sistem self-healing yapabilir mi?**

### Bölüm 4 — Roadmap (12 Aylık)

3 fazlı yol haritası:

#### Faz 1 (Sprint 16-19) — 50→200 tenant temel eksikler
- 4-6 sprint
- Temel monitoring + quota + lifecycle automation
- Sayısal hedef: trial → paid conversion %40+

#### Faz 2 (Sprint 20-26) — 200→500 tenant ölçeklenme
- Per-tenant resource isolation
- CS dashboard + health score
- Billing automation
- Sayısal hedef: NPS 40+, churn <%5

#### Faz 3 (Sprint 27+) — 500→1000 tenant kurumsal
- Multi-region awareness (TR + EU)
- Tier 2 dedicated DB pratik kullanım
- Compliance (KVKK, SOC2)
- Sayısal hedef: 1000 tenant, $500K ARR

Her faz için: hedef, kapsam (item listesi), efor tahmini (sprint sayısı), riskler.

### Bölüm 5 — Bütçe ve İnsan Kaynağı

Mevcut ekip bilgileri verilmemişse şu varsayımı kullan:
- 1 senior backend (full-stack)
- 1 senior frontend
- 1 part-time DevOps
- AI assistant (Claude) ile çiftli çalışma

Bu setup'la:
- Faz 1 kaç ay?
- Faz 2 için hangi yeni rol gerek (Customer Success Manager mı, dedicated SRE mi)?
- Faz 3 için ne tür ekip büyütmesi şart?
- Outsource edilebilecek alanlar (tasarım, QA, support)?

### Bölüm 6 — Top 10 Acil Aksiyon (Sprint 16'dan başlayacak)

Bütün analizden sonra **şu hafta başlanması gereken 10 item** çıkar. Her biri için:
- Başlık
- Süre tahmini (S/M/L)
- Sorumlu disiplin (Ops/SRE/CS/Eng)
- "Yapılmadığında ne olur" (consequence)
- Kabul kriteri

### Bölüm 7 — Çıktı Formatı

Tüm analizi tek bir markdown dosyasına yaz:
`C:\rynSoft\quvex\quvex-docs\analysis\ADMIN-PANEL-1000-TENANT-AUDIT-{tarih}.md`

Yapı:
1. Yönetici özeti (300 kelime)
2. Mevcut envanter (Bölüm 1)
3. 4 disiplin eksiklik tablosu (Bölüm 2)
4. Stres senaryoları (Bölüm 3)
5. 12 aylık roadmap (Bölüm 4)
6. Bütçe ve insan kaynağı (Bölüm 5)
7. **Top 10 acil aksiyon (Bölüm 6) — sprint backlog formatında**
8. Ekler: yararlı linkler, benchmark SaaS örnekleri (Stripe, Linear, Notion admin'leri)

---

## KURALLAR

1. **Dürüst ol** — "Quvex iyi durumda" deme, gerçek eksikleri söyle. Övgü için yer yok.
2. **Sayılarla konuş** — "yeterli/yetersiz" değil, "200 tenant'a kadar OK, 500'de kırılır çünkü X"
3. **Benchmark kullan** — Stripe, Linear, Notion, Segment gibi olgun SaaS'ların admin paneli ne yapıyor, biz neredeyiz?
4. **Quick win + uzun vade ayır** — bazı eksikler 1 günde, bazıları 3 ayda kapanır. Net ayır.
5. **Türkiye gerçekliğini hesaba kat** — KVKK, e-fatura, PayTR/Iyzico, Türkçe support, KOBİ ödeme alışkanlıkları
6. **Quvex'in mevcut güçlü yönlerini koru** — schema-per-tenant, Hangfire setup, Sprint 13-14 cross-tenant fix'leri sağlam temel
7. **AS9100/ISO sektör fokus** — savunma sanayi tenant'ları için audit/compliance ekstra önemli

---

## BAŞLAMA

Önce kod tabanını tara (yukarıdaki dosya yolları). Sonra **350-500 satırlık** kapsamlı raporu yaz. Tek seferde tüm bölümleri kapsa, gerekirse Read tool'u ile derine in.

İş bittiğinde 200 kelime altında özet ver:
- Toplam tespit edilen eksik
- 4 disiplin bazlı dağılım
- Top 3 kritik aksiyon
- 12 aylık roadmap özeti
- Rapor dosyasının tam yolu

---

**Yazar:** Quvex Sprint Planning Notes
**Versiyon:** 1.0 (2026-04-14)
**Kaynak:** Sprint 13-14 sırasında Sprint 16+ planlaması için keşfedilen ihtiyaç
