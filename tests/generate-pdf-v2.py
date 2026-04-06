# -*- coding: utf-8 -*-
"""
Quvex ERP Test Plani v3 — Egitim + Test PDF
Her fazda: Nedir/Ne Degildir + Menu Yonlendirme + Business Aciklama
"""
import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor, white, black
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, HRFlowable, KeepTogether, ListFlowable, ListItem
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# Font
for fname, ffile in [("Arial", "arial.ttf"), ("ArialBD", "arialbd.ttf"), ("ArialI", "ariali.ttf")]:
    fpath = os.path.join("C:/Windows/Fonts", ffile)
    if os.path.exists(fpath):
        pdfmetrics.registerFont(TTFont(fname, fpath))

# Renkler
PRIMARY = HexColor("#6366f1")
DARK = HexColor("#1e1b4b")
GRAY = HexColor("#6b7280")
LIGHT = HexColor("#f3f4f6")
GREEN = HexColor("#16a34a")
BLUE = HexColor("#2563eb")
ORANGE = HexColor("#ea580c")
TEAL = HexColor("#0d9488")
INFO_BG = HexColor("#eff6ff")
WARN_BG = HexColor("#fefce8")
TIP_BG = HexColor("#f0fdf4")

# Stiller
S = {
    "title": ParagraphStyle("T", fontName="ArialBD", fontSize=26, textColor=PRIMARY, spaceAfter=4),
    "subtitle": ParagraphStyle("ST", fontName="Arial", fontSize=14, textColor=GRAY, spaceAfter=16),
    "h1": ParagraphStyle("H1", fontName="ArialBD", fontSize=16, textColor=DARK, spaceBefore=16, spaceAfter=6),
    "h2": ParagraphStyle("H2", fontName="ArialBD", fontSize=13, textColor=PRIMARY, spaceBefore=10, spaceAfter=4),
    "h3": ParagraphStyle("H3", fontName="ArialBD", fontSize=11, textColor=DARK, spaceBefore=8, spaceAfter=3),
    "body": ParagraphStyle("B", fontName="Arial", fontSize=10, textColor=DARK, spaceAfter=3, leading=14),
    "small": ParagraphStyle("SM", fontName="Arial", fontSize=9, textColor=GRAY, spaceAfter=2, leading=12),
    "note": ParagraphStyle("N", fontName="ArialI", fontSize=9, textColor=GRAY, leftIndent=15, spaceAfter=3),
    "check": ParagraphStyle("CK", fontName="Arial", fontSize=10, textColor=DARK, leftIndent=10, spaceAfter=2),
    "dep": ParagraphStyle("D", fontName="ArialBD", fontSize=9, textColor=ORANGE, spaceAfter=3),
    "info": ParagraphStyle("I", fontName="Arial", fontSize=9, textColor=BLUE, spaceAfter=3, leftIndent=10, leading=13),
    "tip": ParagraphStyle("TI", fontName="Arial", fontSize=9, textColor=GREEN, spaceAfter=3, leftIndent=10, leading=13),
    "nav": ParagraphStyle("NAV", fontName="ArialBD", fontSize=9, textColor=TEAL, spaceAfter=2, leftIndent=10),
}

