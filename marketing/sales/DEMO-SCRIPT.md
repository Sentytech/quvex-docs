# Quvex ERP — 15 Dakikalik Demo Script

> Versiyon: 1.0
> Tarih: 2026-04-12
> Hedef: Canli demo (online veya yuzyuze)
> Onsart: Demo ortami acik, sektor demo datasi hazir, WhatsApp test numarasi tanimli

---

## Hazirlik (demo oncesi — 5 dakika)

- [ ] Quvex demo ortami acik: `https://demo.quvex.io`
- [ ] Chrome tam ekran, hicbir tab acik degil (dikkat dagitmasin)
- [ ] Tablet / telefon (ShopFloor demo icin) yaninda
- [ ] WhatsApp test numarasi `+90 555 XXX XX XX` dogrulanmis
- [ ] Musterinin sektorunu onceden ogren (CNC / Tekstil / Gida / vs.)
- [ ] Notepad ile musterinin adi, sektoru, is hacmi yazili

---

## Dakika 0-2 — Acilis + Kesif

**Ne sorulur:**

> *"Merhaba [Ad Bey], demo baslamadan once iki sorum var. Hangi sektorde calisiyorsunuz ve bugun uretim takibinizi nasil yapiyorsunuz?"*

Alinmasi gereken bilgiler:
- Sektor (CNC / Tekstil / Gida / Otomotiv / ...)
- Kullanici sayisi (~kac kisi)
- Mevcut sistem (Excel / Logo / Mikro / SAP / hic)
- En buyuk agri noktasi (teklif / uretim / kalite / stok)

**Ne yapilir:**
1. Tarayicida `quvex.io` ana sayfa acik
2. Sag ust kosedeki **"Ucretsiz Dene"** butonuna tikla
3. Register ekranina gecis

**Ne soylenir:**
> *"Simdi sizinle birlikte, 5 dakikada sektorunuze ozel ERP'yi ayaga kaldiracagiz. Tek bir satir kod yok, tek bir Excel acilmayacak. Hazir misiniz?"*

---

## Dakika 2-4 — 5dk Onboarding (CANLI WOW ANI)

**Ne yapilir:**
1. Register form doldur (demo hesap: `demo+<musteriadi>@quvex.io`)
2. Email dogrulama mock bypass
3. Onboarding wizard acilir → **Sektor secimi ekrani**
4. Musterinin sektorune tikla (ornek: CNC / Tekstil / Gida)
5. **"Demo Veriyi Yukle"** butonuna tikla
6. 30 saniye progress bar

**Ne soylenir (progress sirasinda):**
> *"Biz bunu yaparken sizin sektorunuz icin hazirladigimiz demo veri yukleniyor. [CNC ise] ASELSAN, ROKETSAN, BAYKAR gibi musteriler; 5 CNC parcasi; DMG MORI ve Mazak makineleri; 2 ornek siparis. [Tekstil ise] Koton, LC Waikiki musterileri, gomlek ve bluz urunleri — zaten beden-renk varyantlariyla birlikte. [Gida ise] Migros, BIM musterileri, yogurt ve biskuvi urunleri, 3 tane HACCP kontrol noktasi hazir."*

**Sonuc ekrani:**
> *"Iste 5 musteriniz, 5 urununuz, 3 makineniz, 2 ornek siparisiniz hazir. Normalde bu veri girisi 2-3 haftalik is. Biz 30 saniyede yaptik. Bu yuzden Sprint 11 sonrasi Mehmet Bey'in ilk kullanim suresi 20 dakikadan 3 dakikaya dustu."*

**Beklenen tepki:** Musteri "olum" bakisi. WOW ani.

---

## Dakika 4-7 — ShopFloor Terminal (Veli Usta icin)

**Ne yapilir:**
1. Sol menu → **Uretim → ShopFloor Terminal**
2. Tam ekran moda gec (F11 veya ikon)
3. 80px butonlari goster — parmagi ekrana degdir

**Ne soylenir:**
> *"Bu ekrani atolyenizdeki Veli Usta icin hazirladik. Veli 50 yasinda, gozluklu, kaynakci eldivenli. Mevcut ERP'lerin hic birinde bu adam calisamaz — 12px yazilar, 20px butonlar. Biz buraya **80 piksel** butonlar koyduk. iOS Apple'in insan arayuz kilavuzu 44 piksel diyor — biz iki katini yaptik."*

