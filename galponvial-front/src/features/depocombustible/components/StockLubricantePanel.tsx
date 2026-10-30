import { useEffect, useState } from "react";
import {
  lubricanteEntradaService,
  type LubricanteStockItem,
} from "../services/lubricanteEntradaService";

type Borrador = { salida: string; fechaEstado: string };

const inputCls =
  "border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
const thCls = "px-3 py-3 text-left font-semibold text-gray-600";

const formatearFecha = (iso: string | null) => {
  if (!iso) return "-";
  const [y, m, d] = iso.slice(0, 10).split("-");
  return `${d}/${m}/${y}`;
};

const redondear = (n: number) => Math.round(n * 1000) / 1000;

export default function StockLubricantePanel({ puedeEscribir }: { puedeEscribir: boolean }) {
  const [filas, setFilas] = useState<LubricanteStockItem[]>([]);
  const [borradores, setBorradores] = useState<Record<number, Borrador>>({});
  const [cargando, setCargando] = useState(true);
  const [guardandoId, setGuardandoId] = useState<number | null>(null);

  const armarBorradores = (items: LubricanteStockItem[]) => {
    const b: Record<number, Borrador> = {};
    items.forEach((f) => {
      b[f.id] = { salida: String(f.cantidadSalida), fechaEstado: f.fechaEstado ?? "" };
    });
    return b;
  };

  useEffect(() => {
    lubricanteEntradaService
      .obtenerStock()
      .then((items) => {
        setFilas(items);
        setBorradores(armarBorradores(items));
      })
      .catch((err) => {
        console.error("Error al cargar el stock de lubricante:", err);
        alert("No se pudo cargar el stock.");
      })
      .finally(() => setCargando(false));
  }, []);

  const cambiar = (id: number, cambios: Partial<Borrador>) =>
    setBorradores((prev) => ({ ...prev, [id]: { ...prev[id], ...cambios } }));

  const guardar = async (fila: LubricanteStockItem) => {
    const b = borradores[fila.id];
    const salida = Number(b.salida);
    if (b.salida === "" || Number.isNaN(salida) || salida < 0) {
      alert("La cantidad de salida tiene que ser 0 o mayor.");
      return;
    }
    if (salida > fila.cantidadEntrada) {
      alert("La cantidad de salida no puede ser mayor que la cantidad de entrada.");
      return;
    }
    if (b.fechaEstado === "") {
      alert("Elegí la fecha del Estado Parcial.");
      return;
    }
    try {
      setGuardandoId(fila.id);
      const actualizada = await lubricanteEntradaService.guardarSalida(
        fila.id,
        salida,
        b.fechaEstado
      );
      setFilas((prev) => prev.map((f) => (f.id === fila.id ? actualizada : f)));
      setBorradores((prev) => ({
        ...prev,
        [fila.id]: {
          salida: String(actualizada.cantidadSalida),
          fechaEstado: actualizada.fechaEstado ?? "",
        },
      }));
      alert("Salida guardada correctamente.");
    } catch (err) {
      console.error("Error al guardar la salida de lubricante:", err);
      alert("No se pudo guardar la salida.");
    } finally {
      setGuardandoId(null);
    }
  };

  if (cargando) return <p className="text-sm text-gray-500">Cargando stock...</p>;

  return (
    <div className="bg-white rounded-xl shadow border border-gray-200 overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className={thCls}>Fecha</th>
            <th className={thCls}>Tipo</th>
            <th className={thCls}>Cantidad de entrada</th>
            <th className={thCls}>Cantidad de salida</th>
            <th className={thCls}>Fecha del Estado Parcial</th>
            <th className={thCls}>Estado Parcial</th>
            <th className="px-3 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {filas.length === 0 && (
            <tr>
              <td colSpan={7} className="px-3 py-6 text-center text-gray-500">
                Todavía no hay lubricante cargado en Agregar Lubricante.
              </td>
            </tr>
          )}
          {filas.map((fila) => {
            const b = borradores[fila.id] ?? { salida: "0", fechaEstado: "" };
            const salidaNum = Number(b.salida);
            const parcial = redondear(
              fila.cantidadEntrada - (Number.isNaN(salidaNum) ? 0 : salidaNum)
            );
            return (
              <tr key={fila.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-3 py-2">{formatearFecha(fila.fecha)}</td>
                <td className="px-3 py-2">{fila.tipo}</td>
                <td className="px-3 py-2">{fila.cantidadEntrada}</td>
                <td className="px-3 py-2">
                  {puedeEscribir ? (
                    <input
                      type="number"
                      min={0}
                      max={fila.cantidadEntrada}
                      value={b.salida}
                      onChange={(e) => cambiar(fila.id, { salida: e.target.value })}
                      className={`${inputCls} text-center w-28`}
                    />
                  ) : (
                    fila.cantidadSalida
                  )}
                </td>
                <td className="px-3 py-2">
                  {puedeEscribir ? (
                    <input
                      type="date"
                      value={b.fechaEstado}
                      onChange={(e) => cambiar(fila.id, { fechaEstado: e.target.value })}
                      className={inputCls}
                    />
                  ) : (
                    formatearFecha(fila.fechaEstado)
                  )}
                </td>
                <td className="px-3 py-2 font-semibold">{puedeEscribir ? parcial : fila.estadoParcial}</td>
                <td className="px-3 py-2 text-right">
                  {puedeEscribir && (
                    <button
                      onClick={() => guardar(fila)}
                      disabled={guardandoId === fila.id}
                      className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg shadow transition-colors disabled:opacity-50"
                    >
                      {guardandoId === fila.id ? "Guardando..." : "Guardar"}
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
