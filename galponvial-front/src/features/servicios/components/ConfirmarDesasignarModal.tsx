import React from 'react';
import { Button } from '@/shared/ui/Button';

interface ConfirmarDesasignarModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
  vehiculoNombre: string;
  usuarioNombre: string;
}

/**
 * Modal de confirmación para desasignar una relación usuario-vehículo
 */
export const ConfirmarDesasignarModal: React.FC<ConfirmarDesasignarModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  isLoading,
  vehiculoNombre,
  usuarioNombre,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
        {/* Header */}
        <div className="bg-red-500 p-6 rounded-t-lg">
          <h2 className="text-2xl font-bold text-white">Confirmar Desasignación</h2>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-[var(--color-text-primary)] mb-4">
            ¿Estás seguro de que deseas desasignar el vehículo?
          </p>
          <div className="bg-gray-50 p-4 rounded mb-4 border border-gray-200">
            <p className="text-sm text-[var(--color-text-secondary)] mb-2">
              <span className="font-semibold">Vehículo:</span> {vehiculoNombre}
            </p>
            <p className="text-sm text-[var(--color-text-secondary)]">
              <span className="font-semibold">Usuario:</span> {usuarioNombre}
            </p>
          </div>
          <p className="text-sm text-orange-600 mb-4">
            Esta acción finalizará la relación entre el usuario y el vehículo estableciendo la
            fecha de envío a hoy.
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
            variant="danger"
            onClick={onConfirm}
            isLoading={isLoading}
            className="flex-1"
          >
            {isLoading ? 'Desasignando...' : 'Desasignar'}
          </Button>
        </div>
      </div>
    </div>
  );
};
