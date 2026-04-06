# -*- coding: utf-8 -*-
"""
Quvex ERP Test & Egitim Dokumani v3.1
Hedef: Hic bilmeyen birinin takilmadan yurutebilecegi seviye

Eklenenler:
- Baslamadan Once (sistem acma rehberi)
- Terimler Sozlugu
- Her adimda kullanici rolu belirteci [ADMIN/OPERATOR/KALITECI]
- Detayli menu navigasyonu (ust menu/sol menu/ikon tarifi)
- DIKKAT kutusu (sik yapilan hatalar)
- Kullanici degistirme talimatlari
- Sorun Giderme bolumu
"""
import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor, white, black
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, HRFlowable, KeepTogether
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
RED = HexColor("#dc2626")
TEAL = HexColor("#0d9488")
INFO_BG = HexColor("#eff6ff")
WARN_BG = HexColor("#fefce8")
TIP_BG = HexColor("#f0fdf4")
DANGER_BG = HexColor("#fef2f2")
NAV_BG = HexColor("#f0fdfa")
ROLE_ADMIN_BG = HexColor("#f5f3ff")
ROLE_OP_BG = HexColor("#fff7ed")
ROLE_QA_BG = HexColor("#ecfdf5")

# Stiller
S = {
    "title": ParagraphStyle("T", fontName="ArialBD", fontSize=26, textColor=PRIMARY, spaceAfter=4),
    "subtitle": ParagraphStyle("ST", fontName="Arial", fontSize=14, textColor=GRAY, spaceAfter=16),
    "h1": ParagraphStyle("H1", fontName="ArialBD", fontSize=16, textColor=DARK, spaceBefore=16, spaceAfter=6),
    "h2": ParagraphStyle("H2", fontName="ArialBD", fontSize=13, textColor=PRIMARY, spaceBefore=10, spaceAfter=4),
    "h3": ParagraphStyle("H3", fontName="ArialBD", fontSize=11, textColor=DARK, spaceBefore=8, spaceAfter=3),
    "body": ParagraphStyle("B", fontName="Arial", fontSize=10, textColor=DARK, spaceAfter=3, leading=14),
    "bodyBold": ParagraphStyle("BB", fontName="ArialBD", fontSize=10, textColor=DARK, spaceAfter=3, leading=14),
    "small": ParagraphStyle("SM", fontName="Arial", fontSize=9, textColor=GRAY, spaceAfter=2, leading=12),
    "note": ParagraphStyle("N", fontName="ArialI", fontSize=9, textColor=GRAY, leftIndent=15, spaceAfter=3),
    "check": ParagraphStyle("CK", fontName="Arial", fontSize=10, textColor=DARK, leftIndent=10, spaceAfter=2),
    "dep": ParagraphStyle("D", fontName="ArialBD", fontSize=9, textColor=ORANGE, spaceAfter=3),
    "info": ParagraphStyle("I", fontName="Arial", fontSize=9, textColor=BLUE, spaceAfter=3, leftIndent=10, leading=13),
    "tip": ParagraphStyle("TI", fontName="Arial", fontSize=9, textColor=GREEN, spaceAfter=3, leftIndent=10, leading=13),
    "warn": ParagraphStyle("W", fontName="Arial", fontSize=9, textColor=ORANGE, leading=13),
    "danger": ParagraphStyle("DG", fontName="ArialBD", fontSize=9, textColor=RED, spaceAfter=3, leftIndent=10, leading=13),
    "nav": ParagraphStyle("NAV", fontName="Arial", fontSize=9, textColor=TEAL, spaceAfter=2, leftIndent=10, leading=13),
    "navBold": ParagraphStyle("NAVB", fontName="ArialBD", fontSize=9, textColor=TEAL, spaceAfter=2, leftIndent=10),
    "role": ParagraphStyle("ROLE", fontName="ArialBD", fontSize=9, textColor=PRIMARY, spaceAfter=2),
}

W = 175 * mm  # content width

def hdr_ftr(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(PRIMARY)
    canvas.rect(0, A4[1] - 14 * mm, A4[0], 14 * mm, fill=1)
    canvas.setFillColor(white)
    canvas.setFont("ArialBD", 10)
    canvas.drawString(14 * mm, A4[1] - 9.5 * mm, "Quvex ERP")
    canvas.setFont("Arial", 8)
    canvas.drawRightString(A4[0] - 14 * mm, A4[1] - 9.5 * mm, "Uctan Uca Test & Egitim Dokumani v3.1")
    canvas.setFillColor(GRAY)
    canvas.setFont("Arial", 7)
    canvas.drawString(14 * mm, 8 * mm, "Quvex ERP — Talasli Imalat Atolyesi — Gizli")
    canvas.drawRightString(A4[0] - 14 * mm, 8 * mm, f"Sayfa {doc.page}")
    canvas.restoreState()

# ── Box helpers ──

def _box(label, text, style, bg, border_color):
    return Table(
        [[Paragraph(f"<b>{label}</b> {text}", style)]],
        colWidths=[W],
        style=TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), bg),
            ("BOX", (0, 0), (-1, -1), 0.5, border_color),
            ("LEFTPADDING", (0, 0), (-1, -1), 8),
            ("TOPPADDING", (0, 0), (-1, -1), 5),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ])
    )

def info_box(text):
    """Mavi NEDIR kutusu"""
    return _box("NEDIR?", text, S["info"], INFO_BG, BLUE)

def warn_box(text):
    """Sari NE DEGILDIR kutusu"""
    return _box("NE DEGILDIR?", text, S["warn"], WARN_BG, ORANGE)

def tip_box(text):
    """Yesil BUSINESS kutusu"""
    return _box("BUSINESS:", text, S["tip"], TIP_BG, GREEN)

def danger_box(text):
    """Kirmizi DIKKAT kutusu — sik yapilan hatalar"""
    return _box("DIKKAT!", text, S["danger"], DANGER_BG, RED)

def nav_box(steps):
    """Menu yonlendirme kutusu — numarali adimlar"""
    lines = "".join([f"<br/><b>{i + 1}.</b> {s}" for i, s in enumerate(steps)])
    return Table(
        [[Paragraph(f"<b>MENU YONLENDIRME:</b>{lines}", S["nav"])]],
        colWidths=[W],
        style=TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), NAV_BG),
            ("BOX", (0, 0), (-1, -1), 0.5, TEAL),
            ("LEFTPADDING", (0, 0), (-1, -1), 8),
            ("TOPPADDING", (0, 0), (-1, -1), 5),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ])
    )

def role_badge(role):
    """Kullanici rolu belirteci"""
    colors = {
        "ADMIN": (PRIMARY, ROLE_ADMIN_BG, "YONETICI — ahmet@demircnc.com"),
        "OPERATOR": (ORANGE, ROLE_OP_BG, "OPERATOR — mustafa@demircnc.com"),
        "KALITECI": (GREEN, ROLE_QA_BG, "KALITECI — mehmet@demircnc.com"),
    }
    color, bg, desc = colors.get(role, (GRAY, LIGHT, role))
    style = ParagraphStyle("RB", fontName="ArialBD", fontSize=9, textColor=color, leading=12)
    return Table(
        [[Paragraph(f"[{role}] Bu adimi {desc} kullanicisiyla yapin", style)]],
        colWidths=[W],
        style=TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), bg),
            ("BOX", (0, 0), (-1, -1), 0.5, color),
            ("LEFTPADDING", (0, 0), (-1, -1), 8),
            ("TOPPADDING", (0, 0), (-1, -1), 4),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ])
    )

def switch_user_box(from_role, to_role, email):
    """Kullanici degistirme talimati"""
    style = ParagraphStyle("SU", fontName="ArialI", fontSize=9, textColor=DARK, leading=12)
    return Table(
        [[Paragraph(
            f"<b>KULLANICI DEGISTIR:</b> Sag ustteki profil ikonuna tiklayin > "
            f"\"Cikis Yap\" > Login sayfasinda <b>{email}</b> ile giris yapin. "
            f"Sifre: <b>Test1234!@#$</b>", style
        )]],
        colWidths=[W],
        style=TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), HexColor("#faf5ff")),
            ("BOX", (0, 0), (-1, -1), 0.5, PRIMARY),
            ("LEFTPADDING", (0, 0), (-1, -1), 8),
            ("TOPPADDING", (0, 0), (-1, -1), 4),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ])
    )

def step_table(sid, name, screen, action, expected, note=None, role="ADMIN", screen_detail=None):
    """Tek adim blogu — detayli"""
    elements = []
    elements.append(Paragraph(f"<b>{sid}  {name}</b>", S["h3"]))

    data = [
        ["Ekran:", screen],
        ["Islem:", action],
        ["Beklenen:", expected],
    ]
    if screen_detail:
        data.insert(1, ["Nerede?:", screen_detail])

    t = Table(data, colWidths=[22 * mm, 153 * mm])
    t.setStyle(TableStyle([
        ("FONTNAME", (0, 0), (0, -1), "ArialBD"),
        ("FONTNAME", (1, 0), (1, -1), "Arial"),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("TEXTCOLOR", (0, 0), (0, -1), GRAY),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 4),
        ("TOPPADDING", (0, 0), (-1, -1), 2),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
    ]))
    elements.append(t)
    if note:
        elements.append(Paragraph(f"<i>Not: {note}</i>", S["note"]))
    elements.append(Paragraph("[ ] GECTI    [ ] KALDI    Not: _______________________", S["check"]))
    elements.append(Spacer(1, 4))
    return elements


