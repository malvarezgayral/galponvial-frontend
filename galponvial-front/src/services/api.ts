import axios, { AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Allow sending cookies with requests
});

let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: unknown) => void; reject: (reason?: unknown) => void }> = [];

const processQueue = (error: AxiosError | null): void => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });

  failedQueue = [];
};

// Request interceptor - add auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handle errors and token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // Only attempt refresh for 401 errors and non-login/refresh endpoints
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== '/usuario/login' &&
      originalRequest.url !== '/usuario/refresh'
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => apiClient(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Try to refresh the token with refresh token from localStorage
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await axios.post(
          `${API_BASE_URL}/usuario/refresh`,
          { refreshToken },
          { withCredentials: true }
        );

        if (response.status === 201 && response.data.success && response.data.data.accessToken) {
          const newTokenData = response.data.data;
          
          // Update access token
          localStorage.setItem('accessToken', newTokenData.accessToken);
          
          // Update user data with new rol and permisos if provided
          if (newTokenData.rol) {
            const userData = JSON.parse(localStorage.getItem('user') || '{}');
            userData.rol = newTokenData.rol;
            if (newTokenData.permisos) {
              userData.permisos = newTokenData.permisos;
            }
            localStorage.setItem('user', JSON.stringify(userData));
          }
          
          apiClient.defaults.headers.common.Authorization = `Bearer ${newTokenData.accessToken}`;
          processQueue(null);
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh token expired or invalid
        processQueue(refreshError as AxiosError);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (error.response?.status === 401) {
      // Token expired and refresh failed, or couldn't attempt refresh
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);
