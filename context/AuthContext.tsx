"use client";

import { AuthResponse, getCurrentUser, login, logout, refreshToken } from '../services/auth-service';
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

import axios from 'axios';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: AuthResponse['user'] | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  refreshAuthState: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthResponse['user'] | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshAttempted, setRefreshAttempted] = useState(false);
  const router = useRouter();

  // Function to refresh authentication state
  const refreshAuthState = useCallback(async () => {
    try {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
        try {
          const userData = await getCurrentUser();
          setUser(userData);
          return true;
        } catch (error) {
          if (!refreshAttempted) {
            setRefreshAttempted(true);
            // If fetching user data fails, attempt token refresh
            try {
              const newToken = await refreshToken();
              setToken(newToken);
              const userData = await getCurrentUser();
              setUser(userData);
              return true;
            } catch (refreshError) {
              // If refresh fails, clear auth state
              await handleLogout(false);
              return false;
            }
          } else {
            // Already attempted refresh once, clear auth state
            await handleLogout(false);
            return false;
          }
        }
      } else {
        setUser(null);
        setToken(null);
        return false;
      }
    } catch (error) {
      console.error('Failed to refresh auth state:', error);
      await handleLogout(false);
      return false;
    }
  }, [refreshAttempted]);

  // Set up axios interceptor for token refresh
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        // If error is 401 Unauthorized and we haven't tried refreshing yet
        if (error.response?.status === 401 && !originalRequest._retry && token) {
          originalRequest._retry = true;
          
          try {
            // Attempt to refresh the token
            const newToken = await refreshToken();
            // Update auth state
            setToken(newToken);
            // Update the token in the current request
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            // Retry the original request
            return axios(originalRequest);
          } catch (refreshError) {
            // If refresh fails, logout and redirect to login
            await handleLogout(true);
            return Promise.reject(refreshError);
          }
        }
        
        return Promise.reject(error);
      }
    );
    
    // Clean up interceptor on unmount
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [token]);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await refreshAuthState();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [refreshAuthState]);

  // Re-check auth state on window focus
  useEffect(() => {
    const handleFocus = async () => {
      if (!loading && !user) {
        await refreshAuthState();
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('focus', handleFocus);
      return () => {
        window.removeEventListener('focus', handleFocus);
      };
    }
  }, [loading, refreshAuthState, user]);

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await login({ email, password });
      setUser(response.user);
      setToken(response.access_token);
      setRefreshAttempted(false);
      router.push('/dashboard');
      return response;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async (redirect = true) => {
    setLoading(true);
    try {
      // Try to logout from server, but continue with local logout regardless
      try {
        await logout();
      } catch (error) {
        console.warn('Server logout encountered an issue, proceeding with local logout', error);
      }
      
      // Always clear local state
      setUser(null);
      setToken(null);
      setRefreshAttempted(false);
      
      if (redirect) {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        login: handleLogin,
        logout: handleLogout,
        loading,
        refreshAuthState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 