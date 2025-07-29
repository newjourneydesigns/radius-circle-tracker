// Dashboard Page Module
export default class DashboardPage {
    constructor() {
        this.circleLeaders = [];
        this.filteredLeaders = [];
        this.campuses = [];
        this.acpds = [];
        this.statuses = [];
        this.meetingDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        this.circleTypes = [];
        this.filters = {
            search: '',
            campus: [],
            acpd: [],
            status: [],
            meetingDay: [],
            circleType: [],
            eventSummary: 'all' // 'all', 'received', 'not_received'
        };
        this.isLoading = false; // Prevent multiple simultaneous loads
        
        // Store event handlers for cleanup
        this.eventHandlers = {};
        
        // Load saved filter state
        this.loadFilterState();
    }

    saveFilterState() {
        const filterState = {
            search: this.filters.search,
            campus: this.filters.campus,
            acpd: this.filters.acpd,
            status: this.filters.status,
            meetingDay: this.filters.meetingDay,
            circleType: this.filters.circleType,
            eventSummary: this.filters.eventSummary
        };
        localStorage.setItem('radiusDashboardFilters', JSON.stringify(filterState));
        console.log('[Dashboard] Filter state saved:', filterState);
    }

    loadFilterState() {
        try {
            const savedState = localStorage.getItem('radiusDashboardFilters');
            if (savedState) {
                const filterState = JSON.parse(savedState);
                this.filters.search = filterState.search || '';
                this.filters.campus = filterState.campus || [];
                this.filters.acpd = filterState.acpd || [];
                this.filters.status = filterState.status || [];
                this.filters.meetingDay = filterState.meetingDay || [];
                this.filters.circleType = filterState.circleType || [];
                this.filters.eventSummary = filterState.eventSummary || 'all';
                this.filters.circleType = filterState.circleType || [];
                console.log('[Dashboard] Filter state loaded:', filterState);
            }
        } catch (error) {
            console.error('[Dashboard] Error loading filter state:', error);
            // Reset to defaults if there's an error
            this.filters = {
                search: '',
                campus: [],
                acpd: [],
                status: [],
                meetingDay: [],
                circleType: [],
                eventSummary: 'all'
            };
        }
    }

    render() {
        return `
            <!-- Navigation -->
            ${this.renderNavigation()}

            <!-- Main Content -->
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <!-- Header with Stats -->
                ${this.renderHeader()}

                <!-- Collapsible Filters Panel -->
                ${this.renderCollapsibleFilters()}

                <!-- Event Summary Progress -->
                ${this.renderEventSummaryProgress()}

                <!-- Today's Circles Table -->
                ${this.renderTodayCircles()}

                <!-- Circle Leaders Grid -->
                <div id="circleLeadersGrid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <!-- Leaders will be populated here -->
                </div>

                <!-- Empty State -->
                <div id="emptyState" class="hidden text-center py-12">
                    <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                    <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No Circle Leaders found</h3>
                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Try adjusting your filters or search terms.</p>
                </div>

                <!-- Contact Modal -->
                <div id="contactModal" class="hidden fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
                        <div class="mt-3">
                            <div class="flex items-center justify-between mb-4">
                                <h3 class="text-lg font-medium text-gray-900 dark:text-white">Contact Options</h3>
                                <button onclick="window.dashboard?.closeContactModal()" 
                                        class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </button>
                            </div>
                            <div class="text-center mb-6">
                                <p class="text-gray-600 dark:text-gray-300">
                                    Contact <span id="contactModalName" class="font-semibold"></span>
                                </p>
                                <p id="contactModalInfo" class="text-sm text-gray-500 dark:text-gray-400 mt-1"></p>
                            </div>
                            <div class="space-y-3">
                                <button id="callButton" style="display: none;"
                                        class="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500">
                                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                                    </svg>
                                    Call
                                </button>
                                <button id="textButton" style="display: none;"
                                        class="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.13 8.13 0 01-1.318-.107l-3.682.773v-2.089A8.002 8.002 0 013 12C3 7.582 6.582 4 12 4s9 3.582 9 8z"></path>
                                    </svg>
                                    Text
                                </button>
                                <button id="emailButton" style="display: none;"
                                        class="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-purple-700 bg-purple-100 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-300 dark:hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500">
                                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                    </svg>
                                    Email
                                </button>
                                <button onclick="window.dashboard?.closeContactModal()" 
                                        class="w-full flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderNavigation() {
        const isAdmin = window.authManager.isAdmin();
        
        return `
            <nav class="bg-white dark:bg-gray-800 shadow-sm">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex justify-between items-center h-16">
                        <div class="flex items-center">
                            <div class="flex-shrink-0 flex items-center">
                                <img src="/icons/icon-32x32.png" alt="RADIUS Logo" class="h-8 w-8 mr-3">
                                <h1 class="text-xl font-bold text-gray-900 dark:text-white">RADIUS</h1>
                            </div>
                        </div>
                        <div class="flex items-center space-x-4">
                            <button onclick="window.app.toggleTheme()" 
                                    class="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                                </svg>
                            </button>
                            <div class="relative">
                                <button id="menuButton" class="flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                                    </svg>
                                </button>
                                <div id="menuDropdown" class="hidden absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 z-50">
                                    <a href="#" onclick="window.router.navigate('/dashboard')" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600">Dashboard</a>
                                    <a href="#" onclick="window.router.navigate('/circle-leader/new')" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600">Add Circle Leader</a>
                                    <a href="#" onclick="window.router.navigate('/profile')" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600">My Profile</a>
                                    <a href="#" onclick="window.router.navigate('/org-settings')" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600">Organization Settings</a>
                                    <a href="#" onclick="window.router.navigate('/reports')" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600">Reports</a>
                                    ${isAdmin ? `<a href="#" onclick="window.router.navigate('/import')" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600">Import Data</a>` : ''}
                                    <a href="#" onclick="window.authManager.signOut()" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600">Log out</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        `;
    }

