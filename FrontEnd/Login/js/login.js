import authService from './authService.js';

// Check if user came from registration page
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('registered') === 'true') {
        const successMessage = document.getElementById('success-message');
        if (successMessage) {
            successMessage.textContent = 'Registration successful! You can now log in with your new account.';
            successMessage.style.display = 'block';
            
            // Hide the message after 5 seconds
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 5000);
        }
    }
});

document.getElementById('login-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    // Clear previous messages
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');
    errorMessage.style.display = 'none';
    successMessage.style.display = 'none';

    // Show loading state
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = 'Logging in...';
    submitButton.disabled = true;

    try {
        console.log('Attempting to login user:', username);
        
        const data = await authService.login(username, password);
        
        console.log('Login successful:', data);
        
        // Store token in localStorage 
        if (data && data.token) {
            localStorage.setItem('token', data.token);
        }
        
        // Store user info in localStorage
        if (data) {
            const userDetails = {
                userId: data.userId || data.id || '',
                username: data.username || username,
                email: data.email || '',
                fullName: data.fullName || data.name || '',
                bio: data.bio || '',
                joinedAt: data.joinedAt || data.createdAt || new Date().toISOString(),
                avatarUrl: data.avatarUrl || null
            };
            localStorage.setItem('user', JSON.stringify(userDetails));
            
            // Show success message briefly
            successMessage.textContent = 'Login successful! Redirecting...';
            successMessage.style.display = 'block';
            
            // Redirect to dashboard after login
            setTimeout(() => {
                window.location.href = './dashboard.html';
            }, 1000);
        } else {
            throw new Error('Login successful, but user data is incomplete');
        }
    } catch (error) {
        console.error('Login failed:', error);
        
        let errorText = error.message || 'Invalid username or password';
        
        // Handle common backend error messages
        if (errorText.includes('401') || errorText.includes('Unauthorized')) {
            errorText = 'Invalid username or password. Please try again.';
        } else if (errorText.includes('404') || errorText.includes('Not Found')) {
            errorText = 'User not found. Please check your username or register for a new account.';
        } else if (errorText.includes('500') || errorText.includes('Server Error')) {
            errorText = 'Server error. Please try again later.';
        }
        
        errorMessage.style.display = 'block';
        errorMessage.textContent = errorText;
        
        // Reset button state
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
    }
});
