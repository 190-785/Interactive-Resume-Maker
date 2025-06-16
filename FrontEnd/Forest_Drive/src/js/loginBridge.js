// loginBridge.js - Bridge for cross-domain localStorage access

class LoginBridge {
    constructor() {
        this.storageKey = 'resumeForestLogin';
        this.init();
    }

    init() {
        // Check if we're coming from dashboard with URL parameters
        this.checkUrlParameters();
        
        // Listen for storage events from other windows
        window.addEventListener('storage', (e) => {
            if (e.key === this.storageKey) {
                console.log('Login data updated by another window');
                this.loadLoginData();
            }
        });
    }

    checkUrlParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const user = urlParams.get('user');
        
        if (token && user) {
            try {
                const userData = JSON.parse(decodeURIComponent(user));
                this.saveLoginData(token, userData);
                console.log('Login data loaded from URL parameters');
            } catch (e) {
                console.error('Error parsing user data from URL:', e);
            }
        }
    }

    saveLoginData(token, userData) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Also save to our bridge storage
        const bridgeData = {
            token: token,
            user: userData,
            timestamp: Date.now()
        };
        localStorage.setItem(this.storageKey, JSON.stringify(bridgeData));
        
        console.log('Login data saved via bridge');
    }

    loadLoginData() {
        // First try regular localStorage
        let token = localStorage.getItem('token');
        let user = localStorage.getItem('user');
        
        // If not found, try bridge storage
        if (!token || !user) {
            try {
                const bridgeData = localStorage.getItem(this.storageKey);
                if (bridgeData) {
                    const data = JSON.parse(bridgeData);
                    // Check if data is not too old (24 hours)
                    if (Date.now() - data.timestamp < 24 * 60 * 60 * 1000) {
                        token = data.token;
                        user = JSON.stringify(data.user);
                        
                        // Save to regular localStorage
                        localStorage.setItem('token', token);
                        localStorage.setItem('user', user);
                        
                        console.log('Login data restored from bridge');
                    }
                }
            } catch (e) {
                console.error('Error loading bridge data:', e);
            }
        }
        
        return { token, user };
    }

    isLoggedIn() {
        const { token, user } = this.loadLoginData();
        
        if (token && user) {
            try {
                const userData = JSON.parse(user);
                return !!(userData && (userData.username || userData.email || userData.fullName));
            } catch (e) {
                console.error('Error validating login data:', e);
            }
        }
        
        return false;
    }

    getUserData() {
        const { user } = this.loadLoginData();
        if (user) {
            try {
                return JSON.parse(user);
            } catch (e) {
                console.error('Error parsing user data:', e);
            }
        }
        return null;
    }

    getToken() {
        const { token } = this.loadLoginData();
        return token;
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem(this.storageKey);
        console.log('Logged out via bridge');
    }
}

// Export for use in other modules
window.LoginBridge = LoginBridge;
