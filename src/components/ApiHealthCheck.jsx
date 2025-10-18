import React, { useState } from 'react';
import axios from '../axios';

const ApiHealthCheck = () => {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const checkApiHealth = async () => {
    setLoading(true);
    setStatus('');
    
    try {
      console.log('Testing API connection to: https://localhost:7195');
      const response = await axios.get('/api/Product');
      setStatus(`✅ API Connected - Status: ${response.status}`);
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        setStatus('⏰ Connection Timeout - API server may be down');
      } else if (error.response) {
        setStatus(`❌ API Error: ${error.response.status} - ${error.response.statusText}`);
      } else {
        setStatus(`❌ Network Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-2">API Health Check</h3>
      <button
        onClick={checkApiHealth}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
      >
        {loading ? 'Testing...' : 'Test API Connection'}
      </button>
      {status && (
        <div className="mt-2 p-2 bg-white rounded border">
          {status}
        </div>
      )}
    </div>
  );
};

export default ApiHealthCheck;