// register.js - Corrected version
import apiService from './apiService.js';

document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');
  const errorMessage = document.getElementById('errorMessage');
  
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      try {
        // Clear previous error messages
        errorMessage.textContent = '';
        errorMessage.style.display = 'none';
        
        // Get form data
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const fullName = document.getElementById('fullName').value;
        
        // Validate input
        if (!username || !email || !password || !confirmPassword || !fullName) {
          throw new Error('All fields are required');
        }
        
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }
        
        // Show loading state
        const submitButton = registerForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Registering...';
        submitButton.disabled = true;
          // Call register API
        const userData = {
          username,
          email,
          password,
          fullName,
          bio: '', // Initialize with empty bio
          joinedAt: new Date().toISOString(),
          avatarUrl: null
        };
        
        const response = await apiService.register(userData);
        
        // Redirect to login page with success message
        window.location.href = '/login.html?registered=true';
      } catch (error) {
        // Display error message
        errorMessage.textContent = error.message || 'Registration failed. Please try again.';
        errorMessage.style.display = 'block';
        
        // Reset button state
        const submitButton = registerForm.querySelector('button[type="submit"]');
        submitButton.textContent = 'Register';
        submitButton.disabled = false;
      }
    });
  }
});