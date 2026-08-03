import { useNavigate } from 'react-router-dom';
import FiltrosHistorialCombustible from '../components/FiltrosHistorialCombustible';
import type { CombustibleHistorialFiltros } from '../types';

const HistorialCombustiblePage = () => {
  const navigate = useNavigate();

  const handleBuscar = (filtros: CombustibleHistorialFiltros) => {
    // TODO: conectar con el backend cuando el endpoint de historial con filtros esté disponible
    console.log('Filtros de búsqueda:', filtros);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-nowrap gap-3 mb-6 overflow-x-auto pb-1">
          <button
            onClick={() => navigate('/servicios/combustible')}
            className="px-7 py-3 rounded-lg bg-gray-200 text-gray-700 text-base font-semibold hover:bg-gray-300 transition-colors duration-200 cursor-pointer"
          >
            Carga de Combustible
          </button>
          <button
            onClick={() => navigate('/servicios/combustible/listado')}
            className="px-7 py-3 rounded-lg bg-gray-200 text-gray-700 text-base font-semibold hover:bg-gray-300 transition-colors duration-200 cursor-pointer"
          >
            Listado Cargas
          </button>
          <button
            onClick={() => navigate('/servicios/combustible/historial')}
            className="px-7 py-3 rounded-lg bg-[#0062e3] text-white text-base font-semibold hover:bg-[#0054c2] transition-colors duration-200 cursor-pointer"
          >
            Historial de Carga de Combustible
          </button>
        </div>

        <FiltrosHistorialCombustible onBuscar={handleBuscar} />
      </div>
    </div>
  );
};

export default HistorialCombustiblePage;
