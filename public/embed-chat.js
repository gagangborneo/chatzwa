/**
 * chatzku Embed Chat Script
 * Embed this script in any website to add AI chat functionality
 */

(function(window, document) {
  'use strict';

  // Configuration
  const CONFIG = {
    API_URL: (() => {
      // Try to detect the correct API URL
      const origin = window.location.origin;

      // If we're on localhost, default to 3000 (Next.js default)
      if (origin.includes('localhost:5000')) {
        return 'http://localhost:3000';
      }

      // Otherwise use the current origin
      return origin;
    })(),
    WIDGET_ID: null,
    USER_ID: null, // User ID for personalized responses
    POSITION: 'bottom-right', // bottom-right, bottom-left, top-right, top-left
    THEME: 'light', // light, dark
    PRIMARY_COLOR: '#22c55e',
    WELCOME_MESSAGE: 'Halo! Ada yang bisa saya bantu?',
    PLACEHOLDER: 'Ketik pesan Anda...',
    TITLE: 'Customer Support',
    SUBTITLE: 'Kami siap membantu Anda',
    SHOW_ON_LOAD: false,
    DELAY: 2000, // Show after 2 seconds if show_on_load is false
    BADGE_TEXT: 'Butuh bantuan? Chat kami!',
    AUTO_EXPAND: false,
    POSITION_OFFSET: {
      bottom: 30,
      right: 30,
      left: 30,
      top: 30
    },
    ANIMATION_INTENSITY: 'high', // low, medium, high
    ENABLE_SOUND: false, // For future sound notifications
    PULSE_ANIMATION: true,
    GLOW_EFFECT: true
  };

  // Chat Widget Class
  class EmbedChat {
    constructor(config) {
      this.config = { ...CONFIG, ...config };

      // Generate widget ID if not provided
      if (!this.config.WIDGET_ID) {
        this.config.WIDGET_ID = this.generateWidgetId();
      }

      this.isOpen = false;
      this.messages = [];
      this.sessionId = this.generateSessionId();
      this.widgetContainer = null;
      this.chatContainer = null;
      this.chatWindow = null;
      this.inputField = null;
      this.sendButton = null;
      this.backdropElement = null;

      this.init();
    }

    generateSessionId() {
      return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    generateWidgetId() {
      return 'widget_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    init() {
      this.createWidgetContainer();
      this.loadStyles();
      this.createChatWidget();
      this.bindEvents();

      // Show widget based on configuration
      if (this.config.SHOW_ON_LOAD) {
        this.showWidget();
      } else {
        setTimeout(() => {
          this.showWidget();
          if (this.config.AUTO_EXPAND) {
            this.openChat();
          }
        }, this.config.DELAY);
      }
    }

    createWidgetContainer() {
      this.widgetContainer = document.createElement('div');
      this.widgetContainer.id = 'embed-chat-container';
      this.widgetContainer.style.cssText = `
        position: fixed;
        z-index: 999999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        opacity: 0;
        transition: opacity 0.3s ease;
      `;

      document.body.appendChild(this.widgetContainer);
    }

    loadStyles() {
      const style = document.createElement('style');
      style.textContent = `
        #embed-chat-container {
          ${this.getPositionStyles()}
        }

        .embed-chat-bubble {
          position: absolute;
          background: linear-gradient(135deg, ${this.config.PRIMARY_COLOR}, ${this.adjustColor(this.config.PRIMARY_COLOR, -20)});
          color: white;
          padding: 14px 24px;
          border-radius: 28px;
          cursor: pointer;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25), 0 0 0 3px rgba(255, 255, 255, 0.3);
          transition: all 0.3s ease;
          font-size: 15px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 10px;
          animation: embed-chat-bubble-pulse 2s infinite, embed-chat-bounce 3s infinite;
          backdrop-filter: blur(10px);
          border: 2px solid rgba(255, 255, 255, 0.2);
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
          z-index: 1000000;
          transform: translateY(-2px); /* Slight offset to not overlap with button */
        }

        .embed-chat-bubble:hover {
          transform: translateY(-5px) scale(1.05);
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.35), 0 0 0 4px rgba(255, 255, 255, 0.4);
        }

        .embed-chat-bubble.hidden {
          display: none;
        }

        .embed-chat-button {
          position: absolute;
          width: 70px;
          height: 70px;
          border-radius: 50%;
          background: linear-gradient(135deg, ${this.config.PRIMARY_COLOR}, ${this.adjustColor(this.config.PRIMARY_COLOR, -20)});
          border: 3px solid rgba(255, 255, 255, 0.9);
          color: white;
          cursor: pointer;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3), 0 0 0 4px rgba(255, 255, 255, 0.2), inset 0 2px 4px rgba(255, 255, 255, 0.3);
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          backdrop-filter: blur(10px);
          animation: embed-chat-button-pulse 2s infinite;
          z-index: 999999;
        }

        .embed-chat-button:hover {
          transform: scale(1.15);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4), 0 0 0 6px rgba(255, 255, 255, 0.3), inset 0 2px 6px rgba(255, 255, 255, 0.4);
          border-color: rgba(255, 255, 255, 1);
        }

        .embed-chat-button.hidden {
          display: none;
        }

        .embed-chat-button::before {
          content: '';
          position: absolute;
          top: -5px;
          left: -5px;
          right: -5px;
          bottom: -5px;
          border-radius: 50%;
          background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          animation: embed-chat-button-shimmer 3s infinite;
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

        .embed-chat-window {
          position: absolute;
          width: 420px;
          height: 650px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          transform: scale(0.9) translateY(30px);
          opacity: 0;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid #e5e7eb;
          backdrop-filter: blur(20px);
        }

        .embed-chat-window.open {
          transform: scale(1) translateY(0);
          opacity: 1;
        }

        .embed-chat-header {
          background: linear-gradient(135deg, ${this.config.PRIMARY_COLOR}, ${this.adjustColor(this.config.PRIMARY_COLOR, -20)});
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
          line-height: 1.2;
        }

        .embed-chat-header-info p {
          margin: 0;
          font-size: 13px;
          opacity: 0.9;
          line-height: 1.3;
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
          flex-shrink: 0;
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
          background: linear-gradient(135deg, ${this.config.PRIMARY_COLOR}, ${this.adjustColor(this.config.PRIMARY_COLOR, -20)});
          color: white;
          border-bottom-right-radius: 6px;
        }

        .embed-chat-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, ${this.config.PRIMARY_COLOR}, ${this.adjustColor(this.config.PRIMARY_COLOR, -20)});
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 600;
          flex-shrink: 0;
        }

        .embed-chat-message.user .embed-chat-avatar {
          background: #6b7280;
        }

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
          border-color: ${this.config.PRIMARY_COLOR};
          box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
        }

        .embed-chat-input-field::placeholder {
          color: #9ca3af;
        }

        .embed-chat-send {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(135deg, ${this.config.PRIMARY_COLOR}, ${this.adjustColor(this.config.PRIMARY_COLOR, -20)});
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

        @keyframes embed-chat-bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
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

        @keyframes embed-chat-bubble-pulse {
          0%, 100% {
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25), 0 0 0 3px rgba(255, 255, 255, 0.3);
          }
          50% {
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25), 0 0 0 8px rgba(255, 255, 255, 0.1);
          }
        }

        @keyframes embed-chat-button-pulse {
          0%, 100% {
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3), 0 0 0 4px rgba(255, 255, 255, 0.2), inset 0 2px 4px rgba(255, 255, 255, 0.3);
          }
          50% {
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3), 0 0 0 10px rgba(255, 255, 255, 0.1), inset 0 2px 4px rgba(255, 255, 255, 0.3);
          }
        }

        @keyframes embed-chat-button-shimmer {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
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

        @keyframes embed-chat-spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        /* Tablet styles */
        @media (max-width: 768px) {
          .embed-chat-window {
            width: calc(100vw - 32px);
            height: 70vh;
            right: 16px !important;
            left: 16px !important;
            bottom: 80px !important;
            top: 16px !important;
            border-radius: 12px;
          }

          .embed-chat-button {
            width: 65px;
            height: 65px;
            font-size: 26px;
          }

          .embed-chat-bubble {
            font-size: 14px;
            padding: 12px 18px;
          }

          .embed-chat-header {
            padding: 16px 20px;
          }

          .embed-chat-header-avatar {
            width: 34px;
            height: 34px;
            font-size: 15px;
          }

          .embed-chat-messages {
            padding: 20px;
          }

          .embed-chat-input {
            padding: 18px 20px;
          }

          .embed-chat-input-field {
            padding: 13px 17px;
            min-height: 46px;
            font-size: 15px;
          }

          .embed-chat-send {
            width: 46px;
            height: 46px;
          }
        }

        /* Mobile styles - Full screen for small devices */
        @media (max-width: 480px) {
          .embed-chat-window {
            position: fixed !important;
            width: 100vw !important;
            height: 100vh !important;
            right: 0 !important;
            left: 0 !important;
            bottom: 0 !important;
            top: 0 !important;
            border-radius: 0 !important;
            max-width: none !important;
            max-height: none !important;
            z-index: 9999999 !important;
          }

          .embed-chat-window.open {
            transform: scale(1) translateY(0) !important;
          }

          .embed-chat-button {
            width: 60px;
            height: 60px;
            font-size: 24px;
          }

          .embed-chat-bubble {
            font-size: 13px;
            padding: 10px 16px;
            max-width: calc(100vw - 100px);
          }

          .embed-chat-header {
            padding: 14px 18px;
            border-bottom: 2px solid rgba(255, 255, 255, 0.2);
          }

          .embed-chat-header-info h3 {
            font-size: 16px;
          }

          .embed-chat-header-info p {
            font-size: 12px;
          }

          .embed-chat-header-avatar {
            width: 32px;
            height: 32px;
            font-size: 14px;
          }

          .embed-chat-close {
            width: 32px;
            height: 32px;
            font-size: 18px;
          }

          .embed-chat-messages {
            padding: 16px;
            flex: 1;
            overflow-y: auto;
          }

          .embed-chat-message {
            max-width: 90%;
          }

          .embed-chat-message-content {
            font-size: 15px;
            padding: 11px 16px;
            line-height: 1.4;
          }

          .embed-chat-message-sender {
            font-size: 11px;
            margin-bottom: 5px;
          }

          .embed-chat-input {
            padding: 16px;
            border-top: 1px solid #f3f4f6;
            background: white;
            flex-shrink: 0;
          }

          .embed-chat-input-container {
            gap: 10px;
          }

          .embed-chat-input-field {
            padding: 12px 16px;
            min-height: 44px;
            font-size: 16px; /* Prevents zoom on iOS */
            border-radius: 22px;
          }

          .embed-chat-send {
            width: 44px;
            height: 44px;
            flex-shrink: 0;
          }

          .embed-chat-send svg {
            width: 16px;
            height: 16px;
          }
        }

        /* Small mobile optimization */
        @media (max-width: 360px) {
          .embed-chat-header {
            padding: 12px 16px;
          }

          .embed-chat-header-info h3 {
            font-size: 15px;
          }

          .embed-chat-header-avatar {
            width: 28px;
            height: 28px;
            font-size: 13px;
          }

          .embed-chat-messages {
            padding: 12px;
          }

          .embed-chat-input {
            padding: 12px 16px;
          }

          .embed-chat-input-field {
            padding: 10px 14px;
            min-height: 40px;
            font-size: 15px;
          }

          .embed-chat-send {
            width: 40px;
            height: 40px;
          }

          .embed-chat-message-content {
            font-size: 14px;
            padding: 10px 14px;
          }
        }

        /* Touch-friendly improvements for mobile */
        @media (hover: none) and (pointer: coarse) {
          .embed-chat-button {
            min-width: 44px;
            min-height: 44px;
          }

          .embed-chat-send {
            min-width: 44px;
            min-height: 44px;
          }

          .embed-chat-close {
            min-width: 44px;
            min-height: 44px;
            padding: 8px;
          }

          .embed-chat-input-field {
            font-size: 16px; /* Prevents zoom on iOS */
          }

          /* Remove hover effects on touch devices */
          .embed-chat-button:hover {
            transform: none;
          }

          .embed-chat-send:hover:not(:disabled) {
            transform: none;
          }

          .embed-chat-bubble:hover {
            transform: translateY(-2px);
          }
        }

        /* Mobile-specific animations */
        @media (max-width: 480px) {
          @keyframes embed-chat-mobile-slide-up {
            from {
              transform: translateY(100%);
            }
            to {
              transform: translateY(0);
            }
          }

          .embed-chat-window.open {
            animation: embed-chat-mobile-slide-up 0.3s ease-out;
          }
        }

        /* Landscape mode adjustments */
        @media (max-height: 500px) and (max-width: 768px) {
          .embed-chat-window {
            height: 100vh !important;
          }

          .embed-chat-header {
            padding: 12px 16px;
          }

          .embed-chat-messages {
            padding: 12px;
          }

          .embed-chat-input {
            padding: 12px 16px;
          }
        }

        /* High contrast mode for better visibility */
        @media (prefers-contrast: high) {
          .embed-chat-button {
            border-width: 4px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 0 6px rgba(255, 255, 255, 0.4);
          }

          .embed-chat-bubble {
            border-width: 3px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4), 0 0 0 4px rgba(255, 255, 255, 0.5);
          }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .embed-chat-button,
          .embed-chat-bubble {
            animation: none;
          }

          .embed-chat-button:hover,
          .embed-chat-bubble:hover {
            transform: scale(1.05);
          }
        }
      `;

      document.head.appendChild(style);
    }

    getPositionStyles() {
      const offset = this.config.POSITION_OFFSET;
      const position = this.config.POSITION;

      let styles = '';

      switch (position) {
        case 'bottom-right':
          styles += `bottom: ${offset.bottom}px; right: ${offset.right}px;`;
          break;
        case 'bottom-left':
          styles += `bottom: ${offset.bottom}px; left: ${offset.left}px;`;
          break;
        case 'top-right':
          styles += `top: ${offset.top}px; right: ${offset.right}px;`;
          break;
        case 'top-left':
          styles += `top: ${offset.top}px; left: ${offset.left}px;`;
          break;
      }

      return styles;
    }

    adjustColor(color, amount) {
      const num = parseInt(color.replace('#', ''), 16);
      const r = Math.max(0, Math.min(255, (num >> 16) + amount));
      const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount));
      const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
      return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
    }

    createChatWidget() {
      // Create chat bubble (optional)
      let bubble = null;
      if (this.config.BADGE_TEXT && this.config.BADGE_TEXT.trim() !== '') {
        bubble = document.createElement('div');
        bubble.className = 'embed-chat-bubble';

        // Position bubble based on widget position
        const position = this.config.POSITION;
        let bubbleStyles = '';

        switch (position) {
          case 'bottom-right':
            bubbleStyles += `bottom: 90px; right: 0;`;
            break;
          case 'bottom-left':
            bubbleStyles += `bottom: 90px; left: 0;`;
            break;
          case 'top-right':
            bubbleStyles += `top: 90px; right: 0;`;
            break;
          case 'top-left':
            bubbleStyles += `top: 90px; left: 0;`;
            break;
        }

        bubble.style.cssText = bubbleStyles;

        bubble.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
          </svg>
          ${this.config.BADGE_TEXT}
        `;
        this.widgetContainer.appendChild(bubble);
      }

      // Create chat button
      const button = document.createElement('button');
      button.className = 'embed-chat-button';

      // Position button based on widget position
      const position = this.config.POSITION;
      let buttonStyles = '';

      switch (position) {
        case 'bottom-right':
          buttonStyles += `bottom: 0; right: 0;`;
          break;
        case 'bottom-left':
          buttonStyles += `bottom: 0; left: 0;`;
          break;
        case 'top-right':
          buttonStyles += `top: 0; right: 0;`;
          break;
        case 'top-left':
          buttonStyles += `top: 0; left: 0;`;
          break;
      }

      button.style.cssText = buttonStyles;

      button.innerHTML = `
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        <div class="embed-chat-status-indicator"></div>
      `;
      this.widgetContainer.appendChild(button);

      // Create chat window
      this.createChatWindow();
      this.chatContainer = this.widgetContainer.querySelector('.embed-chat-window');
      this.chatWindow = this.chatContainer;

      // Bind button click
      button.addEventListener('click', () => this.toggleChat());
      if (bubble) {
        bubble.addEventListener('click', () => {
          bubble.classList.add('hidden');
          this.openChat();
        });
      }
    }

    createChatWindow() {
      const chatWindow = document.createElement('div');
      chatWindow.className = 'embed-chat-window';

      // Position window based on widget position
      const position = this.config.POSITION;
      let windowStyles = '';

      switch (position) {
        case 'bottom-right':
          windowStyles += `bottom: 90px; right: 0;`;
          break;
        case 'bottom-left':
          windowStyles += `bottom: 90px; left: 0;`;
          break;
        case 'top-right':
          windowStyles += `top: 90px; right: 0;`;
          break;
        case 'top-left':
          windowStyles += `top: 90px; left: 0;`;
          break;
      }

      chatWindow.style.cssText = windowStyles;

      chatWindow.innerHTML = `
        <div class="embed-chat-header">
          <div class="embed-chat-header-info">
            <div class="embed-chat-header-avatar">AI</div>
            <div>
              <h3>${this.config.TITLE}</h3>
              <p>${this.config.SUBTITLE}</p>
            </div>
          </div>
          <button class="embed-chat-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="embed-chat-messages"></div>
        <div class="embed-chat-input">
          <div class="embed-chat-input-container">
            <textarea class="embed-chat-input-field" placeholder="${this.config.PLACEHOLDER}" rows="1"></textarea>
            <button class="embed-chat-send">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22,2 15,22 11,13 2,9 22,2"/>
              </svg>
            </button>
          </div>
        </div>
      `;

      this.widgetContainer.appendChild(chatWindow);

      // Store references
      this.inputField = chatWindow.querySelector('.embed-chat-input-field');
      this.sendButton = chatWindow.querySelector('.embed-chat-send');
      this.messagesContainer = chatWindow.querySelector('.embed-chat-messages');

      // Bind close button
      const closeButton = chatWindow.querySelector('.embed-chat-close');
      closeButton.addEventListener('click', () => this.closeChat());
    }

    bindEvents() {
      // Send message on button click
      this.sendButton.addEventListener('click', () => this.sendMessage());

      // Auto-resize textarea and handle Enter key
      this.inputField.addEventListener('input', (e) => {
        // Auto-resize
        this.inputField.style.height = 'auto';
        this.inputField.style.height = Math.min(this.inputField.scrollHeight, 120) + 'px';
      });

      this.inputField.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.sendMessage();
        }
      });

      // Close on escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) {
          this.closeChat();
        }
      });

      // Handle orientation changes
      window.addEventListener('orientationchange', () => {
        this.handleOrientationChange();
      });

      window.addEventListener('resize', () => {
        this.handleOrientationChange();
      });
    }

    showWidget() {
      this.widgetContainer.style.opacity = '1';

      // Show welcome message after a delay
      setTimeout(() => {
        if (this.config.WELCOME_MESSAGE) {
          this.addMessage(this.config.WELCOME_MESSAGE, 'bot');
        }
      }, 500);
    }

    toggleChat() {
      if (this.isOpen) {
        this.closeChat();
      } else {
        this.openChat();
      }
    }

    openChat() {
      this.isOpen = true;
      this.chatWindow.classList.add('open');
      this.inputField.focus();

      // Hide chat bubble if exists
      const bubble = this.widgetContainer.querySelector('.embed-chat-bubble');
      if (bubble) {
        bubble.classList.add('hidden');
      }

      // Add mobile backdrop overlay for small screens
      this.addMobileBackdrop();

      // Prevent body scroll on mobile when chat is open
      if (this.isMobile()) {
        document.body.style.overflow = 'hidden';
      }
    }

    closeChat() {
      this.isOpen = false;
      this.chatWindow.classList.remove('open');

      // Remove mobile backdrop overlay
      this.removeMobileBackdrop();

      // Restore body scroll on mobile
      if (this.isMobile()) {
        document.body.style.overflow = '';
      }
    }

    async sendMessage() {
      const message = this.inputField.value.trim();
      if (!message) return;

      // Add user message
      this.addMessage(message, 'user');
      this.inputField.value = '';
      this.inputField.style.height = 'auto'; // Reset textarea height
      this.sendButton.disabled = true;

      // Show typing indicator with loading state
      this.showTypingIndicator();
      this.setSendButtonLoading(true);

      try {
        // Send to API with timeout
        const response = await this.sendToAPI(message);

        // Remove typing indicator
        this.hideTypingIndicator();
        this.setSendButtonLoading(false);

        // Add bot response
        if (response.message) {
          this.addMessage(response.message, 'bot');
        } else {
          this.addMessage('Maaf, saya tidak dapat memproses pesan Anda saat ini.', 'bot');
        }
      } catch (error) {
        console.error('Error sending message:', error);
        this.hideTypingIndicator();
        this.setSendButtonLoading(false);

        // Show specific error messages based on error type
        let errorMessage = 'Maaf, terjadi kesalahan. Silakan coba lagi nanti.';

        if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
          errorMessage = 'Maaf, tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
        } else if (error.message.includes('HTTP error! status: 500')) {
          errorMessage = 'Maaf, terjadi kesalahan pada server. Silakan coba lagi dalam beberapa saat.';
        } else if (error.message.includes('HTTP error! status: 400')) {
          errorMessage = 'Maaf, permintaan tidak valid. Silakan coba lagi.';
        } else if (error.message.includes('timeout')) {
          errorMessage = 'Maaf, server terlalu lama merespons. Silakan coba lagi.';
        } else if (error.message.includes('Invalid JSON response')) {
          errorMessage = 'Maaf, server mengembalikan format yang tidak valid. Silakan coba lagi.';
        }

        this.addMessage(errorMessage, 'bot');
        this.addRetryOption(message);
      }

      this.sendButton.disabled = false;
      this.inputField.focus();
    }

    addMessage(text, sender) {
      const messageDiv = document.createElement('div');
      messageDiv.className = `embed-chat-message ${sender}`;

      if (sender === 'bot') {
        const senderName = document.createElement('div');
        senderName.className = 'embed-chat-message-sender';
        senderName.textContent = this.config.TITLE || 'AI Assistant';
        messageDiv.appendChild(senderName);
      }

      const content = document.createElement('div');
      content.className = 'embed-chat-message-content';
      content.textContent = text;

      messageDiv.appendChild(content);

      this.messagesContainer.appendChild(messageDiv);
      this.scrollToBottom();
    }

    showTypingIndicator() {
      const typingDiv = document.createElement('div');
      typingDiv.className = 'embed-chat-message bot';

      const senderName = document.createElement('div');
      senderName.className = 'embed-chat-message-sender';
      senderName.textContent = this.config.TITLE || 'AI Assistant';
      typingDiv.appendChild(senderName);

      const typingContent = document.createElement('div');
      typingContent.className = 'embed-chat-message-content';
      typingContent.innerHTML = `
        <div class="embed-chat-typing">
          <div class="embed-chat-typing-dot"></div>
          <div class="embed-chat-typing-dot"></div>
          <div class="embed-chat-typing-dot"></div>
        </div>
      `;
      typingDiv.appendChild(typingContent);

      this.messagesContainer.appendChild(typingDiv);
      this.scrollToBottom();
    }

    hideTypingIndicator() {
      const typingIndicator = this.messagesContainer.querySelector('.embed-chat-typing');
      if (typingIndicator) {
        typingIndicator.parentElement.remove();
      }
    }

    scrollToBottom() {
      this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    async sendToAPI(message) {
      console.log('Embed Chat: Sending message to API:', {
        message: message,
        sessionId: this.sessionId,
        widgetId: this.config.WIDGET_ID,
        userId: this.config.USER_ID,
        apiUrl: this.config.API_URL,
        url: window.location.href
      });

      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      try {
        const response = await fetch(`${this.config.API_URL}/api/embed-chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: message,
            sessionId: this.sessionId,
            widgetId: this.config.WIDGET_ID,
            url: window.location.href,
            userAgent: navigator.userAgent,
            userId: this.config.USER_ID
          }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);
        console.log('Embed Chat: API Response status:', response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Embed Chat: API Error:', {
            status: response.status,
            statusText: response.statusText,
            errorText: errorText
          });
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        let result;
        try {
          result = await response.json();
          console.log('Embed Chat: API Response:', result);
        } catch (jsonError) {
          console.error('Embed Chat: JSON Parse Error:', jsonError);
          console.log('Embed Chat: Raw Response Text:', await response.text());
          throw new Error('Invalid JSON response from server');
        }

        // Validate response structure
        if (!result || typeof result.message !== 'string') {
          console.error('Embed Chat: Invalid response structure:', result);
          throw new Error('Invalid response format from server');
        }

        return result;

      } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
          throw new Error('timeout');
        }
        throw error;
      }
    }

    // Set send button loading state
    setSendButtonLoading(isLoading) {
      if (isLoading) {
        this.sendButton.innerHTML = `
          <div class="embed-chat-loading-spinner">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12a9 9 0 11-6.219-8.56"/>
            </svg>
          </div>
        `;
        this.sendButton.style.animation = 'embed-chat-spin 1s linear infinite';
      } else {
        this.sendButton.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22,2 15,22 11,13 2,9 22,2"/>
          </svg>
        `;
        this.sendButton.style.animation = '';
      }
    }

    // Add retry option for failed messages
    addRetryOption(originalMessage) {
      const retryDiv = document.createElement('div');
      retryDiv.className = 'embed-chat-retry-container';
      retryDiv.style.cssText = `
        text-align: center;
        margin-top: 10px;
        padding: 8px;
        background: #fef3c7;
        border-radius: 8px;
        border: 1px solid #f59e0b;
      `;

      const retryButton = document.createElement('button');
      retryButton.textContent = 'Coba Lagi';
      retryButton.style.cssText = `
        background: ${this.config.PRIMARY_COLOR};
        color: white;
        border: none;
        padding: 6px 12px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        margin-top: 4px;
      `;

      retryButton.addEventListener('click', () => {
        retryDiv.remove();
        this.sendMessageWithRetry(originalMessage);
      });

      retryDiv.appendChild(document.createTextNode('Kirim ulang pesan? '));
      retryDiv.appendChild(retryButton);
      this.messagesContainer.appendChild(retryDiv);
      this.scrollToBottom();
    }

    // Send message with retry (for retry button)
    async sendMessageWithRetry(message) {
      this.addMessage(message, 'user');
      this.sendButton.disabled = true;
      this.showTypingIndicator();
      this.setSendButtonLoading(true);

      try {
        const response = await this.sendToAPI(message);
        this.hideTypingIndicator();
        this.setSendButtonLoading(false);

        if (response.message) {
          this.addMessage(response.message, 'bot');
        } else {
          this.addMessage('Maaf, saya tidak dapat memproses pesan Anda saat ini.', 'bot');
        }
      } catch (error) {
        console.error('Error retrying message:', error);
        this.hideTypingIndicator();
        this.setSendButtonLoading(false);
        this.addMessage('Maaf, masih terjadi kesalahan. Silakan coba lagi nanti.', 'bot');
        this.addRetryOption(message);
      }

      this.sendButton.disabled = false;
      this.inputField.focus();
    }

    // Mobile detection helper
    isMobile() {
      return window.innerWidth <= 480 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // Add mobile backdrop overlay
    addMobileBackdrop() {
      if (this.isMobile() && !document.querySelector('.embed-chat-backdrop')) {
        const backdrop = document.createElement('div');
        backdrop.className = 'embed-chat-backdrop';
        backdrop.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.5);
          z-index: 9999998;
          opacity: 0;
          transition: opacity 0.3s ease;
        `;

        // Add backdrop styles to page
        const backdropStyle = document.createElement('style');
        backdropStyle.textContent = `
          .embed-chat-backdrop.show {
            opacity: 1 !important;
          }
        `;
        document.head.appendChild(backdropStyle);

        document.body.appendChild(backdrop);

        // Show backdrop with fade in
        setTimeout(() => {
          backdrop.classList.add('show');
        }, 10);

        // Close chat when backdrop is clicked
        backdrop.addEventListener('click', () => {
          this.closeChat();
        });

        this.backdropElement = backdrop;
      }
    }

    // Remove mobile backdrop overlay
    removeMobileBackdrop() {
      if (this.backdropElement) {
        this.backdropElement.classList.remove('show');
        setTimeout(() => {
          if (this.backdropElement && this.backdropElement.parentNode) {
            this.backdropElement.parentNode.removeChild(this.backdropElement);
          }
          this.backdropElement = null;
        }, 300);
      }
    }

    // Handle orientation changes
    handleOrientationChange() {
      if (this.isOpen) {
        setTimeout(() => {
          this.inputField.focus();
          // Adjust window position if needed
          if (this.isMobile()) {
            this.chatWindow.style.cssText = `
              position: fixed !important;
              width: 100vw !important;
              height: 100vh !important;
              right: 0 !important;
              left: 0 !important;
              bottom: 0 !important;
              top: 0 !important;
              border-radius: 0 !important;
              z-index: 9999999 !important;
            `;
          }
        }, 100);
      }
    }
  }

  // Auto-initialize when script loads
  window.EmbedChat = EmbedChat;

  // Function to initialize widget with configuration
  function initializeEmbedChat(config) {
    // Remove existing widget if any
    const existingContainer = document.getElementById('embed-chat-container');
    if (existingContainer) {
      existingContainer.remove();
    }

    // Create new widget with configuration
    new EmbedChat(config);
  }

  // Function to handle configuration updates
  window.updateEmbedChatConfig = function(newConfig) {
    if (window.EMBED_CHAT_CONFIG) {
      // Merge with existing config
      window.EMBED_CHAT_CONFIG = { ...window.EMBED_CHAT_CONFIG, ...newConfig };
    } else {
      window.EMBED_CHAT_CONFIG = newConfig;
    }
    initializeEmbedChat(window.EMBED_CHAT_CONFIG);
  };

  // Wait for DOM to be ready, then look for configuration
  function initializeWhenReady() {
    // Look for configuration in window.EMBED_CHAT_CONFIG
    if (window.EMBED_CHAT_CONFIG) {
      console.log('chatzku Embed Chat: Initializing with configuration:', window.EMBED_CHAT_CONFIG);
      initializeEmbedChat(window.EMBED_CHAT_CONFIG);
    } else {
      console.log('chatzku Embed Chat: No configuration found in window.EMBED_CHAT_CONFIG');
    }
  }

  // Initialize immediately if DOM is ready, otherwise wait for DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeWhenReady);
  } else {
    // DOM is already ready
    initializeWhenReady();
  }

})(window, document);