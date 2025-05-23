// Import auth manager and utilities
import authManager from './authManager.js';
import apiService from '../../Forest_Drive/src/js/apiService.js';
import { formatDate, formatRelativeTime, getUserLocale, setUserLocale, getSupportedLocales } from './dateUtils.js';

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in using auth manager
    if (!authManager.isLoggedIn()) {
        // Redirect to login if not logged in
        window.location.href = './Login_Page.html';
        return;
    }
    
    console.log('Fetching real user data from database...');
    
    // Skip localStorage display and immediately fetch real data from server
    fetchUserData();
    
    // Add event listeners to forms
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', saveProfile);
    }
    
    const passwordForm = document.getElementById('password-form');
    if (passwordForm) {
        passwordForm.addEventListener('submit', changePassword);
    }
    
    // Handle avatar upload
    const avatarUpload = document.getElementById('avatar-upload');
    if (avatarUpload) {
        avatarUpload.addEventListener('change', uploadAvatar);
    }
    
    // Handle logout
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            authManager.logout(true);
        });
    }
    
    // Set joined date to current date if not available
    const joinedDateElement = document.getElementById('joined-date');
    if (joinedDateElement && joinedDateElement.textContent === '--') {
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        joinedDateElement.textContent = formattedDate;
    }
    
    // Add password strength validation
    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const passwordStrengthMeter = document.getElementById('password-strength-meter');
    const passwordStrengthText = document.getElementById('password-strength-text');
    const passwordMatchMessage = document.getElementById('password-match-message');
    
    if (newPasswordInput) {
        newPasswordInput.addEventListener('input', function() {
            updatePasswordStrength(this.value);
        });
    }
    
    if (confirmPasswordInput && newPasswordInput) {
        confirmPasswordInput.addEventListener('input', function() {
            checkPasswordMatch(newPasswordInput.value, this.value);
        });
    }
    
    // Initialize the language selector
    initializeLanguageSelector();
});

function displayUserDataFromLocalStorage() {
    try {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData) {
            // Update UI with user data
            const fullNameElement = document.getElementById('full-name');
            const emailElement = document.getElementById('email');
            const avatarInitialsElement = document.getElementById('avatar-initials');
            const bioElement = document.getElementById('bio');
              if (fullNameElement) {
                fullNameElement.textContent = userData.fullName || userData.username || 'No name set';
            }
            
            if (emailElement) {
                emailElement.textContent = userData.email || 'No email set';
            }
            
            if (avatarInitialsElement) {
                if (userData.fullName || userData.username) {
                    const name = userData.fullName || userData.username;
                    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
                    avatarInitialsElement.textContent = initials;
                } else {
                    avatarInitialsElement.textContent = 'U';
                }
            }
            
            // Display avatar if available
            if (userData.avatarUrl) {
                const avatarEl = document.getElementById('profile-avatar');
                if (avatarEl) {
                    avatarEl.innerHTML = `<img src="${userData.avatarUrl}" alt="Avatar">`;
                }
            }
              // Populate form fields
            const firstNameField = document.getElementById('firstName');
            const lastNameField = document.getElementById('lastName');
            const emailField = document.getElementById('emailField');
            const bioField = document.getElementById('bio');
            
            if (firstNameField && userData.fullName) {
                const nameParts = userData.fullName.split(' ');
                firstNameField.value = nameParts[0] || '';
            }
            
            if (lastNameField && userData.fullName) {
                const nameParts = userData.fullName.split(' ');
                lastNameField.value = nameParts.slice(1).join(' ') || '';
            }
            
            if (emailField) {
                emailField.value = userData.email || '';
            }
              if (bioField) {
                bioField.value = userData.bio || '';
                if (userData.bio === '') {
                    bioField.placeholder = 'Tell us a bit about yourself...';
                }
            }
        }
    } catch (error) {
        console.error('Error displaying user data from localStorage:', error);
    }
}

