# Quvex ERP — Kalite Modulu Gelistirme Yol Haritasi

> **Perspektif:** Kalite Muduru + Teknisyen + AS9100 Denetci
> **Sonuc:** AS9100/ISO 9001 DENETIME HAZIR
> **Izlenebilirlik:** %100 TAM

---

## HEMEN YAPILACAKLAR

### 1. NCR PDF Cikti
- Denetim icin yazili dokuman sart
- jsPDF veya window.print() ile NCR detay PDF'i
- Dosya: NcrList.js detay modal

### 2. Kalite Maliyeti Dashboard Karti
- QualityDashboard'a "Bu Ayin Kalite Maliyeti: X TL" ekle
- Scrap + Rework + Inspection toplami

### 3. Data Pack ZIP Otomasyonu
- "Data Pack Indir" butonu → ZIP dosyasi
- Icerik: Seri numaralari + CoC + NCR ozetleri + Inspection kayitlari

---

## KISA VADELI (1-2 gun)

### 4. Kalibrasyon SMS/Email Uyari
- Overdue kalibrasyon → SignalR bildirim
- 7 gun onceden uyari

### 5. CAPA Vadesi Gecmis Bildirimi
- Vadesi gecmis CAPA'lar icin otomatik bildirim
- Dashboard'da kirmizi uyari

---

## MEVCUT GUCLU YONLER (DOKUNMA!)

- [x] Giris kalite kontrol 3 adimda
- [x] NCR workflow gorsel (Steps: OPEN→CLOSED)
- [x] NCR dashboard tiklanabilir filtre kartlari
- [x] SPC Recharts grafik + UCL/LCL/Mean cizgileri
- [x] SPC kontrol disi kirmizi noktalar
- [x] Cpk/Cp otomatik hesaplama
- [x] Seri numara genealogy (As-Built) tam zincir
- [x] MRB karantina + 5 karar secenegi
- [x] Tedarikci puanlama + risk level + ASL
- [x] CAPA 7 adimli workflow + etkinlik takibi
- [x] Kalibrasyon overdue uyarisi + uyum orani
- [x] Sahte parca onleme (AS9100 8.1.4)
- [x] Kontrol planlari + 8 metot + 5 ornekleme tipi
- [x] CoC otomatik olusturma + PDF
- [x] Sozlesme inceleme kaydi
- [x] Musteri geri bildirimi yonetimi
- [x] Renk kodlamasi tutarli (kirmizi/sari/yesil)
- [x] 933 API + 413 UI test = %100

---

## DENETCI ICIN HAZIR ALANLAR

| AS9100 Maddesi | Ozellik | Durum |
|----------------|---------|-------|
| 7.1.5 | Kalibrasyon takibi | ✅ |
| 8.1.4 | Sahte parca onleme | ✅ |
| 8.4 | Tedarikci yonetimi (ASL) | ✅ |
| 8.5.2 | Izlenebilirlik (Seri No + Genealogy) | ✅ |
| 8.6 | Giris kalite kontrol | ✅ |
| 8.7 | Uygunsuz urun kontrolu (NCR + MRB) | ✅ |
| 9.1.3 | SPC analiz | ✅ |
| 10.2 | CAPA (Duzeltici/Onleyici) | ✅ |
| 10.3 | Surekli iyilestirme | ✅ |
