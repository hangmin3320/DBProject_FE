import axios from 'axios';
import Cookies from 'js-cookie';

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to update the token in the axios instance
export const setAuthToken = (token: string | null) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

// Set the initial token from cookies when the app loads
const initialToken = Cookies.get('access_token');
if (initialToken) {
  setAuthToken(initialToken);
}

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    // Token will be set via setAuthToken function when user logs in
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors (token expiration)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Check if we are already on the signin page to avoid redirect loops
      if (typeof window !== 'undefined' && window.location.pathname !== '/auth/signin') {
        console.log('Unauthorized access. Redirecting to login page.');
        
        // Clear any stale auth data
        Cookies.remove('access_token');
        // You might want to clear your auth store here as well
        // useAuthStore.getState().logout(); // Be careful with calling store actions outside components
        
        // Redirect to login
        window.location.href = '/auth/signin';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;