import { useEffect, useState } from "react";
import { filtroServiceService } from "../services/filtroServiceService";
import type { FiltroServiceRegistro } from "../services/filtroServiceService";
import type { Vehiculo } from "../../vehiculos/types";

const selectCls =
  "border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48";
const thCls = "px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap";

export default function FiltrosPanel({ vehiculos }: { vehiculos: Vehiculo[] }) {
  const [registros, setRegistros] = useState<FiltroServiceRegistro[]>([]);
  const [unidad, setUnidad] = useState("");
  const [lista, setLista] = useState("");
  const [aplicados, setAplicados] = useState({ unidad: "", lista: "" });

  useEffect(() => {
    filtroServiceService
      .obtenerTodos()
      .then(setRegistros)
      .catch((err) => console.error("Error al cargar los filtros:", err));
  }, []);

  const tiposDistintos = Array.from(
    new Set(registros.map((r) => r.tipoFiltro.trim()).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b));

  const buscar = () => {
    setAplicados({ unidad, lista });
  };

  const limpiar = () => {
    setUnidad("");
    setLista("");
    setAplicados({ unidad: "", lista: "" });
  };

  const resultados = registros.filter(
    (r) =>
      (!aplicados.unidad || String(r.idVehiculo ?? "") === aplicados.unidad) &&
      (!aplicados.lista || r.tipoFiltro.trim() === aplicados.lista)
  );

  const nombreVehiculo = (r: FiltroServiceRegistro): string => {
    const v = r.vehiculoRef;
    if (!v) return "—";
    return `${v.nombre ?? ""} ${v.codigo ? `(${v.codigo})` : ""}`.trim() || "—";
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500">Unidad</label>
            <select value={unidad} onChange={(e) => setUnidad(e.target.value)} className={selectCls}>
              <option value="">— Seleccionar unidad —</option>
              {vehiculos.map((v) => (
                <option key={v.id_vehiculo} value={String(v.id_vehiculo)}>
                  {v.nombre} {v.codigo ? `(${v.codigo})` : ""}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500">Lista de filtros</label>
            <select
              value={lista}
              onChange={(e) => setLista(e.target.value)}
              className={`${selectCls} text-gray-500`}
            >
              <option value="">— Seleccionar —</option>
              {tiposDistintos.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={buscar}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow transition-colors"
          >
            Buscar
          </button>
          <button
            onClick={limpiar}
            className="px-4 py-1.5 bg-gray-400 hover:bg-gray-500 text-white text-sm font-medium rounded-lg shadow transition-colors"
          >
            Limpiar
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow border border-gray-200 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className={thCls}>Vehículo</th>
              <th className={thCls}>Fecha</th>
              <th className={thCls}>Tipo de filtro</th>
              <th className={thCls}>Código</th>
              <th className={thCls}>Cantidad</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {resultados.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-3 py-2">{nombreVehiculo(r)}</td>
                <td className="px-3 py-2">{r.fecha ?? "—"}</td>
                <td className="px-3 py-2">{r.tipoFiltro}</td>
                <td className="px-3 py-2">{r.codigo ?? "—"}</td>
                <td className="px-3 py-2">{r.cantidad}</td>
              </tr>
            ))}
            {resultados.length === 0 && (
              <tr>
                <td colSpan={5} className="px-3 py-6 text-center text-gray-500">
                  No se encontraron filtros con los criterios elegidos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
