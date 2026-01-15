// Centralized API endpoint constants
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },
  VEHICULOS: {
    LIST: '/vehiculos',
    DETAIL: (id: string) => `/vehiculos/${id}`,
    CREATE: '/vehiculos',
    UPDATE: (id: string) => `/vehiculos/${id}`,
    DELETE: (id: string) => `/vehiculos/${id}`,
  },
  ALMACEN: {
    LIST: '/almacen',
    DETAIL: (id: string) => `/almacen/${id}`,
    CREATE: '/almacen',
    UPDATE: (id: string) => `/almacen/${id}`,
    DELETE: (id: string) => `/almacen/${id}`,
  },
  USUARIOS: {
    LIST: '/usuarios',
    DETAIL: (id: string) => `/usuarios/${id}`,
    CREATE: '/usuarios',
    UPDATE: (id: string) => `/usuarios/${id}`,
    DELETE: (id: string) => `/usuarios/${id}`,
  },
  AUDITORIA: {
    LIST: '/auditoria',
    DETAIL: (id: string) => `/auditoria/${id}`,
  },
} as const;
