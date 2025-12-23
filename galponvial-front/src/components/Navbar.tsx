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
    <header className="w-full h-[265px] bg-[#242424] flex flex-col items-center justify-evenly shadow-md">
      <div className="w-full flex justify-center">
        <img
          src={logoMunicipio}
          alt="Lobería Gobierno Local"
          className="h-20 object-contain"
        />
      </div>

      <nav className="bg-[#0062e3] w-3/4 max-w-[1400px] h-[68px] rounded-full shadow-lg flex items-center px-4">
        <ul className="w-full flex flex-row items-center justify-around m-0 p-0 h-full">
          {navLinks.map((link) => (
            <li
              key={link.name}
              className="h-full text-center flex items-center justify-center"
            >
              {link.href !== "#" ? (
                <Link
                  to={link.href}
                  className="text-white text-[22px] font-bold transition-all duration-300 ease-in-out hover:text-[#001b42] hover:scale-105 block w-full"
                >
                  {link.name}
                </Link>
              ) : (
                <a
                  href={link.href}
                  className="text-white text-[22px] font-bold transition-all duration-300 ease-in-out hover:text-[#001b42] hover:scale-105 block w-full"
                >
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
