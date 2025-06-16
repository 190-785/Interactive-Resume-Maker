// authService.js - Authentication API service for Login pages
const API_BASE_URL = 'http://localhost:8080'; // Spring Boot backend URL

/**
 * Makes API calls to the backend
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise} - Response from API
 */
const callApi = async (endpoint, options = {}) => {
  // Set default headers if not provided
  if (!options.headers) {
    options.headers = {
      'Content-Type': 'application/json'
    };
  }

  // Add JWT token to headers if available
  const token = localStorage.getItem('token');
  if (token) {
    options.headers.Authorization = `Bearer ${token}`;
  }

  try {
    console.log(`Making API call to: ${API_BASE_URL}${endpoint}`);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    
    // Handle HTTP errors
    if (!response.ok) {
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || `HTTP ${response.status}`;
      } catch {
        errorMessage = await response.text() || `HTTP ${response.status}`;
      }
      throw new Error(errorMessage);
    }
    
    // Parse JSON if content exists
    if (response.status !== 204) { // No content
      return await response.json();
    }
    
    return null;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Auth-related API functions
const authService = {
  login: async (username, password) => {
    return callApi('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
  },
  
  register: async (userData) => {
    // Map frontend userData to backend SignUpRequest format
    const signUpRequest = {
      username: userData.username,
      email: userData.email,
      password: userData.password,
      name: userData.fullName // Backend expects 'name' not 'fullName'
    };
    
    return callApi('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(signUpRequest)
    });
  },
  
  checkUsernameAvailability: async (username) => {
    const response = await callApi(`/api/auth/check-username?username=${encodeURIComponent(username)}`);
    if (response && !response.available) {
      throw new Error('Username is already taken');
    }
    return response;
  },
  
  checkEmailAvailability: async (email) => {
    const response = await callApi(`/api/auth/check-email?email=${encodeURIComponent(email)}`);
    if (response && !response.available) {
      throw new Error('Email is already registered');
    }
    return response;
  },
  
  getUserProfile: async () => {
    return callApi('/api/auth/user/me');
  },
  
  updateUserProfile: async (profileData) => {
    return callApi('/api/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  },
  
  uploadAvatar: async (formData) => {
    // For avatar upload, we don't set Content-Type - let the browser set it with the boundary
    return callApi('/api/users/avatar', {
      method: 'POST',
      headers: {}, // Override default headers
      body: formData
    });
  },
  
  changePassword: async (passwordData) => {
    return callApi('/api/users/password', {
      method: 'PUT',
      body: JSON.stringify(passwordData)
    });
  },
  
  forgotPassword: async (email) => {
    return callApi('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  },
  
  resetPassword: async (token, newPassword) => {
    return callApi('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword })
    });
  },
  
  verifyEmail: async (token) => {
    return callApi('/api/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token })
    });
  }
};

export default authService;