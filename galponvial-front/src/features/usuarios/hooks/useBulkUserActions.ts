import { useCallback } from 'react';
import { useUsuariosStore } from '../store';

/**
 * Hook for bulk user operations
 */
export const useBulkUserActions = () => {
  const { usuarios, toggleUsuarioActivo, eliminarUsuario } = useUsuariosStore();

  /**
   * Toggle active status for multiple users
   */
  const toggleMultipleActive = useCallback(
    async (userIds: string[]) => {
      const results = await Promise.allSettled(
        userIds.map((id) => toggleUsuarioActivo(id))
      );
      return results;
    },
    [toggleUsuarioActivo]
  );

  /**
   * Delete multiple users
   */
  const deleteMultiple = useCallback(
    async (userIds: string[]) => {
      if (!confirm(`¿Estás seguro de que deseas eliminar ${userIds.length} usuario(s)?`)) {
        return false;
      }

      const results = await Promise.allSettled(userIds.map((id) => eliminarUsuario(id)));
      const failedCount = results.filter((r) => r.status === 'rejected').length;

      if (failedCount > 0) {
        console.error(`${failedCount} usuarios no pudieron ser eliminados`);
      }

      return failedCount === 0;
    },
    [eliminarUsuario]
  );

  /**
   * Export users to CSV
   */
  const exportToCSV = useCallback(() => {
    if (usuarios.length === 0) {
      alert('No hay usuarios para exportar');
      return;
    }

    const headers = ['ID', 'Nombre', 'Apellido', 'Email', 'Rol', 'Estado'];
    const rows = usuarios.map((u) => [
      u.id,
      u.nombre,
      u.apellido,
      u.email,
      u.rol,
      u.activo ? 'Activo' : 'Inactivo',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `usuarios_${new Date().toISOString()}.csv`;
    link.click();
  }, [usuarios]);

  return {
    toggleMultipleActive,
    deleteMultiple,
    exportToCSV,
  };
};
