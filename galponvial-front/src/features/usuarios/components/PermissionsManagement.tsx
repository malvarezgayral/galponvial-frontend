import React, { useEffect } from 'react';
import { useUsuariosStore } from '../store';
import { Table } from '@/shared/ui/Table';
import type { Permission } from '../types';

const PermissionsManagement: React.FC = () => {
  const { permisos, isLoading, error, fetchPermisos } = useUsuariosStore();

  useEffect(() => {
    fetchPermisos();
  }, [fetchPermisos]);

  // Group permissions by module
  const permisosAgrupados = permisos.reduce(
    (acc, permiso) => {
      if (!acc[permiso.modulo]) {
        acc[permiso.modulo] = [];
      }
      acc[permiso.modulo].push(permiso);
      return acc;
    },
    {} as Record<string, Permission[]>
  );

  const columns = [
    { key: 'nombre' as const, label: 'Nombre' },
    { key: 'descripcion' as const, label: 'Descripción' },
    {
      key: 'accion' as const,
      label: 'Acción',
      render: (value: string) => (
        <span className="px-2 py-1 text-sm font-medium rounded bg-blue-100 text-blue-800">
          {value}
        </span>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">
        Gestión de Permisos
      </h2>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {isLoading ? (
        <p className="text-center py-8 text-gray-600">Cargando permisos...</p>
      ) : Object.keys(permisosAgrupados).length > 0 ? (
        <div className="space-y-8">
          {(Object.entries(permisosAgrupados) as Array<[string, Permission[]]>).map(([modulo, modulos]) => (
            <div key={modulo} className="border-t pt-6">
              <h3 className="text-lg font-bold text-[var(--color-navbar-nav)] mb-4 capitalize">
                Módulo: {modulo}
              </h3>
              <Table data={modulos} columns={columns} />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center py-8 text-gray-600">No hay permisos registrados</p>
      )}
    </div>
  );
};

export default PermissionsManagement;