function fetchUserData() {
    // Use authManager to check if user is logged in
    if (!authManager.isLoggedIn()) {
        console.error('No authentication token found');
        return;
    }
    
    // Show loading indicator
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'loading-indicator';
    loadingIndicator.innerHTML = '<div class="spinner"></div><p>Loading profile data...</p>';
    document.querySelector('.profile-container').appendChild(loadingIndicator);
    
    // Use apiService to fetch user data directly from the database
    apiService.getUserProfile()
    .then(data => {
        // Remove loading indicator
        loadingIndicator.remove();
        
        // Debug output if available
        const debugApiResponse = document.getElementById('debug-api-response');
        if (debugApiResponse) {
            debugApiResponse.textContent = JSON.stringify(data, null, 2);
        }
        
        // Validate that we have the required data - never show default values
        if (!data || !data.email) {
            throw new Error('Received invalid user data from the server');
        }
        
        // Log received data for debugging
        console.log('Received user data from database:', data);
        
        // Update localStorage with the latest data from database
        const userDetails = {
            userId: data.id || data.userId,
            username: data.username,
            email: data.email,
            fullName: data.fullName,
            bio: data.bio || '',
            joinedAt: data.joinedAt,
            avatarUrl: data.avatarUrl
        };
        
        // Update auth manager with real database data
        authManager.updateUserData(userDetails);
        
        // Update UI with data from database
        updateProfileUI(data);
    })
    .catch(error => {
        // Remove loading indicator
        loadingIndicator.remove();
        
        console.error('Error fetching user data from database:', error);
        showNotification('Failed to load profile data from database. Please try refreshing the page.', 'error');
    });
}

function updateProfileUI(data) {
    // Only update if we have valid data from the database
    if (!data) {
        console.error('No data provided to updateProfileUI');
        return;
    }
    
    // Get user name (prefer fullName, fallback to username)
    const name = data.fullName || data.username;
    
    // Get DOM elements
    const fullNameElement = document.getElementById('full-name');
    const emailElement = document.getElementById('email');
    const avatarInitialsElement = document.getElementById('avatar-initials');
    const joinedDateElement = document.getElementById('joined-date');
    const firstNameField = document.getElementById('firstName');
    const lastNameField = document.getElementById('lastName');
    const emailField = document.getElementById('emailField');
    const bioField = document.getElementById('bio');
    
    // Update name in header
    if (fullNameElement && name) {
        fullNameElement.textContent = name;
    }
    
    // Update email in header - email should never be empty as it's required for registration
    if (emailElement && data.email) {
        emailElement.textContent = data.email;
    }
    
    // Update avatar with proper sizing
    if (data.avatarUrl) {
        const avatarEl = document.getElementById('profile-avatar');
        if (avatarEl) {
            // Use CSS classes instead of inline styles for better maintainability
            avatarEl.innerHTML = `<img src="${data.avatarUrl}" alt="Avatar">`;
            
            // Hide initials when there's an avatar
            if (avatarInitialsElement) {
                avatarInitialsElement.style.display = 'none';
            }
        }
    } else if (avatarInitialsElement && name) {
        // Show initials if no avatar
        avatarInitialsElement.style.display = 'flex';
        const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
        avatarInitialsElement.textContent = initials;
    }
    
    // Update joined date
    if (joinedDateElement) {
        if (data.joinedAt) {
            // Use our internationalized date formatter
            joinedDateElement.textContent = formatDate(data.joinedAt);
            // Add relative time as a tooltip
            joinedDateElement.title = formatRelativeTime(data.joinedAt);
        } else {
            // Set current date if joinedAt is not provided
            const currentDate = new Date();
            joinedDateElement.textContent = formatDate(currentDate);
        }
    }
    
    // Populate form fields with name parts
    if (firstNameField && data.fullName) {
        const nameParts = data.fullName.split(' ');
        firstNameField.value = nameParts[0] || '';
    }
    
    if (lastNameField && data.fullName) {
        const nameParts = data.fullName.split(' ');
        lastNameField.value = nameParts.slice(1).join(' ') || '';
    }
    
    // Populate email field - should never be empty
    if (emailField && data.email) {
        emailField.value = data.email;
    }
    
    // Populate bio field
    if (bioField) {
        bioField.value = data.bio || '';
        if (!data.bio) {
            bioField.placeholder = 'Tell us a bit about yourself...';
        }
    }
    
    // Debug info display
    const debugUserData = document.getElementById('debug-user-data');
    if (debugUserData) {
        debugUserData.textContent = JSON.stringify(data, null, 2);
    }
}

