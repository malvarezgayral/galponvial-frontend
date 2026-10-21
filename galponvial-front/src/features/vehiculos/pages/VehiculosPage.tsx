import { useState, useEffect } from 'react';
import { useVehiculosStore } from '../store';
import { CreateVehiculoForm } from '../components/CreateVehiculoForm';
import { VehiculosView } from '../components/VehiculosView';
import UsuarioVehiculoPage from '@/features/servicios/pages/UsuarioVehiculoPage';
import { useAdminPermissions } from '@/features/usuarios/hooks/useAdminPermissions';

type VehiculosSection = 'administrar' | 'visualizar' | 'activos' | 'inactivos' | 'en-reparacion' | 'relaciones';

const ESTADOS_ACTIVOS = ['activo'];
const ESTADOS_INACTIVOS = ['inactivo'];
const ESTADOS_EN_REPARACION = ['en_reparacion'];

/**
 * Main page for vehicle management
 * Accessible to any logged-in user
 */
export default function VehiculosPage() {
  const { isSuperAdmin, canWriteModulo } = useAdminPermissions();
  const canWrite = isSuperAdmin() || canWriteModulo('vehiculos');
  const [activeSection, setActiveSection] = useState<VehiculosSection>(canWrite ? 'administrar' : 'visualizar');
  const { dropdownData, dropdownLoading, fetchDropdownOptions, fetchEnums, resetFilters } = useVehiculosStore();

  const cambiarSeccion = (seccion: VehiculosSection) => {
    resetFilters();
    setActiveSection(seccion);
  };

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
        {canWrite && (
        <button
          onClick={() => cambiarSeccion('administrar')}
          className={`px-6 py-2 font-semibold rounded-lg transition-colors cursor-pointer ${
            activeSection === 'administrar'
              ? 'bg-[#0062e3] text-white'
              : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
          }`}
        >
          Administrar vehículos
        </button>
        )}
        <button
          onClick={() => cambiarSeccion('visualizar')}
          className={`px-6 py-2 font-semibold rounded-lg transition-colors ${
            activeSection === 'visualizar'
              ? 'bg-[#0062e3] text-white'
              : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
          }`}
        >
          Visualizar vehículos
        </button>
        <button
          onClick={() => cambiarSeccion('activos')}
          className={`px-6 py-2 font-semibold rounded-lg transition-colors cursor-pointer ${
            activeSection === 'activos'
              ? 'bg-[#0062e3] text-white'
              : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
          }`}
        >
          Activos
        </button>
        <button
          onClick={() => cambiarSeccion('inactivos')}
          className={`px-6 py-2 font-semibold rounded-lg transition-colors cursor-pointer ${
            activeSection === 'inactivos'
              ? 'bg-[#0062e3] text-white'
              : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
          }`}
        >
          Inactivos
        </button>
        <button
          onClick={() => cambiarSeccion('en-reparacion')}
          className={`px-6 py-2 font-semibold rounded-lg transition-colors cursor-pointer ${
            activeSection === 'en-reparacion'
              ? 'bg-[#0062e3] text-white'
              : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
          }`}
        >
          En Reparación
        </button>
        {canWrite && (
          <button
            onClick={() => cambiarSeccion('relaciones')}
            className={`px-6 py-2 font-semibold rounded-lg transition-colors cursor-pointer ${
              activeSection === 'relaciones'
                ? 'bg-[#0062e3] text-white'
                : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
            }`}
          >
            Relaciones Usuario-Vehículo
          </button>
        )}
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
      {activeSection === 'relaciones' && canWrite && <UsuarioVehiculoPage />}
    </div>
  );
}
