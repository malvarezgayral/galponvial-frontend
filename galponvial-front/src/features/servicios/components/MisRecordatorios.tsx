import React, { useState, useEffect } from 'react';
import { recordatorioService } from '../services/recordatorioService';
import { RecordatorioCard } from './RecordatorioCard';
import { useAppStore } from '@/app/stores/appStore';
import type { RecordatorioResponse } from '../types';

/**
 * Componente para mostrar los recordatorios del usuario actual
 */
export const MisRecordatorios: React.FC = () => {
  const { user } = useAppStore();
  const [recordatorios, setRecordatorios] = useState<RecordatorioResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Carga los recordatorios del usuario
   */
  useEffect(() => {
    const loadRecordatorios = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!user || !user.dni) {
          setRecordatorios([]);
          return;
        }

        const data = await recordatorioService.obtenerHistorial(user.dni);
        setRecordatorios(data || []);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al cargar recordatorios';
        setError(errorMessage);
        setRecordatorios([]);
      } finally {
        setLoading(false);
      }
    };

    loadRecordatorios();

    // Recargar cada 60 segundos para actualizar timers
    const interval = setInterval(loadRecordatorios, 60000);
    return () => clearInterval(interval);
  }, [user]);

  if (!user) {
    return null;
  }

  return (
    <div className="w-full">
      {/* Encabezado */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
          📌 Mis Recordatorios
        </h2>
        <p className="text-[var(--color-text-secondary)]">
          Gestiona tus citas y recordatorios pendientes
        </p>
      </div>

      {/* Estado de carga */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-[#378AFE] rounded-full mb-4">
              <svg
                className="animate-spin h-6 w-6 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
            <p className="text-[var(--color-text-primary)]">Cargando recordatorios...</p>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 rounded-lg">
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}

      {/* Sin recordatorios */}
      {!loading && recordatorios.length === 0 && !error && (
        <div className="text-center py-12">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-12 h-12 text-[var(--color-text-secondary)] mx-auto mb-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-[var(--color-text-secondary)] font-medium mb-2">
            No tienes recordatorios
          </p>
          <p className="text-[var(--color-text-secondary)] text-sm">
            Crea uno nuevo en la sección de servicios
          </p>
        </div>
      )}

      {/* Grid de recordatorios */}
      {!loading && recordatorios.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {recordatorios.map((recordatorio) => (
            <RecordatorioCard
              key={recordatorio.id}
              recordatorio={recordatorio}
            />
          ))}
        </div>
      )}
    </div>
  );
};
