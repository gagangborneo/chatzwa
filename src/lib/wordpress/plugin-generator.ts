/**
 * WordPress Plugin Generator
 * Generates customizable WordPress plugin files for chatbot integration
 */

export interface WordPressPluginConfig {
  pluginName: string
  pluginDescription: string
  pluginAuthor: string
  pluginAuthorUrl: string
  pluginVersion: string
  chatbotApiUrl: string
  apiKey: string
  theme: {
    primaryColor: string
    secondaryColor: string
    textColor: string
    backgroundColor: string
    buttonColor: string
  }
  settings: {
    position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
    showOnMobile: boolean
    autoOpen: boolean
    welcomeMessage: string
    placeholder: string
  }
}

export class WordPressPluginGenerator {
  private config: WordPressPluginConfig

  constructor(config: WordPressPluginConfig) {
    this.config = config
  }

  generatePluginFiles(): Record<string, string> {
    return {
      'chatbot-plugin.php': this.generateMainPluginFile(),
      'includes/chatbot-widget.php': this.generateWidgetFile(),
      'includes/chatbot-settings.php': this.generateSettingsFile(),
      'assets/chatbot-widget.css': this.generateCSSFile(),
      'assets/chatbot-widget.js': this.generateJSFile(),
      'readme.txt': this.generateReadmeFile(),
    }
  }

  private generateMainPluginFile(): string {
    return `<?php
/**
 * Plugin Name: ${this.config.pluginName}
 * Plugin URI: ${this.config.pluginAuthorUrl}
 * Description: ${this.config.pluginDescription}
 * Version: ${this.config.pluginVersion}
 * Author: ${this.config.pluginAuthor}
 * Author URI: ${this.config.pluginAuthorUrl}
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: ${this.config.pluginName.toLowerCase().replace(/\s+/g, '-')}
 */

// Prevent direct file access
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('CHATBOT_PLUGIN_VERSION', '${this.config.pluginVersion}');
define('CHATBOT_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('CHATBOT_PLUGIN_URL', plugin_dir_url(__FILE__));

// Include required files
require_once CHATBOT_PLUGIN_DIR . 'includes/chatbot-widget.php';
require_once CHATBOT_PLUGIN_DIR . 'includes/chatbot-settings.php';

/**
 * Main plugin class
 */
class ChatbotPlugin {
    private $api_url;
    private $api_key;
    private $options;

    public function __construct() {
        $this->options = get_option('chatbot_settings', []);
        $this->api_url = $this->options['api_url'] ?? '${this.config.chatbotApiUrl}';
        $this->api_key = $this->options['api_key'] ?? '${this.config.apiKey}';

        add_action('init', [$this, 'init']);
        add_action('wp_enqueue_scripts', [$this, 'enqueue_scripts']);
        add_action('wp_footer', [$this, 'render_chatbot_widget']);
        add_action('admin_menu', [$this, 'add_admin_menu']);
        add_action('admin_init', [$this, 'register_settings']);

        // Register activation and deactivation hooks
        register_activation_hook(__FILE__, [$this, 'activate']);
        register_deactivation_hook(__FILE__, [$this, 'deactivate']);
    }

    public function init() {
        // Initialize plugin
        load_plugin_textdomain('${this.config.pluginName.toLowerCase().replace(/\s+/g, '-')}', false, dirname(plugin_basename(__FILE__)) . '/languages');
    }

    public function enqueue_scripts() {
        // Only load on frontend
        if (!is_admin()) {
            wp_enqueue_style('chatbot-widget', CHATBOT_PLUGIN_URL . 'assets/chatbot-widget.css', [], CHATBOT_PLUGIN_VERSION);
            wp_enqueue_script('chatbot-widget', CHATBOT_PLUGIN_URL . 'assets/chatbot-widget.js', ['jquery'], CHATBOT_PLUGIN_VERSION, true);

            // Pass configuration to JavaScript
            wp_localize_script('chatbot-widget', 'chatbot_config', [
                'api_url' => esc_url($this->api_url),
                'api_key' => esc_attr($this->api_key),
                'theme' => $this->options['theme'] ?? $this->getDefaultTheme(),
                'settings' => $this->options['settings'] ?? $this->getDefaultSettings(),
                'ajax_url' => admin_url('admin-ajax.php'),
                'nonce' => wp_create_nonce('chatbot_nonce'),
            ]);
        }
    }

    public function render_chatbot_widget() {
        if (!is_admin() && $this->is_chatbot_enabled()) {
            echo '<div id="chatbot-widget-container"></div>';
        }
    }

    public function add_admin_menu() {
        add_menu_page(
            __('Chatbot Settings', '${this.config.pluginName.toLowerCase().replace(/\s+/g, '-')}'),
            __('Chatbot', '${this.config.pluginName.toLowerCase().replace(/\s+/g, '-')}'),
            'manage_options',
            'chatbot-settings',
            [$this, 'render_settings_page']
        );
    }

    public function register_settings() {
        register_setting('chatbot_settings', 'chatbot_settings');
    }

    private function is_chatbot_enabled() {
        return !empty($this->api_url) && !empty($this->api_key);
    }

    private function getDefaultTheme() {
        return ${JSON.stringify(this.config.theme)};
    }

    private function getDefaultSettings() {
        return ${JSON.stringify(this.config.settings)};
    }

    public function activate() {
        // Set default options
        if (!get_option('chatbot_settings')) {
            $default_settings = [
                'api_url' => '${this.config.chatbotApiUrl}',
                'api_key' => '${this.config.apiKey}',
                'theme' => $this->getDefaultTheme(),
                'settings' => $this->getDefaultSettings(),
            ];
            update_option('chatbot_settings', $default_settings);
        }
    }

    public function deactivate() {
        // Cleanup on deactivation if needed
    }
}

// Initialize the plugin
new ChatbotPlugin();
`
  }

