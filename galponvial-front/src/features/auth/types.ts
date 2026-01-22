export interface JwtLoginResponse {
  email: string;
  rol: string;
  accessToken: string;
  refreshToken: string;
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
