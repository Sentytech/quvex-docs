# QUVEX ERP — Sektoerel Coezuem Brosuerue

---

## Her Sektoerue OEzel Yapilandirma, Tek Platform

Quvex ERP, farkli ueretim sektoerlerinin oezguen ihtiyaclarina cevap verecek sekilde yapilandirilabilir. **11 sektoer profili** ve **5 adimli onboarding sihirbazi** ile dakikalar icinde sektoeruenueze oezel yapilandirma tamamlanir. Asagida sektoerunueze uygun moduel ve oezellikleri bulabilirsiniz.

---

## SAVUNMA ve HAVACILIK (AS9100)

**Zorunlu Gereksinimler** | **Quvex Karsiligi**
---|---
Soezlesme incelemesi | Soezlesme Inceleme modeulue (ContractReview)
Ilk Ueruen Muayenesi | FAI modeulue (AS9102 format)
Uygunluk Belgesi | CoC otomatik olusturma
Malzeme Inceleme Kurulu | MRB karar ve karantina yoenetimi
Muesteri Sapma Onayi | CustomerConcession modeulue
Sahte Parca OEnlemei | Counterfeit Part Prevention
FOD Kontrolue | FOD olay ve alan kontrolue
Konfigurasyon Yoenetimi | ECN, revizyon kontrolue
Operator Terminali | ShopFloor — dokunmatik, barkod, offline-first
Kasa/Banka Yoenetimi | Proje bazli nakit akisi takibi

Oernek: A firmasina F-16 parcasi teslim edeceksiniz. Quvex ile soezlesme incelemesinden, uretim seri numarasina, kalibrasyon kaydina, son muayeneye, CoC belgesi olusturmaya kadar tum surecler tek sistemde. Operator terminali ile atolyede anlik veri girisi, offline modda bile kesintisiz calisma.

Tam izlenebilirlik: Seri Numara → Ueretim → Kalite Muayene → NCR → CoC → Sevk → Musteri

**Multi-tenant izolasyon:** Savunma sanayii muesterileri icin schema-per-tenant ile veri izolasyonu, AES-256-GCM sifreleme.

---

## OTOMOTIV YAN SANAYI

**Zorunlu Gereksinimler** | **Quvex Karsiligi**
---|---
PPAP (Parca Onay Suereci) | PPAP modeulue (18 element)
FMEA (Hata Tuerleri Analizi) | Risk & FMEA modeulue
SPC (Istatistiksel Suerec Kontrolue) | SPC grafikleri ve kontrol limitleri
Kontrol Plani | Kontrol Plani modeulue
Tedarikci Degerlendirme | Tedarikci puanlama ve onay
8D Problem Coezme | NCR + CAPA entegre akisi
Lot Takibi | Lot/Parti yoenetimi
Operator Terminali | ShopFloor — NumPad, barkod, glassmorphism UI
Kasa/Banka | Tedarikci oedeme ve cari bakiye takibi

Oernek: Otomotiv OEM'e fren diski ueretiyorsunuz. PPAP dosyasi hazirlamaniz, her partide SPC verisi toplamaniz, kontrol planina goere muayene yapmaniz gerekiyor. Quvex tum bunlari tek akista yoeretir. Operator terminali ile atolye personeli dokunmatik ekrandan is emri baslatir, barkod okutarak parca kaydini tamamlar.

---

## GIDA ve KIMYA

**Zorunlu Gereksinimler** | **Quvex Karsiligi**
---|---
Lot/Parti Izlenebilirlik | Lot yoenetimi + son kullanma uyarisi
FIFO Stok Yoenetimi | Stok degerleme (FIFO/LIFO/Agirlikli)
Hammadde Giris Kontrolue | Giris muayene modeulue
Formuel/Recete Yoenetimi | BOM patlama
Ueruen Guevenligi | Ueruen Guevenlik Degerlendirmesi
Geri Cagirma Hazirligi | Seri numara + genealoji izleme
Operator Terminali | ShopFloor — hijyen eldiveniyle dokunmatik kullanim
Kasa/Banka | Hammadde alimlari icin nakit yoenetimi

