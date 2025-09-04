import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL 
  || (process.env.NODE_ENV === 'production' 
    ? '/api'
    : 'http://localhost:5001');

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const apiService = {
  // Health check
  healthCheck: () => api.get('/'),

  // Analysis endpoints
  getAnalysisOverview: () => api.get('/api/analysis/overview'),
  getEventPerformance: () => api.get('/api/analysis/event-performance'),
  getStandPerformance: () => api.get('/api/analysis/stand-performance'),
  getHistoricalData: () => api.get('/api/historical-data'),

  // Predictions
  getMarch5Predictions: () => api.get('/api/predictions/march5'),
  
  // Staffing
  getStaffingRecommendations: () => api.get('/api/staffing/recommendations'),
  
  // Risk Assessment
  getRiskAssessment: () => api.get('/api/risk-assessment'),
};

export default api; 