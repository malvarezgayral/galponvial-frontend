import { apiClient } from '@/services/api';
import { API_ENDPOINTS } from '@/services/apiEndpoints';
import type { Proveedor } from '../../proveedores/services/proveedoresService';
import type { Presupuesto } from './presupuestoService';

export interface SuministroItem {
  id?: number;
  cantidad?: string;
  descripcion?: string;
  costoUnitario?: number;
  costoEstimado?: number;
}

export interface Suministro {
  id: number;
  fecha: string;
  numeroSuministro?: string;
  proveedor: Proveedor | null;
  producto?: string;
  agente?: string;
  jurisdiccion?: string;
  unidadEjecutora?: string;
  dependenciaSolicitante?: string;
  unidad?: string;
  observaciones?: string;
  presupuesto: Presupuesto | null;
  items: SuministroItem[];
  created_at?: string;
}

export interface CreateSuministroPayload {
  fecha: string;
  numeroSuministro?: string;
  id_proveedor?: number;
  producto?: string;
  agente?: string;
  jurisdiccion?: string;
  unidadEjecutora?: string;
  dependenciaSolicitante?: string;
  unidad?: string;
  observaciones?: string;
  id_presupuesto?: number;
  items?: SuministroItem[];
}

export const suministroService = {
  getAll: async (): Promise<Suministro[]> => {
    const { data } = await apiClient.get(API_ENDPOINTS.SUMINISTROS.LIST);
    return Array.isArray(data) ? data : data?.data ?? [];
  },

  getById: async (id: number | string): Promise<Suministro> => {
    const { data } = await apiClient.get(API_ENDPOINTS.SUMINISTROS.DETAIL(id));
    return data?.data ?? data;
  },

  create: async (payload: CreateSuministroPayload): Promise<Suministro> => {
    const { data } = await apiClient.post(API_ENDPOINTS.SUMINISTROS.CREATE, payload);
    return data?.data ?? data;
  },

  update: async (
    id: number | string,
    payload: Partial<CreateSuministroPayload>
  ): Promise<Suministro> => {
    const { data } = await apiClient.put(API_ENDPOINTS.SUMINISTROS.UPDATE(id), payload);
    return data?.data ?? data;
  },

  remove: async (id: number | string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.SUMINISTROS.DELETE(id));
  },
};
