/**
 * Authentication Manager
 * 
 * This module handles authentication-related tasks including:
 * - Token validation
 * - Token refresh
 * - Session management
 * - Automatic logout on token expiration
 */

class AuthManager {
    constructor() {
        this.tokenKey = 'token';
        this.refreshTokenKey = 'refreshToken';
        this.userKey = 'user';
        this.tokenExpiryKey = 'tokenExpiry';
        
        // Check token validity every minute
        this.tokenCheckInterval = setInterval(() => this.checkTokenValidity(), 60000);
        
        // Add event listener for page visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                this.checkTokenValidity();
            }
        });
    }
    
    /**
     * Stores authentication data in localStorage
     * @param {Object} authData - The authentication data from the server
     */
    setAuthData(authData) {
        if (!authData) return;
        
        const { token, refreshToken, user, expiresIn } = authData;
        
        if (token) {
            localStorage.setItem(this.tokenKey, token);
            
            // Set token expiry time if provided
            if (expiresIn) {
                const expiryTime = Date.now() + (expiresIn * 1000);
                localStorage.setItem(this.tokenExpiryKey, expiryTime.toString());
            }
        }
        
        if (refreshToken) {
            localStorage.setItem(this.refreshTokenKey, refreshToken);
        }
        
        if (user) {
            localStorage.setItem(this.userKey, JSON.stringify(user));
        }
    }
    
    /**
     * Gets the current authentication token
     * @returns {string|null} The authentication token or null if not found
     */
    getToken() {
        return localStorage.getItem(this.tokenKey);
    }
    
    /**
     * Gets the refresh token
     * @returns {string|null} The refresh token or null if not found
     */
    getRefreshToken() {
        return localStorage.getItem(this.refreshTokenKey);
    }
    
    /**
     * Gets the current user data
     * @returns {Object|null} The user data or null if not found
     */
    getUserData() {
        const userData = localStorage.getItem(this.userKey);
        return userData ? JSON.parse(userData) : null;
    }
    
    /**
     * Updates the user data in localStorage
     * @param {Object} userData - The updated user data
     */
    updateUserData(userData) {
        if (!userData) return;
        
        const currentData = this.getUserData() || {};
        const mergedData = { ...currentData, ...userData };
        
        localStorage.setItem(this.userKey, JSON.stringify(mergedData));
    }
    
    /**
     * Checks if the user is logged in
     * @returns {boolean} True if logged in, false otherwise
     */
    isLoggedIn() {
        return !!this.getToken();
    }
    
    /**
     * Logs the user out
     * @param {boolean} redirect - Whether to redirect to the login page
     */
    logout(redirect = true) {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.refreshTokenKey);
        localStorage.removeItem(this.userKey);
        localStorage.removeItem(this.tokenExpiryKey);
        
        if (redirect) {
            window.location.href = './Login_Page.html';
        }
    }
    
    /**
     * Checks if the token is valid or needs refresh
     * @returns {Promise<boolean>} Promise resolving to true if token is valid
     */
    async checkTokenValidity() {
        const token = this.getToken();
        if (!token) return false;
        
        // Check if token is expired based on expiry time
        const expiryTime = localStorage.getItem(this.tokenExpiryKey);
        if (expiryTime) {
            const currentTime = Date.now();
            const timeUntilExpiry = parseInt(expiryTime) - currentTime;
            
            // If token expires in less than 5 minutes, try to refresh it
            if (timeUntilExpiry < 300000 && timeUntilExpiry > 0) {
                return this.refreshToken();
            }
            
            // If token is already expired, log out
            if (timeUntilExpiry <= 0) {
                console.warn('Token expired, logging out');
                this.logout();
                return false;
            }
        }
        
        // If no expiry information, verify token with the server
        try {
            const response = await fetch('/api/auth/verify', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            return response.ok;
        } catch (error) {
            console.error('Error verifying token:', error);
            return false;
        }
    }
    
    /**
     * Refreshes the authentication token
     * @returns {Promise<boolean>} Promise resolving to true if token was refreshed
     */
    async refreshToken() {
        const refreshToken = this.getRefreshToken();
        if (!refreshToken) return false;
        
        try {
            const response = await fetch('/api/auth/refresh', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ refreshToken })
            });
            
            if (!response.ok) {
                throw new Error('Failed to refresh token');
            }
            
            const data = await response.json();
            this.setAuthData(data);
            
            return true;
        } catch (error) {
            console.error('Error refreshing token:', error);
            
            // If refresh fails, log out
            this.logout();
            return false;
        }
    }
    
    /**
     * Gets the authorization headers for API requests
     * @returns {Object} Headers object with Authorization header
     */
    getAuthHeaders() {
        const token = this.getToken();
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    }
}

// Create a singleton instance
const authManager = new AuthManager();

// Export the singleton
export default authManager;
