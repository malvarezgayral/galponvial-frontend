import { useEffect, useState } from "react";
import { filtroServiceService } from "../services/filtroServiceService";
import type { FiltroServiceRegistro } from "../services/filtroServiceService";
import type { Vehiculo } from "../../vehiculos/types";
import { useAdminPermissions } from "../../usuarios/hooks/useAdminPermissions";

type Borrador = {
  idVehiculo: number;
  fecha: string;
  tipoFiltro: string;
  codigo: string;
  cantidad: string;
};

const inputCls =
  "border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
const thCls = "px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap";

export default function ListadoFiltrosPanel({ vehiculos }: { vehiculos: Vehiculo[] }) {
  const { isAdmin, isSuperAdmin } = useAdminPermissions();
  const puedeEditar = isAdmin();
  const puedeEliminar = isSuperAdmin();
  const mostrarAcciones = puedeEditar || puedeEliminar;

  const [registros, setRegistros] = useState<FiltroServiceRegistro[]>([]);
  const [cargando, setCargando] = useState(true);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [borrador, setBorrador] = useState<Borrador | null>(null);
  const [guardando, setGuardando] = useState(false);

  const cargar = async () => {
    try {
      setRegistros(await filtroServiceService.obtenerTodos());
    } catch (err) {
      console.error("Error al cargar el listado de filtros:", err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const nombreVehiculo = (r: FiltroServiceRegistro): string => {
    const v = r.vehiculoRef;
    if (!v) return "—";
    return `${v.nombre ?? ""} ${v.codigo ? `(${v.codigo})` : ""}`.trim() || "—";
  };

  const iniciarEdicion = (r: FiltroServiceRegistro) => {
    setEditandoId(r.id);
    setBorrador({
      idVehiculo: r.idVehiculo ?? 0,
      fecha: r.fecha ?? "",
      tipoFiltro: r.tipoFiltro,
      codigo: r.codigo ?? "",
      cantidad: String(r.cantidad),
    });
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setBorrador(null);
  };

  const guardarEdicion = async () => {
    if (editandoId === null || !borrador) return;
    if (borrador.idVehiculo <= 0 || borrador.tipoFiltro.trim() === "" || Number(borrador.cantidad) < 1) {
      alert("Se necesita Vehículo, Tipo de filtro y una Cantidad de 1 o más.");
      return;
    }
    try {
      setGuardando(true);
      await filtroServiceService.actualizar(editandoId, {
        idVehiculo: borrador.idVehiculo,
        fecha: borrador.fecha || undefined,
        tipoFiltro: borrador.tipoFiltro.trim(),
        codigo: borrador.codigo.trim() || undefined,
        cantidad: Math.floor(Number(borrador.cantidad)),
      });
      cancelarEdicion();
      await cargar();
    } catch (err) {
      console.error("Error al editar el filtro:", err);
      alert("No se pudo guardar el cambio.");
    } finally {
      setGuardando(false);
    }
  };

  const eliminar = async (r: FiltroServiceRegistro) => {
    if (!window.confirm(`¿Eliminar el filtro "${r.tipoFiltro}" de ${nombreVehiculo(r)}? Esta acción no se puede deshacer.`)) {
      return;
    }
    try {
      await filtroServiceService.eliminar(r.id);
      setRegistros((prev) => prev.filter((x) => x.id !== r.id));
    } catch (err) {
      console.error("Error al eliminar el filtro:", err);
      alert("No se pudo eliminar el registro.");
    }
  };

  if (cargando) {
    return (
      <div className="bg-white rounded-xl shadow border border-gray-200 p-6 text-gray-400 text-sm">
        Cargando listado de filtros...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow border border-gray-200 overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className={thCls}>Vehículo</th>
            <th className={thCls}>Fecha</th>
            <th className={thCls}>Tipo de filtro</th>
            <th className={thCls}>Código</th>
            <th className={thCls}>Cantidad</th>
            {mostrarAcciones && <th className={thCls}>Acciones</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {registros.map((r) =>
            editandoId === r.id && borrador ? (
              <tr key={r.id} className="bg-blue-50">
                <td className="px-3 py-2">
                  <select
                    value={borrador.idVehiculo}
                    onChange={(e) => setBorrador({ ...borrador, idVehiculo: Number(e.target.value) })}
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
                    value={borrador.fecha}
                    onChange={(e) => setBorrador({ ...borrador, fecha: e.target.value })}
                    className={inputCls}
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="text"
                    value={borrador.tipoFiltro}
                    onChange={(e) => setBorrador({ ...borrador, tipoFiltro: e.target.value })}
                    className={`${inputCls} w-44`}
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="text"
                    value={borrador.codigo}
                    onChange={(e) => setBorrador({ ...borrador, codigo: e.target.value })}
                    className={`${inputCls} w-36`}
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    min={1}
                    value={borrador.cantidad}
                    onChange={(e) => setBorrador({ ...borrador, cantidad: e.target.value })}
                    className={`${inputCls} w-20`}
                  />
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <div className="flex gap-2">
                    <button
                      onClick={guardarEdicion}
                      disabled={guardando}
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white text-xs font-medium rounded-md"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={cancelarEdicion}
                      className="px-3 py-1 bg-gray-400 hover:bg-gray-500 text-white text-xs font-medium rounded-md"
                    >
                      Cancelar
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-3 py-2">{nombreVehiculo(r)}</td>
                <td className="px-3 py-2">{r.fecha ?? "—"}</td>
                <td className="px-3 py-2">{r.tipoFiltro}</td>
                <td className="px-3 py-2">{r.codigo ?? "—"}</td>
                <td className="px-3 py-2">{r.cantidad}</td>
                {mostrarAcciones && (
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="flex gap-2">
                      {puedeEditar && (
                        <button
                          onClick={() => iniciarEdicion(r)}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md"
                        >
                          Editar
                        </button>
                      )}
                      {puedeEliminar && (
                        <button
                          onClick={() => eliminar(r)}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-md"
                        >
                          Eliminar
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            )
          )}
          {registros.length === 0 && (
            <tr>
              <td colSpan={mostrarAcciones ? 6 : 5} className="px-3 py-6 text-center text-gray-500">
                Todavía no hay filtros registrados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
