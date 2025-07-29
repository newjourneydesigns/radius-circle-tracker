// Simple Router for RADIUS SPA
class Router {
    constructor() {
        this.routes = {};
        this.currentPage = null;
        this.isNavigating = false; // Prevent concurrent navigation
        this.navigationQueue = []; // Queue for pending navigations
        this.init();
    }

    init() {
        console.log('[Router] Initializing router...');
        
        // Handle browser back/forward buttons
        window.addEventListener('popstate', (event) => {
            console.log('[Router] Popstate event:', window.location.pathname);
            this.loadRoute(window.location.pathname);
        });

        // Handle initial load
        document.addEventListener('DOMContentLoaded', () => {
            console.log('[Router] DOM loaded, loading initial route');
            this.loadRoute(window.location.pathname);
        });
        
        // If DOM is already loaded
        if (document.readyState === 'loading') {
            // Wait for DOMContentLoaded
        } else {
            // DOM is already ready
            this.loadRoute(window.location.pathname);
        }
    }

    addRoute(path, pageModule) {
        this.routes[path] = pageModule;
    }

    navigate(path) {
        console.log('[Router] Navigate requested:', path, 'Currently navigating:', this.isNavigating);
        
        // If already navigating, queue this navigation
        if (this.isNavigating) {
            console.log('[Router] Navigation in progress, queueing:', path);
            this.navigationQueue.push(path);
            return;
        }
        
        if (path !== window.location.pathname) {
            window.history.pushState({}, '', path);
        }
        this.loadRoute(path);
    }

    async loadRoute(path) {
        console.log('[Router] Loading route:', path);
        
        // Prevent concurrent navigation
        if (this.isNavigating) {
            console.log('[Router] Navigation already in progress, ignoring:', path);
            return;
        }
        
        this.isNavigating = true;
        this.checkNavigationHealth(); // Start health check
        
        // Hide loading spinner initially
        const loading = document.getElementById('loading');
        const app = document.getElementById('app');

        // Add navigation timeout
        const navigationTimeout = setTimeout(() => {
            console.error('[Router] Navigation timeout - forcing page load to complete');
            this.isNavigating = false;
            if (loading) loading.classList.add('hidden');
            app.innerHTML = `
                <div class="min-h-screen flex items-center justify-center">
                    <div class="text-center">
                        <h1 class="text-2xl font-bold text-orange-600 mb-4">Navigation Timeout</h1>
                        <p class="text-gray-600 mb-4">The page took too long to load. This might be a connection issue.</p>
                        <div class="space-y-2">
                            <button onclick="window.location.reload()" 
                                    class="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 mr-2">
                                Refresh Page
                            </button>
                            <button onclick="window.router.navigate('/dashboard')" 
                                    class="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
                                Return to Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            `;
            this.processNavigationQueue();
        }, 15000); // Reduced timeout to 15 seconds

        // Check authentication for protected routes
        if (path !== '/login' && !window.authManager?.isAuthenticated()) {
            clearTimeout(navigationTimeout);
            console.log('[Router] Authentication check failed, redirecting to login');
            console.log('[Router] Path:', path, 'isAuthenticated:', window.authManager?.isAuthenticated());
            this.isNavigating = false;
            this.navigate('/login');
            return;
        }

        // Show loading
        if (loading) loading.classList.remove('hidden');
        
        try {
            let pageModule;
            
            // Route mapping
            switch (path) {
                case '/':
                case '/login':
                    pageModule = await import('/pages/login.js');
                    break;
                case '/dashboard':
                    pageModule = await import('/pages/dashboard.js');
                    break;
                case '/profile':
                    pageModule = await import('/pages/user-profile.js');
                    break;
                case '/reports':
                    pageModule = await import('/pages/reports.js');
                    break;
                case '/import':
                    pageModule = await import('/pages/excel-import.js');
                    break;
                case '/org-settings':
                    pageModule = await import('/pages/org-settings.js');
                    break;
                case '/circle-leader/new':
                    pageModule = await import('/pages/circle-leader.js');
                    break;
                default:
                    // Check if it's a circle leader profile page or edit page
                    console.log('Handling dynamic route:', path);
                    if (path.startsWith('/circle-leader/')) {
                        const segments = path.split('/');
                        console.log('Circle leader route segments:', segments);
                        if (segments.length >= 4 && segments[3] === 'edit') {
                            // This is an edit page: /circle-leader/id/edit
                            console.log('Loading edit page for circle leader:', segments[2]);
                            pageModule = await import('/pages/circle-leader.js');
                        } else if (segments.length >= 3) {
                            // This is a profile page: /circle-leader/id
                            console.log('Loading profile page for circle leader:', segments[2]);
                            pageModule = await import('/pages/profile.js');
                        } else {
                            // 404 - redirect to dashboard
                            console.log('Invalid circle leader route, redirecting to dashboard');
                            clearTimeout(navigationTimeout);
                            this.isNavigating = false;
                            this.navigate('/dashboard');
                            return;
                        }
                    } else {
                        // 404 - redirect to dashboard
                        clearTimeout(navigationTimeout);
                        this.isNavigating = false;
                        this.navigate('/dashboard');
                        return;
                    }
            }

            // Cleanup current page with error handling
            if (this.currentPage && typeof this.currentPage.cleanup === 'function') {
                try {
                    console.log('[Router] Cleaning up current page');
                    await this.currentPage.cleanup();
                } catch (cleanupError) {
                    console.warn('[Router] Error during page cleanup:', cleanupError);
                }
            }

            // Render new page
            if (pageModule && pageModule.default) {
                console.log('[Router] Creating new page instance');
                this.currentPage = new pageModule.default();
                
                console.log('[Router] Rendering page content');
                const content = await this.currentPage.render();
                app.innerHTML = content;
                
                // Initialize page with timeout
                if (typeof this.currentPage.init === 'function') {
                    console.log('[Router] Initializing page');
                    await Promise.race([
                        this.currentPage.init(),
                        new Promise((_, reject) => 
                            setTimeout(() => reject(new Error('Page init timeout')), 10000)
                        )
                    ]);
                    console.log('[Router] Page initialization complete');
                }
            }

        } catch (error) {
            console.error('[Router] Error loading route:', error);
            app.innerHTML = `
                <div class="min-h-screen flex items-center justify-center">
                    <div class="text-center">
                        <h1 class="text-2xl font-bold text-red-600 mb-4">Page Load Error</h1>
                        <p class="text-gray-600 mb-4">Sorry, there was an error loading this page.</p>
                        <p class="text-sm text-gray-500 mb-4">${error.message}</p>
                        <button onclick="window.router.navigate('/dashboard')" 
                                class="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700">
                            Return to Dashboard
                        </button>
                    </div>
                </div>
            `;
        } finally {
            // Hide loading and clear timeout
            clearTimeout(navigationTimeout);
            if (loading) loading.classList.add('hidden');
            this.isNavigating = false;
            
            // Process any queued navigations
            this.processNavigationQueue();
        }
    }

