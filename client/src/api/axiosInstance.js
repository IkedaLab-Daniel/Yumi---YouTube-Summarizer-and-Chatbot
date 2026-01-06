import axios from 'axios';
import { API_CONFIG, ENV } from '../config/api.config';

// > Create Axios Instance with deafault config
const axiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,    
});

// > Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // > Add Auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // > Log request in development
    if (ENV.isDevelopment) {
      console.log("👀 Request:", config.method.toUpperCase(), config.url)
    }

    return config;
  },
  (error) => {
    if (ENV.isDevelopment) {
      console.log("Request Error:",error);
    }
    return Promise.reject(error) 
  }
)

// > Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // > Log successful response
    if (ENV.isDevelopment) {
      console.log('❄️ Response:', response.config.url, response.status);
    }
    return response;
  },
  (error) => {
    // > Handle errors globally
    if (error.response) {
      // > Server responsed with error status
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // > Unauthorized - clear token (it's expired)
          localStorage.removeItem('authToken');
          // > redirect to login page
          // TODO: window.location.href = "/login"
          console.error('Unauthorized access - token may be invalid/expired')
          break;
        case 403:
          console.error('Forbidden - insufficient permissions');
          break;
        case 404:
          console.error('Resource not found');
          break;
        case 500:
          console.error('Server error - please try again later');
          break;
        default:
          console.error(`Error ${status}:`, data?.message || 'Unknown error');
      }
    } else if (error.request) {
      console.error('Network error - no response from the server')
    } else {
      console.error('Request configuration error:', error.message)
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;