import React, { useState } from 'react';
import { combustibleService } from '../services/combustibleService';
import { CombustibleSuccessModal } from './CombustibleSuccessModal';
import type { CombustibleCargaRequest, CombustibleCargaResponse } from '../types';

interface CombustibleFormProps {
  vehiculoId: number;
  onSuccess?: (response: CombustibleCargaResponse) => void;
}

/**
 * Formulario para registrar una carga de combustible
 */
export const CombustibleForm: React.FC<CombustibleFormProps> = ({
  vehiculoId,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<CombustibleCargaRequest>({
    fecha_carga: new Date().toISOString().slice(0, 19).replace('T', ' '),
    despachante: '',
    km_actual: 0,
    cant_combustible_despachado: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successData, setSuccessData] = useState<CombustibleCargaResponse | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  /**
   * Valida los datos del formulario
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fecha_carga) {
      newErrors.fecha_carga = 'La fecha de carga es obligatoria';
    }

    // ✅ CORRECCIÓN: Validar que km_actual sea mayor a 0
    if (!formData.km_actual || formData.km_actual <= 0) {
      newErrors.km_actual = 'Los km actuales son obligatorios y deben ser mayor a 0';
    }

    // ✅ MEJORA: Validación consistente para combustible
    if (!formData.cant_combustible_despachado || formData.cant_combustible_despachado <= 0) {
      newErrors.cant_combustible_despachado = 'La cantidad de combustible es obligatoria y debe ser mayor a 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Maneja los cambios en los inputs
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const numericValue = type === 'number' ? parseFloat(value) : value;

    setFormData((prev) => ({
      ...prev,
      [name]: numericValue,
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
      const response = await combustibleService.crearCarga(vehiculoId, formData);
      setSuccessData(response);
      setShowSuccessModal(true);

      if (onSuccess) {
        onSuccess(response);
      }
    } catch (error: any) {
      // ✅ MEJORA: Manejar mejor los errores del backend
      let errorMessage = 'Error al registrar la carga de combustible';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
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
      fecha_carga: new Date().toISOString().split('T')[0],
      despachante: '',
      km_actual: 0,
      cant_combustible_despachado: 0,
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

  return (
    <>
      <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-6">
          Registrar Carga de Combustible
        </h2>

        {/* Error general */}
        {generalError && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 rounded-lg">
            <p className="text-red-700 font-medium">{generalError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Fecha de carga */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
              Fecha de carga *
            </label>
            <input
              type="date"
              name="fecha_carga"
              value={formData.fecha_carga}
              onChange={handleChange}
              className={`
                w-full px-4 py-2 border rounded-lg
                focus:outline-none focus:ring-2 focus:ring-[#378AFE]
                ${errors.fecha_carga ? 'border-red-500' : 'border-[var(--color-border-light)]'}
              `}
            />
            {errors.fecha_carga && (
              <p className="text-red-500 text-sm mt-1">{errors.fecha_carga}</p>
            )}
          </div>

          {/* Despachante */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
              Despachante <span className="text-gray-500">(Opcional)</span>
            </label>
            <input
              type="text"
              name="despachante"
              value={formData.despachante || ''}
              onChange={handleChange}
              placeholder="Nombre del despachante"
              className="
                w-full px-4 py-2 border border-[var(--color-border-light)] rounded-lg
                focus:outline-none focus:ring-2 focus:ring-[#378AFE]
              "
            />
          </div>

          {/* KM actuales */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
              KM actuales *
            </label>
            <input
              type="number"
              name="km_actual"
              value={formData.km_actual}
              onChange={handleChange}
              placeholder="0"
              min="0"
              step="1"
              className={`
                w-full px-4 py-2 border rounded-lg
                focus:outline-none focus:ring-2 focus:ring-[#378AFE]
                ${errors.km_actual ? 'border-red-500' : 'border-[var(--color-border-light)]'}
              `}
            />
            {errors.km_actual && (
              <p className="text-red-500 text-sm mt-1">{errors.km_actual}</p>
            )}
          </div>

          {/* Cantidad de combustible */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
              Cantidad de combustible despachado (litros) *
            </label>
            <input
              type="number"
              name="cant_combustible_despachado"
              value={formData.cant_combustible_despachado}
              onChange={handleChange}
              placeholder="0.00"
              min="0"
              step="0.01"
              className={`
                w-full px-4 py-2 border rounded-lg
                focus:outline-none focus:ring-2 focus:ring-[#378AFE]
                ${
                  errors.cant_combustible_despachado
                    ? 'border-red-500'
                    : 'border-[var(--color-border-light)]'
                }
              `}
            />
            {errors.cant_combustible_despachado && (
              <p className="text-red-500 text-sm mt-1">{errors.cant_combustible_despachado}</p>
            )}
          </div>

          {/* Botones */}
          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="
                flex-1 px-6 py-3 bg-[#378AFE] text-white font-medium rounded-lg
                hover:bg-[#0962DE] disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors duration-200
              "
            >
              {loading ? 'Registrando...' : 'Registrar Carga'}
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
        <CombustibleSuccessModal data={successData} onClose={handleModalClose} />
      )}
    </>
  );
};