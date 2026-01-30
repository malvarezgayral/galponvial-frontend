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
    
    // CORRECCIÓN AQUÍ: Usar 'accessToken' en lugar de 'token'
    if (data.token) {
      localStorage.setItem('accessToken', data.token); 
      
      // Opcional: Si el backend devuelve user info, es útil guardarla también
      if (data.user) {
         localStorage.setItem('user', JSON.stringify(data.user));
      }
    }
    return data;
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } finally {
      // CORRECCIÓN AQUÍ: Remover las claves correctas
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },

  refreshToken: async (): Promise<AuthResponse> => {
    const { data } = await apiClient.post(API_ENDPOINTS.AUTH.REFRESH);
    if (data.token) {
      // CORRECCIÓN AQUÍ
      localStorage.setItem('accessToken', data.token);
    }
    return data;
  },

  isAuthenticated: (): boolean => {
    // CORRECCIÓN AQUÍ
    return !!localStorage.getItem('accessToken');
  },

  getToken: (): string | null => {
    // CORRECCIÓN AQUÍ
    return localStorage.getItem('accessToken');
  },
};