    renderHeader() {
        const isAdmin = window.authManager.isAdmin();
        
        return `
            <div class="mb-8">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
                </div>
            </div>
        `;
    }

    renderFilters() {
        return `
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-4">
                    <!-- Search -->
                    <div>
                        <label for="search" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search</label>
                        <input type="text" id="search" placeholder="Search by name..." 
                               class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500">
                    </div>

                    <!-- Campus Filter -->
                    <div>
                        <label for="campusFilter" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Campus</label>
                        <select id="campusFilter" multiple 
                                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500">
                            <!-- Options will be populated dynamically -->
                        </select>
                    </div>

                    <!-- ACPD Filter -->
                    <div>
                        <label for="acpdFilter" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ACPD</label>
                        <select id="acpdFilter" multiple 
                                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500">
                            <!-- Options will be populated dynamically -->
                        </select>
                    </div>

                    <!-- Status Filter -->
                    <div>
                        <label for="statusFilter" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                        <select id="statusFilter" multiple 
                                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500">
                            <!-- Options will be populated dynamically -->
                        </select>
                    </div>

                    <!-- Sort -->
                    <div class="flex space-x-2">
                        <div class="flex-1">
                            <label for="sortBy" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sort By</label>
                            <select id="sortBy" 
                                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500">
                                <option value="name">Name</option>
                                <option value="type">Circle Type</option>
                                <option value="day">Day</option>
                                <option value="time">Time</option>
                                <option value="frequency">Frequency</option>
                                <option value="status">Status</option>
                            </select>
                        </div>
                        <div class="flex flex-col">
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Order</label>
                            <button id="sortOrderBtn" 
                                    class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500 flex items-center justify-center">
                                <svg id="sortOrderIcon" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderCollapsibleFilters() {
        const filtersVisible = localStorage.getItem('filtersVisible') !== 'false'; // Default to true
        
        return `
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
                <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center">
                            <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-md flex items-center justify-center mr-3">
                                <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clip-rule="evenodd"></path>
                                </svg>
                            </div>
                            <div>
                                <h3 class="text-lg font-medium text-gray-900 dark:text-white">Filters & Search</h3>
                                <p class="text-sm text-gray-500 dark:text-gray-400">Filter and sort Circle Leaders</p>
                            </div>
                        </div>
                        <button id="toggleFiltersBtn"
                                class="flex items-center px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 focus:outline-none">
                            <span id="toggleFiltersText">${filtersVisible ? 'Hide Filters' : 'Edit Filters'}</span>
                            <svg id="toggleFiltersIcon" class="w-4 h-4 ml-2 transform transition-transform ${filtersVisible ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </button>
                    </div>
                </div>
                <div id="filtersPanel" class="${filtersVisible ? '' : 'hidden'}">
                    <div class="p-6">
                        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
                            <!-- Search -->
                            <div class="sm:col-span-2">
                                <label for="search" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search</label>
                                <input type="text" id="search" placeholder="Search by name..." 
                                       class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                            </div>

                            <!-- Campus Filter -->
                            <div>
                                <label for="campusFilter" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Campus</label>
                                <select id="campusFilter" multiple 
                                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                                    <!-- Options will be populated dynamically -->
                                </select>
                            </div>

                            <!-- ACPD Filter -->
                            <div>
                                <label for="acpdFilter" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ACPD</label>
                                <select id="acpdFilter" multiple 
                                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                                    <!-- Options will be populated dynamically -->
                                </select>
                            </div>

                            <!-- Status Filter -->
                            <div>
                                <label for="statusFilter" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                                <select id="statusFilter" multiple 
                                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                                    <!-- Options will be populated dynamically -->
                                </select>
                            </div>

                            <!-- Meeting Day Filter -->
                            <div>
                                <label for="meetingDayFilter" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Meeting Day</label>
                                <select id="meetingDayFilter" multiple 
                                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                                    <!-- Options will be populated dynamically -->
                                </select>
                            </div>

                            <!-- Circle Type Filter -->
                            <div>
                                <label for="circleTypeFilter" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Circle Type</label>
                                <select id="circleTypeFilter" multiple 
                                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                                    <!-- Options will be populated dynamically -->
                                </select>
                            </div>

                            <!-- Event Summary Filter -->
                            <div>
                                <label for="eventSummaryFilter" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Event Summary</label>
                                <select id="eventSummaryFilter"
                                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                                    <option value="all">All</option>
                                    <option value="received">Summary Received</option>
                                    <option value="not_received">Summary Not Received</option>
                                </select>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderEventSummaryProgress() {
        return `
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
                <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center">
                            <div class="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-md flex items-center justify-center mr-3">
                                <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                                </svg>
                            </div>
                            <div>
                                <h3 class="text-lg font-medium text-gray-900 dark:text-white">Event Summaries Received</h3>
                                <p class="text-sm text-gray-500 dark:text-gray-400">
                                    <span id="progressText">0 out of 0 received</span>
                                </p>
                            </div>
                        </div>
                        <button id="resetCheckboxesBtn"
                                class="flex items-center px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900 rounded-md border border-red-300 dark:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-500">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                            </svg>
                            Reset Checkboxes
                        </button>
                    </div>
                </div>
                <div class="px-6 py-4">
                    <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div id="progressBar" class="bg-red-500 h-3 rounded-full transition-all duration-300" style="width: 0%"></div>
                    </div>
                </div>
            </div>
        `;
    }

    renderTodayCircles() {
        return `
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
                <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <div class="flex items-center">
                        <div class="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-md flex items-center justify-center mr-3">
                            <svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path>
                            </svg>
                        </div>
                        <div>
                            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Today's Circles</h3>
                            <p class="text-sm text-gray-500 dark:text-gray-400">Circle Leaders meeting today</p>
                        </div>
                    </div>
                </div>
                <div class="overflow-x-auto">
                    <div id="todayCirclesTable" class="min-w-full">
                        <!-- Table content will be populated dynamically -->
                    </div>
                </div>
            </div>
        `;
    }

    async init() {
        // Set up global reference for onclick handlers
        window.dashboard = this;
        
        this.setupEventListeners();
        await this.loadData();
        this.renderCircleLeaders();
        this.updateStats();
        
        // Use setTimeout to ensure all DOM elements are ready
        setTimeout(() => {
            this.refreshEventSummaryProgress();
        }, 100);
        
        // Ensure global reference is still set after initialization
        window.dashboard = this;
    }

    setupEventListeners() {
        // Clean up existing listeners first to prevent duplicates
        this.cleanup();
        
        // Menu toggle
        const menuButton = document.getElementById('menuButton');
        const menuDropdown = document.getElementById('menuDropdown');
        
        const menuClickHandler = () => {
            menuDropdown.classList.toggle('hidden');
        };
        
        menuButton?.addEventListener('click', menuClickHandler);
        this.eventHandlers.menuClick = { element: menuButton, handler: menuClickHandler };

        // Close menu when clicking outside
        const documentClickHandler = (e) => {
            if (!menuButton?.contains(e.target) && !menuDropdown?.contains(e.target)) {
                menuDropdown?.classList.add('hidden');
            }
        };
        
        document.addEventListener('click', documentClickHandler);
        this.eventHandlers.documentClick = { element: document, handler: documentClickHandler };

        // Filter toggle button
        const toggleFiltersBtn = document.getElementById('toggleFiltersBtn');
        toggleFiltersBtn?.addEventListener('click', () => {
            this.toggleFilters();
        });

        // Search with debounce
        const searchInput = document.getElementById('search');
        searchInput?.addEventListener('input', window.utils.debounce((e) => {
            this.filters.search = e.target.value;
            this.applyFilters();
            this.saveFilterState();
        }, 300));

        // Filters
        const campusFilter = document.getElementById('campusFilter');
        const acpdFilter = document.getElementById('acpdFilter');
        const statusFilter = document.getElementById('statusFilter');
        const meetingDayFilter = document.getElementById('meetingDayFilter');
        const circleTypeFilter = document.getElementById('circleTypeFilter');

        campusFilter?.addEventListener('change', () => {
            this.filters.campus = Array.from(campusFilter.selectedOptions).map(option => option.value);
            this.applyFilters();
            this.saveFilterState();
        });

        acpdFilter?.addEventListener('change', () => {
            this.filters.acpd = Array.from(acpdFilter.selectedOptions).map(option => option.value);
            this.applyFilters();
            this.saveFilterState();
        });

        statusFilter?.addEventListener('change', () => {
            this.filters.status = Array.from(statusFilter.selectedOptions).map(option => option.value);
            this.applyFilters();
            this.saveFilterState();
        });

        meetingDayFilter?.addEventListener('change', () => {
            this.filters.meetingDay = Array.from(meetingDayFilter.selectedOptions).map(option => option.value);
            this.applyFilters();
            this.saveFilterState();
        });

        circleTypeFilter?.addEventListener('change', () => {
            this.filters.circleType = Array.from(circleTypeFilter.selectedOptions).map(option => option.value);
            this.applyFilters();
            this.saveFilterState();
        });

        // Event Summary Filter
        const eventSummaryFilter = document.getElementById('eventSummaryFilter');
        eventSummaryFilter?.addEventListener('change', () => {
            this.filters.eventSummary = eventSummaryFilter.value;
            this.applyFilters();
            this.saveFilterState();
        });

        // Reset Checkboxes Button
        const resetCheckboxesBtn = document.getElementById('resetCheckboxesBtn');
        resetCheckboxesBtn?.addEventListener('click', () => {
            this.resetEventSummaryCheckboxes();
        });

        // Phone modal click outside handler
        document.addEventListener('click', (e) => {
            const modal = document.getElementById('phoneModal');
            if (modal && !modal.classList.contains('hidden') && e.target === modal) {
                this.closePhoneModal();
            }
        });
    }

    toggleFilters() {
        const filtersPanel = document.getElementById('filtersPanel');
        const toggleFiltersText = document.getElementById('toggleFiltersText');
        const toggleFiltersIcon = document.getElementById('toggleFiltersIcon');
        
        if (filtersPanel && toggleFiltersText && toggleFiltersIcon) {
            const isHidden = filtersPanel.classList.contains('hidden');
            
            if (isHidden) {
                filtersPanel.classList.remove('hidden');
                toggleFiltersText.textContent = 'Hide Filters';
                toggleFiltersIcon.classList.add('rotate-180');
                localStorage.setItem('filtersVisible', 'true');
            } else {
                filtersPanel.classList.add('hidden');
                toggleFiltersText.textContent = 'Edit Filters';
                toggleFiltersIcon.classList.remove('rotate-180');
                localStorage.setItem('filtersVisible', 'false');
            }
        }
    }

    async loadData() {
        if (this.isLoading) {
            console.log('[Dashboard] Load already in progress, skipping');
            return;
        }

        // Validate authentication state before proceeding
        if (!window.authManager || !window.authManager.isAuthenticated()) {
            console.error('[Dashboard] User not authenticated, redirecting to login');
            window.router?.navigate('/login');
            return;
        }

        // Check if Supabase is available
        if (!window.supabase) {
            console.error('[Dashboard] Supabase not available');
            window.utils?.showNotification('Database connection error', 'error');
            return;
        }
        
        this.isLoading = true;
        console.log('[Dashboard] loadData called');
        
        try {
            // Load circle leaders with timeout
            console.log('[Dashboard] Loading circle leaders...');
            
            const leadersPromise = supabase
                .from('circle_leaders')
                .select('*')
                .order('name');
            
            // Create timeout with cleanup
            let timeoutId;
            const timeoutPromise = new Promise((_, reject) => {
                timeoutId = setTimeout(() => reject(new Error('Database query timeout')), 15000);
            });
            
            const { data: leaders, error: leadersError } = await Promise.race([leadersPromise, timeoutPromise]);
            
            // Clear timeout if query completes
            if (timeoutId) {
                clearTimeout(timeoutId);
            }

            console.log('[Dashboard] Circle leaders query result:', { leaders, error: leadersError });

            if (leadersError) throw leadersError;
            this.circleLeaders = leaders || [];
            console.log('[Dashboard] Loaded', this.circleLeaders.length, 'circle leaders');
            
            // Load last note for each circle leader
            if (this.circleLeaders.length > 0) {
                console.log('[Dashboard] Loading last notes for circle leaders...');
                
                try {
                    const notesPromise = supabase
                        .from('notes')
                        .select('circle_leader_id, content, created_at')
                        .order('created_at', { ascending: false });
                    
                    // Create separate timeout for notes
                    let notesTimeoutId;
                    const notesTimeoutPromise = new Promise((_, reject) => {
                        notesTimeoutId = setTimeout(() => reject(new Error('Notes query timeout')), 10000);
                    });
                    
                    const { data: notes, error: notesError } = await Promise.race([notesPromise, notesTimeoutPromise]);
                    
                    // Clear timeout
                    if (notesTimeoutId) {
                        clearTimeout(notesTimeoutId);
                    }
                    
                    if (!notesError && notes) {
                        // Group notes by circle leader ID and get the most recent for each
                        const notesByLeader = {};
                        notes.forEach(note => {
                            if (!notesByLeader[note.circle_leader_id]) {
                                notesByLeader[note.circle_leader_id] = note;
                            }
                        });
                        
                        // Add last note to each circle leader
                        this.circleLeaders = this.circleLeaders.map(leader => ({
                            ...leader,
                            last_note: notesByLeader[leader.id]
                        }));
                        
                        console.log('[Dashboard] Added last notes to circle leaders');
                    } else if (notesError) {
                        console.warn('[Dashboard] Notes loading failed, continuing without notes:', notesError);
                    }
                } catch (notesError) {
                    console.warn('[Dashboard] Notes loading failed, continuing without notes:', notesError);
                    // Continue without notes - don't fail the entire load
                }
            }
            
            // Check if event_summary_received column exists in the data
            if (this.circleLeaders.length > 0) {
                const firstLeader = this.circleLeaders[0];
                console.log('[Dashboard] First leader columns:', Object.keys(firstLeader));
                console.log('[Dashboard] event_summary_received exists:', 'event_summary_received' in firstLeader);
            }

            // Load unique campuses, ACPDs, statuses, and circle types for filters
            this.campuses = [...new Set(leaders?.map(l => l.campus).filter(Boolean))];
            this.acpds = [...new Set(leaders?.map(l => l.acpd).filter(Boolean))];
            this.statuses = [...new Set(leaders?.map(l => l.status).filter(Boolean))];
            this.circleTypes = [...new Set(leaders?.map(l => l.circle_type).filter(Boolean))];
            console.log('[Dashboard] Extracted campuses:', this.campuses);
            console.log('[Dashboard] Extracted ACPDs:', this.acpds);
            console.log('[Dashboard] Extracted statuses:', this.statuses);
            console.log('[Dashboard] Extracted circle types:', this.circleTypes);

            // Populate filter options
            this.populateFilterOptions();
            console.log('[Dashboard] Filter options populated');

            // Restore saved filter values to UI
            this.restoreFilterValues();
            console.log('[Dashboard] Filter values restored to UI');

            // Apply initial filters and render
            this.applyFilters();
            console.log('[Dashboard] Initial filters applied and data rendered');

        } catch (error) {
            console.error('[Dashboard] Error loading data:', error);
            
            // Handle different types of errors
            if (error.message.includes('timeout')) {
                window.utils?.showNotification('Loading taking longer than expected. Please refresh if needed.', 'warning');
            } else if (error.message.includes('network') || error.message.includes('fetch')) {
                window.utils?.showNotification('Network error. Please check your connection and try again.', 'error');
            } else if (error.message.includes('auth') || error.code === 'PGRST301') {
                console.error('[Dashboard] Authentication error, redirecting to login');
                window.router?.navigate('/login');
                return;
            } else {
                window.utils?.showNotification('Error loading circle leaders. Please refresh the page.', 'error');
            }
        } finally {
            this.isLoading = false;
            console.log('[Dashboard] Load complete, isLoading reset to false');
        }
    }

    populateFilterOptions() {
        const campusFilter = document.getElementById('campusFilter');
        const acpdFilter = document.getElementById('acpdFilter');
        const statusFilter = document.getElementById('statusFilter');
        const meetingDayFilter = document.getElementById('meetingDayFilter');
        const circleTypeFilter = document.getElementById('circleTypeFilter');

        if (campusFilter) {
            campusFilter.innerHTML = this.campuses.map(campus => 
                `<option value="${campus}">${campus}</option>`
            ).join('');
        }

        if (acpdFilter) {
            acpdFilter.innerHTML = this.acpds.map(acpd => 
                `<option value="${acpd}">${acpd}</option>`
            ).join('');
        }

        if (statusFilter) {
            statusFilter.innerHTML = this.statuses.map(status => 
                `<option value="${status}">${status}</option>`
            ).join('');
        }

        if (meetingDayFilter) {
            meetingDayFilter.innerHTML = this.meetingDays.map(day => 
                `<option value="${day}">${day}</option>`
            ).join('');
        }

        if (circleTypeFilter) {
            circleTypeFilter.innerHTML = this.circleTypes.map(type => 
                `<option value="${type}">${type}</option>`
            ).join('');
        }
    }

    restoreFilterValues() {
        // Restore search input
        const searchInput = document.getElementById('search');
        if (searchInput) {
            searchInput.value = this.filters.search;
        }

        // Restore campus filter
        const campusFilter = document.getElementById('campusFilter');
        if (campusFilter) {
            Array.from(campusFilter.options).forEach(option => {
                option.selected = this.filters.campus.includes(option.value);
            });
        }

        // Restore ACPD filter
        const acpdFilter = document.getElementById('acpdFilter');
        if (acpdFilter) {
            Array.from(acpdFilter.options).forEach(option => {
                option.selected = this.filters.acpd.includes(option.value);
            });
        }

        // Restore status filter
        const statusFilter = document.getElementById('statusFilter');
        if (statusFilter) {
            Array.from(statusFilter.options).forEach(option => {
                option.selected = this.filters.status.includes(option.value);
            });
        }

        // Restore meeting day filter
        const meetingDayFilter = document.getElementById('meetingDayFilter');
        if (meetingDayFilter) {
            Array.from(meetingDayFilter.options).forEach(option => {
                option.selected = this.filters.meetingDay.includes(option.value);
            });
        }

        // Restore circle type filter
        const circleTypeFilter = document.getElementById('circleTypeFilter');
        if (circleTypeFilter) {
            Array.from(circleTypeFilter.options).forEach(option => {
                option.selected = this.filters.circleType.includes(option.value);
            });
        }

        // Restore event summary filter
        const eventSummaryFilter = document.getElementById('eventSummaryFilter');
        if (eventSummaryFilter) {
            eventSummaryFilter.value = this.filters.eventSummary;
        }

    }

    applyFilters() {
        let filtered = [...this.circleLeaders];

        // Search filter
        if (this.filters.search) {
            const search = this.filters.search.toLowerCase();
            filtered = filtered.filter(leader => 
                leader.name?.toLowerCase().includes(search)
            );
        }

        // Campus filter
        if (this.filters.campus.length > 0) {
            filtered = filtered.filter(leader => 
                this.filters.campus.includes(leader.campus)
            );
        }

        // ACPD filter
        if (this.filters.acpd.length > 0) {
            filtered = filtered.filter(leader => 
                this.filters.acpd.includes(leader.acpd)
            );
        }

        // Status filter
        if (this.filters.status.length > 0) {
            filtered = filtered.filter(leader => 
                this.filters.status.includes(leader.status)
            );
        }

        // Meeting Day filter
        if (this.filters.meetingDay.length > 0) {
            filtered = filtered.filter(leader => 
                this.filters.meetingDay.includes(leader.day)
            );
        }

        // Circle Type filter
        if (this.filters.circleType.length > 0) {
            filtered = filtered.filter(leader => 
                this.filters.circleType.includes(leader.circle_type)
            );
        }

        // Event Summary filter
        if (this.filters.eventSummary === 'received') {
            filtered = filtered.filter(leader => leader.event_summary_received === true);
        } else if (this.filters.eventSummary === 'not_received') {
            filtered = filtered.filter(leader => leader.event_summary_received !== true);
        }

        // Default sort by name
        filtered.sort((a, b) => {
            const aName = a.name || '';
            const bName = b.name || '';
            return aName.localeCompare(bName);
        });

        this.filteredLeaders = filtered;
        this.renderCircleLeaders();
        this.updateTodayCirclesTable();
        
        // Use setTimeout to ensure DOM elements are rendered before updating progress
        setTimeout(() => {
            this.updateEventSummaryProgress();
        }, 0);
        
        // Safely ensure global reference without triggering events
        this.ensureGlobalReference();
    }

    renderCircleLeaders() {
        const grid = document.getElementById('circleLeadersGrid');
        const emptyState = document.getElementById('emptyState');

        if (this.filteredLeaders.length === 0) {
            grid.classList.add('hidden');
            emptyState.classList.remove('hidden');
            return;
        }

        grid.classList.remove('hidden');
        emptyState.classList.add('hidden');

        grid.innerHTML = this.filteredLeaders.map(leader => this.renderCircleLeaderCard(leader)).join('');
        
        // Safely ensure global reference
        this.ensureGlobalReference();
    }

    renderCircleLeaderCard(leader) {
        const statusColors = {
            'Invited': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
            'In Training': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
            'Active': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
            'Paused': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
        };

        const isAdmin = window.authManager.isAdmin();

        return `
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow">
                <div class="p-6">
                    <!-- Header -->
                    <div class="flex items-start justify-between mb-4">
                        <div>
                            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-1">${leader.name || 'Unknown'}</h3>
                            <p class="text-sm text-gray-500 dark:text-gray-400">
                                ${leader.circle_type || ''} → ${leader.day || ''} → ${leader.time || ''} → ${leader.frequency || ''}
                            </p>
                        </div>
                    </div>

                    <!-- Status Badge -->
                    <div class="mb-4">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[leader.status] || statusColors['Paused']}">
                            ${leader.status || 'Unknown'}
                        </span>
                    </div>

                    <!-- Contact Information -->
                    ${leader.email || leader.phone ? `
                        <div class="mb-4">
                            <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Contact</p>
                            <div class="flex space-x-2">
                                <button onclick="window.dashboard?.openContactModal('${leader.id}', '${leader.name}', '${leader.email || ''}', '${leader.phone || ''}')" 
                                        class="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-3 py-1 rounded hover:bg-blue-200 dark:hover:bg-blue-800 flex items-center">
                                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                                    </svg>
                                    Contact
                                </button>
                            </div>
                        </div>
                    ` : ''}

                    <!-- Last Note -->
                    <div class="mb-4">
                        <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Last Note</p>
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                            ${leader.last_note ? 
                                `<span class="block truncate">${leader.last_note.content?.replace(/<[^>]*>/g, '').substring(0, 100)}${leader.last_note.content?.length > 100 ? '...' : ''}</span>` : 
                                'No notes yet'
                            }
                        </p>
                    </div>

                    <!-- Event Summary Checkbox -->
                    <div class="mb-4">
                        <div class="flex items-center">
                            <input type="checkbox" 
                                   id="eventSummary_${leader.id}" 
                                   ${leader.event_summary_received ? 'checked' : ''}
                                   onchange="window.dashboard?.toggleEventSummary('${leader.id}', this.checked)"
                                   class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700">
                            <label for="eventSummary_${leader.id}" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                Event Summary
                            </label>
                        </div>
                    </div>

                    <!-- Links -->
                    <div class="flex space-x-2 mb-4">
                        ${leader.ccb_profile_link ? `
                            <a href="${leader.ccb_profile_link}" target="_blank" 
                               class="text-xs bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300 px-2 py-1 rounded hover:bg-primary-200 dark:hover:bg-primary-800">
                                CCB Profile
                            </a>
                        ` : ''}
                        ${leader.calendar_link ? `
                            <a href="${leader.calendar_link}" target="_blank" 
                               class="text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 px-2 py-1 rounded hover:bg-green-200 dark:hover:bg-green-800">
                                Calendar
                            </a>
                        ` : ''}
                    </div>

                    <!-- Actions -->
                    <div class="flex justify-between">
                        <div class="flex space-x-2">
                            <button onclick="window.router.navigate('/circle-leader/${leader.id}')" 
                                    class="text-sm bg-primary-600 text-white px-3 py-1 rounded hover:bg-primary-700">
                                View Profile
                            </button>
                            ${isAdmin ? `
                                <button onclick="window.router.navigate('/circle-leader/${leader.id}/edit')" 
                                        class="text-sm bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700">
                                    Edit
                                </button>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    async updateStats() {
        console.log('[Dashboard] updateStats called');
        try {
            // Validate authentication state
            if (!window.authManager || !window.authManager.isAuthenticated()) {
                console.warn('[Dashboard] User not authenticated, skipping stats update');
                return;
            }

            // Check if APP_CONFIG is available
            if (!window.APP_CONFIG || !window.APP_CONFIG.communicationTypes) {
                console.error('[Dashboard] APP_CONFIG not available, skipping stats update');
                return;
            }

            // Check if Supabase is available
            if (!window.supabase) {
                console.error('[Dashboard] Supabase not available, skipping stats update');
                return;
            }

            // Get current month connections
            const startOfMonth = new Date();
            startOfMonth.setDate(1);
            startOfMonth.setHours(0, 0, 0, 0);

            // Format as YYYY-MM-DD for DATE column
            const startDateString = startOfMonth.toISOString().split('T')[0];

            console.log('[Dashboard] Querying communications from:', startDateString);
            const { data: connections, error: connectionsError } = await supabase
                .from('communications')
                .select('circle_leader_id')
                .gte('communication_date', startDateString)
                .in('communication_type', window.APP_CONFIG.communicationTypes);

            console.log('[Dashboard] Communications query result:', { connections, error: connectionsError });

            if (connectionsError) throw connectionsError;

            // Count unique connections this month
            const uniqueConnections = new Set(connections?.map(c => c.circle_leader_id)).size;
            const totalLeaders = this.circleLeaders.length;
            console.log('[Dashboard] Stats:', { uniqueConnections, totalLeaders });

            // Today's circles (placeholder - implement based on your data model)
            const todayCirclesCount = document.getElementById('todayCirclesCount');
            if (todayCirclesCount) todayCirclesCount.textContent = '0';

            // Update Today's Circles table
            this.updateTodayCirclesTable();

            console.log('[Dashboard] Stats updated successfully');

        } catch (error) {
            console.error('[Dashboard] Error updating stats:', error);
        }
    }

    getTodayCircles() {
        const today = new Date();
        const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const todayName = daysOfWeek[today.getDay()].toLowerCase();
        const weekOfMonth = this.getWeekOfMonth(today);
        
        console.log('[Dashboard] Today:', todayName, 'Week of month:', weekOfMonth);
        
        return this.filteredLeaders.filter(leader => {
            if (!leader.day || !leader.frequency) return false;
            
            // Check if meeting day matches today
            const meetingDay = leader.day.toLowerCase();
            if (meetingDay !== todayName) return false;
            
            // Check frequency
            switch (leader.frequency) {
                case 'Weekly':
                    return true;
                case 'Bi-Weekly':
                    // Meets every other week - you might need to track which week they started
                    return weekOfMonth % 2 === 1; // Simplified: odd weeks
                case '2nd & 4th':
                    return weekOfMonth === 2 || weekOfMonth === 4;
                case '1st, 3rd, & 5th':
                    return weekOfMonth === 1 || weekOfMonth === 3 || weekOfMonth === 5;
                default:
                    return false;
            }
        });
    }

    getWeekOfMonth(date) {
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        const firstDayOfWeek = firstDay.getDay();
        const dayOfMonth = date.getDate();
        
        // Calculate which week of the month this date falls in
        return Math.ceil((dayOfMonth + firstDayOfWeek) / 7);
    }

    updateTodayCirclesTable() {
        const tableContainer = document.getElementById('todayCirclesTable');
        if (!tableContainer) return;
        
        const todayCircles = this.getTodayCircles();
        console.log('[Dashboard] Today\'s circles:', todayCircles);
        
        if (todayCircles.length === 0) {
            tableContainer.innerHTML = `
                <div class="p-6 text-center">
                    <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No circles today</h3>
                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">No Circle Leaders are scheduled to meet today.</p>
                </div>
            `;
            return;
        }
        
        tableContainer.innerHTML = `
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-gray-700">
                    <tr>
                        <th class="px-3 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Circle Leader
                        </th>
                        <th class="px-3 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden sm:table-cell">
                            Time
                        </th>
                        <th class="px-3 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell">
                            Frequency
                        </th>
                        <th class="px-3 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Contact
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    ${todayCircles.map(leader => this.renderTodayCircleRow(leader)).join('')}
                </tbody>
            </table>
        `;
    }

    renderTodayCircleRow(leader) {
        const meetingTime = leader.meeting_time ? this.formatTime(leader.meeting_time) : 'Not set';
        
        return `
            <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-3 py-4 sm:px-6 whitespace-nowrap">
                    <div class="flex items-center">
                        <div class="text-sm font-medium">
                            <button onclick="window.router.navigate('/circle-leader/${leader.id}')" 
                                    class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 hover:underline cursor-pointer text-left">
                                ${leader.name || 'Unnamed Leader'}
                            </button>
                        </div>
                    </div>
                </td>
                <td class="px-3 py-4 sm:px-6 whitespace-nowrap hidden sm:table-cell">
                    <div class="text-sm text-gray-900 dark:text-white">${meetingTime}</div>
                </td>
                <td class="px-3 py-4 sm:px-6 whitespace-nowrap hidden md:table-cell">
                    <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                        ${leader.frequency || 'Not set'}
                    </span>
                </td>
                <td class="px-3 py-4 sm:px-6 whitespace-nowrap text-sm font-medium">
                    ${(leader.email || leader.phone) ? `
                        <button onclick="window.dashboard?.openContactModal('${leader.id}', '${leader.name}', '${leader.email || ''}', '${leader.phone || ''}')" 
                                class="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-blue-600 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            Contact
                        </button>
                    ` : `
                        <span class="text-gray-400 dark:text-gray-500 text-xs">No contact info</span>
                    `}
                </td>
            </tr>
        `;
    }

    formatTime(timeString) {
        if (!timeString) return 'Not set';
        
        try {
            // Handle both 24-hour format (HH:MM) and 12-hour format
            if (timeString.includes(':')) {
                const [hours, minutes] = timeString.split(':');
                const hour = parseInt(hours);
                const min = minutes.padStart(2, '0');
                
                if (hour === 0) {
                    return `12:${min} AM`;
                } else if (hour < 12) {
                    return `${hour}:${min} AM`;
                } else if (hour === 12) {
                    return `12:${min} PM`;
                } else {
                    return `${hour - 12}:${min} PM`;
                }
            }
            return timeString;
        } catch (error) {
            console.error('[Dashboard] Error formatting time:', error);
            return timeString;
        }
    }

    openContactModal(leaderId, name, email, phone) {
        const modal = document.getElementById('contactModal');
        const nameSpan = document.getElementById('contactModalName');
        const infoP = document.getElementById('contactModalInfo');
        const callButton = document.getElementById('callButton');
        const textButton = document.getElementById('textButton');
        const emailButton = document.getElementById('emailButton');
        
        if (modal && nameSpan) {
            nameSpan.textContent = name || 'Circle Leader';
            
            // Build info text
            let info = [];
            if (phone) info.push(`Phone: ${phone}`);
            if (email) info.push(`Email: ${email}`);
            infoP.textContent = info.join(' • ');
            
            modal.classList.remove('hidden');
            
            // Show/hide buttons based on available contact info
            if (callButton) {
                if (phone) {
                    callButton.style.display = 'flex';
                    callButton.onclick = () => {
                        window.open(`tel:${phone}`, '_self');
                        this.closeContactModal();
                    };
                } else {
                    callButton.style.display = 'none';
                }
            }
            
            if (textButton) {
                if (phone) {
                    textButton.style.display = 'flex';
                    textButton.onclick = () => {
                        window.open(`sms:${phone}`, '_self');
                        this.closeContactModal();
                    };
                } else {
                    textButton.style.display = 'none';
                }
            }
            
            if (emailButton) {
                if (email) {
                    emailButton.style.display = 'flex';
                    emailButton.onclick = () => {
                        window.open(`mailto:${email}`, '_blank');
                        this.closeContactModal();
                    };
                } else {
                    emailButton.style.display = 'none';
                }
            }
        }
    }

    closeContactModal() {
        const modal = document.getElementById('contactModal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    ensureGlobalReference() {
        if (!window.dashboard || window.dashboard !== this) {
            console.log('[Dashboard] Setting global reference');
            window.dashboard = this;
        }
    }

    async toggleEventSummary(leaderId, isChecked) {
        console.log('[Dashboard] Toggling event summary for leader:', leaderId, 'to:', isChecked);
        
        try {
            // Validate authentication state
            if (!window.authManager || !window.authManager.isAuthenticated()) {
                console.error('[Dashboard] User not authenticated');
                window.router?.navigate('/login');
                return;
            }

            // Check if Supabase is available
            if (!window.supabase) {
                console.error('[Dashboard] Supabase not available');
                window.utils?.showNotification('Database connection error', 'error');
                return;
            }

            // Update in database
            const { error } = await supabase
                .from('circle_leaders')
                .update({ event_summary_received: isChecked })
                .eq('id', leaderId);

            if (error) {
                console.error('[Dashboard] Error updating event summary:', error);
                window.utils?.showNotification('Failed to update event summary', 'error');
                
                // Revert checkbox state
                const checkbox = document.getElementById(`eventSummary_${leaderId}`);
                if (checkbox) {
                    checkbox.checked = !isChecked;
                }
                return;
            }

            // Update local data
            const leader = this.circleLeaders.find(l => l.id === leaderId);
            if (leader) {
                leader.event_summary_received = isChecked;
                console.log('[Dashboard] Updated main leader data:', leader.name, isChecked);
            }

            // Update filtered data if leader is currently visible
            const filteredLeader = this.filteredLeaders.find(l => l.id === leaderId);
            if (filteredLeader) {
                filteredLeader.event_summary_received = isChecked;
                console.log('[Dashboard] Updated filtered leader data:', filteredLeader.name, isChecked);
            }

            // Use setTimeout to ensure DOM is updated before progress calculation
            setTimeout(() => {
                this.refreshEventSummaryProgress();
            }, 0);

            console.log('[Dashboard] Event summary updated successfully');
            
        } catch (error) {
            console.error('[Dashboard] Error in toggleEventSummary:', error);
            window.utils?.showNotification('Error updating event summary', 'error');
            
            // Revert checkbox state
            const checkbox = document.getElementById(`eventSummary_${leaderId}`);
            if (checkbox) {
                checkbox.checked = !isChecked;
            }
        }
    }

    async resetEventSummaryCheckboxes() {
        console.log('[Dashboard] Resetting event summary checkboxes for visible leaders');
        
        if (this.filteredLeaders.length === 0) {
            window.utils?.showNotification('No leaders visible to reset', 'info');
            return;
        }

        const confirmReset = confirm(`This will reset the Event Summary status to "Not Received" for all ${this.filteredLeaders.length} currently visible Circle Leaders. Are you sure?`);
        
        if (!confirmReset) {
            return;
        }

        try {
            // Validate authentication state
            if (!window.authManager || !window.authManager.isAuthenticated()) {
                console.error('[Dashboard] User not authenticated');
                window.router?.navigate('/login');
                return;
            }

            // Check if Supabase is available
            if (!window.supabase) {
                console.error('[Dashboard] Supabase not available');
                window.utils?.showNotification('Database connection error', 'error');
                return;
            }

            // Get IDs of currently filtered leaders
            const leaderIds = this.filteredLeaders.map(leader => leader.id);

            // Update in database
            const { error } = await supabase
                .from('circle_leaders')
                .update({ event_summary_received: false })
                .in('id', leaderIds);

            if (error) {
                console.error('[Dashboard] Error resetting event summaries:', error);
                window.utils?.showNotification('Failed to reset event summaries', 'error');
                return;
            }

            // Update local data
            this.circleLeaders.forEach(leader => {
                if (leaderIds.includes(leader.id)) {
                    leader.event_summary_received = false;
                }
            });

            this.filteredLeaders.forEach(leader => {
                leader.event_summary_received = false;
            });

            // Update UI - uncheck all visible checkboxes
            leaderIds.forEach(leaderId => {
                const checkbox = document.getElementById(`eventSummary_${leaderId}`);
                if (checkbox) {
                    checkbox.checked = false;
                }
            });

            // Update progress bar
            setTimeout(() => {
                this.refreshEventSummaryProgress();
            }, 0);

            window.utils?.showNotification(`Reset ${leaderIds.length} event summary checkboxes`, 'success');
            console.log('[Dashboard] Event summary checkboxes reset successfully');
            
        } catch (error) {
            console.error('[Dashboard] Error in resetEventSummaryCheckboxes:', error);
            window.utils?.showNotification('Error resetting event summaries', 'error');
        }
    }

    updateEventSummaryProgress() {
        const progressText = document.getElementById('progressText');
        const progressBar = document.getElementById('progressBar');
        
        if (!progressText || !progressBar) {
            console.warn('[Dashboard] Progress elements not found:', { progressText: !!progressText, progressBar: !!progressBar });
            return;
        }

        // Count received summaries in filtered leaders (currently visible)
        const totalVisible = this.filteredLeaders.length;
        const receivedCount = this.filteredLeaders.filter(leader => leader.event_summary_received === true).length;
        
        // Calculate percentage
        const percentage = totalVisible > 0 ? Math.round((receivedCount / totalVisible) * 100) : 0;
        
        // Update text
        progressText.textContent = `${receivedCount} out of ${totalVisible} received`;
        
        // Update progress bar with smooth transition
        progressBar.style.width = `${percentage}%`;
        
        // Add color coding based on progress
        progressBar.className = progressBar.className.replace(/bg-\w+-\d+/g, '');
        if (percentage === 100) {
            progressBar.classList.add('bg-green-600');
        } else if (percentage >= 75) {
            progressBar.classList.add('bg-green-500');
        } else if (percentage >= 50) {
            progressBar.classList.add('bg-yellow-500');
        } else if (percentage >= 25) {
            progressBar.classList.add('bg-orange-500');
        } else {
            progressBar.classList.add('bg-red-500');
        }
        
        console.log('[Dashboard] Progress updated:', { receivedCount, totalVisible, percentage });
    }

    // Force refresh of progress bar data
    refreshEventSummaryProgress() {
        console.log('[Dashboard] Force refreshing progress data...');
        
        // Log current state for debugging
        console.log('[Dashboard] Current filteredLeaders:', this.filteredLeaders.length);
        console.log('[Dashboard] Received status:', this.filteredLeaders.map(l => ({ 
            name: l.name, 
            received: l.event_summary_received 
        })));
        
        this.updateEventSummaryProgress();
    }

    cleanup() {
        // Clean up event listeners to prevent memory leaks and duplicates
        Object.values(this.eventHandlers).forEach(({ element, handler }) => {
            if (element && handler) {
                element.removeEventListener('click', handler);
            }
        });
        this.eventHandlers = {};
        
        // Clean up global reference
        if (window.dashboard === this) {
            window.dashboard = null;
        }
    }
}
// Cache bust: Mon Jul 28 00:45:35 CDT 2025
