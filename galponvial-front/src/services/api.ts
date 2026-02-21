import axios, { AxiosError } from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor - add auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;
    console.log("HOLA LA RE PUTA MADRE LINEA 28");
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/usuario/refresh")
    ) {
      originalRequest._retry = true;
      console.log("HOLA LA RE PUTA MADRE");
      // Remove expired access token
      localStorage.removeItem("accessToken");

      // Try to refresh
      const refreshToken = localStorage.getItem("refreshToken");
      console.log("Attempting token refresh with refresh token:", refreshToken);
      if (refreshToken) {
        try {
          const response = await axios.post(
            `${API_BASE_URL}/usuario/refresh`,
            {},
            {
              withCredentials: true,
              headers: {
                Authorization: `Bearer ${refreshToken}`,
              },
            },
          );
          console.log("Token refreshed successfully", response.data);
          const { accessToken, rol, permisos } = response.data.data;

          // Update access token
          localStorage.setItem("accessToken", accessToken);

          // Update user data with only rol and permisos
          const userData = JSON.parse(localStorage.getItem("user") || "{}");
          userData.rol = rol;
          userData.permisos = permisos;
          localStorage.setItem("user", JSON.stringify(userData));

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        } catch {
          // Refresh failed - clear all and redirect to login
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
      } else {
        // No refresh token - redirect to login
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);
