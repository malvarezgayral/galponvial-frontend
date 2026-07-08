import { useNavigate } from 'react-router-dom';

const HistorialCombustiblePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => navigate('/servicios/combustible')}
            className="px-7 py-3 rounded-lg bg-gray-200 text-gray-700 text-base font-semibold hover:bg-gray-300 transition-colors duration-200 cursor-pointer"
          >
            Carga de Combustible
          </button>
          <button
            onClick={() => navigate('/servicios/combustible/historial')}
            className="px-7 py-3 rounded-lg bg-[#0062e3] text-white text-base font-semibold hover:bg-[#0054c2] transition-colors duration-200 cursor-pointer"
          >
            Historial de Carga de Combustible
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-[var(--color-text-primary)] font-medium mb-2">
            Historial de Carga de Combustible
          </p>
          <p className="text-[var(--color-text-secondary)] text-sm">
            Próximamente.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HistorialCombustiblePage;
