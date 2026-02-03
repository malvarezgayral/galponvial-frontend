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
  grupo_id?: number; // ID del grupo al que pertenece el artículo
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
  fecha: string | Date; 
  codArticulo: number;
  dniUsuario: string | number; 
  motivo: string;
  detalle: string;
}

export interface SectorDto {
  id: number;
  nro_sector: number;
  tipo: string;
  descripcion: string;
}