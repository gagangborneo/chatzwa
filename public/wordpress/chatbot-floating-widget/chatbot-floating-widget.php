<?php
/**
 * Plugin Name: Chatbot Floating Widget
 * Plugin URI: https://chatbot.example.com
 * Description: Advanced AI chatbot floating widget for WordPress. Connect your website with intelligent chatbot assistant powered by AI.
 * Version: 1.0.0
 * Author: Chatbot Team
 * Author URI: https://chatbot.example.com
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: chatbot-floating-widget
 * Domain Path: /languages
 * Requires at least: 5.0
 * Tested up to: 6.5
 * Requires PHP: 7.4
 * Network: false
 */

// Prevent direct file access
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('CHATBOT_FLOATING_WIDGET_VERSION', '1.0.0');
define('CHATBOT_FLOATING_WIDGET_DIR', plugin_dir_path(__FILE__));
define('CHATBOT_FLOATING_WIDGET_URL', plugin_dir_url(__FILE__));
define('CHATBOT_FLOATING_WIDGET_BASENAME', plugin_basename(__FILE__));

// Include required files
require_once CHATBOT_FLOATING_WIDGET_DIR . 'includes/class-chatbot-widget.php';
require_once CHATBOT_FLOATING_WIDGET_DIR . 'includes/class-chatbot-settings.php';
require_once CHATBOT_FLOATING_WIDGET_DIR . 'includes/class-chatbot-installer.php';

/**
 * Main plugin class
 */
class Chatbot_Floating_Widget {

    /**
     * Singleton instance
     */
    private static $instance = null;

    /**
     * Plugin settings
     */
    private $settings = array();

    /**
     * Get singleton instance
     */
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Constructor
     */
    private function __construct() {
        add_action('plugins_loaded', array($this, 'init'));
        add_action('init', array($this, 'load_textdomain'));
        register_activation_hook(__FILE__, array('Chatbot_Installer', 'activate'));
        register_deactivation_hook(__FILE__, array('Chatbot_Installer', 'deactivate'));
    }

    /**
     * Initialize plugin
     */
    public function init() {
        $this->load_settings();

        // Admin functionality
        if (is_admin()) {
            new Chatbot_Settings();
        } else {
            // Frontend functionality
            new Chatbot_Widget($this->settings);
        }
    }

    /**
     * Load plugin settings
     */
    private function load_settings() {
        $this->settings = get_option('chatbot_widget_settings', $this->get_default_settings());
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
     * Load text domain
     */
    public function load_textdomain() {
        load_plugin_textdomain(
            'chatbot-floating-widget',
            false,
            dirname(CHATBOT_FLOATING_WIDGET_BASENAME) . '/languages'
        );
    }

    /**
     * Get plugin settings
     */
    public function get_settings() {
        return $this->settings;
    }

    /**
     * Check if chatbot is enabled
     */
    public function is_enabled() {
        return !empty($this->settings['enabled']) &&
               !empty($this->settings['api_url']) &&
               !empty($this->settings['api_key']);
    }

    /**
     * Update settings
     */
    public function update_settings($new_settings) {
        $this->settings = wp_parse_args($new_settings, $this->get_default_settings());
        return update_option('chatbot_widget_settings', $this->settings);
    }
}

// Initialize the plugin
Chatbot_Floating_Widget::get_instance();

/**
 * Plugin activation notice
 */
function chatbot_floating_widget_activation_notice() {
    if (get_option('chatbot_widget_activation_redirect', false)) {
        delete_option('chatbot_widget_activation_redirect');

        if (!is_network_admin() && !isset($_GET['activate-multi'])) {
            wp_safe_redirect(admin_url('options-general.php?page=chatbot-floating-widget'));
            exit;
        }
    }
}
add_action('admin_init', 'chatbot_floating_widget_activation_notice');

/**
 * Plugin row meta
 */
function chatbot_floating_widget_plugin_row_meta($links, $file) {
    if (CHATBOT_FLOATING_WIDGET_BASENAME === $file) {
        $row_meta = array(
            'docs'    => '<a href="' . esc_url('https://chatbot.example.com/docs') . '" target="_blank" rel="noopener noreferrer">' . __('Documentation', 'chatbot-floating-widget') . '</a>',
            'support' => '<a href="' . esc_url('https://chatbot.example.com/support') . '" target="_blank" rel="noopener noreferrer">' . __('Support', 'chatbot-floating-widget') . '</a>',
        );
        $links = array_merge($links, $row_meta);
    }
    return $links;
}
add_filter('plugin_row_meta', 'chatbot_floating_widget_plugin_row_meta', 10, 2);

/**
 * Plugin action links
 */
function chatbot_floating_widget_plugin_action_links($links) {
    $settings_link = '<a href="' . admin_url('options-general.php?page=chatbot-floating-widget') . '">' . __('Settings', 'chatbot-floating-widget') . '</a>';
    array_unshift($links, $settings_link);
    return $links;
}
add_filter('plugin_action_links_' . CHATBOT_FLOATING_WIDGET_BASENAME, 'chatbot_floating_widget_plugin_action_links');

/**
 * Check for plugin requirements
 */
function chatbot_floating_widget_check_requirements() {
    if (version_compare(PHP_VERSION, '7.4', '<')) {
        deactivate_plugins(CHATBOT_FLOATING_WIDGET_BASENAME);
        wp_die(sprintf(
            __('Chatbot Floating Widget requires PHP version 7.4 or higher. You are running version %s', 'chatbot-floating-widget'),
            PHP_VERSION
        ));
    }

    if (version_compare($GLOBALS['wp_version'], '5.0', '<')) {
        deactivate_plugins(CHATBOT_FLOATING_WIDGET_BASENAME);
        wp_die(sprintf(
            __('Chatbot Floating Widget requires WordPress version 5.0 or higher. You are running version %s', 'chatbot-floating-widget'),
            $GLOBALS['wp_version']
        ));
    }
}
register_activation_hook(__FILE__, 'chatbot_floating_widget_check_requirements');

/**
 * Uninstall plugin
 */
function chatbot_floating_widget_uninstall() {
    delete_option('chatbot_widget_settings');
    delete_option('chatbot_widget_activation_redirect');
    delete_option('chatbot_widget_version');
}
register_uninstall_hook(__FILE__, 'chatbot_floating_widget_uninstall');