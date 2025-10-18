import axios from '../axios';

// Enhanced logging for API calls
const logApiCall = (method, url, payload = null) => {
  console.log(`🚀 API Call: ${method.toUpperCase()} ${url}`);
  if (payload && ['post', 'put', 'patch'].includes(method.toLowerCase())) {
    console.log('📦 Payload:', payload);
  }
};

// Product APIs
export const productAPI = {
  getAll: async () => {
    logApiCall('GET', '/api/Product');
    return await axios.get('/api/Product');
  },

  getById: async (id) => {
    logApiCall('GET', `/api/Product/${id}`);
    return await axios.get(`/api/Product/${id}`);
  },

  create: async (productData) => {
    logApiCall('POST', '/api/Product', productData);
    return await axios.post('/api/Product', productData);
  },

  update: async (id, productData) => {
    logApiCall('PUT', `/api/Product/${id}`, productData);
    return await axios.put(`/api/Product/${id}`, productData);
  },

  delete: async (id) => {
    logApiCall('DELETE', `/api/Product/${id}`);
    return await axios.delete(`/api/Product/${id}`);
  }
};

// Category APIs
export const categoryAPI = {
  getAll: async () => {
    logApiCall('GET', '/api/Category');
    return await axios.get('/api/Category');
  },

  getById: async (id) => {
    logApiCall('GET', `/api/Category/${id}`);
    return await axios.get(`/api/Category/${id}`);
  },

  create: async (categoryData) => {
    logApiCall('POST', '/api/Category', categoryData);
    return await axios.post('/api/Category', categoryData);
  },

  update: async (id, categoryData) => {
    logApiCall('PUT', `/api/Category/${id}`, categoryData);
    return await axios.put(`/api/Category/${id}`, categoryData);
  },

  delete: async (id) => {
    logApiCall('DELETE', `/api/Category/${id}`);
    return await axios.delete(`/api/Category/${id}`);
  }
};

// Order APIs
export const orderAPI = {
  create: async (orderData) => {
    logApiCall('POST', '/api/Order/create', orderData);
    return await axios.post('/api/Order/create', orderData);
  },

  checkout: async (checkoutData) => {
    logApiCall('POST', '/api/Order/checkout', checkoutData);
    return await axios.post('/api/Order/checkout', checkoutData);
  },

  getById: async (id) => {
    logApiCall('GET', `/api/Order/${id}`);
    return await axios.get(`/api/Order/${id}`);
  },

  getAll: async () => {
    logApiCall('GET', '/api/Order/all');
    return await axios.get('/api/Order/all');
  },

  update: async (id, orderData) => {
    logApiCall('PUT', `/api/Order/update/${id}`, orderData);
    return await axios.put(`/api/Order/update/${id}`, orderData);
  },

  cancel: async (id) => {
    logApiCall('DELETE', `/api/Order/cancel/${id}`);
    return await axios.delete(`/api/Order/cancel/${id}`);
  }
};

// Auth APIs
export const authAPI = {
  register: async (userData) => {
    logApiCall('POST', '/api/Auth/register', userData);
    return await axios.post('/api/Auth/register', userData);
  },

  login: async (credentials) => {
    logApiCall('POST', '/api/Auth/login', credentials);
    return await axios.post('/api/Auth/login', credentials);
  }
};

// Cart APIs
export const cartAPI = {
  add: async (cartItem) => {
    logApiCall('POST', '/api/Cart/add', cartItem);
    return await axios.post('/api/Cart/add', cartItem);
  },

  get: async () => {
    logApiCall('GET', '/api/Cart');
    return await axios.get('/api/Cart');
  },

  remove: async (productId) => {
    logApiCall('DELETE', `/api/Cart/remove/${productId}`);
    return await axios.delete(`/api/Cart/remove/${productId}`);
  },

  clear: async () => {
    logApiCall('DELETE', '/api/Cart/clear');
    return await axios.delete('/api/Cart/clear');
  }
};