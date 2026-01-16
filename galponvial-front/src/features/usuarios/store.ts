import { create } from 'zustand';
import { usuariosService } from '@/features/usuarios/services/usuariosService';
import { handleApiError } from '@/services/errorHandler';
import type { User, Role, Permission } from '@/features/usuarios/types';
import type { CreateUserDto, UpdateUserDto } from '@/features/usuarios/types';

interface UsuariosState {
  // Users
  usuarios: User[];
  usuarioSeleccionado: User | null;
  usuariosTotal: number;
  usuariosPagina: number;
  usuariosPageSize: number;

  // Roles
  roles: Role[];
  rolesSeleccionados: Role[];

  // Permissions
  permisos: Permission[];

  // UI State
  isLoading: boolean;
  error: string | null;
  modalAbierto: boolean;
  modoEdicion: boolean;

  // Users Actions
  fetchUsuarios: (page?: number, pageSize?: number) => Promise<void>;
  fetchUsuarioById: (id: string) => Promise<void>;
  crearUsuario: (data: CreateUserDto) => Promise<User | null>;
  actualizarUsuario: (id: string, data: UpdateUserDto) => Promise<User | null>;
  eliminarUsuario: (id: string) => Promise<boolean>;
  toggleUsuarioActivo: (id: string) => Promise<void>;
  resetearPassword: (id: string, newPassword: string) => Promise<void>;
  setUsuarioSeleccionado: (usuario: User | null) => void;
  setModoEdicion: (modo: boolean) => void;
  setModalAbierto: (abierto: boolean) => void;
  setUsuariosPagina: (pagina: number) => void;

  // Roles Actions
  fetchRoles: () => Promise<void>;
  crearRol: (data: Omit<Role, 'id'>) => Promise<Role | null>;
  actualizarRol: (id: string, data: Partial<Role>) => Promise<Role | null>;
  eliminarRol: (id: string) => Promise<boolean>;

  // Permissions Actions
  fetchPermisos: () => Promise<void>;
  getPermisosPorModulo: (modulo: string) => Promise<Permission[]>;
}

export const useUsuariosStore = create<UsuariosState>((set) => ({
  // Initial state
  usuarios: [],
  usuarioSeleccionado: null,
  usuariosTotal: 0,
  usuariosPagina: 1,
  usuariosPageSize: 10,
  roles: [],
  rolesSeleccionados: [],
  permisos: [],
  isLoading: false,
  error: null,
  modalAbierto: false,
  modoEdicion: false,

  // Users Actions
  fetchUsuarios: async (page, pageSize) => {
    try {
      set({ isLoading: true, error: null });
      const result = await usuariosService.getAll(page, pageSize);
      const total = Array.isArray(result) ? result.length : 0;

      set({
        usuarios: Array.isArray(result) ? result : [],
        usuariosTotal: total,
        usuariosPagina: page,
        usuariosPageSize: pageSize,
      });
    } catch (error) {
      const apiError = handleApiError(error);
      set({ error: apiError.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchUsuarioById: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const usuario = await usuariosService.getById(id);
      set({ usuarioSeleccionado: usuario });
    } catch (error) {
      const apiError = handleApiError(error);
      set({ error: apiError.message });
    } finally {
      set({ isLoading: false });
    }
  },

  crearUsuario: async (data: CreateUserDto) => {
    try {
      set({ isLoading: true, error: null });
      const usuario = await usuariosService.create(data);
      set((state: UsuariosState) => ({
        usuarios: [usuario, ...state.usuarios],
        usuariosTotal: state.usuariosTotal + 1,
      }));
      return usuario;
    } catch (error) {
      const apiError = handleApiError(error);
      set({ error: apiError.message });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  actualizarUsuario: async (id: string, data: UpdateUserDto) => {
    try {
      set({ isLoading: true, error: null });
      const usuario = await usuariosService.update(id, data);
      set((state: UsuariosState) => ({
        usuarios: state.usuarios.map((u: User) => (u.id === id ? usuario : u)),
        usuarioSeleccionado: usuario,
      }));
      return usuario;
    } catch (error) {
      const apiError = handleApiError(error);
      set({ error: apiError.message });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  eliminarUsuario: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      await usuariosService.delete(id);
      set((state: UsuariosState) => ({
        usuarios: state.usuarios.filter((u: User) => u.id !== id),
        usuariosTotal: state.usuariosTotal - 1,
      }));
      return true;
    } catch (error) {
      const apiError = handleApiError(error);
      set({ error: apiError.message });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  toggleUsuarioActivo: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const usuario = await usuariosService.toggleActive(id);
      set((state: UsuariosState) => ({
        usuarios: state.usuarios.map((u: User) => (u.id === id ? usuario : u)),
      }));
    } catch (error) {
      const apiError = handleApiError(error);
      set({ error: apiError.message });
    } finally {
      set({ isLoading: false });
    }
  },

  resetearPassword: async (id: string, newPassword: string) => {
    try {
      set({ isLoading: true, error: null });
      await usuariosService.resetPassword(id, newPassword);
    } catch (error) {
      const apiError = handleApiError(error);
      set({ error: apiError.message });
    } finally {
      set({ isLoading: false });
    }
  },

  setUsuarioSeleccionado: (usuario: User | null) => set({ usuarioSeleccionado: usuario }),
  setModoEdicion: (modo: boolean) => set({ modoEdicion: modo }),
  setModalAbierto: (abierto: boolean) => set({ modalAbierto: abierto }),
  setUsuariosPagina: (pagina: number) => set({ usuariosPagina: pagina }),

  // Roles Actions
  fetchRoles: async () => {
    try {
      set({ isLoading: true, error: null });
      const roles = await usuariosService.getAllRoles();
      set({ roles });
    } catch (error) {
      const apiError = handleApiError(error);
      set({ error: apiError.message });
    } finally {
      set({ isLoading: false });
    }
  },

  crearRol: async (data: Omit<Role, 'id'>) => {
    try {
      set({ isLoading: true, error: null });
      const rol = await usuariosService.createRole(data);
      set((state: UsuariosState) => ({
        roles: [...state.roles, rol],
      }));
      return rol;
    } catch (error) {
      const apiError = handleApiError(error);
      set({ error: apiError.message });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  actualizarRol: async (id: string, data: Partial<Role>) => {
    try {
      set({ isLoading: true, error: null });
      const rol = await usuariosService.updateRole(id, data);
      set((state: UsuariosState) => ({
        roles: state.roles.map((r) => (r.id === id ? rol : r)),
      }));
      return rol;
    } catch (error) {
      const apiError = handleApiError(error);
      set({ error: apiError.message });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  eliminarRol: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      await usuariosService.deleteRole(id);
      set((state: UsuariosState) => ({
        roles: state.roles.filter((r) => r.id !== id),
      }));
      return true;
    } catch (error) {
      const apiError = handleApiError(error);
      set({ error: apiError.message });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  // Permissions Actions
  fetchPermisos: async () => {
    try {
      set({ isLoading: true, error: null });
      const permisos = await usuariosService.getAllPermissions();
      set({ permisos });
    } catch (error) {
      const apiError = handleApiError(error);
      set({ error: apiError.message });
    } finally {
      set({ isLoading: false });
    }
  },

  getPermisosPorModulo: async (modulo: string) => {
    try {
      const permisos = await usuariosService.getPermissionsByModule(modulo);
      return permisos;
    } catch (error) {
      const apiError = handleApiError(error);
      set({ error: apiError.message });
      return [];
    }
  },
}));
