// Reports Page Module (Admin Only)
export default class ReportsPage {
    constructor() {
        this.selectedMonth = new Date().getMonth();
        this.selectedYear = new Date().getFullYear();
        this.reportData = null;
    }

    async render() {
        return `
            <!-- Navigation -->
            ${this.renderNavigation()}

            <!-- Main Content -->
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div class="mb-8">
                    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Reports</h2>
                    <p class="text-gray-600 dark:text-gray-400">View and export monthly connection summaries</p>
                </div>

                <!-- Month/Year Selector -->
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div class="flex space-x-4 mb-4 sm:mb-0">
                            <div>
                                <label for="monthSelect" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Month</label>
                                <select id="monthSelect" 
                                        class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500">
                                    <option value="0">January</option>
                                    <option value="1">February</option>
                                    <option value="2">March</option>
                                    <option value="3">April</option>
                                    <option value="4">May</option>
                                    <option value="5">June</option>
                                    <option value="6">July</option>
                                    <option value="7">August</option>
                                    <option value="8">September</option>
                                    <option value="9">October</option>
                                    <option value="10">November</option>
                                    <option value="11">December</option>
                                </select>
                            </div>
                            <div>
                                <label for="yearSelect" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Year</label>
                                <select id="yearSelect" 
                                        class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500">
                                    <!-- Years will be populated dynamically -->
                                </select>
                            </div>
                        </div>
                        <div class="flex space-x-3">
                            <button id="generateReport" 
                                    class="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500">
                                Generate Report
                            </button>
                            <button id="printReport" 
                                    class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled>
                                Print Report
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Report Content -->
                <div id="reportContent" class="bg-white dark:bg-gray-800 rounded-lg shadow">
                    <div class="px-6 py-12 text-center">
                        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No Report Generated</h3>
                        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Select a month and year, then click "Generate Report" to view the summary.</p>
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

    renderReport() {
        if (!this.reportData) return;

        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                           'July', 'August', 'September', 'October', 'November', 'December'];
        const monthYear = `${monthNames[this.selectedMonth]} ${this.selectedYear}`;

        return `
            <div id="printableReport" class="p-6">
                <!-- Header -->
                <div class="border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
                    <h1 class="text-2xl font-bold text-gray-900 dark:text-white text-center">
                        RADIUS Connection Summary
                    </h1>
                    <p class="text-lg text-gray-600 dark:text-gray-400 text-center mt-2">
                        ${monthYear}
                    </p>
                </div>

                <!-- Summary Stats -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div class="text-center">
                        <h3 class="text-lg font-medium text-gray-900 dark:text-white">Active Circle Leaders</h3>
                        <p class="text-3xl font-bold text-primary-600 dark:text-primary-400">${this.reportData.activeLeaders}</p>
                    </div>
                    <div class="text-center">
                        <h3 class="text-lg font-medium text-gray-900 dark:text-white">Total Communications</h3>
                        <p class="text-3xl font-bold text-green-600 dark:text-green-400">${this.reportData.totalCommunications}</p>
                    </div>
                    <div class="text-center">
                        <h3 class="text-lg font-medium text-gray-900 dark:text-white">Follow-ups Scheduled</h3>
                        <p class="text-3xl font-bold text-yellow-600 dark:text-yellow-400">${this.reportData.followUps}</p>
                    </div>
                </div>

                <!-- Detailed Table -->
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead class="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Circle Leader
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Communications
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Follow-ups
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            ${this.reportData.leaders.map(leader => this.renderLeaderRow(leader)).join('')}
                        </tbody>
                    </table>
                </div>

                <!-- Footer -->
                <div class="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400">
                    <p>Generated on ${new Date().toLocaleDateString()} by RADIUS - Valley Creek Church</p>
                </div>
            </div>
        `;
    }

    renderLeaderRow(leader) {
        return `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div>
                        <div class="text-sm font-medium text-gray-900 dark:text-white">${leader.name}</div>
                        <div class="text-sm text-gray-500 dark:text-gray-400">${leader.circle_type || ''} • ${leader.campus || ''}</div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="space-y-1">
                        ${leader.communications.map(comm => `
                            <div class="text-sm text-gray-900 dark:text-white">
                                ${comm.communication_type} - ${window.utils.formatDate(comm.communication_date)}
                            </div>
                        `).join('')}
                        ${leader.communications.length === 0 ? '<div class="text-sm text-gray-400">No communications</div>' : ''}
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="space-y-1">
                        ${leader.followUps.map(followUp => `
                            <div class="text-sm text-gray-900 dark:text-white">
                                ${window.utils.formatDate(followUp.follow_up_date)}
                            </div>
                        `).join('')}
                        ${leader.followUps.length === 0 ? '<div class="text-sm text-gray-400">No follow-ups</div>' : ''}
                    </div>
                </td>
            </tr>
        `;
    }

    async init() {
        this.setupEventListeners();
        this.populateYearOptions();
        this.setCurrentMonthYear();
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

        const monthSelect = document.getElementById('monthSelect');
        const yearSelect = document.getElementById('yearSelect');
        const generateButton = document.getElementById('generateReport');
        const printButton = document.getElementById('printReport');

        monthSelect.addEventListener('change', () => {
            this.selectedMonth = parseInt(monthSelect.value);
        });

        yearSelect.addEventListener('change', () => {
            this.selectedYear = parseInt(yearSelect.value);
        });

        generateButton.addEventListener('click', () => this.generateReport());
        printButton.addEventListener('click', () => this.printReport());
    }

    populateYearOptions() {
        const yearSelect = document.getElementById('yearSelect');
        const currentYear = new Date().getFullYear();
        
        // Add years from 3 years ago to next year
        for (let year = currentYear - 3; year <= currentYear + 1; year++) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            if (year === currentYear) option.selected = true;
            yearSelect.appendChild(option);
        }
    }

    setCurrentMonthYear() {
        const monthSelect = document.getElementById('monthSelect');
        const yearSelect = document.getElementById('yearSelect');
        
        monthSelect.value = this.selectedMonth;
        yearSelect.value = this.selectedYear;
    }

    async generateReport() {
        try {
            // Show loading state
            const generateButton = document.getElementById('generateReport');
            const originalText = generateButton.textContent;
            generateButton.disabled = true;
            generateButton.textContent = 'Generating...';

            // Get date range for selected month
            const startDate = new Date(this.selectedYear, this.selectedMonth, 1);
            const endDate = new Date(this.selectedYear, this.selectedMonth + 1, 0);

            // Load active circle leaders for the month
            const { data: leaders, error: leadersError } = await supabase
                .from('circle_leaders')
                .select('*')
                .eq('status', 'Active');

            if (leadersError) throw leadersError;

            // Load communications for the month
            const { data: communications, error: commError } = await supabase
                .from('communications')
                .select('*, circle_leader:circle_leaders(name, circle_type, campus)')
                .gte('communication_date', startDate.toISOString().split('T')[0])
                .lte('communication_date', endDate.toISOString().split('T')[0]);

            if (commError) throw commError;

            // Load follow-ups for the month
            const { data: followUps, error: followUpError } = await supabase
                .from('notes')
                .select('*, circle_leader:circle_leaders(name, circle_type, campus)')
                .not('follow_up_date', 'is', null)
                .gte('follow_up_date', startDate.toISOString().split('T')[0])
                .lte('follow_up_date', endDate.toISOString().split('T')[0]);

            if (followUpError) throw followUpError;

            // Process data
            this.reportData = this.processReportData(leaders, communications, followUps);

            // Render report
            const reportContent = document.getElementById('reportContent');
            reportContent.innerHTML = this.renderReport();

            // Enable print button
            document.getElementById('printReport').disabled = false;

            window.utils.showNotification('Report generated successfully', 'success');

        } catch (error) {
            console.error('Error generating report:', error);
            window.utils.showNotification('Error generating report', 'error');
        } finally {
            // Reset button
            const generateButton = document.getElementById('generateReport');
            generateButton.disabled = false;
            generateButton.textContent = 'Generate Report';
        }
    }

    processReportData(leaders, communications, followUps) {
        // Group communications by leader
        const commsByLeader = {};
        communications.forEach(comm => {
            if (!commsByLeader[comm.circle_leader_id]) {
                commsByLeader[comm.circle_leader_id] = [];
            }
            commsByLeader[comm.circle_leader_id].push(comm);
        });

        // Group follow-ups by leader
        const followUpsByLeader = {};
        followUps.forEach(followUp => {
            if (!followUpsByLeader[followUp.circle_leader_id]) {
                followUpsByLeader[followUp.circle_leader_id] = [];
            }
            followUpsByLeader[followUp.circle_leader_id].push(followUp);
        });

        // Build report data
        const processedLeaders = leaders.map(leader => ({
            ...leader,
            communications: commsByLeader[leader.id] || [],
            followUps: followUpsByLeader[leader.id] || []
        }));

        return {
            activeLeaders: leaders.length,
            totalCommunications: communications.length,
            followUps: followUps.length,
            leaders: processedLeaders
        };
    }

    printReport() {
        // Create a new window for printing
        const printWindow = window.open('', '_blank');
        
        const printContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>RADIUS Connection Summary</title>
                <style>
                    body { 
                        font-family: Arial, sans-serif; 
                        margin: 20px; 
                        color: #000; 
                        background: #fff;
                    }
                    .header { 
                        text-align: center; 
                        border-bottom: 2px solid #000; 
                        padding-bottom: 10px; 
                        margin-bottom: 20px; 
                    }
                    .stats { 
                        display: flex; 
                        justify-content: space-around; 
                        margin-bottom: 30px; 
                    }
                    .stat { 
                        text-align: center; 
                    }
                    .stat h3 { 
                        margin: 0; 
                        font-size: 14px; 
                    }
                    .stat p { 
                        margin: 5px 0; 
                        font-size: 24px; 
                        font-weight: bold; 
                    }
                    table { 
                        width: 100%; 
                        border-collapse: collapse; 
                        margin-bottom: 20px; 
                    }
                    th, td { 
                        border: 1px solid #000; 
                        padding: 8px; 
                        text-align: left; 
                        font-size: 12px; 
                    }
                    th { 
                        background-color: #f5f5f5; 
                        font-weight: bold; 
                    }
                    .footer { 
                        text-align: center; 
                        border-top: 1px solid #000; 
                        padding-top: 10px; 
                        font-size: 10px; 
                        color: #666; 
                    }
                    @media print {
                        body { margin: 0; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                ${document.getElementById('printableReport').innerHTML}
            </body>
            </html>
        `;

        printWindow.document.write(printContent);
        printWindow.document.close();
        
        // Wait for content to load, then print
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);
    }

    cleanup() {
        // Clean up any event listeners or timers
    }
}
