import api from './api';

export const getLivePrices = async (filters = {}) => {
  const response = await api.get('/market/live/', { params: filters });
  return response.data;
};

export const getPriceHistory = async (crop, days = 30) => {
  const response = await api.get('/market/history/', { params: { crop, days } });
  return response.data;
};

export const getMarketPrediction = async (crop) => {
  const response = await api.get('/market/predict/', { params: { crop } });
  return response.data;
};

export const getMarketRecommendation = async (crop) => {
  const response = await api.get('/market/recommendation/', { params: { crop } });
  return response.data;
};
