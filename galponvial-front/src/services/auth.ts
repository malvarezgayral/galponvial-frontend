import { apiClient } from './api';
import { API_ENDPOINTS } from './apiEndpoints';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    nombre: string;
    rol: string;
  };
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } finally {
      localStorage.removeItem('token');
    }
  },

  refreshToken: async (): Promise<AuthResponse> => {
    const { data } = await apiClient.post(API_ENDPOINTS.AUTH.REFRESH);
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },

  getToken: (): string | null => {
    return localStorage.getItem('token');
  },
};
