# -*- coding: utf-8 -*-
"""
Quvex ERP Test Plani v3 — PDF Generator
Turkce karakter destekli, A4 format, profesyonel tasarim
"""
import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm, cm
from reportlab.lib.colors import HexColor, white, black
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, HRFlowable, KeepTogether
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# Turkce karakter destegi icin font
# Windows'ta Segoe UI veya Arial kullan
FONT_DIR = "C:/Windows/Fonts"
for fname, ffile in [
    ("Arial", "arial.ttf"),
    ("ArialBD", "arialbd.ttf"),
    ("ArialI", "ariali.ttf"),
]:
    fpath = os.path.join(FONT_DIR, ffile)
    if os.path.exists(fpath):
        pdfmetrics.registerFont(TTFont(fname, fpath))

# Renkler
PRIMARY = HexColor("#6366f1")  # Quvex mor
DARK = HexColor("#1e1b4b")
GRAY = HexColor("#6b7280")
LIGHT_BG = HexColor("#f8f9fa")
GREEN = HexColor("#22c55e")
RED = HexColor("#ef4444")
ORANGE = HexColor("#f59e0b")
BLUE = HexColor("#3b82f6")

# Stiller
styles = getSampleStyleSheet()

title_style = ParagraphStyle("Title", parent=styles["Title"], fontName="ArialBD", fontSize=24, textColor=PRIMARY, spaceAfter=6)
subtitle_style = ParagraphStyle("Subtitle", fontName="Arial", fontSize=12, textColor=GRAY, spaceAfter=20)
h1_style = ParagraphStyle("H1", fontName="ArialBD", fontSize=16, textColor=DARK, spaceBefore=20, spaceAfter=8, borderWidth=0, borderPadding=0)
h2_style = ParagraphStyle("H2", fontName="ArialBD", fontSize=13, textColor=PRIMARY, spaceBefore=14, spaceAfter=6)
h3_style = ParagraphStyle("H3", fontName="ArialBD", fontSize=11, textColor=DARK, spaceBefore=10, spaceAfter=4)
body_style = ParagraphStyle("Body", fontName="Arial", fontSize=10, textColor=DARK, spaceAfter=4, leading=14)
note_style = ParagraphStyle("Note", fontName="ArialI", fontSize=9, textColor=GRAY, spaceAfter=6, leftIndent=20)
code_style = ParagraphStyle("Code", fontName="Arial", fontSize=9, textColor=DARK, spaceAfter=4, leftIndent=20, backColor=LIGHT_BG)
check_style = ParagraphStyle("Check", fontName="Arial", fontSize=10, textColor=DARK, spaceAfter=2, leftIndent=10)
dep_style = ParagraphStyle("Dep", fontName="ArialBD", fontSize=9, textColor=ORANGE, spaceAfter=4)

def header_footer(canvas, doc):
    canvas.saveState()
    # Header
    canvas.setFillColor(PRIMARY)
    canvas.rect(0, A4[1] - 15*mm, A4[0], 15*mm, fill=1)
    canvas.setFillColor(white)
    canvas.setFont("ArialBD", 11)
    canvas.drawString(15*mm, A4[1] - 10*mm, "Quvex ERP")
    canvas.setFont("Arial", 9)
    canvas.drawRightString(A4[0] - 15*mm, A4[1] - 10*mm, "Uctan Uca Test Plani v3")
    # Footer
    canvas.setFillColor(GRAY)
    canvas.setFont("Arial", 8)
    canvas.drawString(15*mm, 10*mm, "Quvex ERP — Talasli Imalat Atolyesi Test Plani")
    canvas.drawRightString(A4[0] - 15*mm, 10*mm, f"Sayfa {doc.page}")
    canvas.restoreState()

