/* eslint-disable react-refresh/only-export-components */
import TanqueCombustiblePage from "../features/tanquecombustible/pages/TanqueCombustiblePage";
import DepoCombustiblePage from "../features/depocombustible/pages/DepoCombustiblePage";
import ProveedoresPage from "../features/proveedores/pages/ProveedoresPage";
import ServicePage from "../features/service/pages/ServicePage";
import ReparacionPage from "../features/reparacion/pages/ReparacionPage";
import ComprasPage from "../features/compras/pages/ComprasPage";
import DocumentacionPersonalPage from "../features/documentacionpersonal/pages/DocumentacionPersonalPage";
import NotificacionesPage from "../features/notificaciones/pages/NotificacionesPage";
import { createBrowserRouter } from "react-router-dom";
import { ROUTES } from "./routes";
import { MainLayout } from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import AlmacenPage from "../features/almacen/pages/AlmacenPage";
import ArticuloDetallesPage from "../features/almacen/pages/ArticuloDetallesPage";
import VehiculosPage from "../features/vehiculos/pages/VehiculosPage";
import VehiculoDetallesPage from "../features/vehiculos/pages/VehiculoDetallesPage";
import ServiciosPage from "../features/servicios/pages/ServiciosPage";
import CombustiblePage from "../features/servicios/pages/CombustiblePage";
import IncidentePage from "../features/servicios/pages/IncidentePage";
import RecordatorioPage from "../features/servicios/pages/RecordatorioPage";
import UsuarioVehiculoPage from "../features/servicios/pages/UsuarioVehiculoPage";
import HomePage from "../features/home/pages/HomePage";
import UsuariosPage from "../features/usuarios/pages/UsuariosPage";
import LoginPage from "../features/auth/pages/LoginPage";
import GrupoDetallesPage from "@/features/almacen/pages/GrupoDetallesPage";
import SuperUserProtectedRoute from "./components/SuperUserProtectedRoute";
import ArticulosEliminadosPage from "@/features/almacen/pages/ArticulosEliminadosPage";

const AuditoriaPage = () => <h1 className="text-3xl font-bold">Auditoría</h1>;

export const router = createBrowserRouter([
  {
    path: ROUTES.login,
    element: <LoginPage />,
  },
  {
    element: <MainLayout />,
    children: [
      { path: ROUTES.home, element: <ProtectedRoute><HomePage /></ProtectedRoute> },
      { path: ROUTES.vehiculos, element: <ProtectedRoute><VehiculosPage /></ProtectedRoute> },
      { path: "/vehiculos/:id", element: <ProtectedRoute><VehiculoDetallesPage /></ProtectedRoute> },
      { path: ROUTES.almacen, element: <ProtectedRoute><AlmacenPage /></ProtectedRoute> },
      { path: "/almacen/:id", element: <ProtectedRoute><ArticuloDetallesPage /></ProtectedRoute> },
      { path: ROUTES.articulosEliminados, element: <AdminProtectedRoute><ArticulosEliminadosPage /></AdminProtectedRoute> },
      { path: ROUTES.servicios, element: <ProtectedRoute><ServiciosPage /></ProtectedRoute> },
      { path: "/servicios/combustible", element: <ProtectedRoute><CombustiblePage /></ProtectedRoute> },
      { path: "/servicios/incidente", element: <ProtectedRoute><IncidentePage /></ProtectedRoute> },
      { path: "/servicios/recordatorio", element: <ProtectedRoute><RecordatorioPage /></ProtectedRoute> },
      { path: "/servicios/usuario-vehiculo", element: <SuperUserProtectedRoute><UsuarioVehiculoPage /></SuperUserProtectedRoute> },
      { path: ROUTES.usuarios, element: <AdminProtectedRoute><UsuariosPage /></AdminProtectedRoute> },
      { path: '/almacen/grupos/:id', element: <ProtectedRoute><GrupoDetallesPage /></ProtectedRoute> },
      { path: ROUTES.auditoria, element: <AuditoriaPage /> },
      { path: ROUTES.proveedores, element: <ProtectedRoute><ProveedoresPage /></ProtectedRoute> },
      { path: ROUTES.depoCombustible, element: <ProtectedRoute><DepoCombustiblePage /></ProtectedRoute> },
      { path: ROUTES.tanqueCombustible, element: <ProtectedRoute><TanqueCombustiblePage /></ProtectedRoute> },
      { path: ROUTES.service, element: <ProtectedRoute><ServicePage /></ProtectedRoute> },
      { path: ROUTES.reparacion, element: <ProtectedRoute><ReparacionPage /></ProtectedRoute> },
      { path: ROUTES.compras, element: <ProtectedRoute><ComprasPage /></ProtectedRoute> },
      { path: ROUTES.documentacionPersonal, element: <ProtectedRoute><DocumentacionPersonalPage /></ProtectedRoute> },
      { path: ROUTES.notificaciones, element: <ProtectedRoute><NotificacionesPage /></ProtectedRoute> },
    ],
  },
]);
