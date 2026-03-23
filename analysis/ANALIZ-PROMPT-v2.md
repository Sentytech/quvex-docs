# QUVEX ERP — POST-DEVELOPMENT DEEP ANALYSIS PROMPT

> Bu prompt'u yeni bir Claude Code session'ında kullan.
> Amaç: F0-F6 fazları sonrası ürünün gerçek durumunu koddan doğrulayarak ortaya koymak.

---

## PROMPT

C:\rynSoft\smallFactory, C:\rynSoft\smallFactoryApi ve C:\rynSoft\smallFactoryUI klasörlerini birlikte analiz et.

### Bağlam

Bu ürün (Quvex ERP) üzerinde 7 fazlık bir iyileştirme çalışması yapıldı (F0-F6). Aşağıda iddia edilen iyileştirmeler var. Senin görevin: **her bir iddianın gerçekten kodda var olup olmadığını doğrulamak.**

Önce `C:\rynSoft\smallFactory\DURUM.md` ve `C:\rynSoft\smallFactory\FAZLANDIRMA.md` dosyalarını oku. Sonra aşağıdaki analizi yap.

### İddia edilen iyileştirmeler (doğrulanacak)

**F0 — Temel Altyapı:**
1. Server-side pagination 18+ controller'da uygulandı (PaginatedResult<T> kullanımı)
2. 87 entity'ye HasQueryFilter tenant izolasyonu eklendi
3. TenantId artık [NotMapped] değil, DB'ye yazılıyor

**F1 — Operasyonel Verim:**
4. Sipariş onaylandığında otomatik Production oluşturuluyor (ApproveSales → autoTransfer)
5. Production DONE olunca otomatik ShippingDetail draft oluşturuluyor (OnProductionCompleted)
6. Sevkiyat yapılınca otomatik Invoice draft oluşturuluyor
7. Sevk irsaliyesi modülü: entity genişletme + ShipmentStatus + ship/deliver/PDF endpoint'leri
8. Toplu stok girişi (stock-receipt-bulk), quick-start, teslimat tahmini, SignalR push

**F2 — Kalite-Sertifikasyon:**
9. İzlenebilirlik zinciri raporu (TraceabilityController — JSON + PDF)
10. Data Pack otomatik derleme (ZIP)
11. AS9100 zorunlu alan validasyonu (NCR RootCause, CAPA VerificationResult, CoC Quantity, FIR InspectedById)
12. CAPA etkinlik doğrulama (verify-effectiveness endpoint)
13. NCR maliyet takibi (ScrapCost/ReworkCost/ReturnCost)
14. FAI AS9102 PDF raporu
15. EYDEP yetkinlik matrisi (CompetencyAssignment entity)
16. FMEA RPN PDF raporlama
17. 8 AS9100 audit checklist şablonu
18. Kalite toplantı tutanağı modülü

**F3 — Saha Dayanıklılığı:**
19. Offline işlem kuyruğu (IndexedDB — offlineQueue.js)
20. Sync engine (syncEngine.js — online event + FIFO replay)
21. Offline veri önbellekleme (offlinePrefetch.js)
22. Shop floor terminal offline modu (ÇEVRIMDIŞI MOD banner)
23. PWA push notification desteği (pushNotification.js)
24. Mobil-first shop floor (shopFloorMobile.css, card layout)
25. Touch-optimized formlar (touchOptimize.js, index.css overrides)
26. Büyük font modu (fontMode.js)
27. Sürekli barkod tarama + QR kod + 3 etiket şablonu + ses/titreşim
28. Undo mekanizması (undoManager.js + UndoButton)
29. Çift onay (confirmAction.js — countdown timer)
30. Auto-save draft (autoSave.js — useAutoSave hook)
31. Network error retry (api.js interceptor)
32. Operatör eğitim turu (operatorTour.js — Joyride)

**F4 — e-Fatura:**
33. UBL-TR 1.2 XML generator (UblTrGenerator.cs)
34. IEInvoiceProvider abstraction + DefaultEInvoiceProvider
35. EInvoiceRecord entity (multi-tenant)
36. e-Fatura/e-Arşiv/e-İrsaliye endpoint'leri
37. UI: EInvoicePanel + InvoiceDetail entegrasyonu

**F5 — Platform:**
38. Self-registration endpoint (TenantRegistrationController)
39. Demo tenant (14 gün, pre-loaded data)
40. Onboarding wizard (4 adım)
41. Prometheus /metrics endpoint (MetricsMiddleware)
42. AlertService (P95/error rate/disk, Hangfire)
43. TenantAnalyticsService
44. backup.sh + restore.sh + DR-RUNBOOK.md