  private generateWidgetFile(): string {
    return `<?php
/**
 * Chatbot Widget functionality
 */

if (!defined('ABSPATH')) {
    exit;
}

class ChatbotWidget {

    public static function render_widget() {
        $options = get_option('chatbot_settings', []);
        $theme = $options['theme'] ?? [];
        $settings = $options['settings'] ?? [];

        ob_start();
        ?>
        <div id="chatbot-widget-container"></div>
        <?php
        return ob_get_clean();
    }

    public static function get_widget_config() {
        $options = get_option('chatbot_settings', []);

        return [
            'api_url' => $options['api_url'] ?? '',
            'api_key' => $options['api_key'] ?? '',
            'theme' => $options['theme'] ?? [],
            'settings' => $options['settings'] ?? [],
        ];
    }
}
`
  }

  private generateSettingsFile(): string {
    return `<?php
/**
 * Chatbot Settings Page
 */

if (!defined('ABSPATH')) {
    exit;
}

class ChatbotSettingsPage {

    public function render_settings_page() {
        ?>
        <div class="wrap">
            <h1><?php _e('Chatbot Settings', '${this.config.pluginName.toLowerCase().replace(/\s+/g, '-')}'); ?></h1>

            <form method="post" action="options.php">
                <?php
                settings_fields('chatbot_settings');
                do_settings_sections('chatbot_settings');
                ?>

                <table class="form-table">
                    <tr>
                        <th scope="row">
                            <label for="chatbot_api_url"><?php _e('API URL', '${this.config.pluginName.toLowerCase().replace(/\s+/g, '-')}'); ?></label>
                        </th>
                        <td>
                            <input type="url"
                                   id="chatbot_api_url"
                                   name="chatbot_settings[api_url]"
                                   value="<?php echo esc_attr(get_option('chatbot_settings')['api_url'] ?? ''); ?>"
                                   class="regular-text"
                                   placeholder="https://your-chatbot-api.com/api" />
                            <p class="description"><?php _e('Enter your chatbot API URL', '${this.config.pluginName.toLowerCase().replace(/\s+/g, '-')}'); ?></p>
                        </td>
                    </tr>

                    <tr>
                        <th scope="row">
                            <label for="chatbot_api_key"><?php _e('API Key', '${this.config.pluginName.toLowerCase().replace(/\s+/g, '-')}'); ?></label>
                        </th>
                        <td>
                            <input type="text"
                                   id="chatbot_api_key"
                                   name="chatbot_settings[api_key]"
                                   value="<?php echo esc_attr(get_option('chatbot_settings')['api_key'] ?? ''); ?>"
                                   class="regular-text" />
                            <p class="description"><?php _e('Enter your chatbot API key', '${this.config.pluginName.toLowerCase().replace(/\s+/g, '-')}'); ?></p>
                        </td>
                    </tr>

                    <tr>
                        <th scope="row">
                            <label for="chatbot_position"><?php _e('Widget Position', '${this.config.pluginName.toLowerCase().replace(/\s+/g, '-')}'); ?></label>
                        </th>
                        <td>
                            <select id="chatbot_position" name="chatbot_settings[settings][position]">
                                <option value="bottom-right" <?php selected(get_option('chatbot_settings')['settings']['position'] ?? 'bottom-right', 'bottom-right'); ?>>
                                    <?php _e('Bottom Right', '${this.config.pluginName.toLowerCase().replace(/\s+/g, '-')}'); ?>
                                </option>
                                <option value="bottom-left" <?php selected(get_option('chatbot_settings')['settings']['position'] ?? 'bottom-right', 'bottom-left'); ?>>
                                    <?php _e('Bottom Left', '${this.config.pluginName.toLowerCase().replace(/\s+/g, '-')}'); ?>
                                </option>
                                <option value="top-right" <?php selected(get_option('chatbot_settings')['settings']['position'] ?? 'bottom-right', 'top-right'); ?>>
                                    <?php _e('Top Right', '${this.config.pluginName.toLowerCase().replace(/\s+/g, '-')}'); ?>
                                </option>
                                <option value="top-left" <?php selected(get_option('chatbot_settings')['settings']['position'] ?? 'bottom-right', 'top-left'); ?>>
                                    <?php _e('Top Left', '${this.config.pluginName.toLowerCase().replace(/\s+/g, '-')}'); ?>
                                </option>
                            </select>
                        </td>
                    </tr>

                    <tr>
                        <th scope="row">
                            <label for="chatbot_welcome_message"><?php _e('Welcome Message', '${this.config.pluginName.toLowerCase().replace(/\s+/g, '-')}'); ?></label>
                        </th>
                        <td>
                            <input type="text"
                                   id="chatbot_welcome_message"
                                   name="chatbot_settings[settings][welcome_message]"
                                   value="<?php echo esc_attr(get_option('chatbot_settings')['settings']['welcome_message'] ?? '${this.config.settings.welcomeMessage}'); ?>"
                                   class="regular-text" />
                            <p class="description"><?php _e('Message shown when chatbot opens', '${this.config.pluginName.toLowerCase().replace(/\s+/g, '-')}'); ?></p>
                        </td>
                    </tr>

                    <tr>
                        <th scope="row">
                            <label for="chatbot_placeholder"><?php _e('Input Placeholder', '${this.config.pluginName.toLowerCase().replace(/\s+/g, '-')}'); ?></label>
                        </th>
                        <td>
                            <input type="text"
                                   id="chatbot_placeholder"
                                   name="chatbot_settings[settings][placeholder]"
                                   value="<?php echo esc_attr(get_option('chatbot_settings')['settings']['placeholder'] ?? '${this.config.settings.placeholder}'); ?>"
                                   class="regular-text" />
                            <p class="description"><?php _e('Placeholder text for chat input', '${this.config.pluginName.toLowerCase().replace(/\s+/g, '-')}'); ?></p>
                        </td>
                    </tr>

                    <tr>
                        <th scope="row">
                            <label for="chatbot_show_on_mobile"><?php _e('Show on Mobile', '${this.config.pluginName.toLowerCase().replace(/\s+/g, '-')}'); ?></label>
                        </th>
                        <td>
                            <input type="checkbox"
                                   id="chatbot_show_on_mobile"
                                   name="chatbot_settings[settings][showOnMobile]"
                                   value="1"
                                   <?php checked(get_option('chatbot_settings')['settings']['showOnMobile'] ?? true); ?> />
                            <label for="chatbot_show_on_mobile"><?php _e('Display chatbot on mobile devices', '${this.config.pluginName.toLowerCase().replace(/\s+/g, '-')}'); ?></label>
                        </td>
                    </tr>

                    <tr>
                        <th scope="row">
                            <label for="chatbot_auto_open"><?php _e('Auto Open', '${this.config.pluginName.toLowerCase().replace(/\s+/g, '-')}'); ?></label>
                        </th>
                        <td>
                            <input type="checkbox"
                                   id="chatbot_auto_open"
                                   name="chatbot_settings[settings][autoOpen]"
                                   value="1"
                                   <?php checked(get_option('chatbot_settings')['settings']['autoOpen'] ?? false); ?> />
                            <label for="chatbot_auto_open"><?php _e('Automatically open chatbot on page load', '${this.config.pluginName.toLowerCase().replace(/\s+/g, '-')}'); ?></label>
                        </td>
                    </tr>
                </table>

                <!-- Theme Settings -->
                <h2><?php _e('Theme Settings', '${this.config.pluginName.toLowerCase().replace(/\s+/g, '-')}'); ?></h2>
                <table class="form-table">
                    <tr>
                        <th scope="row">
                            <label for="chatbot_primary_color"><?php _e('Primary Color', '${this.config.pluginName.toLowerCase().replace(/\s+/g, '-')}'); ?></label>
                        </th>
                        <td>
                            <input type="color"
                                   id="chatbot_primary_color"
                                   name="chatbot_settings[theme][primaryColor]"
                                   value="<?php echo esc_attr(get_option('chatbot_settings')['theme']['primaryColor'] ?? '${this.config.theme.primaryColor}'); ?>" />
                            <p class="description"><?php _e('Main chat widget color', '${this.config.pluginName.toLowerCase().replace(/\s+/g, '-')}'); ?></p>
                        </td>
                    </tr>

                    <tr>
                        <th scope="row">
                            <label for="chatbot_button_color"><?php _e('Button Color', '${this.config.pluginName.toLowerCase().replace(/\s+/g, '-')}'); ?></label>
                        </th>
                        <td>
                            <input type="color"
                                   id="chatbot_button_color"
                                   name="chatbot_settings[theme][buttonColor]"
                                   value="<?php echo esc_attr(get_option('chatbot_settings')['theme']['buttonColor'] ?? '${this.config.theme.buttonColor}'); ?>" />
                            <p class="description"><?php _e('Chat button color', '${this.config.pluginName.toLowerCase().replace(/\s+/g, '-')}'); ?></p>
                        </td>
                    </tr>

                    <tr>
                        <th scope="row">
                            <label for="chatbot_text_color"><?php _e('Text Color', '${this.config.pluginName.toLowerCase().replace(/\s+/g, '-')}'); ?></label>
                        </th>
                        <td>
                            <input type="color"
                                   id="chatbot_text_color"
                                   name="chatbot_settings[theme][textColor]"
                                   value="<?php echo esc_attr(get_option('chatbot_settings')['theme']['textColor'] ?? '${this.config.theme.textColor}'); ?>" />
                            <p class="description"><?php _e('Chat text color', '${this.config.pluginName.toLowerCase().replace(/\s+/g, '-')}'); ?></p>
                        </td>
                    </tr>
                </table>

                <?php submit_button(); ?>
            </form>
        </div>
        <?php
    }
}
`
  }

