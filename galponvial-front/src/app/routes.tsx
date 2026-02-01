export const ROUTES = {
  home: "/",
  vehiculos: "/vehiculos",
  vehiculoDetalles: (id: number) => `/vehiculos/${id}`,
  almacen: "/almacen",
  usuarios: "/usuarios",
  auditoria: "/auditoria",
  login: "/login",
  articuloDetallesRoute: "/almacen/:id", 
  articuloDetalles: (id: number) => `/almacen/${id}`,
} as const;
