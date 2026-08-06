import { useState } from "react";

interface FilaReparacion {
  id: number;
  unidad: string;
  descripcion: string;
  taller: string;
  fechaEntrada: string;
  fechaSalida: string;
  observaciones: string;
}

const filaVacia = (): Omit<FilaReparacion, "id"> => ({
  unidad: "",
  descripcion: "",
  taller: "",
  fechaEntrada: "",
  fechaSalida: "",
  observaciones: "",
});

const MARCAS: string[] = [];
const MODELOS: string[] = [];

const TALLERES = [
  "Taller 1 (General)",
  "Taller 2 (Vial)",
  "Taller 3 (Pintura)",
];

type Vista = "registro" | "listado" | "historial";

export default function ReparacionPage() {
  const [filas, setFilas] = useState<FilaReparacion[]>([
    { id: 1, ...filaVacia() },
  ]);
  const [vista, setVista] = useState<Vista>("registro");
  const [filaEditando, setFilaEditando] = useState<number | null>(null);
  const [borrador, setBorrador] = useState<FilaReparacion | null>(null);
  const [filtroUnidad, setFiltroUnidad] = useState("");
  const [filtroModelo, setFiltroModelo] = useState("");
  const [filtroMarca, setFiltroMarca] = useState("");
  const [filtroFechaDesde, setFiltroFechaDesde] = useState("");
  const [filtroFechaHasta, setFiltroFechaHasta] = useState("");

  const agregarFila = () => {
    const nuevoId =
      filas.length > 0 ? Math.max(...filas.map((f) => f.id)) + 1 : 1;
    setFilas((prev) => [...prev, { id: nuevoId, ...filaVacia() }]);
  };

  const actualizarFila = (
    id: number,
    campo: keyof Omit<FilaReparacion, "id">,
    valor: string
  ) => {
    setFilas((prev) =>
      prev.map((fila) => (fila.id === id ? { ...fila, [campo]: valor } : fila))
    );
  };

  const eliminarFila = (id: number) => {
    if (filas.length === 1) return;
    setFilas((prev) => prev.filter((fila) => fila.id !== id));
  };

  const iniciarEdicion = (id: number) => {
    setFilaEditando(id);
    const fila = filas.find((f) => f.id === id);
    if (fila) {
      setBorrador({ ...fila });
    }
  };

  const cancelarEdicion = () => {
    setFilaEditando(null);
    setBorrador(null);
  };

  const guardarEdicion = () => {
    if (filaEditando !== null && borrador) {
      setFilas((prev) =>
        prev.map((f) => (f.id === filaEditando ? borrador : f))
      );
      setFilaEditando(null);
      setBorrador(null);
    }
  };

  const updateBorrador = <K extends keyof FilaReparacion>(
    campo: K,
    valor: FilaReparacion[K]
  ) => {
    setBorrador((prev) => (prev ? { ...prev, [campo]: valor } : prev));
  };

  const limpiarFiltros = () => {
    setFiltroUnidad("");
    setFiltroModelo("");
    setFiltroMarca("");
    setFiltroFechaDesde("");
    setFiltroFechaHasta("");
  };

  const buscarHistorial = () => {
    console.log("Buscando con filtros:", {
      filtroUnidad,
      filtroModelo,
      filtroMarca,
      filtroFechaDesde,
      filtroFechaHasta,
    });
  };

  const inputClass = "border border-blue-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-36";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Reparación</h1>

        <div className="flex flex-wrap gap-3 mt-4">
          <button
            onClick={() => setVista("registro")}
            className={`px-5 py-2 rounded-lg text-white font-medium transition-colors ${
              vista === "registro" ? "bg-[#0062e3]" : "bg-gray-400 hover:bg-gray-500"
            }`}
          >
            Registro de Reparaciones
          </button>

          <button
            onClick={() => setVista("listado")}
            className={`px-5 py-2 rounded-lg text-white font-medium transition-colors ${
              vista === "listado" ? "bg-[#0062e3]" : "bg-gray-400 hover:bg-gray-500"
            }`}
          >
            Listado de Reparaciones
          </button>

          <button
            onClick={() => setVista("historial")}
            className={`px-5 py-2 rounded-lg text-white font-medium transition-colors ${
              vista === "historial" ? "bg-[#0062e3]" : "bg-gray-400 hover:bg-gray-500"
            }`}
          >
            Historial de Reparaciones
          </button>
        </div>
      </div>

      {/* Vista: Registro */}
      {vista === "registro" && (
        <>
          <div className="bg-white rounded-xl shadow border border-gray-200 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">
                    Unidad
                  </th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">
                    Descripción del trabajo
                  </th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">
                    Taller
                  </th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">
                    Fecha de entrada
                  </th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">
                    Fecha de salida
                  </th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">
                    Observaciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filas.map((fila) => (
                  <tr key={fila.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        placeholder="Ingrese unidad"
                        value={fila.unidad}
                        onChange={(e) =>
                          actualizarFila(fila.id, "unidad", e.target.value)
                        }
                        className="border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-36"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <textarea
                        placeholder="Describa el trabajo..."
                        value={fila.descripcion}
                        onChange={(e) =>
                          actualizarFila(fila.id, "descripcion", e.target.value)
                        }
                        rows={2}
                        className="border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 resize-none"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <select
                        value={fila.taller}
                        onChange={(e) =>
                          actualizarFila(fila.id, "taller", e.target.value)
                        }
                        className="border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-36 text-gray-500"
                      >
                        <option value="">— Seleccionar —</option>
                        {TALLERES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="date"
                        value={fila.fechaEntrada}
                        onChange={(e) =>
                          actualizarFila(fila.id, "fechaEntrada", e.target.value)
                        }
                        className="border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-36"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="date"
                        value={fila.fechaSalida}
                        onChange={(e) =>
                          actualizarFila(fila.id, "fechaSalida", e.target.value)
                        }
                        className="border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-36"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        placeholder="Observaciones..."
                        value={fila.observaciones}
                        onChange={(e) =>
                          actualizarFila(fila.id, "observaciones", e.target.value)
                        }
                        className="border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-44"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={agregarFila}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow transition-colors"
          >
            <span className="text-lg leading-none">+</span> Agregar Registro
          </button>
        </>
      )}

      {/* Vista: Listado */}
      {vista === "listado" && (
        <div className="bg-white rounded-xl shadow border border-gray-200 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Unidad</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Descripción del trabajo</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Taller</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Fecha de entrada</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Fecha de salida</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Observaciones</th>
                <th className="px-3 py-3 text-right font-semibold text-gray-600 whitespace-nowrap">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filas.map((fila) => {
                const editando = filaEditando === fila.id && borrador !== null;
                const mostrado = editando ? borrador : fila;

                return (
                  <tr
                    key={fila.id}
                    className={`border-b border-gray-100 last:border-0 ${editando ? "bg-blue-50" : ""}`}
                  >
                    <td className="px-3 py-2">
                      {editando ? (
                        <input
                          type="text"
                          value={mostrado.unidad}
                          onChange={(e) => updateBorrador("unidad", e.target.value)}
                          className={inputClass}
                        />
                      ) : (
                        mostrado.unidad
                      )}
                    </td>
                    <td className="px-3 py-2">
                      {editando ? (
                        <textarea
                          value={mostrado.descripcion}
                          onChange={(e) => updateBorrador("descripcion", e.target.value)}
                          rows={2}
                          className={`${inputClass} w-64 resize-none`}
                        />
                      ) : (
                        mostrado.descripcion
                      )}
                    </td>
                    <td className="px-3 py-2">
                      {editando ? (
                        <select
                          value={mostrado.taller}
                          onChange={(e) => updateBorrador("taller", e.target.value)}
                          className={inputClass}
                        >
                          <option value="">— Seleccionar —</option>
                          {TALLERES.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      ) : (
                        mostrado.taller
                      )}
                    </td>
                    <td className="px-3 py-2">
                      {editando ? (
                        <input
                          type="date"
                          value={mostrado.fechaEntrada}
                          onChange={(e) => updateBorrador("fechaEntrada", e.target.value)}
                          className={inputClass}
                        />
                      ) : (
                        mostrado.fechaEntrada
                      )}
                    </td>
                    <td className="px-3 py-2">
                      {editando ? (
                        <input
                          type="date"
                          value={mostrado.fechaSalida}
                          onChange={(e) => updateBorrador("fechaSalida", e.target.value)}
                          className={inputClass}
                        />
                      ) : (
                        mostrado.fechaSalida
                      )}
                    </td>
                    <td className="px-3 py-2">
                      {editando ? (
                        <input
                          type="text"
                          value={mostrado.observaciones}
                          onChange={(e) => updateBorrador("observaciones", e.target.value)}
                          className={`${inputClass} w-44`}
                        />
                      ) : (
                        mostrado.observaciones
                      )}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <div className="flex justify-end gap-2">
                        {editando ? (
                          <>
                            <button
                              onClick={guardarEdicion}
                              className="text-white bg-blue-600 hover:bg-blue-700 text-sm font-medium rounded px-3 py-1 transition-colors"
                            >
                              Guardar
                            </button>
                            <button
                              onClick={cancelarEdicion}
                              className="text-gray-600 hover:text-gray-800 text-sm font-medium border border-gray-300 rounded px-3 py-1 hover:bg-gray-50 transition-colors"
                            >
                              Cancelar
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => iniciarEdicion(fila.id)}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium border border-blue-200 rounded px-3 py-1 hover:bg-blue-50 transition-colors"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => eliminarFila(fila.id)}
                              className="text-red-600 hover:text-red-800 text-sm font-medium border border-red-200 rounded px-3 py-1 hover:bg-red-50 transition-colors"
                            >
                              Eliminar
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Vista: Historial */}
      {vista === "historial" && (
        <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600">Unidad</label>
              <input
                type="text"
                placeholder="Buscar por unidad"
                value={filtroUnidad}
                onChange={(e) => setFiltroUnidad(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600">Modelo</label>
              <select
                value={filtroModelo}
                onChange={(e) => setFiltroModelo(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 text-gray-500"
              >
                <option value="">— Seleccionar —</option>
                {MODELOS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600">Marca</label>
              <select
                value={filtroMarca}
                onChange={(e) => setFiltroMarca(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 text-gray-500"
              >
                <option value="">— Seleccionar —</option>
                {MARCAS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600">Desde</label>
              <input
                type="date"
                value={filtroFechaDesde}
                onChange={(e) => setFiltroFechaDesde(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-40"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600">Hasta</label>
              <input
                type="date"
                value={filtroFechaHasta}
                onChange={(e) => setFiltroFechaHasta(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-40"
              />
            </div>
            <button
              onClick={buscarHistorial}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow transition-colors"
            >
              Buscar
            </button>
            <button
              onClick={limpiarFiltros}
              className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium rounded-lg shadow transition-colors"
            >
              Limpiar filtros
            </button>
          </div>

          <div className="bg-white rounded-xl shadow border border-gray-200 overflow-x-auto mt-4">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Unidad</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Descripción del trabajo</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Taller</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Fecha de entrada</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Fecha de salida</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Observaciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filas
                  .filter((f) => {
                    if (filtroUnidad && !f.unidad.toLowerCase().includes(filtroUnidad.toLowerCase())) {
                      return false;
                    }
                    if (filtroFechaDesde && f.fechaEntrada && f.fechaEntrada < filtroFechaDesde) {
                      return false;
                    }
                    if (filtroFechaHasta && f.fechaEntrada && f.fechaEntrada > filtroFechaHasta) {
                      return false;
                    }
                    return true;
                  })
                  .map((fila) => (
                    <tr key={fila.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-3 py-2">{fila.unidad || "—"}</td>
                      <td className="px-3 py-2">{fila.descripcion || "—"}</td>
                      <td className="px-3 py-2">{fila.taller || "—"}</td>
                      <td className="px-3 py-2">{fila.fechaEntrada || "—"}</td>
                      <td className="px-3 py-2">{fila.fechaSalida || "—"}</td>
                      <td className="px-3 py-2">{fila.observaciones || "—"}</td>
                    </tr>
                  ))}
                {filas.filter((f) => {
                  if (filtroUnidad && !f.unidad.toLowerCase().includes(filtroUnidad.toLowerCase())) return false;
                  if (filtroFechaDesde && f.fechaEntrada && f.fechaEntrada < filtroFechaDesde) return false;
                  if (filtroFechaHasta && f.fechaEntrada && f.fechaEntrada > filtroFechaHasta) return false;
                  return true;
                }).length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-3 py-6 text-center text-gray-400">
                      No se encontraron reparaciones con los filtros aplicados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}