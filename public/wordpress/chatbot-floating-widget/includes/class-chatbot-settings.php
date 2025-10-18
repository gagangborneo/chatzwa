<?php
/**
 * Chatbot Settings Class
 * Handles admin settings page
 */

if (!defined('ABSPATH')) {
    exit;
}

class Chatbot_Settings {

    /**
     * Constructor
     */
    public function __construct() {
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_init', array($this, 'register_settings'));
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_scripts'));
        add_action('wp_ajax_chatbot_test_connection', array($this, 'ajax_test_connection'));
        add_action('wp_ajax_chatbot_export_settings', array($this, 'ajax_export_settings'));
        add_action('wp_ajax_chatbot_import_settings', array($this, 'ajax_import_settings'));
    }

    /**
     * Add admin menu
     */
    public function add_admin_menu() {
        add_options_page(
            __('Chatbot Floating Widget', 'chatbot-floating-widget'),
            __('Chatbot Widget', 'chatbot-floating-widget'),
            'manage_options',
            'chatbot-floating-widget',
            array($this, 'render_settings_page')
        );
    }

    /**
     * Register settings
     */
    public function register_settings() {
        register_setting(
            'chatbot_widget_settings',
            'chatbot_widget_settings',
            array(
                'sanitize_callback' => array($this, 'sanitize_settings'),
                'default' => $this->get_default_settings()
            )
        );

        // Add settings sections
        add_settings_section(
            'chatbot_basic_settings',
            __('Basic Settings', 'chatbot-floating-widget'),
            array($this, 'render_basic_settings_description'),
            'chatbot-floating-widget'
        );

        add_settings_section(
            'chatbot_theme_settings',
            __('Theme Settings', 'chatbot-floating-widget'),
            array($this, 'render_theme_settings_description'),
            'chatbot-floating-widget'
        );

        add_settings_section(
            'chatbot_advanced_settings',
            __('Advanced Settings', 'chatbot-floating-widget'),
            array($this, 'render_advanced_settings_description'),
            'chatbot-floating-widget'
        );

        // Basic settings fields
        add_settings_field(
            'enabled',
            __('Enable Widget', 'chatbot-floating-widget'),
            array($this, 'render_checkbox_field'),
            'chatbot-floating-widget',
            'chatbot_basic_settings',
            array(
                'name' => 'enabled',
                'label' => __('Enable chat widget on frontend', 'chatbot-floating-widget'),
                'description' => __('Turn the chat widget on or off across your site.', 'chatbot-floating-widget')
            )
        );

        add_settings_field(
            'api_url',
            __('API URL', 'chatbot-floating-widget'),
            array($this, 'render_text_field'),
            'chatbot-floating-widget',
            'chatbot_basic_settings',
            array(
                'name' => 'api_url',
                'label' => __('Chatbot API URL', 'chatbot-floating-widget'),
                'description' => __('Enter your chatbot API endpoint URL.', 'chatbot-floating-widget'),
                'placeholder' => 'https://your-chatbot-api.com/api'
            )
        );

        add_settings_field(
            'api_key',
            __('API Key', 'chatbot-floating-widget'),
            array($this, 'render_text_field'),
            'chatbot-floating-widget',
            'chatbot_basic_settings',
            array(
                'name' => 'api_key',
                'label' => __('API Key', 'chatbot-floating-widget'),
                'description' => __('Enter your chatbot API key.', 'chatbot-floating-widget'),
                'type' => 'password'
            )
        );

        add_settings_field(
            'position',
            __('Widget Position', 'chatbot-floating-widget'),
            array($this, 'render_select_field'),
            'chatbot-floating-widget',
            'chatbot_basic_settings',
            array(
                'name' => 'position',
                'label' => __('Position on screen', 'chatbot-floating-widget'),
                'description' => __('Choose where the chat widget appears.', 'chatbot-floating-widget'),
                'options' => array(
                    'bottom-right' => __('Bottom Right', 'chatbot-floating-widget'),
                    'bottom-left' => __('Bottom Left', 'chatbot-floating-widget'),
                    'top-right' => __('Top Right', 'chatbot-floating-widget'),
                    'top-left' => __('Top Left', 'chatbot-floating-widget')
                )
            )
        );

        // Widget settings fields
        add_settings_field(
            'widget_title',
            __('Widget Title', 'chatbot-floating-widget'),
            array($this, 'render_text_field'),
            'chatbot-floating-widget',
            'chatbot_basic_settings',
            array(
                'name' => 'settings[widget_title]',
                'label' => __('Chat widget title', 'chatbot-floating-widget'),
                'description' => __('Title displayed in the chat header.', 'chatbot-floating-widget'),
                'default' => __('Chat Assistant', 'chatbot-floating-widget')
            )
        );

        add_settings_field(
            'welcome_message',
            __('Welcome Message', 'chatbot-floating-widget'),
            array($this, 'render_textarea_field'),
            'chatbot-floating-widget',
            'chatbot_basic_settings',
            array(
                'name' => 'settings[welcome_message]',
                'label' => __('Welcome message', 'chatbot-floating-widget'),
                'description' => __('Message shown when chat opens.', 'chatbot-floating-widget'),
                'default' => __('Hello! How can I help you today?', 'chatbot-floating-widget')
            )
        );

        add_settings_field(
            'placeholder',
            __('Input Placeholder', 'chatbot-floating-widget'),
            array($this, 'render_text_field'),
            'chatbot-floating-widget',
            'chatbot_basic_settings',
            array(
                'name' => 'settings[placeholder]',
                'label' => __('Input placeholder text', 'chatbot-floating-widget'),
                'description' => __('Placeholder text for the message input field.', 'chatbot-floating-widget'),
                'default' => __('Type your message...', 'chatbot-floating-widget')
            )
        );

        add_settings_field(
            'show_on_mobile',
            __('Mobile Display', 'chatbot-floating-widget'),
            array($this, 'render_checkbox_field'),
            'chatbot-floating-widget',
            'chatbot_basic_settings',
            array(
                'name' => 'settings[show_on_mobile]',
                'label' => __('Show on mobile devices', 'chatbot-floating-widget'),
                'description' => __('Display the chat widget on mobile phones and tablets.', 'chatbot-floating-widget')
            )
        );

        add_settings_field(
            'auto_open',
            __('Auto Open', 'chatbot-floating-widget'),
            array($this, 'render_checkbox_field'),
            'chatbot-floating-widget',
            'chatbot_basic_settings',
            array(
                'name' => 'settings[auto_open]',
                'label' => __('Auto-open chat', 'chatbot-floating-widget'),
                'description' => __('Automatically open the chat widget when page loads.', 'chatbot-floating-widget')
            )
        );

        // Theme color fields
        add_settings_field(
            'primary_color',
            __('Primary Color', 'chatbot-floating-widget'),
            array($this, 'render_color_field'),
            'chatbot-floating-widget',
            'chatbot_theme_settings',
            array(
                'name' => 'theme[primary_color]',
                'label' => __('Primary color', 'chatbot-floating-widget'),
                'description' => __('Main color for chat headers and user messages.', 'chatbot-floating-widget'),
                'default' => '#10b981'
            )
        );

        add_settings_field(
            'button_color',
            __('Button Color', 'chatbot-floating-widget'),
            array($this, 'render_color_field'),
            'chatbot-floating-widget',
            'chatbot_theme_settings',
            array(
                'name' => 'theme[button_color]',
                'label' => __('Chat button color', 'chatbot-floating-widget'),
                'description' => __('Color of the floating chat button.', 'chatbot-floating-widget'),
                'default' => '#10b981'
            )
        );

        add_settings_field(
            'text_color',
            __('Text Color', 'chatbot-floating-widget'),
            array($this, 'render_color_field'),
            'chatbot-floating-widget',
            'chatbot_theme_settings',
            array(
                'name' => 'theme[text_color]',
                'label' => __('Text color', 'chatbot-floating-widget'),
                'description' => __('Text color for headers and user messages.', 'chatbot-floating-widget'),
                'default' => '#ffffff'
            )
        );

        // Advanced settings fields
        add_settings_field(
            'exclude_pages',
            __('Exclude Pages', 'chatbot-floating-widget'),
            array($this, 'render_text_field'),
            'chatbot-floating-widget',
            'chatbot_advanced_settings',
            array(
                'name' => 'advanced[exclude_pages]',
                'label' => __('Pages to exclude', 'chatbot-floating-widget'),
                'description' => __('Comma-separated page IDs where the widget should not appear.', 'chatbot-floating-widget')
            )
        );

        add_settings_field(
            'exclude_posts',
            __('Exclude Posts', 'chatbot-floating-widget'),
            array($this, 'render_text_field'),
            'chatbot-floating-widget',
            'chatbot_advanced_settings',
            array(
                'name' => 'advanced[exclude_posts]',
                'label' => __('Posts to exclude', 'chatbot-floating-widget'),
                'description' => __('Comma-separated post IDs where the widget should not appear.', 'chatbot-floating-widget')
            )
        );

        add_settings_field(
            'delay_load',
            __('Load Delay', 'chatbot-floating-widget'),
            array($this, 'render_number_field'),
            'chatbot-floating-widget',
            'chatbot_advanced_settings',
            array(
                'name' => 'advanced[delay_load]',
                'label' => __('Delay loading (seconds)', 'chatbot-floating-widget'),
                'description' => __('Delay before the widget loads. Useful for performance optimization.', 'chatbot-floating-widget'),
                'min' => 0,
                'max' => 60,
                'default' => 0
            )
        );

        add_settings_field(
            'debug_mode',
            __('Debug Mode', 'chatbot-floating-widget'),
            array($this, 'render_checkbox_field'),
            'chatbot-floating-widget',
            'chatbot_advanced_settings',
            array(
                'name' => 'advanced[debug_mode]',
                'label' => __('Enable debug mode', 'chatbot-floating-widget'),
                'description' => __('Enable console logging for troubleshooting.', 'chatbot-floating-widget')
            )
        );
    }

