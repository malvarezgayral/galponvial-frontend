import React, { useEffect } from 'react';
import type { CombustibleCargaResponse } from '../types';

interface CombustibleSuccessModalProps {
  data: CombustibleCargaResponse;
  onClose: () => void;
}

/**
 * Modal de confirmación de éxito para carga de combustible
 * Se cierra automáticamente después de 3.5 segundos
 */
export const CombustibleSuccessModal: React.FC<CombustibleSuccessModalProps> = ({
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
            <h3 className="text-xl font-bold">¡Carga Registrada!</h3>
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

          {/* Información de la carga */}
          <div className="border-l-4 border-[#80DD4B] pl-4">
            <h4 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-3 uppercase">
              Detalles de la Carga
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">Fecha:</span>
                <span className="font-medium text-[var(--color-text-primary)]">
                  {formatDate(data.fecha_carga)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">Combustible:</span>
                <span className="font-medium text-[var(--color-text-primary)]">
                  {data.cant_combustible_despachado} L
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">KM Actuales:</span>
                <span className="font-medium text-[var(--color-text-primary)]">
                  {data.km_actual.toLocaleString('es-ES')}
                </span>
              </div>
              {data.despachante && (
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-secondary)]">Despachante:</span>
                  <span className="font-medium text-[var(--color-text-primary)]">
                    {data.despachante}
                  </span>
                </div>
              )}
            </div>
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
