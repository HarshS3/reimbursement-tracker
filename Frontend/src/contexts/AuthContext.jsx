import React, { createContext, useContext, useState, useEffect } from 'react';
import client from '../api/client'; // new

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [company, setCompany] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Load stored token/profile on init
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('claimdoo_token');
      if (!token) {
        setLoadingAuth(false);
        return;
      }
      try {
        const resp = await client.get('/auth/me');
        if (resp.data && resp.data.success) {
          setUser(resp.data.user);
          setCompany(resp.data.user.company || null);
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('claimdoo_token');
        }
      } catch (err) {
        localStorage.removeItem('claimdoo_token');
      } finally {
        setLoadingAuth(false);
      }
    };
    init();
  }, []);

  const signIn = async (credentials) => {
    try {
      const resp = await client.post('/auth/login', credentials);
      if (resp.data && resp.data.user && resp.data.token) {
        localStorage.setItem('claimdoo_token', resp.data.token);
        setUser(resp.data.user);
        setCompany(resp.data.user.company || null);
        setIsAuthenticated(true);
        return { success: true, user: resp.data.user };
      }
      return { success: false, error: 'Invalid response' };
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || err.message };
    }
  };

  const signUp = async (payload) => {
    try {
      const resp = await client.post('/auth/signup', payload);
      if (resp.data && resp.data.user && resp.data.token) {
        localStorage.setItem('claimdoo_token', resp.data.token);
        setUser(resp.data.user);
        setCompany(resp.data.company || null);
        setIsAuthenticated(true);
        return { success: true, user: resp.data.user };
      }
      return { success: false, error: 'Invalid response' };
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || err.message };
    }
  };

  const signOut = () => {
    localStorage.removeItem('claimdoo_token');
    setUser(null);
    setCompany(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        company,
        isAuthenticated,
        loadingAuth,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};