import { apiClient } from '@/services/api';
import { API_ENDPOINTS } from '@/services/apiEndpoints';
import type { Vehiculo, CreateVehiculoPayload, DropdownData } from '../types';

/**
 * Service for vehicle-related API calls
 */
export const vehiculosService = {
  /**
   * Fetch all vehicles
   * @returns Array of vehicles
   */
  getAll: async (): Promise<Vehiculo[]> => {
    const { data } = await apiClient.get(API_ENDPOINTS.VEHICULOS.LIST);
    return data;
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
   * Update an existing vehicle
   * @param id - Vehicle ID
   * @param vehiculo - Vehicle data to update
   * @returns Updated vehicle
   */
  update: async (id: string, vehiculo: Partial<Vehiculo>): Promise<Vehiculo> => {
    const { data } = await apiClient.put(API_ENDPOINTS.VEHICULOS.UPDATE(id), vehiculo);
    return data;
  },

  /**
   * Delete a vehicle
   * @param id - Vehicle ID
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.VEHICULOS.DELETE(id));
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
};
