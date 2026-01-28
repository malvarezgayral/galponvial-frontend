import React from 'react';
import { Button } from '@/shared/ui/Button';
import type { User } from '../types';

interface LogoutConfirmModalProps {
  visible: boolean;
  usuario: User | null;
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Modal de confirmación para logout de usuarios
 * @param visible - Si el modal está visible
 * @param usuario - Usuario a desloguear
 * @param isLoading - Si la solicitud está en progreso
 * @param error - Mensaje de error si ocurre
 * @param successMessage - Mensaje de éxito al desloguear
 * @param onConfirm - Callback cuando se confirma el logout
 * @param onCancel - Callback cuando se cancela
 */
const LogoutConfirmModal: React.FC<LogoutConfirmModalProps> = ({
  visible,
  usuario,
  isLoading,
  error,
  successMessage,
  onConfirm,
  onCancel,
}) => {
  if (!visible || !usuario) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-sm w-full">
        <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">
          Cerrar Sesión del Usuario
        </h2>
        
        <p className="text-gray-700 mb-4">
          ¿Deseas cerrar la sesión de <strong>{usuario.nombre} {usuario.apellido}</strong>?
        </p>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600 mb-2">Email:</p>
          <p className="text-gray-900 font-medium break-all">{usuario.email}</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded text-sm">
            {successMessage}
          </div>
        )}

        <div className="flex gap-3">
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="primary"
            size="md"
            isLoading={isLoading}
            disabled={isLoading}
            onClick={onConfirm}
            className="flex-1"
          >
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmModal;
