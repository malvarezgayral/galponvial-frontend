import { useMemo, useState } from 'react';
import type { RegistroAdministrativoFormData } from './RegistroAdministrativoForm';

interface HistorialRegistroAdministrativoProps {
  registros: RegistroAdministrativoFormData[];
}

interface Filtros {
  nombre: string;
  apellido: string;
  legajo: string;
  dni: string;
}

const filtrosVacios: Filtros = { nombre: '', apellido: '', legajo: '', dni: '' };

function normalizar(valor: string) {
  return valor.trim().toLowerCase();
}

function situacionRevistaLabel(r: RegistroAdministrativoFormData): string {
  const s = r.situacionRevista;
  if (s.plantaPermanenteDesde) return 'Planta permanente';
  if (s.temporarioMensualizadoDesde) return 'Temporario (mensualizado)';
  if (s.destajistaDesde) return 'Destajista';
  if (s.planesEmpleoDesde) return 'Planes de empleo';
  if (s.cooperativaDesde) return 'Cooperativa';
  if (s.cargoTemporarioDesde) return 'Cargo temporario';
  return '—';
}

export default function HistorialRegistroAdministrativo({
  registros,
}: HistorialRegistroAdministrativoProps) {
  const [filtros, setFiltros] = useState<Filtros>(filtrosVacios);

  const updateFiltro = <K extends keyof Filtros>(campo: K, valor: Filtros[K]) => {
    setFiltros((prev) => ({ ...prev, [campo]: valor }));
  };

  const limpiarFiltros = () => setFiltros(filtrosVacios);

  const registrosFiltrados = useMemo(() => {
    return registros.filter((r) => {
      if (filtros.nombre && !normalizar(r.nombre).includes(normalizar(filtros.nombre))) {
        return false;
      }
      if (filtros.apellido && !normalizar(r.apellido).includes(normalizar(filtros.apellido))) {
        return false;
      }
      if (filtros.legajo && !normalizar(r.legajo || '').includes(normalizar(filtros.legajo))) {
        return false;
      }
      if (filtros.dni && !normalizar(r.numeroDni || '').includes(normalizar(filtros.dni))) {
        return false;
      }
      return true;
    });
  }, [registros, filtros]);

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-900">Filtros de búsqueda</h2>
          <button
            type="button"
            onClick={limpiarFiltros}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Limpiar filtros
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              value={filtros.nombre}
              onChange={(e) => updateFiltro('nombre', e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-base"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Apellido</label>
            <input
              type="text"
              value={filtros.apellido}
              onChange={(e) => updateFiltro('apellido', e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-base"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Legajo</label>
            <input
              type="text"
              value={filtros.legajo}
              onChange={(e) => updateFiltro('legajo', e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-base"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Número de DNI</label>
            <input
              type="text"
              value={filtros.dni}
              onChange={(e) => updateFiltro('dni', e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-base"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow border border-gray-200 overflow-x-auto">
        {registrosFiltrados.length === 0 ? (
          <p className="p-6 text-sm text-gray-400">
            No se encontraron registros con los filtros aplicados.
          </p>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Nombre</th>
                <th className="text-left px-4 py-3 font-medium">Apellido</th>
                <th className="text-left px-4 py-3 font-medium">Legajo</th>
                <th className="text-left px-4 py-3 font-medium">Tipo DNI</th>
                <th className="text-left px-4 py-3 font-medium">Número DNI</th>
                <th className="text-left px-4 py-3 font-medium">Categoría actual</th>
                <th className="text-left px-4 py-3 font-medium">Secretaría a cargo</th>
                <th className="text-left px-4 py-3 font-medium">Dirección a cargo</th>
                <th className="text-left px-4 py-3 font-medium">Fecha de ingreso</th>
                <th className="text-left px-4 py-3 font-medium">Situación de revista</th>
              </tr>
            </thead>
            <tbody>
              {registrosFiltrados.map((r, index) => (
                <tr key={index} className="border-t border-gray-100">
                  <td className="px-4 py-3">{r.nombre}</td>
                  <td className="px-4 py-3">{r.apellido}</td>
                  <td className="px-4 py-3">{r.legajo || '—'}</td>
                  <td className="px-4 py-3">{r.tipoDni || '—'}</td>
                  <td className="px-4 py-3">{r.numeroDni || '—'}</td>
                  <td className="px-4 py-3">{r.categoriaActual || '—'}</td>
                  <td className="px-4 py-3">{r.secretariaACargo || '—'}</td>
                  <td className="px-4 py-3">{r.direccionACargo || '—'}</td>
                  <td className="px-4 py-3">{r.fechaIngreso || '—'}</td>
                  <td className="px-4 py-3">{situacionRevistaLabel(r)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
