import logoMunicipio from '../assets/logos/municipio-logo.png'; 

interface NavItem {
  name: string;
  href: string;
}

const Navbar = () => {
  const navLinks: NavItem[] = [
    { name: 'Almacén', href: '#' },
    { name: 'Vehículos', href: '#' },
    { name: 'Servicios', href: '#' },
    { name: 'Proveedores', href: '#' },
    { name: 'Usuarios', href: '#' },
  ];

  return (
    <>
      <style>{`
        .custom-nav-link {
          color: white !important;
          font-size: 22px !important; 
          font-weight: 600 !important;
          transition: all 0.3s ease;
        }
        .custom-nav-link:hover {
          color: #001b42 !important;
          transform: scale(1.05); 
        }
      `}</style>

      <header className="w-full h-[265px] bg-[#242424] flex flex-col items-center justify-evenly shadow-md relative z-50">
        
        <div className="w-full flex justify-center">
          <img 
            src={logoMunicipio} 
            alt="Lobería Gobierno Local" 
            className="h-20 object-contain" 
          />
        </div>

        <nav className="bg-[#0062e3] w-[95%] max-w-[1400px] h-[68px] rounded-full shadow-lg flex items-center px-4">
          
          <ul className="w-full flex flex-row items-center justify-around m-0 p-0 list-none h-full">
            {navLinks.map((link) => (
              <li key={link.name} className="flex-1 text-center h-full flex items-center justify-center">
                <a 
                  href={link.href}
                  className="custom-nav-link no-underline block w-full"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        
      </header>
    </>
  );
};

export default Navbar;