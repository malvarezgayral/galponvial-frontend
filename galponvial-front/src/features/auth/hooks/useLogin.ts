import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import type { JwtLoginResponse } from '../types';
import { useAppStore } from '@/app/stores/appStore';

interface UseLoginReturn {
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  clearError: () => void;
}

/**
 * Custom hook for handling user login
 * @returns Object with loading state, error, login function and clearError function
 */
export const useLogin = (): UseLoginReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setUser } = useAppStore();

  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.login(email, password);

      if (!response.success) {
        setError(response.message || 'Error al iniciar sesión');
        return;
      }

      // Store tokens and user data
      const userData: JwtLoginResponse = response.data;
      localStorage.setItem('accessToken', userData.accessToken);
      localStorage.setItem('refreshToken', userData.refreshToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Convert permisos from strings to Permission objects if they exist
      const userWithPermisos = {
        email: userData.email,
        rol: userData.rol,
        dni: userData.dni,
        nombre: userData.nombre,
        apellido: userData.apellido,
        permisos: (userData.permisos || []).map((nombre) => ({
          id: '',
          nombre,
          descripcion: '',
          modulo: 'almacen' as const,
          accion: 'crear' as const,
        })),
        fechaCreacion: new Date().toISOString()
      };
      setUser(userWithPermisos);

      // Store refresh token in HttpOnly cookie (sent by backend via Set-Cookie header)
      // This is handled automatically by axios

      // Redirect to home page on successful login
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const clearError = (): void => {
    setError(null);
  };

  return { loading, error, login, clearError };
};