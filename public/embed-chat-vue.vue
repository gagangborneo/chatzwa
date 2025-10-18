<template>
  <div class="embed-chat-widget" :class="containerClass">
    <!-- Chat Button -->
    <button
      @click="toggleChat"
      class="embed-chat-button"
      :style="buttonStyle"
      v-if="!isOpen"
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
      <div class="embed-chat-status-indicator"></div>
    </button>

    <!-- Chat Window -->
    <transition name="embed-chat-slide">
      <div v-if="isOpen" class="embed-chat-window" :style="windowStyle">
        <!-- Header -->
        <div class="embed-chat-header" :style="headerStyle">
          <div class="embed-chat-header-info">
            <div class="embed-chat-header-avatar">AI</div>
            <div>
              <h3>{{ title }}</h3>
              <p>{{ subtitle }}</p>
            </div>
          </div>
          <button @click="closeChat" class="embed-chat-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <!-- Messages -->
        <div class="embed-chat-messages" ref="messagesContainer">
          <div
            v-for="(message, index) in messages"
            :key="index"
            class="embed-chat-message"
            :class="message.sender"
          >
            <div v-if="message.sender === 'bot'" class="embed-chat-message-sender">
              {{ title }}
            </div>
            <div class="embed-chat-message-content">
              {{ message.text }}
            </div>
          </div>

          <!-- Typing Indicator -->
          <div v-if="isTyping" class="embed-chat-message bot">
            <div class="embed-chat-message-sender">{{ title }}</div>
            <div class="embed-chat-message-content">
              <div class="embed-chat-typing">
                <div class="embed-chat-typing-dot"></div>
                <div class="embed-chat-typing-dot"></div>
                <div class="embed-chat-typing-dot"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Input -->
        <div class="embed-chat-input">
          <div class="embed-chat-input-container">
            <textarea
              v-model="inputMessage"
              @keydown.enter.exact.prevent="sendMessage"
              @input="autoResize"
              :placeholder="placeholder"
              class="embed-chat-input-field"
              ref="inputField"
              rows="1"
            ></textarea>
            <button
              @click="sendMessage"
              :disabled="!inputMessage.trim() || isSending"
              class="embed-chat-send"
              :style="sendButtonStyle"
            >
              <svg v-if="!isSending" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22,2 15,22 11,13 2,9 22,2"/>
              </svg>
              <div v-else class="embed-chat-loading-spinner">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 12a9 9 0 11-6.219-8.56"/>
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Mobile Backdrop -->
    <div
      v-if="isOpen && isMobile"
      class="embed-chat-backdrop"
      :class="{ show: showBackdrop }"
      @click="closeChat"
    ></div>
  </div>
</template>

