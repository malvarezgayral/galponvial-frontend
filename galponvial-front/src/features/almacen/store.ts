import { create } from 'zustand';
import { almacenService } from './services/almacenService';
import type { Articulo } from './types';

interface AlmacenState {
  articulos: Articulo[];
  loading: boolean;
  error: string | null;
  setArticulos: (articulos: Articulo[]) => void;
  updateArticulo: (id: number, payload: Partial<Articulo>) => Promise<void>;
  deleteArticulo: (id: number) => Promise<void>;
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
        a.id_articulo === id ? { ...a, ...updated } : a
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

  deleteArticulo: async (id) => {
    try {
      set({ loading: true, error: null });
      await almacenService.deleteArticulo(id);
      const state = get();
      const filteredArticulos = state.articulos.filter((a) => a.id_articulo !== id);
      set({ articulos: filteredArticulos });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al eliminar artículo';
      set({ error: message });
      throw err;
    } finally {
      set({ loading: false });
    }
  },
}));
