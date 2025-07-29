// Global Navigation Handler
// This module handles navigation clicks using event delegation to prevent memory leaks

class NavigationManager {
    constructor() {
        this.isInitialized = false;
        this.init();
    }

    init() {
        if (this.isInitialized) return;
        
        console.log('[Navigation] Initializing global navigation handler...');
        
        // Use event delegation for all navigation links
        document.addEventListener('click', this.handleNavigationClick.bind(this));
        
        this.isInitialized = true;
        console.log('[Navigation] Global navigation handler initialized');
    }

    handleNavigationClick(event) {
        const target = event.target.closest('[data-navigate]');
        if (!target) return;

        event.preventDefault();
        event.stopPropagation();

        const path = target.getAttribute('data-navigate');
        if (path && window.router) {
            console.log('[Navigation] Navigating via data-navigate:', path);
            window.router.navigate(path);
        }
    }

    // Helper method to create navigation links
    createNavLink(path, text, className = '') {
        return `<a href="#" data-navigate="${path}" class="${className}">${text}</a>`;
    }

    // Helper method to create navigation buttons
    createNavButton(path, text, className = '') {
        return `<button type="button" data-navigate="${path}" class="${className}">${text}</button>`;
    }
}

// Initialize global navigation manager
window.navigationManager = new NavigationManager();
