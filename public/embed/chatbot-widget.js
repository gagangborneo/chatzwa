/**
 * Embeddable Chatbot Widget
 * Can be used on any website to add a floating chat widget
 */

(function() {
  'use strict';

  // Configuration validation
  if (!window.chatbotConfig) {
    console.error('Chatbot configuration not found. Please set window.chatbotConfig before loading this script.');
    return;
  }

  const config = window.chatbotConfig;

  // Required configuration
  if (!config.chatbotId || !config.apiUrl) {
    console.error('Missing required configuration: chatbotId and apiUrl are required.');
    return;
  }

  // Default configuration
  const defaultSettings = {
    position: 'bottom-right',
    showOnMobile: true,
    autoOpen: false,
    welcomeMessage: 'Hello! How can I help you today?',
    placeholder: 'Type your message...',
    theme: {
      primaryColor: '#10b981',
      secondaryColor: '#059669',
      textColor: '#ffffff',
      backgroundColor: '#ffffff',
      buttonColor: '#10b981',
    }
  };

  // Merge with user configuration
  const settings = {
    ...defaultSettings,
    ...config.settings,
    theme: {
      ...defaultSettings.theme,
      ...config.settings?.theme,
    }
  };

  /**
   * Main Chatbot Widget Class
   */
  class ChatbotWidget {
    constructor() {
      this.config = config;
      this.settings = settings;
      this.isOpen = false;
      this.messages = [];
      this.isTyping = false;
      this.sessionId = this.generateSessionId();

      this.init();
    }

    init() {
      this.createWidget();
      this.bindEvents();

      if (this.settings.autoOpen) {
        setTimeout(() => this.openChat(), 1000);
      }
    }

    generateSessionId() {
      let sessionId = localStorage.getItem('embed_chatbot_session_id');
      if (!sessionId) {
        sessionId = 'embed_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('embed_chatbot_session_id', sessionId);
      }
      return sessionId;
    }

    createWidget() {
      // Create main container
      const container = document.createElement('div');
      container.id = 'chatbot-widget-container';
      container.innerHTML = this.getWidgetHTML();

      // Add to page
      document.body.appendChild(container);

      // Apply custom styles
      this.applyStyles();
    }

    getWidgetHTML() {
      return `
        <div class="chatbot-widget ${this.settings.position}">
          <button class="chatbot-button" id="chatbot-toggle" aria-label="Open chat">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <div class="status-dot"></div>
          </button>

          <div class="chatbot-container" id="chatbot-container">
            <div class="chatbot-header">
              <h3>Chat Assistant</h3>
              <button class="chatbot-close" id="chatbot-close" aria-label="Close chat">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div class="chatbot-messages" id="chatbot-messages">
              <div class="chatbot-message bot">
                <div class="chatbot-message-content">
                  ${this.escapeHtml(this.settings.welcomeMessage)}
                </div>
                <div class="chatbot-message-time">${this.formatTime(new Date())}</div>
              </div>
            </div>

            <div class="chatbot-input">
              <form class="chatbot-input-form" id="chatbot-form">
                <input
                  type="text"
                  class="chatbot-input-field"
                  id="chatbot-input"
                  placeholder="${this.escapeHtml(this.settings.placeholder)}"
                  autocomplete="off"
                  maxlength="500"
                />
                <button type="submit" class="chatbot-send-button" id="chatbot-send">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 22 2 2"></polygon>
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      `;
    }

    applyStyles() {
      const style = document.createElement('style');
      style.textContent = this.getCSS();
      document.head.appendChild(style);
    }

    getCSS() {
      return `
        /* Chatbot Widget Styles */
        .chatbot-widget {
          position: fixed;
          z-index: 9999;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .chatbot-widget.bottom-right {
          bottom: 20px;
          right: 20px;
        }

        .chatbot-widget.bottom-left {
          bottom: 20px;
          left: 20px;
        }

        .chatbot-widget.top-right {
          top: 20px;
          right: 20px;
        }

        .chatbot-widget.top-left {
          top: 20px;
          left: 20px;
        }

        .chatbot-button {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background-color: ${this.settings.theme.buttonColor};
          color: white;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transition: all 0.3s ease;
          position: relative;
        }

        .chatbot-button:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
        }

        .chatbot-button:active {
          transform: scale(0.95);
        }

        .chatbot-button svg {
          width: 24px;
          height: 24px;
        }

        .chatbot-button .status-dot {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 12px;
          height: 12px;
          background-color: #4ade80;
          border-radius: 50%;
          border: 2px solid white;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(74, 222, 128, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(74, 222, 128, 0);
          }
        }

        .chatbot-container {
          position: absolute;
          bottom: 80px;
          width: 350px;
          height: 500px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          opacity: 0;
          transform: translateY(20px) scale(0.9);
          transition: all 0.3s ease;
          pointer-events: none;
        }

        .chatbot-container.bottom-right {
          right: 0;
        }

        .chatbot-container.bottom-left {
          left: 0;
        }

        .chatbot-container.top-right {
          top: 80px;
          bottom: auto;
          right: 0;
        }

        .chatbot-container.top-left {
          top: 80px;
          bottom: auto;
          left: 0;
        }

        .chatbot-container.active {
          opacity: 1;
          transform: translateY(0) scale(1);
          pointer-events: all;
        }

        .chatbot-header {
          background-color: ${this.settings.theme.primaryColor};
          color: ${this.settings.theme.textColor};
          padding: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .chatbot-header h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
        }

        .chatbot-close {
          background: none;
          border: none;
          color: ${this.settings.theme.textColor};
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: background-color 0.2s;
        }

        .chatbot-close:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }

        .chatbot-messages {
          flex: 1;
          padding: 16px;
          overflow-y: auto;
          background-color: #f8f9fa;
        }

        .chatbot-message {
          margin-bottom: 12px;
          display: flex;
          flex-direction: column;
        }

        .chatbot-message.user {
          align-items: flex-end;
        }

        .chatbot-message.bot {
          align-items: flex-start;
        }

        .chatbot-message-content {
          max-width: 70%;
          padding: 12px 16px;
          border-radius: 18px;
          word-wrap: break-word;
          font-size: 14px;
          line-height: 1.4;
        }

        .chatbot-message.user .chatbot-message-content {
          background-color: ${this.settings.theme.primaryColor};
          color: ${this.settings.theme.textColor};
          border-bottom-right-radius: 4px;
        }

        .chatbot-message.bot .chatbot-message-content {
          background-color: white;
          color: #333;
          border: 1px solid #e9ecef;
          border-bottom-left-radius: 4px;
        }

        .chatbot-message-time {
          font-size: 11px;
          color: #6c757d;
          margin-top: 4px;
          padding: 0 4px;
        }

        .chatbot-input {
          padding: 16px;
          border-top: 1px solid #e9ecef;
          background-color: white;
        }

        .chatbot-input-form {
          display: flex;
          gap: 8px;
        }

        .chatbot-input-field {
          flex: 1;
          padding: 12px 16px;
          border: 1px solid #ced4da;
          border-radius: 24px;
          outline: none;
          font-size: 14px;
          transition: border-color 0.2s;
        }

        .chatbot-input-field:focus {
          border-color: ${this.settings.theme.primaryColor};
        }

        .chatbot-send-button {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background-color: ${this.settings.theme.primaryColor};
          color: white;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.2s;
        }

        .chatbot-send-button:hover:not(:disabled) {
          background-color: ${this.settings.theme.secondaryColor};
        }

        .chatbot-send-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .chatbot-typing {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 12px 16px;
          background-color: white;
          border: 1px solid #e9ecef;
          border-radius: 18px;
          border-bottom-left-radius: 4px;
          margin-bottom: 12px;
          width: fit-content;
        }

        .chatbot-typing-dot {
          width: 8px;
          height: 8px;
          background-color: #6c757d;
          border-radius: 50%;
          animation: typing 1.4s infinite;
        }

        .chatbot-typing-dot:nth-child(2) {
          animation-delay: 0.2s;
        }

        .chatbot-typing-dot:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes typing {
          0%, 60%, 100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-10px);
          }
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          ${this.settings.showOnMobile ? `
            .chatbot-widget {
              bottom: 10px;
              right: 10px;
              left: 10px;
            }

            .chatbot-widget.bottom-left {
              right: 10px;
            }

            .chatbot-widget.top-left {
              right: 10px;
            }

            .chatbot-container {
              width: calc(100vw - 40px);
              height: 70vh;
              max-height: 500px;
            }
          ` : `
            .chatbot-widget {
              display: none;
            }
          `}
        }

        /* Hide widget when print */
        @media print {
          .chatbot-widget {
            display: none !important;
          }
        }
      `;
    }

    bindEvents() {
      // Toggle chat
      const toggleBtn = document.getElementById('chatbot-toggle');
      const closeBtn = document.getElementById('chatbot-close');
      const container = document.getElementById('chatbot-container');

      if (toggleBtn) {
        toggleBtn.addEventListener('click', () => this.toggleChat());
      }

      if (closeBtn) {
        closeBtn.addEventListener('click', () => this.closeChat());
      }

      // Close chat when clicking outside
      if (container) {
        document.addEventListener('click', (e) => {
          if (!container.contains(e.target) && !toggleBtn.contains(e.target)) {
            this.closeChat();
          }
        });
      }

      // Form submission
      const form = document.getElementById('chatbot-form');
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          this.sendMessage();
        });
      }

      // Enter key to send
      const input = document.getElementById('chatbot-input');
      if (input) {
        input.addEventListener('keypress', (e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this.sendMessage();
          }
        });
      }
    }

    toggleChat() {
      if (this.isOpen) {
        this.closeChat();
      } else {
        this.openChat();
      }
    }

    openChat() {
      const container = document.getElementById('chatbot-container');
      if (container) {
        container.classList.add('active');
        this.isOpen = true;

        // Focus input after opening
        setTimeout(() => {
          const input = document.getElementById('chatbot-input');
          if (input) {
            input.focus();
          }
        }, 300);
      }
    }

    closeChat() {
      const container = document.getElementById('chatbot-container');
      if (container) {
        container.classList.remove('active');
        this.isOpen = false;
      }
    }

    async sendMessage() {
      const input = document.getElementById('chatbot-input');
      const sendBtn = document.getElementById('chatbot-send');

      if (!input || !input.value.trim()) return;

      const message = input.value.trim();
      input.value = '';

      // Add user message
      this.addMessage(message, 'user');

      // Disable send button
      if (sendBtn) {
        sendBtn.disabled = true;
      }

      try {
        // Show typing indicator
        this.showTyping();

        // Send to API
        const response = await fetch(this.config.apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: message,
            chatbotId: this.config.chatbotId,
            source: 'embed',
            sessionId: this.sessionId,
          }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          this.hideTyping();
          this.addMessage(data.response, 'bot');
        } else {
          this.hideTyping();
          this.addMessage('Sorry, I encountered an error. Please try again.', 'bot');
        }
      } catch (error) {
        console.error('Chatbot API error:', error);
        this.hideTyping();
        this.addMessage('Sorry, I\'m having trouble connecting. Please try again later.', 'bot');
      } finally {
        // Re-enable send button
        if (sendBtn) {
          sendBtn.disabled = false;
        }
      }
    }

    addMessage(content, type) {
      const messagesContainer = document.getElementById('chatbot-messages');
      if (!messagesContainer) return;

      const messageDiv = document.createElement('div');
      messageDiv.className = `chatbot-message ${type}`;
      messageDiv.innerHTML = `
        <div class="chatbot-message-content">${this.escapeHtml(content)}</div>
        <div class="chatbot-message-time">${this.formatTime(new Date())}</div>
      `;

      messagesContainer.appendChild(messageDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    showTyping() {
      const messagesContainer = document.getElementById('chatbot-messages');
      if (!messagesContainer) return;

      this.isTyping = true;

      const typingDiv = document.createElement('div');
      typingDiv.className = 'chatbot-typing';
      typingDiv.id = 'chatbot-typing';
      typingDiv.innerHTML = `
        <div class="chatbot-typing-dot"></div>
        <div class="chatbot-typing-dot"></div>
        <div class="chatbot-typing-dot"></div>
      `;

      messagesContainer.appendChild(typingDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTyping() {
      const typingIndicator = document.getElementById('chatbot-typing');
      if (typingIndicator) {
        typingIndicator.remove();
      }
      this.isTyping = false;
    }

    formatTime(date) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }
  }

  // Initialize the widget when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      new ChatbotWidget();
    });
  } else {
    new ChatbotWidget();
  }

})();