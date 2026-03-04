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
    const isLoginRequest = originalRequest.url?.includes("/usuario/login");
    const isRefreshRequest = originalRequest.url?.includes("/usuario/refresh");
    
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isLoginRequest &&
      !isRefreshRequest
    ) {
      originalRequest._retry = true;
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
        } catch (refreshError) {
          // REFRESH FALLÓ - El refresh token venció o es inválido
          console.error("Refresh token expired or invalid", refreshError);
          
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");

          // Mostramos feedback antes de redirigir al login
          alert("Tu sesión ha expirado por seguridad. Por favor, vuelve a ingresar.");
          
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      } else {
        // NO HAY REFRESH TOKEN
        localStorage.removeItem("user");
        
        // Feedback
        alert("No se encontró una sesión activa. Redirigiendo al login...");
        
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);
