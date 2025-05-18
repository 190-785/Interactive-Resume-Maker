document.addEventListener('DOMContentLoaded', function() {
    const forgotPasswordForm = document.getElementById('forgot-password-form');
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');
    const stepsContainer = document.getElementById('steps-container');
    
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Reset messages
            errorMessage.style.display = 'none';
            errorMessage.textContent = '';
            successMessage.style.display = 'none';
            successMessage.textContent = '';
            
            const email = document.getElementById('email').value;
            
            // Disable the submit button during API call
            const submitButton = forgotPasswordForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Processing...';
            
            try {
                const response = await fetch('/api/auth/forgot-password', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email })
                });
                
                if (response.ok) {
                    // Show success message and steps
                    successMessage.textContent = 'Password reset instructions have been sent to your email address.';
                    successMessage.style.display = 'block';
                    stepsContainer.style.display = 'block';
                    
                    // Hide the form
                    forgotPasswordForm.style.display = 'none';
                } else {
                    const data = await response.json();
                    throw new Error(data.error || 'Failed to request password reset. Please try again.');
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
});
