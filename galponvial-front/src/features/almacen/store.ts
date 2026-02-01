import { create } from 'zustand';
import { almacenService } from './services/almacenService';
import type { Articulo } from './types';

interface AlmacenState {
  articulos: Articulo[];
  loading: boolean;
  error: string | null;
  setArticulos: (articulos: Articulo[]) => void;
  updateArticulo: (id: number, payload: Partial<Articulo>) => Promise<void>;
  removeArticulo: (id: number) => Promise<void>;
}

export const useAlmacenStore = create<AlmacenState>((set, get) => ({
  articulos: [],
  loading: false,
  error: null,

  setArticulos: (articulos) => set({ articulos }),

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
}));