    /**
     * Get default settings
     */
    private function get_default_settings() {
        return array(
            'enabled' => true,
            'api_url' => '',
            'api_key' => '',
            'position' => 'bottom-right',
            'theme' => array(
                'primary_color' => '#10b981',
                'secondary_color' => '#059669',
                'text_color' => '#ffffff',
                'background_color' => '#ffffff',
                'button_color' => '#10b981',
            ),
            'settings' => array(
                'show_on_mobile' => true,
                'auto_open' => false,
                'welcome_message' => 'Hello! How can I help you today?',
                'placeholder' => 'Type your message...',
                'widget_title' => 'Chat Assistant',
            ),
            'advanced' => array(
                'show_only_on_pages' => false,
                'exclude_pages' => '',
                'show_only_on_posts' => false,
                'exclude_posts' => '',
                'delay_load' => 0,
                'debug_mode' => false,
            )
        );
    }

    /**
     * Enqueue admin scripts and styles
     */
    public function enqueue_admin_scripts($hook) {
        if ('settings_page_chatbot-floating-widget' !== $hook) {
            return;
        }

        wp_enqueue_style('wp-color-picker');
        wp_enqueue_script('wp-color-picker');

        wp_enqueue_style(
            'chatbot-admin-css',
            CHATBOT_FLOATING_WIDGET_URL . 'assets/css/admin.css',
            array(),
            CHATBOT_FLOATING_WIDGET_VERSION
        );

        wp_enqueue_script(
            'chatbot-admin-js',
            CHATBOT_FLOATING_WIDGET_URL . 'assets/js/admin.js',
            array('jquery', 'wp-color-picker'),
            CHATBOT_FLOATING_WIDGET_VERSION,
            true
        );

        wp_localize_script('chatbot-admin-js', 'chatbot_admin', array(
            'ajax_url' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('chatbot_admin_nonce'),
            'strings' => array(
                'connection_success' => __('Connection successful!', 'chatbot-floating-widget'),
                'connection_error' => __('Connection failed. Please check your settings.', 'chatbot-floating-widget'),
                'settings_exported' => __('Settings exported successfully!', 'chatbot-floating-widget'),
                'settings_imported' => __('Settings imported successfully!', 'chatbot-floating-widget'),
                'invalid_file' => __('Invalid file format. Please upload a valid JSON file.', 'chatbot-floating-widget'),
            )
        ));
    }

