// Dashboard Page Module
export default class DashboardPage {
    constructor() {
        this.circleLeaders = [];
        this.filteredLeaders = [];
        this.campuses = [];
        this.acpds = [];
        this.statuses = [];
        this.filters = {
            search: '',
            campus: [],
            acpd: [],
            status: []
        };
        this.sortBy = 'name';
        this.sortOrder = 'asc';
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
            sortBy: this.sortBy,
            sortOrder: this.sortOrder
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
                this.sortBy = filterState.sortBy || 'name';
                this.sortOrder = filterState.sortOrder || 'asc';
                console.log('[Dashboard] Filter state loaded:', filterState);
            }
        } catch (error) {
            console.error('[Dashboard] Error loading filter state:', error);
            // Reset to defaults if there's an error
            this.filters = {
                search: '',
                campus: [],
                acpd: [],
                status: []
            };
            this.sortBy = 'name';
            this.sortOrder = 'asc';
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

                <!-- Filters and Search -->
                ${this.renderFilters()}

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

                <!-- Phone Action Modal -->
                <div id="phoneModal" class="hidden fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
                        <div class="mt-3">
                            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Contact Options</h3>
                            <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
                                Phone: <span id="modalPhoneNumber" class="font-medium text-gray-900 dark:text-white"></span>
                            </p>
                            <div class="flex flex-col space-y-3">
                                <button id="callButton" 
                                        class="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 flex items-center justify-center">
                                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                                    </svg>
                                    Call
                                </button>
                                <button id="textButton" 
                                        class="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 flex items-center justify-center">
                                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                                    </svg>
                                    Text
                                </button>
                                <button onclick="window.dashboard.closePhoneModal()" 
                                        class="w-full bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700">
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
                
                <!-- Event Summary Progress Bar -->
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
                    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                        <!-- Progress Information -->
                        <div class="flex items-center space-x-4">
                            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Event Summary Progress</h3>
                            <div class="flex items-center space-x-2">
                                <div class="bg-gray-200 dark:bg-gray-700 rounded-full h-3 w-32">
                                    <div id="eventSummaryProgressBar" class="bg-green-500 h-3 rounded-full transition-all duration-300" style="width: 0%"></div>
                                </div>
                                <span id="eventSummaryProgressText" class="text-sm font-medium text-gray-900 dark:text-white">0 of 0 received</span>
                            </div>
                        </div>
                        
                        <!-- Uncheck All Button -->
                        <button id="uncheckAllBtn" onclick="window.dashboard.uncheckAllEventSummaries()"
                                class="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm">
                            <svg class="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                            Uncheck All Displayed
                        </button>
                    </div>
                </div>

                </div>

                <!-- Today's Circles Table -->
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
            </div>
        `;
    }

    renderFilters() {
        return `
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
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

    async init() {
        // Set up global reference for onclick handlers
        window.dashboard = this;
        
        this.setupEventListeners();
        await this.loadData();
        this.renderCircleLeaders();
        this.updateStats();
        
        // Ensure global reference is still set after initialization
        window.dashboard = this;
    }

    setupEventListeners() {
        // Menu toggle
        const menuButton = document.getElementById('menuButton');
        const menuDropdown = document.getElementById('menuDropdown');
        
        menuButton?.addEventListener('click', () => {
            menuDropdown.classList.toggle('hidden');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!menuButton?.contains(e.target) && !menuDropdown?.contains(e.target)) {
                menuDropdown?.classList.add('hidden');
            }
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
        const sortBySelect = document.getElementById('sortBy');
        const sortOrderBtn = document.getElementById('sortOrderBtn');

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

        sortBySelect?.addEventListener('change', () => {
            this.sortBy = sortBySelect.value;
            this.applyFilters();
            this.saveFilterState();
        });

        sortOrderBtn?.addEventListener('click', () => {
            this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
            this.updateSortOrderIcon();
            this.applyFilters();
            this.saveFilterState();
        });

        // Phone modal click outside handler
        document.addEventListener('click', (e) => {
            const modal = document.getElementById('phoneModal');
            if (modal && !modal.classList.contains('hidden') && e.target === modal) {
                this.closePhoneModal();
            }
        });

        // Remove the event delegation approach since we're using inline handlers
        // Event summary checkbox handler is now handled via inline onchange
    }

    async handleEventSummaryChange(leaderId, isChecked) {
        console.log('[Dashboard] Event summary checkbox changed:', { leaderId, isChecked });
        
        // Update UI optimistically first
        const leader = this.circleLeaders.find(l => l.id === leaderId);
        const filteredLeader = this.filteredLeaders.find(l => l.id === leaderId);
        
        console.log('[Dashboard] Found leader in circleLeaders:', !!leader);
        console.log('[Dashboard] Found leader in filteredLeaders:', !!filteredLeader);
        
        if (leader) {
            leader.event_summary_received = isChecked;
        }
        if (filteredLeader) {
            filteredLeader.event_summary_received = isChecked;
        }
        
        // Update progress bar immediately
        this.updateEventSummaryProgress();
        
        // Then update the database
        await this.updateEventSummaryStatus(leaderId, isChecked);
    }

    async loadData() {
        if (this.isLoading) {
            console.log('[Dashboard] Load already in progress, skipping');
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
            
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Database query timeout')), 15000)
            );
            
            const { data: leaders, error: leadersError } = await Promise.race([leadersPromise, timeoutPromise]);

            console.log('[Dashboard] Circle leaders query result:', { leaders, error: leadersError });

            if (leadersError) throw leadersError;
            this.circleLeaders = leaders || [];
            console.log('[Dashboard] Loaded', this.circleLeaders.length, 'circle leaders');
            
            // Load last note for each circle leader
            if (this.circleLeaders.length > 0) {
                console.log('[Dashboard] Loading last notes for circle leaders...');
                
                const notesPromise = supabase
                    .from('notes')
                    .select('circle_leader_id, content, created_at')
                    .order('created_at', { ascending: false });
                
                const { data: notes, error: notesError } = await Promise.race([notesPromise, timeoutPromise]);
                
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
                }
            }
            
            // Check if event_summary_received column exists in the data
            if (this.circleLeaders.length > 0) {
                const firstLeader = this.circleLeaders[0];
                console.log('[Dashboard] First leader columns:', Object.keys(firstLeader));
                console.log('[Dashboard] event_summary_received exists:', 'event_summary_received' in firstLeader);
            }

            // Load unique campuses and ACPDs for filters
            this.campuses = [...new Set(leaders?.map(l => l.campus).filter(Boolean))];
            this.acpds = [...new Set(leaders?.map(l => l.acpd).filter(Boolean))];
            this.statuses = [...new Set(leaders?.map(l => l.status).filter(Boolean))];
            console.log('[Dashboard] Extracted campuses:', this.campuses);
            console.log('[Dashboard] Extracted ACPDs:', this.acpds);
            console.log('[Dashboard] Extracted statuses:', this.statuses);

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
            window.utils.showNotification('Error loading circle leaders', 'error');
        } finally {
            this.isLoading = false;
            console.log('[Dashboard] Load complete, isLoading reset to false');
        }
    }

    populateFilterOptions() {
        const campusFilter = document.getElementById('campusFilter');
        const acpdFilter = document.getElementById('acpdFilter');
        const statusFilter = document.getElementById('statusFilter');

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

        // Restore sort options
        const sortBySelect = document.getElementById('sortBy');
        if (sortBySelect) {
            sortBySelect.value = this.sortBy;
        }

        // Update sort order icon
        this.updateSortOrderIcon();
    }

    updateSortOrderIcon() {
        const sortOrderIcon = document.getElementById('sortOrderIcon');
        if (sortOrderIcon) {
            if (this.sortOrder === 'asc') {
                // Up arrow for ascending
                sortOrderIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"></path>';
            } else {
                // Down arrow for descending
                sortOrderIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6"></path>';
            }
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

        // Sort
        filtered.sort((a, b) => {
            // Map sort field names to actual database fields
            let sortField = this.sortBy;
            if (sortField === 'type') {
                sortField = 'circle_type';
            }
            
            let aVal = a[sortField] || '';
            let bVal = b[sortField] || '';
            
            let result;
            if (this.sortBy === 'name') {
                result = aVal.localeCompare(bVal);
            } else if (this.sortBy === 'day') {
                // Custom sorting for days of the week: Sunday through Saturday
                const dayOrder = {
                    'Sunday': 0, 'Sun': 0,
                    'Monday': 1, 'Mon': 1,
                    'Tuesday': 2, 'Tue': 2,
                    'Wednesday': 3, 'Wed': 3,
                    'Thursday': 4, 'Thu': 4,
                    'Friday': 5, 'Fri': 5,
                    'Saturday': 6, 'Sat': 6
                };
                
                const aDay = dayOrder[aVal] !== undefined ? dayOrder[aVal] : 999;
                const bDay = dayOrder[bVal] !== undefined ? dayOrder[bVal] : 999;
                
                result = aDay - bDay;
            } else {
                result = aVal.toString().localeCompare(bVal.toString());
            }
            
            // Apply sort order (reverse for descending)
            return this.sortOrder === 'desc' ? -result : result;
        });

        this.filteredLeaders = filtered;
        this.renderCircleLeaders();
        this.updateEventSummaryProgress();
        this.updateTodayCirclesTable();
        
        // Ensure global reference is maintained
        if (!window.dashboard) {
            console.log('[Dashboard] Re-establishing global reference in applyFilters');
            window.dashboard = this;
        }
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
        
        // Ensure global reference is maintained
        if (!window.dashboard) {
            console.log('[Dashboard] Re-establishing global reference in renderCircleLeaders');
            window.dashboard = this;
        }
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

                    <!-- Event Summary Checkbox -->
                    ${isAdmin ? `
                        <div class="mb-4 flex items-center">
                            <input type="checkbox" 
                                   id="event-summary-${leader.id}" 
                                   ${leader.event_summary_received ? 'checked' : ''} 
                                   onchange="window.dashboard.handleEventSummaryChange('${leader.id}', this.checked)"
                                   class="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                            <label for="event-summary-${leader.id}" class="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                Event Summary Received
                            </label>
                        </div>
                    ` : ''}

                    <!-- Contact Information -->
                    ${leader.email || leader.phone ? `
                        <div class="mb-4">
                            <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Contact</p>
                            <div class="flex space-x-2">
                                ${leader.email ? `
                                    <button onclick="window.dashboard.openEmail('${leader.email}')" 
                                            class="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 rounded hover:bg-blue-200 dark:hover:bg-blue-800 flex items-center">
                                        <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                                        </svg>
                                        Email
                                    </button>
                                ` : ''}
                                ${leader.phone ? `
                                    <button onclick="window.dashboard.openPhoneModal('${leader.phone}')" 
                                            class="text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 px-2 py-1 rounded hover:bg-green-200 dark:hover:bg-green-800 flex items-center">
                                        <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                                        </svg>
                                        Phone
                                    </button>
                                ` : ''}
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

    async updateEventSummaryStatus(leaderId, isChecked) {
        console.log('[Dashboard] Updating event summary for leader:', leaderId, 'to:', isChecked);

        try {
            const { data, error } = await supabase
                .from('circle_leaders')
                .update({ 
                    event_summary_received: isChecked,
                    updated_at: new Date().toISOString()
                })
                .eq('id', leaderId)
                .select();

            if (error) {
                console.error('[Dashboard] Error updating event summary:', error);
                throw error;
            }

            console.log('[Dashboard] Event summary updated successfully:', data);

            window.utils.showNotification(
                `Event Summary ${isChecked ? 'marked as received' : 'unmarked'}`, 
                'success'
            );
        } catch (error) {
            console.error('[Dashboard] Error updating event summary:', error);
            window.utils.showNotification('Error updating event summary', 'error');
            
            // Revert the local data and checkbox state on error
            const leader = this.circleLeaders.find(l => l.id === leaderId);
            const filteredLeader = this.filteredLeaders.find(l => l.id === leaderId);
            
            if (leader) {
                leader.event_summary_received = !isChecked;
            }
            if (filteredLeader) {
                filteredLeader.event_summary_received = !isChecked;
            }
            
            // Revert the checkbox
            const checkbox = document.getElementById(`event-summary-${leaderId}`);
            if (checkbox) {
                checkbox.checked = !isChecked;
            }
            
            // Update progress bar to reflect reverted state
            this.updateEventSummaryProgress();
        }
    }

    async uncheckAllEventSummaries() {
        const filteredCount = this.filteredLeaders.length;
        const checkedCount = this.filteredLeaders.filter(l => l.event_summary_received).length;

        if (checkedCount === 0) {
            window.utils.showNotification('No Event Summaries to uncheck in current view', 'info');
            return;
        }

        const confirmMessage = `This will uncheck Event Summary for ${checkedCount} Circle Leader${checkedCount !== 1 ? 's' : ''} in the current filtered view. Continue?`;
        
        if (!confirm(confirmMessage)) {
            return;
        }

        try {
            const filteredIds = this.filteredLeaders.map(l => l.id);
            
            const { error } = await supabase
                .from('circle_leaders')
                .update({ event_summary_received: false })
                .in('id', filteredIds);

            if (error) throw error;

            // Update our local data
            this.circleLeaders.forEach(leader => {
                if (filteredIds.includes(leader.id)) {
                    leader.event_summary_received = false;
                }
            });

            // Re-render the grid to update checkboxes
            this.renderCircleLeaders();
            
            // Update the progress display
            this.updateEventSummaryProgress();

            window.utils.showNotification(
                `Event Summary unchecked for ${checkedCount} Circle Leader${checkedCount !== 1 ? 's' : ''}`, 
                'success'
            );
        } catch (error) {
            console.error('Error unchecking event summaries:', error);
            window.utils.showNotification('Error unchecking event summaries', 'error');
        }
    }

    updateEventSummaryProgress() {
        const progressBar = document.getElementById('eventSummaryProgressBar');
        const progressText = document.getElementById('eventSummaryProgressText');
        
        if (!progressBar || !progressText) {
            console.warn('[Dashboard] Progress bar elements not found');
            return;
        }

        const total = this.filteredLeaders.length;
        const completed = this.filteredLeaders.filter(l => l.event_summary_received).length;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

        console.log('[Dashboard] Progress update:', { total, completed, percentage });

        progressBar.style.width = `${percentage}%`;
        progressText.textContent = `${completed} of ${total} received`;
    }

    async updateStats() {
        console.log('[Dashboard] updateStats called');
        try {
            // Check if APP_CONFIG is available
            if (!window.APP_CONFIG || !window.APP_CONFIG.communicationTypes) {
                console.error('[Dashboard] APP_CONFIG not available, skipping stats update');
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
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Circle Leader
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Time
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Frequency
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
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
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <div class="text-sm font-medium text-gray-900 dark:text-white">
                            ${leader.name || 'Unnamed Leader'}
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900 dark:text-white">${meetingTime}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                        ${leader.frequency || 'Not set'}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex space-x-2">
                        ${leader.email ? `
                            <button onclick="window.dashboard?.openEmail('${leader.email}')" 
                                    class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                    title="Send Email">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                </svg>
                            </button>
                        ` : ''}
                        ${leader.phone ? `
                            <button onclick="window.dashboard?.openPhoneModal('${leader.phone}')" 
                                    class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                                    title="Call or Text">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                                </svg>
                            </button>
                        ` : ''}
                    </div>
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

    openEmail(email) {
        if (email) {
            window.open(`mailto:${email}`, '_blank');
        }
    }

    openPhoneModal(phoneNumber) {
        if (!phoneNumber) return;
        
        const modal = document.getElementById('phoneModal');
        const phoneNumberSpan = document.getElementById('modalPhoneNumber');
        const callButton = document.getElementById('callButton');
        const textButton = document.getElementById('textButton');
        
        if (modal && phoneNumberSpan) {
            phoneNumberSpan.textContent = phoneNumber;
            modal.classList.remove('hidden');
            
            // Set up call and text button handlers
            if (callButton) {
                callButton.onclick = () => {
                    window.open(`tel:${phoneNumber}`, '_self');
                    this.closePhoneModal();
                };
            }
            
            if (textButton) {
                textButton.onclick = () => {
                    window.open(`sms:${phoneNumber}`, '_self');
                    this.closePhoneModal();
                };
            }
        }
    }

    closePhoneModal() {
        const modal = document.getElementById('phoneModal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    cleanup() {
        // Clean up any timers and global reference
        window.dashboard = null;
    }
}
// Cache bust: Mon Jul 28 00:45:35 CDT 2025
