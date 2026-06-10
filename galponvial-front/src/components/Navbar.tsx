import { Link, useNavigate } from "react-router-dom";
import logoMunicipio from "../assets/logos/municipio-logo.png";
import { ROUTES } from "../app/routes";
import { useAppStore } from "@/app/stores/appStore";
import { useState } from "react";

interface NavItem {
  name: string;
  href: string;
}

const Navbar = () => {
  const navigate = useNavigate();
  const { selfLogout, isLoading } = useAppStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

 const navLinks: NavItem[] = [
  { name: "Almacén", href: ROUTES.almacen },
  { name: "Vehículos", href: ROUTES.vehiculos },
  { name: "Servicios", href: ROUTES.servicios },
  
  
  
 
  { name: "Usuarios", href: ROUTES.usuarios },
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
        <ul className="w-full flex flex-row items-center justify-around m-0 p-0 h-full">
          {navLinks.map((link) => (
            <li
              key={link.name}
              className="h-full text-center flex items-center justify-center"
            >
              <Link to={link.href} className="navbar-link">
                {link.name}
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
