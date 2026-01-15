import { apiClient } from '@/services/api';
import { API_ENDPOINTS } from '@/services/apiEndpoints';
import type { Vehiculo } from '../types';

export const vehiculosService = {
  getAll: async (): Promise<Vehiculo[]> => {
    const { data } = await apiClient.get(API_ENDPOINTS.VEHICULOS.LIST);
    return data;
  },

  getById: async (id: string): Promise<Vehiculo> => {
    const { data } = await apiClient.get(API_ENDPOINTS.VEHICULOS.DETAIL(id));
    return data;
  },

  create: async (vehiculo: Omit<Vehiculo, 'id'>): Promise<Vehiculo> => {
    const { data } = await apiClient.post(API_ENDPOINTS.VEHICULOS.CREATE, vehiculo);
    return data;
  },

  update: async (id: string, vehiculo: Partial<Vehiculo>): Promise<Vehiculo> => {
    const { data } = await apiClient.put(API_ENDPOINTS.VEHICULOS.UPDATE(id), vehiculo);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.VEHICULOS.DELETE(id));
  },
};
