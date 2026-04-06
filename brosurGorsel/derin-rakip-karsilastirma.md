# QUVEX vs MRPeasy vs Odoo vs ERPNext
## Derin Karsilastirma Analizi — 2026-03-15

---

# 1. GENEL BAKIS

| Kriter | QUVEX | MRPeasy | Odoo | ERPNext |
|--------|-------|---------|------|---------|
| **Lisans** | Tek lisans | Tier bazli ($49-149/kul) | Modul bazli ($31-47/kul) | Acik kaynak (ucretsiz) |
| **Teknoloji** | .NET 8 + React 18 | Cloud SaaS | Python + JS (OWL) | Python (Frappe) |
| **DB** | PostgreSQL | Cloud (gizli) | PostgreSQL | MariaDB |
| **Hedef** | KOBİ uretim + AS9100 | KOBİ uretim (max 200) | Her olcek, her sektor | KOBİ genel amacli |
| **Deployment** | On-premise + Docker | Sadece Cloud | Cloud + On-premise | Cloud + On-premise |
| **Mobil App** | Responsive web | Native iOS/Android | Native iOS/Android | Native iOS/Android |
| **Dil** | Turkce | 20+ dil | 40+ dil | 20+ dil |
| **API** | 665 endpoint | Sinirli API | Kapsamli API | Kapsamli API |
| **Test** | 1.781 test | Bilinmiyor | Bilinmiyor | Bilinmiyor |

---

# 2. MODUL BAZLI DETAYLI KARSILASTIRMA

## 2.1 URETIM

| Ozellik | QUVEX | MRPeasy | Odoo | ERPNext |
|---------|:-----:|:-------:|:----:|:-------:|
| Is emri yonetimi | ✅ | ✅ | ✅ | ✅ |
| Cok asamali is emri sablonu | ✅ | ✅ | ✅ | ✅ |
| Gantt planlama | ✅ | ❌ | ✅ (PLM) | ❌ |
| Kapasite planlama | ✅ | ✅ | ✅ (MRP Scheduler) | ⚠️ Sinirli |
| Atolye terminali (tablet) | ✅ | ⚠️ Sinirli | ✅ (Shop Floor) | ❌ |
| Barkod tarama (shop floor) | ✅ | ✅ | ✅ | ✅ |
| Fason is emri | ✅ | ✅ | ✅ (Subcontracting) | ✅ |
| BOM patlama (cok seviye) | ✅ | ✅ | ✅ (Kit + nested BOM) | ✅ |
| MRP hesaplama | ✅ | ✅ | ✅ (MRP Scheduler) | ✅ |
| Proje yonetimi | ✅ | ❌ | ✅ (ayri modul) | ✅ |
| **Uretim puani** | **9/10** | **7/10** | **9/10** | **6/10** |

**Quvex avantaji:** Atolye terminali + Gantt + kapasite tek entegre
**Quvex eksigi:** Odoo'nun PLM (Product Lifecycle) derinligi yok

## 2.2 STOK ve DEPO

| Ozellik | QUVEX | MRPeasy | Odoo | ERPNext |
|---------|:-----:|:-------:|:----:|:-------:|
| Coklu depo | ✅ | ✅ | ✅ | ✅ |
| Depo lokasyon yonetimi | ✅ | ❌ | ✅ (Locations) | ⚠️ Sinirli |
| Lot/parti takibi | ✅ | ✅ | ✅ | ✅ |
| Seri numara takibi | ✅ | ✅ | ✅ | ✅ |
| Stok sayim | ✅ | ✅ | ✅ | ✅ |
| ABC analizi | ✅ | ❌ | ⚠️ Eklenti | ❌ |
| Stok degerleme (FIFO/LIFO) | ✅ | ✅ | ✅ | ✅ |
| Min/max uyarilari | ✅ | ✅ | ✅ | ✅ |
| Barkod islemleri | ✅ | ✅ | ✅ (Barcode app) | ✅ |
| Depolar arasi transfer | ✅ | ✅ | ✅ | ✅ |
| Genealoji (izlenebilirlik) | ✅ | ⚠️ Sinirli | ✅ | ✅ |
| **Stok puani** | **10/10** | **7/10** | **9/10** | **7/10** |

