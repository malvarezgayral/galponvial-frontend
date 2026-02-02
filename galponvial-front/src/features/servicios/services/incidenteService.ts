import { apiClient } from '@/services/api';
import type { IncidenteRequest, IncidenteResponse } from '../types';

/**
 * Servicio para gestionar incidentes de vehículos
 */
export const incidenteService = {
  /**
   * Registra un nuevo incidente para un vehículo
   * @param vehiculoId - ID del vehículo
   * @param data - Datos del incidente
   * @returns Promise con la respuesta del incidente creado
   */
  crearIncidente: async (
    vehiculoId: number,
    data: IncidenteRequest
  ): Promise<IncidenteResponse> => {
    const { data: response } = await apiClient.post<IncidenteResponse>(
      `/vehiculos/${vehiculoId}/incidentes`,
      data
    );
    return response;
  },

  /**
   * Obtiene el historial de incidentes de un vehículo
   * @param vehiculoId - ID del vehículo
   * @returns Promise con el historial de incidentes
   */
  obtenerHistorial: async (vehiculoId: number): Promise<IncidenteResponse[]> => {
    const { data } = await apiClient.get<IncidenteResponse[]>(
      `/vehiculos/${vehiculoId}/incidentes`
    );
    return data;
  },
};
