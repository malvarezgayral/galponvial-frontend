import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useVehiculosStore } from '../store';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { vehiculosService } from '../services/vehiculosService';
import type { StatusUpdate, Incidente, CargaCombustible } from '../types';

/**
 * Page for displaying vehicle details
 */
const VehiculoDetallesPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { vehiculos } = useVehiculosStore();

  // Find the vehicle by ID
  const vehiculo = id ? vehiculos.find((v) => v.id_vehiculo === parseInt(id)) : null;
  const vehiculoId = vehiculo?.id_vehiculo;

  // Local state for status updates
  const [statusUpdates, setStatusUpdates] = useState<StatusUpdate[]>([]);
  const [statusUpdatesLoading, setStatusUpdatesLoading] = useState(false);
  const [statusUpdatesError, setStatusUpdatesError] = useState<Error | null>(null);

  // Local state for incidentes
  const [incidentes, setIncidentes] = useState<Incidente[]>([]);
  const [incidentesLoading, setIncidentesLoading] = useState(false);
  const [incidentesError, setIncidentesError] = useState<Error | null>(null);

  // Local state for combustible
  const [combustible, setCombustible] = useState<CargaCombustible[]>([]);
  const [combustibleLoading, setCombustibleLoading] = useState(false);
  const [combustibleError, setCombustibleError] = useState<Error | null>(null);

  // Solo mantenemos el modal de recordatorio, los otros redirigen a sus respectivas páginas
  const [showRecordatorioModal, setShowRecordatorioModal] = useState(false);

  // Function to refetch all data
  const refetchAllData = async () => {
    if (!vehiculoId) return;

    // Fetch status updates
    try {
      setStatusUpdatesLoading(true);
      const statusData = await vehiculosService.getStatusUpdates(vehiculoId, 1, 5);
      setStatusUpdates(statusData.data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error al cargar cambios de estado');
      setStatusUpdatesError(error);
      console.error('Error fetching status updates:', error);
    } finally {
      setStatusUpdatesLoading(false);
    }

    // Fetch incidentes
    try {
      setIncidentesLoading(true);
      const incidentesData = await vehiculosService.getIncidentes(vehiculoId, 1, 10);
      setIncidentes(incidentesData.data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error al cargar incidentes');
      setIncidentesError(error);
      console.error('Error fetching incidentes:', error);
    } finally {
      setIncidentesLoading(false);
    }

    // Fetch cargas de combustible
    try {
      setCombustibleLoading(true);
      const combustibleData = await vehiculosService.getCargasCombustible(vehiculoId, 1, 5);
      setCombustible(combustibleData.data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error al cargar cargas de combustible');
      setCombustibleError(error);
      console.error('Error fetching combustible:', error);
    } finally {
      setCombustibleLoading(false);
    }
  };

  // Fetch all data on component mount
  useEffect(() => {
    if (!vehiculoId) return;

    void refetchAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehiculoId]);

  // Status color mapping
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'disponible':
        return 'bg-green-100 text-green-800';
      case 'en_uso':
        return 'bg-blue-100 text-blue-800';
      case 'en_taller':
        return 'bg-yellow-100 text-yellow-800';
      case 'fuera_de_servicio':
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
      case 'en_taller':
        return 'En Taller';
      case 'fuera_de_servicio':
        return 'Fuera de Servicio';
      default:
        return status;
    }
  };

  // Handlers para redireccionar a los formularios principales
  // NOTA: Ajusta estas rutas a las que uses en tu configuración de React Router
  const handleRedirectIncidente = () => {
    navigate('/servicios/incidente', { state: { vehiculoId } });
  };

  const handleRedirectCombustible = () => {
    navigate('/servicios/combustible', { state: { vehiculoId } });
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
            <p className="text-gray-900 font-semibold text-lg">{vehiculo.infoAdicional?.numero_serie || "Sin info"}</p>
          </div>

          <div>
            <span className="text-gray-600 font-medium block mb-2">Color</span>
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded border border-gray-300 shadow-sm"
                style={{
                  backgroundColor: (() => {
                    const color = vehiculo.infoAdicional?.color?.toLowerCase().trim() || '';
                    const colorMap: Record<string, string> = {
                      blanco: 'white',
                      negro: 'black',
                      rojo: 'red',
                      azul: 'blue',
                      verde: 'green',
                      amarillo: 'yellow',
                      gris: 'gray',
                      plateado: 'silver',
                      naranja: 'orange',
                      marrón: 'brown',
                      marron: 'brown',
                      celeste: 'skyblue'
                    };
                    return colorMap[color] || color || '#cccccc';
                  })(),
                }}
              />
              <p className="text-gray-900 font-semibold capitalize">
                {vehiculo.infoAdicional?.color || "Sin info"}
              </p>
            </div>
          </div>

          <div>
            <span className="text-gray-600 font-medium block mb-2">Licencia del Conductor</span>
            <p className="text-gray-900 font-semibold">{vehiculo.infoAdicional?.licencia_conductor || "Sin info"}</p>
          </div>

          <div>
            <span className="text-gray-600 font-medium block mb-2">Seguro Empresa</span>
            <p className="text-gray-900 font-semibold">{vehiculo.infoAdicional?.seguro_empresa || "Sin info"}</p>
          </div>

          <div>
            <span className="text-gray-600 font-medium block mb-2">Póliza</span>
            <p className="text-gray-900 font-semibold">{vehiculo.infoAdicional?.poliza || "Sin info"}</p>
          </div>

          <div>
            <span className="text-gray-600 font-medium block mb-2">Sector de Pertenencia</span>
            <p className="text-gray-900 font-semibold">
              {vehiculo.infoAdicional?.sector?.nombre || "Sin info"}
            </p>
          </div>
        </div>
      </div>

      {vehiculoId && (
        <>
          {/* Status Updates Table */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Cambios de Estado</h2>
            {statusUpdatesError && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                <p className="font-medium">Error al cargar datos</p>
                <p className="text-sm">{statusUpdatesError.message}</p>
              </div>
            )}
            {statusUpdatesLoading && (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Cargando...</span>
              </div>
            )}
            {!statusUpdatesLoading && statusUpdates.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No hay cambios de estado registrados para este vehículo</p>
              </div>
            )}
            {!statusUpdatesLoading && statusUpdates.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900" style={{ width: '25%' }}>Tipo</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900" style={{ width: '25%' }}>Fecha Desde</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900" style={{ width: '25%' }}>Fecha Hasta</th>
                    </tr>
                  </thead>
                  <tbody>
                    {statusUpdates.map((item, idx) => (
                      <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-700">{item.tipo}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{item.fecha_desde}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{item.fecha_hasta}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Incidentes Table */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Incidentes</h2>
              <Button
                variant="primary"
                size="md"
                onClick={handleRedirectIncidente}
              >
                + Reportar Incidente
              </Button>
            </div>
            {incidentesError && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                <p className="font-medium">Error al cargar datos</p>
                <p className="text-sm">{incidentesError.message}</p>
              </div>
            )}
            {incidentesLoading && (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Cargando...</span>
              </div>
            )}
            {!incidentesLoading && incidentes.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No hay incidentes registrados para este vehículo</p>
              </div>
            )}
            {!incidentesLoading && incidentes.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900" style={{ width: '12%' }}>Fecha</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900" style={{ width: '15%' }}>Tipo</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900" style={{ width: '30%' }}>Descripción</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900" style={{ width: '20%' }}>Usuario</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900" style={{ width: '10%' }}>Falla</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900" style={{ width: '13%' }}>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {incidentes.map((item, idx) => {
                      const fallaColor =
                        item.falla === 'critica'
                          ? 'bg-red-100 text-red-800'
                          : item.falla === 'moderada'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800';
                      const estadoColor =
                        item.estado === 'resuelto'
                          ? 'bg-green-100 text-green-800'
                          : item.estado === 'en_proceso'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800';
                      return (
                        <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-700">{item.fecha}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{item.tipo}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{item.descripcion}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {item.usuario ? `${item.usuario.nombre} ${item.usuario.apellido}` : '-'}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <Badge variant="primary" className={fallaColor}>
                              {item.falla}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <Badge variant="primary" className={estadoColor}>
                              {item.estado}
                            </Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Combustible Table */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Cargas de Combustible</h2>
              <Button
                variant="primary"
                size="md"
                onClick={handleRedirectCombustible}
              >
                + Añadir Carga
              </Button>
            </div>
            {combustibleError && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                <p className="font-medium">Error al cargar datos</p>
                <p className="text-sm">{combustibleError.message}</p>
              </div>
            )}
            {combustibleLoading && (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Cargando...</span>
              </div>
            )}
            {!combustibleLoading && combustible.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No hay cargas de combustible registradas para este vehículo</p>
              </div>
            )}
            {!combustibleLoading && combustible.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900" style={{ width: '20%' }}>Fecha</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900" style={{ width: '25%' }}>Despachante</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900" style={{ width: '18%' }}>KM Actual</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900" style={{ width: '18%' }}>Combustible (Ltrs)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {combustible.map((item, idx) => (
                      <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-700">{item.fecha_carga}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{item.despachante}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{item.km_actual}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{item.cant_combustible_despachado}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

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