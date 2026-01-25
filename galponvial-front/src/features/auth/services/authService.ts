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
    localStorage.removeItem('user');
    document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  },

  /**
   * Get stored access token
   */
  getAccessToken: (): string | null => {
    return localStorage.getItem('accessToken');
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('accessToken');
  },
};
