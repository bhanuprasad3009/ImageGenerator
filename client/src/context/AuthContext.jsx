import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('aetherart_token'));
  const [loading, setLoading] = useState(true);

  // Load profile if token exists
  useEffect(() => {
    const loadProfile = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get('/auth/profile');
        if (res.data.success) {
          setUser(res.data.user);
        } else {
          logout();
        }
      } catch (err) {
        console.error('Profile loading failed:', err.message);
        logout();
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [token]);

  // Login handler
  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        localStorage.setItem('aetherart_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        return { success: true };
      }
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || 'Login failed. Please check credentials.'
      };
    }
  };

  // Register handler
  const register = async (name, email, password) => {
    try {
      const res = await api.post('/auth/register', { name, email, password });
      if (res.data.success) {
        localStorage.setItem('aetherart_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        return { success: true };
      }
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || 'Registration failed. Try again.'
      };
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('aetherart_token');
    setToken(null);
    setUser(null);
  };

  // Helper to directly deduct or update user credits
  const updateCredits = (newCredits) => {
    if (user) {
      setUser(prev => ({ ...prev, credits: newCredits }));
    }
  };

  // Helper to update user plan details (e.g. after simulation or real stripe checkouts)
  const updateSubscription = (updatedUser) => {
    if (user) {
      setUser(prev => ({ ...prev, ...updatedUser }));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateCredits,
        updateSubscription
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
