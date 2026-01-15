import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppStore } from '@/app/stores/appStore';

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'super-admin';
}

/**
 * Protected route component that requires admin access
 * Can be optionally restricted to specific admin roles
 */
const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({
  children,
  requiredRole = 'admin',
}) => {
  const { user } = useAppStore();

  // Not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // User is not admin
  if (user.rol !== 'admin' && user.rol !== 'super-admin') {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-red-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-2">Acceso Denegado</h1>
          <p className="text-gray-600 mb-4">
            No tienes permisos para acceder a esta sección
          </p>
          <a
            href="/"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Volver al Inicio
          </a>
        </div>
      </div>
    );
  }

  // Super-admin required but user is only admin
  if (requiredRole === 'super-admin' && user.rol === 'admin') {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-red-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-2">Acceso Restringido</h1>
          <p className="text-gray-600 mb-4">
            Solo super-administradores pueden acceder a esta sección
          </p>
          <a
            href="/"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Volver al Inicio
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedAdminRoute;
