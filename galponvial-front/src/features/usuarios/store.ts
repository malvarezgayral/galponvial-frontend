import { create } from 'zustand';
import { usuariosService } from '@/features/usuarios/services/usuariosService';
import { handleApiError } from '@/services/errorHandler';
import type { User, Role, Permission, RolePermissionStructure } from '@/features/usuarios/types';
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

  // Role-Permission Structure
  rolePermissionStructure: RolePermissionStructure;
  loadingStructure: boolean;

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
  actualizarPorDni: (dni: number, data: UpdateUserDto) => Promise<User | null>;
  actualizarRol: (dni: number, rol: 'user' | 'admin' | 'superuser') => Promise<User | null>;
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
  actualizarRolGestion: (id: string, data: Partial<Role>) => Promise<Role | null>;
  eliminarRol: (id: string) => Promise<boolean>;

  // Permissions Actions
  fetchPermisos: () => Promise<void>;
  getPermisosPorModulo: (modulo: string) => Promise<Permission[]>;

  // Role-Permission Structure Actions
  fetchRolePermissionStructure: () => Promise<void>;
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
  rolePermissionStructure: [],
  loadingStructure: false,
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

  actualizarUsuario: async (id: string, data: UpdateUserDto) => {
    try {
      set({ isLoading: true, error: null });
      const usuario = await usuariosService.update(id, data);
      set((state: UsuariosState) => ({
        usuarios: state.usuarios.map((u: User) => (u.dni === usuario.dni ? usuario : u)),
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

crearUsuario: async (data: CreateUserDto) => {
    try {
      set({ isLoading: true, error: null });
      const usuario = await usuariosService.create(data);
      set((state: UsuariosState) => ({
        usuarios: [usuario, ...state.usuarios],
        usuariosTotal: state.usuariosTotal + 1,
      }));
      return usuario;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // 1. Intentamos obtener el mensaje del backend (ej: "La contraseña debe contener...")
      const dataError = error.response?.data;
      const backendMsg = dataError?.message || dataError?.error;
      
      let errorMessage = 'Error desconocido al comunicarse con el servidor.';

      if (Array.isArray(backendMsg)) {
        errorMessage = backendMsg.join('. ');
      } else if (typeof backendMsg === 'string') {
        errorMessage = backendMsg;
      } else if (error.message) {
        if (error.message === 'Network Error') errorMessage = 'Error de red. Verifica tu conexión a internet.';
        else if (error.message.includes('400')) errorMessage = 'Solicitud incorrecta. Verifica los datos ingresados.';
        else if (error.message.includes('401')) errorMessage = 'No tienes autorización para realizar esta acción.';
        else if (error.message.includes('403')) errorMessage = 'Acceso denegado.';
        else if (error.message.includes('404')) errorMessage = 'Recurso no encontrado.';
        else if (error.message.includes('500')) errorMessage = 'Error interno del servidor. Intenta más tarde.';
      }
        
      set({ error: errorMessage });
      throw new Error(errorMessage); 
    } finally {
      set({ isLoading: false });
    }
  },

  actualizarPorDni: async (dni: number, data: UpdateUserDto) => {
    try {
      set({ isLoading: true, error: null });
      const usuario = await usuariosService.updateByDni(dni, data);
      set((state: UsuariosState) => ({
        usuarios: state.usuarios.map((u: User) => (u.dni === dni ? usuario : u)),
        usuarioSeleccionado: usuario,
      }));
      return usuario;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const dataError = error.response?.data;
      const backendMsg = dataError?.message || dataError?.error;
      
      let errorMessage = 'Error desconocido al comunicarse con el servidor.';

      if (Array.isArray(backendMsg)) {
        errorMessage = backendMsg.join('. ');
      } else if (typeof backendMsg === 'string') {
        errorMessage = backendMsg;
      } else if (error.message) {
        if (error.message === 'Network Error') errorMessage = 'Error de red. Verifica tu conexión a internet.';
        else if (error.message.includes('400')) errorMessage = 'Solicitud incorrecta. Verifica los datos ingresados.';
        else if (error.message.includes('401')) errorMessage = 'No tienes autorización para realizar esta acción.';
        else if (error.message.includes('403')) errorMessage = 'Acceso denegado.';
        else if (error.message.includes('404')) errorMessage = 'Recurso no encontrado.';
        else if (error.message.includes('500')) errorMessage = 'Error interno del servidor. Intenta más tarde.';
      }
        
      set({ error: errorMessage });
      throw new Error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  actualizarRol: async (dni: number, rol: 'user' | 'admin' | 'superuser') => {
    try {
      set({ isLoading: true, error: null });
      const usuario = await usuariosService.updateRol(dni, rol);
      set((state: UsuariosState) => ({
        usuarios: state.usuarios.map((u: User) => (u.dni === dni ? usuario : u)),
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
        usuarios: state.usuarios.filter((u: User) => u.dni !== parseInt(id, 10)),
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
        usuarios: state.usuarios.map((u: User) => (u.dni === usuario.dni ? usuario : u)),
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

  actualizarRolGestion: async (id: string, data: Partial<Role>) => {
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

  // Role-Permission Structure Actions
  fetchRolePermissionStructure: async () => {
    try {
      set({ loadingStructure: true, error: null });
      const structure = await usuariosService.getRolePermissionStructure();
      set({ rolePermissionStructure: structure });
    } catch (error) {
      const apiError = handleApiError(error);
      set({ error: apiError.message });
    } finally {
      set({ loadingStructure: false });
    }
  },
}));
