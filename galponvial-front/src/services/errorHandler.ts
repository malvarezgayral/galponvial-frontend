import axios from 'axios';

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: Record<string, any>;
  requiredPermission?: string;
  isPermissionError?: boolean;
}

/**
 * Extracts the required permission from error response
 * Backends often include required permission in error details
 */
const extractPermissionFromError = (errorData: Record<string, any>): string | undefined => {
  // Check common patterns for permission information
  if (errorData?.requiredPermission) return errorData.requiredPermission;
  if (errorData?.permission) return errorData.permission;
  if (errorData?.detail?.permission) return errorData.detail.permission;
  if (typeof errorData?.message === 'string') {
    // Extract permission from message like "Requires permission: almacen-comun:read"
    const match = errorData.message.match(/(?:Requires |requires |permission:|permisos:)\s*([a-z\-:]+)/i);
    if (match) return match[1];
  }
  return undefined;
};

/**
 * Formats a user-friendly permission error message
 */
const formatPermissionErrorMessage = (permission?: string): string => {
  if (!permission) {
    return 'No tienes permiso para realizar esta acción';
  }

  // Map common permission names to user-friendly messages
  const permissionMessages: Record<string, string> = {
    'almacen-comun:read': 'visualizar artículos del almacén común',
    'almacen-comun:write': 'administrar artículos del almacén común',
    'almacen-taller:read': 'visualizar artículos del taller',
    'almacen-taller:write': 'administrar artículos del taller',
    'all:read': 'visualizar datos del sistema',
    'all:write': 'administrar datos del sistema',
  };

  const friendlyAction = permissionMessages[permission] || `acceder a ${permission}`;
  return `No tienes permiso para ${friendlyAction}`;
};

export const handleApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const isPermissionError = error.response?.status === 403;
    const requiredPermission = isPermissionError 
      ? extractPermissionFromError(error.response?.data || {})
      : undefined;

    // Build the error message
    let message = error.response?.data?.message || error.message || 'Error al procesar la solicitud';

    // If it's a permission error, use the formatted message
    if (isPermissionError) {
      message = formatPermissionErrorMessage(requiredPermission);
    }

    return {
      message,
      status: error.response?.status,
      code: error.code,
      details: error.response?.data,
      requiredPermission,
      isPermissionError,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
    };
  }

  return {
    message: 'An unexpected error occurred',
  };
};

export const getErrorMessage = (error: unknown): string => {
  const apiError = handleApiError(error);
  return apiError.message;
};
