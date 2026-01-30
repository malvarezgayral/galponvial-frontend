/**
 * Almacén (Warehouse) Types
 */

import type { MovimientoTipo } from "./enums";

export interface Articulo {
  cod: number;
  cod_proveedor: string;
  nombre: string;
  modelo: string;
  descripcion: string;
  img?: string;
  unidad_tipo: 'pieza' | 'caja' | 'bulto' | 'metro' | 'litro' | 'kg';
  stock?: number; // Solo aplica para ciertos tipos de unidad
  fechaCreacion?: string;
  ultimaModificacion?: string;
}

export interface CreateArticuloPayload {
  cod_proveedor: string;
  nombre: string;
  modelo: string;
  descripcion: string;
  img?: string;
  unidad_tipo: 'pieza' | 'caja' | 'bulto' | 'metro' | 'litro' | 'kg';
  stock?: number;
  grupo_id: number;
}

export interface ArticuloResponse {
  id_articulo: number;
  cod_proveedor: string;
  nombre: string;
  modelo: string;
  descripcion: string;
  img?: string;
  unidad_tipo: 'pieza' | 'caja' | 'bulto' | 'metro' | 'litro' | 'kg';
  stock?: number;
  fechaCreacion: string;
  ultimaModificacion: string;
}

export interface ArticulosListResponse {
  data: Articulo[];
  total: number;
  page: number;
  pageSize: number;
}

// Dropdown options
export interface DropdownOption {
  id: string | number;
  label: string;
  value: string;
}

export interface UnidadTipoOption {
  value: 'pieza' | 'caja' | 'bulto' | 'metro' | 'litro' | 'kg';
  label: string;
  requiresStock: boolean; // Si true, el campo stock es obligatorio
}

export interface Sector {
  id: number;
  nro_sector: number;
  tipo: string;
  descripcion: string;
}

export interface Grupo {
  id: number;
  nombre: string;
  descripcion: string;
  sector: Sector;
}

export interface Movimiento {
  tipoMovimiento: MovimientoTipo;
  fecha: string | Date; // El DTO dice Date, pero a veces llega como string del JSON
  codArticulo: number;
  dniUsuario: number;
  motivo: string;
  detalle: string;
}