import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://localhost:7195/api',
  timeout: 5000
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
    
    console.log('Making request to:', config.url, 'with method:', config.method);
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
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Add a request interceptor to handle MongoDB ObjectId
instance.interceptors.request.use(
  (config) => {
    if (config.method === 'post' && config.url === '/cart/add') {
      const data = config.data;
      // Convert string ID to MongoDB ObjectId format if needed
      if (typeof data.productId === 'string' && !data.productId.match(/^[0-9a-fA-F]{24}$/)) {
        data.productId = data.productId.toString();
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance; 