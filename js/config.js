// Supabase Configuration
// Updated with correct project credentials
const SUPABASE_CONFIG = {
    url: 'https://pvjdsfhhcugnrzmibhab.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2amRzZmhoY3VnbnJ6bWliaGFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3MDQwNjEsImV4cCI6MjA2OTI4MDA2MX0.LXgde3rzdPLmfycDQW2Rf1nJ9qKMUBr2J6Yh1ZGp3Ic'
};

// Initialize Supabase client
let supabaseClient;

// Function to initialize Supabase when library is ready
function initializeSupabase() {
    console.log('Attempting to initialize Supabase...');
    console.log('typeof supabase:', typeof supabase);
    console.log('typeof window.supabase:', typeof window.supabase);
    
    if (typeof supabase !== 'undefined') {
        supabaseClient = supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
        window.supabase = supabaseClient;
        console.log('Supabase client initialized successfully');
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
        Admin: 'Admin', // Admin Level - Full Access
        Viewer: 'Viewer' // Read-only access
    }
};

// Export for use in other modules
window.APP_CONFIG = APP_CONFIG;
