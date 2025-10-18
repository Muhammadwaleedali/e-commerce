import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://localhost:7195',
  timeout: 15000
});

// Add a request interceptor to add the auth token
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Don't set Content-Type for FormData (multipart/form-data)
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    } else {
      config.headers['Content-Type'] = 'application/json';
    }
    
    console.log('🚀 Making request to:', config.baseURL + config.url, 'with method:', config.method.toUpperCase());
    if (token) {
      console.log('🔑 Using token:', token.substring(0, 20) + '...');
    }
    if (config.data && ['post', 'put', 'patch'].includes(config.method.toLowerCase())) {
      console.log('📦 Request payload:', config.data);
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
instance.interceptors.response.use(
  (response) => {
    console.log('Successful response from:', response.config.url);
    return response;
  },
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error Response:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
        url: error.config.url
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request setup error:', error.message);
    }

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Only redirect to login if not already on home page
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }
    
    if (error.code === 'ECONNABORTED') {
      console.error('⏰ Request timeout - Check if API server is running on https://localhost:7195');
    }
    
    return Promise.reject(error);
  }
);



export default instance; 