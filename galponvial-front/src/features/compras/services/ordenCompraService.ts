import { apiClient } from '@/services/api';
import { API_ENDPOINTS } from '@/services/apiEndpoints';
import type { Proveedor } from '../../proveedores/services/proveedoresService';
import type { Suministro } from './suministroService';

export type TipoFactura = 'B' | 'C';
export type EstadoOrdenCompra = 'pendiente' | 'entregado';

export interface OrdenCompra {
  id: number;
  numeroOrden: string;
  suministro: Suministro | null;
  proveedor: Proveedor | null;
  tipoFactura?: TipoFactura;
  numeroFactura?: string;
  monto?: number;
  fechaEntrega?: string;
  estado: EstadoOrdenCompra;
  unidad?: string;
  created_at?: string;
}

export interface CreateOrdenCompraPayload {
  numeroOrden: string;
  id_suministro?: number;
  id_proveedor?: number;
  tipoFactura?: TipoFactura;
  numeroFactura?: string;
  monto?: number;
  fechaEntrega?: string;
  estado?: EstadoOrdenCompra;
  unidad?: string;
}

export const ordenCompraService = {
  getAll: async (): Promise<OrdenCompra[]> => {
    const { data } = await apiClient.get(API_ENDPOINTS.ORDENES_COMPRA.LIST);
    return Array.isArray(data) ? data : data?.data ?? [];
  },

  getById: async (id: number | string): Promise<OrdenCompra> => {
    const { data } = await apiClient.get(API_ENDPOINTS.ORDENES_COMPRA.DETAIL(id));
    return data?.data ?? data;
  },

  create: async (payload: CreateOrdenCompraPayload): Promise<OrdenCompra> => {
    const { data } = await apiClient.post(API_ENDPOINTS.ORDENES_COMPRA.CREATE, payload);
    return data?.data ?? data;
  },

  update: async (
    id: number | string,
    payload: Partial<CreateOrdenCompraPayload>
  ): Promise<OrdenCompra> => {
    const { data } = await apiClient.put(API_ENDPOINTS.ORDENES_COMPRA.UPDATE(id), payload);
    return data?.data ?? data;
  },

  remove: async (id: number | string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.ORDENES_COMPRA.DELETE(id));
  },
};
