// Supabase Configuration
// Function to get credentials with fallback for production
function getSupabaseCredentials() {
    // Try local env.js first (development)
    if (window.env?.SUPABASE_URL && window.env?.SUPABASE_ANON_KEY) {
        console.log('Using local development credentials');
        return {
            url: window.env.SUPABASE_URL,
            anonKey: window.env.SUPABASE_ANON_KEY
        };
    }
    
    // Fallback to production credentials (these are public anyway)
    console.log('Using production credentials');
    return {
        url: 'https://pvjdsfhhcugnrzmibhab.supabase.co',
        anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2amRzZmhoY3VnbnJ6bWliaGFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3MDQwNjEsImV4cCI6MjA2OTI4MDA2MX0.LXgde3rzdPLmfycDQW2Rf1nJ9qKMUBr2J6Yh1ZGp3Ic'
    };
}

// Initialize Supabase client
let supabaseClient;

// Function to initialize Supabase when library is ready
function initializeSupabase() {
    const credentials = getSupabaseCredentials();
    
    if (!credentials.url || !credentials.anonKey) {
        console.error('Supabase credentials missing');
        return false;
    }
    
    console.log('Attempting to initialize Supabase...');
    console.log('Config URL:', credentials.url);
    console.log('Config Key (first 20 chars):', credentials.anonKey.substring(0, 20) + '...');
    console.log('typeof supabase:', typeof supabase);
    console.log('typeof window.supabase:', typeof window.supabase);
    
    if (typeof supabase !== 'undefined') {
        supabaseClient = supabase.createClient(credentials.url, credentials.anonKey);
        window.supabase = supabaseClient;
        console.log('Supabase client initialized successfully with URL:', credentials.url);
        console.log('Supabase client object:', supabaseClient);
        return true;
    } else {
        console.error('Supabase library not loaded. Available globals:', Object.keys(window));
        return false;
    }
}

// Try to initialize immediately
console.log('Initial Supabase initialization attempt...');
if (!initializeSupabase()) {
    // If immediate initialization fails, wait for the library
    console.log('Retrying Supabase initialization...');
    let retryCount = 0;
    const maxRetries = 10;
    
    const retryInit = () => {
        retryCount++;
        console.log(`Retry attempt ${retryCount}/${maxRetries}`);
        
        if (initializeSupabase()) {
            console.log('Supabase initialized successfully on retry!');
            return;
        }
        
        if (retryCount < maxRetries) {
            setTimeout(retryInit, 200);
        } else {
            console.error('Failed to initialize Supabase after', maxRetries, 'attempts');
        }
    };
    
    setTimeout(retryInit, 100);
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

// Connection health check
let connectionHealthy = true;
let lastHealthCheck = Date.now();

async function checkConnectionHealth() {
    try {
        if (!window.supabase) return false;
        
        // Simple query to test connection
        const { error } = await window.supabase
            .from('users')
            .select('id')
            .limit(1);
        
        connectionHealthy = !error;
        lastHealthCheck = Date.now();
        
        if (!connectionHealthy) {
            console.warn('Connection health check failed:', error);
        }
        
        return connectionHealthy;
    } catch (error) {
        console.error('Health check error:', error);
        connectionHealthy = false;
        return false;
    }
}

// Run health check every 30 seconds
setInterval(checkConnectionHealth, 30000);

// Expose connection status
window.getConnectionStatus = () => ({
    healthy: connectionHealthy,
    lastCheck: lastHealthCheck,
    timeSinceLastCheck: Date.now() - lastHealthCheck
});
