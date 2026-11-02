import React, { useState } from 'react';
import { useVehiculosStore } from '@/features/vehiculos/store';
import { useUsuariosStore } from '@/features/usuarios/store';
import { Button } from '@/shared/ui/Button';
import type { User } from '@/features/usuarios/types';
import type { Vehiculo } from '@/features/vehiculos/types';
import { registroService } from '@/features/documentacionpersonal/services/personalService';

interface AsignarFormProps {
  onAsignarClick: (vehiculo: Vehiculo, usuario: User) => Promise<void> | void;
}

/**
 * Form component for assigning vehicles to users
 * Uses vehiculosStore for vehicles and useUsuariosStore for users
 */
export const AsignarForm: React.FC<AsignarFormProps> = ({ onAsignarClick }) => {
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState<Vehiculo | null>(null);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<User | null>(null);
  
  // Nuevo estado para manejar errores locales y estado de carga
  const [errorMensaje, setErrorMensaje] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get vehicles from store
  const { vehiculos, listLoading: loadingVehiculos, fetchAllVehiculos } = useVehiculosStore();

  // Get users from store
  const { usuarios, isLoading: loadingUsuarios, fetchUsuarios } = useUsuariosStore();

    // Choferes cargados en Personal (Tipo de cargo "Chofer"), vinculados al usuario por DNI
    const [dnisChoferes, setDnisChoferes] = useState<Set<string>>(new Set());
    const [loadingChoferes, setLoadingChoferes] = useState(true);
    const [errorChoferes, setErrorChoferes] = useState<string | null>(null);

  // Fetch data on mount
  React.useEffect(() => {
    fetchAllVehiculos();
    fetchUsuarios();
  }, [fetchAllVehiculos, fetchUsuarios]);

    React.useEffect(() => {
      registroService
        .getChoferes()
        .then((choferes) => {
          setDnisChoferes(new Set(choferes.map((c) => String(c.numeroDni).replace(/\D/g, ''))));
        })
        .catch(() => {
          setErrorChoferes('No se pudo cargar la lista de choferes.');
        })
        .finally(() => setLoadingChoferes(false));
    }, []);

  const handleAsignar = async () => {
    if (vehiculoSeleccionado && usuarioSeleccionado) {
      setErrorMensaje(null); 
      setIsSubmitting(true);
      
      try {
        await onAsignarClick(vehiculoSeleccionado, usuarioSeleccionado);
        
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        setErrorMensaje(error.message || "Error al realizar la asignación");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleLimpiar = () => {
    setVehiculoSeleccionado(null);
    setUsuarioSeleccionado(null);
    setErrorMensaje(null);
  };

  // --- FILTROS DE DATOS ---
  const usuariosActivos = usuarios.filter((u) => u.isActive);
    const usuariosChoferes = usuariosActivos.filter((u) => dnisChoferes.has(String(u.dni)));
  const vehiculosDisponibles = vehiculos.filter((v) => v.status !== 'inactivo' && v.status !== 'en_reparacion');

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">
        Asignar Nuevo Vehículo
      </h3>

      {/* Cartel de error */}
      {errorMensaje && (
        <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg text-red-800 text-sm font-medium">
          {errorMensaje}
        </div>
      )}

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
                setErrorMensaje(null); // Limpiar error al cambiar selección
              }}
              disabled={loadingVehiculos || isSubmitting}
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
            Seleccionar Chofer
          </label>
          <div className="relative">
            <select
              value={usuarioSeleccionado?.dni || ''}
              onChange={(e) => {
                const usuario = usuariosChoferes.find((u) => String(u.dni) === e.target.value);
                setUsuarioSeleccionado(usuario || null);
                setErrorMensaje(null); 
              }}
              disabled={loadingUsuarios || loadingChoferes || isSubmitting}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-navbar-bg)]"
            >
              <option value="">
                {(loadingUsuarios || loadingChoferes) ? 'Cargando choferes...' : 'Elige un chofer'}
              </option>
              {usuariosChoferes.map((u) => (
                <option key={u.dni} value={u.dni}>
                  {u.nombre} {u.apellido} ({u.dni})
                </option>
              ))}
            </select>
          </div>
            {!loadingChoferes && !loadingUsuarios && usuariosChoferes.length === 0 && (
              <p className="mt-2 text-xs text-gray-500">
                {errorChoferes ??
                  'No hay choferes con usuario. Cargá el cargo "Chofer" en Personal y creá su usuario con el mismo DNI.'}
              </p>
            )}

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
        <Button 
          variant="secondary" 
          onClick={handleLimpiar}
          disabled={isSubmitting}
        >
          Limpiar
        </Button>
        <Button
          variant="primary"
          onClick={handleAsignar}
          disabled={!vehiculoSeleccionado || !usuarioSeleccionado || isSubmitting}
        >
          {isSubmitting ? 'Asignando...' : 'Asignar Vehículo'}
        </Button>
      </div>
    </div>
  );
};