    /**
     * Render settings page
     */
    public function render_settings_page() {
        if (!current_user_can('manage_options')) {
            return;
        }
        ?>
        <div class="wrap">
            <h1><?php echo esc_html(get_admin_page_title()); ?></h1>

            <div class="chatbot-admin-wrapper">
                <div class="chatbot-admin-content">
                    <?php
                    if (isset($_GET['settings-updated']) && $_GET['settings-updated']) {
                        ?>
                        <div class="notice notice-success is-dismissible">
                            <p><?php _e('Settings saved successfully!', 'chatbot-floating-widget'); ?></p>
                        </div>
                        <?php
                    }
                    ?>

                    <form action="options.php" method="post" id="chatbot-settings-form">
                        <?php
                        settings_fields('chatbot_widget_settings');
                        do_settings_sections('chatbot-floating-widget');
                        submit_button();
                        ?>
                    </form>
                </div>

                <div class="chatbot-admin-sidebar">
                    <div class="chatbot-admin-card">
                        <h3><?php _e('Quick Actions', 'chatbot-floating-widget'); ?></h3>
                        <div class="chatbot-admin-actions">
                            <button type="button" class="button button-secondary" id="test-connection">
                                <?php _e('Test Connection', 'chatbot-floating-widget'); ?>
                            </button>
                            <button type="button" class="button button-secondary" id="export-settings">
                                <?php _e('Export Settings', 'chatbot-floating-widget'); ?>
                            </button>
                            <button type="button" class="button button-secondary" id="import-settings">
                                <?php _e('Import Settings', 'chatbot-floating-widget'); ?>
                            </button>
                            <input type="file" id="import-file" accept=".json" style="display: none;">
                        </div>
                    </div>

                    <div class="chatbot-admin-card">
                        <h3><?php _e('Preview', 'chatbot-floating-widget'); ?></h3>
                        <div id="chatbot-preview">
                            <p><?php _eConfigure your settings above to see a live preview of your chat widget.', 'chatbot-floating-widget'); ?></p>
                        </div>
                    </div>

                    <div class="chatbot-admin-card">
                        <h3><?php _e('Support', 'chatbot-floating-widget'); ?></h3>
                        <ul>
                            <li><a href="#" target="_blank"><?php _e('Documentation', 'chatbot-floating-widget'); ?></a></li>
                            <li><a href="#" target="_blank"><?php _e('Support Forum', 'chatbot-floating-widget'); ?></a></li>
                            <li><a href="#" target="_blank"><?php _e('Report Issue', 'chatbot-floating-widget'); ?></a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <?php
    }

