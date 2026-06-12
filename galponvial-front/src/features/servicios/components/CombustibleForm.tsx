/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { combustibleService } from '../services/combustibleService';
import { CombustibleSuccessModal } from './CombustibleSuccessModal';
import type { CombustibleCargaRequest, CombustibleCargaResponse } from '../types';

interface CombustibleFormProps {
  vehiculoId: number;
  onSuccess?: (response: CombustibleCargaResponse) => void;
}

export const CombustibleForm: React.FC<CombustibleFormProps> = ({
  vehiculoId,
  onSuccess,
}) => {
  const todayString = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState<CombustibleCargaRequest>({
    fecha_carga: todayString,
    despachante: '',
    tipo_combustible: '',
    Galpón_Vial: '',
    km_actual: 0,
    cant_combustible_despachado: 0,
    chofer: '',
    estacion_servicio: '',
    litros_entrada: 0,
    litros_salida: 0,
    estado_parcial: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successData, setSuccessData] = useState<CombustibleCargaResponse | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fecha_carga) {
      newErrors.fecha_carga = 'La fecha de carga es obligatoria';
    } else {
      const selectedDate = formData.fecha_carga.split(' ')[0];
      if (selectedDate > todayString) {
        newErrors.fecha_carga = 'La fecha no puede ser mayor al día actual';
      }
    }

    if (!formData.tipo_combustible || formData.tipo_combustible.trim() === '') {
      newErrors.tipo_combustible = 'El tipo de combustible es obligatorio';
    }

    if (!formData.Galpón_Vial || formData.Galpón_Vial.trim() === '') {
      newErrors.Galpón_Vial = 'El campo Galpón Vial es obligatorio';
    }

    if (!formData.km_actual || formData.km_actual <= 0) {
      newErrors.km_actual = 'Los km actuales son obligatorios y deben ser mayor a 0';
    }

    if (!formData.cant_combustible_despachado || formData.cant_combustible_despachado <= 0) {
      newErrors.cant_combustible_despachado = 'La cantidad de combustible es obligatoria y debe ser mayor a 0';
    }

    if (!formData.chofer || formData.chofer.trim() === '') {
      newErrors.chofer = 'El chofer es obligatorio';
    }

    if (!formData.estacion_servicio || formData.estacion_servicio.trim() === '') {
      newErrors.estacion_servicio = 'La estación de servicio es obligatoria';
    }

    if (!formData.litros_entrada || formData.litros_entrada <= 0) {
      newErrors.litros_entrada = 'Los litros de entrada son obligatorios y deben ser mayor a 0';
    }

    if (!formData.litros_salida || formData.litros_salida <= 0) {
      newErrors.litros_salida = 'Los litros de salida son obligatorios y deben ser mayor a 0';
    }

    if (!formData.estado_parcial || formData.estado_parcial.trim() === '') {
      newErrors.estado_parcial = 'El estado parcial es obligatorio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const numericValue = type === 'number' ? parseFloat(value) : value;

    setFormData((prev) => ({
      ...prev,
      [name]: numericValue,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

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

  const handleReset = () => {
    setFormData({
      fecha_carga: todayString,
      despachante: '',
      tipo_combustible: '',
      Galpón_Vial: '',
      km_actual: 0,
      cant_combustible_despachado: 0,
      chofer: '',
      estacion_servicio: '',
      litros_entrada: 0,
      litros_salida: 0,
      estado_parcial: '',
    });
    setErrors({});
    setGeneralError(null);
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    setSuccessData(null);
    handleReset();
  };

  const inputClass = (field: string) => `
    w-full px-4 py-2 border rounded-lg
    focus:outline-none focus:ring-2 focus:ring-[#378AFE]
    ${errors[field] ? 'border-red-500' : 'border-[var(--color-border-light)]'}
  `;

  return (
    <>
      <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-6">
          Registrar Carga de Combustible
        </h2>

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
              max={todayString}
              onChange={handleChange}
              className={inputClass('fecha_carga')}
            />
            {errors.fecha_carga && (
              <p className="text-red-500 text-sm mt-1">{errors.fecha_carga}</p>
            )}
          </div>

          {/* Chofer */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
              Chofer *
            </label>
            <input
              type="text"
              name="chofer"
              value={formData.chofer || ''}
              onChange={handleChange}
              placeholder="Nombre del chofer"
              className={inputClass('chofer')}
            />
            {errors.chofer && (
              <p className="text-red-500 text-sm mt-1">{errors.chofer}</p>
            )}
          </div>

          {/* Estación de servicio */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
              Estación de servicio *
            </label>
            <input
              type="text"
              name="estacion_servicio"
              value={formData.estacion_servicio || ''}
              onChange={handleChange}
              placeholder="Nombre de la estación de servicio"
              className={inputClass('estacion_servicio')}
            />
            {errors.estacion_servicio && (
              <p className="text-red-500 text-sm mt-1">{errors.estacion_servicio}</p>
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

          {/* Tipo de combustible */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
              Tipo de combustible *
            </label>
            <select
              name="tipo_combustible"
              value={formData.tipo_combustible}
              onChange={handleChange}
              className={`${inputClass('tipo_combustible')} bg-white`}
            >
              <option value="">Seleccione un tipo...</option>
              <option value="Diesel">Diesel</option>
              <option value="Diesel Premium">Diesel Premium</option>
              <option value="Nafta Súper">Nafta Súper</option>
              <option value="Nafta Premium">Nafta Premium</option>
              <option value="GNC">GNC</option>
              <option value="GLP">GLP</option>
              <option value="Otro">Otro</option>
            </select>
            {errors.tipo_combustible && (
              <p className="text-red-500 text-sm mt-1">{errors.tipo_combustible}</p>
            )}
          </div>

          {/* Galpón Vial */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
              Galpón Vial *
            </label>
            <select
              name="Galpón_Vial"
              value={formData.Galpón_Vial}
              onChange={handleChange}
              className={`${inputClass('Galpón_Vial')} bg-white`}
            >
              <option value="">Seleccione una opción...</option>
              <option value="Depósito">Depósito</option>
              <option value="Tanque">Tanque</option>
            </select>
            {errors.Galpón_Vial && (
              <p className="text-red-500 text-sm mt-1">{errors.Galpón_Vial}</p>
            )}
          </div>

          {/* KM actuales */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
              KM actuales *
            </label>
            <input
              type="number"
              name="km_actual"
              value={formData.km_actual || ''}
              onChange={handleChange}
              placeholder="0"
              min="0"
              step="1"
              className={inputClass('km_actual')}
            />
            {errors.km_actual && (
              <p className="text-red-500 text-sm mt-1">{errors.km_actual}</p>
            )}
          </div>

          {/* Cantidad de combustible despachado */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
              Cantidad de combustible despachado (litros) *
            </label>
            <input
              type="number"
              name="cant_combustible_despachado"
              value={formData.cant_combustible_despachado || ''}
              onChange={handleChange}
              placeholder="0.00"
              min="0"
              step="0.01"
              className={inputClass('cant_combustible_despachado')}
            />
            {errors.cant_combustible_despachado && (
              <p className="text-red-500 text-sm mt-1">{errors.cant_combustible_despachado}</p>
            )}
          </div>

          {/* Litros de entrada */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
              Litros de entrada *
            </label>
            <input
              type="number"
              name="litros_entrada"
              value={formData.litros_entrada || ''}
              onChange={handleChange}
              placeholder="0.00"
              min="0"
              step="0.01"
              className={inputClass('litros_entrada')}
            />
            {errors.litros_entrada && (
              <p className="text-red-500 text-sm mt-1">{errors.litros_entrada}</p>
            )}
          </div>

          {/* Litros de salida */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
              Litros de salida *
            </label>
            <input
              type="number"
              name="litros_salida"
              value={formData.litros_salida || ''}
              onChange={handleChange}
              placeholder="0.00"
              min="0"
              step="0.01"
              className={inputClass('litros_salida')}
            />
            {errors.litros_salida && (
              <p className="text-red-500 text-sm mt-1">{errors.litros_salida}</p>
            )}
          </div>

          {/* Estado parcial */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
              Estado parcial *
            </label>
            <input
              type="text"
              name="estado_parcial"
              value={formData.estado_parcial || ''}
              onChange={handleChange}
              placeholder="Descripción del estado parcial"
              className={inputClass('estado_parcial')}
            />
            {errors.estado_parcial && (
              <p className="text-red-500 text-sm mt-1">{errors.estado_parcial}</p>
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
                transition-colors duration-200 cursor-pointer
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
                transition-colors duration-200 cursor-pointer
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

      {showSuccessModal && successData && (
        <CombustibleSuccessModal data={successData} onClose={handleModalClose} />
      )}
    </>
  );
};