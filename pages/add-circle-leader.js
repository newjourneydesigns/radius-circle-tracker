// Add Circle Leader Page Module - Separate from edit functionality
export default class AddCircleLeaderPage {
    constructor() {
        this.acpdList = [];
        this.campusList = [];
        this.isSubmitting = false;
    }

    async render() {
        console.log('[AddCircleLeader] Rendering page');
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
                                Add New Circle Leader
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
                        <form id="addCircleLeaderForm" class="space-y-6">
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
                                    <input type="email" id="email" name="email" required
                                           class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500">
                                </div>

                                <!-- Phone Number -->
                                <div>
                                    <label for="phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Phone Number
                                    </label>
                                    <input type="tel" id="phone" name="phone"
                                           class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500">
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
                                <div class="flex justify-end space-x-3">
                                    <button type="button" onclick="window.router.navigate('/dashboard')"
                                            class="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500">
                                        Cancel
                                    </button>
                                    <button type="submit" id="submitButton"
                                            class="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed">
                                        Save Circle Leader
                                    </button>
                                </div>
                            </div>
                        </form>
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
        console.log('[AddCircleLeader] Initializing page');
        console.log('[AddCircleLeader] THIS IS THE NEW ADD CIRCLE LEADER PAGE!');
        
        // Make this instance available globally for onclick handlers
        window.addCircleLeaderPage = this;
        
        this.setupEventListeners();
        console.log('[AddCircleLeader] Page initialized');
    }

    setupEventListeners() {
        console.log('[AddCircleLeader] Setting up event listeners');
        const form = document.getElementById('addCircleLeaderForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
            console.log('[AddCircleLeader] Form submit listener added');
        } else {
            console.error('[AddCircleLeader] Form not found');
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        console.log('[AddCircleLeader] Form submitted');

        // Prevent multiple submissions
        if (this.isSubmitting) {
            console.log('[AddCircleLeader] Already submitting, ignoring');
            return;
        }

        this.isSubmitting = true;
        const submitButton = document.getElementById('submitButton');
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Saving...';

        try {
            // Collect form data
            const formData = new FormData(e.target);
            const data = {};
            
            console.log('[AddCircleLeader] Collecting form data...');
            for (let [key, value] of formData.entries()) {
                console.log(`[AddCircleLeader] ${key}: "${value}"`);
                data[key] = value ? value.trim() : '';
            }

            // Validate required fields
            const requiredFields = ['name', 'email', 'campus', 'acpd', 'status'];
            const missingFields = requiredFields.filter(field => !data[field]);
            
            if (missingFields.length > 0) {
                throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`);
            }

            // Prepare data for database
            const dbData = {
                name: data.name,
                email: data.email,
                phone: data.phone || null,
                campus: data.campus,
                acpd: data.acpd,
                circle_type: data.circle_type || null,
                status: data.status,
                day: data.meeting_day || null,
                time: data.meeting_time ? this.convertTo12HourFormat(data.meeting_time) : null,
                frequency: data.frequency || null,
                ccb_profile_link: data.ccb_profile_link || null
            };

            console.log('[AddCircleLeader] Data to insert:', dbData);

            // Check Supabase client
            if (!window.supabase) {
                throw new Error('Database connection not available');
            }

            // Insert into database
            const { data: insertedData, error } = await window.supabase
                .from('circle_leaders')
                .insert([dbData])
                .select()
                .single();

            if (error) {
                console.error('[AddCircleLeader] Database error:', error);
                throw new Error(`Database error: ${error.message}`);
            }

            console.log('[AddCircleLeader] Successfully created:', insertedData);

            // Generate default CCB link if not provided
            if (!dbData.ccb_profile_link && insertedData.id) {
                const defaultCcbLink = `https://valleycreekchurch.ccbchurch.com/goto/groups/${insertedData.id}/events`;
                
                const { error: updateError } = await window.supabase
                    .from('circle_leaders')
                    .update({ ccb_profile_link: defaultCcbLink })
                    .eq('id', insertedData.id);
                    
                if (!updateError) {
                    console.log('[AddCircleLeader] Generated default CCB link');
                }
            }

            // Show success message
            if (window.utils && window.utils.showNotification) {
                window.utils.showNotification('Circle leader created successfully!', 'success');
            } else {
                alert('Circle leader created successfully!');
            }

            // Navigate back to dashboard
            setTimeout(() => {
                window.router.navigate('/dashboard');
            }, 1000);

        } catch (error) {
            console.error('[AddCircleLeader] Error:', error);
            
            if (window.utils && window.utils.showNotification) {
                window.utils.showNotification(error.message, 'error');
            } else {
                alert(`Error: ${error.message}`);
            }
        } finally {
            // Reset form state
            this.isSubmitting = false;
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
    }

    async loadOrganizationData() {
        console.log('[AddCircleLeader] Loading organization data');
        
        try {
            if (!window.supabase) {
                throw new Error('Supabase not available');
            }

            // Load ACPD list
            const { data: acpdData, error: acpdError } = await window.supabase
                .from('acpd_list')
                .select('*')
                .order('name');

            if (!acpdError && acpdData) {
                this.acpdList = acpdData;
                console.log('[AddCircleLeader] Loaded ACPD list:', this.acpdList.length, 'items');
            } else {
                console.warn('[AddCircleLeader] ACPD list error:', acpdError);
                this.acpdList = this.getDefaultAcpdList();
            }

            // Load campus list
            const { data: campusData, error: campusError } = await window.supabase
                .from('campus_list')
                .select('*')
                .order('name');

            if (!campusError && campusData) {
                this.campusList = campusData;
                console.log('[AddCircleLeader] Loaded campus list:', this.campusList.length, 'items');
            } else {
                console.warn('[AddCircleLeader] Campus list error:', campusError);
                this.campusList = this.getDefaultCampusList();
            }

        } catch (error) {
            console.warn('[AddCircleLeader] Error loading organization data:', error);
            this.acpdList = this.getDefaultAcpdList();
            this.campusList = this.getDefaultCampusList();
        }
    }

    getDefaultAcpdList() {
        return [
            { name: 'Men\'s Ministry' },
            { name: 'Women\'s Ministry' },
            { name: 'Young Adults' },
            { name: 'Students' }
        ];
    }

    getDefaultCampusList() {
        return [
            { name: 'Main Campus' },
            { name: 'North Campus' },
            { name: 'South Campus' },
            { name: 'Online Campus' }
        ];
    }

    // Helper function to convert 24-hour time to 12-hour AM/PM format
    convertTo12HourFormat(time24) {
        if (!time24) return null;
        
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

    cleanup() {
        console.log('[AddCircleLeader] Cleaning up');
        window.addCircleLeaderPage = null;
    }
}
