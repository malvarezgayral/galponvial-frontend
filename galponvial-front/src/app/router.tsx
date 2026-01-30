/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter } from "react-router-dom";
import { ROUTES } from "./routes";
import { MainLayout } from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import AlmacenPage from "../features/almacen/pages/AlmacenPage";
import VehiculosPage from "../features/vehiculos/pages/VehiculosPage";
import VehiculoDetallesPage from "../features/vehiculos/pages/VehiculoDetallesPage";
import UsuariosPage from "../features/usuarios/pages/UsuariosPage";
import LoginPage from "../features/auth/pages/LoginPage";
import { DetalleArticulo } from "@/features/almacen/components/DetalleArticulo";

// Placeholder pages for routes without implementation yet
const HomePage = () => <h1 className="text-3xl font-bold">Inicio</h1>;
const AuditoriaPage = () => <h1 className="text-3xl font-bold">Auditoría</h1>;

export const router = createBrowserRouter([
  {
    path: ROUTES.login,
    element: <LoginPage />,
  },
  {
    element: <MainLayout />,
    children: [
      { path: ROUTES.home, element: <HomePage /> },
      { 
        path: ROUTES.vehiculos, 
        element: (
          <ProtectedRoute>
            <VehiculosPage />
          </ProtectedRoute>
        ) 
      },
      {
        path: "/vehiculos/:id",
        element: (
          <ProtectedRoute>
            <VehiculoDetallesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.almacen,
        element: (
          <ProtectedRoute>
            <AlmacenPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/almacen/:id",
        element: (
          <ProtectedRoute>
            <DetalleArticulo />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.usuarios,
        element: (
          <AdminProtectedRoute>
            <UsuariosPage />
          </AdminProtectedRoute>
        ),
      },
      { path: ROUTES.auditoria, element: <AuditoriaPage /> },
    ],
  },
]);
