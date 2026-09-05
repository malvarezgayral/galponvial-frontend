// galponvial-front/src/features/service/services/serviceService.ts
import { apiClient } from '@/services/api';

export interface FilaService {
  id: number;
  vehiculo: string;
  fecha: string;
  aceiteMotor: string;
  aceiteCaja: string;
  aceiteDiferencial: string;
  aceiteTransmision: string;
  filtroTransmision: string;
  filtroMotorAceite: string;
  filtroAire: string;
  filtroGasoil: string;
  aceiteHidraulico: string;
  filtroHidraulico: string;
  correasAuxiliares: string;
  aceiteTande: string;
  regulacionValvulas: string;
  cambioDamper: string;
  proximoService: string;
  cuentaHora: string;
  stock: string;
  observaciones: string;
}

export const serviceService = {
  crear: async (data: Omit<FilaService, 'id'>): Promise<FilaService> => {
    const { data: response } = await apiClient.post<FilaService>('/service', data);
    return response;
  },

  obtenerTodos: async (): Promise<FilaService[]> => {
    const { data } = await apiClient.get<FilaService[]>('/service');
    return data;
  },

  actualizar: async (id: number, data: Omit<FilaService, 'id'>): Promise<FilaService> => {
    const { data: response } = await apiClient.put<FilaService>(`/service/${id}`, data);
    return response;
  },

  eliminar: async (id: number): Promise<void> => {
    await apiClient.delete(`/service/${id}`);
  },
};