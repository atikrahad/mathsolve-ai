import axios, { AxiosResponse, AxiosError } from 'axios';
import Cookies from 'js-cookie';

// Create axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  withCredentials: true, // Important for cookies
});

// Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  profileImage?: string;
  bio?: string;
  rankPoints: number;
  currentRank: string;
  streakCount: number;
  createdAt: string;
  lastActiveAt?: string;
}

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const response = await axios.post(`${api.defaults.baseURL}/auth/refresh`, {}, {
          withCredentials: true
        });

        if (response.data.success && response.data.data.accessToken) {
          const { accessToken } = response.data.data;
          
          // Update cookie
          Cookies.set('accessToken', accessToken, { 
            expires: 1/96, // 15 minutes
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
          });

          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        Cookies.remove('accessToken');
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;