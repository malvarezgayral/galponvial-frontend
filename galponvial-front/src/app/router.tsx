import { createBrowserRouter } from "react-router-dom";
import { ROUTES } from "./routes";
import { MainLayout } from "./layouts/MainLayout";
import AlmacenPage from "../features/almacen/pages/AlmacenPage";
import VehiculosPage from "../features/vehiculos/pages/VehiculosPage";

// Placeholder pages for routes without implementation yet
const HomePage = () => <h1 className="text-3xl font-bold">Inicio</h1>;
const UsuariosPage = () => <h1 className="text-3xl font-bold">Usuarios</h1>;
const AuditoriaPage = () => <h1 className="text-3xl font-bold">Auditoría</h1>;

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: ROUTES.home, element: <HomePage /> },
      { path: ROUTES.vehiculos, element: <VehiculosPage /> },
      { path: ROUTES.almacen, element: <AlmacenPage /> },
      { path: ROUTES.usuarios, element: <UsuariosPage /> },
      { path: ROUTES.auditoria, element: <AuditoriaPage /> },
    ],
  },
]);
