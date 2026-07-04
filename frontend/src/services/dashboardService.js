import api from './api';

export const dashboardService = {
  getSummary: async () => {
    const response = await api.get('/dashboard/summary/');
    return response.data;
  },
  
  getRecentActivity: async () => {
    const response = await api.get('/dashboard/activity/recent/');
    return response.data;
  },
  
  getCurrentWeather: async (lat = 22.3039, lon = 70.8022, locationLabel = 'Rajkot, Gujarat') => {
    const response = await api.get('/weather/current/', {
      params: { lat, lon, location: locationLabel }
    });
    return response.data;
  },
  
  getLiveMarketPrice: async (commodity = 'Cotton') => {
    const response = await api.get('/market/live/', {
      params: { crop: commodity }
    });
    return response.data;
  },
  
  getRecommendedSchemes: async () => {
    const response = await api.get('/schemes/recommended/');
    // API returns { success: true, data: { schemes: [...] } }
    const schemes = response.data?.data?.schemes || [];
    return schemes;
  }
};
