// Supabase Configuration
// Credentials are loaded from window.env which should be defined in js/env.js
const SUPABASE_CONFIG = {
    url: window.env?.SUPABASE_URL || '',
    anonKey: window.env?.SUPABASE_ANON_KEY || ''
};

// Initialize Supabase client
let supabaseClient;

// Function to initialize Supabase when library is ready
function initializeSupabase() {
    if (!SUPABASE_CONFIG.url || !SUPABASE_CONFIG.anonKey) {
        console.error('Supabase credentials missing. Define SUPABASE_URL and SUPABASE_ANON_KEY in js/env.js');
        return false;
    }
    console.log('Attempting to initialize Supabase...');
    console.log('Config URL:', SUPABASE_CONFIG.url);
    console.log('Config Key (first 20 chars):', SUPABASE_CONFIG.anonKey.substring(0, 20) + '...');
    console.log('typeof supabase:', typeof supabase);
    console.log('typeof window.supabase:', typeof window.supabase);
    
    if (typeof supabase !== 'undefined') {
        supabaseClient = supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
        window.supabase = supabaseClient;
        console.log('Supabase client initialized successfully with URL:', SUPABASE_CONFIG.url);
        console.log('Supabase client object:', supabaseClient);
        console.log('Client object:', supabaseClient);
        return true;
    } else {
        console.error('Supabase library not loaded. Available globals:', Object.keys(window));
        return false;
    }
}

// Try to initialize immediately
if (!initializeSupabase()) {
    // If immediate initialization fails, wait for the library
    console.log('Retrying Supabase initialization...');
    setTimeout(() => {
        if (!initializeSupabase()) {
            console.log('Second retry...');
            setTimeout(initializeSupabase, 500);
        }
    }, 100);
}

// App Configuration
const APP_CONFIG = {
    name: 'RADIUS',
    version: '1.0.0',
    description: 'Circle Leader Tracker for Valley Creek Church',
    
    // Communication types for tracking connections
    communicationTypes: [
        'One-on-one',
        'Circle Visit', 
        'Circle Leader Equipping',
        'Text',
        'Phone Call',
        'In Passing'
    ],
    
    // Circle Leader statuses
    statuses: [
        'Invited',
        'In Training',
        'Active',
        'Paused'
    ],
    
    // User roles
    roles: {
        Admin: 'ACPD', // ACPD Level - Full Access
        Viewer: 'Viewer' // Read-only access
    }
};

// Export for use in other modules
window.APP_CONFIG = APP_CONFIG;
