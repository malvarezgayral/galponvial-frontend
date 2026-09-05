import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppStore } from '@/app/stores/appStore';

interface SuperUserProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * SuperUser protected route component that requires user authentication and admin/superadmin role
 * Allows access to: admin, superadmin
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
    if (user.rol !== 'admin' && user.rol !== 'superadmin') {
    return <Navigate to="/" replace />;
  }

  // User is authenticated and is admin - render children
  return <>{children}</>;
};

export default SuperUserProtectedRoute;
