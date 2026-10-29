import { useState } from "react";
import { lubricanteEntradaService } from "../services/lubricanteEntradaService";

type Fila = {
  id: number;
  fecha: string;
  tipo: string;
  nroRemito: string;
  cantidad: string;
};

const filaVacia = (): Fila => ({
  id: -Date.now() - Math.floor(Math.random() * 1000),
  fecha: "",
  tipo: "",
  nroRemito: "",
  cantidad: "",
});

const inputCls =
  "border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
const thCls = "px-3 py-3 text-left font-semibold text-gray-600";

export default function AgregarLubricantePanel() {
  const [filas, setFilas] = useState<Fila[]>([filaVacia()]);
  const [guardando, setGuardando] = useState(false);

  const actualizar = (id: number, cambios: Partial<Fila>) =>
    setFilas((prev) => prev.map((f) => (f.id === id ? { ...f, ...cambios } : f)));

  const agregarFila = () => setFilas((prev) => [...prev, filaVacia()]);

  const quitarFila = (id: number) => {
    if (filas.length === 1) return;
    setFilas((prev) => prev.filter((f) => f.id !== id));
  };

  const guardar = async () => {
    const pendientes = filas.filter(
      (f) => f.fecha !== "" || f.tipo.trim() !== "" || f.nroRemito !== "" || f.cantidad !== ""
    );
    if (pendientes.length === 0) {
      alert("Completá al menos una fila para guardar.");
      return;
    }
    const incompleta = pendientes.find(
      (f) => f.fecha === "" || f.tipo.trim() === "" || !(Number(f.cantidad) > 0)
    );
    if (incompleta) {
      alert("Cada fila necesita Fecha, Tipo y una Cantidad de entrada mayor a 0.");
      return;
    }
    try {
      setGuardando(true);
      await lubricanteEntradaService.crear(
        pendientes.map((f) => ({
          fecha: f.fecha,
          tipo: f.tipo.trim(),
          nroRemito: f.nroRemito || undefined,
          cantidad: Number(f.cantidad),
        }))
      );
      setFilas([filaVacia()]);
      alert("Registros guardados correctamente.");
    } catch (err) {
      console.error("Error al guardar las entradas de lubricante:", err);
      alert("No se pudieron guardar los registros.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow border border-gray-200 overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className={thCls}>Fecha</th>
            <th className={thCls}>Tipo</th>
            <th className={thCls}>N° de Remito</th>
            <th className={thCls}>Cantidad de entrada</th>
            <th className="px-3 py-3 text-right font-semibold text-gray-600"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {filas.map((fila) => (
            <tr key={fila.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-3 py-2">
                <input
                  type="date"
                  value={fila.fecha}
                  onChange={(e) => actualizar(fila.id, { fecha: e.target.value })}
                  className={inputCls}
                />
              </td>
              <td className="px-3 py-2">
                <input
                  type="text"
                  placeholder="Tipo de lubricante"
                  value={fila.tipo}
                  onChange={(e) => actualizar(fila.id, { tipo: e.target.value })}
                  className={`${inputCls} w-48`}
                />
              </td>
              <td className="px-3 py-2">
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Solo números"
                  value={fila.nroRemito}
                  onChange={(e) =>
                    actualizar(fila.id, { nroRemito: e.target.value.replace(/\D/g, "") })
                  }
                  className={`${inputCls} w-40`}
                />
              </td>
              <td className="px-3 py-2">
                <input
                  type="number"
                  min={0}
                  value={fila.cantidad}
                  onChange={(e) => actualizar(fila.id, { cantidad: e.target.value })}
                  className={`${inputCls} text-center w-28`}
                />
              </td>
              <td className="px-3 py-2 text-right">
                {filas.length > 1 && (
                  <button
                    onClick={() => quitarFila(fila.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    ✕
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="p-4 flex gap-3">
        <button
          onClick={agregarFila}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow transition-colors"
        >
          <span className="text-lg leading-none">+</span> Agregar Registro
        </button>
        <button
          onClick={guardar}
          disabled={guardando}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg shadow transition-colors disabled:opacity-50"
        >
          {guardando ? "Guardando..." : "Guardar todo"}
        </button>
      </div>
    </div>
  );
}
