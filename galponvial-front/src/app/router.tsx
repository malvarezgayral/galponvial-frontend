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
import UsuariosProtectedRoute from "./components/UsuariosProtectedRoute";
import PersonalProtectedRoute from "./components/PersonalProtectedRoute";
import { MainLayout } from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import ModuloProtectedRoute from "./components/ModuloProtectedRoute";
import AlmacenPage from "../features/almacen/pages/AlmacenPage";
import ArticuloDetallesPage from "../features/almacen/pages/ArticuloDetallesPage";
import VehiculosPage from "../features/vehiculos/pages/VehiculosPage";
import VehiculoDetallesPage from "../features/vehiculos/pages/VehiculoDetallesPage";
import ServiciosPage from "../features/servicios/pages/ServiciosPage";
import CombustiblePage from "../features/servicios/pages/CombustiblePage";
import HistorialCombustiblePage from "../features/servicios/pages/HistorialCombustiblePage";
import ListadoCargasPage from "../features/servicios/pages/ListadoCargasPage";
import IncidentePage from "../features/servicios/pages/IncidentePage";
import HistorialIncidentesPage from "../features/servicios/pages/HistorialIncidentesPage";
import ListadoIncidentesPage from "../features/servicios/pages/ListadoIncidentesPage";
import RecordatorioPage from "../features/servicios/pages/RecordatorioPage";
import HistorialRecordatoriosPage from "../features/servicios/pages/HistorialRecordatoriosPage";
import ListadoRecordatoriosPage from "../features/servicios/pages/ListadoRecordatoriosPage";
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
      { path: ROUTES.vehiculos, element: <ModuloProtectedRoute modulo="vehiculos"><VehiculosPage /></ModuloProtectedRoute> },
      { path: "/vehiculos/:id", element: <ModuloProtectedRoute modulo="vehiculos"><VehiculoDetallesPage /></ModuloProtectedRoute> },
      { path: ROUTES.almacen, element: <ProtectedRoute><AlmacenPage /></ProtectedRoute> },
      { path: "/almacen/:id", element: <ProtectedRoute><ArticuloDetallesPage /></ProtectedRoute> },
      { path: ROUTES.articulosEliminados, element: <AdminProtectedRoute><ArticulosEliminadosPage /></AdminProtectedRoute> },
      { path: ROUTES.servicios, element: <ModuloProtectedRoute modulo="servicios"><ServiciosPage /></ModuloProtectedRoute> },
      { path: "/servicios/combustible", element: <ModuloProtectedRoute modulo="combustible"><CombustiblePage /></ModuloProtectedRoute> },
      { path: "/servicios/combustible/listado", element: <ModuloProtectedRoute modulo="combustible"><ListadoCargasPage /></ModuloProtectedRoute> },
      { path: "/servicios/combustible/historial", element: <ModuloProtectedRoute modulo="combustible"><HistorialCombustiblePage /></ModuloProtectedRoute> },
      { path: "/servicios/incidente", element: <ModuloProtectedRoute modulo="incidente"><IncidentePage /></ModuloProtectedRoute> },
      { path: "/servicios/incidente/listado", element: <ModuloProtectedRoute modulo="incidente"><ListadoIncidentesPage /></ModuloProtectedRoute> },
      { path: "/servicios/incidente/historial", element: <ModuloProtectedRoute modulo="incidente"><HistorialIncidentesPage /></ModuloProtectedRoute> },
      { path: "/servicios/recordatorio", element: <ProtectedRoute><RecordatorioPage /></ProtectedRoute> },
      { path: "/servicios/recordatorio/listado", element: <ProtectedRoute><ListadoRecordatoriosPage /></ProtectedRoute> },
      { path: "/servicios/recordatorio/historial", element: <ProtectedRoute><HistorialRecordatoriosPage /></ProtectedRoute> },
      { path: "/servicios/usuario-vehiculo", element: <SuperUserProtectedRoute><UsuarioVehiculoPage /></SuperUserProtectedRoute> },
      { path: ROUTES.usuarios, element: <UsuariosProtectedRoute><UsuariosPage /></UsuariosProtectedRoute> },
      { path: '/almacen/grupos/:id', element: <ProtectedRoute><GrupoDetallesPage /></ProtectedRoute> },
      { path: ROUTES.auditoria, element: <AuditoriaPage /> },
      { path: ROUTES.proveedores, element: <ModuloProtectedRoute modulo="proveedores"><ProveedoresPage /></ModuloProtectedRoute> },
      { path: ROUTES.depoCombustible, element: <ProtectedRoute><DepoCombustiblePage /></ProtectedRoute> },
      { path: ROUTES.tanqueCombustible, element: <ModuloProtectedRoute modulo="tanque"><TanqueCombustiblePage /></ModuloProtectedRoute> },
      { path: ROUTES.service, element: <ModuloProtectedRoute modulo="service"><ServicePage /></ModuloProtectedRoute> },
      { path: ROUTES.reparacion, element: <ModuloProtectedRoute modulo="reparacion"><ReparacionPage /></ModuloProtectedRoute> },
      { path: ROUTES.compras, element: <ModuloProtectedRoute modulo="compras"><ComprasPage /></ModuloProtectedRoute> },
      { path: ROUTES.documentacionPersonal, element: <PersonalProtectedRoute><DocumentacionPersonalPage /></PersonalProtectedRoute> },
     { path: ROUTES.notificaciones, element: <AdminProtectedRoute><NotificacionesPage /></AdminProtectedRoute> },
    ],
  },
]);
