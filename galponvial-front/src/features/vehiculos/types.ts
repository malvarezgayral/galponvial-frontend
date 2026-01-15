// Vehiculos types
export interface Vehiculo {
  id: string;
  modelo: string;
  marca: string;
  anio: number;
  patente: string;
  estado: 'disponible' | 'mantenimiento' | 'en_uso' | 'retirado';
  fechaCompra: string;
  fechaCreacion: string;
  ultimaModificacion: string;
}
