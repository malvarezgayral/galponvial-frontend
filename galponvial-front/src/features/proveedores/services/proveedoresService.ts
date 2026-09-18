import { apiClient } from '@/services/api';
import { API_ENDPOINTS } from '@/services/apiEndpoints';

export interface Proveedor {
  id: number;
  nombre: string;
  telefono?: string;
  direccion?: string;
  horarios?: string;
  ciudad?: string;
  rubro?: string;
  created_at?: string;
}

export type CreateProveedorPayload = Omit<Proveedor, 'id' | 'created_at'>;

export const proveedoresService = {
  getAll: async (): Promise<Proveedor[]> => {
    const { data } = await apiClient.get(API_ENDPOINTS.PROVEEDORES.LIST);
    return Array.isArray(data) ? data : data?.data ?? [];
  },

  getById: async (id: number | string): Promise<Proveedor> => {
    const { data } = await apiClient.get(API_ENDPOINTS.PROVEEDORES.DETAIL(id));
    return data?.data ?? data;
  },

  create: async (payload: CreateProveedorPayload): Promise<Proveedor> => {
    const { data } = await apiClient.post(API_ENDPOINTS.PROVEEDORES.CREATE, payload);
    return data?.data ?? data;
  },

  update: async (
    id: number | string,
    payload: Partial<CreateProveedorPayload>
  ): Promise<Proveedor> => {
    const { data } = await apiClient.put(API_ENDPOINTS.PROVEEDORES.UPDATE(id), payload);
    return data?.data ?? data;
  },

  remove: async (id: number | string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.PROVEEDORES.DELETE(id));
  },
};
