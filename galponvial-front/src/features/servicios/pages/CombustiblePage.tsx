import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CombustibleForm } from '../components/CombustibleForm';
import { vehiculosService } from '@/features/vehiculos/services/vehiculosService';
import type { Vehiculo } from '@/features/vehiculos/types';

/**
 * Página para registrar carga de combustible
 */
const CombustiblePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [selectedVehiculo, setSelectedVehiculo] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadVehiculos = async () => {
      try {
        setLoading(true);
        const data = await vehiculosService.getAll();
        const vehiculosDisponibles = data.filter(v => v.status !== 'fuera_de_servicio');
        setVehiculos(vehiculosDisponibles);

        if (vehiculosDisponibles.length > 0) {
          const queryParams = new URLSearchParams(location.search);
          const initialVehiculoId = location.state?.vehiculoId || queryParams.get('vehiculoId');
          if (initialVehiculoId) {
            const targetId = parseInt(initialVehiculoId as string, 10);
            const exists = vehiculosDisponibles.some(v => v.id_vehiculo === targetId);
            setSelectedVehiculo(exists ? targetId : vehiculosDisponibles[0].id_vehiculo);
          } else {
            setSelectedVehiculo(vehiculosDisponibles[0].id_vehiculo);
          }
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al cargar vehículos';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadVehiculos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  // DEV MOCK: si no hay vehículos en la BD local, usamos uno de prueba
  const vehiculosConMock: Vehiculo[] = vehiculos.length === 0 && !error
    ? [{ id_vehiculo: 1, codigo: 'V001', nombre: 'Vehículo de prueba', marca: 'Ford', modelo: 'Ranger', status: 'disponible' } as unknown as Vehiculo]
    : vehiculos;

  // Preseleccionar el mock si no hay ninguno seleccionado
  if (vehiculosConMock.length > 0 && selectedVehiculo === null && !loading) {
    setSelectedVehiculo(vehiculosConMock[0].id_vehiculo);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-secondary)] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-[#378AFE] rounded-full mb-4">
            <svg
              className="animate-spin h-6 w-6 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-[var(--color-text-primary)]">Cargando vehículos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-secondary)] py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={() => navigate('/servicios/combustible')}
              className="px-7 py-3 rounded-lg bg-[#0062e3] text-white text-base font-semibold hover:bg-[#0054c2] transition-colors duration-200 cursor-pointer"
            >
              Carga de Combustible
            </button>
            <button
              onClick={() => navigate('/servicios/combustible/historial')}
              className="px-7 py-3 rounded-lg bg-gray-200 text-gray-700 text-base font-semibold hover:bg-gray-300 transition-colors duration-200 cursor-pointer"
            >
              Historial de Carga de Combustible
            </button>
          </div>
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-red-500 mx-auto mb-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-[var(--color-text-primary)] font-medium mb-2">{error}</p>
              <p className="text-[var(--color-text-secondary)] text-sm">Por favor, intenta más tarde o contacta al administrador.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Botones de navegación */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => navigate('/servicios/combustible')}
            className="px-7 py-3 rounded-lg bg-[#0062e3] text-white text-base font-semibold hover:bg-[#0054c2] transition-colors duration-200 cursor-pointer"
          >
            Carga de Combustible
          </button>
          <button
            onClick={() => navigate('/servicios/combustible/historial')}
            className="px-7 py-3 rounded-lg bg-gray-200 text-gray-700 text-base font-semibold hover:bg-gray-300 transition-colors duration-200 cursor-pointer"
          >
            Historial de Carga de Combustible
          </button>
        </div>

        {/* Selector de vehículo */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-3">
            Selecciona un vehículo *
          </label>
          <select
            value={selectedVehiculo || ''}
            onChange={(e) => setSelectedVehiculo(parseInt(e.target.value))}
            className="w-full px-4 py-3 border border-[var(--color-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#378AFE] text-[var(--color-text-primary)] bg-white"
          >
            <option value="">Seleccionar vehículo...</option>
            {vehiculosConMock.map((vehiculo) => (
              <option key={vehiculo.id_vehiculo} value={vehiculo.id_vehiculo}>
                {vehiculo.codigo} - {vehiculo.nombre} ({vehiculo.marca} {vehiculo.modelo})
              </option>
            ))}
          </select>
        </div>

        {/* Formulario de carga */}
        {selectedVehiculo && <CombustibleForm vehiculoId={selectedVehiculo} />}
      </div>
    </div>
  );
};

export default CombustiblePage;