function saveProfile(event) {
    event.preventDefault();
    
    if (!authManager.isLoggedIn()) {
        showNotification('You must be logged in to update your profile', 'error');
        return;
    }
    
    // Get form values
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('emailField').value.trim();
    const bio = document.getElementById('bio').value.trim();
    
    // Form validation
    const errors = [];
    
    if (!firstName) {
        errors.push('First name is required');
    } else if (firstName.length < 2) {
        errors.push('First name must be at least 2 characters');
    }
    
    if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errors.push('Please enter a valid email address');
        }
    } else {
        errors.push('Email is required');
    }
    
    // Bio length validation
    if (bio.length > 500) {
        errors.push('Bio must be less than 500 characters');
    }
    
    // Show errors if any
    if (errors.length > 0) {
        showNotification(errors.join('\n'), 'error');
        return;
    }
    
    const fullName = `${firstName} ${lastName}`.trim();
    
    const payload = {
        fullName,
        email,
        bio
    };
    
    // Show loading indicator
    const saveButton = event.target.querySelector('button[type="submit"]');
    const originalButtonText = saveButton.textContent;
    saveButton.innerHTML = '<span class="spinner-small"></span> Saving...';
    saveButton.disabled = true;
    
    // Disable all form inputs while saving
    const formInputs = event.target.querySelectorAll('input, textarea');
    formInputs.forEach(input => input.disabled = true);
    
    // Use apiService to update profile
    apiService.updateUserProfile(payload)
    .then(data => {
        // Update localStorage with updated user data
        const userData = JSON.parse(localStorage.getItem('user')) || {};
        userData.fullName = fullName;
        userData.email = email;
        userData.bio = bio;
        
        // Update the authentication manager user data
        authManager.updateUserData(userData);
        
        // Update UI elements
        updateProfileUI(userData);
        
        // Show success notification
        showNotification('Profile updated successfully', 'success');
    })
    .catch(error => {
        console.error('Error updating profile:', error);
        showNotification(error.message || 'Failed to update profile', 'error');
    })
    .finally(() => {
        // Restore button state
        saveButton.innerHTML = originalButtonText;
        saveButton.disabled = false;
        
        // Re-enable all form inputs
        formInputs.forEach(input => input.disabled = false);
    });
}

function changePassword(event) {
    event.preventDefault();
    
    if (!authManager.isLoggedIn()) {
        showNotification('You must be logged in to change your password', 'error');
        return;
    }
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Password validation
    const errors = [];
    
    if (!currentPassword) {
        errors.push('Current password is required');
    }
    
    if (!newPassword) {
        errors.push('New password is required');
    } else {
        // Password strength validation
        const hasMinLength = newPassword.length >= 8;
        const hasUpperCase = /[A-Z]/.test(newPassword);
        const hasLowerCase = /[a-z]/.test(newPassword);
        const hasNumbers = /\d/.test(newPassword);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
        
        if (!hasMinLength) {
            errors.push('Password must be at least 8 characters long');
        }
        
        // Check if password meets at least 3 of the 4 criteria
        let strengthCount = 0;
        if (hasUpperCase) strengthCount++;
        if (hasLowerCase) strengthCount++;
        if (hasNumbers) strengthCount++;
        if (hasSpecialChar) strengthCount++;
        
        if (strengthCount < 3) {
            errors.push('Password must contain at least 3 of the following: uppercase letters, lowercase letters, numbers, and special characters');
        }
    }
    
    if (newPassword !== confirmPassword) {
        errors.push('New passwords do not match');
    }
    
    // Show errors if any
    if (errors.length > 0) {
        showNotification(errors.join('\n'), 'error');
        return;
    }
      // Show loading indicator
    const saveButton = event.target.querySelector('button[type="submit"]');
    const originalButtonText = saveButton.textContent;
    saveButton.innerHTML = '<span class="spinner-small"></span> Updating...';
    saveButton.disabled = true;
    
    // Disable all form inputs while saving
    const formInputs = event.target.querySelectorAll('input');
    formInputs.forEach(input => input.disabled = true);
    
    // Use apiService to change password
    apiService.changePassword({ currentPassword, newPassword })
        .then(data => {
            showNotification('Password updated successfully!', 'success');
        // Clear the password fields
        document.getElementById('currentPassword').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';
        
        // Reset the password strength meter
        updatePasswordStrength('');
        
        // Reset the password match message
        const passwordMatchMessage = document.getElementById('password-match-message');
        if (passwordMatchMessage) {
            passwordMatchMessage.textContent = '';
            passwordMatchMessage.className = 'validation-message';
        }    })
    .catch(error => {
        console.error('Error updating password:', error);
        showNotification(error.message || 'Failed to update password', 'error');
    })
    .finally(() => {
        // Restore button state
        saveButton.innerHTML = originalButtonText;
        saveButton.disabled = false;
        
        // Re-enable all form inputs
        formInputs.forEach(input => input.disabled = false);
    });
}

