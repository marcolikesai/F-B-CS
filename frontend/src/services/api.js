import axios from 'axios';
import mockData from '../data/mockData.json';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL 
  || (process.env.NODE_ENV === 'production' 
    ? '/api'
    : 'http://localhost:5001');

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fallback to static data if backend is not available
let useStaticData = false;

const checkBackendAvailable = async () => {
  try {
    await api.get('/', { timeout: 2000 });
    return true;
  } catch (error) {
    console.log('Backend not available, using static data');
    useStaticData = true;
    return false;
  }
};

// Initialize backend check
checkBackendAvailable();

// Helper to get data with fallback
const getDataWithFallback = async (endpoint, staticDataPath) => {
  if (useStaticData) {
    const data = staticDataPath.split('.').reduce((obj, key) => obj?.[key], mockData);
    return { data };
  }
  
  try {
    return await api.get(endpoint);
  } catch (error) {
    console.log(`API error for ${endpoint}, falling back to static data`);
    useStaticData = true;
    const data = staticDataPath.split('.').reduce((obj, key) => obj?.[key], mockData);
    return { data };
  }
};

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    if (!useStaticData) {
      console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    }
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
    console.error('API Error:', error.message);
    if (error.code === 'ECONNREFUSED' || error.code === 'NETWORK_ERROR') {
      useStaticData = true;
    }
    return Promise.reject(error);
  }
);

const apiService = {
  // Analysis endpoints
  getAnalysisOverview: () => getDataWithFallback('/api/analysis/overview', 'overview'),
  
  getEventPerformance: () => getDataWithFallback('/api/analysis/event-performance', 'event_performance'),
  
  getStandPerformance: () => getDataWithFallback('/api/analysis/stand-performance', 'stand_performance'),
  
  // Predictions
  getMarch5Predictions: () => getDataWithFallback('/api/predictions/march5', 'march5_predictions'),
  
  // Staffing
  getStaffingRecommendations: () => getDataWithFallback('/api/staffing/recommendations', 'staffing_recommendations'),
  
  // Risk assessment
  getRiskAssessment: () => getDataWithFallback('/api/risk-assessment', 'risk_assessment'),
  
  // Historical data
  getHistoricalData: () => getDataWithFallback('/api/historical-data', 'historical_data'),
  
  // Health check
  healthCheck: async () => {
    if (useStaticData) {
      return { data: { status: 'ok', message: 'Using static data', mode: 'static' } };
    }
    try {
      return await api.get('/');
    } catch (error) {
      useStaticData = true;
      return { data: { status: 'ok', message: 'Using static data', mode: 'static' } };
    }
  }
};

export default apiService;
export { apiService }; 