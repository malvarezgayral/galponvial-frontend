import React, { useState, useEffect } from 'react';
import { Button } from '@/shared/ui/Button';
import { useVehiculosStore } from '../store';
import type { CreateVehiculoPayload, DropdownData } from '../types';

const INITIAL_FORM_STATE: CreateVehiculoPayload = {
  codigo: '',
  nombre: '',
  marca: '',
  modelo: '',
  anio: new Date().getFullYear(),
  tipo_vehiculo: '',
  status: 'disponible',
  infoAdicional: {
    numero_serie: 0,
    licencia_conductor: '',
    color: '',
    seguro_empresa: '',
    poliza: '',
    sector: {
      id_sector: 0,
      nombre: '',
    },
  },
};

interface CreateVehiculoFormProps {
  dropdownData: DropdownData | null;
}

/**
 * Form component for creating new vehicles
 */
export const CreateVehiculoForm: React.FC<CreateVehiculoFormProps> = ({ dropdownData }) => {
  const [formData, setFormData] = useState<CreateVehiculoPayload>(INITIAL_FORM_STATE);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const { createLoading, createError, createSuccess, createVehiculo, resetCreateState } =
    useVehiculosStore();

  /**
   * Handle input changes for main vehicle fields
   */
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    field: keyof Omit<CreateVehiculoPayload, 'infoAdicional'>
  ) => {
    const { value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [field]: field === 'anio' ? parseInt(value, 10) : value,
    }));
  };

  /**
   * Handle input changes for additional info fields
   */
  const handleAdditionalInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    field: keyof CreateVehiculoPayload['infoAdicional']
  ) => {
    const { value } = e.target;

    setFormData((prev) => {
      if (field === 'sector') {
        return {
          ...prev,
          infoAdicional: {
            ...prev.infoAdicional,
            sector: {
              id_sector: parseInt(value, 10),
              nombre: '',
            },
          },
        };
      }
      return {
        ...prev,
        infoAdicional: {
          ...prev.infoAdicional,
          [field]: field === 'numero_serie' ? parseInt(value, 10) : value,
        },
      };
    });
  };

  /**
   * Validate form before submission
   */
  const validateForm = (): boolean => {
    const requiredFields = [
      'codigo',
      'nombre',
      'marca',
      'modelo',
      'tipo_vehiculo',
      'status',
    ];

    const requiredAdditionalFields = [
      'numero_serie',
      'licencia_conductor',
      'color',
      'seguro_empresa',
      'poliza',
      'sector',
    ];

    for (const field of requiredFields) {
      if (!formData[field as keyof Omit<CreateVehiculoPayload, 'infoAdicional'>]) {
        return false;
      }
    }

    for (const field of requiredAdditionalFields) {
      if (field === 'sector') {
        const sector = formData.infoAdicional.sector as { id_sector: number; nombre: string };
        if (!sector || sector.id_sector === 0) {
          return false;
        }
      } else {
        const value = formData.infoAdicional[field as keyof Omit<typeof formData.infoAdicional, 'sector'>];
        if (value === '' || value === 0) {
          return false;
        }
      }
    }

    return true;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    await createVehiculo(formData);
  };

  /**
   * Clean the form
   */
  const cleanForm = () => {
    setFormData(INITIAL_FORM_STATE);
    resetCreateState();
    setShowSuccess(false);
    setShowError(false);
  };

  useEffect(() => {
    if (createSuccess) {
      setShowSuccess(true);
      
      // Ocultar mensaje después de 3 segundos
      const hideTimer = setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
      
      // Limpiar formulario después de 3.5 segundos (después de ocultar el mensaje)
      const cleanTimer = setTimeout(() => {
        setFormData(INITIAL_FORM_STATE);
        resetCreateState();
      }, 3500);
      
      return () => {
        clearTimeout(hideTimer);
        clearTimeout(cleanTimer);
      };
    }
  }, [createSuccess, resetCreateState]);

  // Handle error message
  useEffect(() => {
    if (createError) {
      setShowError(true);
      const timer = setTimeout(() => setShowError(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [createError]);

  return (
    <div className="bg-gray-100 p-8 rounded-lg">
      {/* Success Message */}
      {showSuccess && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          ✓ Vehículo creado exitosamente
        </div>
      )}

      {/* Error Message */}
      {showError && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          ✗ {createError || 'Error al crear el vehículo'}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Vehicle Information */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Información del vehículo</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Código */}
            <div>
              <label htmlFor="codigo" className="block text-sm font-medium text-gray-700 mb-1">
                Código vehículo
              </label>
              <input
                id="codigo"
                type="text"
                placeholder="Ej: JWLF89-X"
                value={formData.codigo}
                onChange={(e) => handleInputChange(e, 'codigo')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Estado */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => handleInputChange(e, 'status')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">Selecciona un estado</option>
                {dropdownData?.estados.map((option) => (
                  <option key={option.id} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Nombre */}
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <input
                id="nombre"
                type="text"
                placeholder="Ej: Camioneta Toyota Last Gen 4"
                value={formData.nombre}
                onChange={(e) => handleInputChange(e, 'nombre')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Uso de Combustible */}
            <div>
              <label htmlFor="combustible" className="block text-sm font-medium text-gray-700 mb-1">
                Uso de Combustible
              </label>
              <input
                id="combustible"
                type="text"
                placeholder="Ej: Gasolina"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Marca */}
            <div>
              <label htmlFor="marca" className="block text-sm font-medium text-gray-700 mb-1">
                Marca
              </label>
              <input
                id="marca"
                type="text"
                placeholder="Ej: Toyota"
                value={formData.marca}
                onChange={(e) => handleInputChange(e, 'marca')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Uso de Kilometraje */}
            <div>
              <label htmlFor="kilometraje" className="block text-sm font-medium text-gray-700 mb-1">
                Uso de kilometraje
              </label>
              <input
                id="kilometraje"
                type="number"
                placeholder="Ej: 50000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Modelo */}
            <div>
              <label htmlFor="modelo" className="block text-sm font-medium text-gray-700 mb-1">
                Modelo
              </label>
              <input
                id="modelo"
                type="text"
                placeholder="Ej: D-max"
                value={formData.modelo}
                onChange={(e) => handleInputChange(e, 'modelo')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Tipo de vehículo */}
            <div>
              <label htmlFor="tipo_vehiculo" className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de vehículo
              </label>
              <select
                id="tipo_vehiculo"
                value={formData.tipo_vehiculo}
                onChange={(e) => handleInputChange(e, 'tipo_vehiculo')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">Selecciona un tipo</option>
                {dropdownData?.tiposVehiculo.map((option) => (
                  <option key={option.id} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Año */}
            <div>
              <label htmlFor="anio" className="block text-sm font-medium text-gray-700 mb-1">
                Año
              </label>
              <input
                id="anio"
                type="number"
                min="1900"
                max={new Date().getFullYear()}
                placeholder="Ej: 2020"
                value={formData.anio}
                onChange={(e) => handleInputChange(e, 'anio')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Información adicional</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Color */}
            <div>
              <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
                Color
              </label>
              <input
                id="color"
                type="text"
                placeholder="Ej: Rojo"
                value={formData.infoAdicional.color}
                onChange={(e) => handleAdditionalInfoChange(e, 'color')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Empresa de seguros */}
            <div>
              <label htmlFor="seguro_empresa" className="block text-sm font-medium text-gray-700 mb-1">
                Empresa de seguros
              </label>
              <input
                id="seguro_empresa"
                type="text"
                placeholder="Ej: Seguros Pernada S.A"
                value={formData.infoAdicional.seguro_empresa}
                onChange={(e) => handleAdditionalInfoChange(e, 'seguro_empresa')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Número de serie */}
            <div>
              <label htmlFor="numero_serie" className="block text-sm font-medium text-gray-700 mb-1">
                Número de serie
              </label>
              <input
                id="numero_serie"
                type="number"
                placeholder="Ej: 8008859404"
                value={formData.infoAdicional.numero_serie || ''}
                onChange={(e) => handleAdditionalInfoChange(e, 'numero_serie')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Póliza */}
            <div>
              <label htmlFor="poliza" className="block text-sm font-medium text-gray-700 mb-1">
                Póliza
              </label>
              <input
                id="poliza"
                type="text"
                placeholder="Ej: unapolizadealguntipo"
                value={formData.infoAdicional.poliza}
                onChange={(e) => handleAdditionalInfoChange(e, 'poliza')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Licencia del conductor */}
            <div>
              <label htmlFor="licencia_conductor" className="block text-sm font-medium text-gray-700 mb-1">
                Licencia del conductor
              </label>
              <input
                id="licencia_conductor"
                type="text"
                placeholder="Ej: LC887"
                value={formData.infoAdicional.licencia_conductor}
                onChange={(e) => handleAdditionalInfoChange(e, 'licencia_conductor')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Sector de pertenencia */}
            <div>
              <label htmlFor="sector" className="block text-sm font-medium text-gray-700 mb-1">
                Sector de pertenencia
              </label>
              <select
                id="sector"
                value={formData.infoAdicional.sector?.id_sector || ''}
                onChange={(e) => handleAdditionalInfoChange(e, 'sector')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">Selecciona un sector</option>
                {dropdownData?.sectoresPertenencia.map((option) => (
                  <option key={option.id} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 justify-end pt-4">
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={cleanForm}
            disabled={createLoading}
          >
            Cancelar
          </Button>
          <Button type="submit" variant="primary" size="md" isLoading={createLoading}>
            Guardar
          </Button>
        </div>
      </form>
    </div>
  );
};