import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';
import api, { type User, type ApiResponse } from '@/lib/api';

export interface AuthState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (userData: { username: string; email: string; password: string }) => Promise<void>;
  googleAuth: (token: string) => Promise<{ user: User; isNewUser: boolean }>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  clearError: () => void;
  fetchProfile: () => Promise<void>;
  setUser: (user: User | null) => void;

  // Reset state
  reset: () => void;
}

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      ...initialState,

      login: async (credentials) => {
        set({ isLoading: true, error: null });

        try {
          const response = await api.post<ApiResponse<{ user: User; accessToken: string }>>(
            '/auth/login',
            credentials
          );

          if (response.data.success && response.data.data) {
            const { user, accessToken } = response.data.data;

            // Store access token in cookie (refresh token is automatically set as httpOnly cookie by backend)
            Cookies.set('accessToken', accessToken, {
              expires: 1 / 96, // 15 minutes
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'strict',
            });

            set({
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          }
        } catch (error: unknown) {
          const errorMessage =
            (error as { response?: { data?: { message?: string } } }).response?.data?.message ||
            'Login failed';
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: errorMessage,
          });
          throw new Error(errorMessage);
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });

        try {
          const response = await api.post<ApiResponse<{ user: User; accessToken: string }>>(
            '/auth/register',
            userData
          );

          if (response.data.success && response.data.data) {
            const { user, accessToken } = response.data.data;

            // Store access token in cookie
            Cookies.set('accessToken', accessToken, {
              expires: 1 / 96, // 15 minutes
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'strict',
            });

            set({
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          }
        } catch (error: unknown) {
          const errorMessage =
            (error as { response?: { data?: { message?: string } } }).response?.data?.message ||
            'Registration failed';
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: errorMessage,
          });
          throw new Error(errorMessage);
        }
      },

      googleAuth: async (token: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await api.post<
            ApiResponse<{ user: User; accessToken: string; isNewUser: boolean }>
          >('/auth/google/token', { token });

          if (response.data.success && response.data.data) {
            const { user, accessToken, isNewUser } = response.data.data;

            // Store access token in cookie
            Cookies.set('accessToken', accessToken, {
              expires: 1 / 96, // 15 minutes
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'strict',
            });

            set({
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });

            return { user, isNewUser };
          }

          throw new Error('Invalid response from server');
        } catch (error: unknown) {
          const errorMessage =
            (error as { response?: { data?: { message?: string } } }).response?.data?.message ||
            'Google authentication failed';
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: errorMessage,
          });
          throw new Error(errorMessage);
        }
      },

      logout: async () => {
        set({ isLoading: true });

        try {
          await api.post('/auth/logout');
        } catch {
          // Even if logout fails on server, we should clear local state
          console.warn('Logout request failed, clearing local state anyway');
        } finally {
          // Clear tokens and state
          Cookies.remove('accessToken');
          set({
            ...initialState,
          });
        }
      },

      refreshToken: async () => {
        try {
          const response = await api.post<ApiResponse<{ accessToken: string }>>('/auth/refresh');

          if (response.data.success && response.data.data) {
            const { accessToken } = response.data.data;

            Cookies.set('accessToken', accessToken, {
              expires: 1 / 96, // 15 minutes
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'strict',
            });

            return;
          }
        } catch (error) {
          // Refresh failed, logout user
          await get().logout();
          throw error;
        }
      },

      fetchProfile: async () => {
        set({ isLoading: true, error: null });

        try {
          const response = await api.get<ApiResponse<{ user: User }>>('/auth/profile');

          if (response.data.success && response.data.data) {
            set({
              user: response.data.data.user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          }
        } catch (error: unknown) {
          const errorMessage =
            (error as { response?: { data?: { message?: string } } }).response?.data?.message ||
            'Failed to fetch profile';
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: errorMessage,
          });
        }
      },

      clearError: () => {
        set({ error: null });
      },

      setUser: (user) => {
        set({ user });
      },

      reset: () => {
        set(initialState);
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      skipHydration: true,
    }
  )
);

// Initialize auth state on app startup
export const initializeAuth = async () => {
  const { user, fetchProfile } = useAuthStore.getState();
  const accessToken = Cookies.get('accessToken');

  // If we have a token but no user data, fetch profile
  if (accessToken && !user) {
    try {
      await fetchProfile();
    } catch {
      // Token might be invalid, clear it
      Cookies.remove('accessToken');
      useAuthStore.getState().reset();
    }
  }

  // If we have user data but no token, clear state
  if (!accessToken && user) {
    useAuthStore.getState().reset();
  }
};
