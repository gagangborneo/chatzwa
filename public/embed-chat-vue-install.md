# Vue.js Embed Chat Integration

## Cara Menggunakan Komponen Vue Chat Widget

### 1. Install Komponen

Copy file `embed-chat-vue.vue` ke direktori components Anda:

```bash
cp embed-chat-vue.vue src/components/EmbedChatWidget.vue
```

### 2. Import dan Gunakan

#### Cara 1: Global Registration

```javascript
// main.js
import Vue from 'vue'
import EmbedChatWidget from './components/EmbedChatWidget.vue'

Vue.component('EmbedChatWidget', EmbedChatWidget)
```

#### Cara 2: Local Registration

```vue
<template>
  <div id="app">
    <!-- Konten aplikasi Anda -->
    <router-view />

    <!-- Chat Widget -->
    <EmbedChatWidget
      :api-key="apiKey"
      :title="widgetTitle"
      :subtitle="widgetSubtitle"
      :primary-color="primaryColor"
      :position="position"
      :auto-open="autoOpen"
      :welcome-message="welcomeMessage"
      @chat-opened="onChatOpened"
      @chat-closed="onChatClosed"
    />
  </div>
</template>

<script>
import EmbedChatWidget from './components/EmbedChatWidget.vue'

export default {
  name: 'App',
  components: {
    EmbedChatWidget
  },
  data() {
    return {
      apiKey: 'embed_your_api_key_here',
      widgetTitle: 'Customer Support',
      widgetSubtitle: 'Kami siap membantu Anda',
      primaryColor: '#22c55e',
      position: 'bottom-right',
      autoOpen: false,
      welcomeMessage: 'Halo! Ada yang bisa saya bantu?'
    }
  },
  methods: {
    onChatOpened() {
      console.log('Chat widget opened')
    },
    onChatClosed() {
      console.log('Chat widget closed')
    }
  }
}
</script>
```

### 3. Konfigurasi Props

Berikut adalah daftar lengkap props yang tersedia:

```vue
<EmbedChatWidget
  <!-- API Configuration -->
  :api-url="'https://your-api-domain.com'"
  :api-key="'embed_your_api_key'"
  :user-id="'optional_user_id'"

  <!-- Appearance -->
  :position="'bottom-right'"        <!-- bottom-right, bottom-left, top-right, top-left -->
  :theme="'light'"                  <!-- light, dark -->
  :primary-color="'#22c55e'"
  :title="'Customer Support'"
  :subtitle="'Kami siap membantu Anda'"
  :welcome-message="'Halo! Ada yang bisa saya bantu?'"
  :placeholder="'Ketik pesan Anda...'"

  <!-- Behavior -->
  :auto-open="false"
  :delay="2000"
  :show-on-load="false"
/>
```

### 4. Events

Komponen ini mendukung beberapa event:

```vue
<EmbedChatWidget
  @chat-opened="handleChatOpened"
  @chat-closed="handleChatClosed"
  @message-sent="handleMessageSent"
  @message-received="handleMessageReceived"
/>
```

### 5. Styling Kustom

Anda bisa menimpa style default dengan CSS:

```vue
<template>
  <div>
    <EmbedChatWidget class="custom-chat-widget" />
  </div>
</template>

<style>
/* Custom style untuk chat widget */
.custom-chat-widget .embed-chat-button {
  /* Custom button style */
  border-radius: 15px;
}

.custom-chat-widget .embed-chat-window {
  /* Custom window style */
  border-radius: 20px;
}
</style>
```

### 6. Integration dengan Vue Router

```vue
<template>
  <div id="app">
    <nav>
      <!-- Navigation Anda -->
    </nav>

    <main>
      <router-view />
    </main>

    <!-- Chat Widget hanya di halaman tertentu -->
    <EmbedChatWidget v-if="showChatWidget" />
  </div>
</template>

<script>
export default {
  computed: {
    showChatWidget() {
      // Tampilkan hanya di halaman tertentu
      return this.$route.path !== '/admin'
    }
  }
}
</script>
```

### 7. Integration dengan Vuex/Pinia