**Quvex avantaji:** ABC analizi + genealoji + lokasyon yonetimi entegre
**Quvex eksigi:** Odoo'da Barcode ayri app olarak daha guclu

## 2.3 KALITE YONETIMI (EN BUYUK FARK)

| Ozellik | QUVEX | MRPeasy | Odoo | ERPNext |
|---------|:-----:|:-------:|:----:|:-------:|
| NCR (Uygunsuzluk) | ✅ | ⚠️ Temel | ✅ (Quality Alert) | ✅ |
| CAPA | ✅ | ❌ | ❌ | ✅ (5-Why, 8D) |
| Giris muayene | ✅ | ✅ | ✅ (Quality Check) | ✅ |
| Kalibrasyon yonetimi | ✅ | ❌ | ❌ | ❌ |
| Risk / FMEA | ✅ | ❌ | ❌ | ❌ |
| SPC (kontrol grafikleri) | ✅ | ❌ | ✅ (temel) | ✅ (X-bar, R, p, c) |
| PPAP (18 element) | ✅ | ❌ | ❌ | ❌ |
| FAI (AS9102) | ✅ | ❌ | ❌ | ❌ |
| CoC belgesi otomatik | ✅ | ❌ | ❌ | ✅ |
| MRB (Malzeme Inceleme) | ✅ | ❌ | ❌ | ❌ |
| Musteri Sapma Onayi | ✅ | ❌ | ❌ | ❌ |
| Kontrol planlari | ✅ | ❌ | ✅ (Quality Points) | ❌ |
| Ic denetim | ✅ | ❌ | ❌ | ✅ (Audit) |
| Tedarikci degerlendirme | ✅ | ❌ | ❌ | ❌ |
| Egitim ve yetkinlik | ✅ | ❌ | ❌ | ✅ (Training) |
| Sahte parca onleme | ✅ | ❌ | ❌ | ❌ |
| FOD onleme | ✅ | ❌ | ❌ | ❌ |
| Konfigurasyon yonetimi | ✅ | ❌ | ❌ | ❌ |
| Oezel suerec yoenetimi | ✅ | ❌ | ❌ | ❌ |
| Ueruen guevenligi | ✅ | ❌ | ❌ | ❌ |
| Tasarim ve gelistirme | ✅ | ❌ | ✅ (PLM/ECO) | ❌ |
| Tedarik zinciri risk | ✅ | ❌ | ❌ | ❌ |
| ECN / revizyon | ✅ | ❌ | ✅ (PLM ECO) | ❌ |
| AS9100 uyumluluk | ✅ FULL | ❌ | ❌ | ⚠️ Kismi |
| **Kalite puani** | **23/23** | **3/23** | **6/23** | **8/23** |

**QUVEX EZICI USTUNLUK:** 23 kalite alt modulu — rakiplerin hicbiri bu derinlige sahip degil.

## 2.4 BAKIM (CMMS)

| Ozellik | QUVEX | MRPeasy | Odoo | ERPNext |
|---------|:-----:|:-------:|:----:|:-------:|
| Koruyucu bakim plani | ✅ | ❌ | ✅ | ✅ |
| Is emri yonetimi | ✅ | ❌ | ✅ | ✅ |
| Ariza kaydi | ✅ | ❌ | ✅ (Corrective) | ✅ |
| OEE dashboard | ✅ | ❌ | ✅ | ❌ |
| MTBF / MTTR | ✅ | ❌ | ✅ | ❌ |
| Kestirimci bakim (AI) | ✅ (Faz 2) | ❌ | ❌ | ⚠️ Yeni |
| **Bakim puani** | **6/6** | **0/6** | **5/6** | **3/6** |