  private generateCSSFile(): string {
    return `/* Chatbot Widget Styles */
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
    background-color: ${this.config.theme.buttonColor};
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
    background-color: ${this.config.theme.primaryColor};
    color: ${this.config.theme.textColor};
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
    color: ${this.config.theme.textColor};
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
    background-color: ${this.config.theme.primaryColor};
    color: ${this.config.theme.textColor};
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
    border-color: ${this.config.theme.primaryColor};
}

.chatbot-send-button {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background-color: ${this.config.theme.primaryColor};
    color: white;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;
}

.chatbot-send-button:hover:not(:disabled) {
    background-color: ${this.config.theme.secondaryColor};
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
}

/* Hidden state for mobile when disabled */
.chatbot-widget.mobile-hidden .chatbot-button {
    display: none;
}
`
  }

  private generateJSFile(): string {
    return `/**
 * Chatbot Widget JavaScript
 */

class ChatbotWidget {
    constructor(config) {
        this.config = config;
        this.isOpen = false;
        this.messages = [];
        this.isTyping = false;
        this.init();
    }

    init() {
        this.createWidget();
        this.bindEvents();

        if (this.config.settings.autoOpen) {
            setTimeout(() => this.openChat(), 1000);
        }
    }

    createWidget() {
        const container = document.getElementById('chatbot-widget-container');
        if (!container) return;

        container.innerHTML = \`
            <div class="chatbot-widget \${this.config.settings.position}">
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
                                \${this.config.settings.welcomeMessage}
                            </div>
                            <div class="chatbot-message-time">\${this.formatTime(new Date())}</div>
                        </div>
                    </div>

                    <div class="chatbot-input">
                        <form class="chatbot-input-form" id="chatbot-form">
                            <input
                                type="text"
                                class="chatbot-input-field"
                                id="chatbot-input"
                                placeholder="\${this.config.settings.placeholder}"
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
        \`;

        // Apply theme colors
        this.applyTheme();
    }

    applyTheme() {
        const style = document.createElement('style');
        style.textContent = \`
            .chatbot-header { background-color: \${this.config.theme.primaryColor} !important; }
            .chatbot-header h3, .chatbot-close { color: \${this.config.theme.textColor} !important; }
            .chatbot-button { background-color: \${this.config.theme.buttonColor} !important; }
            .chatbot-message.user .chatbot-message-content {
                background-color: \${this.config.theme.primaryColor} !important;
                color: \${this.config.theme.textColor} !important;
            }
            .chatbot-send-button { background-color: \${this.config.theme.primaryColor} !important; }
            .chatbot-input-field:focus { border-color: \${this.config.theme.primaryColor} !important; }
        \`;
        document.head.appendChild(style);
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
            const response = await fetch(this.config.api_url + '/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': \`Bearer \${this.config.api_key}\`,
                },
                body: JSON.stringify({
                    message: message,
                    source: 'wordpress',
                    sessionId: this.getSessionId(),
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
        messageDiv.className = \`chatbot-message \${type}\`;
        messageDiv.innerHTML = \`
            <div class="chatbot-message-content">\${this.escapeHtml(content)}</div>
            <div class="chatbot-message-time">\${this.formatTime(new Date())}</div>
        \`;

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
        typingDiv.innerHTML = \`
            <div class="chatbot-typing-dot"></div>
            <div class="chatbot-typing-dot"></div>
            <div class="chatbot-typing-dot"></div>
        \`;

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

    getSessionId() {
        let sessionId = localStorage.getItem('chatbot_session_id');
        if (!sessionId) {
            sessionId = 'wp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('chatbot_session_id', sessionId);
        }
        return sessionId;
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

// Initialize chatbot when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    if (typeof chatbot_config !== 'undefined') {
        new ChatbotWidget(chatbot_config);
    }
});
`
  }

