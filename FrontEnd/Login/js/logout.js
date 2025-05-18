// Logout functionality

document.addEventListener('DOMContentLoaded', function() {
    // Import the auth manager module
    import('./authManager.js').then(module => {
        const authManager = module.default;
        
        // Perform logout
        authManager.logout(true);
    }).catch(error => {
        console.error('Error importing auth manager:', error);
        
        // Fallback logout if auth manager fails to load
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('tokenExpiry');
        
        // Redirect to login page
        window.location.href = './Login_Page.html';
    });
});
