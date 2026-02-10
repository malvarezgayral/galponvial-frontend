/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { almacenService } from './services/almacenService';
import type { Articulo, Grupo, SectorDto } from './types';

interface AlmacenFilters {
  searchTerm: string;
  unidad_tipo: string | null;
  grupo: string | null;
  stockRange: { min: number; max: number } | null;
}

interface AlmacenState {
  articulos: Articulo[];
  filteredArticulos: Articulo[];
  grupos: Grupo[];
  sectores: SectorDto[]
  loading: boolean;
  error: string | null;
  filters: AlmacenFilters;
  
  setArticulos: (articulos: Articulo[]) => void;
  updateArticulo: (id: number, payload: Partial<Articulo>) => Promise<void>;
  removeArticulo: (id: number) => Promise<void>;

  // Acciones Grupos
  fetchGrupos: () => Promise<void>;
  fetchSectores: () => Promise<void>; // Para llenar el select de edición
  setGrupos: (grupos: Grupo[]) => void;
  updateGrupo: (id: number, payload: any) => Promise<void>;
  removeGrupo: (id: number) => Promise<void>;

  setFilter: (filterKey: keyof AlmacenFilters, value: any) => void;
  resetFilters: () => void;
}

/**
 * Helper function to apply filters to articulos
 */
const applyFilters = (articulos: Articulo[], filters: AlmacenFilters): Articulo[] => {
  return articulos.filter((articulo) => {
    // Filter by unidad_tipo
    if (filters.unidad_tipo && articulo.unidad_tipo !== filters.unidad_tipo) {
      return false;
    }

    // Filter by grupo
    if (filters.grupo && articulo.grupo?.id !== Number(filters.grupo)) {
      return false;
    }

    // Filter by stock range
    if (filters.stockRange && articulo.stock !== undefined) {
      if (articulo.stock < filters.stockRange.min || articulo.stock > filters.stockRange.max) {
        return false;
      }
    }

    // Filter by search term (nombre, modelo, or codigo)
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      const nombreMatch = articulo.nombre.toLowerCase().includes(searchLower);
      const modeloMatch = articulo.modelo.toLowerCase().includes(searchLower);
      const codigoMatch = String(articulo.cod).includes(searchLower);
      if (!nombreMatch && !modeloMatch && !codigoMatch) {
        return false;
      }
    }

    return true;
  });
};

export const useAlmacenStore = create<AlmacenState>((set, get) => ({
  articulos: [],
  filteredArticulos: [],
  grupos: [],
  sectores: [],
  loading: false,
  error: null,
  filters: {
    searchTerm: '',
    unidad_tipo: null,
    grupo: null,
    stockRange: null,
  },

  setArticulos: (articulos) => {
    const filtered = applyFilters(articulos, get().filters);
    set({ articulos, filteredArticulos: filtered });
  },

  setGrupos: (grupos) => set({ grupos }),

  updateArticulo: async (id, payload) => { 
    try {
      set({ loading: true, error: null });
      
      const updated = await almacenService.updateArticulo(id, payload);
      
      const state = get();
      const updatedArticulos = state.articulos.map((a) =>
        a.cod === id ? { ...a, ...updated } : a
      );
      
      set({ articulos: updatedArticulos });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al actualizar artículo';
      set({ error: message });
      throw err;
    } finally {
      set({ loading: false });
    }
},


  removeArticulo: async (id: number) => {
    set({ loading: true, error: null });
    try {
      // 1. Llamar al servicio (asegúrate de que tu servicio use la URL corregida)
      await almacenService.deleteArticulo(id);

      // 2. Actualizar el estado local quitando el artículo eliminado
      set((state) => ({
        articulos: state.articulos.filter((art) => Number(art.cod) !== id),
        filteredArticulos: state.filteredArticulos.filter((art) => Number(art.cod) !== id),
        loading: false,
        success: true 
      }));
      
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error al eliminar', 
        loading: false 
      });
      throw error; // Re-lanzamos para que el componente sepa que falló
    }
  },

  fetchGrupos: async () => {
    set({ loading: true, error: null });
    try {
        const data = await almacenService.getGrupos();
        set({ grupos: data, loading: false });
    } catch (error) {
        set({ error: 'Error al cargar grupos', loading: false });
    }
  },

  fetchSectores: async () => {
    try {
        const data = await almacenService.getSectores();
        set({ sectores: data });
    } catch (error) {
        console.error("Error cargando sectores", error);
    }
  },

  updateGrupo: async (id, payload) => {
    set({ loading: true, error: null });
    try {
        const updated = await almacenService.updateGrupo(id, payload);
        const currentGrupos = get().grupos;
        // Actualizamos el array local
        const newGrupos = currentGrupos.map(g => g.id === id ? { ...g, ...updated } : g);
        set({ grupos: newGrupos, loading: false });
    } catch (err: any) {
        const msg = err.response?.data?.message || err.message || 'Error al actualizar grupo';
        set({ error: msg, loading: false });
        throw err;
    }
  },

  removeGrupo: async (id) => {
    set({ loading: true, error: null });
    try {
        await almacenService.deleteGrupo(id);
        const currentGrupos = get().grupos;
        set({ 
            grupos: currentGrupos.filter(g => g.id !== id),
            loading: false 
        });
    } catch (err: any) {
        // Aquí capturamos el mensaje del backend (ej: "Tiene artículos asociados")
        const msg = err.response?.data?.message || 'Error al eliminar grupo';
        set({ error: msg, loading: false });
        throw err; // Re-lanzamos para manejarlo en la UI (ej. mostrar toast)
    }
  },

  /**
   * Set a filter and apply all filters
   */
  setFilter: (filterKey: keyof AlmacenFilters, value: any) => {
    const newFilters = { ...get().filters, [filterKey]: value };
    const filtered = applyFilters(get().articulos, newFilters);
    set({ filters: newFilters, filteredArticulos: filtered });
  },

  /**
   * Reset all filters
   */
  resetFilters: () => {
    const resetFilters: AlmacenFilters = {
      searchTerm: '',
      unidad_tipo: null,
      grupo: null,
      stockRange: null,
    };
    const filtered = applyFilters(get().articulos, resetFilters);
    set({ filters: resetFilters, filteredArticulos: filtered });
  },
}));
