import api from './api';

export const weatherService = {
  getCurrentWeather: async (lat, lon, location, forceRefresh = false) => {
    try {
      const response = await api.get('/weather/current/', {
        params: { lat, lon, location, refresh: forceRefresh }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getWeatherHistory: async () => {
    try {
      const response = await api.get('/weather/history/');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};
