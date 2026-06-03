import { useState } from "react";

interface FilaCombustible {
  id: number;
  fecha: string;
  maquina: string;
  chofer: string;
despachante: string;
  estacionServicio: string;
  litrosEntrada: string;
  litrosSalida: string;
  totalCombustible: string;
  estadoParcial: string;
}

const filaVacia = (): Omit<FilaCombustible, "id"> => ({
  fecha: "",
  maquina: "",
  chofer: "",
  despachante: "",
  estacionServicio: "",
  litrosEntrada: "",
  litrosSalida: "",
  totalCombustible: "",
  estadoParcial: "",
});

const CHOFERES: string[] = [];
const ESTACIONES: string[] = [];

const TanqueCombustiblePage = () => {
  const [filas, setFilas] = useState<FilaCombustible[]>([
    { id: 1, ...filaVacia() },
  ]);

  const agregarFila = () => {
    const nuevoId =
      filas.length > 0 ? Math.max(...filas.map((f) => f.id)) + 1 : 1;
    setFilas((prev) => [...prev, { id: nuevoId, ...filaVacia() }]);
  };

  const actualizarFila = (
    id: number,
    campo: keyof Omit<FilaCombustible, "id">,
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
      {/* Header */}
<div className="mb-6 flex items-center gap-4">
  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow transition-colors">
    Registro de movimientos del tanque
  </button>
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
                Máquina
              </th>
              <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">
                Chofer
              </th>
              <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">
  Despachante
</th> 
              <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">
                Estación de Servicio
              </th>
              <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">
                Litros Entrada
              </th>
              <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">
                Litros Salida
              </th>
              <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">
                Total Combustible
              </th>
              <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">
                Estado Parcial
              </th>
              <th className="px-3 py-3 text-center font-semibold text-gray-600 whitespace-nowrap">
                Eliminar Registro
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
                    onChange={(e) =>
                      actualizarFila(fila.id, "fecha", e.target.value)
                    }
                    className="border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-36"
                  />
                </td>

                {/* Máquina */}
                <td className="px-3 py-2">
                  <input
                    type="text"
                    placeholder="Ingrese máquina"
                    value={fila.maquina}
                    onChange={(e) =>
                      actualizarFila(fila.id, "maquina", e.target.value)
                    }
                    className="border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-36"
                  />
                </td>

                {/* Chofer */}
                <td className="px-3 py-2">
                  <select
                    value={fila.chofer}
                    onChange={(e) =>
                      actualizarFila(fila.id, "chofer", e.target.value)
                    }
                    className="border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-40 text-gray-500"
                  >
                    <option value="">— Seleccionar —</option>
                    {CHOFERES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </td>

                {/* Despachante */}
<td className="px-3 py-2">
  <select
    value={fila.despachante}
    onChange={(e) =>
      actualizarFila(fila.id, "despachante", e.target.value)
    }
    className="border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-40 text-gray-500"
  >
    <option value="">— Seleccionar —</option>
    <option value="Pablo Altuna">Pablo Altuna</option>
    <option value="Juan Torres">Juan Torres</option>
  </select>
</td>

                {/* Estación de Servicio */}
                <td className="px-3 py-2">
                  <select
                    value={fila.estacionServicio}
                    onChange={(e) =>
                      actualizarFila(fila.id, "estacionServicio", e.target.value)
                    }
                    className="border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-40 text-gray-500"
                  >
                    <option value="">— Seleccionar —</option>
                    {ESTACIONES.map((e) => (
                      <option key={e} value={e}>
                        {e}
                      </option>
                    ))}
                  </select>
                </td>

                {/* Litros Entrada */}
                <td className="px-3 py-2">
                  <input
                    type="number"
                    placeholder="0"
                    min="0"
                    value={fila.litrosEntrada}
                    onChange={(e) =>
                      actualizarFila(fila.id, "litrosEntrada", e.target.value)
                    }
                    className="border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-28"
                  />
                </td>

                {/* Litros Salida */}
                <td className="px-3 py-2">
                  <input
                    type="number"
                    placeholder="0"
                    min="0"
                    value={fila.litrosSalida}
                    onChange={(e) =>
                      actualizarFila(fila.id, "litrosSalida", e.target.value)
                    }
                    className="border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-28"
                  />
                </td>

                {/* Total Combustible */}
                <td className="px-3 py-2">
                  <input
                    type="number"
                    placeholder="0"
                    min="0"
                    value={fila.totalCombustible}
                    onChange={(e) =>
                      actualizarFila(fila.id, "totalCombustible", e.target.value)
                    }
                    className="border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-28"
                  />
                </td>

                {/* Estado Parcial */}
                <td className="px-3 py-2">
                  <input
                    type="text"
                    placeholder="Estado..."
                    value={fila.estadoParcial}
                    onChange={(e) =>
                      actualizarFila(fila.id, "estadoParcial", e.target.value)
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
};

export default TanqueCombustiblePage;