function uploadAvatar(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validate file type
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validImageTypes.includes(file.type)) {
        showNotification('Please select a valid image file (JPEG, PNG, GIF, or WEBP)', 'error');
        // Reset the file input
        event.target.value = '';
        return;
    }
    
    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
        showNotification('Image is too large. Maximum size is 5MB.', 'error');
        // Reset the file input
        event.target.value = '';
        return;
    }
    
    // Show loading state
    const avatarEl = document.getElementById('profile-avatar');
    const initialsEl = document.getElementById('avatar-initials');
    if (avatarEl) {
        avatarEl.innerHTML = '<div class="avatar-loading"></div>';
    }
    
    // Hide initials while loading
    if (initialsEl) {
        initialsEl.style.display = 'none';
    }
    
    // Read the file and create a preview
    const reader = new FileReader();
    reader.onload = function(e) {
        // Create image object to check dimensions
        const img = new Image();
        img.onload = function() {
            // Prepare form data for upload
            const formData = new FormData();
            formData.append('avatar', file);
            
            // Use apiService to upload avatar
            apiService.uploadAvatar(formData)
                .then(data => {
                    // Update localStorage with new avatar URL
                    const userData = JSON.parse(localStorage.getItem('user')) || {};
                    userData.avatarUrl = data.avatarUrl || e.target.result; // Use server URL or local preview
                    
                    // Update auth manager
                    authManager.updateUserData(userData);
                    
                    // Update UI
                    if (avatarEl) {
                        // Use proper sizing for the avatar image
                        avatarEl.innerHTML = `<img src="${userData.avatarUrl}" alt="Avatar">`;
                    }
                    
                    // Hide initials when there's an avatar
                    if (initialsEl) {
                        initialsEl.style.display = 'none';
                    }
                    
                    showNotification('Avatar updated successfully', 'success');
                    
                    // Refresh the debug data
                    const debugUserData = document.getElementById('debug-user-data');
                    if (debugUserData) {
                        debugUserData.textContent = JSON.stringify(userData, null, 2);
                    }
                })
                .catch(error => {
                    console.error('Error uploading avatar:', error);
                    
                    // Show the initials if avatar upload fails
                    if (initialsEl) {
                        initialsEl.style.display = 'flex';
                    }
                    
                    // Fallback to client-side preview as temporary solution
                    if (avatarEl) {
                        avatarEl.innerHTML = `<img src="${e.target.result}" alt="Avatar">`;
                        showNotification('Server error: Avatar is displayed as a preview only and will not be saved permanently.', 'error');
                    }
                });
        };
        
        img.onerror = function() {
            // Reset avatar if image is invalid
            if (avatarEl) {
                avatarEl.innerHTML = '';
            }
            
            // Show initials if there was an error
            if (initialsEl) {
                initialsEl.style.display = 'flex';
            }
            
            showNotification('Error reading the image file', 'error');
        };
        
        img.src = e.target.result;
    };
    
    reader.onerror = function() {
        console.error('FileReader error:', reader.error);
        showNotification('Error reading the image file', 'error');
        
        // Reset avatar on error
        if (avatarEl) {
            avatarEl.innerHTML = '';
        }
        
        // Show initials if there was an error
        if (initialsEl) {
            initialsEl.style.display = 'flex';
        }
    };
    
    reader.readAsDataURL(file);
    
    // Reset the file input for future uploads
    event.target.value = '';
}

