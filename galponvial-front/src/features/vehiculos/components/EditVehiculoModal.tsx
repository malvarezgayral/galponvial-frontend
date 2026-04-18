import { useState, useEffect } from 'react';
import { Button } from '@/shared/ui/Button';
import { useVehiculosStore } from '../store';
import type { Vehiculo, DropdownData } from '../types';

interface EditVehiculoModalProps {
  isOpen: boolean;
  vehiculoId: number | null;
  dropdownData: DropdownData | null;
  onClose: () => void;
}

/**
 * Modal for editing a vehicle
 */
export const EditVehiculoModal: React.FC<EditVehiculoModalProps> = ({
  isOpen,
  vehiculoId,
  dropdownData,
  onClose,
}) => {
  const { vehiculos, updateVehiculo } = useVehiculosStore();

  // Form state
  const [formData, setFormData] = useState<Partial<Vehiculo>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Find the vehicle to edit
  const vehiculo = vehiculoId ? vehiculos.find((v) => v.id_vehiculo === vehiculoId) : null;

  // Initialize form when modal opens or vehicle changes
  useEffect(() => {
    if (isOpen && vehiculo) {
      setFormData({
        codigo: vehiculo.codigo,
        nombre: vehiculo.nombre,
        marca: vehiculo.marca,
        modelo: vehiculo.modelo,
        anio: vehiculo.anio,
        tipo_vehiculo: vehiculo.tipo_vehiculo,
        status: vehiculo.status,
        delegacion: vehiculo.delegacion,
        infoAdicional: {
          numero_serie: vehiculo.infoAdicional.numero_serie,
          licencia_conductor: vehiculo.infoAdicional.licencia_conductor,
          color: vehiculo.infoAdicional.color,
          seguro_empresa: vehiculo.infoAdicional.seguro_empresa,
          poliza: vehiculo.infoAdicional.poliza,
          sector: vehiculo.infoAdicional.sector,
        },
      });
      setError(null);
      setSuccess(false);
      setFieldErrors({});
    }
  }, [isOpen, vehiculo]);

  if (!isOpen) return null;

  /**
   * Validate form before submission
   */
  const validateForm = (): { isValid: boolean; errors: Record<string, string> } => {
    const errors: Record<string, string> = {};
    const requiredFields = ['codigo', 'nombre', 'marca', 'modelo', 'tipo_vehiculo', 'status', 'delegacion'];
    const requiredAdditionalFields = ['numero_serie', 'licencia_conductor', 'color', 'seguro_empresa', 'poliza', 'sector'];

    for (const field of requiredFields) {
      const value = formData[field as keyof Vehiculo];
      if (!value) {
        errors[field] = 'Este campo es requerido';
      }
    }

    for (const field of requiredAdditionalFields) {
      if (field === 'sector') {
        const sector = formData.infoAdicional?.sector as { id_sector: number; nombre: string } | undefined;
        if (!sector || sector.id_sector === 0) {
          errors[`infoAdicional.${field}`] = 'Este campo es requerido';
        }
      } else {
        const value = formData.infoAdicional?.[field as keyof Omit<typeof formData.infoAdicional, 'sector'>];
        if (value === '' || value === 0) {
          errors[`infoAdicional.${field}`] = 'Este campo es requerido';
        }
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehiculo) return;

    const validation = validateForm();
    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      return;
    }

    setFieldErrors({});
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await updateVehiculo(vehiculo.id_vehiculo, formData);
      setSuccess(true);
      // Close modal after 1.5 seconds on success
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al actualizar vehículo';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle input change
   */
  const handleInputChange = (
    field: string,
    value: any,
    isNested = false,
    nestedField?: string
  ) => {
    if (isNested && nestedField) {
      setFormData((prev) => ({
        ...prev,
        infoAdicional: {
          numero_serie: prev.infoAdicional?.numero_serie ?? 0,
          licencia_conductor: prev.infoAdicional?.licencia_conductor ?? '',
          color: prev.infoAdicional?.color ?? '',
          seguro_empresa: prev.infoAdicional?.seguro_empresa ?? '',
          poliza: prev.infoAdicional?.poliza ?? '',
          sector: nestedField === 'sector' 
            ? { id_sector: value, nombre: prev.infoAdicional?.sector?.nombre ?? '' }
            : prev.infoAdicional?.sector ?? { id_sector: 0, nombre: '' },
          ...(nestedField !== 'sector' && { [nestedField]: value }),
        } as any,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 shadow-xl max-h-96 overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Editar Vehículo</h2>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
            {error}
          </div>
        )}

        {/* Success message */}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded text-green-800 text-sm">
            ¡Vehículo actualizado correctamente!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Row 1: Código y Nombre */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Código
              </label>
              <input
                type="text"
                value={formData.codigo || ''}
                onChange={(e) => handleInputChange('codigo', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  fieldErrors.codigo ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
                disabled={loading}
              />
              {fieldErrors.codigo && <p className="text-red-500 text-sm mt-1">{fieldErrors.codigo}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <input
                type="text"
                value={formData.nombre || ''}
                onChange={(e) => handleInputChange('nombre', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  fieldErrors.nombre ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
                disabled={loading}
              />
              {fieldErrors.nombre && <p className="text-red-500 text-sm mt-1">{fieldErrors.nombre}</p>}
            </div>
          </div>

          {/* Row 2: Marca y Modelo */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Marca
              </label>
              <input
                type="text"
                value={formData.marca || ''}
                onChange={(e) => handleInputChange('marca', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  fieldErrors.marca ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
                disabled={loading}
              />
              {fieldErrors.marca && <p className="text-red-500 text-sm mt-1">{fieldErrors.marca}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Modelo
              </label>
              <input
                type="text"
                value={formData.modelo || ''}
                onChange={(e) => handleInputChange('modelo', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  fieldErrors.modelo ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
                disabled={loading}
              />
              {fieldErrors.modelo && <p className="text-red-500 text-sm mt-1">{fieldErrors.modelo}</p>}
            </div>
          </div>

          {/* Row 3: Año, Tipo y Estado */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Año
              </label>
              <input
                type="number"
                value={formData.anio || ''}
                onChange={(e) => handleInputChange('anio', parseInt(e.target.value))}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  fieldErrors.anio ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
                disabled={loading}
              />
              {fieldErrors.anio && <p className="text-red-500 text-sm mt-1">{fieldErrors.anio}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo
              </label>
              <select
                value={formData.tipo_vehiculo || ''}
                onChange={(e) => handleInputChange('tipo_vehiculo', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  fieldErrors.tipo_vehiculo ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
                disabled={loading}
              >
                <option value="">Seleccionar tipo</option>
                {dropdownData?.tiposVehiculo.map((tipo) => (
                  <option key={tipo.id} value={tipo.value}>
                    {tipo.label}
                  </option>
                ))}
              </select>
              {fieldErrors.tipo_vehiculo && <p className="text-red-500 text-sm mt-1">{fieldErrors.tipo_vehiculo}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                value={formData.status || ''}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  fieldErrors.status ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
                disabled={loading}
              >
                <option value="">Seleccionar estado</option>
                {dropdownData?.estados.map((estado) => (
                  <option key={estado.id} value={estado.value}>
                    {estado.label}
                  </option>
                ))}
              </select>
              {fieldErrors.status && <p className="text-red-500 text-sm mt-1">{fieldErrors.status}</p>}
            </div>
          </div>

          {/* Row 4: Delegación */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delegación
              </label>
              <input
                type="text"
                value={formData.delegacion || ''}
                onChange={(e) => handleInputChange('delegacion', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  fieldErrors.delegacion ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
                disabled={loading}
              />
              {fieldErrors.delegacion && <p className="text-red-500 text-sm mt-1">{fieldErrors.delegacion}</p>}
            </div>
          </div>

          {/* Info Adicional Section */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Información Adicional</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número de Serie
                </label>
                <input
                  type="number"
                  value={formData.infoAdicional?.numero_serie || ''}
                  onChange={(e) =>
                    handleInputChange('numero_serie', parseInt(e.target.value), true, 'numero_serie')
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    fieldErrors['infoAdicional.numero_serie'] ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  disabled={loading}
                />
                {fieldErrors['infoAdicional.numero_serie'] && <p className="text-red-500 text-sm mt-1">{fieldErrors['infoAdicional.numero_serie']}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color
                </label>
                <input
                  type="text"
                  value={formData.infoAdicional?.color || ''}
                  onChange={(e) =>
                    handleInputChange('color', e.target.value, true, 'color')
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    fieldErrors['infoAdicional.color'] ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  disabled={loading}
                />
                {fieldErrors['infoAdicional.color'] && <p className="text-red-500 text-sm mt-1">{fieldErrors['infoAdicional.color']}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Licencia Conductor
                </label>
                <input
                  type="text"
                  value={formData.infoAdicional?.licencia_conductor || ''}
                  onChange={(e) =>
                    handleInputChange('licencia_conductor', e.target.value, true, 'licencia_conductor')
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    fieldErrors['infoAdicional.licencia_conductor'] ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  disabled={loading}
                />
                {fieldErrors['infoAdicional.licencia_conductor'] && <p className="text-red-500 text-sm mt-1">{fieldErrors['infoAdicional.licencia_conductor']}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Seguro Empresa
                </label>
                <input
                  type="text"
                  value={formData.infoAdicional?.seguro_empresa || ''}
                  onChange={(e) =>
                    handleInputChange('seguro_empresa', e.target.value, true, 'seguro_empresa')
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    fieldErrors['infoAdicional.seguro_empresa'] ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  disabled={loading}
                />
                {fieldErrors['infoAdicional.seguro_empresa'] && <p className="text-red-500 text-sm mt-1">{fieldErrors['infoAdicional.seguro_empresa']}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Póliza
                </label>
                <input
                  type="text"
                  value={formData.infoAdicional?.poliza || ''}
                  onChange={(e) =>
                    handleInputChange('poliza', e.target.value, true, 'poliza')
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    fieldErrors['infoAdicional.poliza'] ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  disabled={loading}
                />
                {fieldErrors['infoAdicional.poliza'] && <p className="text-red-500 text-sm mt-1">{fieldErrors['infoAdicional.poliza']}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sector Pertenencia
                </label>
                <select
                  value={formData.infoAdicional?.sector?.id_sector || ''}
                  onChange={(e) =>
                    handleInputChange(
                      'sector',
                      parseInt(e.target.value),
                      true,
                      'sector'
                    )
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    fieldErrors['infoAdicional.sector'] ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  disabled={loading}
                >
                  <option value="">Seleccionar sector</option>
                  {dropdownData?.sectoresPertenencia.map((sector) => (
                    <option key={sector.id} value={sector.value}>
                      {sector.label}
                    </option>
                  ))}
                </select>
                {fieldErrors['infoAdicional.sector'] && <p className="text-red-500 text-sm mt-1">{fieldErrors['infoAdicional.sector']}</p>}
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-6 border-t pt-4">
            <Button
              variant="secondary"
              size="md"
              onClick={onClose}
              disabled={loading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              size="md"
              type="submit"
              isLoading={loading}
              className="flex-1"
            >
              Guardar Cambios
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
