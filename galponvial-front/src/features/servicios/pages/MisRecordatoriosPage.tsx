import { MisRecordatorios } from '../components/MisRecordatorios';

/**
 * Pagina de la solapa "Mis Recordatorios" de la navbar.
 * Solo muestra los recordatorios del usuario logueado.
 */
const MisRecordatoriosPage = () => {
  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <MisRecordatorios />
      </div>
    </div>
  );
};

export default MisRecordatoriosPage;