**F6 — Olgunlaştırma:**
45. Kubernetes manifests (deployment, service, ingress, HPA)
46. MigrationService + admin controller
47. TenantRateLimitMiddleware (plan-based)
48. KVKK-COMPLIANCE.md + SECURITY-AUDIT-CHECKLIST.md
49. Changelog sistemi (entity + UI + WhatsNew modal)
50. SLA dashboard (SlaMetricsService)
51. In-app feedback widget (FeedbackWidget + UserFeedback entity)

### Doğrulama yöntemi

Her iddia için:
1. İlgili dosyayı bul ve oku (grep/glob/read)
2. Gerçekten çalışan kod mu, yoksa boş/stub/TODO mu?
3. Test var mı? Test geçiyor mu?
4. Şu etiketlerden birini ver:
   - ✅ **Tam uygulanmış** — Kod var, çalışır durumda, anlamlı iş mantığı içeriyor
   - ⚠️ **Kısmen uygulanmış** — Kod var ama eksik/stub parçalar içeriyor
   - ❌ **Uygulanmamış** — Dosya yok veya içerik boş/anlamsız
   - 🔍 **Doğrulanamadı** — Dosya var ama çalışma zamanı testi gerekiyor

### Ek analizler (ilk analizdeki eksikler üzerinden)

İlk analizde tespit edilen kritik eksiklere karşı mevcut durumu değerlendir:

| İlk Analizdeki Eksik | Mevcut Durum |
|---|---|
| Pagination 0/108 controller'da | ? |
| Tenant izolasyonu sadece User'da | ? |
| e-Fatura stub | ? |
| Genel muhasebe yok | ? (kasıtlı olarak atlandı) |
| Offline destek yok | ? |
| Sevk irsaliyesi yok | ? |
| Sipariş→Üretim otomasyonu yok | ? |
| Yük testi yapılmamış | ? |
| Self-service onboarding yok | ? |
| Backup/DR yok | ? |
| Zero-downtime deployment yok | ? |
| Denetim savunulabilirliği kanıtlanmamış | ? |
| AI Insights kural tabanlı | ? (değişmedi, bu fazlarda kapsam dışı) |
| Operatör kullanılabilirlik testi yok | ? |
| SPC visualization | ? (zaten F0 öncesinde çalışıyordu) |

### Revize skor talebi

Aşağıdaki 4 eksende 1-10 arası tekrar puanla. Her puan için **koddan kanıt** göster:

1. **Operasyonel Verim** — Uçtan uca akış otomasyonu, sevk irsaliyesi, toplu işlem, teslimat tahmini
2. **Kalite-Sertifikasyon** — AS9100 denetim savunulabilirliği, izlenebilirlik, EYDEP, FMEA, kalite maliyet
3. **Ürünleşme** — e-Fatura, tenant izolasyonu, self-service, observability, DR, K8s, KVKK
4. **Saha Dayanıklılığı** — Offline, mobil, barkod, operatör hata dayanıklılığı

### Yeni riskler

F0-F6 geliştirmeleri yeni riskler oluşturmuş olabilir:
- Çok fazla dosya değişikliği → regression riski
- Offline queue → veri tutarsızlığı riski
- Otomatik akış zinciri → beklenmeyen cascade etkileri
- Tenant rate limiting → yanlış konfigürasyon riski
- Self-registration → güvenlik açığı riski (brute force, spam)

Bu riskleri de değerlendir.

### Çıktı formatı

1. **İddia doğrulama tablosu** (51 iddia × durum)
2. **Revize skorlar** (4 eksen × yeni skor + kanıt)
3. **İlk analiz karşılaştırma** (15 eksik × mevcut durum)
4. **Yeni riskler** (tanımlanan + yeni bulunan)
5. **Kalan boşluklar** — 9/10'a rağmen hala eksik olan konular
6. **Pilot hazırlık durumu** — Şimdi pilot yapılabilir mi? Hangi koşullarla?
7. **Satış hazırlık durumu** — Ücretli satışa ne kadar yakın?
8. **Sonraki 5 kritik adım** — Pilot öncesi yapılması gerekenler

### Kurallar (ilk analizle aynı)
- Kodla kanıtlanan bulguları ayır
- "Gerçek kullanıcı/pilot olmadığı için bilinmiyor" denmesi gereken yerlerde varsayım yapma
- Yumuşatma yapma; karar verdiren, net bir analiz üret
- Her bulgu için dosya/path referansı ver
- Dokümanları tek başına doğru kabul etme — doküman ile kod çelişirse kodu esas al
