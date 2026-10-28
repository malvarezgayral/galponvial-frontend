import { useState } from "react";
import { filtroServiceService } from "../services/filtroServiceService";
import type { Vehiculo } from "../../vehiculos/types";
import { useAdminPermissions } from "../../usuarios/hooks/useAdminPermissions";

type Fila = {
  id: number;
  idVehiculo: number;
  fecha: string;
  tipoFiltro: string;
  codigo: string;
  cantidad: string;
};

const filaVacia = (): Fila => ({
  id: -Date.now() - Math.floor(Math.random() * 1000),
  idVehiculo: 0,
  fecha: "",
  tipoFiltro: "",
  codigo: "",
  cantidad: "",
});

const inputCls =
  "border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
const thCls = "px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap";

export default function AgregarFiltroPanel({ vehiculos }: { vehiculos: Vehiculo[] }) {
  const { isAdmin } = useAdminPermissions();
  const [filas, setFilas] = useState<Fila[]>([filaVacia()]);
  const [guardando, setGuardando] = useState(false);

  const actualizar = (id: number, cambios: Partial<Fila>) =>
    setFilas((prev) => prev.map((f) => (f.id === id ? { ...f, ...cambios } : f)));

  const agregarFila = () => setFilas((prev) => [...prev, filaVacia()]);

  const guardar = async () => {
    const pendientes = filas.filter(
      (f) => f.idVehiculo > 0 || f.tipoFiltro.trim() !== ""
    );
    if (pendientes.length === 0) {
      alert("Completá al menos una fila para guardar.");
      return;
    }
    const incompleta = pendientes.find(
      (f) => f.idVehiculo <= 0 || f.tipoFiltro.trim() === "" || Number(f.cantidad) < 1
    );
    if (incompleta) {
      alert("Cada fila necesita Vehículo, Tipo de filtro y una Cantidad de 1 o más.");
      return;
    }
    try {
      setGuardando(true);
      await filtroServiceService.crear(
        pendientes.map((f) => ({
          idVehiculo: f.idVehiculo,
          fecha: f.fecha || undefined,
          tipoFiltro: f.tipoFiltro.trim(),
          codigo: f.codigo.trim() || undefined,
          cantidad: Math.floor(Number(f.cantidad)),
        }))
      );
      setFilas([filaVacia()]);
      alert("Registros guardados correctamente.");
    } catch (err) {
      console.error("Error al guardar los filtros:", err);
      alert("No se pudieron guardar los registros.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow border border-gray-200 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className={thCls}>Vehículo</th>
              <th className={thCls}>Fecha</th>
              <th className={thCls}>Tipo de filtro</th>
              <th className={thCls}>Código</th>
              <th className={thCls}>Cantidad</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filas.map((fila) => (
              <tr key={fila.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-3 py-2">
                  <select
                    value={fila.idVehiculo}
                    onChange={(e) => actualizar(fila.id, { idVehiculo: Number(e.target.value) })}
                    className={`${inputCls} w-48`}
                  >
                    <option value={0}>— Seleccionar —</option>
                    {vehiculos.map((v) => (
                      <option key={v.id_vehiculo} value={v.id_vehiculo}>
                        {v.nombre} {v.codigo ? `(${v.codigo})` : ""}
                      </option>
                    ))}
                  </select>
                </td>
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
                    value={fila.tipoFiltro}
                    onChange={(e) => actualizar(fila.id, { tipoFiltro: e.target.value })}
                    className={`${inputCls} w-48`}
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="text"
                    value={fila.codigo}
                    onChange={(e) => actualizar(fila.id, { codigo: e.target.value })}
                    className={`${inputCls} w-40`}
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    min={1}
                    value={fila.cantidad}
                    onChange={(e) => actualizar(fila.id, { cantidad: e.target.value })}
                    className={`${inputCls} w-24`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isAdmin() && (
        <div className="flex gap-3">
          <button
            onClick={agregarFila}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow transition-colors"
          >
            <span className="text-lg leading-none">+</span> Agregar Registro
          </button>
          <button
            onClick={guardar}
            disabled={guardando}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg shadow transition-colors"
          >
            Guardar todo
          </button>
        </div>
      )}
    </>
  );
}
