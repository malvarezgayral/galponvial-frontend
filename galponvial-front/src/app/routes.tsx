export const ROUTES = {
  home: "/",
  vehiculos: "/vehiculos",
  vehiculoDetalles: (id: number) => `/vehiculos/${id}`,
  almacen: "/almacen",
  servicios: "/servicios",
  usuarios: "/usuarios",
  auditoria: "/auditoria",
  
  depoCombustible: "/depo-combustible",
  tanqueCombustible: "/tanque-combustible",
  login: "/login",
  articuloDetallesRoute: "/almacen/:id", 
  articuloDetalles: (id: number) => `/almacen/${id}`,
  grupoDetalles: (id: string | number) => `/almacen/grupos/${id}`,
  articulosEliminados: "/almacen/eliminados",
  proveedores: "/proveedores",
  service: "/service",
  reparacion: "/reparacion",
   compras: "/compras",
  
} as const;
