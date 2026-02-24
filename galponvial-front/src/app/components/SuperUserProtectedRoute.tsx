import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppStore } from '@/app/stores/appStore';

interface SuperUserProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * SuperUser protected route component that requires user authentication and superuser role
 * Allows access to: admin, super-admin, superadmin, superuser
 * Redirects unauthenticated users to login page
 * Redirects non-admin users to home page
 */
const SuperUserProtectedRoute: React.FC<SuperUserProtectedRouteProps> = ({ children }) => {
  const { user } = useAppStore();

  // Not authenticated - redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // User doesn't have admin role - redirect to home
  if (
    user.rol !== 'admin' &&
    user.rol !== 'super-admin' &&
    user.rol !== 'superadmin' && 
    user.rol !== 'superuser'
  ) {
    return <Navigate to="/" replace />;
  }

  // User is authenticated and is admin - render children
  return <>{children}</>;
};

export default SuperUserProtectedRoute;
