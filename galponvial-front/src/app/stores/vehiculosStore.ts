import { create } from 'zustand';
import { apiClient } from '@/services/api';
import { API_ENDPOINTS } from '@/services/apiEndpoints';
import { handleApiError } from '@/services/errorHandler';

export interface Vehiculo {
  id: string;
  // Add properties based on backend API
}

interface VehiculosState {
  vehiculos: Vehiculo[];
  isLoading: boolean;
  error: string | null;
  fetchVehiculos: () => Promise<void>;
  getVehiculoById: (id: string) => Promise<Vehiculo | null>;
  createVehiculo: (vehiculo: Omit<Vehiculo, 'id'>) => Promise<Vehiculo | null>;
  updateVehiculo: (id: string, vehiculo: Partial<Vehiculo>) => Promise<Vehiculo | null>;
  deleteVehiculo: (id: string) => Promise<boolean>;
}

export const useVehiculosStore = create<VehiculosState>((set) => ({
  vehiculos: [],
  isLoading: false,
  error: null,

  fetchVehiculos: async () => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await apiClient.get(API_ENDPOINTS.VEHICULOS.LIST);
      set({ vehiculos: data });
    } catch (error) {
      const apiError = handleApiError(error);
      set({ error: apiError.message });
    } finally {
      set({ isLoading: false });
    }
  },

  getVehiculoById: async (id: string) => {
    try {
      const { data } = await apiClient.get(API_ENDPOINTS.VEHICULOS.DETAIL(id));
      return data;
    } catch (error) {
      const apiError = handleApiError(error);
      set({ error: apiError.message });
      return null;
    }
  },

  createVehiculo: async (vehiculo) => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await apiClient.post(API_ENDPOINTS.VEHICULOS.CREATE, vehiculo);
      set((state) => ({ vehiculos: [...state.vehiculos, data] }));
      return data;
    } catch (error) {
      const apiError = handleApiError(error);
      set({ error: apiError.message });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  updateVehiculo: async (id, vehiculo) => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await apiClient.put(API_ENDPOINTS.VEHICULOS.UPDATE(id), vehiculo);
      set((state) => ({
        vehiculos: state.vehiculos.map((v) => (v.id === id ? data : v)),
      }));
      return data;
    } catch (error) {
      const apiError = handleApiError(error);
      set({ error: apiError.message });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteVehiculo: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await apiClient.delete(API_ENDPOINTS.VEHICULOS.DELETE(id));
      set((state) => ({
        vehiculos: state.vehiculos.filter((v) => v.id !== id),
      }));
      return true;
    } catch (error) {
      const apiError = handleApiError(error);
      set({ error: apiError.message });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
}));
