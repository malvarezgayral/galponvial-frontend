import { useMemo, useState } from "react";
import type { PersonalDocumentacionFormData } from "./PersonalDocumentacionForm";

const ESTUDIOS_OPTIONS = ["Primario", "Secundario", "Terciario", "Universitario"];

interface Filtros {
  nombre: string;
  apellido: string;
  numeroCuil: string;
  numeroDocumento: string;
  estudiosAlcanzados: string;
  titulo: string;
}

const filtrosVacios: Filtros = {
  nombre: "",
  apellido: "",
  numeroCuil: "",
  numeroDocumento: "",
  estudiosAlcanzados: "",
  titulo: "",
};

function normalizar(valor: string) {
  return valor.trim().toLowerCase();
}

interface HistorialDocumentacionPersonalProps {
  registros: PersonalDocumentacionFormData[];
}

export default function HistorialDocumentacionPersonal({
  registros,
}: HistorialDocumentacionPersonalProps) {
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
      if (filtros.numeroCuil && !normalizar(r.numeroCuil).includes(normalizar(filtros.numeroCuil))) {
        return false;
      }
      if (
        filtros.numeroDocumento &&
        !normalizar(r.numeroDocumento).includes(normalizar(filtros.numeroDocumento))
      ) {
        return false;
      }
      if (
        filtros.estudiosAlcanzados &&
        r.historialAcademico.estudiosAlcanzados !== filtros.estudiosAlcanzados
      ) {
        return false;
      }
      if (
        filtros.titulo &&
        !normalizar(r.historialAcademico.titulo).includes(normalizar(filtros.titulo))
      ) {
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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              value={filtros.nombre}
              onChange={(e) => updateFiltro("nombre", e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-base"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Apellido</label>
            <input
              type="text"
              value={filtros.apellido}
              onChange={(e) => updateFiltro("apellido", e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-base"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Número de CUIL</label>
            <input
              type="text"
              value={filtros.numeroCuil}
              onChange={(e) => updateFiltro("numeroCuil", e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-base"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Número de DNI</label>
            <input
              type="text"
              value={filtros.numeroDocumento}
              onChange={(e) => updateFiltro("numeroDocumento", e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-base"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Historial académico</label>
            <select
              value={filtros.estudiosAlcanzados}
              onChange={(e) => updateFiltro("estudiosAlcanzados", e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-base bg-white"
            >
              <option value="">Todos</option>
              {ESTUDIOS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Título</label>
            <input
              type="text"
              value={filtros.titulo}
              onChange={(e) => updateFiltro("titulo", e.target.value)}
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
                <th className="text-left px-4 py-3 font-medium">DNI</th>
                <th className="text-left px-4 py-3 font-medium">CUIL</th>
                <th className="text-left px-4 py-3 font-medium">Historial académico</th>
                <th className="text-left px-4 py-3 font-medium">Título</th>
              </tr>
            </thead>
            <tbody>
              {registrosFiltrados.map((r, index) => (
                <tr key={`${r.numeroDocumento}-${index}`} className="border-t border-gray-100">
                  <td className="px-4 py-3">{r.nombre}</td>
                  <td className="px-4 py-3">{r.apellido}</td>
                  <td className="px-4 py-3">{r.numeroDocumento}</td>
                  <td className="px-4 py-3">{r.numeroCuil}</td>
                  <td className="px-4 py-3">{r.historialAcademico.estudiosAlcanzados || "-"}</td>
                  <td className="px-4 py-3">{r.historialAcademico.titulo || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