Oernek: Boya ueretiyorsunuz. Her partinin hammadde lot numaralari, karisim miktarlari, kalite test sonuclari ve muesteri sevkiyat bilgisi tek sistemde izlenebilir. Sorun oldugunda aninda geriye doenue izleme yapabilirsiniz. Offline modda internet kesintisinde bile ueretim durmaz.

---

## METAL ISLEME ve MAKINE IMALAT (CNC)

**Tipik Ihtiyaclar** | **Quvex Karsiligi**
---|---
Is Emri ve Operasyon Takibi | Cok asamali is emri sablonu
Makine Kullanim Takibi | OEE dashboard + makine bazli analiz
Fason Is Takibi | Fason siparis modeulue
Maliyet Hesaplama | Standart maliyet + gercek maliyet karsilastirma
Fire Takibi | Scrap tracking + kalite orani
Kapasite Planlama | Gantt + cakisma kontrolue
Operator Terminali | ShopFloor — CNC operatoeruen dokunmatik giris, NumPad
Kasa/Banka | Fason oedeme ve muesteri tahsilat takibi

Oernek: CNC torna atoelyesinde 50 farkli parca ueretiyorsunuz. Her parcanin hangi makinede, kim tarafindan, ne kadar suerede yapildigini, fire oranini ve maliyetini takip edebilirsiniz. OEE ile makine verimliligini goersel olarak izleyebilirsiniz. Operator terminali sayesinde CNC operatoeru makineden ayrilmadan is emri baslama/bitirme islemini yapar.

---

## ELEKTRONIK ve KABLO MONTAJ

**Tipik Ihtiyaclar** | **Quvex Karsiligi**
---|---
Seri Numara Takibi | Toplu seri numara olusturma + genealoji
BOM Patlama | Cok seviyeli BOM ve net ihtiyac hesaplama
Komponent Izlenebilirlik | Lot + seri numara esleme
ESD / Oezel Suerec | Oezel Suerec modeulue
Giris Kontrolue | Komponent bazli muayene
Operator Terminali | ShopFloor — barkod ile komponent takibi
Kasa/Banka | Komponent alimlari icin doevizli oedeme takibi

Oernek: PCB montaj hattiniz var. Her kartin seri numarasi, uzerindeki komponentlerin lot numaralari, test sonuclari ve muesteri bilgisi tek sistemde. Operator terminali ile montaj hattinda barkod okutarak komponent esleme aninda yapilir.

---

## MEDIKAL CIHAZ UERETIMI

**Zorunlu Gereksinimler** | **Quvex Karsiligi**
---|---
UDI / Seri Numara | Seri numara yoenetimi
Tasarim Kontrolue | Tasarim ve Gelistirme modeulue
Risk Yoenetimi | Risk & FMEA
Egitim Kayitlari | Egitim ve Yetkinlik Matrisi
Dokueman Kontrolue | Dokueman yoenetimi + onay akisi
Denetim Izi | Audit trail modeulue
Operator Terminali | ShopFloor — temiz oda ortaminda dokunmatik kullanim
Kasa/Banka | Sertifikasyon ve denetim gideri takibi

Oernek: Cerrahi alet ueretiyorsunuz. Her aletin UDI numarasi, ueretim tarihi, sterilizasyon kaydi, muayene sonuclari FDA/MDR uyumlu sekilde saklanir. Offline-first PWA ile temiz oda disinda bile veri girebilirsiniz.

---

## TEKSTIL ve HAZIR GIYIM

**Tipik Ihtiyaclar** | **Quvex Karsiligi**
---|---
Siparis Bazli Ueretim | Siparis → Ueretim aktarma
Fason Takibi | Fason siparis + teslim alma
Sevkiyat Takibi | Irsaliye ve sevk miktari
Muesteri Teklif | Teklif → Siparis doenusuem
Operator Terminali | ShopFloor — dikikhane terminali, barkodlu parca takibi
Kasa/Banka | Fason atoelyelerine oedeme yoenetimi

