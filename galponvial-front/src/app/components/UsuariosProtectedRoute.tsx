import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppStore } from '@/app/stores/appStore';
import { useAdminPermissions } from '@/features/usuarios/hooks/useAdminPermissions';

interface UsuariosProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Ruta de la seccion Usuarios: superadmin, o admin con all:write.
 * Sin sesion redirige a login; sin permiso, a Inicio.
 */
const UsuariosProtectedRoute: React.FC<UsuariosProtectedRouteProps> = ({ children }) => {
  const { user } = useAppStore();
  const { canAccessUsuarios } = useAdminPermissions();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!canAccessUsuarios()) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default UsuariosProtectedRoute;
