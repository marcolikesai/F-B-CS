import axios from 'axios';
import mockData from '../data/mockData.json';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL 
  || (process.env.NODE_ENV === 'production' 
    ? '/api'
    : 'http://localhost:5001');

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000, // Reduced timeout for faster fallback
  headers: {
    'Content-Type': 'application/json',
  },
});

// Use static data by default in production for faster loading
const useStaticData = process.env.NODE_ENV === 'production';

// Helper to get data with instant static fallback in production
const getDataWithFallback = async (endpoint, fallbackData) => {
  if (useStaticData) {
    // In production, use static data immediately for fast loading
    return { data: fallbackData };
  }
  
  try {
    // In development, try backend first
    const response = await api.get(endpoint);
    return response;
  } catch (error) {
    console.log(`Backend not available for ${endpoint}, using static data`);
    return { data: fallbackData };
  }
};

const apiService = {
  // Analysis endpoints
  getAnalysisOverview: () => getDataWithFallback('/api/analysis/overview', mockData.overview),
  
  getEventPerformance: () => getDataWithFallback('/api/analysis/event-performance', mockData.event_performance),
  
  getStandPerformance: () => getDataWithFallback('/api/analysis/stand-performance', mockData.stand_performance),
  
  // Predictions
  getMarch5Predictions: () => getDataWithFallback('/api/predictions/march5', mockData.march5_predictions),
  
  // Staffing
  getStaffingRecommendations: () => getDataWithFallback('/api/staffing/recommendations', mockData.staffing_recommendations),
  
  // Historical data
  getHistoricalData: () => getDataWithFallback('/api/historical-data', mockData.historical_data),
  
  // Risk assessment
  getRiskAssessment: () => getDataWithFallback('/api/risk-assessment', mockData.risk_assessment),
};

export default apiService;
export { apiService }; 