# Quvex E2E Baseline Metodolojisi

**Oluşturuldu:** 2026-04-14 (Sprint 13 baseline ile birlikte)
**Amaç:** Her sprint bitiminde canlı API'de regression testi çalıştırmak için standart prosedür.

## Ne Zaman Baseline Alınır?

1. **Her sprint kapanışından hemen önce** (deploy öncesi, aynı gün)
2. **Her sprint deploy'undan hemen sonra** (before/after karşılaştırma)
3. **Hotfix deploy'larından önce ve sonra** (kritik değişikliklerde)
4. **Major dependency upgrade** (EF Core, .NET, React major) sonrası

## Hangi Scriptler Koşulur?

Standart 3 senaryo (v2 — parametrize edilmiş):

| Script | Konum | Senaryo | Endpoint | Süre |
|---|---|---|---|---|
| `cnc_e2e_v2.py` | `Temp/e2e_baseline/` | CNC talaşlı imalat + AS9100 | ~74 | ~2 dk |
| `financial_e2e_v2.py` | `Temp/e2e_baseline/` | 13 finansal modül | ~79 | ~2 dk |
| `altay_e2e_v2.py` | `Temp/e2e_baseline/` | Savunma, 3 tur üretim | ~127 | ~4 dk |

**Gelecek genişlemeler:** Her yeni sektör (Medikal, Gıda, Tekstil, Mobilya, Plastik, Metal) için aynı şablonla `*_e2e_v2.py` script'i türetilebilir.

## Tenant İsimlendirme Kuralı

```
{Senaryo} Baseline Demo {unix_timestamp}
```

Örnek:
- `CNC Baseline Demo 1776122070`
- `Finansal Baseline Demo 1776122070`
- `ALTAY Baseline Demo 1776122070`

Email şablonu:
```
admin@{senaryo-slug}-baseline-{timestamp}.demo
```

Şifre şablonu: `{Senaryo}Base123!@#$%` (12+ karakter, Identity policy uyumlu)

## Çalıştırma Kuralları

### CRITICAL: Scriptleri SIRALI Çalıştır

3 script paralel çalıştırıldığında **HTTP 429 rate-limit** tetiklenir ve %30-50 false-negative oluşturur. Her zaman sıralı çalıştır:

```bash
cd C:/Users/Hakan/AppData/Local/Temp/e2e_baseline
TS=$(date +%s)

# 1. CNC
python cnc_e2e_v2.py --register \
  --company-name "CNC Baseline Demo $TS" \
  --admin-email "admin@cnc-baseline-$TS.demo" \
  --password 'CncBase123!@#$%' \
  --sector general \
  --output "cnc_baseline_$TS.json"

sleep 30  # Rate limit soğuma

# 2. Finansal
python financial_e2e_v2.py --register \
  --company-name "Finansal Baseline Demo $TS" \
  --admin-email "admin@finansal-baseline-$TS.demo" \
  --password 'FinBase123!@#$%' \
  --sector general \
  --output "financial_baseline_$TS.json"

sleep 30

# 3. ALTAY
python altay_e2e_v2.py \
  --company-name "ALTAY Baseline Demo $TS" \
  --admin-email "admin@altay-baseline-$TS.demo" \
  --password 'AltayBase123!@#$%' \
  --sector defense \
  --output "altay_baseline_$TS.json"

# 4. Aggregate
python _aggregate.py
```

### Rate Limiting

