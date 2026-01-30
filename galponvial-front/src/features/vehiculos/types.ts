// Vehiculos types
export interface InfoAdicional {
  numero_serie: number;
  licencia_conductor: string;
  color: string;
  seguro_empresa: string;
  poliza: string;
  id_sector_pertenencia: number;
}

export interface Vehiculo {
  id_vehiculo: number;
  codigo: string;
  nombre: string;
  marca: string;
  modelo: string;
  anio: number;
  tipo_vehiculo: string;
  status: 'disponible' | 'mantenimiento' | 'en_uso' | 'retirado';
  infoAdicional: InfoAdicional;
  fechaCreacion?: string;
  ultimaModificacion?: string;
}

export interface CreateVehiculoPayload {
  codigo: string;
  nombre: string;
  marca: string;
  modelo: string;
  anio: number;
  tipo_vehiculo: string;
  status: 'disponible' | 'mantenimiento' | 'en_uso' | 'retirado';
  infoAdicional: InfoAdicional;
}

// Dropdown options
export interface DropdownOption {
  id: number | string;
  label: string;
  value: string | number;
}

export interface DropdownData {
  tiposVehiculo: DropdownOption[];
  estados: DropdownOption[];
  sectoresPertenencia: DropdownOption[];
}

// Recordatorios (Reminders)
export interface Recordatorio {
  id: number;
  fecha: string;
  descripcion: string;
  vehiculo: Vehiculo;
}

export interface RecordatoriosResponse {
  data: Recordatorio[];
  total: number;
  page: number;
  pageSize: number;
}

// Status Updates
export interface StatusUpdate {
  id_status: number;
  tipo: string;
  fecha_desde: string;
  fecha_hasta: string;
  vehiculo: Vehiculo;
}

export interface StatusUpdatesResponse {
  data: StatusUpdate[];
  total: number;
  page: number;
  pageSize: number;
}

// Usuario para incidentes
export interface Usuario {
  dni: string;
  nombre: string;
  apellido: string;
  email: string;
  isActive: boolean;
  tokenVersion: number;
  fecha_alta: string;
  fecha_baja?: string;
}

// Incidentes
export interface Incidente {
  id: number;
  fecha: string;
  tipo: string;
  descripcion: string;
  falla: 'baja' | 'media' | 'alta';
  estado: 'pendiente' | 'en_proceso' | 'resuelto';
  id_usuario: number;
  id_vehiculo: number;
  usuario: Usuario;
  vehiculo: Vehiculo;
}

export interface IncidentesResponse {
  data: Incidente[];
  total: number;
  page: number;
  pageSize: number;
}

// Cargas de Combustible
export interface CargaCombustible {
  id_carga: number;
  fecha_carga: string;
  despachante: string;
  km_actual: number;
  cant_combustible_despachado: number;
  vehiculo: Vehiculo;
}

export interface CargasCombustibleResponse {
  data: CargaCombustible[];
  total: number;
  page: number;
  pageSize: number;
}

// Pagination response wrapper
export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
  };
  message: string;
}

// Enums response from API
export interface VehiculosEnums {
  VehiculoStatus: string[];
  TipoVehiculo: string[];
  TipoIncidente: string[];
  StatusIncidente: string[];
  TipoServicio: string[];
  Sector: string[];
}

export interface EnumsApiResponse {
  success: boolean;
  data: VehiculosEnums;
  message: string;
}
