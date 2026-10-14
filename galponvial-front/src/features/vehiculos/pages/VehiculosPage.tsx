import { useState, useEffect } from 'react';
import { useVehiculosStore } from '../store';
import { CreateVehiculoForm } from '../components/CreateVehiculoForm';
import { VehiculosView } from '../components/VehiculosView';

type VehiculosSection = 'administrar' | 'visualizar' | 'activos' | 'inactivos' | 'en-reparacion';

const ESTADOS_ACTIVOS = ['activo'];
const ESTADOS_INACTIVOS = ['inactivo'];
const ESTADOS_EN_REPARACION = ['en_reparacion'];

/**
 * Main page for vehicle management
 * Accessible to any logged-in user
 */
export default function VehiculosPage() {
  const [activeSection, setActiveSection] = useState<VehiculosSection>('administrar');
  const { dropdownData, dropdownLoading, fetchDropdownOptions, fetchEnums } = useVehiculosStore();

  /**
   * Fetch dropdown options on component mount
   */
  useEffect(() => {
    fetchDropdownOptions();
    fetchEnums();
  }, [fetchDropdownOptions, fetchEnums]);

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Vehículos</h1>
      </div>

      {/* Section Toggle Buttons */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveSection('administrar')}
          className={`px-6 py-2 font-semibold rounded-lg transition-colors cursor-pointer ${
            activeSection === 'administrar'
              ? 'bg-[#0062e3] text-white'
              : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
          }`}
        >
          Administrar vehículos
        </button>
        <button
          onClick={() => setActiveSection('visualizar')}
          className={`px-6 py-2 font-semibold rounded-lg transition-colors ${
            activeSection === 'visualizar'
              ? 'bg-[#0062e3] text-white'
              : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
          }`}
        >
          Visualizar vehículos
        </button>
        <button
          onClick={() => setActiveSection('activos')}
          className={`px-6 py-2 font-semibold rounded-lg transition-colors cursor-pointer ${
            activeSection === 'activos'
              ? 'bg-[#0062e3] text-white'
              : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
          }`}
        >
          Activos
        </button>
        <button
          onClick={() => setActiveSection('inactivos')}
          className={`px-6 py-2 font-semibold rounded-lg transition-colors cursor-pointer ${
            activeSection === 'inactivos'
              ? 'bg-[#0062e3] text-white'
              : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
          }`}
        >
          Inactivos
        </button>
        <button
          onClick={() => setActiveSection('en-reparacion')}
          className={`px-6 py-2 font-semibold rounded-lg transition-colors cursor-pointer ${
            activeSection === 'en-reparacion'
              ? 'bg-[#0062e3] text-white'
              : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
          }`}
        >
          En Reparación
        </button>
      </div>

      {/* Content Sections */}
      {activeSection === 'administrar' && (
        <div>
          {dropdownLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Cargando opciones...</p>
            </div>
          ) : (
            <CreateVehiculoForm dropdownData={dropdownData} />
          )}
        </div>
      )}

      {activeSection === 'visualizar' && <VehiculosView />}

      {activeSection === 'activos' && <VehiculosView estadosPermitidos={ESTADOS_ACTIVOS} />}
      {activeSection === 'inactivos' && <VehiculosView estadosPermitidos={ESTADOS_INACTIVOS} />}
      {activeSection === 'en-reparacion' && <VehiculosView estadosPermitidos={ESTADOS_EN_REPARACION} />}
    </div>
  );
}
