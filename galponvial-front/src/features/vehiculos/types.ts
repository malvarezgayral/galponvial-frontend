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
  id: string;
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
