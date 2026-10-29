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
};
