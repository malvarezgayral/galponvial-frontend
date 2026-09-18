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
  REPARACIONES: {
    LIST: '/reparaciones',
    DETAIL: (id: number | string) => `/reparaciones/${id}`,
    CREATE: '/reparaciones',
    UPDATE: (id: number | string) => `/reparaciones/${id}`,
    DELETE: (id: number | string) => `/reparaciones/${id}`,
  },
  PROVEEDORES: {
    LIST: '/proveedores',
    DETAIL: (id: number | string) => `/proveedores/${id}`,
    CREATE: '/proveedores',
    UPDATE: (id: number | string) => `/proveedores/${id}`,
    DELETE: (id: number | string) => `/proveedores/${id}`,
  },
  PRESUPUESTOS: {
    LIST: '/presupuestos',
    DETAIL: (id: number | string) => `/presupuestos/${id}`,
    CREATE: '/presupuestos',
    UPDATE: (id: number | string) => `/presupuestos/${id}`,
    DELETE: (id: number | string) => `/presupuestos/${id}`,
  },
  SUMINISTROS: {
    LIST: '/suministros',
    DETAIL: (id: number | string) => `/suministros/${id}`,
    CREATE: '/suministros',
    UPDATE: (id: number | string) => `/suministros/${id}`,
    DELETE: (id: number | string) => `/suministros/${id}`,
  },
  ORDENES_COMPRA: {
    LIST: '/ordenes-compra',
    DETAIL: (id: number | string) => `/ordenes-compra/${id}`,
    CREATE: '/ordenes-compra',
    UPDATE: (id: number | string) => `/ordenes-compra/${id}`,
    DELETE: (id: number | string) => `/ordenes-compra/${id}`,
  },
  LUBRICANTES: {
    LIST: '/lubricantes',
    DETAIL: (id: number | string) => `/lubricantes/${id}`,
    CREATE: '/lubricantes',
    UPDATE: (id: number | string) => `/lubricantes/${id}`,
    DELETE: (id: number | string) => `/lubricantes/${id}`,
  },
  AUDITORIA: {
    LIST: '/auditoria',
    DETAIL: (id: string) => `/auditoria/${id}`,
  },
} as const;

//BASE URL CONSTANT

export const BASE_API_URL_DEVELOPMENT = 'http://localhost:3000';
export const BASE_API_URL_PRODUCTION = 'https://api.galponvial.com/v1';
