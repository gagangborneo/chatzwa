import React, { useState, useEffect, useRef, useCallback } from 'react';

const EmbedChatWidget = ({
  // API Configuration
  apiUrl = 'http://localhost:3000',
  apiKey,
  userId = null,

  // Appearance
  position = 'bottom-right',
  theme = 'light',
  primaryColor = '#22c55e',
  title = 'Customer Support',
  subtitle = 'Kami siap membantu Anda',
  welcomeMessage = 'Halo! Ada yang bisa saya bantu?',
  placeholder = 'Ketik pesan Anda...',

  // Behavior
  autoOpen = false,
  delay = 2000,
  showOnLoad = false
}) => {
  // State
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showBackdrop, setShowBackdrop] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [retryCount, setRetryCount] = useState(0);

  // Refs
  const messagesContainerRef = useRef(null);
  const inputFieldRef = useRef(null);

  // Check if mobile
  const isMobile = typeof window !== 'undefined' && (
    window.innerWidth <= 480 ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  );

  // Color adjustment utility
  const adjustColor = (color, amount) => {
    const num = parseInt(color.replace('#', ''), 16);
    const r = Math.max(0, Math.min(255, (num >> 16) + amount));
    const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount));
    const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  };

  // Add message to chat
  const addMessage = useCallback((text, sender) => {
    setMessages(prev => [...prev, { text, sender }]);
  }, []);

  // Scroll to bottom
  const scrollToBottom = useCallback(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, []);

  // Auto resize textarea
  const autoResize = useCallback(() => {
    if (inputFieldRef.current) {
      inputFieldRef.current.style.height = 'auto';
      inputFieldRef.current.style.height = Math.min(inputFieldRef.current.scrollHeight, 120) + 'px';
    }
  }, []);

  // Send message to API
  const sendToAPI = useCallback(async (message) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch(`${apiUrl}/api/embed-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          sessionId,
          widgetId: apiKey,
          url: typeof window !== 'undefined' ? window.location.href : '',
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
          userId
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result || typeof result.message !== 'string') {
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
  }, [apiUrl, sessionId, apiKey, userId]);

  // Send message
  const sendMessage = useCallback(async () => {
    const message = inputMessage.trim();
    if (!message || isSending) return;

    addMessage(message, 'user');
    setInputMessage('');
    setIsSending(true);
    setIsTyping(true);

    try {
      const response = await sendToAPI(message);

      if (response.message) {
        addMessage(response.message, 'bot');
      } else {
        addMessage('Maaf, saya tidak dapat memproses pesan Anda saat ini.', 'bot');
      }

      setRetryCount(0);
    } catch (error) {
      console.error('Error sending message:', error);

      let errorMessage = 'Maaf, terjadi kesalahan. Silakan coba lagi nanti.';

      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        errorMessage = 'Maaf, tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
      } else if (error.message.includes('HTTP error! status: 500')) {
        errorMessage = 'Maaf, terjadi kesalahan pada server. Silakan coba lagi dalam beberapa saat.';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Maaf, server terlalu lama merespons. Silakan coba lagi.';
      }

      addMessage(errorMessage, 'bot');
    } finally {
      setIsTyping(false);
      setIsSending(false);
      setTimeout(() => {
        inputFieldRef.current?.focus();
      }, 100);
    }
  }, [inputMessage, isSending, addMessage, sendToAPI]);

  // Toggle chat
  const toggleChat = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  // Open chat
  const openChat = useCallback(() => {
    setIsOpen(true);
    setTimeout(() => {
      inputFieldRef.current?.focus();
    }, 100);

    if (isMobile) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        setShowBackdrop(true);
      }, 10);
    }
  }, [isMobile]);

  // Close chat
  const closeChat = useCallback(() => {
    setIsOpen(false);
    setShowBackdrop(false);

    if (isMobile) {
      document.body.style.overflow = '';
    }
  }, [isMobile]);

  // Handle escape key
  const handleEscape = useCallback((event) => {
    if (event.key === 'Escape' && isOpen) {
      closeChat();
    }
  }, [isOpen, closeChat]);

  // Handle orientation change
  const handleOrientationChange = useCallback(() => {
    if (isOpen && isMobile) {
      setTimeout(() => {
        inputFieldRef.current?.focus();
      }, 100);
    }
  }, [isOpen, isMobile]);

  // Handle input change
  const handleInputChange = useCallback((e) => {
    setInputMessage(e.target.value);
    autoResize();
  }, [autoResize]);

  // Handle key down
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }, [sendMessage]);

  // Effects
  useEffect(() => {
    // Show widget after delay
    const timer = setTimeout(() => {
      if (showOnLoad) {
        openChat();
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [showOnLoad, delay, openChat]);

  useEffect(() => {
    // Add welcome message
    if (welcomeMessage) {
      const welcomeTimer = setTimeout(() => {
        addMessage(welcomeMessage, 'bot');
      }, 500);

      return () => clearTimeout(welcomeTimer);
    }
  }, [welcomeMessage, addMessage]);

  useEffect(() => {
    // Event listeners
    document.addEventListener('keydown', handleEscape);
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleOrientationChange);
    };
  }, [handleEscape, handleOrientationChange]);

  useEffect(() => {
    // Scroll to bottom when messages change
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Position styles
  const getPositionStyles = () => {
    const offset = { bottom: 30, right: 30, left: 30, top: 30 };
    let styles = {};

    switch (position) {
      case 'bottom-right':
        styles = { bottom: offset.bottom, right: offset.right };
        break;
      case 'bottom-left':
        styles = { bottom: offset.bottom, left: offset.left };
        break;
      case 'top-right':
        styles = { top: offset.top, right: offset.right };
        break;
      case 'top-left':
        styles = { top: offset.top, left: offset.left };
        break;
    }

    return styles;
  };

  const positionStyles = getPositionStyles();
  const primaryColorDark = adjustColor(primaryColor, -20);

  return (
    <div
      className={`embed-chat-widget embed-chat-position-${position} embed-chat-theme-${theme} ${isMobile ? 'embed-chat-mobile' : ''}`}
      style={positionStyles}
    >
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="embed-chat-button"
          style={{
            '--primary-color': primaryColor,
            '--primary-color-dark': primaryColorDark,
            ...positionStyles
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          <div className="embed-chat-status-indicator"></div>
        </button>
      )}

      {/* Chat Window */}
      <div
        className={`embed-chat-window ${isOpen ? 'open' : ''}`}
        style={{
          '--primary-color': primaryColor,
          '--primary-color-dark': primaryColorDark,
          ...(position === 'bottom-right' || position === 'bottom-left' ? { bottom: 90 } : { top: 90 }),
          ...(position === 'bottom-right' || position === 'top-right' ? { right: 0 } : { left: 0 })
        }}
      >
        {/* Header */}
        <div
          className="embed-chat-header"
          style={{
            background: `linear-gradient(135deg, ${primaryColor}, ${primaryColorDark})`
          }}
        >
          <div className="embed-chat-header-info">
            <div className="embed-chat-header-avatar">AI</div>
            <div>
              <h3>{title}</h3>
              <p>{subtitle}</p>
            </div>
          </div>
          <button onClick={closeChat} className="embed-chat-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="embed-chat-messages" ref={messagesContainerRef}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`embed-chat-message ${message.sender}`}
            >
              {message.sender === 'bot' && (
                <div className="embed-chat-message-sender">
                  {title}
                </div>
              )}
              <div className="embed-chat-message-content">
                {message.text}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="embed-chat-message bot">
              <div className="embed-chat-message-sender">{title}</div>
              <div className="embed-chat-message-content">
                <div className="embed-chat-typing">
                  <div className="embed-chat-typing-dot"></div>
                  <div className="embed-chat-typing-dot"></div>
                  <div className="embed-chat-typing-dot"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="embed-chat-input">
          <div className="embed-chat-input-container">
            <textarea
              ref={inputFieldRef}
              value={inputMessage}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="embed-chat-input-field"
              rows="1"
              style={{
                '--primary-color': primaryColor
              }}
            />
            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isSending}
              className="embed-chat-send"
              style={{
                background: `linear-gradient(135deg, ${primaryColor}, ${primaryColorDark})`
              }}
            >
              {!isSending ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22,2 15,22 11,13 2,9 22,2"/>
                </svg>
              ) : (
                <div className="embed-chat-loading-spinner">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 11-6.219-8.56"/>
                  </svg>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Backdrop */}
      {isOpen && isMobile && (
        <div
          className={`embed-chat-backdrop ${showBackdrop ? 'show' : ''}`}
          onClick={closeChat}
        />
      )}

      <style jsx>{`
        .embed-chat-widget {
          position: fixed;
          z-index: 999999;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
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
          transform: scale(0.9) translateY(30px);
          opacity: 0;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .embed-chat-window.open {
          transform: scale(1) translateY(0);
          opacity: 1;
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
      `}</style>
    </div>
  );
};

export default EmbedChatWidget;