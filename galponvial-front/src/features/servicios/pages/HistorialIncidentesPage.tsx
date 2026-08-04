import { useNavigate } from 'react-router-dom';
import FiltrosHistorialIncidentes from '../components/FiltrosHistorialIncidentes';
import type { IncidenteHistorialFiltros } from '../types';

/**
 * Página de historial de incidentes
 */
const HistorialIncidentesPage = () => {
  const navigate = useNavigate();

  const handleBuscar = (filtros: IncidenteHistorialFiltros) => {
    // TODO: conectar con el backend cuando el endpoint de historial con filtros esté disponible
    console.log('Filtros de búsqueda:', filtros);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)] py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate('/servicios/incidente')}
          className="
            flex items-center gap-2 text-[#378AFE] hover:text-[#0962DE]
            transition-colors duration-200 mb-6 cursor-pointer
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
        <div className="flex gap-3 mb-6">
          <button
            type="button"
            onClick={() => navigate('/servicios/incidente')}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-300 text-[var(--color-text-primary)] font-medium rounded-lg hover:bg-gray-400 transition-colors duration-200 cursor-pointer"
          >
            Incidentes
          </button>
          <button
            type="button"
            onClick={() => navigate('/servicios/incidente/listado')}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-300 text-[var(--color-text-primary)] font-medium rounded-lg hover:bg-gray-400 transition-colors duration-200 cursor-pointer"
          >
            Listado de Incidentes
          </button>
          <button
            type="button"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#378AFE] text-white font-medium rounded-lg hover:bg-[#0962DE] transition-colors duration-200 cursor-pointer"
          >
            Historial de Incidentes
          </button>
        </div>

        <FiltrosHistorialIncidentes onBuscar={handleBuscar} />
      </div>
    </div>
  );
};

export default HistorialIncidentesPage;
