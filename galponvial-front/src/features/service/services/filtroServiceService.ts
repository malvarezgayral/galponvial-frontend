// galponvial-front/src/features/service/services/filtroServiceService.ts
import { apiClient } from '@/services/api';

export interface FiltroServiceRegistro {
  id: number;
  idVehiculo: number | null;
  vehiculoRef?: { id_vehiculo: number; nombre?: string; codigo?: string } | null;
  fecha: string | null;
  tipoFiltro: string;
  codigo: string | null;
  cantidad: number;
}

export interface FiltroServiceItemPayload {
  idVehiculo?: number;
  fecha?: string;
  tipoFiltro: string;
  codigo?: string;
  cantidad: number;
}

export const filtroServiceService = {
  crear: async (registros: FiltroServiceItemPayload[]): Promise<FiltroServiceRegistro[]> => {
    const { data } = await apiClient.post<FiltroServiceRegistro[]>('/filtro-service', { registros });
    return data;
  },

  obtenerTodos: async (): Promise<FiltroServiceRegistro[]> => {
    const { data } = await apiClient.get<FiltroServiceRegistro[]>('/filtro-service');
    return data;
  },
};
