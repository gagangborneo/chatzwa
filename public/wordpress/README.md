# Chatbot Floating Widget WordPress Plugin

Plugin WordPress siap pakai untuk floating chat widget yang terhubung dengan sistem chatbot Anda.

## 📁 Struktur Folder

```
/wordpress/
├── chatbot-floating-widget/          # Plugin WordPress utama
│   ├── chatbot-floating-widget.php  # File plugin utama
│   ├── includes/                     # File PHP core
│   │   ├── class-chatbot-widget.php     # Widget frontend
│   │   ├── class-chatbot-settings.php   # Admin panel
│   │   └── class-chatbot-installer.php  # Installer
│   ├── assets/                       # File assets
│   │   ├── css/                       # Stylesheets
│   │   │   ├── chatbot-widget.css       # Widget styles
│   │   │   └── admin.css                # Admin panel styles
│   │   └── js/                        # JavaScript
│   │       ├── chatbot-widget.js       # Widget functionality
│   │       └── admin.js                 # Admin panel functionality
│   ├── languages/                    # Translation files
│   │   └── chatbot-floating-widget.pot
│   └── readme.txt                    # WordPress readme
└── installer/
    └── chatbot-floating-widget.zip   # ZIP installer siap pakai
```

## 🚀 Cara Instalasi

### Metode 1: Upload ZIP (Rekomendasi)

1. Login ke WordPress admin dashboard
2. Masuk ke **Plugins → Add New**
3. Klik **Upload Plugin**
4. Pilih file `chatbot-floating-widget.zip` dari folder `/installer/`
5. Klik **Install Now**
6. Setelah terinstall, klik **Activate Plugin**

### Metode 2: Manual Upload

1. Download dan ekstrak file plugin
2. Upload folder `chatbot-floating-widget` ke `/wp-content/plugins/`
3. Login ke WordPress admin dashboard
4. Masuk ke **Plugins**
5. Cari "Chatbot Floating Widget" dan klik **Activate**

## ⚙️ Konfigurasi

Setelah plugin aktif, konfigurasikan dengan cara:

1. Masuk ke **Settings → Chatbot Widget**
2. **Basic Settings:**
   - **API URL**: Masukkan URL API chatbot Anda
     - Contoh: `https://your-domain.com/api`
   - **API Key**: Masukkan API key untuk autentikasi
   - **Widget Position**: Pilih posisi widget (bottom-right, bottom-left, top-right, top-left)
   - **Enable Widget**: Centang untuk mengaktifkan widget

3. **Widget Settings:**
   - **Widget Title**: Judul header chat widget
   - **Welcome Message**: Pesan pembuka saat chat dibuka
   - **Input Placeholder**: Text placeholder di input field
   - **Show on Mobile**: Tampilkan widget di mobile
   - **Auto Open**: Buka otomatis saat halaman dimuat

4. **Theme Settings:**
   - **Primary Color**: Warna utama header dan pesan user
   - **Button Color**: Warna tombol floating chat
   - **Text Color**: Warna teks

5. **Advanced Settings:**
   - **Exclude Pages/Posts**: Halaman/post yang tidak menampilkan widget
   - **Load Delay**: Delay loading widget (detik)
   - **Debug Mode**: Enable console logging

## 🔌 Koneksi dengan Sistem

Plugin ini siap terhubung dengan sistem chatbot yang sudah ada:

### API Endpoint yang Dibutuhkan:

- **Chat Endpoint**: `POST /api/chat`
- **Test Connection**: `POST /api/test` (optional)

### Format Request ke API:

```json
{
  "message": "Hello, how can I help you?",
  "chatbotId": "default",
  "source": "wordpress",
  "sessionId": "wp_1234567890_abc123",
  "siteUrl": "https://your-website.com",
  "userAgent": "Mozilla/5.0...",
  "timestamp": "2024-10-19T10:30:00.000Z"
}
```