- Her çağrı arasında script içinde **200ms** delay var (Runner default).
- Senaryolar arasında **30 sn** bekle (rate limiter bucket'ını boşaltır).
- `HTTP 429` karşılaşılırsa → senaryo bittiğinde sayıları not et; gerçek fail değil.

## Sonuç Karşılaştırma Kriterleri

### Başarı Metrikleri

| Metrik | Hedef |
|---|---|
| **Toplam pass oranı** (429 hariç) | >%95 |
| **Kritik modül pass oranı** (Customer, Product, Sales, Invoice, Payment, Production) | %100 |
| **Regression sıfır** (before'da geçen, after'da fail) | 0 endpoint |
| **Yeni fail** | İki kategori: "beklenen" (sprint değişimi) + "regression" (bug) |

### Green / Yellow / Red Eşikleri

| Renk | Pass % | Yeni Regression | Aksiyon |
|---|---|---|---|
| 🟢 Yeşil | ≥95% | 0 | Deploy onaylı |
| 🟡 Sarı | 85-95% | 1-3 | Fix hızla, hotfix'e hazır ol |
| 🔴 Kırmızı | <85% | ≥4 veya P0/P1 | Deploy rollback düşün |

### Before/After Diff Tablosu Şablonu

```markdown
| Senaryo | Önce % | Sonra % | Δ | Yeni Pass | Yeni Fail | Regression |
|---|---|---|---|---|---|---|
| CNC | 79.7 | - | - | - | - | - |
| Finansal | 58.2 | - | - | - | - | - |
| ALTAY | 32.3 | - | - | - | - | - |
```

## Bilinen False-Negative'ler (429 dışı)

Bu fail'ler her zaman "beklenen" kabul edilebilir ve rapora "BİLİNEN" olarak etiketlenir:

| Endpoint | Status | Sebep |
|---|---|---|
| `POST /Onboarding/sample-data` | 400 ("zaten veri var") | Idempotent değil, ilk çağrıdan sonra başarısız |
| `POST /FinalInspectionRelease` | 400 (InspectedById) | Test script payload eksikliği, AS9100 validasyonu doğru |

## Regression Test Tetiği (CI/CD'de Nasıl Çalıştırılır)

### GitHub Actions Şablonu (önerilen)

```yaml
# .github/workflows/e2e-baseline.yml
name: E2E Baseline Regression

on:
  workflow_dispatch:
  schedule:
    - cron: '0 2 * * 1'  # Her Pazartesi 02:00 UTC
  push:
    branches: [ master ]
    paths:
      - 'smallFactoryApi/src/**'

jobs:
  baseline:
    runs-on: windows-latest
    env:
      QUVEX_API_BASE: https://api.quvex.io
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: '3.10' }
      - name: Copy e2e scripts
        run: cp -r .claude/e2e_baseline/* $TEMP/
      - name: Run CNC baseline
        run: python cnc_e2e_v2.py --register ... --output cnc.json
      - name: Sleep 30s
        run: sleep 30
      - name: Run Financial baseline
        run: python financial_e2e_v2.py --register ... --output fin.json
      - run: sleep 30
      - name: Run ALTAY baseline
        run: python altay_e2e_v2.py ... --output altay.json
      - name: Aggregate
        run: python _aggregate.py
      - uses: actions/upload-artifact@v4
        with:
          name: e2e-baseline-results
          path: '*.json'
      - name: Compare with previous baseline
        run: python compare_baselines.py previous.json current.json
```

### Manuel Regression Çalıştırma (sprint sonu)

```bash
# 1. Önceki baseline'ı al
cp _aggregate.json _aggregate_before.json

# 2. Deploy yap
# ...

# 3. Yeni baseline al (sıralı 3 script)
python run_all.sh

# 4. Karşılaştır
python compare.py _aggregate_before.json _aggregate.json
```

## Tenant Temizliği

Baseline tenant'ları **silme**: tenant'lar demo DB'de kalır, repo'yu kirletmez ama:
- Eğer tenant sayısı 50'yi aşarsa → Admin panelden `SuperAdmin` rolü ile sil
- Her ayın 1'inde `*-baseline-*.demo` email pattern'iyle batch temizlik scripti çalıştırılabilir

## Script Bakımı

Yeni endpoint'ler eklendiğinde:

1. **Read probe'lara ekle** — `cnc_e2e_v2.py` sonundaki `probes` list'i
2. **Module tag'i ver** — Breakdown raporunda gözükmesi için
3. **Test payload yaz** — Gerekirse yeni bir `section()` bloğu

Controller silindiğinde:

1. Script'teki endpoint'i **kaldırma** — 404 geri dönecek ve "regression detected" sinyali oluşturacak
2. Eğer silme bilinçliyse, endpoint'i "known failures" listesine ekle

## İlgili Dokümanlar

- [E2E-BASELINE-2026-04-14.md](test-result/E2E-BASELINE-2026-04-14.md) — Sprint 13 öncesi ilk baseline
- [TEST-PLAN-E2E-v4.md](TEST-PLAN-E2E-v4.md)
- [TEST-CHECKLIST-E2E.md](TEST-CHECKLIST-E2E.md)
- [ALTAY-YAZILIM-E2E-PLAN.md](ALTAY-YAZILIM-E2E-PLAN.md)

---

**Bakım:** Bu metodoloji her sprint sonunda güncellenmelidir. Yeni senaryo eklendiğinde bu dokümana script eklenmelidir.
