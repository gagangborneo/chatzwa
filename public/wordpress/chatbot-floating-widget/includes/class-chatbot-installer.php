<?php
/**
 * Chatbot Installer Class
 * Handles plugin installation and activation
 */

if (!defined('ABSPATH')) {
    exit;
}

class Chatbot_Installer {

    /**
     * Activate plugin
     */
    public static function activate() {
        // Set default settings if they don't exist
        if (!get_option('chatbot_widget_settings')) {
            $default_settings = array(
                'enabled' => false,
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
            update_option('chatbot_widget_settings', $default_settings);
        }

        // Set activation redirect flag
        update_option('chatbot_widget_activation_redirect', true);

        // Create database tables if needed (for future features)
        self::create_tables();

        // Schedule cron jobs if needed
        self::schedule_cron_jobs();

        // Flush rewrite rules
        flush_rewrite_rules();

        // Log activation
        error_log('Chatbot Floating Widget plugin activated');
    }

    /**
     * Deactivate plugin
     */
    public static function deactivate() {
        // Remove cron jobs
        self::unschedule_cron_jobs();

        // Flush rewrite rules
        flush_rewrite_rules();

        // Clear any temporary data
        wp_cache_flush();

        // Log deactivation
        error_log('Chatbot Floating Widget plugin deactivated');
    }

    /**
     * Create database tables
     */
    private static function create_tables() {
        global $wpdb;

        $charset_collate = $wpdb->get_charset_collate();

        // Chat analytics table (for future use)
        $table_name = $wpdb->prefix . 'chatbot_analytics';
        $sql = "CREATE TABLE IF NOT EXISTS $table_name (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            session_id varchar(100) NOT NULL,
            message text NOT NULL,
            response text,
            user_ip varchar(45),
            user_agent text,
            page_url varchar(500),
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY session_id (session_id),
            KEY created_at (created_at)
        ) $charset_collate;";

        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);
    }

    /**
     * Schedule cron jobs
     */
    private static function schedule_cron_jobs() {
        // Schedule cleanup job for old analytics data (if table exists)
        if (!wp_next_scheduled('chatbot_cleanup_analytics')) {
            wp_schedule_event(time(), 'daily', 'chatbot_cleanup_analytics');
        }
    }

    /**
     * Unschedule cron jobs
     */
    private static function unschedule_cron_jobs() {
        wp_clear_scheduled_hook('chatbot_cleanup_analytics');
    }

    /**
     * Cleanup analytics data
     */
    public static function cleanup_analytics() {
        global $wpdb;

        $table_name = $wpdb->prefix . 'chatbot_analytics';

        // Delete records older than 90 days
        $wpdb->query(
            $wpdb->prepare(
                "DELETE FROM $table_name WHERE created_at < DATE_SUB(NOW(), INTERVAL %d DAY)",
                90
            )
        );
    }

    /**
     * Get plugin info
     */
    public static function get_plugin_info() {
        $plugin_data = get_plugin_data(CHATBOT_FLOATING_WIDGET_DIR . 'chatbot-floating-widget.php');
        return array(
            'name' => $plugin_data['Name'],
            'version' => $plugin_data['Version'],
            'author' => $plugin_data['Author'],
            'description' => $plugin_data['Description'],
            'plugin_url' => $plugin_data['PluginURI'],
        );
    }

    /**
     * Check system requirements
     */
    public static function check_requirements() {
        $requirements = array();

        // Check PHP version
        if (version_compare(PHP_VERSION, '7.4', '<')) {
            $requirements['php'] = array(
                'status' => 'error',
                'message' => sprintf(
                    __('PHP version %s or higher is required. You are running %s', 'chatbot-floating-widget'),
                    '7.4',
                    PHP_VERSION
                )
            );
        } else {
            $requirements['php'] = array(
                'status' => 'success',
                'message' => sprintf(__('PHP version %s - OK', 'chatbot-floating-widget'), PHP_VERSION)
            );
        }

        // Check WordPress version
        if (version_compare($GLOBALS['wp_version'], '5.0', '<')) {
            $requirements['wordpress'] = array(
                'status' => 'error',
                'message' => sprintf(
                    __('WordPress version %s or higher is required. You are running %s', 'chatbot-floating-widget'),
                    '5.0',
                    $GLOBALS['wp_version']
                )
            );
        } else {
            $requirements['wordpress'] = array(
                'status' => 'success',
                'message' => sprintf(__('WordPress version %s - OK', 'chatbot-floating-widget'), $GLOBALS['wp_version'])
            );
        }

        // Check required functions
        $required_functions = array('json_encode', 'json_decode', 'curl_init');
        foreach ($required_functions as $function) {
            if (!function_exists($function)) {
                $requirements['functions'][$function] = array(
                    'status' => 'error',
                    'message' => sprintf(__('Required function %s is not available', 'chatbot-floating-widget'), $function)
                );
            }
        }

        // Check memory limit
        $memory_limit = ini_get('memory_limit');
        $memory_bytes = wp_convert_hr_to_bytes($memory_limit);
        if ($memory_bytes < 67108864) { // 64MB
            $requirements['memory'] = array(
                'status' => 'warning',
                'message' => sprintf(__('Recommended memory limit is 64MB. Current limit: %s', 'chatbot-floating-widget'), $memory_limit)
            );
        } else {
            $requirements['memory'] = array(
                'status' => 'success',
                'message' => sprintf(__('Memory limit: %s - OK', 'chatbot-floating-widget'), $memory_limit)
            );
        }

        return $requirements;
    }

    /**
     * Create default configuration file
     */
    public static function create_config_file($api_url, $api_key) {
        $config = array(
            'api_url' => $api_url,
            'api_key' => $api_key,
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
            )
        );

        update_option('chatbot_widget_settings', array_merge(
            get_option('chatbot_widget_settings', array()),
            $config,
            array('enabled' => true)
        ));

        return true;
    }

    /**
     * Get shortcode examples
     */
    public static function get_shortcode_examples() {
        return array(
            'basic' => array(
                'code' => '[chatbot_widget]',
                'description' => __('Display the chat widget with default settings', 'chatbot-floating-widget')
            ),
            'custom_position' => array(
                'code' => '[chatbot_widget position="top-left"]',
                'description' => __('Display widget in top-left position', 'chatbot-floating-widget')
            ),
            'custom_theme' => array(
                'code' => '[chatbot_widget primary_color="#ff6b6b" button_color="#4ecdc4"]',
                'description' => __('Customize widget colors', 'chatbot-floating-widget')
            ),
            'hide_mobile' => array(
                'code' => '[chatbot_widget show_on_mobile="false"]',
                'description' => __('Hide widget on mobile devices', 'chatbot-floating-widget')
            )
        );
    }
}

// Hook cleanup function
add_action('chatbot_cleanup_analytics', array('Chatbot_Installer', 'cleanup_analytics'));