import { apiClient } from '@/services/api';

export interface CombustibleCarroRequest {
  fecha_carga: string;
  chofer: string;
  estacion_servicio: string;
  despachante: string;
  tipo_combustible: string;
  galpon_vial?: string;
  litros_entrada: number;
  litros_salida: number;
  estado_parcial: string;
}

export interface CombustibleCarroResponse extends CombustibleCarroRequest {
  id_carro: number;
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
};
