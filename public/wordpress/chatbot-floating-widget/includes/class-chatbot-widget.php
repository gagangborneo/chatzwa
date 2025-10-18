<?php
/**
 * Chatbot Widget Class
 * Handles frontend widget functionality
 */

if (!defined('ABSPATH')) {
    exit;
}

class Chatbot_Widget {

    /**
     * Plugin settings
     */
    private $settings;

    /**
     * Constructor
     */
    public function __construct($settings) {
        $this->settings = $settings;

        if ($this->is_widget_enabled()) {
            add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
            add_action('wp_footer', array($this, 'render_widget'));
            add_action('wp_head', array($this, 'add_custom_styles'));
        }
    }

    /**
     * Check if widget should be displayed
     */
    private function is_widget_enabled() {
        if (!$this->settings['enabled']) {
            return false;
        }

        if (empty($this->settings['api_url']) || empty($this->settings['api_key'])) {
            return false;
        }

        // Check page exclusions
        if ($this->should_exclude_current_page()) {
            return false;
        }

        return true;
    }

    /**
     * Check if current page should be excluded
     */
    private function should_exclude_current_page() {
        global $post;

        // Check page exclusions
        if (!empty($this->settings['advanced']['show_only_on_pages']) && !is_page()) {
            return true;
        }

        if (!empty($this->settings['advanced']['exclude_pages'])) {
            $exclude_pages = array_map('trim', explode(',', $this->settings['advanced']['exclude_pages']));
            if (is_page($exclude_pages)) {
                return true;
            }
        }

        // Check post exclusions
        if (!empty($this->settings['advanced']['show_only_on_posts']) && !is_single()) {
            return true;
        }

        if (!empty($this->settings['advanced']['exclude_posts'])) {
            $exclude_posts = array_map('trim', explode(',', $this->settings['advanced']['exclude_posts']));
            if (is_single($exclude_posts)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Enqueue scripts and styles
     */
    public function enqueue_scripts() {
        // Enqueue CSS
        wp_enqueue_style(
            'chatbot-widget-css',
            CHATBOT_FLOATING_WIDGET_URL . 'assets/css/chatbot-widget.css',
            array(),
            CHATBOT_FLOATING_WIDGET_VERSION
        );

        // Enqueue JavaScript
        wp_enqueue_script(
            'chatbot-widget-js',
            CHATBOT_FLOATING_WIDGET_URL . 'assets/js/chatbot-widget.js',
            array('jquery'),
            CHATBOT_FLOATING_WIDGET_VERSION,
            true
        );

        // Pass configuration to JavaScript
        wp_localize_script('chatbot-widget-js', 'chatbot_widget_config', $this->get_js_config());
    }

    /**
     * Get JavaScript configuration
     */
    private function get_js_config() {
        $delay_load = intval($this->settings['advanced']['delay_load']);

        return array(
            'api_url' => esc_url($this->settings['api_url']),
            'api_key' => esc_attr($this->settings['api_key']),
            'position' => esc_attr($this->settings['position']),
            'theme' => array(
                'primaryColor' => esc_attr($this->settings['theme']['primary_color']),
                'secondaryColor' => esc_attr($this->settings['theme']['secondary_color']),
                'textColor' => esc_attr($this->settings['theme']['text_color']),
                'backgroundColor' => esc_attr($this->settings['theme']['background_color']),
                'buttonColor' => esc_attr($this->settings['theme']['button_color']),
            ),
            'settings' => array(
                'showOnMobile' => (bool) $this->settings['settings']['show_on_mobile'],
                'autoOpen' => (bool) $this->settings['settings']['auto_open'],
                'welcomeMessage' => esc_html($this->settings['settings']['welcome_message']),
                'placeholder' => esc_html($this->settings['settings']['placeholder']),
                'widgetTitle' => esc_html($this->settings['settings']['widget_title']),
            ),
            'advanced' => array(
                'delayLoad' => $delay_load * 1000, // Convert to milliseconds
                'debugMode' => (bool) $this->settings['advanced']['debug_mode'],
            ),
            'ajax_url' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('chatbot_widget_nonce'),
            'site_url' => home_url(),
        );
    }

    /**
     * Add custom styles
     */
    public function add_custom_styles() {
        $custom_css = $this->generate_custom_css();
        if (!empty($custom_css)) {
            echo '<style type="text/css" id="chatbot-widget-custom-styles">' . $custom_css . '</style>' . "\n";
        }
    }

    /**
     * Generate custom CSS based on settings
     */
    private function generate_custom_css() {
        $css = '';

        // Custom colors
        if (!empty($this->settings['theme']['primary_color'])) {
            $css .= "
                .chatbot-container .chatbot-header {
                    background-color: {$this->settings['theme']['primary_color']} !important;
                }
                .chatbot-container .chatbot-send-button {
                    background-color: {$this->settings['theme']['primary_color']} !important;
                }
                .chatbot-message.user .chatbot-message-content {
                    background-color: {$this->settings['theme']['primary_color']} !important;
                    color: {$this->settings['theme']['text_color']} !important;
                }";
        }

        if (!empty($this->settings['theme']['button_color'])) {
            $css .= "
                .chatbot-button {
                    background-color: {$this->settings['theme']['button_color']} !important;
                }";
        }

        // Mobile visibility
        if (!$this->settings['settings']['show_on_mobile']) {
            $css .= "
                @media (max-width: 768px) {
                    .chatbot-widget {
                        display: none !important;
                    }
                }";
        }

        return $css;
    }

    /**
     * Render widget HTML
     */
    public function render_widget() {
        if (!$this->is_widget_enabled()) {
            return;
        }

        echo '<div id="chatbot-widget-container"></div>';
    }

    /**
     * Get widget HTML for direct embedding
     */
    public static function get_widget_html($settings = array()) {
        if (empty($settings)) {
            $main_plugin = Chatbot_Floating_Widget::get_instance();
            $settings = $main_plugin->get_settings();
        }

        if (!$settings['enabled'] || empty($settings['api_url']) || empty($settings['api_key'])) {
            return '<!-- Chatbot Widget: Not configured properly -->';
        }

        ob_start();
        ?>
        <div class="chatbot-widget <?php echo esc_attr($settings['position']); ?>">
            <button class="chatbot-button" id="chatbot-toggle" aria-label="Open chat">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <div class="status-dot"></div>
            </button>

            <div class="chatbot-container" id="chatbot-container">
                <div class="chatbot-header">
                    <h3><?php echo esc_html($settings['settings']['widget_title']); ?></h3>
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
                            <?php echo esc_html($settings['settings']['welcome_message']); ?>
                        </div>
                        <div class="chatbot-message-time"><?php echo date('H:i'); ?></div>
                    </div>
                </div>

                <div class="chatbot-input">
                    <form class="chatbot-input-form" id="chatbot-form">
                        <input
                            type="text"
                            class="chatbot-input-field"
                            id="chatbot-input"
                            placeholder="<?php echo esc_attr($settings['settings']['placeholder']); ?>"
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
        <?php
        return ob_get_clean();
    }

    /**
     * AJAX handler for test connection
     */
    public static function ajax_test_connection() {
        check_ajax_referer('chatbot_widget_nonce', 'nonce');

        if (!current_user_can('manage_options')) {
            wp_die(__('You do not have sufficient permissions', 'chatbot-floating-widget'));
        }

        $api_url = sanitize_url($_POST['api_url']);
        $api_key = sanitize_text_field($_POST['api_key']);

        if (empty($api_url) || empty($api_key)) {
            wp_send_json_error(array('message' => __('API URL and API Key are required', 'chatbot-floating-widget')));
        }

        // Test API connection
        $response = wp_remote_post(
            trailingslashit($api_url) . 'test',
            array(
                'body' => json_encode(array(
                    'api_key' => $api_key,
                    'test' => true
                )),
                'headers' => array(
                    'Content-Type' => 'application/json',
                ),
                'timeout' => 15,
            )
        );

        if (is_wp_error($response)) {
            wp_send_json_error(array('message' => $response->get_error_message()));
        }

        $body = wp_remote_retrieve_body($response);
        $data = json_decode($body, true);

        if (isset($data['success']) && $data['success']) {
            wp_send_json_success(array('message' => __('Connection successful!', 'chatbot-floating-widget')));
        } else {
            $error_message = isset($data['message']) ? $data['message'] : __('Connection failed', 'chatbot-floating-widget');
            wp_send_json_error(array('message' => $error_message));
        }
    }
}
add_action('wp_ajax_chatbot_test_connection', array('Chatbot_Widget', 'ajax_test_connection'));
add_action('wp_ajax_nopriv_chatbot_test_connection', array('Chatbot_Widget', 'ajax_test_connection'));