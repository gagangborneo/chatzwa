/**
 * Chatbot Floating Widget JavaScript
 * Handles frontend chat functionality
 */

(function($) {
    'use strict';

    // Main Chatbot Widget Class
    function ChatbotWidget(config) {
        this.config = config;
        this.isOpen = false;
        this.messages = [];
        this.isTyping = false;
        this.sessionId = this.generateSessionId();
        this.init();
    }

    // Initialize widget
    ChatbotWidget.prototype.init = function() {
        var self = this;

        // Delay loading if specified
        if (this.config.advanced.delayLoad > 0) {
            setTimeout(function() {
                self.createWidget();
                self.bindEvents();
            }, this.config.advanced.delayLoad);
        } else {
            this.createWidget();
            this.bindEvents();
        }

        // Auto-open if enabled
        if (this.config.settings.autoOpen) {
            setTimeout(function() {
                self.openChat();
            }, 2000);
        }
    };

    // Create widget HTML
    ChatbotWidget.prototype.createWidget = function() {
        var container = document.getElementById('chatbot-widget-container');
        if (!container) return;

        container.innerHTML = this.getWidgetHTML();

        // Apply theme dynamically
        this.applyTheme();

        // Log debug info if enabled
        if (this.config.advanced.debugMode) {
            console.log('Chatbot Widget initialized:', this.config);
        }
    };

    // Get widget HTML
    ChatbotWidget.prototype.getWidgetHTML = function() {
        return '<div class="chatbot-widget ' + this.config.position + '">' +
            '<button class="chatbot-button" id="chatbot-toggle" aria-label="Open chat">' +
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
                    '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>' +
                '</svg>' +
                '<div class="status-dot"></div>' +
            '</button>' +

            '<div class="chatbot-container" id="chatbot-container">' +
                '<div class="chatbot-header">' +
                    '<h3>' + this.escapeHtml(this.config.settings.widgetTitle) + '</h3>' +
                    '<button class="chatbot-close" id="chatbot-close" aria-label="Close chat">' +
                        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
                            '<line x1="18" y1="6" x2="6" y2="18"></line>' +
                            '<line x1="6" y1="6" x2="18" y2="18"></line>' +
                        '</svg>' +
                    '</button>' +
                '</div>' +

                '<div class="chatbot-messages" id="chatbot-messages">' +
                    '<div class="chatbot-message bot">' +
                        '<div class="chatbot-message-content">' +
                            this.escapeHtml(this.config.settings.welcomeMessage) +
                        '</div>' +
                        '<div class="chatbot-message-time">' + this.formatTime(new Date()) + '</div>' +
                    '</div>' +
                '</div>' +

                '<div class="chatbot-input">' +
                    '<form class="chatbot-input-form" id="chatbot-form">' +
                        '<input type="text" class="chatbot-input-field" id="chatbot-input" ' +
                               'placeholder="' + this.escapeHtml(this.config.settings.placeholder) + '" ' +
                               'autocomplete="off" maxlength="500" />' +
                        '<button type="submit" class="chatbot-send-button" id="chatbot-send">' +
                            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
                                '<line x1="22" y1="2" x2="11" y2="13"></line>' +
                                '<polygon points="22 2 15 22 11 13 2 22 2 2"></polygon>' +
                            '</svg>' +
                        '</button>' +
                    '</form>' +
                '</div>' +
            '</div>' +
        '</div>';
    };

    // Apply theme colors
    ChatbotWidget.prototype.applyTheme = function() {
        var customStyles = '' +
            '.chatbot-header { background-color: ' + this.config.theme.primaryColor + ' !important; }' +
            '.chatbot-header h3, .chatbot-close { color: ' + this.config.theme.textColor + ' !important; }' +
            '.chatbot-button { background-color: ' + this.config.theme.buttonColor + ' !important; }' +
            '.chatbot-message.user .chatbot-message-content {' +
                'background-color: ' + this.config.theme.primaryColor + ' !important;' +
                'color: ' + this.config.theme.textColor + ' !important;' +
            '}' +
            '.chatbot-send-button { background-color: ' + this.config.theme.primaryColor + ' !important; }' +
            '.chatbot-input-field:focus { border-color: ' + this.config.theme.primaryColor + ' !important; }';

        var styleElement = document.createElement('style');
        styleElement.textContent = customStyles;
        styleElement.setAttribute('id', 'chatbot-widget-dynamic-styles');
        document.head.appendChild(styleElement);
    };

    // Bind event handlers
    ChatbotWidget.prototype.bindEvents = function() {
        var self = this;
        var toggleBtn = document.getElementById('chatbot-toggle');
        var closeBtn = document.getElementById('chatbot-close');
        var container = document.getElementById('chatbot-container');
        var form = document.getElementById('chatbot-form');
        var input = document.getElementById('chatbot-input');

        // Toggle chat
        if (toggleBtn) {
            toggleBtn.addEventListener('click', function(e) {
                e.preventDefault();
                self.toggleChat();
            });
        }

        // Close chat
        if (closeBtn) {
            closeBtn.addEventListener('click', function(e) {
                e.preventDefault();
                self.closeChat();
            });
        }

        // Close when clicking outside
        if (container) {
            document.addEventListener('click', function(e) {
                if (!container.contains(e.target) && !toggleBtn.contains(e.target)) {
                    self.closeChat();
                }
            });
        }

        // Form submission
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                self.sendMessage();
            });
        }

        // Enter key to send
        if (input) {
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    self.sendMessage();
                }
            });

            // Auto-resize input if needed
            input.addEventListener('input', function() {
                if (this.scrollHeight > this.clientHeight) {
                    this.style.height = 'auto';
                    this.style.height = this.scrollHeight + 'px';
                }
            });
        }

        // Escape key to close
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && self.isOpen) {
                self.closeChat();
            }
        });

        // Handle window resize
        window.addEventListener('resize', function() {
            self.handleResize();
        });
    };

    // Toggle chat open/closed
    ChatbotWidget.prototype.toggleChat = function() {
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    };

    // Open chat
    ChatbotWidget.prototype.openChat = function() {
        var container = document.getElementById('chatbot-container');
        if (container) {
            container.classList.add('active');
            this.isOpen = true;

            // Focus input after opening
            setTimeout(function() {
                var input = document.getElementById('chatbot-input');
                if (input) {
                    input.focus();
                }
            }, 300);

            // Track analytics if available
            this.trackEvent('chat_opened');
        }
    };

    // Close chat
    ChatbotWidget.prototype.closeChat = function() {
        var container = document.getElementById('chatbot-container');
        if (container) {
            container.classList.remove('active');
            this.isOpen = false;
            this.trackEvent('chat_closed');
        }
    };

    // Send message
    ChatbotWidget.prototype.sendMessage = function() {
        var input = document.getElementById('chatbot-input');
        var sendBtn = document.getElementById('chatbot-send');

        if (!input || !input.value.trim()) return;

        var message = input.value.trim();
        input.value = '';
        input.style.height = 'auto';

        // Add user message
        this.addMessage(message, 'user');
        this.trackEvent('message_sent', { message_length: message.length });

        // Disable send button
        if (sendBtn) {
            sendBtn.disabled = true;
        }

        // Show typing indicator
        this.showTyping();

        // Send to API
        this.sendToAPI(message)
            .then(function(response) {
                this.hideTyping();
                if (response.success) {
                    this.addMessage(response.response, 'bot');
                    this.trackEvent('message_received');
                } else {
                    this.addMessage(this.getErrorMessage(response.error), 'bot');
                    this.trackEvent('api_error', { error: response.error });
                }
            }.bind(this))
            .catch(function(error) {
                this.hideTyping();
                console.error('Chatbot API error:', error);
                this.addMessage(this.getErrorMessage('connection_error'), 'bot');
                this.trackEvent('connection_error');
            }.bind(this))
            .finally(function() {
                // Re-enable send button
                if (sendBtn) {
                    sendBtn.disabled = false;
                }
            });
    };

    // Send message to API
    ChatbotWidget.prototype.sendToAPI = function(message) {
        return new Promise(function(resolve, reject) {
            var payload = {
                message: message,
                chatbotId: this.config.chatbot_id || 'default',
                source: 'wordpress',
                sessionId: this.sessionId,
                siteUrl: this.config.site_url,
                userAgent: navigator.userAgent,
                timestamp: new Date().toISOString()
            };

            fetch(this.config.api_url + '/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.config.api_key
                },
                body: JSON.stringify(payload)
            })
            .then(function(response) {
                if (!response.ok) {
                    throw new Error('HTTP ' + response.status + ': ' + response.statusText);
                }
                return response.json();
            })
            .then(function(data) {
                resolve(data);
            })
            .catch(function(error) {
                reject(error);
            });
        }.bind(this));
    };

    // Add message to chat
    ChatbotWidget.prototype.addMessage = function(content, type) {
        var messagesContainer = document.getElementById('chatbot-messages');
        if (!messagesContainer) return;

        var messageDiv = document.createElement('div');
        messageDiv.className = 'chatbot-message ' + type;
        messageDiv.innerHTML =
            '<div class="chatbot-message-content">' +
                this.processMessageContent(content) +
            '</div>' +
            '<div class="chatbot-message-time">' + this.formatTime(new Date()) + '</div>';

        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Store message
        this.messages.push({
            content: content,
            type: type,
            timestamp: new Date().toISOString()
        });
    };

    // Process message content (handle markdown, links, etc.)
    ChatbotWidget.prototype.processMessageContent = function(content) {
        // Basic HTML escaping
        content = this.escapeHtml(content);

        // Convert line breaks
        content = content.replace(/\n/g, '<br>');

        // Convert URLs to links (basic)
        var urlRegex = /(https?:\/\/[^\s]+)/g;
        content = content.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');

        return content;
    };

    // Show typing indicator
    ChatbotWidget.prototype.showTyping = function() {
        var messagesContainer = document.getElementById('chatbot-messages');
        if (!messagesContainer) return;

        if (this.isTyping) return;

        this.isTyping = true;

        var typingDiv = document.createElement('div');
        typingDiv.className = 'chatbot-typing';
        typingDiv.id = 'chatbot-typing';
        typingDiv.innerHTML =
            '<div class="chatbot-typing-dot"></div>' +
            '<div class="chatbot-typing-dot"></div>' +
            '<div class="chatbot-typing-dot"></div>';

        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    };

    // Hide typing indicator
    ChatbotWidget.prototype.hideTyping = function() {
        var typingIndicator = document.getElementById('chatbot-typing');
        if (typingIndicator) {
            typingIndicator.remove();
        }
        this.isTyping = false;
    };

    // Generate session ID
    ChatbotWidget.prototype.generateSessionId = function() {
        var sessionId = 'wp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        try {
            localStorage.setItem('chatbot_session_id', sessionId);
        } catch (e) {
            // Ignore localStorage errors
        }
        return sessionId;
    };

    // Format time
    ChatbotWidget.prototype.formatTime = function(date) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Escape HTML
    ChatbotWidget.prototype.escapeHtml = function(text) {
        var div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    };

    // Get error message
    ChatbotWidget.prototype.getErrorMessage = function(error) {
        var messages = {
            'connection_error': 'Sorry, I\'m having trouble connecting. Please try again later.',
            'api_error': 'Sorry, I encountered an error. Please try again.',
            'rate_limit': 'Please wait a moment before sending another message.',
            'invalid_request': 'There was an issue with your request. Please try again.'
        };

        return messages[error] || 'Sorry, something went wrong. Please try again.';
    };

    // Handle window resize
    ChatbotWidget.prototype.handleResize = function() {
        // Adjust widget position on small screens
        if (window.innerWidth < 768 && !this.config.settings.showOnMobile) {
            this.closeChat();
        }
    };

    // Track analytics (basic implementation)
    ChatbotWidget.prototype.trackEvent = function(event, data) {
        if (!this.config.advanced.debugMode) return;

        // Log to console in debug mode
        console.log('Chatbot Event:', event, data);

        // Here you could integrate with Google Analytics, Mixpanel, etc.
        if (typeof gtag !== 'undefined') {
            gtag('event', 'chatbot_' + event, {
                'custom_parameter_1': this.config.site_url,
                'custom_parameter_2': data ? JSON.stringify(data) : undefined
            });
        }
    };

    // Initialize when DOM is ready
    function initChatbotWidget() {
        if (typeof chatbot_widget_config !== 'undefined') {
            new ChatbotWidget(chatbot_widget_config);
        }
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initChatbotWidget);
    } else {
        initChatbotWidget();
    }

    // Handle page visibility changes
    document.addEventListener('visibilitychange', function() {
        if (document.hidden && window.chatbotWidget && window.chatbotWidget.isOpen) {
            // Optional: Auto-close when page becomes hidden
            // window.chatbotWidget.closeChat();
        }
    });

})(jQuery);