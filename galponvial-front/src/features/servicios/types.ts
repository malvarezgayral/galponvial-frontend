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
  km_actual: number;
  cant_combustible_despachado: number;
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
  vehiculo: VehiculoInfo;
  id: number;
}
