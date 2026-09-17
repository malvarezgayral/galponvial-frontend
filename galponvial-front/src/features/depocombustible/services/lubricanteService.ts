import { apiClient } from '@/services/api';
import { API_ENDPOINTS } from '@/services/apiEndpoints';

export interface Lubricante {
  id: number;
  vehiculo: {
    id_vehiculo: number;
    nombre?: string;
    codigo?: string;
  };
  fecha: string;
  ordenRetiro?: string;
  cantidad: number;
  tipo: string;
  observaciones?: string;
  created_at?: string;
}

export interface CreateLubricantePayload {
  id_vehiculo: number;
  fecha: string;
  ordenRetiro?: string;
  cantidad: number;
  tipo: string;
  observaciones?: string;
}

export const lubricanteService = {
  getAll: async (): Promise<Lubricante[]> => {
    const { data } = await apiClient.get(API_ENDPOINTS.LUBRICANTES.LIST);
    return Array.isArray(data) ? data : data?.data ?? [];
  },

  getById: async (id: number | string): Promise<Lubricante> => {
    const { data } = await apiClient.get(API_ENDPOINTS.LUBRICANTES.DETAIL(id));
    return data?.data ?? data;
  },

  create: async (payload: CreateLubricantePayload): Promise<Lubricante> => {
    const { data } = await apiClient.post(API_ENDPOINTS.LUBRICANTES.CREATE, payload);
    return data?.data ?? data;
  },

  update: async (
    id: number | string,
    payload: Partial<CreateLubricantePayload>
  ): Promise<Lubricante> => {
    const { data } = await apiClient.put(API_ENDPOINTS.LUBRICANTES.UPDATE(id), payload);
    return data?.data ?? data;
  },

  remove: async (id: number | string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.LUBRICANTES.DELETE(id));
  },
};
