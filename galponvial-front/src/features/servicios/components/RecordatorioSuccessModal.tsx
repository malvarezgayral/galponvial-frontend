import React, { useEffect } from 'react';
import type { RecordatorioResponse } from '../types';

interface RecordatorioSuccessModalProps {
  data: RecordatorioResponse;
  onClose: () => void;
}

/**
 * Modal de confirmación de éxito para recordatorio
 * Se cierra automáticamente después de 3.5 segundos
 */
export const RecordatorioSuccessModal: React.FC<RecordatorioSuccessModalProps> = ({
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

  const getDaysUntil = (dateString: string): number => {
    const recordatorioDate = new Date(dateString);
    const today = new Date();
    const diffTime = recordatorioDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntil = getDaysUntil(data.fecha);

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
            <h3 className="text-xl font-bold">¡Recordatorio Creado!</h3>
          </div>
        </div>

        {/* Contenido */}
        <div className="px-6 py-6 space-y-6">
          {/* Información del usuario */}
          {data.usuario && (
            <div className="border-l-4 border-[#378AFE] pl-4">
              <h4 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-2 uppercase">
                Usuario
              </h4>
              <div className="space-y-1">
                <p className="text-lg font-bold text-[var(--color-text-primary)]">
                  {data.usuario.nombre} {data.usuario.apellido}
                </p>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  DNI: <span className="font-medium">{data.usuario.dni}</span>
                </p>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  {data.usuario.email}
                </p>
              </div>
            </div>
          )}

          {/* Información del recordatorio */}
          <div className="border-l-4 border-[#80DD4B] pl-4">
            <h4 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-3 uppercase">
              Detalles del Recordatorio
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">Fecha:</span>
                <span className="font-medium text-[var(--color-text-primary)]">
                  {formatDate(data.fecha)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">Faltan:</span>
                <span
                  className={`
                    px-3 py-1 rounded-full font-medium text-xs
                    ${
                      daysUntil <= 7
                        ? 'bg-red-100 text-red-800'
                        : daysUntil <= 30
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                    }
                  `}
                >
                  {daysUntil} día{daysUntil !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>

          {/* Descripción */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs font-semibold text-[var(--color-text-secondary)] mb-2 uppercase">
              Descripción
            </p>
            <p className="text-sm text-[var(--color-text-primary)]">
              {data.descripcion}
            </p>
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
              hover:bg-[#0962DE] transition-colors duration-200 cursor-pointer
            "
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
