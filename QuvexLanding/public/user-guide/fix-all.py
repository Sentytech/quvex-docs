#!/usr/bin/env python3
"""Fix contacts + Turkish chars across all user-guide files."""
import os
import re

# Contact info fixes
CONTACT_FIXES = {
    'destek@quvex.com.tr': 'destek@quvex.io',
    'destek@quvex.com': 'destek@quvex.io',
    'info@quvex.com.tr': 'destek@quvex.io',
    'info@quvex.com': 'destek@quvex.io',
    '0532 XXX XX XX': '0531 232 47 89',
    '0(532) XXX XX XX': '0531 232 47 89',
    '+90 (532) XXX XX XX': '0531 232 47 89',
    '+90 532 XXX XXXX': '0531 232 47 89',
    '0XXX XXX XX XX': '0531 232 47 89',
    '90XXXXXXXXXX': '905312324789',
}

# Turkish word-level fixes (ASCII -> proper Turkish)
# Only words that are WRONG in ASCII, sorted longest first
TR_WORDS = {
    # ş fixes
    'Baslangic': 'Başlangıç',
    'baslangic': 'başlangıç',
    'Baslatma': 'Başlatma',
    'baslatma': 'başlatma',
    'Basarisiz': 'Başarısız',
    'basarisiz': 'başarısız',
    'Basari': 'Başarı',
    'basari': 'başarı',
    'Karsilastirma': 'Karşılaştırma',
    'karsilastirma': 'karşılaştırma',
    'karsilastirmali': 'karşılaştırmalı',
    'Islem': 'İşlem',
    'islem': 'işlem',
    'Islemleri': 'İşlemleri',
    'islemleri': 'işlemleri',
    'Surec': 'Süreç',
    'surec': 'süreç',
    'Surecler': 'Süreçler',
    'surecler': 'süreçler',
    'Sureclerini': 'Süreçlerini',
    'sureclerini': 'süreçlerini',
    'Akislari': 'Akışları',
    'akislari': 'akışları',
    'Giris': 'Giriş',
    'giris': 'giriş',
    'Cikis': 'Çıkış',
    'cikis': 'çıkış',
    'Sifre': 'Şifre',
    'sifre': 'şifre',
    'Siparis': 'Sipariş',
    'siparis': 'sipariş',
    'siparise': 'siparişe',
    'donusturun': 'dönüştürün',
    'donustur': 'dönüştür',
    'donusum': 'dönüşüm',
    'Calisma': 'Çalışma',
    'calisma': 'çalışma',
    'calisir': 'çalışır',
    'cevrimdisi': 'çevrimdışı',
    'Duzeltici': 'Düzeltici',
    'duzeltici': 'düzeltici',
    'Duzenle': 'Düzenle',
    'duzenle': 'düzenle',
    'Kestirimci': 'Kestirimci',
    'iliskili': 'ilişkili',
    'Iliskili': 'İlişkili',
    'Kisayol': 'Kısayol',
    'kisayol': 'kısayol',
    'Kisayollari': 'Kısayolları',
    'Isleme': 'İşleme',
    'isleme': 'işleme',
    'Isletme': 'İşletme',
    'isletme': 'işletme',
    'Irsaliye': 'İrsaliye',
    'Iscilik': 'İşçilik',
    'iscilik': 'işçilik',
    'asama': 'aşama',
    'asamasi': 'aşaması',
    'asamasina': 'aşamasına',
    'asagi': 'aşağı',
    'Asagida': 'Aşağıda',

    # ö fixes
    'Yonetim': 'Yönetim',
    'yonetim': 'yönetim',
    'Yonetimi': 'Yönetimi',
    'yonetimi': 'yönetimi',
    'Yonetici': 'Yönetici',
    'yonetici': 'yönetici',
    'Modul': 'Modül',
    'modul': 'modül',
    'Modulu': 'Modülü',
    'modulu': 'modülü',
    'Moduller': 'Modüller',
    'moduller': 'modüller',
    'Modulleri': 'Modülleri',
    'modulleri': 'modülleri',
    'modullerini': 'modüllerini',
    'Doviz': 'Döviz',
    'doviz': 'döviz',
    'Dokuman': 'Doküman',
    'dokuman': 'doküman',
    'Sozlugu': 'Sözlüğü',
    'sozlugu': 'sözlüğü',
    'Sektor': 'Sektör',
    'sektor': 'sektör',
    'Sektorel': 'Sektörel',
    'sektorel': 'sektörel',
    'Ozellik': 'Özellik',
    'ozellik': 'özellik',
    'Ozellikleri': 'Özellikleri',
    'ozellikleri': 'özellikleri',
    'Oneri': 'Öneri',
    'oneri': 'öneri',
    'onerisi': 'önerisi',
    'Operatoru': 'Operatörü',
    'operatoru': 'operatörü',
    'gorusme': 'görüşme',
    'gorusmelerini': 'görüşmelerini',
    'gorsel': 'görsel',
    'goruntulen': 'görüntülen',
    'gosterge': 'gösterge',
    'gosterir': 'gösterir',

    # ü fixes
    'Uretim': 'Üretim',
    'uretim': 'üretim',
    'Urun': 'Ürün',
    'urun': 'ürün',
    'guncelle': 'güncelle',
    'guncelleme': 'güncelleme',
    'guncellenir': 'güncellenir',
    'gunluk': 'günlük',
    'Guvenlik': 'Güvenlik',
    'guvenlik': 'güvenlik',
    'Mudur': 'Müdür',
    'mudur': 'müdür',
    'Muduru': 'Müdürü',
    'muduru': 'müdürü',
    'Musteri': 'Müşteri',
    'musteri': 'müşteri',
    'butce': 'bütçe',
    'Butce': 'Bütçe',
    'suresi': 'süresi',
    'dusuk': 'düşük',
    'yuksek': 'yüksek',

    # ç fixes
    'aciklama': 'açıklama',
    'Aciklama': 'Açıklama',
    'aciklamalari': 'açıklamaları',
    'acilir': 'açılır',
    'acin': 'açın',
    'acildiktan': 'açıldıktan',
    'Kucuk': 'Küçük',
    'kucuk': 'küçük',
    'Olcekli': 'Ölçekli',
    'olcekli': 'ölçekli',
    'icin': 'için',
    'Icin': 'İçin',
    'icerik': 'içerik',
    'icinde': 'içinde',
    'Ic ': 'İç ',

    # ğ fixes
    'degerlendirme': 'değerlendirme',
    'Degerlendirme': 'Değerlendirme',
    'deger': 'değer',
    'degisiklik': 'değişiklik',
    'degistir': 'değiştir',
    'dogrulama': 'doğrulama',
    'egitim': 'eğitim',
    'Egitim': 'Eğitim',
    'kagit': 'kağıt',
    'Dagitim': 'Dağıtım',
    'cagri': 'çağrı',

    # ı (dotless i) fixes
    'Kilavuz': 'Kılavuz',
    'kilavuz': 'kılavuz',
    'Kilavuzu': 'Kılavuzu',
    'kilavuzu': 'kılavuzu',
    'Kullanici': 'Kullanıcı',
    'kullanici': 'kullanıcı',
    'Bakim': 'Bakım',
    'bakim': 'bakım',
    'Satinalma': 'Satınalma',
    'satinalma': 'satınalma',
    'Kayit': 'Kayıt',
    'kayit': 'kayıt',
    'kaydi': 'kaydı',
    'Kayitlari': 'Kayıtları',
    'kayitlari': 'kayıtları',
    'takibi': 'takibi',
    'Raporlari': 'Raporları',
    'raporlari': 'raporları',
    'Kartlari': 'Kartları',
    'kartlari': 'kartları',
    'Lokasyonlari': 'Lokasyonları',
    'lokasyonlari': 'lokasyonları',
    'Ipuclari': 'İpuçları',
    'ipuclari': 'ipuçları',
    'Ipucu': 'İpucu',
    'ipucu': 'ipucu',
    'sayim': 'sayım',
    'Sayim': 'Sayım',
    'alani': 'alanı',
    'amaci': 'amacı',
    'numarasi': 'numarası',
    'basina': 'başına',
    'kapsaminda': 'kapsamında',
    'yapilir': 'yapılır',
    'tanimla': 'tanımla',
    'tanimlama': 'tanımlama',
    'tanimlayarak': 'tanımlayarak',
    'yapilandir': 'yapılandır',
    'yapilandirma': 'yapılandırma',
    'Yapilandirma': 'Yapılandırma',
    'hatirlatma': 'hatırlatma',
    'hazirla': 'hazırla',
    'hazirlik': 'hazırlık',
    'hazirlama': 'hazırlama',
    'Hazirlik': 'Hazırlık',
    'hizli': 'hızlı',
    'Hizli': 'Hızlı',
    'tikla': 'tıkla',
    'tiklayin': 'tıklayın',
    'uyarilari': 'uyarıları',
    'uyari': 'uyarı',
    'Uyari': 'Uyarı',
    'bilgileri': 'bilgileri',
    'hesabi': 'hesabı',
    'farkli': 'farklı',
    'haftalik': 'haftalık',
    'ilgili': 'ilgili',
    'satirlarinda': 'satırlarında',
    'sayfalarinda': 'sayfalarında',
    'Kullanilan': 'Kullanılan',
    'kullanilan': 'kullanılan',
    'Baslatilir': 'Başlatılır',
    'Belirlenir': 'Belirlenir',
    'yapilacak': 'yapılacak',
    'atanir': 'atanır',
    'siniflandirma': 'sınıflandırma',
    'siniflandirir': 'sınıflandırır',
    'Sinifi': 'Sınıfı',
    'Bazli': 'Bazlı',
    'bazli': 'bazlı',
    'arasi': 'arası',
    'gecerlilik': 'geçerlilik',
    'gecmis': 'geçmiş',
    'tarayici': 'tarayıcı',
    'sablonlari': 'şablonları',
    'sablon': 'şablon',
    'Sablon': 'Şablon',

    # İ (capital dotted i)
    'Ilk': 'İlk',
    'Izin': 'İzin',
    'Izleme': 'İzleme',
    'Ihtiyac': 'İhtiyaç',
    'Inceleme': 'İnceleme',
    'Ithalat': 'İthalat',
    'Ihracat': 'İhracat',
}

