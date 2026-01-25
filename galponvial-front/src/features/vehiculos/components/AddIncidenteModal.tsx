import { useState } from 'react';
import { Button } from '@/shared/ui/Button';
import { vehiculosService } from '../services/vehiculosService';
import { useAppStore } from '@/app/stores/appStore';

interface AddIncidenteModalProps {
  vehiculoId: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

/**
 * Modal for adding a new incidente to a vehicle
 */
export const AddIncidenteModal: React.FC<AddIncidenteModalProps> = ({
  vehiculoId,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { user } = useAppStore();
  const [fecha, setFecha] = useState('');
  const [tipo, setTipo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [falla, setFalla] = useState<'baja' | 'media' | 'alta'>('baja');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!fecha || !tipo || !descripcion) {
      setError('Todos los campos son obligatorios');
      return;
    }

    // Type guard to ensure user has dni property
    if (!user || !('dni' in user) || !user.dni) {
      setError('No se pudo obtener el DNI del usuario');
      return;
    }

    setLoading(true);
    try {
      await vehiculosService.createIncidente(vehiculoId, {
        fecha,
        tipo,
        descripcion,
        falla,
        id_usuario: user.dni,
      });
      setSuccess(true);
      setTimeout(() => {
        setFecha('');
        setTipo('');
        setDescripcion('');
        setFalla('baja');
        onSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear incidente';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Reportar Incidente
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
            ✓ Incidente reportado exitosamente
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
              Tipo de Incidente
            </label>
            <input
              type="text"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Pinchazo, Falla del motor, etc."
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nivel de Falla
            </label>
            <select
              value={falla}
              onChange={(e) => setFalla(e.target.value as 'baja' | 'media' | 'alta')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
            </select>
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
              Reportar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
