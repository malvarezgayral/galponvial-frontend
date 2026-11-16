import { apiClient } from '@/services/api';
import { API_ENDPOINTS } from '@/services/apiEndpoints';

export interface DependenciaItem {
  id_dependencia: number;
  nombre: string;
}

export interface JurisdiccionConDependencias {
  id_jurisdiccion: number;
  nombre: string;
  dependencias: DependenciaItem[];
}

export const jurisdiccionesService = {
  getAll: async (): Promise<JurisdiccionConDependencias[]> => {
    const { data } = await apiClient.get(API_ENDPOINTS.JURISDICCIONES.LIST);
    const lista =
      data && typeof data === 'object' && 'data' in data
        ? (data as { data: unknown }).data
        : data;
    return Array.isArray(lista) ? (lista as JurisdiccionConDependencias[]) : [];
  },
};

export const dependenciasPorId = (
  lista: JurisdiccionConDependencias[],
  id: number | string | null | undefined,
): DependenciaItem[] =>
  lista.find((j) => j.id_jurisdiccion === Number(id))?.dependencias ?? [];

export const dependenciasPorNombre = (
  lista: JurisdiccionConDependencias[],
  nombre: string | null | undefined,
): DependenciaItem[] =>
  lista.find((j) => j.nombre === nombre)?.dependencias ?? [];
