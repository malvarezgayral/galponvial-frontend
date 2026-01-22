import { Button } from '@/shared/ui/Button';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  vehiculoNombre: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

/**
 * Modal for confirming vehicle deletion
 */
export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  vehiculoNombre,
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Confirmar eliminación</h2>

        <p className="text-gray-600 mb-6">
          ¿Estás seguro de que deseas eliminar el vehículo{' '}
          <span className="font-semibold">"{vehiculoNombre}"</span>? Esta acción no se puede deshacer.
        </p>

        <div className="flex gap-4">
          <Button
            variant="secondary"
            size="md"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={onConfirm}
            isLoading={isLoading}
            className="flex-1"
          >
            Eliminar
          </Button>
        </div>
      </div>
    </div>
  );
};
