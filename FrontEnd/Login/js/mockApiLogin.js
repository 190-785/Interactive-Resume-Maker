// File: mockApiLogin.js - To mock login functionality for testing

// Mock login function that will override the imported apiService.login
window.mockLogin = async function(username, password) {    // Simple validation
    if (!username || !password) {
        throw new Error('Username and password are required');
    }
    
    // For testing, accept any non-empty username/password
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    
    return {
        token: 'mock-jwt-token-' + Math.random().toString(36).substring(2),
        userId: '123456',
        username: username,
        email: username.includes('@') ? username : username + '@example.com',
        fullName: '',
        bio: '',
        joinedAt: new Date().toISOString(),
        avatarUrl: null
    };
};

// This script should be added before the login.js script
// It will intercept and replace the apiService.login method
document.addEventListener('DOMContentLoaded', function() {
    // Wait for the script to be fully loaded
    setTimeout(() => {
        try {
            // Override the apiService.login method with our mock
            if (window.apiService) {
                console.log('Mocking apiService.login');
                window.apiService.login = window.mockLogin;
            }
        } catch (e) {
            console.error('Error setting up mock login:', e);
        }
    }, 0);
});