<script>
export default {
  name: 'EmbedChatWidget',
  props: {
    // API Configuration
    apiUrl: {
      type: String,
      default: 'http://localhost:3000'
    },
    apiKey: {
      type: String,
      required: true
    },
    userId: {
      type: String,
      default: null
    },

    // Appearance
    position: {
      type: String,
      default: 'bottom-right',
      validator: value => ['bottom-right', 'bottom-left', 'top-right', 'top-left'].includes(value)
    },
    theme: {
      type: String,
      default: 'light',
      validator: value => ['light', 'dark'].includes(value)
    },
    primaryColor: {
      type: String,
      default: '#22c55e'
    },
    title: {
      type: String,
      default: 'Customer Support'
    },
    subtitle: {
      type: String,
      default: 'Kami siap membantu Anda'
    },
    welcomeMessage: {
      type: String,
      default: 'Halo! Ada yang bisa saya bantu?'
    },
    placeholder: {
      type: String,
      default: 'Ketik pesan Anda...'
    },

    // Behavior
    autoOpen: {
      type: Boolean,
      default: false
    },
    delay: {
      type: Number,
      default: 2000
    },
    showOnLoad: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      isOpen: false,
      isTyping: false,
      isSending: false,
      showBackdrop: false,
      inputMessage: '',
      messages: [],
      sessionId: this.generateSessionId(),
      retryCount: 0
    }
  },

  computed: {
    containerClass() {
      return [
        `embed-chat-position-${this.position}`,
        `embed-chat-theme-${this.theme}`,
        { 'embed-chat-mobile': this.isMobile }
      ]
    },

    buttonStyle() {
      return {
        '--primary-color': this.primaryColor,
        '--primary-color-dark': this.adjustColor(this.primaryColor, -20)
      }
    },

    windowStyle() {
      return {
        '--primary-color': this.primaryColor,
        '--primary-color-dark': this.adjustColor(this.primaryColor, -20)
      }
    },

    headerStyle() {
      return {
        background: `linear-gradient(135deg, ${this.primaryColor}, ${this.adjustColor(this.primaryColor, -20)})`
      }
    },

    sendButtonStyle() {
      return {
        background: `linear-gradient(135deg, ${this.primaryColor}, ${this.adjustColor(this.primaryColor, -20)})`
      }
    },

    isMobile() {
      return typeof window !== 'undefined' && (
        window.innerWidth <= 480 ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      )
    }
  },

  mounted() {
    // Show widget after delay
    setTimeout(() => {
      if (this.showOnLoad) {
        this.openChat()
      }
    }, this.delay)

    // Add welcome message
    if (this.welcomeMessage) {
      setTimeout(() => {
        this.addMessage(this.welcomeMessage, 'bot')
      }, 500)
    }

    // Handle escape key
    document.addEventListener('keydown', this.handleEscape)

    // Handle orientation changes
    window.addEventListener('orientationchange', this.handleOrientationChange)
    window.addEventListener('resize', this.handleOrientationChange)
  },

  beforeDestroy() {
    document.removeEventListener('keydown', this.handleEscape)
    window.removeEventListener('orientationchange', this.handleOrientationChange)
    window.removeEventListener('resize', this.handleOrientationChange)
  },

  methods: {
    generateSessionId() {
      return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    },

    adjustColor(color, amount) {
      const num = parseInt(color.replace('#', ''), 16)
      const r = Math.max(0, Math.min(255, (num >> 16) + amount))
      const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount))
      const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount))
      return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
    },

    toggleChat() {
      if (this.isOpen) {
        this.closeChat()
      } else {
        this.openChat()
      }
    },

    openChat() {
      this.isOpen = true
      this.$nextTick(() => {
        this.$refs.inputField?.focus()
      })

      if (this.isMobile) {
        document.body.style.overflow = 'hidden'
        setTimeout(() => {
          this.showBackdrop = true
        }, 10)
      }
    },

    closeChat() {
      this.isOpen = false
      this.showBackdrop = false

      if (this.isMobile) {
        document.body.style.overflow = ''
      }
    },

    async sendMessage() {
      const message = this.inputMessage.trim()
      if (!message || this.isSending) return

      this.addMessage(message, 'user')
      this.inputMessage = ''
      this.isSending = true
      this.isTyping = true

      try {
        const response = await this.sendToAPI(message)

        if (response.message) {
          this.addMessage(response.message, 'bot')
        } else {
          this.addMessage('Maaf, saya tidak dapat memproses pesan Anda saat ini.', 'bot')
        }

        this.retryCount = 0
      } catch (error) {
        console.error('Error sending message:', error)

        let errorMessage = 'Maaf, terjadi kesalahan. Silakan coba lagi nanti.'

        if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
          errorMessage = 'Maaf, tidak dapat terhubung ke server. Periksa koneksi internet Anda.'
        } else if (error.message.includes('HTTP error! status: 500')) {
          errorMessage = 'Maaf, terjadi kesalahan pada server. Silakan coba lagi dalam beberapa saat.'
        } else if (error.message.includes('timeout')) {
          errorMessage = 'Maaf, server terlalu lama merespons. Silakan coba lagi.'
        }

        this.addMessage(errorMessage, 'bot')
      } finally {
        this.isTyping = false
        this.isSending = false
        this.$nextTick(() => {
          this.$refs.inputField?.focus()
        })
      }
    },

    addMessage(text, sender) {
      this.messages.push({ text, sender })
      this.$nextTick(() => {
        this.scrollToBottom()
      })
    },

    async sendToAPI(message) {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000)

      try {
        const response = await fetch(`${this.apiUrl}/api/embed-chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message,
            sessionId: this.sessionId,
            widgetId: this.apiKey,
            url: typeof window !== 'undefined' ? window.location.href : '',
            userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
            userId: this.userId
          }),
          signal: controller.signal
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()

        if (!result || typeof result.message !== 'string') {
          throw new Error('Invalid response format from server')
        }

        return result
      } catch (error) {
        clearTimeout(timeoutId)
        if (error.name === 'AbortError') {
          throw new Error('timeout')
        }
        throw error
      }
    },

    scrollToBottom() {
      const container = this.$refs.messagesContainer
      if (container) {
        container.scrollTop = container.scrollHeight
      }
    },

    autoResize() {
      const textarea = this.$refs.inputField
      if (textarea) {
        textarea.style.height = 'auto'
        textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px'
      }
    },

    handleEscape(event) {
      if (event.key === 'Escape' && this.isOpen) {
        this.closeChat()
      }
    },

    handleOrientationChange() {
      if (this.isOpen && this.isMobile) {
        this.$nextTick(() => {
          this.$refs.inputField?.focus()
        })
      }
    }
  }
}
</script>

<style scoped>
.embed-chat-widget {
  position: fixed;
  z-index: 999999;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Position Classes */
.embed-chat-position-bottom-right {
  bottom: 30px;
  right: 30px;
}

.embed-chat-position-bottom-left {
  bottom: 30px;
  left: 30px;
}

.embed-chat-position-top-right {
  top: 30px;
  right: 30px;
}

.embed-chat-position-top-left {
  top: 30px;
  left: 30px;
}

/* Chat Button */
.embed-chat-button {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-color-dark));
  border: 3px solid rgba(255, 255, 255, 0.9);
  color: white;
  cursor: pointer;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3), 0 0 0 4px rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  position: relative;
}

.embed-chat-button:hover {
  transform: scale(1.15);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4), 0 0 0 6px rgba(255, 255, 255, 0.3);
}

.embed-chat-status-indicator {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 16px;
  height: 16px;
  background: #10b981;
  border: 2px solid white;
  border-radius: 50%;
  animation: embed-chat-status-blink 2s infinite;
}

/* Chat Window */
.embed-chat-window {
  width: 420px;
  height: 650px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  position: absolute;
  bottom: 90px;
}

.embed-chat-position-bottom-left .embed-chat-window,
.embed-chat-position-top-left .embed-chat-window {
  left: 0;
}

.embed-chat-position-bottom-right .embed-chat-window,
.embed-chat-position-top-right .embed-chat-window {
  right: 0;
}

.embed-chat-position-top-left .embed-chat-window,
.embed-chat-position-top-right .embed-chat-window {
  bottom: auto;
  top: 90px;
}

/* Header */
.embed-chat-header {
  color: white;
  padding: 18px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.embed-chat-header-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.embed-chat-header-info h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.embed-chat-header-info p {
  margin: 0;
  font-size: 13px;
  opacity: 0.9;
}

.embed-chat-header-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 600;
}

.embed-chat-close {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 20px;
  padding: 4px;
  border-radius: 4px;
  transition: background 0.2s;
}

.embed-chat-close:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* Messages */
.embed-chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  background: linear-gradient(to bottom, #f9fafb, #ffffff);
}

.embed-chat-message {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  max-width: 85%;
}

.embed-chat-message.user {
  align-items: flex-end;
  align-self: flex-end;
}

.embed-chat-message.bot {
  align-items: flex-start;
  align-self: flex-start;
}

.embed-chat-message-sender {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 6px;
  font-weight: 500;
}

.embed-chat-message-content {
  padding: 12px 18px;
  border-radius: 20px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.embed-chat-message.bot .embed-chat-message-content {
  background: white;
  color: #374151;
  border: 1px solid #f3f4f6;
  border-bottom-left-radius: 6px;
}

.embed-chat-message.user .embed-chat-message-content {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-color-dark));
  color: white;
  border-bottom-right-radius: 6px;
}

/* Typing Indicator */
.embed-chat-typing {
  display: flex;
  gap: 4px;
  padding: 12px 16px;
}

.embed-chat-typing-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #9ca3af;
  animation: embed-chat-typing 1.4s infinite;
}

.embed-chat-typing-dot:nth-child(2) {
  animation-delay: 0.2s;
}

.embed-chat-typing-dot:nth-child(3) {
  animation-delay: 0.4s;
}

/* Input */
.embed-chat-input {
  padding: 20px 24px;
  border-top: 1px solid #f3f4f6;
  background: white;
}

.embed-chat-input-container {
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.embed-chat-input-field {
  flex: 1;
  padding: 14px 18px;
  border: 2px solid #f3f4f6;
  border-radius: 24px;
  font-size: 14px;
  outline: none;
  transition: all 0.2s ease;
  resize: none;
  min-height: 50px;
  max-height: 120px;
  line-height: 1.4;
  font-family: inherit;
}

.embed-chat-input-field:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
}

.embed-chat-input-field::placeholder {
  color: #9ca3af;
}

.embed-chat-send {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
  flex-shrink: 0;
}

.embed-chat-send:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(34, 197, 94, 0.4);
}

.embed-chat-send:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.embed-chat-loading-spinner svg {
  animation: embed-chat-spin 1s linear infinite;
}

/* Mobile Backdrop */
.embed-chat-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999998;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.embed-chat-backdrop.show {
  opacity: 1;
}

/* Mobile Responsive */
.embed-chat-mobile .embed-chat-window {
  width: calc(100vw - 32px);
  height: 70vh;
  right: 16px !important;
  left: 16px !important;
  bottom: 80px !important;
  top: 16px !important;
  border-radius: 12px;
}

.embed-chat-mobile .embed-chat-button {
  width: 65px;
  height: 65px;
  font-size: 26px;
}

/* Animations */
.embed-chat-slide-enter-active,
.embed-chat-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.embed-chat-slide-enter,
.embed-chat-slide-leave-to {
  transform: scale(0.9) translateY(30px);
  opacity: 0;
}

@keyframes embed-chat-status-blink {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(0.8);
  }
}

@keyframes embed-chat-typing {
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-10px);
  }
}

@keyframes embed-chat-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Mobile Full Screen for Small Devices */
@media (max-width: 480px) {
  .embed-chat-mobile .embed-chat-window {
    position: fixed !important;
    width: 100vw !important;
    height: 100vh !important;
    right: 0 !important;
    left: 0 !important;
    bottom: 0 !important;
    top: 0 !important;
    border-radius: 0 !important;
    z-index: 999999 !important;
  }

  .embed-chat-mobile .embed-chat-button {
    width: 60px;
    height: 60px;
    font-size: 24px;
  }
}
</style>