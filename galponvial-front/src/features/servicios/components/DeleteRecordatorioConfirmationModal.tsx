import React from 'react';
import { Button } from '@/shared/ui/Button';

interface DeleteRecordatorioConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  message?: string;
  loading?: boolean;
}

/**
 * Modal de confirmación para eliminar recordatorios
 */
export const DeleteRecordatorioConfirmationModal: React.FC<
  DeleteRecordatorioConfirmationModalProps
> = ({
  isOpen,
  onClose,
  onConfirm,
  title = '¿Eliminar recordatorio?',
  message = 'Esta acción no se puede deshacer. El recordatorio será eliminado permanentemente.',
  loading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all">
      <div className="w-full max-w-md bg-white rounded-lg shadow-2xl transform transition-all scale-100">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-shrink-0">
              <svg
                className="h-6 w-6 text-red-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 1.677A9 9 0 1120.971 20.27M12 12.75h.008v.008H12v-.008z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          </div>
          <p className="mb-6 text-gray-600">{message}</p>

          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={loading}
              type="button"
            >
              Cancelar
            </Button>

            <Button
              variant="primary"
              onClick={onConfirm}
              isLoading={loading}
              className="!bg-red-600 !border-red-600 hover:!bg-red-700 text-white shadow-md hover:shadow-lg"
              type="button"
            >
              {loading ? 'Eliminando...' : 'Eliminar'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