def hdr_ftr(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(PRIMARY)
    canvas.rect(0, A4[1]-14*mm, A4[0], 14*mm, fill=1)
    canvas.setFillColor(white)
    canvas.setFont("ArialBD", 10)
    canvas.drawString(14*mm, A4[1]-9.5*mm, "Quvex ERP")
    canvas.setFont("Arial", 8)
    canvas.drawRightString(A4[0]-14*mm, A4[1]-9.5*mm, "Uctan Uca Test & Egitim Dokumani v3")
    canvas.setFillColor(GRAY)
    canvas.setFont("Arial", 7)
    canvas.drawString(14*mm, 8*mm, "Quvex ERP — Talasli Imalat Atolyesi")
    canvas.drawRightString(A4[0]-14*mm, 8*mm, f"Sayfa {doc.page}")
    canvas.restoreState()

def info_box(text):
    """Mavi bilgi kutusu"""
    return Table([[Paragraph(f"<b>NEDIR?</b> {text}", S["info"])]], colWidths=[175*mm],
        style=TableStyle([("BACKGROUND",(0,0),(-1,-1),INFO_BG), ("BOX",(0,0),(-1,-1),0.5,BLUE),
            ("LEFTPADDING",(0,0),(-1,-1),8), ("TOPPADDING",(0,0),(-1,-1),5), ("BOTTOMPADDING",(0,0),(-1,-1),5)]))

def warn_box(text):
    """Sari uyari kutusu"""
    return Table([[Paragraph(f"<b>NE DEGILDIR?</b> {text}", ParagraphStyle("W", fontName="Arial", fontSize=9, textColor=ORANGE, leading=13))]], colWidths=[175*mm],
        style=TableStyle([("BACKGROUND",(0,0),(-1,-1),WARN_BG), ("BOX",(0,0),(-1,-1),0.5,ORANGE),
            ("LEFTPADDING",(0,0),(-1,-1),8), ("TOPPADDING",(0,0),(-1,-1),5), ("BOTTOMPADDING",(0,0),(-1,-1),5)]))

def tip_box(text):
    """Yesil ipucu kutusu"""
    return Table([[Paragraph(f"<b>BUSINESS:</b> {text}", S["tip"])]], colWidths=[175*mm],
        style=TableStyle([("BACKGROUND",(0,0),(-1,-1),TIP_BG), ("BOX",(0,0),(-1,-1),0.5,GREEN),
            ("LEFTPADDING",(0,0),(-1,-1),8), ("TOPPADDING",(0,0),(-1,-1),5), ("BOTTOMPADDING",(0,0),(-1,-1),5)]))

def nav_box(steps):
    """Menu yonlendirme kutusu"""
    lines = "".join([f"<br/><b>{i+1}.</b> {s}" for i, s in enumerate(steps)])
    return Table([[Paragraph(f"<b>MENU YONLENDIRME:</b>{lines}", S["nav"])]], colWidths=[175*mm],
        style=TableStyle([("BACKGROUND",(0,0),(-1,-1),HexColor("#f0fdfa")), ("BOX",(0,0),(-1,-1),0.5,TEAL),
            ("LEFTPADDING",(0,0),(-1,-1),8), ("TOPPADDING",(0,0),(-1,-1),5), ("BOTTOMPADDING",(0,0),(-1,-1),5)]))

def step_table(sid, name, screen, action, expected, note=None):
    """Tek adim blogu"""
    elements = []
    elements.append(Paragraph(f"<b>{sid}  {name}</b>", S["h3"]))
    data = [["Ekran:", screen], ["Islem:", action], ["Beklenen:", expected]]
    t = Table(data, colWidths=[22*mm, 153*mm])
    t.setStyle(TableStyle([
        ("FONTNAME",(0,0),(0,-1),"ArialBD"), ("FONTNAME",(1,0),(1,-1),"Arial"),
        ("FONTSIZE",(0,0),(-1,-1),9), ("TEXTCOLOR",(0,0),(0,-1),GRAY),
        ("VALIGN",(0,0),(-1,-1),"TOP"), ("LEFTPADDING",(0,0),(-1,-1),4),
        ("TOPPADDING",(0,0),(-1,-1),2), ("BOTTOMPADDING",(0,0),(-1,-1),2),
    ]))
    elements.append(t)
    if note:
        elements.append(Paragraph(f"<i>Not: {note}</i>", S["note"]))
    elements.append(Paragraph("[ ] GECTI    [ ] KALDI    Not: _______________________", S["check"]))
    elements.append(Spacer(1, 4))
    return elements

def build():
    out = os.path.join(os.path.dirname(__file__), "TEST-PLAN-E2E-v3.pdf")
    doc = SimpleDocTemplate(out, pagesize=A4, topMargin=20*mm, bottomMargin=16*mm, leftMargin=14*mm, rightMargin=14*mm)
    story = []

    # ── KAPAK ──
    story.append(Spacer(1, 30))
    story.append(Paragraph("Quvex ERP", S["title"]))
    story.append(Paragraph("Uctan Uca Test & Egitim Dokumani v3", ParagraphStyle("BS", fontName="ArialBD", fontSize=18, textColor=DARK, spaceAfter=6)))
    story.append(Paragraph("Talasli Imalat Atolyesi (5-10 CNC Tezgah)", S["subtitle"]))
    story.append(HRFlowable(width="100%", color=PRIMARY, thickness=2, spaceAfter=16))

    # Yapi
    yapi = [["PROJE YAPISI", ""],
        ["Firma Profili", "5-10 CNC tezgah, 8-15 personel, savunma alt yuklenicisi"],
        ["Hedef Musteriler", "TAI, ASELSAN, TUSAS, ROKETSAN tedarikcileri"],
        ["Sertifikalar", "AS9100 Rev D, ISO 9001:2015"],
        ["Urunler", "Havacilik parcalari: pim, mil, burc, hidrolik blok"],
        ["Test Suresi", "~35 dakika (42 adim, 15 faz)"],
        ["Otomasyon", "52/52 test gecti (75 OK + 4 WARN + 0 FAIL)"],
        ["Son Guncelleme", "2026-04-06"],
    ]
    yt = Table(yapi, colWidths=[42*mm, 133*mm])
    yt.setStyle(TableStyle([
        ("BACKGROUND",(0,0),(-1,0),PRIMARY), ("TEXTCOLOR",(0,0),(-1,0),white), ("FONTNAME",(0,0),(-1,0),"ArialBD"),
        ("SPAN",(0,0),(-1,0)), ("ALIGN",(0,0),(-1,0),"CENTER"),
        ("FONTNAME",(0,1),(0,-1),"ArialBD"), ("FONTNAME",(1,1),(1,-1),"Arial"),
        ("FONTSIZE",(0,0),(-1,-1),10), ("BACKGROUND",(0,1),(-1,-1),LIGHT),
        ("GRID",(0,0),(-1,-1),0.5,GRAY), ("LEFTPADDING",(0,0),(-1,-1),8),
        ("TOPPADDING",(0,0),(-1,-1),5), ("BOTTOMPADDING",(0,0),(-1,-1),5),
    ]))
    story.append(yt)
    story.append(Spacer(1, 14))

    # Kullanim
    story.append(Paragraph("<b>BU DOKUMAN NASIL KULLANILIR?</b>", S["h3"]))
    story.append(Paragraph("1. Her fazi sirasi ile takip edin — bagimlilk kontrolu yapin", S["body"]))
    story.append(Paragraph("2. Mavi NEDIR kutusunu okuyun — is surecini ogretin", S["body"]))
    story.append(Paragraph("3. Yesil MENU YONLENDIRME'yi takip edin — hangi butona tikladinizi bilin", S["body"]))
    story.append(Paragraph("4. [ ] GECTI / KALDI kutucugunu isaretleyin", S["body"]))
    story.append(Paragraph("5. Sorun varsa Not alanina yazin", S["body"]))

    # Akis
    story.append(Spacer(1, 10))
    flow = [["URETIM AKISI (Bu sirayi takip edin)"],
        ["Kayit -> Birimler -> Makineler -> Depolar -> Musteri -> Urun -> Stok"],
        ["Stok Girisi -> Muayene -> Sertifika -> Teklif -> Siparis -> Is Emri"],
        ["Uretim Emri -> Atolye Terminal -> Kalite Onay -> NCR/CAPA/FAI"],
        ["Fason -> Fatura -> Odeme -> Bakim -> IK -> Raporlar"],
    ]
    ft = Table(flow, colWidths=[175*mm])
    ft.setStyle(TableStyle([
        ("BACKGROUND",(0,0),(-1,0),DARK), ("TEXTCOLOR",(0,0),(-1,0),white), ("FONTNAME",(0,0),(-1,0),"ArialBD"),
        ("FONTSIZE",(0,0),(-1,0),11), ("FONTNAME",(0,1),(-1,-1),"Arial"), ("FONTSIZE",(0,1),(-1,-1),9),
        ("BACKGROUND",(0,1),(-1,-1),LIGHT), ("ALIGN",(0,0),(-1,-1),"CENTER"),
        ("GRID",(0,0),(-1,-1),0.5,GRAY), ("TOPPADDING",(0,0),(-1,-1),5), ("BOTTOMPADDING",(0,0),(-1,-1),5),
    ]))
    story.append(ft)
    story.append(PageBreak())

    # ── FAZLAR ──
    phases = [
        {
            "title": "FAZ 0: KAYIT ve GIRIS",
            "dep": "Bagimlilk: Yok (ilk adim)",
            "nedir": "Quvex ERP'ye ilk defa giris yapan bir firmanin kayit sureci. Firma adi, email, sifre ve sektor (CNC/Metal Isleme) secilerek kayit olunur. Sistem otomatik olarak firma icin ayri bir veritabani alani (tenant) olusturur.",
            "nedegildir": "Bu bir demo hesap degildir. Gercek firma bilgileriyle kayit olunur. Her firma kendi verilerini gorur, baska firmalarin verileri gorulemez (multi-tenancy).",
            "business": "Savunma sanayinde her firma AS9100 uyumlulugu icin kendi kalite sistemi, uretim takibi ve izlenebilirlik altyapisina ihtiyac duyar. Quvex bunu ilk kayittan itibaren saglar.",
            "nav": ["Tarayicida localhost:3000/register adresini acin", "Firma bilgilerini doldurun (Firma Adi, Email, Sifre, Sektor: CNC)", "\"Kayit Ol\" butonuna tiklayin", "Basarili mesaji gordugunuzde login sayfasina yonlendirilirsiniz", "Email ve sifre ile giris yapin"],
            "steps": [
                {"id":"0.1","name":"Firma Kaydi","screen":"/register","action":"Firma adi: Demir CNC, Email: ahmet@demircnc.com, Sifre: Test1234!@#$, Sektor: CNC","expected":"'Hesabiniz basariyla olusturuldu' mesaji"},
                {"id":"0.2","name":"Giris Yap","screen":"/login","action":"Email + sifre ile giris","expected":"Anasayfa acilir, ust menude moduller gorunur"},
            ]
        },
        {
            "title": "FAZ 1: TEMEL TANIMLAR",
            "dep": "Bagimlilk: FAZ 0 tamamlanmis olmali",
            "nedir": "Fabrikanin temel yapisini olusturan tanimlamalar: olcu birimleri, kullanici rolleri ve uretim operasyonlari. Bunlar olmadan urun, stok veya uretim tanimi yapilamaz.",
            "nedegildir": "Bu tanimlamalar bir kerelik yapilir. Her siparis icin tekrar tanimlanmaz. Seed data (baslangic verisi) ile bircogu otomatik gelebilir — eksik olanlari ekleyin.",
            "business": "Talasli imalatta her operasyon (torna, freze, taslama) belirli bir makinede, belirli bir surede, belirli bir beceri seviyesinde yapilir. Bu bilgiler maliyet hesabi ve planlama icin zorunludur.",
            "nav": ["Ust menuden Ayarlar'a tiklayin", "Birimler: Ayarlar > Birimler sayfasindan birimleri kontrol edin", "Kullanicilar: Ayarlar > Kullanicilar'dan yeni kullanici ekleyin", "Is Emri Adimlari: Ayarlar > Is Emri Adimlari'ndan operasyonlari ekleyin", "Her operasyona makine, setup suresi, calisma suresi, takim bilgisi girin"],
            "steps": [
                {"id":"1.1","name":"Birimler","screen":"Ayarlar > Birimler","action":"Adet, Kg, Metre, Litre, Takim kontrol et / ekle","expected":"5 birim listede","note":"Seed data ile gelmis olabilir"},
                {"id":"1.2","name":"Kullanicilar + Roller","screen":"Ayarlar > Kullanicilar","action":"Mustafa (Operator) + Mehmet (Kaliteci) ekle, her birini test et","expected":"3 kullanici, Operator sadece Uretim goruyor","note":"AS9100: Operatorun kendi isini kontrol etmesi yasagi — ayri roller zorunlu"},
                {"id":"1.3","name":"Operasyonlar (5 adet)","screen":"Ayarlar > Is Emri Adimlari","action":"OP10 Torna, OP20 Freze, OP30 Taslama, OP40 Capak, OP50 Final — her birine makine, sure, beceri gir","expected":"5 operasyon, tum alanlari dolu"},
            ]
        },
        {
            "title": "FAZ 2: MAKINE, DEPO, KALIBRASYON",
            "dep": "Bagimlilk: FAZ 1 tamamlanmis olmali",
            "nedir": "Fabrikanin fiziksel altyapisi: CNC tezgahlari, depolari ve olcum aletleri. Makinelerin saat maliyeti uretim maliyet hesabinin temelidir. Kalibre olcum aletleri AS9100 zorunlulugudur.",
            "nedegildir": "Makine tanimi sadece ad ve kod degildir — saat ucreti ve setup ucreti girilmelidir. Kalibrasyon sadece ekipman tanimlamak degildir — her ekipmana kalibrasyon kaydi (sertifika, tarih, lab) girilmelidir.",
            "business": "Patron 'bu parca bana kaca mal oluyor?' dediginde cevap ancak makine saat maliyetleri bilinirse verilebilir. Kalibrasyon suresi gecmis aletle olcum gecersizdir — musteri tum partiyi reddedebilir.",
            "nav": ["Makineler: Ayarlar > Makineler'den 5 makine ekleyin", "Her makineye Saat Ucreti ve Setup Ucreti girin (TL/saat)", "Depolar: Stok > Depolar'dan Hammadde ve Mamul deposu ekleyin", "Kalibrasyon: Kalite > Kalibrasyon'dan 3 olcum aleti ekleyin", "Her alete kalibrasyon kaydi girin (sertifika no, tarih, lab)", "Genel Gider: Uretim > Maliyet Analizi'nden %25+%10+%8 ekleyin"],
            "steps": [
                {"id":"2.1","name":"5 Makine","screen":"Ayarlar > Makineler","action":"T01, T02, F01, F02, TAS — saat ucreti + setup ucreti gir","expected":"5 makine, ucretler dogru"},
                {"id":"2.2","name":"2 Depo","screen":"Stok > Depolar","action":"Hammadde Deposu + Mamul Deposu","expected":"2 depo listede"},
                {"id":"2.3","name":"3 Kalibrasyon","screen":"Kalite > Kalibrasyon","action":"Mikrometre, Kumpas, Uc Olcer + sertifika kaydi","expected":"Dashboard: Uyumluluk %100"},
                {"id":"2.4","name":"Genel Gider %43","screen":"Uretim > Maliyet Analizi","action":"Imalat %25, Amortisman %10, Enerji %8","expected":"3 kalem toplam %43"},
            ]
        },
        {
            "title": "FAZ 3: MUSTERI, TEDARIKCI, URUN",
            "dep": "Bagimlilk: FAZ 2 tamamlanmis olmali",
            "nedir": "Is yapilan musteriler, malzeme alinan tedarikciler ve uretilecek urunler. Urun tanimi BOM (malzeme listesi) ve kontrol plani ile tamamlanir. Kontrol plani her operasyonda hangi olcunun, hangi toleransla, hangi aletle kontrol edilecegini belirler.",
            "nedegildir": "Musteri sadece firma bilgisi degildir — odeme vadesi, doviz cinsi, kategori (A/B/C) belirtilmelidir. Urun sadece ad/kod degildir — kalite kontrol gereksinimleri (lot takip, seri takip) isaretlenmelidir.",
            "business": "Savunma sanayinde musteri (TAI, ASELSAN) parcayi kontrol plani olmadan kabul etmez. Kontrol planindaki her olcu, tolerans ve olcum aleti belgelenmelidir. Bu AS9100 madde 8.5.1.1 gereksinimidir.",
            "nav": ["Musteriler: Sol menuden Satis > Musteriler tiklayin, + Yeni ile ekleyin", "Tedarikciler: Ayni sayfada tip olarak 'Tedarikci' secin", "Urunler: Stok > Urunler'den hammadde ve mamul ekleyin", "Stok Kartlari: Stok sayfasi icin ayri STOCK tipinde kart olusturun", "Kontrol Plani: Kalite > Kontrol Planlari'ndan plan + kalemler ekleyin, AKTIF yapin"],
            "steps": [
                {"id":"3.1","name":"Musteri (ASELSAN)","screen":"Musteriler","action":"ASELSAN — adres, vergi, vade 45 gun","expected":"Listede gorunuyor"},
                {"id":"3.2","name":"Tedarikciler (2 adet)","screen":"Musteriler (tip: Tedarikci)","action":"Celik Depo + Isil Islem firmalari","expected":"2 tedarikci"},
                {"id":"3.3","name":"Urunler (Hammadde+Mamul)","screen":"Urunler (/products)","action":"St37 Cubuk + Konnektor Pimi — PRODUCTION_MATERIAL tipinde","expected":"2 urun, kalite kontrol aktif"},
                {"id":"3.4","name":"Stok Kartlari","screen":"Stok (/stocks)","action":"Ayni urunler STOCK tipinde","expected":"Stok sayfasinda 2 kalem","note":"Urunler ve Stok sayfalari farkli tip kullanir"},
                {"id":"3.5","name":"Kontrol Plani (4 kalem)","screen":"Kalite > Kontrol Planlari","action":"4 olcum noktasi + AKTIF yap","expected":"Plan ACTIVE, 3 kritik karakteristik"},
            ]
        },
        {
            "title": "FAZ 4: MALZEME TEDARIK",
            "dep": "Bagimlilk: FAZ 3 tamamlanmis olmali",
            "nedir": "Uretim icin gerekli hammaddenin satin alinmasi, depoya girisi, kalite kontrolu ve sertifikalanmasi. Giris muayenesi malzemenin spesifikasyona uygunlugunu dogrular. Sertifika (MTR, CoC) malzemenin kimligini kanitlar.",
            "nedegildir": "Sadece depo giris fisi kesmek yetmez — malzeme sertifikasi ve giris muayenesi zorunludur. Sertifikasiz malzeme ile uretim yapilamaz (AS9100 8.4.2).",
            "business": "7075-T6 aluminyum veya St37 celik aldiginizda tedarikci size MTR (Mill Test Report) verir. Bu belgede malzemenin kimyasal bilesimi, mekanik ozellikleri (cekme dayanimi, sertlik) yazar. 20 yil sonra bile 'bu parcada hangi malzeme kullanildi?' sorusuna cevap verebilmelisiniz.",
            "nav": ["Stok Girisi: Stok > Giris/Cikis'tan yeni fis olusturun", "Depo secin, belge no girin, urun + miktar + fiyat ekleyin", "Giris Muayenesi: Kalite > Giris Kontrol'den yeni muayene olusturun", "Lot no, miktar, sonuc (GECTI/KALDI) girin", "Sertifika: Muayene satirindaki sertifika ikonuna tiklayin, MTR + CoC yukleyin"],
            "steps": [
                {"id":"4.1","name":"Stok Girisi (550 adet)","screen":"Stok > Giris/Cikis","action":"Hammadde deposuna 550 adet (500+%10 fire)","expected":"Stok kartinda 550 adet"},
                {"id":"4.2","name":"Giris Muayenesi","screen":"Kalite > Giris Kontrol","action":"Lot: ST37-LOT-2026-001, Sonuc: GECTI","expected":"Muayene PASS"},
                {"id":"4.3","name":"Sertifikalar (MTR+CoC)","screen":"Muayene > Sertifika ikonu","action":"2 sertifika yukle","expected":"2 sertifika muayeneye bagli"},
            ]
        },
        {
            "title": "FAZ 5: TEKLIF ve SIPARIS",
            "dep": "Bagimlilk: FAZ 3 tamamlanmis olmali",
            "nedir": "Musteriye fiyat teklifi verilmesi ve kabul edilince siparise donusturulmesi. Teklif-siparis donusumu otomatiktir — teklif kalemi siparis kalemine aktarilir.",
            "nedegildir": "Teklif vermek siparis almak demek degildir. Teklif KABUL EDILMEDEN siparis olusturulamaz. Ayrica siparis dogrudan onaylanamaz — once 'onay talep et' yapilmalidir (AS9100 sozlesme gozden gecirme).",
            "business": "Savunma firmalarinda teklif sureci: (1) Musteri cizim gonderir, (2) Maliyet hesaplanir, (3) Fiyat teklif edilir, (4) Musteri onaylar (PO gonderir), (5) Siparis sisteme girilir. Teklif numarasi ve siparis numarasi izlenebilirlik icin onemlidir.",
            "nav": ["Teklif: Sol menuden Satis > Teklifler > + Yeni Teklif tiklayin", "Musteri secin, urun + miktar + fiyat girin, kaydedin", "Teklifi listede bulun, KABUL EDILDI durumuna gecirin", "Siparis Olustur butonuna tiklayin", "Satislar sayfasinda siparisi kontrol edin"],
            "steps": [
                {"id":"5.1","name":"Teklif","screen":"Teklifler (/offers/form)","action":"ASELSAN — 500 adet x 45 TL = 22,500 TL","expected":"Teklif no atandi"},
                {"id":"5.2","name":"Siparis","screen":"Teklifler listesi","action":"KABUL ET → Siparis Olustur","expected":"Siparis listede"},
            ]
        },
        {
            "title": "FAZ 6: IS EMRI SABLONU",
            "dep": "Bagimlilk: FAZ 1.3 + FAZ 2.1",
            "nedir": "Bir urunun hangi operasyonlardan gececegini, hangi sirayla, hangi makinede, ne kadar surede islenecegini belirleyen sablon. Her parca tipi icin bir sablon tanimlanir ve tekrar tekrar kullanilir.",
            "nedegildir": "Sablon her siparis icin yeniden olusturulmaz. Bir kez tanimlanir, her uretim emrinde bu sablon secilir. Sablon degisikligi tum gelecek uretimleri etkiler.",
            "business": "Savunma parcalarinda 'routing' (operasyon sirasi) AS9100'de belgelenmesi zorunlu olan bir bilgidir. Her operasyonda kim, hangi makinede, ne kadar surede, hangi takimla calistigi kayit altina alinir.",
            "nav": ["Ayarlar > Is Emri Sablonlari'na gidin", "Yeni Sablon olusturun (baslik girin)", "Adimlari surukle-birak ile ekleyin: OP10→OP20→OP30→OP40→OP50", "Her adima makine, sure, kalite kontrol bilgisi girin", "Onkosul (prerequisite) baglantisini kurun"],
            "steps": [
                {"id":"6.1","name":"5 Adimli Sablon","screen":"Ayarlar > Is Emri Sablonlari","action":"OP10→OP20→OP30→OP40→OP50, prerequisite baglantilari","expected":"5 adimli sablon, surukle-birak calisiyor"},
            ]
        },
        {
            "title": "FAZ 7: SIPARIS ONAY ve URETIM",
            "dep": "Bagimlilk: FAZ 5 + FAZ 6",
            "nedir": "Siparisin 3 adimli onay surecinden gecirilmesi ve uretim emrine donusturulmesi. Onay sureci: (1) Onay Talep Et, (2) Onayla, (3) Uretime Aktar. Uretim emri olusturuldugunda is emri sablonu atanir.",
            "nedegildir": "Siparis dogrudan uretime aktarilamaz — once onay sureci tamamlanmalidir. Bu AS9100 sozlesme gozden gecirme (8.2.3) gereksinimini karsilar.",
            "business": "Savunma sanayinde her siparis icin malzeme uygunlugu, kapasite kontrolu, ozel proses gereksinimleri ve musteri ozel kosullari gozden gecirilir. Bu yuzden siparis onaylamadan uretime baslanamaz.",
            "nav": ["Satis > Satislar'dan siparisi acin", "Sag panelde 'Onay Talep Et' butonuna tiklayin", "Yetkili kisi 'Onayla' butonuna tiklasin", "'Uretime Aktar' butonuyla uretim emri olusturun", "Uretim sayfasinda uretim emrini kontrol edin", "Sag panelde 'Is Emri Olustur' → sablon secin"],
            "steps": [
                {"id":"7.1","name":"3 Adimli Onay","screen":"Satislar > detay","action":"Onay Talep → Onayla → Uretime Aktar","expected":"Uretim emri olusturuldu","note":"AS9100 8.2.3: Sozlesme gozden gecirme zorunlu"},
                {"id":"7.2","name":"Is Emri Atama","screen":"Uretim > detay","action":"Is Emri Olustur → Sablon sec","expected":"5 operasyon adimi gorunuyor"},
            ]
        },
        {
            "title": "FAZ 8: ATOLYE TERMINALI",
            "dep": "Bagimlilk: FAZ 7 tamamlanmis olmali",
            "nedir": "Operatorun tablet/bilgisayar basinda kullandigi uretim ekrani. Is baslatma, durdurma (neden secimli), tamamlama ve olcum girisi yapilir. Kaliteci ayri bir ekrandan (Operasyon Muayeneleri) kalite onayini verir.",
            "nedegildir": "Kalite onayini operator vermez — ayri bir kaliteci verir. Bu AS9100'un en temel kurallarindan biridir: kendi isini kendin kontrol etme yasagi. Operator olcum girer, kaliteci onaylar.",
            "business": "CNC tezgahinin basindaki operator siradaki isi gorur, BASLAT der, parca isler, TAMAMLA der. Durma olursa (takim kiridi, malzeme bitti, mola) DURDUR'a basar ve nedenini secer. Bu veri OEE (makine verimliligi) hesabi icin kritiktir.",
            "nav": ["Operator olarak giris yapin (mustafa@demircnc.com)", "Uretim > Atolye Terminali'ni acin", "Sag panelde 'Bugunku Is Emirleri' listesinden OP10'u secin", "BASLAT butonuna basin — zamanlayici baslar", "DURDUR → neden sec (Takim Degisimi vb.) → DEVAM ET", "Miktar girin, TAMAMLA → Olcum modali acilir, olculeri girin", "Kaliteci olarak giris yapin (mehmet@demircnc.com)", "Kalite > Operasyon Muayeneleri sayfasindan OP10'u onaylayin"],
            "steps": [
                {"id":"8.1","name":"Operator Girisi","screen":"/login → mustafa@","action":"Operator olarak giris","expected":"Sadece Atolye Terminali goruyor"},
                {"id":"8.2","name":"OP10 Torna","screen":"Atolye Terminali","action":"BASLAT→DURDUR(neden)→DEVAM→500 adet→TAMAMLA→Olcum gir","expected":"Zamanlayici, durus nedeni, olcum modali calisiyor"},
                {"id":"8.3","name":"Kalite Onay","screen":"Kalite > Op. Muayeneleri","action":"Kaliteci login → OP10 Onayla","expected":"OP10 Onaylandi, OP20 baslatilabilir","note":"AS9100 8.6: Gorev ayrimi zorunlu"},
                {"id":"8.4","name":"OP20-OP50","screen":"Terminal + Kalite","action":"Her op: Baslat→Tamamla→Kalite Onay","expected":"Tum operasyonlar tamamlandi"},
            ]
        },
        {
            "title": "FAZ 9: KALITE OLAYLARI",
            "dep": "Bagimlilk: FAZ 8 tamamlanmis olmali",
            "nedir": "Uretim sirasinda veya sonrasinda tespit edilen sorunlarin yonetimi. NCR (uygunsuzluk raporu) sorunun kaydedilmesi, CAPA (duzeltici faaliyet) cozumun planlanmasi, FAI (ilk parca muayenesi) yeni bir parcenin ilk kez tum boyutlariyla olculup onaylanmasidir.",
            "nedegildir": "NCR acmak problem degildir — acilmayan NCR problemdir. Her uygunsuzluk kayit altina alinmalidir. NCR kok neden girilmeden kapatilamaz — bu AS9100'un en onemli kurallarindan biridir.",
            "business": "Savunma sanayinde uygunsuz parcalar asla sevk edilemez. Her sorun NCR ile belgelenir, kok neden analizi yapilir (5 Neden, Balik Kilcigi vb.), duzeltici ve onleyici aksiyon alinir. FAI raporu (AS9102 formati) yeni her parca icin zorunludur — musteri FAI'yi onaylamadan seri uretim yapilmaz.",
            "nav": ["NCR: Kalite > Uygunsuzluk (NCR) sayfasindan yeni NCR acin", "Siddet, urun, etkilenen miktar, tanim girin", "Status akisini takip edin: OPEN → UNDER_REVIEW → CORRECTIVE → CLOSED", "CAPA: Kalite > CAPA sayfasindan NCR'den duzeltici faaliyet olusturun", "FAI: Kalite > FAI sayfasindan yeni FAI olusturun, karakteristikleri tek tek girin, onayin"],
            "steps": [
                {"id":"9.1","name":"NCR","screen":"Kalite > Uygunsuzluk","action":"NCR ac → OPEN→REVIEW→CORRECTIVE→CLOSED","expected":"Kok neden girilmeden kapatilamaz"},
                {"id":"9.2","name":"CAPA","screen":"Kalite > CAPA","action":"NCR'den duzeltici faaliyet","expected":"CAPA olusturuldu"},
                {"id":"9.3","name":"FAI (AS9102)","screen":"Kalite > FAI","action":"5 karakteristik + Onayla + PDF indir","expected":"FAI APPROVED, 3 Key Characteristic"},
            ]
        },
        {
            "title": "FAZ 10: FASON IS",
            "dep": "Bagimlilk: FAZ 3 tamamlanmis olmali",
            "nedir": "Firmanin kendi yapamadigi islemlerin disariya yaptirmasi: isil islem, kaplama, NDT (tahribatsiz muayene) gibi. Parcalar fason firmaya gonderilir, islem yapilir, geri gelir ve muayene edilir.",
            "nedegildir": "Fason is sadece 'disari gonderme' degildir — parcalarin gidis/donus takibi, fason firmanin sertifikasi ve donus muayenesi zorunludur.",
            "business": "Kadmiyum kaplama, isil islem, NDT gibi 'ozel prosesler' NADCAP sertifikali firmalarda yaptirilir. Her fason islem icin tedarikci sertifikasi ve proses raporu alinir. AS9100 8.5.1.1 ozel proses gereksinimlerini belirler.",
            "nav": ["Uretim > Fason Is Emirleri sayfasini acin", "Yeni siparis olusturun — tedarikci, proses tipi, adet, fiyat", "Status akisini takip edin: TASLAK → GONDERILDI → TEDARIKCIDE → TAMAMLANDI → MUAYENE"],
            "steps": [
                {"id":"10.1","name":"Fason Siparis","screen":"Uretim > Fason Emirleri","action":"Isil Islem — 500 adet, HEAT_TREATMENT","expected":"Status workflow + geri sayim badge"},
            ]
        },
        {
            "title": "FAZ 11: FATURA ve ODEME",
            "dep": "Bagimlilk: FAZ 5 tamamlanmis olmali",
            "nedir": "Musteriye kesilen satis faturasi, tedarikciden alinan alis faturasi ve odemelerin takibi. Fatura oncelikle TASLAK olusturulur, sonra GONDERILDI yapilir, odeme alindikca ODENDI durumuna gecer.",
            "nedegildir": "Taslak faturaya odeme yapilamaz — once GONDERILDI yapilmalidir. Fatura kesilmesi sevkiyat yapildi demek degildir — bunlar ayri surecleridir.",
            "business": "Savunma firmalarinda odeme vadeleri 45-90 gun arasindadir. Vade takibi (yaslandirma analizi) nakit akisi yonetimi icin kritiktir. Her faturada musteri PO (Purchase Order) numarasi belirtilmelidir.",
            "nav": ["Faturalar sayfasindan Yeni Satis Faturasi olusturun", "Musteri secin, kalem ekleyin (urun, miktar, fiyat, KDV)", "Kaydedin → Fatura No otomatik atanir", "Fatura durumunu GONDERILDI yapin", "Odeme ekleyin (Nakit veya Havale)"],
            "steps": [
                {"id":"11.1","name":"Satis Faturasi","screen":"Faturalar","action":"500 x 45 TL + %20 KDV = 27,000 TL","expected":"Fatura no + toplam dogru"},
                {"id":"11.2","name":"Odeme","screen":"Fatura detay","action":"GONDERILDI yap → 15,000 + 12,000 ode","expected":"Fatura ODENDI, cari 0"},
                {"id":"11.3","name":"Alis Faturasi","screen":"Faturalar (Alis)","action":"Celik Depo — 550 x 85 + KDV","expected":"Alis faturasi listede"},
            ]
        },
        {
            "title": "FAZ 12: BAKIM",
            "dep": "Bagimlilk: FAZ 2 tamamlanmis olmali",
            "nedir": "Makine bakim planlarinin tanimlanmasi ve takibi. Onleyici (preventive) bakim duzenli aralklarla yaglama, filtre degisimi gibi islemlerdir. Ariza (corrective) bakim bozulma sonrasi yapilir.",
            "nedegildir": "Bakim plani sadece hatirlatma degildir — is emrine donusturulur, yapilan islem kaydedilir, maliyet takip edilir.",
            "business": "CNC tezgahlarinda duzenli bakim yapilmazsa hassasiyet kaybedilir. Bir tezgahin h6 tolerans (13 mikron) tutmasi icin geometrisi duzenli kontrol edilmelidir. Bakim kayitlari OEE hesabi ve AS9100 denetimi icin gereklidir.",
            "nav": ["Bakim menusunden Bakim Planlari'na gidin", "Yeni plan: Makine secin, frekans (haftalik/aylik), tahmini sure", "Plan listesinden 'Is Emri Olustur' ile bakim is emri yapin"],
            "steps": [
                {"id":"12.1","name":"Bakim Plani","screen":"Bakim > Planlar","action":"CNC-01 Haftalik Yaglama, ONLEYICI","expected":"Plan listede"},
                {"id":"12.2","name":"Bakim Is Emri","screen":"Plan detay","action":"Is Emri Olustur → Tamamla","expected":"Is emri tamamlandi"},
            ]
        },
        {
            "title": "FAZ 13: IK ve VARDIYA",
            "dep": "Bagimlilk: FAZ 1 tamamlanmis olmali",
            "nedir": "Personel vardiya planlama, devam takibi (giris/cikis) ve izin yonetimi. Operator hangi vardiyada calistiginin kaydedilmesi uretim planlama ve maliyet icin gereklidir.",
            "nedegildir": "Bu tam bir IK modulu degildir — maas hesaplama, SGK bildirimi gibi islemler yoktur. Temel vardiya, devam ve izin takibi yapilir.",
            "business": "CNC atolyesinde genellikle 2-3 vardiya calisilir. Hangi operatorun hangi makinede ne kadar calistiginin kaydi, iscilik maliyeti hesabi ve AS9100 yetkinlik takibi icin gereklidir.",
            "nav": ["IK & Vardiya menusunden Vardiya'ya gidin, yeni vardiya tanimlayin", "Devam Takibi'nden giris/cikis kaydi olusturun", "Izin sayfasindan yillik izin talebi yapin ve onaylayin"],
            "steps": [
                {"id":"13.1","name":"Vardiya","screen":"IK > Vardiya","action":"Sabah 06:00-14:00, mola 30dk","expected":"Vardiya tanimli"},
                {"id":"13.2","name":"Devam Takibi","screen":"IK > Devam","action":"Giris/Cikis kaydi","expected":"Kayit olusturuldu"},
                {"id":"13.3","name":"Izin","screen":"IK > Izin","action":"2 gun yillik izin → Onayla","expected":"Izin onaylandi"},
            ]
        },
        {
            "title": "FAZ 14: RAPORLAR ve DASHBOARD",
            "dep": "Bagimlilk: Tum fazlar tamamlanmis olmali",
            "nedir": "Yonetim kokpiti (executive dashboard), kalite metrikleri, uretim performansi, stok durumu ve maliyet analizi raporlari. Patron bu ekranlari acip 'bugun ne durumda?' sorusunun cevabini alir.",
            "nedegildir": "Raporlar sadece tablo degildir — grafik, KPI kart, trend analizi ve AI onerileri icerir. Veri girilmemisse raporlar bos gelir — once diger fazlari tamamlayin.",
            "business": "Savunma sanayinde yonetim gozden gecirme (management review) toplantilari AS9100 gereksinimidir. Bu toplantilarda OEE, NCR trendi, tedarikci performansi, zamaninda teslimat orani sunulur. Dashboard bu verileri anlik gosterir.",
            "nav": ["Yonetim Kokpiti: Ust menuden Yonetim Kokpiti'ne tiklayin", "Kalite: Kalite > Dashboard'dan NCR/CAPA/kalibrasyon metriklerini kontrol edin", "Raporlar: Raporlar menusunden uretim, stok, satis raporlarini inceleyin", "Maliyet: Uretim > Maliyet Analizi'nden birim maliyet ve kar marjini kontrol edin"],
            "steps": [
                {"id":"14.1","name":"Yonetim Kokpiti","screen":"Yonetim Kokpiti","action":"Gelir, OEE, NCR/CAPA, teslimat kontrol","expected":"KPI'lar gorunuyor"},
                {"id":"14.2","name":"Kalite Dashboard","screen":"Kalite > Dashboard","action":"NCR ozet, tedarikci puanlari","expected":"Veriler dogru"},
                {"id":"14.3","name":"Raporlar","screen":"Raporlar","action":"Uretim, stok, satis raporlari","expected":"Raporlar yuklenebiliyor"},
                {"id":"14.4","name":"Maliyet Analizi","screen":"Uretim > Maliyet Analizi","action":"Malzeme + Iscilik + Makine + Gider","expected":"Pasta grafik + birim maliyet"},
            ]
        },
    ]

    for phase in phases:
        story.append(Paragraph(phase["title"], S["h1"]))
        story.append(Paragraph(phase["dep"], S["dep"]))
        story.append(HRFlowable(width="100%", color=PRIMARY, thickness=1, spaceAfter=6))

        # Nedir / Ne Degildir / Business
        story.append(info_box(phase.get("nedir","")))
        story.append(Spacer(1, 3))
        story.append(warn_box(phase.get("nedegildir","")))
        story.append(Spacer(1, 3))
        story.append(tip_box(phase.get("business","")))
        story.append(Spacer(1, 4))

        # Menu yonlendirme
        story.append(nav_box(phase.get("nav",[])))
        story.append(Spacer(1, 6))

        # Adimlar
        for step in phase.get("steps",[]):
            for el in step_table(step["id"], step["name"], step.get("screen",""), step.get("action",""), step.get("expected",""), step.get("note")):
                story.append(el)

        story.append(Spacer(1, 4))

    # ── SONUC TABLOSU ──
    story.append(PageBreak())
    story.append(Paragraph("SONUC TABLOSU", S["h1"]))
    story.append(HRFlowable(width="100%", color=PRIMARY, thickness=1, spaceAfter=8))

    rd = [["Faz","Baslik","Adim","Gecti","Kaldi","Not"]]
    for f in [("0","Kayit+Giris","2"),("1","Birimler+Roller","3"),("2","Makine+Depo","4"),("3","Musteri+Urun","5"),
              ("4","Stok+Muayene","3"),("5","Teklif+Siparis","2"),("6","Is Emri Sablonu","1"),("7","Onay+Uretim","2"),
              ("8","Atolye Terminal","4"),("9","NCR+CAPA+FAI","3"),("10","Fason","1"),("11","Fatura+Odeme","3"),
              ("12","Bakim","2"),("13","IK+Vardiya","3"),("14","Raporlar","4")]:
        rd.append([f[0],f[1],f[2],"","",""])
    rd.append(["","TOPLAM","42","","",""])

    rt = Table(rd, colWidths=[10*mm,48*mm,12*mm,18*mm,18*mm,69*mm])
    rt.setStyle(TableStyle([
        ("BACKGROUND",(0,0),(-1,0),PRIMARY), ("TEXTCOLOR",(0,0),(-1,0),white), ("FONTNAME",(0,0),(-1,0),"ArialBD"),
        ("FONTSIZE",(0,0),(-1,-1),9), ("FONTNAME",(0,1),(-1,-1),"Arial"),
        ("BACKGROUND",(0,-1),(-1,-1),LIGHT), ("FONTNAME",(0,-1),(-1,-1),"ArialBD"),
        ("GRID",(0,0),(-1,-1),0.5,GRAY), ("ALIGN",(0,0),(0,-1),"CENTER"), ("ALIGN",(2,0),(4,-1),"CENTER"),
        ("TOPPADDING",(0,0),(-1,-1),4), ("BOTTOMPADDING",(0,0),(-1,-1),4),
    ]))
    story.append(rt)

    # Imza
    story.append(Spacer(1, 25))
    sd = [["Test Eden:","______________________","Tarih:","_______________"],
          ["Onaylayan:","______________________","Imza:","_______________"]]
    st = Table(sd, colWidths=[22*mm,55*mm,18*mm,55*mm])
    st.setStyle(TableStyle([("FONTNAME",(0,0),(-1,-1),"ArialBD"),("FONTSIZE",(0,0),(-1,-1),10),("BOTTOMPADDING",(0,0),(-1,-1),12)]))
    story.append(st)

    doc.build(story, onFirstPage=hdr_ftr, onLaterPages=hdr_ftr)
    print(f"PDF: {out}")

if __name__ == "__main__":
    build()
