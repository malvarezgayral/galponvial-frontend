import React, { useState } from 'react';
import { Button } from '@/shared/ui/Button';
import type { Incidente } from '../types';

interface EditIncidenteStatusModalProps {
  isOpen: boolean;
  incidente: Incidente | null;
  onClose: () => void;
  onSubmit: (incidenteId: number, estado: 'pendiente' | 'resuelto' | 'cerrado') => Promise<void>;
  isLoading?: boolean;
}

/**
 * Modal para editar el estado de un incidente
 */
export const EditIncidenteStatusModal: React.FC<EditIncidenteStatusModalProps> = ({
  isOpen,
  incidente,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<'pendiente' | 'resuelto' | 'cerrado'>('pendiente');
  const [error, setError] = useState<string | null>(null);

  // Estados disponibles
  const statusOptions: Array<{ value: 'pendiente' | 'resuelto' | 'cerrado'; label: string }> = [
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'resuelto', label: 'Resuelto' },
    { value: 'cerrado', label: 'Cerrado' },
  ];

  // Inicializar el estado seleccionado cuando se abre el modal
  React.useEffect(() => {
    if (isOpen && incidente) {
      setSelectedStatus((incidente.estado as 'pendiente' | 'resuelto' | 'cerrado') || 'pendiente');
      setError(null);
    }
  }, [isOpen, incidente]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!incidente) return;

    setError(null);
    try {
      await onSubmit(incidente.id, selectedStatus);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar el estado';
      setError(errorMessage);
    }
  };

  if (!isOpen || !incidente) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Cambiar Estado del Incidente</h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50 cursor-pointer"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Incidente info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Tipo de Incidente</p>
            <p className="font-semibold text-gray-900">{incidente.tipo}</p>
            <p className="text-sm text-gray-600 mt-3 mb-1">Descripción</p>
            <p className="text-sm text-gray-700">{incidente.descripcion}</p>
          </div>

          {/* Error message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Status selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Nuevo Estado
            </label>
            <div className="space-y-2">
              {statusOptions.map((option) => (
                <label key={option.value} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-blue-50 border-gray-200 hover:border-blue-300 transition-colors">
                  <input
                    type="radio"
                    name="status"
                    value={option.value}
                    checked={selectedStatus === option.value}
                    onChange={(e) => setSelectedStatus(e.target.value as 'pendiente' | 'resuelto' | 'cerrado')}
                    disabled={isLoading}
                    className="w-4 h-4 text-blue-600 cursor-pointer disabled:opacity-50"
                  />
                  <span className="ml-3 text-sm font-medium text-gray-900">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={handleSubmit}
            isLoading={isLoading}
            disabled={isLoading}
          >
            Guardar Cambios
          </Button>
        </div>
      </div>
    </div>
  );
};
