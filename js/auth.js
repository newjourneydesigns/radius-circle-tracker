// Authentication Module for RADIUS
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.userRole = null;
        this.init();
    }

    async init() {
        // Wait for Supabase to be available
        if (!window.supabase) {
            console.log('Waiting for Supabase to initialize...');
            setTimeout(() => this.init(), 100);
            return;
        }

        try {
            console.log('Initializing auth manager...');
            // Check if user is already logged in
            const { data: { session }, error } = await window.supabase.auth.getSession();
            console.log('Session check result:', { session, error });
            
            if (session && session.user) {
                console.log('Found existing session for:', session.user.email);
                this.currentUser = session.user;
                await this.loadUserRole();
            } else {
                console.log('No existing session found');
            }

            // Listen for auth changes
            window.supabase.auth.onAuthStateChange(async (event, session) => {
                console.log('Auth state change:', event, session?.user?.email);
                if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session) {
                    this.currentUser = session.user;
                    await this.loadUserRole();
                    // Only redirect if we're currently on the login page
                    if (window.location.pathname === '/' || window.location.pathname === '/login') {
                        window.router.navigate('/dashboard');
                    }
                } else if (event === 'SIGNED_OUT') {
                    this.currentUser = null;
                    this.userRole = null;
                    window.router.navigate('/login');
                }
            });
        } catch (error) {
            console.error('Error initializing auth:', error);
        }
    }

    async loadUserRole() {
        if (!this.currentUser) return;
        
        try {
            console.log('Loading user role for:', this.currentUser.email);
            
            // Check if user exists in users table
            const { data: user, error } = await window.supabase
                .from('users')
                .select('role, campus, acpd')
                .eq('email', this.currentUser.email)
                .single();

            console.log('User query result:', { user, error });

            if (error && error.code === 'PGRST116') {
                console.log('User not found, creating new user');
                // User doesn't exist, create with default role
                await this.createUser();
            } else if (user) {
                console.log('Setting user role:', user.role);
                this.userRole = user.role;
                this.userCampus = user.campus;
                this.userAcpd = user.acpd;
            }
        } catch (error) {
            console.error('Error loading user role:', error);
        }
    }

    async createUser() {
        try {
            const { data, error } = await window.supabase
                .from('users')
                .insert([
                    {
                        email: this.currentUser.email,
                        name: this.currentUser.user_metadata?.full_name || this.currentUser.email,
                        role: APP_CONFIG.roles.VIEWER, // Default to viewer
                        campus: null,
                        acpd: null,
                        created_at: new Date().toISOString()
                    }
                ])
                .select()
                .single();

            if (error) throw error;
            
            this.userRole = data.role;
            this.userCampus = data.campus;
            this.userAcpd = data.acpd;
        } catch (error) {
            console.error('Error creating user:', error);
        }
    }

    async signInWithEmail(email, password) {
        try {
            const { data, error } = await window.supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async signInWithGoogle() {
        try {
            const { data, error } = await window.supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin + '/dashboard'
                }
            });

            if (error) throw error;
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async signUp(email, password, metadata = {}) {
        try {
            const { data, error } = await window.supabase.auth.signUp({
                email,
                password,
                options: {
                    data: metadata
                }
            });

            if (error) throw error;
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async signOut() {
        try {
            const { error } = await window.supabase.auth.signOut();
            if (error) throw error;
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async resetPassword(email) {
        try {
            const { data, error } = await window.supabase.auth.resetPasswordForEmail(email, {
                redirectTo: window.location.origin + '/reset-password'
            });

            if (error) throw error;
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    isAuthenticated() {
        // Add more robust checking
        const hasUser = !!this.currentUser;
        console.log('isAuthenticated check:', {
            hasUser,
            currentUser: this.currentUser,
            userEmail: this.currentUser?.email
        });
        return hasUser;
    }

    isAdmin() {
        console.log('isAdmin check:', {
            userRole: this.userRole,
            expectedRole: APP_CONFIG.roles.Admin,
            isMatch: this.userRole === APP_CONFIG.roles.Admin
        });
        return this.userRole === APP_CONFIG.roles.Admin;
    }

    isViewer() {
        return this.userRole === APP_CONFIG.roles.VIEWER;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    getUserRole() {
        return this.userRole;
    }

    getUserCampus() {
        return this.userCampus;
    }

    getUserAcpd() {
        return this.userAcpd;
    }
}

// Initialize auth manager
window.authManager = new AuthManager();
