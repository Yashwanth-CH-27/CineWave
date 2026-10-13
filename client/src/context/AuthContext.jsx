import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('cinewave_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('cinewave_token') || null);
  const [loading, setLoading] = useState(true);

  // Sync state with server on mount if token exists
  useEffect(() => {
    async function loadUser() {
      if (token) {
        try {
          const res = await authAPI.getMe();
          if (res.data.success && res.data.user) {
            setUser(res.data.user);
            localStorage.setItem('cinewave_user', JSON.stringify(res.data.user));
          }
        } catch (error) {
          console.warn('Initial session check failed, signing out:', error.message);
          logout();
        }
      }
      setLoading(false);
    }
    loadUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    if (res.data.success) {
      const { token: newToken, user: newUser } = res.data;
      setToken(newToken);
      setUser(newUser);
      localStorage.setItem('cinewave_token', newToken);
      localStorage.setItem('cinewave_user', JSON.stringify(newUser));
      return { success: true, user: newUser };
    }
    return { success: false, message: res.data.message };
  };

  const signup = async (name, email, password, role) => {
    const res = await authAPI.signup({ name, email, password, role });
    if (res.data.success) {
      const { token: newToken, user: newUser } = res.data;
      setToken(newToken);
      setUser(newUser);
      localStorage.setItem('cinewave_token', newToken);
      localStorage.setItem('cinewave_user', JSON.stringify(newUser));
      return { success: true, user: newUser };
    }
    return { success: false, message: res.data.message };
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('cinewave_token');
    localStorage.removeItem('cinewave_user');
  };

  const refreshUser = async () => {
    try {
      const res = await authAPI.getMe();
      if (res.data.success && res.data.user) {
        setUser(res.data.user);
        localStorage.setItem('cinewave_user', JSON.stringify(res.data.user));
        return res.data.user;
      }
    } catch (err) {
      console.warn('Failed to refresh user:', err.message);
    }
    return null;
  };

  const updateProfile = async (name) => {
    const res = await authAPI.updateProfile({ name });
    if (res.data.success) {
      setUser(res.data.user);
      localStorage.setItem('cinewave_user', JSON.stringify(res.data.user));
      return { success: true };
    }
    return { success: false, message: res.data.message };
  };

  const value = {
    user,
    token,
    loading,
    isLoggedIn: Boolean(user && token),
    isCreator: user?.role === 'CREATOR',
    isPremium: Boolean(user?.isPremium),
    login,
    signup,
    logout,
    refreshUser,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
