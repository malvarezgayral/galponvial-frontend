import { useAppStore } from '@/app/stores/appStore';
import type { Permission, User } from '../types';

/**
 * Hook to check admin permissions
 * @returns {Object} Object with permission checking functions
 */
export const useAdminPermissions = () => {
  const { user } = useAppStore();

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
  };
};
