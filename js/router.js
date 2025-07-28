// Simple Router for RADIUS SPA
class Router {
    constructor() {
        this.routes = {};
        this.currentPage = null;
        this.init();
    }

    init() {
        // Handle browser back/forward buttons
        window.addEventListener('popstate', () => {
            this.loadRoute(window.location.pathname);
        });

        // Handle initial load
        this.loadRoute(window.location.pathname);
    }

    addRoute(path, pageModule) {
        this.routes[path] = pageModule;
    }

    navigate(path) {
        if (path !== window.location.pathname) {
            window.history.pushState({}, '', path);
        }
        this.loadRoute(path);
    }

    async loadRoute(path) {
        // Hide loading spinner initially
        const loading = document.getElementById('loading');
        const app = document.getElementById('app');

        // Check authentication for protected routes
        if (path !== '/login' && !window.authManager.isAuthenticated()) {
            console.log('Authentication check failed, redirecting to login');
            console.log('Path:', path, 'isAuthenticated:', window.authManager.isAuthenticated());
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
                            this.navigate('/dashboard');
                            return;
                        }
                    } else {
                        // 404 - redirect to dashboard
                        this.navigate('/dashboard');
                        return;
                    }
            }

            // Cleanup current page
            if (this.currentPage && this.currentPage.cleanup) {
                this.currentPage.cleanup();
            }

            // Render new page
            if (pageModule && pageModule.default) {
                this.currentPage = new pageModule.default();
                const content = await this.currentPage.render();
                app.innerHTML = content;
                
                // Initialize page
                if (this.currentPage.init) {
                    await this.currentPage.init();
                }
            }

        } catch (error) {
            console.error('Error loading route:', error);
            app.innerHTML = `
                <div class="min-h-screen flex items-center justify-center">
                    <div class="text-center">
                        <h1 class="text-2xl font-bold text-red-600 mb-4">Page Load Error</h1>
                        <p class="text-gray-600 mb-4">Sorry, there was an error loading this page.</p>
                        <button onclick="window.router.navigate('/dashboard')" 
                                class="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700">
                            Return to Dashboard
                        </button>
                    </div>
                </div>
            `;
        } finally {
            // Hide loading
            if (loading) loading.classList.add('hidden');
        }
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
