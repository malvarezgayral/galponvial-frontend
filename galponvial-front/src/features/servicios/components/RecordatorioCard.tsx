import React, { useState, useEffect } from 'react';
import type { RecordatorioResponse } from '../types';

interface RecordatorioCardProps {
  recordatorio: RecordatorioResponse;
}

/**
 * Componente para mostrar un recordatorio individual en tarjeta
 * Incluye timer de cuenta regresiva
 */
export const RecordatorioCard: React.FC<RecordatorioCardProps> = ({ recordatorio }) => {
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
        flex flex-col justify-between h-48
      `}
    >
      {/* Header con fecha y hora */}
      <div className="flex justify-between items-start">
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
      <div className="mt-4">
        <p className="text-sm line-clamp-3 opacity-95">
          {recordatorio.descripcion}
        </p>
      </div>

      {/* Footer con indicador de urgencia */}
      <div className="mt-4 pt-4 border-t border-white border-opacity-20">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-white opacity-70"></div>
          <p className="text-xs opacity-75">Recordatorio activo</p>
        </div>
      </div>
    </div>
  );
};
