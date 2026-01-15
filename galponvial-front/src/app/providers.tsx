import React, { type ReactNode } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';

interface AppProvidersProps {
  children?: ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <>
      {/* Add your providers here (Redux, QueryClient, etc.) */}
      {children}
    </>
  );
};

export const RootProvider: React.FC = () => {
  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  );
};
