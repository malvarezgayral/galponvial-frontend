import React from 'react';
import type { UsuarioVehiculoRelacion } from '../types';
import { Button } from '@/shared/ui/Button';

interface DetallesRelacionModalProps {
  isOpen: boolean;
  relacion: UsuarioVehiculoRelacion | null;
  onClose: () => void;
}

/**
 * Modal component to display detailed information about a usuario-vehículo relationship
 */
export const DetallesRelacionModal: React.FC<DetallesRelacionModalProps> = ({
  isOpen,
  relacion,
  onClose,
}) => {
  if (!isOpen || !relacion) return null;

  const vehiculo = relacion.vehiculo;
  const usuario = relacion.usuario;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-[var(--color-navbar-bg)] p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-[var(--color-navbar-text)]">
            Detalles de la Relación
          </h2>
          <button
            onClick={onClose}
            className="text-[var(--color-navbar-text)] hover:text-white text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Vehículo Section */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">
              Información del Vehículo
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded">
              <div>
                <p className="text-sm text-[var(--color-text-secondary)]">Código</p>
                <p className="font-semibold text-[var(--color-text-primary)]">
                  {vehiculo.codigo}
                </p>
              </div>
              <div>
                <p className="text-sm text-[var(--color-text-secondary)]">Nombre</p>
                <p className="font-semibold text-[var(--color-text-primary)]">
                  {vehiculo.nombre}
                </p>
              </div>
              <div>
                <p className="text-sm text-[var(--color-text-secondary)]">Marca</p>
                <p className="font-semibold text-[var(--color-text-primary)]">
                  {vehiculo.marca}
                </p>
              </div>
              <div>
                <p className="text-sm text-[var(--color-text-secondary)]">Modelo</p>
                <p className="font-semibold text-[var(--color-text-primary)]">
                  {vehiculo.modelo}
                </p>
              </div>
              <div>
                <p className="text-sm text-[var(--color-text-secondary)]">Año</p>
                <p className="font-semibold text-[var(--color-text-primary)]">
                  {vehiculo.anio}
                </p>
              </div>
              <div>
                <p className="text-sm text-[var(--color-text-secondary)]">Tipo</p>
                <p className="font-semibold text-[var(--color-text-primary)] capitalize">
                  {vehiculo.tipo_vehiculo}
                </p>
              </div>
              <div>
                <p className="text-sm text-[var(--color-text-secondary)]">Estado</p>
                <p className="font-semibold text-[var(--color-text-primary)] capitalize">
                  {vehiculo.status}
                </p>
              </div>
              <div>
                <p className="text-sm text-[var(--color-text-secondary)]">Uso de Combustible</p>
                <p className="font-semibold text-[var(--color-text-primary)]">
                  {vehiculo.uso_combustible} km/l
                </p>
              </div>
            </div>
          </div>

          {/* Usuario Section */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">
              Información del Usuario
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded">
              <div>
                <p className="text-sm text-[var(--color-text-secondary)]">DNI</p>
                <p className="font-semibold text-[var(--color-text-primary)]">
                  {usuario.dni}
                </p>
              </div>
              <div>
                <p className="text-sm text-[var(--color-text-secondary)]">Nombre</p>
                <p className="font-semibold text-[var(--color-text-primary)]">
                  {usuario.nombre}
                </p>
              </div>
              <div>
                <p className="text-sm text-[var(--color-text-secondary)]">Apellido</p>
                <p className="font-semibold text-[var(--color-text-primary)]">
                  {usuario.apellido}
                </p>
              </div>
              <div>
                <p className="text-sm text-[var(--color-text-secondary)]">Email</p>
                <p className="font-semibold text-[var(--color-text-primary)]">
                  {usuario.email}
                </p>
              </div>
              <div>
                <p className="text-sm text-[var(--color-text-secondary)]">Estado</p>
                <p className="font-semibold text-[var(--color-text-primary)]">
                  {usuario.isActive ? 'Activo' : 'Inactivo'}
                </p>
              </div>
              <div>
                <p className="text-sm text-[var(--color-text-secondary)]">Fecha de Alta</p>
                <p className="font-semibold text-[var(--color-text-primary)]">
                  {new Date(usuario.fecha_alta).toLocaleDateString('es-AR')}
                </p>
              </div>
            </div>
          </div>

          {/* Relación Section */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">
              Información de la Asignación
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded">
              <div>
                <p className="text-sm text-[var(--color-text-secondary)]">Fecha Desde</p>
                <p className="font-semibold text-[var(--color-text-primary)]">
                  {new Date(relacion.fecha_desde).toLocaleDateString('es-AR')}
                </p>
              </div>
              <div>
                <p className="text-sm text-[var(--color-text-secondary)]">Fecha Hasta</p>
                <p className="font-semibold text-[var(--color-text-primary)]">
                  {relacion.fecha_hasta
                    ? new Date(relacion.fecha_hasta).toLocaleDateString('es-AR')
                    : 'Vigente'}
                </p>
              </div>
            </div>
          </div>

          {/* Roles Section */}
          {usuario.usuarioRoles && usuario.usuarioRoles.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">
                Roles Asignados
              </h3>
              <div className="space-y-2">
                {usuario.usuarioRoles.map((rol, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded flex justify-between">
                    <span className="text-[var(--color-text-primary)]">Rol ID: {rol.rol_id}</span>
                    <span className="text-sm text-[var(--color-text-secondary)]">
                      {new Date(rol.fecha_asignacion).toLocaleDateString('es-AR')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={onClose}>
              Cerrar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
