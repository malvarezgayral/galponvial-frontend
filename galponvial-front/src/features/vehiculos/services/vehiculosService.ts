import { apiClient } from '@/services/api';
import { API_ENDPOINTS } from '@/services/apiEndpoints';
import type {
  Vehiculo,
  CreateVehiculoPayload,
  DropdownData,
  RecordatoriosResponse,
  StatusUpdatesResponse,
  IncidentesResponse,
  CargasCombustibleResponse,
  CargaCombustible,
  Incidente,
  Recordatorio,
  VehiculosEnums,
  EnumsApiResponse,
} from '../types';

/**
 * Service for vehicle-related API calls
 */
export const vehiculosService = {
  /**
   * Convert enums to DropdownData format
   */
  enumsToDropdownData: (enums: VehiculosEnums): DropdownData => {
    return {
      tiposVehiculo: enums.TipoVehiculo.map((tipo, index) => ({
        id: index + 1,
        label: tipo.charAt(0).toUpperCase() + tipo.slice(1).replace(/_/g, ' '),
        value: tipo,
      })),
      estados: enums.VehiculoStatus.map((status, index) => ({
        id: index + 1,
        label: status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' '),
        value: status,
      })),
      // Map sectoresPertenencia from Sector enum
      sectoresPertenencia: enums.Sector.map((sector, index) => ({
        id: index + 1,
        label: sector,
        value: index + 1,
      })),
    };
  },
  /**
   * Fetch all vehicles
   * @returns Array of vehicles
   */
  getAll: async (): Promise<Vehiculo[]> => {
    const { data } = await apiClient.get(API_ENDPOINTS.VEHICULOS.LIST);
    // Handle both wrapped response and direct array response
    if (data && typeof data === 'object' && 'data' in data) {
      return Array.isArray(data.data) ? data.data : [data.data];
    }
    return Array.isArray(data) ? data : [];
  },

  /**
   * Fetch a vehicle by ID
   * @param id - Vehicle ID
   * @returns Vehicle details
   */
  getById: async (id: string): Promise<Vehiculo> => {
    const { data } = await apiClient.get(API_ENDPOINTS.VEHICULOS.DETAIL(id));
    return data;
  },

  /**
   * Create a new vehicle
   * @param vehiculo - Vehicle data to create
   * @returns Created vehicle with ID
   */
  create: async (vehiculo: CreateVehiculoPayload): Promise<Vehiculo> => {
    const { data } = await apiClient.post(API_ENDPOINTS.VEHICULOS.CREATE, vehiculo);
    return data;
  },

  /**
   * Update an existing vehicle (PATCH)
   * @param id - Vehicle ID
   * @param vehiculo - Vehicle data to update (partial)
   * @returns Updated vehicle
   */
  update: async (id: string, vehiculo: Partial<Vehiculo>): Promise<Vehiculo> => {
    const { data } = await apiClient.patch(API_ENDPOINTS.VEHICULOS.UPDATE(id), vehiculo);
    // Handle both wrapped response and direct object response
    if (data && typeof data === 'object' && 'data' in data) {
      return data.data;
    }
    return data;
  },

  /**
   * Soft delete a vehicle (logical deletion)
   * @param id - Vehicle ID
   */
  softDelete: async (id: string): Promise<void> => {
    await apiClient.put(`${API_ENDPOINTS.VEHICULOS.DELETE(id)}/eliminar`, { eliminado: true });
  },

  /**
   * Fetch dropdown options for vehicle creation/editing
   * TODO: Replace with actual API endpoint when available
   * @returns Object with dropdown options for tipos, estados, and sectores
   */
  getDropdownOptions: async (): Promise<DropdownData> => {
    // Mock data - replace with actual API call when backend is ready
    return {
      tiposVehiculo: [
        { id: 1, label: 'Camioneta', value: 'camioneta' },
        { id: 2, label: 'Auto', value: 'auto' },
        { id: 3, label: 'Camión', value: 'camion' },
        { id: 4, label: 'Moto', value: 'moto' },
        { id: 5, label: 'Utilitario', value: 'utilitario' },
      ],
      estados: [
        { id: 1, label: 'Disponible', value: 'disponible' },
        { id: 2, label: 'Mantenimiento', value: 'mantenimiento' },
        { id: 3, label: 'En uso', value: 'en_uso' },
        { id: 4, label: 'Retirado', value: 'retirado' },
      ],
      sectoresPertenencia: [
        { id: 1, label: 'Sector Centro', value: 1 },
        { id: 2, label: 'Sector Puerto', value: 2 },
        { id: 3, label: 'Sector Rural', value: 3 },
        { id: 4, label: 'Sector Costa', value: 4 },
      ],
    };
  },

  /**
   * Fetch enums from API for vehicle-related entities
   * @returns Object with arrays of enum values
   */
  getEnums: async (): Promise<VehiculosEnums> => {
    try {
      const { data } = await apiClient.get('/vehiculos/enums/estructura');
      // Handle both wrapped response and direct data response
      if (data && typeof data === 'object' && 'data' in data) {
        return (data as EnumsApiResponse).data;
      }
      return data;
    } catch (error) {
      console.error('Error fetching enums:', error);
      throw error;
    }
  },

  /**
   * Fetch reminders for a vehicle
   * @param vehiculoId - Vehicle ID
   * @param page - Page number (default: 1)
   * @param pageSize - Items per page (default: 5)
   * @returns Paginated recordatorios
   */
  getRecordatorios: async (
    vehiculoId: number,
    page: number = 1,
    pageSize: number = 5
  ): Promise<RecordatoriosResponse> => {
    const { data } = await apiClient.get(
      `/vehiculos/${vehiculoId}/recordatorios-paginado?page=${page}&pageSize=${pageSize}`
    );
    return data.data || data;
  },

  /**
   * Fetch status updates for a vehicle
   * @param vehiculoId - Vehicle ID
   * @param page - Page number (default: 1)
   * @param pageSize - Items per page (default: 5)
   * @returns Paginated status updates
   */
  getStatusUpdates: async (
    vehiculoId: number,
    page: number = 1,
    pageSize: number = 5
  ): Promise<StatusUpdatesResponse> => {
    const { data } = await apiClient.get(
      `/vehiculos/${vehiculoId}/status-updates?page=${page}&pageSize=${pageSize}`
    );
    return data.data || data;
  },

  /**
   * Fetch incidents for a vehicle
   * @param vehiculoId - Vehicle ID
   * @param page - Page number (default: 1)
   * @param pageSize - Items per page (default: 10)
   * @returns Paginated incidentes
   */
  getIncidentes: async (
    vehiculoId: number,
    page: number = 1,
    pageSize: number = 10
  ): Promise<IncidentesResponse> => {
    const { data } = await apiClient.get(
      `/vehiculos/${vehiculoId}/incidentes?page=${page}&pageSize=${pageSize}`
    );
    return data.data || data;
  },

  /**
   * Fetch fuel charges for a vehicle
   * @param vehiculoId - Vehicle ID
   * @param page - Page number (default: 1)
   * @param pageSize - Items per page (default: 5)
   * @returns Paginated cargas de combustible
   */
  getCargasCombustible: async (
    vehiculoId: number,
    page: number = 1,
    pageSize: number = 5
  ): Promise<CargasCombustibleResponse> => {
    const { data } = await apiClient.get(
      `/vehiculos/${vehiculoId}/combustible-cargas?page=${page}&pageSize=${pageSize}`
    );
    return data.data || data;
  },

  /**
   * Create a new recordatorio for a vehicle
   * @param vehiculoId - Vehicle ID
   * @param payload - Recordatorio data
   * @returns Created recordatorio
   */
  createRecordatorio: async (
    vehiculoId: number,
    payload: { fecha: string; descripcion: string }
  ): Promise<Recordatorio> => {
    const { data } = await apiClient.post(
      `/vehiculos/${vehiculoId}/recordatorios`,
      payload
    );
    return data.data || data;
  },

  /**
   * Create a new carga de combustible for a vehicle
   * @param vehiculoId - Vehicle ID
   * @param payload - Carga data
   * @returns Created carga
   */
  createCargaCombustible: async (
    vehiculoId: number,
    payload: {
      fecha_carga: string;
      despachante: string;
      km_actual: number;
      cant_combustible_despachado: number;
    }
  ): Promise<CargaCombustible> => {
    const { data } = await apiClient.post(
      `/vehiculos/${vehiculoId}/combustible-cargas`,
      payload
    );
    return data.data || data;
  },

  /**
   * Create a new incidente for a vehicle
   * @param vehiculoId - Vehicle ID
   * @param payload - Incidente data
   * @returns Created incidente
   */
  createIncidente: async (
    vehiculoId: number,
    payload: {
      fecha: string;
      tipo: string;
      descripcion: string;
      falla: 'baja' | 'media' | 'alta';
      id_usuario: number;
    }
  ): Promise<Incidente> => {
    const { id_usuario } = payload;
    console.log(id_usuario)
    const dniNumber = Number(id_usuario);
    console.log('Creating incidente with DNI:', dniNumber);
    if (isNaN(dniNumber)) {
      throw new Error('DNI must be a valid number');
    }
    payload.id_usuario = dniNumber;
    const { data } = await apiClient.post(
      `/vehiculos/${vehiculoId}/incidentes`,
      payload
    );
    return data.data || data;
  },
};
