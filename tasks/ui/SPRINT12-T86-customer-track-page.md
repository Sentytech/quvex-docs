# Sprint 12 — T86: Müşteri Sipariş Takip Sayfası (UI)

## Amaç
Müşteriye gönderilen tek tıkla erişilebilir, login gerektirmeyen, mobil-uyumlu sipariş takip sayfası + sipariş detayında "Müşteri Linki Üret" butonu.

## Yeni Bileşenler
1. **`src/views/public/OrderTrackPage.js`** — Public müşteri sayfası (route: `/track/:token`)
   - Quvex header (firma logo + adı)
   - Büyük progress circle (% tamamlama)
   - Renkli durum tag'i (Üretimde/Kalite/Sevkiyata Hazır/Sevk Edildi)
   - Tahmini teslim tarihi (büyük puntoyla, gradient kart)
   - Timeline (zaman çizelgesi)
   - WhatsApp iletişim butonu (firma WhatsApp'ı varsa)
   - Mobil-uyumlu, responsive
   - 404/429/500 hata durumları için kullanıcı dostu mesajlar

2. **`src/views/modul/sale/CustomerTrackingLinkModal.js`** — Sipariş detayında açılan modal
   - Süre seçimi: 7 / 14 / 30 / 60 gün
   - "Bağlantı Oluştur" butonu
   - Üretildiğinde: kopyala + WhatsApp ile paylaş butonları
   - "Yeni Bağlantı" ile yeniden üretim
   - Geçerlilik bilgisi + uyarı (sadece sipariş durumu paylaşılır)

## Değişen Dosyalar
- **`src/views/modul/sale/SaleDetail.js`** — "Müşteri Linki Üret" butonu eklendi (LinkOutlined ikonu) + modal entegrasyonu
- **`src/router/routes/index.js`** — `/track/:token` rotası eklendi (`publicRoute: true`, `BlankLayout`)

## Test
`src/views/public/__tests__/OrderTrackPage.test.jsx` — 5 vitest senaryosu:
1. Loading state
2. Sipariş detayları render
3. 404 (geçersiz/expired token) hata mesajı
4. 429 (rate limit) hata mesajı
5. WhatsApp butonunun firma WhatsApp'ı yoksa görünmemesi

## Tasarım Prensipleri
- Mobile-first (320px-720px max width)
- Gradient + soft shadow modern görünüm
- Ant Design bileşenleri (Card, Progress, Timeline, Tag)
- WhatsApp brand color (#25D366) iletişim butonunda
- Tüm metinler Türkçe
- Powered by Quvex footer

## Güvenlik
- Sayfa Authorization header GÖNDERMEZ (axios cookie/token taşımaz çünkü cross-origin auth gerekmez — endpoint AllowAnonymous)
- 429 alındığında kullanıcıya uygun mesaj
- Token URL'de görünür ama tek-yönlü (revoke edilebilir)

## Dosyalar
- `src/views/public/OrderTrackPage.js` (yeni)
- `src/views/public/__tests__/OrderTrackPage.test.jsx` (yeni)
- `src/views/modul/sale/CustomerTrackingLinkModal.js` (yeni)
- `src/views/modul/sale/SaleDetail.js` (modifiye)
- `src/router/routes/index.js` (modifiye)
