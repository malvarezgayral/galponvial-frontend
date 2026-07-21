/**
 * Tipos para la feature de Servicios
 */

export interface Servicio {
  id: string;
  nombre: string;
  descripcion: string;
  icono: string;
}

export const TipoServicio = {
  COMBUSTIBLE: 'combustible',
  INCIDENTE: 'incidente',
  RECORDATORIO: 'recordatorio',
} as const;

/**
 * Tipos para Carga de Combustible
 */
export interface CombustibleCargaRequest {
  fecha_carga: string;
  despachante?: string;
  tipo_combustible: string;
  Galpón_Vial: string;       // ← agregar esta línea
  km_actual: number;
  cant_combustible_despachado: number;
  chofer: string;
  estacion_servicio: string;
  litros_entrada: number;
  litros_salida: number;
  estado_parcial: string;
}

export interface VehiculoInfo {
  id_vehiculo: number;
  codigo: string;
  nombre: string;
  marca: string;
  modelo: string;
  anio: number;
  status: string;
  uso_combustible: number;
  uso_km: number;
  tipo_vehiculo: string;
  eliminado: boolean;
  created_at: string;
}

export interface CombustibleCargaResponse {
  fecha_carga: string;
  despachante?: string;
  km_actual: number;
  cant_combustible_despachado: number;
  chofer: string;
  estacion_servicio: string;
  litros_entrada: number;
  litros_salida: number;
  estado_parcial: string;
  vehiculo: VehiculoInfo;
  id_carga: number;
}

/**
 * Tipos para Incidentes
 */
export interface UsuarioInfo {
  dni: string;
  nombre: string;
  apellido: string;
  email: string;
  isActive: boolean;
  tokenVersion: number;
  fecha_alta: string;
  fecha_baja: string | null;
  usuarioRoles: Array<{
    dni: string;
    rol_id: number;
    fecha_asignacion: string;
    fecha_actualizacion: string;
  }>;
}

export interface IncidenteRequest {
  fecha: string;
  tipo: string;
  descripcion: string;
  falla: string;
  id_usuario: number;
}

export interface IncidenteResponse {
  fecha: string;
  tipo: string;
  descripcion: string;
  falla: string;
  vehiculo: VehiculoInfo;
  usuario: UsuarioInfo;
  id_usuario: number;
  id_vehiculo: number;
  id: number;
  estado: string;
}

/**
 * Tipos para Recordatorios
 */
export interface RecordatorioRequest {
  fecha: string;
  descripcion: string;
}

export interface RecordatorioResponse {
  fecha: string;
  descripcion: string;
  id: number;
  usuario?: {
    dni: number;
    nombre: string;
    apellido: string;
    email: string;
  };
}

/**
 * Tipos para Relaciones Usuario-Vehículo
 */
export interface RolAsignado {
  dni: string;
  rol_id: number;
  fecha_asignacion: string;
  fecha_actualizacion: string;
}

export interface UsuarioVehiculoRelacion {
  id_usuario_vehiculo: number;
  id_vehiculo: number;
  id_usuario: string;
  fecha_desde: string;
  fecha_hasta: string | null;
  usuario: {
    dni: string;
    nombre: string;
    apellido: string;
    email: string;
    password: string;
    isActive: boolean;
    tokenVersion: number;
    fecha_alta: string;
    fecha_baja: string | null;
    usuarioRoles: RolAsignado[];
  };
  vehiculo: {
    id_vehiculo: number;
    codigo: string;
    nombre: string;
    marca: string;
    modelo: string;
    anio: number;
    status: string;
    uso_combustible: number;
    uso_km: number;
    tipo_vehiculo: string;
    eliminado: boolean;
    created_at: string;
  };
}

export interface UsuarioVehiculoResponse {
  success: boolean;
  data: {
    data: UsuarioVehiculoRelacion[];
    total: number;
    page: number;
    pageSize: number;
  };
  message: string;
}

/**
 * Tipos para Historial de Carga de Combustible (filtros de búsqueda)
 */
export interface RangoNumerico {
  min?: number;
  max?: number;
}

export interface CombustibleHistorialFiltros {
  periodo_desde?: string;
  periodo_hasta?: string;
  chofer?: string;
  estacion_servicio?: string;
  despachante?: string;
  tipo_combustible?: string;
  Galpón_Vial?: string;
  km_actual?: RangoNumerico;
  cant_combustible_despachado?: RangoNumerico;
  litros_entrada?: RangoNumerico;
  litros_salida?: RangoNumerico;
  estado_parcial?: string;
}


/**
 * Tipos para Historial de Incidentes (filtros de búsqueda)
 */
export interface IncidenteHistorialFiltros {
  periodo_desde?: string;
  periodo_hasta?: string;
  tipo?: string;
  severidad?: string;
  vehiculo?: string;
  unidad?: string;
}


/**
 * Tipos para Historial de Recordatorios (filtros de búsqueda)
 */
export interface RecordatorioHistorialFiltros {
  fecha_hora?: string;
  periodo_desde?: string;
  periodo_hasta?: string;
  destinatario?: string;
  vialidad?: string;
}
