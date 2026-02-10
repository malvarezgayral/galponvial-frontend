import { apiClient } from '@/services/api';
import type { CreateArticuloPayload, ArticuloResponse, ArticulosListResponse, Grupo, Movimiento, Articulo, SectorDto, UpdateGrupoPayload } from '../types';
import { API_ENDPOINTS } from '@/services/apiEndpoints';

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
 getArticuloById: async (id: number): Promise<Articulo> => {
    const { data } = await apiClient.get(API_ENDPOINTS.ALMACEN.DETAIL(id));
    return data.data; 
  },

getMovimientos: async (idArticulo: number): Promise<Movimiento[]> => {
    const { data } = await apiClient.get(API_ENDPOINTS.ALMACEN.MOVIMIENTOS(idArticulo));
    
    const rawMovimientos = Array.isArray(data) ? data : (data.data || []);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return rawMovimientos.map((m: any) => ({
        tipoMovimiento: m.tipo_movimiento || m.tipoMovimiento || 'Desconocido',
        
        fecha: m.fecha || m.createdAt || m.created_at || new Date().toISOString(),
        
        dniUsuario: m.dniUsuario || 'Sistema',
        
        motivo: m.motivo || '-',
        detalle: m.detalle || '-'
    }));
},
  /**
   * Create a new articulo
   */
createArticulo: async (payload: FormData): Promise<ArticuloResponse> => {
    const { data } = await apiClient.post(BASE_URL, payload, {
        headers: {
            'Content-Type': 'multipart/form-data', 
        },
    });
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

  /**
   * Obtener un grupo por ID (Detalle)
   */
  getGrupoById: async (id: number): Promise<Grupo> => {
    const { data } = await apiClient.get(`${GRUPOS_URL}/${id}`);
    return data.data || data;
  },

  /**
   * Actualizar un grupo
   */
  updateGrupo: async (id: number, payload: Partial<UpdateGrupoPayload>): Promise<Grupo> => {
    const { data } = await apiClient.put(`${GRUPOS_URL}/${id}`, payload);
    return data.data || data;
  },

  /**
   * Eliminar un grupo
   */
  deleteGrupo: async (id: number): Promise<void> => {
    await apiClient.delete(`${GRUPOS_URL}/${id}`);
  },

  getSectores: async (): Promise<SectorDto[]> => {
    const { data } = await apiClient.get(API_ENDPOINTS.ALMACEN.SECTORES);
    return data.data || data;
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createMovimiento: async (payload: any) => {
    const { data } = await apiClient.post(
      API_ENDPOINTS.ALMACEN.CREATE_MOVIMIENTO,
      payload
    );
    return data;
},

  createGrupoArticulo(payload: {
      nombre: string;
      descripcion: string;
      sector_id: number;
    }) {
      return apiClient.post(API_ENDPOINTS.ALMACEN.GRUPOS, payload);
    },


};
