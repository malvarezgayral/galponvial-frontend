import { useState } from "react";

interface FilaLubricante {
  id: number;
  fecha: string;
  ordenRetiro: string;
  unidad: string;
  cantidad: number;
  tipo: string;
  observaciones: string;
}

const filaLubricanteVacia = (): Omit<FilaLubricante, "id"> => ({
  fecha: "",
  ordenRetiro: "",
  unidad: "",
  cantidad: 0,
  tipo: "",
  observaciones: "",
});

type Vista =
  | "visualizar-combustible"
  | "historial-combustible"
  | "lubricantes"
  | "visualizar-lubricantes"
  | "historial-lubricantes";

export default function DepoCombustiblePage() {
  const [filasLubricantes, setFilasLubricantes] = useState<FilaLubricante[]>([
    { id: 1, ...filaLubricanteVacia() },
  ]);
  const [vista, setVista] = useState<Vista>("visualizar-combustible");

  const actualizarFilaLubricante = (
    id: number,
    campo: keyof Omit<FilaLubricante, "id">,
    valor: string | number,
  ) => {
    setFilasLubricantes((prev) =>
      prev.map((fila) =>
        fila.id === id ? { ...fila, [campo]: valor } : fila
      ),
    );
  };

  const agregarFilaLubricante = () => {
    const nuevoId =
      filasLubricantes.length > 0
        ? Math.max(...filasLubricantes.map((f) => f.id)) + 1
        : 1;
    setFilasLubricantes((prev) => [
      ...prev,
      { id: nuevoId, ...filaLubricanteVacia() },
    ]);
  };

  const eliminarFilaLubricante = (id: number) => {
    if (filasLubricantes.length === 1) return;
    setFilasLubricantes((prev) => prev.filter((fila) => fila.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Depósito</h1>

        <div className="flex flex-wrap gap-3 mt-4">
          <button
            onClick={() => setVista("visualizar-combustible")}
            className={`px-5 py-2 rounded-lg text-white font-medium transition-colors ${
              vista === "visualizar-combustible" ? "bg-[#0062e3]" : "bg-gray-400 hover:bg-gray-500"
            }`}
          >
            Visualizar Combustible
          </button>

          <button
            onClick={() => setVista("historial-combustible")}
            className={`px-5 py-2 rounded-lg text-white font-medium transition-colors ${
              vista === "historial-combustible" ? "bg-[#0062e3]" : "bg-gray-400 hover:bg-gray-500"
            }`}
          >
            Historial de Combustible
          </button>

          <button
            onClick={() => setVista("lubricantes")}
            className={`px-5 py-2 rounded-lg text-white font-medium transition-colors ${
              vista === "lubricantes" ? "bg-[#0062e3]" : "bg-gray-400 hover:bg-gray-500"
            }`}
          >
            Lubricantes
          </button>

          <button
            onClick={() => setVista("visualizar-lubricantes")}
            className={`px-5 py-2 rounded-lg text-white font-medium transition-colors ${
              vista === "visualizar-lubricantes" ? "bg-[#0062e3]" : "bg-gray-400 hover:bg-gray-500"
            }`}
          >
            Visualizar Lubricantes
          </button>

          <button
            onClick={() => setVista("historial-lubricantes")}
            className={`px-5 py-2 rounded-lg text-white font-medium transition-colors ${
              vista === "historial-lubricantes" ? "bg-[#0062e3]" : "bg-gray-400 hover:bg-gray-500"
            }`}
          >
            Historial Lubricantes
          </button>
        </div>
      </div>

      {vista === "visualizar-combustible" && (
        <div className="bg-white rounded-xl shadow border border-gray-200 p-6 text-gray-400 text-sm">
          Visualizar Combustible — en construcción.
        </div>
      )}

      {vista === "historial-combustible" && (
        <div className="bg-white rounded-xl shadow border border-gray-200 p-6 text-gray-400 text-sm">
          Historial de Combustible — en construcción.
        </div>
      )}

      {vista === "lubricantes" && (
        <div className="bg-white rounded-xl shadow border border-gray-200 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-3 py-3 text-left font-semibold text-gray-600">Fecha</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-600">N° Orden de Retiro</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-600">Unidad</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-600">Cantidad</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-600">Tipo</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-600">Observaciones</th>
                <th className="px-3 py-3 text-center font-semibold text-gray-600">Eliminar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filasLubricantes.map((fila) => (
                <tr key={fila.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2">
                    <input
                      type="date"
                      value={fila.fecha}
                      onChange={(e) => actualizarFilaLubricante(fila.id, "fecha", e.target.value)}
                      className="border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-36"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      placeholder="N° Orden"
                      value={fila.ordenRetiro}
                      onChange={(e) => actualizarFilaLubricante(fila.id, "ordenRetiro", e.target.value)}
                      className="border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-36"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      placeholder="Unidad"
                      value={fila.unidad}
                      onChange={(e) => actualizarFilaLubricante(fila.id, "unidad", e.target.value)}
                      className="border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-40"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      min={0}
                      value={fila.cantidad}
                      onChange={(e) => actualizarFilaLubricante(fila.id, "cantidad", Math.max(0, Number(e.target.value)))}
                      className="border border-gray-300 rounded-md px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500 w-24"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      placeholder="Tipo de lubricante"
                      value={fila.tipo}
                      onChange={(e) => actualizarFilaLubricante(fila.id, "tipo", e.target.value)}
                      className="border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-40"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <textarea
                      placeholder="Observaciones..."
                      value={fila.observaciones}
                      onChange={(e) => actualizarFilaLubricante(fila.id, "observaciones", e.target.value)}
                      rows={1}
                      className="border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 resize-y min-h-[36px]"
                    />
                  </td>
                  <td className="px-3 py-2 text-center">
                    <button
                      onClick={() => eliminarFilaLubricante(fila.id)}
                      disabled={filasLubricantes.length === 1}
                      title="Eliminar fila"
                      className="w-7 h-7 rounded-md bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center mx-auto transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-4">
            <button
              onClick={agregarFilaLubricante}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow transition-colors"
            >
              <span className="text-lg leading-none">+</span> Agregar Registro
            </button>
          </div>
        </div>
      )}

      {vista === "visualizar-lubricantes" && (
        <div className="bg-white rounded-xl shadow border border-gray-200 p-6 text-gray-400 text-sm">
          Visualizar Lubricantes — en construcción.
        </div>
      )}

      {vista === "historial-lubricantes" && (
        <div className="bg-white rounded-xl shadow border border-gray-200 p-6 text-gray-400 text-sm">
          Historial Lubricantes — en construcción.
        </div>
      )}
    </div>
  );
}
