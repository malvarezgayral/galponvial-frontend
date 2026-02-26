import React, { useState, useEffect } from 'react';
import { Button } from '@/shared/ui/Button';
import { recordatorioService } from '../services/recordatorioService';
import type { RecordatorioResponse, RecordatorioRequest } from '../types';

interface EditRecordatorioModalProps {
  isOpen: boolean;
  recordatorio: RecordatorioResponse | null;
  onClose: () => void;
  onSuccess: (updatedRecordatorio: RecordatorioResponse) => void;
}

/**
 * Modal para editar un recordatorio existente
 * Permite cambiar la fecha y/o descripción
 */
export const EditRecordatorioModal: React.FC<EditRecordatorioModalProps> = ({
  isOpen,
  recordatorio,
  onClose,
  onSuccess,
}) => {
  const [fecha, setFecha] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Cargar los datos cuando se abre el modal con un recordatorio
   */
  useEffect(() => {
    if (isOpen && recordatorio) {
      // Convierte el formato de fecha de 'YYYY-MM-DD HH:MM' a 'YYYY-MM-DDTHH:MM'
      const [date, time] = recordatorio.fecha.split(' ');
      const formattedTime = time || '00:00';
      setFecha(`${date}T${formattedTime}`);
      setDescripcion(recordatorio.descripcion);
      setError(null);
    }
  }, [isOpen, recordatorio]);

  /**
   * Limpiar estados cuando se cierra el modal
   */
  useEffect(() => {
    if (!isOpen) {
      setFecha('');
      setDescripcion('');
      setError(null);
    }
  }, [isOpen]);

  // Validar que ambos campos tengan contenido
  const isFormValid = fecha !== '' && descripcion.trim() !== '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recordatorio) return;

    setError(null);
    setLoading(true);

    try {
      // Convierte el formato de fecha de 'YYYY-MM-DDTHH:MM' a 'YYYY-MM-DD HH:MM'
      const formattedFecha = fecha.replace('T', ' ');

      const updateData: Partial<RecordatorioRequest> = {};
      let hasChanges = false;

      if (formattedFecha !== recordatorio.fecha) {
        updateData.fecha = formattedFecha;
        hasChanges = true;
      }
      if (descripcion !== recordatorio.descripcion) {
        updateData.descripcion = descripcion;
        hasChanges = true;
      }

      // Si no hay cambios, simplemente cerrar
      if (!hasChanges) {
        onClose();
        return;
      }

      const updatedRecordatorio = await recordatorioService.updateRecordatorio(
        recordatorio.id,
        updateData
      );

      onSuccess(updatedRecordatorio);
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al editar recordatorio';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !recordatorio) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all">
      <div className="w-full max-w-md bg-white rounded-lg shadow-2xl transform transition-all">
        {/* Header */}
        <div className="bg-[#378AFE] text-white px-6 py-4 rounded-t-lg">
          <h2 className="text-xl font-bold">✏️ Editar Recordatorio</h2>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Fecha */}
          <div>
            <label htmlFor="fecha" className="block text-sm font-medium text-gray-700 mb-2">
              Fecha y hora <span className="text-red-500">*</span>
            </label>
            <input
              id="fecha"
              type="datetime-local"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              disabled={loading}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#378AFE] disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Descripción */}
          <div>
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-2">
              Descripción <span className="text-red-500">*</span>
            </label>
            <textarea
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              disabled={loading}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#378AFE] resize-none disabled:opacity-50 disabled:cursor-not-allowed"
              rows={3}
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">
              {descripcion.length}/500 caracteres
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={loading}
              disabled={loading || !isFormValid}
            >
              Guardar cambios
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
