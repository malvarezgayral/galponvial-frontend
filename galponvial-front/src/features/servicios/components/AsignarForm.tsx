import React, { useState } from 'react';
import { useVehiculosStore } from '@/features/vehiculos/store';
import { Button } from '@/shared/ui/Button';
import type { User } from '@/features/usuarios/types';
import type { Vehiculo } from '@/features/vehiculos/types';
import { registroService } from '@/features/documentacionpersonal/services/personalService';

export type ChoferAsignable = Pick<User, 'dni' | 'nombre' | 'apellido'>;

interface AsignarFormProps {
  onAsignarClick: (vehiculo: Vehiculo, chofer: ChoferAsignable) => Promise<void> | void;
}

/**
 * Formulario para asignar un vehículo a un chofer.
 * Los choferes salen del Registro Administrativo (Tipo de cargo "Chofer", con DNI),
 * tengan o no usuario del sistema.
 */
export const AsignarForm: React.FC<AsignarFormProps> = ({ onAsignarClick }) => {
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState<Vehiculo | null>(null);
  const [choferSeleccionado, setChoferSeleccionado] = useState<ChoferAsignable | null>(null);
  const [errorMensaje, setErrorMensaje] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { vehiculos, listLoading: loadingVehiculos, fetchAllVehiculos } = useVehiculosStore();

  const [choferes, setChoferes] = useState<ChoferAsignable[]>([]);
  const [loadingChoferes, setLoadingChoferes] = useState(true);
  const [errorChoferes, setErrorChoferes] = useState<string | null>(null);

  React.useEffect(() => {
    fetchAllVehiculos();
  }, [fetchAllVehiculos]);

  React.useEffect(() => {
    registroService
      .getChoferes()
      .then((lista) => {
        const vistos = new Set<string>();
        const opciones: ChoferAsignable[] = [];
        for (const c of lista) {
          const dni = String(c.numeroDni ?? '').replace(/\D/g, '');
          if (dni === '' || vistos.has(dni)) continue;
          vistos.add(dni);
          opciones.push({ dni: Number(dni), nombre: c.nombre, apellido: c.apellido });
        }
        setChoferes(opciones);
      })
      .catch(() => {
        setErrorChoferes('No se pudo cargar la lista de choferes.');
      })
      .finally(() => setLoadingChoferes(false));
  }, []);

  const handleAsignar = async () => {
    if (vehiculoSeleccionado === null || choferSeleccionado === null) return;
    setErrorMensaje(null);
    setIsSubmitting(true);
    try {
      await onAsignarClick(vehiculoSeleccionado, choferSeleccionado);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setErrorMensaje(error.message || 'Error al realizar la asignación');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLimpiar = () => {
    setVehiculoSeleccionado(null);
    setChoferSeleccionado(null);
    setErrorMensaje(null);
  };

  const vehiculosDisponibles = vehiculos.filter(
    (v) => ['inactivo', 'en_reparacion'].includes(v.status) === false
  );

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">
        Asignar Nuevo Vehículo
      </h3>

      {errorMensaje && (
        <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg text-red-800 text-sm font-medium">
          {errorMensaje}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
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
                setErrorMensaje(null);
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

          {vehiculoSeleccionado && (
            <div className="mt-3 flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                {vehiculoSeleccionado.codigo} - {vehiculoSeleccionado.nombre}
              </span>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-[var(--color-text-primary)] mb-3">
            Seleccionar Chofer
          </label>
          <div className="relative">
            <select
              value={choferSeleccionado ? String(choferSeleccionado.dni) : ''}
              onChange={(e) => {
                const chofer = choferes.find((c) => String(c.dni) === e.target.value);
                setChoferSeleccionado(chofer || null);
                setErrorMensaje(null);
              }}
              disabled={loadingChoferes || isSubmitting}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-navbar-bg)]"
            >
              <option value="">
                {loadingChoferes ? 'Cargando choferes...' : 'Elige un chofer'}
              </option>
              {choferes.map((c) => (
                <option key={c.dni} value={String(c.dni)}>
                  {c.nombre} {c.apellido} ({c.dni})
                </option>
              ))}
            </select>
          </div>
          {loadingChoferes === false && (
            <p className="mt-2 text-xs text-gray-500">
              {choferes.length === 0
                ? (errorChoferes ??
                  'No hay choferes cargados. Cargá el Tipo de cargo "Chofer" con DNI en Agregar Registro Administrativo.')
                : 'Choferes del Registro Administrativo (Tipo de cargo "Chofer").'}
            </p>
          )}

          {choferSeleccionado && (
            <div className="mt-3 flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                {choferSeleccionado.nombre} {choferSeleccionado.apellido}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        <Button variant="secondary" onClick={handleLimpiar} disabled={isSubmitting}>
          Limpiar
        </Button>
        <Button
          variant="primary"
          onClick={handleAsignar}
          disabled={vehiculoSeleccionado === null || choferSeleccionado === null || isSubmitting}
        >
          {isSubmitting ? 'Asignando...' : 'Asignar Vehículo'}
        </Button>
      </div>
    </div>
  );
};
