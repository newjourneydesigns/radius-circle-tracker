// Login Page Module
export default class LoginPage {
    constructor() {
        this.isLoading = false;
    }

    render() {
        return `
            <!-- Navigation -->
            <nav class="bg-white dark:bg-gray-800 shadow-sm">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex justify-between items-center h-16">
                        <div class="flex items-center">
                            <div class="flex-shrink-0">
                                <h1 class="text-xl font-bold text-gray-900 dark:text-white">RADIUS</h1>
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
            </nav>

            <!-- Login Form -->
            <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
                <div class="max-w-md w-full space-y-8">
                    <div>
                        <!-- Logo -->
                        <div class="mx-auto h-24 w-24 flex items-center justify-center">
                            <img src="/icons/icon-192x192.png" alt="RADIUS Logo" class="h-20 w-20">
                        </div>
                        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                            Sign in to RADIUS
                        </h2>
                        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                            Circle Leader tracking for Valley Creek Church
                        </p>
                    </div>
                    <form id="loginForm" class="mt-8 space-y-6">
                        <div class="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label for="email" class="sr-only">Email address</label>
                                <input id="email" name="email" type="email" autocomplete="email" required 
                                       class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm" 
                                       placeholder="Email address">
                            </div>
                            <div>
                                <label for="password" class="sr-only">Password</label>
                                <input id="password" name="password" type="password" autocomplete="current-password" required 
                                       class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm" 
                                       placeholder="Password">
                            </div>
                        </div>

                        <div class="flex items-center justify-between">
                            <div class="flex items-center">
                                <input id="remember-me" name="remember-me" type="checkbox" 
                                       class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700">
                                <label for="remember-me" class="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                                    Remember me
                                </label>
                            </div>

                            <div class="text-sm">
                                <a href="#" id="forgotPassword" class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
                                    Forgot your password?
                                </a>
                            </div>
                        </div>

                        <div>
                            <button type="submit" id="signInBtn"
                                    class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed">
                                <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                                    <svg class="h-5 w-5 text-primary-500 group-hover:text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"></path>
                                    </svg>
                                </span>
                                <span id="signInText">Sign in</span>
                                <span id="signInSpinner" class="hidden">
                                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                </span>
                            </button>
                        </div>
                    </form>

                    <!-- Error Message -->
                    <div id="errorMessage" class="hidden mt-4 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 rounded">
                    </div>
                </div>
            </div>
        `;
    }

    async init() {
        console.log('[LoginPage] init called');
        // Redirect if already authenticated
        if (window.authManager.isAuthenticated()) {
            console.log('[LoginPage] Already authenticated, redirecting to /dashboard');
            window.router.navigate('/dashboard');
            return;
        }

        // Wait for DOM to be ready
        setTimeout(() => {
            this.setupEventListeners();
        }, 0);
    }

    setupEventListeners() {
        console.log('[LoginPage] setupEventListeners called');
        const loginForm = document.getElementById('loginForm');
        const forgotPasswordLink = document.getElementById('forgotPassword');

        if (!loginForm) {
            console.error('[LoginPage] loginForm not found in DOM');
            return;
        }
        if (!forgotPasswordLink) {
            console.error('[LoginPage] forgotPassword not found in DOM');
        }

        loginForm.addEventListener('submit', (e) => {
            console.log('[LoginPage] loginForm submit event');
            this.handleEmailLogin(e);
        });
        if (forgotPasswordLink) {
            forgotPasswordLink.addEventListener('click', (e) => {
                console.log('[LoginPage] forgotPassword click event');
                this.handleForgotPassword(e);
            });
        }
    }

    async handleEmailLogin(e) {
        e.preventDefault();
        console.log('[LoginPage] handleEmailLogin called');
        if (this.isLoading) {
            console.log('[LoginPage] Already loading, abort');
            return;
        }
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        if (!emailInput || !passwordInput) {
            console.error('[LoginPage] Email or password input not found');
            this.showError('Login form is not loaded correctly.');
            return;
        }
        const email = emailInput.value;
        const password = passwordInput.value;
        this.setLoading(true);
        this.hideError();
        try {
            const result = await window.authManager.signInWithEmail(email, password);
            console.log('[LoginPage] signInWithEmail result:', result);
            if (result.success) {
                // Auth manager will handle redirect
            } else {
                this.showError(result.error);
            }
        } catch (err) {
            console.error('[LoginPage] Error during signInWithEmail:', err);
            this.showError('Unexpected error during login.');
        }
        this.setLoading(false);
    }

    async handleForgotPassword(e) {
        e.preventDefault();
        console.log('[LoginPage] handleForgotPassword called');
        const emailInput = document.getElementById('email');
        if (!emailInput) {
            console.error('[LoginPage] Email input not found');
            this.showError('Please enter your email address first');
            return;
        }
        const email = emailInput.value;
        if (!email) {
            this.showError('Please enter your email address first');
            return;
        }
        try {
            const result = await window.authManager.resetPassword(email);
            console.log('[LoginPage] resetPassword result:', result);
            if (result.success) {
                window.utils.showNotification('Password reset email sent!', 'success');
            } else {
                this.showError(result.error);
            }
        } catch (err) {
            console.error('[LoginPage] Error during resetPassword:', err);
            this.showError('Unexpected error during password reset.');
        }
    }

    setLoading(loading) {
        this.isLoading = loading;
        const signInBtn = document.getElementById('signInBtn');
        const signInText = document.getElementById('signInText');
        const signInSpinner = document.getElementById('signInSpinner');

        if (loading) {
            signInBtn.disabled = true;
            signInText.classList.add('hidden');
            signInSpinner.classList.remove('hidden');
        } else {
            signInBtn.disabled = false;
            signInText.classList.remove('hidden');
            signInSpinner.classList.add('hidden');
        }
    }

    showError(message) {
        const errorDiv = document.getElementById('errorMessage');
        errorDiv.textContent = message;
        errorDiv.classList.remove('hidden');
    }

    hideError() {
        const errorDiv = document.getElementById('errorMessage');
        errorDiv.classList.add('hidden');
    }

    cleanup() {
        // Clean up any event listeners or timers
    }
}
