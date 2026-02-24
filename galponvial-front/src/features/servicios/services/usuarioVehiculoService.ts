import { apiClient } from '@/services/api';
import type { UsuarioVehiculoResponse, UsuarioVehiculoRelacion } from '../types';

interface AsignarVehiculoRequest {
  dni: number;
  id_vehiculo: number;
}

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

  /**
   * Assign a vehicle to a user
   * @param dni - DNI of the user
   * @param id_vehiculo - ID of the vehicle
   * @returns Promise with the newly created relationship
   */
  asignarVehiculo: async (dni: number, id_vehiculo: number): Promise<UsuarioVehiculoRelacion> => {
    dni = Number(dni); // Ensure DNI is a number
    const request: AsignarVehiculoRequest = {
      dni,
      id_vehiculo,
    };
    
    try {
      const { data } = await apiClient.post<UsuarioVehiculoRelacion>(
        '/vehiculos/assign',
        request
      );
      return data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const dataError = error.response?.data;
      const backendMsg = dataError?.message || dataError?.error;
      
      let errorMessage = 'Error al asignar el vehículo.';

      if (Array.isArray(backendMsg)) {
        errorMessage = backendMsg.join('. ');
      } else if (typeof backendMsg === 'string') {
        errorMessage = backendMsg;
      } else if (error.message) {
        if (error.message === 'Network Error') errorMessage = 'Error de red. Verifica tu conexión a internet.';
        else if (error.message.includes('400')) errorMessage = 'Solicitud incorrecta. Verifica los datos.';
        else if (error.message.includes('500')) errorMessage = 'Error interno del servidor.';
      }
      
      throw new Error(errorMessage);
    }
  },
};