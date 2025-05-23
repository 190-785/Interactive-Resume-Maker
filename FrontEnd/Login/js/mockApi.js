// This file now passes all requests through to the real backend API
// It no longer mocks any responses

// Store the original fetch function
const originalFetch = window.fetch;

// Only intercept fetch requests if we're in a development environment
// or if the backend is not available
window.fetch = async function(url, options = {}) {
    console.log('API request to:', url);
    
    // Check if the URL contains API endpoints
    if (url.includes('/api/')) {
        try {
            // Try to make the real API call first
            const response = await originalFetch(url, options);
            
            // If successful, return the response
            if (response.ok) {
                console.log('Successfully fetched from real API:', url);
                return response;
            } else {
                console.warn('API returned error status:', response.status);
                // Let it fall through to the original fetch to handle the error
                return response;
            }
        } catch (error) {
            console.error('Error connecting to real API:', error);
            // If we can't connect to the real API, log it but don't interrupt
            // Let the application handle the error
            throw error;
        }
    }
    
    // For non-API URLs, pass through to original fetch
    return originalFetch(url, options);
};

// Inform developers this file is active
console.info('API passthrough active - all requests will be sent to the real backend');
