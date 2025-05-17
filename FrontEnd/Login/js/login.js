import apiService from '../../Forest_Drive/src/js/apiService.js';

document.getElementById('login-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const data = await apiService.login(username, password); // Changed to use apiService.login
        // Store token in localStorage 
        if (data && data.token) {
            localStorage.setItem('token', data.token);
        }
        // Store user info in localStorage
        // Ensure data has the expected structure before accessing nested properties
        if (data && data.username) { // Assuming username is directly in data, adjust if it's nested
            const userDetails = {
                userId: data.userId,
                username: data.username,
                email: data.email,
                fullName: data.fullName
            };
            localStorage.setItem('user', JSON.stringify(userDetails));
            // Redirect to dashboard after login
            window.location.href = './dashboard.html'; // Corrected path
        } else {
            // Handle cases where token might be returned but not full user details
            // Or if the response structure is different than expected
            console.warn('Login successful, token received, but user details might be incomplete or in unexpected format:', data);
            // Decide if redirection is still appropriate or if an error/warning should be shown
            // For now, let's assume if a token is present, login was somewhat successful
            if (data && data.token) {
                 window.location.href = './dashboard.html'; // Corrected path
            } else {
                throw new Error('Login response did not include expected user details.');
            }
        }
    } catch (error) {
        const errorMessage = document.getElementById('error-message');
        errorMessage.style.display = 'block';
        errorMessage.textContent = error.message || 'Invalid username or password';
        console.error('Login failed:', error);
    }
});
