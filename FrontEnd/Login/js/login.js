import apiService from '../../Forest_Drive/src/js/apiService.js';

document.getElementById('login-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const data = await apiService.login(username, password);
        
        // Store token in localStorage 
        if (data && data.token) {
            localStorage.setItem('token', data.token);
        }
          // Store user info in localStorage
        if (data) {
            const userDetails = {
                userId: data.userId || '',
                username: data.username || username,
                email: data.email || '',
                fullName: data.fullName || '',
                bio: data.bio || '',
                joinedAt: data.joinedAt || new Date().toISOString(),
                avatarUrl: data.avatarUrl || null
            };
            localStorage.setItem('user', JSON.stringify(userDetails));
            
            // Redirect to dashboard after login
            window.location.href = './dashboard.html';
        } else {
            throw new Error('Login successful, but user data is incomplete');
        }
    } catch (error) {
        const errorMessage = document.getElementById('error-message');
        errorMessage.style.display = 'block';
        errorMessage.textContent = error.message || 'Invalid username or password';
        console.error('Login failed:', error);
    }
});
