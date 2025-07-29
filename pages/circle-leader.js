// Circle Leader Management Page Module
export default class CircleLeaderPage {
    constructor() {
        this.isEditing = false;
        this.leaderId = null;
        this.leader = null;
        this.acpdList = [];
        this.campusList = [];
        this.isSubmitting = false;
    }

    async render() {
        console.log('render() called - isEditing:', this.isEditing);
        await this.loadOrganizationData();
        
        return `
            <!-- Navigation -->
            ${this.renderNavigation()}

            <!-- Main Content -->
            <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
                    <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <div class="flex justify-between items-center">
                            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
                                ${this.isEditing ? 'Edit Circle Leader' : 'Add Circle Leader'}
                            </h2>
                            <button onclick="window.router.navigate('/dashboard')" 
                                    class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                    
                    <div class="px-6 py-6">
                        <form id="circleLeaderForm" class="space-y-6">
                            <!-- Profile Information -->
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <!-- Full Name -->
                                <div>
                                    <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Full Name *
                                    </label>
                                    <input type="text" id="name" name="name" required
                                           class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500">
                                </div>

                                <!-- Email Address -->
                                <div>
                                    <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Email Address *
                                    </label>
                                    <div class="flex">
                                        <input type="email" id="email" name="email" required
                                               class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500">
                                        <button type="button" id="emailButton" onclick="window.circleLeaderPage?.openEmail(document.getElementById('email').value)"
                                                class="mt-1 px-3 py-2 bg-blue-600 text-white border border-l-0 border-blue-600 rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                                title="Send Email">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <!-- Phone Number -->
                                <div>
                                    <label for="phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Phone Number
                                    </label>
                                    <div class="flex">
                                        <input type="tel" id="phone" name="phone"
                                               class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500">
                                        <button type="button" id="phoneButton" onclick="window.circleLeaderPage?.openPhoneModal(document.getElementById('phone').value)"
                                                class="mt-1 px-3 py-2 bg-green-600 text-white border border-l-0 border-green-600 rounded-r-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                                                title="Call or Text">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <!-- Campus -->
                                <div>
                                    <label for="campus" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Campus *
                                    </label>
                                    <select id="campus" name="campus" required
                                            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500">
                                        <option value="">Select a campus</option>
                                        ${this.campusList.map(campus => `<option value="${campus.name}">${campus.name}</option>`).join('')}
                                    </select>
                                </div>

                                <!-- ACPD -->
                                <div>
                                    <label for="acpd" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        ACPD *
                                    </label>
                                    <select id="acpd" name="acpd" required
                                            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500">
                                        <option value="">Select ACPD</option>
                                        ${this.acpdList.map(acpd => `<option value="${acpd.name}">${acpd.name}</option>`).join('')}
                                    </select>
                                </div>

                                <!-- Circle Type -->
                                <div>
                                    <label for="circle_type" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Circle Type
                                    </label>
                                    <select id="circle_type" name="circle_type"
                                            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500">
                                        <option value="">Select a circle type</option>
                                        <option value="Men">Men</option>
                                        <option value="Women">Women</option>
                                        <option value="Couples">Couples</option>
                                        <option value="YA Men">YA Men</option>
                                        <option value="YA Women">YA Women</option>
                                        <option value="Young Adult">Young Adult</option>
                                    </select>
                                </div>

                                <!-- Status -->
                                <div>
                                    <label for="status" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Status *
                                    </label>
                                    <select id="status" name="status" required
                                            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500">
                                        <option value="">Select status</option>
                                        <option value="invited">Invited</option>
                                        <option value="pipeline">Pipeline</option>
                                        <option value="active">Active</option>
                                        <option value="paused">Paused</option>
                                        <option value="off-boarding">Off-boarding</option>
                                    </select>
                                </div>

                                <!-- Meeting Day -->
                                <div>
                                    <label for="meeting_day" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Meeting Day
                                    </label>
                                    <select id="meeting_day" name="meeting_day"
                                            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500">
                                        <option value="">Select a day</option>
                                        <option value="Sunday">Sunday</option>
                                        <option value="Monday">Monday</option>
                                        <option value="Tuesday">Tuesday</option>
                                        <option value="Wednesday">Wednesday</option>
                                        <option value="Thursday">Thursday</option>
                                        <option value="Friday">Friday</option>
                                        <option value="Saturday">Saturday</option>
                                    </select>
                                </div>

                                <!-- Meeting Time -->
                                <div>
                                    <label for="meeting_time" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Meeting Time
                                    </label>
                                    <input type="time" id="meeting_time" name="meeting_time"
                                           class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500">
                                </div>

                                <!-- Frequency -->
                                <div>
                                    <label for="frequency" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Frequency
                                    </label>
                                    <select id="frequency" name="frequency"
                                            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500">
                                        <option value="">Select frequency</option>
                                        <option value="Weekly">Weekly</option>
                                        <option value="Bi-Weekly">Bi-Weekly</option>
                                        <option value="2nd & 4th">2nd & 4th</option>
                                        <option value="1st, 3rd, & 5th">1st, 3rd, & 5th</option>
                                    </select>
                                </div>

                                <!-- CCB Profile Link -->
                                <div>
                                    <label for="ccb_profile_link" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        CCB Profile Link
                                    </label>
                                    <input type="url" id="ccb_profile_link" name="ccb_profile_link"
                                           class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                           placeholder="https://valleycreekchurch.ccbchurch.com/goto/groups/...">
                                </div>
                            </div>

                            <!-- Action Buttons -->
                            <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
                                <div class="flex justify-between items-center">
                                    <!-- Delete Button (only show when editing) -->
                                    <div class="delete-button-container">
                                        <!-- Delete button will be added dynamically in init() -->
                                    </div>
                                    
                                    <!-- Cancel and Save/Update Buttons -->
                                    <div class="flex space-x-3">
                                        <button type="button" onclick="window.router.navigate('/dashboard')"
                                                class="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500">
                                            Cancel
                                        </button>
                                        <button type="submit"
                                                class="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500">
                                            ${this.isEditing ? 'Update' : 'Save'} Circle Leader
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
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
                                <button onclick="window.circleLeaderPage?.closePhoneModal()" 
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
        return `
            <nav class="bg-white dark:bg-gray-800 shadow-sm">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex justify-between items-center h-16">
                        <div class="flex items-center space-x-4">
                            <button onclick="window.router.navigate('/dashboard')" 
                                    class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                                </svg>
                            </button>
                            <div class="flex items-center">
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
                        </div>
                    </div>
                </div>
            </nav>
        `;
    }

    async init() {
        console.log('CircleLeaderPage init called');
        
        // Make this instance available globally for onclick handlers
        window.circleLeaderPage = this;
        
        // Check if we're editing an existing leader
        const segments = window.router.getPathSegments();
        console.log('URL segments:', segments);
        console.log('Current path:', window.location.pathname);
        
        if (segments.length > 1 && segments[0] === 'circle-leader') {
            if (segments[1] === 'new') {
                // This is a new leader page: /circle-leader/new
                console.log('Setting up new leader mode');
                this.isEditing = false;
                this.leaderId = null;
                this.leader = null;
                console.log('isEditing set to:', this.isEditing);
            } else if (segments.length > 2 && segments[2] === 'edit') {
                // This is an edit page: /circle-leader/123/edit
                console.log('Setting up edit mode for leader:', segments[1]);
                this.isEditing = true;
                this.leaderId = segments[1];
                console.log('isEditing set to:', this.isEditing);
                await this.loadLeaderData();
            } else {
                // This shouldn't happen as profile pages use a different component
                // But let's handle it gracefully
                console.log('Invalid circle leader route, redirecting to dashboard');
                window.router.navigate('/dashboard');
                return;
            }
        } else {
            // Default to new leader if no clear path segments
            console.log('No clear path segments, defaulting to new leader mode');
            this.isEditing = false;
            this.leaderId = null;
            this.leader = null;
        }

        console.log('Before populateForm - isEditing:', this.isEditing);
        this.setupEventListeners();
        this.populateForm();
        this.updateDeleteButtonVisibility(); // Update delete button after init
        console.log('CircleLeaderPage init completed - isEditing:', this.isEditing);
    }

    updateDeleteButtonVisibility() {
        const deleteButtonContainer = document.querySelector('.delete-button-container');
        if (deleteButtonContainer) {
            if (this.isEditing) {
                deleteButtonContainer.innerHTML = `
                    <button type="button" onclick="window.circleLeaderPage.deleteCircleLeader()"
                            class="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500">
                        <svg class="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                        Delete Circle Leader
                    </button>
                `;
                console.log('Delete button shown');
            } else {
                deleteButtonContainer.innerHTML = `<!-- Delete button hidden: isEditing = ${this.isEditing} -->`;
                console.log('Delete button hidden');
            }
        } else {
            console.log('Delete button container not found');
        }
    }

    async loadLeaderData() {
        if (!this.leaderId) {
            console.log('No leaderId, skipping data load');
            return;
        }

        console.log('Loading leader data for ID:', this.leaderId);
        try {
            const { data: leader, error } = await window.supabase
                .from('circle_leaders')
                .select('*')
                .eq('id', this.leaderId)
                .single();

            if (error) {
                console.error('Error loading leader data:', error);
                throw error;
            }
            
            console.log('Loaded leader data:', leader);
            this.leader = leader;

        } catch (error) {
            console.error('Error loading circle leader:', error);
            window.utils.showNotification('Error loading circle leader data', 'error');
            window.router.navigate('/dashboard');
        }
    }

    populateForm() {
        console.log('populateForm called, leader data:', this.leader);
        if (!this.leader) {
            console.log('No leader data to populate');
            return;
        }

        // Map database fields to form fields (including email and phone with database columns)
        const fieldMappings = {
            'name': 'name',                    // Form ID: name, DB field: name
            'email': 'email',                  // Form ID: email, DB field: email
            'phone': 'phone',                  // Form ID: phone, DB field: phone
            'campus': 'campus',                // Form ID: campus, DB field: campus
            'acpd': 'acpd',                   // Form ID: acpd, DB field: acpd
            'circle_type': 'circle_type',     // Form ID: circle_type, DB field: circle_type
            'status': 'status',               // Form ID: status, DB field: status
            'meeting_day': 'day',             // Form ID: meeting_day, DB field: day
            'meeting_time': 'time',           // Form ID: meeting_time, DB field: time
            'frequency': 'frequency',         // Form ID: frequency, DB field: frequency
            'ccb_profile_link': 'ccb_profile_link' // Form ID: ccb_profile_link, DB field: ccb_profile_link
        };

        Object.entries(fieldMappings).forEach(([formField, dbField]) => {
            const element = document.getElementById(formField);
            if (element && this.leader[dbField] !== undefined && this.leader[dbField] !== null) {
                let value = this.leader[dbField] || '';
                
                // Special handling for time field - convert AM/PM to 24-hour for time input
                if (formField === 'meeting_time' && value) {
                    value = this.convertTo24HourFormat(value);
                }
                
                console.log(`Setting ${formField} (${dbField}) to:`, value);
                element.value = value;
            } else if (!element) {
                console.log(`Element not found for field: ${formField}`);
            } else {
                console.log(`No data for field: ${dbField}`);
            }
        });
        console.log('Form population completed');
    }

    setupEventListeners() {
        const form = document.getElementById('circleLeaderForm');
        form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    async handleSubmit(e) {
        e.preventDefault();
        console.log('[CircleLeader] handleSubmit called');

        // Prevent multiple submissions
        if (this.isSubmitting) {
            console.log('[CircleLeader] Already submitting, ignoring duplicate submission');
            return;
        }
        this.isSubmitting = true;

        const formData = new FormData(e.target);
        const allData = {};
        
        for (let [key, value] of formData) {
            allData[key] = value || null;
        }

        // Only include fields that exist in the database schema and are in the form
        const validFields = {
            'name': allData.name,
            'email': allData.email,            // Email field
            'phone': allData.phone,            // Phone field
            'campus': allData.campus,          // Campus dropdown
            'acpd': allData.acpd,             // ACPD dropdown
            'circle_type': allData.circle_type, // Circle Type dropdown
            'day': allData.meeting_day,        // Form field meeting_day maps to database field day
            'time': this.convertTo12HourFormat(allData.meeting_time), // Convert to AM/PM format
            'frequency': allData.frequency,    // Frequency dropdown
            'ccb_profile_link': allData.ccb_profile_link, // CCB Profile Link
            'status': allData.status || 'invited' // Default status to invited
        };

        // Filter out null/undefined values but keep empty strings for optional fields
        const data = {};
        for (let [key, value] of Object.entries(validFields)) {
            if (value !== null && value !== undefined) {
                // For required fields, validate they're not empty
                if (['name', 'email', 'campus', 'acpd', 'status'].includes(key) && value === '') {
                    console.warn(`[CircleLeader] Required field '${key}' is empty`);
                    // Don't skip - let validation handle this
                    data[key] = value;
                } else {
                    // For optional fields, save even if empty string
                    data[key] = value;
                }
            }
        }

        console.log('[CircleLeader] All form data:', allData);
        console.log('[CircleLeader] Filtered valid data:', data);
        console.log('[CircleLeader] Is editing:', this.isEditing);
        console.log('[CircleLeader] Leader ID:', this.leaderId);

        // Validate required fields before submission
        const requiredFields = ['name', 'email', 'campus', 'acpd'];
        const missingFields = [];
        for (const field of requiredFields) {
            if (!data[field] || data[field].trim() === '') {
                missingFields.push(field);
            }
        }

        if (missingFields.length > 0) {
            console.error('[CircleLeader] Missing required fields:', missingFields);
            window.utils.showNotification(`Please fill in required fields: ${missingFields.join(', ')}`, 'error');
            this.isSubmitting = false;
            return;
        }

        try {
            let result;
            
            if (this.isEditing) {
                // Update existing leader
                console.log('[CircleLeader] Updating leader with ID:', this.leaderId);
                console.log('[CircleLeader] Update data:', data);
                
                const { data: updateData, error: updateError } = await supabase
                    .from('circle_leaders')
                    .update(data)
                    .eq('id', this.leaderId)
                    .select()
                    .single();
                
                console.log('[CircleLeader] Raw update response:', { updateData, updateError });
                result = { data: updateData, error: updateError };
                console.log('[CircleLeader] Update result:', result);
            } else {
                // Create new leader
                console.log('[CircleLeader] Creating new leader');
                const { data: insertData, error: insertError } = await supabase
                    .from('circle_leaders')
                    .insert([data])
                    .select()
                    .single();
                
                result = { data: insertData, error: insertError };
                console.log('[CircleLeader] Insert result:', result);
                
                // If CCB link is empty and we have a new leader ID, generate the default CCB link
                if (result.data && !data.ccb_profile_link) {
                    const defaultCcbLink = `https://valleycreekchurch.ccbchurch.com/goto/groups/${result.data.id}/events`;
                    
                    const { error: updateError } = await supabase
                        .from('circle_leaders')
                        .update({ ccb_profile_link: defaultCcbLink })
                        .eq('id', result.data.id);
                        
                    if (updateError) {
                        console.warn('[CircleLeader] Could not update CCB link:', updateError);
                    } else {
                        console.log('[CircleLeader] Generated default CCB link:', defaultCcbLink);
                    }
                }
            }

            if (result.error) {
                console.error('[CircleLeader] Database error:', result.error);
                throw result.error;
            }

            window.utils.showNotification(
                `Circle leader ${this.isEditing ? 'updated' : 'created'} successfully!`,
                'success'
            );

            // Reset submission flag
            this.isSubmitting = false;

            // Navigate back to dashboard
            console.log('[CircleLeader] Navigating to dashboard');
            window.router.navigate('/dashboard');

        } catch (error) {
            console.error('[CircleLeader] Error saving circle leader:', error);
            console.error('[CircleLeader] Error details:', {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code
            });
            
            // Reset submission flag on error
            this.isSubmitting = false;
            
            // Show more detailed error message
            let errorMessage = `Error ${this.isEditing ? 'updating' : 'creating'} circle leader: `;
            
            if (error.message) {
                errorMessage += error.message;
            } else {
                errorMessage += 'Unknown error occurred';
            }
            
            // Add additional details if available
            if (error.details) {
                errorMessage += ` (${error.details})`;
            }
            
            if (error.hint) {
                errorMessage += ` Hint: ${error.hint}`;
            }
            
            window.utils.showNotification(errorMessage, 'error');
        }
    }

    async deleteCircleLeader() {
        if (!this.leaderId) {
            console.error('[CircleLeader] No leader ID for deletion');
            return;
        }

        // Show confirmation dialog
        const leaderName = this.leader?.name || 'this circle leader';
        const confirmMessage = `Are you sure you want to delete ${leaderName}?\n\nThis action will permanently remove:\n• The circle leader profile\n• All communications history\n• All notes\n\nThis cannot be undone.`;
        
        if (!confirm(confirmMessage)) {
            return;
        }

        console.log('[CircleLeader] Deleting circle leader with ID:', this.leaderId);

        try {
            // Delete the circle leader (CASCADE will handle related communications and notes)
            const { error } = await supabase
                .from('circle_leaders')
                .delete()
                .eq('id', this.leaderId);

            if (error) {
                console.error('[CircleLeader] Delete error:', error);
                throw error;
            }

            console.log('[CircleLeader] Circle leader deleted successfully');
            window.utils.showNotification(
                `Circle leader ${leaderName} deleted successfully`,
                'success'
            );

            // Navigate back to dashboard
            window.router.navigate('/dashboard');

        } catch (error) {
            console.error('[CircleLeader] Error deleting circle leader:', error);
            window.utils.showNotification(
                `Error deleting circle leader: ${error.message}`,
                'error'
            );
        }
    }

    async loadOrganizationData() {
        try {
            // Load ACPD list
            const { data: acpdData, error: acpdError } = await window.supabase
                .from('acpd_list')
                .select('*')
                .order('name');

            if (acpdError) throw acpdError;
            this.acpdList = acpdData || [];

            // Load campus list
            const { data: campusData, error: campusError } = await window.supabase
                .from('campus_list')
                .select('*')
                .order('name');

            if (campusError) throw campusError;
            this.campusList = campusData || [];

        } catch (error) {
            console.error('Error loading organization data:', error);
            // Fallback to default values if database tables don't exist yet
            this.acpdList = [
                { name: "Men's Ministry" },
                { name: "Women's Ministry" },
                { name: "Young Adults" },
                { name: "Students" }
            ];
            this.campusList = [
                { name: "Main Campus" },
                { name: "North Campus" },
                { name: "South Campus" },
                { name: "Online Campus" }
            ];
        }
    }

    async loadOrganizationData() {
        try {
            // Load ACPD list
            const { data: acpdData, error: acpdError } = await window.supabase
                .from('acpd_list')
                .select('*')
                .order('name');

            if (acpdError) {
                console.warn('ACPD list not available:', acpdError);
                this.acpdList = [];
            } else {
                this.acpdList = acpdData || [];
            }

            // Load campus list
            const { data: campusData, error: campusError } = await window.supabase
                .from('campus_list')
                .select('*')
                .order('name');

            if (campusError) {
                console.warn('Campus list not available:', campusError);
                this.campusList = [];
            } else {
                this.campusList = campusData || [];
            }

        } catch (error) {
            console.warn('Error loading organization data:', error);
            // Use fallback values if organization tables don't exist
            this.acpdList = [
                { name: 'Men\'s Ministry' },
                { name: 'Women\'s Ministry' },
                { name: 'Young Adults' },
                { name: 'Students' }
            ];
            this.campusList = [
                { name: 'Main Campus' },
                { name: 'North Campus' },
                { name: 'South Campus' },
                { name: 'Online Campus' }
            ];
        }
    }

    // Helper function to convert 24-hour time to 12-hour AM/PM format
    convertTo12HourFormat(time24) {
        if (!time24) return time24;
        
        const [hours, minutes] = time24.split(':');
        const hour = parseInt(hours, 10);
        const minute = minutes;
        
        if (hour === 0) {
            return `12:${minute} AM`;
        } else if (hour < 12) {
            return `${hour}:${minute} AM`;
        } else if (hour === 12) {
            return `12:${minute} PM`;
        } else {
            return `${hour - 12}:${minute} PM`;
        }
    }

    // Helper function to convert 12-hour AM/PM time to 24-hour format (for editing)
    convertTo24HourFormat(time12) {
        if (!time12) return '';
        
        const timeRegex = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i;
        const match = time12.match(timeRegex);
        
        if (!match) return time12; // Return as-is if not in expected format
        
        let [, hours, minutes, period] = match;
        hours = parseInt(hours, 10);
        
        if (period.toUpperCase() === 'AM') {
            if (hours === 12) hours = 0;
        } else {
            if (hours !== 12) hours += 12;
        }
        
        return `${hours.toString().padStart(2, '0')}:${minutes}`;
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
        // Clean up any event listeners or timers and global reference
        window.circleLeaderPage = null;
    }
}
