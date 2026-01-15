import { create } from 'zustand';
import { authService } from '@/services/auth';
import type { User } from '@/features/usuarios/types';

interface AppState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  setUser: (user) => set({ user }),

  logout: async () => {
    try {
      set({ isLoading: true });
      await authService.logout();
      set({ user: null, error: null });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Logout failed' });
    } finally {
      set({ isLoading: false });
    }
  },
}));
