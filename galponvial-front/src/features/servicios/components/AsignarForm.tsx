import React from 'react';
import { useVehiculosStore } from '@/features/vehiculos/store';
import { useUsuariosStore } from '@/features/usuarios/store';
import { Button } from '@/shared/ui/Button';
import type { User } from '@/features/usuarios/types';
import type { Vehiculo } from '@/features/vehiculos/types';

interface AsignarFormProps {
  onAsignarClick: (vehiculo: Vehiculo, usuario: User) => void;
}

/**
 * Form component for assigning vehicles to users
 * Uses vehiculosStore for vehicles and useUsuariosStore for users
 */
export const AsignarForm: React.FC<AsignarFormProps> = ({ onAsignarClick }) => {
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = React.useState<Vehiculo | null>(null);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = React.useState<User | null>(null);

  // Get vehicles from store
  const { vehiculos, listLoading: loadingVehiculos, fetchAllVehiculos } = useVehiculosStore();

  // Get users from store
  const { usuarios, isLoading: loadingUsuarios, fetchUsuarios } = useUsuariosStore();

  // Fetch data on mount
  React.useEffect(() => {
    // Fetch vehicles from store
    fetchAllVehiculos();

    // Fetch usuarios from store
    fetchUsuarios();
  }, [fetchAllVehiculos, fetchUsuarios]);

  const handleAsignar = () => {
    if (vehiculoSeleccionado && usuarioSeleccionado) {
      onAsignarClick(vehiculoSeleccionado, usuarioSeleccionado);
    }
  };

  const handleLimpiar = () => {
    setVehiculoSeleccionado(null);
    setUsuarioSeleccionado(null);
  };

  // --- FILTROS DE DATOS ---
  const usuariosActivos = usuarios.filter((u) => u.isActive);
  
  const vehiculosDisponibles = vehiculos.filter((v) => v.status !== 'fuera_de_servicio');

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">
        Asignar Nuevo Vehículo
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
        {/* Vehículos Dropdown */}
        <div>
          <label className="block text-sm font-semibold text-[var(--color-text-primary)] mb-3">
            Seleccionar Vehículo
          </label>
          <div className="relative">
            <select
              value={vehiculoSeleccionado?.id_vehiculo || ''}
              onChange={(e) => {
                const vehiculo = vehiculosDisponibles.find((v) => v.id_vehiculo === parseInt(e.target.value));
                setVehiculoSeleccionado(vehiculo || null);
              }}
              disabled={loadingVehiculos}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-navbar-bg)]"
            >
              <option value="">
                {loadingVehiculos ? 'Cargando vehículos...' : 'Elige un vehículo'}
              </option>
              {vehiculosDisponibles.map((v) => (
                <option key={v.id_vehiculo} value={v.id_vehiculo}>
                  {v.codigo} - {v.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Vehículo Selected Badge */}
          {vehiculoSeleccionado && (
            <div className="mt-3 flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                {vehiculoSeleccionado.codigo} - {vehiculoSeleccionado.nombre}
              </span>
            </div>
          )}
        </div>

        {/* Usuarios Dropdown */}
        <div>
          <label className="block text-sm font-semibold text-[var(--color-text-primary)] mb-3">
            Seleccionar Usuario
          </label>
          <div className="relative">
            <select
              value={usuarioSeleccionado?.dni || ''}
              onChange={(e) => {
                const usuario = usuariosActivos.find((u) => String(u.dni) === e.target.value);
                setUsuarioSeleccionado(usuario || null);
              }}
              disabled={loadingUsuarios}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-navbar-bg)]"
            >
              <option value="">
                {loadingUsuarios ? 'Cargando usuarios...' : 'Elige un usuario'}
              </option>
              {usuariosActivos.map((u) => (
                <option key={u.dni} value={u.dni}>
                  {u.nombre} {u.apellido} ({u.dni})
                </option>
              ))}
            </select>
          </div>

          {/* Usuario Selected Badge */}
          {usuarioSeleccionado && (
            <div className="mt-3 flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                {usuarioSeleccionado.nombre} {usuarioSeleccionado.apellido}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end">
        <Button variant="secondary" onClick={handleLimpiar}>
          Limpiar
        </Button>
        <Button
          variant="primary"
          onClick={handleAsignar}
          disabled={!vehiculoSeleccionado || !usuarioSeleccionado}
        >
          Asignar Vehículo
        </Button>
      </div>
    </div>
  );
};