import { Link } from "react-router-dom";
import { MisRecordatorios } from "@/features/servicios/components/MisRecordatorios";
import { useAppStore } from "@/app/stores/appStore";
import type { User } from "@/features/usuarios/types";

const HomePage = () => {
  const { user } = useAppStore();
  const userData = user as User;

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const getRolColor = (rol: string) => {
    const roles: Record<string, string> = {
      'super-admin': 'bg-red-100 text-red-800 border-red-300',
      'admin': 'bg-blue-100 text-blue-800 border-blue-300',
      'usuario': 'bg-green-100 text-green-800 border-green-300',
    };
    return roles[rol] || "bg-gray-100 text-gray-800 border-gray-300";
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Bienvenida */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[var(--color-text-primary)] mb-2">
            Bienvenido a Galpón Vial
          </h1>
          <p className="text-[var(--color-text-secondary)] text-lg">
            Gestiona tus vehículos, servicios y recordatorios en un solo lugar
          </p>
        </div>

        {/* Sección de Perfil del Usuario */}
        {userData && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-l-4 border-[#378AFE]">
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">
              Mi Perfil
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Nombre y Apellido */}
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-(--color-text-secondary) mb-1">
                  Nombre Completo
                </span>
                <span className="text-lg text-(--color-text-primary)">
                  {userData.nombre} {userData.apellido}
                </span>
              </div>
              {/* Email */}
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-[var(--color-text-secondary)] mb-1">
                  Correo Electrónico
                </span>
                <span className="text-lg text-[var(--color-text-primary)] break-all">
                  {userData.email}
                </span>
              </div>
              {/* DNI */}
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-[var(--color-text-secondary)] mb-1">
                  DNI
                </span>
                <span className="text-lg text-[var(--color-text-primary)]">
                  {userData.dni}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-[var(--color-text-secondary)] mb-1">
                  Fecha de Alta
                </span>
                <span className="text-lg text-[var(--color-text-primary)]">
                  {formatDate(userData.fechaCreacion)}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-[var(--color-text-secondary)] mb-1">
                  Rol
                </span>
                <span
                  className={`inline-block w-fit px-3 py-1 rounded-full text-sm font-semibold border ${getRolColor(
                    userData.rol,
                  )}`}
                >
                  {userData.rol === "super-admin"
                    ? "Super Administrador"
                    : userData.rol === "admin"
                      ? "Administrador"
                      : "Usuario"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-[var(--color-text-secondary)] mb-1">
                  Permisos
                </span>
                <div className="flex flex-wrap gap-2">
                  {userData.permisos && userData.permisos.length > 0 ? (
                    userData.permisos.map((permiso, idx) => (
                      <span
                        key={idx}
                        className="inline-block px-2 py-1 bg-[#E3F2FD] text-[#0962DE] text-xs rounded border border-[#88BAFF]"
                      >
                        {permiso.nombre}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-[var(--color-text-secondary)]">
                      Sin permisos asignados
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sección de Recordatorios */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <MisRecordatorios />
        </div>

        {/* Opciones rápidas*/}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Tarjeta de Vehículos */}
          <Link
            to="/vehiculos"
            className="
              bg-white rounded-lg shadow-md p-6 hover:shadow-lg
              transform hover:scale-105 transition-all duration-300
              border-l-4 border-[#378AFE] block
            "
          >
            <div className="text-4xl mb-4">🚗</div>
            <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">
              Vehículos
            </h3>
            <p className="text-[var(--color-text-secondary)] text-sm">
              Ver y gestionar tu flota de vehículos
            </p>
          </Link>

          {/* Tarjeta de Servicios */}
          <Link
            to="/servicios"
            className="
              bg-white rounded-lg shadow-md p-6 hover:shadow-lg
              transform hover:scale-105 transition-all duration-300
              border-l-4 border-[#80DD4B] block
            "
          >
            <div className="text-4xl mb-4">⚙️</div>
            <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">
              Servicios
            </h3>
            <p className="text-[var(--color-text-secondary)] text-sm">
              Reportar incidentes y registrar combustible
            </p>
          </Link>

          {/* Tarjeta de Almacén */}
          <Link
            to="/almacen"
            className="
              bg-white rounded-lg shadow-md p-6 hover:shadow-lg
              transform hover:scale-105 transition-all duration-300
              border-l-4 border-[#88BAFF] block
            "
          >
            <div className="text-4xl mb-4">📦</div>
            <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">
              Almacén
            </h3>
            <p className="text-[var(--color-text-secondary)] text-sm">
              Consultar inventario y artículos disponibles
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
