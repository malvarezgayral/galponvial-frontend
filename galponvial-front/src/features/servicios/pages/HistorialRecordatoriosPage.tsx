import { useNavigate } from 'react-router-dom';

/**
 * Página de historial de recordatorios
 * TODO: implementar el listado de recordatorios
 */
const HistorialRecordatoriosPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate('/servicios/recordatorio')}
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
            onClick={() => navigate('/servicios/recordatorio')}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-lg border border-[var(--color-border-light)] text-[var(--color-text-primary)] font-medium text-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
          >
            Agregar Recordatorio
          </button>
          <button
            type="button"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-lg bg-[#378AFE] text-white font-medium text-lg hover:bg-[#0962DE] transition-colors duration-200 cursor-pointer"
          >
            Historial de Recordatorios
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
            Historial de Recordatorios
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            Próximamente vas a poder ver acá el listado de recordatorios creados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HistorialRecordatoriosPage;
