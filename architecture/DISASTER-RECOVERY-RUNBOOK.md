# Quvex ERP - Felaket Kurtarma Runbook'u

**Versiyon:** 1.0
**Son Guncelleme:** 2026-04-10
**Sorumlu:** DevOps Ekibi
**Durum:** Aktif

---

## Icerik

1. [Tanimlar ve Hedefler](#1-tanimlar-ve-hedefler)
2. [Yedekleme Stratejisi](#2-yedekleme-stratejisi)
3. [Senaryo 1: Database Cokmesi](#3-senaryo-1-database-cokmesi)
4. [Senaryo 2: Veri Kaybi / Bozulma](#4-senaryo-2-veri-kaybi--bozulma)
5. [Senaryo 3: Tum Sistem Cokmesi](#5-senaryo-3-tum-sistem-cokmesi)
6. [Senaryo 4: Tenant Veri Izolasyon Ihlali](#6-senaryo-4-tenant-veri-izolasyon-ihlali)
7. [Iletisim Plani](#7-iletisim-plani)
8. [Test Plani](#8-test-plani)
9. [Kontrol Listeleri](#9-kontrol-listeleri)

---

## 1. Tanimlar ve Hedefler

### 1.1 Temel Metrikler

| Metrik | Hedef | Aciklama |
|--------|-------|----------|
| **RPO** (Recovery Point Objective) | < 1 saat | Kabul edilebilir maksimum veri kaybi suresi |
| **RTO** (Recovery Time Objective) | < 15 dakika | Sistemin yeniden calismaya baslamasi icin maksimum sure |
| **SLA** (Service Level Agreement) | %99 | Yillik minimum calisma suresi garantisi |

### 1.2 Kritiklik Seviyeleri

| Seviye | Tanim | Ornek | Mudahale Suresi |
|--------|-------|-------|-----------------|
| **P0 - Kritik** | Tum sistem erisimde degil | DB tamamen coktu | Aninda (7/24) |
| **P1 - Yuksek** | Ana islevler calismiyot | Uretim kayit yapilmiyor | < 15 dk |
| **P2 - Orta** | Kismen calisiyor | Raporlama yavas | < 1 saat |
| **P3 - Dusuk** | Kozmetik sorunlar | Dashboard guncellenmede gecikme | < 4 saat |

### 1.3 Sorumluluk Matrisi (RACI)

| Gorev | DevOps | Backend | Frontend | Yonetim |
|-------|--------|---------|----------|---------|
| DB Restore | **R/A** | C | I | I |
| Sistem Yeniden Deploy | **R/A** | C | C | I |
| Tenant Izolasyon Ihlali | R | **R/A** | C | I |
| Musteri Bildirimi | I | I | I | **R/A** |

> R=Responsible, A=Accountable, C=Consulted, I=Informed

---

## 2. Yedekleme Stratejisi

### 2.1 Yedekleme Katmanlari

```
Katman 1: WAL Archival (Surekli)
  - PostgreSQL WAL (Write-Ahead Log) dosyalari surekli arsivlenir
  - PITR (Point-in-Time Recovery) imkani saglar
  - RPO: Son commit'e kadar (saniyeler)

Katman 2: Gunluk Full Backup (Her gun 03:00)
  - pg_dump --format=custom --compress=9
  - Tum schema'lar (public + tenant_*) dahil
  - Retention: 7 gun

Katman 3: Haftalik Full Backup (Her Pazartesi 04:00)
  - Ayni formatta tam yedek
  - Retention: 4 hafta (28 gun)

Katman 4: Aylik Full Backup (Her ayin 1'i 05:00)
  - Uzun sureli arsiv yedegi
  - Retention: 12 ay
```

### 2.2 Yedekleme Zamanlama (Cron)

```cron
# Gunluk yedek - her gun saat 03:00
0 3 * * * /app/scripts/backup.sh daily >> /var/log/quvex-backup.log 2>&1

# Haftalik yedek - Pazartesi 04:00
0 4 * * 1 /app/scripts/backup.sh weekly >> /var/log/quvex-backup.log 2>&1

# Aylik yedek - Ayin 1'i 05:00
0 5 1 * * /app/scripts/backup.sh monthly >> /var/log/quvex-backup.log 2>&1
```

### 2.3 WAL Archival Yapilandirmasi

`postgresql.conf` icinde asagidaki ayarlar yapilmalidir:

```ini
# WAL Archival
wal_level = replica
archive_mode = on
archive_command = 'cp %p /wal_archive/%f'
archive_timeout = 300

# Replication
max_wal_senders = 3
wal_keep_size = 1GB
```

### 2.4 Yedek Depolama Konumlari

| Konum | Tip | Aciklama |
|-------|-----|----------|
| `/backups/daily/` | Yerel disk | Hizli erisim icin |
| `/backups/weekly/` | Yerel disk | Haftalik arsiv |
| `/backups/monthly/` | Yerel disk + S3 | Uzun sureli saklama |
| `/wal_archive/` | Yerel disk | WAL dosyalari (PITR icin) |
| `s3://quvex-backups/` | Remote | Felaket kurtarma icin offsite kopya |

### 2.5 Tenant Bazli Yedekleme

Quvex schema-per-tenant mimarisi kullanir. Her tenant'in schema'si ayri ayri yedeklenir:

```bash
# Tenant schema listesi
psql -t -c "SELECT schema_name FROM information_schema.schemata WHERE schema_name LIKE 'tenant_%'"

# Tek tenant restore (diger tenant'lari etkilemez)
pg_restore -h localhost -U postgres -d quvex_dev \
  --schema=tenant_acme \
  --clean --if-exists \
  /backups/daily/tenant_acme_daily_20260410.dump
```

---

## 3. Senaryo 1: Database Cokmesi

### 3.1 Belirtiler
- Uygulama `500 Internal Server Error` donuyor
- `/health` endpoint'i `unhealthy` raporluyor
- PostgreSQL container dusmus veya yanit vermiyor
- Baglanti havuzu dolmus (`connection pool exhausted`)

### 3.2 Teshis

```bash
# 1. PostgreSQL container durumunu kontrol et
docker ps -a | grep postgres

# 2. Container loglarini incele
docker logs smallfactory-postgres --tail 100

# 3. PostgreSQL baglantilarini kontrol et
psql -h localhost -U postgres -c "SELECT count(*) FROM pg_stat_activity"

# 4. Disk alani kontrol et
df -h /var/lib/postgresql/data
```

### 3.3 Kurtarma Adimlari

#### Adim 1: Replica'yi Primary Olarak Promote Et

```bash
# Replica sunucusunda calistir
# 1. Replica durumunu dogrula
psql -h replica-host -U postgres -c "SELECT pg_is_in_recovery()"
# Sonuc: true olmali

# 2. Replica'yi promote et
pg_ctl promote -D /var/lib/postgresql/data
# veya Docker icinde:
docker exec quvex-replica pg_ctl promote -D /var/lib/postgresql/data

# 3. Promotion'i dogrula
psql -h replica-host -U postgres -c "SELECT pg_is_in_recovery()"
# Sonuc: false olmali (artik primary)
```

#### Adim 2: Uygulama Connection String Guncelle

```bash
# Docker Compose ortaminda environment degiskeni guncelle
# docker-compose.yml veya .env dosyasinda:
# DB_HOST=replica-host

# Kubernetes ortaminda:
kubectl set env deployment/quvex-api DB_HOST=replica-host

# Uygulamayi yeniden baslat
docker-compose restart quvex-api
# veya
kubectl rollout restart deployment/quvex-api
```

#### Adim 3: Yeni Replica Olustur

```bash
# 1. Eski primary'yi temizle (gerekirse)
docker stop smallfactory-postgres
docker rm smallfactory-postgres

# 2. Yeni replica icin base backup al
pg_basebackup -h new-primary-host -U replicator -D /var/lib/postgresql/data \
  --checkpoint=fast --wal-method=stream -R

# 3. Yeni replica'yi baslat
docker-compose up -d quvex-replica
```

#### Adim 4: Dogrulama

```bash
# 1. Health endpoint kontrolu
curl -s http://localhost:5052/health | jq .

# 2. Veritabani baglanti testi
psql -h new-primary -U postgres -d quvex_dev -c "SELECT 1"

# 3. Tenant schema'larinin erisilebildigini dogrula
psql -h new-primary -U postgres -d quvex_dev -c \
  "SELECT schema_name FROM information_schema.schemata WHERE schema_name LIKE 'tenant_%'"

# 4. Uygulama loglarini kontrol et
docker logs quvex-api --tail 50 --since 5m
```

### 3.4 Kontrol Listesi

- [ ] PostgreSQL container durumu kontrol edildi
- [ ] Container loglari incelendi
- [ ] Disk alani yeterli
- [ ] Replica promote edildi
- [ ] Connection string guncellendi
- [ ] Uygulama yeniden baslatildi
- [ ] Health check basarili
- [ ] Yeni replica olusturuldu
- [ ] Tum tenant'lar erisilebilir durumda
- [ ] Monitoring alarmlari normal seviyeye dondu

---

## 4. Senaryo 2: Veri Kaybi / Bozulma

### 4.1 Belirtiler
- Kullanicilar eksik veya hatali veri raporluyor
- Veritabani tutarsizlik hatalari
- Yanlis DELETE/UPDATE sorgusu calistirilmis
- Schema bozulmasi

### 4.2 Teshis

```bash
# 1. Son yapilan degisiklikleri kontrol et
psql -h localhost -U postgres -d quvex_dev -c \
  "SELECT usename, query, query_start FROM pg_stat_activity WHERE state = 'active'"

# 2. Audit log incele
psql -h localhost -U postgres -d quvex_dev -c \
  "SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 50"

# 3. Tablo butunlugunu kontrol et
psql -h localhost -U postgres -d quvex_dev -c \
  "SELECT schemaname, tablename FROM pg_tables WHERE schemaname NOT IN ('pg_catalog', 'information_schema')"
```

### 4.3 Kurtarma Secenekleri

#### Secenek A: Son Yedekten Restore (pg_restore)

```bash
# 1. Mevcut veritabaninin yeregini al (guvenlik icin)
PGPASSWORD="${DB_PASSWORD}" pg_dump \
  -h localhost -U postgres -d quvex_dev \
  --format=custom --compress=9 \
  --file="/backups/emergency/quvex_dev_pre_restore_$(date +%Y%m%d_%H%M%S).dump"

# 2. En son basarili yedegi bul
ls -lt /backups/daily/*.dump | head -5

# 3. Uygulamayi bakim moduna al
# Redis'te bakim flagi set et
redis-cli SET quvex:maintenance "true"

# 4. Aktif baglantilari kapat
psql -h localhost -U postgres -c \
  "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname='quvex_dev' AND pid <> pg_backend_pid()"

# 5. Veritabanini sil ve yeniden olustur
psql -h localhost -U postgres -c "DROP DATABASE IF EXISTS quvex_dev"
psql -h localhost -U postgres -c "CREATE DATABASE quvex_dev OWNER postgres"

# 6. Yedekten geri yukle
pg_restore -h localhost -U postgres -d quvex_dev \
  --verbose --clean --if-exists \
  /backups/daily/quvex_dev_daily_YYYYMMDD_HHMMSS.dump

# 7. Bakim modunu kapat
redis-cli DEL quvex:maintenance

# 8. Uygulamayi yeniden baslat
docker-compose restart quvex-api
```

#### Secenek B: PITR ile Belirli Zamana Geri Don

WAL archival aktifse, herhangi bir zaman noktasina geri donebilirsiniz:

```bash
# 1. PostgreSQL'i durdur
docker stop smallfactory-postgres

# 2. Mevcut data dizinini yedekle
cp -r /var/lib/postgresql/data /var/lib/postgresql/data.broken

# 3. Son base backup'i geri yukle
pg_basebackup -h backup-host -U replicator -D /var/lib/postgresql/data.new \
  --checkpoint=fast

# 4. recovery.signal dosyasi olustur
touch /var/lib/postgresql/data.new/recovery.signal

# 5. postgresql.conf'a PITR hedefini ekle
cat >> /var/lib/postgresql/data.new/postgresql.conf << EOF
restore_command = 'cp /wal_archive/%f %p'
recovery_target_time = '2026-04-10 14:30:00+03'
recovery_target_action = 'promote'
EOF

# 6. Data dizinini degistir ve baslat
mv /var/lib/postgresql/data /var/lib/postgresql/data.old
mv /var/lib/postgresql/data.new /var/lib/postgresql/data
docker start smallfactory-postgres

# 7. Recovery tamamlandigini dogrula
psql -h localhost -U postgres -c "SELECT pg_is_in_recovery()"
# false donmeli
```

#### Secenek C: Tek Tenant Restore

Sadece bir tenant'in verileri bozulmussa:

```bash
# 1. Sadece ilgili tenant schema'sini geri yukle
pg_restore -h localhost -U postgres -d quvex_dev \
  --schema=tenant_acme \
  --clean --if-exists \
  /backups/daily/tenant_acme_daily_YYYYMMDD_HHMMSS.dump

# 2. Tenant verilerini dogrula
psql -h localhost -U postgres -d quvex_dev -c \
  "SET search_path TO tenant_acme; SELECT count(*) FROM products"
```

### 4.4 Kontrol Listesi

- [ ] Veri kaybi/bozulma kapsamsi belirlendi
- [ ] Mevcut durumun yedegi alindi
- [ ] Uygulama bakim moduna alindi
- [ ] Uygun kurtarma yontemi secildi (A/B/C)
- [ ] Restore islemi tamamlandi
- [ ] Veri butunlugu dogrulandi
- [ ] Bakim modu kapatildi
- [ ] Uygulama yeniden baslatildi
- [ ] Kullanicilar bilgilendirildi

---

## 5. Senaryo 3: Tum Sistem Cokmesi

### 5.1 Belirtiler
- Sunucu tamamen erisilemez
- Docker daemon calismiyot
- Tum servisler (API, DB, Redis, Nginx) dusmus
- Network erisimi yok

### 5.2 On Degerlendirme

```bash
# 1. Sunucuya SSH erisimi var mi?
ssh quvex-server "uptime"

# 2. Docker daemon calisiyor mu?
ssh quvex-server "systemctl status docker"

# 3. Disk dolulugu
ssh quvex-server "df -h"

# 4. Bellek durumu
ssh quvex-server "free -h"
```

### 5.3 Kurtarma Adimlari

#### Adim 1: Docker / K8s Yeniden Deploy

**Docker Compose ortami icin:**

```bash
# 1. Docker daemon'i yeniden baslat (gerekirse)
sudo systemctl restart docker

# 2. Tum containerlari temizle ve yeniden baslat
cd /opt/quvex
docker-compose down --remove-orphans
docker-compose up -d

# 3. Container durumlarini kontrol et
docker-compose ps
```

**Kubernetes ortami icin:**

```bash
# 1. Node durumlarini kontrol et
kubectl get nodes

# 2. Namespace'deki tum kaynaklari kontrol et
kubectl get all -n quvex

# 3. Tum deployment'lari yeniden baslat
kubectl rollout restart deployment -n quvex

# 4. Pod durumlarini takip et
kubectl get pods -n quvex -w
```

#### Adim 2: Veritabani Restore

```bash
# 1. PostgreSQL container'inin hazir oldugunu dogrula
docker exec smallfactory-postgres pg_isready
# veya
kubectl exec -n quvex deploy/postgres -- pg_isready

# 2. Veritabaninin bos oldugunu kontrol et
psql -h localhost -U postgres -c "\l" | grep quvex_dev

# 3. Bossa: Son yedekten restore et
pg_restore -h localhost -U postgres -d quvex_dev \
  --verbose --clean --if-exists \
  /backups/daily/quvex_dev_daily_LATEST.dump

# 4. Migration'lari kontrol et
# EF Core migration durumunu dogrula
dotnet ef database update --project src/Quvex.Infrastructure
```

#### Adim 3: Redis Cache Warm-up

```bash
# 1. Redis'in calistigini dogrula
redis-cli ping
# PONG donmeli

# 2. Eski cache'i temizle
redis-cli FLUSHALL

# 3. Kritik cache verilerini yeniden yukle
# Tenant bilgileri
curl -s http://localhost:5052/api/v1/system/cache-warmup

# 4. Redis baglanti sayisini kontrol et
redis-cli INFO clients | grep connected_clients
```

#### Adim 4: Health Check Dogrulama

```bash
# 1. API health check
curl -sf http://localhost:5052/health | jq .
# Beklenen: {"status":"Healthy","checks":{"database":"Healthy","redis":"Healthy"}}

# 2. Nginx/Reverse proxy kontrolu
curl -sf http://localhost/api/v1/health | jq .

# 3. SignalR hub kontrolu
curl -sf http://localhost:5052/hubs/notification/negotiate -X POST

# 4. Tum tenant'lar icin hizli kontrol
psql -h localhost -U postgres -d quvex_dev -t -c \
  "SELECT schema_name FROM information_schema.schemata WHERE schema_name LIKE 'tenant_%'" | \
while read schema; do
  schema=$(echo "$schema" | xargs)
  if [ -n "$schema" ]; then
    COUNT=$(psql -h localhost -U postgres -d quvex_dev -t -c \
      "SET search_path TO $schema; SELECT count(*) FROM users" 2>/dev/null || echo "HATA")
    echo "  $schema: $COUNT kullanici"
  fi
done

# 5. SSL sertifikasi kontrolu (production)
echo | openssl s_client -connect quvex.com:443 2>/dev/null | openssl x509 -noout -dates
```

### 5.4 Kontrol Listesi

- [ ] Sunucu erisimi saglandi
- [ ] Docker/K8s servisleri ayaga kaldirildi
- [ ] PostgreSQL calisiyor ve erisilebilir
- [ ] Veritabani restore edildi (gerekiyorsa)
- [ ] Migration'lar guncel
- [ ] Redis calisiyor ve cache dolduruldu
- [ ] API health check basarili
- [ ] SignalR hub calisiyor
- [ ] Nginx/Reverse proxy calisiyor
- [ ] SSL sertifikasi gecerli
- [ ] Tum tenant'lar erisilebilir
- [ ] Monitoring sistemi aktif

---

## 6. Senaryo 4: Tenant Veri Izolasyon Ihlali

### 6.1 Tanimlar
- Bir tenant'in verisi baska tenant tarafindan gorulmus/degistirilmis
- HasQueryFilter atlanmis
- Schema-per-tenant izolasyonu kirilmis
- **Bu, savunma sanayi musterileri icin en kritik senaryo olup hukuki sonuclari vardir**

### 6.2 Belirtiler
- Kullanici baska tenant'a ait veri goruntuledigini raporluyor
- Audit log'da beklenmeyen cross-tenant erisim kayitlari
- TenantContext hatali tenant ID donuyor
- API response'unda yanlis tenant verisi

### 6.3 Acil Mudahale

#### Adim 1: Etkilenen Tenant'i Izole Et

```bash
# 1. Etkilenen tenant'lari belirle
AFFECTED_TENANT="tenant_acme"
UNAUTHORIZED_TENANT="tenant_defense_corp"

# 2. Etkilenen tenant'larin API erisimini gecici olarak kapat
# Redis'te tenant bazli engelleme
redis-cli SET "quvex:tenant:${AFFECTED_TENANT}:blocked" "true" EX 3600
redis-cli SET "quvex:tenant:${UNAUTHORIZED_TENANT}:blocked" "true" EX 3600

# 3. Aktif oturumlari sonlandir
redis-cli KEYS "quvex:session:${AFFECTED_TENANT}:*" | xargs -r redis-cli DEL
redis-cli KEYS "quvex:session:${UNAUTHORIZED_TENANT}:*" | xargs -r redis-cli DEL

# 4. Uygulamada tenant erisim kontrollerini dogrula
# TenantContext middleware'ini kontrol et
docker logs quvex-api --since 1h | grep -i "tenant" | grep -i "error\|warning\|unauthorized"
```

#### Adim 2: Audit Log Incele

```bash
# 1. Cross-tenant erisim kayitlarini bul
psql -h localhost -U postgres -d quvex_dev -c "
  SELECT
    timestamp,
    user_id,
    tenant_id,
    action,
    resource,
    ip_address,
    details
  FROM audit_logs
  WHERE timestamp > NOW() - INTERVAL '24 hours'
    AND (tenant_id = '${AFFECTED_TENANT}' OR tenant_id = '${UNAUTHORIZED_TENANT}')
  ORDER BY timestamp DESC
  LIMIT 100
"

# 2. HasQueryFilter bypass girisimleri
psql -h localhost -U postgres -d quvex_dev -c "
  SELECT *
  FROM security_incidents
  WHERE incident_type = 'TENANT_ISOLATION_BREACH'
  ORDER BY created_at DESC
  LIMIT 20
"

# 3. Hangi endpoint'lerden erisim yapildigini belirle
docker logs quvex-api --since 24h | grep "X-Tenant-Id" | sort | uniq -c | sort -rn | head 20
```

#### Adim 3: Gerekirse Rollback

```bash
# 1. Etkilenen tenant'in son iyi bilinen yedegini belirle
ls -lt /backups/daily/tenant_${AFFECTED_TENANT}_*.dump | head -5

# 2. Sadece etkilenen tenant schema'sini geri yukle
pg_restore -h localhost -U postgres -d quvex_dev \
  --schema="${AFFECTED_TENANT}" \
  --clean --if-exists \
  /backups/daily/${AFFECTED_TENANT}_daily_YYYYMMDD.dump

# 3. Veri butunlugunu dogrula
psql -h localhost -U postgres -d quvex_dev -c "
  SET search_path TO ${AFFECTED_TENANT};
  SELECT 'products' AS tablo, count(*) AS kayit FROM products
  UNION ALL
  SELECT 'orders', count(*) FROM orders
  UNION ALL
  SELECT 'users', count(*) FROM users
"

# 4. Tenant erisimini yeniden ac
redis-cli DEL "quvex:tenant:${AFFECTED_TENANT}:blocked"
redis-cli DEL "quvex:tenant:${UNAUTHORIZED_TENANT}:blocked"
```

### 6.4 Kok Neden Analizi

Izolasyon ihlali genellikle su nedenlerden kaynaklanir:

1. **HasQueryFilter eksikligi:** Yeni eklenen entity'de `HasQueryFilter` tanimlanmamis
2. **Raw SQL kullanimi:** `FromSqlRaw` ile yazilan sorgularda tenant filtresi atlanmis
3. **TenantContext hatasi:** Middleware'de tenant ID dogru set edilmemis
4. **SignalR cross-tenant:** Bildirimler yanlis tenant grubuna gonderilmis
5. **Cache poisoning:** Redis'te tenant bazli key izolasyonu saglanmamis

### 6.5 Kontrol Listesi

- [ ] Etkilenen tenant'lar belirlendi
- [ ] Tenant erisimi gecici olarak engellendi
- [ ] Aktif oturumlar sonlandirildi
- [ ] Audit log'lar incelendi
- [ ] Ihlalin kapsami belirlendi
- [ ] Kok neden analizi yapildi
- [ ] Gerekli rollback tamamlandi
- [ ] Veri butunlugu dogrulandi
- [ ] Guvenlik yamasi uygulandl
- [ ] Tenant erisimi yeniden acildi
- [ ] Etkilenen tenant'lara bilgi verildi
- [ ] Olay raporu yazildi
- [ ] Savunma sanayi musterisiyse KVKK/ITAR bildirimi yapildi

---

## 7. Iletisim Plani

### 7.1 Eskalasyon Zinciri

```
Seviye 1: Otomatik Alarm (Monitoring)
  -> PagerDuty / Opsgenie alarm olusturur
  -> Nobetci DevOps muhendisine bildirim gider

Seviye 2: DevOps Mudahale (0-15 dk)
  -> Nobetci muhendis sorunu degerlendirip mudahale eder
  -> 15 dk icinde cozulemezse Seviye 3'e eskalasyon

Seviye 3: Ekip Toplantisi (15-30 dk)
  -> Backend + DevOps ekibi devreye girer
  -> War room olusturulur (Slack #incident-response)

Seviye 4: Yonetim Bildirimi (30+ dk)
  -> CTO bilgilendirilir
  -> Musteri iletisimi baslatilir
```

### 7.2 Iletisim Kanallari

| Kanal | Kullanim | Kime |
|-------|----------|------|
| PagerDuty/Opsgenie | Otomatik alarm | Nobetci muhendis |
| Slack #incident-response | Canli koordinasyon | Teknik ekip |
| Slack #general | Durum guncellemesi | Tum sirket |
| E-posta | Musteri bildirimi | Etkilenen musteriler |
| Telefon | Acil eskalasyon | CTO, Is Ortaklari |
| Status page | Kamuya acik durum | Tum kullanicilar |

### 7.3 Bildirim Sablonlari

#### Ilk Bildirim (Dahili)

```
[OLAY] Quvex ERP - {Seviye} Olay Bildirimi
Zaman: {tarih_saat}
Etki: {etkilenen_servisler}
Durum: Inceleniyor
Sorumlu: {nobetci_muhendis}
War Room: #incident-response
```

#### Musteri Bildirimi

```
Sayin Quvex Kullanicisi,

Sistemimizde {tarih} {saat} itibarıyla bir teknik sorun tespit edilmistir.
Etkilenen servisler: {servis_listesi}
Tahmini cozum suresi: {tahmini_sure}

Ekibimiz sorunun giderilmesi icin calisma yapmaktadir.
Guncellemeler icin status.quvex.com adresini takip edebilirsiniz.

Quvex Teknik Ekibi
```

### 7.4 Olay Sonrasi (Post-Mortem)

Her P0/P1 olay sonrasinda 48 saat icinde post-mortem raporu yazilir:

1. **Ozet:** Ne oldu, ne kadar surdu, kac musteri etkilendi
2. **Zaman cizelgesi:** Dakika dakika olaylarin kronolojisi
3. **Kok neden:** 5 Neden (5 Whys) analizi
4. **Etki:** Veri kaybi, hizmet kesintisi suresi, mali etki
5. **Iyilestirme plani:** Tekrarini onlemek icin alinacak aksiyonlar
6. **Sorumlular ve tarihler:** Her aksiyon icin atama

---

## 8. Test Plani

### 8.1 Duzensiz DR Testleri

| Test | Siklik | Sorumlu | Yontem |
|------|--------|---------|--------|
| Yedek dogrulama | Gunluk (otomatik) | CI/CD | pg_restore --list |
| Yedekten restore | Aylik | DevOps | Test ortamina restore |
| Replica failover | 3 ayda bir | DevOps | Replica promote testi |
| Tam sistem kurtarma | 6 ayda bir | Tum ekip | Sifirdan deploy + restore |
| Tenant izolasyon testi | Aylik | Backend + QA | Cross-tenant erisim testi |

### 8.2 Aylik Yedek Dogrulama Proseduru

```bash
#!/bin/bash
# Aylik DR dogrulama scripti
# Bu script test ortaminda calistirilir

TEST_DB="quvex_dr_test"
LATEST_BACKUP=$(ls -t /backups/daily/quvex_dev_daily_*.dump | head -1)

echo "=== Quvex DR Dogrulama Testi ==="
echo "Tarih: $(date)"
echo "Yedek: ${LATEST_BACKUP}"

# 1. Test DB olustur
psql -h localhost -U postgres -c "DROP DATABASE IF EXISTS ${TEST_DB}"
psql -h localhost -U postgres -c "CREATE DATABASE ${TEST_DB}"

# 2. Restore et
pg_restore -h localhost -U postgres -d "${TEST_DB}" \
  --verbose "${LATEST_BACKUP}" 2>&1

if [ $? -ne 0 ]; then
  echo "HATA: Restore basarisiz!"
  exit 1
fi

# 3. Veri butunlugunu kontrol et
TENANT_COUNT=$(psql -h localhost -U postgres -d "${TEST_DB}" -t -c \
  "SELECT count(*) FROM information_schema.schemata WHERE schema_name LIKE 'tenant_%'")
echo "Tenant sayisi: ${TENANT_COUNT}"

USER_COUNT=$(psql -h localhost -U postgres -d "${TEST_DB}" -t -c \
  "SELECT count(*) FROM users")
echo "Kullanici sayisi: ${USER_COUNT}"

# 4. Temizlik
psql -h localhost -U postgres -c "DROP DATABASE IF EXISTS ${TEST_DB}"

echo "=== DR Dogrulama Tamamlandi ==="
```

### 8.3 Test Sonuc Kaydi

Her DR testi sonrasinda asagidaki bilgiler kaydedilir:

| Alan | Aciklama |
|------|----------|
| Test tarihi | Gun/ay/yil |
| Test turu | Yedek dogrulama / Failover / Tam kurtarma |
| Sonuc | BASARILI / BASARISIZ |
| RTO olcumu | Gercek kurtarma suresi |
| RPO olcumu | Gercek veri kaybi suresi |
| Sorunlar | Tespit edilen problemler |
| Iyilestirmeler | Yapilmasi gereken degisiklikler |
| Onaylayan | Testi onaylayan kisi |

---

## 9. Kontrol Listeleri

### 9.1 Genel Olay Mudahale Kontrol Listesi

```
[ ] 1. Olayin ciddiyetini belirle (P0/P1/P2/P3)
[ ] 2. Nobetci muhendisi bilgilendir
[ ] 3. War room ac (P0/P1 icin)
[ ] 4. Monitoring dashboard'lari incele
[ ] 5. Son yapilan degisiklikleri kontrol et (deploy, config)
[ ] 6. Etkilenen servisleri belirle
[ ] 7. Musteri etkisini degerlendir
[ ] 8. Kurtarma planini sec ve uygula
[ ] 9. Dogrulama testlerini calistir
[ ] 10. Musteri bildirimi gonder (gerekiyorsa)
[ ] 11. Monitoring alarmlarinin normal seviyeye dondugunu dogrula
[ ] 12. Post-mortem raporu yaz (P0/P1 icin)
```

### 9.2 Yedekleme Kontrol Listesi (Gunluk)

```
[ ] Gunluk yedek basarili tamamlandi (log kontrolu)
[ ] Yedek dosya boyutu makul aralikta
[ ] pg_restore --list dogrulamasi gecti
[ ] WAL archival surekli calisiyor
[ ] Disk alani yeterli (> %20 bos)
[ ] Eski yedekler temizlendi (retention policy)
```

### 9.3 Sistem Sagligi Gunluk Kontrol Listesi

```
[ ] /health endpoint'i 200 donuyor
[ ] PostgreSQL baglanti sayisi normal aralikta (< %80 max)
[ ] Redis bellek kullanimi normal (< %70)
[ ] Disk I/O normal seviyelerde
[ ] CPU kullanimi < %80
[ ] Bellek kullanimi < %85
[ ] SSL sertifikasi > 30 gun gecerli
[ ] Yedekleme cronlari aktif
[ ] Monitoring alarmlari dogru calisiyor
```

### 9.4 Deployment Oncesi Kontrol Listesi

```
[ ] Tum testler geciyor (1223 API + 686 UI)
[ ] Veritabani migration'lari hazir
[ ] Ortam degiskenleri guncel
[ ] Yedek alinmis (deploy oncesi)
[ ] Rollback plani hazir
[ ] Health check endpoint'leri calisiyor
[ ] Monitoring alarm esikleri dogru
[ ] SSL sertifikasi gecerli
[ ] DNS kayitlari dogru
```

### 9.5 Yeni Tenant Ekleme Kontrol Listesi

```
[ ] Tenant schema olusturuldu
[ ] Migration'lar calistirildi
[ ] Admin kullanici olusturuldu
[ ] Yetki sablonlari atandi
[ ] Redis cache key izolasyonu dogrulandi
[ ] SignalR grup izolasyonu dogrulandi
[ ] Yedekleme planina eklendi
[ ] Monitoring'e eklendi
[ ] Kabul testi gecti
```

---

## Ek A: Faydali Komutlar Referansi

```bash
# PostgreSQL
pg_dump -Fc -Z9 -f backup.dump dbname          # Sikistirilmis yedek
pg_restore -d dbname backup.dump                 # Geri yukleme
pg_basebackup -D /data -Fp -Xs -P              # Base backup (PITR icin)
psql -c "SELECT pg_switch_wal()"                 # WAL dosyasini degistir
psql -c "SELECT * FROM pg_stat_replication"      # Replikasyon durumu

# Docker
docker-compose down && docker-compose up -d      # Yeniden baslat
docker logs --tail 100 --since 30m container     # Son 30dk loglar
docker exec -it container psql -U postgres       # Container icinde psql
docker stats                                      # Kaynak kullanimi

# Kubernetes
kubectl rollout restart deployment/app -n quvex  # Pod yeniden baslat
kubectl logs -f deploy/app -n quvex              # Canli loglar
kubectl exec -it pod -- psql -U postgres         # Pod icinde psql
kubectl top pods -n quvex                         # Kaynak kullanimi

# Redis
redis-cli INFO memory                             # Bellek bilgisi
redis-cli DBSIZE                                  # Toplam key sayisi
redis-cli KEYS "quvex:tenant:*"                  # Tenant keyleri
redis-cli MONITOR                                 # Canli komut izleme
```

---

## Ek B: Onemli Dosya Konumlari

| Dosya/Dizin | Konum | Aciklama |
|-------------|-------|----------|
| Yedekleme scripti | `/app/scripts/backup.sh` | Otomatik yedekleme |
| Yedek dizini | `/backups/{daily,weekly,monthly}/` | Yedek dosyalari |
| WAL arsivi | `/wal_archive/` | PITR icin WAL dosyalari |
| PostgreSQL data | `/var/lib/postgresql/data/` | DB data dizini |
| PostgreSQL config | `/var/lib/postgresql/data/postgresql.conf` | DB yapilandirmasi |
| Docker Compose | `/opt/quvex/docker-compose.yml` | Servis tanimlari |
| Uygulama loglari | `/var/log/quvex/` | API ve servis loglari |
| Nginx config | `/etc/nginx/conf.d/quvex.conf` | Reverse proxy |
| SSL sertifikalari | `/etc/ssl/quvex/` | TLS sertifikalari |
| Backup loglari | `/var/log/quvex-backup.log` | Yedekleme loglari |

---

## Ek C: Monitoring Alarm Kurallari

| Alarm | Kosul | Kanal | Seviye |
|-------|-------|-------|--------|
| DB Baglanti Hatasi | health != healthy, 2dk | PagerDuty | P0 |
| Yuksek CPU | > %90, 5dk | Slack | P1 |
| Disk Dolu | > %85 | Slack | P1 |
| Yedek Basarisiz | backup.sh exit != 0 | PagerDuty | P1 |
| SSL Suresi Doluyor | < 14 gun | E-posta | P2 |
| Yavas Sorgu | > 5sn | Slack | P2 |
| Redis Bellek | > %80 | Slack | P2 |
| Replica Lag | > 60sn | PagerDuty | P1 |

---

**Bu runbook en az 3 ayda bir gozden gecirilmeli ve guncellenmalidir.**
**Son gozden gecirme: 2026-04-10 | Sonraki gozden gecirme: 2026-07-10**