// Initialize the language selector
function initializeLanguageSelector() {
    const languageSelector = document.getElementById('language-selector');
    if (!languageSelector) return;
    
    // Get supported locales and current locale
    const supportedLocales = getSupportedLocales();
    const currentLocale = getUserLocale();
    
    // Populate the selector
    Object.entries(supportedLocales).forEach(([code, name]) => {
        const option = document.createElement('option');
        option.value = code;
        option.textContent = name;
        option.selected = code === currentLocale;
        languageSelector.appendChild(option);
    });
    
    // Add change event listener
    languageSelector.addEventListener('change', function() {
        const selectedLocale = this.value;
        setUserLocale(selectedLocale);
        
        // Update the displayed dates
        const joinedDateElement = document.getElementById('joined-date');
        if (joinedDateElement) {
            const userData = authManager.getUserData();
            if (userData && userData.joinedAt) {
                joinedDateElement.textContent = formatDate(userData.joinedAt, selectedLocale);
                joinedDateElement.title = formatRelativeTime(userData.joinedAt, selectedLocale);
            }
        }
        
        // Notify the user
        alert(`Language and region preferences updated to ${supportedLocales[selectedLocale]}`);
    });
}

// Function to check password strength
function updatePasswordStrength(password) {
    const passwordStrengthMeter = document.getElementById('password-strength-meter');
    const passwordStrengthText = document.getElementById('password-strength-text');
    
    if (!passwordStrengthMeter || !passwordStrengthText) return;
    
    // Remove all existing classes
    passwordStrengthMeter.className = 'strength-meter-bar';
    
    if (!password) {
        passwordStrengthText.textContent = 'Password strength';
        return;
    }
    
    // Calculate password strength
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    
    // Complexity checks
    if (/[A-Z]/.test(password)) strength += 1; // Has uppercase
    if (/[a-z]/.test(password)) strength += 1; // Has lowercase
    if (/\d/.test(password)) strength += 1;    // Has number
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1; // Has special char
    
    // Set the appropriate class and text based on strength
    let strengthClass, strengthText;
    
    if (password.length < 6) {
        strengthClass = 'very-weak';
        strengthText = 'Very weak';
    } else if (strength < 3) {
        strengthClass = 'weak';
        strengthText = 'Weak';
    } else if (strength < 4) {
        strengthClass = 'medium';
        strengthText = 'Medium';
    } else if (strength < 6) {
        strengthClass = 'strong';
        strengthText = 'Strong';
    } else {
        strengthClass = 'very-strong';
        strengthText = 'Very strong';
    }
    
    passwordStrengthMeter.classList.add(strengthClass);
    passwordStrengthText.textContent = strengthText;
}

// Function to check if passwords match
function checkPasswordMatch(password, confirmPassword) {
    const passwordMatchMessage = document.getElementById('password-match-message');
    
    if (!passwordMatchMessage) return;
    
    if (!confirmPassword) {
        passwordMatchMessage.textContent = '';
        passwordMatchMessage.className = 'validation-message';
        return;
    }
    
    if (password === confirmPassword) {
        passwordMatchMessage.textContent = 'Passwords match';
        passwordMatchMessage.className = 'validation-message success';
    } else {
        passwordMatchMessage.textContent = 'Passwords do not match';
        passwordMatchMessage.className = 'validation-message error';
    }
}

/**
 * Displays a notification message to the user
 * @param {string} message - The message to display
 * @param {string} type - The type of notification (success, error, info)
 * @param {number} duration - How long to show the notification (in ms)
 */
function showNotification(message, type = 'info', duration = 5000) {
    // Check if notification container exists, create if not
    let notificationContainer = document.querySelector('.notification-container');
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-message">${message}</div>
        <button class="notification-close">&times;</button>
    `;
    
    // Add close button functionality
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        notification.classList.add('notification-closing');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Add notification to container
    notificationContainer.appendChild(notification);
    
    // Auto-remove after duration
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.add('notification-closing');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, duration);
}
