import { useNavigate, useParams } from 'react-router-dom';
import { useVehiculosStore } from '../store';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';

/**
 * Page for displaying vehicle details
 */
const VehiculoDetallesPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { vehiculos } = useVehiculosStore();

  // Find the vehicle by ID
  const vehiculo = id ? vehiculos.find((v) => v.id_vehiculo === parseInt(id)) : null;

  // Status color mapping
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'disponible':
        return 'bg-green-100 text-green-800';
      case 'en_uso':
        return 'bg-blue-100 text-blue-800';
      case 'mantenimiento':
        return 'bg-yellow-100 text-yellow-800';
      case 'retirado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Status label mapping
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'disponible':
        return 'Disponible';
      case 'en_uso':
        return 'En Uso';
      case 'mantenimiento':
        return 'En Mantenimiento';
      case 'retirado':
        return 'Retirado';
      default:
        return status;
    }
  };

  // If vehicle not found
  if (!vehiculo) {
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
          <h1 className="text-3xl font-bold text-gray-900">Detalles del Vehículo</h1>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-800 text-lg">Vehículo no encontrado</p>
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
          <h1 className="text-3xl font-bold text-gray-900">{vehiculo.nombre}</h1>
          <p className="text-gray-500 text-sm">Código: {vehiculo.codigo}</p>
        </div>
      </div>

      {/* Main info card */}
      <div className="bg-white rounded-lg shadow p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left column */}
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Información Principal</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-gray-600 font-medium">Código:</span>
                  <span className="text-gray-900 font-semibold">{vehiculo.codigo}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-gray-600 font-medium">Nombre:</span>
                  <span className="text-gray-900 font-semibold">{vehiculo.nombre}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-gray-600 font-medium">Marca:</span>
                  <span className="text-gray-900 font-semibold">{vehiculo.marca}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-gray-600 font-medium">Modelo:</span>
                  <span className="text-gray-900 font-semibold">{vehiculo.modelo}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-gray-600 font-medium">Año:</span>
                  <span className="text-gray-900 font-semibold">{vehiculo.anio}</span>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="flex justify-between items-start">
                <span className="text-gray-600 font-medium">Tipo de Vehículo:</span>
                <span className="text-gray-900 font-semibold capitalize">{vehiculo.tipo_vehiculo}</span>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Estado y Disponibilidad</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Estado:</span>
                  <Badge variant="primary" className={getStatusColor(vehiculo.status)}>
                    {getStatusLabel(vehiculo.status)}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Timestamps */}
            {(vehiculo.fechaCreacion || vehiculo.ultimaModificacion) && (
              <div className="border-t pt-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Historial</h3>
                <div className="space-y-2">
                  {vehiculo.fechaCreacion && (
                    <div className="text-sm">
                      <span className="text-gray-600">Creado:</span>
                      <p className="text-gray-900 font-medium">
                        {new Date(vehiculo.fechaCreacion).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  )}
                  {vehiculo.ultimaModificacion && (
                    <div className="text-sm">
                      <span className="text-gray-600">Última modificación:</span>
                      <p className="text-gray-900 font-medium">
                        {new Date(vehiculo.ultimaModificacion).toLocaleDateString('es-ES', {
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

      {/* Additional information card */}
      <div className="bg-white rounded-lg shadow p-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Información Adicional</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div>
            <span className="text-gray-600 font-medium block mb-2">Número de Serie</span>
            <p className="text-gray-900 font-semibold text-lg">{vehiculo.infoAdicional.numero_serie}</p>
          </div>

          <div>
            <span className="text-gray-600 font-medium block mb-2">Color</span>
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded border border-gray-300 shadow-sm"
                style={{
                  backgroundColor: vehiculo.infoAdicional.color?.toLowerCase() || '#cccccc',
                }}
              />
              <p className="text-gray-900 font-semibold capitalize">
                {vehiculo.infoAdicional.color}
              </p>
            </div>
          </div>

          <div>
            <span className="text-gray-600 font-medium block mb-2">Licencia del Conductor</span>
            <p className="text-gray-900 font-semibold">{vehiculo.infoAdicional.licencia_conductor}</p>
          </div>

          <div>
            <span className="text-gray-600 font-medium block mb-2">Seguro Empresa</span>
            <p className="text-gray-900 font-semibold">{vehiculo.infoAdicional.seguro_empresa}</p>
          </div>

          <div>
            <span className="text-gray-600 font-medium block mb-2">Póliza</span>
            <p className="text-gray-900 font-semibold">{vehiculo.infoAdicional.poliza}</p>
          </div>

          <div>
            <span className="text-gray-600 font-medium block mb-2">Sector de Pertenencia</span>
            <p className="text-gray-900 font-semibold">
              {vehiculo.infoAdicional.id_sector_pertenencia}
            </p>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-4 justify-end">
        <Button variant="secondary" size="md" onClick={() => navigate(-1)}>
          Volver
        </Button>
      </div>
    </div>
  );
};

export default VehiculoDetallesPage;
