import { useAppStore } from '@/app/stores/appStore';
import type { Permission, User } from '../types';

/**
 * Hook to check admin permissions
 * @returns {Object} Object with permission checking functions
 */
export const useAdminPermissions = () => {
  const { user } = useAppStore();

  const nombresPermisos = (): string[] =>
    (((user as User | null)?.permisos || []) as unknown as Array<Permission | string>).map((p) =>
      typeof p === 'string' ? p : p.nombre,
    );

  return {
    /**
     * Check if user is admin or superadmin
     */
    isAdmin: () => {
      return user?.rol === 'admin' || user?.rol === 'superadmin';
    },

    /**
     * Check if user is superadmin
     */
    isSuperAdmin: () => {
      return user?.rol === 'superadmin';
    },

    /**
     * Check if user can create admins (only superadmin)
     */
    canCreateAdmin: () => {
      return user?.rol === 'superadmin';
    },

    /**
     * Check if user can manage roles (only superadmin)
     */
    canManageRoles: () => {
      return user?.rol === 'superadmin';
    },

    /**
     * Check if user can reset password for others
     */
    canResetPassword: () => {
      return user?.rol === 'admin' || user?.rol === 'superadmin';
    },

    /**
     * Check if user can delete users (only superadmin)
     */
    canDeleteUsers: () => {
      return user?.rol === 'superadmin';
    },

    /**
     * Check if user has a specific permission
     */
    hasPermission: (permission: string) => {
      if (!user) return false;
      const userWithPermisos = user as User;
      const perms = (userWithPermisos.permisos || []) as Permission[];
      return perms.some((p) => p.nombre === permission) || false;
    },

    /**
     * Check if user has access to admin panel
     */
    hasAdminAccess: () => {
      return user?.rol === 'admin' || user?.rol === 'superadmin';
    },

    /**
     * Check if user has full system access (superadmin, or admin with global permisos).
     * An admin without all:read/all:write is considered "acotado" -- scoped to a specific module.
     */
    hasFullAccess: () => {
      if (!user) return false;
      if (user?.rol === 'superadmin') return true;
      if (user?.rol !== 'admin') return false;
      const userWithPermisos = user as User;
      const perms = (userWithPermisos.permisos || []) as Permission[];
      return perms.some((p) => p.nombre === 'all:read' || p.nombre === 'all:write');
    },

    /**
     * Acceso a la seccion Usuarios: superadmin, o admin con all:write.
     * Un admin con solo all:read no la ve.
     */
    canAccessUsuarios: () => {
      if (!user) return false;
      if (user?.rol === 'superadmin') return true;
      if (user?.rol !== 'admin') return false;
      const userWithPermisos = user as User;
      const perms = (userWithPermisos.permisos || []) as Permission[];
      return perms.some((p) => p.nombre === 'all:write');
    },

    /**
     * Personal: ver. Rol admin o superadmin con personal:read o personal:write.
     * Replica lo que exige el backend (ScopedAuth + ScopedReadPermissions).
     */
    canReadPersonal: () => {
      if (!user) return false;
      if (user?.rol !== 'admin' && user?.rol !== 'superadmin') return false;
      const perms = ((user as User).permisos || []) as unknown as Array<Permission | string>;
      return perms.some((p) => {
        const n = typeof p === 'string' ? p : p.nombre;
        return n === 'personal:read' || n === 'personal:write';
      });
    },

    /**
     * Personal: crear y editar. Rol admin con personal:write (superadmin no).
     */
    canWritePersonal: () => {
      if (!user) return false;
      if (user?.rol !== 'admin') return false;
      const perms = ((user as User).permisos || []) as unknown as Array<Permission | string>;
      return perms.some((p) => (typeof p === 'string' ? p : p.nombre) === 'personal:write');
    },

    /**
     * Acceso por modulo. Solo restringe a admin y superadmin; user conserva
     * el comportamiento anterior (lo decide el backend). all:read y all:write
     * valen como comodin; en escritura Lubricentro queda afuera (pide su fila).
     */
    canReadModulo: (modulo: string) => {
      if (!user) return false;
      if (user.rol !== 'admin' && user.rol !== 'superadmin') return true;
      const n = nombresPermisos();
      // El menu Servicios se ve con cualquier permiso que no sea solo de Almacen
      if (modulo === 'servicios') return n.some((x) => !x.startsWith('almacen-'));
      const comodin = n.includes('all:read') || n.includes('all:write');
      return comodin || n.includes(modulo + ':read') || n.includes(modulo + ':write');
    },

    canWriteModulo: (modulo: string) => {
      if (!user) return false;
      if (user.rol !== 'admin' && user.rol !== 'superadmin') return false;
      const n = nombresPermisos();
      const comodin = modulo !== 'lubricentro' && n.includes('all:write');
      return comodin || n.includes(modulo + ':write');
    },
  };
};
