import { useState, useEffect } from 'react';
import { Button } from '@/shared/ui/Button';
import { almacenService } from '../services/almacenService';
import { handleApiError, type ApiError } from '@/services/errorHandler';
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
  const [unidadTipo, setUnidadTipo] = useState<'pieza' | 'caja' | 'kilogramo' | 'metro' | 'litro' | 'unidad' | 'volumen' | 'distancia' | 'paquete'>('pieza');
  const [stock, setStock] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [grupoId, setGrupoId] = useState<number | ''>('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [success, setSuccess] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Grupos state
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [gruposLoading, setGruposLoading] = useState(true);
  const [gruposError, setGruposError] = useState<ApiError | null>(null);

  // Fetch grupos on component mount
  useEffect(() => {
    const fetchGrupos = async () => {
      try {
        const data = await almacenService.getGrupos();
        setGrupos(data);
        setGruposError(null);
      } catch (err) {
        const apiError = handleApiError(err);
        setGruposError(apiError);
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
    { value: 'paquete', label: 'Paquete', requiresStock: true },
    { value: 'metro', label: 'Metro', requiresStock: false },
    { value: 'litro', label: 'Litro', requiresStock: true },
    { value: 'kilogramo', label: 'Kilogramo', requiresStock: false },
    { value: 'volumen', label: 'Volumen', requiresStock: false },
    { value: 'distancia', label: 'Distancia', requiresStock: false },
    { value: 'unidad', label: 'Unidad', requiresStock: false },
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
    setFile(null);
    setGrupoId('');
    setError(null);
    setSuccess(false);
    setShowClearConfirm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validation (Igual que antes)
    if (!codProveedor.trim() || !nombre.trim() || !modelo.trim() || !descripcion.trim()) {
      setError({
        message: 'Todos los campos obligatorios deben estar completados',
        isPermissionError: false,
      });
      return;
    }

    if (!grupoId) {
      setError({
        message: 'Debe seleccionar un grupo',
        isPermissionError: false,
      });
      return;
    }

    if (requiresStock && (!stock.trim() || parseInt(stock, 10) <= 0)) {
      setError({
        message: 'El stock es obligatorio y debe ser mayor a 0 para este tipo de unidad',
        isPermissionError: false,
      });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      
      formData.append('cod_proveedor', codProveedor.trim());
      formData.append('nombre', nombre.trim());
      formData.append('modelo', modelo.trim());
      formData.append('descripcion', descripcion.trim());
      formData.append('unidad_tipo', unidadTipo);
      formData.append('grupo_id', String(grupoId)); 

      if (requiresStock) {
          formData.append('stock', stock);
      }
      
      if (file) {
          formData.append('file', file); 
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await almacenService.createArticulo(formData as any); 

      setSuccess(true);
      
      // Clear form
      setTimeout(() => {
        setCodProveedor('');
        setNombre('');
        setModelo('');
        setDescripcion('');
        setUnidadTipo('pieza');
        setStock('');
        setFile(null); 
        setGrupoId('');
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
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Crear Nuevo Artículo</h2>

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
            <div className="text-red-600 text-sm mb-2">{gruposError.message}</div>
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
                {grupo.nombre} ({grupo.sector?.tipo})
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

        {/* Imagen Archivo */}
        <div>
          <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
            Imagen del artículo (opcional)
          </label>
          <input
            type="file"
            id="file"
            accept="image/*" 
            onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                    setFile(e.target.files[0]);
                }
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            disabled={loading}
          />
          <p className="text-xs text-gray-500 mt-1">Formatos: JPG, PNG, WEBP.</p>
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
