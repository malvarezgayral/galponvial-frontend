import { apiClient } from '@/services/api';

export interface CombustibleCarroRequest {
  maquina: string;
  fecha_carga: string;
  chofer: string;
  estacion_servicio: string;
  despachante: string;
  tipo_combustible: string;
  galpon_vial?: string;
  litros_entrada?: number;
  litros_salida?: number;
  total_inicial?: number;
  estado_parcial_inicial?: number;
}

export interface CombustibleCarroResponse {
  id_carro: number;
  maquina: string;
  fecha_carga: string;
  chofer: string;
  estacion_servicio: string;
  despachante: string;
  tipo_combustible: string;
  galpon_vial?: string | null;
  litros_entrada: number;
  litros_salida: number;
  total_combustible: number;
  estado_parcial: number;
  registrada_por_nombre: string;
  registrada_por_apellido: string;
  registrada_por_dni: string;
}

export const combustibleCarroService = {
  crear: async (
    data: CombustibleCarroRequest
  ): Promise<CombustibleCarroResponse> => {
    const { data: response } = await apiClient.post<CombustibleCarroResponse>(
      '/combustible-carro',
      data
    );
    return response;
  },

  listar: async (): Promise<CombustibleCarroResponse[]> => {
    const { data } = await apiClient.get<CombustibleCarroResponse[]>(
      '/combustible-carro'
    );
    return data;
  },
};
