// Organization Settings Page Module (Admin Only)
class OrgSettingsPage {
    constructor() {
        this.acpdList = [];
        this.campusList = [];
    }

    async render() {
        await this.loadData();

        return `
            <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
                ${this.renderNavigation()}
                <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    ${this.renderHeader()}
                    ${this.renderContent()}
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
                            <span class="text-sm text-gray-500 dark:text-gray-400">${window.authManager.currentUser?.email}</span>
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
        return `
            <div class="mb-8">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Organization Settings</h2>
                <p class="text-gray-600 dark:text-gray-400">Manage ACPDs and Campus locations for your organization.</p>
            </div>
        `;
    }

    renderContent() {
        return `
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- ACPD Management -->
                <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
                    <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <div class="flex justify-between items-center">
                            <h3 class="text-lg font-medium text-gray-900 dark:text-white">ACPD Management</h3>
                            <button onclick="window.orgSettings.showAddAcpdForm()" class="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm">
                                Add ACPD
                            </button>
                        </div>
                    </div>
                    <div class="p-6">
                        <div id="acpd-form" class="hidden mb-6">
                            <form onsubmit="window.orgSettings.saveAcpd(event)">
                                <div class="grid grid-cols-1 gap-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ACPD Name</label>
                                        <input type="text" id="acpd-name" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                                        <textarea id="acpd-description" rows="3" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"></textarea>
                                    </div>
                                    <div class="flex space-x-3">
                                        <button type="submit" class="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500">
                                            Save ACPD
                                        </button>
                                        <button type="button" onclick="window.orgSettings.hideAddAcpdForm()" class="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500">
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                                <input type="hidden" id="acpd-id">
                            </form>
                        </div>
                        <div id="acpd-list">
                            ${this.renderAcpdList()}
                        </div>
                    </div>
                </div>

                <!-- Campus Management -->
                <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
                    <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <div class="flex justify-between items-center">
                            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Campus Management</h3>
                            <button onclick="window.orgSettings.showAddCampusForm()" class="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm">
                                Add Campus
                            </button>
                        </div>
                    </div>
                    <div class="p-6">
                        <div id="campus-form" class="hidden mb-6">
                            <form onsubmit="window.orgSettings.saveCampus(event)">
                                <div class="grid grid-cols-1 gap-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Campus Name</label>
                                        <input type="text" id="campus-name" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Address</label>
                                        <textarea id="campus-address" rows="3" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"></textarea>
                                    </div>
                                    <div class="flex space-x-3">
                                        <button type="submit" class="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500">
                                            Save Campus
                                        </button>
                                        <button type="button" onclick="window.orgSettings.hideAddCampusForm()" class="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500">
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                                <input type="hidden" id="campus-id">
                            </form>
                        </div>
                        <div id="campus-list">
                            ${this.renderCampusList()}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderAcpdList() {
        if (this.acpdList.length === 0) {
            return '<p class="text-gray-500 dark:text-gray-400">No ACPDs configured yet.</p>';
        }

        return this.acpdList.map(acpd => `
            <div class="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                <div>
                    <h4 class="font-medium text-gray-900 dark:text-white">${acpd.name}</h4>
                    ${acpd.description ? `<p class="text-sm text-gray-500 dark:text-gray-400">${acpd.description}</p>` : ''}
                </div>
                <div class="flex space-x-2">
                    <button onclick="window.orgSettings.editAcpd('${acpd.id}')" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
                        </svg>
                    </button>
                    <button onclick="window.orgSettings.deleteAcpd('${acpd.id}')" class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                        </svg>
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderCampusList() {
        if (this.campusList.length === 0) {
            return '<p class="text-gray-500 dark:text-gray-400">No campuses configured yet.</p>';
        }

        return this.campusList.map(campus => `
            <div class="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                <div>
                    <h4 class="font-medium text-gray-900 dark:text-white">${campus.name}</h4>
                    ${campus.address ? `<p class="text-sm text-gray-500 dark:text-gray-400">${campus.address}</p>` : ''}
                </div>
                <div class="flex space-x-2">
                    <button onclick="window.orgSettings.editCampus('${campus.id}')" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
                        </svg>
                    </button>
                    <button onclick="window.orgSettings.deleteCampus('${campus.id}')" class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                        </svg>
                    </button>
                </div>
            </div>
        `).join('');
    }

    async loadData() {
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
            window.utils.showNotification('Error loading organization data', 'error');
        }
    }

    init() {
        this.setupEventListeners();
        // Bind methods to this context
        this.showAddAcpdForm = this.showAddAcpdForm.bind(this);
        this.hideAddAcpdForm = this.hideAddAcpdForm.bind(this);
        this.saveAcpd = this.saveAcpd.bind(this);
        this.editAcpd = this.editAcpd.bind(this);
        this.deleteAcpd = this.deleteAcpd.bind(this);
        this.showAddCampusForm = this.showAddCampusForm.bind(this);
        this.hideAddCampusForm = this.hideAddCampusForm.bind(this);
        this.saveCampus = this.saveCampus.bind(this);
        this.editCampus = this.editCampus.bind(this);
        this.deleteCampus = this.deleteCampus.bind(this);

        // Make methods available globally for onclick handlers
        window.orgSettings = this;
    }

    setupEventListeners() {
        // Menu dropdown toggle
        document.addEventListener('click', (e) => {
            const menuButton = document.getElementById('menuButton');
            const menuDropdown = document.getElementById('menuDropdown');
            
            if (menuButton && menuDropdown) {
                if (menuButton.contains(e.target)) {
                    menuDropdown.classList.toggle('hidden');
                } else if (!menuDropdown.contains(e.target)) {
                    menuDropdown.classList.add('hidden');
                }
            }
        });
    }

    showAddAcpdForm() {
        document.getElementById('acpd-form').classList.remove('hidden');
        document.getElementById('acpd-name').value = '';
        document.getElementById('acpd-description').value = '';
        document.getElementById('acpd-id').value = '';
    }

    hideAddAcpdForm() {
        document.getElementById('acpd-form').classList.add('hidden');
    }

    async saveAcpd(event) {
        event.preventDefault();
        
        const name = document.getElementById('acpd-name').value;
        const description = document.getElementById('acpd-description').value;
        const id = document.getElementById('acpd-id').value;

        try {
            if (id) {
                // Update existing ACPD
                const { error } = await window.supabase
                    .from('acpd_list')
                    .update({ name, description })
                    .eq('id', id);

                if (error) throw error;
                window.utils.showNotification('ACPD updated successfully', 'success');
            } else {
                // Create new ACPD
                const { error } = await window.supabase
                    .from('acpd_list')
                    .insert({ name, description });

                if (error) throw error;
                window.utils.showNotification('ACPD created successfully', 'success');
            }

            this.hideAddAcpdForm();
            await this.loadData();
            document.getElementById('acpd-list').innerHTML = this.renderAcpdList();

        } catch (error) {
            console.error('Error saving ACPD:', error);
            window.utils.showNotification('Error saving ACPD', 'error');
        }
    }

    async editAcpd(id) {
        const acpd = this.acpdList.find(a => a.id === id);
        if (acpd) {
            // Show the form first
            this.showAddAcpdForm();
            
            // Wait a moment for the form to be visible, then populate the values
            setTimeout(() => {
                document.getElementById('acpd-name').value = acpd.name;
                document.getElementById('acpd-description').value = acpd.description || '';
                document.getElementById('acpd-id').value = acpd.id;
            }, 10);
        }
    }

    async deleteAcpd(id) {
        if (confirm('Are you sure you want to delete this ACPD? This action cannot be undone.')) {
            try {
                const { error } = await window.supabase
                    .from('acpd_list')
                    .delete()
                    .eq('id', id);

                if (error) throw error;
                
                window.utils.showNotification('ACPD deleted successfully', 'success');
                await this.loadData();
                document.getElementById('acpd-list').innerHTML = this.renderAcpdList();

            } catch (error) {
                console.error('Error deleting ACPD:', error);
                window.utils.showNotification('Error deleting ACPD', 'error');
            }
        }
    }

    showAddCampusForm() {
        document.getElementById('campus-form').classList.remove('hidden');
        document.getElementById('campus-name').value = '';
        document.getElementById('campus-address').value = '';
        document.getElementById('campus-id').value = '';
    }

    hideAddCampusForm() {
        document.getElementById('campus-form').classList.add('hidden');
    }

    async saveCampus(event) {
        event.preventDefault();
        
        const name = document.getElementById('campus-name').value;
        const address = document.getElementById('campus-address').value;
        const id = document.getElementById('campus-id').value;

        try {
            if (id) {
                // Update existing campus
                const { error } = await window.supabase
                    .from('campus_list')
                    .update({ name, address })
                    .eq('id', id);

                if (error) throw error;
                window.utils.showNotification('Campus updated successfully', 'success');
            } else {
                // Create new campus
                const { error } = await window.supabase
                    .from('campus_list')
                    .insert({ name, address });

                if (error) throw error;
                window.utils.showNotification('Campus created successfully', 'success');
            }

            this.hideAddCampusForm();
            await this.loadData();
            document.getElementById('campus-list').innerHTML = this.renderCampusList();

        } catch (error) {
            console.error('Error saving campus:', error);
            window.utils.showNotification('Error saving campus', 'error');
        }
    }

    async editCampus(id) {
        const campus = this.campusList.find(c => c.id === id);
        if (campus) {
            // Show the form first
            this.showAddCampusForm();
            
            // Wait a moment for the form to be visible, then populate the values
            setTimeout(() => {
                document.getElementById('campus-name').value = campus.name;
                document.getElementById('campus-address').value = campus.address || '';
                document.getElementById('campus-id').value = campus.id;
            }, 10);
        }
    }

    async deleteCampus(id) {
        if (confirm('Are you sure you want to delete this campus? This action cannot be undone.')) {
            try {
                const { error } = await window.supabase
                    .from('campus_list')
                    .delete()
                    .eq('id', id);

                if (error) throw error;
                
                window.utils.showNotification('Campus deleted successfully', 'success');
                await this.loadData();
                document.getElementById('campus-list').innerHTML = this.renderCampusList();

            } catch (error) {
                console.error('Error deleting campus:', error);
                window.utils.showNotification('Error deleting campus', 'error');
            }
        }
    }

    cleanup() {
        // Clean up event listeners and global references
        window.orgSettings = null;
    }
}

// Export for use in router
window.OrgSettingsPage = OrgSettingsPage;
export default OrgSettingsPage;
