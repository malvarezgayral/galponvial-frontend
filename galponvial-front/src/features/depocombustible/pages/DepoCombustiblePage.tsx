import { useState } from "react";

interface FilaCombustible {
  id: number;
  fecha: string;
  vehiculo: string;
  agente: string;
  comprobante: string;
  ingreso: number;
  egreso: number;
  stock: number;
  direccion: string;
  observaciones: string;
}

const filaVacia = (): Omit<FilaCombustible, "id" | "stock"> => ({
  fecha: "",
  vehiculo: "",
  agente: "",
  comprobante: "",
  ingreso: 0,
  egreso: 0,
  direccion: "",
  observaciones: "",
});

// Opciones placeholder — reemplazar con datos reales cuando estén disponibles
const AGENTES: string[] = [];
const DIRECCIONES: string[] = [];

export default function DepoCombustiblePage() {
  const [filas, setFilas] = useState<FilaCombustible[]>([
    { id: 1, ...filaVacia(), stock: 0 },
  ]);

  const actualizarFila = (
    id: number,
    campo: keyof Omit<FilaCombustible, "id" | "stock">,
    valor: string | number,
  ) => {
    setFilas((prev) =>
      prev.map((fila) => {
        if (fila.id !== id) return fila;
        const actualizada = { ...fila, [campo]: valor };
        actualizada.stock = actualizada.ingreso - actualizada.egreso;
        return actualizada;
      }),
    );
  };

  const incrementar = (id: number, campo: "ingreso" | "egreso") => {
    setFilas((prev) =>
      prev.map((fila) => {
        if (fila.id !== id) return fila;
        const actualizada = { ...fila, [campo]: fila[campo] + 1 };
        actualizada.stock = actualizada.ingreso - actualizada.egreso;
        return actualizada;
      }),
    );
  };

  const decrementar = (id: number, campo: "ingreso" | "egreso") => {
    setFilas((prev) =>
      prev.map((fila) => {
        if (fila.id !== id) return fila;
        const nuevoValor = Math.max(0, fila[campo] - 1);
        const actualizada = { ...fila, [campo]: nuevoValor };
        actualizada.stock = actualizada.ingreso - actualizada.egreso;
        return actualizada;
      }),
    );
  };

  const agregarFila = () => {
    const nuevoId = filas.length > 0 ? Math.max(...filas.map((f) => f.id)) + 1 : 1;
    setFilas((prev) => [...prev, { id: nuevoId, ...filaVacia(), stock: 0 }]);
  };

  const eliminarFila = (id: number) => {
    if (filas.length === 1) return;
    setFilas((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Depósito de Combustible y Lubricantes
        </h1>
        <p className="text-gray-500 mt-1">
          Registro de movimientos de combustible y lubricantes
        </p>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl shadow border border-gray-200 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">
                Fecha
              </th>
              <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">
                Vehículo
              </th>
              <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">
                Agente
              </th>
              <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">
                Comprobante
              </th>
              <th className="px-3 py-3 text-center font-semibold text-gray-600 whitespace-nowrap">
                Ingreso Cant.
              </th>
              <th className="px-3 py-3 text-center font-semibold text-gray-600 whitespace-nowrap">
                Egreso Cant.
              </th>
              <th className="px-3 py-3 text-center font-semibold text-gray-600 whitespace-nowrap">
                Stock
              </th>
              <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">
                Dirección
              </th>
              <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">
                Observaciones
              </th>
              <th className="px-3 py-3 text-center font-semibold text-gray-600 whitespace-nowrap">
                Acción
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filas.map((fila) => (
              <tr key={fila.id} className="hover:bg-gray-50 transition-colors">
                {/* Fecha */}
                <td className="px-3 py-2">
                  <input
                    type="date"
                    value={fila.fecha}
                    onChange={(e) => actualizarFila(fila.id, "fecha", e.target.value)}
                    className="border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-36"
                  />
                </td>

                {/* Vehículo */}
                <td className="px-3 py-2">
                  <input
                    type="text"
                    placeholder="Patente / N°"
                    value={fila.vehiculo}
                    onChange={(e) => actualizarFila(fila.id, "vehiculo", e.target.value)}
                    className="border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-32"
                  />
                </td>

                {/* Agente */}
                <td className="px-3 py-2">
                  <select
                    value={fila.agente}
                    onChange={(e) => actualizarFila(fila.id, "agente", e.target.value)}
                    className="border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-40 text-gray-500"
                  >
                    <option value="">— Seleccionar —</option>
                    {AGENTES.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </td>

                {/* Comprobante */}
                <td className="px-3 py-2">
                  <input
                    type="text"
                    placeholder="Nro. comprobante"
                    value={fila.comprobante}
                    onChange={(e) =>
                      actualizarFila(fila.id, "comprobante", e.target.value)
                    }
                    className="border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-36"
                  />
                </td>

                {/* Ingreso cantidad */}
                <td className="px-3 py-2">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => decrementar(fila.id, "ingreso")}
                      className="w-7 h-7 rounded-md bg-gray-200 hover:bg-gray-300 font-bold text-gray-700 flex items-center justify-center transition-colors"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min={0}
                      value={fila.ingreso}
                      onChange={(e) =>
                        actualizarFila(fila.id, "ingreso", Math.max(0, Number(e.target.value)))
                      }
                      className="border border-gray-300 rounded-md px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500 w-16"
                    />
                    <button
                      onClick={() => incrementar(fila.id, "ingreso")}
                      className="w-7 h-7 rounded-md bg-blue-100 hover:bg-blue-200 font-bold text-blue-700 flex items-center justify-center transition-colors"
                    >
                      +
                    </button>
                  </div>
                </td>

                {/* Egreso cantidad */}
                <td className="px-3 py-2">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => decrementar(fila.id, "egreso")}
                      className="w-7 h-7 rounded-md bg-gray-200 hover:bg-gray-300 font-bold text-gray-700 flex items-center justify-center transition-colors"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min={0}
                      value={fila.egreso}
                      onChange={(e) =>
                        actualizarFila(fila.id, "egreso", Math.max(0, Number(e.target.value)))
                      }
                      className="border border-gray-300 rounded-md px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500 w-16"
                    />
                    <button
                      onClick={() => incrementar(fila.id, "egreso")}
                      className="w-7 h-7 rounded-md bg-red-100 hover:bg-red-200 font-bold text-red-700 flex items-center justify-center transition-colors"
                    >
                      +
                    </button>
                  </div>
                </td>

                {/* Stock (calculado) */}
                <td className="px-3 py-2 text-center">
                  <span
                    className={`inline-block px-3 py-1.5 rounded-md font-semibold text-sm min-w-[3rem] ${
                      fila.stock > 0
                        ? "bg-green-100 text-green-700"
                        : fila.stock < 0
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {fila.stock}
                  </span>
                </td>

                {/* Dirección */}
                <td className="px-3 py-2">
                  <select
                    value={fila.direccion}
                    onChange={(e) => actualizarFila(fila.id, "direccion", e.target.value)}
                    className="border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-40 text-gray-500"
                  >
                    <option value="">— Seleccionar —</option>
                    {DIRECCIONES.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </td>

                {/* Observaciones */}
                <td className="px-3 py-2">
                  <textarea
                    placeholder="Observaciones..."
                    value={fila.observaciones}
                    onChange={(e) =>
                      actualizarFila(fila.id, "observaciones", e.target.value)
                    }
                    rows={1}
                    className="border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 resize-y min-h-[36px]"
                  />
                </td>

                {/* Eliminar fila */}
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

      {/* Botón agregar fila */}
      <button
        onClick={agregarFila}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow transition-colors"
      >
        <span className="text-lg leading-none">+</span> Agregar fila
      </button>
    </div>
  );
}