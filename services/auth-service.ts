import axios, { AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add timeout to prevent hanging requests
  timeout: 10000,
});

// Add memory cache for tokens to reduce localStorage access
const tokenCache = {
  accessToken: null as string | null,
  refreshToken: null as string | null,
  getAccessToken: () => {
    if (!tokenCache.accessToken) {
      tokenCache.accessToken = localStorage.getItem('token');
    }
    return tokenCache.accessToken;
  },
  getRefreshToken: () => {
    if (!tokenCache.refreshToken) {
      tokenCache.refreshToken = localStorage.getItem('refresh_token');
    }
    return tokenCache.refreshToken;
  },
  setAccessToken: (token: string | null) => {
    tokenCache.accessToken = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  },
  setRefreshToken: (token: string | null) => {
    tokenCache.refreshToken = token;
    if (token) {
      localStorage.setItem('refresh_token', token);
    } else {
      localStorage.removeItem('refresh_token');
    }
  },
  clearTokens: () => {
    tokenCache.accessToken = null;
    tokenCache.refreshToken = null;
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
  }
};

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  username: string;
  password: string;
  full_name?: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: {
    id: string;
    email: string;
    username: string;
    full_name?: string;
  };
}

export interface ApiError {
  message: string;
  status: number;
}

const handleApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    return {
      message: axiosError.response?.data?.detail || 'An error occurred',
      status: axiosError.response?.status || 500,
    };
  }
  return {
    message: 'An unexpected error occurred',
    status: 500,
  };
};

// Add token to requests if it exists - using the memory cache for better performance
api.interceptors.request.use((config) => {
  const token = tokenCache.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Let's add a response interceptor to handle token refreshing
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Function to add callback to array
const subscribeTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

// Function to call all stored callbacks
const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't tried refreshing token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, wait for new token
        return new Promise<string>((resolve) => {
          subscribeTokenRefresh((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        onTokenRefreshed(newToken);
        return api(originalRequest);
      } catch (error) {
        tokenCache.clearTokens();
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export const signup = async (credentials: SignupCredentials): Promise<{ message: string }> => {
  try {
    const response = await api.post('/auth/signup', credentials);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    // Convert to form data format for OAuth2 compatibility
    const formData = new URLSearchParams();
    formData.append('username', credentials.email);
    formData.append('password', credentials.password);

    const response = await api.post('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    
    const { access_token, refresh_token, user } = response.data;
    tokenCache.setAccessToken(access_token);
    tokenCache.setRefreshToken(refresh_token);
    
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const refreshToken = async (): Promise<string> => {
  try {
    const refreshToken = tokenCache.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await api.post('/auth/refresh', { token: refreshToken });
    const { access_token } = response.data;
    tokenCache.setAccessToken(access_token);
    
    return access_token;
  } catch (error) {
    tokenCache.clearTokens();
    throw handleApiError(error);
  }
};

export const logout = async (): Promise<void> => {
  try {
    await api.post('/auth/logout');
    tokenCache.clearTokens();
  } catch (error) {
    // Ensure tokens are removed even if server-side logout fails
    tokenCache.clearTokens();
    throw handleApiError(error);
  }
};

export const getCurrentUser = async (): Promise<AuthResponse['user']> => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}; 