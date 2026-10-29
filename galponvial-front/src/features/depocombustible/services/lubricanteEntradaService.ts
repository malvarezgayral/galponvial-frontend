import { apiClient } from '@/services/api';

export interface LubricanteEntradaItemPayload {
  fecha: string;
  tipo: string;
  nroRemito?: string;
  cantidad: number;
}

export const lubricanteEntradaService = {
  crear: async (registros: LubricanteEntradaItemPayload[]): Promise<unknown> => {
    const { data } = await apiClient.post('/lubricante-entrada', { registros });
    return data;
  },

  obtenerTipos: async (): Promise<string[]> => {
    const { data } = await apiClient.get<string[]>('/lubricante-entrada/tipos');
    return Array.isArray(data) ? data : [];
  },
};
