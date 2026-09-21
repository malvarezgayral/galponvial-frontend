import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppStore } from '@/app/stores/appStore';
import { useAdminPermissions } from '@/features/usuarios/hooks/useAdminPermissions';

interface ModuloProtectedRouteProps {
  modulo: string;
  children: React.ReactNode;
}

/**
 * Ruta protegida por modulo. Recibe el nombre del modulo (por ejemplo
 * combustible, service) y deja pasar si canReadModulo lo permite.
 * Superadmin y usuarios con rol user pasan siempre; un admin pasa con
 * all:read, all:write o el permiso del modulo. Si no, redirige a Inicio.
 */
const ModuloProtectedRoute: React.FC<ModuloProtectedRouteProps> = ({ modulo, children }) => {
  const { user } = useAppStore();
  const { canReadModulo } = useAdminPermissions();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const sinAcceso = !canReadModulo(modulo);
  if (sinAcceso) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ModuloProtectedRoute;
