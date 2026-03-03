export const ROUTES = {
  home: "/",
  vehiculos: "/vehiculos",
  vehiculoDetalles: (id: number) => `/vehiculos/${id}`,
  almacen: "/almacen",
  servicios: "/servicios",
  usuarios: "/usuarios",
  auditoria: "/auditoria",
  login: "/login",
  articuloDetallesRoute: "/almacen/:id", 
  articuloDetalles: (id: number) => `/almacen/${id}`,
  grupoDetalles: (id: string | number) => `/almacen/grupos/${id}`,
  articulosEliminados: "/almacen/eliminados",
} as const;
