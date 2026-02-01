import React, { useEffect } from 'react';
import type { IncidenteResponse } from '../types';

interface IncidenteSuccessModalProps {
  data: IncidenteResponse;
  onClose: () => void;
}

/**
 * Modal de confirmación de éxito para reporte de incidente
 * Se cierra automáticamente después de 3.5 segundos
 */
export const IncidenteSuccessModal: React.FC<IncidenteSuccessModalProps> = ({
  data,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3500);

    return () => clearTimeout(timer);
  }, [onClose]);

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getEstadoBadgeColor = (estado: string): string => {
    switch (estado.toLowerCase()) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'en_revision':
        return 'bg-blue-100 text-blue-800';
      case 'resuelto':
        return 'bg-green-100 text-green-800';
      case 'rechazado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden">
        {/* Header de éxito */}
        <div className="bg-green-500 text-white px-6 py-4">
          <div className="flex items-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-xl font-bold">¡Incidente Reportado!</h3>
          </div>
        </div>

        {/* Contenido */}
        <div className="px-6 py-6 space-y-6">
          {/* Información del vehículo */}
          <div className="border-l-4 border-[#378AFE] pl-4">
            <h4 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-2 uppercase">
              Vehículo
            </h4>
            <div className="space-y-1">
              <p className="text-lg font-bold text-[var(--color-text-primary)]">
                {data.vehiculo.nombre}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Código: <span className="font-medium">{data.vehiculo.codigo}</span>
              </p>
              <p className="text-sm text-[var(--color-text-secondary)]">
                {data.vehiculo.marca} {data.vehiculo.modelo} ({data.vehiculo.anio})
              </p>
            </div>
          </div>

          {/* Información del incidente */}
          <div className="border-l-4 border-[#FF6B6B] pl-4">
            <h4 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-3 uppercase">
              Detalles del Incidente
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">Fecha:</span>
                <span className="font-medium text-[var(--color-text-primary)]">
                  {formatDate(data.fecha)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">Tipo:</span>
                <span className="font-medium text-[var(--color-text-primary)]">
                  {data.tipo.charAt(0).toUpperCase() + data.tipo.slice(1)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">Severidad:</span>
                <span className="font-medium text-[var(--color-text-primary)]">
                  {data.falla.charAt(0).toUpperCase() + data.falla.slice(1)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">Estado:</span>
                <span
                  className={`
                    px-3 py-1 rounded-full font-medium text-xs
                    ${getEstadoBadgeColor(data.estado)}
                  `}
                >
                  {data.estado.charAt(0).toUpperCase() + data.estado.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Descripción */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs font-semibold text-[var(--color-text-secondary)] mb-2 uppercase">
              Descripción
            </p>
            <p className="text-sm text-[var(--color-text-primary)] line-clamp-3">
              {data.descripcion}
            </p>
          </div>

          {/* Información del usuario */}
          <div className="text-center border-t border-gray-200 pt-4">
            <p className="text-xs text-[var(--color-text-secondary)] mb-1">Reportado por:</p>
            <p className="text-sm font-medium text-[var(--color-text-primary)]">
              {data.usuario.nombre} {data.usuario.apellido}
            </p>
            <p className="text-xs text-[var(--color-text-secondary)]">{data.usuario.email}</p>
          </div>

          {/* Mensaje de auto-cierre */}
          <div className="text-center text-xs text-[var(--color-text-secondary)]">
            Este modal se cerrará automáticamente en 3 segundos...
          </div>
        </div>

        {/* Botón de cierre manual */}
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
          <button
            onClick={onClose}
            className="
              w-full px-4 py-2 bg-[#378AFE] text-white font-medium rounded
              hover:bg-[#0962DE] transition-colors duration-200
            "
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
