export const ROUTES = {
  home: "/",
  vehiculos: "/vehiculos",
  vehiculoDetalles: (id: number) => `/vehiculos/${id}`,
  almacen: "/almacen",
  articuloDetalles: (id: number) => `/almacen/${id}`,
  usuarios: "/usuarios",
  auditoria: "/auditoria",
  login: "/login",
} as const;
