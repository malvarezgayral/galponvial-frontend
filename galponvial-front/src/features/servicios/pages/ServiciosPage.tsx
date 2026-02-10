import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/app/stores/appStore';
import { ServicioCard } from '../components/ServicioCard';

/**
 * Iconos SVG reutilizables
 */
const FuelIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-10 h-10"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 8.25v7.5m0 0l-3-3m3 3l3-3M3 20.25a4.5 4.5 0 015.572-4.425A4.5 4.5 0 0116.5 12a4.494 4.494 0 00-3.6-4.425A4.5 4.5 0 003 16.5z"
    />
  </svg>
);

const IncidentIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-10 h-10"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 9v3.75m-9.303 3.376c.055-.641.407-1.187.9-1.501m0 0h16.806c.493.314.845.86.9 1.501M3 20.25V6a2.25 2.25 0 012.25-2.25h14.5A2.25 2.25 0 0122 6v14.25m-21 0a2.25 2.25 0 002.25 2.25h14.5a2.25 2.25 0 002.25-2.25"
    />
  </svg>
);

const ReminderIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-10 h-10"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.143 17h10.714a2.25 2.25 0 002.25-2.25V5.25a2.25 2.25 0 00-2.25-2.25H9.143c-1.355 0-2.573.681-3.322 1.708m0 0H3.75m0 0V21m0-13.5h3.75"
    />
  </svg>
);

const UserVehicleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-10 h-10"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
    />
  </svg>
);

/**
 * Página principal de Servicios
 * Muestra funcionalidades principales:
 * 1. Carga de combustible
 * 2. Reporte de incidente
 * 3. Agregar recordatorio
 * 4. Relaciones Usuario-Vehículo (solo para admin/superuser/superadmin)
 */
const ServiciosPage = () => {
  const navigate = useNavigate();
  const { user } = useAppStore();

  const isAdmin =
    user && (user.rol === 'admin' || user.rol === 'super-admin' || user.rol === 'superadmin' || user.rol === 'superuser');

  const handleCombustible = () => {
    navigate('/servicios/combustible');
  };

  const handleIncidente = () => {
    navigate('/servicios/incidente');
  };

  const handleRecordatorio = () => {
    navigate('/servicios/recordatorio');
  };

  const handleUsuarioVehiculo = () => {
    navigate('/servicios/usuario-vehiculo');
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Encabezado */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-[var(--color-text-primary)] mb-2">
            Servicios
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)]">
            Gestiona los servicios asociados a tus vehículos
          </p>
        </div>

        {/* Grid de servicios */}
        <div
          className="
            grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
            gap-8
            place-items-center
          "
        >
          {/* Tarjeta de Combustible */}
          <ServicioCard
            title="Carga de Combustible"
            description="Registra una nueva carga de combustible para un vehículo"
            icon={<FuelIcon />}
            onClick={handleCombustible}
          />

          {/* Tarjeta de Incidente */}
          <ServicioCard
            title="Reporte de Incidente"
            description="Reporta un incidente o problema con un vehículo"
            icon={<IncidentIcon />}
            onClick={handleIncidente}
          />

          {/* Tarjeta de Recordatorio */}
          <ServicioCard
            title="Agregar Recordatorio"
            description="Crea un recordatorio para un mantenimiento o tarea futura"
            icon={<ReminderIcon />}
            onClick={handleRecordatorio}
          />

          {/* Tarjeta de Relaciones Usuario-Vehículo (solo para admin) */}
          {isAdmin && (
            <ServicioCard
              title="Relaciones Usuario-Vehículo"
              description="Administra las asignaciones de vehículos a usuarios"
              icon={<UserVehicleIcon />}
              onClick={handleUsuarioVehiculo}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiciosPage;
