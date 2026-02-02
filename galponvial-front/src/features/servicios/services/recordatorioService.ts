import { apiClient } from '@/services/api';
import type { RecordatorioRequest, RecordatorioResponse } from '../types';

/**
 * Servicio para gestionar recordatorios de usuarios
 */
export const recordatorioService = {
  /**
   * Crea un nuevo recordatorio para un usuario
   * @param userDni - DNI del usuario
   * @param data - Datos del recordatorio
   * @returns Promise con la respuesta del recordatorio creado
   */
  crearRecordatorio: async (
    userDni: number,
    data: RecordatorioRequest
  ): Promise<RecordatorioResponse> => {
    const { data: response } = await apiClient.post<RecordatorioResponse>(
      `/usuario/${userDni}/recordatorios`,
      data
    );
    return response;
  },

  /**
   * Obtiene el historial de recordatorios de un usuario
   * @param userDni - DNI del usuario
   * @returns Promise con el historial de recordatorios
   */
  obtenerHistorial: async (userDni: number): Promise<RecordatorioResponse[]> => {
    const { data } = await apiClient.get<RecordatorioResponse[]>(
      `/usuario/${userDni}/recordatorios`
    );
    return data;
  },
};
