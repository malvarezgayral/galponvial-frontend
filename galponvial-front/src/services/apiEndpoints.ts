// Centralized API endpoint constants
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/usuario/login',
    LOGOUT: '/usuario/logout',
    REFRESH: '/usuario/refresh',
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
    DETAIL: (id: number) => `/almacen/articulos/${id}`,
    CREATE: '/almacen',
    UPDATE: (id: string) => `/almacen/${id}`,
    DELETE: (id: number | string) => `/almacen/articulos/${id}`,
    CREATE_MOVIMIENTO: '/almacen/movimientos',
    MOVIMIENTOS: (id: string | number) => `/almacen/movimientos/${id}`,
    GRUPOS: '/almacen/grupos',
    GRUPO_DETAIL: (id: number) => `/almacen/grupos/${id}`,
    SECTORES: '/almacen/sectores',
    DELETED_ARTICLES: '/almacen/articulos/eliminados',
    RESTORE_ARTICLE: (id: number | string) => `/almacen/articulos/${id}/restaurar`,
  },
  USUARIOS: {
    LIST: '/usuario',
    DETAIL: (id: string) => `/usuario/${id}`,
    CREATE: '/usuario/register',
    UPDATE: (id: string) => `/usuario/${id}`,
    DELETE: (id: string) => `/usuario/${id}`,
  },
  AUDITORIA: {
    LIST: '/auditoria',
    DETAIL: (id: string) => `/auditoria/${id}`,
  },
} as const;

//BASE URL CONSTANT

export const BASE_API_URL_DEVELOPMENT = 'http://localhost:3000';
export const BASE_API_URL_PRODUCTION = 'https://api.galponvial.com/v1';