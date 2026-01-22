import { create } from 'zustand';
import { vehiculosService } from './services/vehiculosService';
import type { CreateVehiculoPayload, DropdownData } from './types';

interface VehiculosState {
  // Dropdown data
  dropdownData: DropdownData | null;
  dropdownLoading: boolean;
  dropdownError: string | null;

  // Create vehicle
  createLoading: boolean;
  createError: string | null;
  createSuccess: boolean;

  // Actions
  fetchDropdownOptions: () => Promise<void>;
  createVehiculo: (vehiculo: CreateVehiculoPayload) => Promise<void>;
  resetCreateState: () => void;
}

export const useVehiculosStore = create<VehiculosState>((set) => ({
  dropdownData: null,
  dropdownLoading: false,
  dropdownError: null,

  createLoading: false,
  createError: null,
  createSuccess: false,

  /**
   * Fetch dropdown options for vehicle form
   */
  fetchDropdownOptions: async () => {
    set({ dropdownLoading: true, dropdownError: null });
    try {
      const data = await vehiculosService.getDropdownOptions();
      set({ dropdownData: data });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al cargar opciones';
      set({ dropdownError: message });
    } finally {
      set({ dropdownLoading: false });
    }
  },

  /**
   * Create a new vehicle
   */
  createVehiculo: async (vehiculo: CreateVehiculoPayload) => {
    set({ createLoading: true, createError: null, createSuccess: false });
    try {
      await vehiculosService.create(vehiculo);
      set({ createSuccess: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al crear vehículo';
      set({ createError: message });
    } finally {
      set({ createLoading: false });
    }
  },

  /**
   * Reset create vehicle state
   */
  resetCreateState: () => {
    set({ createError: null, createSuccess: false });
  },
}));