    /**
     * Render settings section descriptions
     */
    public function render_basic_settings_description() {
        echo '<p>' . __('Configure the basic settings for your chatbot widget.', 'chatbot-floating-widget') . '</p>';
    }

    public function render_theme_settings_description() {
        echo '<p>' . __('Customize the appearance of your chat widget to match your site theme.', 'chatbot-floating-widget') . '</p>';
    }

    public function render_advanced_settings_description() {
        echo '<p>' . __('Advanced configuration options for developers and power users.', 'chatbot-floating-widget') . '</p>';
    }

    /**
     * Render form field methods
     */
    public function render_text_field($args) {
        $settings = get_option('chatbot_widget_settings');
        $name = $args['name'];
        $value = $this->get_nested_value($settings, $name, isset($args['default']) ? $args['default'] : '');
        $type = isset($args['type']) ? $args['type'] : 'text';
        $placeholder = isset($args['placeholder']) ? $args['placeholder'] : '';
        ?>
        <input
            type="<?php echo esc_attr($type); ?>"
            name="chatbot_widget_settings[<?php echo esc_attr($name); ?>]"
            value="<?php echo esc_attr($value); ?>"
            placeholder="<?php echo esc_attr($placeholder); ?>"
            class="regular-text"
        />
        <?php if (!empty($args['description'])): ?>
        <p class="description"><?php echo esc_html($args['description']); ?></p>
        <?php endif; ?>
        <?php
    }

    public function render_textarea_field($args) {
        $settings = get_option('chatbot_widget_settings');
        $name = $args['name'];
        $value = $this->get_nested_value($settings, $name, isset($args['default']) ? $args['default'] : '');
        ?>
        <textarea
            name="chatbot_widget_settings[<?php echo esc_attr($name); ?>]"
            rows="4"
            class="large-text"
        ><?php echo esc_textarea($value); ?></textarea>
        <?php if (!empty($args['description'])): ?>
        <p class="description"><?php echo esc_html($args['description']); ?></p>
        <?php endif; ?>
        <?php
    }

    public function render_checkbox_field($args) {
        $settings = get_option('chatbot_widget_settings');
        $name = $args['name'];
        $value = $this->get_nested_value($settings, $name, false);
        ?>
        <label>
            <input
                type="checkbox"
                name="chatbot_widget_settings[<?php echo esc_attr($name); ?>]"
                value="1"
                <?php checked($value, 1); ?>
            />
            <?php echo esc_html($args['label']); ?>
        </label>
        <?php if (!empty($args['description'])): ?>
        <p class="description"><?php echo esc_html($args['description']); ?></p>
        <?php endif; ?>
        <?php
    }

