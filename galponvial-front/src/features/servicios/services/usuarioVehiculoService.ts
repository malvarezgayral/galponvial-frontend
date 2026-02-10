import { apiClient } from '@/services/api';
import type {
  UsuarioVehiculoResponse,
  UsuarioVehiculoRelacion,
  DesasignarVehiculoRequest,
} from '../types';

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
   * Unassign a usuario-vehículo relationship by setting fecha_hasta to today
   * @param id - ID of the usuario-vehículo relationship
   * @returns Promise with the updated relationship
   */
  desasignarRelacion: async (id: number): Promise<UsuarioVehiculoRelacion> => {
    const today = new Date().toISOString().split('T')[0];
    const request: DesasignarVehiculoRequest = {
      fecha_hasta: today,
    };
    const { data } = await apiClient.put<UsuarioVehiculoRelacion>(
      `/vehiculos/usuario-vehiculo/${id}`,
      request
    );
    return data;
  },
};
