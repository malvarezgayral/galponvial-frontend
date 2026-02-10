import React from 'react';
import { Button } from '@/shared/ui/Button';

interface ConfirmarAsignarModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
  vehiculoNombre: string;
  vehiculoCodigo: string;
  usuarioNombre: string;
  usuarioDni: string;
}

/**
 * Modal de confirmación para asignar un vehículo a un usuario
 */
export const ConfirmarAsignarModal: React.FC<ConfirmarAsignarModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  isLoading,
  vehiculoNombre,
  vehiculoCodigo,
  usuarioNombre,
  usuarioDni,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
        {/* Header */}
        <div className="bg-green-500 p-6 rounded-t-lg">
          <h2 className="text-2xl font-bold text-white">Confirmar Asignación</h2>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-[var(--color-text-primary)] mb-4">
            ¿Estás seguro de que deseas asignar este vehículo al usuario?
          </p>
          
          {/* Vehículo Info */}
          <div className="bg-blue-50 p-4 rounded mb-3 border border-blue-200">
            <p className="text-sm text-[var(--color-text-secondary)] mb-1">
              <span className="font-semibold">Vehículo:</span> {vehiculoNombre}
            </p>
            <p className="text-sm text-[var(--color-text-secondary)]">
              <span className="font-semibold">Código:</span> {vehiculoCodigo}
            </p>
          </div>

          {/* Usuario Info */}
          <div className="bg-green-50 p-4 rounded mb-4 border border-green-200">
            <p className="text-sm text-[var(--color-text-secondary)] mb-1">
              <span className="font-semibold">Usuario:</span> {usuarioNombre}
            </p>
            <p className="text-sm text-[var(--color-text-secondary)]">
              <span className="font-semibold">DNI:</span> {usuarioDni}
            </p>
          </div>

          <p className="text-sm text-blue-600 mb-4">
            Esta acción creará una nueva relación entre el usuario y el vehículo.
          </p>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-200">
          <Button
            variant="secondary"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={onConfirm}
            isLoading={isLoading}
            className="flex-1"
          >
            {isLoading ? 'Asignando...' : 'Asignar'}
          </Button>
        </div>
      </div>
    </div>
  );
};