```vue
<template>
  <EmbedChatWidget
    :api-key="$store.state.chat.apiKey"
    :user-id="$store.state.auth.user.id"
    :primary-color="$store.theme.primaryColor"
    @message-sent="logMessageToStore"
  />
</template>

<script>
export default {
  methods: {
    logMessageToStore(message) {
      this.$store.dispatch('chat/logMessage', message)
    }
  }
}
</script>
```

### 8. Responsive Design

Komponen sudah responsive otomatis, namun Anda bisa menyesuaikan untuk kebutuhan spesifik:

```vue
<template>
  <div>
    <EmbedChatWidget
      :position="isMobile ? 'bottom-center' : 'bottom-right'"
      :primary-color="isMobile ? '#22c55e' : '#10b981'"
    />
  </div>
</template>

<script>
export default {
  computed: {
    isMobile() {
      return window.innerWidth <= 768
    }
  }
}
</script>
```

### 9. Error Handling

```vue
<template>
  <div>
    <EmbedChatWidget
      @error="handleChatError"
      @connection-failed="handleConnectionFailed"
    />
  </div>
</template>

<script>
export default {
  methods: {
    handleChatError(error) {
      console.error('Chat widget error:', error)
      // Tampilkan notifikasi error
      this.$notify({
        title: 'Chat Error',
        message: 'Terjadi kesalahan pada chat widget',
        type: 'error'
      })
    },

    handleConnectionFailed() {
      console.warn('Chat connection failed')
      // Tampilkan fallback message
      this.$notify({
        title: 'Connection Failed',
        message: 'Chat tidak tersedia saat ini',
        type: 'warning'
      })
    }
  }
}
</script>
```

### 10. Testing

```vue
<template>
  <div>
    <h1>Test Page</h1>
    <button @click="testChat">Test Chat Widget</button>

    <EmbedChatWidget
      ref="chatWidget"
      :api-key="testApiKey"
      :auto-open="true"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      testApiKey: 'embed_test_key_12345'
    }
  },
  methods: {
    testChat() {
      // Programmatic test
      console.log('Testing chat widget...')

      // Simulasi pesan test
      setTimeout(() => {
        this.$refs.chatWidget.addMessage('This is a test message', 'bot')
      }, 1000)
    }
  }
}
</script>
```

### 11. Deploy

Pastikan API URL pointing ke production server saat deploy:

```javascript
// production config
const config = {
  apiUrl: process.env.NODE_ENV === 'production'
    ? 'https://your-production-api.com'
    : 'http://localhost:3000'
}
```

### 12. Performance Optimization

Gunakan `v-if` untuk lazy loading:

```vue
<template>
  <div>
    <!-- Load chat widget hanya saat dibutuhkan -->
    <button @click="showChat = true">Open Chat</button>
    <EmbedChatWidget v-if="showChat" />
  </div>
</template>
```

### 13. TypeScript Support

Untuk project TypeScript, buat type definitions:

```typescript
// types/embed-chat.d.ts
import Vue from 'vue'

declare module 'vue/types/vue' {
  interface Vue {
    $refs: {
      chatWidget?: {
        openChat(): void
        closeChat(): void
        addMessage(text: string, sender: 'user' | 'bot'): void
      }
    }
  }
}

export interface ChatWidgetProps {
  apiKey: string
  apiUrl?: string
  userId?: string
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  theme?: 'light' | 'dark'
  primaryColor?: string
  title?: string
  subtitle?: string
  welcomeMessage?: string
  placeholder?: string
  autoOpen?: boolean
  delay?: number
  showOnLoad?: boolean
}
```

### 14. Troubleshooting

#### Common Issues:

1. **Widget tidak muncul**
   - Pastikan API key valid
   - Check console untuk error messages
   - Verifikasi API URL pointing ke server yang benar

2. **Style tidak berfungsi**
   - Pastikan CSS tidak di-override oleh style lain
   - Check specificity rules
   - Gunakan `!important` jika perlu

3. **Performance issues**
   - Gunakan `v-if` untuk conditional rendering
   - Implement lazy loading untuk large messages
   - Monitor memory usage

### 15. Support

Untuk bantuan lebih lanjut, hubungi:
- Email: support@chatzku.com
- Documentation: https://docs.chatzku.com/embed-chat
- GitHub Issues: https://github.com/chatzku/embed-chat-vue/issues