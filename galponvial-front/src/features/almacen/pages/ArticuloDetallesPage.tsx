import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from '@/shared/ui/Button';
import { almacenService } from '../services/almacenService';
import type { Articulo } from '../types';

/**
 * Page for displaying detailed information about a single articulo
 */
const ArticuloDetallesPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [articulo, setArticulo] = useState<Articulo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const articuloId = id ? parseInt(id) : null;

  useEffect(() => {
    if (!articuloId) return;

    const fetchArticulo = async () => {
      try {
        setLoading(true);
        const data = await almacenService.getArticuloById(articuloId);
        setArticulo(data);
      } catch (err) {
        const errorMsg = err instanceof Error ? err : new Error('Error al cargar artículo');
        setError(errorMsg);
        console.error('Error fetching articulo:', errorMsg);
      } finally {
        setLoading(false);
      }
    };

    void fetchArticulo();
  }, [articuloId]);

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Volver atrás"
          >
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Detalles del Artículo</h1>
        </div>

        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Cargando artículo...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !articulo) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Volver atrás"
          >
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Detalles del Artículo</h1>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-800 text-lg">{error ? error.message : 'Artículo no encontrado'}</p>
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate(-1)}
            className="mt-4"
          >
            Volver
          </Button>
        </div>
      </div>
    );
  }

  const imageUrl = articulo.img || 'https://via.placeholder.com/400x300?text=Sin+Imagen';

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Volver atrás"
        >
          <svg
            className="w-6 h-6 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{articulo.nombre}</h1>
          <p className="text-gray-500 text-sm">Código: {articulo.cod_proveedor}</p>
        </div>
      </div>

      {/* Main info card */}
      <div className="bg-white rounded-lg shadow p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left column - Image */}
          <div>
            <div className="relative w-full h-96 bg-gray-200 rounded-lg overflow-hidden mb-4">
              <img
                src={imageUrl}
                alt={articulo.nombre}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Error+de+Imagen';
                }}
              />
            </div>
            <p className="text-xs text-gray-500 text-center">
              {articulo.img ? 'Imagen del artículo' : 'Imagen por defecto'}
            </p>
          </div>

          {/* Right column - Info */}
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Información Principal</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-start border-b pb-3">
                  <span className="text-gray-600 font-medium">Código Proveedor:</span>
                  <span className="text-gray-900 font-semibold text-right">{articulo.cod_proveedor}</span>
                </div>
                <div className="flex justify-between items-start border-b pb-3">
                  <span className="text-gray-600 font-medium">Nombre:</span>
                  <span className="text-gray-900 font-semibold text-right">{articulo.nombre}</span>
                </div>
                <div className="flex justify-between items-start border-b pb-3">
                  <span className="text-gray-600 font-medium">Modelo:</span>
                  <span className="text-gray-900 font-semibold text-right">{articulo.modelo}</span>
                </div>
                <div className="flex justify-between items-start border-b pb-3">
                  <span className="text-gray-600 font-medium">Tipo de Unidad:</span>
                  <span className="text-gray-900 font-semibold text-right capitalize">
                    {articulo.unidad_tipo}
                  </span>
                </div>
              </div>
            </div>

            {/* Stock info */}
            {articulo.stock !== undefined && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Stock</h2>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-600 mb-1">Cantidad disponible</p>
                  <p className="text-3xl font-bold text-blue-900">{articulo.stock}</p>
                  <p className="text-xs text-blue-600 mt-2">{articulo.unidad_tipo}</p>
                </div>
              </div>
            )}

            {/* Timestamps */}
            {(articulo.fechaCreacion || articulo.ultimaModificacion) && (
              <div className="border-t pt-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Historial</h3>
                <div className="space-y-2 text-sm">
                  {articulo.fechaCreacion && (
                    <div>
                      <span className="text-gray-600">Creado:</span>
                      <p className="text-gray-900 font-medium">
                        {new Date(articulo.fechaCreacion).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  )}
                  {articulo.ultimaModificacion && (
                    <div>
                      <span className="text-gray-600">Última modificación:</span>
                      <p className="text-gray-900 font-medium">
                        {new Date(articulo.ultimaModificacion).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Description card */}
      <div className="bg-white rounded-lg shadow p-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Descripción</h2>
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
          {articulo.descripcion}
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex gap-4 justify-end">
        <Button variant="secondary" size="md" onClick={() => navigate(-1)}>
          Volver
        </Button>
        <Button variant="primary" size="md" onClick={() => console.log('TODO: Edit articulo')}>
          Editar
        </Button>
      </div>
    </div>
  );
};

export default ArticuloDetallesPage;
