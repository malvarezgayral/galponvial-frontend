import React, { useState, useEffect } from 'react';
import type { RecordatorioResponse } from '../types';

interface RecordatorioCardProps {
  recordatorio: RecordatorioResponse;
  onEdit?: (recordatorio: RecordatorioResponse) => void;
  onDelete?: (recordatorio: RecordatorioResponse) => void;
}

/**
 * Componente para mostrar un recordatorio individual en tarjeta
 * Incluye timer de cuenta regresiva y opciones de editar/borrar
 */
export const RecordatorioCard: React.FC<RecordatorioCardProps> = ({
  recordatorio,
  onEdit,
  onDelete,
}) => {
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [isPast, setIsPast] = useState(false);

  /**
   * Calcula el tiempo restante y lo actualiza cada segundo
   */
  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      const recordatorioDate = new Date(recordatorio.fecha.replace(' ', 'T'));
      const diff = recordatorioDate.getTime() - now.getTime();

      if (diff <= 0) {
        setIsPast(true);
        setTimeRemaining('¡Vencido!');
        return;
      }

      setIsPast(false);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (days > 0) {
        setTimeRemaining(`${days}d ${hours}h ${minutes}m`);
      } else if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
      } else if (minutes > 0) {
        setTimeRemaining(`${minutes}m ${seconds}s`);
      } else {
        setTimeRemaining(`${seconds}s`);
      }
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [recordatorio.fecha]);

  /**
   * Separa fecha y hora
   */
  const parseFechaHora = (fechaString: string) => {
    const [fecha, hora] = fechaString.split(' ');
    return { fecha, hora };
  };

  const { fecha, hora } = parseFechaHora(recordatorio.fecha);

  /**
   * Determina el color según urgencia
   */
  const getUrgencyColor = (): string => {
    if (isPast) return 'from-red-500 to-red-600';

    const now = new Date();
    const recordatorioDate = new Date(recordatorio.fecha.replace(' ', 'T'));
    const daysUntil = Math.ceil(
      (recordatorioDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysUntil <= 1) return 'from-red-500 to-red-600';
    if (daysUntil <= 7) return 'from-orange-500 to-orange-600';
    if (daysUntil <= 30) return 'from-yellow-500 to-yellow-600';
    return 'from-blue-500 to-blue-600';
  };

  return (
    <div
      className={`
        bg-gradient-to-br ${getUrgencyColor()}
        text-white rounded-3xl p-6 shadow-lg
        hover:shadow-xl transform hover:scale-105
        transition-all duration-300
        flex flex-col justify-between h-auto
      `}
    >
      {/* Header con fecha y hora */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-semibold opacity-90">📅 {fecha}</p>
          <p className="text-sm font-semibold opacity-90">🕐 {hora}</p>
        </div>
        <div className="text-right">
          <p className="text-xs opacity-75">Faltan:</p>
          <p className="text-lg font-bold">{timeRemaining}</p>
        </div>
      </div>

      {/* Descripción */}
      <div className="mb-4">
        <p className="text-sm line-clamp-3 opacity-95">{recordatorio.descripcion}</p>
      </div>

      {/* Footer con indicador de urgencia y acciones */}
      <div className="mt-4 pt-4 border-t border-white border-opacity-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-white opacity-70"></div>
            <p className="text-xs opacity-75">Recordatorio activo</p>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-2">
            {onEdit && (
              <button
                onClick={() => onEdit(recordatorio)}
                className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors duration-200"
                title="Editar recordatorio"
                type="button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 9.75a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                  />
                </svg>
              </button>
            )}

            {onDelete && (
              <button
                onClick={() => onDelete(recordatorio)}
                className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors duration-200"
                title="Eliminar recordatorio"
                type="button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.74 9l-.356 5.12m0 0l-.858 3.5m.858-3.5H9.458m5.282-8.62a2.25 2.25 0 00-1.591-2.991m0 0A2.251 2.251 0 0010 2.25h4a2.25 2.25 0 012.25 2.25m-4.5 0a2.25 2.25 0 00-2.25 2.25m.165 12.97a1.968 1.968 0 011.966-1.968h2.736a1.968 1.968 0 011.967 1.968m-9.636-11.63A1.875 1.875 0 0110.5 7.5H7.5a1.875 1.875 0 00-1.865 2.12m9.636 11.63l.858-3.5m0 0l-.354-5.12m0 0h-8.464m8.464 0l-.025-.025m-8.439.025l.004.039m0 0h-.371"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
