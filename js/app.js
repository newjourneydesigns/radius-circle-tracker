// Main Application Entry Point
class App {
    constructor() {
        this.init();
    }

    async init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.start());
        } else {
            this.start();
        }
    }

    async start() {
        console.log('RADIUS App Starting...');
        
        // Initialize dark mode
        this.initTheme();
        
        // Wait for auth manager to initialize with timeout
        let attempts = 0;
        const maxAttempts = 50; // 5 seconds total
        while (!window.authManager && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }

        if (!window.authManager) {
            console.error('AuthManager failed to initialize within 5 seconds');
            this.showInitError();
            return;
        }

        // Set up global error handlers
        this.setupErrorHandlers();

        console.log('RADIUS App Ready');
    }

    setupErrorHandlers() {
        // Global error handler for unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            
            // Don't show user notification for certain types of errors
            if (event.reason?.message?.includes('Navigation timeout') || 
                event.reason?.message?.includes('Page init timeout')) {
                return;
            }
            
            window.utils?.showNotification('An unexpected error occurred', 'error');
        });

        // Global error handler for JavaScript errors
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            
            // Don't show user notification for module loading errors
            if (event.error?.message?.includes('Failed to fetch') ||
                event.error?.message?.includes('Loading module')) {
                return;
            }
            
            window.utils?.showNotification('A JavaScript error occurred', 'error');
        });
    }

    showInitError() {
        const app = document.getElementById('app');
        const loading = document.getElementById('loading');
        
        if (loading) loading.classList.add('hidden');
        
        if (app) {
            app.innerHTML = `
                <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                    <div class="text-center max-w-md mx-auto p-6">
                        <h1 class="text-2xl font-bold text-red-600 mb-4">Initialization Error</h1>
                        <p class="text-gray-600 dark:text-gray-400 mb-6">
                            The application failed to initialize properly. This might be due to a network issue or server problem.
                        </p>
                        <div class="space-y-3">
                            <button onclick="window.location.reload()" 
                                    class="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                                Reload Application
                            </button>
                            <button onclick="localStorage.clear(); window.location.reload()" 
                                    class="w-full bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
                                Clear Data & Reload
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    initTheme() {
        // Check for saved theme preference or default to light mode
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                if (e.matches) {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
            }
        });
    }

    toggleTheme() {
        const isDark = document.documentElement.classList.contains('dark');
        if (isDark) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
    }
}

// Utility Functions
window.utils = {
    // Format date for display
    formatDate(date) {
        if (!date) return '';
        const d = new Date(date);
        return d.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    },

    // Format date for input fields
    formatDateInput(date) {
        if (!date) return '';
        const d = new Date(date);
        return d.toISOString().split('T')[0];
    },

    // Get relative time (e.g., "2 days ago")
    getRelativeTime(date) {
        if (!date) return '';
        const now = new Date();
        const d = new Date(date);
        const diffMs = now - d;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
        return `${Math.floor(diffDays / 365)} years ago`;
    },

    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg text-white max-w-sm transform transition-transform duration-300 translate-x-full`;
        
        switch (type) {
            case 'success':
                notification.classList.add('bg-green-500');
                break;
            case 'error':
                notification.classList.add('bg-red-500');
                break;
            case 'warning':
                notification.classList.add('bg-yellow-500');
                break;
            default:
                notification.classList.add('bg-blue-500');
        }

        notification.innerHTML = `
            <div class="flex items-center justify-between">
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-2 text-white hover:text-gray-200">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                    </svg>
                </button>
            </div>
        `;

        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);

        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }, 5000);
    },

    // Debounce function for search
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Generate UUID
    generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
};

// Initialize the app
window.app = new App();
