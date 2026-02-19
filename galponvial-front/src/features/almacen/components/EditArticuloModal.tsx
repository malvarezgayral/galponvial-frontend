import { useState, useEffect } from 'react';
import { Button } from '@/shared/ui/Button';
import { useAlmacenStore } from '../store';
import { handleApiError, type ApiError } from '@/services/errorHandler';
import type { Articulo, UnidadTipoOption } from '../types';

interface EditArticuloModalProps {
  isOpen: boolean;
  articulo: Articulo | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export const EditArticuloModal: React.FC<EditArticuloModalProps> = ({
  isOpen,
  articulo,
  onClose,
  onSuccess,
}) => {
  const { updateArticulo } = useAlmacenStore();

  const [codProveedor, setCodProveedor] = useState('');
  const [nombre, setNombre] = useState('');
  const [modelo, setModelo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [unidadTipo, setUnidadTipo] = useState<Articulo['unidad_tipo']>('pieza');
  const [stock, setStock] = useState<string>('');
  
  const [file, setFile] = useState<File | null>(null); 
  const [currentImgUrl, setCurrentImgUrl] = useState(''); 

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [success, setSuccess] = useState(false);

  const unidadTipoOptions: UnidadTipoOption[] = [
    { value: 'pieza', label: 'Pieza', requiresStock: false },
    { value: 'caja', label: 'Caja', requiresStock: true },
    { value: 'paquete', label: 'Paquete', requiresStock: true },
    { value: 'metro', label: 'Metro', requiresStock: false },
    { value: 'litro', label: 'Litro', requiresStock: true },
    { value: 'kilogramo', label: 'Kilogramo', requiresStock: true },
    { value: 'unidad', label: 'Unidad', requiresStock: true },
    { value: 'volumen', label: 'Volumen', requiresStock: true },
    { value: 'distancia', label: 'Distancia', requiresStock: true },
  ];

  const currentUnidadOption = unidadTipoOptions.find((opt) => opt.value === unidadTipo);
  const requiresStock = currentUnidadOption?.requiresStock || false;

  useEffect(() => {
    if (isOpen && articulo) {
      setCodProveedor(articulo.cod_proveedor);
      setNombre(articulo.nombre);
      setModelo(articulo.modelo);
      setDescripcion(articulo.descripcion);
      setUnidadTipo(articulo.unidad_tipo);
      setStock(articulo.stock?.toString() || '');
      
      let safeImgUrl = articulo.img_url || articulo.img_url || ''; 
      if (safeImgUrl.includes('via.placeholder.com')) safeImgUrl = '';
      
      setCurrentImgUrl(safeImgUrl); 
      setFile(null);
      setError(null);
      setSuccess(false);
    }
  }, [isOpen, articulo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!articulo) return;

    setError(null);
    setSuccess(false);

    if (!codProveedor.trim() || !nombre.trim() || !modelo.trim() || !descripcion.trim()) {
      setError({
        message: 'Todos los campos obligatorios deben estar completados',
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
      const mapUnidadTipoToUnidadMedidaId = (tipo: Articulo['unidad_tipo']): number => {
        const mapping: Record<string, number> = {
          'pieza': 1, 'unidad': 1,
          'caja': 2, 'volumen': 2, 'distancia': 2,
          'paquete': 3,
          'metro': 4,
          'litro': 5,
          'kilogramo': 6
        };
        return mapping[tipo] || 1;
      };

      
      if (file) {
        console.log('--- ENVIANDO ARCHIVO DESDE FRONT ---');
        console.log('Nombre:', file.name);
        console.log('Tipo:', file.type);
        console.log('Tamaño:', file.size);
        const formData = new FormData();
        formData.append('cod_proveedor', codProveedor.trim());
        formData.append('nombre', nombre.trim());
        formData.append('modelo', modelo.trim());
        formData.append('descripcion', descripcion.trim());
        formData.append('unidad_tipo', unidadTipo);
        formData.append('unidad_medida_id', String(mapUnidadTipoToUnidadMedidaId(unidadTipo)));
        
        if (requiresStock) formData.append('stock', stock);
        formData.append('file', file);


        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await updateArticulo(Number(articulo.cod), formData as any);

      } else {
        const payload = {
          cod_proveedor: codProveedor.trim(),
          nombre: nombre.trim(),
          modelo: modelo.trim(),
          descripcion: descripcion.trim(),
          unidad_tipo: unidadTipo,
          unidad_medida_id: mapUnidadTipoToUnidadMedidaId(unidadTipo),
          ...(requiresStock && { stock: parseInt(stock, 10) }),
          img_url: currentImgUrl 
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await updateArticulo(Number(articulo.cod), payload as any);
      }

      setSuccess(true);
      setTimeout(() => {
        onClose();
        onSuccess?.();
      }, 1500);

    } catch (err) {
      console.error(err);
      const apiError = handleApiError(err);
      setError(apiError);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !articulo) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6 z-10">
          <h2 className="text-2xl font-semibold text-gray-900">Editar Artículo</h2>
          {articulo && <p className="text-sm text-gray-600 mt-1">Código: {articulo.cod_proveedor}</p>}
        </div>

        <form onSubmit={handleSubmit} className="p-6">
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
              <p className="font-medium">✓ Artículo actualizado exitosamente</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Código Proveedor *</label>
              <input type="text" value={codProveedor} onChange={(e) => setCodProveedor(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" disabled={loading} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nombre *</label>
              <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" disabled={loading} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Modelo *</label>
              <input type="text" value={modelo} onChange={(e) => setModelo(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" disabled={loading} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Unidad *</label>
              <select 
                value={unidadTipo} 
                onChange={(e) => {
                  setUnidadTipo(e.target.value as typeof unidadTipo);
                  if (!unidadTipoOptions.find((opt) => opt.value === e.target.value)?.requiresStock) {
                    setStock('');
                  }
                }} 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                disabled={loading}
              >
                {unidadTipoOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Descripción *</label>
            <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" disabled={loading} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {requiresStock && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stock *</label>
                <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} min="1" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" disabled={loading} />
              </div>
            )}

            <div>
              <label htmlFor="edit-file" className="block text-sm font-medium text-gray-700 mb-2">
                Imagen del artículo
              </label>
              
              {!file && currentImgUrl && !currentImgUrl.includes('via.placeholder') && (
                  <div className="mb-2">
                      <p className="text-xs text-gray-500 mb-1">Imagen actual:</p>
                      <img 
                        src={currentImgUrl} 
                        alt="Preview" 
                        className="h-20 w-auto object-cover rounded border"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }} 
                      />
                  </div>
              )}

              <input
                type="file"
                id="edit-file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setFile(e.target.files[0]);
                  }
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Dejar vacío para mantener la imagen actual. Subir nueva para reemplazar.
              </p>
            </div>
          </div>

          <div className="flex gap-4 justify-end border-t pt-6">
            <Button variant="secondary" size="md" type="button" disabled={loading} onClick={onClose}>
              Cancelar
            </Button>
            <Button variant="primary" size="md" type="submit" disabled={loading || success} isLoading={loading}>
              Guardar Cambios
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};