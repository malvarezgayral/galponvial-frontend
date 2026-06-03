import { useState } from "react";

interface FilaReparacion {
  id: number;
  unidad: string;
  descripcion: string;
  taller: string;
  fechaSalida: string;
}

const filaVacia = (): Omit<FilaReparacion, "id"> => ({
  unidad: "",
  descripcion: "",
  taller: "",
  fechaSalida: "",
});

const TALLERES = ["Taller 1", "Taller 2"];

export default function ReparacionPage() {
  const [filas, setFilas] = useState<FilaReparacion[]>([
    { id: 1, ...filaVacia() },
  ]);

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow transition-colors">
          Registro de Reparaciones
        </button>
      </div>

      {/* Tabla */}
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
                Fecha de salida
              </th>
              <th className="px-3 py-3 text-center font-semibold text-gray-600 whitespace-nowrap">
                Eliminar
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filas.map((fila) => (
              <tr key={fila.id} className="hover:bg-gray-50 transition-colors">
                {/* Unidad */}
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

                {/* Descripción del trabajo */}
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

                {/* Taller */}
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

                {/* Fecha de salida */}
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

                {/* Eliminar */}
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
        <span className="text-lg leading-none">+</span> Agregar Registro
      </button>
    </div>
  );
}
