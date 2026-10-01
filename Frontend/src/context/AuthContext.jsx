import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  // Login: calls backend POST /auth/login
  // Backend returns: { token, email, userName, role }
  const login = async ({ email, password }) => {
    const data = await authService.login({ email, password });

    if (data.error) {
      throw new Error(data.error);
    }

    const user = {
      email: data.email,
      name: data.userName,
      role: data.role?.toLowerCase() || 'user',
    };

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    return { user, token: data.token };
  };

  // Logout: calls backend POST /auth/logout
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // ignore errors on logout
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
