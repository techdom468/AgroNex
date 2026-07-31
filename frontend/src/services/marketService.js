import api from './api';

export const getStates = async () => {
  const response = await api.get('/market/states/');
  return response.data;
};

export const getDistricts = async (state) => {
  const response = await api.get('/market/districts/', { params: { state } });
  return response.data;
};

export const getCommodities = async (state, district) => {
  const response = await api.get('/market/commodities/', { params: { state, district } });
  return response.data;
};

export const getCurrentPrices = async (filters = {}) => {
  const response = await api.get('/market/current/', { params: filters });
  return response.data;
};

export const getHistoricalPrices = async (filters = {}) => {
  const response = await api.get('/market/history/', { params: filters });
  return response.data;
};

export const getPrediction = async (commodity, market) => {
  const response = await api.post('/market/predict/', { commodity, market });
  return response.data;
};
