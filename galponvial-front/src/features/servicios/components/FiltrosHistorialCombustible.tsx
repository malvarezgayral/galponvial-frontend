import { useState } from 'react';
import type { CombustibleHistorialFiltros, RangoNumerico } from '../types';

interface FiltrosHistorialCombustibleProps {
  onBuscar: (filtros: CombustibleHistorialFiltros) => void;
}

const filtrosVacios: CombustibleHistorialFiltros = {
  periodo_desde: '',
  periodo_hasta: '',
  chofer: '',
  estacion_servicio: '',
  despachante: '',
  tipo_combustible: '',
  Galpón_Vial: '',
  km_actual: {},
  cant_combustible_despachado: {},
  litros_entrada: {},
  litros_salida: {},
  estado_parcial: '',
};

const TIPOS_COMBUSTIBLE = [
  'Diesel',
  'Diesel Premium',
  'Nafta Súper',
  'Nafta Premium',
  'GNC',
  'GLP',
  'Otro',
];

const DESPACHANTES = ['Pablo Altuna', 'Juan Torres'];

const GALPON_VIAL_OPCIONES = ['Depósito', 'Tanque'];

const ESTADOS_PARCIALES = ['Completo', 'Parcial'];

const FiltrosHistorialCombustible = ({ onBuscar }: FiltrosHistorialCombustibleProps) => {
  const [filtros, setFiltros] = useState<CombustibleHistorialFiltros>(filtrosVacios);

  const handleTextChange = (campo: keyof CombustibleHistorialFiltros, valor: string) => {
    setFiltros((prev) => ({ ...prev, [campo]: valor }));
  };

  const handleRangoChange = (
    campo: keyof CombustibleHistorialFiltros,
    tipo: keyof RangoNumerico,
    valor: string
  ) => {
    setFiltros((prev) => ({
      ...prev,
      [campo]: {
        ...(prev[campo] as RangoNumerico),
        [tipo]: valor === '' ? undefined : Number(valor),
      },
    }));
  };

  const handleBuscar = () => {
    onBuscar(filtros);
  };

  const handleLimpiar = () => {
    setFiltros(filtrosVacios);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <p className="text-[var(--color-text-primary)] font-semibold mb-4">
        Filtros de búsqueda
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-[var(--color-text-secondary)] mb-1">
            Fecha de carga (desde)
          </label>
          <input
            type="date"
            value={filtros.periodo_desde}
            onChange={(e) => handleTextChange('periodo_desde', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm text-[var(--color-text-secondary)] mb-1">
            Fecha de carga (hasta)
          </label>
          <input
            type="date"
            value={filtros.periodo_hasta}
            onChange={(e) => handleTextChange('periodo_hasta', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm text-[var(--color-text-secondary)] mb-1">
            Chofer
          </label>
          <input
            type="text"
            placeholder="Nombre del chofer"
            value={filtros.chofer}
            onChange={(e) => handleTextChange('chofer', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm text-[var(--color-text-secondary)] mb-1">
            Estación de servicio
          </label>
          <input
            type="text"
            placeholder="Nombre de la estación"
            value={filtros.estacion_servicio}
            onChange={(e) => handleTextChange('estacion_servicio', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm text-[var(--color-text-secondary)] mb-1">
            Despachante
          </label>
          <select
            value={filtros.despachante}
            onChange={(e) => handleTextChange('despachante', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="">Seleccione un despachante...</option>
            {DESPACHANTES.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-[var(--color-text-secondary)] mb-1">
            Tipo de combustible
          </label>
          <select
            value={filtros.tipo_combustible}
            onChange={(e) => handleTextChange('tipo_combustible', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="">Seleccione un tipo...</option>
            {TIPOS_COMBUSTIBLE.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-[var(--color-text-secondary)] mb-1">
            Galpón vial
          </label>
          <select
            value={filtros.Galpón_Vial}
            onChange={(e) => handleTextChange('Galpón_Vial', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="">Seleccione una opción...</option>
            {GALPON_VIAL_OPCIONES.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-[var(--color-text-secondary)] mb-1">
            KM actuales (rango)
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Mín"
              value={filtros.km_actual?.min ?? ''}
              onChange={(e) => handleRangoChange('km_actual', 'min', e.target.value)}
              className="w-1/2 border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
            <input
              type="number"
              placeholder="Máx"
              value={filtros.km_actual?.max ?? ''}
              onChange={(e) => handleRangoChange('km_actual', 'max', e.target.value)}
              className="w-1/2 border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-[var(--color-text-secondary)] mb-1">
            Cantidad despachada (litros)
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Mín"
              value={filtros.cant_combustible_despachado?.min ?? ''}
              onChange={(e) =>
                handleRangoChange('cant_combustible_despachado', 'min', e.target.value)
              }
              className="w-1/2 border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
            <input
              type="number"
              placeholder="Máx"
              value={filtros.cant_combustible_despachado?.max ?? ''}
              onChange={(e) =>
                handleRangoChange('cant_combustible_despachado', 'max', e.target.value)
              }
              className="w-1/2 border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-[var(--color-text-secondary)] mb-1">
            Litros de entrada
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Mín"
              value={filtros.litros_entrada?.min ?? ''}
              onChange={(e) => handleRangoChange('litros_entrada', 'min', e.target.value)}
              className="w-1/2 border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
            <input
              type="number"
              placeholder="Máx"
              value={filtros.litros_entrada?.max ?? ''}
              onChange={(e) => handleRangoChange('litros_entrada', 'max', e.target.value)}
              className="w-1/2 border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-[var(--color-text-secondary)] mb-1">
            Litros de salida
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Mín"
              value={filtros.litros_salida?.min ?? ''}
              onChange={(e) => handleRangoChange('litros_salida', 'min', e.target.value)}
              className="w-1/2 border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
            <input
              type="number"
              placeholder="Máx"
              value={filtros.litros_salida?.max ?? ''}
              onChange={(e) => handleRangoChange('litros_salida', 'max', e.target.value)}
              className="w-1/2 border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-[var(--color-text-secondary)] mb-1">
            Estado parcial
          </label>
          <select
            value={filtros.estado_parcial}
            onChange={(e) => handleTextChange('estado_parcial', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="">Seleccione un estado...</option>
            {ESTADOS_PARCIALES.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
        <button
          onClick={handleLimpiar}
          className="px-5 py-2 rounded-lg bg-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-300 transition-colors duration-200 cursor-pointer"
        >
          Limpiar filtros
        </button>
        <button
          onClick={handleBuscar}
          className="px-5 py-2 rounded-lg bg-[#0062e3] text-white text-sm font-semibold hover:bg-[#0054c2] transition-colors duration-200 cursor-pointer"
        >
          Buscar
        </button>
      </div>
    </div>
  );
};

export default FiltrosHistorialCombustible;
