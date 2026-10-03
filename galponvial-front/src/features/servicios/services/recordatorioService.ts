import { apiClient } from '@/services/api';
import type { RecordatorioRequest, RecordatorioResponse, DestinoRecordatorio } from '../types';
import type { ObjectServiceResponse } from '@/shared/types/common-types';

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
   * Obtiene los posibles destinos de un recordatorio (admin y superadmin activos)
   */
  obtenerDestinos: async (): Promise<DestinoRecordatorio[]> => {
    const { data } = await apiClient.get<DestinoRecordatorio[]>(
      '/usuario/destinos-recordatorio'
    );
    return data;
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

  /**
   * Actualiza un recordatorio existente
   * @param recordatorioId - ID del recordatorio
   * @param data - Datos a actualizar (fecha y/o descripción)
   * @returns Promise con el recordatorio actualizado
   */
  updateRecordatorio: async (
    recordatorioId: number,
    data: Partial<RecordatorioRequest>
  ): Promise<RecordatorioResponse> => {
    const { data: response } = await apiClient.patch<RecordatorioResponse>(
      `/usuario/recordatorios/${recordatorioId}`,
      data
    );
    return response;
  },

  /**
   * Elimina un recordatorio
   * @param recordatorioId - ID del recordatorio
   * @returns Promise con la respuesta de eliminación
   */
  deleteRecordatorio: async (
    recordatorioId: number
  ): Promise<ObjectServiceResponse<{ deleted: number }>> => {
    const { data } = await apiClient.delete<ObjectServiceResponse<{ deleted: number }>>(
      `/usuario/recordatorios/${recordatorioId}`
    );
    return data;
  },

  /**
   * Elimina todos los recordatorios de un usuario
   * @param userDni - DNI del usuario
   * @returns Promise con la respuesta de eliminación
   */
  deleteAllRecordatorios: async (
    userDni: number
  ): Promise<ObjectServiceResponse<{ deleted: number }>> => {
    const { data } = await apiClient.delete<ObjectServiceResponse<{ deleted: number }>>(
      `/usuario/${userDni}/recordatorios`
    );
    return data;
  },
};
