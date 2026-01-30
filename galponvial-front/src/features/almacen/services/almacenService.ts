import { apiClient } from '@/services/api';
import type { CreateArticuloPayload, ArticuloResponse, ArticulosListResponse, Grupo } from '../types';

const BASE_URL = '/almacen/articulos';
const GRUPOS_URL = '/almacen/grupos';

/**
 * Almacén Service - API integration for warehouse management
 */
export const almacenService = {
  /**
   * Fetch all articulos with pagination
   */
  getArticulos: async (page: number = 1, pageSize: number = 10): Promise<ArticulosListResponse> => {
    const { data } = await apiClient.get(
      `${BASE_URL}?page=${page}&pageSize=${pageSize}`
    );
    return data.data || data;
  },

  /**
   * Fetch a single articulo by ID
   */
  getArticuloById: async (id: number): Promise<ArticuloResponse> => {
    const { data } = await apiClient.get(`${BASE_URL}/${id}`);
    return data.data || data;
  },

  /**
   * Create a new articulo
   */
  createArticulo: async (payload: CreateArticuloPayload): Promise<ArticuloResponse> => {
    const { data } = await apiClient.post(BASE_URL, payload);
    return data.data || data;
  },

  /**
   * Update an existing articulo
   */
  updateArticulo: async (
    id: number,
    payload: Partial<CreateArticuloPayload>
  ): Promise<ArticuloResponse> => {
    const { data } = await apiClient.put(`${BASE_URL}/${id}`, payload);
    return data.data || data;
  },

  /**
   * Delete an articulo
   */
  deleteArticulo: async (id: number): Promise<void> => {
    await apiClient.delete(`${BASE_URL}/${id}`);
  },

  /**
   * Fetch all grupos (groups)
   */
  getGrupos: async (): Promise<Grupo[]> => {
    const { data } = await apiClient.get(GRUPOS_URL);
    return data.data || data;
  },
};
