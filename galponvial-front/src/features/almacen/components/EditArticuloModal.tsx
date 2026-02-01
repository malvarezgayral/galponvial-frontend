import { useState, useEffect } from 'react';
import { Button } from '@/shared/ui/Button';
import { useAlmacenStore } from '../store';
import type { Articulo, UnidadTipoOption } from '../types';

interface EditArticuloModalProps {
  isOpen: boolean;
  articulo: Articulo | null;
  onClose: () => void;
  onSuccess?: () => void;
}

/**
 * Modal for editing a warehouse articulo
 */
export const EditArticuloModal: React.FC<EditArticuloModalProps> = ({
  isOpen,
  articulo,
  onClose,
  onSuccess,
}) => {
  const { updateArticulo } = useAlmacenStore();

  // Form state
  const [codProveedor, setCodProveedor] = useState('');
  const [nombre, setNombre] = useState('');
  const [modelo, setModelo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [unidadTipo, setUnidadTipo] = useState<'pieza' | 'caja' | 'bulto' | 'metro' | 'litro' | 'kg'>('pieza');
  const [stock, setStock] = useState<string>('');
  const [img, setImg] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Unidad tipo options
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

  // Initialize form when modal opens or articulo changes
  useEffect(() => {
    if (isOpen && articulo) {
      setCodProveedor(articulo.cod_proveedor);
      setNombre(articulo.nombre);
      setModelo(articulo.modelo);
      setDescripcion(articulo.descripcion);
      setUnidadTipo(articulo.unidad_tipo);
      setStock(articulo.stock?.toString() || '');
      setImg(articulo.img || '');
      setError(null);
      setSuccess(false);
    }
  }, [isOpen, articulo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!articulo) return;

    setError(null);
    setSuccess(false);

    // Validation
    if (!codProveedor.trim() || !nombre.trim() || !modelo.trim() || !descripcion.trim()) {
      setError('Todos los campos obligatorios deben estar completados');
      return;
    }

    if (requiresStock && (!stock.trim() || parseInt(stock, 10) <= 0)) {
      setError('El stock es obligatorio y debe ser mayor a 0 para este tipo de unidad');
      return;
    }

    setLoading(true);
    try {
      const mapUnidadTipoToUnidadMedidaId = (
      tipo: Articulo['unidad_tipo']
    ): number => {
      switch (tipo) {
        case 'pieza': return 1;
        case 'caja': return 2;
        case 'bulto': return 3;
        case 'metro': return 4;
        case 'litro': return 5;
        case 'kg': return 6;
        default: throw new Error('Unidad no válida');
      }
    };


      const payload = {
      cod_proveedor: codProveedor.trim(),
      nombre: nombre.trim(),
      modelo: modelo.trim(),
      descripcion: descripcion.trim(),

      unidad_medida_id: mapUnidadTipoToUnidadMedidaId(unidadTipo),
      unidad_tipo: unidadTipo,

      ...(requiresStock && { stock: parseInt(stock, 10) }),
      ...(img.trim() && { img: img.trim() }),
    };

    console.log('ID enviado:', articulo.cod);
    console.log('COD enviado:', articulo.cod_proveedor);
    console.log('ID ENVIADO:', articulo.cod, typeof articulo.cod)
    console.log('Unidad de medida (Estado actual):', unidadTipo); 
    console.log('ID de Unidad enviado:', mapUnidadTipoToUnidadMedidaId(unidadTipo));

      await updateArticulo(Number(articulo.cod), payload);
      setSuccess(true);

      // Close modal after 1.5 seconds on success
      setTimeout(() => {
        onClose();
        onSuccess?.();
      }, 1500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar artículo';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !articulo) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6">
          <h2 className="text-2xl font-semibold text-gray-900">Editar Artículo</h2>
          {articulo && <p className="text-sm text-gray-600 mt-1">Código: {articulo.cod_proveedor}</p>}
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
              <p className="font-medium">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
              <p className="font-medium">✓ Artículo actualizado exitosamente</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Código Proveedor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código Proveedor *
              </label>
              <input
                type="text"
                value={codProveedor}
                onChange={(e) => setCodProveedor(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
            </div>

            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre *
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
            </div>

            {/* Modelo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Modelo *
              </label>
              <input
                type="text"
                value={modelo}
                onChange={(e) => setModelo(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
            </div>

            {/* Unidad Tipo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Unidad *
              </label>
              <select
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Stock - Solo si es requerido */}
            {requiresStock && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock *
                </label>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL de Imagen (opcional)
              </label>
              <input
                type="url"
                value={img}
                onChange={(e) => setImg(e.target.value)}
                placeholder="https://ejemplo.com/imagen.jpg"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end border-t pt-6">
            <Button
              variant="secondary"
              size="md"
              type="button"
              disabled={loading}
              onClick={onClose}
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
              Guardar Cambios
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
