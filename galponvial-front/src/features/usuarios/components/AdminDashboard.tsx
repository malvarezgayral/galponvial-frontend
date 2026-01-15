import React, { useEffect } from 'react';
import { useUsuariosStore } from '../store';
import { Button } from '@/shared/ui/Button';
import { Table } from '@/shared/ui/Table';
import UserFormModal from './UserFormModal';
import UserActionMenu from './UserActionMenu';
import type { User } from '../types';

const AdminDashboard: React.FC = () => {
  const {
    usuarios,
    usuariosTotal,
    usuariosPagina,
    usuariosPageSize,
    isLoading,
    error,
    modalAbierto,
    setModalAbierto,
    setModoEdicion,
    setUsuarioSeleccionado,
    fetchUsuarios,
  } = useUsuariosStore();

  useEffect(() => {
    fetchUsuarios(usuariosPagina, usuariosPageSize);
  }, [usuariosPagina, usuariosPageSize, fetchUsuarios]);

  const handleCrearUsuario = () => {
    setUsuarioSeleccionado(null);
    setModoEdicion(false);
    setModalAbierto(true);
  };

  const totalPages = Math.ceil(usuariosTotal / usuariosPageSize);

  const columns = [
    {
      key: 'nombre' as const,
      label: 'Nombre',
      render: (_value: string, row: User) => `${row.nombre} ${row.apellido}`,
    },
    {
      key: 'email' as const,
      label: 'Email',
    },
    {
      key: 'rol' as const,
      label: 'Rol',
      render: (value: string) => (
        <span className="px-3 py-1 text-sm font-medium rounded-full bg-[var(--color-navbar-nav)] text-white">
          {value}
        </span>
      ),
    },
    {
      key: 'activo' as const,
      label: 'Estado',
      render: (value: boolean) => (
        <span className={`px-3 py-1 text-sm font-medium rounded-full ${value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {value ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
    {
      key: 'id' as const,
      label: 'Acciones',
      render: (_value: string, row: User) => (
        <UserActionMenu usuario={row} />
      ),
    },
  ];

  return (
    <div className="w-full h-full bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
            Gestión de Usuarios
          </h1>
          <p className="text-gray-600 mt-1">
            Total: {usuariosTotal} usuario{usuariosTotal !== 1 ? 's' : ''}
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={handleCrearUsuario}
          disabled={isLoading}
        >
          + Crear Usuario
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8">
          <p className="text-gray-600">Cargando usuarios...</p>
        </div>
      )}

      {/* Table */}
      {!isLoading && usuarios.length > 0 && (
        <>
          <Table
            data={usuarios}
            columns={columns}
            className="border-gray-300"
            rowClassName="hover:bg-gray-50"
          />

          {/* Pagination */}
          <div className="mt-6 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Página {usuariosPagina} de {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={usuariosPagina <= 1}
                onClick={() => useUsuariosStore.setState({ usuariosPagina: usuariosPagina - 1 })}
              >
                Anterior
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={usuariosPagina >= totalPages}
                onClick={() => useUsuariosStore.setState({ usuariosPagina: usuariosPagina + 1 })}
              >
                Siguiente
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Empty State */}
      {!isLoading && usuarios.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No hay usuarios registrados</p>
          <p className="text-gray-500 mt-2">
            Haz clic en "Crear Usuario" para agregar uno
          </p>
        </div>
      )}

      {/* Modal */}
      {modalAbierto && <UserFormModal />}
    </div>
  );
};

export default AdminDashboard;
