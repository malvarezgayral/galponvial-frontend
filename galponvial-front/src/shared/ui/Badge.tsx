import React, { type ReactNode } from 'react';

interface BadgeProps {
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  children: ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'primary',
  children,
  className = '',
}) => {
  const variantClasses = {
    primary: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-cyan-100 text-cyan-800',
  };

  return (
    <span
      className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
