// User Profile Page Module
export default class UserProfilePage {
    constructor() {
        this.user = null;
        this.isEditing = false;
    }

    render() {
        return `
            <!-- Navigation -->
            ${this.renderNavigation()}

            <!-- Main Content -->
            <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
                    <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <div class="flex justify-between items-center">
                            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">My Profile</h2>
                            <button id="editToggle" 
                                    class="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500">
                                Edit Profile
                            </button>
                        </div>
                    </div>
                    
                    <div class="px-6 py-6">
                        <form id="profileForm">
                            <div class="space-y-6">
                                <!-- Name -->
                                <div>
                                    <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Name
                                    </label>
                                    <input type="text" id="name" name="name" 
                                           class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
                                           disabled>
                                </div>

                                <!-- Email -->
                                <div>
                                    <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Email
                                    </label>
                                    <input type="email" id="email" name="email" 
                                           class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 cursor-not-allowed"
                                           disabled readonly>
                                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Email cannot be changed</p>
                                </div>

                                <!-- Role -->
                                <div>
                                    <label for="role" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Role
                                    </label>
                                    <input type="text" id="role" name="role" 
                                           class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 cursor-not-allowed"
                                           disabled readonly>
                                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Role is managed by administrators</p>
                                </div>

                                <!-- Campus -->
                                <div>
                                    <label for="campus" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Campus
                                    </label>
                                    <input type="text" id="campus" name="campus" 
                                           class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
                                           disabled>
                                </div>

                                <!-- ACPD -->
                                <div>
                                    <label for="acpd" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        ACPD
                                    </label>
                                    <input type="text" id="acpd" name="acpd" 
                                           class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
                                           disabled>
                                </div>

                                <!-- Action Buttons (hidden by default) -->
                                <div id="actionButtons" class="hidden pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <div class="flex justify-end space-x-3">
                                        <button type="button" id="cancelEdit" 
                                                class="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500">
                                            Cancel
                                        </button>
                                        <button type="submit" 
                                                class="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500">
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                <!-- Password Change Section -->
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow mt-6">
                    <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 class="text-lg font-medium text-gray-900 dark:text-white">Change Password</h3>
                    </div>
                    
                    <div class="px-6 py-6">
                        <form id="passwordForm">
                            <div class="space-y-4">
                                <div>
                                    <label for="currentPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Current Password
                                    </label>
                                    <input type="password" id="currentPassword" name="currentPassword" 
                                           class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500">
                                </div>

                                <div>
                                    <label for="newPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        New Password
                                    </label>
                                    <input type="password" id="newPassword" name="newPassword" 
                                           class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500">
                                </div>

                                <div>
                                    <label for="confirmPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Confirm New Password
                                    </label>
                                    <input type="password" id="confirmPassword" name="confirmPassword" 
                                           class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500">
                                </div>

                                <div class="pt-4">
                                    <button type="submit" 
                                            class="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500">
                                        Change Password
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
        await this.loadUserData();
        this.populateForm();
        this.setupEventListeners();
    }

    async loadUserData() {
        try {
            const currentUser = window.authManager.getCurrentUser();
            
            const { data: user, error } = await supabase
                .from('users')
                .select('*')
                .eq('email', currentUser.email)
                .single();

            if (error) throw error;
            this.user = user;

        } catch (error) {
            console.error('Error loading user data:', error);
            window.utils.showNotification('Error loading user profile', 'error');
        }
    }

    populateForm() {
        if (!this.user) return;

        document.getElementById('name').value = this.user.name || '';
        document.getElementById('email').value = this.user.email || '';
        document.getElementById('role').value = this.user.role || '';
        document.getElementById('campus').value = this.user.campus || '';
        document.getElementById('acpd').value = this.user.acpd || '';
    }

    setupEventListeners() {
        const editToggle = document.getElementById('editToggle');
        const profileForm = document.getElementById('profileForm');
        const passwordForm = document.getElementById('passwordForm');
        const cancelEdit = document.getElementById('cancelEdit');

        editToggle.addEventListener('click', () => this.toggleEdit());
        cancelEdit.addEventListener('click', () => this.cancelEdit());
        profileForm.addEventListener('submit', (e) => this.handleProfileSubmit(e));
        passwordForm.addEventListener('submit', (e) => this.handlePasswordSubmit(e));
    }

    toggleEdit() {
        this.isEditing = !this.isEditing;
        
        const editableFields = ['name', 'campus', 'acpd'];
        const editToggle = document.getElementById('editToggle');
        const actionButtons = document.getElementById('actionButtons');

        if (this.isEditing) {
            editableFields.forEach(fieldId => {
                document.getElementById(fieldId).disabled = false;
            });
            editToggle.textContent = 'Cancel Edit';
            actionButtons.classList.remove('hidden');
        } else {
            editableFields.forEach(fieldId => {
                document.getElementById(fieldId).disabled = true;
            });
            editToggle.textContent = 'Edit Profile';
            actionButtons.classList.add('hidden');
            this.populateForm(); // Reset form
        }
    }

    cancelEdit() {
        this.isEditing = false;
        this.toggleEdit();
    }

    async handleProfileSubmit(e) {
        e.preventDefault();
        
        if (!this.isEditing) return;

        const formData = new FormData(e.target);
        const updates = {
            name: formData.get('name'),
            campus: formData.get('campus'),
            acpd: formData.get('acpd')
        };

        try {
            const { error } = await supabase
                .from('users')
                .update(updates)
                .eq('email', this.user.email);

            if (error) throw error;

            // Update local user data
            this.user = { ...this.user, ...updates };
            
            window.utils.showNotification('Profile updated successfully', 'success');
            this.toggleEdit(); // Exit edit mode

        } catch (error) {
            console.error('Error updating profile:', error);
            window.utils.showNotification('Error updating profile', 'error');
        }
    }

    async handlePasswordSubmit(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const currentPassword = formData.get('currentPassword');
        const newPassword = formData.get('newPassword');
        const confirmPassword = formData.get('confirmPassword');

        // Validate passwords
        if (!currentPassword || !newPassword || !confirmPassword) {
            window.utils.showNotification('Please fill in all password fields', 'error');
            return;
        }

        if (newPassword !== confirmPassword) {
            window.utils.showNotification('New passwords do not match', 'error');
            return;
        }

        if (newPassword.length < 6) {
            window.utils.showNotification('New password must be at least 6 characters', 'error');
            return;
        }

        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (error) throw error;

            window.utils.showNotification('Password changed successfully', 'success');
            
            // Reset form
            e.target.reset();

        } catch (error) {
            console.error('Error changing password:', error);
            window.utils.showNotification('Error changing password: ' + error.message, 'error');
        }
    }

    cleanup() {
        // Clean up any event listeners or timers
    }
}
