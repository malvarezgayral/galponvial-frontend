import { Link, useNavigate } from "react-router-dom";
import logoMunicipio from "../assets/logos/municipio-logo.png";
import { ROUTES } from "../app/routes";
import { useAppStore } from "@/app/stores/appStore";
import { useState } from "react";
import { useAdminPermissions } from '@/features/usuarios/hooks/useAdminPermissions';
import { useNoLeidas } from '@/features/notificaciones/hooks/useNoLeidas';

interface NavItem {
  name: string;
  href: string;
  requiresFullAccess?: boolean;
  modulo?: string;
  onlyScoped?: boolean;
  requiresUsuariosAccess?: boolean;
  roles?: string[];
}

const Navbar = () => {
  const navigate = useNavigate();
  const { selfLogout, isLoading, user } = useAppStore();
  const { hasFullAccess, canAccessUsuarios, canReadModulo } = useAdminPermissions();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const esAdmin = user?.rol === 'admin' || user?.rol === 'superadmin';
  const { conteo } = useNoLeidas(esAdmin);
  // Un admin acotado a Almacén solo cuenta los tipos que ve en las pestañas
  const TIPOS_ALMACEN = ['almacen', 'recordatorio', 'privada'];
  const noLeidas = Object.entries(conteo)
    .filter(([tipo]) => hasFullAccess() || TIPOS_ALMACEN.includes(tipo))
    .reduce((suma, [, n]) => suma + n, 0);

  const navLinks: NavItem[] = [
    { name: "Almacén", href: ROUTES.almacen, modulo: "almacen" },
    { name: "Vehículos", href: ROUTES.vehiculos, modulo: "vehiculos", roles: ["admin", "superadmin"] },
    { name: "Servicios", href: ROUTES.servicios, modulo: "servicios", roles: ["admin", "superadmin"] },
    { name: "Lubricentro", href: ROUTES.depoCombustible, roles: ["admin", "superadmin"], onlyScoped: true },
    { name: "Recordatorio", href: "/servicios/recordatorio" },
    { name: "Notificaciones", href: ROUTES.notificaciones, roles: ["admin", "superadmin"] },
    { name: "Usuarios", href: ROUTES.usuarios, roles: ["admin", "superadmin"], requiresUsuariosAccess: true },
  ];

  const handleSelfLogout = async () => {
    try {
      setIsLoggingOut(true);
      await selfLogout();
      // Navigate to login after successful logout
      navigate(ROUTES.login);
    } catch (error) {
      console.error('Logout error:', error);
      // Still navigate to login even if there's an error
      navigate(ROUTES.login);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleLogoClick = () => {
    navigate(ROUTES.home);
  };

  return (
    <header className="navbar-header">
      <div className="w-full flex justify-center">
        <button
          onClick={handleLogoClick}
          className="bg-transparent border-none cursor-pointer hover:opacity-80 transition-opacity"
          title="Ir al inicio"
          aria-label="Ir al inicio"
        >
          <img
            src={logoMunicipio}
            alt="Lobería Gobierno Local"
            className="h-20 object-contain"
          />
        </button>
      </div>
      <nav className="navbar-nav">
        <ul className="w-full flex flex-row items-center justify-center gap-2 m-0 p-0 h-full">
          {navLinks
            .filter((link) => !link.roles || (user && link.roles.includes(user.rol)))
            .filter((link) => !link.requiresFullAccess || hasFullAccess())
            .filter((link) => !link.modulo || canReadModulo(link.modulo))
            .filter((link) => !link.onlyScoped || !hasFullAccess())
            .filter((link) => !link.requiresUsuariosAccess || canAccessUsuarios())
            .map((link) => (
              <li
                key={link.name}
                className="h-full text-center flex items-center justify-center"
              >
                <Link to={link.href} className="navbar-link relative">
                  {link.name}
                  {link.href === ROUTES.notificaciones && noLeidas > 0 && (
                    <span className="ml-2 inline-flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full bg-red-600 text-white text-xs font-bold">
                      {noLeidas}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          {/* Logout Button */}
          <li className="h-full flex items-center justify-center">
            <button
              onClick={handleSelfLogout}
              disabled={isLoading || isLoggingOut}
              className="navbar-link flex items-center gap-2 hover:opacity-80 disabled:opacity-50 transition-opacity"
              title="Cerrar sesión"
              aria-label="Cerrar sesión"
            >
              {/* Logout Icon - Power off symbol */}
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
                  d="M8.25 9V5.25A2.25 2.25 0 0110.5 3h3a2.25 2.25 0 012.25 2.25v3.75m0 6v3.75a2.25 2.25 0 01-2.25 2.25h-3a2.25 2.25 0 01-2.25-2.25V15m6-6h-4.5M9 20.25h6"
                />
              </svg>
              Salir
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
