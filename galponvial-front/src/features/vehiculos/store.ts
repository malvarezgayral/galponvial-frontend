import { create } from 'zustand';
import { vehiculosService } from './services/vehiculosService';
import type { CreateVehiculoPayload, DropdownData, Vehiculo } from './types';

interface VehiculosFilters {
  estado: string | null;
  tipo: string | null;
  sector: string | null;
  searchTerm: string;
}

interface VehiculosState {
  // Dropdown data
  dropdownData: DropdownData | null;
  dropdownLoading: boolean;
  dropdownError: string | null;

  // Create vehicle
  createLoading: boolean;
  createError: string | null;
  createSuccess: boolean;

  // Vehicles list
  vehiculos: Vehiculo[];
  filteredVehiculos: Vehiculo[];
  listLoading: boolean;
  listError: string | null;

  // Filters
  filters: VehiculosFilters;

  // Actions
  fetchDropdownOptions: () => Promise<void>;
  createVehiculo: (vehiculo: CreateVehiculoPayload) => Promise<void>;
  resetCreateState: () => void;
  fetchAllVehiculos: () => Promise<void>;
  setFilter: (filterKey: keyof VehiculosFilters, value: any) => void;
  resetFilters: () => void;
  updateVehiculo: (id: number, vehiculo: Partial<Vehiculo>) => Promise<void>;
  deleteVehiculo: (id: number) => Promise<void>;
}

/**
 * Helper function to apply filters to vehicles
 */
const applyFilters = (vehiculos: Vehiculo[], filters: VehiculosFilters): Vehiculo[] => {
  return vehiculos.filter((vehiculo) => {
    // Filter by estado
    if (filters.estado && vehiculo.status !== filters.estado) {
      return false;
    }

    // Filter by tipo
    if (filters.tipo && vehiculo.tipo_vehiculo !== filters.tipo) {
      return false;
    }

    // Filter by sector
    if (filters.sector && vehiculo.infoAdicional.id_sector_pertenencia !== Number(filters.sector)) {
      return false;
    }

    // Filter by search term (nombre or codigo)
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      const codigoMatch = vehiculo.codigo.toLowerCase().includes(searchLower);
      const nombreMatch = vehiculo.nombre.toLowerCase().includes(searchLower);
      if (!codigoMatch && !nombreMatch) {
        return false;
      }
    }

    return true;
  });
};

export const useVehiculosStore = create<VehiculosState>((set, get) => ({
  dropdownData: null,
  dropdownLoading: false,
  dropdownError: null,

  createLoading: false,
  createError: null,
  createSuccess: false,

  vehiculos: [],
  filteredVehiculos: [],
  listLoading: false,
  listError: null,

  filters: {
    estado: null,
    tipo: null,
    sector: null,
    searchTerm: '',
  },

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

  /**
   * Fetch all vehicles
   */
  fetchAllVehiculos: async () => {
    set({ listLoading: true, listError: null });
    try {
      const data = await vehiculosService.getAll();
      const vehiculos = Array.isArray(data) ? data : [];
      console.log(vehiculos)
      const filtered = applyFilters(vehiculos, get().filters);
      set({ vehiculos, filteredVehiculos: filtered });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al cargar vehículos';
      set({ listError: message });
    } finally {
      set({ listLoading: false });
    }
  },

  /**
   * Set a filter and apply all filters
   */
  setFilter: (filterKey: keyof VehiculosFilters, value: any) => {
    const newFilters = { ...get().filters, [filterKey]: value };
    const filtered = applyFilters(get().vehiculos, newFilters);
    set({ filters: newFilters, filteredVehiculos: filtered });
  },

  /**
   * Reset all filters
   */
  resetFilters: () => {
    const resetFilters: VehiculosFilters = {
      estado: null,
      tipo: null,
      sector: null,
      searchTerm: '',
    };
    const filtered = applyFilters(get().vehiculos, resetFilters);
    set({ filters: resetFilters, filteredVehiculos: filtered });
  },

  /**
   * Update a vehicle
   */
  updateVehiculo: async (id: string, vehiculo: Partial<Vehiculo>) => {
    try {
      const updated = await vehiculosService.update(id, vehiculo);
      const vehiculos = get().vehiculos.map((v) => (v.id === id ? updated : v));
      const filtered = applyFilters(vehiculos, get().filters);
      set({ vehiculos, filteredVehiculos: filtered });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al actualizar vehículo';
      throw new Error(message);
    }
  },

  /**
   * Delete a vehicle
   */
  deleteVehiculo: async (id: string) => {
    try {
      await vehiculosService.delete(id);
      const vehiculos = get().vehiculos.filter((v) => v.id !== id);
      const filtered = applyFilters(vehiculos, get().filters);
      set({ vehiculos, filteredVehiculos: filtered });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al eliminar vehículo';
      throw new Error(message);
    }
  },
}));
