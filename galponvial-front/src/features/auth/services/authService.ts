import { apiClient } from '@/services/api';
import type { JwtLoginResponse, ObjectServiceResponse, LoginRequest } from '../types';

/**
 * Authentication service for handling login and token management
 */
export const authService = {
  /**
   * Login user with email and password
   * @param email - User email address
   * @param password - User password
   * @returns Promise containing JWT tokens and user data
   */
  login: async (email: string, password: string): Promise<ObjectServiceResponse<JwtLoginResponse>> => {
    const { data } = await apiClient.post<ObjectServiceResponse<JwtLoginResponse>>(
      '/usuario/login',
      {
        email,
        password,
      } as LoginRequest
    );
    return data;
  },

  /**
   * Logout user by clearing stored tokens
   */
  logout: (): void => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  },

  /**
   * Self logout - user logs out themselves via API
   * @returns Promise with logout response
   */
  selfLogout: async (): Promise<void> => {
    try {
      await apiClient.post('/usuario/self-logout');
      // Remove tokens from storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    } catch (error) {
      // Even if API call fails, clear local tokens for security
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      throw error;
    }
  },

  /**
   * Get stored access token
   */
  getAccessToken: (): string | null => {
    return localStorage.getItem('accessToken');
  },

  /**
   * Refresh access token using refresh token
   * @returns Promise with new access token and user data
   */
  refreshToken: async (): Promise<ObjectServiceResponse<JwtLoginResponse>> => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const { data } = await apiClient.post<ObjectServiceResponse<JwtLoginResponse>>(
      '/usuario/refresh',
      { refreshToken }
    );
    return data;
  },
};
