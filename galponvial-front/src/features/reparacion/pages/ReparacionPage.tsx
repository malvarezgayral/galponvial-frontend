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

const MARCAS: string[] = [
  // Completar con las marcas disponibles, ej: "Ford", "Chevrolet", "Iveco"
];

const MODELOS: string[] = [
  // Completar con los modelos disponibles
];

const TALLERES = [
  "Taller 1 (General)",
  "Taller 2 (Vial)",
  "Taller 3 (Pintura)",
];

type Vista = "registro" | "historial";

export default function ReparacionPage() {
  const [filas, setFilas] = useState<FilaReparacion[]>([
    { id: 1, ...filaVacia() },
  ]);
  const [vista, setVista] = useState<Vista>("registro");
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

  const limpiarFiltros = () => {
    setFiltroUnidad("");
    setFiltroModelo("");
    setFiltroMarca("");
    setFiltroFechaDesde("");
    setFiltroFechaHasta("");
  };

  const buscarHistorial = () => {
    // TODO: conectar con el backend cuando esté disponible el endpoint de historial
    console.log("Buscando con filtros:", {
      filtroUnidad,
      filtroModelo,
      filtroMarca,
      filtroFechaDesde,
      filtroFechaHasta,
    });
  };

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
            onClick={() => setVista("historial")}
            className={`px-5 py-2 rounded-lg text-white font-medium transition-colors ${
              vista === "historial" ? "bg-[#0062e3]" : "bg-gray-400 hover:bg-gray-500"
            }`}
          >
            Historial de Reparación
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
                  <th className="px-3 py-3 text-center font-semibold text-gray-600 whitespace-nowrap">
                    Eliminar
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
                    <td className="px-3 py-2 text-center">
                      <button
                        onClick={() => eliminarFila(fila.id)}
                        disabled={filas.length === 1}
                        title="Eliminar fila"
                        className="w-7 h-7 rounded-md bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center mx-auto transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        ✕
                      </button>
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
        </div>
      )}
    </div>
  );
}
