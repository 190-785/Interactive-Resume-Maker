// apiService.js - Corrected version
const API_BASE_URL = 'http://localhost:8080'; // Spring Boot default port, not MongoDB port

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
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    
    // Handle HTTP errors
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error (${response.status}): ${errorText}`);
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
const apiService = {
  login: async (username, password) => {
    return callApi('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
  },
  
  register: async (userData) => {
    return callApi('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },
  
  getUserProfile: async () => {
    return callApi('/api/auth/user/profile');
  },
  
  // Resume-related API functions
  getAllResumes: async () => {
    return callApi('/api/auth/resumes');
  },
  
  getResume: async (id) => {
    return callApi(`/api/auth/resumes/${id}`);
  },
  
  createResume: async (resumeData) => {
    return callApi('/api/auth/resumes', {
      method: 'POST',
      body: JSON.stringify(resumeData)
    });
  },
  
  updateResume: async (id, resumeData) => {
    return callApi(`/api/auth/resumes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(resumeData)
    });
  },
  
  deleteResume: async (id) => {
    return callApi(`/api/auth/resumes/${id}`, {
      method: 'DELETE'
    });
  }
};

export default apiService;