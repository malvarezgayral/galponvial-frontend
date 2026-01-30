import { useState, useEffect } from 'react';
import { Button } from '@/shared/ui/Button';
import { almacenService } from '../services/almacenService';
import type { UnidadTipoOption, Grupo } from '../types';

interface CreateArticuloFormProps {
  onSuccess?: () => void;
}

/**
 * Form component for creating new warehouse articulos
 */
export const CreateArticuloForm: React.FC<CreateArticuloFormProps> = ({ onSuccess }) => {
  // Form state
  const [codProveedor, setCodProveedor] = useState('');
  const [nombre, setNombre] = useState('');
  const [modelo, setModelo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [unidadTipo, setUnidadTipo] = useState<'pieza' | 'caja' | 'bulto' | 'metro' | 'litro' | 'kg'>('pieza');
  const [stock, setStock] = useState<string>('');
  const [img, setImg] = useState('');
  const [grupoId, setGrupoId] = useState<number | ''>('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Grupos state
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [gruposLoading, setGruposLoading] = useState(true);
  const [gruposError, setGruposError] = useState<string | null>(null);

  // Fetch grupos on component mount
  useEffect(() => {
    const fetchGrupos = async () => {
      try {
        const data = await almacenService.getGrupos();
        setGrupos(data);
        setGruposError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al cargar grupos';
        setGruposError(errorMessage);
      } finally {
        setGruposLoading(false);
      }
    };

    fetchGrupos();
  }, []);

  // Unidad tipo options with stock requirement info
  const unidadTipoOptions: UnidadTipoOption[] = [
    { value: 'pieza', label: 'Pieza', requiresStock: false },
    { value: 'caja', label: 'Caja', requiresStock: true },
    { value: 'bulto', label: 'Bulto', requiresStock: true },
    { value: 'metro', label: 'Metro', requiresStock: false },
    { value: 'litro', label: 'Litro', requiresStock: true },
    { value: 'kg', label: 'Kilogramo', requiresStock: true },
  ];

  // Check if current unidad_tipo requires stock
  const currentUnidadOption = unidadTipoOptions.find((opt) => opt.value === unidadTipo);
  const requiresStock = currentUnidadOption?.requiresStock || false;

  const handleClearForm = () => {
    setCodProveedor('');
    setNombre('');
    setModelo('');
    setDescripcion('');
    setUnidadTipo('pieza');
    setStock('');
    setImg('');
    setGrupoId('');
    setError(null);
    setSuccess(false);
    setShowClearConfirm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validation
    if (!codProveedor.trim() || !nombre.trim() || !modelo.trim() || !descripcion.trim()) {
      setError('Todos los campos obligatorios deben estar completados');
      return;
    }

    if (!grupoId) {
      setError('Debe seleccionar un grupo');
      return;
    }

    if (requiresStock && (!stock.trim() || parseInt(stock, 10) <= 0)) {
      setError('El stock es obligatorio y debe ser mayor a 0 para este tipo de unidad');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        cod_proveedor: codProveedor.trim(),
        nombre: nombre.trim(),
        modelo: modelo.trim(),
        descripcion: descripcion.trim(),
        unidad_tipo: unidadTipo,
        grupo_id: grupoId as number,
        ...(img.trim() && { img: img.trim() }),
        ...(requiresStock && { stock: parseInt(stock, 10) }),
      };

      await almacenService.createArticulo(payload);

      setSuccess(true);
      // Clear form after success
      setTimeout(() => {
        setCodProveedor('');
        setNombre('');
        setModelo('');
        setDescripcion('');
        setUnidadTipo('pieza');
        setStock('');
        setImg('');
        setGrupoId('');
        setSuccess(false);
        onSuccess?.();
      }, 1500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear artículo';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Crear Nuevo Artículo</h2>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          <p className="font-medium">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
          <p className="font-medium">✓ Artículo creado exitosamente</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Código Proveedor */}
        <div>
          <label htmlFor="codProveedor" className="block text-sm font-medium text-gray-700 mb-2">
            Código Proveedor *
          </label>
          <input
            type="text"
            id="codProveedor"
            value={codProveedor}
            onChange={(e) => setCodProveedor(e.target.value)}
            placeholder="Ej: ART-001"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
        </div>

        {/* Nombre */}
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
            Nombre *
          </label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Taladro"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
        </div>

        {/* Modelo */}
        <div>
          <label htmlFor="modelo" className="block text-sm font-medium text-gray-700 mb-2">
            Modelo *
          </label>
          <input
            type="text"
            id="modelo"
            value={modelo}
            onChange={(e) => setModelo(e.target.value)}
            placeholder="Ej: Bosch X200"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
        </div>

        {/* Unidad Tipo */}
        <div>
          <label htmlFor="unidadTipo" className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Unidad *
          </label>
          <select
            id="unidadTipo"
            value={unidadTipo}
            onChange={(e) => {
              setUnidadTipo(e.target.value as typeof unidadTipo);
              // Clear stock if the new type doesn't require it
              if (!unidadTipoOptions.find((opt) => opt.value === e.target.value)?.requiresStock) {
                setStock('');
              }
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          >
            {unidadTipoOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Grupo */}
        <div>
          <label htmlFor="grupo" className="block text-sm font-medium text-gray-700 mb-2">
            Grupo *
          </label>
          {gruposError && (
            <div className="text-red-600 text-sm mb-2">{gruposError}</div>
          )}
          <select
            id="grupo"
            value={grupoId}
            onChange={(e) => setGrupoId(e.target.value ? parseInt(e.target.value, 10) : '')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading || gruposLoading}
          >
            <option value="">
              {gruposLoading ? 'Cargando grupos...' : 'Seleccionar grupo'}
            </option>
            {grupos.map((grupo) => (
              <option key={grupo.id} value={grupo.id}>
                {grupo.nombre} ({grupo.sector.tipo})
              </option>
            ))}
          </select>
          {gruposLoading && (
            <p className="text-xs text-gray-500 mt-1">Cargando grupos disponibles...</p>
          )}
        </div>
      </div>

      {/* Descripción */}
      <div className="mb-6">
        <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-2">
          Descripción *
        </label>
        <textarea
          id="descripcion"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Descripción detallada del artículo"
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          disabled={loading}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Stock - Solo si es requerido */}
        {requiresStock && (
          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
              Stock *
            </label>
            <input
              type="number"
              id="stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="Cantidad en stock"
              min="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Campo obligatorio para el tipo de unidad seleccionado
            </p>
          </div>
        )}

        {/* Imagen URL */}
        <div>
          <label htmlFor="img" className="block text-sm font-medium text-gray-700 mb-2">
            URL de Imagen (opcional)
          </label>
          <input
            type="url"
            id="img"
            value={img}
            onChange={(e) => setImg(e.target.value)}
            placeholder="https://ejemplo.com/imagen.jpg"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
          <p className="text-xs text-gray-500 mt-1">Campo opcional. Se mostrará una imagen por defecto si no se proporciona</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-end">
        <Button
          variant="secondary"
          size="md"
          type="button"
          disabled={loading}
          onClick={() => setShowClearConfirm(true)}
        >
          Limpiar
        </Button>
        <Button
          variant="primary"
          size="md"
          type="submit"
          disabled={loading || success}
          isLoading={loading}
        >
          Crear Artículo
        </Button>
      </div>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full mx-4 animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              ¿Limpiar formulario?
            </h3>
            <p className="text-gray-600 mb-6">
              Se borrarán todos los valores ingresados. ¿Deseas continuar?
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="secondary"
                size="md"
                onClick={() => setShowClearConfirm(false)}
                type="button"
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleClearForm}
                type="button"
              >
                Sí, limpiar
              </Button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};
