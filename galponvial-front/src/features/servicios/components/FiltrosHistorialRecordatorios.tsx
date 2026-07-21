import { useState } from 'react';
import type { RecordatorioHistorialFiltros } from '../types';

interface FiltrosHistorialRecordatoriosProps {
  onBuscar: (filtros: RecordatorioHistorialFiltros) => void;
}

const filtrosVacios: RecordatorioHistorialFiltros = {
  fecha_hora: '',
  periodo_desde: '',
  periodo_hasta: '',
  destinatario: '',
  vialidad: '',
};

const VIALIDADES = [
  'Combustible',
  'Almacén',
  'Vehículos',
  'Proveedores',
  'Service',
  'Reparación',
  'Lubricentro',
  'Compras',
  'Personal',
  'Privado',
];

const FiltrosHistorialRecordatorios = ({ onBuscar }: FiltrosHistorialRecordatoriosProps) => {
  const [filtros, setFiltros] = useState<RecordatorioHistorialFiltros>(filtrosVacios);

  const handleChange = (campo: keyof RecordatorioHistorialFiltros, valor: string) => {
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
            Fecha y hora del recordatorio
          </label>
          <input
            type="datetime-local"
            value={filtros.fecha_hora}
            onChange={(e) => handleChange('fecha_hora', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm text-[var(--color-text-secondary)] mb-1 min-h-[40px]">
            Período (desde)
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
            Período (hasta)
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
            Destinatario
          </label>
          <select
            value={filtros.destinatario}
            onChange={(e) => handleChange('destinatario', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="">Seleccione un destinatario...</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-[var(--color-text-secondary)] mb-1 min-h-[40px]">
            Vialidad
          </label>
          <select
            value={filtros.vialidad}
            onChange={(e) => handleChange('vialidad', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="">Seleccione una opción...</option>
            {VIALIDADES.map((v) => (
              <option key={v} value={v}>
                {v}
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

export default FiltrosHistorialRecordatorios;
