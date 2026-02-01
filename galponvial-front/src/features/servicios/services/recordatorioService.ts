import { apiClient } from '@/services/api';
import type { RecordatorioRequest, RecordatorioResponse } from '../types';

/**
 * Servicio para gestionar recordatorios de vehículos
 */
export const recordatorioService = {
  /**
   * Crea un nuevo recordatorio para un vehículo
   * @param vehiculoId - ID del vehículo
   * @param data - Datos del recordatorio
   * @returns Promise con la respuesta del recordatorio creado
   */
  crearRecordatorio: async (
    vehiculoId: number,
    data: RecordatorioRequest
  ): Promise<RecordatorioResponse> => {
    const { data: response } = await apiClient.post<RecordatorioResponse>(
      `/vehiculos/${vehiculoId}/recordatorios`,
      data
    );
    return response;
  },

  /**
   * Obtiene el historial de recordatorios de un vehículo
   * @param vehiculoId - ID del vehículo
   * @returns Promise con el historial de recordatorios
   */
  obtenerHistorial: async (vehiculoId: number): Promise<RecordatorioResponse[]> => {
    const { data } = await apiClient.get<RecordatorioResponse[]>(
      `/vehiculos/${vehiculoId}/recordatorios`
    );
    return data;
  },
};
