import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppStore } from '@/app/stores/appStore';
import { useAdminPermissions } from '@/features/usuarios/hooks/useAdminPermissions';

interface PersonalProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Ruta de Personal: admin o superadmin con personal:read o personal:write.
 * Sin sesion redirige a login; sin permiso, a Inicio.
 */
const PersonalProtectedRoute: React.FC<PersonalProtectedRouteProps> = ({ children }) => {
  const { user } = useAppStore();
  const { canReadPersonal } = useAdminPermissions();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!canReadPersonal()) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default PersonalProtectedRoute;