def build_pdf():
    output = os.path.join(os.path.dirname(__file__), "TEST-PLAN-E2E-v3.pdf")
    doc = SimpleDocTemplate(output, pagesize=A4, topMargin=22*mm, bottomMargin=18*mm, leftMargin=15*mm, rightMargin=15*mm)
    story = []

    # ─── KAPAK ───
    story.append(Spacer(1, 40))
    story.append(Paragraph("Quvex ERP", title_style))
    story.append(Paragraph("Uctan Uca Test Plani v3", ParagraphStyle("BigSub", fontName="ArialBD", fontSize=18, textColor=DARK, spaceAfter=10)))
    story.append(Paragraph("Talasli Imalat Atolyesi (5-10 CNC Tezgah)", subtitle_style))
    story.append(HRFlowable(width="100%", color=PRIMARY, thickness=2, spaceAfter=20))

    # Yapi kutusu
    yapi_data = [
        ["PROJE", "DETAY"],
        ["Firma Profili", "5-10 CNC tezgah, 8-15 personel, savunma alt yuklenicisi"],
        ["Sertifikalar", "AS9100 Rev D, ISO 9001:2015"],
        ["Hedef Musteriler", "TAI, ASELSAN, TUSAS, ROKETSAN tedarikcileri"],
        ["Urunler", "Havacilik parcalari — pim, mil, burc, hidrolik blok"],
        ["Test Suresi", "~35 dakika (42 adim, 15 faz)"],
        ["Son Guncelleme", "2026-04-06"],
        ["Otomatik Test", "52/52 PASSED, 75 OK + 4 WARN + 0 FAIL"],
    ]
    t = Table(yapi_data, colWidths=[45*mm, 130*mm])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), PRIMARY),
        ("TEXTCOLOR", (0, 0), (-1, 0), white),
        ("FONTNAME", (0, 0), (-1, 0), "ArialBD"),
        ("FONTSIZE", (0, 0), (-1, -1), 10),
        ("FONTNAME", (0, 1), (0, -1), "ArialBD"),
        ("FONTNAME", (1, 1), (1, -1), "Arial"),
        ("BACKGROUND", (0, 1), (-1, -1), LIGHT_BG),
        ("GRID", (0, 0), (-1, -1), 0.5, GRAY),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]))
    story.append(t)
    story.append(Spacer(1, 20))

    # Kullanim notu
    story.append(Paragraph("<b>NASIL KULLANILIR</b>", h3_style))
    story.append(Paragraph("Bu dokuman PDF olarak yazdirilip test ekibine dagitilir. Her adimda [ ] kutucugunu isaretleyin. Bagimlilk kontrolu yapilmadan bir sonraki faza gecilmez.", body_style))

    # Akis semasi
    story.append(Spacer(1, 10))
    flow = [
        ["URETIM AKISI"],
        ["Kayit -> Birimler -> Makineler -> Depolar -> Musteri -> Urun -> Stok Karti"],
        ["Stok Girisi -> Muayene -> Sertifika -> Teklif -> Siparis -> Is Emri Sablonu"],
        ["Siparis Onay -> Uretim Emri -> Atolye Terminal -> Kalite Onay -> NCR/CAPA/FAI"],
        ["Fason -> Fatura -> Odeme -> Bakim -> IK/Vardiya -> Raporlar"],
    ]
    ft = Table(flow, colWidths=[175*mm])
    ft.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), DARK),
        ("TEXTCOLOR", (0, 0), (-1, 0), white),
        ("FONTNAME", (0, 0), (-1, 0), "ArialBD"),
        ("FONTSIZE", (0, 0), (-1, 0), 11),
        ("FONTNAME", (0, 1), (-1, -1), "Arial"),
        ("FONTSIZE", (0, 1), (-1, -1), 9),
        ("BACKGROUND", (0, 1), (-1, -1), LIGHT_BG),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("GRID", (0, 0), (-1, -1), 0.5, GRAY),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]))
    story.append(ft)
    story.append(PageBreak())

    # ─── FAZLAR ───
    phases = [
        {
            "title": "FAZ 0: KAYIT ve GIRIS",
            "dep": "Bagimlilk: Yok (ilk adim)",
            "steps": [
                {"id": "0.1", "name": "Firma Kaydi", "screen": "/register", "action": "Firma adi, email, sifre, sektor (CNC) ile kayit ol", "expected": "'Hesabiniz basariyla olusturuldu' mesaji", "note": "Sifre min 8 karakter, ozel karakter zorunlu"},
                {"id": "0.2", "name": "Giris Yap", "screen": "/login", "action": "Kayit email + sifre ile giris", "expected": "Anasayfa acilir, menu gorunur"},
            ]
        },
        {
            "title": "FAZ 1: TEMEL TANIMLAR",
            "dep": "Bagimlilk: FAZ 0 tamamlanmis olmali",
            "steps": [
                {"id": "1.1", "name": "Birimler", "screen": "/settings/units", "action": "Adet, Kg, Metre, Litre, Takim ekle", "expected": "5 birim listede"},
                {"id": "1.2", "name": "Kullanicilar", "screen": "/settings/users", "action": "Operator (Mustafa) + Kaliteci (Mehmet) ekle", "expected": "3 kullanici, her biri login olabiliyor", "note": "Operator sadece Uretim menulerini, Kaliteci sadece Kalite menulerini gormeli"},
                {"id": "1.3", "name": "Operasyonlar", "screen": "/settings/work-order-steps", "action": "OP10-OP50 (5 operasyon) ekle — makine, setup/run suresi, beceri", "expected": "Her operasyonda tum alanlar dolu"},
            ]
        },
        {
            "title": "FAZ 2: MAKINE, DEPO, KALIBRASYON",
            "dep": "Bagimlilk: FAZ 1 (Birimler, Roller)",
            "steps": [
                {"id": "2.1", "name": "Makineler (5 adet)", "screen": "/settings/machines", "action": "T01, T02, F01, F02, TAS — saat ucreti + setup ucreti", "expected": "5 makine listede, ucretler girilmis"},
                {"id": "2.2", "name": "Depolar (2 adet)", "screen": "/warehouses", "action": "Hammadde Deposu + Mamul Deposu", "expected": "2 depo listede"},
                {"id": "2.3", "name": "Kalibrasyon (3 alet)", "screen": "/quality/calibration", "action": "Mikrometre, Kumpas, Uc Olcer + kalibrasyon kaydi", "expected": "Dashboard'da Uyumluluk %100"},
                {"id": "2.4", "name": "Genel Gider (%43)", "screen": "/production/part-cost", "action": "Imalat %25, Amortisman %10, Enerji %8", "expected": "3 kalem, toplam %43"},
            ]
        },
        {
            "title": "FAZ 3: MUSTERI, TEDARIKCI, URUN",
            "dep": "Bagimlilk: FAZ 2 (Depolar, Makineler)",
            "steps": [
                {"id": "3.1", "name": "Musteri", "screen": "/customers", "action": "ASELSAN A.S. — adres, vergi, vade 45 gun", "expected": "Musteri listesinde gorunuyor"},
                {"id": "3.2", "name": "Tedarikciler", "screen": "/customers (tedarikci)", "action": "Celik Depo + Isil Islem firmalari", "expected": "2 tedarikci listede"},
                {"id": "3.3", "name": "Urunler", "screen": "/products", "action": "Hammadde (St37) + Mamul (Konnektor Pimi) — PRODUCTION_MATERIAL", "expected": "2 urun, kalite kontrol + lot takip aktif"},
                {"id": "3.4", "name": "Stok Kartlari", "screen": "/stocks", "action": "Ayni urunler STOCK tipinde — stok sayfasi icin", "expected": "Stok sayfasinda 2 kalem"},
                {"id": "3.5", "name": "Kontrol Plani", "screen": "/quality/control-plans", "action": "4 kalem: Dis Cap, Boy, Kama, Taslama — ACTIVE yap", "expected": "Kontrol plani ACTIVE, 3 kritik karakteristik"},
            ]
        },
        {
            "title": "FAZ 4: MALZEME TEDARIK",
            "dep": "Bagimlilk: FAZ 3 (Urunler, Depolar, Tedarikciler)",
            "steps": [
                {"id": "4.1", "name": "Stok Girisi (550 adet)", "screen": "Stok > Giris/Cikis", "action": "Hammadde deposuna 550 adet x 85 TL (500+%10 fire)", "expected": "Stok kartinda 550 adet gorunuyor"},
                {"id": "4.2", "name": "Giris Muayenesi", "screen": "/quality/inspections", "action": "Lot: ST37-LOT-2026-001, Sonuc: GECTI", "expected": "Muayene PASS durumunda"},
                {"id": "4.3", "name": "Sertifikalar", "screen": "Muayene > Sertifika ikonu", "action": "MTR + CoC yukle", "expected": "2 sertifika muayeneye bagli"},
            ]
        },
        {
            "title": "FAZ 5: TEKLIF → SIPARIS",
            "dep": "Bagimlilk: FAZ 3 (Musteri, Urunler)",
            "steps": [
                {"id": "5.1", "name": "Teklif Hazirlama", "screen": "/offers/form", "action": "ASELSAN — 500 adet x 45 TL = 22,500 TL", "expected": "Teklif no atandi, toplam dogru"},
                {"id": "5.2", "name": "Siparis Olusturma", "screen": "Teklifler listesi", "action": "KABUL ET → Siparis Olustur", "expected": "Siparis listesinde gorunuyor"},
            ]
        },
        {
            "title": "FAZ 6: IS EMRI SABLONU",
            "dep": "Bagimlilk: FAZ 1.3 + FAZ 2.1",
            "steps": [
                {"id": "6.1", "name": "Sablon (5 adim)", "screen": "/settings/work-order-templates", "action": "OP10→OP20→OP30→OP40→OP50 surukle-birak ile sirala", "expected": "5 adimli sablon, prerequisite baglantilari dogru"},
            ]
        },
        {
            "title": "FAZ 7: SIPARIS ONAY → URETIM",
            "dep": "Bagimlilk: FAZ 5 + FAZ 6",
            "steps": [
                {"id": "7.1", "name": "Siparis Onay (3 adim)", "screen": "Satislar > detay", "action": "Onay Talep → Onayla → Uretime Aktar", "expected": "Uretim emri olusturuldu, siparis URETIMDE", "note": "AS9100: Siparis direkt onaylanamaz, once talep gerekli"},
                {"id": "7.2", "name": "Is Emri Atama", "screen": "Uretim > detay", "action": "Is Emri Olustur → Sablon sec", "expected": "5 operasyon adimi gorunuyor"},
            ]
        },
        {
            "title": "FAZ 8: ATOLYE TERMINALI",
            "dep": "Bagimlilk: FAZ 7 (Uretim + Is Emri)",
            "steps": [
                {"id": "8.1", "name": "Operator Girisi", "screen": "/login → mustafa@", "action": "Operator olarak giris", "expected": "Sadece Atolye Terminali gorunuyor"},
                {"id": "8.2", "name": "OP10 Torna", "screen": "/shop-floor-terminal", "action": "BASLAT → DURDUR (neden sec) → DEVAM → 500 adet → TAMAMLA → Olcum gir", "expected": "Zamanlayici, durus nedeni, olcum modali calisiyor"},
                {"id": "8.3", "name": "Kalite Onay", "screen": "/quality/operation-inspections", "action": "Kaliteci login → OP10 Onayla", "expected": "OP10 Onaylandi, OP20 baslatilabilir", "note": "AS9100: Kaliteci ayri ekrandan onaylar"},
                {"id": "8.4", "name": "OP20-OP50 Tekrar", "screen": "Terminal + Kalite", "action": "Her op icin: Baslat→Tamamla→Kalite Onay", "expected": "Tum operasyonlar tamamlandi"},
            ]
        },
        {
            "title": "FAZ 9: KALITE OLAYLARI",
            "dep": "Bagimlilk: FAZ 8 (Uretim yapilmis)",
            "steps": [
                {"id": "9.1", "name": "NCR", "screen": "/quality/ncr", "action": "NCR ac → OPEN→REVIEW→CORRECTIVE→CLOSED", "expected": "Kok neden girilmeden kapatilamaz"},
                {"id": "9.2", "name": "CAPA", "screen": "/quality/capa", "action": "NCR'den duzeltici faaliyet", "expected": "CAPA olusturuldu"},
                {"id": "9.3", "name": "FAI (AS9102)", "screen": "/quality/fai", "action": "5 karakteristik gir → Onayla → PDF indir", "expected": "FAI APPROVED, 3 Key Characteristic"},
            ]
        },
        {
            "title": "FAZ 10: FASON IS",
            "dep": "Bagimlilk: FAZ 3 (Fason Tedarikci)",
            "steps": [
                {"id": "10.1", "name": "Fason Siparis", "screen": "/subcontract-orders", "action": "Isil Islem — 500 adet, HEAT_TREATMENT", "expected": "Status workflow + geri sayim badge"},
            ]
        },
        {
            "title": "FAZ 11: FATURA ve ODEME",
            "dep": "Bagimlilk: FAZ 5 (Siparis) + FAZ 3 (Musteri)",
            "steps": [
                {"id": "11.1", "name": "Satis Faturasi", "screen": "/invoices/form", "action": "500 x 45 TL + %20 KDV = 27,000 TL", "expected": "Fatura no, toplam dogru"},
                {"id": "11.2", "name": "Odeme", "screen": "Fatura detay", "action": "GONDERILDI yap → 15,000 + 12,000 ode", "expected": "Fatura ODENDI, cari 0"},
                {"id": "11.3", "name": "Alis Faturasi", "screen": "/invoices (alis)", "action": "Celik Depo — 550 x 85 + KDV", "expected": "Alis faturasi listede"},
            ]
        },
        {
            "title": "FAZ 12: BAKIM",
            "dep": "Bagimlilk: FAZ 2 (Makineler)",
            "steps": [
                {"id": "12.1", "name": "Bakim Plani", "screen": "Bakim > Planlar", "action": "CNC-01 Haftalik Yaglama, ONLEYICI", "expected": "Plan listede"},
                {"id": "12.2", "name": "Bakim Is Emri", "screen": "Plan detay", "action": "Is Emri Olustur → Tamamla", "expected": "Is emri tamamlandi"},
            ]
        },
        {
            "title": "FAZ 13: IK ve VARDIYA",
            "dep": "Bagimlilk: FAZ 1 (Kullanicilar)",
            "steps": [
                {"id": "13.1", "name": "Vardiya", "screen": "IK > Vardiya", "action": "Sabah 06:00-14:00, mola 30dk", "expected": "Vardiya tanimli"},
                {"id": "13.2", "name": "Devam Takibi", "screen": "IK > Devam", "action": "Giris/Cikis kaydi", "expected": "Kayit olusturuldu"},
                {"id": "13.3", "name": "Izin Talebi", "screen": "IK > Izin", "action": "2 gun yillik izin → Onayla", "expected": "Izin onaylandi"},
            ]
        },
        {
            "title": "FAZ 14: RAPORLAR ve DASHBOARD",
            "dep": "Bagimlilk: Tum veriler girilmis olmali",
            "steps": [
                {"id": "14.1", "name": "Yonetim Kokpiti", "screen": "/executive-dashboard", "action": "Gelir, OEE, NCR/CAPA, teslimat kontrol", "expected": "Tum KPI'lar gorunuyor"},
                {"id": "14.2", "name": "Kalite Dashboard", "screen": "/quality/dashboard", "action": "NCR ozet, tedarikci puanlari", "expected": "Veriler dogru"},
                {"id": "14.3", "name": "Uretim Raporlari", "screen": "/reports", "action": "Performans, stok, satis raporlari", "expected": "Raporlar yuklenebiliyor"},
                {"id": "14.4", "name": "Maliyet Analizi", "screen": "/production/part-cost", "action": "Malzeme + Iscilik + Makine + Gider kirilimi", "expected": "Pasta grafik + birim maliyet"},
            ]
        },
    ]

    for phase in phases:
        # Faz basligi
        story.append(Paragraph(phase["title"], h1_style))
        story.append(Paragraph(phase["dep"], dep_style))
        story.append(HRFlowable(width="100%", color=PRIMARY, thickness=1, spaceAfter=8))

        for step in phase["steps"]:
            # Adim basligi
            story.append(Paragraph(f"<b>{step['id']}  {step['name']}</b>", h3_style))

            # Tablo: Ekran, Islem, Beklenen
            data = [
                ["Ekran:", step.get("screen", "-")],
                ["Islem:", step.get("action", "-")],
                ["Beklenen:", step.get("expected", "-")],
            ]
            t = Table(data, colWidths=[25*mm, 150*mm])
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
            story.append(t)

            # Not
            if step.get("note"):
                story.append(Paragraph(f"<i>Not: {step['note']}</i>", note_style))

            # Checkbox
            story.append(Paragraph("[ ] GECTI    [ ] KALDI    Not: _______________", check_style))
            story.append(Spacer(1, 4))

        story.append(Spacer(1, 6))

    # ─── SONUC TABLOSU ───
    story.append(PageBreak())
    story.append(Paragraph("SONUC TABLOSU", h1_style))
    story.append(HRFlowable(width="100%", color=PRIMARY, thickness=1, spaceAfter=10))

    result_data = [["Faz", "Baslik", "Adim", "Gecti", "Kaldi", "Not"]]
    faz_info = [
        ("0", "Kayit + Giris", "2"), ("1", "Birimler + Roller + Op.", "3"),
        ("2", "Makine + Depo + Kalib.", "4"), ("3", "Musteri + Urun + KP", "5"),
        ("4", "Stok + Muayene + Sertifika", "3"), ("5", "Teklif -> Siparis", "2"),
        ("6", "Is Emri Sablonu", "1"), ("7", "Siparis -> Uretim", "2"),
        ("8", "Atolye Terminali", "4"), ("9", "NCR + CAPA + FAI", "3"),
        ("10", "Fason Is", "1"), ("11", "Fatura + Odeme", "3"),
        ("12", "Bakim", "2"), ("13", "IK + Vardiya", "3"),
        ("14", "Raporlar + Dashboard", "4"),
    ]
    for f in faz_info:
        result_data.append([f[0], f[1], f[2], "", "", ""])
    result_data.append(["", "TOPLAM", "42", "", "", ""])

    rt = Table(result_data, colWidths=[12*mm, 50*mm, 15*mm, 20*mm, 20*mm, 58*mm])
    rt.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), PRIMARY),
        ("TEXTCOLOR", (0, 0), (-1, 0), white),
        ("FONTNAME", (0, 0), (-1, 0), "ArialBD"),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("FONTNAME", (0, 1), (-1, -1), "Arial"),
        ("BACKGROUND", (0, -1), (-1, -1), LIGHT_BG),
        ("FONTNAME", (0, -1), (-1, -1), "ArialBD"),
        ("GRID", (0, 0), (-1, -1), 0.5, GRAY),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("ALIGN", (0, 0), (0, -1), "CENTER"),
        ("ALIGN", (2, 0), (4, -1), "CENTER"),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]))
    story.append(rt)

    # Imza alani
    story.append(Spacer(1, 30))
    sign_data = [
        ["Test Eden:", "______________________", "Tarih:", "_______________"],
        ["Onaylayan:", "______________________", "Imza:", "_______________"],
    ]
    st = Table(sign_data, colWidths=[25*mm, 55*mm, 20*mm, 55*mm])
    st.setStyle(TableStyle([
        ("FONTNAME", (0, 0), (-1, -1), "ArialBD"),
        ("FONTSIZE", (0, 0), (-1, -1), 10),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 12),
    ]))
    story.append(st)

    # Build
    doc.build(story, onFirstPage=header_footer, onLaterPages=header_footer)
    print(f"PDF olusturuldu: {output}")

if __name__ == "__main__":
    build_pdf()