  private generateReadmeFile(): string {
    return `=== ${this.config.pluginName} ===
Contributors: ${this.config.pluginAuthor}
Tags: chatbot, ai, assistant, support, chat, widget
Requires at least: 4.7
Tested up to: 6.4
Stable tag: trunk
License: GPLv2 or later

== Description ==

${this.config.pluginDescription}

== Installation ==

1. Upload the plugin files to the \`/wp-content/plugins/${this.config.pluginName.toLowerCase().replace(/\s+/g, '-')}\` directory, or install the plugin through the WordPress plugins screen directly.
2. Activate the plugin through the 'Plugins' screen in WordPress
3. Configure the plugin by going to Settings → Chatbot

== Configuration ==

1. Go to Settings → Chatbot in your WordPress admin dashboard
2. Enter your Chatbot API URL and API Key
3. Customize the widget appearance and behavior
4. Save your settings

== Frequently Asked Questions ==

= How do I get an API Key? =

You need to register for an account at our chatbot service to get your API key and API URL.

= Can I customize the appearance? =

Yes, you can customize colors, position, welcome message, and other settings from the plugin configuration page.

= Does this work with all themes? =

Yes, the plugin is designed to work with any WordPress theme. It uses a fixed position that shouldn't conflict with most themes.

== Screenshots ==

1. Plugin settings page
2. Chat widget on frontend
3. Customization options

== Changelog ==

= 1.0.0 =
* Initial release
* Basic chat functionality
* Customizable appearance
* Mobile responsive design
`
  }