4. **Barkod scan alanini goster**
5. Test barkodu okut (veya manuel numara gir): `WO-2026-001`
6. Is emri detayi acilir

**Ne soylenir:**
> *"Veli Usta bu ekranda sadece 3 sey yapar: barkod okut, miktar gir, 'Tamamlandi' butonuna bas. Yuzlerce alan gormez. Egitim suresi? Sifir. Ilk gun tabletle basina koyuyorsunuz, 10 dakika sonra iseri gidiyor."*

7. **"Tamamlandi"** butonuna bas → yesil onay animasyonu

**Beklenen tepki:** Musteri kendi Veli Usta'sini hatirliyor. Empati.

---

## Dakika 7-10 — Sektore Ozel Killer Feature

> **Sektore gore secim yap — TEK bir tanesini goster, hepsini degil.**

### A) Tekstil musterisi → ProductVariant Matrix

1. Sol menu → **Urunler → Urun Ekle**
2. Ad: `Erkek Polo T-shirt`
3. **"Varyant olustur"** toggle ac
4. Beden: `S, M, L, XL, XXL`
5. Renk: `Beyaz, Mavi, Siyah, Kirmizi`
6. **"Tum varyantlari olustur"** — 20 SKU otomatik olusur

**Ne soylenir:**
> *"Gordugunuz gibi 5 beden × 4 renk = 20 ayri SKU. Bunu elle ekleseniz 30 dakika. Biz 3 saniyede yaptik. Logo, Mikro, SAP — hicbirinde boyle bir ozellik yok. Tekstilci bu yuzden bizi seciyor."*

### B) Gida musterisi → HACCP + Recall

1. Sol menu → **Kalite → HACCP Kontrol Noktalari**
2. 3 hazir CCP goster (sicaklik, pH, metal dedektor)
3. Olcum ekle (CCP-1 sicaklik 4°C)
4. **Recall wizard** butonu → 7 adim wizard ac
5. Lot secimi → forward trace BFS ile etkilenen siparisleri goster

**Ne soylenir:**
> *"Bu sistem Turkiye'de ilk. 7 adimli geri cagirma sihirbazi: lot seciyorsun, sistem hangi siparislere hangi musterilere gitti otomatik hesapliyor, NCR otomatik aciliyor, tedarik zinciri 1 saatte izole ediliyor. Tarim Bakanligi denetimde aradigi tek sey bu — klasorle bulabiliyor musunuz?"*

### C) CNC / Savunma musterisi → FAI + NCR + Denetim Gunu

1. Sol menu → **Kalite → FAI / Ilk Parca Muayene**
2. Hazir FAI formu goster (AS9100 compliant)
3. **PDF export** butonuna bas → denetim hazir PDF acilir

**Ne soylenir:**
> *"ASELSAN yarin denetime geldiginde buna bakacak: FAI, NCR, CAPA, izlenebilirlik. Biz hepsini tek tik PDF olarak veriyoruz. Musteriniz 'hazir misiniz?' diye sordugunda 'her zaman hazirim' diyorsunuz."*

---

## Dakika 10-12 — Real-time TV Dashboard

**Ne yapilir:**
1. Yeni tab ac
2. `/production/live-board` adresine git
3. BlankLayout, full screen, dark theme

**Ne soylenir:**
> *"Bunu atolyenizdeki TV'ye koyun. HDMI kabloyla tak, bu ekrani ac, tam ekran yap, unut. 5 dakikada bir kendi kendine yenilenir — Hangfire job arkada calisiyor."*

4. Makine kartlarini goster (yesil / sari / kirmizi durumlar)
5. Ust sagda **canli badge** (yesil "Canli" ibaresi)
6. 56px KPI rakamlarini vurgula

**Ne soylenir:**
> *"Buradaki rakamlar 56 piksel — 10 metre oteden gorebilirsin. Makine kirmizi ise anlik olarak bilgilendirirsin. Ayse Hanim kaliteci kirmizi gordu, direkt makineye gidiyor. Operatorler bunu gordu, yavasladiklarini biliyor. Kultur degisiyor."*

**Beklenen tepki:** Musteri "wow, bunu atolyemde goruyorum."

---

## Dakika 12-14 — WhatsApp Bildirim (Turkiye icin Must-Have)

**Ne yapilir:**
1. Sol menu → **Ayarlar → WhatsApp Entegrasyon**
2. Musteriden telefon numarasini AL
3. **"Test mesaji gonder"** butonu
4. Hazir sablon sec: `order_confirmation`
5. Musteri ad-soyad, siparis no doldur → **Gonder**

