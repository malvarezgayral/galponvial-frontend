import { apiClient } from '@/services/api';
import type { CombustibleCargaRequest, CombustibleCargaResponse } from '../types';

/**
 * Servicio para gestionar cargas de combustible
 */
export const combustibleService = {
  /**
   * Registra una nueva carga de combustible para un vehículo
   * @param vehiculoId - ID del vehículo
   * @param data - Datos de la carga de combustible
   * @returns Promise con la respuesta de la carga creada
   */
  crearCarga: async (
    vehiculoId: number,
    data: CombustibleCargaRequest
  ): Promise<CombustibleCargaResponse> => {
    const { data: response } = await apiClient.post<CombustibleCargaResponse>(
      `/vehiculos/${vehiculoId}/combustible-cargas`,
      data
    );
    return response;
  },

  /**
   * Obtiene el historial de cargas de combustible de un vehículo
   * @param vehiculoId - ID del vehículo
   * @returns Promise con el historial de cargas
   */
  obtenerHistorial: async (vehiculoId: number): Promise<CombustibleCargaResponse[]> => {
    const { data } = await apiClient.get<CombustibleCargaResponse[]>(
      `/vehiculos/${vehiculoId}/combustible-cargas`
    );
    return data;
  },
};
