import React, { useEffect, useState } from 'react';
import { useUsuariosStore } from '../store';
import { Button } from '@/shared/ui/Button';
import { Table } from '@/shared/ui/Table';
import type { Role, Permission } from '../types';

const RolesManagement: React.FC = () => {
  const { roles, isLoading, error, fetchRoles, crearRol, actualizarRol, eliminarRol } =
    useUsuariosStore();

  const [modalAbierto, setModalAbierto] = useState(false);
  const [rolSeleccionado, setRolSeleccionado] = useState<Role | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    permisos: [] as Permission[],
    activo: true,
  });

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  useEffect(() => {
    if (rolSeleccionado) {
      setFormData({
        nombre: rolSeleccionado.nombre,
        descripcion: rolSeleccionado.descripcion,
        permisos: rolSeleccionado.permisos,
        activo: rolSeleccionado.activo,
      });
    } else {
      setFormData({
        nombre: '',
        descripcion: '',
        permisos: [],
        activo: true,
      });
    }
  }, [rolSeleccionado]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rolSeleccionado) {
      await actualizarRol(rolSeleccionado.id, formData);
    } else {
      await crearRol(formData);
    }

    setModalAbierto(false);
    setRolSeleccionado(null);
  };

  const handleEliminar = async (id: string) => {
    if (confirm('¿Está seguro de que desea eliminar este rol?')) {
      await eliminarRol(id);
    }
  };

  const columns = [
    { key: 'nombre' as const, label: 'Nombre' },
    { key: 'descripcion' as const, label: 'Descripción' },
    {
      key: 'id' as const,
      label: 'Acciones',
      render: (value: string) => (
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setRolSeleccionado(roles.find((r) => r.id === value) || null);
              setModalAbierto(true);
            }}
          >
            Editar
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleEliminar(value)}
          >
            Eliminar
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
          Gestión de Roles
        </h2>
        <Button
          variant="primary"
          size="md"
          onClick={() => {
            setRolSeleccionado(null);
            setModalAbierto(true);
          }}
        >
          + Crear Rol
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {isLoading ? (
        <p className="text-center py-8 text-gray-600">Cargando roles...</p>
      ) : roles.length > 0 ? (
        <Table data={roles} columns={columns} />
      ) : (
        <p className="text-center py-8 text-gray-600">No hay roles registrados</p>
      )}

      {modalAbierto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
            <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">
              {rolSeleccionado ? 'Editar Rol' : 'Crear Nuevo Rol'}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-navbar-nav)]"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  required
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-navbar-nav)]"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={() => setModalAbierto(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isLoading}
                  className="flex-1"
                >
                  {rolSeleccionado ? 'Guardar' : 'Crear'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RolesManagement;
