import { useEffect, useState } from "react";
import {
  lubricanteEntradaService,
  type LubricanteCargaItem,
} from "../services/lubricanteEntradaService";

const thCls = "px-3 py-3 text-left font-semibold text-gray-600";
const inputCls =
  "w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

const formatearFecha = (iso: string) => {
  const [y, m, d] = iso.slice(0, 10).split("-");
  return `${d}/${m}/${y}`;
};

/** Usa el mensaje del back si viene (por ejemplo, "ya tiene salidas registradas"). */
const mensajeError = (err: unknown, porDefecto: string): string => {
  const msg = (err as { response?: { data?: { message?: unknown } } })?.response?.data?.message;
  if (Array.isArray(msg)) return msg.join("\n");
  if (typeof msg === "string" && msg.trim() !== "") return msg;
  return porDefecto;
};

interface Borrador {
  fecha: string;
  tipo: string;
  nroRemito: string;
  cantidad: string;
}

export default function EditarLubricantePanel() {
  const [filas, setFilas] = useState<LubricanteCargaItem[]>([]);
  const [cargando, setCargando] = useState(true);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [borrador, setBorrador] = useState<Borrador | null>(null);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    lubricanteEntradaService
      .obtenerCargas()
      .then(setFilas)
      .catch((err) => {
        console.error("Error al cargar los lubricantes:", err);
        alert("No se pudo cargar el listado de lubricantes.");
      })
      .finally(() => setCargando(false));
  }, []);

  const empezarEdicion = (f: LubricanteCargaItem) => {
    setEditandoId(f.id);
    setBorrador({
      fecha: f.fecha.slice(0, 10),
      tipo: f.tipo,
      nroRemito: f.nroRemito ?? "",
      cantidad: String(f.cantidad),
    });
  };

  const cancelar = () => {
    setEditandoId(null);
    setBorrador(null);
  };

  const cambiar = (campo: keyof Borrador, valor: string) =>
    setBorrador((prev) => (prev ? { ...prev, [campo]: valor } : prev));

  const guardar = async (f: LubricanteCargaItem) => {
    if (!borrador) return;
    const cantidad = Number(borrador.cantidad.replace(",", "."));
    const remito = borrador.nroRemito.trim();
    if (!borrador.fecha) return alert("Elegí la fecha.");
    if (borrador.tipo.trim() === "") return alert("Completá el tipo de lubricante.");
    if (remito !== "" && !/^\d+$/.test(remito)) return alert("El N° de remito tiene que tener solo números.");
    if (!Number.isFinite(cantidad) || cantidad <= 0) return alert("La cantidad tiene que ser mayor que 0.");
    if (cantidad < f.cantidadSalida) {
      return alert(`La cantidad no puede ser menor que lo que ya salió (${f.cantidadSalida} L).`);
    }
    try {
      setGuardando(true);
      await lubricanteEntradaService.actualizar(f.id, {
        fecha: borrador.fecha,
        tipo: borrador.tipo.trim(),
        nroRemito: remito || undefined,
        cantidad,
      });
      setFilas(await lubricanteEntradaService.obtenerCargas());
      cancelar();
    } catch (err) {
      console.error("Error al guardar la edición del lubricante:", err);
      alert(mensajeError(err, "No se pudo guardar la edición."));
    } finally {
      setGuardando(false);
    }
  };

  const eliminar = async (f: LubricanteCargaItem) => {
    if (f.cantidadSalida > 0) {
      alert("No se puede eliminar porque ya tiene salidas registradas.");
      return;
    }
    const ok = window.confirm(
      `¿Eliminar este lubricante?\n${f.tipo} - ${f.cantidad} L - ${formatearFecha(f.fecha)}\nNo se puede deshacer.`,
    );
    if (!ok) return;
    try {
      await lubricanteEntradaService.eliminar(f.id);
      setFilas((prev) => prev.filter((x) => x.id !== f.id));
      if (editandoId === f.id) cancelar();
    } catch (err) {
      console.error("Error al eliminar el lubricante:", err);
      alert(mensajeError(err, "No se pudo eliminar el lubricante."));
    }
  };

  if (cargando) return <p className="text-sm text-gray-500">Cargando lubricantes...</p>;

  return (
    <div className="bg-white rounded-xl shadow border border-gray-200 overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className={thCls}>Fecha</th>
            <th className={thCls}>Tipo</th>
            <th className={thCls}>N° de Remito</th>
            <th className={thCls}>Cantidad (L)</th>
            <th className={thCls}>Salida (L)</th>
            <th className={thCls}>Cargado por</th>
            <th className={thCls}>Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {filas.length === 0 && (
            <tr>
              <td colSpan={7} className="px-3 py-6 text-center text-gray-500">
                Todavía no hay lubricantes cargados en Agregar Lubricante.
              </td>
            </tr>
          )}
          {filas.map((f) =>
            editandoId === f.id && borrador ? (
              <tr key={f.id} className="bg-blue-50">
                <td className="px-3 py-2">
                  <input type="date" value={borrador.fecha} onChange={(e) => cambiar("fecha", e.target.value)} className={inputCls} />
                </td>
                <td className="px-3 py-2">
                  <input type="text" maxLength={100} value={borrador.tipo} onChange={(e) => cambiar("tipo", e.target.value)} className={inputCls} />
                </td>
                <td className="px-3 py-2">
                  <input type="text" inputMode="numeric" maxLength={50} placeholder="Solo números" value={borrador.nroRemito} onChange={(e) => cambiar("nroRemito", e.target.value)} className={inputCls} />
                </td>
                <td className="px-3 py-2">
                  <input type="number" min={0} step="any" value={borrador.cantidad} onChange={(e) => cambiar("cantidad", e.target.value)} className={inputCls} />
                </td>
                <td className="px-3 py-2">{f.cantidadSalida}</td>
                <td className="px-3 py-2">{f.creadoPor ?? "—"}</td>
                <td className="px-3 py-2">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => guardar(f)}
                      disabled={guardando}
                      className="px-3 py-1 text-xs font-medium text-white bg-[#0062e3] rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                      {guardando ? "Guardando..." : "Guardar"}
                    </button>
                    <button
                      type="button"
                      onClick={cancelar}
                      disabled={guardando}
                      className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200"
                    >
                      Cancelar
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              <tr key={f.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-3 py-2">{formatearFecha(f.fecha)}</td>
                <td className="px-3 py-2">{f.tipo}</td>
                <td className="px-3 py-2">{f.nroRemito ?? "—"}</td>
                <td className="px-3 py-2">{f.cantidad}</td>
                <td className="px-3 py-2">{f.cantidadSalida}</td>
                <td className="px-3 py-2">{f.creadoPor ?? "—"}</td>
                <td className="px-3 py-2">
                  {!f.puedeEditar && !f.puedeEliminar ? (
                    <span className="text-gray-400">—</span>
                  ) : (
                    <div className="flex gap-2">
                      {f.puedeEditar && (
                        <button
                          type="button"
                          onClick={() => empezarEdicion(f)}
                          disabled={editandoId !== null}
                          className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 disabled:opacity-50"
                        >
                          Editar
                        </button>
                      )}
                      {f.puedeEliminar && (
                        <button
                          type="button"
                          onClick={() => eliminar(f)}
                          className="px-3 py-1 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded hover:bg-red-100"
                        >
                          Eliminar
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ),
          )}
        </tbody>
      </table>
    </div>
  );
}
