import { useNavigate } from 'react-router-dom';
import { RecordatorioForm } from '../components/RecordatorioForm';

/**
 * Página para crear recordatorios
 */
const RecordatorioPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Botón de volver */}
        <button
          onClick={() => navigate('/servicios')}
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

        {/* Formulario de recordatorio */}
        <RecordatorioForm />
      </div>
    </div>
  );
};

export default RecordatorioPage;