  public generatePluginHTML(config: WordPressPluginConfig, files: Record<string, string>): string {
    return this.createPluginHTML(config, files)
  }

  public static createDownloadablePlugin(config: WordPressPluginConfig): Blob {
    const generator = new WordPressPluginGenerator(config)
    const files = generator.generatePluginFiles()

    // Create a zip file in memory (simplified version)
    const manifestContent = this.createManifest(files)
    const jsContent = files['assets/chatbot-widget.js']
    const cssContent = files['assets/chatbot-widget.css']

    // Create a single HTML file that contains everything for easy distribution
    const pluginHTML = this.createPluginHTML(config, files)

    return new Blob([pluginHTML], { type: 'text/html' })
  }

  private static createManifest(files: Record<string, string>): string {
    const manifest = {
      name: files['chatbot-plugin.php'].match(/Plugin Name: (.+)/)?.[1] || 'Chatbot Plugin',
      version: files['chatbot-plugin.php'].match(/Version: (.+)/)?.[1] || '1.0.0',
      description: files['chatbot-plugin.php'].match(/Description: (.+)/)?.[1] || 'WordPress Chatbot Plugin',
      files: Object.keys(files)
    }

    return JSON.stringify(manifest, null, 2)
  }

  private static createPluginHTML(config: WordPressPluginConfig, files: Record<string, string>): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${config.pluginName} - Installation Instructions</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { background: #23282d; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .code-block { background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 4px; padding: 15px; margin: 10px 0; overflow-x: auto; }
        .file-content { background: #fff; border: 1px solid #ddd; border-radius: 4px; margin: 10px 0; }
        .file-header { background: #f8f9fa; padding: 10px 15px; border-bottom: 1px solid #ddd; font-weight: bold; }
        .file-content pre { margin: 0; padding: 15px; overflow-x: auto; }
        pre { background: #f8f9fa; padding: 0; margin: 0; }
        .download-btn { background: #0073aa; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 10px 0; }
        .download-btn:hover { background: #005a87; }
        .section { margin: 30px 0; }
        .warning { background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 15px; border-radius: 4px; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="header">
        <h1>${config.pluginName}</h1>
        <p>WordPress Plugin - Installation Instructions</p>
        <p><strong>Version:</strong> ${config.pluginVersion}</p>
        <p><strong>Author:</strong> ${config.pluginAuthor}</p>
    </div>

    <div class="section">
        <h2>Installation Instructions</h2>

        <h3>Method 1: Automatic Installation (Recommended)</h3>
        <div class="warning">
            <strong>Note:</strong> This method requires you to first upload this plugin to a WordPress repository or your own server.
        </div>
        <ol>
            <li>Log in to your WordPress admin dashboard</li>
            <li>Navigate to Plugins → Add New</li>
            <li>Upload the plugin ZIP file</li>
            <li>Activate the plugin</li>
            <li>Configure the plugin in Settings → Chatbot</li>
        </ol>

        <h3>Method 2: Manual Installation</h3>
        <ol>
            <li>Create a new folder in \`wp-content/plugins/\` called \`${config.pluginName.toLowerCase().replace(/\s+/g, '-')}\`</li>
            <li>Upload all the plugin files to this folder</li>
            <li>Log in to your WordPress admin dashboard</li>
            <li>Activate the plugin from the Plugins page</li>
            <li>Configure the plugin in Settings → Chatbot</li>
        </ol>
    </div>

    <div class="section">
        <h2>Configuration</h2>
        <p>After activating the plugin:</p>
        <ol>
            <li>Go to <strong>Settings → Chatbot</strong> in your WordPress admin</li>
            <li>Enter your Chatbot API URL (e.g., https://your-chatbot-api.com/api)</li>
            <li>Enter your API Key</li>
            <li>Customize the widget appearance and behavior</li>
            <li>Click "Save Changes"</li>
        </ol>

        <div class="code-block">
            <strong>Default Settings:</strong><br>
            • Widget Position: Bottom Right<br>
            • Welcome Message: "${config.settings.welcomeMessage}"<br>
            • Primary Color: ${config.theme.primaryColor}<br>
            • Mobile Support: Enabled
        </div>
    </div>

    <div class="section">
        <h2>Plugin Files</h2>

        <h3>Main Plugin File: chatbot-plugin.php</h3>
        <div class="file-content">
            <div class="file-header">chatbot-plugin.php</div>
            <pre><code>${this.escapeHtml(files['chatbot-plugin.php'])}</code></pre>
        </div>

        <h3>Widget JavaScript: assets/chatbot-widget.js</h3>
        <div class="file-content">
            <div class="file-header">assets/chatbot-widget.js</div>
            <pre><code>${this.escapeHtml(files['assets/chatbot-widget.js'])}</code></pre>
        </div>

        <h3>Widget Styles: assets/chatbot-widget.css</h3>
        <div class="file-content">
            <div class="file-header">assets/chatbot-widget.css</div>
            <pre><code>${this.escapeHtml(files['assets/chatbot-widget.css'])}</code></pre>
        </div>
    </div>

    <div class="section">
        <h2>Features</h2>
        <ul>
            <li>Floating chat widget with customizable appearance</li>
            <li>Responsive design for mobile and desktop</li>
            <li>Real-time chat integration with your chatbot API</li>
            <li>Customizable colors, position, and messages</li>
            <li>Typing indicators and message timestamps</li>
            <li>Session management for conversation continuity</li>
            <li>Mobile-friendly with optional visibility control</li>
        </ul>
    </div>

    <div class="section">
        <h2>Support</h2>
        <p>For support and documentation, please visit our website or contact the plugin author.</p>
        <p><strong>Author:</strong> ${config.pluginAuthor}</p>
        <p><strong>Website:</strong> ${config.pluginAuthorUrl}</p>
    </div>

    <script>
        // Download functionality for individual files
        function downloadFile(filename, content, mimeType) {
            const blob = new Blob([content], { type: mimeType });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }

        // Add download buttons to file sections
        document.addEventListener('DOMContentLoaded', function() {
            const fileSections = document.querySelectorAll('.file-content');
            fileSections.forEach(function(section) {
                const filename = section.querySelector('.file-header').textContent;
                const codeBlock = section.querySelector('code');
                if (codeBlock) {
                    const downloadBtn = document.createElement('a');
                    downloadBtn.href = '#';
                    downloadBtn.className = 'download-btn';
                    downloadBtn.textContent = 'Download ' + filename;
                    downloadBtn.style.marginTop = '10px';
                    downloadBtn.style.display = 'inline-block';
                    downloadBtn.onclick = function(e) {
                        e.preventDefault();
                        const content = codeBlock.textContent;
                        let mimeType = 'text/plain';
                        if (filename.endsWith('.js')) mimeType = 'application/javascript';
                        else if (filename.endsWith('.css')) mimeType = 'text/css';
                        else if (filename.endsWith('.php')) mimeType = 'application/x-php';
                        downloadFile(filename, content, mimeType);
                    };
                    section.appendChild(downloadBtn);
                }
            });
        });
    </script>
</body>
</html>`
  }

  private static escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

export default WordPressPluginGenerator