    processNavigationQueue() {
        if (this.navigationQueue.length > 0 && !this.isNavigating) {
            const nextPath = this.navigationQueue.shift();
            console.log('[Router] Processing queued navigation:', nextPath);
            setTimeout(() => this.navigate(nextPath), 100); // Small delay to prevent stack overflow
        }
    }

    // Recovery method for when navigation gets stuck
    forceNavigationReset() {
        console.warn('[Router] Forcing navigation reset due to stuck state');
        this.isNavigating = false;
        this.navigationQueue = [];
        
        const loading = document.getElementById('loading');
        if (loading) loading.classList.add('hidden');
        
        // Process any pending navigation
        this.processNavigationQueue();
    }

    // Health check method
    checkNavigationHealth() {
        if (this.isNavigating) {
            // If navigation has been stuck for more than 30 seconds, force reset
            setTimeout(() => {
                if (this.isNavigating) {
                    console.error('[Router] Navigation stuck for 30+ seconds, forcing reset');
                    this.forceNavigationReset();
                }
            }, 30000);
        }
    }

    // Diagnostic method for debugging navigation issues
    getDiagnostics() {
        return {
            currentPath: window.location.pathname,
            isNavigating: this.isNavigating,
            queueLength: this.navigationQueue.length,
            currentPageType: this.currentPage?.constructor?.name || 'none',
            authStatus: window.authManager?.isAuthenticated() || false,
            timestamp: new Date().toISOString()
        };
    }

    // Debug method accessible from console
    debugNavigation() {
        console.log('[Router] Navigation Diagnostics:', this.getDiagnostics());
        console.log('[Router] Queue:', this.navigationQueue);
        console.log('[Router] Current page:', this.currentPage);
    }

    getCurrentPath() {
        return window.location.pathname;
    }

    getParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const params = {};
        for (const [key, value] of urlParams) {
            params[key] = value;
        }
        return params;
    }

    getPathSegments() {
        return window.location.pathname.split('/').filter(segment => segment !== '');
    }
}

// Initialize router
window.router = new Router();
