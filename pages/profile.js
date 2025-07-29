// Circle Leader Profile Page Module
export default class ProfilePage {
    constructor() {
        this.leaderId = null;
        this.leader = null;
        this.communications = [];
        this.notes = [];
    }

    render() {
        return `
            <!-- Navigation -->
            ${this.renderNavigation()}

            <!-- Main Content -->
            <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div id="profileContent">
                    <!-- Content will be loaded here -->
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

    renderProfileContent() {
        if (!this.leader) {
            return `
                <div class="text-center py-12">
                    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Circle Leader Not Found</h2>
                    <button onclick="window.router.navigate('/dashboard')" 
                            class="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700">
                        Return to Dashboard
                    </button>
                </div>
            `;
        }

        const isAdmin = window.authManager.isAdmin();
        const statusColors = {
            'invited': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
            'pipeline': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
            'active': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
            'paused': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
            'off-boarding': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
            // Legacy support for old capitalized values
            'Invited': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
            'In Training': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
            'Active': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
            'Paused': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
        };

        return `
            <!-- Header -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
                <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <div>
                        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">${this.leader.name}</h2>
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${statusColors[this.leader.status] || statusColors['paused']}">
                            ${this.leader.status ? this.leader.status.charAt(0).toUpperCase() + this.leader.status.slice(1) : 'Unknown'}
                        </span>
                    </div>
                    <div class="flex space-x-3">
                        <button onclick="window.profilePage.editProfile()" 
                                class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                            </svg>
                            Edit Profile
                        </button>
                        <button onclick="window.profilePage.exportHistory()" 
                                class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                            Export History
                        </button>
                    </div>
                </div>
                
                <!-- Circle Info -->
                <div class="px-6 py-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Circle Information</h3>
                            <dl class="space-y-2">
                                <div>
                                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Type</dt>
                                    <dd class="text-sm text-gray-900 dark:text-white">${this.leader.circle_type || 'Not specified'}</dd>
                                </div>
                                <div>
                                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Day</dt>
                                    <dd class="text-sm text-gray-900 dark:text-white">${this.leader.day || 'Not specified'}</dd>
                                </div>
                                <div>
                                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Time</dt>
                                    <dd class="text-sm text-gray-900 dark:text-white">${this.leader.time || 'Not specified'}</dd>
                                </div>
                                <div>
                                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Frequency</dt>
                                    <dd class="text-sm text-gray-900 dark:text-white">${this.leader.frequency || 'Not specified'}</dd>
                                </div>
                            </dl>
                        </div>
                        <div>
                            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Contact Information</h3>
                            <dl class="space-y-2">
                                <div>
                                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Campus</dt>
                                    <dd class="text-sm text-gray-900 dark:text-white">${this.leader.campus || 'Not specified'}</dd>
                                </div>
                                <div>
                                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">ACPD</dt>
                                    <dd class="text-sm text-gray-900 dark:text-white">${this.leader.acpd || 'Not specified'}</dd>
                                </div>
                                <div>
                                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Links</dt>
                                    <dd class="text-sm space-x-2">
                                        ${this.leader.ccb_profile_link ? `
                                            <a href="${this.leader.ccb_profile_link}" target="_blank" 
                                               class="text-primary-600 hover:text-primary-700 dark:text-primary-400">CCB Profile</a>
                                        ` : ''}
                                        ${this.leader.calendar_link ? `
                                            <a href="${this.leader.calendar_link}" target="_blank" 
                                               class="text-primary-600 hover:text-primary-700 dark:text-primary-400">Calendar</a>
                                        ` : ''}
                                    </dd>
                                </div>
                                ${isAdmin ? `
                                    <div>
                                        <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Event Summary</dt>
                                        <dd class="text-sm">
                                            <div class="flex items-center">
                                                <input type="checkbox" 
                                                       id="event-summary-profile-${this.leader.id}" 
                                                       ${this.leader.event_summary_received ? 'checked' : ''} 
                                                       onchange="window.profilePage.toggleEventSummary(this.checked)"
                                                       class="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                                                <label for="event-summary-profile-${this.leader.id}" class="ml-2 text-sm text-gray-900 dark:text-white">
                                                    Event Summary Received
                                                </label>
                                            </div>
                                        </dd>
                                    </div>
                                ` : ''}
                            </dl>
                        </div>
                    </div>
                </div>
            </div>

            ${isAdmin ? this.renderActionForms() : ''}

            <!-- Communication History -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
                <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white">Communication History</h3>
                </div>
                <div class="px-6 py-4">
                    <div id="communicationHistory" class="space-y-4">
                        ${this.renderCommunicationHistory()}
                    </div>
                </div>
            </div>
        `;
    }

    renderActionForms() {
        return `
            <!-- Action Forms (Admin Only) -->
            <div class="grid grid-cols-1 gap-6 mb-6">
                <!-- Notes Section -->
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
                    <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 class="text-lg font-medium text-gray-900 dark:text-white">Add Note</h3>
                    </div>
                    <div class="px-6 py-4">
                        <form id="noteForm" class="space-y-4">
                            <div>
                                <label for="freeformNote" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Note</label>
                                <div id="freeformNoteEditor" class="mt-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white min-h-[100px] p-3 focus-within:ring-primary-500 focus-within:border-primary-500"
                                     contenteditable="true" 
                                     data-placeholder="Add freeform notes..."></div>
                            </div>
                            <button type="submit" 
                                    class="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500">
                                Add Note
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        `;
    }

    renderCommunicationHistory() {
        if (this.communications.length === 0 && this.notes.length === 0) {
            return `
                <div class="text-center py-8">
                    <p class="text-gray-500 dark:text-gray-400">No communication history yet.</p>
                </div>
            `;
        }

        // Combine and sort communications and notes
        const allEntries = [
            ...this.communications.map(comm => ({ ...comm, type: 'communication' })),
            ...this.notes.map(note => ({ ...note, type: 'note' }))
        ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        return allEntries.map(entry => this.renderHistoryEntry(entry)).join('');
    }

    renderHistoryEntry(entry) {
        const isAdmin = window.authManager.isAdmin();
        const date = entry.communication_date || entry.note_date || entry.created_at;
        
        // Debug logging
        console.log('Rendering entry:', entry);
        console.log('Entry ID:', entry.id, 'Type:', typeof entry.id);
        
        let iconClass = 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400';
        let title = 'Note';
        
        if (entry.type === 'communication') {
            iconClass = 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400';
            title = entry.communication_type || 'Communication';
        }

        return `
            <div class="flex space-x-3">
                <div class="flex-shrink-0">
                    <div class="w-8 h-8 ${iconClass} rounded-full flex items-center justify-center">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clip-rule="evenodd"></path>
                        </svg>
                    </div>
                </div>
                <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-gray-900 dark:text-white">${title}</p>
                            <p class="text-sm text-gray-500 dark:text-gray-400">${window.utils.formatDate(date)}</p>
                        </div>
                        <div class="flex space-x-2">
                            <button onclick="window.profilePage.editEntry('${entry.id}', '${entry.type}')" 
                                    class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
                                </svg>
                            </button>
                            <button onclick="window.profilePage.deleteEntry('${entry.id}', '${entry.type}')" 
                                    class="text-red-400 hover:text-red-600">
                                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                    ${entry.content || entry.note ? `
                        <div class="mt-2 text-sm text-gray-700 dark:text-gray-300 prose prose-sm max-w-none">
                            ${entry.content || entry.note || ''}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    async init() {
        // Get leader ID from URL
        const pathSegments = window.router.getPathSegments();
        this.leaderId = pathSegments[1]; // circle-leader/{id}

        if (!this.leaderId) {
            window.router.navigate('/dashboard');
            return;
        }

        // Make this instance available globally for onclick handlers
        window.profilePage = this;

        await this.loadLeaderData();
        this.renderProfile();
        this.setupEventListeners();
    }

    async loadLeaderData() {
        try {
            // Load circle leader
            const { data: leader, error: leaderError } = await supabase
                .from('circle_leaders')
                .select('*')
                .eq('id', this.leaderId)
                .single();

            if (leaderError) throw leaderError;
            this.leader = leader;

            // Load communications
            const { data: communications, error: commError } = await supabase
                .from('communications')
                .select('*')
                .eq('circle_leader_id', this.leaderId)
                .order('created_at', { ascending: false });

            if (commError) throw commError;
            this.communications = communications || [];

            // Load notes
            const { data: notes, error: notesError } = await supabase
                .from('notes')
                .select('*')
                .eq('circle_leader_id', this.leaderId)
                .order('created_at', { ascending: false });

            if (notesError) throw notesError;
            this.notes = notes || [];

        } catch (error) {
            console.error('Error loading leader data:', error);
            window.utils.showNotification('Error loading leader data', 'error');
        }
    }

    renderProfile() {
        const profileContent = document.getElementById('profileContent');
        profileContent.innerHTML = this.renderProfileContent();
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

        // Note form
        const noteForm = document.getElementById('noteForm');
        noteForm?.addEventListener('submit', (e) => this.handleNoteSubmit(e));

        // Rich text editor placeholders
        this.setupRichTextEditors();
    }

    setupRichTextEditors() {
        const editors = ['freeformNoteEditor'];
        
        editors.forEach(editorId => {
            const editor = document.getElementById(editorId);
            if (!editor) return;

            // Show/hide placeholder
            const updatePlaceholder = () => {
                const isEmpty = editor.textContent.trim() === '';
                if (isEmpty && !editor.classList.contains('focus')) {
                    editor.classList.add('text-gray-400', 'dark:text-gray-500');
                    editor.innerHTML = editor.dataset.placeholder;
                } else if (editor.innerHTML === editor.dataset.placeholder) {
                    editor.classList.remove('text-gray-400', 'dark:text-gray-500');
                    editor.innerHTML = '';
                }
            };

            editor.addEventListener('focus', () => {
                editor.classList.add('focus');
                if (editor.innerHTML === editor.dataset.placeholder) {
                    editor.classList.remove('text-gray-400', 'dark:text-gray-500');
                    editor.innerHTML = '';
                }
            });

            editor.addEventListener('blur', () => {
                editor.classList.remove('focus');
                updatePlaceholder();
            });

            updatePlaceholder();
        });
    }

    async handleNoteSubmit(e) {
        e.preventDefault();
        
        const freeformNote = document.getElementById('freeformNoteEditor').innerHTML;

        try {
            const { error } = await supabase
                .from('notes')
                .insert([{
                    circle_leader_id: this.leaderId,
                    note_date: new Date().toISOString().split('T')[0],
                    content: freeformNote,
                    created_at: new Date().toISOString()
                }]);

            if (error) throw error;

            window.utils.showNotification('Note added successfully', 'success');
            
            // Reset form and reload data
            document.getElementById('freeformNoteEditor').innerHTML = '';
            await this.loadLeaderData();
            this.renderProfile();
            this.setupEventListeners();

        } catch (error) {
            console.error('Error saving note:', error);
            window.utils.showNotification('Error saving note', 'error');
        }
    }

    async exportHistory() {
        try {
            // Implement Excel export functionality
            window.utils.showNotification('Export feature coming soon', 'info');
        } catch (error) {
            console.error('Error exporting history:', error);
            window.utils.showNotification('Error exporting history', 'error');
        }
    }

    async editEntry(entryId, entryType) {
        try {
            console.log('Edit entry called with:', { entryId, entryType });
            console.log('Available notes:', this.notes);
            console.log('Available communications:', this.communications);
            
            // Find the entry in our data
            let entry;
            if (entryType === 'note') {
                entry = this.notes.find(note => {
                    console.log('Comparing note ID:', note.id, 'with entryId:', entryId, 'Equal?', note.id === entryId);
                    return note.id === entryId;
                });
            } else {
                entry = this.communications.find(comm => {
                    console.log('Comparing comm ID:', comm.id, 'with entryId:', entryId, 'Equal?', comm.id === entryId);
                    return comm.id === entryId;
                });
            }

            console.log('Found entry:', entry);

            if (!entry) {
                console.error('Entry not found for ID:', entryId, 'Type:', entryType);
                window.utils.showNotification('Entry not found', 'error');
                return;
            }

            // Create a modal for editing
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
            modal.innerHTML = `
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
                    <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 class="text-lg font-medium text-gray-900 dark:text-white">Edit ${entryType === 'note' ? 'Note' : 'Communication'}</h3>
                    </div>
                    <div class="px-6 py-4">
                        <form id="editEntryForm">
                            <div class="mb-4">
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    ${entryType === 'note' ? 'Note' : 'Communication'}
                                </label>
                                <div id="editEntryEditor" class="border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white min-h-[100px] p-3 focus-within:ring-primary-500 focus-within:border-primary-500"
                                     contenteditable="true">${entry.content || entry.note || ''}</div>
                            </div>
                            <div class="flex justify-end space-x-3">
                                <button type="button" onclick="this.closest('.fixed').remove()" 
                                        class="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500">
                                    Cancel
                                </button>
                                <button type="submit" 
                                        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);

            // Handle form submission
            const form = document.getElementById('editEntryForm');
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const newContent = document.getElementById('editEntryEditor').innerHTML;
                const table = entryType === 'note' ? 'notes' : 'communications';
                const field = entryType === 'note' ? 'content' : 'note';
                
                try {
                    const { error } = await supabase
                        .from(table)
                        .update({ [field]: newContent })
                        .eq('id', entryId);

                    if (error) throw error;

                    window.utils.showNotification(`${entryType === 'note' ? 'Note' : 'Communication'} updated successfully`, 'success');
                    modal.remove();
                    
                    // Reload data and refresh display
                    await this.loadLeaderData();
                    this.renderProfile();
                    this.setupEventListeners();

                } catch (error) {
                    console.error('Error updating entry:', error);
                    window.utils.showNotification('Error updating entry', 'error');
                }
            });

            // Close modal when clicking outside
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.remove();
                }
            });

        } catch (error) {
            console.error('Error editing entry:', error);
            window.utils.showNotification('Error editing entry', 'error');
        }
    }

    async deleteEntry(entryId, entryType) {
        if (!confirm('Are you sure you want to delete this entry?')) return;

        try {
            const table = entryType === 'communication' ? 'communications' : 'notes';
            const { error } = await supabase
                .from(table)
                .delete()
                .eq('id', entryId);

            if (error) throw error;

            window.utils.showNotification('Entry deleted successfully', 'success');
            await this.loadLeaderData();
            this.renderProfile();
            this.setupEventListeners();

        } catch (error) {
            console.error('Error deleting entry:', error);
            window.utils.showNotification('Error deleting entry', 'error');
        }
    }

    editProfile() {
        console.log('editProfile called');
        console.log('Leader data:', this.leader);
        if (this.leader && this.leader.id) {
            const editUrl = `/circle-leader/${this.leader.id}/edit`;
            console.log('Navigating to:', editUrl);
            window.router.navigate(editUrl);
        } else {
            console.error('No leader or leader ID available');
            window.utils.showNotification('Unable to edit profile - no leader data found', 'error');
        }
    }

    async toggleEventSummary(isChecked) {
        try {
            const { error } = await supabase
                .from('circle_leaders')
                .update({ event_summary_received: isChecked })
                .eq('id', this.leader.id);

            if (error) throw error;

            // Update the leader data
            this.leader.event_summary_received = isChecked;

            window.utils.showNotification(
                `Event Summary ${isChecked ? 'marked as received' : 'unmarked'}`, 
                'success'
            );
        } catch (error) {
            console.error('Error updating event summary:', error);
            window.utils.showNotification('Error updating event summary', 'error');
            
            // Revert the checkbox state on error
            const checkbox = document.getElementById(`event-summary-profile-${this.leader.id}`);
            if (checkbox) {
                checkbox.checked = !isChecked;
            }
        }
    }

    cleanup() {
        // Clean up any event listeners or timers and global reference
        window.profilePage = null;
    }
}
