import { useEffect, useState } from "react";
import {
  lubricanteEntradaService,
  type LubricanteHistorialItem,
} from "../services/lubricanteEntradaService";

const thCls = "px-3 py-3 text-left font-semibold text-gray-600";

const formatearFecha = (iso: string) => {
  const [y, m, d] = iso.slice(0, 10).split("-");
  return `${d}/${m}/${y}`;
};

export default function ListadoStockLubricantePanel() {
  const [filas, setFilas] = useState<LubricanteHistorialItem[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    lubricanteEntradaService
      .obtenerHistorial()
      .then(setFilas)
      .catch((err) => {
        console.error("Error al cargar el historial de stock:", err);
        alert("No se pudo cargar el listado.");
      })
      .finally(() => setCargando(false));
  }, []);

  if (cargando) return <p className="text-sm text-gray-500">Cargando listado...</p>;

  return (
    <div className="bg-white rounded-xl shadow border border-gray-200 overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className={thCls}>Fecha del Estado Parcial</th>
            <th className={thCls}>Tipo</th>
            <th className={thCls}>Cantidad de entrada</th>
            <th className={thCls}>Cantidad de salida</th>
            <th className={thCls}>Estado Parcial</th>
            <th className={thCls}>Cargado el</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {filas.length === 0 && (
            <tr>
              <td colSpan={6} className="px-3 py-6 text-center text-gray-500">
                Todavía no se guardó ninguna salida.
              </td>
            </tr>
          )}
          {filas.map((f) => (
            <tr key={f.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-3 py-2">{formatearFecha(f.fechaEstado)}</td>
              <td className="px-3 py-2">{f.tipo}</td>
              <td className="px-3 py-2">{f.cantidadEntrada}</td>
              <td className="px-3 py-2">{f.cantidadSalida}</td>
              <td className="px-3 py-2 font-semibold">{f.estadoParcial}</td>
              <td className="px-3 py-2">{new Date(f.createdAt).toLocaleString("es-AR")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
