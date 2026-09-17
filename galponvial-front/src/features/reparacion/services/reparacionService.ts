import { apiClient } from '@/services/api';
import { API_ENDPOINTS } from '@/services/apiEndpoints';

export type TallerTipo =
  | 'Taller 1 (General)'
  | 'Taller 2 (Vial)'
  | 'Taller 3 (Pintura)';

export interface Reparacion {
  id: number;
  vehiculo: {
    id_vehiculo: number;
    nombre?: string;
    codigo?: string;
  };
  descripcion: string;
  taller: TallerTipo;
  fecha_entrada: string;
  fecha_salida?: string;
  observaciones?: string;
  created_at?: string;
}

export interface CreateReparacionPayload {
  id_vehiculo: number;
  descripcion: string;
  taller: TallerTipo;
  fecha_entrada: string;
  fecha_salida?: string;
  observaciones?: string;
}

export const reparacionService = {
  getAll: async (): Promise<Reparacion[]> => {
    const { data } = await apiClient.get(API_ENDPOINTS.REPARACIONES.LIST);
    return Array.isArray(data) ? data : data?.data ?? [];
  },

  getById: async (id: number | string): Promise<Reparacion> => {
    const { data } = await apiClient.get(API_ENDPOINTS.REPARACIONES.DETAIL(id));
    return data?.data ?? data;
  },

  create: async (payload: CreateReparacionPayload): Promise<Reparacion> => {
    const { data } = await apiClient.post(API_ENDPOINTS.REPARACIONES.CREATE, payload);
    return data?.data ?? data;
  },

  update: async (
    id: number | string,
    payload: Partial<CreateReparacionPayload>
  ): Promise<Reparacion> => {
    const { data } = await apiClient.put(API_ENDPOINTS.REPARACIONES.UPDATE(id), payload);
    return data?.data ?? data;
  },

  remove: async (id: number | string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.REPARACIONES.DELETE(id));
  },
};
