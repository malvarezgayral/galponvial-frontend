import { apiClient } from '@/services/api';

export interface LubricanteEntradaItemPayload {
  fecha: string;
  tipo: string;
  nroRemito?: string;
  cantidad: number;
}

export interface LubricanteStockItem {
  id: number;
  fecha: string;
  tipo: string;
  cantidadEntrada: number;
  cantidadSalida: number;
  fechaEstado: string | null;
  estadoParcial: number;
}

export interface LubricanteHistorialItem {
  id: number;
  entradaId: number;
  fechaEstado: string;
  tipo: string;
  cantidadEntrada: number;
  cantidadSalida: number;
  estadoParcial: number;
  createdAt: string;
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

  obtenerStock: async (): Promise<LubricanteStockItem[]> => {
    const { data } = await apiClient.get<LubricanteStockItem[]>('/lubricante-entrada/stock');
    return Array.isArray(data) ? data : [];
  },

  guardarSalida: async (
    id: number,
    cantidadSalida: number,
    fechaEstado: string
  ): Promise<LubricanteStockItem> => {
    const { data } = await apiClient.patch<LubricanteStockItem>(
      `/lubricante-entrada/${id}/salida`,
      { cantidadSalida, fechaEstado }
    );
    return data;
  },

  obtenerHistorial: async (): Promise<LubricanteHistorialItem[]> => {
    const { data } = await apiClient.get<LubricanteHistorialItem[]>('/lubricante-entrada/historial');
    return Array.isArray(data) ? data : [];
  },
};
