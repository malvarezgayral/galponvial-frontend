import { useState } from 'react';
import { Button } from '@/shared/ui/Button';
import { vehiculosService } from '../services/vehiculosService';

interface AddRecordatorioModalProps {
  vehiculoId: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

/**
 * Modal for adding a new recordatorio to a vehicle
 */
export const AddRecordatorioModal: React.FC<AddRecordatorioModalProps> = ({
  vehiculoId,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [fecha, setFecha] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!fecha || !descripcion) {
      setError('Todos los campos son obligatorios');
      return;
    }

    setLoading(true);
    try {
      await vehiculosService.createRecordatorio(vehiculoId, {
        fecha,
        descripcion,
      });
      setSuccess(true);
      setTimeout(() => {
        setFecha('');
        setDescripcion('');
        onSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear recordatorio';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Añadir Recordatorio</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
            ✓ Recordatorio creado exitosamente
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha
            </label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
              disabled={loading}
            />
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button
              variant="secondary"
              size="md"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              size="md"
              type="submit"
              disabled={loading || success}
              isLoading={loading}
            >
              Crear
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
