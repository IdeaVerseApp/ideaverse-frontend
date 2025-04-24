"use client";

import { AuthResponse, getCurrentUser, login, logout, refreshToken } from '../services/auth-service';
import React, { createContext, useContext, useEffect, useState } from 'react';

import axios from 'axios';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: AuthResponse['user'] | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthResponse['user'] | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
            // Update the token in the current request
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            // Retry the original request
            return axios(originalRequest);
          } catch (refreshError) {
            // If refresh fails, logout and redirect to login
            await handleLogout();
            router.push('/login');
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
  }, [token, router]);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
          setToken(storedToken);
          try {
            const userData = await getCurrentUser();
            setUser(userData);
          } catch (error) {
            // If fetching user data fails, attempt token refresh
            try {
              await refreshToken();
              const userData = await getCurrentUser();
              setUser(userData);
            } catch (refreshError) {
              // If refresh fails, clear tokens
              localStorage.removeItem('token');
              localStorage.removeItem('refresh_token');
            }
          }
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await login({ email, password });
      setUser(response.user);
      setToken(response.access_token);
      router.push('/dashboard');
      return response;
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setUser(null);
      setToken(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        login: handleLogin,
        logout: handleLogout,
        loading,
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