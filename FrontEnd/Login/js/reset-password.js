document.addEventListener('DOMContentLoaded', function() {
    const resetPasswordForm = document.getElementById('reset-password-form');
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');
    const loadingIndicator = document.getElementById('loading-indicator');
    const resetFormFields = document.getElementById('reset-form-fields');
    const loginLink = document.getElementById('login-link');
    
    // Extract token from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (!token) {
        // No token provided, show error
        errorMessage.textContent = 'Invalid or missing reset token. Please request a new password reset link.';
        errorMessage.style.display = 'block';
        resetFormFields.style.display = 'none';
        return;
    }
    
    // Verify token validity
    verifyToken(token);
    
    if (resetPasswordForm) {
        resetPasswordForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Reset messages
            errorMessage.style.display = 'none';
            errorMessage.textContent = '';
            
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // Validate passwords match
            if (password !== confirmPassword) {
                errorMessage.textContent = 'Passwords do not match';
                errorMessage.style.display = 'block';
                return;
            }
            
            // Disable the submit button during API call
            const submitButton = resetPasswordForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Processing...';
            
            try {
                const response = await fetch('/api/auth/reset-password', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ token, password })
                });
                
                if (response.ok) {
                    // Show success message
                    successMessage.textContent = 'Your password has been reset successfully!';
                    successMessage.style.display = 'block';
                    
                    // Hide the form and show login link
                    resetFormFields.style.display = 'none';
                    loginLink.style.display = 'block';
                } else {
                    const data = await response.json();
                    throw new Error(data.error || 'Failed to reset password. Please try again or request a new reset link.');
                }
            } catch (error) {
                errorMessage.textContent = error.message;
                errorMessage.style.display = 'block';
            } finally {
                // Re-enable the button
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }
        });
    }
    
    async function verifyToken(token) {
        loadingIndicator.style.display = 'block';
        resetFormFields.style.display = 'none';
        
        try {
            const response = await fetch(`/api/auth/verify-reset-token?token=${token}`);
            
            if (response.ok) {
                // Token is valid, show password form
                resetFormFields.style.display = 'block';
            } else {
                // Token is invalid or expired
                const data = await response.json();
                errorMessage.textContent = data.error || 'Invalid or expired reset token. Please request a new password reset link.';
                errorMessage.style.display = 'block';
            }
        } catch (error) {
            errorMessage.textContent = 'Failed to verify reset token. Please try again later.';
            errorMessage.style.display = 'block';
        } finally {
            loadingIndicator.style.display = 'none';
        }
    }
});
