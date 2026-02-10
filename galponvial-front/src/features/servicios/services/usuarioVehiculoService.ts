import { apiClient } from '@/services/api';
import type { UsuarioVehiculoResponse, UsuarioVehiculoRelacion } from '../types';

/**
 * Service for managing usuario-vehículo relationships
 */
export const usuarioVehiculoService = {
  /**
   * Fetch all usuario-vehículo relationships with pagination
   * @param page - Page number (1-indexed)
   * @param pageSize - Number of items per page
   * @returns Promise with paginated usuario-vehículo relationships
   */
  getAll: async (page: number = 1, pageSize: number = 10): Promise<UsuarioVehiculoResponse> => {
    const { data } = await apiClient.get<UsuarioVehiculoResponse>(
      '/vehiculos/usuario-vehiculo',
      {
        params: {
          page,
          pageSize,
        },
      }
    );
    return data;
  },

  /**
   * Get a single usuario-vehículo relationship by ID
   * @param id - ID of the usuario-vehículo relationship
   * @returns Promise with the usuario-vehículo relationship details
   */
  getById: async (id: number): Promise<UsuarioVehiculoRelacion> => {
    const { data } = await apiClient.get<UsuarioVehiculoRelacion>(
      `/vehiculos/usuario-vehiculo/${id}`
    );
    return data;
  },

  /**
   * Unassign a usuario-vehículo relationship
   * @param id - ID of the usuario-vehículo relationship
   * @returns Promise with void
   */
  desasignarRelacion: async (id: number): Promise<void> => {
    await apiClient.delete(`/vehiculos/usuario-vehiculo/${id}`);
  },
};
