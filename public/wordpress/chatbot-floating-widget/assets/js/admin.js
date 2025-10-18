/**
 * Chatbot Floating Widget Admin JavaScript
 */

jQuery(document).ready(function($) {
    'use strict';

    // Initialize color pickers
    $('.chatbot-color-field').wpColorPicker();

    // Test connection functionality
    $('#test-connection').on('click', function() {
        var $button = $(this);
        var $status = $('<div class="chatbot-connection-status testing"></div>');
        var apiUrl = $('#api_url').val();
        var apiKey = $('#api_key').val();

        // Remove existing status
        $('.chatbot-connection-status').remove();

        // Validate inputs
        if (!apiUrl || !apiKey) {
            $status.removeClass('testing').addClass('error').text(chatbot_admin.strings.connection_error);
            $button.after($status);
            return;
        }

        // Show loading state
        $button.prop('disabled', true).text('Testing...');
        $button.after($status);

        // Send AJAX request
        $.ajax({
            url: chatbot_admin.ajax_url,
            type: 'POST',
            data: {
                action: 'chatbot_test_connection',
                nonce: chatbot_admin.nonce,
                api_url: apiUrl,
                api_key: apiKey
            },
            success: function(response) {
                $button.prop('disabled', false).text('Test Connection');
                $status.removeClass('testing');

                if (response.success) {
                    $status.addClass('success').html('<span class="dashicons dashicons-yes"></span> ' + response.data.message);
                } else {
                    $status.addClass('error').html('<span class="dashicons dashicons-no"></span> ' + response.data.message);
                }
            },
            error: function() {
                $button.prop('disabled', false).text('Test Connection');
                $status.removeClass('testing').addClass('error').html('<span class="dashicons dashicons-no"></span> ' + chatbot_admin.strings.connection_error);
            }
        });
    });

    // Export settings functionality
    $('#export-settings').on('click', function() {
        var $button = $(this);

        $button.prop('disabled', true).text('Exporting...');

        $.ajax({
            url: chatbot_admin.ajax_url,
            type: 'POST',
            data: {
                action: 'chatbot_export_settings',
                nonce: chatbot_admin.nonce
            },
            success: function(response) {
                $button.prop('disabled', false).text('Export Settings');

                if (response.success) {
                    // Create and download file
                    var dataStr = JSON.stringify(response.data, null, 2);
                    var dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

                    var exportFileDefaultName = 'chatbot-widget-settings-' + new Date().toISOString().slice(0, 10) + '.json';

                    var linkElement = document.createElement('a');
                    linkElement.setAttribute('href', dataUri);
                    linkElement.setAttribute('download', exportFileDefaultName);
                    linkElement.click();

                    // Show success message
                    $('<div class="notice notice-success is-dismissible"><p>' + chatbot_admin.strings.settings_exported + '</p></div>').insertAfter('.wrap h1');
                } else {
                    alert(chatbot_admin.strings.connection_error);
                }
            },
            error: function() {
                $button.prop('disabled', false).text('Export Settings');
                alert(chatbot_admin.strings.connection_error);
            }
        });
    });

    // Import settings functionality
    $('#import-settings').on('click', function() {
        $('#import-file').click();
    });

    $('#import-file').on('change', function(e) {
        var file = e.target.files[0];
        if (!file) return;

        var formData = new FormData();
        formData.append('action', 'chatbot_import_settings');
        formData.append('nonce', chatbot_admin.nonce);
        formData.append('import_file', file);

        var $button = $('#import-settings');
        $button.prop('disabled', true).text('Importing...');

        $.ajax({
            url: chatbot_admin.ajax_url,
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                $button.prop('disabled', false).text('Import Settings');
                $('#import-file').val('');

                if (response.success) {
                    // Show success message and reload
                    $('<div class="notice notice-success is-dismissible"><p>' + response.data.message + '</p></div>').insertAfter('.wrap h1');
                    setTimeout(function() {
                        location.reload();
                    }, 2000);
                } else {
                    alert(response.data.message || chatbot_admin.strings.invalid_file);
                }
            },
            error: function() {
                $button.prop('disabled', false).text('Import Settings');
                alert(chatbot_admin.strings.connection_error);
            }
        });
    });

    // Live preview functionality
    function updatePreview() {
        var settings = {
            enabled: $('#enabled').is(':checked'),
            position: $('#position').val(),
            theme: {
                primaryColor: $('input[name="chatbot_widget_settings[theme][primary_color]"]').val(),
                buttonColor: $('input[name="chatbot_widget_settings[theme][button_color]"]').val(),
                textColor: $('input[name="chatbot_widget_settings[theme][text_color]"]').val()
            },
            settings: {
                widgetTitle: $('input[name="chatbot_widget_settings[settings][widget_title]"]').val(),
                welcomeMessage: $('textarea[name="chatbot_widget_settings[settings][welcome_message]"]').val()
            }
        };

        // Only show preview if API URL and API Key are configured
        if ($('#api_url').val() && $('#api_key').val()) {
            var previewHtml = '<div class="preview-widget">' +
                '<div class="chatbot-widget ' + settings.position + '">' +
                    '<button class="chatbot-button" style="background-color: ' + settings.theme.buttonColor + '">' +
                        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24">' +
                            '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>' +
                        '</svg>' +
                    '</button>' +
                    '<div class="chatbot-container">' +
                        '<div class="chatbot-header" style="background-color: ' + settings.theme.primaryColor + '; color: ' + settings.theme.textColor + ';">' +
                            '<h3>' + settings.settings.widgetTitle + '</h3>' +
                        '</div>' +
                        '<div class="chatbot-messages">' +
                            '<div class="chatbot-message bot">' +
                                '<div class="chatbot-message-content">' + settings.settings.welcomeMessage + '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>';

            $('#chatbot-preview').html(previewHtml);
        } else {
            $('#chatbot-preview').html('<p>' + chatbot_admin.strings.configure_settings + '</p>');
        }
    }

    // Update preview on settings change
    $('#enabled, #position, #api_url, #api_key, input[name^="chatbot_widget_settings[theme]"], input[name^="chatbot_widget_settings[settings]"], textarea[name^="chatbot_widget_settings[settings]"]').on('change keyup', function() {
        clearTimeout(window.previewTimeout);
        window.previewTimeout = setTimeout(updatePreview, 500);
    });

    // Initial preview
    updatePreview();

    // Tab functionality (if implemented)
    $('.nav-tab').on('click', function(e) {
        e.preventDefault();
        var $tab = $(this);
        var tabId = $tab.attr('href');

        // Remove active class from all tabs and panels
        $('.nav-tab').removeClass('nav-tab-active');
        $('.tab-content').hide();

        // Add active class to clicked tab and show corresponding panel
        $tab.addClass('nav-tab-active');
        $(tabId).show();
    });

    // Form validation
    $('#chatbot-settings-form').on('submit', function(e) {
        var apiUrl = $('#api_url').val().trim();
        var apiKey = $('#api_key').val().trim();

        if ($('#enabled').is(':checked') && (!apiUrl || !apiKey)) {
            e.preventDefault();

            var message = $('<div class="notice notice-error is-dismissible"><p>' +
                'Please configure both API URL and API Key before enabling the widget.' +
                '</p></div>');

            $('.wrap h1').after(message);

            // Scroll to top
            $('html, body').animate({ scrollTop: 0 }, 'fast');

            return false;
        }
    });

    // Helper function to show notices
    function showNotice(message, type) {
        type = type || 'info';
        var $notice = $('<div class="notice notice-' + type + ' is-dismissible"><p>' + message + '</p></div>');

        $('.wrap h1').after($notice);

        // Auto-dismiss after 5 seconds
        setTimeout(function() {
            $notice.fadeOut(function() {
                $(this).remove();
            });
        }, 5000);
    }

    // Confirm before resetting to defaults
    $('.reset-to-defaults').on('click', function(e) {
        if (!confirm('Are you sure you want to reset all settings to their default values? This action cannot be undone.')) {
            e.preventDefault();
            return false;
        }
    });

    // Tooltips for help text
    $('.chatbot-help-tooltip').on('mouseenter', function() {
        var $tooltip = $(this);
        var tooltipText = $tooltip.data('tooltip');

        if (tooltipText) {
            var $tooltipDiv = $('<div class="chatbot-tooltip">' + tooltipText + '</div>');
            $('body').append($tooltipDiv);

            var position = $tooltip.offset();
            $tooltipDiv.css({
                position: 'absolute',
                top: position.top - $tooltipDiv.outerHeight() - 5,
                left: position.left + ($tooltip.outerWidth() / 2) - ($tooltipDiv.outerWidth() / 2),
                zIndex: 10000
            }).fadeIn(200);
        }
    }).on('mouseleave', function() {
        $('.chatbot-tooltip').fadeOut(200, function() {
            $(this).remove();
        });
    });

    // Copy to clipboard functionality
    $('.copy-to-clipboard').on('click', function() {
        var $button = $(this);
        var textToCopy = $button.data('text');

        if (textToCopy) {
            // Create temporary textarea
            var $textarea = $('<textarea>').val(textToCopy).css({
                position: 'fixed',
                opacity: 0
            }).appendTo('body');

            // Select and copy
            $textarea.select();
            document.execCommand('copy');
            $textarea.remove();

            // Update button text
            var originalText = $button.text();
            $button.text('Copied!');

            setTimeout(function() {
                $button.text(originalText);
            }, 2000);
        }
    });

    // Expandable sections
    $('.chatbot-expandable').on('click', function() {
        var $section = $(this);
        var $content = $section.next('.chatbot-expandable-content');

        if ($content.is(':visible')) {
            $content.slideUp(300);
            $section.find('.dashicons').removeClass('dashicons-arrow-up').addClass('dashicons-arrow-down');
        } else {
            $content.slideDown(300);
            $section.find('.dashicons').removeClass('dashicons-arrow-down').addClass('dashicons-arrow-up');
        }
    });

    // Auto-save functionality (optional)
    var autoSaveTimeout;
    $('.auto-save-field').on('change', function() {
        clearTimeout(autoSaveTimeout);

        var $field = $(this);
        $field.addClass('auto-saving');

        autoSaveTimeout = setTimeout(function() {
            // Save the specific field
            $.ajax({
                url: chatbot_admin.ajax_url,
                type: 'POST',
                data: {
                    action: 'chatbot_auto_save_field',
                    nonce: chatbot_admin.nonce,
                    field: $field.attr('name'),
                    value: $field.val()
                },
                success: function() {
                    $field.removeClass('auto-saving').addClass('auto-saved');
                    setTimeout(function() {
                        $field.removeClass('auto-saved');
                    }, 2000);
                },
                error: function() {
                    $field.removeClass('auto-saving').addClass('auto-save-error');
                    setTimeout(function() {
                        $field.removeClass('auto-save-error');
                    }, 2000);
                }
            });
        }, 2000);
    });

    // Initialize
    console.log('Chatbot Widget Admin loaded');
});