---

## PLASTIK ve KAUCUK

**Tipik Ihtiyaclar** | **Quvex Karsiligi**
---|---
Kalip Yoenetimi | Makine + kalip esleme takibi
Hammadde Lot Takibi | Lot yoenetimi + FIFO
Fire ve Geri Doenusuem | Scrap tracking + geri kazanim orani
Vardiya Bazli Ueretim | Vardiya tanimlama ve personel atama
Operator Terminali | ShopFloor — enjeksiyon makinesi basinda dokunmatik giris
Kasa/Banka | Hammadde ve kalip yatirimi oedeme takibi

---

## MOBILYA ve AHSAP

**Tipik Ihtiyaclar** | **Quvex Karsiligi**
---|---
Siparis Bazli Ueretim | Muesteri oezel siparis → is emri
BOM Patlama | Cok seviyeli malzeme listesi
Fason Boyama/Kaplama | Fason siparis modeulue
Maliyet Takibi | Malzeme + iscilik + fason maliyet
Operator Terminali | ShopFloor — atoelyede tablet ile is emri takibi
Kasa/Banka | Pesin/vadeli oedeme ve tahsilat yoenetimi

---

## AMBALAJ ve PAKETLEME (YENI)

**Tipik Ihtiyaclar** | **Quvex Karsiligi**
---|---
Yuksek Hacimli Ueretim Takibi | Is emri + parti bazli takip
Hammadde Stok Yoenetimi | Min/max uyari + otomatik satinalma
Baskı ve Kalite Kontrolue | Giris kontrolue + kalite muayene
Muesteri Bazli OEzel Ueretim | Siparis → Ueretim aktarma + BOM
Fire Takibi | Scrap tracking + verimlilik orani
Operator Terminali | ShopFloor — hat basinda dokunmatik terminal
Kasa/Banka | Yuksek hacimli tedarikci oedeme yoenetimi

Oernek: Karton kutu ueretiyorsunuz. Her muesteri icin farkli baskili ambalaj siparis takibi, hammadde lot kontrolue, hat bazli fire orani ve teslimat planlama tek sistemde.

---

## Tum Sektoerelerde Ortak Avantajlar

1. **Tek Platform** — ERP + MES + QMS + CMMS tek sistemde
2. **Hizli Kurulum** — Bulut veya yerel, 1-4 haftada devreye alma
3. **Onboarding Sihirbazi** — 5 adimli rehberli kurulum, sektoerel oto-yapilandirma
4. **Tuerkce Arayuez** — Tamamen Tuerkce, saha personeli icin kolay
5. **Operator Terminali (ShopFloor)** — Dokunmatik optimize, NumPad, barkod, glassmorphism UI
6. **Offline-First PWA** — Internet kesintisinde bile calisma, anlik senkronizasyon
7. **Mobil Uyumlu** — Tablet ve telefon ile atolye erisimi, kurulabilir PWA
8. **Kasa/Banka Yoenetimi** — Nakit ve banka hesaplari, transfer, ekstre, otomatik bakiye
9. **Sesli Bildirimler** — Web Audio API ile anlik sesli uyarilar
10. **Excel Entegrasyonu** — Toplu veri import/export
11. **Olceklenebilir** — 5 kullanicidan 500 kullaniciya
12. **Multi-Tenancy SaaS** — 50+ kiralaci destegi, schema-per-tenant izolasyon
13. **API Erisimi** — 750+ endpoint ile disaridan entegrasyon
14. **Guevenli** — RBAC, CASL, CSRF, CSP, rate limiting, Sentry hata takibi

---

*Quvex — Sektoeruenuez ne olursa olsun, ueretim suereclerinizi dijitallestirin.*
