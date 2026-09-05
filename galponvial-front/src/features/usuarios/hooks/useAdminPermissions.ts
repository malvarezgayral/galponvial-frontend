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
  };
};
