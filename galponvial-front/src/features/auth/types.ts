export interface JwtLoginResponse {
  dni: number;
  email: string;
  nombre: string;
  apellido: string;
  rol: string;
  accessToken: string;
  refreshToken: string;
  permisos?: string[];
}

export interface ObjectServiceResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: JwtLoginResponse | null;
  loading: boolean;
  error: string | null;
}
