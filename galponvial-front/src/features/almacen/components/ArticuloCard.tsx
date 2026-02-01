import type { Articulo } from '../types';
import { Button } from '@/shared/ui/Button';

interface ArticuloCardProps {
  articulo: Articulo;
  onEdit: (articulo: Articulo) => void;
  onDelete: (articulo: Articulo) => void;
  onViewDetails: (articulo: Articulo) => void;
}

/**
 * Card component for displaying a warehouse articulo
 * Shows basic articulo info, image, and action buttons
 */
export const ArticuloCard: React.FC<ArticuloCardProps> = ({
  articulo,
  onEdit,
  onDelete,
  onViewDetails,
}) => {
  // Mock image URL if not provided
  const imageUrl = articulo.img || 'https://via.placeholder.com/300x200?text=Sin+Imagen';

  return (
    <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow overflow-hidden h-full flex flex-col">
      {/* Image container */}
      <div className="relative w-full h-48 bg-gray-200 overflow-hidden">
        <img
          src={imageUrl}
          alt={articulo.nombre}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Error+de+Imagen';
          }}
        />

        {/* Stock badge - floating top right */}
        {articulo.stock !== undefined && (
          <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
            Stock: {articulo.stock}
          </div>
        )}

        {/* Unit type badge - floating top left */}
        <div className="absolute top-3 left-3 bg-gray-900 text-white px-3 py-1 rounded-full text-xs font-semibold capitalize">
          {articulo.unidad_tipo}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col grow">
        {/* Header info */}
        <div className="mb-3">
          <p className="text-xs font-medium text-gray-500 mb-1">Código: {articulo.cod_proveedor}</p>
          <h3 className="text-lg font-bold text-gray-900 line-clamp-2">{articulo.nombre}</h3>
          <p className="text-sm text-gray-600 mt-1">Modelo: {articulo.modelo}</p>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-700 line-clamp-2 mb-4 grow">{articulo.descripcion}</p>

        {/* View details button */}
        <Button
          variant="primary"
          size="md"
          className="w-full mb-3"
          onClick={() => onViewDetails(articulo)}
        >
          VER MÁS
        </Button>

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(articulo)}
            className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            title="Editar artículo"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Editar
          </button>

          <button
            onClick={() => onDelete(articulo)}
            className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            title="Eliminar artículo"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};
