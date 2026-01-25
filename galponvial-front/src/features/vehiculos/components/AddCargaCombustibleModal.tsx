import { useState } from 'react';
import { Button } from '@/shared/ui/Button';
import { vehiculosService } from '../services/vehiculosService';

interface AddCargaCombustibleModalProps {
  vehiculoId: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

/**
 * Modal for adding a new carga de combustible to a vehicle
 */
export const AddCargaCombustibleModal: React.FC<AddCargaCombustibleModalProps> = ({
  vehiculoId,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [fechaCarga, setFechaCarga] = useState('');
  const [despachante, setDespachante] = useState('');
  const [kmActual, setKmActual] = useState('');
  const [cantCombustible, setCantCombustible] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!fechaCarga || !despachante || !kmActual || !cantCombustible) {
      setError('Todos los campos son obligatorios');
      return;
    }

    setLoading(true);
    try {
      await vehiculosService.createCargaCombustible(vehiculoId, {
        fecha_carga: fechaCarga,
        despachante,
        km_actual: parseInt(kmActual, 10),
        cant_combustible_despachado: parseFloat(cantCombustible),
      });
      setSuccess(true);
      setTimeout(() => {
        setFechaCarga('');
        setDespachante('');
        setKmActual('');
        setCantCombustible('');
        onSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear carga de combustible';
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
          Añadir Carga de Combustible
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
            ✓ Carga de combustible creada exitosamente
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Carga
            </label>
            <input
              type="date"
              value={fechaCarga}
              onChange={(e) => setFechaCarga(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Despachante
            </label>
            <input
              type="text"
              value={despachante}
              onChange={(e) => setDespachante(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nombre del despachante"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              KM Actual
            </label>
            <input
              type="number"
              value={kmActual}
              onChange={(e) => setKmActual(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cantidad de Combustible (Litros)
            </label>
            <input
              type="number"
              step="0.01"
              value={cantCombustible}
              onChange={(e) => setCantCombustible(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
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