## 2.5 SATIS ve MUSTERI

| Ozellik | QUVEX | MRPeasy | Odoo | ERPNext |
|---------|:-----:|:-------:|:----:|:-------:|
| Teklif hazirlama | ✅ | ✅ | ✅ | ✅ |
| Siparis yonetimi | ✅ | ✅ | ✅ | ✅ |
| CRM (lead/firsat) | ❌ | ✅ | ✅ (cok guclu) | ✅ |
| Musteri portali | ✅ | ✅ (B2B) | ✅ (Website) | ✅ (Website) |
| Cari hesap ekstre | ✅ | ❌ | ✅ | ✅ |
| Sikayet yonetimi | ✅ | ❌ | ✅ (Helpdesk) | ✅ (Support) |
| e-Ticaret | ❌ | ❌ | ✅ (cok guclu) | ✅ |
| **Satis puani** | **5/7** | **4/7** | **7/7** | **7/7** |

**Quvex eksigi:** CRM modulu ve e-ticaret yok

## 2.6 MUHASEBE / FINANS

| Ozellik | QUVEX | MRPeasy | Odoo | ERPNext |
|---------|:-----:|:-------:|:----:|:-------:|
| Satis/alis faturasi | ✅ | ⚠️ Entegrasyon | ✅ | ✅ |
| Iade faturasi | ✅ | ❌ | ✅ | ✅ |
| Odeme takibi | ✅ | ⚠️ Entegrasyon | ✅ | ✅ |
| Banka mutabakat | ✅ | ❌ | ✅ | ✅ |
| e-Fatura (TR GIB) | ✅ | ❌ | ⚠️ Eklenti | ❌ |
| Tevkifat | ✅ | ❌ | ❌ | ❌ |
| Kar-zarar | ✅ | ❌ | ✅ | ✅ |
| Cok para birimi | ❌ | ✅ | ✅ | ✅ |
| Tam muhasebe (genel muhasebe) | ❌ | ❌ | ✅ (cok guclu) | ✅ |
| **Muhasebe puani** | **6/9** | **2/9** | **8/9** | **8/9** |

