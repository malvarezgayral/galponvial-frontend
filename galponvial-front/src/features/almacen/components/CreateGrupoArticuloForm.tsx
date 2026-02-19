import { useEffect, useState } from 'react';
import { Button } from '@/shared/ui/Button';
import { almacenService } from '../services/almacenService';
import { handleApiError, type ApiError } from '@/services/errorHandler';
import type { SectorDto } from '../types';

interface CreateGrupoArticuloFormProps {
  onSuccess?: () => void;
}

export const CreateGrupoArticuloForm: React.FC<CreateGrupoArticuloFormProps> = ({
  onSuccess,
}) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [sectorId, setSectorId] = useState<number | ''>('');

  const [sectores, setSectores] = useState<SectorDto[]>([]);
  const [loadingSectores, setLoadingSectores] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [success, setSuccess] = useState(false);

  // 🔁 Cargar sectores
  useEffect(() => {
    const fetchSectores = async () => {
      try {
        const data = await almacenService.getSectores();
        setSectores(data);
      } catch (err) {
        const apiError = handleApiError(err);
        setError(apiError);
      } finally {
        setLoadingSectores(false);
      }
    };

    fetchSectores();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!nombre.trim() || !descripcion.trim()) {
      setError({
        message: 'Nombre y descripción son obligatorios',
        isPermissionError: false,
      });
      return;
    }

    if (!sectorId) {
      setError({
        message: 'Debe seleccionar un sector',
        isPermissionError: false,
      });
      return;
    }

    setLoading(true);
    try {
      await almacenService.createGrupoArticulo({
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        sector_id: sectorId,
      });

      setSuccess(true);

      setTimeout(() => {
        setNombre('');
        setDescripcion('');
        setSectorId('');
        setSuccess(false);
        onSuccess?.();
      }, 1500);
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Crear Grupo de Artículos
      </h2>

      {error && (
        <div className={`mb-6 p-4 border rounded-lg flex items-start gap-3 ${
          error.isPermissionError 
            ? 'bg-amber-50 border-amber-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <span className="text-2xl mt-0.5">
            {error.isPermissionError ? '🔒' : '⚠️'}
          </span>
          <div className={error.isPermissionError ? 'text-amber-900' : 'text-red-800'}>
            <p className="font-medium">
              {error.isPermissionError ? 'Permiso Insuficiente' : 'Error'}
            </p>
            <p className="text-sm">{error.message}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
          <p className="font-medium">✓ Grupo creado exitosamente</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre *
          </label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
        </div>

        {/* Sector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sector *
          </label>
          <select
            value={sectorId}
            onChange={(e) =>
              setSectorId(e.target.value ? Number(e.target.value) : '')
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            disabled={loading || loadingSectores}
          >
            <option value="">
              {loadingSectores ? 'Cargando sectores...' : 'Seleccionar sector'}
            </option>
            {sectores.map((sector) => (
              <option key={sector.id} value={sector.id}>
                Sector {sector.nro_sector} - {sector.descripcion}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Descripción */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Descripción *
        </label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
          disabled={loading}
        />
      </div>

      <div className="flex justify-end">
        <Button
          variant="primary"
          type="submit"
          disabled={loading || success}
          isLoading={loading}
        >
          Crear Grupo
        </Button>
      </div>
    </form>
  );
};