**Ne soylenir (beklenmeden):**
> *"Simdi telefonunuza bakin. 2 saniye icinde WhatsApp'tan mesaj alacaksiniz."*

6. Musteri telefonunu cikariyor → mesaj geldi
7. Ornek mesaj:
   ```
   Merhaba [Ad Bey],
   Yilmaz Celik'ten siparisiniz onaylanmistir.
   Siparis No: ORD-2026-0142
   Tahmini teslimat: 15 Nisan 2026
   Quvex ERP
   ```

**Ne soylenir:**
> *"Turkiye'de kimse email acmiyor. WhatsApp hepimizin telefonunda surekli acik. Biz 8 hazir Turkce sablon hazirladik: siparis onayi, kargo, odeme hatirlatma, NCR uyari, is emri, bakim — hepsi. Kimse bunu yapmiyor. Logo yapmiyor, Mikro yapmiyor, SAP B1 yapmiyor. Biz yapiyoruz — cunku Turkiye icin insa edildik."*

**Beklenen tepki:** Musteri telefonu gosteriyor, gulumsuyor. Duygusal bag.

---

## Dakika 14-15 — Kapanis ve Karar

**Ne soylenir:**
> *"Gordugunuz her sey bugun calisiyor. 5 dakikada kurulum, 80 piksel buton, HACCP recall, canli TV pano, WhatsApp bildirim. Simdi tek karar kaldi: bugun mu baslayalim, yoksa bir hafta sonraya planlayalim mi?"*

**Teklif cercevesi:**
- **14 gun ucretsiz.**
- **Kredi karti yok.**
- **Kurulum ucreti yok.**
- **Sektor sablonu dahil.**
- **Istediginiz zaman iptal.**

**Iki yol ver (alternatif sorusu teknigi):**
1. *"Simdi sizin adiniza bir hesap aciyorum, bugun demo veriyle devam edersiniz — bu hafta sonuna kadar kendi verinizi yuklersiniz."*
2. *"Veya gelecek Pazartesi saat 10'da ekibinizle birlikte baslangic toplantisi yapalim — takviminize koyayim."*

**Ne yapilmaz:**
- ❌ "Dusunelim mi?" sorusu sormayin. Karar verici zaten burada.
- ❌ Fiyat pazarligina hemen girmeyin. **Urun degerini** gosterdik.
- ❌ "Emin misiniz?" diye tereddut yaratmayin.

**Son cumle:**
> *"[Ad Bey], Quvex'te 14 gun ucretsiz. Risk yok, kart yok. Size soyle diyebilirim: eger 14 gun sonra Excel'e donmek isterseniz, hic sorun olmadan iptal edersiniz. Ama dondugunuz an gormediniz Sprint 11'deki o 3 dakikalik onboarding'i. Hazir misiniz?"*

---

## Demo sonrasi follow-up

- [ ] **10 dakika icinde** WhatsApp'tan tesekkur mesaji
- [ ] **2 saat icinde** demo linki + ozel sablonlu hesap
- [ ] **24 saat sonra** "ilk is emrinizi actiniz mi?" check-in
- [ ] **7. gun** "yardim edebilecegim bir sey var mi?" call
- [ ] **14. gun** "uzatma veya kapama" karari

---

## Sektore ozel demo varyasyonlari

| Sektor | Killer demo | Vurgulanan ozellik |
|--------|-------------|---------------------|
| CNC / Savunma | FAI + PPAP + AS9100 PDF | "Denetim gunu hazir" |
| Tekstil | ProductVariant matrisi | "Beden × Renk 3 saniyede" |
| Gida | HACCP + Recall wizard | "Bakanlik denetimi rahatligi" |
| Otomotiv | PPAP export + IMDS | "Ford/Tofas sartlari hazir" |
| Plastik | MoldInventory + shot sayaci | "Kalip bakimi zamaninda" |
| Makine | CE Teknik Dosya 19 alan | "Avrupa pazari hazir" |
| Kaynak | WPS/WPQR + sertifika alarmi | "Kaynakci sertifika unutulmaz" |
| Mobilya | Set yonetimi + BOM | "Otel siparisi tek tik" |

---

> **Unutma:** Demo satis degildir. **Sorun cozumu** gosterir. Musterinin sorununu dinle, Quvex'in cozumunu goster, karar anini yarat.
