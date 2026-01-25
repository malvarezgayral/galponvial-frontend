import type { Vehiculo } from '../types';
import { Button } from '@/shared/ui/Button';
import { useAppStore } from '@/app/stores/appStore';

interface VehiculoCardProps {
  vehiculo: Vehiculo;
  onEdit: (vehiculo: Vehiculo) => void;
  onDelete: (vehiculo: Vehiculo) => void;
  onViewDetails: (vehiculo: Vehiculo) => void;
}

/**
 * Card component for displaying a vehicle
 * Shows basic vehicle info and action buttons
 */
export const VehiculoCard: React.FC<VehiculoCardProps> = ({
  vehiculo,
  onEdit,
  onDelete,
  onViewDetails,
}) => {
  const { user } = useAppStore();
  // Check if user can edit (superuser or greater)
  const canEdit = user && 'rol' in user && (user.rol === 'super-admin' || user.rol === 'admin');

  // Check if user can delete (admin or superadmin)
  const canDelete = user && 'rol' in user && (user.rol === 'admin' || user.rol === 'super-admin');

  return (
    <div className="relative bg-[#1E1E1E] rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow h-full flex flex-col">
      {/* Status badges - floating top right */}
      <div className="absolute top-4 right-4 flex gap-2">
        {/* Status badge */}
        <div
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            vehiculo.status === 'disponible'
              ? 'bg-[#80DD4B] text-gray-900'
              : vehiculo.status === 'mantenimiento'
                ? 'bg-yellow-500 text-gray-900'
                : vehiculo.status === 'en_uso'
                  ? 'bg-blue-500 text-white'
                  : 'bg-red-500 text-white'
          }`}
        >
          {vehiculo.status === 'disponible' && '✓'}
          {vehiculo.status === 'mantenimiento' && '⚙'}
          {vehiculo.status === 'en_uso' && '→'}
          {vehiculo.status === 'retirado' && '✕'}
        </div>
      </div>

      {/* Vehicle info */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-white mb-2">Vehículo</h3>
        <div className="space-y-2 text-sm text-gray-300">
          <p>
            <span className="text-gray-400">Código:</span> {vehiculo.codigo}
          </p>
          <p>
            <span className="text-gray-400">Nombre:</span> {vehiculo.nombre}
          </p>
          <p>
            <span className="text-gray-400">Marca:</span> {vehiculo.marca}
          </p>
          <p>
            <span className="text-gray-400">Modelo:</span> {vehiculo.modelo}
          </p>
        </div>
      </div>

      {/* View details button */}
      <Button
        variant="primary"
        size="md"
        className="w-full mb-4 mt-auto bg-[#FF8C00] hover:bg-[#E67E00] text-white border-none"
        onClick={() => onViewDetails(vehiculo)}
      >
        VER MÁS
      </Button>

      {/* Action buttons - floating bottom right */}
      <div className="absolute bottom-4 right-4 flex gap-2">
        {/* Edit button */}
        {canEdit && (
          <button
            onClick={() => onEdit(vehiculo)}
            className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors"
            title="Editar vehículo"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
        )}

        {/* Delete button */}
        {canDelete && (
          <button
            onClick={() => onDelete(vehiculo)}
            className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors"
            title="Eliminar vehículo"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};
