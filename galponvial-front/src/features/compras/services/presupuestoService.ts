import { apiClient } from '@/services/api';
import { API_ENDPOINTS } from '@/services/apiEndpoints';
import type { Proveedor } from '../../proveedores/services/proveedoresService';

export type EstadoPresupuesto = 'pendiente' | 'aprobado' | 'rechazado';

export interface Presupuesto {
  id: number;
  proveedor: Proveedor | null;
  producto: string;
  precio: number;
  unidad: string;
  areaMunicipio: string;
  fechaSolicitud: string;
  fechaEntrega: string;
  observaciones?: string;
  estado: EstadoPresupuesto;
  created_at?: string;
}

export interface CreatePresupuestoPayload {
  id_proveedor?: number;
  producto: string;
  precio: number;
  unidad: string;
  areaMunicipio: string;
  fechaSolicitud: string;
  fechaEntrega: string;
  observaciones?: string;
}

export const presupuestoService = {
  getAll: async (): Promise<Presupuesto[]> => {
    const { data } = await apiClient.get(API_ENDPOINTS.PRESUPUESTOS.LIST);
    return Array.isArray(data) ? data : data?.data ?? [];
  },

  getById: async (id: number | string): Promise<Presupuesto> => {
    const { data } = await apiClient.get(API_ENDPOINTS.PRESUPUESTOS.DETAIL(id));
    return data?.data ?? data;
  },

  create: async (payload: CreatePresupuestoPayload): Promise<Presupuesto> => {
    const { data } = await apiClient.post(API_ENDPOINTS.PRESUPUESTOS.CREATE, payload);
    return data?.data ?? data;
  },

  update: async (
    id: number | string,
    payload: Partial<CreatePresupuestoPayload>
  ): Promise<Presupuesto> => {
    const { data } = await apiClient.put(API_ENDPOINTS.PRESUPUESTOS.UPDATE(id), payload);
    return data?.data ?? data;
  },

  remove: async (id: number | string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.PRESUPUESTOS.DELETE(id));
  },
};
