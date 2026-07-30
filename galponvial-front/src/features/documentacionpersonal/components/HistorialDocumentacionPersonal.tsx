import { useMemo, useState } from "react";
import type { PersonalDocumentacionFormData } from "./PersonalDocumentacionForm";

interface Filtros {
  nombre: string;
  apellido: string;
  numeroCuil: string;
  numeroDocumento: string;
}

const filtrosVacios: Filtros = {
  nombre: "",
  apellido: "",
  numeroCuil: "",
  numeroDocumento: "",
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
  const [filtrosDraft, setFiltrosDraft] = useState<Filtros>(filtrosVacios);
  const [filtrosAplicados, setFiltrosAplicados] = useState<Filtros>(filtrosVacios);

  const updateFiltro = <K extends keyof Filtros>(campo: K, valor: Filtros[K]) => {
    setFiltrosDraft((prev) => ({ ...prev, [campo]: valor }));
  };

  const buscar = () => setFiltrosAplicados(filtrosDraft);

  const limpiarFiltros = () => {
    setFiltrosDraft(filtrosVacios);
    setFiltrosAplicados(filtrosVacios);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      buscar();
    }
  };

  const registrosFiltrados = useMemo(() => {
    return registros.filter((r) => {
      if (
        filtrosAplicados.nombre &&
        !normalizar(r.nombre).includes(normalizar(filtrosAplicados.nombre))
      ) {
        return false;
      }
      if (
        filtrosAplicados.apellido &&
        !normalizar(r.apellido).includes(normalizar(filtrosAplicados.apellido))
      ) {
        return false;
      }
      if (
        filtrosAplicados.numeroCuil &&
        !normalizar(r.numeroCuil).includes(normalizar(filtrosAplicados.numeroCuil))
      ) {
        return false;
      }
      if (
        filtrosAplicados.numeroDocumento &&
        !normalizar(r.numeroDocumento).includes(normalizar(filtrosAplicados.numeroDocumento))
      ) {
        return false;
      }
      return true;
    });
  }, [registros, filtrosAplicados]);

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
              value={filtrosDraft.nombre}
              onChange={(e) => updateFiltro("nombre", e.target.value)}
              onKeyDown={handleKeyDown}
              className="border border-gray-300 rounded px-3 py-2 text-base"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Apellido</label>
            <input
              type="text"
              value={filtrosDraft.apellido}
              onChange={(e) => updateFiltro("apellido", e.target.value)}
              onKeyDown={handleKeyDown}
              className="border border-gray-300 rounded px-3 py-2 text-base"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Número de CUIL</label>
            <input
              type="text"
              value={filtrosDraft.numeroCuil}
              onChange={(e) => updateFiltro("numeroCuil", e.target.value)}
              onKeyDown={handleKeyDown}
              className="border border-gray-300 rounded px-3 py-2 text-base"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Número de DNI</label>
            <input
              type="text"
              value={filtrosDraft.numeroDocumento}
              onChange={(e) => updateFiltro("numeroDocumento", e.target.value)}
              onKeyDown={handleKeyDown}
              className="border border-gray-300 rounded px-3 py-2 text-base"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={buscar}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2 rounded"
          >
            Buscar
          </button>
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