### Format Response dari API:

```json
{
  "success": true,
  "response": "Hello! I'm here to help you. What would you like to know?",
  "timestamp": "2024-10-19T10:30:05.000Z"
}
```

## 🎨 Kustomisasi

### Custom CSS

Tambahkan custom CSS untuk mengubah tampilan widget:

```css
/* Ubah ukuran tombol */
.chatbot-button {
    width: 70px !important;
    height: 70px !important;
}

/* Custom animation */
.chatbot-button .status-dot {
    animation: custom-pulse 1.5s infinite;
}

@keyframes custom-pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.2); }
}
```

### Custom JavaScript

Hook yang tersedia untuk developer:

```javascript
// Filter konfigurasi widget
window.addEventListener('chatbot_widget_config', function(e) {
    e.detail.config.settings.welcomeMessage = 'Custom welcome message!';
});

// Action setelah widget render
window.addEventListener('chatbot_widget_rendered', function(e) {
    console.log('Chatbot widget rendered:', e.detail);
});
```

## 📱 Mobile Compatibility

Plugin sudah dioptimalkan untuk mobile:

- **Responsive Design**: Menyesuaikan ukuran di berbagai screen size
- **Touch Friendly**: Button dan input yang mudah di-touch
- **Performance**: Lazy loading dan optimization untuk mobile
- **Hide Option**: Bisa dihidden di mobile device

## 🔧 Troubleshooting

### Widget tidak muncul:

1. Pastikan plugin sudah aktif
2. Cek API URL dan API Key sudah benar
3. Test koneksi di admin panel
4. Cek browser console untuk error

### Koneksi gagal:

1. Verify API URL format (harus ada /api di akhir)
2. Check API key valid
3. Test API endpoint langsung dengan Postman/curl
4. Cek CORS policy di server API

### Performance issues:

1. Enable "Load Delay" untuk deferred loading
2. Disable widget di pages yang tidak perlu
3. Use CDN untuk static assets
4. Enable caching

## 📊 Analytics Integration

Plugin siap untuk integrasi dengan analytics:

```javascript
// Google Analytics integration
gtag('event', 'chatbot_message_sent', {
    'custom_parameter_1': window.location.href,
    'custom_parameter_2': 'user_message'
});
```

## 🆕 Update Plugin

Untuk update plugin:

1. Download versi terbaru
2. Upload melalui WordPress admin atau replace manual file
3. WordPress akan otomatis update database jika ada perubahan
4. Settings akan tetap tersimpan

## 🛠️ Developer Guide

### Hook & Filter

```php
// Filter widget configuration
add_filter('chatbot_widget_config', function($config) {
    $config['settings']['welcome_message'] = 'Custom welcome!';
    return $config;
});

// Action sebelum render
add_action('chatbot_widget_before_render', function($config) {
    // Custom logic before widget render
});

// Action setelah render
add_action('chatbot_widget_after_render', function($config) {
    // Custom logic after widget render
});
```

### REST API

Plugin menyediakan REST API endpoints:

- `GET /wp-json/chatbot/v1/config` - Get widget config
- `POST /wp-json/chatbot/v1/test` - Test connection

## 📄 License

Plugin ini dilisensikan di bawah GPL v2 atau lebih tinggi.

## 🆘 Support

Untuk bantuan dan dukungan:

- **Documentation**: Lihat file readme.txt
- **Issues**: Report melalui GitHub issues
- **Community**: Forum WordPress.org
- **Premium**: Upgrade ke versi premium untuk fitur lanjutan

## 🔄 Changelog

### v1.0.0
- Initial release
- Floating chat widget functionality
- WordPress admin integration
- Theme customization
- Mobile responsive design
- API connection testing
- Settings import/export
- Multi-language support

---

**Plugin siap digunakan!** 🎉

Folder `/wordpress/chatbot-floating-widget/` bisa langsung diinstall di WordPress site Anda.