# Sprint 12 — Task #87: Sesli Komut + Eldiven Modu (ShopFloor)

**Tarih:** 2026-04-12
**Modül:** ShopFloor (Operatör Terminali)
**Konum:** `smallFactoryUI/src/views/modul/production/ShopFloorTerminal.js`

## Hedef
Saha operatörleri eldiven takıyor, elleri kirli, küçük butonlara basmak zor. Bu task iki çözüm getirir:
1. **Eldiven Modu** — büyük butonlar / input'lar / fullscreen modal'lar (CSS class-based, JS toggle, localStorage persist)
2. **Sesli Komut** — Web Speech API (Türkçe) ile el değmeden komut

## Yapılanlar

### 1. GloveMode Provider
- `src/components/GloveMode/GloveModeProvider.js` — Context API, localStorage persist (`quvex.gloveMode`)
- `src/components/GloveMode/glove-mode.scss` — `body.glove-mode { ... }` selector ile AntD bileşen override
- `src/components/GloveMode/index.js` — barrel export
- `src/App.js` — `<GloveModeProvider>` ile global wrap

**Eldiven Modu açıkken uygulanan stiller:**
- Butonlar: `min-height: 80–100px`, `font-size: 24–28px`, `padding: 0 32–40px`
- Input/Select: `min-height: 80px`, `font-size: 24px`, `padding: 16px 20px`
- Modal: fullscreen (100vw × 100vh, no border-radius)
- Tooltip: `display: none` (yerine inline label)
- Tablo / Card / List / Form label: orantılı büyütme
- Spacing: 24px+

### 2. Sesli Komut Hook + Component
- `src/hooks/useVoiceCommand.js` — Web Speech API wrapper
  - `window.SpeechRecognition || webkitSpeechRecognition` graceful fallback
  - `lang = 'tr-TR'`, `continuous: true`, otomatik restart
  - Komut listesi (regex):
    - `üretim başlat` → `onStartProduction`
    - `üretim durdur` → `onStopProduction`
    - `bir adet` / `tek ürün` → `onIncrement`
    - `duruş sebebi malzeme` → `onDowntimeMaterial`
    - `yardım` → `onHelp`
    - `sayfa yenile` → `onReload`
    - `iptal` → `onCancel`
  - Ses geri bildirim: `SpeechSynthesis` ("tamam" / "anlamadım, tekrar")
  - Test API: `_processTranscript(text)` ile dışarıdan besleme
  - Export: `VOICE_COMMAND_EXAMPLES`
- `src/components/VoiceCommand/VoiceCommandButton.js` — Floating mic button (sağ alt)
  - Aktif: kırmızı pulse animasyon
  - Pasif: gri
  - Yardım butonu (mavi): komut listesi drawer
  - Mikrofon izni reddedilirse modal
- `src/components/VoiceCommand/voice-command.scss` — Animasyon + eldiven modu büyütmesi

### 3. ShopFloorTerminal Entegrasyonu
- `useGloveMode()` hook'u ile context'e bağlandı
- Header sağ üstte "🧤 Eldiven Modu" toggle butonu
- Sayfanın altına `<VoiceCommandButton handlers={...} />` eklendi
- Handler'lar mevcut fonksiyonlara bağlandı: `handleStart`, `handlePause`, `setCompletedQty`, `setPauseModalVisible`, `loadData`, vs.

### 4. Test
- `src/components/__tests__/GloveMode.test.jsx` — 4 test (default off, toggle persist, restore, twice toggle)
- `src/hooks/__tests__/useVoiceCommand.test.js` — 10 test (mock SpeechRecognition, tüm komutlar + fallback)

## Kullanım

### Eldiven Modu Açma
1. ShopFloor terminaline gir (`/apps/uretim/shopfloor`)
2. Sağ üstte "🧤 Eldiven Modu" butonuna tıkla
3. Tüm UI büyür, localStorage'da persist (yenilenince hatırlar)
4. Tekrar tıklayarak kapat

### Sesli Komut
1. ShopFloor terminalinde sağ alt köşedeki gri mikrofon butonuna tıkla
2. Tarayıcı izin sorarsa "İzin Ver"
3. Buton kırmızı pulse moduna geçer — dinliyor
4. Komut söyle ("üretim başlat", "bir adet", vb.)
5. Tanındığında "tamam" sesli yanıt + işlem otomatik tetiklenir
6. Komut listesi için yardım butonuna (?) tıkla

## Bilinen Tarayıcı Kısıtları
- **Web Speech API:** Chrome 25+, Edge 79+, Safari 14.1+ destekler. **Firefox desteklemez** (about:config'den manuel açılması gerekir).
- **HTTPS gerekli:** localhost dışında HTTP üzerinden mic izni alınamaz.
- **Mikrofon izni:** Kullanıcı tarayıcı ayarlarından site için reddederse modal uyarısı çıkar.
- **Sürekli dinleme:** Bazı tarayıcılar sessizlik algılayınca otomatik durur — hook `onend` callback'inde otomatik yeniden başlatır.
- **Türkçe accent:** "ş", "ç", "ğ" gibi karakterlerde tanıma %100 değil — regex pattern hem `i` flag'i hem de Türkçe/ASCII varyant kabul ediyor.

## Geliştirici Notları
- Eldiven Modu CSS sadece `body.glove-mode` selector kullanır — additive değişiklik, mevcut UI bozulmaz.
- AntD `!important` override'ları gerekli (theme'den dolayı).
- Test ortamında SCSS import'ları `vitest.config.js`'deki `css: false` ile otomatik strip edilir.
- Voice handler'lar `handlersRef.current` üzerinden okunur — kapatma/yeniden render durumlarında stale closure olmaz.

## Dosyalar
- `src/components/GloveMode/GloveModeProvider.js` (yeni)
- `src/components/GloveMode/glove-mode.scss` (yeni)
- `src/components/GloveMode/index.js` (yeni)
- `src/hooks/useVoiceCommand.js` (yeni)
- `src/components/VoiceCommand/VoiceCommandButton.js` (yeni)
- `src/components/VoiceCommand/voice-command.scss` (yeni)
- `src/components/VoiceCommand/index.js` (yeni)
- `src/App.js` (provider wrap)
- `src/views/modul/production/ShopFloorTerminal.js` (entegrasyon)
- `src/components/__tests__/GloveMode.test.jsx` (yeni test)
- `src/hooks/__tests__/useVoiceCommand.test.js` (yeni test)
