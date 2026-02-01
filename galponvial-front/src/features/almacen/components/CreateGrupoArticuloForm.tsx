import { useState } from 'react';
import { Button } from '@/shared/ui/Button';
import { almacenService } from '../services/almacenService';

interface CreateGrupoArticuloFormProps {
  onSuccess?: () => void;
}

// 🔧 Hardcodeo temporal de sectores
const SECTORES = [
  { id: 1, nombre: 'Taller' },
  { id: 2, nombre: 'Depósito' },
  { id: 3, nombre: 'Mostrador' },
];

export const CreateGrupoArticuloForm: React.FC<CreateGrupoArticuloFormProps> = ({
  onSuccess,
}) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [sectorId, setSectorId] = useState<number | ''>('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!nombre.trim() || !descripcion.trim()) {
      setError('Nombre y descripción son obligatorios');
      return;
    }

    if (!sectorId) {
      setError('Debe seleccionar un sector');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        sector_id: sectorId,
      };

      await almacenService.createGrupoArticulo(payload);

      setSuccess(true);

      setTimeout(() => {
        setNombre('');
        setDescripcion('');
        setSectorId('');
        setSuccess(false);
        onSuccess?.();
      }, 1500);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err?.response?.status === 403) {
        setError('No contás con los permisos necesarios para crear grupos');
      } else {
        setError('Error al crear el grupo');
      }
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
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          <p className="font-medium">Error</p>
          <p className="text-sm">{error}</p>
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
            placeholder="Ej: Lubricantes"
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
            disabled={loading}
          >
            <option value="">Seleccionar sector</option>
            {SECTORES.map((sector) => (
              <option key={sector.id} value={sector.id}>
                {sector.nombre}
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
          placeholder="Grupo de aceites y lubricantes"
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
