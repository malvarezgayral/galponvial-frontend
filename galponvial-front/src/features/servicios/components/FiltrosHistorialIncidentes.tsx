import { useState } from 'react';
import type { IncidenteHistorialFiltros } from '../types';

interface FiltrosHistorialIncidentesProps {
  onBuscar: (filtros: IncidenteHistorialFiltros) => void;
}

const filtrosVacios: IncidenteHistorialFiltros = {
  periodo_desde: '',
  periodo_hasta: '',
  tipo: '',
  severidad: '',
  vehiculo: '',
  unidad: '',
};

const TIPOS_INCIDENTE = ['Mecánico', 'Eléctrico', 'Accidente', 'Desgaste', 'Otro'];

const SEVERIDADES = ['Crítica', 'Moderada', 'Baja'];

const FiltrosHistorialIncidentes = ({ onBuscar }: FiltrosHistorialIncidentesProps) => {
  const [filtros, setFiltros] = useState<IncidenteHistorialFiltros>(filtrosVacios);

  const handleChange = (campo: keyof IncidenteHistorialFiltros, valor: string) => {
    setFiltros((prev) => ({ ...prev, [campo]: valor }));
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
          <label className="block text-sm text-[var(--color-text-secondary)] mb-1 min-h-[40px]">
            Fecha del incidente (desde)
          </label>
          <input
            type="date"
            value={filtros.periodo_desde}
            onChange={(e) => handleChange('periodo_desde', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm text-[var(--color-text-secondary)] mb-1 min-h-[40px]">
            Fecha del incidente (hasta)
          </label>
          <input
            type="date"
            value={filtros.periodo_hasta}
            onChange={(e) => handleChange('periodo_hasta', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm text-[var(--color-text-secondary)] mb-1 min-h-[40px]">
            Tipo de incidente
          </label>
          <select
            value={filtros.tipo}
            onChange={(e) => handleChange('tipo', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="">Seleccionar tipo...</option>
            {TIPOS_INCIDENTE.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-[var(--color-text-secondary)] mb-1 min-h-[40px]">
            Severidad de la falla
          </label>
          <select
            value={filtros.severidad}
            onChange={(e) => handleChange('severidad', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="">Seleccionar severidad...</option>
            {SEVERIDADES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-[var(--color-text-secondary)] mb-1 min-h-[40px]">
            Vehículo
          </label>
          <select
            value={filtros.vehiculo}
            onChange={(e) => handleChange('vehiculo', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="">Seleccione un vehículo...</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-[var(--color-text-secondary)] mb-1 min-h-[40px]">
            Unidad
          </label>
          <input
            type="text"
            placeholder="Número de unidad"
            value={filtros.unidad}
            onChange={(e) => handleChange('unidad', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
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

export default FiltrosHistorialIncidentes;
