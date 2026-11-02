import { useEffect, useState } from "react";
import {
  lubricanteEntradaService,
  type LubricanteHistorialItem,
} from "../services/lubricanteEntradaService";
import { useAdminPermissions } from "@/features/usuarios/hooks/useAdminPermissions";

const thCls = "px-3 py-3 text-left font-semibold text-gray-600";

const formatearFecha = (iso: string) => {
  const [y, m, d] = iso.slice(0, 10).split("-");
  return `${d}/${m}/${y}`;
};

export default function ListadoStockLubricantePanel() {
  const [filas, setFilas] = useState<LubricanteHistorialItem[]>([]);
  const { isSuperAdmin } = useAdminPermissions();
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

  const eliminar = async (f: LubricanteHistorialItem) => {
    const ok = window.confirm(
      `¿Eliminar este renglón del listado?\n${f.tipo} - ${formatearFecha(f.fechaEstado)}\nNo se puede deshacer.`,
    );
    if (!ok) return;
    try {
      await lubricanteEntradaService.eliminarHistorial(f.id);
      setFilas((prev) => prev.filter((x) => x.id !== f.id));
    } catch (err) {
      console.error("Error al eliminar el renglón del listado:", err);
      alert("No se pudo eliminar el renglón.");
    }
  };

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
            {isSuperAdmin() && <th className={thCls}>Acciones</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {filas.length === 0 && (
            <tr>
              <td colSpan={7} className="px-3 py-6 text-center text-gray-500">
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
              {isSuperAdmin() && (
                <td className="px-3 py-2">
                  <button
                    type="button"
                    onClick={() => eliminar(f)}
                    className="px-3 py-1 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded hover:bg-red-100"
                  >
                    Eliminar
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
