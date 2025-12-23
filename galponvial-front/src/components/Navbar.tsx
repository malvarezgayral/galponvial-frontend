import { Link } from "react-router-dom";
import logoMunicipio from "../assets/logos/municipio-logo.png";
import { ROUTES } from "../app/routes";

interface NavItem {
  name: string;
  href: string;
}

const Navbar = () => {
  const navLinks: NavItem[] = [
    { name: "Almacén", href: ROUTES.almacen },
    { name: "Vehículos", href: ROUTES.vehiculos },
    { name: "Servicios", href: "#" },
    { name: "Proveedores", href: "#" },
    { name: "Usuarios", href: ROUTES.usuarios },
  ];

  return (
    <header className="navbar-header">
      <div className="w-full flex justify-center">
        <img
          src={logoMunicipio}
          alt="Lobería Gobierno Local"
          className="h-20 object-contain"
        />
      </div>

      <nav className="navbar-nav">
        <ul className="w-full flex flex-row items-center justify-around m-0 p-0 h-full">
          {navLinks.map((link) => (
            <li
              key={link.name}
              className="h-full text-center flex items-center justify-center"
            >
              {link.href !== "#" ? (
                <Link to={link.href} className="navbar-link">
                  {link.name}
                </Link>
              ) : (
                <a href={link.href} className="navbar-link">
                  {link.name}
                </a>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
