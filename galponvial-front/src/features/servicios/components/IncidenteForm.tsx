import React, { useState, useEffect } from 'react';
import { incidenteService } from '../services/incidenteService';
import { vehiculosService } from '@/features/vehiculos/services/vehiculosService';
import { IncidenteSuccessModal } from './IncidenteSuccessModal';
import type { IncidenteRequest, IncidenteResponse } from '../types';
import type { VehiculosEnums } from '@/features/vehiculos/types';

interface IncidenteFormProps {
  vehiculoId: number;
  userId: number;
  onSuccess?: (response: IncidenteResponse) => void;
}

/**
 * Formulario para registrar un incidente
 */
export const IncidenteForm: React.FC<IncidenteFormProps> = ({
  vehiculoId,
  userId,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<IncidenteRequest>({
    fecha: new Date().toISOString().slice(0, 19).replace('T', ' '),
    tipo: '',
    descripcion: '',
    falla: '',
    id_usuario: userId,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [enumsLoading, setEnumsLoading] = useState(true);
  const [enums, setEnums] = useState<VehiculosEnums | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successData, setSuccessData] = useState<IncidenteResponse | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  /**
   * Carga los enums disponibles al montar el componente
   */
  useEffect(() => {
    const loadEnums = async () => {
      try {
        setEnumsLoading(true);
        const enumsData = await vehiculosService.getEnums();
        setEnums(enumsData);
      } catch (error) {
        console.error('Error al cargar enums:', error);
      } finally {
        setEnumsLoading(false);
      }
    };

    loadEnums();
  }, []);

  /**
   * Valida los datos del formulario
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fecha) {
      newErrors.fecha = 'La fecha del incidente es obligatoria';
    }

    if (!formData.tipo || formData.tipo.trim() === '') {
      newErrors.tipo = 'El tipo de incidente es obligatorio';
    }

    if (!formData.descripcion || formData.descripcion.trim() === '') {
      newErrors.descripcion = 'La descripción es obligatoria';
    }

    if (!formData.falla || formData.falla.trim() === '') {
      newErrors.falla = 'El tipo de falla es obligatorio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Maneja los cambios en los inputs
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar error cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  /**
   * Maneja el envío del formulario
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await incidenteService.crearIncidente(vehiculoId, formData);
      setSuccessData(response);
      setShowSuccessModal(true);

      if (onSuccess) {
        onSuccess(response);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error al registrar el incidente';
      setGeneralError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Limpia el formulario
   */
  const handleReset = () => {
    setFormData({
      fecha: new Date().toISOString().split('T')[0],
      tipo: '',
      descripcion: '',
      falla: '',
      id_usuario: userId,
    });
    setErrors({});
    setGeneralError(null);
  };

  /**
   * Maneja el cierre del modal de éxito
   */
  const handleModalClose = () => {
    setShowSuccessModal(false);
    setSuccessData(null);
    handleReset();
  };

  if (enumsLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
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
            <p className="text-[var(--color-text-primary)]">Cargando opciones...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-6">
          Reportar Incidente
        </h2>

        {/* Error general */}
        {generalError && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 rounded-lg">
            <p className="text-red-700 font-medium">{generalError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Fecha del incidente */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
              Fecha del incidente *
            </label>
            <input
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
              className={`
                w-full px-4 py-2 border rounded-lg
                focus:outline-none focus:ring-2 focus:ring-[#378AFE]
                ${errors.fecha ? 'border-red-500' : 'border-[var(--color-border-light)]'}
              `}
            />
            {errors.fecha && <p className="text-red-500 text-sm mt-1">{errors.fecha}</p>}
          </div>

          {/* Tipo de incidente */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
              Tipo de incidente *
            </label>
            <select
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              className={`
                w-full px-4 py-2 border rounded-lg
                focus:outline-none focus:ring-2 focus:ring-[#378AFE]
                ${errors.tipo ? 'border-red-500' : 'border-[var(--color-border-light)]'}
              `}
            >
              <option value="">Seleccionar tipo...</option>
              {enums?.TipoIncidente.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                </option>
              ))}
            </select>
            {errors.tipo && <p className="text-red-500 text-sm mt-1">{errors.tipo}</p>}
          </div>

          {/* Tipo de falla */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
              Severidad de la falla *
            </label>
            <select
              name="falla"
              value={formData.falla}
              onChange={handleChange}
              className={`
                w-full px-4 py-2 border rounded-lg
                focus:outline-none focus:ring-2 focus:ring-[#378AFE]
                ${errors.falla ? 'border-red-500' : 'border-[var(--color-border-light)]'}
              `}
            >
              <option value="">Seleccionar severidad...</option>
              {enums?.FallaIncidente.map((falla) => (
                <option key={falla} value={falla}>
                  {falla.charAt(0).toUpperCase() + falla.slice(1)}
                </option>
              ))}
            </select>
            {errors.falla && <p className="text-red-500 text-sm mt-1">{errors.falla}</p>}
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
              Descripción del incidente *
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="Detalla qué sucedió..."
              rows={5}
              className={`
                w-full px-4 py-2 border rounded-lg
                focus:outline-none focus:ring-2 focus:ring-[#378AFE]
                resize-vertical
                ${errors.descripcion ? 'border-red-500' : 'border-[var(--color-border-light)]'}
              `}
            />
            {errors.descripcion && (
              <p className="text-red-500 text-sm mt-1">{errors.descripcion}</p>
            )}
            <p className="text-xs text-[var(--color-text-secondary)] mt-1">
              {formData.descripcion.length}/500 caracteres
            </p>
          </div>

          {/* Botones */}
          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={loading || enumsLoading}
              className="
                flex-1 px-6 py-3 bg-[#378AFE] text-white font-medium rounded-lg
                hover:bg-[#0962DE] disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors duration-200
              "
            >
              {loading ? 'Registrando...' : 'Registrar Incidente'}
            </button>
            <button
              type="button"
              onClick={handleReset}
              disabled={loading}
              className="
                flex-1 px-6 py-3 bg-gray-300 text-[var(--color-text-primary)] font-medium rounded-lg
                hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors duration-200
              "
            >
              Limpiar
            </button>
          </div>

          <p className="text-sm text-[var(--color-text-secondary)] mt-4">
            * Campos obligatorios
          </p>
        </form>
      </div>

      {/* Modal de éxito */}
      {showSuccessModal && successData && (
        <IncidenteSuccessModal data={successData} onClose={handleModalClose} />
      )}
    </>
  );
};