def build():
    out = os.path.join(os.path.dirname(__file__), "TEST-PLAN-E2E-v3.pdf")
    doc = SimpleDocTemplate(out, pagesize=A4, topMargin=20 * mm, bottomMargin=16 * mm, leftMargin=14 * mm, rightMargin=14 * mm)
    story = []

    # ══════════════════════════════════════════════════
    # KAPAK SAYFASI
    # ══════════════════════════════════════════════════
    story.append(Spacer(1, 30))
    story.append(Paragraph("Quvex ERP", S["title"]))
    story.append(Paragraph("Uctan Uca Test & Egitim Dokumani v3.1", ParagraphStyle("BS", fontName="ArialBD", fontSize=18, textColor=DARK, spaceAfter=6)))
    story.append(Paragraph("Talasli Imalat Atolyesi (5-10 CNC Tezgah)", S["subtitle"]))
    story.append(HRFlowable(width="100%", color=PRIMARY, thickness=2, spaceAfter=16))

    # Yapi tablosu
    yapi = [
        ["PROJE YAPISI", ""],
        ["Firma Profili", "5-10 CNC tezgah, 8-15 personel, savunma alt yuklenicisi"],
        ["Hedef Musteriler", "TAI, ASELSAN, TUSAS, ROKETSAN tedarikcileri"],
        ["Sertifikalar", "AS9100 Rev D, ISO 9001:2015"],
        ["Urunler", "Havacilik parcalari: pim, mil, burc, hidrolik blok"],
        ["Test Suresi", "~45 dakika (42 adim, 15 faz) — yavaslayarak yapin, acele etmeyin"],
        ["Son Guncelleme", "2026-04-06"],
    ]
    yt = Table(yapi, colWidths=[42 * mm, 133 * mm])
    yt.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), PRIMARY), ("TEXTCOLOR", (0, 0), (-1, 0), white), ("FONTNAME", (0, 0), (-1, 0), "ArialBD"),
        ("SPAN", (0, 0), (-1, 0)), ("ALIGN", (0, 0), (-1, 0), "CENTER"),
        ("FONTNAME", (0, 1), (0, -1), "ArialBD"), ("FONTNAME", (1, 1), (1, -1), "Arial"),
        ("FONTSIZE", (0, 0), (-1, -1), 10), ("BACKGROUND", (0, 1), (-1, -1), LIGHT),
        ("GRID", (0, 0), (-1, -1), 0.5, GRAY), ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 5), ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]))
    story.append(yt)
    story.append(Spacer(1, 10))

    # Test kullanicilari
    story.append(Paragraph("<b>TEST KULLANICILARI (3 kisi ile test yapilacak)</b>", S["h3"]))
    users = [
        ["Rol", "Ad Soyad", "Email", "Sifre", "Ne Yapar?"],
        ["YONETICI", "Ahmet Demir", "ahmet@demircnc.com", "Test1234!@#$", "Tum moduller — tanimlar, satis, raporlar"],
        ["OPERATOR", "Mustafa Tornaci", "mustafa@demircnc.com", "Test1234!@#$", "Atolye Terminali — is baslatma/durdurma"],
        ["KALITECI", "Mehmet Kaliteci", "mehmet@demircnc.com", "Test1234!@#$", "Kalite modulleri — muayene, onay, NCR"],
    ]
    ut = Table(users, colWidths=[20 * mm, 28 * mm, 42 * mm, 27 * mm, 58 * mm])
    ut.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), DARK), ("TEXTCOLOR", (0, 0), (-1, 0), white), ("FONTNAME", (0, 0), (-1, 0), "ArialBD"),
        ("FONTSIZE", (0, 0), (-1, -1), 8), ("FONTNAME", (0, 1), (-1, -1), "Arial"),
        ("BACKGROUND", (0, 1), (-1, 1), ROLE_ADMIN_BG),
        ("BACKGROUND", (0, 2), (-1, 2), ROLE_OP_BG),
        ("BACKGROUND", (0, 3), (-1, 3), ROLE_QA_BG),
        ("GRID", (0, 0), (-1, -1), 0.5, GRAY),
        ("TOPPADDING", (0, 0), (-1, -1), 3), ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
        ("LEFTPADDING", (0, 0), (-1, -1), 4),
    ]))
    story.append(ut)
    story.append(Spacer(1, 10))

    # Nasil kullanilir
    story.append(Paragraph("<b>BU DOKUMANI NASIL KULLANACAKSINIZ?</b>", S["h3"]))
    howto = [
        "1. Oncelikle BASLAMADAN ONCE sayfasini okuyun — sistemi acmayi ogretin",
        "2. TERIMLER SOZLUGU sayfasini okuyun — bilmediginiz kelimeleri orada bulun",
        "3. Her fazi SIRASIYLA takip edin — atlama yapmayin, bagimliliklari kontrol edin",
        "4. Mavi NEDIR kutusunu okuyun — o fazda ne yapildigini anlayin",
        "5. Sari NE DEGILDIR kutusunu okuyun — yanlis anlama olasiliklarina dikkat edin",
        "6. Yesil BUSINESS kutusunu okuyun — is surecini ogretin",
        "7. Turkuaz MENU YONLENDIRME'yi adim adim takip edin — hangi butona tikladiginizi bilin",
        "8. Kirmizi DIKKAT kutulari var — en cok hata yapilan noktalar, mutlaka okuyun",
        "9. [ADMIN], [OPERATOR], [KALITECI] etiketleri var — hangi kullaniciyla islem yaptiginizi kontrol edin",
        "10. [ ] GECTI / KALDI kutucugunu isaretleyin, sorun varsa Not alanina yazin",
    ]
    for h in howto:
        story.append(Paragraph(h, S["body"]))
    story.append(Spacer(1, 8))

    # Akis diyagrami — daha detayli
    story.append(Paragraph("<b>URETIM SURECI AKISI</b>", S["h3"]))
    flow = [
        ["ADIM", "NE YAPILIR?", "KIM YAPAR?"],
        ["1. Kayit + Giris", "Firma olustur, kullanicilar tanimla", "Yonetici"],
        ["2. Temel Tanimlar", "Birimler, roller, operasyonlar", "Yonetici"],
        ["3. Makine + Depo", "CNC tezgahlar, depolar, olcum aletleri", "Yonetici"],
        ["4. Musteri + Urun", "Musteri, tedarikci, urun, kontrol plani", "Yonetici"],
        ["5. Malzeme Tedarik", "Stok girisi, muayene, sertifika", "Yonetici"],
        ["6. Teklif + Siparis", "Fiyat teklifi, kabul, siparis olusturma", "Yonetici"],
        ["7. Is Emri Sablonu", "Operasyon sirasi (routing) tanimlama", "Yonetici"],
        ["8. Onay + Uretim", "Siparis onayi, uretim emri, is emri atama", "Yonetici"],
        ["9. Atolye Terminali", "Is baslatma, durdurma, olcum", "Operator"],
        ["", "Kalite onay (ayri ekran)", "Kaliteci"],
        ["10. Kalite Olaylari", "NCR, CAPA, FAI", "Kaliteci"],
        ["11. Fason Is", "Disariya yaptirma (isil islem vb.)", "Yonetici"],
        ["12. Fatura + Odeme", "Satis/alis faturasi, odeme", "Yonetici"],
        ["13. Bakim", "Makine bakim planlari", "Yonetici"],
        ["14. IK + Vardiya", "Personel, vardiya, izin", "Yonetici"],
        ["15. Raporlar", "Dashboard, KPI, maliyet analizi", "Yonetici"],
    ]
    ft = Table(flow, colWidths=[32 * mm, 95 * mm, 48 * mm])
    ft.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), DARK), ("TEXTCOLOR", (0, 0), (-1, 0), white), ("FONTNAME", (0, 0), (-1, 0), "ArialBD"),
        ("FONTSIZE", (0, 0), (-1, -1), 8), ("FONTNAME", (0, 1), (-1, -1), "Arial"),
        ("BACKGROUND", (0, 1), (-1, 8), LIGHT),
        ("BACKGROUND", (0, 9), (-1, 10), ROLE_OP_BG),
        ("BACKGROUND", (0, 11), (-1, 11), ROLE_QA_BG),
        ("BACKGROUND", (0, 12), (-1, -1), LIGHT),
        ("GRID", (0, 0), (-1, -1), 0.5, GRAY),
        ("TOPPADDING", (0, 0), (-1, -1), 3), ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
        ("LEFTPADDING", (0, 0), (-1, -1), 4),
    ]))
    story.append(ft)
    story.append(PageBreak())

    # ══════════════════════════════════════════════════
    # BASLAMADAN ONCE
    # ══════════════════════════════════════════════════
    story.append(Paragraph("BASLAMADAN ONCE — Sistemi Hazirlama", S["h1"]))
    story.append(HRFlowable(width="100%", color=PRIMARY, thickness=1, spaceAfter=8))

    story.append(Paragraph(
        "Bu test icin 3 servisin ayni anda calisiyor olmasi gerekir: <b>Veritabani (PostgreSQL)</b>, "
        "<b>API (Backend)</b> ve <b>UI (Frontend)</b>. Asagidaki adimlari sirasi ile yapin.",
        S["body"]))
    story.append(Spacer(1, 6))

    prereq = [
        ["ADIM", "KOMUT / ISLEM", "KONTROL"],
        ["1. Veritabani", "Terminal acin:\ndocker start smallfactory-postgres", "docker ps komutu ile 'Up' durumunda gorun"],
        ["2. API (Backend)", "Yeni terminal acin:\ncd C:\\rynSoft\\smallFactoryApi\ndotnet run --project src/Quvex.API", "Terminal: 'Now listening on http://localhost:5052'\nTarayici: localhost:5052/swagger acilmali"],
        ["3. UI (Frontend)", "Yeni terminal acin:\ncd C:\\rynSoft\\smallFactoryUI\nnpm run dev", "Terminal: 'Local: http://localhost:3000'\nTarayici: localhost:3000 acilmali"],
        ["4. Saglik Kontrolu", "Tarayicida acin:\nlocalhost:3000/login", "Giris ekrani gorunmeli.\nEger 'Baglanti hatasi' cikarsa\nAPI calismiyor demektir."],
    ]
    pt = Table(prereq, colWidths=[28 * mm, 72 * mm, 75 * mm])
    pt.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), PRIMARY), ("TEXTCOLOR", (0, 0), (-1, 0), white), ("FONTNAME", (0, 0), (-1, 0), "ArialBD"),
        ("FONTSIZE", (0, 0), (-1, -1), 8), ("FONTNAME", (0, 1), (-1, -1), "Arial"),
        ("BACKGROUND", (0, 1), (-1, -1), LIGHT),
        ("GRID", (0, 0), (-1, -1), 0.5, GRAY),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 4), ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ("LEFTPADDING", (0, 0), (-1, -1), 4),
    ]))
    story.append(pt)
    story.append(Spacer(1, 8))

    story.append(danger_box(
        "Eger Docker yuklu degilse veritabanini baslatamazsiniz. "
        "API veya UI baslatilinca hata aliyorsaniz bagimliliklari kontrol edin: "
        "API icin .NET 8 SDK, UI icin Node.js 18+ gereklidir. "
        "3 terminal AYNI ANDA acik kalmalidir — birini kapatirsiniz sistem durur."
    ))
    story.append(Spacer(1, 6))

    story.append(Paragraph("<b>EKRAN YAPISI — Neresi Ne?</b>", S["h3"]))
    story.append(Paragraph(
        "Quvex ERP'de yatay (horizontal) menu kullanilir. Ekranin en <b>ustunde</b> ana menu cubugu vardir. "
        "Bu cubukta modul adlari (Uretim, Stok, Kalite, Satis, Faturalar, Bakim, IK, Ayarlar, Raporlar) bulunur. "
        "Bir module tikladiginizda alt sayfalari acilir. Ekranin <b>sag ust kosesinde</b> profil ikonu ve "
        "bildirim ikonu bulunur. <b>Cikis yapmak</b> icin profil ikonuna tiklayin > 'Cikis Yap' secin.",
        S["body"]))
    story.append(Spacer(1, 4))

    menu_map = [
        ["MENU", "ALT SAYFALAR", "NE ICIN KULLANILIR?"],
        ["Uretim", "Uretim Emirleri, Maliyet, Fason, Atolye Terminali", "Uretim planlama ve takip"],
        ["Stok", "Urunler, Stok, Depolar, Giris/Cikis", "Malzeme ve envanter yonetimi"],
        ["Kalite", "Kontrol Planlari, Giris Kontrol, Kalibrasyon,\nNCR, CAPA, FAI, Op. Muayeneleri", "Kalite guvence (AS9100)"],
        ["Satis", "Musteriler, Teklifler, Satislar", "Satis sureci"],
        ["Faturalar", "Satis Faturasi, Alis Faturasi, Odemeler", "Mali islemler"],
        ["Bakim", "Bakim Planlari, Is Emirleri", "Makine bakim"],
        ["IK & Vardiya", "Vardiya, Devam, Izin", "Personel yonetimi"],
        ["Ayarlar", "Birimler, Kullanicilar, Makineler,\nIs Emri Adimlari, Sablonlar, Roller", "Sistem tanimlari"],
        ["Raporlar", "Uretim, Stok, Satis, Kalite raporlari", "Analiz ve raporlama"],
    ]
    mt = Table(menu_map, colWidths=[25 * mm, 72 * mm, 78 * mm])
    mt.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), DARK), ("TEXTCOLOR", (0, 0), (-1, 0), white), ("FONTNAME", (0, 0), (-1, 0), "ArialBD"),
        ("FONTSIZE", (0, 0), (-1, -1), 8), ("FONTNAME", (0, 1), (-1, -1), "Arial"),
        ("FONTNAME", (0, 1), (0, -1), "ArialBD"),
        ("BACKGROUND", (0, 1), (-1, -1), LIGHT),
        ("GRID", (0, 0), (-1, -1), 0.5, GRAY),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 3), ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
        ("LEFTPADDING", (0, 0), (-1, -1), 4),
    ]))
    story.append(mt)
    story.append(PageBreak())

    # ══════════════════════════════════════════════════
    # TERIMLER SOZLUGU
    # ══════════════════════════════════════════════════
    story.append(Paragraph("TERIMLER SOZLUGU", S["h1"]))
    story.append(HRFlowable(width="100%", color=PRIMARY, thickness=1, spaceAfter=8))
    story.append(Paragraph(
        "Bu dokumanda gecen teknik terimlerin aciklamalari. Bilmediginiz bir kelime gordugunde bu sayfaya donun.",
        S["body"]))
    story.append(Spacer(1, 4))

    terms = [
        ["TERIM", "ACIKLAMA"],
        ["AS9100", "Havacilik ve savunma sanayine ozel kalite yonetim standardi. ISO 9001'in uzantisi."],
        ["NCR", "Non-Conformance Report — Uygunsuzluk Raporu. Urun spesifikasyona uymayinca acilir."],
        ["CAPA", "Corrective and Preventive Action — Duzeltici ve Onleyici Faaliyet. NCR'nin cozum plani."],
        ["FAI", "First Article Inspection — Ilk Parca Muayenesi. Yeni bir parcenin tum olculerinin kontrolu."],
        ["OEE", "Overall Equipment Effectiveness — Toplam Ekipman Etkinligi. Makine verimliligi olcusu."],
        ["MTR", "Mill Test Report — Malzeme Test Raporu. Celik/aluminyum'un kimyasal ve mekanik ozelliklerini gosterir."],
        ["CoC", "Certificate of Conformance — Uygunluk Sertifikasi. Malzemenin standarda uygun oldugunu belgeler."],
        ["BOM", "Bill of Materials — Malzeme Listesi. Bir urun icin gereken tum malzemelerin listesi."],
        ["Routing", "Operasyon Sirasi. Bir parcenin hangi makinelerde, hangi sirayla islendigi."],
        ["Tenant", "Kiracı. Sistemde her firma ayri bir tenant'tir. Birbirinin verisini goremez."],
        ["Seed Data", "Baslangic Verisi. Sistem ilk acildiginda otomatik yuklenen varsayilan veriler."],
        ["Setup Suresi", "Makineyi hazirlama suresi. Takim takma, program yukleme, sifir alma vb."],
        ["Run Suresi", "Parca basina islem suresi. Bir parcenin makinede islenmesi icin gecen sure."],
        ["Tolerans", "Izin verilen olcu sapmasi. Ornek: 6.000 +0.010/-0.000 = 6.000 ile 6.010 arasi kabul."],
        ["h6 Tolerans", "ISO tolerance sinifi. D6 cap icin 5.992-6.000mm arasi (8 mikron aralik)."],
        ["Kontrol Plani", "Her operasyonda hangi olcunun, hangi aletle, hangi toleransla kontrol edilecegi."],
        ["Fason Is", "Firmanin kendi yapamadigi islerin disariya yaptirilmasi (isil islem, kaplama vb.)."],
        ["NADCAP", "Havacilik ozel prosesleri akreditasyonu (isil islem, NDT, kaplama icin)."],
        ["Onleyici Bakim", "Arizayi beklemeden duzenli aralklarla yapilan bakim (yaglama, filtre degisimi)."],
    ]
    tt = Table(terms, colWidths=[30 * mm, 145 * mm])
    tt.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), PRIMARY), ("TEXTCOLOR", (0, 0), (-1, 0), white), ("FONTNAME", (0, 0), (-1, 0), "ArialBD"),
        ("FONTSIZE", (0, 0), (-1, -1), 8), ("FONTNAME", (0, 1), (0, -1), "ArialBD"), ("FONTNAME", (1, 1), (1, -1), "Arial"),
        ("BACKGROUND", (0, 1), (-1, -1), LIGHT),
        ("GRID", (0, 0), (-1, -1), 0.5, GRAY),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 3), ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
        ("LEFTPADDING", (0, 0), (-1, -1), 4),
    ]))
    story.append(tt)
    story.append(PageBreak())

    # ══════════════════════════════════════════════════
    # FAZLAR
    # ══════════════════════════════════════════════════
    phases = [
        {
            "title": "FAZ 0: KAYIT ve GIRIS",
            "dep": "Bagimlilk: Yok (ilk adim)",
            "nedir": "Quvex ERP'ye ilk defa giris yapan bir firmanin kayit sureci. Firma adi, email, sifre ve sektor (CNC/Metal Isleme) secilerek kayit olunur. Sistem otomatik olarak firma icin ayri bir veritabani alani (tenant) olusturur.",
            "nedegildir": "Bu bir demo hesap degildir. Gercek firma bilgileriyle kayit olunur. Her firma kendi verilerini gorur, baska firmalarin verileri gorulemez.",
            "business": "Savunma sanayinde her firma AS9100 uyumlulugu icin kendi kalite sistemi, uretim takibi ve izlenebilirlik altyapisina ihtiyac duyar. Quvex bunu ilk kayittan itibaren saglar.",
            "dikkat": "Sifre en az 12 karakter, buyuk/kucuk harf, rakam ve ozel karakter icermelidir. 'Test1234!@#$' bu kurallara uyar — daha kisa sifre kabul edilmez. Email formatina dikkat edin (@ isareti ve domain olmali).",
            "nav": [
                "Tarayicida adres cubuguna localhost:3000/register yazin ve Enter'a basin",
                "Acilan formda su alanlari doldurun: Firma Adi, Alt Alan (subdomain), Ad Soyad, Email, Telefon, Sifre, Sektor",
                "Tum alanlar zorunludur — bos alan birakmayin",
                "'Kayit Ol' butonuna tiklayin (formun altinda, mor/mavi renkte)",
                "'Hesabiniz basariyla olusturuldu' mesajini gordugunuzde login sayfasina yonlendirilirsiniz",
                "Email ve sifre ile giris yapin — 'Giris Yap' butonuna tiklayin",
                "Anasayfa acilacak, ust menude modul adlari gorunecek",
            ],
            "steps": [
                {"id": "0.1", "name": "Firma Kaydi", "screen": "localhost:3000/register", "role": "ADMIN",
                 "screen_detail": "Tarayici adres cubuguna bu adresi yazin. Sayfada buyuk bir kayit formu goreceksiniz.",
                 "action": "Firma Adi: Demir CNC Hassas Isleme | Alt Alan: demircnc | Ad: Ahmet Demir | Email: ahmet@demircnc.com | Sifre: Test1234!@#$ | Sektor: CNC / Metal Isleme",
                 "expected": "'Hesabiniz basariyla olusturuldu' mesaji cikar. Otomatik olarak login sayfasina yonlendirilirsiniz.",
                 "note": "Eger 'Bu email zaten kayitli' hatasi aliyorsaniz, daha once kayit olunmus — direkt login yapin"},
                {"id": "0.2", "name": "Giris Yap", "screen": "localhost:3000/login", "role": "ADMIN",
                 "screen_detail": "Login sayfasinda 2 alan vardir: Email ve Sifre. Altinda 'Giris Yap' butonu.",
                 "action": "Email: ahmet@demircnc.com | Sifre: Test1234!@#$ → 'Giris Yap' tikla",
                 "expected": "Anasayfa (Dashboard) acilir. Ust menude Uretim, Stok, Kalite, Satis, Faturalar, Bakim, IK, Ayarlar, Raporlar gorunur."},
            ]
        },
        {
            "title": "FAZ 1: TEMEL TANIMLAR",
            "dep": "Bagimlilk: FAZ 0 tamamlanmis olmali",
            "nedir": "Fabrikanin temel yapisini olusturan tanimlamalar: olcu birimleri, kullanici rolleri ve uretim operasyonlari. Bunlar olmadan urun, stok veya uretim tanimi yapilamaz.",
            "nedegildir": "Bu tanimlamalar bir kerelik yapilir. Her siparis icin tekrar tanimlanmaz. Seed data (baslangic verisi) ile bircogu otomatik gelebilir — eksik olanlari ekleyin.",
            "business": "Talasli imalatta her operasyon (torna, freze, taslama) belirli bir makinede, belirli bir surede, belirli bir beceri seviyesinde yapilir. Bu bilgiler maliyet hesabi ve planlama icin zorunludur.",
            "dikkat": "Kullanici eklerken sifre politikasina dikkat: 12+ karakter zorunlu. Roller sisteme onceden tanimli gelebilir (Admin, Operator, Kalite) — yoksa once Ayarlar > Roller'den olusturun. Operasyon eklerken 'Setup Suresi' ve 'Calisma Suresi' alanlarini bos birakmayin — maliyet hesabi icin gerekli.",
            "nav": [
                "Ust menuden 'Ayarlar' yazan menuye tiklayin",
                "Acilan alt menuden 'Birimler' secin — birimler sayfasi acilir",
                "Sag ustte '+ Yeni' veya '+ Ekle' butonuyla yeni birim ekleyin",
                "Ayni menuden 'Kullanicilar' secin — kullanici listesi gelir",
                "'+ Yeni Kullanici' ile Operator ve Kaliteci ekleyin",
                "'Is Emri Adimlari' secin — operasyonlari ekleyin",
            ],
            "steps": [
                {"id": "1.1", "name": "Birimler", "screen": "Ayarlar > Birimler", "role": "ADMIN",
                 "screen_detail": "Ust menude 'Ayarlar' > acilan alt menude 'Birimler'. URL: /settings/units",
                 "action": "Sayfada mevcut birimleri kontrol edin. Adet, Kg, Metre, Litre, Takim olmalidir. Eksik varsa '+ Ekle' ile ekleyin.",
                 "expected": "Listede en az 5 birim gorunuyor: Adet, Kg, Metre, Litre, Takim",
                 "note": "Seed data ile otomatik gelmis olabilir — gelmediyse kendiniz ekleyin"},
                {"id": "1.2", "name": "Kullanicilar + Roller", "screen": "Ayarlar > Kullanicilar", "role": "ADMIN",
                 "screen_detail": "Ust menude 'Ayarlar' > 'Kullanicilar'. URL: /settings/users. '+ Yeni Kullanici' butonu sag ustte.",
                 "action": "2 kullanici ekleyin: (1) Mustafa Tornaci — mustafa@demircnc.com — Rol: Operator. (2) Mehmet Kaliteci — mehmet@demircnc.com — Rol: Kalite. Sifre her ikisi icin: Test1234!@#$",
                 "expected": "Listede 3 kullanici gorunur: Ahmet (Admin) + Mustafa (Operator) + Mehmet (Kalite).",
                 "note": "AS9100 ZORUNLU: Operatorun kendi isini kontrol etmesi yasaktir — bu yuzden ayri roller gereklidir"},
                {"id": "1.3", "name": "Operasyonlar (5 adet)", "screen": "Ayarlar > Is Emri Adimlari", "role": "ADMIN",
                 "screen_detail": "Ust menude 'Ayarlar' > 'Is Emri Adimlari'. URL: /settings/work-order-steps. '+ Yeni' ile ekleme yapin.",
                 "action": "5 operasyon ekleyin: OP10 CNC Torna (Setup:20dk, Run:8dk), OP20 CNC Freze (30dk/12dk), OP30 Taslama (15dk/5dk), OP40 Capak Alma (5dk/2dk), OP50 Final Kontrol (10dk/5dk)",
                 "expected": "5 operasyon listede. Her birinde makine, setup suresi, calisma suresi alanlari dolu."},
            ]
        },
        {
            "title": "FAZ 2: MAKINE, DEPO, KALIBRASYON",
            "dep": "Bagimlilk: FAZ 1 tamamlanmis olmali",
            "nedir": "Fabrikanin fiziksel altyapisi: CNC tezgahlari, depolari ve olcum aletleri. Makinelerin saat maliyeti uretim maliyet hesabinin temelidir. Kalibre olcum aletleri AS9100 zorunlulugudur.",
            "nedegildir": "Makine tanimi sadece ad ve kod degildir — saat ucreti ve setup ucreti girilmelidir yoksa maliyet hesabi yapilamaz. Kalibrasyon sadece ekipman tanimlamak degildir — her ekipmana kalibrasyon kaydi (sertifika, tarih, lab) girilmelidir.",
            "business": "Patron 'bu parca bize kaca mal oluyor?' dediginde cevap ancak makine saat maliyetleri bilinirse verilebilir. Kalibrasyon suresi gecmis aletle yapilan olcum gecersizdir — musteri tum partiyi reddedebilir.",
            "dikkat": "Makine eklerken 'Saat Ucreti' ve 'Setup Ucreti' alanlarini BOS BIRAKMAYIN — ileride maliyet hesabi 0 TL cikar. Kalibrasyon ekipmanina sertifika KAYDI girmeden gecmeyin — 'Uyumluluk: %100' gorunmezse eksik bir sey var.",
            "nav": [
                "Makineler: Ust menude 'Ayarlar' > 'Makineler' tiklayin",
                "'+ Yeni' ile 5 makine ekleyin — Ad, Kod, Saat Ucreti (TL/saat), Setup Ucreti alanlarini doldurun",
                "Depolar: Ust menude 'Stok' > 'Depolar' tiklayin — 2 depo ekleyin",
                "Kalibrasyon: Ust menude 'Kalite' > 'Kalibrasyon' tiklayin — 3 olcum aleti ekleyin",
                "Her alet icin satirdaki 'Kalibrasyon Kaydi' ikonuna tiklayin ve sertifika bilgilerini girin",
                "Genel Gider: Ust menude 'Uretim' > 'Maliyet Analizi' tiklayin — %25+%10+%8 girin",
            ],
            "steps": [
                {"id": "2.1", "name": "5 Makine", "screen": "Ayarlar > Makineler", "role": "ADMIN",
                 "screen_detail": "Ust menude 'Ayarlar' > 'Makineler'. URL: /settings/machines",
                 "action": "T01 Doosan Torna (400 TL/s), T02 Mazak Torna (420 TL/s), F01 Haas Freze (500 TL/s), F02 Haas Freze (520 TL/s), TAS Okamoto Taslama (350 TL/s)",
                 "expected": "5 makine listede, saat ucretleri dogru girilmis"},
                {"id": "2.2", "name": "2 Depo", "screen": "Stok > Depolar", "role": "ADMIN",
                 "screen_detail": "Ust menude 'Stok' > 'Depolar'. URL: /warehouses",
                 "action": "DEPO-HAM: Hammadde Deposu + DEPO-MAM: Mamul Deposu",
                 "expected": "2 depo listede gorunuyor"},
                {"id": "2.3", "name": "3 Kalibrasyon Ekipmani", "screen": "Kalite > Kalibrasyon", "role": "ADMIN",
                 "screen_detail": "Ust menude 'Kalite' > 'Kalibrasyon'. URL: /quality/calibration",
                 "action": "MIK-01 Mikrometre (0.001mm), KAL-01 Kumpas (0.01mm), UC-01 Uc Olcer. Her birine sertifika kaydi girin.",
                 "expected": "Dashboard'da 'Uyumluluk: %100' gostergesi gorunuyor"},
                {"id": "2.4", "name": "Genel Gider %43", "screen": "Uretim > Maliyet Analizi", "role": "ADMIN",
                 "screen_detail": "Ust menude 'Uretim' > 'Maliyet Analizi'. URL: /production/part-cost",
                 "action": "3 genel gider kalemi ekleyin: Genel Imalat Giderleri %25, Amortisman %10, Enerji %8",
                 "expected": "Toplam %43 genel gider gorunuyor"},
            ]
        },
        {
            "title": "FAZ 3: MUSTERI, TEDARIKCI, URUN",
            "dep": "Bagimlilk: FAZ 2 tamamlanmis olmali",
            "nedir": "Is yapilan musteriler, malzeme alinan tedarikciler ve uretilecek urunler. Urun tanimi BOM (malzeme listesi) ve kontrol plani ile tamamlanir. Kontrol plani her operasyonda hangi olcunun, hangi toleransla, hangi aletle kontrol edilecegini belirler.",
            "nedegildir": "Musteri sadece firma bilgisi degildir — odeme vadesi ve doviz cinsi belirtilmelidir. Urun sadece ad/kod degildir — kalite kontrol gereksinimleri (lot takip, seri takip) isaretlenmelidir.",
            "business": "Savunma sanayinde musteri (TAI, ASELSAN) parcayi kontrol plani olmadan kabul etmez. Kontrol planindaki her olcu, tolerans ve olcum aleti belgelenmelidir. Bu AS9100 madde 8.5.1.1 gereksinimidir.",
            "dikkat": "KRITIK: Urunler sayfasi ve Stok sayfasi FARKLI tip kullanir! Urunler sayfasinda gorunmesi icin tip PRODUCTION_MATERIAL secilmeli. Stok sayfasinda gorunmesi icin ayni urun STOCK tipinde ayrica eklenmeli. Bu iki farkli kayittir — birini eklemeyi unutmayin. Kontrol planini AKTIF yapmadan kalite kontrolu calismaz.",
            "nav": [
                "Musteri: Ust menude 'Satis' > 'Musteriler' tiklayin. '+ Yeni Musteri' ile ekleyin",
                "Tedarikci: AYNI sayfada yeni kayit eklerken 'Tedarikci mi?' kutusunu isaretleyin",
                "Urunler: Ust menude 'Stok' > 'Urunler' tiklayin. '+ Yeni Urun' ile ekleyin — tip: PRODUCTION_MATERIAL",
                "Stok Kartlari: Ust menude 'Stok' > 'Stok' tiklayin — AYNI urunleri STOCK tipinde tekrar ekleyin",
                "Kontrol Plani: 'Kalite' > 'Kontrol Planlari' tiklayin. Plan olusturun, 4 kalem ekleyin, AKTIF yapin",
            ],
            "steps": [
                {"id": "3.1", "name": "Musteri (ASELSAN)", "screen": "Satis > Musteriler", "role": "ADMIN",
                 "screen_detail": "Ust menude 'Satis' > 'Musteriler'. URL: /customers. '+ Yeni Musteri' butonu sag ustte.",
                 "action": "Firma: ASELSAN A.S. | Yetkili: Ali Savunma | Email: ali@aselsan.com.tr | Vergi No: 9876543210 | Vade: 45 gun | Doviz: TRY",
                 "expected": "Musteri listesinde ASELSAN gorunuyor"},
                {"id": "3.2", "name": "Tedarikciler (2 adet)", "screen": "Satis > Musteriler (Tedarikci)", "role": "ADMIN",
                 "screen_detail": "Ayni Musteriler sayfasinda. Yeni kayit eklerken 'Tedarikci' secenegini isaretleyin.",
                 "action": "(1) Ankara Celik Depo — Tedarikci. (2) Yilmaz Isil Islem San. — Fason Tedarikci",
                 "expected": "2 tedarikci listede gorunuyor",
                 "note": "Tedarikci ve Musteri ayni sayfada tutulur — sadece tip farki vardir"},
                {"id": "3.3", "name": "Urunler (Hammadde + Mamul)", "screen": "Stok > Urunler", "role": "ADMIN",
                 "screen_detail": "Ust menude 'Stok' > 'Urunler'. URL: /products. '+ Yeni Urun' butonu.",
                 "action": "(1) St37 Celik Cubuk — Hammadde, PRODUCTION_MATERIAL, 85 TL. (2) ASELSAN Konnektor Pimi ASL-K7 — Mamul, PRODUCTION_MATERIAL, 45 TL, Kalite Kontrol: Evet, Lot Takip: Evet",
                 "expected": "Urunler sayfasinda 2 urun gorunuyor"},
                {"id": "3.4", "name": "Stok Kartlari", "screen": "Stok > Stok", "role": "ADMIN",
                 "screen_detail": "Ust menude 'Stok' > 'Stok'. URL: /stocks. Dikkat: Urunler'den farkli sayfa!",
                 "action": "Ayni 2 urunu bu kez STOCK tipinde ekleyin: STK-ST37-030200 ve STK-ASL-PIN-001",
                 "expected": "Stok sayfasinda 2 stok karti gorunuyor",
                 "note": "URUNLER sayfasi = PRODUCTION_MATERIAL tipi. STOK sayfasi = STOCK tipi. Ikisi farkli!"},
                {"id": "3.5", "name": "Kontrol Plani (4 kalem)", "screen": "Kalite > Kontrol Planlari", "role": "ADMIN",
                 "screen_detail": "Ust menude 'Kalite' > 'Kontrol Planlari'. URL: /quality/control-plans",
                 "action": "Plan olusturun (KP-ASL-K7-001), 4 olcum noktasi ekleyin (Dis Cap, Boy, Kama, h6), AKTIF yapin",
                 "expected": "Kontrol plani ACTIVE durumunda, 4 kalem, 3 tanesi KRITIK isaretli"},
            ]
        },
        {
            "title": "FAZ 4: MALZEME TEDARIK",
            "dep": "Bagimlilk: FAZ 3 tamamlanmis olmali",
            "nedir": "Uretim icin gerekli hammaddenin satin alinmasi, depoya girisi, kalite kontrolu ve sertifikalanmasi. Giris muayenesi malzemenin spesifikasyona uygunlugunu dogrular. Sertifika (MTR, CoC) malzemenin kimligini kanitlar.",
            "nedegildir": "Sadece depo giris fisi kesmek yetmez — malzeme sertifikasi ve giris muayenesi zorunludur. Sertifikasiz malzeme ile uretim yapilamaz (AS9100 8.4.2).",
            "business": "7075-T6 aluminyum veya St37 celik aldiginizda tedarikci size MTR (Mill Test Report = Malzeme Test Raporu) verir. Bu belgede malzemenin kimyasal bilesimi ve mekanik ozellikleri yazar. 20 yil sonra bile 'bu parcada hangi malzeme kullanildi?' sorusuna cevap verebilmelisiniz.",
            "dikkat": "Stok girisi yaparken DEPO secmeyi unutmayin — depoya girmeden muayene yapamazsiniz. Miktar 550 olarak girilecek (500 siparis + %10 fire payi). Giris muayenesi ve sertifika farkli adimlardir — muayene PASS olsa bile sertifika ayrica yuklenmelidir.",
            "nav": [
                "Stok Girisi: 'Stok' > 'Giris/Cikis' tiklayin. '+ Yeni' ile fis olusturun",
                "Depo olarak 'Hammadde Deposu'nu secin, belge no girin (IRS-2026-001)",
                "Kalem ekleyin: Urun secin, miktar ve birim fiyat girin. Kaydedin.",
                "Muayene: 'Kalite' > 'Giris Kontrol' tiklayin. '+ Yeni Muayene' ile kayit olusturun",
                "Urun, tedarikci, lot no, miktar, sonuc (GECTI) girin",
                "Sertifika: Muayene satirindaki kalkan/kilit ikonuna tiklayin — sertifika ekleme paneli acilir",
                "MTR ve CoC sertifikalarini girin (no, tip, tarih)",
            ],
            "steps": [
                {"id": "4.1", "name": "Stok Girisi (550 adet)", "screen": "Stok > Giris/Cikis", "role": "ADMIN",
                 "screen_detail": "Ust menude 'Stok' > 'Giris/Cikis'. '+ Yeni' butonu ile yeni fis olusturun.",
                 "action": "Depo: Hammadde Deposu | Belge No: IRS-2026-001 | Kalem: St37 Cubuk x 550 adet x 85 TL",
                 "expected": "Stok sayfasinda hammadde 550 adet gorunuyor"},
                {"id": "4.2", "name": "Giris Muayenesi", "screen": "Kalite > Giris Kontrol", "role": "ADMIN",
                 "screen_detail": "Ust menude 'Kalite' > 'Giris Kontrol'. URL: /quality/inspections",
                 "action": "Urun: St37 | Tedarikci: Ankara Celik | Lot No: ST37-LOT-2026-001 | 550 adet | Sonuc: GECTI",
                 "expected": "Muayene kaydi PASS durumunda"},
                {"id": "4.3", "name": "Sertifikalar (MTR + CoC)", "screen": "Giris Kontrol > Sertifika ikonu", "role": "ADMIN",
                 "screen_detail": "Muayene listesinde ilgili satirda kalkan/kilit ikonu var — ona tiklayin. Sag taraftan panel acilir.",
                 "action": "(1) ACD-MTR-2026-001 — MTR (Mill Test Report). (2) ACD-COC-2026-001 — CoC (Uygunluk Sertifikasi)",
                 "expected": "2 sertifika muayene kaydina bagli gorunuyor"},
            ]
        },
        {
            "title": "FAZ 5: TEKLIF ve SIPARIS",
            "dep": "Bagimlilk: FAZ 3 tamamlanmis olmali",
            "nedir": "Musteriye fiyat teklifi verilmesi ve kabul edilince siparise donusturulmesi. Teklif-siparis donusumu otomatiktir — teklif kalemi siparis kalemine aktarilir.",
            "nedegildir": "Teklif vermek siparis almak demek degildir. Teklif KABUL EDILMEDEN siparis olusturulamaz. Ayrica siparis dogrudan onaylanamaz — once 'Onay Talep Et' yapilmalidir (AS9100 sozlesme gozden gecirme).",
            "business": "Savunma firmalarinda teklif sureci: (1) Musteri cizim gonderir, (2) Maliyet hesaplanir, (3) Fiyat teklif edilir, (4) Musteri onaylar (PO gonderir), (5) Siparis sisteme girilir. Her asamanin izlenebilir olmasi zorunludur.",
            "dikkat": "Teklif olusturma 2 adimda calisir: ONCE teklif basligini kaydedin, SONRA kalem (urun) ekleyin. Tek seferde kayit yapamazsiniz. Teklifi 'KABUL EDILDI' yapmadan 'Siparis Olustur' butonu gorunmez.",
            "nav": [
                "'Satis' > 'Teklifler' tiklayin. '+ Yeni Teklif' butonu ile baslayin",
                "Once baslik bilgilerini girin (musteri, tarih, aciklama) ve KAYDEDIN",
                "Kaydettikten sonra acilan detay sayfasinda '+ Kalem Ekle' ile urun/miktar/fiyat girin",
                "Teklifler listesine donun, teklifinizi bulun",
                "Durum butonlarindan 'KABUL EDILDI' secin",
                "'Siparis Olustur' butonu gorunecek — tiklayin",
                "'Satis' > 'Satislar' sayfasinda siparisi kontrol edin",
            ],
            "steps": [
                {"id": "5.1", "name": "Teklif Olustur", "screen": "Satis > Teklifler", "role": "ADMIN",
                 "screen_detail": "Ust menude 'Satis' > 'Teklifler'. URL: /offers/form. '+ Yeni Teklif' sag ustte.",
                 "action": "Musteri: ASELSAN | Kalem: Konnektor Pimi x 500 adet x 45 TL = 22,500 TL",
                 "expected": "Teklif numarasi otomatik atanir (T2026-XXXXX formatinda)"},
                {"id": "5.2", "name": "Teklif Kabul + Siparis", "screen": "Teklifler listesi", "role": "ADMIN",
                 "screen_detail": "Teklifler listesinde olusturdugumuz teklifi bulun ve tiklayin.",
                 "action": "Durum: KABUL EDILDI yap → 'Siparis Olustur' butonuna tikla",
                 "expected": "Satislar sayfasinda yeni siparis gorunuyor (S2026-XXXXX)"},
            ]
        },
        {
            "title": "FAZ 6: IS EMRI SABLONU",
            "dep": "Bagimlilk: FAZ 1.3 (Operasyonlar) + FAZ 2.1 (Makineler)",
            "nedir": "Bir urunun hangi operasyonlardan gececegini, hangi sirayla, hangi makinede, ne kadar surede islenecegini belirleyen sablon. Her parca tipi icin bir sablon tanimlanir ve tekrar tekrar kullanilir. Buna 'routing' (operasyon rotasi) denir.",
            "nedegildir": "Sablon her siparis icin yeniden olusturulmaz. Bir kez tanimlanir, her uretim emrinde bu sablon secilir. Sablon, IS EMRI degildir — sablondan is emri OLUSTURULUR.",
            "business": "Savunma parcalarinda 'routing' AS9100'de belgelenmesi zorunlu olan bir bilgidir. Her operasyonda kim, hangi makinede, ne kadar surede, hangi takimla calistigi kayit altina alinir. Musteri 'bu parcayi nasil urettiniz?' diye sordugunda bu sablona bakilir.",
            "dikkat": "Sablona adim eklerken SIRALAMA cok onemlidir — OP10 her zaman ilk olmali. 'Onkosul' (prerequisite) baglantisini dogru kurun: OP20 baslamadan once OP10 tamamlanmis olmali. Bu baglanti yapilmazsa paralel uretim olur — savunma parcasinda bu kabul edilmez.",
            "nav": [
                "'Ayarlar' > 'Is Emri Sablonlari' tiklayin",
                "'+ Yeni Sablon' ile sablon adi girin (ASL-K7 Konnektor Pimi Operasyon Sirasi)",
                "Adim ekleme alanindan OP10, OP20, OP30, OP40, OP50 sirasi ile ekleyin",
                "Her adima makine, sure ve kalite kontrol gereksinimi girin",
                "Onkosul (prerequisite) alaninda bir onceki adimi secin: OP20 icin OP10, OP30 icin OP20...",
            ],
            "steps": [
                {"id": "6.1", "name": "5 Adimli Sablon", "screen": "Ayarlar > Is Emri Sablonlari", "role": "ADMIN",
                 "screen_detail": "Ust menude 'Ayarlar' > 'Is Emri Sablonlari'. URL: /settings/work-order-templates",
                 "action": "OP10 Torna → OP20 Freze → OP30 Taslama → OP40 Capak → OP50 Final. Her adima prerequisite baglantisi",
                 "expected": "5 adimli sablon goruntuleniyor, sirasi dogru, onkosullar bagli"},
            ]
        },
        {
            "title": "FAZ 7: SIPARIS ONAY ve URETIM EMRI",
            "dep": "Bagimlilk: FAZ 5 (Siparis) + FAZ 6 (Sablon)",
            "nedir": "Siparisin 3 adimli onay surecinden gecirilmesi ve uretim emrine donusturulmesi. Bu 3 adim: (1) Onay Talep Et — 'Bu siparisi uretmek istiyorum', (2) Onayla — 'Malzeme ve kapasite uygun, basla', (3) Uretime Aktar — Uretim emri olusturulur.",
            "nedegildir": "Siparis dogrudan uretime aktarilamaz — once onay sureci tamamlanmalidir. Bu, bir siparisin kontrol edilmeden uretime alinmasini engeller.",
            "business": "Savunma sanayinde her siparis icin malzeme uygunlugu, kapasite kontrolu, ozel proses gereksinimleri ve musteri ozel kosullari gozden gecirilir. Bu 'sozlesme gozden gecirme' (AS9100 8.2.3) adimidir. Patron 'aldik siparisi hemen basla' diyemez — once kontrol sart.",
            "dikkat": "SIRA COK ONEMLI: 'Onay Talep Et' > 'Onayla' > 'Uretime Aktar'. Direkt 'Onayla' tiklamayin — once 'Onay Talep Et' yapilmali. Uretime aktardiktan sonra Is Emri atanmadan uretim ekraninda bir sey gorunmez — FAZ 7.2'yi ATLAMAMAYIN.",
            "nav": [
                "'Satis' > 'Satislar' tiklayin — siparis listesini gorun",
                "Olusturdugumuz siparisi tiklayin — detay sayfasi acilir",
                "Sag panelde veya ust kisimdaki butonlardan 'Onay Talep Et' tiklayin",
                "Ardindan 'Onayla' butonuna tiklayin (yetkili kisi olarak)",
                "'Uretime Aktar' butonuna tiklayin — uretim emri olusturulur",
                "'Uretim' > 'Uretim Emirleri' sayfasinda yeni emri gorun",
                "Uretim emri detayinda 'Is Emri Olustur' > sablon secin (ASL-K7)",
            ],
            "steps": [
                {"id": "7.1", "name": "3 Adimli Onay", "screen": "Satis > Satislar > detay", "role": "ADMIN",
                 "screen_detail": "Satislar listesinde siparisi tiklayin. Detay sayfasinda ust kisimda durum butonlari goreceksiniz.",
                 "action": "Onay Talep Et → Onayla → Uretime Aktar (3 butona sirasi ile tiklayin)",
                 "expected": "Uretim emri olusturuldu mesaji. Siparis durumu: URETIMDE",
                 "note": "AS9100 8.2.3: Sozlesme gozden gecirme zorunlu — direkt onay yok"},
                {"id": "7.2", "name": "Is Emri Atama", "screen": "Uretim > Uretim Emri detay", "role": "ADMIN",
                 "screen_detail": "Ust menude 'Uretim' > 'Uretim Emirleri'. Yeni emri tiklayin. Sag panelde 'Is Emri Olustur' butonu.",
                 "action": "'Is Emri Olustur' tikla → acilan pencereden ASL-K7 sablonunu sec",
                 "expected": "Uretim Durumu sekmesinde 5 operasyon adimi gorunuyor (OP10-OP50)"},
            ]
        },
        {
            "title": "FAZ 8: ATOLYE TERMINALI",
            "dep": "Bagimlilk: FAZ 7 tamamlanmis olmali",
            "nedir": "Operatorun tablet veya bilgisayar basinda kullandigi uretim ekrani. Is baslatma, durdurma (neden secimli), tamamlama ve olcum girisi yapilir. Kaliteci AYRI bir ekrandan (Operasyon Muayeneleri) kalite onayini verir.",
            "nedegildir": "Kalite onayini OPERATOR vermez — ayri bir KALITECI verir. Bu AS9100'un en temel kurallarindan biridir: kendi isini kendin kontrol etme yasagi. Operator olcum girer, kaliteci onaylar/reddeder.",
            "business": "CNC tezgahinin basindaki operator siradaki isi gorur, BASLAT der, parca isler, TAMAMLA der. Durma olursa (takim kiridi, malzeme bitti, mola, ariza) DURDUR'a basar ve nedenini secer. Bu veri OEE (makine verimliligi) hesabi icin kritiktir — patron 'neden %60 verimlilik?' sorusunun cevabini buradan bulur.",
            "dikkat": "BU FAZDA KULLANICI DEGISIKLIGI GEREKIR! Operator adimlari icin mustafa@demircnc.com ile, kalite onay adimlari icin mehmet@demircnc.com ile giris yapilmali. Admin ile girerseniz terminal bos gorunebilir. DURDUR durumundayken miktar degistirmeye calismayin — kontroller devre disi olur. Onceki operasyonun kalite onayini almadan sonraki operasyonu baslatamazsiniz.",
            "nav": [
                "ONCE: Sag ustteki profil ikonundan 'Cikis Yap' tiklayin",
                "Login sayfasinda mustafa@demircnc.com / Test1234!@#$ ile giris yapin",
                "'Uretim' > 'Atolye Terminali' tiklayin (operator sadece bunu gorebilir)",
                "Sag panelde 'Is Emirleri' listesinden OP10'u secin",
                "BASLAT butonuna basin — zamanlayici baslar, buton DURDUR olur",
                "DURDUR'a basin — neden secim modali acilir (Takim Degisimi, Mola, Ariza vb.)",
                "Neden secip 'Durdur' tiklayin — buton DEVAM ET olur",
                "DEVAM ET tiklayin — zamanlayici devam eder",
                "Miktar girin (500), TAMAMLA tiklayin — olcum modali acilir",
                "Olculeri girin (6.005, 34.98 vb.) — yesil/kirmizi gostergeler calisir",
                "'Olcumleri Kaydet & Tamamla' tiklayin",
                "SIMDI: Cikis yapin, mehmet@demircnc.com ile giris yapin (Kaliteci)",
                "'Kalite' > 'Operasyon Muayeneleri' tiklayin — OP10 'Bekliyor' olarak gorunecek",
                "'Onayla' butonuna tiklayin — not girin — onaylayin",
                "OP10 'Onaylandi' olarak gorunecek — artik Operator OP20'yi baslatabilir",
                "Her operasyon icin Operator/Kaliteci dongusu tekrarlanir (OP20-OP50)",
            ],
            "steps": [
                {"id": "8.1", "name": "Operator Girisi", "screen": "/login", "role": "OPERATOR",
                 "screen_detail": "Once mevcut kullanicidan CIKIS yapin (sag ust profil ikonu > Cikis Yap). Login sayfasinda Operator bilgileriyle giris yapin.",
                 "action": "mustafa@demircnc.com / Test1234!@#$ ile giris yap",
                 "expected": "Sadece Uretim ve Atolye Terminali menuleri gorunuyor — diger menuler gizli"},
                {"id": "8.2", "name": "OP10 CNC Torna", "screen": "Uretim > Atolye Terminali", "role": "OPERATOR",
                 "screen_detail": "Ust menude 'Uretim' > 'Atolye Terminali'. URL: /shop-floor-terminal. Sag tarafta is emri listesi goreceksiniz.",
                 "action": "OP10'u sec → BASLAT → DURDUR (neden: Takim Degisimi) → DEVAM ET → 500 adet gir → TAMAMLA → Olcumleri gir (Dis Cap: 6.005, Boy: 34.98)",
                 "expected": "Is emri no: OP10 (GUID degil). Zamanlayici calisiyor. Durus nedeni modal acildi. Olcum modali yesil gostergeler.",
                 "note": "DURDUR durumundayken kontroller devre disi — miktar degistiremezsiniz, bu dogru bir davranistir"},
                {"id": "8.3", "name": "Kalite Onay (OP10)", "screen": "Kalite > Op. Muayeneleri", "role": "KALITECI",
                 "screen_detail": "ONCE: Operator'den CIKIS yapin. mehmet@demircnc.com ile giris yapin. 'Kalite' > 'Operasyon Muayeneleri'.",
                 "action": "OP10 'Bekliyor' olarak gorunmeli → 'Onayla' tikla → Not gir → Onayla",
                 "expected": "OP10 'Onaylandi' (yesil). OP20 artik baslatilabilir.",
                 "note": "AS9100 8.6: Gorev ayrimi — Operator kendi isini kontrol edemez, Kaliteci onaylar"},
                {"id": "8.4", "name": "OP20-OP50 Tekrari", "screen": "Terminal + Kalite", "role": "OPERATOR",
                 "screen_detail": "Her operasyon icin: Operator ile giris > BASLAT/TAMAMLA > Kaliteci ile giris > Onayla. OP40 Capak icin kalite onay gerekmez.",
                 "action": "OP20 Freze, OP30 Taslama, OP40 Capak (kalite yok), OP50 Final — her biri icin 8.2+8.3 tekrari",
                 "expected": "5/5 operasyon tamamlandi. Tum kalite onaylari verildi.",
                 "note": "OP40 Capak Alma'da kalite kontrol yok — direkt tamamlanir. Diger 4 operasyonda Kaliteci onay sart."},
            ]
        },
        {
            "title": "FAZ 9: KALITE OLAYLARI",
            "dep": "Bagimlilk: FAZ 8 tamamlanmis olmali",
            "nedir": "Uretim sirasinda veya sonrasinda tespit edilen sorunlarin yonetimi. NCR (Uygunsuzluk Raporu) sorunun kaydedilmesi, CAPA (Duzeltici Faaliyet) cozumun planlanmasi, FAI (Ilk Parca Muayenesi) yeni bir parcenin ilk kez tum boyutlariyla olculup onaylanmasidir.",
            "nedegildir": "NCR acmak problem degildir — acilmayan NCR problemdir. Her uygunsuzluk kayit altina alinmalidir. NCR kok neden girilmeden kapatilamaz. CAPA sadece NCR'ye bagli degildir — musteri sikayetinden de acilabiilr. FAI sadece olcum degildir — tum boyutlarin resmi olarak belgelenmesidir.",
            "business": "Savunma sanayinde uygunsuz parcalar asla sevk edilemez. Her sorun NCR ile belgelenir, kok neden analizi yapilir (5 Neden, Balik Kilcigi), duzeltici ve onleyici aksiyon alinir. FAI raporu (AS9102 formati) yeni her parca icin zorunludur — musteri FAI'yi onaylamadan seri uretim yapilmaz.",
            "dikkat": "NCR status akisi SIRALI calisir — atlama yapamazsiniz: OPEN → UNDER_REVIEW → CORRECTIVE_ACTION → CLOSED. Her adimda ilgili alani doldurun. Kok neden alani BOS birakilirsa NCR kapatilamaz. FAI karakteristiklerini tek tek gireceksiniz — toplu ekleme yok.",
            "nav": [
                "NCR: 'Kalite' > 'Uygunsuzluk (NCR)' tiklayin. '+ Yeni NCR' ile acin",
                "Siddet, urun, etkilenen miktar, tanim girin. Kaydedin.",
                "NCR detayinda status butonlarini sirasi ile tiklayin: OPEN → UNDER_REVIEW → CORRECTIVE → CLOSED",
                "Her adimda ilgili alani doldurun (kok neden, duzeltici aksiyon, onleyici aksiyon)",
                "CAPA: 'Kalite' > 'CAPA' tiklayin. Kaynak olarak NCR'yi secin",
                "FAI: 'Kalite' > 'FAI' tiklayin. Yeni FAI olusturun, 5 karakteristik tek tek girin, onayin",
            ],
            "steps": [
                {"id": "9.1", "name": "NCR (Uygunsuzluk)", "screen": "Kalite > Uygunsuzluk", "role": "ADMIN",
                 "screen_detail": "Ust menude 'Kalite' > 'Uygunsuzluk (NCR)'. URL: /quality/ncr. '+ Yeni NCR' ile acin.",
                 "action": "Siddet: MINOR | Urun: Konnektor Pimi | 3 adet etkilenmis | Tanim: OP30 taslama tolerans disi | Workflow: OPEN→REVIEW→CORRECTIVE→CLOSED | Kok Neden: Taslik asinma",
                 "expected": "NCR CLOSED durumunda, kok neden ve aksiyonlar girilmis"},
                {"id": "9.2", "name": "CAPA", "screen": "Kalite > CAPA", "role": "ADMIN",
                 "screen_detail": "Ust menude 'Kalite' > 'CAPA'. URL: /quality/capa. '+ Yeni CAPA' ile olusturun.",
                 "action": "Tip: Duzeltici | Kaynak: NCR | Kok Neden: Taslik asinma | Aksiyon: Bakim planina ekleme",
                 "expected": "CAPA olusturuldu ve NCR'ye bagli"},
                {"id": "9.3", "name": "FAI (Ilk Parca)", "screen": "Kalite > FAI", "role": "ADMIN",
                 "screen_detail": "Ust menude 'Kalite' > 'FAI'. URL: /quality/fai. '+ Yeni FAI' ile olusturun.",
                 "action": "5 karakteristik girin: Dis Cap 6.005, Boy 34.98, Kama 2.010, h6 5.995, Sertlik 60.5 — hepsi GECTI. Onayla.",
                 "expected": "FAI APPROVED durumunda, 3 Key Characteristic isaretli, PDF indirilebilir"},
            ]
        },
        {
            "title": "FAZ 10: FASON IS",
            "dep": "Bagimlilk: FAZ 3 tamamlanmis olmali",
            "nedir": "Firmanin kendi yapamadigi islemlerin disariya yaptirmasi: isil islem, kaplama, NDT (tahribatsiz muayene) gibi. Parcalar fason firmaya gonderilir, islem yapilir, geri gelir ve muayene edilir.",
            "nedegildir": "Fason is sadece 'disariya gonderme' degildir — parcalarin gidis/donus takibi, fason firmanin sertifikasi ve donus muayenesi zorunludur. Fason siparisi olusturmak fisiki gonderi anlamina gelmez.",
            "business": "Isil islem, kaplama, NDT gibi 'ozel prosesler' NADCAP sertifikali firmalarda yaptirilir. Her fason islem icin tedarikci sertifikasi ve proses raporu alinir.",
            "dikkat": "Fason tedarikci FAZ 3.2'de eklenmis olmali — eklenmemisse bu adim calismaz. Status akisi: TASLAK → GONDERILDI → TEDARIKCIDE → TAMAMLANDI → MUAYENE.",
            "nav": [
                "'Uretim' > 'Fason Is Emirleri' tiklayin",
                "'+ Yeni' ile siparis olusturun",
                "Tedarikci (Yilmaz Isil Islem), proses tipi (HEAT_TREATMENT), adet, fiyat girin",
                "Status butonlari ile akisi takip edin",
            ],
            "steps": [
                {"id": "10.1", "name": "Fason Siparis", "screen": "Uretim > Fason Emirleri", "role": "ADMIN",
                 "screen_detail": "Ust menude 'Uretim' > 'Fason Is Emirleri'. URL: /subcontract-orders",
                 "action": "Tedarikci: Yilmaz Isil Islem | Proses: Isil Islem | 500 adet x 3 TL | 5 is gunu",
                 "expected": "Fason siparis listede, status workflow calisiyor, geri sayim badge gorunuyor"},
            ]
        },
        {
            "title": "FAZ 11: FATURA ve ODEME",
            "dep": "Bagimlilk: FAZ 5 tamamlanmis olmali",
            "nedir": "Musteriye kesilen satis faturasi, tedarikciden alinan alis faturasi ve odemelerin takibi. Fatura once TASLAK olusturulur, sonra GONDERILDI yapilir, odeme alindikca ODENDI durumuna gecer.",
            "nedegildir": "TASLAK faturaya odeme yapilamaz — once GONDERILDI yapilmalidir. Fatura kesilmesi sevkiyat yapildi demek degildir — bunlar ayri surecleridir.",
            "business": "Savunma firmalarinda odeme vadeleri 45-90 gun arasindadir. Vade takibi nakit akisi yonetimi icin kritiktir. Her faturada musteri PO numarasi belirtilmelidir.",
            "dikkat": "EN SIK HATA: Taslak faturaya odeme eklemeye calismak → 'Taslak durumundaki faturaya odeme yapilamaz' hatasi alirsiniz. Once faturanin durumunu GONDERILDI yapin, sonra odeme ekleyin.",
            "nav": [
                "'Faturalar' menusunden 'Satis Faturasi' tiklayin. '+ Yeni Fatura' ile baslayin",
                "Musteri secin, kalem ekleyin (urun, miktar, birim fiyat, KDV orani)",
                "Kaydedin — fatura TASLAK durumunda olusur, fatura no otomatik atanir",
                "Fatura durumunu 'GONDERILDI' yapin (durum butonu/dropdown'dan)",
                "Ardindan 'Odeme Ekle' ile 15,000 TL Nakit + 12,000 TL Havale girin",
                "Alis faturasi icin de ayni adimlar — 'Alis Faturasi' sekmesinden",
            ],
            "steps": [
                {"id": "11.1", "name": "Satis Faturasi", "screen": "Faturalar", "role": "ADMIN",
                 "screen_detail": "Ust menude 'Faturalar'. URL: /invoices/form. '+ Yeni Fatura' tiklayin.",
                 "action": "Musteri: ASELSAN | 500 x 45 TL + %20 KDV = 27,000 TL",
                 "expected": "Fatura no atandi, toplam 27,000 TL dogru"},
                {"id": "11.2", "name": "Gonder + Ode", "screen": "Fatura detay", "role": "ADMIN",
                 "screen_detail": "Fatura detay sayfasinda durumu GONDERILDI yapin, sonra odeme alanina gecin.",
                 "action": "Durum: GONDERILDI yap → 15,000 TL Nakit ode + 12,000 TL Havale ode",
                 "expected": "Fatura durumu: ODENDI. Cari bakiye: 0 TL"},
                {"id": "11.3", "name": "Alis Faturasi", "screen": "Faturalar (Alis)", "role": "ADMIN",
                 "screen_detail": "Faturalar sayfasinda 'Alis Faturasi' sekmesine gecin.",
                 "action": "Tedarikci: Ankara Celik Depo | 550 x 85 TL + KDV = 56,100 TL",
                 "expected": "Alis faturasi listede gorunuyor"},
            ]
        },
        {
            "title": "FAZ 12: BAKIM",
            "dep": "Bagimlilk: FAZ 2 tamamlanmis olmali",
            "nedir": "Makine bakim planlarinin tanimlanmasi ve takibi. Onleyici (preventive) bakim duzenli aralklarla yaglama, filtre degisimi gibi islemlerdir. Ariza (corrective) bakim bozulma sonrasi yapilir.",
            "nedegildir": "Bakim plani sadece hatirlatma degildir — is emrine donusturulur, yapilan islem kaydedilir, maliyet takip edilir. Bakim is emri, uretim is emrinden farklidir.",
            "business": "CNC tezgahlarinda duzenli bakim yapilmazsa hassasiyet kaybedilir. Bir tezgahin h6 tolerans (13 mikron) tutmasi icin geometrisi duzenli kontrol edilmelidir. Bakim kayitlari OEE hesabi ve AS9100 denetimi icin gereklidir.",
            "dikkat": "Bakim plani olusturmak otomatik is emri olusturmaz — plan detayinda 'Is Emri Olustur' butonuna tiklamaniz gerekir.",
            "nav": [
                "'Bakim' > 'Bakim Planlari' tiklayin",
                "'+ Yeni Plan' ile makine secin, frekans (haftalik), tahmini sure, tip (ONLEYICI) girin",
                "Plan detayinda 'Is Emri Olustur' tiklayin",
                "Olusturulan is emrini tamamlayin",
            ],
            "steps": [
                {"id": "12.1", "name": "Bakim Plani", "screen": "Bakim > Planlar", "role": "ADMIN",
                 "screen_detail": "Ust menude 'Bakim' > 'Bakim Planlari'.",
                 "action": "Makine: CNC-01 (T01) | Haftalik Yaglama | ONLEYICI | 1 saat",
                 "expected": "Bakim plani listede gorunuyor"},
                {"id": "12.2", "name": "Bakim Is Emri", "screen": "Plan detay", "role": "ADMIN",
                 "screen_detail": "Bakim plani detay sayfasinda 'Is Emri Olustur' butonu.",
                 "action": "Is Emri Olustur → Tamamla",
                 "expected": "Bakim is emri tamamlandi olarak gorunuyor"},
            ]
        },
        {
            "title": "FAZ 13: IK ve VARDIYA",
            "dep": "Bagimlilk: FAZ 1 tamamlanmis olmali",
            "nedir": "Personel vardiya planlama, devam takibi (giris/cikis) ve izin yonetimi. Operator hangi vardiyada calistiginin kaydedilmesi uretim planlama ve maliyet icin gereklidir.",
            "nedegildir": "Bu tam bir IK (Insan Kaynaklari) modulu degildir — maas hesaplama, SGK bildirimi gibi islemler yoktur. Temel vardiya, devam ve izin takibi yapilir.",
            "business": "CNC atolyesinde genellikle 2-3 vardiya calisilir. Hangi operatorun hangi makinede ne kadar calistiginin kaydi, iscilik maliyeti hesabi ve AS9100 yetkinlik takibi icin gereklidir.",
            "dikkat": "Vardiya saatleri mantikli olmali — 06:00-14:00 (8 saat). Mola suresi vardiya suresine dahildir. Izin talebi olusturmak otomatik onay demek degildir — yetkili kisinin onaylamasi gerekir.",
            "nav": [
                "'IK & Vardiya' menusunden 'Vardiya' tiklayin — yeni vardiya tanimlayin",
                "'Devam Takibi' sayfasindan giris/cikis kaydi olusturun",
                "'Izin' sayfasindan yillik izin talebi yapin ve onaylayin",
            ],
            "steps": [
                {"id": "13.1", "name": "Vardiya", "screen": "IK > Vardiya", "role": "ADMIN",
                 "screen_detail": "Ust menude 'IK & Vardiya' > 'Vardiya'.",
                 "action": "Sabah Vardiyasi: 06:00-14:00, mola 30dk",
                 "expected": "Vardiya tanimli ve listede gorunuyor"},
                {"id": "13.2", "name": "Devam Takibi", "screen": "IK > Devam", "role": "ADMIN",
                 "screen_detail": "Ust menude 'IK & Vardiya' > 'Devam Takibi'.",
                 "action": "Personel secin, giris/cikis saati girin",
                 "expected": "Devam kaydi olusturuldu"},
                {"id": "13.3", "name": "Izin", "screen": "IK > Izin", "role": "ADMIN",
                 "screen_detail": "Ust menude 'IK & Vardiya' > 'Izin'.",
                 "action": "2 gun yillik izin talebi → Onayla",
                 "expected": "Izin onaylandi durumunda"},
            ]
        },
        {
            "title": "FAZ 14: RAPORLAR ve DASHBOARD",
            "dep": "Bagimlilk: Tum fazlar tamamlanmis olmali (veri olmadan raporlar bos gelir)",
            "nedir": "Yonetim kokpiti (executive dashboard), kalite metrikleri, uretim performansi, stok durumu ve maliyet analizi raporlari. Patron bu ekranlari acip 'bugun ne durumdayiz?' sorusunun cevabini alir.",
            "nedegildir": "Raporlar sadece tablo degildir — grafik, KPI kart, trend analizi icerir. Veri girilmemisse raporlar bos gelir — bu hata degildir, once diger fazlari tamamlayin.",
            "business": "Savunma sanayinde yonetim gozden gecirme (management review) toplantilari AS9100 gereksinimidir. Bu toplantilarda OEE, NCR trendi, tedarikci performansi, zamaninda teslimat orani sunulur. Dashboard bu verileri anlik gosterir.",
            "dikkat": "Dashboard'da veriler 0 veya bos gorunuyorsa onceki fazlarda veri girilmemis demektir — bu bir hata degildir. Maliyet Analizi sayfasinda birim maliyet gorunmesi icin makine saat ucretleri (FAZ 2) ve genel giderler (FAZ 2.4) girilmis olmalidir.",
            "nav": [
                "Yonetim Kokpiti: Ust menude 'Yonetim Kokpiti' veya Dashboard tiklayin",
                "KPI kartlari (gelir, OEE, NCR sayisi, teslimat orani) incelenecek",
                "'Kalite' > 'Dashboard' tiklayin — kalite metrikleri gorunecek",
                "'Raporlar' menusunden uretim, stok, satis raporlarini inceleyin",
                "'Uretim' > 'Maliyet Analizi' tiklayin — birim maliyet ve kar marjini gorun",
            ],
            "steps": [
                {"id": "14.1", "name": "Yonetim Kokpiti", "screen": "Yonetim Kokpiti", "role": "ADMIN",
                 "screen_detail": "Ust menude 'Yonetim Kokpiti' veya 'Dashboard' yazan linke tiklayin.",
                 "action": "Gelir, OEE, NCR/CAPA sayilari, zamaninda teslimat oranini kontrol edin",
                 "expected": "KPI kartlari gorunuyor, veriler onceki fazlarla tutarli"},
                {"id": "14.2", "name": "Kalite Dashboard", "screen": "Kalite > Dashboard", "role": "ADMIN",
                 "screen_detail": "Ust menude 'Kalite' > acilan alt menude 'Dashboard' veya ilk secenek.",
                 "action": "NCR ozet, tedarikci puanlari, kalibrasyon durumunu kontrol edin",
                 "expected": "Kalite metrikleri gorunuyor"},
                {"id": "14.3", "name": "Raporlar", "screen": "Raporlar", "role": "ADMIN",
                 "screen_detail": "Ust menude 'Raporlar' tiklayin.",
                 "action": "Uretim, stok, satis raporlarini inceleyin",
                 "expected": "Raporlar yuklenebiliyor, veriler dogru"},
                {"id": "14.4", "name": "Maliyet Analizi", "screen": "Uretim > Maliyet Analizi", "role": "ADMIN",
                 "screen_detail": "Ust menude 'Uretim' > 'Maliyet Analizi'. URL: /production/part-cost",
                 "action": "Malzeme + Iscilik + Makine + Genel Gider toplamlarini kontrol edin",
                 "expected": "Pasta grafik gorunuyor, birim maliyet hesaplanmis, kar marji yuzde olarak gorunuyor"},
            ]
        },
    ]

    for phase in phases:
        story.append(Paragraph(phase["title"], S["h1"]))
        story.append(Paragraph(phase["dep"], S["dep"]))
        story.append(HRFlowable(width="100%", color=PRIMARY, thickness=1, spaceAfter=6))

        # Nedir / Ne Degildir / Business / Dikkat
        story.append(info_box(phase.get("nedir", "")))
        story.append(Spacer(1, 3))
        story.append(warn_box(phase.get("nedegildir", "")))
        story.append(Spacer(1, 3))
        story.append(tip_box(phase.get("business", "")))
        story.append(Spacer(1, 3))
        if phase.get("dikkat"):
            story.append(danger_box(phase["dikkat"]))
            story.append(Spacer(1, 3))

        # Menu yonlendirme
        story.append(nav_box(phase.get("nav", [])))
        story.append(Spacer(1, 6))

        # Adimlar
        prev_role = None
        for step in phase.get("steps", []):
            step_role = step.get("role", "ADMIN")
            # Kullanici degisikligi varsa uyari goster
            if prev_role and prev_role != step_role:
                if step_role == "OPERATOR":
                    story.append(switch_user_box(prev_role, "OPERATOR", "mustafa@demircnc.com"))
                elif step_role == "KALITECI":
                    story.append(switch_user_box(prev_role, "KALITECI", "mehmet@demircnc.com"))
                elif step_role == "ADMIN":
                    story.append(switch_user_box(prev_role, "ADMIN", "ahmet@demircnc.com"))
                story.append(Spacer(1, 3))

            # Rol belirteci
            story.append(role_badge(step_role))
            story.append(Spacer(1, 2))

            for el in step_table(
                step["id"], step["name"], step.get("screen", ""),
                step.get("action", ""), step.get("expected", ""),
                step.get("note"), step.get("role", "ADMIN"),
                step.get("screen_detail")
            ):
                story.append(el)
            prev_role = step_role

        story.append(Spacer(1, 4))

    # ══════════════════════════════════════════════════
    # SORUN GIDERME
    # ══════════════════════════════════════════════════
    story.append(PageBreak())
    story.append(Paragraph("SORUN GIDERME — Takildigimda Ne Yapayim?", S["h1"]))
    story.append(HRFlowable(width="100%", color=PRIMARY, thickness=1, spaceAfter=8))
    story.append(Paragraph(
        "Test sirasinda karsilasabilecefiniz sorunlar ve cozumleri. Bu sayfaya ihtiyac duydugunuzda donun.",
        S["body"]))
    story.append(Spacer(1, 6))

    problems = [
        ["SORUN", "NEDEN?", "COZUM"],
        ["Sayfa acilmiyor veya\nbos ekran geliyor", "API veya UI calismiyor", "3 terminal acik mi kontrol edin.\nAPI: localhost:5052/swagger\nUI: localhost:3000"],
        ["'Baglanti hatasi' veya\n'Network Error' mesaji", "API calismiyor veya\nport yanlis", "API terminalinde hata var mi bakin.\ndotnet run komutunu tekrar calistirin.\nPort 5052 dogru olmali."],
        ["Login basarisiz —\n'Gecersiz kullanici' hatasi", "Email veya sifre yanlis", "Email buyuk/kucuk harf duyarlidir.\nSifre: Test1234!@#$ (12 karakter)\nFAZ 0'daki bilgileri kullanin."],
        ["Menu gorunmuyor veya\nexik menu var", "Yetki eksikligi veya\nyanlis kullanici", "Dogru kullaniciyla giris yaptiginizdan\nemin olun. Operator sadece Uretim\ngoruyor — bu normaldir."],
        ["'Veri Yok' veya bos\nliste sayfasi", "Onceki fazlarda veri\ngirilmemis", "Fazlari sirasi ile yaptiginizdan\nemin olun. Ornegin: Urun\neklenmeden teklif olusturulamaz."],
        ["Urunler sayfasinda urun\ngorunmuyor", "Yanlis tip secilmis.\nPRODUCTION_MATERIAL olmali.", "Urun tipini kontrol edin:\nUrunler sayfasi = PRODUCTION_MATERIAL\nStok sayfasi = STOCK"],
        ["'Taslak faturaya odeme\nyapilamaz' hatasi", "Fatura GONDERILDI\nyapilmamis", "Once fatura durumunu GONDERILDI\nyapin, sonra odeme ekleyin."],
        ["Siparis olusturma butonu\ngorunmuyor", "Teklif KABUL EDILDI\nyapilmamis", "Teklifler listesinden teklifi bulun\nve KABUL EDILDI durumuna cevirin."],
        ["Atolye Terminali bos —\nis emri gorunmuyor", "Is emri atanmamis veya\nyanlis kullanici", "FAZ 7.2'yi (Is Emri Atama)\ntamamlayin. Operator ile giris\nyaptiginizdan emin olun."],
        ["'Onceki operasyonun\nkalitesi tamamlanmadi'", "Kaliteci onay\nvermemis", "Kaliteci ile giris yapin ve\nOperasyon Muayeneleri sayfasindan\nonceki operasyonu onaylayin."],
        ["NCR kapatilamiyor", "Kok neden girilmemis", "CORRECTIVE_ACTION adiminda\nkok neden alanini doldurun."],
        ["Maliyet 0 TL gorunuyor", "Makine saat ucreti\nveya genel gider girilmemis", "FAZ 2.1 (makine saat ucretleri) ve\nFAZ 2.4 (genel giderler) kontrol edin."],
        ["422 veya 400 hatasi", "Zorunlu alan eksik\nveya format hatasi", "Tum zorunlu alanlari (*) doldurun.\nTarih/sayi formati dogru olmali.\nSayfayi yenileyip tekrar deneyin."],
        ["Sifre kabul edilmiyor", "12 karakter politikasi", "En az 12 karakter, buyuk harf,\nkucuk harf, rakam, ozel karakter.\nTest1234!@#$ uygun bir sifre."],
    ]
    pt = Table(problems, colWidths=[38 * mm, 32 * mm, 105 * mm])
    pt.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), RED), ("TEXTCOLOR", (0, 0), (-1, 0), white), ("FONTNAME", (0, 0), (-1, 0), "ArialBD"),
        ("FONTSIZE", (0, 0), (-1, -1), 7.5), ("FONTNAME", (0, 1), (-1, -1), "Arial"),
        ("FONTNAME", (0, 1), (0, -1), "ArialBD"),
        ("BACKGROUND", (0, 1), (-1, -1), LIGHT),
        ("GRID", (0, 0), (-1, -1), 0.5, GRAY),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 3), ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
        ("LEFTPADDING", (0, 0), (-1, -1), 3),
    ]))
    story.append(pt)

    # ══════════════════════════════════════════════════
    # SONUC TABLOSU
    # ══════════════════════════════════════════════════
    story.append(PageBreak())
    story.append(Paragraph("SONUC TABLOSU", S["h1"]))
    story.append(HRFlowable(width="100%", color=PRIMARY, thickness=1, spaceAfter=8))

    rd = [["Faz", "Baslik", "Adim", "Gecti", "Kaldi", "Not"]]
    for f in [
        ("0", "Kayit + Giris", "2"), ("1", "Temel Tanimlar", "3"), ("2", "Makine + Depo + Kalibrasyon", "4"),
        ("3", "Musteri + Urun + Kontrol Plani", "5"), ("4", "Stok + Muayene + Sertifika", "3"),
        ("5", "Teklif + Siparis", "2"), ("6", "Is Emri Sablonu", "1"), ("7", "Onay + Uretim Emri", "2"),
        ("8", "Atolye Terminali (Operator+Kaliteci)", "4"), ("9", "NCR + CAPA + FAI", "3"),
        ("10", "Fason Is", "1"), ("11", "Fatura + Odeme", "3"), ("12", "Bakim", "2"),
        ("13", "IK + Vardiya", "3"), ("14", "Raporlar + Dashboard", "4"),
    ]:
        rd.append([f[0], f[1], f[2], "", "", ""])
    rd.append(["", "TOPLAM", "42", "", "", ""])

    rt = Table(rd, colWidths=[10 * mm, 55 * mm, 12 * mm, 16 * mm, 16 * mm, 66 * mm])
    rt.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), PRIMARY), ("TEXTCOLOR", (0, 0), (-1, 0), white), ("FONTNAME", (0, 0), (-1, 0), "ArialBD"),
        ("FONTSIZE", (0, 0), (-1, -1), 9), ("FONTNAME", (0, 1), (-1, -1), "Arial"),
        ("BACKGROUND", (0, -1), (-1, -1), LIGHT), ("FONTNAME", (0, -1), (-1, -1), "ArialBD"),
        ("GRID", (0, 0), (-1, -1), 0.5, GRAY), ("ALIGN", (0, 0), (0, -1), "CENTER"), ("ALIGN", (2, 0), (4, -1), "CENTER"),
        ("TOPPADDING", (0, 0), (-1, -1), 4), ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]))
    story.append(rt)

    # Ozet bilgi
    story.append(Spacer(1, 12))
    story.append(Paragraph("<b>GENEL DEGERLENDIRME:</b>", S["h3"]))
    eval_data = [
        ["Kriter", "Durumu", "Aciklama"],
        ["Tum fazlar tamamlandi mi?", "[ ] EVET / [ ] HAYIR", "15 fazin tamami gecmis olmali"],
        ["Kullanici rolleri calisti mi?", "[ ] EVET / [ ] HAYIR", "Admin, Operator, Kaliteci ayri islemler yapabiliyor"],
        ["Uretim zinciri kopuk mu?", "[ ] EVET / [ ] HAYIR", "Musteri→Teklif→Siparis→Uretim→Kalite→Fatura baglantili mi?"],
        ["AS9100 gereksinimleri\nsaglandi mi?", "[ ] EVET / [ ] HAYIR", "Gorev ayrimi, izlenebilirlik, NCR, FAI, kalibrasyon"],
    ]
    et = Table(eval_data, colWidths=[42 * mm, 38 * mm, 95 * mm])
    et.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), DARK), ("TEXTCOLOR", (0, 0), (-1, 0), white), ("FONTNAME", (0, 0), (-1, 0), "ArialBD"),
        ("FONTSIZE", (0, 0), (-1, -1), 9), ("FONTNAME", (0, 1), (-1, -1), "Arial"),
        ("FONTNAME", (0, 1), (0, -1), "ArialBD"),
        ("BACKGROUND", (0, 1), (-1, -1), LIGHT),
        ("GRID", (0, 0), (-1, -1), 0.5, GRAY),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 4), ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ("LEFTPADDING", (0, 0), (-1, -1), 4),
    ]))
    story.append(et)

    # Imza
    story.append(Spacer(1, 25))
    sd = [
        ["Test Eden:", "______________________", "Tarih:", "_______________"],
        ["Onaylayan:", "______________________", "Imza:", "_______________"],
    ]
    st = Table(sd, colWidths=[22 * mm, 55 * mm, 18 * mm, 55 * mm])
    st.setStyle(TableStyle([
        ("FONTNAME", (0, 0), (-1, -1), "ArialBD"),
        ("FONTSIZE", (0, 0), (-1, -1), 10),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 12),
    ]))
    story.append(st)

    # Not alani
    story.append(Spacer(1, 15))
    story.append(Paragraph("<b>NOTLAR ve GENEL GOZLEMLER:</b>", S["h3"]))
    for i in range(6):
        story.append(Paragraph("___________________________________________________________________________", S["body"]))
        story.append(Spacer(1, 8))

    doc.build(story, onFirstPage=hdr_ftr, onLaterPages=hdr_ftr)
    print(f"PDF olusturuldu: {out}")
    print(f"Dosya boyutu: {os.path.getsize(out):,} bytes")


if __name__ == "__main__":
    build()
