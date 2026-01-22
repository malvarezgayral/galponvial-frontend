import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppStore } from '@/app/stores/appStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Protected route component that requires user authentication
 * Redirects unauthenticated users to login page
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAppStore();
  // Not authenticated - redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // User is authenticated - render children
  return <>{children}</>;
};

export default ProtectedRoute;
