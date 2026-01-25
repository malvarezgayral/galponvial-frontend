import { useAppStore } from '@/app/stores/appStore';
import type { Permission } from '../types';

/**
 * Hook to check admin permissions
 * @returns {Object} Object with permission checking functions
 */
export const useAdminPermissions = () => {
  const { user } = useAppStore();

  return {
    /**
     * Check if user is admin or super-admin
     */
    isAdmin: () => {
      return user?.rol === 'admin' || user?.rol === 'super-admin';
    },

    /**
     * Check if user is super-admin
     */
    isSuperAdmin: () => {
      return user?.rol === 'super-admin';
    },

    /**
     * Check if user can create admins (only super-admin)
     */
    canCreateAdmin: () => {
      return user?.rol === 'super-admin';
    },

    /**
     * Check if user can manage roles (only super-admin)
     */
    canManageRoles: () => {
      return user?.rol === 'super-admin';
    },

    /**
     * Check if user can reset password for others
     */
    canResetPassword: () => {
      return user?.rol === 'admin' || user?.rol === 'super-admin';
    },

    /**
     * Check if user can delete users (only super-admin)
     */
    canDeleteUsers: () => {
      return user?.rol === 'super-admin';
    },

    /**
     * Check if user has a specific permission
     */
    hasPermission: (permission: string) => {
      if (!user) return false;
      const perms = (user.permisos || []) as Permission[];
      return perms.some((p) => p.nombre === permission) || false;
    },

    /**
     * Check if user has access to admin panel
     */
    hasAdminAccess: () => {
      return user?.rol === 'admin' || user?.rol === 'super-admin';
    },
  };
};
