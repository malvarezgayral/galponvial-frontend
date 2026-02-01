import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RecordatorioForm } from '../components/RecordatorioForm';
import { vehiculosService } from '@/features/vehiculos/services/vehiculosService';
import type { Vehiculo } from '@/features/vehiculos/types';

/**
 * Página para crear recordatorios
 */
const RecordatorioPage = () => {
  const navigate = useNavigate();
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [selectedVehiculo, setSelectedVehiculo] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Carga la lista de vehículos al montar el componente
   */
  useEffect(() => {
    const loadVehiculos = async () => {
      try {
        setLoading(true);
        const data = await vehiculosService.getAll();
        setVehiculos(data);
        if (data.length > 0) {
          setSelectedVehiculo(data[0].id_vehiculo);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al cargar vehículos';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadVehiculos();
  }, []);

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
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
          <p className="text-[var(--color-text-primary)]">Cargando vehículos...</p>
        </div>
      </div>
    );
  }

  if (error || vehiculos.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-secondary)] py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => navigate('/servicios')}
            className="
              flex items-center gap-2 text-[#378AFE] hover:text-[#0962DE]
              transition-colors duration-200 mb-6
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
            Volver a Servicios
          </button>

          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-12 h-12 text-red-500 mx-auto mb-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-[var(--color-text-primary)] font-medium mb-2">
                {error || 'No hay vehículos disponibles'}
              </p>
              <p className="text-[var(--color-text-secondary)] text-sm">
                Por favor, intenta más tarde o contacta al administrador.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Botón de volver */}
        <button
          onClick={() => navigate('/servicios')}
          className="
            flex items-center gap-2 text-[#378AFE] hover:text-[#0962DE]
            transition-colors duration-200 mb-6
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
          Volver a Servicios
        </button>

        {/* Selector de vehículo */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-3">
            Selecciona un vehículo *
          </label>
          <select
            value={selectedVehiculo || ''}
            onChange={(e) => setSelectedVehiculo(parseInt(e.target.value))}
            className="
              w-full px-4 py-3 border border-[var(--color-border-light)] rounded-lg
              focus:outline-none focus:ring-2 focus:ring-[#378AFE]
              text-[var(--color-text-primary)] bg-white
            "
          >
            <option value="">Seleccionar vehículo...</option>
            {vehiculos.map((vehiculo) => (
              <option key={vehiculo.id_vehiculo} value={vehiculo.id_vehiculo}>
                {vehiculo.codigo} - {vehiculo.nombre} ({vehiculo.marca} {vehiculo.modelo})
              </option>
            ))}
          </select>
        </div>

        {/* Formulario de recordatorio */}
        {selectedVehiculo && <RecordatorioForm vehiculoId={selectedVehiculo} />}
      </div>
    </div>
  );
};

export default RecordatorioPage;