**Quvex avantaji:** e-Fatura + tevkifat (Turkiye'ye ozel)
**Quvex eksigi:** Genel muhasebe (mizan, kasa, cek/senet) yok, cok para birimi yok

## 2.7 RAPORLAMA ve ANALITIK

| Ozellik | QUVEX | MRPeasy | Odoo | ERPNext |
|---------|:-----:|:-------:|:----:|:-------:|
| Standart raporlar | ✅ (13) | ✅ | ✅ (50+) | ✅ |
| Dinamik rapor builder | ✅ | ❌ | ✅ (Pivot) | ✅ (Query Report) |
| KPI dashboard | ✅ | ✅ | ✅ | ✅ |
| Excel export | ✅ | ✅ | ✅ | ✅ |
| AI tahminleme | ✅ (Faz 1-2) | ❌ | ⚠️ Yeni | ⚠️ Yeni |
| Zamanlanmis rapor (e-posta) | ❌ | ❌ | ✅ | ✅ |
| Dashboard ozellestirme | ❌ | ✅ | ✅ (surukle-birak) | ✅ (widget) |
| **Rapor puani** | **5/7** | **4/7** | **7/7** | **6/7** |

## 2.8 IK ve DOKUMAN

| Ozellik | QUVEX | MRPeasy | Odoo | ERPNext |
|---------|:-----:|:-------:|:----:|:-------:|
| Vardiya yonetimi | ✅ | ✅ | ✅ | ✅ |
| Giris/cikis | ✅ | ❌ | ✅ | ✅ |
| Bordro | ❌ | ❌ | ✅ | ✅ |
| Izin yonetimi | ❌ | ❌ | ✅ | ✅ |
| Dokuman yonetimi | ✅ | ✅ | ✅ (Documents) | ✅ |
| **IK puani** | **3/5** | **2/5** | **5/5** | **5/5** |

## 2.9 ENTEGRASYON ve PLATFORM

| Ozellik | QUVEX | MRPeasy | Odoo | ERPNext |
|---------|:-----:|:-------:|:----:|:-------:|
| REST API | ✅ (665) | ✅ (sinirli) | ✅ (kapsamli) | ✅ (kapsamli) |
| Webhook | ❌ | ❌ | ✅ | ✅ |
| Zapier/Make | ❌ | ✅ | ✅ | ✅ |
| IoT entegrasyonu | ❌ | ❌ | ✅ (IoT Box) | ❌ |
| Mobil app (native) | ❌ | ✅ | ✅ | ✅ |
| Multi-language | ❌ | ✅ (20+) | ✅ (40+) | ✅ (20+) |
| Multi-tenant SaaS | ❌ | ✅ | ✅ | ✅ |
| Plugin marketplace | ❌ | ❌ | ✅ (40K+ app) | ✅ (Frappe Cloud) |
| Onboarding wizard | ❌ | ✅ | ✅ | ✅ |
| **Platform puani** | **2/9** | **5/9** | **8/9** | **7/9** |

---

# 3. TOPLAM PUAN TABLOSU

| Kategori | QUVEX | MRPeasy | Odoo | ERPNext |
|----------|:-----:|:-------:|:----:|:-------:|
| Uretim | 9 | 7 | 9 | 6 |
| Stok | 10 | 7 | 9 | 7 |
| **Kalite** | **23** | **3** | **6** | **8** |
| Bakim | 6 | 0 | 5 | 3 |
| Satis | 5 | 4 | 7 | 7 |
| Muhasebe | 6 | 2 | 8 | 8 |
| Rapor | 5 | 4 | 7 | 6 |
| IK | 3 | 2 | 5 | 5 |
| Platform | 2 | 5 | 8 | 7 |
| **TOPLAM** | **69** | **34** | **64** | **57** |
| **Kalite haric** | **46** | **31** | **58** | **49** |

---

# 4. QUVEX'IN GUCLU YANLARI (TUTULMASI GEREKEN)

1. **Kalite derinligi benzersiz** — 23 alt modul, hicbir rakipte yok
2. **AS9100 tam uyumluluk** — Savunma/havacilik sektoru icin tek KOBİ cozumu
3. **Tek lisans, ek modul yok** — Fiyat seffafligi
4. **Turkce e-fatura + tevkifat** — Turkiye'ye ozel avantaj
5. **Entegre CMMS + OEE** — Ayri satin almaya gerek yok
6. **AI Insights** — Faz 1 tamamlandi, rakiplerde henuz yok/baslangiç
7. **1.781 test** — Kod kalitesi ve guvenilirlik
8. **6 katman guvenlik** — RBAC, CSRF, CSP, denetim izi

---

# 5. QUVEX'IN KAPANMASI GEREKEN GAPLAR (ONCELIK SIRASINDA)

## P0 — Satis Engelleyici (olmadan satmak cok zor)

| # | Gap | MRPeasy | Odoo | ERPNext | Efor |
|---|-----|---------|------|---------|------|
| 1 | **Mobil app (native)** | ✅ Var | ✅ Var | ✅ Var | 8-12 hafta |
| 2 | **Multi-language (en az EN)** | ✅ 20 dil | ✅ 40 dil | ✅ 20 dil | 4-6 hafta |
| 3 | **Online demo/trial** | ✅ 30 gun | ✅ Online | ✅ demo.erpnext.com | 2-3 hafta |
| 4 | **Cloud SaaS (multi-tenant)** | ✅ Sadece cloud | ✅ Var | ✅ Frappe Cloud | 8-12 hafta |

## P1 — Rekabet Dezavantaji (rakipte var, bizde yok)

| # | Gap | Nerede var | Efor |
|---|-----|-----------|------|
| 5 | **CRM modulu** | MRPeasy, Odoo, ERPNext | 4-6 hafta |
| 6 | **Dashboard ozellestirme** | Odoo (surukle-birak), ERPNext (widget) | 3-4 hafta |
| 7 | **Webhook/event sistemi** | Odoo, ERPNext | 2-3 hafta |
| 8 | **Onboarding wizard** | MRPeasy, Odoo, ERPNext | 2-3 hafta |
| 9 | **Zamanlanmis rapor (e-posta)** | Odoo, ERPNext | 1-2 hafta |

## P2 — Gelecek Donem

| # | Gap | Nerede var | Efor |
|---|-----|-----------|------|
| 10 | **IoT entegrasyonu** | Odoo (IoT Box) | 6-8 hafta |
| 11 | **Tam muhasebe (mizan/kasa)** | Odoo, ERPNext | 8-12 hafta |
| 12 | **PLM (Product Lifecycle)** | Odoo PLM | 6-8 hafta |
| 13 | **Bordro / izin yonetimi** | Odoo, ERPNext | 4-6 hafta |
| 14 | **e-Ticaret** | Odoo, ERPNext | 8-12 hafta |
| 15 | **Plugin marketplace** | Odoo (40K+ app) | Uzun vadeli |

---

# 6. REKABET STRATEJISI ONERISI

## Quvex'in Pozisyonlamasi

```
"Kalite odakli uretim ERP'si — AS9100 tam uyumlu,
savunma/havacilik/otomotiv tedarikci firmalari icin
tek KOBİ cozumu"
```

## Rakiplere Karsi Satis Mesajlari

### vs MRPeasy
> "MRPeasy kalite modulu sunmuyor — NCR, CAPA, SPC, PPAP, FAI, kalibrasyon yok.
> Savunma/otomotiv sektorunde MRPeasy kullanilamaz. Quvex 23 kalite alt modulu,
> entegre CMMS ve OEE ile cok daha kapsamli."

### vs Odoo
> "Odoo guclue bir platformdur ama uretim kalite yonetiminde sinirlidir.
> PPAP, FAI, MRB, FMEA, kalibrasyon, sahte parca onleme gibi ozellikler yoktur.
> Ayrica Odoo'da her modul ayri fiyatlandirilir ve kurulum 80K-150K TL'ye ulasabilir.
> Quvex tek lisansla tum ozellikleri sunar."

### vs ERPNext
> "ERPNext acik kaynak ve uygun fiyatlidir ancak uretim derinligi sinirlidir.
> Gantt planlama, atolye terminali, OEE dashboard, kestirimci bakim yoktur.
> Destek topluluk bazlidir, kurumsal SLA yoktur. Quvex profesyonel destek
> ve 1.781 otomatik testle guvenilir bir cozumdur."

---

# 7. KAYNAK ve REFERANSLAR

- [MRPeasy Features 2026 (GetApp)](https://www.getapp.com/operations-management-software/a/mrpeasy/)
- [MRPeasy Quality Management](https://www.mrpeasy.com/quality-management-software/)
- [MRPeasy Review (CFO Club)](https://thecfoclub.com/tools/mrpeasy-review/)
- [Odoo Manufacturing Features](https://www.odoo.com/app/manufacturing-features)
- [Odoo Pricing](https://www.odoo.com/pricing)
- [Odoo Review 2026 (Clinked)](https://www.clinked.com/blog/odoo-review)
- [Odoo Advantages & Disadvantages](https://onestopodoo.com/blogs/odoo-erp-advantages-and-disadvantages/)
- [Odoo Implementation Cost](https://www.appverticals.com/blog/odoo-implementation-cost/)
- [ERPNext Quality Management (ERP Research)](https://www.erpresearch.com/erp/erpnext/quality-management)
- [ERPNext Review 2026 (CFO Club)](https://thecfoclub.com/tools/erpnext-review/)
- [ERPNext Deep Dive 2026](https://devdiligent.com/blog/erpnext-deep-dive/)
- [ERPNext Modules (CraftInteractive)](https://craftinteractive.io/erpnext-modules/)
