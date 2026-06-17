import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/app/stores/appStore';
import { ServicioCard } from '../components/ServicioCard';

const FuelIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v7.5m0 0l-3-3m3 3l3-3M3 20.25a4.5 4.5 0 015.572-4.425A4.5 4.5 0 0116.5 12a4.494 4.494 0 00-3.6-4.425A4.5 4.5 0 003 16.5z" />
  </svg>
);

const IncidentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c.055-.641.407-1.187.9-1.501m0 0h16.806c.493.314.845.86.9 1.501M3 20.25V6a2.25 2.25 0 012.25-2.25h14.5A2.25 2.25 0 0122 6v14.25m-21 0a2.25 2.25 0 002.25 2.25h14.5a2.25 2.25 0 002.25-2.25" />
  </svg>
);

const ReminderIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.143 17h10.714a2.25 2.25 0 002.25-2.25V5.25a2.25 2.25 0 00-2.25-2.25H9.143c-1.355 0-2.573.681-3.322 1.708m0 0H3.75m0 0V21m0-13.5h3.75" />
  </svg>
);

const UserVehicleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
  </svg>
);

const ProveedoresIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
  </svg>
);

const ServiceIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l.75-1.3m-6.063 16.658l.26-1.477m2.605-14.772l.26-1.477m0 17.726l-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205L12 12m6.894 5.785l-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864l-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495" />
  </svg>
);

const ReparacionIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75a4.5 4.5 0 01-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 11-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 016.336-4.486l-3.276 3.276a3.004 3.004 0 002.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852z" />
  </svg>
);

const DepositoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
  </svg>
);

const ServiciosPage = () => {
  const navigate = useNavigate();
  const { user } = useAppStore();

  const isAdmin =
    user && (user.rol === 'admin' || user.rol === 'super-admin' || user.rol === 'superadmin' || user.rol === 'superuser');

  const handleCombustible = () => navigate('/servicios/combustible');
  const handleIncidente = () => navigate('/servicios/incidente');
  const handleRecordatorio = () => navigate('/servicios/recordatorio');
  const handleUsuarioVehiculo = () => navigate('/servicios/usuario-vehiculo');
  const handleProveedores = () => navigate('/proveedores');
  const handleService = () => navigate('/service');
  const handleReparacion = () => navigate('/reparacion');
  const handleDeposito = () => navigate('/depo-combustible');

  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-[var(--color-text-primary)] mb-2">
            Servicios
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)]">
            Gestiona los servicios asociados a tus vehículos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center items-stretch">
          <ServicioCard
            title="Carga de Combustible"
            description="Registra una nueva carga de combustible para un vehículo"
            icon={<FuelIcon />}
            onClick={handleCombustible}
          />
          <ServicioCard
            title="Reporte de Incidente"
            description="Reporta un incidente o problema con un vehículo"
            icon={<IncidentIcon />}
            onClick={handleIncidente}
          />
          <ServicioCard
            title="Agregar Recordatorio"
            description="Crea un recordatorio para un mantenimiento o tarea futura"
            icon={<ReminderIcon />}
            onClick={handleRecordatorio}
          />
          <ServicioCard
            title="Proveedores"
            description="Gestioná compras directas, presupuestos y proveedores"
            icon={<ProveedoresIcon />}
            onClick={handleProveedores}
          />
          <ServicioCard
            title="Service"
            description="Registrá y consultá el service de los vehículos"
            icon={<ServiceIcon />}
            onClick={handleService}
          />
          <ServicioCard
            title="Reparación"
            description="Registrá reparaciones y su estado en taller"
            icon={<ReparacionIcon />}
            onClick={handleReparacion}
          />
          <ServicioCard
            title="Depósito y Lubricantes"
            description="Gestioná el depósito de combustible y lubricantes"
            icon={<DepositoIcon />}
            onClick={handleDeposito}
          />
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