import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize user from local storage and verify token
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        setUser(JSON.parse(storedUser));
        // Verify token & fetch fresh profile (includes new fields)
        try {
          const res = await api.get('/auth/me/');
          const freshUser = res.data.data;
          setUser(freshUser);
          localStorage.setItem('user', JSON.stringify(freshUser));
        } catch (error) {
          console.error("Token verification failed:", error);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();

    // Listen for unauthorized events from api interceptor
    const handleUnauthorized = () => logout();
    window.addEventListener('auth-unauthorized', handleUnauthorized);
    
    return () => window.removeEventListener('auth-unauthorized', handleUnauthorized);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login/', { email, password });
      const { token, user } = res.data.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setUser(user);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || "An unexpected error occurred" 
      };
    }
  };

  const register = async (email, password, full_name) => {
    try {
      const res = await api.post('/auth/register/', { email, password, full_name });
      const { token, user } = res.data.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setUser(user);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || "Registration failed" 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  /**
   * Update profile fields — calls PUT /api/v1/profile/update/
   * Re-fetches fresh profile from MongoDB and updates context + localStorage.
   */
  const updateProfile = async (profileData) => {
    try {
      const res = await api.put('/profile/update/', profileData);
      const updatedUser = res.data.data;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return { success: true, data: updatedUser };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || "Profile update failed" 
      };
    }
  };

  /**
   * Upload profile image — POST /api/v1/profile/upload-image/
   * Returns { success, imageUrl }
   */
  const uploadProfileImage = async (imageFile) => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      const res = await api.post('/profile/upload-image/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const { image_url, user: updatedUser } = res.data.data;
      if (updatedUser) {
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
      return { success: true, imageUrl: image_url };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || "Image upload failed" 
      };
    }
  };

  /**
   * Refresh user profile from MongoDB backend
   */
  const refreshProfile = async () => {
    try {
      const res = await api.get('/profile/');
      const freshUser = res.data.data;
      localStorage.setItem('user', JSON.stringify(freshUser));
      setUser(freshUser);
      return { success: true, data: freshUser };
    } catch (error) {
      return { success: false };
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, loading, login, register, logout, 
      updateProfile, uploadProfileImage, refreshProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
