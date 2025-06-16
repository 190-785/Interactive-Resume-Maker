// register.js - Fixed version using local authService
import authService from './authService.js';

document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('register-form');
  const errorMessage = document.getElementById('error-message');
  
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      try {
        // Clear previous error messages
        errorMessage.textContent = '';
        errorMessage.style.display = 'none';
        
        // Get form data
        const username = document.getElementById('username').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const fullName = document.getElementById('fullName').value.trim();
        
        // Validate input
        if (!username || !email || !password || !confirmPassword || !fullName) {
          throw new Error('All fields are required');
        }
        
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }
        
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters long');
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          throw new Error('Please enter a valid email address');
        }
        
        // Validate username format (alphanumeric and underscore only)
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        if (!usernameRegex.test(username)) {
          throw new Error('Username must be 3-20 characters long and contain only letters, numbers, and underscores');
        }
        
        // Show loading state
        const submitButton = registerForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Registering...';
        submitButton.disabled = true;
          // Check username availability first
        try {
          await authService.checkUsernameAvailability(username);
        } catch (error) {
          throw new Error('Username is already taken. Please choose a different username.');
        }
        
        // Check email availability
        try {
          await authService.checkEmailAvailability(email);
        } catch (error) {
          throw new Error('Email address is already registered. Please use a different email or try logging in.');
        }
        
        // Call register API
        const userData = {
          username,
          email,
          password,
          fullName
        };
        
        console.log('Attempting to register user:', { username, email, fullName });
        
        const response = await authService.register(userData);
        
        console.log('Registration successful:', response);
        
        // Show success message
        errorMessage.style.backgroundColor = '#d4edda';
        errorMessage.style.color = '#155724';
        errorMessage.style.border = '1px solid #c3e6cb';
        errorMessage.textContent = 'Registration successful! Redirecting to login...';
        errorMessage.style.display = 'block';
        
        // Clear form
        registerForm.reset();
        
        // Redirect to login page with success message after short delay
        setTimeout(() => {
          window.location.href = './Login_Page.html?registered=true';
        }, 2000);
        
      } catch (error) {
        console.error('Registration failed:', error);
        
        // Display error message
        errorMessage.style.backgroundColor = '#f8d7da';
        errorMessage.style.color = '#721c24';
        errorMessage.style.border = '1px solid #f5c6cb';
        
        let errorText = error.message || 'Registration failed. Please try again.';
        
        // Handle common backend error messages
        if (errorText.includes('duplicate') || errorText.includes('already exists')) {
          if (errorText.toLowerCase().includes('username')) {
            errorText = 'Username is already taken. Please choose a different username.';
          } else if (errorText.toLowerCase().includes('email')) {
            errorText = 'Email address is already registered. Please use a different email or try logging in.';
          }
        }
        
        errorMessage.textContent = errorText;
        errorMessage.style.display = 'block';
        
        // Reset button state
        const submitButton = registerForm.querySelector('button[type="submit"]');
        submitButton.textContent = 'Register';
        submitButton.disabled = false;
      }
    });
      // Add real-time username validation
    const usernameInput = document.getElementById('username');
    if (usernameInput) {
      usernameInput.addEventListener('blur', async () => {
        const username = usernameInput.value.trim();
        if (username.length >= 3) {
          try {
            await authService.checkUsernameAvailability(username);
            usernameInput.style.borderColor = '#28a745';
            // Remove any existing error message
            const errorSpan = usernameInput.nextElementSibling;
            if (errorSpan && errorSpan.classList.contains('field-error')) {
              errorSpan.remove();
            }
          } catch (error) {
            usernameInput.style.borderColor = '#dc3545';
            // Show small error message under the field
            let errorSpan = usernameInput.nextElementSibling;
            if (!errorSpan || !errorSpan.classList.contains('field-error')) {
              errorSpan = document.createElement('span');
              errorSpan.className = 'field-error';
              errorSpan.style.cssText = 'color: #dc3545; font-size: 0.8rem; display: block; margin-top: 2px;';
              usernameInput.parentNode.insertBefore(errorSpan, usernameInput.nextSibling);
            }
            errorSpan.textContent = 'Username is already taken';
          }
        }
      });
      
      usernameInput.addEventListener('input', () => {
        // Remove any field-specific error messages when user starts typing
        const errorSpan = usernameInput.nextElementSibling;
        if (errorSpan && errorSpan.classList.contains('field-error')) {
          errorSpan.remove();
        }
        usernameInput.style.borderColor = '';
      });
    }
    
    // Add real-time email validation
    const emailInput = document.getElementById('email');
    if (emailInput) {
      emailInput.addEventListener('blur', async () => {
        const email = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email && emailRegex.test(email)) {
          try {
            await authService.checkEmailAvailability(email);
            emailInput.style.borderColor = '#28a745';
            // Remove any existing error message
            const errorSpan = emailInput.nextElementSibling;
            if (errorSpan && errorSpan.classList.contains('field-error')) {
              errorSpan.remove();
            }
          } catch (error) {
            emailInput.style.borderColor = '#dc3545';
            // Show small error message under the field
            let errorSpan = emailInput.nextElementSibling;
            if (!errorSpan || !errorSpan.classList.contains('field-error')) {
              errorSpan = document.createElement('span');
              errorSpan.className = 'field-error';
              errorSpan.style.cssText = 'color: #dc3545; font-size: 0.8rem; display: block; margin-top: 2px;';
              emailInput.parentNode.insertBefore(errorSpan, emailInput.nextSibling);
            }
            errorSpan.textContent = 'Email address is already registered';
          }
        }
      });
      
      emailInput.addEventListener('input', () => {
        // Remove any field-specific error messages when user starts typing
        const errorSpan = emailInput.nextElementSibling;
        if (errorSpan && errorSpan.classList.contains('field-error')) {
          errorSpan.remove();
        }
        emailInput.style.borderColor = '';
      });
    }
    
  } else {
    console.error('Register form not found');
  }
});