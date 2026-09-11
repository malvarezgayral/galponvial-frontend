import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppStore } from '@/app/stores/appStore';
import { useAdminPermissions } from '@/features/usuarios/hooks/useAdminPermissions';

interface FullAccessProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Ruta protegida para modulos fuera del alcance de un admin "acotado"
 * (admin sin permisos globales all:read/all:write, restringido a un modulo especifico,
 * como Eduardo en Almacen + Recordatorios).
 * Permite: superadmin, admin con acceso completo, usuarios con rol 'user'.
 * Bloquea: admin acotado a un modulo -- redirige a Inicio.
 */
const FullAccessProtectedRoute: React.FC<FullAccessProtectedRouteProps> = ({ children }) => {
  const { user } = useAppStore();
  const { hasFullAccess } = useAdminPermissions();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const isAcotado = user.rol === 'admin' && !hasFullAccess();
  if (isAcotado) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default FullAccessProtectedRoute;
