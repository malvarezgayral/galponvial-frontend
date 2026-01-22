import { useState, useEffect } from 'react';
import { useVehiculosStore } from '../store';
import { CreateVehiculoForm } from '../components/CreateVehiculoForm';

type VehiculosSection = 'administrar' | 'visualizar';

/**
 * Main page for vehicle management
 * Accessible to any logged-in user
 */
export default function VehiculosPage() {
  const [activeSection, setActiveSection] = useState<VehiculosSection>('administrar');
  const { dropdownData, dropdownLoading, fetchDropdownOptions } = useVehiculosStore();

  /**
   * Fetch dropdown options on component mount
   */
  useEffect(() => {
    fetchDropdownOptions();
  }, [fetchDropdownOptions]);

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Vehículos</h1>
        <p className="text-gray-600 mt-2">Administra y visualiza los vehículos municipales</p>
      </div>

      {/* Section Toggle Buttons */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveSection('administrar')}
          className={`px-6 py-2 font-semibold rounded-lg transition-colors ${
            activeSection === 'administrar'
              ? 'bg-[#80DD4B] text-gray-900'
              : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
          }`}
        >
          Administrar vehículos
        </button>
        <button
          onClick={() => setActiveSection('visualizar')}
          className={`px-6 py-2 font-semibold rounded-lg transition-colors ${
            activeSection === 'visualizar'
              ? 'bg-[#80DD4B] text-gray-900'
              : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
          }`}
        >
          Visualizar vehículos
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

      {activeSection === 'visualizar' && (
        <div className="bg-gray-100 p-8 rounded-lg">
          <p className="text-gray-600">Próximamente: Sección de visualización de vehículos</p>
        </div>
      )}
    </div>
  );
}
