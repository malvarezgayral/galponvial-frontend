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
        infoAdicional: {
          numero_serie: vehiculo.infoAdicional.numero_serie,
          licencia_conductor: vehiculo.infoAdicional.licencia_conductor,
          color: vehiculo.infoAdicional.color,
          seguro_empresa: vehiculo.infoAdicional.seguro_empresa,
          poliza: vehiculo.infoAdicional.poliza,
          id_sector_pertenencia: vehiculo.infoAdicional.id_sector_pertenencia,
        },
      });
      setError(null);
      setSuccess(false);
    }
  }, [isOpen, vehiculo]);

  if (!isOpen) return null;

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehiculo) return;

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
          id_sector_pertenencia: prev.infoAdicional?.id_sector_pertenencia ?? 0,
          [nestedField]: value,
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <input
                type="text"
                value={formData.nombre || ''}
                onChange={(e) => handleInputChange('nombre', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Modelo
              </label>
              <input
                type="text"
                value={formData.modelo || ''}
                onChange={(e) => handleInputChange('modelo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo
              </label>
              <select
                value={formData.tipo_vehiculo || ''}
                onChange={(e) => handleInputChange('tipo_vehiculo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                <option value="">Seleccionar tipo</option>
                {dropdownData?.tiposVehiculo.map((tipo) => (
                  <option key={tipo.id} value={tipo.value}>
                    {tipo.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                value={formData.status || ''}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                <option value="">Seleccionar estado</option>
                {dropdownData?.estados.map((estado) => (
                  <option key={estado.id} value={estado.value}>
                    {estado.label}
                  </option>
                ))}
              </select>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sector Pertenencia
                </label>
                <select
                  value={formData.infoAdicional?.id_sector_pertenencia || ''}
                  onChange={(e) =>
                    handleInputChange(
                      'id_sector_pertenencia',
                      parseInt(e.target.value),
                      true,
                      'id_sector_pertenencia'
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                >
                  <option value="">Seleccionar sector</option>
                  {dropdownData?.sectoresPertenencia.map((sector) => (
                    <option key={sector.id} value={sector.value}>
                      {sector.label}
                    </option>
                  ))}
                </select>
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