    public function render_select_field($args) {
        $settings = get_option('chatbot_widget_settings');
        $name = $args['name'];
        $value = $this->get_nested_value($settings, $name, isset($args['default']) ? $args['default'] : '');
        ?>
        <select name="chatbot_widget_settings[<?php echo esc_attr($name); ?>]">
            <?php foreach ($args['options'] as $option_value => $option_label): ?>
                <option value="<?php echo esc_attr($option_value); ?>" <?php selected($value, $option_value); ?>>
                    <?php echo esc_html($option_label); ?>
                </option>
            <?php endforeach; ?>
        </select>
        <?php if (!empty($args['description'])): ?>
        <p class="description"><?php echo esc_html($args['description']); ?></p>
        <?php endif; ?>
        <?php
    }

    public function render_color_field($args) {
        $settings = get_option('chatbot_widget_settings');
        $name = $args['name'];
        $value = $this->get_nested_value($settings, $name, isset($args['default']) ? $args['default'] : '#10b981');
        ?>
        <div class="chatbot-color-field-wrapper">
            <input
                type="text"
                name="chatbot_widget_settings[<?php echo esc_attr($name); ?>]"
                value="<?php echo esc_attr($value); ?>"
                class="chatbot-color-field regular-text"
                data-default-color="<?php echo esc_attr($args['default']); ?>"
            />
        </div>
        <?php if (!empty($args['description'])): ?>
        <p class="description"><?php echo esc_html($args['description']); ?></p>
        <?php endif; ?>
        <?php
    }

    public function render_number_field($args) {
        $settings = get_option('chatbot_widget_settings');
        $name = $args['name'];
        $value = $this->get_nested_value($settings, $name, isset($args['default']) ? $args['default'] : 0);
        $min = isset($args['min']) ? $args['min'] : '';
        $max = isset($args['max']) ? $args['max'] : '';
        ?>
        <input
            type="number"
            name="chatbot_widget_settings[<?php echo esc_attr($name); ?>]"
            value="<?php echo esc_attr($value); ?>"
            <?php if ($min !== '') echo 'min="' . esc_attr($min) . '"'; ?>
            <?php if ($max !== '') echo 'max="' . esc_attr($max) . '"'; ?>
            class="small-text"
        />
        <?php if (!empty($args['description'])): ?>
        <p class="description"><?php echo esc_html($args['description']); ?></p>
        <?php endif; ?>
        <?php
    }

    /**
     * Get nested array value
     */
    private function get_nested_value($array, $key, $default = null) {
        $keys = explode('[', str_replace(']', '', $key));
        $value = $array;

        foreach ($keys as $k) {
            if (!is_array($value) || !isset($value[$k])) {
                return $default;
            }
            $value = $value[$k];
        }

        return $value;
    }

    /**
     * Sanitize settings
     */
    public function sanitize_settings($input) {
        $sanitized = array();

        // Basic sanitization
        $sanitized['enabled'] = isset($input['enabled']) ? (bool) $input['enabled'] : false;
        $sanitized['api_url'] = isset($input['api_url']) ? esc_url_raw($input['api_url']) : '';
        $sanitized['api_key'] = isset($input['api_key']) ? sanitize_text_field($input['api_key']) : '';
        $sanitized['position'] = isset($input['position']) ? sanitize_text_field($input['position']) : 'bottom-right';

        // Theme settings
        if (isset($input['theme']) && is_array($input['theme'])) {
            $sanitized['theme'] = array(
                'primary_color' => isset($input['theme']['primary_color']) ? sanitize_hex_color($input['theme']['primary_color']) : '#10b981',
                'secondary_color' => isset($input['theme']['secondary_color']) ? sanitize_hex_color($input['theme']['secondary_color']) : '#059669',
                'text_color' => isset($input['theme']['text_color']) ? sanitize_hex_color($input['theme']['text_color']) : '#ffffff',
                'background_color' => isset($input['theme']['background_color']) ? sanitize_hex_color($input['theme']['background_color']) : '#ffffff',
                'button_color' => isset($input['theme']['button_color']) ? sanitize_hex_color($input['theme']['button_color']) : '#10b981',
            );
        }

        // Widget settings
        if (isset($input['settings']) && is_array($input['settings'])) {
            $sanitized['settings'] = array(
                'show_on_mobile' => isset($input['settings']['show_on_mobile']) ? (bool) $input['settings']['show_on_mobile'] : true,
                'auto_open' => isset($input['settings']['auto_open']) ? (bool) $input['settings']['auto_open'] : false,
                'welcome_message' => isset($input['settings']['welcome_message']) ? sanitize_textarea_field($input['settings']['welcome_message']) : '',
                'placeholder' => isset($input['settings']['placeholder']) ? sanitize_text_field($input['settings']['placeholder']) : '',
                'widget_title' => isset($input['settings']['widget_title']) ? sanitize_text_field($input['settings']['widget_title']) : '',
            );
        }

        // Advanced settings
        if (isset($input['advanced']) && is_array($input['advanced'])) {
            $sanitized['advanced'] = array(
                'show_only_on_pages' => isset($input['advanced']['show_only_on_pages']) ? (bool) $input['advanced']['show_only_on_pages'] : false,
                'exclude_pages' => isset($input['advanced']['exclude_pages']) ? sanitize_text_field($input['advanced']['exclude_pages']) : '',
                'show_only_on_posts' => isset($input['advanced']['show_only_on_posts']) ? (bool) $input['advanced']['show_only_on_posts'] : false,
                'exclude_posts' => isset($input['advanced']['exclude_posts']) ? sanitize_text_field($input['advanced']['exclude_posts']) : '',
                'delay_load' => isset($input['advanced']['delay_load']) ? absint($input['advanced']['delay_load']) : 0,
                'debug_mode' => isset($input['advanced']['debug_mode']) ? (bool) $input['advanced']['debug_mode'] : false,
            );
        }

        return $sanitized;
    }