# Words to SKIP (English/technical terms that look like they need fixing but don't)
SKIP_PATTERNS = ['href=', 'src=', 'class=', 'id=', '.html', '.css', '.js', '.json', 'data-']

base = '.'
total_files = 0
total_changes = 0

for root, dirs, files in os.walk(base):
    # Skip .vercel directory
    if '.vercel' in root:
        continue
    for f in files:
        if not f.endswith('.html'):
            continue
        fpath = os.path.join(root, f)
        with open(fpath, 'r', encoding='utf-8') as fh:
            text = fh.read()
        original = text

        # Apply contact fixes (exact string match, safe)
        for old, new in CONTACT_FIXES.items():
            text = text.replace(old, new)

        # Apply Turkish word fixes (longest first to avoid partial matches)
        for old, new in sorted(TR_WORDS.items(), key=lambda x: -len(x[0])):
            if old == new:
                continue
            if old in text:
                text = text.replace(old, new)

        if text != original:
            with open(fpath, 'w', encoding='utf-8') as fh:
                fh.write(text)
            diff_count = sum(1 for a, b in zip(original, text) if a != b)
            rel = os.path.relpath(fpath, base)
            print(f'FIXED: {rel:45s} ({diff_count} chars)')
            total_files += 1
            total_changes += diff_count

print(f'\nTotal: {total_files} files, {total_changes} character changes')
