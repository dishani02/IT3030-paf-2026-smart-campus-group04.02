// Global error handler to suppress non-critical jQuery SVG errors
export function setupErrorHandling() {
    // Suppress jQuery SVG path errors that don't affect functionality
    const originalConsoleError = console.error;
    console.error = function (...args) {
        const message = args.join(' ');

        // Suppress specific non-critical errors
        const suppressErrors = [
            '<path> attribute d: Expected number',
            'translateContent',
            'jquery-3.4.1.min.js',
            'Expected number',
            'm=credential_button_library',
            'Error: <path> attribute d',
            'tc0.2,0,0.4-0.2,0',
            'attribute d: Expected number',
            'M 0 0 L 0 0',
            'Expected number',
            'tc0'
        ];

        if (suppressErrors.some(error => message.includes(error)) ||
            (message.includes('<path>') && message.includes('attribute d'))) {
            return; // Suppress these specific errors
        }

        return originalConsoleError.apply(console, args);
    };

    // Suppress jQuery errors if jQuery is available
    if (typeof window !== 'undefined' && window.jQuery) {
        const originalJQueryError = window.jQuery.error;
        window.jQuery.error = function (message) {
            if (typeof message === 'string' &&
                (message.includes('<path> attribute d: Expected number') ||
                    message.includes('translateContent') ||
                    message.includes('Error: <path>'))) {
                return; // Suppress this specific error
            }
            return originalJQueryError.call(this, message);
        };
    }

    // Global error handler for unhandled errors
    window.addEventListener('error', function (event) {
        const message = event.message || '';

        // Suppress specific non-critical errors
        if (message.includes('<path> attribute d: Expected number') ||
            message.includes('translateContent') ||
            message.includes('jquery-3.4.1.min.js') ||
            message.includes('Error: <path>')) {
            event.preventDefault();
            return false;
        }
    });

    // Suppress unhandled promise rejections for these specific errors
    window.addEventListener('unhandledrejection', function (event) {
        const message = event.reason?.message || event.reason || '';

        if (typeof message === 'string' &&
            (message.includes('<path> attribute d: Expected number') ||
                message.includes('translateContent') ||
                message.includes('Error: <path>'))) {
            event.preventDefault();
            return false;
        }
    });
}

// Call this function when the app starts
export function initializeErrorHandling() {
    if (typeof window !== 'undefined') {
        setupErrorHandling();
    }
}
