'use client';

import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser, login, logout, signup } from '@/services/auth-service';

import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  username: string;
  full_name?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: {
    email: string;
    username: string;
    password: string;
    full_name?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check if token exists in local storage
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        // Token exists, try to get user data
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (err) {
        // Clear invalid tokens
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      setError(null);
      const response = await login({ email, password });
      setUser(response.user);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to login');
      throw err;
    }
  };

  const handleSignup = async (data: {
    email: string;
    username: string;
    password: string;
    full_name?: string;
  }) => {
    try {
      setError(null);
      await signup(data);
      router.push('/login?registered=true');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
      throw err;
    }
  };

  const handleLogout = async () => {
    try {
      setError(null);
      await logout();
      setUser(null);
      router.push('/login');
    } catch (err: any) {
      console.error('Logout error:', err);
      // Still clear user data even if the server request fails
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      setUser(null);
      router.push('/login');
    }
  };

  const value = {
    user,
    loading,
    error,
    login: handleLogin,
    signup: handleSignup,
    logout: handleLogout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 