// Excel Import Page Module
export default class ExcelImportPage {
    constructor() {
        this.rows = [];
        this.headers = [];
        this.eventHandlers = [];
    }

    async render() {
        return `
            <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
                ${this.renderNavigation()}
                <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Import Data</h2>
                    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <input id="excelFile" type="file" accept=".xlsx" class="mb-4">
                        <div id="mappingSection" class="hidden">
                            <div class="mb-4">
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Supabase Table</label>
                                <select id="tableSelect" class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                                    <option value="circle_leaders">circle_leaders</option>
                                </select>
                            </div>
                            <div id="columnMapping" class="mb-4"></div>
                            <div id="previewTable" class="overflow-x-auto mb-4"></div>
                            <button id="importButton" class="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700">Import</button>
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
                            <button onclick="window.app.toggleTheme()" class="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
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

    async init() {
        window.excelImportPage = this;
        this.setupMenu();
        const fileInput = document.getElementById('excelFile');
        const importButton = document.getElementById('importButton');
        fileInput.addEventListener('change', (e) => this.handleFile(e));
        importButton.addEventListener('click', () => this.importRows());
        this.eventHandlers.push({ el: fileInput, type: 'change', handler: this.handleFile });
        this.eventHandlers.push({ el: importButton, type: 'click', handler: this.importRows });
    }

    setupMenu() {
        const handler = (e) => {
            const menuButton = document.getElementById('menuButton');
            const menuDropdown = document.getElementById('menuDropdown');
            if (!menuButton || !menuDropdown) return;
            if (menuButton.contains(e.target)) {
                menuDropdown.classList.toggle('hidden');
            } else if (!menuDropdown.contains(e.target)) {
                menuDropdown.classList.add('hidden');
            }
        };
        document.addEventListener('click', handler);
        this.eventHandlers.push({ el: document, type: 'click', handler });
    }

    async handleFile(e) {
        const file = e.target.files[0];
        if (!file) return;
        try {
            const data = await file.arrayBuffer();
            const workbook = XLSX.read(data, { type: 'array' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            this.headers = rows[0];
            this.rows = XLSX.utils.sheet_to_json(sheet, { header: this.headers, range: 1 });
            this.renderMapping();
            this.renderPreview();
            document.getElementById('mappingSection').classList.remove('hidden');
        } catch (err) {
            console.error('Error reading file', err);
            window.utils.showNotification('Failed to read Excel file', 'error');
        }
    }

    renderMapping() {
        const container = document.getElementById('columnMapping');
        if (!container) return;
        const fields = ['name','email','phone','campus','acpd','circle_type','meeting_day','meeting_time','frequency','ccb_profile_link','calendar_link','status','follow_up_date','follow_up_note','last_communication_date'];
        const rows = this.headers.map((header, idx) => {
            const options = ['<option value="">Ignore</option>'].concat(fields.map(f => `<option value="${f}">${f}</option>`)).join('');
            return `<tr><td class="px-4 py-2">${header}</td><td class="px-4 py-2"><select id="map-${idx}" class="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">${options}</select></td></tr>`;
        }).join('');
        container.innerHTML = `<table class="min-w-full divide-y divide-gray-200"><thead><tr><th class="px-4 py-2 text-left">Excel Column</th><th class="px-4 py-2 text-left">Map To</th></tr></thead><tbody>${rows}</tbody></table>`;
    }

    renderPreview() {
        const container = document.getElementById('previewTable');
        if (!container) return;
        const previewRows = this.rows.slice(0, 5);
        const head = this.headers.map(h => `<th class="px-4 py-2 text-left">${h}</th>`).join('');
        const body = previewRows.map(r => `<tr>${this.headers.map(h => `<td class="px-4 py-2">${r[h] || ''}</td>`).join('')}</tr>`).join('');
        container.innerHTML = `<table class="min-w-full divide-y divide-gray-200"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`;
    }

    async importRows() {
        const table = document.getElementById('tableSelect').value;
        const mapping = {};
        this.headers.forEach((h, i) => {
            const val = document.getElementById(`map-${i}`).value;
            if (val) mapping[h] = val;
        });
        const records = this.rows.map(row => {
            const obj = {};
            for (const [src, dest] of Object.entries(mapping)) {
                obj[dest] = row[src];
            }
            return obj;
        });
        try {
            const { error } = await window.supabase.from(table).insert(records);
            if (error) throw error;
            window.utils.showNotification('Data imported successfully', 'success');
        } catch (err) {
            console.error('Import error', err);
            window.utils.showNotification('Error importing data', 'error');
        }
    }

    cleanup() {
        this.eventHandlers.forEach(({ el, type, handler }) => {
            el.removeEventListener(type, handler);
        });
        this.eventHandlers = [];
        window.excelImportPage = null;
    }
}
