import api from './api';

const schemesService = {
  // Get all schemes (paginated, filterable, searchable)
  getSchemes: async (params = {}) => {
    try {
      const response = await api.get('/schemes/', { params });
      // Django returns { status: "success" }, but components expect { success: true }
      return { ...response.data, success: response.data.status === 'success' };
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to fetch schemes' };
    }
  },

  // Get recommended schemes based on farmer profile
  getRecommendedSchemes: async () => {
    try {
      const response = await api.get('/schemes/recommended/');
      // Map Django's 'status' string to the 'success' boolean expected by React state
      return { ...response.data, success: response.data.status === 'success' };
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to fetch recommended schemes' };
    }
  },

  // Get single scheme details
  getSchemeById: async (schemeId) => {
    try {
      const response = await api.get(`/schemes/${schemeId}/`);
      // Standardize response for component consumption
      return { ...response.data, success: response.data.status === 'success' };
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to fetch scheme details' };
    }
  },

  // Admin: Refresh schemes from external sources
  refreshSchemes: async () => {
    try {
      const response = await api.post('/admin/refresh-schemes/');
      return { ...response.data, success: response.data.status === 'success' };
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to refresh schemes' };
    }
  },

  // Admin: Get system status
  getSystemStatus: async () => {
    try {
      const response = await api.get('/admin/system-status/');
      return { ...response.data, success: response.data.status === 'success' };
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to fetch system status' };
    }
  }
};

export default schemesService;
