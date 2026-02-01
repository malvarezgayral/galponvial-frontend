import { useAppStore } from '@/app/stores/appStore';
import type { Permission, User } from '@/features/usuarios/types';

/**
 * Hook para verificar permisos de almacén
 * Permisos disponibles:
 * - almacen-taller:read / almacen-taller:write
 * - almacen-comun:read / almacen-comun:write
 * - all:read / all:write
 */
export const useAlmacenPermissions = () => {
  const { user } = useAppStore();

  /**
   * Obtiene los permisos del usuario
   */
  const getPermissions = () => {
    if (!user) return [];
    // Check if user has permisos property (type narrowing for User type)
    const userWithPermisos = user as User;
    return (userWithPermisos.permisos || []) as Permission[];
  };

  /**
   * Verifica si el usuario tiene permiso de escritura en almacén
   * Busca: almacen-taller:write, almacen-comun:write, o all:write
   */
  const hasWritePermission = () => {
    const perms = getPermissions();
    return perms.some((p) => 
      p.nombre === 'almacen-taller:write' || 
      p.nombre === 'almacen-comun:write' || 
      p.nombre === 'all:write'
    );
  };

  /**
   * Verifica si el usuario tiene permiso de lectura en almacén
   * Busca: almacen-taller:read, almacen-comun:read, o all:read
   */
  const hasReadPermission = () => {
    const perms = getPermissions();
    return perms.some((p) => 
      p.nombre === 'almacen-taller:read' || 
      p.nombre === 'almacen-comun:read' || 
      p.nombre === 'all:read'
    );
  };

  /**
   * Verifica si el usuario tiene un permiso específico de almacén
   */
  const hasPermission = (permissionName: string) => {
    const perms = getPermissions();
    return perms.some((p) => p.nombre === permissionName);
  };

  /**
   * Obtiene solo los permisos de almacén del usuario
   */
  const getAlmacenPermissions = () => {
    const perms = getPermissions();
    return perms.filter((p) => 
      p.nombre.includes('almacen') || p.nombre.includes('all')
    );
  };

  return {
    getPermissions,
    getAlmacenPermissions,
    hasWritePermission,
    hasReadPermission,
    hasPermission,
  };
};
