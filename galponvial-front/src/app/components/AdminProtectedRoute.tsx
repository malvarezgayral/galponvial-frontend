import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppStore } from '@/app/stores/appStore';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Admin protected route component that requires user authentication and admin role
 * Redirects unauthenticated users to login page
 * Redirects non-admin users to home page
 */
const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const { user } = useAppStore();

  // Not authenticated - redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // User doesn't have admin role - redirect to home
  if (user.rol !== 'admin' && user.rol !== 'super-admin' && user.rol !== 'superadmin') {
    return <Navigate to="/" replace />;
  }

  // User is authenticated and is admin - render children
  return <>{children}</>;
};

export default AdminProtectedRoute;