    /**
     * AJAX: Test connection
     */
    public function ajax_test_connection() {
        check_ajax_referer('chatbot_admin_nonce', 'nonce');

        if (!current_user_can('manage_options')) {
            wp_send_json_error(array('message' => __('You do not have sufficient permissions', 'chatbot-floating-widget')));
        }

        $api_url = sanitize_url($_POST['api_url']);
        $api_key = sanitize_text_field($_POST['api_key']);

        if (empty($api_url) || empty($api_key)) {
            wp_send_json_error(array('message' => __('API URL and API Key are required', 'chatbot-floating-widget')));
        }

        // Test connection
        $response = wp_remote_post(
            trailingslashit($api_url) . 'chat',
            array(
                'body' => json_encode(array(
                    'message' => 'Test connection',
                    'test' => true
                )),
                'headers' => array(
                    'Content-Type' => 'application/json',
                    'Authorization' => 'Bearer ' . $api_key
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
            $error_message = isset($data['error']) ? $data['error'] : __('Connection failed', 'chatbot-floating-widget');
            wp_send_json_error(array('message' => $error_message));
        }
    }

    /**
     * AJAX: Export settings
     */
    public function ajax_export_settings() {
        check_ajax_referer('chatbot_admin_nonce', 'nonce');

        if (!current_user_can('manage_options')) {
            wp_send_json_error(array('message' => __('You do not have sufficient permissions', 'chatbot-floating-widget')));
        }

        $settings = get_option('chatbot_widget_settings');
        $export_data = array(
            'version' => CHATBOT_FLOATING_WIDGET_VERSION,
            'export_date' => current_time('mysql'),
            'settings' => $settings
        );

        wp_send_json_success($export_data);
    }

    /**
     * AJAX: Import settings
     */
    public function ajax_import_settings() {
        check_ajax_referer('chatbot_admin_nonce', 'nonce');

        if (!current_user_can('manage_options')) {
            wp_send_json_error(array('message' => __('You do not have sufficient permissions', 'chatbot-floating-widget')));
        }

        if (!isset($_FILES['import_file'])) {
            wp_send_json_error(array('message' => __('No file uploaded', 'chatbot-floating-widget')));
        }

        $file = $_FILES['import_file'];
        if ($file['error'] !== UPLOAD_ERR_OK) {
            wp_send_json_error(array('message' => __('File upload error', 'chatbot-floating-widget')));
        }

        $content = file_get_contents($file['tmp_name']);
        $data = json_decode($content, true);

        if (!$data || !isset($data['settings'])) {
            wp_send_json_error(array('message' => __('Invalid file format', 'chatbot-floating-widget')));
        }

        // Sanitize and update settings
        $sanitized_settings = $this->sanitize_settings($data['settings']);
        update_option('chatbot_widget_settings', $sanitized_settings);

        wp_send_json_success(array('message' => __('Settings imported successfully!', 'chatbot-floating-widget')));
    }
}